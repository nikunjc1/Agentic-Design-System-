const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'audit/component-contract-2026-10-27'),summary={date:'2026-10-27',status:'running',checks:[]};fs.mkdirSync(OUT,{recursive:true});
async function run(name,command,args,extra={}){
 console.log('Checking '+name);const start=Date.now(),output=fs.createWriteStream(path.join(OUT,name+'.log'));
 const child=spawn(command,args,{cwd:ROOT,env:{...process.env,...extra},stdio:['ignore','pipe','pipe']});child.stdout.pipe(output,{end:false});child.stderr.pipe(output,{end:false});const code=await new Promise((resolve,reject)=>{child.on('close',resolve);child.on('error',reject);});await new Promise(r=>output.end(r));const item={name,status:code===0?'pass':'fail',exitCode:code,durationSeconds:Math.round((Date.now()-start)/1000)};summary.checks.push(item);console.log(name+': '+item.status);if(code!==0)throw new Error(name+' failed. See '+path.join(OUT,name+'.log'));return item;
}
(async()=>{try{
 await run('contract-editor','node',['tools/check-contract-editor.cjs']);
 const parallel=await Promise.allSettled([run('release','bash',['tools/release_check.sh']),run('prompts','node',['tools/check-component-prompts.cjs'],{ADS_PROMPT_CHECK_OUT:path.join(OUT,'prompts')}),run('setup','node',['tools/check-setup-flow.cjs'])]);const failure=parallel.find(result=>result.status==='rejected');if(failure)throw failure.reason;
 await run('site-health','node',['tools/check-site-health.cjs'],{ADS_SITE_HEALTH_OUT:path.join(OUT,'site-health')});summary.status='pass';
}catch(error){summary.status='fail';summary.error=error.message;process.exitCode=1;console.error(error.message);}finally{fs.writeFileSync(path.join(OUT,'verification.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));}})();
