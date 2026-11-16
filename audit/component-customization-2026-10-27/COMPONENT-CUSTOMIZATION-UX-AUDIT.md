# Agentic Design System: component customization UX and usability audit

**Date:** 27 October 2026  
**Scope:** all 69 component detail pages, including all eight Button pages.  
**Deliverable:** atomic inventory, reproducible defects, component-specific missing controls, UX improvements and acceptance criteria.  
**Implementation status:** this is an audit and backlog. Proposed controls and export repairs have not been implemented by this audit.

## 1. Main finding

Every audited detail page has at least one customization property. The gap is **depth and task coverage**, not a complete absence of a Properties section. Many pages edit labels and visual presets while keeping data, current values, actions, validation and behavior fixed. A page with many comparison cells is not necessarily a component authoring tool.

Button is a useful comparison because it exposes several meaningful appearance/content dimensions. It is not a complete standard: its native detail surface still lacks important instance controls, and changing its label does not update the legacy copied code. Do not force every component to have the same number or kind of controls as Button.

The audit recorded **262 current properties**, **626 representative changes**, **369 proposed page-specific capabilities**, and **12 shared workflow improvements**. The page-specific count includes repeated Button-family recommendations across eight pages; it is not 369 unrelated new APIs.

There are **48 reproduced text-export omissions on 25 pages**. Separately, 92 change cases across 31 pages produced unchanged legacy code. The broader number is a review queue, not an assertion that every unchanged output is a defect.

## 2. Evidence and interpretation

The browser audit used fresh isolated storage, local Chromium, native input/change handlers, the application’s render delay, DOM/text/style snapshots, and intercepted clipboard writes. Every enumerated non-default option was exercised independently; text and numeric fields used representative values/bounds. Conditional Button accessible-label and Group Button fields were activated before checking them. Select all and duplicate unit-conversion controls are excluded from the property count.

The main Properties panels contain 261 fields. A separate whole-page scan found one additional configuration field, **Avatar.Group display**, in its own section; it was exercised separately and is included in the total. The 625 main-panel changes live in evidence.json; the additional Avatar.Group case lives in task-evidence.json. This existing selector is not mislabeled as missing.

The property pass is **not an exhaustive combinatorial interaction test**. It does not establish every keyboard pattern, every state combination, live service operation, Figma parity, assistive-technology support or all-theme visual fidelity. External fonts were blocked. Usability findings are evaluator observations and task walkthroughs, not measured participant success/time/error rates.

| Evidence | Result |
| --- | --- |
| Detail pages with some native customization | 69/69 |
| Current properties | 262 |
| Representative changes | 626 |
| Changed prompt outputs | 626 |
| Changed preview DOM cases | 622 |
| Unchanged legacy code cases | 92 |
| Native reload probes retained | 0/66 |
| Layout checks | 207 checks at 1440/390/320 px; 0 document/main overflow findings |
| Shared multiselect keyboard smoke | 50 pass; 19 pages without this control |
| Runtime errors | 0 |

Interpretation: a changed DOM does not alone prove meaningful visual or behavioral correctness. An unchanged DOM can be legitimate: raising Badge max count from 99 to 100 while the current count is 5 does not change its displayed value. Notification placement changes the specification but the inline matrix is not a screen-edge placement demo. These four no-DOM-change cases are not classified as inert controls.

**Native detail reload results are not a claim that the whole application lacks saving.** All 69 pages offer the separate Component Contract Editor, which has saved contracts/drafts/revisions. The tested native detail configurations reset on reload and do not automatically consume those saved contracts.

Useful files: [complete browser evidence](evidence.json), [concrete task evidence](task-evidence.json), [machine-readable atomic backlog](atomic-backlog.json), [current-control CSV](CONTROL-INVENTORY.csv), [capability-backlog CSV](ATOMIC-CUSTOMIZATION-BACKLOG.csv), [individual test-case CSV](PROPERTY-TEST-CASES.csv), [confirmed export defects CSV](CONFIRMED-EXPORT-DEFECTS.csv), [source hashes](source-manifest.json).

## 3. Priority and finding types

- **Confirmed defect:** an existing promised configuration is demonstrably lost or inconsistent. Reproduction and expected behavior are listed.
- **Capability gap:** no dedicated native detail field supports a relevant authoring task. Proposed API/control design requires implementation review. This is not automatically a standards violation.
- **Matrix-only coverage:** a type/state is shown in documentation but is not selectable as a single configured instance. It is not “missing from the library.”
- **Inherited Foundation setting:** a global design choice already exists. Prefer explicit inheritance/local token overrides to duplicating arbitrary color/font controls everywhere.
- **Advanced-editor route:** anatomy/JSON authoring exists outside the simple panel. It is a workaround, not evidence of a discoverable dedicated field or complete behavior implementation.

**P1:** repair export mismatch or add core task authoring. **P2:** advanced/context-dependent authoring or workflow improvement; validate demand before increasing the panel. No outage or unsupported “critical” risk is invented to label all feature requests P0.

## 4. Concrete task walkthroughs

### button-primary.html — Change label and copy matching code

Set `button-label` to **Publish product**. Preview contains it: **True**. Prompt contains it: **True**. Legacy code contains it: **False**.

Expected: the generated configured instance retains this text, or exposes a complete explicit value assignment. Current code does not match this chosen content.

### add-on-default.html — Change label and copy matching code

Set `addon-label` to **Company domain**. Preview contains it: **True**. Prompt contains it: **True**. Legacy code contains it: **False**.

Expected: the generated configured instance retains this text, or exposes a complete explicit value assignment. Current code does not match this chosen content.

### input-text-field.html — Change label and copy matching code

Set `input-label` to **Work email**. Preview contains it: **True**. Prompt contains it: **True**. Legacy code contains it: **False**.

Expected: the generated configured instance retains this text, or exposes a complete explicit value assignment. Current code does not match this chosen content.

### calendar-default.html — Configure a different real month

Observed evidence:

```json
{
  "header": "February 2028",
  "firstDate": "Sunday, August 30, 2026",
  "days": 252,
  "contains2028Date": false
}
```

### select-dropdown.html — Replace example countries with product options

Observed evidence:

```json
{
  "controls": [
    {
      "role": "select-size-mount",
      "type": "multiselect"
    },
    {
      "role": "select-radius-mount",
      "type": "multiselect"
    },
    {
      "role": "select-label",
      "type": "text"
    },
    {
      "role": "select-placeholder",
      "type": "text"
    },
    {
      "role": "select-allow-clear",
      "type": "checkbox"
    }
  ],
  "matchingConfigurationControls": [],
  "fileInputs": 0
}
```

### table-default.html — Author columns and rows for a real dataset

Observed evidence:

```json
{
  "controls": [
    {
      "role": "table-radius-mount",
      "type": "multiselect"
    },
    {
      "role": "table-size-mount",
      "type": "multiselect"
    },
    {
      "role": "table-show-header",
      "type": "checkbox"
    }
  ],
  "matchingConfigurationControls": [],
  "fileInputs": 0
}
```

### upload-default.html — Configure enforceable file acceptance

Observed evidence:

```json
{
  "controls": [
    {
      "role": "upload-label",
      "type": "text"
    },
    {
      "role": "upload-helper",
      "type": "text"
    }
  ],
  "matchingConfigurationControls": [],
  "fileInputs": 0
}
```

Calendar’s “Month label” is currently literal display copy. Changing it to February 2028 leaves day labels in August/September/October 2026. This is a serious task-expectation gap if users believe they are configuring a real calendar month. Either add a real date model or clearly label the field/example as a static-caption-only specimen.

Upload’s helper text describes a size/type policy, but no native policy authoring or file-picker interaction exists in that detail specimen. Editable helper copy is not enforceable validation. Table’s selection/sort/filter documentation likewise does not create a column, dataset or behavior editor.

## 5. Shared workflow improvements

### FLOW-01 · P1 · Save and reopen a configured component

**Area:** Native detail-panel workflow. **Observed:** No tested native detail configuration survived reload; a separate contract editor exists.

**Change:** Offer Save/Edit/Cancel around a canonical component contract. Returning to the detail page must render the saved revision, not silently restore the sample.

**Acceptance:** Save a label and a non-text property, reload, reopen, edit, cancel, and verify both the preview and copied outputs.

### FLOW-02 · P1 · One configuration across preview, prompt and code

**Area:** Export parity. **Observed:** Several controls update the preview and prompt while legacy copied code remains unchanged.

**Change:** Generate all outputs from the same selected contract/revision. Preserve explicit false, empty, numeric and selected values.

**Acceptance:** For every public property, change one value and compare preview, contract, prompt and executable example.

### FLOW-03 · P1 · Choose one instance versus comparing many states

**Area:** Preview task flow. **Observed:** Most pages show fixed type/state matrices; four pages also have dedicated interactive mounts.

**Change:** Separate Configure one instance from Compare states. Keep existing matrices available as documentation.

**Acceptance:** Choose one type/state, interact with it, then return to comparison without losing the chosen properties.

### FLOW-04 · P1 · Reset/undo with clear saved versus unsaved status

**Area:** Editing recovery. **Observed:** Native Properties actions are primarily copy/export and an advanced-editor link.

**Change:** Provide Reset to library/Foundations and undo for the current draft. Explain whether reset affects only the component.

**Acceptance:** Reset one component draft, cancel, and confirm the previous saved component and global Foundations are intact.

### FLOW-05 · P1 · Expose content/data, not just appearance

**Area:** Information architecture. **Observed:** Complex data-driven components often expose only size/radius/labels.

**Change:** Group controls into Content & data, Appearance, State & behavior, Accessibility, and Advanced. Include only relevant groups.

**Acceptance:** Complete the component-specific tasks below using the simple authoring surface without editing source or raw JSON.

### FLOW-06 · P1 · Explain Foundation inheritance and local overrides

**Area:** Token policy. **Observed:** Foundation editors and local presets both exist; inherited versus explicit intent is not consistently presented as a choice.

**Change:** Show inherited token/value and an explicit local-override action. Keep local overrides distinct from global Foundation edits.

**Acceptance:** Change a Foundation, confirm inherited components update and explicit local choices remain stable.

### FLOW-07 · P1 · Keep dependencies and invalid values understandable

**Area:** Field usability. **Observed:** Conditional fields exist and several fields normalize/fall back, but there is no consistent authoring validation summary.

**Change:** Reveal dependent fields near their trigger, explain requirements, and retain the last valid preview while invalid input is corrected.

**Acceptance:** Exercise blank, false, zero, invalid, long, Unicode and dependency-toggle cases and inspect export eligibility.

### FLOW-08 · P2 · Maintain property-to-preview proximity

**Area:** Responsive layout. **Observed:** A non-overflowing page can still place the preview far below the property controls.

**Change:** Use an accessible responsive inspector/stage layout or compact sticky actions; preserve a usable matrix scroll region.

**Acceptance:** At 320/390 px and zoom, change a field and find the changed specimen without losing the inspector or keyboard focus.

### FLOW-09 · P2 · Bound comparison expansion

**Area:** Scale and orientation. **Observed:** Multiselect dimensions can generate a large Cartesian product of examples.

**Change:** Display the combination count, provide a clear single-instance mode and warn or cap expensive expansions.

**Acceptance:** Exercise a documented upper bound and verify keyboard operation, response time, copy-menu clarity and recovery.

### FLOW-10 · P2 · Share the configured state

**Area:** Collaboration. **Observed:** A plain page URL identifies the guide, not necessarily the configured instance.

**Change:** Consider a versioned configuration link or explicit JSON contract attachment with a reviewed privacy boundary.

**Acceptance:** Open the shared state in a clean context and verify the exact values, version and missing assets are reported.

### FLOW-11 · P1 · Distinguish documentation from executable behavior

**Area:** Expectation setting. **Observed:** Static states and four dedicated interaction mounts coexist with copyable implementation material.

**Change:** Label static specimens and provide appropriate interaction demos for keyboard, selection, validation and overlays.

**Acceptance:** Test the actual interaction specified for the component, not only the presence of a row named Focused or Error.

### FLOW-12 · P2 · Make advanced contract editing a coherent continuation

**Area:** Progressive disclosure. **Observed:** All 69 pages expose Edit component contract, but that is a separate authoring surface.

**Change:** Open the same configuration in the editor, preserve stable IDs, and return the saved result to the originating detail view.

**Acceptance:** Edit a property in the advanced editor, save, return, and confirm the native detail preview/exports use that revision.

## 6. Components to optimize: complete 69-page list

Every row has detailed atomic proposals later. The proposal count measures backlog entries, not a validated usability score. “Dedicated interaction mount” records explicit sandbox markup; absence does not prove every descendant element is non-interactive.

| Component / detail page | Current properties | Fixed type/state columns and rows | Proposed capabilities | Dedicated interaction mount |
| --- | --- | --- | --- | --- |
| [Add-on](../../add-on-default.html) | 9 | 3 types / 6 states | 5 | None found |
| [Affix](../../affix-default.html) | 2 | 2 types / 3 states | 4 | affix-interactive |
| [Alert](../../alert-default.html) | 4 | 4 types / 4 states | 5 | None found |
| [Anchor](../../anchor-default.html) | 2 | 2 types / 5 states | 4 | None found |
| [Autocomplete](../../autocomplete-default.html) | 5 | 2 types / 6 states | 5 | None found |
| [Avatar](../../avatar-default.html) | 4 | 3 types / 4 states | 5 | None found |
| [Badge](../../badge-default.html) | 4 | 3 types / 5 states | 5 | None found |
| [Breadcrumb](../../breadcrumb-default.html) | 2 | 2 types / 4 states | 4 | None found |
| [Destructive Button](../../button-destructive.html) | 5 | 8 types / 6 states | 5 | None found |
| [Ghost Button](../../button-ghost.html) | 5 | 8 types / 6 states | 5 | None found |
| [Link Button](../../button-link.html) | 5 | 8 types / 6 states | 5 | None found |
| [Neutral Button](../../button-neutral.html) | 5 | 8 types / 6 states | 5 | None found |
| [Primary Button 36px - Dual Icon](../../button-primary-icon.html) | 5 | 8 types / 6 states | 5 | None found |
| [Primary Button](../../button-primary.html) | 5 | 8 types / 6 states | 5 | None found |
| [Secondary Button](../../button-secondary.html) | 5 | 8 types / 6 states | 5 | None found |
| [Tertiary Button](../../button-tertiary.html) | 5 | 8 types / 6 states | 5 | None found |
| [Calendar](../../calendar-default.html) | 2 | 2 types / 3 states | 6 | None found |
| [Card](../../card-default.html) | 5 | 3 types / 5 states | 5 | None found |
| [Cascader](../../cascader-default.html) | 5 | 2 types / 6 states | 5 | None found |
| [Checkbox](../../checkbox-default.html) | 3 | 2 types / 6 states | 5 | None found |
| [Collapse](../../collapse-default.html) | 5 | 2 types / 3 states | 5 | None found |
| [Color Picker](../../color-picker-default.html) | 5 | 2 types / 6 states | 5 | None found |
| [Date Picker](../../date-picker-default.html) | 5 | 2 types / 6 states | 6 | None found |
| [Date Range](../../date-range-default.html) | 6 | 2 types / 6 states | 6 | None found |
| [Description](../../description-default.html) | 3 | 2 types / 3 states | 5 | None found |
| [Divider](../../divider-default.html) | 3 | 2 types / 3 states | 4 | None found |
| [Drawer](../../drawer-default.html) | 5 | 4 types / 3 states | 6 | None found |
| [Dropdown](../../dropdown-default.html) | 3 | 2 types / 5 states | 5 | dropdown-interactive-mount, dropdown-interactive-status |
| [Empty](../../empty-default.html) | 3 | 2 types / 3 states | 4 | None found |
| [Float Button](../../float-button-default.html) | 3 | 3 types / 4 states | 5 | None found |
| [Group Button](../../group-button-default.html) | 7 | 2 types / 6 states | 5 | None found |
| [Image](../../image-default.html) | 3 | 2 types / 4 states | 6 | None found |
| [Input Text Field](../../input-text-field.html) | 7 | 3 types / 6 states | 6 | None found |
| [List](../../list-default.html) | 3 | 2 types / 4 states | 5 | None found |
| [Mention](../../mention-default.html) | 5 | 2 types / 6 states | 5 | None found |
| [Menu](../../menu-default.html) | 3 | 2 types / 4 states | 5 | None found |
| [Modal](../../modal-default.html) | 5 | 2 types / 4 states | 6 | None found |
| [Notification](../../notification-default.html) | 3 | 4 types / 3 states | 5 | None found |
| [Number](../../number-default.html) | 6 | 3 types / 6 states | 6 | None found |
| [Pagination](../../pagination-default.html) | 2 | 2 types / 4 states | 5 | None found |
| [Password](../../password-default.html) | 6 | 3 types / 6 states | 5 | None found |
| [Pop Confirm](../../pop-confirm-default.html) | 3 | 4 types / 3 states | 5 | None found |
| [Popover](../../popover-default.html) | 3 | 4 types / 3 states | 5 | None found |
| [Progress](../../progress-default.html) | 2 | 2 types / 3 states | 5 | None found |
| [Radio](../../radio-default.html) | 2 | 2 types / 5 states | 5 | None found |
| [Rating](../../rating-default.html) | 3 | 2 types / 4 states | 5 | None found |
| [Result](../../result-default.html) | 2 | 4 types / 3 states | 5 | None found |
| [Search](../../search-default.html) | 5 | 3 types / 6 states | 5 | None found |
| [Select](../../select-dropdown.html) | 5 | 4 types / 8 states | 6 | None found |
| [Skeleton](../../skeleton-default.html) | 1 | 3 types / 2 states | 5 | None found |
| [Slider](../../slider-default.html) | 3 | 2 types / 4 states | 6 | None found |
| [Spin](../../spin-default.html) | 1 | 3 types / 3 states | 5 | None found |
| [Splitter](../../splitter-default.html) | 3 | 2 types / 3 states | 6 | splitter-interactive |
| [Statistic](../../statistic-default.html) | 4 | 3 types / 4 states | 5 | None found |
| [Steps](../../steps-default.html) | 4 | 1 types / 5 states | 5 | None found |
| [Switch](../../switch-default.html) | 2 | 2 types / 6 states | 5 | None found |
| [Table](../../table-default.html) | 3 | 54 types / 5 states | 13 | None found |
| [Tabs](../../tabs-default.html) | 3 | 2 types / 4 states | 6 | None found |
| [Tag](../../tag-default.html) | 2 | 4 types / 3 states | 5 | None found |
| [Text Area](../../text-area-default.html) | 5 | 3 types / 6 states | 6 | None found |
| [Time](../../time-default.html) | 5 | 2 types / 6 states | 6 | None found |
| [Timeline](../../timeline-default.html) | 1 | 3 types / 3 states | 5 | None found |
| [Toast](../../toast-default.html) | 4 | 4 types / 4 states | 5 | None found |
| [Tooltip](../../tooltip-default.html) | 3 | 4 types / 3 states | 5 | None found |
| [Tour](../../tour-default.html) | 3 | 4 types / 3 states | 6 | None found |
| [Transfer](../../transfer-default.html) | 3 | 2 types / 4 states | 6 | None found |
| [Tree](../../tree-default.html) | 2 | 3 types / 4 states | 6 | tree-interactive |
| [Tree Select](../../tree-select-default.html) | 5 | 2 types / 6 states | 6 | None found |
| [Upload](../../upload-default.html) | 2 | 2 types / 4 states | 8 | None found |

### Recommended implementation order

1. Repair confirmed current-value export mismatches, beginning with the shared Button and form-family builders. Add a parity check for every exposed property before adding more controls.
2. Build a shared content/data editor primitive. Start with Select, Table, Tree/Tree Select, Cascader, List, Transfer and Calendar/Upload fixtures.
3. Add current value and semantic validation controls to form components: selected values, bounds, steps, required/error/help, read-only/disabled and loading where relevant.
4. Add configurable actions and real interaction specimens to Modal, Drawer, Popover/Pop Confirm, feedback, navigation and tours.
5. Connect native Properties, the saved contract and all outputs. Then improve single-instance/comparison mode, responsive proximity and collaboration.

### Button comparison — use the pattern, not the raw field count

Ordinary Button pages expose Size (8 choices), Content (5), Corner radius (5), Button label, and a conditional icon-only accessible label. The matrix shows eight types and six states. Selecting all three dimensions can theoretically create 200 combinations and 9,600 cells; that is a calculation, not a performance measurement. Other components need their own task properties: Table needs columns/rows, Upload needs file policies, Calendar needs actual dates, and Select needs options and selected values.

## 7. Confirmed current-text export defects

Each row below uses a unique audit text. It changes the preview and prompt, while the copied legacy code remains identical after normalizing timestamps. Therefore the new text is not serialized in that copied code. The three concrete label tasks above independently confirm this with real field fill and exact text lookup. These defects are recorded, not repaired by this audit.

