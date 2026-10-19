# Foundation and Guidelines: fixes and verification

**Status:** identified functional failures fixed and saved in this project. Visual browser verification remains open.

**Coverage:** all 9 Foundation pages and all 5 Guidelines pages. Actual page scripts ran in a DOM test environment. The browser connector returned no available browser, including after the open-browser retry.

**Passed:** 2,205 main DOM assertions, 32 recovery assertions, 141 pending-task assertions, 1,502 library/follow-up assertions and 65 regression tests. The main sweep includes 846 field/font/picker edits and 817 defined combinations. No failures in these runs. DOM/model checks do not establish rendered acceptance.

**Additional pending work implemented:** versioned recovery, raw backups, project draft/context/readiness, readable default state text, preset Undo, font retry/stale-face handling, named icons/decode errors, corrected Radius/Borders/Shadows guidance, typed token import, agent streaming, generated contracts and complete handoff. See [short problem → solution → check pointers](foundation-pending-task-completion-2026-10-08.md).

## Small task pointers: problem → solution → check

| Priority | Reference | Problem / impact | Saved solution | Quick check / guide |
| --- | --- | --- | --- | --- |
| P1 | [foundation-runtime.js](foundation-runtime.js), [experience.js](experience.js) | Prompts lacked the full current configuration; inherited changes could be unclear. | Add applied settings, current tokens, theme, unit, density and direction to local Markdown. | Edit a setting → inspect Current Foundation configuration → copy → compare values. |
| P1 | [shell.js](shell.js), local Foundation renderers | Copy could report success without copying. | Share a clipboard helper; support a successful fallback; show manual-copy guidance on failure. | Test normal copy, denied permission, missing API and failed fallback. |
| P1 | [typography.js](typography.js), reset handler | A failed reset could leave persistence disabled. Later edits stopped saving. | Enable reset suppression only after removal succeeds. | Block reset → edit a weight → allow storage → save and reload. |
| P1 | [typography.js](typography.js), tracking / upload handlers | Empty tracking could become zero. Pending uploads could undo reset. | Keep empty tracking invalid; cancel pending uploads; clear old assets on reset. | Clear tracking → previous applied value remains → enter a valid value. Upload → reset before completion. |
| P1 | [icons.js](icons.js), reference upload | References disappeared after reload; no removal or read-error feedback. | Persist assets; restore thumbnails; add removal, keyboard access, limits and read errors. | Upload → save → reload → remove → reload. Test unsupported and oversized files. |
| P1 | [icons.js](icons.js), preview; [icons.html](icons.html), stroke guidance | Isometric/3D ignored selected size. SVG stroke was incorrectly described as px. | Apply width/height to every style. Document intrinsic viewBox and unitless SVG stroke. | Select each style and size; compare SVG dimensions, saved values and Markdown. |
| P1 | [borders.js](borders.js), validation / reload | Invalid drafts could reach persistence. Zero width/opacity was ignored on reload. | Validate hex and opacity; preserve zero values when restoring. | Try incomplete hex and opacity 101; then save width 0 / opacity 0 and reload. |
| P1 | [grid-layout.js](grid-layout.js), numeric editor | Invalid recommended grids were only flagged when Custom was selected. | Validate columns/gutter for every grid type; keep invalid drafts unsaved. | Enter 25 columns or a fractional gutter; check validation and previous applied grid. |
| P1 | [data-format.js](data-format.js), configuration form | Prompts updated only after change/blur. Blank numbers and simultaneous errors were unclear. | Commit valid input events; reject invalid values; identify every invalid field together. | Edit without blur; test blank decimals, invalid zone, two-character mask and comma-decimal conflict. |
| P1 | [foundation-model.js](foundation-model.js), [shell.css](shell.css) | Approve/Reject referenced missing tokens and could lose text contrast on custom surfaces. | Derive semantic colors and separate default/hover/active backgrounds and text colors. | Test light/dark, varied status colors and panel backgrounds; compare every state. |
| P1 | [foundations.js](foundations.js), contrast readouts | Brand readouts used a different foreground rule; surfaces checked fixed text defaults. | Use the shared state foreground rule and current Typography colors. | Change brand or primary text color; compare contrast readouts with resolved tokens. |
| P2 | [foundations.js](foundations.js), dark controls | Opening separate dark customization was not represented durably in the prompt. | Save and restore the edit-enabled choice independently of auto-generated color state. | Toggle dark customization → copy → reload → confirm choice. |
| P2 | [foundation-runtime.js](foundation-runtime.js), Shared sizing | No direct reset for shared sizing; icon precedence unclear. | Add Reset shared sizing and explain fallback versus explicit icon/component sizing. | Change sizing → reset → reload. Block storage and confirm failed reset preserves values. |
| P2 | [shadows.html](shadows.html), [ai-foundation.html](ai-foundation.html) | No local Markdown export. | Add local exports with current recipes and tokens, including px/rem references. | Change shadow philosophy / inherited status color → copy current Markdown. |
| P1 | [ai-foundation.js](ai-foundation.js), [ai-foundation.html](ai-foundation.html) | Examples implied real saved changes and cited unverified file evidence. | Label demonstrations; remove fabricated evidence; restore focus through result/Undo. | Approve / Reject → read honest result → Undo → confirm focus and restored actions. |
| P2 | [accessibility.html](accessibility.html) | Guidance still described settings as export-only; counts and migration claims were stale. | Document current live application, copy errors, reset behavior, targets and migration limits. | Compare state-model descriptions with the actual editor and failure tests. |
| P2 | [guidelines.html](guidelines.html), [copywriting.html](copywriting.html), [foundation.css](foundation.css) | Three-part reference rows inherited four-column layouts; Read More could shift adjacent values. | Wrap descriptions; use three columns with responsive stacking and consistent panel gaps. | Check description expansion, separators and column alignment at narrow/wide widths in a browser. |

