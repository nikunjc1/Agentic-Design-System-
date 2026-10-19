# Foundation implementation check 6 October 2026

**13 implemented, 52 partially implemented, 35 open** against the original 100 findings. Previous check: 9 implemented, 29 partial, 62 open. Five findings now close at source/documentation level; catalog freshness is partial again.

Implemented means the core documented fix is present; a permitted preview-only scope can close a truthfulness gap. Partial means a material requirement remains. These are local source/documentation statuses. Visual, keyboard and screen-reader acceptance remains pending because no browser is connected.

Reviewed HEAD `2933231da54002a5a7a894a4a0d5cbd3305187ac` plus the uncommitted Typography copy. 30 new commits since the previous check. Typography working-copy hash: `1d75bb7055d71d3e0b2212d0bf202b89015e0378f9586d958f34304522a3b575`. Existing reports and implementation files are preserved.

[Original problems and full solutions](foundation-audit-report-2026-10-05.md) · [Short task checklist](foundation-fix-checklist-2026-10-05.md) · [Previous status](foundation-implementation-status-2026-10-05.md)

## What is now implemented on the design

| Section | Present in design or documentation | Next task |
| --- | --- | --- |
| Project setup | Renamed entry; replacement notice; draft Resume/Discard; error summary; optional identity; role/readiness guidance. | Complete draft edge cases and keep defaults/override/export precedence consistent. |
| Colors | Independent family controls; scoped/all reset; last-valid hex; aliases; on-brand resolver; tint checks; picker names; legacy text retired. | Fix Brand toggle/reload, failed-save feedback, all state contrast pairs and picker value semantics. |
| Grid and Layout | Editable columns/gutter; independent baseline; platform-conflict notice; reflow and Master-Detail guidance; richer snapshot. | Enforce bounds and Custom validation; define all responsive patterns, containers and complete export. |
| Typography | Preview-only uploads; async completion/read errors; level samples; role/state explanations; blur clamping. | Fix draft/commit and sample refresh; build responsive/semantic contract and asset handoff. |
| Spacing | Consumer/AI recommendations; single-platform/context notices; composition and fluid/RTL guidance. | Resolve Adaptive and role scales, density/hit areas and complete typed export. |
| Radius | Attached/pill/state rules; reset/load parity; context notices; token adoption. | Resolve active defaults, immutable primitive names and nested geometry/export. |
| Borders | Logical sides; preset Custom state; selection attributes; storage helper; width exceptions. | Implement fixed-versus-editable state contract, precedence, contrast and truthful pressed state. |
| Shadows | Interaction/motion notes; hover scope; selection/storage helper. | Define recipes, Card variants, dark/layer behavior and export. |
| Icons | Disabled irrelevant controls; RTL/motion/AI notes; selection/storage helper. | Persist/reference assets, keyboard upload, normalization, catalog and accessible semantics. |
| AI and Agents | Mixed-authorship/unavailable-evidence guidance and full catalog inclusion. | Verify example citations; label simulated effects; define execution/stream/focus/approval contracts. |

## Findings newly closed

- **NP01:** Project setup now accurately describes one editable profile with shared Foundations.
- **NP05:** Checkbox error association, named error summary and separate draft feedback are implemented.
- **C07:** Invisible legacy text overrides are retired and text ownership is explicit.
- **G05:** Reflow and justified independent scrolling have an actionable usage contract.
- **T01:** Uploaded fonts are explicitly preview-only in preview, local Markdown and Machine View.

## Checks and remaining problems

