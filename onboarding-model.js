/* Deterministic conversational setup shared by the UI and regression checks. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./project-model.js'):root.ADSProject,typeof module==='object'&&module.exports?require('./foundation-model.js'):root.ADSFoundationModel);if(typeof module==='object'&&module.exports)module.exports=api;else root.ADSOnboardingModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P,F){
 'use strict';
 const questions=[
  {key:'project',label:'Project name',question:'What should we call your project?',help:'Give your design system a name that your team will recognize.',type:'text',placeholder:'e.g. Claims customer portal'},
  {key:'productType',label:'Product type',question:'What kind of product are you building?',help:'This helps us recommend a layout and typography for your business.',type:'choice',options:P.PRODUCTS.map(value=>({value,label:value}))},
  {key:'platforms',label:'Platforms',question:'Where will people use your product?',help:'Select every platform you need, then choose Continue below. We’ll include guidance for each one.',type:'multiple',options:Object.entries(P.PLATFORMS).map(([value,p])=>({value,label:p.label}))},
  {key:'name',label:'Your name',question:'What’s your name?',help:'We’ll keep this with the project so your team can identify its owner.',type:'text',autocomplete:'name',placeholder:'Your full name'},
  {key:'email',label:'Email',question:'What’s your email address?',help:'For your project details. No invitation or email will be sent.',type:'email',autocomplete:'email',placeholder:'you@company.com'},
  {key:'designation',label:'Designation',question:'What’s your designation?',help:'Tell us your job title or area of responsibility.',type:'text',autocomplete:'organization-title',placeholder:'e.g. Product designer'},
  {key:'role',label:'Project role',question:'What’s your role in this project?',help:'We’ll tailor the handoff guidance to how you’ll use the system.',type:'choice',options:P.ROLES.map(value=>({value,label:value}))},
  {key:'brandColor',label:'Brand color',question:'What’s your primary brand color?',help:'Choose a color or enter its six-digit hex value. You can also keep the default red to start.',type:'color',placeholder:'#FF031A'},
  {key:'spacingSystem',label:'Spacing',question:'How much room should your interface give people?',help:'Choose a spacing rhythm for your content and tasks.',type:'choice',options:[{value:'recommended',label:'Recommend for my product',description:'Use your product and platform context.'},{value:'4px',label:'Compact',description:'A tighter rhythm for information-rich screens.'},{value:'8px',label:'Comfortable',description:'More breathing room between related elements.'},{value:'2px',label:'Fine',description:'A fine-grained rhythm for very dense interfaces.'},{value:'adaptive',label:'Adaptive',description:'Scale the spacing rhythm with the size of each gap.'}]},
  {key:'cornerStyle',label:'Corners',question:'What should the corners feel like?',help:'This choice sets the corner-radius family across your components.',type:'choice',options:[{value:'sharp',label:'Precise',description:'Subtle corners: 2 / 4 / 8px.'},{value:'compact',label:'Compact',description:'Tighter corners: 2 / 6 / 12px.'},{value:'balanced',label:'Balanced',description:'Familiar corners: 4 / 8 / 16px.'},{value:'soft',label:'Soft',description:'Softer corners: 4 / 12 / 20px.'},{value:'expressive',label:'Expressive',description:'Bold corners: 8 / 16 / 32px.'}]},
  {key:'iconStyle',label:'Icons',question:'Which icon style fits your product?',help:'You can refine individual icon settings later in Foundations.',type:'choice',options:[{value:'line',label:'Line',description:'Clean outlines with a light visual weight.'},{value:'flat',label:'Flat',description:'Solid shapes with clear silhouettes.'},{value:'duotone',label:'Duotone',description:'Two tones for additional depth and emphasis.'},{value:'dashed',label:'Dashed'},{value:'twotone',label:'Two-tone'},{value:'isometric',label:'Isometric'},{value:'3d',label:'3D'}]}
 ];
 function error(key,a){
  if(['project','productType','platforms','name','email','designation','role'].includes(key))return P.validate(a)[key]||(key==='productType'?P.validate(a).productOther:key==='role'?P.validate(a).roleOther:'')||'';
  if(key==='brandColor')return /^#[0-9a-f]{6}$/i.test(a[key]||'')?'':'Enter a six-digit hex color, such as #1357AB.';
  const q=questions.find(q=>q.key===key);return q?.options?.some(o=>o.value===a[key])?'':'Choose an option to continue.';
 }
 function display(key,a){const q=questions.find(q=>q.key===key);if(key==='platforms')return (a.platforms||[]).map(v=>P.PLATFORMS[v]?.label).filter(Boolean).join(', ');if(key==='productType'&&a[key]==='Other')return a.productOther||'Other';if(key==='role'&&a[key]==='Other')return a.roleOther||'Other';return q?.options?.find(o=>o.value===a[key])?.label||String(a[key]||'');}
 function validate(a){return Object.fromEntries(questions.map(q=>[q.key,error(q.key,a)]).filter(([,e])=>e));}
 function buildPlan(a,existing={}){
  const errors=validate(a);if(Object.keys(errors).length)throw new Error(Object.values(errors)[0]);
  const records={};for(const key of F.recordKeys)records[key]={...(existing[key]||{})};
  for(const key of ['typography','grid-layout','spacing'])records[key]={...(F.contextualDefault(key,a)||{}),...(existing[key]||{})};
  records.typography={headingScaleVersion:F.headingScaleVersion,levels:F.typeDefaults,...records.typography};
  records['grid-layout']={system:'columns',columns:12,gutter:24,baseline:false,...records['grid-layout']};
  const color={hex:a.brandColor.toUpperCase()};records.colors={...records.colors,light:{...records.colors.light,primary:color},dark:{...records.colors.dark,primary:color}};
  records.spacing={...records.spacing,system:a.spacingSystem==='recommended'?(F.contextualDefault('spacing',a)?.system||'4px'):a.spacingSystem};
  records.radius={...records.radius,philosophy:a.cornerStyle};
  records.icons={size:24,stroke:2,corner:'round',...records.icons,system:a.iconStyle};
  records.sizing={...F.sizingDefaults,...records.sizing};records.border={width:1,style:'solid',sides:'all',...records.border};records.shadow={...records.shadow};records.units={unit:'px',...records.units};records['data-format']={...F.dataDefaults,...records['data-format']};
  for(const key of Object.keys(records))records[key]=F.migrateRecord(key,records[key]);
  // Both themes resolve before any durable project or Foundation record is changed.
  const light=F.resolve(records,'light',a),dark=F.resolve(records,'dark',a);
  return {records,light,dark};
 }
 function readDraft(raw){
  const draft=P.read({getItem:()=>raw},P.DRAFT);if(!draft)return null;
  const meta=draft.conversation;
  if(meta&&(meta.version!==1||(meta.baseRaw!==undefined&&meta.baseRaw!==null&&typeof meta.baseRaw!=='string')||(meta.pending!=null&&(typeof meta.pending!=='object'||Array.isArray(meta.pending)))||!Array.isArray(meta.answered)||new Set(meta.answered).size!==meta.answered.length||meta.answered.some(key=>!questions.some(q=>q.key===key))))throw new Error('This conversation draft could not be read. Back it up or discard it to continue.');
  const pendingAnswers=meta?.pendingAnswers||{};
  if(typeof pendingAnswers!=='object'||Array.isArray(pendingAnswers)||Object.entries(pendingAnswers).some(([key,value])=>!questions.some(q=>q.key===key)||!value||typeof value!=='object'||Array.isArray(value)))throw new Error('This conversation draft could not be read. Back it up or discard it to continue.');
  const answered=meta?meta.answered:questions.filter(q=>!error(q.key,draft)).map(q=>q.key);
  const answers={};for(const key of [...questions.map(q=>q.key),'productOther','roleOther'])if(draft[key]!==undefined)answers[key]=draft[key];
  return {answers,answered:answered.filter(key=>!error(key,draft)),newProject:draft.newProject!==false,current:meta?.current,pending:meta?.pending||{},pendingAnswers,baseRaw:meta?.baseRaw,foundationBaseline:meta?.foundationBaseline||{}};
 }
 function savedAnswers(profile,records={}){
  const defaults={brandColor:records.colors?.light?.primary?.hex||'#FF031A',spacingSystem:records.spacing?.system||'recommended',cornerStyle:records.radius?.philosophy||'balanced',iconStyle:records.icons?.system||'line'};
  const result={};for(const key of [...questions.map(q=>q.key),'productOther','roleOther'])result[key]=profile[key]??defaults[key]??(key==='platforms'?[]:'');
  return result;
 }
 function buildUpdate(answers,before,existing={}){
  if(Object.keys(validate(answers)).length)throw new Error('Review the highlighted fields before saving.');
  const changed=key=>JSON.stringify(Array.isArray(answers[key])?[...answers[key]].sort():answers[key])!==JSON.stringify(Array.isArray(before[key])?[...before[key]].sort():before[key]);
  const records={};
  if(changed('brandColor')){
   const prior=existing.colors||{},primary={hex:answers.brandColor.toUpperCase()};
   records.colors={...prior,light:{...prior.light,primary:{...prior.light?.primary,...primary}}};
   // Onboarding starts with a matching dark brand. Keep that pair in sync,
   // while preserving any distinct dark palette customized in Foundations.
   if(!prior.dark?.primary?.hex||prior.dark.primary.hex.toUpperCase()===(prior.light?.primary?.hex||before.brandColor).toUpperCase())records.colors.dark={...prior.dark,primary:{...prior.dark?.primary,...primary}};
  }
  if(changed('spacingSystem')||(answers.spacingSystem==='recommended'&&(changed('productType')||changed('platforms'))))records.spacing={...existing.spacing,system:answers.spacingSystem==='recommended'?(F.contextualDefault('spacing',answers)?.system||'4px'):answers.spacingSystem};
  if(changed('cornerStyle'))records.radius={...existing.radius,philosophy:answers.cornerStyle};
  if(changed('iconStyle'))records.icons={...existing.icons,system:answers.iconStyle};
  for(const key of Object.keys(records)){
   records[key]=F.migrateRecord(key,records[key]);
   if(!F.validRecord(key,records[key]))throw new Error('The '+key+' Foundation needs review before updating setup.');
  }
  return records;
 }
 return {questions,error,display,validate,buildPlan,readDraft,savedAnswers,buildUpdate};
});
