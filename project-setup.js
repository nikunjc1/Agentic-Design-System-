/* Review and edit saved onboarding answers without replaying initial setup. */
(() => {
 'use strict';
 const P=window.ADSProject,M=window.ADSOnboardingModel,F=window.ADSFoundationModel,$=id=>document.getElementById(id);
 const groups=[['Project details','The product you’re building and where people will use it.',['project','productType','platforms']],['About you','The person and role associated with this project.',['name','email','designation','role']],['Design choices','Change a choice here to update its foundation. Refine detailed settings in Foundations.',['brandColor','spacingSystem','cornerStyle','iconStyle']]];
 const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 let profile,before,raw,records={},foundationBaseline={},draftRaw,dirty=false,conflict=false;
 function status(message){$('setupFeedback').textContent=message;}
 function read(){
  raw=localStorage.getItem(P.KEY);profile=P.read(localStorage);draftRaw=localStorage.getItem(P.DRAFT);
  records={};foundationBaseline={};
  for(const key of P.PROJECT_FOUNDATIONS){const value=localStorage.getItem(key);foundationBaseline[key]=value;const inspected=F.inspectRecord(key.slice(4),value);if(['valid','migrated'].includes(inspected.status))records[key.slice(4)]=inspected.value;}
  if(profile)before=M.savedAnswers(profile,records);
 }
 function section(title,description){const section=node('section','','setup-panel');const h=node('h2',title);section.append(h,node('p',description,'setup-help'));return section;}
 function show(){
  dirty=false;conflict=false;$('setupEditForm').hidden=true;$('setupDetails').hidden=!profile;$('setupEmpty').hidden=!!profile;$('editSetup').hidden=!profile||!!draftRaw;$('setupDraft').hidden=!profile||!draftRaw;
  $('setupDetails').replaceChildren();if(!profile)return;
  for(const [title,description,keys]of groups){const part=section(title,description),list=node('dl','','project-setup-values');
   for(const key of keys){const q=M.questions.find(q=>q.key===key),row=node('div'),value=node('dd',M.display(key,before)||'Not provided');row.dataset.setupAnswer=key;
    if(key==='brandColor'&&/^#[0-9a-f]{6}$/i.test(before[key])){const swatch=node('span','','project-setup-swatch');swatch.style.backgroundColor=before[key];swatch.setAttribute('aria-hidden','true');value.prepend(swatch);}
    row.append(node('dt',q.label),value);list.append(row);
   }part.append(list);$('setupDetails').append(part);
  }
 }
 function values(){const data=new FormData($('setupEditForm')),a={};for(const q of M.questions)a[q.key]=q.type==='multiple'?data.getAll(q.key):String(data.get(q.key)||'').trim();for(const key of ['productOther','roleOther'])a[key]=String(data.get(key)||'').trim();a.brandColor=a.brandColor.toUpperCase();if(a.productType!=='Other')a.productOther='';if(a.role!=='Other')a.roleOther='';return a;}
 function errors(all){for(const q of M.questions){const message=all[q.key]||'';$('error-'+q.key).textContent=message;document.querySelectorAll('#setupEditForm [name="'+q.key+'"]').forEach(n=>n.setAttribute('aria-invalid',String(!!message)));}return Object.keys(all).length;}
 function otherFields(){for(const [key,extra]of [['productType','productOther'],['role','roleOther']]){const field=$('field-'+extra);field.hidden=$('setup-'+key).value!=='Other';field.querySelector('input').disabled=field.hidden;}}
 function edit(){
  if(!profile||draftRaw||conflict)return;
  $('setupFields').replaceChildren();
  for(const [title,description,keys]of groups){const part=section(title,description),fields=node('div','','setup-fields');
   for(const key of keys){const q=M.questions.find(q=>q.key===key),field=node(q.type==='multiple'?'fieldset':'div','',q.type==='multiple'?'project-platforms':'setup-field');
    const label=node(q.type==='multiple'?'legend':'label',q.label);if(q.type!=='multiple')label.htmlFor='setup-'+key;field.append(label);
    if(q.type==='multiple'){const options=node('div','','project-platform-options');for(const option of q.options){const choice=node('label'),input=node('input');input.type='checkbox';input.name=key;input.value=option.value;input.checked=before[key].includes(option.value);input.setAttribute('aria-describedby','error-'+key);choice.append(input,node('span',option.label));options.append(choice);}field.append(options);}
    else{const input=node(q.type==='choice'?'select':'input');input.id='setup-'+key;input.name=key;input.required=true;input.setAttribute('aria-describedby','error-'+key);
     if(q.type==='choice'){for(const option of q.options){const o=node('option',option.label);o.value=option.value;input.append(o);}}
     else{input.type=q.type==='email'?'email':'text';input.maxLength=q.type==='email'?254:100;input.autocomplete=q.autocomplete||'off';if(q.type==='color'){input.pattern='#[0-9A-Fa-f]{6}';input.maxLength=7;input.spellcheck=false;}}
     input.value=before[key]||'';field.append(input);
    }
    const error=node('p','','project-setup-error');error.id='error-'+key;field.append(error);fields.append(field);
    if(['productType','role'].includes(key)){const extra=key==='role'?'roleOther':'productOther',wrap=node('div','','setup-field');wrap.id='field-'+extra;const l=node('label',key==='role'?'Describe your role':'Describe your product');l.htmlFor='setup-'+extra;const input=node('input');input.type='text';input.id='setup-'+extra;input.name=extra;input.value=before[extra]||'';input.maxLength=100;input.required=true;input.setAttribute('aria-describedby','error-'+key);wrap.append(l,input);fields.append(wrap);}
   }part.append(fields);$('setupFields').append(part);
  }
  otherFields();$('setupDetails').hidden=true;$('setupEditForm').hidden=false;$('editSetup').hidden=true;$('saveSetup').disabled=true;dirty=false;status('');$('setupEditStatus').textContent='Changes are saved when you choose Save changes.';$('setup-project').focus();
 }
 $('editSetup').addEventListener('click',edit);
 $('cancelSetup').addEventListener('click',()=>{try{read();show();status('Changes discarded. Your saved setup is unchanged.');$('editSetup').focus();}catch(error){status(error.message);}});
 $('setupEditForm').addEventListener('input',()=>{otherFields();const a=values();dirty=JSON.stringify(a)!==JSON.stringify(before);$('saveSetup').disabled=!dirty||conflict;$('setupEditStatus').textContent=conflict?'Project settings changed elsewhere. Cancel to load the latest version.':dirty?'Unsaved changes':'No changes to save';for(const q of M.questions)if(!M.error(q.key,a)){$('error-'+q.key).textContent='';document.querySelectorAll('#setupEditForm [name="'+q.key+'"]').forEach(n=>n.removeAttribute('aria-invalid'));}});
 $('setupEditForm').addEventListener('submit',event=>{
  event.preventDefault();if(!dirty||conflict)return;
  const answers=values(),invalid=M.validate(answers);if(errors(invalid)){status('Review the highlighted fields before saving.');$('setupEditForm').querySelector('[aria-invalid=true]')?.focus();return;}
  try{
   const changes=M.buildUpdate(answers,before,records);
   for(const key of Object.keys(changes)){const inspected=F.inspectRecord(key,foundationBaseline['ads:'+key]);if(!['missing','valid','migrated'].includes(inspected.status))throw new Error('Review the saved '+key+' Foundation before changing it here.');}
   P.save(localStorage,{...profile,...answers},{expectedRaw:raw,expectedDraftRaw:draftRaw,expectedFoundations:foundationBaseline,foundationRecords:changes});
   window.ADSFoundation?.apply();read();show();status('Project setup saved.');$('editSetup').focus();
  }catch(error){status(error.message);}
 });
 window.addEventListener('storage',event=>{if(event.key===null||[P.KEY,P.DRAFT,...P.PROJECT_FOUNDATIONS].includes(event.key)){if(!$('setupEditForm').hidden){conflict=true;$('saveSetup').disabled=true;status('Project settings changed in another tab. Your edits are still here. Cancel to load the latest version.');}else{try{read();show();}catch(error){status(error.message);}}}});
 window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
 try{read();show();if(new URLSearchParams(location.search).get('edit')==='1')edit();}catch(error){status(error.message);$('editSetup').hidden=true;}
})();
