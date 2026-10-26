const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const ROOT=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(ROOT+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(b);});});
const profile={version:2,project:'Flow test',productType:'Consumer App',platforms:['mobile-app'],name:'Test Person',email:'test@example.com',designation:'Designer',role:'Designer'};
const pages=[['foundations.html','colors'],['grid-layout.html','grid-layout'],['typography.html','typography'],['spacing.html','spacing'],['radius.html','radius'],['borders.html','border'],['shadows.html','shadow'],['icons.html','icons']];
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1100}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
 const page=await context.newPage();page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/new-project.html');
 await page.locator('#project').fill(profile.project);await page.locator('#productType').selectOption(profile.productType);await page.locator('[name=platforms][value="mobile-app"]').check();await page.locator('#setupNext').click();
 await page.locator('#setupNext').click();assert.ok(await page.locator('#error-name').innerText());
 await page.locator('#name').fill(profile.name);await page.locator('#email').fill(profile.email);await page.locator('#designation').fill(profile.designation);await page.locator('#role').selectOption(profile.role);await page.locator('#setupNext').click();await page.locator('#setupNext').click();
 await page.locator('#setupDone:visible').waitFor();assert.equal(await page.locator('#projectSetup').isVisible(),false);await page.reload();await page.locator('#editProjectSetup:visible').waitFor();assert.equal(await page.locator('#projectSetup').isVisible(),false);await page.locator('#editProjectSetup').click();assert.equal(await page.locator('#projectSetup').isVisible(),true);
 await page.locator('#project').fill('Updated project');await page.locator('#setupNext').click();await page.locator('#setupNext').click();await page.locator('#setupNext').click();await page.locator('#setupDone:visible').waitFor();assert.match(await page.locator('#savedSetupReview').innerText(),/Updated project/);
 await page.locator('#editProjectSetup').click();await page.locator('#project').fill('Discard this change');await page.locator('#cancelProjectEdit').click();await page.locator('#setupDone:visible').waitFor();assert.match(await page.locator('#savedSetupReview').innerText(),/Updated project/);assert.doesNotMatch(await page.locator('#savedSetupReview').innerText(),/Discard this change/);
 console.log('Project: required identity, save, reload and explicit Edit passed');
 for(const [file,key]of pages){
  await page.evaluate(profile=>{localStorage.clear();localStorage.setItem('ads:project-profile:v1',JSON.stringify(profile));},profile);
  await page.goto(origin+'/'+file);await page.locator('[data-foundation-save]:visible').waitFor();
  const defaults=await page.evaluate(()=>window.ADSFoundation.get());
  if(key==='grid-layout')assert.equal(defaults.tokens['--grid-columns'],'4');
  if(key==='typography')assert.equal(defaults.tokens['--type-h1-size'],'30px');
  if(key==='radius')assert.equal(defaults.tokens['--radius-md'],'8px');
  const seed=await page.evaluate(key=>localStorage.getItem('ads:'+key),key);assert.equal(seed,null,file+' no implicit save');
  await page.locator('[data-foundation-save]').click();await page.waitForTimeout(150);
  let saved=await page.evaluate(key=>localStorage.getItem('ads:'+key),key);assert.ok(saved,file+' saved record');
  assert.equal(await page.locator('[data-foundation-edit]').isVisible(),true,file+' locks after save');
  await page.reload();await page.locator('[data-foundation-edit]:visible').waitFor();
  assert.equal(await page.locator('[data-foundation-save]').isVisible(),false,file+' remains locked');
  await page.locator('[data-foundation-edit]').click();
  const draft=await page.evaluate(key=>{const v=window.ADSStorage.safeGet('ads:'+key);if(key==='spacing')v.system='8px';else if(key==='radius')v.philosophy='sharp';else if(key==='shadow')v.philosophy='flat';else if(key==='grid-layout')v.columns=8;else if(key==='icons')v.size=32;else if(key==='typography')v.levels.h1.size='display-xl';else if(key==='border')v.width=3;else v.light.primary.hex='#1357AB';window.ADSStorage.safeSet('ads:'+key,v);return v;},key);
  assert.equal(await page.evaluate(key=>localStorage.getItem('ads:'+key),key),saved,file+' editing is a draft');
  await page.locator('[data-foundation-cancel]').click();await page.waitForLoadState('load');await page.locator('[data-foundation-edit]:visible').waitFor();assert.equal(await page.evaluate(key=>localStorage.getItem('ads:'+key),key),saved,file+' Cancel retains saved record');
  // Change the actual widget, save, reload, and compare both preview tokens
  // and durable records. This catches UI handlers that only look successful.
  await page.locator('[data-foundation-edit]').click();
  if(key==='colors'){await page.locator('[data-role="brand-light-hex"]').fill('1357AB');await page.locator('[data-role="brand-light-hex"]').dispatchEvent('change');}
  else if(key==='grid-layout')await page.locator('.product-card[data-product="data-heavy"]').click();
  else if(key==='typography')await page.locator('.platform-chips [data-platform="saas"]').click();
  else {const choice={spacing:'8px',radius:'sharp',border:'strong',shadow:'flat',icons:'line'}[key];await page.locator('.system-card[data-system="'+choice+'"]').click();}
  await page.waitForTimeout(100);assert.equal(await page.evaluate(key=>localStorage.getItem('ads:'+key),key),saved,file+' widget remains a preview');
  const preview=await page.evaluate(()=>window.ADSFoundation.get().tokens);
  await page.locator('[data-foundation-save]').click();await page.locator('[data-foundation-edit]:visible').waitFor();
  const changed=await page.evaluate(key=>localStorage.getItem('ads:'+key),key);assert.notEqual(changed,saved,file+' widget change is saved');
  await page.reload();await page.locator('[data-foundation-edit]:visible').waitFor();
  assert.equal(await page.evaluate(key=>localStorage.getItem('ads:'+key),key),changed,file+' widget survives reload');
  assert.deepEqual(await page.evaluate(()=>window.ADSFoundation.get().tokens),preview,file+' saved preview matches after reload');
  console.log(file+': recommended defaults, explicit Save, lock, Edit, draft and Cancel passed');
 }
 // Exercise a real card edit through save/reload, rather than only staging.
 await page.evaluate(()=>localStorage.clear());await page.goto(origin+'/icons.html');await page.locator('[data-foundation-save]:visible').waitFor();await page.locator('[data-foundation-save]').click();await page.locator('[data-foundation-edit]').click();
 await page.locator('.system-card[data-system="line"]').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ads:icons')).system),'duotone');
 await page.locator('[data-foundation-save]').click();await page.reload();await page.locator('[data-foundation-edit]:visible').waitFor();assert.equal(await page.locator('.system-card[data-system="line"]').getAttribute('aria-pressed'),'true');
 console.log('Icon family edit saves only on Save and survives reload');
 // Invalid grid values must block Save and preserve the last durable record.
 await page.evaluate(()=>localStorage.clear());await page.goto(origin+'/grid-layout.html');await page.locator('[data-foundation-save]:visible').waitFor();await page.locator('.product-card[data-product="desktop-web"]').click();await page.locator('[data-foundation-save]').click();await page.locator('[data-foundation-edit]').click();
 const savedGrid=await page.evaluate(()=>localStorage.getItem('ads:grid-layout'));
 await page.locator('[data-role="grid-columns-input"]').fill('99');await page.locator('[data-foundation-save]').click();assert.match(await page.locator('.ads-foundation-editor [role=status]').innerText(),/Correct/);assert.equal(await page.evaluate(()=>localStorage.getItem('ads:grid-layout')),savedGrid);
 await page.locator('[data-role="grid-columns-input"]').fill('8');await page.locator('[data-foundation-save]').click();await page.locator('[data-foundation-edit]:visible').waitFor();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ads:grid-layout')).columns),8);
 console.log('Invalid grid values block Save; correcting the value permits Save');
 // Backups contain durable values, and a malformed restore changes nothing.
 const backupPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Back up saved settings',exact:true}).click();const backupDownload=await backupPromise;const backupPath=await backupDownload.path();const backup=JSON.parse(fs.readFileSync(backupPath));
 await page.locator('[data-foundation-edit]').click();const restoreInput=page.locator('.ads-foundation-toolbar input[type=file]');
 await restoreInput.setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{broken')});await page.getByText('This file is not valid JSON. Nothing was changed.',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('ads:grid-layout')),backup.records['ads:grid-layout']);
 await page.locator('[data-role="grid-columns-input"]').fill('12');await page.locator('[data-foundation-save]').click();await page.locator('[data-foundation-edit]').click();
 await restoreInput.setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await page.waitForEvent('load');await page.locator('[data-foundation-edit]:visible').waitFor();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ads:grid-layout')).columns),8);
 console.log('Backup, invalid restore rejection and successful restore passed');
 // A later failed record must roll back the earlier records in the same Save.
 await page.evaluate(()=>localStorage.clear());await page.goto(origin+'/foundations.html');await page.locator('[data-foundation-save]:visible').waitFor();await page.locator('[data-foundation-save]').click();await page.locator('[data-foundation-edit]').click();
 const savedColors=await page.evaluate(()=>Object.fromEntries(['colors','bg-colors','status-colors','neutral-colors'].map(k=>[k,localStorage.getItem('ads:'+k)])));
 await page.evaluate(()=>{const n=document.querySelector('[data-role="brand-hex"]')||document.querySelector('.hex-input-wrap input[type=text]');n.value='1357AB';n.dispatchEvent(new Event('input',{bubbles:true}));const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='ads:bg-colors')throw new Error('test mid-save failure');return original.call(this,k,v);};});
 await page.locator('[data-foundation-save]').click();assert.match(await page.locator('.ads-foundation-editor [role=status]').innerText(),/Could not save|interrupted/);
 assert.deepEqual(await page.evaluate(()=>Object.fromEntries(['colors','bg-colors','status-colors','neutral-colors'].map(k=>[k,localStorage.getItem('ads:'+k)]))),savedColors);
 console.log('A failed multi-section Save retains every previous saved color record');
 await page.evaluate(()=>localStorage.clear());await page.goto(origin+'/spacing.html');await page.locator('[data-foundation-save]:visible').waitFor();
 await page.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='ads:spacing')throw new Error('test storage failure');return original.call(this,k,v);};});
 await page.locator('[data-foundation-save]').click();assert.equal(await page.locator('[data-foundation-save]').isVisible(),true);assert.match(await page.locator('.ads-foundation-editor [role=status]').innerText(),/Could not save/);
 assert.deepEqual(errors,[]);console.log('Failed Save preserves editable draft; no page errors.');
 fs.mkdirSync(path.join(ROOT,'audit/setup-flow-2026-10-23'),{recursive:true});await page.screenshot({path:path.join(ROOT,'audit/setup-flow-2026-10-23/spacing-save-failure.png')});
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
