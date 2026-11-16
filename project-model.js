(function(root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./foundation-model.js') : root.ADSFoundationModel);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ADSProject = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(F) {
  'use strict';
  const KEY = 'ads:project-profile:v1';
  const DRAFT = 'ads:project-draft:v1';
  const FOUNDATION_STEPS = [
    {id:'colors',label:'Colors',file:'foundations.html',keys:['colors','bg-colors','status-colors','neutral-colors']},
    {id:'grid-layout',label:'Grid & Layout',file:'grid-layout.html',keys:['grid-layout']},
    {id:'typography',label:'Typography',file:'typography.html',keys:['typography']},
    {id:'spacing',label:'Spacing',file:'spacing.html',keys:['spacing']},
    {id:'radius',label:'Radius',file:'radius.html',keys:['radius']},
    {id:'borders',label:'Borders',file:'borders.html',keys:['border','border-states']},
    {id:'shadows',label:'Shadows',file:'shadows.html',keys:['shadow']},
    {id:'icons',label:'Icons',file:'icons.html',keys:['icons']}
  ];
  function foundationReadiness(storage) {
    return FOUNDATION_STEPS.map(section=>{
      const records=section.keys.map(key=>{try{return F.inspectRecord(key,storage.getItem('ads:'+key));}catch{return {status:'unavailable'};}});
      const usable=records.filter(record=>['valid','migrated'].includes(record.status)).length;
      const state=records.some(record=>['invalid','corrupt','future','unavailable'].includes(record.status))?'recovery':usable===records.length?'saved':usable?'partial':'default';
      return {...section,state};
    });
  }
  // Matches the product-card taxonomy already used on Spacing, Radius
  // and Grid & Layout's own "What are you building?" pickers (see their
  // data-product values), minus the three that duplicate this same
  // form's separate "Where will your product be used?" platform question
  // (Desktop Web/Mobile Web/Mobile Application vs Desktop web/Mobile
  // web/Mobile app) - those two questions cover different dimensions
  // (what the product is vs. where it runs), so asking the platform
  // dimension twice under two different names was the actual duplicate.
  const PRODUCTS = ['SaaS', 'Enterprise SaaS', 'Web Application', 'Dashboard', 'Data-Heavy Application', 'Marketing Website', 'Consumer App', 'AI Product', 'Cross-Platform', 'Other'];
  // Old product-type values this field used to offer, before it was
  // aligned with Spacing/Radius/Grid & Layout's own taxonomy (and before
  // the three platform-duplicate categories below were removed again) -
  // mapped forward so a profile saved under either prior list keeps
  // working ("Saved setup is incomplete" would otherwise fire for every
  // existing saved project) instead of silently failing validation.
  const LEGACY_PRODUCT_MAP = {
    'Enterprise portal': 'Enterprise SaaS',
    'Customer portal': 'Consumer App',
    'Internal tool': 'Dashboard',
    'Commerce': 'Web Application',
    'Content website': 'Marketing Website',
    'Desktop Web (D-Web)': 'Web Application',
    'Mobile Web (M-Web)': 'Web Application',
    'Mobile Application': 'Consumer App'
  };
  const ROLES = ['Designer', 'Developer', 'Product Manager', 'Design System Lead', 'QA / Accessibility', 'Other'];
  const PLATFORMS = {
    'desktop-web': {label: 'Desktop web', guidance: 'Use responsive grids, keyboard navigation, visible focus, and appropriately dense data views. Keep primary actions discoverable at browser zoom.'},
    'mobile-web': {label: 'Mobile web', guidance: 'Use a single-column task flow, touch-friendly controls, persistent field labels, and input types that open the appropriate keyboard. Adapt wide tables to a labelled scroll region or a concise list.'},
    'mobile-app': {label: 'Mobile app', guidance: 'Use native platform navigation, safe-area insets, back gestures, and platform accessibility APIs. Translate semantic tokens to native units; HTML/CSS examples are references, not native components.'},
    'tablet': {label: 'Tablet', guidance: 'Support portrait and landscape, touch and keyboard, split-screen resizing, and adaptive master-detail layouts. Do not rely on hover.'},
    'desktop-app': {label: 'Desktop app', guidance: 'Support window resizing, keyboard shortcuts with visible alternatives, focus restoration, and platform menus. Adapt web components to the chosen desktop framework.'}
  };
  // The schema version save() stamps on every write. read() rejects a
  // STRICTLY GREATER version outright (data written by a newer copy of
  // this app, whose fields this code can't safely interpret) - never an
  // older or missing one, which existing saved projects legitimately have
  // and which LEGACY_PRODUCT_MAP above already knows how to migrate.
  const SUPPORTED_VERSION = 2;
  // Same 1-100 character, string-typed, trimmed bound Project name already
  // enforces, and the same bound its own <input maxlength="100"> already
  // shows in the UI - this just makes the model itself the authority on
  // that bound instead of leaving it to "the browser happened to enforce
  // the inputs", so a value restored or imported some other way can't
  // bypass it.
  const isBoundedText = value => typeof value === 'string' && value.trim().length >= 1 && value.trim().length <= 100;
  // New saves require the complete project brief. Older profiles remain readable
  // until the user explicitly edits and upgrades them. Identity stays opt-in in exports.
  function validate(p, {legacyIdentity=false} = {}) {
    const e = {};
    if (!isBoundedText(p.project)) e.project = 'Project name must contain 1–100 characters.';
    for (const [key, label] of [['name','Your name'], ['designation','Designation']]) {
      if ((!legacyIdentity || p[key]) && !isBoundedText(p[key])) e[key] = label + ' must contain 1–100 characters.';
    }
    if (!PRODUCTS.includes(p.productType)) e.productType = 'Choose the type of product you are creating.';
    if (p.productType === 'Other' && !isBoundedText(p.productOther)) e.productOther = 'Describe your product type in 1–100 characters.';
    if (!ROLES.includes(p.role)) e.role = 'Choose your role in this project.';
    if (p.role === 'Other' && !isBoundedText(p.roleOther)) e.roleOther = 'Describe your role in 1–100 characters.';
    if ((!legacyIdentity || p.email) && (typeof p.email!=='string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) || p.email.length > 254)) e.email = 'Enter a valid email address.';
    if (!Array.isArray(p.platforms) || !p.platforms.length || p.platforms.some(k => !PLATFORMS[k])) e.platforms = 'Select at least one target platform.';
    return e;
  }
  const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'design-system';
  function read(storage, key = KEY) {
    const raw = storage.getItem(key);
    if (!raw) return null;
    // Foundation audit NP03 - genuinely malformed JSON (not just a wrong
    // shape) used to leak a raw native SyntaxError message straight to the
    // status line ("Expected property name or '}'...") - technically
    // accurate, meaningless to someone trying to resume a draft. Same
    // friendly message as the "right shape, wrong content" case below.
    let p;
    try { p = JSON.parse(raw); }
    catch { throw new Error('Saved setup could not be read. Your saved data has not been changed.'); }
    if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('Saved setup could not be read. Your saved data has not been changed.');
    if (p.version!=null&&(!Number.isInteger(p.version)||p.version<0)) throw new Error('Saved setup has an invalid version. Your saved data has not been changed.');
    if (typeof p.version === 'number' && p.version > SUPPORTED_VERSION) throw new Error('Saved setup was created by a newer version of this app and can’t be read here. Update the app, or explicitly discard the saved setup.');
    if(p.id!=null&&(typeof p.id!=='string'||!p.id||p.id.length>300))throw new Error('Saved project has an invalid identity. Your saved data has not been changed.');
    // Foundation audit NP03 - this migration used to run only for the real
    // profile (key === KEY), so a draft saved under an old product-type name
    // silently lost its selection instead of migrating forward: the <select>
    // has no option for the legacy string, so setting it has no effect and
    // the field reads as unset. A legacy name is equally invalid in a draft
    // as in a saved profile, so the migration applies to both unconditionally.
    if (LEGACY_PRODUCT_MAP[p.productType]) p.productType = LEGACY_PRODUCT_MAP[p.productType];
    if(key===DRAFT){
      if(p.step!=null&&(!Number.isInteger(p.step)||p.step<1||p.step>3))throw new Error('Saved draft has an invalid step. Export a backup or discard the draft.');
      if(p.productType&&!PRODUCTS.includes(p.productType))throw new Error('Saved draft has an unsupported product category. Export a backup or discard the draft.');
      if(p.role&&!ROLES.includes(p.role))throw new Error('Saved draft has an unsupported role. Export a backup or discard the draft.');
      for(const k of ['project','productType','productOther','name','email','designation','role','roleOther']) if(p[k]!=null&&(typeof p[k]!=='string'||p[k].length>(k==='email'?254:100)))throw new Error('Saved draft has invalid fields. Export a backup or discard the draft.');
      if(p.platforms!=null&&(!Array.isArray(p.platforms)||p.platforms.some(k=>!PLATFORMS[k])))throw new Error('Saved draft has invalid platforms. Export a backup or discard the draft.');
    }
    if (key === KEY && Object.keys(validate(p,{legacyIdentity:(p.version||0)<2})).length) throw new Error('Saved setup is incomplete. Review your project details.');
    return p;
  }
  const HISTORY = 'ads:project-history:v1';
  const PROJECT_FOUNDATIONS = ['colors','bg-colors','status-colors','neutral-colors','typography','spacing','sizing','radius','border','border-states','shadow','icons','grid-layout','units','data-format'].map(key=>'ads:'+key);
  const projectId = p => p.id || 'legacy-'+slug(p.project)+'-'+(p.updatedAt || 'initial');
  function readHistory(storage) {
    const raw=storage.getItem(HISTORY);
    if(!raw)return [];
    let data;try{data=JSON.parse(raw);}catch{throw new Error('Project history could not be read. Your saved projects have been preserved.');}
    if(data?.version!==1||!Array.isArray(data.projects)||data.projects.some(row=>!row||typeof row.id!=='string'||!row.profile||!row.foundations||Array.isArray(row.foundations)||typeof row.foundations!=='object'||Object.entries(row.foundations).some(([key,value])=>!PROJECT_FOUNDATIONS.includes(key)||typeof value!=='string')))
      throw new Error('Project history could not be read. Your saved projects have been preserved.');
    const seen=new Set();
    for(const row of data.projects){read({getItem:()=>JSON.stringify(row.profile)});if(seen.has(row.id)||row.id!==projectId(row.profile))throw new Error('Project history contains invalid project identities. Your saved projects have been preserved.');seen.add(row.id);}
    return data.projects;
  }
  function snapshot(storage,p) {
    const foundations={};
    for(const key of PROJECT_FOUNDATIONS){const raw=storage.getItem(key);if(raw!==null)foundations[key]=raw;}
    return {id:projectId(p),profile:{...p,id:projectId(p)},foundations};
  }
  // A deleted project isn't removed immediately - it's marked archivedAt
  // and kept out of the visible list for ARCHIVE_RETENTION_DAYS, a safety
  // net against an accidental (or mis-typed-but-still-confirmed) delete.
  // Purged here, the one place already called on every history render,
  // rather than in readHistory() itself - that stays a pure reader other
  // callers (save(), openProject()) rely on to splice into unchanged.
  const ARCHIVE_RETENTION_DAYS = 7;
  function purgeExpiredArchives(projects) {
    const cutoff=Date.now()-ARCHIVE_RETENTION_DAYS*24*60*60*1000;
    return projects.filter(row=>!row.archivedAt||new Date(row.archivedAt).getTime()>cutoff);
  }
  function listProjects(storage) {
    let projects=readHistory(storage);
    const before=projects.length;
    projects=purgeExpiredArchives(projects);
    if(projects.length!==before)writeProjectRecords(storage,[[HISTORY,JSON.stringify({version:1,projects})]]);
    const current=read(storage);
    if(current){const row=snapshot(storage,current),index=projects.findIndex(item=>item.id===row.id);if(index<0)projects.push(row);else if(!projects[index].archivedAt)projects[index]=row;}
    return projects.filter(row=>!row.archivedAt).sort((a,b)=>String(b.profile.updatedAt||'').localeCompare(String(a.profile.updatedAt||'')));
  }
  // Soft-delete: archives the project's history row (hidden from
  // listProjects(), permanently purged after ARCHIVE_RETENTION_DAYS)
  // instead of removing it outright - the UI's own type-the-project-name
  // confirmation is the deliberate-intent gate; this is the undo window
  // for when that confirmation was still the wrong call. Clears the
  // active profile too when deleting the currently open project, so nothing
  // keeps operating on a project this list no longer shows.
  function deleteProject(storage, id) {
    const projects=readHistory(storage),index=projects.findIndex(item=>item.id===id);
    if(index<0)throw new Error('This project is no longer available. Refresh and try again.');
    if(projects[index].archivedAt)return;
    const current=read(storage),isActive=Boolean(current&&projectId(current)===id);
    if(isActive)projects[index]=snapshot(storage,current);
    projects[index]={...projects[index],archivedAt:new Date().toISOString()};
    const entries=[[HISTORY,JSON.stringify({version:1,projects})]];
    // The active project's Foundation records must not keep theming the app once
    // it is deleted; they stay recoverable only inside the archived history row.
    if(isActive)entries.push([KEY,null],...PROJECT_FOUNDATIONS.map(key=>[key,null]));
    writeProjectRecords(storage,entries);
  }
  // A failed write restores the active profile, archive and Foundation records together.
  function writeProjectRecords(storage,entries) {
    const previous=entries.map(([key])=>[key,storage.getItem(key)]);
    try{for(const [key,value]of entries){if(value===null)storage.removeItem(key);else storage.setItem(key,value);}}
    catch(error){let restored=true;for(const [key,value]of previous){try{if(value===null)storage.removeItem(key);else storage.setItem(key,value);}catch{restored=false;}}
      throw new Error(restored?'Project could not be saved. Your previous project is unchanged.':'Project could not be saved and storage recovery was incomplete. Keep this page open and back up your browser data.');}
  }
  function save(storage, p, options={}) {
    if (Object.keys(validate(p)).length) throw new Error('Review the highlighted fields before saving.');
    if(Object.prototype.hasOwnProperty.call(options,'expectedRaw')&&storage.getItem(KEY)!==options.expectedRaw)throw new Error('Project details changed in another tab. Reload the saved project before saving your edits.');
    if(Object.prototype.hasOwnProperty.call(options,'expectedDraftRaw')&&storage.getItem(DRAFT)!==options.expectedDraftRaw)throw new Error('Project setup changed in another tab. Reload before confirming this conversation.');
    for(const [key,raw]of Object.entries(options.expectedFoundations||{}))if(!PROJECT_FOUNDATIONS.includes(key)||storage.getItem(key)!==raw)throw new Error('Foundation settings changed in another tab. Reload before confirming this conversation.');
    const current=read(storage),projects=readHistory(storage);
    if(current){const row=snapshot(storage,current),index=projects.findIndex(item=>item.id===row.id);if(index<0)projects.push(row);else projects[index]=row;}
    const id=options.newProject||!current?'project-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)):projectId(current);
    const profile = {...p,id,version:SUPPORTED_VERSION,updatedAt:new Date().toISOString()};
    const foundations=options.newProject?{}:snapshot(storage,profile).foundations;
    for(const [key,value]of Object.entries(options.foundationRecords||{})){
      if(!PROJECT_FOUNDATIONS.includes('ads:'+key))throw new Error('Unknown Foundation setting: '+key);
      foundations['ads:'+key]=JSON.stringify(F.migrateRecord(key,value));
    }
    const row={id,profile,foundations};
    const index=projects.findIndex(item=>item.id===id);if(index<0)projects.push(row);else projects[index]=row;
    const entries=[[HISTORY,JSON.stringify({version:1,projects})],[KEY,JSON.stringify(profile)]];
    if(options.newProject)for(const key of PROJECT_FOUNDATIONS)entries.push([key,foundations[key]??null]);
    else for(const key of Object.keys(options.foundationRecords||{}))entries.push(['ads:'+key,foundations['ads:'+key]]);
    if(options.clearDraft)entries.push([DRAFT,null]);
    writeProjectRecords(storage,entries);
    return profile;
  }
  function openProject(storage,id) {
    if(storage.getItem(DRAFT)!==null)throw new Error('You have an unsaved setup draft. Resume or discard it in Project setup before switching projects.');
    const projects=listProjects(storage),row=projects.find(item=>item.id===id);
    if(!row)throw new Error('This project is no longer available. Refresh History and try again.');
    // Validate before touching any active records, including legacy profiles.
    read({getItem:()=>JSON.stringify(row.profile)});
    writeProjectRecords(storage,[[HISTORY,JSON.stringify({version:1,projects})],[KEY,JSON.stringify(row.profile)],...PROJECT_FOUNDATIONS.map(key=>[key,row.foundations[key]??null])]);
    return row.profile;
  }
  const safe = value => String(value || '').replace(/[\r\n]+/g, ' ').replace(/[\\`*_{}\[\]<>#]/g, '\\$&');
  function markdown(profile, tokens, docs = [], includeIdentity = false, defaultedKeys = []) {
    const p = profile || {};
    const lines = ['---', 'project: ' + JSON.stringify(p.project || 'design system'), 'version: "3.5.0-local-draft"', 'generated: ' + JSON.stringify(new Date().toISOString()), 'scope: ' + JSON.stringify(docs.length ? 'documentation-and-context' : 'project-context'), '---', '', '# ' + safe(p.project || 'design system'), '', '## Product context', '', '- Product: ' + safe(p.productType === 'Other' ? p.productOther : p.productType || 'Not configured'), '- Delivery role: ' + safe(p.role === 'Other' ? p.roleOther : p.role || 'Not configured')];
    if (includeIdentity) lines.push('- Owner: ' + safe(p.name), '- Email: ' + safe(p.email), '- Designation: ' + safe(p.designation));
    lines.push('', '## Target platforms', '');
    for (const key of p.platforms || []) if (PLATFORMS[key]) lines.push('### ' + PLATFORMS[key].label, '', PLATFORMS[key].guidance, '');
    lines.push('## Agent instructions', '', '- Use the saved foundation values below. Reuse documented components and semantic tokens.', '- Keep accessible names, keyboard behavior, focus management, and loading, empty, error and success states explicit.', '- Support reduced motion, text resizing, localization and touch input.', '- Treat demo states as illustrations; verify interactive behavior in the implementation.', '- Native mobile and desktop targets require platform-specific component implementations.', '- This is a local working snapshot. It does not imply a published npm package, authenticated account, or backend service.', '', '## Saved foundation values', '', '```json', JSON.stringify(tokens, (key,value)=>key==='dataUrl'&&value?'[Binary asset omitted; obtain Foundation JSON]':value, 2), '```', '');
    // Every key above is a complete, concrete value either way - defaulted
    // keys are the documented default itself (not a placeholder), not an
    // "invent something reasonable" instruction. Named explicitly so a
    // recipient knows which values reflect a real choice versus which are
    // this system's own stated default, rather than treating all of them
    // as equally customized.
    lines.push(defaultedKeys.length
      ? 'Provenance: ' + defaultedKeys.map(k => '`' + k + '`').join(', ') + (defaultedKeys.length === 1 ? ' is' : ' are') + ' this system\'s own documented default because a usable saved override was not found. Resolved dependencies also contain library defaults.'
      : 'Provenance: selected non-null source records are usable overrides. Records named in verification.unsavedPreviewKeys are unsaved previews. Resolved dependencies also contain library and project-context defaults, which do not imply explicit saves.');
    // Foundation audit NP09 - "No complete... validation/provenance/asset
    // manifest travels through the immediate export path... AI: invents
    // missing values." Provenance (above) already says which tokens are
    // defaulted; this section names the things that aren't tokens at all -
    // an incomplete/absent profile, a free-text product/role with no
    // system-recommended default behind it, and visual assets this
    // text-only export plainly cannot carry - so a recipient (human or AI)
    // sees these as open items to resolve, not silently invents a value to
    // fill the gap.
    const openDecisions = [];
    if(tokens.verification?.unsavedPreviewKeys?.length)openDecisions.push('Unsaved local previews are included for '+tokens.verification.unsavedPreviewKeys.join(', ')+'. These values are not durable browser saves; save successfully before treating them as approved workspace settings.');
    if (!profile) {
      openDecisions.push('No project setup was saved for this export - every value above is this system\'s own plain documented default, not a decision made for this project.');
    } else {
      if (p.productType === 'Other') openDecisions.push('Product type is free text ("' + safe(p.productOther || '') + '") - this system has no recommended Spacing/Radius/Grid & Layout default for an undefined category; those sections reflect their plain global defaults unless separately customized.');
      if (p.role === 'Other') openDecisions.push('Role is free text ("' + safe(p.roleOther || '') + '") - the role-specific guidance this app shows after setup assumes one of its own named roles, and does not have a tailored version for this one.');
    }
    const assets=(tokens.icons?.uploads||[]).map(asset=>({name:asset.name,kind:'icon reference',packagedIn:'Foundation JSON'}));
    for(const role of ['primaryFont','secondaryFont']) {const font=tokens.typography?.[role];if(font?.family)assets.push({role,family:font.family,source:font.source,stylesheet:font.linkHref||null,packagedIn:font.dataUrl?'Foundation JSON':null});}
    lines.push('', '## Asset manifest', '', 'Uploaded files are preserved in Foundation JSON. This Markdown identifies dependencies without embedding large binary data. Icon references require review before inline reuse.', '', '```json', JSON.stringify({schemaVersion:1,namedIcons:F.iconCatalog,assets},null,2), '```');
    openDecisions.push('Rendered browser, font decoding, forced-color, zoom and assistive-technology acceptance require separate evidence; a valid saved record does not certify these checks.');
    lines.push('', '## Validation & open decisions', '', ...openDecisions.map(d => '- ' + d));
    for (const doc of docs) lines.push('', '---', '', '## ' + safe(doc.title), '', 'Source: ' + doc.file + ' · Status: ' + doc.status, '', doc.markdown);
    const resolved=tokens.resolvedThemes?.light||F.resolve(tokens,'light',profile);
    const prefixes={typography:['--type-'],spacing:['--space-'],sizing:['--size-'],radius:['--radius-'],border:['--border-width-'],'border-states':['--focus-ring-width'],shadow:['--shadow-'],icons:['--icon-size'],'grid-layout':['--grid-gutter']};
    const names=Object.keys(resolved.tokens).filter(name=>Object.keys(tokens).some(key=>(prefixes[key]||[]).some(prefix=>name.startsWith(prefix))));
    lines.push('', F.contractMarkdown());
    return F.prepareMarkdown(lines.join('\n'),resolved,names);
  }
  return {KEY,DRAFT,HISTORY,PROJECT_FOUNDATIONS,projectId,listProjects,openProject,deleteProject,ARCHIVE_RETENTION_DAYS,FOUNDATION_STEPS,foundationReadiness,PRODUCTS,ROLES,PLATFORMS,validate,slug,read,save,markdown};
});
