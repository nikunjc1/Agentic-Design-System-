# Onboarding and project task-flow review — 27 October 2026

## Baseline, completed before product changes

Reviewed all 159 catalogued pages through `tools/audit-onboarding-pages.cjs`, recording active headings, setup navigation, visible links/actions/fields, and introductory content. All 159 pages expose Project setup in navigation. Inspected seven journey states and screenshots, including fresh Overview, product, identity, review, saved setup, Colors, and saved Icons.

Ran the whole-site browser baseline: 159 pages, 636 viewport checks at 1440/768/390/320 px, 208 guide toggles, and four Foundation recovery checks passed without page errors or missing local assets. This is evaluator/browser evidence, not participant research or a claim of complete accessibility conformance.

Evidence: `before/pages.json`, `before/*.png`, `before/site-health/results.json`.

## Findings and implementation scope

| ID | Observed friction | Intended correction |
|---|---|---|
| ONB01 | Active Overview has no main primary action; setup depends on a dismissible banner or sidebar | Persistent first-use/returning-user setup card with one contextual next task |
| ONB02 | Product-step explanation and one-workspace warning are long; saved details are described as being replaced even when simply revisiting | Short field guidance, explicit workspace scope, editing notice shown during edits |
| ONB03 | Step indicators look navigable but are plain list items | Native step buttons with guarded forward navigation and review edit shortcuts |
| ONB04 | Resuming a draft always starts at product step; step position is not saved | Save and restore a valid draft step; preserve explicit Resume/Discard behavior |
| ONB05 | Required identity labels and action terminology are inconsistent | Consistent required labels, project-specific Save label, visible step count |
| ONB06 | Completion says “Your setup is ready” before Foundations; primary continuation appears below a long checklist | “Project details saved,” next task above checklist, derived eight-editor progress |
| ONB07 | Foundation saving does not lead to the next editor; users must remember sidebar order | Optional guided sequence with Save & continue, Back, skip/default route, return to summary |
| ONB08 | Readiness includes AI examples as though they were a ninth required setup editor | Eight configurable Foundation steps; AI examples remain available as library documentation |
| ONB09 | Global prose clamping hides setup “What happens next” content | Exempt task-flow UI and form instructions from generic prose collapsing |
| ONB10 | Project edits lack a stale-write check against another tab | Expected saved-record check and visible reload recovery before an overwrite |
| ONB11 | Foundation defaults/saves/recovery are hard to distinguish in the journey | Shared readiness derived from actual records; distinguish default, saved, partial, recovery states |
| ONB12 | Export and Settings have no clear return to guided setup | Reuse contextual next-task links without making export dependent on setup completion |
| ONB13 | Figma page receives an obsolete shared “connection unavailable” banner despite local bridge support | Update this contradictory notice to describe the local Desktop bridge accurately |

## Active-page distinction

The current `overview.html` is a library landing page and does not load `overview.js` or `overview-model.js`. Those files describe an older prototype and are not a second active project creator. Changes target the active Project Setup and shared experience; do not invent multi-project isolation or silently migrate historical prototype records.

## Proposed task flow

```text
Overview: start / resume / continue
→ Product and platforms
→ About you
→ Review and save project details
→ Colors → Grid & Layout → Typography → Spacing
→ Radius → Borders → Shadows → Icons
→ Export handoff / explore components
```

Returning users see their saved project and the next unsaved/recovery Foundation. Saving recommended defaults counts as an explicit choice. Skipping leaves defaults unsaved and visibly incomplete. Existing settings are retained; recommendations never replace saved overrides. Browsing/export remain available at every stage.

## Verification after implementation

### Implemented corrections

All ONB01–ONB13 findings above have implementation changes:

- Overview has a permanent setup panel. It handles fresh entry, an existing draft, a saved project, all Foundations saved, unreadable setup, and a Foundation needing recovery. Dismissing the old banner cannot remove this main entry point.
- The setup wizard has native step buttons and two review edit shortcuts. Earlier required fields guard forward movement. Form entries survive movement between steps.
- Valid drafts include their current step, and Resume returns to that step subject to validation. An existing draft still requires explicit Resume/Discard; opening an edit link does not silently overwrite it.
- Required identity fields are clearly marked. The final action says **Save project details**. The completion heading says **Project details saved** rather than implying that every Foundation has been configured.
- Completion actions appear before the longer details/readiness list. The primary action points to a recovery section first, otherwise the first unsaved section, or the handoff once all eight are saved.
- A shared model derives eight-editor progress from durable records. All records belonging to a section must be readable/usable to count that section as saved. Defaults, partial saves, and recovery needs are distinct.
- The optional `?setup=1` journey visits Colors, Grid & Layout, Typography, Spacing, Radius, Borders, Shadows, and Icons. It offers Back, a full step list, skip, project summary, and **Save & continue** through the existing save transaction.
- Saving advances only after the Foundation controller emits successful completion. Invalid settings, storage failures, and unreadable records remain on the current page.
- Skip leaves the Foundation unsaved and keeps the saved count accurate. It does not covertly approve or persist defaults.
- An unfinished Foundation preview blocks guided-link navigation with an explanation. Browser unload protection also warns about losing a changed preview. Explicit Cancel discards that preview and reloads the saved state.
- Project saves compare the original saved record with the current one. Another tab's update blocks stale submission and exposes a reload action.
- Edit links open explicit edit mode. Save/Cancel remove the edit query parameter so a subsequent reload returns to the saved summary.
- Setup/export instructions and the new journey panels are exempt from generic prose collapsing. Their next-action guidance remains visible.
- Settings and handoff reuse contextual setup continuation without requiring completion to browse or export.
- Figma's shared page notice now describes the local bridge instead of incorrectly saying no connection is available. This is a content correction, not new live Figma verification.

