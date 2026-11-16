# Input and Figma plugin — AI handoff

Date: 30 October 2026. Project: `/Users/user/Documents/Agentic Design System 2`.

**Current status:** native transport v6 and Input property corrections are implemented. Unit tests, release freshness gates, and the browser five-export check pass. The browser now uses the real HTTP broker and production native-runtime transport; the Figma scene API in that automated check is a strict test double. Live acceptance of this repair is pending until recorded under `audit/plugin-repair-2026-10-30/live/`. Do not inherit the earlier 24-variant acceptance as proof of the new 1,152-variant component.

## User intent

The user wants Input Text Field to match its customization settings in Copy prompt, Copy preview code, Download JSON, Download HTML and Draw in Figma. Figma should expose meaningful Variant, Text, Boolean, Instance Swap and Slot controls, including **all sizes and corner radii**. They also want this Markdown explanation to share with another AI.

Work in the folder ending in `2`; the sibling folder is a different copy. The worktree was already extensively modified and untracked. Preserve those changes. No commit or deployment was made.

## What was reproduced and corrected

| Problem | Correction |
| --- | --- |
| Original generic Input capture mostly represented State | Input-specific authored anatomy, typed properties, icon references, slot and variant patches |
| Earlier exports contained only the selected size/radius | All 8 sizes × 6 radii × 3 appearances × 8 states = 1,152 complete variants |
| Empty Input exports had an unused Value property | Figma now renders distinct Value and Placeholder text layers inside one content frame |
| Empty Input exports had an unused Allow clear Boolean | Native Figma exposes a bound **Show clear button** control with the correct current visibility default; browser Allow clear behavior remains value-aware |
| All work depended on the UI iframe receiving a startup message, polling HTTP, forwarding large contracts and posting results | The sandbox now uses Figma's native Fetch API and long polling. The iframe only displays status and sends Connect / Retry |
| Long HTTP requests timed out and could discard completion | Browser submits a short asynchronous job and polls a retained result; a lost acknowledgement can reconnect without executing the scene mutation again |
| Repeated clicks could queue duplicate imports | Button disables during a draw; broker also rejects concurrent pushes and blocks retries after unconfirmed completion |
| Old State-only masters made the new set invalid even while hidden | Incompatible masters are preserved in separate hidden archive sets; active set uses one consistent four-axis schema |
| Nested icon sublayers inherited part metadata and received illegal property assignments | Owned-part traversal stops at instance boundaries and ignores retired subtrees |
| Nested icon roots/readback could duplicate part IDs | Distinct reference-root IDs, retirement of old roots, refreshed references, and instance-boundary readback |
| Figma property renames/no-op Slot edits caused incorrect IDs or warnings | Persist property-map changes, use returned rename IDs, skip unchanged Slot edits and recover definitions after interrupted pushes |
| Bridge kept an outdated validator in Node's module cache | Reload validator when its source changes |

The old UI displayed “Applying…” before the sandbox acknowledged a job. Earlier stalled attempts did **not** establish that all the wait was caused by rendering. The old logs are retained as failure evidence, not successful live acceptance.

## Current component model

Every export includes all of these options, regardless of which subset is shown in the web preview:

| Axis | Options |
| --- | --- |
| Appearance | Outlined, Filled, Underlined |
| State | Rest, Hover, Focused, Filled, Success, Error, Read-Only, Disabled |
| Size | 24, 28, 32, 36, 40, 44, 48, 56 px |
| Corner radius | 0, 2, 4, 8, 12, 9999 (Pill) |

The selected configuration becomes the generated preview instance. Underlined remains square at every radius, matching the renderer. The contract compiler and adapter allow up to 2,048 authored variants. The size/state geometry is measured from 192 real renderer samples and reused for the six radius choices.

Native properties:

- 4 variant axes and 1,152 masters.
- 5 Text: Label, Placeholder, Value, Supporting text, Error message.
- 6 Booleans: Required, Show leading icon, Show trailing icon, Show clear button, Show supporting content, Show placeholder.
- 2 Instance Swaps: Leading icon, Trailing icon.
- 1 Slot: Supporting content.

`allowClear` remains the contract ID and browser behavior flag. Its native Figma display name is **Show clear button**, and its native default/preview value is derived from the current value and editable state. This avoids showing Clear for an empty or disabled/read-only field. Native Figma Booleans are independent display controls: editing Value does not execute browser logic or automatically toggle Show placeholder, Show clear button or Show trailing icon. Set those controls explicitly when editing a Figma instance.

The HTML contract keeps one semantic `<input>` with its label and validation attributes. Only the Figma presentation expands it into an `input` content frame containing `input-value` and `input-placeholder`. On migration, the old text layer is retained in the matching role where possible. Readback collapses this presentation back to an authored input so HTML does not get children inside a void element.

