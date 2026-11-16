# Component workspace experiment — 27 October 2026

## Working location

All implementation for this experiment is in `/Users/user/Documents/Agentic Design System 2`.
The original `/Users/user/Documents/Agentic Design System` was not edited for this experiment.

Open `button-primary.html` or another component detail page in this copy. The app is static and can be served with an ordinary local HTTP server. Use a different origin/port from the original if both versions are open: browser storage is scoped to origins, not folders. New workspace settings have their own storage prefix; Foundation and project preferences retain their existing prefixes.

## Requested flow

Component navigation → component detail → centered showcase → customization inspector on the right → save or export.

All 69 detail pages were visited in a browser before implementation. The starting pages had preview matrices and customization panels above the preview. Their earlier detailed customization audit remains under `audit/component-customization-2026-10-27/`.

## Implemented

- Removed “All components” from sidebar navigation.
- Changed component navigation and static links to go directly to detail pages.
- Retained 63 former listing URLs as redirects, so bookmarks and older links continue working. Their old HTML remains on disk as a compatibility fallback; those pages no longer appear in the normal navigation flow.
- Kept all eight Button detail pages reachable through the Button style selector.
- Added the shared workspace to all 69 component details.
- Added a central showcase of one actual rendered component. The existing component renderers and their event handlers produce the preview; the showcase is not an image or cloned substitute.
- Added selectors for appearance, state and configuration, where multiple configurations exist.
- Kept the full preview matrix behind “Compare states”.
- Moved all 262 existing customization controls to the inspector, including the Avatar.Group control previously outside the main Properties section.
- Retained usage guidance, accessibility notes and Machine View in the expandable guidance section below the preview. Interactive Affix, Dropdown, Splitter and Tree examples remain visible in the center column.
- Added part selection across the rendered component anatomy on every detail page.
- Added explicit Save changes, Cancel and Reset for browser-local customization.
- Added selected-preview prompt, HTML and JSON exports and retained the Figma bridge action.
- Added responsive stacking of the inspector beneath the preview on narrow screens.

## Atomic inspector

The part selector lists the component root and its rendered descendants, using element names, accessible names and text fragments to identify them. Editing a part changes the existing element and preserves its children and native listeners.

Available controls depend on the selected part:

- Direct text content, including labels and individual rendered table cells.
- Accessible name.
- Placeholder and value for input and textarea elements.
- Alternative text for images.
- Width, height, minimum and maximum width.
- Independent top, right, bottom and left padding.
- Gap and vertical margins.
- Font family, size, weight, line height, letter spacing and text alignment.
- Text, background and border colors.
- Border width, style and radius.
- Shadow and opacity.
- SVG fill, stroke and stroke width.

CSS values and existing Foundation token references are accepted. Invalid CSS, unknown token names and tokens unsuitable for the selected CSS property are rejected. Opacity accepts values from 0 to 1. Empty style fields restore the underlying library value. Placeholders show the current computed value.

Overrides belong to one configuration, appearance, state and anatomy path. An edit to a Rest-state button does not change Hover, Disabled or another configuration. Component properties such as the native button label retain their original broader scope. Switching a configuration changes which overrides are active; it does not delete the other configuration’s edits.

## Persistence and recovery

Storage key: `ads:workbench:v1:<detail-file-name>`.

The saved record contains the schema version, native control values, preview selection and per-part overrides. Saving stores this record explicitly. Unsaved edits remain a preview and trigger the browser’s standard navigation warning where supported.

- Save keeps both native properties and atomic overrides.
- Cancel restores the last saved settings, or library defaults when nothing has been saved.
- Reset clears this component’s workspace record and restores defaults.
- Reset selected part clears that part’s overrides in the current configuration; Save is needed to persist it.
- Unreadable or unsupported records are preserved until the user explicitly resets them.
- Cross-tab storage changes block further saves from the stale tab.
- A compare-before-write check detects changes even when a storage event was missed.
- Storage failures produce an inline error and do not claim a successful save.

## Export behavior and limits

The visible workspace actions export a **snapshot of the selected preview**, including the current text, values, styles, accessible names and Foundation tokens. This fixes the experiment’s handoff path for customized text and styles that the old independently generated code examples could omit.

The JSON follows the existing component contract schema and is validated before export. `ADSContracts.capture()` returns the selected workspace snapshot when a workspace is active. The Figma action uses that same capture path. HTML is produced by the existing contract compiler and renderer.

`ADSContracts.captureLibrary()` preserves access to the previous library capture behavior. `ADSContracts.open()` uses this library capture when opening the separate contract editor. The Component Contract menu item remains hidden.

Snapshot exports do not infer application business logic, add unseen variants, or synthesize interactive behavior rules. A table snapshot, for example, retains its configured rows and appearance but does not invent sorting APIs or data loading. JSON identifies this limitation in `source.kind` and `source.notes`. Interactive application behavior still needs authored contract bindings. Live Figma import has not been verified for this experiment.

