# Foundation implementation changes

Foundation settings now have a shared application path across all 157 live website pages. This handoff covers the attached implementation request. The earlier 100-finding audit remains a separate backlog; these changes do not close every audit item.

Source changes and automated checks are complete. Browser visual, keyboard and mobile checks remain required because the connected browser is unavailable.

## Follow-up: unwanted blue boundaries

- **Reference:** Borders → Focus preset; shared Foundation resolver and focus styles.
- **Problem:** The Focus preset recolored resting component borders. Custom control border colors also replaced neutral line tokens on panels, navigation dividers and toolbars, as shown in the supplied screenshot.
- **Solution:** Focus settings now apply only to focus indicators. Structural boundaries keep their neutral theme colors; custom control borders cannot replace shell line tokens. Legacy automatic blue focus defaults resolve to brand colors; the project's blue brand, Info and deliberately customized control/state colors remain supported.
- **Check:** Reload a component page with the Focus preset selected. Check neutral resting borders, then Tab through controls and switch Light/Dark themes. Verify Info states retain their blue styling.

## Changes and quick verification tasks

### Follow-up: Accessibility page spacing and alignment (8 October)

- **Reference:** Accessibility panels, 25 documentation rows, Human/Machine view and Markdown export.
- **Problem:** Three-part reference rows inherited four columns. Long labels/status text could overflow; Read More inserted extra grid children and displaced status text. Paragraph/list margins added uneven space inside panels and below final content.
- **Solution:** Give rows three columns with top-aligned, wrapping content. Keep each description and its expansion button in a dedicated cell. Use one 16px panel gap, 24px desktop/16px mobile panel padding, 16px row gutters and neutral dividers. Retain the shared equal outer page gutters. Reduce rows to two columns below 800px panel width and one below 560px; keep reading order as label, description, status.
- **Guide:** Keep reference rows to label/description-cell/status; put future expansion controls inside the description cell. Let the panel own vertical gaps instead of adding margins to every child. Use logical spacing so RTL follows the same rules.
- **Check:** Review Automatic on every page, Known gaps, editor states, release contract and export. Expand/collapse long descriptions; switch Human/Machine; check narrow widths, both themes, custom typography and 200% zoom. Browser visual verification remains pending because no connected browser is available.
- **Validation:** Source assertions confirm all 10 sections, 25 three-cell rows, existing content and hidden Machine View are preserved. The 157-page source audit has zero issues and generated files are fresh. Full suite: 50/51 pass; the existing undefined `--green-700`/`--danger-700` dependency failure remains outside this page.

### Follow-up: Data Format page alignment (8 October)

- **Separators:** Neutral Foundation lines now divide settings groups, actions, previews and documentation example rows. Group boundaries use 24px spacing; actions/previews use 16px padding above their content. Lines follow Light/Dark theme tokens and stay inside the existing content gutters.
- **Reference:** Data Format configuration, documentation example rows and action buttons.
- **Problem:** Three-part documentation rows inherited a four-column layout, leaving unused width. Wrapped labels displaced controls; checkboxes inherited text-field height/padding. Reset/download buttons had separate margins, and long localized values could overflow.
- **Solution:** Use three documentation columns that reduce to two or one at narrower panel widths. Group the 24 settings into Numbers, Dates and Missing/sensitive data, with aligned label/control rows, shared control heights, 16px grid gutters and 8px label gaps. Restore compact native checkboxes inside full-height clickable labels. Put actions/status in one wrapping row; let preview values and table cells wrap.
- **Guide:** Keep settings in their matching fieldset, use the shared spacing/sizing tokens, and keep example rows to label/description/value. Do not apply text-input sizing to checkbox controls.
- **Check:** Reload Data Format; compare control baselines and action spacing. Test long labels, localized date ranges, 200% zoom, narrow widths and both themes. Verify changes save, invalid values retain the previous configuration, and reset/download work. Browser visual verification remains pending because no connected browser is available.
- **Validation:** A script-level form check passes for all 24 labeled controls, grouped placement, save, invalid-zone rejection, reset and configuration download. Source audit: 157 pages, zero issues; generated catalogs/defaults are fresh. Full suite: 50/51 pass after refreshing defaults; the remaining shared CSS dependency check reports undefined `--green-700` and `--danger-700` in Approve/Reject button styles outside this page.

### Follow-up: px and rem in Markdown and AI prompts (8 October)

