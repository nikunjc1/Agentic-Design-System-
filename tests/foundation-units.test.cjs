const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const M = require('../foundation-model.js');
const ROOT = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

// Execute the production DOM-ready handler and native-event handlers with a
// small DOM fixture. This verifies event ordering, not rendered geometry.
function boot(page, { unit = 'px', failWrite = false, typography = null } = {}) {
  const ready = [], events = new EventTarget(), store = new Map(), writes = [], downloads = [];
  store.set('ads:units', JSON.stringify({ unit }));
  if (typography) store.set('ads:typography', JSON.stringify(typography));
  let exportBlob;
  class Element {
    constructor(tag) {
      this.tagName = tag.toUpperCase(); this.nodeType = 1; this.children = []; this.dataset = {}; this.attrs = new Map(); this.listeners = new Map(); this.className = ''; this.value = ''; this.textContent = '';
      const props = new Map(); this.style = { fontSize: '', getPropertyValue: k => props.get(k) || '', setProperty: (k, v) => props.set(k, v), removeProperty: k => props.delete(k) };
      this.classList = { contains: c => this.className.split(' ').includes(c), add: c => { this.className += ' ' + c; }, remove() {}, toggle() {} };
    }
    get parentElement() { return this.parent || null; }
    get isConnected() { return !!this.parent; }
    append(...nodes) { nodes.forEach(n => { this.children.push(n); n.parent = this; }); }
    appendChild(node) { this.append(node); return node; }
    prepend(...nodes) { nodes.forEach(n => { n.parent = this; }); this.children.unshift(...nodes); }
    before(node) { this.parent.children.splice(this.parent.children.indexOf(this), 0, node); node.parent = this.parent; }
    after(node) { this.parent.children.splice(this.parent.children.indexOf(this) + 1, 0, node); node.parent = this.parent; }
    replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
    set innerHTML(value) { if (value.includes('class="ads-live-grid"')) { const grid = new Element('div'); grid.className = 'ads-live-grid'; this.append(grid); } }
    setAttribute(k, v) { this.attrs.set(k, String(v)); }
    getAttribute(k) { return this.attrs.get(k) ?? null; }
    hasAttribute(k) { return this.attrs.has(k); }
    removeAttribute(k) { this.attrs.delete(k); }
    cloneNode() { const copy = new Element(this.tagName); Object.assign(copy.dataset, this.dataset); copy.attrs = new Map(this.attrs); for (const k of ['value', 'type', 'className', 'disabled']) copy[k] = this[k]; return copy; }
    matches(selectors) { return selectors.split(',').some(raw => {
      const s = raw.trim();
      if (s.startsWith('.')) return this.classList.contains(s.slice(1));
      if (s === '[data-foundation-unit]') return 'foundationUnit' in this.dataset;
      if (s === '[data-foundation-export]') return 'foundationExport' in this.dataset;
      if (s === 'input[data-dimension]') return this.tagName === 'INPUT' && 'dimension' in this.dataset;
      if (s === '[data-unit-display]') return 'unitDisplay' in this.dataset;
      return this.tagName.toLowerCase() === s;
    }); }
    closest(s) { return this.matches(s) ? this : this.parent?.closest(s) || null; }
    querySelector(s) { if (s.startsWith(':scope > ')) return this.children.find(c => c.matches(s.slice(9))) || null; return this.querySelectorAll(s)[0] || null; }
    querySelectorAll(s) { return walk(this).slice(1).filter(c => c.matches(s)); }
    addEventListener(type, fn) { const list = this.listeners.get(type) || []; list.push(fn); this.listeners.set(type, list); }
    dispatchEvent(event) {
      Object.defineProperty(event, 'target', { value: this, configurable: true });
      for (let node = this; node; node = event.bubbles && !event.cancelBubble ? node.parent : null) for (const fn of node.listeners.get(event.type) || []) fn(event);
      return !event.defaultPrevented;
    }
    click() { if (this.tagName === 'A') downloads.push(this.download); this.dispatchEvent(new Event('click', { bubbles: true })); }
  }
  function walk(el) { return [el, ...el.children.flatMap(walk)]; }
  const root = new Element('html'), body = new Element('body'), main = new Element('main'), lede = new Element('p');
  lede.className = 'page-lede'; main.append(lede); body.append(main); root.append(body);
  const dimension = new Element('input'); dimension.type = 'number'; dimension.value = '8'; dimension.dataset.dimension = ''; dimension.dataset.role = 'letter-spacing'; dimension.setAttribute('min', '-16'); dimension.setAttribute('max', '64'); dimension.setAttribute('step', '0.5'); main.append(dimension);
  const count = new Element('input'); count.type = 'number'; count.value = '12'; main.append(count);
  const document = { documentElement: root, body: null, activeElement: null,
    addEventListener(type, fn) { if (type === 'DOMContentLoaded') ready.push(fn); },
    createElement: tag => new Element(tag), createDocumentFragment: () => new Element('fragment'),
    createTreeWalker: () => ({ nextNode: () => false }),
    querySelector: s => s === 'main' ? main : null,
    querySelectorAll: s => main.querySelectorAll(s),
  };
  class CE extends Event { constructor(name, options) { super(name); this.detail = options?.detail; } }
  const window = { ADSFoundationModel: M, addEventListener: events.addEventListener.bind(events), dispatchEvent: events.dispatchEvent.bind(events) };
  const context = vm.createContext({ window, document, location: { pathname: '/' + page, href: 'https://example.test/' + page },
    localStorage: { getItem: k => store.get(k) || null, setItem(k, v) { if (failWrite) throw new Error('Storage unavailable'); writes.push(k); store.set(k, v); } },
    MutationObserver: class { observe() {} }, Event, CustomEvent: CE, Node: { TEXT_NODE: 3 }, NodeFilter: { SHOW_TEXT: 4 },
    queueMicrotask, setTimeout: () => 0, clearTimeout() {}, console: { warn() {} }, Blob,
    URL: class extends URL { static createObjectURL(blob) { exportBlob = blob; return 'blob:test'; } static revokeObjectURL() {} },
  });
  vm.runInContext(source('foundation-runtime.js'), context);
  const foundationReady=ready.slice();
  vm.runInContext(source('shell.js'), context); // Real shared persistence, including failure handling.
  const firstPaint = window.ADSFoundation.get();
  document.body = body; foundationReady.forEach(fn=>fn());
  const radios = () => main.querySelectorAll('[data-foundation-unit]');
  const pair = () => dimension.parent.children.find(c => c.className === 'ads-unit-control');
  function chooseRadio(unit, type = 'input') { const radio = radios().find(r => r.value === unit); radios().forEach(r => { r.checked = r === radio; }); radio.dispatchEvent(new Event(type, { bubbles: true })); }
  return { window, document, main, store, writes, downloads, dimension, count, radios, pair, chooseRadio, firstPaint, exportBlob: () => exportBlob };
}

