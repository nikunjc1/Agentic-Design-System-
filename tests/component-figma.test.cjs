const test=require('node:test'),assert=require('node:assert/strict'),M=require('../component-contract-model.js'),adapterFactory=require('../figma-plugin/adapter.js');
const fixture=require('./figma-fixture.cjs');
test('Input helper text migrates out of a native Slot and keeps both existing layer IDs',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Slot migration');
 c.properties=[{id:'supportingText',name:'Supporting text',type:'text',default:'Help'},{id:'supportingSlot',name:'Supporting content',type:'slot',default:''}];c.selection={supportingText:'Help',supportingSlot:''};
 c.anatomy.children=[{id:'supporting-slot',kind:'slot',bind:'supportingSlot',styles:{},children:[{id:'helper',kind:'text',bind:'supportingText',styles:{}}]}];
 const first=await adapter.push(c),set=f.registry.get(first.nodeId),slot=set.findAll(n=>n.getPluginData('ads-part')==='supporting-slot')[0],helper=slot.children[0];assert.equal(slot.type,'SLOT');assert.throws(()=>{helper.componentPropertyReferences={characters:'illegal'};},/slot sublayer/);
 c.source={page:'input-text-field.html'};await adapter.push(c);const map=JSON.parse(set.getPluginData('ads-property-map'));
 assert.equal(slot.id,set.findAll(n=>n.getPluginData('ads-part')==='supporting-slot')[0].id);assert.equal(helper.id,set.findAll(n=>n.getPluginData('ads-part')==='helper')[0].id);assert.equal(helper.parent.getPluginData('ads-part'),'supporting-content');assert.equal(helper.componentPropertyReferences.characters,map.supportingText);
});
test('token names do not silently bind to another library without an explicit mapping',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),foreign={id:'foreign-color',name:'brand/color',variableCollectionId:'foreign-library',resolvedType:'COLOR'};f.variables.push(foreign);
 const c=M.blank('Token ownership');c.tokens={'--brand-color':'#123456'};c.anatomy.styles.backgroundColor='var(--brand-color)';
 const first=await adapter.push(c),root=f.registry.get(first.nodeId).children[0].children[0];assert.notEqual(root.fills[0].boundVariables.color.id,foreign.id);
 c.adapters.figma.variableMap={'--brand-color':foreign.id};await adapter.push(c);assert.equal(root.fills[0].boundVariables.color.id,foreign.id);
});
test('Input Value, Placeholder and clear visibility remain bound when the value starts empty',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Editable Input');
 c.properties=[{id:'value',name:'Value',type:'text',default:''},{id:'placeholder',name:'Placeholder',type:'text',default:'Enter email'},
  {id:'showPlaceholder',name:'Show placeholder',type:'boolean',default:true},{id:'allowClear',name:'Allow clear',type:'boolean',default:true}];
 c.selection={value:'',placeholder:'Enter email',showPlaceholder:true,allowClear:true};c.anatomy.children=[{id:'input',kind:'container',tag:'input',bind:'value',attributeBindings:{placeholder:'placeholder'},styles:{fontSize:'14px',lineHeight:'20px',flexGrow:'1','--ads-placeholder-color':'#777777'}},
  {id:'clear',kind:'text',text:'×',styles:{},visibleWhen:[{property:'allowClear',equals:true},{property:'value',equals:'',not:true}]}];
 const first=await adapter.push(c),old=f.registry.get(first.nodeId).findAll(n=>n.getPluginData('ads-part')==='input')[0];
 c.source={page:'input-text-field.html'};const result=await adapter.push(c),set=f.registry.get(result.nodeId),part=id=>set.findAll(n=>n.getPluginData('ads-part')===id)[0],map=JSON.parse(set.getPluginData('ads-property-map'));
 assert.equal(part('input').type,'FRAME');assert.equal(part('input-placeholder').id,old.id,'Migration retains the previous placeholder text layer');
 assert.equal(part('input-value').componentPropertyReferences.characters,map.value);assert.equal(part('input-placeholder').componentPropertyReferences.characters,map.placeholder);assert.equal(part('input-placeholder').componentPropertyReferences.visible,map.showPlaceholder);
 assert.equal(part('clear').componentPropertyReferences.visible,map.allowClear);assert.match(map.allowClear,/Show clear button/);assert.equal(set.componentPropertyDefinitions[map.allowClear].defaultValue,false);
 const pulled=await adapter.pull(c.id);assert.deepEqual(M.validate(pulled.contract),[]);assert.equal(pulled.contract.anatomy.children.find(n=>n.id==='input').children.length,0);
});
test('all Input sizes and radii create 1152 combinations and preserve existing configuration masters',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Input configurations');c.source={page:'input-text-field.html'};
 c.properties=[{id:'appearance',name:'Appearance',type:'options',options:['Outlined','Filled','Underlined'],default:'Outlined'},
  {id:'state',name:'State',type:'options',options:['Rest','Hover','Focused','Filled','Success','Error','Read-Only','Disabled'],default:'Rest'},
  {id:'size',name:'Size',type:'options',options:[40],default:40},{id:'radius',name:'Corner radius',type:'options',options:[4],default:4}];
 c.selection={appearance:'Outlined',state:'Rest',size:40,radius:4};c.anatomy={id:'root',kind:'container',styles:{width:'220px',height:'40px',borderRadius:'4px'},children:[]};
 const variants=()=>c.properties[0].options.flatMap(appearance=>c.properties[1].options.flatMap(state=>c.properties[2].options.flatMap(size=>c.properties[3].options.map(radius=>({id:[appearance,state,size,radius].join('-'),when:{appearance,state,size,radius},overrides:{root:{styles:{height:size+'px',borderRadius:(appearance==='Underlined'?0:radius)+'px'}}}})))));
 c.variants=variants();const first=await adapter.push(c),set=f.registry.get(first.nodeId),existing=set.children.map(n=>n.id);
 c.properties[2].options=[24,28,32,36,40,44,48,56];c.properties[3].options=[0,2,4,8,12,9999];c.variants=variants();
 assert.deepEqual(M.validate(c),[]);const result=await adapter.push(c),wrapper=f.registry.get(result.nodeId),sets=result.families.map(item=>f.registry.get(item.nodeId));
 assert.equal(result.configurationCount,1152);assert.equal(wrapper.children.length,3);assert.deepEqual(sets.map(set=>set.children.length),[384,384,384]);assert.ok(existing.every(id=>sets.some(set=>set.children.some(n=>n.id===id))));
 for(const [index,set]of sets.entries())for(const master of set.children){const v=Object.fromEntries(JSON.parse(master.getPluginData('ads-variant'))),root=master.children[0];assert.equal(root.height,v.size);assert.equal(root.cornerRadius,result.families[index].appearance==='Underlined'?0:v.radius);}
 const preview=f.registry.get(result.previewNodeId);assert.equal(preview.mainComponent.name,'Appearance=Outlined');assert.equal(preview.exposedInstances.length,1);assert.equal(preview.exposedInstances[0].mainComponent.name,'State=Rest, Size=40, Corner radius=4');
 await adapter.configure(c.id,{appearance:'Filled',state:'Focused',size:56,radius:9999});assert.equal(preview.mainComponent.name,'Appearance=Filled');assert.equal(preview.exposedInstances[0].mainComponent.name,'State=Focused, Size=56, Corner radius=9999');
 const inspected=await adapter.inspect(c.id);assert.equal(inspected.variantNames.length,3);assert.equal(inspected.configurationCount,1152);assert.deepEqual(inspected.families.map(f=>f.variantCount),[384,384,384]);
 const pulled=await adapter.pull(c.id);assert.deepEqual(M.validate(pulled.contract),[]);assert.equal(pulled.contract.variants.length,1152);
 assert.deepEqual(pulled.contract.properties.find(p=>p.id==='size').options,[24,28,32,36,40,44,48,56]);assert.deepEqual(pulled.contract.properties.find(p=>p.id==='radius').options,[0,2,4,8,12,9999]);
 assert.ok(M.validate({...c,variants:Array.from({length:2049},(_,i)=>({...c.variants[0],id:'variant-'+i}))}).some(e=>e.includes('2048')));
});
test('Figma adapter creates variant masters, token bindings and text properties; updates preserve IDs',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Example');c.tokens={'--space-8':'8px','--color-brand':'#1357ab'};c.anatomy.styles.gap='var(--space-8)';c.anatomy.styles.backgroundColor='var(--color-brand)';c.revision=1;
 const first=await adapter.push(c),set=f.registry.get(first.nodeId),master=set.children[0],part=master.findAll(n=>n.getPluginData('ads-part')==='label')[0];
 assert.equal(set.type,'COMPONENT_SET');assert.equal(part.characters,'Label');assert.ok(part.componentPropertyReferences.characters);assert.equal(f.variables.length,2);
 const masterId=master.id,partId=part.id;c.revision=2;c.selection.label='Updated';const changed=await adapter.push(c);assert.equal(set.children[0].id,masterId);assert.equal(master.findAll(n=>n.getPluginData('ads-part')==='label')[0].id,partId);assert.equal(part.characters,'Label');assert.ok(Object.values(f.registry.get(changed.previewNodeId).componentProperties).includes('Updated'));
});
test('a component token that aliases a base token becomes a real variable alias, not a duplicated literal, and both share their category collection',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Aliased');
 c.tokens={'--red-500':'#FF031A','--button-primary-bg-default':'var(--red-500)'};c.anatomy.styles.backgroundColor='var(--button-primary-bg-default)';c.revision=1;
 await adapter.push(c);
 assert.equal(f.variables.length,2,'one variable per token - the alias is not flattened into a second copy of the literal');
 const primitive=f.variables.find(v=>v.name==='red/500'),semantic=f.variables.find(v=>v.name==='button/primary/bg/default');
 assert.ok(primitive,'the base token gets its own variable');assert.ok(semantic,'the component token gets its own variable');
 // Foundation audit - a token's name decides which of this system's 8
 // Foundation categories (Colors, Grid & Layout, Typography, Spacing,
 // Radius, Borders, Shadows, Icons) its variable lands in; a primitive and
 // a semantic alias to it share the same category collection now (both are
 // colors here) - the alias/primitive distinction still exists (bound via
 // a real VARIABLE_ALIAS below, not flattened), it just no longer splits
 // them into separate collections.
 assert.equal(primitive.variableCollectionId,semantic.variableCollectionId,'same-category tokens share one collection regardless of alias vs. primitive');
 assert.deepEqual(primitive.value,{r:1,g:3/255,b:26/255});
 assert.deepEqual(semantic.value,{type:'VARIABLE_ALIAS',id:primitive.id},'the component variable is bound to the base variable, not given its own copy of the color');
 const collections=await f.figma.variables.getLocalVariableCollectionsAsync();
 assert.ok(collections.some(col=>col.id===primitive.variableCollectionId&&/Colors/i.test(col.name)));
 // Re-pushing with a changed base value updates both the primitive's own
 // value and keeps the alias pointed at the same (now-updated) variable,
 // exactly as editing a base color in the design system should propagate.
 c.tokens['--red-500']='#00FF00';c.revision=2;await adapter.push(c);
 assert.deepEqual(primitive.value,{r:0,g:1,b:0});assert.deepEqual(semantic.value,{type:'VARIABLE_ALIAS',id:primitive.id});
});
test('Figma pull reads actual edited text and layout into a reviewable contract',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Readback');c.revision=1;const result=await adapter.push(c),set=f.registry.get(result.nodeId);const part=set.children[0].findAll(n=>n.getPluginData('ads-part')==='label')[0];part.characters='Edited in Figma';
 const pulled=await adapter.pull(c.id);assert.equal(pulled.contract.authority,'figma');assert.ok(pulled.contract.variants.some(v=>Object.values(v.overrides).some(o=>o.text==='Edited in Figma')));assert.deepEqual(M.validate(pulled.contract),[]);
});
test('Figma authority and newer revisions reject stale pushes',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Authority');c.revision=2;await adapter.push(c);c.revision=1;await assert.rejects(adapter.push(c),/newer revision/);c.authority='figma';await assert.rejects(adapter.push(c),/Contract must lead/);
});
test('an existing Figma master can be imported and updated without replacing its component ID',async()=>{
 const f=fixture(),master=f.figma.createComponent();master.name='Existing button';const label=f.figma.createText();label.characters='Existing';label.fontName={family:'Inter',style:'Regular'};label.fontSize=14;master.appendChild(label);f.figma.currentPage.selection=[master];const adapter=adapterFactory(f.figma,M);
 const pulled=await adapter.pull('existing-button');assert.equal(pulled.contract.id,'existing-button');assert.equal(pulled.contract.anatomy.children[0].text,'Existing');pulled.contract.authority='contract';pulled.contract.revision=1;const pushed=await adapter.push(pulled.contract);assert.equal(f.registry.get(pushed.nodeId).children[0].id,master.id);
});
test('pull includes added parts, removed parts and part ordering',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Structure');c.revision=1;const result=await adapter.push(c),master=f.registry.get(result.nodeId).children[0],root=master.children[0];const added=f.figma.createText();added.characters='New part';added.fontName={family:'Inter',style:'Regular'};added.fontSize=14;root.appendChild(added);root.children[0].remove();const pulled=await adapter.pull(c.id);assert.equal(pulled.contract.anatomy.children.length,1);assert.equal(pulled.contract.anatomy.children[0].text,'New part');assert.deepEqual(M.validate(pulled.contract),[]);
});
test('shared references become reusable Figma instances and slots bind to their properties',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Composition'),ref=M.blank('Nested');ref.id='nested';c.references={nested:ref};c.properties.push({id:'nested',name:'Nested',type:'swap',default:'nested'},{id:'content',name:'Content',type:'slot',default:'Slot text'});c.selection.nested='nested';c.selection.content='Slot text';c.anatomy.children=[{id:'nested-part',kind:'instance',bind:'nested',styles:{}},{id:'slot-part',kind:'slot',bind:'content',styles:{}}];
 const result=await adapter.push(c),set=f.registry.get(result.nodeId),nested=set.findAll(n=>n.type==='INSTANCE')[0],slot=set.findAll(n=>n.getPluginData('ads-part')==='slot-part')[0];assert.ok(nested.componentPropertyReferences.mainComponent);assert.ok(slot.componentPropertyReferences.slotContentId);assert.ok(slot.children.some(n=>n.characters==='Slot text'));
});
test('Boolean and swap properties bind the icon instance, never its inherited sublayers',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Nested Input icon'),ref=M.blank('Icon');ref.id='input-icon';ref.anatomy.id='icon';
 c.references={'input-icon':ref};c.properties.push({id:'showIcon',name:'Show icon',type:'boolean',default:false},{id:'iconSwap',name:'Icon',type:'swap',default:'input-icon'});
 c.anatomy.children=[{id:'icon',kind:'instance',bind:'iconSwap',styles:{},visibleWhen:[{property:'showIcon',equals:true}]}];
 const result=await adapter.push(c),set=f.registry.get(result.nodeId),icon=set.children[0].findAll(n=>n.type==='INSTANCE')[0];
 assert.equal(icon.getPluginData('ads-part'),'icon');assert.ok(icon.children.some(n=>n.getPluginData('ads-part')==='icon'));
 assert.ok(icon.componentPropertyReferences.visible);assert.ok(icon.componentPropertyReferences.mainComponent);
 assert.deepEqual(icon.children[0].componentPropertyReferences,{});await adapter.push(c);
 const inspected=await adapter.inspect(c.id);assert.equal(inspected.variantCount,1);assert.ok(inspected.bindings.some(b=>b.part==='icon'));
 const pulled=await adapter.pull(c.id);assert.deepEqual(M.validate(pulled.contract),[]);assert.equal(pulled.contract.anatomy.children[0].children.length,0);
});
test('a changed nested-reference root retires its previous root without stacking visible icons',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Reference migration'),ref=M.blank('Icon');ref.id='reference-migration';ref.anatomy.id='old-root';c.references={[ref.id]:ref};c.anatomy.children=[{id:'icon',kind:'instance',reference:ref.id,styles:{}}];
 await adapter.push(c);const master=f.figma.currentPage.findAll(n=>n.getPluginData('ads-reference')===ref.id)[0],old=master.children[0];
 ref.anatomy.id='new-root';await adapter.push(c);assert.equal(old.visible,false);assert.equal(old.getPluginData('ads-retired'),'true');assert.equal(master.children.filter(n=>n.visible).length,1);
});
test('upgrading State-only variants preserves old masters outside the new multi-axis set',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Input migration');
 c.properties.push({id:'state',name:'State',type:'options',options:['Rest','Hover'],default:'Rest'});
 c.variants=['Rest','Hover'].map(state=>({id:state,name:state,when:{state},overrides:{}}));
 const first=await adapter.push(c),set=f.registry.get(first.nodeId),old=[...set.children];
 c.properties.push({id:'appearance',name:'Appearance',type:'options',options:['Outlined','Filled'],default:'Outlined'});
 c.variants=['Outlined','Filled'].flatMap(appearance=>['Rest','Hover'].map(state=>({id:appearance+state,name:appearance+state,when:{appearance,state},overrides:{}})));
 const result=await adapter.push(c);assert.equal(result.nodeId,first.nodeId);assert.equal(set.children.length,4);
 for(const master of old){assert.equal(f.registry.get(master.id),master);assert.notEqual(master.parent,set);assert.equal(master.parent.getPluginData('ads-archive-of'),c.id);}
 assert.equal(f.registry.get(result.previewNodeId).mainComponent.parent,set);assert.ok(result.warnings.some(w=>w.includes('archive')));
 await adapter.push(c);assert.equal(set.children.length,4);
});
test('redraw removes unused interrupted-import duplicates while preserving custom properties',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Recovery');
 c.properties.push({id:'slot',name:'Supporting content',type:'slot',default:''});c.anatomy.children.push({id:'slot',kind:'slot',tag:'div',bind:'slot',styles:{}});
 const first=await adapter.push(c),set=f.registry.get(first.nodeId),map=JSON.parse(set.getPluginData('ads-property-map'));
 const duplicate=set.addComponentProperty('Label','TEXT','Old'),custom=set.addComponentProperty('Custom note','TEXT','Keep');
 const edit=set.editComponentProperty.bind(set);set.editComponentProperty=(key,patch)=>{if(key===map.slot&&Object.keys(patch).length===1)throw new Error('Invalid no-op Slot edit');return edit(key,patch);};
 const result=await adapter.push(c);assert.ok(!set.componentPropertyDefinitions[duplicate]);assert.ok(set.componentPropertyDefinitions[custom]);assert.ok(set.componentPropertyDefinitions[map.label]);assert.deepEqual(result.warnings,[]);
});
test('Figma property renames preserve contract property IDs, and removed properties are reflected',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('API');c.revision=1;const result=await adapter.push(c),set=f.registry.get(result.nodeId),text=set.findAll(n=>n.type==='TEXT')[0],oldKey=text.componentPropertyReferences.characters;
 set.deleteComponentProperty(oldKey);const newKey=set.addComponentProperty('Renamed label','TEXT','Renamed');text.componentPropertyReferences.characters=newKey;const renamed=await adapter.pull(c.id);assert.equal(renamed.contract.properties.find(p=>p.id==='label').name,'Renamed label');
 set.deleteComponentProperty(newKey);text.componentPropertyReferences={};const removed=await adapter.pull(c.id);assert.equal(removed.contract.properties.some(p=>p.id==='label'),false);assert.deepEqual(M.validate(removed.contract),[]);
});
test('Figma conversion preserves translucent fills and strokes',async()=>{
 // borderWidth must be explicit and nonzero here - a genuinely zero/unset
 // width is indistinguishable from "no border at all" (see the border-style
 // "none" fix above) and correctly produces no stroke, same as a real
 // browser renders nothing for either case.
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Alpha');c.anatomy.styles.backgroundColor='rgba(47,191,110,0.1)';c.anatomy.styles.borderColor='#1234';c.anatomy.styles.borderWidth='1px';const result=await adapter.push(c),part=f.registry.get(result.nodeId).children[0].children[0];assert.equal(part.fills[0].opacity,0.1);assert.ok(Math.abs(part.strokes[0].opacity-68/255)<0.00001);
});
test('input placeholders and values are actual text, rem typography is finite, mixed labels keep their children',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Input');
 c.properties=[{id:'label',name:'Label',type:'text',default:'Email'},{id:'value',name:'Value',type:'text',default:''},{id:'placeholder',name:'Placeholder',type:'text',default:'name@example.org'}];c.selection={label:'Email',value:'',placeholder:'name@example.org'};
 c.anatomy.children=[{id:'label-row',kind:'text',tag:'label',styles:{display:'flex'},children:[{id:'label',kind:'text',bind:'label',styles:{lineHeight:'1.5rem'}}]},
  {id:'input',kind:'container',tag:'input',bind:'value',attributeBindings:{placeholder:'placeholder'},styles:{fontSize:'1rem',lineHeight:'1.25rem','--ads-placeholder-color':'#777777',flexGrow:'1'}}];
 const first=await adapter.push(c),set=f.registry.get(first.nodeId),part=id=>set.findAll(n=>n.getPluginData('ads-part')===id)[0];
 assert.equal(part('label-row').type,'FRAME');assert.equal(part('label').characters,'Email');assert.equal(part('label').lineHeight.value,24);
 assert.equal(part('input').characters,'name@example.org');assert.equal(part('input').lineHeight.value,20);assert.ok(part('input').componentPropertyReferences.characters.startsWith('Placeholder#'));
 const inputId=part('input').id;c.properties.find(p=>p.id==='value').default='hello@example.org';c.selection.value='hello@example.org';await adapter.push(c);
 assert.equal(part('input').id,inputId);assert.equal(part('input').characters,'hello@example.org');assert.ok(part('input').componentPropertyReferences.characters.startsWith('Value#'));
});
test('individual strokes, corners, focus effects and SVG geometry survive conversion and redraw',async()=>{
 const f=fixture(),adapter=adapterFactory(f.figma,M),c=M.blank('Appearance');
 c.anatomy.styles={display:'flex',width:'220px',height:'3rem',borderTopWidth:'0px',borderRightWidth:'0px',borderBottomWidth:'2px',borderLeftWidth:'0px',borderBottomColor:'#ff0000',borderRadius:'0.75rem',borderTopLeftRadius:'0.25rem',outline:'rgb(0, 100, 255) solid 2px',outlineOffset:'2px'};
 c.anatomy.children=[{id:'icon',kind:'icon',tag:'svg',styles:{width:'16px',height:'16px',stroke:'var(--icon)'},attributes:{viewBox:'0 0 24 24'},children:[{id:'path',kind:'shape',tag:'path',styles:{stroke:'var(--icon)'},attributes:{d:'M1 1L9 9'}}]}];c.tokens={'--icon':'#123456'};
 const result=await adapter.push(c),set=f.registry.get(result.nodeId),root=set.children[0].children[0],svg=root.children[0];
 assert.equal(root.strokeTopWeight,0);assert.equal(root.strokeBottomWeight,2);assert.equal(root.cornerRadius,12);assert.equal(root.topLeftRadius,4);assert.equal(root.height,48);
 const ringOf=n=>n.children.find(child=>String(child.getPluginData('ads-part')).endsWith('-focus-ring')),ring=ringOf(root);
 assert.deepEqual(root.effects,[],'Outlines are drawn as a ring layer, not a shadow (a shadow cannot cast from an unfilled frame)');
 assert.ok(ring,'outline becomes a Focus ring child');assert.equal(ring.layoutPositioning,'ABSOLUTE');assert.equal(ring.strokeWeight,2);assert.equal(ring.x,-4);assert.equal(ring.y,-4);
 assert.equal(ring.width,228,'ring = host width + 2 x (outline width + offset)');assert.equal(ring.height,56);assert.match(svg.svg,/stroke="#123456"/);assert.equal(svg.layoutMode,'NONE');assert.equal(svg.children[0].fills[0].color.r,0.1);
 c.anatomy.styles.outline='none';await adapter.push(c);assert.deepEqual(root.effects,[]);assert.ok(!ringOf(root)||ringOf(root).visible===false,'Removed outline must not leave a visible ring after redraw');
});
