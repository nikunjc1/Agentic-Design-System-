/* Detail-page experiment. Existing component renderers remain responsible for behavior. */
(() => {
  'use strict';
  const catalog=window.ADSWorkbenchCatalog;
  if(!catalog)return;
  const file=location.pathname.split('/').pop();
  if(catalog.routes[file]){location.replace(catalog.routes[file]+location.search);return;}
  const pageInfo=catalog.pages.find(p=>p.file===file);
  if(!pageInfo)return;
  const isButtonPage=pageInfo.family==='components.html';
  const make=(tag,text,className)=>{const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;};
  const clone=value=>JSON.parse(JSON.stringify(value));
  document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});

  function init(){
    const main=document.querySelector('main'),propertyPanel=main?.querySelector('[data-role="copy-prompt-action"]')?.closest('section');
    const stage=[...main.querySelectorAll(':scope > section')].find(n=>/Live Preview/i.test(n.querySelector('h2')?.textContent||''));
    const matrix=stage?.querySelector('[data-role$="matrix-container"]');
    if(!propertyPanel||!matrix)return;
    const storageKey='ads:workbench:v1:'+file,empty=()=>({schemaVersion:1,native:{},foundationFollow:{},selection:{appearance:'',state:'',configuration:'',mode:'showcase'}});
    let state=empty(),saved=empty(),expectedRaw=null,storageBlocked=false,dirty=false,entries=[],selected=null,pending=false;
    // Use the same persisted unit as Foundation - affects the rendered dimension
    // readout in the stage caption and numeric dropdown labels (e.g. Size).
    const REM_PX=16;
    let lengthUnit=window.ADSFoundation.get().unit;
    const number=value=>String(Math.round(value*1000000)/1000000);
    function convertLengths(raw,unit=lengthUnit){
      if(!raw)return raw;
      // Preserve tokens and quoted text; only dimensional CSS literals convert.
      return String(raw).replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|var\(--[^)]+\)|(-?(?:\d*\.)?\d+)(px|rem)\b/g,(match,value,from)=>value===undefined?match:number(Number(value)*(from===unit?1:from==='px'?1/REM_PX:REM_PX))+unit);
    }
    // The rest of the contract pipeline (component-contract-model.js's
    // compile()/blank(), component-contract-runtime.js's own capture() and
    // mount(), and the Figma plugin's adapter.js) all key n.styles by
    // camelCase JS style-property names (n.styles.borderRadius), the same
    // convention el.style.borderRadius/getComputedStyle(el).borderRadius
    // use - compile()'s styleBindings numeric-suffix list ('fontWeight',
    // 'flexGrow', ...) and adapter.js's every property read (s.fontSize,
    // s.lineHeight, s.borderRadius, s.backgroundColor, ...) only recognize
    // that form. This capture() instead stored the literal kebab-case CSS
    // property name used to query getComputedStyle/getPropertyValue (e.g.
    // 'border-radius'), which is required for *reading* the computed value
    // but was never converted before being written into n.styles - so
    // every multi-word property (corner radius, font size, line height,
    // padding, background, border color, box-shadow, flex/justify
    // properties - anything with a hyphen) silently failed every lookup
    // downstream and fell back to adapter.js's hardcoded defaults (14px
    // font, 0 radius, black/transparent fills, 400 weight, no gap/padding).
    // Only single-word properties (color, gap, opacity, width, height,
    // display) ever happened to match and work. This is why corner radius,
    // font size and line height "weren't picking up" in Figma - not a
    // Figma-side bug, every export (Copy prompt/code, Download JSON/HTML,
    // Draw in Figma) shares this one capture(), so all five were affected
    // identically; HTML/CSS text output partly masked it because a kebab-
    // case string is still syntactically valid inside a style="..." attribute
    // even though it was never actually reaching compile()'s or the live
    // preview's own property lookups correctly either.
    function toCamel(property){return property.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());}
    const canonicalLabel=raw=>convertLengths(raw,'px');
    const nativePanels=[propertyPanel],nativeFields=()=>nativePanels.flatMap(panel=>[...panel.querySelectorAll('.multiselect[data-role],input[data-role],select[data-role],textarea[data-role]')]).filter(n=>!n.closest('.multiselect')||n.classList.contains('multiselect'));
    const initialNative=readNative();
    try{
      expectedRaw=localStorage.getItem(storageKey);
      if(expectedRaw){const record=JSON.parse(expectedRaw);if(!validRecord(record))throw new Error('Unreadable saved customization.');state=record;saved=clone(record);}
    }catch{storageBlocked=true;}
    state.foundationFollow||={};saved.foundationFollow||={};
    let applyingFoundation=false;
    const foundationBindings=[];

    document.body.classList.add('wb-page');
    if(isButtonPage)document.body.classList.add('wb-button-page');
    const header=make('header',null,'wb-header');
    for(const child of [...main.children]){if(child===propertyPanel)break;if(!child.matches('.page-outline,.setup-notice'))header.append(child);}
    main.querySelector('.page-outline')?.remove();
    // The inspector sits in a grid area that spans both the header row and
    // the center row (see .wb-layout's grid-template-areas) so it starts
    // level with the header instead of leaving blank space above it while
    // the header (title/description/style selector) occupies the left column.
    const layout=make('div',null,'wb-layout'),center=make('div',null,'wb-center'),inspector=make('aside',null,'wb-inspector');
    inspector.setAttribute('aria-label','Component customization');layout.append(header,center,inspector);main.prepend(layout);
    inspector.append(make('h2','Customize'),make('p','Configure the component properties below.','wb-subtitle'));
    // Save/Cancel/Reset reuse the library's own Primary/Secondary/Tertiary
    // button styling (.btn-demo--*, the same classes "Copy prompt"/"Copy
    // code" use) instead of a separate ad-hoc button look, and live in a
    // sticky footer at the bottom of the inspector instead of its header -
    // appended once the rest of the inspector's content exists (see below).
    const savebar=make('div',null,'wb-savebar'),save=button('Save',saveSettings),cancel=button('Cancel',cancelSettings),reset=button('',resetSettings),status=make('p',null,'wb-status');
    save.className='btn-demo btn-demo--primary btn-demo--h36';cancel.className='btn-demo btn-demo--secondary btn-demo--h36';
    // Reset is icon-only so "Save changes"/"Cancel" keep enough width to
    // never crop their label - a native title gives it a hover tooltip,
    // the same convention every other icon-only action in this app uses.
    reset.className='btn-demo btn-demo--tertiary btn-demo--h36 is-icon-only';
    reset.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>';
    reset.setAttribute('aria-label','Reset');reset.title='Reset';
    status.setAttribute('role','status');status.setAttribute('aria-live','polite');savebar.append(save,cancel,reset,status);inspector.append(propertyPanel);
    propertyPanel.querySelector('.panel-title').textContent='Component properties';
    if(isButtonPage){
      propertyPanel.querySelector('.panel-title').textContent='Button properties';
      propertyPanel.querySelector('.get-library-copy').textContent='Set the button’s size, content, corners and label.';
    }
    // Avatar.Group has one genuine customization control outside the main Properties section.
    const avatarGroup=main.querySelector('[data-role="avatar-group-view-select"]')?.closest('.type-control');
    if(avatarGroup){const extra=make('div',null,'wb-additional');extra.append(make('h3','Avatar group'),avatarGroup);inspector.append(extra);nativePanels.push(extra);Object.assign(initialNative,readNative());}

    const toolbar=make('div',null,'wb-toolbar');
    // Button style/Appearance/State configure what the preview shows, same
    // as every other curated property (Size, Content, ...) - they live at
    // the top of Component properties instead of a separate toolbar row.
    // The Dual Icon demo shares this family for routing purposes but isn't
    // one of the plain button styles a person picks from this dropdown -
    // it stays reachable as its own component, just not listed here.
    const siblings=catalog.pages.filter(p=>p.family===pageInfo.family&&p.file!=='button-primary-icon.html');
    const configGrid=propertyPanel.querySelector('.border-config-grid')||propertyPanel;
    let family=null;
    if(siblings.length>1){family=selectField('Button style',configGrid,'wb-family');setOptions(family,siblings.map(p=>({value:p.file,label:p.name})),file);family.addEventListener('change',()=>{location.href=family.value;});}
    const appearance=selectField('Appearance',configGrid),previewState=selectField('State',configGrid);
    configGrid.prepend(...[family?.closest('label'),appearance.closest('label'),previewState.closest('label')].filter(Boolean));
    const configuration=selectField('Configuration',toolbar);
    center.append(toolbar,stage);stage.classList.add('wb-stage');stage.setAttribute('aria-label','Live component preview');
    // Exports (and the Showcase/Compare mode toggle) sit in a bar at the top
    // of the Preview Board, mirroring the caption bar already at its bottom,
    // rather than a separate toolbar row or trailing below the whole board.
    const exports=make('div',null,'wb-exports');
    const iconButton=(label,handler,svg)=>{const node=button('',handler);node.className='btn-demo btn-demo--tertiary btn-demo--h40 is-icon-only';node.innerHTML=svg;node.setAttribute('aria-label',label);node.title=label;return node;};
    const exportActions=make('div',null,'wb-export-actions');
    exportActions.append(
      iconButton('Copy prompt',()=>copyExport('prompt'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'),
      iconButton('Copy preview code',()=>copyExport('code'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>'),
      iconButton('Download JSON',()=>exportFile('json'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>'),
      iconButton('Download HTML',()=>exportFile('html'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="54.6 80.6 402.8 451.4" aria-hidden="true" focusable="false"><path fill="#E44D26" d="M107.6 471l-33-370.4h362.8l-33 370.2L255.7 512"/><path fill="#F16529" d="M256 480.5V131H404.3L376 447"/><path fill="#EBEBEB" d="M142 176.3h114v45.4h-64.2l4.2 46.5h60v45.3H154.4M156.4 336.3H202l3.2 36.3 50.8 13.6v47.4l-93.2-26"/><path fill="#FFFFFF" d="M369.6 176.3H255.8v45.4h109.6M361.3 268.2H255.8v45.4h56l-5.3 59-50.7 13.6v47.2l93-25.8"/></svg>')
    );
    const figmaMount=propertyPanel.querySelector('[data-role="draw-figma-action"]');if(figmaMount)exportActions.append(figmaMount);
    const modes=make('div',null,'wb-mode'),single=button('Showcase',()=>changeMode('showcase')),compare=button('Compare states',()=>changeMode('compare'));
    modes.setAttribute('role','group');modes.setAttribute('aria-label','Preview mode');modes.append(single,compare);
    // Showcase/Compare sits at the left of the Preview Board's top bar; the
    // export/share actions (copy, downloads, Figma) sit at the right.
    exports.append(modes,exportActions);
    stage.prepend(exports);
    const caption=make('div',null,'wb-stage-caption'),captionName=make('span'),captionHint=make('span','Live preview · actual rendered component');caption.dataset.unitManaged='';caption.append(captionName,captionHint);stage.append(caption);
    function updatePreviewGeometry(){
      if(!isButtonPage||!selected)return;
      const rect=selected.root.getBoundingClientRect();
      const divisor=lengthUnit==='rem'?REM_PX:1;
      const readable=value=>String(Number((value/divisor).toFixed(lengthUnit==='rem'?4:2)));
      captionHint.textContent=readable(rect.width)+' × '+readable(rect.height)+' '+lengthUnit;
      captionHint.setAttribute('aria-label','Rendered button dimensions: '+captionHint.textContent);
    }
    const sizeObserver=isButtonPage&&window.ResizeObserver?new ResizeObserver(updatePreviewGeometry):null;
    if(isButtonPage)main.addEventListener('scroll',updatePreviewGeometry,true);
    center.append(make('p','Exports contain the selected appearance and state. Save keeps these settings in this browser.','wb-export-note'));
    const docs=make('details',null,'wb-docs');
    const docsSummary=make('summary','Usage, accessibility & component guidance');
    const docsChev=make('span',null,'chev');
    docsChev.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    docsSummary.append(docsChev);
    docs.append(docsSummary);center.append(docs);
    for(const section of [...main.querySelectorAll(':scope > section')]){
      if(/Try it|Interactive example/i.test(section.querySelector('h2')?.textContent||'')){section.classList.add('wb-interactive');docs.before(section);}else docs.append(section);
    }
    // Keep supplementary sections, including Try it examples, available below the focused workspace.
    for(const section of [...main.querySelectorAll(':scope > details')])docs.append(section);

    propertyPanel.id||='wb-properties';
    const inspectorHeader=make('div',null,'wb-inspector-header');
    for(const node of [...inspector.children]){if(node===propertyPanel)break;inspectorHeader.append(node);}inspector.prepend(inspectorHeader);
    // Length unit is a general display preference (also drives the live
    // dimension readout in the stage caption above), independent of any
    // per-part editing - it stays even though Atomic styles is gone.
    const unitRow=make('div',null,'wb-unit-row'),unitLabel=make('span','Length unit','wb-unit-label');
    const unitToggle=make('div',null,'wb-mode'),pxUnitBtn=button('px',()=>setLengthUnit('px')),remUnitBtn=button('rem',()=>setLengthUnit('rem'));
    unitToggle.setAttribute('role','group');unitToggle.setAttribute('aria-label','Length value unit');unitToggle.append(pxUnitBtn,remUnitBtn);
    unitRow.append(unitLabel,unitToggle);inspectorHeader.querySelector('h2').after(unitRow);
    function setLengthUnit(next){window.ADSFoundation.setUnit(next);syncLengthUnit();}
    function syncLengthUnit(){
      lengthUnit=window.ADSFoundation.get().unit;
      pxUnitBtn.setAttribute('aria-pressed',String(lengthUnit==='px'));remUnitBtn.setAttribute('aria-pressed',String(lengthUnit==='rem'));
      if(selected){syncFoundationPresets();refresh();}
    }
    pxUnitBtn.setAttribute('aria-pressed',String(lengthUnit==='px'));remUnitBtn.setAttribute('aria-pressed',String(lengthUnit==='rem'));
    const inspectorFooter=make('div',null,'wb-inspector-footer');inspectorFooter.append(savebar);inspector.append(inspectorFooter);

    // Native menus offer finite presets. Radius and control-height menus follow
    // the nearest Foundation value until the user makes an explicit choice.
    // Geometric sizes (avatars, icon boxes, etc.) retain their own size model.
    for(const control of nativeFields().filter(n=>n.classList.contains('multiselect'))){
      const role=control.dataset.role,values=[...control.querySelectorAll('.multiselect-options input')].map(n=>Number(n.value));
      const kind=/radius/.test(role)?'radius':/size-mount/.test(role)&&values.includes(40)&&values.every(n=>Number.isFinite(n)&&n>=24&&n<=56)?'size':null;
      if(!kind)continue;
      const token=kind==='radius'?'--radius-md':'--size-control';
      if(!(role in state.foundationFollow))state.foundationFollow[role]=!(role in state.native);
      if(!(role in saved.foundationFollow))saved.foundationFollow[role]=state.foundationFollow[role];
      foundationBindings.push({control,role,token});
    }
    function syncFoundationPresets(){
      applyingFoundation=true;
      try{for(const {control,role,token}of foundationBindings){
        const px=window.ADSFoundationModel.toPx(window.ADSFoundation.get().tokens[token]);
        const follows=state.foundationFollow?.[role]===true;
        if(!follows||!Number.isFinite(px))continue;
        const inputs=[...control.querySelectorAll('.multiselect-options input')].filter(n=>Number.isFinite(Number(n.value)));
        const closest=inputs.reduce((best,n)=>!best||Math.abs(Number(n.value)-px)<Math.abs(Number(best.value)-px)?n:best,null);
        if(!closest)continue;
        for(const input of inputs){const checked=input===closest;if(input.checked!==checked){input.checked=checked;input.dispatchEvent(new Event('change',{bubbles:true}));}}
      }}finally{applyingFoundation=false;}
    }

    for(const select of [configuration,appearance,previewState])select.addEventListener('change',()=>{
      state.selection.configuration=configuration.value;state.selection.appearance=appearance.value;state.selection.state=previewState.value;refresh();markDirty();
    });
    nativePanels.forEach(panel=>panel.addEventListener('input',nativeChanged));
    nativePanels.forEach(panel=>panel.addEventListener('change',nativeChanged));
    function nativeChanged(event){if(applyingFoundation||event.target.closest('.panel-title-actions'))return;const control=event.target.closest('.multiselect');if(control&&control.dataset.role in state.foundationFollow)state.foundationFollow[control.dataset.role]=false;state.native=readNative();markDirty();}
    const observer=new MutationObserver(()=>{if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;refresh();});}});
    function observe(){observer.observe(matrix,{childList:true,subtree:true});}
    function gatherEntries(){
      const list=[];
      [...matrix.querySelectorAll('.button-matrix')].forEach((table,tableIndex)=>{
        const config=canonicalLabel(table.closest('.button-matrix-combo')?.querySelector('.button-matrix-combo-label')?.textContent.trim()||'Configuration '+(tableIndex+1));
        const types=[...table.querySelectorAll(':scope > thead > tr > th')].slice(1).map(n=>canonicalLabel(n.textContent.trim()));
        [...table.querySelectorAll(':scope > tbody > tr')].forEach((row,rowIndex)=>{
          const stateName=canonicalLabel(row.querySelector(':scope > th')?.textContent.trim()||'State '+(rowIndex+1));
          [...row.querySelectorAll(':scope > td')].forEach((cell,column)=>{if(cell.firstElementChild)list.push({table,tableIndex,row,cell,root:cell.firstElementChild,config,type:types[column]||'Default',state:stateName,key:JSON.stringify([config,types[column]||'Default',stateName])});});
        });
      });return list;
    }
    function refresh(){
      observer.disconnect();
      entries=gatherEntries();if(!entries.length){observe();return;}
      const configs=[...new Set(entries.map(e=>e.config))];setOptions(configuration,configs,state.selection.configuration);
      configuration.closest('label').hidden=configs.length<2;
      const types=[...new Set(entries.filter(e=>e.config===configuration.value).map(e=>e.type))];
      const initialType=pageInfo.family==='components.html'?types.find(t=>t.toLowerCase().replace(/[^a-z]/g,'')===(document.body.dataset.buttonType||'').replace(/[^a-z]/g,'')):null;
      setOptions(appearance,types,state.selection.appearance||initialType);
      const states=[...new Set(entries.filter(e=>e.config===configuration.value&&e.type===appearance.value).map(e=>e.state))];setOptions(previewState,states,state.selection.state);
      selected=entries.find(e=>e.config===configuration.value&&e.type===appearance.value&&e.state===previewState.value)||entries[0];
      state.selection={...state.selection,configuration:selected.config,appearance:selected.type,state:selected.state};
      matrix.querySelectorAll('.wb-selected-cell,.wb-selected-row,.wb-selected-combo').forEach(n=>n.classList.remove('wb-selected-cell','wb-selected-row','wb-selected-combo'));
      selected.cell.classList.add('wb-selected-cell');selected.row.classList.add('wb-selected-row');selected.table.closest('.button-matrix-combo')?.classList.add('wb-selected-combo');
      stage.classList.toggle('wb-showcase',state.selection.mode!=='compare');single.setAttribute('aria-pressed',String(state.selection.mode!=='compare'));compare.setAttribute('aria-pressed',String(state.selection.mode==='compare'));
      captionName.textContent=selected.type+' / '+selected.state;
      // A comparison matrix suppresses Tab stops. The focused showcase restores native focusability.
      for(const entry of entries)for(const node of [entry.root,...entry.root.querySelectorAll('button,input,select,textarea,a')]){
        if(!node.matches('button,input,select,textarea,a[href]'))continue;
        if(!node.hasAttribute('data-wb-tabindex'))node.dataset.wbTabindex=node.getAttribute('tabindex')??'native';
        if(entry===selected&&state.selection.mode!=='compare'&&!node.disabled){if(node.dataset.wbTabindex==='-1'||node.dataset.wbTabindex==='native')node.removeAttribute('tabindex');else node.setAttribute('tabindex',node.dataset.wbTabindex);}
        else node.setAttribute('tabindex','-1');
      }
      observe();updateStatus();
      if(sizeObserver){sizeObserver.disconnect();sizeObserver.observe(selected.root);}
      updatePreviewGeometry();
    }
    function changeMode(mode){state.selection.mode=mode;refresh();markDirty();}
    function button(label,handler,extra=''){const node=make('button',label,'wb-button '+extra);node.type='button';node.addEventListener('click',handler);return node;}
    function selectField(label,parent,className=''){const wrapper=make('label',null,'wb-field '+className);wrapper.append(make('span',label));const select=make('select');select.setAttribute('aria-label',label);wrapper.append(select);parent.append(wrapper);return select;}
    function setOptions(select,values,preferred){const options=values.map(v=>typeof v==='string'?{value:v,label:v}:v),previous=preferred===undefined?select.value:preferred;select.replaceChildren(...options.map(v=>{const option=make('option',convertLengths(v.label));option.value=v.value;return option;}));select.value=options.some(v=>v.value===previous)?previous:options[0]?.value||'';}
    function readNative(){return Object.fromEntries(nativeFields().filter(n=>n.dataset.role).map(n=>[n.dataset.role,n.classList.contains('multiselect')?[...n.querySelectorAll('input:checked')].map(i=>i.value):n.type==='checkbox'?n.checked:n.value]));}
    function restoreNative(values){for(const control of nativeFields()){
      const value=values[control.dataset.role];if(value===undefined)continue;
      if(control.classList.contains('multiselect')){for(const input of control.querySelectorAll('input[type=checkbox]')){input.checked=Array.isArray(value)&&value.includes(input.value);input.dispatchEvent(new Event('change',{bubbles:true}));}}
      else{if(control.type==='checkbox')control.checked=value===true;else control.value=value;control.dispatchEvent(new Event('input',{bubbles:true}));control.dispatchEvent(new Event('change',{bubbles:true}));}
    }}
    function validRecord(record){
      const plain=n=>n&&typeof n==='object'&&!Array.isArray(n);
      if(!plain(record)||record.schemaVersion!==1||!plain(record.native)||!plain(record.selection)||!['showcase','compare'].includes(record.selection.mode))return false;
      if(record.foundationFollow!==undefined&&(!plain(record.foundationFollow)||Object.values(record.foundationFollow).some(v=>typeof v!=='boolean')))return false;
      if(JSON.stringify(record).length>1000000||/"(?:__proto__|constructor|prototype)"\s*:/.test(JSON.stringify(record)))return false;
      return true;
    }
    function markDirty(){dirty=true;save.disabled=storageBlocked;cancel.disabled=false;updateStatus();}
    function updateStatus(message){save.disabled=storageBlocked||!dirty;cancel.disabled=!dirty;status.textContent=message||(storageBlocked?'Saved settings could not be read or changed elsewhere. They are preserved; reload or Reset to continue.':dirty?'Unsaved changes · preview only':expectedRaw?'Saved in this browser':'Using library defaults');}
    function saveSettings(){
      const invalid=inspector.querySelector(':invalid');if(invalid){invalid.reportValidity();invalid.focus();return;}
      state.native=readNative();try{if(storageBlocked||localStorage.getItem(storageKey)!==expectedRaw)throw new Error('Saved settings changed in another tab. Reload before saving.');if(!validRecord(state))throw new Error('Customization contains an invalid value.');const raw=JSON.stringify(state);localStorage.setItem(storageKey,raw);expectedRaw=raw;saved=clone(state);dirty=false;updateStatus();}catch(error){updateStatus('Could not save: '+error.message);}
    }
    function cancelSettings(){state=clone(saved);state.foundationFollow||={};applyingFoundation=true;try{restoreNative({...initialNative,...state.native});}finally{applyingFoundation=false;}syncFoundationPresets();dirty=false;setTimeout(()=>{refresh();dirty=false;updateStatus();},100);}
    function resetSettings(){try{if(!storageBlocked&&localStorage.getItem(storageKey)!==expectedRaw)throw new Error('Settings changed in another tab. Reload first.');localStorage.removeItem(storageKey);expectedRaw=null;storageBlocked=false;state=empty();for(const {role}of foundationBindings)state.foundationFollow[role]=true;saved=clone(state);applyingFoundation=true;try{restoreNative(initialNative);}finally{applyingFoundation=false;}syncFoundationPresets();dirty=false;setTimeout(()=>{refresh();dirty=false;updateStatus();},100);}catch(error){updateStatus('Could not reset: '+error.message);}}
    window.addEventListener('storage',event=>{if(event.key===storageKey||event.key===null){storageBlocked=true;updateStatus();}});
    window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});

    // Selected-preview snapshots intentionally describe one configuration. Existing authored
    // library contracts remain available when this experimental workspace is not mounted.
    // Foundation linkage: a captured computed style (e.g. "16px", "rgb(255,3,26)")
    // carries no record of WHICH Foundation token produced it, even when it's
    // an exact, intentional Foundation value - only an element's own inline
    // style (checked above) was ever recognized as "linked". Built once per
    // capture() and consulted for every property that isn't already an inline
    // var() reference, substituting var(--token) wherever the rendered value
    // exactly matches a current Foundation token (colors compared via the
    // browser's own normalization, so "#FF031A" matches "rgb(255,3,26)").
    let tokenLookup=null;
    // Matching is intentionally narrow: generic/trivial values ("none",
    // "auto", "normal", "0", "static", a bare "0px"...) are extremely common
    // and collide with unrelated tokens by pure coincidence (float:none
    // matching a --shadow-none token, flex-grow:0 matching a --layer token
    // that also happens to be "0") - matching those produced actively wrong,
    // misleading output, not just a missed opportunity. Only genuine colors
    // (via the browser's own color normalization) and non-zero px/rem
    // lengths are eligible to link at all.
    const LENGTH_TOKEN_PATTERN=/^-?(?:\d*\.)?\d+(?:px|rem)$/,ZERO_LENGTH_PATTERN=/^-?0(?:px|rem)$/;
    // Several unrelated token families land on the same literal pixel value
    // (an 8px gap and an 8px radius are both just "8px") - when more than one
    // token matches, prefer whichever family actually describes this CSS
    // property, instead of an arbitrary first-found token with the right
    // number but the wrong name.
    const LENGTH_PROPERTY_PREFIXES={
      'padding-top':'--space-','padding-right':'--space-','padding-bottom':'--space-','padding-left':'--space-',
      'margin-top':'--space-','margin-right':'--space-','margin-bottom':'--space-','margin-left':'--space-',
      'gap':'--space-','row-gap':'--space-','column-gap':'--space-',
      'border-radius':'--radius-','border-top-left-radius':'--radius-','border-top-right-radius':'--radius-','border-bottom-left-radius':'--radius-','border-bottom-right-radius':'--radius-',
      'font-size':'--type-','letter-spacing':'--type-',
      'border-top-width':'--border-width-','border-right-width':'--border-width-','border-bottom-width':'--border-width-','border-left-width':'--border-width-'
    };
    function buildTokenLookup(){
      const tokens=window.ADSFoundation.get().tokens,byLength=new Map(),byColor=new Map();
      const scratch=document.createElement('div');scratch.style.cssText='position:absolute;visibility:hidden;pointer-events:none';document.body.append(scratch);
      for(const [name,raw] of Object.entries(tokens)){
        const str=String(raw).trim();if(!str)continue;
        if(LENGTH_TOKEN_PATTERN.test(str)&&!ZERO_LENGTH_PATTERN.test(str)){if(!byLength.has(str))byLength.set(str,[]);byLength.get(str).push(name);}
        scratch.style.color='';try{scratch.style.color=str;}catch{}
        if(scratch.style.color){const normalized=getComputedStyle(scratch).color;if(normalized&&normalized!=='rgba(0, 0, 0, 0)'&&!byColor.has(normalized))byColor.set(normalized,name);}
      }
      scratch.remove();
      return {byLength,byColor};
    }
    function matchToken(value,property){
      if(!tokenLookup||!value)return null;
      const trimmed=String(value).trim();
      if(LENGTH_TOKEN_PATTERN.test(trimmed)&&!ZERO_LENGTH_PATTERN.test(trimmed)){
        const candidates=tokenLookup.byLength.get(trimmed);
        if(candidates&&candidates.length){
          const prefix=LENGTH_PROPERTY_PREFIXES[property],preferred=prefix&&candidates.find(name=>name.startsWith(prefix));
          // A single candidate is unambiguous regardless of property. With
          // several candidates and no property-specific prefix to prefer
          // one, picking any of them would be a guess dressed up as a
          // match (e.g. an icon-only button's 24px height landing on
          // --radius-24 purely because it came first) - leave it as a
          // literal rather than fabricate a semantically arbitrary link.
          if(preferred)return 'var('+preferred+')';
          if(candidates.length===1)return 'var('+candidates[0]+')';
          return null;
        }
      }
      const name=tokenLookup.byColor.get(trimmed);
      return name?'var('+name+')':null;
    }
    function capture(){
      const M=window.ADSComponentContract,c=M.blank(pageInfo.name);c.id=M.id(file.replace('.html',''));tokenLookup=buildTokenLookup();
      let notes;
      if(isButtonPage){
        const built=captureButtonProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='Rendered snapshot of the selected appearance, with State, Size and Corner radius captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Content (icon placement) is exposed as independent Boolean properties and the label as a Text property, rather than crossed, to stay inside Figma’s 256-variant-per-set limit; Appearance/Button style stay a page-level choice (draw again from another appearance’s page for that variant). Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else{
        c.anatomy=snapshot(selected.root,'root',0);
        // The selected preview is only one state (Rest/Hover/Pressed/.../Loading)
        // of this same type+configuration - the matrix already renders every
        // other state live in the DOM (for "Compare states"), so capture those
        // too as contract variants instead of exporting just the one state the
        // user happened to be looking at.
        const sameGroup=entries.filter(e=>e.config===selected.config&&e.type===selected.type);
        const stateOptions=[...new Set(sameGroup.map(e=>e.state))];
        if(stateOptions.length>1){
          c.properties=[{id:'state',name:'State',type:'options',options:stateOptions,default:selected.state}];
          c.selection={state:selected.state};
          c.variants=captureStateVariants(c.anatomy,sameGroup);
        }else{c.properties=[];c.selection={};c.variants=[];}
        notes='Rendered snapshot of the selected type/configuration, with every available state ('+stateOptions.join(', ')+') captured as a "state" variant. Native property IDs retain canonical values; anatomy styles and tokens use context.unit. Interaction rules and unseen configurations require authored behavior bindings.';
      }
      const foundation=window.ADSFoundation.get();c.tokens={...foundation.tokens};c.context={theme:foundation.theme,unit:foundation.unit,direction:document.documentElement.dir||'ltr',gridSystem:foundation.gridSystem,iconStyle:foundation.iconStyle,dataFormat:clone(foundation.dataFormat)};
      c.source={page:file,kind:'selected-preview-snapshot',configuration:clone(state.selection),nativeProperties:readNative(),nativeDimensionUnit:'px',foundationFollow:clone(state.foundationFollow),notes};
      c.accessibility=['Retain native semantics and verify keyboard operation in the target application.','This snapshot preserves configured accessible names; it does not certify contrast or conformance.'];M.assert(c);return c;
    }
    // Button pages additionally expose Size and Corner radius as real,
    // crossed Figma variant dropdowns alongside State (8 sizes x 5 radii x 6
    // states = 240, inside Figma's 256-variant-per-set ceiling), the button
    // label as a bound Text property, and icon placement as independent
    // Boolean properties - matching how a production Figma kit (e.g. Ant
    // Design's own Button) exposes these, instead of a single flat "state"
    // property. Appearance/Button style isn't crossed in: combined with the
    // three axes above it would blow the 256 ceiling many times over (would
    // require pulling data from the other seven sibling pages too), so which
    // appearance to draw remains a page-level choice, same as today.
    function captureButtonProperties(){
      const M=window.ADSComponentContract;
      const baseAnatomy=snapshot(selected.root,'root',0);
      const sizeControl=propertyPanel.querySelector('[data-role="size-mount"]');
      const radiusControl=propertyPanel.querySelector('[data-role="radius-mount"]');
      const contentControl=propertyPanel.querySelector('[data-role="content-mount"]');
      const labelInput=propertyPanel.querySelector('[data-role="button-label"]');
      const originalType=selected.type,originalState=selected.state,originalConfig=selected.config;
      const [originalSize,originalContentLabel,originalRadius]=originalConfig.split(' / ');
      const sameGroup=entries.filter(e=>e.config===selected.config&&e.type===selected.type);
      const stateOptions=[...new Set(sameGroup.map(e=>e.state))];
      // Other button-family layouts (e.g. the Dual Icon demo) don't expose
      // this trio of controls under these role names - fall back to the
      // plain state-only property set every other page already uses.
      if(!sizeControl||!radiusControl||!contentControl){
        return stateOptions.length>1
          ?{anatomy:baseAnatomy,properties:[{id:'state',name:'State',type:'options',options:stateOptions,default:selected.state}],selection:{state:selected.state},variants:captureStateVariants(baseAnatomy,sameGroup)}
          :{anatomy:baseAnatomy,properties:[],selection:{},variants:[]};
      }
      const textNode=baseAnatomy.children.find(n=>n.kind==='text')||null;
      const textIndex=textNode?baseAnatomy.children.indexOf(textNode):-1;
      const iconChildren=baseAnatomy.children.filter(n=>n.kind==='icon');
      const isIconOnly=selected.root.classList.contains('is-icon-only');
      let leadingIcon=!isIconOnly?iconChildren.find(n=>baseAnatomy.children.indexOf(n)<textIndex)||null:null;
      let trailingIcon=!isIconOnly?iconChildren.find(n=>baseAnatomy.children.indexOf(n)>textIndex)||null:null;
      let iconOnlyGlyph=isIconOnly?iconChildren[0]||null:null;
      const hadLeadingIcon=!!leadingIcon,hadTrailingIcon=!!trailingIcon,hadIconOnly=!!iconOnlyGlyph;
      if(textNode)textNode.bind='buttonLabel';

      const originalNative=readNative();
      const variants=[];let sizeOptions=[],radiusOptions=[];
      function harvestIcon(value,path){
        for(const input of contentControl.querySelectorAll('.multiselect-options input[type=checkbox]')){const checked=input.value===value;if(input.checked!==checked){input.checked=checked;input.dispatchEvent(new Event('change',{bubbles:true}));}}
        const match=gatherEntries().find(e=>e.type===originalType);
        // A unique path per harvested icon keeps every nested descendant id
        // (e.g. an SVG's inner <path>) unique too - sharing one path across
        // calls collided every harvest's children on the same ids.
        return match?snapshot(match.root,path,0).children.filter(n=>n.kind==='icon'):[];
      }
      applyingFoundation=true;
      try{
        // Harvest real geometry for any icon toggle the current selection
        // doesn't already show, by briefly switching Content to render it -
        // a captured rendering, not a guessed path, at the cost of being
        // sized for the Size/Corner radius this capture started from.
        if(!leadingIcon){const found=harvestIcon('icon-left','icon-leading-synth');if(found[0])leadingIcon=found[0];}
        if(!trailingIcon){const found=harvestIcon('icon-right','icon-trailing-synth');const node=found[found.length-1];if(node)trailingIcon=node;}
        if(!iconOnlyGlyph){const found=harvestIcon('icon-only','icon-only-synth');if(found[0])iconOnlyGlyph=found[0];}

        // Harvesting leaves Content isolated to whichever icon option it last
        // switched to - put every control back exactly as it was before
        // expanding Size and Corner radius, so the Content this capture
        // actually started from is still rendered for the sweep below to find.
        restoreNative(originalNative);
        for(const control of [sizeControl,radiusControl]){const all=control.querySelector('.multiselect-option-all input[type=checkbox]');if(all&&!all.checked){all.checked=true;all.dispatchEvent(new Event('change',{bubbles:true}));}}
        const sweep=gatherEntries().filter(e=>e.type===originalType&&e.config.split(' / ')[1]===originalContentLabel);
        const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
        const seenSize=new Set(),seenRadius=new Set();
        for(const entry of sweep){
          const [sizeLabel,,radiusLabel]=entry.config.split(' / ');
          seenSize.add(sizeLabel);seenRadius.add(radiusLabel);
          if(entry.config===originalConfig&&entry.state===originalState)continue;
          const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
          (function walk(n){
            const baseNode=base.get(n.id);
            if(baseNode){
              const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
              const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
              for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
              const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
              if(Object.keys(patch).length)overrides[n.id]=patch;
            }
            for(const child of n.children||[])walk(child);
          })(variantAnatomy);
          if(Object.keys(overrides).length)variants.push({id:'bv-'+M.id(sizeLabel+'-'+radiusLabel+'-'+entry.state),name:sizeLabel+' / '+radiusLabel+' / '+entry.state,when:{size:sizeLabel,radius:radiusLabel,state:entry.state},overrides});
        }
        sizeOptions=[...seenSize];radiusOptions=[...seenRadius];
      }finally{
        restoreNative(originalNative);applyingFoundation=false;refresh();
      }

      const children=[];
      if(leadingIcon)children.push({...leadingIcon,visibleWhen:[{property:'showLeadingIcon',equals:true}]});
      if(textNode)children.push({...textNode,visibleWhen:[{property:'iconOnly',equals:true,not:true}]});
      if(trailingIcon)children.push({...trailingIcon,visibleWhen:[{property:'showTrailingIcon',equals:true}]});
      if(iconOnlyGlyph)children.push({...iconOnlyGlyph,visibleWhen:[{property:'iconOnly',equals:true}]});
      const anatomy={...baseAnatomy,children};

      const defaultLabel=(labelInput?.value||'').trim()||textNode?.text||'Button';
      const properties=[
        {id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState},
        {id:'size',name:'Size',type:'options',options:sizeOptions.length?sizeOptions:[originalSize],default:originalSize},
        {id:'radius',name:'Corner radius',type:'options',options:radiusOptions.length?radiusOptions:[originalRadius],default:originalRadius},
        {id:'buttonLabel',name:'Text',type:'text',default:defaultLabel}
      ];
      const selection={state:originalState,size:originalSize,radius:originalRadius,buttonLabel:defaultLabel};
      if(leadingIcon){properties.push({id:'showLeadingIcon',name:'Leading icon',type:'boolean',default:hadLeadingIcon});selection.showLeadingIcon=hadLeadingIcon;}
      if(trailingIcon){properties.push({id:'showTrailingIcon',name:'Trailing icon',type:'boolean',default:hadTrailingIcon});selection.showTrailingIcon=hadTrailingIcon;}
      if(iconOnlyGlyph){properties.push({id:'iconOnly',name:'Icon only',type:'boolean',default:hadIconOnly});selection.iconOnly=hadIconOnly;}
      return {anatomy,properties,selection,variants};
    }
    function captureStateVariants(baseAnatomy,sameGroup){
      const M=window.ADSComponentContract,base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const variants=[];
      for(const entry of sameGroup){
        if(entry.key===selected.key)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id);
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        if(Object.keys(overrides).length)variants.push({id:'state-'+M.id(entry.state),name:entry.state,when:{state:entry.state},overrides});
      }
      return variants;
    }
    function snapshot(element,path,depth){
      if(depth>24)throw new Error('This preview exceeds the supported export depth.');
      const M=window.ADSComponentContract,tag=element.localName,computed=getComputedStyle(element),n={id:path,name:element.getAttribute('aria-label')||tag,kind:tag==='svg'?'icon':['span','p','strong','small','label'].includes(tag)?'text':'container',tag:M.TAGS.includes(tag)?tag:'div',styles:{},attributes:{},text:[...element.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(''),children:[]};
      const properties=['display','position','top','right','bottom','left','z-index','float','clear','flex-direction','align-items','align-self','align-content','justify-content','justify-self','flex-wrap','flex-grow','flex-shrink','flex-basis','order','gap','row-gap','column-gap','grid-template-columns','grid-template-rows','grid-auto-flow','grid-auto-columns','grid-auto-rows','grid-column','grid-row','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','width','height','min-width','max-width','min-height','max-height','box-sizing','overflow','overflow-x','overflow-y','background-color','background-image','background-size','background-position','background-repeat','color','border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-style','border-right-style','border-bottom-style','border-left-style','border-top-color','border-right-color','border-bottom-color','border-left-color','border-style','border-color','border-radius','border-top-left-radius','border-top-right-radius','border-bottom-left-radius','border-bottom-right-radius','box-shadow','font-family','font-size','font-weight','font-style','font-variant-numeric','line-height','letter-spacing','text-align','text-transform','text-indent','white-space','word-break','overflow-wrap','text-overflow','opacity','outline','outline-offset','text-decoration','cursor','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','stroke-dasharray','vertical-align','border-collapse','border-spacing','table-layout','list-style-type','list-style-position','object-fit','object-position','transform','transform-origin','visibility'];
      for(const property of properties){const inline=element.style.getPropertyValue(property),refs=[...inline.matchAll(/var\(\s*(--[\w-]+)/g)],known=refs.every(match=>match[1] in window.ADSFoundation.get().tokens),computedValue=computed.getPropertyValue(property),value=inline&&known?inline:matchToken(computedValue,property)||computedValue;if(value&&!/[<>{};]|url\s*\(/i.test(value))n.styles[toCamel(property)]=convertLengths(value);}
      for(const attribute of element.getAttributeNames())if(/^(aria-[\w-]+|role|title|type|value|placeholder|disabled|checked|href|src|alt|viewBox|d|cx|cy|r|x|y|x1|x2|y1|y2|width|height|rx|ry|points|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|xmlns|max|min|step|rows|colspan|rowspan)$/.test(attribute)){
        const value=element.getAttribute(attribute);if(['href','src'].includes(attribute)&&!/^(?:https?:|#|data:image\/(?:png|jpeg|webp|gif);base64,|[a-zA-Z0-9_.-]+(?:\/|$))/.test(value))continue;n.attributes[attribute]=value;
      }
      if('value'in element&&['input','textarea','select'].includes(tag))n.attributes.value=element.value;
      if(tag==='textarea')n.text=element.value;
      if(element instanceof HTMLInputElement&&['checkbox','radio'].includes(element.type)){if(element.checked)n.attributes.checked='';else delete n.attributes.checked;}
      // Mixed text must retain its position around icons and inline child elements.
      // The contract renderer places node.text before children, so represent those
      // text nodes explicitly instead of concatenating them ahead of the icon.
      if(element.children.length){n.text='';let index=0;for(const [textIndex,child]of [...element.childNodes].entries()){
        if(child.nodeType===1){const childIndex=index++;if(getComputedStyle(child).display!=='none'&&!['script','style'].includes(child.localName))n.children.push(snapshot(child,path+'-'+childIndex,depth+1));}
        else if(child.nodeType===3&&child.textContent.trim())n.children.push({id:path+'-text-'+textIndex,name:'Text',kind:'text',tag:'span',text:child.textContent,styles:{},attributes:{},children:[]});
      }}
      for(const pseudo of ['before','after']){
        const style=getComputedStyle(element,'::'+pseudo),content=style.content;
        if(!content||['none','normal'].includes(content)||style.display==='none'||!/^"[\s\S]*"$/.test(content))continue;
        let text;try{text=JSON.parse(content);}catch{text=content.slice(1,-1);}
        const shape={id:path+'-'+pseudo,name:'Decoration',kind:'shape',tag:'span',text,styles:{},attributes:{'aria-hidden':'true'},children:[]};
        for(const property of properties){const computedValue=style.getPropertyValue(property),value=matchToken(computedValue,property)||computedValue;if(value&&!/[<>{};]|url\s*\(/i.test(value))shape.styles[toCamel(property)]=convertLengths(value);}
        if(n.text){n.children.unshift({id:path+'-text',name:'Text',kind:'text',tag:'span',text:n.text,styles:{},attributes:{},children:[]});n.text='';}
        if(pseudo==='before')n.children.unshift(shape);else n.children.push(shape);
      }
      return n;
    }
    async function copyExport(kind){const button=exports.querySelectorAll('button')[kind==='prompt'?0:1];try{const c=capture();await window.ADSClipboard.copyWithFeedback(kind==='prompt'?window.ADSComponentContract.prompt(c):window.ADSContracts.code(c),button);}catch(error){updateStatus('Export failed: '+error.message);}}
    function exportFile(kind){try{const c=capture();window.ADSContracts.download(kind==='json'?c:window.ADSContracts.code(c),c.id+'-preview.'+(kind==='json'?'json':'html'));}catch(error){updateStatus('Export failed: '+error.message);}}
    window.ADSWorkbench={active:true,capture,getState:()=>clone({...state,native:readNative()}),selectedElement:()=>selected?.root,storageKey};
    window.addEventListener('ads:foundation-applied',syncLengthUnit);
    applyingFoundation=true;try{restoreNative(state.native);}finally{applyingFoundation=false;}syncFoundationPresets();refresh();dirty=false;updateStatus();
  }
})();
