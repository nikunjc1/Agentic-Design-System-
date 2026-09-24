(() => {
  "use strict";

  // Description is NOT interactive - a read-only label/value grid has no
  // hover/focus/disabled states. Its "states" dimension instead represents
  // data-shape variants (compact / with a section title / a long-wrapping
  // value), an honest structural difference rather than a fake interaction
  // state, so there is no liveCssFor()/pseudo-class logic anywhere in this
  // file - same approach as Divider.
  var TYPES = [
    { key: "default", label: "Default" },
    { key: "bordered", label: "Bordered" }
  ];
  var STATES = [
    { key: "compact", label: "Compact" },
    { key: "with-title", label: "With title" },
    { key: "long-value", label: "Long value" }
  ];

  var COLUMN_OPTIONS = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ];
  var DEFAULT_COLUMNS = "2";
  var DEFAULT_TITLE = "Account details";

  // Size (3) - Ant documents large(default)/middle/small, scaling item
  // padding and both label/value font one step - the grid's column count
  // and gap stay whatever Columns is set to, independent of size.
  var SIZE_OPTIONS = [
    { value: "small", label: "Small" },
    { value: "middle", label: "Middle" },
    { value: "large", label: "Large" }
  ];
  var DEFAULT_SIZE = "large";

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

  // Same 4 label/value pairs used by both "compact" and "with-title" states,
  // shared with description.html's own listing-card markup so the Copy
  // prompt/Copy code output always matches what every card and matrix cell
  // visibly shows.
  var COMPACT_ITEMS = [
    { label: "Name", value: "Jordan Lee" },
    { label: "Status", value: "Active" },
    { label: "Email", value: "jordan@example.com" },
    { label: "Role", value: "Admin" }
  ];

  // "long-value" swaps the last pair for a deliberately long one, spanning
  // the full grid width so it reads as its own row instead of being
  // squeezed into a single narrow column at 2 or 3 columns.
  var LONG_VALUE_ITEMS = [
    { label: "Name", value: "Jordan Lee" },
    { label: "Status", value: "Active" },
    { label: "Email", value: "jordan@example.com", span: true },
    { label: "Notes", value: "Escalated to billing team on Sep 12 for a refund review; awaiting manager approval before we can close this out.", span: true }
  ];

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  // Renders one Description example - a panel containing an optional
  // section title (With title state only) above a grid of label/value
  // cells, laid out at the given column count.
  // Bordered mode draws each cell's own border-inline-end/border-bottom
  // as internal dividers, on top of the grid's own outer border - correct
  // for interior cells, but for whichever cells sit against the grid's
  // right or bottom edge, that's a second border line stacking directly
  // on the container's, doubling the thickness right where every other
  // edge is a clean 1px. Simulating CSS Grid's own row-fill placement
  // here (accounting for full-width spanning items resetting the column)
  // is what lets the last real column/row get marked accurately, instead
  // of guessing from item count alone.
  function computeGridEdges(items, columns){
    var col = 0, row = 0;
    var placements = items.map(function(item){
      var isLastCol;
      if (item.span){
        isLastCol = true;
        row++;
        col = 0;
      } else {
        col++;
        isLastCol = col >= columns;
        if (isLastCol){ col = 0; row++; }
      }
      return { row: row, isLastCol: isLastCol };
    });
    var lastRow = placements.length ? placements[placements.length - 1].row : 0;
    return placements.map(function(p){ return { isLastCol: p.isLastCol, isLastRow: p.row === lastRow }; });
  }

  function buildDescriptionField(typeKey, stateKey, columns, title, sizeKey){
    var items = stateKey === "long-value" ? LONG_VALUE_ITEMS : COMPACT_ITEMS;
    var edges = computeGridEdges(items, columns);
    var titleHtml = stateKey === "with-title"
      ? '<p class="description-demo-title">' + escapeHtml((title || DEFAULT_TITLE).trim() || DEFAULT_TITLE) + "</p>"
      : "";
    var itemsHtml = items.map(function(item, i){
      var spanAttr = item.span ? ' style="grid-column: 1 / -1;"' : "";
      var edgeCls = (edges[i].isLastCol ? " is-last-col" : "") + (edges[i].isLastRow ? " is-last-row" : "");
      return '<div class="description-demo-item' + edgeCls + '"' + spanAttr + ">" +
        '<span class="description-demo-label">' + escapeHtml(item.label) + "</span>" +
        '<span class="description-demo-value">' + escapeHtml(item.value) + "</span>" +
        "</div>";
    }).join("");
    var gridHtml = '<div class="description-demo-grid" style="grid-template-columns:repeat(' + columns + ', 1fr);">' + itemsHtml + "</div>";
    var sizeCls = (sizeKey && sizeKey !== "large") ? " description-demo-panel--sz-" + sizeKey : "";
    return '<div class="description-demo-panel description-demo-panel--' + typeKey + sizeCls + '">' + titleHtml + gridHtml + "</div>";
  }

  function buildFullPrompt(columns, title, sizeInfo){
    columns = columns || DEFAULT_COLUMNS;
    title = (title || "").trim();
    sizeInfo = sizeInfo || selectionMode(null, SIZE_OPTIONS);

    var lines = [];
    lines.push("Create a complete Description component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (form, column count, size, section title) - a read-only label/value grid for displaying a set of structured details at a glance, like a summary panel, not a one-off table hacked together per screen.");
    lines.push("");
    lines.push("Description is not interactive - unlike most components in this system, it has no hover, focus or disabled state. Its variation is purely structural: 2 forms, each usable at a configurable column count and size, optionally with a section title above the grid.");
    lines.push("");
    lines.push("Forms (2):");
    lines.push("- Default: clean spacing between label/value pairs, no cell borders - a minimal look.");
    lines.push("- Bordered: each label/value pair sits in its own bordered cell, forming a compact table-like grid with 1px dividers between cells.");
    lines.push("");
    lines.push("Each pair is a label (small, uppercase, dimmed) stacked above its value (regular weight, high-contrast). Long values wrap gracefully within their cell instead of overflowing or breaking the grid layout.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Scales item padding and both label/value font one step - column count and grid gap are independent of size.");
    lines.push("");
    lines.push("Component properties: Columns (1/2/3, default 2, drives grid-template-columns for how many label/value pairs sit per row); Size; Section title (optional string, shown as a heading above the grid" + (title ? ", currently \"" + title + "\"" : ", e.g. \"Account details\"") + " - With title state only, other states ignore it).");
    return lines.join("\n");
  }

  function buildFullCode(columns, title, sizeInfo){
    columns = columns || DEFAULT_COLUMNS;
    title = (title || "").trim() || DEFAULT_TITLE;
    sizeInfo = sizeInfo || selectionMode(null, SIZE_OPTIONS);
    var exampleSize = sizeInfo.mode === "all" ? DEFAULT_SIZE : sizeInfo.values[0];

    var lines = [];
    lines.push("/* Agentic Design System - Description component */");
    lines.push(".description-demo-panel{ display:flex; flex-direction:column; gap:10px; width:280px; text-align: start; }");
    lines.push(".description-demo-title{ font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--text-hi); max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".description-demo-grid{ display:grid; gap:12px; }");
    lines.push(".description-demo-panel--bordered .description-demo-grid{ gap:0; border:1px solid var(--line); border-radius:var(--radius-sm); overflow:hidden; }");
    lines.push(".description-demo-item{ display:flex; flex-direction:column; gap:4px; }");
    lines.push(".description-demo-panel--bordered .description-demo-item{ padding:8px 10px; border-inline-end:1px solid var(--line); border-bottom:1px solid var(--line); gap:2px; }");
    lines.push("/* Cells against the grid's own right/bottom edge skip their own divider border there, since the grid's outer border already draws that edge */");
    lines.push(".description-demo-panel--bordered .description-demo-item.is-last-col{ border-inline-end:none; }");
    lines.push(".description-demo-panel--bordered .description-demo-item.is-last-row{ border-bottom:none; }");
    lines.push(".description-demo-label{ font-family:var(--font-body); font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.04em; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".description-demo-value{ font-family:var(--font-body); font-size:13px; color:var(--text-hi); word-break:break-word; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    lines.push("/* Size (3) - Large is the default; Middle/Small tighten item padding and both label/value font one step */");
    lines.push(".description-demo-panel--sz-middle .description-demo-item{ gap:2px; }");
    lines.push(".description-demo-panel--sz-middle.description-demo-panel--bordered .description-demo-item{ padding:6px 8px; }");
    lines.push(".description-demo-panel--sz-middle .description-demo-label{ font-size:10px; }");
    lines.push(".description-demo-panel--sz-middle .description-demo-value{ font-size:12px; }");
    lines.push(".description-demo-panel--sz-small .description-demo-item{ gap:1px; }");
    lines.push(".description-demo-panel--sz-small.description-demo-panel--bordered .description-demo-item{ padding:4px 6px; }");
    lines.push(".description-demo-panel--sz-small .description-demo-label{ font-size:10px; }");
    lines.push(".description-demo-panel--sz-small .description-demo-value{ font-size:11px; }");
    lines.push("");
    lines.push("<!-- Example usage - one per form, at " + columns + " column" + (columns === "1" ? "" : "s") + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + ", with section title \"" + title + "\" -->");
    TYPES.forEach(function(t){
      lines.push(buildDescriptionField(t.key, "with-title", columns, title, exampleSize));
    });
    return lines.join("\n");
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      var originalLabel = btn.textContent;
      function done(){
        btn.textContent = "Copied!";
        setTimeout(function(){ btn.textContent = originalLabel; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done).catch(function(){
          fallbackCopyFull(text);
          done();
        });
      } else {
        fallbackCopyFull(text);
        done();
      }
    }

    function fallbackCopyFull(text){
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand("copy"); }catch(e){}
      document.body.removeChild(ta);
    }

    // Gallery-card copy CTA + click-to-navigate (description.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-description"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-description"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_COLUMNS, DEFAULT_TITLE, null), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_COLUMNS, DEFAULT_TITLE, null), cardCopyCodeBtn);
      });
    }
    var descriptionTypeCards = document.querySelectorAll(".description-type-card[data-system]");
    descriptionTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "description-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button or, whenever more
    // than one combo is passed in, a disclosure dropdown listing each combo
    // by name with its own "Copy" button. Columns is still a single-value
    // <select>, but Size is now a real multiselect, so combos.length can
    // be >1 once more than one Size is checked - the "0 or 1 combos =
    // plain button" branch every existing driver script already has.
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

    var matrixContainer = document.querySelector('[data-role="description-matrix-container"]');
    if (!matrixContainer) return;

    var columnsSelect = document.querySelector('[data-role="description-columns-select"]');
    var titleInput = document.querySelector('[data-role="description-title"]');
    var sizeMount = document.querySelector('[data-role="description-size-mount"]');
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

    function buildMatrixSection(columns, title, size){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildDescriptionField(t.key, state.key, columns, title, size) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + optionLabelFor(SIZE_OPTIONS, size) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentValues(){
      return {
        columns: columnsSelect ? columnsSelect.value : DEFAULT_COLUMNS,
        title: (titleInput ? titleInput.value.trim() : "") || DEFAULT_TITLE
      };
    }

    function currentSizeInfo(){
      return selectionMode(propertyMultiSelect, SIZE_OPTIONS, [DEFAULT_SIZE]);
    }

    function render(){
      var values = currentValues();
      var sizes = selectedOrDefault(propertyMultiSelect, SIZE_OPTIONS, DEFAULT_SIZE);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(values.columns, values.title, size);
        combos.push({ size: size, label: optionLabelFor(SIZE_OPTIONS, size) });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(values.columns, values.title, currentSizeInfo()); }, combos, function(c){ return buildFullPrompt(values.columns, values.title, { mode: "specific", values: [c.size] }); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(values.columns, values.title, currentSizeInfo()); }, combos, function(c){ return buildFullCode(values.columns, values.title, { mode: "specific", values: [c.size] }); });
    }

    var propertyMultiSelect = null;
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelect = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [DEFAULT_SIZE],
        ariaLabel: "Size options",
        labelledBy: "description-size-dropdown-label",
        onChange: render
      });
    }

    if (columnsSelect) columnsSelect.addEventListener("change", render);
    if (titleInput) titleInput.addEventListener("input", render);

    render();
  });
})();
