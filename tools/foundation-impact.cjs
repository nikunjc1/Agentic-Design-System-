/* Foundation impact assessment: given a token (or a whole Foundation page's
   category of tokens), reports every alias token that would also change and
   every file that references any of them - so a Foundation edit's blast
   radius is visible before the edit is made, not discovered after.

   Usage:
     node tools/foundation-impact.cjs --border-width-1
     node tools/foundation-impact.cjs border-width-1            (leading -- optional)
     node tools/foundation-impact.cjs --category borders.html
     node tools/foundation-impact.cjs --category border         (page key or file name)
     node tools/foundation-impact.cjs --list-categories
     add --json to any of the above for machine-readable output

   What this does NOT do (stated instead of silently skipped):
   - Figma: the Figma bridge (figma-plugin/adapter.js) binds whatever
     var(--token) names a captured contract happens to contain, at draw
     time - it never hardcodes token names in its own source, so a static
     text scan of figma-plugin/ will never find a token reference there.
     Real Figma impact depends on which component contracts get re-captured
     and redrawn after the change, which this script cannot determine
     without actually running the plugin. Call this gap out, don't paper
     over it with a false "0 references, not affected".
   - Runtime behavior: this is a static reference scan (which files mention
     the token), not a visual regression check. Pair with
     tools/check-component-workbench.cjs + release_check.sh for that. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const M = require('../foundation-model.js');

// Mirrors foundation-runtime.js's own pageScopes - which Foundation editor
// page owns which token names, and which localStorage record keys that page
// edits. Kept as a literal copy (not required from the browser-only runtime
// file) the same way tools/audit-foundation-controls.cjs mirrors
// editorScopes, with a comment pointing back at the source of truth so the
// two don't silently drift apart.
const PAGE_SCOPES = {
  'foundations.html': [['colors', 'bg-colors', 'status-colors', 'neutral-colors'], /^--(?:color-(?:brand|action-|surface-|text-)|red-|green-|amber-|danger-|blue-|graphite-|control-border|button-primary-text)/],
  'grid-layout.html': [['grid-layout', 'sizing'], /^--(?:grid-|size-)/],
  'typography.html': [['typography'], /^--(?:type-|font-)/],
  'spacing.html': [['spacing', 'sizing'], /^--(?:space-(?:2|4|6|8|10|12|14|16|24|32|40|48|64|label-gap|helper-gap|field-gap|icon-gap|panel-padding|group-gap)$|size-)/],
  'radius.html': [['radius'], /^--radius-(?:sm|md|lg|full)$/],
  'borders.html': [['border', 'border-states'], /^--(?:border-|control-border|focus-ring|color-focus)/],
  'shadows.html': [['shadow'], /^--shadow-/],
  'icons.html': [['icons', 'sizing'], /^--(?:icon-|size-)/],
  'ai-foundation.html': [['status-colors', 'bg-colors'], /^--(?:agent-|color-ai-|color-agent-|green-|amber-|danger-)/]
};

// Known infrastructure files get a readable label instead of showing up as
// an undifferentiated filename - everything else flat in ROOT ending in
// .html is treated as a component/foundation page (this site has no nested
// page directories; verified via `find . -maxdepth 1 -type d`).
const FILE_LABELS = {
  'foundation-model.js': 'Foundation core (token model)',
  'foundation-runtime.js': 'Foundation core (apply/cascade engine)',
  'shell.css': 'Shell / global chrome',
  'experience.css': 'Shared experience shell',
  'experience.js': 'Shared experience shell',
  'foundation.css': 'Shared Foundation editor chrome',
  'component-workbench.css': 'Customize workbench (Preview Board + sidebar)',
  'component-workbench.js': 'Customize workbench (Preview Board + sidebar)',
  'component-contract-model.js': 'Component contract model'
};

function labelFor(file) {
  if (FILE_LABELS[file]) return FILE_LABELS[file];
  if (file.startsWith('figma-plugin/')) return 'Figma bridge';
  if (/-detail\.js$/.test(file)) return 'Component logic';
  if (file.endsWith('.html')) return 'Component / Foundation page';
  return 'Other';
}

function collectSourceFiles() {
  const flat = fs.readdirSync(ROOT).filter(f => /\.(html|js|css)$/.test(f) && fs.statSync(path.join(ROOT, f)).isFile());
  const figma = fs.existsSync(path.join(ROOT, 'figma-plugin'))
    ? fs.readdirSync(path.join(ROOT, 'figma-plugin')).filter(f => /\.js$/.test(f)).map(f => 'figma-plugin/' + f)
    : [];
  return [...flat, ...figma];
}

// Default-resolved token maps for both themes - the actual value a token
// takes with nothing overridden. Token presence/absence and aliasing
// (var(--other-token)) only need one representative resolve() call per
// theme; per-theme VALUE differences aren't needed for impact analysis.
function resolvedTokens() {
  const light = M.resolve({}, 'light', null).tokens;
  const dark = M.resolve({}, 'dark', null).tokens;
  return { light, dark, names: new Set([...Object.keys(light), ...Object.keys(dark)]) };
}

// Alias graph: token A "depends on" token B if A's resolved value is (or
// contains) var(--B). Changing B's underlying value therefore also changes
// everything that transitively depends on it.
function buildDependents(tokens) {
  const dependents = new Map(); // token -> Set of tokens whose value references it
  for (const name of tokens.names) {
    const value = tokens.light[name] ?? tokens.dark[name] ?? '';
    for (const match of String(value).matchAll(/var\(\s*(--[\w-]+)/g)) {
      const dep = match[1];
      if (!dependents.has(dep)) dependents.set(dep, new Set());
      dependents.get(dep).add(name);
    }
  }
  return dependents;
}

function transitiveAffected(seedTokens, dependents) {
  const affected = new Set(seedTokens);
  const queue = [...seedTokens];
  while (queue.length) {
    const current = queue.shift();
    for (const dep of dependents.get(current) || []) {
      if (!affected.has(dep)) { affected.add(dep); queue.push(dep); }
    }
  }
  return affected;
}

function findReferences(affectedTokens, files) {
  const byFile = new Map();
  for (const file of files) {
    const full = path.join(ROOT, file);
    let text;
    try { text = fs.readFileSync(full, 'utf8'); } catch { continue; }
    const lines = text.split('\n');
    const hits = [];
    lines.forEach((line, i) => {
      for (const token of affectedTokens) {
        if (line.includes('var(' + token) || line.includes('var( ' + token)) {
          hits.push({ line: i + 1, token, text: line.trim().slice(0, 160) });
          break; // one hit per line is enough context; avoid double-counting multi-token lines
        }
      }
    });
    if (hits.length) byFile.set(file, hits);
  }
  return byFile;
}

function ownerPage(token) {
  for (const [page, [, regex]] of Object.entries(PAGE_SCOPES)) {
    if (regex.test(token)) return page;
  }
  return null;
}

function assess(seedTokens) {
  const tokens = resolvedTokens();
  const unresolvable = seedTokens.filter(t => !tokens.names.has(t));
  const dependents = buildDependents(tokens);
  const affected = transitiveAffected(seedTokens.filter(t => tokens.names.has(t)), dependents);
  const files = collectSourceFiles();
  const byFile = findReferences(affected, files);
  const pages = new Set();
  for (const [file] of byFile) if (file.endsWith('.html') && labelFor(file) === 'Component / Foundation page') pages.add(file);
  return { seedTokens, unresolvable, affected: [...affected].sort(), byFile, pages: [...pages].sort(), owners: [...new Set(seedTokens.map(ownerPage).filter(Boolean))] };
}

function printReport(result, { json }) {
  if (json) { console.log(JSON.stringify({ ...result, byFile: Object.fromEntries(result.byFile) }, null, 2)); return; }
  console.log('Foundation impact assessment');
  console.log('Seed token(s): ' + result.seedTokens.join(', '));
  if (result.unresolvable.length) {
    console.log('\n⚠ NOT a real Foundation token (no var() reference to it will ever resolve - any fallback value is what actually renders):');
    for (const t of result.unresolvable) console.log('  ' + t);
  }
  if (result.owners.length) console.log('\nOwning Foundation page(s): ' + result.owners.join(', '));
  console.log('\nFull affected token set (' + result.affected.length + ', including transitive aliases):');
  console.log('  ' + result.affected.join(', '));
  console.log('\nFiles referencing any affected token (' + result.byFile.size + '):');
  for (const [file, hits] of [...result.byFile.entries()].sort()) {
    console.log('  ' + file + '  [' + labelFor(file) + ']  (' + hits.length + ' reference' + (hits.length === 1 ? '' : 's') + ')');
  }
  console.log('\nComponent/Foundation pages likely visually affected (' + result.pages.length + '):');
  for (const page of result.pages) console.log('  ' + page);
  console.log('\nFigma: not determinable by static scan - the bridge binds whatever tokens a');
  console.log('captured contract contains at draw time. Re-draw affected components in Figma');
  console.log('after this change to pick it up; this report cannot confirm that for you.');
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const rest = args.filter(a => a !== '--json');

  if (rest.includes('--list-categories') || rest.length === 0) {
    console.log('Usage: node tools/foundation-impact.cjs --<token-name> | --category <page.html|key>');
    console.log('\nCategories (Foundation editor pages) and the token prefixes each owns:');
    for (const [page, [keys, regex]] of Object.entries(PAGE_SCOPES)) console.log('  ' + page.padEnd(20) + keys.join(',').padEnd(28) + regex);
    return;
  }

  const categoryFlagIndex = rest.indexOf('--category');
  if (categoryFlagIndex !== -1) {
    const want = rest[categoryFlagIndex + 1];
    if (!want) { console.error('--category requires a page name or key, e.g. --category borders.html'); process.exitCode = 1; return; }
    const pageKey = Object.keys(PAGE_SCOPES).find(p => p === want || p === want + '.html' || p.replace('.html', '') === want);
    if (!pageKey) { console.error('Unknown category "' + want + '". Run with --list-categories to see valid values.'); process.exitCode = 1; return; }
    const tokens = resolvedTokens();
    const [, regex] = PAGE_SCOPES[pageKey];
    const seed = [...tokens.names].filter(name => regex.test(name));
    if (!seed.length) { console.error('No resolvable tokens currently match ' + pageKey + "'s pattern " + regex + '.'); process.exitCode = 1; return; }
    printReport(assess(seed), { json });
    return;
  }

  const tokenArgs = rest.filter(a => a.startsWith('--') || a.startsWith('-')).map(a => a.replace(/^-+/, ''));
  const seed = tokenArgs.map(t => t.startsWith('-') ? t : '--' + t);
  if (!seed.length) { console.error('No token given. Run with no arguments for usage.'); process.exitCode = 1; return; }
  printReport(assess(seed), { json });
}

main();
