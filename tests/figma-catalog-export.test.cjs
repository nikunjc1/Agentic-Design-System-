const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const M=require('../component-contract-model.js'),fixture=require('./figma-fixture.cjs'),adapterFactory=require('../figma-plugin/adapter.js');

test('Foundation categories: every token name sorts into its expected collection',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 const tokens={
  '--space-8':'8px','--radius-md':'8px','--shadow-sm':'0 1px 4px rgba(0,0,0,0.08)',
  '--icon-size':'20px','--type-body-size':'14px','--grid-columns':'12',
  '--border-width-1':'1px','--line':'rgba(15,15,10,0.08)','--line-strong':'rgba(15,15,10,0.15)',
  '--control-border':'#85888d','--red-500':'#FF031A','--brand-500':'var(--red-500)',
  '--text-hi':'#15171a','--button-primary-bg-default':'var(--red-500)',
  '--opacity-40':'0.4','--duration-fast':'0.12s','--layer-dialog':'70',
 };
 const result=await adapter.pushFoundations(tokens);
 const collections=await f.figma.variables.getLocalVariableCollectionsAsync(),variables=await f.figma.variables.getLocalVariablesAsync();
 const collectionNameOf=token=>{const v=variables.find(v=>v.name===token.replace(/^--/,'').replace(/-/g,'/'));assert.ok(v,'variable missing for '+token);return collections.find(c=>c.id===v.variableCollectionId).name;};
 const expect={
  '--space-8':'Spacing Tokens','--radius-md':'Radius Tokens','--shadow-sm':'Shadows Tokens',
  '--icon-size':'Icons Tokens','--type-body-size':'Typography Tokens','--grid-columns':'Grid & Layout Tokens',
  '--border-width-1':'Borders Tokens','--line':'Borders Tokens','--line-strong':'Borders Tokens',
  '--control-border':'Borders Tokens','--red-500':'Colors Tokens','--brand-500':'Colors Tokens',
  '--text-hi':'Colors Tokens','--button-primary-bg-default':'Colors Tokens',
  '--opacity-40':'Other Tokens','--duration-fast':'Other Tokens','--layer-dialog':'Other Tokens',
 };
 for(const [token,expected] of Object.entries(expect))assert.equal(collectionNameOf(token),expected,token);
 assert.equal(result.created,Object.keys(tokens).length);
});

test('pushFoundations resolves exact COLOR/FLOAT/STRING values and binds aliases as real VARIABLE_ALIAS, not duplicated literals',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 const tokens={'--red-500':'#FF031A','--brand-500':'var(--red-500)','--space-8':'8px','--border-style':'solid','--shadow-sm':'0 1px 4px rgba(0,0,0,0.08)'};
 await adapter.pushFoundations(tokens);
 const variables=await f.figma.variables.getLocalVariablesAsync(),v=name=>variables.find(v=>v.name===name);
 assert.deepEqual(v('red/500').value,{r:1,g:3/255,b:26/255});assert.equal(v('red/500').resolvedType,'COLOR');
 assert.deepEqual(v('brand/500').value,{type:'VARIABLE_ALIAS',id:v('red/500').id});assert.equal(v('brand/500').resolvedType,'COLOR');
 assert.equal(v('space/8').value,8);assert.equal(v('space/8').resolvedType,'FLOAT');
 assert.equal(v('border/style').value,'solid');assert.equal(v('border/style').resolvedType,'STRING');
 assert.equal(v('shadow/sm').value,'0 1px 4px rgba(0,0,0,0.08)');assert.equal(v('shadow/sm').resolvedType,'STRING');
});

test('pushFoundations breaks a cyclic alias chain with a warning instead of a stack overflow',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 const result=await adapter.pushFoundations({'--a':'var(--b)','--b':'var(--c)','--c':'var(--a)','--space-8':'8px'});
 assert.equal(result.created,4,'every token still gets a variable, cycle broken not dropped');
 assert.ok(result.warnings.some(w=>/Cyclic/.test(w)));
});

