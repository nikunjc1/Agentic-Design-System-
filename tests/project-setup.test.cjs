const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../onboarding-model.js'),P=require('../project-model.js'),F=require('../foundation-model.js');
const {defaultAnswers:a}=require('../tools/onboarding-browser.cjs');
test('saved onboarding answers win over later foundation customization',()=>{
 const existing=M.buildPlan({...a,cornerStyle:'expressive'}).records;
 assert.equal(M.savedAnswers(a,existing).cornerStyle,'soft');
 assert.equal(M.savedAnswers({...a,cornerStyle:undefined},existing).cornerStyle,'expressive');
});
test('identity-only edits do not reapply any foundations',()=>{
 const records=M.buildPlan(a).records;records.radius.philosophy='compact';
 assert.deepEqual(M.buildUpdate({...a,project:'New title',email:'new@example.com'},a,records),{});
});
test('only changed design choices patch their foundation and preserve detailed options',()=>{
 const records=M.buildPlan(a).records;records.icons.stroke=3;records.colors.dark={primary:{hex:'#ABCDEF'},auto:false};
 const before=JSON.stringify(records),changed=M.buildUpdate({...a,brandColor:'#225544',cornerStyle:'compact',iconStyle:'line'},a,records);
 assert.deepEqual(Object.keys(changed).sort(),['colors','icons','radius']);
 assert.equal(changed.colors.light.primary.hex,'#225544');assert.equal(changed.colors.dark.primary.hex,'#ABCDEF');
 assert.equal(changed.icons.stroke,3);assert.equal(changed.icons.system,'line');assert.equal(changed.radius.philosophy,'compact');assert.equal(JSON.stringify(records),before);
});
test('matching onboarding brand pair updates together; recommended spacing follows changed context',()=>{
 const records=M.buildPlan(a).records;
 assert.equal(M.buildUpdate({...a,brandColor:'#225544'},a,records).colors.dark.primary.hex,'#225544');
 const before={...a,spacingSystem:'recommended'},after={...before,productType:'Dashboard',platforms:['desktop-web']};
 assert.equal(M.buildUpdate(after,before,records).spacing.system,F.contextualDefault('spacing',after).system);
});
test('editing preserves project identity, unrelated records and a single history entry',()=>{
 const store=new Map(),storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const original=P.save(storage,a,{newProject:true,foundationRecords:M.buildPlan(a).records});
 const typography=storage.getItem('ads:typography');const answers={...a,project:'Edited',cornerStyle:'compact'};
 const updated=P.save(storage,{...original,...answers},{expectedRaw:storage.getItem(P.KEY),foundationRecords:M.buildUpdate(answers,a,{radius:JSON.parse(storage.getItem('ads:radius'))})});
 assert.equal(updated.id,original.id);assert.equal(storage.getItem('ads:typography'),typography);assert.equal(P.listProjects(storage).length,1);
 assert.throws(()=>M.buildUpdate({...a,email:'bad'},a,{}),/highlighted/);
});
