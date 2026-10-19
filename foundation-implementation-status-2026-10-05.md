# Foundation implementation check — 5 October 2026

Compared the current local design/documentation and scripts against all 100 findings in the saved Foundation audit. **9 implemented, 29 partially implemented, 62 open.** This counts findings, not commits; shared fixes can affect multiple findings.

**Implemented** = core source/documentation change is present. **Partial** = useful work is present, with a material audit requirement remaining. **Open** = the reported gap remains without a substantive fix. Every visual/runtime closure still needs browser verification; the connected-browser list is empty. No live design, Figma or deployed build was certified.

Review snapshot: 2026-10-05T19:08:46+05:30. Baseline `1be05bfa5da1433e09901a715fe9704b41c7719a`; current HEAD `15f127c22b6e762026af516f4bc82e26fcbe114d`. Includes 34 audit-related commits and the uncommitted token-generator/JSON/manifest changes. Original audit and fix checklist are preserved.

References: [original audit](foundation-audit-report-2026-10-05.md), [28-task checklist](foundation-fix-checklist-2026-10-05.md). P1 = before production; P2 = next delivery. Open/Partial are the next tasks.

## What changed on the design

| Section | Present now | Still needed |
| --- | --- | --- |
| New Project | Optional identity; role tasks; readiness list; final validation; history recovery; token radii. | Project/draft lifecycle, accessible errors, context-aware handoff and responsive verification. |
| Colors | Brand/surface aliases; surface warning; formulas and status recipes. | Mode/save consistency, actual pair checks, on-brand contrast and legacy text migration. |
| Grid & Layout | Other fallback; Splitter/Affix and pane-priority guidance. | Editable geometry, canonical breakpoints, responsive/state contracts and complete snapshot. |
| Typography | Load-failure feedback; category fallbacks; cleaner preset state. | Durable fonts, async commit, semantic bindings and accessible responsive roles. |
| Spacing | Consumer/AI cards; Other guidance; composition examples; fluid/RTL clarification. | Scale/Adaptive resolver, density/hit-area rules and typed export. |
| Radius | Clearer scale, attached/circle/state rules; reset/load parity; setup token adoption. | Effective component defaults, immutable primitives and verified nested geometry. |
| Borders | Custom preset handling; logical Start/End; 1.5px exception explanation. | Real state controls, combinations, geometry/contrast and semantic dependencies. |
| Shadows | Interactive hover scope; state signals; motion/performance notes. | Philosophy recipes, Card rest consistency, dark/layer rules and export. |
| Icons | Inapplicable controls disabled; RTL/motion and AI instructions. | Durable assets, keyboard upload, catalog, accessibility and hit-area guidance. |
| AI & Agents | Mixed authorship and unavailable-evidence examples; catalog inclusion. | Truthful demo/results, verified citations, execution/stream/permission contracts and Foundation picker. |
| Shared system | Fresh catalog/tokens; default export; Machine View version; governance table. | Effective resolver, complete format/schema parity, common storage/editor/selection model. |

## Check results

- Project-model suite: **9/9 passed**. Covers optional identity, Other boundaries, numeric future-version rejection and Markdown provenance; does not test Foundation UI.
- Catalog freshness: **passed**, 157 pages. JSON and JS catalogs match. All formerly missing static sections and AI page are present.
- Token freshness and regenerated-content parity: **passed**, 126 tokens. Monospace now matches JetBrains Mono.
- DTCG repair: **partial**. Dimensions/durations and aliases improved; 27 literal color values remain CSS strings, 33 tokens use nonstandard `other`, and shadow colors remain CSS strings. Freshness is not format validation.
- Fresh-export probe: explicit defaults now appear. A Data-Heavy profile still exports generic `4px` spacing, `balanced` radius and grid type only; the page recommendations are 2px/Sharp. Recommendations are not resolved by the new export fallback.
- Default brand pair: white on `#FF031A` remains **3.977:1**, below the normal-text AA threshold. No on-brand resolver was added.
- Browser connection: no available browsers; keyboard, visual, screen-reader, reflow and cross-tab tests remain pending.

## Tasks to prioritize

