# Shared controls and Foundation connectivity — completion report

Date: 28 October 2026

Working folder: `/Users/user/Documents/Agentic Design System 2`

The original `Agentic Design System` folder remains the reference copy. This work has not been deployed or merged into it.

## Scope

This completes the active requests about the top-level px/rem switch, dropdown values and positioning, adjacent color pickers, and connection of the component workspace to Foundation. The audit covers all 69 component detail pages and the shared Foundation runtime. The older component-specific API, contract-authoring and live Figma backlog remains separately documented in `EXPERIMENT-WORKSPACE.md` and `IMPLEMENTATION-HANDOFF-2026-10-27.md`.

## Problems found and changes

| Problem | Cause | Result |
| --- | --- | --- |
| Changing px/rem did not change the whole workspace | The inspector used its own `ads:workbench:unit` preference rather than the shared Foundation setting | The top toggle now calls `ADSFoundation.setUnit()` and uses `ads:units` as the shared source |
| rem values did not convert back to px | Atomic field formatting only recognized a single px literal in one direction | Literal px/rem lengths convert both ways, including compound values such as shadows and grid tracks |
| Native dropdowns and workspace exports could disagree about units | Labels, authored styles and captured computed styles used different paths | Labels, atomic fields, captions, tokens, snapshot styles and exported context now follow the Foundation unit |
| Some edits could disappear when switching units | Matrix text labels formed the saved configuration key | Configuration keys are normalized to canonical px values; display labels can change without changing identity |
| Dropdown labels could show an earlier selection | The Foundation text cache assumed a reused text node always retained its original content | The cache tracks both canonical text and last rendered text, and adopts new renderer content |
| Button dimension captions converted only one dimension | The generic text converter recognized only the trailing numeric px value | The workbench formats width and height together in the chosen unit |
| An unfinished invalid style disappeared during a Foundation update | Refresh rebuilt the inspector from applied styles | Invalid draft text and its validation state survive Foundation/unit updates |
| Dropdown options were clipped by the inspector | Absolute panels lived inside an overflowing scroll container | Shared multiselects use the browser top layer where supported and fixed positioning, while remaining DOM children of their original control |
| Panels overflowed or became detached from their triggers | Positioning checked horizontal viewport space only | Positioning clamps horizontal bounds, chooses above/below, limits height and follows resize, scroll and visual-viewport changes |
| Dropdown arrows overlapped long values | Native select rules had inconsistent padding and arrow treatment | Workspace native selects reserve arrow space, use consistent arrows and support RTL |
| Atomic colors had only text inputs | Generic CSS field generation supplied no color control | Text, background, border, SVG fill and SVG stroke fields now have adjacent swatches |
| Color swatches stretched or misaligned | Broad input styles competed with color-input sizing | Swatches have bounded flex sizing, browser-specific swatch resets and matched heights |
| Choosing RGB for a transparent background could remain invisible | An RGB-only picker cannot edit alpha | Choosing a color from transparent starts an opaque color; existing translucent alpha is retained |
| Foundation color picker overflowed short screens | The popup had no viewport height bound and did not reposition after format changes | It clamps to the visual viewport, scrolls when necessary, preserves its color-selection areas and repositions for all five formats |
| Foundation radius changed in storage but an open component stayed stale | Native radius presets sampled Foundation at page initialization | Following presets update live to the nearest supported Foundation radius |
| Component control-height presets did not follow Foundation sizing | Native numeric preset menus retained their initial selection | Supported control-height menus now follow `--size-control` until explicitly customized |
| The new inspector contained fixed typography and spacing | Workspace CSS added independent pixel values and role metrics | Workspace spacing, dimensions, typography roles, control borders, radii and height now use Foundation tokens |
| Exported context omitted non-token Foundation choices | Snapshot context contained theme, unit and direction only | Context also includes grid system, icon family/style and resolved data-format settings; source records inheritance choices |

## Unit behavior

The flow is:

`Top unit toggle → ADSFoundation.setUnit → ads:units → Foundation resolver → root tokens → component workspace → selected-preview export`.

The existing Foundation convention remains **1 rem = 16 px** at the default browser root size. Examples:

| px | rem |
| --- | --- |
| 1px | 0.0625rem |
| 8px | 0.5rem |
| 24px | 1.5rem |
| 40px | 2.5rem |
| 48px | 3rem |

Switching units changes representation while preserving rendered geometry at the default root size. Percentages, em values, unitless line-height, font weights, opacity, time values, quoted text and Foundation token references retain their meanings. Bare numbers in dimensional atomic fields use the selected unit; a bare line-height remains unitless.

