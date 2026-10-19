const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('../foundation-model.js'),A=require('../agent-model.js'),P=require('../project-model.js');
const {importTokens}=require('../tools/dtcg-import.cjs');
test('every Foundation record migrates valid legacy data and rejects invalid or future versions without mutation',()=>{
  for(const key of M.recordKeys){
    const legacy={},before=JSON.stringify(legacy),next=M.migrateRecord(key,legacy);
    assert.equal(next.schemaVersion,1);assert.equal(JSON.stringify(legacy),before);
    assert.equal(M.inspectRecord(key,JSON.stringify(next)).status,'valid');
    assert.equal(M.inspectRecord(key,'{').status,'corrupt');
    assert.equal(M.inspectRecord(key,'{"schemaVersion":2}').status,'future');
    assert.equal(M.inspectRecord(key,'{"schemaVersion":"1"}').status,'invalid');
    assert.equal(M.inspectRecord(key,'null').status,'invalid');
    assert.equal(M.inspectRecord(key,null).status,'missing');
  }
  assert.equal(M.migrateRecord('grid-layout',{system:'baseline'}).baseline,true);
  assert.equal(M.migrateRecord('grid-layout',{system:'baseline'}).system,'columns');
});
test('typed export imports all CSS tokens in both modes; bad values and alias cycles fail',()=>{
  const document=JSON.parse(fs.readFileSync(require.resolve('../design-tokens.json'),'utf8'));
  for(const mode of ['light','dark']){
    const tokens=importTokens(document,mode), current=M.resolve({},mode).tokens;
    assert.deepEqual(Object.keys(tokens).sort(),Object.keys(current).sort(),'Every applied default property must be published');
    assert.equal(tokens['--red-500'],'rgba(255,3,26,1)');
    assert.equal(tokens['--space-16'],'16px');assert.equal(tokens['--line'],mode==='light'?'rgba(15,15,10,0.08)':'rgba(255,255,255,0.08)');
    assert.ok(tokens['--shadow-md'].includes('4px 8px 0px rgba('));assert.ok(tokens['--font-body'].includes('Inter'));
    assert.equal(tokens['--color-ai-accent'],'rgba(139,92,246,1)');
    for(const name of ['--type-h1-size','--type-h2-size','--type-h3-size','--type-h4-size','--type-h5-size','--type-h6-size','--type-body-size','--type-paragraph-size','--type-caption-size','--type-h1-line-height','--type-h1-tracking','--grid-columns','--grid-gutter','--grid-max-width','--control-height','--icon-target','--border-width','--radius-card']) {
      if(name in current)assert.equal(tokens[name],current[name],name+' preserves actual resolved value');
    }
    assert.equal(tokens['--type-h1-family'],tokens['--font-display']);
    assert.equal(tokens['--type-body-family'],tokens['--font-body']);
    for(const name of ['--contrast-pass-bg','--contrast-pass-text','--contrast-fail-bg','--contrast-fail-text'])assert.ok(tokens[name].startsWith('rgba('),name+' typed color');
    assert.equal(tokens['--border-style'],'solid');assert.equal(tokens['--icon-cap'],'round');
  }
  assert.throws(()=>importTokens({color:{bad:{$type:'color',$value:'#ffffff'}}}),TypeError);
  assert.throws(()=>importTokens({dim:{a:{$type:'dimension',$value:'{dim.b}'},b:{$type:'dimension',$value:'{dim.a}'}}}),RangeError);
  assert.throws(()=>importTokens({x:{a:{$type:'other',$value:'none'}}}),TypeError);
});
test('named catalog gives accessible inert SVG and mirrors only directional actions',()=>{
  assert.equal(Object.keys(M.iconCatalog.icons).length,6);
  for(const name of Object.keys(M.iconCatalog.icons))assert.match(M.iconMarkup(name),/aria-hidden="true"/);
  assert.match(M.iconMarkup('info',{label:'Information "for" you'}),/role="img" aria-label="Information &quot;for&quot; you"/);
  assert.match(M.iconMarkup('chevron-end',{direction:'rtl'}),/scale\(-1 1\)/);
  assert.doesNotMatch(M.iconMarkup('edit',{direction:'rtl'}),/scale\(-1 1\)/);
  assert.throws(()=>M.iconMarkup('<script>'),RangeError);
});
test('default enabled text roles pass 4.5:1 on both default page and panel surfaces',()=>{
  for(const theme of ['light','dark']){const t=M.resolve({},theme).tokens;for(const role of Object.keys(M.typeDefaults))if(role!=='disabled')for(const surface of ['--graphite-950','--graphite-900','--graphite-850'])assert.ok(M.contrast(t['--type-'+role+'-color'],t[surface])>=4.5,theme+' '+role+' '+surface);}
  assert.equal(M.resolve({typography:{levels:{warning:{color:'#E6A53A'}}}},'light').tokens['--type-warning-color'],'#E6A53A');
});
test('recipient import reproduces customized and project-derived tokens and rejects executable assets',()=>{
  const I=require('../foundation-import.js');
  for(const settings of [{},{spacing:{system:'8px'},radius:{philosophy:'soft'},units:{unit:'rem'},icons:{size:'32'}}])for(const context of [null,{productType:'Dashboard',platforms:['desktop-web']}])for(const theme of ['light','dark'])assert.deepEqual(I.resolve({schemaVersion:1,settings,context},theme),M.resolve(settings,theme,context));
  assert.throws(()=>I.validate({schemaVersion:2,settings:{}}),TypeError);
  assert.throws(()=>I.validate({schemaVersion:1,settings:{icons:{uploads:[{name:'icon.svg',dataUrl:'javascript:alert(1)'}]}}}),TypeError);
  assert.throws(()=>I.validate({schemaVersion:1,settings:{unknown:{}}}),TypeError);
});
test('mixed-platform handoff resolves each recommendation and retains explicit overrides in both themes',()=>{
  const p={productType:'Dashboard',platforms:['desktop-web','mobile-web','mobile-web']};
  const profiles=M.resolvePlatformProfiles({},p);assert.equal(Object.keys(profiles).length,2);
  assert.equal(profiles['desktop-web'].light.tokens['--space-12'],'16px');assert.equal(profiles['mobile-web'].light.tokens['--grid-columns'],'4');
  const explicit=M.resolvePlatformProfiles({'grid-layout':{columns:16,gutter:12}},p);
  for(const profile of Object.values(explicit))for(const theme of ['light','dark'])assert.equal(profile[theme].tokens['--grid-columns'],'16');
});
test('agent lifecycle preserves partial output and idempotency on retry, requires approval and exact scope',()=>{
  let r=A.create('request-1','Local sample');r=A.transition(r,'validating');r=A.transition(r,'awaiting-approval');
  assert.throws(()=>A.transition(r,'queued'),RangeError);
  r=A.transition(r,'queued',{decision:'approved'});r=A.transition(r,'running');r=A.append(r,'partial');r=A.transition(r,'failed');
  assert.throws(()=>A.transition(r,'queued',{scope:'Publish'}),RangeError);
  const retry=A.transition(r,'queued');assert.equal(retry.output,'partial');assert.equal(retry.idempotencyKey,'request-1');
  r=A.transition(retry,'running');r=A.append(r,' complete');r=A.transition(r,'succeeded');assert.equal(r.output,'partial complete');
  assert.throws(()=>A.append(r,' late'),RangeError);assert.throws(()=>A.transition(r,'running'),RangeError);
});
test('project drafts reject newer schemas and handoff includes truthful assets and all nine contracts',()=>{
  const store=value=>({getItem:key=>key===P.DRAFT?JSON.stringify(value):null});
  assert.throws(()=>P.read(store({version:2}),P.DRAFT),/newer version/);
  assert.throws(()=>P.read(store({version:1,project:'Draft',platforms:['made-up']}),P.DRAFT),/invalid platforms/);
  const text=P.markdown(null,{icons:{uploads:[{name:'icon.svg'}]},typography:{primaryFont:{family:'Custom',source:'uploaded file',dataUrl:'data:font/woff2;base64,AA=='}}});
  assert.match(text,/Foundation JSON/);assert.match(text,/icon.svg/);assert.match(text,/font dependencies/);
  assert.doesNotMatch(text,/never saved to this workspace/);assert.match(text,/AI & Agents/);assert.match(text,/unsupported versions/i);
});