The old native prompt/code mounts remain hidden inside the Properties panel for compatibility with the existing scripts. The visible workspace export buttons use the snapshot path. Historical audit findings about the old generators should not be marked resolved throughout the whole product on the basis of this experiment.

## Files

| File | Responsibility |
| --- | --- |
| `component-workbench-catalog.js` | Detail metadata, component families and old listing redirects |
| `component-workbench.js` | Workspace assembly, preview selection, native control preservation, atomic editing, persistence and selected-preview capture |
| `component-workbench.css` | Scoped workspace layout and responsive styling |
| `component-contract-runtime.js` | Workspace capture dispatch, preserved library capture, textarea/select runtime values |
| Root HTML files | Shared script/style loading and direct detail links |
| `experience.js` | Dynamically generated “Explore components” actions now point directly to a detail page |
| `tools/check-component-workbench.cjs` | Baseline audit and browser regression suite |
| `docs-catalog*`, `audit/page-inventory.*` | Regenerated documentation catalog and static page checks |

## Verification

Evidence is under `audit/component-workbench/`:

- `baseline.json`: all 69 starting detail pages visited, zero runtime errors.
- `page-checks.json`: workspace checks across all 69 details.
- `task-checks.json`: save/reload, cancel, reset, atomic text/style export, state isolation, validation, unreadable data recovery, concurrent changes, mode switching, Button style navigation and all legacy redirects.
- Before/after Button and Table screenshots, plus dark/RTL and mobile screenshots.

The suite checks each page at 1440, 1024, 768, 390 and 320 pixels, validates the exported selected contract, confirms every pre-existing property control is present, and applies a real atomic style change. External fonts are blocked during automated browser checks; screenshots use the available system fallback fonts.

Run the browser suite with an installed Playwright or playwright-core package:

```sh
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-component-workbench.cjs
```

Run the repository checks:

```sh
bash tools/release_check.sh
```

The bridge tests need permission to bind a localhost port. Regenerate the documentation catalog with `python3 tools/audit_pages.py` after modifying HTML.

## Remaining work

1. Review this experimental layout with real customization tasks, especially components with many parts or long property forms. The browser checks establish functionality; they are not a moderated usability study.
2. Implement the component-specific API/data editors from the previous 369-item customization backlog where product scope requires them. Examples include editable Table columns and data, Select option management, Upload restrictions, and date/calendar constraints. Those dedicated editors are not supplied by a generic part-style inspector.
3. Give authored part IDs to components whose anatomy changes dynamically. This experiment keys overrides by rendered child paths; structural changes can make an old path point at a different part within the same named configuration.
4. Add authored bindings and behavior rules to make full reusable component exports match the same level of customization. The current visible exports describe one selected rendered snapshot.
5. Decide whether native legacy prompt/code generators should be replaced product-wide after this experiment is accepted.
6. Verify the Figma bridge against a real Figma document, including variables, component updates and instance preservation.
7. Consider project-level or account-level saved component settings. Current workspace settings are per component and per browser origin, not synchronized across users or keyed to a project ID.
8. Consider property search, a friendlier anatomy tree, token controls tailored to each style property, and undo/redo after observing real use. These are follow-ups, not implemented features.

The original folder remains the reference version. No deployment or merge back into it has been performed.

## Follow-up recheck — 28 October 2026

The initial smoke checks missed clipping inside preview frames and several editing failures. The follow-up checked all 159 site URLs, all 69 component details, and 1,067 component appearance/state combinations. It corrected narrow-screen clipping, blank text editing, token type validation and Reset selection; improved inspector access; preserved mixed text, grid/gradient styles and CSS decorations in snapshots; and made Calendar's month heading, computed dates and accessible labels agree.

Calendar now handles leap years, week start and year boundaries. Invalid month input preserves the last valid preview and prevents saving an invalid setting. Event and range states remain examples.

See [the detailed recheck](audit/workbench-recheck/RECHECK.md) for per-page coverage, confirmed failures, corrections and remaining product scope, or [the screenshot index](audit/workbench-recheck/INDEX.html) to inspect every component detail.


## Foundation and shared controls completion — 28 October 2026

The follow-up unit, dropdown, color-control and Foundation-connection work is documented in [PENDING-TASK-COMPLETION-2026-10-28.md](PENDING-TASK-COMPLETION-2026-10-28.md). The workbench unit toggle now controls the shared Foundation unit; native dimensional IDs stay canonical while fields, labels, geometry readouts and exported CSS use the selected unit. Radius menus and supported control-height menus follow Foundation until explicitly customized, with a control to restore inheritance. The saved workspace record includes optional `foundationFollow` metadata; legacy records retain their explicit native values.

Shared dropdowns escape inspector clipping, track their anchors, fit the viewport and retain their original native checkbox events. Atomic color fields now have aligned RGB swatches, and the Foundation picker supports short viewports. Workbench typography, spacing and control borders now consume Foundation tokens. These fixes complete the active control requests; the separate product backlog in “Remaining work” still describes additional component APIs, authored contracts and live Figma acceptance.
