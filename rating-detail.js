(() => {
  "use strict";

  var TYPES = [
    { key: "star", label: "Star" },
    { key: "heart", label: "Heart" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "selected", cls: " is-selected", label: "Selected" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    star: { purpose: "A classic 5-point star - reads instantly as a rating/score control, the most common pattern for product and service reviews." },
    heart: { purpose: "A heart icon - suited to favoriting or affection-toned scoring, like a content \"loved it\" scale." }
  };

  // Standard, simple icon outlines (viewBox 0 0 24 24) - the same path is
  // reused for both the filled and unfilled variant of each type, only the
  // fill/stroke attributes toggle, so Copy Code never has to keep two
  // divergent path definitions in sync.
  var ICON_STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z";
  var ICON_HEART = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  function iconPath(typeKey){
    return typeKey === "heart" ? ICON_HEART : ICON_STAR;
  }

  function iconSvg(typeKey, filled, size){
    var attrs = filled
      ? 'fill="currentColor" stroke="currentColor" stroke-width="1"'
      : 'fill="none" stroke="currentColor" stroke-width="2"';
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' + attrs +
      ' stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="' + iconPath(typeKey) + '"/></svg>';
  }

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Unfilled/filled/preview colors are identical across both icon types -
  // a Rating icon's meaning comes from its shape, not a per-type color
  // scheme, so Star and Heart share one consistent color story.
  function liveCssFor(){
    var textDim = getCssVar("--text-dim", "#6B6F76");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    return {
      rest: "color:" + textDim + ";",
      hover: "color:" + textHi + ";",
      preview: "color:" + red400 + "; opacity:0.6;",
      selected: "color:" + red500 + ";",
      disabled: "opacity:0.4;"
    };
  }

  // Icon size list - genuinely scoped to icon sizing (16/20/24/32), not a
  // copy-paste of the 8-option scale used by Button/Input/Group Button.
  var SIZE_OPTIONS = [
    { value: "16", label: "16px - Small" },
    { value: "20", label: "20px - Default" },
    { value: "24", label: "24px - Large" },
    { value: "32", label: "32px - XL" }
  ];
  var FALLBACK_DEFAULTS = { size: "20" };
  var DEFAULT_LABEL = "Rate this product";
  var DEFAULT_COUNT = 3;
  var MAX_ICONS = 5;

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
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

  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var label = selectionInfo.label || DEFAULT_LABEL;
    var selectedCount = typeof selectionInfo.selectedCount === "number" ? selectionInfo.selectedCount : DEFAULT_COUNT;
    var css = liveCssFor();

    var lines = [];
    lines.push("Create a complete Rating component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, icon size, state) - a row of 5 identical icon buttons that fill in as the user hovers or taps to score something from 0-5, with the current score persisting as filled icons after selection. This is not a text field - it is a tap-to-score control made of repeated icon buttons.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (4, apply per row of 5 icons):");
    lines.push("- Rest: all 5 icons unfilled/outline - " + css.rest);
    lines.push("- Hover: all 5 icons unfilled, but the first 3 show a lighter preview tint to suggest a live hover-preview - " + css.preview);
    lines.push("- Selected: the first N icons filled (N = the Selected property, 0-5), the rest stay unfilled - filled color: " + css.selected);
    lines.push("- Disabled: all 5 icons unfilled at 40% opacity, not-allowed cursor - " + css.disabled);
    lines.push("");
    lines.push(propertyPromptLine("Icon size", sizeInfo, SIZE_OPTIONS) + " Applied directly to each icon's width/height.");
    lines.push("");
    lines.push("Component properties: Label (text, default \"" + DEFAULT_LABEL + "\", shown above the row); Selected (0-5, default 3, controls how many of the 5 icons appear filled/selected)." +
      (selectionInfo.label || typeof selectionInfo.selectedCount === "number"
        ? " Currently configured as Label: \"" + label + "\", Selected: " + selectedCount + "."
        : ""));
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var label = selectionInfo.label || DEFAULT_LABEL;
    var selectedCount = typeof selectionInfo.selectedCount === "number" ? selectionInfo.selectedCount : DEFAULT_COUNT;
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];

    var lines = [];
    lines.push("/* Agentic Design System - Rating component */");
    lines.push(".rating-demo-field{ display:flex; flex-direction:column; gap:8px; }");
    lines.push(".rating-demo-label{ font-size:13px; font-weight:500; color:var(--text-hi); margin:0; }");
    lines.push(".rating-demo-row{ display:flex; align-items:center; gap:4px; }");
    lines.push(".rating-demo-icon{ flex:none; display:flex; align-items:center; justify-content:center; background:none; border:none; padding:2px; cursor:pointer; color:var(--text-dim); transition:color .15s ease; }");
    lines.push(".rating-demo-icon svg{ display:block; }");
    lines.push(".rating-demo-icon.is-filled{ color:var(--red-500); }");
    lines.push(".rating-demo-icon.is-preview{ color:var(--red-400); opacity:0.6; }");
    lines.push(".rating-demo-row.is-disabled .rating-demo-icon, .rating-demo-icon:disabled{ opacity:0.4; cursor:not-allowed; }");
    lines.push(".rating-demo-icon:hover:not(:disabled){ color:var(--text-hi); }");
    lines.push("");
    lines.push(sizeInfo.mode === "all"
      ? "/* Icon size - not chosen yet, default is 20px. Set via width/height on each <svg> (16 / 20 / 24 / 32px options). */"
      : "/* Icon size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " - set via width/height on each <svg>. */");
    lines.push("");
    lines.push("<!-- Example usage - one per type, Selected state showing " + selectedCount + " of 5 filled, at " + exampleSize + "px -->");
    TYPES.forEach(function(t){
      lines.push('<div class="rating-demo-field">');
      lines.push('  <p class="rating-demo-label">' + label + "</p>");
      lines.push('  <div class="rating-demo-row is-selected">');
      for (var i = 0; i < MAX_ICONS; i++){
        var filled = i < selectedCount;
        lines.push('    <button type="button" class="rating-demo-icon' + (filled ? " is-filled" : "") + '">' + iconSvg(t.key, filled, exampleSize) + "</button>");
      }
      lines.push("  </div>");
      lines.push("</div>");
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Icon size, fully resolved (never
  // "ask the question") - used by the Copy prompt/Copy code dropdown's
  // per-combination "Copy" buttons.
  function buildComboPrompt(size, label, selectedCount){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      label: label,
      selectedCount: selectedCount
    });
  }

  function buildComboCode(size, label, selectedCount){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      label: label,
      selectedCount: selectedCount
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

    // Gallery-card copy CTA + click-to-navigate (rating.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-rating"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-rating"]');
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
    var ratingTypeCards = document.querySelectorAll(".rating-type-card[data-system]");
    ratingTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "rating-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button (exactly one
    // Icon size is in play) or, whenever more than one size is currently
    // selected, a disclosure dropdown listing every size by name with its
    // own "Copy" button.
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

    var matrixContainer = document.querySelector('[data-role="rating-matrix-container"]');
    if (!matrixContainer) return;

    var countSelect = document.querySelector('[data-role="rating-count-select"]');
    var sizeMount = document.querySelector('[data-role="rating-size-mount"]');
    var labelInput = document.querySelector('[data-role="rating-label"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildRatingField(typeKey, stateKey, stateCls, size, label, selectedCount){
      var isDisabled = stateKey === "disabled";
      var icons = [];
      for (var i = 0; i < MAX_ICONS; i++){
        var extraCls = "";
        var filled = false;
        if (stateKey === "selected"){
          filled = i < selectedCount;
          if (filled) extraCls = " is-filled";
        } else if (stateKey === "hover" && i < 3){
          extraCls = " is-preview";
        }
        var disabledAttr = isDisabled ? " disabled" : "";
        icons.push('<button type="button" class="rating-demo-icon' + extraCls + '"' + disabledAttr + ">" + iconSvg(typeKey, filled, size) + "</button>");
      }
      var rowHtml = '<div class="rating-demo-row' + stateCls + '">' + icons.join("") + "</div>";
      return '<div class="rating-demo-field"><p class="rating-demo-label">' + label + "</p>" + rowHtml + "</div>";
    }

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function comboLabel(size){
      return optionLabelFor(SIZE_OPTIONS, size);
    }

    function buildMatrixSection(size, label, selectedCount){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildRatingField(t.key, state.key, state.cls, size, label, selectedCount) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        label: labelInput ? (labelInput.value.trim() || DEFAULT_LABEL) : DEFAULT_LABEL,
        selectedCount: countSelect ? parseInt(countSelect.value, 10) : DEFAULT_COUNT
      };
    }

    function render(){
      var label = labelInput ? (labelInput.value.trim() || DEFAULT_LABEL) : DEFAULT_LABEL;
      var selectedCount = countSelect ? parseInt(countSelect.value, 10) : DEFAULT_COUNT;
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(size, label, selectedCount);
        combos.push({ size: size, label: comboLabel(size), fieldLabel: label, selectedCount: selectedCount });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.fieldLabel, c.selectedCount); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.fieldLabel, c.selectedCount); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Icon size options",
        labelledBy: "rating-size-dropdown-label",
        onChange: render
      });
    }

    if (countSelect){
      countSelect.addEventListener("change", render);
    }
    if (labelInput){
      labelInput.addEventListener("input", render);
    }

    render();
  });
})();