Other stable IDs include root, label-row, label, required-mark, control, leading-icon, trailing-icon, clear, supporting-slot, helper and error. Keep semantic IDs stable.

## Transport and lifecycle

```text
Actual web Draw button
  → POST /contracts/jobs {operation:'push', contract}
  ← 202 {jobId}
  → GET /contracts/jobs/<jobId> until terminal

Native Figma sandbox
  → POST /bridge/connect {clientId, build}
  → GET /bridge/next?wait=10000&clientId=...
  → adapter.push(contract)
  → POST /bridge/progress as phases change
  → POST /bridge/result
```

The current build is **`damco-native-bridge-2026-10-30-v6 · native-fetch`**. The plugin connects to `http://localhost:3333`, the valid development domain in the manifest. Figma rejected the numeric loopback address in `devAllowedDomains`; it was removed. The bridge serves both IPv4 `127.0.0.1` and IPv6 `::1` through the same broker, so localhost resolution does not split the connection. The website/CLI may still use 127.0.0.1. Browser null-origin responses use the CORS wildcard recommended by Figma.

The iframe never polls the server or forwards scene jobs. The sandbox starts independently of the iframe handshake. The UI retries its small hello message until it can display the build. Connect / Retry resumes after a network/server failure without re-executing an already applied job whose acknowledgement was lost.

The broker identifies the connected consumer and rejects old/unidentified pollers after a native connection is registered. Disconnected web draws fail promptly with HTTP 503. Results are retained in memory for up to 40 jobs; they do not survive a server restart. An active job has a 600-second limit. If completion is unconfirmed, the browser reports uncertainty and the broker blocks another push. Inspect Figma before restarting the bridge and retrying. A late real result can still promote that job to success.

Legacy synchronous `/contracts/push`, `/contracts/pull`, `/contracts/inspect` and `/contracts/ping` remain for compatibility. Use asynchronous jobs for new integrations. Do not equate an HTTP 202 acceptance with a completed component.

## Important implementation files

| File | Role |
| --- | --- |
| `input-contract.js` | Complete Input contract, properties, variants, stable parts and shared icon references |
| `input-detail.js` | Actual renderer API, native options, form associations, typing/Clear behavior |
| `component-workbench.js` | One shared capture for all five actions; flush pending edits; current export descriptions |
| `component-contract-model.js`, `.schema.json` | Validation, conditional visibility, 2,048-variant bound, HTML semantics |
| `component-contract-runtime.js` | HTML/code generation and focus/caret preservation |
| `figma-plugin/adapter.js` | Native geometry, typography, strokes/effects, property references, migration, Input presentation, readback, inspection and PNG preview |
| `figma-plugin/bridge-runtime.js` | Native Fetch worker, long polling and safe result delivery/reconnect |
| `figma-plugin/main.js`, `ui.html`, `manifest.json` | Plugin boot, status/control UI and local network scope |
| `figma-plugin/code.js` | Generated bundle; rebuild from source, do not edit directly |
| `tools/component-bridge.cjs` | Static site + asynchronous broker, consumer identity, progress, retained result state and validator reload |
| `shell.js` | Asynchronous Draw feedback, visible progress and duplicate-click prevention |
| `tests/figma-fixture.cjs` | Strict scene test double; instance boundaries, axis validity, property rename IDs and cloning |
| `tests/figma-transport.test.cjs` | Real HTTP transport tests, built-bundle boot without iframe, lost/late acknowledgement recovery |
| `tools/check-input-exports.cjs` | Real Chrome exercise of all five actions and all 1,152 native configurations using a simulated scene |
| `tools/check-live-input.cjs` | Actual CTA against the connected real Figma plugin, no HTTP interception |
| `tools/figma-job.cjs` | Asynchronous live ping/inspect/preview helper; writes evidence and PNG without dumping pixel arrays |

The adapter indexes existing masters, uses native typed searches, reuses exact matching root geometry for new/uncommitted radius variants, wraps the set into 12 columns, and caches binding metadata once per layer. It applies a layer's property references together rather than repeatedly reading metadata for each property.

The 24px source control now uses caption typography to prevent body-text minimum height from stretching it to 26px. Auto layout, dimensions, spacing, font metrics, colors, opacity, individual corners and borders, SVG geometry and focus effects are mapped for the tested Input paths.

## Verification and commands

Run from the project root:

```sh
node tools/build_figma_plugin.cjs
bash tools/release_check.sh
```

Browser regression (local Google Chrome required):

