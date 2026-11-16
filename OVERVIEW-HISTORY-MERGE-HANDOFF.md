# Overview and History merge

Updated 6 November 2026 in `Agentic Design System 2`.

## Result

Overview is now the single project hub. It contains name search, saved projects, the active project's next Foundation/export action, an unfinished-draft notice, empty/no-results states and Clear search. The active project appears first. Each project can be reopened using the existing saved-profile and Foundation snapshot mechanism.

The header has one contextual action: **New project** without a draft, **Continue draft** with a readable draft, or **Review draft** when the saved draft needs recovery. The draft notice does not add a second button to the same destination. Starting fresh after restoring a draft still uses the existing chatbot Cancel behavior.

Removed the old Overview introduction, duplicate project-setup panel, library card grid and governance link list. Their destinations remain in the shared sidebar. Removed the separate History sidebar item throughout the root HTML pages.

Existing project on the welcome screen now opens `overview.html#projects`. Intentional in-app `history.html` navigation redirects there through `history-redirect.js`, using the same navigation handoff as the rest of the app. Fresh top-level visits still show the welcome page first, as previously requested. A static fallback link remains on History. No saved projects or storage keys were migrated or deleted.

## Implementation

- `overview.html`: unified project hub markup and single header action.
- `experience.js`: the existing project-history renderer now owns the Overview list, draft notice, active-project ordering and next action. The obsolete `setupOverview()` renderer was removed.
- `experience.css`: responsive project cards and draft notice, using existing library tokens.
- `history.html` / `history-redirect.js`: backward-compatible route and fallback.
- `new-project.html`: Existing project destination.
- Root HTML sidebars: removed the redundant History navigation entry.
- `foundation-contract.json`: authoritative behavior description; generated contracts/defaults/catalog/token manifests refreshed.
- `tools/visit-project.cjs`: browser checks understand the legacy History alias. Conversation and site-entry checks now expect the unified Overview route.

`overview.js` is an older unused prototype and is not loaded by `overview.html`. Do not wire it into this page: it uses a separate workspace model. The active implementation is `experience.js` + `project-model.js`.

## Verification

Evidence: `audit/overview-history-merge-2026-11-06/`.

- `check-0.log` / `results.json`: empty/saved projects, one creation action, search and Clear search/focus, reopening, active export, draft continuation, legacy History redirect, unreadable-history protection, four widths and both themes.
- `check-1.log`: complete conversational setup, save rollback/retry, saved projects and Foundation restoration, draft and conflict handling.
- `check-2.log`: file and HTTP entry, normal navigation, legacy History, editor reload and component-preview behavior.
- `check-3.log`: full unit suites and generated-output freshness gates.
- Desktop/mobile light/dark screenshots and the empty desktop state were rendered; desktop light and mobile dark layouts were visually inspected.

Project history remains local to the current browser. This merge does not introduce shared-team storage, remote generation or a second project store.

Final result: all focused project-hub checks, the complete onboarding journey, file/HTTP entry checks and release gates passed. No History navigation entries remain; legacy links continue to resolve.
