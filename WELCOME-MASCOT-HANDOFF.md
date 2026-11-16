# Agentic Design System welcome mascot

Updated 6 November 2026. This version replaces the earlier drawn SVG companion with the user's supplied 3D robot design.

## Implementation

- `new-project.html`: places the mascot immediately above “Welcome to Agentic Design System,” with descriptive alternative text and a keyboard-accessible Pause/Play button.
- `assets/mascot/agentic-companion.png`: transparent 1199 × 1312 PNG, prepared from the supplied reference using the built-in image-generation tool. The background and floating symbol were removed; the character retains its headphones, hoodie, stylus, articulated hands, and boots. This is a generated extraction, not the original uploaded file.
- `welcome-mascot.css`: 240 × 260 CSS-pixel desktop stage, 196 × 214 mobile stage, 156 × 170 for short viewports. `object-fit: contain` preserves the source aspect ratio without stretching or cropping. A gentle ±0.65° sway pivots near the feet; the holographic plus and small tile float separately. There is no independent limb deformation, rigged skeletal animation, or face animation.
- `welcome-mascot.js`: optional pointer tilt, Pause/Play and OS reduced-motion support. Motion is local CSS; no account, network service, storage changes, or remote AI runtime.

The mascot appears on the initial project choice screen. Starting a new project continues into the existing chat flow. First-visit routing, saved projects and onboarding logic are unchanged.

## Reuse and editing

Reuse the `#welcomeMascot` markup with these CSS/JS files and the image asset. The current initializer supports one mascot per page. Keep image width/height attributes and `object-fit: contain`. Resize the stage rather than individual body parts. The artwork is a single flattened image; genuine joint animation would need separately prepared layers or a 3D rig.

## Verification

`tools/audit-welcome-mascot.cjs` checks both themes at 1440, 768, 390 and 320 pixels wide, image loading and dimensions, placement, overflow, actual changing motion, Pause/Play, pointer tilt, reduced motion, browser errors and transition into the chatbot. Evidence is in `audit/welcome-mascot-2026-11-06/`.

Run with Playwright Core available as `ADS_PLAYWRIGHT_PACKAGE`, then run `bash tools/release_check.sh`. The browser audit uses a temporary local HTTP server and isolated browser storage.

Final result: browser audit passed in all eight viewport/theme combinations; desktop light and mobile dark screenshots were visually reviewed. The full release check passed, including unit tests and generated-file freshness gates. See `audit/welcome-mascot-2026-11-06/results.json` and `release-check.log`.

## Image preparation prompt

Built-in image generation was used (not the CLI/API fallback). The attached mascot was the edit target. Exact prompt:

> Use case: background-extraction. Input image: the attached robot mascot is the edit target. Prepare this EXACT character as a clean transparent PNG cutout for a website welcome component. Preserve the full body, anatomy and proportions, lavender metallic robot head, black glass face with cyan smiling pixel eyes and mouth, headphones with antennae, purple/blue/coral hoodie with AI chest emblem, two articulated hands in the exact pose (one holding cyan stylus and the other raised pointing), two legs and boots. Keep all materials, shading and character identity. Remove only the light gray background, floor, bottom-right background sparkle and floating holographic plus sign; keep the entire character, stylus and antenna tips intact. Isolate a SINGLE full-body character, centered, tightly framed with a small safe transparent margin on all sides, portrait canvas. Genuine transparent alpha, no background, no new elements, no extra limbs, no cropped feet, no redesign. This is the static source artwork for gentle CSS animation; anatomy must remain faithful to the reference.