### Source files

| File | Responsibility |
|---|---|
| `project-model.js` | Foundation step inventory/readiness, bounded draft step, optional stale-save check |
| `experience.js` | Overview next task, guarded wizard navigation, resume, guided Foundations, Settings/handoff continuation |
| `experience.css` | Shared task-flow panels, step buttons, progress/navigation, narrow layouts |
| `foundation-runtime.js` | Editor state/success events, changed-preview protection, grouped guided actions, task-copy clamp exemption |
| `overview.html` | Permanent setup entry and clear library section |
| `new-project.html` | Step controls, required labels, review shortcuts, saved-summary actions |
| `settings.html` | Explicit project edit link |
| `foundation-contract.json` | Updated canonical setup/navigation/recovery rules |
| `tests/project-model.test.js` | Readiness, stale save, draft-step regressions |
| `tests/library-layout.test.cjs` | Keep the shared-banner fixture on a page that still uses the banner; provide browser query API |
| `tools/audit-onboarding-pages.cjs` | Full active-page task-entry inventory and seven journey captures |
| `tools/check-onboarding-flow.cjs` | End-to-end setup, failure/recovery, guided save, download, theme/viewport checks |
| `tools/verify-onboarding-release.cjs` | Run the new flow plus existing regression/release checks and all-page review |

Generated Foundation contracts/model, token/default manifests, and documentation inventory were refreshed through the existing generators. The catalog remains 159 pages; no extra setup page or second project store was introduced.

### Evidence locations and commands

Final combined result: **PASS**. The new onboarding suite, release gate, existing setup suite, contract editor suite, prompt regression suite, full-site smoke, and all-page flow inventory all passed on the final implementation. Whole-site coverage remained 159 pages / 636 viewport checks / 208 guide toggles / four recovery checks; prompts remained 69 pages / 161 checks. `git diff --check` also passed.

- Baseline all-page inventory: [before/pages.json](before/pages.json).
- Baseline smoke results: [before/site-health/results.json](before/site-health/results.json).
- New flow assertions: [after/flow-results.json](after/flow-results.json).
- Combined final verification: [after/verification.json](after/verification.json).
- Current full-site smoke: [after/site-health/results.json](after/site-health/results.json).
- Current all-page flow inventory: [after/page-review/pages.json](after/page-review/pages.json).
- Current prompt regression results: [after/prompts/regressions.json](after/prompts/regressions.json).
- Per-suite output: `after/onboarding.log`, `release.log`, `setup.log`, `prompts.log`, `contracts.log`, `site-health.log`, `pages.log`.
- Actual browser-downloaded handoff fixture: [after/claims-mobile-design-system.md](after/claims-mobile-design-system.md). It contains synthetic test-project data, not the user's private project.

The automated journey covers twelve assertion groups, including a real pass through all eight saves and an actual Markdown download. It additionally checks five task destinations at four widths in both themes (40 viewport/theme combinations).

```sh
export ADS_PLAYWRIGHT_PACKAGE='/path/to/playwright-core'
node tools/verify-onboarding-release.cjs
```

The existing temporary Playwright installation and Chrome path used in the implementation handoff were reused. Local port binding/Chrome required an approved execution outside the default sandbox. All browser data was created in isolated test contexts; the user's actual local-storage workspace was not cleared or edited.

### Before/after screenshots

| State | Before | After |
|---|---|---|
| Overview, fresh user | [Before](before/overview.png) | [After](after/overview-new.png) |
| Project saved | [Before](before/setup-saved.png) | [After](after/project-saved.png) |
| Foundation entry | [Before](before/colors.png) | [After](after/guided-colors.png) |
| Mobile Overview | — | [Light](after/overview-light-mobile.png), [Dark](after/overview-dark-mobile.png) |
| Mobile guided Foundation | — | [Light](after/guided-light-mobile.png), [Dark](after/guided-dark-mobile.png) |

### Practical limits

- This remains one active project with shared workspace Foundations in one browser/origin. No account, cloud sync, team authorization, invitation delivery, package publication, or deployment was added.
- Saved progress indicates durable valid records. It does not certify component accessibility, visual parity, or all acceptance checks for that Foundation.
- Skips intentionally remain incomplete. Returning from Overview resumes the next unsaved/recovery section rather than remembering a skipped section as approved.
- The ordering is guidance, not a restriction: people can jump to a step, browse the library, or export defaults.
- Local saved setup and draft recovery remain explicit; a corrupted/future record is preserved until the user backs up/discards it.
- Browser verification blocked external font requests. Screenshots and assertions do not substitute for checking production fonts or assistive technology.
- No participant study was conducted. Claims about improved task completion or reduced completion time need real user testing; no such measurements are invented here.
- Live Figma and the larger legacy component-contract migration remain as documented in the main implementation handoff. They are outside this onboarding fix.
