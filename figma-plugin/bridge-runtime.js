/* Native Figma Fetch transport. UI visibility never controls job execution. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.createDamcoBridgeRuntime=factory;})(globalThis,function(options){
 'use strict';
 const endpoint=options.endpoint||'http://localhost:3333',clientId='damco-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 const notify=options.notify||(()=>{});let running=false,pendingResult=null,activeJob=null,task=null;
 async function request(path,body){
  const response=await options.fetch(endpoint+path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await response.json();if(!response.ok){const error=new Error(data.error||'Bridge returned '+response.status);error.status=response.status;throw error;}return data;
 }
 async function deliver(){
  if(!pendingResult)return;
  try{await request('/bridge/result',pendingResult);}catch(error){if(error.status===404){pendingResult=null;notify({type:'warning',message:'The bridge lost this job, but Figma may have applied it. Inspect the component before drawing again.'});return;}throw error;}
  const result=pendingResult;pendingResult=null;notify({type:result.error?'error':'complete',message:result.error||'Completed.',result:result.result});
 }
 async function run(){
  try{
   if(typeof options.fetch!=='function')throw new Error('This Figma version does not expose native Fetch. Update Figma before connecting.');
   notify({type:'connection',connected:false,message:'Connecting to '+endpoint+'…'});
   await request('/bridge/connect',{clientId,build:options.build});
   notify({type:'connection',connected:true,message:'Connected. Ready to draw.'});
   while(running){
    await deliver();if(!running)break;
    const job=await request('/bridge/next?wait=10000&clientId='+encodeURIComponent(clientId));if(!job)continue;
    activeJob=job.jobId;report('Runtime received '+job.operation);
    try{pendingResult={jobId:job.jobId,result:await options.execute(job)};}catch(error){pendingResult={jobId:job.jobId,error:error.message||String(error)};}
    activeJob=null;await deliver();
   }
  }catch(error){running=false;notify({type:'connection',connected:false,message:error.message+' Start the bridge, then click Connect / Retry.'});}
 }
 function start(){if(running)return task;running=true;task=run();return task;}
 function stop(){running=false;}
 function report(phase){notify({type:'progress',phase,jobId:activeJob});if(activeJob&&typeof options.fetch==='function')request('/bridge/progress',{clientId,jobId:activeJob,phase}).catch(()=>{});}
 return {start,stop,report,get task(){return task;},get activeJob(){return activeJob;}};
});
