/* Executable Master-Detail specimen for the Grid & Layout contract. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded',()=>{
    const panel=document.createElement('section');panel.className='panel ads-master-example';
    panel.innerHTML='<h2 class="panel-title">Try Master-Detail</h2><p class="get-library-copy">Select a record, simulate its loading or error state, then return to the list. This local example preserves selection and list scroll position. Below 900px it shows one pane at a time.</p><div class="ads-master-shell"><div class="ads-master-list" role="region" tabindex="0" aria-label="Example records"><h3>Records</h3><div data-master="records"></div></div><section class="ads-master-detail" aria-labelledby="master-heading"><button type="button" class="btn btn-ghost" data-master="back" hidden>Back to records</button><h3 id="master-heading" tabindex="-1">Select a record</h3><p data-master="content">Select a record to see its details.</p><div class="panel-footer-row" data-master="actions" hidden><button type="button" class="btn btn-ghost" data-master="loading">Simulate loading</button><button type="button" class="btn btn-ghost" data-master="error">Simulate error</button><button type="button" class="btn btn-ghost" data-master="clear">Clear selection</button></div><button type="button" class="btn btn-primary" data-master="retry" hidden>Retry</button><p class="save-status ads-no-clamp" role="status" aria-live="polite" data-master="status"></p></section></div>';
    document.querySelector('#implementation-contract').before(panel);
    const get=key=>panel.querySelector('[data-master="'+key+'"]');
    const list=panel.querySelector('.ads-master-list'),detail=panel.querySelector('.ads-master-detail');
    const heading=panel.querySelector('#master-heading'),media=matchMedia('(max-width:900px)');
    const records=['Workspace settings','Release checklist','Token handoff'];
    let selected=null,state='empty',listScroll=0,detailVisible=false,timer=null,generation=0;
    records.forEach((label,index)=>{
      const button=document.createElement('button');button.type='button';button.className='btn btn-ghost';
      button.textContent=label;button.dataset.record=String(index);button.setAttribute('aria-pressed','false');
      button.addEventListener('click',()=>{clearTimeout(timer);generation++;listScroll=list.scrollTop;selected=index;state='ready';detailVisible=true;render();heading.focus();});get('records').append(button);
    });
    function render() {
      list.hidden=media.matches&&detailVisible;detail.hidden=media.matches&&!detailVisible;
      get('back').hidden=!media.matches||!detailVisible;
      heading.textContent=selected==null?'Select a record':records[selected];
      get('content').textContent=state==='empty'?'Select a record to see its details.':state==='loading'?'Loading record…':state==='error'?'This example could not load the record. Retry keeps the selected record.':'Example details for '+records[selected]+'. No workspace changes are made.';
      get('content').classList.toggle('ads-data-skeleton',state==='loading');
      detail.setAttribute('aria-busy',String(state==='loading'));
      get('actions').hidden=selected==null;get('retry').hidden=state!=='error';
      for(const button of get('records').children)button.setAttribute('aria-pressed',String(Number(button.dataset.record)===selected));
      const status=get('status');status.setAttribute('role',state==='error'?'alert':'status');
      status.textContent=state==='loading'?'Loading selected record.':state==='error'?'Record could not be loaded. Retry is available.':selected==null?'No record selected.':'Record details available.';
    }
    function load() {
      if(selected==null)return;
      clearTimeout(timer);const request=++generation;state='loading';render();
      timer=setTimeout(()=>{if(request!==generation)return;state='ready';render();},600);
    }
    get('loading').addEventListener('click',load);
    get('error').addEventListener('click',()=>{clearTimeout(timer);generation++;state='error';render();get('retry').focus();});
    get('retry').addEventListener('click',()=>{load();heading.focus();});
    get('back').addEventListener('click',()=>{detailVisible=false;render();list.scrollTop=listScroll;get('records').children[selected]?.focus({preventScroll:true});});
    get('clear').addEventListener('click',()=>{clearTimeout(timer);generation++;const origin=selected;selected=null;state='empty';detailVisible=false;render();get('records').children[origin]?.focus({preventScroll:true});});
    function resize(){const active=document.activeElement;render();if(active&&((list.hidden&&list.contains(active))||(detail.hidden&&detail.contains(active)))){if(detailVisible)heading.focus();else get('records').children[selected??0]?.focus();}}
    media.addEventListener('change',resize);render();
    window.addEventListener('pagehide',()=>{clearTimeout(timer);generation++;media.removeEventListener('change',resize);});
  });
})();
