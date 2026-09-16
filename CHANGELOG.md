# Changelog - 2026-09-09

Work log for the Agentic Design System. Covers everything built and fixed in today's session: the full Button component system, and a sitewide typography/spacing/grid compliance pass.

## Button component system

Built out a complete Button component area, matching the pattern used by other Foundations pages (Colors, Typography, Spacing, Radius, Shadows, Borders, Icons, Grid & Layout).

### `components.html` (Button index / gallery)
- "Button type" section: 7 cards (Primary, Secondary, Tertiary, Ghost, Link, Neutral, Destructive), each with a live preview button, Copy Prompt / Copy Code actions, and a shared global corner-radius selector that updates all 7 previews at once.
- Clicking a card (or Enter/Space when focused) navigates to that type's detail page.
- Fixed an invalid-HTML bug where the preview button was nested inside the card's own clickable wrapper (`<button>` inside `<button>`), which silently truncated 6 of the 7 cards in the browser. Preview elements are now `<span>`.

### 7 detail pages
`button-primary.html`, `button-secondary.html`, `button-tertiary.html`, `button-ghost.html`, `button-link.html`, `button-destructive.html`, `button-neutral.html` - all built from the same shared structure and script (`button-detail.js`):

- **Properties panel** - one row of controls (Size: 8 options 24-56px, Content: text/icon-left/icon-right/icon-both/icon-only, Corner radius: 0/4/8/12/pill, Button label) that drive a live preview matrix. Heading and body copy went through several rounds of revision to correctly describe what the section actually is (a set of properties applied to one component, not a "configuration" being saved).
- **Copy prompt / Copy code CTAs** - added to the top-right of the Properties panel. Unlike the per-card copy buttons on the index page (which describe just one type), these generate a **full-system** prompt/code covering all 7 types, all 5 states, all 8 sizes, all 5 content variants, and all 5 radius options in one go - a complete brief/code for the whole button component, not just the current page's type.
- **Live Preview** - a full Type x State matrix (7 columns: Primary/Secondary/Tertiary/Ghost/Transparent/Approve/Delete, 5 rows: Rest/Hover/Pressed/Focus/Disabled = 35 cells), sticky header row and column, all cells sharing one uniform label since the section's purpose is to compare visual treatment, not content.
- **When to use {Type}** - a plain, example-driven description of the type's purpose (rewritten away from a prescriptive "never do X" rule tone) plus a row of real-world example action labels as chips.
- Icon-only buttons get a self-positioning ("smart") tooltip showing the accessible label, which repositions itself (top/bottom/left/right) based on available viewport space.
- Removed the earlier Save/Reset buttons entirely - the matrix is always live, nothing is persisted per-page.

### Color system fixes
- Added fixed, brand-independent semantic tokens (`--danger-500/-400/-600`) in `theme.css`, separate from the brand-customizable `--red-500/-400/-600` tokens. The Destructive/Delete button now always renders red regardless of any custom brand color a user has saved on the Colors page - previously it silently followed brand color like Primary does, which is wrong for a fixed "danger" meaning.
- Approve and Destructive buttons now both show a tinted background + colored border + colored text at rest (not just on hover), matching each other visually.
- Strengthened the Transparent/Link button's focus outline by fixing its cramped horizontal padding (2px to 8px).

## Sitewide typography / spacing / grid compliance

Audited the shared `shell.css` (and all other pages) against the rules the site itself defines on its own Typography, Spacing, and Grid & Layout tabs, and brought the rest of the site into line with them.

**Typography** - every font-size/line-height pair now matches one of the defined type-scale tokens (text-xs 12/18, text-sm 14/20, text-md 16/24, text-lg 18/28, text-xl 20/30, display-xs 24/32, display-sm 30/38, display-md 36/44, display-lg 48/60, display-xl 60/72, display-2xl 72/90). Notable fixes: page titles (32px to 30/38), page lede and several body/description classes (loose 1.6/1.65 line-heights snapped to 1.5), panel titles and page eyebrows (added the missing 18px line-height).

**Spacing** - every layout-rhythm margin/padding/gap now sits on the site's own 4px-based scale (4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128px). About 20 off-scale values across shell.css (6px, 10px, 14px, etc.) were rounded to the nearest step.

**Grid gutter** - unified the gutter on every structural card/tile grid (product cards, system cards, icon upload grid, library cards, pattern cards, do/don't grid, and the button Properties row) to the site's canonical 24px gutter.

**Deliberately left alone** (judgment calls, not oversights):
- The button system's own internal size micro-scale (`.btn-demo--h24` through `--h56`, `.btn-sm`) - tied 1:1 to 8 specific button heights, would break if forced onto the general content scale.
- Decorative/illustrative elements: KPI stat numbers, small icon badges, keyboard-shortcut chips, miniature schematic diagrams on the Grid & Layout and Patterns pages, optical-alignment nudges (negative margins, select-arrow padding).
- Dense table-like row grids (`.history-item`, `.usage-row`) - a different layout pattern from the card/tile grids the 24px gutter rule targets.

### Bugs caught and fixed along the way
- A 0px gap between the "Live Preview" and "When to use {Type}" panels on all 7 button pages, caused by a leftover, unstyled class name (`.spacing-model-panel`) copied from the Spacing page - added the missing 24px margin.
- A regression introduced mid-sweep: changing the Button label input's line-height to match the type scale broke its height-match with the adjacent dropdowns (36px vs 42px) - reverted to keep the two aligned, since component height-matching takes precedence over the paragraph type scale for form controls.
- Two accidental em-dash slips (`components.js`, and an earlier draft of the "All types" gallery heading) - caught via project-wide grep and fixed; confirmed zero em-dashes remain anywhere in the project.

## Standing rules for this project
- Never use the em-dash character (`—`) or `&mdash;` anywhere - always a plain hyphen (`-`).
- `--red-*` tokens are brand-customizable and must never be used for a meaning that has to stay fixed regardless of brand color (use the semantic `--green-*` / `--danger-*` / `--amber-*` / `--blue-*` tokens instead).
- Screenshot/image review is capped for this session - verification is done via headless-Chrome + JS test harnesses (computed styles, DOM structure) rather than visual screenshots.
