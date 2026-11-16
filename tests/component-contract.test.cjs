const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../component-contract-model.js'),{createBridge}=require('../tools/component-bridge.cjs');
function storage(){const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};}
test('typed properties, conditions, variants and behavior share one compiled definition',()=>{
 const c=M.blank('Toggle');c.properties.push({id:'active',name:'Active',type:'boolean',default:false});c.selection.active=false;c.anatomy.children[0].visibleWhen=[{property:'active',equals:true}];c.variants.push({id:'active',name:'Active',when:{active:true},overrides:{root:{styles:{gap:'16px'}}}});c.behaviors=[{target:'root',event:'click',property:'active',value:'$toggle'}];
 assert.deepEqual(M.validate(c),[]);assert.equal(M.compile(c).tree.children.length,0);assert.equal(M.compile(c,{active:true}).tree.children.length,1);assert.equal(M.compile(c,{active:true}).tree.styles.gap,'16px');assert.equal(M.compile(c,null,{includeHidden:true}).tree.children[0].visible,false);
});
test('clear visibility conditions restore the trailing icon when the value is emptied',()=>{
 const c=M.blank('Trailing icon');c.properties.push({id:'allowClear',name:'Allow clear',type:'boolean',default:true},{id:'value',name:'Value',type:'text',default:'hello'});
 c.anatomy.children[0].hiddenWhen=[{property:'allowClear',equals:true},{property:'value',equals:'',not:true}];
 assert.deepEqual(M.validate(c),[]);assert.equal(M.compile(c).tree.children.length,0);assert.equal(M.compile(c,{value:''}).tree.children.length,1);assert.equal(M.compile(c,{allowClear:false}).tree.children.length,1);
 c.anatomy.children[0].hiddenWhen[0].property='missing';assert.ok(M.validate(c).some(e=>e.includes('Unknown visibility property')));
});
test('draft, cancel, revisions and stale saves preserve the durable component',()=>{
 const s=storage(),c=M.blank('Save');M.draft(s,c,0);const first=M.save(s,c,0);assert.equal(first.revision,1);c.name='Changed';M.draft(s,c,1);assert.equal(M.read(s,c.id).saved.name,'Save');M.discard(s,c.id);assert.equal(M.read(s,c.id).draft,null);
 const second=M.save(s,c,1);assert.equal(second.revision,2);assert.equal(M.read(s,c.id).history[0].name,'Save');assert.throws(()=>M.save(s,first,1),/another tab/);
});
test('future and malformed storage cannot be silently overwritten',()=>{
 const s=storage(),c=M.blank();s.setItem(M.PREFIX+c.id,JSON.stringify({schemaVersion:9,saved:c,history:[]}));assert.throws(()=>M.save(s,c,0),/Unsupported/);assert.equal(JSON.parse(s.getItem(M.PREFIX+c.id)).schemaVersion,9);
});
test('validation rejects invalid references, tokens, executable attributes and future schemas',()=>{
 for(const mutate of [c=>c.schemaVersion=9,c=>c.anatomy.bind='missing',c=>c.anatomy.styles.color='var(--missing)',c=>c.anatomy.attributes={onclick:'alert(1)'},c=>c.anatomy.attributes={href:'javascript:alert(1)'},c=>c.variants=[{id:'x',when:{},overrides:{root:{attributes:{onclick:'bad'}}}}],c=>c.anatomy.children.push(M.clone(c.anatomy.children[0]))]){const c=M.blank();mutate(c);assert.ok(M.validate(c).length);}
 const poisoned=JSON.parse(JSON.stringify(M.blank()).replace('"selection":{','"selection":{"__proto__":{},'));assert.ok(M.validate(poisoned).length);assert.equal({}.polluted,undefined);
});
test('diff tracks stable part IDs, ordering and individual property changes',()=>{
 const c=M.blank(),next=M.clone(c);next.anatomy.children.push({id:'extra',kind:'text',text:'More'});assert.ok(M.diff(c,next).some(row=>row.path.includes('/extra')));next.anatomy.children.reverse();assert.ok(M.diff(c,next).some(row=>row.path.endsWith('/@order')));next.selection.label='New';assert.ok(M.diff(c,next).some(row=>row.path==='/selection/label'));
});
test('library suggestions preserve established property conventions',()=>{
 const c=M.blank(),other=M.blank();other.properties.push({id:'size',name:'Control size',type:'options',default:'compact',options:['compact','regular']});assert.equal(M.suggestions(c,[other]).find(p=>p.id==='size').name,'Control size');
});
test('reusable component references compile with scoped part IDs and property bindings',()=>{
 const parent=M.blank('Parent'),child=M.blank('Child');child.selection.label='Child label';parent.references={[child.id]:child};parent.anatomy.children=[{id:'child',kind:'instance',reference:child.id,styles:{}}];assert.deepEqual(M.validate(parent),[]);const compiled=M.compile(parent);assert.equal(compiled.tree.children[0].id,'child');assert.equal(compiled.tree.children[0].children[0].id,'child--label');assert.equal(compiled.tree.children[0].children[0].text,'Child label');
});
test('attribute bindings and transitive token validation preserve executable semantics',()=>{
 const c=M.blank();c.properties.push({id:'placeholder',name:'Placeholder',type:'text',default:'Enter value'});c.selection.placeholder='Current placeholder';c.anatomy.tag='input';c.anatomy.attributeBindings={placeholder:'placeholder'};assert.equal(M.compile(c).tree.attributes.placeholder,'Current placeholder');c.tokens={'--a':'var(--b)','--b':'8px'};assert.deepEqual(M.validate(c),[]);c.tokens['--b']='var(--a)';assert.ok(M.validate(c).some(error=>error.includes('Cyclic')));
});
test('bridge waits for plugin completion, validates contracts and reports timeout',async()=>{
 const server=createBridge({timeout:250});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 try{
  const c=M.blank('Bridge'),pending=fetch(origin+'/contracts/push',{method:'POST',body:JSON.stringify({contract:c})});await new Promise(r=>setTimeout(r,30));const job=await (await fetch(origin+'/bridge/next')).json();assert.equal(job.contract.id,c.id);assert.equal(job.operation,'push');
  await fetch(origin+'/bridge/result',{method:'POST',body:JSON.stringify({jobId:job.jobId,result:{componentId:c.id,nodeId:'1:1',revision:0}})});assert.equal((await (await pending).json()).nodeId,'1:1');
  const invalid=await fetch(origin+'/contracts/push',{method:'POST',body:JSON.stringify({schemaVersion:99})});assert.equal(invalid.status,400);
  const timeout=await fetch(origin+'/contracts/pull',{method:'POST',body:JSON.stringify({componentId:c.id})});assert.equal(timeout.status,504);assert.match((await timeout.json()).error,/No completed result/);
  const hostile=await fetch(origin+'/bridge/next',{headers:{Origin:'https://example.com'}});assert.equal(hostile.status,403);
  const stale=await fetch(origin+'/bridge/result',{method:'POST',body:JSON.stringify({jobId:'unknown',result:{}})});assert.equal(stale.status,404);assert.match((await stale.json()).error,/expired or already completed/);
 }finally{await new Promise(r=>server.close(r));}
});
test('bridge reports a full queue instead of accepting unbounded pending pushes',async()=>{
 const server=createBridge({timeout:200});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 try{
  const pushes=Array.from({length:20},()=>fetch(origin+'/contracts/push',{method:'POST',body:JSON.stringify({contract:M.blank('Queued')})}));
  await new Promise(r=>setTimeout(r,30));
  const overflow=await fetch(origin+'/contracts/push',{method:'POST',body:JSON.stringify({contract:M.blank('Overflow')})});
  assert.equal(overflow.status,429);assert.match((await overflow.json()).error,/queue is full/);
  for(const response of await Promise.all(pushes))assert.equal(response.status,504);
 }finally{await new Promise(r=>server.close(r));}
});
// shell.js's exportCatalog strips each component's own contract.tokens to
// {} before sending - it's an exact copy of the one shared Foundation
// token set, duplicated once per component for no reason, and that
// duplication is what actually trips a request-size limit once a
// customized Foundation (uploaded fonts/icons) makes that shared set a few
// MB (a user-reported "Contract exceeds the ... MB limit" turned out to be
// this, not a genuinely oversized export). The bridge must re-hydrate each
// item's tokens from the one shared copy before M.assert validates it, so
// real token references still resolve, while still rejecting a component
// that references a token missing from even the rehydrated set.
test('pushCatalog re-hydrates each item\'s stripped tokens from the shared set before validating, and still rejects a genuinely unresolved token',async()=>{
 const server=createBridge();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 try{
  await fetch(origin+'/bridge/connect',{method:'POST',body:JSON.stringify({clientId:'test-client',build:'test-build'})});
  const makeContract=(name,colorVar)=>{const c=M.blank(name);c.tokens={};c.anatomy.styles.color=colorVar;return c;};
  const valid=await fetch(origin+'/contracts/jobs',{method:'POST',body:JSON.stringify({operation:'pushCatalog',items:[{name:'Valid',category:'General',contract:makeContract('Valid','var(--text-hi)')}],tokens:{'--text-hi':'#111827'}})});
  assert.equal(valid.status,202,'a stripped-tokens item resolves against the shared tokens field and is accepted');
 }finally{await new Promise(r=>server.close(r));}
 const rejectServer=createBridge();await new Promise(r=>rejectServer.listen(0,'127.0.0.1',r));const rejectOrigin='http://127.0.0.1:'+rejectServer.address().port;
 try{
  await fetch(rejectOrigin+'/bridge/connect',{method:'POST',body:JSON.stringify({clientId:'test-client',build:'test-build'})});
  const makeContract=(name,colorVar)=>{const c=M.blank(name);c.tokens={};c.anatomy.styles.color=colorVar;return c;};
  const invalid=await fetch(rejectOrigin+'/contracts/jobs',{method:'POST',body:JSON.stringify({operation:'pushCatalog',items:[{name:'Invalid',category:'General',contract:makeContract('Invalid','var(--does-not-exist)')}]})});
  assert.equal(invalid.status,400);assert.match((await invalid.json()).error,/Unresolved token --does-not-exist/);
 }finally{await new Promise(r=>rejectServer.close(r));}
});
test('a running bridge reloads a changed validator without a process restart',async()=>{
 const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
 const folder=await fs.mkdtemp(path.join(os.tmpdir(),'ads-validator-')),modelFile=path.join(folder,'model.cjs');
 await fs.writeFile(modelFile,"module.exports={assert(){throw new Error('validator one')}};");
 const server=createBridge({modelFile});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{
  const push=()=>fetch('http://127.0.0.1:'+server.address().port+'/contracts/push',{method:'POST',body:JSON.stringify(M.blank('Validator'))});
  assert.equal((await (await push()).json()).error,'validator one');
  await fs.writeFile(modelFile,"module.exports={assert(){throw new Error('validator two')}};");
  assert.equal((await (await push()).json()).error,'validator two');
 }finally{await new Promise(r=>server.close(r));delete require.cache[modelFile];await fs.rm(folder,{recursive:true});}
});
test('plugin UI displays status but never polls or sends scene jobs',()=>{
 const vm=require('node:vm'),fs=require('node:fs'),messages=[],elements=new Map();
 const script=fs.readFileSync(require('node:path').join(__dirname,'../figma-plugin/ui.html'),'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
 const sandbox={setTimeout:()=>{},parent:{postMessage:message=>messages.push(message)},document:{getElementById:id=>{if(!elements.has(id))elements.set(id,{});return elements.get(id);}}};sandbox.window=sandbox;vm.createContext(sandbox);vm.runInContext(script,sandbox);
 assert.equal(messages[0].pluginMessage.type,'hello');sandbox.onmessage({data:{pluginMessage:{type:'ready',build:'v6',transport:'native-fetch'}}});assert.match(elements.get('build').textContent,/native-fetch/);
 sandbox.onmessage({data:{pluginMessage:{type:'progress',phase:'Rendering 48 / 1152'}}});assert.equal(elements.get('status').textContent,'Rendering 48 / 1152');elements.get('connect').onclick();assert.equal(messages.at(-1).pluginMessage.type,'connect');
});