- **Reference:** Foundation Copy Markdown, component Copy prompt and Export Markdown/project briefs.
- **Problem:** Exports mixed px-only values, selected-unit-only values and bare scale numbers. Recipients lacked the equivalent rem dimensions, especially for typography, spacing and component recipes.
- **Solution:** A shared Markdown formatter adds px/rem reference tables for every explicit dimension and referenced dimensional token. All 64 component prompt builders, seven local Foundation Markdown renderers, general documentation Markdown and the project export use it. Full project exports also include resolved dimensions from their selected Foundation sections. Compound shadow recipes get both versions. CSS/JSON examples keep their valid syntax; Copy code keeps its existing behavior.
- **Direct values:** Typography size, tracking and computed line height, plus Spacing/Radius scale entries, show pairs beside the value. Example: **24px (1.5rem)**; **1.5px (0.09375rem)**; **−1.5px (−0.09375rem)**. Dimensional Foundation Markdown updates after unit/token changes.
- **Rule:** Conversion reference is **1rem = 16px**. Use rem for scalable typography/spacing and retain px for hairline borders or viewport breakpoints where documented. Both forms are alternatives. Percentages, em/viewport units, unitless line height, weights, SVG unitless stroke values, opacity and time remain in their own units; root font size/user scaling must remain supported.
- **Check:** Copy Input/Button prompts; inspect their unit tables. Export a project with Typography/Spacing/Radius/Borders/Shadows selected. Verify Caption 11px = 0.6875rem, 24px = 1.5rem and negative tracking. Change px/rem or saved values and regenerate. Check code/JSON blocks still parse; browser visual verification remains pending.

### Follow-up: icon-only CTA hover color (7 October)

- **Reference:** Floating banner Edit and Close icons; screenshot of the highlighted Close border with a neutral icon.
- **Problem:** Generic Ghost button hover only changed the icon from muted to stronger neutral text, while its border changed to the brand color. This did not provide the requested matching icon-color feedback.
- **Solution:** Give both banner icon actions an explicit brand-colored icon/border and brand-tinted background on hover and keyboard focus, with the pressed brand shade on activation. Google Material SVGs keep `fill="currentColor"` and retain their official shapes. States follow the current Foundation brand/theme tokens and share a smooth transition.
- **Check:** Hover Edit/Close and move the pointer onto their SVG paths; icon and border should change together. Tab to each action, activate it, and compare both themes and a custom brand. Automated checks pass; browser hover verification remains pending.

### Follow-up: floating project-context banner

- **Reference:** Purple-highlighted banner with project/platform details, Export Markdown and the Edit icon.
- **Interpretation:** Keep the whole banner visible while scrolling, beneath the application header.
- **Solution:** Make only the shared project-context banner sticky inside the main scroll area, with its Foundation surface, radius and shadow. Keep its initial place in the layout. Measure its height as text wraps or the viewport changes, and reserve that height for section jumps. Other notice banners retain their existing placement. If it takes half the available scroll height or more, let it scroll normally so short/zoomed screens remain usable.
- **Close action:** A matching Google Material close icon at the right dismisses the banner for the current page view. It uses a native button, an accessible label, tooltip and the same square target as Edit. Closing removes the banner and its reserved scroll offset, stops observation and moves focus to the content without forcing a scroll jump. Reloading or opening another page shows the banner again.
- **Check:** Scroll Colors and a component guide from top to bottom; Export/Edit remain reachable. Jump to sections and confirm their headings are visible beneath the banner. Resize, change typography/density/units and check the mobile drawer. Automated checks cover height changes and the short-viewport fallback; browser visual verification remains pending.

### Follow-up: blank space at the bottom while scrolling

- **Reference:** Shared page shell and the end of the main content scroll region.
- **Problem:** Main content had 80 px of bottom padding (48 px in compact mode). The automatic grid row minimum and viewport-height constraints could also let the outer document grow; scroll chaining/elastic overscroll can expose an empty area at the end.
- **Solution:** Keep the shell within the dynamic viewport with a shrinkable main row and independent content/sidebar scrolling. Reduce bottom padding to 24 px, or 16 px for compact/mobile layouts. Disable vertical overscroll beyond the shell/content boundaries; retain the existing zero final-section margin.
- **Check:** Scroll Colors, Typography, a component guide and Project setup to the end, then continue scrolling. Confirm the last content remains reachable with only the intended bottom inset, the header stays visible and the sidebar scrolls independently. Repeat with compact density, keyboard/Page Down, mobile drawer and a resized mobile viewport. Browser scrolling verification remains pending because no connected browser is available.

### Follow-up: icon-only Edit setup action

