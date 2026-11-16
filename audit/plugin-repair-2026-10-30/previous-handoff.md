# Input Text Field customization and export — AI handoff

**Date:** 30 October 2026  
**Project:** Agentic Design System 2  
**Status:** Input exports now contain all 8 sizes and 6 corner radii across 3 appearances and 8 states (1,152 combinations). Automated tests pass. See section 12 for the latest live verification; section 11 describes the earlier 24-variant repair. Full visual comparison, every native editing interaction, and rollout to other components remain separate work.

## 1. User request and scope

The user reported that **Draw in Figma** did not reproduce the component selected in the customization panel. They asked to investigate and fix **Input Text Field** across these five actions:

1. Copy prompt
2. Copy preview code
3. Download JSON
4. Download HTML
5. Draw in Figma

The user also identified the Figma capabilities they expect the design system to respect: variants, text, Boolean properties, instance swaps, slots, component configuration, position/alignment/rotation, layout/dimensions/spacing, opacity, corners, colors, fills, strokes, styles, and effects.

This implementation concentrates on Input and the shared export/adapter functions it uses. **It does not establish that every other component now has a complete authored Figma contract, and it does not add a full Figma-style inspector to every detail page.**

## 2. Work in the correct project

```text
/Users/user/Documents/Agentic Design System 2
```

The sibling folder `Agentic Design System` is a different copy. This task changed the folder ending in `2`.

The application is a static HTML/CSS/JavaScript site. No application build is needed. Figma uses a local development plugin and an HTTP bridge.

There were already extensive modified and untracked files when this task began. Preserve that work. A comparison against Git HEAD includes work from earlier sessions, not just this task. No commit, deployment, or merge to the sibling project was performed in this task.

## 3. What was wrong

| Finding | Consequence | Correction |
| --- | --- | --- |
| Input used the generic preview capture and exposed primarily State | Native controls were not represented as reusable component properties | Added an Input-specific authored contract with named parts, properties, references, and variant patches |
| Native inputs became Figma frames | Their value or placeholder was missing | Render inputs as Figma text layers and bind the appropriate text property |
| A label/span with children could be treated as a text leaf | Nested content, such as the required marker, could disappear | Only leaf text elements become text nodes; mixed content retains its container |
| Capture omitted important form attributes | Downloaded HTML lost validation and accessible relationships | Preserve `id`, `for`, `required`, `readonly`, `maxlength`, and related attributes |
| Exports could happen before the 80 ms render debounce completed | The latest customization could be missing | Flush pending renders before capture and refresh the selection |
| Rem line height was interpreted as a unitless number | Figma could receive an invalid line height | Convert px/rem lengths explicitly and handle percentages/automatic line height |
| Border handling assumed a uniform stroke | Underlined Input could be incorrectly drawn | Read individual border widths and choose the active side's color |
| Foundation added its own required star | Input could show two required markers | Recognize the Input's existing marker |
| Repeated draws retained obsolete effects or references | Redraw could disagree with current settings | Reset effects/references, rebuild bindings, and select the requested preview master |
| Successful bridge responses discarded conversion warnings | Font fallbacks and conversion limitations were hidden | Surface returned warnings in the action feedback |

The workbench already contained a CSS-name-to-camelCase normalization fix when this task began. That earlier fix was retained; it is not sufficient by itself to create a reusable Input component.

## 4. How the implementation works

```text
Input customization controls + selected preview
    → flush pending render and validate controls
    → ADSWorkbench.capture()
    → ADSInputContract.capture()
    → one component contract
        ├─ prompt: ADSComponentContract.prompt(contract)
        ├─ JSON: serialize contract
        ├─ preview code / HTML: ADSContracts.code(contract)
        └─ Figma: ADSFigmaBridge.draw(contract)
                    → POST /contracts/push
                    → plugin polls /bridge/next
                    → adapter.push(contract)
                    → completed result returns through /bridge/result
```

### Capture from the actual renderer

`input-detail.js` exposes `window.ADSInput`, including the existing field renderer, appearance/state definitions, and current options. `input-contract.js` reuses that renderer to measure real samples in a temporary offscreen host. The host is removed in `finally`.

The samples include optional anatomy so that reusable properties still exist when an icon, required marker, or helper is currently switched off. Contract conditions determine whether those parts appear.

