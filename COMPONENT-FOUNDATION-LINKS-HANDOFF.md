# Component-to-Foundation audit — 6 November 2026

## Scope and outcome

Inspected all 69 component detail pages, including every state/appearance cell rendered by their current configurations. Independently changed Colors, Grid & Layout, Typography, Spacing, Radius, Borders, Shadows and Icons in an isolated Chrome profile. Existing user settings were not edited.

Typography changes reached all 69 pages. The other categories apply according to component anatomy and selected variants; zero measured differences are not automatically failures or passes. Full JSON evidence records each measured change and the test fixtures.

**Final verification: PASS.** All 69 exports validate and include the current Foundation token set. Standalone HTML matches the tested live styles for Input, Card, Calendar and Button. The shared layout gutter resolves to 36px with the saved grid context; calendar days resolve to the saved Expressive 8px small-radius role. Release and token-integrity checks pass. Results are recorded in `exports.json`.

## Fixes

1. **Preserve authored export bindings.** Added `foundation-css-bindings.js` and loaded it on all 69 detail pages. Capture now reads the winning authored CSS reference, including supported selectors, specificity, inline styles, important declarations, inheritance, active media/supports rules, simple shorthand expansion and local aliases. Equal numeric/color values no longer justify an arbitrary cross-family link. The conservative fallback keeps ambiguous values as literal snapshots. All export CTAs share this capture path.
2. **Connect internal corner radii.** Autocomplete options, mention people, color-picker swatch options, cascader options, transfer items, tree-select nodes, select options and calendar days now use `--radius-sm`. Calendar range endpoints use the same role; middle/attached corners remain square. Explicit numeric variants and the fixed optical swatch sizes retain their values.
3. **Correct the integrity checker.** Per-node `styles["--custom-property"]` declarations are recognized as local variables. Placeholder variables previously reported as missing are actually declared by the component capture. The final integrity scan reports no duplicate primitive keys, unresolved references or token cycles.

## Foundation coverage and intentional exceptions

| Foundation | What is connected / how to interpret the audit |
| --- | --- |
| Colors | Brand, status, surface and neutral tokens are consumed where applicable. Text-only Description and Divider did not change under the color fixtures: their text follows Typography; structural dividers follow Borders. |
| Grid & Layout | Grid tokens and context are included in every component contract. Global columns/gutters apply to layout containers and recipes, not internal anatomy such as calendar weekdays, table data columns or button icon slots. The atomic preview audit correctly records no internal grid rewrite. |
| Typography | All 69 pages responded. Authored role references now survive export even when two roles currently share the same size or font. |
| Spacing | Component spacing references follow the spacing scale. Some 4px/8px preset changes resolve to identical values (for example 8px/16px); an unchanged visual does not imply a missing token. Authored spacing links remain in exports. |
| Radius | Semantic sm/md/lg roles follow the chosen philosophy. Follow-up UI verification added exact 6px support to every native radius menu, so all five foundation philosophies now have exact matches. See `FOUNDATION-UI-PROPAGATION-HANDOFF.md`. Explicit sizes/radii, circles, pills and attached corners remain component choices. Internal selectable surfaces now follow sm directly. |
| Borders | Width/style/color affect applicable border-bearing variants. Borderless variants and decorative strokes retain their anatomy. |
| Shadows | Elevated variants follow their shadow roles. Flat components do not acquire an unsolicited shadow. |
| Icons | Applicable stroke width/caps/joins follow Icons. Glyph size may be proportional to component size; filled glyphs do not acquire arbitrary outline geometry. Selecting an icon library records source/style intent and does not replace every glyph, as the existing Icons contract states. |

## Files