- **Reference:** Project-context banner above Colors and other documentation pages.
- **Problem:** The Edit setup CTA used a text button instead of the requested icon-only action.
- **Solution:** Replace the saved-project action with a pencil icon at the far right, after Export Markdown/Export this guide. Keep banner actions aligned to the end even when they wrap. Keep its link to Project setup, an “Edit setup” tooltip and accessible label, shared button focus/hover states, Foundation icon settings and a square touch target. The initial “Customize your system” action keeps its descriptive label.
- **Check:** Reload a page with a saved project. Hover or focus the pencil, then activate it to open Project setup. Check narrow widths, themes, keyboard navigation and customized icon sizes. Browser visual review remains pending.
- **Icon correction:** Use Google's official Material Icons `image/edit` SVG, replacing the custom outline pencil. Preserve the original filled geometry; adapt color and sizing to Foundation tokens. Source: [Google Material edit icon](https://github.com/google/material-design-icons/blob/master/src/image/edit/materialicons/24px.svg). Apache 2.0 license saved in `Material-Icons-LICENSE.txt`.

### Follow-up: matching banner and section corner radii

- **Reference:** Highlighted project-context banner above Colors; shared setup banners and Project setup panels.
- **Problem:** The banner used the fixed 12 px radius token and setup panels used 16 px. Other documentation sections use the configurable `--radius-md` token, so corners differed and did not follow the selected Radius philosophy together.
- **Solution:** Bind both shared container styles to `--radius-md`, matching the section panels on every page where they appear. All four corners now follow the same Foundation radius and px/rem setting.
- **Check:** Reload Colors, Typography, a component guide and Project setup. Compare banner/panel corners, then change the Radius philosophy and switch px/rem. Browser visual review remains pending.

### Follow-up: equal left/right page gutters

- **Reference:** Colors screenshot: narrow left gutter and a wider right gutter; shared `.app-main` frame across all 157 pages.
- **Problem:** The content frame's maximum width included its padding and stayed aligned to the left. Extra grid-column width accumulated on the right; classic scrollbars could add another unequal inset.
- **Solution:** Keep the main scroll area the full width of its grid column and center its content within the configured content limit. Apply one logical gutter value to both sides. Reserve scrollbar space on both edges of both Main and Sidebar, so a classic scrollbar cannot create an extra inset only on the right. Search and navigation groups share one sidebar inset; the mobile drawer navigation fills its available width. Default page gutter tokens are 40 px for comfortable desktop, 24 px for compact desktop and 16 px for mobile; the sidebar uses 12 px, following Foundation spacing and px/rem settings.
- **Check:** Reload Colors, Typography, Project setup and a component guide. Compare the left/right distance from the content area's edges to the setup banner and panels. Check wide/narrow windows, comfortable/compact density, RTL, short/long pages and custom content/sidebar sizes. Extra width above the content limit must be divided equally.
- **Verification limit:** Shared source checks cover all pages; rendered gutter measurements remain pending because the browser connection is unavailable.

### Follow-up: convert documentation tabs to Group Buttons

- **Reference:** Colors screenshot: Brand color, Background & surface elevation, Semantic & status colors and other section choices.
- **Problem:** Section choices were loose underlined links; view/font switches used different pill treatments.
- **Solution:** Use the library's **Outlined Group Button** pattern for page sections, Human/Machine views and font-source choices. Joined segments share a neutral boundary, Body typography, theme radius, consistent height and a brand-tinted selected state.
- **Behavior:** Section buttons jump to their headings and preserve URL hashes, Back/Forward and scroll-based active state. View/font buttons retain their existing panel-switching behavior. Presentation clicks do not autosave Typography.
- **Keyboard/mobile:** One selected segment is in the Tab order. Left/Right, Home/End move and activate choices; arrow direction follows RTL. Long groups scroll horizontally; touch targets remain at least the configured 44 px minimum.
- **Check:** Reload Colors and select every section. Test Back, Forward, scrolling and arrow keys. Check Human/Machine views, Typography's two font-source groups, dark theme and a narrow screen. Browser visual review remains pending.

### Follow-up: consistent H1–H6, Body, Paragraph and Caption