## Every page: what was exercised

Every listed page passed local Markdown copy and current-context checks. Editable pages also passed save/reset and durable reload checks where those controls exist.

| Page | Specific coverage |
| --- | --- |
| Colors | Light/dark controls, swatch and hex edits, saves/resets; picker formats, typed values, sliders by keyboard, CSS copy and Escape focus. |
| Grid & Layout | Shared sizing, unit controls, numeric bounds, product/type/baseline combinations, preview token values and JSON export. |
| Typography | Every role's select options, italic states, tracking bounds, colors and line height; font sources, categories, offered fonts, uploads and four platform presets. |
| Spacing | Product/system choices, shared sizing, units, current tokens and exports. |
| Radius | Product/philosophy choices, units, saves/resets and exports. |
| Borders | Presets, width/style/sides, opacity, light/dark colors, editable state colors and zero-value reload. |
| Shadows | Philosophy controls, Human/Machine views, units, save/reset and new Markdown export. |
| Icons | All library choices, styles, applicable stroke/corner controls, size combinations, references, removal, reload and reset cancellation. |
| AI & Agents | Attribution/reference content, current status/action tokens, local copy, approval/rejection/Undo and focus. |
| Design Principles | Section navigation, reference export and three intentionally read-only input examples. |
| Component Guidelines | Section navigation, reference content and current Foundation context in copied Markdown. |
| Copywriting | Section navigation, reference content, current context and protected description-column layout. |
| Data Format | All 24 controls/options, live input updates, formatted examples, configuration download, reset and validation. |
| Accessibility | Human/Machine state contract, section navigation, updated documentation and local copy. |

## Combination boundaries

| Defined matrix | Cases passed |
| --- | ---: |
| Spacing product × system | 48 |
| Radius product × philosophy | 60 |
| Grid product × type × baseline | 96 |
| Icon style × size × applicable stroke/corner | 112 |
| Border width × style × sides | 225 |
| Data locale × separator × grouping | 48 |
| Theme × unit × density × direction, across 14 pages | 224 |
| Typography platform presets | 4 |

This is finite matrix coverage, with representative text and numeric boundaries. It is not every possible free-text value, arbitrary upload, or Cartesian combination of all independent editors.

## Remaining tasks for release

