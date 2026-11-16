> Overview now includes project history. See [OVERVIEW-HISTORY-MERGE-HANDOFF.md](OVERVIEW-HISTORY-MERGE-HANDOFF.md) for current navigation and project-list behavior.

> Latest interaction/persistence fixes: [ONBOARDING-OPTIMIZATION-HANDOFF.md](ONBOARDING-OPTIMIZATION-HANDOFF.md).

# New project chatbot redesign

Completed 6 November 2026 in `Agentic Design System 2`.

## What changed and why

The old interface wrapped every assistant message in a bordered card, repeated an artificial opening user reply, concealed all pinned answers and offered little visual guidance for design choices. The revised interface uses an open conversation area, a clear current question, compact user replies and a docked composer with a visible Send action.

- Four informational stages — Project, About you, Design and Review — reflect the current question. The stage indicator uses `aria-current="step"`; it is not a navigation control.
- The supplied mascot provides the assistant avatar. The welcome mascot and initial project-choice screen remain separate.
- The live project brief is visible at 1100px and above. Smaller screens use the Your brief control. Opening moves focus into the brief; Escape closes the mobile panel and returns focus. Editing a pin returns to the question.
- Option cards use native radio/checkbox inputs. Available descriptions are visible. Spacing and corner choices include small visual examples. Single choices still submit immediately; multi-platform selections retain the explicit Continue button and selected count.
- The primary-color question offers a native color picker synchronized with the editable hex field. Both paths use the existing validation and draft logic.
- Long question sections now scroll to the question heading when the whole section cannot fit. The composer stays docked and the message area scrolls independently.
- The review presents all answers in an editable table before Confirm & create. Setup still performs and reports six actual local operations, including durable save and readback.
- Cancel is explicitly named; the back arrow preserves the draft. Restored drafts now show a clear saved-state message.

## Library alignment

Read `principles.html`, `guidelines.html`, `shell.css` and `foundation.css` before editing. This redesign applies their proximity, alignment, visible actions and immediate feedback guidance. It uses existing resolved type, surface, brand, border, radius, shadow and spacing tokens. Radio/checkbox cards, buttons, text entry, progress, descriptions and panel patterns retain native semantics and the library's focus treatment. Decorative radius samples use fixed example values intentionally; they illustrate choices rather than define UI component radii.

The active Foundation theme and brand continue to control the UI; red is the default, not a hardcoded override. Mobile, dark mode, reduced motion and RTL remain supported. No new dependencies or remote AI calls were introduced.

## Files

- `new-project.html`: conversation structure, stage list, brief panel and reply controls.
- `onboarding.css`: responsive conversation styling, option previews, brief and review layout.
- `onboarding.js`: live progress, desktop/mobile brief behavior, option rendering, color synchronization, scrolling and draft feedback.
- `onboarding-model.js`: question/validation/plan source; only color-question help copy changed in this redesign.
- `foundation-contract.json`: authoritative behavior contract. Generated contract docs, defaults, token manifests and documentation catalog were regenerated with the existing scripts.
- `tools/audit-chat-redesign.cjs`: targeted real-browser verification for the new behavior and layouts.

## Preserved behavior

Eleven required answers, conditional Other fields, Enter-to-send, platform multi-select, edit without losing other answers, automatic readable-draft restoration, explicit unreadable-data recovery, confirmation before saving, atomic profile/Foundation persistence, rollback/retry, project history and cross-tab conflict protection remain in place. First entry still opens the project choices. The conversation uses local questions and planning; it does not claim to contact an AI service.

## Verification and evidence

Final status: PASS. The complete journey passed all 12 scenario checks, the redesign audit passed all 32 layout combinations and four behavior groups, and the release check passed all unit suites and freshness gates. Neither browser run reported a page error.

- `tools/check-conversation.cjs`: complete journey from choices through questions, edits, recovery, validation, failure/retry, all eight saved Foundation sections, export, History and stale-tab protection. Evidence: `audit/conversational-onboarding-2026-11-05/` (canonical folder retained).
- `tools/audit-chat-redesign.cjs`: all eleven answers and stage/count transitions; bidirectional color-picker synchronization; 32 combinations across two themes, four viewport sizes (down to 320 × 640) and four question layouts; brief visibility and Escape focus return; additional narrow viewport with enlarged text and RTL. Evidence: `audit/chat-redesign-2026-11-06/`.
- Browser contexts use isolated local storage. Screenshots are real rendered pages, not mockups. Desktop spacing choices, mobile corner choices, first question and review were visually inspected.
- `bash tools/release_check.sh`: unit suites and token/Foundation/contract/catalog/Figma-bundle freshness gates. Output: `audit/chat-redesign-2026-11-06/release-check.log`.

Run browser scripts with `ADS_PLAYWRIGHT_PACKAGE` pointing to an installed Playwright Core package. The checks use Chrome and an ephemeral local HTTP server. A physical-device keyboard and assistive-technology session were not part of automated verification.

## Follow-up: remove the draft interstitial

The user identified the unfinished-conversation screen as the screen to remove. `onboarding.js` now restores a readable draft directly after New project (or intentional in-app new/resume navigation). The `resumeDraft()` path restores answers, unfinished input, creation/edit intent, baseline and the correct question or summary without writing over the stored draft. The interstitial and its Resume button are no longer created for valid drafts. Invalid/future data keeps backup/discard recovery, and stale baselines remain blocked. The welcome screen remains the first page.

Updated browser checks assert that recovery is hidden and no Resume button exists when a readable draft is restored. They cover file/HTTP entry, pending text, platform selections, completed summaries and unchanged stale/unreadable drafts. Follow-up logs: `direct-resume-entry.log`, `direct-resume-journey.log` and `direct-resume-release.log` in `audit/chat-redesign-2026-11-06/`.

Follow-up validation: file and HTTP entry checks passed; the complete journey passed all 14 scenario checks, including stale/unreadable draft protection; release checks passed.
