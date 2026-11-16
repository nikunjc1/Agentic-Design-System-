const {visit}=require('./visit-project.cjs');
/* Actual page CTA → HTTP broker → connected Figma; no request interception. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const out=path.join(__dirname,'../audit/plugin-repair-2026-10-30/live');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const status=await (await fetch('http://127.0.0.1:3333/bridge/status',{signal:AbortSignal.timeout(10000)})).json();
 if(!status.connected||!status.consumer?.build?.includes('native-bridge'))throw new Error('The updated native plugin must connect before a live draw.');
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  const settingsFile=process.argv[2];if(settingsFile){const c=JSON.parse(fs.readFileSync(settingsFile,'utf8'));await page.addInitScript(c=>localStorage.setItem('ads:workbench:v1:input-text-field.html',JSON.stringify({schemaVersion:1,native:c.source.nativeProperties,foundationFollow:Object.fromEntries(Object.keys(c.source.foundationFollow||{}).map(key=>[key,false])),selection:c.source.configuration})),c);}
  await visit(page,'http://127.0.0.1:3333/input-text-field.html');await page.waitForFunction(()=>window.ADSWorkbench?.active);
  const contract=await page.evaluate(()=>ADSContracts.capture());fs.writeFileSync(path.join(out,'sent-contract.json'),JSON.stringify(contract,null,2));
  await page.locator('.wb-selected-cell').screenshot({path:path.join(out,'web-preview.png')});
  const accepted=page.waitForResponse(response=>response.url().endsWith('/contracts/jobs'));
  await page.getByRole('button',{name:'Draw in Figma',exact:true}).click();const response=await accepted,job=await response.json();assert.equal(response.status(),202,JSON.stringify(job));
  fs.writeFileSync(path.join(out,'draw-accepted.json'),JSON.stringify(job,null,2));
  let lastPhase;const deadline=Date.now()+600000;
  while(Date.now()<deadline){const state=await (await fetch('http://127.0.0.1:3333/contracts/jobs/'+job.jobId)).json();if(state.phase!==lastPhase){console.log(JSON.stringify({status:state.status,phase:state.phase}));lastPhase=state.phase;}
   if(['failed','uncertain'].includes(state.status))throw new Error(state.error);
   if(state.status==='succeeded'){fs.writeFileSync(path.join(out,'draw-result.json'),JSON.stringify(state,null,2));assert.equal(state.result.configurationCount,1152);assert.equal(state.result.variantCount,3);assert.ok(state.result.families.every(family=>family.variantCount===384));assert.deepEqual(errors,[]);console.log(JSON.stringify({liveFigmaVerified:true,result:state.result,errors}));return;}
   await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw new Error('Completion unconfirmed; inspect Figma before another draw.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
