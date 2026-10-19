# Damco Foundation Fix Checklist

Shareable developer task list from the 5 October 2026 source audit. **P1: before production. P2: next delivery.** Browser behavior still needs verification; this is based on the local project, not a live deployed review.

**8 October update:** source/documentation fixes are saved and every original ID has been reconciled in [the current finding table](foundation-finding-status-2026-10-08.md). See [completed implementation pointers](foundation-pending-task-completion-2026-10-08.md). The original release checkboxes remain open until rendered, keyboard and narrow-screen acceptance passes. Each task now has a separate implementation status; unchecked release boxes do not mean its source fix is absent.

References use paths relative to the Damco Agentic Design System project. Finding IDs link these short tasks to the detailed audit. Group priority follows its highest-priority finding.

## Shared system

- [ ] **Task 01 · P1 · Rebuild exports**
  - **Reference:** docs-catalog.json; design-tokens.json; tools/generate_tokens.py. Audit: X01 X02 X03 X04.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Exports are stale; defaults and AI rules are missing.
  - **Solution / guide:** Fix malformed CSS comment; regenerate catalog/tokens; resolve defaults; validate format and compare all nine sections.

- [ ] **Task 02 · P1 · Unify editor behavior**
  - **Reference:** foundations.js; shell.js; page editor scripts. Audit: X05 X06 X07.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Save/apply differs; storage errors and selected-state semantics are incomplete.
  - **Solution / guide:** Use one validated save/apply helper; retain last valid data; expose selection and failure feedback; check reload/two tabs.

- [ ] **Task 03 · P2 · Define one Foundation contract**
  - **Reference:** experience.js; project-model.js; accessibility.html. Audit: X08 X09 X10.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Schemas, product/platform mappings and verification rules differ.
  - **Solution / guide:** Share context/schema/precedence; link section-specific checks; define ownership and migration.

## New Project

- [ ] **Task 04 · P1 · Clarify projects and drafts**
  - **Reference:** new-project.html; experience.js; project-model.js. Audit: NP01 NP02 NP03.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** New Project edits one shared profile; stale drafts and overrides can mask current setup.
  - **Solution / guide:** Rename Project setup or scope data by project ID; add Resume/Discard; review affected defaults after context changes.

- [ ] **Task 05 · P1 · Complete validation and navigation**
  - **Reference:** project-model.js; experience.js; experience.css. Audit: NP04 NP05 NP07 NP08.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Other bounds, group errors, history and narrow-screen cases are incomplete.
  - **Solution / guide:** Validate all fields at review; link platform errors; define completion history; check long labels/zoom/keyboard viewport.

- [ ] **Task 06 · P1 · Add readiness before handoff**
  - **Reference:** new-project.html; project-model.js; md-export.html. Audit: NP06 NP09 NP10.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Role routing lacks a checklist; immediate export misses effective values; required identity has unclear purpose.
  - **Solution / guide:** Show role tasks and Foundation readiness; export defaults/assets/open decisions; make identity optional unless needed.

## Colors

- [ ] **Task 07 · P1 · Fix dark mode and saving**
  - **Reference:** foundations.js; foundations.html. Audit: C01 C02 C03.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Dark toggle/reset scope and saved/applied colors disagree; partial hex can persist.
  - **Solution / guide:** Choose explicit mode policy; keep resets scoped; validate complete hex; apply/export the same committed values.

- [ ] **Task 08 · P1 · Validate real accessible pairs**
  - **Reference:** foundations.js; theme.css. Audit: C04 C05 C06 C10.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Swatch checks miss actual pairs; white/default brand is ~3.98:1; picker range semantics incomplete.
  - **Solution / guide:** Check actual surfaces/labels/states; fix on-brand foreground; validate ramps; label and announce picker values.

- [ ] **Task 09 · P1 · Resolve text and semantic naming**
  - **Reference:** shell.js; theme-init.js; typography.js. Audit: C07 C08 C09.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Hidden legacy text overrides and hue-named brand variables confuse use.
  - **Solution / guide:** Migrate legacy text; define semantic aliases; document status foreground/background/icon recipes.

## Grid & Layout

- [ ] **Task 10 · P1 · Make grid choices buildable**
  - **Reference:** grid-layout.html; grid-layout.js. Audit: G01 G03 G04.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Columns/gutter advertised editable without controls; Custom and platform geometry undefined.
  - **Solution / guide:** Add validated geometry/per-platform schema or mark recommendation-only; define containers/spans/baseline.

- [ ] **Task 11 · P1 · Define responsive patterns**
  - **Reference:** grid-layout.html; shell.css; experience.css. Audit: G02 G05 G06 G07.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Breakpoints differ; blanket scrolling and pane collapse/back behavior are unspecified.
  - **Solution / guide:** Consolidate justified thresholds; specify narrow/focus/overflow/resize behavior for each pattern.

- [ ] **Task 12 · P1 · Export complete layout rules**
  - **Reference:** grid-layout.js. Audit: G08.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Snapshot omits breakpoints, patterns and overflow guidance.
  - **Solution / guide:** Include effective geometry plus static rules; verify a clean recipient can build the layout.

## Typography

- [ ] **Task 13 · P1 · Persist fonts reliably**
  - **Reference:** typography.js. Audit: T01 T02 T08.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Uploaded fonts are session-only; async completion can leave old saved data.
  - **Solution / guide:** Package durable font references; commit after load succeeds; define loading/fallback/type/size/weight checks.

- [ ] **Task 14 · P1 · Resolve readable type roles**
  - **Reference:** typography.html; typography.js; shell.js. Audit: T03 T04 T05 T06 T07 T10.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Saved levels lack component bindings; states mix with roles; readability and presets unclear.
  - **Solution / guide:** Separate roles/state colors; resolve tokens; validate metrics/pairs; define responsive styles; mark custom presets.

