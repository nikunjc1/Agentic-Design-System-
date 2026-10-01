# Create Design — Usability and QA Audit Report

**Product:** Damco Agentic Design System  
**Audit date:** 1 October 2026  
**Audit type:** Tab-by-tab usability, task-flow, accessibility, and source-level QA audit  
**Overall status:** **Not ready for a complete Create Design workflow**  
**Report status:** Final audit findings; no product code changed

---

## 1. Executive Summary

The current product is strongest as a local design-system documentation and component-reference portal. Its documentation routes, local links, Markdown export, and component guides provide a useful foundation.

The main product promise, however, is not completed. A user can enter project and profile information and customize local foundation values, but cannot generate, publish, share, install, collaborate on, or manage a design system as a project.

> [!CAUTION]
> **Critical product-flow gap:** The Create flow ends after saving a local profile. It does not produce CSS, an NPM package, a Figma resource, a shareable project, collaborator invitations, or a real version-history entry.

### Audit totals

- **88** sidebar navigation entries reviewed.
- **157** production HTML pages included in the source sweep.
- **62** component-listing routes inspected.
- **140** initially visible editable foundation controls found without contextual programmatic labels.
- **61 of 62** component-listing routes lead to only one distinct detail destination.
- **25** save/copy feedback elements lack live status semantics.
- **66** JavaScript files use a copy fallback that can report success without verifying that copying succeeded.
- **10 of 10** existing model tests pass.
- **0** broken local file or fragment targets found.
- **0** JavaScript syntax failures found.

### Release recommendation

**Do not treat the current build as a complete Create Design product.** It can be released internally as a documentation/reference prototype if planned and mock features are labelled clearly. The project lifecycle, persistence model, foundation interaction semantics, accessible names, copy reliability, and end-to-end coverage should be addressed before a product release.

---

## 2. Audit Scope and Method

The audit covered:

- First-time project setup.
- Returning-user and edit behavior.
- Project persistence and draft handling.
- Foundation selection, editing, saving, and resetting.
- Component discovery and component-guide navigation.
- Component listing-page specimens.
- Copy Prompt, Copy Code, and Copy Markdown tasks.
- Markdown preview, copy, and download.
- AI Approve, Reject, Explain, and Undo interactions.
- Settings, appearance, direction, and integration routes.
- History, package, Figma, and AI Generator expectations.
- Keyboard and assistive-technology semantics detectable from source.
- Local route, asset, and fragment integrity.
- Existing automated test and browser-audit coverage.

### Verification performed

- All JavaScript files passed syntax validation.
- All 10 existing unit tests passed.
- All local `href`, `src`, and fragment targets in the 157 production pages resolved.
- No duplicate IDs were detected in the production HTML files.
- All inspected pages declare a document language.
- Existing stored browser evidence contains 308 checks at 1440px and 390px.

### Runtime limitation

A fresh in-app browser was not available during this audit. Current computed layout, pointer behavior, actual clipboard permissions, screen-reader speech, and viewport rendering were therefore not re-executed live. Responsive observations are based on the stored browser audit; accessibility, state, storage, navigation, and task findings are source-confirmed.

---

## 3. Severity and Status Definitions

| Level | Meaning |
|---|---|
| **Critical** | Prevents the primary product outcome or risks major project/data loss. |
| **High** | Blocks or seriously degrades an important task, accessibility requirement, or reliable outcome. |
| **Medium** | Causes confusion, extra work, misleading feedback, or reduced accessibility. |
| **Low** | Quality, consistency, maintainability, or defensive-markup issue. |

| Test status | Meaning |
|---|---|
| **Fail** | A confirmed defect or missing required outcome exists. |
| **Partial** | The route works in part but has important usability or QA gaps. |
| **Pass** | No material source-level issue was found for the stated task. |
| **Planned / Reference** | The route describes a future or illustrative feature and is not operational. |
| **Needs live retest** | Source evidence is insufficient for final pointer, visual, or screen-reader confirmation. |

---

## 4. Confirmed Issues and Bugs

### UQA-001 — Create Design flow does not create a usable design system

> [!CAUTION]
> **Severity: Critical · Status: Confirmed product-flow gap**

**Affected tabs:** Overview, New Project, AI Generator, NPM Package, Figma, History, Settings

**Current flow**

