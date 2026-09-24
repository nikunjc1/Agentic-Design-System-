# Agentic Design System - Complete Knowledge Base

**Purpose of this document:** this is a full atomic-level handoff of everything done to this codebase in this working session - what was broken, what was fixed, why, how it was verified, and the exact patterns and conventions this project follows. It is written so that a new designer, a new engineer, or a different AI assistant (Claude, ChatGPT, or anything else) can pick up this project with zero prior context and immediately understand:

1. What this project is and how it's built.
2. Every bug that was found and fixed, and the reasoning behind each fix.
3. The exact code patterns used everywhere, so new components can be built consistently.
4. What is verified vs. what still needs verification.
5. What is committed vs. what is still sitting as uncommitted local changes.

Read this top to bottom once, then use it as a reference.

---

## 1. What this project is

**Agentic Design System** (v3.4.0) is a **static HTML/CSS/JS site** - no build step, no framework, no bundler. Every page is opened directly (`file://...` or a static file server) and works as-is.

- `shell.css` - the one shared stylesheet for the entire site (topbar, sidebar, panels, buttons, chips, and now the Component Guide toggle - see §5).
- `shell.js` - the one shared script for the entire site (theme toggle, sidebar search, collapsible nav groups, active-link highlighting, and now the Component Guide toggle - see §5).
- `theme.css` - CSS custom properties (colors, fonts, radii) for light/dark theme, `@import`-ed at the top of `shell.css`.
- `multiselect.js` - a shared custom multi-select dropdown widget used by many components' "Size" / "Corner radius" / "Type" property controls.

Every one of these three files is loaded on (almost) every page, so a change to any of them affects the whole site at once. Be careful.

### 1.1 Anatomy of one component

Every component in the sidebar (Button, Input, Select, Modal, Timeline, etc.) is built from **up to three files**:

| File | Purpose |
|---|---|
| `<name>.html` (e.g. `button.html`, `input.html`) | The **listing page** - shows a gallery of "type cards" (small live previews) that link to detail pages. |
| `<name>-default.html` (e.g. `modal-default.html`) | The **detail page** - has a "Properties" panel (editable Size/Label/Text/etc. controls), a "Live Preview" matrix (every Type × every State, rendered live from the property values), a "When to use" panel, and (as of this session) a "Component Guide" panel at the bottom. |
| `<name>-detail.js` | The **driver script** - reads the Properties panel's inputs, builds the Live Preview HTML matrix as a string, injects it via `.innerHTML`, and builds the "Copy prompt" / "Copy code" clipboard text. |

**Exceptions to the naming convention** (older components, built before the `-default.html` convention was adopted):
- **Button** has no single `-default.html`. Instead each type is its own full page: `button-primary.html`, `button-secondary.html`, `button-tertiary.html`, `button-ghost.html`, `button-link.html`, `button-neutral.html`, `button-destructive.html`, plus `button-primary-icon.html` (the "Dual Icon" variant, driven by a separate `button-dualicon-detail.js`). All of them render the *same* "all 8 types" Live Preview matrix; only the page title/lede differ per type.
- **Input**'s detail page is `input-text-field.html`, not `input-default.html`.
- **Select**'s detail page is `select-dropdown.html`, not `select-default.html`.

There are **65 total detail pages** across the whole site (55 `*-default.html` + `input-text-field.html` + `select-dropdown.html` + 8 Button pages).

### 1.2 Sidebar categories (in nav order)

- **Foundations**: Colors, Grid & Layout, Typography, Spacing, Radius, Borders, Shadows, Icons (not components - no detail-page pattern applies).
- **Actions**: Button, Group Button, Float Button.
- **Forms**: Input, Select, Checkbox, Radio, Switch, Date Picker, Password, Number, Mention, Autocomplete, Date Range, Time, Text Area, Search, Add-on, Color Picker, Slider, Rating, Cascader, Transfer, Tree Select, Upload.
- **Navigation**: Tabs, Anchor, Breadcrumb, Dropdown, Pagination, Menu, Steps.
- **Feedback**: Alert, Toast, Modal, Tooltip, Tour, Drawer, Notification, Pop Confirm, Progress, Result, Skeleton, Spin.
- **Data Display**: Divider, Avatar, Badge, Calendar, Card, Collapse, Description, Empty, Image, List, Popover, Table, Tag, Timeline.

That's **58 components** total (3 Actions + 22 Forms + 7 Navigation + 12 Feedback + 14 Data Display).

