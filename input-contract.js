/* Input's authored parts and bindings, measured with the same renderer as its preview. */
(() => {
  'use strict';
  window.ADSInputContract = {capture};
  function capture({snapshot,selected,native}) {
    const M=window.ADSComponentContract,A=window.ADSInput;
    const size=Number(selected.root.querySelector('.input-demo-control').className.match(/--h(\d+)/)[1]);
    const radiusLabel=selected.config.split(' / ').pop();
    const radius=radiusLabel.includes('Pill')?9999:parseFloat(radiusLabel)||0;
    const label=selected.root.querySelector('.input-demo-label-text').textContent;
    const field=selected.root.querySelector('input'),placeholder=field.placeholder,value=field.value;
    const opts=A.options(),helper=native['input-supporting-text']?.trim()||"We'll only use this to send you a receipt.";
    const error=opts.errorText,icons=native['input-icon-placement-mount']||[];
    const host=document.createElement('div');
    host.style.cssText='position:fixed;left:-10000px;top:0;pointer-events:none;width:600px';
    host.setAttribute('aria-hidden','true');document.body.append(host);
    const parts={'.input-demo-field':['root','Input text field'],'.input-demo-label':['label-row','Label'],'.input-demo-label-text':['label','Label text'],'.input-demo-required':['required-mark','Required indicator'],'.input-demo-control':['control','Field'],'.input-demo-input':['input','Value'],'.input-demo-icon:not(.input-demo-icon--trailing)':['leading-icon','Leading icon'],'.input-demo-icon--trailing':['trailing-icon','Trailing icon'],'.input-demo-clear':['clear','Clear value'],'.input-demo-note:not(.is-error)':['helper','Supporting text'],'.input-demo-note.is-error':['error','Error message']};
    const sizes=A.sizes.map(option=>Number(option.value)),radii=A.radii.map(option=>Number(option.value));
    function build(type,state,sampleSize){
      host.innerHTML=A.buildField(type.key,state.key,state.cls,sampleSize,String(radius),label,placeholder,true,true,false,{...opts,required:true,supportingText:helper});
      const root=host.firstElementChild,control=root.querySelector('.input-demo-control');
      const extra=document.createElement('div');
      extra.innerHTML=A.buildField(type.key,'filled',' is-filled',sampleSize,String(radius),label,placeholder,false,false,true,opts);
      control.append(extra.querySelector('.input-demo-clear'));
      // Keep optional anatomy in every variant. Its contract conditions determine visibility.
      const other=document.createElement('p');other.className=state.key==='error'?'input-demo-note':'input-demo-note is-error';other.textContent=state.key==='error'?helper:error;root.append(other);
      root.querySelector('input').id='ads-input-text-field-control';
      root.querySelector('label').htmlFor='ads-input-text-field-control';
      root.querySelector('input').value=value;
      for(const n of root.querySelectorAll('.input-demo-note'))n.id=n.classList.contains('is-error')?'ads-input-error':'ads-input-helper';
      root.querySelector('input').setAttribute('aria-describedby',state.key==='error'?'ads-input-error':native['input-show-supporting']?'ads-input-helper':'');
      for(const [selector,[id,name]]of Object.entries(parts))for(const el of host.querySelectorAll(selector)){el.dataset.contractPart=id;el.dataset.contractName=name;}
      const tree=snapshot(root,'root',0),map=new Map();
      (function walk(n){map.set(n.id,n);for(const child of n.children||[])walk(child);})(tree);
      tree.styles.height='auto';
      const labelRow=map.get('label-row');Object.assign(labelRow.styles,{display:'flex',alignItems:'center',gap:'0px',width:'100%',height:'auto'});
      map.get('required-mark').styles.whiteSpace='pre';
      // Same reverse-color-matching ambiguity as every other field's
      // generic required-asterisk capture (see component-workbench.js's
      // captureFormFieldProperties): snapshot()'s matchToken() can bind the
      // captured red to --color-focus-ring instead of --danger-500 whenever
      // the two currently resolve to the same color. Force the real token.
      map.get('required-mark').styles.color='var(--danger-500)';
      for(const id of ['label','required-mark','helper','error'])Object.assign(map.get(id).styles,{width:'auto',height:'auto'});
      map.get('label').bind='label';map.get('required-mark').visibleWhen=[{property:'required',equals:true}];
      map.get('helper').bind='supportingText';map.get('error').bind='errorText';
      map.get('control').styles.width='100%';
      const input=map.get('input');input.bind='value';input.attributeBindings={placeholder:'placeholder',required:'required'};
      input.styles.width='0px';input.styles.flexGrow='1';input.styles.height='auto';
      // Named semantic parts remain stable when icons/required/helper are switched off.
      for(const [id,property]of [['leading-icon','showLeadingIcon'],['trailing-icon','showTrailingIcon']]){
        const icon=map.get(id);icon.kind='instance';icon.bind=id==='leading-icon'?'leadingIcon':'trailingIcon';icon.visibleWhen=[{property,equals:true}];
      }
      const canClear=!['disabled','readonly'].includes(state.key);
      const clear=map.get('clear');clear.visibleWhen=[{property:'allowClear',equals:true},{property:'value',equals:'',not:true}];
      if(!canClear)clear.visibleWhen.push({property:'state',equals:state.label,not:true});
      // With a value, clearing takes precedence over the static trailing icon.
      const trailing=map.get('trailing-icon');
      trailing.hiddenWhen=[{property:'allowClear',equals:true},{property:'value',equals:'',not:true},{property:'state',equals:'Disabled',not:true},{property:'state',equals:'Read-Only',not:true}];
      map.get('error').visibleWhen=[{property:'state',equals:'Error'}];
      const helperNode=map.get('helper'),slot={id:'supporting-slot',name:'Custom supporting content',kind:'slot',tag:'div',bind:'supportingSlot',styles:{display:'flex',flexDirection:'column',width:'100%',height:'auto'},attributes:{},children:[]};
      const supporting={id:'supporting-content',name:'Supporting content',kind:'container',tag:'div',styles:{display:'flex',flexDirection:'column',gap:'0px',width:'100%',height:'auto'},attributes:{},children:[helperNode,slot],visibleWhen:[{property:'showSupporting',equals:true},{property:'state',equals:'Error',not:true}]};
      tree.children=tree.children.map(n=>n.id==='helper'?supporting:n);
      return tree;
    }
    try{
      // Performance fix - this used to cross every Type x State x Size x
      // Radius combination (3x8x8x6 = 1152 variants, a 1.18MB payload,
      // 500ms+ of synchronous main-thread work before the Figma request
      // even started - measured directly, not assumed). Appearance x State
      // is the one real 2D matrix worth drawing as crossed variants (it
      // mirrors this page's own Compare-states table); Size and Radius are
      // single-axis scale properties that vary the same way regardless of
      // Appearance/State, so they're sampled independently at the current
      // baseline instead of multiplying into every matrix cell - the same
      // decoupling Button's own contract already uses for its Size/Content
      // variants rather than crossing them with its appearance/state grid.
      const baselineType=A.types.find(t=>t.label===selected.type)||A.types[0];
      const baselineState=A.states.find(s=>s.label===selected.state)||A.states[0];
      const matrixSamples=[];
      for(const type of A.types)for(const state of A.states)matrixSamples.push({type:type.label,typeKey:type.key,state:state.label,size,tree:build(type,state,size)});
      const sizeSamples=sizes.filter(s=>s!==size).map(sampleSize=>({type:baselineType.label,typeKey:baselineType.key,state:baselineState.label,size:sampleSize,tree:build(baselineType,baselineState,sampleSize)}));
      const allSamples=[...matrixSamples,...sizeSamples];
      const anatomy=matrixSamples.find(s=>s.type===selected.type&&s.state===selected.state).tree;
      const properties=[
        {id:'appearance',name:'Appearance',type:'options',options:A.types.map(t=>t.label),default:selected.type},
        {id:'state',name:'State',type:'options',options:A.states.map(s=>s.label),default:selected.state},
        {id:'size',name:'Size',type:'options',options:sizes,default:size},
        {id:'radius',name:'Corner radius',type:'options',options:radii,default:radius},
        {id:'label',name:'Label',type:'text',default:label},
        {id:'placeholder',name:'Placeholder',type:'text',default:placeholder},
        {id:'value',name:'Value',type:'text',default:value},
        {id:'showPlaceholder',name:'Show placeholder',type:'boolean',default:value===''},
        {id:'supportingText',name:'Supporting text',type:'text',default:helper},
        {id:'errorText',name:'Error message',type:'text',default:error},
        {id:'required',name:'Required',type:'boolean',default:!!opts.required},
        {id:'showLeadingIcon',name:'Show leading icon',type:'boolean',default:icons.includes('leading')||icons.includes('both')},
        {id:'showTrailingIcon',name:'Show trailing icon',type:'boolean',default:icons.includes('trailing')||icons.includes('both')},
        {id:'allowClear',name:'Allow clear',type:'boolean',default:!!native['input-allow-clear']},
        {id:'showSupporting',name:'Show supporting content',type:'boolean',default:!!native['input-show-supporting']},
        {id:'leadingIcon',name:'Leading icon',type:'swap',default:'input-leading-icon'},
        {id:'trailingIcon',name:'Trailing icon',type:'swap',default:'input-trailing-icon'},
        {id:'supportingSlot',name:'Supporting content',type:'slot',default:''}
      ];
      const flatten=tree=>{const map=new Map();(function walk(n){map.set(n.id,n);for(const child of n.children||[])walk(child);})(tree);return map;};
      const base=flatten(anatomy),references={};
      for(const id of ['leading-icon','trailing-icon']){
        const node=base.get(id),reference=M.blank(node.name);reference.id='input-'+id;reference.properties=[];reference.selection={};
        // The instance and its nested master root must not share an authored
        // part ID: Figma readback sees both layers in the same tree.
        reference.anatomy={...M.clone(node),id:'reference-'+id,kind:'container'};delete reference.anatomy.bind;delete reference.anatomy.visibleWhen;delete reference.anatomy.hiddenWhen;
        reference.tokens={...window.ADSFoundation.get().tokens};references[reference.id]=reference;
        for(const sample of allSamples)flatten(sample.tree).get(id).children=[];
      }
      function overridesFor(tree){
        const overrides={};
        for(const [id,node] of flatten(tree)){
          const original=base.get(id),patch={};
          const styles=Object.fromEntries(Object.entries(node.styles).filter(([key,val])=>original.styles[key]!==val));
          const attributes=Object.fromEntries(Object.entries(node.attributes||{}).filter(([key,val])=>original.attributes?.[key]!==val));
          for(const key of Object.keys(original.attributes||{}))if(!(key in (node.attributes||{})))attributes[key]=null;
          if(Object.keys(styles).length)patch.styles=styles;if(Object.keys(attributes).length)patch.attributes=attributes;
          if(JSON.stringify(node.visibleWhen)!==JSON.stringify(original.visibleWhen))patch.visibleWhen=node.visibleWhen||[];
          if(Object.keys(patch).length)overrides[id]=patch;
        }
        return overrides;
      }
      // Radius affects only the control's corners - no separate DOM render
      // needed per radius value, just an overlay on top of whichever
      // sample's own overrides are already being emitted.
      const cornerStyles=(typeKey,sampleRadius)=>Object.fromEntries(['borderRadius','borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius'].map(key=>[key,(typeKey==='underlined'?0:sampleRadius)+'px']));
      // Each of matrixSamples/sizeSamples is already a real, independently-
      // rendered DOM measurement for its own one or two axes - cheap to
      // build (34 renders total: 3 types x 9 states, plus 7 extra sizes;
      // radius never needed its own render at all, just the corner overlay
      // above). What they were NOT doing is reaching Figma as one variant
      // PER FULL (Appearance, State, Size, Radius) combination - each only
      // ever specified when:{appearance,state} or when:{size} or
      // when:{radius} alone, with every other axis implicitly left at
      // whatever the page happened to have selected. That's enough for
      // compile()'s own override-merging (every matching variant's patches
      // get combined, which is exactly how the live web preview already
      // renders any combination correctly) - but Figma's real variant model
      // has no such merging: an instance set to Appearance=Filled,
      // Size=56px needs ONE real master that IS that exact combination, and
      // nothing here ever built one. Every combination other than "vary
      // exactly one axis from the page's current selection" was simply
      // missing - reachable in the Properties panel as dropdown options,
      // but with no real master behind most combinations of them together.
      // Fix: merge the already-computed partial overrides in plain JS (no
      // additional DOM work - the expensive part) into one explicit variant
      // per full combination, the same way Button/Float Button/Group
      // Button's own bespoke captures already cross their own axes.
      const matrixOverridesByKey=new Map(matrixSamples.map(s=>[s.type+'|'+s.state,overridesFor(s.tree)]));
      const sizeOverridesByKey=new Map(sizeSamples.map(s=>[s.size,overridesFor(s.tree)]));
      function mergeOverrides(...overridesList){
        const merged={};
        for(const overrides of overridesList)for(const [id,patch] of Object.entries(overrides||{}))merged[id]={...(merged[id]||{}),...patch,styles:{...(merged[id]?.styles||{}),...(patch.styles||{})}};
        return merged;
      }
      const variants=[];
      for(const type of A.types)for(const state of A.states)for(const sampleSize of sizes)for(const sampleRadius of radii){
        if(type.label===selected.type&&state.label===selected.state&&sampleSize===size&&sampleRadius===radius)continue;
        const matrixOv=matrixOverridesByKey.get(type.label+'|'+state.label)||{};
        const sizeOv=sampleSize!==size?(sizeOverridesByKey.get(sampleSize)||{}):{};
        const merged=mergeOverrides(matrixOv,sizeOv);
        merged.control={...merged.control,styles:{...merged.control?.styles,...cornerStyles(type.key,sampleRadius)}};
        const variantName=type.label+' / '+state.label+' / '+sampleSize+'px / '+(sampleRadius===9999?'Full':sampleRadius+'px');
        variants.push({id:'input-full-'+M.id(variantName),name:variantName,when:{appearance:type.label,state:state.label,size:sampleSize,radius:sampleRadius},overrides:merged});
      }
      return {anatomy,properties,selection:Object.fromEntries(properties.map(p=>[p.id,p.default])),variants,references,behaviors:[{target:'input',event:'input',property:'value',value:'$value'},{target:'clear',event:'click',property:'value',value:''}]};
    }finally{host.remove();}
  }
})();