- **Tests:** 15/15 model tests pass: 9 project-model tests and 6 Overview-model tests. The latter cover the currently unlinked Overview implementation; they do not verify this portal UI.
- **Token parity:** freshness passes; all 127 tokens match current generator output. DTCG format remains partial: 27 CSS-string color values and 34 nonstandard `other` types, plus composite color/alias issues.
- **Catalog:** freshness fails. Content comparison isolates `typography.html`; its newest responsive guidance is absent from the catalog. Regenerate and rerun the check before handoff.
- **Export default mismatch:** a Data-Heavy project targeting only Desktop Web exports data-heavy/2px/Sharp/Columns+Rows. All three editors recommend desktop-web/8px/Compact/Columns. Share the same resolver; include columns/gutter/baseline in unsaved defaults.
- **Contrast:** the new saved-brand algorithm chooses white for default `#FF031A`. Default is 3.98:1 and its derived hover is 3.41:1; neither passes normal-text AA. Static dark-text fallback and saved behavior differ. Choose foreground/background pairs that pass every actual state.
- **Storage:** safeSet returns false on failure, but callers still mark Saved/apply/run success messages. Gate these on success; preserve last committed values and distinguish unavailable/corrupt/missing records.
- **Grid input:** parseInt accepts values beyond the declared 24-column/64px-gutter bounds and truncates decimals; validation gates only the explicit Custom Save button while autosave still writes. Validate every write and export.
- **Draft notice:** project name is inserted into innerHTML. Build the notice with textContent and separate button nodes. Add discard/recovery for draft-only, corrupt and future records.
- **Selection:** Borders can leave aria-pressed=true after its active preset class is removed; Typography platform chips remain visual-only. Update attributes in every divergence/reset/load path.
- **Typography:** line-height is auto-saved before blur; blur correction has no persistence event. Samples miss some color/theme refreshes. State-color inheritance remains prose beside editable per-state metrics.

## Correction to the earlier audit

The earlier G02 claim that the active Overview collapses at 800px was incorrect. That rule is in `overview.css`, which `overview.html` does not load; its active layout uses shared shell CSS at 900px. The new change correctly removes this stale claim and consolidates 600px into 640px. Remaining breakpoint exceptions still need a governed contract and boundary verification.

## Full finding status

P1 means before production; P2 means next delivery. Each ID links to the original problem and detailed solution. Keep Partial and Open findings on the task list.

### Shared system

1 implemented · 9 partial · 0 open.

