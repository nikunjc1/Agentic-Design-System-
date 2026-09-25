const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../project-model.js');
const profile = {project:'Claims',productType:'Enterprise portal',platforms:['desktop-web','mobile-web'],name:'Sample User',email:'sample@example.com',designation:'UX Lead',role:'Designer'};
const store = () => { const m = new Map(); return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)}; };
test('requires all five requested answers and a valid delivery platform', () => {
  assert.deepEqual(M.validate(profile),{});
  for (const key of ['name','email','designation','role','productType']) assert.ok(M.validate({...profile,[key]:''})[key]);
  assert.ok(M.validate({...profile,email:'bad'})['email']);
  assert.ok(M.validate({...profile,platforms:['unknown']}).platforms);
  assert.ok(M.validate({...profile,platforms:[]}).platforms);
  assert.ok(M.validate({...profile,productType:'Other'}).productOther);
  assert.ok(M.validate({...profile,role:'Other'}).roleOther);
});
test('profile survives reload and malformed storage is not overwritten', () => {
  const s = store(); M.save(s,profile); assert.equal(M.read(s).name,profile.name);
  s.setItem(M.KEY,'broken'); assert.throws(()=>M.read(s)); assert.equal(s.getItem(M.KEY),'broken');
  assert.throws(()=>M.save(s,{...profile,email:'bad'})); assert.equal(s.getItem(M.KEY),'broken');
});
test('Markdown contains saved tokens, selected platforms and source guides; identity is opt-in', () => {
  const tokens = {colors:{light:{primary:{hex:'#123456'}}}};
  const docs = [{file:'input-text-field.html',title:'Input',status:'Available',markdown:'Use a visible label.'}];
  const md = M.markdown(profile,tokens,docs);
  assert.ok(md.includes('#123456')); assert.ok(md.includes('Mobile web')); assert.ok(!md.includes('### Mobile app'));
  assert.ok(md.includes('Use a visible label.')); assert.ok(!md.includes(profile.email)); assert.ok(!md.includes(profile.name)); assert.ok(!md.includes(profile.designation));
  const privateMd=M.markdown(profile,tokens,[],true); assert.ok(privateMd.includes(profile.email)); assert.ok(privateMd.includes(profile.designation));
});
test('metadata quotes punctuation and newlines, and project filenames have safe fallbacks', () => {
  const md=M.markdown({...profile,project:'A: "B"\n---'},{});
  assert.ok(md.includes('project: "A: \\"B\\"\\n---"'));
  assert.equal(M.slug('中文'),'design-system');
  assert.equal(M.slug('../../My Project'),'my-project');
});
