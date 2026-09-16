# Agentic Design System — UI/UX audit

Date: 9 September 2026. Target: local v3.4.0 prototype, starting at `foundations.html#shadows`. Scope: colours, typography, spacing, and shared flows affecting those foundations. Review perspective: senior enterprise product design, accessibility, and design-system governance.

## Assessment and evidence limits

The foundation editors are promising configuration prototypes, but they are not yet a dependable design-system authoring workflow. The highest risks are misleading contrast feedback, saved settings that do not become usable tokens, inaccessible navigation, and typography that cannot be evaluated in context.

This is a **source-based audit, not a completed visual/browser audit**. Reviewed the content of all 15 HTML pages, shared theme and layout styles, and the six JavaScript implementations (including inline colour and overview logic). Repeated shells and repeated type-scale options were compared structurally. The Documentation and Governance pages are placeholders, so there is no complete operating specification within this target. Earlier DDOS foundation guidance was consulted as background, not imposed on this distinct system.

Calculated contrast from source values and checked every local HTML fragment link. Browser initialization failed with `Cannot redefine property: process`; no screenshots, browser interaction results, screen-reader results, or rendered viewport measurements are claimed. Findings below distinguish confirmed source defects, documented capability gaps, and risks requiring rendered verification. This report records all findings identified within that scope, not a guarantee that no other issues exist. Application files and saved user preferences were not changed.

Severity: **High** = blocks a core workflow, misleads users about its result, or creates a substantial accessibility barrier. **Medium** = recurring usability, consistency, or handoff problem. **Low** = smaller clarity or polish issue. These are remediation priorities, not a numerical compliance score.

## Feature coverage

| Area | Features examined |
|---|---|
| Colours | Primary/secondary/tertiary, optional toggles, saturation/value plane, hue, opacity slider and field, hex input, swatch, RGBA, AA/AAA badges, save/reset, saved accent propagation, light/dark modes |
| Typography | Both font roles, CSS link loading, file upload, category browsing, font samples, four platform presets, all nine style rows, family/size/line-height/weight/italic/colour, save/reset and reload logic |
| Spacing | All ten product categories, four spacing systems, recommendation callout, manual override, global model, role examples, gap diagrams, save/reset and reload logic |
| Shared/context | Navigation and hash routing, search, layout breakpoints, focus styling, status feedback, local persistence, overview handoff, radius interaction, documentation and other placeholder pages |

## Colours

