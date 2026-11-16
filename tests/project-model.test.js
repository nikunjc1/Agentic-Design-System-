const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../project-model.js');
const profile = {project:'Claims',productType:'Enterprise SaaS',platforms:['desktop-web','mobile-web'],name:'Sample User',email:'sample@example.com',designation:'UX Lead',role:'Designer'};
const store = () => { const m = new Map(); return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)}; };
test('requires project, product type, role and a valid delivery platform', () => {
  assert.deepEqual(M.validate(profile),{});
  for (const key of ['project','role','productType']) assert.ok(M.validate({...profile,[key]:''})[key]);
  assert.ok(M.validate({...profile,platforms:['unknown']}).platforms);
  assert.ok(M.validate({...profile,platforms:[]}).platforms);
  assert.ok(M.validate({...profile,productType:'Other'}).productOther);
  assert.ok(M.validate({...profile,role:'Other'}).roleOther);
});
test('new saves require name, email and designation; older saved profiles remain readable', () => {
  for(const key of ['name','email','designation'])assert.ok(M.validate({...profile,[key]:''})[key]);
  const old={...profile,name:'',email:'',designation:'',version:1};const storage=store();storage.setItem(M.KEY,JSON.stringify(old));assert.equal(M.read(storage).project,profile.project);assert.throws(()=>M.save(storage,old));
  assert.ok(M.validate({...profile,email:'bad'})['email']);
  assert.ok(M.validate({...profile,name:'x'.repeat(101)})['name']);
  assert.ok(M.validate({...profile,designation:'x'.repeat(101)})['designation']);
});
test('profile survives reload and malformed storage is not overwritten', () => {
  const s = store(); M.save(s,profile); assert.equal(M.read(s).name,profile.name);
  s.setItem(M.KEY,'broken'); assert.throws(()=>M.read(s)); assert.equal(s.getItem(M.KEY),'broken');
  assert.throws(()=>M.save(s,{...profile,email:'bad'})); assert.equal(s.getItem(M.KEY),'broken');
});
test('a profile saved under the old product-type list still reads back, remapped', () => {
  const s = store();
  s.setItem(M.KEY, JSON.stringify({...profile, productType:'Customer portal', version:1, updatedAt:new Date().toISOString()}));
  assert.equal(M.read(s).productType, 'Consumer App');
});
test('Other descriptions are bounded and type-checked like the other free-text fields', () => {
  assert.ok(M.validate({...profile,productType:'Other',productOther:'x'.repeat(101)}).productOther);
  assert.ok(M.validate({...profile,productType:'Other',productOther:12345}).productOther);
  assert.ok(M.validate({...profile,role:'Other',roleOther:'x'.repeat(101)}).roleOther);
  assert.deepEqual(M.validate({...profile,productType:'Other',productOther:'Something specific'}),{});
});
test('a profile saved by a newer app version is rejected, not silently misread', () => {
  const s = store();
  s.setItem(M.KEY, JSON.stringify({...profile, version:999, updatedAt:new Date().toISOString()}));
  assert.throws(()=>M.read(s), /newer version/);
});
test('a stale project edit cannot replace another tab’s saved profile',()=>{
  const s=store();M.save(s,profile);const original=s.getItem(M.KEY);
  M.save(s,{...profile,project:'Another tab'});
  assert.throws(()=>M.save(s,{...profile,project:'Stale edit'},{expectedRaw:original}),/another tab/);
  assert.equal(M.read(s).project,'Another tab');
  const current=s.getItem(M.KEY);M.save(s,{...profile,project:'Reviewed edit'},{expectedRaw:current});assert.equal(M.read(s).project,'Reviewed edit');
});
test('Foundation progress distinguishes missing, partial, saved and unreadable records without writing',()=>{
  const s=store();assert.equal(M.foundationReadiness(s).length,8);assert.ok(M.foundationReadiness(s).every(row=>row.state==='default'));
  s.setItem('ads:colors',JSON.stringify({light:{primary:{hex:'#123456'}}}));assert.equal(M.foundationReadiness(s)[0].state,'partial');
  for(const key of ['bg-colors','status-colors','neutral-colors'])s.setItem('ads:'+key,'{}');assert.equal(M.foundationReadiness(s)[0].state,'saved');
  s.setItem('ads:icons','{broken');assert.equal(M.foundationReadiness(s).find(row=>row.id==='icons').state,'recovery');assert.equal(s.getItem('ads:icons'),'{broken');
  const blocked={getItem(){throw Error('denied');}};assert.ok(M.foundationReadiness(blocked).every(row=>row.state==='recovery'));
});
test('drafts retain a bounded step while older drafts remain readable',()=>{
  const s=store();s.setItem(M.DRAFT,JSON.stringify({...profile,step:2}));assert.equal(M.read(s,M.DRAFT).step,2);
  s.setItem(M.DRAFT,JSON.stringify(profile));assert.equal(M.read(s,M.DRAFT).project,profile.project);
  s.setItem(M.DRAFT,JSON.stringify({...profile,step:9}));assert.throws(()=>M.read(s,M.DRAFT),/invalid step/);
});
test('Markdown contains saved tokens, selected platforms and source guides; identity is opt-in', () => {
  const tokens = {colors:{light:{primary:{hex:'#123456'}}}};
  const docs = [{file:'input-text-field.html',title:'Input',status:'Available',markdown:'Use a visible label.'}];
  const md = M.markdown(profile,tokens,docs);
  assert.ok(md.includes('#123456')); assert.ok(md.includes('Mobile web')); assert.ok(!md.includes('### Mobile app'));
  assert.ok(md.includes('Use a visible label.')); assert.ok(!md.includes(profile.email)); assert.ok(!md.includes(profile.name)); assert.ok(!md.includes(profile.designation));
  const privateMd=M.markdown(profile,tokens,[],true); assert.ok(privateMd.includes(profile.email)); assert.ok(privateMd.includes(profile.designation));
});
test('Markdown states provenance - which keys are a real save versus a documented default', () => {
  const tokens = {colors:{light:{primary:{hex:'#123456'}}}, spacing:{product:null,system:'4px'}};
  const noneDefaulted = M.markdown(profile,tokens,[],false,[]);
  assert.ok(noneDefaulted.includes('selected non-null source records are usable overrides'));
  assert.ok(noneDefaulted.includes('do not imply explicit saves'));
  const someDefaulted = M.markdown(profile,tokens,[],false,['spacing']);
  assert.ok(someDefaulted.includes('`spacing` is this system\'s own documented default'));
  const multiDefaulted = M.markdown(profile,tokens,[],false,['spacing','radius']);
  assert.ok(multiDefaulted.includes('`spacing`, `radius` are this system\'s own documented default'));
});
test('metadata quotes punctuation and newlines, and project filenames have safe fallbacks', () => {
  const md=M.markdown({...profile,project:'A: "B"\n---'},{});
  assert.ok(md.includes('project: "A: \\"B\\"\\n---"'));
  assert.equal(M.slug('中文'),'design-system');
  assert.equal(M.slug('../../My Project'),'my-project');
});
test('Markdown omits embedded binary assets while preserving dependency references', () => {
  const md=M.markdown(profile,{typography:{primaryFont:{family:'Brand font',source:'upload',dataUrl:'data:font/woff2;base64,PRIVATE_BINARY'}},icons:{uploads:[{name:'sample-icon.svg',dataUrl:'data:image/svg+xml;base64,PRIVATE_ICON'}]}});
  assert.ok(!md.includes('PRIVATE_BINARY'));assert.ok(!md.includes('PRIVATE_ICON'));
  assert.ok(md.includes('Brand font'));assert.ok(md.includes('sample-icon.svg'));
  assert.ok(md.includes('[Binary asset omitted; obtain Foundation JSON]'));
});

