# Damco Agentic Design System Foundation Audit

Audit date: 5 October 2026, Asia/Kolkata. Audience: designers, developers, product teams, design-system maintainers and AI-agent implementers.

The local Foundation documentation is substantial but does not yet provide an authoritative production contract. Its principal weakness is disagreement between documented guidance, editable choices, effective component values and exported instructions. This report records 100 prioritized findings and reviews all 14 requested dimensions for New Project and each of the nine Foundation sections.

## Scope and evidence limits

Reviewed local project: /Users/user/Documents/Damco Agentic Design System. Git HEAD: 1be05bfa5da1433e09901a715fe9704b41c7719a. Working tree was clean before this report. The separate Version 2 directory was not treated as authority. No supplied source URL establishes that this copy equals a deployed or Figma version.

The in-app browser connection exposed no available browser or tabs. This is therefore an intensive source and documentation audit with static navigation checks and executable project-model probes. Live-browser, Figma, visual and screen-reader verification remain outstanding. The New Project tab was not opened live; current flows below are reconstructed from HTML/JavaScript. Dedicated User Flow and Task Flow specifications were not present in the reviewed pages.

Reviewed all ten requested pages and their scripts, project-model, experience, shell and boot scripts, theme and relevant component/layout CSS, current token artifact/generator, documentation catalog, export interface and shared Accessibility guide. Button/Card sources were cross-checked where Foundation claims depended on them. The full component library and external asset libraries were not separately certified.

Evidence distinctions:

- Confirmed source defect: contradicted content/code, broken data path or reproduced model behavior. Verify UI behavior in-browser before closure.
- Documentation gap: an actionable rule/example/contract is absent from the reviewed material; this does not prove every downstream application is broken.
- Verification gap: required visual/runtime behavior remains untested; it is not an observed runtime failure.
- Recommendation: proposed target behavior, distinct from the current state.

P1 means resolve before production: reliable configuration/handoff, accessibility, deterministic implementation or truthful action feedback is affected. P2 means significant usability/clarity/scalability work for the next delivery and before broad adoption. No finding was reduced to cosmetic polish. Priorities are professional assessments of the reviewed evidence, not measured user-impact rates.

## Foundation Audit Summary

Useful foundations already exist: all nine sections are discoverable; Brand and Danger are independent; color previews and contrast badges exist; many guide sections have Human/Machine Views; native buttons supply keyboard activation; onboarding has validation, draft storage, role routes and identity opt-in export; shared navigation/accessibility mechanisms and responsive layouts exist.

The most critical gaps are:

1. Handoff parity: catalog is stale, AI section absent, local snapshots omit normative static guidance, unsaved defaults are not materialized, and token JSON predates CSS.
2. Configuration truthfulness: Grid advertises controls it lacks; Spacing/Shadows save labels without resolved systems; Typography applies only families; Radius static defaults contradict remapping; Colors mode/save/apply semantics vary.
3. Accessible operation: actual color pairs are incompletely validated; white-on-default-brand is approximately 3.98:1; selected choices are often visual only; uploads lack a keyboard entry control; AI outcomes lack focus/status handling.
4. Project lifecycle: New Project edits one profile with globally shared Foundations; drafts, context edits and overrides are not coordinated; product/platform taxonomies diverge.
5. Agent experience: rename evidence is incorrect; UI-only approval claims application; decline is treated as failure; execution, cancellation, recovery, uncertainty and permission scope need production contracts.
6. Cross-Foundation consistency: legacy text overrides remain hidden; border literals detach from colors; numeric radius names change value; Card defaults differ between sections.

Readiness verdict: do not claim production readiness until the P1 contracts are implemented and verified. Npm publishing, Figma connection and live AI execution may remain out of scope if labelled truthfully; portable documentation must still be complete and deterministic for supported capabilities.

## Checks completed

- All five existing project-model tests passed. They verify basic profile fields, corruption preservation, one legacy product mapping, identity opt-in Markdown and metadata/slug safety. They do not establish Foundation UI or end-to-end correctness.
- Additional in-memory probes confirmed acceptance of an Other description over 100 characters and future version 999, lack of legacy draft product migration, and an empty saved-token object for an untouched brief.
- Static href/src local-file checks found no missing target files on the ten requested pages. Fragment behavior, external links and generated navigation remain unverified.
- Catalog comparison confirmed removed Text colors still present; newer Spacing defaults, Typography roles, Radius Navigation and Grid Master-Detail absent; AI & Agents absent entirely.
- Token comparison confirmed missing new families and Inter versus JetBrains Mono mismatch. Generator extraction also encounters a malformed comment around --space-*/--shadow-*; merely regenerating is insufficient until source/parsing is corrected.
- Relative-luminance calculations yielded about 3.98:1 white/default red, 3.56:1 muted light text/white, and 3.21:1 muted dark text/dark panel. These are pair calculations, not rendered-page certification.