---

## 2. Session summary - three phases of work

### Phase A - design/layout fixes (already committed, commit `ebee1d0`)
Done *before* this document's scope, but listed for continuity:
- Added a "Horizontal" Type to Timeline's Live Preview matrix (previously only had a vertical layout).
- Fixed Table's listing-card layout so its 3 example cards render in a single row instead of overflowing.
- Fixed Popover's (and Tour's/Pop Confirm's) connector arrow, which was nearly invisible against the panel background.
- Fixed a systemic text-alignment bug: roughly a dozen components (List, Modal, Card, Collapse, Description, Tour, Alert, Toast, Popover, Notification, Popconfirm-bubble, Timeline) had body text that wasn't explicitly `text-align:left`, so it inherited center-alignment from an ancestor in some contexts.
- This phase is already committed and pushed is NOT confirmed - check `git log` before assuming it's live.

### Phase B - atomic-level UX/security audit (this session, uncommitted)
A systematic, one-component-at-a-time audit of **all 58 components**, going electron→proton→neutron→atom→organism and back, per an explicit user mandate to never batch/skip and to verify every fix 2–3 times before moving on. Full results in §4.

**Headline finding: a systemic stored-XSS vulnerability class.** Every component's Properties panel lets you type free text into a "Label", "Placeholder", "Title", "Description", etc. input. That text is read via `input.value.trim() || defaultValue` and then concatenated **raw, unescaped** into an HTML string that gets assigned to `matrixContainer.innerHTML`. Anyone who types `"><img src=x onerror=alert(1)>` into a Label field gets it executed as real HTML/JS the moment the Live Preview re-renders. This is a classic reflected/stored DOM-XSS pattern, and it was present in **34 of the 58 components** before this session. Root cause, fix, and verification method are all in §4.

### Phase C - "Component Guide" documentation feature (this session, uncommitted)
Added a new "Component Guide" section to the bottom of **all 65 detail pages**, with a **Human View / Machine View toggle**:
- **Human View** (default): prose + bullet-point documentation - Overview, When to Use, When Not to Use, Best Practices, Accessibility, Related Components.
- **Machine View**: the same content as a single structured JSON object, so another AI agent (or a script) can consume the component's semantics directly without scraping prose.

Full schema, code, and gotchas in §5.

---

## 3. Current repository state (as of writing this document)

- **This is a git repo. Nothing from Phase B or Phase C has been committed.** Every file listed below is a local, uncommitted change (`git status --short` shows `M` for all of them).
- **109 files modified** in total:
  - `shell.css`, `shell.js` - the two shared infrastructure files (touched in both Phase B, for CSS/layout fixes, and Phase C, for the guide toggle).
  - **42** `*-detail.js` driver scripts - touched in Phase B for XSS fixes.
  - **65** `*.html` detail pages - touched in Phase C for the Component Guide section (a handful were *also* touched in Phase B/earlier for layout fixes, e.g. `button-*.html`).
- **Last real commit:** `ebee1d0` - "Add horizontal Timeline layout, fix Table overflow, and fix a systemic text-alignment bug" (Phase A). Confirm with the user whether this was pushed to a remote before assuming it's live anywhere.
- **Nothing has been pushed in this session.** Per this project's established convention ("only commit when explicitly asked"), do not `git add`/`git commit`/`git push` until the user asks.

---

## 4. Phase B in full detail - the XSS audit and every other bug found

### 4.1 The vulnerability, exactly

In a typical driver script (e.g. `alert-detail.js`, before the fix), the pattern looked like this:

```js
function render(){
  var title = titleInput.value.trim() || FALLBACK_DEFAULTS.title;
  var description = descriptionInput.value.trim() || FALLBACK_DEFAULTS.description;
  // ... build the live-preview HTML ...
  var titleHtml = '<p class="alert-demo-title">' + title + "</p>";                 // <-- RAW, UNESCAPED
  var descriptionHtml = '<p class="alert-demo-description">' + description + "</p>"; // <-- RAW, UNESCAPED
  matrixContainer.innerHTML = html; // executes any <script>/<img onerror> in title/description
}
```