- `foundation-css-bindings.js`: CSS-reference resolver; caching and selector prefilter keep capture work bounded.
- `component-workbench.js`: authored bindings take precedence; ambiguous reverse matches are rejected; cached matches reset between variant snapshots.
- All 69 detail HTML pages: load the resolver before the workbench.
- `shell.css`: eight internal radius consumers and calendar range corners.
- `tools/foundation-integrity.cjs`: detect per-node custom-property declarations.
- `tests/foundation-css-bindings.test.cjs`: token collisions, specificity, inline/important precedence, shorthand sides/corners, aliases/fallbacks, cycles, selector prefilter and cache reset.
- `tools/check-component-foundations.cjs`: independent Foundation changes across all rendered state/appearance cells.
- `tools/check-foundation-exports.cjs`: all-page contract validity, token presence/currentness, collision proof and representative standalone HTML parity.

## Validation

Evidence directory: `audit/component-foundations-2026-11-06/`.

- `before.json`: initial selected-preview scan (69 pages).
- `after.json`: expanded final scan across rendered state/appearance cells (69 pages, no browser script errors). These scans have different breadth, so their change counts must not be compared as a before/after improvement score.
- `exports.json`: all-page export checks, representative recipient results, layout-context/gutter verification and a calendar semantic-radius check.
- `calendar-foundation-radius.png`: rendered calendar with the Expressive small-radius token.
- `integrity.json`: token integrity results.
- `release-check.log`: full unit suites and freshness gates.

Automated checks do not certify every Cartesian combination, remote font availability, screen-reader behavior or live Figma import. No Figma document was edited or inspected in this task; the shared capture contract is verified, not the external plugin runtime.

## Per-page rendered changes

Numbers below are changed computed-style properties under each fixture, not issue counts. A dash means no change under that fixture; consult the exceptions above. Grid is omitted because it remains layout context for every atomic component.