test('native radio input applies before change/autosave; JSON exports the chosen unit', async () => {
  const f = boot('typography.html'); let editorEvents = 0;
  f.main.addEventListener('input', () => { editorEvents++; f.window.ADSFoundation.apply(); });
  f.chooseRadio('rem');
  assert.equal(f.window.ADSFoundation.get().unit, 'rem', 'selection applies synchronously');
  assert.equal(f.document.documentElement.dataset.foundationUnit, 'rem');
  assert.deepEqual(f.radios().filter(r => r.checked).map(r => r.value), ['rem']);
  assert.equal(f.pair().children[0].value, 0.5);
  assert.equal(editorEvents, 0, 'unit presentation must not trigger typography autosave');
  f.chooseRadio('rem', 'change'); await Promise.resolve();
  assert.deepEqual(f.writes, ['ads:units'], 'input/change sequence saves once');
  f.main.querySelector('[data-foundation-export]').click();
  const payload = JSON.parse(await f.exportBlob().text());
  assert.equal(payload.settings.units.unit, 'rem'); assert.equal(payload.resolved.unit, 'rem');
  assert.deepEqual(f.downloads, ['damco-foundation.json']);
  f.chooseRadio('px'); assert.equal(f.window.ADSFoundation.get().unit, 'px'); assert.equal(f.pair().children[0].value, 8);
  assert.equal(boot('spacing.html', { unit: JSON.parse(f.store.get('ads:units')).unit }).window.ADSFoundation.get().unit, 'px');
});

