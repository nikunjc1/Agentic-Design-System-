# Full-page recheck and corrections — 28 October 2026

Working copy: **Agentic Design System 2**. The original folder was not modified.

## What the earlier checks missed

The earlier smoke checks established that pages loaded and outer containers fit. They did not catch a component centered into an unscrollable clipped edge, or several real editing failures. Most save/export task checks used Button.

Before-fix browser evidence is retained in `before-results.json`.

| Confirmed failure | Scope | Correction |
| --- | --- | --- |
| Preview starts outside its scrollable frame | Add-on and Modal at 320px; Pagination at 390/320px; Table at 1024/768px | Safe alignment keeps the start of wide previews reachable; horizontal scrolling exposes the remainder |
| Empty atomic text loses its editor | Shared inspector | Retain the editor and its text-node target, including after selecting another part |
| An unsuitable token is accepted for a CSS property | Shared inspector | Resolve token aliases and validate the resulting type against the property |
| Reset retains selected appearance/state | Shared selection controls | Explicit empty/default selections override the previous UI selection |
| Text can move before an icon during export | Shared snapshot exporter | Serialize mixed text in its actual child order |
| Export omits grid, gradient and other layout details | Shared snapshot exporter | Capture grid tracks/gaps, gradients, individual borders/corners and other resolved layout properties |
| CSS decoration is omitted during export | Shared snapshot exporter, including Calendar event dots | Serialize supported before/after decorations into explicit contract parts |
| Month heading disagrees with dates and accessible labels | Calendar | Generate a 42-cell UTC grid from the entered month/year; account for leap years, year boundaries and week start; reject invalid month text |
| Interactive examples are buried in closed guidance | Affix, Dropdown, Splitter, Tree | Keep their existing working examples visible in the center column |
| Atomic settings and save actions are difficult to reach | All component details | Add Properties/Atomic styles shortcuts and retain the action area while the inspector scrolls |

## Current verification

- Result: **PASS**.
- All **159 site URLs** checked at four widths: **636** page/viewport checks.
- **334** documentation view toggles and **4** Foundation storage/recovery scenarios passed.
- All **69 component details** inspected across **1067 appearance/state combinations**.
- Component geometry checked at 1440, 1024, 768, 390 and 320 pixels.
- Every inspected state checked for a visible selected preview, valid contract, preserved text order and exported grid structure.
- Runtime errors: **0**; invisible states: **0**; clipped-start pages: **0**; invalid contracts: **0**; export structure failures: **0**.
- The companion workspace suite checks preservation of all 262 existing controls, saving/reload, cancellation, reset, copy/export, state isolation, old listing redirects, dark mode and RTL.

These are automated checks plus a screenshot review. They do not certify complete accessibility, every possible user input or application business behavior. Screenshots block external fonts and use the available system fallback.

## Editing and component-specific checks

| Check | Result |
| --- | --- |
| Blank atomic text remains editable | pass |
| Wrong-type token is rejected | pass |
| Reset restores the initial appearance and state | pass |
| Selected multi-configuration survives Save and reload | pass |
| Calendar month, leap day, accessible dates and week start agree | pass |
| Calendar event decorations and grid layout survive export | pass |
| affix-default.html keeps its interactive demo visible | pass |
| dropdown-default.html keeps its interactive demo visible | pass |
| splitter-default.html keeps its interactive demo visible | pass |
| tree-default.html keeps its interactive demo visible | pass |

## Every component detail

[Open the searchable screenshot index](INDEX.html).

