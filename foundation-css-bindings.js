/* Preserve authored Foundation references during component capture.
   Equality of two resolved values is not evidence that they share a role. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ADSFoundationBindings=api;})(typeof window==='undefined'?globalThis:window,()=>{
  'use strict';
  function split(text){const parts=[];let start=0,depth=0,quote='';for(let i=0;i<text.length;i++){const c=text[i];if(quote){if(c===quote&&text[i-1]!=='\\')quote='';continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c==='('||c==='[')depth++;else if(c===')'||c===']')depth--;else if(c===','&&!depth){parts.push(text.slice(start,i).trim());start=i+1;}}parts.push(text.slice(start).trim());return parts;}
  const compare=(a,b)=>{for(let i=0;i<a.length;i++)if(a[i]!==b[i])return a[i]-b[i];return 0;};
  function specificity(selector){
    let score=[0,0,0],text=selector;
    // Functional selectors use their most specific argument; :where has zero.
    for(let i=0;i<text.length;i++){
      const match=text.slice(i).match(/^:(is|not|has|where)\(/);if(!match)continue;
      let end=i+match[0].length,depth=1;for(;end<text.length&&depth;end++){if(text[end]==='(')depth++;if(text[end]===')')depth--;}
      const args=text.slice(i+match[0].length,end-1);
      if(match[1]!=='where'){const best=split(args).map(specificity).sort(compare).pop()||[0,0,0];score=score.map((n,k)=>n+best[k]);}
      text=text.slice(0,i)+' '+text.slice(end);i--;
    }
    text=text.replace(/\[[^\]]*\]/g,()=>{score[1]++;return ' ';});
    text=text.replace(/#[\w-]+/g,()=>{score[0]++;return ' ';});
    text=text.replace(/\.[\w-]+/g,()=>{score[1]++;return ' ';});
    text=text.replace(/::[\w-]+/g,()=>{score[2]++;return ' ';});
    text=text.replace(/:[\w-]+(?:\([^)]*\))?/g,()=>{score[1]++;return ' ';});
    score[2]+=(text.match(/(?:^|[\s>+~])([a-zA-Z][\w-]*)/g)||[]).length;return score;
  }
  function target(selector){
    let start=0,depth=0,quote='';for(let i=0;i<selector.length;i++){const c=selector[i];if(quote){if(c===quote&&selector[i-1]!=='\\')quote='';continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c==='('||c==='[')depth++;else if(c===')'||c===']')depth--;else if(!depth&&/[\s>+~]/.test(c))start=i+1;}
    const match=selector.slice(start).match(/^([.#]?)([a-zA-Z_][\w-]*)(?![\w-]|\\)/);return match?{kind:match[1],name:match[2]}:null;
  }
  function possible(element,part){return !part||part.kind==='.'?(!part||!element.classList||element.classList.contains(part.name)):part.kind==='#'?element.id===part.name:!element.localName||element.localName===part.name.toLowerCase();}
  function words(value){return value.match(/(?:var|calc|min|max|clamp)\((?:[^()]|\([^()]*\))*\)|[^\s]+/g)||[];}
  function declaration(style,property){
    const direct=style.getPropertyValue(property);if(direct)return direct;
    const get=name=>style.getPropertyValue(name)||[...(style.cssText||'').matchAll(new RegExp('(?:^|;)\\s*'+name+'\\s*:\\s*([^;]+)','g'))].at(-1)?.[1].replace(/\s*!important$/,'').trim()||'';
    const side=property.match(/^(padding|margin)-(top|right|bottom|left)$/),border=property.match(/^border-(top|right|bottom|left)-(width|style|color)$/),corner=property.match(/^border-(top-left|top-right|bottom-right|bottom-left)-radius$/);
    const pick=(values,index)=>{const n=values.length;if(n===1)return values[0];if(n===2)return values[index%2];if(n===3)return values[index===3?1:index];return values[index];};
    if(property==='background-color'){const value=get('background');if(/^(?:var\(--[\w-]+(?:,[^;]+)?\)|#[\da-f]+|rgba?\([^;]+\)|transparent|currentColor)$/i.test(value))return value;}
    if(side)return pick(words(get(side[1])),['top','right','bottom','left'].indexOf(side[2]))||null;
    if(property==='row-gap'||property==='column-gap')return pick(words(get('gap')),property==='row-gap'?0:1)||null;
    if(corner){const value=get('border-radius');if(value.includes('/'))return null;return pick(words(value),['top-left','top-right','bottom-right','bottom-left'].indexOf(corner[1]))||null;}
    if(border){const index=['top','right','bottom','left'].indexOf(border[1]),axis=border[2];const long=pick(words(get('border-'+axis)),index);if(long)return long;
      const value=get('border-'+border[1])||get('border'),parts=words(value);
      if(axis==='width')return parts.find(p=>/^(?:[\d.]+(?:px|rem)|thin|medium|thick)$/.test(p)||/^var\(--border-width-/.test(p))||null;
      if(axis==='style')return parts.find(p=>/^(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/.test(p)||/^var\(--border-style/.test(p))||null;
      return parts.find(p=>/^(?:#|rgba?\(|hsla?\(|currentColor|transparent|var\(--(?:line|control-border|border-state|color-|red-|danger-|green-|blue-|amber-))/.test(p))||null;
    }
    return null;
  }
  function create(document,tokens){
    const rules=[],declarations=new WeakMap();let cache=new WeakMap(),values=new WeakMap(),order=0;
    function collect(list){for(const rule of list){
      if(rule.selectorText&&rule.style){const selectors=split(rule.selectorText).filter(s=>!s.includes('::')).map(selector=>({selector,score:specificity(selector),target:target(selector)}));rules.push({selectors,style:rule.style,order:order++});}
      else if(rule.cssRules){if(rule.type===4&&!document.defaultView.matchMedia(rule.conditionText).matches)continue;if(rule.type===12&&!document.defaultView.CSS.supports(rule.conditionText))continue;if([4,12].includes(rule.type))collect(rule.cssRules);}
    }}
    for(const sheet of document.styleSheets)try{collect(sheet.cssRules);}catch{/* Cross-origin font stylesheets do not author component styles. */}
    function matches(element){if(cache.has(element))return cache.get(element);const found=[];
      for(const rule of rules){let best=null;for(const {selector,score,target}of rule.selectors)try{if(possible(element,target)&&element.matches(selector)&&(!best||compare(score,best)>0))best=score;}catch{}
        if(best)found.push({style:rule.style,score:[0,...best],order:rule.order});}
      found.push({style:element.style,score:[1,0,0,0],order:order+1});cache.set(element,found);return found;
    }
    const inherited=/^(?:color|font-(?:family|size|weight|style)|line-height|letter-spacing|text-align|fill|stroke(?:-width|-linecap|-linejoin|-dasharray)?|--)/;
    function raw(element,property){if(!element)return null;
      let known=values.get(element);if(!known){known=new Map();values.set(element,known);}if(known.has(property))return known.get(property);
      let best=null;
      for(const candidate of matches(element)){let value;
        if(candidate.order===order+1)value=declaration(candidate.style,property);
        else{let stored=declarations.get(candidate.style);if(!stored){stored=new Map();declarations.set(candidate.style,stored);}if(!stored.has(property))stored.set(property,declaration(candidate.style,property));value=stored.get(property);}
        if(!value)continue;const rank=[candidate.style.getPropertyPriority(property)==='important'?1:0,...candidate.score,candidate.order];if(!best||compare(rank,best.rank)>0)best={value,rank};}
      const result=best&&best.value!=='inherit'&&best.value!=='unset'?{value:best.value,element}:inherited.test(property)||best?.value==='inherit'?raw(element.parentElement,property):null;
      known.set(property,result);return result;
    }
    function expand(value,element,seen=new Set()){
      let output='';for(let i=0;i<value.length;){const start=value.indexOf('var(',i);if(start<0){output+=value.slice(i);break;}output+=value.slice(i,start);let end=start+4,depth=1;for(;end<value.length&&depth;end++){if(value[end]==='(')depth++;if(value[end]===')')depth--;}
        const [name,...fallback]=split(value.slice(start+4,end-1));let replacement;
        if(Object.hasOwn(tokens,name))replacement='var('+name+')';
        else if(!seen.has(name)){const source=raw(element,name);if(source)replacement=expand(source.value,source.element,new Set([...seen,name]));}
        if(!replacement&&fallback.length)replacement=expand(fallback.join(','),element,seen);
        if(!replacement)return null;output+=replacement;i=end;
      }return output;
    }
    return {reset(){cache=new WeakMap();values=new WeakMap();},read(element,property){const source=raw(element,property);if(!source||!source.value.includes('var('))return null;const value=expand(source.value,source.element);return value?.includes('var(')?value:null;}};
  }
  return {split,specificity,declaration,target,create};
});
