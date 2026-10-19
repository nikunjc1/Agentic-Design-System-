const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const F = require('../foundation-model.js');
const P = require('../project-model.js');
const ROOT = path.resolve(__dirname, '..');

test('Markdown pairs explicit px/rem, fractions, zero, tracking and type shorthand without changing recipes', () => {
  const source = '# Prompt\nSize: 24/32px. Tracking: -1.5px. Radius: .5px. Zero: 0px. Gap: 1.25rem.\n' +
    'Keep 50%, 1.5 line-height, 400 weight and 150ms.\n```css\n.demo { padding:24px; border:1.5px solid #123456; }\n```\n' +
    '```json\n{"width":"1.25rem"}\n```\nhttps://example.com/999px/icon.svg';
  const output = F.prepareMarkdown(source);
  assert.ok(output.startsWith(source));
  for (const [px, rem] of [[-1.5,-.09375],[0,0],[.5,.03125],[1.5,.09375],[20,1.25],[24,1.5],[32,2]]) {
    assert.ok(output.includes('| `'+px+'px` | `'+rem+'rem` |'), px);
  }
  assert.ok(output.includes('1rem = 16px'));
  assert.ok(!output.includes('| `999px`'));
  assert.ok(!output.includes('| `400px`'));
  assert.ok(!output.includes('| `150px`'));
  assert.equal(F.prepareMarkdown(output),output);
  assert.equal(F.prepareMarkdown('# Colors\n#FFFFFF, 50%, 4.5:1.'),'# Colors\n#FFFFFF, 50%, 4.5:1.');
  assert.equal(F.dimensionPair(1.5),'1.5px (0.09375rem)');
  assert.equal(F.dimensionPair(36 * 1.22),'43.92px (2.745rem)');
});

test('Markdown resolves live tokens and compound shadows equally in px and rem', () => {
  const saved = { typography:{levels:{body:{size:'text-xl',letterSpacing:-1.5}}}, radius:{philosophy:'soft'}, shadow:{philosophy:'balanced'} };
  const px = F.resolve({...saved,units:{unit:'px'}}),rem = F.resolve({...saved,units:{unit:'rem'}});
  const prompt='Use var(--type-body-size), var(--type-body-tracking), var(--radius-md) and var(--shadow-md).';
  assert.equal(F.prepareMarkdown(prompt,px),F.prepareMarkdown(prompt,rem));
  const out=F.prepareMarkdown(prompt,rem);
  assert.ok(out.includes('| `--type-body-size` | `20px` | `1.25rem` |'));
  assert.ok(out.includes('| `--type-body-tracking` | `-1.5px` | `-0.09375rem` |'));
  assert.ok(out.includes('| `--radius-md` | `12px` | `0.75rem` |'));
  assert.ok(out.includes('| `--shadow-md` |'));
  assert.ok(out.includes('0.25rem'));
});

test('project Markdown includes selected Foundation dimensions and keeps its saved JSON parseable', () => {
  const saved = { typography:{levels:{h1:{size:'display-lg'},caption:{size:'text-2xs'}}}, sizing:{control:44,content:1200}, units:{unit:'rem'} };
  const out=P.markdown(null,saved,[{title:'Input',file:'input.html',status:'Available',markdown:'Field height: 40px.'}]);
  assert.deepEqual(JSON.parse(out.match(/```json\n([\s\S]*?)\n```/)[1]),saved);
  assert.ok(out.includes('| `--type-h1-size` | `48px` | `3rem` |'));
  assert.ok(out.includes('| `--type-caption-size` | `11px` | `0.6875rem` |'));
  assert.ok(out.includes('| `--size-content` | `1200px` | `75rem` |'));
  assert.ok(out.includes('| `40px` | `2.5rem` |'));
  assert.ok(!out.includes('| `--radius-md`'));
});

test('production Input Copy prompt uses dual units while Copy code stays code', () => {
  const resolved=F.resolve({units:{unit:'rem'}}),window={ADSFoundationModel:F,ADSFoundation:{get:()=>resolved,prepareMarkdown:text=>F.prepareMarkdown(text,resolved),preparePageMarkdown:text=>F.prepareMarkdown(text,resolved),prepareCode:text=>F.prepareCode(text,resolved)}};
  const source=fs.readFileSync(path.join(ROOT,'input-detail.js'),'utf8').replace(/\}\)\(\);\s*$/, 'window.testPrompt=buildFullPrompt;window.testCode=buildFullCode;})();');
  vm.runInNewContext(source,{window,document:{documentElement:{},addEventListener(){},querySelector(){return null;},querySelectorAll(){return [];}},getComputedStyle:()=>({getPropertyValue:name=>resolved.tokens[name]||''})});
  const prompt=window.testPrompt();
  assert.ok(prompt.includes('Dimensions: px and rem'));
  assert.ok(prompt.includes('| `24px` | `1.5rem` |'));
  const code=window.testCode();
  assert.ok(code.includes('Include theme.css'));
  assert.ok(!code.includes('Dimensions: px and rem'));
});
