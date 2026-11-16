/* Foundation integrity checks: the "no broken dependencies, duplicated
   definitions, conflicting tokens, invalid configurations, or undocumented
   overrides" half of the governance checklist, as three concrete, objective
   checks (not fuzzy semantic judgment calls):

   1. Duplicate keys in the generated primitives literal (foundation-model.js)
      - a second "--same-name" in one theme's object literal silently wins
      and the first is unrecoverable; JSON.parse gives no warning, so this
      has to be caught by scanning the raw source text, not the parsed object.
   2. Dead/unresolvable var(--token) references anywhere in the site - a
      reference to a name that is neither a real resolved Foundation token
      nor a locally-declared component-scoped custom property. This is the
      general form of the --color-danger bug found and fixed in
      component-workbench.css this session (a token that was never real,
      silently masked by its own hardcoded fallback).
   3. Circular alias chains (A's value references B, B's references A) -
      CSS custom properties resolve to their initial value (not a graceful
      fallback) when a cycle exists, so this is a real, severe class of bug
      even though none were expected to exist yet.

   Usage: node tools/foundation-integrity.cjs [--json]

   What this does NOT check (said plainly, not silently skipped):
   - Semantic conflicts (e.g. two differently-named tokens that resolve to
     indistinguishable colors) - that requires a design judgment call this
     script won't fabricate.
   - Whether an intentional multi-step override (e.g. --border-width-1 set
     once from a primitive, then again from a saved Border record in
     resolve()) is correct - only the generated *primitives* literal is
     checked for duplicates, since that's the one place a repeated key can
     never be intentional. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const M = require('../foundation-model.js');

function collectSourceFiles() {
  const flat = fs.readdirSync(ROOT).filter(f => /\.(html|js|css)$/.test(f) && fs.statSync(path.join(ROOT, f)).isFile());
  const figma = fs.existsSync(path.join(ROOT, 'figma-plugin'))
    ? fs.readdirSync(path.join(ROOT, 'figma-plugin')).filter(f => /\.js$/.test(f)).map(f => 'figma-plugin/' + f)
    : [];
  return [...flat, ...figma];
}

// ---------- 1. Duplicate keys in the generated primitives literal ----------
function findDuplicatePrimitiveKeys() {
  const text = fs.readFileSync(path.join(ROOT, 'foundation-model.js'), 'utf8');
  const start = text.indexOf('/* BEGIN GENERATED PRIMITIVES */');
  const end = text.indexOf('/* END GENERATED PRIMITIVES */');
  if (start === -1 || end === -1) throw new Error('Could not locate the generated primitives block markers in foundation-model.js - have they been renamed?');
  const block = text.slice(start, end);
  const splitAt = block.indexOf('"dark":{');
  if (splitAt === -1) throw new Error('Could not locate the light/dark split in the primitives block - has its shape changed?');
  const segments = { light: block.slice(0, splitAt), dark: block.slice(splitAt) };
  const duplicates = [];
  for (const [theme, segment] of Object.entries(segments)) {
    const counts = new Map();
    for (const match of segment.matchAll(/"(--[\w-]+)"\s*:/g)) counts.set(match[1], (counts.get(match[1]) || 0) + 1);
    for (const [token, count] of counts) if (count > 1) duplicates.push({ theme, token, count });
  }
  return duplicates;
}

// ---------- shared: resolved tokens + locally-declared custom properties ----------
function resolvedTokenNames() {
  const light = Object.keys(M.resolve({}, 'light', null).tokens);
  const dark = Object.keys(M.resolve({}, 'dark', null).tokens);
  return new Set([...light, ...dark]);
}

