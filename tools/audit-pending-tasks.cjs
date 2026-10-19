/* Integrated DOM evidence for release follow-ups; this is not rendered QA. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {boot}=require('./foundation-dom-harness.cjs');const ROOT=path.resolve(__dirname,'..');
let assertions=0;const rows=[];
function check(value,message){assert.ok(value,message);assertions++;}
async function run(name,page,options,verify){const f=await boot(page,options);try{await verify(f);check(!f.errors.length,f.errors.join('\n'));rows.push({name,status:'pass'});}catch(e){rows.push({name,status:'fail',error:e.stack});}finally{f.close();}}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const blobText=(f,blob)=>new Promise((resolve,reject)=>{const reader=new f.w.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsText(blob);});
(async()=>{
 await run('All 15 schemas: preserve future records, explicit reset and migrated save','foundations.html',{},async f=>{
  for(const key of f.w.ADSFoundationModel.recordKeys){const storageKey='ads:'+key,raw='{"schemaVersion":2,"future":"preserve"}';f.w.localStorage.setItem(storageKey,raw);
   check(f.w.ADSStorage.safeGet(storageKey)===null,key+' future read');check(!f.w.ADSStorage.safeSet(storageKey,{}),key+' overwrote future');check(f.w.localStorage.getItem(storageKey)===raw,key+' lost raw data');
   check(f.w.ADSStorage.safeRemove(storageKey),key+' reset failed');check(f.w.ADSStorage.safeSet(storageKey,{}),key+' migrated save failed');check(JSON.parse(f.w.localStorage.getItem(storageKey)).schemaVersion===1,key+' version absent');
  }await f.flush();
  const backup=Array.from(f.d.querySelectorAll('button')).find(b=>b.textContent==='Back up saved settings');backup.click();await f.flush();const payload=JSON.parse(await blobText(f,f.blobs.get(f.downloads.at(-1).url)));check(Object.keys(payload.records).length===15,'Backup missing raw records');
 });
 const profile={version:1,project:'Saved <img src=x onerror=alert(1)>',productType:'Web Application',platforms:['desktop-web'],role:'Designer'};
 await run('Project draft recovery, context review, full save and nine-section readiness','new-project.html',{saved:{'ads:project-profile:v1':profile,'ads:project-draft:v1':{version:1,project:'Unsaved draft',productType:'Web Application',platforms:['mobile-web'],role:'Designer'},'ads:radius':{philosophy:'soft'},'ads:border':'{' }},async f=>{
  check(f.d.getElementById('project').value===profile.project,'Draft silently replaced saved baseline');check(!f.d.querySelector('#draftProvenanceNotice img'),'Unsafe draft insertion');
  f.d.getElementById('resumeDraftBtn').click();check(f.d.getElementById('project').value==='Unsaved draft','Resume failed');
  const form=f.d.querySelector('form');const submit=()=>form.dispatchEvent(new f.w.Event('submit',{bubbles:true,cancelable:true}));submit();await f.flush();submit();await f.flush();
  check(!f.d.querySelector('[data-step="3"]').hidden,'Review not reachable');check(f.d.getElementById('setupFoundationChanges').textContent.includes('Saved override retained'),'Override provenance missing');
  submit();await f.flush();check(!f.d.getElementById('setupDone').hidden,'Save confirmation missing');check(f.d.getElementById('foundationReadiness').children.length===9,'AI omitted from readiness');check(f.d.getElementById('foundationReadiness').textContent.includes('Needs recovery'),'Corrupt border marked ready');check(f.d.querySelector('a[href="ai-foundation.html"]'),'AI route missing');
  check(f.d.activeElement===f.d.querySelector('#setupDone h2'),'Confirmation focus missing');f.w.location.hash='step-1';await f.flush();check(!form.hidden,'Back did not resume editing');
 });
 await run('Invalid project draft: failed discard preserves data, backup and successful discard recover','new-project.html',{saved:{'ads:project-draft:v1':'{"version":2}'}},async f=>{
  check(!f.d.getElementById('resumeDraftBtn'),'Future draft can resume');f.failRemove(true);f.d.getElementById('discardDraftBtn').click();check(!f.d.getElementById('draftProvenanceNotice').hidden,'Failed discard hid recovery');check(f.w.localStorage.getItem('ads:project-draft:v1')==='{"version":2}','Draft changed');
  const backup=Array.from(f.d.querySelectorAll('#draftProvenanceNotice button')).find(b=>b.textContent==='Back up draft');backup.click();check(f.downloads.length===1,'Draft backup missing');
  f.failRemove(false);f.d.getElementById('discardDraftBtn').click();check(f.d.getElementById('draftProvenanceNotice').hidden,'Discard did not recover');
 });
 await run('Typography presets: scoped Undo restores metrics, later edit retires Undo','typography.html',{},async f=>{
  const before=f.w.ADSFoundation.get().tokens['--type-h1-size'],chip=f.d.querySelector('.platform-chips .chip');chip.click();await f.flush();const undo=Array.from(f.d.querySelectorAll('button')).find(b=>b.textContent==='Undo preset');check(!undo.hidden,'Undo unavailable');undo.click();await f.flush();check(f.w.ADSFoundation.get().tokens['--type-h1-size']===before,'Undo lost prior size');chip.click();await f.flush();const input=f.d.querySelector('.type-row input');if(input){await f.change(input,'170','input');check(undo.hidden,'Later edit left stale Undo');}
 });
 await run('Icon references: decode failure removes invalid asset and reports recovery','icons.html',{saved:{'ads:icons':{uploads:[{name:'broken.png',dataUrl:'data:image/png;base64,AA=='}]}}},async f=>{
  const img=f.d.querySelector('.icon-upload-thumb img');img.dispatchEvent(new f.w.Event('error'));await f.flush();check(!f.d.querySelector('.icon-upload-thumb img'),'Broken image remained');check(JSON.parse(f.w.localStorage.getItem('ads:icons')).uploads.length===0,'Broken asset remained saved');check(f.d.querySelector('[data-role="icon-upload-label"]').textContent.includes('decode'),'Decode error missing');check(f.d.querySelector('.ads-named-icons').children.length===6,'Named icons absent');
 });
 await run('Streaming start, stop, continue, interruption and retry preserve output and scope','ai-foundation.html',{},async f=>{
  const get=name=>f.d.querySelector('[data-stream="'+name+'"]');get('start').click();await wait(240);get('stop').click();const partial=get('output').textContent,record=JSON.parse(get('record').textContent);check(partial.length>0,'No partial output');check(record.state==='cancelled','Stop state wrong');get('retry').click();await wait(240);get('fail').click();check(get('output').textContent.startsWith(partial),'Retry erased output');check(JSON.parse(get('record').textContent).requestId===record.requestId,'Retry changed request');get('retry').click();await wait(1500);check(JSON.parse(get('record').textContent).state==='succeeded','Stream did not complete');check(get('status').textContent.includes('finished'),'Completion not announced');
 });
 await run('Project Markdown: effective defaults, all nine contracts and exact copy','md-export.html',{},async f=>{
  await f.flush();const preview=f.d.getElementById('markdownPreview');check(preview.value.includes('resolvedThemes'),'Resolved themes absent');
  check(preview.value.includes('AI & Agents'),'AI contract absent');check(preview.value.includes('## Asset manifest'),'Asset manifest absent');
  const tokens=JSON.parse(preview.value.match(/```json\n([\s\S]*?)\n```/)[1]);check(JSON.stringify(tokens.resolvedThemes.light)===JSON.stringify(f.w.ADSFoundationModel.resolve({},'light')),'Export seed defaults differ from applied defaults');
  f.d.getElementById('copyMarkdown').click();await f.flush();check(f.copies.at(-1)===preview.value,'Project copy mismatch');
 });
 await run('Foundation JSON: settings, both themes, context, contract and recipient parity','spacing.html',{saved:{'ads:project-profile:v1':profile,'ads:spacing':{system:'8px'},'ads:units':{unit:'rem'}}},async f=>{
  f.d.querySelector('[data-foundation-export]').click();await f.flush();const payload=JSON.parse(await blobText(f,f.blobs.get(f.downloads.at(-1).url)));
  check(payload.context.platforms[0]==='desktop-web','Context omitted');check(!!payload.implementationContract.governance,'Governance omitted');check(Object.keys(payload.iconCatalog.icons).length===6,'Catalog omitted');
  const I=require('../foundation-import.js');for(const theme of ['light','dark'])check(JSON.stringify(I.resolve(payload,theme))===JSON.stringify(payload.resolvedThemes[theme]),'Recipient parity failed '+theme);
  f.failWrites(true);f.w.ADSStorage.safeSet('ads:spacing',{system:'adaptive'});await f.flush();f.d.querySelector('[data-foundation-export]').click();await f.flush();const preview=JSON.parse(await blobText(f,f.blobs.get(f.downloads.at(-1).url)));
  check(preview.verification.unsavedPreviewKeys.includes('spacing'),'Unsaved export was presented as durable');check(preview.settings.spacing.system==='adaptive','Applied preview missing from export');check(JSON.parse(f.w.localStorage.getItem('ads:spacing')).system==='8px','Failed save overwrote durable record');
 });
 const report={date:'2026-10-08',method:'Actual scripts in jsdom; rendering, font decoding and assistive technology not evaluated',assertions,failures:rows.filter(r=>r.status==='fail').length,results:rows};fs.writeFileSync(path.join(ROOT,'audit','pending-tasks-2026-10-08.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(report.failures)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
