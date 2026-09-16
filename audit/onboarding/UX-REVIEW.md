# Overview and onboarding review

Scope: Damco Agentic Design System, 15 September 2026. Local prototype authorized by the user. Baseline: existing Overview source, shared shell/tokens, navigation destinations and rendered desktop screen (`overview-before.png`).

## Audit before implementation

| Area | Existing problem | Decision |
|---|---|---|
| Entry point / hierarchy | Copy silently starts onboarding; no Create Project action or meaningful project empty state. | One primary “Create a New Project” action; explain project purpose before setup. |
| Content / metrics | Sample adoption, counts and compliance percentages appear to be live facts. | Replace with actual local project/resource/invitation counts after creation. |
| Form / role | Basic fields exist but custom role, whitespace, duplicates and error recovery are incomplete. | Explicit labels, inline validation, role descriptions, conditional required Job Title; retain input on failure. Job role is distinct from access permission. |
| Creation / generation | Writes a profile and fabricates production CDN/NPM/Figma URLs; no async lifecycle. | Create persistent local project, generate inspectable resource previews; show partial success, retry and honest prototype labeling. |
| Project management | Switch project deletes the active profile and forces new entry. | Persistent project selector and addressable project detail; never clear old projects to switch. |
| History | Rows only show person/project/date; no resources, actions or status. | Resource-level history, generator/date/status, copy/open/share, project/type/status filters, search and sort. Preserve legacy entries without claiming their placeholder links work. |
| Sharing | Missing. | Share a read-only project/resource snapshot. Explain link visibility and that snapshots do not receive updates. Omit owner email and member records from payload. |
| Invitations / permissions | Missing. | Separate Invite Members form, Viewer/Editor descriptions, local pending/accepted/expired states, preview acceptance, resend. No email or real access grant. |
| Feedback | Clipboard failures uncaught; no loading, success, error, expired or permission states. | Persistent contextual feedback with accessible live announcements; recoverable action failures and local scenario controls. |
| Navigation / search | Overview is documentation-led; “global” search only filters sidebar; mobile sidebar consumes space. | Workspace sections below header; retain catalog navigation, label its search honestly, add mobile navigation toggle, skip link and expanded state. |
| Modal / keyboard | Non-native modal lacks focus trap, restoration and background inertness. | Reusable native dialog with focus return, Escape, dirty-form discard confirmation and busy state. |
| Accessibility / responsive | Muted labels, small actions, missing tab semantics and narrow-screen layout. | Shared tokens/components with scoped contrast and focus improvements, 44px controls, semantic headings, responsive resource/history cards, native selects and dialog. |

## Information architecture and journey

Overview → Projects (empty state or project list) → selected project → Resources → Project Link History → Members.

Create a New Project → project/name/email/job role (Other reveals Job Title) → Generate Link → progress → success or partial success → CSS Variables / NPM Package / Figma Library previews → Copy / Open / Share → optional Invite Members → manage project and revisit resource history.

This implements the requested journey. Resource details are disclosed on demand; sharing and invitations have separate actions and dialogs. The first-run screen has no distracting secondary task.

## State contract

- Load: local storage read → workspace or explicit unreadable-storage error; never silently erase damaged data.
- Create: validation → generating project/resources → saved success, partial success or actionable error. Duplicate names normalized by case/whitespace. No double submit.
- Resource: generating → ready / failed; expired snapshots disable copy/open/share and offer regeneration to owners. Retry creates a new history entry and keeps previous records.
- Copy/share: working → copied/shared, canceled, or manual-copy fallback; do not claim clipboard success on denial.
- Invite: validated → saving → pending preview; preview acceptance → accepted; seven-day timeout → expired; resend → fresh pending preview. Failed operations preserve input.
- Permissions: own local workspace can manage projects; shared snapshots are read-only and contain no members or personal contact details. Prototype roles illustrate access and are not authentication.
- Cancel: pristine form closes; dirty form requests discard; submission blocks dismissal until settled.
- Responsive: sidebar becomes disclosure; one-column cards/forms; no page-level horizontal scroll. Keyboard focus stays visible and returns after dialogs.

## Reusable component gaps

Extend the existing `.btn`, `.form-field`, `.panel` and design tokens through an Overview-scoped stylesheet. Add a reusable native-dialog controller, feedback banner, resource status/action card, validation helper and persistent local store. Keep other component catalog pages intact.

## Production boundary

This repository has no API, authentication, email delivery, registry publishing or Figma provisioning. Local previews must not claim these services exist. Production needs server-side authorization and membership, transactional project/resource creation, job retries and idempotency, signed resource access, email delivery and invite acceptance, durable history, and configured published resource URLs. Sharing exports a public read-only snapshot, not a secure access token.