The selected field supplies its actual label, placeholder, value, size, radius, appearance, and state. Other native options supply validation and helper/error settings. All five actions use this capture path; none needs a separate Input export implementation.

### Stable anatomy

The main part IDs are:

```text
root
├─ label-row
│  ├─ label
│  └─ required-mark
├─ control
│  ├─ leading-icon
│  ├─ input
│  ├─ trailing-icon
│  └─ clear
├─ supporting-slot
│  └─ helper
└─ error
```

These are semantic IDs rather than indexes into whichever optional children happen to be visible. Keep them stable when extending the component.

### Properties and variants

| Contract property | Type / purpose |
| --- | --- |
| `appearance` | Options: Outlined, Filled, Underlined |
| `state` | Options: Rest, Hover, Focused, Filled, Success, Error, Read-Only, Disabled |
| `size` | All 8 options: 24, 28, 32, 36, 40, 44, 48, 56 |
| `radius` | All 6 options: 0, 2, 4, 8, 12, 9999 (Pill) |
| `label`, `placeholder`, `value` | Text |
| `supportingText`, `errorText` | Text |
| `required` | Boolean required marker and HTML required binding |
| `showLeadingIcon`, `showTrailingIcon` | Boolean visibility |
| `allowClear` | Boolean used with value/state conditions |
| `showSupporting` | Boolean visibility outside Error state |
| `leadingIcon`, `trailingIcon` | Instance swaps backed by local nested icon component definitions |
| `supportingSlot` | Supporting-content slot |

There are **1,152 variants: 3 appearances × 8 states × 8 sizes × 6 corner radii**. The selected configuration becomes the generated preview instance. All options remain available even when the web preview shows a subset. Underlined stays square for every radius, matching the renderer; Outlined and Filled apply the chosen radius.

HTML input type and maximum length are retained as native attributes and in source configuration. They are not newly introduced Figma property types.

### Shared compiler and HTML behavior

The contract model now supports `hiddenWhen`: hide a part when all listed conditions match. This complements `visibleWhen`. Input uses it so the static trailing icon disappears while a clear action occupies that position and returns when the value is cleared.

Variant patches can override `visibleWhen`. The schema and validator were updated alongside the compiler.

The standalone HTML embeds the contract and the same compiler/renderer used by the application. It retains placeholder styling, semantic attributes, and authored input/clear behaviors. Rerendering preserves the focused field and its selection range where the browser supports it.

### Figma conversion

The shared adapter now handles the Input's text, nested label, icon instances, supporting slot, individual strokes/corners, spacing, dimensions, opacity, and typography. Input values display as text; empty inputs use placeholder text. Password values are rendered as bullets rather than bound to a raw visible value layer.

SVG geometry keeps its imported paints and does not receive an inappropriate auto-layout conversion. Font loading is cached during a push. Missing fonts produce a fallback warning.

Absolute left/top positioning and matrix-derived rotation are mapped in the shared adapter. This is not a complete arbitrary CSS transform/layout engine, and the Input browser suite does not certify every possible positioning combination.

On redraw, stable component masters and part IDs are reused where their types remain compatible. The generated preview instance switches to the selected master. Obsolete masters move into hidden archive component sets grouped by their original axes. Their node IDs and existing instance links are preserved; incompatible old masters must not remain inside the active set, even when hidden.

## 5. Files changed or added

