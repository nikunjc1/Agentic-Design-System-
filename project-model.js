(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ADSProject = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const KEY = 'ads:project-profile:v1';
  const DRAFT = 'ads:project-draft:v1';
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
  const SUPPORTED_VERSION = 1;
  // Same 1-100 character, string-typed, trimmed bound Project name already
  // enforces, and the same bound its own <input maxlength="100"> already
  // shows in the UI - this just makes the model itself the authority on
  // that bound instead of leaving it to "the browser happened to enforce
  // the inputs", so a value restored or imported some other way can't
  // bypass it.
  const isBoundedText = value => typeof value === 'string' && value.trim().length >= 1 && value.trim().length <= 100;
  // Your name/Email/Designation are identity, not configuration - nothing
  // downstream requires them (no account, no email sent, role alone
  // drives the post-save routing) and Markdown only ever includes them
  // when the user separately opts in on MD Export. Required would be
  // friction with no stated purpose, so each is optional but still bound/
  // type-checked *if* provided, the same as every other free-text field.
  function validate(p) {
    const e = {};
    if (!isBoundedText(p.project)) e.project = 'Project name must contain 1–100 characters.';
    for (const [key, label] of [['name','Your name'], ['designation','Designation']]) {
      if (p[key] && !isBoundedText(p[key])) e[key] = label + ' must contain 1–100 characters if provided.';
    }
    if (!PRODUCTS.includes(p.productType)) e.productType = 'Choose the type of product you are creating.';
    if (p.productType === 'Other' && !isBoundedText(p.productOther)) e.productOther = 'Describe your product type in 1–100 characters.';
    if (!ROLES.includes(p.role)) e.role = 'Choose your role in this project.';
    if (p.role === 'Other' && !isBoundedText(p.roleOther)) e.roleOther = 'Describe your role in 1–100 characters.';
    if (p.email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) || p.email.length > 254)) e.email = 'Enter a valid email address, or leave it blank.';
    if (!Array.isArray(p.platforms) || !p.platforms.length || p.platforms.some(k => !PLATFORMS[k])) e.platforms = 'Select at least one target platform.';
    return e;
  }
  const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'design-system';
  function read(storage, key = KEY) {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('Saved setup could not be read. Your saved data has not been changed.');
    if (key === KEY && typeof p.version === 'number' && p.version > SUPPORTED_VERSION) throw new Error('Saved setup was created by a newer version of this app and can’t be read here. Update the app, or start a new setup.');
    if (key === KEY && LEGACY_PRODUCT_MAP[p.productType]) p.productType = LEGACY_PRODUCT_MAP[p.productType];
    if (key === KEY && Object.keys(validate(p)).length) throw new Error('Saved setup is incomplete. Review your project details.');
    return p;
  }
  function save(storage, p) {
    if (Object.keys(validate(p)).length) throw new Error('Review the highlighted fields before saving.');
    const profile = {...p, version:1, updatedAt:new Date().toISOString()};
    storage.setItem(KEY, JSON.stringify(profile));
    return profile;
  }
  const safe = value => String(value || '').replace(/[\r\n]+/g, ' ').replace(/[\\`*_{}\[\]<>#]/g, '\\$&');
  function markdown(profile, tokens, docs = [], includeIdentity = false, defaultedKeys = []) {
    const p = profile || {};
    const lines = ['---', 'project: ' + JSON.stringify(p.project || 'Damco design system'), 'version: "3.4.0-local-draft"', 'generated: ' + JSON.stringify(new Date().toISOString()), 'scope: ' + JSON.stringify(docs.length ? 'documentation-and-context' : 'project-context'), '---', '', '# ' + safe(p.project || 'Damco design system'), '', '## Product context', '', '- Product: ' + safe(p.productType === 'Other' ? p.productOther : p.productType || 'Not configured'), '- Delivery role: ' + safe(p.role === 'Other' ? p.roleOther : p.role || 'Not configured')];
    if (includeIdentity) lines.push('- Owner: ' + safe(p.name), '- Email: ' + safe(p.email), '- Designation: ' + safe(p.designation));
    lines.push('', '## Target platforms', '');
    for (const key of p.platforms || []) if (PLATFORMS[key]) lines.push('### ' + PLATFORMS[key].label, '', PLATFORMS[key].guidance, '');
    lines.push('## Agent instructions', '', '- Use the saved foundation values below. Reuse documented components and semantic tokens.', '- Keep accessible names, keyboard behavior, focus management, and loading, empty, error and success states explicit.', '- Support reduced motion, text resizing, localization and touch input.', '- Treat demo states as illustrations; verify interactive behavior in the implementation.', '- Native mobile and desktop targets require platform-specific component implementations.', '- This is a local working snapshot. It does not imply a published npm package, authenticated account, or backend service.', '', '## Saved foundation values', '', '```json', JSON.stringify(tokens, null, 2), '```', '');
    // Every key above is a complete, concrete value either way - defaulted
    // keys are the documented default itself (not a placeholder), not an
    // "invent something reasonable" instruction. Named explicitly so a
    // recipient knows which values reflect a real choice versus which are
    // this system's own stated default, rather than treating all of them
    // as equally customized.
    lines.push(defaultedKeys.length
      ? 'Provenance: ' + defaultedKeys.map(k => '`' + k + '`').join(', ') + (defaultedKeys.length === 1 ? ' is' : ' are') + ' this system\'s own documented default - everything else above reflects an explicit save.'
      : 'Provenance: every key above reflects an explicit save - nothing here is a documented default standing in for an unset value.');
    for (const doc of docs) lines.push('', '---', '', '## ' + safe(doc.title), '', 'Source: ' + doc.file + ' · Status: ' + doc.status, '', doc.markdown);
    return lines.join('\n');
  }
  return {KEY,DRAFT,PRODUCTS,ROLES,PLATFORMS,validate,slug,read,save,markdown};
});
