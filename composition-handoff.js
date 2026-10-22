/* Shared handoff for static Patterns and Templates. */
(() => {
  'use strict';
  window.ADSComposition = {init(kind) {
    document.querySelectorAll(`[data-role^="${kind}-demo-"]`).forEach(demo => {
      const slug=demo.dataset.role.slice(kind.length+6), section=demo.closest('section');
      if (!section || section.dataset.handoffReady) return;
      section.dataset.handoffReady='true';
      const name=section.querySelector('.panel-title').textContent.trim();
      const description=section.querySelector('.get-library-copy').textContent.trim();
      const refs=Array.from(section.querySelectorAll('.guide-dodont-note a')).map(a=>`${a.textContent.trim()}: ${a.getAttribute('href')}`);
      const warning='Static visual scaffold. Actions, navigation, validation and data persistence require application code. Sample values are fictional. Copy code produces an HTML page to save in the design-system folder.';
      demo.classList.add('composition-scaffold');
      const note=document.createElement('p');note.className='setup-help';note.textContent=warning;demo.before(note);
      // Preserve readonly semantics; an editable form with inert actions is misleading.
      demo.querySelectorAll('input').forEach((input,i)=>{
        input.id=`${kind}-${slug}-field-${i+1}`;
        const label=input.closest('.input-demo-field,.password-demo-field')?.querySelector('label');
        if(label)label.htmlFor=input.id;
        else input.setAttribute('aria-label',`${name} sample search`);
      });
      demo.querySelectorAll('svg').forEach(svg=>{if(!svg.hasAttribute('role'))svg.setAttribute('aria-hidden','true')});
      const scaffold=demo.innerHTML.trim();
      const disclosure=document.createElement('details');disclosure.className='composition-output';
      const summary=document.createElement('summary');summary.textContent=`View ${name} handoff`;disclosure.append(summary);
      const output=document.createElement('textarea');output.readOnly=true;output.className='export-preview';output.rows=8;output.setAttribute('aria-label',`${name} handoff text`);disclosure.append(output);
      const status=document.createElement('p');status.className='setup-status';status.setAttribute('role','status');disclosure.append(status);section.append(disclosure);
      const prompt=()=>window.ADSFoundation.preparePageMarkdown([
        `Implement the "${name}" ${kind} using the Agentic Design System.`,description,'',
        `Source: ${location.pathname.split('/').pop()}#${name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}`,
        'Component references (paths relative to the design-system folder):',...refs.map(r=>'- '+r),'',warning,
        'Required behavior: implement each depicted control with native semantics, accessible labels, keyboard operation and visible focus. Define loading, empty, error and success states. Keep record selection and tab content synchronized. Validate forms and announce failures. Restore focus after overlays. Connect authentication, payments and persistence only to explicitly configured services.',
        'Acceptance: test keyboard-only use; 320px and desktop layouts; light/dark and RTL; no false success messages; exact copied-code recipient behavior. Use semantic design tokens and review the linked component guides.'
      ].join('\n'));
      const code=()=>`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name} — visual scaffold</title>
<link rel="stylesheet" href="theme.css"><link rel="stylesheet" href="shell.css"><link rel="stylesheet" href="foundation.css">
<style>body{display:block;min-height:100vh}.composition-recipient{width:100%;min-width:0;box-sizing:border-box;padding:var(--space-24)}</style>
<script src="foundation-model.js"></script>
<script>
/* Foundation audit AT04 - foundation-runtime.js reads and writes through
   window.ADSStorage unconditionally for any page with a <main> element, but
   the full shell.js that normally defines it also wires up sidebar/topbar/
   theme-toggle markup this standalone scaffold doesn't have. This is the
   minimal read/write/remove contract it actually needs, so Foundation can
   boot and apply the saved/resolved tokens without pulling in unrelated
   host chrome behavior. */
window.ADSStorage={lastWriteSucceeded:true,
  safeGet(key){let raw;try{raw=localStorage.getItem(key);}catch(e){return null;}if(raw==null)return null;try{const value=JSON.parse(raw);if(!window.ADSFoundationModel.validRecord(key,value))throw new Error('invalid');return window.ADSFoundationModel.migrateRecord(key,value);}catch(e){return null;}},
  safeSet(key,value){try{if(!window.ADSFoundationModel.validRecord(key,value)){this.lastWriteSucceeded=false;return false;}localStorage.setItem(key,JSON.stringify(value));this.lastWriteSucceeded=true;window.dispatchEvent(new CustomEvent('ads:foundation-change',{detail:{key,value}}));return true;}catch(e){this.lastWriteSucceeded=false;return false;}},
  safeRemove(key){try{localStorage.removeItem(key);this.lastWriteSucceeded=true;window.dispatchEvent(new CustomEvent('ads:foundation-change',{detail:{key,removed:true}}));return true;}catch(e){this.lastWriteSucceeded=false;return false;}}};
</script>
<script src="foundation-runtime.js"></script></head><body>
<!-- ${name}: ${warning} -->
<!-- Requires the linked design-system assets. Use the Markdown handoff for project-specific foundation values on another origin. Assign instance-unique field IDs if mounting the same scaffold more than once. -->
<!-- References: ${refs.join('; ')} -->
<main class="composition-recipient"><div class="composition-scaffold">${scaffold}</div></main></body></html>`;
      for(const type of ['prompt','code']){
        const button=section.querySelector(`[data-role="copy-${type}-${slug}"]`);if(!button)continue;
        button.setAttribute('aria-label',`Copy ${type} for ${name} ${kind}`);
        button.addEventListener('click',async()=>{
          output.value=(type==='prompt'?prompt:code)();disclosure.open=true;
          // Foundation audit: used copyWithFeedback (every other page's shared
          // "Copied!" button-text acknowledgment) instead of calling
          // ADSClipboard.copy directly - this button used to stay unchanged on
          // success, the only copy action sitewide that didn't confirm itself.
          // Local status + focus/select-on-failure (AT02's clipboard-denial
          // recovery) stays, driven off the same success result.
          const success=await window.ADSClipboard.copyWithFeedback(output.value,button);
          if(success){status.textContent=`${name} ${type} copied.`;}
          else {output.focus();output.select();status.textContent='Copy is unavailable. The handoff text is selected; use your device’s Copy command.';}
        });
      }
    });
  }};
})();
