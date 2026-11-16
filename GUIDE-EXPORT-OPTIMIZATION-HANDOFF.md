# Design Principles and Markdown Export optimization

Completed 6 November 2026. Component-wide verification continues separately.

## Design Principles

- Removed the repeated project-setup notice.
- Limited section navigation to the values and ten principles; added stable principle anchors.
- Named all three read-only example inputs and made Do/Don't labels semantic headings.
- Clarified that examples are static. Reworded spacing examples to remain accurate under customized spacing, and transition guidance to respect reduced motion.
- Replaced the always-expanded duplicate Markdown block with Copy guide, a contextual export link and a collapsed preview. Clipboard failure reveals and focuses that preview.
- Scoped responsive styles contain examples and keep value cards within narrow screens.

## Markdown Export

- Replaced duplicate setup panels with one compact project-context line.
- Split settings and preview into two desktop columns, stacking on smaller screens. Download/copy actions now precede the preview on mobile.
- Collapsed Foundation choices by default; added all/clear actions and selected counts.
- Added component search, all/clear selection, no-result feedback and preserved selections during filtering.
- Separated category checkboxes from disclosure summaries; added mixed-state and selected-count feedback.
- Blocked a component-guide export with no selected components; kept unrelated guides available in full-documentation exports.
- Clarified scope labels and privacy behavior. Contact details remain excluded unless selected.
- Added touch-sized controls, explicit field labels, readable status/error feedback and preview busy state.

## Files and evidence

Main changes: `principles.html`, `md-export.html`, `experience.js`, new `guide-export.css`, and the Principles implementation contract. Generated documentation/default/token files were refreshed.

`tools/check-guide-export-optimization.cjs` passes 11 browser scenarios covering anchors, labels, copy success/failure, defaults without a project, privacy, keyboard disclosures, empty selection, search, mixed selection, Foundation filtering, downloads, legacy guide links and preservation of unrelated documentation. Both pages fit 1440, 768, 390 and 320px in both themes. No browser script errors occurred. Release checks pass; static audit reports no source issues across 162 pages.

Evidence: `audit/guide-export-2026-11-06/`, including screenshots, results, sample export and logs. Clipboard success/failure paths use a controlled clipboard substitute; downloads use actual browser download events. Tests run in an isolated profile and preserve the user's data.

```sh
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-guide-export-optimization.cjs
bash tools/release_check.sh
```
