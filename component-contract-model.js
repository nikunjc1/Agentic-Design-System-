/* Platform-neutral component definitions. No DOM, network or framework dependency. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ADSComponentContract=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const VERSION=1,PREFIX='ads:component-contract:',TYPES=['text','boolean','options','number','swap','slot','event'];
  const TAGS=['div','span','button','label','input','textarea','select','option','p','h1','h2','h3','h4','h5','h6','ul','ol','li','section','article','header','footer','nav','a','img','strong','small','progress','table','thead','tbody','tr','th','td','svg','path','circle','rect','line','polyline','polygon','g','ellipse','figure','figcaption'];
  const clone=value=>JSON.parse(JSON.stringify(value));
  const id=value=>String(value).toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/^-|-$/g,'')||'component';
  function validate(c,level=0){
    if(level>5)return ['Reusable component nesting exceeds five levels.'];
    const errors=[],fail=message=>errors.push(message),plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
    if(!plain(c))return ['A component contract must be an object.'];
    if(c.schemaVersion!==VERSION)fail('Unsupported component schema version; keep the original file.');
    if(!/^[a-z0-9][a-z0-9_-]{0,119}$/.test(c.id||''))fail('Use a stable component ID of letters, numbers, hyphens or underscores.');
    if(typeof c.name!=='string'||!c.name.trim()||c.name.length>120)fail('Component name is required (120 characters maximum).');
    if(!Number.isInteger(c.revision)||c.revision<0)fail('Revision must be a nonnegative integer.');
    if(!['contract','figma'].includes(c.authority))fail('Choose Contract or Figma as the authoring source.');
    if(!Array.isArray(c.properties)||c.properties.length>80)return ['Properties must be a list of at most 80 definitions.'];
    if(!Array.isArray(c.variants)||c.variants.length>2048)return ['Variants must be a list of at most 2048 definitions.'];
    if(!plain(c.selection)||!plain(c.tokens))fail('Selection and tokens must be objects.');
    const propertyIds=new Set(),nodes=new Set(),forbidden=new Set(['__proto__','prototype','constructor']);let count=0;
    function safe(value,depth=0){if(depth>40){fail('Contract nesting exceeds 40 levels.');return;}if(value&&typeof value==='object')for(const [key,v]of Object.entries(value)){if(forbidden.has(key))fail('Reserved object key: '+key);safe(v,depth+1);}}
    safe(c);
    function tokenReferences(token,chain=[]){if(chain.includes(token)){fail('Cyclic token reference: '+[...chain,token].join(' → '));return;}const value=c.tokens?.[token];if(typeof value!=='string'){fail('Token '+token+' must have a string value.');return;}if(/[<>{};]|url\s*\(|@import/i.test(value))fail('Unsupported token value: '+token);for(const match of value.matchAll(/var\(\s*(--[\w-]+)/g)){if(!(match[1] in c.tokens))fail('Unresolved token '+match[1]);else if(chain.length<30)tokenReferences(match[1],[...chain,token]);else fail('Token reference chain is too long.');}}
    for(const token of Object.keys(c.tokens||{}))tokenReferences(token);
    function validValue(p,v){return p.type==='boolean'?typeof v==='boolean':p.type==='number'?typeof v==='number'&&Number.isFinite(v)&&(p.min==null||v>=p.min)&&(p.max==null||v<=p.max):p.type==='options'?Array.isArray(p.options)&&p.options.length>0&&(p.multiple?Array.isArray(v)&&v.length>0&&v.every(x=>p.options.includes(x)):p.options.includes(v)):typeof v==='string';}
    for(const p of c.properties||[]){
      if(!plain(p)){fail('Invalid property definition.');continue;}
      if(!/^[a-zA-Z][\w-]{0,79}$/.test(p.id||'')||forbidden.has(p.id)||propertyIds.has(p.id))fail('Property IDs must be unique and non-reserved: '+p.id);propertyIds.add(p.id);
      if(typeof p.name!=='string'||!p.name.trim()||!TYPES.includes(p.type))fail('A property needs a name and supported type: '+p.id);
      if(!validValue(p,p.default))fail('Invalid default for '+p.id);
      if(c.selection&&p.id in c.selection&&!validValue(p,c.selection[p.id]))fail('Invalid selected value for '+p.id);
      if(p.type==='options'&&(!Array.isArray(p.options)||new Set(p.options).size!==p.options.length||p.options.some(x=>typeof x!=='string'&&typeof x!=='number')))fail('Options must be unique strings or numbers: '+p.id);
    }
    const tags=new Set(TAGS);
    function walk(n,depth=0){
      if(!plain(n)||depth>24||++count>1500){fail('Anatomy must contain at most 1500 nodes and 24 levels.');return;}
      if(!/^[a-zA-Z][\w-]{0,119}$/.test(n.id||'')||forbidden.has(n.id)||nodes.has(n.id))fail('Part IDs must be unique and non-reserved: '+n.id);nodes.add(n.id);
      if(!['container','text','icon','slot','instance','shape'].includes(n.kind))fail('Unknown anatomy kind: '+n.kind);
      if(n.tag&&!tags.has(n.tag))fail('Unsupported element: '+n.tag);
      if(n.bind&&!propertyIds.has(n.bind))fail('Unknown text property: '+n.bind);
      for(const [attribute,property]of Object.entries(n.attributeBindings||{}))if(!/^(aria-[\w-]+|title|value|placeholder|disabled|checked|required|readonly|alt|min|max|step|rows|maxlength)$/.test(attribute)||!propertyIds.has(property))fail('Invalid attribute binding on '+n.id);
      for(const prop of Object.values(n.styleBindings||{}))if(!propertyIds.has(prop))fail('Unknown style property: '+prop);
      if(n.visibleWhen&&!Array.isArray(n.visibleWhen))fail('Visibility conditions must be a list.');else for(const condition of n.visibleWhen||[]){const p=c.properties.find(p=>p.id===condition?.property);if(!p)fail('Unknown visibility property: '+condition?.property);else if(!validValue({...p,multiple:false},condition.equals))fail('Invalid visibility value for '+p.id);}
      if(n.hiddenWhen&&!Array.isArray(n.hiddenWhen))fail('Hidden conditions must be a list.');else for(const condition of n.hiddenWhen||[]){const p=c.properties.find(p=>p.id===condition?.property);if(!p)fail('Unknown visibility property: '+condition?.property);else if(!validValue({...p,multiple:false},condition.equals))fail('Invalid visibility value for '+p.id);}
      for(const [key,value]of Object.entries(n.styles||{})){
        if(!/^(?:--[\w-]+|[a-z][A-Za-z-]*)$/.test(key)||typeof value!=='string'||/[<>{};]|url\s*\(|expression\s*\(|@import/i.test(value))fail('Unsupported style on '+n.id+': '+key);
        for(const token of String(value).matchAll(/var\(\s*(--[\w-]+)/g))if(!(token[1] in (c.tokens||{})))fail('Unresolved token '+token[1]+' on '+n.id);
      }
      for(const [key,value]of Object.entries(n.attributes||{})){
        if(!/^(?:aria-[\w-]+|id|for|name|readonly|required|maxlength|minlength|role|title|type|value|placeholder|disabled|checked|tabindex|href|src|alt|viewBox|d|cx|cy|r|x|y|x1|x2|y1|y2|width|height|rx|ry|points|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|xmlns|max|min|step|rows|colspan|rowspan)$/.test(key)||typeof value!=='string'||((key==='href'||key==='src')&&!/^(?:https?:|#|data:image\/(?:png|jpeg|webp|gif);base64,|[a-zA-Z0-9_.-]+(?:\/|$))/.test(value)))fail('Unsupported attribute '+key+' on '+n.id);
      }
      if(n.children&&!Array.isArray(n.children))fail('Children must be a list on '+n.id);else for(const child of n.children||[])walk(child,depth+1);
    }
    walk(c.anatomy);
    const variantIds=new Set();
    for(const variant of c.variants||[]){
      if(!variant.id||variantIds.has(variant.id))fail('Variant IDs must be unique.');variantIds.add(variant.id);
      for(const [key,value]of Object.entries(variant.when||{})){const p=(c.properties||[]).find(p=>p.id===key);if(!p||!validValue(p,value))fail('Invalid variant condition: '+key);}
      for(const [nodeId,override]of Object.entries(variant.overrides||{})){if(!nodes.has(nodeId))fail('Unknown variant part '+nodeId);else walkOverride(override,nodeId);}
    }
    function walkOverride(override,nodeId){if(override.reference!==undefined&&typeof override.reference!=='string')fail('Variant component references must be string IDs.');const original=nodes;const synthetic={id:'validation-override-'+nodeId,kind:'container',tag:override.tag,visibleWhen:override.visibleWhen,styles:override.styles||{},attributes:Object.fromEntries(Object.entries(override.attributes||{}).filter(([,value])=>value!==null))};walk(synthetic);count--;original.delete(synthetic.id);}
    if(c.behaviors&&!Array.isArray(c.behaviors))fail('Behavior rules must be a list.');else for(const behavior of c.behaviors||[]){if(!nodes.has(behavior.target)||!propertyIds.has(behavior.property)||!['click','change','input'].includes(behavior.event))fail('Behavior must reference a part, event and property.');else {const p=c.properties.find(p=>p.id===behavior.property);if(behavior.value==='$toggle'?p.type!=='boolean':behavior.value!=='$value'&&!validValue(p,behavior.value))fail('Invalid behavior value.');}}
    for(const [reference,definition]of Object.entries(c.references||{}))for(const error of validate(definition,level+1))fail('Reference '+reference+': '+error);
    if(c.selection)for(const key of Object.keys(c.selection))if(!propertyIds.has(key))fail('Unknown selected property '+key);
    return [...new Set(errors)];
  }
  function assert(c){const errors=validate(c);if(errors.length)throw new Error(errors.join('\n'));return c;}
  // Kept self-contained so standalone code exports use this exact compiler.
  function compile(c,selection,options){
    const values=Object.fromEntries(c.properties.map(p=>[p.id,p.default]));Object.assign(values,c.selection,selection||{});
    const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b),matches=when=>Object.entries(when||{}).every(([key,value])=>equal(values[key],value));
    const overrides={};for(const v of c.variants)if(matches(v.when))for(const [id,patch]of Object.entries(v.overrides||{}))overrides[id]={...(overrides[id]||{}),...patch,styles:{...(overrides[id]?.styles||{}),...(patch.styles||{})}};
    function node(n){
      const patch=overrides[n.id]||{},styles={...n.styles,...patch.styles},attributes={...n.attributes};for(const [key,value]of Object.entries(patch.attributes||{}))if(value===null)delete attributes[key];else attributes[key]=value;
      for(const [attribute,property]of Object.entries(n.attributeBindings||{})){if(['disabled','checked','required','readonly'].includes(attribute)){if(values[property])attributes[attribute]='';else delete attributes[attribute];}else attributes[attribute]=String(values[property]??'');}
      for(const [css,prop]of Object.entries({...n.styleBindings,...patch.styleBindings})){if(prop===null)continue;const value=values[prop];styles[css]=typeof value==='number'?value+(['opacity','fontWeight','flexGrow','flexShrink','order','zIndex'].includes(css)?'':'px'):String(value);}
      const testRule=rule=>{const match=Array.isArray(values[rule.property])?values[rule.property].includes(rule.equals):equal(values[rule.property],rule.equals);return rule.not?!match:match;};
      const visible=patch.visible!==false&&(patch.visibleWhen||n.visibleWhen||[]).every(testRule)&&!(n.hiddenWhen?.length&&n.hiddenWhen.every(testRule));
      if(!visible&&!options?.includeHidden)return null;
      const text=patch.text??(n.bind&&n.kind!=='instance'?String(values[n.bind]??''):n.text||'');
      if(n.kind==='icon'&&n.bind){attributes['aria-hidden']='true';}
      const tag=patch.tag||n.tag;
      if(tag==='button'){attributes.type=attributes.type||'button';if(values.state==='disabled'||values.state==='loading'||values.disabled===true)attributes.disabled='';if(values.state==='loading')attributes['aria-busy']='true';if(values.accessibleLabel)attributes['aria-label']=String(values.accessibleLabel);}
      if(tag==='input'&&n.bind){if(typeof values[n.bind]==='boolean'){if(values[n.bind])attributes.checked='';else delete attributes.checked;}else attributes.value=text;}
      const reference=patch.reference??n.reference??(n.kind==='instance'&&n.bind?values[n.bind]:null);
      if(reference&&c.references?.[reference]){const nested=compile(c.references[reference],n.props||{},options).tree;if(nested){function prefix(part){part.id=n.id+'--'+part.id;for(const child of part.children)prefix(child);}prefix(nested);return {...nested,id:n.id,name:n.name||nested.name,kind:'instance',reference,styles:{...c.references[reference].tokens,...nested.styles,...styles},attributes:{...nested.attributes,...attributes},visible,inputRole:n.inputRole};}}
      // inputRole is a plain pass-through, read by adapter.js to size a
      // plain text/span "value" part the same way a real <input>'s value
      // truncates to its available width (see figma-plugin/adapter.js) -
      // compile() used to drop it, so any contract-authored node marked
      // inputRole (not one of adapter.js's own synthesized input children,
      // which are built after compile() and never lose it) silently fell
      // back to hugging its own text width instead.
      return {id:n.id,name:n.name||n.id,kind:n.kind,visible,tag:tag||(n.kind==='text'?'span':'div'),styles,attributes,text,reference,exposeProperties:Boolean(n.exposeProperties),inputRole:n.inputRole,children:(n.children||[]).map(node).filter(Boolean)};
    }
    return {id:c.id,revision:c.revision,values,tree:node(c.anatomy)};
  }
  function diff(before,after,path=''){
    if(JSON.stringify(before)===JSON.stringify(after))return [];
    if(before&&after&&typeof before==='object'&&typeof after==='object'){
      const array=Array.isArray(before)&&Array.isArray(after);
      if(array&&[...before,...after].every(v=>v&&typeof v==='object'&&v.id)){
        const b=Object.fromEntries(before.map(v=>[v.id,v])),a=Object.fromEntries(after.map(v=>[v.id,v]));const order=JSON.stringify(before.map(v=>v.id))===JSON.stringify(after.map(v=>v.id))?[]:[{path:path+'/@order',before:before.map(v=>v.id),after:after.map(v=>v.id),change:'changed'}];return [...order,...diff(b,a,path)];
      }
      return [...new Set([...Object.keys(before),...Object.keys(after)])].flatMap(key=>diff(before[key],after[key],path+'/'+key));
    }
    return [{path:path||'/',before:before===undefined?null:before,after:after===undefined?null:after,change:before===undefined?'added':after===undefined?'removed':'changed'}];
  }
  function read(storage,componentId){const raw=storage.getItem(PREFIX+componentId);if(raw==null)return {schemaVersion:1,saved:null,draft:null,history:[]};const record=JSON.parse(raw);if(record.schemaVersion!==1||!Array.isArray(record.history))throw new Error('Unsupported component storage. Back up this record before resetting.');if(record.saved)assert(record.saved);if(record.draft)assert(record.draft);return record;}
  function draft(storage,c,expectedRevision){assert(c);const record=read(storage,c.id);if(expectedRevision!=null&&(record.saved?.revision||0)!==expectedRevision)throw new Error('This component changed in another tab. Reload before saving.');record.draft=clone(c);storage.setItem(PREFIX+c.id,JSON.stringify(record));return record;}
  function save(storage,c,expectedRevision){assert(c);const record=read(storage,c.id);if((record.saved?.revision||0)!==expectedRevision)throw new Error('This component changed in another tab. Reload before saving.');const next={...clone(c),revision:expectedRevision+1};if(record.saved)record.history.push(record.saved);record.history=record.history.slice(-30);record.saved=next;record.draft=null;storage.setItem(PREFIX+c.id,JSON.stringify(record));return next;}
  function discard(storage,componentId){const record=read(storage,componentId);record.draft=null;storage.setItem(PREFIX+componentId,JSON.stringify(record));return record.saved;}
  function blank(name='New component'){
    return {schemaVersion:1,id:id(name)+'-'+Date.now().toString(36),revision:0,name,authority:'contract',properties:[{id:'label',name:'Label',type:'text',default:'Label'}],selection:{label:'Label'},anatomy:{id:'root',name:'Container',kind:'container',tag:'div',styles:{display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px',borderRadius:'8px'},children:[{id:'label',name:'Label',kind:'text',tag:'span',bind:'label',styles:{}}]},variants:[],tokens:{},behaviors:[],accessibility:['Give interactive parts an accessible name and keyboard behavior.'],adapters:{figma:{variableMap:{}}}};
  }
  function suggestions(c,library=[]){
    const common=[{id:'disabled',name:'Disabled',type:'boolean',default:false},{id:'state',name:'State',type:'options',options:['rest','hover','pressed','focus','disabled','loading'],default:'rest'},{id:'size',name:'Size',type:'options',options:['small','medium','large'],default:'medium'},{id:'showIcon',name:'Show icon',type:'boolean',default:false},{id:'icon',name:'Icon',type:'swap',default:'plus'},{id:'content',name:'Content slot',type:'slot',default:''},{id:'onActivate',name:'On activate',type:'event',default:'activate'}];
    return [...new Map([...common,...library.flatMap(item=>item.properties||[])].map(p=>[p.id,p])).values()].filter(p=>!c.properties.some(existing=>existing.id===p.id)).slice(0,12).map(clone);
  }
  function prompt(c){assert(c);return 'Implement '+c.name+' from the following versioned component contract. Preserve property IDs, anatomy part IDs, conditional visibility, variants, token references, event rules and accessibility requirements. Resolve semantic tokens from the included snapshot. Use one reusable component. Compare the rendered result with this contract before reporting completion.\n\n```json\n'+JSON.stringify(c,null,2).replace(/`/g,'\\u0060')+'\n```';}
  return {VERSION,PREFIX,TYPES,TAGS,id,clone,validate,assert,compile,diff,read,draft,save,discard,blank,suggestions,prompt};
});