- **P1 — Heading scale:** Reference: Project setup screenshot; page title appears smaller than section headings. Solution: restore H1/H2/H3/H4/H5/H6 to **48/36/30/24/20/18 px**, with their standard weights and line heights. Legacy saved projects receive this update once, including before first paint; `headingScaleVersion: 1` permits later deliberate edits. Reload a page to apply and save the update.
- **P1 — Role conflicts:** Problem: page rules could override Paragraph metrics; an inline History H2 used Body styling. Solution: strengthen shared role bindings, remove that incorrect inline recipe and prioritize semantic heading roles during inline normalization. Check the title, main form heading and aside heading on Project setup, then Foundation and component pages.
- **P1 — Complete metrics:** Problem: Body/native fields omitted weight or italic settings; inline recipes omitted family and role color. Solution: apply family, size, weight, style, line height and tracking consistently. Role text colors follow their settings; status, brand and inverse foregrounds retain their semantic colors.
- **P2 — Supporting copy:** Use Paragraph for documentation prose, Body for fields and interface copy, and Caption for metadata and setup help. Defaults remain Body/Paragraph **16 px** and Caption **11 px**; existing custom values for those three roles remain supported. Component specimens retain their documented roles; code retains its monospace family.
- **Check:** Reload Project setup, then compare all nine Typography samples with page content. Check light/dark, px/rem, long wrapping text and field errors. A second reload must retain the restored headings without repeating the migration. Storage failures show the existing unsaved-preview notice.
- **Evidence:** Tests cover the scale restoration, first-paint migration, persistence, future edits, role metrics and preserved font/status exceptions. Visual browser review remains pending because the browser connection is unavailable.

### Follow-up: working px/rem and right-aligned JSON export

- **P1 — Selection:** Reference: Typography → Design units and Letter spacing. Problem: editor autosave could restore the old unit between native input/change events. Solution: apply units immediately, save once and isolate presentation events from editor edits. Typed dimensions still send one canonical pixel edit to the editor; Typography exports refresh with the selected units.
- **P1 — Conversion:** Problem: a focused dimensional field could retain its old value after changing units. Solution: convert its value, limits and step when the unit changes; preserve fractional/negative values and empty fields. Counts, weights, percentages, opacity, time and SVG coordinates remain unitless.
- **P2 — Placement:** Reference: screenshot's centered Export Foundation JSON button. Solution: align export to the toolbar's end with an automatic inline margin; allow wrapping on narrow screens and respect RTL direction.
- **P2 — Scope:** Show the main px/rem selector only on Typography, Grid & Layout, Spacing, Radius, Borders, Shadows and Icons. Colors and AI & Agents retain JSON export without the selector. Remove the Foundation toolbar from other pages; actual dimensional inputs retain their local px/rem controls. All 157 pages continue inheriting the shared Foundation settings.
- **Check:** Reload Typography. Switch px → rem → px; verify 8 px becomes 0.5 rem and returns to 8 px. Edit Letter spacing, check another Foundation page, reload and export JSON. Confirm the saved unit and resolved tokens agree. Review the export's right alignment and narrow-screen wrapping in the browser.
- **Automated evidence:** Native input/change sequencing, local unit selection, canonical editing, range/step conversion, JSON contents, storage failure feedback and toolbar scope across all 157 pages pass. Browser visual checks remain pending because no browser connection is available.

### Follow-up: Letter spacing field styling

- **Reference:** Typography → Letter spacing in all 16 type rows.
- **Problem:** Generated px/rem controls inherited a page-colored surface, stronger border, smaller radius and different insets from generic Foundation fields. Neighboring Typography controls use the panel surface and editor styling.
- **Solution:** Match the editor's shared height, panel background, border, radius, Body metrics and 12 px text inset for both tracking controls. Keep arrow space on the unit selector and focus/error feedback.
- **Field gap:** The value and px/rem fields now use the editor's 16 px gutter instead of the generic unit pair's 4 px gap. The value field flexes to accommodate the wider gap.
- **Check:** Reload Typography; compare Letter spacing with Line height and Weight in both themes. Edit negative/fractional tracking, change px/rem and Tab through controls; check narrow layouts.

### Follow-up: Typography editor margin, padding, gutter and alignment

- **P1 — Gutters:** Reference: highlighted control gaps in the supplied Typography screenshot. Problem: fixed Level/Italic widths and stretched flex columns left inconsistent unused space. Solution: seven aligned grid columns with a 16 px gutter; three/two/one columns as the editor becomes narrower. Check all 16 type roles and long control labels.
- **P1 — Field alignment:** Problem: Line height had a narrow fixed input and an empty validation row; Italic used bottom padding; paired tracking fields had different heights. Solution: one shared control height, full-width fields, aligned checkbox, hidden empty guidance and a named Letter spacing column. Check px/rem, RTL and larger Body typography.
- **P1 — Preview padding:** Problem: 16 px sample padding indented text away from the controls and color fields. Solution: remove sample padding/margins; the row owns a 16 px gap between controls, sample and theme colors. Check left edges against the panel content.
- **P2 — Theme spacing:** Problem: inline top margins, fixed theme-label height and bottom margins on color grids accumulated. Solution: remove those duplicate spaces in all 16 Typography rows, with 8 px between theme labels and fields. Colors stack in narrow editors; the field grid can shrink below 240 px.
- **P2 — Read More spacing:** Problem: the next control group could touch the expansion button. Solution: add a 16 px bottom gap while preserving the current centered Primary button and grouped paragraph behavior.
- **Release check:** Reload Typography; compare H1/H2, Body and Caption at desktop, tablet and mobile widths. Change fonts, density, px/rem and RTL. Browser visual checks remain pending because the connected browser is unavailable.

