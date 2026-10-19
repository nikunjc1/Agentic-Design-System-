/* Actual page scripts, explicitly separate from CSS/browser acceptance. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {boot}=require('./foundation-dom-harness.cjs'),ROOT=path.resolve(__dirname,'..');
let assertions=0;const results=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function check(value,message){assert.ok(value,message);assertions++;}
async function run(name,page,options,fn){const f=await boot(page,options);try{await fn(f);check(!f.errors.length,f.errors.join('\n'));results.push({name,page,status:'pass'});}catch(e){results.push({name,page,status:'fail',error:e.stack});}finally{f.close();}}
(async()=>{
  const componentPages=fs.readdirSync(ROOT).filter(n=>n.endsWith('.html')).filter(n=>/src="[a-z0-9-]+-detail\.js"/.test(fs.readFileSync(path.join(ROOT,n),'utf8')));
  // Reproduce both successful and denied-copy paths on every actual library page.
  for(const page of [...componentPages,'patterns.html','templates.html'])await run('Copy success, denied clipboard and fallback',page,{},async f=>{
    const button=Array.from(f.d.querySelectorAll('main button')).find(b=>/^Copy (prompt|code)$/.test(b.textContent.trim())&&!b.classList.contains('copy-dropdown-trigger'));
    if(!button)throw Error('No executable copy action');
    button.focus();button.click();await f.flush();
    check(f.copies.length>0,'Successful copy produced no text');
    check(button.textContent==='Copied!','Successful copy not acknowledged');
    check(f.d.activeElement===button,'Copy moved focus');
    check(f.copies.at(-1).includes('px')&&f.copies.at(-1).includes('rem'),'Dimension equivalence missing from copied prompt');
    const initial=f.copies.at(-1);
    f.w.ADSStorage.safeSet('ads:spacing',{system:'8px'});await f.flush();button.click();await f.flush();
    check(f.copies.at(-1)!==initial,'Changing Foundation spacing did not change the copied prompt');
    check(f.copies.at(-1).includes('"system": "8px"'),'Copied prompt omitted the current setting');
    Object.defineProperty(f.w.navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}});
    f.d.execCommand=()=>false;button.click();await f.flush();
    check(button.textContent==='Copy failed','Failed copy announced success');
    check(f.d.getElementById('ads-copy-status').textContent.includes('manually'),'No manual-copy recovery');
    check(f.d.activeElement===button,'Failure moved focus');
    f.d.execCommand=()=>true;button.click();await f.flush();check(button.textContent==='Copied!','Successful legacy fallback rejected');
  });
  await run('Splitter keyboard, bounds, collapse, cancellation, save and reset','splitter-default.html',{},async f=>{
    const divider=f.d.querySelector('[data-splitter-divider]'),wrap=divider.parentElement,first=f.d.querySelector('[data-splitter-first]');
    check(divider.getAttribute('role')==='separator'&&divider.tabIndex===0,'Splitter not keyboard accessible');
    check(divider.getAttribute('aria-controls')===first.id,'Pane association missing');
    const key=name=>divider.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:name,bubbles:true,cancelable:true}));
    divider.focus();key('ArrowRight');check(divider.getAttribute('aria-valuenow')==='36','Arrow did not resize');
    check(JSON.parse(f.w.localStorage.getItem('ads:splitter-demo:v1')).ratio===36,'Split not persisted');
    key('Enter');check(first.hidden&&divider.getAttribute('aria-valuenow')==='0','Collapse failed');
    key('Enter');check(!first.hidden&&divider.getAttribute('aria-valuenow')==='36','Restore lost previous ratio');
    key('Home');check(divider.getAttribute('aria-valuenow')==='10','Minimum not respected');key('End');check(divider.getAttribute('aria-valuenow')==='90','Maximum not respected');
    wrap.getBoundingClientRect=()=>({width:300,height:180,left:0,top:0});divider.getBoundingClientRect=()=>({width:44,height:180});
    f.w.ADSFoundation.apply();
    const pointer=(name,x)=>{const e=new f.w.Event(name,{bubbles:true,cancelable:true});Object.assign(e,{pointerId:1,button:0,clientX:x,clientY:0});divider.dispatchEvent(e);};
    pointer('pointerdown',150);pointer('pointermove',0);check(Number(divider.getAttribute('aria-valuenow'))>=25,'Expanded pane below physical minimum');
    pointer('pointercancel',0);check(divider.getAttribute('aria-valuenow')==='75','Cancellation did not restore clamped prior ratio');
    key('Enter');pointer('pointerdown',150);pointer('pointermove',0);pointer('pointercancel',0);key('Enter');
    check(divider.getAttribute('aria-valuenow')==='75','Cancelling from a collapsed pane lost the restore width');
    f.failRemove(true);f.d.querySelector('[data-role="splitter-reset"]').click();check(f.w.localStorage.getItem('ads:splitter-demo:v1')!==null,'Failed reset lost saved width');
    f.failRemove(false);f.d.querySelector('[data-role="splitter-reset"]').click();check(f.w.localStorage.getItem('ads:splitter-demo:v1')===null,'Reset did not clear saved width');
  });
  await run('Splitter reload and future-record preservation','splitter-default.html',{saved:{'ads:splitter-demo:v1':{schemaVersion:1,ratio:60,collapsed:true}}},async f=>{
    const divider=f.d.querySelector('[data-splitter-divider]');check(divider.getAttribute('aria-valuenow')==='0','Collapse not restored');divider.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));check(divider.getAttribute('aria-valuenow')==='60','Ratio not restored');
  });
  await run('Splitter future version is preserved until explicit reset','splitter-default.html',{saved:{'ads:splitter-demo:v1':{schemaVersion:2,ratio:60,collapsed:false}}},async f=>{
    const original=f.w.localStorage.getItem('ads:splitter-demo:v1');f.d.querySelector('[data-splitter-divider]').dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));check(f.w.localStorage.getItem('ads:splitter-demo:v1')===original,'Future split overwritten');check(f.d.querySelector('[data-role="live-readout"]').textContent.includes('reset'),'Recovery guidance absent');
  });
  const narrow={matches:true,listeners:[],addEventListener(type,fn){this.listeners.push(fn);},removeEventListener(){}};
  await run('Master-Detail selection, Back, error, retry, clear and stale-loading cancellation','grid-layout.html',{media:{'(max-width:900px)':narrow}},async f=>{
    const get=key=>f.d.querySelector('[data-master="'+key+'"]'),heading=f.d.getElementById('master-heading'),list=f.d.querySelector('.ads-master-list');
    check(get('content').textContent.includes('Select a record'),'Empty detail absent');
    check(!list.hidden&&f.d.querySelector('.ads-master-detail').hidden,'Narrow default not list-only');
    list.scrollTop=80;get('records').children[1].click();check(f.d.activeElement===heading,'Selection did not focus heading');check(get('records').children[1].getAttribute('aria-pressed')==='true','Selection marker absent');
    check(list.hidden&&!f.d.querySelector('.ads-master-detail').hidden,'Narrow selection not detail-only');
    get('back').click();check(list.scrollTop===80&&f.d.activeElement===get('records').children[1],'Back lost list position/origin');
    narrow.matches=false;narrow.listeners.forEach(fn=>fn());check(!list.hidden&&!f.d.querySelector('.ads-master-detail').hidden,'Wide reflow hid a pane');
    get('records').children[1].click();get('error').click();check(get('status').getAttribute('role')==='alert','Error not announced');check(f.d.activeElement===get('retry'),'Retry not reachable');
    get('retry').click();check(f.d.querySelector('.ads-master-detail').getAttribute('aria-busy')==='true','Loading not exposed');await wait(680);check(get('content').textContent.includes('Release checklist'),'Retry lost record');
    get('loading').click();get('clear').click();await wait(680);check(get('content').textContent.includes('Select a record'),'Late completion restored cleared selection');
    check(!get('records').querySelector('[aria-pressed="true"]'),'Clear left stale marker');
  });
  await run('Data formats retain leading-zero identifiers, phone labels and numeric-only alignment','data-format.html',{},async f=>{
    const table=f.d.createElement('table');table.innerHTML='<thead><tr><th>ID</th><th>Mobile</th><th>Quantity</th><th>Date</th></tr></thead><tbody><tr><td>001234</td><td>9876543210</td><td data-format="number" data-value="1234">1234</td><td data-format="date" data-value="2026-03-14">2026-03-14</td></tr></tbody>';f.d.querySelector('main').append(table);await f.flush();f.w.ADSFoundation.apply();
    const cells=table.querySelectorAll('td');check(cells[0].textContent==='001234','Identifier changed');check(cells[1].textContent==='9876543210','Phone formatted as quantity');check(cells[2].style.textAlign==='end','Numeric alignment missing');check(cells[3].style.textAlign==='','Date incorrectly right-aligned');
  });
  const report={date:'2026-10-08',method:'Page scripts in jsdom. CSS, fonts and assistive technology are not rendered.',componentPages:componentPages.length,assertions,failures:results.filter(r=>r.status==='fail').length,results};
  fs.writeFileSync(path.join(ROOT,'audit/missed-pointers-2026-10-08.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(report.failures)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
