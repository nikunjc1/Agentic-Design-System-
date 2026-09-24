(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var ICON_CLEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';
  var ICON_CHEVRON_UP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
  var ICON_CHEVRON_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  var TYPES = [
    { key: "outlined", label: "Outlined" },
    { key: "filled", label: "Filled" },
    { key: "underlined", label: "Underlined" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "filled", cls: " is-filled", label: "Filled" },
    { key: "error", cls: " is-error", label: "Error" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  // Purpose text per type, used by Copy Prompt - the actual colors come
  // from liveCssFor() below (live CSS custom property reads), never
  // hardcoded hex, so Copy Prompt/Copy Code stay correct in both dark and
  // light theme instead of silently assuming one of them.
  var FULL_SPEC = {
    outlined: { purpose: "The default number field style - a bordered box that works well on any background and reads clearly in dense forms." },
    filled: { purpose: "A softer-emphasis field with a solid background instead of a border, useful when a form sits on a bordered card and an outline would compete visually." },
    underlined: { purpose: "A minimal field with only a bottom border, useful for compact inline forms where a full box would feel heavy." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  function liveCssFor(typeKey){
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textDim = getCssVar("--text-dim", "#64686F");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var graphite900 = getCssVar("--graphite-900", "#15171A");
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");

    if (typeKey === "outlined"){
      return {
        rest: "background:" + graphite900 + ";border:1.5px solid " + lineStrong + ";",
        hover: "border-color:" + textDim + ";",
        focus: "border-color:" + red500 + ";outline:2px solid " + red400 + ";outline-offset:2px;",
        error: "border-color:" + danger500 + ";"
      };
    }
    if (typeKey === "filled"){
      return {
        rest: "background:" + graphite800 + ";border:1.5px solid transparent;",
        hover: "background:" + graphite700 + ";",
        focus: "background:" + graphite900 + ";border-color:" + red500 + ";outline:2px solid " + red400 + ";outline-offset:2px;",
        error: "border-color:" + danger500 + ";"
      };
    }
    return {
      rest: "border-bottom:1.5px solid " + lineStrong + ";",
      hover: "border-bottom-color:" + textDim + ";",
      focus: "border-bottom-color:" + red500 + ";outline:2px solid " + red400 + ";outline-offset:2px;",
      error: "border-bottom-color:" + danger500 + ";"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .number-demo-control--h* rules in shell.css (not re-derived by
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

  // Size / Corner radius option lists - same value scale as the Button
  // system, shared between the page's own multi-select dropdowns and the
  // Copy Prompt/Copy Code generators below.
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

  // Same "ask the question vs. state the explicit choice" rule as the
  // Button system: untouched-default, fully-deselected, and "All" checked
  // all count as no real decision (mode "all"); a genuine subset is a
  // decision (mode "specific").
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
    lines.push("Create a complete Number Field component system for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - not as separate one-off fields for each variant.");
    lines.push("");
    lines.push("The field is a single-line input restricted to numeric characters, with an optional trailing vertical stepper - two stacked buttons that increment or decrement the value by 1.");
    lines.push("");
    lines.push("Types (3):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Hover: " + css.hover);
      lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
      lines.push("  Error: " + css.error + " Paired with an inline error message below the field in " + getCssVar("--danger-500", "#FF031A") + ".");
    });
    lines.push("");
    lines.push("States (6, apply to every type): Rest, Hover, Focused, Filled, Error, Disabled.");
    lines.push("- Filled: same appearance as Rest, showing an entered value instead of the placeholder.");
    lines.push("- Disabled: 50% opacity, not-allowed cursor, no hover/focus feedback.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to Outlined and Filled - Underlined stays square, matching its minimal style.");
    lines.push("");
    lines.push("Component properties: Label (editable text above the field), Placeholder (editable text shown when empty), Show stepper (boolean - shows or hides trailing increment/decrement buttons that adjust the value by 1), Allow clear (boolean - once the field has a value, shows an × button before the stepper that clears it).");
    return lines.join("\n");
  }

  function exampleMarkupFor(typeKey, sizeClass, radiusClassAttr, label, placeholder){
    var radiusClass = typeKey === "underlined" ? "" : " " + radiusClassAttr;
    var lines = [];
    lines.push('<div class="number-field">');
    lines.push('  <label class="number-field-label">' + escapeHtml(label) + "</label>");
    lines.push('  <div class="number-control number-control--' + typeKey + " " + sizeClass + radiusClass + '">');
    lines.push('    <input type="number" placeholder="' + escapeHtml(placeholder) + '" />');
    lines.push("  </div>");
    lines.push("</div>");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Number Field component (all types, states, sizes) */");
    lines.push(".number-field{ display:flex; flex-direction:column; gap:6px; }");
    lines.push('.number-field-label{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:13px; font-weight:500; }');
    lines.push(".number-control{ box-sizing:border-box; display:flex; align-items:center; gap:8px; border-radius:8px; transition:background-color .15s ease, border-color .15s ease; }");
    lines.push('.number-control input{ flex:1 1 auto; min-width:0; border:none; background:transparent; outline:none; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; padding:0; }');
    lines.push('.number-note{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:12px; }');
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".number-control--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 8px - applies to Outlined/Filled only, Underlined stays square */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applies to Outlined/Filled only, Underlined stays square */");
    radiiToEmit.forEach(function(radius){
      lines.push(".number-control--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (3) - rest / hover / focus / error per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".number-control--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":focus-within{ " + css.focus + " }");
      lines.push(cls + ".is-error{ " + css.error + " }");
    });
    lines.push("");
    lines.push("/* Disabled - shared by every type */");
    lines.push(".number-control:has(input:disabled){ opacity:0.5; }");
    lines.push(".number-control input:disabled{ cursor:not-allowed; }");
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var sizeClass = "number-control--h" + exampleSize;
    var radiusClassAttr = "number-control--radius-" + radiusClassSuffix(exampleRadius);
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(exampleMarkupFor(t.key, sizeClass, radiusClassAttr, "Quantity", "0"));
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

    // The stepper actually steps - delegated on the document (capture
    // phase, stopped there) for the same reason as Password's reveal
    // toggle: the Live Preview matrix's innerHTML is rebuilt on every
    // property change, and the listing card's own click-to-navigate
    // listener sits closer to the target so it would otherwise fire first.
    document.addEventListener("click", function(e){
      var step = e.target.closest && e.target.closest(".number-demo-step");
      if (!step) return;
      e.stopPropagation();
      var control = step.closest(".number-demo-control");
      var input = control && control.querySelector(".number-demo-input");
      if (!input || input.disabled) return;
      var direction = step.classList.contains("number-demo-step-up") ? 1 : -1;
      var current = parseFloat(input.value);
      if (isNaN(current)) current = 0;
      input.value = current + direction;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, true);

    // Gallery-card copy CTA + click-to-navigate (number.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-number"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-number"]');
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
    var numberTypeCards = document.querySelectorAll(".number-type-card[data-system]");
    numberTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "number-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="number-matrix-container"]');
    if (!matrixContainer) return;

    var defaultLabel = document.body.dataset.defaultLabel || "Quantity";
    var defaultPlaceholder = document.body.dataset.defaultPlaceholder || "0";
    var labelInput = document.querySelector('[data-role="number-label"]');
    var placeholderInput = document.querySelector('[data-role="number-placeholder"]');
    var showStepperInput = document.querySelector('[data-role="number-show-stepper"]');
    var allowClearInput = document.querySelector('[data-role="number-allow-clear"]');
    var sizeMount = document.querySelector('[data-role="number-size-mount"]');
    var radiusMount = document.querySelector('[data-role="number-radius-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildNumberField(typeKey, stateKey, stateCls, size, radius, label, placeholder, showStepper, allowClear){
      var isDisabled = stateKey === "disabled";
      var isFilled = stateKey === "filled";
      var isError = stateKey === "error";
      var hasValue = isFilled || isError;
      var controlClasses = "number-demo-control number-demo-control--" + typeKey + " number-demo-control--h" + size + stateCls;
      var stepperHtml = showStepper
        ? '<div class="number-demo-stepper"><button type="button" class="number-demo-step number-demo-step-up" aria-label="Increase value">' + ICON_CHEVRON_UP + '</button><button type="button" class="number-demo-step number-demo-step-down" aria-label="Decrease value">' + ICON_CHEVRON_DOWN + "</button></div>"
        : "";
      var clearHtml = (allowClear && hasValue && !isDisabled)
        ? '<button type="button" class="number-demo-clear" aria-label="Clear">' + ICON_CLEAR + "</button>"
        : "";
      var valueAttr = isFilled ? ' value="3"' : (isError ? ' value="-5"' : "");
      var disabledAttr = isDisabled ? " disabled" : "";
      var inputHtml = '<input type="number" class="number-demo-input" placeholder="' + escapeHtml(placeholder) + '"' + valueAttr + disabledAttr + " />";
      var radiusStyle = typeKey === "underlined" ? "" : ' style="border-radius:' + radiusCssFor(radius) + '"';
      var noteHtml = isError ? '<p class="number-demo-note is-error">Enter a number of 0 or more.</p>' : "";
      return '<div class="number-demo-field">' +
        '<label class="number-demo-label">' + escapeHtml(label) + "</label>" +
        '<div class="' + controlClasses + '"' + radiusStyle + ">" + inputHtml + clearHtml + stepperHtml + "</div>" +
        noteHtml +
        "</div>";
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

    function buildMatrixSection(size, radius, label, placeholder, showStepper, allowClear){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildNumberField(t.key, state.key, state.cls, size, radius, label, placeholder, showStepper, allowClear) + "</td>";
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
      var label = labelInput.value.trim() || defaultLabel;
      var placeholder = placeholderInput.value.trim() || defaultPlaceholder;
      var showStepper = showStepperInput ? showStepperInput.checked : false;
      var allowClear = allowClearInput ? allowClearInput.checked : false;

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, label, placeholder, showStepper, allowClear);
          combos.push({ size: size, radius: radius, label: comboLabel(size, radius) });
        });
      });
      matrixContainer.innerHTML = html;

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
        labelledBy: "number-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "number-radius-dropdown-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", render);
    placeholderInput.addEventListener("input", render);
    if (showStepperInput) showStepperInput.addEventListener("change", render);
    if (allowClearInput) allowClearInput.addEventListener("change", render);

    render();
  });
})();
