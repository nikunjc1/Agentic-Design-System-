/* One application path for first paint, same-page edits, reset and other tabs. */
(() => {
  'use strict';
  const M=window.ADSFoundationModel, root=document.documentElement;
  const keys=['colors','bg-colors','status-colors','neutral-colors','typography','spacing','sizing','radius','border','border-states','shadow','icons','grid-layout','units','data-format'];
  const drafts=new Map(), previous=new Set();
  function read(key) { if(drafts.has(key)) return drafts.get(key); try { return JSON.parse(localStorage.getItem('ads:'+key)||'null'); } catch { return null; } }
  function preference(key,fallback,choices) { try { const v=localStorage.getItem('ads:'+key);return choices.includes(v)?v:fallback; } catch { return fallback; } }
  root.dataset.theme=preference('theme','light',['light','dark']);root.dataset.density=preference('density','comfortable',['comfortable','compact']);root.dir=preference('direction','ltr',['ltr','rtl']);
  let resolved;
  const fontAssets=new Map();
  function apply() {
    const saved=Object.fromEntries(keys.map(k=>[k,read(k)]));
    let profile=null;try { profile=window.ADSProject?window.ADSProject.read(localStorage):JSON.parse(localStorage.getItem('ads:project-profile:v1')||'null'); } catch {}
    resolved=M.resolve(saved,root.dataset.theme,profile);
    for(const prop of previous) if(!(prop in resolved.tokens)) root.style.removeProperty(prop);
    previous.clear();for(const [prop,value] of Object.entries(resolved.tokens)) {if(root.style.getPropertyValue(prop)!==value) root.style.setProperty(prop,value);previous.add(prop);}
    root.dataset.foundationUnit=resolved.unit;root.dataset.gridSystem=resolved.gridSystem;root.dataset.iconStyle=resolved.iconStyle;
    root.dataset.borderSides=resolved.tokens['--border-sides'];
    const typo=saved.typography||{};
    for(const f of [typo.primaryFont,typo.secondaryFont]) if(f&&f.linkHref) {
      try { const url=new URL(f.linkHref,location.href);if(url.protocol==='https:'&&!Array.from(document.querySelectorAll('link[rel=stylesheet]')).some(l=>l.href===url.href)) {const link=document.createElement('link');link.rel='stylesheet';link.href=url.href;document.head.append(link);} } catch {}
    }
    for(const f of [typo.primaryFont,typo.secondaryFont]) if(f&&f.family&&typeof f.dataUrl==='string'&&/^data:[\w.+/-]*;base64,[A-Za-z0-9+/=]+$/.test(f.dataUrl)&&f.dataUrl.length<3000000) {
      if(fontAssets.get(f.family)===f.dataUrl) continue;
      fontAssets.set(f.family,f.dataUrl);
      try {const face=new FontFace(f.family,'url("'+f.dataUrl+'")');face.load().then(loaded=>{document.fonts.add(loaded);scheduleText();}).catch(()=>{fontAssets.delete(f.family);window.dispatchEvent(new CustomEvent('ads:font-error',{detail:{family:f.family}}));});}catch{fontAssets.delete(f.family);}
    }
    if(document.body) { bindExamples();renderData();updateUnits(); scheduleText(); }
    window.dispatchEvent(new CustomEvent('ads:foundation-applied',{detail:resolved}));
    return resolved;
  }
  window.ADSFoundation={ apply, get:()=>resolved, format:(value,kind,options)=>M.format(value,kind,resolved.dataFormat,options), prepareCode:text=>M.prepareCode(text,resolved), read };
  window.addEventListener('ads:foundation-change',e=>{const key=e.detail.key.replace(/^ads:/,'');if(!keys.includes(key)) return;if(e.detail.removed) drafts.delete(key);else drafts.set(key,e.detail.value);queueMicrotask(apply);});
  window.addEventListener('storage',e=>{
    if(e.key===null) {drafts.clear();root.dataset.theme=preference('theme','light',['light','dark']);root.dataset.density=preference('density','comfortable',['comfortable','compact']);root.dir=preference('direction','ltr',['ltr','rtl']);}else drafts.delete(e.key.replace(/^ads:/,''));
    apply();
    const editor=location.pathname.match(/\/(foundations|typography|spacing|radius|borders|shadows|icons|grid-layout|data-format)\.html$/)?.[1];
    const editorKeys={foundations:['colors','bg-colors','status-colors','neutral-colors'],typography:['typography'],spacing:['spacing','sizing'],radius:['radius'],borders:['border','border-states'],shadows:['shadow'],icons:['icons','sizing'],'grid-layout':['grid-layout','sizing'],'data-format':['data-format']};
    if(!editor||!document.body||!(e.key===null||editorKeys[editor].some(k=>e.key==='ads:'+k))) return;
    const main=document.querySelector('main');if(main.querySelector('.ads-editor-conflict'))return;
    const notice=document.createElement('div');notice.className='ads-editor-conflict';notice.setAttribute('role','status');notice.textContent='Foundation changed in another tab. Reload to refresh these controls before editing. ';
    const reload=document.createElement('button');reload.type='button';reload.className='btn btn-ghost';reload.textContent='Reload controls';reload.addEventListener('click',()=>location.reload());notice.append(reload);
    main.querySelectorAll('input,select,textarea,button').forEach(el=>{if(!el.closest('.ads-foundation-toolbar')&&!el.matches('.ads-read-more,.guide-toggle-btn'))el.disabled=true;});
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
      if(el.matches('td,th')) el.style.textAlign=resolved.dataFormat.tableAlign;
    });
    document.querySelectorAll('[data-format-space]').forEach(el=>{const chars={space:' ',nbsp:'\u00a0',narrow:'\u202f'};const value='Before'+chars[resolved.dataFormat.escapedSpace]+'After';if(el.textContent!==value) el.textContent=value;});
    document.querySelectorAll('.daterange-demo-arrow').forEach(el=>{if(el.textContent!==resolved.dataFormat.range)el.textContent=resolved.dataFormat.range;});
  }
  function bindExamples() {
    // Annotate actual value surfaces only; prose, IDs, phone numbers and code stay literal.
    document.querySelectorAll('main td, main .statistic-demo-value-text, main .description-demo-value').forEach(el=>{
      if(el.dataset.format||el.children.length) return;
      const value=el.textContent.trim();
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
      const role=roleMatch?roleMatch[1]:/px$/.test(size)?roles[parseFloat(size)]||'body':null;
      if(role) for(const [prop,suffix] of [['fontSize','size'],['fontWeight','weight'],['fontStyle','style'],['lineHeight','line-height'],['letterSpacing','tracking']]) {const val='var(--type-'+role+'-'+suffix+')';if(el.style[prop]!==val) el.style[prop]=val;}
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
      const px=display.value===''?'':M.convert(display.value,resolved.unit,'px');
      input.value=px;input.dispatchEvent(new Event(event.type,{bubbles:true}));
      display.setAttribute('aria-invalid',input.getAttribute('aria-invalid')==='true'?'true':'false');
    }
    display.addEventListener('input',commit);display.addEventListener('change',commit);
    select.addEventListener('change',()=>setUnit(select.value));
  }
  function setUnit(unit) { if(window.ADSStorage) window.ADSStorage.safeSet('ads:units',{unit}); }
  function updateUnits() {
    if(!document.body) return;
    document.querySelectorAll('[data-foundation-unit]').forEach(s=>{
      if(s.type==='radio') s.checked=s.value===resolved.unit;
      else s.value=resolved.unit;
    });
    // Only dimensions: percentages, weights, columns, opacity and time stay unchanged.
    document.querySelectorAll('input[data-dimension], input[data-role="grid-gutter-input"], input[data-role="letter-spacing"]').forEach(unitControl);
    unitInputs.forEach(({display,select},input)=>{
      if(document.activeElement!==display) display.value=input.value===''?'':M.convert(input.value,'px',resolved.unit);
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
    const btn=document.createElement('button');btn.type='button';btn.className='ads-read-more btn btn-primary';btn.textContent='Read More';btn.setAttribute('aria-controls',wrapper.id);btn.setAttribute('aria-expanded','false');btn.hidden=true;
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
    const limit=line*READ_MORE_LINES;
    wrapper.style.setProperty('--ads-clamp-height',limit+'px');
    // Measure the full text: clamped scrollHeight differs between browsers.
    wrapper.classList.remove('ads-text-clamped');
    const overflow=wrapper.scrollHeight>limit+1;
    if(!overflow) {unwrapTextGroup(wrapper);return;}
    const expanded=overflow&&btn.getAttribute('aria-expanded')==='true';
    wrapper.classList.toggle('ads-text-clamped',overflow&&!expanded);
    btn.setAttribute('aria-expanded',String(expanded));
    btn.textContent=expanded?'Read Less':'Read More';
    btn.hidden=!overflow;
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
    const toolbar=document.createElement('div');toolbar.className='ads-foundation-toolbar';toolbar.innerHTML='<div class="ads-unit-choice" role="radiogroup" aria-labelledby="ads-unit-label" aria-describedby="ads-unit-note"><span id="ads-unit-label">Design units</span><div class="ads-unit-options">'+['px','rem'].map(unit=>'<label class="radio-demo-field"><input class="radio-demo-input" type="radio" name="ads-design-unit" data-foundation-unit value="'+unit+'"><span class="radio-demo-circle radio-demo-circle--h16" aria-hidden="true"><span class="radio-demo-dot radio-demo-dot--h16"></span></span><span class="radio-demo-label">'+unit+'</span></label>').join('')+'</div></div><span class="ads-unit-note" id="ads-unit-note">1 rem = 16 px at the default browser size.</span>';
    const intro=main.querySelector(':scope > .component-meta')||main.querySelector(':scope > .page-lede')||main.querySelector(':scope > h1');if(intro) intro.after(toolbar);else main.prepend(toolbar);
    toolbar.addEventListener('change',e=>{if(e.target.matches('[data-foundation-unit]')&&e.target.checked) setUnit(e.target.value);});
    const exportButton=document.createElement('button');exportButton.type='button';exportButton.className='btn-demo btn-demo--neutral btn-demo--h40';exportButton.textContent='Export Foundation JSON';toolbar.append(exportButton);
    exportButton.addEventListener('click',()=>{const payload={schemaVersion:1,settings:Object.fromEntries(keys.map(k=>[k,read(k)])),resolved:window.ADSFoundation.get()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='damco-foundation.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    if(['spacing.html','grid-layout.html','icons.html'].some(p=>location.pathname.endsWith(p))) {
      const details=document.createElement('details');details.className='panel ads-sizing';details.innerHTML='<summary>Shared sizing</summary><p>Sizes apply to controls, targets, icons and the documentation layout. Touch targets remain at least 44 px.</p>';
      const current=read('sizing')||{};
      for(const [key,min,max] of [['control',24,96],['target',44,96],['icon',12,64],['content',320,1920],['sidebar',180,400]]) {const label=document.createElement('label');label.textContent=key+' ';const input=document.createElement('input');input.type='number';input.min=min;input.max=max;input.step='1';input.value=current[key]||M.sizingDefaults[key];input.dataset.dimension='';input.setAttribute('aria-label',key+' size');label.append(input);details.append(label);input.addEventListener('change',()=>{if(!input.checkValidity()) return;const payload={...(read('sizing')||{}),[key]:Number(input.value)};window.ADSStorage.safeSet('ads:sizing',payload);});}
      toolbar.after(details);
    }
    if(location.pathname.endsWith('grid-layout.html')) {
      const panel=document.createElement('section');panel.className='panel';panel.innerHTML='<h2 class="panel-title">Resolved grid preview</h2><p class="get-library-copy">Uses the saved columns, gutter and grid system. Columns remain visible at narrow widths; real content should stack according to the documented layout patterns.</p><div class="ads-live-grid" aria-label="Resolved grid"></div>';
      toolbar.after(panel);
      const render=()=>{const grid=panel.querySelector('.ads-live-grid'),config=window.ADSFoundation.get(),n=Number(config.tokens['--grid-columns']);grid.style.gridTemplateColumns='repeat('+(config.gridSystem==='rows'?1:n)+', minmax(0,1fr))';const fragment=document.createDocumentFragment();for(let i=0;i<n;i++){const cell=document.createElement('span');cell.textContent=String(i+1);fragment.append(cell);}grid.replaceChildren(fragment);};
      window.addEventListener('ads:foundation-applied',render);render();
    }
    indicators();apply();
    new MutationObserver(records=>{
      if(records.every(r=>r.target.closest&&r.target.closest('.ads-text-content,.ads-read-more,[data-format],.ads-unit-control'))) return;
      indicators();bindExamples();renderData();updateUnits();scheduleText();
    }).observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['required','hidden']});
    main.addEventListener('change',()=>{updateUnits();scheduleText();});
    if(document.fonts) document.fonts.ready.then(scheduleText);
    window.addEventListener('resize',scheduleText);
  });
})();
