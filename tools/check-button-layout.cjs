const {visit}=require('./visit-project.cjs');
// Button-detail geometry and editing checks, with before/after screenshots.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const root=path.resolve(__dirname,'..'),out=path.join(root,'audit/button-layout-2026-10-28'),before=process.argv.includes('--before');
const files=['button-primary.html','button-secondary.html','button-tertiary.html','button-neutral.html','button-destructive.html','button-ghost.html','button-link.html','button-primary-icon.html'];
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(file,(e,data)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
(async()=>{let browser;const results={pages:[],tasks:[],errors:[]};try{
 fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
 const page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));page.on('dialog',d=>d.accept());
 for(const file of files){await page.setViewportSize({width:1440,height:1000});await visit(page,origin+'/'+file);await page.waitForTimeout(220);
  const row={file,widths:[]};
  for(const width of [1920,1440,1280,1024,768,390,320]){
   await page.setViewportSize({width,height:1000});await page.waitForTimeout(60);
   const geometry=await page.evaluate(()=>{
    const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
    const toolbar=document.querySelector('.wb-toolbar'),inspector=document.querySelector('.wb-inspector'),stage=document.querySelector('.wb-stage'),matrix=document.querySelector('.wb-selected-cell'),selected=ADSWorkbench.selectedElement();
    const controls=[...toolbar.querySelectorAll('select,button')].filter(n=>n.getClientRects().length).map(n=>({label:n.getAttribute('aria-label')||n.textContent,...rect(n)}));
    return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth||document.querySelector('main').scrollWidth>document.querySelector('main').clientWidth+2,toolbar:rect(toolbar),controls,inspector:rect(inspector),inspectorOverflow:inspector.scrollWidth>inspector.clientWidth+1,stage:rect(stage),cell:rect(matrix),button:rect(selected),exports:[...document.querySelector('.wb-exports').children].map(n=>rect(n))};
   });row.widths.push(geometry);
   if(!before){assert.equal(geometry.overflow,false,file+' '+width+'px page overflow');assert.equal(geometry.inspectorOverflow,false,file+' '+width+'px inspector overflow');assert.ok(Math.abs((geometry.cell.x+geometry.cell.w/2)-(geometry.button.x+geometry.button.w/2))<2,file+' centered button');
    const pairs=geometry.controls.filter(c=>c.label==='Button style'||c.label==='Appearance'||c.label==='State');if(width>=1024)assert.ok(Math.max(...pairs.map(c=>c.bottom))-Math.min(...pairs.map(c=>c.bottom))<2,file+' selector baselines');
   }
   if(file==='button-primary.html'&&[1440,1024,390].includes(width)){await page.evaluate(()=>{document.querySelector('main').scrollTop=0;document.querySelector('.wb-inspector').scrollTop=0;});await page.screenshot({path:path.join(out,(before?'before-':'after-')+width+'.png')});}
  }
  results.pages.push(row);
 }
 if(!before){
  await page.setViewportSize({width:1440,height:1000});await visit(page,origin+'/button-primary.html');await page.waitForTimeout(220);
  await page.getByRole('button',{name:'Atomic styles',exact:true}).click();await page.locator('[data-wb-style="padding-left"]').fill('20');assert.equal(await page.evaluate(()=>getComputedStyle(ADSWorkbench.selectedElement()).paddingLeft),'20px');
  await page.getByRole('button',{name:'rem',exact:true}).click();assert.equal(await page.locator('[data-wb-style="padding-left"]').inputValue(),'1.25rem');
  await page.locator('[data-wb-style="padding-left"]').fill('1.5');assert.equal(await page.evaluate(()=>getComputedStyle(ADSWorkbench.selectedElement()).paddingLeft),'24px');
  await page.getByRole('button',{name:'Save changes',exact:true}).click();await visit(page,page.url());await page.waitForTimeout(240);assert.equal(await page.evaluate(()=>getComputedStyle(ADSWorkbench.selectedElement()).paddingLeft),'24px');results.tasks.push('px/rem display, editing and save/reload');
  await page.getByRole('button',{name:'Atomic styles',exact:true}).click();await page.getByRole('combobox',{name:'Component part',exact:true}).selectOption('root-0');await page.locator('.wb-part-fields textarea').fill('Publish changes');
  assert.match(await page.evaluate(()=>ADSContracts.code(ADSContracts.capture())),/Publish changes/);results.tasks.push('Part text reaches preview and exported code');
  await page.locator('.wb-inspector').screenshot({path:path.join(out,'after-atomic-inspector.png')});
  await page.getByRole('button',{name:'Properties',exact:true}).click();const label=page.locator('[data-role="button-label"]');await label.fill('Publish');await page.waitForTimeout(180);
  await page.getByRole('button',{name:'Save changes',exact:true}).click();await page.getByRole('button',{name:'Compare states',exact:true}).click();assert.equal(await page.locator('.wb-stage').evaluate(n=>n.classList.contains('wb-showcase')),false);await page.screenshot({path:path.join(out,'after-compare.png')});
  await page.getByRole('button',{name:'Showcase',exact:true}).click();
  assert.equal(await page.locator('.wb-stage').evaluate(n=>n.classList.contains('wb-showcase')),true);results.tasks.push('Native properties and comparison modes remain usable');
  await visit(page,origin+'/button-primary.html');await page.waitForTimeout(200);
  await page.evaluate(()=>{for(const input of document.querySelectorAll('[data-role="content-mount"] input[type=checkbox]')){input.checked=input.value==='icon-only';input.dispatchEvent(new Event('change',{bubbles:true}));}});await page.waitForTimeout(180);
  await page.locator('[data-role="accessible-label"]').fill('Open settings');await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>ADSWorkbench.selectedElement().getAttribute('aria-label')),'Open settings');
  await page.getByRole('button',{name:'Atomic styles',exact:true}).click();const iconOption=await page.getByRole('combobox',{name:'Component part',exact:true}).locator('option').filter({hasText:/Icon$/}).first().getAttribute('value');await page.getByRole('combobox',{name:'Component part',exact:true}).selectOption(iconOption);assert.equal(await page.locator('[data-wb-style="fill"]').count(),1);results.tasks.push('Icon-only accessible label and icon part controls');
  await visit(page,origin+'/button-primary-icon.html');await page.waitForTimeout(180);await page.screenshot({path:path.join(out,'after-dual-icon.png')});assert.equal(await page.locator('[data-role="splitcta-leading-icon"]').isVisible(),true);results.tasks.push('Dual-icon controls remain available');
 }
 assert.deepEqual(results.errors,[]);console.log(JSON.stringify({phase:before?'before':'after',pages:results.pages.length,widthChecks:results.pages.reduce((n,p)=>n+p.widths.length,0),tasks:results.tasks,errors:results.errors}));
}finally{fs.writeFileSync(path.join(out,before?'before.json':'after.json'),JSON.stringify(results,null,2));await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
