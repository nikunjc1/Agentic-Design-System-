// Browser regression coverage for the prompt -> configured preview handoff.
// ADS_PLAYWRIGHT_PACKAGE may point to an existing playwright-core installation.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const ROOT=path.resolve(__dirname,'..');
const files=fs.readdirSync(ROOT).filter(f=>f.endsWith('.html')&&fs.readFileSync(path.join(ROOT,f),'utf8').includes('data-role="copy-prompt-action"')).sort();
const OUT=path.resolve(process.env.ADS_PROMPT_CHECK_OUT||path.join(ROOT,'audit/prompt-fix-verification-2026-10-23'));
const server=http.createServer((req,res)=>{
 const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(ROOT+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(e,data)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css'})[path.extname(file)]||'application/octet-stream');res.end(data);});
});
const settle=async page=>{await page.waitForTimeout(140);};
function block(prompt,name){const section=prompt.split('<!-- ads:'+name+' -->')[1]?.split('<!-- /ads:'+name+' -->')[0];return section?JSON.parse(section.match(/```json\n([\s\S]*?)\n```/)[1]):null;}
async function copy(page){return page.evaluate(async()=>{
 window.__promptCopies=[];const root=document.querySelector('[data-role="copy-prompt-action"]');root.querySelector('button').click();root.querySelector('.copy-dropdown-item-copy')?.click();await Promise.resolve();return window.__promptCopies.at(-1);
});}
async function edit(page,role,value){await page.locator('[data-role="'+role+'"]').evaluate((n,value)=>{if(n.type==='checkbox')n.checked=value;else n.value=String(value);n.dispatchEvent(new Event('input',{bubbles:true}));n.dispatchEvent(new Event('change',{bubbles:true}));},value);await settle(page);}
function current(prompt,property){return block(prompt,'component-properties')?.find(p=>p.property===property)?.value;}
const results=[];
(async()=>{
 let browser;
 try{
  fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({headless:true,executablePath:process.env.ADS_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
  await context.addInitScript(()=>{window.__promptCopies=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>window.__promptCopies.push(text)}});});
  const page=await context.newPage();page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  async function load(file){await page.goto(origin+'/'+file);await settle(page);}
  for(const file of files){
   await load(file);
   for(const theme of ['light','dark']){
    await page.evaluate(theme=>{document.documentElement.dataset.theme=theme;},theme);await settle(page);
    const prompt=await copy(page);assert.ok(prompt,file+' copy');
    const recipe=prompt.split('<!-- ads:component-properties -->')[0].split('<!-- ads:contract -->')[0];
    assert.doesNotMatch(recipe,/\b(?:undefined|NaN)\b/,file+' invalid instruction');
    const foundation=block(prompt,'page-foundation');assert.equal(foundation.theme,theme,file+' theme');
    const refs=[...prompt.matchAll(/var\(\s*(--[\w-]+)/g)].map(m=>m[1]);
    for(const ref of refs)assert.ok(ref in foundation.tokens,file+' missing dependency '+ref);
    const focus=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--color-focus-ring').trim());
    const focusLine=recipe.split('\n').find(l=>/\bFocus(?:ed)?(?: \([^\n]+\))?:.*outline:/.test(l));
    if(focusLine)assert.ok(focusLine.includes('solid '+focus+';'),file+' focus recipe: '+focusLine);
    if(file.startsWith('button-')&&file!=='button-primary-icon.html')assert.match(recipe,/States \(6[^\n]*Loading/,file+' Loading inventory');
    if(file==='switch-default.html')assert.match(recipe,/States \(6[^\n]*Loading/,file+' Loading inventory');
    if(file==='button-primary-icon.html'){assert.doesNotMatch(recipe,/label and both icon slots.*replaced/i);assert.equal((recipe.match(/Retain the label beside one leading spinner/g)||[]).length,7);}
    if(file==='badge-default.html'){assert.match(recipe,/each in 5 semantic colors/);assert.match(recipe,/Colors \(5/);}
    const again=await page.evaluate(p=>window.ADSFoundation.preparePageMarkdown(p),prompt);
    assert.equal((again.match(/<!-- ads:component-properties -->/g)||[]).length,(prompt.match(/<!-- ads:component-properties -->/g)||[]).length,file+' duplicate configuration');
    results.push({file,theme,status:'pass'});
   }
  }
  const scenarios=[
   ['input-text-field.html','input-label','Audit field','Label','Audit field'],
   ['input-text-field.html','input-placeholder','Audit placeholder','Placeholder','Audit placeholder'],
   ['input-text-field.html','input-leading-icon',true,'Leading icon enabled',true],
   ['input-text-field.html','input-trailing-icon',true,'Trailing icon enabled',true],
   ['input-text-field.html','input-allow-clear',true,'Allow clear enabled',true],
   ['input-text-field.html','input-label','','Label','Email address'],
   ['color-picker-default.html','colorpicker-hex','#1357AB','Color value','#1357AB'],
   ['color-picker-default.html','colorpicker-hex','#abc','Color value','#abc'],
   ['color-picker-default.html','colorpicker-hex','invalid','Color value','#FF031A'],
   ['description-default.html','description-columns-select','3','Columns','3'],
   ['float-button-default.html','floatbutton-show-badge',true,'Show badge enabled',true],
   ['group-button-default.html','group-count-select','9','Number of buttons','9'],
   ['notification-default.html','notification-placement-select','bottomLeft','Placement','bottomLeft'],
   ['avatar-default.html','avatar-group-view-select','names','Avatar.Group display','names'],
   ['slider-default.html','slider-value','200','Value',100],
   ['text-area-default.html','textarea-rows-select','8','Rows','8']
  ];
  for(const [file,role,value,property,expected]of scenarios){await load(file);await edit(page,role,value);assert.equal(current(await copy(page),property),expected,file+' '+property);results.push({file,property,status:'pass'});}
  await load('button-primary.html');
  await page.evaluate(()=>{for(const n of document.querySelectorAll('[data-role="content-mount"] .multiselect-options input')){n.checked=n.value==='icon-only';n.dispatchEvent(new Event('change',{bubbles:true}));}});await settle(page);
  await edit(page,'accessible-label','Open audit settings');assert.equal(current(await copy(page),'Accessible label (required for icon-only)'),'Open audit settings');
  results.push({file:'button-primary.html',property:'icon-only accessible name',status:'pass'});
  await load('group-button-default.html');await edit(page,'group-show-label',true);await edit(page,'group-field-label','Audit views');await edit(page,'group-show-supporting',true);await edit(page,'group-supporting-text','Audit helper');
  let prompt=await copy(page);assert.equal(current(prompt,'Field label text'),'Audit views');assert.equal(current(prompt,'Supporting text'),'Audit helper');
  await edit(page,'group-show-label',false);assert.equal(current(await copy(page),'Field label text'),undefined);results.push({file:'group-button-default.html',property:'conditional text',status:'pass'});
  await load('input-text-field.html');await edit(page,'input-label','Chosen label');
  await page.evaluate(()=>{for(const n of document.querySelectorAll('[data-role="input-size-mount"] .multiselect-options input')){n.checked=['32','48'].includes(n.value);n.dispatchEvent(new Event('change',{bubbles:true}));}});await settle(page);
  for(const index of [0,1]){
   prompt=await page.evaluate(async index=>{window.__promptCopies=[];const root=document.querySelector('[data-role="copy-prompt-action"]');const panel=root.querySelector('.copy-dropdown-panel');if(panel.hidden)root.querySelector('button').click();root.querySelectorAll('.copy-dropdown-item-copy')[index].click();await Promise.resolve();return window.__promptCopies.at(-1);},index);
   assert.match(prompt,new RegExp('Size: '+[32,48][index]+'px'));assert.equal(current(prompt,'Label'),'Chosen label');assert.ok(!block(prompt,'component-properties').some(p=>p.property==='Size'));
  }
  results.push({file:'input-text-field.html',property:'exact combination menus',status:'pass'});
  await load('affix-default.html');await page.evaluate(()=>{const input=document.querySelector('[data-role="affix-offset"]');input.value='12';input.dispatchEvent(new Event('input',{bubbles:true}));});await settle(page);
  const offset=block(await copy(page),'component-properties').filter(p=>p.property==='Offset (px)');assert.deepEqual(offset,[{property:'Offset (px)',value:12}]);results.push({file:'affix-default.html',property:'canonical dimension without cloned unit controls',status:'pass'});
  for(const file of ['input-text-field.html','card-default.html','notification-default.html']){
   await load(file);await page.evaluate(()=>{localStorage.setItem('ads:border-states',JSON.stringify({focus:{light:'1357AB',dark:'9753AC',darkAuto:false}}));localStorage.setItem('ads:shadow',JSON.stringify({philosophy:'flat'}));window.ADSFoundation.apply();});await settle(page);
   prompt=await copy(page);const t=block(prompt,'page-foundation').tokens;assert.equal(t['--shadow-xl'],'none');
   if(file==='input-text-field.html')assert.match(prompt.split('<!-- ads:component-properties -->')[0],/outline:2px solid #1357AB;/);
   if(file!=='input-text-field.html')assert.match(prompt,/box-shadow:var\(--shadow-(?:md|xl)\)/);
   results.push({file,property:'custom focus and shadow Foundations',status:'pass'});
   await page.evaluate(()=>{localStorage.clear();});
  }
  assert.deepEqual(errors,[],'browser runtime errors');
  fs.writeFileSync(path.join(OUT,'regressions.json'),JSON.stringify({pages:files.length,checks:results.length,status:'pass',results,errors},null,2));
  console.log(JSON.stringify({pages:files.length,checks:results.length,status:'pass',errors}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
