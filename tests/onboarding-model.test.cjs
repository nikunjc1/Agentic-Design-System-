const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../onboarding-model.js'),P=require('../project-model.js'),F=require('../foundation-model.js');
const a={project:'Claims portal',productType:'Enterprise SaaS',platforms:['desktop-web'],name:'Alex',email:'alex@example.com',designation:'UX lead',role:'Designer',brandColor:'#1357AB',spacingSystem:'8px',cornerStyle:'soft',iconStyle:'duotone'};
const storage=()=>{const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)};};
test('all questions validate independently, including conditional Other details and multiple platforms',()=>{
 assert.deepEqual(M.validate(a),{});assert.ok(M.error('email',{...a,email:'invalid'}));assert.ok(M.error('productType',{...a,productType:'Other'}));assert.ok(M.error('role',{...a,role:'Other'}));assert.ok(M.error('platforms',{...a,platforms:[]}));assert.ok(M.error('brandColor',{...a,brandColor:'red'}));assert.ok(M.error('cornerStyle',{...a,cornerStyle:'round'}));
 assert.equal(M.display('platforms',{...a,platforms:['desktop-web','mobile-app']}),'Desktop web, Mobile app');
});
test('a confirmed brief produces valid Foundation records and resolved themes matching explicit design answers',()=>{
 const plan=M.buildPlan(a);assert.deepEqual(Object.keys(plan.records).sort(),[...F.recordKeys].sort());
 for(const [key,value]of Object.entries(plan.records))assert.equal(F.inspectRecord(key,JSON.stringify(value)).status,'valid',key);
 assert.equal(plan.light.tokens['--radius-md'],'12px');assert.equal(plan.dark.tokens['--radius-md'],'12px');assert.equal(plan.records.colors.light.primary.hex,'#1357AB');assert.equal(plan.records.spacing.system,'8px');assert.equal(plan.records.icons.system,'duotone');
 const mobile=M.buildPlan({...a,platforms:['mobile-app'],spacingSystem:'recommended'});assert.equal(mobile.records['grid-layout'].columns,4);assert.deepEqual(mobile.records.typography.levels,F.contextualDefault('typography',{...a,platforms:['mobile-app']}).levels);
});
test('conversation drafts retain confirmed answers, unfinished input and the original project baseline',()=>{
 const raw=JSON.stringify({...a,version:2,newProject:true,conversation:{version:1,answered:['project','productType'],current:'platforms',pending:{platforms:['mobile-app']},baseRaw:null}}),draft=M.readDraft(raw);
 assert.equal(draft.answers.conversation,undefined);assert.equal(draft.newProject,true);assert.equal(draft.current,'platforms');assert.deepEqual(draft.answered,['project','productType']);assert.deepEqual(draft.pending,{platforms:['mobile-app']});
 const old=M.readDraft(JSON.stringify({...a,version:2,step:2}));assert.ok(old.answered.includes('project'));assert.throws(()=>M.readDraft('{broken'));
 assert.throws(()=>M.readDraft(JSON.stringify({...a,conversation:{version:50,answered:[]}})));
});
test('confirmed setup saves the profile and Foundation snapshot together, clears its draft and reopens without leaking settings',()=>{
 const s=storage(),old=P.save(s,{...a,project:'Old project'});s.setItem('ads:radius',JSON.stringify({philosophy:'sharp'}));s.setItem(P.DRAFT,'draft');
 const next=P.save(s,a,{expectedRaw:s.getItem(P.KEY),newProject:true,foundationRecords:M.buildPlan(a).records,clearDraft:true});assert.notEqual(next.id,old.id);assert.equal(s.getItem(P.DRAFT),null);assert.ok(P.foundationReadiness(s).every(row=>row.state==='saved'));
 P.openProject(s,old.id);assert.equal(JSON.parse(s.getItem('ads:radius')).philosophy,'sharp');P.openProject(s,next.id);assert.equal(JSON.parse(s.getItem('ads:radius')).philosophy,'soft');
});
test('a Foundation write failure or stale confirmation preserves the complete previous project and conversation draft',()=>{
 const s=storage();P.save(s,a);s.setItem('ads:radius','old radius');s.setItem(P.DRAFT,'original draft');const before={profile:s.getItem(P.KEY),history:s.getItem(P.HISTORY)},set=s.setItem;let failed=false;
 s.setItem=(key,value)=>{if(key==='ads:icons'&&!failed){failed=true;throw Error('quota');}set(key,value);};
 assert.throws(()=>P.save(s,{...a,project:'New project'},{newProject:true,foundationRecords:M.buildPlan(a).records,clearDraft:true}),/unchanged/);assert.equal(s.getItem(P.KEY),before.profile);assert.equal(s.getItem(P.HISTORY),before.history);assert.equal(s.getItem('ads:radius'),'old radius');assert.equal(s.getItem(P.DRAFT),'original draft');
 assert.throws(()=>P.save(s,a,{expectedRaw:'stale',foundationRecords:M.buildPlan(a).records}),/another tab/);
});

test('unfinished answers survive a detour to edit another question and old drafts remain readable',()=>{
 const draft=M.readDraft(JSON.stringify({...a,version:2,conversation:{version:1,answered:['project','productType'],current:'productType',pending:{},pendingAnswers:{name:{name:'Alex in progress'}}}}));
 assert.deepEqual(draft.pendingAnswers,{name:{name:'Alex in progress'}});
 assert.deepEqual(M.readDraft(JSON.stringify({...a,version:2})).pendingAnswers,{});
 assert.throws(()=>M.readDraft(JSON.stringify({...a,version:2,conversation:{version:1,answered:[],pendingAnswers:[]}})));
});