test('pushCatalog: re-running the same catalog preserves variable/page/component-set identity exactly, no duplicates',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 const c=M.blank('WidgetA');c.tokens={'--space-8':'8px','--red-500':'#FF031A'};c.anatomy.styles.gap='var(--space-8)';c.anatomy.styles.backgroundColor='var(--red-500)';
 const items=[{name:'WidgetA',category:'General',contract:c}];
 const findSet=node=>node.type==='COMPONENT_SET'?node:(node.children||[]).map(findSet).find(Boolean);
 const r1=await adapter.pushCatalog(items,c.tokens);
 const page1=f.figma.root.children.find(p=>p.name==='WidgetA'),set1=findSet(page1);
 const varIds1=(await f.figma.variables.getLocalVariablesAsync()).map(v=>v.id).sort();
 const r2=await adapter.pushCatalog(items,c.tokens);
 const page2=f.figma.root.children.find(p=>p.name==='WidgetA'),set2=findSet(page2);
 const varIds2=(await f.figma.variables.getLocalVariablesAsync()).map(v=>v.id).sort();
 assert.equal(page1.id,page2.id);assert.equal(set1.id,set2.id);assert.deepEqual(varIds1,varIds2);
 assert.equal(r1.foundations.created,r2.foundations.created);
 assert.equal(f.figma.root.children.filter(p=>p.name==='Foundations').length,1,'exactly one Foundations page, never duplicated');
});

test('pushCatalog: only selected categories get a divider - no stray dividers for categories not in the run',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 await adapter.pushCatalog([{name:'OnlyGeneral',category:'General',contract:M.blank('OnlyGeneral')}]);
 const dividers=f.figma.root.children.filter(p=>p.getPluginData('ads-category-divider'));
 assert.equal(dividers.length,1);assert.equal(dividers[0].getPluginData('ads-category-divider'),'General');
});

test('documentation frame: title/description/guidelines/canvas render correctly, and guidelines hide when there are no accessibility notes',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 const c=M.blank('Widget');c.revision=1;c.accessibility=['Note one.','Note two.'];
 const result=await adapter.push(c);
 const docFrame=f.figma.currentPage.children.find(n=>n.getPluginData('ads-doc-frame')===c.id);
 const title=docFrame.children.find(n=>n.getPluginData('ads-doc-part')==='title');
 const description=docFrame.children.find(n=>n.getPluginData('ads-doc-part')==='description');
 const guidelines=docFrame.children.find(n=>n.getPluginData('ads-doc-part')==='guidelines');
 const canvas=docFrame.children.find(n=>n.getPluginData('ads-doc-part')==='canvas');
 assert.equal(title.characters,'Widget');assert.match(description.characters,/variant/);
 assert.equal(guidelines.visible,true);assert.equal(guidelines.characters,'Usage guidelines\n•  Note one.\n•  Note two.');
 const set=await f.figma.getNodeByIdAsync(result.nodeId);assert.equal(set.parent.id,canvas.id);

 const bare=M.blank('Bare');bare.revision=1;bare.accessibility=[];
 await adapter.push(bare);
 const bareDocFrame=f.figma.currentPage.children.find(n=>n.getPluginData('ads-doc-frame')===bare.id);
 assert.equal(bareDocFrame.children.find(n=>n.getPluginData('ads-doc-part')==='guidelines').visible,false);
});

test('pushCatalog: one invalid contract fails in isolation, siblings still succeed, and no orphaned page is left for it',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 const broken=M.blank('Broken');broken.properties='not-an-array';
 const items=[
  {name:'Good1',category:'General',contract:M.blank('Good1')},
  {name:'Broken',category:'General',contract:broken},
  {name:'Good2',category:'Data Entry',contract:M.blank('Good2')},
 ];
 const result=await adapter.pushCatalog(items);
 assert.equal(result.total,3);assert.equal(result.pushed,2);assert.equal(result.failed,1);
 assert.ok(result.results.find(r=>r.name==='Broken').error);
 assert.ok(result.results.find(r=>r.name==='Good1'&&!r.error));
 assert.ok(result.results.find(r=>r.name==='Good2'&&!r.error));
 assert.ok(f.figma.root.children.find(p=>p.name==='Good1'));
 assert.ok(f.figma.root.children.find(p=>p.name==='Good2'));
 assert.ok(!f.figma.root.children.find(p=>p.name==='Broken'),'no orphaned empty page left for the failed component');
});