| Detail page | States checked | Widths checked | Screenshot |
| --- | ---: | ---: | --- |
| add-on-default.html | 18 | 5 | [View](add-on-default.png) |
| affix-default.html | 6 | 5 | [View](affix-default.png) |
| alert-default.html | 16 | 5 | [View](alert-default.png) |
| anchor-default.html | 10 | 5 | [View](anchor-default.png) |
| autocomplete-default.html | 12 | 5 | [View](autocomplete-default.png) |
| avatar-default.html | 12 | 5 | [View](avatar-default.png) |
| badge-default.html | 15 | 5 | [View](badge-default.png) |
| breadcrumb-default.html | 8 | 5 | [View](breadcrumb-default.png) |
| button-destructive.html | 48 | 5 | [View](button-destructive.png) |
| button-ghost.html | 48 | 5 | [View](button-ghost.png) |
| button-link.html | 48 | 5 | [View](button-link.png) |
| button-neutral.html | 48 | 5 | [View](button-neutral.png) |
| button-primary-icon.html | 48 | 5 | [View](button-primary-icon.png) |
| button-primary.html | 48 | 5 | [View](button-primary.png) |
| button-secondary.html | 48 | 5 | [View](button-secondary.png) |
| button-tertiary.html | 48 | 5 | [View](button-tertiary.png) |
| calendar-default.html | 6 | 5 | [View](calendar-default.png) |
| card-default.html | 15 | 5 | [View](card-default.png) |
| cascader-default.html | 12 | 5 | [View](cascader-default.png) |
| checkbox-default.html | 12 | 5 | [View](checkbox-default.png) |
| collapse-default.html | 6 | 5 | [View](collapse-default.png) |
| color-picker-default.html | 12 | 5 | [View](color-picker-default.png) |
| date-picker-default.html | 12 | 5 | [View](date-picker-default.png) |
| date-range-default.html | 12 | 5 | [View](date-range-default.png) |
| description-default.html | 6 | 5 | [View](description-default.png) |
| divider-default.html | 6 | 5 | [View](divider-default.png) |
| drawer-default.html | 12 | 5 | [View](drawer-default.png) |
| dropdown-default.html | 10 | 5 | [View](dropdown-default.png) |
| empty-default.html | 6 | 5 | [View](empty-default.png) |
| float-button-default.html | 12 | 5 | [View](float-button-default.png) |
| group-button-default.html | 12 | 5 | [View](group-button-default.png) |
| image-default.html | 8 | 5 | [View](image-default.png) |
| input-text-field.html | 18 | 5 | [View](input-text-field.png) |
| list-default.html | 8 | 5 | [View](list-default.png) |
| mention-default.html | 12 | 5 | [View](mention-default.png) |
| menu-default.html | 8 | 5 | [View](menu-default.png) |
| modal-default.html | 8 | 5 | [View](modal-default.png) |
| notification-default.html | 12 | 5 | [View](notification-default.png) |
| number-default.html | 18 | 5 | [View](number-default.png) |
| pagination-default.html | 8 | 5 | [View](pagination-default.png) |
| password-default.html | 18 | 5 | [View](password-default.png) |
| pop-confirm-default.html | 12 | 5 | [View](pop-confirm-default.png) |
| popover-default.html | 12 | 5 | [View](popover-default.png) |
| progress-default.html | 6 | 5 | [View](progress-default.png) |
| radio-default.html | 10 | 5 | [View](radio-default.png) |
| rating-default.html | 8 | 5 | [View](rating-default.png) |
| result-default.html | 12 | 5 | [View](result-default.png) |
| search-default.html | 18 | 5 | [View](search-default.png) |
| select-dropdown.html | 32 | 5 | [View](select-dropdown.png) |
| skeleton-default.html | 6 | 5 | [View](skeleton-default.png) |
| slider-default.html | 8 | 5 | [View](slider-default.png) |
| spin-default.html | 9 | 5 | [View](spin-default.png) |
| splitter-default.html | 6 | 5 | [View](splitter-default.png) |
| statistic-default.html | 12 | 5 | [View](statistic-default.png) |
| steps-default.html | 5 | 5 | [View](steps-default.png) |
| switch-default.html | 12 | 5 | [View](switch-default.png) |
| table-default.html | 10 | 5 | [View](table-default.png) |
| tabs-default.html | 8 | 5 | [View](tabs-default.png) |
| tag-default.html | 12 | 5 | [View](tag-default.png) |
| text-area-default.html | 18 | 5 | [View](text-area-default.png) |
| time-default.html | 12 | 5 | [View](time-default.png) |
| timeline-default.html | 9 | 5 | [View](timeline-default.png) |
| toast-default.html | 16 | 5 | [View](toast-default.png) |
| tooltip-default.html | 12 | 5 | [View](tooltip-default.png) |
| tour-default.html | 12 | 5 | [View](tour-default.png) |
| transfer-default.html | 8 | 5 | [View](transfer-default.png) |
| tree-default.html | 12 | 5 | [View](tree-default.png) |
| tree-select-default.html | 12 | 5 | [View](tree-select-default.png) |
| upload-default.html | 8 | 5 | [View](upload-default.png) |

## Limits and remaining product scope

The inspector supplies existing native controls and shared part-level editing. Dedicated data/behavior APIs from the earlier customization backlog are still distinct work: for example Table column/data authoring, Upload restrictions and authored interactive contract bindings. This recheck does not mark those recommendations implemented.

The component exports remain selected-preview snapshots. A real Figma bridge/import session has not been verified in this recheck.

## Repeat the checks

```sh
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-workbench-coverage.cjs
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-component-workbench.cjs
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core ADS_SITE_HEALTH_OUT=audit/workbench-site-health node tools/check-site-health.cjs
bash tools/release_check.sh
python3 tools/build_workbench_recheck_report.py
```

Browser and bridge checks require permission to bind localhost ports.
