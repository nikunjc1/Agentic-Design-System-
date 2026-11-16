# Settings screen removal

Completed 6 November 2026 in Agentic Design System 2.

The standalone Settings screen and its sidebar link have been removed. The header gear now opens a compact **Preferences** panel containing Appearance (Light/Dark), Density (Comfortable/Compact), and Layout direction (Left-to-right/Right-to-left). Project Setup, Foundations, Markdown Export, Figma Export and NPM Package retain their existing responsibilities.

## Implementation

- Updated the shared header markup across the HTML pages. There are 160 remaining header preference buttons and no links or gear handlers pointing to `settings.html`.
- `shell.js` builds one accessible, non-modal popover per page using labeled native selects. Escape and the close button restore focus to the gear; outside clicks and moving focus away close the panel.
- Existing `ads:theme`, `ads:density` and `ads:direction` keys are retained. Existing choices survive this change, persist across navigation/reload and synchronize across tabs. If storage is blocked, the panel reports that changes apply only to the current tab.
- `shell.css` uses the system's Foundation tokens for surfaces, typography, spacing, corners, borders and focus treatment. The panel fits 320px mobile screens and mirrors with layout direction.
- `settings.html` is now a compatibility redirect to `overview.html#preferences`, which opens the header panel. The existing welcome-first entry rule remains in effect for fresh external visits.
- Removed Settings-only profile/progress rendering from `experience.js`. Old `md-export.html?page=settings.html` links resolve to Overview; Settings is excluded from the generated documentation catalog.
- Regenerated the documentation catalog/page audit. Updated `tools/visit-project.cjs` for the compatibility route.

## Verification

Eight browser checks pass in `audit/preferences-2026-11-06/results.json`: keyboard/focus behavior, persistence, cross-tab synchronization, old links/catalog exports, responsive layouts and dismissal, unavailable storage, fresh-entry behavior, and local `file://` operation. Screenshots cover three widths in both themes and directions.

All release unit suites and freshness gates pass. The static audit reports zero source issues across 162 HTML files; token integrity reports no dead references, duplicate tokens or cycles. The two redirect/entry files without header controls remain compatibility infrastructure, not Settings screens.

```sh
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-preferences.cjs
python3 tools/audit_pages.py --check
node tools/foundation-integrity.cjs --json
bash tools/release_check.sh
```

Browser tests use isolated profiles and require Chrome and localhost access. No existing user projects or stored preferences were reset. Refresh an already-open page to load the new header menu.
