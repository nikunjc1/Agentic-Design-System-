// Local website and acknowledged Figma job bridge. No packages or credentials required.
const http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..'),MODEL_FILE=require.resolve('../component-contract-model.js');
function createBridge({timeout=600000,modelFile=MODEL_FILE,staleJobMs=45000}={}){
 const pending=new Map(),completed=new Map(),queue=[],waiters=new Set();let lastSeen=0,consumer=null;
 const connected=()=>Boolean(consumer)&&Date.now()-lastSeen<35000;
 // How long a push job may go without ANY signal (dispatched/progress/
 // result) before it's treated as abandoned rather than "really running".
 // Previously a stuck job blocked every future "Draw in Figma" click
 // (own first error) until the full 10-minute job timeout, which then
 // left a permanently-blocking 'uncertain' record requiring a manual
 // bridge restart either way - the user never got an automatic recovery,
 // only an ever-escalating error message. Configurable (not a bare
 // constant) so tests can use a short window instead of waiting 45s.
 const STALE_JOB_MS=staleJobMs;
 const snapshot=job=>({jobId:job.jobId,operation:job.operation,status:job.status,phase:job.phase,result:job.result,error:job.error});
 function remember(job){completed.set(job.jobId,job);while(completed.size>40)completed.delete(completed.keys().next().value);}
 function dispatch(){for(const waiter of [...waiters]){if(!queue.length)break;const job=queue.shift(),entry=pending.get(job.jobId);if(!entry)continue;waiters.delete(waiter);clearTimeout(waiter.timer);entry.status='running';entry.phase='Dispatched to plugin';entry.lastActivity=Date.now();waiter.send(200,job);}}
 let model,modelSource;
 // Development servers can outlive edits to the contract schema. Requiring
 // once at startup kept rejecting new Input attributes until Node restarted.
 async function currentModel(){
  const moduleId=require.resolve(modelFile),source=await fs.readFile(moduleId,'utf8');
  if(!model||source!==modelSource){delete require.cache[moduleId];model=require(moduleId);modelSource=source;}
  return model;
 }
 const server=http.createServer(async(req,res)=>{
  const origin=req.headers.origin;
  const allowed=!origin||origin==='null'||/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin);
  if(!allowed){res.writeHead(403).end('Origin not allowed');return;}
  if(origin)res.setHeader('Access-Control-Allow-Origin',origin==='null'?'*':origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Private-Network','true');
  if(req.method==='OPTIONS'){res.writeHead(204).end();return;}
  const url=new URL(req.url,'http://127.0.0.1'),send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(value));};
  // 8 MB was sized for one component's own push. A catalog export bundles
  // every selected component plus the Foundation token set in one request -
  // legitimately larger, and the per-item token duplication a single push
  // never had to worry about is now stripped client-side (see shell.js
  // exportCatalog), but a heavily customized Foundation (uploaded fonts/
  // icons, each allowed a few MB) can still push even a deduplicated
  // catalog payload well past 8 MB. 64 MB keeps real protection against a
  // runaway/malformed request while covering that realistic case.
  async function body(){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>64000000)throw new Error('Contract exceeds the 64 MB limit.');chunks.push(chunk);}return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}');}
  try{
   if(url.pathname==='/bridge/status'){send(200,{protocolVersion:2,project:'Agentic Design System 2',connected:connected(),consumer,pending:pending.size,jobs:[...pending.values()].map(snapshot)});return;}
   if(url.pathname==='/bridge/connect'&&req.method==='POST'){const client=await body();if(typeof client.clientId!=='string'||typeof client.build!=='string'){send(400,{error:'Plugin identity is required.'});return;}if(consumer&&consumer.clientId!==client.clientId)for(const waiter of [...waiters]){clearTimeout(waiter.timer);waiters.delete(waiter);waiter.send(409,{error:'Plugin connection replaced. Reconnect only the intended plugin.'});}consumer={clientId:client.clientId,build:client.build};lastSeen=Date.now();send(200,{protocolVersion:2,connected:true,project:'Agentic Design System 2'});return;}
   if(url.pathname==='/bridge/next'&&req.method==='GET'){
    const clientId=url.searchParams.get('clientId');if(clientId&&!consumer){send(409,{error:'The bridge restarted. Click Connect / Retry in the plugin.'});return;}if(consumer&&clientId!==consumer.clientId){send(409,{error:'Another plugin runtime owns this connection. Reconnect the intended plugin.'});return;}
    lastSeen=Date.now();const job=queue.shift();if(job){const entry=pending.get(job.jobId);if(entry){entry.status='running';entry.phase='Dispatched to plugin';entry.lastActivity=Date.now();}send(200,job);return;}
    const wait=Math.min(20000,Math.max(0,Number(url.searchParams.get('wait'))||0));if(!wait){send(200,null);return;}
    const waiter={send,timer:null};waiter.timer=setTimeout(()=>{waiters.delete(waiter);send(200,null);},wait);waiters.add(waiter);res.on('close',()=>{clearTimeout(waiter.timer);waiters.delete(waiter);});return;
   }
   if(url.pathname.startsWith('/contracts/jobs/')&&req.method==='GET'){const job=pending.get(url.pathname.split('/').pop())||completed.get(url.pathname.split('/').pop());send(job?200:404,job?snapshot(job):{error:'Job not found. Inspect Figma before retrying.'});return;}
   if(url.pathname==='/bridge/progress'&&req.method==='POST'){const update=await body(),job=pending.get(update.jobId);if(job){if(typeof update.phase==='string')job.phase=update.phase.slice(0,160);job.lastActivity=Date.now();}lastSeen=Date.now();send(200,{accepted:Boolean(job)});return;}
   if(url.pathname==='/bridge/result'&&req.method==='POST'){
    const result=await body(),job=pending.get(result.jobId)||completed.get(result.jobId);if(!job){send(404,{error:'Job expired or already completed.'});return;}
    if(['succeeded','failed'].includes(job.status)){send(200,{accepted:true,duplicate:true});return;}
    clearTimeout(job.timer);pending.delete(result.jobId);job.status=result.error?'failed':'succeeded';job.phase=result.error?'Failed':'Completed';job.result=result.result;job.error=result.error;remember(job);if(job.send){job.send(result.error?422:200,result.error?{error:result.error}:result.result);job.send=null;}lastSeen=Date.now();send(200,{accepted:true});return;
   }
   if(req.method==='POST'&&['/draw','/contracts/push','/contracts/pull','/contracts/inspect','/contracts/ping','/contracts/jobs'].includes(url.pathname)){
    if(pending.size>=20){send(429,{error:'The bridge queue is full. Wait for the plugin to finish.'});return;}
    const payload=await body(),asynchronous=url.pathname==='/contracts/jobs',operation=asynchronous?payload.operation:url.pathname==='/contracts/pull'?'pull':url.pathname==='/contracts/inspect'?'inspect':url.pathname==='/contracts/ping'?'ping':'push',contract=payload.contract||payload;
    if(!['push','pull','inspect','ping','preview','configure','pushCatalog'].includes(operation)){send(400,{error:'Unsupported operation.'});return;}
    if(asynchronous&&!connected()){send(503,{error:'Agentic Contract Bridge is disconnected. Open the plugin and click Connect before drawing.'});return;}
    if(asynchronous&&operation==='push'){
     // "Really running" means a signal (dispatch/progress/result) arrived
     // within the last STALE_JOB_MS - not merely that a job record still
     // exists. A genuinely slow push (still reporting progress) keeps
     // blocking correctly; one that's gone quiet (plugin closed, crashed,
     // or never even confirmed completion) is cleared automatically
     // instead of requiring a manual bridge restart either way.
     const staleEnough=job=>Date.now()-(job.lastActivity||0)>STALE_JOB_MS;
     const activePush=[...pending.values()].find(job=>job.operation==='push');
     if(activePush){
      if(!staleEnough(activePush)){send(409,{error:'A component draw is already in progress. Wait for it to finish before drawing again.'});return;}
      clearTimeout(activePush.timer);pending.delete(activePush.jobId);
      const queuedIndex=queue.findIndex(j=>j.jobId===activePush.jobId);if(queuedIndex>=0)queue.splice(queuedIndex,1);
      activePush.status='failed';activePush.phase='Abandoned (no response from plugin)';activePush.error='No progress or result from the Figma plugin for over 45 seconds. Cleared automatically so new draws are not blocked.';remember(activePush);
     }
     const uncertainPush=[...completed.values()].find(job=>job.operation==='push'&&job.status==='uncertain');
     if(uncertainPush){
      // Still within the grace window - a late /bridge/result for this
      // exact job can still arrive and must be honored (see "late native
      // completion" test), so a second draw stays blocked a little longer
      // rather than risk two concurrent pushes touching the same
      // component in Figma.
      if(!staleEnough(uncertainPush)){send(409,{error:'A previous draw has unconfirmed completion. Close the plugin and inspect Figma before restarting the bridge and drawing again.'});return;}
      completed.delete(uncertainPush.jobId);
     }
    }
    // A catalog export visits every component sequentially and can take far
    // longer than one component's own push (minutes to tens of minutes, not
    // seconds) - it still queues as a single job like any other operation,
    // just with its own much longer completion window below, and only one
    // may run at a time for the same reason a single push already does.
    if(asynchronous&&operation==='pushCatalog'&&[...pending.values()].some(job=>job.operation==='pushCatalog')){send(409,{error:'A catalog export is already in progress. Wait for it to finish before starting another.'});return;}
    if(operation==='push'){const M=await currentModel();M.assert(contract);if(contract.authority!=='contract'){send(409,{error:'Figma is the authoring source. Switch to Contract and save before pushing.'});return;}}
    else if(operation==='pushCatalog'){
     const M=await currentModel();
     if(!Array.isArray(payload.items)||!payload.items.length){send(400,{error:'A non-empty list of components is required.'});return;}
     if(payload.tokens!==undefined&&(typeof payload.tokens!=='object'||Array.isArray(payload.tokens)||!payload.tokens)){send(400,{error:'Foundation tokens must be an object.'});return;}
     // The website strips each item's own contract.tokens to {} before
     // sending (it's an identical copy of the shared Foundation set below,
     // repeated once per component for no reason - see shell.js
     // exportCatalog) - re-hydrate from the one shared copy here, before
     // validating, so M.assert's token-reference checks still see every
     // real token each component's styles resolve against.
     for(const item of payload.items){
      if(payload.tokens&&(!item.contract.tokens||!Object.keys(item.contract.tokens).length))item.contract.tokens=payload.tokens;
      M.assert(item.contract);
      if(item.contract.authority!=='contract'){send(409,{error:'Figma is the authoring source for '+item.contract.name+'. Switch to Contract and save before exporting.'});return;}
      if(typeof item.name!=='string'||typeof item.category!=='string'){send(400,{error:'Each component needs a name and category.'});return;}
     }
    }
    else if(!['ping','pushCatalog'].includes(operation)&&(typeof payload.componentId!=='string'||!/^[\w-]+$/.test(payload.componentId))){send(400,{error:'A valid component ID is required.'});return;}
    if(operation==='configure'&&(!payload.values||typeof payload.values!=='object'||Array.isArray(payload.values))){send(400,{error:'Configuration values must be an object.'});return;}
    const jobId=crypto.randomUUID(),job={jobId,operation,...(operation==='push'?{contract}:operation==='pushCatalog'?{items:payload.items,tokens:payload.tokens}:{componentId:payload.componentId}),...(operation==='configure'?{values:payload.values}:{})};
    const entry={jobId,operation,status:'queued',phase:'Queued',send:asynchronous?null:send,timer:null,lastActivity:Date.now()};
    entry.timer=setTimeout(()=>{pending.delete(jobId);const i=queue.findIndex(j=>j.jobId===jobId);if(i>=0)queue.splice(i,1);entry.status=entry.status==='running'?'uncertain':'failed';entry.error='No completed result from the Figma plugin. Inspect the component before retrying.';entry.phase='Completion not confirmed';remember(entry);if(entry.send){entry.send(504,{error:'No completed result from the Figma plugin. Open Agentic Contract Bridge in Figma and retry.'});entry.send=null;}},operation==='pushCatalog'?Math.max(timeout,7200000):timeout);
    pending.set(jobId,entry);queue.push(job);dispatch();
    if(asynchronous)send(202,{jobId,status:entry.status});else res.on('close',()=>{entry.send=null;if(entry.status==='queued'&&pending.has(jobId)){clearTimeout(entry.timer);pending.delete(jobId);const i=queue.findIndex(j=>j.jobId===jobId);if(i>=0)queue.splice(i,1);}});return;
   }
   if(req.method!=='GET'){send(405,{error:'Method not allowed.'});return;}
   const relative=decodeURIComponent(url.pathname==='/'?'/new-project.html':url.pathname);
   if(relative.split('/').some(segment=>segment.startsWith('.'))){send(403,{error:'Private file.'});return;}
   const file=await fs.realpath(path.resolve(ROOT,'.'+relative));if(!file.startsWith(ROOT+path.sep)){send(403,{error:'Outside project.'});return;}
   const type=({'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'})[path.extname(file)];if(!type){send(403,{error:'Unsupported file type.'});return;}
   const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(data);
  }catch(error){send(error.code==='ENOENT'?404:400,{error:error.message});}
 });
 server.on('close',()=>{for(const job of pending.values())clearTimeout(job.timer);for(const waiter of waiters)clearTimeout(waiter.timer);pending.clear();completed.clear();waiters.clear();queue.length=0;});return server;
}
module.exports={createBridge};
if(require.main===module){const port=Number(process.env.ADS_BRIDGE_PORT||3333);const server=createBridge(),ipv6=http.createServer((req,res)=>server.emit('request',req,res));server.listen(port,'127.0.0.1',()=>{console.log('component editor and Figma bridge: http://127.0.0.1:'+port+'/new-project.html');ipv6.listen(port,'::1');});ipv6.on('error',error=>console.error('IPv6 localhost listener: '+error.message));server.on('error',error=>{console.error(error.message);process.exitCode=1;});}
