/* Shared live splitter controller; static comparison specimens remain inert. */
(() => {
  'use strict';
  window.ADSSplitter = { mount(wrap, options={}) {
    const divider=wrap.querySelector('[data-splitter-divider]');
    const first=wrap.querySelector('[data-splitter-first]');
    const second=wrap.querySelector('[data-splitter-second]');
    const output=options.output;
    const vertical=wrap.dataset.splitterAxis==='vertical';
    const key=options.storageKey;
    let ratio=35,previous=35,collapsed=false,drag=null,blocked=false;
    const limit=value=>Math.max(10,Math.min(90,Math.round(Number(value)||35)));
    const announce=message=>{if(output)output.textContent=message;};
    try {
      const raw=key&&localStorage.getItem(key);
      if(raw) {
        const saved=JSON.parse(raw);
        if(saved.schemaVersion!==1||!Number.isFinite(saved.ratio)||saved.ratio<10||saved.ratio>90||typeof saved.collapsed!=='boolean')throw Error('Unsupported saved split');
        ratio=previous=saved.ratio;collapsed=saved.collapsed;
      } else ratio=previous=limit(options.ratio);
    } catch {blocked=true;announce('Saved split needs recovery. Reset the saved split before saving another width.');}
    divider.tabIndex=0;divider.setAttribute('role','separator');
    divider.setAttribute('aria-orientation',vertical?'horizontal':'vertical');
    divider.setAttribute('aria-controls',first.id);
    divider.setAttribute('aria-label',options.label||'First pane');
    if(options.helpId)divider.setAttribute('aria-describedby',options.helpId);
    function bounds() {
      const box=wrap.getBoundingClientRect(),handle=divider.getBoundingClientRect();
      const usable=(vertical?box.height:box.width)-(vertical?handle.height:handle.width);
      const minimum=options.minPaneSize??64;
      const min=usable>0?Math.min(50,Math.max(10,Math.ceil(minimum/usable*100))):10;
      return {min,max:100-min,usable};
    }
    function paint() {
      const {min,max}=bounds();ratio=Math.max(min,Math.min(max,ratio));
      first.hidden=collapsed;first.inert=collapsed;
      first.style.flex=collapsed?'0 0 0':'0 0 '+ratio+'%';
      first.style.flexBasis=collapsed?'0':'calc((100% - var(--size-target)) * '+ratio+' / 100)';
      second.style.flex='1 1 0';
      divider.setAttribute('aria-valuemin','0');divider.setAttribute('aria-valuemax',String(max));
      divider.setAttribute('aria-valuenow',String(collapsed?0:ratio));
      divider.setAttribute('aria-valuetext',collapsed?'First pane collapsed':ratio+' percent; minimum expanded width '+min+' percent');
      wrap.dataset.splitterCollapsed=String(collapsed);
    }
    function commit() {
      const value={schemaVersion:1,ratio,collapsed};let saved=false;
      if(key&&!blocked)try {localStorage.setItem(key,JSON.stringify(value));saved=true;}catch {}
      announce((collapsed?'First pane collapsed.':ratio+'% / '+(100-ratio)+'%.')+(blocked?' Saved split needs reset.':key?(saved?' Split saved.':' Preview only; split could not be saved.'):' Local preview.'));
      options.onChange?.(value);
    }
    function setRatio(value, save=true) {collapsed=false;ratio=limit(value);paint();previous=ratio;if(save)commit();}
    function collapse() {if(!collapsed)previous=ratio;collapsed=!collapsed;if(!collapsed)ratio=previous;paint();commit();}
    function onKey(e) {
      const rtl=!vertical&&getComputedStyle(wrap).direction==='rtl';
      const decrease=vertical?'ArrowUp':rtl?'ArrowRight':'ArrowLeft';
      const increase=vertical?'ArrowDown':rtl?'ArrowLeft':'ArrowRight';
      if(e.key==='Enter'){e.preventDefault();collapse();return;}
      if(![decrease,increase,'Home','End'].includes(e.key))return;
      e.preventDefault();const b=bounds(),step=e.shiftKey?10:1;
      setRatio(e.key==='Home'?b.min:e.key==='End'?b.max:(collapsed?previous:ratio)+(e.key===increase?step:-step));
    }
    function onMove(e) {
      if(!drag||e.pointerId!==drag.id)return;
      const b=bounds(),box=wrap.getBoundingClientRect();if(!(b.usable>0))return;
      let position=vertical?e.clientY-box.top:e.clientX-box.left;
      if(!vertical&&getComputedStyle(wrap).direction==='rtl')position=box.width-position;
      setRatio((position-(vertical?divider.offsetHeight:divider.offsetWidth)/2)/b.usable*100,false);
    }
    function finish(e) {
      if(!drag||e.pointerId!==drag.id)return;
      const cancel=e.type==='pointercancel'||e.type==='lostpointercapture';
      if(cancel){ratio=drag.ratio;previous=drag.previous;collapsed=drag.collapsed;paint();}
      const id=drag.id;drag=null;divider.classList.remove('is-dragging');
      if(divider.hasPointerCapture?.(id))divider.releasePointerCapture(id);
      if(cancel)announce('Resize cancelled; previous split restored.');else commit();
    }
    function onDown(e) {
      if(e.button!=null&&e.button!==0)return;
      e.preventDefault();divider.focus();drag={id:e.pointerId,ratio,previous,collapsed};
      divider.setPointerCapture(e.pointerId);divider.classList.add('is-dragging');
    }
    divider.addEventListener('keydown',onKey);divider.addEventListener('pointerdown',onDown);
    divider.addEventListener('pointermove',onMove);divider.addEventListener('pointerup',finish);divider.addEventListener('pointercancel',finish);
    divider.addEventListener('lostpointercapture',finish);
    const observer=new ResizeObserver(paint);observer.observe(wrap);paint();
    return { setRatio, collapse, getState:()=>({ratio,collapsed}), reset() {
      if(key)try {localStorage.removeItem(key);}catch {announce('Reset failed; saved split retained.');return false;}
      blocked=false;ratio=previous=limit(options.ratio);collapsed=false;paint();announce('Saved split removed; defaults restored.');options.onChange?.({ratio,collapsed});return true;
    }, destroy() {
      observer.disconnect();divider.removeEventListener('keydown',onKey);divider.removeEventListener('pointerdown',onDown);
      divider.removeEventListener('pointermove',onMove);divider.removeEventListener('pointerup',finish);divider.removeEventListener('pointercancel',finish);
      divider.removeEventListener('lostpointercapture',finish);
    } };
  } };
})();