| Component page | Colors | Typography | Spacing | Radius | Borders | Shadows | Icons |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| add-on-default.html | 26 | 750 | 72 | 128 | 156 | — | — |
| affix-default.html | 48 | 270 | 16 | 160 | 92 | 4 | — |
| alert-default.html | 256 | 1000 | 60 | 80 | — | — | 252 |
| anchor-default.html | 84 | 180 | — | — | — | — | 36 |
| autocomplete-default.html | 42 | 500 | 80 | 128 | 150 | 6 | — |
| avatar-default.html | 26 | 225 | — | — | — | — | — |
| badge-default.html | 43 | 425 | 10 | 40 | 60 | — | — |
| breadcrumb-default.html | 4 | 400 | 20 | — | — | — | 60 |
| button-destructive.html | 103 | 520 | — | 192 | 210 | — | — |
| button-ghost.html | 103 | 520 | — | 192 | 210 | — | — |
| button-link.html | 103 | 520 | — | 192 | 210 | — | — |
| button-neutral.html | 103 | 520 | — | 192 | 210 | — | — |
| button-primary-icon.html | 193 | 775 | — | 192 | — | — | 66 |
| button-primary.html | 103 | 520 | — | 192 | 210 | — | — |
| button-secondary.html | 103 | 520 | — | 192 | 210 | — | — |
| button-tertiary.html | 103 | 520 | — | 192 | 210 | — | — |
| calendar-default.html | 30 | 1584 | 26 | 1024 | 36 | — | — |
| card-default.html | 22 | 400 | 56 | 138 | 140 | 12 | — |
| cascader-default.html | 64 | 970 | 150 | 160 | 131 | 2 | 132 |
| checkbox-default.html | 10 | 330 | 48 | 72 | 101 | — | 24 |
| collapse-default.html | 6 | 370 | 24 | 24 | 57 | — | 72 |
| color-picker-default.html | 30 | 610 | 74 | 144 | 309 | 2 | — |
| date-picker-default.html | 28 | 860 | 54 | 72 | 105 | — | 240 |
| date-range-default.html | 28 | 1180 | 54 | 72 | 95 | — | 270 |
| description-default.html | — | 430 | 51 | 12 | 32 | — | — |
| divider-default.html | — | 75 | 11 | — | 9 | — | — |
| drawer-default.html | 20 | 520 | 117 | 160 | 196 | 12 | — |
| dropdown-default.html | 17 | 330 | — | 56 | 84 | — | 72 |
| empty-default.html | 5 | 240 | 18 | 8 | 10 | — | 72 |
| float-button-default.html | 15 | 600 | 60 | 80 | 60 | 15 | — |
| group-button-default.html | 12 | 240 | — | 144 | 48 | — | — |
| image-default.html | 4 | 260 | 6 | 32 | — | — | 66 |
| input-text-field.html | 28 | 615 | 72 | 64 | 92 | — | — |
| list-default.html | 28 | 640 | 174 | 64 | 40 | — | — |
| mention-default.html | 58 | 524 | 74 | 136 | 129 | 4 | — |
| menu-default.html | 100 | 690 | 120 | 188 | 112 | 12 | 132 |
| modal-default.html | 38 | 780 | 146 | 208 | 266 | 14 | — |
| notification-default.html | 192 | 960 | 80 | 64 | 80 | 16 | 312 |
| number-default.html | 24 | 1065 | 81 | 200 | 99 | — | 216 |
| pagination-default.html | 14 | 480 | 30 | 160 | 246 | — | 120 |
| password-default.html | 28 | 975 | 72 | 64 | 92 | — | 216 |
| pop-confirm-default.html | 24 | 640 | 204 | 192 | 192 | 24 | 48 |
| popover-default.html | 12 | 360 | 62 | 96 | 72 | 12 | — |
| progress-default.html | 8 | 105 | 9 | — | — | — | — |
| radio-default.html | 6 | 235 | 25 | 20 | 85 | — | — |
| rating-default.html | 228 | 1140 | — | 8 | — | — | 360 |
| result-default.html | 138 | 530 | 36 | 64 | 84 | — | 126 |
| search-default.html | 26 | 990 | 72 | 64 | 108 | — | 270 |
| select-dropdown.html | 48 | 1196 | 128 | 208 | 176 | 4 | 168 |
| skeleton-default.html | 10 | 140 | 8 | 72 | — | — | — |
| slider-default.html | 28 | 340 | 40 | — | — | 12 | — |
| spin-default.html | 12 | 120 | — | 12 | 18 | — | — |
| splitter-default.html | 24 | 220 | — | 24 | 36 | — | 12 |
| statistic-default.html | 25 | 267 | 36 | 12 | — | — | 27 |
| steps-default.html | 21 | 489 | — | — | 104 | — | 48 |
| switch-default.html | 40 | 280 | 36 | — | 10 | 12 | — |
| table-default.html | 184 | 2390 | 496 | 260 | 310 | — | — |
| tabs-default.html | 39 | 396 | — | 24 | 16 | — | — |
| tag-default.html | 69 | 200 | 24 | 48 | — | — | 36 |
| text-area-default.html | 24 | 435 | 63 | 56 | 81 | — | — |
| time-default.html | 28 | 700 | 54 | 72 | 105 | — | 144 |
| timeline-default.html | 66 | 1035 | 70 | — | — | — | — |
| toast-default.html | 290 | 1130 | 72 | 96 | 144 | 24 | 282 |
| tooltip-default.html | 12 | 296 | 12 | 48 | 72 | — | — |
| tour-default.html | 36 | 580 | 188 | 176 | 100 | 24 | — |
| transfer-default.html | 142 | 2270 | 184 | 672 | 740 | — | 96 |
| tree-default.html | 22 | 3180 | 144 | 320 | 117 | — | 684 |
| tree-select-default.html | 44 | 890 | 96 | 128 | 140 | 4 | 132 |
| upload-default.html | 127 | 1578 | 200 | 128 | 140 | — | 414 |

## Reproduce

```sh
node tools/foundation-integrity.cjs --json
node tests/foundation-css-bindings.test.cjs
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-component-foundations.cjs --after
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-foundation-exports.cjs
python3 tools/audit_pages.py
bash tools/release_check.sh
```

If extending CSS capture to cascade layers, container queries, imported stylesheets or complex shorthand syntax, add corresponding browser fixtures first. Unsupported/ambiguous values should remain snapshots rather than receive invented semantic links.