| Finding | Page | Property | Reproduce / evidence case |
| --- | --- | --- | --- |
| DEF-01-03 | add-on-default.html | Label | Set Label to 'Audit Add-on Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-01-03-T01 |
| DEF-01-04 | add-on-default.html | Placeholder | Set Placeholder to 'Audit Add-on Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-01-04-T01 |
| DEF-01-06 | add-on-default.html | Prefix text | Set Prefix text to 'Audit Add-on Prefix text'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-01-06-T01 |
| DEF-01-08 | add-on-default.html | Suffix text | Set Suffix text to 'Audit Add-on Suffix text'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-01-08-T01 |
| DEF-05-03 | autocomplete-default.html | Label | Set Label to 'Audit Autocomplete Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-05-03-T01 |
| DEF-05-04 | autocomplete-default.html | Placeholder | Set Placeholder to 'Audit Autocomplete Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-05-04-T01 |
| DEF-09-04 | button-destructive.html | Button label | Set Button label to 'Audit Destructive Button Button label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-09-04-T01 |
| DEF-09-05 | button-destructive.html | Accessible label (required for icon-only) | Set Accessible label (required for icon-only) to 'Audit Destructive Button Accessible label (required for icon-only)'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-09-05-T01 |
| DEF-10-04 | button-ghost.html | Button label | Set Button label to 'Audit Ghost Button Button label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-10-04-T01 |
| DEF-10-05 | button-ghost.html | Accessible label (required for icon-only) | Set Accessible label (required for icon-only) to 'Audit Ghost Button Accessible label (required for icon-only)'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-10-05-T01 |
| DEF-11-04 | button-link.html | Button label | Set Button label to 'Audit Link Button Button label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-11-04-T01 |
| DEF-11-05 | button-link.html | Accessible label (required for icon-only) | Set Accessible label (required for icon-only) to 'Audit Link Button Accessible label (required for icon-only)'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-11-05-T01 |
| DEF-12-04 | button-neutral.html | Button label | Set Button label to 'Audit Neutral Button Button label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-12-04-T01 |
| DEF-12-05 | button-neutral.html | Accessible label (required for icon-only) | Set Accessible label (required for icon-only) to 'Audit Neutral Button Accessible label (required for icon-only)'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-12-05-T01 |
| DEF-13-04 | button-primary-icon.html | Label | Set Label to 'Audit Primary Button 36px - Dual Icon Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-13-04-T01 |
| DEF-14-04 | button-primary.html | Button label | Set Button label to 'Audit Primary Button Button label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-14-04-T01 |
| DEF-14-05 | button-primary.html | Accessible label (required for icon-only) | Set Accessible label (required for icon-only) to 'Audit Primary Button Accessible label (required for icon-only)'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-14-05-T01 |
| DEF-15-04 | button-secondary.html | Button label | Set Button label to 'Audit Secondary Button Button label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-15-04-T01 |
| DEF-15-05 | button-secondary.html | Accessible label (required for icon-only) | Set Accessible label (required for icon-only) to 'Audit Secondary Button Accessible label (required for icon-only)'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-15-05-T01 |
| DEF-16-04 | button-tertiary.html | Button label | Set Button label to 'Audit Tertiary Button Button label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-16-04-T01 |
| DEF-16-05 | button-tertiary.html | Accessible label (required for icon-only) | Set Accessible label (required for icon-only) to 'Audit Tertiary Button Accessible label (required for icon-only)'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-16-05-T01 |
| DEF-19-03 | cascader-default.html | Label | Set Label to 'Audit Cascader Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-19-03-T01 |
| DEF-19-04 | cascader-default.html | Placeholder | Set Placeholder to 'Audit Cascader Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-19-04-T01 |
| DEF-20-03 | checkbox-default.html | Label | Set Label to 'Audit Checkbox Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-20-03-T01 |
| DEF-23-03 | date-picker-default.html | Label | Set Label to 'Audit Date Picker Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-23-03-T01 |
| DEF-23-04 | date-picker-default.html | Placeholder | Set Placeholder to 'Audit Date Picker Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-23-04-T01 |
| DEF-24-03 | date-range-default.html | Label | Set Label to 'Audit Date Range Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-24-03-T01 |
| DEF-24-04 | date-range-default.html | Start placeholder | Set Start placeholder to 'Audit Date Range Start placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-24-04-T01 |
| DEF-24-05 | date-range-default.html | End placeholder | Set End placeholder to 'Audit Date Range End placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-24-05-T01 |
| DEF-33-03 | input-text-field.html | Label | Set Label to 'Audit Input Text Field Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-33-03-T01 |
| DEF-33-04 | input-text-field.html | Placeholder | Set Placeholder to 'Audit Input Text Field Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-33-04-T01 |
| DEF-35-03 | mention-default.html | Label | Set Label to 'Audit Mention Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-35-03-T01 |
| DEF-35-04 | mention-default.html | Placeholder | Set Placeholder to 'Audit Mention Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-35-04-T01 |
| DEF-39-03 | number-default.html | Label | Set Label to 'Audit Number Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-39-03-T01 |
| DEF-39-04 | number-default.html | Placeholder | Set Placeholder to 'Audit Number Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-39-04-T01 |
| DEF-41-03 | password-default.html | Label | Set Label to 'Audit Password Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-41-03-T01 |
| DEF-41-04 | password-default.html | Placeholder | Set Placeholder to 'Audit Password Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-41-04-T01 |
| DEF-45-02 | radio-default.html | Label | Set Label to 'Audit Radio Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-45-02-T01 |
| DEF-48-03 | search-default.html | Placeholder | Set Placeholder to 'Audit Search Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-48-03-T01 |
| DEF-49-03 | select-dropdown.html | Label | Set Label to 'Audit Select Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-49-03-T01 |
| DEF-49-04 | select-dropdown.html | Placeholder | Set Placeholder to 'Audit Select Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-49-04-T01 |
| DEF-56-02 | switch-default.html | Label | Set Label to 'Audit Switch Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-56-02-T01 |
| DEF-60-03 | text-area-default.html | Label | Set Label to 'Audit Text Area Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-60-03-T01 |
| DEF-60-04 | text-area-default.html | Placeholder | Set Placeholder to 'Audit Text Area Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-60-04-T01 |
| DEF-61-03 | time-default.html | Label | Set Label to 'Audit Time Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-61-03-T01 |
| DEF-61-04 | time-default.html | Placeholder | Set Placeholder to 'Audit Time Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-61-04-T01 |
| DEF-68-03 | tree-select-default.html | Label | Set Label to 'Audit Tree Select Label'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-68-03-T01 |
| DEF-68-04 | tree-select-default.html | Placeholder | Set Placeholder to 'Audit Tree Select Placeholder'; wait for render; compare preview, Copy prompt and Copy code. / CTRL-68-04-T01 |

Other unchanged-code cases, including Boolean switches, placement, numeric values and count/row controls, are enumerated per component below and in the test CSV. Some require an interactive or non-Rest example to demonstrate the configured effect. Do not blindly turn each one into an identical “broken control” bug.

## 8. Atomic component specifications and proposed improvements

For each component: first review what actually exists, then the missing native-panel capabilities. Proposed defaults preserve current examples unless stated otherwise; they are suggestions, not already supported APIs. State/type coverage listed in the matrix does not equal editable data or behavior.

### 01. Add-on — add-on-default.html