const libraryStore=()=>{const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)};};
test('new projects preserve previous Foundation records and can be reopened by stable id',()=>{
 const s=libraryStore(),first=M.save(s,profile);s.setItem('ads:radius','{"philosophy":"sharp"}');s.setItem('ads:theme','dark');
 const second=M.save(s,{...profile,project:'Another project',name:'Another designer'},{newProject:true});
 assert.notEqual(first.id,second.id);assert.equal(s.getItem('ads:radius'),null);assert.equal(s.getItem('ads:theme'),'dark');
 assert.equal(M.listProjects(s).length,2);
 s.setItem('ads:radius','{"philosophy":"round"}');M.openProject(s,first.id);
 assert.equal(M.read(s).project,profile.project);assert.equal(s.getItem('ads:radius'),'{"philosophy":"sharp"}');
 M.openProject(s,second.id);assert.equal(s.getItem('ads:radius'),'{"philosophy":"round"}');
 const renamed=M.save(s,{...profile,project:'Renamed project'});assert.equal(renamed.id,second.id);assert.equal(M.listProjects(s).length,2);
});
test('failed archive or active profile writes roll back every changed record',()=>{
 const s=libraryStore();M.save(s,profile);s.setItem('ads:radius','saved radius');const before=M.listProjects(s),raw=s.getItem(M.KEY),history=s.getItem(M.HISTORY);
 const set=s.setItem;let failed=false;s.setItem=(key,value)=>{if(key===M.KEY&&!failed){failed=true;throw Error('quota');}set(key,value);};
 assert.throws(()=>M.save(s,{...profile,project:'Unsaved project'},{newProject:true}),/unchanged/);
 assert.equal(s.getItem(M.KEY),raw);assert.equal(s.getItem(M.HISTORY),history);assert.equal(s.getItem('ads:radius'),'saved radius');assert.deepEqual(M.listProjects(s),before);
});
test('unreadable history and unsaved drafts are preserved instead of overwritten',()=>{
 const s=libraryStore();M.save(s,profile);const raw=s.getItem(M.KEY);s.setItem(M.HISTORY,'{broken');
 assert.throws(()=>M.save(s,{...profile,project:'New project'},{newProject:true}),/history/);assert.equal(s.getItem(M.KEY),raw);assert.equal(s.getItem(M.HISTORY),'{broken');
 s.removeItem(M.HISTORY);s.setItem(M.DRAFT,'unsaved');assert.throws(()=>M.openProject(s,M.read(s).id),/draft/);assert.equal(s.getItem(M.DRAFT),'unsaved');
});
test('deleteProject archives instead of removing outright, and hides it from listProjects',()=>{
 const s=libraryStore();const first=M.save(s,profile,{newProject:true}),second=M.save(s,{...profile,project:'Another project'},{newProject:true});
 assert.equal(M.listProjects(s).length,2);
 M.deleteProject(s,first.id);
 const visible=M.listProjects(s);assert.equal(visible.length,1);assert.equal(visible[0].id,second.id);
 // Still physically present in HISTORY, just archived - not gone yet.
 const raw=JSON.parse(s.getItem(M.HISTORY));assert.ok(raw.projects.find(row=>row.id===first.id)?.archivedAt);
 // Deleting the currently-open project clears the active profile too.
 assert.equal(M.read(s)?.id,second.id);
 M.deleteProject(s,second.id);assert.equal(M.read(s),null);assert.equal(M.listProjects(s).length,0);
});
test('deleteProject is idempotent and rejects an unknown id',()=>{
 const s=libraryStore();const row=M.save(s,profile,{newProject:true});
 assert.throws(()=>M.deleteProject(s,'not-a-real-id'),/no longer available/);
 M.deleteProject(s,row.id);assert.doesNotThrow(()=>M.deleteProject(s,row.id));
 assert.equal(M.listProjects(s).length,0);
});
test('an archived project is permanently purged once ARCHIVE_RETENTION_DAYS elapses',()=>{
 const s=libraryStore();const row=M.save(s,profile,{newProject:true});M.deleteProject(s,row.id);
 const history=JSON.parse(s.getItem(M.HISTORY));
 const stale=new Date(Date.now()-(M.ARCHIVE_RETENTION_DAYS*24*60*60*1000+60000)).toISOString();
 history.projects[0].archivedAt=stale;s.setItem(M.HISTORY,JSON.stringify(history));
 assert.equal(M.listProjects(s).length,0);
 // listProjects() purges expired archives on read, not just hides them.
 assert.equal(JSON.parse(s.getItem(M.HISTORY)).projects.length,0);
});
