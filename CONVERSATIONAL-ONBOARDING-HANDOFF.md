> Overview now includes project history. See [OVERVIEW-HISTORY-MERGE-HANDOFF.md](OVERVIEW-HISTORY-MERGE-HANDOFF.md) for current navigation and project-list behavior.

> Visual redesign: see [CHATBOT-REDESIGN-HANDOFF.md](CHATBOT-REDESIGN-HANDOFF.md) for the current layout, stage indicator, live brief, visual choices and browser evidence.

> Application entry now always shows project choices first. See [START-PAGE-HANDOFF.md](START-PAGE-HANDOFF.md) for launcher, file/HTTP entry and navigation behavior.

# Conversational onboarding — AI handoff

Updated 6 November 2026 in `Agentic Design System 2`.
This supersedes the earlier inline three-step form described in `ONBOARDING-PROJECT-CHOICE-HANDOFF.md`.

## Requested behavior and result

The user asked for New project to become a chat-like setup: ask one question, receive a reply, ask the next, pin earlier answers, summarize everything, ask whether it is correct, then show centered, sequential setup progress.

The implemented journey is:

1. Start at `new-project.html` on the existing blank canvas with centered **Existing project** and **New project** choices.
2. **Existing project** opens searchable `overview.html#projects`.
3. **New project** replaces the choice screen with a conversation. A brief introduction leads into the first project-name question and reply composer. The chatbot fills the available viewport beneath the application bar; only the message history scrolls. The latest reply/question stays in view while the composer remains docked. It has a Design companion header, four setup stages, readable message history and a docked reply composer.
4. Ask eleven questions, one at a time: project name, product type, target platforms, name, email, designation, project role, brand color, spacing rhythm, corner philosophy and icon style. Other product/role choices reveal a free-text description; platforms allow multiple choices.
5. Each submitted answer becomes a reply in the transcript and a pin in **Your project brief**. The live project brief occupies a side panel at desktop widths of 1100px and above. On smaller screens, Your brief opens an overlay with the same editable pins and answered-count progress. Pins and transcript Edit actions let users change an earlier answer without clearing the rest of the conversation.
6. Use assistant bubbles on the left and user replies on the right. Suggested single-choice chips send immediately; Platforms offers a selected-count status and a prominent **Continue with N platforms** button directly beneath its chips. The button is disabled for an empty or invalid selection. Send and Enter remain alternative ways to submit a valid selection. Users can also type matching choice labels. Enter sends; Shift+Enter inserts a line break. A short typing animation introduces the next question; the reply composer stays docked while only the message history scrolls. Persist both submitted replies and unfinished composer input. Reopening or refreshing shows project choices first. Choosing New project restores a readable unfinished conversation directly; only unreadable or unsupported records show backup/discard recovery.
7. After all valid answers, show the full summary and a preview of the planned brand/grid/spacing/corners. Ask **Is everything correct?** with **Yes, set up my design system** and **Make changes**. No new active project or Foundation settings are saved before confirmation.
8. Confirmation opens a centered setup view with an animated mark, an active-step spinner, completed checkmarks and a progress bar. The six stages are brief validation, palette preparation, typography/layout preparation, spacing/corner/icon preparation, theme validation, and durable save/readback.
9. After successful save, show **Your design system is ready**, **Open my design system**, and **Review Foundations**. Reopening saved details offers Edit and Markdown export.

Assistant typing feedback is a brief presentation transition between deterministic questions, with duplicate-send protection; it does not imply a remote model request. Message nodes are retained as the conversation advances. The progress display follows actual local preparation and persistence. Checkmarks do not simulate an external AI request. Short completion animations make the completed stages readable. Reduced motion removes these animations. This implementation uses the existing design rules and Foundation resolver; it does not call a remote AI model.

## Implementation map

- `new-project.html`: conversation, pin panel, summary/confirmation, progress/error/completion and saved-project markup. Loads the new model/controller/styles after existing application scripts.
- `onboarding.css`: full-height chat shell, message bubbles, reply chips, docked composer, pinned-answer drawer, centered progress, theme colors, responsive layouts and reduced motion. It loads after the shared Foundation styles so chat-specific typography remains compact. Existing `experience.css` still owns the initial project-choice canvas.
- `onboarding-model.js`: question definitions, per-answer validation, readable answer labels, legacy/current draft reading and deterministic Foundation planning. Uses the existing project and Foundation models; contains no DOM code.
- `onboarding.js`: current question, confirmed answers, unsent input, edit/review state, draft recovery, six actual setup stages and saved-project UI. It owns onboarding on this page.
- `experience.js`: obsolete three-step `setupForm()` controller removed. Shared navigation, History, Foundation journeys and export behavior remain here.
- `project-model.js`: `save()` accepts validated `foundationRecords` and optional `clearDraft`, `expectedDraftRaw` and `expectedFoundations`. The active profile, history, selected Foundation records and draft removal are written in the same rollback-capable operation.
- `foundation-contract.json`: authoritative conversation/confirmation/progress/recovery rules. Generated page contracts, `foundation-model.js`, default manifests, token metadata and documentation catalogs were refreshed with the repository generators.

## Foundation setup

`buildPlan(answers, existingSettings)` prepares all fifteen supported Foundation record types. The existing readiness model groups these into eight Foundation sections.