- **P1 — Browser:** verify gutters, margins, padding, dropdown placement, equal side spacing, floating banner and bottom-of-page scrolling. Test 320, 375, 768, 1024 and 1440 px widths.
- **P1 — Accessibility:** keyboard through real rendered controls; test screen-reader announcements, 200% zoom, forced colors and four-line expansion.
- **P1 — Fonts/assets:** test actual font decoding, remote font loading/fallback and rendered SVG/raster references. FontFace success/failure was simulated in DOM checks.
- **P1 — Export integration:** paste copied recipes into a real app using the shared Foundation files; compare rendered results with configured examples.
- **Migration implemented:** all 15 settings records migrate valid legacy data and preserve invalid/future records. Integrated DOM checks cover reset and successful subsequent save.
- **Earlier backlog reconciled:** [all 100 current findings](foundation-finding-status-2026-10-08.md) identify source implementation separately from acceptance. The remaining Partial rows need environment evidence.

## How to repeat the checks

From this project directory:

```sh
node --test tests/*.test.*
python3 tools/audit_pages.py --check
python3 tools/generate_tokens.py --check
python3 tools/generate_foundation.py --check
python3 tools/generate_contract_docs.py --check
node tools/dtcg-import.cjs
```

The DOM tools require jsdom 29.0.2 installed separately. Set `ADS_DOM_PACKAGE` to its installed package directory, then run:

```sh
node tools/audit-foundation-controls.cjs
node tools/audit-foundation-recovery.cjs
node tools/audit-pending-tasks.cjs
node tools/audit-missed-pointers.cjs
```

Evidence: [main results](audit/foundation-controls-2026-10-08.json), [recovery results](audit/foundation-controls-supplement-2026-10-08.json), [pending-task results](audit/pending-tasks-2026-10-08.json). The source inventory covers 157 pages with no reported source issues; generated contracts/catalogs/tokens/defaults are fresh. This workspace ships web documentation and local AI demonstrations; native adapters and external agent execution are separate product implementations.

## Recheck after missed pointers

- **N03 — Library copy failure:** 65 page drivers reported Copied even when clipboard and fallback failed. Shared awaited copy feedback checks actual success and announces manual-copy recovery. Reference: shell.js; all component detail scripts; patterns.js; templates.js.
- **N04 — Copied component context:** Component/pattern/template prompts missed current settings and dimension equivalence. Prepare page Markdown with current applied snapshot and both units; keep code outputs valid code. Reference: foundation-runtime.js; component detail scripts; patterns.js; templates.js.
- **N05 — Splitter live interactions:** Divider was pointer-only with no min panes, saved ratio or cancellation recovery. Accessible separator controller, RTL/vertical keyboard, collapse/restore, physical minima, pointer cancel and versioned persistence. Reference: splitter-runtime.js; splitter-detail.js; splitter-default.html.
- **N06 — Responsive layout patterns:** Eight patterns lacked buildable transitions; Master-Detail had no working state/focus example. Per-pattern contracts plus executable selected/empty/loading/error/retry/back example and stale-request protection. Reference: layout-patterns.js; foundation-contract.json; grid-layout.html.
- **N07 — Data value edge cases:** IDs/phones formatted as quantities, dates aligned as numbers, Unicode masks split characters and invalid ranges leaked. Protect identity labels/leading zeros; numeric-only alignment; code-point masks; ordered valid ranges. Reference: foundation-model.js; foundation-runtime.js; tests/foundation-followup.test.cjs.
- **N08 — Header icon hover:** Header default and hover mapped to the same text color. Hover Brand and active pressed Brand apply to icon-only header controls. Reference: foundation.css; experience.css.
- **N09 — Contrast pill foregrounds:** 12px status pills could be unreadable on their own tinted backgrounds. Derive foreground/background pairs with at least 4.5:1, retaining 12px Regular. Reference: foundation-model.js; foundation.css; tests/foundation-followup.test.cjs.
- **N10 — Incomplete typed token publish:** Published token file omitted runtime semantic roles and metrics. Generate from the shared default resolver, both themes, with source/model/contract freshness. Reference: tools/generate_tokens.py; tools/dtcg-import.cjs; tests/foundation-release.test.cjs.

The Excel review and [request coverage](foundation-pending-task-completion-2026-10-08.md) now include all 26 screenshot/attachment pointers. Each of the 100 original findings has individual evidence in `audit/foundation-finding-evidence-2026-10-08.json`; broad section-level evidence no longer substitutes for a specific finding.
