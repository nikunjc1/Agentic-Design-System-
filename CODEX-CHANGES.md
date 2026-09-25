# Codex session — what changed and where to pick up

This documents a parallel editing session run in Codex against this same working
copy, captured after the fact. It's now merged, committed and **pushed to
GitHub** (`main`, commit `487bf9c`, on top of `b8ac9a3`) alongside the last
few CHANGELOG.md entries from the Claude session (the Design System/Guidelines
tab audit and the Design Principles alignment fixes) and the two follow-up
fixes described in §6 below — all as one commit.

**Scale:** 226 files from Codex's own session (+1298 / −13739 lines), plus
this session's own follow-up fixes on top (see §6) — 243 files in the final
commit (+6275 / −14033 lines, the larger insertion count mostly `CODEX-CHANGES.md`
itself and the newly-committed `audit`/`tools`/test files). Verified against a
live server both before and after the follow-up fixes: all 154 pages load with
0 console errors and 0 failed requests, the new project-setup wizard runs
end-to-end (fill → review → save → Settings reflects it → MD Export includes
it), and the bundled test suite (`node --test tests/project-model.test.js`)
passes all 4 tests.

## 1. New files

| File | What it is |
|---|---|
| `theme-init.js` | The old per-page inline `<script>` (theme + saved-brand-color bootstrap) extracted verbatim into one shared file. |
| `project-model.js` | New data model for a "project profile" (project name, product type, target platforms, name/email/designation/role). Validates, saves/reads from `localStorage` (`ads:project-profile:v1`, draft at `ads:project-draft:v1`), and generates the Markdown export. Isolated, dependency-free, usable from both the browser (`window.ADSProject`) and Node (`module.exports`). |
| `experience.js` | Runtime layer wired into every page: sitewide accessibility injections (skip-link, `aria-current`, a page-outline nav when a page has >2 headings, labelling the sidebar/matrix regions), a contextual "your design system" setup banner, the New Project multi-step wizard (`setupForm()`), the MD Export page (`exportPage()`), and the Settings profile summary (`settings()`). |
| `experience.css` | Styling for everything `experience.js` adds, plus a real responsive/touch-target pass (44px min touch targets, mobile breakpoints for the topbar/sidebar/matrix/forms, `prefers-reduced-motion` support, several `overflow-wrap`/min-width overflow fixes). |
| `docs-catalog.json` | Generated catalog of every page's title/kind/status/plain-text content, built by `tools/audit_pages.py`. Feeds MD Export's "include component guides" option and `tools/browser-audit.js`. |
| `tools/audit_pages.py` | Regenerates `docs-catalog.json` and `audit/page-inventory.{json,md}` — parses every `.html` file's `<main>`, checks for a single `<h1>`, duplicate `id`s, and broken local links/asset references. Run it after adding or renaming any page: `python3 tools/audit_pages.py`. |
| `tools/browser-audit.js` | A `docs-catalog.json`-driven in-browser sweep: loads every page in an iframe at 1440/768/390/320px, checks for content/overflow/heading-count problems and exercises every Component Guide toggle. Meant to be run via `agent-browser eval --stdin` against a local preview server. |
| `tests/project-model.test.js` | Node's built-in test runner, 4 tests covering validation, storage round-tripping (including "don't clobber good data with bad"), Markdown content, and metadata escaping. Run with `node --test tests/project-model.test.js`. |
| `audit/page-inventory.json` / `audit/page-inventory.md` | Output of `tools/audit_pages.py` — currently **all 154 pages show "Source checks passed,"** no outstanding issues flagged. |
| `audit/browser-before.json`, `audit/browser-second-pass.json`, `audit/reference-before/` | Codex's own before/after snapshots from its work — a record of what it compared against, not something you need to act on. |

Pre-existing, **not** part of this session (already tracked in git, untouched): `audit/UI-UX-Audit-2026-09-09.md` and `audit/onboarding/*` — an older audit from a much earlier phase (references "15 HTML pages," long before this repo grew to 154).

## 2. The big architectural change: New Project is now a real feature

The previous `new-project.html` was a static spec page (5 sections illustrating
what a future wizard *would* look like — a mockup, explicitly labelled
`Mockup` status). **It's now a real, working 3-step form**: product/platform
→ personal details → review → save, with client-side validation, per-field
error messages, draft autosave to `localStorage` on every keystroke, hash-based
step routing (`#step-1/2/3`, back button works), and a completion state that
links to Foundations or straight to Markdown export.

This is backed by `project-model.js` (validate/save/read/markdown) +
`experience.js`'s `setupForm()`, and is genuinely functional — verified this by
filling it out end-to-end.