- **P1 · X02/NP09:** Build one context/default/override resolver. Export both modes, component values, assets and unresolved decisions. Verify fresh Data-Heavy and multi-platform handoffs.
- **P1 · C01–C05/C07:** Repair color transaction/mode/text ownership. Check actual composited pairs; fix the primary-button foreground.
- **P1 · X04:** Finish DTCG value/type conversion. Run a pinned-schema/importer fixture; check aliases and light/dark output.
- **P1 · NP01–NP03/NP05:** Define project/draft lifecycle and accessible errors. Verify resume/discard, context edits and focused checkbox feedback.
- **P1 · G01–G06/T01–T07/S01–S03/R01–R02/B01–B04/H01–H04/I01–I07:** Connect selectable choices to buildable values and complete behavior/accessibility rules.
- **P1 · A01–A08:** Correct the unsupported rename example; label simulation; specify truthful outcomes, focus recovery, streaming and execution states.

## Full finding status

Each pointer links to its original problem, priority and detailed solution. Current files are linked separately; line numbers in the original report describe the original snapshot.

### Shared system

2 implemented · 5 partial · 3 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [X01](foundation-audit-report-2026-10-05.md#x01-p1) · P1 | Implemented · Export | Catalog rebuilt; all formerly missing static sections and AI page are present. **Verify:** Keep catalog freshness checks in the release workflow. | [docs-catalog.json](docs-catalog.json), [tools/audit_pages.py](tools/audit_pages.py) |
| [X02](foundation-audit-report-2026-10-05.md#x02-p1) · P1 | Partial | Fresh export now includes explicit defaults and provenance. **Task:** Resolve project/platform recommendations, both modes and effective component maps. | [experience.js](experience.js), [project-model.js](project-model.js) |
| [X03](foundation-audit-report-2026-10-05.md#x03-p1) · P1 | Implemented · Export | 126 tokens match the current generator; missing families and JetBrains Mono are restored. **Verify:** Keep artifact parity checks; format validity remains X04. | [design-tokens.json](design-tokens.json), [theme.css](theme.css), [tools/generate_tokens.py](tools/generate_tokens.py) |
| [X04](foundation-audit-report-2026-10-05.md#x04-p1) · P1 | Partial | Uncommitted generator adds pinned DTCG version, dimensions/durations and aliases. **Task:** Replace raw CSS colors/shadow colors and 33 nonstandard other types; validate an importer. | [tools/generate_tokens.py](tools/generate_tokens.py), [design-tokens.json](design-tokens.json) |
| [X05](foundation-audit-report-2026-10-05.md#x05-p1) · P1 | Open | **Task:** Unify draft, save, apply and export semantics across all editors. | [experience.js](experience.js), [shell.js](shell.js), [tools/generate_tokens.py](tools/generate_tokens.py) |
| [X06](foundation-audit-report-2026-10-05.md#x06-p1) · P1 | Open | **Task:** Centralize storage validation/migration and recover from write/corruption failures. | [experience.js](experience.js), [shell.js](shell.js), [tools/generate_tokens.py](tools/generate_tokens.py) |
| [X07](foundation-audit-report-2026-10-05.md#x07-p1) · P1 | Open | **Task:** Expose selected choices with radio/pressed semantics and announced feedback. | [experience.js](experience.js), [shell.js](shell.js), [tools/generate_tokens.py](tools/generate_tokens.py) |
| [X08](foundation-audit-report-2026-10-05.md#x08-p2) · P2 | Partial | Generated Machine Views have a shared version marker. **Task:** Fix null-policy contradictions; version static JSON; include prose/AI rules and typed schemas. | [experience.js](experience.js), [foundations.html](foundations.html), [grid-layout.html](grid-layout.html), [borders.js](borders.js) |
| [X09](foundation-audit-report-2026-10-05.md#x09-p2) · P2 | Partial | Cards/labels align; Other fallback and Typography taxonomy rationale added. **Task:** Centralize duplicated mappings and define platform/density/override precedence. | [spacing.html](spacing.html), [typography.js](typography.js), [project-model.js](project-model.js) |
| [X10](foundation-audit-report-2026-10-05.md#x10-p2) · P2 | Partial | Nine-section compatibility and release-contract table added. **Task:** Add executable responsive/accessibility/native checks, evidence links and migration examples. | [accessibility.html](accessibility.html) |

### New Project

1 implemented · 5 partial · 4 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [NP01](foundation-audit-report-2026-10-05.md#np01-p1) · P1 | Open | **Task:** Rename Project setup or implement isolated create/edit/switch/duplicate projects. | [new-project.html](new-project.html), [experience.js](experience.js), [project-model.js](project-model.js) |
| [NP02](foundation-audit-report-2026-10-05.md#np02-p1) · P1 | Open | **Task:** Review inherited defaults and overrides after product/platform changes. | [new-project.html](new-project.html), [experience.js](experience.js), [project-model.js](project-model.js) |
| [NP03](foundation-audit-report-2026-10-05.md#np03-p1) · P1 | Open | **Task:** Add Resume/Discard with timestamps and migrate legacy drafts. | [new-project.html](new-project.html), [experience.js](experience.js), [project-model.js](project-model.js) |
| [NP04](foundation-audit-report-2026-10-05.md#np04-p2) · P2 | Implemented · Behavior | Other text is bounded/type-checked; numeric future profile versions are rejected. **Verify:** Keep boundary and future-version tests. | [project-model.js](project-model.js), [tests/project-model.test.js](tests/project-model.test.js) |
| [NP05](foundation-audit-report-2026-10-05.md#np05-p1) · P1 | Open | **Task:** Associate checkbox errors; separate draft status from validation and route focus. | [new-project.html](new-project.html), [experience.js](experience.js), [project-model.js](project-model.js) |
| [NP06](foundation-audit-report-2026-10-05.md#np06-p2) · P2 | Partial | Role tasks and eight-section Default/Configured list added. **Task:** Include AI; distinguish any saved key from validated, complete readiness. | [experience.js](experience.js), [new-project.html](new-project.html) |
| [NP07](foundation-audit-report-2026-10-05.md#np07-p2) · P2 | Partial | Final submission validates both steps; history can reopen the form. **Task:** Document/implement deep-link and reload policy; test hidden-field error focus. | [experience.js](experience.js) |
| [NP08](foundation-audit-report-2026-10-05.md#np08-p2) · P2 | Partial | Most setup radii now use tokens. **Task:** Replace remaining literals; verify long labels, zoom, split windows and soft keyboard. | [experience.css](experience.css), [new-project.html](new-project.html) |
| [NP09](foundation-audit-report-2026-10-05.md#np09-p1) · P1 | Partial | Immediate export now includes default values and provenance. **Task:** Add resolved recommendations, effective tokens, asset manifest and open validation decisions. | [experience.js](experience.js), [project-model.js](project-model.js) |
| [NP10](foundation-audit-report-2026-10-05.md#np10-p2) · P2 | Partial | Identity fields optional; purpose and Other/editability copy added. **Task:** Add overlapping-category examples and browse/return journey. | [new-project.html](new-project.html), [project-model.js](project-model.js) |

### Colors

0 implemented · 3 partial · 7 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [C01](foundation-audit-report-2026-10-05.md#c01-p1) · P1 | Open | **Task:** Define accurate built-in/auto/custom dark-mode policy and export effective values. | [foundations.html](foundations.html), [foundations.js](foundations.js), [theme.css](theme.css) |
| [C02](foundation-audit-report-2026-10-05.md#c02-p1) · P1 | Open | **Task:** Persist toggle transactions; keep section resets scoped and reversible. | [foundations.html](foundations.html), [foundations.js](foundations.js), [theme.css](theme.css) |
| [C03](foundation-audit-report-2026-10-05.md#c03-p1) · P1 | Open | **Task:** Keep incomplete hex in drafts; commit/apply only complete valid colors. | [foundations.html](foundations.html), [foundations.js](foundations.js), [theme.css](theme.css) |
| [C04](foundation-audit-report-2026-10-05.md#c04-p1) · P1 | Open | **Task:** Validate actual text/surface/state pairs including opacity and typography overrides. | [foundations.html](foundations.html), [foundations.js](foundations.js), [theme.css](theme.css) |
| [C05](foundation-audit-report-2026-10-05.md#c05-p1) · P1 | Open | **Task:** Fix white-on-brand contrast; resolve approved foregrounds for every state. | [foundations.html](foundations.html), [foundations.js](foundations.js), [theme.css](theme.css) |
| [C06](foundation-audit-report-2026-10-05.md#c06-p2) · P2 | Partial | Formula notes/version and live surface-lightness warning added. **Task:** Validate actual role contrast; label heuristic limits and difficult-brand examples. | [foundations.html](foundations.html), [foundations.js](foundations.js) |
| [C07](foundation-audit-report-2026-10-05.md#c07-p1) · P1 | Open | **Task:** Migrate hidden legacy text overrides and establish text ownership. | [foundations.html](foundations.html), [foundations.js](foundations.js), [theme.css](theme.css) |
| [C08](foundation-audit-report-2026-10-05.md#c08-p2) · P2 | Partial | Brand and surface semantic aliases added without removing legacy names. **Task:** Map text/action/derived roles consistently across editor, Machine View and export. | [theme.css](theme.css), [foundations.html](foundations.html) |
| [C09](foundation-audit-report-2026-10-05.md#c09-p2) · P2 | Partial | Alert/Badge/Tag/Table/form recipes and selection/data distinctions added. **Task:** Specify composited foreground/background values and passing/failing accessible examples. | [foundations.html](foundations.html) |
| [C10](foundation-audit-report-2026-10-05.md#c10-p1) · P1 | Open | **Task:** Name picker ranges; expose values and preview-only alpha; verify mobile focus. | [foundations.html](foundations.html), [foundations.js](foundations.js), [theme.css](theme.css) |

### Grid & Layout

0 implemented · 1 partial · 7 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [G01](foundation-audit-report-2026-10-05.md#g01-p1) · P1 | Open | **Task:** Provide real geometry controls/Custom schema or label recommendation-only. | [grid-layout.html](grid-layout.html), [grid-layout.js](grid-layout.js) |
| [G02](foundation-audit-report-2026-10-05.md#g02-p1) · P1 | Open | **Task:** Consolidate breakpoints and test boundary/exception rules. | [grid-layout.html](grid-layout.html), [grid-layout.js](grid-layout.js) |
| [G03](foundation-audit-report-2026-10-05.md#g03-p1) · P1 | Open | **Task:** Resolve geometry by product, platform, density and container. | [grid-layout.html](grid-layout.html), [grid-layout.js](grid-layout.js) |
| [G04](foundation-audit-report-2026-10-05.md#g04-p1) · P1 | Open | **Task:** Define containers, spans, nesting and an independent baseline overlay. | [grid-layout.html](grid-layout.html), [grid-layout.js](grid-layout.js) |
| [G05](foundation-audit-report-2026-10-05.md#g05-p1) · P1 | Open | **Task:** Replace blanket scrolling guidance with reflow/overflow decision examples. | [grid-layout.html](grid-layout.html), [grid-layout.js](grid-layout.js) |
| [G06](foundation-audit-report-2026-10-05.md#g06-p1) · P1 | Open | **Task:** Specify narrow pane transforms, loading/error/empty states and focus/back behavior. | [grid-layout.html](grid-layout.html), [grid-layout.js](grid-layout.js) |
| [G07](foundation-audit-report-2026-10-05.md#g07-p2) · P2 | Partial | Split View/Master-Detail reference Splitter; priority and Affix guidance added. **Task:** Add working links, exact pane bounds/persistence and nested overlay/collision rules. | [grid-layout.html](grid-layout.html) |
| [G08](foundation-audit-report-2026-10-05.md#g08-p1) · P1 | Open | **Task:** Include breakpoints, patterns, geometry and overflow rules in local layout export. | [grid-layout.html](grid-layout.html), [grid-layout.js](grid-layout.js) |

### Typography

0 implemented · 3 partial · 7 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [T01](foundation-audit-report-2026-10-05.md#t01-p1) · P1 | Open | **Task:** Package persistent font assets or label uploads preview-only. | [typography.html](typography.html), [typography.js](typography.js), [shell.js](shell.js) |
| [T02](foundation-audit-report-2026-10-05.md#t02-p1) · P1 | Open | **Task:** Commit uploaded fonts after async success; handle read/load failure and retry. | [typography.html](typography.html), [typography.js](typography.js), [shell.js](shell.js) |
| [T03](foundation-audit-report-2026-10-05.md#t03-p1) · P1 | Open | **Task:** Bind saved levels to effective semantic typography/component tokens. | [typography.html](typography.html), [typography.js](typography.js), [shell.js](shell.js) |
| [T04](foundation-audit-report-2026-10-05.md#t04-p1) · P1 | Open | **Task:** Separate text roles from states and explain visual versus semantic headings. | [typography.html](typography.html), [typography.js](typography.js), [shell.js](shell.js) |
| [T05](foundation-audit-report-2026-10-05.md#t05-p1) · P1 | Open | **Task:** Validate metrics/colors on commit; preserve drafts and readable role bounds. | [typography.html](typography.html), [typography.js](typography.js), [shell.js](shell.js) |
| [T06](foundation-audit-report-2026-10-05.md#t06-p1) · P1 | Open | **Task:** Define responsive variants for every role and custom/platform scale. | [typography.html](typography.html), [typography.js](typography.js), [shell.js](shell.js) |
| [T07](foundation-audit-report-2026-10-05.md#t07-p1) · P1 | Open | **Task:** Correct readable text pairs; verify multilingual expansion and text-spacing. | [typography.html](typography.html), [typography.js](typography.js), [shell.js](shell.js) |
| [T08](foundation-audit-report-2026-10-05.md#t08-p2) · P2 | Partial | Stylesheet-load failure feedback and category-specific preview fallbacks added. **Task:** Check actual font-face loads, weights/axes, file bounds and sitewide fallback parity. | [typography.js](typography.js), [shell.js](shell.js) |
| [T09](foundation-audit-report-2026-10-05.md#t09-p1) · P1 | Partial | Regenerated full catalog now contains extra roles and AI Rule. **Task:** Local Typography snapshot still omits these; include durable fonts and responsive variants. | [docs-catalog.json](docs-catalog.json), [typography.js](typography.js) |
| [T10](foundation-audit-report-2026-10-05.md#t10-p2) · P2 | Partial | Common non-data clicks filtered; modified size presets lose active state. **Task:** Persist only actual value changes; add multi-row change review and undo. | [typography.js](typography.js) |

### Spacing

1 implemented · 2 partial · 5 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [S01](foundation-audit-report-2026-10-05.md#s01-p1) · P1 | Open | **Task:** Resolve selected spacing systems into named primitive/semantic values. | [spacing.html](spacing.html), [spacing.js](spacing.js) |
| [S02](foundation-audit-report-2026-10-05.md#s02-p1) · P1 | Open | **Task:** Define one allowed-value contract with zero/auto/percent/negative exceptions. | [spacing.html](spacing.html), [spacing.js](spacing.js) |
| [S03](foundation-audit-report-2026-10-05.md#s03-p1) · P1 | Open | **Task:** Implement Adaptive and reconcile the Cross-Platform choice/comment. | [spacing.html](spacing.html), [spacing.js](spacing.js) |
| [S04](foundation-audit-report-2026-10-05.md#s04-p2) · P2 | Implemented · Behavior + documentation | Consumer/AI cards added; Data-Heavy names align; Other fallback is explained. **Verify:** Verify all product recommendations and overrides in-browser. | [spacing.html](spacing.html), [spacing.js](spacing.js), [radius.js](radius.js), [grid-layout.js](grid-layout.js) |
| [S05](foundation-audit-report-2026-10-05.md#s05-p2) · P2 | Partial | Scrim/content split and form/list/empty-state values added. **Task:** Formalize checkbox/radio/toolbar, wrapped/error composition and semantic relationships. | [spacing.html](spacing.html) |
| [S06](foundation-audit-report-2026-10-05.md#s06-p1) · P1 | Open | **Task:** Separate density, glyph sizes, hit areas and text constraints. | [spacing.html](spacing.html), [spacing.js](spacing.js) |
| [S07](foundation-audit-report-2026-10-05.md#s07-p2) · P2 | Partial | One off-scale padding and RTL margin corrected; fluid exception documented. **Task:** Audit remaining literals; define native units and approved structural tokens. | [experience.css](experience.css), [spacing.html](spacing.html) |
| [S08](foundation-audit-report-2026-10-05.md#s08-p1) · P1 | Open | **Task:** Export typed relationship, platform/density and composition rules. | [spacing.html](spacing.html), [spacing.js](spacing.js) |

### Radius

3 implemented · 2 partial · 3 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [R01](foundation-audit-report-2026-10-05.md#r01-p1) · P1 | Open | **Task:** Generate effective component defaults and AI instructions from selected philosophy. | [radius.html](radius.html), [radius.js](radius.js), [shell.js](shell.js) |
| [R02](foundation-audit-report-2026-10-05.md#r02-p1) · P1 | Open | **Task:** Keep numeric primitives immutable; remap semantic aliases from one resolver. | [radius.html](radius.html), [radius.js](radius.js), [shell.js](shell.js) |
| [R03](foundation-audit-report-2026-10-05.md#r03-p2) · P2 | Partial | Core-versus-full scale and default role-slot interpretation clarified. **Task:** Show exact active role permissions; remove blanket all-components-tokenized claim. | [radius.html](radius.html), [shell.css](shell.css) |
| [R04](foundation-audit-report-2026-10-05.md#r04-p2) · P2 | Partial | Nested-radius cap and independent-child exception explained. **Task:** Correct/verify border-inset geometry; define outer/inner contours with asymmetric examples. | [radius.html](radius.html) |
| [R05](foundation-audit-report-2026-10-05.md#r05-p2) · P2 | Implemented · Documentation | Attached edges, full-screen surfaces and circle-versus-pill rules are documented. **Verify:** Verify sheet/drawer implementations against these rules. | [radius.html](radius.html) |
| [R06](foundation-audit-report-2026-10-05.md#r06-p2) · P2 | Implemented · Documentation | State invariance and overflow/focus-clipping constraints are documented. **Verify:** Test keyboard focus near clipped rounded edges. | [radius.html](radius.html) |
| [R07](foundation-audit-report-2026-10-05.md#r07-p1) · P1 | Open | **Task:** Export active semantic map and attached/nested rules. | [radius.html](radius.html), [radius.js](radius.js), [shell.js](shell.js) |
| [R08](foundation-audit-report-2026-10-05.md#r08-p2) · P2 | Implemented · Behavior | Reset and initial load use the same project-recommendation path. **Verify:** Verify reset/reload with Sharp, Soft and Other projects. | [radius.js](radius.js) |

### Borders

0 implemented · 3 partial · 6 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [B01](foundation-audit-report-2026-10-05.md#b01-p1) · P1 | Open | **Task:** Implement per-state width/opacity/style controls or label these fixed. | [borders.html](borders.html), [borders.js](borders.js) |
| [B02](foundation-audit-report-2026-10-05.md#b02-p1) · P1 | Open | **Task:** Show a thicker focus/selected border without layout shift. | [borders.html](borders.html), [borders.js](borders.js) |
| [B03](foundation-audit-report-2026-10-05.md#b03-p1) · P1 | Open | **Task:** Define combined-state precedence and read-only/required/loading behavior. | [borders.html](borders.html), [borders.js](borders.js) |
| [B04](foundation-audit-report-2026-10-05.md#b04-p1) · P1 | Open | **Task:** Validate composited focus/boundary contrast and forced-color behavior. | [borders.html](borders.html), [borders.js](borders.js) |
| [B05](foundation-audit-report-2026-10-05.md#b05-p2) · P2 | Partial | Diverged preset becomes Custom; export and Standard/Default explanation improved. **Task:** Define base/state inheritance and one effective composite; presets remain detached from components. | [borders.js](borders.js), [borders.html](borders.html) |
| [B06](foundation-audit-report-2026-10-05.md#b06-p2) · P2 | Partial | 1.5px token and rationale for 2.5px/triangle geometry added. **Task:** Publish exceptions in usable docs; migrate intended consumers and define native hairlines. | [theme.css](theme.css), [borders.html](borders.html), [shell.css](shell.css) |
| [B07](foundation-audit-report-2026-10-05.md#b07-p1) · P1 | Open | **Task:** Link default state borders to brand/status aliases with explicit overrides. | [borders.html](borders.html), [borders.js](borders.js) |
| [B08](foundation-audit-report-2026-10-05.md#b08-p2) · P2 | Partial | Logical Start/End controls work; physical exceptions and unsupported targets disclosed. **Task:** Add forced-colors, print/native recipes and RTL verification examples. | [borders.html](borders.html), [borders.js](borders.js) |
| [B09](foundation-audit-report-2026-10-05.md#b09-p1) · P1 | Open | **Task:** Export component exceptions, geometry, accessibility and precedence. | [borders.html](borders.html), [borders.js](borders.js) |

### Shadows

1 implemented · 1 partial · 5 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [H01](foundation-audit-report-2026-10-05.md#h01-p1) · P1 | Open | **Task:** Resolve shadow philosophies; fix Flat/overlay contradictions and absent-product copy. | [shadows.html](shadows.html), [shadows.js](shadows.js), [theme.css](theme.css) |
| [H02](foundation-audit-report-2026-10-05.md#h02-p1) · P1 | Open | **Task:** Publish typed recipes and distinct philosophy/component mappings. | [shadows.html](shadows.html), [shadows.js](shadows.js), [theme.css](theme.css) |
| [H03](foundation-audit-report-2026-10-05.md#h03-p1) · P1 | Open | **Task:** Define dark/custom/forced-color/print separation alternatives. | [shadows.html](shadows.html), [shadows.js](shadows.js), [theme.css](theme.css) |
| [H04](foundation-audit-report-2026-10-05.md#h04-p1) · P1 | Open | **Task:** Define z-index, portals, nesting, clipping and focus ownership. | [shadows.html](shadows.html), [shadows.js](shadows.js), [theme.css](theme.css) |
| [H05](foundation-audit-report-2026-10-05.md#h05-p2) · P2 | Partial | Real hover/press limited to interactive cards; static/interactive guidance separated. **Task:** Align rest variants: Shadows still says static SM while Borders says no default shadow. | [shell.css](shell.css), [shadows.html](shadows.html), [borders.html](borders.html) |
| [H06](foundation-audit-report-2026-10-05.md#h06-p2) · P2 | Implemented · Documentation | Focus/selected/pressed signals, reduced motion and shadow performance guidance added. **Verify:** Verify keyboard/touch examples and rendered transitions. | [shadows.html](shadows.html) |
| [H07](foundation-audit-report-2026-10-05.md#h07-p1) · P1 | Open | **Task:** Export effective shadow recipes, modes and layer rules. | [shadows.html](shadows.html), [shadows.js](shadows.js), [theme.css](theme.css) |

### Icons

1 implemented · 2 partial · 7 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [I01](foundation-audit-report-2026-10-05.md#i01-p1) · P1 | Open | **Task:** Persist/package uploaded references; add remove/replace and complete reset. | [icons.html](icons.html), [icons.js](icons.js) |
| [I02](foundation-audit-report-2026-10-05.md#i02-p1) · P1 | Open | **Task:** Provide a visible keyboard-operable Choose files control. | [icons.html](icons.html), [icons.js](icons.js) |
| [I03](foundation-audit-report-2026-10-05.md#i03-p1) · P1 | Open | **Task:** Validate type/size/count/decode/read errors and normalized SVG reuse. | [icons.html](icons.html), [icons.js](icons.js) |
| [I04](foundation-audit-report-2026-10-05.md#i04-p2) · P2 | Partial | Stroke/corner controls disabled for styles they cannot affect. **Task:** Separate UI glyphs from illustrations and define library/style compatibility. | [icons.js](icons.js), [icons.html](icons.html) |
| [I05](foundation-audit-report-2026-10-05.md#i05-p1) · P1 | Open | **Task:** Provide an approved named icon catalog, action map and import/resolver API. | [icons.html](icons.html), [icons.js](icons.js) |
| [I06](foundation-audit-report-2026-10-05.md#i06-p1) · P1 | Open | **Task:** Document decorative, functional, status and loading accessibility examples. | [icons.html](icons.html), [icons.js](icons.js) |
| [I07](foundation-audit-report-2026-10-05.md#i07-p1) · P1 | Open | **Task:** Separate glyph/viewBox/hit area and define optical/stroke alignment. | [icons.html](icons.html), [icons.js](icons.js) |
| [I08](foundation-audit-report-2026-10-05.md#i08-p2) · P2 | Implemented · Documentation | Navigation, trend and physical-icon RTL rules plus reduced-motion loading policy added. **Verify:** Verify each mirrored icon and spinner behavior. | [icons.html](icons.html), [shell.css](shell.css) |
| [I09](foundation-audit-report-2026-10-05.md#i09-p2) · P2 | Partial | AI Rule adds geometry/currentColor/review/license constraints; uploads labeled unverified. **Task:** Fix concept-vs-shape naming contradiction; add accepted SVGs and source/version manifest. | [icons.html](icons.html) |
| [I10](foundation-audit-report-2026-10-05.md#i10-p1) · P1 | Open | **Task:** Export assets with states, semantics, direction and generation rules. | [icons.html](icons.html), [icons.js](icons.js) |

### AI & Agents

0 implemented · 2 partial · 8 open.

| Reference / priority | Status | Current change or remaining problem → next task | Files |
| --- | --- | --- | --- |
| [A01](foundation-audit-report-2026-10-05.md#a01-p1) · P1 | Open | **Task:** Replace unsupported rename claim/citation with verified evidence or labeled fiction. | [ai-foundation.html](ai-foundation.html), [ai-foundation.js](ai-foundation.js) |
| [A02](foundation-audit-report-2026-10-05.md#a02-p1) · P1 | Open | **Task:** Label simulation; separate approve/decline/execution and actual undo scope. | [ai-foundation.html](ai-foundation.html), [ai-foundation.js](ai-foundation.js) |
| [A03](foundation-audit-report-2026-10-05.md#a03-p1) · P1 | Open | **Task:** Specify running/partial/error/cancel/retry/expiry and compensation transitions. | [ai-foundation.html](ai-foundation.html), [ai-foundation.js](ai-foundation.js) |
| [A04](foundation-audit-report-2026-10-05.md#a04-p1) · P1 | Open | **Task:** Separate confidence from outcome; define evidence and unknown state. | [ai-foundation.html](ai-foundation.html), [ai-foundation.js](ai-foundation.js) |
| [A05](foundation-audit-report-2026-10-05.md#a05-p1) · P1 | Open | **Task:** Specify streaming, stop/retry/partial output, announcements and scroll behavior. | [ai-foundation.html](ai-foundation.html), [ai-foundation.js](ai-foundation.js) |
| [A06](foundation-audit-report-2026-10-05.md#a06-p1) · P1 | Open | **Task:** Define capability/effect/approval scope and changed-scope consent. | [ai-foundation.html](ai-foundation.html), [ai-foundation.js](ai-foundation.js) |
| [A07](foundation-audit-report-2026-10-05.md#a07-p1) · P1 | Open | **Task:** Restore focus and announce outcomes; define accessible undo behavior. | [ai-foundation.html](ai-foundation.html), [ai-foundation.js](ai-foundation.js) |
| [A08](foundation-audit-report-2026-10-05.md#a08-p1) · P1 | Open | **Task:** Publish trusted-source precedence, schemas, permissions and verification contract. | [ai-foundation.html](ai-foundation.html), [ai-foundation.js](ai-foundation.js) |
| [A09](foundation-audit-report-2026-10-05.md#a09-p1) · P1 | Partial | AI page now included in full documentation catalog/export scope. **Task:** Add AI to Foundation selection/readiness and publish portable agent/token contract. | [docs-catalog.json](docs-catalog.json), [md-export.html](md-export.html), [experience.js](experience.js) |
| [A10](foundation-audit-report-2026-10-05.md#a10-p2) · P2 | Partial | Mixed/human-edited/multi-agent authorship and unavailable-evidence examples added. **Task:** Specify provenance fields, version/tool/reviewer history, redaction and retention rules. | [ai-foundation.html](ai-foundation.html) |

## Corrections needed in the new guidance

- **X08:** Machine View comments promise no nulls and a schema marker on every object. Dynamic objects still emit nulls; authored Colors/Grid JSON lacks the marker. Make the published contract match output.
- **R03/R04:** “Every real component” uses radius slots is too broad: CSS literals remain. Define the reference contour before subtracting borders; the blanket 8px-padding-minus-1px-border example needs a measured geometry fixture.
- **H05:** Static Card SM guidance still conflicts with Borders’ no-shadow default; CSS applies rest shadow only through a modifier. Document bordered versus elevated variants explicitly.
- **I09:** Concept-based naming guidance cites libraries that contain shape names; the paragraph itself uses `notification` rather than `bell-outline`, yet existing library names are not the promised concept vocabulary. Supply a separate application action map.
- **A10/A01:** New guidance requires verified factual claims, but the existing “confirmed across 12 files” rename explanation remains unsupported. Replace it before claiming evidence-policy compliance.
- **X10/I08:** Accessibility’s universal near-zero motion statement omits the documented 3-second spinner exception. Cross-link and state that exception consistently.

## Browser acceptance tasks

- [ ] New Project: all roles, optional identity, invalid Other, history/reload, platform errors and draft recovery.
- [ ] Foundations: fresh/customized state, invalid drafts, save/apply/reload/reset, storage failure and two tabs.
- [ ] Handoff: all nine sections, correct recommendations, both modes, assets, rules and explicit omissions.
- [ ] Accessibility: actual text/focus pairs, keyboard choices/uploads/picker, announcements and focus restoration.
- [ ] Responsive: narrow view, zoom/text-spacing, long translated labels, soft keyboard, RTL and reduced motion.

**Production readiness remains unverified.** The completed items are real progress; material P1 behavior, accessibility and portable-contract gaps remain.
