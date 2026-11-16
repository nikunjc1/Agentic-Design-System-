// Verify the changed journey, its existing neighbors, and the whole-site surface.
const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'audit/onboarding-flow-2026-10-27/after');
const summary={date:'2026-10-27',status:'running',checks:[]};fs.mkdirSync(OUT,{recursive:true});
async function run(name,command,args,extra={}){
 const output=fs.createWriteStream(path.join(OUT,name+'.log')),start=Date.now();console.log('Checking '+name);
 const child=spawn(command,args,{cwd:ROOT,env:{...process.env,...extra},stdio:['ignore','pipe','pipe']});child.stdout.pipe(output,{end:false});child.stderr.pipe(output,{end:false});
 const code=await new Promise((resolve,reject)=>{child.on('close',resolve);child.on('error',reject);});await new Promise(resolve=>output.end(resolve));summary.checks.push({name,status:code===0?'pass':'fail',exitCode:code,durationSeconds:Math.round((Date.now()-start)/1000)});console.log(name+': '+(code===0?'pass':'fail'));if(code!==0)throw Error(name+' failed. See '+path.join(OUT,name+'.log'));
}
(async()=>{try{
 await run('onboarding','node',['tools/check-onboarding-flow.cjs']);
 const checks=await Promise.allSettled([
  run('release','bash',['tools/release_check.sh']),
  run('setup','node',['tools/check-setup-flow.cjs']),
  run('prompts','node',['tools/check-component-prompts.cjs'],{ADS_PROMPT_CHECK_OUT:path.join(OUT,'prompts')}),
  run('contracts','node',['tools/check-contract-editor.cjs'])
 ]);const failed=checks.find(result=>result.status==='rejected');if(failed)throw failed.reason;
 await run('site-health','node',['tools/check-site-health.cjs'],{ADS_SITE_HEALTH_OUT:path.join(OUT,'site-health')});
 await run('pages','node',['tools/audit-onboarding-pages.cjs'],{ADS_ONBOARDING_AUDIT_OUT:path.join(OUT,'page-review')});summary.status='pass';
}catch(error){summary.status='fail';summary.error=error.message;console.error(error.message);process.exitCode=1;}finally{fs.writeFileSync(path.join(OUT,'verification.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));}})();
