# Damco Agentic Design System — onboarding and Overview handoff

Updated: 15 September 2026

## Start here

Continue work in:

```text
/Users/user/Documents/Damco Agentic Design System
```

This is the **Damco Agentic Design System** static HTML/CSS/JavaScript project. Do not confuse it with the separate `/Users/user/Documents/DDOS` folder.

The user requested a thorough UX audit and implementation of the complete Overview/onboarding journey. They then explicitly confirmed:

> Use a clearly labeled local prototype for now.

No backend, real invitation email, real NPM publishing, Figma library provisioning, deployment or authentication integration is required under the current scope. Do not present these as functioning services.

The user has now requested this handoff so another AI can finish the work. Substantial implementation is already in place. Review and verify it before changing or rebuilding it.

## Original requirements

The full original user instructions are preserved in:

- [audit/onboarding/ORIGINAL-BRIEF.md](audit/onboarding/ORIGINAL-BRIEF.md)

The requested journey is:

```text
Overview
→ Create a New Project
→ Project Name / Your Name / Email Address / Select Your Role
→ Other role reveals required Job Title
→ Generate Link
→ Project created / resource generation feedback
→ CSS Variables / NPM Package / Figma Library
→ Copy / Open / Share
→ Optional Invite Members
→ Manage project / revisit Project Link History
```

The review must cover information architecture, task flows, permissions, content hierarchy, success/loading/error/empty/expired states, accessibility and responsive behavior—not only visual changes. Preserve the existing Damco design language and reuse shared tokens/components.

## Project facts

- Plain static HTML, CSS and JavaScript. No framework, package manifest, build step or backend was found in this directory.
- Shared shell: `shell.css`, `shell.js`, `theme.css`.
- Most component and foundation pages already exist; several other pages/catalog destinations are placeholders.
- This directory is **not a Git repository**. No commits, branches, pull requests or deployments were made.
- No agents were delegated work.
- No external messages or invitations were sent.
- No dependencies were added to this project.

## What was wrong before

The original Overview:

- Started project creation only after clicking a resource's Copy button.
- Had no clear Create a New Project CTA or useful project empty state.
- Fabricated CDN, NPM and Figma URLs using placeholder organization names.
- Stored one current profile and a short history of names, without actionable resource history.
- Cleared the current profile when switching projects.
- Had no project-sharing or invitation flow.
- Showed sample adoption and compliance metrics as if they were real activity.
- Lacked robust loading/error handling, duplicate checks, modal focus behavior and narrow-screen navigation.

A baseline source backup and screenshot were saved before editing.

## Files created or changed

| File | Work completed |
|---|---|
| `overview.html` | Preserved existing shell/navigation; replaced old Overview content and inline copy-gate script with a project workspace, prototype notice, error/status regions, scenario controls and native dialog. Added links to the new scripts/styles. |
| `overview.css` | New Overview-scoped styles extending shared tokens, `.btn`, `.form-field` and shell patterns. Includes empty state, projects, resource cards, history, members, modal, feedback, mobile navigation, focus states and responsive rules. |
| `overview-model.js` | New dependency-free domain model, exposed as `window.OverviewModel` in the browser and CommonJS for Node tests. Includes validation, storage, legacy migration, resource/invitation states, expiry and share-snapshot sanitization. |
| `overview.js` | New application controller for creation, resources, project selection, history filtering/sorting, sharing, invites, retries, dialogs, focus restoration and local scenarios. |
| `shell.js` | Small shared changes: preference storage reads/writes are guarded; `/` navigation-search shortcut no longer steals input inside selects, editable content or open dialogs. |
| `tests/overview-model.test.cjs` | Six automated domain tests. |
| `audit/onboarding/UX-REVIEW.md` | Detailed audit, decisions, journey, state contract, production boundary, verification results and limitations. |
| `audit/onboarding/ORIGINAL-BRIEF.md` | Copy of the full original user brief. |
| `ONBOARDING-HANDOFF.md` | This handoff. |

`theme.css` and `shell.css` were not changed. Other application pages were not redesigned.

## Implemented behavior