| ID / Priority | Finding and evidence | User impact and recommended correction |
|---|---|---|
| C01 High | **Opacity is ignored by contrast feedback.** `foundations.html`, `render()` calls `contrastVsWhite(hex)` without alpha. | Black at 10% opacity over white still reports 21:1 and AAA although the composited colour is approximately 1.25:1. Composite foreground against the selected surface before calculating contrast; test 0%, 10%, 50%, and 100%. |
| C02 High | **Contrast is checked only against white.** `contrastVsWhite()` and the fixed “vs. white” label never inspect the actual component/text pairing. | A white-only test cannot establish safety for this dark-default interface or arbitrary saved accents. Provide foreground/background selection and actual button, link, focus, and surface pairings in both themes. Keep the white test explicitly scoped. |
| C03 High | **Active supporting text fails contrast.** `theme.css` text-dim and graphite-500 values are used for labels and instructions in `shell.css`. | Dark panel labels measure 3.21:1; light panel labels 3.56:1; dark navigation subgroup labels 2.66:1. Use accessible muted-text tokens. Do not apply this finding to genuinely disabled controls, which have an exception. |
| C04 High | **Primary-button contrast is unsafe in specific default states.** `.btn-primary` uses graphite-950 for its label; theme switching also changes that token. | Light default: approximately 3.68:1. Dark default hover against red-600: approximately 3.60:1. Both are below 4.5:1 for the 12px label. Create independent on-action/default/hover tokens and validate every state; do not tie button text to a page-surface token. |
| C05 High | **Light-theme accent and success text remain dark-theme colours.** Light overrides leave red-400 and green-500 unchanged. | Red-400 against white is 3.46:1; green-500 against white is 2.39:1. Small eyebrow/status text loses legibility. Supply theme-specific semantic foregrounds and evaluate tinted badge backgrounds separately. |
| C06 High | **Saving opacity and optional colours does not apply them.** The payload stores them, but `applyAccent()` and every page bootstrap consume only primary.hex. | Users save three colours and transparency but see only an opaque primary accent applied. Implement their semantic consumers or explicitly label these fields as stored draft metadata with a preview. |
| C07 High | **The semantic-token promise is unfulfilled.** Page copy says every semantic colour derives from primary; implementation updates five red-named properties while status colours stay fixed. | Designers cannot inspect or export the promised role mapping. Separate primitive, semantic, and component tokens; show derivation rules and resolved values. Status colours need intentional roles, not automatic recolouring from brand. |
| C08 Medium | **Invalid/incomplete hex edits silently save an earlier colour.** Input changes state only at six valid digits, while Save reads `currentHex()`. | Enter a partial hex then Save: visible text and saved value can differ. Validate on blur/save and retain the entered text with a clear error until corrected. |
| C09 Medium | **Primary hex pasting can lose a digit.** Its field has maxlength=6 with a separate # prefix, whereas optional fields allow seven characters. | Pasting a conventional `#123456` into a six-character field risks truncation before sanitization. Accept prefixed/unprefixed six-digit hex consistently; verify actual paste behaviour in browser. |
| C10 Medium | **Opacity typing is rewritten on every input event.** `alphaNumber` parses, clamps and rerenders immediately; an empty field becomes zero. | Replacing 100 with another number becomes unnecessarily error-prone. Preserve an editable string; validate on blur/Enter and sync the slider after a valid value. |
| C11 High | **Colour sliders suppress focus without a replacement.** `.picker-range` sets `outline:none`; no focus style is supplied for it. | Keyboard users cannot reliably see which slider is focused. Add a persistent, contrast-tested focus-visible ring independent of the chosen brand colour. |
| C12 Medium | **The saturation/value plane is pointer-only.** It is an unfocusable div with pointer listeners. Hex entry offers another route to a colour, but not equivalent guided adjustment. | Provide labelled saturation and value inputs or an accessible keyboard-operable plane, with current values and instructions. Do not claim that all colour selection is keyboard-blocked, since hex and native ranges remain available. |
| C13 Medium | **Swatch preview ignores opacity.** `els.swatch.style.background = hex`. | The sample and RGBA text describe different appearances. Render transparency over a checkerboard and a chosen real surface. |
| C14 Medium | **AA/AAA labels omit the scope of the test.** Badges use 4.5 and 7, but copy broadly invokes “WCAG A, AA and AAA” contrast guidelines. | Label results “normal text AA/AAA against [surface]”; distinguish large text and non-text use cases. Level A is not a separate numerical text-contrast threshold. A passing pair is not whole-system WCAG compliance. |

## Typography

