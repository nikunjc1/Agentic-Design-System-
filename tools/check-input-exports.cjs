const {visit}=require('./visit-project.cjs');
// Exercise the real Input controls, every export button, standalone HTML and plugin adapter.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const {createBridge}=require('./component-bridge.cjs'),M=require('../component-contract-model.js');
const adapterFactory=require('../figma-plugin/adapter.js'),fixture=require('../tests/figma-fixture.cjs');
const runtimeFactory=require('../figma-plugin/bridge-runtime.js');
const out=path.resolve(process.env.ADS_INPUT_AUDIT_DIR||path.join(__dirname,'../audit/input-export-2026-10-30'));fs.mkdirSync(out,{recursive:true});
(async()=>{
 const server=createBridge();let browser,bridgeRuntime;
 try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
  const page=await context.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await visit(page,origin+'/input-text-field.html');await page.waitForFunction(()=>window.ADSWorkbench?.active);
  const role=name=>page.locator('[data-role="'+name+'"]');
  await role('input-label').fill('Billing email');await role('input-placeholder').fill('billing@example.org');
  await role('input-required').check();await role('input-type-select').selectOption('email');await role('input-max-length').fill('32');
  await role('input-show-supporting').check();await role('input-supporting-text').fill('For billing receipts only.');await role('input-error-text').fill('Check the billing address.');
  await role('input-allow-clear').check();
  // Change the real multiselect checkbox and dispatch its native event.
  await page.evaluate(()=>{for(const [role,value]of [['input-size-mount','48'],['input-radius-mount','12'],['input-icon-placement-mount','both']]){
   const inputs=[...document.querySelectorAll('[data-role="'+role+'"] .multiselect-options input')];
   for(const input of inputs){const next=input.value===value;if(input.checked!==next){input.checked=next;input.dispatchEvent(new Event('change',{bubbles:true}));}}
  }});
  await page.getByRole('combobox',{name:'Appearance',exact:true}).selectOption('Underlined');
  await page.getByRole('combobox',{name:'State',exact:true}).selectOption('Error');
  await page.waitForTimeout(120);
  const c=await page.evaluate(()=>ADSContracts.capture());assert.deepEqual(M.validate(c),[]);
  fs.writeFileSync(path.join(out,'input-contract.json'),JSON.stringify(c,null,2));
  assert.equal(c.selection.label,'Billing email');assert.equal(c.selection.radius,12);assert.equal(c.selection.size,48);
  assert.equal(c.variants.length,1152);assert.equal(c.selection.required,true);assert.equal(c.selection.showLeadingIcon,true);assert.equal(c.selection.showTrailingIcon,true);
  assert.deepEqual(c.properties.find(p=>p.id==='size').options,[24,28,32,36,40,44,48,56]);
  assert.deepEqual(c.properties.find(p=>p.id==='radius').options,[0,2,4,8,12,9999]);
  assert.equal(new Set(c.variants.map(v=>JSON.stringify(v.when))).size,1152,'Every size/radius combination has one unique variant');
  const flat=tree=>[tree,...(tree.children||[]).flatMap(flat)],tree=M.compile(c).tree,nodes=flat(tree),input=nodes.find(n=>n.id==='input');
  assert.equal(input.attributes.required,'');assert.equal(input.attributes.maxlength,'32');assert.equal(input.attributes.type,'email');assert.equal(input.attributes['aria-invalid'],'true');
  assert.equal(nodes.find(n=>n.id==='label-row').attributes.for,input.attributes.id);
  assert.ok(nodes.find(n=>n.id==='error'));assert.ok(!nodes.find(n=>n.id==='supporting-slot'));
  assert.ok(nodes.find(n=>n.id==='clear'));assert.ok(!nodes.find(n=>n.id==='trailing-icon'));
  for(const state of ['Disabled','Read-Only']){const ns=flat(M.compile(c,{state}).tree),n=ns.find(n=>n.id==='input');assert.ok(state==='Disabled'?'disabled'in n.attributes:'readonly'in n.attributes);assert.ok(!ns.find(n=>n.id==='clear'));}
  checks.push('1152 unique appearance/state/size/radius variants; all 8 sizes and 6 radii; selected preview; conditional anatomy and validation semantics');
  // All five UI actions must use the same fresh capture.
  await page.evaluate(()=>{window.__copies=[];ADSClipboard.copyWithFeedback=async(text)=>{window.__copies.push(text);return true;};});
  await page.getByRole('button',{name:'Copy prompt',exact:true}).click();
  await page.getByRole('button',{name:'Copy preview code',exact:true}).click();
  const copies=await page.evaluate(()=>window.__copies);assert.equal(copies.length,2);
  const promptContract=JSON.parse(copies[0].split('```json\n')[1].split('\n```')[0]);assert.deepEqual(promptContract,c);
  const htmlContract=JSON.parse(copies[1].match(/id="ads-component-contract">([\s\S]*?)<\/script>/)[1]);assert.deepEqual(htmlContract,c);
  for(const kind of ['JSON','HTML']){const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Download '+kind,exact:true}).click();const download=await pending;const file=path.join(out,download.suggestedFilename());await download.saveAs(file);const contents=fs.readFileSync(file,'utf8');if(kind==='JSON')assert.deepEqual(JSON.parse(contents),c);else assert.equal(contents,copies[1]);}
  const f=fixture(),adapter=adapterFactory(f.figma,M);let pushed,drawResult;
  await new Promise(resolve=>{bridgeRuntime=runtimeFactory({endpoint:origin,fetch,build:'browser-regression',notify:event=>{if(event.type==='connection'&&event.connected)resolve();},execute:async job=>{pushed=job.contract;drawResult=await adapter.push(pushed);return drawResult;}});bridgeRuntime.start();});
  await page.evaluate(port=>{ADSFigmaBridge.port=port;},server.address().port);
  const draw=page.locator('[data-role="draw-figma-action"] button');await draw.click();await page.waitForFunction(()=>document.getElementById('ads-figma-status')?.textContent==='Sent to Figma.');assert.deepEqual(pushed,c);
  const set=f.registry.get(drawResult.nodeId),familySets=new Map(drawResult.families.map(family=>[family.appearance,f.registry.get(family.nodeId)]));assert.equal(set.children.length,3);assert.equal(drawResult.configurationCount,1152);assert.ok([...familySets.values()].every(set=>set.children.length===384));
  const selectedMaster=(appearance,state,size=48,radius=12)=>familySets.get(appearance).children.find(n=>{const values=Object.fromEntries(JSON.parse(n.getPluginData('ads-variant')));return values.state===state&&values.size===size&&values.radius===radius;});
  for(const variant of c.variants){const master=selectedMaster(variant.when.appearance,variant.when.state,variant.when.size,variant.when.radius),control=master.findAll(n=>n.getPluginData('ads-part')==='control')[0];assert.equal(control.height,variant.when.size);assert.equal(control.cornerRadius,variant.when.appearance==='Underlined'?0:variant.when.radius);}
  const master=selectedMaster('Underlined','Error');
  const part=id=>master.findAll(n=>n.getPluginData('ads-part')===id)[0];
  assert.equal(part('label').characters,'Billing email');assert.equal(part('input-value').characters,'not-an-email');
  assert.equal(part('control').strokeTopWeight,0);assert.ok(part('control').strokeBottomWeight>0);assert.equal(part('control').height,48);
  assert.equal(part('required-mark').visible,true);assert.equal(part('leading-icon').type,'INSTANCE');assert.ok(part('leading-icon').componentPropertyReferences.mainComponent);
  assert.ok(part('supporting-slot').componentPropertyReferences.slotContentId);assert.ok(part('error').componentPropertyReferences.characters);
  assert.ok(part('input-value').componentPropertyReferences.characters);assert.ok(part('input-placeholder').componentPropertyReferences.visible);
  const familySet=familySets.get('Underlined'),propertyMap=JSON.parse(familySet.getPluginData('ads-property-map')),used=new Set(familySet.findAll(()=>true).flatMap(n=>Object.values(n.componentPropertyReferences||{})));
  assert.ok(c.properties.filter(p=>['text','boolean','swap','slot'].includes(p.type)).every(p=>used.has(propertyMap[p.id])),'Every editable Input property must drive a layer');
  checks.push('All five exports carry identical contracts; 3 appearance families of 384 masters expose all sizes/radii; each master has correct size and radius, including square Underlined fields and Pill corners');
  // Load the actual downloaded standalone document and compare its geometry.
  const preview=await context.newPage();await preview.setContent(copies[1]);await preview.waitForSelector('[data-ads-part="input"]');
  const measure=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {width:r.width,height:r.height,color:s.color,padding:s.padding,border:s.borderBottomWidth,radius:s.borderRadius,fontSize:s.fontSize};};
  const original=await page.locator('.wb-selected-cell .input-demo-control').evaluate(measure),exported=await preview.locator('[data-ads-part="control"]').evaluate(measure);
  assert.deepEqual(exported,original);
  assert.equal(await preview.locator('input').getAttribute('maxlength'),'32');assert.equal(await preview.locator('input').getAttribute('required'),'');
  await preview.getByRole('button',{name:'Clear',exact:true}).click();assert.equal(await preview.locator('input').inputValue(),'');
  assert.equal(await preview.locator('[data-ads-part="trailing-icon"]').count(),1,'The configured trailing icon returns after clearing');
  await preview.locator('input').fill('team@example.org');assert.equal(await preview.locator('input').inputValue(),'team@example.org');
  checks.push('Downloaded HTML matches control geometry and appearance; required/maxlength semantics, editable value and Clear work');
  await page.screenshot({path:path.join(out,'input-customized.png')});await preview.screenshot({path:path.join(out,'input-export.png')});
  // Same-task export before the 80 ms render debounce must see the latest edit.
  const fresh=await page.evaluate(()=>{const el=document.querySelector('[data-role="input-label"]');el.value='Latest label';el.dispatchEvent(new Event('input',{bubbles:true}));return ADSContracts.capture().selection.label;});assert.equal(fresh,'Latest label');
  await role('input-max-length').fill('0');const zero=await page.evaluate(()=>ADSContracts.capture());assert.equal(flat(M.compile(zero).tree).find(n=>n.id==='input').attributes.maxlength,'0');
  checks.push('Immediate exports flush pending edits; maximum length zero is retained');
  // Empty, read-only, disabled, rounded, dark and rem paths catch conversion losses.
  await page.getByRole('combobox',{name:'Appearance',exact:true}).selectOption('Outlined');
  await page.getByRole('combobox',{name:'State',exact:true}).selectOption('Rest');
  await page.getByRole('button',{name:'rem',exact:true}).click();await page.waitForTimeout(120);
  const rem=await page.evaluate(()=>ADSContracts.capture());assert.equal(rem.context.unit,'rem');
  const beforeIds=set.children.map(n=>n.id);await adapter.push(rem);assert.deepEqual(set.children.map(n=>n.id),beforeIds,'Redraw keeps masters linked');
  const rest=selectedMaster('Outlined','Rest');
  assert.equal(f.figma.currentPage.findAll(n=>n.getPluginData('ads-preview')===rem.id)[0].exposedInstances[0].mainComponent,rest);
  const findPart=id=>rest.findAll(n=>n.getPluginData('ads-part')===id)[0];
  assert.equal(findPart('input-placeholder').characters,'billing@example.org');assert.ok(findPart('input-placeholder').componentPropertyReferences.characters.startsWith('Placeholder#'));assert.ok(findPart('input-value').componentPropertyReferences.characters.startsWith('Value#'));
  assert.equal(findPart('control').cornerRadius,12);assert.equal(findPart('control').height,48);
  assert.equal(findPart('label').lineHeight.value,24);assert.equal(findPart('supporting-slot').visible,true);assert.equal(findPart('clear').visible,false);
  assert.equal(findPart('required-mark').characters,' *');
  await page.locator('.wb-savebar').getByRole('button',{name:'Save',exact:true}).click();await visit(page,page.url());await page.waitForFunction(()=>window.ADSWorkbench?.active);
  const restored=await page.evaluate(()=>ADSContracts.capture());assert.deepEqual(restored.selection,rem.selection);
  checks.push('rem conversion preserves radius/height/line-height, empty fields bind Placeholder, redraw preserves masters, save/reload retains settings');
  for(const state of ['Focused','Read-Only','Disabled']){await page.getByRole('combobox',{name:'State',exact:true}).selectOption(state);const c=await page.evaluate(()=>ADSContracts.capture());const result=await adapter.push(c);assert.ok(result.nodeId);}
  await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.dir='rtl';});await page.waitForTimeout(100);
  const dark=await page.evaluate(()=>ADSContracts.capture());assert.equal(dark.context.direction,'rtl');await adapter.push(dark);
  checks.push('Focused, read-only, disabled and dark RTL exports compile and reach the adapter');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors,liveFigmaVerified:false},null,2));console.log(JSON.stringify({checks,errors},null,2));
 }finally{await browser?.close();bridgeRuntime?.stop();server.closeAllConnections();await new Promise(r=>server.close(r));await bridgeRuntime?.task;}
})().catch(e=>{console.error(e);process.exitCode=1;});
