# Data Format

Set consistent display rules for numbers, dates and data states. Preview your choices, then copy the guidance or download the configuration.

## Configure and preview
Valid changes save automatically in this browser and update the examples and exports. Incomplete or invalid edits keep the last valid configuration active.
Text spacing preview: Before After

## Numbers and currency

Format quantities consistently for the selected locale. Keep identifiers, phone numbers and postal codes as text to preserve leading zeros.

Thousands separator
Use locale grouping by default. Indian grouping, decimal marks and digit shapes follow the locale; custom grouping must not conflict with decimal marks.
123 220,5

Units
Preserve unit-symbol case (kg, kW, °C). For SI quantities, choose a space or non-breaking space before the unit; no-space formatting is a project exception.
220kg

Currency
The locale controls symbol position and spacing. Choose a symbol, currency code or name. Decimal precision fixes the displayed currency fraction; it does not convert currencies.
123,45 €

Percentages
Pass a ratio: 0.125 means 12.5%. Locale controls the percent sign and spacing. Never multiply the value twice.
12,5 %

Large amounts
Compact notation follows locale conventions. Use standard notation for exact comparisons. The expanded example below uses the selected decimal precision.
1,23 MExpanded: 1 234 567

Tables
Use tabular numerals and consistent alignment. End alignment is recommended for numeric columns; text identifiers keep their text alignment.
123 220,5

## Dates and times

Keep calendar dates separate from timestamps. Date-only values retain their calendar day; timestamps are displayed in the selected time zone.

Absolute date
Choose YYYY-MM-DD for shared, unambiguous dates, or a locale or long date for readers in a known locale. This example is a date-only value.
2026-03-14

Absolute time
Choose a 12- or 24-hour clock for your audience. Include seconds only when needed. This timestamp is 14:08 UTC before conversion.
14:08 UTC

Combined
The selected separator joins the display date and time. A T separator alone does not produce an ISO timestamp; use explicit-offset timestamps for data interchange.
2026-03-14 14:08 UTC

Relative time
When enabled, use localized seconds, minutes or hours for events within 24 hours, then an absolute date. When disabled, always show the date.
il y a 12 minutes

Time zone
Use an IANA zone such as Asia/Kolkata. Show the zone when readers work across regions. Daylight-saving rules apply to the timestamp’s date.
14:08 UTC

Ranges
Provide two valid dates in chronological order. The separator is configurable. Date-only endpoints remain unchanged in every time zone.
2026-01-01 – 2026-03-31

## Missing and sensitive data

Use distinct states for zero, absent values, pending requests and errors. Masking is presentation only: remove sensitive data before delivering it to the browser.

Zero
A real zero is a value. Never replace it with the missing-value placeholder.
0

No value
Use the configured placeholder for a confirmed absent value. An empty list instead needs a clear message such as “No results”.
–

Loading
Use a skeleton or loading text while a request is pending. Announce loading once for the containing region, rather than every table cell.
Loading…

Invalid value
Validate inputs before formatting and show a specific error. The formatter falls back to the missing placeholder for invalid input, so callers must preserve the error state.
Invalid date — check the source value

Empty list
A completed search with no matches is an empty state, not a missing cell or a loading request.
No results. Try a different search.

Full redaction
Replace every character with the chosen mask. Do not reveal the original value in tooltips, accessible names or exported content.
************

Partial redaction
Reveal only the permitted trailing characters (0–8); at least one character always stays masked. The configured default controls generic redaction.
********1402

Default redaction
This example follows the Full or Partial default selected above. Use only fictional data in examples.
********1402

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Flow
Configure a field, inspect its formatted example, copy/export current valid settings and reset/reload. Every valid input updates without blur. Invalid simultaneous fields all expose errors and retain the prior valid configuration.

### Constraints
Decimal precision 0–6, trailing reveal 0–8, one Unicode code point for the mask, a supported locale and valid IANA zone. Explicit comma grouping cannot conflict with a comma decimal locale. Distinguish real zero, missing, invalid and loading. Never reveal the entire value through a tooltip or accessible name.

### Layout and accessibility
Group number/currency, date/time and missing/sensitive settings with separators. Equal field heights and gutters, wrapped labels and responsive columns share the reference layout. Loading is announced once. Export the typed configuration and locale/zone/range/redaction rules.

