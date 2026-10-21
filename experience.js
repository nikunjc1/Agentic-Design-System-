(() => {
  'use strict';
  const M = window.ADSProject;
  const file = location.pathname.split('/').pop() || 'overview.html';
  const $ = selector => document.querySelector(selector);
  const el = (tag, text, cls) => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
  const downloadBackup=(text,name)=>{const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=el('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  // Foundation audit NP03 - lets the draft/profile provenance notice say
  // how stale a resumed draft is, not just that it exists.
  const relativeTime = date => {
    const mins = Math.round((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return 'moments ago';
    if (mins < 60) return mins + ' minute' + (mins === 1 ? '' : 's') + ' ago';
    const hours = Math.round(mins / 60);
    if (hours < 24) return hours + ' hour' + (hours === 1 ? '' : 's') + ' ago';
    const days = Math.round(hours / 24);
    return days + ' day' + (days === 1 ? '' : 's') + ' ago';
  };
  let profile = null, storageError = '';
  try { profile = M.read(localStorage); } catch (error) { storageError = error.message; }

  function shared() {
    const main = $('main');
    if (!main) return;
    main.id ||= 'main-content';
    main.tabIndex = -1;
    const skip = el('a', 'Skip to content', 'skip-link');
    skip.href = '#' + main.id;
    document.body.prepend(skip);
    $('.sidebar-nav')?.setAttribute('aria-label', 'Design system');
    document.querySelectorAll('.nav-link.is-active').forEach(a => a.setAttribute('aria-current', 'page'));
    document.querySelectorAll('.icon-btn[title]').forEach(b => b.setAttribute('aria-label', b.title));
    document.querySelectorAll('.panel-title').forEach(p => {
      if (p.tagName !== 'P') return;
      const heading = el('h2');
      for (const a of p.attributes) heading.setAttribute(a.name, a.value);
      heading.append(...p.childNodes);
      p.replaceWith(heading);
    });
    const headings = Array.from(main.querySelectorAll('section > h2,section > .panel-title-row > h2'));
    if (headings.length > 2) {
      const nav = el('nav', '', 'page-outline');
      nav.setAttribute('aria-label', 'On this page');
      const group=el('div','','group-btn group-btn--outlined ads-tab-group');
      group.setAttribute('aria-label','Page sections');nav.append(group);
      const links = headings.map((h, i) => {
        h.id ||= 'section-' + (i + 1);
        // Strip a leading "1. "/"10. " ordinal from the label - some
        // headings are themselves numbered content (e.g. a page walking
        // through 10 numbered principles), which reads fine as a heading
        // but doubles up oddly once it's also a short nav-strip label.
        // The heading itself is untouched, only this nav copy.
        const label = h.textContent.replace(/^\d+\.\s*/, '');
        const a = el('button', label, 'group-btn-segment group-btn-segment--h40');
        a.type='button';a.dataset.sectionTarget=h.id;
        group.append(a);
        return a;
      });
      const intro = main.querySelector(':scope > .component-meta') || main.querySelector(':scope > .page-lede') || main.querySelector(':scope > h1');
      intro?.after(nav);
      const markCurrent = index => links.forEach((link, i) => {
        if (i === index) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
        link.classList.toggle('is-selected',i===index);
        link.setAttribute('aria-pressed',String(i===index));link.tabIndex=i===index?0:-1;
      });
      const initial = links.findIndex(link => '#'+link.dataset.sectionTarget === location.hash);
      markCurrent(initial < 0 ? 0 : initial);
      links.forEach((link, i) => link.addEventListener('click', () => {
        markCurrent(i);location.hash=link.dataset.sectionTarget;headings[i].scrollIntoView({block:'start'});
      }));
      window.ADSGroupButton(group,links);
      window.addEventListener('hashchange',()=>{
        const index=links.findIndex(link=>'#'+link.dataset.sectionTarget===location.hash);
        if(index>=0) markCurrent(index);
      });
      const sections = headings.map(h => h.closest('section') || h);
      const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const i = sections.indexOf(entry.target);
          if (i === -1) return;
          markCurrent(i);
        });
      }, { root: main, rootMargin: '-15% 0px -70% 0px', threshold: 0 });
      sections.forEach(s => spy.observe(s));
    }
    // Persisted, not re-asked every page load - a visitor who intentionally
    // browses without setup was closing this exact message on every single
    // page before. Scoped to the no-profile "What are you creating?" nag
    // specifically: once a profile exists the banner switches to a useful
    // per-page context summary, not a repeated prompt, so it keeps showing
    // then - completing setup is what "resets" this preference.
    let bannerDismissed = false;
    if (!profile) { try { bannerDismissed = localStorage.getItem('ads:setup-banner-dismissed') === '1'; } catch {} }
    if (!['new-project.html', 'settings.html'].includes(file) && !bannerDismissed) {
      const notice = el('section', '', 'setup-notice setup-context');
      notice.setAttribute('aria-label', 'Your design system');
      const copy = profile ? `${profile.project} · ${profile.productType === 'Other' ? profile.productOther : profile.productType} · ${profile.platforms.map(k => M.PLATFORMS[k].label).join(', ')}` : 'What are you creating? Set up your product, role and target platforms to get a tailored design-system brief.';
      notice.append(el('p', copy));
      const actions = el('div', '', 'setup-actions');
      const setup = el('a', profile ? '' : 'Customize your system', 'btn btn-ghost btn-sm');
      if (profile) {
        setup.classList.add('setup-edit');
        setup.setAttribute('aria-label', 'Edit setup');
        setup.title = 'Edit setup';
        // Google Material Icons: image/edit (Apache 2.0, Material-Icons-LICENSE.txt).
        // Adapted with inherited color and accessible decoration attributes.
        setup.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
      }
      setup.href = 'new-project.html';
      if (!profile) actions.append(setup);
      if (profile || main.querySelector('.back-link')) {
        const detail = Boolean(main.querySelector('.back-link'));
        const a = el('a', detail ? 'Export this guide' : 'Export Markdown');
        a.href = detail ? 'md-export.html?page=' + encodeURIComponent(file) : 'md-export.html'; actions.append(a);
      }
      if (profile) actions.append(setup);
      const close = el('button', '', 'btn btn-ghost btn-sm setup-close');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close project banner');
      close.title = 'Close banner';
      // Google Material Icons: navigation/close (Apache 2.0).
      close.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
      actions.append(close);
      notice.append(actions); main.prepend(notice);
      let bannerObserver = null, dismissed = false;
      // Keep section jumps below the floating banner as its text/actions
      // wrap, fonts load, or the viewport and Foundation settings change.
      const syncBannerHeight = () => {
        if (dismissed) return;
        const height = notice.getBoundingClientRect().height;
        // A tall banner must not consume a small/zoomed viewport.
        const floating = height < main.clientHeight / 2;
        notice.dataset.floating = String(floating);
        main.style.setProperty('--setup-context-height', (floating ? height : 0) + 'px');
      };
      if (typeof ResizeObserver !== 'undefined') {
        bannerObserver = new ResizeObserver(syncBannerHeight);
        bannerObserver.observe(notice); bannerObserver.observe(main);
      } else window.addEventListener('resize', syncBannerHeight);
      close.addEventListener('click', () => {
        dismissed = true;
        if (!profile) { try { localStorage.setItem('ads:setup-banner-dismissed', '1'); } catch {} }
        if (bannerObserver) bannerObserver.disconnect();
        else window.removeEventListener('resize', syncBannerHeight);
        notice.remove();
        main.style.setProperty('--setup-context-height', '0px');
        main.focus({ preventScroll:true });
      });
      requestAnimationFrame(syncBannerHeight);
    }
    if (profile && main.querySelector('.back-link')) {
      const details = el('details', '', 'platform-guidance');
      details.append(el('summary', 'Guidance for your target platforms'));
      for (const key of profile.platforms) details.append(el('p', M.PLATFORMS[key].label + ': ' + M.PLATFORMS[key].guidance));
      (main.querySelector(':scope > .component-meta') || main.querySelector(':scope > .page-lede'))?.after(details);
    }
    requestAnimationFrame(() => {
      // One real name per card, used to tell repeated guide/copy actions
      // apart out of context (a screen reader's links/buttons list has no
      // surrounding card to disambiguate "View component guide" x N) -
      // prefers a real visible type caption (.system-card-unit, added for
      // listings with more than one card showing a near-identical demo,
      // e.g. Button's Primary vs Primary * Dual Icon), then the card's own
      // soon-to-be-removed label, then this page's one real heading.
      const pageHeading = main.querySelector('h1')?.textContent.trim();
      main.querySelectorAll('[data-detail-href]').forEach(card => {
        card.removeAttribute('role'); card.removeAttribute('tabindex');
        const dualiconLabel = card.querySelector('.dualicon-card-label');
        const cardName = card.querySelector('.system-card-unit')?.textContent.trim()
          || dualiconLabel?.textContent.trim()
          || pageHeading
          || 'component';
        // The demo already shows what the component is; the caption was
        // redundant with it, so it's removed outright rather than reordered.
        dualiconLabel?.remove();
        // Plain navigation and repeated card actions use Anchor, not Primary.
        const link = el('a', '', 'anchor-demo-link anchor-demo-link--fs14 component-open-link');
        link.href = card.dataset.detailHref;
        link.setAttribute('aria-label', 'View ' + cardName + ' guide');
        link.title = 'View ' + cardName + ' guide';
        link.innerHTML = '<svg class="anchor-demo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
        const copyRow = card.querySelector('.card-copy-row');
        if (copyRow) {
          copyRow.prepend(link);
          const copyPromptBtn = copyRow.querySelector('[data-role^="copy-prompt-"]');
          const copyCodeBtn = copyRow.querySelector('[data-role^="copy-code-"]');
          if (copyPromptBtn) copyPromptBtn.setAttribute('aria-label', 'Copy ' + cardName + ' prompt');
          if (copyCodeBtn) copyCodeBtn.setAttribute('aria-label', 'Copy ' + cardName + ' code');
        } else card.append(link);
      });
      main.querySelectorAll('.button-matrix-wrap').forEach(region => {
        region.tabIndex = 0;
        region.setAttribute('role', 'region');
        region.setAttribute('aria-label', 'Component states. Scroll horizontally to compare all columns.');
      });
    });
    const roadmap = {
      'npm-package.html': ['NPM publishing is not connected', 'You can use this design system now by exporting its Markdown documentation. The package workflow below is a design reference.'],
      'figma.html': ['Figma connection is not available yet', 'Use the foundation editors and export a Markdown handoff for your design team.'],
      'ai-generator.html': ['Use this system with your AI tool', 'Export your product brief and component guides as Markdown, then attach the file to your AI tool with a description of the screen you want to build.'],
      'history.html': ['Release history is a design reference', 'There are no published releases in this local workspace. Export the current working draft to keep a snapshot of your setup.']
    }[file];
    if (roadmap) {
      const section = el('section', '', 'setup-notice');
      const copy = el('div'); copy.append(el('h2',roadmap[0]),el('p',roadmap[1]));
      const action = el('a','Export Markdown','anchor-demo-link anchor-demo-link--fs14'); action.href = 'md-export.html';
      section.append(copy,action); main.querySelector('.page-lede')?.after(section);
    }
    // Sidebar status tags for the same unavailable/reference-only
    // destinations the roadmap object above already explains - a reader
    // deciding whether to open one shouldn't have to click through first to
    // find out it's a mockup, not a working connection (audit UX21). Short
    // enough to fit a nav list; the full explanation stays on each page.
    const navStatus = {
      'npm-package.html': 'Mockup',
      'ai-generator.html': 'Reference',
      'history.html': 'Mockup',
    };
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      const label = navStatus[link.getAttribute('href')];
      if (!label || link.querySelector('.nav-link-status')) return;
      link.append(el('span', label, 'nav-link-status'));
    });
  }

  function setupForm() {
    const form = $('#projectSetup');
    if (!form) return;
    const status = $('#setupStatus');
    const done = $('#setupDone');
    // Your name/Email/Designation are optional (see project-model.js's
    // validate() for why - no account or email service uses them), so
    // they're deliberately excluded from this blanket required=true pass.
    const OPTIONAL_FIELDS = ['name','email','designation'];
    form.querySelectorAll('input:not([type=checkbox]), select').forEach(input => { if (!OPTIONAL_FIELDS.includes(input.name)) input.required = true; });
    const field = key => form.elements.namedItem(key);
    const populate = (id, values) => values.forEach(value => { const o = el('option', value); o.value = value; $(id).append(o); });
    populate('#productType', M.PRODUCTS); populate('#role', M.ROLES);
    for (const [key, p] of Object.entries(M.PLATFORMS)) {
      const label = el('label', '', 'setup-option');
      const input = el('input'); input.type = 'checkbox'; input.name = 'platforms'; input.value = key;
      // Foundation audit NP05 - the fieldset itself carries
      // aria-describedby="error-platforms", but a screen reader focusing
      // one specific checkbox doesn't reliably re-announce the group's own
      // description on every focus - each checkbox needs its own direct
      // link to the error text, not just the group's.
      input.setAttribute('aria-describedby', 'error-platforms');
      label.append(input, document.createTextNode(p.label)); $('#platformOptions').append(label);
    }
    let draft = null;
    try { draft = M.read(localStorage, M.DRAFT); } catch (e) { storageError = e.message; }
    const initial = profile;
    // Foundation audit NP01 - this page overwrites the one existing project
    // profile, it does not create an isolated new one, and Foundation values
    // (Colors, Spacing, etc.) are shared sitewide regardless - saying so here
    // up front, not only in the sidebar's smaller print further down.
    const existingNotice = $('#existingProfileNotice');
    if (existingNotice && profile && typeof profile.project === 'string') {
      existingNotice.hidden = false;
      existingNotice.textContent = `You already have a saved project ("${profile.project}"). Continuing will replace its details - Foundation values (Colors, Spacing, Typography, etc.) are shared across this workspace and are not reset by this.`;
    }
    // Foundation audit NP03 - "A draft silently takes precedence over
    // profile... no Resume/Discard/restore-saved control or timestamp
    // exists." Only relevant when a draft AND a saved profile both exist
    // and genuinely differ - if they already match, there's nothing to
    // choose between.
    const draftNotice = $('#draftProvenanceNotice');
    let rawDraft=null;try {rawDraft=localStorage.getItem(M.DRAFT);}catch{}
    if (draftNotice && rawDraft!==null) {
      const compareKeys = ['project','productType','productOther','name','email','designation','role','roleOther','platforms'];
      const differs = !draft||!profile||compareKeys.some(k => JSON.stringify(draft[k] ?? null) !== JSON.stringify(profile[k] ?? null));
      if (differs) {
        const when = draft?.updatedAt ? new Date(draft.updatedAt) : null;
        const whenText = when && !isNaN(when) ? relativeTime(when) : 'an unknown time';
        draftNotice.replaceChildren(document.createTextNode(draft?`You have an unsaved draft from ${whenText}. Choose Resume or Discard before editing. `:'This saved draft could not be read. It has been preserved. Export a backup or discard it to continue. '));
        if(draft){const resume=el('button','Resume draft','btn btn-ghost');resume.type='button';resume.id='resumeDraftBtn';draftNotice.append(resume);}
        const discard=el('button','Discard draft','btn btn-ghost');discard.type='button';discard.id='discardDraftBtn';draftNotice.append(discard);
        const backup=el('button','Back up draft','btn btn-ghost');backup.type='button';backup.addEventListener('click',()=>downloadBackup(rawDraft,'project-draft-backup.json'));draftNotice.append(backup);
        draftNotice.hidden = false;
        $('#resumeDraftBtn')?.addEventListener('click', () => {populateSetup(draft);draftNotice.hidden = true;field('project').focus();});
        $('#discardDraftBtn').addEventListener('click', () => {
          try { localStorage.removeItem(M.DRAFT); } catch {status.textContent='Draft could not be discarded. Your saved data is unchanged.';return;}
          populateSetup(profile||{});
          draftNotice.hidden = true;
        });
      }
    }
    function populateSetup(value){for(const key of ['project','productType','productOther','name','email','designation','role','roleOther'])field(key).value=typeof value[key]==='string'?value[key]:'';form.querySelectorAll('[name=platforms]').forEach(n=>{n.checked=Array.isArray(value.platforms)&&value.platforms.includes(n.value);});conditional();}
    if (initial) populateSetup(initial);
    if (storageError) status.textContent = storageError;
    if(!profile){let rawProfile=null;try{rawProfile=localStorage.getItem(M.KEY);}catch{}
      if(rawProfile!==null){const recovery=el('div','','setup-notice');recovery.setAttribute('role','group');recovery.setAttribute('aria-label','Saved project recovery');
        const backup=el('button','Back up saved setup','btn btn-ghost');backup.type='button';backup.addEventListener('click',()=>downloadBackup(rawProfile,'project-profile-backup.json'));
        const reset=el('button','Discard unreadable setup','btn btn-ghost');reset.type='button';reset.addEventListener('click',()=>{try{localStorage.removeItem(M.KEY);recovery.remove();status.textContent='Unreadable setup discarded. Foundation settings are unchanged.';}catch{status.textContent='Could not discard setup. Your saved data is unchanged.';}});recovery.append(backup,reset);form.before(recovery);
      }
    }
    const collect = () => {
      const p = Object.fromEntries(new FormData(form));
      p.platforms = Array.from(form.querySelectorAll('[name=platforms]:checked'), n => n.value);
      for (const key in p) if (typeof p[key] === 'string') p[key] = p[key].trim();
      return p;
    };
    function conditional() {
      for (const key of ['product','role']) {
        const select = field(key === 'product' ? 'productType' : 'role');
        const other = field(key + 'Other');
        other.closest('label').hidden = select.value !== 'Other';
        other.disabled = select.value !== 'Other';
      }
    }
    let step = 1;
    function show(next, focus = true) {
      step = Math.max(1, Math.min(3, next));
      form.querySelectorAll('[data-step]').forEach(n => { n.hidden = Number(n.dataset.step) !== step; });
      document.querySelectorAll('.setup-steps li').forEach((n, i) => { if (i + 1 === step) n.setAttribute('aria-current','step'); else n.removeAttribute('aria-current'); });
      $('#setupBack').hidden = step === 1;
      $('#setupNext').textContent = step === 3 ? 'Save my design system' : 'Continue';
      if (step === 3) review();
      if (focus) { const h = form.querySelector(`[data-step="${step}"] h2`); h.tabIndex = -1; h.focus(); }
    }
    function review() {
      const p = collect(), dl = $('#setupReview'); dl.replaceChildren();
      for (const [label, value] of [['Project',p.project], ['Product',p.productType === 'Other' ? p.productOther : p.productType], ['Platforms',p.platforms.map(k => M.PLATFORMS[k].label).join(', ')], ['Name',p.name || 'Not provided'], ['Email',p.email || 'Not provided'], ['Designation',p.designation || 'Not provided'], ['Role',p.role === 'Other' ? p.roleOther : p.role]]) dl.append(el('dt',label), el('dd',value));
      let changes=$('#setupFoundationChanges');if(!changes){changes=el('section','','setup-foundation-changes');changes.id='setupFoundationChanges';dl.after(changes);}changes.replaceChildren(el('h3','Foundation recommendations'));
      changes.append(el('p','Saved overrides are retained. Unsaved Foundations inherit the revised project recommendation. Review the before/after values below; customize each Foundation from its own editor.'));
      const F=window.ADSFoundationModel,table=el('table'),head=el('thead'),body=el('tbody'),tr=el('tr');
      for(const label of ['Foundation','Previous recommendation','New recommendation','Applied choice']){const cell=el('th',label);cell.scope='col';tr.append(cell);}head.append(tr);
      for(const [key,label]of [['spacing','Spacing'],['radius','Radius'],['grid-layout','Grid & Layout']]){
        const row=el('tr'),saved=window.ADSStorage.safeGet('ads:'+key),previous=F.contextualDefault(key,profile),next=F.contextualDefault(key,p);
        row.append(el('td',label),el('td',previous?JSON.stringify(previous):'System default'),el('td',next?JSON.stringify(next):'System default'),el('td',saved?'Saved override retained: '+JSON.stringify(saved):'Inherited recommendation'));body.append(row);
      }table.append(head,body);changes.append(table);
    }
    // Foundation audit NP05 - "add a summary" of what actually needs fixing,
    // not just a generic "highlighted fields" pointer.
    const FIELD_LABELS = { project: 'Project name', productType: 'Product type', productOther: 'Product description', platforms: 'Platforms', name: 'Your name', email: 'Email ID', designation: 'Designation', role: 'Your role', roleOther: 'Role description' };
    function validate(keys) {
      const errors = M.validate(collect());
      form.querySelectorAll('[data-error]').forEach(n => { n.textContent = ''; });
      form.querySelectorAll('[aria-invalid]').forEach(n => n.removeAttribute('aria-invalid'));
      let first = null;
      const invalidLabels = [];
      for (const key of keys) if (errors[key]) {
        form.querySelector(`[data-error="${key}"]`).textContent = errors[key];
        const input = key === 'platforms' ? form.querySelector('[name=platforms]') : field(key);
        input.setAttribute('aria-invalid','true'); first ||= input;
        invalidLabels.push(FIELD_LABELS[key] || key);
      }
      if (first) { status.textContent = `Please review: ${invalidLabels.join(', ')}.`; first.focus(); return false; }
      status.textContent = ''; return true;
    }
    const firstKeys = ['project','productType','productOther','platforms'];
    const secondKeys = ['name','email','designation','role','roleOther'];
    conditional();
    // Foundation audit NP05 - "draft-save messages replace error status
    // while typing": this used to write to the same #setupStatus element
    // validate() uses, so correcting one invalid field immediately wiped
    // out the "please review" guidance for every other still-invalid field
    // the moment any input event fired. A separate element for save
    // feedback keeps validation guidance on screen until it's actually
    // resolved by a real validate() pass, not merely overwritten by typing.
    const draftStatus = $('#draftSaveStatus');
    form.addEventListener('input', () => {
      conditional();
      if(draftNotice&&!draftNotice.hidden){draftStatus.textContent='Choose Resume or Discard to preserve the existing draft before saving new edits.';return;}
      // Foundation audit NP03 - a timestamp here is what lets the
      // draft/profile provenance notice below say how stale a resumed
      // draft actually is, instead of just that one exists.
      try { localStorage.setItem(M.DRAFT, JSON.stringify({...collect(),version:1,updatedAt:new Date().toISOString()})); draftStatus.textContent = 'Draft saved on this browser.'; }
      catch { draftStatus.textContent = 'Browser storage is unavailable. Keep this page open while completing setup.'; }
    });
    $('#setupBack').addEventListener('click', () => { location.hash = 'step-' + (step - 1); });
    window.addEventListener('hashchange', () => {
      // Back/forward after a completed save used to leave the success
      // screen visible while the step indicator above it silently moved -
      // two different states on screen at once. Treat any step hash as a
      // real request to resume editing: the field values are all still
      // sitting in the (merely hidden) form, so this is a genuine re-show,
      // not a reset.
      if (!done.hidden) { done.hidden = true; form.hidden = false; $('.setup-steps').hidden = false; }
      const requested = Number(location.hash.match(/^#step-([123])$/)?.[1] || 1);
      if (requested > 1 && !validate(firstKeys)) { show(1,false); history.replaceState(null,'','#step-1'); return; }
      if (requested > 2 && !validate(secondKeys)) { show(2,false); history.replaceState(null,'','#step-2'); return; }
      show(requested);
    });
    // A resumed draft starts at the first step so required fields are always reviewable.
    const requestedStep=Number(location.hash.match(/^#step-([123])$/)?.[1]||1);
    const initialStep=requestedStep>1&&!Object.keys(M.validate(collect())).some(k=>firstKeys.includes(k))?(requestedStep===3&&!Object.keys(M.validate(collect())).some(k=>secondKeys.includes(k))?3:2):1;
    history.replaceState(null,'','#step-'+initialStep); show(initialStep,false);
    // Every role beyond the 2 that already routed somewhere real now also
    // gets its own concrete first task, pointed at a page that genuinely
    // answers it (the release contract/known-gaps sections added to
    // accessibility.html are real content, not invented for this).
    const ROLE_NEXT = {
      'Developer': ['components.html', 'Explore components', 'Compare a component’s Machine View against its saved Foundation tokens before wiring it up - names and values should match exactly.'],
      'Product Manager': ['templates.html', 'Explore templates', 'Check Grid & Layout’s Breakpoints tab for what "responsive" concretely means in this system before writing it into a requirement.'],
      'Design System Lead': ['accessibility.html', 'Review the release contract', 'Read the Foundation release contract (Accessibility page) for this system’s compatibility and deprecation rules before changing any token.'],
      'QA / Accessibility': ['accessibility.html', 'Review known gaps', 'Start with the Accessibility guide’s "Known gaps - not yet done" section - these are the areas still needing verification.'],
      'Designer': ['foundations.html#colors', 'Customize foundations', 'Start with Colors and Typography, then review the independent Grid, Spacing, Radius and interaction contracts before designing components.']
    };
    const DEFAULT_NEXT = ['foundations.html#colors', 'Customize foundations', 'Explore the Foundation pages and customize what applies to your product - every value stays editable afterward.'];
    // Informational readiness, not a gate - every Foundation page already
    // lets Save/export happen at any completion state, and this list
    // follows that same rule rather than inventing a new blocking one.
    const FOUNDATION_SECTIONS = [['colors','Colors'], ['grid-layout','Grid & Layout'], ['typography','Typography'], ['spacing','Spacing'], ['radius','Radius'], ['borders','Borders'], ['shadows','Shadows'], ['icons','Icons'],['ai','AI & Agents']];
    function renderReadiness() {
      const list = $('#foundationReadiness'); if (!list) return;
      list.replaceChildren();
      FOUNDATION_SECTIONS.forEach(([key, label]) => {
        const records=(FOUNDATION_TOKEN_MAP[key]||[]).map(tokenKey=>{try{return window.ADSFoundationModel.inspectRecord(tokenKey,localStorage.getItem('ads:'+tokenKey));}catch{return {status:'unavailable'};}});
        const invalid=records.some(r=>['invalid','corrupt','future','unavailable'].includes(r.status));
        const configured=!invalid&&records.some(r=>['valid','migrated'].includes(r.status));
        const li = el('li'); li.dataset.done = String(configured);
        const link=el('a',label);link.href=key==='colors'?'foundations.html':key==='ai'?'ai-foundation.html':key+'.html';
        li.append(el('span','','readiness-dot'),link,document.createTextNode(' – ' + (invalid?'Needs recovery':key==='ai'?'Documented examples; no live agent':configured?'Valid saved settings; acceptance not verified':'Resolved default; acceptance not verified')));
        list.append(li);
      });
    }
    form.addEventListener('submit', e => {
      e.preventDefault();
      if(draftNotice&&!draftNotice.hidden){status.textContent='Resume or discard the existing draft before continuing.';draftNotice.querySelector('button')?.focus();return;}
      if (step < 3) {
        if (!validate(step === 1 ? firstKeys : secondKeys)) return;
        location.hash = 'step-' + (step + 1); return;
      }
      // Final submit re-checks BOTH steps' keys, not just this step's own
      // (secondKeys) - reaching step 3 only proves firstKeys passed at
      // whatever earlier moment the hash first advanced past step 1, not
      // that it still does now. M.save() would catch a stale firstKeys
      // failure anyway (it validates everything), but only this routes
      // the user back to the actual invalid step instead of a generic
      // "Could not save" message pointing at nothing on screen.
      if (!validate(firstKeys)) { location.hash = 'step-1'; return; }
      if (!validate(secondKeys)) { location.hash = 'step-2'; return; }
      try { profile = M.save(localStorage, collect()); }
      catch (error) { status.textContent = 'Could not save: ' + error.message + ' Your entries are still available here.'; return; }
      window.ADSFoundation.apply();
      try { localStorage.removeItem(M.DRAFT); localStorage.setItem('ads:welcome-seen','1'); } catch {}
      form.hidden = true; $('.setup-steps').hidden = true;
      done.hidden = false;
      $('#savedProjectName').textContent = profile.project;
      const [href, label, task] = ROLE_NEXT[profile.role] || DEFAULT_NEXT;
      $('#recommendedNext').href = href; $('#recommendedNext').textContent = label;
      $('#roleTaskText').textContent = task;
      renderReadiness();
      done.querySelector('h2').focus();
    });
  }

  const TOKEN_KEYS = ['colors','bg-colors','status-colors','neutral-colors','typography','spacing','radius','border','border-states','shadow','grid-layout','icons','sizing','units','data-format'];
  // Maps each Foundations sidebar tab to the token key(s) its editor saves
  // under - Colors alone covers 4 keys (its own light-mode value plus the
  // other 3 themed Foundations panels; Text colors was removed as its own
  // editable section - Typography's per-level colors are the one place
  // for text color now), the rest are 1:1 except Borders (border
  // + its separate border-states values).
  const FOUNDATION_TOKEN_MAP = {
    colors: ['colors','bg-colors','status-colors','neutral-colors'],
    'grid-layout': ['grid-layout'],
    typography: ['typography'],
    spacing: ['spacing'],
    radius: ['radius'],
    borders: ['border','border-states'],
    shadows: ['shadow'],
    icons: ['icons'],
    'data-format': ['data-format'],
    sizing: ['sizing'],
    units: ['units'],
  };
  // Applied settings and resolved snapshots come from the shared resolver.
  function savedTokens(allowedKeys = TOKEN_KEYS, profile = null) {
    const values = {};
    for (const key of allowedKeys) {
      // A saved record always wins if one exists, even a partial-looking
      // one - this is still the real, current state of that page, not a
      // fallback candidate. Only a genuinely untouched key (never saved
      // at all), or one that came back corrupt (Foundation audit X06 -
      // window.ADSStorage.safeGet returns null rather than throwing, so one
      // bad record can't crash the whole export), resolves to the project's
      // own contextual recommendation, or the plain documented default.
      const saved = window.ADSStorage.safeGet('ads:' + key);
      // Null means no durable override. The full resolved snapshots below
      // carry effective defaults; editor seed recipes must not masquerade
      // as settings actually applied to the page.
      values[key] = window.ADSFoundation.read(key);
    }
    // Excluded saved sections must not re-enter through resolved snapshots.
    const selectedSettings={...values};
    values.resolvedFoundation=window.ADSFoundationModel.resolve(selectedSettings,document.documentElement.dataset.theme,profile);
    values.resolvedThemes = Object.fromEntries(['light','dark'].map(theme=>[theme,window.ADSFoundationModel.resolve(selectedSettings,theme,profile)]));
    values.platformProfiles=window.ADSFoundationModel.resolvePlatformProfiles(selectedSettings,profile);
    values.verification={...window.ADSFoundation.getVerification(),unsavedPreviewKeys:window.ADSFoundation.getVerification().unsavedPreviewKeys.filter(key=>allowedKeys.includes(key.replace(/^ads:/,'')))};
    values.selection={savedSections:allowedKeys,unselectedSections:'Library defaults in resolved dependencies; saved customizations excluded.'};
    return values;
  }
  // docs-catalog.js has no literal "category" field - every component
  // Detail doc's own markdown starts with the same breadcrumb its real
  // page shows ("Components · Forms · Add-on"), so the category is
  // parsed from that instead of changing the generated catalog file.
  // Listing/Tab-kind docs don't have this breadcrumb at all and return
  // null, which callers treat as "not a component, don't filter it."
  const COMPONENT_CATEGORY_PATTERN = /^Components · ([^·\n]+) · /;
  function docCategory(doc) {
    const m = COMPONENT_CATEGORY_PATTERN.exec(doc.markdown);
    return m ? m[1].trim() : null;
  }
  const CATEGORY_ORDER = ['Actions', 'Forms', 'Navigation', 'Feedback', 'Data Display'];
  // Every category's catalog docs match its real listing screen (a
  // .system-card grid with a "View component guide" CTA) 1:1, except
  // Actions. Button has 8 style-variant pages crawled into the catalog,
  // but components.html's own Button section only ever shows 2 cards -
  // data-system="primary" -> button-primary.html and
  // data-system="primary-icon" -> button-primary-icon.html - so those
  // are Button's real two options, relabeled here to match what the
  // card itself is called rather than the catalog's generic doc title.
  const COMPONENT_GROUPS = {
    Actions: [
      { label: 'Primary', match: file => file === 'button-primary.html' },
      { label: 'Primary Icon', match: file => file === 'button-primary-icon.html' },
    ],
  };
  // The other 6 button-*.html files (ghost, link, neutral, secondary,
  // tertiary, destructive) are real, full pages, not stubs - but none of
  // them has a listing-screen card anywhere. Two (ghost, link) have zero
  // inbound links on the whole site; the other four are linked only from
  // guidelines.html's own reference table, a documentation page, not a
  // listing screen. Excluded from this picker for the same reason the
  // other 8-Button-items weren't offered individually: nothing here
  // should be selectable that a user can't actually reach from a real
  // listing screen.
  const EXCLUDED_FILES = new Set([
    'button-ghost.html', 'button-link.html', 'button-neutral.html',
    'button-secondary.html', 'button-tertiary.html', 'button-destructive.html',
  ]);
  // One collapsed <details> per category, built from the catalog itself
  // (not hand-written) so this can't drift out of sync with it - each
  // summary carries its own "select whole category" checkbox next to the
  // native disclosure triangle, and individual per-component checkboxes
  // sit inside, letting the user pick components one at a time instead of
  // only ever including or excluding a whole category.
  function buildComponentCategoryGroups(container, onChange) {
    const byCategory = new Map(CATEGORY_ORDER.map(c => [c, []]));
    for (const doc of window.ADSDocsCatalog || []) {
      const cat = docCategory(doc);
      if (cat && byCategory.has(cat)) byCategory.get(cat).push(doc);
    }
    const componentChecks = [];
    for (const [category, docs] of byCategory) {
      if (!docs.length) continue;
      // Collapse any defined groups (e.g. Button's 2 real options) into
      // one item each; every doc not claimed by a group and not excluded
      // stays its own item, which is every doc in every category except
      // Actions.
      const claimed = new Set();
      const items = (COMPONENT_GROUPS[category] || []).map(group => {
        const files = docs.filter(d => group.match(d.file)).map(d => d.file);
        files.forEach(f => claimed.add(f));
        return { label: group.label, files };
      }).filter(item => item.files.length);
      for (const doc of docs) if (!claimed.has(doc.file) && !EXCLUDED_FILES.has(doc.file)) items.push({ label: doc.title, files: [doc.file] });

      const details = el('details', '', 'export-category-details');
      const summary = el('summary', '', 'export-category-summary');
      const selectAllLabel = el('label', '', 'setup-option');
      const selectAll = el('input'); selectAll.type = 'checkbox'; selectAll.checked = true;
      selectAllLabel.append(selectAll, document.createTextNode(category));
      // display:flex on <summary> (needed to lay the checkbox, label and
      // count out in a row) overrides the browser's default
      // display:list-item rendering a <summary> normally gets - that's
      // what draws the native disclosure triangle, so flex silently
      // removes it. Same .chev SVG the sidebar's own collapsible group
      // toggles use, rotated the same way (pointing right collapsed,
      // down open), instead of trying to recover the native marker.
      const chev = el('span', '', 'chev');
      chev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
      summary.append(selectAllLabel, el('span', `(${items.length})`, 'export-category-count'), chev);
      details.append(summary);
      const options = el('div', '', 'export-category-options');
      const checks = items.map(item => {
        const label = el('label', '', 'export-component-option');
        const input = el('input'); input.type = 'checkbox'; input.className = 'export-component-check';
        input.dataset.files = JSON.stringify(item.files); input.checked = true;
        label.append(input, document.createTextNode(item.label));
        options.append(label);
        componentChecks.push(input);
        return input;
      });
      details.append(options);
      container.append(details);
      const syncSelectAll = () => {
        const checkedCount = checks.filter(c => c.checked).length;
        selectAll.checked = checkedCount === checks.length;
        selectAll.indeterminate = checkedCount > 0 && checkedCount < checks.length;
      };
      selectAll.addEventListener('click', (e) => e.stopPropagation());
      selectAll.addEventListener('change', () => { checks.forEach(c => c.checked = selectAll.checked); onChange(); });
      checks.forEach(c => c.addEventListener('change', () => { syncSelectAll(); onChange(); }));
    }
    return componentChecks;
  }
  function exportPage() {
    const preview = $('#markdownPreview'); if (!preview) return;
    let busy = false;
    const status = $('#exportStatus'), download = $('#downloadMarkdown'), copy = $('#copyMarkdown');
    const selector = $('#exportScope'), identity = $('#includeIdentity');
    const foundationChecks = Array.from(document.querySelectorAll('.export-foundation-check'));
    const componentChecks = buildComponentCategoryGroups($('#exportComponentGroups'), () => generate());
    const requestedPage = new URLSearchParams(location.search).get('page');
    if (requestedPage && /^[a-z0-9-]+\.html$/.test(requestedPage)) {
      const option = el('option', 'Brief + the selected page guide'); option.value = 'page';
      selector.prepend(option); selector.value = 'page';
    }
    async function generate() {
      if (busy) return;
      busy = true; download.disabled = true; copy.disabled = true; selector.disabled = true; identity.disabled = true;
      foundationChecks.forEach(c => c.disabled = true); componentChecks.forEach(c => c.disabled = true);
      status.textContent = 'Preparing your Markdown…';
      try {
        profile=M.read(localStorage);
        let docs = [];
        if (selector.value !== 'context') {
          // Loaded from docs-catalog.js (a plain <script src>, evaluated
          // before this file - see its own script tag in each page's HTML)
          // rather than fetched, specifically so this works when the portal
          // is opened directly as a file:// page and not just over
          // http(s):// - fetch() is blocked against local files by every
          // browser, but a <script> tag isn't subject to that restriction.
          if (!Array.isArray(window.ADSDocsCatalog)) throw new Error('Documentation catalog is unavailable. Retry, or choose "Project brief and saved foundations."');
          docs = window.ADSDocsCatalog.filter(d => selector.value === 'page' ? d.file === requestedPage : selector.value === 'all' || d.kind === 'Detail');
          if (!docs.length) throw new Error('The selected guide was not found. Choose another export scope.');
          // Component selection only narrows component guides - a doc with
          // no parseable category (a Listing/Tab page, included only under
          // the "all" scope) isn't a component and always passes through,
          // so clearing every component checkbox can't silently drop
          // unrelated documentation the user didn't ask to exclude.
          const allowedFiles = new Set(componentChecks.filter(c => c.checked).flatMap(c => JSON.parse(c.dataset.files)));
          if(selector.value !== 'page') docs = docs.filter(d => docCategory(d) === null || allowedFiles.has(d.file));
        }
        // Each checkbox picks a whole Foundations tab (e.g. "colors" also
        // pulls in the bg/status/neutral/text theme-pair values saved
        // under that tab - see FOUNDATION_TOKEN_MAP) rather than one
        // storage key, so the selection matches what the user actually
        // sees as one unit in the Foundations sidebar.
        const allowedKeys = foundationChecks.filter(c => c.checked).flatMap(c => FOUNDATION_TOKEN_MAP[c.value] || []);
        const tokens = savedTokens(allowedKeys, profile);
        const defaultedKeys = allowedKeys.filter(key => !window.ADSFoundation.read(key));
        preview.value = M.markdown(profile, tokens, docs, identity.checked, defaultedKeys);
        const includedCount = foundationChecks.filter(c => c.checked).length;
        const foundationSummary = foundationChecks.length ? `${includedCount}/${foundationChecks.length} foundation sections · ` : '';
        const includedComponentCount = docs.filter(d=>docCategory(d)!==null).length;
        const componentSummary = selector.value !== 'context' ? `${includedComponentCount} component guides · ` : '';
        status.textContent = `${foundationSummary}${componentSummary}${docs.length ? docs.length + ' documentation pages · ' : ''}${Math.ceil(new Blob([preview.value]).size / 1024)} KB · Current local draft. ${identity.checked ? 'Includes contact details.' : 'Contact details excluded.'}`;
        download.disabled = false; copy.disabled = false;
      } catch (error) { preview.value = ''; status.textContent = error.message; }
      finally {
        busy = false; selector.disabled = false; identity.disabled = false;
        foundationChecks.forEach(c => c.disabled = false); componentChecks.forEach(c => c.disabled = false);
        const showComponents=['all','components'].includes(selector.value);
        $('#exportComponentGroups').hidden=!showComponents;
        $('#exportComponentGroups').previousElementSibling?.toggleAttribute('hidden',!showComponents);
      }
    }
    $('#refreshMarkdown').addEventListener('click', generate);
    selector.addEventListener('change', generate); identity.addEventListener('change', generate);
    foundationChecks.forEach(c => c.addEventListener('change', generate));
    download.addEventListener('click', async () => {
      await generate();if(download.disabled)return;
      const url = URL.createObjectURL(new Blob([preview.value], {type:'text/markdown;charset=utf-8'}));
      const a = el('a'); a.href = url; a.download = M.slug(profile?.project || 'damco') + '-design-system.md';
      document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
      status.textContent = 'Markdown download started.';
    });
    copy.addEventListener('click', async () => {
      await generate();if(copy.disabled)return;
      try { await window.ADSClipboard.copy(preview.value); status.textContent = 'Markdown copied.'; }
      catch { preview.focus(); preview.select(); status.textContent = 'Copy is unavailable. The Markdown is selected; use your device’s Copy command or download the file.'; }
    });
    window.addEventListener('storage',event=>{
      if(event.key===null||event.key===M.KEY||TOKEN_KEYS.some(key=>event.key==='ads:'+key))generate();
    });
    generate();
  }
  function settings() {
    const summary = $('#profileSummary'); if (!summary) return;
    // name/designation are optional (see project-model.js's validate()) -
    // joined with filter(Boolean) so a blank one collapses away instead of
    // leaving a stray " · · " gap.
    const refreshSummary=()=>{
      try {profile=M.read(localStorage);storageError='';}catch(error){profile=null;storageError=error.message;}
      summary.textContent = storageError || (profile ? [profile.project, profile.name, profile.designation, profile.role].filter(Boolean).join(' · ') : 'No project setup saved yet.');
    };
    summary.setAttribute('role','status');refreshSummary();
    window.addEventListener('storage',event=>{if(event.key===null||event.key===M.KEY)refreshSummary();});
  }
  // Machine View schema contract (systemwide, every page's Machine View -
  // static auto-generated ones below and every page-specific dynamic one
  // in foundations.js/grid-layout.js/spacing.js/radius.js/typography.js/
  // borders.js/shadows.js/icons.js): every object's first key is always
  // $schema, a version string ("ads.machine-view.v1") that changes only
  // on a breaking shape change to that page's own fields - a consumer
  // (AI agent or script) can branch on it instead of guessing the shape.
  // Null policy: a key is only ever present when its value is known: an
  // unset/not-yet-chosen value omits the key entirely rather than writing
  // null, so `"foo" in data` is itself the "is this configured" check.
  // Allowed shapes: a static reference page emits {items:[...]} and/or
  // {stats:[...]} (below); a dynamic page defines its own fields beyond
  // $schema (documented at its own call site), never both patterns mixed
  // in one object.
  const MACHINE_VIEW_SCHEMA = 'ads.machine-view.v1';
  // Exposed so every page-specific dynamic generator (foundations.js,
  // grid-layout.js, spacing.js, radius.js, typography.js, borders.js,
  // shadows.js, icons.js) stamps the exact same version string instead of
  // each hardcoding its own copy that could silently drift out of sync.
  window.ADS_MACHINE_VIEW_SCHEMA = MACHINE_VIEW_SCHEMA;
  // Machine View for a reference-only .component-guide section (a static
  // usage-hierarchy table or stat grid, not live user input) - derived
  // straight from its own Human View markup so no per-page JS is needed.
  // A page that DOES need live/custom JSON marks its <code> with a
  // data-role (see foundations.js, grid-layout.js) and is skipped here.
  function autoMachineViews() {
    document.querySelectorAll('.component-guide').forEach(guide => {
      const code = guide.querySelector('.guide-view-panel[data-view-panel="machine"] pre.guide-machine-json code');
      if (!code || code.hasAttribute('data-role')) return;
      if (code.textContent.trim() !== '{}') return;
      const human = guide.querySelector('.guide-view-panel[data-view-panel="human"]');
      if (!human) return;
      const data = { $schema: MACHINE_VIEW_SCHEMA };
      const rows = human.querySelectorAll('.usage-row');
      if (rows.length) {
        data.items = Array.from(rows).map(row => {
          const label = row.querySelector('.usage-label');
          const values = row.querySelector('.usage-values');
          const desc = row.querySelector('.usage-desc');
          const obj = {};
          if (label) obj.label = label.textContent.trim();
          if (values) obj.values = values.textContent.trim();
          if (desc) obj.description = desc.textContent.trim();
          return obj;
        });
      }
      const tiles = human.querySelectorAll('.stat-tile');
      if (tiles.length) {
        data.stats = Array.from(tiles).map(tile => {
          const label = tile.querySelector('.stat-label');
          const value = tile.querySelector('.stat-value');
          const obj = {};
          if (label) obj.label = label.textContent.trim();
          if (value) obj.value = value.textContent.trim();
          return obj;
        });
      }
      if (!data.items && !data.stats) return;
      code.textContent = JSON.stringify(data, null, 2);
    });
  }
  // Same "Copy Markdown" pattern added to every Foundations page, applied
  // here to plain reference/documentation pages (Design Principles,
  // Component Guidelines, Copywriting, Data Format, Accessibility) that
  // have no editable state of their own to snapshot - so instead of a
  // data snapshot, this exports the page's own actual content as
  // Markdown, mirroring the exact heading/paragraph/list-item conversion
  // tools/audit_pages.py already uses to build docs-catalog.js (the
  // source the sitewide Markdown Export page's own per-page export draws from),
  // just run client-side against the live DOM instead of raw HTML source
  // - so a local button gives the same result without loading that
  // 500KB+ sitewide catalog file just to read one page's own entry. Only
  // activates on a page that actually has the button + output element.
  function initPageMarkdownExport() {
    const output = $('[data-role="page-markdown-output"]');
    const copyBtn = $('#copyPageMarkdownBtn');
    const main = $('main');
    if (!output || !copyBtn || !main) return;

    const SKIP_TAGS = new Set(['script', 'style', 'button']);
    const BLOCK_TAGS = new Set(['p', 'section', 'div', 'pre', 'br']);

    function extract(root) {
      const parts = [];
      function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) { parts.push(node.textContent); return; }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const tag = node.tagName.toLowerCase();
        if (SKIP_TAGS.has(tag)) return;
        if (node.classList && (node.classList.contains('md-export-panel') || node.classList.contains('page-outline') || node.classList.contains('setup-notice'))) return;
        if (/^h[1-3]$/.test(tag)) parts.push('\n\n' + '#'.repeat(Number(tag[1])) + ' ');
        else if (tag === 'li') parts.push('\n- ');
        else if (BLOCK_TAGS.has(tag)) parts.push('\n');
        node.childNodes.forEach(walk);
      }
      walk(root);
      return parts.join('')
        .replace(/[ \t]+/g, ' ')
        .replace(/ *\n */g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }

    function refreshMarkdown() {
      let text = extract(main);
      if (location.pathname.endsWith('data-format.html')) text += '\n\n## Current Data Format configuration\n\n```json\n' + JSON.stringify(window.ADSFoundation.get().dataFormat, null, 2) + '\n```';
      text = window.ADSFoundation.preparePageMarkdown(text);
      if (output.textContent !== text) output.textContent = text;
    }
    refreshMarkdown();
    window.addEventListener('ads:foundation-applied', refreshMarkdown);

    copyBtn.addEventListener('click', () => {
      window.ADSFoundation.apply();refreshMarkdown();
      const status = $('#pageMarkdownStatus');
      const done = () => { status.textContent = 'Copied to clipboard'; setTimeout(() => { status.textContent = ''; }, 2500); };
      window.ADSClipboard.copy(output.textContent).then(done).catch(() => {
          status.textContent = 'Copy failed - select the text above and copy manually.';
      });
    });
  }
  // Self-positioning tooltip, shared by every icon-only control sitewide
  // (the view-guide icon on every listing card, plus any icon-only Button
  // demo using the same convention) - one floating element, shown and
  // positioned on demand. Placement (top/bottom/left/right) is chosen
  // per-hover from whichever side has room in the current viewport, with a
  // "prefer this order, else pick whichever has the most space" fallback,
  // and edges are clamped so the tooltip never renders off-screen.
  function smartTooltips() {
    const selector = '.btn-demo.is-icon-only[aria-label], .component-open-link[aria-label]';
    const gap = 8, edgePadding = 8, placementOrder = ['top', 'bottom', 'right', 'left'];
    const tip = el('div', '', 'dynamic-tooltip');
    tip.setAttribute('role', 'tooltip');
    document.body.append(tip);
    let activeAnchor = null;

    function place(anchor) {
      const text = anchor.getAttribute('aria-label');
      if (!text) return hide();
      tip.textContent = text;
      tip.classList.add('is-visible');
      const anchorRect = anchor.getBoundingClientRect();
      const tipRect = tip.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight;
      const space = { top: anchorRect.top, bottom: vh - anchorRect.bottom, left: anchorRect.left, right: vw - anchorRect.right };
      const fits = { top: space.top >= tipRect.height + gap, bottom: space.bottom >= tipRect.height + gap, left: space.left >= tipRect.width + gap, right: space.right >= tipRect.width + gap };
      let placement = placementOrder.find(side => fits[side]);
      if (!placement) placement = [...placementOrder].sort((a, b) => space[b] - space[a])[0];
      let top, left;
      if (placement === 'top' || placement === 'bottom') {
        top = placement === 'top' ? anchorRect.top - tipRect.height - gap : anchorRect.bottom + gap;
        left = anchorRect.left + anchorRect.width / 2 - tipRect.width / 2;
        left = Math.max(edgePadding, Math.min(left, vw - tipRect.width - edgePadding));
      } else {
        left = placement === 'left' ? anchorRect.left - tipRect.width - gap : anchorRect.right + gap;
        top = anchorRect.top + anchorRect.height / 2 - tipRect.height / 2;
        top = Math.max(edgePadding, Math.min(top, vh - tipRect.height - edgePadding));
      }
      tip.setAttribute('data-placement', placement);
      tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    }
    function hide() { tip.classList.remove('is-visible'); tip.removeAttribute('data-placement'); activeAnchor = null; }
    function findAnchor(target) { return target && typeof target.closest === 'function' ? target.closest(selector) : null; }

    document.addEventListener('mouseover', e => { const a = findAnchor(e.target); if (a) { activeAnchor = a; place(a); } });
    document.addEventListener('mouseout', e => { const a = findAnchor(e.target); if (a && a === activeAnchor) hide(); });
    document.addEventListener('focusin', e => { const a = findAnchor(e.target); if (a) { activeAnchor = a; place(a); } });
    document.addEventListener('focusout', e => { const a = findAnchor(e.target); if (a && a === activeAnchor) hide(); });
    window.addEventListener('scroll', () => { if (activeAnchor) place(activeAnchor); }, true);
    window.addEventListener('resize', () => { if (activeAnchor) place(activeAnchor); });
  }
  function init() { shared(); setupForm(); exportPage(); settings(); autoMachineViews(); initPageMarkdownExport(); smartTooltips(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