### 1. Overview / first-time experience

- “No projects yet” empty state explains what a project contains.
- One main first-run action: **Create a New Project**.
- Plain-language explanation of required setup information and the next steps.
- Explicit **Local prototype** label: saved in this browser; resource previews; no invitation email delivery.
- Returning-user sections: Projects, Resources, Project Link History and Members.
- Counts derive from local records instead of fabricated usage/compliance metrics.
- Project search and persistent project selection.

### 2. Project creation

- Native modal dialog with labeled Project Name, Your Name, Email Address and Select Your Role fields.
- Roles: Designer, Developer, Product Manager, Design System Lead, Other.
- Other reveals Job Title and makes it required; switching away hides/disables/clears it.
- Role helper text describes the selected job role and distinguishes it from project ownership.
- Whitespace validation, email validation, case/whitespace-normalized duplicate project detection.
- Inline field errors plus linked error summary.
- Generate Link progress, disabled submit while working, retained inputs on errors, success/partial-success feedback.
- Dirty-form discard confirmation; Escape handling; focus restoration.

### 3. Resources

- CSS Variables: fetches local `theme.css`, discovers token names and captures current computed root token values as a downloadable CSS snapshot.
- NPM Package: generates a **private, unpublished package.json preview**. No working registry installation is claimed.
- Figma Library: generates a **JSON handoff preview** with next steps. No actual Figma file or library publication is claimed.
- Resource cards explain purpose and show Preview ready / Generation failed / Expired.
- Copy exports a resource snapshot URL; Open displays contents; Share exposes the snapshot link and access explanation.
- Resource dialog offers Copy contents and Download preview.
- Regeneration appends a new record; failed and older versions remain in history.
- Expired versions block normal access and offer regeneration in the owner's workspace.

### 4. Project Link History

- Resource-level records with project/type, generated timestamp, generated by, current status and actions.
- Search across project, resource type and generator name.
- Project/type/status filters; newest/oldest/project-name sorting.
- Clear filters and explicit no-match state.
- Show more after 12 matching records.
- Legacy history is migrated without pretending old placeholder links are valid.

### 5. Sharing

- Separate Share Project and resource-sharing flows.
- URLs contain encoded read-only snapshots in the hash (`#share=...`).
- Shared view renders resource previews and excludes project mutation/invitation controls.
- Snapshot payload omits creator contact details and invitation records.
- Clearly explains that anyone with the link can view the snapshot, it does not update automatically and it grants no membership.
- Shared links expire after 30 days; individual resource versions can expire sooner.
- A localhost link only works on the same computer; other recipients need access to the same hosted static site.
- This is public snapshot export, **not secure access control**.

### 6. Invitations

- Separate Invite Members dialog with email and Viewer/Editor access descriptions.
- Validates email, self-invitation and duplicate membership/invitations.
- Explicitly creates a local invitation preview; no email is sent.
- Pending / Accepted / Expired labels; invitation expiry is seven days.
- Preview invitation and **Simulate acceptance** action.
- Resend preview renews an eligible invitation for seven days.
- Owner/member job role and access role are treated as distinct concepts.

### 7. Error handling / accessibility / shell

- Copy denial opens a manual-copy fallback instead of claiming success.
- Storage corruption is reported without replacing the original stored data.
- Storage write failures preserve the previously saved workspace.
- Mutations reload stored data before commit to reduce stale-tab overwrites and check duplicates again.
- Native dialog focus containment and restoration.
- Skip link, visible focus states, expanded-state attributes and mobile navigation disclosure.
- Mobile navigation makes the main content inert while open and supports Escape.
- Overview controls have stronger boundaries and primary-button text is selected for contrast against the current brand accent.
- Action feedback remains visible; it dismisses if it would cover a newly focused control. Escape can dismiss feedback outside dialogs.
- Navigation search is labeled honestly and reports result counts/no matches.
- Overview links point directly to existing Tabs, Anchor, Breadcrumb, Dropdown, Pagination, Menu and Steps pages.
- Unimplemented feedback/data-display catalog items are labeled Planned instead of linking to nonexistent anchors.