| Reference | Status | Present change or problem and next task | Files |
| --- | --- | --- | --- |
| [X01](foundation-audit-report-2026-10-05.md#x01-p1) · P1 | Partial | Catalog rebuilt and freshness guard exists. **Remaining:** latest Typography content is stale; regenerate catalog and require the check before release. | [docs-catalog.json](docs-catalog.json), [tools/audit_pages.py](tools/audit_pages.py), [typography.html](typography.html) |
| [X02](foundation-audit-report-2026-10-05.md#x02-p1) · P1 | Partial | Export resolves product defaults. **Remaining:** match single-platform editor precedence; include grid geometry, modes and effective component values. | [experience.js](experience.js), [spacing.js](spacing.js), [radius.js](radius.js), [grid-layout.js](grid-layout.js) |
| [X03](foundation-audit-report-2026-10-05.md#x03-p1) · P1 | Implemented | Current artifact has 127 tokens and matches the generator/CSS. JetBrains Mono and missing families are restored. **Verify:** release parity; format validity remains X04. | [design-tokens.json](design-tokens.json), [tools/generate_tokens.py](tools/generate_tokens.py) |
| [X04](foundation-audit-report-2026-10-05.md#x04-p1) · P1 | Partial | Version, dimensions/durations and aliases improved and committed. **Remaining:** 27 CSS-string colors, 34 nonstandard other types, shadow color shapes and importer validation. | [tools/generate_tokens.py](tools/generate_tokens.py), [design-tokens.json](design-tokens.json) |
| [X05](foundation-audit-report-2026-10-05.md#x05-p1) · P1 | Partial | Auto-save, Apply and export tiers documented; Color status wording improved. **Remaining:** Save/Saved controls still imply pending save/apply; enforce truthful failure/commit feedback. | [accessibility.html](accessibility.html), [foundations.js](foundations.js) |
| [X06](foundation-audit-report-2026-10-05.md#x06-p1) · P1 | Partial | Shared safeGet/safeSet and storage banner added. **Remaining:** callers ignore false returns; malformed shapes/future versions and reset failures lack coherent recovery. | [shell.js](shell.js), [foundations.js](foundations.js), [grid-layout.js](grid-layout.js), [typography.js](typography.js) |
| [X07](foundation-audit-report-2026-10-05.md#x07-p1) · P1 | Partial | Foundation card groups get pressed state and live recommendations. **Remaining:** Typography chips lack selection state; Borders clears active class without clearing aria-pressed. | [spacing.js](spacing.js), [radius.js](radius.js), [grid-layout.js](grid-layout.js), [borders.js](borders.js), [typography.js](typography.js) |
| [X08](foundation-audit-report-2026-10-05.md#x08-p2) · P2 | Partial | Generated Machine Views have a shared version marker. **Task:** Fix null-policy contradictions; version static JSON; include prose/AI rules and typed schemas. | [experience.js](experience.js), [foundations.html](foundations.html), [grid-layout.html](grid-layout.html), [borders.js](borders.js) |
| [X09](foundation-audit-report-2026-10-05.md#x09-p2) · P2 | Partial | Cards/labels align; Other fallback and Typography taxonomy rationale added. **Task:** Centralize duplicated mappings and define platform/density/override precedence. | [spacing.html](spacing.html), [typography.js](typography.js), [project-model.js](project-model.js) |
| [X10](foundation-audit-report-2026-10-05.md#x10-p2) · P2 | Partial | Nine-section compatibility and release-contract table added. **Task:** Add executable responsive/accessibility/native checks, evidence links and migration examples. | [accessibility.html](accessibility.html) |

### New Project

3 implemented · 7 partial · 0 open.

| Reference | Status | Present change or problem and next task | Files |
| --- | --- | --- | --- |
| [NP01](foundation-audit-report-2026-10-05.md#np01-p1) · P1 | Implemented | Renamed Project setup across navigation; replacement and workspace-owned Foundations disclosed. **Verify:** existing-profile journey. Multi-project operations remain explicitly outside this scope. | [new-project.html](new-project.html), [experience.js](experience.js) |
| [NP02](foundation-audit-report-2026-10-05.md#np02-p1) · P1 | Partial | Single-platform recommendations, saved provenance and reconciliation notices added. **Remaining:** export precedence differs; track overridden philosophy/geometry values and legacy provenance. | [spacing.js](spacing.js), [radius.js](radius.js), [grid-layout.js](grid-layout.js), [experience.js](experience.js) |
| [NP03](foundation-audit-report-2026-10-05.md#np03-p1) · P1 | Partial | Draft timestamps, differing-profile Resume/Discard and legacy migration added. **Remaining:** draft-only/corrupt/future-schema recovery and safe project-name insertion. | [experience.js](experience.js), [project-model.js](project-model.js) |
| [NP04](foundation-audit-report-2026-10-05.md#np04-p2) · P2 | Implemented | Other text is bounded/type-checked; numeric future profile versions are rejected. **Verify:** Keep boundary and future-version tests. | [project-model.js](project-model.js), [tests/project-model.test.js](tests/project-model.test.js) |
| [NP05](foundation-audit-report-2026-10-05.md#np05-p1) · P1 | Implemented | Platform checkboxes directly reference errors; summary names invalid fields; required marks and separate draft-save status added. **Verify:** screen-reader and corrected-field journeys. | [experience.js](experience.js), [new-project.html](new-project.html) |
| [NP06](foundation-audit-report-2026-10-05.md#np06-p2) · P2 | Partial | Role tasks and eight-section Default/Configured list added. **Task:** Include AI; distinguish any saved key from validated, complete readiness. | [experience.js](experience.js), [new-project.html](new-project.html) |
| [NP07](foundation-audit-report-2026-10-05.md#np07-p2) · P2 | Partial | Final submission validates both steps; history can reopen the form. **Task:** Document/implement deep-link and reload policy; test hidden-field error focus. | [experience.js](experience.js) |
| [NP08](foundation-audit-report-2026-10-05.md#np08-p2) · P2 | Partial | Most setup radii now use tokens. **Task:** Replace remaining literals; verify long labels, zoom, split windows and soft keyboard. | [experience.css](experience.css), [new-project.html](new-project.html) |
| [NP09](foundation-audit-report-2026-10-05.md#np09-p1) · P1 | Partial | Export lists provenance, open product/role decisions and session-only icon limits. **Remaining:** actual validation results, effective values and complete font/icon asset manifest. | [project-model.js](project-model.js), [experience.js](experience.js) |
| [NP10](foundation-audit-report-2026-10-05.md#np10-p2) · P2 | Partial | Identity fields optional; purpose and Other/editability copy added. **Task:** Add overlapping-category examples and browse/return journey. | [new-project.html](new-project.html), [project-model.js](project-model.js) |

### Colors

1 implemented · 9 partial · 0 open.

| Reference | Status | Present change or problem and next task | Files |
| --- | --- | --- | --- |
| [C01](foundation-audit-report-2026-10-05.md#c01-p1) · P1 | Partial | Brand-specific dark policy and hidden dark exports corrected. **Remaining:** disabling Brand custom dark only hides it; custom auto=false remains and reload rechecks the toggle. | [foundations.html](foundations.html), [foundations.js](foundations.js) |
| [C02](foundation-audit-report-2026-10-05.md#c02-p1) · P1 | Partial | Cross-family synchronization removed; section reset scoped; all-colors reset added. **Remaining:** Brand toggle state still re-enables on reload; provide durable mode state and rollback/failure behavior. | [foundations.js](foundations.js) |
| [C03](foundation-audit-report-2026-10-05.md#c03-p1) · P1 | Partial | Surface/status/neutral retain last valid hex and report incomplete fields. **Remaining:** Brand dark partial edits can drop stored dark; Saved feedback remains optimistic on rejected/write-failed edits. | [foundations.js](foundations.js) |
| [C04](foundation-audit-report-2026-10-05.md#c04-p1) · P1 | Partial | Badge scope disclosed; Brand tint compositing added. **Remaining:** actual component/role/surface/opacity pair matrix and typography checks. | [foundations.js](foundations.js), [foundations.html](foundations.html) |
| [C05](foundation-audit-report-2026-10-05.md#c05-p1) · P1 | Partial | Live on-brand resolver and per-state ratios added. **Remaining:** saving default red selects white; default 3.98:1 and derived hover 3.41:1 fail. Adopt passing foreground/background pairs per state. | [foundations.js](foundations.js), [shell.js](shell.js), [theme.css](theme.css), [shell.css](shell.css) |
| [C06](foundation-audit-report-2026-10-05.md#c06-p2) · P2 | Partial | Dark accent searches for 7:1; formula version and surface gap warnings documented. **Remaining:** revalidate after surface edits and check hover/active, role pairs and difficult-brand outcomes. | [foundations.js](foundations.js), [foundations.html](foundations.html) |
| [C07](foundation-audit-report-2026-10-05.md#c07-p1) · P1 | Implemented | Legacy text overrides retired from boot/shell and cleared; fixed site text versus preview/export typography ownership documented. **Verify:** old saved-profile migration. | [shell.js](shell.js), [theme-init.js](theme-init.js), [accessibility.html](accessibility.html) |
| [C08](foundation-audit-report-2026-10-05.md#c08-p2) · P2 | Partial | Brand and surface semantic aliases added without removing legacy names. **Task:** Map text/action/derived roles consistently across editor, Machine View and export. | [theme.css](theme.css), [foundations.html](foundations.html) |
| [C09](foundation-audit-report-2026-10-05.md#c09-p2) · P2 | Partial | Alert/Badge/Tag/Table/form recipes and selection/data distinctions added. **Task:** Specify composited foreground/background values and passing/failing accessible examples. | [foundations.html](foundations.html) |
| [C10](foundation-audit-report-2026-10-05.md#c10-p1) · P1 | Partial | Hue/alpha names and values, visible alpha policy and outside-dismiss focus added. **Remaining:** two-dimensional slider lacks aria-valuenow; provide usable numeric/range alternatives and test clipping/focus. | [foundations.js](foundations.js) |

### Grid & Layout

1 implemented · 7 partial · 0 open.

| Reference | Status | Present change or problem and next task | Files |
| --- | --- | --- | --- |
| [G01](foundation-audit-report-2026-10-05.md#g01-p1) · P1 | Partial | Columns/gutter controls persist/export; Custom gets a definition prompt. **Remaining:** enforce maxima/integer/full-input bounds; autosave must reject invalid Custom records; define margins/containers. | [grid-layout.html](grid-layout.html), [grid-layout.js](grid-layout.js) |
| [G02](foundation-audit-report-2026-10-05.md#g02-p1) · P1 | Partial | 600px merged into 640px; unused Overview 800px claim corrected. **Remaining:** govern 700px/listing exceptions and boundary fixtures; canonical contract still incomplete. | [grid-layout.html](grid-layout.html), [shell.css](shell.css), [experience.css](experience.css) |
| [G03](foundation-audit-report-2026-10-05.md#g03-p1) · P1 | Partial | Single-platform precedence and multi-platform geometry conflict notice added. **Remaining:** per-platform geometry, density/container axes and export parity. | [grid-layout.js](grid-layout.js), [experience.js](experience.js) |
| [G04](foundation-audit-report-2026-10-05.md#g04-p1) · P1 | Partial | Baseline is now an independent persisted checkbox. **Remaining:** container widths/margins, spans, nested grids, alignment and row/baseline role rules. | [grid-layout.html](grid-layout.html), [grid-layout.js](grid-layout.js) |
| [G05](foundation-audit-report-2026-10-05.md#g05-p1) · P1 | Implemented | Reflow-first rule and justified independent scroll, keyboard/name/affordance, action reachability and truncation recovery guidance added. **Verify:** mobile keyboard and nested-region fixtures. | [grid-layout.html](grid-layout.html) |
| [G06](foundation-audit-report-2026-10-05.md#g06-p1) · P1 | Partial | Master-Detail narrow drill-down, Back/focus restoration and detail states documented. **Remaining:** equivalent contracts for the other seven patterns and wide/narrow transitions. | [grid-layout.html](grid-layout.html) |
| [G07](foundation-audit-report-2026-10-05.md#g07-p2) · P2 | Partial | Split View/Master-Detail reference Splitter; priority and Affix guidance added. **Task:** Add working links, exact pane bounds/persistence and nested overlay/collision rules. | [grid-layout.html](grid-layout.html) |
| [G08](foundation-audit-report-2026-10-05.md#g08-p1) · P1 | Partial | Local snapshot adds geometry, baseline, breakpoints and some overflow/Master-Detail rules. **Remaining:** pattern inventory, pane states, scroll-region requirements and complete validated Custom geometry. | [grid-layout.js](grid-layout.js), [grid-layout.html](grid-layout.html) |

### Typography

1 implemented · 8 partial · 1 open.

| Reference | Status | Present change or problem and next task | Files |
| --- | --- | --- | --- |
| [T01](foundation-audit-report-2026-10-05.md#t01-p1) · P1 | Implemented | Uploaded fonts explicitly preview-only; restore warning, local Markdown note and machine durability flag added. **Verify:** reload and handoff. Durable packaging remains an optional future capability. | [typography.js](typography.js) |
| [T02](foundation-audit-report-2026-10-05.md#t02-p1) · P1 | Partial | Async font success dispatches a persist/update event; FileReader failure shows retry guidance. **Remaining:** cancellation/stale upload races and preserving/retrying the prior valid asset consistently. | [typography.js](typography.js) |
| [T03](foundation-audit-report-2026-10-05.md#t03-p1) · P1 | Partial | Per-row samples and explicit export-only scope added. **Remaining:** samples do not update on every color/theme change; effective semantic bindings/application contract still missing. | [typography.js](typography.js), [typography.html](typography.html), [accessibility.html](accessibility.html) |
| [T04](foundation-audit-report-2026-10-05.md#t04-p1) · P1 | Partial | Visual/HTML headings, Body/Paragraph and state-color axes explained. **Remaining:** state rows retain independent metrics and full-level payload; schema/UI must reflect modifier inheritance. | [typography.html](typography.html), [typography.js](typography.js) |
| [T05](foundation-audit-report-2026-10-05.md#t05-p1) · P1 | Partial | Line-height typing no longer clamps per keystroke; blur clamp and low-value warning added. **Remaining:** drafts still auto-save before clamp; blur does not resave; local hex snapshot still reads partial text. | [typography.js](typography.js) |
| [T06](foundation-audit-report-2026-10-05.md#t06-p1) · P1 | Partial | Uncommitted copy correctly limits existing H1 behavior and proposes a fluid example. **Remaining:** actual responsive per-role/platform resolver, approved minima and export variants. | [typography.html](typography.html), [typography.js](typography.js) |
| [T07](foundation-audit-report-2026-10-05.md#t07-p1) · P1 | Open | **Task:** Correct readable text pairs; verify multilingual expansion and text-spacing. | [typography.html](typography.html), [typography.js](typography.js), [shell.js](shell.js) |
| [T08](foundation-audit-report-2026-10-05.md#t08-p2) · P2 | Partial | Stylesheet-load failure feedback and category-specific preview fallbacks added. **Task:** Check actual font-face loads, weights/axes, file bounds and sitewide fallback parity. | [typography.js](typography.js), [shell.js](shell.js) |
| [T09](foundation-audit-report-2026-10-05.md#t09-p1) · P1 | Partial | Regenerated full catalog now contains extra roles and AI Rule. **Task:** Local Typography snapshot still omits these; include durable fonts and responsive variants. | [docs-catalog.json](docs-catalog.json), [typography.js](typography.js) |
| [T10](foundation-audit-report-2026-10-05.md#t10-p2) · P2 | Partial | Common non-data clicks filtered; modified size presets lose active state. **Task:** Persist only actual value changes; add multi-row change review and undo. | [typography.js](typography.js) |

### Spacing

1 implemented · 2 partial · 5 open.

| Reference | Status | Present change or problem and next task | Files |
| --- | --- | --- | --- |
| [S01](foundation-audit-report-2026-10-05.md#s01-p1) · P1 | Open | **Task:** Resolve selected spacing systems into named primitive/semantic values. | [spacing.html](spacing.html), [spacing.js](spacing.js) |
| [S02](foundation-audit-report-2026-10-05.md#s02-p1) · P1 | Open | **Task:** Define one allowed-value contract with zero/auto/percent/negative exceptions. | [spacing.html](spacing.html), [spacing.js](spacing.js) |
| [S03](foundation-audit-report-2026-10-05.md#s03-p1) · P1 | Open | **Task:** Implement Adaptive and reconcile the Cross-Platform choice/comment. | [spacing.html](spacing.html), [spacing.js](spacing.js) |
| [S04](foundation-audit-report-2026-10-05.md#s04-p2) · P2 | Implemented | Consumer/AI cards added; Data-Heavy names align; Other fallback is explained. **Verify:** Verify all product recommendations and overrides in-browser. | [spacing.html](spacing.html), [spacing.js](spacing.js), [radius.js](radius.js), [grid-layout.js](grid-layout.js) |
| [S05](foundation-audit-report-2026-10-05.md#s05-p2) · P2 | Partial | Scrim/content split and form/list/empty-state values added. **Task:** Formalize checkbox/radio/toolbar, wrapped/error composition and semantic relationships. | [spacing.html](spacing.html) |
| [S06](foundation-audit-report-2026-10-05.md#s06-p1) · P1 | Open | **Task:** Separate density, glyph sizes, hit areas and text constraints. | [spacing.html](spacing.html), [spacing.js](spacing.js) |
| [S07](foundation-audit-report-2026-10-05.md#s07-p2) · P2 | Partial | One off-scale padding and RTL margin corrected; fluid exception documented. **Task:** Audit remaining literals; define native units and approved structural tokens. | [experience.css](experience.css), [spacing.html](spacing.html) |
| [S08](foundation-audit-report-2026-10-05.md#s08-p1) · P1 | Open | **Task:** Export typed relationship, platform/density and composition rules. | [spacing.html](spacing.html), [spacing.js](spacing.js) |

### Radius

3 implemented · 2 partial · 3 open.

| Reference | Status | Present change or problem and next task | Files |
| --- | --- | --- | --- |
| [R01](foundation-audit-report-2026-10-05.md#r01-p1) · P1 | Open | **Task:** Generate effective component defaults and AI instructions from selected philosophy. | [radius.html](radius.html), [radius.js](radius.js), [shell.js](shell.js) |
| [R02](foundation-audit-report-2026-10-05.md#r02-p1) · P1 | Open | **Task:** Keep numeric primitives immutable; remap semantic aliases from one resolver. | [radius.html](radius.html), [radius.js](radius.js), [shell.js](shell.js) |
| [R03](foundation-audit-report-2026-10-05.md#r03-p2) · P2 | Partial | Core-versus-full scale and default role-slot interpretation clarified. **Task:** Show exact active role permissions; remove blanket all-components-tokenized claim. | [radius.html](radius.html), [shell.css](shell.css) |
| [R04](foundation-audit-report-2026-10-05.md#r04-p2) · P2 | Partial | Nested-radius cap and independent-child exception explained. **Task:** Correct/verify border-inset geometry; define outer/inner contours with asymmetric examples. | [radius.html](radius.html) |
| [R05](foundation-audit-report-2026-10-05.md#r05-p2) · P2 | Implemented | Attached edges, full-screen surfaces and circle-versus-pill rules are documented. **Verify:** Verify sheet/drawer implementations against these rules. | [radius.html](radius.html) |
| [R06](foundation-audit-report-2026-10-05.md#r06-p2) · P2 | Implemented | State invariance and overflow/focus-clipping constraints are documented. **Verify:** Test keyboard focus near clipped rounded edges. | [radius.html](radius.html) |
| [R07](foundation-audit-report-2026-10-05.md#r07-p1) · P1 | Open | **Task:** Export active semantic map and attached/nested rules. | [radius.html](radius.html), [radius.js](radius.js), [shell.js](shell.js) |
| [R08](foundation-audit-report-2026-10-05.md#r08-p2) · P2 | Implemented | Reset and initial load use the same project-recommendation path. **Verify:** Verify reset/reload with Sharp, Soft and Other projects. | [radius.js](radius.js) |

### Borders

0 implemented · 3 partial · 6 open.

| Reference | Status | Present change or problem and next task | Files |
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

| Reference | Status | Present change or problem and next task | Files |
| --- | --- | --- | --- |
| [H01](foundation-audit-report-2026-10-05.md#h01-p1) · P1 | Open | **Task:** Resolve shadow philosophies; fix Flat/overlay contradictions and absent-product copy. | [shadows.html](shadows.html), [shadows.js](shadows.js), [theme.css](theme.css) |
| [H02](foundation-audit-report-2026-10-05.md#h02-p1) · P1 | Open | **Task:** Publish typed recipes and distinct philosophy/component mappings. | [shadows.html](shadows.html), [shadows.js](shadows.js), [theme.css](theme.css) |
| [H03](foundation-audit-report-2026-10-05.md#h03-p1) · P1 | Open | **Task:** Define dark/custom/forced-color/print separation alternatives. | [shadows.html](shadows.html), [shadows.js](shadows.js), [theme.css](theme.css) |
| [H04](foundation-audit-report-2026-10-05.md#h04-p1) · P1 | Open | **Task:** Define z-index, portals, nesting, clipping and focus ownership. | [shadows.html](shadows.html), [shadows.js](shadows.js), [theme.css](theme.css) |
| [H05](foundation-audit-report-2026-10-05.md#h05-p2) · P2 | Partial | Real hover/press limited to interactive cards; static/interactive guidance separated. **Task:** Align rest variants: Shadows still says static SM while Borders says no default shadow. | [shell.css](shell.css), [shadows.html](shadows.html), [borders.html](borders.html) |
| [H06](foundation-audit-report-2026-10-05.md#h06-p2) · P2 | Implemented | Focus/selected/pressed signals, reduced motion and shadow performance guidance added. **Verify:** Verify keyboard/touch examples and rendered transitions. | [shadows.html](shadows.html) |
| [H07](foundation-audit-report-2026-10-05.md#h07-p1) · P1 | Open | **Task:** Export effective shadow recipes, modes and layer rules. | [shadows.html](shadows.html), [shadows.js](shadows.js), [theme.css](theme.css) |

### Icons

1 implemented · 2 partial · 7 open.

| Reference | Status | Present change or problem and next task | Files |
| --- | --- | --- | --- |
| [I01](foundation-audit-report-2026-10-05.md#i01-p1) · P1 | Open | **Task:** Persist/package uploaded references; add remove/replace and complete reset. | [icons.html](icons.html), [icons.js](icons.js) |
| [I02](foundation-audit-report-2026-10-05.md#i02-p1) · P1 | Open | **Task:** Provide a visible keyboard-operable Choose files control. | [icons.html](icons.html), [icons.js](icons.js) |
| [I03](foundation-audit-report-2026-10-05.md#i03-p1) · P1 | Open | **Task:** Validate type/size/count/decode/read errors and normalized SVG reuse. | [icons.html](icons.html), [icons.js](icons.js) |
| [I04](foundation-audit-report-2026-10-05.md#i04-p2) · P2 | Partial | Stroke/corner controls disabled for styles they cannot affect. **Task:** Separate UI glyphs from illustrations and define library/style compatibility. | [icons.js](icons.js), [icons.html](icons.html) |
| [I05](foundation-audit-report-2026-10-05.md#i05-p1) · P1 | Open | **Task:** Provide an approved named icon catalog, action map and import/resolver API. | [icons.html](icons.html), [icons.js](icons.js) |
| [I06](foundation-audit-report-2026-10-05.md#i06-p1) · P1 | Open | **Task:** Document decorative, functional, status and loading accessibility examples. | [icons.html](icons.html), [icons.js](icons.js) |
| [I07](foundation-audit-report-2026-10-05.md#i07-p1) · P1 | Open | **Task:** Separate glyph/viewBox/hit area and define optical/stroke alignment. | [icons.html](icons.html), [icons.js](icons.js) |
| [I08](foundation-audit-report-2026-10-05.md#i08-p2) · P2 | Implemented | Navigation, trend and physical-icon RTL rules plus reduced-motion loading policy added. **Verify:** Verify each mirrored icon and spinner behavior. | [icons.html](icons.html), [shell.css](shell.css) |
| [I09](foundation-audit-report-2026-10-05.md#i09-p2) · P2 | Partial | AI Rule adds geometry/currentColor/review/license constraints; uploads labeled unverified. **Task:** Fix concept-vs-shape naming contradiction; add accepted SVGs and source/version manifest. | [icons.html](icons.html) |
| [I10](foundation-audit-report-2026-10-05.md#i10-p1) · P1 | Open | **Task:** Export assets with states, semantics, direction and generation rules. | [icons.html](icons.html), [icons.js](icons.js) |

### AI & Agents

0 implemented · 2 partial · 8 open.

| Reference | Status | Present change or problem and next task | Files |
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

## Verification tasks

- [ ] Project setup: existing profile, draft-only/corrupt records, all roles, checkbox errors, history and context reconciliation.
- [ ] Color editors: partial input, independent toggles/reload, scoped reset, failed write, both themes and state contrast.
- [ ] Grid: integer/min/max bounds, invalid Custom autosave, baseline migration, platform conflicts and all narrow patterns.
- [ ] Typography: successful/failed/stale upload, reload warning, final line-height commit, theme/color sample refresh and responsive roles.
- [ ] Handoff: both modes, platform-correct effective values, assets, all nine Foundations and fresh portable rules.
- [ ] Accessibility/responsiveness: keyboard, screen-reader status/focus, zoom/text-spacing, long labels, RTL, touch and reduced motion.

The design contains substantial improvements. Production readiness still depends on closing material behavior, accessibility and handoff gaps and completing browser acceptance.
