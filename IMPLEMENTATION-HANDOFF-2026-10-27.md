# Agentic Design System: implementation status and continuation handoff

**Prepared:** 27 October 2026, Asia/Kolkata  
**Project:** `/Users/user/Documents/Agentic Design System`  
**Purpose:** Give another AI enough context to review the existing work, finish the remaining work, and verify it without restarting the project.

**Later onboarding update, 27 October:** The active onboarding/project task flow has since been reviewed across all 159 pages and improved. Read [the onboarding flow review](audit/onboarding-flow-2026-10-27/REVIEW.md) for the latest changes, screenshots, and passing verification. Overview now has persistent start/resume/continue actions; project setup has step navigation, draft-step recovery, review shortcuts and stale-save protection; the eight Foundations have an optional Save & continue sequence. The active Overview does not load the historical `overview.js` prototype, so do not treat those unused files as a second active project creator. This update does not complete live Figma verification or the broader component-contract migration described below.

## 1. Read this first

**Component customization audit follow-up:** The user clarified that missing detail-page customization is the main remaining concern. A separate [atomic component UX audit](audit/component-customization-2026-10-27/COMPONENT-CUSTOMIZATION-UX-AUDIT.md) now covers all 69 detail pages, 262 native configuration properties (including a secondary Avatar.Group control), and 626 representative changes. It records 48 property-level text-export omissions across 25 pages, 369 proposed component-specific capabilities, and 12 shared workflow improvements. These are audit findings and implementation proposals; this follow-up has not implemented the proposed controls or repaired those exports. Consult its evidence and backlog before treating the earlier passing smoke/prompt checks as proof of full customization parity.

The prompt audit and Project Setup/Foundation Save/Edit fixes are present. A component contract model, editor, portable HTML exporter, comparison workflow, local HTTP bridge, and Figma plugin implementation have also been added.

**The entire LinkedIn workflow is not yet proven complete.** The browser workflows pass the current automated checks. The Figma adapter has been tested with a simulated Figma API, not in a live Figma document. Most existing component pages still use their older preview, prompt, and code builders; the new editor does not yet replace those builders with saved contracts everywhere.

The most important remaining work is:

1. Verify and repair the plugin in real Figma, including manifest setup, variables, properties, variants, updates, existing instances, and pull-back changes.
2. Make the existing detail-page preview, prompt, code, and Figma actions consume the same authored contract consistently.
3. Replace generic DOM snapshots with explicit component definitions where behavior, responsive layout, slots, and state rules cannot be inferred reliably.
4. Harden the model, bridge recovery, comparison coverage, backup/recovery, and accessibility around the edge cases listed below.

This is a continuation handoff, not a claim that every component and every possible property combination has been certified. No deployment, publication, external invitation, or Git commit was made as part of this implementation pass.

**2026-10-27 continuation note:** three concrete, non-Figma-dependent bugs from section 16's P0 list were found, fixed, and covered by new regression tests in a follow-up pass the same day - see "Changed in this continuation pass" in section 13 and the updated P0 bridge-recovery checklist in section 16. Nothing was committed to Git in that pass either; live Figma verification still has not been attempted by any AI, since it requires an actual Figma Desktop session the automation here cannot drive.

### Current workspace facts

- The application is plain HTML, CSS, and JavaScript. There is no `package.json` and no framework build to start.
- Node and Python scripts provide tests and generated-file checks.
- There are currently **159 catalogued HTML pages**, including the new contract editor, and **69 component detail pages**.
- The latest contract feature changes are uncommitted: existing tracked files are modified and new source files are untracked. Do not use a reset or clean command to prepare the workspace.
- Earlier prompt and setup fixes were already in the tracked baseline at the start of the latest contract implementation pass. Do not confuse that earlier work with only the current Git diff.
- No development server was deliberately left running after verification.
- Browser data is local to its origin. `localhost`, `127.0.0.1`, different ports, and `file://` do not share the same local storage.
- This folder is the Agentic Design System project. Do not substitute the separate `DDOS` project.
- An older [ONBOARDING-HANDOFF.md](ONBOARDING-HANDOFF.md) describes a September local prototype. Its statement that the directory is not a Git repository is historical and does not describe the present workspace. Its Overview prototype boundaries still matter where that flow has not been replaced.

## 2. What the user asked for

### A. Prompt and preview consistency

Visit every component detail page, inspect how its prompt is written, compare the prompt with the displayed design, report mismatches, and fix the identified issues.

### B. Project Setup

Collect and save:

- Project name.
- Product type: what the user is creating.
- Platforms: where the product will be used.
- User name and email address.
- Designation.
- Role in this project.

Saved details must be editable later, with a clear save/edit flow.

### C. Foundation Setup

The user chooses Colors, Radius, Borders, Shadows, and an Icon family. Grid & Layout, Typography, and Spacing should start with recommendations based on Project Setup. Saved foundation settings must be editable later. Contextual defaults must not silently replace explicit saved choices.

### D. LinkedIn comparison and missing capabilities

The reference describes a component contract editor that:

- Authors text, Boolean, options, swap, slot, numeric, and event properties.
- Suggests conventions already used by the library.
- Authors anatomy, layout, and tokens.
- Edits component variants on a stage.
- Owns a platform-neutral JSON contract.
- Pushes native component sets, variants, properties, and variable bindings to Figma.
- Gives code agents that same specification.
- Reads an implementation back and compares it with the contract.
- Edits existing components as drafts and updates them while preserving linked instances.
- Supports Contract-led or Figma-led authoring.

The user's latest instruction is to document all work and all remaining tasks in a Markdown file so another AI can continue.

## 3. Reference recording and comparison basis

The referenced recording was found locally as:

```text
/Users/user/Desktop/Screen Recording 2026-10-27 at 3.20.28 PM.mov
```

The space before `PM` in that filename is a narrow non-breaking space. The recording is approximately 68.77 seconds, 3024 × 1702, and 58 MB. Frames were inspected locally; temporary extracted frames were placed in `/private/tmp/damco-linkedin-recording`. That temporary folder is not a required project dependency.

Observed in the recording: Filter Chip property authoring, anatomy and variant editing, different property categories, a stage, contract JSON, Figma Desktop Bridge controls, an existing Button with 47 variants, and editing an existing component as a draft.

The text post also claims code generation, reverse comparison, and instance-preserving updates. The short recording alone does not demonstrate all those claims. Our acceptance criteria must test these capabilities directly rather than assuming the reference proved them.

## 4. Status against the eight main gaps

| Gap | What exists now | Remaining boundary |
|---|---|---|
| Complete component contract | Versioned JSON model and schema; typed properties, anatomy, variants, tokens, behaviors, references, source ownership | Most legacy pages enter through a snapshot capture; not all components have fully authored logical definitions |
| Editable anatomy | Tree editing, add/remove/reparent/reorder, text and attribute bindings, layout styles and token selection | Complex conditions and some advanced structures require JSON; no Figma-style canvas manipulation |
| Property and behavior authoring | Seven property types, defaults, options, bindings, conditions, simple event-to-property rules | Event properties are descriptions, not complete framework callbacks; rich component logic is not inferred |
| Drafts and revisions | Saved/draft separation, explicit Save/Edit/Cancel, resume/discard, revision history, diff, cross-tab stale-save protection | Local-only storage; raw recovery and all-contract backup need work |
| One compiler for outputs | New editor preview and portable HTML use the same compiler; prompt embeds the exact contract; adapter uses compiled anatomy | Existing detail-page code/prompt/preview builders remain independent; no React/Vue/LWC/native generator |
| Figma synchronization | Local acknowledged job bridge plus plugin source for push/pull, variables, native properties, reusable instances, updates | Simulated-API verification only; live Figma setup and round-trip behavior remain unverified |
| Implementation comparison | Contract JSON diff, instrumented rendered-DOM comparison, URL capture tool | No arbitrary source-code parser or complete reverse compiler; visual, behavioral, and accessibility parity need broader coverage |
| Library suggestions and ownership | Deterministic suggestions from saved contracts/common properties; Contract/Figma ownership switch with push/pull restrictions | No learned naming engine; cross-application conflict and ownership-switch policy need deeper verification |

