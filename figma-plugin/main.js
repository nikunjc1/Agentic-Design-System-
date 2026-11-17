/* The sandbox owns transport and scene work; the iframe displays status only. */
figma.showUI(__html__,{width:400,height:260});
const DAMCO_PLUGIN_BUILD='damco-native-bridge-2026-11-16-v81';
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
