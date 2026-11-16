const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createBridge}=require('./component-bridge.cjs'),{visit}=require('./visit-project.cjs');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const root=path.resolve(__dirname,'..'),out=path.join(root,'audit/component-foundations-2026-11-06'),sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'component-workbench-catalog.js'),'utf8'),sandbox);
const files=process.env.ADS_PAGES?process.env.ADS_PAGES.split(','):sandbox.window.ADSWorkbenchCatalog.pages.map(p=>p.file);
const report={pages:[],errors:[]};
(async()=>{let browser,server;try{
 server=createBridge();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());const page=await context.newPage();page.on('pageerror',e=>report.errors.push({file:page.url(),message:e.message}));
 for(const file of files){await visit(page,origin+'/'+file);await page.waitForFunction(()=>window.ADSWorkbench?.active&&ADSWorkbench.selectedElement());const started=Date.now();
  const result=await page.evaluate(()=>{const c=ADSContracts.capture(),errors=ADSComponentContract.validate(c),refs=new Set();function walk(n){for(const value of Object.values(n.styles||{}))for(const m of String(value).matchAll(/var\((--[\w-]+)/g))refs.add(m[1]);for(const child of n.children||[])walk(child);}walk(c.anatomy);const missing=[...refs].filter(k=>!(k in c.tokens));const current=ADSFoundation.get();return {errors,missing,refs:[...refs],tokensMatch:JSON.stringify(c.tokens)===JSON.stringify(current.tokens),variants:c.variants?.length||0};});
  result.file=file;result.ms=Date.now()-started;report.pages.push(result);console.log(file+' '+result.ms+'ms '+result.refs.length+' authored/resolved references');assert.deepEqual(result.errors,[],file);assert.deepEqual(result.missing,[],file);assert.equal(result.tokensMatch,true,file);fs.writeFileSync(path.join(out,'exports.json'),JSON.stringify(report,null,2));
 }
 // Prove collisions retain the authored role, and snapshots use the same
 // captured values in the generated recipient HTML.
 await visit(page,origin+'/card-default.html');await page.waitForFunction(()=>window.ADSWorkbench?.active);
 const result=await page.evaluate(()=>{
  const host=document.createElement('div');host.innerHTML='<div class="ads-binding-proof"><span>Proof</span></div>';document.querySelector('main').append(host);
  const style=document.createElement('style');style.textContent='.ads-binding-proof{gap:var(--space-6);padding:var(--space-12);color:var(--danger-500);box-shadow:var(--shadow-md);border-radius:var(--radius-sm)}';document.head.append(style);
  const reader=ADSFoundationBindings.create(document,ADSFoundation.get().tokens),n=host.firstElementChild;const bindings=Object.fromEntries(['gap','padding-top','color','box-shadow','border-radius'].map(k=>[k,reader.read(n,k)]));host.remove();style.remove();return bindings;
 });
 assert.deepEqual(result,{gap:'var(--space-6)','padding-top':'var(--space-12)',color:'var(--danger-500)','box-shadow':'var(--shadow-md)','border-radius':'var(--radius-sm)'});report.collisionProof=result;
 const recipient=await context.newPage();report.recipients=[];
 for(const file of ['input-text-field.html','card-default.html','calendar-default.html','button-primary.html']){
  await visit(page,origin+'/'+file);await page.waitForFunction(()=>window.ADSWorkbench?.active&&ADSWorkbench.selectedElement());
  const sample=await page.evaluate(()=>{const keys=['color','backgroundColor','borderTopColor','borderTopWidth','borderTopLeftRadius','boxShadow','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','paddingTop','paddingRight','gap'];const style=getComputedStyle(ADSWorkbench.selectedElement()),expected=Object.fromEntries(keys.map(k=>[k,style[k]]));const c=ADSContracts.capture();return {expected,html:ADSContracts.code(c)};});
  await recipient.setContent(sample.html);const actual=await recipient.evaluate(keys=>{const style=getComputedStyle(document.querySelector('#component').firstElementChild);return Object.fromEntries(keys.map(k=>[k,style[k]]));},Object.keys(sample.expected));
  assert.deepEqual(actual,sample.expected,file+' standalone HTML foundation parity');report.recipients.push(file);
 }
 await recipient.close();
 await page.evaluate(()=>{ADSStorage.safeSet('ads:grid-layout',{system:'columns-rows',columns:6,gutter:36});});
 report.layout=await page.evaluate(()=>{const fixture=document.createElement('div');fixture.className='ads-master-shell';fixture.innerHTML='<div>List</div><div>Details</div>';document.querySelector('main').append(fixture);const gap=getComputedStyle(fixture).columnGap;fixture.remove();const c=ADSContracts.capture();return {gap,columns:c.tokens['--grid-columns'],gutter:c.tokens['--grid-gutter'],system:c.context.gridSystem};});
 assert.deepEqual(report.layout,{gap:'36px',columns:'6',gutter:'36px',system:'columns-rows'});
 await visit(page,origin+'/calendar-default.html');await page.waitForFunction(()=>window.ADSWorkbench?.active);await page.evaluate(()=>{ADSStorage.safeSet('ads:radius',{philosophy:'expressive'});});
 const radius=await page.locator('.wb-selected-cell .calendar-demo-day').first().evaluate(n=>getComputedStyle(n).borderTopLeftRadius);assert.equal(radius,'8px');report.calendarRadius=radius;
 await page.locator('.wb-selected-cell').screenshot({path:path.join(out,'calendar-foundation-radius.png')});

 assert.deepEqual(report.errors,[]);report.status='pass';
 }catch(e){report.status='fail';report.error=e.stack;console.error(e);process.exitCode=1;}finally{fs.writeFileSync(path.join(out,'exports.json'),JSON.stringify(report,null,2));await browser?.close();if(server)await new Promise(r=>server.close(r));}})();