**Entry:** [add-on-default.html](../../add-on-default.html). **Category:** Components · Forms · Add-on. **Native properties:** 9. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [add-on-detail.js](../../add-on-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-01-01 | Size | addon-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-01-02 | Corner radius | addon-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-01-03 | Label | addon-label | text | Website | Free value / toggle | Available by default |
| CTRL-01-04 | Placeholder | addon-placeholder | text | yourcompany | Free value / toggle | Available by default |
| CTRL-01-05 | Show prefix | addon-show-prefix | checkbox | true | Free value / toggle | Available by default |
| CTRL-01-06 | Prefix text | addon-prefix-text | text | https:// | Free value / toggle | Available by default |
| CTRL-01-07 | Show suffix | addon-show-suffix | checkbox | true | Free value / toggle | Available by default |
| CTRL-01-08 | Suffix text | addon-suffix-text | text | .com | Free value / toggle | Available by default |
| CTRL-01-09 | Allow clear | addon-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show prefix:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.
- **Prefix text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show suffix:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.
- **Suffix text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled, Underlined; states: Rest, Hover, Focused, Filled, Error, Disabled. Default rendered cells: 18. Dedicated interaction markup: none found.

**Property-change evidence:** 18 cases; 18 changed preview DOM; 18 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Show prefix, Prefix text, Show suffix, Suffix text, Allow clear.

**Reload probe:** changed Label to `Reload audit Add-on`; after reload observed `Website`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 1129 px; Live Preview top 1694 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-add-on-default-input-value · P1 · Input value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** Empty.
- **Validation / dependencies:** Preserve text independently from placeholder and prefix/suffix
- **Preview acceptance:** Entered value appears between the add-ons and survives clear/reset correctly
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-add-on-default-input-type · P1 · Input type

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Text.
- **Validation / dependencies:** Allow supported native types with compatible validation
- **Preview acceptance:** Email, URL and numeric intent produce appropriate semantics and input behavior
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-add-on-default-prefix-content-kind · P2 · Prefix content kind

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and slot. **Proposed default:** Text.
- **Validation / dependencies:** Text or named icon or approved component slot
- **Preview acceptance:** Prefix can be a non-text reusable part without editing source
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-add-on-default-suffix-content-kind · P2 · Suffix content kind

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and slot. **Proposed default:** Text.
- **Validation / dependencies:** Text or named icon or approved component slot
- **Preview acceptance:** Suffix can be configured independently from the prefix
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-add-on-default-required-and-error-rules · P1 · Required and error rules

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and linked text. **Proposed default:** Optional with no error.
- **Validation / dependencies:** Error text required when invalid and associated with the field
- **Preview acceptance:** Required/error configuration changes labels, semantics and relevant preview states
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [add-on-default.json](pages/add-on-default.json).

### 02. Affix — affix-default.html

**Entry:** [affix-default.html](../../affix-default.html). **Category:** Components · Navigation · Affix. **Native properties:** 2. **Proposed atomic capabilities:** 4.

**Source:** Properties begins at HTML line 177; detail implementation: [affix-detail.js](../../affix-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-02-01 | Content label | affix-label | text | Filter toolbar | Free value / toggle | Available by default |
| CTRL-02-02 | Offset (px) | affix-offset | number | 8 | Free value / toggle | min=0, max=None, step=None |

**Existing-control usability improvements:**

- **Content label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Offset (px):** Declare units and semantic bounds, distinguish zero from empty, and show normalization/validation feedback. Do not add an arbitrary product limit without a reason.

**Preview coverage:** Top, Bottom; states: Rest, Affixed, Disabled. Default rendered cells: 6. Dedicated interaction markup: affix-interactive.

**Property-change evidence:** 3 cases; 3 changed preview DOM; 3 changed prompt; 1 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Offset (px).

**Reload probe:** changed Content label to `Reload audit Affix`; after reload observed `Filter toolbar`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 589 px; Live Preview top 1179 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-affix-default-affix-edge · P1 · Affix edge

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Top.
- **Validation / dependencies:** Top or bottom, using logical placement where appropriate
- **Preview acceptance:** A single test specimen pins to the selected edge
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-affix-default-scroll-container · P1 · Scroll container

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** container picker. **Proposed default:** Preview sandbox.
- **Validation / dependencies:** Target must exist and be scrollable
- **Preview acceptance:** Demonstrate pinning within the chosen scroll region rather than only a static state
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-affix-default-affixed-content · P1 · Affixed content

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** slot editor. **Proposed default:** Current toolbar.
- **Validation / dependencies:** Preserve reading order and focusable descendants
- **Preview acceptance:** Replace the toolbar with the intended action or navigation component
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-affix-default-stacking-layer · P2 · Stacking layer

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** token picker. **Proposed default:** Existing overlay layer.
- **Validation / dependencies:** Use a named layer and avoid covering focused content
- **Preview acceptance:** Pinned element resolves correctly beside headers and overlays
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [affix-default.json](pages/affix-default.json).

### 03. Alert — alert-default.html

**Entry:** [alert-default.html](../../alert-default.html). **Category:** Components · Feedback · Alert. **Native properties:** 4. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [alert-detail.js](../../alert-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-03-01 | Corner radius | alert-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-03-02 | Title | alert-title | text | Update available | Free value / toggle | Available by default |
| CTRL-03-03 | Description | alert-description | text | A new version is ready to install. | Free value / toggle | Available by default |
| CTRL-03-04 | Show icon | alert-show-icon | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Description:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show icon:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Info, Success, Warning, Error; states: Default, Dismissible, With action, Title only. Default rendered cells: 16. Dedicated interaction markup: none found.

**Property-change evidence:** 7 cases; 7 changed preview DOM; 7 changed prompt; 7 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Title to `Reload audit Alert`; after reload observed `Update available`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 692 px; Live Preview top 1282 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-alert-default-severity · P1 · Severity

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current example severity.
- **Validation / dependencies:** Choose supported severity and retain a non-color cue
- **Preview acceptance:** Inspect one chosen severity instead of only a fixed comparison matrix
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-alert-default-closable · P1 · Closable

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Dismiss action needs an accessible name
- **Preview acceptance:** Preview dismisses and restores predictably
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-alert-default-action-label · P1 · Action label

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** No action.
- **Validation / dependencies:** Nonempty when an action is enabled
- **Preview acceptance:** Optional inline action uses user-authored text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-alert-default-icon-reference · P2 · Icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Current severity icon.
- **Validation / dependencies:** Icon must agree with severity or be explicitly decorative
- **Preview acceptance:** Swap the icon without replacing the severity message
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-alert-default-live-announcement-policy · P1 · Live announcement policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Informational policy appropriate to context.
- **Validation / dependencies:** Avoid forcing assertive announcements for routine updates
- **Preview acceptance:** Export explicit role/live behavior with a focused interaction example
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [alert-default.json](pages/alert-default.json).

### 04. Anchor — anchor-default.html

**Entry:** [anchor-default.html](../../anchor-default.html). **Category:** Components · Navigation · Anchor. **Native properties:** 2. **Proposed atomic capabilities:** 4.

**Source:** Properties begins at HTML line 177; detail implementation: [anchor-detail.js](../../anchor-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-04-01 | Size | anchor-size-mount | multiselect | ["14"] | 12px - XS = 12; 14px - S = 14; 16px - M = 16; 18px - L = 18 | Available by default |
| CTRL-04-02 | Label | anchor-label | text | Learn more | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Standalone, With icon; states: Rest, Hover, Focused, Visited, Disabled. Default rendered cells: 10. Dedicated interaction markup: none found.

**Property-change evidence:** 4 cases; 4 changed preview DOM; 4 changed prompt; 4 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Label to `Reload audit Anchor`; after reload observed `Learn more`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 495 px; Live Preview top 1085 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-anchor-default-destination-url · P1 · Destination URL

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** URL or fragment field. **Proposed default:** Current example destination.
- **Validation / dependencies:** Validate allowed schemes and require an existing fragment in the sandbox
- **Preview acceptance:** Link navigates to the authored destination rather than only changing its label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-anchor-default-open-in-new-tab · P1 · Open in new tab

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Explain the new context and add appropriate rel metadata
- **Preview acceptance:** Export target and rel consistently
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-anchor-default-underline-policy · P2 · Underline policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current Foundation treatment.
- **Validation / dependencies:** Links remain distinguishable without relying only on color
- **Preview acceptance:** Preview default, hover and focus treatment together
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-anchor-default-current-page-state · P1 · Current-page state

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Apply aria-current only to the actual current destination
- **Preview acceptance:** Selected navigation semantics appear in preview/export
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [anchor-default.json](pages/anchor-default.json).

### 05. Autocomplete — autocomplete-default.html

**Entry:** [autocomplete-default.html](../../autocomplete-default.html). **Category:** Components · Forms · Autocomplete. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [autocomplete-detail.js](../../autocomplete-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-05-01 | Size | autocomplete-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-05-02 | Corner radius | autocomplete-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-05-03 | Label | autocomplete-label | text | City | Free value / toggle | Available by default |
| CTRL-05-04 | Placeholder | autocomplete-placeholder | text | Search a city... | Free value / toggle | Available by default |
| CTRL-05-05 | Allow clear | autocomplete-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled; states: Rest, Hover, Focus, Open, Filled, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 14 cases; 14 changed preview DOM; 14 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Allow clear.

**Reload probe:** changed Label to `Reload audit Autocomplete`; after reload observed `City`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 783 px; Live Preview top 1348 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-autocomplete-default-suggestion-data · P1 · Suggestion data

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable option list. **Proposed default:** Current example cities.
- **Validation / dependencies:** Stable unique IDs, label and value for every item
- **Preview acceptance:** Authored suggestions populate the open panel and copied outputs
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-autocomplete-default-input-value · P1 · Input value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** Empty.
- **Validation / dependencies:** Keep entered value independent from selected option
- **Preview acceptance:** Selected and freely typed values are represented distinctly
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-autocomplete-default-minimum-query-length · P1 · Minimum query length

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** Zero.
- **Validation / dependencies:** Nonnegative integer with an explained trigger
- **Preview acceptance:** Suggestions appear only after the configured number of characters
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-autocomplete-default-filter-mode · P2 · Filter mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Client-side text match.
- **Validation / dependencies:** Choose local filtering or declared remote results without claiming a live service
- **Preview acceptance:** Query changes update visible suggestions consistently
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-autocomplete-default-no-results-message · P1 · No-results message

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** No matches.
- **Validation / dependencies:** Distinguish no results from loading and failure
- **Preview acceptance:** Unmatched queries display the authored empty message
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [autocomplete-default.json](pages/autocomplete-default.json).

### 06. Avatar — avatar-default.html

**Entry:** [avatar-default.html](../../avatar-default.html). **Category:** Components · Data Display · Avatar. **Native properties:** 4. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [avatar-detail.js](../../avatar-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-06-01 | Size | avatar-size-select | select | 32 | 24px - Small = 24; 32px - Default = 32; 40px - Large = 40; 48px - XL = 48 | Available by default |
| CTRL-06-02 | Shape | avatar-shape-select | select | circle | Circle = circle; Square = square | Available by default |
| CTRL-06-03 | Initials | avatar-initials | text | JD | Free value / toggle | Available by default |
| CTRL-06-04 | Avatar.Group display | avatar-group-view-select | select | avatars | Avatars = avatars; Names only = names | Available by default |

**Existing controls outside Properties:** Avatar.Group display in Avatar.Group. These are included above, not counted as missing.

**Existing-control usability improvements:**

- **Size:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.
- **Shape:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.
- **Initials:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Avatar.Group display:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.

**Preview coverage:** Initials, Icon, Image; states: Default, Online, Away, Offline. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 6 cases; 6 changed preview DOM; 6 changed prompt; 5 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Avatar.Group display.

**Reload probe:** changed Initials to `Reload audit Avatar`; after reload observed `JD`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 610 px; Live Preview top 1199 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-avatar-default-image-source · P1 · Image source

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** URL or image asset picker. **Proposed default:** Current placeholder.
- **Validation / dependencies:** Accept supported image types and provide a load-failure route
- **Preview acceptance:** A real chosen image replaces the placeholder
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-avatar-default-alternative-text-and-decoration · P1 · Alternative text and decoration

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Context-dependent.
- **Validation / dependencies:** Require an accessible name for informative avatars and empty alt for decorative images
- **Preview acceptance:** Correct accessible image treatment survives export
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-avatar-default-fallback-content · P1 · Fallback content

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and text. **Proposed default:** Existing initials.
- **Validation / dependencies:** Preserve initials when the image is missing or fails
- **Preview acceptance:** Failed image loading switches to the intended fallback
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-avatar-default-group-items · P1 · Group items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable people list. **Proposed default:** Current demonstration people.
- **Validation / dependencies:** Each item needs stable ID and appropriate name/image data
- **Preview acceptance:** Group contents and accessible names are authorable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-avatar-default-group-overflow-limit · P2 · Group overflow limit

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** Current example count.
- **Validation / dependencies:** Positive integer and a meaningful overflow label
- **Preview acceptance:** Excess people collapse into a count with accessible disclosure
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [avatar-default.json](pages/avatar-default.json).

### 07. Badge — badge-default.html

**Entry:** [badge-default.html](../../badge-default.html). **Category:** Components · Data Display · Badge. **Native properties:** 4. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [badge-detail.js](../../badge-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-07-01 | Size | badge-size-mount | multiselect | ["default"] | Default = default; Small = small | Available by default |
| CTRL-07-02 | Count | badge-count | number | 5 | Free value / toggle | min=0, max=None, step=None |
| CTRL-07-03 | Max count | badge-max | number | 99 | Free value / toggle | min=1, max=None, step=None |
| CTRL-07-04 | Status label | badge-label | text | Active | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Count:** Declare units and semantic bounds, distinguish zero from empty, and show normalization/validation feedback. Do not add an arbitrary product limit without a reason.
- **Max count:** Declare units and semantic bounds, distinguish zero from empty, and show normalization/validation feedback. Do not add an arbitrary product limit without a reason.
- **Status label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Count, Dot, Status; states: Default, Success, Processing, Warning, Error. Default rendered cells: 15. Dedicated interaction markup: none found.

**Property-change evidence:** 6 cases; 5 changed preview DOM; 6 changed prompt; 5 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Max count.

**Reload probe:** changed Status label to `Reload audit Badge`; after reload observed `Active`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 748 px; Live Preview top 1314 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-badge-default-badge-mode · P1 · Badge mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current example.
- **Validation / dependencies:** Count or dot or status with compatible fields
- **Preview acceptance:** Configure a single intended badge rather than copying all examples
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-badge-default-semantic-status · P1 · Semantic status

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current example status.
- **Validation / dependencies:** Use supported semantic colors and text labels
- **Preview acceptance:** Status selection updates the same preview and exported value
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-badge-default-show-zero · P1 · Show zero

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Zero visibility must be explicit
- **Preview acceptance:** Count zero is either displayed or suppressed as configured
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-badge-default-host-content · P1 · Host content

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** slot editor. **Proposed default:** Current example host.
- **Validation / dependencies:** Do not remove the host accessible name
- **Preview acceptance:** Attach the badge to the intended icon or avatar or action
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-badge-default-count-announcement · P2 · Count announcement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text formatter. **Proposed default:** Context-specific count description.
- **Validation / dependencies:** Avoid reading an unexplained isolated number
- **Preview acceptance:** Badge updates have a useful accessible meaning
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [badge-default.json](pages/badge-default.json).

### 08. Breadcrumb — breadcrumb-default.html

**Entry:** [breadcrumb-default.html](../../breadcrumb-default.html). **Category:** Components · Navigation · Breadcrumb. **Native properties:** 2. **Proposed atomic capabilities:** 4.

**Source:** Properties begins at HTML line 177; detail implementation: [breadcrumb-detail.js](../../breadcrumb-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-08-01 | Size | breadcrumb-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-08-02 | Labels | breadcrumb-label | text | Home, Products, Shoes | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Labels:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Chevron, Slash; states: Rest, Hover, Focused, Disabled. Default rendered cells: 8. Dedicated interaction markup: none found.

**Property-change evidence:** 8 cases; 8 changed preview DOM; 8 changed prompt; 8 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Labels to `Reload audit Breadcrumb`; after reload observed `Home, Products, Shoes`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 567 px; Live Preview top 1133 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-breadcrumb-default-item-destinations · P1 · Item destinations

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** structured link list. **Proposed default:** Current labels mapped to sample paths.
- **Validation / dependencies:** Every non-current item needs a valid destination
- **Preview acceptance:** Clicking ancestors and exporting preserve each authored URL
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-breadcrumb-default-current-item · P1 · Current item

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item selector. **Proposed default:** Last item.
- **Validation / dependencies:** Exactly one item is current and it is not an ambiguous duplicate link
- **Preview acceptance:** Preview/export agree about aria-current
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-breadcrumb-default-separator · P1 · Separator

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** icon or text picker. **Proposed default:** Current separator.
- **Validation / dependencies:** Decorative separators stay out of accessible names
- **Preview acceptance:** Change separator without changing item labels
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-breadcrumb-default-overflow-policy · P2 · Overflow policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select and threshold. **Proposed default:** None.
- **Validation / dependencies:** Keep first/current destinations reachable and explain collapsed items
- **Preview acceptance:** Narrow specimens collapse predictably without losing ancestors
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [breadcrumb-default.json](pages/breadcrumb-default.json).

### 09. Destructive Button — button-destructive.html

**Entry:** [button-destructive.html](../../button-destructive.html). **Category:** Components · Actions · Button. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [button-detail.js](../../button-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-09-01 | Size | size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-09-02 | Content | content-mount | multiselect | ["text"] | Text only = text; Icon left = icon-left; Icon right = icon-right; Icon both sides = icon-both; Icon only = icon-only | Available by default |
| CTRL-09-03 | Corner radius | radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-09-04 | Button label | button-label | text | Delete | Free value / toggle | Available by default |
| CTRL-09-05 | Accessible label (required for icon-only) | accessible-label | text |  | Free value / toggle | Conditional prerequisite |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Content:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Button label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Accessible label (required for icon-only):** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Primary, Secondary, Tertiary, Ghost, Neutral, Link, Approve, Delete; states: Rest, Hover, Pressed, Focus, Disabled, Loading. Default rendered cells: 48. Dedicated interaction markup: none found.

**Property-change evidence:** 17 cases; 17 changed preview DOM; 17 changed prompt; 15 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Button label, Accessible label (required for icon-only).

**Reload probe:** changed Button label to `Reload audit Destructive Button`; after reload observed `Delete`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 534 px, height 700 px; Live Preview top 1258 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-button-destructive-leading-icon-reference · P1 · Leading icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Choose a valid Foundation icon ID or approved slot
- **Preview acceptance:** Changing the icon changes only the leading icon and its exported reference
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-destructive-trailing-icon-reference · P1 · Trailing icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Independent of the leading icon and hidden without its slot
- **Preview acceptance:** Trailing icon swaps independently in both single and dual icon content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-destructive-width-mode · P1 · Width mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** segmented choice and dimension. **Proposed default:** Auto.
- **Validation / dependencies:** Auto or full container or positive custom width with valid unit
- **Preview acceptance:** Preview responds inside narrow and wide containers without clipping the label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-destructive-button-semantics · P1 · Button semantics

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and action metadata. **Proposed default:** Native button type button.
- **Validation / dependencies:** Button or submit or reset, or a real navigation href when rendered as a link
- **Preview acceptance:** Export the correct element and native type rather than inferring an action from label text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-destructive-loading-announcement · P2 · Loading announcement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Loading.
- **Validation / dependencies:** Nonempty accessible status when busy and no duplicate announcements
- **Preview acceptance:** Busy state keeps a useful accessible name and prevents repeated activation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [button-destructive.json](pages/button-destructive.json).

### 10. Ghost Button — button-ghost.html

**Entry:** [button-ghost.html](../../button-ghost.html). **Category:** Components · Actions · Button. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [button-detail.js](../../button-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-10-01 | Size | size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-10-02 | Content | content-mount | multiselect | ["text"] | Text only = text; Icon left = icon-left; Icon right = icon-right; Icon both sides = icon-both; Icon only = icon-only | Available by default |
| CTRL-10-03 | Corner radius | radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-10-04 | Button label | button-label | text | Close | Free value / toggle | Available by default |
| CTRL-10-05 | Accessible label (required for icon-only) | accessible-label | text |  | Free value / toggle | Conditional prerequisite |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Content:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Button label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Accessible label (required for icon-only):** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Primary, Secondary, Tertiary, Ghost, Neutral, Link, Approve, Delete; states: Rest, Hover, Pressed, Focus, Disabled, Loading. Default rendered cells: 48. Dedicated interaction markup: none found.

**Property-change evidence:** 17 cases; 17 changed preview DOM; 17 changed prompt; 15 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Button label, Accessible label (required for icon-only).

**Reload probe:** changed Button label to `Reload audit Ghost Button`; after reload observed `Close`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 518 px, height 700 px; Live Preview top 1242 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-button-ghost-leading-icon-reference · P1 · Leading icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Choose a valid Foundation icon ID or approved slot
- **Preview acceptance:** Changing the icon changes only the leading icon and its exported reference
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-ghost-trailing-icon-reference · P1 · Trailing icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Independent of the leading icon and hidden without its slot
- **Preview acceptance:** Trailing icon swaps independently in both single and dual icon content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-ghost-width-mode · P1 · Width mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** segmented choice and dimension. **Proposed default:** Auto.
- **Validation / dependencies:** Auto or full container or positive custom width with valid unit
- **Preview acceptance:** Preview responds inside narrow and wide containers without clipping the label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-ghost-button-semantics · P1 · Button semantics

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and action metadata. **Proposed default:** Native button type button.
- **Validation / dependencies:** Button or submit or reset, or a real navigation href when rendered as a link
- **Preview acceptance:** Export the correct element and native type rather than inferring an action from label text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-ghost-loading-announcement · P2 · Loading announcement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Loading.
- **Validation / dependencies:** Nonempty accessible status when busy and no duplicate announcements
- **Preview acceptance:** Busy state keeps a useful accessible name and prevents repeated activation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [button-ghost.json](pages/button-ghost.json).

### 11. Link Button — button-link.html

**Entry:** [button-link.html](../../button-link.html). **Category:** Components · Actions · Button. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [button-detail.js](../../button-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-11-01 | Size | size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-11-02 | Content | content-mount | multiselect | ["text"] | Text only = text; Icon left = icon-left; Icon right = icon-right; Icon both sides = icon-both; Icon only = icon-only | Available by default |
| CTRL-11-03 | Corner radius | radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-11-04 | Button label | button-label | text | View Details | Free value / toggle | Available by default |
| CTRL-11-05 | Accessible label (required for icon-only) | accessible-label | text |  | Free value / toggle | Conditional prerequisite |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Content:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Button label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Accessible label (required for icon-only):** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Primary, Secondary, Tertiary, Ghost, Neutral, Link, Approve, Delete; states: Rest, Hover, Pressed, Focus, Disabled, Loading. Default rendered cells: 48. Dedicated interaction markup: none found.

**Property-change evidence:** 17 cases; 17 changed preview DOM; 17 changed prompt; 15 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Button label, Accessible label (required for icon-only).

**Reload probe:** changed Button label to `Reload audit Link Button`; after reload observed `View Details`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 494 px, height 700 px; Live Preview top 1218 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-button-link-leading-icon-reference · P1 · Leading icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Choose a valid Foundation icon ID or approved slot
- **Preview acceptance:** Changing the icon changes only the leading icon and its exported reference
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-link-trailing-icon-reference · P1 · Trailing icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Independent of the leading icon and hidden without its slot
- **Preview acceptance:** Trailing icon swaps independently in both single and dual icon content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-link-width-mode · P1 · Width mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** segmented choice and dimension. **Proposed default:** Auto.
- **Validation / dependencies:** Auto or full container or positive custom width with valid unit
- **Preview acceptance:** Preview responds inside narrow and wide containers without clipping the label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-link-button-semantics · P1 · Button semantics

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and action metadata. **Proposed default:** Native button type button.
- **Validation / dependencies:** Button or submit or reset, or a real navigation href when rendered as a link
- **Preview acceptance:** Export the correct element and native type rather than inferring an action from label text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-link-loading-announcement · P2 · Loading announcement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Loading.
- **Validation / dependencies:** Nonempty accessible status when busy and no duplicate announcements
- **Preview acceptance:** Busy state keeps a useful accessible name and prevents repeated activation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [button-link.json](pages/button-link.json).

### 12. Neutral Button — button-neutral.html

**Entry:** [button-neutral.html](../../button-neutral.html). **Category:** Components · Actions · Button. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [button-detail.js](../../button-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-12-01 | Size | size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-12-02 | Content | content-mount | multiselect | ["text"] | Text only = text; Icon left = icon-left; Icon right = icon-right; Icon both sides = icon-both; Icon only = icon-only | Available by default |
| CTRL-12-03 | Corner radius | radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-12-04 | Button label | button-label | text | Filter | Free value / toggle | Available by default |
| CTRL-12-05 | Accessible label (required for icon-only) | accessible-label | text |  | Free value / toggle | Conditional prerequisite |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Content:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Button label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Accessible label (required for icon-only):** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Primary, Secondary, Tertiary, Ghost, Neutral, Link, Approve, Delete; states: Rest, Hover, Pressed, Focus, Disabled, Loading. Default rendered cells: 48. Dedicated interaction markup: none found.

**Property-change evidence:** 17 cases; 17 changed preview DOM; 17 changed prompt; 15 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Button label, Accessible label (required for icon-only).

**Reload probe:** changed Button label to `Reload audit Neutral Button`; after reload observed `Filter`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 494 px, height 700 px; Live Preview top 1218 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-button-neutral-leading-icon-reference · P1 · Leading icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Choose a valid Foundation icon ID or approved slot
- **Preview acceptance:** Changing the icon changes only the leading icon and its exported reference
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-neutral-trailing-icon-reference · P1 · Trailing icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Independent of the leading icon and hidden without its slot
- **Preview acceptance:** Trailing icon swaps independently in both single and dual icon content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-neutral-width-mode · P1 · Width mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** segmented choice and dimension. **Proposed default:** Auto.
- **Validation / dependencies:** Auto or full container or positive custom width with valid unit
- **Preview acceptance:** Preview responds inside narrow and wide containers without clipping the label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-neutral-button-semantics · P1 · Button semantics

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and action metadata. **Proposed default:** Native button type button.
- **Validation / dependencies:** Button or submit or reset, or a real navigation href when rendered as a link
- **Preview acceptance:** Export the correct element and native type rather than inferring an action from label text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-neutral-loading-announcement · P2 · Loading announcement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Loading.
- **Validation / dependencies:** Nonempty accessible status when busy and no duplicate announcements
- **Preview acceptance:** Busy state keeps a useful accessible name and prevents repeated activation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [button-neutral.json](pages/button-neutral.json).

### 13. Primary Button 36px - Dual Icon — button-primary-icon.html

**Entry:** [button-primary-icon.html](../../button-primary-icon.html). **Category:** Components · Actions · Button. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [button-dualicon-detail.js](../../button-dualicon-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-13-01 | Size | dualicon-size-mount | multiselect | ["36"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-13-02 | Corner radius | dualicon-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-13-03 | Content | dualicon-content-mount | multiselect | ["text"] | Icon both sides = icon-both; Icon left only = icon-left; Icon right only = icon-right; Text only = text | Available by default |
| CTRL-13-04 | Label | dualicon-label | text | Save | Free value / toggle | Available by default |
| CTRL-13-05 | CTA leading icon | splitcta-leading-icon | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Content:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **CTA leading icon:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Primary, Secondary, Tertiary, Ghost, Transparent, Approve, Delete, CTA With Dropdown; states: Rest, Hover, Pressed, Focused, Disabled, Loading. Default rendered cells: 48. Dedicated interaction markup: none found.

**Property-change evidence:** 16 cases; 16 changed preview DOM; 16 changed prompt; 14 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, CTA leading icon.

**Reload probe:** changed Label to `Reload audit Primary Button 36px - Dual Icon`; after reload observed `Save`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 510 px, height 827 px; Live Preview top 1360 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-button-primary-icon-leading-icon-reference · P1 · Leading icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Choose a valid Foundation icon ID or approved slot
- **Preview acceptance:** Changing the icon changes only the leading icon and its exported reference
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-primary-icon-trailing-icon-reference · P1 · Trailing icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Independent of the leading icon and hidden without its slot
- **Preview acceptance:** Trailing icon swaps independently in both single and dual icon content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-primary-icon-width-mode · P1 · Width mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** segmented choice and dimension. **Proposed default:** Auto.
- **Validation / dependencies:** Auto or full container or positive custom width with valid unit
- **Preview acceptance:** Preview responds inside narrow and wide containers without clipping the label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-primary-icon-button-semantics · P1 · Button semantics

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and action metadata. **Proposed default:** Native button type button.
- **Validation / dependencies:** Button or submit or reset, or a real navigation href when rendered as a link
- **Preview acceptance:** Export the correct element and native type rather than inferring an action from label text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-primary-icon-loading-announcement · P2 · Loading announcement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Loading.
- **Validation / dependencies:** Nonempty accessible status when busy and no duplicate announcements
- **Preview acceptance:** Busy state keeps a useful accessible name and prevents repeated activation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [button-primary-icon.json](pages/button-primary-icon.json).

### 14. Primary Button — button-primary.html

**Entry:** [button-primary.html](../../button-primary.html). **Category:** Components · Actions · Button. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [button-detail.js](../../button-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-14-01 | Size | size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-14-02 | Content | content-mount | multiselect | ["text"] | Text only = text; Icon left = icon-left; Icon right = icon-right; Icon both sides = icon-both; Icon only = icon-only | Available by default |
| CTRL-14-03 | Corner radius | radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-14-04 | Button label | button-label | text | Save | Free value / toggle | Available by default |
| CTRL-14-05 | Accessible label (required for icon-only) | accessible-label | text |  | Free value / toggle | Conditional prerequisite |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Content:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Button label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Accessible label (required for icon-only):** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Primary, Secondary, Tertiary, Ghost, Neutral, Link, Approve, Delete; states: Rest, Hover, Pressed, Focus, Disabled, Loading. Default rendered cells: 48. Dedicated interaction markup: none found.

**Property-change evidence:** 17 cases; 17 changed preview DOM; 17 changed prompt; 15 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Button label, Accessible label (required for icon-only).

**Reload probe:** changed Button label to `Reload audit Primary Button`; after reload observed `Save`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 494 px, height 700 px; Live Preview top 1218 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-button-primary-leading-icon-reference · P1 · Leading icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Choose a valid Foundation icon ID or approved slot
- **Preview acceptance:** Changing the icon changes only the leading icon and its exported reference
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-primary-trailing-icon-reference · P1 · Trailing icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Independent of the leading icon and hidden without its slot
- **Preview acceptance:** Trailing icon swaps independently in both single and dual icon content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-primary-width-mode · P1 · Width mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** segmented choice and dimension. **Proposed default:** Auto.
- **Validation / dependencies:** Auto or full container or positive custom width with valid unit
- **Preview acceptance:** Preview responds inside narrow and wide containers without clipping the label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-primary-button-semantics · P1 · Button semantics

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and action metadata. **Proposed default:** Native button type button.
- **Validation / dependencies:** Button or submit or reset, or a real navigation href when rendered as a link
- **Preview acceptance:** Export the correct element and native type rather than inferring an action from label text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-primary-loading-announcement · P2 · Loading announcement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Loading.
- **Validation / dependencies:** Nonempty accessible status when busy and no duplicate announcements
- **Preview acceptance:** Busy state keeps a useful accessible name and prevents repeated activation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [button-primary.json](pages/button-primary.json).

### 15. Secondary Button — button-secondary.html

**Entry:** [button-secondary.html](../../button-secondary.html). **Category:** Components · Actions · Button. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [button-detail.js](../../button-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-15-01 | Size | size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-15-02 | Content | content-mount | multiselect | ["text"] | Text only = text; Icon left = icon-left; Icon right = icon-right; Icon both sides = icon-both; Icon only = icon-only | Available by default |
| CTRL-15-03 | Corner radius | radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-15-04 | Button label | button-label | text | Cancel | Free value / toggle | Available by default |
| CTRL-15-05 | Accessible label (required for icon-only) | accessible-label | text |  | Free value / toggle | Conditional prerequisite |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Content:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Button label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Accessible label (required for icon-only):** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Primary, Secondary, Tertiary, Ghost, Neutral, Link, Approve, Delete; states: Rest, Hover, Pressed, Focus, Disabled, Loading. Default rendered cells: 48. Dedicated interaction markup: none found.

**Property-change evidence:** 17 cases; 17 changed preview DOM; 17 changed prompt; 15 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Button label, Accessible label (required for icon-only).

**Reload probe:** changed Button label to `Reload audit Secondary Button`; after reload observed `Cancel`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 494 px, height 700 px; Live Preview top 1218 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-button-secondary-leading-icon-reference · P1 · Leading icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Choose a valid Foundation icon ID or approved slot
- **Preview acceptance:** Changing the icon changes only the leading icon and its exported reference
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-secondary-trailing-icon-reference · P1 · Trailing icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Independent of the leading icon and hidden without its slot
- **Preview acceptance:** Trailing icon swaps independently in both single and dual icon content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-secondary-width-mode · P1 · Width mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** segmented choice and dimension. **Proposed default:** Auto.
- **Validation / dependencies:** Auto or full container or positive custom width with valid unit
- **Preview acceptance:** Preview responds inside narrow and wide containers without clipping the label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-secondary-button-semantics · P1 · Button semantics

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and action metadata. **Proposed default:** Native button type button.
- **Validation / dependencies:** Button or submit or reset, or a real navigation href when rendered as a link
- **Preview acceptance:** Export the correct element and native type rather than inferring an action from label text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-secondary-loading-announcement · P2 · Loading announcement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Loading.
- **Validation / dependencies:** Nonempty accessible status when busy and no duplicate announcements
- **Preview acceptance:** Busy state keeps a useful accessible name and prevents repeated activation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [button-secondary.json](pages/button-secondary.json).

### 16. Tertiary Button — button-tertiary.html

**Entry:** [button-tertiary.html](../../button-tertiary.html). **Category:** Components · Actions · Button. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [button-detail.js](../../button-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-16-01 | Size | size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-16-02 | Content | content-mount | multiselect | ["text"] | Text only = text; Icon left = icon-left; Icon right = icon-right; Icon both sides = icon-both; Icon only = icon-only | Available by default |
| CTRL-16-03 | Corner radius | radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-16-04 | Button label | button-label | text | Learn More | Free value / toggle | Available by default |
| CTRL-16-05 | Accessible label (required for icon-only) | accessible-label | text |  | Free value / toggle | Conditional prerequisite |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Content:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Button label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Accessible label (required for icon-only):** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Primary, Secondary, Tertiary, Ghost, Neutral, Link, Approve, Delete; states: Rest, Hover, Pressed, Focus, Disabled, Loading. Default rendered cells: 48. Dedicated interaction markup: none found.

**Property-change evidence:** 17 cases; 17 changed preview DOM; 17 changed prompt; 15 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Button label, Accessible label (required for icon-only).

**Reload probe:** changed Button label to `Reload audit Tertiary Button`; after reload observed `Learn More`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 494 px, height 700 px; Live Preview top 1218 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-button-tertiary-leading-icon-reference · P1 · Leading icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Choose a valid Foundation icon ID or approved slot
- **Preview acceptance:** Changing the icon changes only the leading icon and its exported reference
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-tertiary-trailing-icon-reference · P1 · Trailing icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** searchable icon picker. **Proposed default:** Keep the current example icon.
- **Validation / dependencies:** Independent of the leading icon and hidden without its slot
- **Preview acceptance:** Trailing icon swaps independently in both single and dual icon content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-tertiary-width-mode · P1 · Width mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** segmented choice and dimension. **Proposed default:** Auto.
- **Validation / dependencies:** Auto or full container or positive custom width with valid unit
- **Preview acceptance:** Preview responds inside narrow and wide containers without clipping the label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-tertiary-button-semantics · P1 · Button semantics

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** choice and action metadata. **Proposed default:** Native button type button.
- **Validation / dependencies:** Button or submit or reset, or a real navigation href when rendered as a link
- **Preview acceptance:** Export the correct element and native type rather than inferring an action from label text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-button-tertiary-loading-announcement · P2 · Loading announcement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Loading.
- **Validation / dependencies:** Nonempty accessible status when busy and no duplicate announcements
- **Preview acceptance:** Busy state keeps a useful accessible name and prevents repeated activation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [button-tertiary.json](pages/button-tertiary.json).

### 17. Calendar — calendar-default.html

**Entry:** [calendar-default.html](../../calendar-default.html). **Category:** Components · Data Display · Calendar. **Native properties:** 2. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [calendar-detail.js](../../calendar-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-17-01 | Month label | calendar-month-label | text | September 2026 | Free value / toggle | Available by default |
| CTRL-17-02 | First day of week | calendar-first-day-select | select | sunday | Sunday = sunday; Monday = monday | Available by default |

**Existing-control usability improvements:**

- **Month label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **First day of week:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.

**Preview coverage:** Full, Compact; states: Default, With events, Range preview. Default rendered cells: 6. Dedicated interaction markup: none found.

**Fixed data/source evidence:**

- [calendar-detail.js](../../calendar-detail.js), line 21: `var GRID_SUNDAY_START = [`
- [calendar-detail.js](../../calendar-detail.js), line 42: `var TODAY_DAY = 16;`
- [calendar-detail.js](../../calendar-detail.js), line 43: `var EVENT_DAYS = [5, 20];`

**Property-change evidence:** 2 cases; 2 changed preview DOM; 2 changed prompt; 2 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Month label to `Reload audit Calendar`; after reload observed `September 2026`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 543 px; Live Preview top 1109 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-calendar-default-displayed-month-and-year · P1 · Displayed month and year

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** month/year input. **Proposed default:** September 2026 example.
- **Validation / dependencies:** Derive a real date grid with valid month boundaries and leap years
- **Preview acceptance:** Changing month updates day positions, overflow dates and full-date accessible labels together
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-calendar-default-selected-date · P1 · Selected date

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** date input. **Proposed default:** Current highlighted example.
- **Validation / dependencies:** Value must be a valid enabled date in the configured mode
- **Preview acceptance:** Selection highlight corresponds to the authored date
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-calendar-default-today-reference · P1 · Today reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** date input. **Proposed default:** Fixed demo reference unless explicitly live.
- **Validation / dependencies:** Keep the demo clock deterministic and separate from selected date
- **Preview acceptance:** Today marker moves independently of selection
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-calendar-default-events · P1 · Events

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable dated event list. **Proposed default:** Current two sample events.
- **Validation / dependencies:** ISO dates, stable IDs and accessible event names
- **Preview acceptance:** Authored events appear on their actual dates
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-calendar-default-disabled-dates · P1 · Disabled dates

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** date/range rules. **Proposed default:** None.
- **Validation / dependencies:** Minimum must not exceed maximum and disabled dates cannot be selected
- **Preview acceptance:** Disabled days look and behave consistently
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-calendar-default-selection-mode · P2 · Selection mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Single date.
- **Validation / dependencies:** Single or range with ordered endpoints
- **Preview acceptance:** Range rendering follows actual chosen endpoints
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [calendar-default.json](pages/calendar-default.json).

### 18. Card — card-default.html

**Entry:** [card-default.html](../../card-default.html). **Category:** Components · Data Display · Card. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [card-detail.js](../../card-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-18-01 | Corner radius | card-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-18-02 | Size | card-size-mount | multiselect | ["default"] | Default = default; Small = small | Available by default |
| CTRL-18-03 | Title | card-title | text | Team standup | Free value / toggle | Available by default |
| CTRL-18-04 | Body | card-body | text | Daily sync at 9:30 AM in the main conference room. | Free value / toggle | Available by default |
| CTRL-18-05 | Show shadow | card-show-shadow | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Body:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show shadow:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Default, With media, With actions; states: Rest, Hover, Selected, Disabled, Loading. Default rendered cells: 15. Dedicated interaction markup: none found.

**Property-change evidence:** 8 cases; 8 changed preview DOM; 8 changed prompt; 8 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Title to `Reload audit Card`; after reload observed `Team standup`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 797 px; Live Preview top 1386 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-card-default-header-actions · P1 · Header actions

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable action list. **Proposed default:** None.
- **Validation / dependencies:** Each action needs a name and stable intent ID
- **Preview acceptance:** Actions render in the header and are included in the contract
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-card-default-footer-content · P1 · Footer content

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** slot editor. **Proposed default:** None.
- **Validation / dependencies:** Keep footer order and action hierarchy explicit
- **Preview acceptance:** Configure real footer buttons or metadata
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-card-default-media · P1 · Media

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** asset and aspect-ratio picker. **Proposed default:** None.
- **Validation / dependencies:** Informative media needs alt text and a loading/fallback state
- **Preview acceptance:** Chosen image/media fits the card correctly
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-card-default-whole-card-interaction · P1 · Whole-card interaction

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select and destination. **Proposed default:** Static.
- **Validation / dependencies:** Avoid nested competing links and buttons
- **Preview acceptance:** Static, link and selectable cards expose different correct semantics
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-card-default-width-constraints · P2 · Width constraints

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** dimension controls. **Proposed default:** Current sample width.
- **Validation / dependencies:** Respect min/max and narrow-container behavior
- **Preview acceptance:** Card body wraps without losing its footer/actions
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [card-default.json](pages/card-default.json).

### 19. Cascader — cascader-default.html

**Entry:** [cascader-default.html](../../cascader-default.html). **Category:** Components · Forms · Cascader. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [cascader-detail.js](../../cascader-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-19-01 | Size | cascader-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-19-02 | Corner radius | cascader-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-19-03 | Label | cascader-label | text | Location | Free value / toggle | Available by default |
| CTRL-19-04 | Placeholder | cascader-placeholder | text | Select location | Free value / toggle | Available by default |
| CTRL-19-05 | Allow clear | cascader-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled; states: Rest, Hover, Focus, Open, Filled, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 14 cases; 14 changed preview DOM; 14 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Allow clear.

**Reload probe:** changed Label to `Reload audit Cascader`; after reload observed `Location`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 783 px; Live Preview top 1372 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-cascader-default-hierarchy-data · P1 · Hierarchy data

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** tree-data editor. **Proposed default:** Existing example location tree.
- **Validation / dependencies:** Stable IDs, labels and parent/child relationships without cycles
- **Preview acceptance:** Every panel shows the user's actual hierarchy
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-cascader-default-selected-path · P1 · Selected path

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** hierarchical value picker. **Proposed default:** Empty.
- **Validation / dependencies:** Values must reference an existing valid path
- **Preview acceptance:** Trigger and highlighted nodes agree on selection
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-cascader-default-parent-selectable · P1 · Parent selectable

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Define leaf-only versus parent selection explicitly
- **Preview acceptance:** Clicking a parent either expands or selects according to the setting
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-cascader-default-expand-trigger · P2 · Expand trigger

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Click.
- **Validation / dependencies:** Pointer hover must have an equivalent keyboard path
- **Preview acceptance:** Expansion behavior matches the declared trigger
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-cascader-default-searchable · P1 · Searchable

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and search behavior. **Proposed default:** False.
- **Validation / dependencies:** Preserve full path context in filtered matches
- **Preview acceptance:** Search results can locate deep nodes without losing ancestry
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [cascader-default.json](pages/cascader-default.json).

### 20. Checkbox — checkbox-default.html

**Entry:** [checkbox-default.html](../../checkbox-default.html). **Category:** Components · Forms · Checkbox. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [checkbox-detail.js](../../checkbox-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-20-01 | Size | checkbox-size-mount | multiselect | ["20"] | 16px - S = 16; 20px - M = 20; 24px - L = 24 | Available by default |
| CTRL-20-02 | Corner radius | checkbox-radius-mount | multiselect | ["6"] | 2px - Sharp = 2; 4px - Balanced = 4; 6px - Soft = 6; Full - Pill = 9999 | Available by default |
| CTRL-20-03 | Label | checkbox-label | text | I agree to the terms | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Standard, Card; states: Unchecked, Checked, Indeterminate, Hover, Focused, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 6 cases; 6 changed preview DOM; 6 changed prompt; 5 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label.

**Reload probe:** changed Label to `Reload audit Checkbox`; after reload observed `I agree to the terms`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 610 px; Live Preview top 1223 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-checkbox-default-checked-value · P1 · Checked value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Boolean value independent of visual hover/focus
- **Preview acceptance:** A single configured specimen toggles its actual checked state
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-checkbox-default-indeterminate-value · P1 · Indeterminate value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Define its relationship to checked and expose mixed semantics
- **Preview acceptance:** Mixed selection is represented programmatically and visually
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-checkbox-default-disabled-value · P1 · Disabled value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Disabled option remains understandable and non-interactive
- **Preview acceptance:** Current-instance disabled behavior can be exercised
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-checkbox-default-group-options · P1 · Group options

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable option list. **Proposed default:** None.
- **Validation / dependencies:** Unique values and shared labelled group
- **Preview acceptance:** Multiple checkboxes use real authored option content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-checkbox-default-required-error-message · P1 · Required/error message

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and text. **Proposed default:** Optional.
- **Validation / dependencies:** Associate group errors with the group and individual target where necessary
- **Preview acceptance:** Submit validation names the missing consent or choice
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [checkbox-default.json](pages/checkbox-default.json).

### 21. Collapse — collapse-default.html

**Entry:** [collapse-default.html](../../collapse-default.html). **Category:** Components · Data Display · Collapse. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [collapse-detail.js](../../collapse-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-21-01 | Corner radius | collapse-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-21-02 | Size | collapse-size-mount | multiselect | ["medium"] | Small = small; Medium = medium; Large = large | Available by default |
| CTRL-21-03 | Header text | collapse-header | text | What's included in the free plan? | Free value / toggle | Available by default |
| CTRL-21-04 | Body text | collapse-body | text | The free plan includes up to 3 projects, 1GB of storage, and community support. | Free value / toggle | Available by default |
| CTRL-21-05 | Show icon | collapse-show-icon | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Header text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Body text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show icon:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Bordered, Borderless; states: Collapsed, Expanded, Disabled. Default rendered cells: 6. Dedicated interaction markup: none found.

**Property-change evidence:** 9 cases; 9 changed preview DOM; 9 changed prompt; 9 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Header text to `Reload audit Collapse`; after reload observed `What's included in the free plan?`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 807 px; Live Preview top 1396 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-collapse-default-panels · P1 · Panels

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** reorderable header/body list. **Proposed default:** Current example panel.
- **Validation / dependencies:** Stable IDs and unique control/panel relationships
- **Preview acceptance:** Authors can add, remove and reorder actual panels
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-collapse-default-expanded-panels · P1 · Expanded panels

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item selector. **Proposed default:** Current default.
- **Validation / dependencies:** Reference valid panel IDs
- **Preview acceptance:** Expanded state is inspectable independently of content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-collapse-default-accordion-mode · P1 · Accordion mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** At most one panel open when enabled
- **Preview acceptance:** Opening one panel closes the prior panel only in accordion mode
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-collapse-default-disabled-panel · P1 · Disabled panel

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-panel toggle. **Proposed default:** None.
- **Validation / dependencies:** Disabled headers cannot toggle and remain labelled
- **Preview acceptance:** A disabled panel is not simulated only by opacity
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-collapse-default-expand-icon-reference · P2 · Expand icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** icon picker. **Proposed default:** Existing chevron.
- **Validation / dependencies:** Preserve expanded state naming and keyboard operation
- **Preview acceptance:** Icon replacement does not break panel controls
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [collapse-default.json](pages/collapse-default.json).

### 22. Color Picker — color-picker-default.html

**Entry:** [color-picker-default.html](../../color-picker-default.html). **Category:** Components · Forms · Color Picker. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [color-picker-detail.js](../../color-picker-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-22-01 | Size | colorpicker-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-22-02 | Corner radius | colorpicker-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-22-03 | Label | colorpicker-label | text | Brand color | Free value / toggle | Available by default |
| CTRL-22-04 | Color value | colorpicker-hex | text | #FF031A | Free value / toggle | Available by default |
| CTRL-22-05 | Allow clear | colorpicker-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Color value:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled; states: Rest, Hover, Focus, Open, Filled, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 14 cases; 14 changed preview DOM; 14 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Color value, Allow clear.

**Reload probe:** changed Label to `Reload audit Color Picker`; after reload observed `Brand color`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 783 px; Live Preview top 1348 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-color-picker-default-color-format · P1 · Color format

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** HEX.
- **Validation / dependencies:** Supported formats round-trip without silently losing alpha
- **Preview acceptance:** The trigger, input and copied values use the chosen representation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-color-picker-default-alpha-value · P1 · Alpha value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** percentage or slider. **Proposed default:** Opaque.
- **Validation / dependencies:** Clamp to a documented range and retain alpha in exports
- **Preview acceptance:** Transparency changes swatch and actual color value
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-color-picker-default-preset-colors · P1 · Preset colors

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable swatch list. **Proposed default:** Existing palette.
- **Validation / dependencies:** Validate each swatch and provide an accessible name
- **Preview acceptance:** Authored presets can be chosen from the panel
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-color-picker-default-required-error-state · P1 · Required/error state

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and text. **Proposed default:** Optional.
- **Validation / dependencies:** Invalid values keep the last valid color and explain the error
- **Preview acceptance:** Bad input is recoverable without a silent reset
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-color-picker-default-open-placement · P2 · Open/placement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and placement selector. **Proposed default:** Closed with automatic placement.
- **Validation / dependencies:** Popup remains within the viewport and returns focus
- **Preview acceptance:** A configured picker can be tested as a real popup
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [color-picker-default.json](pages/color-picker-default.json).

### 23. Date Picker — date-picker-default.html

**Entry:** [date-picker-default.html](../../date-picker-default.html). **Category:** Components · Forms · Date Picker. **Native properties:** 5. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [date-picker-detail.js](../../date-picker-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-23-01 | Size | datepicker-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-23-02 | Corner radius | datepicker-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-23-03 | Label | datepicker-label | text | Date of birth | Free value / toggle | Available by default |
| CTRL-23-04 | Placeholder | datepicker-placeholder | text | MM/DD/YYYY | Free value / toggle | Available by default |
| CTRL-23-05 | Allow clear | datepicker-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled; states: Rest, Hover, Focused, Filled, Error, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 14 cases; 14 changed preview DOM; 14 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Allow clear.

**Reload probe:** changed Label to `Reload audit Date Picker`; after reload observed `Date of birth`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 783 px; Live Preview top 1348 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-date-picker-default-selected-date · P1 · Selected date

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** date input. **Proposed default:** Empty.
- **Validation / dependencies:** Parse a real date rather than a placeholder string
- **Preview acceptance:** Trigger and calendar agree on the selected date
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-date-picker-default-date-format · P1 · Date format

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** format selector. **Proposed default:** Existing sample format.
- **Validation / dependencies:** Accepted input and displayed output must agree
- **Preview acceptance:** Changing format updates all formatted dates coherently
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-date-picker-default-locale · P1 · Locale

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** locale selector. **Proposed default:** Existing example locale.
- **Validation / dependencies:** Define date order, labels and week start explicitly
- **Preview acceptance:** Calendar and accessible names use the same locale
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-date-picker-default-date-bounds · P1 · Date bounds

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** paired date inputs. **Proposed default:** None.
- **Validation / dependencies:** Minimum no later than maximum
- **Preview acceptance:** Out-of-range dates cannot be selected
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-date-picker-default-disabled-date-rules · P2 · Disabled-date rules

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** rule editor. **Proposed default:** None.
- **Validation / dependencies:** Resolve rules deterministically against sample dates
- **Preview acceptance:** Disabled choices are shown and blocked
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-date-picker-default-required-error-rules · P1 · Required/error rules

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and text. **Proposed default:** Optional.
- **Validation / dependencies:** Validation runs at a defined interaction point
- **Preview acceptance:** Missing/invalid date receives an associated actionable message
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [date-picker-default.json](pages/date-picker-default.json).

### 24. Date Range — date-range-default.html

**Entry:** [date-range-default.html](../../date-range-default.html). **Category:** Components · Forms · Date Range. **Native properties:** 6. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [date-range-detail.js](../../date-range-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-24-01 | Size | daterange-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-24-02 | Corner radius | daterange-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-24-03 | Label | daterange-label | text | Trip dates | Free value / toggle | Available by default |
| CTRL-24-04 | Start placeholder | daterange-start-placeholder | text | Start date | Free value / toggle | Available by default |
| CTRL-24-05 | End placeholder | daterange-end-placeholder | text | End date | Free value / toggle | Available by default |
| CTRL-24-06 | Allow clear | daterange-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Start placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **End placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled; states: Rest, Hover, Focused, Filled, Error, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 15 cases; 15 changed preview DOM; 15 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Start placeholder, End placeholder, Allow clear.

**Reload probe:** changed Label to `Reload audit Date Range`; after reload observed `Trip dates`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 873 px; Live Preview top 1463 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-date-range-default-selected-range · P1 · Selected range

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** paired date inputs. **Proposed default:** Empty.
- **Validation / dependencies:** Both dates valid and start not after end
- **Preview acceptance:** Both trigger values and range highlight agree
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-date-range-default-date-format-and-locale · P1 · Date format and locale

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** structured format settings. **Proposed default:** Existing format.
- **Validation / dependencies:** Match input parsing and accessible date names
- **Preview acceptance:** Both endpoints use the same format rules
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-date-range-default-minimum-maximum-range · P1 · Minimum/maximum range

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** paired duration inputs. **Proposed default:** No additional limit.
- **Validation / dependencies:** Nonnegative ordered durations in explicit units
- **Preview acceptance:** Disallowed ranges are explained and cannot be committed
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-date-range-default-disabled-dates · P1 · Disabled dates

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** date/range editor. **Proposed default:** None.
- **Validation / dependencies:** Range crossing a disabled day follows an explicit policy
- **Preview acceptance:** Calendar and range validation agree
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-date-range-default-partial-range-policy · P2 · Partial range policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Require both endpoints.
- **Validation / dependencies:** Define open-ended ranges explicitly
- **Preview acceptance:** Empty end date is not confused with malformed input
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-date-range-default-required-error-messages · P1 · Required/error messages

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and linked text. **Proposed default:** Optional.
- **Validation / dependencies:** Differentiate missing start, missing end and reversed order
- **Preview acceptance:** Errors point to the endpoint that needs correction
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [date-range-default.json](pages/date-range-default.json).

### 25. Description — description-default.html

**Entry:** [description-default.html](../../description-default.html). **Category:** Components · Data Display · Description. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [description-detail.js](../../description-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-25-01 | Size | description-size-mount | multiselect | ["large"] | Small = small; Middle = middle; Large = large | Available by default |
| CTRL-25-02 | Columns | description-columns-select | select | 2 | 1 = 1; 2 = 2; 3 = 3 | Available by default |
| CTRL-25-03 | Section title | description-title | text | Account details | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Columns:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.
- **Section title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Default, Bordered; states: Compact, With title, Long value. Default rendered cells: 6. Dedicated interaction markup: none found.

**Property-change evidence:** 5 cases; 5 changed preview DOM; 5 changed prompt; 5 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Section title to `Reload audit Description`; after reload observed `Account details`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 634 px; Live Preview top 1199 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-description-default-description-items · P1 · Description items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable term/value list. **Proposed default:** Current account example.
- **Validation / dependencies:** Each item needs a term and value or explicit missing value
- **Preview acceptance:** Actual product data replaces the fixed account fields
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-description-default-item-spans · P1 · Item spans

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-item number. **Proposed default:** One column.
- **Validation / dependencies:** Positive spans cannot exceed current column count
- **Preview acceptance:** Long rows span predictably without breaking term/value order
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-description-default-label-placement · P1 · Label placement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current placement.
- **Validation / dependencies:** Preserve semantic term/value association
- **Preview acceptance:** Horizontal and stacked labels work at narrow widths
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-description-default-missing-value-display · P1 · Missing-value display

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** Existing missing-value convention.
- **Validation / dependencies:** Distinguish absent from zero and empty string
- **Preview acceptance:** Missing values render consistently with Data Format
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-description-default-copyable-values · P2 · Copyable values

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-item toggle. **Proposed default:** False.
- **Validation / dependencies:** Copy actions have item-specific names and truthful feedback
- **Preview acceptance:** Copy only the intended value
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [description-default.json](pages/description-default.json).

### 26. Divider — divider-default.html

**Entry:** [divider-default.html](../../divider-default.html). **Category:** Components · Data Display · Divider. **Native properties:** 3. **Proposed atomic capabilities:** 4.

**Source:** Properties begins at HTML line 177; detail implementation: [divider-detail.js](../../divider-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-26-01 | Size | divider-size-mount | multiselect | ["medium"] | Small = small; Medium = medium; Large = large | Available by default |
| CTRL-26-02 | Text label | divider-text | text | OR | Free value / toggle | Available by default |
| CTRL-26-03 | Text alignment | divider-align-select | select | center | Left = left; Center = center; Right = right | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Text label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Text alignment:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.

**Preview coverage:** Horizontal, Horizontal with text; states: Solid, Dashed, Dotted. Default rendered cells: 6. Dedicated interaction markup: none found.

**Property-change evidence:** 5 cases; 5 changed preview DOM; 5 changed prompt; 5 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Text label to `Reload audit Divider`; after reload observed `OR`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 658 px; Live Preview top 1247 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-divider-default-orientation · P1 · Orientation

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Horizontal.
- **Validation / dependencies:** Horizontal or vertical with appropriate context
- **Preview acceptance:** Configure one intended divider rather than only fixed variants
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-divider-default-line-style · P1 · Line style

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current Foundation border style.
- **Validation / dependencies:** Use supported line styles and preserve contrast
- **Preview acceptance:** Line style changes without overriding unrelated Foundation values
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-divider-default-label-placement-offset · P2 · Label placement offset

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** token or dimension picker. **Proposed default:** Current alignment spacing.
- **Validation / dependencies:** Bound offset to the available width
- **Preview acceptance:** Authored text placement works with long labels
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-divider-default-decorative-semantics · P1 · Decorative semantics

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** Context-dependent.
- **Validation / dependencies:** Distinguish structural separator from decoration
- **Preview acceptance:** Export role/orientation only when appropriate
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [divider-default.json](pages/divider-default.json).

### 27. Drawer — drawer-default.html

**Entry:** [drawer-default.html](../../drawer-default.html). **Category:** Components · Feedback · Drawer. **Native properties:** 5. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [drawer-detail.js](../../drawer-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-27-01 | Corner radius | drawer-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-27-02 | Size | drawer-size-select | select | medium | Small = small; Medium = medium; Large = large | Available by default |
| CTRL-27-03 | Title | drawer-title | text | Edit profile | Free value / toggle | Available by default |
| CTRL-27-04 | Body | drawer-body | text | Update your name, photo, and contact details. | Free value / toggle | Available by default |
| CTRL-27-05 | Show close button | drawer-show-close | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Size:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.
- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Body:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show close button:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Right, Left, Top, Bottom; states: Default, No footer, No close. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 9 cases; 9 changed preview DOM; 9 changed prompt; 9 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Title to `Reload audit Drawer`; after reload observed `Edit profile`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 807 px; Live Preview top 1420 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-drawer-default-placement · P1 · Placement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current example placement.
- **Validation / dependencies:** Top, bottom and logical start/end with RTL behavior
- **Preview acceptance:** Chosen edge controls animation and panel position
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-drawer-default-open-value · P1 · Open value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** Open demo.
- **Validation / dependencies:** Keep open state separate from content and disabled state
- **Preview acceptance:** Drawer opens and closes in a real interaction specimen
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-drawer-default-footer-actions · P1 · Footer actions

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable labelled action list. **Proposed default:** Current example actions.
- **Validation / dependencies:** Define primary/cancel intent and pending behavior
- **Preview acceptance:** Footer labels and actions are authored rather than fixed
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-drawer-default-mask-close-policy · P1 · Mask close policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** Explicit project policy.
- **Validation / dependencies:** Do not accidentally discard unfinished work
- **Preview acceptance:** Clicking outside follows the configured rule
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-drawer-default-escape-focus-return-policy · P1 · Escape/focus return policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** structured behavior controls. **Proposed default:** Escape closes and returns focus where appropriate.
- **Validation / dependencies:** Preserve focus containment and a named trigger
- **Preview acceptance:** Keyboard open/close returns to the correct element
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-drawer-default-custom-width-height · P2 · Custom width/height

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** dimensions and responsive rule. **Proposed default:** Existing size preset.
- **Validation / dependencies:** Clamp to viewport and respect safe edges
- **Preview acceptance:** Large content scrolls inside a usable drawer
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [drawer-default.json](pages/drawer-default.json).

### 28. Dropdown — dropdown-default.html

**Entry:** [dropdown-default.html](../../dropdown-default.html). **Category:** Components · Navigation · Dropdown. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [dropdown-detail.js](../../dropdown-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-28-01 | Size | dropdown-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-28-02 | Corner radius | dropdown-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-28-03 | Label | dropdown-label | text | Options | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Outlined, Filled; states: Rest, Hover, Open, Focused, Disabled. Default rendered cells: 10. Dedicated interaction markup: dropdown-interactive-mount, dropdown-interactive-status.

**Property-change evidence:** 12 cases; 12 changed preview DOM; 12 changed prompt; 12 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Label to `Reload audit Dropdown`; after reload observed `Options`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 610 px; Live Preview top 1175 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-dropdown-default-menu-items · P1 · Menu items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** reorderable item editor. **Proposed default:** Existing option labels.
- **Validation / dependencies:** Stable item IDs, label and disabled/destructive metadata
- **Preview acceptance:** Add, remove and reorder the real command list
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-dropdown-default-trigger-mode · P1 · Trigger mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Click.
- **Validation / dependencies:** Pointer and keyboard activation must both work
- **Preview acceptance:** Trigger behavior matches the selected mode
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-dropdown-default-placement · P1 · Placement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Automatic.
- **Validation / dependencies:** Keep the menu visible at viewport edges
- **Preview acceptance:** Open specimen repositions without clipping
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-dropdown-default-selected-checked-item · P2 · Selected/checked item

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item selector. **Proposed default:** None.
- **Validation / dependencies:** Selection mode must be declared
- **Preview acceptance:** Checked items use appropriate menu-item semantics
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-dropdown-default-item-icon-and-shortcut · P2 · Item icon and shortcut

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-item icon/text controls. **Proposed default:** None.
- **Validation / dependencies:** Shortcuts need real documented meaning and decorative icon treatment
- **Preview acceptance:** Authored icons/shortcuts appear with the correct items
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [dropdown-default.json](pages/dropdown-default.json).

### 29. Empty — empty-default.html

**Entry:** [empty-default.html](../../empty-default.html). **Category:** Components · Data Display · Empty. **Native properties:** 3. **Proposed atomic capabilities:** 4.

**Source:** Properties begins at HTML line 177; detail implementation: [empty-detail.js](../../empty-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-29-01 | Title | empty-title | text | No projects yet | Free value / toggle | Available by default |
| CTRL-29-02 | Description | empty-description | text | Create your first project to get started. | Free value / toggle | Available by default |
| CTRL-29-03 | Action label | empty-action-label | text | Create project | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Description:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Action label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Default, Simple; states: Title only, With description, With action. Default rendered cells: 6. Dedicated interaction markup: none found.

**Property-change evidence:** 3 cases; 3 changed preview DOM; 3 changed prompt; 3 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Title to `Reload audit Empty`; after reload observed `No projects yet`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 610 px; Live Preview top 1199 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-empty-default-illustration-reference · P1 · Illustration reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** asset or icon picker. **Proposed default:** Existing illustration.
- **Validation / dependencies:** Decorative images have empty alt and meaningful images have useful descriptions
- **Preview acceptance:** Change the illustration without editing HTML
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-empty-default-show-action · P1 · Show action

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** True when an action label exists.
- **Validation / dependencies:** Hide both visual control and interactive target when disabled
- **Preview acceptance:** Empty state can intentionally have no action
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-empty-default-action-intent · P1 · Action intent

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** action metadata or URL. **Proposed default:** Current example intent.
- **Validation / dependencies:** Destination/action must be explicit and valid
- **Preview acceptance:** Copied component knows what the authored action represents
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-empty-default-secondary-action · P2 · Secondary action

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** optional action editor. **Proposed default:** None.
- **Validation / dependencies:** Keep hierarchy subordinate to the primary action
- **Preview acceptance:** Add a help or reset route without competing primary buttons
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [empty-default.json](pages/empty-default.json).

### 30. Float Button — float-button-default.html

**Entry:** [float-button-default.html](../../float-button-default.html). **Category:** Components · Actions · Float Button. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [float-button-detail.js](../../float-button-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-30-01 | Size | floatbutton-size-mount | multiselect | ["48"] | 40px - Small = 40; 48px - Default = 48; 56px - Large = 56; 64px - XL = 64 | Available by default |
| CTRL-30-02 | Tooltip text | floatbutton-tooltip | text | Back to top | Free value / toggle | Available by default |
| CTRL-30-03 | Show badge | floatbutton-show-badge | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Tooltip text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show badge:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Default, Primary, Square; states: Rest, Hover, Focused, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 5 cases; 5 changed preview DOM; 5 changed prompt; 5 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Tooltip text to `Reload audit Float Button`; after reload observed `Back to top`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 602 px; Live Preview top 1215 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-float-button-default-action-icon-reference · P1 · Action icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** icon picker. **Proposed default:** Current example icon.
- **Validation / dependencies:** Icon-only action requires a purpose-specific accessible name
- **Preview acceptance:** Swap the action icon without changing unrelated badges
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-float-button-default-accessible-action-name · P1 · Accessible action name

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** Current action meaning.
- **Validation / dependencies:** Never rely only on tooltip visibility
- **Preview acceptance:** Button remains named with the tooltip closed
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-float-button-default-placement-and-offset · P1 · Placement and offset

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** logical corner and dimensions. **Proposed default:** Existing bottom corner.
- **Validation / dependencies:** Respect safe areas, RTL and other overlays
- **Preview acceptance:** Floating action stays reachable without covering important content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-float-button-default-badge-value · P1 · Badge value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number or text. **Proposed default:** Current example badge.
- **Validation / dependencies:** Follow count/max/zero rules
- **Preview acceptance:** Authored badge content appears independently of visibility
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-float-button-default-group-actions · P2 · Group actions

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** action list. **Proposed default:** None.
- **Validation / dependencies:** Each action needs its own name and focus order
- **Preview acceptance:** A floating group uses actual authored actions
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [float-button-default.json](pages/float-button-default.json).

### 31. Group Button — group-button-default.html

**Entry:** [group-button-default.html](../../group-button-default.html). **Category:** Components · Actions · Group Button. **Native properties:** 7. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [group-button-detail.js](../../group-button-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-31-01 | Size | group-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-31-02 | Corner radius | group-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-31-03 | Number of buttons | group-count-select | select | 3 | 1 = 1; 2 = 2; 3 = 3; 4 = 4; 5 = 5; 6 = 6; 7 = 7; 8 = 8; 9 = 9 | Available by default |
| CTRL-31-04 | Field label | group-show-label | checkbox | false | Free value / toggle | Available by default |
| CTRL-31-05 | Field label text | group-field-label | text | View | Free value / toggle | Conditional prerequisite |
| CTRL-31-06 | Supporting text | group-show-supporting | checkbox | false | Free value / toggle | Available by default |
| CTRL-31-07 | Supporting text | group-supporting-text | text | Choose how to display your results. | Free value / toggle | Conditional prerequisite |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Number of buttons:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.
- **Field label:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.
- **Field label text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Supporting text:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.
- **Supporting text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Outlined, Filled; states: Rest, Hover, Pressed, Selected, Focused, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 23 cases; 23 changed preview DOM; 23 changed prompt; 15 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Number of buttons.

**Reload probe:** changed Size to `["24"]`; after reload observed `["40"]`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 799 px; Live Preview top 1388 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-group-button-default-button-items · P1 · Button items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** labelled item editor. **Proposed default:** Current generated item labels.
- **Validation / dependencies:** Stable item IDs, labels and optional icon references
- **Preview acceptance:** Each segment can have its own real product label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-group-button-default-selection-mode · P1 · Selection mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Single selection.
- **Validation / dependencies:** Single or multiple or action group must be explicit
- **Preview acceptance:** Selection behavior matches the chosen mode
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-group-button-default-selected-values · P1 · Selected values

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item selector. **Proposed default:** Current first selection.
- **Validation / dependencies:** Selected IDs must exist and obey selection mode
- **Preview acceptance:** Preview can inspect the user's intended selection
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-group-button-default-orientation · P2 · Orientation

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Horizontal.
- **Validation / dependencies:** Vertical retains reading and keyboard order
- **Preview acceptance:** Layout changes without changing item identity
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-group-button-default-per-item-disabled-state · P1 · Per-item disabled state

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item toggles. **Proposed default:** None.
- **Validation / dependencies:** Disabled segments cannot activate
- **Preview acceptance:** Mixed enabled/disabled groups are testable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [group-button-default.json](pages/group-button-default.json).

### 32. Image — image-default.html

**Entry:** [image-default.html](../../image-default.html). **Category:** Components · Data Display · Image. **Native properties:** 3. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [image-detail.js](../../image-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-32-01 | Corner radius | image-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-32-02 | Aspect ratio | image-aspect-select | select | square | Square = square; Landscape = landscape; Portrait = portrait | Available by default |
| CTRL-32-03 | Caption text | image-caption | text | Product photo | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Aspect ratio:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.
- **Caption text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Default, With caption; states: Loaded, Loading, Error, Hover. Default rendered cells: 8. Dedicated interaction markup: none found.

**Property-change evidence:** 7 cases; 7 changed preview DOM; 7 changed prompt; 7 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Caption text to `Reload audit Image`; after reload observed `Product photo`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 610 px; Live Preview top 1199 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-image-default-image-source · P1 · Image source

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** URL or asset picker. **Proposed default:** Existing placeholder.
- **Validation / dependencies:** Supported file types and an explicit load-failure path
- **Preview acceptance:** Author can preview their own actual image
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-image-default-alternative-text · P1 · Alternative text

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and decoration toggle. **Proposed default:** Context-dependent.
- **Validation / dependencies:** Require appropriate text for meaningful images
- **Preview acceptance:** Informative image remains understandable without pixels
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-image-default-object-fit · P1 · Object fit

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current fit.
- **Validation / dependencies:** Cover or contain with an explained crop
- **Preview acceptance:** Image framing responds correctly to aspect ratio
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-image-default-object-position · P2 · Object position

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** focal-point picker. **Proposed default:** Center.
- **Validation / dependencies:** Keep focal point within the image bounds
- **Preview acceptance:** Important subject remains visible when cropped
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-image-default-fallback-image · P1 · Fallback image

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** asset picker. **Proposed default:** Current error illustration.
- **Validation / dependencies:** Do not create an endless fallback error loop
- **Preview acceptance:** Failed source produces the configured fallback
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-image-default-preview-lightbox-behavior · P2 · Preview/lightbox behavior

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** Existing demo policy.
- **Validation / dependencies:** Provide keyboard close and focus return
- **Preview acceptance:** Enlarged image interaction is actually usable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [image-default.json](pages/image-default.json).

### 33. Input Text Field — input-text-field.html

**Entry:** [input-text-field.html](../../input-text-field.html). **Category:** Components · Forms · Input. **Native properties:** 7. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [input-detail.js](../../input-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-33-01 | Size | input-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-33-02 | Corner radius | input-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-33-03 | Label | input-label | text | Email address | Free value / toggle | Available by default |
| CTRL-33-04 | Placeholder | input-placeholder | text | you@example.com | Free value / toggle | Available by default |
| CTRL-33-05 | Leading icon | input-leading-icon | checkbox | false | Free value / toggle | Available by default |
| CTRL-33-06 | Trailing icon | input-trailing-icon | checkbox | false | Free value / toggle | Available by default |
| CTRL-33-07 | Allow clear | input-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Leading icon:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.
- **Trailing icon:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled, Underlined; states: Rest, Hover, Focused, Filled, Error, Disabled. Default rendered cells: 18. Dedicated interaction markup: none found.

**Property-change evidence:** 16 cases; 16 changed preview DOM; 16 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Leading icon, Trailing icon, Allow clear.

**Reload probe:** changed Label to `Reload audit Input Text Field`; after reload observed `Email address`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 494 px, height 972 px; Live Preview top 1489 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-input-text-field-input-value · P1 · Input value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** Empty.
- **Validation / dependencies:** Value must remain independent of label and placeholder
- **Preview acceptance:** Current value appears in preview and is exported
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-input-text-field-native-input-type · P1 · Native input type

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Text.
- **Validation / dependencies:** Use supported types with compatible formatting
- **Preview acceptance:** Email/URL/text/password intent yields correct native semantics
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-input-text-field-required · P1 · Required

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Associate required and error instructions programmatically
- **Preview acceptance:** Required marking and validation behavior agree
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-input-text-field-helper-error-text · P1 · Helper/error text

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** two linked text fields. **Proposed default:** Current example messages.
- **Validation / dependencies:** Show appropriate message without replacing the visible label
- **Preview acceptance:** User-authored messages render and export with stable IDs
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-input-text-field-read-only · P1 · Read-only

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Keep readable content selectable while preventing edits
- **Preview acceptance:** Read-only differs from disabled
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-input-text-field-leading-trailing-icon-reference · P2 · Leading/trailing icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** named icon pickers. **Proposed default:** Current example icons.
- **Validation / dependencies:** Icons obey slot visibility and accessible decoration rules
- **Preview acceptance:** Visible icon can be changed beyond a Boolean on/off flag
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [input-text-field.json](pages/input-text-field.json).

### 34. List — list-default.html

**Entry:** [list-default.html](../../list-default.html). **Category:** Components · Data Display · List. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [list-detail.js](../../list-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-34-01 | Corner radius | list-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-34-02 | Size | list-size-mount | multiselect | ["default"] | Small = small; Default = default; Large = large | Available by default |
| CTRL-34-03 | Show dividers | list-show-dividers | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Show dividers:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Default, Bordered; states: Default, With avatars, With avatars + action, Loading. Default rendered cells: 8. Dedicated interaction markup: none found.

**Fixed data/source evidence:**

- [list-detail.js](../../list-detail.js), line 80: `var ROWS_DATA = [`

**Property-change evidence:** 7 cases; 7 changed preview DOM; 7 changed prompt; 7 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Corner radius to `["0"]`; after reload observed `["8"]`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 602 px; Live Preview top 1191 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-list-default-list-items · P1 · List items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** structured item editor. **Proposed default:** Current sample people.
- **Validation / dependencies:** Stable IDs with title, description and optional media
- **Preview acceptance:** List contains the user's actual items
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-list-default-item-actions · P1 · Item actions

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-item action list. **Proposed default:** None.
- **Validation / dependencies:** Item-specific action names and stable intents
- **Preview acceptance:** Repeated row actions remain distinguishable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-list-default-selection-mode · P1 · Selection mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** None.
- **Validation / dependencies:** Single/multiple selection use correct semantics
- **Preview acceptance:** Selected items can be configured and exercised
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-list-default-layout · P2 · Layout

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current vertical list.
- **Validation / dependencies:** Preserve reading order at breakpoints
- **Preview acceptance:** Horizontal/grid arrangements adapt to width
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-list-default-empty-loading-messages · P1 · Empty/loading messages

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** linked text and state controls. **Proposed default:** Existing examples.
- **Validation / dependencies:** Separate no content from loading and failure
- **Preview acceptance:** Authored fallback content appears in appropriate states
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [list-default.json](pages/list-default.json).

### 35. Mention — mention-default.html

**Entry:** [mention-default.html](../../mention-default.html). **Category:** Components · Forms · Mention. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [mention-detail.js](../../mention-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-35-01 | Size | mention-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-35-02 | Corner radius | mention-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-35-03 | Label | mention-label | text | Comment | Free value / toggle | Available by default |
| CTRL-35-04 | Placeholder | mention-placeholder | text | Type @ to mention someone | Free value / toggle | Available by default |
| CTRL-35-05 | Allow clear | mention-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled; states: Rest, Hover, Focus, Open, Filled, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 14 cases; 14 changed preview DOM; 14 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Allow clear.

**Reload probe:** changed Label to `Reload audit Mention`; after reload observed `Comment`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 783 px; Live Preview top 1348 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-mention-default-mention-candidates · P1 · Mention candidates

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable user/entity list. **Proposed default:** Current examples.
- **Validation / dependencies:** Stable ID, display label and insertion value
- **Preview acceptance:** The suggestion panel uses actual author-provided candidates
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-mention-default-input-value · P1 · Input value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** multiline text. **Proposed default:** Empty.
- **Validation / dependencies:** Preserve committed mention IDs separately from display text
- **Preview acceptance:** Value can contain authored mentions and surrounding text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-mention-default-trigger-characters · P1 · Trigger characters

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** list of characters. **Proposed default:** At sign.
- **Validation / dependencies:** Prevent empty/ambiguous triggers and document escaping
- **Preview acceptance:** Different triggers open the correct candidate source
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-mention-default-search-policy · P2 · Search policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select and threshold. **Proposed default:** Local filtering.
- **Validation / dependencies:** State when and how matching occurs
- **Preview acceptance:** Query and empty results are testable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-mention-default-helper-error-rules · P1 · Helper/error rules

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** linked text and validation controls. **Proposed default:** Optional.
- **Validation / dependencies:** Keep errors associated with the field
- **Preview acceptance:** Invalid mention values get an actionable message
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [mention-default.json](pages/mention-default.json).

### 36. Menu — menu-default.html

**Entry:** [menu-default.html](../../menu-default.html). **Category:** Components · Navigation · Menu. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [menu-detail.js](../../menu-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-36-01 | Size | menu-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-36-02 | Corner radius | menu-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-36-03 | Labels | menu-label | text | Edit, Duplicate, Archive, Delete | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Labels:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Default, With icons; states: Rest, Hover, Focused, Disabled. Default rendered cells: 8. Dedicated interaction markup: none found.

**Property-change evidence:** 12 cases; 12 changed preview DOM; 12 changed prompt; 12 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Labels to `Reload audit Menu`; after reload observed `Edit, Duplicate, Archive, Delete`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 634 px; Live Preview top 1223 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-menu-default-structured-items · P1 · Structured items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** tree/item editor. **Proposed default:** Existing labels.
- **Validation / dependencies:** Stable IDs and item/group/submenu types
- **Preview acceptance:** Add submenus, groups and real commands rather than comma-separated text alone
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-menu-default-selected-item · P1 · Selected item

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item selector. **Proposed default:** None.
- **Validation / dependencies:** Reference an existing selectable item
- **Preview acceptance:** Current route/selection has the correct semantics
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-menu-default-expanded-submenus · P1 · Expanded submenus

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item selector. **Proposed default:** Current examples.
- **Validation / dependencies:** Only submenu IDs may be expanded
- **Preview acceptance:** Expansion follows authored hierarchy
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-menu-default-item-destinations-actions · P1 · Item destinations/actions

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-item metadata. **Proposed default:** Existing example intent.
- **Validation / dependencies:** Links and commands retain distinct semantics
- **Preview acceptance:** Authored menu can support real navigation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-menu-default-per-item-disabled-destructive-state · P1 · Per-item disabled/destructive state

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item controls. **Proposed default:** None.
- **Validation / dependencies:** Destructive meaning cannot rely only on color
- **Preview acceptance:** Item behavior matches its declared state
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [menu-default.json](pages/menu-default.json).

### 37. Modal — modal-default.html

**Entry:** [modal-default.html](../../modal-default.html). **Category:** Components · Feedback · Modal. **Native properties:** 5. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [modal-detail.js](../../modal-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-37-01 | Corner radius | modal-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-37-02 | Size | modal-size-select | select | medium | Small = small; Medium = medium; Large = large | Available by default |
| CTRL-37-03 | Title | modal-title | text | Delete this file? | Free value / toggle | Available by default |
| CTRL-37-04 | Body | modal-body | text | This action cannot be undone. | Free value / toggle | Available by default |
| CTRL-37-05 | Show close button | modal-show-close | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Size:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.
- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Body:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show close button:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Default, Destructive; states: Default, No footer, Scrollable, No close. Default rendered cells: 8. Dedicated interaction markup: none found.

**Property-change evidence:** 9 cases; 9 changed preview DOM; 9 changed prompt; 9 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Title to `Reload audit Modal`; after reload observed `Delete this file?`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 807 px; Live Preview top 1420 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-modal-default-open-state-and-trigger · P1 · Open state and trigger

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle with trigger label. **Proposed default:** Closed interactive specimen.
- **Validation / dependencies:** Opening and closing must preserve a meaningful focus return target
- **Preview acceptance:** User can test a real dialog rather than a fixed open snapshot
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-modal-default-primary-action-label · P1 · Primary action label

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** Current example primary label.
- **Validation / dependencies:** Nonempty when primary action is present
- **Preview acceptance:** Export and preview use the user's actual action wording
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-modal-default-secondary-action-label · P1 · Secondary action label

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Current example secondary label.
- **Validation / dependencies:** Secondary intent and visibility must be explicit
- **Preview acceptance:** Footer adapts without empty interactive controls
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-modal-default-footer-content · P1 · Footer content

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** slot or action editor. **Proposed default:** Current footer.
- **Validation / dependencies:** Support no footer without losing a close route
- **Preview acceptance:** Modal can host the intended product-specific actions
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-modal-default-mask-escape-policy · P1 · Mask/Escape policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** behavior toggles. **Proposed default:** Context-appropriate close policy.
- **Validation / dependencies:** Preserve changes or warn before destructive dismissal
- **Preview acceptance:** Each dismissal route follows the same policy
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-modal-default-initial-focus-target · P1 · Initial focus target

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** part selector. **Proposed default:** Safe logical target.
- **Validation / dependencies:** Target must exist and be focusable in the open dialog
- **Preview acceptance:** Keyboard starts in the intended part and stays contained
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [modal-default.json](pages/modal-default.json).

### 38. Notification — notification-default.html

**Entry:** [notification-default.html](../../notification-default.html). **Category:** Components · Feedback · Notification. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [notification-detail.js](../../notification-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-38-01 | Title | notification-title | text | File uploaded | Free value / toggle | Available by default |
| CTRL-38-02 | Description | notification-description | text | team-report.pdf is ready to share. | Free value / toggle | Available by default |
| CTRL-38-03 | Placement | notification-placement-select | select | topRight | Top right = topRight; Top left = topLeft; Bottom right = bottomRight; Bottom left = bottomLeft | Available by default |

**Existing-control usability improvements:**

- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Description:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placement:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.

**Preview coverage:** Info, Success, Warning, Error; states: Default, With action, Stacked. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 5 cases; 2 changed preview DOM; 5 changed prompt; 2 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Placement.

**Reload probe:** changed Title to `Reload audit Notification`; after reload observed `File uploaded`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 610 px; Live Preview top 1223 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-notification-default-severity · P1 · Severity

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current example.
- **Validation / dependencies:** Supported semantic status with non-color cue
- **Preview acceptance:** Inspect a chosen notification status
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-notification-default-auto-dismiss-duration · P1 · Auto-dismiss duration

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number and persistent toggle. **Proposed default:** Current demo policy.
- **Validation / dependencies:** Nonnegative duration and an explicit persistent mode
- **Preview acceptance:** Timing and pause behavior are testable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-notification-default-closable · P1 · Closable

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** True where appropriate.
- **Validation / dependencies:** A persistent notice needs a clear dismiss route unless intentionally blocking
- **Preview acceptance:** Close behavior is configurable and named
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-notification-default-action-label-intent · P1 · Action label/intent

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** action editor. **Proposed default:** None.
- **Validation / dependencies:** User action must have a valid stable intent
- **Preview acceptance:** Optional action is not hardcoded example content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-notification-default-announcement-priority · P2 · Announcement priority

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Context-dependent.
- **Validation / dependencies:** Avoid treating routine completion as an assertive alert
- **Preview acceptance:** Copied semantics match the notification's urgency
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [notification-default.json](pages/notification-default.json).

### 39. Number — number-default.html

**Entry:** [number-default.html](../../number-default.html). **Category:** Components · Forms · Number. **Native properties:** 6. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [number-detail.js](../../number-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-39-01 | Size | number-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-39-02 | Corner radius | number-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-39-03 | Label | number-label | text | Quantity | Free value / toggle | Available by default |
| CTRL-39-04 | Placeholder | number-placeholder | text | 0 | Free value / toggle | Available by default |
| CTRL-39-05 | Show stepper | number-show-stepper | checkbox | true | Free value / toggle | Available by default |
| CTRL-39-06 | Allow clear | number-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show stepper:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled, Underlined; states: Rest, Hover, Focused, Filled, Error, Disabled. Default rendered cells: 18. Dedicated interaction markup: none found.

**Property-change evidence:** 15 cases; 15 changed preview DOM; 15 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Show stepper, Allow clear.

**Reload probe:** changed Label to `Reload audit Number`; after reload observed `Quantity`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 518 px, height 865 px; Live Preview top 1407 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-number-default-numeric-value · P1 · Numeric value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number input. **Proposed default:** Empty.
- **Validation / dependencies:** Accept only a valid finite number or declared empty value
- **Preview acceptance:** Value is independent of placeholder and updates the specimen
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-number-default-minimum · P1 · Minimum

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** None.
- **Validation / dependencies:** Cannot exceed maximum
- **Preview acceptance:** Decrement and typed validation respect the lower bound
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-number-default-maximum · P1 · Maximum

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** None.
- **Validation / dependencies:** Cannot be lower than minimum
- **Preview acceptance:** Increment and typed validation respect the upper bound
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-number-default-step · P1 · Step

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** One.
- **Validation / dependencies:** Positive nonzero increment with defined rounding
- **Preview acceptance:** Stepper uses the declared increment
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-number-default-precision-format · P2 · Precision/format

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** integer and format selector. **Proposed default:** Existing Data Format.
- **Validation / dependencies:** Nonnegative precision and no hidden unit conversion
- **Preview acceptance:** Displayed and exported numeric values round-trip predictably
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-number-default-required-error-rules · P1 · Required/error rules

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and text. **Proposed default:** Optional.
- **Validation / dependencies:** Distinguish empty from zero
- **Preview acceptance:** Missing and out-of-range values show specific errors
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [number-default.json](pages/number-default.json).

### 40. Pagination — pagination-default.html

**Entry:** [pagination-default.html](../../pagination-default.html). **Category:** Components · Navigation · Pagination. **Native properties:** 2. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [pagination-detail.js](../../pagination-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-40-01 | Size | pagination-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-40-02 | Corner radius | pagination-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.

**Preview coverage:** Numbered, Simple; states: Rest, Hover, Focused, Disabled. Default rendered cells: 8. Dedicated interaction markup: none found.

**Property-change evidence:** 11 cases; 11 changed preview DOM; 11 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Size to `["24"]`; after reload observed `["40"]`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 567 px; Live Preview top 1133 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-pagination-default-current-page · P1 · Current page

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** Existing example page.
- **Validation / dependencies:** Integer from one through the computed last page
- **Preview acceptance:** Active page and navigation disabled states update together
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-pagination-default-total-items · P1 · Total items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** Current fixture total.
- **Validation / dependencies:** Nonnegative integer
- **Preview acceptance:** Page count follows total rather than a fixed demo list
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-pagination-default-page-size · P1 · Page size

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number or option list. **Proposed default:** Current fixture size.
- **Validation / dependencies:** Positive integer and a documented size-change policy
- **Preview acceptance:** Changing page size recomputes available pages
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-pagination-default-show-total-label · P1 · Show total label

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and format text. **Proposed default:** Current demo policy.
- **Validation / dependencies:** Explain total versus visible range
- **Preview acceptance:** Range text remains correct on first/last/empty pages
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-pagination-default-quick-jump · P2 · Quick jump

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Reject out-of-range page requests with feedback
- **Preview acceptance:** Jump control navigates to a valid page
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [pagination-default.json](pages/pagination-default.json).

### 41. Password — password-default.html

**Entry:** [password-default.html](../../password-default.html). **Category:** Components · Forms · Password. **Native properties:** 6. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [password-detail.js](../../password-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-41-01 | Size | password-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-41-02 | Corner radius | password-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-41-03 | Label | password-label | text | Password | Free value / toggle | Available by default |
| CTRL-41-04 | Placeholder | password-placeholder | text | Enter your password | Free value / toggle | Available by default |
| CTRL-41-05 | Show reveal toggle | password-show-reveal | checkbox | true | Free value / toggle | Available by default |
| CTRL-41-06 | Allow clear | password-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show reveal toggle:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled, Underlined; states: Rest, Hover, Focused, Filled, Error, Disabled. Default rendered cells: 18. Dedicated interaction markup: none found.

**Property-change evidence:** 15 cases; 15 changed preview DOM; 15 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Show reveal toggle, Allow clear.

**Reload probe:** changed Label to `Reload audit Password`; after reload observed `Password`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 518 px, height 865 px; Live Preview top 1407 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-password-default-password-value · P1 · Password value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** secure input. **Proposed default:** Empty.
- **Validation / dependencies:** Do not include real credentials in shared examples or automatic exports
- **Preview acceptance:** A synthetic value can be tested in masked and revealed modes
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-password-default-required · P1 · Required

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Associate the requirement with the input
- **Preview acceptance:** Missing password is distinct from a strength failure
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-password-default-minimum-maximum-length · P1 · Minimum/maximum length

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** paired integers. **Proposed default:** Project-defined.
- **Validation / dependencies:** Nonnegative ordered bounds with a clear policy
- **Preview acceptance:** Validation messages reflect the configured length rule
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-password-default-strength-help-text · P1 · Strength/help text

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and optional meter. **Proposed default:** None.
- **Validation / dependencies:** Avoid inventing a security guarantee from a visual strength meter
- **Preview acceptance:** Authored guidance appears without exposing a real password
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-password-default-autocomplete-purpose · P2 · Autocomplete purpose

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Context-dependent.
- **Validation / dependencies:** Distinguish current-password from new-password intent
- **Preview acceptance:** Export includes the correct browser-autofill hint
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [password-default.json](pages/password-default.json).

### 42. Pop Confirm — pop-confirm-default.html

**Entry:** [pop-confirm-default.html](../../pop-confirm-default.html). **Category:** Components · Feedback · Pop Confirm. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [pop-confirm-detail.js](../../pop-confirm-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-42-01 | Question text | popconfirm-question | text | Delete this item? | Free value / toggle | Available by default |
| CTRL-42-02 | Confirm label | popconfirm-confirm-label | text | Yes | Free value / toggle | Available by default |
| CTRL-42-03 | Cancel label | popconfirm-cancel-label | text | No | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Question text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Confirm label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Cancel label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Top, Bottom, Left, Right; states: Default, Destructive, With icon. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 3 cases; 3 changed preview DOM; 3 changed prompt; 3 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Question text to `Reload audit Pop Confirm`; after reload observed `Delete this item?`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 634 px; Live Preview top 1247 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-pop-confirm-default-open-trigger-behavior · P1 · Open/trigger behavior

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and trigger selector. **Proposed default:** Click.
- **Validation / dependencies:** Keyboard must expose the confirmation without hover dependence
- **Preview acceptance:** Test opening, confirming and cancelling a real popover
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-pop-confirm-default-placement · P1 · Placement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Automatic.
- **Validation / dependencies:** Keep the confirmation in view
- **Preview acceptance:** Chosen placement respects edges
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-pop-confirm-default-severity-icon · P1 · Severity/icon

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select and icon picker. **Proposed default:** Current warning meaning.
- **Validation / dependencies:** Destructive meaning also appears in text
- **Preview acceptance:** User can configure a safe versus destructive confirmation
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-pop-confirm-default-confirm-pending-state · P1 · Confirm pending state

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Prevent duplicate submission while pending
- **Preview acceptance:** Confirm action shows progress without losing Cancel/close policy
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-pop-confirm-default-dismissal-policy · P2 · Dismissal policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** behavior toggles. **Proposed default:** Explicit project policy.
- **Validation / dependencies:** Escape and outside click do not accidentally confirm
- **Preview acceptance:** Every dismissal route is testable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [pop-confirm-default.json](pages/pop-confirm-default.json).

### 43. Popover — popover-default.html

**Entry:** [popover-default.html](../../popover-default.html). **Category:** Components · Data Display · Popover. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [popover-detail.js](../../popover-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-43-01 | Trigger label | popover-trigger-label | text | Details | Free value / toggle | Available by default |
| CTRL-43-02 | Title | popover-title | text | Storage usage | Free value / toggle | Available by default |
| CTRL-43-03 | Body | popover-body | text | 8.2 GB of 15 GB used. | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Trigger label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Body:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Top, Bottom, Left, Right; states: Simple, With body, With close. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 3 cases; 3 changed preview DOM; 3 changed prompt; 3 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Trigger label to `Reload audit Popover`; after reload observed `Details`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 610 px; Live Preview top 1223 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-popover-default-trigger-behavior · P1 · Trigger behavior

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Click.
- **Validation / dependencies:** Keyboard equivalent required for pointer interactions
- **Preview acceptance:** Open/close behavior can be exercised from the trigger
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-popover-default-placement · P1 · Placement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Automatic.
- **Validation / dependencies:** Reposition within the available viewport
- **Preview acceptance:** Content remains visible beside edges
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-popover-default-open-state · P1 · Open state

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** Closed specimen.
- **Validation / dependencies:** Keep controlled open state separate from hover styling
- **Preview acceptance:** Author can inspect one open/closed state
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-popover-default-interactive-content · P1 · Interactive content

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** slot editor. **Proposed default:** Current text body.
- **Validation / dependencies:** Focusable descendants need a coherent focus/close policy
- **Preview acceptance:** Popover can contain actual links/actions rather than only plain text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-popover-default-maximum-width · P2 · Maximum width

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** dimension or token. **Proposed default:** Current sample width.
- **Validation / dependencies:** Bound width to the containing viewport
- **Preview acceptance:** Long content wraps without clipping controls
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [popover-default.json](pages/popover-default.json).

### 44. Progress — progress-default.html

**Entry:** [progress-default.html](../../progress-default.html). **Category:** Components · Feedback · Progress. **Native properties:** 2. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [progress-detail.js](../../progress-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-44-01 | Percent | progress-percent-input | number | 65 | Free value / toggle | min=0, max=100, step=None |
| CTRL-44-02 | Show label | progress-show-label | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Percent:** Declare units and semantic bounds, distinguish zero from empty, and show normalization/validation feedback. Do not add an arbitrary product limit without a reason.
- **Show label:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Linear, Circular; states: In progress, Success, Error. Default rendered cells: 6. Dedicated interaction markup: none found.

**Property-change evidence:** 3 cases; 3 changed preview DOM; 3 changed prompt; 3 changed legacy code. These counts are signals, not independent correctness scores.

**390 px geometry:** Properties top 566 px, height 631 px; Live Preview top 1221 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-progress-default-progress-mode · P1 · Progress mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current bar.
- **Validation / dependencies:** Determinate or indeterminate and compatible semantics
- **Preview acceptance:** Unknown progress is not represented as a fake percentage
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-progress-default-status · P1 · Status

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Normal.
- **Validation / dependencies:** Normal, success and exception use text plus color
- **Preview acceptance:** Status changes actual semantics and visible label
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-progress-default-shape · P1 · Shape

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current example.
- **Validation / dependencies:** Supported line/circle types only
- **Preview acceptance:** Choose the intended shape rather than exporting all examples
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-progress-default-stroke-thickness · P2 · Stroke thickness

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** dimension or token. **Proposed default:** Current stroke.
- **Validation / dependencies:** Positive thickness that fits the chosen shape
- **Preview acceptance:** Track and fill scale together
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-progress-default-accessible-progress-label · P1 · Accessible progress label

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** Context-specific task name.
- **Validation / dependencies:** Determinate progress has a useful name and valid value bounds
- **Preview acceptance:** Exported progress communicates task and completion
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [progress-default.json](pages/progress-default.json).

### 45. Radio — radio-default.html

**Entry:** [radio-default.html](../../radio-default.html). **Category:** Components · Forms · Radio. **Native properties:** 2. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [radio-detail.js](../../radio-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-45-01 | Size | radio-size-mount | multiselect | ["20"] | 16px - S = 16; 20px - M = 20; 24px - L = 24 | Available by default |
| CTRL-45-02 | Label | radio-label | text | Option A | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Standard, Card; states: Unchecked, Checked, Hover, Focused, Disabled. Default rendered cells: 10. Dedicated interaction markup: none found.

**Property-change evidence:** 3 cases; 3 changed preview DOM; 3 changed prompt; 2 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label.

**Reload probe:** changed Label to `Reload audit Radio`; after reload observed `Option A`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 543 px; Live Preview top 1109 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-radio-default-option-items · P1 · Option items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable option list. **Proposed default:** Existing example options.
- **Validation / dependencies:** Unique values with clear labels
- **Preview acceptance:** Group contains actual product choices
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-radio-default-selected-value · P1 · Selected value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** option picker. **Proposed default:** None or current example.
- **Validation / dependencies:** At most one selected option
- **Preview acceptance:** Preview reflects the intended current value
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-radio-default-group-name · P1 · Group name

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** Stable generated group name.
- **Validation / dependencies:** Nonempty and unique in a composite form
- **Preview acceptance:** Native radio inputs form the correct single-selection group
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-radio-default-required-error-rules · P1 · Required/error rules

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and text. **Proposed default:** Optional.
- **Validation / dependencies:** Associate an error with the labelled group
- **Preview acceptance:** Missing selection is recoverable on submit
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-radio-default-per-option-disabled · P1 · Per-option disabled

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item toggle. **Proposed default:** None.
- **Validation / dependencies:** Disabled options cannot be selected by keyboard or pointer
- **Preview acceptance:** Mixed groups remain understandable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [radio-default.json](pages/radio-default.json).

### 46. Rating — rating-default.html

**Entry:** [rating-default.html](../../rating-default.html). **Category:** Components · Forms · Rating. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [rating-detail.js](../../rating-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-46-01 | Icon size | rating-size-mount | multiselect | ["20"] | 16px - Small = 16; 20px - Default = 20; 24px - Large = 24; 32px - XL = 32 | Available by default |
| CTRL-46-02 | Label | rating-label | text | Rate this product | Free value / toggle | Available by default |
| CTRL-46-03 | Selected | rating-count-select | select | 3 | 0 = 0; 1 = 1; 2 = 2; 3 = 3; 4 = 4; 5 = 5 | Available by default |

**Existing-control usability improvements:**

- **Icon size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Selected:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.

**Preview coverage:** Star, Heart; states: Rest, Hover, Selected, Disabled. Default rendered cells: 8. Dedicated interaction markup: none found.

**Property-change evidence:** 9 cases; 9 changed preview DOM; 9 changed prompt; 9 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Label to `Reload audit Rating`; after reload observed `Rate this product`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 610 px; Live Preview top 1223 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-rating-default-maximum-rating · P1 · Maximum rating

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** integer. **Proposed default:** Five.
- **Validation / dependencies:** Positive bounded count with value no greater than maximum
- **Preview acceptance:** Number of rating choices follows the chosen scale
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-rating-default-allow-half-values · P1 · Allow half values

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Selected value must follow the configured step
- **Preview acceptance:** Half selections render and announce accurately
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-rating-default-read-only · P1 · Read-only

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Read-only summary differs from a disabled input
- **Preview acceptance:** Value remains understandable without suggesting editability
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-rating-default-icon-reference · P2 · Icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** icon picker. **Proposed default:** Existing star.
- **Validation / dependencies:** Shape choices retain the rating meaning and accessible names
- **Preview acceptance:** Author can replace the icon without editing SVG source
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-rating-default-per-value-descriptions · P1 · Per-value descriptions

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable text list. **Proposed default:** Current numeric labels.
- **Validation / dependencies:** One useful description for every selectable value
- **Preview acceptance:** Keyboard and screen-reader users receive meaningful choices
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [rating-default.json](pages/rating-default.json).

### 47. Result — result-default.html

**Entry:** [result-default.html](../../result-default.html). **Category:** Components · Feedback · Result. **Native properties:** 2. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [result-detail.js](../../result-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-47-01 | Title | result-title | text | Payment successful | Free value / toggle | Available by default |
| CTRL-47-02 | Description | result-description | text | Your receipt has been emailed to you. | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Description:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Info, Success, Warning, Error; states: Default, With secondary, Compact. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 2 cases; 2 changed preview DOM; 2 changed prompt; 2 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Title to `Reload audit Result`; after reload observed `Payment successful`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 495 px; Live Preview top 1109 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-result-default-result-status · P1 · Result status

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current example.
- **Validation / dependencies:** Supported success/error/warning/info types
- **Preview acceptance:** A single chosen result has matching icon and message
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-result-default-primary-action-label-intent · P1 · Primary action label/intent

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** action editor. **Proposed default:** Existing example action.
- **Validation / dependencies:** Require explicit intent and meaningful text
- **Preview acceptance:** Result can offer the actual next task
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-result-default-secondary-action · P1 · Secondary action

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** optional action editor. **Proposed default:** None.
- **Validation / dependencies:** Keep secondary hierarchy clear
- **Preview acceptance:** Offer back/help without duplicate primary actions
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-result-default-illustration-icon · P2 · Illustration/icon

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** asset or icon picker. **Proposed default:** Existing status illustration.
- **Validation / dependencies:** Match semantics or mark decoration correctly
- **Preview acceptance:** Asset is configurable without hardcoded markup
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-result-default-details-content · P1 · Details content

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text or slot. **Proposed default:** None.
- **Validation / dependencies:** Sensitive diagnostic details must not be automatically exposed
- **Preview acceptance:** Authored details are expandable and accessible where needed
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [result-default.json](pages/result-default.json).

### 48. Search — search-default.html

**Entry:** [search-default.html](../../search-default.html). **Category:** Components · Forms · Search. **Native properties:** 5. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [search-detail.js](../../search-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-48-01 | Size | search-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-48-02 | Corner radius | search-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-48-03 | Placeholder | search-placeholder | text | Search... | Free value / toggle | Available by default |
| CTRL-48-04 | Leading icon | search-leading-icon | checkbox | true | Free value / toggle | Available by default |
| CTRL-48-05 | Clear button | search-clear-button | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Leading icon:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.
- **Clear button:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled, Underlined; states: Rest, Hover, Focused, Filled, Error, Disabled. Default rendered cells: 18. Dedicated interaction markup: none found.

**Property-change evidence:** 14 cases; 14 changed preview DOM; 14 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Placeholder, Leading icon, Clear button.

**Reload probe:** changed Placeholder to `Reload audit Search`; after reload observed `Search...`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 494 px, height 847 px; Live Preview top 1364 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-search-default-query-value · P1 · Query value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text. **Proposed default:** Empty.
- **Validation / dependencies:** Preserve query independently from placeholder
- **Preview acceptance:** Entered query is reflected in preview and copied output
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-search-default-submission-trigger · P1 · Submission trigger

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Explicit submit.
- **Validation / dependencies:** Enter or button or debounced change must be clear
- **Preview acceptance:** Interaction specimen performs the declared trigger
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-search-default-debounce-delay · P2 · Debounce delay

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** Project-defined for live filtering.
- **Validation / dependencies:** Nonnegative milliseconds and only active for live mode
- **Preview acceptance:** Repeated typing coalesces updates appropriately
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-search-default-search-button-label · P1 · Search button label

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text and toggle. **Proposed default:** Current example.
- **Validation / dependencies:** Icon-only search still needs an accessible name
- **Preview acceptance:** Search can use product-specific action text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-search-default-loading-no-result-error-text · P1 · Loading/no-result/error text

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** linked state text controls. **Proposed default:** Current examples.
- **Validation / dependencies:** Distinguish pending, no matches and failed request
- **Preview acceptance:** Users can inspect realistic search feedback
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [search-default.json](pages/search-default.json).

### 49. Select — select-dropdown.html

**Entry:** [select-dropdown.html](../../select-dropdown.html). **Category:** Components · Forms · Select. **Native properties:** 5. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [select-detail.js](../../select-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-49-01 | Size | select-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-49-02 | Corner radius | select-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-49-03 | Label | select-label | text | Country | Free value / toggle | Available by default |
| CTRL-49-04 | Placeholder | select-placeholder | text | Select a country | Free value / toggle | Available by default |
| CTRL-49-05 | Allow clear | select-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled, Borderless, Underlined; states: Rest, Hover, Focused, Filled, Open, Error, Disabled, Loading. Default rendered cells: 32. Dedicated interaction markup: none found.

**Fixed data/source evidence:**

- [select-detail.js](../../select-detail.js), line 34: `var OPTION_DATA = ["Canada", "France", "Japan", "Kenya"];`

**Property-change evidence:** 14 cases; 14 changed preview DOM; 14 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Allow clear.

**Reload probe:** changed Label to `Reload audit Select`; after reload observed `Country`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 518 px, height 783 px; Live Preview top 1324 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-select-dropdown-options · P1 · Options

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable option list. **Proposed default:** Current country examples.
- **Validation / dependencies:** Stable unique values with label, optional group and disabled metadata
- **Preview acceptance:** User-authored choices replace the fixed countries
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-select-dropdown-selected-value · P1 · Selected value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** option picker. **Proposed default:** Empty.
- **Validation / dependencies:** Selected values must reference existing enabled options
- **Preview acceptance:** Trigger and selected menu item stay consistent
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-select-dropdown-selection-mode · P1 · Selection mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Single.
- **Validation / dependencies:** Single or multiple with explicit clear semantics
- **Preview acceptance:** Selected-value representation follows the mode
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-select-dropdown-searchable · P1 · Searchable

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Explain filtering and preserve accessible keyboard navigation
- **Preview acceptance:** Large option sets can be searched
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-select-dropdown-helper-error-required-rules · P1 · Helper/error/required rules

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** grouped field controls. **Proposed default:** Optional with no error.
- **Validation / dependencies:** Messages must be linked and meaningful
- **Preview acceptance:** Product-specific form validation is previewable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-select-dropdown-empty-loading-text · P2 · Empty/loading text

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** linked text fields. **Proposed default:** Current examples.
- **Validation / dependencies:** Never use the same message for no results and failed loading
- **Preview acceptance:** Each state displays authored feedback
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [select-dropdown.json](pages/select-dropdown.json).

### 50. Skeleton — skeleton-default.html

**Entry:** [skeleton-default.html](../../skeleton-default.html). **Category:** Components · Feedback · Skeleton. **Native properties:** 1. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [skeleton-detail.js](../../skeleton-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-50-01 | Rows | skeleton-rows-input | number | 3 | Free value / toggle | min=1, max=5, step=None |

**Existing-control usability improvements:**

- **Rows:** Declare units and semantic bounds, distinguish zero from empty, and show normalization/validation feedback. Do not add an arbitrary product limit without a reason.

**Preview coverage:** Text, Avatar + text, Card; states: Animated, Reduced motion. Default rendered cells: 6. Dedicated interaction markup: none found.

**Property-change evidence:** 2 cases; 2 changed preview DOM; 2 changed prompt; 2 changed legacy code. These counts are signals, not independent correctness scores.

**390 px geometry:** Properties top 566 px, height 501 px; Live Preview top 1090 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-skeleton-default-skeleton-structure · P1 · Skeleton structure

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable block list. **Proposed default:** Current text rows.
- **Validation / dependencies:** Supported text/avatar/image/control block types
- **Preview acceptance:** Placeholder geometry can match the real component anatomy
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-skeleton-default-line-widths · P1 · Line widths

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-row percentage list. **Proposed default:** Current example widths.
- **Validation / dependencies:** Percentages in a documented range and one value per row
- **Preview acceptance:** Different text lengths can be modeled without source edits
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-skeleton-default-animation · P1 · Animation

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** Respect reduced motion.
- **Validation / dependencies:** Animation stops under reduced-motion preferences
- **Preview acceptance:** Animated and static loading specimens are distinguishable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-skeleton-default-avatar-media-placeholder · P2 · Avatar/media placeholder

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and shape/size. **Proposed default:** None.
- **Validation / dependencies:** Decorative placeholders stay out of focus and accessible names
- **Preview acceptance:** User can model media alongside text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-skeleton-default-loading-announcement · P1 · Loading announcement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text or status policy. **Proposed default:** Context-appropriate.
- **Validation / dependencies:** Announce loading once without reading decorative blocks
- **Preview acceptance:** Copied semantics remain useful
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [skeleton-default.json](pages/skeleton-default.json).

### 51. Slider — slider-default.html

**Entry:** [slider-default.html](../../slider-default.html). **Category:** Components · Forms · Slider. **Native properties:** 3. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [slider-detail.js](../../slider-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-51-01 | Track thickness | slider-size-mount | multiselect | ["6"] | 4px - Thin = 4; 6px - Default = 6; 8px - Bold = 8; 10px - Heavy = 10 | Available by default |
| CTRL-51-02 | Label text | slider-label | text | Volume | Free value / toggle | Available by default |
| CTRL-51-03 | Value | slider-value | number | 60 | Free value / toggle | min=0, max=100, step=None |

**Existing-control usability improvements:**

- **Track thickness:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Value:** Declare units and semantic bounds, distinguish zero from empty, and show normalization/validation feedback. Do not add an arbitrary product limit without a reason.

**Preview coverage:** Single, Range; states: Rest, Hover, Focused, Disabled. Default rendered cells: 8. Dedicated interaction markup: none found.

**Property-change evidence:** 6 cases; 6 changed preview DOM; 6 changed prompt; 6 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Label text to `Reload audit Slider`; after reload observed `Volume`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 706 px; Live Preview top 1295 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-slider-default-minimum · P1 · Minimum

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** Zero.
- **Validation / dependencies:** Finite and less than maximum
- **Preview acceptance:** Scale begins at the authored bound
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-slider-default-maximum · P1 · Maximum

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** One hundred.
- **Validation / dependencies:** Finite and greater than minimum
- **Preview acceptance:** Scale ends at the authored bound
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-slider-default-step · P1 · Step

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** positive number. **Proposed default:** One.
- **Validation / dependencies:** Positive step compatible with bounds and value
- **Preview acceptance:** Keyboard and pointer movement follow the same increment
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-slider-default-range-mode · P1 · Range mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and endpoint values. **Proposed default:** Single value.
- **Validation / dependencies:** Ordered enabled endpoints inside bounds
- **Preview acceptance:** Two-thumb range can be configured and exercised
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-slider-default-marks · P1 · Marks

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable value/label list. **Proposed default:** None.
- **Validation / dependencies:** Mark values lie inside bounds
- **Preview acceptance:** Meaningful labelled stops appear at the right positions
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-slider-default-value-text-format · P2 · Value text format

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** format and unit text. **Proposed default:** Raw number.
- **Validation / dependencies:** Accessible value text describes units without replacing numeric semantics
- **Preview acceptance:** Volume, price and duration sliders announce useful values
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [slider-default.json](pages/slider-default.json).

### 52. Spin — spin-default.html

**Entry:** [spin-default.html](../../spin-default.html). **Category:** Components · Feedback · Spin. **Native properties:** 1. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [spin-detail.js](../../spin-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-52-01 | Label | spin-label-input | text | Loading... | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Small, Default, Large; states: Spinning, With label, Overlay. Default rendered cells: 9. Dedicated interaction markup: none found.

**Property-change evidence:** 1 cases; 1 changed preview DOM; 1 changed prompt; 1 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Label to `Reload audit Spin`; after reload observed `Loading...`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 501 px; Live Preview top 1090 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-spin-default-spinner-size · P1 · Spinner size

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** size or dimension picker. **Proposed default:** Current size.
- **Validation / dependencies:** Supported sizes fit the target and inline text
- **Preview acceptance:** Spinner can fit small controls and larger loading regions
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-spin-default-indicator-reference · P2 · Indicator reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** icon or approved slot. **Proposed default:** Existing spinner.
- **Validation / dependencies:** Avoid decorative indicator being read as meaningful content
- **Preview acceptance:** Indicator asset is configurable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-spin-default-delay · P1 · Delay

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** Zero.
- **Validation / dependencies:** Nonnegative milliseconds with clear cancellation behavior
- **Preview acceptance:** Brief loads can avoid unnecessary flashing
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-spin-default-loading-state · P1 · Loading state

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** True demo.
- **Validation / dependencies:** Busy state belongs to the intended region
- **Preview acceptance:** Specimen can transition between content and loading
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-spin-default-overlay-mode · P2 · Overlay mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and target region. **Proposed default:** Inline.
- **Validation / dependencies:** Do not block unrelated controls and preserve focus
- **Preview acceptance:** Overlay loading affects only the intended content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [spin-default.json](pages/spin-default.json).

### 53. Splitter — splitter-default.html

**Entry:** [splitter-default.html](../../splitter-default.html). **Category:** Components · Data Display · Splitter. **Native properties:** 3. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [splitter-detail.js](../../splitter-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-53-01 | First panel label | splitter-panel1-label | text | Sidebar | Free value / toggle | Available by default |
| CTRL-53-02 | Second panel label | splitter-panel2-label | text | Content | Free value / toggle | Available by default |
| CTRL-53-03 | Split ratio (%) | splitter-ratio | number | 35 | Free value / toggle | min=10, max=90, step=None |

**Existing-control usability improvements:**

- **First panel label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Second panel label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Split ratio (%):** Declare units and semantic bounds, distinguish zero from empty, and show normalization/validation feedback. Do not add an arbitrary product limit without a reason.

**Preview coverage:** Horizontal, Vertical; states: Default, Dragging, Collapsed. Default rendered cells: 6. Dedicated interaction markup: splitter-interactive.

**Property-change evidence:** 4 cases; 4 changed preview DOM; 4 changed prompt; 4 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed First panel label to `Reload audit Splitter`; after reload observed `Sidebar`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 610 px; Live Preview top 1199 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-splitter-default-orientation · P1 · Orientation

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current horizontal split.
- **Validation / dependencies:** Horizontal or vertical with correct separator semantics
- **Preview acceptance:** One configured splitter uses the intended axis
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-splitter-default-panel-minimum-size · P1 · Panel minimum size

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** paired dimensions. **Proposed default:** Current example minimums.
- **Validation / dependencies:** Each bound must leave feasible room for the other panel
- **Preview acceptance:** Dragging never collapses an essential panel below its minimum
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-splitter-default-panel-maximum-size · P2 · Panel maximum size

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** paired dimensions. **Proposed default:** None.
- **Validation / dependencies:** Compatible minimum/maximum constraints
- **Preview acceptance:** Resize stays within authored limits
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-splitter-default-collapsible-panels · P1 · Collapsible panels

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-panel toggles. **Proposed default:** False.
- **Validation / dependencies:** Collapsed content is not accidentally focusable
- **Preview acceptance:** Collapse/restore has an accessible control
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-splitter-default-panel-contents · P1 · Panel contents

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** two slots. **Proposed default:** Existing labels.
- **Validation / dependencies:** Preserve focus and reading order inside panels
- **Preview acceptance:** Preview can contain actual navigation and detail content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-splitter-default-keyboard-resize-step · P1 · Keyboard resize step

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number. **Proposed default:** Documented default.
- **Validation / dependencies:** Positive increment and correctly oriented arrow commands
- **Preview acceptance:** Keyboard resizing updates announced values
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [splitter-default.json](pages/splitter-default.json).

### 54. Statistic — statistic-default.html

**Entry:** [statistic-default.html](../../statistic-default.html). **Category:** Components · Data Display · Statistic. **Native properties:** 4. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [statistic-detail.js](../../statistic-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-54-01 | Title | statistic-title | text | Active Users | Free value / toggle | Available by default |
| CTRL-54-02 | Value | statistic-value | text | 112,893 | Free value / toggle | Available by default |
| CTRL-54-03 | Prefix | statistic-prefix | text |  | Free value / toggle | Available by default |
| CTRL-54-04 | Suffix | statistic-suffix | text |  | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Value:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Prefix:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Suffix:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Default, With Trend, Countdown; states: Default, Positive, Negative, Loading. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 4 cases; 4 changed preview DOM; 4 changed prompt; 4 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Title to `Reload audit Statistic`; after reload observed `Active Users`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 700 px; Live Preview top 1290 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-statistic-default-numeric-source-value · P1 · Numeric source value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number input separate from formatted text. **Proposed default:** Current example number.
- **Validation / dependencies:** Finite number or explicit missing state
- **Preview acceptance:** Formatting never destroys the underlying numeric value
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-statistic-default-precision · P1 · Precision

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** integer. **Proposed default:** Data Format default.
- **Validation / dependencies:** Nonnegative documented precision
- **Preview acceptance:** Decimal presentation follows the selected precision
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-statistic-default-locale-number-format · P1 · Locale/number format

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current Data Format.
- **Validation / dependencies:** Explicit decimal/grouping/currency choices
- **Preview acceptance:** Sample numbers format consistently across preview/export
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-statistic-default-trend-delta · P1 · Trend/delta

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** numeric value and direction. **Proposed default:** None.
- **Validation / dependencies:** Direction is not conveyed by color alone
- **Preview acceptance:** Optional change indicator includes useful text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-statistic-default-loading-missing-treatment · P2 · Loading/missing treatment

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** state controls and text. **Proposed default:** Current examples.
- **Validation / dependencies:** Distinguish zero, missing and loading
- **Preview acceptance:** Each state is represented without fabricated numeric content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [statistic-default.json](pages/statistic-default.json).

### 55. Steps — steps-default.html

**Entry:** [steps-default.html](../../steps-default.html). **Category:** Components · Navigation · Steps. **Native properties:** 4. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [steps-detail.js](../../steps-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-55-01 | Orientation | steps-orientation-mount | multiselect | ["horizontal"] | Horizontal = horizontal; Vertical = vertical | Available by default |
| CTRL-55-02 | Size | steps-size-mount | multiselect | ["32"] | 24px - S = 24; 32px - M = 32; 40px - L = 40 | Available by default |
| CTRL-55-03 | Step count | steps-count-input | number | 3 | Free value / toggle | min=2, max=12, step=None |
| CTRL-55-04 | Labels | steps-label | text | Details, Shipping, Payment | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Orientation:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Step count:** Declare units and semantic bounds, distinguish zero from empty, and show normalization/validation feedback. Do not add an arbitrary product limit without a reason.
- **Labels:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Numbered; states: Upcoming, Current, Completed, Error, Disabled. Default rendered cells: 5. Dedicated interaction markup: none found.

**Property-change evidence:** 6 cases; 6 changed preview DOM; 6 changed prompt; 6 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Labels to `Reload audit Steps`; after reload observed `Details, Shipping, Payment`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 796 px; Live Preview top 1362 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-steps-default-current-step · P1 · Current step

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item selector. **Proposed default:** Current first step.
- **Validation / dependencies:** Reference a valid step and define zero/one based indexing
- **Preview acceptance:** Highlight follows the authored current item
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-steps-default-step-items-and-descriptions · P1 · Step items and descriptions

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** reorderable item editor. **Proposed default:** Existing labels.
- **Validation / dependencies:** Stable IDs with optional descriptions and status
- **Preview acceptance:** Adding/reordering steps keeps the active step identity
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-steps-default-per-step-status · P1 · Per-step status

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item status selector. **Proposed default:** Current state.
- **Validation / dependencies:** Waiting, current, complete and error states must be coherent
- **Preview acceptance:** A failure can be located on a specific step
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-steps-default-clickable-navigation · P1 · Clickable navigation

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Future-step access follows validation policy
- **Preview acceptance:** Only allowed navigation targets activate
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-steps-default-icons · P2 · Icons

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-step icon picker. **Proposed default:** Existing number markers.
- **Validation / dependencies:** Retain step status and position information accessibly
- **Preview acceptance:** Authored icons do not obscure progression
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [steps-default.json](pages/steps-default.json).

### 56. Switch — switch-default.html

**Entry:** [switch-default.html](../../switch-default.html). **Category:** Components · Forms · Switch. **Native properties:** 2. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [switch-detail.js](../../switch-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-56-01 | Size | switch-size-mount | multiselect | ["24"] | 20px - S = 20; 24px - M = 24; 32px - L = 32 | Available by default |
| CTRL-56-02 | Label | switch-label | text | Enable notifications | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Compact, Labeled; states: Off, On, Hover, Focused, Disabled, Loading. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 3 cases; 3 changed preview DOM; 3 changed prompt; 2 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label.

**Reload probe:** changed Label to `Reload audit Switch`; after reload observed `Enable notifications`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 543 px; Live Preview top 1109 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-switch-default-checked-value · P1 · Checked value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Boolean current value independent of hover/loading visuals
- **Preview acceptance:** A single switch can be turned on and off
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-switch-default-disabled-value · P1 · Disabled value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Prevent state changes while disabled
- **Preview acceptance:** Disabled behavior can be tested directly
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-switch-default-loading-value · P1 · Loading value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Prevent repeated commits and expose busy feedback
- **Preview acceptance:** Pending update differs from a settled on/off state
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-switch-default-on-off-descriptions · P1 · On/off descriptions

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** paired text. **Proposed default:** Current convention.
- **Validation / dependencies:** Label remains stable while state is announced separately
- **Preview acceptance:** Authored state meaning stays understandable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-switch-default-validation-help-text · P2 · Validation/help text

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** linked text. **Proposed default:** None.
- **Validation / dependencies:** Explain consequences where an immediate change matters
- **Preview acceptance:** State change can show the intended confirmation/error feedback
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [switch-default.json](pages/switch-default.json).

### 57. Table — table-default.html

**Entry:** [table-default.html](../../table-default.html). **Category:** Components · Data Display · Table. **Native properties:** 3. **Proposed atomic capabilities:** 13.

**Source:** Properties begins at HTML line 177; detail implementation: [table-detail.js](../../table-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-57-01 | Corner radius | table-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-57-02 | Size | table-size-mount | multiselect | ["large"] | Small = small; Middle = middle; Large = large | Available by default |
| CTRL-57-03 | Show header | table-show-header | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Show header:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Default, Bordered, Name, Status, Role, Email, Mobile, Name, Status, Role, Email, Mobile, Name, Status, Role, Email, Mobile, Name, Status, Role, Email, Mobile, , Name, Status, Role, Email, Mobile, , Name, Status, Role, Email, Mobile, Name, Status, Role, Email, Mobile, Name, Status, Role, Email, Mobile, Name, Status, Role, Email, Mobile, Name, Status, Role, Email, Mobile; states: Default, Striped, Selected, Loading, Empty. Default rendered cells: 10. Dedicated interaction markup: none found.

**Fixed data/source evidence:**

- [table-detail.js](../../table-detail.js), line 128: `var ROWS_DATA = [`

**Property-change evidence:** 7 cases; 7 changed preview DOM; 7 changed prompt; 7 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Corner radius to `["0"]`; after reload observed `["8"]`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 602 px; Live Preview top 1167 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-table-default-columns · P1 · Columns

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** reorderable column editor. **Proposed default:** Existing example columns.
- **Validation / dependencies:** Unique keys with header, data path and declared cell type
- **Preview acceptance:** Add, remove and reorder actual columns
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-rows · P1 · Rows

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** structured data editor. **Proposed default:** Current three sample people.
- **Validation / dependencies:** Stable row keys matching declared columns
- **Preview acceptance:** User data replaces the fixture records
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-cell-renderer · P1 · Cell renderer

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-column type choice. **Proposed default:** Current text/status cells.
- **Validation / dependencies:** Choose only supported semantic renderers or approved slots
- **Preview acceptance:** Numbers, links, statuses and actions render as declared
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-column-width · P1 · Column width

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-column dimension. **Proposed default:** Existing widths.
- **Validation / dependencies:** Respect min/max and total container constraints
- **Preview acceptance:** Columns resize without clipping essential values
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-sort-configuration · P1 · Sort configuration

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-column toggle and direction. **Proposed default:** None.
- **Validation / dependencies:** Define sortable fields and local/server intent
- **Preview acceptance:** Header interaction updates aria-sort and the sample order
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-filter-configuration · P1 · Filter configuration

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-column rule editor. **Proposed default:** None.
- **Validation / dependencies:** Distinguish no matching rows from no data
- **Preview acceptance:** Authored filters affect only declared fields
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-selection-mode · P1 · Selection mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** None.
- **Validation / dependencies:** Single or multiple needs stable selected row IDs
- **Preview acceptance:** Header and row selection remain coherent
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-selected-row-keys · P1 · Selected row keys

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item selector. **Proposed default:** Empty.
- **Validation / dependencies:** Keys must exist and match the selection mode
- **Preview acceptance:** Selection survives sorting/filtering by ID
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-pagination · P1 · Pagination

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** page/size/total settings. **Proposed default:** Current fixture policy.
- **Validation / dependencies:** Valid page and size with an explicit local/server contract
- **Preview acceptance:** Footer controls operate on the authored rows
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-density · P1 · Density

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Comfortable.
- **Validation / dependencies:** Preserve target sizes and readable cells
- **Preview acceptance:** Compact/comfortable applies consistently
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-row-actions · P1 · Row actions

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** action list. **Proposed default:** None.
- **Validation / dependencies:** Item-specific names with stable intent IDs
- **Preview acceptance:** Actions are attached to the correct row
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-empty-error-loading-content · P1 · Empty/error/loading content

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** state content editor. **Proposed default:** Current examples.
- **Validation / dependencies:** Distinct copy and a retry intent for failures
- **Preview acceptance:** Failure does not masquerade as an empty dataset
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-table-default-sticky-scroll-behavior · P2 · Sticky/scroll behavior

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggles and dimensions. **Proposed default:** None.
- **Validation / dependencies:** Maintain header association and keyboard-accessible scrolling
- **Preview acceptance:** Large tables stay usable in a bounded container
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [table-default.json](pages/table-default.json).

### 58. Tabs — tabs-default.html

**Entry:** [tabs-default.html](../../tabs-default.html). **Category:** Components · Navigation · Tabs. **Native properties:** 3. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [tabs-detail.js](../../tabs-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-58-01 | Size | tabs-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-58-02 | Corner radius | tabs-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-58-03 | Labels | tabs-label | text | Overview, Activity, Settings | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Labels:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Underline, Pill; states: Rest, Hover, Focused, Disabled. Default rendered cells: 8. Dedicated interaction markup: none found.

**Property-change evidence:** 12 cases; 12 changed preview DOM; 12 changed prompt; 12 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Labels to `Reload audit Tabs`; after reload observed `Overview, Activity, Settings`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 634 px; Live Preview top 1223 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-tabs-default-tab-items-and-panel-content · P1 · Tab items and panel content

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** reorderable item/slot editor. **Proposed default:** Current labels.
- **Validation / dependencies:** Unique tab/panel IDs and actual associated content
- **Preview acceptance:** Tabs switch between user-authored panels
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tabs-default-active-tab · P1 · Active tab

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item selector. **Proposed default:** Current first tab.
- **Validation / dependencies:** Active ID must exist and be enabled
- **Preview acceptance:** One tab and one panel are active
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tabs-default-activation-mode · P1 · Activation mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Automatic for instant local content.
- **Validation / dependencies:** Manual activation when content is slow
- **Preview acceptance:** Arrow/focus and activation behavior match the declared mode
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tabs-default-disabled-tabs · P1 · Disabled tabs

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-item toggle. **Proposed default:** None.
- **Validation / dependencies:** Disabled tabs cannot activate
- **Preview acceptance:** Enabled tab remains reachable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tabs-default-closable-addable-tabs · P2 · Closable/addable tabs

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-item controls. **Proposed default:** False.
- **Validation / dependencies:** Closing the active tab has a predictable focus destination
- **Preview acceptance:** Dynamic tabs preserve selection and focus
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tabs-default-overflow-policy · P2 · Overflow policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current horizontal scroll.
- **Validation / dependencies:** Keep every tab reachable at narrow widths
- **Preview acceptance:** Overflow is discoverable and keyboard accessible
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [tabs-default.json](pages/tabs-default.json).

### 59. Tag — tag-default.html

**Entry:** [tag-default.html](../../tag-default.html). **Category:** Components · Data Display · Tag. **Native properties:** 2. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [tag-detail.js](../../tag-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-59-01 | Corner radius | tag-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-59-02 | Label | tag-label | text | In progress | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Default, Success, Warning, Error; states: Default, Removable, Selected. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 5 cases; 5 changed preview DOM; 5 changed prompt; 5 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Label to `Reload audit Tag`; after reload observed `In progress`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 495 px; Live Preview top 1085 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-tag-default-semantic-color-status · P1 · Semantic color/status

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current example.
- **Validation / dependencies:** Use semantic tokens and non-color meaning where status matters
- **Preview acceptance:** Inspect one authored status rather than only a fixed matrix
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tag-default-closable · P1 · Closable

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Close button has a useful accessible name
- **Preview acceptance:** Tag can be removed and restored in the specimen
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tag-default-icon-reference · P2 · Icon reference

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** icon picker. **Proposed default:** None.
- **Validation / dependencies:** Decorative versus meaningful icon treatment is explicit
- **Preview acceptance:** Author can add the intended icon
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tag-default-selectable-value · P1 · Selectable value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Declare whether tag is interactive or purely descriptive
- **Preview acceptance:** Selected tags use correct pressed/selection semantics
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tag-default-destination · P2 · Destination

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** URL. **Proposed default:** None.
- **Validation / dependencies:** Linked tags use real link semantics
- **Preview acceptance:** Navigation is not simulated with inert markup
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [tag-default.json](pages/tag-default.json).

### 60. Text Area — text-area-default.html

**Entry:** [text-area-default.html](../../text-area-default.html). **Category:** Components · Forms · Text Area. **Native properties:** 5. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [text-area-detail.js](../../text-area-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-60-01 | Size | textarea-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-60-02 | Corner radius | textarea-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-60-03 | Label | textarea-label | text | Description | Free value / toggle | Available by default |
| CTRL-60-04 | Placeholder | textarea-placeholder | text | Tell us more... | Free value / toggle | Available by default |
| CTRL-60-05 | Rows | textarea-rows-select | select | 4 | 2 = 2; 3 = 3; 4 = 4; 5 = 5; 6 = 6; 8 = 8 | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Rows:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.

**Preview coverage:** Outlined, Filled, Underlined; states: Rest, Hover, Focused, Filled, Error, Disabled. Default rendered cells: 18. Dedicated interaction markup: none found.

**Property-change evidence:** 18 cases; 18 changed preview DOM; 18 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Rows.

**Reload probe:** changed Label to `Reload audit Text Area`; after reload observed `Description`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 494 px, height 791 px; Live Preview top 1308 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-text-area-default-text-value · P1 · Text value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** multiline input. **Proposed default:** Empty.
- **Validation / dependencies:** Preserve line breaks independently of placeholder
- **Preview acceptance:** Authored long text appears in the field
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-text-area-default-maximum-length · P1 · Maximum length

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** integer and optional limit. **Proposed default:** None.
- **Validation / dependencies:** Nonnegative limit and a clear overflow policy
- **Preview acceptance:** Character limit is enforceable and explained
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-text-area-default-character-count · P1 · Character count

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Associate count without overwhelming announcements
- **Preview acceptance:** Count follows the actual entered text
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-text-area-default-auto-resize-bounds · P1 · Auto-resize bounds

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** minimum/maximum row settings. **Proposed default:** Current fixed rows.
- **Validation / dependencies:** Ordered positive row bounds
- **Preview acceptance:** Text grows to the intended maximum without hiding content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-text-area-default-required-helper-error-rules · P1 · Required/helper/error rules

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** grouped field controls. **Proposed default:** Optional.
- **Validation / dependencies:** Linked messages with defined validation timing
- **Preview acceptance:** Missing/invalid text has meaningful feedback
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-text-area-default-read-only · P2 · Read-only

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Keep content readable and selectable
- **Preview acceptance:** Read-only differs from disabled and loading
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [text-area-default.json](pages/text-area-default.json).

### 61. Time — time-default.html

**Entry:** [time-default.html](../../time-default.html). **Category:** Components · Forms · Time. **Native properties:** 5. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [time-detail.js](../../time-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-61-01 | Size | time-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-61-02 | Corner radius | time-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-61-03 | Label | time-label | text | Meeting time | Free value / toggle | Available by default |
| CTRL-61-04 | Placeholder | time-placeholder | text | Select a time | Free value / toggle | Available by default |
| CTRL-61-05 | Allow clear | time-allow-clear | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled; states: Rest, Hover, Focused, Filled, Error, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 14 cases; 14 changed preview DOM; 14 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Allow clear.

**Reload probe:** changed Label to `Reload audit Time`; after reload observed `Meeting time`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 783 px; Live Preview top 1348 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-time-default-selected-time · P1 · Selected time

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** time input. **Proposed default:** Empty.
- **Validation / dependencies:** Valid time under the configured hour/minute/second precision
- **Preview acceptance:** Trigger and panel agree on the value
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-time-default-clock-format · P1 · Clock format

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current format.
- **Validation / dependencies:** Explicit 12/24-hour choice and meridiem behavior
- **Preview acceptance:** Display and parsing use the same clock convention
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-time-default-minute-second-step · P1 · Minute/second step

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** positive integer settings. **Proposed default:** Current interval.
- **Validation / dependencies:** Steps divide the supported precision appropriately
- **Preview acceptance:** Pickable times follow the authored interval
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-time-default-disabled-times · P1 · Disabled times

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** rule editor. **Proposed default:** None.
- **Validation / dependencies:** Cannot commit a disabled interval
- **Preview acceptance:** Disabled choices have consistent visual and keyboard behavior
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-time-default-timezone-context · P2 · Timezone context

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** timezone field and display policy. **Proposed default:** Unspecified local time.
- **Validation / dependencies:** Never silently reinterpret an instant as a wall-clock time
- **Preview acceptance:** Output explicitly states whether timezone conversion is supported
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-time-default-required-error-messages · P1 · Required/error messages

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and linked text. **Proposed default:** Optional.
- **Validation / dependencies:** Invalid time is distinct from missing time
- **Preview acceptance:** Recoverable field errors match the configured rules
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [time-default.json](pages/time-default.json).

### 62. Timeline — timeline-default.html

**Entry:** [timeline-default.html](../../timeline-default.html). **Category:** Components · Data Display · Timeline. **Native properties:** 1. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [timeline-detail.js](../../timeline-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-62-01 | Show icons | timeline-show-icons | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Show icons:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Default, Alternate, Horizontal; states: Default, With events, Pending. Default rendered cells: 9. Dedicated interaction markup: none found.

**Property-change evidence:** 1 cases; 1 changed preview DOM; 1 changed prompt; 1 changed legacy code. These counts are signals, not independent correctness scores.

**390 px geometry:** Properties top 566 px, height 421 px; Live Preview top 1010 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-timeline-default-timeline-items · P1 · Timeline items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** reorderable event editor. **Proposed default:** Current sample events.
- **Validation / dependencies:** Stable IDs, titles and optional descriptions
- **Preview acceptance:** User can author actual event content
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-timeline-default-timestamps · P1 · Timestamps

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-item date/time fields. **Proposed default:** Current fixture dates.
- **Validation / dependencies:** Define ordering/timezone and explicit missing values
- **Preview acceptance:** Dates display consistently with Data Format
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-timeline-default-per-item-status-icon · P1 · Per-item status/icon

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item controls. **Proposed default:** Existing markers.
- **Validation / dependencies:** Status has a non-color cue
- **Preview acceptance:** Event meaning is independently configurable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-timeline-default-orientation-alignment · P1 · Orientation/alignment

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current layout.
- **Validation / dependencies:** Preserve chronological reading order
- **Preview acceptance:** Alternating/vertical layout remains understandable
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-timeline-default-pending-error-event · P2 · Pending/error event

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** optional event state. **Proposed default:** None.
- **Validation / dependencies:** Do not invent a completed event while work is pending
- **Preview acceptance:** Future and failed events are distinct
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [timeline-default.json](pages/timeline-default.json).

### 63. Toast — toast-default.html

**Entry:** [toast-default.html](../../toast-default.html). **Category:** Components · Feedback · Toast. **Native properties:** 4. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [toast-detail.js](../../toast-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-63-01 | Corner radius | toast-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-63-02 | Title | toast-title | text | Upload complete | Free value / toggle | Available by default |
| CTRL-63-03 | Description | toast-description | text | your-file.pdf was uploaded successfully. | Free value / toggle | Available by default |
| CTRL-63-04 | Show icon | toast-show-icon | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Description:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show icon:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Info, Success, Warning, Error; states: Default, Dismissible, With action, With progress. Default rendered cells: 16. Dedicated interaction markup: none found.

**Property-change evidence:** 7 cases; 7 changed preview DOM; 7 changed prompt; 7 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Title to `Reload audit Toast`; after reload observed `Upload complete`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 692 px; Live Preview top 1306 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-toast-default-semantic-status · P1 · Semantic status

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Current status.
- **Validation / dependencies:** Supported type with a non-color message
- **Preview acceptance:** Inspect one chosen toast status
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-toast-default-duration · P1 · Duration

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** number with persistent mode. **Proposed default:** Current demo policy.
- **Validation / dependencies:** Nonnegative timing with an explicit persistent value
- **Preview acceptance:** Toast can be timed or intentionally persistent
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-toast-default-placement · P1 · Placement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** logical placement selector. **Proposed default:** Existing location.
- **Validation / dependencies:** Respect safe areas and other live regions
- **Preview acceptance:** Toast does not cover essential controls
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-toast-default-action-label-intent · P1 · Action label/intent

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** optional action editor. **Proposed default:** None.
- **Validation / dependencies:** Do not hide a necessary action behind too-short a timeout
- **Preview acceptance:** Undo/retry action uses authored copy
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-toast-default-dismissal-and-announcements · P2 · Dismissal and announcements

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** structured policy. **Proposed default:** Context-appropriate.
- **Validation / dependencies:** Provide accessible close where appropriate and avoid duplicate live announcements
- **Preview acceptance:** Keyboard and assistive feedback remain coherent
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [toast-default.json](pages/toast-default.json).

### 64. Tooltip — tooltip-default.html

**Entry:** [tooltip-default.html](../../tooltip-default.html). **Category:** Components · Feedback · Tooltip. **Native properties:** 3. **Proposed atomic capabilities:** 5.

**Source:** Properties begins at HTML line 177; detail implementation: [tooltip-detail.js](../../tooltip-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-64-01 | Size | tooltip-size-select | select | default | Small = small; Default = default; Large = large | Available by default |
| CTRL-64-02 | Text content | tooltip-text | text | Add to favorites | Free value / toggle | Available by default |
| CTRL-64-03 | Show arrow | tooltip-show-arrow | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.
- **Text content:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show arrow:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Top, Bottom, Left, Right; states: Plain text, Rich, Long text. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 4 cases; 4 changed preview DOM; 4 changed prompt; 4 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Text content to `Reload audit Tooltip`; after reload observed `Add to favorites`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 602 px; Live Preview top 1191 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-tooltip-default-trigger-content · P1 · Trigger content

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text or approved slot. **Proposed default:** Current example trigger.
- **Validation / dependencies:** Trigger must be keyboard reachable if it conveys essential help
- **Preview acceptance:** Author can attach the tooltip to their real control
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tooltip-default-placement · P1 · Placement

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select. **Proposed default:** Automatic.
- **Validation / dependencies:** Keep tooltip within the available viewport
- **Preview acceptance:** Direction changes without clipping
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tooltip-default-open-close-delay · P1 · Open/close delay

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** paired numbers. **Proposed default:** Current demo policy.
- **Validation / dependencies:** Nonnegative milliseconds and cancellable delayed actions
- **Preview acceptance:** Pointer entry/exit follows the authored timing
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tooltip-default-open-value · P2 · Open value

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** Closed.
- **Validation / dependencies:** Do not replace hover/focus reachability with a forced-only preview
- **Preview acceptance:** Author can inspect the exact open state
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tooltip-default-maximum-width-wrapping · P2 · Maximum width/wrapping

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** dimension and wrapping choice. **Proposed default:** Current width.
- **Validation / dependencies:** Long content remains readable without obscuring the trigger
- **Preview acceptance:** Tooltip adapts to narrow containers
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [tooltip-default.json](pages/tooltip-default.json).

### 65. Tour — tour-default.html

**Entry:** [tour-default.html](../../tour-default.html). **Category:** Components · Feedback · Tour. **Native properties:** 3. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [tour-detail.js](../../tour-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-65-01 | Target label | tour-target-label | text | New feature | Free value / toggle | Available by default |
| CTRL-65-02 | Title | tour-title | text | Try the new dashboard | Free value / toggle | Available by default |
| CTRL-65-03 | Description | tour-description | text | Get a quick overview of your team's activity in one place. | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Target label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Description:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Top, Bottom, Left, Right; states: First step, Middle step, Last step. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 3 cases; 3 changed preview DOM; 3 changed prompt; 3 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Target label to `Reload audit Tour`; after reload observed `New feature`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 610 px; Live Preview top 1223 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-tour-default-tour-steps · P1 · Tour steps

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** reorderable step editor. **Proposed default:** Current single example.
- **Validation / dependencies:** Stable IDs, title, description and valid target per step
- **Preview acceptance:** User can author an entire sequence
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tour-default-target-binding · P1 · Target binding

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** element/part selector. **Proposed default:** Current target label.
- **Validation / dependencies:** Target must exist and be visible before positioning
- **Preview acceptance:** Spotlight points to a real intended element
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tour-default-current-open-step · P1 · Current/open step

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** step selector and toggle. **Proposed default:** Closed.
- **Validation / dependencies:** Step ID valid and missing targets recoverable
- **Preview acceptance:** Tour can start, advance and resume predictably
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tour-default-next-back-finish-labels · P1 · Next/back/finish labels

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** text fields. **Proposed default:** Current examples.
- **Validation / dependencies:** Every enabled action has a meaningful label
- **Preview acceptance:** Sequence controls use product-specific copy
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tour-default-placement-spotlight-padding · P2 · Placement/spotlight padding

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** select and dimension. **Proposed default:** Automatic/current padding.
- **Validation / dependencies:** Keep content and focus within the viewport
- **Preview acceptance:** Spotlight geometry follows the target
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tour-default-skip-close-policy · P1 · Skip/close policy

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggles. **Proposed default:** Explicit product policy.
- **Validation / dependencies:** Users can leave a nonessential tour and focus returns sensibly
- **Preview acceptance:** Tour does not trap the user
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [tour-default.json](pages/tour-default.json).

### 66. Transfer — transfer-default.html

**Entry:** [transfer-default.html](../../transfer-default.html). **Category:** Components · Forms · Transfer. **Native properties:** 3. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [transfer-detail.js](../../transfer-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-66-01 | Size | transfer-size-select | select | default | Small = small; Default = default; Large = large | Available by default |
| CTRL-66-02 | Left title | transfer-left-title | text | Source | Free value / toggle | Available by default |
| CTRL-66-03 | Right title | transfer-right-title | text | Target | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.
- **Left title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Right title:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Default, With search; states: Rest, Hover, Focused, Disabled. Default rendered cells: 8. Dedicated interaction markup: none found.

**Fixed data/source evidence:**

- [transfer-detail.js](../../transfer-detail.js), line 48: `var SOURCE_ITEMS = [`
- [transfer-detail.js](../../transfer-detail.js), line 54: `var TARGET_ITEMS = [`

**Property-change evidence:** 4 cases; 4 changed preview DOM; 4 changed prompt; 4 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Left title to `Reload audit Transfer`; after reload observed `Source`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 566 px, height 610 px; Live Preview top 1199 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-transfer-default-source-items · P1 · Source items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable option list. **Proposed default:** Current fixture items.
- **Validation / dependencies:** Stable unique IDs and meaningful labels
- **Preview acceptance:** Source list contains user-authored entities
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-transfer-default-target-keys · P1 · Target keys

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** item selector. **Proposed default:** Current fixture target.
- **Validation / dependencies:** Keys must exist in the source dataset
- **Preview acceptance:** Moving items updates actual membership by ID
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-transfer-default-selected-keys · P1 · Selected keys

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-list item selectors. **Proposed default:** None.
- **Validation / dependencies:** Selection remains separate from target membership
- **Preview acceptance:** Move controls act only on selected eligible items
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-transfer-default-search-filter · P1 · Search/filter

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and placeholder. **Proposed default:** False.
- **Validation / dependencies:** Filtered counts and no-results states stay clear
- **Preview acceptance:** Users can find items in large lists
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-transfer-default-disabled-items · P1 · Disabled items

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-item toggles. **Proposed default:** None.
- **Validation / dependencies:** Disabled items cannot be transferred
- **Preview acceptance:** Mixed eligibility is respected
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-transfer-default-move-button-labels · P2 · Move button labels

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** paired text. **Proposed default:** Current arrows with accessible names.
- **Validation / dependencies:** Direction remains clear in RTL and without icons
- **Preview acceptance:** Controls announce source/target meaning
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [transfer-default.json](pages/transfer-default.json).

### 67. Tree — tree-default.html

**Entry:** [tree-default.html](../../tree-default.html). **Category:** Components · Data Display · Tree. **Native properties:** 2. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [tree-detail.js](../../tree-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-67-01 | Root label | tree-root-label | text | Documents | Free value / toggle | Available by default |
| CTRL-67-02 | Show icons | tree-show-icons | checkbox | true | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Root label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Show icons:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Default, Checkable, Metatext; states: Default, Expanded, Selected, Disabled. Default rendered cells: 12. Dedicated interaction markup: tree-interactive.

**Fixed data/source evidence:**

- [tree-detail.js](../../tree-detail.js), line 34: `var TREE_DATA = [`

**Property-change evidence:** 2 cases; 2 changed preview DOM; 2 changed prompt; 2 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Root label to `Reload audit Tree`; after reload observed `Documents`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 614 px, height 607 px; Live Preview top 1245 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-tree-default-tree-nodes · P1 · Tree nodes

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** nested item editor. **Proposed default:** Existing document fixture.
- **Validation / dependencies:** Stable unique keys without cycles
- **Preview acceptance:** User can build the intended hierarchy
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tree-default-expanded-keys · P1 · Expanded keys

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** node selector. **Proposed default:** Current example expansion.
- **Validation / dependencies:** Reference expandable nodes only
- **Preview acceptance:** Expansion persists by ID when labels change
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tree-default-selected-keys · P1 · Selected keys

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** node selector. **Proposed default:** None.
- **Validation / dependencies:** Follow declared single/multiple selection
- **Preview acceptance:** Selected nodes are inspectable separately from expansion
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tree-default-checkable-mixed-state · P1 · Checkable/mixed state

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and node values. **Proposed default:** False.
- **Validation / dependencies:** Parent/child propagation and mixed-state policy explicit
- **Preview acceptance:** Checking branches updates descendants coherently
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tree-default-disabled-nodes · P1 · Disabled nodes

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-node toggle. **Proposed default:** None.
- **Validation / dependencies:** Define disabled selection versus expansion separately
- **Preview acceptance:** Keyboard skips or announces disabled nodes appropriately
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tree-default-async-children · P2 · Async children

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** declared loading/error fixture. **Proposed default:** None.
- **Validation / dependencies:** Loading is not confused with a leaf node
- **Preview acceptance:** Branch loading and retry can be demonstrated
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [tree-default.json](pages/tree-default.json).

### 68. Tree Select — tree-select-default.html

**Entry:** [tree-select-default.html](../../tree-select-default.html). **Category:** Components · Forms · Tree Select. **Native properties:** 5. **Proposed atomic capabilities:** 6.

**Source:** Properties begins at HTML line 177; detail implementation: [tree-select-detail.js](../../tree-select-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-68-01 | Size | treeselect-size-mount | multiselect | ["40"] | 24px - XXS = 24; 28px - XS = 28; 32px - S = 32; 36px - SM = 36; 40px - M = 40; 44px - L = 44; 48px - XL = 48; 56px - XXL = 56 | Available by default |
| CTRL-68-02 | Corner radius | treeselect-radius-mount | multiselect | ["8"] | 0px - Sharp = 0; 4px - Compact = 4; 8px - Balanced = 8; 12px - Soft = 12; Full - Pill = 9999 | Available by default |
| CTRL-68-03 | Label | treeselect-label | text | Assignee team | Free value / toggle | Available by default |
| CTRL-68-04 | Placeholder | treeselect-placeholder | text | Select a team | Free value / toggle | Available by default |
| CTRL-68-05 | Allow clear | treeselect-allow-clear | checkbox | false | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Size:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Corner radius:** Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.
- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Placeholder:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Allow clear:** Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.

**Preview coverage:** Outlined, Filled; states: Rest, Hover, Focus, Open, Filled, Disabled. Default rendered cells: 12. Dedicated interaction markup: none found.

**Property-change evidence:** 14 cases; 14 changed preview DOM; 14 changed prompt; 11 changed legacy code. These counts are signals, not independent correctness scores.

**Unchanged-code review queue:** Label, Placeholder, Allow clear.

**Reload probe:** changed Label to `Reload audit Tree Select`; after reload observed `Assignee team`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 542 px, height 783 px; Live Preview top 1348 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-tree-select-default-tree-options · P1 · Tree options

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** nested data editor. **Proposed default:** Current team fixture.
- **Validation / dependencies:** Stable keys/values without cycles
- **Preview acceptance:** Popup tree uses the author's real options
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tree-select-default-selected-values · P1 · Selected values

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** node selector. **Proposed default:** Empty.
- **Validation / dependencies:** Values must refer to selectable enabled nodes
- **Preview acceptance:** Trigger chips/text match selected nodes
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tree-select-default-multiple-checkable-mode · P1 · Multiple/checkable mode

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** selection controls. **Proposed default:** Single.
- **Validation / dependencies:** Define parent-child propagation and selection cardinality
- **Preview acceptance:** Multiple values are represented and removable coherently
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tree-select-default-search · P1 · Search

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle and matching behavior. **Proposed default:** False.
- **Validation / dependencies:** Preserve ancestry in matches
- **Preview acceptance:** Users can locate deep options
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tree-select-default-expanded-node-keys · P2 · Expanded node keys

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** node selector. **Proposed default:** Current example.
- **Validation / dependencies:** Only valid branch IDs may be expanded
- **Preview acceptance:** Author can inspect the desired subtree
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-tree-select-default-required-helper-error-rules · P1 · Required/helper/error rules

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** grouped field controls. **Proposed default:** Optional.
- **Validation / dependencies:** Programmatically associate required and invalid messages
- **Preview acceptance:** Validation matches the selection mode
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [tree-select-default.json](pages/tree-select-default.json).

### 69. Upload — upload-default.html

**Entry:** [upload-default.html](../../upload-default.html). **Category:** Components · Forms · Upload. **Native properties:** 2. **Proposed atomic capabilities:** 8.

**Source:** Properties begins at HTML line 177; detail implementation: [upload-detail.js](../../upload-detail.js).

**Current property inventory (including conditional fields):

| Control ID | Property | DOM reference | Control | Current/default value | Available options | Bounds / dependency |
| --- | --- | --- | --- | --- | --- | --- |
| CTRL-69-01 | Label | upload-label | text | Upload files | Free value / toggle | Available by default |
| CTRL-69-02 | Helper text | upload-helper | text | PNG, JPG or PDF up to 10MB | Free value / toggle | Available by default |

**Existing-control usability improvements:**

- **Label:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.
- **Helper text:** Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.

**Preview coverage:** Dropzone, Button; states: Empty, With files, Error, Disabled. Default rendered cells: 8. Dedicated interaction markup: none found.

**Fixed data/source evidence:**

- [upload-detail.js](../../upload-detail.js), line 38: `var DEMO_FILE_COMPLETE = { name: "report.pdf", size: "2.4 MB" };`
- [upload-detail.js](../../upload-detail.js), line 39: `var DEMO_FILE_UPLOADING = { name: "diagram.png", size: "890 KB", percent: 55 };`
- [upload-detail.js](../../upload-detail.js), line 40: `var DEMO_FILE_ERROR = { name: "video.mp4", error: "Upload failed - file too large" };`

**Property-change evidence:** 2 cases; 2 changed preview DOM; 2 changed prompt; 2 changed legacy code. These counts are signals, not independent correctness scores.

**Reload probe:** changed Label to `Reload audit Upload`; after reload observed `Upload files`. Retained: **False**. Save/revision authoring currently lives in the separate contract editor.

**390 px geometry:** Properties top 590 px, height 495 px; Live Preview top 1109 px. Geometry is captured at the audit's scroll state and is not a measured participant task time.

**Missing or insufficiently exposed native-panel capabilities (design proposals):**

#### CAP-upload-default-accepted-file-types · P1 · Accepted file types

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** MIME/extension list. **Proposed default:** Existing helper-text example only until validated.
- **Validation / dependencies:** Parse supported accept entries and keep helper copy synchronized
- **Preview acceptance:** Picker restrictions and visible instructions agree
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-upload-default-maximum-file-size · P1 · Maximum file size

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** positive dimension. **Proposed default:** Existing 10 MB wording only until validated.
- **Validation / dependencies:** Explicit bytes/MB convention and a recoverable oversize message
- **Preview acceptance:** Oversize fixture is rejected with the declared reason
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-upload-default-maximum-file-count · P1 · Maximum file count

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** integer. **Proposed default:** Project-defined.
- **Validation / dependencies:** Positive bound with replacement versus add policy
- **Preview acceptance:** Adding files respects the configured count
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-upload-default-multiple-selection · P1 · Multiple selection

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** toggle. **Proposed default:** False.
- **Validation / dependencies:** Compatible with max count and accessible picker behavior
- **Preview acceptance:** File chooser allows the intended number of files
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-upload-default-file-list · P1 · File list

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** editable upload fixture list. **Proposed default:** Current sample files.
- **Validation / dependencies:** Stable IDs, filename, size and explicit status
- **Preview acceptance:** User can author real sample names and progress/error states
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-upload-default-upload-progress-status · P1 · Upload progress/status

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-file number and status. **Proposed default:** Current fixtures.
- **Validation / dependencies:** Percentage in range and success/error must agree
- **Preview acceptance:** Each file can demonstrate pending, uploading, success and failure
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-upload-default-remove-retry-actions · P1 · Remove/retry actions

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** per-file action controls. **Proposed default:** Current demo policy.
- **Validation / dependencies:** Actions are named for the specific file and have explicit intent
- **Preview acceptance:** Failed uploads can show meaningful retry/removal controls
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

#### CAP-upload-default-network-execution-contract · P2 · Network execution contract

- **Current coverage:** No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.
- **Suggested control:** declarative adapter metadata. **Proposed default:** No live endpoint.
- **Validation / dependencies:** Never claim real upload without a configured service
- **Preview acceptance:** Export distinguishes a demo fixture from executable upload behavior
- **Prompt/code acceptance:** Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.
- **Save/edit acceptance:** Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.
- **Accessibility acceptance:** The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.
- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.

**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.

**Full evidence:** [upload-default.json](pages/upload-default.json).

## 9. Suggested detail-page authoring model

```text
Choose component
→ Configure one instance
  → Content & data
  → Appearance (inherit / local token override)
  → State & behavior
  → Accessibility
→ Preview and interact
→ Compare states when needed
→ Save component revision
→ Copy prompt / code / contract from that revision
→ Reopen / edit / cancel / share
```

Use progressive disclosure for advanced settings. A native label/placeholder panel should not force users into raw JSON for core tasks like editing Select options, Table rows or Modal action labels. Keep rare implementation hooks in an advanced section. Avoid exposing arbitrary script execution as a customization field.

A property should have a stable ID, semantic type, default, validation, dependency conditions, token/part binding and supported outputs. Content/data fields should use structured editors with stable item IDs. Styling should use approved tokens. Behavior should use declared intents/events and an explicit demo or adapter, not a claim of a connected service.

## 10. Acceptance gates for implementation

1. A user can complete each proposed core component task from the native detail authoring flow without source edits.
2. Each exposed value is validated and applies to the right preview parts. False, zero, empty values and hidden dependencies are not silently lost.
3. Prompt, saved contract, generated code and any adapter refer to the same configured revision and include the actual chosen values.
4. Save/reopen/edit/cancel/reset preserve component identity and do not overwrite global Foundations unintentionally.
5. Interactive widgets have meaningful keyboard/focus/selection/validation demos. A static Focused row is not keyboard verification.
6. The inspector and preview remain usable at small widths and zoom. Comparison expansion has a clear cost and exit route.
7. Missing assets, invalid data, unsupported behavior and unconnected services are reported honestly.
8. Test cases capture semantic outcomes, not only string changes. Preserve the current evidence and mark each backlog item implemented/verified separately.

## 11. Accessibility reference basis

Programmatic labels and associated instructions/errors guide the proposed editor controls. See [WAI Labeling Controls](https://www.w3.org/WAI/tutorials/forms/labels/) and [WAI Validating Input](https://www.w3.org/WAI/tutorials/forms/validation/). These references support labeling and validation expectations; they do not require a design tool to expose every proposed property.

Interactive acceptance should use the appropriate pattern rather than visual resemblance. For example, tab activation/focus should follow the selected interaction model, and complex composite controls need their corresponding keyboard behavior. See [APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/), [Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), and [Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/). This audit is not WCAG certification.

## 12. Continuation brief for another AI

```text
Read this report, atomic-backlog.json, task-evidence.json and the source manifest.
Preserve the existing HTML/CSS/JS application and user data.
First reproduce and repair confirmed current-value export omissions.
Then prioritize native core-data/current-value/validation/action controls by component.
Use the saved component contract as the source for preview, prompt and code.
Do not merely add unused form fields or label fixed example data as customizable.
Do not count matrix states as selectable instance values or an advanced JSON editor
as a complete native task flow. Keep Foundation inheritance explicit.
For every implemented backlog item, verify the semantic preview effect, exact
exported value, save/reopen/edit/cancel, invalid/dependent input, and relevant
keyboard/focus behavior. Update the item status with evidence.
Do not claim all proposed features are implemented just because the current
browser page-smoke tests pass.
```
