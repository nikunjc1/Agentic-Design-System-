const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),file=path.join(root,'figma-plugin/code.js');
const source=['component-contract-model.js','figma-plugin/adapter.js','figma-plugin/bridge-runtime.js','figma-plugin/main.js'].map(name=>fs.readFileSync(path.join(root,name),'utf8')).join('\n;\n');
if(process.argv.includes('--check')){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==source){console.error('Figma plugin bundle is stale. Run node tools/build_figma_plugin.cjs.');process.exitCode=1;}else console.log('Figma plugin bundle: fresh');}else{fs.writeFileSync(file,source);console.log('Built figma-plugin/code.js');}