### Follow-up: shared spacing across all page families

- **Reference:** Shared `foundation-runtime.js` / `foundation.css`, loaded on all 157 pages; documentation paragraphs, metadata, component previews, card actions and save rows.
- **Problem:** Read More wrapped short paragraphs and helper labels across the website. Wrappers changed direct-child relationships and line boxes; structured flex/grid content and component specimens could lose their authored layout. Copy/link margins added to container gaps; footer actions could overflow instead of wrapping.
- **Solution:** Consecutive documentation paragraphs share an expansion group when they exceed four lines. Preserve metadata, labels, readouts, flex/grid rows and component specimens. Remove the wrapper when text becomes short; a shared resize observer allows short prose to become expandable after narrowing. Supporting documentation copy uses a 16 px bottom gap; card guide links rely on the card's own gap. Footer/card utilities wrap with explicit gaps. Read More currently uses a centered Primary button and retains the configured touch minimum of at least 44 px.
- **Check:** Reload Overview, Colors, Typography, Grid, a component listing, a component detail and Project setup. Check short paragraphs have no injected wrapper, long prose expands after four lines, metadata and demo labels retain their structure, and utilities wrap at narrow widths. Change typography, density and px/rem. Browser visual review remains pending; source checks cannot certify every rendered gap.

### Follow-up: contrast readout spacing

- **Reference:** Screenshot of background/tint ratios, AA/AAA pills and RGB values; Colors and color-picker readouts.
- **Problem:** Paragraph expansion inserted a wrapper inside contrast readouts, breaking flex gaps. Adjacent inline pills touched; manual line breaks did not consistently separate result groups. Field gaps and extra margins accumulated.
- **Solution:** Exempt color readouts from Read More. Give each ratio its own result row, group its pills, use 8 px between results/labels and 6 px between pills. Color fields use an 8 px gap without an extra contrast margin. Pills retain 12 px Regular; captions retain their 11 px default.
- **Check:** Reload Colors; compare background/tint results, RGB labels and picker readouts. Narrow the page: a pill pair should move together beneath its ratio. Switch themes and px/rem; longer prose still expands after four lines.

### Follow-up: 11 px Caption descriptions and labels

- **Reference:** Colors → contrast ratios such as “1.05:1 vs page background”; color labels, RGBA values, helper notes and metadata.
- **Problem:** Contrast ratios and AA/AAA badges used Body text; helper paragraphs could inherit the larger Paragraph role. Caption defaulted to 12 px.
- **Solution:** Use Caption metrics for contrast descriptions and supporting labels. Caption now defaults to Text 2XS, 11 px with 150% line height, including platform presets. Typography exposes the new size; px/rem conversion and exports retain it. Existing custom Caption settings remain supported.
- **Pill exception:** “Non-text 3:1”, AA and AAA pills use 12 px Regular (400), normal style. The dimension token follows px/rem; the surrounding contrast description keeps Caption typography. Check pills on swatches and inside the color picker.
- **Check:** Reload Colors and compare contrast ratios, badges and field labels. In Typography, select Caption → Text 2XS (11 px) if an older saved project has another Caption size. Check both themes and rem units; main descriptions remain Paragraph text.

### Follow-up: paragraphs expand after four lines

- **Reference:** Colors → Semantic & status colors; shared paragraph expansion.
- **Problem:** Overflow detection used clamped height; an expanded toggle stayed visible after text became four lines or shorter.
- **Solution:** Measure full text at the current width and font size. Longer paragraphs start at four lines with Read More; expansion shows Read Less. Short paragraphs have no toggle. A measured height limit supplements the CSS line clamp.
- **Check:** Reload Colors; expand and collapse long paragraphs. Resize and change Paragraph typography. Verify four-line paragraphs have no toggle, and longer ones start collapsed. Keyboard focus can reveal links within collapsed text; errors and interactive labels remain fully visible.

### Follow-up: Component Library layout guidelines

