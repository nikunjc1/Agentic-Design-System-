const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const M=require('../foundation-model.js');
const ROOT=path.resolve(__dirname,'..');
test('AI approval foregrounds maintain text contrast on all status button states',()=>{
  const blend=(fg,bg,a)=>'#'+fg.slice(1).match(/../g).map((n,i)=>Math.round(parseInt(n,16)*a+parseInt(bg.slice(1+2*i,3+2*i),16)*(1-a)).toString(16).padStart(2,'0')).join('');
  for(const theme of ['light','dark'])for(const color of ['#FF031A','#2FBF6E','#FFFFFF','#000000','#FFFF00','#808080','#0000FF'])for(const surface of ['#FFFFFF','#15171A','#888888']){
    const t=M.resolve({'status-colors':{[theme]:{success:color,danger:color}},'bg-colors':{[theme]:{secondary:surface}}},theme).tokens;
    for(const name of ['green','danger'])assert.ok(M.contrast(t['--'+name+'-700'],surface)>=4.5);
    for(const tier of ['high','medium','low']){let value=t['--color-ai-confidence-'+tier];const alias=value.match(/^var\((--[\w-]+)\)$/);if(alias)value=t[alias[1]];assert.ok(M.contrast(value,surface)>=4.5,theme+' confidence '+tier);}
    for(const action of ['approve','reject'])for(const [state,a] of [['default',.2],['hover',.28],['active',.36]]){
      const bg=t['--agent-'+action+'-bg-'+state];assert.equal(bg,blend(action==='reject'?t['--type-body-color']:color,surface,a));
      assert.ok(M.contrast(t['--agent-'+action+'-text-'+state],bg)>=4.5,`${theme} ${color} ${surface} ${state}`);
    }
  }
});
test('dimension, border and reference-asset records reject invalid saved settings',()=>{
  for(const value of [{color:'zzzzzz'},{opacity:'101'},{width:'9'},{style:'random'},{sides:'random'}])assert.equal(M.validRecord('ads:border',value),false);
  assert.equal(M.validRecord('ads:border',{color:'ABCDEF',darkColor:'#123456',width:'0',opacity:'0',style:'none',sides:'start'}),true);
  assert.equal(M.validRecord('ads:border-states',{focus:{light:'broken'}}),false);
  assert.equal(M.validRecord('ads:sizing',{target:43}),false);assert.equal(M.validRecord('ads:sizing',{control:40,target:44,icon:16,content:960,sidebar:240}),true);
  const asset={name:'reference.svg',dataUrl:'data:image/svg+xml;base64,PHN2Zy8+'};
  assert.equal(M.validRecord('ads:icons',{uploads:[asset]}),true);
  for(const uploads of [[{...asset,dataUrl:'https://example.test/icon.svg'}],Array(11).fill(asset),[{...asset,dataUrl:'data:image/png;base64,'+'A'.repeat(2800001)}]])assert.equal(M.validRecord('ads:icons',{uploads}),false);
  assert.equal(M.normalizeData({mask:'ab'}).mask,M.dataDefaults.mask);
  assert.equal(M.validRecord('ads:data-format',{mask:'ab'}),false);
  assert.equal(M.validRecord('ads:data-format',{decimals:7}),false);
  assert.equal(M.validRecord('ads:data-format',{zone:'bad/zone'}),false);
  assert.equal(M.validRecord('ads:data-format',{locale:'de-DE',separator:'comma'}),false);
  assert.equal(M.validRecord('ads:data-format',{locale:'de-DE',separator:'locale',zone:'Asia/Kolkata',mask:'•',decimals:3}),true);
});
test('every typography role resolves all chosen metrics in each theme',()=>{
  for(const role of Object.keys(M.typeDefaults)) {
    const saved={typography:{primaryFont:{family:'Lora'},secondaryFont:{family:'Inter'},levels:{[role]:{family:'primary',size:'text-xl',weight:'600',lineHeightPct:'180',letterSpacing:1.5,italic:true,color:'#123456',darkColor:'#ABCDEF'}}}};
    for(const theme of ['light','dark']) {const t=M.resolve(saved,theme).tokens,p='--type-'+role+'-';assert.equal(t[p+'family'],'var(--font-display)');assert.equal(t[p+'size'],'20px');assert.equal(t[p+'weight'],'600');assert.equal(t[p+'line-height'],'1.8');assert.equal(t[p+'tracking'],'1.5px');assert.equal(t[p+'style'],'italic');assert.equal(t[p+'color'],theme==='light'?'#123456':'#ABCDEF');}
  }
});
test('restoring the heading scale preserves other roles, fonts and theme colors',()=>{
  const saved={primaryFont:{family:'Lora'},secondaryFont:{family:'Inter'},platform:'saas',levels:{
    h1:{size:'display-xs',weight:'500',lineHeightPct:'180',color:'#123456',darkColor:'#ABCDEF',letterSpacing:-1,italic:true},
    h2:{size:'display-sm'},body:{size:'text-sm',weight:'600'},paragraph:{size:'text-lg'},caption:{size:'text-2xs'}
  }};
  const before=JSON.stringify(saved), restored=M.restoreHeadingScale(saved);
  assert.equal(restored.headingScaleVersion,2);assert.equal(JSON.stringify(saved),before);
  assert.deepEqual(restored.primaryFont,saved.primaryFont);assert.equal(restored.levels.h1.color,'#123456');assert.equal(restored.levels.h1.darkColor,'#ABCDEF');assert.equal(restored.levels.h1.letterSpacing,-1);
  for(const role of ['body','paragraph','caption'])assert.deepEqual(restored.levels[role],saved.levels[role]);
  for(const theme of ['light','dark'])for(const unit of ['px','rem']) {
    const t=M.resolve({typography:restored,units:{unit}},theme).tokens;
    ['h1','h2','h3','h4','h5','h6'].forEach((role,i)=>{
      assert.equal(M.toPx(t['--type-'+role+'-size']),[32,28,24,20,18,16][i]);
      assert.equal(t['--type-'+role+'-line-height'],String(Number(M.typeDefaults[role].lineHeightPct)/100));
      assert.equal(t['--type-'+role+'-weight'],M.typeDefaults[role].weight);
    });
  }
  const migrated=M.migrateRecord('typography',{...saved,headingScaleVersion:1});
  assert.equal(migrated.headingScaleVersion,2);
  assert.equal(M.inspectRecord('typography',JSON.stringify({...saved,schemaVersion:1,headingScaleVersion:1})).status,'migrated');
  assert.equal(migrated.levels.h1.weight,'500');assert.equal(migrated.levels.h1.lineHeightPct,'180');
  assert.deepEqual(migrated.levels.body,saved.levels.body);assert.equal(JSON.stringify(saved),before);
  migrated.levels.h1.size='display-xl';
  assert.equal(M.migrateRecord('typography',migrated).levels.h1.size,'display-xl','Later custom edits must not be reset');
  assert.equal(M.inspectRecord('typography',JSON.stringify({...saved,headingScaleVersion:3})).status,'future');
});
test('px/rem round trips preserve fractional and negative dimensions',()=>{
  for(const n of [-1.5,0,1,1.25,14,24,48,1200])assert.equal(M.convert(M.convert(n,'px','rem'),'rem','px'),n);
  assert.equal(M.toPx('0.375rem'),6);assert.equal(M.toPx('6px'),6);assert.ok(Number.isNaN(M.toPx('50%')));
  assert.throws(()=>M.convert('invalid','px','rem'),RangeError);
  const px=M.resolve({radius:{philosophy:'compact'},spacing:{system:'8px'}}),rem=M.resolve({radius:{philosophy:'compact'},spacing:{system:'8px'},units:{unit:'rem'}});
  for(const [key,value] of Object.entries(px.tokens)) if(/^-?[\d.]+px$/.test(value))assert.equal(M.toPx(rem.tokens[key]),M.toPx(value),key);
  assert.equal(rem.tokens['--type-body-line-height'],'1.5');assert.equal(rem.tokens['--grid-columns'],'12');
});
test('button foreground meets 4.5:1 in all three states across palettes, except the documented factory-red exception',()=>{
  // #FF031A (this system's own shipped default) is a deliberate carve-out:
  // WCAG's ratio undercounts how bright a saturated near-pure-red reads, so
  // the ratio's own "winner" there is black text that looks broken on the
  // button - see the comment above the isFactoryRed check in resolve().
  // White is used instead, which clears 3:1 (the UI-component/large-text
  // floor) but not 4.5:1. Every other brand - including arbitrary colors a
  // user could pick on the Colors page - still gets the full 4.5:1 guarantee.
  for(const theme of ['light','dark'])for(const brand of ['#FF031A','#000000','#FFFFFF','#777777','#00FF00','#8B5CF6','#FFFF00','#123456']) {
    const t=M.resolve({colors:{light:{primary:{hex:brand}}}},theme).tokens;
    const isFactoryRed=brand==='#FF031A';
    for(const [state,bg]of[['default','--red-500'],['hover','--red-400'],['active','--red-600']])assert.ok(M.contrast(t['--button-primary-text-'+state],t[bg])>=(isFactoryRed?3:4.5),brand+' '+state);
  }
});
test('changing radius adjusts semantic aliases without renaming numeric primitives',()=>{
  const a=M.resolve({radius:{philosophy:'sharp'}}).tokens,b=M.resolve({radius:{philosophy:'expressive'}}).tokens;
  assert.equal(a['--radius-12'],'12px');assert.equal(b['--radius-12'],'12px');assert.equal(a['--radius-md'],'4px');assert.equal(b['--radius-md'],'16px');
});
test('spacing, sizing, borders, shadows, icons and grid resolve saved settings',()=>{
  const t=M.resolve({spacing:{system:'8px'},sizing:{control:48,target:56,sidebar:300},border:{width:2,color:'123456',darkColor:'ABCDEF',opacity:50,style:'dashed',sides:'start'},shadow:{philosophy:'flat'},icons:{size:'32',stroke:'2.2',corner:'sharp'},'grid-layout':{columns:16,gutter:12,system:'columns-rows'},'border-states':{error:{light:'AA0000',dark:'FF0000'}}},'dark').tokens;
  assert.equal(t['--space-12'],'16px');assert.equal(t['--size-control'],'48px');assert.equal(t['--size-target'],'56px');assert.equal(t['--border-width-1'],'2px');assert.equal(t['--border-style'],'dashed');assert.equal(t['--border-sides'],'start');assert.equal(t['--border-state-error'],'#FF0000');assert.equal(t['--shadow-xl'],'none');assert.equal(t['--icon-size'],'32px');assert.equal(t['--grid-columns'],'16');assert.equal(t['--grid-gutter'],'12px');
});
test('focus preset cannot recolor or widen resting component boundaries',()=>{
  for(const theme of ['light','dark']) {
    const baseline=M.resolve({},theme).tokens;
    const t=M.resolve({border:{system:'focus',width:'2',color:'4F8FE6',darkColor:'8AB2E8',darkColorAuto:true,opacity:'100',style:'solid',sides:'all'}},theme).tokens;
    for(const key of ['--control-border','--line','--line-strong','--border-width-1','--border-style','--border-sides'])assert.equal(t[key],baseline[key],key+' '+theme);
    assert.equal(t['--border-state-focus'],theme==='dark'?'var(--red-400)':'var(--red-500)');
    assert.equal(t['--color-focus-ring'],'var(--border-state-focus)');
    assert.equal(t['--focus-ring-width'],'2px');
  }
});
test('blue project accents do not tint structural boundaries, but the Borders page color now really drives them',()=>{
  for(const theme of ['light','dark']) {
    const baseline=M.resolve({},theme).tokens;
    // Brand (Colors page) must stay fully independent of structural line
    // tokens - changing the accent alone must not move Card/Table/Modal
    // borders or dividers one bit.
    const brandOnly=M.resolve({colors:{light:{primary:{hex:'#0000FF'}}}},theme).tokens;
    for(const key of ['--line','--line-strong','--card-border-color','--table-border-color','--modal-border-color'])assert.equal(brandOnly[key],baseline[key],key+' '+theme);
    assert.equal(brandOnly['--red-500'],'#0000FF');
    // Colors page's own Neutral-scale "Control border" field is a separate
    // control from the Borders page below - it must keep tinting only
    // --control-border (form control outlines), never the shell's line
    // tokens real components actually border with.
    const controlBorderOnly=M.resolve({'neutral-colors':{[theme]:{border:'4F8FE6'}}},theme).tokens;
    assert.equal(controlBorderOnly['--control-border'],'#4F8FE6');
    for(const key of ['--line','--line-strong','--card-border-color','--table-border-color','--modal-border-color'])assert.equal(controlBorderOnly[key],baseline[key],key+' '+theme);
    // The Borders page's own color+opacity is the one control meant to
    // drive --line/--line-strong (and, same as before, --control-border
    // too) - per explicit instruction, Draw in Figma and every real
    // component border must actually follow it now, not just this page's
    // own local preview.
    const t=M.resolve({colors:{light:{primary:{hex:'#0000FF'}}},border:{system:'brand',width:2,color:'4F8FE6',darkColor:'8AB2E8',opacity:100}},theme).tokens;
    const expectedRgb=theme==='dark'?'138,178,232':'79,143,230';
    assert.equal(t['--control-border'],`rgba(${expectedRgb},1)`);
    // Authored CSS capture preserves each token's identity without changing opacity.
    assert.equal(t['--line-strong'],`rgba(${expectedRgb},1)`);
    assert.equal(t['--line-strong'],t['--control-border']);
    assert.equal(t['--line'],`rgba(${expectedRgb},0.533)`);
    assert.equal(t['--card-border-color'],'var(--line-strong)');assert.equal(t['--table-border-color'],'var(--line)');assert.equal(t['--modal-border-color'],'var(--line-strong)');
  }
});
test('legacy blue focus defaults migrate without changing info or custom state colors',()=>{
  const saved={'border-states':{focus:{light:'4F8FE6',dark:'8AB2E8',darkAuto:true},info:{light:'4F8FE6',dark:'8AB2E8'},error:{light:'AA0000',dark:'FF0000'}}};
  const before=JSON.stringify(saved);
  for(const theme of ['light','dark']) {
    const t=M.resolve(saved,theme).tokens;
    assert.equal(t['--border-state-focus'],theme==='dark'?'var(--red-400)':'var(--red-500)');
    assert.equal(t['--border-state-info'],theme==='dark'?'#8AB2E8':'#4F8FE6');
    assert.equal(t['--border-state-error'],theme==='dark'?'#FF0000':'#AA0000');
    const custom=M.resolve({'border-states':{focus:{light:'123456',dark:'ABCDEF',darkAuto:false}}},theme).tokens;
    assert.equal(custom['--border-state-focus'],theme==='dark'?'#ABCDEF':'#123456');
  }
  assert.equal(JSON.stringify(saved),before);
  assert.equal(M.normalizeFocusState({light:'4F8FE6',dark:'8AB2E8',darkAuto:false}).light,'4F8FE6');
});
test('default focus follows the brand and maintains a ring in both dimensional units',()=>{
  for(const theme of ['light','dark'])for(const unit of ['px','rem']) {
    const t=M.resolve({colors:{light:{primary:{hex:'#123456'}}},units:{unit},'border-states':{focus:{light:'FF031A',dark:'FF4253',darkAuto:true}}},theme).tokens;
    const target=t['--border-state-focus'].slice(4,-1);
    assert.equal(t[target],theme==='dark'?'#4d6780':'#123456');
    assert.equal(M.toPx(t['--focus-ring-width']),2);
  }
});
test('context defaults agree for single-platform and multiple-platform projects',()=>{
  const p={productType:'Data-Heavy Application',platforms:['desktop-web']};assert.equal(M.recommendedProduct(p),'desktop-web');assert.equal(M.contextualDefault('spacing',p).system,'8px');assert.equal(M.contextualDefault('radius',p),null);assert.equal(M.contextualDefault('grid-layout',p).gutter,24);
  p.platforms.push('mobile-web');assert.equal(M.contextualDefault('spacing',p).system,'2px');assert.equal(M.contextualDefault('radius',p),null);assert.equal(M.contextualDefault('grid-layout',p).system,'columns-rows');
});
test('Project Setup seeds Typography, saved choices win, and Radius stays a manual choice',()=>{
  const profile={productType:'Consumer App',platforms:['mobile-app']};
  const initial=M.resolve({},'light',profile);
  assert.equal(initial.tokens['--type-h1-size'],'30px');
  assert.equal(initial.tokens['--grid-columns'],'4');
  assert.equal(initial.tokens['--radius-md'],'8px');
  const saved={typography:{headingScaleVersion:2,levels:{h1:{size:'display-xl'}}},radius:{philosophy:'sharp'}};
  const custom=M.resolve(saved,'light',profile);
  assert.equal(custom.tokens['--type-h1-size'],'60px');
  assert.equal(custom.tokens['--radius-md'],'4px');
});
test('malformed records and out-of-bounds values are rejected or safely resolved',()=>{
  for(const v of [[],null,'bad'])assert.equal(M.validRecord('ads:typography',v),false);
  assert.equal(M.validRecord('ads:typography',{levels:{h1:{lineHeightPct:'5'}}}),false);
  assert.equal(M.validRecord('ads:colors',{light:{primary:{hex:123}}}),false);
  for(const v of [{columns:25},{columns:1.5},{gutter:65},{gutter:2.2}])assert.equal(M.validRecord('ads:grid-layout',v),false);
  const t=M.resolve({typography:{levels:{h1:{size:'bad',weight:'bad',letterSpacing:500}}},sizing:{target:1},radius:{philosophy:'bad'}}).tokens;
  assert.equal(t['--type-h1-size'],'32px');assert.equal(t['--type-h1-weight'],'700');assert.equal(t['--type-h1-tracking'],'0px');assert.equal(t['--size-target'],'44px');
});
test('data formatting distinguishes zero, absence, nonnumeric and loading',()=>{
  assert.equal(M.format(0,'number',{}),'0');assert.equal(M.format(null,'number',{}),'–');assert.equal(M.format(NaN,'number',{}),'–');assert.equal(M.format('bad','number',{}),'–');assert.equal(M.format(null,'loading',{}),'Loading…');
  assert.equal(M.format(123220,'number',{locale:'en-US',separator:'none'}),'123220');assert.equal(M.format(123220,'number',{locale:'en-US',separator:'comma'}),'123,220');assert.equal(M.format(220,'unit',{unit:'lb',unitSpace:'nbsp'}),'220\u00a0lb');
  assert.match(M.format(123.45,'currency',{locale:'en-US',currency:'USD'}),/^\$123\.45$/);assert.match(M.format(1234567,'large',{locale:'en-US'}),/M/);assert.equal(M.format(.125,'percent',{locale:'en-US'}),'12.5%');
});
test('date formatting handles zones, calendar dates, ranges and invalid values',()=>{
  assert.equal(M.format('2026-03-14','date',{zone:'America/New_York'}),'03/14/2026');assert.equal(M.format('2026-02-30','date',{}),'–');assert.equal(M.format('bad','date',{}),'–');
  assert.equal(M.format('2026-03-14T23:30:00Z','date',{zone:'Asia/Kolkata'}),'03/15/2026');
  assert.match(M.format('2026-03-14T14:08:00Z','time',{zone:'UTC',seconds:true}),/14:08:00/);
  assert.equal(M.format(['2026-01-01','2026-03-31'],'range',{}),'01/01/2026 to 03/31/2026');
  assert.equal(M.format('2026-03-14T14:00:00Z','relative',{locale:'en-US'},{now:'2026-03-14T14:12:00Z'}),'12 minutes ago');
});
test('redaction never exposes a full short value and invalid locale/zone recover',()=>{
  assert.equal(M.format('123456781402','partial',{}),'********1402');assert.equal(M.format('1234','full',{}),'****');assert.ok(!M.format('a','partial',{}).includes('a'));
  const c=M.normalizeData({locale:'INVALID!',zone:'not/a/zone',decimals:999,separator:'comma'});assert.equal(c.locale,'en-US');assert.equal(c.zone,'UTC');assert.equal(c.decimals,2);
  assert.equal(M.normalizeData({locale:'de-DE',separator:'comma'}).separator,'locale');
});
test('component code exports keep comments and use the selected Foundation metrics',()=>{
  const code=M.prepareCode('/* line-height: 38px is a sample comment. */\n.example{font-size:var(--type-body-size);font-weight:600;line-height:20px;gap:8px;border:1.5px solid var(--line);height:40px;}');
  assert.match(code,/line-height: 38px is a sample comment/);assert.match(code,/font-weight:var\(--type-body-weight\)/);assert.match(code,/line-height:var\(--type-body-line-height\)/);assert.match(code,/gap:var\(--space-8\)/);assert.match(code,/height:var\(--dimension-40\)/);assert.match(code,/border:var\(--border-width-1\) var\(--border-style\)/);
});
test('all live pages load the resolver before boot and bindings last',()=>{
  const pages=fs.readdirSync(ROOT).filter(p=>p.endsWith('.html'));assert.ok(pages.includes('component-editor.html'));assert.equal(pages.length,JSON.parse(fs.readFileSync(path.join(ROOT,'docs-catalog-manifest.json'),'utf8')).pageCount);
  for(const page of pages) {const s=fs.readFileSync(path.join(ROOT,page),'utf8');assert.ok(s.indexOf('src="foundation-model.js"')<s.indexOf('src="foundation-runtime.js"'),page);assert.ok(s.indexOf('src="foundation-runtime.js"')<s.indexOf('src="theme-init.js"'),page);assert.ok(s.includes('href="foundation.css"'),page);assert.doesNotMatch(s,/<p\s+class="panel-title"/,page);assert.doesNotMatch(s,/<span class="badge badge-(?:required|optional)">/,page);}
});
test('CSS dependencies resolve and responsive thresholds never contain custom properties',()=>{
  const css=['theme.css','shell.css','experience.css','foundation.css'].map(f=>fs.readFileSync(path.join(ROOT,f),'utf8')).join('\n');
  const known=new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(m=>m[1]));for(const k of Object.keys(M.resolve().tokens))known.add(k);
  const missing=[...css.matchAll(/var\((--[\w-]+)\)/g)].map(m=>m[1]).filter(k=>!known.has(k));assert.deepEqual([...new Set(missing)],[]);
  for(const media of css.matchAll(/@media[^{}]+/g))assert.doesNotMatch(media[0],/var\(/);
  const clean=css.replace(/\/\*[\s\S]*?\*\//g,'');assert.doesNotMatch(clean,/;\s*\{/);assert.equal((clean.match(/{/g)||[]).length,(clean.match(/}/g)||[]).length);
  assert.doesNotMatch(clean,/[\w)]font-family:/,'CSS declarations need a semicolon before the font family');
});
test('shared border styling cannot revive inner borders or override form variants',()=>{
  const css=fs.readFileSync(path.join(ROOT,'foundation.css'),'utf8').replace(/\/\*[\s\S]*?\*\//g,'');
  for(const [,selector,body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const native=/(?:^|[\s,(])(?:input|select|textarea)(?=[\s,):.#\[]|$)/.test(selector);
    if(native&&/\bborder-style\s*:/.test(body))assert.match(body,/\bborder(?:-width)?\s*:/,'Changing native border style must specify width: '+selector);
    // Variant classes own filled/underlined borders and underlined square corners.
    if(/\.(?:input|select|search)-demo-control(?=[\s,)])/g.test(selector)&&!/\s:is\(input,textarea\)/.test(selector))assert.doesNotMatch(body,/\bborder-(?:style|radius|color)\s*:/,'Base control rules must not override variants: '+selector);
  }
  const shell=fs.readFileSync(path.join(ROOT,'shell.css'),'utf8');
  for(const kind of ['input','password','number','search','textarea','addon','autocomplete','cascader','treeselect']) {
    assert.match(shell,new RegExp('\\.'+kind+'-demo-control--outlined[^{}]*:focus[^{}]*\\{[^{}]*outline:\\s*(?:2px|var\\(--focus-ring-width\\)) solid var\\(--color-focus-ring\\)'),kind+' needs an outer keyboard focus indicator');
  }
});
test('head boot, same-page changes, reload defaults and cross-tab clearing use one resolver',async()=>{
  const store=new Map(),style=new Map(),events=new EventTarget();
  const root={dataset:{},dir:'',style:{getPropertyValue:k=>style.get(k)||'',setProperty:(k,v)=>style.set(k,v),removeProperty:k=>style.delete(k)}};
  const document={documentElement:root,body:null,addEventListener(){},querySelectorAll:()=>[]};
  class CE extends Event {constructor(name,opts){super(name);this.detail=opts?.detail;}}
  const window={ADSFoundationModel:M,addEventListener:events.addEventListener.bind(events),dispatchEvent:events.dispatchEvent.bind(events)};
  const context={window,document,localStorage:{getItem:k=>store.get(k)||null},location:{href:'https://example.test/overview.html',pathname:'/overview.html'},MutationObserver:class{observe(){}},CustomEvent:CE,queueMicrotask,setTimeout,clearTimeout,URL,console};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'foundation-runtime.js'),'utf8'),context);
  assert.equal(style.get('--type-h1-size'),'32px');
  window.dispatchEvent(new CE('ads:foundation-change',{detail:{key:'ads:typography',value:{headingScaleVersion:2,levels:{h1:{size:'text-xl',color:'#123456'}}}}}));await Promise.resolve();assert.equal(style.get('--type-h1-size'),'20px');assert.equal(style.get('--type-h1-color'),'#123456');
  window.dispatchEvent(new CE('ads:foundation-change',{detail:{key:'ads:typography',removed:true}}));await Promise.resolve();assert.equal(style.get('--type-h1-size'),'32px');
  store.set('ads:typography',JSON.stringify({headingScaleVersion:2,levels:{h1:{size:'display-sm'}}}));const event=new Event('storage');event.key='ads:typography';events.dispatchEvent(event);assert.equal(style.get('--type-h1-size'),'30px');
  store.clear();const clear=new Event('storage');clear.key=null;events.dispatchEvent(clear);assert.equal(style.get('--type-h1-size'),'32px');
});
test('storage failure keeps saved data, applies a marked preview, and blocks failed resets',async()=>{
  const store=new Map([['ads:spacing',JSON.stringify({system:'4px'})]]),styles=new Map(),events=new EventTarget();let quota=false,resetFailure=false;
  const element=()=>({classList:{add(){},remove(){}},setAttribute(){},appendChild(){}});
  const root={...element(),dataset:{},style:{getPropertyValue:k=>styles.get(k)||'',setProperty:(k,v)=>styles.set(k,v),removeProperty:k=>styles.delete(k)}};
  const document={documentElement:root,body:null,addEventListener(){},querySelectorAll:()=>[],createElement:element};
  class CE extends Event {constructor(name,opts){super(name);this.detail=opts?.detail;}}
  const window={ADSFoundationModel:M,addEventListener:events.addEventListener.bind(events),dispatchEvent:events.dispatchEvent.bind(events)};
  const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>{if(quota)throw new Error('Quota');store.set(k,v);},removeItem:k=>{if(resetFailure)throw new Error('Blocked');store.delete(k);}};
  const context={window,document,localStorage,location:{href:'https://example.test/',pathname:'/'},MutationObserver:class{observe(){}},CustomEvent:CE,queueMicrotask,setTimeout:()=>0,clearTimeout(){},URL,console:{warn(){}}};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'foundation-runtime.js'),'utf8'),context);
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'shell.js'),'utf8'),context);
  quota=true;assert.equal(window.ADSStorage.safeSet('ads:spacing',{system:'8px'}),false);await Promise.resolve();assert.equal(JSON.parse(store.get('ads:spacing')).system,'4px');assert.equal(window.ADSStorage.lastWriteSucceeded,false);assert.equal(styles.get('--space-12'),'16px');
  resetFailure=true;assert.equal(window.ADSStorage.safeRemove('ads:spacing'),false);assert.equal(JSON.parse(store.get('ads:spacing')).system,'4px');
  assert.equal(window.ADSStorage.safeSet('ads:spacing',{system:'invalid'}),false);
  quota=false;resetFailure=false;assert.equal(window.ADSStorage.safeRemove('ads:spacing'),true);await Promise.resolve();assert.equal(styles.get('--space-12'),'12px');
});
test('component radius menus include every semantic medium radius exactly',()=>{
  const files=fs.readdirSync(ROOT).filter(f=>f.endsWith('-detail.js'));
  const problems=[];
  for(const file of files){
    const content=fs.readFileSync(path.join(ROOT,file),'utf8');
    const match=/var\s+RADIUS_OPTIONS\s*=\s*\[([\s\S]*?)\];/.exec(content);
    if(!match)continue;
    const values=[...match[1].matchAll(/value:\s*"(\d+)"/g)].map(m=>Number(m[1]));
    for(const philosophy of ['sharp','compact','balanced','soft','expressive']) {
      const expected=M.toPx(M.resolve({radius:{philosophy}}).tokens['--radius-md']);
      // Menu deliberately stops at 12px (16px, 24px and Full were removed by request), so under Expressive its default snaps to 12px.
      if(file==='menu-detail.js'&&expected>12)continue;
      if(!values.includes(expected))problems.push(file+': '+philosophy+' needs '+expected);
    }
  }
  assert.deepEqual(problems,[]);
});

test('brand colors follow the active theme with a light fallback for legacy records',()=>{
  const saved={colors:{light:{primary:{hex:'#176941'}},dark:{primary:{hex:'#84CFA7'}}}};
  assert.equal(M.resolve(saved,'light').tokens['--red-500'],'#176941');
  assert.equal(M.resolve(saved,'dark').tokens['--red-500'],'#84CFA7');
  assert.equal(M.resolve({colors:{light:saved.colors.light}},'dark').tokens['--red-500'],'#176941');
});
test('custom border opacity is exact and untouched default rows do not mask it',()=>{
  const tokens=M.resolve({border:{color:'7250A0',opacity:70},'border-states':{default:{light:'9A9A95'},disabled:{light:'9A9A95'}}}).tokens;
  assert.equal(tokens['--line-strong'],'rgba(114,80,160,0.7)');
  assert.equal(tokens['--border-state-default'],undefined);
  assert.equal(tokens['--border-state-disabled'],undefined);
  const custom=M.resolve({'border-states':{default:{light:'8A2452'},disabled:{light:'8A2452'}}}).tokens;
  assert.equal(custom['--border-state-default'],'#8A2452');
  assert.equal(custom['--border-state-disabled'],'#8A2452');
});
