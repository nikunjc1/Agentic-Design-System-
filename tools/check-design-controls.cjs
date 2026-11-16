const {visit}=require('./visit-project.cjs');
// Rendered checks for shared controls and the Foundation -> preview -> export path.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const root=path.resolve(__dirname,'..'),out=path.join(root,'audit/design-controls-2026-10-28'),controlsOnly=process.argv.includes('--controls-only');
const pages=JSON.parse(fs.readFileSync(path.join(root,'audit/component-customization-2026-10-27/inventory.json'))).pages;
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(file,(e,data)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
(async()=>{let browser;const results={mode:controlsOnly?'controls-only':'full',pages:[],tasks:[],errors:[]};try{
 fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
 const page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));page.on('dialog',d=>d.accept());
 const load=async file=>{await visit(page,origin+'/'+file);await page.waitForTimeout(180);};
 const unit=async value=>{await page.getByRole('button',{name:value,exact:true}).click();await page.waitForTimeout(120);};
 await load('button-primary.html');await page.getByRole('button',{name:'Atomic styles',exact:true}).click();
 assert.notEqual(await page.locator('.wb-stage .button-matrix-wrap').evaluate(n=>getComputedStyle(n).backgroundImage),'none');
 await page.locator('[data-wb-style="padding-left"]').fill('24px');
 const before=await page.evaluate(()=>{const el=ADSWorkbench.selectedElement();return {key:ADSWorkbench.getState().selection,rect:el.getBoundingClientRect().toJSON()};});
 await unit('rem');
 assert.equal(await page.locator('[data-wb-style="padding-left"]').inputValue(),'1.5rem');
 assert.equal(await page.evaluate(()=>ADSFoundation.get().unit),'rem');
 assert.match(await page.locator('[data-role="size-mount"] .multiselect-trigger-label').textContent(),/2\.5rem/);
 assert.match(await page.locator('.wb-stage-caption>span:last-child').textContent(),/^\d+(?:\.\d+)? × \d+(?:\.\d+)? rem$/);
 assert.equal(await page.evaluate(()=>getComputedStyle(ADSWorkbench.selectedElement()).paddingLeft),'24px');
 assert.deepEqual(await page.evaluate(()=>ADSWorkbench.getState().selection),before.key);
 assert.ok(Math.abs((await page.evaluate(()=>ADSWorkbench.selectedElement().getBoundingClientRect().width))-before.rect.width)<0.1);
 let capture=await page.evaluate(()=>ADSContracts.capture());assert.equal(capture.context.unit,'rem');assert.equal(capture.anatomy.styles['padding-left'],'1.5rem');
 await unit('px');assert.equal(await page.locator('[data-wb-style="padding-left"]').inputValue(),'24px');assert.match(await page.locator('[data-role="size-mount"] .multiselect-trigger-label').textContent(),/40px/);
 await page.getByRole('button',{name:'Save changes',exact:true}).click();await visit(page,page.url());await page.waitForTimeout(180);
 assert.equal(await page.evaluate(()=>getComputedStyle(ADSWorkbench.selectedElement()).paddingLeft),'24px');
 await unit('rem');await page.getByRole('button',{name:'Atomic styles',exact:true}).click();
 await page.locator('[data-wb-style="padding-left"]').fill('var(--space-12)');
 await unit('px');assert.equal(await page.locator('[data-wb-style="padding-left"]').inputValue(),'var(--space-12)');
 await page.locator('[data-wb-style="width"]').fill('unfinished-value');await unit('rem');assert.equal(await page.locator('[data-wb-style="width"]').inputValue(),'unfinished-value');assert.equal(await page.locator('[data-wb-style="width"]').getAttribute('aria-invalid'),'true');await page.locator('[data-wb-style="width"]').fill('');await unit('px');
 results.tasks.push('Global px/rem round trip preserves geometry, selection, token references and saved edits; exports use the global unit');
 // Shared labels are reused by renderers. Changing selection must not resurrect
 // a cached label from the previous size when units change.
 await page.evaluate(()=>{for(const input of document.querySelectorAll('[data-role="size-mount"] .multiselect-options input')){input.checked=input.value==='48';input.dispatchEvent(new Event('change',{bubbles:true}));}});await page.waitForTimeout(150);
 await unit('rem');assert.match(await page.locator('[data-role="size-mount"] .multiselect-trigger-label').textContent(),/3rem/);await unit('px');assert.match(await page.locator('[data-role="size-mount"] .multiselect-trigger-label').textContent(),/48px/);
 const other=await context.newPage();await visit(other,origin+'/spacing.html');await other.waitForTimeout(120);await other.evaluate(()=>ADSFoundation.setUnit('rem'));await page.waitForTimeout(180);
 assert.equal(await page.getByRole('button',{name:'rem',exact:true}).getAttribute('aria-pressed'),'true');await other.close();
 await load('table-default.html');assert.equal(await page.evaluate(()=>ADSFoundation.get().unit),'rem');assert.equal(await page.getByRole('button',{name:'rem',exact:true}).getAttribute('aria-pressed'),'true');
 results.tasks.push('Changed dropdown labels, navigation and cross-tab Foundation unit updates stay synchronized');
 // Test the actual adjacent color control, alpha retention and export.
 await load('button-primary.html');await page.getByRole('button',{name:'Atomic styles',exact:true}).click();
 await page.locator('.wb-part-fields details').filter({has:page.locator('summary',{hasText:'Color & surfaces'})}).locator('summary').click();
 await page.locator('[data-wb-style="background-color"]').fill('#12345680');
 const color=page.locator('input[type=color][aria-label="Choose background"]');
 assert.equal(await color.inputValue(),'#123456');await color.fill('#abcdef');
 assert.equal(await page.locator('[data-wb-style="background-color"]').inputValue(),'#abcdef80');await page.waitForTimeout(250);
 assert.match(await page.evaluate(()=>getComputedStyle(ADSWorkbench.selectedElement()).backgroundColor),/171, 205, 239/);
 await page.getByRole('button',{name:'Save changes',exact:true}).click();await visit(page,page.url());await page.waitForTimeout(200);assert.match(await page.evaluate(()=>ADSContracts.code(ADSContracts.capture())),/171, 205, 239|#abcdef80/i);
 await page.getByRole('button',{name:'Atomic styles',exact:true}).click();await page.locator('.wb-part-fields details').filter({has:page.locator('summary',{hasText:'Color & surfaces'})}).locator('summary').click();await page.locator('[data-wb-style="background-color"]').fill('transparent');await page.locator('input[type=color][aria-label="Choose background"]').fill('#1357ab');assert.equal(await page.locator('[data-wb-style="background-color"]').inputValue(),'#1357ab');
 results.tasks.push('Atomic swatches synchronize text, preserve translucent alpha, replace transparent colors, update the real component and survive save/reload/export');
 await page.evaluate(()=>ADSStorage.safeSet('ads:radius',{philosophy:'soft'}));await page.waitForTimeout(180);
 assert.match(await page.locator('[data-role="radius-mount"] .multiselect-trigger-label').textContent(),/12px|0\.75rem/);
 await visit(page,page.url());await page.waitForTimeout(180);
 await page.evaluate(()=>ADSStorage.safeSet('ads:radius',{philosophy:'sharp'}));await page.waitForTimeout(180);assert.match(await page.locator('[data-role="radius-mount"] .multiselect-trigger-label').textContent(),/4px|0\.25rem/);
 await page.evaluate(()=>{const input=document.querySelector('[data-role="radius-mount"] .multiselect-options input[value="12"]');input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));});
 assert.equal(await page.getByRole('button',{name:'Use Foundation radius',exact:true}).getAttribute('aria-pressed'),'false');
 const explicit=await page.evaluate(()=>ADSWorkbench.getState().native['radius-mount']);
 await page.evaluate(()=>ADSStorage.safeSet('ads:radius',{philosophy:'balanced'}));await page.waitForTimeout(150);assert.deepEqual(await page.evaluate(()=>ADSWorkbench.getState().native['radius-mount']),explicit);
 await page.getByRole('button',{name:'Use Foundation radius',exact:true}).click();await page.waitForTimeout(150);assert.deepEqual(await page.evaluate(()=>ADSWorkbench.getState().native['radius-mount']),['8']);
 results.tasks.push('Native radius follows Foundation live and after save/reload; explicit choices persist and can return to Foundation');
 await page.getByRole('button',{name:'Use Foundation size',exact:true}).click();await page.evaluate(()=>ADSStorage.safeSet('ads:sizing',{control:48}));await page.waitForTimeout(150);assert.deepEqual(await page.evaluate(()=>ADSWorkbench.getState().native['size-mount']),['48']);
 await page.getByRole('button',{name:'Save changes',exact:true}).click();await visit(page,page.url());await page.waitForTimeout(180);await page.evaluate(()=>ADSStorage.safeSet('ads:sizing',{control:40}));await page.waitForTimeout(150);assert.deepEqual(await page.evaluate(()=>ADSWorkbench.getState().native['size-mount']),['40']);
 results.tasks.push('Control-height presets follow Foundation sizing and retain inheritance after save/reload');
 // Every shared native multiselect on every detail, at desktop and mobile.
 for(const info of controlsOnly?[]:pages){await page.setViewportSize({width:1440,height:1000});await load(info.file);const row={file:info.file,dropdownChecks:0,foundation:[]};
  for(const width of [1440,390]){await page.setViewportSize({width,height:844});
   for(const trigger of await page.locator('.wb-inspector .multiselect-trigger').all()){
    if(!await trigger.isVisible())continue;await trigger.click();
    const geometry=await trigger.evaluate(t=>{const p=document.getElementById(t.getAttribute('aria-controls')),r=p.getBoundingClientRect(),option=p.querySelector('.multiselect-option'),o=option.getBoundingClientRect(),hit=document.elementFromPoint(o.x+o.width/2,o.y+o.height/2);return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,w:innerWidth,h:innerHeight,hit:p.contains(hit),expanded:t.getAttribute('aria-expanded')};});
    assert.ok(geometry.left>=7&&geometry.top>=7&&geometry.right<=geometry.w-7&&geometry.bottom<=geometry.h-7,info.file+' '+width+' panel bounds '+JSON.stringify(geometry));assert.equal(geometry.hit,true,info.file+' options clipped');assert.equal(geometry.expanded,'true');
    await page.keyboard.press('ArrowDown');await page.keyboard.press('Escape');assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert.equal(await trigger.evaluate(t=>document.activeElement===t),true);row.dropdownChecks++;
   }
  }
  await page.setViewportSize({width:1440,height:1000});
  // Each Foundation category is independently changed through the production
  // storage/apply path. Assert exact live-token parity in the exported snapshot.
 const checks=await page.evaluate(async()=>{
   const fixtures={colors:{light:{primary:{hex:'#1357AB'}},dark:{primary:{hex:'#3579CD'}}},'bg-colors':{light:{primary:'#EEF1F5',secondary:'#FAFAFD',tertiary:'#F3F5FA'},dark:{primary:'#121826',secondary:'#1C2333',tertiary:'#293246'}},'status-colors':{light:{success:'#128451',warning:'#A86A08',danger:'#AD2342',info:'#2857B5'}},'neutral-colors':{light:{border:'#586174',c700:'#667388'}},typography:{headingScaleVersion:ADSFoundationModel.headingScaleVersion,primaryFont:{family:'Georgia'},secondaryFont:{family:'Verdana'},levels:{body:{size:'text-lg',letterSpacing:1,weight:500},caption:{size:'text-sm'},h1:{size:'display-lg'}}},spacing:{system:'8px'},radius:{philosophy:'soft'},border:{width:3,style:'dashed',color:'#47556B',opacity:80},'border-states':{focus:{light:'#732ADB',dark:'#B48AEF'}},shadow:{philosophy:'expressive'},icons:{system:'line',size:28,stroke:3,corner:'sharp'},'grid-layout':{system:'columns',columns:8,gutter:24},sizing:{control:48,target:48,icon:28,content:1080,sidebar:240},'data-format':{locale:'de-DE'},units:{unit:'rem'}};
   const rows=[];
   const appearance=()=>[ADSWorkbench.selectedElement(),...ADSWorkbench.selectedElement().querySelectorAll('*')].map(n=>{const style=getComputedStyle(n);return ['color','background-color','border-radius','border-top-width','border-top-style','box-shadow','font-family','font-size','font-weight','line-height','letter-spacing','padding-left','gap','stroke-width','stroke-linecap'].map(p=>style.getPropertyValue(p));});
   for(const [key,value]of Object.entries(fixtures)){
    if(!ADSFoundationModel.validRecord(key,value))throw Error('Invalid test fixture '+key);
    const previous=ADSFoundation.get().tokens,previousAppearance=appearance();
    ADSStorage.safeSet('ads:'+key,value);await new Promise(r=>setTimeout(r,20));
    const foundation=ADSFoundation.get(),c=ADSContracts.capture(),changed=Object.keys(foundation.tokens).filter(k=>previous[k]!==foundation.tokens[k]);
    if(JSON.stringify(c.tokens)!==JSON.stringify(foundation.tokens))throw Error(key+' stale snapshot');
    if(c.context.unit!==foundation.unit)throw Error(key+' stale units');
    if(c.context.iconStyle!==foundation.iconStyle||c.context.gridSystem!==foundation.gridSystem||JSON.stringify(c.context.dataFormat)!==JSON.stringify(foundation.dataFormat))throw Error(key+' stale Foundation context');
    const rootStyle=document.documentElement.style;for(const [name,value]of Object.entries(foundation.tokens))if(rootStyle.getPropertyValue(name)!==value)throw Error(key+' root token mismatch '+name);
    const errors=ADSComponentContract.validate(c);if(errors.length)throw Error(key+' contract invalid '+JSON.stringify(errors));
    if(['radius','sizing'].includes(key))for(const control of document.querySelectorAll('.multiselect[data-role]')){if(ADSWorkbench.getState().foundationFollow[control.dataset.role]!==true)continue;const inputs=[...control.querySelectorAll('.multiselect-options input')].filter(i=>Number.isFinite(Number(i.value))),px=ADSFoundationModel.toPx(foundation.tokens[/radius/.test(control.dataset.role)?'--radius-md':'--size-control']),closest=inputs.reduce((best,i)=>!best||Math.abs(Number(i.value)-px)<Math.abs(Number(best.value)-px)?i:best,null);if(closest&&!closest.checked)throw Error(control.dataset.role+' stale Foundation preset');}
    const nextAppearance=appearance();
    rows.push({key,changedTokens:changed.length,changedRenderedParts:nextAppearance.filter((p,i)=>JSON.stringify(p)!==JSON.stringify(previousAppearance[i])).length});
   }
   // Actual token-backed overrides remain live after another Foundation change.
   const field=document.querySelector('[data-wb-style="padding-left"]');field.value='var(--space-12)';field.dispatchEvent(new Event('input',{bubbles:true}));
   ADSStorage.safeSet('ads:spacing',{system:'2px'});await new Promise(r=>setTimeout(r,30));
   if(getComputedStyle(ADSWorkbench.selectedElement()).paddingLeft!=='12px')throw Error('Token override detached from Foundation');
   return rows;
  });row.foundation=checks;results.pages.push(row);
  await page.evaluate(()=>{for(const k of Object.keys(localStorage))if(k.startsWith('ads:'))localStorage.removeItem(k);});
  if(results.pages.length%15===0)console.log('Verified shared controls and Foundation on '+results.pages.length+' detail pages');
 }
 if(!controlsOnly)results.tasks.push('All detail pages inherit every Foundation category; snapshot tokens match live tokens and token-backed overrides remain connected');
 // Capture the shared dropdown and adjacent color controls in realistic scroll
 // positions. Also exercise collision handling while resizing an open panel.
 for(const width of [1440,390,320]){await page.setViewportSize({width,height:844});await load('button-primary.html');
  const trigger=page.locator('[data-role="radius-mount"] .multiselect-trigger');await trigger.click();
  await page.screenshot({path:path.join(out,'dropdown-'+width+'.png')});
  await page.setViewportSize({width:width-16,height:700});await page.waitForTimeout(60);
  const panel=page.locator('[data-role="radius-mount"] .multiselect-panel'),r=await panel.boundingBox();assert.ok(r.x>=7&&r.y>=7&&r.x+r.width<=width-23&&r.y+r.height<=693);
  await page.keyboard.press('Escape');await page.setViewportSize({width,height:844});
  await page.getByRole('button',{name:'Atomic styles',exact:true}).click();await page.locator('.wb-part-fields details').filter({has:page.locator('summary',{hasText:'Color & surfaces'})}).locator('summary').click();
  const input=page.locator('[data-wb-style="background-color"]');await input.scrollIntoViewIfNeeded();
  const aligned=await input.evaluate(n=>{const swatch=n.nextElementSibling,a=n.getBoundingClientRect(),b=swatch.getBoundingClientRect();return {text:a.width,swatch:b.width,top:Math.abs(a.top-b.top),height:Math.abs(a.height-b.height),overflow:n.closest('.wb-color-control').scrollWidth>n.closest('.wb-color-control').clientWidth};});
  assert.ok(aligned.text>40&&aligned.swatch>=32&&aligned.top<1&&aligned.height<1&&!aligned.overflow,JSON.stringify(aligned));
  await page.screenshot({path:path.join(out,'atomic-colors-'+width+'.png')});
 }
 results.tasks.push('Dropdowns reposition during resize; color swatches align with text inputs at 1440, 390 and 320px');
 // The Foundation picker must fit even when the viewport is shorter than it.
 for(const [width,height]of [[1440,900],[390,640],[320,480]]){await page.setViewportSize({width,height});await load('foundations.html');const trigger=page.locator('.color-swatch-trigger').first();await trigger.click();
  const popup=page.locator('.color-popover');await popup.waitFor({state:'visible'});
  for(const format of ['hex','rgb','hsl','hsb','css']){await popup.getByRole('combobox',{name:'Color format'}).selectOption(format);const r=await popup.boundingBox();assert.ok(r.x>=11&&r.y>=11&&r.x+r.width<=width-11&&r.y+r.height<=height-11,'Foundation picker bounds '+width+' '+format);}
  await page.screenshot({path:path.join(out,'foundation-picker-'+width+'.png')});await page.keyboard.press('Escape');assert.equal(await popup.isVisible(),false);assert.equal(await trigger.evaluate(t=>document.activeElement===t),true);
 }
 results.tasks.push('Foundation picker fits desktop, mobile and short viewports in all five formats with Escape focus return');
 assert.deepEqual(results.errors,[]);results.status='pass';console.log(JSON.stringify({status:results.status,pages:results.pages.length,dropdownChecks:results.pages.reduce((n,p)=>n+p.dropdownChecks,0),foundationChecks:results.pages.reduce((n,p)=>n+p.foundation.length,0),tasks:results.tasks,errors:results.errors}));
}finally{fs.writeFileSync(path.join(out,controlsOnly?'control-layout-results.json':'results.json'),JSON.stringify(results,null,2));await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