## Implemented files

- `overview.html`: preserves Damco shell/navigation and replaces the copy gate with the project workspace entry point.
- `overview.css`: scoped, reusable workspace, resource, feedback and dialog styles using the shared tokens.
- `overview-model.js`: validated local persistence, legacy migration, project/resource/invitation records and public snapshot boundaries.
- `overview.js`: project journey, conditional form, generation, sharing, filters, invitations, loading/retry/expiry states and keyboard interactions.
- `shell.js`: makes optional preference storage resilient and prevents the navigation shortcut from stealing keyboard input in dialogs/selects.
- `tests/overview-model.test.cjs`: six automated domain tests.

## Verification results

Verified in an isolated local browser at `http://127.0.0.1:8765/overview.html`, using synthetic projects and example.com identities. Test records live only in the automation browser profile; the application does not seed sample projects.

| Boundary / task | Result / evidence |
|---|---|
| Initial load | Empty state with a single creation CTA; meaningful content; no browser JS errors. `overview-empty.png`. |
| Project creation | Required-field summary, conditional Other/Job Title, successful creation and three inspectable previews. |
| Persistence | Reload retains projects, resource versions and memberships; two projects can be selected independently. |
| Duplicate / cancellation | Case and repeated whitespace normalized; duplicate rejected; dirty-form discard confirmation shown. |
| Resource generation | NPM failure produces partial state and history entry; retry succeeds and retains the previous failed record. |
| Network error | Explicit scenario preserves form input and re-enables submission; retry creates the project. |
| History | Resource filter and text search produce matching results and clear empty feedback; clear filters restores rows. |
| Sharing | Encoded read-only snapshot route renders all three previews; no generate or invite controls; owner/invitee contact details absent from payload. |
| Invitations | Pending local preview, simulated acceptance, failed-save retry, expiry and resend all verified. No email sent. |
| Expiration | Expired CSS preview removes access actions; regeneration creates a working new version. |
| Clipboard failure | Denied clipboard offers a selected manual-copy field containing the snapshot URL. |
| Storage failure | Corrupt stored JSON is preserved; recovery clears the error. Rejected writes leave the previous workspace unchanged. |
| Keyboard | Native dialog contains focus; Shift+Tab remains inside; Escape closes a pristine dialog and restores trigger focus. |
| Responsive | 320px and 390px viewport widths have no page overflow; modal fits viewport; mobile navigation expands, makes main content inert and closes with Escape. |
| Theme | Dark desktop and light mobile rendered; input boundaries/focus states strengthened. |
| Navigation | All 34 static anchor destinations point to existing local files or same-page anchors. Existing component pages now have direct links; unfinished feedback/data-display items are explicitly Planned. |
| Static checks | `node --check` passes for all changed JavaScript files. `node --test tests/overview-model.test.cjs`: 6 passed, 0 failed. |

Screenshots in this folder: original baseline, new empty state, desktop workspace, mobile creation form and opened resource preview. Some capture intermediate test data; projects named “Network recovery” are verification fixtures, not shipped defaults.

### Accessibility basis and limits

Dialog focus handling follows the [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Notifications dismiss when they would obscure a newly focused control, reflecting [WCAG 2.2 focus-not-obscured guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html). This is targeted keyboard, contrast and viewport verification, not a full WCAG conformance certification or assistive-technology audit. Arbitrary user-customized colors still require contrast evaluation.

### Run locally

From the project directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
node --test tests/overview-model.test.cjs
```

Open `http://127.0.0.1:8765/overview.html`. Use the “Prototype scenarios” disclosure for one-shot failure previews. Serve over HTTP so CSS preview generation can read `theme.css`; direct `file://` use may block that fetch and will offer a retry error. Browser storage is origin-specific. Shared localhost links work only on the same computer; host these static files to make snapshot links accessible to other people.


### Final verification limitations

- Browser clipboard read-back was denied by browser permissions. The application’s blocked-copy/manual-copy recovery was verified; clipboard contents were not independently read back.
- The download control and generated CSS contents were inspected, but the final browser download verification command was declined. No downloaded-artifact verification is claimed.
- Malformed/expired snapshot payloads are rejected in automated model tests. The final malformed-link browser capture was not completed after waiting for route rendering, so no visual result is claimed for that last check.
- The in-app browser runtime could not initialize (`Cannot redefine property: process`); browser checks above used the available standalone agent-browser with an isolated profile.
