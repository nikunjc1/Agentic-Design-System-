const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const M = require('../foundation-model.js');
const ROOT = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

// Exercise the production shared-page script without a browser connection.
test('section links identify one reading location and repeated card links stay navigational', () => {
  const created = [];
  class Node {
    constructor(tag, text = '') { this.tagName = tag.toUpperCase(); this.textContent = text; this.children = []; this.dataset = {}; this.attrs = new Map(); this.listeners = new Map(); this.className = ''; }
    append(...nodes) { nodes.forEach(n => { this.children.push(n); n.parent = this; }); }
    prepend(...nodes) { nodes.forEach(n => { n.parent = this; }); this.children.unshift(...nodes); }
    after(n) { const i = this.parent.children.indexOf(this); this.parent.children.splice(i + 1, 0, n); n.parent = this.parent; }
    before(n) { const i = this.parent.children.indexOf(this); this.parent.children.splice(i, 0, n); n.parent = this.parent; }
    setAttribute(k, v) { this.attrs.set(k, v); }
    getAttribute(k) { return k === 'href' ? this.href : this.attrs.get(k); }
    removeAttribute(k) { this.attrs.delete(k); }
    addEventListener(k, fn) { this.listeners.set(k, fn); }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    closest(tag) { return this.tagName === tag.toUpperCase() ? this : this.parent?.closest(tag); }
  }
  const main = new Node('main'), lede = new Node('p'), body = new Node('body');
  const headings = ['1. Overview', '2. Usage', '3. Accessibility'].map(text => new Node('h2', text));
  const sections = headings.map(h => { const s = new Node('section'); s.append(h); return s; });
  const cards = ['button-primary.html', 'input-outlined.html'].map(href => { const c = new Node('article'); c.dataset.detailHref = href; c.setAttribute('role', 'button'); c.setAttribute('tabindex', '0'); return c; });
  main.append(lede, ...sections, ...cards);
  main.querySelector = selector => selector === ':scope > .page-lede' ? lede : null;
  main.querySelectorAll = selector => selector.startsWith('section > h2') ? headings : selector === '[data-detail-href]' ? cards : [];
  const document = { readyState: 'complete', body, querySelector: selector => selector === 'main' ? main : null, querySelectorAll: () => [], createElement(tag) { const n = new Node(tag); created.push(n); return n; } };
  let observer;
  vm.runInNewContext(source('experience.js'), {
    window: { ADSProject: { read: () => null }, ADSFoundationModel: M }, document, localStorage: {}, location: { pathname: '/overview.html', hash: '#section-2' },
    requestAnimationFrame: fn => fn(), IntersectionObserver: class { constructor(callback, options) { observer = { callback, options, observed: [] }; } observe(node) { observer.observed.push(node); } },
  });
  const nav = created.find(n => n.tagName === 'NAV'), links = nav.children;
  assert.equal(nav.attrs.get('aria-label'), 'On this page');
  assert.equal(links[0].textContent, 'Overview');
  links.forEach((a, i) => { assert.match(a.className, /anchor-demo-link/); assert.doesNotMatch(a.className, /group-btn|btn-primary/); assert.equal(a.href, '#' + headings[i].id); });
  const current = () => links.filter(a => a.attrs.get('aria-current') === 'location');
  assert.deepEqual(current(), [links[1]]);
  links[0].listeners.get('click')(); assert.deepEqual(current(), [links[0]]);
  assert.equal(observer.options.root, main); assert.deepEqual(observer.observed, sections);
  observer.callback([{ target: sections[2], isIntersecting: true }]); assert.deepEqual(current(), [links[2]]);
  cards.forEach(card => { assert.equal(card.attrs.has('role'), false); assert.equal(card.attrs.has('tabindex'), false); const a = card.children[0]; assert.match(a.className, /anchor-demo-link/); assert.doesNotMatch(a.className, /btn-primary/); assert.equal(a.href, card.dataset.detailHref); });
});

test('unit radios preserve both choices through boot, edits, cross-tab changes and reset', async () => {
  const store = new Map([['ads:units', JSON.stringify({ unit: 'rem' })]]), styles = new Map(), events = new EventTarget();
  const radios = ['px', 'rem'].map(value => ({ type: 'radio', value, checked: false }));
  const root = { dataset: {}, style: { getPropertyValue: k => styles.get(k) || '', setProperty: (k, v) => styles.set(k, v), removeProperty: k => styles.delete(k) } };
  const document = { documentElement: root, body: null, addEventListener() {}, querySelectorAll: s => s === '[data-foundation-unit]' ? radios : [], querySelector: () => null };
  class CE extends Event { constructor(name, opts) { super(name); this.detail = opts?.detail; } }
  const window = { ADSFoundationModel: M, addEventListener: events.addEventListener.bind(events), dispatchEvent: events.dispatchEvent.bind(events) };
  vm.runInNewContext(source('foundation-runtime.js'), { window, document, localStorage: { getItem: k => store.get(k) || null }, location: { href: 'https://example.test/overview.html', pathname: '/overview.html' }, MutationObserver: class { observe() {} }, CustomEvent: CE, queueMicrotask, setTimeout: () => 0, clearTimeout() {}, URL });
  const selected = () => radios.filter(r => r.checked).map(r => r.value);
  document.body = {}; window.ADSFoundation.apply(); assert.deepEqual(selected(), ['rem']);
  window.dispatchEvent(new CE('ads:foundation-change', { detail: { key: 'ads:units', value: { unit: 'px' } } })); await Promise.resolve(); assert.deepEqual(selected(), ['px']);
  store.set('ads:units', JSON.stringify({ unit: 'rem' })); const storage = new Event('storage'); storage.key = 'ads:units'; events.dispatchEvent(storage); assert.deepEqual(selected(), ['rem']);
  store.clear(); const clear = new Event('storage'); clear.key = null; events.dispatchEvent(clear); assert.deepEqual(selected(), ['px']);
  assert.deepEqual(radios.map(r => r.value), ['px', 'rem']);
});

test('the shared grid and size overrides respect the documented layout contract', () => {
  const shell = source('shell.css'), foundation = source('foundation.css');
  assert.match(shell, /\.system-card-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4,/);
  for (const [width, count] of [[1440, 3], [1100, 2]]) assert.match(shell, new RegExp('@media\\s*\\(max-width:\\s*' + width + 'px\\)\\s*\\{\\s*\\.system-card-grid\\s*\\{[^}]*repeat\\(' + count + ','));
  assert.match(shell, /@media\s*\(max-width:\s*700px\)\s*\{\s*\.system-card-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
  // A base override must not collapse every documented size into the shared default.
  for (const [, selector, body] of foundation.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (selector.trim() === '.btn-demo' || selector.includes('.input-demo-control,.password-demo-control')) assert.doesNotMatch(body, /height\s*:\s*auto|--size-control/);
  }
  assert.match(foundation, /\.btn-demo--h24 svg\{[^}]*--dimension-12/);
  assert.match(foundation, /\.btn-demo--h56 svg\{[^}]*--dimension-22/);
  assert.match(source('foundation-runtime.js'), /exportButton\.className='btn-demo btn-demo--neutral btn-demo--h40'/);
});
