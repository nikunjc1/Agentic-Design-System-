/* Diagnose the real connected plugin without holding one HTTP response open. */
const fs=require('node:fs'),path=require('node:path');
const endpoint='http://127.0.0.1:3333';
async function runJob(operation,componentId,{contract,values,outDir=path.join(__dirname,'../audit/plugin-repair-2026-10-30/live'),timeout=600000}={}){
 fs.mkdirSync(outDir,{recursive:true});
 const accepted=await fetch(endpoint+'/contracts/jobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({operation,componentId,contract,values}),signal:AbortSignal.timeout(10000)});
 const job=await accepted.json();if(!accepted.ok)throw new Error(job.error||'The bridge rejected this request.');
 fs.writeFileSync(path.join(outDir,operation+'-accepted.json'),JSON.stringify(job,null,2));
 const deadline=Date.now()+timeout;let previousPhase;
 while(Date.now()<deadline){
  const response=await fetch(endpoint+'/contracts/jobs/'+job.jobId,{signal:AbortSignal.timeout(10000)}),state=await response.json();if(!response.ok)throw new Error(state.error||'Could not read the job status.');
  if(state.phase!==previousPhase){console.log(JSON.stringify({operation,status:state.status,phase:state.phase}));previousPhase=state.phase;}
  if(['failed','uncertain'].includes(state.status)){fs.writeFileSync(path.join(outDir,operation+'-result.json'),JSON.stringify(state,null,2));throw new Error(state.error);}
  if(state.status==='succeeded'){
   if(state.result?.png){const imageFile=path.join(outDir,componentId+'-figma.png');fs.writeFileSync(imageFile,Buffer.from(state.result.png));delete state.result.png;state.result.imageFile=imageFile;}
   fs.writeFileSync(path.join(outDir,operation+'-result.json'),JSON.stringify(state,null,2));return state.result;
  }
  await new Promise(resolve=>setTimeout(resolve,500));
 }
 throw new Error('Completion is not confirmed. Inspect Figma before retrying. Job '+job.jobId);
}
module.exports={runJob};
if(require.main===module){const [operation='ping',componentId='input-text-field',dataFile]=process.argv.slice(2),data=dataFile?JSON.parse(fs.readFileSync(dataFile,'utf8')):undefined;runJob(operation,componentId,{contract:operation==='push'?data:undefined,values:operation==='configure'?data:undefined}).then(result=>console.log(JSON.stringify(operation==='inspect'?{componentId:result.componentId,variantCount:result.variantCount,configurationCount:result.configurationCount,layout:result.layout,families:result.families,properties:result.properties,selectedMaster:result.selectedMaster,selectedField:result.selectedField}:result,null,2))).catch(error=>{console.error(error.message);process.exitCode=1;});}
