const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const M = require('../foundation-model.js');

// Supply measured geometry to test the production state machine. Visual line
// wrapping still needs a browser check; it is not simulated by these assertions.
// Consecutive eligible paragraphs share one clamp/button (an "article"), so
// each independent prose fixture below gets its own parent container -
// otherwise they would merge with each other, which is exactly what the
// dedicated grouping scenario at the end deliberately tests instead.
test('only prose over four lines gets a toggle; helper readouts keep their layout and resize stays synchronized', () => {
  const allCreated = [];
  class Element {
    constructor(tag, text = '') {
      this.tagName = tag; this.textContent = text; this.children = []; this.dataset = {}; this.attrs = new Map(); this.listeners = new Map(); this.props = new Map(); this.style = { setProperty: (k, v) => this.props.set(k, v) }; this.classes = new Set();
      this.classList = { contains: c => this.classes.has(c), remove: c => this.classes.delete(c), toggle: (c, on) => { if (on) this.classes.add(c); else this.classes.delete(c); } };
      allCreated.push(this);
    }
    set className(value) { this.classes = new Set(value.split(' ')); }
    get className() { return [...this.classes].join(' '); }
    get firstChild() { return this.children[0]; }
    get parentElement() { return this.parent || null; }
    get nextElementSibling() { if (!this.parent) return null; return this.parent.children[this.parent.children.indexOf(this) + 1] || null; }
    append(...nodes) { nodes.forEach(n => { if (n.parent) n.parent.children.splice(n.parent.children.indexOf(n), 1); this.children.push(n); n.parent = this; }); }
    before(node) { if (node.parent) node.parent.children.splice(node.parent.children.indexOf(node), 1); this.parent.children.splice(this.parent.children.indexOf(this), 0, node); node.parent = this.parent; }
    after(node) { if (node.parent) node.parent.children.splice(node.parent.children.indexOf(node), 1); this.parent.children.splice(this.parent.children.indexOf(this) + 1, 0, node); node.parent = this.parent; }
    insertBefore(newNode, referenceNode) { if (newNode.parent) newNode.parent.children.splice(newNode.parent.children.indexOf(newNode), 1); const idx = this.children.indexOf(referenceNode); this.children.splice(idx, 0, newNode); newNode.parent = this; }
    remove() { this.parent.children.splice(this.parent.children.indexOf(this), 1); this.parent = null; }
    querySelector(s) { return this.children.find(n => n.classes.has(s.slice(1))) || null; }
    closest(selectors) { return selectors.includes('[class*="-demo-"]') && (this.demoContext || this.className.includes('-demo-')) ? this : null; }
    matches(selectors) { return selectors.split(',').some(s => s.startsWith('.') && this.classes.has(s.slice(1))); }
    setAttribute(k, v) { this.attrs.set(k, v); }
    getAttribute(k) { return this.attrs.get(k); }
    addEventListener(k, fn) { this.listeners.set(k, fn); }
    getClientRects() { return this.visible === false ? [] : [{}]; }
    // Deliberately mimic a browser reporting only the clamped scroll height.
    // A group wrapper's height is the sum of its member paragraphs' own
    // (unclamped) heights - a single-member group behaves exactly like the
    // member's own height, matching the old per-element measurement.
    get scrollHeight() {
      const height = this.tagName === 'p' ? this.height : this.children.reduce((sum, c) => sum + (c.height || 0), 0);
      return this.classes.has('ads-text-clamped') ? Math.min(height, 4 * line) : height;
    }
  }
  let line = 20, scheduled;
  // Each isolated prose fixture gets its own parent so none of them merge -
  // the dedicated grouping scenario below covers paragraphs that should.
  const paragraphs = [20, 80, 100, 200].map(height => {
    const parent = new Element('div');
    const p = new Element('p', 'Documentation paragraph'); p.height = height; p.append(new Element('text', p.textContent));
    parent.append(p);
    return p;
  });
  const readouts = ['color-contrast', 'color-popover-contrast', 'color-rgba', 'guide-subhead', 'component-meta', 'save-status', 'theme-pair-label', 'system-card-scale', 'alert-demo-description'].map(cls => { const p = new Element('p', 'Structured result and labels'); p.className = cls; p.height = 200; p.append(new Element('span', 'Label'), new Element('span', 'Value')); return p; });
  for (const display of ['flex', 'grid', 'inline-flex', 'inline-grid']) { const p = new Element('p', 'Structured layout'); p.height = 200; p.display = display; p.append(new Element('span', 'Value'), new Element('span', 'Badge')); readouts.push(p); }
  const preview = new Element('p', 'Component preview prose'); preview.height = 200; preview.demoContext = true; preview.append(new Element('span', preview.textContent)); readouts.push(preview);
  const callbacks = new Map(), styles = new Map(), events = new EventTarget();
  class Resize { constructor(fn) { this.fn = fn; } observe(el) { callbacks.set(el, this.fn); } }
  class CE extends Event { constructor(name, options) { super(name); this.detail = options?.detail; } }
  const root = { dataset: {}, style: { getPropertyValue: k => styles.get(k) || '', setProperty: (k, v) => styles.set(k, v), removeProperty: k => styles.delete(k) } };
  const document = {
    documentElement: root, body: null, addEventListener() {}, createElement: tag => new Element(tag), querySelector: () => null,
    querySelectorAll: s => {
      if (s === 'main p, main .usage-desc, main .guide-copy, main .system-card-desc') return [...paragraphs, ...readouts];
      if (s === 'main .ads-text-content[data-ads-group]') return allCreated.filter(el => el.parent && el.classes.has('ads-text-content') && el.dataset.adsGroup === 'true');
      return [];
    },
  };
  const window = { ADSFoundationModel: M, ResizeObserver: Resize, addEventListener: events.addEventListener.bind(events), dispatchEvent: events.dispatchEvent.bind(events) };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'foundation-runtime.js'), 'utf8'), { window, document, localStorage: { getItem: () => null }, location: { href: 'https://example.test/foundations.html', pathname: '/foundations.html' }, CustomEvent: CE, MutationObserver: class { observe() {} }, ResizeObserver: Resize, queueMicrotask, setTimeout: fn => { scheduled = fn; return 1; }, clearTimeout() {}, URL, getComputedStyle: el => ({ lineHeight: line + 'px', fontSize: '14px', display: el.display || 'block' }) });
  document.body = {}; window.ADSFoundation.apply(); scheduled();
  readouts.forEach(p => { assert.equal(p.dataset.adsClamp, undefined); assert.equal(p.querySelector('.ads-text-content'), null); assert.equal(p.children.length, p === preview ? 1 : 2, 'Structured layout children must remain direct children'); });
  // A wrapped paragraph becomes a child of its group wrapper (its own former
  // parent), rather than gaining the clamp span as its own child.
  const content = p => (p.parentElement && p.parentElement.dataset.adsGroup === 'true') ? p.parentElement : null;
  const button = p => { const c = content(p); return c ? c.nextElementSibling : null; };
  paragraphs.forEach((p, i) => {
    if (i < 2) { assert.equal(button(p), null); assert.equal(content(p), null); assert.equal(p.children.length, 1); return; }
    assert.equal(button(p).hidden, false);
    assert.equal(button(p).getAttribute('aria-expanded'), 'false');
    assert.equal(button(p).textContent, 'Read More');
    assert.equal(content(p).classList.contains('ads-text-clamped'), i >= 2);
    assert.equal(content(p).props.get('--ads-clamp-height'), '80px');
    assert.equal(button(p).getAttribute('aria-controls'), content(p).id);
    assert.equal(p.children.length, 1, 'The paragraph itself keeps only its own original content');
  });
  const p = paragraphs[2]; let c = content(p), b = button(p);
  const resize = p => { callbacks.get(p)(); scheduled(); };
  b.listeners.get('click')(); assert.equal(b.textContent, 'Read Less'); assert.equal(b.getAttribute('aria-expanded'), 'true'); assert.equal(c.classList.contains('ads-text-clamped'), false);
  b.listeners.get('click')(); assert.equal(b.textContent, 'Read More'); assert.equal(c.classList.contains('ads-text-clamped'), true);
  // Keyboard navigation must be able to reveal links in collapsed prose.
  c.listeners.get('focusin')(); assert.equal(b.textContent, 'Read Less');
  b.listeners.get('click')(); // back to collapsed, so the resize checks below start from a known state
  p.height = 80; resize(p); assert.equal(button(p), null); assert.equal(content(p), null); assert.equal(p.children.length, 1);
  p.height = 160; resize(p); c = content(p); b = button(p); assert.equal(b.hidden, false); assert.equal(b.textContent, 'Read More'); assert.equal(c.classList.contains('ads-text-clamped'), true);
  // Line count follows the chosen typography, not a fixed pixel threshold.
  line = 40; resize(p); assert.equal(button(p), null); assert.equal(content(p), null);
  p.visible = false; p.height = 240; resize(p); assert.equal(button(p), null);
  p.visible = true; resize(p); assert.equal(button(p).hidden, false);
  paragraphs[0].height = 200; resize(paragraphs[0]); assert.equal(button(paragraphs[0]).textContent, 'Read More', 'Short prose must become expandable after narrowing');
  p.display = 'flex'; resize(p); assert.equal(content(p), null); assert.equal(button(p), null); assert.equal(p.children.length, 1, 'Switching to a structured layout must restore original content');
  p.display = 'block'; resize(p); assert.equal(button(p).hidden, false);
  scheduled(); paragraphs.forEach(p => assert.equal(content(p) !== null, p.height > line * 4, 'Repeated scans must not add another toggle'));

  // Grouping: consecutive eligible siblings share one clamp and one button,
  // combined against the same 4-line budget, instead of each getting its own.
  const article = new Element('div');
  const short = new Element('p', 'Short line'); short.height = 20; short.append(new Element('text', short.textContent));
  const long1 = new Element('p', 'Long paragraph one'); long1.height = 80; long1.append(new Element('text', long1.textContent));
  const long2 = new Element('p', 'Long paragraph two'); long2.height = 80; long2.append(new Element('text', long2.textContent));
  article.append(short, long1, long2);
  paragraphs.push(short, long1, long2);
  scheduled();
  assert.equal(content(short), content(long1), 'Adjacent eligible paragraphs share one wrapper');
  assert.equal(content(long1), content(long2));
  assert.equal(content(short).children.length, 3, 'The wrapper holds all three original paragraphs');
  assert.equal(button(short).hidden, false, '20+80+80=180 total exceeds the 160px (4*40) limit only once combined');
  // Collapsing the whole group affects every member at once - there is only one button.
  assert.equal([...article.children].filter(c => c.classes && c.classes.has('ads-read-more')).length, 1);
});