- [ ] **Task 15 · P1 · Include all roles in export**
  - **Reference:** typography.js; docs-catalog.json. Audit: T09.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Extra semantic roles, assets and AI Rule are omitted.
  - **Solution / guide:** Export button/label/table/code/link roles, font dependencies and responsive rules; compare with the page.

## Spacing

- [ ] **Task 16 · P1 · Resolve one allowed scale**
  - **Reference:** spacing.html; spacing.js; theme.css. Audit: S01 S02 S03 S04.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Selected/global scales conflict; Adaptive lacks an algorithm and some contexts lack defaults.
  - **Solution / guide:** Define typed scales/role mapping/exceptions; implement Adaptive; explain fallbacks and Cross-Platform choice.

- [ ] **Task 17 · P1 · Add usable composition rules**
  - **Reference:** spacing.html; spacing.js; experience.css. Audit: S05 S06 S07 S08.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Relationships, density/hit areas and fluid exceptions are unclear; export loses rules.
  - **Solution / guide:** Add form/error/wrapped examples; preserve hit bounds; document fluid/logical spacing; export complete rules.

## Radius

- [ ] **Task 18 · P1 · Make active values authoritative**
  - **Reference:** radius.html; radius.js; shell.js; theme-init.js. Audit: R01 R02 R03 R08.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Static defaults contradict remapping; numeric tokens change meaning; Reset differs after reload.
  - **Solution / guide:** Keep numeric primitives fixed; map semantic roles once; show active values and stable reset target.

- [ ] **Task 19 · P1 · Document shape exceptions**
  - **Reference:** radius.html; radius.js. Audit: R04 R05 R06 R07.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Nested/edge/circle/focus rules are incomplete and missing from export.
  - **Solution / guide:** Add scoped nested formula and attached/full-screen variants; preserve state geometry; export effective mapping.

## Borders

- [ ] **Task 20 · P1 · Finish state and preset rules**
  - **Reference:** borders.html; borders.js; theme.css. Audit: B01 B02 B03 B05 B06.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** State properties are advertised editable but fixed; widths can shift; presets/defaults differ.
  - **Solution / guide:** Implement or label fixed properties; reserve border geometry; define state precedence and approved width exceptions.

- [ ] **Task 21 · P1 · Link colors and verify boundaries**
  - **Reference:** borders.js; borders.html. Audit: B04 B07 B08 B09.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Literal state colors detach from Colors; focus/accessibility and RTL rules missing from handoff.
  - **Solution / guide:** Use semantic aliases; check composited pairs; add logical edges/high-contrast examples; export behavior rules.

## Shadows

- [ ] **Task 22 · P1 · Resolve philosophy and card variants**
  - **Reference:** shadows.html; shadows.js; theme.css; shell.css. Audit: H01 H02 H05.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Philosophy saves a name only; Card defaults conflict.
  - **Solution / guide:** Define effective shadow recipes per philosophy; separate static/elevated/interactive cards; correct absent-picker copy.

- [ ] **Task 23 · P1 · Define layers and complete export**
  - **Reference:** shadows.html; shadows.js; theme.css. Audit: H03 H04 H06 H07.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Dark/high-contrast separation, stacking/clipping and local snapshot are incomplete.
  - **Solution / guide:** Add theme fallbacks/layer map/nested-overlay states; include complete recipes and rules in export.

## Icons

- [ ] **Task 24 · P1 · Fix accessible durable uploads**
  - **Reference:** icons.html; icons.js. Audit: I01 I02 I03 I06.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** References vanish; keyboard chooser, per-file recovery and semantic examples missing.
  - **Solution / guide:** Add real Choose files button, asset manifest/remove/reset, validation/errors and decorative/functional labeling examples.

- [ ] **Task 25 · P1 · Define an operational icon system**
  - **Reference:** icons.html; icons.js. Audit: I04 I05 I07 I08 I09 I10.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Library/style choice is metadata; glyph/hit area and generation/export rules incomplete.
  - **Solution / guide:** Separate icons/illustrations; provide named normalized set; define hit areas/RTL/motion; package assets and agent constraints.

## AI & Agents

- [ ] **Task 26 · P1 · Replace unsupported evidence**
  - **Reference:** ai-foundation.html. Audit: A01 A04 A10.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** Rename example contradicts code; confidence/provenance lack definitions.
  - **Solution / guide:** Use verified citations/diff or label fiction; define uncertainty/unknown and authorship/source history.

- [ ] **Task 27 · P1 · Make outcomes truthful and recoverable**
  - **Reference:** ai-foundation.html; ai-foundation.js. Audit: A02 A03 A05 A06 A07.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** UI-only approval says applied; decline looks failed; stream/action/focus/undo states missing.
  - **Solution / guide:** Label simulation; separate decisions/execution; add scoped effects, lifecycle/cancel/retry/undo and accessible outcomes.

- [ ] **Task 28 · P1 · Export the agent contract**
  - **Reference:** experience.js; md-export.html; docs-catalog.json; theme.css. Audit: A08 A09.
  - **Implementation:** Saved source/documentation changes; see individual finding IDs in the current tracker.
  - **Original problem:** AI section absent from normal handoff; consumer instructions incomplete.
  - **Solution / guide:** Include AI rules/tokens/contracts; define trusted sources, scope, output schema and verification.

## Close each task only after checking

- The page, saved value, Machine View and exported file agree.
- Refresh/reset and invalid-input/storage-failure recovery work.
- Keyboard, narrow screen, both themes and long content work.
- Export includes required rules, defaults and assets.

Detailed evidence: [Full Foundation audit](foundation-audit-report-2026-10-05.md).
Accessibility baseline: [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Token interchange: [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/).
