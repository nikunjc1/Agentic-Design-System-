(() => {
  'use strict';
  const esc=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline=text=>esc(text).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  function body(text) {
    // Keep the supported Markdown structure readable, including code fences.
    return text.split(/(```[\s\S]*?```)/g).map((part,i)=>i%2
      ? '<pre class="guide-machine-json"><code>'+esc(part.replace(/^```[^\n]*\n?/,'').replace(/```$/,''))+'</code></pre>'
      : part.split(/\n\n+/).filter(p=>p.trim()).map(p=>{
        if(p.split('\n').every(l=>/^\s*[-*] /.test(l)))return '<ul class="guide-list">'+p.split('\n').map(l=>'<li>'+inline(l.replace(/^\s*[-*] /,''))+'</li>').join('')+'</ul>';
        const heading=p.match(/^#{1,4} (.+)$/);if(heading)return '<h4>'+inline(heading[1])+'</h4>';
        return '<p class="get-library-copy">'+inline(p).replace(/\n/g,'<br>')+'</p>';
      }).join('')).join('');
  }
  const idFor=title=>{
    let hash=2166136261;for(const c of title)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
    return 'change-'+title.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,60).replace(/-$/,'')+'-'+hash.toString(36);
  };
  document.addEventListener('DOMContentLoaded',()=>{
    const data=window.ADSChangelog,list=document.getElementById('changelogList'),count=document.getElementById('changelogCount');
    const search=document.getElementById('changelogSearch'),status=document.getElementById('changelogSearchStatus');
    if(!data||!Array.isArray(data.entries)){count.textContent='Changelog unavailable';status.textContent='Reload this page, or open CHANGELOG.md in the design-system folder.';search.disabled=true;return;}
    count.textContent=`${data.entries.length} entries, newest first`;
    const rows=data.entries.map(entry=>{
      const wrap=document.createElement('details');wrap.className='changelog-entry';wrap.id=idFor(entry.title);
      const title=document.createElement('summary');title.className='changelog-entry-title';title.textContent=entry.title;wrap.append(title);
      const content=document.createElement('div');content.innerHTML=body(entry.body);wrap.append(content);
      const link=document.createElement('a');link.href='#'+wrap.id;link.textContent='Link to this change';link.setAttribute('aria-label','Link to change: '+entry.title);content.prepend(link);
      list.append(wrap);return {wrap,text:(entry.title+' '+entry.body).toLowerCase()};
    });
    function filter(){const query=search.value.trim().toLowerCase();let shown=0;rows.forEach(({wrap,text})=>{wrap.hidden=!!query&&!text.includes(query);if(!wrap.hidden)shown++;});status.textContent=query?`${shown} of ${rows.length} entries match.${shown?'':' Clear the search to show all changes.'}`:'';}
    search.addEventListener('input',filter);
    document.getElementById('clearChangelogSearch').addEventListener('click',()=>{search.value='';filter();search.focus()});
    function reveal(){const row=rows.find(({wrap})=>'#'+wrap.id===location.hash);if(!row)return;search.value='';filter();row.wrap.open=true;row.wrap.scrollIntoView({block:'start'});}
    window.addEventListener('hashchange',reveal);reveal();
    if(data.knownGaps){document.getElementById('knownGapsSection').hidden=false;document.getElementById('knownGapsBody').innerHTML=body(data.knownGaps);}
    if(!rows.length)status.textContent='No implementation changes have been recorded yet.';
  });
})();