| ID / Priority | Finding and evidence | User impact and recommended correction |
|---|---|---|
| T01 High | **Style rows have no live specimen.** `wireTypeRow().apply()` only clamps line height; HTML contains controls but no row specimen consuming their styles. | H1–Caption size, weight, italic, colour and family cannot be judged together. Add editable multiline samples and a composed page preview tied to every row. |
| T02 High | **Save does not create usable typography tokens.** `saveTypographyBtn` writes localStorage; no shared consumer or export applies these levels. | Users cannot use the configured type system elsewhere. Generate a documented token object and CSS export, or clearly present this as a draft editor. Changing the editor's own typography is optional; working output is essential. |
| T03 High | **Uploaded fonts disappear after reload.** Font bytes exist only in a FontFace in memory; `getState()` saves family/source/linkHref but no asset. | Reload can say “Using [uploaded font]” while falling back silently. Persist the asset in an appropriate store, restore it before showing success, and handle unavailable assets explicitly. |
| T04 High | **Font-link loading claims success before load confirmation.** `injectLink()` appends a stylesheet; `setFamily()` immediately says “Using…”. | Bad links, offline access, or an incorrect family can masquerade as a successful font choice. Show loading, verify the requested face loaded, then show success; provide retry/error states. |
| T05 Medium | **Extrabold and italic are exposed without matching requested font faces.** `googleFontUrl()` requests weights 400–700 only and no italic axis; rows offer 800 and italic. | Browser synthesis or fallback may differ from the actual font. Request supported faces and disable unsupported selections. Uploaded static faces also need explicit weight/style metadata. |
| T06 Medium | **Required primary font is not enforced; optional-secondary fallback is unspecified.** Both picker states may remain null and Save still succeeds; body rows default to secondary. | The saved configuration has ambiguous resolution rules. Either make the default primary font explicit and valid, or require a choice; document secondary inheritance when unset. |
| T07 Medium | **Saved font source controls are not restored.** `loadTypography()` calls `setFamily()` but does not refill link fields, activate the original method, or restore category selection. | A returning user sees a saved font alongside blank or unrelated editing controls. Restore source/method and selected option together with the preview. |
| T08 Medium | **Line-height typing is disrupted by immediate clamping.** Every input event clamps to 50–300; clearing the field becomes 100 and a first digit below 50 becomes 50. | Ordinary replacement typing is difficult. Validate on commit, allow temporary empty text, and offer sensible increments. |
| T09 Medium | **Percentage rounding changes advertised line heights.** 36/44 seeds 122%, producing 43.92px; 30/38 seeds 127%, producing 38.1px. | Token labels and actual values disagree. Store exact unitless ratios or pixel values; distinguish a custom override from a preset value. |
| T10 Medium | **Presets overwrite custom size and line-height values without an undo path.** Platform chips call `setSize()` for every style, reseeding line height. | A single exploratory click replaces work across nine rows. Provide preview/apply and undo, or clearly indicate which values will be replaced. |
| T11 Medium | **One global type scale stands in for responsive behaviour.** Presets represent products/devices but only one selection and one level map are stored. | A responsive website needs simultaneous mobile/tablet/desktop rules. Add breakpoint or fluid-scale mappings with preview widths and overflow checks. |
| T12 Medium | **Text colour is stored as raw light-surface hex with no background context.** Defaults include #111827, #4B5563 and #6B7280, independent of theme/colour settings. | If applied on the dark panel, heading colour #111827 would be only 1.01:1. This is a configuration risk, not a claim that an existing specimen is invisible. Use semantic text roles and validate the preview surface. |
| T13 Medium | **Font upload is not keyboard discoverable.** The file input is hidden and the clickable label has no focusable trigger. | Keyboard users cannot reach the upload action normally. Use a visible native input or a labelled button that activates it. Test tab order and file selection. |
| T14 Medium | **Font tabs and selection controls lack complete accessible state.** Containers use tablist, but buttons lack tab/aria-selected/controlled-panel semantics; JS changes CSS classes only. | Assistive technology cannot reliably report the selected method/category/platform. Implement complete tabs where appropriate and radio/pressed states for exclusive choices. |
| T15 Medium | **The editor underemphasizes its own hierarchy.** `.panel-title` is a 12px muted paragraph; `.type-control` labels are 11px; colour issues further reduce readability. | Important group headings compete poorly with fields and explanatory prose. Use semantic h2/h3 headings, clearer weight/size hierarchy, and readable labels. Small text alone is not automatically a WCAG failure. |
| T16 Low | **The mono token resolves to Inter first.** `theme.css --font-mono` starts with the loaded proportional font. | Code and numeric token columns lose the intended monospaced rhythm. Use an actual monospace family or rename the token to accurately describe its purpose. |
| T17 Medium | **Important typography rules are absent.** The editor offers size/weight/colour but no tracking, paragraph spacing, reading measure, wrapping/overflow rules, or language coverage examples; Body and Paragraph default identically. | A size table is insufficient for predictable real content. Define those behaviours and distinguish Body/Paragraph roles or merge them. Include long headings, numbers, punctuation, and supported-language specimens. |