| File | Responsibility |
| --- | --- |
| `input-contract.js` — new | Authored Input contract, semantic anatomy, sample capture, property bindings, icon references, slot and variant patches |
| `input-detail.js` | Shared renderer API, label text span, form associations, maximum length zero, live typing/clear/trailing-icon behavior |
| `input-text-field.html` | Loads the Input contract module and corrects the variant/export description |
| `component-workbench.js` | Input capture dispatch, synchronous render flush, invalid-control rejection, semantic part names, richer attribute/placeholder capture, copy-button targeting |
| `component-contract-model.js` | Form-attribute validation/binding, `hiddenWhen`, variant visibility conditions |
| `component-contract.schema.json` | Documents the new hidden-condition structure |
| `component-contract-runtime.js` | Focus/caret preservation and standalone placeholder CSS |
| `figma-plugin/adapter.js` | Text/layout/appearance/property mappings; nested-instance boundaries; archive migration; property recovery; reference-root migration; readback and read-only inspection |
| `tools/component-bridge.cjs` | Reload changed contract validator modules without restarting; route read-only `/contracts/inspect` |
| `figma-plugin/code.js` | Rebuilt generated plugin bundle; edit source modules and rebuild, not this file directly |
| `foundation-runtime.js` | Prevents duplicate required markers |
| `shell.js` | Pending-render flush and Figma warning feedback |
| `tests/figma-fixture.cjs` — new | Shared Figma API test double, extracted and extended from the adapter tests |
| `tests/component-figma.test.cjs` | Adapter regression cases |
| `tests/component-contract.test.cjs` | Conditional-visibility regression case |
| `tests/shell-figma-bridge.test.cjs` | Successful draw warning feedback regression |
| `tools/check-input-exports.cjs` — new | Browser check of the five actions, HTML output and adapter payload/results |
| Generated catalog/inventory files | Refreshed using `tools/audit_pages.py` after the HTML changed |
| `audit/input-export-2026-10-30/` | Evidence, output examples, screenshots, short report and selected before snapshots |

## 6. Verification performed

The final repository check completed successfully:

```text
All unit test suites pass.
Figma plugin bundle: fresh
RELEASE CHECK: PASS - tests and all freshness gates are current.
```

The browser check exercised the actual Input page in local Chrome and verified:

- The five action buttons capture equivalent contracts.
- Current label, required flag, icons, selected size/radius and validation attributes are retained.
- All 1,152 appearance/state/size/radius combinations compile and create masters with the expected height and corners.
- Downloaded HTML matches the preview control's measured geometry and appearance for the tested configuration.
- Typing, Clear, and restoration of the trailing icon work in exported HTML.
- Immediate export sees edits made before the debounce expires.
- `maxlength="0"` survives capture.
- Rem conversion preserves radius, height and line height.
- Empty fields bind the placeholder text property.
- Redrawing preserves master identities and switches the generated preview to the selected master.
- Save/reload preserves configuration.
- Focused, read-only, disabled and dark/RTL paths reach the adapter without page errors.

Evidence is stored in:

```text
audit/input-export-2026-10-30/results.json
audit/input-export-2026-10-30/input-contract.json
audit/input-export-2026-10-30/input-text-field-preview.json
audit/input-export-2026-10-30/input-text-field-preview.html
audit/input-export-2026-10-30/input-customized.png
audit/input-export-2026-10-30/input-export.png
```

**Verification boundary:** the automated browser suite intercepts the Figma HTTP push and invokes the production adapter against a Figma API test double. Its `results.json` correctly keeps `liveFigmaVerified: false`. A separate live check subsequently clicked the actual page CTA against the connected Figma plugin with no push interception; see section 11 and `live/`. The screenshots still show the website and HTML export, not a Figma pixel comparison.

## 7. Run and verify locally

From the project root:

```sh
node tools/build_figma_plugin.cjs
python3 tools/audit_pages.py
bash tools/release_check.sh
```

For the browser regression check, install/resolve `playwright-core`, or provide its installed package directory:

```sh
ADS_PLAYWRIGHT_PACKAGE=/absolute/path/to/playwright-core node tools/check-input-exports.cjs
```

