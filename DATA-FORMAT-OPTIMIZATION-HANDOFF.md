# Data Format optimization — 6 November 2026

## Scope

Reviewed `data-format.html` at the level of individual controls, validation, formatting examples, state semantics, persistence, layout and exports. Work applies to **Agentic Design System 2**. Existing project data and saved setting meanings are preserved.

## Findings and fixes

| Finding | Change |
| --- | --- |
| JavaScript replaced every rule with the same generic sentence | Specific guidance remains visible and is included in Markdown. Examples use explicit `data-format` attributes instead of matching label text. |
| English-only rules contradicted configurable locales | Grouping, currency placement, date style, clock format, percentages and relative wording now follow the selected settings. Unit guidance preserves symbol case and recommends SI spacing. |
| Twenty-four controls displayed raw enum names with little explanation | Added plain-language option labels, field help, grouped settings and a live preview before the controls. Checkboxes display On/Off accurately. |
| Imported supported locales/currencies outside the six presets appeared blank | Retain imported values as selectable options. |
| Decimal-comma validation recognized only Germany and France | Inspect `Intl.NumberFormat().formatToParts()` for the actual decimal mark, matching the model's validation. |
| Errors were only summarized; reset left stale invalid attributes | Associate field-specific errors and help with each input, retain the summary, clear all errors on reset, and focus the first invalid field on submission. |
| Input and change events repeated writes | Deduplicate successful identical configurations. Failed writes remain retryable; reverting an unsaved preview restores the previous configuration correctly. |
| A shared required-marker helper could loop for labels linked by `for` | Keep the marker inside the external label so subsequent observer passes recognize it. Wrapping labels retain their existing behavior. |
| UTC-midnight range samples shifted in western time zones | Use date-only endpoints for calendar ranges. Timestamp examples still demonstrate time-zone conversion. |
| Sub-minute relative values were hardcoded English and future events said “just now” | Use localized, directional seconds via `Intl.RelativeTimeFormat`, including the localized zero-second expression. |
| Missing-state guidance was duplicated and incomplete | One section distinguishes zero, missing, loading, invalid input, empty lists, full/partial masking and the configured masking default. |
| Compact values relied on hover for an expanded example | Add a visible expanded value using the chosen decimal precision. |
| Markdown included all unselected dropdown options | Add a reusable `data-markdown-skip` opt-out to the exporter; exclude controls, transient action/status text and the redundant preview table. Preserve specific guide examples and current valid JSON settings. |

## Files

- `data-format.html`: rules and semantic example markup; duplicate missing-state panel removed.
- `data-format.js`: configuration editor, validation, previews, save/reset/download behavior.
- `foundation.css`: responsive field/help/error rows using existing tokens and subgrid; body-size formatted examples for readability.
- `foundation-model.js`: localized sub-minute relative formatting; generated contract updated.
- `foundation-runtime.js`: idempotent required markers for external labels.
- `experience.js`: Markdown opt-out support.
- `foundation-contract.json`: authoritative localized-display rule.
- Generated contract documentation, Foundation outputs and page catalog regenerated with the repository tools.
- `tests/data-format-precision.test.cjs`: locale, range, value-identity and relative-time regressions.
- `tests/foundation-units.test.cjs`: added standard DOM `contains()` behavior to its test fixture for the label fix.
- `tools/check-data-format.cjs`: real Chrome workflow and layout regression check.

## Validation and evidence

Final result: **PASS** for Chrome workflow checks, all unit suites and all freshness gates.

Evidence: `audit/data-format-2026-11-06/`.

- Model tests cover localized past/current/future seconds, disabled relative time, five decimal-comma locales, Indian grouping, date-only ranges in four zones, percentages, unit case/spacing, zero and masking.
- Chrome checks exercise all 24 rendered controls; save deduplication; simultaneous invalid edits; imported Spanish/CAD settings; reset; masking; date ranges; clipboard Markdown; JSON download; reload; failed writes and reverting a failed preview.
- Layout checks at 320, 390, 768 and 1440 CSS pixels, in light and dark themes, plus RTL with doubled root text. Standard inputs meet the 44px minimum height. These checks are not a full screen-reader or browser-zoom certification.
- Cross-tab conflict checks verify stale controls are disabled and reload uses the latest settings.
- Required-marker count remains seven, with no browser page errors.
- `results.json` records the browser result; screenshots cover the preview, controls and state guidance. `configuration.json` and `page.md` capture export examples.
- `release-check.log` records the full unit suite and generator/plugin freshness gates.

Commands (run from the project directory):

```sh
node tests/data-format-precision.test.cjs
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-data-format.cjs
bash tools/release_check.sh
```

If modifying the contract, regenerate before checking:

```sh
python3 tools/generate_contract_docs.py
python3 tools/generate_foundation.py
python3 tools/generate_tokens.py
python3 tools/audit_pages.py
```

## Compatibility and follow-up constraints

- Keep the existing settings schema and enum values. Human-readable labels are presentation only.
- Existing defaults, including legacy `unitSpace: "none"`, remain unchanged to avoid silently changing other components. The editor and documentation recommend a space/non-breaking space for SI units. A future global default change should be reviewed separately.
- Currency precision remains explicitly configurable; selecting a currency does not convert values or automatically choose currency minor units.
- The formatter still returns the missing placeholder for invalid raw input. Callers must validate first and retain an explicit error state; the page now documents and demonstrates that distinction.
- Masking is presentation only. Examples are fictional; masking cannot substitute for removing sensitive data before browser delivery.
- No backend, remote deployment or Figma plugin changes were part of this task.

SI guidance reference: [BIPM SI Brochure](https://www.bipm.org/en/publications/si-brochure/) and [NIST rules for expressing quantities](https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-7-rules-and-style-conventions-expressing-values). Unit symbols preserve case and generally have a space between the numeric value and the symbol (with specific angular-unit exceptions).