**This replaced the welcome modal.** `overview.html` no longer has the
`welcome-modal-overlay` markup or the `<script src="welcome.js">` tag — the
"choose old or new project" popup and its custom Select combobox (both built
earlier in the Claude session) are gone. `welcome.js` was left orphaned on
disk with zero remaining references — removed as part of this pass (see §6).

Two other pages became real in the same pass:

- **`md-export.html`** — was a static illustration of a hypothetical export
  system (fake checksums, fake AI-sync states). Now it's a working exporter:
  pick a scope (brief only / brief + component guides / everything), optionally
  include your contact details, get a live Markdown preview pulling your real
  saved profile + real saved foundation tokens (+ real per-component doc text
  from `docs-catalog.json` when in scope), then copy or download it. Verified
  the generated file actually contains the profile data.
- **`settings.html`** — was a "Coming soon / Not built yet" placeholder. Now
  it's a real hub: shows your saved profile summary, links to edit it or export
  Markdown, quick links to every Foundation editor, and links out to the
  NPM/Figma roadmap pages.

**`ai-generator.html`, `figma.html`, `npm-package.html`, `history.html`** —
their own `<main>` content is untouched (still "Coming soon" pages), but
`experience.js` now injects a small dynamic notice above the lede on each,
pointing at Markdown export as today's real alternative (e.g. on
`ai-generator.html`: "Use this system with your AI tool — export your product
brief... then attach the file to your AI tool").

## 3. Sitewide mechanical change: shared boilerplate extraction

148 of the 154 HTML pages had their ~90-line inline theme-bootstrap `<script>`
replaced with `<script src="theme-init.js"></script>`, and gained two new
`<link>` tags:
```html
<link rel="stylesheet" href="theme.css" />
<link rel="stylesheet" href="shell.css" />
<link rel="stylesheet" href="experience.css" />
```
This accounts for the bulk of the diff (13,739 of the deleted lines are just
this same block, repeated, going away).

