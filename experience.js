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
      // Styled as a real Group Button (segmented control), not just links
      // that look like one - .is-selected tracks whichever section is
      // actually in view (IntersectionObserver below), the same "exactly
      // one segment selected at a time" behavior the component always has.
      const links = headings.map((h, i) => {
        h.id ||= 'section-' + (i + 1);
        // Strip a leading "1. "/"10. " ordinal from the label - some
        // headings are themselves numbered content (e.g. a page walking
        // through 10 numbered principles), which reads fine as a heading
        // but doubles up oddly once it's also a short nav-strip label.
        // The heading itself is untouched, only this nav copy.
        const label = h.textContent.replace(/^\d+\.\s*/, '');
        const a = el('a', label, 'group-btn-segment group-btn-segment--h36');
        a.href = '#' + h.id;
        nav.append(a);
        return a;
      });
      const intro = main.querySelector('.page-lede') || main.querySelector('h1');
      intro?.after(nav);
      links[0]?.classList.add('is-selected');
      const sections = headings.map(h => h.closest('section') || h);
      const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const i = sections.indexOf(entry.target);
          if (i === -1) return;
          links.forEach(l => l.classList.remove('is-selected'));
          links[i].classList.add('is-selected');
        });
      }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
      sections.forEach(s => spy.observe(s));
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
        // Real Button classes, not a one-off style - this is the card's
        // actual primary action (the whole card already navigates here on
        // click), so it gets the same .btn-primary treatment as any other
        // primary CTA, placed before the secondary Copy prompt/Copy code
        // utility actions rather than after them.
        const link = el('a', 'View component guide', 'btn btn-primary component-open-link');
        link.href = card.dataset.detailHref;
        const copyRow = card.querySelector('.card-copy-row');
        if (copyRow) copyRow.before(link); else card.append(link);
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

  const TOKEN_KEYS = ['colors','bg-colors','status-colors','neutral-colors','text-colors','typography','spacing','radius','border','border-states','shadow','grid-layout','icons'];
  // Maps each Foundations sidebar tab to the token key(s) its editor saves
  // under - Colors alone covers 5 keys (its own light-mode value plus the
  // 4 themed Foundations panels), the rest are 1:1 except Borders (border
  // + its separate border-states values).
  const FOUNDATION_TOKEN_MAP = {
    colors: ['colors','bg-colors','status-colors','neutral-colors','text-colors'],
    'grid-layout': ['grid-layout'],
    typography: ['typography'],
    spacing: ['spacing'],
    radius: ['radius'],
    borders: ['border','border-states'],
    shadows: ['shadow'],
    icons: ['icons'],
  };
  function savedTokens(allowedKeys = TOKEN_KEYS) {
    const values = {};
    for (const key of allowedKeys) {
      const raw = localStorage.getItem('ads:' + key);
      if (raw !== null) values[key] = JSON.parse(raw);
    }
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
      const details = el('details', '', 'export-category-details');
      const summary = el('summary', '', 'export-category-summary');
      const selectAllLabel = el('label', '', 'setup-option');
      const selectAll = el('input'); selectAll.type = 'checkbox'; selectAll.checked = true;
      selectAllLabel.append(selectAll, document.createTextNode(category));
      summary.append(selectAllLabel, el('span', `(${docs.length})`, 'export-category-count'));
      details.append(summary);
      const options = el('div', '', 'export-category-options');
      const checks = docs.map(doc => {
        const label = el('label', '', 'export-component-option');
        const input = el('input'); input.type = 'checkbox'; input.className = 'export-component-check';
        input.dataset.file = doc.file; input.checked = true;
        label.append(input, document.createTextNode(doc.title));
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
          const allowedFiles = new Set(componentChecks.filter(c => c.checked).map(c => c.dataset.file));
          docs = docs.filter(d => docCategory(d) === null || allowedFiles.has(d.file));
        }
        // Each checkbox picks a whole Foundations tab (e.g. "colors" also
        // pulls in the bg/status/neutral/text theme-pair values saved
        // under that tab - see FOUNDATION_TOKEN_MAP) rather than one
        // storage key, so the selection matches what the user actually
        // sees as one unit in the Foundations sidebar.
        const allowedKeys = foundationChecks.filter(c => c.checked).flatMap(c => FOUNDATION_TOKEN_MAP[c.value] || []);
        const tokens = savedTokens(allowedKeys);
        preview.value = M.markdown(profile, tokens, docs, identity.checked);
        const includedCount = foundationChecks.filter(c => c.checked).length;
        const foundationSummary = foundationChecks.length ? `${includedCount}/${foundationChecks.length} foundation sections · ` : '';
        const includedComponentCount = componentChecks.filter(c => c.checked).length;
        const componentSummary = (selector.value !== 'context' && componentChecks.length) ? `${includedComponentCount}/${componentChecks.length} components · ` : '';
        status.textContent = `${foundationSummary}${componentSummary}${docs.length ? docs.length + ' documentation pages · ' : ''}${Math.ceil(new Blob([preview.value]).size / 1024)} KB · Current local draft. ${identity.checked ? 'Includes contact details.' : 'Contact details excluded.'}`;
        download.disabled = false; copy.disabled = false;
      } catch (error) { preview.value = ''; status.textContent = error.message; }
      finally { busy = false; selector.disabled = false; identity.disabled = false; foundationChecks.forEach(c => c.disabled = false); componentChecks.forEach(c => c.disabled = false); }
    }
    $('#refreshMarkdown').addEventListener('click', generate);
    selector.addEventListener('change', generate); identity.addEventListener('change', generate);
    foundationChecks.forEach(c => c.addEventListener('change', generate));
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
      const data = {};
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
          return { label: label ? label.textContent.trim() : null, value: value ? value.textContent.trim() : null };
        });
      }
      if (!Object.keys(data).length) return;
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
  // source the sitewide MD Export page's own per-page export draws from),
  // just run client-side against the live DOM instead of raw HTML source
  // - so a local button gives the same result without loading that
  // 500KB+ sitewide catalog file just to read one page's own entry. Only
  // activates on a page that actually has the button + output element.
  function initPageMarkdownExport() {
    const output = $('[data-role="page-markdown-output"]');
    const copyBtn = $('#copyPageMarkdownBtn');
    const main = $('main');
    if (!output || !copyBtn || !main) return;

    const SKIP_TAGS = new Set(['script', 'style']);
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

    output.textContent = extract(main);

    copyBtn.addEventListener('click', () => {
      const status = $('#pageMarkdownStatus');
      const done = () => { status.textContent = 'Copied to clipboard'; setTimeout(() => { status.textContent = ''; }, 2500); };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(output.textContent).then(done).catch(() => {
          status.textContent = 'Copy failed - select the text above and copy manually.';
        });
      } else done();
    });
  }
  function init() { shared(); setupForm(); exportPage(); settings(); autoMachineViews(); initPageMarkdownExport(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
