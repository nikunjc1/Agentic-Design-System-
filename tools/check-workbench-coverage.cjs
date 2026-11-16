const {visit}=require('./visit-project.cjs');
// Inspect rendered states and real editing regressions, beyond page-load smoke tests.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const root=path.resolve(__dirname,'..'),out=path.join(root,'audit/workbench-recheck');
const pages=JSON.parse(fs.readFileSync(path.join(root,'audit/component-customization-2026-10-27/inventory.json'))).pages;
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
(async()=>{let browser;const results={pages:[],tasks:[],errors:[]};try{
 fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
 const page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));page.on('dialog',d=>d.accept());
 const load=async file=>{await visit(page,origin+'/'+file);await page.waitForTimeout(220);};
 for(const info of pages){
  await page.setViewportSize({width:1440,height:1000});await load(info.file);
  const row={file:info.file,states:[],widths:[]};
  row.states=await page.evaluate(()=>{
   const a=document.querySelector('select[aria-label=Appearance]'),s=document.querySelector('select[aria-label=State]'),results=[];
   for(const type of [...a.options].map(o=>o.value)){
    a.value=type;a.dispatchEvent(new Event('change',{bubbles:true}));
    for(const state of [...s.options].map(o=>o.value)){
     s.value=state;s.dispatchEvent(new Event('change',{bubbles:true}));const root=ADSWorkbench.selectedElement(),cell=root.closest('td'),r=root.getBoundingClientRect(),c=cell.getBoundingClientRect();
     let contractErrors,exportErrors=[];try{
       const contract=ADSContracts.capture(),compiled=ADSComponentContract.compile(contract).tree;contractErrors=ADSComponentContract.validate(contract);
       const text=n=>(n.text||'')+(n.children||[]).map(text).join('');
       const decoration=(n,pseudo)=>{const style=getComputedStyle(n,'::'+pseudo);if(style.display==='none'||!/^"[\s\S]*"$/.test(style.content))return '';try{return JSON.parse(style.content);}catch{return style.content.slice(1,-1);}};
       const nativeText=n=>decoration(n,'before')+[...n.childNodes].map(child=>child.nodeType===3?child.textContent:child.nodeType===1&&getComputedStyle(child).display!=='none'&&!['script','style'].includes(child.localName)?nativeText(child):'').join('')+decoration(n,'after');
       if(text(compiled).replace(/\s/g,'')!==nativeText(root).replace(/\s/g,''))exportErrors.push('Text order or content changed during export');
       const captured=new Map();(function walk(n){captured.set(n.id,n);for(const child of n.children||[])walk(child);})(compiled);
       (function check(n,path='root'){
        if(getComputedStyle(n).display==='none')return;
        if(getComputedStyle(n).display.includes('grid'))for(const prop of ['grid-template-columns','grid-template-rows','row-gap','column-gap'])if(!(prop in (captured.get(path)?.styles||{})))exportErrors.push(path+' missing '+prop);
        [...n.children].forEach((child,index)=>check(child,path+'-'+index));
       })(root);
     }catch(e){contractErrors=[e.message];}
     results.push({type,state,visible:!!r.width&&!!r.height,clippedStart:r.left<c.left-2,clippedEnd:r.right>c.right+2,contractErrors,exportErrors});
    }
   }return results;
  });
  await load(info.file);
  for(const width of [1440,1024,768,390,320]){
   await page.setViewportSize({width,height:900});await page.waitForTimeout(50);
   row.widths.push(await page.evaluate(()=>{const root=ADSWorkbench.selectedElement(),cell=root.closest('td'),r=root.getBoundingClientRect(),c=cell.getBoundingClientRect(),inspector=document.querySelector('.wb-inspector'),box=inspector.getBoundingClientRect();return {width:innerWidth,clippedStart:r.left<c.left-2,clippedEnd:r.right>c.right+2,rootWidth:r.width,cellWidth:c.width,inspectorOverflow:inspector.scrollWidth>inspector.clientWidth+2,inspectorWidth:box.width,visible:!!r.width&&!!r.height};}));
  }
  await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>{document.querySelector('main').scrollTop=0;});await page.waitForTimeout(100);
  await page.screenshot({path:path.join(out,info.file.replace('.html','.png'))});results.pages.push(row);
  if(results.pages.length%15===0)console.log('Inspected '+results.pages.length+'/69 detail pages and their states');
 }
 await page.setViewportSize({width:1440,height:1000});await load('button-primary.html');
 async function task(name,fn){try{await fn();results.tasks.push({name,status:'pass'});}catch(error){results.tasks.push({name,status:'fail',error:error.message});}}
 await task('Blank atomic text remains editable',async()=>{
  await page.getByRole('combobox',{name:'Component part',exact:true}).selectOption('root-0');await page.locator('.wb-part-fields textarea').fill('');
  await page.getByRole('combobox',{name:'Component part',exact:true}).selectOption('root');await page.getByRole('combobox',{name:'Component part',exact:true}).selectOption('root-0');assert.equal(await page.locator('.wb-part-fields textarea').count(),1);
 });
 await load('button-primary.html');
 await task('Wrong-type token is rejected',async()=>{const field=page.locator('[data-wb-style="padding-top"]');await field.fill('var(--color-brand)');assert.equal(await field.getAttribute('aria-invalid'),'true');});
 await load('button-primary.html');
 await task('Reset restores the initial appearance and state',async()=>{await page.getByRole('combobox',{name:'State',exact:true}).selectOption({label:'Hover'});await page.getByRole('combobox',{name:'Appearance',exact:true}).selectOption({label:'Secondary'});await page.locator('.wb-savebar').getByRole('button',{name:'Reset',exact:true}).click();await page.waitForTimeout(180);assert.equal(await page.getByRole('combobox',{name:'State',exact:true}).inputValue(),'Rest');assert.equal(await page.getByRole('combobox',{name:'Appearance',exact:true}).inputValue(),'Primary');});
 await load('button-primary.html');
 await task('Selected multi-configuration survives Save and reload',async()=>{
  await page.evaluate(()=>{for(const input of document.querySelectorAll('[data-role="size-mount"] input[type=checkbox]')){input.checked=['24','56'].includes(input.value);input.dispatchEvent(new Event('change',{bubbles:true}));}});await page.waitForTimeout(220);
  const select=page.getByRole('combobox',{name:'Configuration',exact:true});const value=await select.locator('option').last().getAttribute('value');await select.selectOption(value);await page.getByRole('button',{name:'Save changes',exact:true}).click();await visit(page,page.url());await page.waitForTimeout(250);assert.equal(await select.inputValue(),value);
 });
 await load('calendar-default.html');
 await task('Calendar month, leap day, accessible dates and week start agree',async()=>{
  await page.locator('[data-role="calendar-month-label"]').fill('February 2028');await page.waitForTimeout(200);
  const read=()=>page.evaluate(()=>[...ADSWorkbench.selectedElement().querySelectorAll('.calendar-demo-day')].map(n=>({label:n.getAttribute('aria-label'),outside:n.classList.contains('is-outside-month')})));
  let days=await read();assert.equal(days.length,42);assert.equal(days.filter(d=>!d.outside).length,29);assert.equal(days[0].label,'Sunday, January 30, 2028');assert.ok(days.some(d=>d.label==='Tuesday, February 29, 2028'));
  await page.locator('[data-role="calendar-first-day-select"]').selectOption('monday');await page.waitForTimeout(120);days=await read();assert.equal(days[0].label,'Monday, January 31, 2028');
  await page.getByRole('button',{name:'Save changes',exact:true}).click();await visit(page,page.url());await page.waitForTimeout(220);assert.equal((await read())[0].label,'Monday, January 31, 2028');
  await page.locator('[data-role="calendar-month-label"]').fill('Budget plan');await page.waitForTimeout(180);assert.equal(await page.locator('[data-role="calendar-month-label"]').getAttribute('aria-invalid'),'true');assert.match(await page.locator('#calendar-month-error').textContent(),/month name/);
  await page.locator('[data-role="calendar-month-label"]').fill('February 1900');await page.waitForTimeout(180);assert.equal((await read()).filter(d=>!d.outside).length,28);
  await page.locator('[data-role="calendar-month-label"]').fill('December 1999');await page.waitForTimeout(180);assert.ok((await read()).some(d=>/January .*2000$/.test(d.label)));
 });
 await task('Calendar event decorations and grid layout survive export',async()=>{
  await page.getByRole('combobox',{name:'State',exact:true}).selectOption({label:'With events'});
  const captured=await page.evaluate(()=>{const c=ADSContracts.capture(),nodes=[];(function walk(n){nodes.push(n);for(const child of n.children||[])walk(child);})(ADSComponentContract.compile(c).tree);return {decorations:nodes.filter(n=>n.id.endsWith('-after')).length,grid:nodes.filter(n=>n.styles.display==='grid').map(n=>n.styles['grid-template-columns']),nativeEvents:ADSWorkbench.selectedElement().querySelectorAll('.has-event').length};});
  assert.equal(captured.decorations,captured.nativeEvents);assert.equal(captured.decorations,2);assert.ok(captured.grid.every(Boolean));
 });
 for(const file of ['affix-default.html','dropdown-default.html','splitter-default.html','tree-default.html']){
  await load(file);await task(file+' keeps its interactive demo visible',async()=>{const example=page.locator('.wb-interactive');assert.equal(await example.count(),1);assert.equal(await example.evaluate(n=>n.closest('details')),null);});
 }
 results.summary={pages:results.pages.length,states:results.pages.reduce((n,p)=>n+p.states.length,0),invisibleStates:results.pages.flatMap(p=>p.states.filter(s=>!s.visible).map(s=>({file:p.file,...s}))),clippedPages:results.pages.filter(p=>p.widths.some(w=>w.clippedStart)),inspectorOverflow:results.pages.filter(p=>p.widths.some(w=>w.inspectorOverflow)),invalidContracts:results.pages.flatMap(p=>p.states.filter(s=>s.contractErrors.length).map(s=>({file:p.file,...s}))),exportErrors:results.pages.flatMap(p=>p.states.filter(s=>s.exportErrors.length).map(s=>({file:p.file,type:s.type,state:s.state,errors:s.exportErrors}))),tasks:results.tasks};
 console.log(JSON.stringify({...results.summary,clippedPages:results.summary.clippedPages.map(p=>({file:p.file,widths:p.widths.filter(w=>w.clippedStart)})),inspectorOverflow:results.summary.inspectorOverflow.map(p=>p.file)}));
 if(!process.argv.includes('--audit')){assert.deepEqual(results.summary.invisibleStates,[]);assert.deepEqual(results.summary.invalidContracts,[]);assert.deepEqual(results.summary.exportErrors,[]);assert.deepEqual(results.summary.clippedPages,[]);assert.deepEqual(results.summary.inspectorOverflow,[]);assert.equal(results.tasks.every(t=>t.status==='pass'),true);assert.deepEqual(results.errors,[]);}
}finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
