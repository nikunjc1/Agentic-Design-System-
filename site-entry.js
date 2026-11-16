/* Always enter through project choices; allow one intentional in-app navigation. */
(() => {
 'use strict';
 if(window.top!==window.self)return;
 const script=document.currentScript;if(!script?.src)return;
 const root=new URL('.',script.src),entry=new URL('new-project.html',root),here=new URL(location.href);
 const KEY='ads:entry-navigation:v1',LAST='ads:entry-last-page:v1',PREFIX='damco-entry:';
 const project=url=>url.protocol===root.protocol&&url.host===root.host&&url.pathname.startsWith(root.pathname)&&/^[^/]+\.html$/.test(url.pathname.slice(root.pathname.length));
 const get=key=>{try{return sessionStorage.getItem(key);}catch{return null;}};
 const set=(key,value)=>{try{sessionStorage.setItem(key,value);}catch{}};
 const remove=key=>{try{sessionStorage.removeItem(key);}catch{}};
 let named=null;try{if(window.name.startsWith(PREFIX))named=JSON.parse(window.name.slice(PREFIX.length));}catch{}
 const originalName=typeof named?.previousName==='string'?named.previousName:window.name;
 function readPermits(){let stored=null;try{stored=JSON.parse(get(KEY)||'null');}catch{}remove(KEY);if(named)window.name=originalName;return [stored,named];}
 function allow(destination,reload=false){
  const target=new URL(destination,location.href);if(!project(target))return target;
  const permit={target:target.href,from:location.href,expires:Date.now()+30000,reload,previousName:originalName};
  set(KEY,JSON.stringify(permit));window.name=PREFIX+JSON.stringify(permit);return target;
 }
 const api=window.ADSNavigation={
  entry:entry.href,redirecting:false,
  go(destination){location.href=allow(destination).href;},
  replace(destination){location.replace(allow(destination).href);},
  reload(){allow(location.href,true);location.reload();}
 };
 const navigation=performance.getEntriesByType?.('navigation')[0]?.type||'navigate',permits=readPermits();
 const safePage=value=>{try{return project(new URL(value,root));}catch{return false;}};
 const allowed=permits.some(permit=>permit&&permit.target===here.href&&Number.isFinite(permit.expires)&&permit.expires>=Date.now()&&safePage(permit.from)&&(navigation!=='reload'||permit.reload===true));
 const last=get(LAST),internalBack=navigation==='back_forward'&&last&&last!==here.href&&safePage(last);
 if(!allowed&&!internalBack&&here.href!==entry.href){api.redirecting=true;location.replace(entry.href);return;}
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest?.('a[href]');
  if(link){if(link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;const target=new URL(link.href,location.href);if(project(target)&&(target.pathname!==location.pathname||target.search!==location.search))allow(target);return;}
  const control=event.target.closest?.('[onclick]'),match=control?.getAttribute('onclick')?.match(/(?:window\.)?location\.href\s*=\s*['"]([^'"]+)['"]/);if(match)allow(match[1]);
 },true);
 window.addEventListener('pagehide',()=>set(LAST,location.href));
 window.addEventListener('pageshow',event=>{if(event.persisted&&get(LAST)===location.href&&location.href!==entry.href)location.replace(entry.href);});
})();