Native preset IDs and hidden canonical dimension inputs retain px values so existing component renderers continue receiving the values they expect. Visible paired controls and option labels present the chosen unit. JSON identifies canonical native dimensions with `source.nativeDimensionUnit: "px"`; `context.unit` describes anatomy style and token units. Authored override history retains the original entered values.

The unit preference persists across reloads and page navigation. A change in another tab updates the workspace through the existing Foundation storage-event path. The old workbench-only preference no longer controls the UI.

## Foundation inheritance and customization

Foundation remains the common source of tokens. A user can deliberately override a component property or a selected part.

For native radius menus and supported control-height menus:

1. A new, uncustomized workspace follows the relevant Foundation value.
2. The nearest available native preset is selected; the menu still represents the actual finite preset choices the component supports.
3. Choosing a preset manually records an explicit component choice and turns following off for that property.
4. “Foundation radius” or “Foundation size” restores following for that property.
5. Save persists both selected native values and `foundationFollow` metadata.
6. Reload preserves following. Later Foundation changes update following values.
7. Cancel restores the saved choices and inheritance state. Reset restores the default following behavior.
8. Legacy records without inheritance metadata retain saved native choices as explicit values, avoiding a silent change to existing customizations.

Control-height following is applied to numeric `size-mount` menus that include 40px and whose options are within 24–56px. Avatar dimensions, font sizes, icon boxes and other geometric size models retain their component-specific semantics. They are not treated as control heights.

Atomic values such as `var(--space-12)` remain connected to Foundation. An explicit value such as `24px` is an intentional override. Clearing the field restores its underlying component value. Part overrides remain scoped to configuration, appearance, state and anatomy path; changing a Foundation preset can select a different configuration with its own overrides.

## Foundation coverage

| Foundation category | Connection checked |
| --- | --- |
| Project context | Existing project setup and Foundation recommendation/save/edit flows |
| Brand colors | Saved light/dark brand values, derived action tokens and snapshot parity |
| Surface colors | Page, panel and raised surface tokens |
| Status colors | Success, warning, danger and info tokens and derived foregrounds |
| Neutral colors | Control borders and neutral palette |
| Typography | Role sizes, font families, weight, tracking, line height and workspace control roles |
| Spacing | Shared spacing tokens and live token-backed atomic padding |
| Radius | Semantic tokens, native preset following, explicit override and return to Foundation |
| Borders | Width, style, color, opacity and control styling |
| Border states | Focus-state values and exported token parity |
| Shadows | Resolved elevation tokens and selected-preview capture |
| Icons | Size, stroke, corner and selected family/style context |
| Grid and layout | Columns, gutters, system context and existing layout bindings |
| Sizing | Control height, target, icon, content and sidebar tokens; supported native control-height following |
| Data format | Resolved locale/format configuration in exported context and existing value formatting |
| Units | Global px/rem propagation, physical-size preservation, cross-tab and navigation behavior |

The dedicated browser audit independently changes 15 saved Foundation record categories on each detail page: **1,035 propagation checks**. It checks exact live-token parity between the resolver, root declarations and selected-preview JSON, validates each contract, and checks non-token context. It also records changes in rendered component parts and checks following native presets.

A category may not change a particular selected specimen visually: a divider has no icon, a resting state does not display its focus ring, and px/rem switching should preserve geometry. This is recorded in the evidence rather than counting every category as a visible change on every specimen. Explicit local values retain precedence.

## Color-control behavior

- Atomic text fields continue accepting valid CSS colors and suitable Foundation tokens.
- The adjacent RGB swatch mirrors the effective color, including resolved token values.
- Selecting RGB updates the existing text field and goes through the same validation, override, preview, save and export path.
- Translucent colors retain alpha; a transparent color becomes visible when a new RGB color is chosen.
- Transparency can still be typed explicitly in CSS/hex syntax.
- Native Foundation and Typography swatches retain their original field bindings and save behavior.
- The Foundation custom picker retains its existing policy: opacity there is preview/copy only and saved Foundation swatches remain opaque. The existing UI explains that policy.
- The Foundation picker exposes its dialog relationship and expanded state. Escape returns focus to its trigger.

## Dropdown behavior

Shared multiselects preserve their fieldset, legend, native checkboxes, selected values, change handlers and save bindings. The top-layer rendering changes placement without moving options away from their owning control.

