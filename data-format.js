(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded',()=>{
    const M=window.ADSFoundationModel, main=document.querySelector('main');
    const panel=document.createElement('section');panel.className='panel ads-data-settings';
    const title=document.createElement('h2');title.className='panel-title';title.textContent='Data Format configuration';panel.append(title);
    const intro=document.createElement('p');intro.className='get-library-copy';intro.textContent='Settings apply to marked values across components and exports. Dates use the selected time zone. Redaction is display masking; sensitive values must be removed on the server before delivery.';panel.append(intro);
    const form=document.createElement('form');form.className='ads-format-controls ads-format-grouped';form.noValidate=true;
    const controls={};let config=M.normalizeData(window.ADSFoundation.read('data-format'));
    const specs=[
      ['locale','Locale',['en-GB','en-US','en-IN','de-DE','fr-FR','ja-JP']],
      ['grouping','Thousands grouping','checkbox'],
      ['separator','Thousands separator',['locale','comma','space','none']],
      ['unit','Unit suffix','text'],['unitSpace','Space before unit',['none','space','nbsp']],
      ['currency','Currency',['GBP','USD','INR','EUR','JPY','AED']],['currencyDisplay','Currency display',['symbol','code','name']],
      ['decimals','Decimal precision','number',0,6],['large','Large amounts',['compact','standard']],['tableAlign','Numeric tables alignment',['end','start']],
      ['date','Absolute date',['iso','locale','long']],['hourCycle','Absolute time',['h23','h12']],['seconds','Include seconds','checkbox'],
      ['combined','Combined date/time separator',['space','T']],['relative','Relative time','checkbox'],
      ['zone','Time zone (IANA name)','text'],['showZone','Show time zone','checkbox'],['range','Range separator','text'],
      ['noValue','No value placeholder','text'],['loading','Loading',['skeleton','text']],
      ['redaction','Redaction default',['full','partial']],['mask','Redaction character','text'],['reveal','Partial redaction: trailing characters','number',0,8],
      ['escapedSpace','Escaped spacing (&#x20;)',['space','nbsp','narrow']]
    ];
    const fieldGrids={};
    const groups=[['Numbers, units and currency',specs.slice(0,10)],['Dates and times',specs.slice(10,18)],['Missing, sensitive and spaced data',specs.slice(18)]];
    for(const [name,fields] of groups) {
      const fieldset=document.createElement('fieldset');fieldset.className='ads-format-group';
      const legend=document.createElement('legend');legend.textContent=name;
      const grid=document.createElement('div');grid.className='ads-format-grid';
      fieldset.append(legend,grid);form.append(fieldset);
      for(const [key] of fields) fieldGrids[key]=grid;
    }
    for(const [key,labelText,kind,min,max] of specs) {
      const label=document.createElement('label');label.className='setup-field ads-format-field';
      const caption=document.createElement('span');caption.className='ads-format-label';caption.textContent=labelText;label.append(caption);
      const input=document.createElement(Array.isArray(kind)?'select':'input');input.id='format-'+key;input.name=key;
      if(Array.isArray(kind)) for(const value of kind) {const opt=document.createElement('option');opt.value=value;opt.textContent=value;input.append(opt);}
      else {input.type=kind;if(kind==='number'){input.min=min;input.max=max;input.step='1';input.required=true;}if(kind==='text') {input.maxLength=key==='zone'?80:24;input.required=true;}}
      input.setAttribute('aria-describedby','format-error');controls[key]=input;
      if(kind==='checkbox') {
        const slot=document.createElement('span');slot.className='ads-format-toggle';
        const enabled=document.createElement('span');enabled.textContent='Enabled';enabled.setAttribute('aria-hidden','true');
        slot.append(input,enabled);label.append(slot);
      } else label.append(input);
      fieldGrids[key].append(label);
    }
    const error=document.createElement('p');error.id='format-error';error.className='setup-error ads-no-clamp';error.setAttribute('role','alert');
    const status=document.createElement('p');status.className='save-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const reset=document.createElement('button');reset.className='btn btn-ghost';reset.type='button';reset.textContent='Reset Data Format';
    const exportBtn=document.createElement('button');exportBtn.className='btn btn-ghost';exportBtn.type='button';exportBtn.textContent='Download configuration';
    function populate() {for(const [k,input] of Object.entries(controls)) {if(input.type==='checkbox') input.checked=config[k];else input.value=config[k];} error.textContent='';}
    function commit() {
      const draft={}, invalid=new Set();
      for(const [k,input] of Object.entries(controls)) {input.removeAttribute('aria-invalid');draft[k]=input.type==='checkbox'?input.checked:input.type==='number'?Number(input.value):input.value;if(!input.checkValidity()||(input.type==='text'&&!input.value.trim())) invalid.add(input);}
      try{new Intl.DateTimeFormat(draft.locale,{timeZone:draft.zone});}catch{invalid.add(controls.zone);}
      if(Array.from(draft.mask).length!==1) invalid.add(controls.mask);
      const separatorConflict=draft.separator==='comma'&&['de-DE','fr-FR'].includes(draft.locale);
      if(separatorConflict) invalid.add(controls.separator);
      error.textContent=invalid.size?'Enter valid values for '+Array.from(invalid,input=>specs.find(spec=>spec[0]===input.name)[1]).join(', ')+'.'+(separatorConflict?' Use the locale separator: a comma would conflict with the decimal separator.':'')+(invalid.has(controls.zone)?' Use an IANA time zone, for example UTC or Asia/Kolkata.':'')+(invalid.has(controls.mask)?' Use one redaction character.':''):'';
      if(invalid.size) {invalid.forEach(input=>input.setAttribute('aria-invalid','true'));status.textContent='Changes are not saved. The previous configuration remains active.';return;}
      config=M.normalizeData(draft);const saved=window.ADSStorage.safeSet('ads:data-format',config);status.textContent=saved?'Saved; examples updated.':'Preview updated; changes could not be saved.';
    }
    form.addEventListener('submit',e=>{e.preventDefault();commit();});form.addEventListener('input',commit);form.addEventListener('change',commit);
    reset.addEventListener('click',()=>{if(!window.ADSStorage.safeRemove('ads:data-format')) {status.textContent='Reset could not be saved.';return;}config=M.normalizeData(null);populate();status.textContent='Defaults restored.';});
    exportBtn.addEventListener('click',()=>{const resolved=window.ADSFoundation.get();const blob=new Blob([JSON.stringify({schemaVersion:1,dataFormat:resolved.dataFormat},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='damco-data-format.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    const actions=document.createElement('div');actions.className='panel-footer-row ads-format-actions';actions.append(reset,exportBtn,status);
    panel.append(form,error,actions);
    const toolbar=main.querySelector('.ads-foundation-toolbar');(toolbar||main.querySelector('.page-lede')).after(panel);
    populate();
    const samples=[['Thousands separator','number','123220.5'],['Units','unit','220'],['Currency','currency','123.45'],['Large amounts','large','1234567'],['Tables','number','123220.5'],['Absolute date','date','2026-03-14T14:08:00Z'],['Absolute time','time','2026-03-14T14:08:00Z'],['Combined','datetime','2026-03-14T14:08:00Z'],['Relative time','relative',new Date(Date.now()-12*60000).toISOString()],['Time zone','time','2026-03-14T14:08:00Z'],['Ranges','range','["2026-01-01T00:00:00Z","2026-03-31T00:00:00Z"]'],['No value','number',null],['Loading','loading',''],['Full redaction','full','123456781402'],['Partial redaction','partial','123456781402']];
    main.querySelectorAll('.usage-row').forEach(row=>{
      const label=row.querySelector('.usage-label'), sample=samples.find(s=>s[0]===label?.textContent.trim());if(!sample) return;
      const value=row.querySelector('.usage-values');value.dataset.format=sample[1];if(sample[2]===null)value.dataset.missing='true';else value.dataset.value=sample[2];
      const desc=row.querySelector('.usage-desc');desc.textContent='Configure above; this example uses the current Foundation settings.';
    });
    const space=document.createElement('p');space.className='ads-format-space-preview';space.textContent='Escaped space preview: ';const output=document.createElement('span');output.dataset.formatSpace='';space.append(output);panel.append(space);
    const table=document.createElement('table');table.className='ads-format-table';table.innerHTML='<caption>Configured table examples</caption><thead><tr><th scope="col">Kind</th><th scope="col">Value</th></tr></thead><tbody><tr><th scope="row">Number</th><td data-format="number" data-value="123220.5"></td></tr><tr><th scope="row">Currency</th><td data-format="currency" data-value="123.45"></td></tr><tr><th scope="row">Date</th><td data-format="date" data-value="2026-03-14"></td></tr><tr><th scope="row">Missing</th><td data-format="number" data-missing="true"></td></tr></tbody>';panel.append(table);
    window.ADSFoundation.apply();
  });
})();
