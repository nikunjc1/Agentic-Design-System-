/* Independent typed-token consumer. Deliberately does not import the generator. */
'use strict';
const fs=require('node:fs');
function importTokens(document,mode='dark'){
  if(!['dark','light'].includes(mode))throw new RangeError('Unsupported mode');
  const flat=new Map(),result={};
  for(const [group,tokens] of Object.entries(document))if(!group.startsWith('$'))for(const [name,token]of Object.entries(tokens))flat.set(group+'.'+name,{name,token});
  const finite=value=>typeof value==='number'&&Number.isFinite(value);
  function dimension(v,type='dimension'){
    if(!v||!finite(v.value)||!(type==='duration'?['ms','s']:['px','rem']).includes(v.unit))throw new TypeError('Invalid '+type);
    return v.value+v.unit;
  }
  function color(v){
    if(!v||v.colorSpace!=='srgb'||!Array.isArray(v.components)||v.components.length!==3||v.components.some(c=>!finite(c)||c<0||c>1)||!finite(v.alpha)||v.alpha<0||v.alpha>1)throw new TypeError('Invalid sRGB color');
    const rgb=v.components.map(c=>Math.round(c*255));return 'rgba('+rgb.join(',')+','+v.alpha+')';
  }
  function literal(type,v,token){
    switch(type){
      case 'color':return color(v);
      case 'dimension':return dimension(v);
      case 'duration':return dimension(v,'duration');
      case 'number':if(!finite(v))throw new TypeError('Invalid number');return String(v)+(token.$extensions?.['com.agentic-design-system.relative-unit']||'');
      case 'fontFamily':if(!Array.isArray(v)||!v.length||v.some(f=>typeof f!=='string'||!f))throw new TypeError('Invalid font family');return v.map(f=>/\s/.test(f)?JSON.stringify(f):f).join(', ');
      case 'cubicBezier':if(!Array.isArray(v)||v.length!==4||v.some(n=>!finite(n))||v[0]<0||v[0]>1||v[2]<0||v[2]>1)throw new TypeError('Invalid cubicBezier');return 'cubic-bezier('+v.join(',')+')';
      case 'shadow':{
        const parts=Array.isArray(v)?v:[v];
        return parts.map(s=>{if(!s||s.blur?.value<0||s.inset!=null&&typeof s.inset!=='boolean')throw new TypeError('Invalid shadow');return (s.inset?'inset ':'')+['offsetX','offsetY','blur','spread'].map(k=>dimension(s[k])).join(' ')+' '+color(s.color);}).join(', ');
      }
      default:throw new TypeError('Unsupported token type: '+type);
    }
  }
  function resolve(key,seen=new Set()){
    if(seen.has(key))throw new RangeError('Cyclic token alias');
    const item=flat.get(key);if(!item)throw new RangeError('Unknown token alias '+key);
    const {token}=item,v=token.$extensions?.['com.agentic-design-system.mode']?.[mode]??token.$value;
    if(typeof v==='string'&&/^\{[^{}]+\}$/.test(v)){
      const target=v.slice(1,-1);if(flat.get(target)?.token.$type!==token.$type)throw new TypeError('Alias type mismatch');
      return resolve(target,new Set([...seen,key]));
    }
    return literal(token.$type,v,token);
  }
  for(const [key,{name}]of flat)result['--'+name]=resolve(key);
  for(const [name,values]of Object.entries(document.$extensions?.['com.agentic-design-system.css-only']||{}))result['--'+name]=values[mode];
  return result;
}
module.exports={importTokens};
if(require.main===module){const document=JSON.parse(fs.readFileSync(process.argv[2]||'design-tokens.json','utf8'));const modes={light:importTokens(document,'light'),dark:importTokens(document,'dark')};console.log(JSON.stringify({status:'imported',light:Object.keys(modes.light).length,dark:Object.keys(modes.dark).length}));}
