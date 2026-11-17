/* Detail-page experiment. Existing component renderers remain responsible for behavior. */
(() => {
  'use strict';
  const catalog=window.ADSWorkbenchCatalog;
  if(!catalog)return;
  const file=location.pathname.split('/').pop();
  if(window.ADSNavigation?.redirecting)return;
  if(catalog.routes[file]){window.ADSNavigation ? window.ADSNavigation.replace(catalog.routes[file]+location.search) : location.replace(catalog.routes[file]+location.search);return;}
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
    if(avatarGroup){
      const extra=make('div',null,'wb-additional');
      extra.append(make('h3','Avatar group example'),avatarGroup);
      const groupPreview=main.querySelector('[data-role="avatar-group-container"]');
      if(groupPreview)extra.append(groupPreview);
      extra.append(make('p','This group is a separate example. Exports use the individual avatar in the preview.','wb-subtitle'));
      inspector.append(extra);nativePanels.push(extra);Object.assign(initialNative,readNative());
    }

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
    if(siblings.length>1){family=selectField('Button style',configGrid,'wb-family');setOptions(family,siblings.map(p=>({value:p.file,label:p.name})),file);family.addEventListener('change',()=>{window.ADSNavigation ? window.ADSNavigation.go(family.value) : (location.href = family.value);});}
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
    center.append(make('p',file==='input-text-field.html'?'Exports include all Input appearances, states, sizes and corner radii. The selected configuration becomes the Figma preview. Save keeps these settings in this browser.':'Exports contain the selected appearance and state. Save keeps these settings in this browser.','wb-export-note'));
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
    function readNative(){return Object.fromEntries(nativeFields().filter(n=>n.dataset.role).map(n=>[n.dataset.role,n.classList.contains('multiselect')?[...n.querySelectorAll('.multiselect-options input:checked')].map(i=>i.value):n.type==='checkbox'?n.checked:n.value]));}
    function restoreNative(values){for(const [role,value]of Object.entries(values)){
      // A count change can recreate dependent editors. Resolve each field
      // after earlier values have been restored, not from a stale node list.
      const control=nativeFields().find(n=>n.dataset.role===role);if(!control||value===undefined)continue;
      if(control.classList.contains('multiselect')){for(const input of control.querySelectorAll('.multiselect-options input[type=checkbox]')){const checked=Array.isArray(value)&&value.includes(input.value);if(input.checked===checked)continue;input.checked=checked;input.dispatchEvent(new Event('change',{bubbles:true}));}}
      else{if(control.type==='checkbox'){if(control.checked===(value===true))continue;control.checked=value===true;}else{if(control.value===String(value))continue;control.value=value;}control.dispatchEvent(new Event('input',{bubbles:true}));control.dispatchEvent(new Event('change',{bubbles:true}));}
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
    // Authored CSS references are authoritative. Only when unavailable do
    // we consider an unambiguous, property-appropriate resolved token.
    // Equal values alone must not bind spacing to radius, or danger to brand.
    let tokenLookup=null,authoredBindings=null;
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
        if(scratch.style.color){const normalized=getComputedStyle(scratch).color;if(normalized&&normalized!=='rgba(0, 0, 0, 0)'&&normalized!=='transparent'){if(!byColor.has(normalized))byColor.set(normalized,[]);byColor.get(normalized).push(name);}}
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
          const prefix=LENGTH_PROPERTY_PREFIXES[property];
          // Ambiguous or unrelated equal values stay snapshots. Authored CSS
          // references take precedence before this conservative fallback.
          const appropriate=prefix?candidates.filter(name=>name.startsWith(prefix)):[];
          if(appropriate.length===1)return 'var('+appropriate[0]+')';
          return null;
        }
      }
      const names=tokenLookup.byColor.get(trimmed);
      return names?.length===1?'var('+names[0]+')':null;
    }
    // Glyphs that CHANGE between variants (Success check vs Info "i", Warning triangle, Checked vs Indeterminate, Error X, a clear
    // icon that only exists in one State...) cannot be expressed as attribute diffs: the diff patches same-position layers, so a
    // line that becomes a polyline or a path is drawn with the wrong tag, and surplus or extra child shapes are lost. For every
    // svg whose variants carry geometry overrides, find the ONE property that decides the glyph, harvest each value's real svg
    // from the page, and show the matching one with a visibility rule. Non-geometry overrides (colour, size) are re-keyed onto it.
    function fixGlyphVariants(c){
      const GEO=new Set(['d','points','cx','cy','r','x1','y1','x2','y2','rx','ry']);
      const svgIds=[];(function w(n){if(n.tag==='svg')svgIds.push(n.id);(n.children||[]).forEach(w);})(c.anatomy);
      if(!svgIds.length||!(c.variants||[]).length)return;
      const under=(id,sid)=>id===sid||id.startsWith(sid+'-');
      const hasGeo=p=>p&&p.attributes&&Object.keys(p.attributes).some(a=>GEO.has(a));
      const flagged=svgIds.filter(sid=>c.variants.some(v=>Object.entries(v.overrides||{}).some(([id,p])=>under(id,sid)&&hasGeo(p))));
      if(!flagged.length)return;
      const sweep=gatherEntries(),knownParts=new Set();sweep.forEach(e=>e.config.split(' / ').forEach(x=>knownParts.add(x)));
      const cache=new Map(),snap=e=>{if(!cache.has(e))cache.set(e,snapshot(e.root,'root',0));return cache.get(e);};
      const find=(n,id)=>{if(n.id===id)return n;for(const k of n.children||[]){const r=find(k,id);if(r)return r;}return null;};
      const sigOf=node=>JSON.stringify((function s(x){return [x.tag,Object.keys(x.attributes||{}).filter(k=>GEO.has(k)).sort().map(k=>k+'='+x.attributes[k]),(x.children||[]).map(s)];})(node));
      const entryFor=when=>sweep.find(e=>Object.entries(when||{}).every(([k,v])=>{
        if(typeof v!=='string')return true;
        if(k==='state')return e.state===v;
        if(k==='appearance')return e.type===v;
        return knownParts.has(v)?e.config.split(' / ').includes(v):true;
      }));
      const optionProps=new Set((c.properties||[]).filter(p=>p.type==='options').map(p=>p.id));
      const baseWhen={};for(const [k,v] of Object.entries(c.selection||{}))if(optionProps.has(k))baseWhen[k]=v;
      const report=[];
      for(const sid of flagged){
        const baseNode=find(c.anatomy,sid);if(!baseNode)continue;
        const records=[{when:baseWhen,node:baseNode,variant:null}];
        for(const v of c.variants){const e=entryFor(v.when);const node=e&&find(snap(e),sid);if(node&&node.tag==='svg')records.push({when:v.when,node,variant:v});}
        const sigs=new Set(records.map(r=>sigOf(r.node)));
        if(sigs.size<2)continue;
        const keys=[...new Set(records.flatMap(r=>Object.keys(r.when||{})).filter(k=>optionProps.has(k)))];
        keys.sort((a,b)=>(b==='appearance')-(a==='appearance')||(b==='state')-(a==='state'));
        // The deciding property: one property whose value alone fixes the glyph; failing that, a PAIR (e.g. Steps' circle shows a
        // check or an X depending on both State and Step count).
        const decide=ks=>{const m=new Map();for(const r of records){if(ks.some(k=>r.when[k]===undefined))return false;const key=ks.map(k=>r.when[k]).join('\u0001'),sg=sigOf(r.node);if(m.has(key)&&m.get(key)!==sg)return false;m.set(key,sg);}return new Set(m.values()).size>1;};
        let Ps=null;
        for(const k of keys)if(decide([k])){Ps=[k];break;}
        if(!Ps)outer:for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++)if(decide([keys[i],keys[j]])){Ps=[keys[i],keys[j]];break outer;}
        if(!Ps){report.push({sid,skipped:'no deciding property or pair'});continue;}
        const P=Ps.join('+'),keyOf=w=>Ps.map(k=>(w||{})[k]).join('\u0001'),baseSig=sigOf(baseNode),baseVal=keyOf(baseWhen);
        const byValue=new Map();for(const r of records){const val=keyOf(r.when);if(!byValue.has(val))byValue.set(val,r.node);}
        // single property: only values that differ from the base need an alternative (the base node stays for the rest);
        // pair: visibility cannot express "not (A and B)", so every combination gets its own alternative and the base is parked.
        const altValues=[...byValue.keys()].filter(val=>Ps.length>1||sigOf(byValue.get(val))!==baseSig);
        const slug=t=>String(t).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        const parentOf=(n,id)=>{for(const k of n.children||[]){if(k.id===id)return n;const r=parentOf(k,id);if(r)return r;}return null;};
        const parent=parentOf(c.anatomy,sid);if(!parent)continue;
        const at=parent.children.findIndex(k=>k.id===sid);
        const rulesFor=val=>val.split('\u0001').map((x,i)=>({property:Ps[i],equals:x}));
        const alts=altValues.map(val=>{
          const copy=JSON.parse(JSON.stringify(byValue.get(val))),prefix=sid+'-glyph-'+slug(val.replace(/\u0001/g,'-'));
          (function ren(n){n.id=prefix+n.id.slice(sid.length);(n.children||[]).forEach(ren);})(copy);
          copy.visibleWhen=[...(baseNode.visibleWhen||[]),...rulesFor(val)];
          if(baseNode.hiddenWhen)copy.hiddenWhen=baseNode.hiddenWhen;
          const ids=new Set();(function col(n){ids.add(n.id);(n.children||[]).forEach(col);})(copy);
          return {val,prefix,node:copy,ids};
        });
        if(Ps.length>1){const r0=rulesFor(altValues[0])[0];baseNode.visibleWhen=[...(baseNode.visibleWhen||[]),{...r0},{...r0,not:true}];}
        else baseNode.visibleWhen=[...(baseNode.visibleWhen||[]),...altValues.map(val=>({property:Ps[0],equals:val,not:true}))];
        parent.children.splice(at+1,0,...alts.map(a=>a.node));
        for(const v of c.variants){
          const alt=alts.find(a=>a.val===keyOf(v.when));if(!alt)continue;
          const next={};
          for(const [id,patch] of Object.entries(v.overrides||{})){
            if(!under(id,sid)){next[id]=patch;continue;}
            const attrs={};for(const [k,val] of Object.entries(patch.attributes||{}))if(!GEO.has(k))attrs[k]=val;
            const moved={...patch};delete moved.attributes;if(Object.keys(attrs).length)moved.attributes=attrs;
            const target=alt.prefix+id.slice(sid.length);
            if(Object.keys(moved).length&&alt.ids.has(target))next[target]=moved;
          }
          v.overrides=next;
        }
        report.push({sid,P,values:altValues,base:baseVal,altIds:alts.map(a=>a.prefix),records:records.map(r=>({when:r.when,sig:sigOf(r.node)}))});
      }
      c.variants=c.variants.filter(v=>Object.keys(v.overrides||{}).length);
      window.__ADS_glyphReport=report;
    }
    function capture(){
      window.ADS_flushRenders?.();refresh();
      const invalid=inspector.querySelector(':invalid');
      if(invalid)throw new Error('Correct the invalid customization value before exporting.');
      // Every sweep below reads getComputedStyle() on sibling matrix cells
      // OTHER than the one currently selected - but outside "Compare
      // states" view, every one of those siblings is display:none (see
      // .wb-showcase in shell.css), and a display:none element can't
      // resolve a percentage dimension to a real pixel value at all; the
      // browser just hands back the literal declared value instead (e.g.
      // "100%" for a CSS width:100% rule, verbatim). Every capture path
      // (bespoke or generic) was silently depending on whichever view mode
      // the user happened to have open at export time - correct by
      // coincidence in Compare view, producing inconsistent/garbled
      // widths, unresolved "100%" overrides and similar nonsense in
      // Showcase view. Force Compare view for the whole capture, restore
      // whatever the user actually had afterward.
      const originalNative=readNative(),originalState=clone(state),originalDirty=dirty,originalApplying=applyingFoundation;
      const originalMode=state.selection.mode,forcedCompare=originalMode!=='compare';
      if(forcedCompare){state.selection.mode='compare';refresh();}
      try{
      const M=window.ADSComponentContract,c=M.blank(pageInfo.name);c.id=M.id(file.replace('.html',''));tokenLookup=buildTokenLookup();authoredBindings=window.ADSFoundationBindings?.create(document,window.ADSFoundation.get().tokens);
      let notes;
      if(file==='input-text-field.html'){
        if(!window.ADSInputContract)throw new Error('Input export code did not load. Refresh this page before exporting.');
        Object.assign(c,window.ADSInputContract.capture({snapshot,selected,native:readNative()}));
        notes='Reusable Input with all 1152 Appearance, State, Size and Corner radius combinations. Figma has separately editable Value and Placeholder text and a Show placeholder switch. Show clear button controls native visibility; browser Allow clear retains its value-aware behavior. Text, Boolean visibility, icon instance swaps and a supporting-content slot are bound to named parts. Input type and validation settings remain in HTML and JSON. Native dimensions are canonical pixels; styles follow context.unit.';
      }else if(isButtonPage){
        const built=captureButtonProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='Rendered snapshot of the selected appearance, with State, Size and Corner radius captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Content (icon placement) is exposed as independent Boolean properties and the label as a Text property, rather than crossed, to stay inside Figma’s 256-variant-per-set limit. This JSON/prompt export is this one appearance only; clicking Draw in Figma instead gathers every Button appearance page and pushes one merged "Button" component with an Appearance property switching between them, each appearance keeping its own full State/Size/Corner radius set underneath. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='group-button-default.html'){
        const built=captureGroupButtonProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Size and Corner radius are all captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant (including Full - Pill; large sets may exceed Figma\'s recommended variant count). Each segment\'s own label, Field label and Supporting text are bound Text properties (segments with Content="icon" have no visible text to bind); Show field label and Show supporting text are bound Boolean properties, with real geometry harvested by briefly showing them during export even if currently hidden. Content (icon placement) and segment count stay a page-level choice - changing the number of segments reshapes the component structurally, which Figma variants can\'t express without a separate master per count. The track and each non-icon-only segment hug their content in Figma (matching their CSS, which never sets a width); an icon-only segment keeps the fixed square width its Content setting renders at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='float-button-default.html'){
        const built=captureFloatButtonProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='Rendered snapshot of the selected type, with Appearance, State, Size and Elevation captured as crossed properties - every combination draws as its own Figma variant (exceeds the nominal 256-per-set guideline, since Elevation was requested as a real property; still well inside Figma\'s hard limit). Supporting text and Tooltip text are bound Text properties; Show tooltip and Show badge are bound Boolean properties (hidden parts are still captured with real geometry, harvested by briefly showing them during export). Badge count is a bound Text property; Badge max count is an editable property not bound to a layer, since Figma text properties cannot run the overflow (99+) calculation themselves. Tooltip placement and badge type (dot/count) stay a page-level choice. The wrapper hugs its content in Figma (matching its CSS, which never sets a width or height); the button itself keeps the fixed diameter its Size renders at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='slider-default.html'){
        const built=captureSliderProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance and Track thickness are captured as crossed properties - every combination draws as its own Figma variant. Label text, Value and Supporting text are bound Text properties; Show label, Show value, Tick marks and Show supporting text are bound Boolean properties, with real geometry harvested by briefly showing them during export even if currently hidden. Minimum, Maximum, Step and Value prefix are editable properties not bound to any layer, since Figma can\'t recompute the thumb\'s pixel position or the displayed value string from them - the thumb and displayed value stay at whichever Min/Max/Step/Value were active at capture time. Thumb shape stays a page-level choice. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='rating-default.html'){
        const built=captureRatingProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance (Star/Heart) and Icon size are captured as crossed properties - every combination draws as its own Figma variant. Label, Value and Descriptive feedback and Supporting text are bound Text properties; Show label, Show numeric value, Show descriptive feedback and Show supporting text are bound Boolean properties, with real geometry harvested by briefly showing them during export even if currently hidden. Scale and Selected are editable properties not bound to any layer, since Figma can\'t add/remove icon buttons or recompute which ones render filled from them - the icon row keeps whichever Scale/Selected combination was active at capture time (same structural limit as Group Button\'s segment count). Allow clear is interaction behavior with no static visual difference, so it stays an unbound editable property too. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='menu-default.html'){
        const built=captureMenuProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Size and Corner radius are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Each item\'s own label is bound to its own Text property; item count stays a page-level choice - changing it reshapes the panel structurally, which Figma variants can\'t express without a separate master per count. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='breadcrumb-default.html'){
        const built=captureBreadcrumbProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance and Size are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Each crumb\'s own label is bound to its own Text property (dividers and any collapsed "..." overflow indicator are left unbound, illustrative content); crumb count and which crumbs collapse stay a page-level choice - changing them reshapes the trail structurally, which Figma variants can\'t express without a separate master per count. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='anchor-default.html'){
        const built=captureAnchorProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance and Size are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Label is a bound Text property. Icon position is an editable property not bound to any layer, since swapping leading/trailing is a structural reorder of icon vs text that Figma can\'t perform from a bare property - the link keeps whichever position was active at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='tabs-default.html'){
        const built=captureTabsProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Size and Corner radius are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Each tab\'s own label is bound to its own Text property. Badge count is a bound Text property and Show badge a bound Boolean, with real geometry harvested by briefly showing it during export even if currently hidden. Equal-width tabs is an editable property not bound to any layer, since switching each tab between hug and fill width is a layout-mode change Figma can\'t perform from a bare property - the bar keeps whichever width mode was active at capture time. Tab count stays a page-level choice. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='transfer-default.html'){
        const built=captureTransferProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance and Size are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Left title and Right title are bound Text properties. List item content/count stays illustrative reference content, not a configurable property. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='upload-default.html'){
        const built=captureUploadProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Label and Helper text are bound Text properties. File list content stays illustrative reference content, not a configurable property. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='steps-default.html'){
        const built=captureStepsProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Size and Orientation are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant (there is only one real Appearance/Type today, so no separate Appearance property exists to expose). Each step\'s own label is bound to its own Text property. Step count is an editable property not bound to any layer, since adding/removing circles and connectors is a structural change Figma can\'t perform from a bare property (same limit as Group Button\'s segment count) - the row keeps whichever Step count was active at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='affix-default.html'){
        const built=captureAffixProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance (Top/Bottom) are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Label is a bound Text property. Offset (px) is an editable property not bound to any layer, since it only applies to the bar\'s pinned position while Affixed/Transitioning, which Figma can\'t recompute from a bare property - the bar keeps whichever offset was active at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='alert-default.html'){
        const built=captureAlertProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State (Default/Dismissible/With action/Dismissible + With action/Loading), Appearance and Corner radius are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Title, Description and Action label are bound Text properties; Show title, Show description and Show icon are bound Boolean properties, with real geometry harvested by briefly showing them during export even if currently hidden. Action label only shows/edits while State is "With action" specifically - visibility conditions support a single State value, not several at once, so the combined "Dismissible + With action" row keeps whichever action text was active at capture time without an independent toggle. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='toast-default.html'){
        const built=captureToastProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State (Default/Dismissible/With action/With progress/Dismissible + Action + Progress/Loading), Appearance and Corner radius are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Title, Description and Action label are bound Text properties; Show title, Show description and Show icon are bound Boolean properties, with real geometry harvested by briefly showing them during export even if currently hidden. Action label only shows/edits while State is "With action" specifically - visibility conditions support a single State value, not several at once, so the combined row keeps whichever action text was active at capture time without an independent toggle. Dismissible/With progress stay page-level choices. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='modal-default.html'){
        const built=captureModalProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Size and Corner radius are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Title, Body, Confirm label and Cancel label are bound Text properties; Show icon and Show close button are bound Boolean properties, with real geometry harvested by briefly showing them during export even if currently hidden. No footer/Scrollable/No close stay page-level choices captured in whichever State row was selected. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='tooltip-default.html'){
        const built=captureTooltipProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance (placement) are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Text content is a bound Text property (only applies to the "Plain text" state - "Rich"/"Long text" intentionally show fixed demo copy per spec). Show arrow is a bound Boolean property, with real geometry harvested by briefly showing it during export even if currently off. Size stays a page-level choice (not requested). Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='tour-default.html'){
        const built=captureTourProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State (step position) and Appearance (placement) are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Target label, Title and Description are bound Text properties. Back/Next/Finish button text and the step counter stay illustrative reference content, not configurable properties. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='drawer-default.html'){
        const built=captureDrawerProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Size and Corner radius are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Title and Body are bound Text properties; Show close button is a bound Boolean property, with real geometry harvested by briefly showing it during export even if currently hidden. Cancel/Save footer button text stays illustrative reference content, not a configurable property. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='notification-default.html'){
        const built=captureNotificationProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Title and Description are bound Text properties. Placement never changes the card\'s own appearance (it\'s which viewport corner it stacks from, a runtime concern) - exposed as an editable property not bound to any layer rather than a crossed options property, so it doesn\'t needlessly multiply the master count. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='pop-confirm-default.html'){
        const built=capturePopConfirmProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance (placement) are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Question text, Confirm label and Cancel label are bound Text properties ("Destructive"\'s red confirm button and "With icon"\'s warning icon stay tied to State). Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='progress-default.html'){
        const built=captureProgressProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance (Linear/Circular) are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Percent is a bound Text property (the label\'s own displayed number) and Show label a bound Boolean, with real geometry harvested by briefly showing it during export even if currently off; the fill\'s width/conic-gradient stop itself is a computed visual Figma can\'t recompute from a bare property, so the bar/ring keeps whichever fill was active at capture time regardless of later Percent edits. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='result-default.html'){
        const built=captureResultProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Title and Description are bound Text properties. Done/View details button text stays illustrative reference content, not a configurable property. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='divider-default.html'){
        const built=captureDividerProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State (line style), Appearance and Size are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Text label is a bound Text property, visible only while Appearance is "Horizontal with text" (it has no layer at all under plain "Horizontal"). Text alignment is an editable property not bound to any layer, since it\'s a type-conditional repositioning not part of the Size/State cross - the label keeps whichever alignment was active at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='avatar-default.html'){
        const built=captureAvatarProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State (presence), Appearance, Size and Shape are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Initials is a bound Text property, visible only while Appearance is "Initials". Avatar.Group is a separate composition (its own fixed person list, Max count and Show as toggle per the component\'s own spec), not a property of one Avatar - it is not drawn by this export at all, the same structural limit as Group Button\'s segment count; building it would need its own multi-instance Figma component. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='badge-default.html'){
        const built=captureBadgeProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Size are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Appearance (Count/Dot/Status) is an editable property not bound to any layer and NOT crossed into variants - Status renders a completely different layout (no host icon at all) from Count/Dot, which Figma variants can\'t express without a separate master per type, so the drawn badge keeps whichever Appearance was active at capture time. Count is a bound Text property visible only when Appearance is "Count"; Status label is a bound Text property visible only when Appearance is "Status" (only whichever one matches the captured Appearance actually exists as a layer this export). Max count is an editable property not bound to any layer, since Figma can\'t run the "+N" overflow math itself. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='card-default.html'){
        const built=captureCardProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Size and Corner radius are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Title and Body are bound Text properties (not shown/bound if the Loading state was selected at capture time, which swaps them for skeleton bars). Show shadow is an editable property not bound to any layer, since it toggles an effect on the card\'s own root rather than a separate layer\'s visibility - the card keeps whichever shadow state was active at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='collapse-default.html'){
        const built=captureCollapseProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Size and Corner radius are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Header text is a bound Text property and Show icon a bound Boolean. Body text is a bound Text property visible only while State is "Expanded" (it has no layer at all under Collapsed/Disabled), harvested from that row specifically during export. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='description-default.html'){
        const built=captureDescriptionProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Size and Columns are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Section title is a bound Text property, visible only while State is "With title" (harvested from that row specifically if it wasn\'t the selected row at capture time). Label/value grid content stays illustrative reference content, not a configurable property. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='empty-default.html'){
        const built=captureEmptyProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Title is always a bound Text property; Description is bound and visible on every State but "Title only"; Action label is bound and visible only on "With action" - both harvested from a representative row when the base capture didn\'t already have them. There is no Size scale anywhere in this component today (not requested-and-missing from Figma specifically, but genuinely absent from the component itself) - nothing exists yet to expose as a property. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='image-default.html'){
        const built=captureImageProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Corner radius and Aspect ratio are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Caption text is a bound Text property, visible only while Appearance is "With caption" (harvested from that Appearance specifically if it wasn\'t the selected one at capture time). Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='list-default.html'){
        const built=captureListProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Size and Corner radius are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Show dividers is an editable property not bound to any layer, since it toggles a border style across every row rather than one layer\'s visibility - the list keeps whichever divider state was active at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='popover-default.html'){
        const built=capturePopoverProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance (placement) are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Trigger label and Title are bound Text properties; Body is a bound Text property visible on every State but "Simple" (harvested from a representative row if it wasn\'t the selected one at capture time). The close button stays illustrative reference content, not a configurable property. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='splitter-default.html'){
        const built=captureSplitterProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance (orientation) are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. First panel label and Second panel label are bound Text properties (First panel label is visible on every State but "Collapsed", harvested from a representative row if that wasn\'t the selected one at capture time - the Collapsed panel keeps its own expand-icon content). Split ratio is an editable property not bound to any layer, since Figma can\'t recompute the first panel\'s flex-basis from a bare property - the split stays at whichever ratio was active at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='statistic-default.html'){
        const built=captureStatisticProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Title is a bound Text property; Value is bound and visible on every State but "Loading" (which swaps the whole title+value area for a skeleton bar). Prefix/Suffix are bound Text properties, harvested by briefly filling them in during export if they were empty (their presence is driven by their own text, not a boolean or a State). Trend arrow/percentage stay illustrative reference content, not configurable properties. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='timeline-default.html'){
        const built=captureTimelineProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance (layout) and State icons are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination is its own master, with the Pending item, connectors, icons, Loading and Empty parts grafted and shown only where they exist.';
      }else if(file==='table-default.html'){
        const built=captureTableProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State, Appearance, Size and Corner radius are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Show header is a bound Boolean property, with real geometry harvested by briefly showing the header row during export even if currently hidden. Row content stays illustrative reference content, not a configurable property. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='calendar-default.html'){
        const built=captureCalendarProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance (Full/Compact) are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Month label is a bound Text property. First day of week is an editable property not bound to any layer, since it reshapes which date lands in which grid cell and the weekday header labels - a structural recompute Figma can\'t perform from a bare property - the grid keeps whichever arrangement was active at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='tree-default.html'){
        const built=captureTreeProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Root label is a bound Text property and Show icons a bound Boolean. The Loading spinner glyph and Empty message are each harvested from their own State row (via data-contract-part) and grafted onto the node-list wrapper, visible only for that State - the normal node rows hide under both. Node labels/expand-collapse state stay illustrative reference content, not configurable properties. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='spin-default.html'){
        const built=captureSpinProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Size are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Label is a bound Text property, visible on every State but "Spinning" (which deliberately shows just the bare ring) - harvested from "With label" specifically if it wasn\'t the selected row at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='skeleton-default.html'){
        const built=captureSkeletonProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='State and Appearance (layout) are captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant. Rows is an editable property not bound to any layer, since Figma can\'t add/remove placeholder line blocks from a bare property (Avatar + text always shows a fixed 2 lines regardless of Rows, per the component\'s own spec) - the layout keeps whichever line count was active at capture time. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='switch-default.html'){
        const built=captureSwitchProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        const fieldProps=built.properties.filter(p=>['label','required','showIcons','supportingText','showSupporting','errorText','showError'].includes(p.id));
        const fieldNote=fieldProps.length?' '+fieldProps.map(p=>p.name).join(', ')+' '+(fieldProps.length>1?'are':'is')+' bound Text/Boolean '+(fieldProps.length>1?'properties':'property')+'.':'';
        notes='Rendered snapshot of the selected type/configuration, with every available state ('+(built.properties.find(p=>p.id==='state')?.options||[]).join(', ')+') captured as a "state" variant. Label (and the Required asterisk nested inside it) is harvested from a Labeled-appearance row and bound to show only when Appearance is Labeled, since it has no DOM presence in the Compact row to diff against.'+fieldNote+' Native property IDs retain canonical values; anatomy styles and tokens use context.unit. Interaction rules and unseen configurations require authored behavior bindings.';
      }else if(file==='dropdown-default.html'){
        const built=captureDropdownProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='Rendered snapshot of the selected type/size/radius, with State, Appearance and Size captured as crossed properties - every combination draws as its own Figma variant. Label is a bound Text property. Empty adds the open menu panel (laid out in flow below the trigger so it never overlaps neighbouring variants) and Loading swaps the chevron for a static loader glyph, each shown only for its own State. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='pagination-default.html'){
        const built=capturePaginationProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        notes='Rendered snapshot of the selected type/size/radius, with State, Appearance, Size and Corner radius captured as crossed properties - every combination draws as its own Figma variant. The two arrows are shared by both Appearances; the five page buttons are shown only for Numbered, the "Page 3 of 12" label only for Simple, and a static loader glyph replaces either while State is Loading. Native property IDs retain canonical values; anatomy styles and tokens use context.unit.';
      }else if(file==='date-picker-default.html'){
        const built=captureDatePickerProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        const crossedAxes=built.properties.filter(p=>p.type==='options'&&p.id!=='state');
        const fieldProps=built.properties.filter(p=>['label','required','supportingText','showSupporting','errorText','showError'].includes(p.id));
        const fieldNote=fieldProps.length?' '+fieldProps.map(p=>p.name).join(', ')+' '+(fieldProps.length>1?'are':'is')+' bound Text/Boolean '+(fieldProps.length>1?'properties':'property')+'.':'';
        notes='Rendered snapshot of the selected type/configuration, with State'+(crossedAxes.length?' and '+crossedAxes.map(p=>p.name).join(' and '):'')+' captured as crossed properties - every combination draws as its own Figma variant. The displayed date truncates to fit its own share of the row instead of hugging its full text width.'+fieldNote+' Native property IDs retain canonical values; anatomy styles and tokens use context.unit. Interaction rules and unseen configurations require authored behavior bindings.';
      }else if(file==='date-range-default.html'){
        const built=captureDateRangeProperties();
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        const crossedAxes=built.properties.filter(p=>p.type==='options'&&p.id!=='state');
        const fieldProps=built.properties.filter(p=>['label','required','supportingText','showSupporting','errorText','showError'].includes(p.id));
        const fieldNote=fieldProps.length?' '+fieldProps.map(p=>p.name).join(', ')+' '+(fieldProps.length>1?'are':'is')+' bound Text/Boolean '+(fieldProps.length>1?'properties':'property')+'.':'';
        notes='Rendered snapshot of the selected type/configuration, with State'+(crossedAxes.length?' and '+crossedAxes.map(p=>p.name).join(' and '):'')+' captured as crossed properties - every combination draws as its own Figma variant. The start and end date segments each truncate within their own fair share of the row (a small flex-grow wrapper frame each) instead of one hugging all the space and starving the other.'+fieldNote+' Native property IDs retain canonical values; anatomy styles and tokens use context.unit. Interaction rules and unseen configurations require authored behavior bindings.';
      }else{
        // Tag: the remove (x) button exists only in the Removable State, and the chip must hug its label (see postProcessTag below).
        const tagSnaps=[];const prevTagHook=crossedHook;
        if(file==='tag-default.html')crossedHook=(entry,anat,when)=>{tagSnaps.push({when:{...when},state:entry.state,anat});if(prevTagHook)prevTagHook(entry,anat,when);};
        let built;try{built=captureFormFieldProperties();}finally{crossedHook=prevTagHook;}
        if(file==='tag-default.html')postProcessTag(built,tagSnaps);
        c.anatomy=built.anatomy;c.properties=built.properties;c.selection=built.selection;c.variants=built.variants;
        const crossedAxes=built.properties.filter(p=>p.type==='options'&&p.id!=='state');
        const fieldProps=built.properties.filter(p=>['label','required','showIcons','supportingText','showSupporting','errorText','showError'].includes(p.id));
        const fieldNote=fieldProps.length?' '+fieldProps.map(p=>p.name).join(', ')+' '+(fieldProps.length>1?'are':'is')+' bound Text/Boolean '+(fieldProps.length>1?'properties':'property')+' (Supporting text/Error message are mutually exclusive in the live render, so each was harvested and bound separately rather than sharing one node). Label Placement stays a page-level choice.':'';
        notes=crossedAxes.length
          ?'Rendered snapshot of the selected type/configuration, with State'+(crossedAxes.length?' and '+crossedAxes.map(p=>p.name).join(' and '):'')+' captured as crossed properties ('+built.properties.filter(p=>p.type==='options').map(p=>p.name).join(', ')+') - every combination draws as its own Figma variant'+(built.droppedAxis?('; '+built.droppedAxis+' - crossing it with every other property stays a page-level choice to stay inside Figma’s variant limit'):'')+'.'+fieldNote+' Native property IDs retain canonical values; anatomy styles and tokens use context.unit. Interaction rules and unseen configurations require authored behavior bindings.'
          :'Rendered snapshot of the selected type/configuration, with every available state ('+(built.properties.find(p=>p.id==='state')?.options||[]).join(', ')+') captured as a "state" variant.'+fieldNote+' Native property IDs retain canonical values; anatomy styles and tokens use context.unit. Interaction rules and unseen configurations require authored behavior bindings.';
      }
      const foundation=window.ADSFoundation.get();c.tokens={...foundation.tokens};c.context={theme:foundation.theme,unit:foundation.unit,direction:document.documentElement.dir||'ltr',gridSystem:foundation.gridSystem,iconStyle:foundation.iconStyle,dataFormat:clone(foundation.dataFormat)};
      c.source={page:file,kind:'selected-preview-snapshot',configuration:clone(originalState.selection),nativeProperties:originalNative,nativeDimensionUnit:'px',foundationFollow:clone(originalState.foundationFollow),notes};
      // Foundation audit - this hardcoded a single generic 2-sentence
      // disclaimer for every component regardless of which one it was (the
      // exact same text for Button, Add-on, Alert, all 62+ components) -
      // the real, page-authored Accessibility notes sitting right there in
      // each page's own Human View guide panel never reached the exported
      // contract at all. component-contract-runtime.js's OWN generic
      // capture() (used for pages that don't opt into this workbench) has
      // always done this correctly; reuse that exact extraction here so the
      // two capture paths agree instead of one silently shipping boilerplate.
      const accessibilityNotes=[...document.querySelectorAll('.guide-view-panel[data-view-panel=human] .guide-list li')].map(n=>n.textContent.trim()).filter(t=>/keyboard|accessible|aria-|focus|screen reader/i.test(t)).slice(0,12);
      c.accessibility=accessibilityNotes.length?accessibilityNotes:['Retain native semantics and verify keyboard operation in the target application.','This snapshot preserves configured accessible names; it does not certify contrast or conformance.'];
      fixGlyphVariants(c);
      M.assert(c);return c;
      }finally{
        // Variant sweeps may temporarily expand every size/radius or expose
        // hidden parts. Export is read-only, including when a sweep throws.
        applyingFoundation=true;
        try{restoreNative(originalNative);window.ADS_flushRenders?.();}
        finally{state=originalState;dirty=originalDirty;applyingFoundation=originalApplying;refresh();updateStatus();}
      }
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
      // this trio of controls under these exact role names (theirs are
      // prefixed, e.g. "dualicon-size-mount") - fall back to the generic
      // crossed-properties capture, which finds Size/Corner radius controls
      // under any prefix, instead of a bare state-only property set.
      if(!sizeControl||!radiusControl||!contentControl)return captureCrossedProperties();
      const textNode=baseAnatomy.children.find(n=>n.kind==='text')||null;
      const textIndex=textNode?baseAnatomy.children.indexOf(textNode):-1;
      const iconChildren=baseAnatomy.children.filter(n=>n.kind==='icon');
      const isIconOnly=selected.root.classList.contains('is-icon-only');
      // .btn-demo never declares a CSS width (flex:none on an inline-flex
      // root = shrink-to-fit); only height is pinned per Size - except
      // .is-icon-only, which deliberately forces width to match height for
      // a square button (padding:0 plus an explicit width override, well
      // past what hug-content alone would produce for an icon narrower
      // than the button is tall). getComputedStyle always resolves width
      // to whatever pixel value the content happened to measure at capture
      // time, with no way to tell "intentionally auto" apart from
      // "intentionally fixed" - so left alone, the root's measured width
      // (sized for whatever label/icon combo was on screen when Draw in
      // Figma ran) got baked in as a FIXED dimension on every master,
      // defeating Auto Layout's hug-content resize for the (far more
      // common) non-icon-only content types. Icon-only is left exactly as
      // measured, since its square width is a deliberate fixed override,
      // not a hug result, and Figma can't make a single master's sizing
      // mode conditional on the iconOnly boolean property toggle - it
      // reflects whichever content was active when this capture ran, same
      // as every other icon-only-specific value here.
      if(!isIconOnly)baseAnatomy.styles.width='auto';
      let leadingIcon=!isIconOnly?iconChildren.find(n=>baseAnatomy.children.indexOf(n)<textIndex)||null:null;
      let trailingIcon=!isIconOnly?iconChildren.find(n=>baseAnatomy.children.indexOf(n)>textIndex)||null:null;
      let iconOnlyGlyph=isIconOnly?iconChildren[0]||null:null;
      const hadLeadingIcon=!!leadingIcon,hadTrailingIcon=!!trailingIcon,hadIconOnly=!!iconOnlyGlyph;
      if(textNode)textNode.bind='buttonLabel';

      const originalNative=readNative();
      const variants=[];let sizeOptions=[],radiusOptions=[],spinnerNode=null;
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
        // Loading swaps in a spinner for whichever icon slot the current
        // content shows (or replaces the whole glyph for icon-only) - harvest
        // its real geometry from the same-config Loading card so the sweep
        // below can diff its size-specific dimensions like any other icon,
        // instead of leaving it out of the anatomy entirely. Must come from
        // `sweep` (gathered fresh just above, after the Content/Size/Radius
        // toggling above has settled) rather than `sameGroup` - that was
        // gathered before the toggling, and the matrix rebuilds its cells
        // on every toggle, so its `.root` references are stale/detached by
        // this point and getComputedStyle on them silently returns generic
        // defaults for almost every property instead of throwing.
        const loadingEntry=sweep.find(e=>e.config===originalConfig&&e.state==='Loading');
        const harvestedSpinner=loadingEntry?snapshot(loadingEntry.root,'root',0).children.find(n=>n.id==='spinner')||null:null;
        // The live site's Loading indicator is a CSS border-trick spun by an
        // `animation` property - meaningless once exported, since Figma has
        // no equivalent and a frozen frame of it reads as a half-drawn,
        // broken ring rather than "loading". Per explicit instruction, swap
        // it for a real static icon (the attached progress_activity glyph)
        // instead: visually reads as a loading indicator even standing
        // still. Keep the harvested span's real captured size/color so the
        // glyph still matches this button's own current foreground and
        // roughly the size a spinner should be here - only its structure
        // (a border-trick span) is replaced, not its geometry.
        spinnerNode=harvestedSpinner?{
          id:'spinner',name:'Loading indicator',kind:'icon',tag:'svg',
          styles:{width:harvestedSpinner.styles.width,height:harvestedSpinner.styles.height,flexShrink:'0',fill:harvestedSpinner.styles.color||harvestedSpinner.styles.borderColor||harvestedSpinner.styles.borderTopColor||'#FFFFFF'},
          attributes:{viewBox:'0 0 24 24'},
          children:[{id:'spinner-glyph',name:'Loading indicator glyph',kind:'shape',tag:'path',attributes:{d:'M8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3625 2 11.9875C2 10.6125 2.2625 9.32083 2.7875 8.1125C3.3125 6.90417 4.02917 5.84583 4.9375 4.9375C5.84583 4.02917 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C12.2833 2 12.5208 2.09583 12.7125 2.2875C12.9042 2.47917 13 2.71667 13 3C13 3.28333 12.9042 3.52083 12.7125 3.7125C12.5208 3.90417 12.2833 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 11.7167 20.0958 11.4792 20.2875 11.2875C20.4792 11.0958 20.7167 11 21 11C21.2833 11 21.5208 11.0958 21.7125 11.2875C21.9042 11.4792 22 11.7167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.9708 18.1542 19.0625 19.0625C18.1542 19.9708 17.0958 20.6875 15.8875 21.2125C14.6792 21.7375 13.3875 22 12.0125 22C10.6375 22 9.34167 21.7375 8.125 21.2125Z'},styles:{}}]
        }:null;
        if(spinnerNode)base.set('spinner',spinnerNode);
        const seenSize=new Set(),seenRadius=new Set();
        for(const entry of sweep){
          const [sizeLabel,,radiusLabel]=entry.config.split(' / ');
          seenSize.add(sizeLabel);seenRadius.add(radiusLabel);
          if(entry.config===originalConfig&&entry.state===originalState)continue;
          const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
          (function walk(n){
            const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
            if(baseNode){
              const styles={};for(const [name,value]of Object.entries(n.styles))if(name==='width'&&n.id==='root'&&!isIconOnly){}else if(baseNode.styles[name]!==value)styles[name]=value;
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
      if(leadingIcon)children.push({...leadingIcon,visibleWhen:[{property:'showLeadingIcon',equals:true},{property:'state',equals:'Loading',not:true}]});
      if(textNode)children.push({...textNode,visibleWhen:[{property:'iconOnly',equals:true,not:true}]});
      if(trailingIcon)children.push({...trailingIcon,visibleWhen:[{property:'showTrailingIcon',equals:true},{property:'state',equals:'Loading',not:true}]});
      if(iconOnlyGlyph)children.push({...iconOnlyGlyph,visibleWhen:[{property:'iconOnly',equals:true},{property:'state',equals:'Loading',not:true}]});
      if(spinnerNode)children.push({...spinnerNode,visibleWhen:[{property:'state',equals:'Loading'}]});
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
          // A state that structurally swaps in a different element at the
          // same position (e.g. a Loading spinner replacing an icon) would
          // otherwise diff this variant's node against a same-id base node
          // of a completely different kind, bleeding its styles onto the
          // wrong element instead of the spinner getting its own - skip
          // the diff rather than apply a garbled cross-element patch.
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
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
    // Generic sibling to captureButtonProperties()/captureGroupButtonProperties()
    // for every OTHER workbench page that offers Size and/or Corner radius
    // multiselects (checkbox, card, select, table, date picker, and 20+
    // others) - before this, every one of them exposed only "State" as a
    // Figma property; Size and Corner radius stayed whatever was selected on
    // the page when Draw in Figma ran, never becoming real variant axes the
    // way Button's and Group Button's own bespoke capture functions already
    // made theirs. Works without per-component knowledge of the combo
    // label's exact format (count or order of parts) by matching each part
    // of entries.config against the control's own live option labels,
    // rather than assuming a fixed position - button-detail.js's "SIZE /
    // CONTENT / RADIUS" and group-button-detail.js's "SIZE / RADIUS" (and
    // table-detail.js's reversed "RADIUS / SIZE") all resolve correctly.
    // Lets a bespoke capture read every variant's full snapshot while the shared sweep has all of them on the page.
    let crossedHook=null;
    function captureCrossedProperties(){
      const M=window.ADSComponentContract;
      const baseAnatomy=snapshot(selected.root,'root',0);
      const sizeControl=propertyPanel.querySelector('[data-role$="size-mount"]');
      const radiusControl=propertyPanel.querySelector('[data-role$="radius-mount"]');
      const originalType=selected.type,originalState=selected.state,originalConfig=selected.config;
      const sameGroup=entries.filter(e=>e.config===selected.config&&e.type===selected.type);
      const stateOptions=[...new Set(sameGroup.map(e=>e.state))];
      if(!sizeControl&&!radiusControl){
        // No Size/Radius control at all - still cross Appearance (Type)
        // whenever there's more than one, same as the full path below,
        // instead of silently staying State-only forever (this is the gap
        // Timeline hit: Appearance was never exposed because neither
        // control existed to trigger the full crossing path).
        const allTypesHere=[...new Set(entries.filter(e=>e.config===originalConfig).map(e=>e.type))];
        if(allTypesHere.length>1){
          const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
          const variants=[];
          for(const entry of entries.filter(e=>e.config===originalConfig)){
            if(entry.type===originalType&&entry.state===originalState)continue;
            const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
            (function walk(n){
              const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
              if(baseNode){
                const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
                const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
                for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
                const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
                if(Object.keys(patch).length)overrides[n.id]=patch;
              }
              for(const child of n.children||[])walk(child);
            })(variantAnatomy);
            const when={state:entry.state,appearance:entry.type};
            const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
            if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
          }
          return {anatomy:baseAnatomy,properties:[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState},{id:'appearance',name:'Appearance',type:'options',options:allTypesHere,default:originalType}],selection:{state:originalState,appearance:originalType},variants};
        }
        return stateOptions.length>1
          ?{anatomy:baseAnatomy,properties:[{id:'state',name:'State',type:'options',options:stateOptions,default:selected.state}],selection:{state:selected.state},variants:captureStateVariants(baseAnatomy,sameGroup)}
          :{anatomy:baseAnatomy,properties:[],selection:{},variants:[]};
      }
      function optionLabelSet(control){
        if(!control)return new Set();
        return new Set([...control.querySelectorAll('.multiselect-options label')].map(row=>{
          const input=row.querySelector('input[type=checkbox]');
          return input?canonicalLabel(row.textContent.trim()):null;
        }).filter(Boolean));
      }
      const sizeLabels=optionLabelSet(sizeControl),radiusLabels=optionLabelSet(radiusControl);
      const originalParts=originalConfig.split(' / ');
      const originalSizeLabel=originalParts.find(p=>sizeLabels.has(p))||null;
      const originalRadiusLabel=originalParts.find(p=>radiusLabels.has(p))||null;
      const allTypes=[...new Set(entries.filter(e=>e.config===originalConfig).map(e=>e.type))];
      const originalNative=readNative();
      const variants=[];let sizeOptions=[],radiusOptions=[],typeOptions=[],droppedAxis=null,crossRadius=true,sparseRadius=false,crossType=allTypes.length>1;
      applyingFoundation=true;
      try{
        for(const control of [sizeControl,radiusControl]){
          if(!control)continue;
          const all=control.querySelector('.multiselect-option-all input[type=checkbox]');
          if(all&&!all.checked){all.checked=true;all.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        // Figma warns above 256 variants in one set, but that's a soft
        // guideline - adapter.js's actual hard cap is 1000. Corner radius
        // and Appearance have both been explicitly requested as missing
        // properties for one component after another this session (Dropdown,
        // Menu, Pagination, Group Button, Float Button...), so the budget
        // only drops an axis once the combination would blow the real
        // ceiling, not the nominal one - prefer dropping Corner radius
        // first, then Appearance too if it's still over, leaving Size x
        // State as the floor rather than silently exceed 1000.
        const sizeCount=sizeLabels.size||1,radiusCount=radiusLabels.size||1,typeCount=crossType?allTypes.length:1,stateCount=Math.max(stateOptions.length,1);
        if(sizeCount*radiusCount*typeCount*stateCount>1000){
          if(sizeCount*typeCount*stateCount<=1000){crossRadius=false;sparseRadius=radiusCount>1;droppedAxis='Corner radius (exported at the default State and Size only)';}
          else if(sizeCount*radiusCount*stateCount<=1000){crossType=false;droppedAxis='Appearance';}
          else{crossRadius=false;crossType=false;sparseRadius=radiusCount>1;droppedAxis='Appearance, and Corner radius at the default State and Size only';}
        }
        const sweep=gatherEntries().filter(e=>(crossType||e.type===originalType)&&(crossRadius||e.config.split(' / ').includes(originalRadiusLabel)||!originalRadiusLabel||(sparseRadius&&e.state===originalState&&e.type===originalType&&(!originalSizeLabel||e.config.split(' / ').includes(originalSizeLabel)))));
        const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
        for(const entry of sweep){
          const parts=entry.config.split(' / ');
          const sizeLabel=sizeControl?parts.find(p=>sizeLabels.has(p))||null:null;
          const radiusLabel=radiusControl&&(crossRadius||sparseRadius)?parts.find(p=>radiusLabels.has(p))||null:null;
          if(sizeControl&&!sizeLabel)continue;
          if(radiusControl&&(crossRadius||sparseRadius)&&!radiusLabel)continue;
          if(sizeLabel)sizeOptions.push(sizeLabel);if(radiusLabel)radiusOptions.push(radiusLabel);if(crossType)typeOptions.push(entry.type);
          if(entry.config===originalConfig&&entry.state===originalState&&entry.type===originalType)continue;
          const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
          (function walk(n){
            // Same structural-swap guard as captureStateVariants() above - a
            // state that swaps in a different element at this position (e.g.
            // a Loading spinner replacing an icon) must not diff against a
            // same-id base node of a different kind.
            const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
            if(baseNode){
              const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
              const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
              for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
              const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
              if(Object.keys(patch).length)overrides[n.id]=patch;
            }
            for(const child of n.children||[])walk(child);
          })(variantAnatomy);
          const when={state:entry.state};if(sizeLabel)when.size=sizeLabel;if(radiusLabel)when.radius=radiusLabel;if(crossType)when.appearance=entry.type;
           if(crossedHook)crossedHook(entry,variantAnatomy,when);
          const variantName=[crossType?entry.type:null,sizeLabel,radiusLabel,entry.state].filter(Boolean).join(' / ');
          if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
        }
        sizeOptions=[...new Set(sizeOptions)];radiusOptions=[...new Set(radiusOptions)];typeOptions=[...new Set(typeOptions)];
      }finally{
        restoreNative(originalNative);applyingFoundation=false;refresh();
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(crossType&&typeOptions.length){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:typeOptions.includes(originalType)?originalType:typeOptions[0]});selection.appearance=properties[properties.length-1].default;}
      if(sizeControl&&sizeOptions.length){properties.push({id:'size',name:'Size',type:'options',options:sizeOptions,default:originalSizeLabel&&sizeOptions.includes(originalSizeLabel)?originalSizeLabel:sizeOptions[0]});selection.size=properties[properties.length-1].default;}
      if(radiusControl&&(crossRadius||sparseRadius)&&radiusOptions.length){properties.push({id:'radius',name:'Corner radius',type:'options',options:radiusOptions,default:originalRadiusLabel&&radiusOptions.includes(originalRadiusLabel)?originalRadiusLabel:radiusOptions[0]});selection.radius=properties[properties.length-1].default;}
      return {anatomy:baseAnatomy,properties,selection,variants,droppedAxis};
    }
    // Float Button's own bespoke capture, like Button's/Group Button's -
    // before this it fell through to the plain generic path, which only
    // ever exposed State and Size (Appearance was never crossed, and
    // Elevation/Supporting text/Tooltip/Badge weren't exposed at all - every
    // instance showed permanently frozen copy with no way to toggle the
    // tooltip or badge in Figma). Appearance and Elevation are both real
    // style-value selectors (not simple show/hide), and Figma has no
    // property type for "pick a style value" other than a crossed variant
    // axis - so, unlike Button/Group Button's own Appearance, this crosses
    // Appearance x Size x State x Elevation together (every combination
    // draws as its own master), accepting a variant count past the nominal
    // 256-per-set guideline since Elevation was explicitly requested as a
    // real property and dropping it, or Appearance, would leave the exact
    // gap being fixed. The tooltip wrapper is always structurally present
    // (holding the button) with its bubble/arrow visibility-toggled, since
    // Figma can't move a layer to a different parent based on a property -
    // only toggle visibility - matching how Button keeps a boolean's hidden
    // state structurally present too.
    function captureFloatButtonProperties(){
      const M=window.ADSComponentContract;
      const sizeControl=document.querySelector('[data-role="floatbutton-size-mount"]');
      const elevationSelect=document.querySelector('[data-role="floatbutton-elevation-select"]');
      const supportingTextInput=document.querySelector('[data-role="floatbutton-supporting-text"]');
      const showTooltipInput=document.querySelector('[data-role="floatbutton-show-tooltip"]');
      const tooltipTextInput=document.querySelector('[data-role="floatbutton-tooltip-text"]');
      const showBadgeInput=document.querySelector('[data-role="floatbutton-show-badge"]');
      const badgeTypeSelect=document.querySelector('[data-role="floatbutton-badge-type"]');
      const badgeMaxInput=document.querySelector('[data-role="floatbutton-badge-max"]');
      if(!sizeControl)return captureCrossedProperties();

      // Checking "all sizes" measurably changes this matrix's own row
      // layout (confirmed directly: the tooltip wrapper's real rendered
      // height shifts the moment this toggle flips, independent of which
      // state/size is shown) - do this FIRST, before baseAnatomy and every
      // harvested measurement below, so the base capture and the per-state
      // sweep further down both measure in the same layout context. Doing
      // this toggle only right before the sweep (as it used to) measured
      // the harvested tooltip wrapper/arrow BEFORE "all sizes" flipped the
      // layout and every per-state sweep entry AFTER it - two different
      // contexts being diffed against each other produced a spurious height
      // difference on every non-base state, which pushed whatever sits
      // below the tooltip (the "Back to top" caption) down by that same
      // amount only when a non-base state (e.g. Hover) was shown.
      const all=sizeControl.querySelector('.multiselect-option-all input[type=checkbox]');
      if(all&&!all.checked){all.checked=true;all.dispatchEvent(new Event('change',{bubbles:true}));}

      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state,originalSizeLabel=selected.config;
      // .floatbutton-demo-wrap never declares a CSS width OR height (plain
      // inline-flex column, shrink-to-fit on both axes) - same autolayout
      // hug fix as Button's/Group Button's root, for the same reason. The
      // button itself keeps its real per-size fixed diameter untouched.
      const hug=new Map([[baseAnatomy.id,new Set(['width','height'])]]);
      baseAnatomy.styles.width='auto';baseAnatomy.styles.height='auto';

      function findButtonIn(n){if(n.tag==='button')return n;for(const c of n.children||[]){const r=findButtonIn(c);if(r)return r;}return null;}
      // Every toggle below rebuilds the whole matrix (render() replaces
      // matrixContainer.innerHTML entirely), so `selected.root` is a
      // detached, stale reference immediately afterward - same bug class as
      // Button's Loading-harvest fix earlier. Re-locate the matching cell
      // fresh via gatherEntries() after each toggle instead of reusing it.
      function snapshotCurrentCell(){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalSizeLabel&&e.state===originalState);
        return entry?snapshot(entry.root,'root',0):null;
      }
      const hadTooltip=Boolean(baseAnatomy.children[0]&&baseAnatomy.children[0].tag!=='button');
      const buttonNode=findButtonIn(baseAnatomy);
      const hadBadge=Boolean(buttonNode&&buttonNode.children&&buttonNode.children.length>1);
      const hadSupporting=baseAnatomy.children.length>1;

      const originalNative=readNative();
      let wrapperNode=null,bubbleNode=null,arrowNode=null,badgeNode=null,supportingNode=null,badgeCountNode=null;
      applyingFoundation=true;
      const variants=[];let seenSize=new Set(),typeOptions=new Set();
      try{
        // Harvest the tooltip wrapper+bubble+arrow and the badge (always as
        // its Count variant, so there is a real number node to bind Badge
        // count to) fresh every time, regardless of whether either is
        // currently shown - guarantees one consistent structure to graft
        // the Boolean visibility conditions onto, the same way Button
        // harvests a content option it isn't currently showing.
        if(showTooltipInput){
          const original=showTooltipInput.checked;
          if(!original){showTooltipInput.checked=true;showTooltipInput.dispatchEvent(new Event('change',{bubbles:true}));}
          const fresh=snapshotCurrentCell();
          wrapperNode=fresh?.children[0]||null;
          // data-contract-part="bubble"/"arrow" on the live markup gives
          // these two a STABLE id (snapshot()'s path=dataset.contractPart||
          // path) - found by id here rather than wrapperNode.children[0]/[1]
          // positionally, since the id is what the per-state override below
          // keys against, and a purely positional id would silently mean a
          // different thing in a variant whose own DOM shape differs.
          function findByPartId(n,id){if(!n)return null;if(n.id===id)return n;for(const c of n.children||[]){const r=findByPartId(c,id);if(r)return r;}return null;}
          bubbleNode=findByPartId(wrapperNode,'bubble');arrowNode=findByPartId(wrapperNode,'arrow');
          // The live tooltip is opacity:0 until real :hover/:focus-within OR
          // the matching .is-hover/.is-focus class (added to the trigger-
          // wrap alongside every row's own stateCls - see shell.css and
          // float-button-detail.js's buildFloatButtonField) - this harvest
          // reads whichever opacity the ORIGINAL cell's own state naturally
          // has (0 for Rest/Pressed/Disabled, 1 for Hover/Focused), used
          // below as the GRAFTED structure's base look; the sweep loop
          // further down adds explicit per-state overrides so every OTHER
          // state (not just the one harvested from) gets the correct
          // opacity too - a tooltip must only ever look shown on Hover/
          // Focused, never on Rest/Pressed/Disabled/Loading.
          // The arrow's "glued to the bubble" pointer look comes entirely
          // from negative margin pulling it up into the bubble's bottom
          // edge (margin:-12px/-4px, shell.css) - adapter.js has no concept
          // of CSS margin at all (grep confirms zero handling), so that
          // pull was silently dropped and Figma's own auto-layout spaced
          // the arrow at a plain, disconnected gap instead. Fix it with the
          // one positioning mechanism adapter.js DOES understand -
          // measure the arrow's real on-screen offset (opacity:0 affects
          // paint, not layout, so this reading is accurate) and bake it in
          // as absolute position, replacing the margin the adapter ignores.
          if(bubbleNode&&arrowNode){
            const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalSizeLabel&&e.state===originalState);
            const liveWrap=entry?.root?.querySelector('.floatbutton-tooltip-trigger-wrap');
            const liveArrow=liveWrap?.querySelector('.tooltip-demo-arrow');
            if(liveWrap&&liveArrow){
              const wrapRect=liveWrap.getBoundingClientRect(),arrowRect=liveArrow.getBoundingClientRect();
              // The arrow is an 8x8 square rotated 45deg (shell.css) to form
              // a diamond pointer. getBoundingClientRect() reports the
              // ROTATED, axis-aligned box (~11.3px wide - the square's
              // diagonal), but Figma's own `rotation` pivots around the
              // node's TOP-LEFT corner, not its center the way CSS's default
              // transform-origin does (confirmed in the Plugin API docs:
              // "rotation is with respect to the top-left of the object").
              // Writing the rotated bounding box's raw top-left as `left`/
              // `top` on an unrotated-8x8 Figma node, then letting Figma
              // rotate that node around THAT corner, pivots around the wrong
              // point and visibly knocks the diamond off-center (this is why
              // the arrow kept drawing to one side instead of centered under
              // the bubble). Fix: solve for the top-left that, once rotated
              // around itself by the same angle adapter.js will apply,
              // lands the shape's center exactly on the measured center -
              // the browser's rotated-bbox center is reliable regardless of
              // pivot convention, only the top-left back-calculation needs
              // the correction.
              const computedTransform=getComputedStyle(liveArrow).transform;
              const matrix=/^matrix\(([^)]+)\)/.exec(computedTransform);
              const rotationDeg=matrix?-Math.atan2(Number(matrix[1].split(',')[1]),Number(matrix[1].split(',')[0]))*180/Math.PI:0;
              const rotationRad=rotationDeg*Math.PI/180,cos=Math.cos(rotationRad),sin=Math.sin(rotationRad);
              const unrotatedWidth=parseFloat(arrowNode.styles.width)||arrowRect.width,unrotatedHeight=parseFloat(arrowNode.styles.height)||arrowRect.height;
              const centerX=(arrowRect.left-wrapRect.left)+arrowRect.width/2,centerY=(arrowRect.top-wrapRect.top)+arrowRect.height/2;
              arrowNode.styles.position='absolute';
              arrowNode.styles.left=(centerX-(cos*(unrotatedWidth/2)+sin*(unrotatedHeight/2)))+'px';
              arrowNode.styles.top=(centerY-(-sin*(unrotatedWidth/2)+cos*(unrotatedHeight/2)))+'px';
              delete arrowNode.styles.marginTop;delete arrowNode.styles.marginBottom;delete arrowNode.styles.marginLeft;delete arrowNode.styles.marginRight;
            }
          }
          if(!original){showTooltipInput.checked=false;showTooltipInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showBadgeInput){
          const originalShow=showBadgeInput.checked,originalType2=badgeTypeSelect?badgeTypeSelect.value:null;
          if(!originalShow){showBadgeInput.checked=true;showBadgeInput.dispatchEvent(new Event('change',{bubbles:true}));}
          if(badgeTypeSelect&&badgeTypeSelect.value!=='count'){badgeTypeSelect.value='count';badgeTypeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
          const freshButton=findButtonIn(snapshotCurrentCell()||{});
          badgeNode=freshButton?.children?.[1]||null;
          if(!originalShow){showBadgeInput.checked=false;showBadgeInput.dispatchEvent(new Event('change',{bubbles:true}));}
          if(badgeTypeSelect&&originalType2!==null&&originalType2!=='count'){badgeTypeSelect.value=originalType2;badgeTypeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(supportingTextInput){
          const original=supportingTextInput.value;
          if(!original.trim()){supportingTextInput.value='Back to top';supportingTextInput.dispatchEvent(new Event('input',{bubbles:true}));window.ADS_flushRenders?.();}
          const fresh=snapshotCurrentCell();
          supportingNode=fresh&&fresh.children.length>1?fresh.children[1]:null;
          if(!original.trim()){supportingTextInput.value=original;supportingTextInput.dispatchEvent(new Event('input',{bubbles:true}));window.ADS_flushRenders?.();}
        }

        const boundIds=new Set();
        if(bubbleNode){bubbleNode.bind='tooltipText';boundIds.add(bubbleNode.id);}
        if(supportingNode){supportingNode.bind='supportingText';boundIds.add(supportingNode.id);}
        badgeCountNode=badgeNode?.children?.[0]||null;
        if(badgeCountNode){
          badgeCountNode.bind='badgeCount';boundIds.add(badgeCountNode.id);
          // .badge-demo-count is a text-containing leaf (kind:'text'), but
          // it's ALSO where the real CSS puts the badge's actual fill
          // (background:var(--red-500) - .badge-demo-badge, the outer
          // wrapper, only carries the border). adapter.js's fill logic
          // only ever reads s.color for a TEXT-kind node, never
          // s.backgroundColor (Figma TEXT nodes are glyphs - they have no
          // background of their own to paint), so that captured
          // backgroundColor was silently dropped no matter what value it
          // held - this is the actual "no background on the badge" report,
          // not just a wrong-color issue. Move the fill up to badgeNode
          // (already a container/frame, already sized to hug this text via
          // its own border+flex centering) so it paints as a real box
          // behind the white count text instead.
          //
          // The reverse-color-matching ambiguity already fixed for the
          // required asterisk and Group Button's Selected state applies
          // here too - confirmed directly: with this project's saved brand
          // color, --color-focus-ring now resolves to the exact same
          // rgb(255,3,26) as --red-500, so the captured value can be
          // reverse-matched to the wrong, brand-tracking token. Force the
          // real token on whichever node actually renders the fill.
          if(badgeNode)badgeNode.styles={...badgeNode.styles,backgroundColor:'var(--red-500)'};
          badgeCountNode.styles={...badgeCountNode.styles,backgroundColor:'rgba(0,0,0,0)'};
        }

        const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
        const originalElevation=elevationSelect?elevationSelect.value:null;
        const elevationValues=elevationSelect?[...elevationSelect.options].map(o=>o.value):[null];
        for(const elevationValue of elevationValues){
          if(elevationSelect&&elevationSelect.value!==elevationValue){elevationSelect.value=elevationValue;elevationSelect.dispatchEvent(new Event('change',{bubbles:true}));}
          for(const entry of gatherEntries()){
            typeOptions.add(entry.type);seenSize.add(entry.config);
            if(entry.type===originalType&&entry.config===originalSizeLabel&&entry.state===originalState&&elevationValue===originalElevation)continue;
            const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
            (function walk(n){
              // Same structural-swap guard as captureStateVariants() above.
              const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
              if(baseNode){
                const styles={};for(const [name,value]of Object.entries(n.styles))if(hug.get(n.id)?.has(name)){}else if(baseNode.styles[name]!==value)styles[name]=value;
                const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
                for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
                const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text&&!boundIds.has(n.id))patch.text=n.text;
                if(Object.keys(patch).length)overrides[n.id]=patch;
              }
              for(const child of n.children||[])walk(child);
            })(variantAnatomy);
            // The tooltip bubble/arrow are GRAFTED onto the final anatomy
            // after this sweep, with their own deliberately-fixed-up base
            // styles (opacity, absolute position replacing the margin
            // adapter.js can't read) - they must never also pick up a
            // generic diff from the walk() above. If "Show tooltip" happens
            // to default to checked on this page, every row's OWN live DOM
            // still legitimately has a real bubble/arrow element too, so
            // the walk DOES produce a competing override for these same ids
            // (e.g. reverting the absolute left/top back to "auto", wiping
            // the rotation back to "none") - discard it, then add ONLY the
            // one real per-state difference that matters: visible (opacity
            // 1) on Hover/Focused, hidden everywhere else, matching the
            // live CSS's :hover/:focus-within intent.
            if(bubbleNode&&arrowNode){
              delete overrides[bubbleNode.id];delete overrides[arrowNode.id];
              const wantOpacity=(entry.state==='Hover'||entry.state==='Focused')?'1':'0';
              if(bubbleNode.styles.opacity!==wantOpacity)overrides[bubbleNode.id]={styles:{opacity:wantOpacity}};
              if(arrowNode.styles.opacity!==wantOpacity)overrides[arrowNode.id]={styles:{opacity:wantOpacity}};
            }
            // Same reverse-color-matching ambiguity hits the badge's own
            // walk()-produced diff as hit the base capture (see where
            // badgeNode.styles.backgroundColor is forced to --red-500 and
            // badgeCountNode's own backgroundColor is cleared, above) -
            // every row with a real badge in its live DOM produces its own
            // competing backgroundColor override for both nodes here, which
            // would win over that fix (compile() applies overrides on top
            // of the base style). Strip just that one key per variant
            // rather than the whole override, since a variant can still
            // legitimately differ in other badge styles.
            for(const node of [badgeNode,badgeCountNode]){
              if(!node||!overrides[node.id]?.styles)continue;
              delete overrides[node.id].styles.backgroundColor;
              if(!Object.keys(overrides[node.id].styles).length){
                delete overrides[node.id].styles;
                if(!Object.keys(overrides[node.id]).length)delete overrides[node.id];
              }
            }
            const when={appearance:entry.type,size:entry.config,state:entry.state,elevation:elevationValue};
            const variantName=entry.type+' / '+entry.config+' / '+entry.state+' / '+elevationValue;
            if(Object.keys(overrides).length)variants.push({id:'fb-'+M.id(variantName),name:variantName,when,overrides});
          }
        }
        if(elevationSelect&&elevationSelect.value!==originalElevation){elevationSelect.value=originalElevation;elevationSelect.dispatchEvent(new Event('change',{bubbles:true}));}
      }finally{
        restoreNative(originalNative);applyingFoundation=false;refresh();
      }

      const finalButton=badgeNode
        ?{...buttonNode,children:[buttonNode.children[0],{...badgeNode,visibleWhen:[{property:'showBadge',equals:true}]}]}
        :buttonNode;
      // Arrow BEFORE bubble: CSS paints the bubble on top (z-index:2 vs 1),
      // hiding the diamond's upper half so only its pointer tip shows below
      // the bubble's edge. adapter.js has no z-index concept - it stacks
      // anatomy children in array order (later = on top, same as DOM) - so
      // reproducing that same look means the arrow must come first here.
      const rootChild=wrapperNode
        ?{...wrapperNode,children:[
            arrowNode?{...arrowNode,visibleWhen:[{property:'showTooltip',equals:true}]}:null,
            bubbleNode?{...bubbleNode,visibleWhen:[{property:'showTooltip',equals:true}]}:null,
            finalButton
          ].filter(Boolean)}
        :finalButton;
      const children=[rootChild];
      if(supportingNode)children.push(supportingNode);
      const anatomy={...baseAnatomy,children};

      const properties=[
        {id:'state',name:'State',type:'options',options:[...new Set(gatherEntries().map(e=>e.state))].length?[...new Set(gatherEntries().map(e=>e.state))]:[originalState],default:originalState},
        {id:'appearance',name:'Appearance',type:'options',options:[...typeOptions],default:originalType},
        {id:'size',name:'Size',type:'options',options:[...seenSize],default:originalSizeLabel}
      ];
      const selection={state:originalState,appearance:originalType,size:originalSizeLabel};
      if(elevationSelect){const options=[...elevationSelect.options].map(o=>o.value);properties.push({id:'elevation',name:'Elevation',type:'options',options,default:elevationSelect.value});selection.elevation=elevationSelect.value;}
      if(supportingNode){const def=supportingTextInput?.value.trim()||supportingNode.text||'Back to top';properties.push({id:'supportingText',name:'Supporting text',type:'text',default:def});selection.supportingText=def;}
      if(bubbleNode){
        const def=tooltipTextInput?.value.trim()||bubbleNode.text||'Tooltip';
        properties.push({id:'tooltipText',name:'Tooltip text',type:'text',default:def});selection.tooltipText=def;
        properties.push({id:'showTooltip',name:'Show tooltip',type:'boolean',default:hadTooltip});selection.showTooltip=hadTooltip;
      }
      if(badgeCountNode){
        properties.push({id:'badgeCount',name:'Badge count',type:'text',default:badgeCountNode.text||'5'});selection.badgeCount=badgeCountNode.text||'5';
        const maxDefault=badgeMaxInput?.value.trim()||'99';
        properties.push({id:'badgeMax',name:'Badge max count',type:'text',default:maxDefault});selection.badgeMax=maxDefault;
        properties.push({id:'showBadge',name:'Show badge',type:'boolean',default:hadBadge});selection.showBadge=hadBadge;
      }
      return {anatomy,properties,selection,variants};
    }
    // Slider's own bespoke capture - before this it fell through to the
    // generic path, which only ever exposed State/Appearance/Size (labeled
    // "Size" there, renamed "Track thickness" here to match the control's
    // own name) - Label/Value and their Show toggles, Thumb shape, Tick
    // marks and Supporting text were never exposed at all. Min/Max/Step and
    // Value prefix are editable properties not bound to any layer (same as
    // Float Button's Badge max count) - the matrix cell's thumb position is
    // baked in from whichever Min/Max/Step/Value were active at capture
    // time, since Figma text/boolean properties can't recompute a pixel
    // position from them.
    function captureSliderProperties(){
      const M=window.ADSComponentContract;
      const sizeControl=document.querySelector('[data-role="slider-size-mount"]');
      const labelInput=document.querySelector('[data-role="slider-label"]');
      const valueInput=document.querySelector('[data-role="slider-value"]');
      const minInput=document.querySelector('[data-role="slider-min"]');
      const maxInput=document.querySelector('[data-role="slider-max"]');
      const stepInput=document.querySelector('[data-role="slider-step"]');
      const requiredInput=document.querySelector('[data-role="slider-required"]');
      const showLabelInput=document.querySelector('[data-role="slider-show-label"]');
      const showValueInput=document.querySelector('[data-role="slider-show-value"]');
      const prefixInput=document.querySelector('[data-role="slider-prefix"]');
      const suffixInput=document.querySelector('[data-role="slider-suffix"]');
      const thumbShapeSelect=document.querySelector('[data-role="slider-thumb-shape"]');
      const showTicksInput=document.querySelector('[data-role="slider-show-ticks"]');
      const showSupportingInput=document.querySelector('[data-role="slider-show-supporting"]');
      const supportingTextInput=document.querySelector('[data-role="slider-supporting-text"]');
      if(!sizeControl)return captureCrossedProperties();
      const built=captureCrossedProperties();
      const sizeProp=built.properties.find(p=>p.id==='size');if(sizeProp)sizeProp.name='Track thickness';

      const originalType=selected.type,originalConfig=selected.config,originalState=selected.state;
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      function currentPart(partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const originalShowLabel=showLabelInput?.checked??false,originalShowValue=showValueInput?.checked??false;
      const originalShowTicks=showTicksInput?.checked??false,originalShowSupporting=showSupportingInput?.checked??false;
      const originalRequired=requiredInput?.checked??false;
      let labelNode=null,valueNode=null,ticksNode=null,supportingNode=null,requiredNode=null;
      applyingFoundation=true;
      try{
        if(showLabelInput){
          if(!originalShowLabel){showLabelInput.checked=true;showLabelInput.dispatchEvent(new Event('change',{bubbles:true}));}
          // Required's asterisk nests inside the label part itself (same
          // place checkbox-detail.js/radio-detail.js put theirs) - force it
          // on alongside Show label so the same harvested snapshot carries
          // both, instead of a separate currentPart('required') call.
          if(requiredInput&&!originalRequired){requiredInput.checked=true;requiredInput.dispatchEvent(new Event('change',{bubbles:true}));}
          labelNode=currentPart('label');
          if(labelNode)requiredNode=findPart(labelNode,'required');
          if(requiredInput&&!originalRequired){requiredInput.checked=false;requiredInput.dispatchEvent(new Event('change',{bubbles:true}));}
          if(!originalShowLabel){showLabelInput.checked=false;showLabelInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showValueInput){
          if(!originalShowValue){showValueInput.checked=true;showValueInput.dispatchEvent(new Event('change',{bubbles:true}));}
          valueNode=currentPart('value');
          if(!originalShowValue){showValueInput.checked=false;showValueInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showTicksInput){
          if(!originalShowTicks){showTicksInput.checked=true;showTicksInput.dispatchEvent(new Event('change',{bubbles:true}));}
          const trackNode=currentPart('track');
          ticksNode=trackNode?.children?.find(c=>c.id!=='fill'&&c.kind==='container'&&(c.children||[]).every(cc=>cc.kind==='container'))||null;
          if(!originalShowTicks){showTicksInput.checked=false;showTicksInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showSupportingInput){
          if(!originalShowSupporting){showSupportingInput.checked=true;showSupportingInput.dispatchEvent(new Event('change',{bubbles:true}));}
          supportingNode=currentPart('supporting');
          if(!originalShowSupporting){showSupportingInput.checked=false;showSupportingInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
      }finally{
        applyingFoundation=false;refresh();
      }

      if(labelNode&&requiredNode){
        labelNode.children=(labelNode.children||[]).filter(c=>c.id!=='required');
        requiredNode={...requiredNode,styles:{...requiredNode.styles,color:'var(--danger-500)'}};
        labelNode.children.push({...requiredNode,visibleWhen:[{property:'required',equals:true}]});
      }
      if(labelNode){
        // Bind the TEXT to the nested text-kind child (same findLabelNode()
        // helper other capture functions here use for a label with a
        // nested required asterisk), not to labelNode itself: labelNode
        // already has real children (the text run + the required span), so
        // binding it directly gave it its own non-empty .text too - compile()
        // computes text for ANY bound container regardless of whether it
        // already has children, and adapter.js's bare-text synthesis adds a
        // synthetic text child for that unconditionally, producing a SECOND,
        // duplicate "Volume" alongside the real one (reported: the label
        // text showing twice, overlapping, in every state/size/appearance).
        const labelTextNode=findLabelNode(labelNode)||labelNode;
        labelTextNode.bind='label';
        labelNode.visibleWhen=[{property:'showLabel',equals:true}];
      }
      if(valueNode){valueNode.bind='value';valueNode.visibleWhen=[{property:'showValue',equals:true}];}
      if(ticksNode)ticksNode.visibleWhen=[{property:'showTicks',equals:true}];
      if(supportingNode)supportingNode.bind='supportingText';

      // Graft whichever of these were freshly harvested (not already part
      // of the base capture) into the anatomy at the right spot - label/
      // value live in the "top" row (root's first child when present),
      // ticks live inside the track, supporting is root's last child.
      function replaceOrAppend(parent,node){
        if(!node)return;
        const idx=(parent.children||[]).findIndex(c=>c.id===node.id);
        if(idx>=0)parent.children[idx]=node;else (parent.children=parent.children||[]).push(node);
      }
      const anatomy=built.anatomy;
      if((labelNode||valueNode)&&!findPart(anatomy,'label')&&!findPart(anatomy,'value')){
        // Base capture had neither label nor value showing (no "top" row at
        // all) - synthesize one as root's first child.
        const top={id:'top',name:'Label and value',kind:'container',tag:'div',styles:{display:'flex',justifyContent:'space-between',width:'100%'},attributes:{},text:'',children:[labelNode,valueNode].filter(Boolean)};
        anatomy.children=[top,...(anatomy.children||[])];
      }else{
        const top=anatomy.children?.find(c=>findPart(c,'label')||findPart(c,'value'))||anatomy;
        replaceOrAppend(top,labelNode);replaceOrAppend(top,valueNode);
      }
      const trackNode=findPart(anatomy,'track');
      if(trackNode)replaceOrAppend(trackNode,ticksNode);
      if(supportingNode&&!findPart(anatomy,'supporting'))anatomy.children.push(supportingNode);
      else if(supportingNode)replaceOrAppend(anatomy,supportingNode);

      // Appearance=Range renders a SECOND thumb the crossed-variant sweep
      // above can never represent: captureCrossedProperties() diffs each
      // variant snapshot against ONE shared base snapshot (whichever
      // appearance happened to be selected when this page loaded, usually
      // Single), walking only nodes that already exist by id in the base
      // tree. Range's second thumb has no id in a Single-based anatomy, so
      // its position was silently dropped and the anatomy template pushed
      // to every master never got a second thumb node at all (reported:
      // Range pushes but only ever shows one thumb - effectively invisible
      // as its own appearance). Fix: graft a real, always-present second
      // thumb node onto the track (hidden unless appearance=Range, same
      // pattern as the required asterisk/ticks above), then attach its
      // per-state/size position as an extra override on each Range
      // variant captureCrossedProperties() already created.
      const trackThumbs=tn=>{
        if(!tn||!tn.children||!tn.children.length)return[];
        const fillNode=tn.children[0];
        const ticksGroup=tn.children.find(c=>c!==fillNode&&c.kind==='container'&&(c.children||[]).length&&(c.children||[]).every(cc=>cc.kind==='container'));
        return tn.children.filter(c=>c!==fillNode&&c!==ticksGroup);
      };
      const rangeEntries=entries.filter(e=>e.type==='Range');
      const sampleEntry=rangeEntries.find(e=>e.config===originalConfig&&e.state===originalState)||rangeEntries[0];
      if(trackNode&&sampleEntry){
        const sampleTrack=findPart(snapshot(sampleEntry.root,'root',0),'track');
        const sampleThumbs=trackThumbs(sampleTrack);
        if(sampleThumbs.length>1){
          const thumb2Id='thumb-2';
          const thumb2={...sampleThumbs[1],id:thumb2Id,name:(sampleThumbs[1].name||'div')+' (2)',visibleWhen:[{property:'appearance',equals:'Range'}]};
          trackNode.children.push(thumb2);
          const sizeOptionsList=(built.properties.find(p=>p.id==='size')||{}).options||[];
          for(const entry of rangeEntries){
            const track=entry===sampleEntry?sampleTrack:findPart(snapshot(entry.root,'root',0),'track');
            const thumbs=trackThumbs(track);
            if(thumbs.length<2)continue;
            const node=thumbs[1];
            const styles={};
            for(const [name,value] of Object.entries(node.styles||{}))if(thumb2.styles[name]!==value)styles[name]=value;
            if(!Object.keys(styles).length)continue;
            const parts=entry.config.split(' / ');
            const sizeLabel=sizeOptionsList.find(opt=>parts.includes(opt))||null;
            const variant=built.variants.find(v=>v.when.state===entry.state&&v.when.appearance==='Range'&&(sizeLabel?v.when.size===sizeLabel:true));
            if(variant)variant.overrides[thumb2Id]={...(variant.overrides[thumb2Id]||{}),styles:{...(variant.overrides[thumb2Id]?.styles||{}),...styles}};
          }
        }
      }

      // Thumb shape (Circle/Rounded square) has its own <select> - it was
      // queried above (thumbShapeSelect) but never actually read or
      // exposed as a property at all (reported: Thumb Shape missing
      // entirely in Figma, not just defaulting wrong). The ONLY visual
      // difference between the two is border-radius (shell.css's
      // .slider-demo-thumb.is-square), which doesn't vary by state/size/
      // appearance, so the delta only needs harvesting ONCE - but adapter.js
      // does NOT compute a full axis cross-product on its own: push()
      // builds its master list from the explicit `when`s already present in
      // c.variants (plus a lone one-axis-away-from-default sweep per axis),
      // so a single {thumbShape:'Rounded square'} entry here would only
      // ever produce ONE square-thumb master (state/size/appearance all at
      // their defaults) instead of a real, fully-crossed property (reported
      // symptom this fix must avoid repeating: thumb shape appearing to
      // "exist" but only actually changing one corner of the whole set).
      // Explicitly crossing it against every State x Size x Appearance
      // combo below, inheriting each combo's own existing overrides (if
      // any) and layering the radius delta on top, is what actually makes
      // Figma build Circle and Square masters for every state/size/
      // appearance, not just the default one.
      let thumbShapeOptions=null,originalThumbShape=null;
      const thumbShapeVariants=[];
      if(thumbShapeSelect&&trackNode){
        const shapeOptions=[...thumbShapeSelect.options].map(o=>({value:o.value,label:o.textContent.trim()}));
        originalThumbShape=thumbShapeSelect.value;
        const squareOption=shapeOptions.find(o=>o.value!==originalThumbShape)||shapeOptions[1];
        if(squareOption){
          thumbShapeOptions=shapeOptions.map(o=>o.label);
          applyingFoundation=true;
          try{
            thumbShapeSelect.value=squareOption.value;thumbShapeSelect.dispatchEvent(new Event('change',{bubbles:true}));
            // Re-query gatherEntries() AFTER the toggle, not the sampleEntry
            // captured above - render() rebuilds the matrix's innerHTML on
            // every control change, so any entry.root reference captured
            // before this toggle is now a detached, pre-toggle node that
            // still snapshots as Circle regardless of the live page state
            // (the exact reason the harvested delta came out empty the
            // first time this was tried).
            // Two separate sources, not one: thumb1's delta must come from
            // the SAME type as the base capture (currentPart() re-resolves
            // originalType/originalConfig/originalState fresh) so only shape
            // changes, not position too - diffing it against a Range entry's
            // low thumb would conflate "circle->square" with "single->range"
            // (both thumbs sit at different % positions) into one bogus
            // delta that then corrupted every OTHER appearance's override.
            // thumb-2 only exists on Range, so its delta needs a fresh Range
            // entry instead, diffed against thumb2Base (itself already
            // harvested from a Range entry above) so that comparison is
            // ALSO shape-only.
            const squareTrackSameType=currentPart('track');
            const squareThumbsSameType=trackThumbs(squareTrackSameType);
            const freshRangeEntry=sampleEntry&&gatherEntries().find(e=>e.type==='Range'&&e.config===sampleEntry.config&&e.state===sampleEntry.state);
            const squareRangeTrack=freshRangeEntry?findPart(snapshot(freshRangeEntry.root,'root',0),'track'):null;
            const squareThumbsRange=trackThumbs(squareRangeTrack);
            const thumb1Base=findPart(anatomy,'track-1'),thumb2Base=findPart(anatomy,'thumb-2');
            const thumb1Delta={},thumb2Delta={};
            if(thumb1Base&&squareThumbsSameType[0])for(const [name,value] of Object.entries(squareThumbsSameType[0].styles||{}))if(thumb1Base.styles[name]!==value)thumb1Delta[name]=value;
            if(thumb2Base&&squareThumbsRange[1])for(const [name,value] of Object.entries(squareThumbsRange[1].styles||{}))if(thumb2Base.styles[name]!==value)thumb2Delta[name]=value;
            if(Object.keys(thumb1Delta).length||Object.keys(thumb2Delta).length){
              const stateOptions=(built.properties.find(p=>p.id==='state')||{}).options||[originalState];
              const sizeOptions=(built.properties.find(p=>p.id==='size')||{}).options||[null];
              const appearanceOptions=(built.properties.find(p=>p.id==='appearance')||{}).options||[null];
              for(const state of stateOptions)for(const size of sizeOptions)for(const appearance of appearanceOptions){
                const when={state};if(size!=null)when.size=size;if(appearance!=null)when.appearance=appearance;
                const existing=built.variants.find(v=>JSON.stringify(v.when)===JSON.stringify(when));
                const overrides=existing?JSON.parse(JSON.stringify(existing.overrides||{})):{};
                if(Object.keys(thumb1Delta).length)overrides['track-1']={...(overrides['track-1']||{}),styles:{...(overrides['track-1']?.styles||{}),...thumb1Delta}};
                if(appearance==='Range'&&Object.keys(thumb2Delta).length)overrides['thumb-2']={...(overrides['thumb-2']||{}),styles:{...(overrides['thumb-2']?.styles||{}),...thumb2Delta}};
                const variantName=[appearance,size,state,squareOption.label].filter(Boolean).join(' / ');
                thumbShapeVariants.push({id:'cv-'+M.id(variantName),name:variantName,when:{...when,thumbShape:squareOption.label},overrides});
              }
            }
          }finally{
            thumbShapeSelect.value=originalThumbShape;thumbShapeSelect.dispatchEvent(new Event('change',{bubbles:true}));
            applyingFoundation=false;refresh();
          }
        }
      }

      const properties=[...built.properties];const selection={...built.selection};
      const variants=[...built.variants,...thumbShapeVariants];
      if(thumbShapeOptions){
        const originalLabel=([...thumbShapeSelect.options].find(o=>o.value===originalThumbShape)||{}).textContent?.trim()||thumbShapeOptions[0];
        properties.push({id:'thumbShape',name:'Thumb shape',type:'options',options:thumbShapeOptions,default:originalLabel});
        selection.thumbShape=originalLabel;
      }
      if(labelNode){const def=labelInput?.value.trim()||labelNode.text||'Label';properties.push({id:'label',name:'Label text',type:'text',default:def},{id:'showLabel',name:'Show label',type:'boolean',default:originalShowLabel});selection.label=def;selection.showLabel=originalShowLabel;}
      if(requiredNode){properties.push({id:'required',name:'Required',type:'boolean',default:originalRequired});selection.required=originalRequired;}
      if(valueNode){const def=valueNode.text||valueInput?.value.trim()||'50%';properties.push({id:'value',name:'Value',type:'text',default:def},{id:'showValue',name:'Show value',type:'boolean',default:originalShowValue});selection.value=def;selection.showValue=originalShowValue;}
      if(minInput)properties.push({id:'min',name:'Minimum',type:'text',default:minInput.value.trim()||'0'});
      if(maxInput)properties.push({id:'max',name:'Maximum',type:'text',default:maxInput.value.trim()||'100'});
      if(stepInput)properties.push({id:'step',name:'Step',type:'text',default:stepInput.value.trim()||'1'});
      if(prefixInput)properties.push({id:'valuePrefix',name:'Value prefix',type:'text',default:prefixInput.value.trim()||''});
      if(suffixInput)properties.push({id:'valueSuffix',name:'Value suffix',type:'text',default:suffixInput.value.trim()||''});
      if(ticksNode){properties.push({id:'showTicks',name:'Tick marks',type:'boolean',default:originalShowTicks});selection.showTicks=originalShowTicks;}
      if(supportingNode){const def=supportingTextInput?.value.trim()||supportingNode.text||'Supporting text';properties.push({id:'supportingText',name:'Supporting text',type:'text',default:def},{id:'showSupporting',name:'Show supporting text',type:'boolean',default:originalShowSupporting});selection.supportingText=def;selection.showSupporting=originalShowSupporting;}
      if(minInput)selection.min=minInput.value.trim()||'0';
      if(maxInput)selection.max=maxInput.value.trim()||'100';
      if(stepInput)selection.step=stepInput.value.trim()||'1';
      if(prefixInput)selection.valuePrefix=prefixInput.value.trim()||'';
      if(suffixInput)selection.valueSuffix=suffixInput.value.trim()||'';
      return {anatomy,properties,selection,variants};
    }
    // Rating's own version of the Slider harvest above - Icon size x State
    // x Type(Star/Heart, "Appearance") cross into real Figma variants via
    // captureCrossedProperties() same as Slider's Track thickness x State;
    // Label/Value/Descriptive feedback/Supporting text are independently
    // toggleable (never mutually exclusive the way Select/Add-on's error
    // note is), each harvested and bound to its own Text+Boolean pair.
    // Scale (icon count 3/5/10) and Selected (how many icons render
    // filled) both change the actual number of rendered icon buttons or
    // which specific ones are filled - the same structural limitation as
    // Group Button's segment count, which Figma variants can't express
    // without a separate master per count - exposed as plain orphan Text
    // properties (not bound to any layer) instead, same treatment as
    // Float Button's badge max count and Slider's Min/Max/Step. Allow
    // clear is interaction behavior with no static visual difference, so
    // it's an orphan Boolean for the same reason.
    function captureRatingProperties(){
      const sizeControl=document.querySelector('[data-role="rating-size-mount"]');
      const labelInput=document.querySelector('[data-role="rating-label"]');
      const requiredInput=document.querySelector('[data-role="rating-required"]');
      const showLabelInput=document.querySelector('[data-role="rating-show-label"]');
      const showValueInput=document.querySelector('[data-role="rating-show-value"]');
      const showFeedbackInput=document.querySelector('[data-role="rating-show-feedback"]');
      const allowClearInput=document.querySelector('[data-role="rating-allow-clear"]');
      const showSupportingInput=document.querySelector('[data-role="rating-show-supporting"]');
      const supportingTextInput=document.querySelector('[data-role="rating-supporting-text"]');
      const scaleSelect=document.querySelector('[data-role="rating-scale-select"]');
      const countSelect=document.querySelector('[data-role="rating-count-select"]');
      if(!sizeControl)return captureCrossedProperties();
      const built=captureCrossedProperties();
      const sizeProp=built.properties.find(p=>p.id==='size');if(sizeProp)sizeProp.name='Icon size';

      const originalType=selected.type,originalConfig=selected.config,originalState=selected.state;
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      function currentPart(partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const originalShowLabel=showLabelInput?.checked??true,originalShowValue=showValueInput?.checked??false;
      const originalShowFeedback=showFeedbackInput?.checked??false,originalShowSupporting=showSupportingInput?.checked??false;
      const originalRequired=requiredInput?.checked??false;
      let labelNode=null,valueNode=null,feedbackNode=null,supportingNode=null,requiredNode=null;
      applyingFoundation=true;
      try{
        if(showLabelInput){
          if(!originalShowLabel){showLabelInput.checked=true;showLabelInput.dispatchEvent(new Event('change',{bubbles:true}));}
          if(requiredInput&&!originalRequired){requiredInput.checked=true;requiredInput.dispatchEvent(new Event('change',{bubbles:true}));}
          labelNode=currentPart('label');
          if(labelNode)requiredNode=findPart(labelNode,'required');
          if(requiredInput&&!originalRequired){requiredInput.checked=false;requiredInput.dispatchEvent(new Event('change',{bubbles:true}));}
          if(!originalShowLabel){showLabelInput.checked=false;showLabelInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showValueInput){
          if(!originalShowValue){showValueInput.checked=true;showValueInput.dispatchEvent(new Event('change',{bubbles:true}));}
          valueNode=currentPart('value');
          if(!originalShowValue){showValueInput.checked=false;showValueInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showFeedbackInput){
          if(!originalShowFeedback){showFeedbackInput.checked=true;showFeedbackInput.dispatchEvent(new Event('change',{bubbles:true}));}
          feedbackNode=currentPart('feedback');
          if(!originalShowFeedback){showFeedbackInput.checked=false;showFeedbackInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showSupportingInput){
          if(!originalShowSupporting){showSupportingInput.checked=true;showSupportingInput.dispatchEvent(new Event('change',{bubbles:true}));}
          supportingNode=currentPart('supporting');
          if(!originalShowSupporting){showSupportingInput.checked=false;showSupportingInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
      }finally{
        applyingFoundation=false;refresh();
      }

      if(labelNode&&requiredNode){
        labelNode.children=(labelNode.children||[]).filter(c=>c.id!=='required');
        requiredNode={...requiredNode,styles:{...requiredNode.styles,color:'var(--danger-500)'}};
        labelNode.children.push({...requiredNode,visibleWhen:[{property:'required',equals:true}]});
      }
      if(labelNode){
        // Same fix as captureSliderProperties() above, same reason: binding
        // labelNode directly (instead of its nested text-kind child) gave a
        // label that already has real children (text run + required span)
        // its own non-empty .text too, which adapter.js's bare-text
        // synthesis then duplicated as a second text node alongside the
        // real one.
        const labelTextNode=findLabelNode(labelNode)||labelNode;
        labelTextNode.bind='label';
        labelNode.visibleWhen=[{property:'showLabel',equals:true}];
      }
      if(valueNode){valueNode.bind='value';valueNode.visibleWhen=[{property:'showValue',equals:true}];}
      if(feedbackNode){feedbackNode.bind='feedback';feedbackNode.visibleWhen=[{property:'showFeedback',equals:true}];}
      if(supportingNode)supportingNode.bind='supportingText';

      function replaceOrAppend(parent,node){
        if(!node)return;
        const idx=(parent.children||[]).findIndex(c=>c.id===node.id);
        if(idx>=0)parent.children[idx]=node;else (parent.children=parent.children||[]).push(node);
      }
      const anatomy=built.anatomy;
      if((labelNode||valueNode)&&!findPart(anatomy,'label')&&!findPart(anatomy,'value')){
        const top={id:'top',name:'Label and value',kind:'container',tag:'div',styles:{display:'flex',justifyContent:'space-between',width:'100%'},attributes:{},text:'',children:[labelNode,valueNode].filter(Boolean)};
        anatomy.children=[top,...(anatomy.children||[])];
      }else{
        const top=anatomy.children?.find(c=>findPart(c,'label')||findPart(c,'value'))||anatomy;
        replaceOrAppend(top,labelNode);replaceOrAppend(top,valueNode);
      }
      if(feedbackNode&&!findPart(anatomy,'feedback'))anatomy.children.push(feedbackNode);
      else if(feedbackNode)replaceOrAppend(anatomy,feedbackNode);
      if(supportingNode&&!findPart(anatomy,'supporting'))anatomy.children.push(supportingNode);
      else if(supportingNode)replaceOrAppend(anatomy,supportingNode);

      const properties=[...built.properties];const selection={...built.selection};
      if(labelNode){const def=labelInput?.value.trim()||labelNode.text||'Rate this product';properties.push({id:'label',name:'Label',type:'text',default:def},{id:'showLabel',name:'Show label',type:'boolean',default:originalShowLabel});selection.label=def;selection.showLabel=originalShowLabel;}
      if(requiredNode){properties.push({id:'required',name:'Required',type:'boolean',default:originalRequired});selection.required=originalRequired;}
      if(valueNode){const def=valueNode.text||((countSelect?countSelect.value:'3')+'/'+(scaleSelect?scaleSelect.value:'5'));properties.push({id:'value',name:'Value',type:'text',default:def},{id:'showValue',name:'Show value',type:'boolean',default:originalShowValue});selection.value=def;selection.showValue=originalShowValue;}
      if(feedbackNode){const def=feedbackNode.text??'Good';properties.push({id:'feedback',name:'Descriptive feedback',type:'text',default:def},{id:'showFeedback',name:'Show descriptive feedback',type:'boolean',default:originalShowFeedback});selection.feedback=def;selection.showFeedback=originalShowFeedback;}
      if(supportingNode){const def=supportingTextInput?.value.trim()||supportingNode.text||'Supporting text';properties.push({id:'supportingText',name:'Supporting text',type:'text',default:def},{id:'showSupporting',name:'Show supporting text',type:'boolean',default:originalShowSupporting});selection.supportingText=def;selection.showSupporting=originalShowSupporting;}
      if(allowClearInput){properties.push({id:'allowClear',name:'Allow clear',type:'boolean',default:allowClearInput.checked});selection.allowClear=allowClearInput.checked;}
      if(scaleSelect){properties.push({id:'scale',name:'Scale',type:'text',default:scaleSelect.value});selection.scale=scaleSelect.value;}
      if(countSelect){properties.push({id:'selected',name:'Selected',type:'text',default:String(countSelect.value)});selection.selected=String(countSelect.value);}
      return {anatomy,properties,selection,variants:built.variants};
    }
    // Generic form-field properties for any page following the
    // {prefix}-label / {prefix}-required (or {prefix}-show-icons) /
    // {prefix}-show-supporting / {prefix}-supporting-text /
    // {prefix}-show-error / {prefix}-error-text data-role convention,
    // combined with data-contract-part="label"/"required"/"supporting"/
    // "error" markers on the live matrix cell (Checkbox, Radio, Switch,
    // Select all already follow it). Before this, every one of them only
    // ever exposed State/Size(/Radius) via captureCrossedProperties().
    // Label, Required, Supporting text and Error message were never bound
    // to anything, so every drawn instance showed permanently frozen copy
    // with no way to toggle its error/supporting note in Figma. Label
    // Placement stays a page-level choice, like Button's own Appearance -
    // crossing a 4th style-value axis on top of State x Size(x Radius)
    // risked pushing some of these past adapter.js's hard variant ceiling,
    // not just Figma's 256 guideline.
    function captureFormFieldProperties(){
      // Derive the prefix from the matrix container's own data-role
      // (every one of these pages has exactly one, e.g.
      // "datepicker-matrix-container") rather than from a {prefix}-label
      // control - Search has no visible label at all by design, so relying
      // on finding one first would silently skip Placeholder/Supporting/
      // Error detection too for any such label-less component.
      const prefix=matrix?.dataset.role?.replace(/-matrix-container$/,'');
      const built=captureCrossedProperties();
      if(!prefix)return built;
      // Unscoped, matching how every one of these detail.js files queries
      // its own native controls (plain document.querySelector) - scoping
      // to propertyPanel (the export-actions section specifically, not the
      // whole Customize sidebar) silently found nothing on every page
      // whose Label/Required/Supporting/Error controls live outside it.
      const labelInput=document.querySelector('[data-role="'+prefix+'-label"]');
      const requiredInput=document.querySelector('[data-role="'+prefix+'-required"]');
      const showIconsInput=document.querySelector('[data-role="'+prefix+'-show-icons"]');
      const showSupportingInput=document.querySelector('[data-role="'+prefix+'-show-supporting"]');
      const supportingTextInput=document.querySelector('[data-role="'+prefix+'-supporting-text"]');
      const showErrorInput=document.querySelector('[data-role="'+prefix+'-show-error"]');
      const errorTextInput=document.querySelector('[data-role="'+prefix+'-error-text"]');
      const placeholderInput=document.querySelector('[data-role="'+prefix+'-placeholder"]');
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      // A real <input>/<textarea>'s placeholder attribute is already
      // captured automatically by snapshot() (it's in the attribute
      // whitelist) - no data-contract-part marker needed, just find the
      // actual field element and bind the attribute Figma already has.
      function findInputEl(n){if(n.tag==='input'||n.tag==='textarea')return n;for(const c of n.children||[]){const r=findInputEl(c);if(r)return r;}return null;}
      if(placeholderInput){
        const inputNode=findInputEl(built.anatomy);
        if(inputNode){
          inputNode.attributeBindings={...inputNode.attributeBindings,placeholder:'placeholder'};
          const def=placeholderInput.value.trim()||inputNode.attributes?.placeholder||'Placeholder';
          built.properties=[...built.properties,{id:'placeholder',name:'Placeholder',type:'text',default:def}];
          built.selection={...built.selection,placeholder:def};
          // Placeholder was bound, but the field's own typed-in Value never
          // was - only Filled/Read-Only states happened to show one
          // (add-on-detail.js's own valueAttr logic), baked in as a frozen
          // literal with no Figma property behind it at all, so there was
          // nowhere in Figma's own properties panel to see or change what
          // "filled in" actually looks like. Bind it the same way
          // Placeholder already is - defaulting to EMPTY, not the "Filled"
          // state's demo text: adapter.js only ever shows Placeholder when
          // Value is empty (matching a real input), so defaulting Value to
          // a non-empty literal here would always win and make the
          // Placeholder property invisible/pointless by default, the
          // opposite of this field's own real default (Rest) look.
          inputNode.attributeBindings={...inputNode.attributeBindings,value:'value'};
          const valueDef=inputNode.attributes?.value||'';
          built.properties=[...built.properties,{id:'value',name:'Value',type:'text',default:valueDef}];
          built.selection={...built.selection,value:valueDef};
        }
      }
      if(!requiredInput&&!showIconsInput&&!showSupportingInput&&!showErrorInput){
        const labelNode=findPart(built.anatomy,'label');
        const labelTextNode=labelNode?findLabelNode(labelNode)||labelNode:null;
        if(!labelTextNode)return built;
        labelTextNode.bind='label';
        const def=labelInput.value.trim()||labelTextNode.text||'Label';
        return {...built,properties:[...built.properties,{id:'label',name:'Label',type:'text',default:def}],selection:{...built.selection,label:def}};
      }
      const originalType=selected.type,originalConfig=selected.config,originalState=selected.state;
      function currentPart(partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const labelNode=findPart(built.anatomy,'label');
      const labelTextNode=labelNode?findLabelNode(labelNode)||labelNode:null;
      const originalRequired=requiredInput?.checked??false,originalShowIcons=showIconsInput?.checked??false;
      const originalShowSupporting=showSupportingInput?.checked??false,originalShowError=showErrorInput?.checked??false;
      let requiredNode=null,supportingNode=null,errorNode=null,stateErrorLabel=null,panelNode=null,statePanelLabel=null;
      applyingFoundation=true;
      try{
        if(requiredInput){
          if(!requiredInput.checked){requiredInput.checked=true;requiredInput.dispatchEvent(new Event('change',{bubbles:true}));}
          requiredNode=currentPart('required');
        }
        // Supporting and Error are mutually exclusive in the live render
        // (render() shows whichever's checked, Error winning if both are) -
        // harvest each with the other explicitly off, so both get their own
        // real captured node to bind regardless of which combination (if
        // any) was originally active.
        if(showSupportingInput){
          if(showErrorInput?.checked){showErrorInput.checked=false;showErrorInput.dispatchEvent(new Event('change',{bubbles:true}));}
          if(!showSupportingInput.checked){showSupportingInput.checked=true;showSupportingInput.dispatchEvent(new Event('change',{bubbles:true}));}
          supportingNode=currentPart('supporting');
        }
        if(showErrorInput){
          if(showSupportingInput?.checked){showSupportingInput.checked=false;showSupportingInput.dispatchEvent(new Event('change',{bubbles:true}));}
          if(!showErrorInput.checked){showErrorInput.checked=true;showErrorInput.dispatchEvent(new Event('change',{bubbles:true}));}
          errorNode=currentPart('error');
        }
      }finally{
        // Select/Search/Add-on have no independent Show error control at
        // all - their error note only ever renders for one specific State
        // value (same pattern Input already uses), so there's nothing to
        // toggle. Every State row is already live in the matrix (no
        // Compare-states toggle needed), so just check each one directly
        // for whichever actually renders an 'error' part.
        if(!showErrorInput){
          const stateLabels=built.properties.find(p=>p.id==='state')?.options||[];
          for(const label of stateLabels){
            const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===label);
            const found=entry&&findPart(snapshot(entry.root,'root',0),'error');
            if(found){errorNode=found;stateErrorLabel=label;break;}
          }
        }
        // Cascader's Open state renders a whole dropdown panel (column
        // options) that no other state's DOM includes at all - there is no
        // independent "show panel" toggle, it's driven purely by State, so
        // scan every state row the same way the error note above does.
        // Without this, the panel existed ONLY in the "Open" entry's own
        // snapshot with no counterpart in the base anatomy template
        // (whichever state happened to be selected when the page loaded,
        // never Open) - captureCrossedProperties()'s diff walk only
        // compares nodes that already exist by id in both trees, so the
        // panel's entire subtree was silently dropped and never became a
        // real node in the pushed anatomy at all (reported: the dropdown/
        // cascader panel missing entirely in Figma for the Open state).
        {
          const stateLabels=built.properties.find(p=>p.id==='state')?.options||[];
          for(const label of stateLabels){
            const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===label);
            const found=entry&&findPart(snapshot(entry.root,'root',0),'panel');
            if(found){panelNode=found;statePanelLabel=label;break;}
          }
        }
        // Loading swaps the trailing chevron for a CSS border-trick spinner
        // (data-contract-part="spinner") that exists only in the Loading
        // entry's DOM, so the base anatomy never has it and the diff walk
        // drops it - Figma kept the chevron (or a half-drawn ring) instead of
        // a loader. Same fix as Button's Loading: graft a static
        // progress_activity glyph, shown only while State is Loading, and hide
        // the chevron it replaces.
        {
          const stateLabels=built.properties.find(p=>p.id==='state')?.options||[];
          const loadingLabel=stateLabels.find(l=>/^loading$/i.test(l));
          const entry=loadingLabel&&gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===loadingLabel);
          const harvested=entry?findPart(snapshot(entry.root,'root',0),'spinner'):null;
          const findParentOf=(n,id)=>{for(const c of n.children||[]){if(c.id===id)return n;const r=findParentOf(c,id);if(r)return r;}return null;};
          const chevron=findPart(built.anatomy,'chevron');
          const slotParent=harvested&&chevron?findParentOf(built.anatomy,'chevron'):null;
          if(harvested&&slotParent){
            const glyphSize=harvested.styles.width&&harvested.styles.width!=='auto'?harvested.styles.width:'16px';
            const spinnerNode={id:'spinner',name:'Loading indicator',kind:'icon',tag:'svg',
              styles:{width:glyphSize,height:glyphSize,flexShrink:'0',fill:chevron.styles.color||harvested.styles.borderTopColor||harvested.styles.color||'#FFFFFF'},
              attributes:{viewBox:'0 0 24 24'},
              children:[{id:'spinner-glyph',name:'Loading indicator glyph',kind:'shape',tag:'path',attributes:{d:'M8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3625 2 11.9875C2 10.6125 2.2625 9.32083 2.7875 8.1125C3.3125 6.90417 4.02917 5.84583 4.9375 4.9375C5.84583 4.02917 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C12.2833 2 12.5208 2.09583 12.7125 2.2875C12.9042 2.47917 13 2.71667 13 3C13 3.28333 12.9042 3.52083 12.7125 3.7125C12.5208 3.90417 12.2833 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 11.7167 20.0958 11.4792 20.2875 11.2875C20.4792 11.0958 20.7167 11 21 11C21.2833 11 21.5208 11.0958 21.7125 11.2875C21.9042 11.4792 22 11.7167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.9708 18.1542 19.0625 19.0625C18.1542 19.9708 17.0958 20.6875 15.8875 21.2125C14.6792 21.7375 13.3875 22 12.0125 22C10.6375 22 9.34167 21.7375 8.125 21.2125Z'}}],
              visibleWhen:[{property:'state',equals:loadingLabel}]};
            chevron.visibleWhen=[...(chevron.visibleWhen||[]),{property:'state',equals:loadingLabel,not:true}];
            slotParent.children=[...slotParent.children.filter(c=>c.id!=='spinner'),spinnerNode];
          }
        }
        if(requiredInput){requiredInput.checked=originalRequired;requiredInput.dispatchEvent(new Event('change',{bubbles:true}));}
        if(showSupportingInput){showSupportingInput.checked=originalShowSupporting;showSupportingInput.dispatchEvent(new Event('change',{bubbles:true}));}
        if(showErrorInput){showErrorInput.checked=originalShowError;showErrorInput.dispatchEvent(new Event('change',{bubbles:true}));}
        applyingFoundation=false;refresh();
      }

      if(labelTextNode)labelTextNode.bind='label';
      if(labelNode&&requiredNode){
        labelNode.children=(labelNode.children||[]).filter(c=>c.id!=='required');
        // Required markers have an explicit danger role, including when
        // harvested from a temporarily visible field. Keep that role bound.
        requiredNode={...requiredNode,styles:{...requiredNode.styles,color:'var(--danger-500)'}};
        labelNode.children.push({...requiredNode,visibleWhen:[{property:'required',equals:true}]});
      }
      let rootChildren=built.anatomy.children.filter(c=>c.id!=='supporting'&&c.id!=='error'&&c.id!=='panel');
      if(supportingNode){
        supportingNode.bind='supportingText';
        // Only reference showError/state when this component actually gets
        // that property (Select/Search/Add-on have no show-error control at
        // all - their error note is driven by a State value instead, via
        // stateErrorLabel - referencing 'showError' unconditionally pointed
        // at a property that doesn't exist for those pages).
        const visibleWhen=[{property:'showSupporting',equals:true}];
        if(stateErrorLabel)visibleWhen.push({property:'state',equals:stateErrorLabel,not:true});
        else if(errorNode)visibleWhen.push({property:'showError',equals:true,not:true});
        rootChildren.push({...supportingNode,visibleWhen});
      }
      if(errorNode){errorNode.bind='errorText';rootChildren.push({...errorNode,visibleWhen:stateErrorLabel?[{property:'state',equals:stateErrorLabel}]:[{property:'showError',equals:true}]});}
      if(panelNode)rootChildren.push({...panelNode,visibleWhen:[{property:'state',equals:statePanelLabel}]});
      const anatomy={...built.anatomy,children:rootChildren};

      const properties=[...built.properties];const selection={...built.selection};
      if(labelTextNode){const def=labelInput.value.trim()||labelTextNode.text||'Label';properties.push({id:'label',name:'Label',type:'text',default:def});selection.label=def;}
      if(requiredNode){properties.push({id:'required',name:'Required',type:'boolean',default:originalRequired});selection.required=originalRequired;}
      if(showIconsInput){properties.push({id:'showIcons',name:'State icons',type:'boolean',default:originalShowIcons});selection.showIcons=originalShowIcons;}
      if(supportingNode){const def=supportingTextInput?.value.trim()||supportingNode.text||'Supporting text';properties.push({id:'supportingText',name:'Supporting text',type:'text',default:def},{id:'showSupporting',name:'Show supporting text',type:'boolean',default:originalShowSupporting});selection.supportingText=def;selection.showSupporting=originalShowSupporting;}
      if(errorNode){
        const def=errorTextInput?.value.trim()||errorNode.text||'Error message';
        properties.push({id:'errorText',name:'Error message',type:'text',default:def});selection.errorText=def;
        // Select/Search/Add-on drive their error note from a State value,
        // not an independent toggle - there's no boolean to add here, and
        // the property to switch it on in Figma is already State itself.
        if(!stateErrorLabel){properties.push({id:'showError',name:'Show error',type:'boolean',default:originalShowError});selection.showError=originalShowError;}
      }
      // Color Picker's displayed value (the hex/token text) is always
      // rendered, unlike Supporting/Error - no harvest toggle needed, just
      // bind it directly from the base capture if a "value" part exists.
      const colorValueNode=file==='color-picker-default.html'?findPart(anatomy,'value'):null;
      if(colorValueNode){colorValueNode.bind='value';properties.push({id:'value',name:'Color value',type:'text',default:colorValueNode.text||'#FF031A'});selection.value=colorValueNode.text||'#FF031A';}
      // Foundation audit - Add-on's prefix/suffix chrome is plain static
      // text, exactly like Label/Supporting/Error above (not a derived
      // value Figma can't recompute, unlike Float Button's Badge overflow
      // math or Slider's thumb position) - it only ever fell through to the
      // unbound extras list below because add-on-detail.js's buildAddonField()
      // never marked these two spans with data-contract-part, so findPart()
      // could never find them. Bind them the same way once the marker
      // exists; the extras loop's own `if(properties.some(...))continue`
      // already skips re-adding prefixText/showPrefix/suffixText/showSuffix
      // once they're pushed here, so this only needs to run before it.
      // Figma's auto-layout only supports padding on a FRAME (the parent),
      // never per-child the way CSS flexbox does - but Add-on gives EACH
      // segment (prefix/input/suffix) its own padding, with the shared row
      // itself at zero padding/gap (shell.css .addon-demo-segment/-input).
      // Pushed as-is, the text nodes stretch edge-to-edge with no inset at
      // all, touching the segment boundaries (Figma has no "per-child
      // padding" concept to fall back on). Fix it by promoting whichever
      // node carries its own horizontal padding into a small wrapping
      // frame that owns that padding, with the original node nested
      // inside at zero padding - the one construction Figma auto-layout
      // actually supports for this. Returns the node to keep using for
      // binding/visibility (the original, now-nested, text node).
      function wrapOwnPadding(node){
        if(!node)return node;
        const left=node.styles.paddingLeft,right=node.styles.paddingRight;
        const zero=v=>!v||v==='0px'||v==='0';
        if(zero(left)&&zero(right))return node;
        // attributeBindings/bind/inputRole carry this node's actual meaning
        // (e.g. the Value/Placeholder property binding set earlier in this
        // same function, for the <input> itself) - they must move to the
        // INNER node along with everything else, not get silently dropped
        // here while the OUTER node keeps the id/kind/tag the rest of this
        // function still expects to reference (via the id returned below).
        const inner={id:node.id+'-text',name:node.name,kind:node.kind,tag:node.tag,text:node.text,bind:node.bind,inputRole:node.inputRole,attributeBindings:node.attributeBindings,attributes:{...node.attributes},styles:{...node.styles,paddingLeft:'0px',paddingRight:'0px',paddingTop:'0px',paddingBottom:'0px',width:'auto',flexGrow:'0',borderTopWidth:'0px',borderRightWidth:'0px',borderBottomWidth:'0px',borderLeftWidth:'0px'},children:node.children||[]};
        node.kind='container';node.tag='div';node.text='';node.attributes={};delete node.bind;delete node.inputRole;delete node.attributeBindings;
        // Input identity, validation and state belong to the nested native
        // field, never its layout wrapper. Move variant attributes too.
        for(const variant of built.variants){
          const patch=variant.overrides[node.id];if(!patch?.attributes)continue;
          const innerPatch=variant.overrides[inner.id]||{};
          variant.overrides[inner.id]={...innerPatch,attributes:{...innerPatch.attributes,...patch.attributes}};
          delete patch.attributes;
        }
        // Border (e.g. Add-on's prefix/suffix single-side divider) belongs on
        // THIS outer node, not the inner one - it's a real auto-layout FRAME
        // (adapter.js can give it correct per-side stroke weights), where the
        // inner node is a TEXT node and Figma TEXT has no per-side stroke
        // concept at all: a border landing there renders as a uniform box
        // outline around all four sides of the text instead of the single
        // divider line the live page shows (reported: "2px stroke" boxing in
        // the prefix/suffix text). Keep border-radius here too, for the same
        // "this is the real edge of the segment" reason.
        const borderKeys=['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderTopStyle','borderRightStyle','borderBottomStyle','borderLeftStyle','borderTopColor','borderRightColor','borderBottomColor','borderLeftColor','borderStyle','borderColor','borderRadius','borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius'];
        const border=Object.fromEntries(borderKeys.filter(key=>key in node.styles).map(key=>[key,node.styles[key]]));
        node.styles={display:'flex',alignItems:'center',paddingLeft:left||'0px',paddingRight:right||'0px',paddingTop:node.styles.paddingTop||'0px',paddingBottom:node.styles.paddingBottom||'0px',flexGrow:node.styles.flexGrow,flexShrink:node.styles.flexShrink,width:node.styles.width,height:node.styles.height,...border};
        node.children=[inner];
        return inner;
      }
      let prefixNode=findPart(anatomy,'prefix'),suffixNode=findPart(anatomy,'suffix');
      const inputValueNode=findInputEl(anatomy);
      prefixNode=wrapOwnPadding(prefixNode);suffixNode=wrapOwnPadding(suffixNode);wrapOwnPadding(inputValueNode);
      if(prefixNode){
        const showPrefixInput=document.querySelector('[data-role="'+prefix+'-show-prefix"]'),prefixTextInput=document.querySelector('[data-role="'+prefix+'-prefix-text"]');
        prefixNode.bind='prefixText';
        const def=prefixTextInput?.value.trim()||prefixNode.text||'https://';
        properties.push({id:'prefixText',name:'Prefix text',type:'text',default:def});selection.prefixText=def;
        if(showPrefixInput){prefixNode.visibleWhen=[{property:'showPrefix',equals:true}];properties.push({id:'showPrefix',name:'Show prefix',type:'boolean',default:showPrefixInput.checked});selection.showPrefix=showPrefixInput.checked;}
      }
      if(suffixNode){
        const showSuffixInput=document.querySelector('[data-role="'+prefix+'-show-suffix"]'),suffixTextInput=document.querySelector('[data-role="'+prefix+'-suffix-text"]');
        suffixNode.bind='suffixText';
        const def=suffixTextInput?.value.trim()||suffixNode.text||'.com';
        properties.push({id:'suffixText',name:'Suffix text',type:'text',default:def});selection.suffixText=def;
        if(showSuffixInput){suffixNode.visibleWhen=[{property:'showSuffix',equals:true}];properties.push({id:'showSuffix',name:'Show suffix',type:'boolean',default:showSuffixInput.checked});selection.showSuffix=showSuffixInput.checked;}
      }
      // Remaining per-component controls (Allow clear, Number's stepper/
      // Min/Max/Step, Text Area's Rows/Resizing/Max length/Show counter,
      // Search's leading icon/clear button, Color Picker's value format/
      // swatch shape...) don't have their own independently-bindable
      // visible node the way Label/Supporting/Error do - exposed as plain
      // properties (not bound to any layer) instead, same reasoning as
      // Float Button's Badge max count and Slider's Min/Max/Step: Figma
      // can't recompute a derived value (overflow math, a pixel position)
      // from a bare property.
      const extras=[
        ['allow-clear','Allow clear'],['show-reveal','Show reveal toggle'],['show-stepper','Show stepper'],['min','Minimum'],['max','Maximum'],['step','Step'],
        ['rows-select','Rows'],['resize-select','Resizing'],['max-length','Maximum length'],['min-length','Minimum length'],['show-counter','Show character counter'],
        ['show-prefix','Show prefix'],['prefix-text','Prefix text'],['show-suffix','Show suffix'],['suffix-text','Suffix text'],['suffix-dropdown','Suffix dropdown'],
        ['leading-icon','Leading icon'],['clear-button','Clear button'],
        ['value-format','Value format'],['swatch-shape','Swatch shape'],
        ['format','Date format'],['format-select','Time format'],['suffix','Value suffix'],
      ];
      for(const [suffix,name]of extras){
        const el=document.querySelector('[data-role="'+prefix+'-'+suffix+'"]');
        if(!el)continue;
        const id=suffix.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
        if(properties.some(p=>p.id===id))continue;
        if(el.type==='checkbox'){properties.push({id,name,type:'boolean',default:el.checked});selection[id]=el.checked;}
        else{const def=(el.value??'').trim();properties.push({id,name,type:'text',default:def});selection[id]=def;}
      }
      return {anatomy,properties,selection,variants:built.variants};
    }
    // The check/dash icon only exists in the DOM for the Checked/
    // Indeterminate rows (buildCheckboxCell() only renders
    // .checkbox-demo-icon then) - it's absent from every other state,
    // including whichever one happens to be selected when "Draw in Figma"
    // is clicked. The generic captureCrossedProperties()/diffing walk this
    // falls through to for every other field can only patch a node that
    // already exists in the base anatomy; it has no way to graft in a node
    // that's structurally missing from the originally-captured state. Net
    // effect: whenever Rest/Hover/Focused/Disabled/etc. was selected at
    // capture time, the exported component had no icon node at all, in any
    // state - the same "conditionally-rendered part never makes the base
    // anatomy" bug already fixed this session for Float Button's tooltip
    // and Group Button's Selected-state label. Fix: explicitly harvest the
    // icon from the Checked and Indeterminate rows (whether or not either
    // is the currently-selected one) and graft both into the box node with
    // a visibleWhen tied to State, exactly like Required's asterisk above.
    function captureCheckboxProperties(){
      const built=captureFormFieldProperties();
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const boxNode=findPart(built.anatomy,'box');
      if(!boxNode)return built;
      const originalType=selected.type,originalConfig=selected.config;
      function currentPart(stateLabel,partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===stateLabel);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const stateOptions=built.properties.find(p=>p.id==='state')?.options||[];
      const checkedLabel=stateOptions.find(s=>/^checked$/i.test(s))||(stateOptions.includes('Checked')?'Checked':null);
      const indeterminateLabel=stateOptions.find(s=>/indetermin/i.test(s))||null;
      // CHECK_ICON_SVG and DASH_ICON_SVG are both harvested from their own
      // fresh snapshot() call, so their descendant SVG nodes get the same
      // positional ids (icon-0, icon-0-0...) independently of each other -
      // pushing both as siblings under 'box' without renaming collides, since
      // ids must be unique across the whole contract. Give each harvested
      // subtree its own prefix.
      function rename(n,prefix){n.id=prefix+n.id;for(const child of n.children||[])rename(child,prefix);return n;}
      const checkedIcon=checkedLabel?currentPart(checkedLabel,'icon'):null;
      const indeterminateIcon=indeterminateLabel?currentPart(indeterminateLabel,'icon'):null;
      boxNode.children=(boxNode.children||[]).filter(c=>c.id!=='icon');
      if(checkedIcon)boxNode.children.push({...rename(checkedIcon,'checked-'),visibleWhen:[{property:'state',equals:checkedLabel}]});
      if(indeterminateIcon)boxNode.children.push({...rename(indeterminateIcon,'indeterminate-'),visibleWhen:[{property:'state',equals:indeterminateLabel}]});
      return built;
    }
    // Radio's own version of the checkbox fix directly above - the inner
    // filled dot only exists in the DOM for the Checked row
    // (buildRadioField() only renders .radio-demo-dot then), absent from
    // every other state including whichever happens to be selected at
    // capture time. The generic captureFormFieldProperties()/diffing walk
    // this fell through to can only patch a node that already exists in
    // the base anatomy - it has no way to graft in a node structurally
    // missing from the originally-captured state, so whenever Unchecked/
    // Hover/Focused/Disabled was selected at capture time, the exported
    // circle had no dot in any state, including Checked. Also wraps the
    // circle in data-contract-kind="container" (set directly in
    // radio-detail.js's own markup) so a childless circle - true for
    // every state but Checked - isn't misclassified as a glyph-only TEXT
    // node by tag name alone, which was dropping its border/background
    // shape entirely and made the circle itself invisible, in every state.
    function captureRadioProperties(){
      const built=captureFormFieldProperties();
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const boxNode=findPart(built.anatomy,'box');
      if(!boxNode)return built;
      const originalType=selected.type,originalConfig=selected.config;
      function currentPart(stateLabel,partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===stateLabel);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const stateOptions=built.properties.find(p=>p.id==='state')?.options||[];
      const checkedLabel=stateOptions.find(s=>/^checked$/i.test(s))||(stateOptions.includes('Checked')?'Checked':null);
      const dotNode=checkedLabel?currentPart(checkedLabel,'dot'):null;
      boxNode.children=(boxNode.children||[]).filter(c=>c.id!=='dot');
      if(dotNode)boxNode.children.push({...dotNode,visibleWhen:[{property:'state',equals:checkedLabel}]});
      return built;
    }
    // Date Picker's value text is a plain <span> (role="button" div, not a
    // real <input> - the value is set via its calendar panel), so it never
    // went through the isInput-specific sizing adapter.js already has for
    // real text fields: every single-line text node defaults to
    // textAutoResize:'WIDTH_AND_HEIGHT' (hug its own content) unless marked
    // inputRole:'value', which only ever got set for genuine <input>/
    // <textarea> tags. Left unmarked, the value text ignored its flex share
    // of the control and just grew to fit its own content - fine until the
    // text was long enough to need truncating, at which point it either
    // overflowed the control or got hard-clipped by the control frame with
    // no ellipsis (the "placeholder text not coming according to size"
    // report). Marking it the same way Input's real value text already is
    // reuses adapter.js's existing, proven TRUNCATE-to-available-width path.
    // Switch's "labeled" Appearance renders a real .switch-demo-label (and
    // the required asterisk nested inside it) - "compact" renders neither
    // at all, by design (no visible label). The generic
    // captureFormFieldProperties() this falls through to can only find
    // Label/Required if the CURRENTLY SELECTED Appearance happens to be
    // Labeled at capture time - whenever Compact (the first, and likely
    // default, Appearance option) is selected instead, the base anatomy
    // never gets a 'label' node at all, so neither Label nor Required
    // exists as a property on ANY master once pushed, Labeled included
    // (the same "conditionally-rendered part never makes the base
    // anatomy" limitation already fixed for Checkbox's box icon and
    // Float Button/Group Button before it - this is the reported "Label
    // is missing" on Appearance: Labeled). Fix: whenever the base capture
    // came up without a 'label' part, explicitly harvest one from a
    // Labeled-type row (forcing Required on first, so its asterisk comes
    // along too if harvested) and graft it into the row, visible only
    // when Appearance is actually Labeled.
    function captureSwitchProperties(){
      const built=captureFormFieldProperties();
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const appearanceProp=built.properties.find(p=>p.id==='appearance');
      const labeledOption=appearanceProp&&appearanceProp.options.find(o=>/labeled/i.test(o));
      const existingLabel=labeledOption&&findPart(built.anatomy,'label');
      if(existingLabel){
        // Base anatomy was captured while Appearance=Labeled happened to
        // already be selected on the page, so the label exists structurally
        // from the start - but captureFormFieldProperties's generic capture
        // has no notion of Switch's own Appearance axis hiding it entirely
        // for Compact, so without this tie it renders for every Appearance
        // (the exact bug this function exists to prevent on the other,
        // Compact-base branch below).
        existingLabel.visibleWhen=[...(existingLabel.visibleWhen||[]),{property:'appearance',equals:labeledOption}];
        return built;
      }
      const rowNode=findPart(built.anatomy,'row');
      if(!rowNode||!labeledOption)return built;
      const originalConfig=selected.config,originalState=selected.state;
      const requiredInput=document.querySelector('[data-role="switch-required"]');
      const originalRequired=requiredInput?.checked??false;
      let labelNode=null;
      applyingFoundation=true;
      try{
        if(requiredInput&&!originalRequired){requiredInput.checked=true;requiredInput.dispatchEvent(new Event('change',{bubbles:true}));}
        const entry=gatherEntries().find(e=>e.type===labeledOption&&e.config===originalConfig&&e.state===originalState);
        labelNode=entry?findPart(snapshot(entry.root,'root',0),'label'):null;
      }finally{
        if(requiredInput&&!originalRequired){requiredInput.checked=false;requiredInput.dispatchEvent(new Event('change',{bubbles:true}));}
        applyingFoundation=false;refresh();
      }
      if(!labelNode)return built;
      const grafted={...labelNode,visibleWhen:[{property:'appearance',equals:labeledOption}]};
      rowNode.children=[...(rowNode.children||[]),grafted];
      const labelTextNode=findLabelNode(grafted)||grafted;
      if(labelTextNode)labelTextNode.bind='label';
      const labelInput=document.querySelector('[data-role="switch-label"]');
      const labelDef=(labelInput&&labelInput.value.trim())||labelTextNode.text||'Label';
      built.properties.push({id:'label',name:'Label',type:'text',default:labelDef});built.selection.label=labelDef;
      const requiredNode=findPart(grafted,'required');
      if(requiredNode){
        grafted.children=(grafted.children||[]).filter(c=>c.id!=='required');
        grafted.children.push({...requiredNode,styles:{...requiredNode.styles,color:'var(--danger-500)'},visibleWhen:[{property:'required',equals:true}]});
        built.properties.push({id:'required',name:'Required',type:'boolean',default:originalRequired});built.selection.required=originalRequired;
      }
      return built;
    }
    function captureDatePickerProperties(){
      const built=captureFormFieldProperties();
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const valueNode=findPart(built.anatomy,'value');
      if(valueNode)valueNode.inputRole='value';
      return built;
    }
    // Start/End date are plain, stable-id (data-contract-part="start"/
    // "end") text spans - the generic capture above already gives a plain
    // text node correct hug-to-content sizing with no extra handling
    // needed. This used to wrap both in a synthetic flex-grow frame so
    // each would independently fill-and-truncate its own share of the row
    // (matching the live page's flex:1 1 auto split) - that wrapping, and
    // the extra nested auto-layout hug level it introduced, is exactly
    // what the request to hug content instead of filling was asking to
    // remove: style overrides first landed on the wrong (wrapper) node at
    // 24/28/32px's caption typography, and even after retargeting those
    // correctly, real Figma's hug-resize across that extra nesting level
    // still produced concatenated/overlapping Start+End text at 28/32px -
    // not reproducible in the mock adapter test, consistent with the
    // established real-Figma-only hug-cascade-timing failure class this
    // session has hit before. Removing the wrapper entirely removes that
    // whole risk surface rather than attempting to patch around it again.
    function captureDateRangeProperties(){
      return captureFormFieldProperties();
    }
    // Menu's item labels are a fixed-count illustrative list (same
    // structural shape as Group Button's segments) - each item's own label
    // text gets its own bound Text property, found positionally via
    // findLabelNode() (defined below, next to Group Button) rather than
    // any data-contract-part marker, since there's no ambiguity about
    // which child of each item node is its label once the live builder
    // wraps it in its own <span> (menu-detail.js was mixing raw text with
    // an icon/check sibling before, which snapshot() can't capture as a
    // clean node). State/Appearance/Size/Corner radius are already crossed
    // generically via captureCrossedProperties().
    function captureMenuProperties(){
      const built=captureCrossedProperties();
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      (anatomy.children||[]).forEach((child,i)=>{
        if(child.id==='menu-items-empty')return;
        const labelNode=findLabelNode(child);if(!labelNode)return;
        const id='label'+i,defaultText=labelNode.text||'Item '+(i+1);
        labelNode.bind=id;
        properties.push({id,name:'Item '+(i+1)+' label',type:'text',default:defaultText});
        selection[id]=defaultText;
      });
      // Empty replaces the whole item list with a single centered, dimmed
      // "No menu items." message - structurally different from the normal
      // item rows, so it has no id in the base (Rest-captured) anatomy at
      // all and the generic crossed-variant diff above can never represent
      // it (same limitation as Transfer's own status slot - see
      // captureTransferProperties() below). Scan every rendered state's DOM
      // for the stable data-contract-part="menu-items-empty" marker
      // menu-detail.js gives it regardless of which state is selected,
      // graft it onto the base panel as a real, always-present node hidden
      // unless State is actually Empty, and give the normal item rows a
      // negated visibleWhen so they hide instead of coexisting with it -
      // mirroring Transfer's own list rows exactly.
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const originalType=selected.type;
      const normalRows=(anatomy.children||[]).filter(c=>c.id!=='menu-items-empty');
      for(const row of normalRows)row.visibleWhen=[...(row.visibleWhen||[]),{property:'state',equals:'Empty',not:true}];
      const emptyEntry=gatherEntries().find(e=>e.type===originalType&&e.state==='Empty');
      const emptyFound=emptyEntry?findPart(snapshot(emptyEntry.root,'root',0),'menu-items-empty'):null;
      anatomy.children=emptyFound?[...normalRows,{...emptyFound,visibleWhen:[{property:'state',equals:'Empty'}],styles:{...emptyFound.styles,width:'100%'}}]:normalRows;
      // Loading replaces the item list with a CSS-ring spinner centred in the panel (align/justify center, 16px block padding).
      // The ring exists only in that state, so the diff patched its border-trick styles onto the first item, the items all
      // stayed visible and nothing was centred. Same treatment as Empty: hide the rows and show a static loader glyph, which
      // the panel's own Loading overrides (align/justify center, padding) then centre.
      const loadingEntry=gatherEntries().find(e=>e.type===originalType&&e.state==='Loading');
      const spinnerFound=loadingEntry?findPart(snapshot(loadingEntry.root,'root',0),'spinner'):null;
      if(spinnerFound){
        for(const row of anatomy.children)if(row.id!=='spinner'&&row.id!=='menu-items-empty'&&!/^menu-items-empty/.test(row.id))row.visibleWhen=[...(row.visibleWhen||[]),{property:'state',equals:'Loading',not:true}];
        const size=spinnerFound.styles.width&&spinnerFound.styles.width!=='auto'?spinnerFound.styles.width:'14px';
        anatomy.children=[...anatomy.children,{id:'spinner',name:'Loading indicator',kind:'icon',tag:'svg',
          styles:{width:size,height:size,flexShrink:'0',fill:spinnerFound.styles.borderTopColor||spinnerFound.styles.color||'#FFFFFF'},
          attributes:{viewBox:'0 0 24 24'},
          children:[{id:'spinner-glyph',name:'Loading indicator glyph',kind:'shape',tag:'path',attributes:{d:'M8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3625 2 11.9875C2 10.6125 2.2625 9.32083 2.7875 8.1125C3.3125 6.90417 4.02917 5.84583 4.9375 4.9375C5.84583 4.02917 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C12.2833 2 12.5208 2.09583 12.7125 2.2875C12.9042 2.47917 13 2.71667 13 3C13 3.28333 12.9042 3.52083 12.7125 3.7125C12.5208 3.90417 12.2833 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 11.7167 20.0958 11.4792 20.2875 11.2875C20.4792 11.0958 20.7167 11 21 11C21.2833 11 21.5208 11.0958 21.7125 11.2875C21.9042 11.4792 22 11.7167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.9708 18.1542 19.0625 19.0625C18.1542 19.9708 17.0958 20.6875 15.8875 21.2125C14.6792 21.7375 13.3875 22 12.0125 22C10.6375 22 9.34167 21.7375 8.125 21.2125Z'}}],
          visibleWhen:[{property:'state',equals:'Loading'}]}];
      }
      return {anatomy,properties,selection,variants:built.variants};
    }
    // Breadcrumb's trail is a flat list of crumbs interleaved with divider/
    // overflow spans that also happen to be childless text nodes (a plain
    // "/" or an aria-hidden "..." span) - findLabelNode()'s "childless +
    // has text" heuristic can't tell those apart from a real crumb, so
    // breadcrumb-detail.js marks only the real crumb links/current item
    // with data-contract-name="crumb", and this walks the anatomy tree
    // looking for that name specifically instead.
    function captureBreadcrumbProperties(){
      const built=captureCrossedProperties();
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      function walk(n){const out=[];if(n.name==='crumb')out.push(n);for(const c of n.children||[])out.push(...walk(c));return out;}
      walk(anatomy).forEach((node,i)=>{
        const id='label'+i,defaultText=node.text||'Item '+(i+1);
        node.bind=id;
        properties.push({id,name:'Item '+(i+1)+' label',type:'text',default:defaultText});
        selection[id]=defaultText;
      });
      // The separator differs by Appearance: Chevron is an SVG inside the divider
      // span, Slash is the text "/" in the same span. The diff-only variant
      // capture can't swap a child between those kinds, so Slash came out as
      // Chevron in Figma (no "/" at all). Keep BOTH in every divider, each shown
      // only for its own Appearance, and copy the crumbs' per-size typography
      // onto the "/" so it scales with Size.
      let variants=built.variants;
      {
        const originalType=selected.type,originalConfig=selected.config,originalState=selected.state;
        const sweepEntries=gatherEntries();
        // Appearance values come from the exported property itself, not from whichever
        // appearances the page happens to be displaying while exporting.
        const appearanceOptions=properties.find(p=>p.id==='appearance')?.options||[];
        const slashType=appearanceOptions.find(t=>/slash/i.test(String(t))),chevronType=appearanceOptions.find(t=>/chevron/i.test(String(t)));
        const byName=(n,name)=>{const out=[];if(n.name===name)out.push(n);for(const c of n.children||[])out.push(...byName(c,name));return out;};
        const ownIsSlash=/slash/i.test(String(originalType));
        const otherType=ownIsSlash?chevronType:slashType;
        const otherEntry=otherType!==undefined&&(sweepEntries.find(e=>e.type===otherType&&e.config===originalConfig&&e.state===originalState)||sweepEntries.find(e=>e.type===otherType));
        const ownDividers=byName(anatomy,'divider'),otherDividers=otherEntry?byName(snapshot(otherEntry.root,'root',0),'divider'):[];
        // From a Chevron base the "/" needs nothing from the other appearance (it is a constant glyph set in the
        // divider's own typography); from a Slash base the chevron SVG must be harvested from a Chevron entry.
        if(slashType!==undefined&&chevronType!==undefined&&ownDividers.length&&(!ownIsSlash||ownDividers.length===otherDividers.length)){
          const typography=['fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','color'];
          const slashNode=(host,source)=>({id:host.id+'-slash',name:'Slash',kind:'text',tag:'span',text:source.text||'/',styles:Object.fromEntries(typography.filter(k=>source.styles[k]!==undefined).map(k=>[k,source.styles[k]])),attributes:{},children:[],visibleWhen:[{property:'appearance',equals:slashType}]});
          const slashIds=[];
          ownDividers.forEach((divider,index)=>{
            const other=otherDividers[index];
            if(ownIsSlash){
              const slash=slashNode(divider,divider);slashIds.push(slash.id);
              const chevronKids=(other.children||[]).map(k=>({...k,visibleWhen:[{property:'appearance',equals:chevronType}]}));
              divider.text='';divider.children=[slash,...chevronKids];
            }else{
              const slash=slashNode(divider,{text:'/',styles:divider.styles});slashIds.push(slash.id);
              divider.children=[...(divider.children||[]).map(k=>({...k,visibleWhen:[{property:'appearance',equals:chevronType}]})),slash];
            }
          });
          // The divider frame is sized for the chevron SVG (14px); for Slash it must hug the "/".
          const chevronWidth=(ownIsSlash?otherDividers:ownDividers)[0]?.styles?.width;
          const hugDividers=Object.fromEntries(ownDividers.map(d=>[d.id,{styles:{width:'auto',height:'auto'}}])),chevronDividers=Object.fromEntries(ownDividers.map((d,index)=>[d.id,{styles:{width:(ownIsSlash?otherDividers[index]:d).styles.width,height:(ownIsSlash?otherDividers[index]:d).styles.height}}]));
          variants=[...variants,{id:'cv-slash-dividers',name:'Slash separators',when:{appearance:slashType},overrides:hugDividers},...(ownIsSlash&&chevronWidth?[{id:'cv-chevron-dividers',name:'Chevron separators',when:{appearance:chevronType},overrides:chevronDividers}]:[])];
          // Per-size typography for the "/" follows the first crumb's own overrides.
          const crumb=byName(anatomy,'crumb')[0];
          variants=variants.map(v=>{
            const patch=crumb&&v.overrides?.[crumb.id]?.styles;if(!patch)return v;
            const typed=Object.fromEntries(Object.entries(patch).filter(([k])=>typography.includes(k)&&k!=='color'));
            if(!Object.keys(typed).length)return v;
            const overrides={...v.overrides};for(const id of slashIds)overrides[id]={styles:typed};
            return {...v,overrides};
          });
        }
      }
      return {anatomy,properties,selection,variants};
    }
    // Dropdown: its Empty state opens a menu panel and its Loading state swaps the chevron for a CSS
    // spinner - both exist only in those states' own DOM. The generic form-field capture returns early
    // for pages without Required/Supporting/Error controls (Dropdown has none), so neither was ever
    // exported. Every state sits in one wrapper (wrapper > trigger [+ menu]); this function keeps the
    // menu as an Empty-only layer laid out IN FLOW below the trigger (the page positions it absolutely,
    // which in Figma overflowed the frame and covered neighbouring variants) and adds a static loader
    // glyph in place of the chevron for Loading.
    function captureDropdownProperties(){
      const built=captureCrossedProperties();
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      const originalType=selected.type,originalConfig=selected.config,originalState=selected.state;
      const findPart=(n,id)=>{if(n.id===id)return n;for(const c of n.children||[]){const r=findPart(c,id);if(r)return r;}return null;};
      const parentOf=(n,id)=>{for(const c of n.children||[]){if(c.id===id)return n;const r=parentOf(c,id);if(r)return r;}return null;};
      const entryFor=label=>gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===label);
      const labelNode=findPart(anatomy,'label');
      if(labelNode){
        labelNode.bind='label';
        const def=labelNode.text||'Options';
        properties.push({id:'label',name:'Label',type:'text',default:def});selection.label=def;
      }
      const stateLabels=properties.find(p=>p.id==='state')?.options||[];
      // Empty menu panel
      let panelNode=null,panelLabel=null;
      for(const label of stateLabels){
        const entry=entryFor(label);
        const found=entry&&findPart(snapshot(entry.root,'root',0),'panel');
        if(found){panelNode=found;panelLabel=label;break;}
      }
      anatomy.children=(anatomy.children||[]).filter(c=>c.id!=='panel');
      if(panelNode){
        anatomy.children.push({...panelNode,styles:{...panelNode.styles,position:'static',top:'auto',left:'auto',right:'auto',bottom:'auto',zIndex:'auto'},visibleWhen:[{property:'state',equals:panelLabel}]});
      }
      // Loading spinner in place of the chevron
      const loadingLabel=stateLabels.find(l=>/^loading$/i.test(l));
      const loadingEntry=loadingLabel&&entryFor(loadingLabel);
      const spinner=loadingEntry?findPart(snapshot(loadingEntry.root,'root',0),'spinner'):null;
      const chevron=findPart(anatomy,'chevron'),slot=chevron?parentOf(anatomy,'chevron'):null;
      if(spinner&&chevron&&slot){
        const size=spinner.styles.width&&spinner.styles.width!=='auto'?spinner.styles.width:'14px';
        const glyph={id:'spinner',name:'Loading indicator',kind:'icon',tag:'svg',
          styles:{width:size,height:size,flexShrink:'0',fill:chevron.styles.color||spinner.styles.borderTopColor||spinner.styles.color||'#FFFFFF'},
          attributes:{viewBox:'0 0 24 24'},
          children:[{id:'spinner-glyph',name:'Loading indicator glyph',kind:'shape',tag:'path',attributes:{d:'M8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3625 2 11.9875C2 10.6125 2.2625 9.32083 2.7875 8.1125C3.3125 6.90417 4.02917 5.84583 4.9375 4.9375C5.84583 4.02917 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C12.2833 2 12.5208 2.09583 12.7125 2.2875C12.9042 2.47917 13 2.71667 13 3C13 3.28333 12.9042 3.52083 12.7125 3.7125C12.5208 3.90417 12.2833 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 11.7167 20.0958 11.4792 20.2875 11.2875C20.4792 11.0958 20.7167 11 21 11C21.2833 11 21.5208 11.0958 21.7125 11.2875C21.9042 11.4792 22 11.7167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.9708 18.1542 19.0625 19.0625C18.1542 19.9708 17.0958 20.6875 15.8875 21.2125C14.6792 21.7375 13.3875 22 12.0125 22C10.6375 22 9.34167 21.7375 8.125 21.2125Z'}}],
          visibleWhen:[{property:'state',equals:loadingLabel}]};
        chevron.visibleWhen=[...(chevron.visibleWhen||[]),{property:'state',equals:loadingLabel,not:true}];
        slot.children=[...slot.children.filter(c=>c.id!=='spinner'),glyph];
      }
      // Wrapper stacks trigger + menu with the page's own 6px offset; it hugs both.
      anatomy.styles={...anatomy.styles,display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'var(--dimension-6)',width:'auto',height:'auto'};
      // The page positions the Empty menu absolutely, so every captured wrapper is only as big as its trigger (24, 28, 32...px tall).
      // Per-size/state overrides carried those fixed sizes onto the wrapper and froze each Empty variant at trigger height, so its
      // menu (laid out in flow below the trigger) overhung the variant and covered its neighbours on the canvas. The wrapper must
      // hug trigger + menu in every variant, so its captured width/height are dropped.
      const variants=built.variants.map(v=>{
        const own=v.overrides&&v.overrides[anatomy.id];
        if(!own||!own.styles)return v;
        const styles={...own.styles};delete styles.width;delete styles.height;
        const overrides={...v.overrides};
        if(Object.keys(styles).length||Object.keys(own).some(k=>k!=='styles'))overrides[anatomy.id]={...own,styles};else delete overrides[anatomy.id];
        return {...v,overrides};
      });
      return {anatomy,properties,selection,variants};
    }
    // Pagination: Numbered and Simple share the arrows but differ in the middle (five page buttons vs a "Page 3 of 12"
    // label), and Loading replaces that middle with a spinner. The diff-only variant capture can't swap a child between
    // kinds, so Simple/Loading kept the Numbered buttons (still at the base radius) in Figma. The arrows keep shared ids
    // (prev/next) so size/state/radius overrides reach both appearances; the middle is exported as separate layers, each
    // shown only for its own Appearance and State.
    function capturePaginationProperties(){
      const built=captureCrossedProperties();
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      const originalConfig=selected.config,originalType=selected.type;
      const findPart=(n,id)=>{if(n.id===id)return n;for(const c of n.children||[]){const r=findPart(c,id);if(r)return r;}return null;};
      const options=properties.find(p=>p.id==='appearance')?.options||[];
      const numberedType=options.find(o=>/numbered/i.test(String(o))),simpleType=options.find(o=>/simple/i.test(String(o)));
      const stateLabels=properties.find(p=>p.id==='state')?.options||[];
      const restLabel=stateLabels.find(l=>/^rest$/i.test(l))||stateLabels[0],loadingLabel=stateLabels.find(l=>/^loading$/i.test(l));
      const snapFor=(type,state)=>{const e=gatherEntries().find(x=>x.type===type&&x.config===originalConfig&&x.state===state);return e?snapshot(e.root,'root',0):null;};
      if(numberedType!==undefined&&simpleType!==undefined){
        const numberedSnap=snapFor(numberedType,restLabel),simpleSnap=snapFor(simpleType,restLabel),loadingSnap=loadingLabel?snapFor(numberedType,loadingLabel)||snapFor(simpleType,loadingLabel):null;
        const prev=findPart(anatomy,'prev')||(numberedSnap&&findPart(numberedSnap,'prev')),next=findPart(anatomy,'next')||(numberedSnap&&findPart(numberedSnap,'next'));
        const items=[1,2,3,4,5].map(n=>(numberedSnap&&findPart(numberedSnap,'item-'+n))||findPart(anatomy,'item-'+n)).filter(Boolean);
        const count=(simpleSnap&&findPart(simpleSnap,'count'))||findPart(anatomy,'count');
        const spinner=loadingSnap&&findPart(loadingSnap,'spinner');
        if(prev&&next&&items.length&&count){
          const notLoading=loadingLabel?[{property:'state',equals:loadingLabel,not:true}]:[];
          const middle=[
            ...items.map(item=>({...item,visibleWhen:[{property:'appearance',equals:numberedType},...notLoading]})),
            {...count,visibleWhen:[{property:'appearance',equals:simpleType},...notLoading]}
          ];
          if(spinner&&loadingLabel){
            const size=spinner.styles.width&&spinner.styles.width!=='auto'?spinner.styles.width:'14px';
            middle.push({id:'spinner',name:'Loading indicator',kind:'icon',tag:'svg',
              styles:{width:size,height:size,flexShrink:'0',fill:spinner.styles.borderTopColor||spinner.styles.color||'#FFFFFF'},
              attributes:{viewBox:'0 0 24 24'},
              children:[{id:'spinner-glyph',name:'Loading indicator glyph',kind:'shape',tag:'path',attributes:{d:'M8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3625 2 11.9875C2 10.6125 2.2625 9.32083 2.7875 8.1125C3.3125 6.90417 4.02917 5.84583 4.9375 4.9375C5.84583 4.02917 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C12.2833 2 12.5208 2.09583 12.7125 2.2875C12.9042 2.47917 13 2.71667 13 3C13 3.28333 12.9042 3.52083 12.7125 3.7125C12.5208 3.90417 12.2833 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 11.7167 20.0958 11.4792 20.2875 11.2875C20.4792 11.0958 20.7167 11 21 11C21.2833 11 21.5208 11.0958 21.7125 11.2875C21.9042 11.4792 22 11.7167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.9708 18.1542 19.0625 19.0625C18.1542 19.9708 17.0958 20.6875 15.8875 21.2125C14.6792 21.7375 13.3875 22 12.0125 22C10.6375 22 9.34167 21.7375 8.125 21.2125Z'}}],
              visibleWhen:[{property:'state',equals:loadingLabel}]});
          }
          anatomy.children=[prev,...middle,next];
        }
      }
      return {anatomy,properties,selection,variants:built.variants};
    }
    // Anchor's own label text used to sit as raw text directly alongside
    // the icon SVG (for Type="icon") inside one <a> - mixed text+element
    // content snapshot() can't capture as its own node, same issue as
    // Dropdown's trigger label; anchor-detail.js now wraps it in its own
    // <span> so findLabelNode() finds it as a clean nested child. Icon
    // position (leading/trailing) is a structural reorder of the icon vs
    // text, not a static visual difference Figma can recompute from a bound
    // property, so it stays an orphan editable property (same treatment as
    // Button's Content/icon placement staying page-level).
    function captureAnchorProperties(){
      const built=captureCrossedProperties();
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      const labelInput=document.querySelector('[data-role="anchor-label"]');
      const iconPositionSelect=document.querySelector('[data-role="anchor-icon-position"]');
      const labelNode=findLabelNode(anatomy);
      if(labelNode){
        labelNode.bind='label';
        const def=labelInput?.value.trim()||labelNode.text||'Learn more';
        properties.push({id:'label',name:'Label',type:'text',default:def});
        selection.label=def;
      }
      if(iconPositionSelect){
        properties.push({id:'iconPosition',name:'Icon position',type:'text',default:iconPositionSelect.value});
        selection.iconPosition=iconPositionSelect.value;
      }
      // The With icon appearance's trailing/leading arrow exists only in that
      // appearance's own DOM, so the diff-only variant capture never created
      // it - Figma's With icon looked identical to Standalone (no icon at
      // all). Harvest the icon once, keep it in the anatomy shown only for With
      // icon, and add its per-size/per-state styles to the matching variants.
      let variants=built.variants;
      {
        const originalType=selected.type,originalConfig=selected.config,originalState=selected.state;
        const findPart=(n,id)=>{if(n.id===id)return n;for(const c of n.children||[]){const r=findPart(c,id);if(r)return r;}return null;};
        const sweepEntries=gatherEntries();
        const iconType=[...new Set(sweepEntries.map(e=>e.type))].find(t=>/icon/i.test(String(t)));
        if(iconType!==undefined){
          const iconSnap=e=>{const snap=snapshot(e.root,'root',0);return findPart(snap,'icon');};
          const own=originalType===iconType?findPart(anatomy,'icon'):null;
          const seedEntry=sweepEntries.find(e=>e.type===iconType&&e.config===originalConfig&&e.state===originalState)||sweepEntries.find(e=>e.type===iconType);
          const seed=own||(seedEntry?iconSnap(seedEntry):null);
          if(seed){
            const leading=(iconPositionSelect?.value||'trailing')==='leading';
            const iconNode={...seed,id:'icon',name:'Icon',visibleWhen:[{property:'appearance',equals:iconType}]};
            anatomy.children=(anatomy.children||[]).filter(c=>c.id!=='icon');
            anatomy.children=leading?[iconNode,...anatomy.children]:[...anatomy.children,iconNode];
            const patchOf=(base,n)=>{const styles={};for(const [k,v] of Object.entries(n.styles||{}))if(base.styles[k]!==v)styles[k]=v;const attributes={};for(const [k,v] of Object.entries(n.attributes||{}))if(base.attributes[k]!==v)attributes[k]=v;const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;return patch;};
            variants=variants.map(v=>({...v,overrides:{...v.overrides}}));
            // Only the selected size's matrix is live while exporting, so the
            // per-state styles (colour, cursor) come from those entries and are
            // reused for every size; the icon's size follows the same scale the
            // page's CSS uses (font-size + 2px: 12->14, 14->16, 16->18, 18->20).
            const stateStyles=new Map();
            for(const entry of sweepEntries){
              if(entry.type!==iconType)continue;
              const node=iconSnap(entry);if(!node)continue;
              const patch=patchOf(iconNode,node);
              if(patch.styles){delete patch.styles.width;delete patch.styles.height;if(!Object.keys(patch.styles).length)delete patch.styles;}
              if(Object.keys(patch).length)stateStyles.set(entry.state,patch);
            }
            for(const variant of variants){
              if(variant.when.appearance!==iconType)continue;
              const px=parseFloat(String(variant.when.size||'').match(/\d+/)?.[0]);
              const patch={...(stateStyles.get(variant.when.state)||{})};
              if(Number.isFinite(px)){const dim='var(--dimension-'+(px+2)+')';patch.styles={...(patch.styles||{}),width:dim,height:dim};}
              if(Object.keys(patch).length)variant.overrides.icon={...(variant.overrides.icon||{}),...patch};
            }
          }
        }
      }
      return {anatomy,properties,selection,variants};
    }
    // Tabs: each tab's own label is bound positionally (findLabelNode(),
    // same as Menu's items) - tabs-detail.js now wraps each one in its own
    // <span> so it survives snapshot() even on the one tab whose State
    // swaps its label out for a loading spinner (findLabelNode() simply
    // returns null for that position that capture, same graceful
    // degradation as everywhere else). Badge is harvested the same way
    // Slider harvests Tick marks - briefly shown during export even if
    // currently off, so there's a real node with real content to bind
    // Badge count to and gate behind Show badge. Equal-width tabs changes
    // each tab's width-sizing mode (hug vs fill), not a bindable layer, so
    // it stays an orphan editable property like Icon position/Thumb shape
    // elsewhere - the row keeps whichever width mode was active at capture.
    function captureTabsProperties(){
      const equalWidthInput=document.querySelector('[data-role="tabs-equal-width"]');
      const badgeInput=document.querySelector('[data-role="tabs-badge"]');
      const built=captureCrossedProperties();
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};

      (anatomy.children||[]).forEach((child,i)=>{
        const labelNode=findLabelNode(child);if(!labelNode)return;
        const id='label'+i,defaultText=labelNode.text||'Tab '+(i+1);
        labelNode.bind=id;
        properties.push({id,name:'Tab '+(i+1)+' label',type:'text',default:defaultText});
        selection[id]=defaultText;
      });

      const originalType=selected.type,originalConfig=selected.config,originalState=selected.state;
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      function currentPart(partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const originalBadge=badgeInput?.checked??false;
      let badgeNode=null;
      if(badgeInput){
        applyingFoundation=true;
        try{
          if(!originalBadge){badgeInput.checked=true;badgeInput.dispatchEvent(new Event('change',{bubbles:true}));}
          badgeNode=currentPart('badge');
          if(!originalBadge){badgeInput.checked=false;badgeInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }finally{applyingFoundation=false;refresh();}
      }
      if(badgeNode){
        badgeNode.bind='badgeCount';
        badgeNode.visibleWhen=[{property:'badge',equals:true}];
        const host=anatomy.children?.[2];
        if(host&&!findPart(host,'badge'))host.children=[...(host.children||[]),badgeNode];
        properties.push({id:'badgeCount',name:'Badge count',type:'text',default:badgeNode.text||'3'},{id:'badge',name:'Show badge',type:'boolean',default:originalBadge});
        selection.badgeCount=badgeNode.text||'3';selection.badge=originalBadge;
      }
      if(equalWidthInput){
        properties.push({id:'equalWidth',name:'Equal-width tabs',type:'boolean',default:equalWidthInput.checked});
        selection.equalWidth=equalWidthInput.checked;
      }
      // Loading replaces the FIRST tab's label with a spinner (CSS border-trick
      // that Figma can't animate), so no other state's DOM has it and the
      // variant diff - which only patches nodes present in both - dropped it:
      // Figma's Loading looked identical to Rest. Graft a static progress glyph
      // shown only in Loading, and hide the label it replaces, same as Button.
      {
        const loadingLabel=(properties.find(p=>p.id==='state')?.options||[]).find(l=>/^loading$/i.test(l));
        const loadingEntry=loadingLabel&&gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===loadingLabel);
        const spinner=loadingEntry?findPart(snapshot(loadingEntry.root,'root',0),'spinner'):null;
        const firstTab=(anatomy.children||[])[0];
        const firstLabel=firstTab?findLabelNode(firstTab):null;
        if(spinner&&firstTab&&firstLabel){
          const size=spinner.styles.width&&spinner.styles.width!=='auto'?spinner.styles.width:'14px';
          firstLabel.visibleWhen=[...(firstLabel.visibleWhen||[]),{property:'state',equals:loadingLabel,not:true}];
          firstTab.children=[{id:'spinner',name:'Loading indicator',kind:'icon',tag:'svg',
            styles:{width:size,height:size,flexShrink:'0',fill:spinner.styles.borderTopColor||spinner.styles.color||firstLabel.styles.color||'#FFFFFF'},
            attributes:{viewBox:'0 0 24 24'},
            children:[{id:'spinner-glyph',name:'Loading indicator glyph',kind:'shape',tag:'path',attributes:{d:'M8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3625 2 11.9875C2 10.6125 2.2625 9.32083 2.7875 8.1125C3.3125 6.90417 4.02917 5.84583 4.9375 4.9375C5.84583 4.02917 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C12.2833 2 12.5208 2.09583 12.7125 2.2875C12.9042 2.47917 13 2.71667 13 3C13 3.28333 12.9042 3.52083 12.7125 3.7125C12.5208 3.90417 12.2833 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 11.7167 20.0958 11.4792 20.2875 11.2875C20.4792 11.0958 20.7167 11 21 11C21.2833 11 21.5208 11.0958 21.7125 11.2875C21.9042 11.4792 22 11.7167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.9708 18.1542 19.0625 19.0625C18.1542 19.9708 17.0958 20.6875 15.8875 21.2125C14.6792 21.7375 13.3875 22 12.0125 22C10.6375 22 9.34167 21.7375 8.125 21.2125Z'}}],
            visibleWhen:[{property:'state',equals:loadingLabel}]},...(firstTab.children||[])];
        }
      }
      // Equal-width tabs: the live bar switches to display:flex / width:100% and
      // every tab to flex:1 1 0. This was only exposed as an orphan boolean that
      // changed nothing in Figma. Capture the real equal-width layout once and
      // ship it as a variant keyed on that boolean (styles only).
      let variants=built.variants;
      if(equalWidthInput){
        const originalEqual=equalWidthInput.checked;
        let equalAnatomy=null;
        applyingFoundation=true;
        try{
          if(!originalEqual){equalWidthInput.checked=true;equalWidthInput.dispatchEvent(new Event('change',{bubbles:true}));}
          const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
          equalAnatomy=entry?snapshot(entry.root,'root',0):null;
          if(!originalEqual){equalWidthInput.checked=false;equalWidthInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }finally{applyingFoundation=false;refresh();}
        if(equalAnatomy){
          const baseById=new Map();(function walk(n){baseById.set(n.id,n);for(const c of n.children||[])walk(c);})(anatomy);
          const overrides={};
          (function walk(n){
            const b=baseById.get(n.id);
            if(b&&b.kind===n.kind){
              const styles={};for(const [name,value]of Object.entries(n.styles||{}))if(b.styles[name]!==value)styles[name]=value;
              if(Object.keys(styles).length)overrides[n.id]={styles};
            }
            for(const c of n.children||[])walk(c);
          })(equalAnatomy);
          if(Object.keys(overrides).length)variants=[...variants,{id:'cv-equal-width',name:'Equal-width tabs',when:{equalWidth:true},overrides}];
        }
      }
      return {anatomy,properties,selection,variants};
    }
    // Transfer's Size control is a plain <select> (transfer-size-select),
    // not the usual multiselect checkbox list captureCrossedProperties()
    // expects - only one size's matrix section ever renders at a time, so
    // sweeping every combination means actually driving the select through
    // each of its own values and re-gathering entries at each one, rather
    // than reading several already-visible combo sections. Same override-
    // diff/structural-swap-guard logic as captureCrossedProperties(), just
    // walked by hand. Left/right title are bound Text properties, found
    // via their own data-contract-part markers (transfer-detail.js already
    // wraps each in a clean <span>, so no mixed-content issue here).
    function captureTransferProperties(){
      const M=window.ADSComponentContract;
      const sizeSelect=document.querySelector('[data-role="transfer-size-select"]');
      const leftTitleInput=document.querySelector('[data-role="transfer-left-title"]');
      const rightTitleInput=document.querySelector('[data-role="transfer-right-title"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state,originalSize=sizeSelect?sizeSelect.value:null;
      const sizeOptionEls=sizeSelect?[...sizeSelect.options]:[];
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const variants=[];let typeOptions=[],stateOptions=[],sizeOptions=[];
      applyingFoundation=true;
      try{
        for(const opt of sizeOptionEls){
          if(sizeSelect.value!==opt.value){sizeSelect.value=opt.value;sizeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
          for(const entry of gatherEntries()){
            typeOptions.push(entry.type);stateOptions.push(entry.state);sizeOptions.push(entry.config);
            if(entry.type===originalType&&entry.state===originalState&&opt.value===originalSize)continue;
            const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
            (function walk(n){
              const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
              if(baseNode){
                const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
                const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
                for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
                const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
                if(Object.keys(patch).length)overrides[n.id]=patch;
              }
              for(const child of n.children||[])walk(child);
            })(variantAnatomy);
            const when={state:entry.state,appearance:entry.type,size:entry.config};
            const variantName=[entry.type,entry.config,entry.state].filter(Boolean).join(' / ');
            if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
          }
        }
      }finally{
        if(sizeSelect&&sizeSelect.value!==originalSize){sizeSelect.value=originalSize;sizeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
        applyingFoundation=false;refresh();
      }
      typeOptions=[...new Set(typeOptions)];stateOptions=[...new Set(stateOptions)];sizeOptions=[...new Set(sizeOptions)];
      const originalSizeLabel=gatherEntries().find(e=>e.type===originalType&&e.state===originalState)?.config||sizeOptions[0];
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:typeOptions.includes(originalType)?originalType:typeOptions[0]});selection.appearance=properties[properties.length-1].default;}
      if(sizeOptions.length>1){properties.push({id:'size',name:'Size',type:'options',options:sizeOptions,default:sizeOptions.includes(originalSizeLabel)?originalSizeLabel:sizeOptions[0]});selection.size=properties[properties.length-1].default;}
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const leftTitleNode=findPart(baseAnatomy,'left-title');
      const rightTitleNode=findPart(baseAnatomy,'right-title');
      if(leftTitleNode){leftTitleNode.bind='leftTitle';const def=leftTitleInput?.value.trim()||leftTitleNode.text||'Source';properties.push({id:'leftTitle',name:'Left title',type:'text',default:def});selection.leftTitle=def;}
      if(rightTitleNode){rightTitleNode.bind='rightTitle';const def=rightTitleInput?.value.trim()||rightTitleNode.text||'Target';properties.push({id:'rightTitle',name:'Right title',type:'text',default:def});selection.rightTitle=def;}
      // Loading/Empty/No Results each replace the list's normal item rows
      // with something structurally different (a spinner, or a message),
      // and Error adds a banner that exists nowhere else - none of it has
      // any id in the base (Rest-captured) anatomy template at all, so the
      // generic crossed-variant diff above can never represent it (reported:
      // Loading showing a misaligned leftover, Empty/No Results not
      // matching the real page, Error's banner missing). Scan for the
      // state whose DOM actually has each part (via the stable
      // data-contract-part ids transfer-detail.js now marks them with),
      // then graft each on as a real, always-present node hidden unless
      // its own specific state is selected - same treatment every other
      // state-exclusive structural part in this system gets.
      const STATUS_STATES=['Loading','Empty','No Results'];
      const sourceListNode=findPart(baseAnatomy,'source-list');
      const targetListNode=findPart(baseAnatomy,'target-list');
      for(const [listNode,statusPart] of [[sourceListNode,'source-status'],[targetListNode,'target-status']]){
        if(!listNode)continue;
        const normalRows=(listNode.children||[]).filter(c=>c.id!==statusPart);
        for(const row of normalRows)row.visibleWhen=[...(row.visibleWhen||[]),...STATUS_STATES.map(label=>({property:'state',equals:label,not:true}))];
        const harvested=[];
        for(const label of STATUS_STATES){
          const entry=gatherEntries().find(e=>e.type===originalType&&e.state===label);
          if(!entry)continue;
          const found=findPart(snapshot(entry.root,'root',0),statusPart);
          if(!found)continue;
          // The status slot (Loading indicator / "No available items." etc.)
          // must resize with its list in Figma: width:100% -> STRETCH across
          // the list's width, flexGrow:1 -> layoutGrow across its height
          // (Fill container both ways). Captured pixel sizes would otherwise
          // leave it fixed at whatever one Size happened to measure.
          let node={...found,id:statusPart+'-'+M.id(label),visibleWhen:[{property:'state',equals:label}],styles:{...found.styles,width:'100%',flexGrow:'1'}};
          if(label==='Loading'&&node.children?.length){
            // The live page's Loading indicator is a CSS border-trick spun
            // by an `animation` property - meaningless once exported, since
            // Figma has no equivalent and a frozen frame of it reads as a
            // half-drawn, barely-visible ring (compounded by its own border
            // color being a near-invisible 15%-opacity token) rather than
            // "loading" (reported: the loader icon missing). Same fix
            // already proven for Button's own Loading state: swap it for a
            // real static icon (the same progress_activity glyph) instead -
            // reads as a loading indicator even standing still. Keep the
            // harvested span's real captured size/color so the glyph still
            // matches this control's own current foreground.
            const spinnerSpan=node.children[0];
            node={...node,children:[{
              id:node.children[0].id,name:'Loading indicator',kind:'icon',tag:'svg',
              styles:{width:spinnerSpan.styles.width,height:spinnerSpan.styles.height,flexShrink:'0',fill:spinnerSpan.styles.color||spinnerSpan.styles.borderColor||spinnerSpan.styles.borderTopColor||'#FFFFFF'},
              attributes:{viewBox:'0 0 24 24'},
              children:[{id:spinnerSpan.id+'-glyph',name:'Loading indicator glyph',kind:'shape',tag:'path',attributes:{d:'M8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3625 2 11.9875C2 10.6125 2.2625 9.32083 2.7875 8.1125C3.3125 6.90417 4.02917 5.84583 4.9375 4.9375C5.84583 4.02917 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C12.2833 2 12.5208 2.09583 12.7125 2.2875C12.9042 2.47917 13 2.71667 13 3C13 3.28333 12.9042 3.52083 12.7125 3.7125C12.5208 3.90417 12.2833 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 11.7167 20.0958 11.4792 20.2875 11.2875C20.4792 11.0958 20.7167 11 21 11C21.2833 11 21.5208 11.0958 21.7125 11.2875C21.9042 11.4792 22 11.7167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.9708 18.1542 19.0625 19.0625C18.1542 19.9708 17.0958 20.6875 15.8875 21.2125C14.6792 21.7375 13.3875 22 12.0125 22C10.6375 22 9.34167 21.7375 8.125 21.2125Z'},styles:{}}]
            }]};
          }
          harvested.push(node);
        }
        listNode.children=[...normalRows,...harvested];
      }
      const bannerEntry=gatherEntries().find(e=>e.type===originalType&&e.state==='Error');
      const bannerNode=bannerEntry?findPart(snapshot(bannerEntry.root,'root',0),'banner'):null;
      if(bannerNode){baseAnatomy.children=[{...bannerNode,visibleWhen:[{property:'state',equals:'Error'}]},...(baseAnatomy.children||[])];}
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Upload has no Size/Corner radius control at all (just Appearance x
    // State), and its matrix has no .button-matrix-combo-label element -
    // gatherEntries() falls back to a single 'Configuration 1' config for
    // every entry, so every Type/State combination already coexists in one
    // table (unlike Transfer's single-visible-size-at-a-time select) -
    // crossing is a plain manual sweep over gatherEntries() with no native
    // control to drive first. Label and Helper text are bound Text
    // properties via their own data-contract-part markers.
    function captureUploadProperties(){
      const M=window.ADSComponentContract;
      const labelInput=document.querySelector('[data-role="upload-label"]');
      const helperInput=document.querySelector('[data-role="upload-helper"]');
      const requiredInput=document.querySelector('[data-role="upload-required"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      // Dropzone and Button are structurally different (a dashed box holding
      // icon + label + helper, vs a bare label / trigger button / helper
      // stack), so the Appearance axis can't be expressed as style patches on
      // shared nodes - the variant diff only compares nodes that exist in
      // both, so whichever appearance wasn't the selected one (Button) was
      // simply missing in Figma. Capture each appearance's own group and keep
      // both in the anatomy, each shown only for its own Appearance value.
      const isButtonType=type=>/button/i.test(String(type));
      const groupId=type=>isButtonType(type)?'button-group':'dropzone';
      const findIn=(n,id)=>{if(n.id===id)return n;for(const c of n.children||[]){const r=findIn(c,id);if(r)return r;}return null;};
      const parentOf=(n,id)=>{for(const c of n.children||[]){if(c.id===id)return n;const r=parentOf(c,id);if(r)return r;}return null;};
      const otherType=typeOptions.find(t=>t!==originalType);
      if(otherType!==undefined){
        const ownGroup=findIn(baseAnatomy,groupId(originalType));
        const otherEntry=sweep.find(e=>e.type===otherType&&e.state===originalState)||sweep.find(e=>e.type===otherType);
        const otherGroup=otherEntry?findIn(snapshot(otherEntry.root,'root',0),groupId(otherType)):null;
        const holder=ownGroup?parentOf(baseAnatomy,ownGroup.id):null;
        if(ownGroup&&otherGroup&&holder){
          const own={...ownGroup,visibleWhen:[{property:'appearance',equals:originalType}]},other={...otherGroup,visibleWhen:[{property:'appearance',equals:otherType}]};
          holder.children=holder.children.flatMap(c=>c===ownGroup?(isButtonType(originalType)?[other,own]:[own,other]):[c]);
        }
      }
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const labelNode=findPart(baseAnatomy,'label')||findPart(baseAnatomy,'button-label');
      const helperNode=findPart(baseAnatomy,'helper')||findPart(baseAnatomy,'button-helper');
      const secondLabelNode=labelNode&&labelNode.id==='label'?findPart(baseAnatomy,'button-label'):findPart(baseAnatomy,'label');
      const secondHelperNode=helperNode&&helperNode.id==='helper'?findPart(baseAnatomy,'button-helper'):findPart(baseAnatomy,'helper');
      // Required's asterisk nests inside the label part, same as every
      // other component - but baseAnatomy above was already snapshotted
      // at whatever Required happened to be set to, with no toggle-and-
      // restore dance (Upload has no Show label/supporting/error axis to
      // mirror, so this is its own small version of the same harvest).
      // Force it on, take one fresh snapshot of just the label subtree to
      // pull the real required part, then restore - so Required always
      // comes through as a genuine, independently toggleable property
      // regardless of whichever state the live checkbox was left in.
      const originalRequired=requiredInput?.checked??false;
      let requiredNode=null;
      if(requiredInput){
        applyingFoundation=true;
        try{
          if(!originalRequired){requiredInput.checked=true;requiredInput.dispatchEvent(new Event('change',{bubbles:true}));}
          // Toggling Required re-renders the matrix, so selected.root is a stale,
          // detached node by now - look the entry up again (same as every other
          // capture's currentPart()) or the asterisk is never found and Required
          // silently disappears from the exported properties.
          const freshEntry=gatherEntries().find(e=>e.type===originalType&&e.state===originalState);
          const freshLabel=freshEntry?findPart(snapshot(freshEntry.root,'root',0),isButtonType(originalType)?'button-label':'label'):null;
          requiredNode=freshLabel?findPart(freshLabel,isButtonType(originalType)?'button-required':'required'):null;
          if(!originalRequired){requiredInput.checked=false;requiredInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }finally{
          applyingFoundation=false;refresh();
        }
      }
      if(labelNode&&requiredNode){
        labelNode.children=(labelNode.children||[]).filter(c=>c.id!=='required');
        requiredNode={...requiredNode,styles:{...requiredNode.styles,color:'var(--danger-500)'}};
        labelNode.children.push({...requiredNode,visibleWhen:[{property:'required',equals:true}]});
        if(secondLabelNode){
          const secondRequiredId=labelNode.id==='label'?'button-required':'required';
          secondLabelNode.children=(secondLabelNode.children||[]).filter(c=>c.id!==secondRequiredId);
          secondLabelNode.children.push({...requiredNode,id:secondRequiredId,visibleWhen:[{property:'required',equals:true}]});
        }
      }
      if(secondLabelNode)secondLabelNode.bind='label';
      if(secondHelperNode)secondHelperNode.bind='helperText';
      if(labelNode){labelNode.bind='label';const def=labelInput?.value.trim()||labelNode.text||'Upload files';properties.push({id:'label',name:'Label',type:'text',default:def});selection.label=def;}
      if(requiredNode){properties.push({id:'required',name:'Required',type:'boolean',default:originalRequired});selection.required=originalRequired;}
      if(helperNode){helperNode.bind='helperText';const def=helperInput?.value.trim()||helperNode.text||'PNG, JPG or PDF up to 10MB';properties.push({id:'helperText',name:'Helper text',type:'text',default:def});selection.helperText=def;}
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Steps: same crossed-properties sweep as captureCrossedProperties(),
    // adapted by hand because the second axis is Orientation
    // (steps-orientation-mount), not Corner radius - captureCrossedProperties()
    // only ever looks for a "radius-mount" suffix. There's only one real
    // Type ("numbered"), so no Appearance axis exists to expose - noted in
    // the dispatcher's prose rather than silently expected. Each step's own
    // label is bound positionally (findLabelNode(), same as Menu/Tabs -
    // steps-demo-label spans are already clean leaf text, no marker
    // needed; connector spans have no text so findLabelNode() naturally
    // skips them). Step count changes how many circles/connectors render -
    // the same structural limit as Group Button's segment count - so it
    // stays an orphan editable property.
    function captureStepsProperties(){
      const M=window.ADSComponentContract;
      const sizeControl=document.querySelector('[data-role="steps-size-mount"]');
      const orientationControl=document.querySelector('[data-role="steps-orientation-mount"]');
      const stepsCountInput=document.querySelector('[data-role="steps-count-input"]');
      const labelsInputEl=document.querySelector('[data-role="steps-label"]');
      const STEP_COUNTS=[2,3,4,5,6];
      const originalCount=stepsCountInput?String(stepsCountInput.value):null;
      const originalLabels=labelsInputEl?labelsInputEl.value:null;
      const originalState=selected.state,originalConfig=selected.config;
      function setCount(n){if(!stepsCountInput)return;stepsCountInput.value=String(n);stepsCountInput.dispatchEvent(new Event('change',{bubbles:true}));}
      // Step count is a real variant axis: the base drawing holds the MAXIMUM number of steps; every smaller count hides
      // the surplus steps and re-derives statuses/connectors (which depend on the count) as ordinary variant overrides.
      if(stepsCountInput&&originalCount!==null&&STEP_COUNTS.indexOf(Number(originalCount))<0)STEP_COUNTS.push(Number(originalCount));
      const maxCount=Math.max.apply(null,STEP_COUNTS);
      let baseAnatomy,maxLabels=null;
      if(stepsCountInput){
        setCount(maxCount);
        const be=gatherEntries().find(e=>e.config===originalConfig&&e.state===originalState)||gatherEntries()[0];
        baseAnatomy=snapshot(be.root,'root',0);
        maxLabels=labelsInputEl?labelsInputEl.value:null;
      }else baseAnatomy=snapshot(selected.root,'root',0);
      const sameGroup=entries.filter(e=>e.config===selected.config);
      const stateOptions=[...new Set(sameGroup.map(e=>e.state))];
      function optionLabelSet(control){
        if(!control)return new Set();
        return new Set([...control.querySelectorAll('.multiselect-options label')].map(row=>{
          const input=row.querySelector('input[type=checkbox]');
          return input?canonicalLabel(row.textContent.trim()):null;
        }).filter(Boolean));
      }
      const sizeLabels=optionLabelSet(sizeControl),orientationLabels=optionLabelSet(orientationControl);
      const originalParts=originalConfig.split(' / ');
      const originalSizeLabel=originalParts.find(p=>sizeLabels.has(p))||null;
      const originalOrientationLabel=originalParts.find(p=>orientationLabels.has(p))||null;
      const variants=[];let sizeOptions=[],orientationOptions=[];
      applyingFoundation=true;
      try{
        for(const control of [sizeControl,orientationControl]){
          if(!control)continue;
          const all=control.querySelector('.multiselect-option-all input[type=checkbox]');
          if(all&&!all.checked){all.checked=true;all.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
        for(const count of (stepsCountInput?STEP_COUNTS:[null])){
        if(count!==null){
          // Shrink by trimming the label list (not just the count box) so the labels of the surviving steps stay identical to the base's.
          if(labelsInputEl&&maxLabels){labelsInputEl.value=maxLabels.split(',').map(x=>x.trim()).slice(0,count).join(', ');labelsInputEl.dispatchEvent(new Event('input',{bubbles:true}));}
          else setCount(count);
        }
        const sweep=gatherEntries();
        for(const entry of sweep){
          const parts=entry.config.split(' / ');
          const sizeLabel=sizeControl?parts.find(p=>sizeLabels.has(p))||null:null;
          const orientationLabel=orientationControl?parts.find(p=>orientationLabels.has(p))||null:null;
          if(sizeControl&&!sizeLabel)continue;
          if(orientationControl&&!orientationLabel)continue;
          if(sizeLabel)sizeOptions.push(sizeLabel);if(orientationLabel)orientationOptions.push(orientationLabel);
          if(!stepsCountInput&&entry.config===originalConfig&&entry.state===originalState)continue;
          const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
          (function walk(n){
            const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
            if(baseNode){
              const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
              const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
              for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
              const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
              if(Object.keys(patch).length)overrides[n.id]=patch;
            }
            for(const child of n.children||[])walk(child);
          })(variantAnatomy);
          if(count!==null){
            const present=new Set();(function walk(n){present.add(n.id);for(const child of n.children||[])walk(child);})(variantAnatomy);
            for(const id of base.keys())if(!present.has(id)&&id!=='root')overrides[id]={...(overrides[id]||{}),visible:false};
          }
          const when={state:entry.state};if(count!==null)when.stepCount=String(count);if(sizeLabel)when.size=sizeLabel;if(orientationLabel)when.orientation=orientationLabel;
          const variantName=[count!==null?count+' steps':null,sizeLabel,orientationLabel,entry.state].filter(Boolean).join(' / ');
          if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
        }
        }
        sizeOptions=[...new Set(sizeOptions)];orientationOptions=[...new Set(orientationOptions)];
      }finally{
        if(stepsCountInput){
          setCount(originalCount);
          if(labelsInputEl&&originalLabels!==null){labelsInputEl.value=originalLabels;labelsInputEl.dispatchEvent(new Event('input',{bubbles:true}));labelsInputEl.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        applyingFoundation=false;refresh();
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(sizeControl&&sizeOptions.length){properties.push({id:'size',name:'Size',type:'options',options:sizeOptions,default:originalSizeLabel&&sizeOptions.includes(originalSizeLabel)?originalSizeLabel:sizeOptions[0]});selection.size=properties[properties.length-1].default;}
      if(orientationControl&&orientationOptions.length){properties.push({id:'orientation',name:'Orientation',type:'options',options:orientationOptions,default:originalOrientationLabel&&orientationOptions.includes(originalOrientationLabel)?originalOrientationLabel:orientationOptions[0]});selection.orientation=properties[properties.length-1].default;}
      // Not findLabelNode() - a step's circle is ALSO a bare childless text
      // node whenever it just shows a plain number (no check/X icon),
      // so "first text-kind child" would grab the circle's own digit on
      // any step past the row's current/error position instead of the
      // real label. The label always renders after the circle in markup,
      // so the LAST text-kind child is reliably the label either way.
      function findStepLabel(step){
        const texts=(step.children||[]).filter(n=>n.kind==='text');
        return texts.length?texts[texts.length-1]:null;
      }
      let stepIndex=0;
      (baseAnatomy.children||[]).forEach((child,i)=>{
        const labelNode=findStepLabel(child);if(!labelNode)return;
        const stepNumber=++stepIndex;
        const id='label'+i,defaultText=labelNode.text||'Step '+stepNumber;
        labelNode.bind=id;
        properties.push({id,name:'Step '+stepNumber+' label',type:'text',default:defaultText});
        selection[id]=defaultText;
      });
      if(stepsCountInput){
        const countOptions=[...new Set(STEP_COUNTS)].sort((x,y)=>x-y).map(String);
        properties.splice(1,0,{id:'stepCount',name:'Step count',type:'options',options:countOptions,default:originalCount});
        selection.stepCount=originalCount;
      }
      // Horizontal Steps draw 1200px wide in Figma (the page's preview column is wider, which is just the demo layout); the steps and
      // their connector lines grow to fill it. Vertical keeps its own content width.
      const STEPS_WIDTH='1200px',isRow=n=>/row/.test((n.styles&&n.styles.flexDirection)||'row');
      if(isRow(baseAnatomy))baseAnatomy.styles={...baseAnatomy.styles,width:STEPS_WIDTH};
      for(const v of variants){
        const horizontal=v.when.orientation?/horizontal/i.test(v.when.orientation):isRow(baseAnatomy);
        if(horizontal){const o=v.overrides.root||(v.overrides.root={});o.styles={...(o.styles||{}),width:STEPS_WIDTH};}
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Affix: same no-native-control-to-drive manual sweep as Upload - every
    // Appearance(Top/Bottom)/State combination already coexists in one
    // table. Label is a bound Text property via its own data-contract-part
    // marker (the bar also has an optional "Affixed"/"Off"/"Moving..."
    // badge as a sibling span, so position alone can't tell them apart).
    // Offset is a style value applied conditionally (only while Affixed/
    // Transitioning) - Figma can't recompute the bar's pinned position from
    // a bare property, so it stays an orphan editable property, same as
    // Slider's Min/Max/Step.
    function captureAffixProperties(){
      const M=window.ADSComponentContract;
      const labelInput=document.querySelector('[data-role="affix-label"]');
      const offsetInput=document.querySelector('[data-role="affix-offset"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const labelNode=findPart(baseAnatomy,'label');
      if(labelNode){labelNode.bind='label';const def=labelInput?.value.trim()||labelNode.text||'Filter toolbar';properties.push({id:'label',name:'Label',type:'text',default:def});selection.label=def;}
      if(offsetInput){properties.push({id:'offset',name:'Offset (px)',type:'text',default:String(offsetInput.value)});selection.offset=String(offsetInput.value);}
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Alert: Appearance/State/Corner radius already cross generically via
    // captureCrossedProperties() (its rows are SCENARIOS - Default/
    // Dismissible/With action/.../Loading - read as "State", its columns
    // TYPES read as "Appearance", exactly like Button's own matrix). Title/
    // Description/Icon are harvested the same way Slider harvests Label/
    // Value/Ticks - briefly shown during export even if currently hidden,
    // via their own data-contract-part markers (title/description/icon/
    // body, alert-detail.js already carries them). Action label is
    // different: the action button only exists structurally in the "With
    // action" and "Dismissible + With action" scenarios, and visibleWhen
    // only supports a single equals value (no OR across states) - so it's
    // bound and gated on the "With action" row specifically (documented in
    // the dispatcher notes), the same single-state constraint Select/
    // Search/Add-on's State-driven error message already accepted.
    function captureAlertProperties(){
      const built=captureCrossedProperties();
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      const titleInput=document.querySelector('[data-role="alert-title"]');
      const descriptionInput=document.querySelector('[data-role="alert-description"]');
      const showTitleInput=document.querySelector('[data-role="alert-show-title"]');
      const showDescriptionInput=document.querySelector('[data-role="alert-show-description"]');
      const showIconInput=document.querySelector('[data-role="alert-show-icon"]');
      const actionLabelInput=document.querySelector('[data-role="alert-action-label"]');

      const originalType=selected.type,originalConfig=selected.config,originalState=selected.state;
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      function currentPart(partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const originalShowTitle=showTitleInput?.checked??true,originalShowDescription=showDescriptionInput?.checked??true;
      const originalShowIcon=showIconInput?.checked??true;
      let titleNode=null,descriptionNode=null,iconNode=null;const appearanceGlyphs={};
      applyingFoundation=true;
      try{
        if(showTitleInput){
          if(!originalShowTitle){showTitleInput.checked=true;showTitleInput.dispatchEvent(new Event('change',{bubbles:true}));}
          titleNode=currentPart('title');
          if(!originalShowTitle){showTitleInput.checked=false;showTitleInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showDescriptionInput){
          if(!originalShowDescription){showDescriptionInput.checked=true;showDescriptionInput.dispatchEvent(new Event('change',{bubbles:true}));}
          descriptionNode=currentPart('description');
          if(!originalShowDescription){showDescriptionInput.checked=false;showDescriptionInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showIconInput){
          if(!originalShowIcon){showIconInput.checked=true;showIconInput.dispatchEvent(new Event('change',{bubbles:true}));}
          iconNode=currentPart('icon');
          // Each Appearance draws a DIFFERENT glyph (info: circle+lines, success: circle+polyline, warning: triangle path+lines,
          // error: circle+cross). The crossed-properties diff only patches attributes of same-position layers, so Success and
          // Warning came out as the Info glyph with mismatched attributes (a circle with a dot, a bare "!"). Harvest every
          // Appearance's own SVG and show the matching one.
          const appearanceLabels=built.properties.find(p=>p.id==='appearance')?.options||[];
          for(const label of appearanceLabels){
            const entry=gatherEntries().find(e=>e.type===label&&e.config===originalConfig&&e.state===originalState);
            const wrapper=entry&&findPart(snapshot(entry.root,'root',0),'icon');
            if(wrapper&&wrapper.children&&wrapper.children[0])appearanceGlyphs[label]=wrapper.children[0];
          }
          if(!originalShowIcon){showIconInput.checked=false;showIconInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
      }finally{
        applyingFoundation=false;refresh();
      }

      const stateLabels=built.properties.find(p=>p.id==='state')?.options||[];
      const actionStateLabel=stateLabels.find(l=>/with action/i.test(l)&&!/dismissible/i.test(l))||stateLabels.find(l=>/with action/i.test(l));
      let actionNode=null;
      if(actionStateLabel){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===actionStateLabel);
        actionNode=entry&&findPart(snapshot(entry.root,'root',0),'action');
      }

      // State-only parts (Loading spinner, Dismiss button, and the Action in BOTH action states) exist in just some State rows, so the
      // crossed-properties diff can never carry them: harvest each from its own State row and graft it with a visibility rule.
      const actionStates=stateLabels.filter(l=>/with action/i.test(l)),dismissStates=stateLabels.filter(l=>/dismissible/i.test(l)),loadingState=stateLabels.find(l=>/loading/i.test(l));
      function harvest(partId,state){
        if(!state)return null;
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===state);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const closeNode=harvest('close',dismissStates[0]),spinnerNode=harvest('spinner',loadingState);
      // hiddenWhen hides only when EVERY rule matches, so "visible in states A or B" is "hidden when state is neither A nor B".
      const hiddenUnlessState=states=>states.map(l=>({property:'state',equals:l,not:true}));
      if(titleNode){titleNode.bind='title';titleNode.visibleWhen=[{property:'showTitle',equals:true}];}
      if(descriptionNode){descriptionNode.bind='description';descriptionNode.visibleWhen=[{property:'showDescription',equals:true}];descriptionNode.styles={...descriptionNode.styles,alignSelf:'stretch'};}
      if(iconNode)iconNode.visibleWhen=[{property:'showIcon',equals:true},...(loadingState?[{property:'state',equals:loadingState,not:true}]:[])];
      if(spinnerNode&&loadingState)spinnerNode.visibleWhen=[{property:'showIcon',equals:true},{property:'state',equals:loadingState}];
      if(actionNode){actionNode.bind='actionLabel';actionNode.hiddenWhen=hiddenUnlessState(actionStates.length?actionStates:[actionStateLabel]);}
      if(closeNode&&dismissStates.length)closeNode.hiddenWhen=hiddenUnlessState(dismissStates);

      function replaceOrAppend(parent,node){
        if(!node)return;
        const idx=(parent.children||[]).findIndex(c=>c.id===node.id);
        if(idx>=0)parent.children[idx]=node;else (parent.children=parent.children||[]).push(node);
      }
      if(iconNode){if(!findPart(anatomy,'icon'))anatomy.children.unshift(iconNode);else replaceOrAppend(anatomy,iconNode);}
      const bodyNode=findPart(anatomy,'body');
      if(bodyNode){replaceOrAppend(bodyNode,titleNode);replaceOrAppend(bodyNode,descriptionNode);}
      if(actionNode){if(!findPart(anatomy,'action'))anatomy.children.push(actionNode);else replaceOrAppend(anatomy,actionNode);}
      if(closeNode){if(!findPart(anatomy,'close'))anatomy.children.push(closeNode);else replaceOrAppend(anatomy,closeNode);}
      if(spinnerNode&&!findPart(anatomy,'spinner')){const at=(anatomy.children||[]).findIndex(c=>c.id==='icon');anatomy.children.splice(at>=0?at+1:0,0,spinnerNode);}
      // Swap in the per-Appearance glyphs (ids made unique per Appearance) and drop the diff overrides that targeted the old Info-only glyph.
      const glyphLabels=Object.keys(appearanceGlyphs);
      const iconNodeInTree=findPart(anatomy,'icon');
      let droppedGlyphIds=false;
      if(iconNodeInTree&&glyphLabels.length>1){
        const slug=l=>l.toLowerCase().replace(/[^a-z0-9]+/g,'-');
        const rename=(node,prefix)=>{const copy=JSON.parse(JSON.stringify(node));(function walk(n){n.id=prefix+n.id.replace(/^icon/,'');(n.children||[]).forEach(walk);})(copy);return copy;};
        iconNodeInTree.children=glyphLabels.map(label=>{const g=rename(appearanceGlyphs[label],'glyph-'+slug(label));g.visibleWhen=[{property:'appearance',equals:label}];return g;});
        droppedGlyphIds=true;
      }
      // One consistent banner width in Figma (the page's own max-width is 420px; each demo cell just happens to be narrower), with the
      // body/description filling whatever the icon and trailing buttons leave. Per-variant width/height overrides captured from those
      // differently-sized demo cells would re-freeze parts at stale sizes, so they are dropped.
      anatomy.styles={...anatomy.styles,width:'420px'};
      const sizeless=new Set(['root','body','title','description','action']);
      const variants=built.variants.map(v=>{const overrides={};for(const [id,patch] of Object.entries(v.overrides||{})){if(droppedGlyphIds&&/^icon-\d/.test(id))continue;if(!sizeless.has(id)){overrides[id]=patch;continue;}const styles={...(patch.styles||{})};delete styles.width;delete styles.height;const next={...patch,styles};if(!Object.keys(styles).length)delete next.styles;if(Object.keys(next).length)overrides[id]=next;}return {...v,overrides};}).filter(v=>Object.keys(v.overrides).length);

      if(titleNode){
        const def=titleInput?.value.trim()||titleNode.text||'Heads up';properties.push({id:'title',name:'Title',type:'text',default:def},{id:'showTitle',name:'Show title',type:'boolean',default:originalShowTitle});selection.title=def;selection.showTitle=originalShowTitle;
        // Heading level is one of the Typography Foundation's own predefined
        // h1-h6 roles (see alert-detail.js's HEADING_LEVEL_OPTIONS) - the
        // title node's own captured font-family/size/weight/line-height
        // already resolve to that level's real var(--type-hN-*) tokens
        // (set inline in the live markup), so they bind to real Figma
        // variables automatically; this property just documents which
        // level was active, the same "editable, not independently layer-
        // bound" treatment as Icon position/Thumb shape elsewhere.
        const headingLevelInput=document.querySelector('[data-role="alert-heading-level"]');
        if(headingLevelInput){const level=(headingLevelInput.value||'h6').toUpperCase();properties.push({id:'headingLevel',name:'Heading level',type:'options',options:['H1','H2','H3','H4','H5','H6'],default:level});selection.headingLevel=level;}
      }
      if(descriptionNode){const def=descriptionInput?.value.trim()||descriptionNode.text||'Description text goes here.';properties.push({id:'description',name:'Description',type:'text',default:def},{id:'showDescription',name:'Show description',type:'boolean',default:originalShowDescription});selection.description=def;selection.showDescription=originalShowDescription;}
      if(iconNode){properties.push({id:'showIcon',name:'Show icon',type:'boolean',default:originalShowIcon});selection.showIcon=originalShowIcon;}
      if(actionNode){const def=actionLabelInput?.value.trim()||actionNode.text||'Take action';properties.push({id:'actionLabel',name:'Action label',type:'text',default:def});selection.actionLabel=def;}

      return {anatomy,properties,selection,variants};
    }
    // Toast: same shape as captureAlertProperties() above, with one
    // structural difference - the action button lives INSIDE the body
    // wrapper alongside Title/Description here (Alert's sits outside, as a
    // root-level sibling), so it's grafted into the body node instead of
    // the root. Action label is still gated on the single "With action"
    // state only (not the combined "Dismissible + Action + Progress" row),
    // same visibleWhen single-value constraint as Alert.
    function captureToastProperties(){
      const built=captureCrossedProperties();
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      const titleInput=document.querySelector('[data-role="toast-title"]');
      const descriptionInput=document.querySelector('[data-role="toast-description"]');
      const showTitleInput=document.querySelector('[data-role="toast-show-title"]');
      const showDescriptionInput=document.querySelector('[data-role="toast-show-description"]');
      const showIconInput=document.querySelector('[data-role="toast-show-icon"]');
      const actionLabelInput=document.querySelector('[data-role="toast-action-label"]');

      const originalType=selected.type,originalConfig=selected.config,originalState=selected.state;
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      function currentPart(partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const originalShowTitle=showTitleInput?.checked??true,originalShowDescription=showDescriptionInput?.checked??true;
      const originalShowIcon=showIconInput?.checked??true;
      let titleNode=null,descriptionNode=null,iconNode=null;
      applyingFoundation=true;
      try{
        if(showTitleInput){
          if(!originalShowTitle){showTitleInput.checked=true;showTitleInput.dispatchEvent(new Event('change',{bubbles:true}));}
          titleNode=currentPart('title');
          if(!originalShowTitle){showTitleInput.checked=false;showTitleInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showDescriptionInput){
          if(!originalShowDescription){showDescriptionInput.checked=true;showDescriptionInput.dispatchEvent(new Event('change',{bubbles:true}));}
          descriptionNode=currentPart('description');
          if(!originalShowDescription){showDescriptionInput.checked=false;showDescriptionInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showIconInput){
          if(!originalShowIcon){showIconInput.checked=true;showIconInput.dispatchEvent(new Event('change',{bubbles:true}));}
          iconNode=currentPart('icon');
          if(!originalShowIcon){showIconInput.checked=false;showIconInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
      }finally{
        applyingFoundation=false;refresh();
      }

      const stateLabels=built.properties.find(p=>p.id==='state')?.options||[];
      const actionStateLabel=stateLabels.find(l=>/with action/i.test(l)&&!/dismissible|combined|\+/i.test(l))||stateLabels.find(l=>/action/i.test(l));
      // State-only parts (Loading spinner, Dismiss button, progress bar, and the Action in EVERY action state) exist in just some State
      // rows, so the crossed-properties diff can never carry them: harvest each from its own State row and graft it with a visibility
      // rule. hiddenWhen hides only when EVERY rule matches, so "visible in states A or B" is "hidden when state is neither A nor B".
      const statesMatching=re=>stateLabels.filter(l=>re.test(l));
      const actionStates=statesMatching(/action/i),dismissStates=statesMatching(/dismissible/i),progressStates=statesMatching(/progress/i),loadingState=stateLabels.find(l=>/loading/i.test(l));
      function harvest(partId,state){
        if(!state)return null;
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===state);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const actionNode=harvest('action',actionStateLabel),closeNode=harvest('close',dismissStates[0]),progressNode=harvest('progress',progressStates[0]),spinnerNode=harvest('spinner',loadingState);
      const hiddenUnlessState=states=>states.map(l=>({property:'state',equals:l,not:true}));

      if(titleNode){titleNode.bind='title';titleNode.visibleWhen=[{property:'showTitle',equals:true}];}
      if(descriptionNode){descriptionNode.bind='description';descriptionNode.visibleWhen=[{property:'showDescription',equals:true}];}
      if(iconNode)iconNode.visibleWhen=[{property:'showIcon',equals:true},...(loadingState?[{property:'state',equals:loadingState,not:true}]:[])];
      if(spinnerNode&&loadingState)spinnerNode.visibleWhen=[{property:'showIcon',equals:true},{property:'state',equals:loadingState}];
      if(actionNode){actionNode.bind='actionLabel';actionNode.hiddenWhen=hiddenUnlessState(actionStates.length?actionStates:[actionStateLabel]);}
      if(closeNode&&dismissStates.length)closeNode.hiddenWhen=hiddenUnlessState(dismissStates);
      if(progressNode&&progressStates.length)progressNode.hiddenWhen=hiddenUnlessState(progressStates);

      function replaceOrAppend(parent,node){
        if(!node)return;
        const idx=(parent.children||[]).findIndex(c=>c.id===node.id);
        if(idx>=0)parent.children[idx]=node;else (parent.children=parent.children||[]).push(node);
      }
      if(iconNode){if(!findPart(anatomy,'icon'))anatomy.children.unshift(iconNode);else replaceOrAppend(anatomy,iconNode);}
      const bodyNode=findPart(anatomy,'body');
      if(bodyNode){replaceOrAppend(bodyNode,titleNode);replaceOrAppend(bodyNode,descriptionNode);replaceOrAppend(bodyNode,actionNode);}
      if(closeNode){if(!findPart(anatomy,'close'))anatomy.children.push(closeNode);else replaceOrAppend(anatomy,closeNode);}
      if(progressNode){if(!findPart(anatomy,'progress'))anatomy.children.push(progressNode);else replaceOrAppend(anatomy,progressNode);}
      if(spinnerNode&&!findPart(anatomy,'spinner')){const at=(anatomy.children||[]).findIndex(c=>c.id==='icon');anatomy.children.splice(at>=0?at+1:0,0,spinnerNode);}

      if(titleNode){
        const def=titleInput?.value.trim()||titleNode.text||'Saved';properties.push({id:'title',name:'Title',type:'text',default:def},{id:'showTitle',name:'Show title',type:'boolean',default:originalShowTitle});selection.title=def;selection.showTitle=originalShowTitle;
        // Heading level is one of the Typography Foundation's own predefined
        // h1-h6 roles (see toast-detail.js's HEADING_LEVEL_OPTIONS) - the
        // title node's own captured font-family/size/weight/line-height
        // already resolve to that level's real var(--type-hN-*) tokens
        // (set inline in the live markup), so they bind to real Figma
        // variables automatically; this property just documents which
        // level was active, the same "editable, not independently layer-
        // bound" treatment as Icon position/Thumb shape elsewhere.
        const headingLevelInput=document.querySelector('[data-role="toast-heading-level"]');
        if(headingLevelInput){const level=(headingLevelInput.value||'h6').toUpperCase();properties.push({id:'headingLevel',name:'Heading level',type:'options',options:['H1','H2','H3','H4','H5','H6'],default:level});selection.headingLevel=level;}
      }
      if(descriptionNode){const def=descriptionInput?.value.trim()||descriptionNode.text||'Your changes have been saved.';properties.push({id:'description',name:'Description',type:'text',default:def},{id:'showDescription',name:'Show description',type:'boolean',default:originalShowDescription});selection.description=def;selection.showDescription=originalShowDescription;}
      if(iconNode){properties.push({id:'showIcon',name:'Show icon',type:'boolean',default:originalShowIcon});selection.showIcon=originalShowIcon;}
      if(actionNode){const def=actionLabelInput?.value.trim()||actionNode.text||'Undo';properties.push({id:'actionLabel',name:'Action label',type:'text',default:def});selection.actionLabel=def;}

      // One consistent card width in Figma (the page's own max-width is 340px; each demo cell is just narrower), so the supporting text has
      // the room it has in the product (two lines, not three). The description stretches to fill the body; per-variant width/height
      // overrides captured from the differently-sized demo cells would re-freeze parts at stale sizes, so they are dropped.
      // Height is dropped on purpose: the card hugs its content (title, supporting text, action, progress bar) instead of freezing the
      // 134px it measured in one State.
      {const rootStyles={...anatomy.styles,width:'340px'};delete rootStyles.height;anatomy.styles=rootStyles;}
      const toastDesc=findPart(anatomy,'description');if(toastDesc)toastDesc.styles={...toastDesc.styles,alignSelf:'stretch'};
      const sizelessToast=new Set(['root','body','title','description','action']);
      const toastVariants=built.variants.map(v=>{const overrides={};for(const [id,patch] of Object.entries(v.overrides||{})){if(!sizelessToast.has(id)){overrides[id]=patch;continue;}const styles={...(patch.styles||{})};delete styles.width;delete styles.height;const next={...patch,styles};if(!Object.keys(styles).length)delete next.styles;if(Object.keys(next).length)overrides[id]=next;}return {...v,overrides};}).filter(v=>Object.keys(v.overrides).length);
      return {anatomy,properties,selection,variants:toastVariants};
    }
    // Modal combines Transfer's manual-select-drive (Size is a plain
    // <select>, modal-size-select, not a multiselect) with the usual
    // Appearance/State/Corner-radius crossing (Corner radius IS a
    // multiselect here, like every other component, so every radius combo
    // already coexists per size value - only Size itself needs driving by
    // hand). Title/Body/Confirm label/Cancel label/Show icon are bound via
    // their own data-contract-part markers; Show close is a bound Boolean.
    function captureModalProperties(){
      const M=window.ADSComponentContract;
      const sizeSelect=document.querySelector('[data-role="modal-size-select"]');
      const radiusMount=document.querySelector('[data-role="modal-radius-mount"]');
      const titleInput=document.querySelector('[data-role="modal-title"]');
      const bodyInput=document.querySelector('[data-role="modal-body"]');
      const showCloseInput=document.querySelector('[data-role="modal-show-close"]');
      const showIconInput=document.querySelector('[data-role="modal-show-icon"]');
      const confirmLabelInput=document.querySelector('[data-role="modal-confirm-label"]');
      const cancelLabelInput=document.querySelector('[data-role="modal-cancel-label"]');

      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state,originalConfig=selected.config;
      const originalSize=sizeSelect?sizeSelect.value:null;
      const sizeOptionEls=sizeSelect?[...sizeSelect.options]:[];
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const variants=[];let typeOptions=[],stateOptions=[],sizeOptions=[],radiusOptions=[];
      applyingFoundation=true;
      try{
        const all=radiusMount?.querySelector('.multiselect-option-all input[type=checkbox]');
        if(all&&!all.checked){all.checked=true;all.dispatchEvent(new Event('change',{bubbles:true}));}
        for(const opt of (sizeOptionEls.length?sizeOptionEls:[null])){
          const sizeVal=opt?opt.value:null,sizeLabel=opt?opt.textContent.trim():null;
          if(opt&&sizeSelect.value!==sizeVal){sizeSelect.value=sizeVal;sizeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
          for(const entry of gatherEntries()){
            typeOptions.push(entry.type);stateOptions.push(entry.state);radiusOptions.push(entry.config);if(sizeLabel)sizeOptions.push(sizeLabel);
            if(entry.type===originalType&&entry.state===originalState&&entry.config===originalConfig&&(!opt||sizeVal===originalSize))continue;
            const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
            (function walk(n){
              const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
              if(baseNode){
                const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
                const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
                for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
                const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
                if(Object.keys(patch).length)overrides[n.id]=patch;
              }
              for(const child of n.children||[])walk(child);
            })(variantAnatomy);
            const when={state:entry.state,appearance:entry.type,radius:entry.config};if(sizeLabel)when.size=sizeLabel;
            const variantName=[entry.type,sizeLabel,entry.config,entry.state].filter(Boolean).join(' / ');
            if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
          }
        }
      }finally{
        if(sizeSelect&&sizeSelect.value!==originalSize){sizeSelect.value=originalSize;sizeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
        applyingFoundation=false;refresh();
      }
      typeOptions=[...new Set(typeOptions)];stateOptions=[...new Set(stateOptions)];sizeOptions=[...new Set(sizeOptions)];radiusOptions=[...new Set(radiusOptions)];
      const originalSizeLabel=sizeOptionEls.find(o=>o.value===originalSize)?.textContent.trim()||sizeOptions[0];
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:typeOptions.includes(originalType)?originalType:typeOptions[0]});selection.appearance=properties[properties.length-1].default;}
      if(sizeOptions.length>1){properties.push({id:'size',name:'Size',type:'options',options:sizeOptions,default:sizeOptions.includes(originalSizeLabel)?originalSizeLabel:sizeOptions[0]});selection.size=properties[properties.length-1].default;}
      if(radiusOptions.length>1){properties.push({id:'radius',name:'Corner radius',type:'options',options:radiusOptions,default:radiusOptions.includes(originalConfig)?originalConfig:radiusOptions[0]});selection.radius=properties[properties.length-1].default;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      function currentPart(partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const originalShowIcon=showIconInput?.checked??false,originalShowClose=showCloseInput?.checked??true;
      let iconNode=findPart(baseAnatomy,'icon'),closeNode=findPart(baseAnatomy,'close');
      applyingFoundation=true;
      try{
        if(showIconInput&&!iconNode){
          if(!originalShowIcon){showIconInput.checked=true;showIconInput.dispatchEvent(new Event('change',{bubbles:true}));}
          iconNode=currentPart('icon');
          if(!originalShowIcon){showIconInput.checked=false;showIconInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showCloseInput&&!closeNode){
          if(!originalShowClose){showCloseInput.checked=true;showCloseInput.dispatchEvent(new Event('change',{bubbles:true}));}
          closeNode=currentPart('close');
          if(!originalShowClose){showCloseInput.checked=false;showCloseInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
      }finally{
        applyingFoundation=false;refresh();
      }
      if(iconNode&&!findPart(baseAnatomy,'icon')){
        const titlegroup=findPart(baseAnatomy,'titlegroup');
        if(titlegroup)titlegroup.children=[iconNode,...(titlegroup.children||[])];
      }
      if(closeNode&&!findPart(baseAnatomy,'close')){
        const header=findPart(baseAnatomy,'header');
        if(header)header.children=[...(header.children||[]),closeNode];
      }
      const titleNode=findPart(baseAnatomy,'title');
      const bodyNode=findPart(baseAnatomy,'body');
      const confirmNode=findPart(baseAnatomy,'confirm');
      const cancelNode=findPart(baseAnatomy,'cancel');
      if(titleNode){
        titleNode.bind='title';const def=titleInput?.value.trim()||titleNode.text||'Confirm action';properties.push({id:'title',name:'Title',type:'text',default:def});selection.title=def;
        // Heading level is one of the Typography Foundation's own predefined
        // h1-h6 roles (see modal-detail.js's HEADING_LEVEL_OPTIONS) - the
        // title node's own captured font-family/size/weight/line-height
        // already resolve to that level's real var(--type-hN-*) tokens
        // (set inline in the live markup), so they bind to real Figma
        // variables automatically; this property just documents which
        // level was active, the same "editable, not independently layer-
        // bound" treatment as Icon position/Thumb shape elsewhere.
        const headingLevelInput=document.querySelector('[data-role="modal-heading-level"]');
        if(headingLevelInput){const level=(headingLevelInput.value||'h6').toUpperCase();properties.push({id:'headingLevel',name:'Heading level',type:'options',options:['H1','H2','H3','H4','H5','H6'],default:level});selection.headingLevel=level;}
      }
      if(bodyNode){bodyNode.bind='body';const def=bodyInput?.value.trim()||bodyNode.text||'Are you sure you want to proceed?';properties.push({id:'body',name:'Body',type:'text',default:def});selection.body=def;}
      if(confirmNode){confirmNode.bind='confirmLabel';const def=confirmLabelInput?.value.trim()||confirmNode.text||'Confirm';properties.push({id:'confirmLabel',name:'Confirm label',type:'text',default:def});selection.confirmLabel=def;}
      if(cancelNode){cancelNode.bind='cancelLabel';const def=cancelLabelInput?.value.trim()||cancelNode.text||'Cancel';properties.push({id:'cancelLabel',name:'Cancel label',type:'text',default:def});selection.cancelLabel=def;}
      if(iconNode){const originalShowIcon=showIconInput?.checked??false;iconNode.visibleWhen=[{property:'showIcon',equals:true}];properties.push({id:'showIcon',name:'Show icon',type:'boolean',default:originalShowIcon});selection.showIcon=originalShowIcon;}
      if(closeNode){const originalShowClose=showCloseInput?.checked??true;closeNode.visibleWhen=[{property:'showClose',equals:true}];properties.push({id:'showClose',name:'Show close button',type:'boolean',default:originalShowClose});selection.showClose=originalShowClose;}

      // The demo cells are narrower than a real dialog (about 253px for EVERY Size), so Small / Medium / Large all came out the same width
      // and every height was frozen to whatever one State measured. Draw each Size at its real width (the CSS caps: 320 / 440 / 560, inside
      // the 24px scrim padding), keep header, body and footer exactly the dialog's inner width so they fill it, and drop the frozen
      // dialog heights so the dialog hugs its content (header + body + footer, or less in No footer).
      // State-only parts never reach the crossed-properties diff (it only patches layers that exist in the base): the Error message, the
      // Scrollable's extra paragraph and fade, and the Confirm button's Loading spinner are harvested from their own State rows and grafted
      // with visibility rules; No footer / No close hide the footer / close button the same way.
      {
        const stateLabels=properties.find(p=>p.id==='state')?.options||[];
        const entryFor=st=>gatherEntries().find(e=>e.state===st&&e.config===originalConfig&&e.type===originalType);
        const partIn=(st,id)=>{const e=entryFor(st);return e?findPart(snapshot(e.root,'root',0),id):null;};
        const scrollStates=stateLabels.filter(l=>/scrollable/i.test(l)),noFooterStates=stateLabels.filter(l=>/no footer/i.test(l)),noCloseStates=stateLabels.filter(l=>/no close/i.test(l));
        const errorState=stateLabels.find(l=>/error/i.test(l)),loadingState=stateLabels.find(l=>/loading/i.test(l));
        const hiddenUnless=states=>states.map(l=>({property:'state',equals:l,not:true}));
        const bodyWrap=findPart(baseAnatomy,'scroll'),footer=findPart(baseAnatomy,'footer'),closeNode=findPart(baseAnatomy,'close');
        if(bodyWrap){
          const add=(node,rules)=>{if(node&&!findPart(baseAnatomy,node.id)){Object.assign(node,rules);bodyWrap.children=bodyWrap.children||[];bodyWrap.children.push(node);}};
          if(scrollStates.length){add(partIn(scrollStates[0],'details'),{hiddenWhen:hiddenUnless(scrollStates)});add(partIn(scrollStates[0],'fade'),{hiddenWhen:hiddenUnless(scrollStates)});}
          if(errorState)add(partIn(errorState,'error'),{visibleWhen:[{property:'state',equals:errorState}]});
        }
        if(footer&&noFooterStates.length)footer.visibleWhen=[...(footer.visibleWhen||[]),...hiddenUnlessAny(noFooterStates)];
        if(closeNode&&noCloseStates.length)closeNode.visibleWhen=[...(closeNode.visibleWhen||[]),...hiddenUnlessAny(noCloseStates)];
        const confirm=findPart(baseAnatomy,'confirm');
        if(confirm&&loadingState){const sp=partIn(loadingState,'spinner');if(sp&&!findPart(baseAnatomy,'spinner')){sp.visibleWhen=[{property:'state',equals:loadingState}];confirm.children=confirm.children||[];confirm.children.unshift(sp);}}
        // The Confirm button's label becomes a real child (after the spinner) instead of the button's own text: a button's own text is always
        // placed first, which put the label before the Loading spinner, and the page's Loading row captures the button with NO text at all
        // (its text sits beside the spinner element), which wiped the label out of every Loading variant.
        if(confirm){
          const cs=confirm.styles||{};
          const labelNode={id:'confirm-label',name:'Label',kind:'text',tag:'span',bind:confirm.bind||'confirmLabel',text:confirm.text||'Confirm',styles:{fontFamily:cs.fontFamily,fontSize:cs.fontSize,fontWeight:cs.fontWeight,lineHeight:cs.lineHeight,letterSpacing:cs.letterSpacing,color:cs.color,whiteSpace:'nowrap'},attributes:{},children:[]};
          confirm.children=[...(confirm.children||[]),labelNode];delete confirm.bind;confirm.text='';
        }
        function hiddenUnlessAny(list){return list.map(l=>({property:'state',equals:l,not:true}));}
      }
      {
        const SIZE_W={small:320,medium:440,large:560},widthFor=label=>{const m=/small|medium|large/i.exec(String(label||''));return m?SIZE_W[m[0].toLowerCase()]:440;};
        const sized=(w,key)=>key==='root'?w+48:key==='root-0'?w:w-2;
        const keys=['root','root-0','header','bodywrap','footer'];
        const origW=widthFor(selection.size);
        const findN=(n,id)=>{if(n.id===id)return n;for(const k of n.children||[]){const r=findN(k,id);if(r)return r;}return null;};
        for(const key of keys){const n=findN(baseAnatomy,key);if(n)n.styles={...n.styles,width:sized(origW,key)+'px'};}
        for(const key of ['root','root-0']){const n=findN(baseAnatomy,key);if(n){const st={...n.styles};delete st.height;n.styles=st;}}
        // Body copy / error / details fill the dialog's inner width; the dialog's buttons hug their label (their captured px would freeze them).
        const stretchIds=['body','error','details','scroll'],hugIds=['cancel','confirm'];
        for(const id of stretchIds){const n=findN(baseAnatomy,id);if(n){const st={...n.styles,alignSelf:'stretch'};delete st.width;n.styles=st;}}
        for(const id of hugIds){const n=findN(baseAnatomy,id);if(n){const st={...n.styles};delete st.width;delete st.height;n.styles=st;}}
        // Only the Scrollable body is a fixed-height window; every other body hugs its text.
        const scrollLabels=(properties.find(p=>p.id==='state')?.options||[]).filter(l=>/scrollable/i.test(l));
        {const bw=findN(baseAnatomy,'scroll');if(bw){const st={...bw.styles,gap:'8px',rowGap:'8px'};delete st.height;bw.styles=st;}{const bb=findN(baseAnatomy,'bodywrap');if(bb){const st={...bb.styles};delete st.height;bb.styles=st;}}}
        {const ft=findN(baseAnatomy,'footer');if(ft){const st={...ft.styles};delete st.height;ft.styles=st;}}
        const bodyText=findN(baseAnatomy,'body');if(bodyText){const st={...bodyText.styles,alignSelf:'stretch'};delete st.width;bodyText.styles=st;}
        for(const v of variants){
          const w=widthFor((v.when||{}).size!==undefined?v.when.size:selection.size);
          for(const key of keys){
            const patch=v.overrides[key]||(v.overrides[key]={});const st={...(patch.styles||{})};
            st.width=sized(w,key)+'px';if(key==='root'||key==='root-0')delete st.height;
            patch.styles=st;
          }
          {const o=v.overrides.confirm;if(o){const lab=v.overrides['confirm-label']||(v.overrides['confirm-label']={});if(o.text)lab.text=o.text;delete o.text;if(o.styles&&o.styles.color){lab.styles={...(lab.styles||{}),color:o.styles.color};}if(!Object.keys(lab).length)delete v.overrides['confirm-label'];}}
          if(scrollLabels.includes((v.when||{}).state)){const o=v.overrides.scroll||(v.overrides.scroll={});o.styles={...(o.styles||{}),overflow:'hidden'};}
          for(const id of [...stretchIds,...hugIds]){const o=v.overrides[id];if(o&&o.styles){const st={...o.styles};delete st.width;if(hugIds.includes(id)||id==='scroll')delete st.height;if(Object.keys(st).length)o.styles=st;else delete o.styles;if(!Object.keys(o).length)delete v.overrides[id];}}
          {const o=v.overrides.footer;if(o&&o.styles){const st={...o.styles};delete st.height;if(Object.keys(st).length)o.styles=st;else delete o.styles;}}
          {const o=v.overrides.bodywrap;if(o&&o.styles){const st={...o.styles};delete st.height;delete st.maxHeight;if(Object.keys(st).length)o.styles=st;else delete o.styles;}}
          const bt=v.overrides.body;if(bt&&bt.styles){const st={...bt.styles};delete st.width;if(Object.keys(st).length)bt.styles=st;else delete bt.styles;if(!Object.keys(bt).length)delete v.overrides.body;}
        }
      }
      // The Loading rows capture the Confirm button without its text, so those variants carry no label override: give each the label its
      // Appearance shows in every other State (Destructive reads "Delete", Default keeps the bound Confirm label).
      {
        const labelByAppearance={};
        for(const v of variants){const t=v.overrides['confirm-label']?.text;if(t&&(v.when||{}).appearance!==undefined&&!labelByAppearance[v.when.appearance])labelByAppearance[v.when.appearance]=t;}
        for(const v of variants){const ap=(v.when||{}).appearance;if(ap!==undefined&&labelByAppearance[ap]&&!(v.overrides['confirm-label']&&v.overrides['confirm-label'].text)){const lab=v.overrides['confirm-label']||(v.overrides['confirm-label']={});lab.text=labelByAppearance[ap];}}
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Tooltip: same no-native-control-to-drive manual sweep as Upload/
    // Affix - every Appearance(placement)/State(content) combination
    // already coexists in one table (Size is a separate plain <select>,
    // left as a page-level choice since it wasn't requested here). Text
    // content only binds for the "Plain text" state - "Rich"/"Long text"
    // intentionally show fixed demo copy per the component's own spec, not
    // the editable Text content property. Show Arrow is harvested the same
    // way Slider harvests Tick marks - briefly shown during export even if
    // currently off.
    function captureTooltipProperties(){
      const M=window.ADSComponentContract;
      const textInput=document.querySelector('[data-role="tooltip-text"]');
      const showArrowInput=document.querySelector('[data-role="tooltip-show-arrow"]');
      // The arrow is drawn from the page's flow layout (negative margins, rotated 45deg), which Figma can't reproduce. It becomes an absolutely
      // placed child OF THE BUBBLE (so its offsets stay right however wide the tooltip hugs its text), positioned from its measured spot on
      // the bubble's edge for that placement and anchored: centred along the edge, stuck to the edge it points out of.
      function arrowStylesFor(wrapEl,placement){
        const arrowEl=wrapEl&&wrapEl.querySelector&&wrapEl.querySelector('.tooltip-demo-arrow'),bubbleEl=wrapEl&&wrapEl.querySelector&&wrapEl.querySelector('.tooltip-demo-bubble');
        if(!arrowEl||!bubbleEl)return null;
        const br=bubbleEl.getBoundingClientRect(),ar=arrowEl.getBoundingClientRect();
        const m=/^matrix\(([^)]+)\)/.exec(getComputedStyle(arrowEl).transform);const deg=m?-Math.atan2(Number(m[1].split(',')[1]),Number(m[1].split(',')[0]))*180/Math.PI:0,rad=deg*Math.PI/180,cs=Math.cos(rad),sn=Math.sin(rad);
        const w=parseFloat(getComputedStyle(arrowEl).width)||8,h=parseFloat(getComputedStyle(arrowEl).height)||8;
        // Figma rotates about the node's top-left corner, so solve for the top-left that puts the rotated diamond's centre on the measured centre.
        const cx=(ar.left-br.left)+ar.width/2,cy=(ar.top-br.top)+ar.height/2;
        const t=String(placement||'').toLowerCase();
        const side=/left/.test(t)?'left':/right/.test(t)?'right':/bottom/.test(t)?'bottom':'top';
        // 'Top' places the bubble above the trigger, so its arrow sits on the bubble's BOTTOM edge, and so on.
        const hint={top:{justifySelf:'center',alignSelf:'flex-end'},bottom:{justifySelf:'center',alignSelf:'flex-start'},left:{justifySelf:'flex-end',alignSelf:'center'},right:{justifySelf:'flex-start',alignSelf:'center'}}[side];
        return {position:'absolute',left:(cx-(cs*(w/2)+sn*(h/2)))+'px',top:(cy-(-sn*(w/2)+cs*(h/2)))+'px',marginTop:'0px',marginBottom:'0px',marginLeft:'0px',marginRight:'0px',right:'auto',bottom:'auto',...hint};
      }
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state,originalConfig=selected.config;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        {const st=arrowStylesFor(entry.root,entry.type);if(st)overrides.arrow={...(overrides.arrow||{}),styles:{...((overrides.arrow||{}).styles||{}),...st}};}
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      function currentPart(partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const textNode=findPart(baseAnatomy,'text');
      if(textNode){textNode.bind='text';const def=textInput?.value.trim()||textNode.text||'Add to favorites';properties.push({id:'text',name:'Text content',type:'text',default:def});selection.text=def;}

      const originalShowArrow=showArrowInput?.checked??true;
      let arrowNode=findPart(baseAnatomy,'arrow');
      if(showArrowInput&&!arrowNode){
        applyingFoundation=true;
        try{
          if(!originalShowArrow){showArrowInput.checked=true;showArrowInput.dispatchEvent(new Event('change',{bubbles:true}));}
          arrowNode=currentPart('arrow');
          if(!originalShowArrow){showArrowInput.checked=false;showArrowInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }finally{applyingFoundation=false;refresh();}
      }
      if(arrowNode){
        const bubbleNode=findPart(baseAnatomy,'bubble');
        // DOM order is bubble, then arrow (shell.css's own z-index:2 vs
        // z-index:1 is what actually makes the bubble paint on top, letting
        // only the arrow's triangular tip peek out past the bubble's edge
        // instead of a full floating diamond) - adapter.js has no z-index
        // concept at all and just paints children in array order, so arrow
        // needs to come BEFORE bubble in the anatomy for the same visual
        // result (later sibling paints on top). Always re-sort regardless
        // of whether this arrow was just freshly harvested or already
        // present in the base capture, since either way it starts after
        // bubble positionally.
        baseAnatomy.children=baseAnatomy.children.filter(n=>n!==arrowNode);
        baseAnatomy.children.splice(bubbleNode?baseAnatomy.children.indexOf(bubbleNode):0,0,arrowNode);
        // The arrow's "glued to the bubble" pointer look comes entirely
        // from negative margin (shell.css: -12px/-4px pulling it up/down/
        // sideways into the bubble) - adapter.js has no concept of CSS
        // margin at all, so that pull was silently dropped and Figma's own
        // auto-layout spaced the arrow at a plain, disconnected gap
        // instead (the reported "spacing between the arrow and the
        // tooltip"). Fix it the same way already fixed for Float Button's
        // identical tooltip markup: measure the arrow's real on-screen
        // offset and bake it in as absolute position.
        //
        // The arrow is an 8x8 square rotated 45deg to form a diamond
        // pointer. getBoundingClientRect() reports the ROTATED, axis-
        // aligned box (~11.3px - the square's diagonal), but Figma's own
        // `rotation` pivots around the node's TOP-LEFT corner, not its
        // center the way CSS's default transform-origin does. Writing the
        // rotated bounding box's raw top-left straight onto an unrotated
        // 8x8 Figma node, then letting Figma rotate around THAT corner,
        // pivots around the wrong point and visibly knocks the diamond off
        // its intended spot (the reported "not the proper size or
        // centered"). Solve for the top-left that, once rotated around
        // itself by the same angle adapter.js will apply, lands the
        // shape's center exactly on the measured center instead.
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        const baseArrowStyles=entry&&arrowStylesFor(entry.root,originalType);
        if(baseArrowStyles)arrowNode.styles={...arrowNode.styles,...baseArrowStyles};
        // Inside the bubble, FIRST (painted under the text): same colour as the bubble, so only the tip that pokes out of its edge shows.
        if(bubbleNode){baseAnatomy.children=baseAnatomy.children.filter(n=>n!==arrowNode);bubbleNode.children=[arrowNode,...(bubbleNode.children||[]).filter(n=>n!==arrowNode)];}
        arrowNode.visibleWhen=[{property:'showArrow',equals:true}];
        properties.push({id:'showArrow',name:'Show arrow',type:'boolean',default:originalShowArrow});
        selection.showArrow=originalShowArrow;
      }

      // Rich (title + description) and Long text (one wrapping text) exist only in their own State rows; harvest them and show each in its
      // own State, with the plain text hidden there. The bubble, wrapper and text then hug their content instead of the captured px.
      {
        const bubble=findPart(baseAnatomy,'bubble');
        const stateLabelsT=properties.find(p=>p.id==='state')?.options||[];
        const richState=stateLabelsT.find(l=>/rich/i.test(l)),longState=stateLabelsT.find(l=>/long/i.test(l)),plainState=stateLabelsT.find(l=>/plain/i.test(l))||originalState;
        const partIn=(st,id)=>{const e=gatherEntries().find(x=>x.state===st&&x.type===originalType);return e?findPart(snapshot(e.root,'root',0),id):null;};
        if(bubble){
          if(textNode&&plainState)textNode.visibleWhen=[{property:'state',equals:plainState}];
          if(richState){for(const id of ['title','description']){const n=partIn(richState,id);if(n&&!findPart(baseAnatomy,id)){n.visibleWhen=[{property:'state',equals:richState}];bubble.children.push(n);}}}
          if(longState){const n=partIn(longState,'longtext');if(n&&!findPart(baseAnatomy,'longtext')){n.visibleWhen=[{property:'state',equals:longState}];bubble.children.push(n);}}
        }
        const hug=n=>{if(!n)return;const st={...n.styles};delete st.width;delete st.height;n.styles=st;};
        // The page's shared truncation rule gives the bubble overflow:hidden, which is harmless while the arrow is a sibling - but the arrow now
        // lives inside the bubble and its tip pokes out past the bubble's edge, so the bubble must not clip.
        if(bubble)bubble.styles={...bubble.styles,overflow:'visible',overflowX:'visible',overflowY:'visible'};
        hug(baseAnatomy);hug(bubble);for(const id of ['text','title','description','longtext'])hug(findPart(baseAnatomy,id));
        for(const v of variants)for(const id of ['root','bubble','text','title','description','longtext']){const o=v.overrides[id];if(o&&o.styles){const st={...o.styles};delete st.width;delete st.height;if(Object.keys(st).length)o.styles=st;else delete o.styles;if(!Object.keys(o).length)delete v.overrides[id];}}
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Tour: same no-native-control-to-drive manual sweep as Tooltip/Upload/
    // Affix - every Appearance(placement)/State(step position) combination
    // already coexists in one table. Target label/Title/Description are
    // always-present clean leaf text nodes (no show/hide toggle exists for
    // any of them), so they're bound directly from the base capture with
    // no harvest step needed.
    function captureTourProperties(){
      const M=window.ADSComponentContract;
      const targetLabelInput=document.querySelector('[data-role="tour-target-label"]');
      const titleInput=document.querySelector('[data-role="tour-title"]');
      const descriptionInput=document.querySelector('[data-role="tour-description"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      // Same arrow treatment as the Tooltip: the page's flow layout (negative margins, rotated 45deg) can't be reproduced in Figma, so the arrow
      // becomes an absolutely placed child of the CARD, anchored to the card edge that faces the target.
      function tourArrowStyles(wrapEl,placement){
        const arrowEl=wrapEl&&wrapEl.querySelector&&wrapEl.querySelector('.tour-demo-arrow'),cardEl=wrapEl&&wrapEl.querySelector&&wrapEl.querySelector('.tour-demo-card');
        if(!arrowEl||!cardEl)return null;
        const cr=cardEl.getBoundingClientRect(),ar=arrowEl.getBoundingClientRect();
        const m=/^matrix\(([^)]+)\)/.exec(getComputedStyle(arrowEl).transform);const deg=m?-Math.atan2(Number(m[1].split(',')[1]),Number(m[1].split(',')[0]))*180/Math.PI:0,rad=deg*Math.PI/180,cs=Math.cos(rad),sn=Math.sin(rad);
        const w=parseFloat(getComputedStyle(arrowEl).width)||8,h=parseFloat(getComputedStyle(arrowEl).height)||8;
        const cx=(ar.left-cr.left)+ar.width/2,cy=(ar.top-cr.top)+ar.height/2;
        const t=String(placement||'').toLowerCase(),side=/left/.test(t)?'left':/right/.test(t)?'right':/bottom/.test(t)?'bottom':'top';
        const hint={top:{justifySelf:'center',alignSelf:'flex-end'},bottom:{justifySelf:'center',alignSelf:'flex-start'},left:{justifySelf:'flex-end',alignSelf:'center'},right:{justifySelf:'flex-start',alignSelf:'center'}}[side];
        return {position:'absolute',left:(cx-(cs*(w/2)+sn*(h/2)))+'px',top:(cy-(-sn*(w/2)+cs*(h/2)))+'px',marginTop:'0px',marginBottom:'0px',marginLeft:'0px',marginRight:'0px',right:'auto',bottom:'auto',...hint};
      }
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        {const st=tourArrowStyles(entry.root,entry.type);if(st)overrides.arrow={...(overrides.arrow||{}),styles:{...((overrides.arrow||{}).styles||{}),...st}};}
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const targetNode=findPart(baseAnatomy,'targettext');
      const titleNode=findPart(baseAnatomy,'title');
      const descriptionNode=findPart(baseAnatomy,'description');
      if(targetNode){targetNode.bind='targetLabel';const def=targetLabelInput?.value.trim()||targetNode.text||'New feature';properties.push({id:'targetLabel',name:'Target label',type:'text',default:def});selection.targetLabel=def;}
      if(titleNode){
        titleNode.bind='title';const def=titleInput?.value.trim()||titleNode.text||'Try the new dashboard';properties.push({id:'title',name:'Title',type:'text',default:def});selection.title=def;
        // Heading level is one of the Typography Foundation's own predefined
        // h1-h6 roles (see tour-detail.js's HEADING_LEVEL_OPTIONS) - the
        // title node's own captured font-family/size/weight/line-height
        // already resolve to that level's real var(--type-hN-*) tokens
        // (set inline in the live markup), so they bind to real Figma
        // variables automatically; this property just documents which
        // level was active, the same "editable, not independently layer-
        // bound" treatment as Icon position/Thumb shape elsewhere.
        const headingLevelInput=document.querySelector('[data-role="tour-heading-level"]');
        if(headingLevelInput){const level=(headingLevelInput.value||'h6').toUpperCase();properties.push({id:'headingLevel',name:'Heading level',type:'options',options:['H1','H2','H3','H4','H5','H6'],default:level});selection.headingLevel=level;}
      }
      if(descriptionNode){descriptionNode.bind='description';const def=descriptionInput?.value.trim()||descriptionNode.text||"Get a quick overview of your team's activity in one place.";properties.push({id:'description',name:'Description',type:'text',default:def});selection.description=def;}

      // State-only buttons (Back in Middle/Last, Finish in Last) live in their own State rows: harvest and graft them with visibility rules
      // (hiddenWhen hides only when EVERY rule matches, so "in A or B" is "hidden when neither"). Next is in First and Middle only.
      {
        const labels=properties.find(p=>p.id==='state')?.options||[];
        const find=re=>labels.find(l=>re.test(l));
        const first=find(/first/i),middle=find(/middle/i),last=find(/last/i);
        const partIn=(st,id)=>{const e=gatherEntries().find(x=>x.state===st&&x.type===originalType);return e?findPart(snapshot(e.root,'root',0),id):null;};
        const actions=findPart(baseAnatomy,'actions');
        const notIn=list=>list.map(l=>({property:'state',equals:l,not:true}));
        if(actions){
          const next=findPart(baseAnatomy,'next');
          if(next&&middle&&last)next.hiddenWhen=notIn([first,middle].filter(Boolean));
          if(middle&&!findPart(baseAnatomy,'back')){const back=partIn(middle,'back');if(back){back.hiddenWhen=notIn([middle,last].filter(Boolean));actions.children.unshift(back);}}
          if(last&&!findPart(baseAnatomy,'finish')){const fin=partIn(last,'finish');if(fin){fin.visibleWhen=[{property:'state',equals:last}];actions.children.push(fin);}}
        }
        // Arrow: child of the card, first (painted under the text), anchored to the facing edge.
        const card=findPart(baseAnatomy,'card'),arrow=findPart(baseAnatomy,'arrow');
        const entry0=gatherEntries().find(e=>e.type===originalType&&e.state===originalState);
        const arrowStyles=entry0&&tourArrowStyles(entry0.root,originalType);
        if(card&&arrow){
          if(arrowStyles)arrow.styles={...arrow.styles,...arrowStyles};
          baseAnatomy.children=baseAnatomy.children.filter(n=>n!==arrow);
          card.children=[arrow,...(card.children||[]).filter(n=>n!==arrow)];
          card.styles={...card.styles,overflow:'visible',overflowX:'visible',overflowY:'visible',alignSelf:'flex-start'};
        }
        // Everything hugs its content; the card keeps its 220px width and its parts fill it. Page-measured heights/widths would freeze them.
        const strip=(n,keys)=>{if(!n)return;const st={...n.styles};for(const k of keys)delete st[k];n.styles=st;};
        const hugBoth=['width','height'],heightOnly=['height'];
        strip(baseAnatomy,hugBoth);strip(card,heightOnly);
        for(const id of ['counter','actions','title','description'])strip(findPart(baseAnatomy,id),hugBoth);
        for(const id of ['back','next','finish','target','targettext'])strip(findPart(baseAnatomy,id),hugBoth);
        for(const id of ['counter','actions','title','description']){const n=findPart(baseAnatomy,id);if(n)n.styles={...n.styles,alignSelf:'stretch'};}
        // Spacing the page makes with margins (which Figma can't): card gap 4 (title to description), counter 8 above the title, actions 12 below the text.
        if(card)card.styles={...card.styles,gap:'4px',rowGap:'4px'};
        {const c=findPart(baseAnatomy,'counter');if(c){const st={...c.styles,paddingBottom:'4px'};delete st.marginBottom;c.styles=st;}}
        {const a=findPart(baseAnatomy,'actions');if(a){const st={...a.styles,paddingTop:'8px'};delete st.marginTop;a.styles=st;}}
        {const d=findPart(baseAnatomy,'description');if(d){const st={...d.styles};delete st.marginTop;d.styles=st;}}
        const ids=['root','card','counter','actions','title','description','back','next','finish','target','targettext'];
        for(const v of variants)for(const id of ids){const o=v.overrides[id];if(o&&o.styles){const st={...o.styles};delete st.width;delete st.height;delete st.marginTop;delete st.marginBottom;if(Object.keys(st).length)o.styles=st;else delete o.styles;if(!Object.keys(o).length)delete v.overrides[id];}}
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Drawer: same shape as captureModalProperties() above (manual Size
    // <select> drive + Corner radius multiselect + Appearance/State
    // crossing), trimmed down - no Confirm/Cancel/icon here, just Title/
    // Body/Show close button (Cancel/Save footer buttons stay fixed
    // illustrative copy per spec, not requested as properties).
    function captureDrawerProperties(){
      const M=window.ADSComponentContract;
      const sizeSelect=document.querySelector('[data-role="drawer-size-select"]');
      const radiusMount=document.querySelector('[data-role="drawer-radius-mount"]');
      const titleInput=document.querySelector('[data-role="drawer-title"]');
      const bodyInput=document.querySelector('[data-role="drawer-body"]');
      const showCloseInput=document.querySelector('[data-role="drawer-show-close"]');

      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state,originalConfig=selected.config;
      const originalSize=sizeSelect?sizeSelect.value:null;
      const sizeOptionEls=sizeSelect?[...sizeSelect.options]:[];
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const variants=[];let typeOptions=[],stateOptions=[],sizeOptions=[],radiusOptions=[];
      applyingFoundation=true;
      try{
        const all=radiusMount?.querySelector('.multiselect-option-all input[type=checkbox]');
        if(all&&!all.checked){all.checked=true;all.dispatchEvent(new Event('change',{bubbles:true}));}
        for(const opt of (sizeOptionEls.length?sizeOptionEls:[null])){
          const sizeVal=opt?opt.value:null,sizeLabel=opt?opt.textContent.trim():null;
          if(opt&&sizeSelect.value!==sizeVal){sizeSelect.value=sizeVal;sizeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
          for(const entry of gatherEntries()){
            typeOptions.push(entry.type);stateOptions.push(entry.state);radiusOptions.push(entry.config);if(sizeLabel)sizeOptions.push(sizeLabel);
            if(entry.type===originalType&&entry.state===originalState&&entry.config===originalConfig&&(!opt||sizeVal===originalSize))continue;
            const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
            (function walk(n){
              const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
              if(baseNode){
                const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
                const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
                for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
                const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
                if(Object.keys(patch).length)overrides[n.id]=patch;
              }
              for(const child of n.children||[])walk(child);
            })(variantAnatomy);
            const when={state:entry.state,appearance:entry.type,radius:entry.config};if(sizeLabel)when.size=sizeLabel;
            const variantName=[entry.type,sizeLabel,entry.config,entry.state].filter(Boolean).join(' / ');
            if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
          }
        }
      }finally{
        if(sizeSelect&&sizeSelect.value!==originalSize){sizeSelect.value=originalSize;sizeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
        applyingFoundation=false;refresh();
      }
      typeOptions=[...new Set(typeOptions)];stateOptions=[...new Set(stateOptions)];sizeOptions=[...new Set(sizeOptions)];radiusOptions=[...new Set(radiusOptions)];
      const originalSizeLabel=sizeOptionEls.find(o=>o.value===originalSize)?.textContent.trim()||sizeOptions[0];
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:typeOptions.includes(originalType)?originalType:typeOptions[0]});selection.appearance=properties[properties.length-1].default;}
      if(sizeOptions.length>1){properties.push({id:'size',name:'Size',type:'options',options:sizeOptions,default:sizeOptions.includes(originalSizeLabel)?originalSizeLabel:sizeOptions[0]});selection.size=properties[properties.length-1].default;}
      if(radiusOptions.length>1){properties.push({id:'radius',name:'Corner radius',type:'options',options:radiusOptions,default:radiusOptions.includes(originalConfig)?originalConfig:radiusOptions[0]});selection.radius=properties[properties.length-1].default;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      function currentPart(partId){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const titleNode=findPart(baseAnatomy,'title');
      const bodyNode=findPart(baseAnatomy,'body');
      if(titleNode){
        titleNode.bind='title';const def=titleInput?.value.trim()||titleNode.text||'Edit details';properties.push({id:'title',name:'Title',type:'text',default:def});selection.title=def;
        // Heading level is one of the Typography Foundation's own predefined
        // h1-h6 roles (see drawer-detail.js's HEADING_LEVEL_OPTIONS) - the
        // title node's own captured font-family/size/weight/line-height
        // already resolve to that level's real var(--type-hN-*) tokens
        // (set inline in the live markup), so they bind to real Figma
        // variables automatically; this property just documents which
        // level was active, the same "editable, not independently layer-
        // bound" treatment as Icon position/Thumb shape elsewhere.
        const headingLevelInput=document.querySelector('[data-role="drawer-heading-level"]');
        if(headingLevelInput){const level=(headingLevelInput.value||'h6').toUpperCase();properties.push({id:'headingLevel',name:'Heading level',type:'options',options:['H1','H2','H3','H4','H5','H6'],default:level});selection.headingLevel=level;}
      }
      if(bodyNode){bodyNode.bind='body';const def=bodyInput?.value.trim()||bodyNode.text||'Drawer body content goes here.';properties.push({id:'body',name:'Body',type:'text',default:def});selection.body=def;}

      const originalShowClose=showCloseInput?.checked??true;
      let closeNode=findPart(baseAnatomy,'close');
      if(showCloseInput&&!closeNode){
        applyingFoundation=true;
        try{
          if(!originalShowClose){showCloseInput.checked=true;showCloseInput.dispatchEvent(new Event('change',{bubbles:true}));}
          closeNode=currentPart('close');
          if(!originalShowClose){showCloseInput.checked=false;showCloseInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }finally{applyingFoundation=false;refresh();}
      }
      if(closeNode){
        closeNode.visibleWhen=[{property:'showClose',equals:true}];
        if(!findPart(baseAnatomy,'close')){
          const header=findPart(baseAnatomy,'header');
          if(header)header.children=[...(header.children||[]),closeNode];
        }
        properties.push({id:'showClose',name:'Show close button',type:'boolean',default:originalShowClose});
        selection.showClose=originalShowClose;
      }

      // Panel placement. The page pushes the panel to an edge with auto margins (margin-inline-start:auto for Right, ...), which Figma can't
      // reproduce - every placement came out at the same edge. The scrim aligns its content to the edge instead (justify-content), and the
      // panel stretches across the other axis (full height for Right/Left, full width for Top/Bottom). Panel width follows Size for Right/Left;
      // heights hug content (the panel's header, body and footer stack and hug; only the scrim is a fixed viewport-sized preview).
      {
        const findN=(n,id)=>{if(n.id===id)return n;for(const k of n.children||[]){const r=findN(k,id);if(r)return r;}return null;};
        const alignFor=t=>/left|top/i.test(String(t||''))?'flex-start':'flex-end';
        const dirFor=t=>/top|bottom/i.test(String(t||''))?'column':'row';
        const baseType=selection.appearance||originalType;
        baseAnatomy.styles={...baseAnatomy.styles,width:'400px',justifyContent:alignFor(baseType),flexDirection:dirFor(baseType)};
        const panel=findN(baseAnatomy,'panel');if(panel){const st={...panel.styles,alignSelf:'stretch'};delete st.height;delete st.marginTop;delete st.marginBottom;delete st.marginLeft;delete st.marginRight;panel.styles=st;}
        const bodyWrap=findN(baseAnatomy,'bodywrap'),footer=findN(baseAnatomy,'footer'),close=findN(baseAnatomy,'close');
        const stateLabels=properties.find(p=>p.id==='state')?.options||[];
        const noFooter=stateLabels.filter(l=>/no footer/i.test(l)),noClose=stateLabels.filter(l=>/no close/i.test(l));
        const nots=list=>list.map(l=>({property:'state',equals:l,not:true}));
        if(footer&&noFooter.length)footer.visibleWhen=[...(footer.visibleWhen||[]),...nots(noFooter)];
        if(close&&noClose.length)close.visibleWhen=[...(close.visibleWhen||[]),...nots(noClose)];
        const stripKeys=(n,keys)=>{if(!n)return;const st={...n.styles};for(const k of keys)delete st[k];n.styles=st;};
        for(const id of ['header','bodywrap','footer','title','body','cancel','save'])stripKeys(findN(baseAnatomy,id),['width','height']);
        for(const id of ['header','bodywrap','footer']){const n=findN(baseAnatomy,id);if(n)n.styles={...n.styles,alignSelf:'stretch'};}
        {const n=findN(baseAnatomy,'body');if(n)n.styles={...n.styles,flexGrow:'1'};}
        for(const v of variants){
          const t=(v.when||{}).appearance!==undefined?v.when.appearance:baseType;
          const root=v.overrides.root||(v.overrides.root={});root.styles={...(root.styles||{}),width:'400px',justifyContent:alignFor(t),flexDirection:dirFor(t)};
          delete root.styles.height;
          const pn=v.overrides.panel||(v.overrides.panel={});const ps={...(pn.styles||{}),alignSelf:'stretch'};
          for(const k of ['height','marginTop','marginBottom','marginLeft','marginRight'])delete ps[k];
          if(/top|bottom/i.test(String(t))){
            ps.width='100%';
            // Top/Bottom panels hug their height, so the body must hug too: a growing body inside a hugging panel stays at its default 32px and
            // the text spills over the footer (it only grows in Right/Left, where the panel is full height).
            const bw=v.overrides.bodywrap||(v.overrides.bodywrap={});bw.styles={...(bw.styles||{}),flexGrow:'0'};
          }
          pn.styles=ps;
          for(const id of ['header','bodywrap','footer','title','body','cancel','save']){const o=v.overrides[id];if(o&&o.styles){const st={...o.styles};delete st.width;delete st.height;if(Object.keys(st).length)o.styles=st;else delete o.styles;if(!Object.keys(o).length)delete v.overrides[id];}}
        }
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Notification: same no-native-control-to-drive manual sweep as
    // Upload/Tooltip/Tour - every Appearance/State combination already
    // coexists in one table. Title/Description are always-present clean
    // leaf text nodes, bound directly (the "Stacked" state renders two
    // copies of the same card - both carry the same marker, so findPart()
    // simply binds whichever one it finds first; harmless since only one
    // state is ever the base capture). Placement never affects the card's
    // own appearance at all - it's which viewport corner it stacks from,
    // a page-level/runtime concern, not a visual difference Figma can
    // draw - so it's an orphan options property sourced straight from the
    // live <select>'s own option list, not bound to any layer.
    function captureNotificationProperties(){
      const M=window.ADSComponentContract;
      const titleInput=document.querySelector('[data-role="notification-title"]');
      const descriptionInput=document.querySelector('[data-role="notification-description"]');
      const placementSelect=document.querySelector('[data-role="notification-placement-select"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const titleNode=findPart(baseAnatomy,'title');
      const descriptionNode=findPart(baseAnatomy,'description');
      if(titleNode){
        titleNode.bind='title';const def=titleInput?.value.trim()||titleNode.text||'File uploaded';properties.push({id:'title',name:'Title',type:'text',default:def});selection.title=def;
        // Heading level is one of the Typography Foundation's own predefined
        // h1-h6 roles (see notification-detail.js's HEADING_LEVEL_OPTIONS) -
        // the title node's own captured font-family/size/weight/line-height
        // already resolve to that level's real var(--type-hN-*) tokens
        // (set inline in the live markup), so they bind to real Figma
        // variables automatically; this property just documents which
        // level was active, the same "editable, not independently layer-
        // bound" treatment as Icon position/Thumb shape elsewhere.
        const headingLevelInput=document.querySelector('[data-role="notification-heading-level"]');
        if(headingLevelInput){const level=(headingLevelInput.value||'h6').toUpperCase();properties.push({id:'headingLevel',name:'Heading level',type:'options',options:['H1','H2','H3','H4','H5','H6'],default:level});selection.headingLevel=level;}
      }
      if(descriptionNode){descriptionNode.bind='description';const def=descriptionInput?.value.trim()||descriptionNode.text||'team-report.pdf is ready to share.';properties.push({id:'description',name:'Description',type:'text',default:def});selection.description=def;}
      if(placementSelect){
        // Not 'options' - adapter.js treats every non-multiple options
        // property as a variant-crossing axis automatically (axes=...
        // p.type==='options'&&!p.multiple...), which would quadruple the
        // master count for a property with zero actual visual difference
        // between its values. 'text' keeps it editable without crossing,
        // same reasoning as Rating's Scale/Selected staying unbound text.
        const placementOptions=[...placementSelect.options].map(o=>o.value);
        properties.push({id:'placement',name:'Placement',type:'text',default:placementSelect.value||placementOptions[0]});
        selection.placement=placementSelect.value||placementOptions[0];
      }

      // State-only parts: the Undo action (With action) and the card BEHIND the front one (Stacked) exist only in their own State rows, so they are
      // harvested from there and grafted with a visibility rule. Everything hugs its content (the card keeps its 260px width); the page's
      // measured heights and body width would freeze them. Spacing the page makes with margins is set explicitly (Figma ignores margins on text).
      {
        const findN=(n,id)=>{if(n.id===id)return n;for(const k of n.children||[]){const r=findN(k,id);if(r)return r;}return null;};
        const labels=properties.find(p=>p.id==='state')?.options||[];
        const actionState=labels.find(l=>/action/i.test(l)),stackedState=labels.find(l=>/stack/i.test(l));
        const partIn=(st,id)=>{const e=gatherEntries().find(x=>x.state===st&&x.type===originalType);return e?findN(snapshot(e.root,'root',0),id):null;};
        const body=findN(baseAnatomy,'body'),card=findN(baseAnatomy,'card');
        if(body&&actionState&&!findN(baseAnatomy,'action')){const n=partIn(actionState,'action');if(n){n.visibleWhen=[{property:'state',equals:actionState}];body.children.push(n);}}
        // The card behind is drawn FIRST (later siblings paint on top); right/bottom read back as 0px from the page, which would pin it to the corner.
        if(stackedState&&!findN(baseAnatomy,'behind')){const n=partIn(stackedState,'behind');if(n){n.visibleWhen=[{property:'state',equals:stackedState}];n.styles={...n.styles,right:'auto',bottom:'auto',width:'280px'};baseAnatomy.children.unshift(n);}}
        // The wrapper hugs one card (280px), or the stack's 288px with 8px under it for the offset card.
        const wrapStyles=st=>/stack/i.test(String(st||''))?{width:'288px',paddingBottom:'8px'}:{width:'280px',paddingBottom:'0px'};
        baseAnatomy.styles={...baseAnatomy.styles,...wrapStyles(selection.state)};
        for(const v of variants){const o=v.overrides.stack||(v.overrides.stack={});o.styles={...(o.styles||{}),...wrapStyles((v.when||{}).state)};}
        const strip=(n,keys)=>{if(!n)return;const st={...n.styles};for(const k of keys)delete st[k];n.styles=st;};
        strip(baseAnatomy,['height']);strip(card,['height']);
        // The card is 280px in every State; the page's demo cells squeezed it to different widths (about 185px in some), which left the body
        // about 110px wide and wrapped the title and description onto 2 and 4 lines.
        // alignSelf flex-start keeps the card a plain FIXED 280px child: left to the plugin it was turned into "fill the wrapper", and a wrapper that
        // hugs its card has nothing to fill, so the card shrank to its content (about 167px) in every State but Stacked (whose wrapper is wider).
        if(card)card.styles={...card.styles,width:'280px',alignSelf:'flex-start'};
        for(const v of variants){const o=v.overrides.card||(v.overrides.card={});o.styles={...(o.styles||{}),width:'280px',alignSelf:'flex-start'};}
        for(const id of ['body','title','description','action'])strip(findN(baseAnatomy,id),['width','height']);
        for(const id of ['title','description']){const n=findN(baseAnatomy,id);if(n)n.styles={...n.styles,alignSelf:'stretch'};}
        if(body)body.styles={...body.styles,gap:'2px',rowGap:'2px'};
        {const a=findN(baseAnatomy,'action');if(a){const st={...a.styles,paddingTop:'6px',alignSelf:'flex-start'};delete st.marginTop;a.styles=st;}}
        {const d=findN(baseAnatomy,'description');if(d){const st={...d.styles};delete st.marginTop;d.styles=st;}}
        for(const v of variants)for(const id of ['stack','card','body','title','description','action']){const o=v.overrides[id];if(o&&o.styles){const st={...o.styles};delete st.height;if(id!=='stack'&&id!=='card')delete st.width;delete st.marginTop;if(Object.keys(st).length)o.styles=st;else delete o.styles;if(!Object.keys(o).length)delete v.overrides[id];}}
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Pop Confirm: same no-native-control-to-drive manual sweep as
    // Tooltip/Tour - every Appearance(placement)/State combination already
    // coexists in one table. Question/Confirm label/Cancel label are
    // always-present clean leaf text nodes, bound directly.
    function capturePopConfirmProperties(){
      const M=window.ADSComponentContract;
      const questionInput=document.querySelector('[data-role="pop-confirm-question"]')||document.querySelector('[data-role="popconfirm-question"]');
      const confirmLabelInput=document.querySelector('[data-role="pop-confirm-confirm-label"]')||document.querySelector('[data-role="popconfirm-confirm-label"]');
      const cancelLabelInput=document.querySelector('[data-role="pop-confirm-cancel-label"]')||document.querySelector('[data-role="popconfirm-cancel-label"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      // Same arrow treatment as the Tooltip and Tour: an absolutely placed child of the card, anchored to the card edge facing the trigger.
      function pcArrowStyles(wrapEl,placement){
        const arrowEl=wrapEl&&wrapEl.querySelector&&wrapEl.querySelector('.popconfirm-demo-arrow'),cardEl=wrapEl&&wrapEl.querySelector&&wrapEl.querySelector('.popconfirm-demo-bubble');
        if(!arrowEl||!cardEl)return null;
        const cr=cardEl.getBoundingClientRect(),ar=arrowEl.getBoundingClientRect();
        const m=/^matrix\(([^)]+)\)/.exec(getComputedStyle(arrowEl).transform);const deg=m?-Math.atan2(Number(m[1].split(',')[1]),Number(m[1].split(',')[0]))*180/Math.PI:0,rad=deg*Math.PI/180,cs=Math.cos(rad),sn=Math.sin(rad);
        const w=parseFloat(getComputedStyle(arrowEl).width)||8,h=parseFloat(getComputedStyle(arrowEl).height)||8;
        const cx=(ar.left-cr.left)+ar.width/2,cy=(ar.top-cr.top)+ar.height/2;
        const t=String(placement||'').toLowerCase(),side=/left/.test(t)?'left':/right/.test(t)?'right':/bottom/.test(t)?'bottom':'top';
        const hint={top:{justifySelf:'center',alignSelf:'flex-end'},bottom:{justifySelf:'center',alignSelf:'flex-start'},left:{justifySelf:'flex-end',alignSelf:'center'},right:{justifySelf:'flex-start',alignSelf:'center'}}[side];
        return {position:'absolute',left:(cx-(cs*(w/2)+sn*(h/2)))+'px',top:(cy-(-sn*(w/2)+cs*(h/2)))+'px',marginTop:'0px',marginBottom:'0px',marginLeft:'0px',marginRight:'0px',right:'auto',bottom:'auto',...hint};
      }
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        {const st=pcArrowStyles(entry.root,entry.type);if(st)overrides.arrow={...(overrides.arrow||{}),styles:{...((overrides.arrow||{}).styles||{}),...st}};}
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const questionNode=findPart(baseAnatomy,'question');
      const confirmNode=findPart(baseAnatomy,'confirm');
      const cancelNode=findPart(baseAnatomy,'cancel');
      if(questionNode){
        questionNode.bind='question';const def=questionInput?.value.trim()||questionNode.text||'Delete this item?';properties.push({id:'question',name:'Question text',type:'text',default:def});selection.question=def;
        // Heading level is one of the Typography Foundation's own predefined
        // h1-h6 roles (see pop-confirm-detail.js's HEADING_LEVEL_OPTIONS) -
        // the question node's own captured font-family/size/weight/line-
        // height already resolve to that level's real var(--type-hN-*)
        // tokens (set inline in the live markup), so they bind to real
        // Figma variables automatically; this property just documents
        // which level was active, the same "editable, not independently
        // layer-bound" treatment as Icon position/Thumb shape elsewhere.
        const headingLevelInput=document.querySelector('[data-role="popconfirm-heading-level"]');
        if(headingLevelInput){const level=(headingLevelInput.value||'h6').toUpperCase();properties.push({id:'headingLevel',name:'Heading level',type:'options',options:['H1','H2','H3','H4','H5','H6'],default:level});selection.headingLevel=level;}
      }
      if(confirmNode){confirmNode.bind='confirmLabel';const def=confirmLabelInput?.value.trim()||confirmNode.text||'Yes';properties.push({id:'confirmLabel',name:'Confirm label',type:'text',default:def});selection.confirmLabel=def;}
      if(cancelNode){cancelNode.bind='cancelLabel';const def=cancelLabelInput?.value.trim()||cancelNode.text||'No';properties.push({id:'cancelLabel',name:'Cancel label',type:'text',default:def});selection.cancelLabel=def;}

      // Parts, spacing and sizing for Figma. The warning icon exists only in the With icon State, so it is harvested from there and shown for that State;
      // the arrow becomes an absolute child of the card; the card keeps its 220px width as a plain fixed child (left to the plugin it became "fill the
      // wrapper", and a wrapper that hugs its card leaves nothing to fill); everything else hugs. The buttons hug their labels and no longer clip them
      // (they were frozen at the page's measured 41px / 45px with overflow hidden, which cut "No" to "Nc").
      {
        const findN=(n,id)=>{if(n.id===id)return n;for(const k of n.children||[]){const r=findN(k,id);if(r)return r;}return null;};
        const labels=properties.find(p=>p.id==='state')?.options||[];
        const iconState=labels.find(l=>/icon/i.test(l));
        const row=findN(baseAnatomy,'questionrow');
        if(row&&iconState&&!findN(baseAnatomy,'icon')){const e=gatherEntries().find(x=>x.state===iconState&&x.type===originalType);const ic=e&&findN(snapshot(e.root,'root',0),'icon');if(ic){ic.visibleWhen=[{property:'state',equals:iconState}];row.children.unshift(ic);}}
        const card=findN(baseAnatomy,'card'),arrow=findN(baseAnatomy,'arrow');
        const entry0=gatherEntries().find(e=>e.type===originalType&&e.state===originalState);
        const arrowStyles=entry0&&pcArrowStyles(entry0.root,originalType);
        if(card&&arrow){
          if(arrowStyles)arrow.styles={...arrow.styles,...arrowStyles};
          baseAnatomy.children=baseAnatomy.children.filter(n=>n!==arrow);
          card.children=[arrow,...(card.children||[]).filter(n=>n!==arrow)];
          card.styles={...card.styles,overflow:'visible',overflowX:'visible',overflowY:'visible',width:'220px',alignSelf:'flex-start'};
        }
        const strip=(n,keys)=>{if(!n)return;const st={...n.styles};for(const k of keys)delete st[k];n.styles=st;};
        strip(baseAnatomy,['width','height']);strip(card,['height']);
        for(const id of ['questionrow','actions','question','cancel','confirm','trigger','icon'])strip(findN(baseAnatomy,id),['width','height']);
        for(const id of ['questionrow','actions']){const n=findN(baseAnatomy,id);if(n)n.styles={...n.styles,alignSelf:'stretch'};}
        for(const id of ['cancel','confirm']){const n=findN(baseAnatomy,id);if(n)n.styles={...n.styles,overflow:'visible',textOverflow:'clip',justifyContent:'center'};}
        for(const v of variants){
          for(const id of ['root','card','questionrow','actions','question','cancel','confirm','trigger','icon']){const o=v.overrides[id];if(o&&o.styles){const st={...o.styles};delete st.height;if(id!=='card')delete st.width;if(Object.keys(st).length)o.styles=st;else delete o.styles;if(!Object.keys(o).length)delete v.overrides[id];}}
          const co=v.overrides.card||(v.overrides.card={});co.styles={...(co.styles||{}),width:'220px',alignSelf:'flex-start'};
        }
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Progress: same no-native-control-to-drive manual sweep as Tooltip/
    // Tour/Pop Confirm - every Appearance(linear/circular)/State(in
    // progress/success/error) combination already coexists in one table.
    // The fill's width (linear) or conic-gradient stop (circular) is a
    // computed visual derived from Percent per State (Success always reads
    // 100%, Error always reads a fixed stalled value) - Figma can't
    // recompute that fill from a bare property any more than Slider could
    // recompute its thumb position, so the bar/ring itself keeps whichever
    // fill was active at capture time regardless of what Percent is later
    // edited to. The label's own displayed number IS bound to Percent
    // though, harvested specifically from the "In progress" row (the only
    // state whose displayed number is actually driven by the live Percent
    // input, rather than a fixed per-state value) - Show label is a bound
    // Boolean, with real geometry harvested by briefly showing it during
    // export even if currently off.
    function captureProgressProperties(){
      const M=window.ADSComponentContract;
      const percentInput=document.querySelector('[data-role="progress-percent-input"]');
      const showLabelInput=document.querySelector('[data-role="progress-show-label"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const inProgressLabel=stateOptions.find(l=>/in progress/i.test(l))||originalState;
      const originalShowLabel=showLabelInput?.checked??true;
      let labelNode=null;
      applyingFoundation=true;
      try{
        if(showLabelInput&&!originalShowLabel){showLabelInput.checked=true;showLabelInput.dispatchEvent(new Event('change',{bubbles:true}));}
        const entry=gatherEntries().find(e=>e.type===originalType&&e.state===inProgressLabel);
        labelNode=entry&&findPart(snapshot(entry.root,'root',0),'label');
        if(showLabelInput&&!originalShowLabel){showLabelInput.checked=false;showLabelInput.dispatchEvent(new Event('change',{bubbles:true}));}
      }finally{
        applyingFoundation=false;refresh();
      }
      if(labelNode){
        labelNode.bind='percent';
        labelNode.visibleWhen=[{property:'showLabel',equals:true}];
        if(!findPart(baseAnatomy,'label'))baseAnatomy.children.push(labelNode);
        const def=labelNode.text||((percentInput?.value||'65')+'%');
        properties.push({id:'percent',name:'Percent',type:'text',default:def},{id:'showLabel',name:'Show label',type:'boolean',default:originalShowLabel});
        selection.percent=def;selection.showLabel=originalShowLabel;
      }

      // Circular. The page draws the ring with a conic-gradient background plus an inner disc, which a Figma frame can't reproduce, and the
      // Circular row has a different structure from the Linear bar the export is based on, so its look never arrived (only the Linear bar did).
      // Each State's ring is rebuilt as an SVG (a track circle, a progress arc, and the dashed outline in Error) from the colours and percentage
      // read off the page, shown for Circular + that State; the Linear track and fill are hidden for Circular, and the label is centred over the ring.
      {
        const labels=typeOptions.filter(Boolean),circularLabel=typeOptions.find(l=>/circular/i.test(l));
        const root=baseAnatomy;
        const track=findPart(baseAnatomy,'root-0');
        if(circularLabel){
          if(track)track.visibleWhen=[...(track.visibleWhen||[]),{property:'appearance',equals:circularLabel,not:true}];
          const rgbOf=t=>{const m=/rgba?\(([^)]+)\)/.exec(t||'');return m?'rgb('+m[1].split(/[,\s/]+/).filter(Boolean).slice(0,3).join(',')+')':'#888888';};
          // The SVG is 82px (the 72px ring plus room for the 2px dashed outline 3px beyond it) and is placed 5px up-left of the 72px circle, so its own centre (41,41) lands on the circle's centre (36,36).
          const R=32,C=36,view=82,off=-5;
          const ringFor=entry=>{
            const el=entry.root,cs=getComputedStyle(el);
            const bg=/conic-gradient\(\s*(rgba?\([^)]+\))\s+([\d.]+)%\s*,\s*(rgba?\([^)]+\))/.exec(cs.backgroundImage||'');
            const fill=bg?rgbOf(bg[1]):'#ff031a',pct=bg?Math.max(0,Math.min(100,parseFloat(bg[2]))):65,trackColor=bg?rgbOf(bg[3]):'#e3e3df';
            const dashed=/dashed/.test(cs.outlineStyle||'')&&parseFloat(cs.outlineWidth)>0,outlineColor=rgbOf(cs.outlineColor);
            const shape=(tag,attrs)=>({id:'',name:tag,kind:'container',tag,attributes:attrs,styles:{display:'inline'},children:[]});
            const kids=[shape('circle',{cx:String(C-off),cy:String(C-off),r:String(R),fill:'none',stroke:trackColor,'stroke-width':'8'})];
            if(pct>=100)kids.push(shape('circle',{cx:String(C-off),cy:String(C-off),r:String(R),fill:'none',stroke:fill,'stroke-width':'8'}));
            else if(pct>0){const a=pct*3.6*Math.PI/180,x=C-off+R*Math.sin(a),y=C-off-R*Math.cos(a);kids.push(shape('path',{d:'M '+(C-off)+' '+(C-off-R)+' A '+R+' '+R+' 0 '+(pct>50?1:0)+' 1 '+x.toFixed(3)+' '+y.toFixed(3),fill:'none',stroke:fill,'stroke-width':'8'}));}
            if(dashed)kids.push(shape('circle',{cx:String(C-off),cy:String(C-off),r:'39',fill:'none',stroke:outlineColor,'stroke-width':'2','stroke-dasharray':'4 3'}));
            return kids;
          };
          for(const state of stateOptions){
            const entry=gatherEntries().find(e=>e.type===circularLabel&&e.state===state);
            if(!entry)continue;
            const kids=ringFor(entry),idBase='ring-'+String(state).toLowerCase().replace(/[^a-z0-9]+/g,'-');
            kids.forEach((k,n)=>{k.id=idBase+'-'+n;});
            root.children.unshift({id:idBase,name:'Ring',kind:'icon',tag:'svg',attributes:{viewBox:'0 0 '+view+' '+view,fill:'none',width:String(view),height:String(view)},
              styles:{display:'block',position:'absolute',left:off+'px',top:off+'px',width:view+'px',height:view+'px',justifySelf:'center',alignSelf:'center'},
              visibleWhen:[{property:'appearance',equals:circularLabel},{property:'state',equals:state}],children:kids});
          }
        }
        // The Circular variants' own look comes from the ring now, not from the page's conic gradient or the hidden track.
        for(const v of variants){const o=v.overrides.root;if(o&&o.styles&&(v.when||{}).appearance===circularLabel){const st={...o.styles};for(const k of ['backgroundImage','background','backgroundColor','outline','outlineStyle','outlineColor','outlineWidth','outlineOffset'])delete st[k];o.styles=st;}}
        // Fixed size per Appearance: Linear is a 220px row; Circular a 72px square (the ring is drawn on top of it).
        const strip=(n,keys)=>{if(!n)return;const st={...n.styles};for(const k of keys)delete st[k];n.styles=st;};
        strip(root,['height']);
        for(const v of variants){const o=v.overrides.root;if(o&&o.styles&&(v.when||{}).appearance!==circularLabel){const st={...o.styles};delete st.height;o.styles=st;}}
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Result: same no-native-control-to-drive manual sweep as Tour/
    // Notification - every Appearance/State combination already coexists
    // in one table. Title/Description are always-present clean leaf text
    // nodes, bound directly. Done/View details button text stays
    // illustrative reference content, not a configurable property.
    function captureResultProperties(){
      const M=window.ADSComponentContract;
      const titleInput=document.querySelector('[data-role="result-title"]');
      const descriptionInput=document.querySelector('[data-role="result-description"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const titleNode=findPart(baseAnatomy,'title');
      const descriptionNode=findPart(baseAnatomy,'description');
      if(titleNode){
        titleNode.bind='title';const def=titleInput?.value.trim()||titleNode.text||'Operation completed';properties.push({id:'title',name:'Title',type:'text',default:def});selection.title=def;
        // Heading level is one of the Typography Foundation's own predefined
        // h1-h6 roles (see result-detail.js's HEADING_LEVEL_OPTIONS) - the
        // title node's own captured font-family/size/weight/line-height
        // already resolve to that level's real var(--type-hN-*) tokens
        // (set inline in the live markup), so they bind to real Figma
        // variables automatically; this property just documents which
        // level was active, the same "editable, not independently layer-
        // bound" treatment as Icon position/Thumb shape elsewhere.
        const headingLevelInput=document.querySelector('[data-role="result-heading-level"]');
        if(headingLevelInput){const level=(headingLevelInput.value||'h6').toUpperCase();properties.push({id:'headingLevel',name:'Heading level',type:'options',options:['H1','H2','H3','H4','H5','H6'],default:level});selection.headingLevel=level;}
      }
      if(descriptionNode){descriptionNode.bind='description';const def=descriptionInput?.value.trim()||descriptionNode.text||'Your request has been processed.';properties.push({id:'description',name:'Description',type:'text',default:def});selection.description=def;}

      // Parts and sizing for Figma. The "View details" button exists only in the With secondary State, so it is harvested from there and shown for it;
      // the actions row hugs its buttons (the page-measured 61px froze it at the width of one button, so a second one overflowed and the pair sat
      // off-centre) and is centred under the text; the panel keeps its 260px width, and the icon, title, description and buttons hug or fill it.
      {
        const findN=(n,id)=>{if(n.id===id)return n;for(const k of n.children||[]){const r=findN(k,id);if(r)return r;}return null;};
        const labels=properties.find(p=>p.id==='state')?.options||[];
        const secState=labels.find(l=>/secondary/i.test(l));
        const actions=findN(baseAnatomy,'actions');
        if(actions&&secState&&!findN(baseAnatomy,'secondary')){const e=gatherEntries().find(x=>x.state===secState&&x.type===originalType);const n=e&&findN(snapshot(e.root,'root',0),'secondary');if(n){n.visibleWhen=[{property:'state',equals:secState}];actions.children.push(n);}}
        const strip=(n,keys)=>{if(!n)return;const st={...n.styles};for(const k of keys)delete st[k];n.styles=st;};
        strip(baseAnatomy,['height']);
        for(const id of ['actions','done','secondary','title','description'])strip(findN(baseAnatomy,id),['width','height']);
        for(const id of ['title','description']){const n=findN(baseAnatomy,id);if(n)n.styles={...n.styles,alignSelf:'stretch'};}
        {const a=findN(baseAnatomy,'actions');if(a)a.styles={...a.styles,alignSelf:'center'};}
        for(const v of variants)for(const id of ['root','actions','done','secondary','title','description','iconwrap']){const o=v.overrides[id];if(o&&o.styles){const st={...o.styles};delete st.height;if(id!=='root')delete st.width;if(Object.keys(st).length)o.styles=st;else delete o.styles;if(!Object.keys(o).length)delete v.overrides[id];}}
        // With secondary shows two buttons that must be the same width (the wider label, "View details", sets it): measured off the page, then fixed
        // on both, with the label centred inside. Done on its own (Default, Compact) keeps hugging its label.
        if(secState){
          const e=gatherEntries().find(x=>x.state===secState&&x.type===originalType);
          const btns=e?[...e.root.querySelectorAll('.result-demo-btn')]:[];
          // +8px of slack: Figma's text can measure a little wider than the browser's, and a fixed-width button would otherwise wrap or clip its label.
          const W=btns.length?Math.ceil(Math.max(...btns.map(b=>b.getBoundingClientRect().width)))+8:0;
          if(W>0){
            const center={display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:W+'px'};
            const sec=findN(baseAnatomy,'secondary'),done=findN(baseAnatomy,'done');
            if(sec)sec.styles={...sec.styles,...center};
            if(done)done.styles={...done.styles,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'};
            for(const v of variants)if((v.when||{}).state===secState){const o=v.overrides.done||(v.overrides.done={});o.styles={...(o.styles||{}),...center};}
          }
        }
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Divider: Appearance/State/Size already cross generically via
    // captureCrossedProperties() (Type reads as Appearance - Horizontal/
    // Horizontal with text - State as the line style - Solid/Dashed/
    // Dotted). The label only exists structurally for the "Horizontal with
    // text" Appearance - harvested from that Appearance specifically (any
    // State/Size), same single-value visibleWhen constraint already used
    // for Select's State-driven error message. Text alignment repositions
    // the label via a CSS class swap (not a structural difference), but
    // only applies to that one Appearance and its own <select> isn't part
    // of the Size/State cross - rather than add a third, type-conditional
    // crossed axis, it stays an orphan editable property (same treatment
    // as Anchor's Icon position/Slider's Thumb shape): the divider keeps
    // whichever alignment was active at capture time.
    function captureDividerProperties(){
      const dividerSnaps=[];crossedHook=(entry,anatomySnap,when)=>dividerSnaps.push({entry,anatomySnap,when});
      let built;try{built=captureCrossedProperties();}finally{crossedHook=null;}
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      const textInput=document.querySelector('[data-role="divider-text"]');
      const alignSelect=document.querySelector('[data-role="divider-align-select"]');

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const typeLabels=built.properties.find(p=>p.id==='appearance')?.options||[];
      const textTypeLabel=typeLabels.find(l=>/with text/i.test(l));
      let labelNode=null;
      if(textTypeLabel){
        const entry=gatherEntries().find(e=>e.type===textTypeLabel);
        labelNode=entry&&findPart(snapshot(entry.root,'root',0),'label');
      }
      if(labelNode){
        labelNode.bind='label';
        if(textTypeLabel)labelNode.visibleWhen=[{property:'appearance',equals:textTypeLabel}];
        if(!findPart(anatomy,'label'))anatomy.children.splice(1,0,labelNode);
        const def=textInput?.value.trim()||labelNode.text||'OR';
        properties.push({id:'label',name:'Text label',type:'text',default:def});
        selection.label=def;
      }
      if(alignSelect){
        // A real axis (Left / Center / Right) rather than loose text: with Left or Right one of the two lines shrinks to a 16px stub.
        const alignLabels=[...alignSelect.options].map(o=>o.textContent.trim()||o.value);
        const alignDefaultLabel=(alignSelect.selectedOptions[0]?.textContent||alignSelect.value||'Center').trim();
        properties.push({id:'textAlign',name:'Text alignment',type:'options',options:alignLabels,default:alignLabels.includes(alignDefaultLabel)?alignDefaultLabel:alignLabels[0]});
        selection.textAlign=properties[properties.length-1].default;
      }

      // Divider, layer by layer. The "with text" form is [line, label, line], and only its own rows have the two segments and the label, so each
      // variant's segments and label type are copied from that variant's own snapshot (kept by the shared sweep as it ran). Chrome rounds a 1.5px border
      // to 1px when read back (so Medium came out as thin as Small): weights are set from the CSS - plain line Small 1px, Medium 1.5px, Large 2px, with
      // the line's height equal to its weight; segments 1.5px. The page centres the divider with auto margins, read back as a fixed offset that pushed it
      // off its box, so margins are dropped. The text form hugs its height and the label hugs its text. Left / Right alignment make one line a 16px stub.
      {
        const variants=built.variants;
        const lineKey=anatomy.id;
        const weightFor=l=>/small/i.test(String(l||''))?1:/large/i.test(String(l||''))?2:1.5;
        const px=n=>n+'px';
        const typoKeys=['fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing'];
        const dropMargins=st=>{const o={...st};for(const k of Object.keys(o))if(/^margin/.test(k))delete o[k];return o;};
        const plainLabel=typeLabels.find(l=>!/with text/i.test(l))||typeLabels[0];
        const sizeLabels=built.properties.find(p=>p.id==='size')?.options||[];
        const snapFor=when=>dividerSnaps.find(x=>x.when.state===when.state&&x.when.appearance===when.appearance&&x.when.size===when.size);
        // Segments: grafted from the first text row, then per-variant look.
        const firstTextSnap=dividerSnaps.find(x=>x.when.appearance===textTypeLabel);
        const segA=firstTextSnap&&findPart(firstTextSnap.anatomySnap,'segA'),segB=firstTextSnap&&findPart(firstTextSnap.anatomySnap,'segB');
        if(segA&&segB&&textTypeLabel){
          for(const n of [segA,segB]){n.visibleWhen=[{property:'appearance',equals:textTypeLabel}];n.styles={...n.styles,borderTopWidth:'1.5px',height:'1.5px'};}
          const label=findPart(anatomy,'label');
          anatomy.children=[segA,...(label?[label]:[]),segB];
          for(const v of variants){
            if((v.when||{}).appearance!==textTypeLabel)continue;
            const sn=snapFor(v.when);if(!sn)continue;
            for(const id of ['segA','segB']){const nd=findPart(sn.anatomySnap,id);if(nd)v.overrides[id]={styles:{...nd.styles,borderTopWidth:'1.5px',height:'1.5px'}};}
            const lab=findPart(sn.anatomySnap,'label');
            if(lab){const st={};for(const k of typoKeys)if(lab.styles[k]!==undefined)st[k]=lab.styles[k];v.overrides.label={...(v.overrides.label||{}),styles:{...((v.overrides.label||{}).styles||{}),...st}};}
          }
        }
        // Plain line: weight per Size (set as size-keyed variants so every State picks it up, whether or not the sweep produced a variant for it).
        const selSize=selection.size;
        anatomy.styles={...dropMargins(anatomy.styles),borderTopWidth:px(weightFor(selSize)),height:px(weightFor(selSize))};
        for(const l of sizeLabels)variants.push({id:'weight-'+String(l).toLowerCase().replace(/[^a-z0-9]+/g,'-'),name:'Line weight / '+l,when:{appearance:plainLabel,size:l},overrides:{[lineKey]:{styles:{borderTopWidth:px(weightFor(l)),height:px(weightFor(l))}}}});
        // Margins and sizes on the text form's wrapper and label.
        for(const v of variants){
          const o=v.overrides[lineKey];if(o&&o.styles)o.styles=dropMargins(o.styles);
          if((v.when||{}).appearance===textTypeLabel){const w=v.overrides[lineKey]||(v.overrides[lineKey]={});w.styles={...(w.styles||{}),height:'auto',borderTopWidth:'0px'};}
          const lab=v.overrides.label;if(lab&&lab.styles){const st={...lab.styles};delete st.width;delete st.height;lab.styles=st;}
        }
        {const lab=findPart(anatomy,'label');if(lab){const st={...lab.styles};delete st.width;delete st.height;lab.styles=st;}}
        // Alignment variants: one segment becomes a 16px stub, the other fills.
        const alignProp=properties.find(p=>p.id==='textAlign');
        if(alignProp&&textTypeLabel){
          const stub={flexGrow:'0',flexShrink:'0',flexBasis:'16px',width:'16px'},fill={flexGrow:'1'},extra=[];
          for(const l of sizeLabels)for(const lbl of alignProp.options){
            const t=lbl.toLowerCase();if(t==='center')continue;const left=/left/.test(t);
            extra.push({id:'align-'+String(l).toLowerCase()+'-'+t,name:'Alignment / '+l+' / '+lbl,when:{appearance:textTypeLabel,size:l,textAlign:lbl},overrides:{segA:{styles:left?stub:fill},segB:{styles:left?fill:stub}}});
          }
          variants.push(...extra);
        }
      }
      return {anatomy,properties,selection,variants:built.variants};
    }
    // Avatar: Size AND Shape are both plain <select>s (no multiselect to
    // lean on at all), so both need manual driving - a nested version of
    // Transfer's single-select sweep, crossed with Type(Appearance)/
    // State(presence), which already coexist in one table per size/shape
    // combination. Initials is a bound Text property, visible only while
    // Appearance is "Initials". Avatar.Group is a genuinely separate
    // composition (its own fixed person list + Max count + Show as toggle,
    // per the component's own spec comment) - not a property of one
    // Avatar, and not wired into this page's capture at all (a dedicated
    // static demo in a different DOM subtree) - drawing it as a real,
    // separate multi-instance Figma component is out of scope here and
    // left undone, called out explicitly in the dispatcher notes rather
    // than silently skipped.
    function captureAvatarProperties(){
      const M=window.ADSComponentContract;
      const sizeSelect=document.querySelector('[data-role="avatar-size-select"]');
      const shapeSelect=document.querySelector('[data-role="avatar-shape-select"]');
      const initialsInput=document.querySelector('[data-role="avatar-initials"]');

      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const originalSize=sizeSelect?sizeSelect.value:null,originalShape=shapeSelect?shapeSelect.value:null;
      const sizeOptionEls=sizeSelect?[...sizeSelect.options]:[null];
      const shapeOptionEls=shapeSelect?[...shapeSelect.options]:[null];
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const variants=[];let typeOptions=[],stateOptions=[],sizeOptions=[],shapeOptions=[];
      const avatarSnaps=[];
      applyingFoundation=true;
      try{
        for(const sizeOpt of sizeOptionEls){
          const sizeVal=sizeOpt?sizeOpt.value:null,sizeLabel=sizeOpt?sizeOpt.textContent.trim():null;
          if(sizeOpt&&sizeSelect.value!==sizeVal){sizeSelect.value=sizeVal;sizeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
          for(const shapeOpt of shapeOptionEls){
            const shapeVal=shapeOpt?shapeOpt.value:null,shapeLabel=shapeOpt?shapeOpt.textContent.trim():null;
            if(shapeOpt&&shapeSelect.value!==shapeVal){shapeSelect.value=shapeVal;shapeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
            for(const entry of gatherEntries()){
              typeOptions.push(entry.type);stateOptions.push(entry.state);if(sizeLabel)sizeOptions.push(sizeLabel);if(shapeLabel)shapeOptions.push(shapeLabel);
              if(entry.type===originalType&&entry.state===originalState&&(!sizeOpt||sizeVal===originalSize)&&(!shapeOpt||shapeVal===originalShape))continue;
              const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
              (function walk(n){
                const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
                if(baseNode){
                  const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
                  const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
                  for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
                  const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
                  if(Object.keys(patch).length)overrides[n.id]=patch;
                }
                for(const child of n.children||[])walk(child);
              })(variantAnatomy);
              const when={state:entry.state,appearance:entry.type};if(sizeLabel)when.size=sizeLabel;if(shapeLabel)when.shape=shapeLabel;
              avatarSnaps.push({when:{...when},anatomy:variantAnatomy});
              const variantName=[entry.type,sizeLabel,shapeLabel,entry.state].filter(Boolean).join(' / ');
              if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
            }
          }
        }
      }finally{
        if(sizeSelect&&sizeSelect.value!==originalSize){sizeSelect.value=originalSize;sizeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
        if(shapeSelect&&shapeSelect.value!==originalShape){shapeSelect.value=originalShape;shapeSelect.dispatchEvent(new Event('change',{bubbles:true}));}
        applyingFoundation=false;refresh();
      }
      typeOptions=[...new Set(typeOptions)];stateOptions=[...new Set(stateOptions)];sizeOptions=[...new Set(sizeOptions)];shapeOptions=[...new Set(shapeOptions)];
      const originalSizeLabel=sizeOptionEls.find(o=>o&&o.value===originalSize)?.textContent.trim()||sizeOptions[0];
      const originalShapeLabel=shapeOptionEls.find(o=>o&&o.value===originalShape)?.textContent.trim()||shapeOptions[0];
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:typeOptions.includes(originalType)?originalType:typeOptions[0]});selection.appearance=properties[properties.length-1].default;}
      if(sizeOptions.length>1){properties.push({id:'size',name:'Size',type:'options',options:sizeOptions,default:sizeOptions.includes(originalSizeLabel)?originalSizeLabel:sizeOptions[0]});selection.size=properties[properties.length-1].default;}
      if(shapeOptions.length>1){properties.push({id:'shape',name:'Shape',type:'options',options:shapeOptions,default:shapeOptions.includes(originalShapeLabel)?originalShapeLabel:shapeOptions[0]});selection.shape=properties[properties.length-1].default;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const initialsNode=findPart(baseAnatomy,'initials');
      if(initialsNode){
        initialsNode.bind='initials';
        const initialsTypeLabel=typeOptions.find(l=>/initials/i.test(l));
        if(typeOptions.length>1&&initialsTypeLabel)initialsNode.visibleWhen=[{property:'appearance',equals:initialsTypeLabel}];
        const def=initialsInput?.value.trim()||initialsNode.text||'JD';
        properties.push({id:'initials',name:'Initials',type:'text',default:def});
        selection.initials=def;
      }

      // The person icon (Icon rows) and the profile photo (Image rows) exist only in their own rows (the base is Initials), so each is harvested from
      // there and shown for its own Appearance; every Size/State gets the box measured off the page.
      {
        const labels=properties.find(p=>p.id==='appearance')?.options||[];
        const findI=(n,id)=>{if(n.id===id)return n;for(const k of n.children||[]){const r=findI(k,id);if(r)return r;}return null;};
        const circle=findI(baseAnatomy,'root-0');
        for(const [partId,re] of [['icon',/icon/i],['photo',/image/i]]){
          const label=labels.find(l=>re.test(l));
          const first=label&&avatarSnaps.find(x=>x.when.appearance===label);
          const node=first&&findI(first.anatomy,partId);
          if(!node||!circle||findI(baseAnatomy,partId))continue;
          node.visibleWhen=[{property:'appearance',equals:label}];
          circle.children.push(node);
          for(const v of variants){
            if((v.when||{}).appearance!==label)continue;
            const sn=avatarSnaps.find(x=>x.when.appearance===v.when.appearance&&x.when.state===v.when.state&&x.when.size===v.when.size&&x.when.shape===v.when.shape);
            const nd=sn&&findI(sn.anatomy,partId);
            if(nd)v.overrides[partId]={styles:{...nd.styles}};
          }
        }
        // The status dot (Online / Away / Offline) exists only in those State rows. It is harvested from the first of them and shown for every State
        // except the default one; each variant takes its own colour, size and bottom-right position (measured off the page) from its own snapshot.
        {
          const stateLabels=properties.find(p=>p.id==='state')?.options||[];
          const defaultState=stateLabels.find(l=>/default/i.test(l))||stateLabels[0];
          const firstDot=avatarSnaps.find(x=>x.when.state!==defaultState&&findI(x.anatomy,'status'));
          const dot=firstDot&&findI(firstDot.anatomy,'status');
          if(dot&&!findI(baseAnatomy,'status')){
            dot.visibleWhen=[{property:'state',equals:defaultState,not:true}];
            dot.styles={...dot.styles,right:'auto',bottom:'auto'};
            baseAnatomy.children.push(dot);
            // Every State x Appearance x Size x Shape needs its own dot, including combinations that had no variant because nothing else on the avatar
            // differs from the base (an Initials avatar that is Away), so variants are created where missing.
            const sameWhen=(a,b)=>a.state===b.state&&a.appearance===b.appearance&&a.size===b.size&&a.shape===b.shape;
            for(const sn of avatarSnaps){
              if(sn.when.state===defaultState)continue;
              const nd=findI(sn.anatomy,'status');if(!nd)continue;
              let v=variants.find(x=>sameWhen(x.when||{},sn.when));
              if(!v){v={id:'cv-dot-'+M.id([sn.when.appearance,sn.when.size,sn.when.shape,sn.when.state].filter(Boolean).join(' / ')),name:[sn.when.appearance,sn.when.size,sn.when.shape,sn.when.state].filter(Boolean).join(' / '),when:{...sn.when},overrides:{}};variants.push(v);}
              v.overrides.status={styles:{...nd.styles,right:'auto',bottom:'auto'}};
            }
          }
        }
      }
      // The initials hug their text (the page-measured width/height would freeze them at 2-letter "JD"), so editing the Initials property resizes them.
      {
        const findN=(n,id)=>{if(n.id===id)return n;for(const k of n.children||[]){const r=findN(k,id);if(r)return r;}return null;};
        const ini=findN(baseAnatomy,'initials');if(ini){const st={...ini.styles};delete st.width;delete st.height;ini.styles=st;}
        for(const v of variants){const o=v.overrides.initials;if(o&&o.styles){const st={...o.styles};delete st.width;delete st.height;if(Object.keys(st).length)o.styles=st;else delete o.styles;if(!Object.keys(o).length)delete v.overrides.initials;}}
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Badge: Type (Count/Dot/Status) is genuinely structural, not a style-
    // only difference - "Status" renders a completely different root
    // (.badge-demo-status-row, no host icon at all) from "Count"/"Dot"
    // (.badge-demo-host-wrap + an overlaid pill). The override-diff model
    // only patches style/text on matching node IDs across variants, so
    // crossing Type into real Figma variants would silently show the wrong
    // layout whenever Appearance is switched away from whichever type was
    // captured - the same reasoning Button uses to keep Content/icon
    // placement out of its own crossed axis. So Appearance stays an
    // editable, non-crossed property (frozen to whichever type was active
    // at capture time) while State x Size cross normally. Count/Status
    // label are each bound directly from the base capture only when that
    // node actually exists there (i.e. only when Appearance happens to be
    // "Count" or "Status" respectively) - this is the same mutual-
    // exclusivity-by-structure limit as Select's State-driven error
    // message, just driven by Appearance instead of State. Max count stays
    // an orphan editable property either way, since Figma can't run the
    // "+N" overflow math itself.
    function captureBadgeProperties(){
      const M=window.ADSComponentContract;
      const sizeControl=document.querySelector('[data-role="badge-size-mount"]');
      const countInput=document.querySelector('[data-role="badge-count"]');
      const maxInput=document.querySelector('[data-role="badge-max"]');
      const labelInput=document.querySelector('[data-role="badge-label"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state,originalConfig=selected.config;
      const sameGroup=entries.filter(e=>e.config===selected.config&&e.type===selected.type);
      const stateOptions=[...new Set(sameGroup.map(e=>e.state))];
      function optionLabelSet(control){
        if(!control)return new Set();
        return new Set([...control.querySelectorAll('.multiselect-options label')].map(row=>{
          const input=row.querySelector('input[type=checkbox]');
          return input?canonicalLabel(row.textContent.trim()):null;
        }).filter(Boolean));
      }
      const sizeLabels=optionLabelSet(sizeControl);
      const originalSizeLabel=sizeLabels.has(originalConfig)?originalConfig:null;
      const variants=[];let sizeOptions=[];const badgeSnaps=[];
      applyingFoundation=true;
      try{
        if(sizeControl){
          const all=sizeControl.querySelector('.multiselect-option-all input[type=checkbox]');
          if(all&&!all.checked){all.checked=true;all.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        const sweep=gatherEntries();
        const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
        for(const entry of sweep){
          const sizeLabel=sizeControl?(sizeLabels.has(entry.config)?entry.config:null):null;
          if(sizeControl&&!sizeLabel)continue;
          // Only the Count form is diffed against the base (Dot and Status are different layer trees); Dot rows are kept as snapshots for the
          // grafted dot, and the Status row (a separate inline dot-and-label layout, no host icon) is not part of this export.
          if(entry.type!==originalType){if(/dot/i.test(entry.type))badgeSnaps.push({when:{state:entry.state,size:sizeLabel},anatomy:snapshot(entry.root,'root',0)});continue;}
          if(sizeLabel)sizeOptions.push(sizeLabel);
          if(entry.config===originalConfig&&entry.state===originalState)continue;
          const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
          (function walk(n){
            const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
            if(baseNode){
              const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
              const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
              for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
              const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
              if(Object.keys(patch).length)overrides[n.id]=patch;
            }
            for(const child of n.children||[])walk(child);
          })(variantAnatomy);
          const when={state:entry.state};if(sizeLabel)when.size=sizeLabel;
          const variantName=[sizeLabel,entry.state].filter(Boolean).join(' / ');
          if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
        }
        sizeOptions=[...new Set(sizeOptions)];
      }finally{
        applyingFoundation=false;refresh();
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      const allTypes=[...new Set(entries.filter(e=>e.config===originalConfig).map(e=>e.type))];
      const appearanceLabels=allTypes.filter(l=>!/status/i.test(l));
      if(appearanceLabels.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:appearanceLabels,default:originalType});selection.appearance=originalType;}
      if(sizeControl&&sizeOptions.length){properties.push({id:'size',name:'Size',type:'options',options:sizeOptions,default:originalSizeLabel&&sizeOptions.includes(originalSizeLabel)?originalSizeLabel:sizeOptions[0]});selection.size=properties[properties.length-1].default;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const countNode=findPart(baseAnatomy,'countLabel');
      const statusLabelNode=findPart(baseAnatomy,'statusLabel');
      if(countNode){countNode.bind='count';const def=countNode.text||countInput?.value.trim()||'5';properties.push({id:'count',name:'Count',type:'text',default:def});selection.count=def;}
      if(statusLabelNode){statusLabelNode.bind='statusLabel';const def=labelInput?.value.trim()||statusLabelNode.text||'Active';properties.push({id:'statusLabel',name:'Status label',type:'text',default:def});selection.statusLabel=def;}
      if(maxInput){properties.push({id:'max',name:'Max count',type:'text',default:maxInput.value.trim()||'99'});selection.max=maxInput.value.trim()||'99';}

      // Badge, layer by layer. (1) The count pill is a container (pill background, padding and radius cannot live on a text layer) holding the number, and the
      // number is the bound text; (2) its text uses the caption style at both Sizes (it was 16px in an 18px pill); (3) the Dot form (a plain circle in place
      // of the pill) is harvested from its own rows and shown for Appearance = Dot with each State's colour and each Size's diameter; (4) the badge ring and
      // pill hug their content, and the ring is anchored 6px above and beyond the host's top-right corner, as on the page.
      {
        const findN=(n,id)=>{if(n.id===id)return n;for(const k of n.children||[])if(true){const r=findN(k,id);if(r)return r;}return null;};
        const labels=properties.find(p=>p.id==='appearance')?.options||[];
        const countLabel=labels.find(l=>/count/i.test(l)),dotLabel=labels.find(l=>/dot/i.test(l));
        const badge=findN(baseAnatomy,'badge'),pill=findN(baseAnatomy,'count');
        if(pill&&countLabel)pill.visibleWhen=[{property:'appearance',equals:countLabel}];
        const firstDot=dotLabel&&badgeSnaps.find(x=>findN(x.anatomy,'dot'));
        const dot=firstDot&&findN(firstDot.anatomy,'dot');
        if(badge&&dot&&!findN(baseAnatomy,'dot')){
          dot.visibleWhen=[{property:'appearance',equals:dotLabel}];
          badge.children.push(dot);
          const sameWhen=(a,b)=>a.state===b.state&&(a.size||null)===(b.size||null);
          for(const sn of badgeSnaps){
            const nd=findN(sn.anatomy,'dot');if(!nd)continue;
            const w={...sn.when,appearance:dotLabel};
            variants.push({id:'cv-dot-'+M.id([w.size,w.state].filter(Boolean).join(' / ')),name:'Dot / '+[w.size,w.state].filter(Boolean).join(' / '),when:w,overrides:{dot:{styles:{...nd.styles}}}});
          }
        }
        const strip=(n,keys)=>{if(!n)return;const st={...n.styles};for(const k of keys)delete st[k];n.styles=st;};
        // ring: hug, no stray left/bottom (computed values); keep top/right (-6px) as the anchor.
        for(const n of [badge]){if(n)n.styles={...n.styles,left:'auto',bottom:'auto'};}
        // The ring is a 2px border around the pill/dot (box-sizing border-box): Figma strokes sit INSIDE the frame, so the 2px is also given as padding or
        // the stroke would be painted over the pill. The pill keeps its 18px (Small: 16px) height - a fixed proportion - and only its width hugs the number.
        // The ring is painted as the frame's own fill (its 2px padding is the visible ring) instead of an inside stroke: stroke and padding could drift
        // apart in Figma and leave a gap between the ring and the pill. Pill and ring share the full radius, so it looks the same as the CSS border.
        if(badge)badge.styles={...badge.styles,paddingTop:'2px',paddingRight:'2px',paddingBottom:'2px',paddingLeft:'2px',backgroundColor:badge.styles.borderTopColor||badge.styles.borderColor,borderTopWidth:'0px',borderRightWidth:'0px',borderBottomWidth:'0px',borderLeftWidth:'0px',borderTopStyle:'none',borderRightStyle:'none',borderBottomStyle:'none',borderLeftStyle:'none'};
        strip(badge,['width','height']);strip(pill,['width']);
        {const lab=findN(baseAnatomy,'countLabel');if(lab){const st={...lab.styles};delete st.width;delete st.height;lab.styles=st;}}
        for(const v of variants){
          for(const id of ['badge','count','countLabel']){const o=v.overrides[id];if(o&&o.styles){const st={...o.styles};delete st.width;if(id!=='count')delete st.height;delete st.left;delete st.bottom;if(Object.keys(st).length)o.styles=st;else delete o.styles;if(!Object.keys(o).length)delete v.overrides[id];}}
        }
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Card: Appearance/State/Size/Corner radius already cross generically
    // via captureCrossedProperties(). Title/Body are bound directly from
    // the base capture (always present except in the Loading state, which
    // swaps them for skeleton placeholder bars - structural swap, so they
    // simply aren't found/bound if Loading happens to be selected at
    // capture time, same graceful degradation as everywhere else). Show
    // shadow toggles a CSS class/shadow effect on the card's own root, not
    // a separate layer's visibility - there's no established mechanism in
    // this contract model for binding a boolean to an effect rather than a
    // node's visibleWhen, so it stays an orphan editable property like
    // Tabs' Equal-width.
    function captureCardProperties(){
      // Media (With media) and the footer buttons (With actions) only exist in their own Appearance, so the base capture never has them. Each crossed
      // entry's media/footer subtree is collected here so it can be grafted on below, visible only for its Appearance, with per-State/Size/Radius overrides.
      const cardSnaps=[];
      const prevHook=crossedHook;
      crossedHook=(entry,anat,when)=>{cardSnaps.push({when:{...when},anat});if(prevHook)prevHook(entry,anat,when);};
      let built;
      try{built=captureCrossedProperties();}finally{crossedHook=prevHook;}
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      const titleInput=document.querySelector('[data-role="card-title"]');
      const bodyInput=document.querySelector('[data-role="card-body"]');
      const showShadowInput=document.querySelector('[data-role="card-show-shadow"]');

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const titleNode=findPart(anatomy,'title');
      const bodyNode=findPart(anatomy,'body');
      if(titleNode){titleNode.bind='title';const def=titleInput?.value.trim()||titleNode.text||'Card title';properties.push({id:'title',name:'Title',type:'text',default:def});selection.title=def;}
      if(bodyNode){bodyNode.bind='body';const def=bodyInput?.value.trim()||bodyNode.text||'Supporting card copy goes here.';properties.push({id:'body',name:'Body',type:'text',default:def});selection.body=def;}
      if(showShadowInput){properties.push({id:'showShadow',name:'Show shadow',type:'boolean',default:showShadowInput.checked});selection.showShadow=showShadowInput.checked;}

      {
        const M=window.ADSComponentContract;
        const appearanceLabelOf=s=>s.when.appearance;
        const findIn=(n,id)=>{if(n.id===id)return n;for(const c of n.children||[]){const r=findIn(c,id);if(r)return r;}return null;};
        const idsIn=n=>[n.id,...(n.children||[]).flatMap(idsIn)];
        const baseIds=new Set(idsIn(anatomy));
        // Sweep entries are crossed variants, so the original (base) cell was skipped - the first cell of each Appearance with the part supplies the template.
        const graftSpecs=[{id:'media',order:'before',match:/media/i},{id:'footer',order:'after',match:/action/i}];
        const grafted=[];
        for(const spec of graftSpecs){
          const snaps=cardSnaps.filter(s=>spec.match.test(appearanceLabelOf(s)||'')&&findIn(s.anat,spec.id));
          if(!snaps.length||baseIds.has(spec.id))continue;
          // template: prefer Rest / default size / first radius = same cell as base
          const tmplSnap=snaps.find(s=>/rest/i.test(s.when.state||''))||snaps[0];
          const tmpl=JSON.parse(JSON.stringify(findIn(tmplSnap.anat,spec.id)));
          tmpl.visibleWhen=[{property:'appearance',equals:appearanceLabelOf(tmplSnap)}];
          if(spec.order==='before')anatomy.children=[tmpl,...(anatomy.children||[])];else anatomy.children=[...(anatomy.children||[]),tmpl];
          // Hug the buttons (and footer height) instead of freezing their captured pixel sizes, so labels never clip or float.
          const unsize=n=>{if(['cancel','confirm','footer'].includes(n.id)){const st={...n.styles};if(n.id!=='footer')delete st.width;delete st.height;n.styles=st;}(n.children||[]).forEach(unsize);};unsize(tmpl);
          grafted.push({spec,tmpl,snaps});
        }
        for(const g of grafted){
          const tmplMap=new Map();(function w(n){tmplMap.set(n.id,n);(n.children||[]).forEach(w);})(g.tmpl);
          for(const s of g.snaps){
            const node=findIn(s.anat,g.spec.id);const patchSet={};
            (function walk(n){const b=tmplMap.get(n.id);
              if(b&&b.kind===n.kind){const styles={};for(const [k,v] of Object.entries(n.styles||{}))if(b.styles[k]!==v)styles[k]=v;if(['cancel','confirm','footer'].includes(n.id)){delete styles.height;if(n.id!=='footer')delete styles.width;}const patch={};if(Object.keys(styles).length)patch.styles=styles;if(n.text!==b.text)patch.text=n.text;if(Object.keys(patch).length)patchSet[n.id]=patch;}
              (n.children||[]).forEach(walk);})(node);
            if(!Object.keys(patchSet).length)continue;
            const key=JSON.stringify(s.when);
            let v=built.variants.find(x=>JSON.stringify(x.when)===key);
            if(!v){v={id:'cv-card-'+M.id(Object.values(s.when).join('-')),name:Object.values(s.when).join(' / '),when:{...s.when},overrides:{}};built.variants.push(v);}
            v.overrides={...v.overrides,...patchSet};
          }
        }
      }
      // The card hugs its content vertically. Its captured pixel height came from the browser's text metrics; Figma's text is wider or taller, so a fixed
      // height clipped the footer buttons and pushed the supporting text against the bottom border. Width stays fixed (240px).
      {
        const noHeight=n=>{if(n&&n.styles){const st={...n.styles};delete st.height;st.height='auto';n.styles=st;}};
        noHeight(anatomy);
        for(const v of built.variants){const o=v.overrides&&v.overrides[anatomy.id];if(o&&o.styles){const st={...o.styles};delete st.height;delete st.maxHeight;o.styles=st;}}
      }
      // Heading style (Heading 1 to 6) is a page-side choice: the chosen heading's type is captured into the title's own styles. It is not a Figma
      // variant axis, because six heading options x the existing State/Appearance/Size/Corner radius would exceed Figma's 1000-variant limit.
      const variants=[...built.variants];

      return {anatomy,properties,selection,variants};
    }
    // Collapse: Appearance/State/Size/Corner radius already cross
    // generically via captureCrossedProperties(). Each matrix cell is
    // actually a GROUP of two stacked panels (a static "collapsed" context
    // panel for stacking context, then the real state-driven panel) - only
    // the real panel's header/icon/body carry data-contract-part markers
    // (the context panel's own header text shares the same CSS class but
    // is never marked, so findPart() can't confuse them). Header text and
    // the chevron icon are always present in the real panel regardless of
    // State, bound/harvested directly; Body only exists structurally while
    // State is "Expanded" - harvested from that State specifically, same
    // single-value visibleWhen constraint as Select's error message/
    // Divider's label.
    function captureCollapseProperties(){
      // The body only exists in the Expanded State, so the crossed sweep can't diff it against the base; its per-Size/Appearance/Radius styles (padding)
      // are collected from each Expanded cell here and merged into the variants after the body is grafted below.
      const bodySnaps=[];const prevHook=crossedHook;
      crossedHook=(entry,anat,when)=>{bodySnaps.push({when:{...when},anat});if(prevHook)prevHook(entry,anat,when);};
      let built;try{built=captureCrossedProperties();}finally{crossedHook=prevHook;}
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      const headerInput=document.querySelector('[data-role="collapse-header"]');
      const bodyInput=document.querySelector('[data-role="collapse-body"]');
      const showIconInput=document.querySelector('[data-role="collapse-show-icon"]');

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const headerNode=findPart(anatomy,'header');
      const iconNode=findPart(anatomy,'icon');
      if(headerNode){headerNode.bind='header';const def=headerInput?.value.trim()||headerNode.text||'Section header';properties.push({id:'header',name:'Header text',type:'text',default:def});selection.header=def;}
      if(iconNode){
        const originalShowIcon=showIconInput?.checked??true;
        iconNode.visibleWhen=[{property:'showIcon',equals:true}];
        properties.push({id:'showIcon',name:'Show icon',type:'boolean',default:originalShowIcon});
        selection.showIcon=originalShowIcon;
      }

      const stateLabels=built.properties.find(p=>p.id==='state')?.options||[];
      const expandedLabel=stateLabels.find(l=>/expanded/i.test(l));
      if(expandedLabel){
        const originalType=selected.type,originalConfig=selected.config;
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===expandedLabel);
        const bodyNode=entry&&findPart(snapshot(entry.root,'root',0),'body');
        if(bodyNode){
          bodyNode.bind='body';
          bodyNode.visibleWhen=[{property:'state',equals:expandedLabel}];
          if(!findPart(anatomy,'body')){
            const statePanel=anatomy.children?.[1];
            if(statePanel)statePanel.children=[...(statePanel.children||[]),bodyNode];
          }
          {
            const find=(n,id)=>{if(n.id===id)return n;for(const c of n.children||[]){const r=find(c,id);if(r)return r;}return null;};
            const tmpl=find(anatomy,'body');
            const all=[];(function w(n){all.push(n);(n.children||[]).forEach(w);})(tmpl);const tmap=new Map(all.map(n=>[n.id,n]));
            for(const s of bodySnaps){
              const node=find(s.anat,'body');if(!node)continue;const patchSet={};
              (function walk(n){const b=tmap.get(n.id);if(b&&b.kind===n.kind){const styles={};for(const [k,v] of Object.entries(n.styles||{}))if(b.styles[k]!==v&&k!=='height'&&k!=='width')styles[k]=v;if(Object.keys(styles).length)patchSet[n.id]={styles};}(n.children||[]).forEach(walk);})(node);
              if(!Object.keys(patchSet).length)continue;
              const key=JSON.stringify(s.when);let v=built.variants.find(x=>JSON.stringify(x.when)===key);
              if(!v){v={id:'cv-collapse-'+window.ADSComponentContract.id(Object.values(s.when).join('-')),name:Object.values(s.when).join(' / '),when:{...s.when},overrides:{}};built.variants.push(v);}
              v.overrides={...v.overrides,...patchSet};
            }
          }
          const def=bodyInput?.value.trim()||bodyNode.text||'Panel body content goes here.';
          properties.push({id:'body',name:'Body text',type:'text',default:def});
          selection.body=def;
        }
      }

      // Panels, header rows and the body hug their content vertically. Their captured pixel heights came from the browser's text metrics, so a fixed height
      // clipped the body text (panels clip overflow) and left uneven gaps in Figma. Only the fixed-size chevron graphic keeps its height.
      {
        const keep=n=>n.tag==='svg'||n.id==='icon'||n.id==='ctxIcon'||n.kind==='icon'||/^(icon|ctxIcon)-/.test(n.id);
        const skip=new Set();(function mark(n){if(keep(n))skip.add(n.id);(n.children||[]).forEach(mark);})(anatomy);
        (function strip(n){if(!skip.has(n.id)&&n.styles){const st={...n.styles};st.height='auto';delete st.maxHeight;n.styles=st;}(n.children||[]).forEach(strip);})(anatomy);
        for(const v of built.variants)for(const [id,o] of Object.entries(v.overrides||{})){if(!skip.has(id)&&o.styles&&'height'in o.styles){const st={...o.styles};delete st.height;o.styles=st;}}
        // The body's own text must fill the body's width and wrap below the heading instead of running past the panel (opt-in marker read by the plugin).
        (function mark(n){if(n.id==='body')n.styles={...n.styles,'--ads-fill-text':'1'};(n.children||[]).forEach(mark);})(anatomy);
        // The group is a fixed 260px column; stating the width in pixels keeps it Fixed in Figma so Fill-width panels have something to fill.
        anatomy.styles={...anatomy.styles,width:'260px'};
      }
      return {anatomy,properties,selection,variants:built.variants};
    }
    // Description combines a manual single-select drive (Columns is a
    // plain <select>, like Modal/Avatar's own extra axis) with the usual
    // Size multiselect and Appearance/State crossing (both already coexist
    // per Columns value, same table convention as everywhere else).
    // Section title only exists structurally while State is "With title" -
    // harvested from that row specifically, same single-value visibleWhen
    // constraint as Collapse's Body/Select's error message.
    function captureDescriptionProperties(){
      const M=window.ADSComponentContract;
      const sizeControl=document.querySelector('[data-role="description-size-mount"]');
      const columnsSelect=document.querySelector('[data-role="description-columns-select"]');
      const titleInput=document.querySelector('[data-role="description-title"]');

      function optionLabelSet(control){
        if(!control)return new Set();
        return new Set([...control.querySelectorAll('.multiselect-options label')].map(row=>{
          const input=row.querySelector('input[type=checkbox]');
          return input?canonicalLabel(row.textContent.trim()):null;
        }).filter(Boolean));
      }
      const sizeLabels=optionLabelSet(sizeControl);
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state,originalConfig=selected.config;
      const originalSizeLabel=sizeLabels.has(originalConfig)?originalConfig:null;
      const originalColumns=columnsSelect?columnsSelect.value:null;
      const columnsOptionEls=columnsSelect?[...columnsSelect.options]:[null];
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const variants=[];let typeOptions=[],stateOptions=[],sizeOptions=[],columnsOptions=[];
      applyingFoundation=true;
      try{
        if(sizeControl){
          const all=sizeControl.querySelector('.multiselect-option-all input[type=checkbox]');
          if(all&&!all.checked){all.checked=true;all.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        for(const colOpt of columnsOptionEls){
          const colVal=colOpt?colOpt.value:null,colLabel=colOpt?colOpt.textContent.trim():null;
          if(colOpt&&columnsSelect.value!==colVal){columnsSelect.value=colVal;columnsSelect.dispatchEvent(new Event('change',{bubbles:true}));}
          for(const entry of gatherEntries()){
            const sizeLabel=sizeControl?(sizeLabels.has(entry.config)?entry.config:null):null;
            if(sizeControl&&!sizeLabel)continue;
            typeOptions.push(entry.type);stateOptions.push(entry.state);if(sizeLabel)sizeOptions.push(sizeLabel);if(colLabel)columnsOptions.push(colLabel);
            if(entry.type===originalType&&entry.state===originalState&&entry.config===originalConfig&&(!colOpt||colVal===originalColumns))continue;
            const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
            (function walk(n){
              const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
              if(baseNode){
                const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
                const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
                for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
                const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
                if(Object.keys(patch).length)overrides[n.id]=patch;
              }
              for(const child of n.children||[])walk(child);
            })(variantAnatomy);
            const when={state:entry.state,appearance:entry.type};if(sizeLabel)when.size=sizeLabel;if(colLabel)when.columns=colLabel;
            const variantName=[entry.type,sizeLabel,colLabel,entry.state].filter(Boolean).join(' / ');
            if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
          }
        }
      }finally{
        if(columnsSelect&&columnsSelect.value!==originalColumns){columnsSelect.value=originalColumns;columnsSelect.dispatchEvent(new Event('change',{bubbles:true}));}
        applyingFoundation=false;refresh();
      }
      typeOptions=[...new Set(typeOptions)];stateOptions=[...new Set(stateOptions)];sizeOptions=[...new Set(sizeOptions)];columnsOptions=[...new Set(columnsOptions)];
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:typeOptions.includes(originalType)?originalType:typeOptions[0]});selection.appearance=properties[properties.length-1].default;}
      if(sizeOptions.length>1){properties.push({id:'size',name:'Size',type:'options',options:sizeOptions,default:sizeOptions.includes(originalSizeLabel)?originalSizeLabel:sizeOptions[0]});selection.size=properties[properties.length-1].default;}
      if(columnsOptions.length>1){properties.push({id:'columns',name:'Columns',type:'options',options:columnsOptions,default:columnsOptions.includes(originalColumns)?originalColumns:columnsOptions[0]});selection.columns=properties[properties.length-1].default;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const stateLabels=stateOptions;
      const titleStateLabel=stateLabels.find(l=>/with title/i.test(l));
      let titleNode=findPart(baseAnatomy,'title');
      if(!titleNode&&titleStateLabel){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===titleStateLabel);
        titleNode=entry&&findPart(snapshot(entry.root,'root',0),'title');
        if(titleNode)baseAnatomy.children.unshift(titleNode);
      }
      if(titleNode){
        titleNode.bind='title';
        if(titleStateLabel)titleNode.visibleWhen=[{property:'state',equals:titleStateLabel}];
        const def=titleInput?.value.trim()||titleNode.text||'Account details';
        properties.push({id:'title',name:'Section title',type:'text',default:def});
        selection.title=def;
      }

      // Items 1-3: Label n / Placeholder text n are text properties bound to the item's label and value layers.
      for(let i=1;i<=3;i++){
        for(const kind of ['label','value']){
          const node=findPart(baseAnatomy,kind+i),input=document.querySelector('[data-role="description-'+kind+'-'+i+'"]');
          if(!node)continue;
          node.bind=kind+i;const def=input?.value.trim()||node.text||'';
          properties.push({id:kind+i,name:(kind==='label'?'Label ':'Placeholder text ')+i,type:'text',default:def});selection[kind+i]=def;
        }
      }
      // The label/value grid wraps (Figma wrap auto layout); opt-in marker read by the plugin so other wrapping rows (Breadcrumb) keep hugging.
      (function mark(n){if(n.id==='grid')n.styles={...n.styles,'--ads-wrap':'1'};(n.children||[]).forEach(mark);})(baseAnatomy);
      baseAnatomy.styles={...baseAnatomy.styles,width:'300px','--ads-fixed-width':'1'};
      // Every panel, grid and cell hugs its content vertically: captured pixel heights came from the browser's text metrics, so a fixed height made
      // cells overlap or clip once Figma's text measured differently. Widths (the column widths) stay fixed.
      {
        (function strip(n){if(n.kind!=='text'&&n.styles){const st={...n.styles};st.height='auto';delete st.maxHeight;n.styles=st;}(n.children||[]).forEach(strip);})(baseAnatomy);
        for(const v of variants)for(const o of Object.values(v.overrides||{}))if(o.styles&&'height'in o.styles){const st={...o.styles};delete st.height;o.styles=st;}
      }
      // Heading style (Heading 1 to 6) is a page-side choice captured into the section title's own styles (not a Figma variant axis).

      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Empty: same no-native-control-to-drive manual sweep as Tooltip/Tour -
    // every Appearance/State combination already coexists in one table.
    // Title is always present, bound directly; Description only exists
    // structurally for every State but "Title only", Action only for
    // "With action" - both harvested from a specific row when the base
    // capture doesn't already have them, same single-value visibleWhen
    // constraint used throughout (Collapse's Body, Alert's Action label).
    // There is no Size concept anywhere in this component today (no size
    // scale in its CSS/JS at all) - nothing to expose as a property until
    // the component itself grows one, called out in the dispatcher notes.
    function captureEmptyProperties(){
      const M=window.ADSComponentContract;
      const titleInput=document.querySelector('[data-role="empty-title"]');
      const descriptionInput=document.querySelector('[data-role="empty-description"]');
      const actionLabelInput=document.querySelector('[data-role="empty-action-label"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const titleNode=findPart(baseAnatomy,'title');
      if(titleNode){titleNode.bind='title';const def=titleInput?.value.trim()||titleNode.text||'No projects yet';properties.push({id:'title',name:'Title',type:'text',default:def});selection.title=def;}

      const titleOnlyLabel=stateOptions.find(l=>/title only/i.test(l));
      const descStateLabel=stateOptions.find(l=>!/title only/i.test(l));
      let descriptionNode=findPart(baseAnatomy,'description');
      if(!descriptionNode&&descStateLabel){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.state===descStateLabel);
        descriptionNode=entry&&findPart(snapshot(entry.root,'root',0),'description');
        if(descriptionNode){const at=baseAnatomy.children.findIndex(c=>c.id==='title');baseAnatomy.children.splice(at>=0?at+1:baseAnatomy.children.length,0,descriptionNode);}
      }
      if(descriptionNode){
        descriptionNode.bind='description';
        if(titleOnlyLabel)descriptionNode.visibleWhen=[{property:'state',equals:titleOnlyLabel,not:true}];
        const def=descriptionInput?.value.trim()||descriptionNode.text||'Create your first project to get started.';
        properties.push({id:'description',name:'Description',type:'text',default:def});
        selection.description=def;
      }

      const actionStateLabel=stateOptions.find(l=>/with action/i.test(l));
      let actionNode=findPart(baseAnatomy,'action');
      if(!actionNode&&actionStateLabel){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.state===actionStateLabel);
        actionNode=entry&&findPart(snapshot(entry.root,'root',0),'action');
        if(actionNode)baseAnatomy.children.push(actionNode);
      }
      if(actionNode){
        actionNode.bind='actionLabel';
        if(actionStateLabel)actionNode.visibleWhen=[{property:'state',equals:actionStateLabel}];
        const def=actionLabelInput?.value.trim()||actionNode.text||'Create project';
        properties.push({id:'actionLabel',name:'Action label',type:'text',default:def});
        selection.actionLabel=def;
      }

      // The action button hugs its label (a captured pixel width clipped the label) and its text sits centred; the panel hugs its content too.
      {
        const unsize=(n,ids)=>{if(ids.includes(n.id)&&n.styles){const st={...n.styles};delete st.width;st.height='auto';st.display='flex';st.justifyContent='center';st.alignItems='center';st.textAlign='center';n.styles=st;}(n.children||[]).forEach(c=>unsize(c,ids));};
        unsize(baseAnatomy,['action']);
        for(const v of variants){const o=v.overrides&&v.overrides.action;if(o&&o.styles){const st={...o.styles};delete st.width;delete st.height;o.styles=st;}}
        const root=baseAnatomy;root.styles={...root.styles,height:'auto'};
        for(const v of variants){const o=v.overrides&&v.overrides[root.id];if(o&&o.styles){const st={...o.styles};delete st.height;o.styles=st;}}
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Image combines a manual single-select drive (Aspect ratio is a plain
    // <select>, like Description's Columns - purely a style/dimension
    // difference, not structural) with the usual Corner radius multiselect
    // and Appearance/State crossing. Caption only exists structurally while
    // Appearance is "With caption" - harvested from that Appearance
    // specifically when the base capture doesn't already have it, same
    // single-value visibleWhen constraint as Divider's label.
    function captureImageProperties(){
      const M=window.ADSComponentContract;
      const radiusControl=document.querySelector('[data-role="image-radius-mount"]');
      const aspectSelect=document.querySelector('[data-role="image-aspect-select"]');
      const captionInput=document.querySelector('[data-role="image-caption"]');

      function optionLabelSet(control){
        if(!control)return new Set();
        return new Set([...control.querySelectorAll('.multiselect-options label')].map(row=>{
          const input=row.querySelector('input[type=checkbox]');
          return input?canonicalLabel(row.textContent.trim()):null;
        }).filter(Boolean));
      }
      const radiusLabels=optionLabelSet(radiusControl);
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state,originalConfig=selected.config;
      const originalRadiusLabel=radiusLabels.has(originalConfig)?originalConfig:null;
      const originalAspect=aspectSelect?aspectSelect.value:null;
      const aspectOptionEls=aspectSelect?[...aspectSelect.options]:[null];
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const variants=[];let typeOptions=[],stateOptions=[],radiusOptions=[],aspectOptions=[];
      applyingFoundation=true;
      try{
        if(radiusControl){
          const all=radiusControl.querySelector('.multiselect-option-all input[type=checkbox]');
          if(all&&!all.checked){all.checked=true;all.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        for(const aspectOpt of aspectOptionEls){
          const aspectVal=aspectOpt?aspectOpt.value:null,aspectLabel=aspectOpt?aspectOpt.textContent.trim():null;
          if(aspectOpt&&aspectSelect.value!==aspectVal){aspectSelect.value=aspectVal;aspectSelect.dispatchEvent(new Event('change',{bubbles:true}));}
          for(const entry of gatherEntries()){
            const radiusLabel=radiusControl?(radiusLabels.has(entry.config)?entry.config:null):null;
            if(radiusControl&&!radiusLabel)continue;
            typeOptions.push(entry.type);stateOptions.push(entry.state);if(radiusLabel)radiusOptions.push(radiusLabel);if(aspectLabel)aspectOptions.push(aspectLabel);
            if(entry.type===originalType&&entry.state===originalState&&entry.config===originalConfig&&(!aspectOpt||aspectVal===originalAspect))continue;
            const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
            (function walk(n){
              const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
              if(baseNode){
                const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
                const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
                for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
                const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
                if(Object.keys(patch).length)overrides[n.id]=patch;
              }
              for(const child of n.children||[])walk(child);
            })(variantAnatomy);
            const when={state:entry.state,appearance:entry.type};if(radiusLabel)when.radius=radiusLabel;if(aspectLabel)when.aspect=aspectLabel;
            const variantName=[entry.type,aspectLabel,radiusLabel,entry.state].filter(Boolean).join(' / ');
            if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
          }
        }
      }finally{
        if(aspectSelect&&aspectSelect.value!==originalAspect){aspectSelect.value=originalAspect;aspectSelect.dispatchEvent(new Event('change',{bubbles:true}));}
        applyingFoundation=false;refresh();
      }
      typeOptions=[...new Set(typeOptions)];stateOptions=[...new Set(stateOptions)];radiusOptions=[...new Set(radiusOptions)];aspectOptions=[...new Set(aspectOptions)];
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:typeOptions.includes(originalType)?originalType:typeOptions[0]});selection.appearance=properties[properties.length-1].default;}
      if(radiusOptions.length>1){properties.push({id:'radius',name:'Corner radius',type:'options',options:radiusOptions,default:radiusOptions.includes(originalRadiusLabel)?originalRadiusLabel:radiusOptions[0]});selection.radius=properties[properties.length-1].default;}
      if(aspectOptions.length>1){properties.push({id:'aspect',name:'Aspect ratio',type:'options',options:aspectOptions,default:aspectOptions.includes(originalAspect)?originalAspect:aspectOptions[0]});selection.aspect=properties[properties.length-1].default;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const typeLabels=typeOptions;
      const captionTypeLabel=typeLabels.find(l=>/with caption/i.test(l));
      let captionNode=findPart(baseAnatomy,'caption');
      if(!captionNode&&captionTypeLabel){
        const entry=gatherEntries().find(e=>e.type===captionTypeLabel&&e.state===originalState&&e.config===originalConfig);
        captionNode=entry&&findPart(snapshot(entry.root,'root',0),'caption');
        if(captionNode)baseAnatomy.children.push(captionNode);
      }
      if(captionNode){
        captionNode.bind='caption';
        if(captionTypeLabel)captionNode.visibleWhen=[{property:'appearance',equals:captionTypeLabel}];
        const def=captionInput?.value.trim()||captionNode.text||'Product photo';
        properties.push({id:'caption',name:'Caption text',type:'text',default:def});
        selection.caption=def;
      }

      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // List: Appearance/State/Size/Corner radius already cross generically
    // via captureFormFieldProperties()/captureCrossedProperties() (List has
    // no label/required/supporting/error controls at all, so the generic
    // function's early-return path already returns the crossed base
    // unchanged - nothing more to harvest there). Show dividers toggles a
    // border style across every row, not one node's visibility - same
    // orphan-editable-property treatment as Card's Show shadow/Tabs'
    // Equal-width.
    function postProcessTag(built,snaps){
      const M=window.ADSComponentContract;
      const findPart=(n,id)=>{if(n.id===id)return n;for(const c of n.children||[]){const r=findPart(c,id);if(r)return r;}return null;};
      const stateLabels=built.properties.find(p=>p.id==='state')?.options||[];
      const removable=stateLabels.find(l=>/removable/i.test(l));
      const anatomy=built.anatomy;
      if(removable&&!findPart(anatomy,'remove')){
        const cands=snaps.filter(s=>s.state===removable&&findPart(s.anat,'remove'));
        if(cands.length){
          const tmplSnap=cands.find(s=>/default/i.test(s.when.appearance||''))||cands[0];
          const tmpl=JSON.parse(JSON.stringify(findPart(tmplSnap.anat,'remove')));tmpl.visibleWhen=[{property:'state',equals:removable}];
          anatomy.children=[...(anatomy.children||[]),tmpl];
          const tmap=new Map();(function w(n){tmap.set(n.id,n);(n.children||[]).forEach(w);})(tmpl);
          for(const s of cands){
            const node=findPart(s.anat,'remove');const patchSet={};
            (function walk(n){const b=tmap.get(n.id);if(b&&b.kind===n.kind){const styles={};for(const [k,v] of Object.entries(n.styles||{}))if(b.styles[k]!==v)styles[k]=v;const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(patch).length)patchSet[n.id]=patch;}(n.children||[]).forEach(walk);})(node);
            if(!Object.keys(patchSet).length)continue;
            const key=JSON.stringify(s.when);let v=built.variants.find(x=>JSON.stringify(x.when)===key);
            if(!v){v={id:'cv-tag-'+M.id(Object.values(s.when).join('-')),name:Object.values(s.when).join(' / '),when:{...s.when},overrides:{}};built.variants.push(v);}
            v.overrides={...v.overrides,...patchSet};
          }
        }
      }
      // The chip hugs its label (and the remove button): a captured pixel size would clip the label or leave extra space.
      const hug=n=>{if(n&&n.styles&&n.tag!=='svg'&&n.id!=='remove'&&n.id!=='remove-icon'&&!/^remove-icon/.test(n.id)){const st={...n.styles};delete st.width;delete st.height;n.styles=st;}(n.children||[]).forEach(hug);};hug(anatomy);
      for(const v of built.variants)for(const [id,o] of Object.entries(v.overrides||{}))if(id!=='remove'&&!/^remove-icon/.test(id)&&o.styles&&('width' in o.styles||'height' in o.styles)){const st={...o.styles};delete st.width;delete st.height;o.styles=st;}
    }
    function captureTimelineProperties(){
      const M=window.ADSComponentContract;
      const tlSnaps=[];const prevHook=crossedHook;
      crossedHook=(entry,anat,when)=>{tlSnaps.push({when:{...when},state:entry.state,type:entry.type,anat});if(prevHook)prevHook(entry,anat,when);};
      let built;try{built=captureFormFieldProperties();}finally{crossedHook=prevHook;}
      const anatomy=built.anatomy,properties=[...built.properties],selection={...built.selection};
      const findPart=(n,id)=>{if(n.id===id)return n;for(const c of n.children||[]){const r=findPart(c,id);if(r)return r;}return null;};
      const stateOpt=properties.find(p=>p.id==='state')?.options||[],appOpt=properties.find(p=>p.id==='appearance')?.options||[];
      const S=re=>stateOpt.find(l=>re.test(l)),A=re=>appOpt.find(l=>re.test(l));
      const pendingL=S(/pending/i),loadingL=S(/loading/i),emptyL=S(/empty/i),altL=A(/alternate/i),horizL=A(/horizontal/i);
      // Timeline has no size/radius control, so the crossed sweep never reports its cells: snapshot every State x Appearance cell directly.
      tlSnaps.length=0;
      for(const e of gatherEntries())tlSnaps.push({when:{state:e.state,appearance:e.type},state:e.state,type:e.type,anat:snapshot(e.root,'root',0)});
      const eq=(p,l)=>({property:p,equals:l}),not=(p,l)=>({property:p,equals:l,not:true});
      const grafts=[];
      const graft=(id,parentId,at,vis,pred)=>{
        const parent=findPart(anatomy,parentId);if(!parent||findPart(anatomy,id))return;
        const snaps=tlSnaps.filter(s=>pred(s)&&findPart(s.anat,id));if(!snaps.length)return;
        const t=snaps.find(s=>/default/i.test(s.type)&&/default|with/i.test(s.state))||snaps[0];
        const tmpl=JSON.parse(JSON.stringify(findPart(t.anat,id)));tmpl.visibleWhen=vis;
        parent.children=at==='start'?[tmpl,...(parent.children||[])]:[...(parent.children||[]),tmpl];grafts.push({id,tmpl,snaps});
      };
      if(pendingL)graft('item-3','root','end',[eq('state',pendingL)],s=>s.state===pendingL);
      for(let i=0;i<4;i++){
        if(altL)graft('spacer-'+i,'item-'+i,'start',[eq('appearance',altL)],s=>s.type===altL);
        if(horizL){
          graft('prev-'+i,'marker-'+i,'start',[eq('appearance',horizL)],s=>s.type===horizL);
          graft('endcap-'+i,'marker-'+i,'end',[eq('appearance',horizL),...(i===2&&pendingL?[not('state',pendingL)]:[])],s=>s.type===horizL&&(i!==2||s.state!==pendingL));
        }
      }
      if(pendingL)graft('connector-2','marker-2','end',[eq('state',pendingL)],s=>s.state===pendingL);
      // Loading / Empty replace the events; the items hide for them and the message parts are shown only there.
      for(const [label,id] of [[loadingL,'timeline-events-loading'],[emptyL,'timeline-events-empty']])if(label)graft(id,'root','end',[eq('state',label)],s=>s.state===label);
      for(let i=0;i<3;i++){const item=findPart(anatomy,'item-'+i);if(item){const rules=[loadingL,emptyL].filter(Boolean).map(l=>not('state',l));item.visibleWhen=[...(item.visibleWhen||[]),...rules];}}
      // State icons: the dot is swapped for a check icon when "State icons" is on. Harvest the icons by switching it on for a moment.
      const showInput=document.querySelector('[data-role="timeline-show-icons"]');
      if(showInput&&!findPart(anatomy,'icon-0')){
        const was=showInput.checked;let iconSnaps=[];
        applyingFoundation=true;
        try{
          if(!was){showInput.checked=true;showInput.dispatchEvent(new Event('change',{bubbles:true}));window.ADS_flushRenders?.();}
          for(const st of stateOpt.filter(l=>l!==loadingL&&l!==emptyL)){const e=gatherEntries().find(x=>x.state===st&&x.type===(appOpt.find(l=>/default/i.test(l))||selected.type));if(e)iconSnaps.push({state:st,anat:snapshot(e.root,'root',0)});}
          if(!was){showInput.checked=false;showInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }finally{applyingFoundation=false;refresh();}
        for(let i=0;i<4;i++){
          const base=iconSnaps.find(s=>findPart(s.anat,'icon-'+i));if(!base)continue;
          const parent=findPart(anatomy,'marker-'+i);if(!parent)continue;
          const tmpl=JSON.parse(JSON.stringify(findPart(base.anat,'icon-'+i)));tmpl.visibleWhen=[eq('marker','Icon')];
          const dot=findPart(anatomy,'dot-'+i);if(dot&&i<3)dot.visibleWhen=[eq('marker','Dot')];
          const dotIdx=dot?parent.children.indexOf(dot):-1;
          parent.children=dotIdx>=0?[...parent.children.slice(0,dotIdx+1),tmpl,...parent.children.slice(dotIdx+1)]:[tmpl,...parent.children];
          const tmap=new Map();(function w(n){tmap.set(n.id,n);(n.children||[]).forEach(w);})(tmpl);
          for(const s of iconSnaps){const node=findPart(s.anat,'icon-'+i);if(!node)continue;const patchSet={};
            (function walk(n){const b=tmap.get(n.id);if(b&&b.kind===n.kind){const styles={};for(const [k,v] of Object.entries(n.styles||{}))if(b.styles[k]!==v)styles[k]=v;const attributes={};for(const [k,v] of Object.entries(n.attributes||{}))if(b.attributes[k]!==v)attributes[k]=v;const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(Object.keys(patch).length)patchSet[n.id]=patch;}(n.children||[]).forEach(walk);})(node);
            if(!Object.keys(patchSet).length)continue;
            const when={state:s.state};const key=JSON.stringify(when);let v=built.variants.find(x=>JSON.stringify(x.when)===key);
            if(!v){v={id:'cv-tl-'+M.id('icons-'+s.state),name:'State icons / '+s.state,when,overrides:{}};built.variants.push(v);}
            v.overrides={...v.overrides,...patchSet};
          }
        }
      }
      // "State icons" swaps the dot for an icon. Figma can only show/hide a layer from a boolean (it cannot hide the dot when the icon is on), so it
      // becomes a two-value Marker property (Dot / Icon): each master shows exactly one of them.
      {
        const bi=properties.findIndex(p=>p.id==='showIcons');
        if(bi>=0&&findPart(anatomy,'icon-0')){const was=Boolean(selection.showIcons);properties.splice(bi,1,{id:'marker',name:'Marker',type:'options',options:['Dot','Icon'],default:was?'Icon':'Dot'});delete selection.showIcons;selection.marker=was?'Icon':'Dot';}
      }
      for(const g of grafts){
        const tmap=new Map();(function w(n){tmap.set(n.id,n);(n.children||[]).forEach(w);})(g.tmpl);
        for(const s of g.snaps){
          const node=findPart(s.anat,g.id);const patchSet={};
          (function walk(n){const b=tmap.get(n.id);if(b&&b.kind===n.kind){const styles={};for(const [k,v] of Object.entries(n.styles||{}))if(b.styles[k]!==v)styles[k]=v;const patch={};if(Object.keys(styles).length)patch.styles=styles;if(n.text!==b.text)patch.text=n.text;if(Object.keys(patch).length)patchSet[n.id]=patch;}(n.children||[]).forEach(walk);})(node);
          if(!Object.keys(patchSet).length)continue;
          const key=JSON.stringify(s.when);let v=built.variants.find(x=>JSON.stringify(x.when)===key);
          if(!v){v={id:'cv-tl-'+M.id(Object.values(s.when).join('-')),name:Object.values(s.when).join(' / '),when:{...s.when},overrides:{}};built.variants.push(v);}
          v.overrides={...v.overrides,...patchSet};
        }
      }
      // Everything hugs its content vertically; only the marks (dot, icon, connector, spacer) keep their own sizes.
      {
        const keep=id=>/^(dot|icon|connector|prev|endcap|spacer)-/.test(id)||id==='timeline-events-loading';
        (function strip(n){if(n.kind!=='text'&&n.styles&&!keep(n.id)&&n.tag!=='svg'&&!/^icon-/.test(n.id)){const st={...n.styles};st.height='auto';delete st.maxHeight;n.styles=st;}(n.children||[]).forEach(strip);})(anatomy);
        for(const v of built.variants)for(const [id,o] of Object.entries(v.overrides||{}))if(!keep(id)&&!/^icon-/.test(id)&&o.styles&&'height' in o.styles){const st={...o.styles};delete st.height;o.styles=st;}
        anatomy.styles={...anatomy.styles,'--ads-fixed-width':'1'};
        // A vertical connector fills the marker column (its captured height was whatever the item measured in the browser); only Horizontal has a fixed 2px line.
        const horizLabel=horizL;
        (function conn(n){if(/^connector-\d$/.test(n.id)&&n.styles){n.styles={...n.styles,height:'24px'};}(n.children||[]).forEach(conn);})(anatomy);
        // The marker column is only as tall as its dot and stretches to the item's height, so the connector under the dot runs all the way down to the next
        // dot (a hugging marker stayed short and left the line floating). Horizontal markers are a fixed 16px row so every dot sits on one baseline.
        (function mk(n){if(/^marker-\d$/.test(n.id)&&n.styles)n.styles={...n.styles,height:'10px'};(n.children||[]).forEach(mk);})(anatomy);
        for(const v of built.variants){if(v.when.appearance!==horizLabel)continue;for(let i=0;i<4;i++){const o=v.overrides['marker-'+i]||(v.overrides['marker-'+i]={});o.styles={...(o.styles||{}),height:'16px'};}}
        // The text block is always a vertical stack (a lone title, like the Pending placeholder's, would otherwise be read as a one-line run).
        (function col(n){if(/^content-\d$/.test(n.id)&&n.styles)n.styles={...n.styles,display:'flex',flexDirection:'column'};(n.children||[]).forEach(col);})(anatomy);
        for(const v of built.variants){if(v.when.appearance===horizLabel)continue;for(const [id,o] of Object.entries(v.overrides||{}))if(/^connector-\d$/.test(id)&&o.styles&&'height' in o.styles){const st={...o.styles};delete st.height;o.styles=st;}}
      }
      return {anatomy,properties,selection,variants:built.variants};
    }
    function captureListProperties(){
      // Avatar / View action / skeleton placeholders only exist in some States, and positional ids shifted between States (the text column was
      // root-0-0 in Default but root-0-1 with an avatar). Rows now carry stable parts; each State-only part is collected here and grafted below.
      const listSnaps=[];const prevListHook=crossedHook;
      crossedHook=(entry,anat,when)=>{listSnaps.push({when:{...when},state:entry.state,anat});if(prevListHook)prevListHook(entry,anat,when);};
      let built;try{built=captureFormFieldProperties();}finally{crossedHook=prevListHook;}
      const properties=[...built.properties];const selection={...built.selection};
      const showDividersInput=document.querySelector('[data-role="list-show-dividers"]');
      if(showDividersInput){
        properties.push({id:'showDividers',name:'Show dividers',type:'boolean',default:showDividersInput.checked});
        selection.showDividers=showDividersInput.checked;
      }
      const anatomy=built.anatomy;
      // Empty replaces the row stack entirely with a single centered,
      // dimmed message (list-detail.js's buildListField()) - structurally
      // nothing like a normal row (no title/description/avatar), so it has
      // no id in whatever State the base capture happens to use, and the
      // generic crossed-variant diff inside captureFormFieldProperties()/
      // captureCrossedProperties() above can never represent it - same
      // limitation Transfer's own source-status/target-status slot hits for
      // its own Loading/Empty/No Results states. Scan every State row's own
      // rendered DOM for the stable data-contract-part="list-empty" marker,
      // regardless of which State the base snapshot actually used, harvest
      // it, and graft it onto the base anatomy as an always-present node
      // visible only when State is "Empty" (with the normal rows gated the
      // other way) - same scan-and-graft treatment as
      // captureTransferProperties()'s STATUS_STATES.
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const stateLabels=properties.find(p=>p.id==='state')?.options||[];
      {
        const M2=window.ADSComponentContract;
        const sLabel=re=>stateLabels.find(l=>re.test(l));
        const defaultLabel=sLabel(/^default$/i),loadingLabel=sLabel(/^loading$/i),emptyLabel2=sLabel(/^empty$/i),avatarsLabel=sLabel(/^with avatars$/i),actionLabel=sLabel(/action/i);
        const not=l=>({property:'state',equals:l,not:true}),eq=l=>({property:'state',equals:l});
        const specs=[];
        for(let r=0;r<3;r++){
          const rowId='root-'+r;
          specs.push({id:'avatar-'+r,parent:rowId,at:'start',snapState:avatarsLabel,vis:[defaultLabel,loadingLabel,emptyLabel2].filter(Boolean).map(not)});
          specs.push({id:'action-'+r,parent:rowId,at:'end',snapState:actionLabel,vis:actionLabel?[eq(actionLabel)]:[]});
          specs.push({id:'sk-body-'+r,parent:rowId,at:'start',snapState:loadingLabel,vis:loadingLabel?[eq(loadingLabel)]:[]});
          specs.push({id:'sk-avatar-'+r,parent:rowId,at:'start',snapState:loadingLabel,vis:loadingLabel?[eq(loadingLabel)]:[]});
        }
        const px2=v=>{const m=/^(-?\d*\.?\d+)px$/.exec(String(v||'').trim());return m?parseFloat(m[1]):0;};
        const grafted=[];
        for(const sp of specs){
          if(!sp.snapState||findPart(anatomy,sp.id))continue;
          const snaps=listSnaps.filter(s=>(sp.id.startsWith('avatar-')?/avatars/i.test(s.state):s.state===sp.snapState)&&findPart(s.anat,sp.id));
          if(!snaps.length)continue;
          const tmplSnap=snaps.find(s=>s.state===sp.snapState&&/default/i.test(s.when.size||'')&&/default/i.test(s.when.appearance||''))||snaps.find(s=>s.state===sp.snapState)||snaps[0];
          const tmpl=JSON.parse(JSON.stringify(findPart(tmplSnap.anat,sp.id)));
          tmpl.visibleWhen=sp.vis;
          const resolvePct=(root)=>{const bodyW=px2(findPart(root,sp.id.replace('sk-avatar','sk-body'))?.styles?.width);(function w(n){const m=/^(\d+(?:\.\d+)?)%$/.exec(String(n.styles?.width||''));if(m&&bodyW)n.styles={...n.styles,width:Math.round(bodyW*parseFloat(m[1])/100*100)/100+'px'};(n.children||[]).forEach(w);})(root);};
          if(sp.id.startsWith('sk-body'))resolvePct(tmpl);
          const parent=findPart(anatomy,sp.parent);if(!parent)continue;
          parent.children=sp.at==='start'?[tmpl,...(parent.children||[])]:[...(parent.children||[]),tmpl];
          grafted.push({sp,tmpl,snaps});
        }
        // The normal row content is replaced by skeleton placeholders while Loading.
        if(loadingLabel)for(let r=0;r<3;r++){const body=findPart(anatomy,'body-'+r);if(body)body.visibleWhen=[...(body.visibleWhen||[]),not(loadingLabel)];}
        for(const g of grafted){
          const tmap=new Map();(function w(n){tmap.set(n.id,n);(n.children||[]).forEach(w);})(g.tmpl);
          for(const s of g.snaps){
            const node=findPart(s.anat,g.sp.id);const patchSet={};
            if(g.sp.id.startsWith('sk-body')){const bw=px2(node.styles&&node.styles.width);(function w(n){const m=/^(\d+(?:\.\d+)?)%$/.exec(String(n.styles?.width||''));if(m&&bw)n.styles={...n.styles,width:Math.round(bw*parseFloat(m[1])/100*100)/100+'px'};(n.children||[]).forEach(w);})(node);}
            (function walk(n){const b=tmap.get(n.id);if(b&&b.kind===n.kind){const styles={};for(const [k,v] of Object.entries(n.styles||{}))if(b.styles[k]!==v)styles[k]=v;const patch={};if(Object.keys(styles).length)patch.styles=styles;if(n.text!==b.text)patch.text=n.text;if(Object.keys(patch).length)patchSet[n.id]=patch;}(n.children||[]).forEach(walk);})(node);
            if(!Object.keys(patchSet).length)continue;
            const key=JSON.stringify(s.when);let v=built.variants.find(x=>JSON.stringify(x.when)===key);
            if(!v){v={id:'cv-list-'+M2.id(Object.values(s.when).join('-')),name:Object.values(s.when).join(' / '),when:{...s.when},overrides:{}};built.variants.push(v);}
            v.overrides={...v.overrides,...patchSet};
          }
        }
      }
      const emptyLabel=stateLabels.find(l=>/^empty$/i.test(l));
      if(emptyLabel){
        const originalType=selected.type,originalConfig=selected.config;
        const emptyEntry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===emptyLabel);
        const emptyNode=emptyEntry&&findPart(snapshot(emptyEntry.root,'root',0),'list-empty');
        if(emptyNode){
          const normalRows=(anatomy.children||[]).filter(c=>c.id!=='list-empty');
          for(const row of normalRows)row.visibleWhen=[...(row.visibleWhen||[]),{property:'state',equals:emptyLabel,not:true}];
          anatomy.children=[...normalRows,{...emptyNode,visibleWhen:[{property:'state',equals:emptyLabel}],styles:{...emptyNode.styles,width:'100%',flexGrow:'1'}}];
        }
      }
      // Rows, text columns and the list frame hug their height; only the avatar circle and skeleton bars keep their fixed sizes.
      {
        anatomy.styles={...anatomy.styles,width:'260px','--ads-fixed-width':'1'};
        for(const v of built.variants){const o=v.overrides&&v.overrides[anatomy.id];if(o&&o.styles&&'width' in o.styles){const st={...o.styles};delete st.width;o.styles=st;}}
        const fixedH=id=>/^(avatar|sk-avatar|sk-line1|sk-line2)-/.test(id);
        (function strip(n){if(n.kind!=='text'&&n.styles&&!fixedH(n.id)&&n.tag!=='svg'){const st={...n.styles};st.height='auto';delete st.maxHeight;n.styles=st;}(n.children||[]).forEach(strip);})(anatomy);
        for(const v of built.variants)for(const [id,o] of Object.entries(v.overrides||{}))if(!fixedH(id)&&o.styles&&'height' in o.styles){const st={...o.styles};delete st.height;o.styles=st;}
      }
      return {anatomy,properties,selection,variants:built.variants};
    }
    // Popover: same no-native-control-to-drive manual sweep as Tooltip/
    // Tour - every Appearance(placement)/State(content) combination
    // already coexists in one table. Trigger label/Title are always
    // present, bound directly; Body only exists structurally for every
    // State but "Simple" - harvested from a representative row when the
    // base capture doesn't already have it, same single-value visibleWhen
    // constraint as Collapse's Body/Image's Caption.
    function capturePopoverProperties(){
      const M=window.ADSComponentContract;
      const triggerLabelInput=document.querySelector('[data-role="popover-trigger-label"]');
      const titleInput=document.querySelector('[data-role="popover-title"]');
      const bodyInput=document.querySelector('[data-role="popover-body"]');
      // Same arrow treatment as Tooltip/Tour: the page's flow layout (negative margins, rotated 45deg) can't be reproduced in Figma, so the arrow
      // becomes an absolutely placed child of the BUBBLE, anchored to the bubble edge that faces the trigger.
      function popArrowStyles(wrapEl,placement){
        const arrowEl=wrapEl&&wrapEl.querySelector&&wrapEl.querySelector('.popover-demo-arrow'),bubbleEl=wrapEl&&wrapEl.querySelector&&wrapEl.querySelector('.popover-demo-bubble');
        if(!arrowEl||!bubbleEl)return null;
        const br=bubbleEl.getBoundingClientRect(),ar=arrowEl.getBoundingClientRect();
        const m=/^matrix\(([^)]+)\)/.exec(getComputedStyle(arrowEl).transform);const deg=m?-Math.atan2(Number(m[1].split(',')[1]),Number(m[1].split(',')[0]))*180/Math.PI:0,rad=deg*Math.PI/180,cs=Math.cos(rad),sn=Math.sin(rad);
        const w=parseFloat(getComputedStyle(arrowEl).width)||8,h=parseFloat(getComputedStyle(arrowEl).height)||8;
        const cx=(ar.left-br.left)+ar.width/2,cy=(ar.top-br.top)+ar.height/2;
        const t=String(placement||'').toLowerCase();
        const side=/left/.test(t)?'left':/right/.test(t)?'right':/bottom/.test(t)?'bottom':'top';
        const hint={top:{justifySelf:'center',alignSelf:'flex-end'},bottom:{justifySelf:'center',alignSelf:'flex-start'},left:{justifySelf:'flex-end',alignSelf:'center'},right:{justifySelf:'flex-start',alignSelf:'center'}}[side];
        return {position:'absolute',left:(cx-(cs*(w/2)+sn*(h/2)))+'px',top:(cy-(-sn*(w/2)+cs*(h/2)))+'px',marginTop:'0px',marginBottom:'0px',marginLeft:'0px',marginRight:'0px',right:'auto',bottom:'auto',...hint,transform:getComputedStyle(arrowEl).transform};
      }
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        {const st=popArrowStyles(entry.root,entry.type);if(st)overrides.arrow={...(overrides.arrow||{}),styles:{...((overrides.arrow||{}).styles||{}),...st}};}
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const triggerNode=findPart(baseAnatomy,'trigger');
      const titleNode=findPart(baseAnatomy,'title');
      if(triggerNode){triggerNode.bind='triggerLabel';const def=triggerLabelInput?.value.trim()||triggerNode.text||'Details';properties.push({id:'triggerLabel',name:'Trigger label',type:'text',default:def});selection.triggerLabel=def;}
      if(titleNode){titleNode.bind='title';const def=titleInput?.value.trim()||titleNode.text||'Storage usage';properties.push({id:'title',name:'Title',type:'text',default:def});selection.title=def;}

      const simpleLabel=stateOptions.find(l=>/simple/i.test(l));
      const bodyStateLabel=stateOptions.find(l=>!/simple/i.test(l));
      let bodyNode=findPart(baseAnatomy,'body');
      if(!bodyNode&&bodyStateLabel){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.state===bodyStateLabel);
        bodyNode=entry&&findPart(snapshot(entry.root,'root',0),'body');
        if(bodyNode){
          const bubble=findPart(baseAnatomy,'title');
          if(bubble){
            const parentWalk=(n)=>{if((n.children||[]).some(c=>c.id===bubble.id))return n;for(const c of n.children||[]){const r=parentWalk(c);if(r)return r;}return null;};
            const bubbleParent=parentWalk(baseAnatomy);
            if(bubbleParent)bubbleParent.children.push(bodyNode);
          }
        }
      }
      if(bodyNode){
        bodyNode.bind='body';
        if(simpleLabel)bodyNode.visibleWhen=[{property:'state',equals:simpleLabel,not:true}];
        const def=bodyInput?.value.trim()||bodyNode.text||'8.2 GB of 15 GB used.';
        properties.push({id:'body',name:'Body',type:'text',default:def});
        selection.body=def;
      }

      // Bubble: arrow first (painted under the text), close button grafted for With close, everything hugs; the trigger label is centred.
      {
        const bubble=findPart(baseAnatomy,'bubble'),arrow=findPart(baseAnatomy,'arrow'),trigger=findPart(baseAnatomy,'trigger');
        const closeLabel=stateOptions.find(l=>/close/i.test(l));const closeLabelAll=closeLabel;
        if(bubble){
          if(arrow){baseAnatomy.children=baseAnatomy.children.filter(n=>n!==arrow);const ent=gatherEntries().find(e=>e.type===originalType&&e.state===originalState);const st=ent&&popArrowStyles(ent.root,originalType);if(st)arrow.styles={...arrow.styles,...st};bubble.children=[arrow,...(bubble.children||[]).filter(n=>n!==arrow)];}
          if(closeLabel&&!findPart(baseAnatomy,'close')){const ent=gatherEntries().find(e=>e.type===originalType&&e.state===closeLabel);const closeNode=ent&&findPart(snapshot(ent.root,'root',0),'close');if(closeNode){closeNode.visibleWhen=[{property:'state',equals:closeLabel}];bubble.children.push(closeNode);}}
          bubble.styles={...bubble.styles,overflow:'visible',overflowX:'visible',overflowY:'visible'};
        }
        const hugBoth=n=>{if(!n)return;const st={...n.styles};delete st.width;delete st.height;n.styles=st;};
        const noHeight=n=>{if(!n)return;const st={...n.styles};delete st.height;n.styles=st;};
        hugBoth(baseAnatomy);hugBoth(trigger);
        // The bubble hugs its title when that is all there is; with a body it keeps the width the text wraps at (max 220px), so the body wraps
        // below the heading instead of running past the bubble.
        hugBoth(bubble);
        for(const id of ['title','body'])hugBoth(findPart(baseAnatomy,id));
        for(const v of variants){
          for(const id of ['root','trigger','title','body']){const o=v.overrides[id];if(o&&o.styles){const st={...o.styles};delete st.width;delete st.height;o.styles=st;}}
          const ob=v.overrides.bubble;if(ob&&ob.styles){const st={...ob.styles};delete st.height;if(/simple/i.test(v.when.state||''))delete st.width;ob.styles=st;}
          const or=v.overrides.root;if(or&&or.styles){const st={...or.styles};delete st.width;delete st.height;or.styles=st;}
        }
        if(trigger)trigger.styles={...trigger.styles,display:'flex',justifyContent:'center',alignItems:'center',textAlign:'center'};
        // Heading and supporting text fill the bubble's inner width and wrap there (Figma text hugs one line otherwise and runs past the bubble).
        for(const id of ['title','body']){const n=findPart(baseAnatomy,id);if(n)n.styles={...n.styles,alignSelf:'stretch'};}
        // With a close button the text keeps clear of it (the page does this with title max-width: calc(100% - 20px)).
        if(closeLabelAll){for(const v of variants)if(v.when.state===closeLabelAll){const o=v.overrides.bubble||(v.overrides.bubble={});o.styles={...(o.styles||{}),paddingRight:'32px'};}}
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Splitter: same no-native-control-to-drive manual sweep as Tooltip/
    // Tour/Popover - every Appearance(orientation)/State combination
    // already coexists in one table. Second panel's label is always
    // present, bound directly; First panel's label only exists
    // structurally while State isn't "Collapsed" (that state shrinks the
    // panel to an icon-only strip) - harvested from a representative row
    // when absent, same single-value visibleWhen constraint used
    // throughout. Split ratio drives the first panel's own flex-basis
    // percentage - Figma can't recompute that live from a bare property
    // any more than Slider could recompute its thumb position, so it
    // stays an orphan editable property.
    function captureSplitterProperties(){
      const M=window.ADSComponentContract;
      const panel1Input=document.querySelector('[data-role="splitter-panel1-label"]');
      const panel2Input=document.querySelector('[data-role="splitter-panel2-label"]');
      const ratioInput=document.querySelector('[data-role="splitter-ratio"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const panel2Node=findPart(baseAnatomy,'panel2');
      if(panel2Node){panel2Node.bind='panel2Label';const def=panel2Input?.value.trim()||panel2Node.text||'Content';properties.push({id:'panel2Label',name:'Second panel label',type:'text',default:def});selection.panel2Label=def;}

      const collapsedLabel=stateOptions.find(l=>/collapsed/i.test(l));
      const panel1StateLabel=stateOptions.find(l=>!/collapsed/i.test(l));
      let panel1Node=findPart(baseAnatomy,'panel1');
      if(!panel1Node&&panel1StateLabel){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.state===panel1StateLabel);
        panel1Node=entry&&findPart(snapshot(entry.root,'root',0),'panel1');
        if(panel1Node){
          // Append rather than replace - the base (Collapsed) host still
          // has its own expand-icon child, which must stay for Collapsed
          // itself; the harvested label is an additional child gated to
          // every other State via its own visibleWhen below.
          const host=baseAnatomy.children?.[0];
          if(host)host.children=[...(host.children||[]),panel1Node];
        }
      }
      if(panel1Node){
        panel1Node.bind='panel1Label';
        if(collapsedLabel)panel1Node.visibleWhen=[{property:'state',equals:collapsedLabel,not:true}];
        const def=panel1Input?.value.trim()||panel1Node.text||'Sidebar';
        properties.push({id:'panel1Label',name:'First panel label',type:'text',default:def});
        selection.panel1Label=def;
      }

      if(ratioInput){properties.push({id:'splitRatio',name:'Split ratio',type:'text',default:ratioInput.value.trim()||'35'});selection.splitRatio=ratioInput.value.trim()||'35';}

      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Statistic: same no-native-control-to-drive manual sweep as Tooltip/
    // Popover - every Appearance/State combination already coexists in one
    // table. Title is always present, bound directly; Value only exists
    // structurally outside the "Loading" state (which swaps the whole
    // title+value area for a skeleton bar) - harvested from a
    // non-loading row when absent. Prefix/Suffix are presence-driven by
    // their own text being non-empty rather than a boolean or a State -
    // harvested the way Slider harvests Label/Value, by briefly filling
    // them in if empty.
    function captureStatisticProperties(){
      const M=window.ADSComponentContract;
      const titleInput=document.querySelector('[data-role="statistic-title"]');
      const valueInput=document.querySelector('[data-role="statistic-value"]');
      const prefixInput=document.querySelector('[data-role="statistic-prefix"]');
      const suffixInput=document.querySelector('[data-role="statistic-suffix"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];const statSnaps=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        statSnaps.push({entry,anat:variantAnatomy});
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const titleNode=findPart(baseAnatomy,'title');
      if(titleNode){titleNode.bind='title';const def=titleInput?.value.trim()||titleNode.text||'Active Users';properties.push({id:'title',name:'Title',type:'text',default:def});selection.title=def;}

      const loadingLabel=stateOptions.find(l=>/loading/i.test(l));
      const valueStateLabel=stateOptions.find(l=>!/loading/i.test(l));
      let valueNode=findPart(baseAnatomy,'value');
      if(!valueNode&&valueStateLabel){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.state===valueStateLabel);
        valueNode=entry&&findPart(snapshot(entry.root,'root',0),'value');
        if(valueNode)baseAnatomy.children.push(valueNode);
      }
      if(valueNode){
        valueNode.bind='value';
        if(loadingLabel)valueNode.visibleWhen=[{property:'state',equals:loadingLabel,not:true}];
        const def=valueInput?.value.trim()||valueNode.text||'112,893';
        properties.push({id:'value',name:'Value',type:'text',default:def});
        selection.value=def;
      }

      function harvestAffix(input,partId,defText){
        let node=findPart(baseAnatomy,partId);
        if(node)return node;
        if(!input)return null;
        const original=input.value;
        applyingFoundation=true;
        try{
          if(!original.trim()){input.value=defText;input.dispatchEvent(new Event('input',{bubbles:true}));window.ADS_flushRenders?.();}
          const entry=gatherEntries().find(e=>e.type===originalType&&e.state===(valueStateLabel||originalState));
          node=entry&&findPart(snapshot(entry.root,'root',0),partId);
        }finally{
          if(!original.trim()){input.value=original;input.dispatchEvent(new Event('input',{bubbles:true}));}
          applyingFoundation=false;refresh();
        }
        return node;
      }
      const prefixNode=harvestAffix(prefixInput,'prefix','$');
      if(prefixNode){
        prefixNode.bind='prefix';
        if(!findPart(baseAnatomy,'prefix')){const vNode=findPart(baseAnatomy,'value');if(vNode){const host=baseAnatomy.children?.find(c=>findPart(c,'value'));if(host)host.children=[prefixNode,...(host.children||[])];}}
        // The page shows no prefix until one is typed; the sample "$" used only to harvest the layer must not appear by default in Figma.
        const def=prefixInput?.value.trim()||prefixNode.text||'$',shown=Boolean(prefixInput?.value.trim());
        prefixNode.visibleWhen=[{property:'showPrefix',equals:true}];
        properties.push({id:'showPrefix',name:'Show prefix',type:'boolean',default:shown});selection.showPrefix=shown;
        properties.push({id:'prefix',name:'Prefix',type:'text',default:def});
        selection.prefix=def;
      }
      const suffixNode=harvestAffix(suffixInput,'suffix','%');
      if(suffixNode){
        suffixNode.bind='suffix';
        if(!findPart(baseAnatomy,'suffix')){const host=baseAnatomy.children?.find(c=>findPart(c,'value'));if(host)host.children=[...(host.children||[]),suffixNode];}
        const def=suffixInput?.value.trim()||suffixNode.text||'%',shown=Boolean(suffixInput?.value.trim());
        suffixNode.visibleWhen=[{property:'showSuffix',equals:true}];
        properties.push({id:'showSuffix',name:'Show suffix',type:'boolean',default:shown});selection.showSuffix=shown;
        properties.push({id:'suffix',name:'Suffix',type:'text',default:def});
        selection.suffix=def;
      }

      // The Loading skeleton and the Trend line exist only in some States/Appearances, and the value row used to share a positional id with the skeleton.
      // Both are grafted from their own cells (visible only there), the value row is hidden while Loading, and everything hugs its content.
      {
        const trendLabel=typeOptions.find(l=>/trend/i.test(l));
        const baselineSnap=statSnaps.concat([{entry:{type:originalType,state:originalState},anat:baseAnatomy}]);
        const grafts=[];
        const addGraft=(id,snapFilter,vis)=>{
          if(findPart(baseAnatomy,id))return;
          const snaps=statSnaps.filter(s=>snapFilter(s.entry)&&findPart(s.anat,id));if(!snaps.length)return;
          const tmplSnap=snaps.find(s=>/default/i.test(s.entry.state)||/default/i.test(s.entry.type))||snaps[0];
          const tmpl=JSON.parse(JSON.stringify(findPart(tmplSnap.anat,id)));tmpl.visibleWhen=vis;if(id==='skeleton'){tmpl.text='';tmpl.children=[];}baseAnatomy.children=[...(baseAnatomy.children||[]),tmpl];grafts.push({id,tmpl,snaps});
        };
        if(loadingLabel)addGraft('skeleton',e=>e.state===loadingLabel,[{property:'state',equals:loadingLabel}]);
        if(trendLabel)addGraft('trend',e=>e.type===trendLabel&&e.state!==loadingLabel,[{property:'appearance',equals:trendLabel},...(loadingLabel?[{property:'state',equals:loadingLabel,not:true}]:[])]);
        const vrow=findPart(baseAnatomy,'valueRow');if(vrow&&loadingLabel)vrow.visibleWhen=[...(vrow.visibleWhen||[]),{property:'state',equals:loadingLabel,not:true}];
        const valueN=findPart(baseAnatomy,'value');if(valueN&&valueN.visibleWhen&&vrow)valueN.visibleWhen=undefined;
        for(const g of grafts){
          const tmap=new Map();(function w(n){tmap.set(n.id,n);(n.children||[]).forEach(w);})(g.tmpl);
          for(const s of g.snaps){
            const node=findPart(s.anat,g.id);const patchSet={};if(g.id==='skeleton'){node.text='';node.children=[];}
            (function walk(n){const b=tmap.get(n.id);if(b&&b.kind===n.kind){const styles={};for(const [k,v] of Object.entries(n.styles||{}))if(b.styles[k]!==v)styles[k]=v;const attributes={};for(const [k,v] of Object.entries(n.attributes||{}))if(b.attributes[k]!==v)attributes[k]=v;const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==b.text)patch.text=n.text;if(Object.keys(patch).length)patchSet[n.id]=patch;}(n.children||[]).forEach(walk);})(node);
            if(!Object.keys(patchSet).length)continue;
            const when={state:s.entry.state,appearance:s.entry.type};const key=JSON.stringify(when);
            let v=variants.find(x=>JSON.stringify(x.when)===key);
            if(!v){v={id:'cv-stat-'+M.id(s.entry.type+'-'+s.entry.state),name:[s.entry.type,s.entry.state].join(' / '),when,overrides:{}};variants.push(v);}
            v.overrides={...v.overrides,...patchSet};
          }
        }
        // Sizes: the field, value row and trend hug; the skeleton keeps its fixed bar size.
        const unsize=n=>{if(n.kind!=='text'&&n.styles&&n.id!=='skeleton'&&n.tag!=='svg'&&n.id!=='trend-icon'){const st={...n.styles};delete st.width;st.height='auto';delete st.maxWidth;n.styles=st;}(n.children||[]).forEach(unsize);};unsize(baseAnatomy);
        for(const v of variants)for(const [id,o] of Object.entries(v.overrides||{}))if(id!=='skeleton'&&id!=='trend-icon'&&o.styles){const st={...o.styles};delete st.width;delete st.height;o.styles=st;}
      }
      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Table: Appearance/State/Size/Corner radius already cross generically
    // via captureCrossedProperties(). Show header hides/shows the whole
    // <thead> block - a real structural toggle, harvested the same way
    // Slider harvests Tick marks/Modal harvests its icon: briefly shown
    // during export even if currently off.
    function captureTableProperties(){
      const tableSnaps=[];const prevTableHook=crossedHook;
      crossedHook=(entry,anat,when)=>{tableSnaps.push({when:{...when},state:entry.state,anat});if(prevTableHook)prevTableHook(entry,anat,when);};
      let built;try{built=captureCrossedProperties();}finally{crossedHook=prevTableHook;}
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      const showHeaderInput=document.querySelector('[data-role="table-show-header"]');

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      function currentPart(partId){
        const entry=gatherEntries().find(e=>e.type===selected.type&&e.config===selected.config&&e.state===selected.state);
        return entry?findPart(snapshot(entry.root,'root',0),partId):null;
      }
      const originalShowHeader=showHeaderInput?.checked??true;
      let headerNode=findPart(anatomy,'header');
      if(showHeaderInput&&!headerNode){
        applyingFoundation=true;
        try{
          if(!originalShowHeader){showHeaderInput.checked=true;showHeaderInput.dispatchEvent(new Event('change',{bubbles:true}));}
          headerNode=currentPart('header');
          if(!originalShowHeader){showHeaderInput.checked=false;showHeaderInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }finally{applyingFoundation=false;refresh();}
      }
      if(headerNode){
        headerNode.visibleWhen=[{property:'showHeader',equals:true}];
        if(!findPart(anatomy,'header'))anatomy.children.unshift(headerNode);
        properties.push({id:'showHeader',name:'Show header',type:'boolean',default:originalShowHeader});
        selection.showHeader=originalShowHeader;
      }

      // State=Selected renders a leading checkbox column (a header
      // select-all checkbox plus one per data row) that no other state's
      // DOM includes at all - same structural-limitation class Cascader's
      // Open-state panel hit: the base capture snapshots whichever state
      // happens to be selected by default (not Selected), so the checkbox
      // column has no id in that base anatomy template at all and the
      // generic crossed-properties diff above can never represent it
      // (reported: table's selection checkboxes - and the header's own
      // select-all checkbox, which this page's own purpose text describes
      // but the demo markup never actually built - missing entirely). Scan
      // every state for the one whose DOM actually has this column (via the
      // stable data-contract-part ids table-detail.js marks it with - the
      // tr ids themselves, header-0/root-1-0/1/2, stay stable across states
      // either way since they don't move), then graft it on as real,
      // always-present nodes hidden unless State=Selected.
      const stateLabels=properties.find(p=>p.id==='state')?.options||[];
      let checkboxHeaderPart=null,checkboxRowParts=[],checkboxStateLabel=null;
      for(const label of stateLabels){
        const entry=gatherEntries().find(e=>e.type===selected.type&&e.config===selected.config&&e.state===label);
        if(!entry)continue;
        const snap=snapshot(entry.root,'root',0);
        const found=findPart(snap,'checkbox-header');
        if(!found)continue;
        checkboxHeaderPart=found;
        checkboxRowParts=[0,1,2].map(i=>findPart(snap,'checkbox-cell-'+i)).filter(Boolean);
        checkboxStateLabel=label;
        break;
      }
      if(checkboxHeaderPart&&checkboxStateLabel){
        const headerRow=findPart(anatomy,'header-row');
        if(headerRow&&!findPart(headerRow,'checkbox-header'))headerRow.children.unshift({...checkboxHeaderPart,visibleWhen:[{property:'state',equals:checkboxStateLabel}]});
        for(let i=0;i<checkboxRowParts.length;i++){
          const tr=findPart(anatomy,'row-'+i);
          if(tr&&!findPart(tr,'checkbox-cell-'+i))tr.children.unshift({...checkboxRowParts[i],visibleWhen:[{property:'state',equals:checkboxStateLabel}]});
        }
      }


      // Loading shows a skeleton bar in every cell and Empty replaces the rows with one message row; neither exists in the base (Default) capture, and
      // before the cells had positional ids that shifted between States. Cells now have stable parts; the State-only pieces are grafted here.
      {
        const M3=window.ADSComponentContract;
        const sLabel=re=>stateLabels.find(l=>re.test(l));
        const loadingL=sLabel(/^loading$/i),emptyL=sLabel(/^empty$/i);
        const cols=['name','status','role','email','mobile'];
        const px=v=>{const m=/^(-?\d*\.?\d+)px$/.exec(String(v||'').trim());return m?parseFloat(m[1]):0;};
        const grafts=[];
        // The skeleton bar is 70% of its cell's content width; Figma needs the pixel value.
        const skWidth=(root,id)=>{const cellN=findPart(root,id.replace(/^sk-/,'cell-'));const cs=cellN&&cellN.styles||{};const pad=(px(cs.paddingLeft)||0)+(px(cs.paddingRight)||0);return Math.max(8,Math.round(0.7*(px(cs.width)-pad)*100)/100)+'px';};
        const add=(parentId,id,pred,vis,at)=>{
          const parent=findPart(anatomy,parentId);if(!parent||findPart(anatomy,id))return;
          const snaps=tableSnaps.filter(s=>pred(s.state)&&findPart(s.anat,id));if(!snaps.length)return;
          const tmplSnap=snaps.find(s=>/default/i.test(s.when.appearance||'')&&/large|default/i.test(s.when.size||'')&&s.state===snaps[0].state)||snaps[0];
          const tmpl=JSON.parse(JSON.stringify(findPart(tmplSnap.anat,id)));tmpl.visibleWhen=vis;
          if(id.startsWith('sk-'))tmpl.styles={...tmpl.styles,width:skWidth(tmplSnap.anat,id)};
          parent.children=at==='start'?[tmpl,...(parent.children||[])]:[...(parent.children||[]),tmpl];grafts.push({id,tmpl,snaps});
        };
        if(loadingL)for(let r=0;r<3;r++)for(const c of cols){
          add('cell-'+r+'-'+c,'sk-'+r+'-'+c,st=>st===loadingL,[{property:'state',equals:loadingL}],'end');
          const v=findPart(anatomy,'v-'+r+'-'+c);if(v)v.visibleWhen=[...(v.visibleWhen||[]),{property:'state',equals:loadingL,not:true}];
        }
        if(emptyL){
          add('body','empty-row',st=>st===emptyL,[{property:'state',equals:emptyL}],'end');
          for(let r=0;r<3;r++){const row=findPart(anatomy,'row-'+r);if(row)row.visibleWhen=[...(row.visibleWhen||[]),{property:'state',equals:emptyL,not:true}];}
        }
        for(const g of grafts){
          const tmap=new Map();(function w(n){tmap.set(n.id,n);(n.children||[]).forEach(w);})(g.tmpl);
          for(const s of g.snaps){
            const node=findPart(s.anat,g.id);const patchSet={};if(g.id.startsWith('sk-'))node.styles={...node.styles,width:skWidth(s.anat,g.id)};
            (function walk(n){const b=tmap.get(n.id);if(b&&b.kind===n.kind){const styles={};for(const [k,v] of Object.entries(n.styles||{}))if(b.styles[k]!==v)styles[k]=v;const patch={};if(Object.keys(styles).length)patch.styles=styles;if(n.text!==b.text)patch.text=n.text;if(Object.keys(patch).length)patchSet[n.id]=patch;}(n.children||[]).forEach(walk);})(node);
            if(!Object.keys(patchSet).length)continue;
            const key=JSON.stringify(s.when);let v=built.variants.find(x=>JSON.stringify(x.when)===key);
            if(!v){v={id:'cv-table-'+M3.id(Object.values(s.when).join('-')),name:Object.values(s.when).join(' / '),when:{...s.when},overrides:{}};built.variants.push(v);}
            v.overrides={...v.overrides,...patchSet};
          }
        }
      }
      // Table rows are laid out as real rows (cells side by side); every cell left-aligns its content and centres it vertically, hugging the row height. A browser table (table-row /
      // table-cell) has no Figma equivalent, so it used to come out as a column of stacked cells with fixed captured heights.
      {
        const sized=new Set();
        (function walk(n){
          const d=n.styles&&n.styles.display;
          if(d==='table-row'){n.styles={...n.styles,display:'flex',flexDirection:'row',alignItems:'stretch'};sized.add(n.id);}
          else if(d==='table-cell'&&n.id==='empty-cell'){n.styles={...n.styles,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',alignSelf:'stretch',textAlign:'center'};}
          else if(d==='table-cell'){n.styles={...n.styles,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'flex-start',alignSelf:'stretch',textAlign:'left'};sized.add(n.id);}
          else if(d==='table-header-group'||d==='table-row-group'){n.styles={...n.styles,display:'flex',flexDirection:'column',alignSelf:'stretch'};sized.add(n.id);}
          if(sized.has(n.id)){const st={...n.styles};st.height='auto';n.styles=st;}
          (n.children||[]).forEach(walk);
        })(anatomy);
        // The table is as wide as its columns need (nowrap cells can widen it past the old 630px), so the frame hugs instead of keeping a stale fixed width.
        // Every Table master is exactly 800px wide (fixed, so the canvas layout never depends on a hugging measurement); height still hugs.
        anatomy.styles={...anatomy.styles,width:'800px',height:'auto','--ads-fixed-width':'1'};
        // The last column (and the Empty message cell) fills whatever remains of the 800px row, so measured pixel widths that differ by a few px
        // between States never leave a gap or push the row past 800.
        const fillCell=id=>/^(th-mobile|cell-\d-mobile|empty-cell)$/.test(id);
        (function fillLast(n){if(fillCell(n.id)&&n.styles){const st={...n.styles};delete st.width;st.flexGrow='1';n.styles=st;}(n.children||[]).forEach(fillLast);})(anatomy);
        for(const v of built.variants)for(const [id,o] of Object.entries(v.overrides||{}))if(fillCell(id)&&o.styles){const st={...o.styles};delete st.width;o.styles=st;}
        // The Empty state's "Add item" button hugs its label (a captured pixel width left the label off-centre and clipped) with the label centred.
        (function hugAction(n){if(n.id==='empty-action'&&n.styles){const st={...n.styles};delete st.width;st.height='auto';st.display='flex';st.flexDirection='row';st.justifyContent='center';st.alignItems='center';st.textAlign='center';n.styles=st;}(n.children||[]).forEach(hugAction);})(anatomy);
        for(const v of built.variants){const o=v.overrides&&v.overrides['empty-action'];if(o&&o.styles){const st={...o.styles};delete st.width;delete st.height;o.styles=st;}}
        (function hugValues(n){if(/^v-\d-[a-z]+$/.test(n.id)&&n.styles){const st={...n.styles};delete st.width;st.height='auto';n.styles=st;}(n.children||[]).forEach(hugValues);})(anatomy);
        for(const v of built.variants)for(const [id,o] of Object.entries(v.overrides||{}))if(/^v-\d-[a-z]+$/.test(id)&&o.styles){const st={...o.styles};delete st.width;delete st.height;o.styles=st;}
        for(const v of built.variants)for(const [id,o] of Object.entries(v.overrides||{})){
          if(!o.styles)continue;const st={...o.styles};
          if(id===anatomy.id){delete st.width;delete st.height;}
          if(sized.has(id)){delete st.height;delete st.display;delete st.flexDirection;}
          if('display' in st&&/^table-/.test(st.display))delete st.display;
          if('textAlign' in st)delete st.textAlign;
          o.styles=st;
        }
      }
      return {anatomy,properties,selection,variants:built.variants};
    }
    // Calendar: same no-native-control-to-drive manual sweep as Tooltip/
    // Popover - every Appearance(Full/Compact)/State combination already
    // coexists in one table. Month label is always present, bound
    // directly. First day of week reshapes the whole 42-day grid (which
    // dates land in which cells) and the weekday header labels - a
    // structural recompute Figma can't perform from a bare property, same
    // reasoning as Slider's Min/Max/Step - so it stays an orphan editable
    // property, frozen to whichever arrangement was active at capture time.
    function captureCalendarProperties(){
      const M=window.ADSComponentContract;
      const monthLabelInput=document.querySelector('[data-role="calendar-month-label"]');
      const firstDaySelect=document.querySelector('[data-role="calendar-first-day-select"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      // Event dots exist only in the With events State (display:none otherwise, so they have no node in the base capture). Graft them onto their day
      // cell, visible only for With events; the per-Appearance position (bottom centre / top right) comes from each Appearance's variant overrides.
      {
        const evEntry=sweep.find(e=>/event/i.test(e.state)&&e.type===originalType)||sweep.find(e=>/event/i.test(e.state));
        if(evEntry){
          const evAnatomy=snapshot(evEntry.root,'root',0);
          (function walk(n,baseParent){
            for(const child of n.children||[]){
              const inBase=base.get(child.id);
              if(!inBase&&baseParent&&child.kind!=='text'){const copy=JSON.parse(JSON.stringify(child));copy.visibleWhen=[{property:'state',equals:evEntry.state}];baseParent.children=[...(baseParent.children||[]),copy];base.set(copy.id,copy);}
              else walk(child,inBase||null);
            }
          })(evAnatomy,baseAnatomy);
        }
      }
      const typeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        const when={state:entry.state,appearance:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(typeOptions.length>1){properties.push({id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:originalType});selection.appearance=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const monthLabelNode=findPart(baseAnatomy,'monthLabel');
      if(monthLabelNode){monthLabelNode.bind='monthLabel';const def=monthLabelInput?.value.trim()||monthLabelNode.text||'September 2026';properties.push({id:'monthLabel',name:'Month label',type:'text',default:def});selection.monthLabel=def;}
      if(firstDaySelect){properties.push({id:'firstDay',name:'First day of week',type:'text',default:firstDaySelect.value||'sunday'});selection.firstDay=firstDaySelect.value||'sunday';}

      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Tree: Appearance/State/Show icons already come from the generic
    // captureFormFieldProperties()/captureCrossedProperties() path (Show
    // icons already follows the {prefix}-show-icons convention those
    // functions recognize). Root label's own native control is named
    // tree-root-label, not tree-label, so the generic label-detection
    // never finds it - bound here directly on top, same minimal-wrapper
    // approach as List's Show dividers.
    function captureTreeProperties(){
      const built=captureFormFieldProperties();
      const anatomy=built.anatomy;
      const properties=[...built.properties];const selection={...built.selection};
      const rootLabelInput=document.querySelector('[data-role="tree-root-label"]');
      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const rootLabelNode=findPart(anatomy,'rootLabel');
      if(rootLabelNode){
        rootLabelNode.bind='rootLabel';
        const def=rootLabelInput?.value.trim()||rootLabelNode.text||'Project files';
        properties.push({id:'rootLabel',name:'Root label',type:'text',default:def});
        selection.rootLabel=def;
      }
      // Loading/Empty replace the whole node list with something
      // structurally different (a static spinner glyph, or a centered
      // message) - none of it has any id in the base (whichever State was
      // selected at capture time) anatomy template at all, so the generic
      // crossed-variant diff inside captureCrossedProperties() can never
      // represent it - same limitation as Transfer's own source/target
      // status slot. Scan every state's rendered DOM for the relevant part
      // via its stable data-contract-part marker (tree-detail.js marks the
      // node-list wrapper itself 'treeNodes' so it's findable regardless of
      // which state built this base capture), then graft each part on as a
      // real, always-present node hidden unless its own specific state is
      // selected, and give the normal tree-item rows negated visibleWhen so
      // they hide correctly under both new states.
      const originalType=selected.type,originalConfig=selected.config;
      const STATUS_STATES=['Loading','Empty'];
      const nodesWrapNode=findPart(anatomy,'treeNodes');
      if(nodesWrapNode){
        const normalRows=(nodesWrapNode.children||[]).filter(c=>c.id!=='tree-items-loading'&&c.id!=='tree-items-empty');
        for(const row of normalRows)row.visibleWhen=[...(row.visibleWhen||[]),...STATUS_STATES.map(label=>({property:'state',equals:label,not:true}))];
        const harvested=[];
        for(const label of STATUS_STATES){
          const partId=label==='Loading'?'tree-items-loading':'tree-items-empty';
          const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===label);
          if(!entry)continue;
          const found=findPart(snapshot(entry.root,'root',0),partId);
          if(!found)continue;
          harvested.push({...found,visibleWhen:[{property:'state',equals:label}],styles:{...found.styles,width:'100%'}});
        }
        nodesWrapNode.children=[...normalRows,...harvested];
      }

      // Rows, checkboxes, metatext and the expanded branch only exist in some States/Types, and rows used to be named by position (shifting with every State).
      // Every row now has a stable name; what the base (Default) capture lacks is grafted here from the cell that has it, shown only there.
      {
        const M4=window.ADSComponentContract;
        const stOpt=properties.find(p=>p.id==='state')?.options||[],apOpt=properties.find(p=>p.id==='appearance')?.options||[];
        const S=re=>stOpt.find(l=>re.test(l)),A=re=>apOpt.find(l=>re.test(l));
        const defL=S(/^default$/i),expL=S(/expanded/i),selL=S(/selected/i),disL=S(/disabled/i),loadL=S(/loading/i),empL=S(/empty/i),chkL=A(/checkable/i),metaL=A(/metatext|lines/i);
        const nodeSnaps=[];for(const e of gatherEntries())nodeSnaps.push({when:{state:e.state,appearance:e.type},state:e.state,type:e.type,anat:snapshot(e.root,'root',0)});
        const eq=(p,l)=>({property:p,equals:l}),not=(p,l)=>({property:p,equals:l,not:true});
        const grafts=[];
        const graft=(id,parentId,at,vis,pred)=>{
          const parent=findPart(anatomy,parentId);if(!parent||findPart(anatomy,id))return;
          const snaps=nodeSnaps.filter(s=>pred(s)&&findPart(s.anat,id));if(!snaps.length)return;
          const t=snaps.find(s=>(!defL||s.state===(expL||defL))&&(!apOpt.length||/default/i.test(s.type)))||snaps[0];
          const tmpl=JSON.parse(JSON.stringify(findPart(t.anat,id)));tmpl.visibleWhen=vis;
          const kids=parent.children||[];
          parent.children=at==='start'?[tmpl,...kids]:at==='afterFirst'?[kids[0],tmpl,...kids.slice(1)].filter(Boolean):[...kids,tmpl];
          grafts.push({id,tmpl,snaps});
        };
        const branchStates=[defL,disL,loadL,empL].filter(Boolean).map(l=>not('state',l));
        graft('children-0','node-0','end',branchStates,s=>s.state===expL||s.state===selL);
        for(let n=0;n<8;n++){
          if(chkL)graft('check-'+n,'row-'+n,'afterFirst',[eq('appearance',chkL)],s=>s.type===chkL);
          if(metaL)graft('meta-'+n,'labelgroup-'+n,'end',[eq('appearance',metaL)],s=>s.type===metaL);
        }
        if(chkL&&selL)for(let n=0;n<3;n++)graft('check-'+n+'-0','check-'+n,'end',[eq('state',selL)],s=>s.type===chkL&&s.state===selL);
        for(const g of grafts){
          const tmap=new Map();(function w(n){tmap.set(n.id,n);(n.children||[]).forEach(w);})(g.tmpl);
          for(const s of g.snaps){
            const node=findPart(s.anat,g.id);const patchSet={};
            (function walk(n){const b=tmap.get(n.id);if(b&&b.kind===n.kind){const styles={};for(const [k,v] of Object.entries(n.styles||{}))if(b.styles[k]!==v)styles[k]=v;const attributes={};for(const [k,v] of Object.entries(n.attributes||{}))if(b.attributes[k]!==v)attributes[k]=v;const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==b.text)patch.text=n.text;if(Object.keys(patch).length)patchSet[n.id]=patch;}(n.children||[]).forEach(walk);})(node);
            if(!Object.keys(patchSet).length)continue;
            const key=JSON.stringify(s.when);let v=built.variants.find(x=>JSON.stringify(x.when)===key);
            if(!v){v={id:'cv-tree-'+M4.id(Object.values(s.when).join('-')),name:Object.values(s.when).join(' / '),when:{...s.when},overrides:{}};built.variants.push(v);}
            v.overrides={...v.overrides,...patchSet};
          }
        }
        // Every row, branch and label group hugs its content vertically; only the small marks keep their own sizes, and the tree is a fixed 200px wide.
        const keepH=id=>/^(toggle|spacer|icon|check)-/.test(id)||id==='tree-items-loading';
        (function strip(n){if(n.kind!=='text'&&n.styles&&!keepH(n.id)&&n.tag!=='svg'&&!/^(toggle|icon|check)-/.test(n.id)){const st={...n.styles};st.height='auto';delete st.maxHeight;n.styles=st;}(n.children||[]).forEach(strip);})(anatomy);
        for(const v of built.variants)for(const [id,o] of Object.entries(v.overrides||{}))if(!keepH(id)&&!/^(toggle|icon|check)-/.test(id)&&o.styles&&'height' in o.styles){const st={...o.styles};delete st.height;o.styles=st;}
        anatomy.styles={...anatomy.styles,width:'200px','--ads-fixed-width':'1'};
        // The label group fills the row so a long label wraps/clips inside it; rows are stacked full width.
        (function lg(n){if(/^labelgroup-\d$/.test(n.id)&&n.styles)n.styles={...n.styles,display:'flex',flexDirection:'column',flexGrow:'1'};if(/^(row|node)-\d$/.test(n.id)&&n.styles)n.styles={...n.styles,alignSelf:'stretch'};(n.children||[]).forEach(lg);})(anatomy);
      }
      return {anatomy,properties,selection,variants:built.variants};
    }
    // Spin: no Size/Radius multiselect at all - TYPES here is genuinely
    // Size (Small/Default/Large ring diameter), not an Appearance axis, so
    // it's named 'size' rather than reusing the generic early-return
    // path's 'appearance' label. Label only exists structurally for "With
    // label"/"Overlay" (not "Spinning", which is deliberately bare per the
    // component's own spec) - harvested from "With label" specifically
    // when the base capture doesn't already have it, same single-value
    // visibleWhen pattern used throughout (gated on State not equalling
    // "Spinning").
    function captureSpinProperties(){
      const M=window.ADSComponentContract;
      const labelInput=document.querySelector('[data-role="spin-label-input"]');
      const baseAnatomy=snapshot(selected.root,'root',0);
      const originalType=selected.type,originalState=selected.state;
      const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(baseAnatomy);
      const sweep=gatherEntries();
      const sizeOptions=[...new Set(sweep.map(e=>e.type))];
      const stateOptions=[...new Set(sweep.map(e=>e.state))];
      const variants=[];
      for(const entry of sweep){
        if(entry.type===originalType&&entry.state===originalState)continue;
        const variantAnatomy=snapshot(entry.root,'root',0),overrides={};
        (function walk(n){
          const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
          if(baseNode){
            const styles={};for(const [name,value]of Object.entries(n.styles))if(baseNode.styles[name]!==value)styles[name]=value;
            const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
            for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
            const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text)patch.text=n.text;
            if(Object.keys(patch).length)overrides[n.id]=patch;
          }
          for(const child of n.children||[])walk(child);
        })(variantAnatomy);
        const when={state:entry.state,size:entry.type};
        const variantName=[entry.type,entry.state].filter(Boolean).join(' / ');
        if(Object.keys(overrides).length)variants.push({id:'cv-'+M.id(variantName),name:variantName,when,overrides});
      }
      const properties=[{id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState}];
      const selection={state:originalState};
      if(sizeOptions.length>1){properties.push({id:'size',name:'Size',type:'options',options:sizeOptions,default:originalType});selection.size=originalType;}

      function findPart(n,partId){if(n.id===partId)return n;for(const c of n.children||[]){const r=findPart(c,partId);if(r)return r;}return null;}
      const spinningLabel=stateOptions.find(l=>/spinning/i.test(l));
      const withLabelState=stateOptions.find(l=>/with label/i.test(l));
      let labelNode=findPart(baseAnatomy,'label');
      if(!labelNode&&withLabelState){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.state===withLabelState);
        labelNode=entry&&findPart(snapshot(entry.root,'root',0),'label');
        if(labelNode)baseAnatomy.children.push(labelNode);
      }
      if(labelNode){
        labelNode.bind='label';
        if(spinningLabel)labelNode.visibleWhen=[{property:'state',equals:spinningLabel,not:true}];
        const def=labelInput?.value.trim()||labelNode.text||'Loading...';
        properties.push({id:'label',name:'Label',type:'text',default:def});
        selection.label=def;
      }

      return {anatomy:baseAnatomy,properties,selection,variants};
    }
    // Skeleton: Appearance (layout)/State already cross generically via
    // captureFormFieldProperties()/captureCrossedProperties() (no label/
    // required/etc controls, so the early-return path handles it; no Size/
    // Radius either, so this is the Appearance-crossing branch added for
    // Timeline/Tree). Rows changes how many placeholder line blocks render
    // (1-5) - the same structural-count limit as Group Button's segment
    // count/Rating's Scale - so it stays an orphan editable property.
    function captureSkeletonProperties(){
      const built=captureFormFieldProperties();
      const properties=[...built.properties];const selection={...built.selection};
      const rowsInput=document.querySelector('[data-role="skeleton-rows-input"]');
      if(rowsInput){
        properties.push({id:'rows',name:'Rows',type:'text',default:rowsInput.value.trim()||'3'});
        selection.rows=rowsInput.value.trim()||'3';
      }
      return {anatomy:built.anatomy,properties,selection,variants:built.variants};
    }
    // Group Button's own version of captureButtonProperties() above - same
    // two gaps, same fixes. Before this, Group Button only ever exposed a
    // bare "State" property: Size and Corner radius stayed page-level
    // choices (never crossed into real Figma variants the way Button's are),
    // and no segment's label was bound to an editable Text property at all,
    // so every drawn instance showed permanently frozen copy. This mirrors
    // Button's approach - sweep Size x Corner radius x State into crossed
    // variants (Type/appearance, like Button's, stays a page-level choice),
    // and bind each segment's own label text - adapted for a track of N
    // segments instead of one button.
    function findLabelNode(segment){
      const nested=(segment.children||[]).find(n=>n.kind==='text');
      if(nested)return nested;
      return (!segment.children||!segment.children.length)&&segment.text?segment:null;
    }
    function captureGroupButtonProperties(){
      const M=window.ADSComponentContract;
      const sizeControl=document.querySelector('[data-role="group-size-mount"]');
      const radiusControl=document.querySelector('[data-role="group-radius-mount"]');
      const showLabelInput=document.querySelector('[data-role="group-show-label"]');
      const fieldLabelInput=document.querySelector('[data-role="group-field-label"]');
      const showSupportingInput=document.querySelector('[data-role="group-show-supporting"]');
      const supportingTextInput=document.querySelector('[data-role="group-supporting-text"]');
      // buildGroupButton() wraps the track in an extra .group-btn-field div
      // (holding an optional Field label <p> before it and an optional
      // Supporting text <p> after it) only when either is non-empty -
      // selected.root is that wrapper when present, the track itself
      // otherwise. Identify the live track by which child actually has
      // <button> segments, rather than assuming root IS the track.
      const isTrack=el=>[...el.children].some(c=>c.tagName==='BUTTON');
      const liveTrack=isTrack(selected.root)?selected.root:[...selected.root.children].find(isTrack);
      const rootAnatomy=snapshot(selected.root,'root',0);
      const trackIsRoot=isTrack(selected.root);
      const trackIndex=trackIsRoot?-1:rootAnatomy.children.findIndex((c,i)=>isTrack([...selected.root.children][i]));
      const anatomy=trackIsRoot?rootAnatomy:rootAnatomy.children[trackIndex];
      const segments=[...liveTrack.children];
      const originalType=selected.type,originalState=selected.state,originalConfig=selected.config;
      const [originalSize,originalRadius]=originalConfig.split(' / ');
      // Same literal-color fix as the sweep below applies to its own
      // overrides - needed here too in case the page's own current
      // selection (whatever was live when "Draw in Figma" was clicked) IS
      // itself the Selected state, so the base capture carries the same
      // ambiguous-token risk the variant sweep guards against.
      if(originalState==='Selected'&&anatomy.children[0]){
        if(originalType==='Filled'){anatomy.children[0].styles.backgroundColor='var(--red-500)';anatomy.children[0].styles.color='#FFFFFF';}
        else if(originalType==='Outlined'){anatomy.children[0].styles.backgroundColor='var(--red-tint)';anatomy.children[0].styles.color='var(--red-500)';}
      }
      const sameGroup=entries.filter(e=>e.config===selected.config&&e.type===selected.type);
      const stateOptions=[...new Set(sameGroup.map(e=>e.state))];
      // .group-btn (the track) never declares a CSS width OR height - it's
      // plain inline-flex, shrink-to-fit on both axes, stretching to its
      // tallest segment rather than any size of its own - and each
      // .group-btn-segment never declares a width either, except a segment
      // with Content="icon", which deliberately forces width to match its
      // own (explicitly declared, per-size) height for a square button
      // (same convention as Button's own .is-icon-only). getComputedStyle
      // always resolves a hug dimension to a concrete pixel number
      // regardless of which behavior is intended, so left unmarked every
      // master's track got whatever width/height its segments happened to
      // measure at capture time baked in as FIXED, defeating Auto Layout's
      // hug-content resize entirely. `hug` tracks which (node id, property)
      // pairs must stay hugged so the sweep below can both force them and
      // skip re-diffing them per variant.
      const hug=new Map([[anatomy.id,new Set(['width','height'])]]);
      anatomy.styles.width='auto';anatomy.styles.height='auto';
      anatomy.children.forEach((child,i)=>{if(!segments[i]?.classList.contains('is-icon-only')){child.styles.width='auto';hug.set(child.id,new Set(['width']));}});
      // Bind whichever node actually carries each segment's visible text
      // (the segment itself for plain Content="text", a nested <span> for
      // "icon-text") to its own Text property - Content="icon" has no
      // visible text node to bind, so that segment is left out entirely.
      const boundIds=new Set(),labelProperties=[],labelDefaults={};
      anatomy.children.forEach((child,i)=>{
        const labelNode=findLabelNode(child);if(!labelNode)return;
        const id='label'+i,defaultText=labelNode.text||'Option '+String.fromCharCode(65+i);
        labelNode.bind=id;boundIds.add(labelNode.id);
        labelDefaults[id]=defaultText;labelProperties.push({id,name:'Segment '+(i+1)+' label',type:'text',default:defaultText});
      });
      // Other group-button-family layouts, if any ever reuse this function,
      // won't expose these role names - fall back to the plain state-only
      // property set every other page already uses (same guard as Button's).
      if(!sizeControl||!radiusControl){
        return stateOptions.length>1
          ?{anatomy,properties:[{id:'state',name:'State',type:'options',options:stateOptions,default:selected.state},...labelProperties],selection:{state:selected.state,...labelDefaults},variants:captureStateVariants(anatomy,sameGroup)}
          :{anatomy,properties:labelProperties,selection:labelDefaults,variants:[]};
      }
      // render() rebuilds matrixContainer.innerHTML on every toggle below,
      // so `selected.root`/`entries` captured before a toggle go stale
      // immediately after - same bug class as Button's Loading-harvest fix.
      // Re-locate the matching cell fresh via gatherEntries() each time
      // instead of reusing a pre-toggle reference.
      function currentTrackAnatomy(){
        const entry=gatherEntries().find(e=>e.type===originalType&&e.config===originalConfig&&e.state===originalState);
        if(!entry)return null;
        const fresh=snapshot(entry.root,'root',0);
        const freshIsTrack=isTrack(entry.root);
        if(freshIsTrack)return {root:fresh,track:fresh};
        const idx=fresh.children.findIndex((c,i)=>isTrack([...entry.root.children][i]));
        return {root:fresh,track:fresh.children[idx]};
      }
      const originalShowLabel=showLabelInput?showLabelInput.checked:false;
      const originalShowSupporting=showSupportingInput?showSupportingInput.checked:false;
      let fieldLabelNode=null,supportingFieldNode=null;
      const originalNative=readNative();
      const variants=[];let sizeOptions=[],radiusOptions=[],typeOptions=new Set();
      applyingFoundation=true;
      try{
        // Harvest Field label and Supporting text fresh every time (briefly
        // forcing both on), the same way Float Button harvests its tooltip
        // and badge - guarantees a consistent wrapper structure to bind
        // Boolean visibility onto regardless of whether either is currently
        // shown.
        // Forcing Show field label/Show supporting text alone is enough -
        // render() falls back to a non-empty default ("View" /
        // "Choose how to display your results.") whenever the box is
        // checked but its own text field is still empty, so there is no
        // need to also fake the text input's value here.
        if(showLabelInput){
          if(!originalShowLabel){showLabelInput.checked=true;showLabelInput.dispatchEvent(new Event('change',{bubbles:true}));}
          const {root}=currentTrackAnatomy()||{};
          fieldLabelNode=root?.children?.[0]?.tag==='p'?root.children[0]:null;
          if(!originalShowLabel){showLabelInput.checked=false;showLabelInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(showSupportingInput){
          if(!originalShowSupporting){showSupportingInput.checked=true;showSupportingInput.dispatchEvent(new Event('change',{bubbles:true}));}
          const {root}=currentTrackAnatomy()||{};
          const last=root?.children?.[root.children.length-1];
          supportingFieldNode=root&&root.children.length>1&&last?.tag==='p'?last:null;
          if(!originalShowSupporting){showSupportingInput.checked=false;showSupportingInput.dispatchEvent(new Event('change',{bubbles:true}));}
        }
        if(fieldLabelNode){fieldLabelNode.bind='fieldLabel';boundIds.add(fieldLabelNode.id);}
        if(supportingFieldNode){supportingFieldNode.bind='supportingText';boundIds.add(supportingFieldNode.id);}

        for(const control of [sizeControl,radiusControl]){const all=control.querySelector('.multiselect-option-all input[type=checkbox]');if(all&&!all.checked){all.checked=true;all.dispatchEvent(new Event('change',{bubbles:true}));}}
        // Every offered radius must remain valid in the exported selection,
        // including Full - Pill. Dropping it makes all four export actions
        // fail validation when the user selects that option.
        const sweep=gatherEntries();
        const base=new Map();(function walk(n){base.set(n.id,n);for(const child of n.children||[])walk(child);})(anatomy);
        const seenSize=new Set(),seenRadius=new Set();
        for(const entry of sweep){
          const [sizeLabel,radiusLabel]=entry.config.split(' / ');
          seenSize.add(sizeLabel);seenRadius.add(radiusLabel);typeOptions.add(entry.type);
          if(entry.type===originalType&&entry.config===originalConfig&&entry.state===originalState)continue;
          const entryIsTrack=isTrack(entry.root);
          const entryFresh=snapshot(entry.root,'root',0);
          const variantAnatomy=entryIsTrack?entryFresh:entryFresh.children[entryFresh.children.findIndex((c,i)=>isTrack([...entry.root.children][i]))];
          const overrides={};
          (function walk(n){
            const baseNode=base.get(n.id)?.kind===n.kind?base.get(n.id):null;
            if(baseNode){
              const styles={};for(const [name,value]of Object.entries(n.styles))if(hug.get(n.id)?.has(name)){}else if(baseNode.styles[name]!==value)styles[name]=value;
              // Keep the selected-state foreground contract explicit even
              // when a temporary capture has no matching authored rule.
              if(n.id==='root-0'&&entry.state==='Selected'){
                if(entry.type==='Filled'){styles.backgroundColor='var(--red-500)';styles.color='#FFFFFF';}
                else if(entry.type==='Outlined'){styles.backgroundColor='var(--red-tint)';styles.color='var(--red-500)';}
              }
              const attributes={};for(const [name,value]of Object.entries(n.attributes))if(baseNode.attributes[name]!==value)attributes[name]=value;
              for(const name of Object.keys(baseNode.attributes||{}))if(!(name in n.attributes))attributes[name]=null;
              // A bound label's text is driven by its property at compile
              // time; a literal text patch here would silently override that
              // for this one variant instead (patch.text wins over bind).
              const patch={};if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;if(n.text!==baseNode.text&&!boundIds.has(n.id))patch.text=n.text;
              if(Object.keys(patch).length)overrides[n.id]=patch;
            }
            for(const child of n.children||[])walk(child);
          })(variantAnatomy);
          const variantName=entry.type+' / '+sizeLabel+' / '+radiusLabel+' / '+entry.state;
          if(Object.keys(overrides).length)variants.push({id:'bv-'+M.id(variantName),name:variantName,when:{appearance:entry.type,size:sizeLabel,radius:radiusLabel,state:entry.state},overrides});
        }
        sizeOptions=[...seenSize];radiusOptions=[...seenRadius];
      }finally{
        restoreNative(originalNative);applyingFoundation=false;refresh();
      }

      const finalTrack={...anatomy};
      const rootChildren=[finalTrack];
      // fieldLabelNode/supportingFieldNode were captured from a SEPARATE
      // snapshot (the wrapper's own, positionally starting from 'root'
      // again), so their ids collide with the track's own "root-N"
      // children - rename them, now that the sweep (which keyed every
      // override to the track's original ids) is already finished.
      if(fieldLabelNode)rootChildren.unshift({...fieldLabelNode,id:'field-label',visibleWhen:[{property:'showFieldLabel',equals:true}]});
      if(supportingFieldNode)rootChildren.push({...supportingFieldNode,id:'field-supporting',visibleWhen:[{property:'showSupportingText',equals:true}]});
      // The track already owns id "root" (every override above was keyed
      // against it); the synthetic wrapper needs its own distinct id rather
      // than colliding with it - adapter.js reads c.anatomy.id dynamically
      // rather than assuming "root", so any unique id works as the new top.
      const finalAnatomy=(fieldLabelNode||supportingFieldNode)?{id:'field',name:'Group Button field',kind:'container',tag:'div',styles:{display:'flex',flexDirection:'column',gap:'var(--space-8)',width:'auto',height:'auto'},attributes:{},text:'',children:rootChildren}:finalTrack;

      const properties=[
        {id:'state',name:'State',type:'options',options:stateOptions.length?stateOptions:[originalState],default:originalState},
        {id:'appearance',name:'Appearance',type:'options',options:[...typeOptions],default:originalType},
        {id:'size',name:'Size',type:'options',options:sizeOptions.length?sizeOptions:[originalSize],default:originalSize},
        {id:'radius',name:'Corner radius',type:'options',options:radiusOptions.length?radiusOptions:[originalRadius],default:originalRadius},
        ...labelProperties
      ];
      const selection={state:originalState,appearance:originalType,size:originalSize,radius:originalRadius,...labelDefaults};
      if(fieldLabelNode){
        const def=fieldLabelInput?.value.trim()||fieldLabelNode.text||'View';
        properties.push({id:'fieldLabel',name:'Field label',type:'text',default:def});selection.fieldLabel=def;
        properties.push({id:'showFieldLabel',name:'Show field label',type:'boolean',default:originalShowLabel});selection.showFieldLabel=originalShowLabel;
      }
      if(supportingFieldNode){
        const def=supportingTextInput?.value.trim()||supportingFieldNode.text||'Choose how to display your results.';
        properties.push({id:'supportingText',name:'Supporting text',type:'text',default:def});selection.supportingText=def;
        properties.push({id:'showSupportingText',name:'Show supporting text',type:'boolean',default:originalShowSupporting});selection.showSupportingText=originalShowSupporting;
      }
      return {anatomy:finalAnatomy,properties,selection,variants};
    }
    function snapshot(element,path,depth){
      if(depth===0){window.ADSFoundation.preparePreview?.(element);authoredBindings?.reset();}
      if(depth>24)throw new Error('This preview exceeds the supported export depth.');
      path=element.dataset.contractPart||path;
      // A childless <span>/<p>/etc defaults to kind:'text' here purely by
      // tag name - correct for an actual text label, wrong for something
      // like Radio's circle or Checkbox's box: a bordered/background
      // SHAPE that's only sometimes childless (no inner dot/icon for
      // some states) but is NEVER actually glyph content. Figma TEXT
      // nodes can only carry a glyph color, never a border or background
      // shape, so misclassifying it this way silently drops its entire
      // visible appearance - the circle/box render as invisible in every
      // state whose variant happens to have no child at capture time.
      // data-contract-kind lets a specific element force the real kind,
      // overriding the tag-based guess, for exactly this case.
      const M=window.ADSComponentContract,tag=element.localName,computed=getComputedStyle(element),n={id:path,name:element.dataset.contractName||element.getAttribute('aria-label')||tag,kind:element.dataset.contractKind||(tag==='svg'?'icon':!element.children.length&&['span','p','strong','small','label','h1','h2','h3','h4','h5','h6'].includes(tag)?'text':'container'),tag:M.TAGS.includes(tag)?tag:'div',styles:{},attributes:{},text:[...element.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(''),children:[]};
      const properties=['display','position','top','right','bottom','left','z-index','float','clear','flex-direction','align-items','align-self','align-content','justify-content','justify-self','flex-wrap','flex-grow','flex-shrink','flex-basis','order','gap','row-gap','column-gap','grid-template-columns','grid-template-rows','grid-auto-flow','grid-auto-columns','grid-auto-rows','grid-column','grid-row','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','width','height','min-width','max-width','min-height','max-height','box-sizing','overflow','overflow-x','overflow-y','background-color','background-image','background-size','background-position','background-repeat','color','border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-style','border-right-style','border-bottom-style','border-left-style','border-top-color','border-right-color','border-bottom-color','border-left-color','border-style','border-color','border-radius','border-top-left-radius','border-top-right-radius','border-bottom-left-radius','border-bottom-right-radius','box-shadow','font-family','font-size','font-weight','font-style','font-variant-numeric','line-height','letter-spacing','text-align','text-transform','text-indent','white-space','word-break','overflow-wrap','text-overflow','opacity','outline','outline-offset','text-decoration','cursor','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','stroke-dasharray','vertical-align','border-collapse','border-spacing','table-layout','list-style-type','list-style-position','object-fit','object-position','transform','transform-origin','visibility'];
      for(const property of properties){const inline=element.style.getPropertyValue(property),refs=[...inline.matchAll(/var\(\s*(--[\w-]+)/g)],known=refs.every(match=>match[1] in window.ADSFoundation.get().tokens),computedValue=computed.getPropertyValue(property),value=inline&&known?inline:(property!=='font-style'&&authoredBindings?.read(element,property))||matchToken(computedValue,property)||computedValue;if(value&&!/[<>{};]|url\s*\(/i.test(value))n.styles[toCamel(property)]=convertLengths(value);}
      for(const attribute of element.getAttributeNames())if(/^(aria-[\w-]+|id|for|name|readonly|required|maxlength|minlength|role|title|type|value|placeholder|disabled|checked|href|src|alt|viewBox|d|cx|cy|r|x|y|x1|x2|y1|y2|width|height|rx|ry|points|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|xmlns|max|min|step|rows|colspan|rowspan)$/.test(attribute)){
        const value=element.getAttribute(attribute);if(['href','src'].includes(attribute)&&!/^(?:https?:|#|data:image\/(?:png|jpeg|webp|gif);base64,|[a-zA-Z0-9_.-]+(?:\/|$))/.test(value))continue;n.attributes[attribute]=value;
      }
      // A childless <span>/<i> with no text that is painted (a background or a border: Table's status dot, Timeline's marker and connector, Splitter's grip,
      // an unchecked checkbox box) is a shape, not a text label. Classified as text it had no way to carry its fill or border and vanished in Figma.
      if(!element.dataset.contractKind&&n.kind==='text'&&!element.children.length&&!(element.textContent||'').trim()&&tag!=='svg'){
        const bgc=computed.backgroundColor,painted=(bgc&&!/^rgba\(0, 0, 0, 0\)$|^transparent$/.test(bgc))||['Top','Right','Bottom','Left'].some(side=>parseFloat(computed['border'+side+'Width'])>0&&computed['border'+side+'Style']!=='none');
        if(painted)n.kind='container';
      }
      if('value'in element&&['input','textarea','select'].includes(tag))n.attributes.value=element.value;
      if(tag==='input'){const placeholder=getComputedStyle(element,'::placeholder');n.styles['--ads-placeholder-color']=matchToken(placeholder.color,'color')||placeholder.color;n.styles['--ads-placeholder-opacity']=placeholder.opacity;}
      if(tag==='textarea')n.text=element.value;
      if(element instanceof HTMLInputElement&&['checkbox','radio'].includes(element.type)){if(element.checked)n.attributes.checked='';else delete n.attributes.checked;}
      // Mixed text must retain its position around icons and inline child elements.
      // The contract renderer places node.text before children, so represent those
      // text nodes explicitly instead of concatenating them ahead of the icon.
      //
      // .ads-required is a SEPARATE, site-wide accessibility helper
      // (foundation-runtime.js's indicators()) that scans every real
      // <label> wrapping a required native input and appends a visible
      // "*" marker - a legitimate feature for the app's own real forms
      // (Properties panel fields, Settings, etc.), but the Live Preview
      // stage's own <label> (selected.root, captured as this contract's
      // anatomy) is ALSO a real <label> with a real required attribute
      // whenever a component's own Required property is on, so the SAME
      // site-wide scan quietly injects its own "*" span into the stage
      // too - a stray, unbound, always-visible duplicate of whatever
      // asterisk the component's own Required feature already built,
      // showing up as an extra floating "*" with no property binding at
      // all. Skip it the same way script/style tags are already skipped.
      if(element.children.length){n.text='';let index=0;for(const [textIndex,child]of [...element.childNodes].entries()){
        if(child.nodeType===1){const childIndex=index++;if(getComputedStyle(child).display!=='none'&&!['script','style'].includes(child.localName)&&!child.classList.contains('ads-required'))n.children.push(snapshot(child,path+'-'+childIndex,depth+1));}
        else if(child.nodeType===3&&child.textContent.trim()){
          // This bare text node has no DOM element of its own to read
          // getComputedStyle()/trace a token from, so it was hardcoded to
          // styles:{} - losing every inherited font/color property (and,
          // critically, the var(--type-body-*) TOKEN TRACE, not just the
          // resolved pixel value) the moment a label's own text run sat
          // next to a real sibling element (a required asterisk, a nested
          // icon) and the outer element got classified as a container
          // instead of captured directly as kind:'text'. Any component
          // whose label+required-asterisk harvest forces the asterisk on
          // during capture (Slider, Rating) hit this - the asterisk itself
          // came through fine (it's snapshotted as a real recursive
          // element), but the label's OWN "Volume"/"Rate this product"
          // text pushed to Figma with no bound Foundation variable at all
          // (reported: label "not synced with Foundation"). A bare text
          // node inherits every one of these properties from its direct
          // parent `element`, so trace them there the same way the
          // ::before/::after synthetic shape below already does.
          const textStyles={};
          for(const property of ['color','font-family','font-size','font-weight','font-style','line-height','letter-spacing','text-align']){
            const computedValue=computed.getPropertyValue(property),value=(property!=='font-style'&&authoredBindings?.read(element,property))||matchToken(computedValue,property)||computedValue;
            if(value&&!/[<>{};]|url\s*\(/i.test(value))textStyles[toCamel(property)]=convertLengths(value);
          }
          n.children.push({id:path+'-text-'+textIndex,name:'Text',kind:'text',tag:'span',text:child.textContent,styles:textStyles,attributes:{},children:[]});
        }
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
    async function copyExport(kind){const button=exportActions.querySelector('[aria-label="'+(kind==='prompt'?'Copy prompt':'Copy preview code')+'"]');try{const c=capture();await window.ADSClipboard.copyWithFeedback(kind==='prompt'?window.ADSComponentContract.prompt(c):window.ADSContracts.code(c),button);}catch(error){updateStatus('Export failed: '+error.message);}}
    function exportFile(kind){try{const c=capture();window.ADSContracts.download(kind==='json'?c:window.ADSContracts.code(c),c.id+'-preview.'+(kind==='json'?'json':'html'));}catch(error){updateStatus('Export failed: '+error.message);}}
    window.ADSWorkbench={active:true,capture,getState:()=>clone({...state,native:readNative()}),selectedElement:()=>selected?.root,storageKey};
    window.addEventListener('ads:foundation-applied',syncLengthUnit);
    applyingFoundation=true;try{restoreNative(state.native);}finally{applyingFoundation=false;}syncFoundationPresets();refresh();dirty=false;updateStatus();
  }
})();
