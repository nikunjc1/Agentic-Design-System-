const fs=require('fs');const path=require('path');
const {ROOT,server,chromium,settle,extract}=require('./run-audit.cjs');
const rows=require('./results.json');
const out=__dirname;fs.mkdirSync(path.join(out,'screenshots'),{recursive:true});
async function snapshot(page){return page.evaluate(()=>{
 const section=[...document.querySelectorAll('main section')].find(s=>s.querySelector('h2')?.textContent.trim()==='Live Preview');
 if(!section)return null;
 const clone=section.cloneNode(true);clone.querySelectorAll('[id],[for]').forEach(n=>{n.removeAttribute('id');n.removeAttribute('for');});
 return {html:clone.innerHTML,text:section.innerText,values:[...section.querySelectorAll('input,textarea,select')].map(n=>({value:n.value,checked:n.checked})),styles:[...section.querySelectorAll('[class*="-demo-"],.btn-demo,.group-btn-segment,.dualicon-btn')].filter(n=>n.getClientRects().length).map(n=>{const s=getComputedStyle(n);return {cls:n.className,state:n.closest('tr')?.querySelector('th')?.textContent,type:n.closest('table')?.querySelector('thead tr')?.children[n.closest('td')?.cellIndex]?.textContent,text:n.children.length?null:n.textContent,bg:s.backgroundColor,color:s.color,border:s.border,borderBottom:s.borderBottom,outline:s.outline,outlineOffset:s.outlineOffset,radius:s.borderRadius,fontSize:s.fontSize,fontFamily:s.fontFamily,fontWeight:s.fontWeight,height:s.height,padding:s.padding,opacity:s.opacity,shadow:s.boxShadow};})};
});}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const results=[];let next=0;
 await Promise.all(Array.from({length:3},async()=>{while(next<rows.length){
  const row=rows[next++];const context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
  await context.addInitScript(()=>{window.__auditCopies=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>window.__auditCopies.push(text)}});});
  const page=await context.newPage();await page.goto(origin+'/'+row.file);await settle(page);
  const baseline=await snapshot(page);const verified={file:row.file,baseline,properties:[]};
  const preview=page.locator('main section').filter({has:page.locator('h2',{hasText:/^Live Preview$/})});
  if(await preview.count())await preview.evaluate(n=>n.scrollIntoView({block:'start'}));
  await page.screenshot({path:path.join(out,'screenshots',row.file.replace('.html','.png'))});
  for(const t of row.tests.filter(t=>t.kind==='property'&&!t.changed)){
   const c=row.controls.find(c=>c.i===t.index);
   await page.evaluate(({c,value})=>{const sec=document.querySelector('[data-role="copy-prompt-action"]').closest('section');const el=[...sec.querySelectorAll('input:not(.multiselect input),select,textarea')][c.i];if(c.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},{c,value:t.to});
   await settle(page);const after=await snapshot(page);const copy=await extract(page);
   verified.properties.push({control:t.control,index:t.index,from:t.from,to:t.to,previewChanged:JSON.stringify(baseline)!==JSON.stringify(after),promptChanged:copy.prompt!==row.default.prompt,previewContainsValue:after?.text.includes(String(t.to)),beforeText:baseline?.text.slice(0,800),afterText:after?.text.slice(0,800),afterStyles:after?.styles.filter((s,i)=>JSON.stringify(s)!==JSON.stringify(baseline?.styles[i])).slice(0,6)});
   await page.evaluate(c=>{const sec=document.querySelector('[data-role="copy-prompt-action"]').closest('section');const el=[...sec.querySelectorAll('input:not(.multiselect input),select,textarea')][c.i];if(c.type==='checkbox')el.checked=c.checked;else el.value=c.value;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},c);await settle(page);
  }
  results.push(verified);await context.close();console.log(row.file+' '+verified.properties.length+' omissions; '+verified.properties.filter(p=>p.previewChanged).length+' preview changes');
 }}));
 fs.writeFileSync(path.join(out,'preview-verification.json'),JSON.stringify(results,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
