# Export & Handoff: Markdown and Figma consolidation

Completed: 6 November 2026
Project: Agentic Design System 2

## Result

Markdown Export and Figma Export now share one **Export & Handoff** navigation entry and page. The canonical file remains `md-export.html` to preserve existing per-guide links. Select the Markdown or Figma tab on that page. `figma-export.html` redirects to `md-export.html?format=figma` through the existing app navigation system.

The welcome-first entry behavior remains: a fresh external visit first reaches the project choice screen. Interior navigation reaches the requested export screen normally.

## What changed

- One project-context message and one component picker serve both formats.
- The picker supports search, category disclosure, category selection, Select all/Clear, and accurate counts. Searching does not alter selections.
- Switching formats preserves component selection, search, Markdown scope, optional contact details and foundation-section choices during the current page visit. An active Figma export also continues across tab switches. This is in-page state, not a new persistent cross-session selection store.
- Markdown retains preview, refresh, copy, clipboard fallback, `.md` download and guide-specific `?page=...` exports. Contact details remain excluded by default. Markdown works under `file://` without fetching its catalog.
- Figma always includes the complete resolved foundation token set. The optional Markdown foundation filter is hidden on that tab so it cannot imply a partial Figma token export.
- Figma checks the real local bridge's `/bridge/status` response and requires the expected protocol/project plus a connected plugin before starting capture. It displays progress, warnings, partial failures, connection errors and successful completion. A running export cannot be started a second time.
- Under `file://`, Figma export is disabled and provides a link to the bridge-served Figma tab; Markdown remains usable.
- The shared manifest uses the library's Actions, Forms, Navigation, Feedback and Data Display categories. It provides 63 selectable entries covering all 69 component guides: seven standard Button appearances share one family; `button-primary-icon.html` is a separate entry. The previous Figma manifest incorrectly folded that icon component into a family capture that did not include it.
- Old AI handoff anchors and selected-guide URLs remain valid. Product terminology in Copywriting now describes the unified page and its two formats.

## Implementation map

- `md-export.html`: unified page, format tabs, shared picker, Markdown controls/preview, Figma connection/results and instructions. Loads the contract model before `shell.js`, plus the manifest before `experience.js`.
- `export-handoff.js`: accessible tab selection, arrow/Home/End keyboard handling, URL format state and format visibility. Does not rebuild or reset the picker.
- `experience.js`: Markdown generation and shared picker rendering from `ADSComponentManifest`, including all standard Button documentation files.
- `component-manifest.js`: shared category names and per-entry documentation files; separate icon button.
- `figma-export.js`: reads the shared checked files, checks bridge readiness and calls the existing `ADSFigmaBridge.exportCatalog`. Keeps status/results separate from Markdown status.
- `guide-export.css`: scoped layout, format controls and responsive styles using existing foundation tokens.
- `figma-export.html`, `merged-page-redirect.js`: old Figma URL compatibility.
- Site HTML sidebar links: one Export & Handoff link; duplicate Figma navigation removed.
- `tools/visit-project.cjs`: test navigation understands the Figma redirect.
- `tests/shell-figma-bridge.test.cjs`: guards contract-model loading on the unified page and its file-protocol bridge URL.
- Generated documentation/catalog/inventory refreshed through `tools/audit_pages.py`.

No plugin runtime or component-detail export implementation was changed for this merge.

## Verification

- `tools/check-export-handoff.cjs`: browser checks for manifest coverage, shared selection, keyboard tabs, an actual disconnected bridge, mocked plugin dispatch/results/error handling, in-progress tab switching, legacy URLs, file-based Markdown download, and responsive layout at 1440, 768, 390 and 320 pixels in both themes.
- `tools/check-guide-export-optimization.cjs`: existing 11-check regression suite passes, covering Principles and Markdown privacy, foundation selection, search, empty-state recovery, clipboard fallback, actual downloads, responsive layouts and guide links.
- `python3 tools/audit_pages.py`: 162 pages, zero source issues.
- `node tools/foundation-integrity.cjs`: zero duplicate primitive keys, unresolved CSS variable references or circular aliases.
- `bash tools/release_check.sh`: all unit suites and freshness gates pass.

Evidence and screenshots: `audit/export-handoff-2026-11-06/`. Existing Markdown regression results: `audit/guide-export-2026-11-06/results.json`.

Browser tests use an isolated Chrome profile and an ephemeral local bridge. Plugin success and partial-failure responses are explicitly mocked at the UI boundary; **a live Figma document import was not verified in this task**. Existing bridge/adapter unit tests still pass. A final live check requires Agentic Contract Bridge open and connected in the intended Figma document.

## Reproduce and continue

1. Run `node tools/component-bridge.cjs` from the project directory.
2. Open the portal through `http://127.0.0.1:3333/`, enter the workspace, and choose Export & Handoff.
3. Select a small component set, switch between Markdown and Figma, and confirm the same components remain selected.
4. Copy/download Markdown. For Figma, connect Agentic Contract Bridge, check the connection and export. Inspect the actual components, bindings and reported warnings in Figma.
5. After edits, regenerate the catalog with `python3 tools/audit_pages.py`, then run the browser checks and `bash tools/release_check.sh`.

Browser scripts use `playwright-core`; set `ADS_PLAYWRIGHT_PACKAGE` to the installed package path if it is not available through normal Node resolution. They currently launch `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.

Keep this merge's scope separate from the repository's many pre-existing changes. Do not reset other work or infer a live Figma verification from the simulated UI tests.
