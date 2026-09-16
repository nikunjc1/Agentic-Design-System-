(() => {
  "use strict";

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "bordered", label: "Bordered" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "with-avatars", label: "With avatars" },
    { key: "with-actions", label: "With avatars + action" }
  ];

  var FULL_SPEC = {
    "default": { purpose: "No outer border - the rows stack directly against the page background, optionally divided by a thin line between each row." },
    "bordered": { purpose: "The whole list sits inside one bordered, corner-radius'd container box." }
  };

  var STATE_SPEC = {
    "default": "Plain rows - a title and description only, no avatar or trailing content.",
    "with-avatars": "The same rows, each now showing a small leading initials-avatar circle.",
    "with-actions": "The same rows with avatars, plus a small trailing text-style action link (e.g. \"View\") on the right of each row."
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Corner radius option list - same value scale as the Button and Group
  // Button systems, shared between the page's own multi-select dropdown and
  // the Copy Prompt/Copy Code generators below. Applies to the Bordered
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
    showDividers: true
  };

  // Fixed example data set - three example people shared by every row
  // builder, the listing card preview and the Live Preview matrix, so Copy
  // Code always reproduces exactly what's on screen.
  var ROWS_DATA = [
    { name: "Jordan Lee", role: "Product Designer", initials: "JL" },
    { name: "Sam Ortiz", role: "Engineer", initials: "SO" },
    { name: "Priya Nair", role: "PM", initials: "PN" }
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
      showDividers: (selectionInfo.showDividers !== undefined) ? selectionInfo.showDividers : FALLBACK_DEFAULTS.showDividers
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push("Create a complete List component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, corner radius, show dividers) - a vertical stack of item rows for displaying a collection of similar items, each row with a title and description, an optional leading avatar, and an optional trailing action link.");
    lines.push("");
    lines.push("Container styles (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("Content states (3, apply to every row in the list at once):");
    STATES.forEach(function(s){
      lines.push("- " + s.label + ": " + STATE_SPEC[s.key]);
    });
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to the Bordered type's outer container only - the Default type never carries a radius.");
    lines.push("");
    lines.push("Component properties: Corner radius (Bordered type only); Show dividers (boolean, default checked - shows a thin line between each row).");
    lines.push("Current values - Show dividers: " + (info.showDividers ? "yes" : "no") + ".");
    return lines.join("\n");
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - List component */");
    lines.push(".list-demo-panel{ display:flex; flex-direction:column; width:260px; background:var(--graphite-900); }");
    lines.push(".list-demo-panel--default{ background:transparent; }");
    lines.push(".list-demo-panel--bordered{ border:1px solid var(--line-strong); overflow:hidden; }");
    lines.push(".list-demo-row{ box-sizing:border-box; display:flex; align-items:center; gap:10px; padding:10px 12px; }");
    lines.push(".list-demo-row--divided{ border-bottom:1px solid var(--line); }");
    lines.push(".list-demo-panel--bordered .list-demo-row--divided{ border-bottom-color:var(--line-strong); }");
    lines.push("/* Leading avatar reuses the Avatar component's own .avatar-demo-circle/.avatar-demo-circle--initials/.avatar-demo-circle--h32 classes directly - no separate box or font-size rules. */");
    lines.push(".list-demo-body{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:2px; }");
    lines.push('.list-demo-title{ margin:0; font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--text-hi); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push('.list-demo-description{ margin:0; font-family:var(--font-body); font-size:12px; color:var(--text-dim); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push(".list-demo-action{ flex:none; font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--red-400); background:none; border:none; cursor:pointer; padding:0; }");
    return lines.join("\n");
  }

  // Renders one .list-demo-panel - 3 fixed example rows (title + description,
  // optionally a leading initials avatar and/or a trailing action link,
  // depending on stateKey), optionally divided, inside either a borderless
  // or bordered container depending on typeKey.
  function buildListField(typeKey, radius, showDividers, stateKey){
    var isBordered = typeKey === "bordered";
    var styleAttr = isBordered ? ' style="border-radius:' + radiusCssFor(radius) + ';"' : "";
    var rowsHtml = ROWS_DATA.map(function(person, i){
      var isLast = i === ROWS_DATA.length - 1;
      var dividedCls = (showDividers && !isLast) ? " list-demo-row--divided" : "";
      var avatarHtml = (stateKey !== "default")
        ? '<div class="list-demo-avatar avatar-demo-circle avatar-demo-circle--initials avatar-demo-circle--h32">' + person.initials + "</div>"
        : "";
      var actionHtml = (stateKey === "with-actions")
        ? '<button type="button" class="list-demo-action">View</button>'
        : "";
      return '<div class="list-demo-row' + dividedCls + '">' + avatarHtml +
        '<div class="list-demo-body"><p class="list-demo-title">' + person.name + '</p><p class="list-demo-description">' + person.role + "</p></div>" +
        actionHtml + "</div>";
    }).join("");
    return '<div class="list-demo-panel list-demo-panel--' + typeKey + '"' + styleAttr + ">" + rowsHtml + "</div>";
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per container style, with avatars and action links" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen corner radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(buildListField(t.key, exampleRadius, info.showDividers, "with-actions"));
    });
    lines.push("");
    lines.push("<!-- Example usage - the other 2 content states (Default type) -->");
    lines.push(buildListField("default", exampleRadius, info.showDividers, "default"));
    lines.push(buildListField("default", exampleRadius, info.showDividers, "with-avatars"));
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Corner radius value, fully
  // resolved (never "ask the question") - used by the Copy prompt/Copy code
  // dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(radius, showDividers){
    return buildFullPrompt({
      radius: { mode: "specific", values: [radius] },
      showDividers: showDividers
    });
  }

  function buildComboCode(radius, showDividers){
    return buildFullCode({
      radius: { mode: "specific", values: [radius] },
      showDividers: showDividers
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

    // Gallery-card copy CTA + click-to-navigate (list.html's listing card)
    // - separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-list"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-list"]');
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
    var listTypeCards = document.querySelectorAll(".list-type-card[data-system]");
    listTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "list-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="list-matrix-container"]');
    if (!matrixContainer) return;

    var radiusMount = document.querySelector('[data-role="list-radius-mount"]');
    var showDividersInput = document.querySelector('[data-role="list-show-dividers"]');
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

    // Since List has no Size property, only Corner radius drives multiple
    // combos - the 3 content states become the rows and the 2 container
    // types the columns, exactly like alert-detail.js's buildMatrixSection
    // does with radius-only combos.
    function buildMatrixSection(radius, showDividers){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildListField(t.key, radius, showDividers, state.key) + "</td>";
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
        showDividers: showDividersInput ? showDividersInput.checked : FALLBACK_DEFAULTS.showDividers
      };
    }

    function render(){
      var showDividers = showDividersInput ? showDividersInput.checked : FALLBACK_DEFAULTS.showDividers;

      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      radii.forEach(function(radius){
        html += buildMatrixSection(radius, showDividers);
        combos.push({ radius: radius, label: comboLabel(radius), showDividers: showDividers });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.radius, c.showDividers); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.radius, c.showDividers); });
    }

    var propertyMultiSelects = {};
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "list-radius-dropdown-label",
        onChange: render
      });
    }

    if (showDividersInput){
      showDividersInput.addEventListener("change", render);
    }

    render();
  });
})();
