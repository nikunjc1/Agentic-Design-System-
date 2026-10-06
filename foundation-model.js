/* Shared Foundation contract. Pure functions; usable in browsers and Node. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ADSFoundationModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  /* BEGIN GENERATED PRIMITIVES */
  const primitives = {"light":{"--graphite-950":"#f6f6f4","--graphite-900":"#ffffff","--graphite-850":"#fbfbfa","--graphite-800":"#f1f1ee","--graphite-700":"#e3e3df","--graphite-600":"#c7c7c1","--graphite-500":"#8f918c","--control-border":"#85888d","--line":"rgba(15,15,10,0.08)","--line-strong":"rgba(15,15,10,0.15)","--border-width-0":"0px","--border-width-1":"1px","--border-width-1-5":"1.5px","--border-width-2":"2px","--border-width-3":"3px","--border-width-4":"4px","--text-hi":"#15171a","--text-mid":"#53565c","--text-dim":"#85888d","--overlay-invert-bg":"#15171a","--overlay-invert-text":"#ffffff","--opacity-40":"0.4","--opacity-50":"0.5","--color-focus-ring":"var(--red-400)","--color-on-brand":"var(--on-brand-text)","--on-brand-text":"#15171A","--red-500":"#ff031a","--red-400":"#ff3f4f","--red-600":"#d80016","--red-glow":"rgba(255,3,26,0.35)","--red-tint":"rgba(255,3,26,0.07)","--brand-500":"var(--red-500)","--brand-400":"var(--red-400)","--brand-600":"var(--red-600)","--brand-glow":"var(--red-glow)","--brand-tint":"var(--red-tint)","--surface-page":"var(--graphite-950)","--surface-panel":"var(--graphite-900)","--surface-raised":"var(--graphite-850)","--green-500":"#2fbf6e","--amber-500":"#e6a53a","--danger-500":"#ff031a","--danger-400":"#ff3f4f","--danger-600":"#d80016","--blue-500":"#4f8fe6","--tracking-tight":"-0.01em","--tracking-2":"0.02em","--tracking-3":"0.03em","--tracking-4":"0.04em","--tracking-5":"0.05em","--tracking-6":"0.06em","--tracking-8":"0.08em","--tracking-10":"0.1em","--tracking-12":"0.12em","--tracking-14":"0.14em","--font-display":"\"Inter\", ui-sans-serif, system-ui, sans-serif","--font-body":"\"Inter\", ui-sans-serif, system-ui, sans-serif","--font-mono":"\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", monospace","--numeric-tabular":"tabular-nums","--radius-none":"0px","--radius-2":"2px","--radius-sm":"4px","--radius-6":"6px","--radius-md":"8px","--radius-12":"12px","--radius-16":"16px","--radius-24":"24px","--radius-full":"9999px","--space-4":"4px","--space-8":"8px","--space-12":"12px","--space-16":"16px","--space-20":"20px","--space-24":"24px","--space-28":"28px","--space-32":"32px","--space-40":"40px","--space-48":"48px","--space-56":"56px","--space-64":"64px","--space-72":"72px","--space-80":"80px","--space-96":"96px","--space-112":"112px","--space-128":"128px","--shadow-none":"none","--shadow-xs":"0 1px 2px rgba(0,0,0,0.06)","--shadow-sm":"0 1px 4px rgba(0,0,0,0.08)","--shadow-md":"0 4px 8px rgba(0,0,0,0.10)","--shadow-lg":"0 8px 16px rgba(0,0,0,0.12)","--shadow-xl":"0 12px 24px rgba(0,0,0,0.14)","--shadow-2xl":"0 16px 32px rgba(0,0,0,0.16)","--overlay-scrim":"rgba(0,0,0,0.55)","--duration-fast":"0.12s","--duration-base":"0.15s","--duration-slow":"0.8s","--duration-shimmer":"1.5s","--ease-standard":"ease","--ease-emphasis":"ease-in-out","--ease-linear":"linear","--button-primary-bg-default":"var(--red-500)","--button-primary-bg-hover":"var(--red-400)","--button-primary-bg-active":"var(--red-600)","--button-primary-text":"var(--color-on-brand)","--button-primary-focus-ring":"var(--color-focus-ring)","--button-primary-disabled-opacity":"0.45","--table-cell-padding-y-default":"var(--space-8)","--table-cell-padding-y-compact":"var(--space-4)","--table-header-text":"var(--text-dim)","--table-border-color":"var(--line)","--modal-scrim":"var(--overlay-scrim)","--modal-surface":"var(--graphite-900)","--modal-shadow":"var(--shadow-xl)","--modal-border-color":"var(--line-strong)","--card-surface":"var(--graphite-900)","--card-border-color":"var(--line-strong)","--card-shadow-rest":"var(--shadow-sm)","--card-shadow-hover":"var(--shadow-md)","--card-shadow-pressed":"var(--shadow-xs)","--color-ai-accent":"#8b5cf6","--color-ai-accent-strong":"#7c3aed","--color-ai-accent-tint":"rgba(139,92,246,0.12)","--color-ai-confidence-high":"var(--green-500)","--color-ai-confidence-medium":"var(--amber-500)","--color-ai-confidence-low":"var(--danger-500)","--color-agent-success":"var(--green-500)","--color-agent-failure":"var(--danger-500)"},"dark":{"--graphite-950":"#0d0f11","--graphite-900":"#15171a","--graphite-850":"#191c20","--graphite-800":"#1c1f23","--graphite-700":"#262a2f","--graphite-600":"#383d44","--graphite-500":"#565c64","--control-border":"#72767e","--line":"rgba(255,255,255,0.08)","--line-strong":"rgba(255,255,255,0.16)","--border-width-0":"0px","--border-width-1":"1px","--border-width-1-5":"1.5px","--border-width-2":"2px","--border-width-3":"3px","--border-width-4":"4px","--text-hi":"#f3f2ef","--text-mid":"#a7abb2","--text-dim":"#64686f","--overlay-invert-bg":"#f3f2ef","--overlay-invert-text":"#15171a","--opacity-40":"0.4","--opacity-50":"0.5","--color-focus-ring":"var(--red-400)","--color-on-brand":"var(--on-brand-text)","--on-brand-text":"#15171A","--red-500":"#ff031a","--red-400":"#ff3f4f","--red-600":"#d80016","--red-glow":"rgba(255,3,26,0.35)","--red-tint":"rgba(255,3,26,0.1)","--brand-500":"var(--red-500)","--brand-400":"var(--red-400)","--brand-600":"var(--red-600)","--brand-glow":"var(--red-glow)","--brand-tint":"var(--red-tint)","--surface-page":"var(--graphite-950)","--surface-panel":"var(--graphite-900)","--surface-raised":"var(--graphite-850)","--green-500":"#2fbf6e","--amber-500":"#e6a53a","--danger-500":"#ff031a","--danger-400":"#ff3f4f","--danger-600":"#d80016","--blue-500":"#4f8fe6","--tracking-tight":"-0.01em","--tracking-2":"0.02em","--tracking-3":"0.03em","--tracking-4":"0.04em","--tracking-5":"0.05em","--tracking-6":"0.06em","--tracking-8":"0.08em","--tracking-10":"0.1em","--tracking-12":"0.12em","--tracking-14":"0.14em","--font-display":"\"Inter\", ui-sans-serif, system-ui, sans-serif","--font-body":"\"Inter\", ui-sans-serif, system-ui, sans-serif","--font-mono":"\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", monospace","--numeric-tabular":"tabular-nums","--radius-none":"0px","--radius-2":"2px","--radius-sm":"4px","--radius-6":"6px","--radius-md":"8px","--radius-12":"12px","--radius-16":"16px","--radius-24":"24px","--radius-full":"9999px","--space-4":"4px","--space-8":"8px","--space-12":"12px","--space-16":"16px","--space-20":"20px","--space-24":"24px","--space-28":"28px","--space-32":"32px","--space-40":"40px","--space-48":"48px","--space-56":"56px","--space-64":"64px","--space-72":"72px","--space-80":"80px","--space-96":"96px","--space-112":"112px","--space-128":"128px","--shadow-none":"none","--shadow-xs":"0 1px 2px rgba(0,0,0,0.06)","--shadow-sm":"0 1px 4px rgba(0,0,0,0.08)","--shadow-md":"0 4px 8px rgba(0,0,0,0.10)","--shadow-lg":"0 8px 16px rgba(0,0,0,0.12)","--shadow-xl":"0 12px 24px rgba(0,0,0,0.14)","--shadow-2xl":"0 16px 32px rgba(0,0,0,0.16)","--overlay-scrim":"rgba(0,0,0,0.55)","--duration-fast":"0.12s","--duration-base":"0.15s","--duration-slow":"0.8s","--duration-shimmer":"1.5s","--ease-standard":"ease","--ease-emphasis":"ease-in-out","--ease-linear":"linear","--button-primary-bg-default":"var(--red-500)","--button-primary-bg-hover":"var(--red-400)","--button-primary-bg-active":"var(--red-600)","--button-primary-text":"var(--color-on-brand)","--button-primary-focus-ring":"var(--color-focus-ring)","--button-primary-disabled-opacity":"0.45","--table-cell-padding-y-default":"var(--space-8)","--table-cell-padding-y-compact":"var(--space-4)","--table-header-text":"var(--text-dim)","--table-border-color":"var(--line)","--modal-scrim":"var(--overlay-scrim)","--modal-surface":"var(--graphite-900)","--modal-shadow":"var(--shadow-xl)","--modal-border-color":"var(--line-strong)","--card-surface":"var(--graphite-900)","--card-border-color":"var(--line-strong)","--card-shadow-rest":"var(--shadow-sm)","--card-shadow-hover":"var(--shadow-md)","--card-shadow-pressed":"var(--shadow-xs)","--color-ai-accent":"#8b5cf6","--color-ai-accent-strong":"#7c3aed","--color-ai-accent-tint":"rgba(139,92,246,0.12)","--color-ai-confidence-high":"var(--green-500)","--color-ai-confidence-medium":"var(--amber-500)","--color-ai-confidence-low":"var(--danger-500)","--color-agent-success":"var(--green-500)","--color-agent-failure":"var(--danger-500)"}};
  /* END GENERATED PRIMITIVES */
  const sizes = { 'text-xs':12, 'text-sm':14, 'text-md':16, 'text-lg':18, 'text-xl':20, 'display-xs':24, 'display-sm':30, 'display-md':36, 'display-lg':48, 'display-xl':60, 'display-2xl':72 };
  const roleSpecs = { h1:['display-lg',125,700], h2:['display-md',122,700], h3:['display-sm',127,600], h4:['display-xs',133,600], h5:['text-xl',150,500], h6:['text-lg',156,500], body:['text-md',150,400], paragraph:['text-md',150,400], caption:['text-xs',150,400], active:['text-sm',143,500], selected:['text-sm',143,600], disabled:['text-sm',143,400], error:['text-sm',143,500], warning:['text-sm',143,500], success:['text-sm',143,500], info:['text-sm',143,500] };
  const roleColors = { body:['#4B5563','#9CA6B4'], paragraph:['#4B5563','#9CA6B4'], caption:['#6B7280','#7F8694'], active:['#FF031A','#F74858'], selected:['#FF031A','#F74858'], disabled:['#9CA3AF','#505763'], error:['#FF3F4F','#FA818B'], warning:['#E6A53A','#E6BC77'], success:['#2FBF6E','#5ECD8F'], info:['#4F8FE6','#8AB2E8'] };
  const typeDefaults = Object.fromEntries(Object.entries(roleSpecs).map(([role,spec]) => [role, { family:role.startsWith('h')?'primary':'secondary', size:spec[0], lineHeightPct:String(spec[1]), weight:String(spec[2]), italic:false, letterSpacing:0, color:(roleColors[role]||['#111827','#D8DFEE'])[0], darkColor:(roleColors[role]||['#111827','#D8DFEE'])[1], darkColorAuto:true }]));
  const dataDefaults = Object.freeze({ locale:'en-GB', grouping:true, separator:'locale', unit:'kg', unitSpace:'none', currency:'GBP', currencyDisplay:'symbol', decimals:2, large:'compact', tableAlign:'end', date:'iso', hourCycle:'h23', seconds:false, combined:'space', relative:true, zone:'UTC', showZone:true, range:' – ', noValue:'–', loading:'skeleton', redaction:'partial', mask:'*', reveal:4, escapedSpace:'space' });
  const sizingDefaults = Object.freeze({ control:40, target:44, icon:24, content:1200, sidebar:264 });
  const radius = { sharp:[2,4,8], compact:[2,6,12], balanced:[4,8,16], soft:[4,12,20], expressive:[8,16,32] };
  const productMap = { 'SaaS':'saas','Enterprise SaaS':'enterprise-saas','Web Application':'web-app','Dashboard':'dashboard','Data-Heavy Application':'data-heavy','Marketing Website':'marketing','Consumer App':'consumer-app','AI Product':'ai-product','Cross-Platform':'cross-platform' };
  const productRules = { saas:[4,'balanced','columns',12,24], 'enterprise-saas':[4,'compact','columns',12,20], 'web-app':[4,'balanced','columns',12,24], 'desktop-web':[8,'compact','columns',12,24], 'mobile-web':[4,'soft','columns',4,16], 'mobile-app':[4,'soft','columns',4,16], dashboard:[4,'compact','columns-rows',12,16], 'data-heavy':[2,'sharp','columns-rows',16,12], marketing:[8,'expressive','rows',12,32], 'consumer-app':[4,'soft','columns',4,16], 'ai-product':[4,'balanced','rows',12,24], 'cross-platform':[4,'balanced','columns',8,20] };
  function record(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  function finite(value, fallback, min, max) { if (value === '' || value == null) return fallback; const n=Number(value); return Number.isFinite(n) && n>=min && n<=max ? n : fallback; }
  function hex(value, fallback) { const s=typeof value==='string'?value:''; return /^#?[\da-f]{6}$/i.test(s)?'#'+s.replace('#',''):fallback; }
  function normalizeFocusState(value) {
    const v=record(value), light=hex(v.light,null)?.toUpperCase(), dark=hex(v.dark,null)?.toUpperCase();
    // Migrate only the old built-in blue pair; retain deliberately customized colors.
    if(light==='#4F8FE6'&&(!dark||dark==='#8AB2E8')&&v.darkAuto!==false) return {...v,light:'FF031A',dark:'FF4253'};
    return {...v};
  }
  function dimension(px, unit='px', base=16) { if (!Number.isFinite(Number(px)) || !(base>0)) throw new RangeError('Invalid dimension'); return (unit==='rem'?Number(px)/base:Number(px))+(unit==='rem'?'rem':'px'); }
  function convert(value, from, to, base=16) { if (!['px','rem'].includes(from)||!['px','rem'].includes(to)||!Number.isFinite(Number(value))||!(base>0)) throw new RangeError('Invalid unit conversion'); return Number(value)*(from===to?1:from==='px'?1/base:base); }
  function toPx(value, base=16) { const match=String(value).trim().match(/^(-?\d+(?:\.\d+)?)(px|rem)$/);return match?convert(Number(match[1]),match[2],'px',base):NaN; }
  function mix(color,target,amount) { return '#'+color.slice(1).match(/../g).map(c=>Math.round(parseInt(c,16)+(target-parseInt(c,16))*amount).toString(16).padStart(2,'0')).join(''); }
  function luminance(color) { const v=color.slice(1).match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4); return v[0]*.2126+v[1]*.7152+v[2]*.0722; }
  function contrast(a,b) { const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
  function foreground(bg) { return contrast(bg,'#000000')>=contrast(bg,'#FFFFFF')?'#000000':'#FFFFFF'; }
  function recommendedProduct(profile) { profile=record(profile); if (Array.isArray(profile.platforms)&&profile.platforms.length===1&&['desktop-web','mobile-web','mobile-app'].includes(profile.platforms[0])) return profile.platforms[0]; return productMap[profile.productType]||null; }
  function contextualDefault(key, profile) { const product=recommendedProduct(profile), r=productRules[product]; if (!r) return null; if(key==='spacing') return { product,system:r[0]+'px' }; if(key==='radius') return { product,philosophy:r[1] }; if(key==='grid-layout') return { product,system:r[2],columns:r[3],gutter:r[4],baseline:false }; return null; }
  function normalizeData(value) {
    const v=record(value), d={...dataDefaults};
    for(const [k,choices] of Object.entries({ separator:['locale','comma','space','none'],unitSpace:['none','space','nbsp'], currencyDisplay:['symbol','code','name'],large:['compact','standard'],tableAlign:['end','start'],date:['iso','locale','long'],hourCycle:['h23','h12'],combined:['space','T'],loading:['skeleton','text'],redaction:['full','partial'],escapedSpace:['space','nbsp','narrow'] })) if(choices.includes(v[k])) d[k]=v[k];
    for(const k of ['grouping','seconds','relative','showZone']) if(typeof v[k]==='boolean') d[k]=v[k];
    for(const k of ['unit','range','noValue','mask']) if(typeof v[k]==='string'&&v[k].trim()&&v[k].length<=24) d[k]=v[k];
    try { if(typeof v.locale==='string'&&Intl.DateTimeFormat.supportedLocalesOf(v.locale).length) d.locale=v.locale; } catch {}
    try { if(typeof v.zone==='string') { new Intl.DateTimeFormat('en',{timeZone:v.zone}); d.zone=v.zone; } } catch {}
    if(typeof v.currency==='string'&&/^[A-Z]{3}$/.test(v.currency)) d.currency=v.currency;
    d.decimals=Math.round(finite(v.decimals,d.decimals,0,6)); d.reveal=Math.round(finite(v.reveal,d.reveal,0,8));
    if(d.separator==='comma'&&new Intl.NumberFormat(d.locale).formatToParts(1.5).some(p=>p.type==='decimal'&&p.value===',')) d.separator='locale';
    return d;
  }
  function validRecord(key,value) {
    if(!value||typeof value!=='object'||Array.isArray(value)) return false;
    key=key.replace(/^ads:/,'');
    const validNumber=(v,min,max)=>v==null||(v!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max);
    if(key==='typography') {
      for(const f of ['primaryFont','secondaryFont']) if(value[f]&&(typeof value[f]!=='object'||(value[f].family!=null&&typeof value[f].family!=='string')||(value[f].linkHref!=null&&typeof value[f].linkHref!=='string'))) return false;
      if(value.levels&&(typeof value.levels!=='object'||Array.isArray(value.levels))) return false;
      for(const [role,s] of Object.entries(value.levels||{})) {if(!typeDefaults[role])continue;if(!s||typeof s!=='object'||(s.size!=null&&!sizes[s.size])||!validNumber(s.lineHeightPct,50,300)||!validNumber(s.weight,100,900)||!validNumber(s.letterSpacing,-5,20))return false;for(const k of ['color','darkColor'])if(s[k]!=null&&!hex(s[k],null))return false;}
    }
    if(['colors','bg-colors','status-colors','neutral-colors'].includes(key)) for(const theme of ['light','dark']) {
      const set=value[theme];if(set==null)continue;if(typeof set!=='object'||Array.isArray(set))return false;
      if(key==='colors') {if(set.primary&&(!set.primary.hex||!hex(set.primary.hex,null))) return false;}
      else for(const [k,v] of Object.entries(set)) if(k!=='auto'&&v!=null&&!hex(v,null))return false;
    }
    const enums={spacing:['system',['2px','4px','8px','adaptive']],radius:['philosophy',Object.keys(radius)],shadow:['philosophy',['flat','subtle','balanced','soft','expressive']],'grid-layout':['system',['custom','columns','rows','columns-rows','baseline']],units:['unit',['px','rem']]};
    if(enums[key]) {const [field,choices]=enums[key];if(value[field]!=null&&!choices.includes(value[field]))return false;}
    if(key==='grid-layout'&&(!validNumber(value.columns,1,24)||!validNumber(value.gutter,0,64)||(value.columns!=null&&!Number.isInteger(Number(value.columns)))||(value.gutter!=null&&!Number.isInteger(Number(value.gutter)))))return false;
    if(key==='border'&&(!validNumber(value.width,0,8)||!validNumber(value.opacity,0,100))) return false;
    return true;
  }
  function resolve(saved={}, theme='light', profile=null) {
    saved=record(saved); theme=theme==='dark'?'dark':'light';
    const unit=record(saved.units).unit==='rem'?'rem':'px', tokens={...primitives[theme]}, dim=n=>dimension(n,unit);
    for(const [key,value] of Object.entries(tokens)) if(typeof value==='string'&&unit==='rem') tokens[key]=value.replace(/(-?\d+(?:\.\d+)?)px\b/g,(_,n)=>dim(Number(n)));
    const typography=record(saved.typography), levels=record(typography.levels);
    for (const [role,defaults] of Object.entries(typeDefaults)) {
      const s={...defaults,...record(levels[role])}, prefix='--type-'+role+'-';
      tokens[prefix+'family']=s.family==='secondary'?'var(--font-body)':'var(--font-display)';
      tokens[prefix+'size']=dim(sizes[s.size]||sizes[defaults.size]); tokens[prefix+'line-height']=String(finite(s.lineHeightPct,Number(defaults.lineHeightPct),50,300)/100);
      tokens[prefix+'weight']=String(finite(s.weight,Number(defaults.weight),100,900)); tokens[prefix+'style']=s.italic===true?'italic':'normal';
      tokens[prefix+'tracking']=dim(finite(s.letterSpacing,0,-5,20)); tokens[prefix+'color']=hex(theme==='dark'?s.darkColor:s.color,theme==='dark'?defaults.darkColor:defaults.color);
    }
    for(const [k,prop] of [['primaryFont','--font-display'],['secondaryFont','--font-body']]) { const f=record(typography[k]); if(typeof f.family==='string'&&f.family.length<=100&&!/[;{}<>]/.test(f.family)) tokens[prop]=JSON.stringify(f.family)+', ui-sans-serif, system-ui, sans-serif'; }
    tokens['--text-hi']='var(--type-h6-color)'; tokens['--text-mid']='var(--type-body-color)'; tokens['--text-dim']='var(--type-caption-color)';
    const colors=record(saved.colors), color=record(colors[theme]||(theme==='dark'?colors.light:null)), brand=hex(record(color.primary).hex,'#FF031A');
    tokens['--red-500']=brand; tokens['--red-400']=mix(brand,255,.25); tokens['--red-600']=mix(brand,0,.18);
    const rgb=brand.slice(1).match(/../g).map(c=>parseInt(c,16)).join(','); tokens['--red-tint']='rgba('+rgb+',0.08)';tokens['--red-glow']='rgba('+rgb+',0.35)';
    for (const [state,key] of [['default','--red-500'],['hover','--red-400'],['active','--red-600']]) tokens['--button-primary-text-'+state]=foreground(tokens[key]);
    tokens['--on-brand-text']=tokens['--button-primary-text-default'];
    const colorGroups = { 'bg-colors':{primary:'--graphite-950',secondary:'--graphite-900',tertiary:'--graphite-850'}, 'neutral-colors':{c800:'--graphite-800',c700:'--graphite-700',c600:'--graphite-600',c500:'--graphite-500',border:'--control-border'}, 'status-colors':{success:'--green-500',warning:'--amber-500',danger:'--danger-500',info:'--blue-500'} };
    for(const [key,props] of Object.entries(colorGroups)) { const set=record(record(saved[key])[theme]); for(const [name,prop] of Object.entries(props)) { const h=hex(set[name],null); if(h) tokens[prop]=h; } }
    if(tokens['--danger-500']) { tokens['--danger-400']=mix(tokens['--danger-500'],255,.25);tokens['--danger-600']=mix(tokens['--danger-500'],0,.18); }
    const space=record(saved.spacing||contextualDefault('spacing',profile)), step={'2px':2,'4px':4,'8px':8,adaptive:4}[space.system]||4;
    for(let n=1;n<=256;n++) {const quantum=space.system==='adaptive'?(n<=6?2:n>=32?8:4):step;tokens['--space-'+n]=dim(n<quantum?n:Math.round(n/quantum)*quantum);}
    for(const n of [1,2,3,4]) tokens['--border-width-'+n]=dim(n);
    for(const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 22, 24, 26, 28, 32, 34, 35, 36, 38, 40, 42, 44, 48, 49, 56, 60, 64, 65, 72, 76, 80, 84, 90, 91, 96, 100, 104, 105, 110, 120, 122, 130, 140, 141, 150, 160, 170, 179, 180, 190, 200, 208, 220, 222, 228, 240, 252, 260, 264, 268, 280, 300, 320, 340, 360, 370, 400, 420, 440, 465, 480, 483, 490, 520, 560, 600, 630, 640, 670, 680, 800, 820, 1352]) tokens['--dimension-'+n]=dim(n);
    // Numeric primitives keep their identity; only semantic aliases change.
    for(const n of [2,4,6,8,12,16,20,24,32,40]) tokens['--radius-'+n]=dim(n);
    const r=radius[record(saved.radius||contextualDefault('radius',profile)).philosophy]||radius.balanced;
    for(const [i,key] of ['sm','md','lg'].entries()) tokens['--radius-'+key]=dim(r[i]);
    const shadowFactor={flat:0,subtle:.5,balanced:1,soft:1.4,expressive:2}[record(saved.shadow).philosophy]??1;
    for(const [name,y,blur,opacity] of [['xs',1,2,.06],['sm',1,4,.08],['md',4,8,.10],['lg',8,16,.12],['xl',12,24,.14],['2xl',16,32,.16]]) tokens['--shadow-'+name]=shadowFactor===0?'none':`0 ${dim(y*shadowFactor)} ${dim(blur*shadowFactor)} rgba(0,0,0,${opacity})`;
    const configuredBorder=record(saved.border);
    // A focus preset styles the focused state, never resting borders or dividers.
    const border=configuredBorder.system==='focus'?{}:configuredBorder, borderHex=hex(theme==='dark'?border.darkColor:border.color,null);
    tokens['--border-width-1']=dim(finite(border.width,1,0,8));tokens['--border-style']=['solid','dashed','dotted','double','none'].includes(border.style)?border.style:'solid';
    // Structural dividers and documentation panels keep their neutral theme colors.
    // A configured control border must not replace the shell's line tokens.
    if(borderHex) { const rgb=borderHex.slice(1).match(/../g).map(c=>parseInt(c,16)).join(',');tokens['--control-border']=`rgba(${rgb},${finite(border.opacity,100,0,100)/100})`; }
    tokens['--border-sides']= ['top','right','bottom','left','start','end','horizontal','vertical'].includes(border.sides)?border.sides:'all';
    tokens['--border-state-focus']=theme==='dark'?'var(--red-400)':'var(--red-500)';
    tokens['--focus-ring-width']=dim(configuredBorder.system==='focus'?finite(configuredBorder.width,2,1,8):2);
    let focus=normalizeFocusState(configuredBorder.system==='focus'?{light:configuredBorder.color,dark:configuredBorder.darkColor,darkAuto:configuredBorder.darkColorAuto}:{});
    for(const [state,value] of Object.entries(record(saved['border-states']))) {
      if(state==='focus') { focus=normalizeFocusState(value);continue; }
      const h=hex(record(value)[theme],null); if(h) tokens['--border-state-'+state]=h;
    }
    const focusHex=hex(focus[theme],null);
    const defaultFocus=hex(focus.light,null)?.toUpperCase()==='#FF031A'&&hex(focus.dark,null)?.toUpperCase()==='#FF4253'&&focus.darkAuto!==false;
    if(focusHex&&!defaultFocus) tokens['--border-state-focus']=focusHex;
    tokens['--color-focus-ring']='var(--border-state-focus)';
    const sizing={...sizingDefaults,...record(saved.sizing)};
    for(const [key,min,max] of [['control',24,96],['target',44,96],['icon',12,64],['content',320,1920],['sidebar',180,400]]) tokens['--size-'+key]=dim(finite(sizing[key],sizingDefaults[key],min,max));
    const icons=record(saved.icons); tokens['--icon-size']=dim(finite(icons.size,sizing.icon,12,64));tokens['--icon-stroke']=String(finite(icons.stroke,1.8,.5,4)); tokens['--icon-cap']=icons.corner==='sharp'?'square':'round';tokens['--icon-join']=icons.corner==='sharp'?'miter':'round';
    const grid=record(saved['grid-layout']||contextualDefault('grid-layout',profile)); tokens['--grid-columns']=String(Math.round(finite(grid.columns,12,1,24)));tokens['--grid-gutter']=dim(finite(grid.gutter,24,0,64));
    return { version:1, unit, theme, tokens, dataFormat:normalizeData(saved['data-format']), gridSystem:['custom','columns','rows','columns-rows'].includes(grid.system)?grid.system:'columns', iconStyle:typeof icons.system==='string'?icons.system:'duotone' };
  }
  function format(value, kind, config, options={}) {
    const c=normalizeData(config), missing=value===null||value===undefined||value==='';
    if(kind==='loading') return 'Loading…'; if(missing) return c.noValue;
    if(['redaction','full','partial'].includes(kind)) { const str=String(value), reveal=kind==='full'||(kind==='redaction'&&c.redaction==='full')?0:Math.min(c.reveal,Math.max(0,str.length-1)); return c.mask.repeat(Math.max(4,str.length-reveal))+(reveal?str.slice(-reveal):''); }
    if(kind==='range') return format(value[0],'date',c)+c.range+format(value[1],'date',c);
    if(['number','currency','unit','large','percent'].includes(kind)) {
      const n=typeof value==='number'?value:Number(value); if(!Number.isFinite(n)) return c.noValue;
      const opts={useGrouping:c.grouping&&c.separator!=='none', maximumFractionDigits:c.decimals, minimumFractionDigits:kind==='currency'?c.decimals:0};
      if(kind==='currency') Object.assign(opts,{style:'currency',currency:/^[A-Z]{3}$/.test(options.currency||'')?options.currency:c.currency,currencyDisplay:c.currencyDisplay});
      if(kind==='large') opts.notation=c.large;
      if(kind==='percent') Object.assign(opts,{style:'percent'});
      let parts=new Intl.NumberFormat(c.locale,opts).formatToParts(n);
      if(c.separator==='comma'||c.separator==='space') parts=parts.map(p=>p.type==='group'?{...p,value:c.separator==='comma'?',':'\u202f'}:p);
      const out=parts.map(p=>p.value).join(''); return kind==='unit'?out+({none:'',space:' ',nbsp:'\u00a0'}[c.unitSpace])+(typeof options.unit==='string'?options.unit:c.unit):out;
    }
    const dateOnly=typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value);
    const date=new Date(value); if(!Number.isFinite(date.getTime())) return c.noValue;
    if(dateOnly&&date.toISOString().slice(0,10)!==value) return c.noValue;
    const dateOpts={timeZone:dateOnly?'UTC':c.zone,year:'numeric',month:'2-digit',day:'2-digit'};
    const iso=()=>{ const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',dateOpts).formatToParts(date).map(p=>[p.type,p.value]));return p.year+'-'+p.month+'-'+p.day; };
    if(kind==='relative'&&c.relative) { const now=options.now==null?Date.now():new Date(options.now).getTime(), delta=(date.getTime()-now)/1000; if(Math.abs(delta)<60) return 'just now'; if(Math.abs(delta)<86400) return new Intl.RelativeTimeFormat(c.locale,{numeric:'always'}).format(Math.trunc(delta/(Math.abs(delta)<3600?60:3600)),Math.abs(delta)<3600?'minute':'hour'); }
    const dateStr=c.date==='iso'?iso():new Intl.DateTimeFormat(c.locale,{...dateOpts,...(c.date==='long'?{month:'long'}:{})}).format(date);
    if(kind==='date'||kind==='relative') return dateStr;
    const timeStr=new Intl.DateTimeFormat(c.locale,{timeZone:c.zone,hour:'2-digit',minute:'2-digit',...(c.seconds?{second:'2-digit'}:{}),hourCycle:c.hourCycle,...(c.showZone?{timeZoneName:'short'}:{})}).format(date);
    if(kind==='time') return timeStr; return dateStr+(c.combined==='T'?'T':' ')+timeStr;
  }
  function prepareCode(text,resolved=resolve()) {
    const comments=[];
    let code=String(text).replace(/\/\*[\s\S]*?\*\//g,s=>{comments.push(s);return '__ADS_COMMENT_'+(comments.length-1)+'__';});
    code=code.replace(/([^{}]+)\{([^{}]*)\}/g,(_,selector,body)=>{
      const role=body.match(/font-size\s*:\s*var\(--type-(\w+)-size\)/)?.[1];
      if(role) {
        const mono=/font-family\s*:\s*var\(--font-mono\)/.test(body);
        body=body.replace(/(?:font-(?:family|size|weight|style)|line-height|letter-spacing)\s*:[^;{}]+;?/g,'');
        body=body.trimEnd()+';';
        body+='font-family:'+(mono?'var(--font-mono)':'var(--type-'+role+'-family)')+';';
        for(const [prop,suffix] of [['font-size','size'],['font-weight','weight'],['font-style','style'],['line-height','line-height'],['letter-spacing','tracking']])body+=prop+':var(--type-'+role+'-'+suffix+');';
        body=body.replace(/(?<![\w-])color\s*:\s*var\(--text-(?:hi|mid|dim)\)/g,'color:var(--type-'+role+'-color)');
      }
      body=body.replace(/(?<![\w-])(padding(?:-[a-z-]+)?|margin(?:-[a-z-]+)?|(?:row-|column-)?gap)\s*:\s*([^;{}]+);?/g,(_,prop,value)=>prop+':'+value.replace(/(\d+)px\b/g,(_,n)=>resolved.tokens['--space-'+n]?'var(--space-'+n+')':dimension(Number(n),resolved.unit))+';');
      body=body.replace(/(?<![\w-])(width|height|min-width|max-width|min-height|max-height)\s*:\s*([^;{}]+);?/g,(_,prop,value)=>prop+':'+value.replace(/(\d+)px\b/g,(_,n)=>resolved.tokens['--dimension-'+n]?'var(--dimension-'+n+')':dimension(Number(n),resolved.unit))+';');
      body=body.replace(/(border(?:-[a-z-]+)?\s*:)\s*([\d.]+)px\s+solid/g,(_,prop,n)=>prop+'var(--border-width-'+(Number(n)<=1.5?'1':Math.min(4,Math.round(Number(n))))+') var(--border-style)');
      return selector+'{'+body+'}';
    });
    return '/* Include theme.css, foundation.css and the shared Foundation runtime. */\n'+code.replace(/__ADS_COMMENT_(\d+)__/g,(_,n)=>comments[Number(n)]);
  }
  return { sizes,typeDefaults,dataDefaults,sizingDefaults,dimension,convert,toPx,contrast,foreground,recommendedProduct,contextualDefault,normalizeFocusState,normalizeData,validRecord,resolve,format,prepareCode };
});
