const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const M = require('../foundation-model.js');
const ROOT = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

// Exercise the production shared-page script without a browser connection.
test('section Group Buttons identify one reading location and repeated card links stay navigational', () => {
  const created = [];
  class Node {
    constructor(tag, text = '') { this.tagName = tag.toUpperCase(); this.textContent = text; this.children = []; this.dataset = {}; this.attrs = new Map(); this.listeners = new Map(); this.className = ''; this.clientHeight = 600; this.measuredHeight = 72; this.style = { setProperty: (name,value) => this.attrs.set(name,value) }; this.classList = { contains: c => this.className.split(' ').includes(c), add: (...cs) => { this.className += ' ' + cs.join(' '); }, toggle: (c,on) => { const classes=new Set(this.className.split(' '));if(on)classes.add(c);else classes.delete(c);this.className=[...classes].join(' '); } }; }
    getBoundingClientRect() { return { height:this.measuredHeight }; }
    append(...nodes) { nodes.forEach(n => { this.children.push(n); n.parent = this; }); }
    prepend(...nodes) { nodes.forEach(n => { n.parent = this; }); this.children.unshift(...nodes); }
    after(n) { const i = this.parent.children.indexOf(this); this.parent.children.splice(i + 1, 0, n); n.parent = this.parent; }
    before(n) { const i = this.parent.children.indexOf(this); this.parent.children.splice(i, 0, n); n.parent = this.parent; }
    remove() { this.parent.children.splice(this.parent.children.indexOf(this),1);this.parent=null; }
    setAttribute(k, v) { this.attrs.set(k, v); }
    getAttribute(k) { return k === 'href' ? this.href : this.attrs.get(k); }
    removeAttribute(k) { this.attrs.delete(k); }
    addEventListener(k, fn) { const prev=this.listeners.get(k);this.listeners.set(k,e=>{prev?.(e);fn(e);}); }
    scrollIntoView() { this.scrolled = true; }
    focus() { this.focused = true; }
    click() { this.listeners.get('click')?.(); }
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
  const document = { readyState: 'complete', body, documentElement:{dir:'ltr'},addEventListener(){}, querySelector: selector => selector === 'main' ? main : null, querySelectorAll: () => [], createElement(tag) { const n = new Node(tag); created.push(n); return n; } };
  let observer, bannerObserver;
  const events=new Map(),location={ pathname: '/overview.html', hash: '#section-2' };
  const context=vm.createContext({
    window: { ADSProject: { read: () => null }, ADSFoundationModel: M,addEventListener:(type,fn)=>events.set(type,fn) }, document, localStorage: {}, location,
    requestAnimationFrame: fn => fn(), IntersectionObserver: class { constructor(callback, options) { observer = { callback, options, observed: [] }; } observe(node) { observer.observed.push(node); } },
    ResizeObserver: class { constructor(callback) { bannerObserver = { callback, observed:[] }; } observe(node) { bannerObserver.observed.push(node); } disconnect() { bannerObserver.disconnected=true; } },
  });
  vm.runInContext(source('shell.js'), context);
  vm.runInContext(source('experience.js'), context);
  const banner = created.find(n => n.classList.contains('setup-context'));
  assert.equal(banner.dataset.floating,'true');
  assert.equal(main.attrs.get('--setup-context-height'),'72px');
  assert.deepEqual(bannerObserver.observed,[banner,main]);
  banner.measuredHeight=120;bannerObserver.callback();
  assert.equal(main.attrs.get('--setup-context-height'),'120px');
  main.clientHeight=200;bannerObserver.callback();
  assert.equal(banner.dataset.floating,'false');
  assert.equal(main.attrs.get('--setup-context-height'),'0px');
  main.clientHeight=600;bannerObserver.callback();
  assert.equal(banner.dataset.floating,'true');
  const close = created.find(n=>n.classList.contains('setup-close'));
  assert.equal(close.tagName,'BUTTON');assert.equal(close.type,'button');
  assert.equal(close.getAttribute('aria-label'),'Close project banner');
  assert.equal(banner.children[1].children.at(-1),close);
  close.click();
  assert.equal(main.children.includes(banner),false);
  assert.equal(main.attrs.get('--setup-context-height'),'0px');
  assert.equal(bannerObserver.disconnected,true);assert.equal(main.focused,true);
  bannerObserver.callback();
  assert.equal(main.attrs.get('--setup-context-height'),'0px');
  const nav = created.find(n => n.tagName === 'NAV'),group=nav.children[0],links = group.children;
  assert.equal(nav.attrs.get('aria-label'), 'On this page');
  assert.equal(group.attrs.get('role'),'group');assert.equal(group.attrs.get('aria-label'),'Page sections');
  assert.equal(links[0].textContent, 'Overview');
  links.forEach((a, i) => { assert.equal(a.tagName,'BUTTON');assert.equal(a.type,'button');assert.match(a.className, /group-btn-segment/);assert.equal(a.dataset.sectionTarget,headings[i].id); });
  const current = () => links.filter(a => a.attrs.get('aria-current') === 'location');
  assert.deepEqual(current(), [links[1]]);
  links[0].listeners.get('click')(); assert.deepEqual(current(), [links[0]]);
  assert.equal(location.hash,'section-1');assert.equal(headings[0].scrolled,true);
  assert.equal(links[0].attrs.get('aria-pressed'),'true');assert.equal(links[0].tabIndex,0);assert.equal(links[1].tabIndex,-1);
  assert.equal(observer.options.root, main); assert.deepEqual(observer.observed, sections);
  observer.callback([{ target: sections[2], isIntersecting: true }]); assert.deepEqual(current(), [links[2]]);
  assert.equal(links[2].classList.contains('is-selected'),true);
  location.hash='#section-2';events.get('hashchange')();assert.deepEqual(current(),[links[1]]);
  let prevented=false;group.listeners.get('keydown')({target:links[1],key:'End',preventDefault(){prevented=true;}});
  assert.equal(prevented,true);assert.equal(links[2].focused,true);assert.deepEqual(current(),[links[2]]);
  document.documentElement.dir='rtl';group.listeners.get('keydown')({target:links[2],key:'ArrowRight',preventDefault(){}});assert.deepEqual(current(),[links[1]]);
  cards.forEach(card => { assert.equal(card.attrs.has('role'), false); assert.equal(card.attrs.has('tabindex'), false); const a = card.children[0]; assert.match(a.className, /btn-demo--primary/); assert.equal(a.href, card.dataset.detailHref); });
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
