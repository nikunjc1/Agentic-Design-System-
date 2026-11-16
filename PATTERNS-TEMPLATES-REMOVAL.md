# Patterns and Templates removal

Date: 6 November 2026
Project: Agentic Design System 2

## Changes

- Removed 318 Patterns/Templates navigation entries across the site's HTML pages.
- Removed both pages' content and replaced their URLs with minimal compatibility redirects to `overview.html`. This avoids broken bookmarks while removing the screens from the product.
- Marked both compatibility files with `ads-redirect`, excluding them from the generated documentation catalog and complete Markdown exports.
- Updated Export & Handoff's AI instructions to reference Component Guidelines and the sidebar component library. There are no remaining HTML links to the retired pages.
- Existing `md-export.html?page=patterns.html` and `?page=templates.html` requests now export Overview instead of failing on missing guides.
- Kept the welcome-first navigation policy. A fresh external visit still opens New Project; internal visits to a retired URL return to Overview.

## Files

- Site HTML navigation; `patterns.html`; `templates.html`.
- `md-export.html`: revised AI handoff instructions.
- `merged-page-redirect.js`: compatibility destinations.
- `experience.js`: selected-guide export aliases.
- `tools/visit-project.cjs`: test navigation destinations.
- `tools/check-navigation-merge.cjs`: extends existing checks for the retired routes and catalog exclusions.
- `tools/audit-missed-pointers.cjs`: removes copy-action checks for retired composition screens; retains component checks.
- Generated documentation and inventory refreshed with `python3 tools/audit_pages.py`.

## Verification

Passed: all seven checks in `tools/check-navigation-merge.cjs` using isolated Chrome, including retired routes, guide exports, desktop/mobile layouts and fresh-entry behavior. `bash tools/release_check.sh` also passes all unit suites and freshness gates. Browser evidence is saved under `audit/navigation-merge-2026-11-06/`.

The static page audit reports 162 files and zero source issues; that count includes compatibility redirects. Neither retired page appears in `docs-catalog.json`. Historical changelog and audit records are retained.

An initial browser check caught that `component-index.html` itself redirects to a single Button component, so it was unsuitable as a general destination. The final implementation directs retired-page URLs to Overview and links the AI instructions to Component Guidelines.
