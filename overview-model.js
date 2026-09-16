/* Local prototype domain model. No network delivery or access control is implied. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.OverviewModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const KEY = 'ads:workspace:v1';
  const DAY = 86400000;
  const TYPES = {
    css: { name: 'CSS Variables', icon: '{ }', description: 'Reusable colors, spacing and typography for your stylesheets.', file: 'tokens.css' },
    npm: { name: 'NPM Package', icon: 'npm', description: 'A package manifest preview for a future developer installation.', file: 'package.json' },
    figma: { name: 'Figma Library', icon: '◈', description: 'A library handoff preview for designers working in Figma.', file: 'figma-library.json' }
  };
  const ROLES = ['Designer', 'Developer', 'Product Manager', 'Design System Lead', 'Other'];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const normalize = value => String(value).trim().replace(/\s+/g, ' ').toLowerCase();
  const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
  const id = () => globalThis.crypto?.randomUUID?.() || `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const blank = () => ({version: 1, projects: []});
  function validateProject(input, projects) {
    const errors = {};
    if (!input.project?.trim()) errors.project = 'Enter a project name.';
    else if (input.project.trim().length > 80) errors.project = 'Use 80 characters or fewer.';
    else if (projects.some(p => normalize(p.project) === normalize(input.project))) errors.project = 'A project with this name already exists. Choose another name or open the existing project.';
    if (!input.name?.trim()) errors.name = 'Enter your name.';
    if (!validEmail(input.email?.trim() || '')) errors.email = 'Enter a valid email address, such as jordan@example.com.';
    if (!ROLES.includes(input.role)) errors.role = 'Select your role.';
    if (input.role === 'Other' && !input.jobTitle?.trim()) errors.jobTitle = 'Enter your job title.';
    return errors;
  }
  function project(input) {
    return {id: id(), project: input.project.trim(), name: input.name.trim(), email: input.email.trim(), role: input.role, jobTitle: input.role === 'Other' ? input.jobTitle.trim() : '', createdAt: Date.now(), resources: [], invites: []};
  }
  function resource(p, type, content, failure = '') {
    return {id: id(), type, createdAt: Date.now(), generatedBy: p.name, status: failure ? 'failed' : 'ready', error: failure, content: failure ? '' : content, expiresAt: Date.now() + 30 * DAY};
  }
  function status(r, now = Date.now()) { return r.status === 'ready' && r.expiresAt <= now ? 'expired' : r.status; }
  function inviteStatus(invite, now = Date.now()) { return invite.status === 'accepted' ? 'accepted' : invite.expiresAt <= now ? 'expired' : 'pending'; }
  function latest(p, type) { return [...p.resources].reverse().find(r => r.type === type); }
  function validateInvite(p, email, access) {
    if (!validEmail(email)) throw new Error('Enter a valid email address.');
    if (!['Viewer', 'Editor'].includes(access)) throw new Error('Select Viewer or Editor access.');
    if (normalize(email) === normalize(p.email)) throw new Error('You already own this project. Invite someone else.');
    const existing = p.invites.find(i => normalize(i.email) === normalize(email));
    if (existing) throw new Error(inviteStatus(existing) === 'accepted' ? 'This person is already a member.' : 'This person already has an invitation. Use Resend in Members.');
  }
  function invite(p, email, access) {
    validateInvite(p, email, access);
    return {id: id(), email, access, status: 'pending', createdAt: Date.now(), expiresAt: Date.now() + 7 * DAY};
  }
  function validateStore(data) {
    if (!data || data.version !== 1 || !Array.isArray(data.projects)) throw new Error('Unrecognized saved workspace. Your original data has been preserved.');
    const string = v => typeof v === 'string';
    for (const p of data.projects) {
      if (!p || ![p.id,p.project,p.name,p.email,p.role].every(string) || !Number.isFinite(p.createdAt) || !Array.isArray(p.resources) || !Array.isArray(p.invites)) throw new Error('Some saved project data could not be read. Your original data has been preserved.');
      for (const r of p.resources) if (!r || ![r.id,r.generatedBy,r.content].every(string) || !TYPES[r.type] || !['ready','failed','expired'].includes(r.status) || !Number.isFinite(r.createdAt) || !Number.isFinite(r.expiresAt)) throw new Error('Saved resource data could not be read. Your original data has been preserved.');
      for (const i of p.invites) if (!i || ![i.id,i.email].every(string) || !['Viewer','Editor'].includes(i.access) || !['pending','accepted'].includes(i.status) || !Number.isFinite(i.expiresAt)) throw new Error('Saved invitation data could not be read. Your original data has been preserved.');
    }
    return data;
  }
  function load(storage) {
    const raw = storage.getItem(KEY);
    if (raw !== null) return validateStore(JSON.parse(raw));
    const data = blank();
    const old = JSON.parse(storage.getItem('ads:link-history') || '[]');
    const profile = JSON.parse(storage.getItem('ads:copy-profile') || 'null');
    if (!Array.isArray(old)) throw new Error('Legacy history could not be read. Original records were preserved.');
    if (profile && !old.some(p => p.slug === profile.slug)) old.unshift(profile);
    for (const item of old.slice().reverse()) {
      if (!item || !['project','name','email','role','slug'].every(k => typeof item[k] === 'string')) throw new Error('Legacy history could not be read. Original records were preserved.');
      if (data.projects.some(p => p.id === item.slug)) continue;
      const p = {...project({...item, jobTitle: ''}), id: item.slug, createdAt: Number(item.ts) || Date.now(), legacy: true};
      p.resources = Object.keys(TYPES).map(type => ({...resource(p,type,''),status:'expired',createdAt:p.createdAt,expiresAt:0,error:'Legacy placeholder link. Generate a new preview to access this resource.'}));
      data.projects.push(p);
    }
    return data;
  }
  function save(storage, data) { storage.setItem(KEY, JSON.stringify(validateStore(data))); }
  function publicSnapshot(p, resourceId) {
    const resources = resourceId ? p.resources.filter(r => r.id === resourceId) : Object.keys(TYPES).map(t => latest(p,t)).filter(Boolean);
    return {version:1, project:p.project, createdAt:Date.now(), expiresAt:Date.now()+30*DAY, resources:resources.map(({id,type,status:state,content,createdAt,expiresAt}) => ({id,type,status:state,content,createdAt,expiresAt}))};
  }
  function validateSnapshot(s) {
    if (!s || s.version !== 1 || typeof s.project !== 'string' || s.project.length > 80 || !Number.isFinite(s.expiresAt) || !Array.isArray(s.resources) || s.resources.length > 3) throw new Error('This shared link is invalid. Ask the owner for a new snapshot.');
    if (s.expiresAt <= Date.now()) throw new Error('This shared snapshot has expired. Ask the owner for a new link.');
    for (const r of s.resources) if (!r || !TYPES[r.type] || typeof r.id !== 'string' || typeof r.content !== 'string' || r.content.length > 50000 || !['ready','failed','expired'].includes(r.status) || !Number.isFinite(r.expiresAt) || !Number.isFinite(r.createdAt)) throw new Error('This shared resource could not be read. Ask the owner for a new link.');
    return s;
  }
  return {KEY, DAY, TYPES, ROLES, escape, normalize, validEmail, blank, project, resource, latest, status, inviteStatus, validateProject, invite, load, save, publicSnapshot, validateSnapshot};
});
