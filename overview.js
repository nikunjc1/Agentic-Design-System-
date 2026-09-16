(() => {
  'use strict';
  const M = window.OverviewModel, $ = id => document.getElementById(id), e = M.escape;
  const dialog = $('workspaceDialog');
  let state = M.blank(), activeId = '', shared = null, busy = false, returnFocus = null, dialogKind = '', dialogData = {}, storageError = false;
  let projectQuery = '', historyQuery = '', historyType = '', historyStatus = '', historyProject = '', historySort = 'newest';
  let pageSize = 12;
  const date = ts => new Date(ts).toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'});
  const current = () => shared || state.projects.find(p => p.id === activeId);
  const badge = status => `<span class="status-badge ${e(status)}">${e({ready:'Preview ready',failed:'Generation failed',expired:'Expired',pending:'Pending · preview',accepted:'Accepted · preview'}[status] || status)}</span>`;
  const button = (action, label, attrs = '', primary = false) => `<button type="button" class="btn ${primary ? 'btn-primary' : 'btn-ghost'}" data-action="${action}" ${attrs}>${label}</button>`;
  const empty = text => `<div class="empty-result">${text}</div>`;
  function announce(text, error = false) {
    $('feedback').hidden = false;
    $('feedback').className = `feedback${error ? ' error' : ''}`;
    $('feedback').replaceChildren();
    const span = document.createElement('span'); span.textContent = text;
    $('feedback').append(span);
    const dismiss = document.createElement('button'); dismiss.className = 'btn btn-ghost'; dismiss.textContent = 'Dismiss'; dismiss.onclick = () => { $('feedback').hidden = true; };
    $('feedback').append(dismiss);
  }
  function failStorage(error) {
    storageError = true;
    $('workspaceError').hidden = false;
    $('workspaceError').innerHTML = `<span>We couldn’t read your saved workspace. Your data has not been replaced. ${e(error instanceof SyntaxError ? "The saved data is not readable." : error.message)} Check browser storage settings, then retry.</span>${button('reload','Retry')}`;
    $('headerCreate').hidden = true;
    $('workspace').innerHTML = empty('Your saved projects will appear here when storage is available.');
  }
  function commit(change) {
    const next = M.load(localStorage);
    change(next);
    try { M.save(localStorage, next); }
    catch { throw new Error('Could not save changes in this browser. Check available storage and browser permissions, then retry.'); }
    state = next;
  }
  function mutableProject(next, id) {
    if (shared) throw new Error('This shared snapshot is read-only. Open your own workspace to manage projects.');
    const p = next.projects.find(p => p.id === id);
    if (!p) throw new Error('This project is no longer available. Reload the workspace.');
    return p;
  }
  function takeScenario(name) {
    if ($('scenario').value !== name) return false;
    $('scenario').value = 'none'; return true;
  }
  function focusSection(id) { const node = $(id); node?.focus({preventScroll:true}); node?.scrollIntoView({block:'start',behavior:'instant'}); }
  function projectState(p) {
    const ready = Object.keys(M.TYPES).filter(t => {const r=M.latest(p,t);return r && M.status(r)==='ready';}).length;
    return `${ready} of 3 previews ready`;
  }
  function resourceActions(p, r) {
    if (!r || M.status(r) !== 'ready') return shared ? '<p class="hint">Ask the owner for a new resource snapshot.</p>' : button('generate',r?.status === 'failed' ? 'Retry generation' : 'Generate preview',`data-project="${e(p.id)}" data-type="${e(r?.type || '')}"`);
    const attrs = `data-project="${e(p.id)}" data-resource="${e(r.id)}"`;
    return `<div class="actions">${button('copy-resource','Copy',attrs + ` aria-label="Copy ${e(M.TYPES[r.type].name)} link"`)}${button('open-resource','Open',attrs + ` aria-label="Open ${e(M.TYPES[r.type].name)} preview"`)}${button('share-resource','Share',attrs + ` aria-label="Share ${e(M.TYPES[r.type].name)}"`)}</div>`;
  }
  function resourceCards(p) {
    const types = shared ? [...new Set(p.resources.map(r => r.type))] : Object.keys(M.TYPES);
    return `<div class="resource-grid">${types.map(type => {
      const info = M.TYPES[type], r = M.latest(p,type);
      return `<article class="resource-card"><div class="resource-top"><span class="resource-icon" aria-hidden="true">${e(info.icon)}</span>${badge(r ? M.status(r) : 'Not generated')}</div><h3>${info.name}</h3><p>${info.description}</p>${r?.error && M.status(r)!=='ready' ? `<p class="hint">${e(r.error)}</p>` : ''}${r ? resourceActions(p,r) : button('generate','Generate preview',`data-project="${e(p.id)}" data-type="${type}"`)}${!shared && r && M.status(r)==='ready' ? `<button class="text-action" type="button" data-action="generate" data-project="${e(p.id)}" data-type="${type}">Generate a new version</button>` : ''}</article>`;
    }).join('')}</div>`;
  }
  function renderProjects() {
    const list = state.projects.filter(p => M.normalize(p.project).includes(M.normalize(projectQuery))).sort((a,b) => b.createdAt-a.createdAt);
    $('projectList').innerHTML = list.length ? list.map(p => `<button type="button" class="project-choice" data-action="select-project" data-project="${e(p.id)}" aria-pressed="${p.id===activeId}"><strong>${e(p.project)}</strong><span>${projectState(p)}</span></button>`).join('') : empty('No projects match your search. Try another name.');
    $('projectCount').textContent = `${list.length} ${list.length===1?'project':'projects'}`;
  }
  function historyRows() {
    let rows = state.projects.flatMap(p => p.resources.map(r => ({p,r})));
    rows = rows.filter(({p,r}) => (!historyProject || p.id===historyProject) && (!historyType || r.type===historyType) && (!historyStatus || M.status(r)===historyStatus) && M.normalize(`${p.project} ${M.TYPES[r.type].name} ${r.generatedBy}`).includes(M.normalize(historyQuery)));
    rows.sort((a,b) => historySort==='name' ? a.p.project.localeCompare(b.p.project) : (historySort==='oldest'?1:-1)*(a.r.createdAt-b.r.createdAt));
    $('historyCount').textContent = `${rows.length} ${rows.length===1?'resource':'resources'}`;
    $('historyResults').innerHTML = rows.length ? rows.slice(0,pageSize).map(({p,r}) => `<article class="history-row"><div class="history-info"><strong>${e(p.project)} · ${M.TYPES[r.type].name}</strong>${badge(M.status(r))}<p>Generated by ${e(r.generatedBy)}</p><time class="history-meta" datetime="${new Date(r.createdAt).toISOString()}">${e(date(r.createdAt))}</time></div>${resourceActions(p,r)}</article>`).join('') : empty('No resources match these filters. Clear filters to see your history.');
    $('moreHistory').hidden = rows.length <= pageSize;
  }
  function renderMembers(p) {
    return `<section class="workspace-panel" aria-labelledby="members"><div class="section-heading"><h2 id="members" tabindex="-1">Members</h2>${button('invite','Invite Members')}</div><p>Access belongs to this project. Invitations below are local previews; no email is sent.</p><div class="member-list"><div class="member-row"><div><strong>${e(p.name)} (you)</strong><p>${e(p.email)} · ${e(p.role === 'Other' ? p.jobTitle : p.role)}</p></div>${badge('Owner')}</div>${p.invites.map(i => `<div class="member-row"><div><strong>${e(i.email)}</strong><p>${e(i.access)} · ${i.access==='Viewer'?'View and copy resources':'View resources and generate new versions'}</p><span class="history-meta">${M.inviteStatus(i)==='accepted'?'Accepted':M.inviteStatus(i)==='expired'?'Expired':'Expires'} ${e(date(M.inviteStatus(i)==='accepted'?i.acceptedAt:i.expiresAt))}</span></div><div class="actions">${badge(M.inviteStatus(i))}${M.inviteStatus(i)==='pending'?button('preview-invite','Preview invitation',`data-invite="${e(i.id)}"`):''}${M.inviteStatus(i)!=='accepted'?button('resend','Resend preview',`data-invite="${e(i.id)}"`):''}</div></div>`).join('')}</div></section>`;
  }
  function render() {
    if (storageError) return;
    $('headerCreate').hidden = shared || !state.projects.length;
    $('prototypeTools').hidden = !!shared;
    if (shared) {
      $('workspace').innerHTML = `<section class="workspace-panel"><div class="project-heading"><div><span class="status-badge">Read-only shared snapshot</span><h2 style="margin-top:16px">${e(shared.project)}</h2></div><a class="btn btn-ghost" href="overview.html">Open my workspace</a></div><p>Anyone with this link can view this snapshot. It does not update when the project changes. No membership or edit access is granted.</p>${resourceCards(shared)}</section>`;
      return;
    }
    if (!state.projects.length) {
      $('workspace').innerHTML = `<section class="workspace-panel workspace-empty"><div class="empty-symbol" aria-hidden="true">＋</div><h2>No projects yet</h2><p>A project brings your design system resources together. Create your first project to generate and manage CSS, NPM and Figma resource previews.</p>${button('create','Create a New Project','',true)}<p class="empty-caption">You’ll need a project name, your name, email and role.</p><ol class="flow-steps"><li><b>1</b>Create a project</li><li><b>2</b>Access your resources</li><li><b>3</b>Share with your team</li></ol></section>`;
      return;
    }
    if (!current()) activeId = state.projects[state.projects.length-1].id;
    const p = current();
    const readyCount = state.projects.reduce((n,p) => n+p.resources.filter(r => M.status(r)==='ready').length,0);
    const pending = state.projects.reduce((n,p) => n+p.invites.filter(i => M.inviteStatus(i)==='pending').length,0);
    $('workspace').innerHTML = `<nav class="workspace-nav" aria-label="Overview sections"><a href="#projects">Projects</a><a href="#resources">Resources</a><a href="#history">Project Link History</a><a href="#members">Members</a></nav><div class="workspace-stats"><span><b>${state.projects.length}</b>Projects</span><span><b>${readyCount}</b>Resource previews</span><span><b>${pending}</b>Pending invitations</span></div>
      <section class="workspace-panel"><div class="section-heading"><h2 id="projects" tabindex="-1">Your projects</h2><span class="hint" id="projectCount"></span></div><div class="workspace-toolbar"><label class="form-field search-field">Find a project<input id="projectSearch" type="search" placeholder="Search by project name" value="${e(projectQuery)}"></label></div><div id="projectList" class="project-list"></div></section>
      <section class="workspace-panel" aria-labelledby="resources"><div class="project-heading" id="projectHeading" tabindex="-1"><div><span class="hint">Selected project · Owner</span><h2 id="resources" tabindex="-1">${e(p.project)}</h2></div><div class="actions">${button('share-project','Share Project')}${button('invite','Invite Members')}</div></div><p>${projectState(p)} · Created ${e(date(p.createdAt))}. Open a resource to see its contents and next steps.</p>${p.legacy?'<p class="dialog-notice">Recovered from your earlier link history. Previous links were placeholders; generate previews to make these resources usable.</p>':''}${resourceCards(p)}</section>
      <section class="workspace-panel" aria-labelledby="history"><div class="section-heading"><h2 id="history" tabindex="-1">Project Link History</h2><span class="hint" id="historyCount" aria-live="polite"></span></div><p>Every generated version stays here, including previous attempts. Preview links expire after 30 days.</p><div class="workspace-toolbar"><label class="form-field search-field">Search history<input type="search" id="historySearch" value="${e(historyQuery)}" placeholder="Project, resource or creator"></label><label class="form-field">Project<select id="historyProject"><option value="">All projects</option>${state.projects.map(p=>`<option value="${e(p.id)}" ${historyProject===p.id?'selected':''}>${e(p.project)}</option>`).join('')}</select></label><label class="form-field">Resource type<select id="historyType"><option value="">All types</option>${Object.entries(M.TYPES).map(([t,v])=>`<option value="${t}" ${historyType===t?'selected':''}>${v.name}</option>`).join('')}</select></label><label class="form-field">Status<select id="historyStatus"><option value="">All statuses</option>${['ready','failed','expired'].map(s=>`<option value="${s}" ${historyStatus===s?'selected':''}>${s==='ready'?'Preview ready':s==='failed'?'Generation failed':'Expired'}</option>`).join('')}</select></label><label class="form-field">Sort by<select id="historySort">${[['newest','Newest first'],['oldest','Oldest first'],['name','Project name']].map(([v,t])=>`<option value="${v}" ${historySort===v?'selected':''}>${t}</option>`).join('')}</select></label>${button('clear-filters','Clear filters')}</div><div class="history-results" id="historyResults"></div><button type="button" class="text-action" data-action="more-history" id="moreHistory">Show more resources</button></section>${renderMembers(p)}`;
    renderProjects(); historyRows();
    $('projectSearch').addEventListener('input',ev=>{projectQuery=ev.target.value;renderProjects();});
    for (const id of ['historySearch','historyProject','historyType','historyStatus','historySort']) $(id).addEventListener(id==='historySearch'?'input':'change',() => {
      historyQuery=$('historySearch').value;historyProject=$('historyProject').value;historyType=$('historyType').value;historyStatus=$('historyStatus').value;historySort=$('historySort').value;pageSize=12;historyRows();
    });
  }
  function showDialog(title, description, content, kind, data = {}) {
    returnFocus = document.activeElement;
    dialogKind = kind; dialogData = data;
    dialog.innerHTML = `<button type="button" class="dialog-close" data-action="close" aria-label="Close dialog">×</button><h2 class="modal-title" id="dialogTitle" tabindex="-1">${e(title)}</h2><p class="modal-copy" id="dialogDescription">${e(description)}</p><div class="dialog-alert" id="dialogError" role="alert" tabindex="-1"></div>${content}<div class="dialog-alert" id="discardPrompt" hidden><p>Discard the information you entered?</p><div class="actions">${button('keep-editing','Keep editing')}${button('discard','Discard changes')}</div></div>`;
    if (!dialog.open) dialog.showModal();
    (dialog.querySelector('[autofocus]') || $('dialogTitle')).focus();
  }
  function close(force = false) {
    if (busy) return;
    if (!force && dialog.querySelector('form')?.dataset.dirty === 'true') { $('discardPrompt').hidden=false;dialog.querySelector('[data-action="keep-editing"]').focus();return; }
    dialog.close();
    if (returnFocus?.isConnected) returnFocus.focus(); else $('headerCreate').hidden ? $('main').focus() : $('headerCreate').focus();
  }
  function dialogError(message) { $('dialogError').setAttribute('role','alert'); $('dialogError').textContent=message;$('dialogError').focus(); }
  function setBusy(value, label) {
    busy=value;
    dialog.setAttribute('aria-busy',String(value));
    dialog.querySelectorAll('button,fieldset').forEach(el=>el.disabled=value);
    const submit=dialog.querySelector('[type=submit]');if(submit && label) submit.textContent=label;
  }
  function field(key,label,type='text',hint='',attrs='') {
    return `<label class="form-field" for="field-${key}">${label}<input id="field-${key}" name="${key}" type="${type}" required ${attrs} aria-describedby="error-${key}${hint?` hint-${key}`:''}">${hint?`<small id="hint-${key}">${hint}</small>`:''}<span class="field-error" id="error-${key}"></span></label>`;
  }
  function createDialog() {
    showDialog('Create a New Project','Generate CSS Variables, NPM Package and Figma Library previews for your project. All fields are required.',`<form id="createForm" class="dialog-form" novalidate><fieldset>${field('project','Project Name','text','A name your team will recognize.','maxlength="80" autocomplete="off" autofocus placeholder="e.g. Claims Portal"')}<div class="form-grid">${field('name','Your Name','text','','maxlength="100" autocomplete="name"')}${field('email','Email Address','email','','maxlength="254" autocomplete="email"')}</div><label class="form-field" for="field-role">Select Your Role<select id="field-role" name="role" required aria-describedby="roleHint error-role"><option value="">Select a role</option><option>Designer</option><option>Developer</option><option>Product Manager</option><option>Design System Lead</option><option>Other</option></select><small id="roleHint">Your job role helps describe your work. You will be the project owner.</small><span class="field-error" id="error-role"></span></label><div id="jobTitleField" hidden>${field('jobTitle','Job Title','text','','maxlength="100" autocomplete="organization-title" disabled')}</div><p class="dialog-notice">Local prototype: this creates resource previews in this browser. It does not publish an NPM package or a Figma library.</p></fieldset><div class="modal-actions">${button('close','Cancel')}<button type="submit" class="btn btn-primary">Generate Link</button></div></form>`,'create');
    $('field-role').onchange=()=>{const role=$('field-role').value,other=role==='Other';$('jobTitleField').hidden=!other;$('field-jobTitle').disabled=!other;$('field-jobTitle').required=other;if(!other)$('field-jobTitle').value='';const descriptions={Designer:'Designs interfaces and user experiences.',Developer:'Builds interfaces and integrates design resources.','Product Manager':'Defines product priorities and coordinates delivery.','Design System Lead':'Maintains shared design standards and resources.',Other:'Tell us your job title below.'};$('roleHint').textContent=(descriptions[role]||'Choose the role that best describes your work.')+' You will be the project owner regardless of your job role.';};
    $('createForm').onsubmit=createProject;
  }
  function applyErrors(errors) {
    for (const input of dialog.querySelectorAll('input,select')) {
      const msg=errors[input.name];input.setAttribute('aria-invalid',String(!!msg));
      const hint=$(`error-${input.name}`);if(hint)hint.textContent=msg||'';
    }
    if (!Object.keys(errors).length) {$('dialogError').textContent='';return false;}
    $('dialogError').innerHTML=`Check the following fields:<ul>${Object.entries(errors).map(([key,msg])=>`<li><a href="#field-${key}">${e(msg)}</a></li>`).join('')}</ul>`;
    $('dialogError').focus();return true;
  }
  async function generateResources(p, types) {
    const failNpm = takeScenario('resource');
    let css, cssError;
    if(types.includes('css')) {
      try {
        const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),8000);
        let source;try {const response=await fetch('theme.css',{signal:controller.signal,cache:'no-cache'});if(!response.ok) throw new Error('Source tokens unavailable.');source=await response.text();} finally {clearTimeout(timeout);}
        const names=[...new Set(source.match(/--[a-zA-Z0-9-]+(?=\s*:)/g))];
        if(!names.length)throw new Error('No tokens found.');
        const style=getComputedStyle(document.documentElement);
        css='/* Damco design token preview. Snapshot of the current theme. */\n:root {\n'+names.map(name=>`  ${name}: ${style.getPropertyValue(name).trim()};`).join('\n')+'\n}\n';
      } catch {cssError='Could not load the design tokens. Check the local server connection, then retry.';}
    }
    return types.map(type=>{
      if(type==='css')return M.resource(p,type,css||'',cssError||'');
      if(type==='npm')return M.resource(p,type,JSON.stringify({name:`damco-project-${p.id.toLowerCase().replace(/[^a-z0-9-]/g,'-')}`,version:'0.0.0-preview',private:true,description:'Local manifest preview. This package has not been published to an NPM registry.',files:['tokens.css'],style:'tokens.css'},null,2),failNpm?'NPM preview generation failed in the selected prototype scenario. Retry generation.':'');
      return M.resource(p,type,JSON.stringify({name:p.project,kind:'Figma library handoff preview',published:false,nextSteps:['Create or open a Figma library file.','Import the project tokens as Figma variables.','Review components and publish the library in Figma.'],note:'This prototype does not create or publish a Figma file.'},null,2));
    });
  }
  async function createProject(ev) {
    ev.preventDefault();if(busy)return;
    const input=Object.fromEntries(new FormData(ev.target));
    try {
      const latest=M.load(localStorage);
      if(applyErrors(M.validateProject(input,latest.projects)))return;
      setBusy(true,'Generating project…');
      await new Promise(resolve=>setTimeout(resolve,350));
      if(takeScenario('network'))throw new Error('Project generation failed in the network-error preview. Your information is still here. Try Generate Link again.');
      const p=M.project(input);
      dialog.querySelector('[type=submit]').textContent='Generating resources…';
      p.resources=await generateResources(p,Object.keys(M.TYPES));
      commit(next=>{const errors=M.validateProject(input,next.projects);if(Object.keys(errors).length)throw new Error(Object.values(errors)[0]);next.projects.push(p);});
      activeId=p.id;setBusy(false);close(true);location.hash=`project=${encodeURIComponent(p.id)}`;render();
      const failed=p.resources.filter(r=>M.status(r)==='failed').length;
      announce(failed?`Project created. ${3-failed} of 3 resource previews are ready. Retry the failed resources below.`:`${p.project} created successfully. All 3 resource previews are ready. Open, copy or share them below, or invite members when you’re ready.`,!!failed);
      focusSection('projectHeading');
    } catch(error){setBusy(false,'Generate Link');dialogError(error.message);}
  }
  function findResource(attrs) {
    const p=shared || state.projects.find(p=>p.id===attrs.project);
    const r=p?.resources.find(r=>r.id===attrs.resource);
    if(!r)throw new Error('This resource is no longer available. Reload your workspace.');
    if(M.status(r)!=='ready')throw new Error('This resource is unavailable or expired. Generate a new preview.');
    return {p,r};
  }
  function shareLink(p,resourceId) {
    const payload=JSON.stringify(M.publicSnapshot(p,resourceId));
    const bytes=new TextEncoder().encode(payload);
    const encoded=btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''));
    return `${location.href.split('#')[0]}#share=${encodeURIComponent(encoded)}`;
  }
  async function copy(text, sourceButton) {
    const original=sourceButton?.textContent;
    if(sourceButton){sourceButton.disabled=true;sourceButton.textContent='Copying…';}
    try {
      if(!navigator.clipboard)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if(dialog.open){$('dialogError').textContent='Copied to clipboard.';$('dialogError').setAttribute('role','status');}
      else announce('Link copied. Anyone with this snapshot link can view its contents.');
    }catch {
      if(dialog.open){let manual=$('manualCopy');if(!manual){manual=document.createElement('textarea');manual.id='manualCopy';manual.className='copy-value';manual.readOnly=true;manual.setAttribute('aria-label','Text to copy manually');dialog.append(manual);}manual.value=text;dialogError('Clipboard access was blocked. Select and copy the text below.');manual.focus();manual.select();}
      else {showDialog('Copy link','Clipboard access was blocked. Copy the selected link manually.',`<textarea class="copy-value" id="manualCopy" aria-label="Link to copy" readonly autofocus>${e(text)}</textarea><div class="modal-actions">${button('close','Done')}</div>`,'manual');$('manualCopy').select();}
    }finally{if(sourceButton?.isConnected){sourceButton.disabled=false;sourceButton.textContent=original;}}
  }
  function openResource(p,r) {
    const info=M.TYPES[r.type];
    const note=r.type==='css'?'Download this token snapshot and include it in your project stylesheet.':r.type==='npm'?'This is an unpublished package manifest. An administrator must publish a real package before an install command is available.':'This is a handoff preview. Create and publish the actual library in Figma before sharing a Figma library URL.';
    showDialog(info.name,`${p.project} · ${date(r.createdAt)}`,`<p class="dialog-notice">${e(note)}</p><pre class="resource-preview" tabindex="0" aria-label="${e(info.name)} contents">${e(r.content)}</pre><div class="actions">${button('copy-content','Copy contents')}${button('download','Download preview')}</div><div class="modal-actions">${button('close','Done')}</div>`,'resource',{p,r});
  }
  function openShare(p,r) {
    const link=shareLink(p,r?.id);
    showDialog(r?`Share ${M.TYPES[r.type].name}`:'Share Project',p.project,`<p class="dialog-notice">Anyone with this link can view a read-only snapshot, with a link that expires in 30 days. Individual resource versions may expire sooner. It excludes creator names, email addresses and invitations. It does not grant membership or update automatically.</p><label class="form-field" style="margin-top:20px">Snapshot link<textarea id="shareValue" class="copy-value" readonly autofocus>${e(link)}</textarea></label><p class="hint">Recipients need access to the same hosted site. A localhost address only works on this computer.</p><div class="actions">${button('copy-share','Copy link')}${navigator.share?button('native-share','Share…'):''}<a class="btn btn-ghost" href="${e(link)}" target="_blank" rel="noopener">Open snapshot</a></div><div class="modal-actions">${button('close','Done')}</div>`,'share',{p,r,link});
  }
  function inviteDialog() {
    const p=current();
    showDialog('Invite Members',`Invite someone to ${p.project}. This saves a local invitation preview; no email is sent.`,`<form id="inviteForm" class="dialog-form" novalidate><fieldset>${field('email','Invitee Email Address','email','','maxlength="254" autocomplete="off" autofocus')}<label class="form-field">Project access<select id="inviteAccess" name="access" aria-describedby="accessDescription"><option>Viewer</option><option>Editor</option></select><small id="accessDescription">Can view and copy project resources. Cannot generate resources or invite members.</small></label><p class="dialog-notice">Only the owner can invite members. Job roles such as Designer and Developer do not determine project access.</p></fieldset><div class="modal-actions">${button('close','Cancel')}<button type="submit" class="btn btn-primary">Create invitation preview</button></div></form>`,'invite',{projectId:p.id});
    $('inviteAccess').onchange=()=>{$('accessDescription').textContent=$('inviteAccess').value==='Viewer'?'Can view and copy project resources. Cannot generate resources or invite members.':'Can view, copy and generate project resources. Cannot invite members or change access.';};
    $('inviteForm').onsubmit=async ev=>{
      ev.preventDefault();if(busy)return;
      const email=$('field-email').value.trim(),access=$('inviteAccess').value;
      try {
        if(!M.validEmail(email)){applyErrors({email:'Enter a valid email address.'});return;}
        setBusy(true,'Creating preview…');await new Promise(resolve=>setTimeout(resolve,250));
        if(takeScenario('invite'))throw new Error('The invitation preview could not be saved. Your information is still here. Try again.');
        commit(next=>{const target=mutableProject(next,dialogData.projectId);target.invites.push(M.invite(target,email,access));});
        setBusy(false);close(true);render();announce(`Invitation preview created for ${email}. Status: Pending. No email was sent.`);focusSection('members');
      }catch(error){setBusy(false,'Create invitation preview');dialogError(error.message);}
    };
  }
  function previewInvite(id) {
    const p=current(), i=p.invites.find(i=>i.id===id);
    if(!i || M.inviteStatus(i)!=='pending')throw new Error('This invitation is no longer pending. Refresh Members or resend the preview.');
    showDialog('Invitation preview',`${i.email} has been invited to ${p.project}.`,`<p class="dialog-notice">Preview only. No email was sent and no real access will be granted.</p><p class="hint">Access: <strong>${e(i.access)}</strong>. ${i.access==='Viewer'?'View and copy resources.':'View, copy and generate resources.'} Expires ${e(date(i.expiresAt))}.</p><div class="modal-actions">${button('close','Close')}${button('accept-preview','Simulate acceptance','',true)}</div>`,'accept',{projectId:p.id,inviteId:id});
  }
  async function regenerate(pId,type,trigger) {
    if(busy)return;
    const p=state.projects.find(p=>p.id===pId);if(!p||!M.TYPES[type])throw new Error('Choose an available project and resource.');
    busy=true;trigger.disabled=true;const label=trigger.textContent;trigger.textContent='Generating…';
    try {
      const records=await generateResources(p,[type]);
      commit(next=>mutableProject(next,pId).resources.push(...records));
      render();announce(M.status(records[0])==='ready'?`${M.TYPES[type].name} preview generated. The previous version remains in Project Link History.`:records[0].error,M.status(records[0])!=='ready');
      if(activeId===pId)focusSection('projectHeading');else focusSection('history');
    }catch(error){announce(error.message,true);}finally{busy=false;if(trigger.isConnected){trigger.disabled=false;trigger.textContent=label;}}
  }
  async function dispatch(action, target) {
    const d=target.dataset;
    if(busy)return;
    if(shared && ['create','invite','generate','resend','accept-preview','select-project'].includes(action))throw new Error('Shared snapshots are read-only. Open your workspace to manage projects.');
    if(action==='create')createDialog();
    else if(action==='close')close();
    else if(action==='discard')close(true);
    else if(action==='keep-editing'){$('discardPrompt').hidden=true;dialog.querySelector('input,select')?.focus();}
    else if(action==='reload')location.reload();
    else if(action==='select-project'){activeId=d.project;location.hash=`project=${encodeURIComponent(activeId)}`;render();focusSection('projectHeading');}
    else if(action==='generate')await regenerate(d.project,d.type,target);
    else if(action==='copy-resource'){const {p,r}=findResource(d);await copy(shareLink(p,r.id),target);}
    else if(action==='open-resource'){const {p,r}=findResource(d);openResource(p,r);}
    else if(action==='share-resource'){const {p,r}=findResource(d);openShare(p,r);}
    else if(action==='share-project')openShare(current());
    else if(action==='copy-share')await copy(dialogData.link,target);
    else if(action==='copy-content')await copy(dialogData.r.content,target);
    else if(action==='download'){
      const r=dialogData.r;const url=URL.createObjectURL(new Blob([r.content],{type:r.type==='css'?'text/css':'application/json'}));
      const a=document.createElement('a');a.href=url;a.download=M.TYPES[r.type].file;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('dialogError').setAttribute('role','status');$('dialogError').textContent='Preview download started.';
    }
    else if(action==='native-share'){
      target.disabled=true;try{await navigator.share({title:dialogData.p.project,url:dialogData.link});$('dialogError').textContent='Snapshot shared.';}catch(err){if(err.name!=='AbortError')dialogError('Sharing was unavailable. Use Copy link instead.');}finally{target.disabled=false;}
    }
    else if(action==='invite')inviteDialog();
    else if(action==='preview-invite')previewInvite(d.invite);
    else if(action==='accept-preview'){
      commit(next=>{const p=mutableProject(next,dialogData.projectId),i=p.invites.find(i=>i.id===dialogData.inviteId);if(!i||M.inviteStatus(i)!=='pending')throw new Error('This invitation has expired or already been accepted.');i.status='accepted';i.acceptedAt=Date.now();});
      close(true);render();announce('Invitation preview accepted. No real membership or permissions were changed.');focusSection('members');
    }
    else if(action==='resend'){
      target.disabled=true;target.textContent='Resending…';
      await new Promise(resolve=>setTimeout(resolve,250));
      target.disabled=false;target.textContent='Resend preview';
      if(takeScenario('invite'))throw new Error('Resending the invitation preview failed. Try again.');
      commit(next=>{const p=mutableProject(next,activeId),i=p.invites.find(i=>i.id===d.invite);if(!i||M.inviteStatus(i)==='accepted')throw new Error('Only pending or expired invitations can be resent.');i.status='pending';i.createdAt=Date.now();i.expiresAt=Date.now()+7*M.DAY;});
      render();announce('Invitation preview renewed for 7 days. No email was sent.');focusSection('members');
    }
    else if(action==='clear-filters'){historyQuery=historyProject=historyType=historyStatus='';historySort='newest';pageSize=12;render();focusSection('history');}
    else if(action==='more-history'){pageSize+=12;historyRows();}
  }
  document.addEventListener('click',ev=>{
    const target=ev.target.closest('[data-action]');if(!target)return;
    dispatch(target.dataset.action,target).catch(err=>{if(dialog.open)dialogError(err.message);else announce(err.message,true);});
  });
  dialog.addEventListener('cancel',ev=>{ev.preventDefault();close();});
  dialog.addEventListener('input',()=>{const form=dialog.querySelector('form');if(form)form.dataset.dirty='true';});
  dialog.addEventListener('change',()=>{const form=dialog.querySelector('form');if(form)form.dataset.dirty='true';});
  dialog.addEventListener('click',ev=>{const a=ev.target.closest('a[href^="#field-"]');if(a){ev.preventDefault();document.querySelector(a.getAttribute('href'))?.focus();}});
  $('mobileMenu').onclick=()=>{const open=document.body.classList.toggle('menu-open');$('mobileMenu').setAttribute('aria-expanded',String(open));$('main').inert=open;};
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape' && !dialog.open && !document.body.classList.contains('menu-open'))$('feedback').hidden=true; if(ev.key==='Escape' && document.body.classList.contains('menu-open')){$('mobileMenu').click();$('mobileMenu').focus();}});
  document.querySelectorAll('.nav-group-label.as-toggle').forEach(toggle=>{
    const sync=()=>toggle.setAttribute('aria-expanded',String(!toggle.closest('.nav-group').classList.contains('is-collapsed')));
    sync();new MutationObserver(sync).observe(toggle.closest('.nav-group'),{attributes:true,attributeFilter:['class']});
  });
  // A notification must never cover a newly focused control.
  document.addEventListener('focusin',ev=>{const notice=$('feedback');if(notice.hidden||notice.contains(ev.target))return;const a=ev.target.getBoundingClientRect(),b=notice.getBoundingClientRect();if(a.bottom>b.top&&a.top<b.bottom&&a.right>b.left&&a.left<b.right)notice.hidden=true;});
  const navStatus=document.createElement('p');navStatus.className='nav-search-status';navStatus.setAttribute('role','status');navStatus.hidden=true;document.querySelector('.sidebar-nav').prepend(navStatus);
  $('globalSearch').addEventListener('input',()=>queueMicrotask(()=>{const query=$('globalSearch').value.trim(),count=document.querySelectorAll('.nav-link:not(.is-hidden)').length;navStatus.hidden=!query;navStatus.textContent=count?`${count} navigation results`:'No navigation matches. Try another term.';}));
  // Ensure brand-customized primary buttons retain a readable foreground.
  function updateContrast(){
    const color=getComputedStyle(document.documentElement).getPropertyValue('--red-500').trim();
    if(!/^#[0-9a-f]{6}$/i.test(color))return;
    const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
    const l=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
    document.body.style.setProperty('--action-ink',l>.179?'#000000':'#ffffff');
    $('themeToggle').setAttribute('aria-label',document.documentElement.dataset.theme==='light'?'Use dark theme':'Use light theme');
  }
  updateContrast();new MutationObserver(updateContrast).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','style']});
  function loadRoute(){
    const params=new URLSearchParams(location.hash.slice(1));
    if(params.has('share')){
      $('feedback').hidden=true;
      try{
        const encoded=params.get('share');if(encoded.length>150000)throw new Error('This snapshot link is too large. Ask the owner for a new link.');
        const parsed=M.validateSnapshot(JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(encoded),c=>c.charCodeAt(0)))));
        shared={...parsed,id:'shared',name:'',invites:[]};render();
      }catch(error){if(error instanceof SyntaxError || error.name==='InvalidCharacterError')error=new Error('This shared link is incomplete or invalid. Ask the owner for a new snapshot.');shared={id:'invalid'};$('headerCreate').hidden=true;$('prototypeTools').hidden=true;$('workspace').innerHTML=`<section class="workspace-panel"><h2>Shared project unavailable</h2><p>${e(error.message)}</p><a class="btn btn-ghost" href="overview.html">Open my workspace</a></section>`;}
      return;
    }
    if(shared){shared=null;}
    try{state=M.load(localStorage);storageError=false;$('workspaceError').hidden=true;}
    catch(error){failStorage(error);return;}
    const requested=params.get('project');
    if(requested){activeId=requested;if(!state.projects.some(p=>p.id===activeId))announce('That project is not available in this browser. Choose one of your saved projects below.',true);}
    render();
  }
  window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#project=')||location.hash.startsWith('#share=')||!location.hash)loadRoute();});
  window.addEventListener('storage',ev=>{if(ev.key===M.KEY){if(dialog.open)announce('Your workspace changed in another tab. New changes will be checked when you save.');else loadRoute();}});
  loadRoute();
})();