### Value identity
Apply numeric formatting to quantities, not IDs, phone numbers, postal codes or tracking references. Preserve leading zeros. Numeric table alignment applies only to numeric kinds. Date-only values retain their calendar day regardless of time zone. Ranges require two valid ordered dates; partial redaction counts Unicode code points and always masks at least one.

### Localized display
Locale controls grouping patterns, currency placement, percent spacing and relative wording. Unit symbols preserve case; SI quantities use a space before the unit. Decimal precision fixes currency fractions and limits other numeric fractions. Display strings are not interchange timestamps. Exports include current valid configuration and specific guidance, not unselected editor options.
Machine contract: section rules, storage, units and acceptance
{
"schemaVersion": 1,
"authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
"governance": {
"owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
"changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
"compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
"deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
"scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
},
"storage": {
"version": 1,
"legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
"future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
"invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
"concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
},
"units": {
"base": "1rem = 16px at default browser settings. Do not fix the root font size.",
"use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
"native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
},
"acceptance": [
"Compare page, applied tokens, durable record, Machine View and exported instructions.",
"Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
"Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
"Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
"Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
],
"layers": {
"content": 0,
"sticky": 20,
"popover": 40,
"scrim": 60,
"dialog": 70,
"toast": 80,
"tooltip": 90,
"rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
},
"section": {
"title": "Data Format",
"rules": {
"Flow": "Configure a field, inspect its formatted example, copy/export current valid settings and reset/reload. Every valid input updates without blur. Invalid simultaneous fields all expose errors and retain the prior valid configuration.",
"Constraints": "Decimal precision 0\u20136, trailing reveal 0\u20138, one Unicode code point for the mask, a supported locale and valid IANA zone. Explicit comma grouping cannot conflict with a comma decimal locale. Distinguish real zero, missing, invalid and loading. Never reveal the entire value through a tooltip or accessible name.",
"Layout and accessibility": "Group number/currency, date/time and missing/sensitive settings with separators. Equal field heights and gutters, wrapped labels and responsive columns share the reference layout. Loading is announced once. Export the typed configuration and locale/zone/range/redaction rules.",
"Value identity": "Apply numeric formatting to quantities, not IDs, phone numbers, postal codes or tracking references. Preserve leading zeros. Numeric table alignment applies only to numeric kinds. Date-only values retain their calendar day regardless of time zone. Ranges require two valid ordered dates; partial redaction counts Unicode code points and always masks at least one.",
"Localized display": "Locale controls grouping patterns, currency placement, percent spacing and relative wording. Unit symbols preserve case; SI quantities use a space before the unit. Decimal precision fixes currency fractions and limits other numeric fractions. Display strings are not interchange timestamps. Exports include current valid configuration and specific guidance, not unselected editor options."
}
}
}

## Current Data Format configuration

```json
{
  "locale": "fr-FR",
  "grouping": true,
  "separator": "locale",
  "unit": "kg",
  "unitSpace": "none",
  "currency": "EUR",
  "currencyDisplay": "symbol",
  "decimals": 2,
  "large": "compact",
  "tableAlign": "end",
  "date": "iso",
  "hourCycle": "h23",
  "seconds": false,
  "combined": "space",
  "relative": true,
  "zone": "UTC",
  "showZone": true,
  "range": " – ",
  "noValue": "–",
  "loading": "skeleton",
  "redaction": "partial",
  "mask": "*",
  "reveal": 4,
  "escapedSpace": "space"
}
```

<!-- ads:contract -->
## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Ownership and compatibility

- owners: Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.
- changes: Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.
- compatibility: Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.
- deprecation: Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.
- scope: This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification.

### Storage and recovery

- version: 1
- legacy: Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.
- future: Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.
- invalid: Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.
- concurrency: A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently.

### Units

- 1rem = 16px at default browser settings. Do not fix the root font size.
- Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.
- Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library.

### Layers

{"content":0,"sticky":20,"popover":40,"scrim":60,"dialog":70,"toast":80,"tooltip":90,"rules":"Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."}

### Acceptance still required

- Compare page, applied tokens, durable record, Machine View and exported instructions.
- Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.
- Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.
- Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.
- Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance.

### Data Format

