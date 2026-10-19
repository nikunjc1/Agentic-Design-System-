# Pending Foundation tasks: saved changes

Code and documentation changes are saved in this project. **Production acceptance remains open:** the browser connection returns no connected browser. No rendered, real-font or screen-reader check is marked passed.

| Priority | Reference | Problem → saved solution | Quick check / guide |
| --- | --- | --- | --- |
| P1 | foundation-model.js; shell.js | Unversioned records → shared schemaVersion 1 migration; preserve malformed/future records; explicit reset. | Back up raw settings → try future record → ordinary save must not overwrite → reset → save. |
| P1 | foundation-runtime.js | Recovery lacked a backup → raw-settings download, separate from a validated Foundation export. | Download backup; confirm original raw strings are retained. |
| P1 | project-model.js; experience.js | Draft masked saved setup → explicit Resume/Discard/Backup, bounded draft validation and failed-discard recovery. | Resume, discard with blocked storage, retry, and return to the saved baseline. |
| P1 | experience.js | Context changes were unclear → before/after recommendations; retain overrides; apply saved context immediately. | Change product/platform → Review → inspect recommendation and override → Save. |
| P1 | experience.js | Readiness omitted AI and trusted key presence → nine sections; distinguish valid/default/recovery; role routes. | Save setup; corrupted settings must show Needs recovery, not ready. |
| P1 | foundation-model.js; typography.js | Low-contrast state text → readable default enabled roles on page/panel/raised surfaces; custom colors retained. | Check both themes; recheck custom text/surface pairs separately. |
| P1 | typography.js | Presets lacked recovery → affected-size preview and scoped Undo; later edits/reset retire Undo. | Choose preset → Undo → confirm previous metrics; edit again → stale Undo disappears. |
| P1 | typography.js; foundation-runtime.js | Font success/failure was incomplete → decode requested weights, retry failed stylesheet loads, ignore stale faces and clear removed assets. | Load/block/retry fonts in a real browser; decoding acceptance is still open. |
| P1 | icons.js; icon-catalog.json | References/catalog incomplete → duplicate and decode-error recovery; six licensed named actions with accessible SVG API. | Trigger image error; check removal/retry. Inspect labelled versus decorative SVG and RTL chevron. |
| P1 | borders.html | Promised state geometry controls absent → fixed state geometry clearly labelled; base controls remain editable; live-application guidance corrected. | Compare state rows, copied settings and the Implementation contract. |
| P2 | radius.html | Nested-radius border math reversed → gap is border plus padding; 12 − (1 + 4) = 7px. | Compare contour cap with independent controls and asymmetric insets. |
| P2 | shadows.html | XS preview used SM; card defaults conflicted → correct XS and distinguish static bordered, elevated and interactive cards. | Compare default/hover/pressed specimens with exported recipes. |
| P1 | foundation-contract.json; generated page sections | Rules missing from handoff → one generated contract across Project setup, nine Foundations and five Guidelines. | Expand Machine contract; copy Markdown; compare section rules and current values. |
| P1 | foundation-model.js; foundation.css | Layer and relationship roles missing → layer tokens, semantic color aliases and spacing relationships; documented precedence. | Check resolved snapshot; verify overlay collision and geometry in a browser. |
| P1 | agent-model.js; ai-foundation.js | Decisions looked like failure; stream had no controls → neutral rejection, lifecycle, Stop/Retry, preserved output and coarse announcements. | Start → Stop → Continue → interruption → Retry; compare request/scope and output. |
| P1 | foundation-model.js; foundation-runtime.js; project-model.js | Handoff omitted context/assets or used editor seed defaults → applied settings, both themes, platform profiles, asset manifest and explicit unsaved previews. | Compare current tokens, exported settings and recipient import; identity stays opt-in. |
| P1 | tools/generate_tokens.py; tools/dtcg-import.cjs | Interchange used CSS strings/unsupported types → typed colors/shadows/aliases; independent consumer; content and generator freshness. | Import both modes; invalid types and cyclic aliases must fail. |
| P1 | audit/recipient-fixture.html; foundation-import.js | No export receiver → standalone import fixture and token-parity tests. | Load Foundation JSON; compare theme/unit/type/assets and states in a real browser. |

The published default export now contains **613 typed tokens and 21 explicit CSS-only keyword extensions**. Its independent consumer restores **all 634 resolved default properties in each theme**, including runtime typography, geometry, state roles and aliases. The live Foundation JSON separately includes current settings, context and preview provenance.

All 100 original findings are reconciled in [the current finding table](foundation-finding-status-2026-10-08.md) and the Excel review. Implemented identifies a source/documentation fix; Partial identifies a remaining acceptance requirement.