## Spacing

| ID / Priority | Finding and evidence | User impact and recommended correction |
|---|---|---|
| S01 High | **Spacing Save persists a selection, not a spacing system.** `spacing.js` stores only product/system; theme.css has no spacing tokens and no consumer reads this preference elsewhere. | Selecting 8px cannot produce a usable 8px system. Generate named primitive and semantic spacing tokens, show resolved values, and export them. |
| S02 High | **“Adaptive … automatically by context” has no implementation.** Selecting adaptive only changes an active CSS class and saved string. | The interface promises behaviour it cannot deliver. Implement explicit context-to-token mappings or label Adaptive as proposed guidance. |
| S03 Medium | **Recommendation indicators contradict each other.** The 4px card always carries “Recommended,” even when Desktop Web recommends 8px or Data-Heavy recommends 2px. | Users cannot distinguish global default, product recommendation, and selected override. Give each a distinct, dynamically updated label. |
| S04 Medium | **The global model does not respond to the selected system.** Precision/Base/Structural values and role lists remain fixed after manual selection. | It is unclear whether the saved choice overrides or supplements the model. Show the resolved model or mark the section as independent reference guidance. |
| S05 Medium | **Raw values are not mapped to stable role tokens.** Number lists lack names such as gap-field, padding-card, and space-section or responsive/density rules. | Two designers can choose different values while both follow the same list. Publish token names, defaults, exceptions, and real component examples. |
| S06 Medium | **The shell's spacing contract conflicts with its implementation and editor.** CSS header says 8px with 4px micro exceptions; spacing UI defaults to 4px; shell uses 12px and 20px for ordinary gaps/margins. | Consumers lack one authoritative rule. Decide whether the shell and generated products share a scale, document exceptions, and make CSS consume that contract. This does not make all non-8px values inherently bad design. |
| S07 Medium | **Gap illustrations are only partial, unlabelled samples.** Layout values start at 24px but that row's diagram includes a 16px gap; full scales are not represented. | The diagram is easy to interpret as a literal visualization of the listed tokens. Label each gap and either draw the exact examples or state that the illustration is schematic. |
| S08 Medium | **Selection relies on colour styling with no explicit selected state.** Product/system buttons toggle `.is-active` only. | A selected system is difficult to distinguish without colour and is not announced as selected. Add a check/“Selected” label and radio or pressed semantics. |
| S09 Medium | **Product categories overlap without decision criteria.** SaaS, Enterprise SaaS, Web Application and Dashboard can describe the same product, yet imply different secondary units. | Users must guess which identity takes precedence. Ask about density, input method and layout context, then explain the recommendation and permit overrides. |
| S10 Medium | **A small base unit is conflated with density.** Data-heavy recommends 2px without demonstrating row height, control padding or target sizes. | Teams may shrink interaction targets while believing they are following the system. Separate precision increments from comfortable/compact density, and specify minimum interactive dimensions. |

## Shared issues affecting all three foundations