test('local dimension selector converts values/ranges and sends only canonical edits to the editor', () => {
  const f = boot('typography.html'), [display, select] = f.pair().children; let editorEvents = 0;
  f.main.addEventListener('input', () => { editorEvents++; });
  f.document.activeElement = display;
  select.value = 'rem'; select.dispatchEvent(new Event('input', { bubbles: true }));
  assert.equal(display.value, 0.5, 'focused display still converts when the unit changes');
  assert.equal(select.value, 'rem'); assert.equal(f.dimension.value, '8');
  assert.equal(display.getAttribute('min'), '-1'); assert.equal(display.getAttribute('max'), '4'); assert.equal(display.getAttribute('step'), '0.03125');
  select.dispatchEvent(new Event('change', { bubbles: true })); assert.equal(editorEvents, 0);
  display.value = '-0.125'; display.dispatchEvent(new Event('input', { bubbles: true }));
  assert.equal(f.dimension.value, -2); assert.equal(editorEvents, 1, 'canonical edit bubbles exactly once');
  select.value = 'px'; select.dispatchEvent(new Event('change', { bubbles: true }));
  assert.equal(display.value, -2); assert.equal(f.dimension.value, -2);
  assert.equal(f.count.hidden, undefined, 'unitless counts remain native'); assert.equal(f.count.value, '12');
  display.value = ''; display.dispatchEvent(new Event('input', { bubbles: true })); assert.equal(f.dimension.value, '');
});

test('toolbar appears only on Foundation pages, and units only on dimensional Foundations', () => {
  const unitPages = ['typography.html', 'grid-layout.html', 'spacing.html', 'radius.html', 'borders.html', 'shadows.html', 'icons.html'];
  const foundationPages = [...unitPages, 'foundations.html', 'ai-foundation.html'];
  const pages = fs.readdirSync(ROOT).filter(file => file.endsWith('.html'));
  for (const page of pages) {
    const f = boot(page, { unit: 'rem' });
    assert.equal(!!f.main.querySelector('.ads-foundation-toolbar'), foundationPages.includes(page), page);
    assert.equal(!!f.main.querySelector('[data-foundation-export]'), foundationPages.includes(page), page);
    assert.equal(f.radios().length, unitPages.includes(page) ? 2 : 0, page);
    assert.equal(f.window.ADSFoundation.get().unit, 'rem', 'all pages inherit dimensional tokens: ' + page);
    assert.equal(f.pair().children[0].value, 0.5, 'local dimensions still work: ' + page);
  }
});

test('a failed unit save shows the shared warning and retains an honest unsaved preview', () => {
  const f = boot('spacing.html', { failWrite: true });
  f.chooseRadio('rem');
  assert.equal(f.window.ADSStorage.lastWriteSucceeded, false);
  assert.equal(JSON.parse(f.store.get('ads:units')).unit, 'px');
  assert.equal(f.window.ADSFoundation.get().unit, 'rem');
  assert.equal(f.window.ADSFoundation.read('units').unit, 'rem');
  assert.match(f.document.body.querySelector('.ads-storage-notice').textContent, /couldn't be saved/);
  assert.deepEqual(f.radios().filter(r => r.checked).map(r => r.value), ['rem']);
});

test('legacy heading scales restore before first paint, save once and permit subsequent custom edits', async () => {
  const typography = { primaryFont: { family: 'Lora' }, levels: { h1: { size: 'display-xs', color: '#123456' }, h2: { size: 'display-sm' }, paragraph: { size: 'text-lg' }, caption: { size: 'text-2xs' } } };
  const f = boot('new-project.html', { typography, unit: 'rem' });
  assert.equal(f.firstPaint.tokens['--type-h1-size'], '2rem'); assert.equal(f.firstPaint.tokens['--type-h2-size'], '1.75rem');
  assert.deepEqual(f.writes, ['ads:typography']);
  const saved = JSON.parse(f.store.get('ads:typography'));
  assert.equal(saved.headingScaleVersion, 2); assert.equal(saved.levels.h1.color, '#123456'); assert.equal(saved.levels.paragraph.size, 'text-lg');
  const reload = boot('typography.html', { typography: saved }); assert.deepEqual(reload.writes, []);
  saved.levels.h1.size = 'display-xl'; reload.window.ADSFoundationEditor.beginEdit(); reload.window.ADSStorage.safeSet('ads:typography', saved); await Promise.resolve();
  assert.equal(reload.window.ADSFoundation.get().tokens['--type-h1-size'], '60px');
  assert.equal(boot('overview.html', { typography: saved }).firstPaint.tokens['--type-h1-size'], '60px');
  const unsaved = boot('new-project.html', { typography, failWrite: true });
  assert.equal(unsaved.window.ADSFoundation.get().tokens['--type-h1-size'], '32px');
  assert.equal(JSON.parse(unsaved.store.get('ads:typography')).headingScaleVersion, undefined);
  assert.equal(unsaved.window.ADSStorage.lastWriteSucceeded, false);
});
