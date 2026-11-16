const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createBridge}=require('./component-bridge.cjs'),{visit}=require('./visit-project.cjs');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const OUT=path.resolve(__dirname,'../audit/data-format-2026-11-06'),report={status:'running',checks:[],errors:[]};
(async()=>{let server,browser,page;try{
 fs.mkdirSync(OUT,{recursive:true});server=createBridge();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
 page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(origin+'/new-project.html');await page.locator('#existingProjectChoice').click();await page.waitForURL('**/overview.html#projects');await visit(page,origin+'/data-format.html');await page.locator('#format-locale').waitFor();
 assert.equal(await page.locator('.ads-format-field').count(),24);assert.equal(await page.locator('.ads-format-field .ads-required').count(),7);
 assert.equal(await page.locator('main').getByText('Configure above; this example uses the current Foundation settings.',{exact:true}).count(),0);
 assert.equal(await page.locator('[data-format="percent"]').innerText(),'12.5%');
 await page.evaluate(()=>{window.formatWrites=0;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='ads:data-format')window.formatWrites++;return original.call(this,key,value);};});
 await page.locator('#format-decimals').fill('3');await page.locator('#format-decimals').blur();
 assert.equal(await page.evaluate(()=>window.formatWrites),1);
 assert.equal(await page.locator('.ads-format-table [data-format=currency]').innerText(),'£123.450');
 await page.locator('#format-grouping').uncheck();assert.equal(await page.locator('#format-grouping').locator('..').innerText(),'Off');
 await page.locator('#format-grouping').check();
 const good=await page.evaluate(()=>localStorage.getItem('ads:data-format'));
 await page.locator('#format-zone').fill('Wrong/Zone');await page.locator('#format-mask').fill('ab');
 assert.equal(await page.locator('[aria-invalid=true]').count(),2);assert.equal(await page.evaluate(()=>localStorage.getItem('ads:data-format')),good);
 assert.match(await page.locator('#format-zone-error').innerText(),/IANA/);
 assert.match(await page.locator('#format-error').innerText(),/last valid/);
 await page.locator('#format-zone').fill('America/Los_Angeles');await page.locator('#format-mask').fill('•');
 assert.equal(await page.locator('[aria-invalid=true]').count(),0);
 assert.equal(await page.locator('[data-format=range]').innerText(),'2026-01-01 – 2026-03-31');
 await page.locator('#format-unitSpace').selectOption('nbsp');assert.equal(await page.locator('[data-format=unit]').innerText(),'220\u00a0kg');
 await page.locator('#format-redaction').selectOption('full');assert.equal(await page.locator('[data-format=redaction]').innerText(),'••••••••••••');
 report.checks.push('All 24 controls render; typed edits save once, checkbox status tracks state, simultaneous invalid inputs preserve storage, and calendar ranges and masking update correctly.');
 await page.evaluate(()=>localStorage.setItem('ads:data-format',JSON.stringify(ADSFoundationModel.normalizeData({locale:'es-ES',currency:'CAD'}))));
 await visit(page,origin+'/data-format.html');assert.equal(await page.locator('#format-locale').inputValue(),'es-ES');assert.equal(await page.locator('#format-currency').inputValue(),'CAD');
 await page.locator('#format-separator').selectOption('comma');assert.equal(await page.locator('#format-separator').getAttribute('aria-invalid'),'true');
 await page.locator('#format-separator').selectOption('locale');
 await page.locator('#format-mask').fill('ab');await page.getByRole('button',{name:'Reset Data Format',exact:true}).click();
 assert.equal(await page.locator('[aria-invalid=true]').count(),0);assert.equal(await page.locator('#format-locale').inputValue(),'en-GB');
 report.checks.push('Imported Spanish/CAD settings stay selected; Spanish decimal-comma conflicts are rejected; reset clears values and error attributes.');
 await page.locator('#format-locale').selectOption('fr-FR');await page.locator('#format-currency').selectOption('EUR');
 await page.evaluate(()=>{window.copied='';navigator.clipboard.writeText=async text=>{window.copied=text;};});
 await page.locator('#copyPageMarkdownBtn').click();const markdown=await page.evaluate(()=>window.copied);
 assert.match(markdown,/"locale": "fr-FR"/);assert.match(markdown,/Pass a ratio/);assert.doesNotMatch(markdown,/English \(United Kingdom\)/);assert.doesNotMatch(markdown,/Configure above;/);
 const event=page.waitForEvent('download');await page.getByRole('button',{name:'Download configuration',exact:true}).click();const download=await event;const downloaded=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
 assert.deepEqual(downloaded.dataFormat,await page.evaluate(()=>ADSFoundation.get().dataFormat));fs.writeFileSync(path.join(OUT,'configuration.json'),JSON.stringify(downloaded,null,2));fs.writeFileSync(path.join(OUT,'page.md'),markdown);
 await visit(page,origin+'/data-format.html');assert.equal(await page.locator('#format-locale').inputValue(),'fr-FR');
 report.checks.push('Copy Markdown contains specific guidance and current settings without dropdown-option noise; downloaded JSON matches runtime settings and survives reload.');
 // Storage failures retain the last durable record, allow a retry, and allow
 // reverting the failed preview to the previously saved configuration.
 await page.evaluate(()=>{window.durable=localStorage.getItem('ads:data-format');window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='ads:data-format')throw new Error('Test quota');return window.originalSet.call(this,k,v);};});
 await page.locator('#format-decimals').fill('4');assert.match(await page.locator('.ads-format-actions .save-status').innerText(),/could not be saved/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('ads:data-format')===window.durable),true);
 await page.evaluate(()=>{Storage.prototype.setItem=window.originalSet;});await page.locator('#format-decimals').fill('2');
 assert.equal(await page.evaluate(()=>ADSFoundation.get().dataFormat.decimals),2);
 report.checks.push('Storage failure reports an unsaved preview and preserves durable settings; reverting the failed edit restores the resolved configuration.');
 for(const theme of ['light','dark'])for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});await page.evaluate(theme=>localStorage.setItem('ads:theme',theme),theme);await visit(page,origin+'/data-format.html');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2||document.querySelector('main').scrollWidth>document.querySelector('main').clientWidth+2),false,theme+' '+width+' overflow');
  assert.equal(await page.locator('.ads-format-field input,.ads-format-field select').evaluateAll(nodes=>nodes.some(n=>n.type!=='checkbox'&&n.getBoundingClientRect().height<44)),false);
  if(width===1440||width===390){await page.screenshot({path:path.join(OUT,`${theme}-${width}.png`),animations:'disabled'});await page.locator('#format-zone').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(OUT,`${theme}-${width}-fields.png`),animations:'disabled'});await page.getByRole('heading',{name:'Missing and sensitive data',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:path.join(OUT,`${theme}-${width}-states.png`),animations:'disabled'});}
 }
 await page.setViewportSize({width:768,height:1000});await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.style.fontSize='200%';});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'RTL / scaled text overflow');
 report.checks.push('No horizontal overflow at 320, 390, 768 and 1440px in both themes, or with RTL and doubled root text; standard inputs meet the 44px minimum height.');
 const other=await context.newPage();await visit(other,origin+'/data-format.html');await other.locator('#format-unit').fill('kW');await page.locator('.ads-editor-conflict').waitFor();assert.equal(await page.locator('#format-unit').isDisabled(),true);await other.close();await visit(page,origin+'/data-format.html');assert.equal(await page.locator('#format-unit').inputValue(),'kW');assert.equal(await page.locator('#format-unit').isEnabled(),true);report.checks.push('A change in another tab disables stale controls; reload restores the latest settings.');assert.equal(await page.locator('.ads-format-field .ads-required').count(),7);assert.deepEqual(report.errors,[]);report.status='pass';console.log(JSON.stringify(report,null,2));
 }catch(e){report.status='fail';report.failure=e.stack;process.exitCode=1;console.error(e);console.error('URL',page?.url(),'Errors',report.errors);await page?.screenshot({path:path.join(OUT,'failure.png'),timeout:3000}).catch(()=>{});console.error(await page?.evaluate(()=>({ready:document.readyState,fields:document.querySelectorAll('.ads-format-field').length,body:document.body.innerText.slice(0,300)})).catch(()=>null));}finally{fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(report,null,2));await browser?.close();if(server)await new Promise(r=>server.close(r));}
})();
