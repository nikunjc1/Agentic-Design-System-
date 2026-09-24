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
    { key: "standard", label: "Standard" },
    { key: "card", label: "Card" }
  ];
  var STATES = [
    { key: "unchecked", cls: "", label: "Unchecked" },
    { key: "checked", cls: "", label: "Checked" },
    { key: "indeterminate", cls: "", label: "Indeterminate" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    standard: { purpose: "Just the box and its label, inline - the default treatment for a single agreement checkbox or a compact list of options." },
    card: { purpose: "The box and label wrapped in a bordered row that highlights as a whole (background var(--red-tint), border var(--red-500)) when checked - useful for settings lists or selectable option cards where the entire row should read as selected, not just the box." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Box treatment is identical across both Types - only the Card type adds
  // an outer wrapper that highlights as a whole when checked, so liveCssFor
  // returns the shared box states plus an optional card highlight.
  function liveCssFor(typeKey){
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textDim = getCssVar("--text-dim", "#64686F");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.1)");

    var result = {
      box: {
        unchecked: "background:transparent;border-color:" + lineStrong + ";",
        checked: "background:" + red500 + ";border-color:" + red500 + ";",
        indeterminate: "background:" + red500 + ";border-color:" + red500 + ";",
        hover: "border-color:" + textDim + ";",
        focus: "outline:2px solid " + red400 + ";outline-offset:2px;",
        disabled: "opacity:0.4;cursor:not-allowed;"
      }
    };
    if (typeKey === "card"){
      result.card = "background:" + redTint + ";border-color:" + red500 + ";";
    }
    return result;
  }

  // Hand-tuned box size (px) and inner icon size (px) per Size option - must
  // stay identical to the real .checkbox-demo-box--h*/--icon rules in the
  // scratch CSS (not re-derived by formula) so Copy Code reproduces exactly
  // what the Live Preview matrix is showing, at every size.
  var SIZE_SCALE = {
    "16": { box: 16, icon: 10 },
    "20": { box: 20, icon: 12 },
    "24": { box: 24, icon: 14 }
  };

  // Size / Corner radius option lists - a small scale of their own (not the
  // 24-56px height / 0-12px radius scale shared by Button/Input/Group
  // Button) since the checkbox box itself is typically 16-24px.
  var SIZE_OPTIONS = [
    { value: "16", label: "16px - S" },
    { value: "20", label: "20px - M" },
    { value: "24", label: "24px - L" }
  ];
  var RADIUS_OPTIONS = [
    { value: "2", label: "2px - Sharp" },
    { value: "4", label: "4px - Balanced" },
    { value: "6", label: "6px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  var FALLBACK_DEFAULTS = { size: "20", radius: "4" };
  var DEFAULT_LABEL = (document.body && document.body.dataset.defaultLabel) || "I agree to the terms";

  var CHECK_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  var DASH_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14"/></svg>';

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
    lines.push("Create a complete Checkbox component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - a small square selection control with 3 possible values (unchecked, checked, indeterminate), always paired with a text label, not a one-off checkbox glued to text.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Unchecked: " + css.box.unchecked);
      lines.push("  Checked: " + css.box.checked + " White checkmark icon (#FFFFFF).");
      lines.push("  Indeterminate: " + css.box.indeterminate + " White horizontal dash icon (#FFFFFF) instead of the checkmark.");
      lines.push("  Hover: " + css.box.hover);
      lines.push("  Focused: " + css.box.focus + " Never just a color change, so the control stays visible against any background.");
      if (t.key === "card"){
        lines.push("  Card highlight (applies to the whole row, only when checked): " + css.card);
      }
    });
    lines.push("");
    lines.push("States (6): Unchecked, Checked, Indeterminate, Hover, Focused, Disabled.");
    lines.push("- Checked and Indeterminate share the same solid-fill treatment, distinguished only by icon (checkmark vs dash).");
    lines.push("- Indeterminate is set via the element's `indeterminate` DOM property at runtime, not an HTML attribute.");
    lines.push("- Disabled applies 40% opacity and a not-allowed cursor to the control.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Controls the box's width and height in px.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to the box itself.");
    lines.push("");
    lines.push("Component properties: Label (editable text next to the box).");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Checkbox component */");
    lines.push('.checkbox-demo-field{ display:inline-flex; align-items:center; gap:10px; cursor:pointer; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; }');
    lines.push(".checkbox-demo-field.is-disabled{ cursor:not-allowed; }");
    lines.push(".checkbox-demo-input{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (box width/height in px) - not chosen yet, default is 20 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".checkbox-demo-box--h" + size + "{ width:" + scale.box + "px; height:" + scale.box + "px; }");
      lines.push(".checkbox-demo-box--h" + size + " .checkbox-demo-icon svg{ width:" + scale.icon + "px; height:" + scale.icon + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (4 options) - not chosen yet, default is 4px */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " */");
    radiiToEmit.forEach(function(radius){
      lines.push(".checkbox--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Box - shared across both types, radius applied inline per-instance */");
    var css = liveCssFor("standard");
    lines.push(".checkbox-demo-box{ box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; flex:none; border:1.5px solid transparent; transition:background-color .15s ease, border-color .15s ease; " + css.box.unchecked + " }");
    lines.push(".checkbox-demo-input:checked + .checkbox-demo-box{ " + css.box.checked + " }");
    lines.push(".checkbox-demo-input:indeterminate + .checkbox-demo-box{ " + css.box.indeterminate + " }");
    lines.push(".checkbox-demo-box:hover, .checkbox-demo-box.is-hover{ " + css.box.hover + " }");
    lines.push(".checkbox-demo-input:focus-visible + .checkbox-demo-box, .checkbox-demo-box.is-focus{ " + css.box.focus + " }");
    lines.push(".checkbox-demo-input:disabled + .checkbox-demo-box, .checkbox-demo-box.is-disabled{ " + css.box.disabled + " }");
    lines.push(".checkbox-demo-icon{ display:flex; color:#FFFFFF; }");
    lines.push(".checkbox-demo-label{ font-size:14px; color:var(--text-hi); max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    lines.push("/* Card type (2nd Types option) - whole row highlights when checked */");
    var cardCss = liveCssFor("card");
    lines.push(".checkbox-demo-card{ display:flex; align-items:center; padding:12px 14px; border:1.5px solid var(--line-strong); border-radius:var(--radius-md); transition:background-color .15s ease, border-color .15s ease; }");
    lines.push(".checkbox-demo-card.is-checked{ " + cardCss.card + " }");
    lines.push("");
    lines.push("/* Disabled - 40% opacity, not-allowed cursor */");
    lines.push(".checkbox-demo-input:disabled ~ .checkbox-demo-label{ opacity:0.7; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one checked instance per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      if (t.key === "card") lines.push('<div class="checkbox-demo-card is-checked">');
      lines.push('<label class="checkbox-demo-field checkbox-demo-field--' + t.key + '">');
      lines.push('  <input type="checkbox" class="checkbox-demo-input" checked />');
      lines.push('  <span class="checkbox-demo-box checkbox-demo-box--h' + exampleSize + '" style="border-radius:' + radiusCssFor(exampleRadius) + '">');
      lines.push('    <span class="checkbox-demo-icon">' + CHECK_ICON_SVG + '</span>');
      lines.push('  </span>');
      lines.push('  <span class="checkbox-demo-label">' + DEFAULT_LABEL + '</span>');
      lines.push('</label>');
      if (t.key === "card") lines.push('</div>');
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size x Corner radius
  // combination, fully resolved (never "ask the question") - used by the
  // Copy prompt/Copy code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(size, radius){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] }
    });
  }

  function buildComboCode(size, radius){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] }
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

    // Gallery-card copy CTA + click-to-navigate (checkbox.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-checkbox"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-checkbox"]');
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
    var checkboxTypeCards = document.querySelectorAll(".checkbox-type-card[data-system]");
    checkboxTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "checkbox-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="checkbox-matrix-container"]');
    if (!matrixContainer) return;

    var labelInput = document.querySelector('[data-role="checkbox-label"]');
    var sizeMount = document.querySelector('[data-role="checkbox-size-mount"]');
    var radiusMount = document.querySelector('[data-role="checkbox-radius-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildCheckboxCell(typeKey, stateKey, stateCls, size, radius, label){
      var isChecked = stateKey === "checked";
      var isIndeterminate = stateKey === "indeterminate";
      var isDisabled = stateKey === "disabled";
      var radiusCss = radiusCssFor(radius);
      var checkedAttr = isChecked ? " checked" : "";
      var indeterminateAttr = isIndeterminate ? ' data-indeterminate="true"' : "";
      var disabledAttr = isDisabled ? " disabled" : "";
      var boxCls = "checkbox-demo-box checkbox-demo-box--h" + size + stateCls;
      var icon = "";
      if (isChecked){
        icon = '<span class="checkbox-demo-icon">' + CHECK_ICON_SVG + '</span>';
      } else if (isIndeterminate){
        icon = '<span class="checkbox-demo-icon">' + DASH_ICON_SVG + '</span>';
      }
      var fieldHtml = '<label class="checkbox-demo-field checkbox-demo-field--' + typeKey + stateCls + '">' +
        '<input type="checkbox" class="checkbox-demo-input"' + indeterminateAttr + checkedAttr + disabledAttr + ' />' +
        '<span class="' + boxCls + '" style="border-radius:' + radiusCss + '">' + icon + '</span>' +
        '<span class="checkbox-demo-label">' + escapeHtml(label) + '</span>' +
        '</label>';
      if (typeKey === "card"){
        var cardCls = "checkbox-demo-card" + (isChecked ? " is-checked" : "");
        return '<div class="' + cardCls + '">' + fieldHtml + '</div>';
      }
      return fieldHtml;
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

    function buildMatrixSection(size, radius, label){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildCheckboxCell(t.key, state.key, state.cls, size, radius, label) + "</td>";
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
        radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius])
      };
    }

    function render(){
      var label = (labelInput.value || "").trim() || DEFAULT_LABEL;

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, label);
          combos.push({ size: size, radius: radius, label: comboLabel(size, radius) });
        });
      });
      matrixContainer.innerHTML = html;

      // `indeterminate` is a DOM property, not an HTML attribute - it must
      // be set via JS after the matrix markup is inserted, on every cell
      // rendered for the Indeterminate state row.
      var indeterminateInputs = matrixContainer.querySelectorAll('.checkbox-demo-input[data-indeterminate="true"]');
      indeterminateInputs.forEach(function(el){ el.indeterminate = true; });

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.radius); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.radius); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "checkbox-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "checkbox-radius-dropdown-label",
        onChange: render
      });
    }

    if (labelInput) labelInput.addEventListener("input", render);

    render();
  });
})();
