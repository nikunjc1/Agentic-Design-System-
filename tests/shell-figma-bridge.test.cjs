const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');

function loadShellSandbox(fetchImpl){
  const source=fs.readFileSync(path.join(__dirname,'../shell.js'),'utf8');
  // classList.add/remove and querySelector are exercised by the "Draw in
  // Figma" processing/done/error toast (see window.ADSFigmaBridge.draw in
  // shell.js) - a real browser element always has them, so the stub needs
  // them too now, not just .contains().
  function makeElement(){return {classList:{contains:()=>false,add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},append(){},style:{},childNodes:[],getAttribute:()=>null,querySelector:()=>makeElement()};}
  const elements=new Map();
  const doc={
    createElement:()=>makeElement(),
    getElementById:id=>{if(!elements.has(id))elements.set(id,null);return elements.get(id);},
    body:makeElement(), documentElement:makeElement(),
    querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, activeElement:null, execCommand:()=>false,
  };
  const sandbox={
    document:doc, navigator:{}, console,
    location:{href:'http://127.0.0.1:5500/button-primary.html',origin:'http://127.0.0.1:5500',protocol:'http:'},
    localStorage:{getItem:()=>null,setItem(){},removeItem(){}},
    fetch:fetchImpl, AbortSignal:{timeout:()=>({})}, setTimeout, clearTimeout, WeakMap, Array, JSON,
    MutationObserver:class{observe(){}disconnect(){}}, matchMedia:()=>({matches:false,addEventListener(){},addListener(){}}),
    CustomEvent, Event, history:{replaceState(){}}, URL,
  };
  sandbox.window=sandbox;
  vm.createContext(sandbox);
  // shell.js also wires up theme/nav/density chrome past the Figma bridge
  // definition; that later DOM wiring can't run against this minimal stub,
  // but it runs after ADSFigmaBridge is already assigned, so any failure
  // there doesn't affect what this test checks.
  try{vm.runInContext(source,sandbox);}catch{}
  return sandbox;
}

function stubButton(){return {childNodes:[],getAttribute:()=>null,setAttribute(){},removeAttribute(){},replaceChildren(){},title:'',innerHTML:'',classList:{contains:()=>false}};}

// exportCatalog's own per-item capture isolation (shell.js) needs a fake
// iframe whose .src setter fires .onload asynchronously, with
// contentWindow.ADSContracts.capture() driven by `behavior` (keyed by file
// path) so individual entries can be made to succeed or fail on demand -
// the same captureFromFile() mechanism drawCurrentPage/exportCatalog both
// use, exercised without a real browser or real sibling pages.
function loadShellSandboxWithIframes(fetchImpl,behavior,locationOverride){
  const source=fs.readFileSync(path.join(__dirname,'../shell.js'),'utf8');
  function makeElement(tag){
    const el={classList:{contains:()=>false,add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},append(){},style:{},childNodes:[],getAttribute:()=>null,querySelector:()=>makeElement()};
    if(tag==='iframe'){
      el.remove=()=>{};
      Object.defineProperty(el,'src',{set(value){
        const file=new URL(value).pathname.replace(/^\//,'');
        setTimeout(()=>{
          const outcome=behavior[file];
          el.contentWindow={ADSContracts:{capture(){if(outcome?.throws)throw new Error(outcome.throws);return outcome?.contract||{id:file,name:file,revision:0};}}};
          el.onload?.();
        },0);
      }});
    }
    return el;
  }
  const elements=new Map();
  const doc={
    createElement:(tag)=>makeElement(tag),
    getElementById:id=>{if(!elements.has(id))elements.set(id,null);return elements.get(id);},
    body:makeElement(), documentElement:makeElement(),
    querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, activeElement:null, execCommand:()=>false,
  };
  const sandbox={
    document:doc, navigator:{}, console,
    location:locationOverride||{href:'http://127.0.0.1:5500/button-primary.html',origin:'http://127.0.0.1:5500',protocol:'http:'},
    localStorage:{getItem:()=>null,setItem(){},removeItem(){}},
    fetch:fetchImpl, AbortSignal:{timeout:()=>({})}, setTimeout, clearTimeout, WeakMap, Array, JSON,
    MutationObserver:class{observe(){}disconnect(){}}, matchMedia:()=>({matches:false,addEventListener(){},addListener(){}}),
    CustomEvent, Event, history:{replaceState(){}}, URL,
    ADSFoundation:{get:()=>({tokens:{}})},
  };
  sandbox.window=sandbox;
  vm.createContext(sandbox);
  try{vm.runInContext(source,sandbox);}catch{}
  return sandbox;
}
test('exportCatalog: one component that fails to capture does not stop the others, and is reported, not silently dropped',async()=>{
  const behavior={
    'button-primary.html':{contract:{id:'button-primary',name:'Primary Button',revision:0}},
    'checkbox-default.html':{throws:'Component guide did not load.'},
    'table-default.html':{contract:{id:'table-default',name:'Table',revision:0}},
  };
  let sentItems=null;
  const fetchImpl=async(url)=>{
    if(url.endsWith('/contracts/jobs'))return {ok:true,status:202,json:async()=>{return {jobId:'cat-1'};}};
    return {ok:true,status:200,json:async()=>({status:'succeeded',result:{total:2,pushed:2,failed:0,results:[],warnings:[]}})};
  };
  const sandbox=loadShellSandboxWithIframes(async(url,options)=>{
    if(options?.body)sentItems=JSON.parse(options.body).items;
    return fetchImpl(url);
  },behavior);
  const manifest=[
    {name:'Button',category:'General',file:'button-primary.html'},
    {name:'Checkbox',category:'Data Entry',file:'checkbox-default.html'},
    {name:'Table',category:'Data Display',file:'table-default.html'},
  ];
  const progress=[];
  const result=await sandbox.ADSFigmaBridge.exportCatalog(manifest,message=>progress.push(message));
  assert.equal(sentItems.length,2,'only the 2 successfully-captured components are sent to the plugin');
  assert.deepEqual(sentItems.map(i=>i.name),['Button','Table']);
  assert.equal(result.total,3,'the capture failure is folded into the total, not silently excluded');
  assert.equal(result.pushed,2);
  assert.equal(result.failed,1);
  const failedEntry=result.results.find(r=>r.name==='Checkbox');
  assert.ok(failedEntry,'the failed component is still reported');
  assert.match(failedEntry.error,/Could not capture/);
  assert.ok(progress.some(p=>p.includes('Capturing Checkbox')),'progress still announced the component that ultimately failed');
});

// Button's capture (both drawCurrentPage's own merge and exportCatalog's,
// via the shared captureButtonFamilySeed) reads window.ADSComponentContract
// (component-contract-model.js) for M.VERSION/M.id when assembling the
// merged-appearance seed contract - a real bug shipped where figma-
// export.html (the only page that calls exportCatalog) never loaded that
// script, so a full catalog export failed Button's capture specifically
// with "Cannot read properties of undefined (reading 'VERSION')" even
// though every other component, and Button's own per-page "Draw in Figma"
// button, worked fine (button-*.html pages already load the script).
test('unified export page loads component-contract-model.js before shell.js, so Button\'s catalog-export capture can build its merged-appearance seed',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../md-export.html'),'utf8');
  const contractModelIndex=source.indexOf('src="component-contract-model.js"');
  const shellIndex=source.indexOf('src="shell.js"');
  assert.notEqual(contractModelIndex,-1,'md-export.html must load component-contract-model.js');
  assert.notEqual(shellIndex,-1,'md-export.html must load shell.js');
  assert.ok(contractModelIndex<shellIndex,'component-contract-model.js must load before shell.js, which reads window.ADSComponentContract at call time');
});

