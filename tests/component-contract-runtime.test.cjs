const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const M=require('../component-contract-model.js');

function makeNode(tag){
  return {
    tag, dataset:{}, attributes:{}, children:[], listeners:{},
    style:{setProperty(key,value){this[key]=value;}},
    setAttribute(key,value){this.attributes[key]=value;},
    addEventListener(type,fn){this.listeners[type]=fn;},
    append(...nodes){this.children.push(...nodes);},
    replaceChildren(...nodes){this.children=nodes;},
    contains(){return false;},
    querySelectorAll(){return [];},
    dispatchEvent(){return true;},
    focus(){},
  };
}

function mountRuntime(){
  const source=fs.readFileSync(path.join(__dirname,'../component-contract-runtime.js'),'utf8');
  const document={
    activeElement:null,
    createElement:tag=>makeNode(tag),
    createElementNS:(ns,tag)=>makeNode(tag),
    createTextNode:text=>({nodeType:3,text}),
    addEventListener(){},
  };
  const sandbox={document,console,CustomEvent:class{constructor(type,init){this.type=type;Object.assign(this,init);}}};
  sandbox.window=sandbox;sandbox.window.ADSComponentContract=M;
  vm.createContext(sandbox);vm.runInContext(source,sandbox);
  return sandbox.window.ADSContracts;
}

test('a $value behavior on a number property coerces the raw input string before it reaches compiled values',()=>{
  const ADSContracts=mountRuntime();
  const c=M.blank('Counter');
  c.properties=[{id:'count',name:'Count',type:'number',default:0,min:0,max:100}];
  c.selection={count:0};
  c.anatomy={id:'root',name:'Root',kind:'container',tag:'div',styles:{},children:[
    {id:'field',name:'Field',kind:'text',tag:'input',bind:'count',styles:{}},
    {id:'reached',name:'Reached',kind:'text',tag:'span',text:'Reached!',styles:{},visibleWhen:[{property:'count',equals:42}]},
  ]};
  c.behaviors=[{target:'field',event:'input',property:'count',value:'$value'}];
  assert.deepEqual(M.validate(c),[]);
  const root=makeNode('div');
  const compiled=ADSContracts.mount(root,c);
  assert.equal(compiled.values.count,0);
  const fieldEl=root.children[0].children.find(n=>n.dataset.adsPart==='field');
  assert.ok(fieldEl,'the bound input should be in the mounted tree');
  // Only the DOM ever hands back a string here, even for a declared number property.
  fieldEl.listeners.input({target:{value:'42'},stopPropagation(){}});
  const values=JSON.parse(root.dataset.adsValues);
  assert.equal(values.count,42);
  assert.equal(typeof values.count,'number','a number property must stay a number after a $value input event, or equals/variant conditions silently stop matching');
  const reachedEl=root.children[0].children.find(n=>n.dataset.adsPart==='reached');
  assert.ok(reachedEl,'the visibleWhen:{count equals 42} part should now be visible once count is the number 42');
});

test('a malformed numeric input is ignored instead of poisoning the value with NaN',()=>{
  const ADSContracts=mountRuntime();
  const c=M.blank('Counter');
  c.properties=[{id:'count',name:'Count',type:'number',default:5,min:0,max:100}];
  c.selection={count:5};
  c.anatomy={id:'root',name:'Root',kind:'container',tag:'div',styles:{},children:[
    {id:'field',name:'Field',kind:'text',tag:'input',bind:'count',styles:{}},
  ]};
  c.behaviors=[{target:'field',event:'input',property:'count',value:'$value'}];
  const root=makeNode('div');
  ADSContracts.mount(root,c);
  const fieldEl=root.children[0].children.find(n=>n.dataset.adsPart==='field');
  // '-' alone (e.g. mid-keystroke typing a negative number) is a real
  // intermediate value a number input can briefly hold; Number('-') is NaN.
  fieldEl.listeners.input({target:{value:'-'},stopPropagation(){}});
  const values=JSON.parse(root.dataset.adsValues);
  assert.equal(values.count,5);
});