## 5. Earlier completed work: prompt audit and fixes

### Audit coverage and original findings

The original audit covered 69 detail pages, 63 detail scripts, and 974 property/option cases. It found affected behavior on 46 pages, grouped into eight defect categories:

| Category | Original issue | Implemented correction |
|---|---|---|
| Missing current properties | Prompts omitted current values on 32 pages, including Avatar.Group cases | Shared current-property JSON serialization in the Foundation runtime |
| Float Button focus | Primary focus prompt contained `Focused: undefined` | Defined focus output |
| Missing token dependencies | Some exports referenced CSS variables without their transitive definitions on 14 pages | Include referenced dependencies in exported token data |
| Stale focus colors | Hardcoded or outdated focus descriptions on 33 pages | Semantic focus-token descriptions |
| Stale shadows | Outdated shadow descriptions on six pages | Semantic shadow-token descriptions |
| Loading inventory | Loading missing from seven ordinary Button pages and Switch inventories | Correct state inventories |
| Dual-icon Loading | Prompt removed the label while the preview retained it | Correct loading instructions |
| Badge colors | Prompt said four color choices while the UI had five | Correct count |

Shared prompt preparation now includes the applied Foundation configuration and current properties. It avoids accumulating duplicate generated sections when an export is prepared again.

### Evidence and permanent regression checks

- [Original audit report](audit/prompt-review-2026-10-23/Damco-Prompt-Audit-2026-10-23.html).
- [Original findings JSON](audit/prompt-review-2026-10-23/findings.json).
- Original per-page data and screenshots: `audit/prompt-review-2026-10-23/`.
- Post-fix evidence: `audit/prompt-fix-verification-2026-10-23/`.
- Permanent regression script: [tools/check-component-prompts.cjs](tools/check-component-prompts.cjs).
- Latest regression output: [prompts/regressions.json](audit/component-contract-2026-10-27/prompts/regressions.json): **69 pages, 161 checks, pass**.

The original audit ZIP is also at `/Users/user/Documents/Damco-Prompt-Audit-2026-10-23.zip`.

### Prompt work still requiring a product decision or deeper verification

- Approximately 50 pages can still ask the recipient what size/radius they want when default selections are in use. This was recorded as a workflow gap rather than one of the eight confirmed mismatch categories. Decide whether default selection should be treated as an explicit choice; then update the contract and UI consistently.
- Automated checks prove the assertions they contain. They do not prove that an external AI generated an exact implementation for every prompt.
- No external AI application was generated from every component prompt as an acceptance test.
- The older prose-based builders and the new contract prompt still coexist. Their consolidation is an important remaining task.

## 6. Earlier completed work: Project Setup and Foundation

### Project Setup behavior

Relevant files: [project-model.js](project-model.js), [experience.js](experience.js), [new-project.html](new-project.html).

- New saves require all requested project and identity fields.
- The project model's newer profile shape supports those identity fields while continuing to read older profiles.
- Existing storage keys remain `ads:project-profile:v1` and `ads:project-draft:v1`; a key suffix is not the same thing as the version of the object stored inside it.
- Save shows a saved summary; Edit starts changes; Cancel keeps the saved version; drafts can be resumed.
- Validation applies to the current setup step and final save.
- Older profiles can be read without inventing missing identity data; editing/saving them requires the newer required details.

### Foundation defaults and persistence

Relevant files: [foundation-model.js](foundation-model.js), [foundation-runtime.js](foundation-runtime.js), [foundation-contract.json](foundation-contract.json), [foundation.css](foundation.css), and [shell.js](shell.js).

- Grid & Layout, Typography, and Spacing resolve contextual recommendations from the project.
- Explicit saved settings take precedence over recommendations.
- A mobile context includes a four-column grid recommendation and a 30 px H1 recommendation.
- Radius remains an explicit user choice. The default is the balanced/medium 8 px setting; project context does not silently choose a radius.
- The shared editor controller covers eight editors: Colors, Grid & Layout, Typography, Spacing, Radius, Borders, Shadows, and Icons.
- Selecting values previews a draft. Save commits validated records and locks the saved controls. Edit unlocks them. Cancel returns to saved settings.
- `ADSStorage.safeSet` and `safeRemove` cooperate with draft staging.
- Multi-record save failure attempts to restore the previous records instead of leaving a partially saved set.
- Corrupt, invalid, or future-version records are preserved until explicitly backed up/reset.
- Explicit reset authorization remains effective when a user selects a new value after resetting an unreadable record.
- Changes from another tab block stale editor controls and require reload.
- Unit selection is a display preference; it is not treated as the same staged Foundation transaction.
- Backup/restore uses an explicit persistence path instead of accidentally staging the restore as an unsaved preview.

The eight editors group nine Foundation subjects when Grid and Layout are counted separately. Keep the UI grouping and exported inventory clear rather than inferring a missing editor from that count.

### Setup verification

[tools/check-setup-flow.cjs](tools/check-setup-flow.cjs) exercises real browser changes across the eight editors and checks persistence after reload. It also covers required project details, editing/cancel, invalid grid input and correction, backup/restore, failed writes, and rollback.

The latest run passed; see [setup.log](audit/component-contract-2026-10-27/setup.log). Some screenshots from this script still write into the historical `audit/setup-flow-2026-10-23/` folder, including `spacing-save-failure.png`. That is a test-output path, not a new product asset.

### Related older Overview work

The earlier Overview supports a clearly labeled local project/resource prototype. It does not establish actual NPM publishing, email invitation delivery, hosted resource generation, or server-enforced team permissions. Review [ONBOARDING-HANDOFF.md](ONBOARDING-HANDOFF.md) and `audit/onboarding/` before changing that journey. The Overview and newer Project Setup should be checked together for consistency; do not assume their historical data models are fully consolidated.

## 7. New contract architecture

```text
Existing component detail page
  └─ capture current props, tokens, and rendered configurations
       └─ Component Contract Editor
            ├─ model validation / draft / save / revision diff
            ├─ compile → DOM stage
            ├─ same compile + renderer → portable HTML
            ├─ exact JSON → implementation prompt / JSON export
            ├─ compare → JSON or instrumented rendered HTML
            └─ local HTTP job bridge ↔ Figma development plugin
```

### Model and public APIs

[component-contract-model.js](component-contract-model.js) is dependency-free and works as `window.ADSComponentContract` or a CommonJS module. It exports:

```text
VERSION, PREFIX, TYPES, TAGS,
id, clone, validate, assert, compile, diff,
read, draft, save, discard, blank, suggestions, prompt
```

[component-contract.schema.json](component-contract.schema.json) is the Draft 2020-12 interchange schema. The JavaScript validator additionally checks relationships between IDs, property values, token references, and other semantic constraints. Do not assume the schema alone performs all model validation.

### Contract fields

| Field | Purpose |
|---|---|
| `schemaVersion` | Current component contract version: `1` |
| `id` | Stable component identity |
| `revision` | Nonnegative saved revision; a new draft starts at zero |
| `name` | Human-readable component name |
| `authority` | `contract` or `figma` authoring source |
| `context` | Optional theme, unit, and writing direction snapshot |
| `source` | Optional origin page, capture kind, notes, selected combinations |
| `properties` | Stable IDs, names, types, defaults, option values, optional numeric constraints |
| `selection` | Configured preview instance values, separate from property defaults |
| `anatomy` | Tree of stable part IDs, tags, kinds, styles, bindings, conditions, and children |
| `variants` | Conditions plus overrides targeting stable part IDs |
| `tokens` | CSS custom-property names and string values needed by the definition |
| `references` | Embedded reusable component contracts, keyed by reference ID |
| `behaviors` | Simple click/change/input rules that update a property |
| `accessibility` | Written accessibility requirements; not proof that they are all enforced |
| `adapters` | Platform-specific metadata such as Figma variable/component mappings |