```text
Overview
  → New Project
  → Product and platform
  → Identity and role
  → Review
  → Save local profile
  → Browse documentation or foundations
```

**Required complete flow**

```text
Create project
  → Generate design system
  → Review generated output
  → Use CSS / NPM / Figma resources
  → Copy, open, or share
  → Invite collaborators
  → Publish and review history
```

**Actual result:** The user receives a locally stored profile and recommended documentation link. No generated product asset, installation resource, shareable URL, collaboration state, or release is created.

**Impact:** The primary product promise is not achieved.

**Recommendation:** Define a real post-review generation state and a project result page containing generated resources, statuses, next actions, and recoverable failure handling.

---

### UQA-002 — New Project overwrites the only saved project

> [!CAUTION]
> **Severity: Critical · Status: Confirmed data-model limitation**

**Affected tabs:** New Project, Overview, Settings, MD Export

**Evidence:** `project-model.js` stores the profile under the single fixed key `ads:project-profile:v1`.

**Actual result:** Saving a new setup replaces the previously saved profile. There is no project ID, project collection, duplicate warning, archive, restore, or switch-project flow.

**Impact:** Users cannot safely create or manage multiple design systems and may unintentionally replace prior work.

**Recommendation:** Store projects by unique ID, introduce a project index, distinguish Create from Edit, and warn before replacement or destructive changes.

---

### UQA-003 — Overview is a documentation catalog, not a project home

> [!WARNING]
> **Severity: High · Status: Confirmed information-architecture mismatch**

**Affected tab:** Overview

**Expected:** A home for projects, creation state, recent activity, outputs, and next actions.

**Actual:** A documentation catalog with no project list, current-project status, collaborators, generated outputs, version, or publishing state.

**Additional QA finding:** `overview.js`, `overview-model.js`, and `overview.css` exist but no HTML page loads them. Six passing overview-model tests therefore cover an unreachable implementation.

**Recommendation:** Either turn Overview into the project hub or rename it to Documentation. Remove or connect the unused implementation and align test coverage with the rendered product.

---

### UQA-004 — Required identity information has no corresponding product purpose

> [!WARNING]
> **Severity: High · Status: Confirmed usability and trust issue**

**Affected tab:** New Project

**Fields:** Name, email, designation, and role are required.

**Actual result:** There is no account, invitation, email, ownership, cloud synchronization, or team workflow that uses the required identity data. “Designation” and “Role” also overlap conceptually.

**Impact:** Increases abandonment and creates an unnecessary privacy/trust question.

**Recommendation:** Require only information that changes the output. Explain why identity is needed, make optional fields optional, and remove either Designation or Role unless their separate effects are demonstrated.

---

### UQA-005 — Auto-save contradicts the visible Save actions

> [!WARNING]
> **Severity: High · Status: Confirmed interaction defect**

**Affected tabs:** Colors, Grid & Layout, Typography, Spacing, Radius, Borders, Shadows, Icons

**Steps to reproduce:**

1. Open a foundation editor.
2. Change a selected system, value, or color.
3. Do not press the visible Save button.
4. Navigate away and return.

**Actual result:** The value has already been persisted by the interaction handler.

**Expected result:** Either changes should remain pending until Save, or the interface should clearly describe itself as auto-saving and remove the Save action.

**Impact:** Users cannot preview safely, understand whether work is committed, or reliably cancel a change.

**Recommendation:** Choose one model:

- Explicit Save with dirty state, Cancel, and unsaved-change protection; or
- Clearly communicated auto-save with Saved/Failed state and undo.

---

### UQA-006 — Reset actions are immediate and destructive

> [!WARNING]
> **Severity: High · Status: Confirmed recoverability defect**

**Affected tabs:** Colors, Grid & Layout, Typography, Spacing, Radius, Borders, Shadows, Icons

**Actual result:** Reset immediately writes defaults. There is no confirmation, before/after summary, cancel, or undo.

**Impact:** A single activation can replace a customized foundation system.

**Recommendation:** Add confirmation with scope, preserve the prior value for undo, and clearly differentiate “Reset unsaved changes” from “Restore saved defaults.”

---

### UQA-007 — 140 visible foundation controls lack contextual accessible names

> [!WARNING]
> **Severity: High · Status: Confirmed accessibility defect**

**Affected tabs:**

