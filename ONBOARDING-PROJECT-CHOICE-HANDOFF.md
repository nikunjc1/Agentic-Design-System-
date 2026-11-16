> Current onboarding now uses a one-question conversation, pinned answers, confirmation and real setup progress. See [CONVERSATIONAL-ONBOARDING-HANDOFF.md](CONVERSATIONAL-ONBOARDING-HANDOFF.md). This supersedes the older form flow below.

# Onboarding project choice and searchable History

Updated: 5 November 2026. Project: `Agentic Design System 2`.

## Requested experience

Start onboarding on a blank canvas with a centered heading, supporting copy and two choices. Existing project opens History. New project expands the setup form below the choices, with Continue at the bottom. The user explicitly confirmed the inline expansion.

## Implemented flow

- `new-project.html` has a quiet full-width layout with the existing top bar. The component navigation is hidden on this page.
- The heading asks “What type of project would you like to work on?” Both choices are centered; they stack on narrow screens.
- **Existing project** links to `history.html`.
- **New project** reveals `#projectSetupArea` underneath the choices, updates `aria-expanded`, moves focus to the setup heading and scrolls to the form. Reduced-motion preferences are respected.
- The original product/platform, identity and review steps retain required-field validation, Back, draft Resume/Discard, explicit Edit, Cancel and storage-error recovery. Continue/Save is at the bottom of the form.
- Starting a new project leaves the active saved project untouched until successful final Save. Cancel returns to the active saved details.
- `history.html` now lists real local project records instead of fictional release/activity tables. It includes project-name search, owner/product details, update dates, active-project state, Open project, New project, empty and no-match states. Search trims whitespace and ignores case.
- Opening an archived project restores its profile and saved Foundation records. Editing an existing project keeps its stable ID; renaming does not create a duplicate.

## Storage and limits

`project-model.js` owns persistence:

- Active profile: `ads:project-profile:v1` (existing schema version 2, additive `id`).
- Setup draft: `ads:project-draft:v1` (additive `newProject` flag preserves creation intent after reload).
- Local history: `ads:project-history:v1`, `{version:1, projects:[{id, profile, foundations}]}`.
- Foundation snapshots cover colors, surface/status/neutral colors, typography, spacing, sizing, radius, borders, interaction borders, shadows, icons, grid/layout, units and data formats. Raw saved records are retained, including uploaded assets stored inside those records.
- New-project Save archives the prior active profile and its current Foundation records, then starts the new project with no saved Foundation overrides. Editing keeps existing overrides.
- Profile/history/Foundation writes are rolled back together if storage fails. Unreadable or future profiles/history are preserved and block overwriting. Existing valid legacy profiles receive a stable legacy identity until saved.
- Switching projects archives the active project's latest Foundation records first. An unresolved setup draft blocks switching to a different project.
- UI preferences such as theme remain browser-wide. Component customization/contract records are also still browser-wide; this change does not provide complete per-project component libraries.
- This is browser-local history, not a server-backed team directory or published version log. Projects saved in another browser or by another user are unavailable until a shared authenticated storage service is added. The History page states this limitation. No sample team projects are presented as real records.
- Unused `overview-model.js` prototype workspace/resource data is a different storage model; it is not silently converted into complete project profiles because it lacks required product/platform and Foundation context.

## Files

- `new-project.html`: choice screen, expandable setup area, documentation disclosure.
- `history.html`: real local project list and search UI.
- `experience.css`: scoped onboarding and History layout, mobile behavior, form footer.
- `experience.js`: choice/expansion, history rendering/search/opening, new versus edit/draft behavior and saved-detail routing.
- `project-model.js`: stable IDs, history validation, Foundation snapshots, project opening and transactional persistence.
- `foundation-contract.json`: authoritative onboarding flow description.
- Generated `foundation-model.js`, Foundation defaults/manifests and documentation catalog/audit: refreshed from the sources using existing generators. Existing stale design-token output was also regenerated from the current theme for the release freshness gate.

Routes: `new-project.html` shows choices; `?new=1` opens a fresh form; `?saved=1` shows the active saved project; `?edit=1` explicitly edits it. Draft/recovery notices can reveal setup automatically so saved work remains recoverable.

## Verification

Evidence: `audit/project-entry-2026-11-05/` contains browser-check results and desktop/mobile screenshots in both themes. Browser tests use isolated temporary local storage; no real user projects are created by these checks.

Commands:

```sh
node --test tests/project-model.test.js
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-project-entry.cjs
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-onboarding-flow.cjs
bash tools/release_check.sh
```

- Model tests cover stable IDs, save/edit, archive/reopen, Foundation restoration, failed-write rollback and preservation of unreadable data/drafts.
- `check-project-entry.cjs` exercises both entry choices, keyboard activation, blank new-project fields, resumed creation drafts, separate saved projects, search/no-match, reopening with Foundation restoration and Cancel. It checks the choice screen, expanded setup and History at 1440, 768, 390 and 320 pixels in light/dark themes. The recorded run passed with no browser JavaScript errors.
- The existing onboarding regression passed, including failed Save, guided Foundation completion and Markdown download, explicit Edit/Cancel, cross-tab conflicts, future-data recovery and responsive layout.
- The repository release check passed: all unit test suites and token, Foundation, implementation-contract, documentation-catalog and Figma-bundle freshness gates are current. Output is saved as `audit/project-entry-2026-11-05/release-check.log`. Local networking must be permitted because existing transport tests start localhost servers.

For further changes, keep `foundation-contract.json` authoritative and regenerate with `tools/generate_contract_docs.py`, `tools/generate_foundation.py`, and `tools/audit_pages.py`. Do not replace real history with illustrative release data. Adding shared team projects requires an API, user identity/access rules, durable per-project storage and a migration plan for these local records.