Supported property types: `text`, `boolean`, `options`, `number`, `swap`, `slot`, `event`.

Anatomy kinds: `container`, `text`, `icon`, `slot`, `instance`, `shape`. Allowed element tags are enumerated in the model/schema. Arbitrary script tags, event-handler attributes, unsafe style fragments, and reserved prototype keys are rejected by current validation.

### Minimal example

This example demonstrates the core format. It is not a full accessible toggle-button implementation: a real toggle should also bind its pressed state and implement its intended keyboard semantics.

```json
{
  "schemaVersion": 1,
  "id": "example-action",
  "revision": 0,
  "name": "Example action",
  "authority": "contract",
  "properties": [
    { "id": "label", "name": "Label", "type": "text", "default": "Continue" },
    { "id": "showLabel", "name": "Show label", "type": "boolean", "default": true }
  ],
  "selection": { "label": "Continue", "showLabel": true },
  "anatomy": {
    "id": "root",
    "name": "Action",
    "kind": "container",
    "tag": "button",
    "attributes": { "type": "button", "aria-label": "Continue" },
    "styles": {
      "display": "inline-flex",
      "gap": "var(--space-example)",
      "padding": "12px"
    },
    "children": [
      {
        "id": "label",
        "name": "Label",
        "kind": "text",
        "tag": "span",
        "bind": "label",
        "styles": {},
        "visibleWhen": [{ "property": "showLabel", "equals": true }]
      }
    ]
  },
  "variants": [],
  "tokens": { "--space-example": "8px" },
  "behaviors": [
    { "target": "root", "event": "click", "property": "showLabel", "value": "$toggle" }
  ],
  "accessibility": ["Keep an accessible name when the visible label is hidden."],
  "adapters": { "figma": { "variableMap": {} } }
}
```

### Compiler semantics that future changes must preserve or explicitly migrate

- Effective property values are defaults, then stored `selection`, then supplied selection overrides.
- All matching variants apply in array order. There is no specificity ranking; later matching overrides can win.
- Style patches merge. Other nested override maps are not all deeply merged across matching variants; review this before adding complex overlapping rules.
- `visibleWhen` conditions are combined with AND. A multiple-choice property can match a condition by inclusion. `not` inverts a condition.
- A null attribute override removes the attribute; a null style-binding override disables that binding.
- Numeric style bindings become pixels except unitless properties such as opacity, font weight, flex growth/shrink, order, and z-index.
- Native buttons acquire appropriate disabled/loading attributes for the recognized state properties. This is not a generic behavior engine for all widget types.
- Embedded references compile recursively and receive scoped part IDs such as `instance--child`.
- `includeHidden: true` keeps conditional parts in the compiled structure for adapters such as Figma.
- The compiler is kept self-contained so its exact function can be included in portable HTML exports.

### Validation limits

Current bounds include 80 properties, 256 variants, 1,500 anatomy nodes, 24 anatomy levels, 40 JSON nesting levels, five embedded-reference levels, and bounded token-reference chains. These are safeguards, not tested performance guarantees at every limit. See the hardening backlog before expanding them.

## 8. Component storage, drafts, and revisions

One local-storage key per component:

```text
ads:component-contract:<component-id>
```

Record shape:

```json
{
  "schemaVersion": 1,
  "saved": null,
  "draft": null,
  "history": []
}
```

Actual non-null values are full contracts.

- Save validates the contract, checks the expected saved revision, increments it, retains up to 30 prior saved versions, clears the draft, then writes the record.
- Drafts are separate from saved contracts. Cancel/discard clears the draft without replacing the saved contract.
- Restoring a historical version creates a new saved revision; it does not rewrite history in place.
- Stale saves from another tab are rejected. The editor also listens for storage changes.
- Invalid JSON and unsupported future storage records are preserved by throwing an error instead of silently migrating or overwriting them.
- The editor autosaves valid drafts after a short debounce, approximately 250 ms. Invalid edits are not necessarily persisted as drafts.
- Opening the editor from a detail page preserves an existing saved/draft contract rather than overwriting it with a fresh page capture.

**Remaining:** There is no unified raw component-record backup/recovery/reset UI. The Foundation backup's static key list does not include all `ads:component-contract:*` records. A complete user backup/export needs to include contracts, revisions as appropriate, embedded references, and relevant assets.

## 9. Contract editor and runtime: implemented behavior

### Editor files

- [component-editor.html](component-editor.html): page structure and shared application shell.
- [component-editor.css](component-editor.css): editor layout and responsive styles.
- [component-editor.js](component-editor.js): authoring controller, local persistence, import/export, comparison, and bridge calls.
- [component-contract-runtime.js](component-contract-runtime.js): capture, render, export, inspection, and detail-page entry point.

### Authoring controls

- New component, name, stable ID, authoring source, saved-contract list.
- Save/Edit/Cancel, draft resume/discard, history restore, and diff.
- Add/remove properties and edit names, types, defaults, and option values.
- Suggestions from common properties and saved library contracts.
- Stage controls for current property values.
- Select a variant, save current values as a variant, remove variants, and edit selected variant styles.
- Anatomy tree: add/remove/reparent/reorder parts, choose kind/tag, bind text and attributes, set visibility conditions.
- Layout/style inputs with Foundation token suggestions and dynamic bindings for common dimensions.
- Reusable references from embedded contracts or saved components.
- Simple declarative event rules.
- Advanced JSON editing for fields that do not have dedicated controls.
- JSON import/export, portable HTML download/copy, and prompt copy.
- HTML/JSON implementation comparison.
- Figma push and pull with source-ownership restrictions and saved-revision checks.
- Accessible labels for dynamic controls, cross-tab stale state blocking, and layout checks at desktop/mobile widths.

### Runtime and code export

`ADSContracts.mount(root, contract, selection)` uses the model compiler to build native DOM safely and apply tokens. It supports allowed SVG tags, declarative events, stable part IDs, and focus restoration after interaction-driven rerenders. Interactions emit `ads:component-interaction`.

`ADSContracts.code(contract)` creates portable HTML with:

- Static instrumented markup.
- Embedded escaped contract JSON.
- The same compiler and renderer functions used by the stage.
- Token snapshot, direction, basic page styling, and reduced-motion spinner handling.

This is a configured, standalone web implementation. It is not a complete generated framework component package with a public callback API or every responsive/native-platform adaptation.

### Suggestions

Suggestions are deterministic. They combine common fields with saved library property definitions, deduplicate by property ID, exclude existing IDs, and show a bounded list. No external AI model, embeddings service, or trained library-naming engine was connected.

## 10. Capturing existing detail pages

All 69 detail pages now load the contract model/runtime and receive an **Edit component contract** entry point. Current properties include multiselect controls, which the older thin Figma payload did not fully capture.

### Authored ordinary Button definition

Seven pages use a richer reusable Button capture path:

```text
button-primary.html
button-secondary.html
button-tertiary.html
button-ghost.html
button-neutral.html
button-link.html
button-destructive.html
```

This definition covers eight appearances, six states, eight sizes, five content arrangements, five radius choices, label/accessible-label properties, loading behavior, and reusable plus/arrow/settings icon contracts. It uses semantic Foundation bindings for important typography, spacing, border, and color values.

The capture results currently show 11 properties and 62 authored rules per ordinary Button page. Those 62 rules are composable conditional definitions, not a promise to materialize every cross-product combination as a Figma master.

`button-primary-icon.html` follows the generic capture path, not the ordinary Button path.

### Generic capture for the other 62 pages

- Reads rendered configurations from the current page matrix.
- Captures DOM anatomy and computed styles, retaining some resolvable inline token references.
- Infers text/attribute bindings from current values.
- Unions parts across rendered cells and derives variant deltas for styles, attributes, text, tags, and visibility.
- Keeps selected configuration context and capture notes.
- Caps captured nodes per rendered cell and variant counts to avoid unlimited expansion.
- Uses the first/root preview as a fallback where a matrix is unavailable.

