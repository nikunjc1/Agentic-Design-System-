# Onboarding optimization — 6 November 2026

The current welcome choices and direct restoration of unfinished conversations remain intact. This pass fixes interaction and persistence issues in the redesigned chatbot.

## Changes

- Text draft saving now waits for a 200ms pause in typing, instead of synchronously writing local storage on every keystroke. Blur, page hide and backgrounding flush pending text; selections and submitted answers save immediately. Identical payloads are not written again.
- Each draft write compares the expected stored profile and draft. A conflict cancels queued saves. Further typing cannot overwrite a newer draft, and Cancel only removes the draft this page still owns.
- Cancel clears the timer before removing a draft, preventing a delayed save from recreating it.
- `pendingAnswers` in conversation metadata retains unfinished replies per question, including when the user edits an earlier answer. Older drafts still load with an empty map; malformed maps retain explicit recovery.
- Clicking an option overrides previously typed choice text. Keyboard Enter only submits from the textarea; focused buttons retain their normal action.
- Valid corrections clear stale error text and `aria-invalid`.
- Editing a complete saved setup opens the Review stage. Empty color input stays empty when restored, rather than silently resetting to red.
- Unchanged historical reply text is no longer reassigned during every render. Setup reuses the light/dark themes already resolved by its plan instead of computing both twice.

## Files

`onboarding.js`, `onboarding-model.js`, `tests/onboarding-model.test.cjs`, `tools/check-onboarding-optimization.cjs`, and the authoritative `foundation-contract.json`. Shared generated contracts/defaults/token manifests/catalog were refreshed.

The data change is additive inside existing version-1 conversation metadata. No profile or Foundation schema is changed. The local deterministic planner and atomic save/rollback remain the same.

## Evidence

`audit/onboarding-optimization-2026-11-06/` contains `baseline.json`, `results.json`, focused checks and full journey/layout/release logs. A 23-character typing burst produced **23 draft writes before and 1 after** (about 96% fewer writes for this measured case). This measures draft writes, not overall page speed. Immediate reload still preserves the latest text.

Focused browser checks cover autosave/reload, error clearing, clicked-versus-typed choices, keyboard actions, unfinished text while editing, cross-tab queued writes and cancellation, and saved-project review. The canonical conversation journey also covers save rollback/retry, all eight Foundation sections, History, conflicts and unreadable-data recovery. The layout audit covers 32 screen/theme/question combinations.

Commands:

```sh
node --test tests/onboarding-model.test.cjs
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-onboarding-optimization.cjs
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-conversation.cjs
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/audit-chat-redesign.cjs
bash tools/release_check.sh
```

Keep timer flushing, ownership checks and cancellation together when changing draft persistence. Do not restore the removed Resume/Discard interstitial for readable drafts.

Final validation: all 8 focused checks passed, the full 14-scenario conversation journey passed, and all 32 layout combinations passed. Model tests and release checks passed. The final release check after the cancellation-ownership refinement is recorded in `audit/page-label-cleanup-2026-11-06/release-check.log`.
