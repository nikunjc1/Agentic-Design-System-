(() => {
  "use strict";

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "bordered", label: "Bordered" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "striped", label: "Striped" },
    { key: "selected", label: "Selected" }
  ];

  var FULL_SPEC = {
    "default": { purpose: "Minimal - only a bottom border under the header row and thin row-separator lines, no outer border or vertical cell lines." },
    "bordered": { purpose: "A full grid - outer border plus vertical and horizontal lines between every cell, like a spreadsheet." }
  };

  var STATE_SPEC = {
    "default": "Plain rows - no striping, no selection.",
    "striped": "The same rows, but every other row gets a subtly different background for alternating-row legibility.",
    "selected": "The same rows, now each with a leading checkbox column - the first row is visually marked as selected with a red-tinted row background and a checked checkbox, the other two rows show unchecked checkboxes."
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Corner radius option list - same value scale as every other system in
  // this design system, shared between the page's own multi-select dropdown
  // and the Copy Prompt/Copy Code generators below. Applies to the Bordered
  // type only - the Default type never carries a radius.
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  var FALLBACK_DEFAULTS = {
    radius: "8",
    showHeader: true
  };

  // Fixed example data set - three example people shared by every row
  // builder, the listing card preview and the Live Preview matrix, so Copy
  // Code always reproduces exactly what's on screen. Same people used by the
  // List component elsewhere in this codebase, for consistency.
  var ROWS_DATA = [
    { name: "Jordan Lee", status: "Active", statusColor: "success", role: "Product Designer" },
    { name: "Sam Ortiz", status: "Active", statusColor: "success", role: "Engineer" },
    { name: "Priya Nair", status: "Away", statusColor: "warning", role: "PM" }
  ];

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function radiusCssFor(value){
    return value === "9999" ? "9999px" : value + "px";
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
      showHeader: (selectionInfo.showHeader !== undefined) ? selectionInfo.showHeader : FALLBACK_DEFAULTS.showHeader
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push("Create a complete Table component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, corner radius, show header) - a structured grid of rows and columns for displaying tabular data (Name / Status / Role example columns), with a header row and optional cell borders, alternating row stripes, or row selection.");
    lines.push("");
    lines.push("Border styles (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (3, apply to the whole set of body rows at once):");
    STATES.forEach(function(s){
      lines.push("- " + s.label + ": " + STATE_SPEC[s.key]);
    });
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to the Bordered type's outer container only - the Default type never carries a radius.");
    lines.push("");
    lines.push("Component properties: Corner radius (Bordered type only); Show header (boolean, default checked - shows the column-label header row above the body rows).");
    lines.push("Current values - Show header: " + (info.showHeader ? "yes" : "no") + ".");
    return lines.join("\n");
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Table component */");
    lines.push(".table-demo-table{ border-collapse:collapse; font-family:var(--font-body); font-size:13px; color:var(--text-hi); width:320px; }");
    lines.push(".table-demo-table th{ text-align:left; padding:8px 10px; font-size:11px; font-weight:600; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.04em; border-bottom:1.5px solid var(--line-strong); }");
    lines.push(".table-demo-table td{ padding:8px 10px; border-bottom:1px solid var(--line); }");
    lines.push(".table-demo-table--bordered{ border:1px solid var(--line-strong); overflow:hidden; }");
    lines.push(".table-demo-table--bordered th, .table-demo-table--bordered td{ border-right:1px solid var(--line); }");
    lines.push(".table-demo-table--bordered th:last-child, .table-demo-table--bordered td:last-child{ border-right:none; }");
    lines.push(".table-demo-row--striped{ background:var(--graphite-850); }");
    lines.push(".table-demo-row--selected{ background:var(--red-tint); }");
    lines.push(".table-demo-status-cell{ display:flex; align-items:center; gap:6px; }");
    lines.push("/* Status dot reuses the Badge component's own .badge-demo-status-dot--success/--warning classes directly - no separate dot styling defined here. */");
    return lines.join("\n");
  }

  // Renders one real <table class="table-demo-table table-demo-table--{typeKey}">
  // - the 3 fixed example rows, a header row (unless showHeader is false),
  // striping on the 2nd row when stateKey is "striped", and a leading
  // checkbox column with the first row marked selected when stateKey is
  // "selected". Bordered type carries the corner radius inline so Copy Code
  // reproduces exactly what the Live Preview matrix is showing.
  function buildTableField(typeKey, stateKey, radius, showHeader){
    var isBordered = typeKey === "bordered";
    var styleAttr = isBordered ? ' style="border-radius:' + radiusCssFor(radius) + ';"' : "";
    var isSelected = stateKey === "selected";
    var isStriped = stateKey === "striped";

    var theadHtml = "";
    if (showHeader){
      var checkboxTh = isSelected ? "<th></th>" : "";
      theadHtml = "<thead><tr>" + checkboxTh + "<th>Name</th><th>Status</th><th>Role</th></tr></thead>";
    }

    var rowsHtml = ROWS_DATA.map(function(person, i){
      var classes = ["table-demo-row"];
      if (isStriped && (i + 1) % 2 === 0) classes.push("table-demo-row--striped");
      if (isSelected && i === 0) classes.push("table-demo-row--selected");
      var checkboxTd = isSelected ? '<td><input type="checkbox"' + (i === 0 ? " checked" : "") + " /></td>" : "";
      var statusDotClass = "badge-demo-status-dot--" + person.statusColor;
      var statusHtml = '<td><span class="table-demo-status-cell"><span class="' + statusDotClass + '"></span>' + person.status + "</span></td>";
      return '<tr class="' + classes.join(" ") + '">' + checkboxTd + "<td>" + person.name + "</td>" + statusHtml + "<td>" + person.role + "</td></tr>";
    }).join("");

    return '<table class="table-demo-table table-demo-table--' + typeKey + '"' + styleAttr + ">" + theadHtml + "<tbody>" + rowsHtml + "</tbody></table>";
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per border style, showing the Selected state" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen corner radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(buildTableField(t.key, "selected", exampleRadius, info.showHeader));
    });
    lines.push("");
    lines.push("<!-- Example usage - the other 2 states (Default border style) -->");
    lines.push(buildTableField("default", "default", exampleRadius, info.showHeader));
    lines.push(buildTableField("default", "striped", exampleRadius, info.showHeader));
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Corner radius value, fully
  // resolved (never "ask the question") - used by the Copy prompt/Copy code
  // dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(radius, showHeader){
    return buildFullPrompt({
      radius: { mode: "specific", values: [radius] },
      showHeader: showHeader
    });
  }

  function buildComboCode(radius, showHeader){
    return buildFullCode({
      radius: { mode: "specific", values: [radius] },
      showHeader: showHeader
    });
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
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
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

    function comboLabel(radius){
      return optionLabelFor(RADIUS_OPTIONS, radius);
    }

    // Table has no Size property, only Corner radius drives multiple combos
    // - the 3 states become the rows and the 2 border styles the columns,
    // exactly like alert-detail.js's/list-detail.js's buildMatrixSection
    // does with radius-only combos.
    function buildMatrixSection(radius, showHeader){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildTableField(t.key, state.key, radius, showHeader) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius]),
        showHeader: showHeaderInput ? showHeaderInput.checked : FALLBACK_DEFAULTS.showHeader
      };
    }

    function render(){
      var showHeader = showHeaderInput ? showHeaderInput.checked : FALLBACK_DEFAULTS.showHeader;

      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      radii.forEach(function(radius){
        html += buildMatrixSection(radius, showHeader);
        combos.push({ radius: radius, label: comboLabel(radius), showHeader: showHeader });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.radius, c.showHeader); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.radius, c.showHeader); });
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

    if (showHeaderInput){
      showHeaderInput.addEventListener("change", render);
    }

    render();
  });
})();

