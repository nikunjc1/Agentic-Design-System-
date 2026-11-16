# Component customization and export audit

Project: Agentic Design System 2. Date: 6 November 2026.

## Verified results

- **69/69 detail pages pass** across all five categories.
- **415 controls**, **1,189 customization cases** and **1,217 Appearance/State checks**.
- **276 export button checks**: Copy prompt, Copy preview code, Download JSON and Download HTML on every page.
- **207 responsive checks**: all customized pages fit their page containers at 1440, 390 and 320 pixels. Wide interactive compositions scroll within their preview.
- **552 Foundation scenarios**: 8 independent groups × 69 detail pages; no runtime errors. Applicability caveats are documented below.
- **14 targeted regression checks pass**, including real clipboard reads/writes, export-failure recovery, conditional controls, native label focus, and file:// downloads. Raw no-change observations in the bulk report have explicit `reviewResolution` entries.
- All release unit suites and freshness gates pass. Token integrity reports no duplicates, dead references or cycles.

| Category | Detail pages |
| --- | ---: |
| Forms | 22 |
| Navigation | 8 |
| Feedback | 12 |
| Data Display | 17 |
| Actions | 10 |

## Scope and method

The audit uses the 69 detail pages registered in `component-workbench-catalog.js`. Tests run in isolated Chrome contexts, using the actual inspector controls, Save button, Copy prompt, Copy preview code, Download JSON and Download HTML buttons. Existing user projects and browser settings are not changed.

Every available Appearance/State combination is selected. Each native enumerated customization option is exercised separately, text fields receive new content, numbers are changed within their bounds, and booleans are toggled. Conditional error, supporting-text and feedback fields are exposed through their switches. This is not an exhaustive Cartesian test of every possible combination of arbitrary user content and settings.

After customization, the check saves, reloads and compares the complete configuration. It validates the prompt's embedded contract and downloaded JSON, verifies their native property values and Foundation tokens, opens the downloaded HTML, and compares its text and representative computed Foundation styles with the live preview. It also checks unique exported DOM IDs, runtime errors and page overflow at 1440, 390 and 320 pixels.

The bulk audit intercepts the shared clipboard writer to inspect its exact payload. A separate regression check performs real browser clipboard writes and reads through both copy buttons. It also verifies a customized JSON download from the `file://` launch path used by the project owner.

## Fixes

- **Exports changed customization:** several variant capture paths selected all sizes while gathering variants and did not restore the original controls. Capture now saves and restores the entire state, native controls and dirty state in `finally`, including failure paths. Export source metadata records the original selection, not the temporary Compare mode or expanded capture settings.
- **“All” leaked into saved values:** the synthetic multiselect shortcut had the native checkbox value `on`. Native state now reads and restores real options only. Restoration dispatches events only for values that actually changed.
- **Foundation styling could lag capture:** newly generated preview cells were sometimes captured before the Foundation mutation observer applied typography and data formatting. `ADSFoundation.preparePreview(scope)` synchronously prepares the captured subtree using the same existing binding functions as the live page.
- **Standalone HTML typography differed:** the exported document's body now inherits the Foundation body font family, size, weight and line height, including components whose root relies on inherited typography.
- **Duplicate input IDs:** the padding wrapper used during form-field capture retained the nested input's attributes. Identity and state attributes, including variant overrides, now belong to the native input. Exported Add-on labels correctly focus their input.
- **Unwanted Date Range text:** the shared form capture applied Color Picker's `value` binding to unrelated nodes named `value`, inserting `#FF031A` into Date Range output. That binding is now limited to Color Picker.
- **Slider formatting lost:** exported Slider values now retain the displayed prefix and suffix instead of replacing the formatted value with the raw number.
- **Badge overflow lost:** exported Badge count text now preserves the displayed maximum/overflow form, such as `20+`.
- **Avatar group feedback was separated:** the separate Avatar group example now appears beside its “Show as” control. A note distinguishes that example from the individual avatar exported by the main actions. Its spacing and heading use Foundation tokens.

