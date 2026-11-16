> Overview now includes project history. See [OVERVIEW-HISTORY-MERGE-HANDOFF.md](OVERVIEW-HISTORY-MERGE-HANDOFF.md) for current navigation and project-list behavior.

# Project choices as the application entry page

Updated 6 November 2026 in `Agentic Design System 2`.

Every new or returning top-level visit starts at `new-project.html`, with **Existing project** and **New project** visible. The welcome copy is **Welcome to Agentic Design System**. Saved profiles and unfinished drafts remain intact; they do not automatically replace the choice screen.

## Entry points and navigation

- `Open Design System.command` opens `new-project.html` through the local bridge, preserving HTTP-dependent export behavior.
- The bridge’s `/` route now serves the project-choice page.
- `index.html` redirects directory/file openings to the project-choice page, with a normal link and meta refresh as fallbacks.
- `site-entry.js` is the first script on all workspace HTML pages. Direct bookmarks, new tabs, reopened conversation URLs and browser refreshes start at project choices. It works with both the supplied `file:///Users/user/Documents/Damco%20Agentic%20Design%20System%202/new-project.html` entry and local HTTP URLs.
- This is an entry rule, not a permanent “visited” flag. A short-lived, single-use navigation handoff permits intentional navigation after a user enters the application. Internal links and static Settings actions create handoffs. `ADSNavigation.go`, `replace` and `reload` cover programmatic navigation, component aliases, editor actions and explicit reloads.
- Session storage carries the handoff. A temporary window-name handoff also supports file navigation or unavailable session storage; the original window name is restored when consumed. Project/profile/Foundation local storage is never used as a visited flag.
- Browser history between application pages remains usable; returning from another site to the previous application page starts at choices.
- Component capture and preview frames bypass the top-level entry rule, so component export previews keep their own pages.

## Onboarding and saved work

`onboarding.js` reads profile/draft information without auto-opening the conversation on a plain entry URL. New project restores a readable unfinished draft directly into the chatbot, without the Resume/Back up/Discard interstitial. Only unreadable or unsupported saved records show backup/discard recovery. The chatbot Cancel action can discard the active draft. Selecting Existing project opens the Overview project hub, where a selected saved project can show its details through intentional internal navigation.

Explicit in-app `?new=1`, `?saved=1`, `?edit=1` and `?resume=1` navigation retains its meaning. Opening one of those URLs as a fresh external visit first shows plain project choices. Foundation Cancel and other explicit editor reloads preserve the editor rather than restarting entry.

## Files and maintenance

- Entry module: `site-entry.js`.
- Entry page/controller: `new-project.html`, `onboarding.js`.
- Launcher/index/server: `Open Design System.command`, `index.html`, `tools/component-bridge.cjs`.
- Shared and component navigation calls use `ADSNavigation` with their original location behavior as a fallback when the module is absent, such as in component preview frames.
- `foundation-contract.json` records the entry/recovery rules. Generated implementation contracts, Foundation defaults/manifests, token metadata and documentation catalog/audit were refreshed.
- New workspace HTML pages must load `site-entry.js` before page-specific routing scripts. Standalone exported artifacts are not application entry pages and should not add this redirect behavior.

## Verification and evidence

Evidence lives in `audit/site-entry-2026-11-06/`:

- `results.json` and HTTP/file returning-user screenshots from `tools/check-site-entry.cjs`.
- `model-tests.log` and `foundation-model-tests.log`.
- `release-check.log` for all unit suites and generation freshness gates.

The browser checks cover fresh interior links, legacy aliases, returning users with saved profile/draft records, new tabs with conversation parameters, manual refresh, automatic draft restoration after New project, normal navigation, Foundation Cancel, component preview frames, the server root and returning from an outside page. Both file and HTTP cases passed. The conversation regression and all eight Foundation editor regressions also passed.

Commands:

```sh
node --test tests/site-entry.test.cjs tests/onboarding-model.test.cjs tests/project-model.test.js
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-site-entry.cjs
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-conversation.cjs
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-setup-flow.cjs
bash tools/release_check.sh
```

Browser inspection tools that need an interior page use `tools/visit-project.cjs`, which enters through project choices and then uses the same explicit in-app navigation API. A direct `page.goto` intentionally models a fresh visit. Browser reload and explicit in-app reload have different purposes; tests should choose the appropriate operation.

For onboarding question definitions, validation, Foundation planning and transactional persistence, see `CONVERSATIONAL-ONBOARDING-HANDOFF.md`.