Panels fit the viewport, scroll when required, stay aligned during resize/scroll, and open above a trigger when below has insufficient room. Opening a different panel closes the first. Outside click, leaving the control with keyboard focus, and Escape dismiss the panel. Escape returns focus to the trigger. Arrow, Home, End, Enter and Space retain the existing native-checkbox navigation model.

Browsers supporting the Popover API get top-layer rendering. The fixed-position fallback retains the same DOM and placement calculations; automated rendered acceptance was performed in Chromium.

## Files changed for this follow-up

| File | Responsibility |
| --- | --- |
| `foundation-runtime.js` | Public shared unit setter; unit-label cache that supports renderer updates |
| `component-workbench.js` | Global units, stable selection keys, converted styles/captions, swatches, invalid-draft preservation, Foundation preset following and exported context |
| `component-workbench.css` | Foundation-backed workspace styles, select arrows, color-field alignment and following controls |
| `multiselect.js` | Top-layer panel lifecycle, viewport collision handling, focus and anchor tracking |
| `shell.css` | Shared panel and swatch geometry, picker scrolling |
| `foundations.js` | Picker viewport bounds, format repositioning, dialog relationships and visual-viewport tracking |
| `tools/check-design-controls.cjs` | Shared-control and Foundation browser regressions, evidence and screenshots |
| `EXPERIMENT-WORKSPACE.md` | Link to this completion record and current behavior |

## Verification and evidence

The audit scripts serve the local copy, run headless Chrome and close their test server on completion. External font requests are blocked for repeatability. Evidence is stored under `audit/design-controls-2026-10-28/` and the existing workspace audit folders.

| Check | Coverage |
| --- | --- |
| `tools/check-design-controls.cjs` | 69 detail pages, 184 shared-dropdown checks, 1,035 Foundation propagation checks, unit/save/reload/cross-tab cases, live radius and control-height following, color editing and popup bounds |
| `tools/check-button-layout.cjs` | Eight Button detail variants across seven viewport widths; 56 layout cases plus editing/export checks |
| `tools/check-component-workbench.cjs` | All 69 detail pages, preservation of the 262 native controls, 12 save/cancel/reset/export/navigation/recovery tasks |
| `tools/check-workbench-coverage.cjs` | All 69 detail pages, appearance/state enumeration, selected-preview validation and ten behavioral regressions |
| `tools/check-setup-flow.cjs` | Project required fields, save/edit/cancel/reload; eight configurable Foundation editors; icon family persistence; invalid values; backup/restore; storage failures |
| `tools/check-site-health.cjs` | 159 URLs at four viewport widths, 636 layout checks, 334 guide toggles and four recovery scenarios |
| `tools/release_check.sh` | Unit suites and generated-token, Foundation, contract-documentation, page-inventory and Figma-bundle freshness gates |

The latest machine-readable run results are the authority for pass/fail status and counts. Screenshots include desktop/mobile/short-viewport Foundation pickers, open dropdowns and adjacent atomic color controls. Existing Button screenshots remain in `audit/button-layout-2026-10-28/`.

To repeat browser checks, set `ADS_PLAYWRIGHT_PACKAGE` to an installed `playwright-core` package and run the relevant `node tools/...cjs` command from this folder. The scripts use the installed Google Chrome application on this machine. Run `bash tools/release_check.sh` for unit and freshness checks.

## Final verification result

**PASS.** The completed runs cover 69 component details, 184 dropdown checks, 1,035 Foundation propagation checks, all 262 preserved native controls, 1,067 rendered appearance/state combinations, 56 Button layout cases and 159 site URLs across 636 viewport checks. Project/Foundation save-edit-recovery flows, final control-layout checks, unit suites and all freshness gates passed. Browser checks reported no page runtime errors. `git diff --check` passed.

See `audit/design-controls-2026-10-28/verification-summary.json` for the combined record, `results.json` for the full Foundation audit and `control-layout-results.json` for the final color-field and popup checks. The latter intentionally skips the full page matrix and leaves the full audit result intact.

## Remaining work outside these active fixes

The older product backlog is not replaced by this report. It still includes dedicated component data/API editors, stable authored anatomy IDs, full reusable behavior contracts, account/project-scoped synchronization, implementation comparison and real Figma acceptance. See “Remaining work” in `EXPERIMENT-WORKSPACE.md` and the prioritized sections of `IMPLEMENTATION-HANDOFF-2026-10-27.md`.

Icon-family metadata and uploaded reference assets do not automatically synthesize new 3D/isometric artwork. Selected-preview exports describe one rendered configuration. Live Figma variable binding, in-place component updates and linked-instance preservation require a real Figma document test. No deployment or publication was performed during this follow-up.
