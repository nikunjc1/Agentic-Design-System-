const fs = require('fs');
const path = require('path');
const http = require('http');
const {chromium} = require(process.env.ADS_PLAYWRIGHT_PACKAGE || '/private/tmp/claude-501/-Users-user-Documents/2c7bf700-ff49-4064-918f-85f5d9948fc4/scratchpad/vt/node_modules/playwright-core');
const ROOT = path.resolve(__dirname, '../..');
const OUT = process.env.ADS_PROMPT_AUDIT_OUT ? path.resolve(ROOT,process.env.ADS_PROMPT_AUDIT_OUT) : __dirname;
fs.mkdirSync(OUT,{recursive:true});
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && fs.readFileSync(path.join(ROOT,f),'utf8').includes('data-role="copy-prompt-action"')).sort();
const mime = {'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css'};
const server = http.createServer((req,res)=>{
  const file=path.join(ROOT,decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(ROOT+'/')){res.writeHead(403).end();return;}
  fs.readFile(file,(e,data)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);});
});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function extract(page){
  return page.evaluate(async()=>{
    const root=document.querySelector('[data-role="copy-prompt-action"]');
    const before=window.__auditCopies.length;
    const trigger=root?.querySelector('button');
    if(!trigger)return {prompt:null,error:'No Copy prompt button'};
    trigger.click();
    const combo=root.querySelector('.copy-dropdown-item-copy');
    if(combo)combo.click();
    await Promise.resolve();await Promise.resolve();
    return {prompt:window.__auditCopies.length>before?window.__auditCopies.at(-1):null,comboCount:root.querySelectorAll('.copy-dropdown-item-copy').length};
  });
}
async function settle(page){await page.waitForTimeout(140);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
async function inspect(browser,origin,file){
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
  await context.addInitScript(()=>{
    window.__auditCopies=[];
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__auditCopies.push(text);}}});
  });
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const row={file,errors,tests:[]};
  try{
    await page.goto(origin+'/'+file,{waitUntil:'load'});await settle(page);
    row.title=await page.locator('h1').innerText();
    row.default=await extract(page);
    row.pageText=await page.locator('main').innerText();
    row.tokens=await page.evaluate(()=>window.ADSFoundation.get());
    row.controls=await page.evaluate(()=>{
      const section=document.querySelector('[data-role="copy-prompt-action"]').closest('section');
      return [...section.querySelectorAll('input:not(.multiselect input),select,textarea')].map((el,i)=>{
        el.dataset.auditControl=String(i);
        return {i,tag:el.tagName,type:el.type,role:el.dataset.role,id:el.id,label:el.closest('.type-control')?.querySelector('span')?.textContent||el.closest('label')?.textContent.trim()||el.getAttribute('aria-label'),value:el.value,checked:el.checked,visible:!!el.getClientRects().length,options:el.options?[...el.options].map(o=>({value:o.value,text:o.textContent})):null,min:el.min,max:el.max};
      });
    });
    for(const c of row.controls){
      if(!c.visible||c.type==='hidden'||c.type==='radio')continue;
      let values;
      if(c.options) values=c.options.filter(o=>o.value!==c.value).map(o=>o.value);
      else if(c.type==='checkbox') values=[!c.checked];
      else if(['number','range'].includes(c.type))values=[String(Math.min(Number(c.max||9999),Math.max(Number(c.min||0),Number(c.value||0)+1)))];
      else if(c.type==='color')values=['#1357ab'];
      else values=[c.type==='url'||/url|src|image/i.test(c.role||'')?'https://example.com/audit-image.png':'AuditField42'];
      for(const value of values){
        await page.evaluate(({c,value})=>{const el=document.querySelector('[data-audit-control="'+c.i+'"]');if(c.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},{c,value});
        await settle(page);const result=await extract(page);
        row.tests.push({kind:'property',control:c.label||c.role||c.id,index:c.i,from:c.type==='checkbox'?c.checked:c.value,to:value,...result,changed:result.prompt!==row.default.prompt,containsValue:result.prompt?.includes(String(value))});
        await page.evaluate(c=>{const el=document.querySelector('[data-audit-control="'+c.i+'"]');if(c.type==='checkbox')el.checked=c.checked;else el.value=c.value;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},c);await settle(page);
      }
    }
    row.multi=await page.evaluate(()=>[...document.querySelector('[data-role="copy-prompt-action"]').closest('section').querySelectorAll('.multiselect')].map((el,i)=>{el.dataset.auditMulti=String(i);return {i,role:el.dataset.role,label:el.querySelector('legend')?.textContent,options:[...el.querySelectorAll('.multiselect-options input')].map(n=>({value:n.value,label:n.parentElement.textContent,checked:n.checked}))};}));
    for(const m of row.multi){
      const sets=m.options.map(o=>[o.value]);sets.push([],m.options.map(o=>o.value));
      if(m.options.length>2)sets.push(m.options.slice(0,2).map(o=>o.value));
      for(const values of sets){
        await page.evaluate(({m,values})=>{const root=document.querySelector('[data-audit-multi="'+m.i+'"]');for(const el of root.querySelectorAll('.multiselect-options input')){const checked=values.includes(el.value);if(el.checked!==checked){el.checked=checked;el.dispatchEvent(new Event('change',{bubbles:true}));}}},{m,values});
        await settle(page);const result=await extract(page);
        const headings=await page.locator('main .button-matrix-combo-label').allTextContents();
        row.tests.push({kind:'multi',control:m.label,values,headings,...result,changed:result.prompt!==row.default.prompt});
      }
      await page.evaluate(m=>{const root=document.querySelector('[data-audit-multi="'+m.i+'"]');for(const el of root.querySelectorAll('.multiselect-options input')){const checked=m.options.find(o=>o.value===el.value).checked;if(el.checked!==checked){el.checked=checked;el.dispatchEvent(new Event('change',{bubbles:true}));}}},m);await settle(page);
    }
    // Verify the theme is resolved at copy time, not cached at first render.
    await page.evaluate(()=>{document.documentElement.dataset.theme='dark';});await settle(page);
    row.dark=await extract(page);
  }catch(e){row.failure=e.message;}
  await context.close();fs.writeFileSync(path.join(OUT,file.replace('.html','.json')),JSON.stringify(row,null,2));
  console.log(JSON.stringify({file,tests:row.tests.length,errors:row.errors,failure:row.failure,staticProperties:row.tests.filter(t=>t.kind==='property'&&!t.changed).map(t=>t.control)}));
  return row;
}
if(require.main===module)(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  const rows=[];let next=0;
  await Promise.all(Array.from({length:3},async()=>{while(next<files.length){const file=files[next++];rows.push(await inspect(browser,origin,file));}}));
  fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(rows.sort((a,b)=>a.file.localeCompare(b.file)),null,2));
  await browser.close();server.close();
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
module.exports={ROOT,server,chromium,settle,extract};