Release tasks still requiring evidence:

- **Browser:** all 14 Foundation/Guidelines pages; 320/375/768/1024/1440px; equal gutters, controls, banner, expansion and scroll bottom.
- **Accessibility:** keyboard, focus return, screen reader, 200% zoom, text spacing, forced colors, RTL and reduced motion.
- **Assets:** real font/image decode, remote failure/retry, weights, fallback and optical alignment.
- **Recipient:** open the fixture; compare rendered results with the configured portal, including copied component recipes.

Repeat source/model checks with `node --test tests/*.test.*`, `python3 tools/generate_contract_docs.py --check`, `python3 tools/generate_foundation.py --check`, `python3 tools/generate_tokens.py --check`, and `python3 tools/audit_pages.py --check`. Set `ADS_DOM_PACKAGE` to jsdom 29.0.2 and run `tools/audit-foundation-controls.cjs`, `tools/audit-foundation-recovery.cjs`, and `tools/audit-pending-tasks.cjs` with Node. These checks do not render CSS or operate assistive technology.

## Follow-up: missed implementation pointers

| ID | Reference | Problem → saved solution | Quick check |
| --- | --- | --- | --- |
| N03 | shell.js; all component detail scripts; patterns.js; templates.js | 65 page drivers reported Copied even when clipboard and fallback failed. → Shared awaited copy feedback checks actual success and announces manual-copy recovery. | Copy with normal API, denied API and failing/successful legacy fallback; preserve focus. |
| N04 | foundation-runtime.js; component detail scripts; patterns.js; templates.js | Component/pattern/template prompts missed current settings and dimension equivalence. → Prepare page Markdown with current applied snapshot and both units; keep code outputs valid code. | Change Spacing then copy each prompt; compare applied setting and px/rem values. |
| N05 | splitter-runtime.js; splitter-detail.js; splitter-default.html | Divider was pointer-only with no min panes, saved ratio or cancellation recovery. → Accessible separator controller, RTL/vertical keyboard, collapse/restore, physical minima, pointer cancel and versioned persistence. | Arrow/Shift/Home/End/Enter; cancel pointer; reload width; future record; failed reset then retry. |
| N06 | layout-patterns.js; foundation-contract.json; grid-layout.html | Eight patterns lacked buildable transitions; Master-Detail had no working state/focus example. → Per-pattern contracts plus executable selected/empty/loading/error/retry/back example and stale-request protection. | Select record, Back, retry error, clear during load, cross narrow/wide threshold. |
| N07 | foundation-model.js; foundation-runtime.js; tests/foundation-followup.test.cjs | IDs/phones formatted as quantities, dates aligned as numbers, Unicode masks split characters and invalid ranges leaked. → Protect identity labels/leading zeros; numeric-only alignment; code-point masks; ordered valid ranges. | Format IDs, phone, boolean/blank number, date-only values, reverse range and emoji masks. |
| N08 | foundation.css; experience.css | Header default and hover mapped to the same text color. → Hover Brand and active pressed Brand apply to icon-only header controls. | Hover settings/theme/navigation and banner actions; verify currentColor paths/masks. |
| N09 | foundation-model.js; foundation.css; tests/foundation-followup.test.cjs | 12px status pills could be unreadable on their own tinted backgrounds. → Derive foreground/background pairs with at least 4.5:1, retaining 12px Regular. | Check pass/fail pairs in both themes and white/dark/blue panels. |
| N10 | tools/generate_tokens.py; tools/dtcg-import.cjs; tests/foundation-release.test.cjs | Published token file omitted runtime semantic roles and metrics. → Generate from the shared default resolver, both themes, with source/model/contract freshness. | Independent import; compare all property names and representative values; reject invalid/cyclic inputs. |

## Every screenshot and attachment request

Implemented means the source fix is saved. Partial means physical layout/interaction acceptance is still required. These request rows overlap the original findings and must not be added to the 100-finding count.

