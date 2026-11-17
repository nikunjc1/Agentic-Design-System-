function fixture(){
 let sequence=0;const registry=new Map(),variables=[],collections=[];
 class Node{
  constructor(type){this.type=type;this.id='node-'+(++sequence);this.children=[];this.data={};this.name='';this.visible=true;this.width=100;this.height=32;this.opacity=1;this.fills=[];this.strokes=[];this.cornerRadius=0;this.boundVariables={};this.layoutMode='NONE';this.layoutWrap='NO_WRAP';this.counterAxisSpacing=0;this.componentPropertyDefinitions={};this.reactions=[];registry.set(this.id,this);}
  setPluginData(k,v){this.data[k]=v;}getPluginData(k){return this.data[k]||'';}
  async setReactionsAsync(reactions){this.reactions=reactions;}
  appendChild(n){const old=n.parent;if(old)old.children=old.children.filter(child=>child!==n);this.children.push(n);n.parent=this;if(old&&old!==this&&old.type==='COMPONENT_SET'&&!old.children.length)old.remove();}
  insertChild(index,n){this.appendChild(n);this.children.splice(this.children.indexOf(n),1);this.children.splice(index,0,n);}
  remove(){if(this.removed)return;this.removed=true;const parent=this.parent;if(parent)parent.children=parent.children.filter(child=>child!==this);for(const child of [...this.children])child.remove();registry.delete(this.id);if(parent?.type==='COMPONENT_SET'&&!parent.children.length&&!parent.removed)parent.remove();}
  findAll(predicate){return this.children.flatMap(child=>[...(predicate(child)?[child]:[]),...child.findAll(predicate)]);}
  findAllWithCriteria({types}){return this.findAll(node=>types.includes(node.type));}
  // Real Figma: resize() on an auto-layout frame switches BOTH sizing modes to FIXED, so anything that must hug has to be (re)asserted after the last resize.
  // It also drops Fill container (layoutAlign STRETCH / layoutGrow) on a node whose size actually changes, which is how a Collapse header row lost its Fill width.
  resize(w,h){const changed=w!==this.width||h!==this.height;this.width=w;this.height=h;if(this.layoutMode&&this.layoutMode!=='NONE'){this.primaryAxisSizingMode='FIXED';this.counterAxisSizingMode='FIXED';}if(changed&&this.layoutAlign==='STRETCH')this.layoutAlign='INHERIT';if(changed&&this.layoutGrow===1)this.layoutGrow=0;}
  clone(){const node=copyNode(this);figma.currentPage.appendChild(node);return node;}
  set lineHeight(value){if(value.unit!=='AUTO'&&!Number.isFinite(value.value))throw new Error('Figma line height must be finite');this._lineHeight=value;}
  get lineHeight(){return this._lineHeight;}
  setBoundVariable(field,v){this.boundVariables[field]={id:v.id};}
  createInstance(){const instance=new Node('INSTANCE');instance.swapComponent(this);figma.currentPage.appendChild(instance);return instance;}
  async getMainComponentAsync(){return this.mainComponent;}
  get variantProperties(){return Object.fromEntries(this.name.split(',').filter(p=>p.includes('=')).map(p=>p.split('=').map(v=>v.trim())));}
  get exposedInstances(){return this.findAll(n=>n.type==='INSTANCE'&&n.isExposedInstance);}
  set isExposedInstance(value){for(let n=this.parent;n;n=n.parent)if(n.type==='INSTANCE')throw new Error('Cannot expose an instance sublayer');this._isExposedInstance=value;}
  get isExposedInstance(){return Boolean(this._isExposedInstance);}
  set componentPropertyReferences(value){for(let n=this.parent;n;n=n.parent)if(['INSTANCE','SLOT'].includes(n.type))throw new Error('Cannot set component property references on '+n.type.toLowerCase()+' sublayer');this._componentPropertyReferences=value;if(value.slotContentId&&this.type==='FRAME')this.type='SLOT';}
  get componentPropertyReferences(){return this._componentPropertyReferences||{};}

  set componentPropertyDefinitions(value){this._propertyDefinitions=value;}
  get componentPropertyDefinitions(){
   if(this.type==='COMPONENT_SET'){
    const variants=this.children.filter(n=>n.type==='COMPONENT'),keys=variants.map(n=>n.name.split(',').map(p=>p.split('=')[0].trim()).sort().join('|'));
    if(new Set(keys).size>1)throw new Error('Component set has existing errors');
   }
   return this._propertyDefinitions;
  }
  swapComponent(master){this.mainComponent=master;for(const child of [...this.children])child.remove();for(const child of master.children)this.appendChild(copyNode(child));const owner=master.parent?.type==='COMPONENT_SET'?master.parent:master;this.componentProperties={...Object.fromEntries(Object.entries(owner.componentPropertyDefinitions).map(([key,d])=>[key,d.defaultValue])),...master.variantProperties};}
  setProperties(properties){
   const set=this.mainComponent?.parent;if(set?.type==='COMPONENT_SET'){void set.componentPropertyDefinitions;const next={...this.mainComponent.variantProperties,...properties},master=set.children.find(n=>Object.entries(n.variantProperties).every(([key,value])=>String(next[key])===value));if(master&&master!==this.mainComponent)this.swapComponent(master);}
   this.componentProperties={...this.componentProperties,...properties};
   for(const node of this.findAll(()=>true)){const refs=node.componentPropertyReferences||{};if(refs.characters in this.componentProperties)node.characters=this.componentProperties[refs.characters];if(refs.visible in this.componentProperties)node.visible=this.componentProperties[refs.visible];if(refs.mainComponent in this.componentProperties){const master=registry.get(this.componentProperties[refs.mainComponent]);if(master)node.swapComponent(master);}}
  }
  addComponentProperty(name,type,defaultValue){const key=name+'#'+(++sequence);this.componentPropertyDefinitions[key]={type,defaultValue};return key;}
  editComponentProperty(key,patch){const next=patch.name&&patch.name!==key.split('#')[0]?patch.name+'#'+(++sequence):key;this.componentPropertyDefinitions[next]={...this.componentPropertyDefinitions[key],...patch};if(next!==key)delete this.componentPropertyDefinitions[key];return next;}
  deleteComponentProperty(key){delete this.componentPropertyDefinitions[key];}
 }
 function copyNode(source){const node=new Node(source.type);for(const [key,value]of Object.entries(source))if(!['id','parent','children','removed'].includes(key))node[key]=key==='mainComponent'?value:value&&typeof value==='object'?JSON.parse(JSON.stringify(value)):value;for(const child of source.children)node.appendChild(copyNode(child));return node;}
 const page=new Node('PAGE'),root=new Node('DOCUMENT');root.appendChild(page);
 // Every node factory appends to whichever page is CURRENT at creation time,
 // not always the first page - mirrors the real Plugin API (a dynamic-page
 // document scopes node creation to figma.currentPage, switched only via
 // the async setCurrentPageAsync, never a synchronous assignment).
 const make=type=>{const n=new Node(type);figma.currentPage.appendChild(n);return n;};
 const figma={root,currentPage:page,
  createPage(){const p=new Node('PAGE');root.appendChild(p);return p;},
  async setCurrentPageAsync(p){figma.currentPage=p;},
  createComponent:()=>make('COMPONENT'),createFrame:()=>make('FRAME'),createText:()=>make('TEXT'),loadFontAsync:async()=>{},commitUndo(){},viewport:{scrollAndZoomIntoView(){}},combineAsVariants(nodes,parent){const set=make('COMPONENT_SET');parent.appendChild(set);for(const node of nodes)set.appendChild(node);return set;},getNodeByIdAsync:async id=>registry.get(id),variables:{getLocalVariablesAsync:async()=>variables,getLocalVariableCollectionsAsync:async()=>collections,createVariableCollection(name){const c={id:'collection-'+(++sequence),name,defaultModeId:'light'};collections.push(c);return c;},createVariable(name,collection,resolvedType){const v={id:'variable-'+sequence+'-'+variables.length,name,variableCollectionId:collection.id,resolvedType,scopes:['ALL_SCOPES'],setValueForMode(mode,value){this.value=value;},setVariableCodeSyntax(platform,value){this.codeSyntax={...this.codeSyntax,[platform]:value};}};return v;},setBoundVariableForPaint(paint,field,v){return {...paint,boundVariables:{[field]:{id:v.id}}};},getVariableById:id=>variables.find(v=>v.id===id),getVariableByIdAsync:async id=>variables.find(v=>v.id===id)}};
 figma.createNodeFromSvg=svg=>{const n=make('FRAME');n.svg=svg;n.fills=[];const vector=make('VECTOR');vector.fills=[{type:'SOLID',color:{r:0.1,g:0.2,b:0.3}}];n.appendChild(vector);return n;};
 return {figma,registry,variables,collections};
}

module.exports=fixture;
