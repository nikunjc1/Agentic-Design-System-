# Foundation customization → Components: UI verification

Date: 6 November 2026
Project: `/Users/user/Documents/Agentic Design System 2`

## Outcome

All **46 customization/save/reload scenarios across all eight Foundation tabs pass**. The checks use real Chrome controls and the **Save foundation** button. They do not inject saved Foundation settings or call the model to apply them. All **69 component exports** also passed contract validation, token-reference checks and current-token parity. The project release gate passes.

The browser uses isolated contexts, so these tests do not change the user's saved project settings. This extends the earlier programmatic component audit documented in `COMPONENT-FOUNDATION-LINKS-HANDOFF.md`.

## Confirmed issues and fixes

1. **Dark brand was ignored.** `foundation-model.js` read the light brand regardless of theme. It now reads the active theme and falls back to the light brand for legacy records without a dark value.
2. **Compact radius snapped from 6px to 4px.** Added 6px to 32 component radius menus; all 33 menus now contain every medium-radius philosophy value. Existing explicit choices remain overrides. Updated generated-code option counts to match the actual menus.
3. **Pill Tabs did not render all numeric radii.** `tabs-detail.js` depended on a partial CSS class map. The active pill tab now renders the selected radius directly, including 6px and 16px. Underline tabs retain their shape.
4. **Composite component borders ignored state colors.** `shell.css` now connects existing default/state border declarations to the applicable `--border-state-*` token, with the original token as fallback. This includes form controls, semantic Alert borders, selected Cards and active Tabs. Border widths and variant geometry remain separate.
5. **Saving Borders introduced unedited state overrides.** `borders.js` now persists changed state rows only. Unchanged factory colors remain inherited. The model also prevents legacy factory default/disabled swatches from masking a customized base border.
6. **Border opacity differed from the selected value.** Removed the one-alpha-step adjustment from `--line-strong`. Exact 70% now renders as 0.7. Authored CSS bindings already preserve the distinction between border-token roles, so altering their rendered colors is unnecessary.
7. **Dashed icons stayed solid in component previews.** `foundation.css` now applies the saved dashed setting to outlined `stroke="currentColor"` SVGs, excluding `data-fixed-icon` assets.

Generated Foundation/default token artifacts were refreshed. Regression coverage was added to `tests/foundation-model.test.cjs` for active-theme brand, exact border opacity, legacy neutral state behavior and exact radius-menu coverage.

## UI coverage

| Foundation | Saved controls and component checks | Scenarios |
| --- | --- | ---: |
| Colors | Light/dark brand on Primary Button; saved surface, status and neutral tokens in the component | 3 |
| Grid & Layout | All four layout systems, 6 columns, 36px gutter and baseline preference reach component context | 5 |
| Typography | Body size, weight, line height, italic, selected Manrope family, letter spacing and label color on Input | 3 |
| Spacing | All four spacing systems change Input field gap; shared 48px control height reaches Input | 5 |
| Radius | All five philosophies on Input; Compact on Button and pill Tabs; explicit 12px override survives a foundation change; Reset restores inheritance | 8 |
| Borders | Width, style, exact opacity, base color, bottom/start/all sides; all ten state colors on Input, Alert, Card and Tabs | 14 |
| Shadows | All five elevation philosophies on Modal's `--shadow-xl` role | 5 |
| Icons | Line/dashed style, size preference, stroke width and sharp/round joins/caps; Select glyph rendering | 3 |

Each scenario verifies that editing does not overwrite durable settings before Save. After Save it checks the open component tab, reloads the component, compares its Foundation tokens, and reloads the Foundation page to verify persistence. Transition settling is allowed before comparing rendered colors.

## Evidence

- `audit/foundation-ui-propagation-2026-11-06/results.json`: final 46-scenario result, including the successful focused Radius rerun.
- `results-before-fixes.json`: original findings; some early failures were corrected test expectations (Input gap and Modal shadow role).
- `results-before-tabs-correction.json`, `radius-recheck.json`: the final Tabs issue and successful recheck of every Radius scenario.
- `run.log`, `radius-recheck.log`: full and focused browser logs. The full log retains the original Tabs failure; the focused rerun supersedes that Radius group in the final report.
- `exports-69-pages.json`, `export-check.log`: 69 valid exported contracts, no missing token references; representative standalone HTML parity checks.
- `release-check.log`: all unit suites and generated-file/plugin freshness checks pass.
- `*-saved.png`, `*-component.png`: screenshots from each Foundation group.

## Applicability and limits

- Grid columns/gutters describe layout containers and exported layout context. They should not rearrange atomic anatomy such as calendar weekdays or button icon slots. The UI suite verifies context propagation here, not a redesigned application layout.
- Explicit component sizes/radii remain deliberate overrides until Reset. All current radius philosophies have exact menu matches; arbitrary control heights can still use the nearest supported component size.
- Icon sizing can be proportional to the component size. Filled glyphs and fixed assets retain their geometry. Selecting a source library does not replace every glyph automatically.
- Font-family binding and persistence were verified. External font downloads were blocked in the isolated test browser, so this does not certify remote font delivery.
- This verifies the browser app and generated component contracts. No live Figma document was modified or verified in this task.

## Reproduce

```sh
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-foundation-ui-propagation.cjs
node tests/foundation-model.test.cjs
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-foundation-exports.cjs
bash tools/release_check.sh
```

Use `ADS_GROUPS=Radius` to run one Foundation group and `ADS_REPORT_NAME=radius-recheck.json` to keep a separate report. The Playwright package path is specific to this workstation; other environments can install `playwright-core` and omit that variable. The runner uses the installed macOS Google Chrome executable.
