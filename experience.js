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
    const headings = Array.from(main.querySelectorAll('section > h2,section > .panel-title-row > h2')).filter(h=>file!=='principles.html'||!h.closest('[data-outline-skip],.ads-implementation-contract'));
    if (headings.length > 2) {
      const nav = el('nav', '', 'page-outline');
      nav.setAttribute('aria-label', 'On this page');
      const group=el('div','','group-btn group-btn--filled ads-tab-group');
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
      // This strip scrolls horizontally once its tabs don't fit (.page-outline
      // is overflow-x:auto; .ads-tab-group itself stays width:max-content so
      // the outer nav is what actually scrolls - confirmed by testing
      // scrollLeft directly, not assumed) - but nothing signaled that before:
      // the last tab just stopped dead at the viewport edge, mid-label, with
      // no fade, arrow or scrollbar to suggest there was more. A page with
      // few sections never showed it; Accessibility's 11 and Design
      // Principles' 10 did. Toggling a fade mask on whichever edge still has
      // unscrolled content turns "looks cut off" into "reads as scrollable."
      const updateScrollEdges = () => {
        const max = nav.scrollWidth - nav.clientWidth;
        nav.classList.toggle('has-overflow-start', nav.scrollLeft > 2);
        nav.classList.toggle('has-overflow-end', nav.scrollLeft < max - 2);
      };
      updateScrollEdges();
      nav.addEventListener('scroll', updateScrollEdges, { passive: true });
      window.addEventListener('resize', updateScrollEdges);
    }
    // Persisted, not re-asked every page load - a visitor who intentionally
    // browses without setup was closing this exact message on every single
    // page before. The profile-exists "context summary" state used to be
    // exempt from this (closing it only hid it on the current page, since it
    // was judged useful rather than a repeated prompt) - closing it on one
    // page left it reappearing on every other one, which a direct request
    // asked to stop. Uses a separate key from the no-profile prompt so each
    // has its own reset: saving/editing the project (see the profile save
    // handler further down) clears this one, so the banner comes back once
    // to confirm the new context; completing setup for the first time is
    // what "resets" the no-profile key, same as before.
    let bannerDismissed = false;
    try { bannerDismissed = localStorage.getItem(profile ? 'ads:setup-context-dismissed' : 'ads:setup-banner-dismissed') === '1'; } catch {}
    const guidedFoundation=new URLSearchParams(location.search).get('setup')==='1'&&M.FOUNDATION_STEPS.some(section=>section.file===file);
    if (!['overview.html','new-project.html','project-setup.html','history.html','principles.html','md-export.html'].includes(file) && !guidedFoundation && !bannerDismissed) {
      const notice = el('section', '', 'setup-notice setup-context');
      notice.setAttribute('aria-label', 'Your design system');
      const copy = profile ? `${profile.project} · ${profile.productType === 'Other' ? profile.productOther : profile.productType} · ${profile.platforms.map(k => M.PLATFORMS[k].label).join(', ')}` : 'What are you creating? Set up your product, role and target platforms to get a tailored design-system brief.';
      notice.append(el('p', copy));
      const actions = el('div', '', 'setup-actions');
      const setup = el('a', profile ? '' : 'Set up project', 'btn btn-ghost btn-sm');
      if (profile) {
        setup.classList.add('setup-edit');
        setup.setAttribute('aria-label', 'Edit setup');
        setup.title = 'Edit setup';
        // Google Material Icons: image/edit (Apache 2.0, Material-Icons-LICENSE.txt).
        // Adapted with inherited color and accessible decoration attributes.
        setup.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
      }
      setup.href = profile?'project-setup.html?edit=1':'new-project.html';
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
        try { localStorage.setItem(profile ? 'ads:setup-context-dismissed' : 'ads:setup-banner-dismissed', '1'); } catch {}
        if (bannerObserver) bannerObserver.disconnect();
        else window.removeEventListener('resize', syncBannerHeight);
        notice.remove();
        main.style.setProperty('--setup-context-height', '0px');
        main.focus({ preventScroll:true });
      });
      requestAnimationFrame(syncBannerHeight);
    }
    if (profile && main.querySelector('.back-link')) {
      // Same bordered-accordion treatment as the MD Export category list
      // (.export-category-details/.export-category-summary): display:flex
      // on <summary> drops the native disclosure triangle, which the plain
      // <details> version relied on and which rendered flush against the
      // box's left edge with no inset - the same .chev SVG restores a
      // clearly-inset, rotating indicator instead.
      const details = el('details', '', 'platform-guidance');
      const summary = el('summary', 'Guidance for your target platforms', 'platform-guidance-summary');
      const chev = el('span', '', 'chev');
      chev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
      summary.append(chev);
      details.append(summary);
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
        // Foundation audit: was Anchor-styled (reasoning at the time: "plain
        // navigation and repeated card actions use Anchor, not Primary").
        // Direct request overrides that - this is the one action each card
        // exists to offer (go see the full, authoritative component), so it
        // now uses the real Button component's own Primary treatment
        // (.btn-demo--primary) instead of a borderless icon-only link,
        // matching the hierarchy documented on the Button guideline tab:
        // Primary = View guide, Secondary = Copy prompt, icon-only Tertiary
        // = Copy code (see the two button edits in this same card below).
        const link = el('a', '', 'btn-demo btn-demo--primary btn-demo--h32 component-open-link');
        link.href = card.dataset.detailHref;
        link.setAttribute('aria-label', 'View ' + cardName + ' guide');
        link.title = 'View ' + cardName + ' guide';
        link.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg><span>View guide</span>';
        const copyRow = card.querySelector('.card-copy-row');
        if (copyRow) {
          copyRow.prepend(link);
          const copyPromptBtn = copyRow.querySelector('[data-role^="copy-prompt-"]');
          const copyCodeBtn = copyRow.querySelector('[data-role^="copy-code-"]');
          if (copyPromptBtn) copyPromptBtn.setAttribute('aria-label', 'Copy ' + cardName + ' prompt');
          if (copyCodeBtn) copyCodeBtn.setAttribute('aria-label', 'Copy ' + cardName + ' code');
          // Same "Draw in Figma" action as every detail page's Properties
          // panel (foundation-runtime.js), built directly here instead of
          // through that page's generic [data-role="draw-figma-action"]
          // mount - a card has no configured-properties panel to read, so
          // its contract is type-level only (name + resolved tokens), not a
          // specific configured instance.
          const figmaBtn = el('button', '', 'btn-demo btn-demo--tertiary btn-demo--h32 is-icon-only');
          figmaBtn.type = 'button';
          figmaBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" aria-hidden="true" focusable="false"><path d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z" fill="#0ACF83"/><path d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z" fill="#A259FF"/><path d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z" fill="#F24E1E"/><path d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z" fill="#FF7262"/><path d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z" fill="#1ABCFE"/></svg>';
          figmaBtn.setAttribute('aria-label', 'Draw in Figma');
          figmaBtn.title = figmaBtn.getAttribute('aria-label');
          figmaBtn.addEventListener('click', () => window.ADSFigmaBridge?.drawFromPage(card.dataset.detailHref,figmaBtn));
          copyRow.append(figmaBtn);
          // Same contract as Draw in Figma, copied as a Claude Design prompt.
          const claudeBtn = el('button', '', 'btn-demo btn-demo--tertiary btn-demo--h32 is-icon-only claude-design-action');
          claudeBtn.type = 'button';
          claudeBtn.innerHTML = window.ADSClaudeDesign?.mark || '';
          claudeBtn.setAttribute('aria-label', 'Send ' + cardName + ' to Claude Design');
          claudeBtn.title = 'Send to Claude Design';
          claudeBtn.addEventListener('click', () => window.ADSClaudeDesign?.sendFromPage(card.dataset.detailHref, claudeBtn));
          copyRow.append(claudeBtn);
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
      'figma.html': ['Connect through the local Figma bridge', 'Run the local bridge and development plugin before pushing a saved component contract. This does not publish a Figma library.'],
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
    };
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      const label = navStatus[link.getAttribute('href')];
      if (!label || link.querySelector('.nav-link-status')) return;
      link.append(el('span', label, 'nav-link-status'));
    });
    // Foundation audit UX08 - Stable/Experimental said what a component's
    // maturity was without saying what that word actually promises. Link
    // every component's own badge to the one shared definition rather than
    // writing unique "acceptance evidence" per component - the component's
    // own page (Accessibility notes, Component Guide) is that evidence,
    // this just tells a reader what to check it against.
    document.querySelectorAll('.page-title > .component-status.is-stable, .page-title > .component-status.is-experimental').forEach(badge => {
      if (badge.tagName === 'A') return;
      const link = el('a', badge.textContent, badge.className);
      link.href = (file === 'guidelines.html' ? '' : 'guidelines.html') + '#component-maturity';
      link.title = 'What "' + badge.textContent + '" guarantees for this component';
      badge.replaceWith(link);
    });
  }

  const readinessLabel=state=>({saved:'Saved',default:'Using defaults',partial:'Partly saved',recovery:'Needs recovery'}[state]);
  const guidedHref=section=>section.file+'?setup=1';
  function nextSetupTask(){const sections=M.foundationReadiness(localStorage);return {sections,next:sections.find(section=>section.state==='recovery')||sections.find(section=>section.state!=='saved'),saved:sections.filter(section=>section.state==='saved').length};}
  function foundationJourney(){
    if(new URLSearchParams(location.search).get('setup')!=='1')return;
    const index=M.FOUNDATION_STEPS.findIndex(section=>section.file===file),main=$('main');if(index<0||!main)return;
    const section=M.FOUNDATION_STEPS[index],next=M.FOUNDATION_STEPS[index+1],previous=M.FOUNDATION_STEPS[index-1];
    const host=el('section','','setup-journey ads-no-clamp');host.setAttribute('aria-label','Guided Foundation setup');
    host.append(el('p','Foundation '+(index+1)+' of 8 · '+section.label,'page-eyebrow'));
    const heading=el('h2',profile?profile.project+' · Review '+section.label:'Review '+section.label);host.append(heading);
    host.append(el('p',['grid-layout','typography','spacing'].includes(section.id)?'Your project recommendation is preselected where no saved choice exists. Review it, then save to keep it.':'Choose the settings for your project, then save to keep them. You can edit every saved choice later.'));
    const progress=el('p','','setup-help');progress.id='guidedProgress';host.append(progress);
    if(!profile){const note=el('p','No project details are saved. These are library defaults. ');const setup=el('a','Set up your project');setup.href='new-project.html';note.append(setup);host.append(note);}
    const navigation=el('details'),summary=el('summary','View all Foundation steps'),list=el('ol','','guided-step-list');navigation.append(summary,list);
    for(const [i,step]of M.FOUNDATION_STEPS.entries()){const li=el('li'),link=el('a',(i+1)+'. '+step.label);link.href=guidedHref(step);if(i===index)link.setAttribute('aria-current','step');li.append(link);list.append(li);}host.append(navigation);
    const status=el('p','','setup-status');status.id='guidedStatus';status.setAttribute('role','status');status.tabIndex=-1;
    const actions=el('nav','','setup-actions');actions.setAttribute('aria-label','Foundation setup navigation');
    const back=el('a',previous?'Back: '+previous.label:'Back to project','btn btn-ghost');back.href=previous?guidedHref(previous):'new-project.html';
    const forward=el('a','','btn btn-ghost');forward.id='guidedContinue';forward.href=next?guidedHref(next):'md-export.html?setup=1';
    const exit=el('a','Project summary');exit.href='project-setup.html';actions.append(back,forward,exit);host.append(actions,status);
    (main.querySelector('.page-lede')||main.querySelector('h1')).after(host);
    function refresh(){
      const rows=M.foundationReadiness(localStorage),saved=rows.filter(row=>row.state==='saved').length,current=rows[index],state=window.ADSFoundationEditor?.getState();
      progress.textContent=saved+' of 8 Foundations saved · '+section.label+': '+readinessLabel(current.state)+'.';
      forward.textContent=current.state==='saved'&&!state?.dirty?(next?'Continue to '+next.label:'Continue to handoff'):'Skip for now'+(next?' → '+next.label:' → Handoff');
      const save=main.querySelector('[data-foundation-save]');if(save)save.textContent='Save & continue';
      list.querySelectorAll('li').forEach((li,i)=>{let label=li.querySelector('span');if(!label){label=el('span','','setup-help');li.append(label);}label.textContent=' — '+readinessLabel(rows[i].state);});
    }
    // Keep an unfinished preview on screen instead of losing it through a setup link.
    main.addEventListener('click',event=>{const link=event.target.closest('.setup-journey a');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;if(window.ADSFoundationEditor?.getState().dirty){event.preventDefault();status.textContent='Save your changes to continue, or select Cancel changes to keep your previous settings.';status.focus();}},true);
    window.addEventListener('ads:foundation-editor-state',refresh);
    window.addEventListener('ads:foundation-saved',()=>{window.ADSNavigation ? window.ADSNavigation.go(forward.href) : (location.href = forward.href);});
    window.addEventListener('storage',refresh);refresh();
  }
  // Deleting a project is a type-the-name confirmation gate (the same
  // pattern a destructive action like this needs everywhere - a plain
  // "Are you sure?" button is too easy to click through without reading)
  // in front of a soft-delete: M.deleteProject() archives the row rather
  // than removing it, so a mis-typed-but-still-confirmed delete has a
  // 7-day recovery window behind it, not just this one confirmation step.
  function deleteProjectModal(onDeleted){
    const overlay=$('#deleteProjectOverlay');if(!overlay)return()=>{};
    const nameEl=$('#deleteProjectName'),input=$('#deleteProjectConfirmInput'),confirmBtn=$('#deleteProjectConfirm'),cancelBtn=$('#deleteProjectCancel'),form=$('#deleteProjectForm'),modalStatus=$('#deleteProjectStatus');
    let pending=null,opener=null;
    // Deleting is permanent from the user's point of view (there is no restore UI),
    // so the dialog says so instead of promising a 7-day recovery window.
    const copyEl=$('#deleteProjectCopy');
    function setCopy(){if(!copyEl)return;copyEl.replaceChildren(document.createTextNode('This permanently removes '),nameEl,document.createTextNode(' and its saved Foundation settings. This cannot be undone. To confirm, type the project\u2019s name below.'));}
    function close(restoreFocus=true){overlay.hidden=true;pending=null;form.reset();confirmBtn.disabled=true;modalStatus.textContent='';const target=opener;opener=null;if(restoreFocus&&target?.isConnected)target.focus();}
    function sync(){confirmBtn.disabled=!pending||input.value!==pending.profile.project;}
    function focusables(){return [...overlay.querySelectorAll('input,button,select,textarea,a[href]')].filter(n=>!n.disabled&&!n.hidden&&n.getClientRects().length);}
    input.addEventListener('input',sync);
    cancelBtn.addEventListener('click',()=>close());
    overlay.addEventListener('click',event=>{if(event.target===overlay)close();});
    document.addEventListener('keydown',event=>{
      if(overlay.hidden)return;
      if(event.key==='Escape'){close();return;}
      if(event.key!=='Tab')return;
      // Keep Tab inside the dialog (aria-modal does not do this by itself).
      const items=focusables();if(!items.length)return;
      const first=items[0],last=items[items.length-1],active=document.activeElement;
      if(!overlay.contains(active)){event.preventDefault();first.focus();}
      else if(event.shiftKey&&active===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&active===last){event.preventDefault();first.focus();}
    });
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!pending||input.value!==pending.profile.project)return;
      try{M.deleteProject(localStorage,pending.id);const name=pending.profile.project;close(false);onDeleted(name);}
      catch(error){modalStatus.textContent=error.message;}
    });
    return function open(row,trigger){
      pending=row;opener=trigger||document.activeElement;setCopy();nameEl.textContent=row.profile.project;input.value='';confirmBtn.disabled=true;modalStatus.textContent='';
      overlay.hidden=false;input.focus();
    };
  }
  function projectHistory() {
    const list=$('#projectHistoryList');if(!list)return;
    const search=$('#projectSearch'),empty=$('#projectHistoryEmpty'),status=$('#projectHistoryStatus');
    const openDeleteModal=deleteProjectModal(name=>{render();status.textContent='Deleted '+name+'. It has been permanently removed.';window.ADSFoundation?.apply?.();(search||status).focus();});
    function render(){
      list.replaceChildren();let rows;
      const draftHost=$('#projectDraft');
      if(draftHost){
        draftHost.replaceChildren();let draft=null,issue='';try{draft=M.read(localStorage,M.DRAFT);}catch(error){issue=error.message;}
        draftHost.hidden=!draft&&!issue;
        const action=$('#projectHubAction');if(action){action.textContent=issue?'Review draft':draft?'Continue draft':'New project';action.href=draft||issue?'new-project.html?resume=1':'new-project.html?new=1';}
        if(!draftHost.hidden){const copy=el('div');copy.append(el('strong',issue?'Your draft needs attention':'Unfinished project'),el('p',issue||draft.project||'Your answers are saved. Continue from where you left off.'));draftHost.append(copy);}
      }
      try{rows=M.listProjects(localStorage);}catch(error){status.textContent=error.message;$('#projectHistoryCount').textContent='Projects unavailable';empty.hidden=true;return;}
      status.textContent='';
      const activeId=profile?M.projectId(profile):null;rows.sort((a,b)=>Number(b.id===activeId)-Number(a.id===activeId));
      const query=search.value.trim().toLocaleLowerCase(),matches=rows.filter(row=>row.profile.project.toLocaleLowerCase().includes(query));
      $('#projectHistoryCount').textContent=matches.length+' '+(matches.length===1?'project':'projects')+(query?' found':'');
      for(const row of matches){
        const card=el('article','','project-history-card'),copy=el('div'),heading=el('h2',row.profile.project),meta=el('p',[(row.profile.productType==='Other'?row.profile.productOther:row.profile.productType),row.profile.name||'Owner not provided'].join(' · '),'project-history-meta');
        copy.append(heading,meta);const date=new Date(row.profile.updatedAt);
        if(!isNaN(date)){const time=el('time','Updated '+date.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}),'setup-help');time.dateTime=date.toISOString();copy.append(time);}
        const active=profile&&M.projectId(profile)===row.id;
        if(active)copy.append(el('span','Active project','project-history-active'));
        const open=el('button','Open project','btn btn-ghost');open.type='button';open.setAttribute('aria-label','Open '+row.profile.project);
        open.addEventListener('click',()=>{try{if(!active)M.openProject(localStorage,row.id);window.ADSNavigation ? window.ADSNavigation.go('project-setup.html') : (location.href = 'project-setup.html');}catch(error){status.textContent=error.message;}});
        const del=el('button','Delete','btn btn-ghost');del.type='button';del.setAttribute('aria-label','Delete '+row.profile.project);
        del.addEventListener('click',()=>openDeleteModal(row,del));
        const actions=el('div','','project-card-actions');actions.append(open,del);
        if(active){const {next,saved}=nextSetupTask();copy.append(el('p',saved+' of 8 Foundations saved','setup-help'));const action=el('a',next?'Continue with '+next.label:'Export project handoff','btn btn-primary');action.id='projectStartAction';action.href=next?guidedHref(next):'md-export.html?setup=1';actions.append(action);}
        card.append(copy,actions);list.append(card);
      }
      empty.hidden=matches.length!==0;
      $('#projectHistoryEmptyTitle').textContent=query?'No matching projects':'No saved projects yet';
      $('#projectHistoryEmptyCopy').textContent=query?'Try another project name or clear your search.':'Choose New project above to create your first design system.';
      if($('#clearProjectSearch'))$('#clearProjectSearch').hidden=!query;
    }
    $('#clearProjectSearch')?.addEventListener('click',()=>{search.value='';render();search.focus();});
    search.addEventListener('input',render);render();
    window.addEventListener('storage',event=>{if(event.key===null||[M.KEY,M.HISTORY,M.DRAFT,...M.PROJECT_FOUNDATIONS].includes(event.key)){try{profile=M.read(localStorage);}catch{profile=null;}render();}});
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
  // (Figma Export's own orchestration script reads the same breadcrumb
  // convention independently - adding a shared module here would mean
  // threading a new <script> tag onto all 159 pages that load this file,
  // for one small, stable ~10-line regex; duplicated deliberately instead.)
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
  function buildComponentCategoryGroups(container, onChange) {
    const manifest = window.ADSComponentManifest.buildCatalogManifest(window.ADSDocsCatalog || []);
    const componentChecks = [];
    for (const category of CATEGORY_ORDER) {
      const items = manifest.filter(item => item.category === category).map(item => ({label:item.name, files:item.files}));
      if (!items.length) continue;
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
      const count=el('span','','export-category-count');
      summary.append(el('span',category), count, chev);
      selectAll.setAttribute('aria-label','Select all '+category+' components');
      selectAllLabel.lastChild.textContent='Select all '+category;
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
      details.append(selectAllLabel,options);
      container.append(details);
      const syncSelectAll = () => {
        const checkedCount = checks.filter(c => c.checked).length;
        selectAll.checked = checkedCount === checks.length;
        selectAll.indeterminate = checkedCount > 0 && checkedCount < checks.length;
        count.textContent=checkedCount+' / '+checks.length+' selected';
      };
      selectAll.addEventListener('click', (e) => e.stopPropagation());
      selectAll.addEventListener('change', () => { checks.forEach(c => c.checked = selectAll.checked); syncSelectAll();onChange(); });
      container.addEventListener('ads:selection-change',syncSelectAll);syncSelectAll();
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
    const requestedGuide = new URLSearchParams(location.search).get('page');
    const requestedPage = ({'patterns.html':'overview.html','templates.html':'overview.html','values.html':'principles.html','ai-generator.html':'md-export.html','figma-export.html':'md-export.html','settings.html':'overview.html'})[requestedGuide] || requestedGuide;
    if (requestedPage && /^[a-z0-9-]+\.html$/.test(requestedPage)) {
      const guide=(window.ADSDocsCatalog||[]).find(d=>d.file===requestedPage);
      const option = el('option', 'Brief + '+(guide?.title||'selected guide')); option.value = 'page';
      selector.prepend(option); selector.value = 'page';
    }
    async function generate() {
      if (busy) return;
      busy = true; download.disabled = true; copy.disabled = true; selector.disabled = true; identity.disabled = true;
      foundationChecks.forEach(c => c.disabled = true); componentChecks.forEach(c => c.disabled = true);
      status.textContent = 'Preparing your Markdown…';status.dataset.state='working';preview.setAttribute('aria-busy','true');
      updateSelectionSummary();
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
          if(selector.value==='components'&&!docs.length)throw new Error('Choose at least one component, or switch to Project brief and foundations.');
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
        download.disabled = false; copy.disabled = false;status.dataset.state='ready';
      } catch (error) { preview.value = ''; status.textContent = error.message;status.dataset.state='error'; }
      finally {
        busy = false; selector.disabled = false; identity.disabled = false;
        foundationChecks.forEach(c => c.disabled = false); componentChecks.forEach(c => c.disabled = false);
        const showComponents=new URLSearchParams(location.search).get('format')==='figma'||['all','components'].includes(selector.value);
        $('#exportComponents').hidden=!showComponents;preview.removeAttribute('aria-busy');
        updateSelectionSummary();
      }
    }
    function updateSelectionSummary(){
      $('#foundationSelectionCount').textContent=foundationChecks.filter(c=>c.checked).length+' / '+foundationChecks.length+' selected';
      $('#componentSelectionCount').textContent=componentChecks.filter(c=>c.checked).length+' of '+componentChecks.length+' selected. Filtering does not change your selections.';
      const context=$('#exportProjectContext');context.replaceChildren();context.append(document.createTextNode(profile?profile.project+' · Saved settings are used where available. ':'No project selected. You can export library defaults. '));const setup=el('a',profile?'Review project setup':'Set up a project');setup.href=profile?'project-setup.html':'new-project.html';context.append(setup);
      $('#exportScopeHelp').textContent=selector.value==='page'?'Includes the selected guide with your project context.':selector.value==='context'?'Your product context, platform guidance and resolved foundation settings.':selector.value==='components'?'Includes the component guides you select below.':'Includes non-component documentation and the component guides you select below.';
    }
    for(const [id,checks,checked]of [['selectAllFoundations',foundationChecks,true],['clearFoundations',foundationChecks,false],['selectAllComponents',componentChecks,true],['clearComponents',componentChecks,false]])$("#"+id).addEventListener('click',()=>{checks.forEach(c=>c.checked=checked);$('#exportComponentGroups').dispatchEvent(new Event('ads:selection-change'));generate();});
    $('#exportComponentSearch').addEventListener('input',event=>{
      const query=event.target.value.trim().toLocaleLowerCase();let matches=0;
      for(const group of $('#exportComponentGroups').children){let found=0;for(const label of group.querySelectorAll('.export-component-option')){const match=label.textContent.toLocaleLowerCase().includes(query);label.hidden=!match;if(match)found++;}group.hidden=found===0;matches+=found;if(query){if(!('beforeSearch' in group.dataset))group.dataset.beforeSearch=String(group.open);if(found)group.open=true;}else if('beforeSearch' in group.dataset){group.open=group.dataset.beforeSearch==='true';delete group.dataset.beforeSearch;}}
      $('#componentSearchEmpty').hidden=matches>0;
    });
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
        if (SKIP_TAGS.has(tag) || node.hasAttribute('data-markdown-skip')) return;
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
          const details=output.closest('details');if(details)details.open=true;output.closest('pre')?.focus();
          status.textContent = 'Copy failed. Open the Markdown preview and copy the text manually.';
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
    // "Draw in Figma" (foundation-runtime.js) is the one icon-only control
    // sitewide built as .btn.btn-ghost rather than .btn-demo - it sits in
    // .panel-title-actions beside text buttons of that same .btn family, not
    // the component preview/stage row .btn-demo belongs to - so the
    // .btn-demo-only selector silently skipped it: a real aria-label and
    // title were always there, but hovering it never showed this shared
    // tooltip the way every .btn-demo icon-only control does. Matching
    // .btn.is-icon-only here (not just .btn-demo) is what the "every
    // icon-only control sitewide" comment above already claimed.
    const selector = '.btn-demo.is-icon-only[aria-label], .btn.is-icon-only[aria-label], .component-open-link[aria-label]';
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
  function init() { shared(); foundationJourney(); projectHistory(); exportPage(); autoMachineViews(); initPageMarkdownExport(); smartTooltips(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