| ID / Priority | Finding and evidence | User impact and recommended correction |
|---|---|---|
| X01 High | **Navigation disappears below 900px with no replacement.** Final shell.css media rule hides `.app-sidebar`; HTML has no mobile navigation trigger. | Users at narrow widths or zoom cannot move among foundation pages through the normal navigation. Provide an accessible drawer or another persistent navigation method. |
| X02 High | **Fixed minimum widths threaten reflow.** Font grid requires 320px tracks inside 80px main horizontal padding plus 50px panel padding/borders; colour/system tracks require 240px. Topbar stays a nowrap row and footers do not wrap. | At a 320px viewport these dimensions cannot fit as authored. Reflow/overflow is source-predicted; exact clipping needs browser verification. Use minmax(0,1fr), responsive padding, wrapping actions and a compact header. |
| X03 Medium | **Spacing usage rows remain too rigid at intermediate widths.** Above 640px they use 160px + flexible description + nowrap values + 170px diagram + 48px gaps. | At widths just above the breakpoint, little or no room remains for descriptions. Recompose earlier, use container-aware layout and allow token values to wrap. |
| X04 High | **The requested Shadows destination does not exist.** The link checker found 24 distinct missing fragment targets: Shadows/Borders/Icons plus 21 component links. | Clicking a specific destination shows a different/general page with no requested section. Build sections or mark unavailable destinations clearly and avoid false active states. |
| X05 Medium | **Active navigation does not follow hash changes.** `markActiveLink()` runs only on DOMContentLoaded and does not clear earlier active classes. | Same-page anchor navigation can leave the wrong item active. Recompute on hashchange, clear previous state, and set aria-current. |
| X06 Medium | **Save/reset feedback is transient and unannounced.** Status spans lack status/live-region semantics and disappear after 2.5–4 seconds. | Users may miss confirmation; assistive technology is not told about changes. Announce results politely and retain a saved/unsaved indicator. |
| X07 Medium | **No dirty-state, discard warning or undo.** All foundation editors keep unsaved changes only in memory; Reset immediately deletes stored configuration. | Accidental navigation loses edits and Reset has no recovery. Track dirty state, provide undo for reset/presets, and define explicit save/discard behaviour. |
| X08 Medium | **Save failures have no recovery UX.** localStorage writes in save handlers are unguarded. | Storage restrictions or quota failures leave no actionable result. Catch errors and offer retry/export; state that persistence is local to this browser, not a team/project release. |
| X09 Medium | **Search promises more than it searches.** Placeholder says components, tokens and docs; shell.js filters navigation-link text only. | Searching a hex code, token or documentation term cannot find the actual content; no explicit no-results state exists. Label it navigation search or implement indexed content search with counts and empty-state guidance. |
| X10 Medium | **Collapsible navigation lacks expanded state.** Toggle listeners update class/localStorage but not aria-expanded/aria-controls. | Assistive technology cannot determine whether groups are open. Use stable controlled IDs and synchronized expanded state. |
| X11 High | **Overview reports unsubstantiated production readiness.** Counts and 94% compliance/98% accessibility are static HTML; corresponding components and governance pages say Not built yet. | Teams may mistake demo metrics for measured readiness. Mark them as sample data or replace them with measured, dated results and a defined denominator. Do not present a percentage as WCAG conformance. |
| X12 High | **Copy flow does not provision the advertised project snapshot.** Overview constructs CDN/npm/Figma strings and local history; it never generates or uploads the selected foundation tokens. | A successful Copy can imply a working handoff that this implementation has not created. Produce a real downloadable token artifact first or explicitly label snippets illustrative. External endpoint/package existence was not tested. |

## Calculated contrast evidence

Values below are computed from authored opaque sRGB colours using the WCAG relative-luminance formula. They are not screenshot sampling. Actual composited tints should be tested separately. For normal-sized text, AA requires 4.5:1; large text uses 3:1. Disabled controls and logotypes have specific exceptions. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

| Pair / use | Foreground | Background | Ratio |
|---|---|---|---:|
| Dark panel supporting label | #64686F | #15171A | 3.21:1 |
| Dark canvas supporting label | #64686F | #0D0F11 | 3.43:1 |
| Light panel supporting label | #85888D | #FFFFFF | 3.56:1 |
| Dark navigation subgroup | #565C64 | #15171A | 2.66:1 |
| Light default primary button | #F6F6F4 | #FF031A | 3.68:1 |
| Dark default primary-button hover | #0D0F11 | #D80016 | 3.60:1 |
| Light accent text on white | #FF3F4F | #FFFFFF | 3.46:1 |
| Light save-status green on white | #2FBF6E | #FFFFFF | 2.39:1 |
| Default primary red vs white | #FF031A | #FFFFFF | 3.98:1 |
| Hypothetical application of default type heading to dark panel | #111827 | #15171A | 1.01:1 |