| ID | Request | Status | Reference | Quick check / remaining evidence |
| --- | --- | --- | --- | --- |
| U01 | Foundation audit and task report | Implemented | foundation-audit-report-2026-10-05.md; audit/foundation-finding-evidence-2026-10-08.json | Filter Original findings; compare ID, current evidence and remaining task. |
| U02 | Blue structural boundaries | Partial | foundation.css; shell.css; foundation-model.js | Inspect unfocused containers, then keyboard focus, in both themes and custom Brand. |
| U03 | Inner input strokes | Partial | foundation.css:50; input-detail.js | Check outlined/filled/underlined Input, Password, Number and Search in every state. |
| U04 | Page and sidebar spacing | Partial | foundation.css:18; foundation.css:171; shell.css | Measure both content edges and sidebar in wide/narrow widths; expand content and retest. |
| U05 | Dropdown alignment | Partial | foundation.css:74; shell.css:1227 | Compare select/input baseline and bounds at 320/375/768/1440px. |
| U06 | H1-H6, Body and Paragraph | Implemented | foundation-model.js; foundation.css:5; tests/foundation-typography.test.cjs | Reset Typography; inspect hierarchy; change size, weight, line height, tracking and color. |
| U07 | Default Inter and live typography | Implemented | foundation-runtime.js; typography.js; foundation-defaults.json | Change font; navigate; reload; inspect exported source/assets and copied current context. |
| U08 | 11px Caption descriptions | Implemented | foundation.css:217; foundation.css:234; foundation-model.js | Inspect contrast descriptions, RGB readouts, eyebrows and helpers; test Caption customization. |
| U09 | 12px Regular pills | Implemented | shell.css:891; foundation.css; tests/foundation-followup.test.cjs | Inspect AA/AAA and Non-text 3:1 pills in light/dark and custom panels. |
| U10 | Four-line Read More/Less | Partial | foundation-runtime.js:210; foundation.css:163 | Check 3/4/5-line prose, resize, expand/collapse, keyboard and text-spacing overrides. |
| U11 | Tabs into Group Button | Implemented | experience.js; foundation.css:242; experience.css:5 | Click every section and Human/Machine choice; use arrows/Home/End; check overflow track. |
| U12 | Letter-spacing field height | Implemented | foundation.css:83; shell.css:1227 | Compare tracking, line-height, font and size fields after unit/font changes. |
| U13 | Gap between tracking/unit fields | Implemented | shell.css:1230 | Compare paired input gap with adjacent editor columns at multiple widths. |
| U14 | px/rem relevance and interaction | Implemented | foundation-runtime.js:8; tests/foundation-units.test.cjs | Switch px/rem on Typography, Grid, Spacing, Radius, Borders, Shadows, Icons; inspect conversion/save/copy. |
| U15 | Right-aligned Foundation JSON export | Implemented | foundation.css:64 | Inspect toolbar with and without unit selector; narrow width and long labels. |
| U16 | px and rem in Markdown | Implemented | foundation-model.js; foundation-runtime.js; all 63 component detail scripts | Switch units; copy prompt; compare dimensions and current applied settings. |
| U17 | Consistent section/banner radius | Implemented | experience.css:8; foundation.css; radius.js | Change radius philosophy; compare banner/panel outer corners and inner controls. |
| U18 | Edit icon-only/right/Google | Implemented | experience.js; experience.css:11; icon-catalog.json | Inspect accessible name, SVG provenance, ordering and activation. |
| U19 | Icon-only hover color | Implemented | foundation.css:262; experience.css:13 | Hover theme/settings/edit/close; check SVG/mask currentColor in both themes. |
| U20 | Floating banner and Close | Implemented | experience.js; experience.css:9 | Scroll content, close banner, navigate/reopen context and check focus/section reachability. |
| U21 | Blank space at scroll bottom | Partial | foundation.css:175 | Scroll every page to bottom at desktop/mobile and resize; check final content/actions remain reachable. |
| U22 | Data Format alignment and controls | Implemented | data-format.js; foundation-runtime.js:84; foundation.css:97 | Edit each format, save/reload/copy; test empty/loading/masked/escaped/date/number examples and invalid boundaries. |
| U23 | Accessibility gutters/separators | Partial | foundation.css:133; accessibility.html | Expand each description; inspect status alignment and panel/row gaps at narrow/wide widths. |
| U24 | All Foundation/Guidelines actions | Implemented | tools/audit-foundation-controls.cjs; tools/audit-foundation-recovery.cjs; tools/audit-pending-tasks.cjs | Repeat the committed DOM tools; inspect each evidence JSON and any failed row before release. |
| U25 | Required red asterisk | Implemented | foundation-runtime.js:295; foundation.css:62; select-dropdown.html | Inspect required form labels and error summary; verify one explanation of the marker. |
| U26 | Remove Optional suffix | Implemented | foundation-runtime.js:297; project-model.js | Inspect setup/other optional fields; leave blank and complete review/save. |

Current verification: **65 regression tests; 2,205 main + 32 recovery + 141 pending + 1,502 follow-up DOM assertions; 817 defined combinations. No failures.** Follow-up coverage includes all 131 component pages plus Patterns and Templates. FontFace, measurements and media transitions in the DOM harness are simulated; this evidence does not certify CSS painting, font decoding or assistive technology.
