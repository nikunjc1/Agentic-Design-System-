(() => {
  "use strict";

  var TYPES = [
    { key: "outlined", label: "Outlined" },
    { key: "filled", label: "Filled" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "pressed", cls: " is-pressed", label: "Pressed" },
    { key: "selected", cls: " is-selected", label: "Selected" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    outlined: { purpose: "A bordered track with a divider between each segment - reads clearly on any background, no extra chrome besides the outline." },
    filled: { purpose: "A solid track where the selected segment gets its own pill highlight - useful when the group needs to stand out as one cohesive control." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  function liveCssFor(typeKey){
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var textMid = getCssVar("--text-mid", "#A7ABB2");
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var graphite600 = getCssVar("--graphite-600", "#383D44");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.1)");

    if (typeKey === "outlined"){
      return {
        rest: "background:transparent;color:" + textHi + ";border-right:1.5px solid " + lineStrong + ";",
        hover: "background:" + graphite800 + ";",
        pressed: "background:" + graphite700 + ";",
        selected: "background:" + redTint + ";color:" + red500 + ";",
        focus: "outline:2px solid " + red400 + ";outline-offset:-3px;"
      };
    }
    return {
      rest: "background:transparent;color:" + textMid + ";",
      hover: "background:" + graphite700 + ";color:" + textHi + ";",
      pressed: "background:" + graphite600 + ";",
      selected: "background:" + red500 + ";color:#FFFFFF;",
      focus: "outline:2px solid " + red400 + ";outline-offset:2px;"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .group-btn-segment--h* rules in shell.css (not re-derived by
  // formula) so Copy Code reproduces exactly what the Live Preview matrix
  // is showing, at every size, not just the one size a formula happens to
  // agree with.
  var SIZE_SCALE = {
    "24": { pad: 10, font: 11 },
    "28": { pad: 12, font: 12 },
    "32": { pad: 12, font: 12 },
    "36": { pad: 14, font: 13 },
    "40": { pad: 16, font: 14 },
    "44": { pad: 18, font: 15 },
    "48": { pad: 20, font: 16 },
    "56": { pad: 24, font: 17 }
  };

  // Size / Corner radius option lists - same value scale as the Button and
  // Input systems, shared between the page's own multi-select dropdowns and
  // the Copy Prompt/Copy Code generators below.
  var SIZE_OPTIONS = [
    { value: "24", label: "24px - XXS" },
    { value: "28", label: "28px - XS" },
    { value: "32", label: "32px - S" },
    { value: "36", label: "36px - SM" },
    { value: "40", label: "40px - M" },
    { value: "44", label: "44px - L" },
    { value: "48", label: "48px - XL" },
    { value: "56", label: "56px - XXL" }
  ];
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  var FALLBACK_DEFAULTS = { size: "40", radius: "8" };
  // Number of buttons drives the labels directly - no separate Labels field
  // to keep in sync. One consistent lettered sequence (Option A, B, C...)
  // covers the full 1-9 range the dropdown offers, so segment naming never
  // switches convention partway through.
  var LABEL_POOL = ["Option A", "Option B", "Option C", "Option D", "Option E", "Option F", "Option G", "Option H", "Option I"];
  var DEFAULT_LABELS = LABEL_POOL.slice(0, 3);
  var DEFAULT_COUNT = 3;

  function labelsForCount(count){
    return LABEL_POOL.slice(0, count);
  }

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function radiusClassSuffix(value){
    return value === "9999" ? "pill" : value;
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

  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("Create a complete Group Button (segmented control) component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - a row of joined segments where exactly one is selected at a time, not separate one-off buttons glued together.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Hover: " + css.hover);
      lines.push("  Pressed: " + css.pressed);
      lines.push("  Selected: " + css.selected);
      lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
    });
    lines.push("");
    lines.push("States (6, apply per segment): Rest, Hover, Pressed, Selected, Focused, Disabled.");
    lines.push("- Only one segment is ever Selected at a time - selecting a new segment deselects the previous one.");
    lines.push("- Disabled applies to the whole group at once (40% opacity, not-allowed cursor), not one segment at a time.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height, applied to every segment.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to the group's outer corners only - the joining edges between segments stay square.");
    lines.push("");
    lines.push("Component properties: Number of buttons (dropdown, 1-9, default 3 - drives both segment count and labels, one consistent lettered sequence: Option A, Option B, Option C, Option D, Option E, Option F, Option G, Option H, Option I); Field label (optional toggle, shows a label above the group, e.g. \"View\", mirrors the Input component's Label); Supporting text (optional toggle, shows helper text below the group, e.g. \"Choose how to display your results.\", mirrors Input's helper text).");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var fieldLabel = selectionInfo.fieldLabel || "";
    var supportingText = selectionInfo.supportingText || "";

    var lines = [];
    lines.push("/* Agentic Design System - Group Button (segmented control) component */");
    lines.push(".group-btn{ display:inline-flex; align-items:stretch; overflow:hidden; box-sizing:border-box; }");
    lines.push('.group-btn-segment{ box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; border:none; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-weight:500; white-space:nowrap; cursor:pointer; transition:background-color .15s ease, border-color .15s ease, color .15s ease; }');
    lines.push(".group-btn-segment:disabled{ cursor:not-allowed; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".group-btn-segment--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 8px - outer corners only */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - outer corners only */");
    radiiToEmit.forEach(function(radius){
      lines.push(".group-btn--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (2) - rest / hover / pressed / selected / focus per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".group-btn--" + t.key + " .group-btn-segment";
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":active{ " + css.pressed + " }");
      lines.push(cls + ".is-selected{ " + css.selected + " }");
      lines.push(cls + ":focus-visible{ " + css.focus + " }");
    });
    lines.push("");
    lines.push("/* Disabled - applies to the whole group */");
    lines.push(".group-btn-segment:disabled{ opacity:0.4; }");
    lines.push("");
    if (fieldLabel || supportingText){
      lines.push("/* Optional field label / supporting text - mirrors the Input component's Label and helper text */");
      lines.push(".group-btn-field{ display:flex; flex-direction:column; gap:8px; align-items:flex-start; }");
      lines.push(".group-btn-field-label{ font-size:13px; font-weight:500; color:var(--text-hi); margin:0; }");
      lines.push(".group-btn-field-note{ font-size:12px; color:var(--text-dim); margin:0; }");
      lines.push("");
    }
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      var indent = (fieldLabel || supportingText) ? "  " : "";
      if (fieldLabel || supportingText) lines.push('<div class="group-btn-field">');
      if (fieldLabel) lines.push(indent + '<p class="group-btn-field-label">' + fieldLabel + "</p>");
      lines.push(indent + '<div class="group-btn group-btn--' + t.key + " group-btn--radius-" + radiusClassSuffix(exampleRadius) + '" style="border-radius:' + radiusCssFor(exampleRadius) + '">');
      DEFAULT_LABELS.forEach(function(label, i){
        var selectedCls = i === 0 ? " is-selected" : "";
        lines.push(indent + '  <button type="button" class="group-btn-segment group-btn-segment--h' + exampleSize + selectedCls + '">' + label + "</button>");
      });
      lines.push(indent + "</div>");
      if (supportingText) lines.push(indent + '<p class="group-btn-field-note">' + supportingText + "</p>");
      if (fieldLabel || supportingText) lines.push("</div>");
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size x Corner radius
  // combination, fully resolved (never "ask the question") - used by the
  // Copy prompt/Copy code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(size, radius, fieldLabel, supportingText){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      fieldLabel: fieldLabel,
      supportingText: supportingText
    });
  }

  function buildComboCode(size, radius, fieldLabel, supportingText){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      fieldLabel: fieldLabel,
      supportingText: supportingText
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

    // Gallery-card copy CTA + click-to-navigate (group-button.html's
    // listing card) - separate data-role from every other system's own
    // copy roles so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-group"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-group"]');
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
    var groupTypeCards = document.querySelectorAll(".group-type-card[data-system]");
    groupTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "group-button-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button (exactly one
    // Size x Corner radius combination is in play) or, whenever more than
    // one combination is currently selected, a disclosure dropdown listing
    // every combination by name with its own "Copy" button.
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

    var matrixContainer = document.querySelector('[data-role="group-matrix-container"]');
    if (!matrixContainer) return;

    var countSelect = document.querySelector('[data-role="group-count-select"]');
    var sizeMount = document.querySelector('[data-role="group-size-mount"]');
    var radiusMount = document.querySelector('[data-role="group-radius-mount"]');
    var showLabelInput = document.querySelector('[data-role="group-show-label"]');
    var fieldLabelInput = document.querySelector('[data-role="group-field-label"]');
    var fieldLabelFieldWrap = document.querySelector('[data-role="group-field-label-field"]');
    var showSupportingInput = document.querySelector('[data-role="group-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="group-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="group-supporting-text-field"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildGroupButton(typeKey, stateKey, stateCls, size, radius, labels, fieldLabel, supportingText){
      var isDisabled = stateKey === "disabled";
      var radiusCss = radiusCssFor(radius);
      var segments = labels.map(function(label, i){
        var segCls = "group-btn-segment group-btn-segment--h" + size + (i === 0 ? stateCls : "");
        var disabledAttr = isDisabled ? " disabled" : "";
        return '<button type="button" class="' + segCls + '"' + disabledAttr + ">" + label + "</button>";
      }).join("");
      var groupHtml = '<div class="group-btn group-btn--' + typeKey + '" style="border-radius:' + radiusCss + '">' + segments + "</div>";
      if (!fieldLabel && !supportingText) return groupHtml;
      var labelHtml = fieldLabel ? '<p class="group-btn-field-label">' + fieldLabel + "</p>" : "";
      var supportingHtml = supportingText ? '<p class="group-btn-field-note">' + supportingText + "</p>" : "";
      return '<div class="group-btn-field">' + labelHtml + groupHtml + supportingHtml + "</div>";
    }

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function comboLabel(size, radius){
      return optionLabelFor(SIZE_OPTIONS, size) + " / " + optionLabelFor(RADIUS_OPTIONS, radius);
    }

    function buildMatrixSection(size, radius, labels, fieldLabel, supportingText){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildGroupButton(t.key, state.key, state.cls, size, radius, labels, fieldLabel, supportingText) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size, radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius]),
        fieldLabel: (showLabelInput && showLabelInput.checked) ? (fieldLabelInput.value.trim() || "View") : "",
        supportingText: (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "Choose how to display your results.") : ""
      };
    }

    function render(){
      var count = countSelect ? parseInt(countSelect.value, 10) : DEFAULT_COUNT;
      var labels = labelsForCount(count);
      var fieldLabel = (showLabelInput && showLabelInput.checked) ? (fieldLabelInput.value.trim() || "View") : "";
      var supportingText = (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "Choose how to display your results.") : "";

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, labels, fieldLabel, supportingText);
          combos.push({ size: size, radius: radius, label: comboLabel(size, radius), fieldLabel: fieldLabel, supportingText: supportingText });
        });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.radius, c.fieldLabel, c.supportingText); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.radius, c.fieldLabel, c.supportingText); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "group-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "group-radius-dropdown-label",
        onChange: render
      });
    }

    if (countSelect){
      countSelect.addEventListener("change", render);
    }

    if (showLabelInput && fieldLabelFieldWrap){
      showLabelInput.addEventListener("change", function(){
        fieldLabelFieldWrap.hidden = !showLabelInput.checked;
        render();
      });
    }
    if (fieldLabelInput){
      fieldLabelInput.addEventListener("input", render);
    }

    if (showSupportingInput && supportingTextFieldWrap){
      showSupportingInput.addEventListener("change", function(){
        supportingTextFieldWrap.hidden = !showSupportingInput.checked;
        render();
      });
    }
    if (supportingTextInput){
      supportingTextInput.addEventListener("input", render);
    }

    render();
  });
})();
