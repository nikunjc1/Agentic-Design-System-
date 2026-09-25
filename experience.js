(() => {
  'use strict';
  const M = window.ADSProject;
  const file = location.pathname.split('/').pop() || 'overview.html';
  const $ = selector => document.querySelector(selector);
  const el = (tag, text, cls) => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
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
      headings.forEach((h, i) => { h.id ||= 'section-' + (i + 1); const a = el('a', h.textContent); a.href = '#' + h.id; nav.append(a); });
      const intro = main.querySelector('.page-lede') || main.querySelector('h1');
      intro?.after(nav);
    }
    if (!['new-project.html', 'settings.html'].includes(file)) {
      const notice = el('section', '', 'setup-notice');
      notice.setAttribute('aria-label', 'Your design system');
      const copy = profile ? `${profile.project} · ${profile.productType === 'Other' ? profile.productOther : profile.productType} · ${profile.platforms.map(k => M.PLATFORMS[k].label).join(', ')}` : 'What are you creating? Set up your product, role and target platforms to get a tailored design-system brief.';
      notice.append(el('p', copy));
      const actions = el('div', '', 'setup-actions');
      const setup = el('a', profile ? 'Edit setup' : 'Customize your system', 'btn btn-ghost btn-sm');
      setup.href = 'new-project.html'; actions.append(setup);
      if (profile || main.querySelector('.back-link')) {
        const detail = Boolean(main.querySelector('.back-link'));
        const a = el('a', detail ? 'Export this guide' : 'Export Markdown');
        a.href = detail ? 'md-export.html?page=' + encodeURIComponent(file) : 'md-export.html'; actions.append(a);
      }
      notice.append(actions); main.prepend(notice);
    }
    if (profile && main.querySelector('.back-link')) {
      const details = el('details', '', 'platform-guidance');
      details.append(el('summary', 'Guidance for your target platforms'));
      for (const key of profile.platforms) details.append(el('p', M.PLATFORMS[key].label + ': ' + M.PLATFORMS[key].guidance));
      main.querySelector('.page-lede')?.after(details);
    }
    requestAnimationFrame(() => {
      main.querySelectorAll('[data-detail-href]').forEach(card => {
        card.removeAttribute('role'); card.removeAttribute('tabindex');
        const link = el('a', 'Configure and view guide →', 'component-open-link');
        link.href = card.dataset.detailHref;
        card.append(link);
      });
      main.querySelectorAll('.button-matrix-wrap').forEach(region => {
        region.tabIndex = 0;
        region.setAttribute('role', 'region');
        region.setAttribute('aria-label', 'Component states. Scroll horizontally to compare all columns.');
      });
    });
    const roadmap = {
      'npm-package.html': ['Npm publishing is not connected', 'You can use this design system now by exporting its Markdown documentation. The package workflow below is a design reference.'],
      'figma.html': ['Figma connection is not available yet', 'Use the foundation editors and export a Markdown handoff for your design team.'],
      'ai-generator.html': ['Use this system with your AI tool', 'Export your product brief and component guides as Markdown, then attach the file to your AI tool with a description of the screen you want to build.'],
      'history.html': ['Release history is a design reference', 'There are no published releases in this local workspace. Export the current working draft to keep a snapshot of your setup.']
    }[file];
    if (roadmap) {
      const section = el('section', '', 'setup-notice');
      const copy = el('div'); copy.append(el('h2',roadmap[0]),el('p',roadmap[1]));
      const action = el('a','Export Markdown','btn btn-primary'); action.href = 'md-export.html';
      section.append(copy,action); main.querySelector('.page-lede')?.after(section);
    }
  }

  function setupForm() {
    const form = $('#projectSetup');
    if (!form) return;
    const status = $('#setupStatus');
    form.querySelectorAll('input:not([type=checkbox]), select').forEach(input => { input.required = true; });
    const field = key => form.elements.namedItem(key);
    const populate = (id, values) => values.forEach(value => { const o = el('option', value); o.value = value; $(id).append(o); });
    populate('#productType', M.PRODUCTS); populate('#role', M.ROLES);
    for (const [key, p] of Object.entries(M.PLATFORMS)) {
      const label = el('label', '', 'setup-option');
      const input = el('input'); input.type = 'checkbox'; input.name = 'platforms'; input.value = key;
      label.append(input, document.createTextNode(p.label)); $('#platformOptions').append(label);
    }
    let draft = null;
    try { draft = M.read(localStorage, M.DRAFT); } catch (e) { storageError = e.message; }
    const initial = draft || profile;
    if (initial) {
      for (const key of ['project', 'productType', 'productOther', 'name', 'email', 'designation', 'role', 'roleOther']) if (typeof initial[key] === 'string') field(key).value = initial[key];
      form.querySelectorAll('[name=platforms]').forEach(n => { n.checked = Array.isArray(initial.platforms) && initial.platforms.includes(n.value); });
    }
    if (storageError) status.textContent = storageError;
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
      for (const [label, value] of [['Project',p.project], ['Product',p.productType === 'Other' ? p.productOther : p.productType], ['Platforms',p.platforms.map(k => M.PLATFORMS[k].label).join(', ')], ['Name',p.name], ['Email',p.email], ['Designation',p.designation], ['Role',p.role === 'Other' ? p.roleOther : p.role]]) dl.append(el('dt',label), el('dd',value));
    }
    function validate(keys) {
      const errors = M.validate(collect());
      form.querySelectorAll('[data-error]').forEach(n => { n.textContent = ''; });
      form.querySelectorAll('[aria-invalid]').forEach(n => n.removeAttribute('aria-invalid'));
      let first = null;
      for (const key of keys) if (errors[key]) {
        form.querySelector(`[data-error="${key}"]`).textContent = errors[key];
        const input = key === 'platforms' ? form.querySelector('[name=platforms]') : field(key);
        input.setAttribute('aria-invalid','true'); first ||= input;
      }
      if (first) { status.textContent = 'Please review the highlighted fields.'; first.focus(); return false; }
      status.textContent = ''; return true;
    }
    const firstKeys = ['project','productType','productOther','platforms'];
    const secondKeys = ['name','email','designation','role','roleOther'];
    conditional();
    form.addEventListener('input', () => {
      conditional();
      try { localStorage.setItem(M.DRAFT, JSON.stringify(collect())); status.textContent = 'Draft saved on this browser.'; }
      catch { status.textContent = 'Browser storage is unavailable. Keep this page open while completing setup.'; }
    });
    $('#setupBack').addEventListener('click', () => { location.hash = 'step-' + (step - 1); });
    window.addEventListener('hashchange', () => {
      const requested = Number(location.hash.match(/^#step-([123])$/)?.[1] || 1);
      if (requested > 1 && !validate(firstKeys)) { show(1,false); history.replaceState(null,'','#step-1'); return; }
      if (requested > 2 && !validate(secondKeys)) { show(2,false); history.replaceState(null,'','#step-2'); return; }
      show(requested);
    });
    // A resumed draft starts at the first step so required fields are always reviewable.
    history.replaceState(null,'','#step-1'); show(1,false);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(step === 1 ? firstKeys : secondKeys)) return;
      if (step < 3) { location.hash = 'step-' + (step + 1); return; }
      try { profile = M.save(localStorage, collect()); }
      catch (error) { status.textContent = 'Could not save: ' + error.message + ' Your entries are still available here.'; return; }
      try { localStorage.removeItem(M.DRAFT); localStorage.setItem('ads:welcome-seen','1'); } catch {}
      form.hidden = true; $('.setup-steps').hidden = true;
      const done = $('#setupDone'); done.hidden = false;
      $('#savedProjectName').textContent = profile.project;
      const next = profile.role === 'Developer' ? ['components.html','Explore components'] : profile.role === 'Product Manager' ? ['templates.html','Explore templates'] : ['foundations.html#colors','Customize foundations'];
      $('#recommendedNext').href = next[0]; $('#recommendedNext').textContent = next[1];
      done.querySelector('h2').focus();
    });
  }

  const TOKEN_KEYS = ['colors','bg-colors','status-colors','neutral-colors','text-colors','typography','spacing','radius','border','border-states','shadow'];
  function savedTokens() {
    const values = {};
    for (const key of TOKEN_KEYS) {
      const raw = localStorage.getItem('ads:' + key);
      if (raw !== null) values[key] = JSON.parse(raw);
    }
    return values;
  }
  function exportPage() {
    const preview = $('#markdownPreview'); if (!preview) return;
    let catalog = null, busy = false;
    const status = $('#exportStatus'), download = $('#downloadMarkdown'), copy = $('#copyMarkdown');
    const selector = $('#exportScope'), identity = $('#includeIdentity');
    const requestedPage = new URLSearchParams(location.search).get('page');
    if (requestedPage && /^[a-z0-9-]+\.html$/.test(requestedPage)) {
      const option = el('option', 'Brief + the selected page guide'); option.value = 'page';
      selector.prepend(option); selector.value = 'page';
    }
    async function generate() {
      if (busy) return;
      busy = true; download.disabled = true; copy.disabled = true; selector.disabled = true; identity.disabled = true;
      status.textContent = 'Preparing your Markdown…';
      try {
        let docs = [];
        if (selector.value !== 'context') {
          if (location.protocol === 'file:') throw new Error('This scope needs the portal served over http(s):// — opening the file directly blocks loading the documentation. Run a local server (e.g. "python3 -m http.server" in this folder) and open the page from http://localhost instead, or choose "Project brief and saved foundations," which doesn\'t need it.');
          if (!catalog) {
            const response = await fetch('docs-catalog.json');
            if (!response.ok) throw new Error('Documentation could not be loaded. Retry, or choose Project brief.');
            catalog = await response.json();
          }
          docs = catalog.filter(d => selector.value === 'page' ? d.file === requestedPage : selector.value === 'all' || d.kind === 'Detail');
          if (!docs.length) throw new Error('The selected guide was not found. Choose another export scope.');
        }
        preview.value = M.markdown(profile, savedTokens(), docs, identity.checked);
        status.textContent = `${docs.length ? docs.length + ' documentation pages · ' : ''}${Math.ceil(new Blob([preview.value]).size / 1024)} KB · Current local draft. ${identity.checked ? 'Includes contact details.' : 'Contact details excluded.'}`;
        download.disabled = false; copy.disabled = false;
      } catch (error) { preview.value = ''; status.textContent = error.message; }
      finally { busy = false; selector.disabled = false; identity.disabled = false; }
    }
    $('#refreshMarkdown').addEventListener('click', generate);
    selector.addEventListener('change', generate); identity.addEventListener('change', generate);
    download.addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([preview.value], {type:'text/markdown;charset=utf-8'}));
      const a = el('a'); a.href = url; a.download = M.slug(profile?.project || 'damco') + '-design-system.md';
      document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
      status.textContent = 'Markdown download started.';
    });
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(preview.value); status.textContent = 'Markdown copied.'; }
      catch { preview.focus(); preview.select(); status.textContent = 'Copy is unavailable. The Markdown is selected; use your device’s Copy command or download the file.'; }
    });
    generate();
  }
  function settings() {
    const summary = $('#profileSummary'); if (!summary) return;
    summary.textContent = storageError || (profile ? `${profile.project} · ${profile.name} · ${profile.designation} · ${profile.role}` : 'No project setup saved yet.');
  }
  function init() { shared(); setupForm(); exportPage(); settings(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