Two distinct injection shapes were found across the codebase:
1. **Tag injection** - typing `Update available"><img src=x onerror=alert(1)>` into a Title/Label field. Once concatenated into `<p class="...">` + title + `</p>`, the browser parses the injected `<img>` tag as real markup and fires the `onerror` handler.
2. **Attribute injection** - typing `x" onmouseover="alert(2)` into a Placeholder field that gets written as `placeholder="` + placeholder + `"`. This breaks out of the `placeholder` attribute and injects a new `onmouseover` handler onto the same `<input>` tag.

Both shapes were reproduced and confirmed on every affected component before being fixed (see §4.4 for the exact verification method).

### 4.2 The fix, exactly

A tiny, dependency-free HTML-escaping helper, added near the top of each affected driver script's IIFE:

```js
function escapeHtml(str){
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```

Then every raw insertion point was wrapped: `title` → `escapeHtml(title)`, `placeholder` → `escapeHtml(placeholder)`, etc. This had to be applied **twice** in most components - once in the function that builds the **live** Properties-panel preview matrix, and once in `buildFullCode()` / `exampleMarkupFor()` (the function that generates the text for the "Copy code" button) - because many components maintain two separate string-building code paths that both embed the same user text. Missing the second one means the Live Preview is safe but the copy-pasted example code a user takes into their own project is not.

**Important nuance - don't escape hardcoded/trusted values.** Several components have a mix of user-editable text and hardcoded demo constants in the same function (e.g. Date Range's `FILLED_START = "Jan 4, 2026"` alongside a user-editable `label`). Only the user-editable variable needs `escapeHtml()`; wrapping a hardcoded literal in `escapeHtml()` too is harmless but unnecessary - the actual bug is only ever on values sourced from `input.value`.

