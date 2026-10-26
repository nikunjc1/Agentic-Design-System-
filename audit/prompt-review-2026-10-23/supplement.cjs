const fs=require('fs');const path=require('path');
const {server,chromium,settle,extract}=require('./run-audit.cjs');
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
 await context.addInitScript(()=>{window.__auditCopies=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>window.__auditCopies.push(text)}});});
 const page=await context.newPage(),results=[];page.setDefaultTimeout(8000);
 async function test(file,role,value,previewRole){
  await page.goto(origin+'/'+file);await settle(page);const before=await extract(page);
  const selector='[data-role="'+previewRole+'"]';const old=await page.locator(selector).innerHTML();
  const control=page.locator('[data-role="'+role+'"]');await control.evaluate((n,value)=>{n.value=value;n.dispatchEvent(new Event('input',{bubbles:true}));n.dispatchEvent(new Event('change',{bubbles:true}));},value);
  await settle(page);const after=await extract(page);const html=await page.locator(selector).innerHTML();
  results.push({file,role,value,previewChanged:old!==html,promptChanged:before.prompt!==after.prompt,prompt:after.prompt,beforeHtml:old,afterHtml:html});
 }
 await test('color-picker-default.html','colorpicker-hex','#1357AB','colorpicker-matrix-container');
 await test('notification-default.html','notification-placement-select','bottomLeft','notification-placement-container');
 await test('avatar-default.html','avatar-group-view-select','names','avatar-group-container');
 await page.goto(origin+'/button-primary.html');await settle(page);
 await page.evaluate(()=>{const root=document.querySelector('[data-role="content-mount"]');for(const n of root.querySelectorAll('.multiselect-options input')){n.checked=n.value==='icon-only';n.dispatchEvent(new Event('change',{bubbles:true}));}});await settle(page);
 const first=await extract(page);const accessible=page.locator('[data-role="accessible-label"]');await accessible.fill('Open audit settings');await settle(page);const after=await extract(page);
 results.push({file:'button-primary.html',role:'accessible-label',value:'Open audit settings',promptChanged:first.prompt!==after.prompt,prompt:after.prompt,preview:await page.locator('[data-role="matrix-container"]').innerHTML()});
 await page.goto(origin+'/button-primary-icon.html');await settle(page);
 results.push({file:'button-primary-icon.html',kind:'loading-label',loading:await page.locator('tr').filter({has:page.locator('th',{hasText:/^Loading$/})}).innerText(),prompt:(await extract(page)).prompt});
 fs.writeFileSync(path.join(__dirname,'supplement.json'),JSON.stringify(results,null,2));
 results.forEach(r=>console.log(JSON.stringify({file:r.file,role:r.role,previewChanged:r.previewChanged,promptChanged:r.promptChanged,loading:r.loading})));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
