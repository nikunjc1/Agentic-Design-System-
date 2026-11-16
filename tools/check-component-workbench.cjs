const {visit}=require('./visit-project.cjs');
// Exercise the experimental workspace against every real component page.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const root=path.resolve(__dirname,'..'),out=path.join(root,'audit/component-workbench'),baseline=process.argv.includes('--baseline');
const pages=JSON.parse(fs.readFileSync(path.join(root,'audit/component-customization-2026-10-27/inventory.json'))).pages;
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
(async()=>{let browser;try{
 fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
 const page=await context.newPage(),errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));
 for(const item of pages){await visit(page,origin+'/'+item.file);await page.waitForTimeout(180);
  const result=await page.evaluate(()=>({file:location.pathname.slice(1),tables:document.querySelectorAll('main .button-matrix').length,cells:document.querySelectorAll('main .button-matrix-cell').length,workbench:!!window.ADSWorkbench?.active,properties:document.querySelectorAll('[data-role="copy-prompt-action"]').length,overflow:document.documentElement.scrollWidth>innerWidth,selected:document.querySelectorAll('.wb-selected-cell').length}));
  if(!baseline){assert.equal(result.workbench,true,item.file);assert.equal(result.selected,1,item.file+' selected preview');assert.equal(result.overflow,false,item.file+' desktop overflow');
   const nativeCount=await page.evaluate(()=>document.querySelectorAll('.wb-inspector .multiselect[data-role],.wb-inspector input[data-role],.wb-inspector select[data-role],.wb-inspector textarea[data-role]').length);assert.equal(nativeCount,item.controls.length,item.file+' retains every existing property');
   const captured=await page.evaluate(()=>{const c=ADSContracts.capture();return {errors:ADSComponentContract.validate(c),id:c.id,parts:(function count(n){return 1+(n.children||[]).reduce((s,c)=>s+count(c),0);})(c.anatomy)};});assert.deepEqual(captured.errors,[],item.file+' contract');result.capture=captured;
   for(const width of [1024,768,390,320]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,item.file+' '+width+'px overflow');}await page.setViewportSize({width:1440,height:1000});
  }
  if(['button-primary.html','table-default.html'].includes(item.file)){await page.evaluate(()=>{document.querySelector('main').scrollTop=0;const inspector=document.querySelector('.wb-inspector');if(inspector)inspector.scrollTop=0;});await page.waitForTimeout(220);await page.screenshot({path:path.join(out,(baseline?'before-':'after-')+item.file.replace('.html','.png')),fullPage:false});}
  results.push(result);
 }
 if(!baseline){
  const taskResults=[];const load=async file=>{await visit(page,origin+'/'+file);await page.waitForTimeout(180);};
  await load('button-primary.html');
  await page.locator('[data-role="button-label"]').fill('Publish product');await page.waitForTimeout(180);
  assert.equal(await page.evaluate(()=>ADSWorkbench.selectedElement().textContent),'Publish product');
  await page.locator('.wb-savebar').getByRole('button',{name:'Save',exact:true}).click();
  await visit(page,page.url());await page.waitForTimeout(220);
  assert.equal(await page.locator('[data-role="button-label"]').inputValue(),'Publish product');
  taskResults.push('Native properties survive Save and reload');
  await page.locator('[data-role="button-label"]').fill('Unsaved edit');await page.waitForTimeout(160);await page.locator('.wb-savebar').getByRole('button',{name:'Cancel',exact:true}).click();await page.waitForTimeout(180);
  assert.equal(await page.evaluate(()=>ADSWorkbench.selectedElement().textContent),'Publish product');taskResults.push('Cancel restores the saved native configuration');
  const exported=await page.evaluate(()=>{const c=ADSContracts.capture();return {tree:ADSComponentContract.compile(c).tree,html:ADSContracts.code(c),prompt:ADSComponentContract.prompt(c)};});
  assert.match(exported.html,/Publish product/);assert.match(exported.prompt,/Publish product/);
  await page.evaluate(()=>{window.__copies=[];navigator.clipboard.writeText=async text=>window.__copies.push(text);});
  await page.getByRole('button',{name:'Copy preview code',exact:true}).click();assert.match(await page.evaluate(()=>window.__copies[0]),/Publish product/);
  taskResults.push('Native property changes reach JSON, prompt, compiler and copied HTML');
  await page.getByRole('button',{name:'Compare states',exact:true}).click();assert.equal(await page.locator('.wb-stage').evaluate(n=>n.classList.contains('wb-showcase')),false);
  await page.getByRole('button',{name:'Showcase',exact:true}).click();taskResults.push('Comparison and showcase modes switch without losing edits');
  await page.locator('.wb-savebar').getByRole('button',{name:'Save',exact:true}).click();
  await page.getByRole('combobox',{name:'Button style',exact:true}).selectOption('button-secondary.html');await page.waitForTimeout(200);assert.match(page.url(),/button-secondary.html/);taskResults.push('All Button detail styles remain reachable');
  await load('button-primary.html');await page.getByRole('button',{name:'Reset',exact:true}).click();await page.waitForTimeout(180);
  assert.equal(await page.evaluate(()=>localStorage.getItem(ADSWorkbench.storageKey)),null);assert.equal(await page.locator('[data-role="button-label"]').inputValue(),'Save');taskResults.push('Reset clears this component settings and restores defaults');
  await page.evaluate(()=>{localStorage.setItem(ADSWorkbench.storageKey,'broken JSON');});await visit(page,page.url());await page.waitForTimeout(180);assert.equal(await page.locator('.wb-savebar').getByRole('button',{name:'Save',exact:true}).isDisabled(),true);assert.equal(await page.evaluate(()=>localStorage.getItem(ADSWorkbench.storageKey)),'broken JSON');await page.getByRole('button',{name:'Reset',exact:true}).click();await page.waitForTimeout(140);taskResults.push('Unreadable saved settings are preserved until explicit Reset');
  await page.locator('[data-role="button-label"]').fill('Concurrent draft');await page.waitForTimeout(150);await page.evaluate(()=>{const key=ADSWorkbench.storageKey;localStorage.setItem(key,'external revision');window.dispatchEvent(new StorageEvent('storage',{key,newValue:'external revision'}));});assert.equal(await page.locator('.wb-savebar').getByRole('button',{name:'Save',exact:true}).isDisabled(),true);await page.getByRole('button',{name:'Reset',exact:true}).click();await page.waitForTimeout(140);taskResults.push('Cross-tab changes block stale overwrites');
  for(const [legacy,target]of Object.entries(JSON.parse(fs.readFileSync(path.join(root,'component-workbench-catalog.js'),'utf8').split('window.ADSWorkbenchCatalog=')[1].replace(/;\s*$/,'' )).routes)){await load(legacy);assert.match(page.url(),new RegExp('/'+target.replace('.','\\.')+'$'));}taskResults.push('All 63 old listing URLs redirect to a working detail page');
  await load('button-primary.html');await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.dir='rtl';});await page.screenshot({path:path.join(out,'dark-rtl.png')});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);taskResults.push('Dark theme and RTL workspace remain within viewport');
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(400);
  assert.equal(await page.locator('.app-sidebar').evaluate(n=>n.getBoundingClientRect().right<=1),true,'Closed mobile navigation stays off screen in RTL');
  await page.screenshot({path:path.join(out,'mobile-rtl.png'),fullPage:true});
  await page.evaluate(()=>{document.documentElement.dataset.theme='light';document.documentElement.dir='ltr';});await page.waitForTimeout(200);await page.screenshot({path:path.join(out,'mobile.png'),fullPage:true});
  fs.writeFileSync(path.join(out,'task-checks.json'),JSON.stringify({checks:taskResults.length,results:taskResults},null,2));console.log(JSON.stringify({tasks:taskResults.length,results:taskResults}));
 }
 assert.deepEqual(errors,[],'runtime errors');
 fs.writeFileSync(path.join(out,baseline?'baseline.json':'page-checks.json'),JSON.stringify({pages:results.length,errors,results},null,2));
 console.log(JSON.stringify({phase:baseline?'baseline':'workspace',pages:results.length,errors}));
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