- **P1 — Section navigation:** Reference: Component Guidelines → Navigation; Anchor. Problem: page-section links looked like Group Buttons. Fixed: Anchor links with one current location, including deep links and scroll updates. Check: open a long page, click links and scroll inside the content pane.
- **P1 — Action hierarchy:** Reference: Button → Primary; Anchor; Neutral. Problem: every component card repeated a Primary action; the shared export utility used a separate button pattern. Fixed: card guides and roadmap exports use Anchor; Foundation export uses the library's Neutral Button. Check: compare a multi-card page and the Foundation toolbar.
- **P1 — Size variants:** Reference: Button and form-control size guides. Problem: shared minimum-height and automatic-height overrides collapsed documented sizes; button icons shared one size. Fixed: preserve explicit variants and their icon sizes, growing only when text needs room. Touch targets keep their configured minimum of at least 44 px. Check: compare XS through XXL, large Body text and px/rem.
- **P1 — Card layout:** Reference: Grid & Layout → responsive card grid. Problem: the base grid showed three columns where documentation specified four; card width caps left unused track space. Fixed: four/three/two/one columns at the documented 1440/1100/700 px thresholds; cards fill tracks. Named wider-preview exceptions remain. Check: resize above and below each threshold.
- **P2 — Unit choice:** Reference: Component Guidelines → Radio (two to five visible exclusive options); Radio. Problem: the shared toolbar hid its two choices inside a dropdown. Fixed: native px/rem radios using the library's Radio pattern, group label and keyboard behavior. Check: change units, reload, then change from another tab. Paired dimensional inputs retain their compact unit Select.
- **Guide:** Choose components by intent using [Component Guidelines](guidelines.html); use Anchor for wayfinding, Neutral for utilities and Primary for the main action. Keep explicit component size variants. Apply Foundation tokens without overwriting variant borders, heights or corners. Browser verification is still pending.

### Follow-up: dropdown alignment

- **Reference:** Highlighted Design units dropdown on the Checkbox page; shared Foundation toolbar and dimensional input controls.
- **Problem:** Native dropdowns kept their browser-default height and arrow insets while adjacent buttons used the shared control height.
- **Solution:** Dropdowns and neighboring controls share a minimum height that grows with Body typography. Consistent padding reserves arrow space; unit labels and paired controls align at their centers. Arrow placement follows RTL, and forced-colors mode restores the native arrow.
- **Check:** Check paired dimension dropdowns on Typography and Grid, narrow widths, larger Body text and RTL. The shared toolbar now uses the library's Radio pattern for its two unit choices.

### Follow-up: extra borders inside form fields

- **Reference:** Input state-matrix screenshot; shared native-input and component-wrapper rules in `foundation.css`.
- **Problem:** The shared `border-style` override revived `border:none` as a browser-default medium-width border around inner text fields. Base wrapper overrides also added borders to Filled fields and boxed/rounded Underlined fields.
- **Solution:** Removed those shared overrides. Inner fields stay borderless, with one focus indicator on the outer control. Filled fields keep their transparent resting border; Underlined fields keep a bottom rule and square corners. Border-side customization applies to Outlined controls. The same correction covers Password, Number, Search, Text Area, Add-on, Auto Complete, Cascader, Tree Select and exported code.
- **Check:** Reload Input Text Field and compare Rest, Hover, Focused, Filled, Error and Disabled rows. Tab into fields: there should be one outer focus ring and no inner box. Check the same controls on component listing pages.

### Follow-up: uneven section spacing

- **Reference:** Shared page layout in `foundation.css`, section navigation and Foundation toolbar insertion.
- **Problem:** Page sections, navigation and toolbars used different margins; injected panels had no shared gap. On detail pages, toolbars and navigation separated the description from its component metadata. Mobile title rows lost the gap between headings and actions.
- **Solution:** One 24 px Foundation gap between page sections, navigation and toolbars; 12 px after the page title and 8 px between descriptions and component metadata. Navigation and toolbars follow the complete introduction. Mobile heading/action rows retain their flex gap. All dimensions follow the selected px/rem unit.
- **Check:** Compare Overview, Typography, Spacing, Grid and a component detail page. Switch Human/Machine View, collapse Shared sizing and check narrow layouts. Section gaps should remain consistent; component metadata should stay with its description.