The checker currently launches Chrome from `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. Adjust that executable path if running on another machine. It starts and closes a temporary localhost server and browser.

For a real Figma draw:

```sh
node tools/component-bridge.cjs
```

Then open:

```text
http://127.0.0.1:3333/input-text-field.html
```

Import the development plugin from this project's `figma-plugin/manifest.json` if needed. Close and reopen the plugin after rebuilding `code.js`. Confirm it is connected, customize Input, and click Draw in Figma. If port 3333 is occupied, identify the existing process/project before starting another bridge; do not accidentally use the sibling project's server.

## 8. Known limitations and next work

### Remaining live visual and interaction acceptance

The connected Figma API now accepts the generated properties, and migration from the earlier State-only set is verified. Repeated actual draws and readback succeed. Next compare the canvas visually with the web preview and exercise individual property edits: text sizing, stroke sides, slot replacement, icon swaps, Boolean combinations, and font fallback. A clean new-document workflow should also be checked separately.

The API test double does not reproduce Figma's layout engine, all property restrictions, or every instance-override behavior. Property creation and successful readback do not certify pixel parity or all editing interactions.

### Native Figma property interactions

Figma does not execute browser validation or the HTML Clear callback. Compound visibility expressions are evaluated for the exported variants, while native Boolean properties are independent controls. Editing one Boolean in Figma does not automatically recompute every browser condition. Test combinations such as Allow clear + trailing icon + empty value. Decide whether additional authored variants/nested components are needed for the desired Figma editing experience.

### Appearance fidelity

The CSS focus outline is currently represented as a zero-blur spread effect. Its outline-offset gap is approximated. A dedicated outline layer may be needed for exact fidelity. Font fallback is reported, but matching fonts still need to be available in Figma.

The generic adapter is not a complete CSS renderer. Full transforms, arbitrary gradients, complex shadows and every layout mode need separate evidence before being claimed as supported.

### Configuration scope

Each Input export now includes every supported size/radius combination. The web selection controls which configuration is previewed, while Figma can switch among all 1,152 masters. The model, JSON schema and adapter now share a 2,048-variant limit. The bridge allows 600 seconds and the page allows 605 seconds for a draw. Large sets are arranged in 12 columns, and property binding caches anatomy and matching rules to avoid repeatedly scanning the full contract.

### Contract compatibility and composition

`hiddenWhen` is an extension within the existing schema version. Consumers using an older compiler may ignore it. Distribute the updated compiler and plugin bundle with these contracts, and assess versioning if older consumers must remain supported.

The standalone Input uses fixed HTML IDs for its label/control/helper associations. If multiple copies are composed into one document, scope those IDs per instance and rewrite the related `for`/ARIA references. The current test certifies one exported Input, not multi-instance composition.

### Other components

Other detail pages still need a component-specific review. Shared capture and adapter corrections help them, but generic snapshots do not automatically create meaningful typed properties or correct behavior for every component. Button already has its own capture path; preserve it while checking regressions.

For each additional component:

1. Inventory every native customization control and its intended effect.
2. Define stable semantic anatomy IDs, including optional parts.
3. Reuse the actual renderer to capture supported configurations.
4. Author property bindings and visibility rules explicitly.
5. Keep all five exports on the same contract/compiler path.
6. Preserve semantic HTML and distinguish application behavior from Figma visuals.
7. Verify the buttons, exported HTML, adapter output and real Figma canvas.
8. Record tested scope and remaining limitations without inheriting Input's acceptance status.

## 9. Prompt to give the next AI

> Work in `Agentic Design System 2`. Read `INPUT-TEXT-FIELD-AI-HANDOFF.md`, the current source files, and the evidence in `audit/input-export-2026-10-30/`. Preserve existing modified and untracked work. Input's five export paths pass automated checks. The earlier live repair succeeded with 24 variants and all native property types. The latest change expands this to all 1,152 size/radius combinations; see section 12 for current evidence. Read sections 11 and 12 before changing the adapter. Next validate visual fidelity and native editing interactions (Boolean combinations, icon swaps and slot replacement), plus a clean new-document workflow. Fix observed mismatches and extend the regression checks. If asked to roll out to other components, apply the same shared-contract approach one component at a time. Do not claim a generic snapshot gives every component a complete Figma API. Update this handoff with what you changed, how you tested it, and what remains.

## 10. API references used

- [Figma component properties](https://developers.figma.com/docs/plugins/working-with-component-properties/)
- [Figma node properties](https://developers.figma.com/docs/plugins/api/node-properties/)
- [Figma textAutoResize](https://developers.figma.com/docs/plugins/api/properties/TextNode-textautoresize/)

Recheck current API documentation when changing the plugin; do not rely on the test double as the API specification.


## 11. Earlier live Figma follow-up: 24-variant repair (historical)

The user's follow-up was correct: the original mocked test was insufficient. We clicked **Draw in Figma** on the actual local Input page against the connected **Contract Bridge**, rather than intercepting its request. The following failures occurred in sequence and were fixed:

1. **Stale bridge validator (HTTP 400).** The long-running Node bridge still held the old contract validator in `require.cache`, rejecting valid Input form attributes. The bridge now loads the validator from the canonical resolved path and reloads it when the source changes. A regression changes a temporary validator while the bridge is running.
2. **Binding nested instance sublayers (HTTP 422).** Figma clones plugin metadata into icon instance descendants. A recursive `findAll` therefore attempted to assign parent component properties to instance sublayers, which Figma forbids. `ownedParts()` includes the instance boundary but stops descending into it. The test fixture now clones instance descendants and enforces this restriction.
3. **Invalid mixed-axis component set (HTTP 422).** The earlier exporter left eight State-only masters alongside the new four-axis masters. Hidden masters still participate in Figma's validation. Old masters now move into hidden archive sets, grouped by axis structure, retaining their IDs and instance links. The active set contains only the intended 24 variants.
4. **Partial-import property duplication.** Failed pushes had left extra definitions. The adapter now persists its property map incrementally, recovers matching definitions, and avoids unnecessary Slot edits. Unreferenced exact-name/type duplicates can be pruned safely. Live inspection also revealed seven Figma-renamed leftovers (`Label2`, `Placeholder2`, `Value2`, `Supporting text2`, `Error message2`, `Required2`, `Show leading icon2`). All were unused. A successful pull registered those definitions in the stored map, and a normal authored redraw removed them. This targeted repair is not permission to delete arbitrary user-added properties or assume every numbered property is a duplicate.
5. **Nested-icon migration/readback.** Old and new reference roots could coexist, and pull flattened instance sublayers into the parent anatomy, producing duplicate part IDs. Reference roots now have distinct IDs; updates retire obsolete roots and refresh existing instances. Readback stops at instance boundaries. A new read-only `inspect` operation exposes actual definitions and bindings without rewriting the contract.
6. **Missing Input module fallback.** Input capture now reports a missing authored module explicitly rather than silently generating another generic State-only contract.

### Confirmed live result

The existing Input set is node `55:9549`; its generated preview instance is `55:9550`. The final authored configuration remains Outlined / Rest / size 40 / radius 4, with the original Email address content. The active set contains:

| Native Figma type | Count | Names |
| --- | ---: | --- |
| VARIANT | 4 axes / 24 masters | Appearance, State, Size, Corner radius |
| TEXT | 5 | Label, Placeholder, Value, Supporting text, Error message |
| BOOLEAN | 5 | Required, Show leading icon, Show trailing icon, Allow clear, Show supporting content |
| INSTANCE_SWAP | 2 | Leading icon, Trailing icon |
| SLOT | 1 | Supporting content |

A repeated actual CTA draw is used to verify that the cleaned set remains stable. The live response and read-only property inspection are saved separately from the mocked browser evidence in `audit/input-export-2026-10-30/live/`. No plugin reload is needed again unless source changes and the bundle is rebuilt.

### Read-only inspection for the next AI

With the correct bridge and plugin running:

```sh
curl --noproxy '*' -sS -H 'Content-Type: application/json' \
  --data '{"componentId":"input-text-field"}' \
  http://127.0.0.1:3333/contracts/inspect
