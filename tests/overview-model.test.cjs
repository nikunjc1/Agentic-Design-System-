const {test} = require('node:test');
const assert = require('node:assert/strict');
const M = require('../overview-model.js');
const input = {project:'Claims Portal',name:'Jordan Lee',email:'jordan@example.com',role:'Other',jobTitle:'QA Lead'};
const storage = seed => {const values=new Map(Object.entries(seed||{}));return {getItem:k=>values.has(k)?values.get(k):null,setItem:(k,v)=>values.set(k,v)};};
test('validation rejects whitespace, invalid email, missing custom role and normalized duplicate names',()=>{
  assert.deepEqual(Object.keys(M.validateProject({project:' ',name:' ',email:'bad',role:'Other',jobTitle:' '},[])).sort(),['email','jobTitle','name','project']);
  assert.ok(M.validateProject({...input,project:' claims   PORTAL '},[M.project(input)]).project);
  assert.deepEqual(M.validateProject(input,[]),{});
  assert.equal(M.project({...input,role:'Developer',jobTitle:'stale'}).jobTitle,'');
});
test('legacy profile/history are migrated without presenting placeholder links as live',()=>{
  const old={project:'Older project',name:'Lee',email:'lee@example.com',role:'Designer',slug:'old-1',ts:123};
  const s=storage({'ads:copy-profile':JSON.stringify(old),'ads:link-history':JSON.stringify([old])});
  const data=M.load(s);assert.equal(data.projects.length,1);assert.equal(data.projects[0].resources.length,3);
  assert.ok(data.projects[0].resources.every(r=>M.status(r)==='expired'));assert.equal(s.getItem(M.KEY),null);
  M.save(s,data);assert.equal(M.load(s).projects[0].id,'old-1');
});
test('corrupt storage is rejected and not overwritten',()=>{
  const s=storage({[M.KEY]:'{"version":1,"projects":[{}]}'});assert.throws(()=>M.load(s));assert.equal(s.getItem(M.KEY),'{"version":1,"projects":[{}]}');
});
test('resource history preserves failed attempts and expires only successful previews',()=>{
  const p=M.project(input), failed=M.resource(p,'npm','','Failed'), ready=M.resource(p,'npm','{}');p.resources.push(failed,ready);
  assert.equal(M.latest(p,'npm'),ready);assert.equal(p.resources.length,2);assert.equal(M.status(ready,ready.expiresAt),'expired');assert.equal(M.status(failed,Infinity),'failed');
});
test('invites validate duplicates, self, access, expiration and accepted state',()=>{
  const p=M.project(input);assert.throws(()=>M.invite(p,input.email,'Viewer'));assert.throws(()=>M.invite(p,'a@b.com','Owner'));
  const invite=M.invite(p,'person@example.com','Viewer');p.invites.push(invite);
  assert.throws(()=>M.invite(p,'PERSON@example.com','Viewer'));assert.equal(M.inviteStatus(invite,invite.expiresAt),'expired');
  invite.status='accepted';assert.equal(M.inviteStatus(invite,Infinity),'accepted');
});
test('shared snapshots exclude owner identity and invitations and reject bad payloads',()=>{
  const p=M.project(input);p.resources.push(M.resource(p,'css',':root {}'));p.invites.push(M.invite(p,'private@example.com','Viewer'));
  const snapshot=M.publicSnapshot(p);const json=JSON.stringify(snapshot);
  assert.ok(!json.includes(input.email));assert.ok(!json.includes(input.name));assert.ok(!json.includes('private@example.com'));
  assert.equal(M.validateSnapshot(snapshot).project,input.project);
  assert.throws(()=>M.validateSnapshot({...snapshot,expiresAt:0}));
  assert.throws(()=>M.validateSnapshot({...snapshot,resources:[{type:'javascript'}]}));
});