- Colors: **32** controls.
- Typography: **64** controls.
- Borders: **44** controls.

**Actual result:** Visual text is rendered near color pickers and hex inputs, but it is not programmatically associated through `<label>`, `aria-label`, or `aria-labelledby`. Generated color triggers use the generic name “Choose color,” without token or theme context.

**Example problem:** A screen reader may announce “Choose color” or “Edit text” instead of “Primary brand color, light theme” or “Primary brand hex value.”

**Recommendation:** Give every input a unique label containing token name, theme, and value type. Group related color and hex controls with `fieldset` and `legend` where appropriate.

---

### UQA-008 — Selected foundation options are visual-only

> [!WARNING]
> **Severity: High · Status: Confirmed accessibility defect**

**Affected tabs:** Grid & Layout, Typography, Spacing, Radius, Borders, Shadows, Icons

**Actual result:** Mutually exclusive options toggle `.is-active`, but do not expose selection using radio semantics, `aria-pressed`, or `aria-selected`.

**Typography-specific defect:** Two elements declare `role="tablist"`, but their children do not implement tab roles, `aria-selected`, `aria-controls`, roving `tabindex`, or associated `tabpanel` semantics.

**Impact:** Keyboard and screen-reader users cannot reliably identify the current choice or use expected tab-keyboard behavior.

**Recommendation:** Use native radio groups for exclusive selections. Implement the complete ARIA Tabs pattern for real tabs, or remove `tablist` and use ordinary buttons.

---

### UQA-009 — Component navigation adds an unnecessary intermediate screen

> [!WARNING]
> **Severity: High · Status: Confirmed efficiency issue**

**Affected tabs:** All 62 component-listing routes

**Actual result:** Sixty-one of the 62 component listing routes have only one distinct detail destination. Users must open the component tab, view the only available card, and then select “View component guide.”

**Impact:** Adds a click, page load, and decision point without providing a meaningful choice.

**Recommendation:** Link sidebar entries directly to the detail guide when there is one destination. Alternatively, merge the listing and guide into one route.

---

### UQA-010 — Component specimens appear interactive without completing a task

> [!WARNING]
> **Severity: High · Status: Confirmed interaction-honesty issue**

**Affected listing tabs include:** Add-on, Autocomplete, Calendar, Cascader, Dropdown, Empty, Input, Notification, Number, Password, Search, Select, Text Area, Transfer, Tree Select

**Examples:**

- Calendar exposes 42 focusable date buttons without a completed selection task.
- Transfer exposes checkboxes and transfer arrows without a functional transfer.
- Several fields can receive focus but are not labelled programmatically.
- Dropdown and notification specimens expose controls that do not provide the expected outcome.

**Impact:** Keyboard users spend time tabbing through non-functional controls, while all users receive a false affordance.

**Recommendation:** Either make specimens fully functional or mark them as presentation-only and remove their controls from the tab sequence.

---

### UQA-011 — Copy actions can falsely report success

> [!WARNING]
> **Severity: High · Status: Confirmed reliability defect**

**Affected flows:** Copy Prompt, Copy Code, foundation Markdown copy, reference-page Markdown copy

**Evidence:** Sixty-six JavaScript files use a fallback based on `document.execCommand("copy")`; the boolean result is not verified before showing “Copied!” or “Copied to clipboard.” The reference-page Markdown exporter reports success when Clipboard API is absent without running a copy fallback.

**Impact:** The user may paste stale or unrelated clipboard data while believing the requested content was copied.

**Recommendation:** Verify success, show an error when copying fails, and provide a selected-text or manual-copy fallback. Use one shared, tested clipboard utility.

---

### UQA-012 — Draft and saved project states are ambiguous

> [!WARNING]
> **Severity: High · Status: Confirmed state-management issue**

**Affected tabs:** New Project, Settings

**Actual result:** An unfinished draft is loaded before the saved profile when setup is reopened. There is no “Resume draft,” “Discard draft,” or comparison prompt.

**Impact:** A user may believe they are editing the saved project while actually viewing partially entered draft data.

**Recommendation:** Distinguish saved and draft records, show draft age, and ask the user whether to resume or discard it.

---

### UQA-013 — Global search promise does not match its behavior

> [!IMPORTANT]
> **Severity: Medium · Status: Confirmed content and functionality mismatch**

