# Input: all sizes and corner radii — 30 October 2026

The authored export contains **1,152 complete variants**: 3 appearances × 8 states × 8 sizes × 6 corner radii.

- Sizes: 24, 28, 32, 36, 40, 44, 48, 56 px.
- Corner radius: 0, 2, 4, 8, 12, 9999 (Pill). Underlined stays square, matching the renderer.
- The selected web configuration remains the generated preview instance. All size/radius options are available in Figma regardless of that selection.
- Copy prompt, Copy preview code, JSON, HTML, and Draw in Figma capture the same complete contract.

The automated Chrome check passed with zero page errors. It verifies every combination's height and corners, complete property lists, the selected preview, saved configuration, rem units, redraw identity, and HTML behavior. Its Figma request is mocked against the production adapter with a strict API test double; `results.json` records that boundary. The release check passed all unit suites and generated-file freshness gates.

The source measures 192 actual renderer samples and reuses size/state geometry for the six corner options. The model/schema/adapter allow up to 2,048 authored variants. The bridge waits 600 seconds and the web action waits 605 seconds. Native property binding caches anatomy/rules, and the component set wraps into 12 columns. Existing matching master IDs are reused. The 24px renderer now uses caption typography so body text minimum height does not stretch it to 26px.

See `INPUT-TEXT-FIELD-AI-HANDOFF.md` in the project root, section 12, for implementation and continuation details. Earlier 24-variant evidence remains in `audit/input-export-2026-10-30/` as a historical record.


Live follow-up exposed a large-import performance problem and request timeouts. Subsequent adapter fixes index existing masters, use native typed lookups, reuse exact geometry for new radius variants, and cache property-binding metadata per layer. Large-set inspection returns names/options/counts and deliberately omits the full binding walk. Automated checks pass for these corrections. See the `live/` folder and the root handoff for the actual live result; do not treat the mocked browser result as Figma acceptance.

**Current live status:** full-matrix canvas verification remains pending. The health request was observed queued with `connected: false`. See `live/results.json`. Resolve plugin polling/connection before sending another large draw. The root handoff records the exact build and diagnostic routes.