The recommended accessibility baseline is WCAG 2.2 AA. Normal text generally requires 4.5:1, large text 3:1, essential non-text boundaries 3:1, subject to proper scope/exceptions. Verify keyboard, names/values, focus/status, resizing/text-spacing/reflow. AA minimum targets are generally 24 CSS px subject to exceptions; 44px is a stronger useful product target rather than a universal AA rule. See [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

Pin a validated published interchange specification such as [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/). Typed dimension/duration and composite/reference shapes differ from raw CSS strings. This is a Community Group specification, not a W3C Recommendation; identify supported version and consumer.

## Reading the gap register

User Flow describes the person's decisions and journey; Task Flow describes actions/dependencies needed for a usable outcome. Each section maps every requested dimension to findings, then records all required gap fields with source evidence. Line links refer to this audited snapshot and can move after edits. Repeated effects reference systemwide root causes rather than implying independent measured defects.

## Findings by section and priority

| Section | P1 | P2 | Total |
| --- | ---: | ---: | ---: |
| Systemwide Foundation contract | 7 | 3 | 10 |
| New Project | 5 | 5 | 10 |
| Colors | 7 | 3 | 10 |
| Grid & Layout | 7 | 1 | 8 |
| Typography | 8 | 2 | 10 |
| Spacing | 5 | 3 | 8 |
| Radius | 3 | 5 | 8 |
| Borders | 6 | 3 | 9 |
| Shadows | 5 | 2 | 7 |
| Icons | 7 | 3 | 10 |
| AI & Agents | 9 | 1 | 10 |
| Total | 69 | 31 | 100 |

## Systemwide Foundation contract

**Current User Flow:** The designer moves from product setup through independent Foundation editors, component guides and Markdown handoff. There is no integrated Foundation readiness review.

**Current Task Flow:** Configure → inspect Human and Machine Views → persist/apply → export → implement. These actions currently use different data representations.

### Detailed gap register

#### X01 P1

- **Section:** Systemwide Foundation contract
- **Current state:** The complete export reads a committed catalog; current Foundation pages contain newer guidance.
- **Issue / Gap:** Catalog retains removed Text colors, lacks newer Spacing defaults, Typography roles, Radius Navigation and Grid Master-Detail, and has no AI & Agents entry.
- **Why it matters:** Export must convey the same system as the portal.
- **Impact on UX / UI / Development:** UX: unreliable handoff. UI: generated designs drift. Development: obsolete instructions become code.
- **Recommended improvement:** Generate catalog and docs together; fail release on stale/missing sections and include dynamic guidance explicitly.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Version/hash metadata, completeness manifest, page/rule parity checks.
- **Evidence:** [docs-catalog.json:413](</Users/user/Documents/Damco Agentic Design System/docs-catalog.json:413>)

#### X02 P1

- **Section:** Systemwide Foundation contract
- **Current state:** The brief exports only records present in localStorage; absent values are described as documented defaults.
- **Issue / Gap:** Fresh setup can export an empty token object; default values, semantic aliases and effective component mappings are not resolved.
- **Why it matters:** Offline recipients cannot reconstruct the system deterministically.
- **Impact on UX / UI / Development:** UX: immediate export is incomplete. AI: invents defaults. Development: requires portal access and interpretation.
- **Recommended improvement:** Resolve defaults plus context plus overrides into a complete snapshot with provenance and mode values.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Default-resolution algorithm, effective token schema, fresh/customized export fixtures.
- **Evidence:** [experience.js:230](</Users/user/Documents/Damco Agentic Design System/experience.js:230>)

#### X03 P1

- **Section:** Systemwide Foundation contract
- **Current state:** Token JSON exists alongside current theme.css.
- **Issue / Gap:** Artifact omits current border/opacity/tracking/radius/component/AI tokens; exported monospace is Inter while current CSS uses JetBrains Mono.
- **Why it matters:** A generated artifact must stay aligned with its source.
- **Impact on UX / UI / Development:** UI: design/code mismatch. Development: missing public tokens. AI: obsolete values appear authoritative.
- **Recommended improvement:** Regenerate and validate during release; compare all intended public names and effective values.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Public-token inventory, source hash, freshness/completeness check.
- **Evidence:** [design-tokens.json:228](</Users/user/Documents/Damco Agentic Design System/design-tokens.json:228>)

#### X04 P1

- **Section:** Systemwide Foundation contract
- **Current state:** The generator claims DTCG format but emits CSS-string dimensions/durations and CSS var aliases.
- **Issue / Gap:** It does not specify a supported version or translate typed values/references into the published interchange shapes.
- **Why it matters:** An interoperability claim must be testable.
- **Impact on UX / UI / Development:** Development: strict consumers may reject values or lose aliases. Design: synchronization fails.
- **Recommended improvement:** Pin published DTCG version, use typed objects and alias references, document mode extensions, validate a real importer.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Format schema/version, importer fixture, alias/mode translation.
- **Evidence:** [tools/generate_tokens.py:120](</Users/user/Documents/Damco Agentic Design System/tools/generate_tokens.py:120>)

#### X05 P1

- **Section:** Systemwide Foundation contract
- **Current state:** Colors auto-persists but mainly applies CSS on Save; Radius/families can apply immediately; other editors save metadata.
- **Issue / Gap:** Saved, previewed, applied and exported have different meanings across sections.
- **Why it matters:** Users need predictable save/navigation behavior.
- **Impact on UX / UI / Development:** UX: misleading feedback. UI: tabs differ. Development: inconsistent editor state models.
- **Recommended improvement:** Adopt one draft/validate/commit/apply/export model or clearly separate auto-save from Apply.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Editor state diagram, feedback vocabulary, rollback/reset rules.
- **Evidence:** [foundations.js:54](</Users/user/Documents/Damco Agentic Design System/foundations.js:54>)

#### X06 P1

- **Section:** Systemwide Foundation contract
- **Current state:** Most Foundation writes access localStorage directly; reads often fall back on parse failure.
- **Issue / Gap:** Write failures, malformed records and future schemas have no common recovery path; visual selection can change before a write throws.
- **Why it matters:** Storage failure must not look like success.
- **Impact on UX / UI / Development:** UX: apparent saved work is lost. Development: unhandled exceptions/silent defaults. AI: invalid records enter export.
- **Recommended improvement:** Centralize storage validation/migration; preserve last valid state and expose recoverable errors and temporary validated export.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Quota/unavailable/corrupt/future-data states, migration/recovery matrix.
- **Evidence:** [grid-layout.js:112](</Users/user/Documents/Damco Agentic Design System/grid-layout.js:112>)

#### X07 P1

- **Section:** Systemwide Foundation contract
- **Current state:** Choice cards are native buttons; is-active exposes selection visually. Guide View toggles correctly use aria-pressed.
- **Issue / Gap:** Product/system choices generally lack programmatic selected state. Native keyboard activation exists, but outcome feedback is visual.
- **Why it matters:** Activation alone does not communicate the chosen value.
- **Impact on UX / UI / Development:** UX: screen-reader users cannot reliably identify configuration. Development: accessible state diverges.
- **Recommended improvement:** Use radio groups or labelled toggle groups with synchronized aria-pressed; announce recommendations and outcomes.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Selection semantics, group labels, assistive-technology tests.
- **Evidence:** [spacing.js:67](</Users/user/Documents/Damco Agentic Design System/spacing.js:67>)

#### X08 P2

- **Section:** Systemwide Foundation contract
- **Current state:** Static Machine Views extract usage rows/stat tiles; dynamic views use unrelated schemas.
- **Issue / Gap:** Surrounding guidance, AI Rules, conditions and examples can be omitted; scales are often prose strings.
- **Why it matters:** Machine data needs a completeness and parsing contract.
- **Impact on UX / UI / Development:** AI: misses constraints. Development: bespoke parsing. UI: inconsistent generated results.
- **Recommended improvement:** Define versioned schemas with types/units, precedence, examples and normative rules; generate both views from them.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Schema reference, null/error policy, allowed combinations.
- **Evidence:** [experience.js:421](</Users/user/Documents/Damco Agentic Design System/experience.js:421>)

#### X09 P2

- **Section:** Systemwide Foundation contract
- **Current state:** New Project separates product/platform; Foundation pages duplicate mappings and mix them again.
- **Issue / Gap:** Spacing lacks Consumer App/AI Product recommendations; Data-Heavy labels vary; Typography uses a different platform taxonomy.
- **Why it matters:** Tailoring should stay consistent throughout setup.
- **Impact on UX / UI / Development:** UX: repeated questions/ignored context. UI: unsuitable defaults. Development: duplicated mappings drift.
- **Recommended improvement:** Use canonical product/platform/density context, inherited choices, explicit overrides and explained fallbacks.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Mapping table, Other fallback, context-change/override policy.
- **Evidence:** [grid-layout.js:140](</Users/user/Documents/Damco Agentic Design System/grid-layout.js:140>)

#### X10 P2

- **Section:** Systemwide Foundation contract
- **Current state:** Shared Accessibility guide explicitly acknowledges unverified zoom/reflow and text-spacing checks.
- **Issue / Gap:** No per-Foundation release contract combines responsive, accessibility, native translation and change governance evidence.
- **Why it matters:** Shared guidance does not certify individual editors or consumers.
- **Impact on UX / UI / Development:** UX: edge users remain untested. Development: release criteria unclear. Product: readiness claim lacks evidence.
- **Recommended improvement:** Assign token owners, compatibility/deprecation rules and section-specific acceptance checks linked to environment evidence.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Ownership, release checklist, verification matrix, migration examples.
- **Evidence:** [accessibility.html:247](</Users/user/Documents/Damco Agentic Design System/accessibility.html:247>)

## New Project

**Current User Flow:** New Project → Your product (name/type/Other/platforms) → About you (name/email/designation/role/Other) → Review → Save my design system → success → role-dependent next destination or export. Browse without setup is available. Drafts resume at step 1 and take precedence over the saved profile.

**Current Task Flow:** Collect context → validate product/platforms → collect identity/role → validate → review → persist one active browser profile → configure Foundations → export → implement. Saving setup does not establish Foundation readiness.

### Review across all 14 dimensions

| Dimension | Assessment and finding references |
| --- | --- |
| User Flow | Main path and browse alternative exist; create/edit identity and readiness are unclear (NP01, NP06). |
| Task Flow | Step validation/back/review/save exist; draft lifecycle and completion recovery are incomplete (NP03, NP04, NP07). |
| Information Architecture | Product/platform are separate here but downstream taxonomy/precedence differs (NP02, X09). |
| Documentation completeness | Local-only storage is explained; formal flow specs and decision consequences are absent (NP06, NP10). |
| Component or token usage | Setup uses bespoke styles; exports raw saved Foundation records (NP08, NP09). |
| States and edge cases | Other/required/email/storage failure exist; migration, multi-tab and draft reset need rules (NP03, NP04). |
| Accessibility requirements | Labels/error references/status/heading focus exist; platform error association needs improvement (NP05). |
| Responsive behavior | 900px layout/600px field collapse exist; long content, keyboard viewport and zoom need evidence (NP08). |
| Interaction guidelines | Hashes handle steps but load resets deep links; completed history behavior is undefined (NP07). |
| AI and Agent usability | Brief has platform instructions but incomplete defaults/role-specific readiness (NP06, NP09). |
| Consistency across the design system | One-profile scope is disclosed; naming and repeated product choices confuse the contract (NP01, NP02). |
| Missing examples or usage guidelines | Missing worked setup-to-export journeys and classification examples (NP06, NP10). |
| Potential implementation gaps | Partial draft migration and global Foundation sharing create recovery/provenance gaps (NP03, NP04). |
| Designer and developer ambiguity | Inherited recommendations versus overrides after context edits are unclear (NP02, NP09). |

### Detailed gap register

#### NP01 P1

- **Section:** New Project
- **Current state:** One active setup and shared Foundation values are disclosed; saved profile repopulates the form.
- **Issue / Gap:** New Project replaces the current profile while retaining global Foundations; create/edit/duplicate/switch are not distinct operations.
- **Why it matters:** Cross-client work can mix context and tokens.
- **Impact on UX / UI / Development:** UX: misleading project identity. UI: brand/context leakage. Development: mixed-provenance exports.
- **Recommended improvement:** Rename to Project setup until isolation exists, or use project IDs and scoped Foundation stores; expose replacement consequences.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Project lifecycle, create/edit/switch/duplicate flows, token ownership.
- **Evidence:** [new-project.html:183](</Users/user/Documents/Damco Agentic Design System/new-project.html:183>)

#### NP02 P1

- **Section:** New Project
- **Current state:** Grid/Radius/Spacing inherit profile recommendations only when no own saved record exists.
- **Issue / Gap:** Product changes do not reconcile existing selections; platforms do not drive mobile grid defaults; no inherited/overridden review exists.
- **Why it matters:** Tailored setup must explain retained choices.
- **Impact on UX / UI / Development:** UX: setup appears ignored. UI: dense enterprise values may remain for consumer products. Development: context changes are nondeterministic.
- **Recommended improvement:** Track recommendation provenance, review affected choices after context edits, and resolve per-platform defaults.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Inheritance precedence, impact review, reapply recommendations, platform variants.
- **Evidence:** [grid-layout.js:160](</Users/user/Documents/Damco Agentic Design System/grid-layout.js:160>)

#### NP03 P1

- **Section:** New Project
- **Current state:** A draft silently takes precedence over profile; autosaved on input and removed on successful save.
- **Issue / Gap:** No Resume/Discard/restore-saved control or timestamp exists; stale/partial drafts mask profiles; legacy draft product values are unmigrated.
- **Why it matters:** Users need a clear recovery route.
- **Impact on UX / UI / Development:** UX: unintended edits. Development: old drafts can blank selections. Product: avoidable support burden.
- **Recommended improvement:** Show draft/profile provenance; offer resume/discard; validate/migrate both and retain saved baseline.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Draft lifecycle, partial/corrupt/legacy cases, cancel-edit behavior.
- **Evidence:** [experience.js:133](</Users/user/Documents/Damco Agentic Design System/experience.js:133>)

#### NP04 P2

- **Section:** New Project
- **Current state:** Main names have 1–100-character rules; Other checks only nonblank; version is stored.
- **Issue / Gap:** Model accepts overlength Other values and future version 999; Other descriptions lack type guards.
- **Why it matters:** UI maxlength is not a complete data contract.
- **Impact on UX / UI / Development:** Development: restored/imported values bypass bounds or throw. UX: recovery unspecified. AI: external payload ambiguous.
- **Recommended improvement:** Validate types/bounds/supported versions in the model; define trimming and Unicode length policy.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Field schema, Other boundaries/types, future-version/import behavior.
- **Evidence:** [project-model.js:42](</Users/user/Documents/Damco Agentic Design System/project-model.js:42>)

#### NP05 P1

- **Section:** New Project
- **Current state:** First platform checkbox gets aria-invalid/focus; fieldset references group error; status is polite.
- **Issue / Gap:** Focused checkbox lacks direct error association; required status is less clear in step 1; draft-save messages replace error status while typing.
- **Why it matters:** Correction guidance should persist and be discoverable.
- **Impact on UX / UI / Development:** UX: unclear group errors/requirements. Development: field/group feedback diverges.
- **Recommended improvement:** Associate group error with focused controls, add a summary, mark requirements consistently and separate save feedback from validation.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Screen-reader error journey, corrected-field timing, group semantics.
- **Evidence:** [experience.js:174](</Users/user/Documents/Damco Agentic Design System/experience.js:174>)

#### NP06 P2

- **Section:** New Project
- **Current state:** Developer goes to Components, PM to Templates, others to Colors; immediate export available.
- **Issue / Gap:** Role mainly changes destination; no role-specific checklist or Foundation completion condition exists.
- **Why it matters:** Next actions should lead to a usable handoff.
- **Impact on UX / UI / Development:** UX: under-specified next step. Development: export precedes required review. Product: tailoring overpromises.
- **Recommended improvement:** Provide role-specific tasks plus a shared readiness checklist with alternate routes.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Designer/developer/PM/QA examples, expected outputs, completion criteria.
- **Evidence:** [experience.js:207](</Users/user/Documents/Damco Agentic Design System/experience.js:207>)

#### NP07 P2

- **Section:** New Project
- **Current state:** Hash navigation validates forward steps; loading always resets to step 1; completion hides form but listener remains.
- **Issue / Gap:** Deep links are discarded; completed back/forward behavior undefined; final submit checks step-2 keys before full model validation.
- **Why it matters:** History should match visible workflow state.
- **Impact on UX / UI / Development:** UX: stale step URLs/hidden-form validation. Development: scattered transition logic.
- **Recommended improvement:** Use explicit wizard states; route final all-field errors to steps; retire step listeners or hash state on completion.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** History/deep-link policy, completion/reload scenarios, final validation.
- **Evidence:** [experience.js:191](</Users/user/Documents/Damco Agentic Design System/experience.js:191>)

#### NP08 P2

- **Section:** New Project
- **Current state:** Inputs have 44px minimum; layout/fields stack at 900/600; setup radii/padding often literal.
- **Issue / Gap:** No soft-keyboard, long-label, translated-copy or split-window contract; bespoke radii do not consistently follow saved philosophy.
- **Why it matters:** Onboarding should demonstrate its Foundation rules.
- **Impact on UX / UI / Development:** UX: narrow/localized cases uncertain. UI: configured shape mismatch. Development: special-case CSS.
- **Recommended improvement:** Map setup to semantic tokens; verify expansion/keyboard viewport, tablet/window sizing and reflow.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Responsive form fixtures, long-content examples, token mapping.
- **Evidence:** [experience.css:22](</Users/user/Documents/Damco Agentic Design System/experience.css:22>)

#### NP09 P1

- **Section:** New Project
- **Current state:** Export includes platform guidance and raw saved records; absent defaults are a sentence.
- **Issue / Gap:** No complete resolved token/validation/provenance/asset manifest travels through the immediate export path.
- **Why it matters:** Recipients need exact decisions and unresolved items.
- **Impact on UX / UI / Development:** UX: premature completeness. AI: invents missing values. Development: handoff unreproducible.
- **Recommended improvement:** Export resolved context/defaults/overrides, validation findings, assets and open decisions; keep identity opt-in.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Fresh/customized handoff examples, readiness and dependency manifest.
- **Evidence:** [project-model.js:78](</Users/user/Documents/Damco Agentic Design System/project-model.js:78>)

#### NP10 P2

- **Section:** New Project
- **Current state:** Name/email/designation required despite no account or email service; local scope explained.
- **Issue / Gap:** Mandatory identity benefit is unclear; overlapping categories/Other/browse-return lack examples.
- **Why it matters:** Setup effort should have a stated purpose.
- **Impact on UX / UI / Development:** UX: unnecessary friction and classification uncertainty. Product: data purpose unclear. Development: fallback expectations vague.
- **Recommended improvement:** Make identity optional unless needed; explain requirements and add category/browse/Other decision examples.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Data-purpose copy, product decision guide, anonymous/return journey.
- **Evidence:** [new-project.html:170](</Users/user/Documents/Damco Agentic Design System/new-project.html:170>)

## Colors

**Current User Flow:** Edit brand/surfaces/status/neutrals → optionally show dark controls → inspect scales/elevation/contrast → edits auto-persist → Save applies current-page CSS → theme-switch → local Markdown/global export. Dark controls appear independent but visibility is synchronized.

**Current Task Flow:** Choose semantic role → select actual foreground/adjacent surface pairs → validate states/modes → commit/apply → inspect representative components → export effective colors/aliases.

### Review across all 14 dimensions

| Dimension | Assessment and finding references |
| --- | --- |
| User Flow | Editing exists; dark opt-in/reset/apply semantics conflict (C01–C03). |
| Task Flow | Stops before validating actual component pairs and states (C04–C06). |
| Information Architecture | Four families separated; text ownership and hue-based naming unclear (C07, C08). |
| Documentation completeness | Meanings exist; usage pairs and mode precedence incomplete (C01, C04, C09). |
| Component or token usage | Brand uses red-named variables; on-brand/legacy text mappings inconsistent (C05, C07, C08). |
| States and edge cases | Auto/custom dark exists; partial hex/global toggles/reset are problematic (C01–C03). |
| Accessibility requirements | Badges/CVD previews exist; actual pair scope and picker semantics incomplete (C04, C05, C10). |
| Responsive behavior | Columns stack; picker clipping/focus at narrow widths needs verification (C10, X10). |
| Interaction guidelines | Auto-save label does not always mean current-page application (C03, X05). |
| AI and Agent usability | Exports omit effective hidden-dark and derived usage contract (C01, C08, X02). |
| Consistency across the design system | Fixed text references and legacy overrides disagree with Typography ownership (C04, C07). |
| Missing examples or usage guidelines | Missing accepted/rejected pair matrices and complete brand-change example (C04, C05, C09). |
| Potential implementation gaps | Partial invalid records and split persistence/synchronization paths exist (C02, C03). |
| Designer and developer ambiguity | Purpose must govern same-hex brand/danger use; override provenance unclear (C08, C09). |

### Detailed gap register

#### C01 P1

- **Section:** Colors
- **Current state:** Copy says dark optional per section/off uses defaults; Brand persistence always includes valid dark; other families conditionally include it.
- **Issue / Gap:** Brand violates documented fallback; synchronized controls contradict per-section opt-in; local Markdown can hide persisted/applied Brand dark values.
- **Why it matters:** Conflicting mode rules cannot produce faithful implementation.
- **Impact on UX / UI / Development:** UX: unexpected dark behavior. UI: different brand by export path. Development: guesswork.
- **Recommended improvement:** Choose explicit auto/custom/built-in policy per family or unify it; export effective values and update copy.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Mode precedence matrix, disabled/auto/custom examples, Brand policy.
- **Evidence:** [foundations.html:609](</Users/user/Documents/Damco Agentic Design System/foundations.html:609>)

#### C02 P1

- **Section:** Colors
- **Current state:** Any checkbox synchronizes all visible dark controls; only originating family auto-persists; resets globally hide dark controls.
- **Issue / Gap:** Local mode/reset changes affect other sections visually without durable transaction; reload enables all if any stored dark record exists.
- **Why it matters:** Operation scope must be predictable.
- **Impact on UX / UI / Development:** UX: toggles/reset seem undone. UI: preview/storage divergence. Development: partial-state complexity.
- **Recommended improvement:** Persist explicit shared preference or truly independent choices; keep section resets local, provide separate all-colors reset/undo.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Reset scope, transaction, reload/partial-save examples.
- **Evidence:** [foundations.js:924](</Users/user/Documents/Damco Agentic Design System/foundations.js:924>)

#### C03 P1

- **Section:** Colors
- **Current state:** Surface/status/neutral readers save field strings directly; Brand guards normalization; current CSS mostly updates on Save.
- **Issue / Gap:** Incomplete hex values can persist; Saved can coexist with older applied CSS; rejection lacks consistent field error.
- **Why it matters:** Invalid drafts should not become committed state.
- **Impact on UX / UI / Development:** UX: misleading feedback. UI: invalid CSS fallback. Development: invalid export values.
- **Recommended improvement:** Separate drafts/last-valid state; validate complete input; commit/apply coherently with errors.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Accepted formats, partial/invalid/blur states, apply timing.
- **Evidence:** [foundations.js:547](</Users/user/Documents/Damco Agentic Design System/foundations.js:547>)

#### C04 P1

- **Section:** Colors
- **Current state:** Non-surface badges compare to page; surfaces to fixed primary text; control border gets non-text check.
- **Issue / Gap:** Checker omits on-brand text, raised/panel/tint surfaces, opacity and live typography overrides; fill-only swatches evaluated as text without use scope.
- **Why it matters:** A badge is not component conformance.
- **Impact on UX / UI / Development:** UX: false reassurance. UI: unsuitable pairs. Development: incomplete validation inputs.
- **Recommended improvement:** Use actual effective role-specific pair matrix and compositing; state badge scope explicitly.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Pair catalog, role thresholds, opacity, accepted/rejected examples.
- **Evidence:** [foundations.js:972](</Users/user/Documents/Damco Agentic Design System/foundations.js:972>)

#### C05 P1

- **Section:** Colors
- **Current state:** Primary component text alias is fixed white; brand editable; white on default #FF031A is approximately 3.98:1.
- **Issue / Gap:** Default pair misses normal-text requirement; arbitrary light brand can worsen it; no on-brand resolver/editor.
- **Why it matters:** Primary action labels must stay readable.
- **Impact on UX / UI / Development:** UX: weak labels. UI: failed default/custom pairs. Development: arbitrary brands unsupported.
- **Recommended improvement:** Validate default/hover/pressed pairs; add explicit or approved contrast-safe foreground and brand acceptance criteria.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** On-brand policy, state pairs, semantic foregrounds.
- **Evidence:** [theme.css:68](</Users/user/Documents/Damco Agentic Design System/theme.css:68>)

#### C06 P2

- **Section:** Colors
- **Current state:** Ramps mix black/white; dark suggestions use HSL heuristics; surface/CVD previews exist.
- **Issue / Gap:** No role-validity/perceptual-order guarantee or hierarchy constraint for highly custom colors.
- **Why it matters:** Derived colors are suggestions needing contextual validation.
- **Impact on UX / UI / Development:** UI: indistinct elevations/state emphasis. Development: generators differ.
- **Recommended improvement:** Document formulas/version and role mappings; validate surface distinction and allow deliberate overrides.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Scale recipe, allowed roles, difficult brands, hierarchy warnings.
- **Evidence:** [foundations.js:145](</Users/user/Documents/Damco Agentic Design System/foundations.js:145>)

#### C07 P1

- **Section:** Colors
- **Current state:** Text editor removed in favor of Typography; boot/shell still apply legacy text records; Typography applies families, not row colors, sitewide.
- **Issue / Gap:** Hidden legacy text overrides remain active and excluded from current Foundation export map; semantic text ownership unresolved.
- **Why it matters:** Users must be able to inspect/export active decisions.
- **Impact on UX / UI / Development:** UX: invisible customization. UI: contrast/type drift. Development: orphaned migration data.
- **Recommended improvement:** Migrate/retire legacy records; define semantic text and per-level precedence; export effective text.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Migration/reset, text ownership/alias map.
- **Evidence:** [shell.js:96](</Users/user/Documents/Damco Agentic Design System/shell.js:96>)

#### C08 P2

- **Section:** Colors
- **Current state:** Brand of any hue writes red-named variables; Brand/Danger independence is correctly explained.
- **Issue / Gap:** Hue names misrepresent purpose; field/derived/semantic token mappings inconsistent across views.
- **Why it matters:** Purpose names should survive branding.
- **Impact on UX / UI / Development:** UI: brand mistakenly used for error. Development: misleading API. AI: token misuse.
- **Recommended improvement:** Add semantic brand/action/text/surface aliases and compatibility mapping; show them in all views.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Primitive/semantic mapping, allowed consumers, deprecation.
- **Evidence:** [shell.js:37](</Users/user/Documents/Damco Agentic Design System/shell.js:37>)

#### C09 P2

- **Section:** Colors
- **Current state:** Four statuses have broad purpose statements and editable hex values.
- **Issue / Gap:** No exact foreground/background/icon triplets or component examples; warning/error/info/selection/data-series distinctions incomplete.
- **Why it matters:** Meanings must stay consistent in real components.
- **Impact on UX / UI / Development:** UX: ambiguous severity/data. UI: inconsistent tints. Development: invented recipes.
- **Recommended improvement:** Define status anatomy, severity and component mapping; keep data colors distinct from status semantics.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Alert/form/table/chart examples, triplets, exclusions.
- **Evidence:** [foundations.html:362](</Users/user/Documents/Damco Agentic Design System/foundations.html:362>)

#### C10 P1

- **Section:** Colors
- **Current state:** Picker has arrow-key handling; hue/SV/alpha are focusable generic divs; alpha preview-only disclosed in title.
- **Issue / Gap:** Adjustable controls lack names/current range values; opacity non-persistence insufficiently visible; narrow positioning unverified.
- **Why it matters:** Keyboard handling alone is insufficient accessible semantics.
- **Impact on UX / UI / Development:** UX: ambiguous controls/opacity expectations. Development: incomplete picker.
- **Recommended improvement:** Use labelled ranges/numeric alternatives, announce values, visibly explain preview-only alpha, verify focus return/clipping.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Picker semantics, mobile/focus checks, alpha policy.
- **Evidence:** [foundations.js:1172](</Users/user/Documents/Damco Agentic Design System/foundations.js:1172>)

## Grid & Layout

**Current User Flow:** Read actual breakpoint inventory → choose/inherit product → get column/gutter recommendation and grid type → optionally choose another type → save → inspect pattern diagrams → copy Markdown. Numeric recommendation and Custom behavior have no editors.

**Current Task Flow:** Resolve product/platform/container/density → set geometry → select composition → define collapse/overflow → verify reading/focus order → export buildable responsive rules.

### Review across all 14 dimensions

| Dimension | Assessment and finding references |
| --- | --- |
| User Flow | Recommended numeric values are advertised editable without controls (G01). |
| Task Flow | Product/type persists; custom geometry/composition cannot be completed (G01, G04). |
| Information Architecture | Three layers explained; project platforms not resolved into them (G02, G03). |
| Documentation completeness | Actual thresholds documented; container/span/nesting contracts absent (G02, G04). |
| Component or token usage | Records contain names instead of effective grid tokens (G01, G08). |
| States and edge cases | Custom has no definition; long-content/pane states lack examples (G01, G05). |
| Accessibility requirements | Independent scrolling lacks complete keyboard/reading-order policy (G05, G06). |
| Responsive behavior | Many thresholds, no per-pattern transformation contract (G02, G03, G06). |
| Interaction guidelines | Master-detail/split are diagrams without back/resize/selection specs (G06, G07). |
| AI and Agent usability | Local snapshot omits breakpoints/patterns/overflow guidance (G08). |
| Consistency across the design system | Overview/shared shell collapse differ; acknowledged but unresolved (G02). |
| Missing examples or usage guidelines | Missing complete responsive/custom/native implementations (G03, G04). |
| Potential implementation gaps | Columns/gutters not stored as effective editable geometry (G01, G08). |
| Designer and developer ambiguity | Baseline versus layout and blanket regional scrolling are ambiguous (G04, G05). |

### Detailed gap register

#### G01 P1

- **Section:** Grid & Layout
- **Current state:** Recommendations say columns/gutters editable; code stores product/system; Custom is selectable.
- **Issue / Gap:** No numeric/editor/custom schema exists; Custom is just a label.
- **Why it matters:** Promised customization cannot be finished.
- **Impact on UX / UI / Development:** UX: dead end. Development: unbuildable spec. AI: invents geometry.
- **Recommended improvement:** Add validated columns/gutter/margin/container/per-breakpoint controls, or label recommendation-only; require Custom definition.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Numeric constraints, Custom schema, effective grid export.
- **Evidence:** [grid-layout.html:246](</Users/user/Documents/Damco Agentic Design System/grid-layout.html:246>)

#### G02 P1

- **Section:** Grid & Layout
- **Current state:** Eleven raw breakpoint widths and proposed consolidation documented; Overview 800 versus shared shell 900.
- **Issue / Gap:** Canonical scale remains a follow-up; threshold ranges do not form coherent consumer contract.
- **Why it matters:** Describing drift does not resolve it.
- **Impact on UX / UI / Development:** UI: inconsistent transitions. Development: fragmented responsive rules.
- **Recommended improvement:** Adopt justified shared scale, migrate consumers, document content-driven exceptions and test boundaries.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Canonical values, exception/migration policy, boundary fixtures.
- **Evidence:** [grid-layout.html:219](</Users/user/Documents/Damco Agentic Design System/grid-layout.html:219>)

#### G03 P1

- **Section:** Grid & Layout
- **Current state:** Recommendation maps product only; New Project supports multiple platforms; Cross-Platform gives single 8-column recommendation.
- **Issue / Gap:** No platform/container/density precedence; Consumer App four columns regardless of desktop/native target.
- **Why it matters:** Products need responsive geometry by context.
- **Impact on UX / UI / Development:** UX: unsuitable defaults. UI: density/layout errors. Development: platform scope lost.
- **Recommended improvement:** Resolve product plus platform/container/density; emit per-platform profiles and conflicts transparently.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Mixed-platform/tablet/window examples, native mapping.
- **Evidence:** [grid-layout.js:152](</Users/user/Documents/Damco Agentic Design System/grid-layout.js:152>)

#### G04 P1

- **Section:** Grid & Layout
- **Current state:** Column/Row/Combined/Baseline/Custom options have brief diagrams.
- **Issue / Gap:** No max-width/margins/spans/alignment/row/baseline/nested rules; Baseline described as overlay but selected as replacement.
- **Why it matters:** Labels are insufficient geometry.
- **Impact on UX / UI / Development:** UI: inconsistent composition. Development: incompatible primitives.
- **Recommended improvement:** Define independent axes, container/span tokens and optional baseline overlay; add executable examples.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Grid API, nested/subgrid, baseline and container tables.
- **Evidence:** [grid-layout.html:322](</Users/user/Documents/Damco Agentic Design System/grid-layout.html:322>)

#### G05 P1

- **Section:** Grid & Layout
- **Current state:** Default instructs scrolling the overflowing region independently.
- **Issue / Gap:** Too broad for long forms, reflow, virtual keyboard, fixed actions/nested regions; truncation recovery incomplete.
- **Why it matters:** Unnecessary nested scrolling impedes tasks.
- **Impact on UX / UI / Development:** UX: hidden content/actions. Development: excessive scroll containers. AI: blanket behavior.
- **Recommended improvement:** Prefer reflow where appropriate; define justified regions with names/keyboard/affordances/retained actions.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Overflow tree, form/table/editor examples, reveal policy.
- **Evidence:** [grid-layout.html:451](</Users/user/Documents/Damco Agentic Design System/grid-layout.html:451>)

#### G06 P1

- **Section:** Grid & Layout
- **Current state:** Eight compositions illustrated; Master-Detail distinguished from navigation.
- **Issue / Gap:** No narrow transforms, source/focus order, selected record/back behavior or pane empty/error/loading specs.
- **Why it matters:** Diagrams do not define responsive journeys.
- **Impact on UX / UI / Development:** UX: lost place. UI: varying collapse. Development: reinvented behavior.
- **Recommended improvement:** Specify each pattern across widths/states, including reading/focus restoration.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Master-detail mobile flow, split collapse, pane matrix.
- **Evidence:** [grid-layout.html:445](</Users/user/Documents/Damco Agentic Design System/grid-layout.html:445>)

#### G07 P2

- **Section:** Grid & Layout
- **Current state:** Split View equally weighted; Dashboard/Hero illustrate content.
- **Issue / Gap:** Resizable/minimum panes, persisted widths, sticky/overlay collision and content priority unspecified.
- **Why it matters:** Real content rarely remains balanced.
- **Impact on UX / UI / Development:** UX: primary task cramped. Development: unclear layout ownership.
- **Recommended improvement:** Define pane bounds/collapse/resizing, sticky containment and overlay rules; link Splitter/Affix/Table.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Keyboard resize, layout constraints, nesting examples.
- **Evidence:** [grid-layout.html:427](</Users/user/Documents/Damco Agentic Design System/grid-layout.html:427>)

#### G08 P1

- **Section:** Grid & Layout
- **Current state:** Snapshot exports product/recommended columns/gutter/type, excludes static guidance.
- **Issue / Gap:** No breakpoints/pattern/overflow rules or executable Custom geometry travel.
- **Why it matters:** Snapshot must stand alone.
- **Impact on UX / UI / Development:** AI: arbitrary responsive behavior. Development: portal-dependent handoff.
- **Recommended improvement:** Export effective geometry, semantic tokens, patterns, boundaries and validation with normative guidance.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Complete layout export, rule completeness check.
- **Evidence:** [grid-layout.js:28](</Users/user/Documents/Damco Agentic Design System/grid-layout.js:28>)

## Typography

**Current User Flow:** Choose families/category or upload → choose preset → adjust level metrics/colors → auto-persist → Save/regenerate/reset → copy Markdown. Family previews work in-page; uploads are document-local assets and type levels are not a shared resolver.

**Current Task Flow:** Choose deliverable font faces → define semantic text roles → map metrics/colors → verify real responsive/localized content → persist/package assets → export styles and install rules.

### Review across all 14 dimensions

| Dimension | Assessment and finding references |
| --- | --- |
| User Flow | Editable families/levels exist; uploaded font durability missing (T01, T02). |
| Task Flow | Style entry exists; semantic resolution and asset delivery incomplete (T03, T07). |
| Information Architecture | Levels/state rows mix; Body/Paragraph and semantic heading rank unclear (T04). |
| Documentation completeness | Extra roles/H1 step-down exist; full responsive/international rules incomplete (T06–T09). |
| Component or token usage | Only families applied sitewide, no level-to-component mapping (T03). |
| States and edge cases | Auto/custom colors exist; async uploads/partial values/weights need states (T02, T05, T08). |
| Accessibility requirements | 50–300% line height permitted; actual text contrast/spacing unverified (T05, T07). |
| Responsive behavior | Fixed default H1 step-down is not a custom-scale resolver (T06). |
| Interaction guidelines | Whole-main persistence and async callbacks create inconsistent timing (T02, T10). |
| AI and Agent usability | Snapshot omits extra roles/assets/effective responsive styles (T01, T09). |
| Consistency across the design system | Editable scale and fixed extra metrics need shared ownership (T03, T04). |
| Missing examples or usage guidelines | Missing multilingual/long-content/font-failure examples (T07, T08). |
| Potential implementation gaps | FontFace active document only; stored metadata lacks file reference (T01, T02). |
| Designer and developer ambiguity | Family/preset/role/state precedence unclear (T03, T04, T06). |

### Detailed gap register

#### T01 P1

- **Section:** Typography
- **Current state:** Font file added to current document; saved family/source/link has no bytes/durable asset.
- **Issue / Gap:** Uploaded font cannot reproduce after navigation/reload or handoff; named family is insufficient.
- **Why it matters:** Font is a dependency, not metadata.
- **Impact on UX / UI / Development:** UX: apparent configuration disappears. UI: fallback changes metrics. Development: missing assets.
- **Recommended improvement:** Package durable authorized font reference/faces/install rules or visibly label preview-only.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Asset manifest, licensing/self-hosting, reload/packaging rules.
- **Evidence:** [typography.js:163](</Users/user/Documents/Damco Agentic Design System/typography.js:163>)

#### T02 P1

- **Section:** Typography
- **Current state:** Input event auto-saves before async FileReader/FontFace completion; callback changes family without update/persist event.
- **Issue / Gap:** Preview can show new font while Markdown/storage retain old one until next interaction; FileReader error unhandled.
- **Why it matters:** Async success needs an explicit commit.
- **Impact on UX / UI / Development:** UX: timing-dependent result. UI: unexpected fallback. Development: stale export.
- **Recommended improvement:** Commit/render on successful load; expose loading/retry/cancel/read/load errors, preserve prior valid font.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Upload state machine, async completion/failure tests.
- **Evidence:** [typography.js:164](</Users/user/Documents/Damco Agentic Design System/typography.js:164>)

#### T03 P1

- **Section:** Typography
- **Current state:** Levels store size/family/weight/line-height/italic/colors; shared applicator updates families only.
- **Issue / Gap:** No effective semantic typography/component resolver; application scope unclear.
- **Why it matters:** Editable decisions should map to buildable styles.
- **Impact on UX / UI / Development:** UX: effect uncertain. UI: components differ. Development: missing API.
- **Recommended improvement:** Resolve semantic tokens and bindings or explicitly state export-only settings; show effective previews.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Level-token-component map, CSS/native resolver, scope copy.
- **Evidence:** [shell.js:165](</Users/user/Documents/Damco Agentic Design System/shell.js:165>)

#### T04 P1

- **Section:** Typography
- **Current state:** H1–H6/Body/Paragraph/Caption mixed with Active/Selected/Disabled/status rows having all font controls.
- **Issue / Gap:** Interaction states treated as independent type levels; visual style confused with semantic hierarchy.
- **Why it matters:** State changes should not arbitrarily change metrics or markup rank.
- **Impact on UX / UI / Development:** UI: shifts. Accessibility: wrong heading structure. Development: overlapping API.
- **Recommended improvement:** Separate text roles and state color modifiers; define Body/Paragraph and visual versus HTML headings.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Role taxonomy, state modifier/precedence, semantic heading example.
- **Evidence:** [typography.html:1070](</Users/user/Documents/Damco Agentic Design System/typography.html:1070>)

#### T05 P1

- **Section:** Typography
- **Current state:** Line height clamped 50–300% on each keystroke; color text sanitizes partial edits while picker remains last valid.
- **Issue / Gap:** Very tight values allowed without guidance; clamping impedes entry; visible draft snapshot can differ from saved picker.
- **Why it matters:** Preserve editable drafts and readable committed values.
- **Impact on UX / UI / Development:** UX: awkward numeric edits. UI: clipped/overlapping text. Development: export inconsistency.
- **Recommended improvement:** Validate on blur/commit, preserve draft, recommend role bounds/exceptions and actual pair checks.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Invalid/empty/partial states, readability constraints, errors.
- **Evidence:** [typography.js:274](</Users/user/Documents/Damco Agentic Design System/typography.js:274>)

#### T06 P1

- **Section:** Typography
- **Current state:** Below 640 default title drops 30/38 to 24/32; presets customize row sizes.
- **Issue / Gap:** No arbitrary-scale/H2–H6/other-role adaptation or saved-platform mapping.
- **Why it matters:** Custom type needs responsive resolution.
- **Impact on UX / UI / Development:** UI: overflow/inconsistent sizing. Development: ad hoc media rules.
- **Recommended improvement:** Define explicit responsive role tokens or approved fluid ranges plus platform/minimum rules.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Per-role boundary table, custom scale, platform mapping.
- **Evidence:** [typography.html:285](</Users/user/Documents/Damco Agentic Design System/typography.html:285>)

#### T07 P1

- **Section:** Typography
- **Current state:** Extra roles include 11px muted labels/13px tables; no row-color pair checker; shared guide says text-spacing tests unverified.
- **Issue / Gap:** Actual readable roles/surfaces/scripts/spacing not demonstrated; muted defaults compute ~3.56:1 on white and ~3.21:1 on dark panel.
- **Why it matters:** Active informational text cannot inherit general disabled exceptions.
- **Impact on UX / UI / Development:** UX: difficult labels/data. UI: multilingual clipping. Development: false conformance assumptions.
- **Recommended improvement:** Verify actual text/surface roles; correct defaults or restrict uses; test expansion/scripts/text spacing.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Label/table examples, multilingual glyph metrics, spacing fixture.
- **Evidence:** [typography.html:1721](</Users/user/Documents/Damco Agentic Design System/typography.html:1721>)

#### T08 P2

- **Section:** Typography
- **Current state:** Curated fonts load remote CSS; weight/italic independent; uploaded family inferred from filename.
- **Issue / Gap:** Load failure/unsupported faces/synthesis/variable axes/fallback metrics and file bounds unspecified.
- **Why it matters:** Declared family may render differently by environment.
- **Impact on UX / UI / Development:** UI: layout shift/weight drift. Development: inconsistent delivery.
- **Recommended improvement:** Define valid faces, fallback/loading/hosting/axes; validate type/size and show unavailable-face states.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Loading/failure examples, weight coverage, hosting/fallback rules.
- **Evidence:** [typography.js:115](</Users/user/Documents/Damco Agentic Design System/typography.js:115>)

#### T09 P1

- **Section:** Typography
- **Current state:** Snapshot covers family/preset/rows, deliberately excludes Additional semantic levels; catalog also lacks them.
- **Issue / Gap:** Standard button/label/table/code/link/eyebrow roles and AI Rule do not travel; assets/responsive styles incomplete.
- **Why it matters:** Agents cannot follow omitted rules.
- **Impact on UX / UI / Development:** AI: invented sizes. UI: role drift. Development: incomplete dependency handoff.
- **Recommended improvement:** Export semantic roles, rules, responsive variants, units and font dependencies.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Complete standalone type contract, role/asset parity tests.
- **Evidence:** [typography.js:386](</Users/user/Documents/Damco Agentic Design System/typography.js:386>)

#### T10 P2

- **Section:** Typography
- **Current state:** All main clicks/input/change persist; preset reseeds multiple rows.
- **Issue / Gap:** Copy/view/category actions can write unchanged values; edited styles leave preset active; reseeding lacks visible diff/undo.
- **Why it matters:** Preset identity should describe actual configuration.
- **Impact on UX / UI / Development:** UX: hidden overrides. Development: unnecessary writes/sync.
- **Recommended improvement:** Persist real value changes only; mark modified presets Custom; review/undo multi-level changes.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Preset/custom states, diff/overwrite policy.
- **Evidence:** [typography.js:459](</Users/user/Documents/Damco Agentic Design System/typography.js:459>)

## Spacing

**Current User Flow:** Choose/inherit product → select 2px/4px/8px/Adaptive → auto-save names → read role/default guidance → copy Markdown. Selection does not remap spacing used by the portal.

**Current Task Flow:** Classify relationship → resolve semantic spacing for density/platform → compose → verify expansion/target geometry → export role tokens.

### Review across all 14 dimensions

| Dimension | Assessment and finding references |
| --- | --- |
| User Flow | Selection exists; inheritance coverage/effective behavior unclear (S01, S04). |
| Task Flow | Philosophy picked; exact relationship resolution remains manual (S02, S03). |
| Information Architecture | Product/platform/unit/density/relationship concepts overlap (S03, S04). |
| Documentation completeness | Global roles/defaults exist; routine compositions lack rules (S02, S05). |
| Component or token usage | Precision/Adaptive list values without matching shared space tokens (S01). |
| States and edge cases | Immediate reset; errors/long content/fallback context need policy (S04, S05). |
| Accessibility requirements | Density is not separated from interactive target/readability bounds (S06). |
| Responsive behavior | No semantic spacing variants for width/density/locale (S05, S07). |
| Interaction guidelines | Save duplicates auto-save; state content expansion unspecified (S05, X05). |
| AI and Agent usability | Conflicting allowed scales and omitted export rules (S02, S08). |
| Consistency across the design system | Fixed/global/selected scales and first-party CSS disagree (S02, S07). |
| Missing examples or usage guidelines | Missing form/list/toolbar/wrapped/error spacing examples (S05). |
| Potential implementation gaps | Saved string lacks role/density resolver (S01, S03). |
| Designer and developer ambiguity | Adaptive automatic context behavior is undefined (S03). |

### Detailed gap register

#### S01 P1

- **Section:** Spacing
- **Current state:** Stores product/system only; shared tokens Balanced; Precision/Adaptive mention 2/6 etc.
- **Issue / Gap:** No resolver/application for selected system; some advertised values lack named tokens.
- **Why it matters:** Philosophy label is not an implementable scale.
- **Impact on UX / UI / Development:** UI: settings/code mismatch. AI: arbitrary numbers. Development: incomplete tokens.
- **Recommended improvement:** Define primitive scale plus semantic role mapping per system; resolve/export, or mark advisory.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Per-system values/resolver, scope/native units.
- **Evidence:** [spacing.js:107](</Users/user/Documents/Damco Agentic Design System/spacing.js:107>)

#### S02 P1

- **Section:** Spacing
- **Current state:** AI mandates Micro/Component/Layout lists; selected 4px scale additionally permits 28/56/72/112; 8px differs from fixed micro rules.
- **Issue / Gap:** Competing allowed-value contracts; zero/auto/percent/negative/fluid exceptions unspecified.
- **Why it matters:** Absolute contradictory rules cannot be followed.
- **Impact on UX / UI / Development:** UI: whitespace drift. Development: impossible lint policy. AI: rejects legitimate values.
- **Recommended improvement:** Define primitive availability, role recommendations and exceptions with precedence.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Allowed-value contract, zero/auto/fluid examples, lint policy.
- **Evidence:** [spacing.html:344](</Users/user/Documents/Damco Agentic Design System/spacing.html:344>)

#### S03 P1

- **Section:** Spacing
- **Current state:** Adaptive promises automatic context; code saves label; Cross-Platform primary4/secondary2+8 selects4 despite comment claiming Adaptive.
- **Issue / Gap:** No exact micro/control/layout algorithm and inconsistent combined-unit mapping.
- **Why it matters:** Automatic behavior must be reproducible.
- **Impact on UX / UI / Development:** UX: expectation unmet. Development: varied implementations.
- **Recommended improvement:** Define role/density/platform resolver and correct Cross-Platform choice; display effective results.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Adaptive algorithm, combined-unit fixture, token matrix.
- **Evidence:** [spacing.html:291](</Users/user/Documents/Damco Agentic Design System/spacing.html:291>)

#### S04 P2

- **Section:** Spacing
- **Current state:** Consumer/AI mapped but cards absent; safely leaves no product selected; labels differ.
- **Issue / Gap:** Common setup types silently fall back; duplicated platform/product suggestions vary.
- **Why it matters:** Fallbacks should be understandable.
- **Impact on UX / UI / Development:** UX: setup ignored. UI: generic inappropriate density. Development: special cases.
- **Recommended improvement:** Canonical taxonomy, explained fallback, supported Consumer/AI defaults.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Fallback notice, names, override examples.
- **Evidence:** [spacing.js:136](</Users/user/Documents/Damco Agentic Design System/spacing.js:136>)

#### S05 P2

- **Section:** Spacing
- **Current state:** Button/Table/Modal/Drawer/Panel defaults and broad relationship lists exist.
- **Issue / Gap:** Exact label/helper/error/group/list/toolbar/empty/wrapped spacing incomplete; scrim versus content padding ambiguous.
- **Why it matters:** Allowed numbers do not define task anatomy.
- **Impact on UX / UI / Development:** UX: disconnected messages/actions. UI: drift. Development: invented relations.
- **Recommended improvement:** Define semantic relationship tokens and complete composition/state examples.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Forms/tables/cards/actions, error/long content, overlay distinction.
- **Evidence:** [spacing.html:354](</Users/user/Documents/Damco Agentic Design System/spacing.html:354>)

#### S06 P1

- **Section:** Spacing
- **Current state:** Dense enterprise recommendation uses small units; target guidance lives in shared accessibility.
- **Issue / Gap:** Visual density not separated from hit-area/separation/text constraints.
- **Why it matters:** Dense controls must stay usable.
- **Impact on UX / UI / Development:** UX: crowded/difficult targeting. UI: blanket compact scaling. Development: incorrect density conversion.
- **Recommended improvement:** Define independent interactive bounds/readability and compact/comfortable role maps.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Density-hit-area diagram, compact touch fixtures.
- **Evidence:** [spacing.html:258](</Users/user/Documents/Damco Agentic Design System/spacing.html:258>)

#### S07 P2

- **Section:** Spacing
- **Current state:** No interpolated spacing rule; New Project uses clamp(20px,3vw,32px); first-party literals persist.
- **Issue / Gap:** Implementation contradicts rule; responsive/logical/native spacing lacks explicit policy.
- **Why it matters:** Examples must teach intended behavior.
- **Impact on UX / UI / Development:** UI: inconsistent rhythm. Development: fluid exceptions unclear. AI: conflicting precedent.
- **Recommended improvement:** Audit literals; use semantic tokens; document approved fluid structural/logical/native rules.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Responsive/RTL/native examples, fluid exception, literal checks.
- **Evidence:** [experience.css:22](</Users/user/Documents/Damco Agentic Design System/experience.css:22>)

#### S08 P1

- **Section:** Spacing
- **Current state:** Snapshot contains product/selected scale string; excludes roles/defaults/AI Rule.
- **Issue / Gap:** Numbers travel without relationship constraints.
- **Why it matters:** Standalone handoff needs purpose.
- **Impact on UX / UI / Development:** AI: arbitrary allowed choices. Development: no reusable contract.
- **Recommended improvement:** Export typed scale, semantic relations, density/platform variants and precedence/rules.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Complete handoff, units, role/component map.
- **Evidence:** [spacing.js:21](</Users/user/Documents/Damco Agentic Design System/spacing.js:21>)

## Radius

**Current User Flow:** Choose/inherit product → choose philosophy → auto-save/remap global radius slots → read fixed component defaults → copy Markdown. Fixed documentation does not update with actual remapping.

**Current Task Flow:** Resolve role/shape intent → choose compatible family → calculate effective mappings → nested/edge-attached exceptions → preview real components → export.

### Review across all 14 dimensions

| Dimension | Assessment and finding references |
| --- | --- |
| User Flow | Immediate appearance update contradicts static defaults (R01). |
| Task Flow | Shape choice possible; effective/nested role values unresolved (R01, R04). |
| Information Architecture | Product/philosophy/role precedence unclear (R01, R03). |
| Documentation completeness | Component/nested guidance exists with scale ambiguity (R03, R04). |
| Component or token usage | Numeric-suffix primitives change values with philosophy (R02). |
| States and edge cases | Edge/nested/circle/reset exceptions need explicit invariants (R04, R05, R08). |
| Accessibility requirements | Focus clipping and hit-area independence need shape guidance (R06). |
| Responsive behavior | Mobile/edge-attached rules scattered across pages (R05). |
| Interaction guidelines | State geometry invariants not specified (R06). |
| AI and Agent usability | AI mandates fixed defaults despite remapping; snapshot omits mapping (R01, R07). |
| Consistency across the design system | Literal setup corners and duplicate resolver cause drift (R02). |
| Missing examples or usage guidelines | Missing per-philosophy/nested/edge comparison examples (R03–R05). |
| Potential implementation gaps | Saved metadata has no runtime slot table (R07). |
| Designer and developer ambiguity | Ranges/philosophy/absolute defaults conflict (R01, R03). |

### Detailed gap register

#### R01 P1

- **Section:** Radius
- **Current state:** Control slot Balanced8/Sharp4/Compact6/Soft12/Expressive16; page still says Button/Input8/Card12.
- **Issue / Gap:** AI mandates fixed defaults while chosen philosophy changes actual tokens.
- **Why it matters:** Compliant implementations can disagree.
- **Impact on UX / UI / Development:** UX: guide differs from choice. UI: shape drift. Development: no authority.
- **Recommended improvement:** Generate active component defaults from philosophy; distinguish base versus effective mapping.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Per-philosophy role matrix, precedence, comparison.
- **Evidence:** [shell.js:135](</Users/user/Documents/Damco Agentic Design System/shell.js:135>)

#### R02 P1

- **Section:** Radius
- **Current state:** Numeric --radius-2/6/12/16/24 values remapped; literal consumers unchanged; boot/shell duplicate table.
- **Issue / Gap:** Numeric names stop meaning numbers; incomplete adoption and duplicate mappings drift.
- **Why it matters:** Primitive values or semantic purposes must be stable.
- **Impact on UX / UI / Development:** UI: uneven shape. Development: broken assumptions. AI: suffix misread.
- **Recommended improvement:** Keep primitives immutable; remap semantic control/card/overlay aliases from one source; audit consumers.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Naming/migration, public/consumer inventory, resolver.
- **Evidence:** [shell.js:142](</Users/user/Documents/Damco Agentic Design System/shell.js:142>)

#### R03 P2

- **Section:** Radius
- **Current state:** Sharp0–4 includes6/8; Balanced4–16 includes24/Full; roles allow values absent from some scales.
- **Issue / Gap:** Core headline range versus available scale versus role exceptions undefined.
- **Why it matters:** Designers cannot infer prohibition/preference.
- **Impact on UX / UI / Development:** UI: inconsistent emphasis. Development: invalid bounds inference.
- **Recommended improvement:** Define core versus full scale and exact allowed/default role intersections.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Terminology, per-role permissions, rationale/examples.
- **Evidence:** [radius.html:255](</Users/user/Documents/Damco Agentic Design System/radius.html:255>)

#### R04 P2

- **Section:** Radius
- **Current state:** Formula max(0,outer−padding) alongside independent Button-in-Card exemption.
- **Issue / Gap:** Contour-following versus independent child implied; borders/asymmetric insets/radii omitted.
- **Why it matters:** Formula can accidentally square all children.
- **Impact on UX / UI / Development:** UI: incorrect nested geometry. Development: flawed derivation.
- **Recommended improvement:** Scope formula to contour surfaces, account for borders/insets, illustrate independent controls.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Nested geometry, flush/asymmetric/zero-gap examples.
- **Evidence:** [radius.html:469](</Users/user/Documents/Damco Agentic Design System/radius.html:469>)

#### R05 P2

- **Section:** Radius
- **Current state:** Roles round overlays; Shadows says viewport-touching edge unrounded; equal-size circle rule exists.
- **Issue / Gap:** No consolidated attached/full-screen/pill/circle/responsive rules.
- **Why it matters:** Attachment influences shape.
- **Impact on UX / UI / Development:** UX: detached-looking sheets. UI: inconsistent corners. Development: bespoke exceptions.
- **Recommended improvement:** Define floating/attached/full-screen/pill/circle semantic variants with per-edge rules.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Mobile sheet/drawer diagrams, circle constraints.
- **Evidence:** [radius.html:379](</Users/user/Documents/Damco Agentic Design System/radius.html:379>)

#### R06 P2

- **Section:** Radius
- **Current state:** Interactive roles listed; shared CSS handles focus.
- **Issue / Gap:** No radius invariance across focus/error/selected or overflow-focus clipping guidance.
- **Why it matters:** Rounded containers can obscure indicators.
- **Impact on UX / UI / Development:** UX: invisible focus. UI: movement/clipped content. Development: inconsistent behavior.
- **Recommended improvement:** Keep ordinary state geometry stable; define outlines/overflow/hit areas and intentional transitions.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** State matrix, clipped-focus counterexample.
- **Evidence:** [radius.html:367](</Users/user/Documents/Damco Agentic Design System/radius.html:367>)

#### R07 P1

- **Section:** Radius
- **Current state:** Snapshot contains philosophy/recommendation/scale; omits defaults/nested/global/AI guidance.
- **Issue / Gap:** Actual remapping and required role constraints absent.
- **Why it matters:** Handoff cannot reproduce active system.
- **Impact on UX / UI / Development:** AI: invents radii. Development: duplicates private tables.
- **Recommended improvement:** Export effective semantic map, primitives and attached/nested rules with provenance.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Complete snapshot, role/rule parity.
- **Evidence:** [radius.js:22](</Users/user/Documents/Damco Agentic Design System/radius.js:22>)

#### R08 P2

- **Section:** Radius
- **Current state:** Reset removes record and selects Balanced; later load with no record inherits product recommendation.
- **Issue / Gap:** Reset can show Balanced then different philosophy on reload.
- **Why it matters:** Reset target must be stable.
- **Impact on UX / UI / Development:** UX: reset seems undone. UI: unexpected shape. Development: hidden default precedence.
- **Recommended improvement:** Separate project recommendation from global default or choose durable reset policy; show inheritance.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Reset/reload fixtures, provenance.
- **Evidence:** [radius.js:161](</Users/user/Documents/Damco Agentic Design System/radius.js:161>)

## Borders

**Current User Flow:** Choose preset → configure width/colors/opacity/style/sides → preview boxes/controls/dividers → auto-save → edit state colors → save/regenerate/reset → copy. State widths/opacities/styles are described editable but are static attributes.

**Current Task Flow:** Choose boundary role → resolve base composite → combine states without movement → verify contrast/focus → export aliased composites and behavior.

### Review across all 14 dimensions

| Dimension | Assessment and finding references |
| --- | --- |
| User Flow | General controls exist; advertised state-property editing absent (B01). |
| Task Flow | Preview works; combined states/no-shift rules incomplete (B02–B04). |
| Information Architecture | Preset/current/base-state sources have unclear precedence (B05). |
| Documentation completeness | Signal guidance exists; operational state/variant contract incomplete (B02, B03, B06). |
| Component or token usage | Real widths exceed scale; state hex breaks semantic dependencies (B06, B07). |
| States and edge cases | Isolated states only; read-only/required/combinations undefined (B03). |
| Accessibility requirements | Focus named accessible without composited validation (B04). |
| Responsive behavior | Editor responsive; logical edges/hairlines/native policy incomplete (B08). |
| Interaction guidelines | Width shift prevention not demonstrated (B02). |
| AI and Agent usability | Export omits non-color rules/composites/precedence (B09). |
| Consistency across the design system | Standard85%, Default70%, Card1.5 lack complete derivation (B05, B06). |
| Missing examples or usage guidelines | Missing focus+error/high-contrast/RTL examples (B03, B04, B08). |
| Potential implementation gaps | State values static and only colors persisted (B01). |
| Designer and developer ambiguity | Stored literal statuses can detach from color family choices (B07). |

### Detailed gap register

#### B01 P1

- **Section:** Borders
- **Current state:** Copy promises independent width/color/opacity/style; rows fixed data attributes; payload colors/darkAuto only.
- **Issue / Gap:** Promised per-state configuration unavailable.
- **Why it matters:** Designer cannot finish described task.
- **Impact on UX / UI / Development:** UX: missing controls. Development: static values masquerade configurable.
- **Recommended improvement:** Implement validated state properties or label them fixed and narrow claim.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Editable/fixed schema, validation/export.
- **Evidence:** [borders.html:419](</Users/user/Documents/Damco Agentic Design System/borders.html:419>)

#### B02 P1

- **Section:** Borders
- **Current state:** Default1px versus selected/focus/active2px; says reserve at Default width.
- **Issue / Gap:** No strategy accommodates thicker border without shifting; preview changes real width.
- **Why it matters:** Stable interaction needs geometry policy.
- **Impact on UX / UI / Development:** UX: moving controls/text. UI: shifts. Development: inconsistent sizing.
- **Recommended improvement:** Reserve maximum transparent border or use outline/inset; show no-shift implementations.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Box-model/state geometry diagram and example.
- **Evidence:** [borders.html:520](</Users/user/Documents/Damco Agentic Design System/borders.html:520>)

#### B03 P1

- **Section:** Borders
- **Current state:** Ten isolated states documented.
- **Issue / Gap:** Focus+error, selected+hover, loading+disabled and success+focus precedence missing; read-only/required absent.
- **Why it matters:** Real states coexist.
- **Impact on UX / UI / Development:** UX: lost focus/error. UI: arbitrary combinations. Development: selector order accidental.
- **Recommended improvement:** Define orthogonal layers/precedence and keep focus/messages visible; separate read-only.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Combination/selector matrix, loading/required examples.
- **Evidence:** [borders.html:412](</Users/user/Documents/Damco Agentic Design System/borders.html:412>)

#### B04 P1

- **Section:** Borders
- **Current state:** Focus preset called accessible; opacity/color editable without actual pair validation.
- **Issue / Gap:** Guarantee unsupported for custom surfaces/transparency; no forced-color recipe.
- **Why it matters:** Essential boundaries/focus need real-context evidence.
- **Impact on UX / UI / Development:** UX: lost orientation. UI: invisible edges. Development: assumed conformance.
- **Recommended improvement:** Validate composited adjacent pairs/focus; document forced colors and unobscured focus.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Contrast checker/examples, high-contrast verification.
- **Evidence:** [borders.html:237](</Users/user/Documents/Damco Agentic Design System/borders.html:237>)

#### B05 P2

- **Section:** Borders
- **Current state:** Preset remains active after edits; export includes seeds and current values; Standard85 versus Default70.
- **Issue / Gap:** Seed identity and effective border/state precedence unclear.
- **Why it matters:** Recipient must know applied result.
- **Impact on UX / UI / Development:** UX: preset misleading. UI: inconsistent resting border. Development: competing defaults.
- **Recommended improvement:** Mark Custom/Based on; export one effective composite and define Default inheritance.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Preset provenance, base derivation, export example.
- **Evidence:** [borders.js:154](</Users/user/Documents/Damco Agentic Design System/borders.js:154>)

#### B06 P2

- **Section:** Borders
- **Current state:** Picker0/1/2/3/4; CSS comments acknowledge1.5/2.5/5; Card1.5 disclosed.
- **Issue / Gap:** Scale/consumer width drift lacks governed exceptions.
- **Why it matters:** Token policy needs complete coverage.
- **Impact on UX / UI / Development:** UI: uneven optical weight. Development: lint contradictions.
- **Recommended improvement:** Audit widths; preserve justified semantic optical exceptions and migrate drift.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Width inventory, rationale, native hairline policy.
- **Evidence:** [theme.css:21](</Users/user/Documents/Damco Agentic Design System/theme.css:21>)

#### B07 P1

- **Section:** Borders
- **Current state:** State and Brand/Focus preset colors persist literal hex separately from Colors.
- **Issue / Gap:** Brand/status changes do not retarget stored borders; no linked/overridden provenance.
- **Why it matters:** Semantic identity should remain coherent.
- **Impact on UX / UI / Development:** UI: stale focus/error. UX: weak meaning. Development: manual sync.
- **Recommended improvement:** Default to semantic aliases; allow explicit detached override; resolve by theme.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Alias/override UI/schema, dependency tests.
- **Evidence:** [borders.js:455](</Users/user/Documents/Damco Agentic Design System/borders.js:455>)

#### B08 P2

- **Section:** Borders
- **Current state:** Physical top/right/bottom/left used; dividers deliberately ignore sides.
- **Issue / Gap:** Logical start/end unavailable; native density/print/forced-color translations absent.
- **Why it matters:** Boundary intent should survive direction/platform.
- **Impact on UX / UI / Development:** UI: wrong RTL emphasis. Development: manual rewrites.
- **Recommended improvement:** Offer/document inline/block sides and physical exceptions; map native/print; explain dividers.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** RTL/native/forced-color examples.
- **Evidence:** [borders.js:90](</Users/user/Documents/Damco Agentic Design System/borders.js:90>)

#### B09 P1

- **Section:** Borders
- **Current state:** Snapshot has preset/config/state values, excludes Component guidance and non-color AI Rule.
- **Issue / Gap:** No component exceptions/signal/precedence application contract.
- **Why it matters:** Agents need behavior as well as data.
- **Impact on UX / UI / Development:** AI: color-only states. UI: wrong defaults. Development: incomplete composites.
- **Recommended improvement:** Export typed aliased composites plus precedence/geometry/accessibility rules.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Complete handoff, CSS/native examples, rule parity.
- **Evidence:** [borders.js:154](</Users/user/Documents/Damco Agentic Design System/borders.js:154>)

## Shadows

**Current User Flow:** Choose philosophy → auto-save name → inspect fixed hierarchy/defaults → Save/Reset. No local Markdown section; selected philosophy does not generate different recipes.

**Current Task Flow:** Resolve semantic layer → choose effective elevation → combine surface/border/backdrop → manage stacking/clipping → verify themes/states → export.

### Review across all 14 dimensions

| Dimension | Assessment and finding references |
| --- | --- |
| User Flow | Selection exists; copy refers to absent product picker (H01). |
| Task Flow | Recipe resolution/application missing (H01, H02). |
| Information Architecture | Philosophy/hierarchy/defaults clear but layer order absent (H04). |
| Documentation completeness | Meanings exist; recipes/themes/containment incomplete (H02–H04). |
| Component or token usage | One fixed scale and no philosophy resolver (H01). |
| States and edge cases | Hover/pressed/sticky exist; variants/clipping exceptions incomplete (H04, H05). |
| Accessibility requirements | Shadow-alone warning exists; high-contrast fallback needs examples (H03, H06). |
| Responsive behavior | Drawer/sheet levels differ without responsive mapping (H04, H06). |
| Interaction guidelines | Interactive/noninteractive elevation conflated (H05). |
| AI and Agent usability | No local snapshot; name-only records insufficient (H07). |
| Consistency across the design system | Card default contradicts Borders and variant selectors (H05). |
| Missing examples or usage guidelines | Missing theme/nested-overlay/sticky/clipping recipes (H02–H04). |
| Potential implementation gaps | Soft/Expressive have no effective blur/opacity distinction (H01). |
| Designer and developer ambiguity | Flat allowable levels conflict with hierarchy overlay defaults (H01, H02). |

### Detailed gap register

#### H01 P1

- **Section:** Shadows
- **Current state:** Stores philosophy name; fixed shared shadow scale; Flat None/XS but overlays require MD–2XL.
- **Issue / Gap:** Selection does not resolve recipes/components; hierarchy conflicts; copy references absent product picker.
- **Why it matters:** Users need actual consequence of choice.
- **Impact on UX / UI / Development:** UX: ineffective setting. UI: inconsistent depth. Development: unbuildable philosophy.
- **Recommended improvement:** Resolve per-philosophy layers/minimum separation or mark guidance-only; correct context copy.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Effective map, allowable/fallback levels, product rules.
- **Evidence:** [shadows.js:33](</Users/user/Documents/Damco Agentic Design System/shadows.js:33>)

#### H02 P1

- **Section:** Shadows
- **Current state:** Semantic levels shown; numeric recipes only in CSS.
- **Issue / Gap:** Page/machine data lacks full offset/blur/spread/color/opacity and bindings; Soft/Expressive promise distinction without recipes.
- **Why it matters:** Names insufficient for portability.
- **Impact on UX / UI / Development:** UI: varied tool output. Development: duplicate formulas. AI: invented shadows.
- **Recommended improvement:** Expose typed primitive/semantic recipes, layering/inset policy and philosophy mappings.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Recipe table, design/native examples.
- **Evidence:** [shadows.html:240](</Users/user/Documents/Damco Agentic Design System/shadows.html:240>)

#### H03 P1

- **Section:** Shadows
- **Current state:** Black shadows6–16%; guidance also calls for surface/backdrop contrast.
- **Issue / Gap:** No theme/custom-dark visibility verification or forced-color/print policy.
- **Why it matters:** Depth can disappear under different surfaces/modes.
- **Impact on UX / UI / Development:** UX: merged overlays. UI: unreadable elevation. Development: unsupported modes.
- **Recommended improvement:** Define theme-aware surface/border/backdrop alternatives and validate actual adjacency.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Light/dark/custom/forced-color/print comparisons.
- **Evidence:** [theme.css:158](</Users/user/Documents/Damco Agentic Design System/theme.css:158>)

#### H04 P1

- **Section:** Shadows
- **Current state:** Dropdown/drawer/modal/major overlay hierarchy exists.
- **Issue / Gap:** No stacking/z-index/portal/clipping/nesting/backdrop/focus ownership contract; shadow magnitude not order.
- **Why it matters:** Depth also requires correct containment/hit testing.
- **Impact on UX / UI / Development:** UX: hidden/intercepting overlay. Development: z-index escalation.
- **Recommended improvement:** Define layer scale/overlay manager, nested/portal/clipping rules and responsive behavior.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Layer map, nested overlays, clipping/focus examples.
- **Evidence:** [shadows.html:281](</Users/user/Documents/Damco Agentic Design System/shadows.html:281>)

#### H05 P2

- **Section:** Shadows
- **Current state:** Shadows standardCardSM; Borders no default shadow; rest CSS only shadow variant but hover applies all panels.
- **Issue / Gap:** Card variants/defaults conflict; inert cards can gain interactive elevation cues.
- **Why it matters:** Affordance should match action.
- **Impact on UX / UI / Development:** UX: inert cards seem clickable. UI: inconsistent depth. Development: wrong selectors.
- **Recommended improvement:** Define static bordered/elevated/interactive variants and synchronized state defaults.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Card variant/state table, keyboard/touch equivalence.
- **Evidence:** [shadows.html:317](</Users/user/Documents/Damco Agentic Design System/shadows.html:317>)

#### H06 P2

- **Section:** Shadows
- **Current state:** Correct shadow-alone prohibition; button/sticky recommendations.
- **Issue / Gap:** No concrete keyboard/touch/reduced-motion state recipes/performance guidance.
- **Why it matters:** Principle needs operational examples.
- **Impact on UX / UI / Development:** UX: divergent feedback. Development: costly/variable animation.
- **Recommended improvement:** Show focus/selected/pressed with second signals, restrained transitions and touch equivalents.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** State/reduced-motion/touch/performance examples.
- **Evidence:** [shadows.html:168](</Users/user/Documents/Damco Agentic Design System/shadows.html:168>)

#### H07 P1

- **Section:** Shadows
- **Current state:** Machine Views/global checkbox exist; no local snapshot; record is philosophy only.
- **Issue / Gap:** Handoff lacks resolved recipes and normative/layer rules.
- **Why it matters:** Recipients cannot reproduce selected system.
- **Impact on UX / UI / Development:** UX: inconsistent export. AI: generic shadows. Development: incomplete artifact.
- **Recommended improvement:** Use complete shared export with effective recipes/modes/semantic/layer guidance.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Standalone snapshot, local/global parity.
- **Evidence:** [shadows.html:372](</Users/user/Documents/Damco Agentic Design System/shadows.html:372>)

## Icons

**Current User Flow:** Choose style → size/stroke/corner → sample preview → library choice or SVG/PNG references → auto-save configuration → Save/Reset → copy. Uploads only remain in current DOM; references export filenames.

**Current Task Flow:** Choose semantic symbol/source → normalize geometry/style → define function/decorative semantics → verify actual sizes/states → package assets → export implementation/generation rules.

### Review across all 14 dimensions

| Dimension | Assessment and finding references |
| --- | --- |
| User Flow | Preview exists; uploads temporary and lack keyboard/removal path (I01–I03). |
| Task Flow | Visual tuning works; named symbols/packaging/integration missing (I05, I09). |
| Information Architecture | UI icons/hero illustration styles mixed in global selector (I04). |
| Documentation completeness | Styles/states exist; semantic/source rules incomplete (I05, I06, I09). |
| Component or token usage | Settings do not retarget component SVGs or load selected library (I05). |
| States and edge cases | Types/limits/errors/duplicates/reset/compatibility unspecified (I01, I03, I04). |
| Accessibility requirements | Functional/decorative semantics and upload focus path absent (I02, I06). |
| Responsive behavior | Glyph/hit-area confusion and unexported RTL/motion policy (I07, I08). |
| Interaction guidelines | Container state inheritance good; exceptions/examples incomplete (I06, I08). |
| AI and Agent usability | Matching generation promised without constraints; names supply no visual reference (I09, I10). |
| Consistency across the design system | Current SVGs differ; snapshot omits state inheritance (I05, I10). |
| Missing examples or usage guidelines | Missing accessible icon button/RTL/action/assets examples (I06–I08). |
| Potential implementation gaps | Unbounded FileReader path without per-file errors; no durable manifest (I01, I03). |
| Designer and developer ambiguity | Library/style/stroke/global illustration compatibility unclear (I04, I09). |

### Detailed gap register

#### I01 P1

- **Section:** Icons
- **Current state:** Settings persist; thumbnails/dataURLs only DOM; export filenames; Reset leaves thumbnails.
- **Issue / Gap:** References lost on navigation/reload; no per-file remove/replace; reset incomplete.
- **Why it matters:** Reusable style references require actual assets.
- **Impact on UX / UI / Development:** UX: lost work. AI: filename not reference. Development: absent dependency.
- **Recommended improvement:** Persist/package authorized manifest/files; expose durability; remove/replace/clear with scoped reset.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Asset lifecycle, packaging, file actions, reload/reset.
- **Evidence:** [icons.js:149](</Users/user/Documents/Damco Agentic Design System/icons.js:149>)

#### I02 P1

- **Section:** Icons
- **Current state:** Hidden file input inside nonfocusable label; click handler opens; Typography same pattern.
- **Issue / Gap:** No visible keyboard focus target to open chooser.
- **Why it matters:** Supported upload task needs keyboard equivalence.
- **Impact on UX / UI / Development:** UX: users cannot upload. Development: inaccessible shared pattern.
- **Recommended improvement:** Real labelled Choose files button/input; optional drag/drop; announce outcomes/focus restoration.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Keyboard/upload/status examples.
- **Evidence:** [icons.html:374](</Users/user/Documents/Damco Agentic Design System/icons.html:374>)

#### I03 P1

- **Section:** Icons
- **Current state:** Every dropped file read as dataURL/image; picker accept suggests SVG/PNG.
- **Issue / Gap:** No actual type/size/count/decode/read-error/duplicate limits; SVG normalization undefined. Image embedding alone is not proof of script execution.
- **Why it matters:** Unsupported assets need bounded recovery.
- **Impact on UX / UI / Development:** UX: broken previews/false count. Development: resource load and unsafe future inline assumptions.
- **Recommended improvement:** Validate files/decode, report per-file failures, deduplicate and normalize approved SVG before inline reuse.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Bounds/errors/retries, SVG viewBox/currentColor/packaging policy.
- **Evidence:** [icons.js:238](</Users/user/Documents/Damco Agentic Design System/icons.js:238>)

#### I04 P2

- **Section:** Icons
- **Current state:** Line/Dashed/Flat/Duotone/Two-tone/Isometric/3D share selector; irrelevant stroke/corner controls remain.
- **Issue / Gap:** Functional UI and illustrations conflated; unsupported controls/library combinations not signposted.
- **Why it matters:** Dense UI symbols and hero assets have different requirements.
- **Impact on UX / UI / Development:** UX: inert controls. UI: wrong visual purpose. Development: incompatible settings.
- **Recommended improvement:** Separate UI/illustration profiles; disable irrelevant controls and validate compatible libraries.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Usage/compatibility matrix, disabled states.
- **Evidence:** [icons.html:172](</Users/user/Documents/Damco Agentic Design System/icons.html:172>)

#### I05 P1

- **Section:** Icons
- **Current state:** Four generic shapes preview; library choice stores name; components not updated.
- **Issue / Gap:** No canonical named catalog/action mapping/normalization/resolver/import implementation.
- **Why it matters:** Sample style not operational icon system.
- **Impact on UX / UI / Development:** UX: integration overpromise. UI: varied strokes. Development: absent API.
- **Recommended improvement:** Approved named set/source and normalized geometry; resolver/import guidance; label references versus integrations.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Catalog/action map, code/asset API, component examples.
- **Evidence:** [icons.js:115](</Users/user/Documents/Damco Agentic Design System/icons.js:115>)

#### I06 P1

- **Section:** Icons
- **Current state:** Good currentColor/container focus inheritance; shell labels title-bearing buttons.
- **Issue / Gap:** No complete decorative SVG/meaningful symbol/control/status/loading semantics examples.
- **Why it matters:** State inheritance does not create accessible naming.
- **Impact on UX / UI / Development:** UX: unnamed/duplicate announcements. Development: title-only misuse.
- **Recommended improvement:** Document hidden decoration, named functional controls, textual status/loading and native equivalents.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Accessible button/decorative/status examples.
- **Evidence:** [icons.html:309](</Users/user/Documents/Damco Agentic Design System/icons.html:309>)

#### I07 P1

- **Section:** Icons
- **Current state:** 16/20/24/32 glyph choices; 32 described touch target; gap8.
- **Issue / Gap:** Glyph versus hit area conflated; optical bounds/stroke scaling/clipping undefined.
- **Why it matters:** Drawing size does not guarantee target size.
- **Impact on UX / UI / Development:** UX: hard targeting. UI: misalignment/heavy strokes. Development: inconsistent scale.
- **Recommended improvement:** Separate glyph/grid/hit tokens; actual-size optical/stroke normalization.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Hit-area diagram, 16px samples, alignment policy.
- **Evidence:** [icons.html:270](</Users/user/Documents/Damco Agentic Design System/icons.html:270>)

#### I08 P2

- **Section:** Icons
- **Current state:** State motion tokens mentioned; shell mirrors particular directional SVGs.
- **Issue / Gap:** Icon guide does not specify which mirror/invariant, localized meaning or reduced-motion alternatives.
- **Why it matters:** Direction/motion carry meaning.
- **Impact on UX / UI / Development:** UX: reversed cues/unclear wait. Development: blanket transformations.
- **Recommended improvement:** Publish symbol-specific direction/motion rules, distinguish trends/navigation/physical symbols.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** RTL inventory, invariant examples, reduced-motion/loading policy.
- **Evidence:** [icons.html:350](</Users/user/Documents/Damco Agentic Design System/icons.html:350>)

#### I09 P2

- **Section:** Icons
- **Current state:** Promises teaching generators from selected style/references/library.
- **Issue / Gap:** No bounded agent prompt/schema, accepted SVGs/rejection criteria, provenance or verified license/version manifest.
- **Why it matters:** Generation and reuse need more than adjectives.
- **Impact on UX / UI / Development:** AI: inconsistent assets. Design: weak review. Development: uncertain source/version obligations.
- **Recommended improvement:** Provide geometric/currentColor/name/semantic constraints, human review and approved source manifest.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Generation instructions, accepted/rejected SVGs, provenance/licensing.
- **Evidence:** [icons.html:168](</Users/user/Documents/Damco Agentic Design System/icons.html:168>)

#### I10 P1

- **Section:** Icons
- **Current state:** Snapshot style/config/library/file names; excludes Icon states; store settings only.
- **Issue / Gap:** No assets/state/accessibility/direction/generation contract.
- **Why it matters:** Handoff cannot reproduce actual icon usage.
- **Impact on UX / UI / Development:** AI: guesses symbols. UI: drift. Development: absent package.
- **Recommended improvement:** Export asset package/references plus normative state/semantics/direction/generation rules.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Complete handoff, asset availability and rule parity.
- **Evidence:** [icons.js:72](</Users/user/Documents/Damco Agentic Design System/icons.js:72>)

## AI & Agents

**Current User Flow:** Read accents/attribution/confidence/stream placeholders → Approve/Reject sample rename → result text → Undo restores actions → Why disclosure. Demo changes local UI only; no rename or backend execution.

**Current Task Flow:** Review verified evidence/scope/diff → assess uncertainty/policy → approve/decline → execute/progress/cancel → inspect outcome/history → undo or compensate when supported.

### Review across all 14 dimensions

| Dimension | Assessment and finding references |
| --- | --- |
| User Flow | Approve/decline/undo illustrated, real execution/recovery absent (A02, A03). |
| Task Flow | Scoped diff/state machine/verifiable result incomplete (A01–A03). |
| Information Architecture | Topics separated; capabilities/autonomy not classified (A06, A08). |
| Documentation completeness | Permissions/recovery/tool/data limits missing (A03, A06, A08). |
| Component or token usage | AI aliases exist CSS but omitted token/catalog exports (A09, X03). |
| States and edge cases | Decline shown failure; async/undo/error/focus states missing (A02, A07). |
| Accessibility requirements | Text+color confidence exists; result/stream announcements absent (A05, A07). |
| Responsive behavior | Demos wrap; long stream/diff/citations/narrow approvals unspecified (A05, A08). |
| Interaction guidelines | Scope/preview/reject/cancel/undo boundaries need contract (A03, A06). |
| AI and Agent usability | No complete consumer schema/evidence hierarchy/behavior spec (A08, A10). |
| Consistency across the design system | Rename contradicts real naming; certainty conflated with outcome (A01, A04). |
| Missing examples or usage guidelines | Missing live/partial-failure/stale/no-evidence/compensation examples (A03, A04, A06). |
| Potential implementation gaps | UI approval claims application without mutation (A02). |
| Designer and developer ambiguity | Simulated evidence/certainty appear authoritative (A01, A04, A10). |

### Detailed gap register

#### A01 P1

- **Section:** AI & Agents
- **Current state:** Example claims button--primary/card--elevated verified convention; cites component file and shell.css2241; actual CSS uses btn-* and cited area spinner.
- **Issue / Gap:** Rename rationale/source claim factually unsupported; citations plain text.
- **Why it matters:** Explainability must support recommendation.
- **Impact on UX / UI / Development:** UX: false trust. Development: rename breaks bindings. AI: fabricated evidence precedent.
- **Recommended improvement:** Use verified real example or explicitly fictional simulation; link exact evidence and affected diff.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Naming source, citation validity, unsupported-evidence state.
- **Evidence:** [ai-foundation.html:240](</Users/user/Documents/Damco Agentic Design System/ai-foundation.html:240>)

#### A02 P1

- **Section:** AI & Agents
- **Current state:** Approve only hides actions/changes text; reject failure styling; Undo restores controls.
- **Issue / Gap:** Claims applied without mutation; decline conflated with failure; undo no actual recorded operation.
- **Why it matters:** Feedback must truthfully describe effects.
- **Impact on UX / UI / Development:** UX: misleading outcome. UI: rejection looks error. Development: demo mistaken live.
- **Recommended improvement:** Label simulation; separate decision/execution; neutral decline; define operation and undo scope.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Live/demo labels, outcome taxonomy, undo duration/scope.
- **Evidence:** [ai-foundation.js:24](</Users/user/Documents/Damco Agentic Design System/ai-foundation.js:24>)

#### A03 P1

- **Section:** AI & Agents
- **Current state:** Only pending→approved/rejected→undo.
- **Issue / Gap:** No validation/queue/running/partial/success/failure/cancel/expired/undo-failed lifecycle; retry/idempotency/stale handling missing.
- **Why it matters:** Agents perform asynchronous fallible tasks.
- **Impact on UX / UI / Development:** UX: no recovery/progress. Development: duplicate/partial operations.
- **Recommended improvement:** Define lifecycle/transitions/actions/progress/retry/cancel/compensation, distinguish local/external effects.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** State diagram, retry matrix, partial/stale examples.
- **Evidence:** [ai-foundation.html:216](</Users/user/Documents/Damco Agentic Design System/ai-foundation.html:216>)

#### A04 P1

- **Section:** AI & Agents
- **Current state:** High/medium/low color+text; aliases existing success/warning/danger and claims same meaning.
- **Issue / Gap:** No threshold/evidence/calibration/unknown state; confidence not equivalent to execution outcome.
- **Why it matters:** Uncertainty should not imply correctness.
- **Impact on UX / UI / Development:** UX: overtrust/alarm. UI: conflation. Development: tier not computable.
- **Recommended improvement:** Define domain evidence/tiering and unknown; avoid fabricated certainty; separate outcome semantics.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Confidence definitions, calibrated/evidence example, insufficient evidence.
- **Evidence:** [ai-foundation.html:180](</Users/user/Documents/Damco Agentic Design System/ai-foundation.html:180>)

#### A05 P1

- **Section:** AI & Agents
- **Current state:** Tinted skeleton illustration, no real stream.
- **Issue / Gap:** Queue/generating/partial/stop/retry/interruption/timeout/completion/autoscroll/announcements undefined.
- **Why it matters:** Waiting and interruption need control.
- **Impact on UX / UI / Development:** UX: uncertain wait/lost reading. Accessibility: missing/excess feedback. Development: undefined stream states.
- **Recommended improvement:** Real controlled stream example, preserve partial output, coarse announcements, intentional scroll/retry.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Stream state matrix, long/narrow/cancel/error examples.
- **Evidence:** [ai-foundation.html:209](</Users/user/Documents/Damco Agentic Design System/ai-foundation.html:209>)

#### A06 P1

- **Section:** AI & Agents
- **Current state:** Approve/Reject beside one suggestion; no effect scope/diff/capability model.
- **Issue / Gap:** Local/reversible versus external/irreversible, changed-scope consent, expiry/resource impacts unspecified.
- **Why it matters:** Decision requires known consequences.
- **Impact on UX / UI / Development:** UX: uninformed approval. Development: unclear authorization. Product: autonomy not bounded.
- **Recommended improvement:** Define effect previews/capability-based autonomy and scope; reuse valid authorization, renew only for changed/defined scope.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Approval policy, diff/effect summary, expiry/capabilities.
- **Evidence:** [ai-foundation.html:223](</Users/user/Documents/Damco Agentic Design System/ai-foundation.html:223>)

#### A07 P1

- **Section:** AI & Agents
- **Current state:** Hides focused action, shows plain result; Undo hides focused result; no live region/focus transfer.
- **Issue / Gap:** Outcome announcement/focus recovery incomplete; hypothetical undo timing unspecified.
- **Why it matters:** Every operation should preserve orientation.
- **Impact on UX / UI / Development:** UX: missed result/lost focus. Development: incomplete accessible pattern.
- **Recommended improvement:** Announce outcome and restore focus; keyboard-operable undo with defined timing/persistence; neutral decline.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Screen-reader/focus journey, undo recovery.
- **Evidence:** [ai-foundation.js:15](</Users/user/Documents/Damco Agentic Design System/ai-foundation.js:15>)

#### A08 P1

- **Section:** AI & Agents
- **Current state:** Single AI Rule attribution+equal rejection; exported generic instructions brief.
- **Issue / Gap:** No authoritative token resolution/conflict/missing-data/schema/verification contract; external evidence not distinguished from instructions.
- **Why it matters:** Agents need bounded deterministic behavior.
- **Impact on UX / UI / Development:** AI: improvises or misreads data as authority. Development: heterogeneous integrations.
- **Recommended improvement:** Publish trusted-source precedence, capabilities, scope, output/provenance schemas and validation requirements; treat evidence as data.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Agent consumer spec/examples, conflicts/missing info, verification.
- **Evidence:** [ai-foundation.html:249](</Users/user/Documents/Damco Agentic Design System/ai-foundation.html:249>)

#### A09 P1

- **Section:** AI & Agents
- **Current state:** AI sidebar section absent export checkbox/map/catalog; CSS AI tokens absent committed JSON.
- **Issue / Gap:** Defining agent guidance cannot travel through complete handoff.
- **Why it matters:** Recipients miss central rules.
- **Impact on UX / UI / Development:** UX: incomplete export. AI: generic behavior. Development: omitted tokens.
- **Recommended improvement:** Include AI rules/contracts/tokens in manifest/export and make intentional omission visible.
- **Priority:** P1
- **Missing documentation, rule, example or interaction:** Section selection, schema, token/catalog parity fixture.
- **Evidence:** [experience.js:220](</Users/user/Documents/Damco Agentic Design System/experience.js:220>)

#### A10 P2

- **Section:** AI & Agents
- **Current state:** AI-generated/suggested badges and explanation disclosure exist.
- **Issue / Gap:** No mixed human/AI authorship, source history, multi-agent contribution, redacted/missing/private evidence or verification rules.
- **Why it matters:** Trust needs traceability without overwhelming UI.
- **Impact on UX / UI / Development:** UX: unclear authorship. Development: absent audit model. Product: limited governance.
- **Recommended improvement:** Define provenance/version/tool/human-review/edit/redaction fields and progressive disclosure; require supportable evidence.
- **Priority:** P2
- **Missing documentation, rule, example or interaction:** Mixed-authorship/audit examples, redaction, retention/citation rules.
- **Evidence:** [ai-foundation.html:176](</Users/user/Documents/Damco Agentic Design System/ai-foundation.html:176>)


## Proposed complete workflow

This is recommended behavior, not the observed implementation:

Choose create/edit scope → define project/product/platform/density → review inherited defaults and retained overrides → optionally identify contributor → validate/review/save → configure Foundations with consistent recovery → inspect integrated representative screens → resolve validation findings → export complete versioned snapshot → verify target implementation.

Browsing without setup, resuming/discarding drafts, returning to the saved baseline and export during storage failure should have deliberate paths. If multi-project operation remains out of scope, call the page Project setup and explain replacement semantics.

## Foundation documentation contract to add

Use one shared template and structured source for each family:

1. Purpose, scope and accurate supported capability status.
2. Decision guide using product/platform/density and inherited-versus-overridden choices.
3. Public immutable primitives, types, units and allowed values.
4. Effective semantic/component mappings for supported modes and targets.
5. Precedence, dependencies, reset target and migration/deprecation policy.
6. Editing/invalid/persisted/applied/failure/restored/exported state specification.
7. Family-specific accessibility constraints and verification.
8. Responsive, RTL, content-growth, asset-failure and native examples.
9. Human, Machine, Markdown and token artifacts from one version.
10. Real implementation examples, limitations, owner and release acceptance evidence.

Internal token metadata should include purpose, type/unit, primitive/alias role, effective modes, dependencies, public status, allowed/prohibited uses, validation constraints, origin/version and override provenance. Keep this internal schema distinct from its interchange translation.

## Shared state and recovery specification

| State | User-facing behavior | Persistence/export contract |
| --- | --- | --- |
| Inherited default | Show actual value and context/source | Export resolved defaults |
| Valid editing draft | Label preview and modification scope | One documented commit/apply policy |
| Invalid draft | Persistent field/group error and correction | Preserve last valid committed value; mark export status |
| Saving | Progress where asynchronous | No false success/repeated commits |
| Saved/applied | Durable value and effective version visible | Same value in every representation |
| Draft differs from effective | Clearly distinguish both | Export explicit chosen version |
| Storage failure | Retain entries and recover | Valid temporary export where possible |
| Corrupt/future schema | Inspect/migrate/recover, no silent replacement | Reject incompatible authoritative export |
| Reset | Explicit project/system target with undo | Same result after reload |
| Another tab update | Reconcile against local draft/version | Detect stale overwrites |
| Exported snapshot | Show scope/version/assets/omissions | Validate committed contract completeness |

## Missing implementation examples

| Example | Foundations to demonstrate | Critical conditions |
| --- | --- | --- |
| Enterprise form | Roles, spacing, radius, borders/status | Required/Other, read-only, error+focus, long labels, compact touch |
| Responsive dashboard | Grid, density, numeric type, colors | Narrow/tablet/window, empty/error, large data, sticky regions |
| Mobile product | Safe areas, type, assets, hit bounds, sheets | Dynamic text, orientation, back flow, native units |
| Branded action | Brand/foreground, radius/border, elevation | Both themes and hover/pressed/focus/loading/disabled |
| Master-detail editor | Pane geometry, selection, scrolling/layers | Narrow back/focus return, resize, stale data, nested overlays |
| Agent proposal/execution | Attribution, verified evidence, scope/state | Unknown confidence, reject, cancel/retry, partial failure, undo failure |
| Font/icon handoff | Asset source, normalization, semantics | Keyboard upload, rejected files, async failure, reload and clean target |

For each, provide an accepted real implementation and counterexample with reasons, using current public token/class/API names. Include equivalent Machine data and standalone export. Examples should verify behavioral outcomes, not only screenshot styling.

## Recommended delivery sequence

Suggested accountable functions below are proposals, not existing assignments; no delivery timing is inferred.

| Order | Workstream | Suggested accountable functions | Exit evidence |
| --- | --- | --- | --- |
| 1 | Authoritative schema/source/precedence | Design System Lead + token/frontend maintainer | Public manifest, valid typed data, explicit default/override resolution |
| 2 | Export/catalog/token parity | Documentation/tooling + frontend | All nine families, fresh/custom defaults, static rules and packaged dependencies |
| 3 | Accessible and truthful interaction | Frontend + design + accessibility QA | Correct pairs, selected states, keyboard upload, AI outcome/focus truthfulness |
| 4 | Configuration resolver/scope | Frontend + design-system maintainer | Grid/Typography/Spacing/Radius/Borders/Shadows/Icons settings match documented effect |
| 5 | Project/dependency lifecycle | Product + design + frontend | Context changes, drafts, reset, cross-tab and storage recovery deterministic |
| 6 | Production examples and agent contracts | Design + developer experience + AI platform | Integrated compositions, verified evidence and bounded operation lifecycle |
| 7 | Target verification/release | QA/accessibility + target platform teams | Browser/importer evidence, known limitations and migration policy |

## Production readiness acceptance criteria

- Fresh setup followed by immediate export contains effective defaults, context, normative rules and dependencies.
- Valid edits produce matching Human/Machine/local/global/export/target values within explicit preview/application scope.
- All nine families exist in export manifest. Define selection semantics: current Foundation checkboxes filter saved keys while complete scope keeps unrelated noncomponent docs, so unchecking does not necessarily omit a whole section.
- Catalog/token generation is deterministic and validated. Fix the prematurely closed comment containing --space-*/--shadow-*; reject fragments as token names rather than blindly regenerating.
- Default and customized foreground/boundary pairs meet their actual use constraints. Correct/report calculated failing active pairs; isolated badges do not justify general conformance.
- Every choice exposes selection; upload is keyboard-operable; validation persists until correction; outcomes preserve usable focus/announcements.
- Product changes, draft discard/restore, reset/reload, two tabs, quota/unavailable/corrupt/future data have recoverable outcomes.
- Every family has complete effective tokens/mappings, or labels advisory/preview-only limits truthfully.
- Agent proposed/approved/executing/succeeded/failed/declined/undone states and effect/undo limits are explicit; sources substantiate explanations.
- Owner, compatibility/deprecation and release evidence exist. UI badge currently v3.5.0 versus hardcoded Markdown 3.4.0-local-draft; unify or explicitly distinguish library/snapshot versions.

## Runtime verification still required

| Area | Scenarios | Required evidence |
| --- | --- | --- |
| New Project end to end | Fresh/edit/partial draft/discard/Other/errors/history/save failure/Foundations/export | Actual states/focus/messages and artifact comparison |
| Keyboard/assistive technology | Choices/picker/upload/views/validation/export/AI/Undo | Names/roles/values, operation, focus and announcements |
| Responsive/text | 320px effective width, 200% text, 400% zoom, text-spacing override, tablet/window/orientation | No lost task/content; justified region scrolling; logical order |
| Themes/brands/states | Light/dark/extreme custom brand, page/panel/raised/tint, error+focus, active muted text | Computed/rendered real pairs and combined states |
| Persistence/modes | Dark off/auto/custom, local/all reset, reload/two tabs/quota/corrupt/future version | Durable scope, consistent values and recovery |
| Asset/offline | Font/icon invalid/read/load/network failures, navigation/reload, clean exported target | Actual dependencies, fallback, reproduction |
| Input/rendering modes | Forced colors, reduced motion, touch/keyboard/coarse/fine pointer | Visible focus/boundaries/status, usable targets and loading alternatives |
| Target consumers | Strict DTCG importer, web app and supported Figma/native workflow | Schema, resolved alias and asset parity, honest unsupported capabilities |
| Agent operation patterns | Verified/missing evidence, unknown confidence, stream interruption, stale scope, partial/undo failure | Truthful feedback, bounded effects, recovery and history |

This audit report is the deliverable. Original Foundation content/code, saved project configuration, external Pages and deployed applications were not modified.
