const test=require('node:test'),assert=require('node:assert/strict');
const {createBridge}=require('../tools/component-bridge.cjs'),runtimeFactory=require('../figma-plugin/bridge-runtime.js');
const M=require('../component-contract-model.js'),adapterFactory=require('../figma-plugin/adapter.js'),fixture=require('./figma-fixture.cjs');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(read,predicate){for(let i=0;i<150;i++){const value=await read();if(predicate(value))return value;await delay(10);}throw new Error('Expected bridge state was not reached');}
async function startServer(){const server=createBridge({timeout:3000});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return {server,endpoint:'http://127.0.0.1:'+server.address().port};}
async function close(server,runtime){runtime?.stop();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await runtime?.task;}
test('disconnected asynchronous draws fail immediately and null-origin CORS is supported',async()=>{
 const {server,endpoint}=await startServer();try{
  const r=await fetch(endpoint+'/contracts/jobs',{method:'POST',headers:{Origin:'null'},body:JSON.stringify({operation:'push',contract:M.blank('Disconnected')})});
  assert.equal(r.status,503);assert.equal(r.headers.get('access-control-allow-origin'),'*');assert.match((await r.json()).error,/disconnected/);
 }finally{await close(server);}
});
test('native runtime handles real HTTP jobs with no iframe messages or polling',async()=>{
 const {server,endpoint}=await startServer(),f=fixture(),events=[];let runtime;
 const adapter=adapterFactory(f.figma,M,phase=>runtime.report(phase));
 runtime=runtimeFactory({endpoint,fetch,build:'transport-test',notify:event=>events.push(event),execute:job=>job.operation==='ping'?{build:'transport-test'}:adapter[job.operation](job.contract)});
 try{
  runtime.start();await until(async()=>(await fetch(endpoint+'/bridge/status')).json(),s=>s.connected);
  const c=M.blank('Native transport'),accepted=await fetch(endpoint+'/contracts/jobs',{method:'POST',body:JSON.stringify({operation:'push',contract:c})});assert.equal(accepted.status,202);
  const {jobId}=await accepted.json(),finished=await until(async()=>(await fetch(endpoint+'/contracts/jobs/'+jobId)).json(),j=>j.status==='succeeded');
  assert.equal(finished.result.componentId,c.id);assert.equal(f.registry.get(finished.result.nodeId).children.length,1);assert.ok(events.some(e=>e.type==='progress'&&e.phase.includes('Binding')));
  const duplicate=await fetch(endpoint+'/bridge/result',{method:'POST',body:JSON.stringify({jobId,result:finished.result})});assert.equal(duplicate.status,200);assert.equal((await duplicate.json()).duplicate,true);
 }finally{await close(server,runtime);}
});
test('lost result acknowledgement reconnects without executing the component twice',async()=>{
 const {server,endpoint}=await startServer(),events=[];let executions=0,loseAcknowledgement=true;
 const transport=async(url,options)=>{const response=await fetch(url,options);if(url.endsWith('/bridge/result')&&loseAcknowledgement){loseAcknowledgement=false;throw new Error('Result response lost');}return response;};
 const runtime=runtimeFactory({endpoint,fetch:transport,build:'retry-test',notify:event=>events.push(event),execute:async()=>{executions++;return {ok:true};}});
 try{
  runtime.start();await until(async()=>(await fetch(endpoint+'/bridge/status')).json(),s=>s.connected);
  const accepted=await (await fetch(endpoint+'/contracts/jobs',{method:'POST',body:JSON.stringify({operation:'ping'})})).json();
  await until(async()=>events.some(e=>e.type==='connection'&&e.message.includes('Result response lost')),Boolean);await runtime.task;
  runtime.start();await until(async()=>events.some(e=>e.type==='complete'),Boolean);
  const result=await (await fetch(endpoint+'/contracts/jobs/'+accepted.jobId)).json();assert.equal(result.status,'succeeded');assert.equal(executions,1);
 }finally{await close(server,runtime);}
});
test('built plugin starts native transport before receiving any iframe message',async()=>{
 const {server,endpoint}=await startServer(),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),f=fixture(),events=[];
 f.figma.showUI=()=>{};f.figma.ui={postMessage:message=>events.push(message)};
 const origins=new Set(),sandbox={figma:f.figma,__html__:'',fetch:(url,options)=>{origins.add(new URL(url).origin);return fetch(url.replace(/^http:\/\/(localhost|127\.0\.0\.1):3333/,endpoint),options);}};vm.createContext(sandbox);
 try{
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../figma-plugin/code.js'),'utf8'),sandbox);
  await until(async()=>(await fetch(endpoint+'/bridge/status')).json(),s=>s.connected);
  const accepted=await (await fetch(endpoint+'/contracts/jobs',{method:'POST',body:JSON.stringify({operation:'ping'})})).json();
  const result=await until(async()=>(await fetch(endpoint+'/contracts/jobs/'+accepted.jobId)).json(),j=>j.status==='succeeded');assert.equal(result.result.transport,'native-fetch');assert.match(result.result.build,/^damco-native-bridge-\d{4}-\d{2}-\d{2}-v\d+/);
  const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../figma-plugin/manifest.json'),'utf8'));assert.deepEqual([...origins],['http://localhost:3333']);assert.ok([...origins].every(origin=>manifest.networkAccess.devAllowedDomains.includes(origin)),'Native network origins must be declared in the manifest');
 }finally{vm.runInContext('bridge.stop()',sandbox);server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
test('late native completion replaces uncertainty and preserves its result for the browser',async()=>{
 const server=createBridge({timeout:40});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const endpoint='http://127.0.0.1:'+server.address().port;
 try{
  await fetch(endpoint+'/bridge/connect',{method:'POST',body:JSON.stringify({clientId:'slow',build:'test'})});
  const c=M.blank('Slow'),accepted=await (await fetch(endpoint+'/contracts/jobs',{method:'POST',body:JSON.stringify({operation:'push',contract:c})})).json();
  await fetch(endpoint+'/bridge/next?clientId=slow');
  await until(async()=>(await fetch(endpoint+'/contracts/jobs/'+accepted.jobId)).json(),j=>j.status==='uncertain');
  const blocked=await fetch(endpoint+'/contracts/jobs',{method:'POST',body:JSON.stringify({operation:'push',contract:c})});assert.equal(blocked.status,409);
  const acknowledgement=await fetch(endpoint+'/bridge/result',{method:'POST',body:JSON.stringify({jobId:accepted.jobId,result:{componentId:c.id,nodeId:'late',revision:0}})});assert.equal(acknowledgement.status,200);
  const final=await (await fetch(endpoint+'/contracts/jobs/'+accepted.jobId)).json();assert.equal(final.status,'succeeded');assert.equal(final.result.nodeId,'late');
 }finally{await close(server);}
});
test('an abandoned push is cleared automatically instead of blocking every future draw',async()=>{
 // Same shape as the "late completion" test above (a push that goes
 // quiet after being dispatched), but here NO late /bridge/result ever
 // arrives - the real-world case reported: a plugin that closed, crashed,
 // or lost its network connection mid-push. staleJobMs stands in for the
 // real 45s default so this doesn't need to actually wait that long.
 const server=createBridge({timeout:40,staleJobMs:200});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const endpoint='http://127.0.0.1:'+server.address().port;
 try{
  await fetch(endpoint+'/bridge/connect',{method:'POST',body:JSON.stringify({clientId:'ghost',build:'test'})});
  const c=M.blank('Ghost'),accepted=await (await fetch(endpoint+'/contracts/jobs',{method:'POST',body:JSON.stringify({operation:'push',contract:c})})).json();
  await fetch(endpoint+'/bridge/next?clientId=ghost');
  await until(async()=>(await fetch(endpoint+'/contracts/jobs/'+accepted.jobId)).json(),j=>j.status==='uncertain');
  // Immediately after going uncertain, a retry still correctly blocks -
  // same guarantee the "late completion" test above relies on.
  const tooSoon=await fetch(endpoint+'/contracts/jobs',{method:'POST',body:JSON.stringify({operation:'push',contract:c})});assert.equal(tooSoon.status,409);
  await delay(250);
  // Past staleJobMs with no further signal at all - the next draw
  // attempt must be accepted automatically, not blocked.
  const recovered=await fetch(endpoint+'/contracts/jobs',{method:'POST',body:JSON.stringify({operation:'push',contract:c})});assert.equal(recovered.status,202);
 }finally{await close(server);}
});