test('pushCatalog: a later failed re-push on an already-successful component does not delete its earlier page/content',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 const c=M.blank('Survivor');c.revision=1;
 const r1=await adapter.pushCatalog([{name:'Survivor',category:'General',contract:c}]);
 assert.equal(r1.pushed,1);
 const page1=f.figma.root.children.find(p=>p.name==='Survivor');
 assert.ok(page1.children.length>0);
 const brokenRetry=M.clone(c);brokenRetry.properties='not-an-array';
 const r2=await adapter.pushCatalog([{name:'Survivor',category:'General',contract:brokenRetry}]);
 assert.equal(r2.failed,1);
 const page2=f.figma.root.children.find(p=>p.id===page1.id);
 assert.ok(page2,'the page from the earlier successful push still exists');
 assert.ok(page2.children.length>0,'its real content was not deleted by the later failure');
});

test('a node with border-style none on every side gets no stroke at all, not a hidden-but-bound fallback color',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 const c=M.blank('NoBorder');c.revision=1;c.anatomy.styles.borderStyle='none';c.anatomy.styles.color='#222222';
 const result=await adapter.push(c);
 const set=await f.figma.getNodeByIdAsync(result.nodeId);
 const master=set.type==='COMPONENT'?set:set.children[0];
 assert.deepEqual(master.strokes,[],'no visible border side means no stroke, not a fallback to the computed text color');
 assert.equal(master.boundVariables.strokes,undefined,'no stray variable binding for a stroke that does not exist');
});

test('push() sets the component set\'s native Figma description field, not just the visual doc-frame text',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 const c=M.blank('Widget');c.revision=1;
 const result=await adapter.push(c);
 const set=await f.figma.getNodeByIdAsync(result.nodeId);
 assert.match(set.description,/variant/,'native description set (shown in Figma\'s own Assets panel/library), not left blank');
 const docFrame=f.figma.currentPage.children.find(n=>n.getPluginData('ads-doc-frame')===c.id);
 const descriptionNode=docFrame.children.find(n=>n.getPluginData('ads-doc-part')==='description');
 assert.equal(descriptionNode.characters,set.description,'the visual doc-frame and the native field stay in sync, not two divergent copies');
});

test('Button appearance-family merge inside pushCatalog: exactly one documentation frame on the Button page, not one per sub-appearance',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M);
 const makeFamily=name=>{const c=M.blank(name);c.revision=0;return c;};
 const members=['Primary','Secondary','Tertiary'].map(appearance=>({appearance,contract:makeFamily(appearance+' Button')}));
 const seed={schemaVersion:M.VERSION,id:M.id('button'),revision:0,name:'Button',authority:'contract',
  properties:[{id:'appearance',name:'Appearance',type:'options',options:members.map(m=>m.appearance),default:'Primary'}],
  selection:{appearance:'Primary'},
  anatomy:{id:'root',name:'Button',kind:'container',tag:'div',styles:{display:'inline-flex'},children:[]},
  variants:[],tokens:{},behaviors:[],accessibility:[],adapters:{figma:{variableMap:{}}},
  source:{page:'button-family',kind:'button-appearance-family'},families:members};
 const result=await adapter.pushCatalog([{name:'Button',category:'General',contract:seed}]);
 assert.equal(result.pushed,1);
 const buttonPage=f.figma.root.children.find(p=>p.name==='Button');
 const docFrames=buttonPage.children.filter(n=>n.getPluginData('ads-doc-frame'));
 assert.equal(docFrames.length,1,'exactly one documentation frame, not one per merged appearance');
 assert.equal(docFrames[0].getPluginData('ads-doc-frame'),seed.id);
});
