(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var ICON_CALENDAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V20C21 20.55 20.8042 21.0208 20.4125 21.4125C20.0208 21.8042 19.55 22 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8Z"/></svg>';
  var ICON_CLEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';

  var TYPES = [
    { key: "outlined", label: "Outlined" },
    { key: "filled", label: "Filled" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "filled", cls: " is-filled", label: "Filled" },
    // Open models the trigger's own active-state styling only - this system
    // scopes to the trigger field itself (see buildFullPrompt), not an
    // interactive calendar popup grid, so no panel renders for this row.
    { key: "open", cls: " is-open", label: "Open" },
    { key: "error", cls: " is-error", label: "Error" },
    { key: "readonly", cls: " is-readonly", label: "Read-Only" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" },
    { key: "loading", cls: " is-loading", label: "Loading" }
  ];

  // Purpose text per type, used by Copy Prompt - the actual colors come
  // from liveCssFor() below (live CSS custom property reads), never
  // hardcoded hex, so Copy Prompt/Copy Code stay correct in both dark and
  // light theme instead of silently assuming one of them.
  var FULL_SPEC = {
    outlined: { purpose: "The default date field style - a bordered box that works well on any background and reads clearly in dense forms." },
    filled: { purpose: "A softer-emphasis field with a solid background instead of a border, useful when a form sits on a bordered card and an outline would compete visually." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // Same color logic as Input's/Select's Outlined/Filled types - Date
  // Picker is a picker whose trigger reads like a text field, so the field
  // chrome is identical, only the fixed trailing icon and the "filled"
  // content (a formatted date instead of free text) differ.
  function liveCssFor(typeKey){
    if (typeKey === "primary") return {
      rest: "background:var(--button-primary-bg-default);color:var(--button-primary-text-default);",
      hover: "background:var(--button-primary-bg-hover);color:var(--button-primary-text-hover);",
      pressed: "background:var(--button-primary-bg-active);color:var(--button-primary-text-active);"
    };
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textDim = getCssVar("--text-dim", "#69707D");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF4253");
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var graphite900 = getCssVar("--graphite-900", "#FFFFFF");
    var graphite800 = getCssVar("--graphite-800", "#F1F1EE");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");

    if (typeKey === "outlined"){
      return {
        rest: "background:" + graphite900 + ";border:var(--border-width-1) var(--border-style) " + lineStrong + ";",
        hover: "border-color:" + textDim + ";",
        focus: "border-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
        error: "border-color:" + danger500 + ";"
      };
    }
    return {
      rest: "background:" + graphite800 + ";border:var(--border-width-1) var(--border-style) transparent;",
      hover: "background:" + graphite700 + ";",
      focus: "background:" + graphite900 + ";border-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
      error: "border-color:" + danger500 + ";"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .datepicker-demo-control--h* rules in shell.css (not re-derived
  // by formula) so Copy Code reproduces exactly what the Live Preview
  // matrix is showing, at every size, not just the one size a formula
  // happens to agree with. Same scale as Input/Select.
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

  // Size / Corner radius option lists - same value scale as Input/Select,
  // shared between the page's own multi-select dropdowns and the Copy
  // Prompt/Copy Code generators below.
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
    { value: "2", label: "2px - Subtle" },
    { value: "4", label: "4px - Compact" },
    { value: "6", label: "6px - Compact foundation" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "16", label: "16px - Expressive" },
    { value: "24", label: "24px - Large" },
    { value: "9999", label: "Full - Pill" }
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
  var FALLBACK_DEFAULTS = { size: "40", radius: liveRadiusDefault("8") };

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function radiusClassSuffix(value){
    return value === "9999" ? "pill" : value;
  }

  function radiusCssFor(value){
    return window.ADSFoundationModel.radiusCss(Number(value), window.ADSFoundation.get().unit);
  }

  // Same "ask the question vs. state the explicit choice" rule as
  // Input/Select: untouched-default, fully-deselected, and "All" checked
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
    lines.push("Create a complete Date Picker component system for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - not as separate one-off fields for each variant. It is visually a text field with a fixed trailing calendar icon (not a leading icon, to match Select's chevron placement convention) and no visible text cursor, since its value is set via a calendar panel rather than typed character-by-character. Scope is the trigger field itself, in all its states - not an interactive calendar popup grid.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Hover: " + css.hover);
      lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
      lines.push("  Error: " + css.error + " Paired with an inline error message below the field in " + getCssVar("--danger-500", "#FF031A") + ".");
    });
    lines.push("");
    lines.push("States (9, apply to every type): Rest, Hover, Focused, Filled, Open, Error, Read-Only, Disabled, Loading.");
    lines.push("- Filled: same appearance as Rest, showing the selected date value (e.g. 03/14/2026) instead of the placeholder.");
    lines.push("- Open: the trigger's own active-state styling (same border/outline treatment as Focused) while its calendar is showing - this system scopes to the trigger field itself, not the calendar popup grid.");
    lines.push("- Error: pairs with a customizable inline error message below the field.");
    lines.push("- Read-Only: shows its current value but can't be edited; still focusable, unlike Disabled.");
    lines.push("- Disabled: 50% opacity, not-allowed cursor, no hover/focus feedback.");
    lines.push("- Loading: trailing calendar icon replaced by a spinner, not interactive - e.g. while asynchronous date constraints (disabled dates) are being fetched.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to both Outlined and Filled.");
    lines.push("");
    var opts = selectionInfo.opts || {};
    lines.push("Component properties: Label (editable text above the field, with an optional required indicator), Placeholder (editable text shown when no date is chosen, typically the expected date format), Date format (one of MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, DD MMM YYYY, MMM DD, YYYY - currently " + (opts.format || "MM/DD/YYYY") + " - the display format is independent from the stored date value), Supporting text (optional helper text below the field, replaced by the Error message whenever State is Error).");
    if (opts.supportingText) lines.push("Current supporting text: \"" + opts.supportingText + "\".");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function exampleMarkupFor(typeKey, sizeClass, radiusClassAttr, label, placeholder, opts){
    opts = opts || {};
    var requiredHtml = opts.required ? '<span class="datepicker-demo-required" aria-hidden="true"> *</span>' : "";
    var lines = [];
    lines.push('<div class="datepicker-field">');
    lines.push('  <label class="datepicker-field-label">' + escapeHtml(label) + requiredHtml + "</label>");
    lines.push('  <div class="datepicker-control datepicker-control--' + typeKey + " " + sizeClass + " " + radiusClassAttr + '" role="button" tabindex="0">');
    lines.push('    <span class="datepicker-control-value">' + escapeHtml(placeholder) + "</span>");
    lines.push('    <span class="datepicker-control-icon" aria-hidden="true">' + ICON_CALENDAR + "</span>");
    lines.push("  </div>");
    if (opts.supportingText) lines.push('  <p class="datepicker-note">' + escapeHtml(opts.supportingText) + "</p>");
    lines.push("</div>");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Date Picker component (all types, states, sizes) */");
    lines.push("/* Trigger field only - the calendar popup panel is a separate concern. */");
    lines.push(".datepicker-field{ display:flex; flex-direction:column; gap:var(--space-6); }");
    lines.push('.datepicker-field-label{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-active-weight); }');
    lines.push(".datepicker-control{ box-sizing:border-box; display:flex; align-items:center; gap:var(--space-8); border-radius:var(--radius-md); cursor:pointer; transition:background-color .15s ease, border-color .15s ease; }");
    lines.push('.datepicker-control-value{ flex:1 1 auto; min-width:0; font-family:var(--font-body); }');
    lines.push(".datepicker-control-icon{ margin-inline-start:auto; flex:none; width:var(--dimension-16); height:var(--dimension-16); }");
    lines.push('.datepicker-note{ font-family:var(--font-body); font-size:var(--type-caption-size); }');
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".datepicker-control--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (8 options) - not chosen yet, default is 8px - applies to both Outlined and Filled */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applies to both Outlined and Filled */");
    radiiToEmit.forEach(function(radius){
      lines.push(".datepicker-control--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (2) - rest / hover / focus / error per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".datepicker-control--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":focus-visible{ " + css.focus + " }");
      lines.push(cls + ".is-error{ " + css.error + " }");
    });
    lines.push("");
    lines.push("/* Open - same border/outline treatment as Focused (trigger-only scope, no calendar grid modeled here) */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push(".datepicker-control--" + t.key + ".is-open{ " + css.focus + " }");
    });
    lines.push("");
    lines.push("/* Read-Only - cursor signals it isn't editable; still focusable, unlike Disabled */");
    lines.push(".datepicker-control.is-readonly{ cursor:default; }");
    lines.push("");
    lines.push("/* Disabled - shared by every type */");
    lines.push(".datepicker-control[aria-disabled=\"true\"]{ opacity:0.5; cursor:not-allowed; pointer-events:none; }");
    lines.push("");
    lines.push("/* Loading - trailing icon replaced by a spinner, not interactive */");
    lines.push(".datepicker-control.is-loading{ cursor:wait; }");
    lines.push(".datepicker-demo-required{ color:" + getCssVar("--danger-500", "#FF031A") + "; }");
    lines.push("");
    var opts = selectionInfo.opts || {};
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var sizeClass = "datepicker-control--h" + exampleSize;
    var radiusClassAttr = "datepicker-control--radius-" + radiusClassSuffix(exampleRadius);
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(exampleMarkupFor(t.key, sizeClass, radiusClassAttr, "Date of birth", opts.format || "MM/DD/YYYY", opts));
    });
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Builds the prompt/code for exactly ONE Size x Corner radius
  // combination, fully resolved (never "ask the question") - used by the
  // Copy prompt/Copy code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(size, radius, opts){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      opts: opts
    });
  }

  function buildComboCode(size, radius, opts){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      opts: opts
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
    }

    // Gallery-card copy CTA + click-to-navigate (date-picker.html's
    // listing card) - separate data-role from every other system's own
    // copy roles so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-datepicker"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-datepicker"]');
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
    var datePickerTypeCards = document.querySelectorAll(".datepicker-type-card[data-system]");
    datePickerTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "date-picker-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="datepicker-matrix-container"]');
    if (!matrixContainer) return;

    var defaultLabel = document.body.dataset.defaultLabel || "Date of birth";
    var defaultPlaceholder = document.body.dataset.defaultPlaceholder || "MM/DD/YYYY";
    var labelInput = document.querySelector('[data-role="datepicker-label"]');
    var placeholderInput = document.querySelector('[data-role="datepicker-placeholder"]');
    var allowClearInput = document.querySelector('[data-role="datepicker-allow-clear"]');
    var sizeMount = document.querySelector('[data-role="datepicker-size-mount"]');
    var radiusMount = document.querySelector('[data-role="datepicker-radius-mount"]');
    var formatSelect = document.querySelector('[data-role="datepicker-format"]');
    var requiredInput = document.querySelector('[data-role="datepicker-required"]');
    var showSupportingInput = document.querySelector('[data-role="datepicker-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="datepicker-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="datepicker-supporting-text-field"]');
    var errorTextInput = document.querySelector('[data-role="datepicker-error-text"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    // Fixed sample date (March 14, 2026) reformatted per the chosen Date
    // format - the display format is independent from the stored value
    // (spec item 10), so only this rendering changes, never the underlying date.
    var SAMPLE_MONTH_NAME = "Mar";
    function formatSampleDate(format){
      switch (format){
        case "DD/MM/YYYY": return "14/03/2026";
        case "YYYY-MM-DD": return "2026-03-14";
        case "DD MMM YYYY": return "14 " + SAMPLE_MONTH_NAME + " 2026";
        case "MMM DD, YYYY": return SAMPLE_MONTH_NAME + " 14, 2026";
        default: return "03/14/2026";
      }
    }

    function currentOpts(){
      return {
        format: formatSelect ? formatSelect.value : "MM/DD/YYYY",
        required: !!(requiredInput && requiredInput.checked),
        supportingText: (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "We use this to confirm your age.") : "",
        errorText: errorTextInput ? (errorTextInput.value.trim() || "Enter a valid date.") : "Enter a valid date."
      };
    }

    function buildDatePickerField(typeKey, stateKey, stateCls, size, radius, label, placeholder, allowClear, opts){
      opts = opts || {};
      var isDisabled = stateKey === "disabled";
      var isReadOnly = stateKey === "readonly";
      var isFilled = stateKey === "filled";
      var isOpen = stateKey === "open";
      var isError = stateKey === "error";
      var isLoading = stateKey === "loading";
      var hasValue = isFilled || isOpen || isReadOnly;
      var controlClasses = "datepicker-demo-control datepicker-demo-control--" + typeKey + " datepicker-demo-control--h" + size + stateCls;
      var text = hasValue ? formatSampleDate(opts.format) : placeholder;
      var valueClasses = "datepicker-demo-value" + (hasValue ? " is-filled" : "");
      // role="button" kept for a real implementation to model its own
      // interactive control after - tabindex is always -1 here since this
      // matrix is a static state comparison, not an operable field.
      var interactiveAttrs = isDisabled ? ' aria-disabled="true" tabindex="-1"' : ' role="button" tabindex="-1"';
      if (isLoading) interactiveAttrs += ' aria-busy="true"';
      var radiusStyle = ' style="border-radius:' + radiusCssFor(radius) + '"';
      var requiredHtml = opts.required ? '<span class="datepicker-demo-required" data-contract-part="required" aria-hidden="true"> *</span>' : "";
      var noteHtml = isError
        ? '<p class="datepicker-demo-note is-error" data-contract-part="error">' + escapeHtml(opts.errorText || "Enter a valid date.") + "</p>"
        : (opts.supportingText ? '<p class="datepicker-demo-note" data-contract-part="supporting">' + escapeHtml(opts.supportingText) + "</p>" : "");
      // allowClear takes over the calendar icon's slot once there's a real
      // value - the icon comes back once cleared, matching Select's own
      // chevron-vs-clear-button rule.
      // data-contract-part markers: the trailing slot is whichever of
      // icon/clear/spinner is relevant to this state, so a plain tag/
      // position match can't tell them apart across rows (the same
      // ambiguity Checkbox's icon and Float Button's tooltip bubble/arrow
      // already hit this session) - give each its own stable id instead of
      // leaving all three to collide on the same positional slot.
      var trailingHtml;
      if (isLoading){
        trailingHtml = '<span class="select-demo-spinner" data-contract-kind="container" data-contract-part="spinner" aria-hidden="true"></span>';
      } else if (allowClear && hasValue && !isDisabled && !isReadOnly){
        trailingHtml = '<button type="button" class="datepicker-demo-clear" data-contract-part="clear" aria-label="Clear" tabindex="-1">' + ICON_CLEAR + "</button>";
      } else {
        trailingHtml = '<span class="datepicker-demo-icon" data-contract-part="icon" aria-hidden="true">' + ICON_CALENDAR + "</span>";
      }
      return '<div class="datepicker-demo-field">' +
        '<label class="datepicker-demo-label" data-contract-part="label">' + escapeHtml(label) + requiredHtml + "</label>" +
        '<div class="' + controlClasses + '"' + interactiveAttrs + radiusStyle + ">" +
          '<span class="' + valueClasses + '"' + (hasValue ? ' data-own-format="true"' : '') + ' data-contract-part="value">' + escapeHtml(text) + "</span>" +
          trailingHtml +
        "</div>" +
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

    function buildMatrixSection(size, radius, label, placeholder, allowClear, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildDatePickerField(t.key, state.key, state.cls, size, radius, label, placeholder, allowClear, opts) + "</td>";
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
        opts: currentOpts()
      };
    }

    function render(){
      var label = labelInput.value.trim() || defaultLabel;
      var placeholder = placeholderInput.value.trim() || defaultPlaceholder;
      var allowClear = allowClearInput ? allowClearInput.checked : false;
      var opts = currentOpts();

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, label, placeholder, allowClear, opts);
          combos.push({ size: size, radius: radius, label: comboLabel(size, radius) });
        });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.radius, opts); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.radius, opts); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "datepicker-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "datepicker-radius-dropdown-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    placeholderInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (allowClearInput) allowClearInput.addEventListener("change", render);
    if (formatSelect) formatSelect.addEventListener("change", render);
    if (requiredInput) requiredInput.addEventListener("change", render);
    if (showSupportingInput && supportingTextFieldWrap){
      showSupportingInput.addEventListener("change", function(){
        supportingTextFieldWrap.hidden = !showSupportingInput.checked;
        render();
      });
    }
    if (supportingTextInput) supportingTextInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (errorTextInput) errorTextInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    render();
  });
})();