// A user reported opening this exact page as file:// repeatedly even after
// being told to use the bridge server's http:// address instead - typing a
// URL correctly is an easy thing to get wrong (autocomplete suggesting the
// old file:// history entry, a saved bookmark, double-clicking the file
// again). figma-export.js now detects this itself and shows a real,
// clickable link to the one address that works, computed from the bridge's
// own port, instead of relying on the user to type it - and disables the
// export button so clicking it can't waste the user's time on a run that's
// guaranteed to fail every single capture.
function loadFigmaExportJsSandbox(protocol){
  const source=fs.readFileSync(path.join(__dirname,'../figma-export.js'),'utf8');
  const elements=new Map([
    ['figmaExportFileProtocolNotice',{hidden:true}],
    ['figmaExportCorrectLink',{href:'#'}],
    ['startFigmaExport',{disabled:false,title:''}],
  ]);
  let domReadyHandler=null;
  const sandbox={
    window:null,
    document:{
      getElementById:id=>elements.get(id)||null,
      addEventListener:(event,handler)=>{if(event==='DOMContentLoaded')domReadyHandler=handler;},
    },
    location:{protocol,pathname:'/figma-export.html'},
    ADSFigmaBridge:{port:3333},
    console,
  };
  sandbox.window=sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source,sandbox);
  domReadyHandler();
  return elements;
}
test('figma-export.js shows a real clickable link to the bridge address and disables Start when opened as file://, and stays out of the way over http://',()=>{
  const fileElements=loadFigmaExportJsSandbox('file:');
  assert.equal(fileElements.get('figmaExportFileProtocolNotice').hidden,false,'the notice must become visible');
  assert.equal(fileElements.get('figmaExportCorrectLink').href,'http://127.0.0.1:3333/md-export.html?format=figma','the link must point to the bridge-served address, not the file:// one');
  assert.equal(fileElements.get('startFigmaExport').disabled,true,'exporting is guaranteed to fail from file://, so the button should not invite a wasted attempt');
  assert.match(fileElements.get('startFigmaExport').title,/file:\/\//);

  const httpElements=loadFigmaExportJsSandbox('http:');
  assert.equal(httpElements.get('figmaExportFileProtocolNotice').hidden,true,'the notice must stay hidden when already served correctly');
  assert.equal(httpElements.get('startFigmaExport').disabled,false);
});

// Every single capture failing with the exact "Blocked a frame with origin
// 'null'..." browser message (not one flaky page) is the real-world
// signature of opening this portal as a bare file:// page - reported by a
// user hitting "Export to Figma" without a local server. The thrown error
// must explain the real fix (serve over http(s)) instead of just repeating
// the raw cross-origin SecurityError text.
test('exportCatalog: every capture failing under file:// protocol explains the real fix, not just the raw browser error',async()=>{
  const rawError="Failed to read a named property 'ADSContracts' from 'Window': Blocked a frame with origin \"null\" from accessing a cross-origin frame.";
  const behavior={
    'button-primary.html':{throws:rawError},
    'checkbox-default.html':{throws:rawError},
  };
  const sandbox=loadShellSandboxWithIframes(async()=>({ok:true,status:200,json:async()=>({})}),behavior,
    {href:'file:///figma-export.html',origin:'null',protocol:'file:'});
  const manifest=[
    {name:'Button',category:'General',file:'button-primary.html'},
    {name:'Checkbox',category:'Data Entry',file:'checkbox-default.html'},
  ];
  await assert.rejects(
    sandbox.ADSFigmaBridge.exportCatalog(manifest,()=>{}),
    (error)=>{
      assert.match(error.message,/Could not capture any component \(2 failed\)/);
      assert.match(error.message,/serve it over http\(s\)/i,'explains the real fix instead of only repeating the raw browser error');
      assert.match(error.message,/python3 -m http\.server/);
      return true;
    }
  );
});

test('Draw in Figma surfaces the bridge\'s own rejection reason instead of a generic "could not reach" message',async()=>{
  const sandbox=loadShellSandbox(async()=>({ok:false,status:409,json:async()=>({error:'Figma is the authoring source. Switch to Contract and save before pushing.'})}));
  assert.ok(sandbox.window.ADSFigmaBridge,'ADSFigmaBridge should be defined even though later shell.js DOM wiring cannot run in this minimal stub');
  const button=stubButton();
  const success=await sandbox.window.ADSFigmaBridge.draw({id:'c1',revision:0},button);
  assert.equal(success,false);
  assert.equal(button.title,'Figma is the authoring source. Switch to Contract and save before pushing.');
});

test('Draw in Figma keeps the reachability message only when the bridge truly cannot be reached',async()=>{
  const sandbox=loadShellSandbox(async()=>{throw new Error('ECONNREFUSED');});
  const button=stubButton();
  const success=await sandbox.window.ADSFigmaBridge.draw({id:'c1',revision:0},button);
  assert.equal(success,false);
  assert.match(button.title,/Could not reach the Figma Bridge Plugin/);
});

test('Draw in Figma reports a successful push',async()=>{
  const sandbox=loadShellSandbox(async()=>({ok:true,json:async()=>({componentId:'c1',nodeId:'1:1',revision:0})}));
  const button=stubButton();
  const success=await sandbox.window.ADSFigmaBridge.draw({id:'c1',revision:0},button);
  assert.equal(success,true);
  assert.equal(button.title,'Sent to Figma');
});
test('successful draws surface font and conversion warnings',async()=>{
 const sandbox=loadShellSandbox(async()=>({ok:true,json:async()=>({componentId:'c1',nodeId:'1:1',revision:0,warnings:['Font unavailable: Example Regular; Inter Regular used.']})}));
 const button=stubButton();assert.equal(await sandbox.ADSFigmaBridge.draw({id:'c1',revision:0},button),true);assert.match(button.title,/Review: Font unavailable/);
});
test('Draw waits for asynchronous job success instead of treating acceptance as completion',async()=>{
 const requests=[];let check=0;
 const sandbox=loadShellSandbox(async url=>{requests.push(url);return {ok:true,status:url.endsWith('/jobs')?202:200,json:async()=>url.endsWith('/jobs')?{jobId:'draw-1'}:++check===1?{status:'running',phase:'Rendering 48 / 1152'}:{status:'succeeded',result:{componentId:'c1',nodeId:'1:1',revision:0}}};});
 const button=stubButton();assert.equal(await sandbox.ADSFigmaBridge.draw({id:'c1',revision:0},button),true);assert.equal(check,2);assert.ok(requests[0].endsWith('/contracts/jobs'));assert.equal(button.disabled,false);
});
test('a second click cannot enqueue another draw while the first is in flight',async()=>{
 let finish,calls=0;const sandbox=loadShellSandbox(()=>{calls++;return new Promise(resolve=>{finish=resolve;});}),button=stubButton();
 const first=sandbox.ADSFigmaBridge.draw({id:'c1',revision:0},button);assert.equal(button.disabled,true);assert.equal(await sandbox.ADSFigmaBridge.draw({id:'c1',revision:0},button),false);assert.equal(calls,1);
 finish({ok:true,json:async()=>({componentId:'c1',nodeId:'1:1',revision:0})});assert.equal(await first,true);assert.equal(button.disabled,false);
});
