const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require.resolve('../shell.js'),'utf8');
const clipboard=source.slice(source.indexOf('  window.ADSClipboard ='),source.indexOf('  // Preferences remain optional'));
function setup(writeText,command){
  const copies=[],nodes=[];let focused=0;
  const document={activeElement:{focus(){focused++;}},body:{append(node){nodes.push(node);}},createElement(){return {style:{},select(){},remove(){nodes.pop();}};}};
  if(command!==undefined)document.execCommand=()=>{copies.push(nodes.at(-1).value);return command;};
  const window={},navigator={clipboard:writeText?{writeText:t=>writeText(t,copies)}:undefined};
  vm.runInNewContext(clipboard,{window,navigator,document});
  return {copy:window.ADSClipboard.copy,copies,nodes,focused:()=>focused};
}
test('clipboard writes exact text and falls back only on successful legacy copy',async()=>{
  let f=setup((t,c)=>{c.push(t);return Promise.resolve();});await f.copy('Current\nprompt');assert.deepEqual(f.copies,['Current\nprompt']);assert.equal(f.nodes.length,0);
  for(const modern of [undefined,()=>Promise.reject(new Error('Denied'))]){
    f=setup(modern,true);await f.copy('Fallback\nprompt');assert.deepEqual(f.copies,['Fallback\nprompt']);assert.equal(f.nodes.length,0);assert.equal(f.focused(),1);
  }
});
test('clipboard failures reject, clean up the temporary field and restore focus',async()=>{
  for(const command of [undefined,false]){const f=setup(()=>Promise.reject(new Error('Denied')),command);await assert.rejects(f.copy('Cannot copy'));assert.equal(f.nodes.length,0);assert.equal(f.focused(),command===false?1:0);}
  const f=setup();await assert.rejects(f.copy('   '),/Nothing to copy/);
});
