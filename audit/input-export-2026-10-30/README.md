# Input Text Field exports — 30 October 2026

Implemented in **Agentic Design System 2**.

The five actions (Copy prompt, Copy preview code, Download JSON, Download HTML, Draw in Figma) now capture the current Input controls through one authored contract. Pending input edits are flushed before export. The contract contains all three appearances and eight states at the currently selected size and corner radius.

## Corrected

- Input values and placeholders are Figma text layers. Label text and the required marker retain separate layers and properties.
- Named parts keep stable identities across appearances, states, and redraws. Icons become nested component instances with instance-swap properties; supporting content has a slot.
- Text and Boolean properties retain label, placeholder, value, helper/error text, required indicator, icon visibility, clear action and supporting-content settings.
- Auto layout, dimensions, spacing, typography, colors, opacity, individual corner radii and individual border widths are mapped. Underlined inputs retain their bottom-only stroke. Rem line heights and dimensions are converted to Figma pixels. SVG paints and geometry are preserved.
- Exported HTML retains label associations, required, read-only, disabled, maxlength (including zero), error descriptions and placeholder color. Typing and Clear work; the configured trailing icon returns after clearing.
- Foundation no longer inserts a second required marker. Figma redraws clear old effects and text bindings, update the generated preview to the selected master, and surface conversion/font warnings.

## Verification

- `bash tools/release_check.sh`: all unit suites and generated-file freshness gates passed.
- `tools/check-input-exports.cjs`: actual Chrome interaction with all five export buttons, identical payloads, standalone HTML geometry comparison, interactive value/clear behavior, 24 adapter masters, properties, rem units, save/reload, redraw identity, validation states, dark/RTL. Zero page errors.
- Regression cases include rem typography, nested labels, placeholder/value binding changes, individual borders/corners, SVG colors, focus effects and removed effects.
- Evidence: `results.json`, `input-contract.json`, `input-text-field-preview.json`, `input-text-field-preview.html`, and screenshots in this directory.

The automated browser test intercepts the Figma push and uses an API test double; its `results.json` remains explicitly marked as mocked. A separate actual CTA run against the connected Figma plugin now succeeds: **24 variants, 4 variant axes, 5 Text, 5 Boolean, 2 Instance Swap and 1 Slot**. Existing-set migration and readback are verified. See `live/` for actual plugin evidence and the root `INPUT-TEXT-FIELD-AI-HANDOFF.md`, section 11, for failures and repairs. Screenshots demonstrate the web preview and HTML export; full Figma pixel parity and native editing combinations remain unverified.

## Use the updated Figma bridge

1. Run `node tools/component-bridge.cjs` from this project if its bridge is not already running.
2. In Figma, reopen the development plugin imported from this project's `figma-plugin/manifest.json` so it loads the rebuilt `code.js`.
3. Refresh `input-text-field.html`, choose the customization, then click **Draw in Figma**.

The chosen size and radius identify this export configuration; other size/radius selections require another export. HTML input type and validation rules remain in the contract and code. Figma does not execute web validation or Clear callbacks. Compound visibility rules are evaluated for each exported variant; Figma's independent Boolean properties do not recompute browser expressions when edited. The focus outline is represented as a zero-blur spread effect; its CSS outline-offset gap is approximated. Missing fonts are reported with the fallback used.

Native Text, Boolean, Instance Swap and Slot mappings follow [Figma's component property API](https://developers.figma.com/docs/plugins/working-with-component-properties/). Layout sizing and text sizing use [Figma node properties](https://developers.figma.com/docs/plugins/api/node-properties/) and [textAutoResize](https://developers.figma.com/docs/plugins/api/properties/TextNode-textautoresize/).

To rerun the browser check, install `playwright-core` or set `ADS_PLAYWRIGHT_PACKAGE` to its installed location. The checker uses local Google Chrome and a temporary localhost server.
