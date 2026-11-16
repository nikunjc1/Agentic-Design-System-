const {visit}=require('./visit-project.cjs');
// Capture every active page before/after onboarding changes, using isolated browser data.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const ROOT=path.resolve(__dirname,'..'),OUT=path.resolve(process.env.ADS_ONBOARDING_AUDIT_OUT||path.join(ROOT,'audit/onboarding-flow-2026-10-27/before'));
const results={status:'running',pages:[],journey:[],errors:[],assets:[]};
const server=http.createServer((req,res)=>{const target=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!target.startsWith(ROOT+path.sep)){res.writeHead(403).end();return;}fs.readFile(target,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(target)]||'application/octet-stream');res.end(data);});});
(async()=>{let browser;try{
 fs.mkdirSync(OUT,{recursive:true});await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:process.env.ADS_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
 const page=await context.newPage();page.on('pageerror',e=>results.errors.push({url:page.url(),error:e.message}));page.on('response',response=>{if(response.url().startsWith(origin)&&response.status()>=400&&!response.url().endsWith('/favicon.ico'))results.assets.push({url:response.url(),status:response.status()});});
 for(const doc of JSON.parse(fs.readFileSync(path.join(ROOT,'docs-catalog.json')))){
  await visit(page,origin+'/'+doc.file);await page.waitForTimeout(70);
  const row=await page.evaluate(()=>{const main=document.querySelector('main'),visible=n=>Boolean(n.getClientRects().length)&&!n.closest('[hidden]');return {title:document.title,heading:main?.querySelector('h1')?.textContent.trim(),headings:[...main.querySelectorAll('h2')].filter(visible).map(n=>n.textContent.trim()),setupNavigation:[...document.querySelectorAll('.sidebar-nav a')].filter(n=>n.getAttribute('href')==='new-project.html').map(n=>({label:n.textContent.trim(),href:n.getAttribute('href')})),mainLinks:[...main.querySelectorAll('a[href]')].filter(visible).map(n=>({label:n.getAttribute('aria-label')||n.textContent.trim(),href:n.getAttribute('href')})),primaryActions:[...main.querySelectorAll('.btn-primary')].filter(visible).map(n=>n.textContent.trim()),fields:[...main.querySelectorAll('input,select,textarea')].filter(visible).map(n=>({name:n.name||n.id,type:n.type,required:n.required})),intro:main.innerText.slice(0,1800)};});
  results.pages.push({file:doc.file,...row});if(results.pages.length%40===0)console.log('Flow inventory: '+results.pages.length+' pages');
 }
 async function capture(name){await page.evaluate(()=>{document.querySelector('main')?.scrollTo(0,0);window.scrollTo(0,0);});await page.screenshot({path:path.join(OUT,name+'.png')});results.journey.push({name,url:page.url().replace(origin,''),text:await page.locator('main').innerText()});}
 await visit(page,origin+'/overview.html');await capture('overview');
 await visit(page,origin+'/new-project.html');await capture('setup-product');
 await page.locator('#project').fill('Onboarding review');await page.locator('#productType').selectOption('Consumer App');await page.locator('[name=platforms][value="mobile-app"]').check();await page.locator('#setupNext').click();await capture('setup-identity');
 await page.locator('#name').fill('Review Person');await page.locator('#email').fill('review@example.com');await page.locator('#designation').fill('Product Designer');await page.locator('#role').selectOption('Designer');await page.locator('#setupNext').click();await capture('setup-review');await page.locator('#setupNext').click();await page.locator('#setupDone:visible').waitFor();await capture('setup-saved');
 await page.locator('#recommendedNext').click();await page.locator('[data-foundation-save]:visible').waitFor();await capture('colors');
 await visit(page,origin+'/icons.html');await page.locator('[data-foundation-save]:visible').waitFor();await page.locator('[data-foundation-save]').click();await page.locator('[data-foundation-edit]:visible').waitFor();await capture('icons-saved');
 results.status=results.errors.length||results.assets.length?'review':'pass';console.log(JSON.stringify({status:results.status,pages:results.pages.length,journey:results.journey.length,errors:results.errors,assets:results.assets}));
 }catch(error){results.status='fail';results.failure=error.stack;process.exitCode=1;console.error(error);}finally{fs.writeFileSync(path.join(OUT,'pages.json'),JSON.stringify(results,null,2));await browser?.close();await new Promise(resolve=>server.close(resolve));}})();
