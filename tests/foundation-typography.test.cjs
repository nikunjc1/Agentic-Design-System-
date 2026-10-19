const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const M = require('../foundation-model.js');
const ROOT = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('inline text uses every role metric; semantic headings cannot inherit a Body recipe', () => {
  const roles = ['h1','h2','h3','h4','h5','h6','body','paragraph','caption'];
  const elements = roles.map(role => ({
    tagName: role.startsWith('h') ? role.toUpperCase() : 'SPAN',
    style: { fontSize: 'var(--type-' + (role.startsWith('h') ? 'body' : role) + '-size)', fontFamily: 'Georgia', fontWeight: '900', fontStyle: 'normal', lineHeight: '1', letterSpacing: '5px', color: 'var(--text-hi)' },
    closest: () => null, matches: () => false,
  }));
  const semanticColor = { tagName: 'SPAN', style: { ...elements[8].style, color: 'var(--danger-500)' }, closest: () => null, matches: () => false };
  const mono = { tagName: 'SPAN', style: { ...elements[8].style, fontFamily: 'var(--font-mono)' }, closest: () => null, matches: () => false };
  const specimen = { tagName: 'P', style: { fontSize: '30px', fontFamily: 'Lora' }, closest: () => true, matches: () => false };
  const saved = { headingScaleVersion: 2, levels: Object.fromEntries(roles.map(role => [role, { size: 'text-xl', weight: '500', italic: true, lineHeightPct: '180', letterSpacing: -0.5, color: '#123456' }])) };
  const props = new Map(), events = new EventTarget();
  const root = { dataset: {}, style: { getPropertyValue: k => props.get(k) || '', setProperty: (k,v) => props.set(k,v), removeProperty: k => props.delete(k) } };
  const document = { documentElement: root, body: null, addEventListener() {}, querySelector: () => null,
    querySelectorAll: s => s === 'main [style]' ? [...elements, semanticColor, mono, specimen] : [],
  };
  class CE extends Event { constructor(type, options) { super(type); this.detail = options?.detail; } }
  const window = { ADSFoundationModel: M, addEventListener: events.addEventListener.bind(events), dispatchEvent: events.dispatchEvent.bind(events) };
  vm.runInNewContext(source('foundation-runtime.js'), { window, document,
    localStorage: { getItem: key => key === 'ads:typography' ? JSON.stringify(saved) : null },
    location: { pathname: '/new-project.html', href: 'https://example.test/new-project.html' },
    CustomEvent: CE, MutationObserver: class { observe() {} }, queueMicrotask, setTimeout: () => 0, clearTimeout() {}, URL,
  });
  document.body = {}; window.ADSFoundation.apply();
  roles.forEach((role,i) => {
    for (const [property,suffix] of Object.entries({ fontFamily:'family',fontSize:'size',fontWeight:'weight',fontStyle:'style',lineHeight:'line-height',letterSpacing:'tracking',color:'color' })) {
      assert.equal(elements[i].style[property], 'var(--type-' + role + '-' + suffix + ')');
    }
    assert.equal(props.get('--type-' + role + '-size'), '20px');
    assert.equal(props.get('--type-' + role + '-style'), 'italic');
  });
  assert.equal(semanticColor.style.color, 'var(--danger-500)');
  assert.equal(mono.style.fontFamily, 'var(--font-mono)');
  assert.equal(specimen.style.fontFamily, 'Lora'); assert.equal(specimen.style.fontSize, '30px');
});

test('shared CSS binds complete roles, protects metadata and keeps code monospace', () => {
  const css = source('foundation.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([,selector,body]) => ({ selector: selector.trim(), body }));
  for (const role of ['h1','h2','h3','h4','h5','h6','body','paragraph','caption']) {
    const rule = rules.find(r => r.body.includes('font-size:var(--type-' + role + '-size)'));
    assert.ok(rule, role);
    for (const property of ['family','size','weight','style','line-height','tracking']) assert.ok(rule.body.includes('--type-' + role + '-' + property), role + ' ' + property);
  }
  assert.match(css, /\.app-main :is\(p,\.page-lede[^}]+--type-paragraph-line-height/);
  assert.match(css, /\.guide-body-text\):not\(:where\(\[class\*="-demo-"\]/, 'paragraph defaults must not recolor component specimens');
  assert.match(css, /\.app-main :is\(\.setup-error,\.input-demo-error\)\{color:var\(--type-error-color\)/, 'validation must retain its semantic error color');
  assert.ok(rules.some(r => r.selector.includes('.setup-help') && r.selector.startsWith('.app-main') && r.body.includes('--type-caption-size')));
  assert.ok(rules.some(r => r.selector.includes('.guide-machine-json') && r.selector.startsWith('.app-main') && r.body === 'font-family:var(--font-mono)'));
  assert.doesNotMatch(source('experience.css'), /\.setup-panel p\{[^}]*line-height:1\.6/);
  assert.doesNotMatch(source('history.html'), /<h2[^>]*--type-body-size/);
});
