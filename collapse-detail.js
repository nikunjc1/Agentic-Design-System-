(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var TYPES = [
    { key: "bordered", label: "Bordered" },
    { key: "borderless", label: "Borderless" }
  ];
  var STATES = [
    { key: "collapsed", label: "Collapsed" },
    { key: "expanded", label: "Expanded" },
    { key: "disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    bordered: { purpose: "Each panel has its own full border and rounded corners, with visible gaps between stacked panels - reads as distinct, separate cards." },
    borderless: { purpose: "Panels share only thin top/bottom divider lines with no side borders or radius, reading as one continuous grouped list." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Corner radius option list - same value scale as the Button and Group
  // Button systems, shared between the page's own multi-select dropdown and
  // the Copy Prompt/Copy Code generators below. Applies to the Bordered
  // type only - Borderless panels never carry a radius.
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  // Size (3) - Ant documents large/medium(default)/small, scaling header
  // and body padding plus header text one step - body text stays fixed.
  var SIZE_OPTIONS = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" }
  ];
  var FALLBACK_DEFAULTS = {
    radius: "8",
    size: "medium",
    header: "What's included in the free plan?",
    body: "The free plan includes up to 3 projects, 1GB of storage, and community support.",
    showIcon: true
  };

  // Static header/label used only for the first, non-interactive panel in
  // every demo group - purely to show how a panel looks stacked next to
  // another, never driven by the Header text property.
  var CONTEXT_HEADER = "Do you offer refunds?";

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
      size: selectionInfo.size || selectionMode(null, SIZE_OPTIONS),
      header: (selectionInfo.header !== undefined) ? selectionInfo.header : FALLBACK_DEFAULTS.header,
      body: (selectionInfo.body !== undefined) ? selectionInfo.body : FALLBACK_DEFAULTS.body,
      showIcon: (selectionInfo.showIcon !== undefined) ? selectionInfo.showIcon : FALLBACK_DEFAULTS.showIcon
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push("Create a complete Collapse component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, state, radius) - an accordion-style panel with a clickable header (with an optional chevron indicator) that reveals or hides a body of content beneath it when toggled, useful for progressively disclosing long or secondary content.");
    lines.push("");
    lines.push("Types (2, grouping styles):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (3):");
    lines.push("- Collapsed: header only, chevron pointing down/closed, body hidden.");
    lines.push("- Expanded: header plus visible body beneath it, chevron pointing up/open.");
    lines.push("- Disabled: header at reduced opacity, non-interactive, chevron dimmed, body hidden as if collapsed.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to the Bordered type only - Borderless panels never carry a radius.");
    lines.push("");
    lines.push(propertyPromptLine("Size", info.size, SIZE_OPTIONS) + " Scales header/body padding and the header text one step - body text stays fixed at 13px regardless of size.");
    lines.push("");
    lines.push("Component properties: Corner radius (Bordered type only); Size; Header text (text, default \"" + FALLBACK_DEFAULTS.header + "\"); Body text (text, default \"" + FALLBACK_DEFAULTS.body + "\", shown only in the Expanded state); Show icon (boolean, default checked - shows a chevron indicator on the right side of the header).");
    lines.push("Current values - Header: \"" + info.header + "\", Body: \"" + info.body + "\", Show icon: " + (info.showIcon ? "yes" : "no") + ".");
    return lines.join("\n");
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Collapse component */");
    lines.push(".collapse-demo-group{ display:flex; flex-direction:column; width:260px; }");
    lines.push(".collapse-demo-group--bordered{ gap:8px; }");
    lines.push(".collapse-demo-group--borderless{ gap:0; }");
    lines.push(".collapse-demo-panel--bordered{ border:1px solid var(--line-strong); background:var(--graphite-900); overflow:hidden; }");
    lines.push(".collapse-demo-panel--borderless{ border-top:1px solid var(--line); }");
    lines.push(".collapse-demo-group--borderless .collapse-demo-panel--borderless:last-child{ border-bottom:1px solid var(--line); }");
    lines.push('.collapse-demo-header{ box-sizing:border-box; display:flex; align-items:center; justify-content:space-between; gap:8px; padding:12px 14px; cursor:pointer; font-family:var(--font-body); }');
    lines.push('.collapse-demo-header-text{ font-size:13px; font-weight:600; color:var(--text-hi); text-align: start; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push(".collapse-demo-chevron{ flex:none; width:14px; height:14px; color:var(--text-dim); transition:transform .15s ease; }");
    lines.push(".collapse-demo-chevron.is-open{ transform:rotate(180deg); }");
    lines.push('.collapse-demo-body{ padding:0 14px 14px; font-family:var(--font-body); font-size:13px; color:var(--text-mid); text-align: start; max-width:260px; overflow-wrap:anywhere; }');
    lines.push(".collapse-demo-panel.is-disabled{ opacity:0.4; pointer-events:none; }");
    lines.push(".collapse-demo-panel.is-disabled .collapse-demo-header{ cursor:not-allowed; }");
    lines.push("");
    lines.push("/* Size (3) - Medium is the default; header/body padding and header text scale, body text stays fixed */");
    lines.push(".collapse-demo-group--sz-small .collapse-demo-header{ padding:8px 10px; }");
    lines.push(".collapse-demo-group--sz-small .collapse-demo-header-text{ font-size:12px; }");
    lines.push(".collapse-demo-group--sz-small .collapse-demo-body{ padding:0 10px 10px; }");
    lines.push(".collapse-demo-group--sz-large .collapse-demo-header{ padding:16px 18px; }");
    lines.push(".collapse-demo-group--sz-large .collapse-demo-header-text{ font-size:14px; }");
    lines.push(".collapse-demo-group--sz-large .collapse-demo-body{ padding:0 18px 18px; }");
    return lines.join("\n");
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
    lines.push("<!-- Example usage - one per type, Expanded state" + (radiusInfo.mode === "specific" || sizeInfo.mode === "specific" ? ", at the explicitly chosen corner radius/size" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(buildCollapseField(t.key, "expanded", exampleRadius, info.header, info.body, info.showIcon, exampleSize));
    });
    lines.push("");
    lines.push("<!-- Example usage - the other 2 states (Bordered type) -->");
    lines.push(buildCollapseField("bordered", "collapsed", exampleRadius, info.header, info.body, info.showIcon, exampleSize));
    lines.push(buildCollapseField("bordered", "disabled", exampleRadius, info.header, info.body, info.showIcon, exampleSize));
    return lines.join("\n");
  }

  function chevronSvg(isOpen){
    return '<svg class="collapse-demo-chevron' + (isOpen ? " is-open" : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
  }

  // The static "collapsed" panel that always leads a demo group, purely to
  // show how a panel looks stacked next to another - never reflects the
  // Header/Body/Show icon properties, only the current type/radius.
  function buildContextPanel(typeKey, radius, showIcon){
    var isBordered = typeKey === "bordered";
    var styleAttr = isBordered ? ' style="border-radius:' + radiusCssFor(radius) + ';"' : "";
    var iconHtml = showIcon ? chevronSvg(false) : "";
    var headerHtml = '<div class="collapse-demo-header"><span class="collapse-demo-header-text">' + CONTEXT_HEADER + "</span>" + iconHtml + "</div>";
    return '<div class="collapse-demo-panel collapse-demo-panel--' + typeKey + '"' + styleAttr + ">" + headerHtml + "</div>";
  }

  // The state-driven panel - the second item in every demo group, reflects
  // the actual stateKey/header/body/showIcon being demonstrated.
  function buildStatePanel(typeKey, stateKey, radius, header, body, showIcon){
    var isBordered = typeKey === "bordered";
    var isExpanded = stateKey === "expanded";
    var isDisabled = stateKey === "disabled";
    var styleAttr = isBordered ? ' style="border-radius:' + radiusCssFor(radius) + ';"' : "";
    var panelCls = "collapse-demo-panel collapse-demo-panel--" + typeKey + (isDisabled ? " is-disabled" : "");
    var iconHtml = showIcon ? chevronSvg(isExpanded) : "";
    var headerHtml = '<div class="collapse-demo-header"><span class="collapse-demo-header-text">' + escapeHtml(header) + "</span>" + iconHtml + "</div>";
    var bodyHtml = isExpanded ? '<div class="collapse-demo-body">' + escapeHtml(body) + "</div>" : "";
    return '<div class="' + panelCls + '"' + styleAttr + ">" + headerHtml + bodyHtml + "</div>";
  }

  // Renders one .collapse-demo-group - two stacked .collapse-demo-panel
  // items so bordered-vs-borderless grouping is visible even for a single
  // cell: a plain static "collapsed" panel for stacking context, followed
  // by the panel that actually reflects the requested state/properties.
  // Size is a group-level modifier (padding/text scale under the group
  // class), not a per-panel one.
  function buildCollapseField(typeKey, stateKey, radius, header, body, showIcon, sizeKey){
    var sizeCls = (sizeKey && sizeKey !== "medium") ? " collapse-demo-group--sz-" + sizeKey : "";
    var groupCls = "collapse-demo-group collapse-demo-group--" + typeKey + sizeCls;
    var contextPanel = buildContextPanel(typeKey, radius, showIcon);
    var statePanel = buildStatePanel(typeKey, stateKey, radius, header, body, showIcon);
    return '<div class="' + groupCls + '">' + contextPanel + statePanel + "</div>";
  }

  // Builds the prompt/code for exactly ONE Corner radius x Size
  // combination, fully resolved (never "ask the question") - used by the
  // Copy prompt/Copy code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(radius, size, header, body, showIcon){
    return buildFullPrompt({
      radius: { mode: "specific", values: [radius] },
      size: { mode: "specific", values: [size] },
      header: header,
      body: body,
      showIcon: showIcon
    });
  }

  function buildComboCode(radius, size, header, body, showIcon){
    return buildFullCode({
      radius: { mode: "specific", values: [radius] },
      size: { mode: "specific", values: [size] },
      header: header,
      body: body,
      showIcon: showIcon
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

    // Gallery-card copy CTA + click-to-navigate (collapse.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-collapse"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-collapse"]');
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
    var collapseTypeCards = document.querySelectorAll(".collapse-type-card[data-system]");
    collapseTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "collapse-" + card.dataset.system + ".html";
      card.addEventListener("click", function(e){
        if (e.target.closest("button, input, select, textarea, a, [role=combobox]")) return; window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.target !== card) return;
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

    var matrixContainer = document.querySelector('[data-role="collapse-matrix-container"]');
    if (!matrixContainer) return;

    var radiusMount = document.querySelector('[data-role="collapse-radius-mount"]');
    var sizeMount = document.querySelector('[data-role="collapse-size-mount"]');
    var headerInput = document.querySelector('[data-role="collapse-header"]');
    var bodyInput = document.querySelector('[data-role="collapse-body"]');
    var showIconInput = document.querySelector('[data-role="collapse-show-icon"]');
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

    // Corner radius and Size both drive combos now - STATES become the
    // rows and TYPES the columns per combo.
    function buildMatrixSection(radius, size, header, body, showIcon){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildCollapseField(t.key, state.key, radius, header, body, showIcon, size) + "</td>";
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
        header: headerInput ? (headerInput.value.trim() || FALLBACK_DEFAULTS.header) : FALLBACK_DEFAULTS.header,
        body: bodyInput ? (bodyInput.value.trim() || FALLBACK_DEFAULTS.body) : FALLBACK_DEFAULTS.body,
        showIcon: showIconInput ? showIconInput.checked : FALLBACK_DEFAULTS.showIcon
      };
    }

    function render(){
      var header = headerInput ? (headerInput.value.trim() || FALLBACK_DEFAULTS.header) : FALLBACK_DEFAULTS.header;
      var body = bodyInput ? (bodyInput.value.trim() || FALLBACK_DEFAULTS.body) : FALLBACK_DEFAULTS.body;
      var showIcon = showIconInput ? showIconInput.checked : FALLBACK_DEFAULTS.showIcon;

      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(radius, size, header, body, showIcon);
          combos.push({ radius: radius, size: size, label: comboLabel(radius, size), header: header, body: body, showIcon: showIcon });
        });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.radius, c.size, c.header, c.body, c.showIcon); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.radius, c.size, c.header, c.body, c.showIcon); });
    }

    var propertyMultiSelects = {};
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "collapse-radius-dropdown-label",
        onChange: render
      });
    }
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "collapse-size-dropdown-label",
        onChange: render
      });
    }

    if (headerInput){
      headerInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (bodyInput){
      bodyInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (showIconInput){
      showIconInput.addEventListener("change", render);
    }

    render();
  });
})();