**Affected area:** Global sidebar search on all pages

**UI promise:** “Search components, tokens, docs…”

**Actual behavior:** Only `.nav-link` text is filtered. Page content, token names, component content, and documentation text are not searched.

**Example:** Searching for “contrast” can produce no result even though accessibility content discusses contrast.

**Recommendation:** Rename it to “Filter navigation,” or implement a content index that fulfills the current promise.

---

### UQA-014 — Operation feedback is not announced

> [!IMPORTANT]
> **Severity: Medium · Status: Confirmed accessibility defect**

**Affected tabs:** Accessibility, Borders, Copywriting, Data Format, Colors, Grid & Layout, Component Guidelines, Icons, Design Principles, Radius, Shadows, Spacing, Typography, AI & Agents

**Evidence:** Twenty-five `.save-status` elements have neither `role="status"` nor `aria-live`. AI Approve/Reject results have the same issue.

**Impact:** Screen-reader users may receive no confirmation that save, reset, copy, approve, or reject occurred.

**Recommendation:** Use persistent live-status containers, keep messages specific, and avoid hiding them before assistive technology can announce them.

---

### UQA-015 — Draft-saved announcement fires on every input event

> [!IMPORTANT]
> **Severity: Medium · Status: Confirmed accessibility and distraction issue**

**Affected tab:** New Project

**Actual result:** Every `input` event writes the draft and replaces the live status with “Draft saved on this browser.”

**Impact:** Screen readers can announce the message repeatedly while the user types. It also masks more important guidance and errors.

**Recommendation:** Debounce persistence, announce only the first save or meaningful state transition, and keep validation errors in a separate error summary.

---

### UQA-016 — Review step has no direct edit actions

> [!IMPORTANT]
> **Severity: Medium · Status: Confirmed usability issue**

**Affected tab:** New Project

**Actual result:** Review renders a definition list of values. To fix a value, the user must use Back, remember where the field lives, update it, and return.

**Recommendation:** Add “Edit product and platforms” and “Edit profile and role” actions beside the corresponding review groups.

---

### UQA-017 — History contains broken-looking version links

> [!IMPORTANT]
> **Severity: Medium · Status: Confirmed navigation defect**

**Affected tab:** History

**Steps to reproduce:** Activate version 3.1.0, 3.0.0, or 2.9.1.

**Actual result:** The links use `href="#"` and navigate to the top of the page instead of opening version details.

**Recommendation:** Use non-interactive text in the mockup or implement real version-detail targets. Do not use placeholder links for visible task actions.

---

### UQA-018 — Planned and reference-only routes look like operational product areas

> [!IMPORTANT]
> **Severity: Medium · Status: Confirmed expectation issue**

**Affected tabs:** AI Generator, NPM Package, Figma, History

**Actual result:** These destinations occupy first-class navigation positions. Their bodies explain that they are planned, unavailable, or illustrative only after the user opens them.

**Impact:** Users enter dead-end journeys and may overestimate the product’s current capability.

**Recommendation:** Add “Planned” or “Reference” badges in navigation, group roadmap items separately, or hide them until usable.

---

### UQA-019 — Local storage errors are inconsistently handled

> [!IMPORTANT]
> **Severity: Medium · Status: Confirmed resilience issue**

**Affected tabs:** Foundation editors and shared preference controls

**Actual result:** Several local-storage writes and removals are not guarded. Storage denial, privacy restrictions, or quota failures may interrupt the interaction without usable recovery feedback.

**Recommendation:** Route storage operations through one safe adapter that returns success/failure, preserves in-memory state, and exposes an actionable error message.

---

### UQA-020 — Setup hash routing does not preserve deep-link intent

> [!IMPORTANT]
> **Severity: Medium · Status: Confirmed navigation issue**

**Affected tab:** New Project

**Actual result:** Setup replaces the location hash with `#step-1` on load. A valid deep link to a later step is discarded, and browser Back/Forward behavior becomes tied to validation side effects.

**Recommendation:** Use an explicit step state model, preserve a valid requested step when prerequisites are complete, and define expected browser-history behavior in an automated test.

---

### UQA-021 — Shared Settings button omits an explicit button type

> [!NOTE]
> **Severity: Low · Status: Confirmed markup issue**

