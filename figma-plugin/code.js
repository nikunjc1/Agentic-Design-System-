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
        if(!/^(?:aria-[\w-]+|id|for|name|readonly|required|maxlength|minlength|role|title|type|value|placeholder|disabled|checked|tabindex|href|src|alt|viewBox|d|cx|cy|r|x|y|x1|x2|y1|y2|width|height|rx|ry|points|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|stroke-dasharray|xmlns|max|min|step|rows|colspan|rowspan)$/.test(key)||typeof value!=='string'||((key==='href'||key==='src')&&!/^(?:https?:|#|data:image\/(?:png|jpeg|webp|gif);base64,|[a-zA-Z0-9_.-]+(?:\/|$))/.test(value)))fail('Unsupported attribute '+key+' on '+n.id);
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

;
/* Figma-specific mapping. Component IDs and part IDs are preserved during updates. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.createDamcoFigmaAdapter=factory;})(globalThis,function(figma,M,onProgress){
 'use strict';
 onProgress=onProgress||(()=>{});
 const DATA='ads-contract',PART='ads-part',VARIANT='ads-variant';
 function write(node,c){const text=JSON.stringify(c),chunks=Math.ceil(text.length/24000);node.setPluginData(DATA+'-count',String(chunks));for(let i=0;i<chunks;i++)node.setPluginData(DATA+'-'+i,text.slice(i*24000,(i+1)*24000));node.setPluginData('ads-component',c.id);}
 function read(node){const count=Number(node.getPluginData(DATA+'-count'));if(!count)return null;return JSON.parse(Array.from({length:count},(_,i)=>node.getPluginData(DATA+'-'+i)).join(''));}
 function resolve(value,tokens){let text=String(value??'');for(let i=0;i<15&&text.includes('var(');i++)text=text.replace(/var\(\s*(--[\w-]+)\s*\)/g,(_,key)=>tokens[key]??'');return text;}
 // Evaluates a plain-arithmetic calc() once its tokens are substituted, e.g. calc(20px * 1) - the form every icon size now takes
 // (calc(var(--dimension-20) * var(--icon-scale))). Percent/auto terms are left unresolved on purpose (null).
 function calcValue(text){const m=/^calc\((.*)\)$/.exec(text.trim());if(!m||/[%a-df-qs-z]/i.test(m[1].replace(/px|rem/g,'')))return null;
  const parts=m[1].match(/(-?[\d.]+)(px|rem)?|[*\/+-]/g);if(!parts)return null;
  const term=t=>{const x=/^(-?[\d.]+)(px|rem)?$/.exec(t);return x?parseFloat(x[1])*(x[2]==='rem'?16:1):NaN;};
  const vals=[],ops=[];for(let i=0;i<parts.length;i++){if(i%2===0)vals.push(term(parts[i]));else ops.push(parts[i]);}
  if(vals.length!==ops.length+1||vals.some(v=>!Number.isFinite(v)))return null;
  const v2=[vals[0]],o2=[];for(let i=0;i<ops.length;i++){if(ops[i]==='*')v2[v2.length-1]*=vals[i+1];else if(ops[i]==='/')v2[v2.length-1]/=vals[i+1];else{o2.push(ops[i]);v2.push(vals[i+1]);}}
  let out=v2[0];for(let i=0;i<o2.length;i++)out=o2[i]==='+'?out+v2[i+1]:out-v2[i+1];return Number.isFinite(out)?out:null;}
 function number(value,tokens,fallback=0){const text=resolve(value,tokens);if(/^\s*calc\(/.test(text)){const c=calcValue(text);return c===null?fallback:c;}const n=parseFloat(text);return Number.isFinite(n)?n*(text.endsWith('rem')?16:1):fallback;}
 // A percentage (or calc(N% +/- Mpx), the pattern absolutely-positioned
 // elements use to center themselves without a CSS transform - adapter.js
 // has no transform support at all, see the position/x/y call site) CAN be
 // resolved to a real pixel offset once its basis (the parent's own
 // already-resolved width/height) is known, unlike a percentage WIDTH/HEIGHT
 // (which needs Figma's own STRETCH/layoutGrow resolution instead). Returns
 // null, not 0, when the text isn't a percent/calc form at all, so the
 // caller can fall back to a plain pixel number() read.
 function percentOffset(value,tokens,basis){
  const text=resolve(value,tokens).trim();
  const calc=/^calc\(\s*(-?[\d.]+)%\s*([+-])\s*(-?[\d.]+)px\s*\)$/.exec(text);
  if(calc)return basis*(parseFloat(calc[1])/100)+(calc[2]==='-'?-1:1)*parseFloat(calc[3]);
  const plain=/^(-?[\d.]+)%$/.exec(text);
  if(plain)return basis*(parseFloat(plain[1])/100);
  return null;
 }
 // color-mix(in srgb, A p%, B q%) and color(srgb r g b): the page's muted text/borders use these; unparsed they came out as NO fill (invisible text).
 function mixColor(text,tokens){
  const m=/^color-mix\(\s*in\s+srgb\s*,([\s\S]*)\)\s*$/.exec(text);if(!m)return null;
  const parts=[];let depth=0,cur='';for(const ch of m[1]){if(ch==='(')depth++;if(ch===')')depth--;if(ch===','&&depth===0){parts.push(cur);cur='';}else cur+=ch;}parts.push(cur);
  if(parts.length!==2)return null;
  const read=part=>{const pm=/^\s*([\s\S]*?)\s+([\d.]+)%\s*$/.exec(part);const c=color(pm?pm[1]:part,tokens);return c?{c,w:pm?parseFloat(pm[2]):null}:null;};
  const a=read(parts[0]),b=read(parts[1]);if(!a||!b)return null;
  let wa=a.w,wb=b.w;if(wa===null&&wb===null){wa=50;wb=50;}else if(wa===null)wa=100-wb;else if(wb===null)wb=100-wa;
  const t=wa+wb||100;return {r:(a.c.r*wa+b.c.r*wb)/t,g:(a.c.g*wa+b.c.g*wb)/t,b:(a.c.b*wa+b.c.b*wb)/t};
 }
 function color(value,tokens){let text=resolve(value,tokens),match;
  if(/^\s*color-mix\(/.test(text))return mixColor(text.trim(),tokens);
  if((match=/^color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(text)))return {r:parseFloat(match[1]),g:parseFloat(match[2]),b:parseFloat(match[3])};if(/^#[\da-f]{3,4}$/i.test(text))text='#'+[...text.slice(1)].map(char=>char+char).join('');if((match=/^#([\da-f]{6})([\da-f]{2})?$/i.exec(text)))return {r:parseInt(match[1].slice(0,2),16)/255,g:parseInt(match[1].slice(2,4),16)/255,b:parseInt(match[1].slice(4,6),16)/255};if((match=/^rgba?\(([^)]+)\)/.exec(text))){const values=match[1].split(/[,\s/]+/).filter(Boolean).map(Number);return {r:values[0]/255,g:values[1]/255,b:values[2]/255};}return null;}
 function alpha(value,tokens){const text=resolve(value,tokens),rgba=/^rgba\(([^)]+)\)/.exec(text);if(rgba)return Number(rgba[1].split(/[,\s/]+/).filter(Boolean)[3]??1);if(/^#[\da-f]{8}$/i.test(text))return parseInt(text.slice(-2),16)/255;if(/^#[\da-f]{4}$/i.test(text))return parseInt(text.slice(-1).repeat(2),16)/255;return 1;}
 function variableName(token){return token.replace(/^--/,'').replace(/-/g,'/');}
 // Foundation categories, not one flat pile or a bare primitive/alias
 // split: every token sorts by name into one of this design system's own
 // 8 Foundation groupings (Colors, Grid & Layout, Typography, Spacing,
 // Radius, Borders, Shadows, Icons), with a catch-all 9th for anything
 // that matches none of them, so a token is never silently dropped. A
 // primitive (--red-500: "#FF031A") and a semantic alias to it
 // (--brand-500: "var(--red-500)") land in the SAME category collection -
 // the alias/primitive distinction still exists (an alias binds a real
 // VARIABLE_ALIAS instead of a literal value, in push() below) but no
 // longer decides which collection a variable lives in; only its name's
 // category does. Module-scope (not push()'s own closure) so pushFoundations
 // below can create every category's collection up front, before any
 // component - the only way Shadows/Icons ever get real variables, since no
 // component today binds a shadow effect or an icon's own size live.
 const CATEGORY_RULES=[
  ['Spacing',/^--space-/],
  ['Radius',/^--radius-/],
  ['Shadows',/^--shadow-/],
  ['Icons',/^--icon-/],
  ['Typography',/^--(type-|font-|tracking-)/],
  ['Grid & Layout',/^--(grid-|size-|dimension-)/],
  ['Borders',/^--(border-|control-border|focus-ring)/,/^--line(-strong)?$/],
  ['Colors',/^--(red-|brand-|color-|graphite-|surface-|danger-|green-|amber-|blue-|status-|link-|on-brand-|button-[\w-]*-(text|bg)[\w-]*|card-|table-|modal-|agent-|contrast-|text-|overlay-)/],
 ];
 const CATEGORY_NAMES=[...CATEGORY_RULES.map(rule=>rule[0]),'Other'];
 function categoryFor(token){for(const [name,...tests]of CATEGORY_RULES)if(tests.some(re=>re.test(token)))return name;return 'Other';}
 async function collectionsByCategoryMap(){
  const collections=await figma.variables.getLocalVariableCollectionsAsync(),map=new Map();
  for(const category of CATEGORY_NAMES){
   const collection=collections.find(collection=>collection.id===figma.root.getPluginData('ads-collection-'+M.id(category)));
   if(collection)map.set(category,collection);
  }
  return map;
 }
 function outlineSpec(s,tokens){
  const outline=resolve(s.outline,tokens),colorText=outline.match(/#[\da-f]{3,8}|rgba?\([^)]+\)/i)?.[0],width=number(outline.replace(colorText||'','').match(/(?:\d*\.)?\d+(?:px|rem)\b/)?.[0],tokens);
  if(!(width>0)||/\bnone\b/.test(outline)||!colorText||!color(colorText,tokens))return null;
  return {width,offset:number(s.outlineOffset,tokens)||0,colorText};
 }
 // CSS margin has no Figma equivalent. For an unpainted frame inside an auto-layout parent it is reproduced as padding on that frame (the frame's size grows by the same amount), which keeps the spacing between siblings (e.g. Breadcrumb separators).
 function marginBox(s,tokens,parentLayout){
  const none={t:0,r:0,b:0,l:0};if(!parentLayout||parentLayout==='NONE'||!s)return none;
  const painted=(s.backgroundColor&&!/transparent|rgba\(0, 0, 0, 0\)/.test(String(s.backgroundColor)))||['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth'].some(k=>number(s[k],tokens)>0)||(s.boxShadow&&!/^none$/.test(resolve(s.boxShadow,tokens)));
  if(painted)return none;
  const m=key=>Math.max(0,number(s[key],tokens)||0);return {t:m('marginTop'),r:m('marginRight'),b:m('marginBottom'),l:m('marginLeft')};
 }
 function ownedParts(master){
  const parts=[];
  function visit(parent){for(const child of parent.children||[]){if(child.getPluginData('ads-retired')==='true')continue;parts.push(child);if(!['INSTANCE','SLOT'].includes(child.type)&&child.getPluginData('ads-kind')!=='slot')visit(child);}}
  visit(master);return parts;
 }
 function pageNodes(types){return figma.currentPage.findAllWithCriteria?figma.currentPage.findAllWithCriteria({types}):figma.currentPage.findAll(node=>types.includes(node.type));}
 function normalizeInput(c){
  if(c.source?.page!=='input-text-field.html')return c;
  const legacySlot=(function find(n){return n.id==='supporting-slot'&&n.children?.some(child=>child.id==='helper')?true:(n.children||[]).some(find);})(c.anatomy);
  const missingPlaceholder=c.properties.some(p=>p.id==='value')&&c.properties.some(p=>p.id==='placeholder')&&!c.properties.some(p=>p.id==='showPlaceholder');
  if(!legacySlot&&!missingPlaceholder)return c;c=M.clone(c);
  if(missingPlaceholder){const value=!(c.selection.value??c.properties.find(p=>p.id==='value').default);c.properties.push({id:'showPlaceholder',name:'Show placeholder',type:'boolean',default:value});c.selection.showPlaceholder=value;}
  (function visit(parent){for(const [index,child]of (parent.children||[]).entries()){
   if(child.id==='supporting-slot'&&child.children?.some(n=>n.id==='helper')){const helper=child.children.find(n=>n.id==='helper');child.children=child.children.filter(n=>n!==helper);
    if(parent.id==='supporting-content')parent.children.splice(index,0,helper);else{parent.children[index]={id:'supporting-content',name:'Supporting content',kind:'container',tag:'div',styles:{display:'flex',flexDirection:'column',gap:'0px',width:'100%',height:'auto'},visibleWhen:child.visibleWhen||[],hiddenWhen:child.hiddenWhen||[],children:[helper,child]};delete child.visibleWhen;delete child.hiddenWhen;}
   }else visit(child);
  }})(c.anatomy);return c;
 }
 async function pushInputFamilies(c){
  const appearance=c.properties.find(p=>p.id==='appearance'),families=appearance.options.map(value=>{
   const family=M.clone(c);family.id=c.id+'--'+M.id(value);family.name=c.name+' / '+value;family.properties=family.properties.filter(p=>p.id!=='appearance');delete family.selection.appearance;
   family.variants=family.variants.filter(v=>v.when.appearance===value).map(v=>({...v,when:Object.fromEntries(Object.entries(v.when).filter(([id])=>id!=='appearance'))}));
   family.adapters.figma={...family.adapters.figma,role:'appearance-family'};delete family.adapters.figma.layout;delete family.adapters.figma.appearanceFamilies;
   return {appearance:value,contract:family};
  });
  const result=await pushAppearanceFamilies(c,appearance,families);
  const configuration={...c.selection};if(c.properties.some(p=>p.id==='allowClear'))configuration.allowClear=Boolean(c.selection.allowClear&&c.selection.value&&!['Disabled','Read-Only'].includes(c.selection.state));await configure(c.id,configuration);
  return result;
 }
 // Button's appearances (Primary/Secondary/Tertiary/Ghost/Neutral/Link/
 // Destructive) are separate pages, not one page's own crossed property, so
 // there's no single combined contract to filter by appearance the way
 // Input's capture already produces one. The website instead captures each
 // appearance page's own full contract (unchanged from what already pushes
 // standalone today) and hands them over pre-built as `c.families` - this
 // just wraps them with the same appearance-switcher used for Input.
 async function pushButtonFamily(c){
  const appearance=c.properties.find(p=>p.id==='appearance')||{id:'appearance',name:'Appearance',type:'options',options:c.families.map(f=>f.appearance),default:c.families[0].appearance};
  const families=c.families.map(f=>{
   const family=M.clone(f.contract);family.adapters.figma={...family.adapters.figma,role:'appearance-family'};delete family.adapters.figma.layout;delete family.adapters.figma.appearanceFamilies;
   return {appearance:f.appearance,contract:family};
  });
  return pushAppearanceFamilies(c,appearance,families);
 }
 // Each appearance family is pushed with {definitionOnly:true} (see below),
 // which deliberately skips the normal documentation-frame treatment (the
 // titled, dark card with a white canvas inside) - that guard exists so
 // merging N appearances doesn't put N+1 full documentation cards on the
 // page (see the comment at the main docFrame site). But skipping it
 // entirely left the family's bare COMPONENT_SET floating free on the page
 // with no title, no background, no card - fine for Button's small families,
 // but glaring once a family holds hundreds of masters (Input's 512-per-
 // appearance families): the user reported these "not coming in the
 // section...coming outside", i.e. visually disconnected from the one real
 // documentation card (the wrapper's). Give each family a lightweight
 // version of that same card - titled, backgrounded, holding the family's
 // component set on a white canvas - so every pushed family reads as
 // organized/contained rather than stray, matching the established pattern
 // instead of introducing a new one.
 async function wrapFamilySection(contractId,title,node){
  let section=pageNodes(['FRAME']).find(n=>n.getPluginData('ads-family-section')===contractId);
  let canvas;
  if(!section){
   section=figma.createFrame();section.name=title;section.setPluginData('ads-family-section',contractId);
   section.layoutMode='VERTICAL';section.primaryAxisSizingMode='AUTO';section.counterAxisSizingMode='AUTO';
   section.itemSpacing=16;section.paddingTop=24;section.paddingBottom=24;section.paddingLeft=24;section.paddingRight=24;
   section.fills=[{type:'SOLID',color:{r:0.11,g:0.12,b:0.14}}];
   const titleNode=figma.createText();await figma.loadFontAsync({family:'Inter',style:'Bold'});titleNode.fontName={family:'Inter',style:'Bold'};titleNode.fontSize=16;titleNode.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}];titleNode.textAutoResize='WIDTH_AND_HEIGHT';titleNode.setPluginData('ads-doc-part','title');titleNode.characters=title;section.appendChild(titleNode);
   canvas=figma.createFrame();canvas.name='Canvas';canvas.layoutMode='VERTICAL';canvas.primaryAxisSizingMode='AUTO';canvas.counterAxisSizingMode='AUTO';canvas.paddingTop=24;canvas.paddingBottom=24;canvas.paddingLeft=24;canvas.paddingRight=24;canvas.cornerRadius=12;canvas.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}];canvas.strokeWeight=1;canvas.strokes=[{type:'SOLID',color:{r:0.85,g:0.85,b:0.87}}];canvas.dashPattern=[4,4];canvas.clipsContent=false;canvas.setPluginData('ads-doc-part','canvas');section.appendChild(canvas);
  }else{
   const titleNode=section.children.find(n=>n.getPluginData('ads-doc-part')==='title');if(titleNode)titleNode.characters=title;
   canvas=section.children.find(n=>n.getPluginData('ads-doc-part')==='canvas');
  }
  if(canvas&&node.parent!==canvas)canvas.appendChild(node);
  return section;
 }
 // Shared by both entry points above: given a seed contract (id/name/
 // revision/tokens/context only - its own anatomy/properties/variants are
 // ignored once `families` is supplied) plus an already-resolved Appearance
 // property and one complete, independently pushable contract per
 // appearance, build the small instance-swap wrapper component and push
 // every family underneath it.
 async function pushAppearanceFamilies(c,appearance,families){
  let linked=pageNodes(['COMPONENT_SET']).find(n=>n.getPluginData('ads-component')===c.id);
  if(!linked){const candidates=pageNodes(['COMPONENT_SET']).filter(n=>n.name===c.name&&!n.getPluginData('ads-component')&&n.getPluginData('ads-property-map')&&n.children.some(child=>child.getPluginData(VARIANT)));if(candidates.length===1){linked=candidates[0];linked.setPluginData('ads-component',c.id);write(linked,c);}}
  // Reuse the old large set's masters instead of duplicating the library.
  // Figma removes its empty set after the final family is moved; the masters
  // themselves keep their IDs and existing instances remain linked.
  const legacy=linked?.children.filter(n=>n.type==='COMPONENT'&&JSON.parse(n.getPluginData(VARIANT)||'[]').length>1)||[];
  if(legacy.length){
   onProgress('Creating "'+c.name+'": Moving existing variants into smaller appearance families');
   for(const item of families){
    const group=legacy.filter(master=>(Object.fromEntries(JSON.parse(master.getPluginData(VARIANT))).appearance||master.getPluginData('ads-family-appearance'))===item.appearance);if(!group.length)continue;
    let familySet=pageNodes(['COMPONENT_SET']).find(n=>n.getPluginData('ads-component')===item.contract.id);
    for(const master of group){const values=Object.fromEntries(JSON.parse(master.getPluginData(VARIANT)));master.setPluginData('ads-family-appearance',item.appearance);delete values.appearance;master.setPluginData(VARIANT,JSON.stringify(item.contract.properties.filter(p=>p.type==='options').map(p=>[p.id,values[p.id]??p.default])));master.name=item.contract.properties.filter(p=>p.type==='options').map(p=>p.name+'='+String(values[p.id]??p.default)).join(', ');}
    if(familySet)for(const master of group)familySet.appendChild(master);else familySet=figma.combineAsVariants(group,figma.currentPage);
    familySet.name=item.contract.name;familySet.setPluginData('ads-component',item.contract.id);write(familySet,item.contract);
   }
  }
  const records=[],warnings=[];
  for(const item of families){onProgress('Creating "'+c.name+'": Preparing '+item.appearance+' family');const result=await push(item.contract,{definitionOnly:true});const familyNode=await figma.getNodeByIdAsync(result.nodeId);const section=await wrapFamilySection(item.contract.id,c.name+' — '+item.appearance,familyNode);records.push({appearance:item.appearance,id:item.contract.id,nodeId:result.nodeId,sectionId:section.id,selectedMasterId:result.selectedMasterId,variantCount:result.variantCount,propertySummary:result.propertySummary});for(const warning of result.warnings)warnings.push(item.appearance+': '+warning);}
  const wrapper=M.blank(c.name);wrapper.id=c.id;wrapper.revision=c.revision;wrapper.tokens=c.tokens;wrapper.context=c.context;wrapper.properties=[M.clone(appearance)];wrapper.selection={appearance:c.selection.appearance??appearance.default};wrapper.source={page:c.source?.page||'appearance-family-wrapper',kind:'exposed-appearance-families'};
  wrapper.anatomy={id:'root',name:c.name,kind:'container',tag:'div',styles:{display:'flex',flexDirection:'column',width:families[0].contract.anatomy.styles.width||'220px',height:'auto'},children:[{id:'field',name:'Field',kind:'instance',reference:records[0].id,exposeProperties:true,styles:{width:'100%',height:'auto'},children:[]}]};
  wrapper.adapters.figma.components=Object.fromEntries(records.map(item=>[item.id,item.selectedMasterId]));wrapper.variants=records.map(item=>({id:'appearance-'+M.id(item.appearance),name:item.appearance,when:{appearance:item.appearance},overrides:{field:{reference:item.id}}}));
  const result=await push(wrapper),set=await figma.getNodeByIdAsync(result.nodeId);
  const stored=M.clone(c);stored.adapters.figma={...stored.adapters.figma,nodeId:set.id,layout:'appearance-families',appearanceFamilies:records};write(set,stored);
  let x=set.x||0;for(const item of records){const section=await figma.getNodeByIdAsync(item.sectionId);section.x=x;section.y=(set.y||0)+set.height+256;x+=section.width+96;}
  return {...result,configurationCount:families.reduce((sum,item)=>sum+(item.contract.variants?.length||1),0),layout:'appearance-families',families:records,warnings:[...warnings,...result.warnings]};
 }
 // Nothing in this pipeline ever wired Figma's own "Interactive Components"
 // prototyping (reactions) - a component set with a State axis drew every
 // state as a static variant, but opening it in Presentation/Preview mode
 // never actually transitioned between them on hover/press, since that
 // requires explicit Reaction objects set via setReactionsAsync(), which
 // nothing here ever called. Wire the standard Rest<->Hover<->Pressed loop
 // generically for every component that has a recognizable State axis
 // (Button, Float Button, and anything else built the same way), grouped by
 // every OTHER variant axis so e.g. a Large/Primary Rest master only ever
 // transitions to its own matching Large/Primary Hover master, never a
 // same-labelled master from a different Size/Appearance combination.
 // Focused/Disabled/Loading aren't wired to anything: Figma's prototyping
 // triggers are mouse/keyboard-gesture based (ON_HOVER/ON_PRESS/MOUSE_LEAVE/
 // MOUSE_UP - there is no ON_FOCUS or ON_DISABLE trigger), so those states
 // have no real mouse gesture that would ever land on them in Presentation
 // mode; they stay reachable only by explicitly picking that variant.
 async function wireStateReactions(masters,properties){
  if(typeof masters[0]?.setReactionsAsync!=='function')return;
  const stateProp=properties?.find(p=>p.id==='state');
  if(!stateProp)return;
  const stateAxisName=(stateProp.name+(stateProp.type==='boolean'?' variant':'')).replace(/[,=]/g,' ');
  const groups=new Map();
  for(const master of masters){
   const vp=master.variantProperties||{};
   if(!(stateAxisName in vp))continue;
   const restKey=JSON.stringify(Object.entries(vp).filter(([key])=>key!==stateAxisName).sort());
   if(!groups.has(restKey))groups.set(restKey,{});
   groups.get(restKey)[vp[stateAxisName]]=master;
  }
  // A large component set (Button: ~288 masters per appearance family, up
  // to 8 families) can mean 1000+ groups here. Awaiting setReactionsAsync()
  // one call at a time - and up to 4 separate calls per group, since a
  // single master can pick up more than one reaction (Hover needs both a
  // mouse-leave-to-Rest and an on-press-to-Pressed) - serialized thousands
  // of round trips to the Figma main thread into a single push, which is
  // almost certainly what produced the stalled/incomplete push report. Only
  // ONE real API call matters per node (setReactionsAsync takes the whole
  // reaction list at once), so accumulate every node's full reaction list
  // first, then fire every node's single call together.
  // SMART_ANIMATE interpolates matching layers between the two component
  // instances being transitioned between - it's built for morphing content
  // that's actually meant to move or resize. A hover/press swap has nothing
  // that should visibly move at all (every part, including the tooltip
  // arrow, sits at byte-identical coordinates across every state - verified
  // directly against the pushed Figma geometry), but Smart Animate's layer-
  // matching between two separate component instances isn't guaranteed to
  // correlate every nested layer perfectly, and a failed match can animate
  // through a wrong intermediate position before settling - producing a
  // visible slide/jump during the transition even though the start and end
  // states are identical (reported as the tooltip arrow "sliding left or
  // right" on hover). DISSOLVE only cross-fades opacity between the two
  // states - it can't exhibit a position-interpolation artifact like that,
  // and a quick cross-fade is the more appropriate feel for a hover/press
  // state change anyway (nothing is meant to be seen moving).
  const dissolve={type:'DISSOLVE',easing:{type:'EASE_OUT'},duration:0.15};
  const pending=new Map();
  function queue(from,trigger,to){
   if(!from||!to||from===to)return;
   if(!pending.has(from))pending.set(from,[...from.reactions]);
   pending.get(from).push({trigger,actions:[{type:'NODE',destinationId:to.id,navigation:'CHANGE_TO',transition:dissolve}]});
  }
  for(const group of groups.values()){
   const labelFor=re=>Object.keys(group).find(label=>re.test(label));
   const rest=group[labelFor(/^rest$/i)],hover=group[labelFor(/^hover$/i)],pressed=group[labelFor(/^(pressed|active)$/i)];
   queue(rest,{type:'ON_HOVER'},hover);
   // The plugin typings list MOUSE_LEAVE as taking a `deprecatedVersion`
   // flag alongside `delay`, but Figma's real runtime validation rejects it
   // outright ("Unrecognized key: deprecatedVersion") - confirmed against
   // the actual desktop app, not just the (here, stale/aspirational) .d.ts.
   // Only `delay` is actually accepted.
   queue(hover,{type:'MOUSE_LEAVE',delay:0},rest);
   queue(hover||rest,{type:'ON_PRESS'},pressed||hover);
   queue(pressed,{type:'MOUSE_UP',delay:0},hover||rest);
  }
  await Promise.all([...pending].map(([node,reactions])=>node.setReactionsAsync(reactions)));
 }
 // Checkbox/Radio's own "Live Preview" matrix on the website shows a
 // clean State x Appearance table - no variant names, no asterisk, no
 // supporting/error note, one Size/Radius held fixed - the user asked for
 // the pushed Figma file to carry that exact picture rather than leaving
 // the raw, hundreds-strong variant set (necessarily sprawling, since it
 // covers every Size/Radius/required/note combination too) as the only
 // thing to look at. Builds a small grid of real, property-driven
 // instances (one column per Appearance, one row per State) with its own
 // column headers and row dividers, inserted ahead of the full variant
 // set inside the same documentation canvas - the full set stays right
 // below it for anyone who needs every combination, this is just the
 // at-a-glance picture up top.
 async function buildShowcaseGrid(c,canvasFrame,masters,propertyMap){
  // Local re-derivation of push()'s own axisName() - that one is scoped
  // inside push() itself, not shared with this sibling function, and this
  // is a one-line pure computation (Figma's variant-property key for a
  // crossed/options property is just its name, with ','/'=' replaced,
  // since Figma itself rejects those characters in a property name).
  const axisName=p=>p.name.replace(/[,=]/g,' ');
  const stateProp=c.properties.find(p=>p.id==='state'),appearanceProp=c.properties.find(p=>p.id==='appearance');
  if(!stateProp||!appearanceProp||!canvasFrame||!masters.length)return;
  const sizeProp=c.properties.find(p=>p.id==='size'),radiusProp=c.properties.find(p=>p.id==='radius');
  const labelProp=c.properties.find(p=>p.id==='label');
  await figma.loadFontAsync({family:'Inter',style:'Semi Bold'});
  let showcase=canvasFrame.children.find(n=>n.getPluginData('ads-showcase')===c.id);
  if(!showcase){showcase=figma.createFrame();showcase.setPluginData('ads-showcase',c.id);}
  showcase.name='Showcase';showcase.layoutMode='VERTICAL';showcase.primaryAxisSizingMode='AUTO';showcase.counterAxisSizingMode='AUTO';showcase.itemSpacing=0;showcase.fills=[];
  for(const child of [...showcase.children])child.remove();
  function divider(){const line=figma.createFrame();line.resize(100,1);line.fills=[{type:'SOLID',color:{r:0.9,g:0.9,b:0.91}}];line.layoutAlign='STRETCH';return line;}
  const baseValues={};
  if(sizeProp)baseValues[axisName(sizeProp)]=String(sizeProp.default);
  if(radiusProp)baseValues[axisName(radiusProp)]=String(radiusProp.default);
  if(propertyMap.label)baseValues[propertyMap.label]=labelProp?.default??'Label';
  if(propertyMap.required)baseValues[propertyMap.required]=false;
  if(propertyMap.showSupporting)baseValues[propertyMap.showSupporting]=false;
  if(propertyMap.showError)baseValues[propertyMap.showError]=false;
  const rows=[];
  for(const stateValue of stateProp.options){
   const rowFrame=figma.createFrame();rowFrame.name=stateValue;rowFrame.layoutMode='HORIZONTAL';rowFrame.primaryAxisSizingMode='AUTO';rowFrame.counterAxisSizingMode='AUTO';rowFrame.counterAxisAlignItems='CENTER';rowFrame.itemSpacing=32;rowFrame.fills=[];rowFrame.paddingTop=16;rowFrame.paddingBottom=16;
   const instances=[];
   for(const appearanceValue of appearanceProp.options){
    const instance=masters[0].createInstance();
    instance.setProperties({...baseValues,[axisName(stateProp)]:stateValue,[axisName(appearanceProp)]:appearanceValue});
    rowFrame.appendChild(instance);instances.push(instance);
   }
   rows.push({rowFrame,instances});
  }
  const columnWidths=appearanceProp.options.map((value,index)=>Math.max(...rows.map(row=>row.instances[index].width)));
  const headerRow=figma.createFrame();headerRow.name='Header';headerRow.layoutMode='HORIZONTAL';headerRow.primaryAxisSizingMode='AUTO';headerRow.counterAxisSizingMode='AUTO';headerRow.counterAxisAlignItems='CENTER';headerRow.itemSpacing=32;headerRow.fills=[];headerRow.paddingBottom=16;
  appearanceProp.options.forEach((value,index)=>{
   const headerCell=figma.createText();headerCell.fontName={family:'Inter',style:'Semi Bold'};headerCell.fontSize=16;headerCell.fills=[{type:'SOLID',color:{r:0.26,g:0.28,b:0.32}}];headerCell.characters=value;headerCell.textAlignHorizontal='CENTER';headerCell.resize(Math.max(1,columnWidths[index]),headerCell.height);headerCell.textAutoResize='HEIGHT';
   headerRow.appendChild(headerCell);
  });
  showcase.appendChild(headerRow);
  rows.forEach((row,index)=>{showcase.appendChild(divider());showcase.appendChild(row.rowFrame);});
  if(showcase.parent!==canvasFrame)canvasFrame.insertChild(0,showcase);
 }
 async function push(c,options){
  options=options||{};
  c=normalizeInput(c);
  // Every phase message below is prefixed with the component's own name, so
  // the plugin UI reads as a live account of *what* is being drawn (e.g.
  // "Creating "Badge": Rendering 96 variants"), not just a bare phase label
  // that could belong to any job.
  const label='Creating "'+c.name+'": ';
  onProgress(label+'Validating contract');
  M.assert(c);if(c.authority!=='contract')throw new Error('Contract must lead before pushing.');
  if(c.source?.page==='input-text-field.html'&&c.variants.length>512)return pushInputFamilies(c);
  if(c.source?.kind==='button-appearance-family'&&Array.isArray(c.families)&&c.families.length)return pushButtonFamily(c);
  let set=pageNodes(['COMPONENT_SET']).find(n=>n.getPluginData('ads-component')===c.id)||pageNodes(['COMPONENT']).find(n=>n.getPluginData('ads-component')===c.id);
  if(!set){const orphaned=pageNodes(['COMPONENT_SET']).filter(n=>n.name===c.name&&!n.getPluginData('ads-component')&&n.getPluginData('ads-property-map')&&n.children.some(child=>child.getPluginData(VARIANT)));if(orphaned.length===1){set=orphaned[0];set.setPluginData('ads-component',c.id);}}
  onProgress(label+'Reading linked component');
  const previous=set&&read(set);if(previous&&previous.revision>c.revision)throw new Error('Figma has a newer revision. Pull and review it first.');
  const warnings=new Set(),variables=await figma.variables.getLocalVariablesAsync();
  // Captured CSS of every drawn frame, by Figma node id, so a child can tell whether its parent was a stretch-aligned flex column.
  const parentCss=new Map();
  // CSS text-decoration propagates from an element to its in-flow text; a Figma TEXT layer needs it set on itself.
  const inheritedDecoration=new Map();
  // Focus-ring layers are sized after every master is built: a hugging parent's width/height isn't final while its children are still being added.
  const ringNodes=[];
  const collectionsByCategory=await collectionsByCategoryMap();
  const owned=v=>v&&[...collectionsByCategory.values()].some(collection=>v.variableCollectionId===collection.id);
  const variableMap=c.adapters?.figma?.variableMap||{};
  // Scopes keep a created variable out of property pickers it doesn't apply
  // to - an unscoped (default ALL_SCOPES) variable clutters every fill,
  // stroke and spacing picker alike. Best-effort from the Figma node field
  // being bound; wrapped in try/catch below so an unrecognized or
  // engine-rejected scope value degrades to the default instead of failing
  // the whole push.
  const SCOPES_BY_FIELD={fills:['ALL_FILLS'],strokes:['STROKE_COLOR'],cornerRadius:['CORNER_RADIUS'],topLeftRadius:['CORNER_RADIUS'],topRightRadius:['CORNER_RADIUS'],bottomLeftRadius:['CORNER_RADIUS'],bottomRightRadius:['CORNER_RADIUS'],itemSpacing:['GAP'],paddingTop:['GAP'],paddingRight:['GAP'],paddingBottom:['GAP'],paddingLeft:['GAP'],fontSize:['FONT_SIZE']};
  async function variable(token,type,field){
   const mapped=variableMap[token];
   if(mapped){
    const existing=variables.find(v=>v.id===mapped||v.key===mapped);
    if(existing)return existing.resolvedType===type?existing:null;
    try{return await figma.variables.importVariableByKeyAsync(mapped);}catch{warnings.add('Variable mapping unavailable: '+token);return null;}
   }
   let v=variables.find(v=>owned(v)&&(v.name===token||v.name===variableName(token)));
   if(v&&v.resolvedType!==type)return null;
   const raw=c.tokens[token],aliasMatch=/^var\(\s*(--[\w-]+)\s*\)$/.exec(String(raw??''))?.[1];
   const aliasOf=aliasMatch&&aliasMatch!==token&&aliasMatch in c.tokens?aliasMatch:null;
   const category=categoryFor(token);
   if(!v){
    let collection=collectionsByCategory.get(category);
    if(!collection){collection=figma.variables.createVariableCollection(category+' Tokens');figma.root.setPluginData('ads-collection-'+M.id(category),collection.id);collectionsByCategory.set(category,collection);}
    v=figma.variables.createVariable(variableName(token),collection,type);
    variables.push(v);
    try{v.scopes=SCOPES_BY_FIELD[field]||(type==='COLOR'?['ALL_FILLS']:['ALL_SCOPES']);}catch{}
    if(typeof v.setVariableCodeSyntax==='function')try{v.setVariableCodeSyntax('WEB','var('+token+')');}catch{}
   }
   if(owned(v)){
    const collection=collectionsByCategory.get(category);
    if(aliasOf){
     const target=await variable(aliasOf,type,field);
     if(target)v.setValueForMode(collection.defaultModeId,{type:'VARIABLE_ALIAS',id:target.id});
    }else{
     const value=type==='COLOR'?color(raw,c.tokens):type==='STRING'?resolve(raw,c.tokens):number(raw,c.tokens);
     if(value!=null)v.setValueForMode(collection.defaultModeId,value);
    }
   }
   return v;
  }
  async function bind(node,field,source,type='FLOAT',paint=false){
   const token=/^var\(\s*(--[\w-]+)\s*\)$/.exec(source||'')?.[1];if(!token)return;
   const v=await variable(token,type,field);if(!v)return;
   if(paint){const paints=node[field];node[field]=[figma.variables.setBoundVariableForPaint(paints[0],'color',v)];}else node.setBoundVariable(field,v);
  }
  const axes=c.properties.filter(p=>(p.type==='options'&&!p.multiple)||(p.type==='boolean'&&c.variants.some(v=>p.id in v.when))),configs=new Map(),axisName=p=>(p.name+(p.type==='boolean'?' variant':'')).replace(/[,=]/g,' ');
  const defaults=Object.fromEntries(c.properties.map(p=>[p.id,p.default]));
  const isAuthoredInput=c.source?.page==='input-text-field.html',selectedValues={...defaults,...c.selection};
  const clearVisible=Boolean(selectedValues.allowClear&&selectedValues.value&&!['Disabled','Read-Only'].includes(selectedValues.state));
  const nativeProperties=c.properties.map(p=>isAuthoredInput&&p.id==='allowClear'?{...p,name:'Show clear button',default:clearVisible}:p);
  function presentInput(node){
   if(!isAuthoredInput)return node;
   if(node.tag!=='input')return {...node,children:(node.children||[]).map(presentInput)};
   const s=node.styles,value=node.attributes.value||'',textStyles={...s,width:'0px',height:'auto',flexGrow:'1',backgroundColor:'transparent',borderWidth:'0px',borderTopWidth:'0px',borderRightWidth:'0px',borderBottomWidth:'0px',borderLeftWidth:'0px'};
   return {...node,tag:'div',kind:'container',inputPresentation:true,text:'',styles:{...s,display:'flex',flexDirection:'row',padding:'0px',paddingTop:'0px',paddingRight:'0px',paddingBottom:'0px',paddingLeft:'0px',backgroundColor:'transparent',borderWidth:'0px',borderTopWidth:'0px',borderRightWidth:'0px',borderBottomWidth:'0px',borderLeftWidth:'0px'},children:[
    {id:node.id+'-value',name:'Value',kind:'text',tag:'span',inputRole:'value',styles:textStyles,attributes:{type:node.attributes.type||'text'},text:node.attributes.type==='password'?'•'.repeat(value.length):value,visible:true,children:[]},
    {id:node.id+'-placeholder',name:'Placeholder',kind:'text',tag:'span',inputRole:'placeholder',styles:{...textStyles,width:'100%',flexGrow:'0',position:'absolute',left:'0px',top:'0px',color:s['--ads-placeholder-color']||s.color,opacity:s['--ads-placeholder-opacity']||'1'},attributes:{},text:node.attributes.placeholder||'',visible:Boolean(selectedValues.showPlaceholder??!value),children:[]}
   ]};
  }
  // Figma lists a variant property's values in the order their first owning
  // master was created, not numeric/alphabetic order - a lone {} bootstrap
  // entry here used to seed every axis's DEFAULT value first, regardless of
  // where that value actually sits in the property's own authored options
  // (e.g. Size defaults to 40 out of [24,28,32,36,40,44,48,56], so 40 jumped
  // to the front of the dropdown ahead of 24). Sweeping each options/boolean
  // axis through its own value list first - holding every other axis at its
  // default - visits each axis's default in its true authored position
  // instead of jumping it to the front, and still naturally produces the
  // one true all-defaults combo as a side effect (whichever axis is swept
  // first passes through its own default value, which is exactly that
  // combo). The explicit c.variants entries (real authored combinations,
  // e.g. the full appearance x state matrix) still follow and fill in
  // anything the per-axis sweep alone wouldn't reach.
  const axisSweep=axes.flatMap(p=>p.type==='boolean'?[false,true].map(value=>({[p.id]:value})):(p.options||[]).map(value=>({[p.id]:value})));
  // Trailing, not leading: the sweep above already produces the one true
  // all-defaults combo as a side effect whenever there's at least one axis;
  // this is only a safety net for the no-axis/no-variant case (configs
  // would otherwise end up empty) and, placed last, it can never jump an
  // axis's default ahead of its own authored option order the way a
  // leading bootstrap did - configs.has(key) skips it as a no-op duplicate
  // in every other case.
  // The contract only lists variants whose styles differ from the base, so a
  // combination that happens to look identical (e.g. Visited at one size) had
  // no master at all and left a hole in the Figma variant matrix. Build every
  // combination of the options axes too whenever that stays within Figma's
  // 1000-variant guidance; the per-axis sweep above still fixes option order.
  const optionAxes=axes.filter(p=>p.type==='options'),crossSize=optionAxes.reduce((count,p)=>count*Math.max(1,(p.options||[]).length),1);
  const crossed=crossSize>1&&crossSize<=1000?optionAxes.reduce((rows,p)=>rows.flatMap(row=>(p.options||[]).map(value=>({...row,[p.id]:value}))),[{}]):[];
  for(const when of [...axisSweep,...crossed,...c.variants.map(v=>v.when),{}]){const values={...defaults,...c.selection,...when},key=JSON.stringify(axes.map(p=>[p.id,values[p.id]??p.default]));if(!configs.has(key))configs.set(key,{values,name:axes.length?axes.map(p=>axisName(p)+'='+String(values[p.id]??p.default).replace(/[,=]/g,' ')).join(', '):'Variant=Default'});}
  if(configs.size>1000)throw new Error('Split this component into smaller sets. Figma warns about performance above 1000 variants in one component.');
  await figma.loadFontAsync({family:'Inter',style:'Regular'});
  const fonts=new Map();
  const masters=[],masterSelections=new Map();
  const referenceMasters=new Map();
  async function referenceMaster(id){
   if(referenceMasters.has(id))return referenceMasters.get(id);const definition=c.references?.[id];if(!definition)return null;
   let master=pageNodes(['COMPONENT']).find(n=>n.getPluginData('ads-reference')===id);if(!master){master=figma.createComponent();master.setPluginData('ads-reference',id);}referenceMasters.set(id,master);
   if(Number(master.getPluginData('ads-reference-revision')||0)>definition.revision)throw new Error('Nested library component '+id+' has a newer revision. Refresh the reference before pushing.');
   master.name=definition.name;const tree=M.compile(definition,null,{includeHidden:true}).tree;const current=await update(master,tree,master);
   for(const child of master.children)if(child!==current&&child.getPluginData(PART)){child.visible=false;child.setPluginData('ads-retired','true');}
   master.layoutMode='VERTICAL';master.primaryAxisSizingMode='AUTO';master.counterAxisSizingMode='AUTO';master.fills=[];master.setPluginData('ads-reference-revision',String(definition.revision));return master;
  }
  if(set?.type==='COMPONENT'){
   const master=set,parent=master.parent||figma.currentPage,content=figma.createFrame();content.setPluginData(PART,'root-content');for(const child of [...master.children])content.appendChild(child);master.appendChild(content);master.setPluginData(VARIANT,configs.keys().next().value);master.setPluginData('ads-component','');for(const side of ['paddingTop','paddingRight','paddingBottom','paddingLeft'])master[side]=0;master.strokes=[];master.effects=[];set=figma.combineAsVariants([master],parent);
  }
  async function update(parent,n,master){
   let existing=parent.children?.find(child=>child.getPluginData(PART)===n.id),node=existing;
   const isInput=['input','textarea'].includes(n.tag);
   const isText=isInput||((n.kind==='text'||(n.kind==='icon'&&n.tag!=='svg'))&&!(n.children||[]).length);
   if(node?.type==='TEXT'&&n.inputPresentation){const old=node,role=old.getPluginData('ads-input-text')||'value';old.setPluginData(PART,n.id+'-'+role);node=figma.createFrame();parent.appendChild(node);node.setPluginData(PART,n.id);node.appendChild(old);}
   if(node&&n.tag==='svg'&&node.getPluginData('ads-svg')!==JSON.stringify(n)){node.remove();node=null;}
   if(node&&((isText&&node.type!=='TEXT')||(!isText&&node.type==='TEXT'))){warnings.add('Part kind changed; overrides for '+n.id+' may need review.');node.remove();node=null;}
   let reference=n.kind==='instance'&&n.reference?await referenceMaster(n.reference):null;
   if(n.kind==='instance'&&!reference){const target=c.adapters?.figma?.components?.[n.reference||n.id];if(target)reference=await figma.getNodeByIdAsync(target);}
   if(node?.type==='INSTANCE'&&reference&&node.swapComponent)node.swapComponent(reference);
   if(!node){
    if(reference)node=reference.createInstance();
    else if(n.tag==='svg'&&typeof figma.createNodeFromSvg==='function'){
     const xmlEscape=value=>String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
     // styles.fill/stroke override the raw attribute specifically to avoid
     // literal currentColor (meaningless once this becomes a standalone SVG
     // string with no CSS inheritance context for Figma's parser to resolve
     // it against) - but the captured style value can itself be a design
     // token reference like "var(--text-mid)", which is CSS syntax, not
     // valid inside a raw SVG attribute (stroke="var(--text-mid)" isn't a
     // color Figma's SVG parser understands, so it silently fails/defaults
     // rather than reading as a token). resolve() is the same helper used
     // everywhere else in this file to turn a token reference into its
     // actual value before handing it to the Figma API - icons need that
     // same resolution before being embedded as literal XML attributes.
     const svg=part=>'<'+part.tag+Object.entries({...part.attributes,...(part.styles.fill?{fill:resolve(part.styles.fill,c.tokens)}:{}),...(part.styles.stroke?{stroke:resolve(part.styles.stroke,c.tokens)}:{})}).map(([key,value])=>' '+key+'="'+xmlEscape(value)+'"').join('')+'>'+(part.children||[]).map(svg).join('')+'</'+part.tag+'>';
     node=figma.createNodeFromSvg(svg(n));node.setPluginData('ads-svg',JSON.stringify(n));
     // Most icons here only carry a viewBox (e.g. "0 0 24 24"), no explicit
     // width/height attribute, so createNodeFromSvg parses the artwork at
     // its native viewBox size and hands back a frame that size. The
     // generic resize() a few lines below then shrinks that frame to
     // whatever the CSS actually set (often 16px) - but a plain resize()
     // only moves the bounding box; it doesn't rescale children unless they
     // have SCALE constraints, which createNodeFromSvg's output doesn't set.
     // Left alone, the artwork stayed at its original 24x24 size inside a
     // 16x16 frame: either clipped down to whatever corner happened to be
     // inside the new bounds (frequently empty space, i.e. the icon
     // appearing to not render at all) or spilling visibly outside it.
     // Scaling every descendant with the frame it sits in is what actually
     // shrinks the path geometry to fit.
     (function scaleToFit(parent){for(const child of parent.children||[]){if('constraints'in child)child.constraints={horizontal:'SCALE',vertical:'SCALE'};scaleToFit(child);}})(node);
    }else if(n.tag==='img'&&/^data:image\/(?:png|jpeg|webp|gif);base64,/.test(n.attributes?.src||'')&&typeof figma.createImage==='function'){
     // A real picture (Avatar's Image appearance): an auto-layout-free frame whose fill is the embedded image, applied again at the end of styling
     // (the generic background pass would otherwise replace it with an empty fill).
     node=figma.createFrame();node.setPluginData('ads-image',n.attributes.src.slice(n.attributes.src.indexOf(',')+1));
    }else if(isText)node=figma.createText();
    else if(n.kind==='slot')node=figma.createFrame();
    else if(n.kind==='instance'){
     const target=c.adapters?.figma?.components?.[n.id];let component;
     if(target){component=await figma.getNodeByIdAsync(target);if(!component)try{component=await figma.importComponentByKeyAsync(target);}catch{}}
     if(component?.type==='COMPONENT')node=component.createInstance();else {node=figma.createFrame();warnings.add('Map instance part '+n.id+' to a Figma component ID or library key.');}
    }else node=figma.createFrame();
    parent.appendChild(node);node.setPluginData(PART,n.id);
   }
   if(isAuthoredInput&&n.id==='supporting-content'){
    const previousSlot=parent.children?.find(child=>child!==node&&child.getPluginData(PART)==='supporting-slot');
    if(previousSlot){node.appendChild(previousSlot);const helper=previousSlot.children?.find(child=>child.getPluginData(PART)==='helper');if(helper)node.insertChild(0,helper);}
   }
   node.name=n.name;node.visible=n.visible!==false;node.setPluginData('ads-retired','false');node.setPluginData('ads-kind',n.kind);const s=n.styles;parentCss.set(node.id,s);const margin=node.type==='TEXT'||n.tag==='svg'||n.ring?{t:0,r:0,b:0,l:0}:marginBox(s,c.tokens,parent.layoutMode);{const line=String(s.textDecorationLine||s.textDecoration||''),own=/line-through/.test(line)?'STRIKETHROUGH':/underline/.test(line)?'UNDERLINE':null;inheritedDecoration.set(node.id,own||inheritedDecoration.get(parent.id)||null);}
   // Hoisted so the generic width/height resize block further below (which
   // runs AFTER the inline-text-run branch computes this) can also see it -
   // see the comment at that block for why it needs to.
   let inlineTextRun=false;
   if(node.type==='INSTANCE')node.isExposedInstance=Boolean(n.exposeProperties);
   // References must be rebuilt on every push; retired bindings can otherwise
   // keep controlling layers after their property or selected state changes.
   if(node.componentPropertyReferences){const slot=node.type==='SLOT'&&node.componentPropertyReferences.slotContentId;node.componentPropertyReferences=slot?{slotContentId:slot}:{};}
   if(node.type==='TEXT'){
    const family=resolve(s.fontFamily,c.tokens).split(',')[0].replace(/["']/g,'').trim()||'Inter';const weight=number(s.fontWeight,c.tokens,400);const style=({100:'Thin',200:'Extra Light',300:'Light',400:'Regular',500:'Medium',600:'Semi Bold',700:'Bold',800:'Extra Bold',900:'Black'})[weight]||'Regular';
    const font={family,style:s.fontStyle==='italic'?(style==='Regular'?'Italic':style+' Italic'):style},fontKey=JSON.stringify(font);
    try{if(!fonts.has(fontKey))fonts.set(fontKey,figma.loadFontAsync(font));await fonts.get(fontKey);node.fontName=font;}catch{node.fontName={family:'Inter',style:'Regular'};warnings.add('Font unavailable: '+family+' '+font.style+'; Inter Regular used.');}
    // A checkbox/radio <input>'s own "value" attribute defaults to the
    // literal string "on" in every browser when no value="..." is
    // authored (confirmed: captured as attrs.value="on") - real browsers
    // never display this text anywhere, it only matters for form
    // submission, but this generic isInput branch doesn't know that and
    // was rendering it as this node's own visible characters, showing a
    // stray "on" directly over the checkbox/radio's own box graphic.
    const isCheckable=n.attributes.type==='checkbox'||n.attributes.type==='radio';
    const inputValue=isCheckable?'':(n.attributes.value||''),placeholder=isInput&&!isCheckable&&!inputValue;
    node.characters=isCheckable?'':isInput?(inputValue?(n.attributes.type==='password'?'•'.repeat(inputValue.length):inputValue):(n.attributes.placeholder||'')):(n.text||'');
    node.setPluginData('ads-input-text',n.inputRole||(isInput?(placeholder?'placeholder':'value'):''));
    node.fontSize=number(s.fontSize,c.tokens,14);await bind(node,'fontSize',s.fontSize);
    node.textDecoration=inheritedDecoration.get(node.id)||'NONE';
    const line=resolve(s.lineHeight,c.tokens);node.lineHeight=!line||line==='normal'?{unit:'AUTO'}:line.endsWith('%')?{unit:'PERCENT',value:parseFloat(line)}:{unit:'PIXELS',value:/(px|rem)$/.test(line)?number(line,c.tokens):Number(line)*node.fontSize};
    // Only a pixel/rem line-height binds cleanly - a PERCENT or AUTO node
    // value isn't the plain pixel number a FLOAT variable represents, so
    // binding those would silently attach the wrong magnitude.
    if(/(px|rem)$/.test(line))await bind(node,'lineHeight',s.lineHeight);
    node.letterSpacing={unit:'PIXELS',value:number(s.letterSpacing,c.tokens)};
    node.textAlignHorizontal=({center:'CENTER',right:'RIGHT',justify:'JUSTIFIED',end:c.context?.direction==='rtl'?'LEFT':'RIGHT',start:c.context?.direction==='rtl'?'RIGHT':'LEFT'})[s.textAlign]||'LEFT';
    // Figma never derives this from CSS - vertical-align/line-box centering
    // has no clean source property, and every text box in this system is
    // meant to center within whatever extra height its box ends up with
    // (buttons, badges, table cells, menu items...), so default to CENTER
    // rather than silently inheriting Figma's own TOP default.
    node.textAlignVertical='CENTER';
    // Figma's text "Resizing" has 3 real modes, but captured width/height
    // always resolve to SOME concrete pixel number from getComputedStyle -
    // even a plain hug-content label that never set an explicit width gets
    // one, so treating "width>0" as "this text has a real fixed width" (the
    // old, unconditional WIDTH_AND_HEIGHT-then-override rule two blocks
    // below used to do) landed nearly every text node in the system on
    // Fixed size/Auto height instead of Auto width. white-space:nowrap
    // alone isn't a reliable signal either - most short labels in this
    // system (Affix/Anchor/Calendar weekday cells/Empty's title/Number's
    // value/Progress's percent/Timeline's item titles, etc.) never bother
    // setting it, relying on just being short, so they were still landing
    // on Auto height instead of Auto width. The one ground-truth signal
    // available from a real browser capture is whether the text actually
    // rendered as one line or wrapped to several: its captured height is
    // whole multiples of its own line-height - ~1x for one line, ~2x+ once
    // it wraps. Comparing the two directly (rather than guessing from
    // static CSS properties that don't always correlate with the real
    // rendered outcome) is what actually matches what the live page showed
    // at capture time: a single line hugs both axes (Auto width); multiple
    // lines keep the captured width as a real constraint and hug height
    // only (Auto height).
    {
     const length=value=>/%|auto/.test(resolve(value,c.tokens))?0:number(value,c.tokens),textWidth=length(s.width),textHeight=length(s.height);
     const lineBox=node.lineHeight.unit==='PIXELS'?node.lineHeight.value:node.lineHeight.unit==='PERCENT'?node.fontSize*(node.lineHeight.value/100):node.fontSize*1.2;
     const wrapped=textHeight>0&&lineBox>0&&textHeight>lineBox*1.4;
     if(wrapped&&textWidth>0){node.resize(Math.max(1,textWidth),node.height);node.textAutoResize='HEIGHT';}
     else node.textAutoResize='WIDTH_AND_HEIGHT';
    }
   }else if('layoutMode'in node&&n.tag!=='svg'){
    // A node whose own text (n.text) is followed by real children, OR
    // whose children are themselves ALL plain text-kind leaves, is a
    // <label>Country<span class="required"> *</span></label>-style
    // inline text run - e.g. captureFormFieldProperties()'s required-
    // asterisk child, captured either as kind:'text' with a nested
    // required child (n.text set, Required was off during capture so
    // the span gets appended afterward) or as kind:'container' with two
    // literal text-leaf children (n.text empty, Required was ALREADY on
    // at capture time so component-workbench.js's own snapshot() walked
    // both the label's text node and the required span as real DOM
    // children instead - see snapshot()'s "element.children.length"
    // branch). Both shapes represent the exact same inline content; CSS
    // never actually stacks it, text plus an inline child/sibling span
    // flows on the SAME line (one inline formatting context) regardless
    // of the label's own block/inline display. Defaulting to the
    // display-driven VERTICAL fallback below stacked the asterisk BELOW
    // the label text instead of beside it - and since this frame's own
    // height gets fixed to whatever single line the label measured at,
    // with clipsContent on, that second stacked line rendered fully
    // outside the visible box: toggling Required in Figma flipped the
    // node's own `visible` correctly (confirmed directly - the property
    // binding was never the bug) but the now-visible text was clipped
    // away before it could be seen. Force HORIZONTAL for both shapes so
    // the asterisk lands beside the label text, on the same line, the
    // same way the browser always rendered it - independent of whether
    // Required happened to be on or off at the moment of capture.
    // An explicit column flex box (Alert's body: heading above supporting text) is a stack, never an inline run - treating its all-text children as one
    // run drew heading and supporting text side by side.
    // Two or more block-level text children (Modal's body copy above its error message) also stack vertically; only inline pieces
    // (a label followed by a required asterisk) form a run on one line.
    const blockText=(n.children||[]).filter(k=>k.kind==='text'&&(/^(p|h[1-6])$/.test(k.tag||''))).length;
    const columnStack=((s.display==='flex'||s.display==='inline-flex')&&/^column/.test(s.flexDirection||''))||(blockText>=2&&!/flex|grid/.test(s.display||'')&&!['span','a','label'].includes(n.tag));
    inlineTextRun=!columnStack&&((n.text&&(n.children||[]).length)||((n.children||[]).length&&n.children.every(child=>child.kind==='text'&&!(child.children||[]).length)));
    node.layoutMode=inlineTextRun?'HORIZONTAL':s.display==='flex'||s.display==='inline-flex'?(/^column/.test(s.flexDirection||'')?'VERTICAL':'HORIZONTAL'):'VERTICAL';
    // presentInput()'s synthetic wrapper (holds the real <input>'s
    // absolutely-positioned value/placeholder overlay pair) always carries
    // flexGrow:1 from the original <input>'s own CSS (width:0;flex:1 - the
    // standard "fill the row" technique) - but hugging its own content here
    // would size it to whichever of value/placeholder happens to be in
    // normal flow (the value text, since placeholder is absolute and
    // excluded from hug sizing), which is EMPTY whenever the field has no
    // typed value. An empty-text hug collapses this wrapper toward zero
    // width, and the placeholder (sized relative to the wrapper's own
    // width a few lines below) collapses right along with it - structurally
    // present and visible:true, but with no room to actually show, which is
    // why the placeholder text reads as "not missing, just not visible."
    // FIXED (not AUTO/hug) here lets the layoutGrow:1 assigned later behave
    // exactly like a real flex:1 input: fill the row, not hug empty text.
    node.primaryAxisSizingMode=n.inputPresentation?'FIXED':'AUTO';node.counterAxisSizingMode='AUTO';
    // FIXED only locks in whatever width this node already has at the
    // moment the mode is set - layoutGrow:1 (assigned a few lines below,
    // once this node is actually attached as parent.layoutMode's child)
    // is what actually grows it to fill the row, the same proven mechanism
    // already used everywhere else in this file (e.g. the value text's own
    // layoutGrow+TRUNCATE a few lines below). An EARLIER version of this
    // fix explicitly resized this node to parent.width-padding right here,
    // reasoning that layoutGrow's own fill might not have happened yet by
    // the time a child (the placeholder) reads this node's width - but
    // parent.width-padding ignores every OTHER sibling sharing this same
    // row (leading/trailing icon, the Clear button), several of which
    // (trailing-icon, clear) haven't even been built yet at this point in
    // the walk, so there's no way to account for them here even if this
    // tried to. That explicit resize was reliably too wide - it overlapped
    // the Clear button whenever one was visible, instead of correctly
    // ceding it room. Leave the actual fill to layoutGrow (which Figma's
    // own auto-layout resolves against the real, complete row once every
    // child exists) - the placeholder's own constraints:{horizontal:
    // 'STRETCH'} below keeps it following this node's real width either
    // way, regardless of exactly when that resolves.
    node.primaryAxisAlignItems=({center:'CENTER','space-between':'SPACE_BETWEEN','flex-end':'MAX'})[s.justifyContent]||'MIN';node.counterAxisAlignItems=({center:'CENTER','flex-end':'MAX'})[s.alignItems]||'MIN';
    node.itemSpacing=number(s.gap,c.tokens);await bind(node,'itemSpacing',s.gap);
    for(const [field,key]of [['paddingTop','paddingTop'],['paddingRight','paddingRight'],['paddingBottom','paddingBottom'],['paddingLeft','paddingLeft']]){const extra={paddingTop:margin.t,paddingRight:margin.r,paddingBottom:margin.b,paddingLeft:margin.l}[field]||0;node[field]=number(s[key]||s.padding,c.tokens)+extra;if(!extra)await bind(node,field,s[key]||s.padding);}
    node.clipsContent=['hidden','clip'].includes(s.overflow);
   }
   if('fills'in node&&n.tag!=='svg'){const paintSource=node.type==='TEXT'?((isInput&&!n.attributes.value?s['--ads-placeholder-color']:s.color)||'#222222'):(s.backgroundColor||'transparent'),rgb=color(paintSource,c.tokens);node.fills=rgb?[{type:'SOLID',color:rgb,opacity:alpha(paintSource,c.tokens)}]:[];if(rgb)await bind(node,'fills',paintSource,'COLOR',true);}
   // CSS linear-gradient(...) backgrounds (the Card's media area) had no mapping and drew as an empty fill. Two or more colour stops become a Figma
   // linear gradient; the CSS angle (0deg = up, clockwise) is converted to Figma's inverse gradient transform.
   if('fills'in node&&node.type!=='TEXT'&&n.tag!=='svg'&&/^linear-gradient\(/.test(String(s.backgroundImage||''))){try{
    const bg=String(s.backgroundImage);let close=-1,level=0;for(let i=bg.indexOf('(');i<bg.length;i++){if(bg[i]==='(')level++;else if(bg[i]===')'&&--level===0){close=i;break;}}
    const inner=bg.slice(bg.indexOf('(')+1,close<0?bg.length:close),parts=[];let depth=0,cur='';
    for(const ch of inner){if(ch==='(')depth++;if(ch===')')depth--;if(ch===','&&depth===0){parts.push(cur.trim());cur='';}else cur+=ch;}
    if(cur.trim())parts.push(cur.trim());
    let deg=180;const dirs={'to top':0,'to right':90,'to bottom':180,'to left':270,'to top right':45,'to bottom right':135,'to bottom left':225,'to top left':315};
    if(/^-?[\d.]+deg$/.test(parts[0]||'')){deg=parseFloat(parts.shift());}else if(/^to /.test(parts[0]||'')){deg=dirs[parts.shift()]??180;}
    const stopsRaw=parts.map(part=>{const m=/^(.*?)(?:\s+(-?[\d.]+)%)?$/.exec(part);return{colorText:m[1].trim(),position:m[2]===undefined?null:parseFloat(m[2])/100};}).filter(stop=>color(stop.colorText,c.tokens));
    if(stopsRaw.length>=2){
     const stops=stopsRaw.map((stop,index)=>({color:{...color(stop.colorText,c.tokens),a:alpha(stop.colorText,c.tokens)},position:stop.position===null?index/(stopsRaw.length-1):stop.position}));
     const rad=deg*Math.PI/180,dx=Math.sin(rad),dy=-Math.cos(rad),sx=.5-dx/2,sy=.5-dy/2;
     node.fills=[{type:'GRADIENT_LINEAR',gradientStops:stops,gradientTransform:[[dx,dy,-(dx*sx+dy*sy)],[-dy,dx,-(-dy*sx+dx*sy)]]}];
    }
   }catch(e){}}
   if('cornerRadius'in node&&n.tag!=='svg'){node.cornerRadius=Math.max(0,number(s.borderRadius,c.tokens));await bind(node,'cornerRadius',s.borderRadius);for(const [field,key]of [['topLeftRadius','borderTopLeftRadius'],['topRightRadius','borderTopRightRadius'],['bottomLeftRadius','borderBottomLeftRadius'],['bottomRightRadius','borderBottomRightRadius']])if(s[key]){node[field]=Math.max(0,number(s[key],c.tokens));await bind(node,field,s[key]);}}
   if('strokes'in node&&n.tag!=='svg'){
    const sides=['Top','Right','Bottom','Left'],weights=sides.map(side=>['none','hidden'].includes(s['border'+side+'Style']||s.borderStyle)?0:number(s['border'+side+'Width']||s.borderWidth||s.border,c.tokens));
    const visibleSide=weights.findIndex(w=>w>0);
    // When every side's border-style is none/hidden, findIndex returns -1 -
    // sides[-1] is undefined, so the per-side color lookup silently fell
    // through to the bare s.borderColor (the browser's own computed
    // border-color, resolved from currentColor/text color even though no
    // border is actually drawn) instead of correctly treating "no visible
    // side" as "no stroke at all" the way the fills branch above already
    // does (defaulting to 'transparent' -> rgb=null -> fills=[]). strokeWeight
    // still came out 0 either way, hiding this visually, but every such node
    // still carried a non-empty strokes array bound to a real, misleading
    // Figma Variable that corresponds to nothing on the source page.
    const source=visibleSide<0?null:(s['border'+sides[visibleSide]+'Color']||s.borderColor),rgb=source?color(source,c.tokens):null;
    node.strokes=rgb?[{type:'SOLID',color:rgb,opacity:alpha(source,c.tokens)}]:[];node.strokeWeight=Math.max(...weights);node.strokeAlign='INSIDE';
    if('layoutMode'in node&&node.type!=='TEXT')for(const [index,side]of sides.entries())node['stroke'+side+'Weight']=weights[index];
    if(node.strokes.length)await bind(node,'strokes',source,'COLOR',true);
    // border-style dashed / dotted had no mapping at all (every border drew solid, so the Divider's Dashed and Dotted States looked like Solid).
    // Figma has one dash pattern for the whole stroke: dashes are about 3x the weight, dots about 1x with a matching gap.
    {const styleName=visibleSide<0?'':String(s['border'+sides[visibleSide]+'Style']||s.borderStyle||''),w=Math.max(1,Math.max(...weights));
     if(node.type!=='TEXT'&&node.strokes.length)node.dashPattern=styleName==='dashed'?[Math.max(4,w*3),Math.max(3,w*2)]:styleName==='dotted'?[w,Math.max(2,w*1.5)]:[];}
   }
   node.opacity=Math.max(0,Math.min(1,number(s.opacity,c.tokens,1)));
   // Every other numeric style field (fontSize, cornerRadius, itemSpacing,
   // padding) binds a live variable when its source is a var() reference -
   // opacity never did, so an opacity token never propagated past this
   // one draw the way editing a real token value in Figma should.
   await bind(node,'opacity',s.opacity);
   if(isInput&&!n.attributes.value)node.opacity*=number(s['--ads-placeholder-opacity'],c.tokens,1);
   node.effects=[];
   if(s.boxShadow){
    // s.boxShadow may itself be an unresolved "var(--shadow-none)" style
    // reference rather than the literal string "none" - checking the raw
    // captured value against 'none' missed that case (e.g. Float Button's
    // Elevation="None" token resolves to 'none' but isn't spelled that way
    // before resolve()), so it fell through to the shadow-syntax parser
    // below, which can't parse the bare word "none" and always warned.
    const raw=resolve(s.boxShadow,c.tokens);
    if(raw&&raw!=='none'){
     const match=raw.match(/#[\da-f]{6}|rgba?\([^)]+\)/i),rgb=match&&color(match[0],c.tokens),dimensions=raw.replace(match?.[0]||'','').match(/-?(?:\d*\.)?\d+(?:px|rem)?/g)?.map(value=>number(value,c.tokens));
     if(rgb&&dimensions?.length>=3){const alpha=match[0].startsWith('rgba')?Number(match[0].slice(5,-1).split(',')[3]):1;node.effects=[{type:raw.includes('inset')?'INNER_SHADOW':'DROP_SHADOW',color:{...rgb,a:Number.isFinite(alpha)?alpha:1},offset:{x:dimensions[0],y:dimensions[1]},radius:dimensions[2],spread:dimensions[3]||0,visible:true,blendMode:'NORMAL'}];}else warnings.add('Review unsupported shadow on '+n.name);
    }
   }
   // CSS outline (focus rings) is drawn as a real stroked ring layer further down (a DROP_SHADOW needs a fill to cast from, so on a transparent link it drew nothing).
   if(s.display==='grid')warnings.add('Grid part '+n.name+' uses a vertical Figma layout; review its placement.');
   // This node's OWN resize must happen BEFORE its children are processed,
   // not after - a child (e.g. an <input>'s value/placeholder text, which
   // reads `parent.width` a few lines below to decide its own fixed width)
   // was previously seeing this node still at its stale/default pre-resize
   // size, because the children-processing loop used to run first. That
   // silently gave placeholder/value text the wrong width - too narrow or
   // too wide relative to its real control box - which could clip it,
   // misalign it, or otherwise make it look wrong/invisible depending on
   // the control's own layout. TEXT's own resize()/textAutoResize is
   // already fully decided above (the wrap-detection Auto width/Auto
   // height logic) - this generic width/height-driven block only still
   // applies to non-text (frame/layout) nodes.
   const length=value=>/%|auto/.test(resolve(value,c.tokens))?0:number(value,c.tokens),width=length(s.width),height=length(s.height);
   // inlineTextRun (label+required and similar) must stay hug-width
   // (AUTO) regardless of its captured width - that capture reflects
   // whatever this node measured at THAT moment (e.g. Required off, so
   // no asterisk contributing width yet), and this generic block runs
   // AFTER the inline-text-run branch above already set AUTO specifically
   // so this node could grow - applying FIXED here from the stale
   // captured width undid that, silently re-introducing the exact
   // clipping bug that branch exists to prevent: toggling Required back
   // on in Figma correctly flipped the asterisk's own `visible`, but the
   // frame around it couldn't grow to fit it, clipping it away again.
   if(node.type!=='TEXT'&&(width>0||height>0)){node.resize(Math.max(1,width?width+margin.l+margin.r:node.width),Math.max(1,height?height+margin.t+margin.b:node.height));if('layoutMode'in node&&!inlineTextRun){
    // A frame whose captured size is exactly what its in-flow children (plus
    // gaps and padding) add up to was content-sized in CSS (inline-flex / auto
    // width). Drawing it FIXED froze it at one label length, so editing the
    // Label property or toggling the icon never resized the link or its ring.
    const flow=(n.children||[]).filter(k=>k.visible!==false&&k.styles?.position!=='absolute'&&k.styles?.display!=='none'),horizontal=node.layoutMode==='HORIZONTAL';
    const boxes=flow.map(k=>marginBox(k.styles,c.tokens,node.layoutMode)),sizes=flow.map((k,index)=>{const text=k.kind==='text'&&!(k.children||[]).length;return [length(k.styles?.width)+(text?0:boxes[index].l+boxes[index].r),length(k.styles?.height)+(text?0:boxes[index].t+boxes[index].b)];}),measurableMain=!n.text&&sizes.length>0&&sizes.every(([w,h])=>(horizontal?w:h)>0),measurableCross=!n.text&&sizes.length>0&&sizes.every(([w,h])=>(horizontal?h:w)>0);
    const pad=key=>number(s[key]||(key.startsWith('padding')?s.padding:0),c.tokens)||0,gap=number(s.gap,c.tokens)||0;
    const padMain=horizontal?pad('paddingLeft')+pad('paddingRight'):pad('paddingTop')+pad('paddingBottom'),padCross=horizontal?pad('paddingTop')+pad('paddingBottom'):pad('paddingLeft')+pad('paddingRight');
    const contentMain=measurableMain?sizes.reduce((sum,[w,h])=>sum+(horizontal?w:h),0)+gap*(sizes.length-1)+padMain:0,contentCross=measurableCross?Math.max(...sizes.map(([w,h])=>horizontal?h:w))+padCross:0;
    const mainSize=horizontal?width:height,crossSize=horizontal?height:width,near=(x,y)=>Math.abs(x-y)<=1.5;
    // A frame holding a flex-grow connector line along its own axis (Steps) can't be content-sized: a hugging parent gives the growing child nothing to
    // fill (Steps' connector lines collapsed to their minimum and every step packed together). Keep it FIXED at its captured size.
    const growsMain=flow.some(k=>/^connector/.test(k.name||'')&&(number(k.styles?.flexGrow,c.tokens)||0)>0),
    hugMain=measurableMain&&!growsMain&&mainSize>0&&near(mainSize,contentMain),hugCross=measurableCross&&crossSize>0&&near(crossSize,contentCross)&&!(!horizontal&&flow.some(k=>k.styles?.alignSelf==='stretch'&&k.kind!=='text'&&k.styles?.position!=='absolute'));
    node.primaryAxisSizingMode=mainSize>0&&!hugMain?'FIXED':'AUTO';node.counterAxisSizingMode=crossSize>0&&!hugCross?'FIXED':'AUTO';
   }else if('layoutMode'in node&&inlineTextRun){
    // A run of text (Badge's pill around its number) keeps whichever axis the contract does not size hugging: resize() above flipped both to FIXED.
    if(!width)node.primaryAxisSizingMode='AUTO';if(!height)node.counterAxisSizingMode='AUTO';
   }}
   // A scroll window (overflow + max-height, Modal's Scrollable body) hugs its content up to that height instead of being frozen at it.
   {const mhText=String(resolve(s.maxHeight,c.tokens)||'').trim();const mh=/^[\d.]+px$/.test(mhText)?parseFloat(mhText):0;
     if(mh>0&&['hidden','clip','auto','scroll'].includes(s.overflow)&&node.layoutMode==='VERTICAL'&&node.primaryAxisSizingMode==='AUTO'&&node.type==='FRAME'){try{node.maxHeight=mh;}catch(e){}}}
   if(parent.layoutMode&&parent.layoutMode!=='NONE'){
    node.layoutGrow=number(s.flexGrow,c.tokens)>0?1:0;
    // Stretch across whichever axis is actually the counter axis for this
    // parent's orientation - a VERTICAL parent's counter axis is
    // horizontal (width:100% means stretch), a HORIZONTAL parent's counter
    // axis is vertical (height:100% means stretch). The old check only
    // ever tested width:100%, so a child meant to stretch to fill a
    // HORIZONTAL parent's height never got STRETCH at all.
    let counterAxisFull=parent.layoutMode==='VERTICAL'?s.width==='100%':s.height==='100%';
    // CSS lets a child of a column flex container (align-items normal/stretch)
    // fill the container's width without ever saying width:100% - the capture
    // only records the resolved pixel width, so the child was drawn as a fixed
    // size in Figma instead of Fill container (Upload's dropzone, file rows,
    // etc.). When the child's captured width equals its parent's captured
    // content width, and nothing opts it out, treat it as stretched.
    if(!counterAxisFull&&parent.layoutMode==='VERTICAL'&&node.type!=='TEXT'&&n.kind!=='icon'){
     const ps=parentCss.get(parent.id),px=value=>{const m=/^(-?\d*\.?\d+)px$/.exec(String(resolve(value,c.tokens)||'').trim());return m?parseFloat(m[1]):null;};
     const optsOut=!!s.alignSelf&&!['auto','normal','stretch'].includes(s.alignSelf),parentStretches=!!ps&&(!ps.alignItems||['normal','stretch'].includes(ps.alignItems));
     if(parentStretches&&!optsOut&&ps.position!=='absolute'&&s.position!=='absolute'){
      const childWidth=px(s.width),parentWidth=px(ps.width);
      if(childWidth!==null&&parentWidth!==null){
       const side=key=>number(ps[key]||(key.startsWith('padding')?ps.padding:0),c.tokens)||0,pad=side('paddingLeft')+side('paddingRight'),border=(px(ps.borderLeftWidth)||0)+(px(ps.borderRightWidth)||0);
       if(Math.abs(childWidth-(parentWidth-pad-border))<=1.5||Math.abs(childWidth-(parentWidth-pad))<=1.5)counterAxisFull=true;
      }
     }
    }
    node.layoutAlign=s.alignSelf==='stretch'||counterAxisFull?'STRETCH':'INHERIT';
    // Text that fills its container's width must wrap inside it: an auto-width text with Fill container stays one line and runs past the
    // container (over the buttons below it). Fill width + auto height is the wrapping mode.
    if(node.type==='TEXT'&&node.textAutoResize==='WIDTH_AND_HEIGHT'&&(node.layoutAlign==='STRETCH'&&parent.layoutMode==='VERTICAL'||number(s.flexGrow,c.tokens)>0&&parent.layoutMode==='HORIZONTAL'))node.textAutoResize='HEIGHT';
    // This block (and the whole reason it needs to run before the
    // children-processing loop below, not after, which is where it used to
    // sit) resolves THIS node's own size as a CHILD of its parent -
    // layoutAlign:'STRETCH' is a declarative hint for Figma's own layout
    // engine to resize this node later, not a synchronous resize the
    // plugin script can rely on having already happened by its next line.
    // A width:100% node (e.g. Input's .input-demo-control, captured as the
    // literal unresolved string "100%" rather than a real pixel value - the
    // generic width/height resize above treats any %-bearing value as
    // unresolved and skips it) was staying at Figma's default frame size
    // all the way through its own children being processed, since the
    // stretch resolution ran AFTER that loop - any child that reads this
    // node's width to size itself (an absolutely-positioned placeholder
    // overlay, for instance) baked in that stale, too-small width instead
    // of the real one. Explicitly resizing here, synchronously, whenever
    // the parent's own width/height is already known removes the
    // dependency on that reactive-recalculation timing entirely.
    if(counterAxisFull&&node.type!=='TEXT'){
     // resize() on an auto-layout frame flips BOTH sizing modes to FIXED, which silently froze every stretched frame's height (Modal's
     // header, body and footer) at its captured size; put back the modes decided above once the width has been applied.
     const keepModes=node.layoutMode&&node.layoutMode!=='NONE'&&'primaryAxisSizingMode'in node?[node.primaryAxisSizingMode,node.counterAxisSizingMode]:null,keepAlign=node.layoutAlign,keepGrow=node.layoutGrow;
     if(parent.layoutMode==='VERTICAL'&&parent.width)node.resize(Math.max(1,parent.width-(parent.paddingLeft||0)-(parent.paddingRight||0)),node.height);
     else if(parent.layoutMode==='HORIZONTAL'&&parent.height)node.resize(node.width,Math.max(1,parent.height-(parent.paddingTop||0)-(parent.paddingBottom||0)));
     if(keepModes){node.primaryAxisSizingMode=keepModes[0];node.counterAxisSizingMode=keepModes[1];}
     // resize() on a frame that is already Fill container resets that axis to Fixed in Figma (layoutAlign falls back to INHERIT) whenever the size
     // actually changes - a Collapse header row ended up hugging its text with the chevron stuck to the text. Put the Fill settings back.
     if(keepAlign==='STRETCH')node.layoutAlign='STRETCH';if(keepGrow===1)node.layoutGrow=1;
    }
    // Hug and Fill cannot both apply on one axis: a frame whose own sizing on the filled axis is still Hug (AUTO) stays hugging and ignores Fill
    // container. That is the default for any auto-layout frame given no captured size, which left Drawer's header/body/footer at their text width.
    // Switch that axis to FIXED so the fill (layoutAlign STRETCH / layoutGrow) actually takes effect.
    if(node.layoutMode&&node.layoutMode!=='NONE'&&'primaryAxisSizingMode'in node&&parent.layoutMode&&parent.layoutMode!=='NONE'&&node.layoutPositioning!=='ABSOLUTE'){
     const pH=parent.layoutMode==='HORIZONTAL',grow=node.layoutGrow===1,stretch=node.layoutAlign==='STRETCH';
     // Only where the PARENT has a definite size on that axis: filling a hugging parent has nothing to fill, and fixing the child there would
     // collapse the parent to the child's default size.
     const parentFixedH=(pH?parent.primaryAxisSizingMode:parent.counterAxisSizingMode)==='FIXED',parentFixedV=(pH?parent.counterAxisSizingMode:parent.primaryAxisSizingMode)==='FIXED';
     const fillH=(pH?grow:stretch)&&parentFixedH,fillV=(pH?stretch:grow)&&parentFixedV;
     if(fillH){if(node.layoutMode==='HORIZONTAL')node.primaryAxisSizingMode='FIXED';else node.counterAxisSizingMode='FIXED';}
     if(fillV){if(node.layoutMode==='VERTICAL')node.primaryAxisSizingMode='FIXED';else node.counterAxisSizingMode='FIXED';}
    }
    // A real <input>/<textarea single-line> NEVER visually wraps its value
    // or placeholder, no matter what its captured white-space/overflow
    // style says (the browser's own form-control rendering ignores
    // white-space for this) - 'HEIGHT' auto-resize keeps width fixed but
    // explicitly ALLOWS wrapping (Figma grows the box vertically to fit
    // reflowed lines), so a long value in a narrow captured box wrapped
    // into a multi-line, often visibly truncated/garbled mess instead of
    // staying on its one real line. 'TRUNCATE' keeps the same fixed width
    // without ever reflowing, matching how the live input actually looks.
    // layoutGrow:1 alone (no explicit width resize here) is the same fix
    // already applied above for the inputPresentation wrapper node, for the
    // same reason: an explicit parent.width-padding resize ignores every
    // OTHER sibling sharing this row (a leading/trailing icon, the Clear
    // button) - reliably too wide, overlapping or pushing past whichever
    // trailing icon/button is visible instead of correctly ceding it room
    // (reported: Date Picker's calendar icon sitting half outside the
    // field). Leave the actual fill width to layoutGrow, which Figma's own
    // auto-layout resolves against the real, complete row once every
    // sibling exists - TRUNCATE still needs SOME starting width, so keep
    // whatever this text node already has from its own hug-sizing above.
    if((isInput||n.inputRole==='value')&&parent.layoutMode==='HORIZONTAL'){node.layoutGrow=1;node.textAutoResize='TRUNCATE';node.textTruncation='ENDING';}
    if(n.inputRole==='placeholder'){
     node.textAutoResize='TRUNCATE';node.textTruncation='ENDING';
     // Absolutely-positioned (the presentInput() synthetic value/placeholder
     // overlay pair) never participates in auto-layout at all, so it has no
     // layoutGrow to lean on - it genuinely needs this explicit resize +
     // STRETCH constraint to span its containing block's width. A real
     // <input>'s own placeholder (not that overlay - e.g. Add-on, where
     // "yourcompany" is a plain HTML placeholder attribute, in NORMAL flow
     // next to a prefix/suffix sibling) already gets correct layoutGrow:1
     // from the isInput branch just above, against the real row Figma
     // resolves once every sibling exists - resizing it explicitly here too,
     // to a STALE parent.width read in the same tick layoutGrow is set,
     // conflicts with that (figma-use skill: resize() resets sizing modes,
     // so calling it right after setting a grow/fill directive is exactly
     // the ordering that gotcha warns about) - reported: Add-on's
     // placeholder not visible at all despite being structurally correct in
     // every check that doesn't involve real Figma's own resize ordering.
     if(s.position==='absolute'){if(n.ring){node.constraints={horizontal:'STRETCH',vertical:'STRETCH'};node.setPluginData('ads-ring-inset',String(n.ringInset));ringNodes.push(node);if(node.layoutMode&&node.layoutMode!=='NONE')node.layoutMode='NONE';}else{node.constraints={horizontal:'STRETCH',vertical:'MIN'};node.resize(Math.max(1,parent.width),Math.max(1,node.height));}}
    }
    node.layoutPositioning=s.position==='absolute'?'ABSOLUTE':'AUTO';
   }
   if(s.position==='absolute'){
    // length() (defined above) deliberately zeroes out any %-bearing value
    // for width/height, since those need Figma's own STRETCH resolution -
    // reusing it here for left/top meant EVERY percentage-or-calc()-based
    // position (e.g. Slider's thumb: left:calc(60% - 8px), top:calc(50% -
    // 8px)) silently collapsed to x=0/y=0 regardless of its real value,
    // pinning every such node to its parent's top-left corner instead of
    // its intended spot (reported: thumbs/handles sitting off-center,
    // elements overlapping). The parent's own width/height are already
    // resolved by this point in the tree walk (parents are processed
    // before their children), so a percentage here can be resolved for
    // real instead of discarded.
    const left=percentOffset(s.left,c.tokens,parent.width),top=percentOffset(s.top,c.tokens,parent.height);
    node.x=left!=null?left:length(s.left);node.y=top!=null?top:length(s.top);
    // A layer hugging the right or bottom edge (Toast's Dismiss button: right:10px; its progress bar: bottom:0) has a captured left/top
    // that is only right for the card width it was measured at. Anchor it to that edge instead, so it follows the card when the card
    // is wider or hugs a different height.
    // An absolutely placed layer can ask to stay centred on an axis (justify-self / align-self: center) - Tooltip's arrow follows the
    // bubble's centre however wide the tooltip hugs.
    const anchorOf=v=>v==='center'?'CENTER':(v==='flex-end'||v==='end')?'MAX':'MIN';
    if(!n.ring&&['center','flex-end','end','flex-start','start'].some(v=>s.justifySelf===v||s.alignSelf===v)){node.constraints={horizontal:anchorOf(s.justifySelf),vertical:anchorOf(s.alignSelf)};
     // The parent's real size is only known once it has been laid out around its content, so the final position is worked out after the masters are built (see the anchor pass).
     node.setPluginData('ads-anchor',JSON.stringify({h:s.justifySelf||'',v:s.alignSelf||''}));}
    else if(!n.ring&&n.tag!=='svg'&&node.type!=='TEXT'){
     // Includes calc() offsets such as calc(-1 * 6px) (Badge's top/right), which sit slightly outside the parent.
     const edge=key=>{if(s[key]===undefined)return null;const t=String(resolve(s[key],c.tokens)||'').trim();if(t==='auto'||t==='')return null;const v=number(s[key],c.tokens,NaN);return Number.isFinite(v)?v:null;};
     const rightPx=edge('right'),bottomPx=edge('bottom'),leftPx=edge('left'),topPx=edge('top');
     const nearEdge=v=>v!==null&&v>=-16&&v<=16;
     const full=leftPx!==null&&rightPx!==null&&Math.abs(leftPx)<1.5&&Math.abs(rightPx)<1.5;
     const anchorRight=!full&&nearEdge(rightPx)&&(leftPx===null||leftPx>rightPx),anchorBottom=nearEdge(bottomPx)&&(topPx===null||topPx>bottomPx);
     if(full||anchorRight||anchorBottom){
      node.constraints={horizontal:full?'STRETCH':anchorRight?'MAX':'MIN',vertical:anchorBottom?'MAX':'MIN'};
      if(full)node.resize(Math.max(1,parent.width),Math.max(1,node.height));
      else if(anchorRight)node.x=parent.width-node.width-rightPx;
      if(anchorBottom)node.y=parent.height-node.height-bottomPx;
      // The layer's own size is only final once its content has laid out (a Badge ring hugging its number), so the offset from the edge is re-applied in
      // the anchor pass after the masters are built.
      if(!full)node.setPluginData('ads-anchor',JSON.stringify({mode:'offset',right:anchorRight?rightPx:null,bottom:anchorBottom?bottomPx:null,left:leftPx===null?0:leftPx,top:topPx===null?0:topPx}));
     }
    }
   }
   if(n.tag!=='svg'&&!['INSTANCE','TEXT','SLOT'].includes(node.type)){
    // A checkbox/radio <input> is a real DOM element purely for
    // accessibility/keyboard interaction (visually hidden via the sr-only
    // clip pattern, position:absolute, zero visible content once its
    // spurious "on" value text was fixed) - the box+label parts already
    // carry 100% of what's actually seen. Figma has no equivalent concept
    // of an invisible-but-real hit target, so pushing it just leaves a
    // stray, confusingly-named "input" layer with no visual content and
    // no purpose, sitting at (0,0) in the layers panel above/behind
    // whatever's actually drawn - excluded entirely rather than pushed as
    // an empty, functionless node.
    const isCheckableInput=child=>child.tag==='input'&&['checkbox','radio'].includes(child.attributes?.type);
    // width/height copied from the real, captured PARENT element (this
    // child is synthetic - invented here from the parent's own bare text
    // content, never itself captured from a real DOM node, so it has no
    // captured size of its own to fall back on). Without these, the
    // wrap-detection logic a few lines below sees textWidth/textHeight of
    // 0 for every such node and always takes the single-line hug-to-
    // natural-width branch, regardless of how long the text actually is or
    // how narrow its real container was - reported: Mention's placeholder
    // ("Type @ to mention someone", rendered via exactly this bare-text-on-
    // a-childless-container pattern) overflowing past its field's border
    // instead of wrapping/truncating the way it visibly did on the real page.
    // textAlign was missing here entirely - the synthetic node always came
    // out LEFT-aligned in Figma no matter what the real parent's CSS
    // text-align said, since the general per-node style pass a few lines
    // below only ever sees THIS styles object, never the parent's own
    // captured ones (reported: Transfer's "No available items."/"No items
    // selected." messages, and anything else rendered via this bare-text-
    // on-a-childless-container pattern with a non-left text-align, sitting
    // left-aligned in Figma instead of centered to match the real page).
    // flexGrow was missing too - a centered-but-hug-sized text box only
    // ever hugs its own text, so centering it still looks "off" against
    // the full container unless it actually spans the full width first.
    // Passing the parent's own flexGrow through makes the general
    // parent.layoutMode handling below set layoutGrow:1 ("Fill container"
    // in Figma's own Resizing property) the same way a real flex child
    // stretching to its row's full width would.
    const ring=outlineSpec(s,c.tokens),ringInset=ring?ring.width+ring.offset:0,ringChild=ring?[{id:n.id+'-focus-ring',name:'Focus ring',kind:'container',tag:'div',ring:true,ringInset,styles:{position:'absolute',left:(-ringInset)+'px',top:(-ringInset)+'px',...(width>0?{width:(width+2*ringInset)+'px'}:{}),...(height>0?{height:(height+2*ringInset)+'px'}:{}),display:'flex',backgroundColor:'transparent',borderTopWidth:ring.width+'px',borderRightWidth:ring.width+'px',borderBottomWidth:ring.width+'px',borderLeftWidth:ring.width+'px',borderTopStyle:'solid',borderRightStyle:'solid',borderBottomStyle:'solid',borderLeftStyle:'solid',borderTopColor:ring.colorText,borderRightColor:ring.colorText,borderBottomColor:ring.colorText,borderLeftColor:ring.colorText,borderRadius:(Math.max(0,number(s.borderRadius,c.tokens))+ring.offset)+'px',opacity:'1'},attributes:{},children:[]}]:[];
    const children=[...(n.text?[{id:n.id+'-direct-text',name:n.name+' text',kind:'text',tag:'span',text:n.text,styles:{fontFamily:s.fontFamily||'Inter',fontSize:s.fontSize||'14px',fontWeight:s.fontWeight||'400',lineHeight:s.lineHeight||'normal',color:s.color||'#222222',textAlign:s.textAlign,flexGrow:s.flexGrow,width:s.width,height:s.height,...(s['--ads-fill-text']==='1'?{alignSelf:'stretch'}:{})},attributes:{},children:[]}]:[]),...(n.children||[]).filter(child=>!isCheckableInput(child)),...ringChild];
    // column-reverse / row-reverse (Tooltip's Bottom and Right placements) put the DOM's first child last: Figma has no reverse direction, so reverse the layers.
    if(/-reverse$/.test(s.flexDirection||'')&&(s.display==='flex'||s.display==='inline-flex'))children.reverse();
    for(const [index,child]of children.entries()){const updated=await update(node,child,master);if(child.id===n.id+'-direct-text')updated.setPluginData('ads-text-owner',n.id);if(node.insertChild)node.insertChild(index,updated);}
    if('children'in node){const active=new Set(children.map(child=>child.id));for(const child of node.children)if(child.getPluginData(PART)&&!active.has(child.getPluginData(PART))){const slot=child.type==='SLOT'&&child.componentPropertyReferences?.slotContentId;child.componentPropertyReferences=slot?{slotContentId:slot}:{};child.visible=false;child.setPluginData('ads-retired','true');(function retireDescendants(n){for(const grandchild of n.children||[]){grandchild.visible=false;grandchild.setPluginData('ads-retired','true');retireDescendants(grandchild);}})(child);}}}
   const matrix=/^matrix\(([^)]+)\)/.exec(resolve(s.transform,c.tokens));
   node.rotation=matrix?-Math.atan2(Number(matrix[1].split(',')[1]),Number(matrix[1].split(',')[0]))*180/Math.PI:0;
   if(n.tag==='img'){const b64=node.getPluginData('ads-image');if(b64&&typeof figma.createImage==='function'&&figma.base64Decode){try{node.fills=[{type:'IMAGE',imageHash:figma.createImage(figma.base64Decode(b64)).hash,scaleMode:'FILL'}];node.clipsContent=true;}catch(error){warnings.add('Could not place an embedded image: '+error.message);}}}
   return node;
  }
  // Reading plugin data for every growing set child on every iteration made
  // a full Input import quadratic in calls across Figma's API boundary.
  const existingMasters=new Map((set?.children||[]).filter(node=>node.type==='COMPONENT').map(node=>[node.getPluginData(VARIANT),node]));
  const geometryTemplates=new Map(),cornerKeys=['borderRadius','borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius'];
  const previousDefaults=Object.fromEntries((previous?.properties||[]).map(p=>[p.id,p.default]));
  const committedKeys=new Set((previous?[{},...previous.variants.map(v=>v.when)]:[]).map(when=>{const values={...previousDefaults,...previous.selection,...when};return JSON.stringify(axes.map(p=>[p.id,values[p.id]??p.default]));}));
  onProgress(label+'Rendering '+configs.size+' variants');
  for(const [key,config]of configs){
   if(masters.length%48===0)onProgress(label+'Rendering variants '+masters.length+' / '+configs.size);
   let master=existingMasters.get(key);
   const reusable=!master||!committedKeys.has(key);
   if(!master){master=figma.createComponent();if(set)set.appendChild(master);master.setPluginData(VARIANT,key);}
   master.name=config.name;master.visible=true;
   const masterValues={...defaults,...Object.fromEntries(axes.map(p=>[p.id,config.values[p.id]]))};masterSelections.set(master,masterValues);const compiled=M.compile(c,masterValues,{includeHidden:true}),tree=presentInput(compiled.tree);
   // Component masters themselves carry the root part; update their contents in place.
   const virtual={...tree,id:'root-content'};
   const geometryKey=c.source?.page==='input-text-field.html'?JSON.stringify({tree:virtual,tokens:c.tokens},function(field,value){return field==='styles'&&this.id==='control'?Object.fromEntries(Object.entries(value).filter(([name])=>!cornerKeys.includes(name))):value;}):null;
   const template=geometryKey&&geometryTemplates.get(geometryKey);
   if(reusable&&template?.clone){
    const root=template.clone();for(const child of [...master.children])child.remove();master.appendChild(root);
    const control=ownedParts(master).find(n=>n.getPluginData(PART)==='control');
    let controlDefinition;(function visit(n){if(n.id==='control')controlDefinition=n;for(const child of n.children||[])visit(child);})(virtual);
    if(control&&controlDefinition){control.cornerRadius=number(controlDefinition.styles.borderRadius,c.tokens);for(const [field,css]of [['topLeftRadius','borderTopLeftRadius'],['topRightRadius','borderTopRightRadius'],['bottomLeftRadius','borderBottomLeftRadius'],['bottomRightRadius','borderBottomRightRadius']])control[field]=number(controlDefinition.styles[css],c.tokens);}
   }else await update(master,virtual,master);
   if(geometryKey&&!template)geometryTemplates.set(geometryKey,master.children.find(n=>n.getPluginData(PART)==='root-content'));
   master.layoutMode='VERTICAL';master.primaryAxisSizingMode='AUTO';master.counterAxisSizingMode='AUTO';master.fills=[];masters.push(master);
  }
  if(!set)set=figma.combineAsVariants(masters,figma.currentPage);set.name=c.name;
  await wireStateReactions(masters,c.properties);
  // Figma's own native description field (shown in the Assets panel,
  // component picker and library documentation - the exact mechanism
  // Figma's own help docs recommend for documenting components) is a
  // separate thing from the visual documentation frame below, which only a
  // reader already looking at this page would ever see. Set unconditionally
  // (even for a definitionOnly appearance-family sub-push) so every real
  // component set this plugin creates is self-documenting from Figma's own
  // UI, not just from a frame sitting next to it.
  const axisSummary=axes.map(p=>p.name).join(', ');
  set.description=(axisSummary?axisSummary+' properties. ':'')+masters.length+' variant'+(masters.length===1?'':'s')+'. Only one of each state should appear within the same area to maintain clear hierarchy.';
  // Failed property binding must not leave an unidentifiable, orphaned set.
  set.setPluginData('ads-component',c.id);write(set,c);
  // A CSS position:absolute child (a dropdown/panel that floats OVER
  // whatever sits below it on a real page - Cascader's Open-state panel,
  // any future popover-style part) is correctly excluded from its parent's
  // own auto-layout hug sizing, same as real CSS: it doesn't push the
  // page's own flow down, it just overlays on top. On a real scrolling
  // page that's invisible/harmless. On Figma's fixed canvas grid, every
  // master reserves only ITS OWN hug-sized box for the row-spacing below -
  // the floating child's real footprint still extends past that box and
  // visually bleeds into whatever the grid places directly underneath
  // (reported: Cascader's Open-state panel overlapping the row below).
  // Walk every descendant, accumulating each one's own y offset relative
  // to its immediate parent (so this needs no absoluteBoundingBox/
  // real-canvas geometry - plain child.y is already relative-to-parent at
  // every level) to find how far any visible absolutely-positioned part
  // actually reaches below the master's own top edge.
  function extraVisualHeight(node,offsetY){
   let max=0;
   for(const child of node.children||[]){
    const childOffset=offsetY+(child.y||0);
    if(child.visible!==false&&child.layoutPositioning==='ABSOLUTE')max=Math.max(max,childOffset+(child.height||0));
    max=Math.max(max,extraVisualHeight(child,childOffset));
   }
   return max;
  }
  let x=0,y=0,rowHeight=0;const columns=masters.length>24?12:masters.length;
  for(const [index,master]of masters.entries()){
   if(index&&index%columns===0){x=0;y+=rowHeight+32;rowHeight=0;}
   master.x=x;master.y=y;x+=master.width+32;rowHeight=Math.max(rowHeight,master.height,extraVisualHeight(master,0));
  }
  if(masters.length&&set.resize)set.resize(Math.max(...masters.map(master=>master.x+master.width))+16,Math.max(...masters.map(master=>master.y+Math.max(master.height,extraVisualHeight(master,0))))+16);
  // Documentation frame - a titled, backgrounded card grouping every
  // variant together (component name + a short description above a light
  // canvas holding every state), the same presentation a published UI kit
  // page uses, rather than leaving bare masters floating on the page with
  // no heading, no description and no visual grouping at all. Reused
  // across pushes (tracked by ads-doc-frame) so redrawing never duplicates
  // it or resets its position if it's been moved.
  // Skipped for a definitionOnly push (each appearance family inside
  // pushAppearanceFamilies/pushButtonFamily) - those are internal sub-
  // components the wrapper instance-swaps between, not independently
  // documented parts of the file. Without this guard, merging N appearances
  // put N+1 full documentation cards on the same page (one per family, plus
  // the wrapper's own) instead of the one real "Button" card a reader
  // actually wants; pushAppearanceFamilies already repositions each family's
  // bare component set in a neat row below the wrapper's own card.
  let docFrame,canvasFrame;
  if(!options.definitionOnly){
  docFrame=pageNodes(['FRAME']).find(n=>n.getPluginData('ads-doc-frame')===c.id);
  let titleNode,descriptionNode,guidelinesNode;
  if(!docFrame){
   docFrame=figma.createFrame();docFrame.name=c.name+' — Documentation';docFrame.setPluginData('ads-doc-frame',c.id);
   docFrame.layoutMode='VERTICAL';docFrame.primaryAxisSizingMode='AUTO';docFrame.counterAxisSizingMode='AUTO';
   docFrame.itemSpacing=20;docFrame.paddingTop=32;docFrame.paddingBottom=32;docFrame.paddingLeft=32;docFrame.paddingRight=32;
   docFrame.fills=[{type:'SOLID',color:{r:0.11,g:0.12,b:0.14}}];
   const rightmost=figma.currentPage.children.reduce((max,node)=>node===docFrame?max:Math.max(max,(node.x||0)+(node.width||0)),0);
   docFrame.x=rightmost+96;docFrame.y=0;
   titleNode=figma.createText();await figma.loadFontAsync({family:'Inter',style:'Bold'});titleNode.fontName={family:'Inter',style:'Bold'};titleNode.fontSize=24;titleNode.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}];titleNode.textAutoResize='WIDTH_AND_HEIGHT';titleNode.setPluginData('ads-doc-part','title');docFrame.appendChild(titleNode);
   descriptionNode=figma.createText();descriptionNode.fontName={family:'Inter',style:'Regular'};descriptionNode.fontSize=13;descriptionNode.lineHeight={unit:'PERCENT',value:150};descriptionNode.fills=[{type:'SOLID',color:{r:0.68,g:0.69,b:0.72}}];descriptionNode.resize(560,descriptionNode.height);descriptionNode.textAutoResize='HEIGHT';descriptionNode.setPluginData('ads-doc-part','description');docFrame.appendChild(descriptionNode);
   // Usage guidelines - the component's own captured accessibility/usage
   // notes (c.accessibility, the same list Markdown Export already
   // documents each component with), rendered as real text on the
   // component's own Figma page instead of staying website-only
   // documentation. Hidden (not created with content) for a component with
   // nothing captured, rather than showing an empty "Guidelines" block.
   guidelinesNode=figma.createText();guidelinesNode.fontName={family:'Inter',style:'Regular'};guidelinesNode.fontSize=12;guidelinesNode.lineHeight={unit:'PERCENT',value:160};guidelinesNode.fills=[{type:'SOLID',color:{r:0.56,g:0.58,b:0.62}}];guidelinesNode.resize(560,guidelinesNode.height);guidelinesNode.textAutoResize='HEIGHT';guidelinesNode.setPluginData('ads-doc-part','guidelines');docFrame.appendChild(guidelinesNode);
   canvasFrame=figma.createFrame();canvasFrame.name='Canvas';canvasFrame.layoutMode='VERTICAL';canvasFrame.primaryAxisSizingMode='AUTO';canvasFrame.counterAxisSizingMode='AUTO';canvasFrame.paddingTop=24;canvasFrame.paddingBottom=24;canvasFrame.paddingLeft=24;canvasFrame.paddingRight=24;canvasFrame.cornerRadius=12;canvasFrame.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}];canvasFrame.strokeWeight=1;canvasFrame.strokes=[{type:'SOLID',color:{r:0.85,g:0.85,b:0.87}}];canvasFrame.dashPattern=[4,4];canvasFrame.clipsContent=false;canvasFrame.setPluginData('ads-doc-part','canvas');docFrame.appendChild(canvasFrame);
  }else{
   titleNode=docFrame.children.find(node=>node.getPluginData('ads-doc-part')==='title');
   descriptionNode=docFrame.children.find(node=>node.getPluginData('ads-doc-part')==='description');
   guidelinesNode=docFrame.children.find(node=>node.getPluginData('ads-doc-part')==='guidelines');
   canvasFrame=docFrame.children.find(node=>node.getPluginData('ads-doc-part')==='canvas');
  }
  if(titleNode)titleNode.characters=c.name;
  if(descriptionNode)descriptionNode.characters=set.description;
  if(guidelinesNode){
   const notes=Array.isArray(c.accessibility)?c.accessibility.filter(Boolean):[];
   guidelinesNode.visible=notes.length>0;
   if(notes.length)guidelinesNode.characters='Usage guidelines\n'+notes.map(note=>'•  '+note).join('\n');
  }
  if(canvasFrame&&set.parent!==canvasFrame)canvasFrame.appendChild(set);
  }
  // Hidden variants still participate in Figma's variant-schema validation.
  // Keeping old State-only masters here makes the new multi-axis set invalid.
  // Preserve their IDs and instance links in separate sets, grouped by axes.
  const retired=new Map();
  for(const master of [...set.children])if(master.type==='COMPONENT'&&!masters.includes(master)){
   const key=JSON.stringify(JSON.parse(master.getPluginData(VARIANT)||'[]').map(pair=>pair[0]).sort());
   if(!retired.has(key))retired.set(key,[]);retired.get(key).push(master);
  }
  for(const group of retired.values()){
   const archive=figma.combineAsVariants(group,set.parent||figma.currentPage);
   archive.name=c.name+' — previous variants';archive.setPluginData('ads-archive-of',c.id);archive.visible=false;
   warnings.add('Previous variants were preserved in a separate archive set; their existing instances remain linked.');
  }
  // Variants can be cloned from a template master, and a clone is a different node than the one recorded in ringNodes, so find every ring in the finished masters by its plugin data instead.
  for(const master of masters)(function collect(node){if(node.getPluginData&&(node.getPluginData('ads-ring-inset')||String(node.getPluginData(PART)||'').endsWith('-focus-ring'))&&!ringNodes.includes(node))ringNodes.push(node);for(const child of node.children||[])collect(child);})(master);
  for(const ringNode of ringNodes){
   try{
    const inset=Number(ringNode.getPluginData('ads-ring-inset'))||Math.max(0,-(ringNode.x||0)),host=ringNode.parent;
    if(host&&'width'in host&&inset>0){if('primaryAxisSizingMode'in ringNode){ringNode.primaryAxisSizingMode='FIXED';ringNode.counterAxisSizingMode='FIXED';}ringNode.resize(Math.max(1,host.width+2*inset),Math.max(1,host.height+2*inset));ringNode.x=-inset;ringNode.y=-inset;}
   }catch(error){warnings.add('Could not size a focus ring: '+error.message);}
  }
  // Anchored absolute layers (Tooltip's arrow): place each on its parent's FINAL size. The along-the-edge axis is centred; the other axis puts the
  // layer's centre on the edge it points out of. The rotation is about the top-left corner, so the corner is solved for from the wanted centre.
  for(const master of masters)(function anchorPass(node){
   if(node.getPluginData&&node.getPluginData('ads-anchor')&&node.parent&&'width'in node.parent){
    try{
     const spec=JSON.parse(node.getPluginData('ads-anchor')),parent=node.parent,pw=parent.width,ph=parent.height,w=node.width,h=node.height,rad=(node.rotation||0)*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad);
     if(spec.mode==='offset'){
      node.x=spec.right!==null?pw-w-spec.right:spec.left;node.y=spec.bottom!==null?ph-h-spec.bottom:spec.top;
      node.constraints={horizontal:spec.right!==null?'MAX':'MIN',vertical:spec.bottom!==null?'MAX':'MIN'};
     }else{
     const at=(v,size)=>v==='center'?size/2:(v==='flex-end'||v==='end')?size:0,anchorOf=v=>v==='center'?'CENTER':(v==='flex-end'||v==='end')?'MAX':'MIN';
     const cx=at(spec.h,pw),cy=at(spec.v,ph);
     node.x=cx-(cos*(w/2)+sin*(h/2));node.y=cy-(-sin*(w/2)+cos*(h/2));
     node.constraints={horizontal:anchorOf(spec.h),vertical:anchorOf(spec.v)};
     }
    }catch(error){warnings.add('Could not anchor a layer: '+error.message);}
   }
   for(const child of node.children||[])anchorPass(child);
  })(master);
  onProgress(label+'Preparing property bindings');
  const propertyMap=JSON.parse(set.getPluginData('ads-property-map')||'{}');
  for(const [id,key]of Object.entries(propertyMap))if(!c.properties.some(p=>p.id===id)){if(set.deleteComponentProperty)set.deleteComponentProperty(key);delete propertyMap[id];warnings.add('Removed property '+id+'; review dependent instance overrides.');}
  const partDefinitions=new Map();(function visit(n){partDefinitions.set(n.id,n);for(const child of n.children||[])visit(child);})(c.anatomy);
  if(isAuthoredInput)for(const definition of [...partDefinitions.values()].filter(n=>n.tag==='input')){
   partDefinitions.set(definition.id+'-value',{...definition,id:definition.id+'-value',kind:'text'});
   partDefinitions.set(definition.id+'-placeholder',{...definition,id:definition.id+'-placeholder',kind:'text',bind:definition.attributeBindings?.placeholder,visibleWhen:[{property:'showPlaceholder',equals:true}]});
  }
  const ownedByMaster=new Map(masters.map(master=>[master,ownedParts(master)]));
  const rulesByMaster=new Map(masters.map(master=>[master,c.variants.filter(v=>Object.entries(v.when).every(([key,value])=>masterSelections.get(master)[key]===value))]));
  const bindingRows=masters.flatMap(master=>ownedByMaster.get(master).map(node=>{
   const partId=node.getPluginData('ads-text-owner')||node.getPluginData(PART),definition=partDefinitions.get(partId),values=masterSelections.get(master);
   return {node,type:node.type,definition,inputText:node.getPluginData('ads-input-text'),values,
    conditions:isAuthoredInput&&partId==='clear'?(['Disabled','Read-Only'].includes(values.state)?[]:[{property:'allowClear',equals:true}]):rulesByMaster.get(master).reduce((rules,v)=>v.overrides?.[partId]?.visibleWhen||rules,definition?.visibleWhen||[]),
    hidden:definition?.hiddenWhen?.length&&definition.hiddenWhen.every(rule=>rule.not?values[rule.property]!==rule.equals:values[rule.property]===rule.equals),references:{}};
  }));
  for(const p of nativeProperties.filter(p=>['text','boolean','swap','slot'].includes(p.type))){
   onProgress(label+'Binding '+p.name);
   const type={text:'TEXT',boolean:'BOOLEAN',swap:'INSTANCE_SWAP',slot:'SLOT'}[p.type],reference=type==='INSTANCE_SWAP'?await referenceMaster(p.default):null;if(type==='INSTANCE_SWAP'&&!reference&&!c.adapters?.figma?.components?.[p.id])continue;
   const defaultValue=type==='INSTANCE_SWAP'?(reference?.id||c.adapters.figma.components[p.id]):p.default;
   if(!propertyMap[p.id]){
    // Recover properties created by a previous interrupted push. Figma may
    // already contain them even if the contract metadata was not committed.
    const candidates=Object.entries(set.componentPropertyDefinitions).filter(([key,definition])=>key.split('#')[0]===p.name&&definition.type===type);
    if(candidates.length)propertyMap[p.id]=candidates[0][0];
   }
   if(propertyMap[p.id]&&!set.componentPropertyDefinitions[propertyMap[p.id]])delete propertyMap[p.id];
   if(propertyMap[p.id]&&set.componentPropertyDefinitions[propertyMap[p.id]]?.type!==type){if(set.deleteComponentProperty)set.deleteComponentProperty(propertyMap[p.id]);delete propertyMap[p.id];warnings.add('Changed type for '+p.name+'; review its instance overrides.');}
   if(!propertyMap[p.id]){try{propertyMap[p.id]=set.addComponentProperty(p.name,type,defaultValue);}catch(error){warnings.add('Property '+p.name+': '+error.message);continue;}}
   else if(set.editComponentProperty){
    const key=propertyMap[p.id],definition=set.componentPropertyDefinitions[key];
    // Figma rejects a SLOT edit containing only its unchanged name. Slots
    // have no ordinary scalar defaultValue to update.
    if(key.split('#')[0]!==p.name||(type!=='SLOT'&&definition.defaultValue!==defaultValue))try{propertyMap[p.id]=set.editComponentProperty(key,type==='SLOT'?{name:p.name}:{name:p.name,defaultValue})||key;}catch(error){warnings.add('Property '+p.name+': '+error.message);}
   }
   set.setPluginData('ads-property-map',JSON.stringify(propertyMap));
   // Nested instances inherit their master's plugin data. Their descendants
   // can therefore have the same part IDs, but Figma forbids assigning
   // componentPropertyReferences on those instance sublayers.
   for(const row of bindingRows){
    const {definition,inputText,values,conditions,hidden,references}=row;
    const textBinding=inputText==='placeholder'?definition?.attributeBindings?.placeholder:definition?.bind;
    if(textBinding===p.id&&type==='TEXT'&&row.type==='TEXT'&&!(inputText==='value'&&definition?.attributes?.type==='password'))references.characters=propertyMap[p.id];
    if(type==='BOOLEAN'&&!hidden&&conditions.some(rule=>rule.property===p.id&&rule.equals===true&&!rule.not)&&conditions.filter(rule=>rule.property!==p.id).every(rule=>rule.not?values[rule.property]!==rule.equals:values[rule.property]===rule.equals))references.visible=propertyMap[p.id];
    if(type==='INSTANCE_SWAP'&&definition?.bind===p.id&&row.type==='INSTANCE')references.mainComponent=propertyMap[p.id];
    if(type==='SLOT'&&definition?.bind===p.id&&['FRAME','SLOT'].includes(row.type))references.slotContentId=propertyMap[p.id];
   }
  }
  for(const {node,references}of bindingRows)if(Object.keys(references).length||Object.keys(node.componentPropertyReferences||{}).length)node.componentPropertyReferences=references;
  // Earlier interrupted imports could create the same named property twice.
  // Remove only duplicates of our authored properties which no sublayer uses.
  // Keep every referenced/custom property and the canonical mapped property.
  const referenced=new Set(bindingRows.flatMap(row=>Object.values(row.references)));
  const finalDefinitions=set.componentPropertyDefinitions;
  for(const p of nativeProperties){const canonical=propertyMap[p.id];if(!canonical)continue;const type=finalDefinitions[canonical]?.type;
   for(const [key,definition]of Object.entries(finalDefinitions))if(key!==canonical&&key.split('#')[0]===p.name&&definition.type===type&&!referenced.has(key))set.deleteComponentProperty(key);
  }
  onProgress(label+'Updating preview instance');
  const currentKey=JSON.stringify(axes.map(p=>[p.id,c.selection[p.id]??p.default])),current=masters.find(master=>master.getPluginData(VARIANT)===currentKey)||masters[0];
  let preview;
  if(!options.definitionOnly){preview=pageNodes(['INSTANCE']).find(node=>node.getPluginData('ads-preview')===c.id);if(!preview){preview=current.createInstance();preview.setPluginData('ads-preview',c.id);preview.x=set.x;preview.y=set.y+set.height+64;}
  else if(preview.swapComponent)preview.swapComponent(current);
  const values=Object.fromEntries(axes.map(p=>[axisName(p),String(c.selection[p.id]??p.default)]));for(const p of nativeProperties){const key=propertyMap[p.id];if(!key)continue;if(['text','boolean'].includes(p.type))values[key]=isAuthoredInput&&p.id==='allowClear'?clearVisible:c.selection[p.id]??p.default;if(p.type==='swap'){const value=c.selection[p.id]??p.default,reference=await referenceMaster(value);if(reference)values[key]=reference.id;}}
  if(preview.setProperties)preview.setProperties(values);
  if(['checkbox-default.html','radio-default.html'].includes(c.source?.page))await buildShowcaseGrid(c,canvasFrame,masters,propertyMap);
  }
  const definitions=set.componentPropertyDefinitions,propertySummary={};
  for(const definition of Object.values(definitions))propertySummary[definition.type]=(propertySummary[definition.type]||0)+1;
  if(c.source?.page==='input-text-field.html'){
   const missing=c.properties.filter(p=>['text','boolean','swap','slot'].includes(p.type)&&!definitions[propertyMap[p.id]]).map(p=>p.name);
   if(missing.length)throw new Error('Figma did not create these Input properties: '+missing.join(', ')+'. '+[...warnings].join(' '));
  }
  for(const p of axes.filter(p=>p.type==='boolean'))warnings.add(p.name+' styling is exposed through the '+axisName(p)+' axis as well as its Boolean property.');
  set.setPluginData('ads-axis-map',JSON.stringify(Object.fromEntries(axes.map(p=>[p.id,axisName(p)]))));set.setPluginData('ads-property-map',JSON.stringify(propertyMap));write(set,c);if(preview){figma.currentPage.selection=[preview];figma.viewport.scrollAndZoomIntoView([preview]);}figma.commitUndo();
  return {componentId:c.id,nodeId:set.id,previewNodeId:preview?.id,selectedMasterId:current.id,revision:c.revision,variantCount:masters.length,propertySummary,warnings:[...warnings]};
 }
 async function pull(componentId){
  let set=pageNodes(['COMPONENT_SET','COMPONENT']).find(n=>n.getPluginData('ads-component')===componentId);
  if(!set){const selected=figma.currentPage.selection?.[0];if(selected&&['COMPONENT_SET','COMPONENT'].includes(selected.type))set=selected;else throw new Error('Select an existing local component or component set in Figma, or open the page containing the linked component.');}
  let c=read(set);const importing=!c;if(!c){c=M.blank(set.name||'Figma component');c.id=componentId;c.properties=[];c.selection={};c.authority='figma';c.source={kind:'figma-import'};}
  if(c.adapters?.figma?.layout==='appearance-families'){
   const families=c.adapters.figma.appearanceFamilies,pulled=[];for(const family of families)pulled.push({appearance:family.appearance,contract:(await pull(family.id)).contract});
   const previewNode=pageNodes(['INSTANCE']).find(n=>n.getPluginData('ads-preview')===componentId),appearanceValue=previewNode?.componentProperties?.Appearance;
   const appearance=appearanceValue?.value??appearanceValue??c.selection.appearance,selected=pulled.find(item=>item.appearance===appearance)||pulled[0];
   c.properties=[c.properties.find(p=>p.id==='appearance'),...selected.contract.properties];c.selection={...selected.contract.selection,appearance};c.anatomy=selected.contract.anatomy;c.tokens=Object.assign({},c.tokens,...pulled.map(item=>item.contract.tokens));
   c.variants=pulled.flatMap(item=>item.contract.variants.map(variant=>({...variant,id:M.id(item.appearance)+'-'+variant.id,when:{appearance:item.appearance,...variant.when}})));
   c.authority='figma';M.assert(c);write(set,c);return {contract:c,nodeId:set.id};
  }
  const propertyMap=JSON.parse(set.getPluginData('ads-property-map')||'{}'),axisMap=JSON.parse(set.getPluginData('ads-axis-map')||'{}');
  if(!importing){
   const parts=new Map();(function visit(n){parts.set(n.id,n);for(const child of n.children||[])visit(child);})(c.anatomy);
   const actual=ownedParts(set).filter(node=>Boolean(node.getPluginData(PART)));
   for(const p of c.properties){const key=propertyMap[p.id];if(!key)continue;let definition=set.componentPropertyDefinitions[key];if(!definition){const linked=actual.find(node=>{const part=parts.get(node.getPluginData('ads-text-owner')||node.getPluginData(PART));return part?.bind===p.id||part?.visibleWhen?.some(rule=>rule.property===p.id);});const newKey=linked?.componentPropertyReferences?.[{text:'characters',boolean:'visible',swap:'mainComponent',slot:'slotContentId'}[p.type]];if(newKey&&set.componentPropertyDefinitions[newKey]){propertyMap[p.id]=newKey;definition=set.componentPropertyDefinitions[newKey];}}
    if(definition)p.name=propertyMap[p.id].split('#')[0];
   }
   const removed=new Set(c.properties.filter(p=>propertyMap[p.id]&&!set.componentPropertyDefinitions[propertyMap[p.id]]).map(p=>p.id));
   c.properties=c.properties.filter(p=>!removed.has(p.id));for(const id of removed){delete c.selection[id];delete propertyMap[id];delete axisMap[id];}
   for(const part of parts.values()){if(removed.has(part.bind))delete part.bind;part.visibleWhen=(part.visibleWhen||[]).filter(rule=>!removed.has(rule.property));part.hiddenWhen=(part.hiddenWhen||[]).filter(rule=>!removed.has(rule.property));for(const key of Object.keys(part.styleBindings||{}))if(removed.has(part.styleBindings[key]))delete part.styleBindings[key];for(const key of Object.keys(part.attributeBindings||{}))if(removed.has(part.attributeBindings[key]))delete part.attributeBindings[key];}
   for(const variant of c.variants)for(const id of removed)delete variant.when[id];c.behaviors=(c.behaviors||[]).filter(rule=>!removed.has(rule.property));
  }
  for(const [key,definition]of Object.entries(set.componentPropertyDefinitions||{})){
   if(Object.values(propertyMap).includes(key))continue;const name=key.split('#')[0];if(definition.type==='VARIANT'&&(c.properties.some(p=>p.name===name)||Object.values(axisMap).includes(name)))continue;
   const type={TEXT:'text',BOOLEAN:'boolean',VARIANT:'options',INSTANCE_SWAP:'swap',SLOT:'slot'}[definition.type];if(!type)continue;
   const id='figma-'+M.id(name),p={id,name,type,default:definition.defaultValue??(type==='boolean'?false:'')};if(type==='options'){p.options=definition.variantOptions||[String(p.default)];if(!p.options.includes(p.default))p.default=p.options[0];}
   if(c.properties.some(p=>p.id===id))continue;c.properties.push(p);c.selection[id]=p.default;propertyMap[id]=key;
   if(type==='swap')c.adapters.figma.components={...(c.adapters.figma.components||{}),[id]:p.default};
  }
  for(const p of c.properties){const definition=set.componentPropertyDefinitions[propertyMap[p.id]];if(definition&&['text','boolean'].includes(p.type)){p.default=definition.defaultValue;c.selection[p.id]=definition.defaultValue;}}
  const definitions=new Map();(function visit(n){definitions.set(n.id,n);for(const child of n.children||[])visit(child);})(c.anatomy);
  async function css(node){const styles={opacity:String(node.opacity)};if(node.type==='TEXT'){styles.fontSize=node.fontSize+'px';styles.fontFamily=node.fontName.family;}
   function tokenFor(variable,field,fallback){
    if(!variable)return null;let token=Object.keys(c.tokens).find(token=>variable.name===token||variable.name===variableName(token));
    if(!token){token='--'+variable.name.replace(/[^a-zA-Z0-9_-]/g,'-');let value;try{value=variable.resolveForConsumer?.(node)?.value;}catch{}value??=variable.value??Object.values(variable.valuesByMode||{})[0];
     if(value&&typeof value==='object'&&'r'in value)c.tokens[token]='#'+[value.r,value.g,value.b].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');else if(typeof value==='number')c.tokens[token]=String(value)+(['opacity','fontWeight'].includes(field)?'':'px');else c.tokens[token]=typeof value==='string'?value:String(fallback||'0px');
     (c.adapters.figma.variableMap||={})[token]=variable.key||variable.id;
    }return token;
   }
   if('layoutMode'in node&&node.layoutMode!=='NONE'){styles.display='flex';styles.flexDirection=node.layoutMode==='VERTICAL'?'column':'row';styles.gap=node.itemSpacing+'px';for(const field of ['paddingTop','paddingRight','paddingBottom','paddingLeft'])styles[field]=node[field]+'px';}
   if(typeof node.cornerRadius==='number')styles.borderRadius=node.cornerRadius+'px';
   const paint=Array.isArray(node.fills)&&node.fills[0];if(paint?.type==='SOLID'){const rgb=paint.color;styles[node.type==='TEXT'?'color':'backgroundColor']='#'+[rgb.r,rgb.g,rgb.b].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');}
   for(const [field,alias]of Object.entries(node.boundVariables||{})){if(alias&&alias.id){const variable=await figma.variables.getVariableByIdAsync(alias.id),key=field==='itemSpacing'?'gap':field,token=tokenFor(variable,key,styles[key]);if(token)styles[key]='var('+token+')';}}
   if(paint?.boundVariables?.color){const variable=await figma.variables.getVariableByIdAsync(paint.boundVariables.color.id),key=node.type==='TEXT'?'color':'backgroundColor',token=tokenFor(variable,key,styles[key]);if(token)styles[key]='var('+token+')';}
   if(node.type!=='TEXT'&&node.layoutMode){if((node.layoutMode==='HORIZONTAL'?node.primaryAxisSizingMode:node.counterAxisSizingMode)==='FIXED')styles.width=node.width+'px';if((node.layoutMode==='HORIZONTAL'?node.counterAxisSizingMode:node.primaryAxisSizingMode)==='FIXED')styles.height=node.height+'px';}
   return styles;
  }
  const masters=set.type==='COMPONENT'?[set]:set.children.filter(n=>n.type==='COMPONENT'&&n.visible);
  async function rebuild(node){
   let part=node.getPluginData(PART);if(part==='root-content')part=c.anatomy.id;
   if(!part){part='figma-'+node.id.replace(/[^a-zA-Z0-9_-]/g,'-');node.setPluginData(PART,part);}
   if(node.getPluginData('ads-svg'))return {...JSON.parse(node.getPluginData('ads-svg')),id:part};
   const old=definitions.get(part),definition=old?M.clone(old):{id:part,name:node.name,kind:node.type==='TEXT'?'text':node.type==='INSTANCE'?'instance':'container',tag:node.type==='TEXT'?'span':'div',styles:{},children:[]};
   const bound=node.componentPropertyReferences||{},textProperty=Object.keys(propertyMap).find(id=>propertyMap[id]===bound.characters),visibilityProperty=Object.keys(propertyMap).find(id=>propertyMap[id]===bound.visible),swapProperty=Object.keys(propertyMap).find(id=>propertyMap[id]===bound.mainComponent);
   if(textProperty)definition.bind=textProperty;if(visibilityProperty)definition.visibleWhen=[{property:visibilityProperty,equals:true}];if(swapProperty){definition.bind=swapProperty;definition.kind='instance';c.adapters.figma.components={...(c.adapters.figma.components||{}),[part]:c.properties.find(p=>p.id===swapProperty).default};}
   definition.name=node.name;definition.styles={...definition.styles,...await css(node)};if(node.type==='TEXT'&&!definition.bind)definition.text=node.characters;
   // The two native text layers are a Figma presentation of one HTML input.
   // Keep its authored input semantics on pull rather than exporting children
   // inside a void HTML element.
   if(c.source?.page==='input-text-field.html'&&old?.tag==='input'&&node.type==='FRAME'){definition.children=[];return definition;}
   // Instance sublayers belong to their nested master and must not be flattened.
   if(node.type==='INSTANCE'){definition.children=[];return definition;}
   definition.children=[];for(const child of node.children||[])if(child.getPluginData('ads-retired')!=='true'){if(child.getPluginData('ads-text-owner'))definition.text=child.characters;else definition.children.push(await rebuild(child));}return definition;
  }
  const firstRoot=masters[0]?.children.find(node=>node.getPluginData(PART)==='root-content')||(importing?masters[0]:null);if(!firstRoot)throw new Error('Linked root part is missing. Restore it in Figma before pulling.');
  c.anatomy=await rebuild(firstRoot);definitions.clear();(function visit(n){definitions.set(n.id,n);for(const child of n.children||[])visit(child);})(c.anatomy);
  for(const variant of c.variants)for(const part of Object.keys(variant.overrides||{}))if(!definitions.has(part))delete variant.overrides[part];
  for(const master of masters){const config=JSON.parse(master.getPluginData(VARIANT)||'[]'),when=Object.fromEntries(config);for(const [name,value]of Object.entries(master.variantProperties||{})){const p=c.properties.find(p=>p.name===name||axisMap[p.id]===name);if(p?.type==='options'){const original=p.options.find(option=>String(option)===value);if(original===undefined)p.options.push(value);when[p.id]=original??value;}else if(p?.type==='boolean')when[p.id]=value==='true';}const variant=c.variants.find(v=>JSON.stringify(v.when)===JSON.stringify(when))||{id:'figma-'+master.id.replace(/:/g,'-'),name:master.name,when,overrides:{}};
   for(const node of ownedParts(master)){let part=node.getPluginData('ads-text-owner')||node.getPluginData(PART);if(part==='root-content')part=c.anatomy.id;const definition=definitions.get(part);if(!definition||node.getPluginData('ads-retired')==='true')continue;if(node.getPluginData('ads-text-owner')){variant.overrides[part]||={};variant.overrides[part].text=node.characters;continue;}const styles=await css(node);variant.overrides[part]={...(variant.overrides[part]||{}),styles:{...(variant.overrides[part]?.styles||{}),...styles},visible:node.visible};for(const key of Object.keys(definition.styleBindings||{}))if(key in styles)(variant.overrides[part].styleBindings||={})[key]=null;if(node.type==='TEXT')variant.overrides[part].text=node.characters;}
   if(!c.variants.includes(variant))c.variants.push(variant);
  }
  c.authority='figma';c.adapters.figma.nodeId=set.id;M.assert(c);set.setPluginData('ads-property-map',JSON.stringify(propertyMap));write(set,c);return {contract:c,nodeId:set.id};
 }
 // Read-only: every variant's layers (geometry, auto layout, strokes, text decoration, property references) for layer-by-layer checks.
 function describeLayer(node){
  const layer=node=>({part:node.getPluginData(PART)||'',name:node.name,type:node.type,visible:node.visible,retired:node.getPluginData('ads-retired')==='true',x:Math.round((node.x||0)*100)/100,y:Math.round((node.y||0)*100)/100,width:Math.round(node.width*100)/100,height:Math.round(node.height*100)/100,layoutMode:node.layoutMode,layoutPositioning:node.layoutPositioning,layoutAlign:node.layoutAlign,layoutGrow:node.layoutGrow,primarySizing:node.primaryAxisSizingMode,counterSizing:node.counterAxisSizingMode,strokeWeight:typeof node.strokeWeight==='number'?node.strokeWeight:undefined,strokes:(node.strokes||[]).length,fills:(node.fills&&node.fills!==figma.mixed?node.fills.length:undefined),textDecoration:node.type==='TEXT'?node.textDecoration:undefined,characters:node.type==='TEXT'?node.characters:undefined,references:node.componentPropertyReferences,children:(node.children||[]).map(layer)});
  return layer(node);
 }
 async function inspectAll(componentId){
  const set=pageNodes(['COMPONENT_SET']).find(n=>n.getPluginData('ads-component')===componentId);
  if(!set)throw new Error('Linked component set not found.');
  const layer=node=>({part:node.getPluginData(PART)||'',name:node.name,type:node.type,visible:node.visible,retired:node.getPluginData('ads-retired')==='true',x:Math.round((node.x||0)*100)/100,y:Math.round((node.y||0)*100)/100,width:Math.round(node.width*100)/100,height:Math.round(node.height*100)/100,layoutMode:node.layoutMode,layoutPositioning:node.layoutPositioning,layoutAlign:node.layoutAlign,layoutGrow:node.layoutGrow,primarySizing:node.primaryAxisSizingMode,counterSizing:node.counterAxisSizingMode,strokeWeight:typeof node.strokeWeight==='number'?node.strokeWeight:undefined,strokes:(node.strokes||[]).length,fills:(node.fills&&node.fills!==figma.mixed?node.fills.length:undefined),textDecoration:node.type==='TEXT'?node.textDecoration:undefined,characters:node.type==='TEXT'?node.characters:undefined,references:node.componentPropertyReferences,children:(node.children||[]).map(layer)});
  return {componentId,nodeId:set.id,properties:set.componentPropertyDefinitions,masters:set.children.filter(n=>n.type==='COMPONENT').map(master=>({name:master.name,tree:layer(master)}))};
 }
 async function inspect(componentId){
  onProgress('Finding component set');
  const set=pageNodes(['COMPONENT_SET']).find(n=>n.getPluginData('ads-component')===componentId);
  if(!set)throw new Error('Linked component set not found.');
  const masters=set.children.filter(n=>n.type==='COMPONENT');
  onProgress('Reading '+masters.length+' variant names and property definitions');
  const source=read(set),familyRecords=source?.adapters?.figma?.layout==='appearance-families'?source.adapters.figma.appearanceFamilies:[];
  const familyDetails=[];for(const family of familyRecords){const familySet=await figma.getNodeByIdAsync(family.nodeId);if(familySet)familyDetails.push({appearance:family.appearance,nodeId:familySet.id,variantCount:familySet.children.filter(n=>n.type==='COMPONENT').length,properties:familySet.componentPropertyDefinitions,propertyMap:JSON.parse(familySet.getPluginData('ads-property-map')||'{}')});}
  const bindingsOmitted=masters.length>256;
  const preview=pageNodes(['INSTANCE']).find(n=>n.getPluginData('ads-preview')===componentId),selected=preview?(preview.getMainComponentAsync?await preview.getMainComponentAsync():preview.mainComponent):masters[0];
  const exposed=preview?.exposedInstances?.find(n=>n.getPluginData(PART)==='field'),fieldMaster=exposed?(exposed.getMainComponentAsync?await exposed.getMainComponentAsync():exposed.mainComponent):null;
  const summarize=master=>master?{nodeId:master.id,name:master.name,parts:ownedParts(master).map(n=>({part:n.getPluginData(PART),type:n.type,visible:n.visible,width:n.width,height:n.height,references:n.componentPropertyReferences}))}:null;
  const layerTrees=masters.length<=256?masters.map(master=>({name:master.name,tree:describeLayer(master)})):undefined;
  return {layerTrees,componentId,nodeId:set.id,variantCount:masters.length,configurationCount:familyRecords.length?source.variants.length:masters.length,layout:familyRecords.length?'appearance-families':'direct',families:familyDetails,variantNames:masters.map(master=>master.name),properties:set.componentPropertyDefinitions,propertyMap:JSON.parse(set.getPluginData('ads-property-map')||'{}'),selectedMaster:summarize(selected),selectedField:summarize(fieldMaster),exposedFieldProperties:exposed?.componentProperties,bindingsOmitted,bindings:bindingsOmitted?[]:masters.flatMap(master=>ownedParts(master).filter(n=>Object.keys(n.componentPropertyReferences||{}).length).map(n=>({variant:master.name,part:n.getPluginData(PART),references:n.componentPropertyReferences})))};
 }
 async function configure(componentId,values){
  const set=pageNodes(['COMPONENT_SET']).find(n=>n.getPluginData('ads-component')===componentId),node=pageNodes(['INSTANCE']).find(n=>n.getPluginData('ads-preview')===componentId);if(!set||!node)throw new Error('Draw this component before configuring its preview.');
  const c=read(set);M.assert({...c,selection:{...c.selection,...values}});
  let target=node,owner=set;
  if(c.adapters?.figma?.layout==='appearance-families'){
   if(values.appearance!==undefined)node.setProperties({Appearance:String(values.appearance)});
   target=node.exposedInstances?.find(n=>n.getPluginData(PART)==='field');if(!target)throw new Error('The exposed Field instance is missing.');
   const master=target.getMainComponentAsync?await target.getMainComponentAsync():target.mainComponent;owner=master.parent;
  }
  const propertyMap=JSON.parse(owner.getPluginData('ads-property-map')||'{}'),axisMap=JSON.parse(owner.getPluginData('ads-axis-map')||'{}'),properties={};
  for(const p of c.properties){if(!(p.id in values)||p.type==='slot')continue;const key=propertyMap[p.id]||axisMap[p.id];if(!key)continue;
   if(p.type==='options')properties[key]=String(values[p.id]);else if(['text','boolean'].includes(p.type))properties[key]=values[p.id];else if(p.type==='swap'){const reference=pageNodes(['COMPONENT']).find(n=>n.getPluginData('ads-reference')===values[p.id]);properties[key]=reference?.id||values[p.id];}
  }
  target.setProperties(properties);return {componentId,nodeId:node.id,properties:node.componentProperties,fieldProperties:target.componentProperties};
 }
 async function preview(componentId){const node=pageNodes(['INSTANCE']).find(n=>n.getPluginData('ads-preview')===componentId);if(!node)throw new Error('Draw this component before exporting a preview.');return {componentId,nodeId:node.id,width:node.width,height:node.height,png:Array.from(await node.exportAsync({format:'PNG',constraint:{type:'SCALE',value:2}}))};}
 // "Create Base Foundations" as its own first step, not a side effect of
 // whichever token a component happens to reference first: every token in
 // the full resolved Foundation set becomes a real variable up front, sorted
 // into its one of the 8 category collections. This is also the only way
 // Shadows and Icons ever get real variables at all today - no component's
 // own push() binds a shadow effect or an icon's own size to a live
 // variable the way fills/borders/spacing already do, so without this pass
 // those two categories would never exist.
 async function pushFoundations(tokens){
  onProgress('Export: establishing Foundation variables');
  const collectionsByCategory=await collectionsByCategoryMap();
  const variables=await figma.variables.getLocalVariablesAsync();
  const created=new Map(),warnings=[],resolving=new Set();
  async function ensure(token){
   if(created.has(token))return created.get(token);
   const raw=tokens[token];if(raw==null){warnings.push('No value for '+token);return null;}
   const aliasMatch=/^var\(\s*(--[\w-]+)\s*\)$/.exec(String(raw));
   let aliasOf=aliasMatch&&aliasMatch[1]!==token&&aliasMatch[1]in tokens?aliasMatch[1]:null;
   // Same cyclic-reference risk component-contract-model.js's own validate()
   // already guards against for an authored contract's tokens - this full
   // Foundation set is the website's own resolved output, not expected to
   // cycle, but a recursive alias chain with no cycle guard here would be an
   // infinite-recursion stack overflow instead of a clean, reportable error.
   if(aliasOf&&resolving.has(aliasOf)){warnings.push('Cyclic token reference: '+token+' → '+aliasOf);aliasOf=null;}
   resolving.add(token);
   const target=aliasOf?await ensure(aliasOf):null;
   resolving.delete(token);
   const rgb=!aliasOf?color(raw,tokens):null;
   const type=target?target.resolvedType:rgb?'COLOR':/^-?[\d.]+(px|rem)?$/.test(resolve(raw,tokens).trim())?'FLOAT':'STRING';
   const category=categoryFor(token);
   let collection=collectionsByCategory.get(category);
   if(!collection){collection=figma.variables.createVariableCollection(category+' Tokens');figma.root.setPluginData('ads-collection-'+M.id(category),collection.id);collectionsByCategory.set(category,collection);}
   let v=variables.find(v=>v.variableCollectionId===collection.id&&v.name===variableName(token));
   if(!v){
    v=figma.variables.createVariable(variableName(token),collection,type);variables.push(v);
    try{v.scopes=type==='COLOR'?['ALL_FILLS']:['ALL_SCOPES'];}catch{}
    if(typeof v.setVariableCodeSyntax==='function')try{v.setVariableCodeSyntax('WEB','var('+token+')');}catch{}
   }
   if(target)v.setValueForMode(collection.defaultModeId,{type:'VARIABLE_ALIAS',id:target.id});
   else{const value=type==='COLOR'?rgb:type==='FLOAT'?number(raw,tokens):resolve(raw,tokens);if(value!=null)v.setValueForMode(collection.defaultModeId,value);}
   created.set(token,v);return v;
  }
  for(const token of Object.keys(tokens))await ensure(token);
  // A short visual landing page naming every category and how many
  // variables it holds, so "Foundations" reads as a real, inspectable part
  // of the file rather than only existing invisibly inside the variables
  // panel.
  const page=await findOrCreatePage('Foundations','ads-foundations-page','foundations');
  figma.root.insertChild(0,page);
  await figma.setCurrentPageAsync(page);
  let frame=page.children.find(n=>n.getPluginData('ads-foundations-summary')==='true');
  if(!frame){frame=figma.createFrame();frame.setPluginData('ads-foundations-summary','true');frame.layoutMode='VERTICAL';frame.primaryAxisSizingMode='AUTO';frame.counterAxisSizingMode='AUTO';frame.itemSpacing=12;frame.paddingTop=32;frame.paddingBottom=32;frame.paddingLeft=32;frame.paddingRight=32;frame.fills=[{type:'SOLID',color:{r:0.11,g:0.12,b:0.14}}];}
  await figma.loadFontAsync({family:'Inter',style:'Bold'});await figma.loadFontAsync({family:'Inter',style:'Regular'});
  const title=frame.children.find(n=>n.getPluginData('ads-foundations-part')==='title')||(()=>{const t=figma.createText();t.setPluginData('ads-foundations-part','title');frame.appendChild(t);return t;})();
  title.fontName={family:'Inter',style:'Bold'};title.fontSize=24;title.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}];title.characters='Foundations';
  for(const category of CATEGORY_NAMES){
   const collection=collectionsByCategory.get(category);const count=variables.filter(v=>v.variableCollectionId===collection?.id).length;
   if(!count)continue;
   let row=frame.children.find(n=>n.getPluginData('ads-foundations-row')===category);
   if(!row){row=figma.createText();row.setPluginData('ads-foundations-row',category);frame.appendChild(row);}
   row.fontName={family:'Inter',style:'Regular'};row.fontSize=14;row.fills=[{type:'SOLID',color:{r:0.68,g:0.69,b:0.72}}];row.characters=category+' — '+count+' variable'+(count===1?'':'s');
  }
  return {created:created.size,collections:[...collectionsByCategory.entries()].filter(([,collection])=>variables.some(v=>v.variableCollectionId===collection.id)).map(([name])=>name),warnings};
 }
 // Export the whole catalog: one real Figma page per component (not one
 // shared page of bare masters), grouped under a named divider page per
 // category - Figma renders a page named with a dash border as a visual
 // section header in the Pages panel, so dividers plus insertion order are
 // enough structure without any folder API the Plugin API doesn't expose.
 // Each component still pushes through the exact same push() every
 // individual "Draw in Figma" button already uses and this session already
 // verified across all 69 live pages - only WHICH page is current when
 // push() runs changes here, via the real async page-switch this plugin's
 // dynamic-page manifest requires (no synchronous figma.currentPage
 // assignment is available).
 async function findOrCreatePage(name,key,value){
  let found=figma.root.children.find(p=>p.getPluginData(key)===value);
  if(!found){found=figma.createPage();found.name=name;found.setPluginData(key,value);}
  else if(found.name!==name)found.name=name;
  return found;
 }
 // Keeps a re-run's newly-added page grouped with its own category instead
 // of always landing at the very end of the page list, in case other pages
 // were created later (by this or another run) in between.
 function placeAfterCategory(category,page){
  page.setPluginData('ads-category',category);
  const siblings=figma.root.children.filter(p=>p!==page&&p.getPluginData('ads-category')===category);
  if(!siblings.length)return;
  const index=figma.root.children.indexOf(siblings[siblings.length-1])+1;
  figma.root.insertChild(index,page);
 }
 async function pushCatalog(items,tokens){
  const foundations=tokens?await pushFoundations(tokens):null;
  const results=[],warnings=foundations?[...foundations.warnings]:[],dividers=new Set();
  for(const [index,item]of items.entries()){
   onProgress('Export: '+item.category+' - '+item.name+' ('+(index+1)+'/'+items.length+')');
   // Divider creation lives inside the same try/catch as the component's
   // own push, not before it - a failure here must cost this one component,
   // never the rest of a 62-component run the way a capture failure outside
   // any try/catch once silently killed the whole website-side export loop.
   let page;
   try{
    if(!dividers.has(item.category)){
     onProgress('Export: organizing "'+item.category+'"');
     const divider=await findOrCreatePage('----- '+item.category+' -----','ads-category-divider',item.category);
     placeAfterCategory(item.category,divider);
     dividers.add(item.category);
    }
    page=await findOrCreatePage(item.name,'ads-component-page',item.contract.id);
    placeAfterCategory(item.category,page);
    await figma.setCurrentPageAsync(page);
    const result=await push(item.contract);
    results.push({id:item.contract.id,name:item.name,category:item.category,nodeId:result.nodeId,pageId:page.id,variantCount:result.variantCount,layout:result.layout||'direct',warnings:result.warnings});
    for(const warning of result.warnings)warnings.push(item.name+': '+warning);
   }catch(error){
    // A page is created for the component before push() runs (so push()'s
    // own figma.currentPage-scoped logic has somewhere to land) - if push()
    // then throws, that page is still sitting there, empty, as orphaned
    // clutter with nothing ever drawn on it. Remove it ONLY when it's
    // genuinely empty (nothing was ever successfully pushed to it, this run
    // or a previous one) - a page that already holds a prior successful
    // push must never be deleted just because a later re-push attempt
    // failed, or a transient failure would silently destroy real work.
    if(page&&!page.children.length)page.remove();
    results.push({id:item.contract.id,name:item.name,category:item.category,error:error.message});
    warnings.push(item.name+': '+error.message);
   }
  }
  return {total:items.length,pushed:results.filter(r=>!r.error).length,failed:results.filter(r=>r.error).length,results,warnings,foundations};
 }
 return {push,pull,inspect,inspectAll,preview,configure,pushCatalog,pushFoundations};
});

;
/* Native Figma Fetch transport. UI visibility never controls job execution. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.createDamcoBridgeRuntime=factory;})(globalThis,function(options){
 'use strict';
 const endpoint=options.endpoint||'http://localhost:3333',clientId='damco-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 const notify=options.notify||(()=>{});let running=false,pendingResult=null,activeJob=null,task=null;
 async function request(path,body){
  const response=await options.fetch(endpoint+path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await response.json();if(!response.ok){const error=new Error(data.error||'Bridge returned '+response.status);error.status=response.status;throw error;}return data;
 }
 async function deliver(){
  if(!pendingResult)return;
  try{await request('/bridge/result',pendingResult);}catch(error){if(error.status===404){pendingResult=null;notify({type:'warning',message:'The bridge lost this job, but Figma may have applied it. Inspect the component before drawing again.'});return;}throw error;}
  const result=pendingResult;pendingResult=null;notify({type:result.error?'error':'complete',message:result.error||'Completed.',result:result.result});
 }
 async function run(){
  try{
   if(typeof options.fetch!=='function')throw new Error('This Figma version does not expose native Fetch. Update Figma before connecting.');
   notify({type:'connection',connected:false,message:'Connecting to '+endpoint+'…'});
   await request('/bridge/connect',{clientId,build:options.build});
   notify({type:'connection',connected:true,message:'Connected. Ready to draw.'});
   while(running){
    await deliver();if(!running)break;
    const job=await request('/bridge/next?wait=10000&clientId='+encodeURIComponent(clientId));if(!job)continue;
    activeJob=job.jobId;report('Runtime received '+job.operation);
    try{pendingResult={jobId:job.jobId,result:await options.execute(job)};}catch(error){pendingResult={jobId:job.jobId,error:error.message||String(error)};}
    activeJob=null;await deliver();
   }
  }catch(error){running=false;notify({type:'connection',connected:false,message:error.message+' Start the bridge, then click Connect / Retry.'});}
 }
 function start(){if(running)return task;running=true;task=run();return task;}
 function stop(){running=false;}
 function report(phase){notify({type:'progress',phase,jobId:activeJob});if(activeJob&&typeof options.fetch==='function')request('/bridge/progress',{clientId,jobId:activeJob,phase}).catch(()=>{});}
 return {start,stop,report,get task(){return task;},get activeJob(){return activeJob;}};
});

;
/* The sandbox owns transport and scene work; the iframe displays status only. */
figma.showUI(__html__,{width:400,height:260});
const DAMCO_PLUGIN_BUILD='damco-native-bridge-2026-11-16-v79';
let adapter;
const bridge=createDamcoBridgeRuntime({build:DAMCO_PLUGIN_BUILD,fetch:typeof fetch==='function'?fetch:undefined,
 notify:message=>figma.ui.postMessage(message),
 execute:job=>job.operation==='ping'?{build:DAMCO_PLUGIN_BUILD,transport:'native-fetch'}:job.operation==='configure'?adapter.configure(job.componentId,job.values):job.operation==='pushCatalog'?adapter.pushCatalog(job.items,job.tokens):adapter[job.operation](job.operation==='push'?job.contract:job.componentId)});
adapter=createDamcoFigmaAdapter(figma,ADSComponentContract,phase=>bridge.report(phase));
figma.ui.onmessage=message=>{
 if(message.type==='hello')figma.ui.postMessage({type:'ready',build:DAMCO_PLUGIN_BUILD,transport:'native-fetch'});
 if(message.type==='hello'||message.type==='connect')bridge.start();
};
bridge.start();