| Reference | Problem | Implemented solution | Quick check |
| --- | --- | --- | --- |
| Sitewide Foundation | Editors changed previews without updating the site. | Shared model and runtime apply settings at boot, edit, reset and across tabs. | Change a Foundation setting; open Overview and a component page. |
| Section headings | Titles used Mono 12 px. | Section titles are H2 elements using the selected H2 role. | Change H2 family, size and color; check Colors headings. |
| H1 through H6 | Heading metrics differed from the editor. | Shared family, size, weight, line height, tracking, style and theme color tokens. | Change each role; compare matching headings. |
| Body and Paragraph | Supporting copy used conflicting styles. | Separate Body, Paragraph and Caption bindings. | Set different Body and Paragraph sizes; inspect controls and prose. |
| Letter spacing | No editable per-role control. | Added validated tracking controls and export values. | Set H1 tracking to 1.5 px; inspect another page. |
| Typography preview | Dark changes and blur validation were incomplete. | Theme updates refresh samples; blur commits line height; invalid records cannot save. | Type 150 gradually, blur, reload; toggle theme and change Dark color. |
| Uploaded fonts | Files disappeared after reload. | Font bytes are included in saved settings; allowed files are bounded to 2 MB. | Upload a font, save, navigate and reload. Check storage errors. |
| Brand and themes | Separate boot and editor color logic drifted. | One resolver applies brand, surface, neutral and status colors. | Set distinct Light and Dark values; switch themes on several pages. |
| Primary button contrast | One foreground failed across three backgrounds. | Default, hover and pressed states resolve their own foregrounds. | Try red, white, black and purple brand colors. |
| Spacing | Philosophy choices remained metadata. | Spacing aliases resolve to the chosen scale; Adaptive uses smaller and larger quantization steps. | Select 2 px, 4 px, 8 px and Adaptive; inspect page and control spacing. |
| Sizing | No shared controls for dimensions. | Added control, touch target, icon, content and sidebar sizing controls. | Expand Shared sizing on Spacing, Grid or Icons. |
| Radius | Numeric names changed meaning between philosophies. | Numeric primitives keep their values; semantic radii follow the philosophy. | Compare Sharp and Expressive on default controls. |
| Borders | Width, opacity, style and state colors stayed local. | Shared border and state tokens; logical sides apply to form controls. | Set dashed 2 px borders; test focus, errors and RTL Start/End. |
| Shadows | Philosophy did not change elevation. | Shadow recipes now resolve from the selected philosophy. | Choose Flat, then Expressive; inspect Card and overlay demos. |
| Icons | Size, stroke and corners were disconnected. | Common UI icons consume shared dimensions and stroke treatment. Dashed treatment is supported. | Change size and stroke; compare buttons and toolbar icons. |
| Grid | Saved columns/gutter were not a usable global contract. | Shared tokens, bounded integer validation and a resolved preview. | Try 16 columns and 12 px gutter; reject 25 columns or 65 px gutter. |
| Project defaults | Project exports disagreed with platform recommendations. | Editors, runtime and exports share the platform-first resolver. | Use Data-Heavy + Desktop Web; compare Spacing, Radius, Grid and export. |
| Design units | Dimensions mixed fixed pixel values and labels. | Persistent px/rem selection, equivalent conversions and dimensional input companions. | Convert 24 px to 1.5 rem; switch back. Counts and percentages must stay unchanged. |
| Long copy | Long prose lacked expansion. | Four-line clamp with Read More/Read Less, resize handling and keyboard expansion. | Test a long paragraph at mobile width; expand and collapse using keyboard. |
| Required fields | Labels displayed Required badges. | Foundation red asterisks; native required validation stays intact. | Review New Project and validation messages. |
| Optional fields | Optional badges cluttered labels. | Removed field badges without making fields mandatory. | Submit New Project without name, email or designation. |
| Saving and reset | Failed storage could still look saved. | Save status reflects failures; failed resets retain the previous settings. | Block storage or fill quota; verify notices and old saved data. |
| Concurrent editing | Old controls could overwrite another tab's edits. | Affected editors show Reload controls and block further edits until refreshed. | Edit Typography in two tabs; change one and inspect the other. |
| Exports | Local snippets omitted applied values. | Foundation JSON includes saved settings, font assets and resolved CSS tokens. | Use Export Foundation JSON; compare tokens with the visible design. |
| Component code | Copied recipes could override shared type and spacing. | Shared normalization connects 63 component code generators to Foundation metrics and dimensions. | Copy Button, Input and Card code; check their Foundation variables. |

## Data Format controls

All categories in the attachment have controls and examples on [Data Format](data-format.html). “Radication” is treated as **redaction**, matching the existing Full redaction and Partial redaction sections.

| Category | Available customization |
| --- | --- |
| Thousands separator | Locale, grouping, locale/comma/space/no separator. |
| Unit | Suffix and no/ordinary/nonbreaking space. |
| Currency | Currency, symbol/code/name and decimal precision. |
| Large amounts | Compact or standard notation; exact value is accessible. |
| Tables | Numeric alignment and a configured example table. |
| Absolute date | ISO, localized or long date. |
| Absolute time | 12/24-hour clock and seconds. |
| Combined | Space or T separator. |
| Relative time | Enabled or absolute date fallback. |
| Time zone | IANA zone and visible zone label. |
| Ranges | Separator; both dates retain date-format rules. |
| No value | Custom placeholder; zero remains a real value. |
| Loading | Skeleton or visible loading text. |
| Full and Partial | Mask character, trailing characters and default mode. |
| Escaped spacing | Ordinary, nonbreaking or narrow nonbreaking space. |