## Local data and routes

### Storage

```text
ads:workspace:v1   — new workspace data
ads:copy-profile   — old profile; read for migration, not deleted
ads:link-history   — old history; read for migration, not deleted
ads:theme         — existing theme preference
```

Workspace data contains projects, resource version records and invitation preview records. It is origin-specific browser storage, not a database.

Legacy entries become recovered projects with expired resource placeholders and guidance to generate new previews. Migration preserves old storage keys.

### Routes

```text
overview.html                  — local workspace
overview.html#project=<id>     — selected local project
overview.html#share=<payload>  — exported read-only snapshot
```

Section anchors include `#projects`, `#resources`, `#history` and `#members`.

## How to run

From the project directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8765/overview.html
```

A preview server was started on port 8765 during this session; check whether it is still running before starting another one. Do not assume session processes survive the handoff.

Use HTTP rather than directly opening `file://`: CSS preview generation fetches `theme.css`, which browsers can block under file URLs.

No build is required.

### Static and automated tests

```sh
node --check overview.js
node --check overview-model.js
node --check shell.js
node --test tests/overview-model.test.cjs
```

Latest result: all syntax checks passed; **6 tests passed, 0 failed**.

The tests cover:

1. Whitespace, invalid email, custom-role requirement and normalized duplicate names.
2. Legacy migration without claiming placeholder links work.
3. Corrupt storage preservation.
4. Failed/ready/expired resource history and latest-version selection.
5. Invite validation, duplicates, self-invitation, access choices and expiry.
6. Shared-snapshot privacy boundary and malformed/expired payload rejection.

## Browser verification already performed

Browser checks used an isolated `agent-browser` session named `damco-ux` and synthetic example.com identities. These projects are **not seeded into application code** and should not appear in the user's normal browser unless that browser itself has created projects.

The in-app browser failed to initialize with `Cannot redefine property: process`. The available standalone agent-browser was used instead, with approved local browser access. Its executable in this environment was:

```text
/Users/user/.npm/_npx/6de2aa2fded2970c/node_modules/.bin/agent-browser
```

Do not assume this machine-specific path exists elsewhere.

Confirmed in the browser:

- Original and updated pages load with meaningful content.
- Required-field validation and Other → Job Title.
- Project creation and three resource previews.
- Reload persistence and multiple projects.
- Resource contents open.
- Duplicate project detection and dirty-form confirmation.
- Resource failure and successful retry retaining history.
- Simulated network failure preserves input; retry succeeds.
- History type/text filtering, empty results and clear filters.
- Invitation pending state, simulated acceptance, failure/retry, expiry and resend.
- Shared snapshot renders all three resources without invitation/generation actions.
- Shared payload omits owner/invitee contact details.
- Expired resource disables access and regenerates successfully.
- Clipboard denial gives manual-copy recovery.
- Corrupt storage remains untouched; restoring valid data clears the error.
- Simulated storage write rejection preserves existing workspace data.
- Shift+Tab stays in the native dialog; Escape closes a pristine dialog and returns focus to its trigger.
- 320px and 390px layouts have no page-level horizontal overflow.
- Mobile navigation expanded/inert/Escape behavior.
- Light mobile and dark desktop layout.
- Desktop shell stays at the top while main content scrolls.
- No browser JavaScript errors were reported in the page checks that completed.

A static destination check found no missing local target files among the Overview's 34 static links. This is not a full audit of every other page's navigation or fragment target.

## Screenshots / audit artifacts

Located in `audit/onboarding/`:

| Artifact | Description |
|---|---|
| `overview-before.html` | Original Overview source before implementation; a backup, not a runnable standalone page in this folder. |
| `overview-before.png` | Original desktop screen. |
| `overview-empty.png` | New empty state. |
| `overview-desktop.png` | Returning-user desktop workspace with test projects. |
| `create-project-mobile.png` | Creation dialog at mobile width. |
| `resource-preview.png` | Opened CSS preview dialog. |
| `UX-REVIEW.md` | Audit, decisions and verification notes. |
| `ORIGINAL-BRIEF.md` | Original user instructions. |