```

`/contracts/inspect` reports actual properties, the property map, and variant names/counts. Sets with up to 256 masters also include owned-layer bindings; larger sets explicitly report `bindingsOmitted: true` to keep inspection lightweight. `/contracts/pull` is different: it reconstructs a contract and updates plugin metadata/authority, so do not describe it as read-only. Avoid using pull/redraw as a general cleanup shortcut without inspecting unknown properties first.

All unit suites, generated-file freshness gates, and the Chrome five-export regression passed after the final source changes. Added regression cases cover nested instance binding restrictions, mixed-axis archive migration, reference-root replacement, property recovery/cleanup, no-op Slot edits, readback/inspection, and hot validator reload. Visual pixel parity and every native Figma property-edit combination remain outside this evidence.


## 12. All sizes and corner radii follow-up

The user reported that Figma's Size and Corner radius dropdowns still contained only the exported selection. That was an intentional limitation in the earlier implementation, and it did not meet the user's expected library behavior. The current implementation removes that limitation.

### Implementation

- `input-contract.js` reads all sizes/radii from `ADSInput.sizes` and `.radii`, the same option lists used by the customization panel. Both contract properties include the complete lists. Selection still follows the chosen preview.
- It measures the actual renderer for each appearance/state/size (192 samples). Radius changes only the control corners, so those measurements are reused for all 6 radii rather than performing 1,152 DOM measurements on every export. Each exported variant has a complete four-axis condition and a stable ID.
- Corner patches set all five CSS corner fields, preventing stale per-corner styles from overriding the selected radius. Underlined variants remain square.
- `component-contract-model.js`, the JSON schema and the adapter support up to 2,048 authored variants. This also allows readback of the expanded set; the previous 256 limit would reject it.
- The adapter indexes existing masters once; repeatedly scanning the growing set previously caused quadratic calls to Figma plugin data and an excessively slow live import. It reuses exact matching rendered geometry through native root-frame clones for new/uncommitted radius variants, adjusting all corners after cloning. Committed masters keep their existing anatomy IDs. It wraps the set into 12 columns. Property binding reads each layer's metadata/type/conditions once, accumulates its Text/Boolean/Swap/Slot references in JavaScript, and assigns references once per layer. Previously those native metadata reads repeated for each of the 13 properties. The resulting reference map also supplies duplicate-property usage checks without another scene walk. All native Text/Boolean/Instance Swap/Slot mappings are retained.
- The bridge timeout is 600 seconds and the web draw timeout is 605 seconds. The compact serialized payload is about 1.3 MB and stays below the existing 8 MB bridge limit. Large-set inspection omits layer-by-layer bindings and returns variant names/options/counts instead. Native `findAllWithCriteria` restricts global lookups by node type rather than traversing all scene nodes in JavaScript; small-set inspections still include bindings.
- Testing found the 24px size inherited body typography whose minimum block size stretched the control to 26px. Its renderer style now uses caption typography, like the neighboring compact sizes, so the measured control stays 24px.
- `tools/check-input-exports.cjs` verifies all 1,152 master heights/radii, unique configurations, complete option lists, all five equivalent exports, selected preview, rem conversion, redraw identity and existing HTML behavior. `ADS_INPUT_AUDIT_DIR` can choose a separate evidence folder.

### Verification

- `node --test tests/component-figma.test.cjs`: all 15 cases pass, including expansion from the existing 24 masters to 1,152 while preserving their IDs and the selected preview.
- `bash tools/release_check.sh`: all unit suites and freshness gates pass.
- Chrome five-export regression: passed with zero page errors. Evidence is in `audit/input-size-radius-2026-10-30/`; the automated `results.json` is explicitly mocked for Figma.
- The first live request exceeded the earlier 180-second timeout while Figma remained on “Applying push request…”. It is saved as `live/initial-draw-timeout.json`. That failure exposed the repeated-set-scan performance issue above; the optimized bundle must be loaded before final verification. Current live verification is recorded separately in `live/`.

The earlier `audit/input-export-2026-10-30/` evidence and section 11 remain a historical record of the 24-variant repair. Use the new folder for the complete size/radius export. Full canvas pixel parity and every native editing interaction are still separate acceptance work.


### Runtime verification and connection diagnosis

The plugin UI's old “Applying …” message was set before the sandbox acknowledged a job. It was not sufficient evidence that canvas work had started. Repeated live attempts timed out, including read-only inspection. The exact cause of those waits has not been verified; do not attribute all of them to the variant rendering loop.

The final bridge/plugin add:

- Startup `hello` / `ready` handshake. The UI displays `input-all-configurations-2026-10-30-v5` only after the sandbox responds, and does not poll scene jobs before readiness.
- `/contracts/ping`: pure sandbox health response; no Figma scene access.
- `/bridge/progress`: receives sandbox phase reports. `/bridge/status` includes queued/dispatched/acknowledged job phases.
- Rendering progress every 48 masters, property-binding phases, and lightweight-inspection phases.

Local regressions verify startup gating, ping without canvas access, and recovery after expired results. All release checks pass. A live health request was observed as **Queued**, with `connected: false`: at that observation the plugin had not polled it, so the next diagnostic is the exact status text in the real Figma plugin. Complete the health check before sending another large draw. Native canvas acceptance for the full 1,152 variants remains pending until recorded in this section or a live results file.