**Important nuance - numeric/enum-sourced values are already safe.** Several "properties" are never raw text even though they look editable:
- A `<select>`'s value only ever matches one of its own `<option value="...">` entries - safe by construction.
- A field validated with a regex before use (e.g. Color Picker's hex value, checked against `HEX_RE` and falling back to a default if it doesn't match) is safe.
- A field passed through `parseInt`/numeric clamping (e.g. Slider's value, Skeleton's row count, Progress's percent) is safe - it can only ever become a number.

These were confirmed safe **by reading the code**, not assumed - each one was traced from the input element to its use.

### 4.3 A second, distinct bug class found during the same audit: "Copy Code/Prompt ignores live edits"

Independently of XSS, several components had a **content-accuracy bug**: the "Copy prompt" / "Copy code" buttons - meant to always reflect whatever is currently configured in the Properties panel - were silently ignoring the user's edits to a specific field and always emitting a hardcoded default instead. Example (Tabs, before the fix):

```js
// buildFullCode() never received the user's typed labels - it always used the constant:
var DEFAULT_LABELS = ["Overview", "Activity", "Settings"];
...
DEFAULT_LABELS.forEach(function(label, i){ ... });   // ignores whatever the user actually typed
```

The fix in every case: thread the real value through `selectionInfo` / the function's parameter list, from `currentSelectionInfo()` → `buildFullPrompt()`/`buildFullCode()` → `buildComboPrompt()`/`buildComboCode()`, so "Copy code" always matches what's rendering on screen. This bug was found and fixed on: **Tabs, Anchor, Breadcrumb, Dropdown, Menu, Steps, Calendar**.

### 4.4 Verification methodology (reuse this for any future fix)

For every fix, the same reliable loop was used - **do not** try to simulate typing/events with `fetch`+`insertAdjacentHTML` or dynamically-injected `<script>` tags; both approaches were tried early in this session and were unreliable (one attempt even hung a headless Chrome process for minutes because of a JS syntax error inside a dynamically built inline script, requiring a manual `kill -9`).

The reliable method:
```bash
# 1. Copy the real page into the SAME project directory (not /tmp - relative
#    <link>/<script> paths must still resolve).
cp alert-default.html zz-audit-scratch.html

# 2. Statically rewrite the default value="..." attribute to include an XSS
#    payload, using Python (safe string handling, no shell-escaping headaches).
python3 -c "
with open('zz-audit-scratch.html') as f: content = f.read()
payload = '&gt;&lt;img src=x onerror=alert(1)&gt;'
content = content.replace(
    'data-role=\"alert-title\" value=\"Update available\"',
    'data-role=\"alert-title\" value=\"Update available' + payload + '\"'
)
with open('zz-audit-scratch.html', 'w') as f: f.write(content)
"

# 3. Screenshot it with headless Chrome.
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --allow-file-access-from-files \
  --window-size=1400,1200 --screenshot=/tmp/out.png --virtual-time-budget=3000 \
  "file://$(pwd)/zz-audit-scratch.html"

# 4. Visually confirm the payload renders as literal escaped text (e.g. the
#    string "><img src=x onerror=alert(1)>" appearing as plain visible text)
#    with NO alert popup and NO broken layout. Read the resulting PNG.

# 5. Clean up.
rm zz-audit-scratch.html /tmp/out.png
```

After every fix, four additional cheap checks were run:
1. `node --check <file>.js` - confirms no syntax errors were introduced.
2. A small Python tag-balance checker (a void-tag-aware stack matcher) run against the HTML - confirms no unclosed/mismatched tags.
3. `grep -l "—"` (em dash) across touched files - this codebase's convention avoids em dashes; catches an accidental one.
4. `git status --short | grep -i <component>` - confirms *only* the expected files changed for that component (no accidental cross-contamination).

### 4.5 Full per-component results table

Legend: **Fixed** = vulnerability found and patched this session · **Already safe** = audited, found already correctly escaped, no change needed · **No surface** = component has no free-text user input at all, nothing to fix.

| # | Component | Category | XSS status | Notes |
|---|---|---|---|---|
| 1 | Button | Actions | Fixed | Label escaped (4 content branches: text/icon-left/icon-right/icon-both) in both `button-detail.js` and `button-dualicon-detail.js`. Also fixed: stale "All 7 types" text → "All 8 types" (8 pages); `{key:"link", label:"Transparent"}` → `label:"Link"` (mislabeled type); unbounded label width breaking the matrix grid (added `max-width:320px; overflow:hidden; text-overflow:ellipsis` to `.btn-demo`). |
| 2 | Group Button | Actions | Fixed | `fieldLabel`/`supportingText` escaped. |
| 3 | Float Button | Actions | Fixed | Tooltip text escaped. |
| 4 | Input | Forms | Fixed | Label (tag-injection) + Placeholder (attribute-injection) escaped, in both the live matrix and `exampleMarkupFor()`. |
| 5 | Select | Forms | Fixed | Label + text escaped, both paths. |
| 6 | Checkbox | Forms | Fixed | Label escaped. |
| 7 | Radio | Forms | Fixed | Label escaped. `inputName` (radio group name) confirmed internally generated, not user input - safe. |
| 8 | Switch | Forms | Already safe | Had its own pre-existing `escapeAttr()`, correctly applied to both the visible label and the `aria-label` attribute. Proof this bug is per-component, not universal. |
| 9 | Date Picker | Forms | Fixed | Label + text escaped. |
| 10 | Password | Forms | Fixed | Label + placeholder escaped. |
| 11 | Number | Forms | Fixed | Label + placeholder escaped. |
| 12 | Mention | Forms | Fixed | Placeholder escaped (careful: only the placeholder branch - the branch containing the hardcoded `@Jordan` mention chip HTML was deliberately left un-escaped since it's a trusted literal, not user input). Label also escaped. |
| 13 | Autocomplete | Forms | Fixed | Label + placeholder escaped. |
| 14 | Date Range | Forms | Fixed | Label escaped; `startText`/`endText` wrapped in `escapeHtml()` while preserving the hardcoded `FILLED_START`/`FILLED_END`/`ERROR_START`/`ERROR_END` constants as trusted literals. |
| 15 | Time | Forms | Fixed | Label + text escaped; hardcoded `FILLED_VALUE`/`ERROR_VALUE` constants preserved as trusted. |
| 16 | Text Area | Forms | Fixed | Label + placeholder escaped. Specifically tested a `</textarea><img src=x onerror=alert(2)>` breakout payload - confirmed fixed. |
| 17 | Search | Forms | Fixed | Placeholder escaped. (Search intentionally has **no** Label field by design - documented on the page itself.) |
| 18 | Add-on | Forms | Fixed | **4** injection points - label, placeholder, prefixText, suffixText - the most of any single component. All fixed in both paths. |
| 19 | Color Picker | Forms | Fixed | Label escaped. Hex value confirmed already-safe (validated by `HEX_RE` regex before use, falls back to default on mismatch). |
| 20 | Slider | Forms | Fixed | Label escaped (2 insertion points in `buildFullCode`, 1 in the live matrix). Value confirmed already-safe (`parseInt` + numeric clamp). |
| 21 | Rating | Forms | Fixed | Label escaped (2 points). "Selected count" property confirmed safe (`<select>`-sourced). |
| 22 | Cascader | Forms | Fixed | **4** points - label + placeholder, in both the live matrix and `exampleMarkupFor()`. `SELECTED_PATH_VALUE` confirmed hardcoded/trusted. |
| 23 | Transfer | Forms | Fixed | **4** points - `leftTitle`/`rightTitle`, in both the live matrix and `buildFullCode()`. Item names (`SOURCE_ITEMS`/`TARGET_ITEMS`) confirmed hardcoded. |
| 24 | Tree Select | Forms | Fixed | Same 4-point pattern as Cascader (label + placeholder × 2 paths). `SELECTED_VALUE` confirmed hardcoded. |
| 25 | Upload | Forms | Fixed | **8** points - label + helper text, across both the Dropzone and Button sub-layouts, in both paths. |
| 26 | Tabs | Navigation | Fixed + content-sync | Comma-separated `labels` array escaped per-item. **Also fixed:** Copy Prompt/Code always showed the hardcoded default "Overview, Activity, Settings" regardless of user edits - now threads live labels through. |
| 27 | Anchor | Navigation | Fixed + content-sync | Label escaped. **Also fixed:** same Copy Code content-sync bug as Tabs (hardcoded `DEFAULT_LABEL` "Learn more" was never replaced with the live-typed value). |
| 28 | Breadcrumb | Navigation | Fixed + content-sync | Comma-separated `labels` array escaped (3 points: current-page span, first link, other links). **Also fixed:** same content-sync bug. |
| 29 | Dropdown | Navigation | Fixed + content-sync | Trigger label escaped (live matrix + `exampleMarkupFor`). **Also fixed:** `buildFullCode` hardcoded `"Options"` regardless of the user's typed label - now dynamic. |
| 30 | Pagination | Navigation | No surface | Only Size/Corner-radius dropdowns as properties; page numbers are explicitly documented as "fixed reference content, not editable properties." Confirmed via code trace - no `.value` reads feed `innerHTML` anywhere. |
| 31 | Menu | Navigation | Fixed + content-sync | Comma-separated `labels` array escaped, including the "last item is Delete/Remove → auto-destructive-styled" logic path. **Also fixed:** content-sync bug. |
| 32 | Steps | Navigation | Fixed + content-sync | Labels escaped in the single shared `buildStepsRow()` function (used by both the live matrix and `buildFullCode`). **Also fixed:** content-sync bug. |
| 33 | Alert | Feedback | Fixed | Title + description escaped in the shared `buildAlertField()`. Copy Code already correctly wired to live values (no content-sync bug here). |
| 34 | Toast | Feedback | Fixed | Title + description escaped, 4 points (2 functions × 2 fields). "Undo" action-button text confirmed hardcoded. |
| 35 | Modal | Feedback | Fixed | Title + body escaped, **5** points (header, 2× body - the Scrollable state has its own separate body-building branch). "Cancel"/"Delete"/"Confirm" footer button labels confirmed hardcoded. |
| 36 | Tooltip | Feedback | Already safe | `escapeHtml()` already existed and was applied inside the single shared `bubbleContentFor()` function used by both the live matrix and `buildFullCode`. |
| 37 | Tour | Feedback | Already safe | All 3 fields (targetLabel, title, description) already escaped in the shared `buildTourField()`. |
| 38 | Drawer | Feedback | Fixed | Title + body escaped, mirrors Modal exactly (4 points). |
| 39 | Notification | Feedback | Fixed | Title + description escaped, 4 points. |
| 40 | Pop Confirm | Feedback | Already safe | All 3 fields (question, confirmLabel, cancelLabel) already escaped in the shared `buildPopConfirmField()`. |
| 41 | Progress | Feedback | No surface | Only a numeric percent input (clamped) + a checkbox. No text fields. |
| 42 | Result | Feedback | Fixed | Title + description escaped, 4 points. |
| 43 | Skeleton | Feedback | No surface | Only a numeric "rows" input (clamped). No text fields. |
| 44 | Spin | Feedback | Already safe | Label already escaped independently at both insertion points (live matrix + `buildFullCode`). |
| 45 | Divider | Data Display | Already safe | Text label already escaped inside the single shared `buildDividerField()`. |
| 46 | Avatar | Data Display | Fixed | Initials escaped, 2 points (live matrix + `buildFullCode`). Image type confirmed to be a pure CSS gradient placeholder - no real `<img src>`, no injection surface there. |
| 47 | Badge | Data Display | Already safe | Count + label already escaped in the shared `buildBadgeField()`. |
| 48 | Calendar | Data Display | Fixed + content-sync | Month label escaped. **Also fixed:** Copy Prompt/Code completely ignored the user's Month-label and First-day-of-week edits, always emitting the hardcoded "September 2026" / Sunday-start defaults - now threads both through. |
| 49 | Card | Data Display | Fixed | Title + body escaped in the shared `buildCardField()`. |
| 50 | Collapse | Data Display | Fixed | Header + body escaped in the shared `buildStatePanel()`. The static "context" panel's `CONTEXT_HEADER` confirmed hardcoded/trusted. |
| 51 | Description | Data Display | Already safe | Section title + every item's label/value already escaped. |
| 52 | Empty | Data Display | Already safe | Title, description, and action-label all already escaped in the shared `buildEmptyField()`. |
| 53 | Image | Data Display | Fixed | Caption escaped in the shared `buildImageField()`. |
| 54 | List | Data Display | No surface | No free-text properties at all - all row content is hardcoded demo data. |
| 55 | Popover | Data Display | Already safe | Trigger label, title, body all already escaped in the shared `buildPopoverField()`. |
| 56 | Table | Data Display | No surface | No free-text properties - only radius/header-visibility controls; row content hardcoded. |
| 57 | Tag | Data Display | Already safe | Label already escaped and reused correctly for **both** the visible text and the `aria-label="Remove {label}"` attribute (protects against both tag- and attribute-injection at once). |
| 58 | Timeline | Data Display | No surface | Only an icon-visibility checkbox as a property; all event content hardcoded. |

**Tally: 34 fixed (7 of which also had the content-sync bug fixed alongside), 17 already safe, 7 with no free-text surface at all.** 58/58 audited.

---

## 5. Phase C in full detail - the Component Guide (Human View / Machine View)

### 5.1 What was asked and how it was interpreted

Request: put a very detailed "what is this component / where do you use it" write-up at the bottom of every detail page, in a form that both a human and another AI could use, behind a toggle labeled "Human View" / "Machine View". Applied to **all 65 detail pages**.

### 5.2 The HTML structure (identical shape on every page)

Inserted immediately before each page's closing `</main>` tag:

```html
<section class="panel spacing-model-panel component-guide" data-role="component-guide">
  <div class="panel-title-row">
    <p class="panel-title">Component Guide</p>
    <div class="guide-view-toggle" role="group" aria-label="Documentation view">
      <button type="button" class="guide-toggle-btn is-active" data-view="human" aria-pressed="true">Human View</button>
      <button type="button" class="guide-toggle-btn" data-view="machine" aria-pressed="false">Machine View</button>
    </div>
  </div>

  <div class="guide-view-panel" data-view-panel="human">
    <p class="guide-subhead">Overview</p>
    <p class="guide-body-text">...one-paragraph description...</p>

    <p class="guide-subhead">When to Use</p>
    <ul class="guide-list">
      <li><strong>Short bolded lead-in</strong> - rest of the sentence.</li>
      ...
    </ul>

    <p class="guide-subhead">When Not to Use</p>
    <ul class="guide-list">...</ul>

    <p class="guide-subhead">Best Practices</p>
    <ul class="guide-list">...</ul>

    <p class="guide-subhead">Accessibility</p>
    <ul class="guide-list">...</ul>

    <p class="guide-subhead">Related Components</p>
    <p class="guide-body-text">Comma-separated plain-English sentence of related component names.</p>
  </div>

  <div class="guide-view-panel" data-view-panel="machine" hidden>
    <pre class="guide-machine-json"><code>{ ...JSON, see schema below... }</code></pre>
  </div>
</section>
```

### 5.3 The Machine View JSON schema (identical shape on every page)

```json
{
  "component": "Button",
  "type": "Primary",
  "category": "Actions",
  "summary": "One-paragraph description, same text as the Human View Overview.",
  "whenToUse": ["Bullet 1 - detail.", "Bullet 2 - detail.", "..."],
  "whenNotToUse": ["Bullet 1 - detail.", "..."],
  "bestPractices": ["Bullet 1.", "..."],
  "accessibility": ["Bullet 1.", "..."],
  "relatedComponents": ["Secondary Button", "Tertiary Button", "..."]
}
```
`"type"` is present only on pages that represent one variant of a broader component (the 8 Button pages, e.g. `"type": "Destructive"`; Input's `"type": "Text Field"`; Select's `"type": "Dropdown"`). Every other page omits it.

### 5.4 The shared CSS (added once to `shell.css`, reused by all 65 pages)

```css
/* ---------- component guide (Human View / Machine View) ---------- */
.component-guide{ margin-bottom: 24px; }

.guide-view-toggle{
  display: inline-flex;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 2px;
  gap: 2px;
  flex: none;
}
.guide-toggle-btn{
  background: none;
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.03em;
  color: var(--text-mid);
  cursor: pointer;
  transition: background-color .15s ease, color .15s ease;
}
.guide-toggle-btn:hover{ color: var(--text-hi); }
.guide-toggle-btn.is-active{ background: var(--red-500); color: #FFFFFF; }
.guide-toggle-btn:focus-visible{ outline: 2px solid var(--red-400); outline-offset: 2px; }

.guide-view-panel[hidden]{ display: none; }

.guide-subhead{
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin: 20px 0 8px;
}
.guide-subhead:first-child{ margin-top: 0; }

.guide-body-text{ font-size: 15px; line-height: 1.6; color: var(--text-mid); margin: 0 0 12px; }

.guide-list{ margin: 0 0 12px; padding-left: 20px; color: var(--text-mid); font-size: 15px; line-height: 1.6; }
.guide-list li{ margin-bottom: 6px; }
.guide-list li:last-child{ margin-bottom: 0; }
.guide-list li strong{ color: var(--text-hi); font-weight: 600; }

.guide-machine-json{
  background: var(--graphite-950);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-md);
  padding: 16px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-mid);
  margin: 0;
}
.guide-machine-json code{ color: var(--text-hi); white-space: pre; }

@media (max-width: 640px){ .guide-view-toggle{ width: 100%; justify-content: center; } }
```

### 5.5 The shared JS (added once to `shell.js`)

A single delegated handler, wired once in the existing `DOMContentLoaded` block, that works on every page automatically because it queries for `.component-guide` at load time - no per-page script needed:

```js
function initGuideViewToggle() {
  document.querySelectorAll(".component-guide").forEach((guide) => {
    const buttons = Array.from(guide.querySelectorAll(".guide-toggle-btn"));
    const panels = Array.from(guide.querySelectorAll(".guide-view-panel"));
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", active ? "true" : "false");
        });
        panels.forEach((p) => { p.hidden = p.dataset.viewPanel !== view; });
      });
    });
  });
}
// called alongside the other init*() functions inside the existing
// document.addEventListener("DOMContentLoaded", () => { ... }) block in shell.js
```

### 5.6 The one real bug hit while building this, and the lesson

**Bug:** In the first batch of pages, source content strings like `"Same native &lt;button&gt; semantics..."` were written *pre-escaped* (on the assumption they'd be inserted into HTML raw). But the generation script applied its own `esc()` helper to every string automatically before inserting it - so `&lt;` (which itself starts with `&`) got escaped a second time into `&amp;lt;`, which then displayed on the page as the literal, wrong text `&lt;button&gt;` instead of the intended `<button>`.

**Fix:** Went back to the source content and replaced every pre-escaped `&lt;.../&gt;` with the plain literal character (`<button>`), and let the single shared `esc()` function be the *only* place escaping ever happens. Reverted and regenerated the affected pages, then reverified.

**The reusable lesson:** *never* pre-escape content that's about to pass through an automatic escaping step - escaping is not idempotent (`esc(esc(x)) != esc(x)`), so it must happen **exactly once**, at the single point where raw text is inserted into HTML. This is the same underlying principle as the Phase B XSS fixes: exactly one `escapeHtml()` call, at the point of insertion, never zero and never two.

### 5.7 Verification methodology used for Phase C

A dedicated reusable script, `verify_guides.py` (written to the session's scratch directory, not the project - recreate it if needed), runs five checks per file and prints `PASS`/`FAIL(reason)`:
1. **Tag balance** - same void-tag-aware stack matcher as Phase B.
2. **JSON validity** - extracts the `<pre class="guide-machine-json"><code>...</code></pre>` block, reverses the HTML-entity escaping, and runs it through `json.loads()`.
3. **No double-escaping** - greps the file for `&amp;lt;`, `&amp;gt;`, `&amp;amp;` (the fingerprint of the bug in §5.6).
4. **Exactly one guide section** - counts occurrences of `data-role="component-guide"` (must be exactly 1).
5. **No em dash** - same convention check as Phase B.

Every one of the 65 pages was run through this twice (a "verify 2 times, then move on" loop, per the user's explicit instruction), plus roughly one full-page headless-Chrome screenshot spot-check per batch of ~7 pages (covering every category at least once), including one screenshot that specifically exercised the Machine View toggle (via an auto-click injected into a scratch copy of the page) to visually confirm the JS toggle itself - not just the HTML - works correctly in both directions.

**All 65 pages pass all 5 checks as of the end of this session.**

---

## 6. Patterns every future contributor (human or AI) must know

### 6.1 The `escapeHtml()` pattern - apply this to ANY new free-text property

```js
function escapeHtml(str){
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```
Rule: **every** value that came from `input.value` (directly or via `.trim() || default`) must pass through `escapeHtml()` at the *exact point* it's concatenated into an HTML string, in *every* function that builds HTML from it (there are usually two: the live-preview builder and the exported-code builder). Values from a `<select>`, a regex-validated field, or a `parseInt`-clamped numeric field do not need it (but it's harmless to add anyway, if in doubt).

### 6.2 The "Copy prompt / Copy code" architecture pattern

Nearly every driver script follows this shape:
- `buildFullPrompt(selectionInfo)` / `buildFullCode(selectionInfo)` - build the complete text for "ask about every option" mode, reading from a `selectionInfo` object (or, in older/simpler components, directly from module-level defaults).
- `buildComboPrompt(...)` / `buildComboCode(...)` - build the text for one fully-resolved combination (used by the "Copy" button inside a per-combination dropdown when more than one Size/Radius/etc. is multi-selected at once).
- `selectionMode(multiSelect, optionList, defaultValues)` - a shared helper that decides whether the user is in "ask the question" mode (nothing/everything selected) or "explicitly narrowed" mode (a subset picked), used to word the generated prompt text accordingly.
- `currentSelectionInfo()` - reads the live DOM state (all multiselects + all text inputs) into one `selectionInfo` object. **Every property the Properties panel exposes must be read here** - the content-sync bugs in §4.3 were all cases where a text input existed in the Properties panel but was never added to this function.
- `buildCopyControl(container, label, buildSingleFn, combos, buildComboFn)` - a shared UI helper that renders either a plain "Copy X" button (one combination) or a dropdown of per-combination "Copy" buttons (multiple combinations selected at once).

**When adding a new editable property to any component:** it must be threaded through *all five* of the above, or "Copy prompt"/"Copy code" will silently go stale the moment someone edits that new field - exactly the bug class found in §4.3.

### 6.3 The Component Guide pattern - apply this to any new detail page

Copy the HTML shape from §5.2, write unique Human View content grounded in that specific component's real behavior (not generic filler), write the matching Machine View JSON from §5.3, insert immediately before `</main>`. The shared CSS/JS from §5.4/§5.5 already exist site-wide - do not duplicate them per page.

### 6.4 General conventions observed throughout this codebase
- No em dashes (`—`) anywhere in written copy - use a hyphen with spaces (`" - "`) instead.
- Commit messages and PR descriptions end with the attribution footer currently configured for the session (check the live system instructions for the exact current wording - it has changed at least once already in this project's history).
- Never commit or push without an explicit user request, even after finishing a large batch of verified work.
- When copying a page to a scratch file for testing, copy it into the **same directory** as the original (not `/tmp`), because pages use relative `<link>`/`<script>` paths.

---

## 7. Outstanding work / how to continue

- **Nothing from Phase B or Phase C has been committed or pushed.** If asked to commit, stage `shell.css`, `shell.js`, all 42 modified `*-detail.js` files, and all 65 modified `*.html` detail pages; consider whether Phase B (security fix) and Phase C (documentation feature) should be two separate commits for a cleaner history, since they are semantically unrelated changes that happened to land in the same session.
- No components remain un-audited for Phase B - all 58 are done.
- No detail pages remain without a Component Guide for Phase C - all 65 are done.
- If new components are ever added to this design system, run them through both patterns in §6.1–§6.3 from day one, rather than retrofitting an audit later.
- Consider adding a lightweight regression test (even just the two Python verification scripts described in §4.4 and §5.7, checked into the repo as real scripts rather than session scratch files) so future edits to any driver script can be quickly re-verified without re-deriving the methodology from scratch.