**Affected area:** Shared top bar on all 157 production pages

**Actual result:** The Settings icon button has no `type="button"`.

**Current risk:** Low because it is presently outside a form.

**Recommendation:** Add `type="button"` in the shared template to prevent accidental form submission if the shell is reused inside a form context.

---

### UQA-022 — One historical mobile overflow result requires regression coverage

> [!NOTE]
> **Severity: Low · Status: Historical, not currently reproduced**

**Affected page:** `modal-default.html` at 390px

**Stored result:** Main content was reported as 402px wide in a 390px viewport. A later audit note says the issue could not be reproduced.

**Recommendation:** Retain a 320px and 390px overflow assertion for this page in the next live browser suite.

---

## 5. User-Flow and Task-Flow Results

| Flow | Expected outcome | Result | Status |
|---|---|---|---|
| Discover the product | Understand what can be created and where to start | Documentation is discoverable, but project state and final output are unclear | **Partial** |
| Create a first project | Complete setup and receive a usable design system | Only a local profile is saved | **Fail** |
| Validate incomplete setup | Errors identify fields and focus the first invalid control | Custom validation and first-error focus are implemented | **Pass at source level** |
| Review before saving | Verify and directly edit each information group | Values are shown, but there are no direct edit links | **Partial** |
| Edit an existing project | Change the saved project without losing unrelated work | Same flow as New Project; draft and overwrite behavior are ambiguous | **Fail** |
| Create a second project | Preserve the first project and create another | Fixed storage key replaces the previous profile | **Fail** |
| Customize foundations | Preview changes, save intentionally, cancel or reset safely | Edits persist immediately; Save is misleading and Reset is destructive | **Fail** |
| Identify current foundation choice | Visual and assistive-technology users know the selection | Visual state exists; semantic state is missing | **Fail** |
| Find a component | Search or navigate directly to a useful guide | Navigation works, but search is limited and most routes add a single-item gateway | **Partial** |
| Try a component specimen | Interactions behave like the named component | Several specimens expose non-functional controls | **Fail for affected tabs** |
| Copy a prompt or code | Clipboard contains requested content and reports accurate result | Primary path works; fallback can falsely report success | **Partial** |
| Export Markdown | Select scope, preview, copy, or download | Best-supported task; download and manual-copy recovery exist | **Pass, needs live retest** |
| Approve/reject AI suggestion | Action is applied/discarded and remains reversible | Visual state and Undo exist; status/focus handling is incomplete | **Partial** |
| Publish NPM package | Configure and publish a package | Reference mockup only | **Planned / Fail as product task** |
| Connect Figma | Authenticate and select/push/pull a library | Not built | **Planned / Fail as product task** |
| View and restore history | Inspect real versions, compare, restore, and export | Mock data and placeholder links only | **Fail** |
| Invite collaborators | Invite, assign role, and see membership state | No flow exists | **Fail** |
| Use on mobile | Navigate and complete primary tasks at small widths | Source includes drawer, Escape, focus loop, inert background, and touch sizing; current rendering not freshly tested | **Needs live retest** |

---

## 6. Tab-by-Tab Findings

### Primary navigation

| Tab | Status | Findings |
|---|---|---|
| Overview | **Fail** | Documentation catalog instead of project hub; dead/unloaded overview implementation exists. |
| Design Values | **Pass / Reference** | Readable static content; no meaningful operational task. |
| New Project | **Fail** | Incomplete product outcome, single-project overwrite, unnecessary required identity, draft ambiguity, noisy save status, no direct review editing. |

### Foundations

| Tab | Status | Findings |
|---|---|---|
| Colors | **Fail** | Auto-save contradicts Save; 32 unlabeled controls; destructive resets; status not announced. |
| Grid & Layout | **Partial** | Immediate persistence; no semantic selection state; destructive reset. |
| Typography | **Fail** | 64 unlabeled controls; incomplete tab semantics; immediate persistence; platform chips lack selected-state semantics. |
| Spacing | **Partial** | Immediate persistence; visual-only selected state; destructive reset. |
| Radius | **Partial** | Immediate persistence; visual-only selected state; destructive reset. |
| Borders | **Fail** | 44 unlabeled controls; visual-only selection; immediate persistence. |
| Shadows | **Partial** | Immediate persistence; visual-only selected state; destructive reset. |
| Icons | **Partial** | Visual-only selected state; immediate persistence; destructive reset. |
| AI & Agents | **Partial** | Approve/Reject/Undo exists; result is not announced and focus handling is incomplete. |

