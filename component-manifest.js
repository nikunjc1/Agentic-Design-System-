/* Shared component/category data for anything that needs to walk the whole
   catalog (Markdown Export's picker, Figma Export's orchestration) - one
   source for the category taxonomy so the two can't drift apart. */
(() => {
  "use strict";
  // docs-catalog.js has no literal "category" field - every component
  // Detail doc's own markdown starts with the same breadcrumb its real
  // page shows ("Components · Forms · Add-on"), so the category is parsed
  // from that instead of changing the generated catalog file. Listing/Tab
  // -kind docs don't have this breadcrumb and return null.
  const COMPONENT_CATEGORY_PATTERN = /^Components · ([^·\n]+) · /;
  function docCategory(doc) {
    const m = COMPONENT_CATEGORY_PATTERN.exec(doc.markdown);
    return m ? m[1].trim() : null;
  }
  const CATEGORY_ORDER = ['Actions', 'Forms', 'Navigation', 'Feedback', 'Data Display'];
  function categoryLabel(category) { return category; }

  // Standard appearances share one Figma family. The separate icon button
  // must remain selectable: it is not part of shell.js's appearance capture.
  function buildCatalogManifest(docsCatalog) {
    const byCategory = new Map(CATEGORY_ORDER.map(c => [c, []]));
    const seenButton = new Set();
    for (const doc of docsCatalog || []) {
      const category = docCategory(doc);
      if (!category || !byCategory.has(category)) continue;
      if (/^button-/.test(doc.file) && doc.file !== 'button-primary-icon.html') {
        if (seenButton.has(category)) continue;
        seenButton.add(category);
        byCategory.get(category).push({ name: 'Button', category: categoryLabel(category), file: 'button-primary.html', files: docsCatalog.filter(d => /^button-/.test(d.file) && d.file !== 'button-primary-icon.html').map(d => d.file), isButtonFamily: true });
        continue;
      }
      byCategory.get(category).push({ name: doc.title, category: categoryLabel(category), file: doc.file, files: [doc.file], isButtonFamily: false });
    }
    const manifest = [];
    for (const [, items] of byCategory) manifest.push(...items);
    return manifest;
  }

  window.ADSComponentManifest = { CATEGORY_ORDER, docCategory, categoryLabel, buildCatalogManifest };
})();