- Product/platform context supplies typography and grid recommendations.
- A selected spacing rhythm wins over recommendations; **Recommend for my product** uses the existing contextual spacing rule.
- The chosen hex color configures the primary palette; corner philosophy and icon style map to existing Foundation values.
- Other settings start with library defaults. The confirmation preview explains this, and users can edit every Foundation afterward.
- Editing a saved project preserves existing usable Foundation settings, then applies the explicit design preferences from the conversation. Unreadable/future Foundation records block an edit rather than being overwritten.
- Both light and dark themes resolve before any project or Foundation record is committed.
- New-project Save archives the prior active project with its latest Foundation snapshot; History can reopen it.

This does not generate new component anatomy, publish libraries, or isolate component customization/contract records per project. Existing components consume the saved Foundation tokens. History remains browser-local; a shared authenticated backend is still needed for projects created by users in another browser/account.

## Persistence and recovery

Existing storage keys are retained:

- `ads:project-profile:v1`: saved profile schema version 2, stable ID and explicit design preferences.
- `ads:project-draft:v1`: draft version 2 with top-level answer fields and `conversation: {version:1, answered, current, pending, baseRaw, foundationBaseline}`. `newProject` preserves creation versus edit intent.
- `ads:project-history:v1`: local archive and Foundation snapshots from the previous implementation.

`answered` contains only submitted valid question keys. `pending` contains unsent composer input, so editing an answer does not change its pin until Send. Older readable setup drafts migrate into valid answered questions; missing design answers are still asked.

Draft metadata is stripped from the answers returned by the draft reader and from the final saved brief. Source-profile snapshots and conversation metadata must never be copied into a new project profile.

Confirmation checks the source active profile and draft. Editing also checks the source Foundation records. Changes in another tab disable reply/confirmation controls. Stale drafts remain preserved until explicitly cancelled/discarded. Corrupt/future profiles and drafts expose backup and explicit discard controls.

Storage failures roll back all changed project, archive, Foundation and draft records. The setup view retains answers and offers Retry or Back to summary. A failure after a successful commit tracks the committed project ID so retrying cannot create another project.

## Verification

Evidence directory: `audit/conversational-onboarding-2026-11-05/`.

- `results.json`: real local Chrome journey results and observed progress-state transitions.
- `model-tests.log`: project/onboarding model checks.
- `release-check.log`: repository unit suites and generated-output freshness gates.
- Screenshots: initial choices/question, desktop and mobile quick-reply chat views, full summary, setup in progress, setup failure/retry, completion, and mobile question/summary in light and dark themes.

Commands:

```sh
node --test tests/onboarding-model.test.cjs tests/project-model.test.js
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-conversation.cjs
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-setup-flow.cjs
bash tools/release_check.sh
```

`tools/check-onboarding-flow.cjs` and `tools/check-project-entry.cjs` now invoke the canonical conversation journey, replacing their obsolete three-step selectors. `tools/onboarding-browser.cjs` supplies reusable browser answer helpers. `check-setup-flow.cjs` also checks the neighboring Foundation pages, Save/Edit/Cancel, invalid values, backup/restore and failed multi-record writes.

Verified cases include: a docked composer while message history scrolls; Enter-to-send and duplicate-send protection during typing feedback; immediate quick replies and typed choice labels; both entry choices; a single active question; conditional Other fields; multi-platform input; editable pins; unfinished-text resume; invalid replies; summary corrections before save; failed-write rollback and successful retry; six actual progress stages; all eight Foundation sections saved; workspace/Markdown handoff with identity excluded by default; stable-ID edits; creating a second project and reopening the first with its settings; cross-tab conflicts; future-data recovery; and no horizontal overflow at 1440, 768, 390 and 320 pixels in both themes. Browser test contexts use isolated local storage.

The release check passed all unit suites and token, Foundation, implementation-contract, documentation-catalog and Figma-bundle freshness gates. Consult the evidence files for the final recorded run.

## Continuing the work

Use `onboarding-model.js` as the single question/validation/planning source. Do not bring back the old three-step form alongside the conversation. Keep source contracts authoritative and regenerate after documentation changes:

```sh
python3 tools/generate_contract_docs.py
python3 tools/generate_foundation.py
python3 tools/generate_tokens.py
python3 tools/audit_pages.py
```

Keep progress tied to completed operations. If adding a real AI service, introduce a backend and explicit request/error handling while preserving answer validation, confirmation, atomic save and draft recovery. Do not mark setup successful before durable save/readback succeeds.

## Platforms continuation fix

The reported stop at question 3 came from inconsistent interaction: single-choice chips advanced immediately, while the multi-select Platforms question silently waited for the docked Send arrow. The selected chip alone did not complete the answer.

`onboarding.js` now creates `#continueSelection`, a native submit button associated with `#chatAnswerForm`, beside `#selectionStatus` directly below the platform chips. It reports the current number selected and updates its label to **Continue with 1 platform** or **Continue with N platforms**. No selections, invalid typed values, reply processing and cross-tab conflicts disable the action. Clicking it uses the existing validation, draft, pin and next-question path. Restored partial platform drafts initialize the count and enabled state correctly.

The browser regression explicitly exercises the reported state (Desktop web checked), deselecting everything, reload/resume of that selection, advancing with one platform to the name question, and editing to multiple platforms. Mobile screenshots verify that the inline Continue button remains above the reply composer.

## Direct draft restoration — 6 November 2026

The Resume conversation / Back up draft / Discard draft interstitial has been removed for readable drafts. Clicking New project now restores the saved conversation directly, including confirmed answers, pending input, platform selections and review state. Initial visits still show the welcome choices. The Cancel action remains available to discard an active draft. Unreadable/future records retain explicit backup/discard recovery, and conflicting project baselines continue to block stale saves. See the direct-resume evidence in `audit/chat-redesign-2026-11-06/`.