### Guidelines

| Tab | Status | Findings |
|---|---|---|
| Design Principles | **Partial** | Content passes; Copy Markdown can falsely report success and its status is not live. |
| Component Guidelines | **Partial** | Same copy and feedback issues. |
| Copywriting | **Partial** | Same copy and feedback issues. |
| Data Format | **Partial** | Same copy and feedback issues. |
| Accessibility | **Partial** | Same copy and feedback issues on an accessibility-focused route. |

### Component tabs — forms and data entry

**Tabs:** Button, Group Button, Float Button, Input, Select, Checkbox, Radio, Switch, Date Picker, Password, Number, Mention, Autocomplete, Date Range, Time, Text Area, Search, Add-on, Color Picker, Slider, Rating, Cascader, Transfer, Tree Select, Upload

**Shared result:** **Partial**

- Routes and local targets resolve.
- Most tabs add a single-item intermediate listing page.
- Several listing specimens expose focusable but inert controls.
- Input, Add-on, Autocomplete, Cascader, Number, Password, Search, Text Area, and Tree Select include specimen fields without programmatic labels.
- Copy fallback can report false success on linked guides.

### Component tabs — navigation

**Tabs:** Tabs, Anchor, Breadcrumb, Dropdown, Pagination, Menu, Steps

**Shared result:** **Partial**

- Routes and local targets resolve.
- Single-detail gateway remains unnecessary.
- Some specimen links or controls are illustrative rather than functional.
- Copy fallback reliability issue applies to linked guides.

### Component tabs — feedback

**Tabs:** Affix, Alert, Toast, Modal, Tooltip, Tour, Drawer, Notification, Pop Confirm, Progress, Result, Skeleton, Spin

**Shared result:** **Partial**

- Routes and detail guides resolve.
- Listing controls can imply behavior without delivering the expected feedback interaction.
- Modal retains a historical 390px overflow regression test.
- Copy fallback reliability issue applies to linked guides.

### Component tabs — data display

**Tabs:** Divider, Avatar, Badge, Calendar, Card, Collapse, Description, Empty, Image, List, Popover, Splitter, Statistic, Table, Tag, Timeline, Tree

**Shared result:** **Partial**

- Routes and detail guides resolve.
- Calendar exposes many focusable day controls without a completed calendar-selection task.
- Most tabs add a single-detail intermediate page.
- Copy fallback reliability issue applies to linked guides.

### Product and delivery tabs

| Tab | Status | Findings |
|---|---|---|
| Patterns | **Partial** | Useful copy actions; fallback can falsely report success. |
| Templates | **Partial** | Same copy issue; record-detail demo contains a placeholder breadcrumb link. |
| AI Generator | **Planned** | Clearly says Not built yet, but creates a first-class navigation dead end. |
| MD Export | **Pass / Retest** | Scope, identity opt-in, preview, download, and manual-copy recovery are present. |
| NPM Package | **Reference** | Mockup/roadmap only; no publishing task. |
| Figma | **Planned** | No authentication, library choice, push, pull, or diff task. |
| History | **Fail / Reference** | Mock data, placeholder version links, and no real compare/restore flow. |
| Changelog | **Pass / Reference** | Static content; no material source-level defect found. |
| Settings | **Partial** | Density and RTL controls exist; project and integration controls lead to partial or planned flows. |

---

## 7. Positive Findings

- All inspected local file links and fragment targets resolve.
- JavaScript syntax checks pass.
- Existing unit tests pass.
- No duplicate IDs were detected in production HTML.
- Document language is present.
- New Project provides field-level validation and focuses the first invalid field.
- Setup clearly states that project data is saved locally in the browser.
- MD Export makes identity inclusion optional and describes whether contact details are included.
- MD Export offers a useful manual-copy recovery path when direct clipboard access fails.
- Planned AI Generator and Figma pages state that the features are not built.
- Mobile drawer source includes Escape handling, focus looping, background inertness, overlay closing, and minimum touch-target rules.
- History view switching uses real buttons with `aria-pressed` rather than relying only on color.
- AI suggestions have equally visible Approve and Reject paths and include an Undo action.

