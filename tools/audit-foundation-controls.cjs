/* Functional DOM audit. Does not measure rendered layout, run a real browser,
   load remote fonts, or claim exhaustive Cartesian coverage of free text. */
const fs=require('node:fs');
const path=require('node:path');
const {boot,pages}=require('./foundation-dom-harness.cjs');
const M=require('../foundation-model.js');
const ROOT=path.resolve(__dirname,'..');
const results=[];
const pause=ms=>new Promise(r=>setTimeout(r,ms));
let assertions=0;
const clicked=new WeakSet();
function check(row,condition,message){assertions++;row.checks++;if(!condition)row.failures.push(message);}
function label(n){return n.id||n.dataset.role||n.getAttribute('aria-label')||n.closest('label')?.textContent.trim().slice(0,70)||n.type;}
function context(markdown){const part=markdown.split('## Current Foundation configuration')[1];return JSON.parse(part.match(/```json\n([\s\S]*?)\n```/)[1]);}
async function blobText(f,blob){return new Promise((resolve,reject)=>{const reader=new f.w.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsText(blob);});}
async function copyCheck(f,row){const btn=f.d.querySelector('button[id^="copy"][id$="MarkdownBtn"]');check(row,!!btn,'Local Markdown copy button missing');if(!btn)return;btn.click();await f.flush();check(row,f.copies.at(-1)===f.markdown(),'Copied Markdown differs from current output');check(row,!!context(f.markdown()).tokens,'Copy has no current token context');}
async function edit(f,row,n,value,type){
  const before=f.markdown(), prior=n.type==='checkbox'||n.type==='radio'?n.checked:n.value;
  if(!clicked.has(n)){n.focus();n.click();clicked.add(n);}await f.change(n,value,type||((n.tagName==='SELECT'||n.type==='radio')?'change':'input'));await f.flush();
  row.edits++;
  if(row.edits%100===0)console.log(row.page+': '+row.edits+' edits in progress');
  const changed=String(prior)!==String(value), preparation=n.dataset.role==='upload-name';
  if(changed&&!preparation)check(row,f.markdown()!==before,'Prompt did not update: '+label(n)+' → '+value);
}
async function auditPage(page){
  const f=await boot(page),row={page,checks:0,edits:0,combinations:0,viewSwitches:0,sectionButtons:0,readOnlySamples:0,failures:[]};
  try{
    check(row,!!f.markdown(),'Markdown output missing');
    for(const group of f.d.querySelectorAll('.component-guide'))for(const b of group.querySelectorAll('.guide-toggle-btn')){b.click();const panel=group.querySelector('[data-view-panel="'+b.dataset.view+'"]');check(row,!!panel&&!panel.hidden&&b.getAttribute('aria-pressed')==='true','Human/Machine switch failed');row.viewSwitches++;}
    for(const b of f.d.querySelectorAll('.page-outline .group-btn-segment')){b.click();check(row,b.getAttribute('aria-pressed')==='true','Section Group Button not selected');row.sectionButtons++;}
    for(const b of f.d.querySelectorAll('[data-role$="dark-enable"]'))await f.change(b,true);
    if(page==='icons.html')f.d.querySelector('.system-card[data-system="line"]').click();
    // Every select option; both checkbox states; representative valid edits
    // for every editable native field. Hidden canonical dimensions are driven
    // through their visible paired control, not edited twice.
    const controls=[...f.d.querySelectorAll('main input, main select, main textarea')];
    for(const n of controls){
      if(n.readOnly){row.readOnlySamples++;n.click();continue;}
      if(n.type==='file'||n.hidden||n.closest('.color-popover'))continue;
      if(n.disabled)continue;
      if(n.tagName==='SELECT'){
        const values=[...n.options].filter(o=>!o.disabled).map(o=>o.value);
        for(const value of values)await edit(f,row,n,value,'change');
      }else if(n.type==='checkbox'){
        for(const value of [false,true])await edit(f,row,n,value,'change');
      }else if(n.type==='radio'){await edit(f,row,n,true,'change');}
      else if(n.type==='color')await edit(f,row,n,n.value==='#345678'?'#456789':'#345678');
      else if(n.type==='number'){
        const min=n.min!==''?Number(n.min):0,max=n.max!==''?Number(n.max):16,step=n.step!==''&&n.step!=='any'?Number(n.step):1;
        for(const value of [...new Set([min,Math.min(max,min+step),max])])await edit(f,row,n,value);
      }else {
        const role=n.dataset.role||'';
        const value=/hex/.test(role)?'56789A':role==='line-height-pct'?'180':role==='border-opacity'?'70':n.id==='format-zone'?'Asia/Kolkata':n.id==='format-mask'?'•':n.id==='format-unit'?'km':n.id==='format-range'?' to ':n.id==='format-noValue'?'Not available':role==='upload-name'?'Audit Font':n.value;
        await edit(f,row,n,value);
      }
    }
    for(const b of f.d.querySelectorAll('main button[id^="save"][id$="Btn"]')){b.click();await f.flush();check(row,f.w.ADSStorage.lastWriteSucceeded,'Save failed: '+b.id);}
    await copyCheck(f,row);
    const exportBtn=f.d.querySelector('[data-foundation-export]');
    if(exportBtn){exportBtn.click();await f.flush();const download=f.downloads.at(-1);const payload=JSON.parse(await blobText(f,f.blobs.get(download.url)));check(row,JSON.stringify(payload.resolved.tokens)===JSON.stringify(f.w.ADSFoundation.get().tokens),'Foundation JSON has stale tokens');check(row,payload.resolved.unit===context(f.markdown()).unit,'JSON/Markdown unit mismatch');}
    // Durable reload checks actual resolved values, not just the existence of
    // a storage key. Reset follows after reload assertions.
    const saved=f.state(),live=f.w.ADSFoundation.get();const reloaded=await boot(page,{saved});
    check(row,JSON.stringify(reloaded.w.ADSFoundation.get())===JSON.stringify(live),'Reload changed applied settings');check(row,!reloaded.errors.length,'Reload script error');reloaded.close();
    for(const b of f.d.querySelectorAll('main button[id^="reset"][id$="Btn"]')){b.click();await f.flush();check(row,f.w.ADSStorage.lastWriteSucceeded,'Reset failed: '+b.id);}
    if(page==='data-format.html'){
      f.d.querySelector('.ads-format-actions button').click();await f.flush();check(row,!f.w.localStorage.getItem('ads:data-format'),'Data Format reset did not remove saved configuration');
    }
    check(row,!f.errors.length,'Script errors: '+f.errors.join('\n'));
  }catch(e){row.failures.push(e.stack);}finally{f.close();}
  results.push(row);console.log(page+': '+row.checks+' checks, '+row.edits+' edits, '+row.failures.length+' failures '+row.failures.slice(0,3).join('; '));
}
async function combinations(page){
  const f=await boot(page),row={page:page+' combinations',checks:0,edits:0,combinations:0,failures:[]};
  try{
    const products=[...f.d.querySelectorAll('.product-card[data-product]')],systems=[...f.d.querySelectorAll('.system-card[data-system]')];
    if(products.length){for(const product of products)for(const system of systems){product.click();system.click();await f.flush();const key=page==='grid-layout.html'?'grid-layout':page.replace('.html','');
      for(const baseline of page==='grid-layout.html'?[false,true]:[null]){
        if(baseline!==null)await f.change(f.d.querySelector('[data-role="baseline-enable"]'),baseline);
        const s=context(f.markdown()).settings[key];check(row,s.product===product.dataset.product&&(s.system||s.philosophy)===system.dataset.system&&(baseline===null||s.baseline===baseline),'Product/system/baseline pair failed');row.combinations++;
      }
    }}
    if(page==='icons.html'){
      const size=f.d.querySelector('[data-role="icon-size"]'),stroke=f.d.querySelector('[data-role="icon-stroke"]'),corner=f.d.querySelector('[data-role="icon-corner"]');
      for(const card of systems)for(const sz of [...size.options].map(o=>o.value)){
        card.click();await f.change(size,sz);const strokes=stroke.disabled?[stroke.value]:[...stroke.options].map(o=>o.value),corners=corner.disabled?[corner.value]:[...corner.options].map(o=>o.value);
        for(const st of strokes)for(const co of corners){if(!stroke.disabled)await f.change(stroke,st);if(!corner.disabled)await f.change(corner,co);await f.flush();const c=context(f.markdown()).settings.icons;check(row,c.system===card.dataset.system&&c.size===sz&&c.stroke===st&&c.corner===co,'Icon configuration did not reach prompt');check(row,[...f.d.querySelectorAll('[data-role="icon-preview"] svg')].every(s=>s.getAttribute('width')===sz&&s.getAttribute('height')===sz),'Icon preview ignores selected size');row.combinations++;}
      }
    }
    if(page==='borders.html'){
      for(const width of ['0','1','2','3','4'])for(const style of ['solid','dashed','dotted','double','none'])for(const side of ['all','top','bottom','horizontal','start','end','left','right','vertical']){
        await f.change(f.d.querySelector('[data-role="border-width"]'),width);await f.change(f.d.querySelector('[data-role="border-style"]'),style);await f.change(f.d.querySelector('[data-role="border-sides"]'),side);const c=context(f.markdown()).settings.border;check(row,c.width===width&&c.style===style&&c.sides===side,'Border combination failed');row.combinations++;
      }
    }
    if(page==='data-format.html'){
      for(const locale of ['en-GB','en-US','en-IN','de-DE','fr-FR','ja-JP'])for(const separator of ['locale','comma','space','none'])for(const grouping of [false,true]){
        await f.change(f.d.getElementById('format-separator'),'locale');await f.change(f.d.getElementById('format-locale'),locale);const previous=f.w.localStorage.getItem('ads:data-format');await f.change(f.d.getElementById('format-separator'),separator);await f.change(f.d.getElementById('format-grouping'),grouping);
        const invalid=separator==='comma'&&['de-DE','fr-FR'].includes(locale),c=f.w.ADSFoundation.get().dataFormat;
        check(row,invalid?f.w.localStorage.getItem('ads:data-format')===previous:c.locale===locale&&c.separator===separator&&c.grouping===grouping,'Locale/separator/grouping combination failed');row.combinations++;
      }
    }
    check(row,!f.errors.length,'Combination script errors: '+f.errors.join('\n'));
  }catch(e){row.failures.push(e.stack);}finally{f.close();}
  results.push(row);console.log(row.page+': '+row.combinations+' combinations, '+row.failures.length+' failures');
}
async function failures(){
  const row={page:'Failure recovery and assets',checks:0,edits:0,combinations:0,failures:[]};
  let f=await boot('typography.html');
  try{
    const input=f.d.querySelector('[data-role="weight"]');await f.change(input,'600');const durable=f.w.localStorage.getItem('ads:typography');
    f.failRemove(true);f.d.getElementById('resetTypographyBtn').click();await f.flush();check(row,f.w.localStorage.getItem('ads:typography')===durable,'Failed reset damaged durable Typography');f.failRemove(false);await f.change(input,'500');check(row,JSON.parse(f.w.localStorage.getItem('ads:typography')).levels.h1.weight==='500','Failed reset froze later auto-save');
    f.failWrites(true);await f.change(input,'800');check(row,JSON.parse(f.w.localStorage.getItem('ads:typography')).levels.h1.weight==='500','Failed write damaged durable Typography');check(row,f.w.ADSFoundation.get().tokens['--type-h1-weight']==='800','Unsaved preview did not apply');f.failWrites(false);
  }finally{f.close();}
  for(const [page,selector,value,key] of [['grid-layout.html','[data-role="grid-columns-input"]','25','ads:grid-layout'],['borders.html','[data-role="border-opacity"]','101','ads:border'],['borders.html','[data-role="border-color-hex"]','ZZZZZZ','ads:border'],['data-format.html','#format-zone','not/a-zone','ads:data-format'],['data-format.html','#format-mask','ab','ads:data-format'],['data-format.html','#format-decimals','','ads:data-format'],['data-format.html','#format-noValue','   ','ads:data-format']]){
    f=await boot(page);try{const n=f.d.querySelector(selector);n.dispatchEvent(new f.w.Event('input',{bubbles:true}));await f.flush();const previous=f.w.localStorage.getItem(key);await f.change(n,value,'input');check(row,f.w.localStorage.getItem(key)===previous,'Invalid edit overwrote saved state: '+selector);check(row,n.getAttribute('aria-invalid')==='true','Invalid edit not marked: '+selector);}finally{f.close();}
  }
  for(const page of pages)for(const mode of ['reject',false]){
    f=await boot(page,{clipboard:mode});try{const b=f.d.querySelector('button[id^="copy"][id$="MarkdownBtn"]');b.click();await f.flush();check(row,/Copy failed/.test(f.d.querySelector('[id$="MarkdownStatus"]')?.textContent||''),'Copy failure falsely reports success: '+page);let fallback='';f.d.execCommand=cmd=>{fallback=f.d.querySelector('textarea')?.value||'';return cmd==='copy';};b.click();await f.flush();check(row,fallback===f.markdown(),'Clipboard fallback uses stale text: '+page);}finally{f.close();}
  }
  f=await boot('icons.html');try{
    const input=f.d.querySelector('[data-role="icon-upload-input"]');
    const upload=async files=>{Object.defineProperty(input,'files',{configurable:true,value:files});input.dispatchEvent(new f.w.Event('change',{bubbles:true}));await pause(60);};
    await upload([new f.w.File(['<svg xmlns="http://www.w3.org/2000/svg"/>'],'reference.svg',{type:'image/svg+xml'})]);
    check(row,JSON.parse(f.w.localStorage.getItem('ads:icons')).uploads.length===1,'Icon upload not saved');check(row,f.markdown().includes('reference.svg'),'Uploaded filename missing from prompt');
    const reload=await boot('icons.html',{saved:f.state()});check(row,reload.d.querySelectorAll('.icon-upload-thumb').length===1,'Reference icon lost after reload');reload.close();
    await upload([new f.w.File(['hello'],'file.txt',{type:'text/plain'})]);check(row,f.d.querySelectorAll('.icon-upload-thumb').length===1,'Unsupported icon file accepted');
    await upload([new f.w.File([new Uint8Array(2000001)],'large.png',{type:'image/png'})]);check(row,f.d.querySelectorAll('.icon-upload-thumb').length===1,'Oversized icon accepted');
    f.d.querySelector('.icon-upload-thumb-remove').click();await f.flush();check(row,JSON.parse(f.w.localStorage.getItem('ads:icons')).uploads.length===0,'Icon removal not saved');
    const NativeReader=f.w.FileReader;let pending;f.w.FileReader=class{readAsDataURL(){pending=this;}};
    input.dispatchEvent(new f.w.Event('change',{bubbles:true})); // oversized rejected
    Object.defineProperty(input,'files',{configurable:true,value:[new f.w.File(['a'],'late.png',{type:'image/png'})]});input.dispatchEvent(new f.w.Event('change',{bubbles:true}));
    f.d.getElementById('resetIconsBtn').click();pending.result='data:image/png;base64,YQ==';pending.onload();await f.flush();check(row,!f.w.localStorage.getItem('ads:icons')&&!f.d.querySelector('.icon-upload-thumb'),'Late upload undid reset');
    f.w.FileReader=NativeReader;
  }catch(e){row.failures.push(e.stack);}finally{f.close();}
  f=await boot('ai-foundation.html');try{for(const kind of ['approve','reject']){const b=f.d.querySelector('[data-role="agent-'+kind+'"]');b.click();check(row,!f.d.querySelector('[data-role="agent-result"]').hidden&&f.d.activeElement===f.d.querySelector('[data-role="agent-undo"]'),'AI result/focus failed');check(row,/No library changes/.test(f.d.querySelector('[data-role="agent-result-text"]').textContent),'AI demo implies durable change');f.d.querySelector('[data-role="agent-undo"]').click();check(row,!f.d.querySelector('[data-role="agent-actions"]').hidden&&f.d.activeElement===b,'AI Undo/focus failed');}}finally{f.close();}
  results.push(row);console.log(row.page+': '+row.checks+' checks, '+row.failures.length+' failures');
}
async function sharedSettings(){
  const row={page:'Shared theme/unit/density/direction',checks:0,edits:0,combinations:0,failures:[]};
  for(const page of pages){const f=await boot(page);try{for(const theme of ['light','dark'])for(const unit of ['px','rem'])for(const density of ['comfortable','compact'])for(const direction of ['ltr','rtl']){
    f.w.localStorage.setItem('ads:theme',theme);f.w.localStorage.setItem('ads:density',density);f.w.localStorage.setItem('ads:direction',direction);f.w.ADSStorage.safeSet('ads:units',{unit});f.w.dispatchEvent(new f.w.StorageEvent('storage',{key:null}));await f.flush();const c=context(f.markdown());check(row,c.theme===theme&&c.unit===unit&&c.density===density&&c.direction===direction,'Shared context stale: '+page);row.combinations++;
  }}finally{f.close();}}
  results.push(row);console.log(row.page+': '+row.combinations+' combinations, '+row.failures.length+' failures');
}
async function fontAndColorWorkflows(){
  const row={page:'Font sources, presets and color picker',checks:0,edits:0,combinations:0,failures:[]};
  let f=await boot('typography.html');
  try{
    for(const root of f.d.querySelectorAll('.font-panel')){
      for(const method of root.querySelectorAll('.font-method-tabs button')){method.click();check(row,root.querySelector('[data-panel="'+method.dataset.method+'"]').classList.contains('is-active')&&method.getAttribute('aria-pressed')==='true','Font source switch failed');}
      root.querySelector('[data-method="category"]').click();
      for(const category of root.querySelectorAll('.font-category-chips .chip')){
        category.click();for(const option of root.querySelectorAll('.font-option')){option.click();await f.flush();const saved=JSON.parse(f.w.localStorage.getItem('ads:typography'));check(row,saved[root.dataset.font+'Font'].family===option.textContent&&f.markdown().includes(option.textContent),'Selected font missing from saved prompt');row.edits++;}
      }
      root.querySelector('[data-method="upload"]').click();
      const input=root.querySelector('[data-role="upload-input"]'),name=root.querySelector('[data-role="upload-name"]');name.value='Audit '+root.dataset.font;
      const upload=async file=>{Object.defineProperty(input,'files',{configurable:true,value:[file]});input.dispatchEvent(new f.w.Event('change',{bubbles:true}));for(let i=0;i<100&&root.querySelector('[data-role="upload-label"]').textContent.startsWith('Loading ');i++)await pause(20);await f.flush();};
      await upload(new f.w.File(['fake font bytes'],'audit.woff2',{type:'font/woff2'}));
      const font=JSON.parse(f.w.localStorage.getItem('ads:typography'))[root.dataset.font+'Font'];check(row,font.family===name.value&&font.dataUrl.startsWith('data:font/woff2;base64,'),'Font bytes not persisted');check(row,f.markdown().includes('Included in Foundation JSON')&&!f.markdown().includes(font.dataUrl),'Font asset not packaged appropriately');
      const previous=f.w.localStorage.getItem('ads:typography');await upload(new f.w.File(['a'],'invalid.txt',{type:'text/plain'}));check(row,f.w.localStorage.getItem('ads:typography')===previous,'Invalid font file changed saved settings');
      name.value='<bad>';await upload(new f.w.File(['a'],'bad.woff2',{type:'font/woff2'}));check(row,name.getAttribute('aria-invalid')==='true','Invalid font name not marked');name.value='Valid Font';
    }
    for(const preset of f.d.querySelectorAll('.platform-chips .chip')){preset.click();await f.flush();check(row,context(f.markdown()).settings.typography.platform===preset.dataset.platform,'Platform preset missing from prompt');row.combinations++;}
    const reload=await boot('typography.html',{saved:f.state()});check(row,reload.w.ADSFoundation.get().tokens['--font-display']===f.w.ADSFoundation.get().tokens['--font-display'],'Uploaded font family lost on reload');reload.close();
    // A pending FileReader callback must not resurrect a reset font.
    let reader;f.w.FileReader=class{readAsDataURL(){reader=this;}};
    const input=f.d.querySelector('[data-role="upload-input"]');Object.defineProperty(input,'files',{configurable:true,value:[new f.w.File(['a'],'late.woff2',{type:'font/woff2'})]});input.dispatchEvent(new f.w.Event('change',{bubbles:true}));f.d.getElementById('resetTypographyBtn').click();reader.result='data:font/woff2;base64,YQ==';reader.onload();await f.flush();check(row,!f.w.localStorage.getItem('ads:typography'),'Late font upload undid reset');
    check(row,!f.errors.length,'Font workflow script errors');
  }catch(e){row.failures.push(e.stack);}finally{f.close();}
  f=await boot('foundations.html');try{
    for(const trigger of f.d.querySelectorAll('.color-swatch-trigger')){trigger.click();check(row,!f.d.querySelector('.color-popover').hidden,'Color swatch did not open picker');f.d.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));check(row,f.d.querySelector('.color-popover').hidden&&f.d.activeElement===trigger,'Picker Escape did not restore focus');}
    f.d.querySelector('.color-swatch-trigger').click();const format=f.d.querySelector('.color-popover-format-select');
    for(const choice of [...format.options].map(o=>o.value)){
      await f.change(format,choice);const inputs=[...f.d.querySelectorAll('.color-popover-values input')];
      for(const input of inputs){input.click();if(input.readOnly)continue;await f.change(input,choice==='hex'?'234567':input.dataset.key==='h'?'180':'65');check(row,!input.getAttribute('aria-invalid')||input.getAttribute('aria-invalid')==='false','Valid picker value rejected');row.edits++;}
      check(row,context(f.markdown()).settings.colors.light.primary.hex===f.d.querySelector('[data-role="brand-light-picker"]').value.toUpperCase(),'Picker edit missing from prompt');
      if(choice==='css'){f.d.querySelector('.color-popover-copy').click();await f.flush();check(row,f.copies.at(-1)===inputs[0].value,'Picker CSS copy differs from displayed value');}
    }
    for(const [selector,key] of [['.color-popover-sv','ArrowRight'],['.color-popover-hue','ArrowRight'],['.color-popover-alpha','ArrowLeft']]){const n=f.d.querySelector(selector),old=n.getAttribute('aria-valuenow');n.dispatchEvent(new f.w.KeyboardEvent('keydown',{key,bubbles:true}));await f.flush();check(row,n.getAttribute('aria-valuenow')!==old||selector.includes('-sv'),'Keyboard color slider did not respond');}
    await f.change(format,'rgb');const invalid=f.d.querySelector('.color-popover-values input'),saved=f.w.localStorage.getItem('ads:colors');await f.change(invalid,'999');check(row,invalid.getAttribute('aria-invalid')==='true'&&f.w.localStorage.getItem('ads:colors')===saved,'Invalid picker value overwrote color');
    check(row,!f.errors.length,'Color workflow script errors');
  }catch(e){row.failures.push(e.stack);}finally{f.close();}
  results.push(row);console.log(row.page+': '+row.checks+' checks, '+row.edits+' edits, '+row.failures.length+' failures '+row.failures.slice(0,3).join('; '));
}
(async()=>{
  if(process.argv.includes('--recheck-fonts')){
    const previous=JSON.parse(fs.readFileSync(path.join(ROOT,'audit','foundation-controls-2026-10-08.json'),'utf8'));results.push(...previous.results.filter(r=>r.page!=='Font sources, presets and color picker'));await fontAndColorWorkflows();
  }else if(process.argv.includes('--recheck-data-format')){
    const previous=JSON.parse(fs.readFileSync(path.join(ROOT,'audit','foundation-controls-2026-10-08.json'),'utf8'));results.push(...previous.results.filter(r=>!['data-format.html','data-format.html combinations'].includes(r.page)));await auditPage('data-format.html');await combinations('data-format.html');
  }else{
    for(const page of pages)await auditPage(page);
    for(const page of ['spacing.html','radius.html','grid-layout.html','icons.html','borders.html','data-format.html'])await combinations(page);
    await failures();await sharedSettings();await fontAndColorWorkflows();
  }
  const report={date:'2026-10-08',method:'Actual page scripts in jsdom; rendered-browser QA unavailable',assertions:results.reduce((n,r)=>n+r.checks,0),edits:results.reduce((n,r)=>n+r.edits,0),combinations:results.reduce((n,r)=>n+r.combinations,0),failures:results.reduce((n,r)=>n+r.failures.length,0),results};
  fs.writeFileSync(path.join(ROOT,'audit','foundation-controls-2026-10-08.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({assertions:report.assertions,edits:report.edits,combinations:report.combinations,failures:report.failures}));
  if(report.failures){console.log(JSON.stringify(results.filter(r=>r.failures.length),null,2));process.exitCode=1;}
})().catch(e=>{console.error(e);process.exitCode=1;});
