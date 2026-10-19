/* Execute actual page scripts in a DOM without claiming rendered browser QA.
   Install jsdom separately and set ADS_DOM_PACKAGE to its module directory. */
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require(process.env.ADS_DOM_PACKAGE || 'jsdom');
const ROOT = path.resolve(__dirname, '..');
const pages = ['foundations.html','grid-layout.html','typography.html','spacing.html','radius.html','borders.html','shadows.html','icons.html','ai-foundation.html','principles.html','guidelines.html','copywriting.html','data-format.html','accessibility.html'];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function boot(page, options = {}) {
  const errors = [], copies = [], downloads = [], writes = [];let closing=false;
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => { if (!closing&&e.type !== 'not-implemented') errors.push(e.cause?.stack || e.message); });
  const dom = new JSDOM(fs.readFileSync(path.join(ROOT,page),'utf8'), {url:'https://damco.test/'+page,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole});
  const w = dom.window, d = w.document;
  w.queueMicrotask=callback=>queueMicrotask(()=>{if(closing)return;try{callback();}catch(e){errors.push(e.stack);}});
  if(options.traceMutations){const Observer=w.MutationObserver;let batches=0;w.MutationObserver=class extends Observer{constructor(callback){super((records,observer)=>{batches++;if(batches>200){observer.disconnect();errors.push('Mutation loop: '+records.slice(0,3).map(r=>r.type+' '+r.target.nodeName+' '+r.target.className+' '+r.attributeName).join('; '));return;}callback(records,observer);});}};}
  w.addEventListener('error', e => errors.push(e.error?.stack || e.message));
  w.matchMedia = query => options.media?.[query] || ({matches:false,addEventListener(){},removeEventListener(){}});
  w.IntersectionObserver = class {observe(){} disconnect(){}};
  w.ResizeObserver = class {observe(){} disconnect(){}};
  w.HTMLElement.prototype.scrollIntoView = function() {};
  w.HTMLElement.prototype.setPointerCapture = function() {};
  const anchorClick=w.HTMLAnchorElement.prototype.click;
  w.HTMLAnchorElement.prototype.click = function() { if(this.download) downloads.push({name:this.download,url:this.href});else anchorClick.call(this); };
  const blobs = new Map();
  w.URL.createObjectURL = blob => {const url='blob:damco/'+blobs.size;blobs.set(url,blob);return url;};
  w.URL.revokeObjectURL = () => {};
  w.FontFace = class {constructor(family){this.family=family;}load(){return Promise.resolve(this);}};
  Object.defineProperty(d,'fonts',{value:{ready:Promise.resolve(),add(){}}});
  Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:options.clipboard===false?undefined:{writeText:async text=>{if(options.clipboard==='reject')throw new Error('Clipboard denied');copies.push(text);}}});
  const storage = w.Storage.prototype;
  const set = storage.setItem, remove = storage.removeItem;
  for(const [key,value] of Object.entries(options.saved||{})) w.localStorage.setItem(key,typeof value==='string'?value:JSON.stringify(value));
  let failWrites = false, failRemove = false;
  storage.setItem = function(key,value){if(failWrites)throw new Error('Storage quota');writes.push(key);return set.call(this,key,value);};
  storage.removeItem = function(key){if(failRemove)throw new Error('Storage unavailable');return remove.call(this,key);};
  const computed = w.getComputedStyle.bind(w);
  w.getComputedStyle = node => {const style=computed(node),get=style.getPropertyValue.bind(style);style.getPropertyValue=name=>w.ADSFoundation?.get()?.tokens[name]||get(name);return style;};
  const scripts=Array.from(d.querySelectorAll('script[src]'));
  const body=d.body;body.remove(); // Head scripts execute before body exists.
  for(const script of scripts) {
    if(!script.closest('head')&&!d.body)d.documentElement.append(body);
    const file=script.getAttribute('src');
    if(!/^[a-z0-9-]+\.js$/.test(file))continue;
    try{w.eval(fs.readFileSync(path.join(ROOT,file),'utf8')+'\n//# sourceURL='+file);}catch(e){errors.push(file+': '+e.stack);}
  }
  if(!d.body)d.documentElement.append(body);
  await pause(120);
  const change = async (node,value,type='change') => {
    if(node.type==='checkbox'||node.type==='radio')node.checked=value;else node.value=String(value);
    node.dispatchEvent(new w.Event(type,{bubbles:true}));await pause(10);
  };
  const markdown = () => Array.from(d.querySelectorAll('code[data-role$="markdown-output"]')).map(n=>n.textContent).join('\n');
  const state = () => Object.fromEntries(Array.from({length:w.localStorage.length},(_,i)=>{const key=w.localStorage.key(i);return [key,w.localStorage.getItem(key)];}));
  return {w,d,errors,copies,downloads,blobs,writes,change,markdown,state,flush:()=>pause(15),failWrites:v=>{failWrites=v;},failRemove:v=>{failRemove=v;},close:()=>{closing=true;w.close();}};
}

if(require.main===module) (async()=>{
  const rows=[];
  for(const page of pages) {
    const f=await boot(page);let switches=0;
    for(const guide of f.d.querySelectorAll('.component-guide')) for(const button of guide.querySelectorAll('.guide-toggle-btn')) {
      button.click();const target=guide.querySelector('[data-view-panel="'+button.dataset.view+'"]');
      if(!target||target.hidden||button.getAttribute('aria-pressed')!=='true')f.errors.push('View switch failed: '+button.textContent.trim());switches++;
    }
    for(const button of f.d.querySelectorAll('button[id^="copy"][id$="MarkdownBtn"]')){button.click();await f.flush();if(f.copies.at(-1)!==f.markdown())f.errors.push('Copy does not match current Markdown: '+button.id);}
    rows.push({page,inputs:f.d.querySelectorAll('main input:not([hidden]),main select,main textarea').length,switches,markdown:!!f.markdown(),errors:f.errors});f.close();
  }
  console.log(JSON.stringify(rows,null,2));
  if(rows.some(row=>row.errors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});

module.exports={boot,pages};