- **Group Button Full–Pill exports failed:** Full–Pill was present in the inspector but filtered out of the export's radius enum. The capture now includes every offered radius.
- **Dynamic segment labels were not saved:** Group Button label inputs now have stable native property roles. Restoring saved settings resolves each control after earlier changes, so changing the segment count cannot leave restoration pointing at detached inputs.
- **Rating inserted an unselected word:** an empty custom feedback label now stays empty in exports instead of becoming “Good.”
- **Long interactive examples overflowed the page:** the interactive preview owns horizontal scrolling, with safe alignment so the first segment remains reachable. This supports Group Button at its nine-segment setting and Rating at ten items without widening the page.

## Relevant files

- `component-workbench.js`: inspector, native state, capture transaction, property bindings and field anatomy.
- `foundation-runtime.js`: scoped preparation of preview typography and data formatting.
- `component-contract-runtime.js`: standalone HTML document typography.
- `component-workbench.css`: Avatar group inspector styling and contained interactive scrolling.
- `group-button-detail.js`: stable property roles for the dynamic segment label editors.
- `tools/check-component-actions.cjs`: complete control/save/export browser audit.
- `tools/check-component-export-regressions.cjs`: clipboard, failure recovery, conditional interactions, native input semantics and local file launch checks.
- `tools/check-component-foundations.cjs`: supports `ADS_AUDIT_OUT` to keep this run's Foundation evidence separate from prior audits.

## Evidence and reproduction

Evidence is in `audit/component-actions-2026-11-06/`. `verified.json` consolidates the full-library control/export run and the final Group Button and Rating rechecks; `results.json` and the pilot reports retain the earlier findings. `exports/` contains the actual downloaded artifacts and copied preview code. `regressions.json` records targeted behavior checks. `foundations/after.json` records the eight independent Foundation fixtures across all 69 pages. `foundation-integrity.json` checks token definitions, references and cycles. `responsive-verified.json` checks all saved customized pages at three widths after the scrolling fix. `inventory.json` confirms there are no unidentified inspector inputs outside the explicitly handled selectors and unit controls.

```sh
export ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core
ADS_REPORT_NAME=verified node tools/check-component-actions.cjs
node tools/check-component-export-regressions.cjs
node tools/inspect-component-overflow.cjs --all
ADS_AUDIT_OUT=audit/component-actions-2026-11-06/foundations node tools/check-component-foundations.cjs --after
node tools/foundation-integrity.cjs --json
python3 tools/audit_pages.py --check
bash tools/release_check.sh
```

The browser scripts require Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` and permission to listen on localhost. To inspect a subset, set `ADS_PAGES` to comma-separated detail filenames and use a separate `ADS_REPORT_NAME` to retain the full-library report.

## Interpretation and boundaries

- All eight Foundation groups are checked independently: Colors, Grid & Layout, Typography, Spacing, Radius, Borders, Shadows and Icons. A Foundation need not visibly change every component: grid affects layout context, flat controls stay flat, and glyph appearance depends on whether the component has a compatible icon. Explicit component size/radius choices remain intentional overrides; Reset restores Foundation following. The earlier real Foundation-editor checks are documented in `FOUNDATION-UI-PROPAGATION-HANDOFF.md`.
- Notification placement affects its viewport example. Avatar group display affects a separate composition. Group Button selection, Rating “Allow clear” and Slider “Step” affect their interactive examples. Rating feedback requires a selected score; Select defaults appear in Filled/Open states. Badge maxima require a count above the threshold; Float Button badge controls require its badge to be shown. These are tested separately rather than treating a static matrix with no visible change as a defect.
- Prompt and HTML contain a rendered component contract, including customization and Foundation data. They do not implement an application's backend or every behavior of a production component library. Selected previews and relevant interactive examples are verified here.
- Independent captures can have different generated DOM IDs. Equivalent text, settings and Foundation styles are compared rather than requiring byte-identical documents.
- Draw in Figma/live Figma document verification is outside this request's four export actions. No live Figma success is claimed by this audit.
- The earlier Design Principles and Markdown Export work is documented in `GUIDE-EXPORT-OPTIMIZATION-HANDOFF.md`.
