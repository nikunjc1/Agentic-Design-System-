/* One application path for first paint, same-page edits, reset and other tabs. */
(() => {
  'use strict';
  const M=window.ADSFoundationModel, root=document.documentElement;
  const keys=['colors','bg-colors','status-colors','neutral-colors','typography','spacing','sizing','radius','border','border-states','shadow','icons','grid-layout','units','data-format'];
  // Unit editing belongs to dimensional Foundations. Component recipes still
  // inherit the preference, and explicitly marked dimensions keep local controls.
  const unitPages=new Set(['typography.html','grid-layout.html','spacing.html','radius.html','borders.html','shadows.html','icons.html']);
  const foundationPages=new Set([...unitPages,'foundations.html','ai-foundation.html']);
  const pageScopes={
    'foundations.html':[['colors','bg-colors','status-colors','neutral-colors'],/^--(?:color-(?:brand|action-|surface-|text-)|red-|green-|amber-|danger-|blue-|graphite-|control-border|button-primary-text)/],
    'grid-layout.html':[['grid-layout','sizing'],/^--(?:grid-|size-)/],
    'typography.html':[['typography'],/^--(?:type-|font-)/],
    'spacing.html':[['spacing','sizing'],/^--(?:space-(?:2|4|6|8|10|12|14|16|24|32|40|48|64|label-gap|helper-gap|field-gap|icon-gap|panel-padding|group-gap)$|size-)/],
    'radius.html':[['radius'],/^--radius-(?:sm|md|lg|full)$/],
    'borders.html':[['border','border-states'],/^--(?:border-|control-border|focus-ring|color-focus)/],
    'shadows.html':[['shadow'],/^--shadow-/],
    'icons.html':[['icons','sizing'],/^--(?:icon-|size-)/],
    'ai-foundation.html':[['status-colors','bg-colors'],/^--(?:agent-|color-ai-|color-agent-|green-|amber-|danger-)/]
  };
  const drafts=new Map(), previous=new Set(),unsavedKeys=new Set();
  // Editors preview locally; only their explicit Save action writes durable
  // records. The same boundary covers cards, native controls and font uploads.
  const editorScopes={
    'foundations.html':['colors','bg-colors','status-colors','neutral-colors'],
    'grid-layout.html':['grid-layout'],'typography.html':['typography'],
    'spacing.html':['spacing'],'radius.html':['radius'],'borders.html':['border','border-states'],
    'shadows.html':['shadow'],'icons.html':['icons']
  };
  const editorPage=location.pathname.split('/').pop(),editorKeys=editorScopes[editorPage];
  if(editorKeys) {
    const scoped=new Set([...editorKeys,'sizing']),pending=new Map(),resetKeys=new Set();
    let editing=!editorKeys.some(key=>{try{return ['valid','migrated'].includes(M.inspectRecord(key,localStorage.getItem('ads:'+key)).status);}catch{return false;}});
    let ready=false,collecting=false,restoring=false,refresh=()=>{};
    window.ADSFoundationEditor={beginEdit(){editing=true;refresh();},hasReset(key){return editing&&resetKeys.has(key.replace(/^ads:/,''));},withPersistence(operation){restoring=true;try{return operation();}finally{restoring=false;}},stage(key,value){
      key=key.replace(/^ads:/,'');if(!scoped.has(key)) return false;
      if(restoring)return false;
      if(!ready&&!editing&&value!==null){try{if(JSON.stringify(M.migrateRecord(key,JSON.parse(localStorage.getItem('ads:'+key))))===JSON.stringify(value))return false;}catch{}}
      if(!editing) return 'locked';
      if(value===null)resetKeys.add(key);
      pending.set(key,value);
      window.dispatchEvent(new CustomEvent('ads:foundation-change',{detail:{key:'ads:'+key,value,unsaved:true}}));
      if(ready&&!collecting) refresh('Unsaved preview. Select Save foundation to keep these changes.');
      return true;
    }};
    document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{
      const main=document.querySelector('main');if(!main)return;
      const bar=document.createElement('section');bar.className='ads-foundation-editor';bar.setAttribute('aria-label','Foundation editing');
      const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
      const edit=document.createElement('button');edit.type='button';edit.className='btn btn-ghost';edit.textContent='Edit foundation';edit.dataset.foundationEdit='';
      const save=document.createElement('button');save.type='button';save.className='btn btn-primary';save.textContent='Save foundation';save.dataset.foundationSave='';
      const cancel=document.createElement('button');cancel.type='button';cancel.className='btn btn-ghost';cancel.textContent='Cancel changes';cancel.dataset.foundationCancel='';
      bar.append(status,edit,save,cancel);(main.querySelector('.page-lede')||main.querySelector('h1')).after(bar);
      const disabled=new Map();
      const permitted='.ads-foundation-editor,.ads-editor-conflict,.ads-unit-choice,[data-foundation-read-action],[data-foundation-export],.page-outline,.ads-tab-group,.guide-view-toggle,.ads-read-more,[id^="copy"],[data-role*="copy"],a[href]';
      function lock(){
        main.classList.toggle('ads-editor-locked',!editing);
        for(const node of main.querySelectorAll('input,select,textarea,button')) {
          if(node.closest(permitted)||node.matches('[id^="save"]'))continue;
          if(!editing){if(!disabled.has(node))disabled.set(node,node.disabled);if(!node.disabled)node.disabled=true;}
          else if(disabled.has(node)){node.disabled=disabled.get(node);disabled.delete(node);}
        }
      }
      refresh=message=>{status.textContent=message||(!editing?'Saved settings. Select Edit foundation to make changes.':'Choose your settings, then select Save foundation.');edit.hidden=editing;save.hidden=!editing;cancel.hidden=!editing;lock();};
      const legacy=[...main.querySelectorAll('button[id^="save"]')];legacy.forEach(button=>{button.hidden=true;});
      main.querySelectorAll('.save-status[id*="SaveStatus"],#typoSaveStatus').forEach(n=>{n.hidden=true;});
      // Cards and custom pickers also obey the saved-state lock.
      main.addEventListener('click',event=>{if(!editing&&!collecting&&!event.target.closest(permitted)){event.preventDefault();event.stopImmediatePropagation();}},true);
      new MutationObserver(()=>lock()).observe(main,{childList:true,subtree:true});
      edit.addEventListener('click',()=>{window.ADSFoundationEditor.beginEdit();main.querySelector('input:not(:disabled):not([hidden]),select:not(:disabled)')?.focus();});
      cancel.addEventListener('click',()=>location.reload());
      save.addEventListener('click',()=>{
        if(main.querySelector('.ads-editor-conflict')){refresh('Settings changed in another tab. Reload before saving.');return;}
        try {
          if(editorKeys.some(key=>['corrupt','invalid','future'].includes(M.inspectRecord(key,localStorage.getItem('ads:'+key)).status)&&!resetKeys.has(key))){
            refresh('Back up and reset unreadable settings before saving.');return;
          }
        }catch{refresh('Saved settings could not be read. Keep this page open and retry.');return;}
        collecting=true;legacy.forEach(button=>button.click());collecting=false;
        const invalid=[...main.querySelectorAll('input,select,textarea')].find(n=>!n.disabled&&!n.hidden&&!n.readOnly&&(n.getAttribute('aria-invalid')==='true'||!n.checkValidity()));
        if(invalid){refresh('Correct the highlighted settings before saving.');invalid.focus();return;}
        const backup=new Map();let writing;
        try {
          for(const [key,value]of pending){
            writing='ads:'+key;const raw=localStorage.getItem(writing);backup.set(writing,raw);
            if(value!==null&&(!M.validRecord(key,value)||(['corrupt','invalid','future'].includes(M.inspectRecord(key,raw).status)&&!resetKeys.has(key))))throw new Error('Back up and reset unreadable settings before saving.');
          }
          for(const [key,value]of pending){writing='ads:'+key;if(value===null)localStorage.removeItem(writing);else localStorage.setItem(writing,JSON.stringify(M.migrateRecord(key,value)));}
        }catch(error){
          let restored=true;for(const [key,value]of backup){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}catch{restored=false;}}
          refresh(restored?'Could not save. Your previous saved settings are unchanged; your edits remain available.':'Save was interrupted and some settings could not be restored. Keep this page open and back up the settings.');return;
        }
        for(const [key,value]of pending)window.dispatchEvent(new CustomEvent('ads:foundation-change',{detail:{key:'ads:'+key,value,removed:value===null}}));
        pending.clear();resetKeys.clear();editing=false;refresh('Foundation saved. Select Edit foundation to change it.');edit.focus();
      });
      ready=true;refresh();
    },0);},{once:true});
  }
  function read(key) {
    let value;
    if(drafts.has(key)) value=drafts.get(key);
    else try { value=JSON.parse(localStorage.getItem('ads:'+key)||'null'); } catch { return null; }
    if(value!=null) {try {value=M.migrateRecord(key,value);} catch {return null;}}
    // Restore the requested heading scale on first paint of legacy projects.
    // The version marker permits deliberate edits after this one-time update.
    return key==='typography'&&value&&value.headingScaleVersion==null&&M.validRecord('ads:typography',value)?M.restoreHeadingScale(value):value;
  }
  function preference(key,fallback,choices) { try { const v=localStorage.getItem('ads:'+key);return choices.includes(v)?v:fallback; } catch { return fallback; } }
  root.dataset.theme=preference('theme','light',['light','dark']);root.dataset.density=preference('density','comfortable',['comfortable','compact']);root.dir=preference('direction','ltr',['ltr','rtl']);
  let resolved;
  const fontAssets=new Map(),loadedFaces=new Map();
  function apply() {
    const saved=Object.fromEntries(keys.map(k=>[k,read(k)]));
    let profile=null;try { profile=window.ADSProject?window.ADSProject.read(localStorage):JSON.parse(localStorage.getItem('ads:project-profile:v1')||'null'); } catch {}
    resolved=M.resolve(saved,root.dataset.theme,profile);
    for(const prop of previous) if(!(prop in resolved.tokens)) root.style.removeProperty(prop);
    previous.clear();for(const [prop,value] of Object.entries(resolved.tokens)) {if(root.style.getPropertyValue(prop)!==value) root.style.setProperty(prop,value);previous.add(prop);}
    root.dataset.foundationUnit=resolved.unit;root.dataset.gridSystem=resolved.gridSystem;root.dataset.iconStyle=resolved.iconStyle;
    root.dataset.borderSides=resolved.tokens['--border-sides'];
    const typo=saved.typography||{};
    for(const [family,dataUrl]of fontAssets)if(![typo.primaryFont,typo.secondaryFont].some(f=>f?.family===family&&f.dataUrl===dataUrl)){fontAssets.delete(family);const face=loadedFaces.get(family);if(face)document.fonts?.delete?.(face);loadedFaces.delete(family);}
    for(const f of [typo.primaryFont,typo.secondaryFont]) if(f&&f.linkHref) {
      try { const url=new URL(f.linkHref,location.href);if(url.protocol==='https:'&&!Array.from(document.querySelectorAll('link[rel=stylesheet]')).some(l=>l.href===url.href)) {const link=document.createElement('link');link.rel='stylesheet';link.href=url.href;document.head.append(link);} } catch {}
    }
    for(const f of [typo.primaryFont,typo.secondaryFont]) if(f&&f.family&&typeof f.dataUrl==='string'&&/^data:[\w.+/-]*;base64,[A-Za-z0-9+/=]+$/.test(f.dataUrl)&&f.dataUrl.length<3000000) {
      if(fontAssets.get(f.family)===f.dataUrl) continue;
      fontAssets.set(f.family,f.dataUrl);
      try {const face=new FontFace(f.family,'url("'+f.dataUrl+'")');face.load().then(loaded=>{if(fontAssets.get(f.family)!==f.dataUrl)return;document.fonts.add(loaded);loadedFaces.set(f.family,loaded);scheduleText();}).catch(()=>{if(fontAssets.get(f.family)!==f.dataUrl)return;fontAssets.delete(f.family);window.dispatchEvent(new CustomEvent('ads:font-error',{detail:{family:f.family}}));});}catch{fontAssets.delete(f.family);}
    }
    if(document.body) { bindExamples();renderData();updateUnits(); scheduleText(); }
    window.dispatchEvent(new CustomEvent('ads:foundation-applied',{detail:resolved}));
    return resolved;
  }
  // Keep non-variant properties in one export path. Size/radius/content
  // multiselects are serialized by the component's per-combination builder;
  // reading them here would turn an exact combination back into a selection set.
  function componentProperties() {
    const panel=document.querySelector('[data-role="copy-prompt-action"]')?.closest('section');
    if(!panel) return [];
    const controls=new Set([...panel.querySelectorAll('input[data-role],select[data-role],textarea[data-role]'),...document.querySelectorAll('[data-prompt-property]')]);
    // Export canonical pixel inputs rather than the unit editor's cloned
    // display input/select. Conditional properties stay absent while hidden.
    return [...controls].filter(el=>!el.closest('.multiselect')&&(!el.closest('[hidden]')||unitInputs.has(el))&&!['hidden','file','button','submit'].includes(el.type)).map(el=>{
      const label=el.closest('.type-control')?.querySelector(':scope > span')?.cloneNode(true);
      label?.querySelectorAll('.info-tip').forEach(n=>n.remove());
      const property=el.dataset.promptProperty||label?.textContent.trim()||el.getAttribute('aria-label');
      if(!property) return null;
      let value=el.type==='checkbox'?el.checked:el.value.trim();
      if(el.type==='number'||el.type==='range') {
        value=Number(value||el.defaultValue);
        if(!Number.isFinite(value)) value=Number(el.defaultValue)||0;
        if(el.min!=='') value=Math.max(Number(el.min),value);
        if(el.max!=='') value=Math.min(Number(el.max),value);
      } else if(el.tagName!=='SELECT'&&el.type!=='checkbox') {
        value=value||el.defaultValue||'';
        if(el.dataset.role==='colorpicker-hex'&&!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) value=el.defaultValue;
      }
      return {property:property+(el.type==='checkbox'?' enabled':''),value};
    }).filter(Boolean);
  }
  // Include the transitive dependency set, not just names in a page allowlist.
  // A referenced semantic token may itself alias a primitive or another role.
  function promptTokens(text,filter) {
    const names=new Set(Object.keys(resolved.tokens).filter(name=>filter.test(name)));
    const references=value=>Array.from(String(value).matchAll(/var\(\s*(--[\w-]+)/g),m=>m[1]);
    references(text).forEach(name=>names.add(name));
    const tokens={};
    for(const name of names) {
      if(!(name in resolved.tokens)) continue;
      tokens[name]=resolved.tokens[name];
      references(tokens[name]).forEach(dependency=>names.add(dependency));
    }
    return tokens;
  }
  function preparePageMarkdown(text) {
    const page=location.pathname.split('/').pop();
    const scope=pageScopes[page]||[keys,/^--(?:type-|font-|size-|icon-|grid-|agent-|color-ai-|color-agent-|graphite-|radius-(?:sm|md|lg)$|shadow-|border-|red-|green-|amber-|danger-|blue-|control-border|space-(?:4|6|8|12|16|24|32|40|48|64)$)/];
    const settings=Object.fromEntries(scope[0].map(key=>[key,read(key)]));
    // Reference assets are packaged in JSON exports, not duplicated as huge
    // data URLs inside documentation prompts.
    let source=String(text).replace(/\n*<!-- ads:page-foundation -->[\s\S]*?<!-- \/ads:page-foundation -->/g,'').replace(/\n*<!-- ads:contract -->[\s\S]*?<!-- \/ads:contract -->/g,'').replace(/\n*<!-- ads:component-properties -->[\s\S]*?<!-- \/ads:component-properties -->/g,'').trim();
    const tokens=promptTokens(source,scope[1]);
    const properties=componentProperties();
    if(properties.length) source+='\n\n<!-- ads:component-properties -->\n## Current component properties\n\nUse these current values when reproducing the preview. They override example/default values in the specification above. The variant choices stated above belong to the copied combination.\n\n```json\n'+JSON.stringify(properties,null,2).replace(/`/g,'\\u0060')+'\n```\n<!-- /ads:component-properties -->';
    const json=JSON.stringify({unit:resolved.unit,theme:resolved.theme,density:root.dataset.density,direction:root.dir,settings,unsavedPreviewKeys:[...unsavedKeys],tokens},(key,value)=>key==='dataUrl'?(value?'Included in Foundation JSON':null):value,2);
    source+='\n\n<!-- ads:contract -->\n'+M.contractMarkdown(page)+'\n<!-- /ads:contract -->';
    return M.prepareMarkdown(source+'\n\n<!-- ads:page-foundation -->\n## Current Foundation configuration\n\nThe following configuration is the applied state. Unfinished or invalid editor drafts are not applied. Reference assets are included in Foundation JSON.\n\n```json\n'+json+'\n```\n<!-- /ads:page-foundation -->',resolved);
  }
  window.ADSFoundation={ apply, get:()=>resolved, getVerification:()=>({unsavedPreviewKeys:[...unsavedKeys]}),format:(value,kind,options)=>M.format(value,kind,resolved.dataFormat,options), prepareCode:text=>M.prepareCode(text,resolved), prepareMarkdown:(text,names)=>M.prepareMarkdown(text,resolved,names), preparePageMarkdown, read };
  // "Draw in Figma" - a locally-running Figma Bridge Plugin (a separate
  // project, not part of this portal) draws the component into Figma from
  // the same contract shape its component-contract tooling already uses: a
  // component name, its currently configured properties and the resolved
  // design tokens it renders from - the plugin matches token names against
  // the library's own Figma variables. Only detail pages carry the static
  // [data-role="draw-figma-action"] mount; listing cards build their own
  // equivalent button directly in experience.js, since a card has no
  // configured-properties panel for componentProperties() to read.
  document.addEventListener('DOMContentLoaded',()=>{
    const mount=document.querySelector('[data-role="draw-figma-action"]');
    if(!mount) return;
    const name=()=>{
      const h1=document.querySelector('h1');
      if(!h1) return document.title.split(' - ')[0]||'Component';
      const clone=h1.cloneNode(true);clone.querySelectorAll('.component-status').forEach(n=>n.remove());
      return clone.textContent.trim()||'Component';
    };
    const button=document.createElement('button');
    button.type='button';button.className='btn-demo btn-demo--tertiary btn-demo--h32 is-icon-only';
    button.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
    const label='Draw '+name()+' in Figma';
    button.setAttribute('aria-label',label);button.title=label;
    button.addEventListener('click',()=>window.ADSFigmaBridge?.draw({component:name(),props:componentProperties(),tokens:resolved.tokens},button));
    mount.append(button);
  },{once:true});
  window.addEventListener('ads:foundation-change',e=>{const key=e.detail.key.replace(/^ads:/,'');if(!keys.includes(key)) return;if(e.detail.unsaved)unsavedKeys.add(key);else unsavedKeys.delete(key);if(e.detail.removed) drafts.delete(key);else drafts.set(key,e.detail.value);queueMicrotask(apply);});
  window.addEventListener('storage',e=>{
    if(e.key===null) {drafts.clear();unsavedKeys.clear();root.dataset.theme=preference('theme','light',['light','dark']);root.dataset.density=preference('density','comfortable',['comfortable','compact']);root.dir=preference('direction','ltr',['ltr','rtl']);}else {const key=e.key.replace(/^ads:/,'');drafts.delete(key);unsavedKeys.delete(key);}
    apply();
    const editor=location.pathname.match(/\/(foundations|typography|spacing|radius|borders|shadows|icons|grid-layout|data-format)\.html$/)?.[1];
    const editorKeys={foundations:['colors','bg-colors','status-colors','neutral-colors'],typography:['typography'],spacing:['spacing','sizing'],radius:['radius'],borders:['border','border-states'],shadows:['shadow'],icons:['icons','sizing'],'grid-layout':['grid-layout','sizing'],'data-format':['data-format']};
    if(!editor||!document.body||!(e.key===null||editorKeys[editor].some(k=>e.key==='ads:'+k))) return;
    const main=document.querySelector('main');if(main.querySelector('.ads-editor-conflict'))return;
    const notice=document.createElement('div');notice.className='ads-editor-conflict';notice.setAttribute('role','status');notice.textContent='Foundation changed in another tab. Reload to refresh these controls before editing. ';
    const reload=document.createElement('button');reload.type='button';reload.className='btn btn-ghost';reload.textContent='Reload controls';reload.addEventListener('click',()=>location.reload());notice.append(reload);
    main.querySelectorAll('input,select,textarea,button').forEach(el=>{if(!el.closest('.ads-foundation-toolbar,.page-outline')&&!el.matches('.ads-read-more,.guide-toggle-btn'))el.disabled=true;});
    main.prepend(notice);
  });
  new MutationObserver(apply).observe(root,{attributes:true,attributeFilter:['data-theme']});
  // Boot before the stylesheet is parsed, with the same resolver used later.
  apply();
  function renderData() {
    document.querySelectorAll('[data-format]').forEach(el=>{
      const kind=el.dataset.format;
      let value=el.dataset.value;if(kind==='range') {try{value=JSON.parse(value);}catch{value=null;}}
      if(el.dataset.missing==='true') value=null;
      const text=window.ADSFoundation.format(value,kind,{currency:el.dataset.currency,unit:el.dataset.unit});
      if(el.textContent!==text) el.textContent=text;
      el.classList.toggle('ads-data-skeleton',kind==='loading'&&resolved.dataFormat.loading==='skeleton');
      if(kind==='loading') {el.setAttribute('role','status');el.setAttribute('aria-label','Loading');}
      if(el.dataset.missing==='true') el.setAttribute('aria-label','No value');
      if(['redaction','full','partial'].includes(kind)) el.setAttribute('aria-label',kind==='full'||(kind==='redaction'&&resolved.dataFormat.redaction==='full')?'Value redacted':'Value partially redacted');
      if(kind==='large') {const exact=window.ADSFoundation.format(value,'number');el.title=exact;el.setAttribute('aria-label',exact);el.tabIndex=0;}
      if(el.matches('td,th')&&['number','currency','unit','large','percent'].includes(kind)) el.style.textAlign=resolved.dataFormat.tableAlign;
    });
    document.querySelectorAll('[data-format-space]').forEach(el=>{const chars={space:' ',nbsp:'\u00a0',narrow:'\u202f'};const value='Before'+chars[resolved.dataFormat.escapedSpace]+'After';if(el.textContent!==value) el.textContent=value;});
    document.querySelectorAll('.daterange-demo-arrow').forEach(el=>{if(el.textContent!==resolved.dataFormat.range)el.textContent=resolved.dataFormat.range;});
  }
  function bindExamples() {
    // Annotate actual value surfaces only; prose, IDs, phone numbers and code stay literal.
    document.querySelectorAll('main td, main .statistic-demo-value-text, main .description-demo-value').forEach(el=>{
      if(el.dataset.format||el.children.length) return;
      const value=el.textContent.trim();
      const column=el.matches('td')?el.closest('table')?.querySelector('thead tr')?.children[el.cellIndex]?.textContent.trim():null;
      const label=column||el.closest('.description-demo-item')?.querySelector('.description-demo-label')?.textContent||'';
      if(/\b(id|code|phone|mobile|account|postcode|zip|tracking)\b/i.test(label)||/^0\d+$/.test(value))return;
      if(/^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(value)||/^-?\d+(?:\.\d+)?$/.test(value)) {el.dataset.format='number';el.dataset.value=value.replaceAll(',','');}
      else if(/^\d{4}-\d{2}-\d{2}$/.test(value)) {el.dataset.format='date';el.dataset.value=value;}
      else if(/^[£$€₹]-?[\d,]+(?:\.\d+)?$/.test(value)) {el.dataset.format='currency';el.dataset.value=value.slice(1).replaceAll(',','');}
      else if(value==='–'||value==='—') {el.dataset.format='number';el.dataset.missing='true';}
    });
    document.querySelectorAll('.datepicker-demo-value.is-filled,.time-demo-value.is-filled,.daterange-demo-segment:not(.is-placeholder)').forEach(el=>{
      if(el.dataset.format) return;
      const raw=el.textContent.trim();let value;
      if(el.matches('.time-demo-value')) {const m=raw.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);if(m){const hour=Number(m[1])%12+(m[3]==='PM'?12:0);value='2026-03-14T'+String(hour).padStart(2,'0')+':'+m[2]+':00Z';}}
      else {const m=raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(m)value=m[3]+'-'+m[1]+'-'+m[2];else if(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(raw)){const date=new Date(raw+' 12:00:00 UTC');if(Number.isFinite(date.getTime()))value=date.toISOString().slice(0,10);}}
      if(value){el.dataset.format=el.matches('.time-demo-value')?'time':'date';el.dataset.value=value;}
    });
    document.querySelectorAll('.statistic-demo-skeleton,.table-demo-table td .skeleton-demo-line').forEach(el=>{if(!el.dataset.format){el.dataset.format='loading';el.dataset.value='';}});
    document.querySelectorAll('main [style]').forEach(el=>{
      if(el.closest('.type-row,.font-preview,pre,code,svg')||el.matches('.ads-text-content,.ads-read-more')) return;
      const size=el.style.fontSize, roleMatch=size.match(/--type-(\w+)-size/);
      const roles={11:'caption',12:'caption',13:'body',14:'body',16:'body',18:'h6',20:'h5',24:'h4',30:'h3',36:'h2',48:'h1'};
      const role=/^H[1-6]$/.test(el.tagName)?el.tagName.toLowerCase():roleMatch?roleMatch[1]:/px$/.test(size)?roles[parseFloat(size)]||'body':null;
      if(role&&M.typeDefaults[role]) {
        for(const [prop,suffix] of [['fontFamily','family'],['fontSize','size'],['fontWeight','weight'],['fontStyle','style'],['lineHeight','line-height'],['letterSpacing','tracking']]) {
          if(prop==='fontFamily'&&el.style.fontFamily.includes('--font-mono')) continue;
          const val='var(--type-'+role+'-'+suffix+')';if(el.style[prop]!==val) el.style[prop]=val;
        }
        // Follow the role's text color, while retaining authored semantic
        // status, brand and inverse-surface foreground colors.
        if(!el.style.color||/^var\(--(?:text-(?:hi|mid|dim)|type-\w+-color)\)$/.test(el.style.color)) {
          const color='var(--type-'+role+'-color)';if(el.style.color!==color) el.style.color=color;
        }
      }
    });
  }
  const unitInputs=new Map(), unitTexts=new Map();
  function unitControl(input) {
    if(unitInputs.has(input)||input.closest('.ads-unit-control')||input.disabled) return;
    const wrap=document.createElement('span');wrap.className='ads-unit-control';
    const display=input.cloneNode(false);display.removeAttribute('id');display.removeAttribute('name');display.removeAttribute('data-role');display.dataset.unitDisplay='';display.type='number';display.setAttribute('aria-label',(input.getAttribute('aria-label')||input.dataset.role||'Dimension')+' in selected units');
    const select=document.createElement('select');select.setAttribute('aria-label','Dimension unit');select.innerHTML='<option value="px">px</option><option value="rem">rem</option>';
    input.before(wrap);wrap.append(display,select);input.hidden=true;
    unitInputs.set(input,{display,select});
    function commit(event) {
      event.stopPropagation();
      const px=display.value===''?'':M.convert(display.value,resolved.unit,'px');
      input.value=px;input.dispatchEvent(new Event(event.type,{bubbles:true}));
      display.setAttribute('aria-invalid',input.getAttribute('aria-invalid')==='true'?'true':'false');
    }
    display.addEventListener('input',commit);display.addEventListener('change',commit);
    const choose=e=>{e.stopPropagation();setUnit(select.value);};
    select.addEventListener('input',choose);select.addEventListener('change',choose);
  }
  function setUnit(unit) {
    if(!['px','rem'].includes(unit)||unit===resolved.unit) return;
    window.ADSStorage.safeSet('ads:units',{unit});
    // Apply before another editor handler can restore the previous radio/select
    // value between the native input and change events. safeSet also retains an
    // unsaved preview and shows the storage warning when persistence fails.
    apply();
  }
  function updateUnits() {
    if(!document.body) return;
    document.querySelectorAll('[data-foundation-unit]').forEach(s=>{
      if(s.type==='radio') s.checked=s.value===resolved.unit;
      else s.value=resolved.unit;
    });
    // Only dimensions: percentages, weights, columns, opacity and time stay unchanged.
    document.querySelectorAll('input[data-dimension], input[data-role="grid-gutter-input"], input[data-role="letter-spacing"]').forEach(unitControl);
    unitInputs.forEach((control,input)=>{
      const {display,select}=control;
      if(document.activeElement!==display||control.unit!==resolved.unit) display.value=input.value===''?'':M.convert(input.value,'px',resolved.unit);
      control.unit=resolved.unit;
      for(const attr of ['min','max','step']) {const v=input.getAttribute(attr);if(v!=null&&v!=='any') display.setAttribute(attr,String(M.convert(v,'px',resolved.unit)));}
      if(!input.hasAttribute('step')) display.step=String(M.convert(1,'px',resolved.unit));
      display.disabled=input.disabled;select.value=resolved.unit;
    });
    document.querySelectorAll('main option').forEach(opt=>{
      if(!unitTexts.has(opt)&&/\d(?:px|\s+px)\b/.test(opt.textContent)) unitTexts.set(opt,opt.textContent);
    });
    unitTexts.forEach((original,el)=>{if(el.nodeType===Node.TEXT_NODE||el.matches('.system-card-scale')) return;const text=original.replace(/(-?\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)*)\s*px\b/g,(_,group)=>group.split('/').map(n=>String(M.convert(n,'px',resolved.unit))).join('/')+resolved.unit);if(el.textContent!==text) el.textContent=text;});
    document.querySelectorAll('[data-dimension-value]').forEach(el=>{const text=M.dimension(Number(el.dataset.dimensionValue),resolved.unit);if(el.textContent!==text) el.textContent=text;});
    document.querySelectorAll('.system-card-scale[data-role=scale]').forEach(el=>{
      if(!unitTexts.has(el)&&/^\d/.test(el.textContent.trim())) unitTexts.set(el,el.textContent);
      if(!unitTexts.has(el)) return;
      const text=unitTexts.get(el).replace(/\d+(?:\.\d+)?/g,n=>M.dimension(Number(n),resolved.unit));if(el.textContent!==text) el.textContent=text;
    });
    const main=document.querySelector('main');if(!main) return;
    const walker=document.createTreeWalker(main,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()) {const node=walker.currentNode;if(node.parentElement.closest('pre,code,script,style,option,.system-card-scale,.ads-foundation-toolbar,.ads-unit-control,[data-dimension-value]')) continue;if(!unitTexts.has(node)&&/\dpx\b/.test(node.textContent)) unitTexts.set(node,node.textContent);}
    unitTexts.forEach((original,node)=>{
      if(!node.isConnected) {unitTexts.delete(node);return;}
      if(node.nodeType!==Node.TEXT_NODE) return;
      const text=original.replace(/(-?\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)*)\s*px\b/g,(_,group)=>group.split('/').map(n=>String(M.convert(n,'px',resolved.unit))).join('/')+resolved.unit);
      if(node.textContent!==text) node.textContent=text;
    });
  }
  const READ_MORE_LINES=4;
  const observedText=new WeakSet();
  let textTimer, clampId=0, textResizeObserver;
  function scheduleText() { clearTimeout(textTimer);textTimer=setTimeout(setupText,80); }
  function textLineHeight(el) {
    const style=getComputedStyle(el);
    return parseFloat(style.lineHeight)||parseFloat(style.fontSize)*1.5;
  }
  function unwrapTextGroup(wrapper) {
    const btn=wrapper.nextElementSibling;
    while(wrapper.firstChild) wrapper.before(wrapper.firstChild);
    wrapper.remove();
    if(btn&&btn.classList.contains('ads-read-more')) btn.remove();
  }
  function buildTextGroup(run) {
    const parent=run[0].parentElement;
    const wrapper=document.createElement('div');
    wrapper.className='ads-text-content ads-text-clamped';
    wrapper.dataset.adsGroup='true';
    wrapper.id='ads-text-'+(++clampId);
    parent.insertBefore(wrapper,run[0]);
    run.forEach(r=>wrapper.append(r));
    // btn-ghost, not btn-primary - this toggles how much of a paragraph is
    // visible, not a page action, and the filled brand-red treatment was
    // visually outweighing the page's actual primary actions (audit UX20).
    const btn=document.createElement('button');btn.type='button';btn.className='ads-read-more btn btn-ghost';btn.textContent='Read More';btn.setAttribute('aria-controls',wrapper.id);btn.setAttribute('aria-expanded','false');btn.hidden=true;
    wrapper.after(btn);
    btn.addEventListener('click',()=>{const expanded=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(expanded));checkClamp(wrapper);});
    wrapper.addEventListener('focusin',()=>{if(wrapper.classList.contains('ads-text-clamped')){wrapper.classList.remove('ads-text-clamped');btn.setAttribute('aria-expanded','true');btn.textContent='Read Less';}});
    checkClamp(wrapper);
  }
  function setupText() {
    const eligible=[];
    document.querySelectorAll('main p, main .usage-desc, main .guide-copy, main .system-card-desc').forEach(el=>{
      // Documentation prose can expand. Component specimens, structured
      // readouts and metadata must keep their authored children and layout.
      const structured=el.closest('pre,code,button,a,label,summary,[role=button],.type-row,.font-preview,[role=alert],[role=status],.setup-error,.ads-no-clamp,[class*="-demo-"],.guide-dodont-demo')||el.matches('.panel-title,.guide-subhead,.page-title,.color-contrast,.color-popover-contrast,.color-rgba')||/(?:^|\s)[\w-]*(?:-label|-eyebrow|-meta|-status|-title|-value|-scale|-caption|-time)(?:\s|$)/.test(el.className)||el.querySelector('input,select,textarea,svg,img,button:not(.ads-read-more)');
      if(structured) return;
      if(!el.getClientRects().length) return;
      const style=getComputedStyle(el);
      if(!['block','inline','flow-root',''].includes(style.display||'')) return;
      if(!el.textContent.trim()) return;
      if(window.ResizeObserver&&!observedText.has(el)) {
        textResizeObserver ||= new ResizeObserver(scheduleText);
        textResizeObserver.observe(el);observedText.add(el);
      }
      eligible.push(el);
    });
    // Group consecutive sibling paragraphs (an "article") under one shared
    // clamp and one Read More/Read Less button, instead of one per paragraph -
    // a heading, image or other non-prose element still ends a run, so
    // unrelated sections never merge.
    const runs=[];
    let i=0;
    while(i<eligible.length) {
      let j=i;
      while(j+1<eligible.length&&eligible[j].nextElementSibling===eligible[j+1]&&eligible[j].parentElement===eligible[j+1].parentElement) j++;
      runs.push(eligible.slice(i,j+1));
      i=j+1;
    }
    // Reuse an existing group untouched (just re-checking its clamp state)
    // when its membership already matches - toggling expand/collapse changes
    // the grouped paragraphs' own layout box enough to refire their
    // ResizeObserver, and rebuilding on every such pass would wipe out the
    // very interaction that triggered it.
    const keepWrappers=new Set(), newRuns=[];
    for(const run of runs) {
      const parent=run[0].parentElement;
      if(parent.dataset&&parent.dataset.adsGroup==='true') {
        const current=Array.from(parent.children);
        if(current.length===run.length&&current.every((m,idx)=>m===run[idx])) {
          keepWrappers.add(parent);checkClamp(parent);continue;
        }
      }
      newRuns.push(run);
    }
    document.querySelectorAll('main .ads-text-content[data-ads-group]').forEach(w=>{if(!keepWrappers.has(w)) unwrapTextGroup(w);});
    newRuns.forEach(buildTextGroup);
  }
  function checkClamp(wrapper) {
    const btn=wrapper.nextElementSibling;if(!btn||!btn.classList.contains('ads-read-more')||!wrapper.getClientRects().length) return;
    const line=textLineHeight(wrapper);
    let limit=line*READ_MORE_LINES;
    // Measure the full text: clamped scrollHeight differs between browsers.
    wrapper.classList.remove('ads-text-clamped');
    // Grouped runs (multiple sibling paragraphs sharing one clamp) have a
    // margin between each paragraph, so a flat line-height*N budget can land
    // mid-line - clipping a bare sliver of the next paragraph's text instead
    // of a clean cut. Snap to the real bottom edge of the Nth rendered line
    // instead, measured per child so inline fragments (e.g. <code> spans) on
    // the same line don't get counted as separate lines.
    if(wrapper.children.length>1&&typeof wrapper.getBoundingClientRect==='function'&&typeof document.createRange==='function') {
      const wrapperTop=wrapper.getBoundingClientRect().top;
      const rects=[];
      for(const child of wrapper.children) {
        const r=document.createRange();r.selectNodeContents(child);
        rects.push(...Array.from(r.getClientRects()).filter(x=>x.height>0));
      }
      rects.sort((a,b)=>a.top-b.top);
      const lines=[];
      for(const r of rects) {
        const last=lines[lines.length-1];
        // Merge by vertical overlap, not a fixed top-coordinate tolerance -
        // a taller inline fragment sharing a line with plain text (e.g. an
        // emoji) can have a top several px off from its line-mate's, which
        // a small fixed tolerance miscounts as two separate lines.
        if(last&&r.top<last.bottom-2) {last.top=Math.min(last.top,r.top);last.bottom=Math.max(last.bottom,r.bottom);}
        else lines.push({top:r.top,bottom:r.bottom});
      }
      if(lines.length>=READ_MORE_LINES) limit=lines[READ_MORE_LINES-1].bottom-wrapperTop;
    }
    wrapper.style.setProperty('--ads-clamp-height',limit+'px');
    const overflow=wrapper.scrollHeight>limit+1;
    if(!overflow) {unwrapTextGroup(wrapper);return;}
    const expanded=overflow&&btn.getAttribute('aria-expanded')==='true';
    wrapper.classList.toggle('ads-text-clamped',overflow&&!expanded);
    btn.setAttribute('aria-expanded',String(expanded));
    btn.textContent=expanded?'Read Less':'Read More';
    btn.hidden=!overflow;
  }
  function labelColorFields() {
    document.querySelectorAll('.hex-input-wrap').forEach(wrap=>{
      const swatch=wrap.querySelector('input[type="color"]'),hex=wrap.querySelector('input[type="text"]');
      if(!swatch&&!hex) return;
      const field=wrap.closest('.color-field');
      let name=field?field.querySelector(':scope > .color-field-head .color-field-label')?.textContent.trim():null;
      const typeRow=wrap.closest('.type-row');
      if((!name||name==='Color')&&typeRow) {const level=typeRow.querySelector('.type-level-name')?.textContent.trim();if(level) name=level+' text';}
      if(!name||name==='Color') {
        const panelTitle=wrap.closest('.panel')?.querySelector(':scope > .panel-title-row > .panel-title,:scope > .panel-title')?.textContent.trim();
        const match=panelTitle&&panelTitle.match(/^Configure your (.+)$/i);
        if(match) name='Base '+match[1].toLowerCase();
      }
      const themeCol=wrap.closest('.theme-pair-col');
      const themeLabel=themeCol?themeCol.querySelector(':scope > .theme-pair-label-row > .theme-pair-label')?.textContent.trim():null;
      let theme=themeLabel?themeLabel.toLowerCase():'';
      const stateRow=wrap.closest('.usage-row[data-state]');
      if(!themeLabel&&stateRow) {
        if(!name) name=(stateRow.querySelector('.usage-label')?.textContent.trim()||'')+' border';
        const tag=wrap.closest('.state-color-item')?.querySelector('.state-color-tag')?.textContent.trim();
        theme=tag==='D'?'dark theme':tag==='L'?'light theme':'';
      }
      const subject=(name||'Color')+(/\bcolor$/i.test(name||'')?'':' color');
      const base=theme?subject+', '+theme:subject;
      if(swatch) swatch.setAttribute('aria-label',base+', color picker');
      if(hex) hex.setAttribute('aria-label',base+', hex value');
    });
  }
  function indicators() {
    document.querySelectorAll('.badge-required').forEach(el=>{el.className='ads-required';el.textContent='*';el.setAttribute('aria-label','Required');});
    document.querySelectorAll('.badge-optional').forEach(el=>el.remove());
    document.querySelectorAll('label').forEach(label=>{
      const input=label.control||label.querySelector('input,select,textarea');if(!input||!input.required) return;
      if(!label.querySelector('.ads-required')) {const star=document.createElement('span');star.className='ads-required';star.textContent='*';star.setAttribute('aria-hidden','true');const text=label.querySelector('span:not(.setup-error)');if(text) text.append(star);else input.before(star);}
    });
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const main=document.querySelector('main');if(!main) return;
    const typography=window.ADSStorage.safeGet('ads:typography');
    let legacyHeading=false;try {legacyHeading=JSON.parse(localStorage.getItem('ads:typography')||'null')?.headingScaleVersion!==M.headingScaleVersion;} catch {}
    if(typography&&legacyHeading) window.ADSStorage.safeSet('ads:typography',typography);
    const page=location.pathname.split('/').pop();
    let toolbar;
    if(foundationPages.has(page)) {
      toolbar=document.createElement('div');toolbar.className='ads-foundation-toolbar';
      if(unitPages.has(page)) {
        const group=document.createElement('div');group.className='ads-unit-choice';group.setAttribute('role','radiogroup');group.setAttribute('aria-labelledby','ads-unit-label');group.setAttribute('aria-describedby','ads-unit-note');
        const title=document.createElement('span');title.id='ads-unit-label';title.textContent='Design units';
        const options=document.createElement('div');options.className='ads-unit-options';
        for(const unit of ['px','rem']) {
          const label=document.createElement('label');label.className='radio-demo-field';
          const input=document.createElement('input');input.className='radio-demo-input';input.type='radio';input.name='ads-design-unit';input.dataset.foundationUnit='';input.value=unit;
          const circle=document.createElement('span');circle.className='radio-demo-circle radio-demo-circle--h16';circle.setAttribute('aria-hidden','true');
          const dot=document.createElement('span');dot.className='radio-demo-dot radio-demo-dot--h16';circle.append(dot);
          const text=document.createElement('span');text.className='radio-demo-label';text.textContent=unit;
          label.append(input,circle,text);options.append(label);
        }
        group.append(title,options);
        const note=document.createElement('span');note.className='ads-unit-note';note.id='ads-unit-note';note.textContent='1 rem = 16 px at the default browser size.';
        toolbar.append(group,note);
        const choose=e=>{if(e.target.matches('[data-foundation-unit]')) {e.stopPropagation();if(e.target.checked) setUnit(e.target.value);}};
        toolbar.addEventListener('input',choose);toolbar.addEventListener('change',choose);
      }
      const intro=main.querySelector(':scope > .component-meta')||main.querySelector(':scope > .page-lede')||main.querySelector(':scope > h1');if(intro) intro.after(toolbar);else main.prepend(toolbar);
      const exportButton=document.createElement('button');exportButton.type='button';exportButton.className='btn-demo btn-demo--neutral btn-demo--h40';exportButton.dataset.foundationExport='';exportButton.textContent='Export Foundation JSON';toolbar.append(exportButton);
      const download=(payload,name)=>{const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
      exportButton.addEventListener('click',()=>{
        const settings=Object.fromEntries(keys.map(k=>[k,read(k)]));
        let profile=null;try{profile=window.ADSProject?.read(localStorage);}catch{}
        const records={};for(const key of keys){try{records[key]=M.inspectRecord(key,localStorage.getItem('ads:'+key)).status;}catch{records[key]='unavailable';}}
        const context=profile?{productType:profile.productType,platforms:profile.platforms}:null;
        download({schemaVersion:1,context,settings,resolved:window.ADSFoundation.get(),resolvedThemes:Object.fromEntries(['light','dark'].map(theme=>[theme,M.resolve(settings,theme,profile)])),platformProfiles:M.resolvePlatformProfiles(settings,profile),implementationContract:M.contract,iconCatalog:M.iconCatalog,verification:{records,unsavedPreviewKeys:[...unsavedKeys],renderedAcceptance:'Not established by export; attach independent acceptance evidence.'}},'damco-foundation.json');
      });
      const backup=document.createElement('button');backup.type='button';backup.className='btn btn-ghost';backup.textContent='Back up saved settings';backup.dataset.foundationReadAction='';toolbar.prepend(backup);
      backup.addEventListener('click',()=>{
        const raw={};try{for(const key of keys)raw['ads:'+key]=localStorage.getItem('ads:'+key);download({schemaVersion:1,format:'Raw recovery backup; validate before importing',records:raw},'damco-foundation-backup.json');}catch{backup.textContent='Backup unavailable — storage cannot be read';}
      });
      // Restore: the counterpart "Back up saved settings" never had - a
      // user could save this exact file and have no way back in without
      // manually editing localStorage. Validates every record before
      // writing any of them (all-or-nothing), so a bad or foreign file
      // can't half-apply and leave a mixed, unreviewable state; each valid
      // record still goes through ADSStorage.safeSet's own schema check.
      const restoreInput=document.createElement('input');restoreInput.type='file';restoreInput.accept='application/json,.json';restoreInput.hidden=true;
      const restore=document.createElement('button');restore.type='button';restore.className='btn btn-ghost';restore.textContent='Restore from backup';toolbar.prepend(restoreInput,restore);
      const restoreStatus=document.createElement('span');restoreStatus.className='save-status';restoreStatus.setAttribute('role','status');restoreStatus.setAttribute('aria-live','polite');toolbar.append(restoreStatus);
      restore.addEventListener('click',()=>restoreInput.click());
      restoreInput.addEventListener('change',()=>{
        const file=restoreInput.files[0];restoreInput.value='';if(!file) return;
        const reader=new FileReader();
        reader.onload=()=>{
          let parsed;
          try{parsed=JSON.parse(reader.result);}catch{restoreStatus.textContent='This file is not valid JSON. Nothing was changed.';return;}
          if(!parsed||typeof parsed!=='object'||parsed.schemaVersion!==1||!parsed.records||typeof parsed.records!=='object'){restoreStatus.textContent='This doesn’t look like a settings backup file (expected the format "Back up saved settings" produces). Nothing was changed - this is a different format from Export Foundation JSON, which is implementation output, not something to restore from.';return;}
          // Foundation audit AT05/AT10 - a record present in the file with a
          // null value is a captured "no override at backup time", not an
          // absent one; skipping it on raw==null left whatever override was
          // set *after* the backup still in place, so a restore silently
          // turned into a merge. A key missing from records entirely is a
          // different case (unknown to this build, e.g. a newer backup) and
          // is named instead of silently merged in or mistaken for a failure.
          const toApply=[], skipped=[];
          for(const key of keys) {
            const recordKey='ads:'+key;
            if(!(recordKey in parsed.records)) continue;
            const raw=parsed.records[recordKey];
            if(raw===null){ toApply.push([key,null]); continue; }
            let value;try{value=JSON.parse(raw);}catch{restoreStatus.textContent='The "'+key+'" record in this file is corrupt. Nothing was changed.';return;}
            if(!M.validRecord('ads:'+key,value)){restoreStatus.textContent='The "'+key+'" record in this file failed validation. Nothing was changed.';return;}
            toApply.push([key,value]);
          }
          for(const recordKey of Object.keys(parsed.records)) {
            const bareKey=recordKey.replace(/^ads:/,'');
            if(recordKey.startsWith('ads:')&&!keys.includes(bareKey)) skipped.push(bareKey);
          }
          const skippedNote=skipped.length?' Not recognized by this version, left unchanged: '+skipped.join(', ')+'.':'';
          if(!toApply.length){restoreStatus.textContent='This backup file has no recognized settings to restore.'+skippedNote+' Nothing was changed.';return;}
          // Foundation audit AT06 - safeSet/safeRemove's return value used to
          // be ignored, so a storage-quota failure on any one record still
          // produced "Restored N settings. Reloading…" and reloaded over it,
          // discarding the only evidence of the partial write. Every mutation
          // result is checked below; on any failure the keys that did write
          // are rolled back to their pre-restore value instead of reloading
          // into a silent mixture of old and new settings.
          const previous=toApply.map(([key])=>['ads:'+key,localStorage.getItem('ads:'+key)]);
          const applied=[],failed=[];
          for(const [key,value] of toApply) {
            const write=()=>value===null?window.ADSStorage.safeRemove('ads:'+key):window.ADSStorage.safeSet('ads:'+key,value);
            const ok=window.ADSFoundationEditor?window.ADSFoundationEditor.withPersistence(write):write();
            (ok?applied:failed).push(key);
          }
          if(!failed.length){
            restoreStatus.textContent='Restored '+applied.length+' setting'+(applied.length===1?'':'s')+'.'+skippedNote+' Reloading…';
            setTimeout(()=>location.reload(),600);
            return;
          }
          const unresolved=[];
          for(const key of applied) {
            const prior=previous.find(p=>p[0]==='ads:'+key)[1];
            let rolledBack;
            try{const rollback=()=>prior===null?window.ADSStorage.safeRemove('ads:'+key):window.ADSStorage.safeSet('ads:'+key,JSON.parse(prior));rolledBack=window.ADSFoundationEditor?window.ADSFoundationEditor.withPersistence(rollback):rollback(); }
            catch{ rolledBack=false; }
            if(!rolledBack) unresolved.push(key);
          }
          restoreStatus.textContent='Restore failed for '+failed.join(', ')+' (storage is full or unavailable).'+(unresolved.length?' Could not roll back: '+unresolved.join(', ')+' - review these manually.':' Other restored settings were rolled back to their prior state.')+skippedNote+' Nothing was reloaded.';
        };
        reader.onerror=()=>{restoreStatus.textContent='This file could not be read. Nothing was changed.';};
        reader.readAsText(file);
      });
    }
    if(['spacing.html','grid-layout.html','icons.html'].some(p=>location.pathname.endsWith(p))) {
      const details=document.createElement('details');details.className='panel ads-sizing';details.innerHTML='<summary>Shared sizing</summary><p>Sizes apply to controls, targets, fallback icon sizes and the documentation layout. Touch targets remain at least 44 px. Icon configuration takes priority over the fallback icon size; explicit component size variants retain their own dimensions.</p>';
      const fields=document.createElement('div');fields.className='ads-sizing-fields';details.append(fields);
      const current=read('sizing')||{};
      for(const [key,min,max] of [['control',24,96],['target',44,96],['icon',12,64],['content',320,1920],['sidebar',180,400]]) {const label=document.createElement('label');label.className='ads-sizing-field';const title=document.createElement('span');title.className='ads-sizing-label';title.textContent=key[0].toUpperCase()+key.slice(1);label.append(title);const input=document.createElement('input');input.type='number';input.min=min;input.max=max;input.step='1';input.required=true;input.value=current[key]||M.sizingDefaults[key];input.dataset.dimension='';input.setAttribute('aria-label',key+' size');label.append(input);fields.append(label);const save=()=>{input.setAttribute('aria-invalid',String(!input.checkValidity()));if(!input.checkValidity())return;const payload={...(read('sizing')||{}),[key]:Number(input.value)};window.ADSStorage.safeSet('ads:sizing',payload);};input.addEventListener('input',save);input.addEventListener('change',save);}
      const reset=document.createElement('button');reset.id='resetSharedSizingBtn';reset.type='button';reset.className='btn btn-ghost';reset.textContent='Reset shared sizing';
      const status=document.createElement('span');status.className='save-status';status.setAttribute('role','status');
      reset.addEventListener('click',()=>{
        if(!window.ADSStorage.safeRemove('ads:sizing')){status.textContent='Reset could not be saved.';return;}
        details.querySelectorAll('input[data-dimension]').forEach(input=>{const key=input.getAttribute('aria-label').split(' ')[0];input.value=M.sizingDefaults[key];input.setAttribute('aria-invalid','false');});apply();status.textContent='Shared sizing defaults restored.';
      });const actions=document.createElement('div');actions.className='ads-sizing-actions';actions.append(reset,status);details.append(actions);
      toolbar.after(details);
    }
    if(location.pathname.endsWith('grid-layout.html')) {
      const panel=document.createElement('section');panel.className='panel';panel.innerHTML='<h2 class="panel-title">Resolved grid preview</h2><p class="get-library-copy">Uses the saved columns, gutter and grid system. Columns remain visible at narrow widths; real content should stack according to the documented layout patterns.</p><div class="ads-live-grid" aria-label="Resolved grid"></div>';
      toolbar.after(panel);
      const render=()=>{const grid=panel.querySelector('.ads-live-grid'),config=window.ADSFoundation.get(),n=Number(config.tokens['--grid-columns']);grid.style.gridTemplateColumns='repeat('+(config.gridSystem==='rows'?1:n)+', minmax(0,1fr))';const fragment=document.createDocumentFragment();for(let i=0;i<n;i++){const cell=document.createElement('span');cell.textContent=String(i+1);fragment.append(cell);}grid.replaceChildren(fragment);};
      window.addEventListener('ads:foundation-applied',render);render();
    }
    indicators();labelColorFields();apply();
    new MutationObserver(records=>{
      if(records.every(r=>r.target.closest&&r.target.closest('.ads-text-content,.ads-read-more,[data-format],.ads-unit-control'))) return;
      indicators();labelColorFields();bindExamples();renderData();updateUnits();scheduleText();
    }).observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['required','hidden']});
    main.addEventListener('change',()=>{updateUnits();scheduleText();});
    if(document.fonts) document.fonts.ready.then(scheduleText);
    window.addEventListener('resize',scheduleText);
  });
})();
