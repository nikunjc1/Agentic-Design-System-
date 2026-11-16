# Button detail layout — 28 October 2026

Implemented in **Agentic Design System 2**. The original folder was not changed.

## Layout changes

- Button-only styles cover Primary, Secondary, Tertiary, Neutral, Destructive, Ghost, Link and Primary dual-icon detail pages.
- Aligned 40px preview selectors, consistent gaps and predictable wrapping of the style, appearance, state and optional configuration controls.
- Dedicated showcase/comparison placement, with a single toolbar row where wider canvases permit it.
- Export actions form a consistent grid. At laptop widths the Figma action spans the two action rows; on phones it becomes a full-width action.
- The customization panel uses a compact two-column property grid, with consistent control heights, label spacing, focus rings and full-width conditional accessible-name controls.
- Atomic fields are grouped into Dimensions, Spacing, Layout, Typography, Color & surfaces and Icon & shape where relevant.
- Button, Label, Icon and Icon shape names identify the selected part. Edited text updates its part name without removing input focus.
- A dashed overlay locates the selected part while editing. It sits outside the component DOM and is excluded from component exports.
- The preview footer reports the rendered button width and height and updates as the component changes.
- Existing px/rem display, explicit CSS units, Foundation tokens, save/cancel/reset, export and Button variant navigation remain available.
- Narrow layouts stack the customization panel below the preview. Desktop layouts retain the panel on the right.

## Verification

`tools/check-button-layout.cjs` visits all eight Button pages at 1920, 1440, 1280, 1024, 768, 390 and 320 pixels: 56 page/width checks. It checks centered previews, selector alignment and page/inspector overflow, then exercises unit conversion, saving/reload, part text export, native properties, comparison modes, icon-only accessible names and dual-icon controls.

Before and after browser measurements are in `before.json` and `after.json`. Browser checks block external font requests and use available fallback fonts.

Screenshots:

- [Before, desktop](before-1440.png) / [After, desktop](after-1440.png)
- [Before, laptop](before-1024.png) / [After, laptop](after-1024.png)
- [Before, phone](before-390.png) / [After, phone](after-390.png)
- [Atomic inspector](after-atomic-inspector.png)
- [Comparison mode](after-compare.png)
- [Dual-icon detail](after-dual-icon.png)

Repeat with an installed Playwright package and permission to bind a localhost port:

```sh
ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-button-layout.cjs
```

The existing 69-page component workspace suite and repository release checks also run for regression coverage.