The black/10%-opacity example is approximately 1.25:1 after compositing on white (rounding to #E6E6E6); the current picker reports 21:1 because it ignores alpha.

## Source references

Paths are relative to the application directory, one level above this report. Searchable symbols provide precise evidence anchors even if line numbers move.

- Colours: [foundations.html](../foundations.html), `contrastVsWhite`, `createColorPicker`, `render`, `alphaNumber`, `applyAccent`, `saveColorsBtn`.
- Theme definitions: [theme.css](../theme.css), root and light-mode overrides.
- Layout and appearance: [shell.css](../shell.css), `.btn-primary`, `.panel-title`, `.picker-range`, `.font-field-grid`, `.usage-row`, `.panel-footer-row`, final 900px media query.
- Typography UI: [typography.html](../typography.html), font panels and `data-level` rows.
- Typography behaviour: [typography.js](../typography.js), `googleFontUrl`, `createFontPicker`, `wireTypeRow`, `loadTypography`, `saveTypographyBtn`.
- Spacing content: [spacing.html](../spacing.html), product/system grids, role model and gap illustrations.
- Spacing behaviour: [spacing.js](../spacing.js), `selectProduct`, `selectSystem`, save/load/reset handlers.
- Shared navigation/search/theme: [shell.js](../shell.js), `markActiveLink`, `initCollapsibleGroups`, `initSidebarSearch`.
- Readiness and handoff: [overview.html](../overview.html), metrics, `renderSnippets`, copy-profile/history and copy-gate handlers.
- Scope limitations disclosed by the product: [documentation.html](../documentation.html), [components.html](../components.html), [governance.html](../governance.html), [code.html](../code.html), [figma.html](../figma.html).

## Recommended remediation order

1. **Make feedback trustworthy:** fix alpha-aware contrast and actual pair testing; repair default/light/hover text colours; label prototype metrics and unavailable output honestly.
2. **Complete the authoring loop:** configuration → preview → resolved tokens → save/reload → export. Include persistent uploaded fonts and validation errors.
3. **Restore access:** narrow-screen navigation, reflow, slider focus, keyboard font upload, accessible selection states and status announcements.
4. **Clarify the system contract:** semantic colour roles, responsive typography, spacing/density mappings, consistent defaults and recommendation labels.
5. **Improve editing resilience:** undo, unsaved-state feedback, restored font method controls and dependable search/navigation.

## Browser verification still required

- Desktop 1440px and 1024px; intermediate 901px/900px and 641px/640px; mobile 390px and 320px. Check overflow, internal scroll regions, header/actions and every type row. Reflow is evaluated at the equivalent of 320 CSS pixels with applicable exceptions. [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
- Keyboard-only colour adjustment, upload, tab switching, selection, save/reset, search, navigation, focus order and visible focus. Check screen-reader names for repeated Hue/Opacity and row-colour controls; generic labels need contextual grouping.
- Default and custom accents in both themes, including black/white, saturated yellow, alpha 0/10/50/100%, invalid hex and pasted prefixed hex. Preserve and restore the user's original preferences during testing.
- Font upload/save/reload, broken CSS links, unsupported font weights, long headings and supported-language samples. Compare actual loaded fonts rather than only computed font-family strings.
- Save and reset announcements. Status changes should be programmatically available without moving focus. [W3C status-message guidance](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).
- Measure actual control targets and spacing before assigning target-size failures. WCAG 2.2 AA generally uses 24×24 CSS pixels with exceptions; 44×44 is the enhanced target and was also a previous DDOS design preference. A 32px icon button is not automatically an AA failure. [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Test 200% text enlargement, user text-spacing overrides, forced colours, reduced motion, and storage errors. These have not been certified in this pass.

## Relationship to earlier DDOS

The older DDOS guidance uses different red/graphite values, a white-first canvas, Inter/IBM Plex Sans/Instrument Serif roles, a constrained spacing list and a 16px body minimum. This application uses a dark-default configurable workspace with different tokens and typography presets. That divergence is a governance question, not automatically a defect: publish whether this is a successor, a separate authoring-tool skin, or a generic generator with this brand as one preset. The findings above stand on this application's own behaviour and promises.