**This is an import starting point.** It does not infer complete component logic, all unrendered combinations, responsive breakpoints, keyboard patterns, validation behavior, overlay positioning, asynchronous data, or arbitrary slot semantics. Captured literal computed styles can lose the original design intent and token relationship. The source notes warn that properties beyond the captured configurations need authored bindings or variant rules.

### Major incomplete migration

The old `*-detail.js` preview/prompt/code builders still exist. Saving a contract in the new editor does not automatically rewrite every legacy preview and every older Copy Code/Copy Prompt action. Some ordinary Button logic and icon path data are still duplicated between old builders and capture code.

The next AI should build explicit component definitions/adapters and progressively route these outputs through them. Avoid deleting all existing builders before the replacement has parity evidence. Preserve useful existing token and Foundation behavior during migration.

## 11. Implementation comparison

### Available comparison paths

1. Import a contract JSON and compare fields using stable-ID diffs.
2. Import rendered HTML and compare it with the expected compiled DOM.
3. Capture an actual running component with [tools/inspect-component.cjs](tools/inspect-component.cjs), then import that captured HTML.

Expected instrumentation:

```html
<div data-ads-component="component-id"
     data-ads-values='{"label":"Continue"}'>
  <button data-ads-part="root">
    <span data-ads-part="label">Continue</span>
  </button>
</div>
```

Exports also carry revision/kind metadata. Stable part IDs allow useful comparisons after names change.

### What is compared

- Configured property values.
- Expected part presence, tag, text, and declared attributes.
- Input value and checked state.
- Computed values of styles declared by the contract.
- Expected parent relationship and direct part order.
- Extra marked parts.

HTML is stripped of scripts, embedded browsing/plugin objects, event handlers, dangerous/external URL paths, and CSS imports/URLs before being displayed in a scriptless sandboxed frame. A browser regression verifies that an uploaded script does not execute. Keep testing this boundary as import support changes.

### Limits

This is not arbitrary source-code reverse engineering. Uninstrumented React/Vue/etc. code is not parsed into a full contract. It does not prove all interactions, responsive breakpoints, pixel fidelity, accessibility, duplicate-marker handling, unexpected attributes, generated content, or every asset state. A passing comparison only covers the current instrumented rendering and implemented assertions.

## 12. Local Figma bridge and plugin

### Files

| File | Responsibility |
|---|---|
| [tools/component-bridge.cjs](tools/component-bridge.cjs) | Local static server, job queue, push/pull endpoints, completed-result acknowledgment |
| [figma-plugin/manifest.json](figma-plugin/manifest.json) | Development plugin declaration and local network destination |
| [figma-plugin/adapter.js](figma-plugin/adapter.js) | Contract ↔ Figma node/property/variable conversion |
| [figma-plugin/main.js](figma-plugin/main.js) | Plugin main-thread message handling |
| [figma-plugin/ui.html](figma-plugin/ui.html) | Local polling, job delivery, result reporting, pause/resume |
| [figma-plugin/code.js](figma-plugin/code.js) | Generated bundle; do not hand-edit |
| [tools/build_figma_plugin.cjs](tools/build_figma_plugin.cjs) | Generate or freshness-check the plugin bundle |
| [figma.html](figma.html) | Updated user-facing setup/capability instructions |

### Protocol

Default endpoint: `http://127.0.0.1:3333`.

| Endpoint | Behavior |
|---|---|
| `GET /bridge/status` | Protocol version, recent plugin polling status, pending count |
| `GET /bridge/next` | Plugin polls for the next push/pull job |
| `POST /bridge/result` | Plugin reports completion/error for a job ID |
| `POST /contracts/push` | Validate and queue a full Contract-led contract |
| `POST /draw` | Alias for full-contract push |
| `POST /contracts/pull` | Queue a Figma-led pull by component ID |

The request waits for a completed plugin result instead of claiming success when a job is merely queued. Errors include validation/source conflicts, full queue, missing/expired jobs, plugin failure, and timeout. Current bounds are 20 pending jobs, approximately 35 seconds per bridge request, and an 8 MB body limit. The website allows about 40 seconds for a push.

The queue is in memory. Restarting the bridge discards pending jobs. It binds to `127.0.0.1`, serves restricted project file types/paths, and accepts local/null origins for the website/plugin workflow. It is not a public authenticated sync server.

The server supports `ADS_BRIDGE_PORT`, but website and plugin endpoints still contain port 3333. Changing only the environment variable does not reconfigure the whole system.

### Source ownership

- Contract-led components can be pushed from a saved revision.
- Figma-led components are pulled into reviewable local drafts.
- Switching ownership is an explicit contract edit/save action.
- A plugin revision check rejects some attempts to overwrite newer Figma content.

This does not yet provide a distributed transaction or a complete merge policy for simultaneous browser/Figma edits.

### Push implementation

- Finds linked masters/sets and stores stable contract/part metadata.
- Creates native component sets and materializes authored variant configurations.
- Creates/binds native text, Boolean, instance-swap, and variant properties where applicable.
- Uses local/explicitly mapped variables and a plugin-owned collection for newly created token variables; avoids overwriting an existing library's variable values casually.
- Builds common layout, text, color, border, radius, shadow, and SVG structures.
- Uses reusable component masters/instances for references and slots.
- Separates component property defaults from the configured preview instance.
- Attempts to update linked components while retaining their identities.
- Retains removed variant masters hidden to preserve existing linked instances.
- Warns about approximations and potentially affected child overrides.
- Stores contract metadata in chunks to avoid a single oversized plugin-data value.

### Pull implementation

- Reads actual Figma properties, nodes, layout, text, styles, variable mappings, and variant values.
- Can start from a linked component or selected existing local component/master set.
- Reconstructs logical property IDs and stable part IDs where available.
- Reads additions/removals/order and property changes, rather than returning only the original stored JSON.
- Uses asynchronous variable APIs and creates a Figma-led reviewable draft locally.

### Live Figma setup still required

The manifest currently contains the placeholder ID:

```text
damco-contract-bridge-development
```

It has not been verified as a valid importable Figma development-plugin ID. Create/import a real development plugin, retain Figma's assigned ID where required, and verify the manifest/network configuration in the installed Desktop version. Do not claim the plugin has been installed or run in the user's actual file.

Then build the bundle, run the local bridge, open the site from the same local origin, start the plugin, and test the full workflow below.