---

## 8. Automated QA Coverage Gaps

Current tests cover the project data model and an overview model that is not connected to the rendered Overview page. They do not cover the critical product tasks.

### Required automated scenarios

1. Create a valid first project and verify the final project/result state.
2. Attempt invalid setup and verify error summary, field errors, and focus.
3. Resume and discard a draft.
4. Create a second project without overwriting the first.
5. Edit a project and cancel changes.
6. Change a foundation value and verify the chosen save model.
7. Reset a foundation and undo the reset.
8. Navigate every foundation selector by keyboard and verify selected semantics.
9. Search by component, token, and documentation term.
10. Open every component tab and reach its detail guide.
11. Verify that presentation specimens do not add inert keyboard stops.
12. Copy prompt/code/Markdown with Clipboard API allowed, denied, and unavailable.
13. Export each Markdown scope and verify output content.
14. Approve, reject, and undo an AI suggestion while verifying focus and live status.
15. Test mobile drawer, focus trap, Escape, overlay, and navigation at 320px and 390px.
16. Test tablet layout at 768px and desktop layout at 1440px.
17. Assert zero horizontal page overflow at all target widths.
18. Test theme, density, and RTL persistence.
19. Validate planned/reference navigation labels.
20. Run automated accessibility checks, followed by keyboard and screen-reader review.

---

## 9. Recommended Remediation Order

### Release blocker phase

1. Complete the project lifecycle and generated-output experience.
2. Introduce unique project IDs and multi-project persistence.
3. Separate Create, Edit, and Draft states.
4. Prevent or explicitly confirm destructive overwrite/reset behavior.

### Accessibility and interaction phase

5. Label all 140 affected foundation controls.
6. Implement semantic selected states and complete Typography tabs.
7. Add live operation feedback and correct AI focus management.
8. Remove inert specimen controls from the tab order or make them functional.

### Efficiency and trust phase

9. Choose auto-save or explicit Save for foundations.
10. Remove single-item component gateway pages.
11. Fix clipboard verification and consolidate copy logic.
12. Align global-search wording with actual scope or implement full search.
13. Label planned and reference-only navigation destinations.

### QA phase

14. Replace tests of unreachable overview code with rendered user-flow tests.
15. Add end-to-end tests for setup, foundations, search, copy, export, history, and settings.
16. Run fresh browser verification at 320px, 390px, 768px, and 1440px.
17. Complete manual keyboard and screen-reader passes after the semantic fixes.

---

## 10. Suggested Acceptance Criteria

The Create Design experience should not be marked release-ready until:

- A completed setup creates an identifiable project with a durable result page.
- Creating another project cannot silently replace an existing one.
- Generated outputs and unavailable integrations are clearly distinguished.
- Every foundation input has a unique accessible name.
- Every exclusive selection exposes its current state programmatically.
- Foundation Save/auto-save behavior is unambiguous and recoverable.
- Reset and overwrite operations can be confirmed or undone.
- Component tabs reach useful content without unnecessary single-item gateways.
- Interactive specimens either work or are not interactive.
- Copy actions never report success without confirming success.
- All operation results are announced to assistive technology.
- Search behavior matches its label and placeholder.
- Primary flows pass keyboard, screen-reader, mobile, tablet, and desktop verification.
- End-to-end tests cover project creation, editing, foundations, export, and failure states.

---

## 11. Evidence Locations

- Project model and single storage key: `project-model.js`
- New Project routing, draft, review, and save behavior: `experience.js`
- Sidebar search behavior: `shell.js`
- Foundation persistence: `foundations.js`, `grid-layout.js`, `typography.js`, `spacing.js`, `radius.js`, `borders.js`, `shadows.js`, `icons.js`
- Foundation control markup: `foundations.html`, `typography.html`, `borders.html`
- AI decision demo: `ai-foundation.html`, `ai-foundation.js`
- History placeholder links: `history.html`
- Unused Overview implementation: `overview.js`, `overview-model.js`, `overview.css`
- Existing unit tests: `tests/project-model.test.cjs`, `tests/overview-model.test.cjs`
- Stored responsive evidence: `audit/browser-second-pass.json`
- Existing page inventory: `audit/page-inventory.json`, `audit/page-inventory.md`

---

**End of report**