- Flow: Configure a field, inspect its formatted example, copy/export current valid settings and reset/reload. Every valid input updates without blur. Invalid simultaneous fields all expose errors and retain the prior valid configuration.
- Constraints: Decimal precision 0–6, trailing reveal 0–8, one Unicode code point for the mask, a supported locale and valid IANA zone. Explicit comma grouping cannot conflict with a comma decimal locale. Distinguish real zero, missing, invalid and loading. Never reveal the entire value through a tooltip or accessible name.
- Layout and accessibility: Group number/currency, date/time and missing/sensitive settings with separators. Equal field heights and gutters, wrapped labels and responsive columns share the reference layout. Loading is announced once. Export the typed configuration and locale/zone/range/redaction rules.
- Value identity: Apply numeric formatting to quantities, not IDs, phone numbers, postal codes or tracking references. Preserve leading zeros. Numeric table alignment applies only to numeric kinds. Date-only values retain their calendar day regardless of time zone. Ranges require two valid ordered dates; partial redaction counts Unicode code points and always masks at least one.
- Localized display: Locale controls grouping patterns, currency placement, percent spacing and relative wording. Unit symbols preserve case; SI quantities use a space before the unit. Decimal precision fixes currency fractions and limits other numeric fractions. Display strings are not interchange timestamps. Exports include current valid configuration and specific guidance, not unselected editor options.
<!-- /ads:contract -->

<!-- ads:page-foundation -->
## Current Foundation configuration

The following configuration is the applied state. Unfinished or invalid editor drafts are not applied. Reference assets are included in Foundation JSON.

