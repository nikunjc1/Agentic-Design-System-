(() => {
  "use strict";

  var CHECK_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6L9 17l-5-5"/></svg>';
  // The Empty component's own tray icon, shown above the message in the Table's Empty state.
  var EMPTY_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5 L7 4 H17 L21 9.5" /><path d="M3 9.5 V18.5 A1 1 0 0 0 4 19.5 H20 A1 1 0 0 0 21 18.5 V9.5" /><path d="M3 9.5 H9 A1 1 0 0 1 10 10.2 L10.3 11 A1 1 0 0 0 11.3 11.7 H12.7 A1 1 0 0 0 13.7 11 L14 10.2 A1 1 0 0 1 15 9.5 H21" /></svg>';
  var DASH_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M5 12h14"/></svg>';

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "bordered", label: "Bordered" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "striped", label: "Striped" },
    { key: "selected", label: "Selected" },
    { key: "loading", label: "Loading" },
    { key: "empty", label: "Empty" }
  ];

  var FULL_SPEC = {
    "default": { purpose: "Minimal - only a bottom border under the header row and thin row-separator lines, no outer border or vertical cell lines." },
    "bordered": { purpose: "A full grid - outer border plus vertical and horizontal lines between every cell, like a spreadsheet." }
  };

  var STATE_SPEC = {
    "default": "Plain rows - no striping, no selection.",
    "striped": "The same rows, but every other row gets a subtly different background for alternating-row legibility.",
    "selected": "The same rows, now each with a leading checkbox column - the first row is visually marked as selected with a red-tinted row background and a checked checkbox, the other two rows show unchecked checkboxes.",
    "loading": "The same row count and column count, but every cell replaced with a Skeleton placeholder bar - so the table's shape doesn't jump once the real rows arrive.",
    "empty": "No rows at all - a single spanning cell showing the Empty component (icon, title, description) instead of a blank body, so a zero-result search reads as a real answer, not a rendering failure."
  };

  // Interaction contract - behavior a real, data-backed Table must define
  // explicitly (this page's demos are static, but a Table implemented from
  // this spec needs every one of these decisions made for it). Fixed prose
  // driven off these constants, the same way STATE_SPEC's wording feeds both
  // the matrix and the Copy Prompt/Copy Code text below - not exposed as
  // Live Preview toggles, since none of this changes what's rendered on
  // screen here.
  var SELECTION_MODES = [
    { key: "none", label: "None", detail: "Rows aren't selectable - no checkbox column, no row highlight on click." },
    { key: "single-row", label: "Single-row", detail: "Clicking a row selects it exclusively, like a radio group - selecting a new row clears the previous selection." },
    { key: "multi-row", label: "Multi-row (checkbox column)", detail: "A leading checkbox column, one checkbox per row plus a header checkbox that selects/deselects every visible row. When some but not all visible rows are checked, the header checkbox is indeterminate, not checked or unchecked. Space toggles selection on a focused row." }
  ];

  var SORT_SPEC = {
    clientSide: "Client-side sort re-orders already-loaded rows in memory - fine for small, fully-loaded datasets.",
    serverSide: "Server-side sort re-requests the current page/window from the server on every sort change - required once pagination or virtualization is server-driven.",
    multiColumn: "Single-column sort is the default; multi-column sort (shift-click a header to add a secondary sort key) is an opt-in advanced behavior, not required of every implementation.",
    a11y: "Per WCAG 2.1 Success Criterion 4.1.3 (Status Messages), a sortable header must expose its state via aria-sort=\"ascending|descending|none\" and announce the change to assistive technology, not just show a visual arrow icon."
  };

  var FILTER_SPEC = {
    perColumn: "A per-column filter, scoped to just that field (e.g. a status dropdown in the Status header).",
    global: "A global search bar above the table, matching across every visible column at once.",
    emptyStates: "A \"no rows match\" empty state (rows exist, the current filter/search matched none of them - offer a Clear filters action) must read differently from the true empty state (no data exists at all - offer a create action)."
  };

  var PAGINATION_SPEC = {
    thresholdRows: 500,
    below: "Below 500 rows, client-side pagination (or simply rendering every row) is fine - the DOM cost is small and bounded.",
    above: "At or above 500 rows, virtualization (windowed rendering - only rows in or near the viewport are ever mounted) is required, since a table row is not a cheap DOM node and DOM/layout cost does not scale linearly with row count past a few hundred rows."
  };

  var DENSITY_MODES = [
    { key: "comfortable", label: "Comfortable", detail: "The default row height and cell padding." },
    { key: "compact", label: "Compact", detail: "Reduced row height and cell padding, for scanning more rows in the same viewport height." }
  ];
  // No dedicated Density foundation/token exists yet in this design system
  // (Spacing documents the spacing scale, not a density switch) - Density is
  // a two-value property local to Table for now.

  var REQUIRED_STATES = [
    { key: "empty", label: "Empty (no data at all)", detail: "Reuses the Empty component (icon, title, description) plus a call-to-action, never a header with a silently blank body." },
    { key: "loading", label: "Loading", detail: "Skeleton rows matching the real column count, not a blank table and not the empty-state message." },
    { key: "error", label: "Error", detail: "A failed fetch shows what went wrong plus a Retry action, never silently falling back to the same empty state as a true zero-result answer." }
  ];

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // Corner radius option list - same value scale as every other system in
  // this design system, shared between the page's own multi-select dropdown
  // and the Copy Prompt/Copy Code generators below. Applies to the Bordered
  // type only - the Default type never carries a radius.
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "2", label: "2px - Subtle" },
    { value: "4", label: "4px - Compact" },
    { value: "6", label: "6px - Compact foundation" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "16", label: "16px - Expressive" }
  ];

  // Corner radius default now tracks the sitewide Radius foundation's
  // current philosophy (theme-init.js/shell.js keep --radius-md live)
  // instead of a fixed literal - snaps to whichever of this component's
  // own preset options is closest, so a philosophy step this component
  // doesn't offer as an exact preset still lands on a sensible neighbor
  // instead of silently ignoring the sitewide setting.
  function liveRadiusDefault(fallback){
    var raw = getComputedStyle(document.documentElement).getPropertyValue("--radius-md").trim();
    var num = window.ADSFoundationModel.toPx(raw);
    if (!isFinite(num)) return fallback;
    var closest = null, closestDiff = Infinity;
    RADIUS_OPTIONS.forEach(function(opt){
      var val = Number(opt.value);
      var diff = Math.abs(val - num);
      if (diff < closestDiff){ closestDiff = diff; closest = opt.value; }
    });
    return closest !== null ? closest : fallback;
  }
  // Size (3) - Ant documents large(default)/middle/small, scaling cell
  // padding, not font-size - the same restraint every sized component here
  // follows.
  var SIZE_OPTIONS = [
    { value: "small", label: "Small" },
    { value: "middle", label: "Middle" },
    { value: "large", label: "Large" }
  ];
  var FALLBACK_DEFAULTS = {
    radius: liveRadiusDefault("8"),
    size: "large",
    showHeader: true
  };

  // Fixed example data set - three example people shared by every row
  // builder, the listing card preview and the Live Preview matrix, so Copy
  // Code always reproduces exactly what's on screen. Same people used by the
  // List component elsewhere in this codebase, for consistency.
  var ROWS_DATA = [
    { name: "Jordan Lee", status: "Active", statusColor: "success", role: "Product Designer", email: "jordan.lee@company.com", mobile: "+1 415-555-0142" },
    { name: "Sam Ortiz", status: "Active", statusColor: "success", role: "Engineer", email: "sam.ortiz@company.com", mobile: "+1 415-555-0198" },
    { name: "Priya Nair", status: "Away", statusColor: "warning", role: "PM", email: "priya.nair@company.com", mobile: "+1 415-555-0233" }
  ];

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function radiusCssFor(value){
    return window.ADSFoundationModel.radiusCss(Number(value), window.ADSFoundation.get().unit);
  }

  function selectionMode(multiSelect, optionList, defaultValues){
    var allValues = optionList.map(function(opt){ return opt.value; });
    if (!multiSelect) return { mode: "all", values: allValues };
    var selected = multiSelect.getSelected();
    if (!selected.length || selected.length === optionList.length){
      return { mode: "all", values: allValues };
    }
    var isUntouchedDefault = defaultValues && selected.length === defaultValues.length &&
      selected.every(function(v, i){ return v === defaultValues[i]; });
    if (isUntouchedDefault) return { mode: "all", values: allValues };
    var ordered = allValues.filter(function(v){ return selected.indexOf(v) !== -1; });
    return { mode: "specific", values: ordered };
  }

  function propertyPromptLine(propLabel, info, optionList){
    if (info.mode === "all"){
      var allLabels = optionList.map(function(opt){ return opt.label; }).join(" / ");
      return "What " + propLabel.toLowerCase() + " do you want? (" + allLabels + ")";
    }
    var chosen = info.values.map(function(v){ return optionLabelFor(optionList, v); });
    if (chosen.length === 1){
      return propLabel + ": " + chosen[0] + " - the user has explicitly chosen this, generate only this option.";
    }
    return propLabel + ": " + chosen.join(", ") + " - the user has explicitly narrowed it to these, generate one variant per option.";
  }

  function resolveInfo(selectionInfo){
    selectionInfo = selectionInfo || {};
    return {
      radius: selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS),
      size: selectionInfo.size || selectionMode(null, SIZE_OPTIONS),
      showHeader: (selectionInfo.showHeader !== undefined) ? selectionInfo.showHeader : FALLBACK_DEFAULTS.showHeader
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push("Create a complete Table component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, corner radius, size, show header) - a structured grid of rows and columns for displaying tabular data (Name / Status / Role / Email / Mobile example columns - Email and Mobile render as real mailto:/tel: links, styled in this system's defined link color, var(--red-400)), with a header row and optional cell borders, alternating row stripes, or row selection.");
    lines.push("");
    lines.push("Border styles (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (5, apply to the whole set of body rows at once):");
    STATES.forEach(function(s){
      lines.push("- " + s.label + ": " + STATE_SPEC[s.key]);
    });
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to the Bordered type's outer container only - the Default type never carries a radius.");
    lines.push("");
    lines.push(propertyPromptLine("Size", info.size, SIZE_OPTIONS) + " Scales cell padding only - column widths and font-size stay the same at every size.");
    lines.push("");
    lines.push("Component properties: Corner radius (Bordered type only); Size; Show header (boolean, default checked - shows the column-label header row above the body rows).");
    lines.push("Current values - Show header: " + (info.showHeader ? "yes" : "no") + ".");
    lines.push("");
    lines.push("Interaction contract (real, data-backed usage, beyond this page's static demos):");
    lines.push("- Selection (" + SELECTION_MODES.length + "): " + SELECTION_MODES.map(function(m){ return m.label; }).join(" / ") + ".");
    SELECTION_MODES.forEach(function(m){ lines.push("  - " + m.label + ": " + m.detail); });
    lines.push("- Sort: " + SORT_SPEC.clientSide + " " + SORT_SPEC.serverSide + " " + SORT_SPEC.multiColumn + " " + SORT_SPEC.a11y);
    lines.push("- Filter: " + FILTER_SPEC.perColumn + " " + FILTER_SPEC.global + " " + FILTER_SPEC.emptyStates);
    lines.push("- Pagination vs virtualization (threshold " + PAGINATION_SPEC.thresholdRows + " rows): " + PAGINATION_SPEC.below + " " + PAGINATION_SPEC.above);
    lines.push("- Density (" + DENSITY_MODES.length + "): " + DENSITY_MODES.map(function(m){ return m.label + " - " + m.detail; }).join(" "));
    lines.push("- Required states (" + REQUIRED_STATES.length + "): " + REQUIRED_STATES.map(function(s){ return s.label + " - " + s.detail; }).join(" "));
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Table component */");
    lines.push("/* Width grows with the column set - Email/Mobile need real room");
    lines.push("   (\"jordan.lee@company.com\" alone needs ~165px) or they'd squeeze");
    lines.push("   Name/Role into wrapping onto a second line, same as the checkbox");
    lines.push("   column did before table-demo-table--has-checkbox existed. */");
    lines.push(".table-demo-table{ border-collapse:collapse; font-family:var(--font-body); font-size:var(--type-body-size); color:var(--text-hi); width:var(--dimension-800); }");
    lines.push(".table-demo-table th{ text-align: start; padding:var(--space-8) var(--space-10); font-size:var(--type-body-size); font-weight:var(--type-selected-weight); color:var(--text-dim); text-transform:none; border-bottom:var(--border-width-1) var(--border-style) var(--line-strong); }");
    lines.push(".table-demo-table td{ padding:var(--space-8) var(--space-10); border-bottom:1px solid var(--line); text-align: start; }");
    lines.push(".table-demo-table--bordered{ border:1px solid var(--line-strong); overflow:hidden; }");
    lines.push(".table-demo-table--bordered th, .table-demo-table--bordered td{ border-inline-end:1px solid var(--line); }");
    lines.push(".table-demo-table--bordered th:last-child, .table-demo-table--bordered td:last-child{ border-inline-end:none; }");
    lines.push(".table-demo-row--striped{ background:var(--graphite-850); }");
    lines.push(".table-demo-row--selected{ background:var(--red-tint); }");
    lines.push(".table-demo-status-cell{ display:flex; align-items:center; gap:var(--space-6); }");
    lines.push(".table-demo-checkbox-label{ display:flex; }");
    lines.push(".table-demo-checkbox-input{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }");
    lines.push(".table-demo-checkbox{ flex:none; width:var(--dimension-16); height:var(--dimension-16); border-radius:var(--radius-sm); border:var(--border-width-1) var(--border-style) var(--line-strong); display:flex; align-items:center; justify-content:center; color:#FFFFFF; }");
    lines.push(".table-demo-checkbox.is-checked, .table-demo-checkbox.is-indeterminate{ background:var(--red-500); border-color:var(--red-500); }");
    lines.push(".table-demo-checkbox-input:focus-visible + .table-demo-checkbox{ outline:2px solid var(--red-400); outline-offset:2px; }");
    lines.push(".table-demo-checkbox svg{ width:var(--dimension-11); height:var(--dimension-11); }");
    lines.push("/* Status dot reuses the Badge component's own .badge-demo-status-dot--success/--warning classes directly - no separate dot styling defined here. */");
    lines.push("");
    lines.push("/* Email/Mobile render as real mailto:/tel: links styled in this");
    lines.push("   system's actual defined link color - var(--red-400), the same token");
    lines.push("   the Link-type Button and Toast's own inline action use. There is no");
    lines.push("   blue \"link\" token anywhere in this system. No underline at rest -");
    lines.push("   only on hover, the same interaction-feedback pattern this system's");
    lines.push("   own Link-type Button already uses. */");
    lines.push(".table-demo-link-cell{ color:var(--red-400); text-decoration:none; }");
    lines.push(".table-demo-link-cell:hover{ text-decoration:underline; }");
    lines.push("");
    lines.push("/* Selection adds a leading checkbox column - width grows by that");
    lines.push("   column's own need (~40px) so Name/Role keep their normal widths");
    lines.push("   instead of being squeezed into wrapping onto a second line. */");
    lines.push(".table-demo-table--has-checkbox{ width:var(--dimension-800); }");
    lines.push("");
    lines.push("/* Size (3) - Large is the default (the base th/td padding above); Middle and Small only tighten padding, font-size stays fixed at every size. */");
    lines.push(".table-demo-table--sz-middle th, .table-demo-table--sz-middle td{ padding:var(--space-6) var(--space-8); }");
    lines.push(".table-demo-table--sz-small th, .table-demo-table--sz-small td{ padding:var(--space-4) var(--space-6); }");
    lines.push("");
    lines.push("/* Interaction contract (implement in the data layer, not shown in the CSS above): */");
    lines.push("/* Selection: none / single-row / multi-row with checkbox column - header checkbox goes indeterminate when some-not-all rows are checked; Space toggles a focused row. */");
    lines.push("/* Sort: client-side for small loaded datasets, server-side once paginated/virtualized server-side; single-column by default, multi-column via shift-click; sortable th must set aria-sort=\"ascending|descending|none\" (WCAG 4.1.3) and announce the change. */");
    lines.push("/* Filter: per-column filter vs a global search bar; \"no rows match\" (filtered-to-zero) must read differently from the true empty state (no data at all). */");
    lines.push("/* Pagination vs virtualization: client-side pagination below " + PAGINATION_SPEC.thresholdRows + " rows, virtualization (windowed rendering) at/above " + PAGINATION_SPEC.thresholdRows + " rows. */");
    lines.push("/* Density: comfortable (default) vs compact row height/padding. */");
    lines.push("/* Required states: Empty (Empty component + CTA), Loading (skeleton rows, not blank), Error (message + Retry action). */");
    return lines.join("\n");
  }

  // Renders one real <table class="table-demo-table table-demo-table--{typeKey}">
  // - the 3 fixed example rows, a header row (unless showHeader is false),
  // striping on the 2nd row when stateKey is "striped", and a leading
  // checkbox column with the first row marked selected when stateKey is
  // "selected". Bordered type carries the corner radius inline so Copy Code
  // reproduces exactly what the Live Preview matrix is showing.
  function typeLabelFor(typeKey){
    var match = TYPES.filter(function(t){ return t.key === typeKey; })[0];
    return match ? match.label : typeKey;
  }
  function stateLabelFor(stateKey){
    var match = STATES.filter(function(s){ return s.key === stateKey; })[0];
    return match ? match.label : stateKey;
  }

  function buildTableField(typeKey, stateKey, radius, showHeader, sizeKey){
    var isBordered = typeKey === "bordered";
    var styleAttr = isBordered ? ' style="border-radius:' + radiusCssFor(radius) + ';"' : "";
    var isSelected = stateKey === "selected";
    var isStriped = stateKey === "striped";
    var isLoading = stateKey === "loading";
    var sizeCls = (sizeKey && sizeKey !== "large") ? " table-demo-table--sz-" + sizeKey : "";
    var checkboxColCls = isSelected ? " table-demo-table--has-checkbox" : "";
    var tableCls = "table-demo-table table-demo-table--" + typeKey + sizeCls + checkboxColCls;
    // Names the table's purpose for assistive tech - required since the
    // matrix below renders many of these side by side with no visible
    // caption of its own.
    var ariaLabelAttr = ' aria-label="Team members example table - ' + typeLabelFor(typeKey) + ' type, ' + stateLabelFor(stateKey) + ' state"';

    var theadHtml = "";
    if (showHeader){
      // A native <input type="checkbox"> has no CSS-capturable visual of its
      // own (it's OS-painted chrome, not styleable background/border/
      // checkmark content) - pushed to Figma as-is it has nothing to render,
      // so it simply vanishes (reported: table's selection checkboxes
      // missing entirely). Same fix as Transfer's own checkbox column: hide
      // the real input (sr-only, keeps real semantics/ARIA) and give it a
      // sibling span that's actually CSS-painted (border/background/
      // checkmark icon), the only part Figma can see. The header checkbox
      // was also never implemented at all (a bare empty <th></th>, despite
      // this page's own purpose text describing a working select-all/
      // indeterminate header checkbox) - added here, indeterminate since
      // exactly one of the three demo rows is checked.
      var checkboxTh = isSelected ? '<th data-contract-part="checkbox-header"><label class="table-demo-checkbox-label"><input type="checkbox" class="table-demo-checkbox-input" aria-label="Select all rows" tabindex="-1" /><span class="table-demo-checkbox is-indeterminate" data-contract-kind="container">' + DASH_ICON_SVG + "</span></label></th>" : "";
      // scope="col" so a screen reader announces the column a cell belongs
      // to when navigating row by row, not just when reading the header row.
      theadHtml = '<thead data-contract-part="header"><tr data-contract-part="header-row">' + checkboxTh + '<th scope="col" data-contract-part="th-name">Name</th><th scope="col" data-contract-part="th-status">Status</th><th scope="col" data-contract-part="th-role">Role</th><th scope="col" data-contract-part="th-email">Email</th><th scope="col" data-contract-part="th-mobile">Mobile</th></tr></thead>';
    }

    if (isLoading){
      var loadingRowsHtml = ROWS_DATA.map(function(_, i){
        var cell = function(col){ return '<td data-contract-part="cell-' + i + '-' + col + '"><span class="skeleton-demo-line is-animated" data-contract-part="sk-' + i + '-' + col + '" data-contract-kind="container" style="width:70%;"></span></td>'; };
        return '<tr class="table-demo-row" data-contract-part="row-' + i + '" aria-hidden="true">' + (isSelected ? '<td data-contract-part="checkbox-cell-' + i + '"></td>' : "") + cell("name") + cell("status") + cell("role") + cell("email") + cell("mobile") + "</tr>";
      }).join("");
      return '<table class="' + tableCls + '"' + styleAttr + ariaLabelAttr + ' aria-busy="true" aria-live="polite">' + theadHtml + '<tbody data-contract-part="body">' + loadingRowsHtml + "</tbody></table>";
    }

    if (stateKey === "empty"){
      // Reuses the Empty component directly (icon/title/description) inside
      // one spanning cell, rather than inventing a second "no results"
      // visual language - a zero-row table and an empty list should look
      // like the same idea.
      var emptyHtml = '<tr class="table-demo-row" data-contract-part="empty-row"><td colspan="5" class="table-demo-empty-cell" data-contract-part="empty-cell">' +
        '<div class="empty-demo-panel" data-contract-part="empty-panel" style="padding:var(--space-20);">' +
        '<div class="empty-demo-icon-wrap empty-demo-icon-wrap--simple" data-contract-part="empty-icon" style="width:var(--dimension-32);height:var(--dimension-32);">' + EMPTY_ICON_SVG + '</div>' +
        '<p class="empty-demo-title" data-contract-part="empty-title" style="font-size:var(--type-body-size);">No results</p>' +
        '<p class="empty-demo-description" data-contract-part="empty-description" style="font-size:var(--type-caption-size);">Try a different search or filter.</p>' +
        '<button type="button" class="modal-demo-btn modal-demo-btn--primary" data-contract-part="empty-action" tabindex="-1">Add item</button>' +
        "</div></td></tr>";
      return '<table class="' + tableCls + '"' + styleAttr + ariaLabelAttr + ">" + theadHtml + '<tbody data-contract-part="body">' + emptyHtml + "</tbody></table>";
    }

    var rowsHtml = ROWS_DATA.map(function(person, i){
      var classes = ["table-demo-row"];
      if (isStriped && (i + 1) % 2 === 0) classes.push("table-demo-row--striped");
      if (isSelected && i === 0) classes.push("table-demo-row--selected");
      // tabindex="-1" on every focusable element here: this matrix is a
      // static side-by-side comparison of type x state (same convention as
      // every other component's own matrix in this system), not one
      // operable table - without it, a keyboard user hits a real checkbox
      // and real mailto:/tel: links on every one of these repeated rows.
      var isRowChecked = i === 0;
      var checkboxTd = isSelected ? '<td data-contract-part="checkbox-cell-' + i + '"><label class="table-demo-checkbox-label"><input type="checkbox" class="table-demo-checkbox-input" aria-label="Select ' + person.name + '" tabindex="-1"' + (isRowChecked ? " checked" : "") + ' /><span class="table-demo-checkbox' + (isRowChecked ? " is-checked" : "") + '" data-contract-kind="container">' + (isRowChecked ? CHECK_ICON_SVG : "") + "</span></label></td>" : "";
      var statusDotClass = "badge-demo-status-dot--" + person.statusColor;
      var statusHtml = '<td data-contract-part="cell-' + i + '-status"><span class="table-demo-status-cell" data-contract-part="v-' + i + '-status"><span class="' + statusDotClass + '"></span>' + person.status + "</span></td>";
      // Email/Mobile render as real links (mailto:/tel:) styled in this
      // system's actual defined link color - var(--red-400), the same
      // token the Link-type Button and Toast's own inline action use.
      // There is no blue "link" token anywhere in this system.
      var emailHtml = '<td data-contract-part="cell-' + i + '-email"><a class="table-demo-link-cell" data-contract-part="v-' + i + '-email" href="mailto:' + person.email + '" tabindex="-1">' + person.email + "</a></td>";
      var mobileHtml = '<td data-contract-part="cell-' + i + '-mobile"><a class="table-demo-link-cell" data-contract-part="v-' + i + '-mobile" href="tel:' + person.mobile.replace(/[^+\d]/g, "") + '" tabindex="-1">' + person.mobile + "</a></td>";
      var nameHtml = '<td data-contract-part="cell-' + i + '-name"><span data-contract-part="v-' + i + '-name">' + person.name + "</span></td>";
      var roleHtml = '<td data-contract-part="cell-' + i + '-role"><span data-contract-part="v-' + i + '-role">' + person.role + "</span></td>";
      return '<tr class="' + classes.join(" ") + '" data-contract-part="row-' + i + '">' + checkboxTd + nameHtml + statusHtml + roleHtml + emailHtml + mobileHtml + "</tr>";
    }).join("");

    return '<table class="' + tableCls + '"' + styleAttr + ariaLabelAttr + ">" + theadHtml + '<tbody data-contract-part="body">' + rowsHtml + "</tbody></table>";
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;
    var sizeInfo = info.size;

    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    lines.push("<!-- Example usage - one per border style, showing the Selected state" + (radiusInfo.mode === "specific" || sizeInfo.mode === "specific" ? ", at the explicitly chosen corner radius/size" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(buildTableField(t.key, "selected", exampleRadius, info.showHeader, exampleSize));
    });
    lines.push("");
    lines.push("<!-- Example usage - the other 4 states (Default border style) -->");
    lines.push(buildTableField("default", "default", exampleRadius, info.showHeader, exampleSize));
    lines.push(buildTableField("default", "striped", exampleRadius, info.showHeader, exampleSize));
    lines.push(buildTableField("default", "loading", exampleRadius, info.showHeader, exampleSize));
    lines.push(buildTableField("default", "empty", exampleRadius, info.showHeader, exampleSize));
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Builds the prompt/code for exactly ONE Corner radius x Size combination,
  // fully resolved (never "ask the question") - used by the Copy prompt/Copy
  // code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(radius, size, showHeader){
    return buildFullPrompt({
      radius: { mode: "specific", values: [radius] },
      size: { mode: "specific", values: [size] },
      showHeader: showHeader
    });
  }

  function buildComboCode(radius, size, showHeader){
    return buildFullCode({
      radius: { mode: "specific", values: [radius] },
      size: { mode: "specific", values: [size] },
      showHeader: showHeader
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
    }

    // Gallery-card copy CTA + click-to-navigate (table.html's listing card)
    // - separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-table"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-table"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(), cardCopyCodeBtn);
      });
    }
    var tableTypeCards = document.querySelectorAll(".table-type-card[data-system]");
    tableTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "table-" + card.dataset.system + ".html";
      card.addEventListener("click", function(e){
        if (e.target.closest("button, input, select, textarea, a, [role=combobox]")) return; window.ADSNavigation ? window.ADSNavigation.go(href) : (location.href = href); });
      card.addEventListener("keydown", function(e){
        if (e.target !== card) return;
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.ADSNavigation ? window.ADSNavigation.go(href) : (location.href = href);
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button (exactly one
    // Corner radius value is in play) or, whenever more than one value is
    // currently selected, a disclosure dropdown listing every combination by
    // name with its own "Copy" button.
    function buildCopyControl(container, plainLabel, buildSingle, combos, buildCombo){
      if (!container) return;
      if (container._copyDropdownCleanup){
        container._copyDropdownCleanup();
        container._copyDropdownCleanup = null;
      }

      if (combos.length <= 1){
        container.innerHTML = '<button type="button" class="btn btn-ghost btn-sm">' + plainLabel + "</button>";
        var plainBtn = container.querySelector("button");
        plainBtn.addEventListener("click", function(){ copyTextFull(buildSingle(), plainBtn); });
        return;
      }

      var itemsHtml = combos.map(function(c, i){
        return '<div class="copy-dropdown-item">' +
          '<span class="copy-dropdown-item-label">' + c.label + "</span>" +
          '<button type="button" class="btn btn-ghost btn-sm copy-dropdown-item-copy" data-combo-index="' + i + '">Copy</button>' +
          "</div>";
      }).join("");

      container.innerHTML =
        '<div class="copy-dropdown">' +
          '<button type="button" class="btn btn-ghost btn-sm copy-dropdown-trigger" aria-haspopup="true" aria-expanded="false">' +
            plainLabel + ' <span class="copy-dropdown-caret" aria-hidden="true"></span>' +
          "</button>" +
          '<div class="copy-dropdown-panel" hidden>' + itemsHtml + "</div>" +
        "</div>";

      var trigger = container.querySelector(".copy-dropdown-trigger");
      var panel = container.querySelector(".copy-dropdown-panel");

      function onDocClick(e){
        if (container.contains(e.target)) return;
        closePanel();
      }
      function onKeydown(e){
        if (e.key === "Escape"){ closePanel(); trigger.focus(); }
      }
      function closePanel(){
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        document.removeEventListener("click", onDocClick, false);
        document.removeEventListener("keydown", onKeydown, false);
      }
      function openPanel(){
        panel.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        document.addEventListener("click", onDocClick, false);
        document.addEventListener("keydown", onKeydown, false);
      }

      trigger.addEventListener("click", function(){
        if (panel.hidden) openPanel(); else closePanel();
      });

      combos.forEach(function(c, i){
        var copyBtn = panel.querySelector('[data-combo-index="' + i + '"]');
        copyBtn.addEventListener("click", function(e){
          e.stopPropagation();
          copyTextFull(buildCombo(c), copyBtn);
        });
      });

      container._copyDropdownCleanup = closePanel;
    }

    var matrixContainer = document.querySelector('[data-role="table-matrix-container"]');
    if (!matrixContainer) return;

    var radiusMount = document.querySelector('[data-role="table-radius-mount"]');
    var sizeMount = document.querySelector('[data-role="table-size-mount"]');
    var showHeaderInput = document.querySelector('[data-role="table-show-header"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function comboLabel(radius, size){
      return optionLabelFor(RADIUS_OPTIONS, radius) + " / " + optionLabelFor(SIZE_OPTIONS, size);
    }

    // Corner radius and Size both drive combos now - the states become the
    // rows and the 2 border styles the columns per combo.
    function buildMatrixSection(radius, size, showHeader){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildTableField(t.key, state.key, radius, showHeader, size) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(radius, size) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius]),
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        showHeader: showHeaderInput ? showHeaderInput.checked : FALLBACK_DEFAULTS.showHeader
      };
    }

    function render(){
      var showHeader = showHeaderInput ? showHeaderInput.checked : FALLBACK_DEFAULTS.showHeader;

      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(radius, size, showHeader);
          combos.push({ radius: radius, size: size, label: comboLabel(radius, size), showHeader: showHeader });
        });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.radius, c.size, c.showHeader); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.radius, c.size, c.showHeader); });
    }

    var propertyMultiSelects = {};
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "table-radius-dropdown-label",
        onChange: render
      });
    }
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "table-size-dropdown-label",
        onChange: render
      });
    }

    if (showHeaderInput){
      showHeaderInput.addEventListener("change", render);
    }

    render();
  });
})();

