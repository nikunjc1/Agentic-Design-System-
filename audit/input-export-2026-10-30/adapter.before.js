/* Figma-specific mapping. Component IDs and part IDs are preserved during updates. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.createDamcoFigmaAdapter=factory;})(globalThis,function(figma,M){
 'use strict';
 const DATA='ads-contract',PART='ads-part',VARIANT='ads-variant';
 function write(node,c){const text=JSON.stringify(c),chunks=Math.ceil(text.length/24000);node.setPluginData(DATA+'-count',String(chunks));for(let i=0;i<chunks;i++)node.setPluginData(DATA+'-'+i,text.slice(i*24000,(i+1)*24000));node.setPluginData('ads-component',c.id);}
 function read(node){const count=Number(node.getPluginData(DATA+'-count'));if(!count)return null;return JSON.parse(Array.from({length:count},(_,i)=>node.getPluginData(DATA+'-'+i)).join(''));}
 function resolve(value,tokens){let text=String(value??'');for(let i=0;i<15&&text.includes('var(');i++)text=text.replace(/var\(\s*(--[\w-]+)\s*\)/g,(_,key)=>tokens[key]??'');return text;}
 function number(value,tokens,fallback=0){const text=resolve(value,tokens),n=parseFloat(text);return Number.isFinite(n)?n*(text.endsWith('rem')?16:1):fallback;}
 function color(value,tokens){let text=resolve(value,tokens),match;if(/^#[\da-f]{3,4}$/i.test(text))text='#'+[...text.slice(1)].map(char=>char+char).join('');if((match=/^#([\da-f]{6})([\da-f]{2})?$/i.exec(text)))return {r:parseInt(match[1].slice(0,2),16)/255,g:parseInt(match[1].slice(2,4),16)/255,b:parseInt(match[1].slice(4,6),16)/255};if((match=/^rgba?\(([^)]+)\)/.exec(text))){const values=match[1].split(/[,\s/]+/).filter(Boolean).map(Number);return {r:values[0]/255,g:values[1]/255,b:values[2]/255};}return null;}
 function alpha(value,tokens){const text=resolve(value,tokens),rgba=/^rgba\(([^)]+)\)/.exec(text);if(rgba)return Number(rgba[1].split(/[,\s/]+/).filter(Boolean)[3]??1);if(/^#[\da-f]{8}$/i.test(text))return parseInt(text.slice(-2),16)/255;if(/^#[\da-f]{4}$/i.test(text))return parseInt(text.slice(-1).repeat(2),16)/255;return 1;}
 function variableName(token){return token.replace(/^--/,'').replace(/-/g,'/');}
 async function push(c){
  M.assert(c);if(c.authority!=='contract')throw new Error('Contract must lead before pushing.');
  let set=figma.currentPage.findAll(n=>n.type==='COMPONENT_SET'&&n.getPluginData('ads-component')===c.id)[0]||figma.currentPage.findAll(n=>n.type==='COMPONENT'&&n.getPluginData('ads-component')===c.id)[0];
  const previous=set&&read(set);if(previous&&previous.revision>c.revision)throw new Error('Figma has a newer revision. Pull and review it first.');
  const warnings=new Set(),variables=await figma.variables.getLocalVariablesAsync(),collections=await figma.variables.getLocalVariableCollectionsAsync();
  let ownedCollection=collections.find(collection=>collection.id===figma.root.getPluginData('ads-variable-collection'));
  const variableMap=c.adapters?.figma?.variableMap||{};
  async function variable(token,type){
   const mapped=variableMap[token],existing=mapped?variables.find(v=>v.id===mapped||v.key===mapped):variables.find(v=>v.name===token||v.name===variableName(token));
   if(existing){if(existing.resolvedType!==type)return null;return existing;}
   if(mapped){try{return await figma.variables.importVariableByKeyAsync(mapped);}catch{warnings.add('Variable mapping unavailable: '+token);return null;}}
   if(!ownedCollection){ownedCollection=figma.variables.createVariableCollection('Contract Tokens');figma.root.setPluginData('ads-variable-collection',ownedCollection.id);}
   const v=figma.variables.createVariable(variableName(token),ownedCollection,type);variables.push(v);return v;
  }
  async function bind(node,field,source,type='FLOAT',paint=false){
   const token=/^var\(\s*(--[\w-]+)\s*\)$/.exec(source||'')?.[1];if(!token)return;
   const v=await variable(token,type);if(!v)return;
   if(v.variableCollectionId===ownedCollection?.id){const value=type==='COLOR'?color(c.tokens[token],c.tokens):type==='STRING'?resolve(c.tokens[token],c.tokens):number(c.tokens[token],c.tokens);if(value!=null)v.setValueForMode(ownedCollection.defaultModeId,value);}
   if(paint){const paints=node[field];node[field]=[figma.variables.setBoundVariableForPaint(paints[0],'color',v)];}else node.setBoundVariable(field,v);
  }
  const axes=c.properties.filter(p=>(p.type==='options'&&!p.multiple)||(p.type==='boolean'&&c.variants.some(v=>p.id in v.when))),configs=new Map(),axisName=p=>(p.name+(p.type==='boolean'?' variant':'')).replace(/[,=]/g,' ');
  const defaults=Object.fromEntries(c.properties.map(p=>[p.id,p.default]));
  for(const when of [{},...c.variants.map(v=>v.when)]){const values={...defaults,...c.selection,...when},key=JSON.stringify(axes.map(p=>[p.id,values[p.id]??p.default]));if(!configs.has(key))configs.set(key,{values,name:axes.length?axes.map(p=>axisName(p)+'='+String(values[p.id]??p.default).replace(/[,=]/g,' ')).join(', '):'Variant=Default'});}
  if(configs.size>256)throw new Error('Split this component into sets of at most 256 authored variants.');
  await figma.loadFontAsync({family:'Inter',style:'Regular'});
  const masters=[];
  const referenceMasters=new Map();
  async function referenceMaster(id){
   if(referenceMasters.has(id))return referenceMasters.get(id);const definition=c.references?.[id];if(!definition)return null;
   let master=figma.currentPage.findAll(n=>n.type==='COMPONENT'&&n.getPluginData('ads-reference')===id)[0];if(!master){master=figma.createComponent();master.setPluginData('ads-reference',id);}referenceMasters.set(id,master);
   if(Number(master.getPluginData('ads-reference-revision')||0)>definition.revision)throw new Error('Nested library component '+id+' has a newer revision. Refresh the reference before pushing.');
   master.name=definition.name;const tree=M.compile(definition,null,{includeHidden:true}).tree;await update(master,tree,master);master.layoutMode='VERTICAL';master.primaryAxisSizingMode='AUTO';master.counterAxisSizingMode='AUTO';master.fills=[];master.setPluginData('ads-reference-revision',String(definition.revision));return master;
  }
  if(set?.type==='COMPONENT'){
   const master=set,parent=master.parent||figma.currentPage,content=figma.createFrame();content.setPluginData(PART,'root-content');for(const child of [...master.children])content.appendChild(child);master.appendChild(content);master.setPluginData(VARIANT,configs.keys().next().value);master.setPluginData('ads-component','');for(const side of ['paddingTop','paddingRight','paddingBottom','paddingLeft'])master[side]=0;master.strokes=[];master.effects=[];set=figma.combineAsVariants([master],parent);
  }
  async function update(parent,n,master){
   let existing=parent.children?.find(child=>child.getPluginData(PART)===n.id),node=existing;
   const isText=n.kind==='text'||(n.kind==='icon'&&n.tag!=='svg');
   if(node&&((isText&&node.type!=='TEXT')||(!isText&&node.type==='TEXT'))){warnings.add('Part kind changed; overrides for '+n.id+' may need review.');node.remove();node=null;}
   if(!node){
    const reference=n.kind==='instance'&&n.reference?await referenceMaster(n.reference):null;
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
    }else if(isText)node=figma.createText();
    else if(n.kind==='slot')node=figma.createFrame();
    else if(n.kind==='instance'){
     const target=c.adapters?.figma?.components?.[n.id];let component;
     if(target){component=await figma.getNodeByIdAsync(target);if(!component)try{component=await figma.importComponentByKeyAsync(target);}catch{}}
     if(component?.type==='COMPONENT')node=component.createInstance();else {node=figma.createFrame();warnings.add('Map instance part '+n.id+' to a Figma component ID or library key.');}
    }else node=figma.createFrame();
    parent.appendChild(node);node.setPluginData(PART,n.id);
   }
   node.name=n.name;node.visible=n.visible!==false;node.setPluginData('ads-retired','false');const s=n.styles;
   if(node.type==='TEXT'){
    const family=resolve(s.fontFamily,c.tokens).split(',')[0].replace(/["']/g,'').trim()||'Inter';const weight=number(s.fontWeight,c.tokens,400);const style=weight>=700?'Bold':weight>=500?'Medium':'Regular';
    try{await figma.loadFontAsync({family,style});node.fontName={family,style};}catch{node.fontName={family:'Inter',style:'Regular'};warnings.add('Font unavailable: '+family+' '+style+'; Inter Regular used.');}
    node.characters=n.text||'';node.fontSize=number(s.fontSize,c.tokens,14);
    const line=resolve(s.lineHeight,c.tokens);if(line&&line!=='normal')node.lineHeight={unit:'PIXELS',value:line.endsWith('px')?parseFloat(line):Number(line)*node.fontSize};
    if(s.letterSpacing)node.letterSpacing={unit:'PIXELS',value:number(s.letterSpacing,c.tokens)};
   }else if('layoutMode'in node){
    node.layoutMode=s.display==='flex'||s.display==='inline-flex'?(s.flexDirection==='column'?'VERTICAL':'HORIZONTAL'):'VERTICAL';
    node.primaryAxisSizingMode='AUTO';node.counterAxisSizingMode='AUTO';
    node.primaryAxisAlignItems=({center:'CENTER','space-between':'SPACE_BETWEEN','flex-end':'MAX'})[s.justifyContent]||'MIN';node.counterAxisAlignItems=({center:'CENTER','flex-end':'MAX'})[s.alignItems]||'MIN';
    node.itemSpacing=number(s.gap,c.tokens);await bind(node,'itemSpacing',s.gap);
    for(const [field,key]of [['paddingTop','paddingTop'],['paddingRight','paddingRight'],['paddingBottom','paddingBottom'],['paddingLeft','paddingLeft']]){node[field]=number(s[key]||s.padding,c.tokens);await bind(node,field,s[key]||s.padding);}
    node.clipsContent=false;
   }
   if('fills'in node){const paintSource=node.type==='TEXT'?(s.color||'#222222'):(s.backgroundColor||'transparent'),rgb=color(paintSource,c.tokens);node.fills=rgb?[{type:'SOLID',color:rgb,opacity:alpha(paintSource,c.tokens)}]:[];if(rgb)await bind(node,'fills',paintSource,'COLOR',true);}
   if('cornerRadius'in node){node.cornerRadius=Math.max(0,number(s.borderRadius,c.tokens));await bind(node,'cornerRadius',s.borderRadius);}
   if('strokes'in node){const rgb=color(s.borderColor,c.tokens);node.strokes=rgb?[{type:'SOLID',color:rgb,opacity:alpha(s.borderColor,c.tokens)}]:[];node.strokeWeight=number(s.borderWidth||s.borderTopWidth||s.border,c.tokens);if(rgb)await bind(node,'strokes',s.borderColor,'COLOR',true);}
   node.opacity=Math.max(0,Math.min(1,number(s.opacity,c.tokens,1)));
   if(s.boxShadow&&s.boxShadow!=='none'){
    const raw=resolve(s.boxShadow,c.tokens),match=raw.match(/#[\da-f]{6}|rgba?\([^)]+\)/i),rgb=match&&color(match[0],c.tokens),dimensions=raw.replace(match?.[0]||'','').match(/-?[\d.]+/g)?.map(Number);
    if(rgb&&dimensions?.length>=3){const alpha=match[0].startsWith('rgba')?Number(match[0].slice(5,-1).split(',')[3]):1;node.effects=[{type:raw.includes('inset')?'INNER_SHADOW':'DROP_SHADOW',color:{...rgb,a:Number.isFinite(alpha)?alpha:1},offset:{x:dimensions[0],y:dimensions[1]},radius:dimensions[2],spread:dimensions[3]||0,visible:true,blendMode:'NORMAL'}];}else warnings.add('Review unsupported shadow on '+n.name);
   }
   if(s.display==='grid')warnings.add('Grid part '+n.name+' uses a vertical Figma layout; review its placement.');
   if(n.tag!=='svg'&&node.type!=='INSTANCE'&&node.type!=='TEXT'){
    const children=[...(n.text?[{id:n.id+'-direct-text',name:n.name+' text',kind:'text',tag:'span',text:n.text,styles:{fontFamily:s.fontFamily||'Inter',fontSize:s.fontSize||'14px',fontWeight:s.fontWeight||'400',color:s.color||'#222222'},attributes:{},children:[]}]:[]),...(n.children||[])];
    for(const [index,child]of children.entries()){const updated=await update(node,child,master);if(child.id===n.id+'-direct-text')updated.setPluginData('ads-text-owner',n.id);if(node.insertChild)node.insertChild(index,updated);}
    if('children'in node){const active=new Set(children.map(child=>child.id));for(const child of node.children)if(child.getPluginData(PART)&&!active.has(child.getPluginData(PART))){child.visible=false;child.setPluginData('ads-retired','true');}}}
   const width=number(s.width,c.tokens),height=number(s.height,c.tokens);if(width>0||height>0){node.resize(Math.max(1,width||node.width),Math.max(1,height||node.height));if('layoutMode'in node){node.primaryAxisSizingMode=(node.layoutMode==='HORIZONTAL'?width:height)>0?'FIXED':'AUTO';node.counterAxisSizingMode=(node.layoutMode==='HORIZONTAL'?height:width)>0?'FIXED':'AUTO';}}
   return node;
  }
  for(const [key,config]of configs){
   let master=set?.children.find(node=>node.type==='COMPONENT'&&node.getPluginData(VARIANT)===key);
   if(!master){master=figma.createComponent();if(set)set.appendChild(master);master.setPluginData(VARIANT,key);}
   master.name=config.name;master.visible=true;
   const masterValues={...defaults,...Object.fromEntries(axes.map(p=>[p.id,config.values[p.id]]))};const compiled=M.compile(c,masterValues,{includeHidden:true}),tree=compiled.tree;
   // Component masters themselves carry the root part; update their contents in place.
   const virtual={...tree,id:'root-content'};await update(master,virtual,master);master.layoutMode='VERTICAL';master.primaryAxisSizingMode='AUTO';master.counterAxisSizingMode='AUTO';master.fills=[];masters.push(master);
  }
  if(!set)set=figma.combineAsVariants(masters,figma.currentPage);set.name=c.name;
  let x=0;for(const master of masters){master.x=x;master.y=0;x+=master.width+32;}
  for(const master of set.children)if(!masters.includes(master)){master.visible=false;warnings.add('Removed variants are retained hidden so existing instances remain linked.');}
  const propertyMap=JSON.parse(set.getPluginData('ads-property-map')||'{}');
  for(const [id,key]of Object.entries(propertyMap))if(!c.properties.some(p=>p.id===id)){if(set.deleteComponentProperty)set.deleteComponentProperty(key);delete propertyMap[id];warnings.add('Removed property '+id+'; review dependent instance overrides.');}
  for(const p of c.properties.filter(p=>['text','boolean','swap','slot'].includes(p.type))){
   const type={text:'TEXT',boolean:'BOOLEAN',swap:'INSTANCE_SWAP',slot:'SLOT'}[p.type],reference=type==='INSTANCE_SWAP'?await referenceMaster(p.default):null;if(type==='INSTANCE_SWAP'&&!reference&&!c.adapters?.figma?.components?.[p.id])continue;
   const defaultValue=type==='INSTANCE_SWAP'?(reference?.id||c.adapters.figma.components[p.id]):p.default;
   if(propertyMap[p.id]&&set.componentPropertyDefinitions[propertyMap[p.id]]?.type!==type){if(set.deleteComponentProperty)set.deleteComponentProperty(propertyMap[p.id]);delete propertyMap[p.id];warnings.add('Changed type for '+p.name+'; review its instance overrides.');}
   if(!propertyMap[p.id]){try{propertyMap[p.id]=set.addComponentProperty(p.name,type,defaultValue);}catch(error){warnings.add('Property '+p.name+': '+error.message);continue;}}
   else if(set.editComponentProperty)try{propertyMap[p.id]=set.editComponentProperty(propertyMap[p.id],{name:p.name,defaultValue})||propertyMap[p.id];}catch(error){warnings.add('Property '+p.name+': '+error.message);}
   for(const master of masters)for(const node of master.findAll(()=>true)){
    const partId=node.getPluginData('ads-text-owner')||node.getPluginData(PART),find=n=>n.id===partId?n:(n.children||[]).map(find).find(Boolean),definition=find(c.anatomy);
    if(definition?.bind===p.id&&type==='TEXT'&&node.type==='TEXT')node.componentPropertyReferences={...node.componentPropertyReferences,characters:propertyMap[p.id]};
    if(type==='BOOLEAN'&&definition?.visibleWhen?.some(rule=>rule.property===p.id&&rule.equals===true&&!rule.not))node.componentPropertyReferences={...node.componentPropertyReferences,visible:propertyMap[p.id]};
    if(type==='INSTANCE_SWAP'&&definition?.bind===p.id&&node.type==='INSTANCE')node.componentPropertyReferences={...node.componentPropertyReferences,mainComponent:propertyMap[p.id]};
    if(type==='SLOT'&&definition?.bind===p.id&&node.type==='FRAME')node.componentPropertyReferences={...node.componentPropertyReferences,slotContentId:propertyMap[p.id]};
   }
  }
  const currentKey=JSON.stringify(axes.map(p=>[p.id,c.selection[p.id]??p.default])),current=masters.find(master=>master.getPluginData(VARIANT)===currentKey)||masters[0];
  let preview=figma.currentPage.findAll(node=>node.type==='INSTANCE'&&node.getPluginData('ads-preview')===c.id)[0];if(!preview){preview=current.createInstance();preview.setPluginData('ads-preview',c.id);preview.x=set.x;preview.y=set.y+set.height+64;}
  const values=Object.fromEntries(axes.map(p=>[axisName(p),String(c.selection[p.id]??p.default)]));for(const p of c.properties){const key=propertyMap[p.id];if(!key)continue;if(['text','boolean'].includes(p.type))values[key]=c.selection[p.id]??p.default;if(p.type==='swap'){const value=c.selection[p.id]??p.default,reference=await referenceMaster(value);if(reference)values[key]=reference.id;}}
  if(preview.setProperties)preview.setProperties(values);
  for(const p of axes.filter(p=>p.type==='boolean'))warnings.add(p.name+' styling is exposed through the '+axisName(p)+' axis as well as its Boolean property.');
  set.setPluginData('ads-axis-map',JSON.stringify(Object.fromEntries(axes.map(p=>[p.id,axisName(p)]))));set.setPluginData('ads-property-map',JSON.stringify(propertyMap));write(set,c);figma.currentPage.selection=[preview];figma.viewport.scrollAndZoomIntoView([preview]);figma.commitUndo();
  return {componentId:c.id,nodeId:set.id,previewNodeId:preview.id,revision:c.revision,warnings:[...warnings]};
 }
 async function pull(componentId){
  let set=figma.currentPage.findAll(n=>['COMPONENT_SET','COMPONENT'].includes(n.type)&&n.getPluginData('ads-component')===componentId)[0];
  if(!set){const selected=figma.currentPage.selection?.[0];if(selected&&['COMPONENT_SET','COMPONENT'].includes(selected.type))set=selected;else throw new Error('Select an existing local component or component set in Figma, or open the page containing the linked component.');}
  let c=read(set);const importing=!c;if(!c){c=M.blank(set.name||'Figma component');c.id=componentId;c.properties=[];c.selection={};c.authority='figma';c.source={kind:'figma-import'};}
  const propertyMap=JSON.parse(set.getPluginData('ads-property-map')||'{}'),axisMap=JSON.parse(set.getPluginData('ads-axis-map')||'{}');
  if(!importing){
   const parts=new Map();(function visit(n){parts.set(n.id,n);for(const child of n.children||[])visit(child);})(c.anatomy);
   const actual=set.findAll(node=>Boolean(node.getPluginData(PART)));
   for(const p of c.properties){const key=propertyMap[p.id];if(!key)continue;let definition=set.componentPropertyDefinitions[key];if(!definition){const linked=actual.find(node=>{const part=parts.get(node.getPluginData('ads-text-owner')||node.getPluginData(PART));return part?.bind===p.id||part?.visibleWhen?.some(rule=>rule.property===p.id);});const newKey=linked?.componentPropertyReferences?.[{text:'characters',boolean:'visible',swap:'mainComponent',slot:'slotContentId'}[p.type]];if(newKey&&set.componentPropertyDefinitions[newKey]){propertyMap[p.id]=newKey;definition=set.componentPropertyDefinitions[newKey];}}
    if(definition)p.name=propertyMap[p.id].split('#')[0];
   }
   const removed=new Set(c.properties.filter(p=>propertyMap[p.id]&&!set.componentPropertyDefinitions[propertyMap[p.id]]).map(p=>p.id));
   c.properties=c.properties.filter(p=>!removed.has(p.id));for(const id of removed){delete c.selection[id];delete propertyMap[id];delete axisMap[id];}
   for(const part of parts.values()){if(removed.has(part.bind))delete part.bind;part.visibleWhen=(part.visibleWhen||[]).filter(rule=>!removed.has(rule.property));for(const key of Object.keys(part.styleBindings||{}))if(removed.has(part.styleBindings[key]))delete part.styleBindings[key];for(const key of Object.keys(part.attributeBindings||{}))if(removed.has(part.attributeBindings[key]))delete part.attributeBindings[key];}
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
   definition.children=[];for(const child of node.children||[])if(child.getPluginData('ads-retired')!=='true'){if(child.getPluginData('ads-text-owner'))definition.text=child.characters;else definition.children.push(await rebuild(child));}return definition;
  }
  const firstRoot=masters[0]?.children.find(node=>node.getPluginData(PART)==='root-content')||(importing?masters[0]:null);if(!firstRoot)throw new Error('Linked root part is missing. Restore it in Figma before pulling.');
  c.anatomy=await rebuild(firstRoot);definitions.clear();(function visit(n){definitions.set(n.id,n);for(const child of n.children||[])visit(child);})(c.anatomy);
  for(const variant of c.variants)for(const part of Object.keys(variant.overrides||{}))if(!definitions.has(part))delete variant.overrides[part];
  for(const master of masters){const config=JSON.parse(master.getPluginData(VARIANT)||'[]'),when=Object.fromEntries(config);for(const [name,value]of Object.entries(master.variantProperties||{})){const p=c.properties.find(p=>p.name===name||axisMap[p.id]===name);if(p?.type==='options'){const original=p.options.find(option=>String(option)===value);if(original===undefined)p.options.push(value);when[p.id]=original??value;}else if(p?.type==='boolean')when[p.id]=value==='true';}const variant=c.variants.find(v=>JSON.stringify(v.when)===JSON.stringify(when))||{id:'figma-'+master.id.replace(/:/g,'-'),name:master.name,when,overrides:{}};
   for(const node of master.findAll(()=>true)){let part=node.getPluginData('ads-text-owner')||node.getPluginData(PART);if(part==='root-content')part=c.anatomy.id;const definition=definitions.get(part);if(!definition||node.getPluginData('ads-retired')==='true')continue;if(node.getPluginData('ads-text-owner')){variant.overrides[part]||={};variant.overrides[part].text=node.characters;continue;}const styles=await css(node);variant.overrides[part]={...(variant.overrides[part]||{}),styles:{...(variant.overrides[part]?.styles||{}),...styles},visible:node.visible};for(const key of Object.keys(definition.styleBindings||{}))if(key in styles)(variant.overrides[part].styleBindings||={})[key]=null;if(node.type==='TEXT')variant.overrides[part].text=node.characters;}
   if(!c.variants.includes(variant))c.variants.push(variant);
  }
  c.authority='figma';c.adapters.figma.nodeId=set.id;M.assert(c);set.setPluginData('ads-property-map',JSON.stringify(propertyMap));write(set,c);return {contract:c,nodeId:set.id};
 }
 return {push,pull};
});
