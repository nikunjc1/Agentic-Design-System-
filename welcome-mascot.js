/* Local artwork animation; no account, model request or vendor dependency. */
(() => {
 const mascot=document.getElementById('welcomeMascot'),button=document.getElementById('mascotMotionToggle');if(!mascot||!button)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=false;
 function refresh(){
  const stopped=paused||reduced.matches;mascot.dataset.paused=String(stopped);button.hidden=reduced.matches;button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Play mascot animation':'Pause mascot animation');button.title=button.getAttribute('aria-label');
  button.querySelector('[data-mascot-pause]').toggleAttribute('hidden',paused);button.querySelector('[data-mascot-play]').toggleAttribute('hidden',!paused);
 }
 function reset(){for(const key of ['tilt'])mascot.style.removeProperty('--mascot-'+key);}
 button.addEventListener('click',()=>{paused=!paused;reset();refresh();});
 mascot.addEventListener('pointermove',event=>{
  if(paused||reduced.matches||event.pointerType==='touch')return;
  const r=mascot.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1));
  mascot.style.setProperty('--mascot-tilt',x*.65+'deg');
 });
 mascot.addEventListener('pointerleave',reset);reduced.addEventListener('change',()=>{reset();refresh();});refresh();
})();
