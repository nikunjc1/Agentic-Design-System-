/* Edits use visible browser controls and Save foundation only. Never seed
   Foundation records via localStorage or call the model to apply settings. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createBridge}=require('./component-bridge.cjs'),{visit}=require('./visit-project.cjs');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const OUT=path.resolve(__dirname,'../audit/foundation-ui-propagation-2026-11-06');
const normalized=tokens=>JSON.parse(JSON.stringify(tokens).replace(/#[0-9a-f]+/gi,m=>m.toLowerCase()));
const report={method:'Real Chrome controls → Save foundation → open component tab → reload both pages → rendered styles and saved tokens',groups:[],errors:[]};
const groups=[['Colors','foundations.html','button-primary.html',['colors','bg-colors','status-colors','neutral-colors']],['Grid & Layout','grid-layout.html','input-text-field.html',['grid-layout','sizing']],['Typography','typography.html','input-text-field.html',['typography']],['Spacing','spacing.html','input-text-field.html',['spacing','sizing']],['Radius','radius.html','input-text-field.html',['radius']],['Borders','borders.html','input-text-field.html',['border','border-states']],['Shadows','shadows.html','modal-default.html',['shadow']],['Icons','icons.html','select-dropdown.html',['icons','sizing']]];
(async()=>{let browser,server;try{
 server=createBridge();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 for(const [name,file,componentFile,keys]of groups){if(process.env.ADS_GROUPS&&!process.env.ADS_GROUPS.split(',').includes(name))continue;
  const row={name,file,component:componentFile,steps:[]};report.groups.push(row);
  const context=await browser.newContext({viewport:{width:1440,height:1100}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
  const page=await context.newPage(),component=await context.newPage();for(const p of [page,component]){p.setDefaultTimeout(10000);p.on('pageerror',e=>report.errors.push({page:p.url(),message:e.message}));p.on('dialog',d=>d.accept());}
  const role=r=>page.locator('[data-role="'+r+'"]');
  const fill=async(selector,value)=>{const n=typeof selector==='string'?page.locator(selector):selector;await n.fill(String(value));await n.blur();};
  const select=async(r,value)=>role(r).selectOption(String(value));
  const records=()=>page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem('ads:'+k)])),keys);
  const css=async(selector,property)=>component.locator('.wb-selected-cell '+selector).first().evaluate((n,p)=>getComputedStyle(n)[p],property);
  const eq=(actual,expected,label)=>actual===expected?[]:[`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`];
  async function step(label,edit,verify){const result={label,failures:[]};row.steps.push(result);try{
   if(await page.locator('[data-foundation-edit]').isVisible())await page.locator('[data-foundation-edit]').click();
   const before=await records();await edit();await page.waitForTimeout(80);assert.deepEqual(await records(),before,'Draft must not overwrite saved foundation before Save');
   const preview=await page.evaluate(()=>ADSFoundation.get().tokens);
   await page.locator('[data-foundation-save]').click();await page.locator('[data-foundation-edit]:visible').waitFor();result.saved=await records();
   await component.waitForTimeout(350);result.failures.push(...await verify(preview));
   await visit(component,origin+'/'+componentFile);await component.waitForFunction(()=>window.ADSWorkbench?.active&&ADSWorkbench.selectedElement());result.failures.push(...(await verify(preview)).map(s=>'After component reload: '+s));
   const componentTokens=await component.evaluate(()=>ADSFoundation.get().tokens);assert.deepEqual(normalized(componentTokens),normalized(preview),'Saved Foundation tokens reach the component');
   await visit(page,origin+'/'+file);await page.locator('[data-foundation-edit]:visible').waitFor();assert.deepEqual(await records(),result.saved,'Foundation settings survive reload');assert.deepEqual(normalized(await page.evaluate(()=>ADSFoundation.get().tokens)),normalized(preview),'Foundation preview matches after reload');
   result.status=result.failures.length?'fail':'pass';
  }catch(e){result.status='fail';result.failures.push(e.message);}
   console.log(name+' / '+label+': '+result.status+' '+result.failures.join('; '));fs.writeFileSync(path.join(OUT,process.env.ADS_REPORT_NAME||'results.json'),JSON.stringify(report,null,2));
  }
  try{
   await visit(page,origin+'/'+file);await page.locator('.ads-foundation-editor').waitFor();await visit(component,origin+'/'+componentFile);await component.waitForFunction(()=>window.ADSWorkbench?.active&&ADSWorkbench.selectedElement());
   row.controls=await page.locator('main input,main select').evaluateAll(nodes=>nodes.map(n=>({role:n.dataset.role||n.getAttribute('aria-label')||n.id,type:n.type,value:n.value,options:n.options?[...n.options].map(o=>o.value):undefined})).filter(n=>n.role));
   if(name==='Colors'){
    await step('Light brand hex',()=>fill(role('brand-light-hex'),'176941'),async()=>eq(await css('.btn-demo','backgroundColor'),'rgb(23, 105, 65)','Button brand'));
    await step('Surface, status and neutral colors',async()=>{await fill(role('bg-light-secondary-hex'),'E7F0EB');await fill(role('status-light-danger-hex'),'9A2245');await fill(role('neutral-light-border-hex'),'617269');},async tokens=>{const values=await component.evaluate(()=>{const t=ADSFoundation.get().tokens;return [t['--graphite-900'],t['--danger-500'],t['--control-border']];});return eq(JSON.stringify(values),JSON.stringify(['#E7F0EB','#9A2245','#617269']),'Component surface/status/neutral tokens');});
    await step('Custom dark brand',async()=>{await role('brand-dark-enable').check();await fill(role('brand-dark-hex'),'84CFA7');await page.locator('#themeToggle').click();},async()=>eq(await css('.btn-demo','backgroundColor'),'rgb(132, 207, 167)','Dark button brand'));
   }else if(name==='Grid & Layout'){
    for(const system of ['custom','rows','columns-rows','columns'])await step(system+' with 6 columns and 36px gutter',async()=>{await page.locator('.system-card[data-system="'+system+'"]').click();await fill(role('grid-columns-input'),6);await fill(page.getByRole('spinbutton',{name:'grid-gutter-input in selected units',exact:true}).first(),36);},async()=>{const c=await component.evaluate(()=>({columns:ADSFoundation.get().tokens['--grid-columns'],gutter:ADSFoundation.get().tokens['--grid-gutter'],system:ADSFoundation.get().gridSystem}));return eq(JSON.stringify(c),JSON.stringify({columns:'6',gutter:'36px',system}),'Component layout context');});
    await step('Baseline toggle',()=>role('baseline-enable').check(),async()=>eq(await component.evaluate(()=>ADSFoundation.read('grid-layout').baseline),true,'Baseline preference'));
   }else if(name==='Typography'){
    const body=page.locator('.type-row[data-level="body"]');
    await step('Body size, weight, line height and italic',async()=>{await body.locator('[data-role=size]').selectOption('text-lg');await body.locator('[data-role=weight]').selectOption('600');await fill(body.locator('[data-role=line-height-pct]'),'180');await body.locator('[data-role=italic]').check();},async()=>{const s=await component.locator('.wb-selected-cell .input-demo-control').first().evaluate(n=>{const c=getComputedStyle(n);return [c.fontSize,c.fontWeight,c.fontStyle,c.lineHeight];});return eq(JSON.stringify(s),JSON.stringify(['18px','600','italic','32.4px']),'Input body type');});
    await step('Body font family and tracking',async()=>{await page.locator('.font-panel[data-font=secondary] .font-option').filter({hasText:/^Manrope$/}).click();await fill(body.getByRole('spinbutton',{name:'Letter spacing in selected units',exact:true}),1.5);},async()=>{const family=await css('.input-demo-control','fontFamily');return [...(family.includes('Manrope')?[]:['Input does not use selected Manrope family: '+family]),...eq(await css('.input-demo-control','letterSpacing'),'1.5px','Input tracking')];});
    await step('Body text color',()=>fill(body.locator('[data-role=color-hex]'),'235A42'),async()=>eq(await css('.input-demo-label','color'),'rgb(35, 90, 66)','Input text role color'));
   }else if(name==='Spacing'){
    for(const system of ['2px','8px','adaptive','4px'])await step(system+' spacing',()=>page.locator('.system-card[data-system="'+system+'"]').click(),async tokens=>eq(await css('.input-demo-field','gap'),tokens['--space-6'],'Input field spacing'));
    await step('Shared control size 48px',async()=>{await page.locator('.ads-sizing summary').click();await fill(page.getByRole('spinbutton',{name:'control size in selected units',exact:true}),48);},async()=>eq(await css('.input-demo-control','height'),'48px','Input inherited control height'));
   }else if(name==='Radius'){
    for(const system of ['sharp','compact','soft','expressive','balanced'])await step(system+' radius',()=>page.locator('.system-card[data-system="'+system+'"]').click(),async tokens=>eq(await css('.input-demo-control','borderTopLeftRadius'),tokens['--radius-md'],'Input inherited corner radius'));
    await step('Compact radius on Button and pill Tabs',()=>page.locator('.system-card[data-system=compact]').click(),async()=>{const failures=[];for(const [file,selector]of [['button-primary.html','.wb-selected-cell .btn-demo'],['tabs-default.html','.tabs-demo-bar--pill .tabs-demo-trigger.is-active']]){await visit(component,origin+'/'+file);await component.waitForFunction(()=>ADSWorkbench?.active&&ADSWorkbench.selectedElement());failures.push(...eq(await component.locator(selector).first().evaluate(n=>getComputedStyle(n).borderTopLeftRadius),'6px',file+' compact radius'));}return failures;});
    await step('Explicit component radius survives foundation change',async()=>{await visit(component,origin+'/'+componentFile);await component.waitForFunction(()=>ADSWorkbench?.active&&ADSWorkbench.selectedElement());const menu=component.locator('[data-role=input-radius-mount]');await menu.locator('.multiselect-trigger').click();await menu.locator('input[value="6"]').uncheck();await menu.locator('input[value="12"]').check();await menu.locator('.multiselect-trigger').click();await component.locator('.wb-savebar').getByRole('button',{name:'Save',exact:true}).click();await page.locator('.system-card[data-system=expressive]').click();},async()=>eq(await css('.input-demo-control','borderTopLeftRadius'),'12px','Explicit 12px radius'));
    await step('Reset component restores foundation following',async()=>{await component.locator('.wb-savebar').getByRole('button',{name:'Reset',exact:true}).click();await page.locator('.system-card[data-system=balanced]').click();},async()=>eq(await css('.input-demo-control','borderTopLeftRadius'),'8px','Reset inherited radius'));
   }else if(name==='Borders'){
    await step('Width, style, opacity and color',async()=>{await select('border-width',3);await select('border-style','dashed');await fill(role('border-opacity'),70);await fill(role('border-color-hex'),'7250A0');},async()=>{const s=await component.locator('.wb-selected-cell .input-demo-control').evaluate(n=>{const c=getComputedStyle(n);return [c.borderTopWidth,c.borderTopStyle,c.borderTopColor];});return eq(JSON.stringify(s),JSON.stringify(['3px','dashed','rgba(114, 80, 160, 0.7)']),'Input border');});
    for(const side of ['bottom','start','all'])await step(side+' border sides',()=>select('border-sides',side),async()=>{const s=await component.locator('.wb-selected-cell .input-demo-control').evaluate(n=>{const c=getComputedStyle(n);return [c.borderTopWidth,c.borderRightWidth,c.borderBottomWidth,c.borderLeftWidth];});const v={bottom:['0px','0px','3px','0px'],start:['0px','0px','0px','3px'],all:['3px','3px','3px','3px']}[side];return eq(JSON.stringify(s),JSON.stringify(v),'Input border sides');});
    for(const [state,file,selector,property]of [
     ['default',componentFile,'.wb-selected-cell .input-demo-control','borderTopColor'],
     ['hover',componentFile,'.input-demo-control--outlined.is-hover','borderTopColor'],
     ['focus',componentFile,'.input-demo-control--outlined.is-focus','borderTopColor'],
     ['disabled',componentFile,'.input-demo-control--outlined.is-disabled','borderTopColor'],
     ['error',componentFile,'.input-demo-control--outlined.is-error','borderTopColor'],
     ['success',componentFile,'.input-demo-control--outlined.is-success','borderTopColor'],
     ['warning','alert-default.html','.alert-demo-banner--warning','borderInlineStartColor'],
     ['info','alert-default.html','.alert-demo-banner--info','borderInlineStartColor'],
     ['selected','card-default.html','.card-demo-panel.is-selected','borderTopColor'],
     ['active','tabs-default.html','.tabs-demo-bar--underline .tabs-demo-trigger.is-active','borderBottomColor']
    ])await step(state+' state color',()=>fill(page.locator('[data-state='+state+'] [data-role=state-hex]'),'8A2452'),async()=>{if(!component.url().endsWith('/'+file)){await visit(component,origin+'/'+file);await component.waitForFunction(()=>ADSWorkbench?.active&&ADSWorkbench.selectedElement());}return eq(await component.locator(selector).first().evaluate((n,p)=>getComputedStyle(n)[p],property),'rgb(138, 36, 82)',state+' component border');});
   }else if(name==='Shadows'){
    for(const system of ['flat','subtle','soft','expressive','balanced'])await step(system+' shadow',()=>page.locator('.system-card[data-system="'+system+'"]').click(),async tokens=>{const actual=await css('.modal-demo-dialog','boxShadow');const expected=await component.evaluate(token=>{const n=document.createElement('div');n.style.boxShadow=token;document.body.append(n);const v=getComputedStyle(n).boxShadow;n.remove();return v;},tokens['--shadow-xl']);return eq(actual,expected,'Modal elevation');});
   }else if(name==='Icons'){
    await step('Line glyph size, stroke and sharp corners',async()=>{await page.locator('.system-card[data-system=line]').click();await select('icon-size',32);await select('icon-stroke','2.2');await select('icon-corner','sharp');},async()=>{const s=await component.locator('.wb-selected-cell svg[stroke="currentColor"]').first().evaluate(n=>{const c=getComputedStyle(n);return [c.strokeWidth,c.strokeLinecap,c.strokeLinejoin];});return eq(JSON.stringify(s),JSON.stringify(['2.2px','square','miter']),'Select icon stroke');});
    await step('Dashed icon style',()=>page.locator('.system-card[data-system=dashed]').click(),async()=>eq(await css('svg[stroke="currentColor"]','strokeDasharray'),'3px, 2.6px','Select dashed icon'));
    await step('Rounded line icons',async()=>{await page.locator('.system-card[data-system=line]').click();await select('icon-size',20);await select('icon-stroke','1.5');await select('icon-corner','round');},async()=>{const s=await component.locator('.wb-selected-cell svg[stroke="currentColor"]').first().evaluate(n=>{const c=getComputedStyle(n);return [c.strokeWidth,c.strokeLinecap,c.strokeLinejoin,c.strokeDasharray];});return eq(JSON.stringify(s),JSON.stringify(['1.5px','round','round','none']),'Select line icon');});
   }
   await page.screenshot({path:path.join(OUT,file.replace('.html','')+'-saved.png')});await component.locator('.wb-selected-cell').screenshot({path:path.join(OUT,file.replace('.html','')+'-component.png')});
  }catch(e){row.error=e.stack;console.error(name,e.message);}finally{await context.close();}
 }
 report.status=report.errors.length||report.groups.some(g=>g.error||g.steps.some(s=>s.status!=='pass'))?'fail':'pass';console.log('UI PROPAGATION: '+report.status);if(report.status==='fail')process.exitCode=1;
 }catch(e){report.error=e.stack;process.exitCode=1;console.error(e);}finally{fs.writeFileSync(path.join(OUT,process.env.ADS_REPORT_NAME||'results.json'),JSON.stringify(report,null,2));await browser?.close();if(server)await new Promise(r=>server.close(r));}})();