Relevant official API references for that review: [component properties](https://developers.figma.com/docs/plugins/working-with-component-properties/), [combining variants](https://developers.figma.com/docs/plugins/api/properties/figma-combineasvariants/), [ComponentNode](https://developers.figma.com/docs/plugins/api/ComponentNode/), and [manifest configuration](https://developers.figma.com/docs/plugins/manifest/).

## 13. File inventory for the latest implementation

### New source files

```text
component-contract-model.js
component-contract.schema.json
component-contract-runtime.js
component-editor.html
component-editor.css
component-editor.js
figma-plugin/manifest.json
figma-plugin/adapter.js
figma-plugin/main.js
figma-plugin/ui.html
figma-plugin/code.js                    [generated]
tools/component-bridge.cjs
tools/build_figma_plugin.cjs
tools/inspect-component.cjs
tools/check-contract-editor.cjs
tools/verify-contract-release.cjs
tests/component-contract.test.cjs
tests/component-figma.test.cjs
IMPLEMENTATION-HANDOFF-2026-10-27.md     [this document]
```

### Existing source files changed

| File/group | Change |
|---|---|
| All 69 detail-page HTML files | Load contract model/runtime and expose editor entry path |
| `experience.js` | Component contracts navigation; gallery Figma actions capture a full detail-page contract |
| `foundation-runtime.js` | Full contract Figma payload; prevent generic typography/read-more rewriting inside contract render roots |
| `shell.js` | Full-contract bridge push, offscreen detail-page capture, completed-result validation |
| `figma.html` | Real local bridge instructions and documented capabilities/limits |
| `tests/foundation-model.test.cjs` | Page inventory expectations include editor rather than hardcoding the old 158-page count |
| `tools/release_check.sh` | Plugin-bundle freshness gate alongside existing release checks |
| `tools/check-site-health.cjs` | Configurable audit output directory |

### Changed in this continuation pass (2026-10-27, after the above)

| File | Change |
|---|---|
| `figma-plugin/ui.html` | Fixed the stuck-polling bug: a terminal `/bridge/result` rejection now clears `pendingResult`/`busy` and reports accurately, instead of being treated like a retryable network failure forever |
| `shell.js` | `ADSFigmaBridge.draw()` now surfaces the bridge's own rejection message (validation/queue/timeout/plugin error) instead of always claiming "could not reach" |
| `component-contract-runtime.js` | A `$value` behavior on a `number` property now coerces the DOM's raw string through `Number()` before it reaches compiled values, so `equals:`/variant conditions on that property keep matching after user interaction |
| `tests/component-contract.test.cjs` | Added a stale-result assertion to the existing bridge test, plus a new queue-exhaustion (429) test |
| `tests/shell-figma-bridge.test.cjs` [new] | Loads the real `shell.js` in a minimal DOM-stub `vm` sandbox and exercises `ADSFigmaBridge.draw()` directly |
| `tests/component-contract-runtime.test.cjs` [new] | Loads the real `component-contract-runtime.js` the same way and exercises the `$value` coercion fix |

All three fixes above were verified by confirming their new tests fail against the pre-fix source (reverted, re-run, restored) before being left in place - not just that they pass against the fixed code. `bash tools/release_check.sh` passes on the resulting source state.

### Regenerated files and test artifacts

```text
docs-catalog.json
docs-catalog.js
docs-catalog-manifest.json
audit/page-inventory.json
audit/page-inventory.md
audit/component-contract-2026-10-27/**
audit/setup-flow-2026-10-23/spacing-save-failure.png
```

Generated inventory now records 159 pages. Not every untracked file in the repository was created by this latest pass: historical audit data may already have been untracked. Review actual file contents and Git status before staging a future commit.

## 14. Verification performed and evidence

### Full browser/release orchestration

[verification.json](audit/component-contract-2026-10-27/verification.json) records a passing full orchestration on 27 October:

| Suite | Recorded result | Scope |
|---|---|---|
| Contract editor | Pass | 69 validated page captures and eight browser workflow groups |
| Release gate | Pass | Unit suites and generated-file freshness |
| Project/Foundation setup | Pass | Save/edit/cancel, real value persistence, validation, restore, failed writes |
| Component prompts | Pass | 69 pages and 161 regression checks |
| Site health | Pass | 159 pages × four widths = 636 viewport checks, 208 guide toggles, four recovery checks |

The site-health widths were 1440, 768, 390, and 320 px. Its results record no errors or missing local assets in its checked scope. That is not a complete manual visual or assistive-technology audit.

After that full run, Figma paint conversion was improved to preserve translucent values/short hex forms, an eighth Figma fixture test was added, and the bridge's request-body decoding was changed to concatenate byte buffers before decoding UTF-8. The complete release gate was then run again successfully on the final source state:

- [final-release.log](audit/component-contract-2026-10-27/final-release.log): **PASS**.
- Generated token count: **624**; token, Foundation, contract-doc, page-inventory, and plugin-bundle freshness checks passed.
- The complete browser orchestration was not rerun after those last adapter/body-decoding changes. The final release gate includes the adapter and bridge unit tests.

### New unit tests

[tests/component-contract.test.cjs](tests/component-contract.test.cjs) has nine tests covering:

1. Typed properties, conditions, variants, and behavior compilation.
2. Draft/cancel/revision and stale-save behavior.
3. Future/malformed storage preservation.
4. Invalid references, tokens, executable attributes, future schema, and reserved keys.
5. Stable-ID/order-aware diff.
6. Library suggestion reuse.
7. Embedded reference scoping.
8. Attribute bindings and token cycles.
9. HTTP bridge completion, validation, timeout, and CORS behavior.

[tests/component-figma.test.cjs](tests/component-figma.test.cjs) has eight simulated-API tests covering:

1. Variant masters, token bindings, native text property, and stable component identity on update.
2. Pulling actual text/layout changes.
3. Source ownership and newer-revision rejection.
4. Importing/updating an existing local master while preserving its component ID.
5. Anatomy add/remove/order.
6. Shared reusable instances and slots.
7. Property rename/removal while retaining logical IDs.
8. Translucent fills/strokes and short hex/RGBA conversion.

These tests model API behavior. They are not evidence that real Figma preserves every instance override.

### Contract editor browser groups

- Capture/validate all 69 detail pages, including multiselect definitions.
- Button state changes, shared contract prompt/preview, save/lock, draft resume, cancel.
- Behavior rules, conditional parts, variant style overrides, reusable references.
- Property/anatomy editing and restoration as a new revision.
- Portable HTML matching expected rendered DOM.
- Drift detection by part and non-execution of an imported script.
- Full contract push acknowledgment and source-controlled pull using a mocked HTTP responder.
- Cross-tab stale-save blocking and responsive editor layout.

**The browser push/pull test mocks the bridge response.** The HTTP bridge and plugin adapter are tested separately. A live end-to-end browser → local bridge → Figma → local draft run remains outstanding.

### Useful artifacts

- [Contract workflow results](audit/component-contract-2026-10-27/results.json).
- [Desktop editor screenshot](audit/component-contract-2026-10-27/editor-desktop.png).
- [Mobile editor screenshot](audit/component-contract-2026-10-27/editor-mobile.png).
- [Generated Button HTML fixture](audit/component-contract-2026-10-27/button.html).
- [Site-health results](audit/component-contract-2026-10-27/site-health/results.json).
- [Prompt regression results](audit/component-contract-2026-10-27/prompts/regressions.json).
- Per-suite logs in `audit/component-contract-2026-10-27/`.

External font requests were blocked in browser verification. Missing remote fonts therefore remain a real-world visual-parity consideration even when the local asset checks pass.

## 15. How the next AI can run and verify the project

### Start a local preview and bridge

```sh
cd '/Users/user/Documents/Agentic Design System'
node tools/build_figma_plugin.cjs
node tools/component-bridge.cjs
```

Open `http://127.0.0.1:3333/component-editor.html` or a detail page such as `http://127.0.0.1:3333/button-primary.html`.

The server runs in the foreground until stopped. A plugin must be configured and running in Figma for real push/pull completion. Do not mistake a healthy static site for a connected Figma session.

### Fast release gate

```sh
bash tools/release_check.sh
```

This checks every unit suite, token generation, Foundation generation, contract docs, page inventory, and the generated Figma bundle. It now checks failing process exits, not only text that happens to look like a failed TAP assertion.

### Browser checks

Browser tools use `playwright-core` via `ADS_PLAYWRIGHT_PACKAGE` and a Chrome executable. On the current machine the discovered package was:

```text
/private/tmp/claude-501/-Users-user-Documents/2c7bf700-ff49-4064-918f-85f5d9948fc4/scratchpad/vt/node_modules/playwright-core
```

That temporary installation may disappear. It is not a committed project dependency. Use an available installation, or provision one according to the environment's permissions; do not assume the historical path always exists.

```sh
export ADS_PLAYWRIGHT_PACKAGE='/path/to/playwright-core'
export ADS_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
node tools/verify-contract-release.cjs
```

Or run the browser suites individually:

```sh
node tools/check-contract-editor.cjs
node tools/check-component-prompts.cjs
node tools/check-setup-flow.cjs
node tools/check-site-health.cjs
```

The orchestration script writes to `audit/component-contract-2026-10-27/`. Its dated output folder is currently hardcoded. Preserve earlier evidence if generating a new audit date. `ADS_CONTRACT_FLOWS_ONLY=1` reduces captures during development; do not use that reduced mode as evidence of full 69-page coverage.

Some checks start a local HTTP listener. Chrome launch and local port binding required an approved escalated shell invocation in the current sandbox. If permission is needed, request it through the tool rather than bypassing it.

### Regenerate after changing source contracts/inventory/plugin

```sh
python3 tools/generate_tokens.py
python3 tools/generate_foundation.py
python3 tools/generate_contract_docs.py
python3 tools/audit_pages.py
node tools/build_figma_plugin.cjs
bash tools/release_check.sh
```

Run only the generators relevant to the source changes, then the release check. Do not hand-edit generated model defaults, catalogs, or plugin bundles to silence a freshness check.

### Capture a real implementation

With the target application already running and instrumented:

```sh
node tools/inspect-component.cjs \
  'http://127.0.0.1:3333/a-component-page.html' \
  '#component' \
  '/private/tmp/component-snapshot.html'
```

Use the actual component URL/selector. The example page name above is a placeholder, not a file that has been created. This captures a rendered element; it does not parse framework source.

## 16. Prioritized remaining work

The items below distinguish visible implementation limitations from suspected edge cases. Do not report every review candidate as a reproduced user bug before testing it.

### P0: prove and repair live Figma operation

- [ ] Replace/verify the placeholder development-plugin identity and validate Desktop import/network settings.
- [ ] Push a saved ordinary Button through the real local bridge. Inspect native component properties, variant masters, variable bindings, anatomy, and configured preview instance.
- [ ] Create at least two real instances. Override text, a swap/slot, and a supported visual property. Update the contract and verify component identity, instance links, and intended overrides survive.
- [ ] Rename/remove properties, rename/reorder/add/remove parts, and change reference selections. Verify actual Figma behavior and record expected override limitations.
- [ ] Pull real text, spacing, color, property, token, part-order, and variant edits into a reviewable Figma-led draft. Review its diff, save, export, and compare.
- [ ] Import an existing local master and component set with no metadata. Confirm the import does not replace the master ID unexpectedly.
- [ ] Verify all plugin APIs with `documentAccess: dynamic-page`, actual variable modes, imported library variables, fonts, and component-property ID rename semantics.
- [ ] Capture evidence in a separate dated audit. Fix real API failures before describing this as production-ready synchronization.

### P0: bridge result recovery

**Code-inspection finding, fixed and covered by a Node-level regression test (not yet reproduced in real Figma):** `figma-plugin/ui.html`'s `deliver()` used to retain both `pendingResult` and `busy` whenever `/bridge/result` rejected a completed job (404 "expired or already completed"), because a non-OK response and a genuine network failure both fell into the same `catch` block. Polling then retried the dead result forever and the `if(!busy)` gate blocked `/bridge/next` from ever being polled again - the plugin went permanently silent after one stale/duplicate/late result. Fixed 2026-10-27: `deliver()` now only keeps retrying on an actual `fetch()` failure (bridge unreachable); any response the server actually sent back - 404 expired/duplicate, or any other rejection - is treated as terminal, clears `pendingResult`/`busy` immediately, and reports "Figma may already have applied the change; check Figma before retrying" instead of staying stuck or implying nothing happened.

- [x] Distinguish retryable network failures from terminal job rejection. Fixed in `figma-plugin/ui.html`'s `deliver()`.
- [x] Show whether Figma changes may already have completed after the browser timed out. The terminal-rejection status message now says so explicitly.
- [x] Test duplicate/expired result delivery and queue exhaustion. See `tests/component-contract.test.cjs` ("plugin UI treats an expired/duplicate result as terminal and resumes polling instead of getting stuck", "bridge reports a full queue instead of accepting unbounded pending pushes") - the first test is run against the real `ui.html` source via a `vm` sandbox, and was confirmed to fail against the pre-fix code before the fix was applied.
- [ ] Test bridge restart, editor cancellation, paused polling, and delayed plugin completion beyond what the above cover.
- [x] Review result metadata validation and late completion. A timed-out job is not a transaction rollback. A late plugin completion after the website's own 40s timeout now hits the same terminal path above and reports accurately rather than silently failing or double-applying.
- [ ] Make port configuration consistent across server, website, plugin UI, and manifest. Still open - not attempted in this pass; see the note below.
- [x] Return useful plugin/validation errors in website actions; several older shell error messages are generic. Fixed in `shell.js`'s `ADSFigmaBridge.draw()`: it used to report "Could not reach the Figma Bridge Plugin" even when the bridge was reached and rejected the push (409 wrong authority, 429 queue full, 504 timeout, 422 plugin error) - it now surfaces the bridge's own `error` message in both the button title and the status region, and only falls back to the generic reachability message on an actual `fetch()` failure. Covered by the new `tests/shell-figma-bridge.test.cjs` (loads the real `shell.js` in a minimal DOM-stub `vm` sandbox; confirmed to fail against the pre-fix code).

Port configuration note: a real fix needs a single source of truth the server, the website pages, and the Figma plugin's own UI/manifest can all read, but the plugin UI (`figma-plugin/ui.html`) and `manifest.json`'s network allowlist are static files Figma loads directly with no build step and no access to the website's environment variables - there isn't a clean way to thread one `ADS_BRIDGE_PORT` value through all four surfaces without either a build step for the plugin or a documented multi-port allowlist. Left as a known, documented gap rather than a quick patch; flagging for the next AI or the user to decide an approach before touching it.

**Also fixed in this pass, found while reading `component-contract-runtime.js` for the above (not on the original P0 list but the same class of defect):** a `$value` behavior on a `number`-type property received the raw DOM string from `event.target.value` unconverted. Any `visibleWhen`/variant `when` condition keyed on that property's numeric value (an `equals:` comparison) would silently stop matching the moment a user interacted with the bound input, because `equal()` compares via `JSON.stringify` and `"42"` never equals `42`. Fixed: the event handler now coerces the raw value through `Number()` when the target property is declared `number`, and falls back to the prior value (not `NaN`) when the input is a genuinely non-numeric intermediate string (e.g. `"-"` mid-keystroke). Covered by `tests/component-contract-runtime.test.cjs` (loads the real `component-contract-runtime.js` in a DOM-stub `vm` sandbox; both tests confirmed to fail against the pre-fix code).

### P1: complete the single-contract migration

- [ ] Define a stable authored contract registry for components rather than regenerating all intent from rendered DOM.
- [ ] Route detail-page preview, prompt, HTML/code export, and Figma actions through the same resolved contract/revision.
- [ ] Decide how saved contract overrides relate to the original library definition, Foundation updates, and project selection. Avoid silently overwriting edits during capture.
- [ ] Migrate the seven ordinary Buttons first and remove duplicated appearance/state/icon logic only after parity checks.
- [ ] Then migrate inputs/selection controls, feedback, navigation, overlays, complex data widgets, and the remaining generic captures.
- [ ] Give each component explicit anatomy IDs, property semantics, conditional parts, default values, variant rules, semantic token bindings, keyboard behavior, and accessibility requirements.
- [ ] Resolve the default size/radius prompt question consistently.
- [ ] Add tests that mutate properties and compare real outputs, not merely tests that capture and validate a JSON shape.
- [ ] Update the component capture inventory below as each page moves from snapshot import to authored definition.

### P1: Figma conversion fidelity and round-trip correctness

Existing limitations requiring improvement/acceptance decisions:

- CSS Grid is approximated; the plugin is not a complete browser layout engine.
- Complex gradients, images, transforms, clipping, outlines, percentages, `calc()`, `color-mix()`, and some relative units are not faithfully represented.
- Alpha is now preserved in covered push paint paths, but pull-side paint serialization should be checked for opacity loss.
- Changes that exist only in a non-first variant may not be fully represented by the reconstructed base anatomy.
- Pull can add concrete materialized variant definitions beside existing abstract rules. Test repeated push/pull for rule growth, precedence changes, and the 256-variant limit.
- Replacing part kinds can affect child overrides even if a component master ID is retained.
- Deleted styles and old variable/property bindings may not all be cleared.
- Reusable reference changes need a real `INSTANCE` swap/update test; do not assume a new reference value updates every existing instance correctly.
- A Figma-imported frame does not by itself imply native HTML button/input semantics or application callbacks.

Review candidates, not yet confirmed by a targeted failure test:

- [ ] Percentage/relative dimensions handled with `parseFloat` may become incorrect absolute pixels.
- [ ] Nested reference styles/token lookup may accidentally use the outer contract's token context in some paths.
- [ ] Removing all component properties, changing variable types, and empty component sets may expose adapter API edge cases.
- [ ] Shared-reference master updates may preserve a master ID while losing child-level overrides.
- [ ] Add explicit warnings for unsupported conversion rather than silently presenting approximate geometry as exact parity.

### P1: model and compiler hardening

Code-review candidates requiring focused tests:

- [ ] Malformed nested objects: null variants/behaviors, non-object maps/overrides, invalid child collections. Validation should return useful errors rather than throw accidental `TypeError`s.
- [ ] Synthetic override validation IDs (`validation-override-...`) may collide with authored IDs, exceed ID length bounds, or trip the 1,500-node boundary. Replace this synthetic-node strategy or isolate it safely.
- [ ] Validate override `styleBindings` and removed-attribute keys as strictly as base definitions.
- [ ] Decide and document deep-merge/precedence semantics for attributes and style bindings across overlapping variants.
- [ ] Validate referenced component existence; avoid silently rendering an empty instance for an unknown reference.
- [ ] Coerce/validate `$value` from input events against the target property's type. Runtime input values are strings even when a property is numeric.
- [ ] Define how event properties map to a reusable code component API rather than only a named description.
- [ ] Verify numeric ranges, contradictory min/max, unknown fields, primitive types, and boundary sizes.
- [ ] Keep JSON Schema and JavaScript validation aligned; add semantic fixtures that exercise both.
- [ ] Test Unicode content, cyclic/missing tokens, reference nesting, large contracts, and storage quota failure without destroying the user's saved version.

### P1: persistence and user-data recovery

- [ ] Export/import the full component library, including drafts/history if requested, references, mappings, and assets; current Foundation backup does not include these records.
- [ ] Add recoverable UI for malformed/future-version component storage, with raw backup before any reset.
- [ ] Test disabled storage, quota exceeded, tab conflicts during draft autosave, imported ID collisions, and stale history restores.
- [ ] Make unsaved/invalid draft state visible and handle navigation away. Valid draft autosave does not protect an invalid raw JSON edit.
- [ ] Refresh the library list/suggestions after saves and imported components rather than only on initial boot.
- [ ] Resolve project scoping: contracts and Foundation records are local workspace records, not a fully isolated multi-project/team database.
- [ ] Review Overview ↔ Project Setup synchronization so users do not have two conflicting notions of their current project.

### P2: implementation comparison and code adapters

- [ ] Add duplicate/missing instrumentation checks, clearer unsupported-state reporting, and unexpected semantic attribute checks.
- [ ] Compare all selected states and responsive configurations, not one configured rendering.
- [ ] Test forms, focus behavior, keyboard interactions, overlays, asynchronous states, slots, and error/loading/empty transitions.
- [ ] Add screenshot/pixel or geometry comparison where it provides useful evidence, with font/asset readiness controlled.
- [ ] If framework outputs are required, implement explicit adapters from the same contract; keep stable props/parts/tokens. A standalone HTML page is not a React/Vue/LWC/native component library.
- [ ] Define a realistic reverse path for existing implementations: instrumentation/adapters/source analysis, supported frameworks, and limits. Do not label the present DOM inspector as a universal code-to-contract compiler.
- [ ] Extend hostile HTML import tests as supported markup/styles expand.

### P2: accessibility, responsiveness, and authoring experience

- [ ] Keyboard and screen-reader review of dynamic editor controls, tree navigation, errors, stage focus restoration, diff announcements, and history controls.
- [ ] Check icon-only labels, toggle state, disabled/loading behavior, focus visibility, target size, and native widget semantics in exported components.
- [ ] Review light/dark, RTL, browser zoom, short-height screens, reduced motion, and high-contrast/forced-colors behavior.
- [ ] Decide whether a saved stage should remain interactive: it currently sits within a disabled saved-controls fieldset.
- [ ] Improve long-page editor navigation if the intended experience should match the recording's Props/Anatomy/Variants workflow.
- [ ] Provide dedicated controls for commonly used conditions/variant metadata so authors do not need raw JSON for routine edits.
- [ ] Deduplicate suggestion concepts by naming convention as well as ID where appropriate.
- [ ] Test actual font loading and asset embedding. The portable exporter does not yet package every custom font/image dependency for offline parity.

### P2: documentation and release hygiene

- [ ] Remove stale comments in `shell.js` and `foundation-runtime.js` that describe the bridge plugin as a separate unshipped project or refer to the old thin payload.
- [ ] Update changelog/version messaging once the final feature scope and live verification are established; do not invent a published release.
- [ ] Make dated audit output configurable across all scripts and retain evidence for source revisions.
- [ ] Decide which generated artifacts/screenshots belong in version control; inspect unrelated untracked files before staging.
- [ ] Run the release gate and relevant browser checks after fixes; provide exact evidence and limitations in the final report.

## 17. Acceptance criteria for calling this complete

### Project and Foundation

- A fresh user can enter all requested project details, save, reopen, edit, cancel, and save again.
- Context recommendations change appropriately before an explicit choice; saved choices survive context changes and reload.
- Each Foundation editor has a clear draft/saved state and recoverable failure behavior.
- Corrupt/future data is recoverable without silent loss.
- Overview and Project Setup agree about the active project and its details.

### Component contracts

- Each supported component has an explicit contract that covers its public props, default values, anatomy, tokens, states, variants, behavior, and accessibility requirements.
- The same saved revision drives the detail preview, prompt, generated code, and Figma payload.
- Changing a property produces consistent results across those outputs.
- Drafts, revisions, stale-save protection, import/export, library references, and recovery work without hidden data loss.
- JSON diffs remain meaningful after rename/reorder, because stable identities survive.

### Figma

- A real development plugin loads successfully and connects to the local bridge.
- A live pushed component set has the expected native properties, variants, variables, reusable instances, and configured preview.
- At least two existing instances remain linked across updates; supported overrides survive with evidence.
- An existing local component can be imported and updated in place with stable master identity.
- Actual Figma edits pull back as an accurate reviewable draft; repeated round trips do not grow contradictory definitions or silently lose data.
- Expired jobs, server restart, API failure, and unsupported CSS produce recoverable, truthful feedback.

### Code and comparison

- Exported implementations behave and render consistently across representative states, themes, widths, and directions.
- Drift in properties, parts, tokens/styles, and supported behaviors is detected and explained.
- Unsupported comparison/conversion areas are visible instead of passing as exact matches.
- Any framework-specific output uses the contract as its input and has its own appropriate checks.

### Verification and delivery

- Relevant unit tests, generated-file checks, prompt regressions, setup flow, contract browser checks, and site health pass on the final source state.
- Real Figma evidence is separate from mock/fixture evidence.
- The final report identifies any remaining exceptions and does not claim external services, publishing, invitations, or deployment that did not happen.

## 18. Suggested prompt for the next AI

```text
Continue the Agentic Design System in:
/Users/user/Documents/Agentic Design System

First read IMPLEMENTATION-HANDOFF-2026-10-27.md and inspect the existing
source and Git diff. Preserve the user's changes and local data. This is a
plain HTML/CSS/JS application; do not rebuild it in a new framework.

The user authorized checking and fixing prompt/preview mismatches,
Project Setup, Foundation recommendations and Save/Edit flows, and the
missing component-contract capabilities described by the LinkedIn post.
Much is implemented, but full completion has not been verified.

Start by reproducing the current release/browser checks. Then fix bridge
expired-result recovery and model validation edge cases, and verify the
development plugin in real Figma. Clearly separate fixture/mocked tests
from actual Figma evidence. Test native properties, variable bindings,
variants, existing-instance overrides, existing-master import, push/pull,
source ownership, and repeated round trips.

Complete the migration so each supported component's detail preview,
prompt, code export, and Figma output use the same saved contract.
Generic DOM captures are import starting points, not complete logical
definitions. Preserve stable component/property/part IDs. Migrate
incrementally with parity evidence, starting with the ordinary Buttons.

Add recovery/backup for component records and improve comparison,
accessibility, and responsiveness where testing reveals gaps. Keep
Foundation context and saved user choices intact. Do not silently reset
corrupt/future records or overwrite saved contracts with fresh captures.

Run relevant tests and generated-file checks after changes. Update the
handoff and provide a precise report of what is verified, what remains,
and where the evidence is. Do not claim deployment, live Figma success,
general source-code reverse engineering, or framework component output
unless those capabilities were actually implemented and tested.
```

## 19. Component capture inventory

The table below records the last full 69-page capture run. Property/rule counts describe captured contracts, not exhaustive combinations or live Figma parity. “Authored Button” means the richer ordinary Button path; “Snapshot” means generic rendered-DOM capture.

| Detail page | Capture path | Properties | Variant rules | Validation |
|---|---|---:|---:|---|
| [add-on-default.html](add-on-default.html) | Snapshot | 11 | 18 | Pass |
| [affix-default.html](affix-default.html) | Snapshot | 4 | 6 | Pass |
| [alert-default.html](alert-default.html) | Snapshot | 6 | 16 | Pass |
| [anchor-default.html](anchor-default.html) | Snapshot | 4 | 10 | Pass |
| [autocomplete-default.html](autocomplete-default.html) | Snapshot | 7 | 12 | Pass |
| [avatar-default.html](avatar-default.html) | Snapshot | 5 | 12 | Pass |
| [badge-default.html](badge-default.html) | Snapshot | 6 | 15 | Pass |
| [breadcrumb-default.html](breadcrumb-default.html) | Snapshot | 4 | 8 | Pass |
| [button-destructive.html](button-destructive.html) | Authored Button | 11 | 62 | Pass |
| [button-ghost.html](button-ghost.html) | Authored Button | 11 | 62 | Pass |
| [button-link.html](button-link.html) | Authored Button | 11 | 62 | Pass |
| [button-neutral.html](button-neutral.html) | Authored Button | 11 | 62 | Pass |
| [button-primary-icon.html](button-primary-icon.html) | Snapshot | 7 | 48 | Pass |
| [button-primary.html](button-primary.html) | Authored Button | 11 | 62 | Pass |
| [button-secondary.html](button-secondary.html) | Authored Button | 11 | 62 | Pass |
| [button-tertiary.html](button-tertiary.html) | Authored Button | 11 | 62 | Pass |
| [calendar-default.html](calendar-default.html) | Snapshot | 4 | 6 | Pass |
| [card-default.html](card-default.html) | Snapshot | 7 | 15 | Pass |
| [cascader-default.html](cascader-default.html) | Snapshot | 7 | 12 | Pass |
| [checkbox-default.html](checkbox-default.html) | Snapshot | 5 | 12 | Pass |
| [collapse-default.html](collapse-default.html) | Snapshot | 7 | 6 | Pass |
| [color-picker-default.html](color-picker-default.html) | Snapshot | 7 | 12 | Pass |
| [date-picker-default.html](date-picker-default.html) | Snapshot | 7 | 12 | Pass |
| [date-range-default.html](date-range-default.html) | Snapshot | 8 | 12 | Pass |
| [description-default.html](description-default.html) | Snapshot | 5 | 6 | Pass |
| [divider-default.html](divider-default.html) | Snapshot | 5 | 6 | Pass |
| [drawer-default.html](drawer-default.html) | Snapshot | 7 | 12 | Pass |
| [dropdown-default.html](dropdown-default.html) | Snapshot | 5 | 10 | Pass |
| [empty-default.html](empty-default.html) | Snapshot | 5 | 6 | Pass |
| [float-button-default.html](float-button-default.html) | Snapshot | 5 | 12 | Pass |
| [group-button-default.html](group-button-default.html) | Snapshot | 9 | 12 | Pass |
| [image-default.html](image-default.html) | Snapshot | 5 | 8 | Pass |
| [input-text-field.html](input-text-field.html) | Snapshot | 9 | 18 | Pass |
| [list-default.html](list-default.html) | Snapshot | 5 | 8 | Pass |
| [mention-default.html](mention-default.html) | Snapshot | 7 | 12 | Pass |
| [menu-default.html](menu-default.html) | Snapshot | 5 | 8 | Pass |
| [modal-default.html](modal-default.html) | Snapshot | 7 | 8 | Pass |
| [notification-default.html](notification-default.html) | Snapshot | 5 | 12 | Pass |
| [number-default.html](number-default.html) | Snapshot | 8 | 18 | Pass |
| [pagination-default.html](pagination-default.html) | Snapshot | 4 | 8 | Pass |
| [password-default.html](password-default.html) | Snapshot | 8 | 18 | Pass |
| [pop-confirm-default.html](pop-confirm-default.html) | Snapshot | 5 | 12 | Pass |
| [popover-default.html](popover-default.html) | Snapshot | 5 | 12 | Pass |
| [progress-default.html](progress-default.html) | Snapshot | 4 | 6 | Pass |
| [radio-default.html](radio-default.html) | Snapshot | 4 | 10 | Pass |
| [rating-default.html](rating-default.html) | Snapshot | 5 | 8 | Pass |
| [result-default.html](result-default.html) | Snapshot | 4 | 12 | Pass |
| [search-default.html](search-default.html) | Snapshot | 7 | 18 | Pass |
| [select-dropdown.html](select-dropdown.html) | Snapshot | 7 | 32 | Pass |
| [skeleton-default.html](skeleton-default.html) | Snapshot | 3 | 6 | Pass |
| [slider-default.html](slider-default.html) | Snapshot | 5 | 8 | Pass |
| [spin-default.html](spin-default.html) | Snapshot | 3 | 9 | Pass |
| [splitter-default.html](splitter-default.html) | Snapshot | 5 | 6 | Pass |
| [statistic-default.html](statistic-default.html) | Snapshot | 6 | 12 | Pass |
| [steps-default.html](steps-default.html) | Snapshot | 6 | 5 | Pass |
| [switch-default.html](switch-default.html) | Snapshot | 4 | 12 | Pass |
| [table-default.html](table-default.html) | Snapshot | 5 | 10 | Pass |
| [tabs-default.html](tabs-default.html) | Snapshot | 5 | 8 | Pass |
| [tag-default.html](tag-default.html) | Snapshot | 4 | 12 | Pass |
| [text-area-default.html](text-area-default.html) | Snapshot | 7 | 18 | Pass |
| [time-default.html](time-default.html) | Snapshot | 7 | 12 | Pass |
| [timeline-default.html](timeline-default.html) | Snapshot | 3 | 9 | Pass |
| [toast-default.html](toast-default.html) | Snapshot | 6 | 16 | Pass |
| [tooltip-default.html](tooltip-default.html) | Snapshot | 5 | 12 | Pass |
| [tour-default.html](tour-default.html) | Snapshot | 5 | 12 | Pass |
| [transfer-default.html](transfer-default.html) | Snapshot | 5 | 8 | Pass |
| [tree-default.html](tree-default.html) | Snapshot | 4 | 12 | Pass |
| [tree-select-default.html](tree-select-default.html) | Snapshot | 7 | 12 | Pass |
| [upload-default.html](upload-default.html) | Snapshot | 4 | 8 | Pass |
