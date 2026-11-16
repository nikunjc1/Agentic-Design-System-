// Visual and behavior checks specific to the redesigned chat; isolated browser storage.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createBridge}=require('./component-bridge.cjs'),{answer,defaultAnswers:a}=require('./onboarding-browser.cjs'),M=require('../onboarding-model.js');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
const OUT=path.resolve(__dirname,'../audit/chat-redesign-2026-11-06');
const result={status:'running',checks:[],views:[],errors:[]};
(async()=>{let browser,server;try{
 fs.mkdirSync(OUT,{recursive:true});server=createBridge();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());const page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>result.errors.push(e.message));
 await page.goto(origin+'/new-project.html');await page.locator('#newProjectChoice').click();await page.locator('#project:visible').waitFor();
 const drafts={};
 for(let i=0;i<M.questions.length;i++){
  const q=M.questions[i];drafts[q.key]=await page.evaluate(()=>localStorage.getItem(ADSProject.DRAFT));
  const phase=i<3?'Project':i<7?'About you':'Design';assert.ok((await page.locator('#conversationStages [aria-current=step]').innerText()).includes(phase));assert.equal(await page.locator('#briefProgress').getAttribute('value'),String(i));
  if(['project','productType','spacingSystem','cornerStyle','brandColor'].includes(q.key))await page.screenshot({path:path.join(OUT,q.key+'-desktop.png'),animations:'disabled'});
  if(q.key==='brandColor'){
   await page.locator('#brandColorPicker').fill('#147b65');assert.equal(await page.locator('#brandColor').inputValue(),'#147B65');await page.locator('#brandColor').fill(a.brandColor);assert.equal(await page.locator('#brandColorPicker').inputValue(),a.brandColor.toLowerCase());result.checks.push('Native color picker and typed hex stay synchronized.');
  }
  await answer(page,q.key,a[q.key]);
 }
 assert.ok((await page.locator('#conversationStages [aria-current=step]').innerText()).includes('Review'));assert.equal(await page.locator('#briefProgress').getAttribute('value'),'11');result.checks.push('Stage indicator and live brief track all 11 answers through review.');
 for(const theme of ['light','dark'])for(const [width,height] of [[1440,900],[768,900],[390,844],[320,640]])for(const key of ['project','platforms','spacingSystem','cornerStyle']){
  await page.setViewportSize({width,height});await page.evaluate(({draft,theme})=>{localStorage.setItem(ADSProject.DRAFT,draft);localStorage.setItem('ads:theme',theme);},{draft:drafts[key],theme});await page.reload();await page.locator('#newProjectChoice').click();assert.equal(await page.locator('#conversationRecovery').isVisible(),false);assert.equal(await page.locator('#resumeConversation').count(),0);await page.waitForFunction(key=>document.getElementById('chatAnswerForm').dataset.question===key,key);
  const metrics=await page.evaluate(()=>{const log=document.getElementById('chatMessages').getBoundingClientRect(),q=document.getElementById('conversationQuestion').getBoundingClientRect(),composer=document.getElementById('chatComposer').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth+2||document.querySelector('main').scrollWidth>document.querySelector('main').clientWidth+2,questionVisible:q.top>=log.top-2&&q.bottom<=log.bottom+2,composerFits:composer.bottom<=innerHeight,briefOpen:document.getElementById('conversationPinned').open};});
  assert.equal(metrics.overflow,false);assert.ok(metrics.questionVisible,JSON.stringify({theme,width,height,key,...metrics}));assert.ok(metrics.composerFits);assert.equal(metrics.briefOpen,width>=1100);result.views.push({theme,width,height,key,...metrics});
  if(width===390||width===1440)await page.screenshot({path:path.join(OUT,`${key}-${theme}-${width}.png`),animations:'disabled'});
  if(width===390&&key==='platforms'){await page.locator('#togglePinnedAnswers').click();assert.equal(await page.locator('#conversationPinned').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#conversationPinned').isVisible(),false);assert.equal(await page.locator('#togglePinnedAnswers').evaluate(n=>n===document.activeElement),true);}
 }
 result.checks.push('32 theme/viewport/question combinations keep the question and composer reachable; mobile brief closes with Escape and returns focus.');
 // A 200% equivalent CSS viewport plus enlarged text and RTL checks reflow rather than fixed pixels.
 await page.setViewportSize({width:640,height:500});await page.evaluate(()=>{document.documentElement.dir='rtl';document.documentElement.style.fontSize='125%';});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);await page.screenshot({path:path.join(OUT,'reflow-rtl.png'),animations:'disabled'});result.checks.push('Narrow viewport with enlarged text and RTL has no horizontal overflow.');
 assert.deepEqual(result.errors,[]);result.status='pass';console.log(JSON.stringify(result));
 }catch(error){result.status='fail';result.failure=error.stack;process.exitCode=1;console.error(error);}finally{fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(result,null,2));await browser?.close();await new Promise(resolve=>server?.close(resolve));}})();