```sh
ADS_INPUT_AUDIT_DIR=audit/plugin-repair-2026-10-30 \
ADS_PLAYWRIGHT_PACKAGE=/absolute/path/to/playwright-core \
node tools/check-input-exports.cjs
```

The current installed Playwright path in this workspace is `/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core`.

The final automated checks verify:

- All five actions carry the same complete contract, including pending edits and validation settings.
- Every combination has a unique native master, correct height/radius and bound editable properties.
- Value and Placeholder stay separately bound even when the field starts empty; Clear's native control remains bound.
- Selected preview and matching master IDs survive redraw; readback remains valid.
- Downloaded HTML matches tested control geometry; typing/Clear, trailing-icon restoration, required/readonly/maxlength zero, rem, dark and RTL paths work.
- Actual HTTP job acceptance/polling/native-worker transport is exercised without intercepted Draw requests.
- The built bundle connects and answers health requests without receiving any iframe message.
- Disconnected draws fail promptly, duplicate clicks cannot enqueue another draw, and lost/late acknowledgement does not rerun the component.

**Boundary:** the automated scene API remains a test double. Its screenshots are web/HTML images. Inspect the real component and its exported PNG before claiming live canvas parity.

## Run and inspect the real plugin

```sh
node tools/component-bridge.cjs
```

Import `/Users/user/Documents/Agentic Design System 2/figma-plugin/manifest.json` in Figma Development plugins, then open it. A manifest change requires reimport; a code-only rebuild requires reopening. Verify the v6 native-fetch build and connected status. Open `http://127.0.0.1:3333/input-text-field.html` and customize/draw.

Health and read-only checks:

```sh
node tools/figma-job.cjs ping
node tools/figma-job.cjs inspect input-text-field
node tools/figma-job.cjs preview input-text-field
```

Inspection includes actual property definitions, all variant names/options/counts, and the selected master's part types/dimensions/visibility/references. Full bindings are omitted for sets above 256 masters. Preview exports the actual generated Figma instance as PNG to the live evidence folder. `pull` reconstructs a contract and updates metadata/authority, so it is not read-only.

An actual live CTA check can seed the original settings captured earlier:

```sh
ADS_PLAYWRIGHT_PACKAGE=/absolute/path/to/playwright-core \
node tools/check-live-input.cjs audit/input-size-radius-2026-10-30/live/sent-contract.json
```

This submits a real scene mutation. Use the linked test document, inspect its current state first, and preserve meaningful Figma edits/revisions. Its output is saved under `audit/plugin-repair-2026-10-30/live/`.

## Remaining acceptance boundaries

- Current live result is recorded below when available. Earlier stalls and user-reported build text alone do not prove a component was drawn.
- Verify helper text and supporting slot behavior in the actual selected master, icon replacement, independent Boolean controls, and visual sizing against the web preview.
- Browser validation and Clear callbacks do not run in a Figma instance. Native visibility controls are independent.
- Focus outline-offset is approximated as a spread effect. The generic adapter is not a complete arbitrary CSS renderer; unsupported grid/shadow/font cases need targeted evidence.
- Fixed HTML IDs need per-instance scoping when composing multiple exported Inputs in one document.
- Other components still need authored-contract and live review. Shared transport/capture fixes do not automatically give every component a complete native property model.

## Evidence and continuation

Current automated evidence: `audit/plugin-repair-2026-10-30/`. Current live evidence: its `live/` subfolder. Earlier 24-variant and all-size attempts remain in `audit/input-export-2026-10-30/` and `audit/input-size-radius-2026-10-30/`. The previous long-form handoff is preserved as `audit/plugin-repair-2026-10-30/previous-handoff.md`.

For the next AI: preserve dirty work; verify native health before a draw; use actual property/PNG readback; distinguish real HTTP transport from simulated scene acceptance. Inspect partial imports before retrying a timed-out draw. Update this handoff with exact live results and limitations.

API references: [Figma network requests](https://developers.figma.com/docs/plugins/making-network-requests/), [component properties](https://developers.figma.com/docs/plugins/working-with-component-properties/), [ComponentNode](https://developers.figma.com/docs/plugins/api/ComponentNode/).


### Latest live diagnostic

The first v6 import was rejected because Figma's `devAllowedDomains` validator does not accept the numeric loopback URL. The manifest/runtime now use only `http://localhost:3333`; the server's IPv4 and IPv6 loopback endpoints were verified to share the same broker. A regression checks that the built runtime's network origins are declared by the manifest.

The user subsequently reported the title **“Figma Desktop Bridge.”** This project's manifest registers **“Agentic Contract Bridge.”** The native server still had no registered consumer, so the user was directed to the correct Development plugin. This is a current diagnostic, not a successful live draw. Complete native ping before any scene mutation.
