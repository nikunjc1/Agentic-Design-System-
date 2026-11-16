/* One compiler feeds the visual stage, portable HTML and implementation inspection. */
(() => {
  'use strict';
  const M=window.ADSComponentContract;
  const esc=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  function mount(root,contract,selection){
    const active=root.contains(document.activeElement)?document.activeElement:null;
    const focused=active?.dataset.adsPart,caret=active&&typeof active.selectionStart==='number'?[active.selectionStart,active.selectionEnd]:null;
    const compiled=M.compile(contract,selection),svgTags=new Set(['svg','path','circle','rect','line','polyline','polygon','g','ellipse']);
    function create(n){
      const el=svgTags.has(n.tag)?document.createElementNS('http://www.w3.org/2000/svg',n.tag):document.createElement(n.tag);
      el.dataset.adsPart=n.id;el.dataset.adsKind=n.kind;
      for(const [key,value]of Object.entries(n.styles))key.startsWith('--')?el.style.setProperty(key,value):el.style[key]=value;
      for(const [key,value]of Object.entries(n.attributes))el.setAttribute(key,value);
      if(n.text&&n.tag!=='input')el.append(document.createTextNode(n.text));
      for(const child of n.children)el.append(create(child));
      if(['textarea','select'].includes(n.tag)&&'value'in n.attributes)el.value=n.attributes.value;
      for(const behavior of contract.behaviors||[])if(behavior.target===n.id)el.addEventListener(behavior.event,event=>{
        event.stopPropagation();
        let value;
        if(behavior.value==='$toggle')value=!compiled.values[behavior.property];
        else if(behavior.value==='$value'){
          const raw=event.target.type==='checkbox'?event.target.checked:event.target.value;
          const property=contract.properties.find(p=>p.id===behavior.property);
          // The DOM only ever hands back a string (or boolean for checkboxes);
          // a declared number property must be coerced back or every equals/
          // variant condition on it silently stops matching after one edit.
          if(property?.type==='number'){const parsed=Number(raw);value=Number.isFinite(parsed)?parsed:compiled.values[behavior.property];}
          else value=raw;
        }
        else value=behavior.value;
        const next={...compiled.values,[behavior.property]:value};mount(root,contract,next);root.dispatchEvent(new CustomEvent('ads:component-interaction',{bubbles:true,detail:next}));
      });
      return el;
    }
    root.replaceChildren();for(const [key,value]of Object.entries(contract.tokens||{}))root.style.setProperty(key,String(value));
    root.dataset.adsComponent=contract.id;root.dataset.adsRevision=String(contract.revision);root.dataset.adsValues=JSON.stringify(compiled.values);
    root.dir=contract.context?.direction==='rtl'?'rtl':'ltr';
    if(compiled.tree)root.append(create(compiled.tree));if(focused){const next=[...root.querySelectorAll('[data-ads-part]')].find(n=>n.dataset.adsPart===focused&&!n.disabled);next?.focus({preventScroll:true});if(caret&&next?.setSelectionRange)try{next.setSelectionRange(...caret);}catch{}}return compiled;
  }
  function code(contract){
    M.assert(contract);
    const json=JSON.stringify(contract).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
    const compiler=M.compile.toString();const renderer=mount.toString(),compiled=M.compile(contract);
    const cssName=name=>name.startsWith('--')?name:name.replace(/[A-Z]/g,char=>'-'+char.toLowerCase());
    const style=styles=>Object.entries(styles).map(([key,value])=>cssName(key)+':'+value).join(';');
    function markup(n){if(!n)return '';const attrs={...n.attributes,'data-ads-part':n.id,'data-ads-kind':n.kind,style:style(n.styles)};const open='<'+n.tag+Object.entries(attrs).map(([key,value])=>' '+key+'="'+esc(value)+'"').join('')+'>';if(['input','img'].includes(n.tag))return open;return open+esc(n.text)+(n.children||[]).map(markup).join('')+'</'+n.tag+'>';}
    return '<!doctype html>\n<html lang="en" dir="'+(contract.context?.direction==='rtl'?'rtl':'ltr')+'" style="'+esc(style(contract.tokens))+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(contract.name)+'</title><style>body{font-family:var(--type-body-family,Inter,system-ui,sans-serif);font-size:var(--type-body-size,16px);font-weight:var(--type-body-weight,400);line-height:var(--type-body-line-height,1.5);padding:24px;background:var(--color-surface-page,#fff);color:var(--color-text-primary,#111)}*{box-sizing:border-box}input[data-ads-part]::placeholder{color:var(--ads-placeholder-color);opacity:var(--ads-placeholder-opacity,1)}@keyframes ads-contract-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style></head><body>\n<div id="component" data-ads-component="'+esc(contract.id)+'" data-ads-revision="'+contract.revision+'" data-ads-values="'+esc(JSON.stringify(compiled.values))+'" style="'+esc(style(contract.tokens))+'">'+markup(compiled.tree)+'</div>\n<script type="application/json" id="ads-component-contract">'+json+'</script>\n<script>const M={compile:'+compiler+'};const mount='+renderer+';const contract=JSON.parse(document.getElementById("ads-component-contract").textContent);mount(document.getElementById("component"),contract);<\/script>\n</body></html>';
  }
  function inspect(root,contract){
    const compiled=M.compile(contract),findings=[];
    const values=JSON.parse(root.dataset.adsValues||'{}');
    for(const [property,expected]of Object.entries(compiled.values))if(JSON.stringify(values[property])!==JSON.stringify(expected))findings.push({path:'selection/'+property,expected,actual:values[property]??null});
    const sandbox=document.createElement('div');sandbox.style.cssText='position:fixed;left:-10000px;top:0;';document.body.append(sandbox);mount(sandbox,contract);
    const expectedNodes=[...sandbox.querySelectorAll('[data-ads-part]')],actualNodes=[...root.querySelectorAll('[data-ads-part]')];
    for(const expected of expectedNodes){const node=actualNodes.find(n=>n.dataset.adsPart===expected.dataset.adsPart),part=expected.dataset.adsPart;
      if(!node){findings.push({path:'anatomy/'+part,expected:'present',actual:'missing'});continue;}
      if(node.tagName!==expected.tagName)findings.push({path:'anatomy/'+part+'/tag',expected:expected.tagName,actual:node.tagName});
      const text=n=>[...n.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('');if(text(node)!==text(expected))findings.push({path:'anatomy/'+part+'/text',expected:text(expected),actual:text(node)});
      if(['INPUT','TEXTAREA','SELECT'].includes(node.tagName)&&node.value!==expected.value)findings.push({path:'anatomy/'+part+'/value',expected:expected.value,actual:node.value});
      if(node.tagName==='INPUT'&&node.checked!==expected.checked)findings.push({path:'anatomy/'+part+'/checked',expected:expected.checked,actual:node.checked});
      for(const name of expected.getAttributeNames().filter(name=>name!=='style'&&!name.startsWith('data-')))if(node.getAttribute(name)!==expected.getAttribute(name))findings.push({path:'anatomy/'+part+'/'+name,expected:expected.getAttribute(name),actual:node.getAttribute(name)});
      for(const style of expected.style){if(style.startsWith('--'))continue;const a=getComputedStyle(node).getPropertyValue(style),e=getComputedStyle(expected).getPropertyValue(style);if(a!==e)findings.push({path:'anatomy/'+part+'/styles/'+style,expected:e,actual:a});}
      const parent=n=>n.parentElement.closest('[data-ads-part]')?.dataset.adsPart||null;if(parent(node)!==parent(expected))findings.push({path:'anatomy/'+part+'/parent',expected:parent(expected),actual:parent(node)});
      const order=n=>[...n.children].filter(child=>child.dataset.adsPart).map(child=>child.dataset.adsPart);if(JSON.stringify(order(node))!==JSON.stringify(order(expected)))findings.push({path:'anatomy/'+part+'/order',expected:order(expected),actual:order(node)});
    }
    for(const actual of actualNodes)if(!expectedNodes.some(n=>n.dataset.adsPart===actual.dataset.adsPart))findings.push({path:'anatomy/'+actual.dataset.adsPart,expected:'absent',actual:'extra part'});
    sandbox.remove();return {schemaVersion:1,componentId:contract.id,revision:contract.revision,kind:'rendered-dom',matched:findings.length===0,findings};
  }
  function capture(options){
    if(window.ADSWorkbench?.active&&!options?.library)return window.ADSWorkbench.capture();
    const heading=document.querySelector('h1')?.cloneNode(true);heading?.querySelectorAll('.component-status').forEach(n=>n.remove());const name=heading?.textContent.trim()||'Component';
    const c=M.blank(name),foundation=window.ADSFoundation.get();c.id=M.id(location.pathname.split('/').pop().replace('.html',''));c.source={page:location.pathname.split('/').pop(),kind:'library-snapshot'};c.context={theme:foundation.theme,unit:foundation.unit,direction:document.documentElement.dir||'ltr'};c.properties=[];c.selection={};c.tokens={...foundation.tokens};
    const panel=document.querySelector('[data-role="copy-prompt-action"]')?.closest('section');
    if(!panel)throw new Error('Open a component detail page to capture its configuration.');
    if(document.body.dataset.buttonType&&panel.querySelector('[data-role="button-label"]'))return captureButton(c,panel);
    const controls=[...panel.querySelectorAll('input[data-role],select[data-role],textarea[data-role]'),...panel.querySelectorAll('.multiselect')];
    for(const [index,control]of controls.entries()){
      const label=control.closest('.type-control')?.querySelector(':scope > span')?.cloneNode(true);label?.querySelectorAll('.info-tip').forEach(n=>n.remove());
      const name=label?.textContent.trim()||control.getAttribute('aria-label')||control.dataset.role;if(!name||['file','hidden','button','submit'].includes(control.type))continue;
      const propertyId='p-'+M.id(control.dataset.role||name)+'-'+index;let p={id:propertyId,name,type:'text',default:control.value?.trim()||control.defaultValue||''};
      if(control.classList.contains('multiselect')){const options=[...control.querySelectorAll('input[type=checkbox]')];p={...p,type:'options',multiple:true,options:options.map(n=>n.value),default:options.filter(n=>n.checked).map(n=>n.value)};if(!p.default.length)p.default=[p.options[0]];if(!p.options.length)continue;}
      else if(control.tagName==='SELECT')p={...p,type:'options',options:[...control.options].map(o=>o.value),default:control.value};
      else if(control.type==='checkbox')p={...p,type:'boolean',default:control.checked};
      else if(['number','range'].includes(control.type)){p={...p,type:'number',default:Number(control.value||control.defaultValue)||0};if(control.min!=='')p.min=Number(control.min);if(control.max!=='')p.max=Number(control.max);}
      c.properties.push(p);c.selection[p.id]=p.default;
    }
    const matrix=document.querySelector('main [data-role$="matrix-container"],main [data-role$="preview-mount"],main [data-role$="preview-container"]');
    let element=matrix?.querySelector('.button-matrix-cell > :first-child')||matrix?.firstElementChild;
    if(!element){const section=[...document.querySelectorAll('main > section')].find(s=>/Live Preview/i.test(s.querySelector('h2')?.textContent||''));element=section?.querySelector('[data-role],.guide-dodont-demo,.button-matrix-cell')?.firstElementChild;}
    if(!element)throw new Error('The component preview is not ready. Wait for it to render, then try again.');
    const styleNames=['display','position','flexDirection','alignItems','justifyContent','flexWrap','gap','paddingTop','paddingRight','paddingBottom','paddingLeft','width','height','minWidth','maxWidth','minHeight','maxHeight','boxSizing','overflow','backgroundColor','color','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderStyle','borderColor','borderRadius','boxShadow','fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','textAlign','whiteSpace','opacity','outline','textDecoration','cursor','fill','stroke','strokeWidth'];
    let sequence=0;
    function node(el,path='root'){
      if(sequence>=400)return null;const computed=getComputedStyle(el);if(computed.display==='none'||['SCRIPT','STYLE'].includes(el.tagName))return null;
      sequence++;const tag=el.tagName.toLowerCase(),n={id:path,name:el.getAttribute('aria-label')||el.dataset.role||tag,kind:tag==='svg'?'icon':['span','p','strong','small','label'].includes(tag)?'text':'container',tag,styles:{},attributes:{},children:[]};
      for(const key of styleNames){const value=computed[key],inline=el.style[key];if(value)n.styles[key]=inline?.includes('var(')&&[...inline.matchAll(/var\(\s*(--[\w-]+)/g)].every(match=>match[1] in c.tokens)?inline:value;}
      for(const key of el.getAttributeNames()){const value=el.getAttribute(key);if(/^(aria-[\w-]+|role|title|type|value|placeholder|disabled|checked|tabindex|href|src|alt|viewBox|d|cx|cy|r|x|y|x1|x2|y1|y2|width|height|rx|ry|points|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|xmlns|max|min|step|rows|colspan|rowspan)$/.test(key))n.attributes[key]=value;}
      if('href'in n.attributes&&!/^(?:https?:|#|[a-zA-Z0-9_.-]+(?:\/|$))/.test(n.attributes.href))n.attributes.href='#';
      if(tag==='svg'&&el.getAttribute('viewBox'))n.attributes.viewBox=el.getAttribute('viewBox');
      n.text=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
      const property=c.properties.find(p=>p.type==='text'&&p.default&&p.default===n.text);if(property)n.bind=property.id;
      for(const attribute of ['value','placeholder','aria-label','title','alt']){const property=c.properties.find(p=>p.type==='text'&&p.default&&p.default===n.attributes[attribute]);if(property)(n.attributeBindings||={})[attribute]=property.id;}
      n.children=[...el.children].map((child,index)=>node(child,path+'-'+index)).filter(Boolean);return n;
    }
    c.anatomy=node(element);c.anatomy.id='root';
    const tables=[...(matrix?.querySelectorAll('.button-matrix')||[])];
    if(tables.length){
      const configurations=tables.map((table,index)=>table.closest('.button-matrix-combo')?.querySelector('.button-matrix-combo-label')?.textContent.trim()||'Configuration '+(index+1));
      const typeOptions=[...tables[0].querySelectorAll(':scope > thead > tr > th')].slice(1).map(n=>n.textContent.trim()),stateOptions=[...tables[0].querySelectorAll(':scope > tbody > tr')].map(n=>M.id(n.querySelector(':scope > th')?.textContent.trim()||'rest'));
      if(typeOptions.length&&stateOptions.length&&typeOptions.length*stateOptions.length*tables.length<=256){
        for(const p of [{id:'appearance',name:'Appearance',type:'options',options:typeOptions,default:typeOptions[0]},{id:'state',name:'State',type:'options',options:stateOptions,default:stateOptions[0]},...(tables.length>1?[{id:'configuration',name:'Preview configuration',type:'options',options:configurations,default:configurations[0]}]:[])]){c.properties.push(p);c.selection[p.id]=p.default;}
        const variants=[];function union(base,current){for(const child of current.children||[]){const existing=base.children.find(n=>n.id===child.id);if(existing)union(existing,child);else base.children.push(M.clone(child));}}
        for(const [ti,table]of tables.entries())for(const [ri,row]of [...table.querySelectorAll(':scope > tbody > tr')].entries())for(const [ci,cell]of [...row.querySelectorAll(':scope > td')].entries()){
          if(!cell.firstElementChild)continue;sequence=0;const captured=node(cell.firstElementChild);union(c.anatomy,captured);variants.push({id:'variant-'+ti+'-'+ri+'-'+ci,name:typeOptions[ci]+' / '+stateOptions[ri],when:{appearance:typeOptions[ci],state:stateOptions[ri],...(tables.length>1?{configuration:configurations[ti]}:{})},captured});
        }
        const all=[];(function collect(n){all.push(n);for(const child of n.children||[])collect(child);})(c.anatomy);
        c.variants=variants.map(v=>{const overrides=Object.fromEntries(all.map(n=>[n.id,{visible:false}]));(function visit(n){const base=all.find(part=>part.id===n.id),attributes=Object.fromEntries(Object.entries(n.attributes).filter(([key,value])=>base.attributes?.[key]!==value)),styles=Object.fromEntries(Object.entries(n.styles).filter(([key,value])=>base.styles?.[key]!==value));for(const key of Object.keys(base.attributes||{}))if(!(key in n.attributes))attributes[key]=null;overrides[n.id]={visible:true,...(n.tag!==base.tag?{tag:n.tag}:{}),styles,attributes,...(!n.bind&&n.text!==base.text?{text:n.text}:{})};for(const child of n.children||[])visit(child);})(v.captured);return {id:v.id,name:v.name,when:v.when,overrides};});
      }
    }
    c.accessibility=[...document.querySelectorAll('.guide-view-panel[data-view-panel=human] .guide-list li')].map(n=>n.textContent.trim()).filter(t=>/keyboard|accessible|aria-|focus|screen reader/i.test(t)).slice(0,12);
    c.source.notes='Captured rendered structure, configurations and available state/type variants. Property changes beyond the captured configurations require authored bindings or variant rules in the editor.';
    M.assert(c);return c;
  }
  function captureButton(c,panel){
    const selected=role=>[...panel.querySelectorAll('[data-role="'+role+'"] .multiselect-options input:checked')].map(n=>n.value);
    const sizes=selected('size-mount'),contents=selected('content-mount'),radii=selected('radius-mount');
    const p=(id,name,type,value,options)=>({id,name,type,default:value,...(options?{options}:{})});
    c.properties=[p('label','Label','text',panel.querySelector('[data-role="button-label"]').value||'Save'),p('accessibleLabel','Accessible label','text',panel.querySelector('[data-role="accessible-label"]').value||''),p('appearance','Appearance','options',document.body.dataset.buttonType,['primary','secondary','tertiary','ghost','neutral','link','approve','destructive']),p('state','State','options','rest',['rest','hover','pressed','focus','disabled','loading']),p('size','Size','options',Number(sizes[0]||40),[24,28,32,36,40,44,48,56]),p('content','Content','options',contents[0]||'text',['text','icon-left','icon-right','icon-both','icon-only']),p('radius','Radius','options',Number(radii[0]||8),[0,2,4,8,12]),p('leadingIcon','Leading icon','swap','icon-plus'),p('trailingIcon','Trailing icon','swap','icon-arrow'),p('iconOnlyIcon','Icon-only graphic','swap','icon-settings'),p('onActivate','On activate','event','activate')];
    c.selection=Object.fromEntries(c.properties.map(p=>[p.id,p.default]));c.source.selectedCombinations={size:sizes,content:contents,radius:radii};c.source.kind='component-definition';
    const paths={ 'icon-plus':['M12 5v14M5 12h14'], 'icon-arrow':['M5 12h14M13 6l6 6-6 6'], 'icon-settings':['M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87L4.2 7.07a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.04A1.7 1.7 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.04 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.04A1.7 1.7 0 0 0 20.91 10H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15z'] };
    c.references={};for(const [id,items]of Object.entries(paths)){const ref=M.blank(id);ref.id=id;ref.properties=[];ref.selection={};ref.anatomy={id:'icon',name:id,kind:'icon',tag:'svg',styles:{width:'16px',height:'16px',flexShrink:'0'},attributes:{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'2','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'},children:items.map((d,index)=>({id:'path-'+index,kind:'shape',tag:'path',attributes:{d},styles:{}}))};if(id==='icon-settings')ref.anatomy.children.unshift({id:'center',kind:'shape',tag:'circle',attributes:{cx:'12',cy:'12',r:'3'},styles:{}});c.references[id]=ref;}
    c.anatomy={id:'root',name:'Button',kind:'container',tag:'button',styles:{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'var(--space-8)',boxSizing:'border-box',paddingTop:'0px',paddingBottom:'0px',paddingLeft:'var(--space-16)',paddingRight:'var(--space-16)',fontFamily:'var(--type-body-family)',fontWeight:'var(--type-body-weight)',fontStyle:'var(--type-body-style)',fontSize:'var(--type-body-size)',lineHeight:'var(--type-body-line-height)',letterSpacing:'var(--type-body-tracking)',border:'var(--border-width-1) var(--border-style) transparent',cursor:'pointer'},styleBindings:{height:'size',borderRadius:'radius'},children:[
      {id:'leading-icon',name:'Leading icon',kind:'instance',bind:'leadingIcon',attributes:{'aria-hidden':'true'},styles:{display:'inline-flex'},visibleWhen:[{property:'content',equals:'text',not:true}]},
      {id:'spinner',name:'Loading spinner',kind:'shape',tag:'span',attributes:{'aria-hidden':'true'},styles:{width:'14px',height:'14px',border:'2px solid currentColor',borderRightColor:'transparent',borderRadius:'50%',animation:'ads-contract-spin .8s linear infinite'},visibleWhen:[{property:'state',equals:'loading'}]},
      {id:'label',name:'Label',kind:'text',tag:'span',bind:'label',styles:{whiteSpace:'nowrap'},visibleWhen:[{property:'content',equals:'icon-only',not:true}]},
      {id:'trailing-icon',name:'Trailing icon',kind:'instance',bind:'trailingIcon',attributes:{'aria-hidden':'true'},styles:{display:'inline-flex'},visibleWhen:[{property:'content',equals:'text',not:true}]},
      {id:'only-icon',name:'Icon-only graphic',kind:'instance',bind:'iconOnlyIcon',attributes:{'aria-hidden':'true'},styles:{display:'inline-flex'},visibleWhen:[{property:'content',equals:'icon-only'}]}
    ]};
    c.variants=[];
    const appearances=c.properties.find(p=>p.id==='appearance').options,states=c.properties.find(p=>p.id==='state').options;
    const table=document.querySelector('.button-matrix');
    for(const [ri,row]of [...table.querySelectorAll('tbody tr')].entries())for(const [ci,cell]of [...row.querySelectorAll('td')].entries()){
      const button=cell.querySelector('button');if(!button||!states[ri]||!appearances[ci])continue;const css=getComputedStyle(button),styles={};
      for(const key of ['backgroundColor','color','borderColor','borderWidth','borderStyle','opacity','outline','textDecoration','cursor'])if(css[key])styles[key]=css[key];
      if(appearances[ci]==='primary'){styles.backgroundColor='var(--button-primary-bg-'+({hover:'hover',pressed:'active'}[states[ri]]||'default')+')';styles.color='var(--button-primary-text-'+({hover:'hover',pressed:'active'}[states[ri]]||'default')+')';}
      c.variants.push({id:appearances[ci]+'-'+states[ri],name:appearances[ci]+' / '+states[ri],when:{appearance:appearances[ci],state:states[ri]},overrides:{root:{styles}}});
    }
    for(const [size,pad,iconSize]of [[24,10,12],[28,12,14],[32,12,14],[36,14,16],[40,16,16],[44,18,18],[48,20,20],[56,24,22]]){const role=[28,32].includes(size)?'caption':'body',styles={paddingLeft:'var(--space-'+pad+')',paddingRight:'var(--space-'+pad+')',gap:'var(--space-'+(size===24?4:size===28?6:8)+')'};for(const [key,suffix]of [['fontFamily','family'],['fontSize','size'],['fontWeight','weight'],['fontStyle','style'],['lineHeight','line-height'],['letterSpacing','tracking']])styles[key]='var(--type-'+role+'-'+suffix+')';const overrides={root:{styles}};for(const id of ['leading-icon','trailing-icon','only-icon','spinner'])overrides[id]={styles:{width:iconSize+'px',height:iconSize+'px'}};c.variants.push({id:'size-'+size,name:size+'px',when:{size},overrides});}
    c.variants.push({id:'content-text',name:'Text only',when:{content:'text'},overrides:{'leading-icon':{visible:false},'trailing-icon':{visible:false}}},{id:'content-left',name:'Leading icon',when:{content:'icon-left'},overrides:{'trailing-icon':{visible:false}}},{id:'content-right',name:'Trailing icon',when:{content:'icon-right'},overrides:{'leading-icon':{visible:false}}},{id:'content-both',name:'Both icons',when:{content:'icon-both'},overrides:{'trailing-icon':{visible:true}}},{id:'content-only',name:'Icon only',when:{content:'icon-only'},overrides:{root:{styles:{paddingLeft:'0px',paddingRight:'0px'},styleBindings:{width:'size'}},'trailing-icon':{visible:false}}},{id:'loading-content',name:'Loading content',when:{state:'loading'},overrides:{'leading-icon':{visible:false},'trailing-icon':{visible:false}}});
    c.variants.find(v=>v.id==='content-only').overrides['leading-icon']={visible:false};c.variants.find(v=>v.id==='loading-content').overrides['only-icon']={visible:false};
    c.accessibility=['Use a native button with Enter/Space activation.','Icon-only content requires an accessibleLabel.','Loading sets aria-busy and disables interaction.','Retain the label during loading, unless content is icon-only.'];
    M.assert(c);return c;
  }
  function download(value,name){const url=URL.createObjectURL(new Blob([typeof value==='string'?value:JSON.stringify(value,null,2)],{type:name.endsWith('.html')?'text/html':'application/json'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  window.ADSContracts={mount,code,inspect,capture,captureLibrary:()=>capture({library:true}),download,open(){try{const c=capture({library:true}),existing=M.read(localStorage,c.id);if(!existing.saved&&!existing.draft)M.draft(localStorage,c);window.ADSNavigation ? window.ADSNavigation.go('component-editor.html?id='+encodeURIComponent(c.id)) : (location.href = 'component-editor.html?id='+encodeURIComponent(c.id));}catch(error){alert(error.message);}}};
  // The "Edit component contract" CTA is intentionally not auto-added to
  // every detail page right now - only showcase it where explicitly asked.
  // window.ADSContracts.open() still works from the console/elsewhere; this
  // just removes the always-on button injection that used to run here.
})();