Numeric Statistic values, numeric table cells, filled Date Picker/Time/Date Range examples and marked loading values use the shared formatter. Invalid dates and nonnumeric values return the configured missing placeholder. Calendar dates retain their date across time zones; timestamps are converted to the selected zone.

## Guide for future components

- Use `var(--type-ROLE-PROPERTY)` for typography. Properties include `family`, `size`, `weight`, `line-height`, `tracking`, `style` and `color`.
- Use semantic radius, spacing, sizing, border and shadow variables for defaults. Explicit component variants may retain their documented dimensions.
- Use `ADSFoundation.format(value, kind, options)` or `data-format` with a canonical `data-value`. Pass `options.currency` or `data-currency` when the data has its own currency.
- Formatting changes presentation. Currency exchange and physical unit conversion belong to the data layer.
- Mark dimensional inputs with `data-dimension`. Store canonical pixel values; expose converted px/rem values through the shared control.
- Keep counts, weights, percentages, opacity and time quantities outside px/rem conversion. SVG viewBox coordinates remain unitless.
- Use native `required` or the correct group validation. Add the red asterisk to the label; remove Optional badges.
- Keep errors and live status messages fully visible. Interactive labels/card buttons are exempt from Read More to avoid nested controls.
- Browser storage shares settings on the same origin. Use the same local server origin when testing multiple pages or tabs.

## Checks and release tasks

The 2026-10-08 run passes all 55 regression tests. The missing Approve/Reject colors now resolve from current status colors and panel surfaces, with separate foregrounds for default, hover and active states. The Foundations/Guidelines DOM sweep passes 2,188 assertions and 32 supplementary recovery checks, covering 846 edits and 817 defined combinations. See [the concise functional audit and handoff](foundation-guidelines-functional-audit-2026-10-08.md) for fixes, per-page coverage, evidence and remaining browser checks. The source inventory covers 157 pages with no reported source issues; generated catalogs and Foundation defaults are fresh.

Automated coverage includes model behavior, palette contrast, conversion round trips, contextual defaults, invalid records, zero/missing/loading values, locale and zone behavior, redaction, all page entry points, CSS dependencies, runtime propagation and storage failures.

Run from the project folder:

```sh
node --test tests/*.test.*
python3 tools/audit_pages.py --check
python3 tools/generate_tokens.py --check
python3 tools/generate_foundation.py --check
```

After editing HTML, regenerate the documentation catalog with `python3 tools/audit_pages.py`. After editing primitive tokens or the shared model, run `python3 tools/generate_tokens.py` and `python3 tools/generate_foundation.py`.

Required release tasks:

- **P1 — Browser regression:** Test every page family at 320, 375, 768, 1024 and 1440 px; verify no clipping after large type changes.
- **P1 — Accessibility:** Check keyboard order, required announcements, focus rings, Read More links, 200% zoom, forced colors and reduced motion. Custom text colors still need a contrast review against their selected surfaces.
- **P1 — Icon assets:** Isometric, 3D and filled/duotone artwork need purpose-built approved assets to replace all existing line icons. Style metadata cannot create those assets.
- **P1 — Component integration:** Render copied Button, Input, Card, Table and Statistic code with the shared Foundation files; compare the results with the configured site.
- **P1 — Original audit backlog:** Continue the existing checklist, including AI/agent action honesty, durable execution contracts and broader accessibility states. Those features were not implemented by this Foundation styling request.

The earlier audit and implementation-status files remain dated snapshots. This file records the current implementation changes; it does not certify production readiness or Figma synchronization.


## Foundations and Guidelines functional follow-up — 2026-10-08

- **Prompts:** applied configuration and tokens now accompany every local Markdown export; Shadows and AI have local exports.
- **Copy:** shared clipboard fallback reports success only when copying succeeds; failures explain manual copy.
- **Editors:** fixed Typography reset recovery, empty tracking, grid validation, zero-value borders, shared sizing reset and Data Format input/multiple-error handling.
- **Assets:** icon references persist, reload and can be removed; font/icon errors and late upload callbacks are handled.
- **Icons:** all styles respect preview size; stroke uses SVG units rather than CSS px/rem.
- **Documentation:** Accessibility describes the current live application contract; AI examples state their demonstration scope; guideline descriptions retain their own column.
- **Verification:** all 14 page scripts were tested in a DOM environment. Browser connector discovery returned no browser, so rendered spacing, scroll and device checks remain pending.