Screenshots capture verification states and may precede the last small changes. In particular, the final selected-role helper text, mobile section-navigation wrapping and light-theme eyebrow contrast adjustment were syntax/test checked but were not re-captured in the browser.

## Remaining work for the next AI

### Priority 1 — finish the interrupted verification

1. **Clipboard success:** a programmatic attempt to independently read back the clipboard was denied by the browser (`NotAllowedError`). The failure fallback was verified, but the successful clipboard payload was not independently read back. Verify with a supported permission setup or a test that observes the application's write operation. Do not inspect unrelated user clipboard contents.
2. **Download preview:** the control and CSS contents were inspected, but the final download-and-file-verification command was declined. Verify a real CSS download, plus NPM/Figma JSON downloads, and compare their contents with the displayed preview.
3. **Malformed/expired shared-link rendering:** model tests reject invalid and expired payloads. The final malformed-link browser command read the previous workspace before waiting for hash-route rendering; its follow-up inspection was declined. Test by waiting for the “Shared project unavailable” state, rather than relying on immediate text after navigation.
4. **Final visual regression:** check the latest source at desktop, 390px, 320px and a short-height viewport. Capture final screenshots of empty, success, partial failure, history, sharing and invitation states in both themes where relevant.
5. **Creation success feedback:** confirm the final toast is noticeable, dismissible and does not hide the next action, including with keyboard navigation and mobile layout.

The declined browser command was not retried after rejection. Nothing in this handoff grants a future agent permission to bypass environment approval requirements.

### Priority 2 — targeted robustness review

These are suggested follow-up checks, **not confirmed defects**:

- Test browser Back/Forward and movement between project, section and shared hashes; verify no stale notices or wrong selected project.
- Open a shared snapshot in a separate clean browser context to verify it does not depend on owner local storage.
- Check focus after replacing a rendered project list/history and after all dialog close paths.
- Test two tabs creating the same project name or updating invitations concurrently.
- Verify read-only/storage-denied startup, including theme and navigation behavior.
- Exercise legacy migration in the browser, not only in model tests.
- Test Unicode project names and HTML-like input to confirm correct display and no injected markup.
- Review default/custom theme contrast and mobile section-navigation discoverability.
- Expiration labels are derived when rendering/actions occur; decide whether an automatically refreshing status display is needed for sessions left open across expiry.
- The current prototype does not offer project rename/delete or member revocation. These were not added; assess only if needed to fulfill the agreed task rather than expanding scope automatically.

### Priority 3 — final handoff to the user

- Update `audit/onboarding/UX-REVIEW.md` with newly completed checks and any fixes.
- Be explicit about local prototype limits.
- Provide the local preview and audit/screenshot paths.
- Do not claim full WCAG conformance, real email delivery, real authorization, NPM publication or Figma provisioning.

## Production capabilities intentionally deferred

Only pursue these if the user changes the current local-prototype scope:

- Durable server storage and authenticated project membership.
- Server-enforced Viewer/Editor/Owner permissions.
- API validation, transactions and idempotent generation jobs.
- Published CSS hosting, actual NPM package URLs and Figma library provisioning/configuration.
- Email invitation delivery and authenticated acceptance.
- Secure resource sharing, revocation and signed access URLs.
- Production deployment and operational monitoring.

## Accessibility basis and limits

The design uses native dialogs and follows WAI guidance for modal focus and non-obscured focus. Targeted keyboard and responsive checks were completed; this is not a full assistive-technology audit or WCAG certification.

References used:

- [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.2: Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)

## Suggested continuation prompt

> Continue the Damco Agentic Design System onboarding and Overview work in this folder. Read ONBOARDING-HANDOFF.md, audit/onboarding/ORIGINAL-BRIEF.md and audit/onboarding/UX-REVIEW.md first. The user authorized a clearly labeled local prototype. Preserve the existing implementation and Damco design system; finish the outstanding browser checks, fix issues you actually find, and update the audit and screenshots. Do not introduce real email delivery, publishing or a backend without a new scope instruction. Report exactly what is verified and what remains limited.
