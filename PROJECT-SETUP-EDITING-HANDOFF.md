# Project Setup: review and edit onboarding answers

Implemented 6 November 2026 in `Agentic Design System 2`.

## User flow

The **Project setup** sidebar item now opens `project-setup.html`. Opening a saved project from Overview also opens this page. Fresh visits continue to start at the welcome page, as required by the existing entry flow.

The saved view includes all eleven onboarding answers:

- **Project details:** project name, product type and platforms.
- **About you:** name, email, designation and project role.
- **Design choices:** brand color, spacing, corners and icons.

**Edit setup** prefills the form. Product type and role support their original “Other” descriptions; platforms allow multiple selections. **Save changes** validates and saves to the same project. **Cancel** discards unsaved edits. Changes remain available after reloading. The page uses existing Foundation tokens and supports both themes and mobile layouts.

## Persistence behavior

- Read the active profile through `ADSProject.read`. Use the saved onboarding answers when present; older profiles can fall back to the current Foundation settings for missing design choices.
- `ADSOnboardingModel.savedAnswers` produces the shared review/edit values.
- `ADSOnboardingModel.buildUpdate` creates a partial Foundation update. Metadata edits do not replay initial setup or reset any Foundation records.
- Changing brand, spacing, corners or icons updates only its corresponding Foundation. Recommended spacing is recalculated when the product/platform context changes. Existing detailed options, such as icon stroke, remain intact.
- Brand edits update the matching light/dark pair created during onboarding. A separately customized dark brand remains unchanged.
- `ADSProject.save` retains the project ID and updates its existing History entry. It uses the existing transactional write/rollback mechanism, with profile, draft and Foundation conflict checks.
- An unfinished onboarding draft must be finished or cancelled before editing the active setup. No draft is silently removed. Cross-tab changes disable stale saves; Cancel loads the latest saved values.
- A fresh browser without an active project sees New project and Existing projects actions.

## Changed code

- `project-setup.html`, `project-setup.css`, `project-setup.js`: saved-answer view and accessible editing form.
- `onboarding-model.js`: saved-answer normalization and selective Foundation updates.
- Sidebar links throughout the library, `experience.js`, `settings.html`: route Project setup, existing-project opening and edit actions to the dedicated page.
- `onboarding.js`: the legacy saved summary's Edit action opens the new editor. Existing conversational draft handling remains available.
- `foundation-contract.json` and generated documentation/default/catalog artifacts: document the new flow and refresh source inventories.

The original welcome and conversational onboarding page remains `new-project.html`.

## Verification

`tools/check-project-setup.cjs` completes actual onboarding in isolated Chrome, opens the new page through the sidebar, and checks:

1. All eleven answers match the completed onboarding.
2. Prefilling and Cancel preserve the profile, History and Foundations.
3. Invalid email is blocked; all project/identity fields, “Other” descriptions and platforms save and survive reload.
4. Design edits selectively update Foundations, preserve custom options/dark color, reach the Input component and keep one project identity.
5. Read/edit layouts fit 1440px, 390px and 320px in light and dark themes.
6. Cross-tab conflicts prevent stale saves and recover through Cancel.
7. The no-project state supplies the correct entry actions.

Five model tests in `tests/project-setup.test.cjs` cover selective updates, legacy fallbacks, recommendation changes, dark palette preservation and project identity. The Overview project-hub regression passes. The release gate passes, and the page audit reports no source issues across 162 pages.

Evidence and screenshots: `audit/project-setup-2026-11-06/`. The test uses isolated browser contexts and does not modify the user's own saved projects.

## Reproduce

```sh
node tests/project-setup.test.cjs
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-project-setup.cjs
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-project-hub.cjs
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-onboarding-optimization.cjs
bash tools/release_check.sh
```

The Playwright package and Chrome executable paths are workstation-specific. Saved projects remain local to the browser; this change does not add account or team synchronization.
