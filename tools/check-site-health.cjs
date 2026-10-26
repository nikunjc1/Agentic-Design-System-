// Whole-site browser smoke check and Foundation recovery regressions.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'audit/site-health-2026-10-23');
const results={status:'running',recovery:[],pages:[],errors:[],assets:[]};
const server=http.createServer((req,res)=>{
 const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(ROOT+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data);});
});
(async()=>{let browser;try{
 fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:process.env.ADS_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
 const page=await context.newPage();page.setDefaultTimeout(10000);
 page.on('pageerror',e=>results.errors.push({file:page.url().split('/').pop(),message:e.message}));
 page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400&&!r.url().endsWith('/favicon.ico'))results.assets.push({url:r.url().slice(origin.length),status:r.status()});});
 await page.goto(origin+'/icons.html');
 // Corrupt/newer records require an explicit reset, then a durable Save.
 for(const raw of ['{broken',JSON.stringify({schemaVersion:999,system:'line'})]){
  await page.evaluate(raw=>{localStorage.clear();localStorage.setItem('ads:icons',raw);},raw);await page.reload();await page.locator('[data-foundation-save]:visible').waitFor();
  await page.locator('[data-foundation-save]').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ads:icons')),raw,'Unreadable record preserved before reset');
  await page.locator('#resetIconsBtn').click();await page.locator('.system-card[data-system="line"]').click();await page.locator('[data-foundation-save]').click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ads:icons')));assert.equal(saved?.system,'line','Reset permits saving the newly chosen icon family');
  await page.reload();await page.locator('[data-foundation-edit]:visible').waitFor();assert.equal(await page.locator('.system-card[data-system="line"]').getAttribute('aria-pressed'),'true');
  results.recovery.push({case:raw.startsWith('{broken')?'corrupt record':'future record',status:'pass'});
 }
 // Saved controls stay locked while documentation and exports remain usable.
 assert.equal(await page.locator('#resetIconsBtn').isDisabled(),true);
 for(const button of await page.locator('.guide-toggle-btn').all()){
  assert.equal(await button.isDisabled(),false);await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');
 }
 const downloadPromise=page.waitForEvent('download');await page.locator('[data-foundation-export]').click();const download=await downloadPromise;
 await download.saveAs(path.join(OUT,'foundation-export.json'));const exported=JSON.parse(fs.readFileSync(path.join(OUT,'foundation-export.json')));assert.equal(exported.settings.icons.system,'line');
 results.recovery.push({case:'saved controls lock; documentation and JSON export remain usable',status:'pass'});
 // A real storage event from another tab must prevent overwriting its changes.
 const other=await context.newPage();await other.goto(origin+'/overview.html');await page.locator('[data-foundation-edit]').click();
 await other.evaluate(()=>{const value=JSON.parse(localStorage.getItem('ads:icons'));value.system='flat';localStorage.setItem('ads:icons',JSON.stringify(value));});
 await page.locator('.ads-editor-conflict').waitFor();assert.equal(await page.locator('[data-foundation-save]').isDisabled(),true);
 await page.getByRole('button',{name:'Reload controls'}).click();await page.locator('[data-foundation-edit]:visible').waitFor();assert.equal(await page.locator('.system-card[data-system="flat"]').getAttribute('aria-pressed'),'true');
 await other.close();results.recovery.push({case:'cross-tab conflict and reload',status:'pass'});console.log('Recovery, locked views, exports and cross-tab checks passed');
 await page.evaluate(()=>localStorage.clear());
 const catalog=JSON.parse(fs.readFileSync(path.join(ROOT,'docs-catalog.json')));
 for(const [index,doc]of catalog.entries()){
  await page.setViewportSize({width:1440,height:1000});await page.goto(origin+'/'+doc.file);await page.waitForTimeout(80);
  const row={file:doc.file,widths:[],guides:0};
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:1000});
   const errors=await page.evaluate(()=>{const errors=[],main=document.querySelector('main');if(!main?.textContent.trim())errors.push('Missing content');if(document.querySelectorAll('h1').length!==1)errors.push('Primary heading count');if(document.documentElement.scrollWidth>innerWidth+2)errors.push('Document overflow: '+document.documentElement.scrollWidth);if(main&&main.scrollWidth>main.clientWidth+2)errors.push('Main overflow: '+main.scrollWidth+'/'+main.clientWidth);return errors;});
   row.widths.push({width,errors});
  }
  // Use real DOM handlers for both documentation views on every guide.
  await page.setViewportSize({width:1440,height:1000});
  const guides=await page.evaluate(()=>{const failures=[];let count=0;for(const guide of document.querySelectorAll('.component-guide'))for(const button of guide.querySelectorAll('.guide-toggle-btn')){button.click();const panel=[...guide.querySelectorAll('.guide-view-panel')].find(p=>p.dataset.viewPanel===button.dataset.view);if(!panel||panel.hidden||button.getAttribute('aria-pressed')!=='true')failures.push(button.textContent.trim());count++;}return {count,failures};});
  row.guides=guides.count;row.guideFailures=guides.failures;results.pages.push(row);
  if(row.widths.some(w=>w.errors.length)||guides.failures.length){await page.screenshot({path:path.join(OUT,doc.file+'.png')});throw new Error('Page smoke failure: '+JSON.stringify(row));}
  assert.equal(results.errors.length,0,JSON.stringify(results.errors));assert.equal(results.assets.length,0,JSON.stringify(results.assets));
  if((index+1)%20===0)console.log('Checked '+(index+1)+'/'+catalog.length+' pages at four widths');
 }
 results.status='pass';console.log(JSON.stringify({status:results.status,pages:results.pages.length,viewports:results.pages.length*4,guides:results.pages.reduce((n,p)=>n+p.guides,0),recovery:results.recovery.length,errors:results.errors,assets:results.assets}));
}catch(error){results.status='fail';results.failure=error.stack;throw error;}finally{fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(results,null,2));await browser?.close();await new Promise(r=>server.close(r));}})().catch(error=>{console.error(error);process.exitCode=1;});