```json
{
  "unit": "px",
  "theme": "light",
  "density": "comfortable",
  "direction": "ltr",
  "settings": {
    "colors": null,
    "bg-colors": null,
    "status-colors": null,
    "neutral-colors": null,
    "typography": null,
    "spacing": null,
    "sizing": null,
    "radius": null,
    "border": null,
    "border-states": null,
    "shadow": null,
    "icons": null,
    "grid-layout": null,
    "units": null,
    "data-format": {
      "locale": "fr-FR",
      "grouping": true,
      "separator": "locale",
      "unit": "kg",
      "unitSpace": "none",
      "currency": "EUR",
      "currencyDisplay": "symbol",
      "decimals": 2,
      "large": "compact",
      "tableAlign": "end",
      "date": "iso",
      "hourCycle": "h23",
      "seconds": false,
      "combined": "space",
      "relative": true,
      "zone": "UTC",
      "showZone": true,
      "range": " – ",
      "noValue": "–",
      "loading": "skeleton",
      "redaction": "partial",
      "mask": "*",
      "reveal": 4,
      "escapedSpace": "space",
      "schemaVersion": 1
    }
  },
  "unsavedPreviewKeys": [],
  "tokens": {
    "--graphite-950": "#f6f6f4",
    "--graphite-900": "#ffffff",
    "--graphite-850": "#fbfbfa",
    "--graphite-800": "#f1f1ee",
    "--graphite-700": "#e3e3df",
    "--graphite-600": "#c7c7c1",
    "--graphite-500": "#8f918c",
    "--control-border": "#85888d",
    "--border-width-0": "0px",
    "--border-width-1": "1px",
    "--border-width-1-5": "1.5px",
    "--border-width-2": "2px",
    "--border-width-3": "3px",
    "--border-width-4": "4px",
    "--red-500": "#FF031A",
    "--red-400": "#ff4253",
    "--red-600": "#d10215",
    "--red-glow": "rgba(255,3,26,0.35)",
    "--red-tint": "rgba(255,3,26,0.08)",
    "--green-500": "#2fbf6e",
    "--amber-500": "#e6a53a",
    "--danger-500": "#ff031a",
    "--danger-400": "#ff4253",
    "--danger-600": "#d10215",
    "--blue-500": "#4f8fe6",
    "--font-display": "\"Inter\", ui-sans-serif, system-ui, sans-serif",
    "--font-body": "\"Inter\", ui-sans-serif, system-ui, sans-serif",
    "--font-mono": "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", monospace",
    "--radius-sm": "4px",
    "--radius-md": "8px",
    "--space-4": "4px",
    "--space-8": "8px",
    "--space-12": "12px",
    "--space-16": "16px",
    "--space-24": "24px",
    "--space-32": "32px",
    "--space-40": "40px",
    "--space-48": "48px",
    "--space-64": "64px",
    "--shadow-none": "none",
    "--shadow-xs": "0 1px 2px rgba(0,0,0,0.06)",
    "--shadow-sm": "0 1px 4px rgba(0,0,0,0.08)",
    "--shadow-md": "0 4px 8px rgba(0,0,0,0.1)",
    "--shadow-lg": "0 8px 16px rgba(0,0,0,0.12)",
    "--shadow-xl": "0 12px 24px rgba(0,0,0,0.14)",
    "--shadow-2xl": "0 16px 32px rgba(0,0,0,0.16)",
    "--color-ai-accent": "#8b5cf6",
    "--color-ai-accent-strong": "#7c3aed",
    "--color-ai-accent-tint": "rgba(139,92,246,0.12)",
    "--color-ai-confidence-high": "var(--green-700)",
    "--color-ai-confidence-medium": "#986d26",
    "--color-ai-confidence-low": "var(--danger-700)",
    "--color-agent-success": "var(--green-500)",
    "--color-agent-failure": "var(--danger-500)",
    "--type-h1-family": "var(--font-display)",
    "--type-h1-size": "32px",
    "--type-h1-line-height": "1.25",
    "--type-h1-weight": "700",
    "--type-h1-style": "normal",
    "--type-h1-tracking": "0px",
    "--type-h1-color": "#111827",
    "--type-h2-family": "var(--font-display)",
    "--type-h2-size": "28px",
    "--type-h2-line-height": "1.29",
    "--type-h2-weight": "700",
    "--type-h2-style": "normal",
    "--type-h2-tracking": "0px",
    "--type-h2-color": "#111827",
    "--type-h3-family": "var(--font-display)",
    "--type-h3-size": "24px",
    "--type-h3-line-height": "1.33",
    "--type-h3-weight": "600",
    "--type-h3-style": "normal",
    "--type-h3-tracking": "0px",
    "--type-h3-color": "#111827",
    "--type-h4-family": "var(--font-display)",
    "--type-h4-size": "20px",
    "--type-h4-line-height": "1.4",
    "--type-h4-weight": "600",
    "--type-h4-style": "normal",
    "--type-h4-tracking": "0px",
    "--type-h4-color": "#111827",
    "--type-h5-family": "var(--font-display)",
    "--type-h5-size": "18px",
    "--type-h5-line-height": "1.44",
    "--type-h5-weight": "500",
    "--type-h5-style": "normal",
    "--type-h5-tracking": "0px",
    "--type-h5-color": "#111827",
    "--type-h6-family": "var(--font-display)",
    "--type-h6-size": "16px",
    "--type-h6-line-height": "1.5",
    "--type-h6-weight": "500",
    "--type-h6-style": "normal",
    "--type-h6-tracking": "0px",
    "--type-h6-color": "#111827",
    "--type-body-family": "var(--font-body)",
    "--type-body-size": "16px",
    "--type-body-line-height": "1.5",
    "--type-body-weight": "400",
    "--type-body-style": "normal",
    "--type-body-tracking": "0px",
    "--type-body-color": "#4B5563",
    "--type-paragraph-family": "var(--font-body)",
    "--type-paragraph-size": "16px",
    "--type-paragraph-line-height": "1.5",
    "--type-paragraph-weight": "400",
    "--type-paragraph-style": "normal",
    "--type-paragraph-tracking": "0px",
    "--type-paragraph-color": "#4B5563",
    "--type-caption-family": "var(--font-body)",
    "--type-caption-size": "11px",
    "--type-caption-line-height": "1.5",
    "--type-caption-weight": "400",
    "--type-caption-style": "normal",
    "--type-caption-tracking": "0px",
    "--type-caption-color": "#69707D",
    "--type-active-family": "var(--font-body)",
    "--type-active-size": "14px",
    "--type-active-line-height": "1.43",
    "--type-active-weight": "500",
    "--type-active-style": "normal",
    "--type-active-tracking": "0px",
    "--type-active-color": "#E20317",
    "--type-selected-family": "var(--font-body)",
    "--type-selected-size": "14px",
    "--type-selected-line-height": "1.43",
    "--type-selected-weight": "600",
    "--type-selected-style": "normal",
    "--type-selected-tracking": "0px",
    "--type-selected-color": "#E20317",
    "--type-disabled-family": "var(--font-body)",
    "--type-disabled-size": "14px",
    "--type-disabled-line-height": "1.43",
    "--type-disabled-weight": "400",
    "--type-disabled-style": "normal",
    "--type-disabled-tracking": "0px",
    "--type-disabled-color": "#9CA3AF",
    "--type-error-family": "var(--font-body)",
    "--type-error-size": "14px",
    "--type-error-line-height": "1.43",
    "--type-error-weight": "500",
    "--type-error-style": "normal",
    "--type-error-tracking": "0px",
    "--type-error-color": "#D23441",
    "--type-warning-family": "var(--font-body)",
    "--type-warning-size": "14px",
    "--type-warning-line-height": "1.43",
    "--type-warning-weight": "500",
    "--type-warning-style": "normal",
    "--type-warning-tracking": "0px",
    "--type-warning-color": "#926924",
    "--type-success-family": "var(--font-body)",
    "--type-success-size": "14px",
    "--type-success-line-height": "1.43",
    "--type-success-weight": "500",
    "--type-success-style": "normal",
    "--type-success-tracking": "0px",
    "--type-success-color": "#20814A",
    "--type-info-family": "var(--font-body)",
    "--type-info-size": "14px",
    "--type-info-line-height": "1.43",
    "--type-info-weight": "500",
    "--type-info-style": "normal",
    "--type-info-tracking": "0px",
    "--type-info-color": "#3E70B5",
    "--green-700": "#21864d",
    "--danger-700": "#eb0318",
    "--red-700": "#eb0318",
    "--green-page-text": "#1d7644",
    "--danger-page-text": "#c70214",
    "--amber-page-text": "#8a6323",
    "--blue-page-text": "#3a6aaa",
    "--agent-approve-bg-default": "#d5f2e2",
    "--agent-approve-text-default": "#1d7644",
    "--agent-approve-bg-hover": "#c5edd6",
    "--agent-approve-text-hover": "#1c7342",
    "--agent-approve-bg-active": "#b4e8cb",
    "--agent-approve-text-active": "#1b6f40",
    "--agent-reject-bg-default": "#dbdde0",
    "--agent-reject-text-default": "#4b5563",
    "--agent-reject-bg-hover": "#cdcfd3",
    "--agent-reject-text-hover": "#4b5563",
    "--agent-reject-bg-active": "#bec2c7",
    "--agent-reject-text-active": "#47505d",
    "--space-6": "8px",
    "--radius-lg": "16px",
    "--border-style": "solid",
    "--border-sides": "all",
    "--border-state-focus": "var(--red-500)",
    "--size-control": "40px",
    "--size-target": "44px",
    "--size-icon": "24px",
    "--size-content": "1200px",
    "--size-sidebar": "264px",
    "--icon-size": "24px",
    "--icon-stroke": "1.8",
    "--icon-cap": "round",
    "--icon-join": "round",
    "--grid-columns": "12",
    "--grid-gutter": "24px"
  }
}
```
<!-- /ads:page-foundation -->