**Fixed:** `shell.css`'s own first line was still `@import url("theme.css");`,
so `theme.css` was loading twice on every page (once via the new explicit
`<link>`, once via `shell.css`'s existing `@import`) — harmless, but
redundant. Removed the redundant `<link rel="stylesheet" href="theme.css" />`
line from all 154 pages (kept `shell.css`'s own `@import`, since that's the
one path every page already depended on). Verified `--red-500` and other
theme tokens still resolve correctly afterward, and re-ran the full 154-page
sweep: still 0 console errors, 0 failed requests.

## 4. Sitewide correctness fixes (small, but touch ~70 files)

Two fixes were applied everywhere a "click the whole card to navigate/select"
pattern exists (component listing pages' type-cards, and several Foundation
pages' product/system cards — `components.js`, `table-detail.js`,
`button-detail.js`, and 60+ other `*-detail.js` files, plus `borders.js`,
`grid-layout.js` ×2, `icons.js`, `radius.js`, `spacing.js` ×2):

1. **Clicking or pressing Enter/Space on an interactive control *inside* a
   clickable card no longer also triggers the card's own navigation.** Before,
   a card wired to navigate on click (or Enter/Space) would still fire that
   navigation even when the click/keypress actually landed on a nested button,
   input, select, or link inside it — e.g. clicking a "Copy code" button
   sitting inside a clickable listing card would copy *and* navigate away.
   Now it checks `e.target.closest("button, input, select, textarea, a,
   [role=combobox]")` and bails; the keydown handler now also requires
   `e.target === card` specifically. **This is worth verifying against the
   Copy prompt/Copy code buttons and the welcome-modal-style Select combobox
   built earlier in the Claude session**, since that's exactly the class of
   bug this fixes.
2. **Rapid typing into a live-updating property field (e.g. Button's label
   input) is now debounced** through a new shared `window.ADS_scheduleRender`
   (80ms) instead of re-rendering the full property matrix on every keystroke.

`shell.js` itself also picked up real hardening on top of the mobile sidebar
drawer built earlier in the Claude session:
- `inert` is now applied to the rest of the page while the drawer is open
  (`main`, `.brand`, `.topbar-right`), plus a real focus trap (Tab/Shift+Tab
  cycle inside the open drawer), auto-focus on open, and focus restored to the
  toggle on close.
- Body scroll lock now saves/restores whatever `overflow` value was already
  set, rather than assuming empty string.
- The drawer auto-closes if the viewport is resized past the 900px mobile
  breakpoint while open.
- `markActiveLink()` now explicitly clears `is-active`/`aria-current` from
  every link before re-matching (was previously additive-only), sets
  `aria-current="page"` alongside the class, and now also re-runs on
  `hashchange` (e.g. navigating to `foundations.html#spacing` from
  `foundations.html#colors` without a full reload now updates the active link,
  which it didn't before).
- The global `/` search shortcut now un-inerts (opens) the mobile drawer first
  if it's currently closed, before focusing the search field.

## 5. Following up on what Codex left unfinished

Codex's own `audit/browser-second-pass.json` (its after-the-fact browser sweep,
154 pages × 2 widths = 308 checks) flagged exactly one remaining issue:
`modal-default.html` overflowing horizontally at 390px width (`main` measured
402px in a 390px frame). Investigated this directly rather than taking the
audit's word for it:

- Reproduced the exact check (load at 390px, measure `scrollWidth`) — clean,
  390/390.
- Reproduced with the Component Guide toggles clicked first (matching what
  the audit script does before measuring) — still clean.
- Reproduced inside an actual iframe at 390px width (matching the audit
  script's own iframe-based harness exactly) — still clean.
- Reproduced with web fonts blocked, to test whether a late font swap was
  briefly widening text before the layout settled — still clean, both
  immediately and after a 1-second wait.
- Checked the page's own CSS for any fixed width near the 390-410px range
  that could explain an intermittent 12px overflow — the widest fixed-width
  element on the page is 220px, nowhere close.

Four independent reproduction attempts, zero repro. This was very likely a
one-off timing flake in that specific audit run, not a real, persisting bug —
documented here rather than "fixed" with a change that has nothing to point
at. If it resurfaces, it'll be worth re-running `tools/browser-audit.js` a
few times in a row to see whether it's reproducible at all before chasing it
further.

Beyond that one flagged item, went through the new feature surface directly
looking for edge cases Codex might not have gotten to, rather than assuming
"it audits clean" meant "it's finished":

- Wizard validation (submitting Step 1 empty correctly blocks advancing and
  shows the field error; choosing "Other" for product type correctly reveals
  the free-text field).
- Settings page with no saved profile yet ("No project setup saved yet.",
  not a blank string).
- The skip-link, page-outline (only appears with >2 headings, confirmed 10
  links generated on Design Principles), and the `.component-open-link`
  injection onto listing cards.
- The "Export this guide" deep link from a detail page's setup notice
  (`md-export.html?page=table-default.html`) — confirmed it pre-selects the
  right scope option and the generated Markdown actually contains that
  page's content.
- The click-hijack fix, specifically against the Copy prompt/Copy code
  buttons built during the Claude session (the exact combination that fix
  targets) — confirmed clicking "Copy code" inside a clickable listing card
  no longer also navigates away.
- No horizontal overflow on the new wizard form itself at 390px.

All of the above worked correctly — no further bugs found in the new feature
work itself.

## 6. Completed as part of this pass

1. **Removed the redundant `theme.css` double-load** (see §3) — dropped the
   new `<link>` from all 154 pages, kept `shell.css`'s own `@import`.
2. **Deleted `welcome.js`** — confirmed zero remaining references anywhere
   (`grep -rl "welcome.js\|welcome-modal\|welcome-overlay" *.html` came back
   empty) before removing it. It was dead code, not reachable from any page.
3. Re-ran `python3 tools/audit_pages.py` after both changes to refresh
   `docs-catalog.json` and `audit/page-inventory.{json,md}` — still 154/154
   "Source checks passed."
4. Re-ran the full 154-page live-server sweep, the wizard-to-export
   end-to-end flow, and `node --test tests/project-model.test.js` after both
   changes — all still clean/passing.

## 7. Current state

Committed and pushed — `git log --oneline -1` on `main` is `487bf9c Merge
parallel Codex session's feature work, fix its two loose ends, document it
all`, on top of `b8ac9a3` (the last Claude-session commit before this one).
Nothing is pending in the working tree beyond this file's own edit.

Remaining judgment calls, not bugs — worth deciding on later, not fixing now:

- `ai-generator.html`, `figma.html`, `npm-package.html`, `history.html` are
  still "Coming soon" pages (their own content untouched by Codex; it only
  added a small dynamic notice on top pointing at Markdown export as today's
  real alternative). Whether/when to build any of them out for real is a
  product decision, not a leftover bug.
- The `audit/` and `tools/` additions are now genuinely useful ongoing
  tooling (`python3 tools/audit_pages.py` regenerates the doc catalog and
  page inventory; `tools/browser-audit.js` is a repeatable multi-viewport
  sweep) — worth reaching for the next time a page gets added, renamed, or
  restructured, rather than a one-off artifact from this session.
