(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ADSProject = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const KEY = 'ads:project-profile:v1';
  const DRAFT = 'ads:project-draft:v1';
  const PRODUCTS = ['SaaS', 'Enterprise portal', 'Customer portal', 'Internal tool', 'Commerce', 'Content website', 'Other'];
  const ROLES = ['Designer', 'Developer', 'Product Manager', 'Design System Lead', 'QA / Accessibility', 'Other'];
  const PLATFORMS = {
    'desktop-web': {label: 'Desktop web', guidance: 'Use responsive grids, keyboard navigation, visible focus, and appropriately dense data views. Keep primary actions discoverable at browser zoom.'},
    'mobile-web': {label: 'Mobile web', guidance: 'Use a single-column task flow, touch-friendly controls, persistent field labels, and input types that open the appropriate keyboard. Adapt wide tables to a labelled scroll region or a concise list.'},
    'mobile-app': {label: 'Mobile app', guidance: 'Use native platform navigation, safe-area insets, back gestures, and platform accessibility APIs. Translate semantic tokens to native units; HTML/CSS examples are references, not native components.'},
    'tablet': {label: 'Tablet', guidance: 'Support portrait and landscape, touch and keyboard, split-screen resizing, and adaptive master-detail layouts. Do not rely on hover.'},
    'desktop-app': {label: 'Desktop app', guidance: 'Support window resizing, keyboard shortcuts with visible alternatives, focus restoration, and platform menus. Adapt web components to the chosen desktop framework.'}
  };
  function validate(p) {
    const e = {};
    for (const [key, label] of [['project','Project name'], ['name','Your name'], ['designation','Designation']]) {
      if (typeof p[key] !== 'string' || !p[key].trim() || p[key].trim().length > 100) e[key] = label + ' must contain 1–100 characters.';
    }
    if (!PRODUCTS.includes(p.productType)) e.productType = 'Choose the type of product you are creating.';
    if (p.productType === 'Other' && !p.productOther?.trim()) e.productOther = 'Describe your product type.';
    if (!ROLES.includes(p.role)) e.role = 'Choose your role in this project.';
    if (p.role === 'Other' && !p.roleOther?.trim()) e.roleOther = 'Describe your role.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email || '') || p.email.length > 254) e.email = 'Enter a valid email address.';
    if (!Array.isArray(p.platforms) || !p.platforms.length || p.platforms.some(k => !PLATFORMS[k])) e.platforms = 'Select at least one target platform.';
    return e;
  }
  const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'design-system';
  function read(storage, key = KEY) {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('Saved setup could not be read. Your saved data has not been changed.');
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
  function markdown(profile, tokens, docs = [], includeIdentity = false) {
    const p = profile || {};
    const lines = ['---', 'project: ' + JSON.stringify(p.project || 'Damco design system'), 'version: "3.4.0-local-draft"', 'generated: ' + JSON.stringify(new Date().toISOString()), 'scope: ' + JSON.stringify(docs.length ? 'documentation-and-context' : 'project-context'), '---', '', '# ' + safe(p.project || 'Damco design system'), '', '## Product context', '', '- Product: ' + safe(p.productType === 'Other' ? p.productOther : p.productType || 'Not configured'), '- Delivery role: ' + safe(p.role === 'Other' ? p.roleOther : p.role || 'Not configured')];
    if (includeIdentity) lines.push('- Owner: ' + safe(p.name), '- Email: ' + safe(p.email), '- Designation: ' + safe(p.designation));
    lines.push('', '## Target platforms', '');
    for (const key of p.platforms || []) if (PLATFORMS[key]) lines.push('### ' + PLATFORMS[key].label, '', PLATFORMS[key].guidance, '');
    lines.push('## Agent instructions', '', '- Use the saved foundation values below. Reuse documented components and semantic tokens.', '- Keep accessible names, keyboard behavior, focus management, and loading, empty, error and success states explicit.', '- Support reduced motion, text resizing, localization and touch input.', '- Treat demo states as illustrations; verify interactive behavior in the implementation.', '- Native mobile and desktop targets require platform-specific component implementations.', '- This is a local working snapshot. It does not imply a published npm package, authenticated account, or backend service.', '', '## Saved foundation values', '', '```json', JSON.stringify(tokens, null, 2), '```', '', 'Values not saved by the user use the documented defaults.');
    for (const doc of docs) lines.push('', '---', '', '## ' + safe(doc.title), '', 'Source: ' + doc.file + ' · Status: ' + doc.status, '', doc.markdown);
    return lines.join('\n');
  }
  return {KEY,DRAFT,PRODUCTS,ROLES,PLATFORMS,validate,slug,read,save,markdown};
});
