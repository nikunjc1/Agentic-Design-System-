const {visit}=require('./visit-project.cjs');
// Evidence inventory and property-by-property checks; no application data is modified.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const ROOT=path.resolve(__dirname,'..'),OUT=path.resolve(process.env.ADS_CUSTOMIZATION_AUDIT_OUT||path.join(ROOT,'audit/component-customization-2026-10-27'));
const inventoryOnly=process.argv.includes('--inventory-only'),results={date:'2026-10-27',status:'running',method:'Isolated Chromium; native input/change handlers; DOM/style/text and clipboard output checks. Not participant research.',pages:[],errors:[]};
const files=fs.readdirSync(ROOT).filter(file=>file.endsWith('.html')&&fs.readFileSync(path.join(ROOT,file),'utf8').includes('data-role="copy-prompt-action"')).sort();
const digest=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const normalize=value=>String(value||'').replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z/g,'<timestamp>');
const server=http.createServer((req,res)=>{const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(ROOT+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
async function inventory(page){return page.evaluate(()=>{
 const panel=document.querySelector('[data-role="copy-prompt-action"]')?.closest('section');
 const text=n=>n?.textContent.replace(/\s+/g,' ').trim()||'';
 const controls=[...panel.querySelectorAll('.multiselect'),...panel.querySelectorAll('input,select,textarea')].filter(n=>!n.closest('.multiselect')||n.classList.contains('multiselect')).filter(n=>!['hidden','button','submit'].includes(n.type)&&!n.closest('.ads-unit-control'));
 const rows=controls.map((n,index)=>{
  const wrapper=n.closest('.type-control'),label=wrapper?.querySelector(':scope > span')?.cloneNode(true)||n.labels?.[0]?.cloneNode(true);label?.querySelectorAll('.info-tip,input,select,textarea,.multiselect').forEach(n=>n.remove());
  const multi=n.classList.contains('multiselect'),type=multi?'multiselect':n.tagName==='SELECT'?'select':n.type||n.tagName.toLowerCase();
  const value=multi?[...n.querySelectorAll('.multiselect-options input:checked')].map(n=>n.value):type==='checkbox'?n.checked:n.value;
  const trigger=multi?n.querySelector('button,[role=button]'):null;
  return {index,role:n.dataset.role||null,id:n.id||null,label:text(label)||n.getAttribute('aria-label')||n.dataset.role||n.id,type,value,options:multi?[...n.querySelectorAll('.multiselect-options input')].map(i=>({value:i.value,label:text(i.closest('label'))||i.value})):n.tagName==='SELECT'?[...n.options].map(o=>({value:o.value,label:o.textContent.trim()})):[],min:n.min||null,max:n.max||null,step:n.step||null,disabled:n.disabled||false,conditional:Boolean(n.closest('[hidden]'))&&!n.matches('input[data-dimension]'),visible:Boolean(n.getClientRects().length),accessibleName:n.getAttribute('aria-label')||n.getAttribute('aria-labelledby')||[...(n.labels||[])].map(text).join(' '),trigger:trigger?{tag:trigger.tagName,role:trigger.getAttribute('role'),expanded:trigger.getAttribute('aria-expanded'),label:trigger.getAttribute('aria-label')||trigger.getAttribute('aria-labelledby')}:null};
 });
 const heading=document.querySelector('h1').cloneNode(true);heading.querySelectorAll('.component-status').forEach(n=>n.remove());
 const preview=[...document.querySelectorAll('main > section')].find(s=>/Live Preview/i.test(text(s.querySelector('h2'))));
 const tables=[...(preview?.querySelectorAll('.button-matrix')||[])];
 return {name:text(heading),category:text(document.querySelector('.page-eyebrow')),controls:rows,propertyCopy:text(panel.querySelector('.get-library-copy')),preview:{present:Boolean(preview),cells:preview?.querySelectorAll('.button-matrix-cell').length||0,types:tables[0]?[...tables[0].querySelectorAll('thead th')].slice(1).map(text):[],states:tables[0]?[...tables[0].querySelectorAll('tbody > tr > th')].map(text):[],copy:text(preview?.querySelector('.get-library-copy')),text:text(preview).slice(0,1400)},editorAvailable:Boolean([...panel.querySelectorAll('button,a')].find(n=>/Edit component contract/i.test(text(n)))),actions:[...panel.querySelectorAll('button')].filter(n=>n.getClientRects().length).map(n=>({label:n.getAttribute('aria-label')||text(n),type:n.type})),guide:text(document.querySelector('.component-guide')).slice(0,22000)};
 });}
async function snapshot(page){return page.evaluate(()=>{
 const preview=[...document.querySelectorAll('main > section')].find(s=>/Live Preview/i.test(s.querySelector('h2')?.textContent||''));if(!preview)return {html:'',text:'',styles:[]};
 const root=preview.querySelector('.button-matrix-wrap,[data-role$="preview-mount"],[data-role$="preview-container"]')||preview;
 const probes=[...root.querySelectorAll('.button-matrix-cell > :first-child,button,input,textarea,select,[role=progressbar],[role=slider]')].slice(0,12);
 return {html:root.innerHTML,text:root.textContent.replace(/\s+/g,' ').trim(),styles:probes.map(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect();return {tag:n.tagName,width:r.width,height:r.height,fontSize:s.fontSize,borderRadius:s.borderRadius,color:s.color,background:s.backgroundColor,padding:s.padding,display:s.display,opacity:s.opacity};})};
 });}
async function copied(page,kind){return page.evaluate(async kind=>{
 window.__auditCopies=[];const root=document.querySelector('[data-role="copy-'+kind+'-action"]');const button=root?.querySelector('button');if(!button)return null;
 if(!root.querySelector('.copy-dropdown-panel')||root.querySelector('.copy-dropdown-panel').hidden)button.click();root.querySelector('.copy-dropdown-item-copy')?.click();await Promise.resolve();await Promise.resolve();
 const value=window.__auditCopies.at(-1)||null;const open=root.querySelector('.copy-dropdown-panel');if(open&&!open.hidden)button.click();return value;
 },kind);}
async function setControl(page,index,value){return page.evaluate(({index,value})=>{
 const panel=document.querySelector('[data-role="copy-prompt-action"]').closest('section');const controls=[...panel.querySelectorAll('.multiselect'),...panel.querySelectorAll('input,select,textarea')].filter(n=>!n.closest('.multiselect')||n.classList.contains('multiselect')).filter(n=>!['hidden','button','submit'].includes(n.type)&&!n.closest('.ads-unit-control'));const n=controls[index];
 if(n.classList.contains('multiselect')){for(const input of n.querySelectorAll('.multiselect-options input')){input.checked=value.includes(input.value);input.dispatchEvent(new Event('change',{bubbles:true}));}}
 else{if(n.type==='checkbox')n.checked=value;else n.value=String(value);n.dispatchEvent(new Event('input',{bubbles:true}));n.dispatchEvent(new Event('change',{bubbles:true}));}
 return {value:n.value,invalid:n.getAttribute('aria-invalid'),validation:n.validationMessage};
 },{index,value});}
(async()=>{let browser;try{
 fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(path.join(OUT,'pages'),{recursive:true});await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:process.env.ADS_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());await context.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__auditCopies||=[];window.__auditCopies.push(value);}}}));
 const page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',error=>results.errors.push({file:page.url().split('/').pop(),message:error.message}));page.on('dialog',dialog=>dialog.accept());
 for(const file of files){
  await visit(page,origin+'/'+file);await page.waitForTimeout(120);const row={file,...await inventory(page),tests:[]};
  if(!inventoryOnly){
   for(const control of row.controls){
    let before=await snapshot(page),promptBefore=await copied(page,'prompt'),codeBefore=await copied(page,'code');let values=[];
    if(['select','multiselect'].includes(control.type))values=control.options.map(o=>control.type==='multiselect'?[o.value]:o.value).filter(v=>JSON.stringify(v)!==JSON.stringify(control.value));
    else if(control.type==='checkbox')values=[!control.value];
    else if(control.type==='number'||control.type==='range'){const min=control.min===null?0:Number(control.min),max=control.max===null?100:Number(control.max);values=[min,max].filter(v=>String(v)!==String(control.value));}
    else if(control.type==='text'||control.type==='textarea')values=[/hex|color/i.test(control.role||'')?'#1357AB':'Audit '+row.name+' '+control.label];
    let prerequisite=null;
    if(control.conditional){
     if(/accessible-label/.test(control.role||'')){prerequisite=row.controls.find(c=>c.type==='multiselect'&&/content/.test(c.role||''));if(prerequisite)await setControl(page,prerequisite.index,['icon-only']);}
     else if(control.role==='group-field-label'){prerequisite=row.controls.find(c=>c.role==='group-show-label');if(prerequisite)await setControl(page,prerequisite.index,true);}
     else if(control.role==='group-supporting-text'){prerequisite=row.controls.find(c=>c.role==='group-show-supporting');if(prerequisite)await setControl(page,prerequisite.index,true);}
     if(prerequisite){await page.waitForTimeout(150);before=await snapshot(page);promptBefore=await copied(page,'prompt');codeBefore=await copied(page,'code');}
    }
    if((control.conditional&&!prerequisite)||control.disabled){row.tests.push({property:control.label,role:control.role,status:'conditional-or-disabled',reason:'Prerequisite was not safely inferred; manual verification remains.',cases:[]});continue;}
    const test={property:control.label,role:control.role,status:'tested',prerequisite:prerequisite?.role||null,cases:[]};
    for(const value of values){
     const native=await setControl(page,control.index,value);await page.waitForTimeout(150);const after=await snapshot(page),prompt=await copied(page,'prompt'),code=await copied(page,'code');
     test.cases.push({value,native,previewDOMChanged:digest(before.html)!==digest(after.html),previewTextChanged:before.text!==after.text,previewStylesChanged:digest(before.styles)!==digest(after.styles),promptAvailable:Boolean(prompt),promptChanged:digest(normalize(promptBefore))!==digest(normalize(prompt)),codeAvailable:Boolean(code),codeChanged:digest(normalize(codeBefore))!==digest(normalize(code)),promptProperties:prompt?.split('<!-- ads:component-properties -->')[1]?.split('<!-- /ads:component-properties -->')[0]?.trim()||null});
     await setControl(page,control.index,control.value);await page.waitForTimeout(120);
    }
    if(prerequisite){await setControl(page,prerequisite.index,prerequisite.value);await page.waitForTimeout(120);}
    row.tests.push(test);
   }
   const persistent=row.controls.find(c=>c.type==='text'&&!c.conditional)||row.controls.find(c=>c.type==='multiselect');
   if(persistent){const changed=persistent.type==='text'?'Reload audit '+row.name:[persistent.options.find(o=>!persistent.value.includes(o.value))?.value||persistent.options[0].value];await setControl(page,persistent.index,changed);await page.waitForTimeout(150);await visit(page,page.url());await page.waitForTimeout(150);const reloaded=(await inventory(page)).controls.find(c=>c.role===persistent.role&&c.label===persistent.label);row.reloadPersistence={property:persistent.label,changedValue:changed,reloadedValue:reloaded?.value,retained:JSON.stringify(reloaded?.value)===JSON.stringify(changed)};}
   for(const width of [1440,390,320]){await page.setViewportSize({width,height:900});await page.waitForTimeout(35);(row.viewports||=[]).push(await page.evaluate(()=>{const panel=document.querySelector('[data-role="copy-prompt-action"]').closest('section'),r=panel.getBoundingClientRect(),main=document.querySelector('main');return {width:innerWidth,documentOverflow:document.documentElement.scrollWidth>innerWidth+2,mainOverflow:main.scrollWidth>main.clientWidth+2,propertiesTop:r.top,propertiesHeight:r.height,previewTop:[...main.querySelectorAll(':scope > section')].find(s=>/Live Preview/i.test(s.querySelector('h2')?.textContent||''))?.getBoundingClientRect().top};}));}
   await page.setViewportSize({width:1440,height:1000});
   if(['button-primary.html','select-dropdown.html','table-default.html','calendar-default.html','modal-default.html','upload-default.html','tree-default.html','card-default.html'].includes(file)){await page.evaluate(()=>document.querySelector('main')?.scrollTo(0,0));await page.screenshot({path:path.join(OUT,file.replace('.html','')+'.png')});}
  }
  results.pages.push(row);fs.writeFileSync(path.join(OUT,'pages',file.replace('.html','.json')),JSON.stringify(row,null,2));console.log((inventoryOnly?'Inventory ':'Audit ')+results.pages.length+'/'+files.length+' '+file+' '+row.controls.length+' properties');
 }
 results.status=results.errors.length?'review':'complete';console.log(JSON.stringify({status:results.status,pages:results.pages.length,properties:results.pages.reduce((n,p)=>n+p.controls.length,0),cases:results.pages.reduce((n,p)=>n+p.tests.reduce((n,t)=>n+t.cases.length,0),0),errors:results.errors}));
 }catch(error){results.status='fail';results.failure=error.stack;process.exitCode=1;console.error(error);}finally{fs.writeFileSync(path.join(OUT,inventoryOnly?'inventory.json':'evidence.json'),JSON.stringify(results,null,2));await browser?.close();await new Promise(resolve=>server.close(resolve));}})();