<!-- ads:dimension-reference -->
## Dimensions: px and rem

Reference base: **1rem = 16px**. Both columns are equivalent alternatives, not two values to apply together. rem responds to the browser root font size; do not lock the root size to disable user scaling.

Use rem for scalable typography and spacing; retain px for hairline borders and viewport breakpoints where the component guidelines require it. Percentages, em, viewport units, line-height ratios, weights, opacity and timing are not converted. Code examples retain valid syntax.

| Token | px | rem |
| --- | --- | --- |
| `--border-width-0` | `0px` | `0rem` |
| `--border-width-1` | `1px` | `0.0625rem` |
| `--border-width-1-5` | `1.5px` | `0.09375rem` |
| `--border-width-2` | `2px` | `0.125rem` |
| `--border-width-3` | `3px` | `0.1875rem` |
| `--border-width-4` | `4px` | `0.25rem` |
| `--grid-gutter` | `24px` | `1.5rem` |
| `--icon-size` | `24px` | `1.5rem` |
| `--radius-lg` | `16px` | `1rem` |
| `--radius-md` | `8px` | `0.5rem` |
| `--radius-sm` | `4px` | `0.25rem` |
| `--shadow-2xl` | `0 16px 32px rgba(0,0,0,0.16)` | `0 1rem 2rem rgba(0,0,0,0.16)` |
| `--shadow-lg` | `0 8px 16px rgba(0,0,0,0.12)` | `0 0.5rem 1rem rgba(0,0,0,0.12)` |
| `--shadow-md` | `0 4px 8px rgba(0,0,0,0.1)` | `0 0.25rem 0.5rem rgba(0,0,0,0.1)` |
| `--shadow-sm` | `0 1px 4px rgba(0,0,0,0.08)` | `0 0.0625rem 0.25rem rgba(0,0,0,0.08)` |
| `--shadow-xl` | `0 12px 24px rgba(0,0,0,0.14)` | `0 0.75rem 1.5rem rgba(0,0,0,0.14)` |
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.06)` | `0 0.0625rem 0.125rem rgba(0,0,0,0.06)` |
| `--size-content` | `1200px` | `75rem` |
| `--size-control` | `40px` | `2.5rem` |
| `--size-icon` | `24px` | `1.5rem` |
| `--size-sidebar` | `264px` | `16.5rem` |
| `--size-target` | `44px` | `2.75rem` |
| `--space-12` | `12px` | `0.75rem` |
| `--space-16` | `16px` | `1rem` |
| `--space-24` | `24px` | `1.5rem` |
| `--space-32` | `32px` | `2rem` |
| `--space-4` | `4px` | `0.25rem` |
| `--space-40` | `40px` | `2.5rem` |
| `--space-48` | `48px` | `3rem` |
| `--space-6` | `8px` | `0.5rem` |
| `--space-64` | `64px` | `4rem` |
| `--space-8` | `8px` | `0.5rem` |
| `--type-active-size` | `14px` | `0.875rem` |
| `--type-active-tracking` | `0px` | `0rem` |
| `--type-body-size` | `16px` | `1rem` |
| `--type-body-tracking` | `0px` | `0rem` |
| `--type-caption-size` | `11px` | `0.6875rem` |
| `--type-caption-tracking` | `0px` | `0rem` |
| `--type-disabled-size` | `14px` | `0.875rem` |
| `--type-disabled-tracking` | `0px` | `0rem` |
| `--type-error-size` | `14px` | `0.875rem` |
| `--type-error-tracking` | `0px` | `0rem` |
| `--type-h1-size` | `32px` | `2rem` |
| `--type-h1-tracking` | `0px` | `0rem` |
| `--type-h2-size` | `28px` | `1.75rem` |
| `--type-h2-tracking` | `0px` | `0rem` |
| `--type-h3-size` | `24px` | `1.5rem` |
| `--type-h3-tracking` | `0px` | `0rem` |
| `--type-h4-size` | `20px` | `1.25rem` |
| `--type-h4-tracking` | `0px` | `0rem` |
| `--type-h5-size` | `18px` | `1.125rem` |
| `--type-h5-tracking` | `0px` | `0rem` |
| `--type-h6-size` | `16px` | `1rem` |
| `--type-h6-tracking` | `0px` | `0rem` |
| `--type-info-size` | `14px` | `0.875rem` |
| `--type-info-tracking` | `0px` | `0rem` |
| `--type-paragraph-size` | `16px` | `1rem` |
| `--type-paragraph-tracking` | `0px` | `0rem` |
| `--type-selected-size` | `14px` | `0.875rem` |
| `--type-selected-tracking` | `0px` | `0rem` |
| `--type-success-size` | `14px` | `0.875rem` |
| `--type-success-tracking` | `0px` | `0rem` |
| `--type-warning-size` | `14px` | `0.875rem` |
| `--type-warning-tracking` | `0px` | `0rem` |

| Dimension in this prompt/document | rem equivalent |
| --- | --- |
| `0px` | `0rem` |
| `1px` | `0.0625rem` |
| `1.5px` | `0.09375rem` |
| `2px` | `0.125rem` |
| `3px` | `0.1875rem` |
| `4px` | `0.25rem` |
| `8px` | `0.5rem` |
| `11px` | `0.6875rem` |
| `12px` | `0.75rem` |
| `14px` | `0.875rem` |
| `16px` | `1rem` |
| `18px` | `1.125rem` |
| `20px` | `1.25rem` |
| `24px` | `1.5rem` |
| `28px` | `1.75rem` |
| `32px` | `2rem` |
| `40px` | `2.5rem` |
| `44px` | `2.75rem` |
| `48px` | `3rem` |
| `64px` | `4rem` |
| `264px` | `16.5rem` |
| `1200px` | `75rem` |
| `1440px` | `90rem` |

<!-- /ads:dimension-reference -->