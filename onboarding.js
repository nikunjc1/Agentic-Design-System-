/* One-question conversation, answer pins, confirmation, and real local setup. */
(() => {
 'use strict';
 const P=window.ADSProject,M=window.ADSOnboardingModel,F=window.ADSFoundationModel;
 const $=id=>document.getElementById(id),host=$('onboardingConversation');if(!host)return;
 const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 const questions=M.questions,params=new URLSearchParams(location.search),choice=$('newProjectChoice');
 let profile=null,expectedRaw=null,answers={},answered=[],current='project',pending={},editing=false,busy=false,conflict=false,recoveryPending=false,committed=null,replying=false;
 let cachedDraft=null,expectedDraftRaw=null,foundationBaseline={},pendingRecovery=null;
 let draftTimer=null,draftDirty=false,lastDraftPayload='',pendingAnswers={};
 try{expectedRaw=localStorage.getItem(P.KEY);profile=P.read(localStorage);}catch(error){pendingRecovery={kind:'profile',message:error.message};}
 const label=key=>questions.find(q=>q.key===key)?.label||key;
 function url(mode){const u=new URL(location.href);u.search='';if(mode)u.searchParams.set(mode,'1');u.hash='';history.replaceState(null,'',u);}
 function reveal(){
  $('projectSetupArea').hidden=false;$('projectChoice').hidden=true;document.body.classList.add('is-conversational');choice.setAttribute('aria-expanded','true');
 }
 function scrollChat(behavior='instant'){
  const log=$('chatMessages'),turn=$('conversationTurn');
  const top=!turn.hidden&&turn.offsetHeight>log.clientHeight-32?log.scrollTop+turn.getBoundingClientRect().top-log.getBoundingClientRect().top-16:log.scrollHeight;
  log.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':behavior});
 }
 function focusQuestion(){requestAnimationFrame(()=>{const q=questions.find(q=>q.key===current);const input=$('conversationInput').querySelector('textarea:not([disabled]):not([hidden])');if(input&&q?.type!=='choice'&&q?.type!=='multiple')input.focus({preventScroll:true});else $('conversationQuestion').focus({preventScroll:true});});}
 const wideBrief=matchMedia('(min-width: 1100px)');
 function closePins(){$('conversationPinned').open=wideBrief.matches;$('togglePinnedAnswers').setAttribute('aria-expanded',String(wideBrief.matches));}
 wideBrief.addEventListener('change',closePins);
 function updateProgress(){
  const index=questions.findIndex(q=>q.key===current),phase=index<0?3:index<3?0:index<7?1:2;
  $('briefProgress').max=questions.length;$('briefProgress').value=answered.length;$('briefProgressLabel').textContent=answered.length+' of '+questions.length+' answers';
  $('conversationStages').querySelectorAll('li').forEach((step,i)=>{step.dataset.state=i<phase?'complete':i===phase?'current':'waiting';if(i===phase)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');});
 }
 function baseSettings(){const saved={};if(editing)for(const key of F.recordKeys){const raw=localStorage.getItem('ads:'+key);if(raw!==null){const record=F.inspectRecord(key,raw);if(!['valid','migrated'].includes(record.status))throw new Error('Your saved '+key+' settings need recovery. Back up or reset them in Foundations before changing setup.');saved[key]=record.value||F.migrateRecord(key,JSON.parse(raw));}}return saved;}
 function stopDraftSave(){clearTimeout(draftTimer);draftTimer=null;draftDirty=false;}
 function markConflict(){
  conflict=true;stopDraftSave();$('sendAnswer').disabled=true;$('confirmConversation').disabled=true;$('reloadConversation').hidden=false;
  $('conversationDraftStatus').textContent='Project setup changed in another tab. Your answers are preserved here. Reload before continuing.';updateSelection();
 }
 function flushDraft(){
  clearTimeout(draftTimer);draftTimer=null;
  if(!draftDirty||recoveryPending||busy||conflict)return;
  try{
   if(localStorage.getItem(P.DRAFT)!==expectedDraftRaw||localStorage.getItem(P.KEY)!==expectedRaw){markConflict();return;}
   const draft={...answers,version:2,step:1,newProject:!editing,conversation:{version:1,answered,current,pending,pendingAnswers,baseRaw:expectedRaw,foundationBaseline}},payload=JSON.stringify(draft);
   if(payload===lastDraftPayload){draftDirty=false;return;}
   const raw=JSON.stringify({...draft,updatedAt:new Date().toISOString()});localStorage.setItem(P.DRAFT,raw);expectedDraftRaw=raw;lastDraftPayload=payload;draftDirty=false;
   $('conversationDraftStatus').textContent='Draft saved. You can come back to this conversation.';
  }catch{$('conversationDraftStatus').textContent='Your draft could not be saved. Keep this page open to retain your answers.';}
 }
 function saveDraft(){if(recoveryPending||busy||conflict)return;draftDirty=true;flushDraft();}
 function queueDraft(){if(recoveryPending||busy||conflict)return;draftDirty=true;clearTimeout(draftTimer);draftTimer=setTimeout(flushDraft,200);}
 // Flush pending text before navigation or backgrounding, without blocking the browser's back cache.
 window.addEventListener('pagehide',flushDraft);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushDraft();});
 $('chatAnswerForm').addEventListener('focusout',flushDraft);
 function snapshotInput(){
  const q=questions.find(q=>q.key===current);if(!q)return {};
  const data=new FormData($('chatAnswerForm')),typed=String(data.get('chatReply')||'').trim();
  const match=value=>q.options?.find(o=>[o.label,o.value].some(v=>v.toLocaleLowerCase()===value.toLocaleLowerCase()))?.value||value;
  let value=q.type==='multiple'?data.getAll(q.key):String(data.get(q.key)||'').trim();
  if(typed&&q.type==='choice')value=match(typed);
  if(typed&&q.type==='multiple')value=[...new Set([...value,...typed.split(/[,;]+/).map(v=>match(v.trim())).filter(Boolean)])];
  const result={[q.key]:value};
  if(['productType','role'].includes(q.key))result[q.key==='role'?'roleOther':'productOther']=value==='Other'?String(data.get(q.key==='role'?'roleOther':'productOther')||'').trim():'';
  return result;
 }
 function updateSelection(){
  const button=$('continueSelection'),status=$('selectionStatus'),q=questions.find(q=>q.key===current);if(!button||q?.type!=='multiple')return;
  const candidate={...answers,...snapshotInput()},values=candidate[current],valid=Array.isArray(values)&&values.length>0&&!M.error(current,candidate),count=Array.isArray(values)?values.length:0;
  button.disabled=conflict||busy||replying||!valid;
  button.textContent=valid?'Continue with '+count+' '+(count===1?'platform':'platforms')+' →':'Continue →';
  status.textContent=valid?count+' '+(count===1?'platform selected':'platforms selected')+'. Add more or continue.':'Select one or more platforms, then continue.';
 }
 function pinAnswers(){
  updateProgress();$('pinnedAnswers').replaceChildren();$('pinnedAnswerCount').textContent=String(answered.length);$('chatAnswerCount').textContent=String(answered.length);
  for(const q of questions.filter(q=>answered.includes(q.key))){const b=node('button','','answer-pin');b.type='button';b.setAttribute('aria-label','Edit '+q.label);b.append(node('span',q.label),node('strong',M.display(q.key,answers)));b.addEventListener('click',()=>edit(q.key));$('pinnedAnswers').append(b);}
  if(!answered.length)$('pinnedAnswers').append(node('p','A little about your project. A few design choices. Your brief takes shape as we go.','brief-empty'));
 }
 function assistantRow(text){
  const row=node('div','','chat-assistant-row'),avatar=node('span','✦','assistant-mark');avatar.setAttribute('aria-hidden','true');const bubble=node('div','','assistant-message');bubble.append(node('span','Design companion','conversation-speaker'),node('p',text,'chat-message-text'));row.append(avatar,bubble);return row;
 }
 function transcript(){
  const log=$('conversationTranscript');
  if(!log.querySelector('.chat-intro')){const intro=node('div','','chat-intro');intro.append(node('p',editing?'REFINE YOUR SYSTEM':'YOUR IDEAS, A SHARED LANGUAGE','chat-intro-eyebrow'),node('h2',editing?'Let’s fine-tune your system.':'Let’s make it yours.'),node('p','Tell me about your project. I’ll help shape its foundations, one answer at a time.'));log.append(intro);}
  for(const q of questions.filter(q=>answered.includes(q.key))){
   let entry=log.querySelector('[data-answer-key="'+q.key+'"]');
   if(!entry){entry=node('article','','conversation-exchange');entry.dataset.answerKey=q.key;entry.append(assistantRow(q.question));const reply=node('div','','chat-user-row'),bubble=node('div','','conversation-user');bubble.append(node('span','','chat-reply-text'));const change=node('button','Edit','conversation-edit');change.type='button';change.setAttribute('aria-label','Change '+q.label);change.addEventListener('click',()=>editQuestion(q.key));reply.append(bubble,change);entry.append(reply);log.append(entry);}
   const reply=entry.querySelector('.chat-reply-text'),text=M.display(q.key,answers);if(reply.textContent!==text)reply.textContent=text;
  }
 }
 function editQuestion(key){edit(key);}
 function edit(key){if(busy||replying||recoveryPending||conflict)return;closePins();current=key;pending={...(pendingAnswers[key]||{})};renderQuestion(true);saveDraft();}
 function renderQuestion(focus=false){
  document.body.classList.remove('is-building');$('conversationWorkspace').hidden=false;$('conversationTurn').hidden=false;$('conversationReview').hidden=true;$('setupBuild').hidden=true;$('setupDone').hidden=true;$('chatComposer').hidden=false;$('assistantTyping').hidden=true;
  const q=questions.find(q=>q.key===current)||questions[0];current=q.key;$('chatAnswerForm').dataset.question=current;$('conversationOptions').dataset.kind=q.key;$('composerLabel').textContent=q.type==='choice'||q.type==='multiple'?'Or type your answer':'Your reply';
  $('conversationQuestion').textContent=q.question;$('conversationHelp').textContent=q.help;$('conversationCount').textContent='QUESTION '+(questions.indexOf(q)+1)+' OF '+questions.length+' · '+q.label;$('conversationError').textContent='';
  $('conversationPrevious').hidden=questions.indexOf(q)===0;$('sendAnswer').disabled=conflict;
  const inputHost=$('conversationInput'),optionsHost=$('conversationOptions');inputHost.replaceChildren();optionsHost.replaceChildren();const initial={...answers,...pending};
  function composerInput(key,value,placeholder,label){
   const wrap=node('label','','chat-reply-field');wrap.append(node('span',label,'sr-only'));const input=node('textarea');input.id=key;input.name=key;input.rows=1;const limit=q.type==='email'?254:100;input.maxLength=limit;input.placeholder=placeholder;input.value=value||'';input.autocomplete=q.autocomplete||'off';
   const counterId=key+'Count',counter=node('span','','chat-reply-count');counter.id=counterId;counter.setAttribute('role','status');counter.setAttribute('aria-live','off');
   const updateCounter=()=>{const remaining=limit-input.value.length;counter.textContent=input.value.length+' / '+limit+' characters';counter.classList.toggle('is-near-limit',remaining<=Math.max(10,Math.round(limit*0.1)));};
   input.setAttribute('aria-describedby','conversationHelp conversationError '+counterId);input.setAttribute('aria-label',label);if(q.type==='email')input.inputMode='email';
   input.addEventListener('input',updateCounter);updateCounter();
   wrap.append(input,counter);inputHost.append(wrap);return {wrap,input};
  }
  if(q.type==='choice'||q.type==='multiple'){
   const group=node('fieldset','','conversation-options');group.append(node('legend',q.label,'sr-only'));
   for(const option of q.options){const tile=node('label','','conversation-option'),input=node('input');input.type=q.type==='multiple'?'checkbox':'radio';input.name=q.key;input.value=option.value;input.setAttribute('form','chatAnswerForm');input.checked=q.type==='multiple'?(initial[q.key]||[]).includes(option.value):initial[q.key]===option.value;input.setAttribute('aria-describedby','conversationError');tile.title=option.description||option.label;tile.append(input);
    if(['spacingSystem','cornerStyle'].includes(q.key)){const sample=node('span','','option-sample option-sample--'+q.key);sample.dataset.value=option.value;sample.setAttribute('aria-hidden','true');for(let i=0;i<3;i++)sample.append(node('i'));tile.append(sample);}
    const copy=node('span','','option-copy');copy.append(node('span',option.label,'option-label'));if(option.description)copy.append(node('span',option.description,'option-description'));tile.append(copy,node('span','','option-indicator'));group.append(tile);}optionsHost.append(group);
   if(q.type==='multiple'){
    const actions=node('div','','chat-selection-actions'),status=node('p','','chat-selection-status'),next=node('button','Continue →','btn btn-primary');
    status.id='selectionStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');next.id='continueSelection';next.type='submit';next.setAttribute('form','chatAnswerForm');next.setAttribute('aria-describedby','selectionStatus');next.disabled=true;actions.append(status,next);optionsHost.append(actions);
   }
   const reply=composerInput('chatReply',initial.chatReply||'','Type an answer…','Type an answer');
   if(['productType','role'].includes(q.key)){const key=q.key==='role'?'roleOther':'productOther',extra=composerInput(key,initial[key]||'',q.key==='role'?'Tell me about your role…':'Tell me about your product…',q.key==='role'?'Describe your role':'Describe your product');extra.wrap.id='conversationOther';extra.wrap.hidden=initial[q.key]!=='Other';extra.input.disabled=extra.wrap.hidden;reply.wrap.hidden=!extra.wrap.hidden;reply.input.disabled=!extra.wrap.hidden;}
   $('chatComposerHint').textContent=q.type==='multiple'?'Choose your platforms, then Continue above':'Choose an option above or type its name';
  }else{
   const result=composerInput(q.key,initial[q.key]??(q.type==='color'?'#FF031A':''),q.placeholder||'Type your answer…',q.label);result.input.required=true;$('chatComposerHint').textContent='Enter to send · Shift + Enter for a new line';
   if(q.type==='color'){
    const preview=node('div','','brand-choice'),picker=node('input'),copy=node('div');picker.type='color';picker.id='brandColorPicker';picker.value=/^#[0-9a-f]{6}$/i.test(result.input.value)?result.input.value:'#FF031A';picker.setAttribute('aria-label','Choose primary brand color');copy.append(node('strong','Your brand starts here'),node('p','Choose a color or enter its hex value below.'));preview.append(picker,copy);optionsHost.append(preview);
    picker.addEventListener('input',()=>{result.input.value=picker.value.toUpperCase();result.input.dispatchEvent(new Event('input',{bubbles:true}));});result.input.addEventListener('input',()=>{if(/^#[0-9a-f]{6}$/i.test(result.input.value))picker.value=result.input.value;});
   }
  }
  updateSelection();pinAnswers();transcript();if(focus){scrollChat();focusQuestion();}
 }
 function review(focus=true){
  document.body.classList.remove('is-building');
  $('conversationTurn').hidden=true;$('conversationReview').hidden=false;$('chatComposer').hidden=true;$('assistantTyping').hidden=true;$('conversationWorkspace').hidden=false;$('setupBuild').hidden=true;$('setupDone').hidden=true;
  $('conversationSummary').replaceChildren();
  for(const q of questions){const dt=node('dt',q.label),dd=node('dd');dd.append(node('span',M.display(q.key,answers)));const b=node('button','Change','conversation-edit');b.type='button';b.setAttribute('aria-label','Review '+q.label);b.addEventListener('click',()=>edit(q.key));dd.append(b);$('conversationSummary').append(dt,dd);}
  $('conversationPlan').replaceChildren();try{const plan=M.buildPlan(answers,baseSettings());const preview=node('div','','conversation-plan-swatch');preview.style.backgroundColor=answers.brandColor;preview.setAttribute('aria-hidden','true');const description=node('div');description.append(node('p',answers.project+' · '+plan.records['grid-layout'].columns+'-column grid · '+plan.records.spacing.system+' spacing · '+M.display('cornerStyle',answers)+' corners'),node('p','Your choices guide the setup. Remaining Foundations start with library defaults, and every setting stays editable.','setup-help'));$('conversationPlan').append(preview,description);}catch(error){$('conversationPlan').append(node('p',error.message));}
  $('confirmConversation').disabled=conflict;pinAnswers();transcript();if(focus){const log=$('chatMessages');log.scrollTo({top:log.scrollTop+$('conversationReview').getBoundingClientRect().top-log.getBoundingClientRect().top-20,behavior:'instant'});requestAnimationFrame(()=>$('conversationReviewTitle').focus({preventScroll:true}));}
 }
 function resumeDraft(){
  const draft=cachedDraft;cachedDraft=null;recoveryPending=false;
  $('conversationRecovery').hidden=true;$('conversationTranscript').replaceChildren();
  answers=draft.answers;answered=draft.answered;pending=draft.pending||{};pendingAnswers=draft.pendingAnswers||{};editing=!draft.newProject;foundationBaseline=draft.foundationBaseline||{};committed=null;
  current=questions.some(q=>q.key===draft.current)?draft.current:questions.find(q=>!answered.includes(q.key))?.key||'';
  if(draft.baseRaw!==undefined&&draft.baseRaw!==expectedRaw){conflict=true;$('reloadConversation').hidden=false;$('conversationDraftStatus').textContent='The active project changed since this draft. Your answers are preserved; reload or cancel before saving.';}
  reveal();url(editing?'edit':'new');$('cancelConversation').hidden=false;
  if(answered.length===questions.length&&!draft.current)review();else renderQuestion(true);
  closePins();if(!conflict)$('conversationDraftStatus').textContent='Welcome back. Your unfinished answers have been restored.';
 }
 function start(isEdit=false){
  if(pendingRecovery){const issue=pendingRecovery;pendingRecovery=null;recover(issue.kind,issue.message);return;}
  if(recoveryPending){reveal();return;}
  if(cachedDraft){resumeDraft();return;}
  $('conversationTranscript').replaceChildren();closePins();editing=isEdit;$('cancelConversation').hidden=false;committed=null;answered=[];pending={};pendingAnswers={};answers={platforms:[]};
  foundationBaseline={};if(isEdit&&profile){for(const key of P.PROJECT_FOUNDATIONS)foundationBaseline[key]=localStorage.getItem(key);const existing=baseSettings();answers={...profile,brandColor:existing.colors?.light?.primary?.hex||'#FF031A',spacingSystem:existing.spacing?.system||'recommended',cornerStyle:existing.radius?.philosophy||'balanced',iconStyle:existing.icons?.system||'line'};answered=questions.filter(q=>!M.error(q.key,answers)).map(q=>q.key);}
  current=questions.find(q=>!answered.includes(q.key))?.key||'';reveal();url(isEdit?'edit':'new');
  if(answered.length===questions.length)review();else renderQuestion(true);
  saveDraft();closePins();
 }
 function saved(){
  document.body.classList.remove('is-building');
  reveal();$('conversationWorkspace').hidden=true;$('setupBuild').hidden=true;$('setupDone').hidden=false;$('conversationRecovery').hidden=true;
  $('savedProjectName').textContent=profile.project;$('savedSetupReview').replaceChildren();
  const rows=[['Project',profile.project],['Product',profile.productType==='Other'?profile.productOther:profile.productType],['Platforms',M.display('platforms',profile)],['Name',profile.name||'Not provided'],['Email',profile.email||'Not provided'],['Designation',profile.designation||'Not provided'],['Role',profile.role==='Other'?profile.roleOther:profile.role]];
  for(const [key,value]of rows)$('savedSetupReview').append(node('dt',key),node('dd',value));
  $('cancelConversation').hidden=true;$('conversationDraftStatus').textContent=P.foundationReadiness(localStorage).filter(row=>row.state==='saved').length+' of 8 Foundations saved. All settings remain editable.';
 }
 function backup(raw,name){const link=node('a');link.href=URL.createObjectURL(new Blob([raw],{type:'application/json'}));link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);}
 function recover(kind,message){
  recoveryPending=true;reveal();$('conversationWorkspace').hidden=true;$('setupDone').hidden=true;$('setupBuild').hidden=true;const box=$('conversationRecovery');box.hidden=false;box.replaceChildren();box.append(node('p',message));const actions=node('div','','setup-actions'),key=kind==='profile'?P.KEY:P.DRAFT;let raw=null;try{raw=localStorage.getItem(key);}catch{}

  const copy=node('button',kind==='profile'?'Back up saved setup':'Back up draft','btn btn-ghost');copy.type='button';copy.addEventListener('click',()=>backup(raw||'',kind==='profile'?'project-profile-backup.json':'project-draft-backup.json'));actions.append(copy);
  const discard=node('button',kind==='profile'?'Discard unreadable setup':'Discard draft','btn btn-ghost');discard.type='button';discard.addEventListener('click',()=>{try{localStorage.removeItem(key);window.ADSNavigation ? window.ADSNavigation.go('new-project.html?new=1') : (location.href = 'new-project.html?new=1');}catch{$('conversationDraftStatus').textContent='Could not discard saved data. Your saved records are unchanged.';}});actions.append(discard);box.append(actions);
 }
 const stages=[['Confirming your project brief','Project brief confirmed'],['Preparing your brand palette','Brand palette prepared'],['Shaping typography and layout','Typography and layout prepared'],['Applying spacing, corners and icons','Component foundations prepared'],['Checking light and dark themes','Light and dark themes checked'],['Saving your design system','Design system saved']];
 const paint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 async function runSetup(){
  if(busy||conflict||recoveryPending)return;
  const invalid=M.validate(answers);if(Object.keys(invalid).length){current=Object.keys(invalid)[0];renderQuestion(true);$('conversationError').textContent=invalid[current];return;}
  busy=true;document.body.classList.add('is-building');$('conversationWorkspace').hidden=true;$('setupBuild').hidden=false;$('setupBuildDone').hidden=true;$('setupBuildRetry').hidden=true;$('setupBuildError').textContent='';$('setupBuildTitle').textContent='Setting up your design system';$('setupBuildCopy').textContent='Turning your answers into your project’s Foundation settings.';$('setupBuildProgress').value=0;$('cancelConversation').disabled=true;$('setupBuild').setAttribute('aria-busy','true');$('setupBuildSteps').replaceChildren();
  const rows=stages.map(([text])=>{const li=node('li',text);li.dataset.state='waiting';$('setupBuildSteps').append(li);return li;});$('setupBuild').scrollIntoView({block:'center',behavior:'smooth'});$('setupBuildTitle').focus({preventScroll:true});let plan;
  try{
   for(let index=0;index<stages.length;index++){
    if(conflict)throw new Error('Project setup changed in another tab. Reload before confirming; your answers are retained.');const row=rows[index];row.dataset.state='working';$('conversationDraftStatus').textContent=stages[index][0];await paint();
    if(index===0&&Object.keys(P.validate(answers)).length)throw new Error('Review your project details before saving.');
    if(index===1){plan=M.buildPlan(answers,baseSettings());if(!F.validRecord('colors',plan.records.colors))throw new Error('Your brand palette could not be prepared.');}
    if(index===2)for(const key of ['typography','grid-layout'])if(!F.validRecord(key,plan.records[key]))throw new Error('Your '+key+' settings need review.');
    if(index===3)for(const key of ['spacing','radius','icons'])if(!F.validRecord(key,plan.records[key]))throw new Error('Your '+key+' settings need review.');
    if(index===4){if(!Object.keys(plan.light.tokens).length||!Object.keys(plan.dark.tokens).length)throw new Error('Theme settings could not be checked.');}
    if(index===5){
     if(!committed){const brief=Object.fromEntries([...questions.map(q=>q.key),'productOther','roleOther'].filter(key=>answers[key]!==undefined).map(key=>[key,answers[key]]));committed=P.save(localStorage,brief,{expectedRaw,expectedDraftRaw,expectedFoundations:editing?foundationBaseline:{},newProject:!editing,foundationRecords:plan.records,clearDraft:true});expectedRaw=localStorage.getItem(P.KEY);profile=committed;}
     else if(P.read(localStorage)?.id!==committed.id)throw new Error('Your active project changed. Open History to review the saved project.');
     for(const [key,value]of Object.entries(plan.records))if(localStorage.getItem('ads:'+key)!==JSON.stringify(value))throw new Error('Saved Foundation settings could not be verified. Keep this page open and retry.');
     window.ADSFoundation?.apply();
    }
    row.dataset.state='complete';row.textContent=stages[index][1];$('setupBuildProgress').value=index+1;if(rows[index+1]){rows[index+1].dataset.state='working';$('conversationDraftStatus').textContent=stages[index+1][0];}await paint();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)await row.animate([{opacity:.45},{opacity:1}],{duration:240}).finished;
   }
   $('setupBuildTitle').textContent='Your design system is ready';$('setupBuildCopy').textContent=answers.project+' is set up with your brand and Foundation choices. You can refine every setting in your workspace.';$('setupBuildDone').hidden=false;$('conversationDraftStatus').textContent='Project and all 8 Foundations saved.';url('saved');$('setupBuild').classList.add('is-complete');
  }catch(error){
   const row=rows.find(row=>row.dataset.state==='working');if(row){row.dataset.state='error';row.textContent='Setup needs attention';}
   $('setupBuildTitle').textContent=committed?'Project saved — review needed':'We couldn’t finish setup';$('setupBuildError').textContent=error.message+(committed?' Your project is saved; retrying will not create a duplicate.':' Your answers are still here.');$('setupBuildRetry').hidden=false;$('conversationDraftStatus').textContent='Setup paused. Review the message and retry when ready.';
  }finally{busy=false;$('setupBuild').removeAttribute('aria-busy');$('cancelConversation').disabled=false;}
 }
 choice.addEventListener('click',()=>{try{start(false);}catch(error){$('conversationDraftStatus').textContent=error.message;}});
 $('chatAnswerForm').addEventListener('submit',async event=>{
  event.preventDefault();if(conflict||busy||replying||recoveryPending)return;
  const candidate={...answers,...snapshotInput()},error=M.error(current,candidate);
  if(error){if(candidate[current]==='Other'&&$('conversationOther')){const radio=$('conversationOptions').querySelector('input[value=Other]');radio.checked=true;const reply=$('chatReply');if(reply)reply.value='';inputChanged();$('conversationOther').querySelector('textarea').focus({preventScroll:true});}$('conversationError').textContent=error;$('conversationInput').querySelector('textarea:not([disabled])')?.setAttribute('aria-invalid','true');return;}
  $('conversationError').textContent='';answers=candidate;if(current==='brandColor')answers.brandColor=answers.brandColor.toUpperCase();if(!answered.includes(current))answered.push(current);delete pendingAnswers[current];
  const next=questions.find(q=>!answered.includes(q.key));current=next?.key||'';pending={...(pendingAnswers[current]||{})};saveDraft();pinAnswers();transcript();
  replying=true;if($('continueSelection'))$('continueSelection').disabled=true;$('chatAnswerForm').inert=true;$('sendAnswer').disabled=true;$('conversationTurn').hidden=true;$('assistantTyping').hidden=false;$('conversationInput').querySelectorAll('textarea').forEach(input=>{input.value='';});scrollChat();
  await new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches?0:280));
  replying=false;$('chatAnswerForm').inert=false;
  if(next)renderQuestion(true);else review();
 });
 function inputChanged(event){
  if(busy||replying||conflict)return;
  if(event?.target.matches('input[type=radio]')&&$('chatReply'))$('chatReply').value='';
  if(['productType','role'].includes(current)){const selected=$('conversationOptions').querySelector('input:checked')?.value,extra=$('conversationOther'),reply=$('chatReply');extra.hidden=selected!=='Other';extra.querySelector('textarea').disabled=extra.hidden;reply.closest('label').hidden=!extra.hidden;reply.disabled=!extra.hidden;}
  pending={...snapshotInput()};if($('chatReply'))pending.chatReply=$('chatReply').value;pendingAnswers[current]={...pending};
  if(!M.error(current,{...answers,...pending})){$('conversationError').textContent='';$('conversationInput').querySelectorAll('[aria-invalid]').forEach(input=>input.removeAttribute('aria-invalid'));}
  if(event?.target.tagName==='TEXTAREA')queueDraft();else saveDraft();updateSelection();
  $('conversationInput').querySelectorAll('textarea').forEach(input=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,140)+'px';});
 }
 $('chatAnswerForm').addEventListener('input',inputChanged);
 $('conversationOptions').addEventListener('input',inputChanged);
 $('conversationOptions').addEventListener('change',event=>{const q=questions.find(q=>q.key===current);if(q?.type==='choice'&&event.target.value!=='Other')$('chatAnswerForm').requestSubmit();else if(event.target.value==='Other')$('conversationOther')?.querySelector('textarea').focus({preventScroll:true});});
 $('conversationOptions').addEventListener('click',event=>{if(event.target.matches('input[type=radio]')&&event.target.checked&&!replying){if($('chatReply'))$('chatReply').value='';if(event.target.value!=='Other')$('chatAnswerForm').requestSubmit();}});
 $('chatAnswerForm').addEventListener('keydown',event=>{if(event.target.tagName==='TEXTAREA'&&event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();$('chatAnswerForm').requestSubmit();}});
 $('togglePinnedAnswers').addEventListener('click',()=>{$('conversationPinned').open=wideBrief.matches||!$('conversationPinned').open;$('togglePinnedAnswers').setAttribute('aria-expanded',String($('conversationPinned').open));if($('conversationPinned').open)($('pinnedAnswers').querySelector('button')||$('conversationPinned').querySelector('summary')).focus();});
 $('conversationPinned').querySelector('summary').addEventListener('click',event=>{if(wideBrief.matches)event.preventDefault();});
 $('conversationPinned').addEventListener('toggle',()=>$('togglePinnedAnswers').setAttribute('aria-expanded',String($('conversationPinned').open)));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('conversationPinned').open){closePins();$('togglePinnedAnswers').focus();}});
 $('conversationPrevious').addEventListener('click',()=>{const index=questions.findIndex(q=>q.key===current);if(index>0)edit(questions[index-1].key);});
 $('changeConversation').addEventListener('click',()=>edit('project'));$('confirmConversation').addEventListener('click',runSetup);$('retrySetup').addEventListener('click',runSetup);$('backToSummary').addEventListener('click',()=>review());
 $('editProjectSetup').addEventListener('click',()=>window.ADSNavigation.go('project-setup.html?edit=1'));
 $('cancelConversation').addEventListener('click',()=>{if(busy)return;stopDraftSave();try{if(localStorage.getItem(P.DRAFT)===expectedDraftRaw)localStorage.removeItem(P.DRAFT);window.ADSNavigation ? window.ADSNavigation.go('new-project.html'+(profile?'?saved=1':'')) : (location.href = 'new-project.html'+(profile?'?saved=1':''));}catch{$('conversationDraftStatus').textContent='Could not discard the draft. Your saved project is unchanged.';}});
 $('reloadConversation').addEventListener('click',()=>window.ADSNavigation?window.ADSNavigation.reload():location.reload());
 window.addEventListener('storage',event=>{if(![null,P.KEY,P.DRAFT].includes(event.key)&&!(editing&&P.PROJECT_FOUNDATIONS.includes(event.key)))return;markConflict();});
 let rawDraft=null;try{rawDraft=localStorage.getItem(P.DRAFT);expectedDraftRaw=rawDraft;}catch(error){pendingRecovery??={kind:'draft',message:'Browser storage is unavailable. Your answers cannot be saved.'};}
 if(rawDraft!==null){try{cachedDraft=M.readDraft(rawDraft);}catch(error){cachedDraft=null;}if(!cachedDraft)pendingRecovery??={kind:'draft',message:'Your saved draft could not be read. Back it up or discard it to continue.'};}
 const explicit=['new','edit','saved','resume'].some(key=>params.get(key)==='1');
 if(explicit&&pendingRecovery){const issue=pendingRecovery;pendingRecovery=null;recover(issue.kind,issue.message);}
 else if(params.get('new')==='1'||params.get('resume')==='1')start(false);
 else if(profile&&params.get('edit')==='1'){try{start(true);}catch(error){reveal();$('conversationDraftStatus').textContent=error.message;}}
 else if(profile&&params.get('saved')==='1')saved();
})();