// Custom properties that are legitimately NOT Foundation tokens: declared
// directly in a CSS ruleset (component-scoped, e.g. a card's own --tilt) or
// set at runtime via element.style.setProperty(...) (instance/layout state,
// e.g. --setup-context-height). Both are valid var() targets that this
// script must not flag as dead just because resolve() doesn't know them.
function locallyDeclaredCustomProperties(files) {
  const names = new Set();
  for (const file of files) {
    if (!/\.(css|js)$/.test(file)) continue;
    let text;
    try { text = fs.readFileSync(path.join(ROOT, file), 'utf8'); } catch { continue; }
    if (file.endsWith('.js')) for (const m of text.matchAll(/styles\[\s*['"](--[\w-]+)['"]\s*\]\s*=/g)) names.add(m[1]);
    if (file.endsWith('.css')) for (const m of text.matchAll(/(?:^|[;{\s])(--[\w-]+)\s*:/g)) names.add(m[1]);
    for (const m of text.matchAll(/setProperty\(\s*['"](--[\w-]+)/g)) names.add(m[1]);
  }
  return names;
}

// Tokens that are only sometimes present in resolve()'s output, by design -
// e.g. --border-state-hover only exists once a matching ads:border-states
// record has been saved with that state's color (foundation-model.js's
// per-state loop). resolvedTokenNames() below resolves against an empty
// saved object (nothing configured), so these legitimately don't appear
// there even though every real reference to them already carries a safe
// fallback for exactly that reason (verified against foundation.css during
// the Borders audit earlier this session) - flagging them here would be
// re-reporting something already investigated and confirmed fine, not a
// new finding.
const CONDITIONAL_TOKENS = /^--border-state-(?!focus$)[\w-]+$/;

function stripComments(text, isCss) {
  // Blank out comment characters without touching embedded newlines, or a
  // multi-line /* */ block collapses onto one line and every subsequent
  // line number this script reports (file:line in the findings below) comes
  // out shifted - silently wrong by exactly the number of lines blanked.
  let out = text.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  if (!isCss) out = out.replace(/(^|[^:])\/\/.*$/gm, (m, pre) => pre + ' '.repeat(m.length - pre.length));
  return out;
}

// changelog.js is pure historical content (window.ADSChangelog's entry
// bodies are prose describing past changes, e.g. "a token whose raw value
// matches `var(--other-token)`" as an illustrative example) - not live code
// or CSS that renders anything, so a var()-shaped string inside it is
// documentation text, never an actual dead reference. Verified by reading
// the matched lines in context before excluding, not assumed.
const CONTENT_ONLY_FILES = new Set(['changelog.js']);

// ---------- 2. Dead/unresolvable var() references ----------
function findDeadReferences(files, knownNames) {
  const hits = [];
  for (const file of files) {
    if (CONTENT_ONLY_FILES.has(file)) continue;
    let text;
    try { text = fs.readFileSync(path.join(ROOT, file), 'utf8'); } catch { continue; }
    text = stripComments(text, file.endsWith('.css'));
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      // Require a well-formed var(--name) or var(--name, fallback) call -
      // the name must be immediately followed by "," or ")" (allowing
      // whitespace). Without this, a dynamically-built token name split
      // across a JS string concatenation - e.g. 'var(--button-primary-bg-'
      // + state + ')' in component-contract-runtime.js - gets misread as a
      // literal, truncated token name ending at the closing quote, which
      // is never a real bug, just this script misunderstanding JS source.
      for (const m of line.matchAll(/var\(\s*(--[\w-]+)(?=\s*[,)])/g)) {
        if (CONDITIONAL_TOKENS.test(m[1])) continue;
        if (!knownNames.has(m[1])) hits.push({ file, line: i + 1, token: m[1], text: line.trim().slice(0, 160) });
      }
    });
  }
  return hits;
}

// ---------- 3. Circular alias chains among real Foundation tokens ----------
// Classic white/gray/black DFS: a node reached while still "gray" (on the
// current recursion stack) is a genuine cycle, reported once with its exact
// path. A value can reference more than one other token (e.g. a shadow
// combining two var() calls), so every reference is followed, not just the
// first - a cycle hiding behind a value's second or third var() would
// otherwise go undetected.
function findCircularAliases() {
  const light = M.resolve({}, 'light', null).tokens, dark = M.resolve({}, 'dark', null).tokens;
  const names = new Set([...Object.keys(light), ...Object.keys(dark)]);
  const directRefs = new Map();
  for (const name of names) {
    const value = light[name] ?? dark[name] ?? '';
    directRefs.set(name, [...String(value).matchAll(/var\(\s*(--[\w-]+)/g)].map(m => m[1]));
  }
  const color = new Map(), cycles = [], reported = new Set();
  function visit(node, stack) {
    color.set(node, 'gray'); stack.push(node);
    for (const next of directRefs.get(node) || []) {
      if (!names.has(next)) continue; // unresolved ref - already caught by the dead-reference check
      if (color.get(next) === 'gray') {
        const start = stack.indexOf(next);
        const cyclePath = [...stack.slice(start), next];
        const key = [...new Set(cyclePath)].sort().join('|');
        if (!reported.has(key)) { reported.add(key); cycles.push(cyclePath); }
      } else if (!color.get(next)) visit(next, stack);
    }
    stack.pop(); color.set(node, 'black');
  }
  for (const name of names) if (!color.get(name)) visit(name, []);
  return cycles;
}

function main() {
  const json = process.argv.includes('--json');
  const files = collectSourceFiles();
  const duplicates = findDuplicatePrimitiveKeys();
  const knownNames = new Set([...resolvedTokenNames(), ...locallyDeclaredCustomProperties(files)]);
  const deadReferences = findDeadReferences(files, knownNames);
  const circular = findCircularAliases();

  if (json) { console.log(JSON.stringify({ duplicates, deadReferences, circular }, null, 2)); return; }

  console.log('Foundation integrity check');

  console.log('\n1. Duplicate keys in the generated primitives literal: ' + duplicates.length);
  for (const d of duplicates) console.log('   ⚠ --' + d.token.replace(/^--/, '') + ' defined ' + d.count + ' times in theme "' + d.theme + '" - only the last one survives, the rest are silently dead.');
  if (!duplicates.length) console.log('   none found.');

  console.log('\n2. Dead/unresolvable var() references: ' + deadReferences.length);
  const byToken = new Map();
  for (const hit of deadReferences) { if (!byToken.has(hit.token)) byToken.set(hit.token, []); byToken.get(hit.token).push(hit); }
  for (const [token, hits] of byToken) {
    console.log('   ⚠ ' + token + ' is not a real Foundation token and not locally declared anywhere - any fallback value is what actually renders:');
    for (const h of hits) console.log('       ' + h.file + ':' + h.line + '  ' + h.text);
  }
  if (!deadReferences.length) console.log('   none found.');

  console.log('\n3. Circular alias chains: ' + circular.length);
  for (const cycle of circular) console.log('   ⚠ ' + cycle.join(' → '));
  if (!circular.length) console.log('   none found.');

  const total = duplicates.length + deadReferences.length + circular.length;
  console.log('\n' + (total ? total + ' integrity issue(s) found.' : 'No integrity issues found by these three checks.'));
  console.log('(Semantic conflicts - distinct tokens resolving to visually indistinguishable');
  console.log('values - are a design judgment call this script does not attempt to automate.)');
  if (total) process.exitCode = 1;
}

main();
