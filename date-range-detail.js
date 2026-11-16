(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var ICON_CALENDAR ='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
  var ICON_CLEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';

  var TYPES = [
    { key: "outlined", label: "Outlined" },
    { key: "filled", label: "Filled" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "partial", cls: " is-partial", label: "Partially Filled" },
    { key: "filled", cls: " is-filled", label: "Filled" },
    { key: "open", cls: " is-focus", label: "Open" },
    { key: "error", cls: " is-error", label: "Error" },
    { key: "readonly", cls: " is-readonly", label: "Read-Only" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  // Purpose text per type, used by Copy Prompt - the actual colors come
  // from liveCssFor() below (live CSS custom property reads), never
  // hardcoded hex, so Copy Prompt/Copy Code stay correct in both dark and
  // light theme instead of silently assuming one of them.
  var FULL_SPEC = {
    outlined: { purpose: "The default date range field style - a bordered box that works well on any background and reads clearly in dense forms." },
    filled: { purpose: "A softer-emphasis field with a solid background instead of a border, useful when a form sits on a bordered card and an outline would compete visually." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // Same color logic as Date Picker's Outlined/Filled types - Date Range is
  // a picker whose trigger reads like a text field, so the field chrome is
  // identical, only the fixed trailing icon and the "filled" content (a
  // start/end date pair instead of a single date) differ.
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
  // real .daterange-demo-control--h* rules in shell.css (not re-derived
  // by formula) so Copy Code reproduces exactly what the Live Preview
  // matrix is showing, at every size, not just the one size a formula
  // happens to agree with. Same scale as Date Picker/Input/Select.
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

  // Size / Corner radius option lists - same value scale as Date
  // Picker/Input/Select, shared between the page's own multi-select
  // dropdowns and the Copy Prompt/Copy Code generators below.
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

  // Same "ask the question vs. state the explicit choice" rule as Date
  // Picker/Input/Select: untouched-default, fully-deselected, and "All"
  // checked all count as no real decision (mode "all"); a genuine subset
  // is a decision (mode "specific").
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
    lines.push("Create a complete Date Range component system for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - not as separate one-off fields for each variant. It is visually a single field showing a start date and an end date separated by an arrow, with a fixed trailing calendar icon (not a leading icon, to match Select's chevron placement convention) and no visible text cursor, since its value is set via a calendar panel rather than typed character-by-character. It picks a start/end pair together instead of two separate date fields. Scope is the trigger field itself, in all its states - not an interactive calendar popup grid.");
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
    lines.push("States (9, apply to every type): Rest, Hover, Focused, Partially Filled, Filled, Open, Error, Read-Only, Disabled.");
    lines.push("- Partially Filled: the start date has been chosen but the end date hasn't yet - the start segment shows its value, the end segment still shows its placeholder, visually distinct from a completed range.");
    lines.push("- Filled: same appearance as Rest, showing the selected start and end date values (e.g. Jan 4, 2026 -> Jan 9, 2026) instead of the two placeholders.");
    lines.push("- Open: the calendar is visible - same border/outline treatment as Focused. Scope is the trigger field itself; the calendar grid is a separate, larger feature not built here.");
    lines.push("- Error: shows an invalid/incomplete pairing (e.g. an end date before the start date) and pairs with an inline error message below the field.");
    lines.push("- Read-Only: shows its selected range but can't be changed; still focusable, unlike Disabled - clicking it never opens the calendar.");
    lines.push("- Disabled: 50% opacity, not-allowed cursor, no hover/focus feedback.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to both Outlined and Filled.");
    lines.push("");
    var opts = selectionInfo.opts || {};
    lines.push("Component properties: Label (editable text above the field, with an optional required indicator), Start placeholder (editable text shown for the start date when no range is chosen), End placeholder (editable text shown for the end date when no range is chosen), Supporting text (optional helper text below the field, replaced by the Error message whenever State is Error).");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function exampleMarkupFor(typeKey, sizeClass, radiusClassAttr, label, startPlaceholder, endPlaceholder, opts){
    opts = opts || {};
    var requiredHtml = opts.required ? '<span class="daterange-required" aria-hidden="true"> *</span>' : "";
    var lines = [];
    lines.push('<div class="daterange-field">');
    lines.push('  <label class="daterange-field-label">' + escapeHtml(label) + requiredHtml + "</label>");
    lines.push('  <div class="daterange-control daterange-control--' + typeKey + " " + sizeClass + " " + radiusClassAttr + '" role="button" tabindex="0">');
    lines.push('    <span class="daterange-control-value">');
    lines.push('      <span class="daterange-control-segment">' + escapeHtml(startPlaceholder) + "</span>");
    lines.push('      <span class="daterange-control-arrow">To</span>');
    lines.push('      <span class="daterange-control-segment">' + escapeHtml(endPlaceholder) + "</span>");
    lines.push("    </span>");
    lines.push('    <span class="daterange-control-icon" aria-hidden="true">' + ICON_CALENDAR + "</span>");
    lines.push("  </div>");
    if (opts.supportingText) lines.push('  <p class="daterange-note">' + escapeHtml(opts.supportingText) + "</p>");
    lines.push("</div>");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Date Range component (all types, states, sizes) */");
    lines.push("/* Trigger field only - the calendar popup panel is a separate concern. */");
    lines.push(".daterange-field{ display:flex; flex-direction:column; gap:var(--space-6); }");
    lines.push('.daterange-field-label{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-active-weight); }');
    lines.push(".daterange-control{ box-sizing:border-box; display:flex; align-items:center; gap:var(--space-8); border-radius:var(--radius-md); cursor:pointer; transition:background-color .15s ease, border-color .15s ease; }");
    lines.push('.daterange-control-value{ flex:1 1 auto; min-width:0; display:flex; align-items:center; gap:var(--space-6); font-family:var(--font-body); }');
    lines.push(".daterange-control-arrow{ flex:none; }");
    lines.push(".daterange-control-icon{ margin-inline-start:auto; flex:none; width:var(--dimension-16); height:var(--dimension-16); }");
    lines.push('.daterange-note{ font-family:var(--font-body); font-size:var(--type-caption-size); }');
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".daterange-control--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (8 options) - not chosen yet, default is 8px - applies to both Outlined and Filled */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applies to both Outlined and Filled */");
    radiiToEmit.forEach(function(radius){
      lines.push(".daterange-control--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (2) - rest / hover / focus / error per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".daterange-control--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":focus-visible{ " + css.focus + " }");
      lines.push(cls + ".is-open{ " + css.focus + " } /* calendar visible - same border/outline treatment as Focused */");
      lines.push(cls + ".is-error{ " + css.error + " }");
    });
    lines.push("");
    lines.push("/* Read-Only - keeps its selected range, but can't be clicked open; still focusable, unlike Disabled */");
    lines.push(".daterange-control.is-readonly{ cursor:default; }");
    lines.push("");
    lines.push("/* Disabled - shared by every type */");
    lines.push(".daterange-control[aria-disabled=\"true\"]{ opacity:0.5; cursor:not-allowed; pointer-events:none; }");
    lines.push("");
    lines.push("/* Required indicator + supporting/error text */");
    lines.push(".daterange-required{ color:" + getCssVar("--danger-500", "#FF031A") + "; }");
    lines.push(".daterange-note.is-error{ color:" + getCssVar("--danger-700", "#EB0318") + "; }");
    lines.push("");
    var opts = selectionInfo.opts || {};
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var sizeClass = "daterange-control--h" + exampleSize;
    var radiusClassAttr = "daterange-control--radius-" + radiusClassSuffix(exampleRadius);
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(exampleMarkupFor(t.key, sizeClass, radiusClassAttr, "Trip dates", "Start date", "End date", opts));
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

    // Gallery-card copy CTA + click-to-navigate (date-range.html's
    // listing card) - separate data-role from every other system's own
    // copy roles so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-daterange"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-daterange"]');
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
    var dateRangeTypeCards = document.querySelectorAll(".daterange-type-card[data-system]");
    dateRangeTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "date-range-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="daterange-matrix-container"]');
    if (!matrixContainer) return;

    var defaultLabel = document.body.dataset.defaultLabel || "Trip dates";
    var defaultStartPlaceholder = document.body.dataset.defaultStartPlaceholder || "Start date";
    var defaultEndPlaceholder = document.body.dataset.defaultEndPlaceholder || "End date";
    var labelInput = document.querySelector('[data-role="daterange-label"]');
    var startPlaceholderInput = document.querySelector('[data-role="daterange-start-placeholder"]');
    var endPlaceholderInput = document.querySelector('[data-role="daterange-end-placeholder"]');
    var allowClearInput = document.querySelector('[data-role="daterange-allow-clear"]');
    var requiredInput = document.querySelector('[data-role="daterange-required"]');
    var showSupportingInput = document.querySelector('[data-role="daterange-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="daterange-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="daterange-supporting-text-field"]');
    var errorTextInput = document.querySelector('[data-role="daterange-error-text"]');
    var sizeMount = document.querySelector('[data-role="daterange-size-mount"]');
    var radiusMount = document.querySelector('[data-role="daterange-radius-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    var FILLED_START = "Jan 4, 2026";
    var FILLED_END = "Jan 9, 2026";
    var ERROR_START = "Jan 9, 2026";
    var ERROR_END = "Jan 4, 2026";

    function buildDateRangeField(typeKey, stateKey, stateCls, size, radius, label, startPlaceholder, endPlaceholder, allowClear, opts){
      opts = opts || {};
      var isDisabled = stateKey === "disabled";
      var isFilled = stateKey === "filled";
      var isPartial = stateKey === "partial";
      var isReadonly = stateKey === "readonly";
      var isError = stateKey === "error";
      var hasValue = isFilled || isError || isReadonly;
      var controlClasses = "daterange-demo-control daterange-demo-control--" + typeKey + " daterange-demo-control--h" + size + stateCls + (isReadonly ? " is-readonly" : "");
      // role="button" kept for a real implementation to model its own
      // interactive control after - tabindex is always -1 here since this
      // matrix is a static state comparison, not an operable field.
      var interactiveAttrs = isDisabled ? ' aria-disabled="true" tabindex="-1"' : ' role="button" tabindex="-1"';
      var radiusStyle = ' style="border-radius:' + radiusCssFor(radius) + '"';
      var startFilled = hasValue || isPartial;
      var startSegmentClass = startFilled ? "daterange-demo-segment" : "daterange-demo-segment is-placeholder";
      var endSegmentClass = hasValue ? "daterange-demo-segment" : "daterange-demo-segment is-placeholder";
      var startText = escapeHtml(hasValue ? (isError ? ERROR_START : FILLED_START) : (isPartial ? FILLED_START : startPlaceholder));
      var endText = escapeHtml(hasValue ? (isError ? ERROR_END : FILLED_END) : endPlaceholder);
      var requiredHtml = opts.required ? '<span class="daterange-demo-required" data-contract-part="required" aria-hidden="true"> *</span>' : "";
      var noteHtml = "";
      if (isError){
        noteHtml = '<p class="daterange-demo-note is-error" data-contract-part="error">' + escapeHtml(opts.errorText || "End date must be after the start date.") + "</p>";
      } else if (opts.supportingText){
        noteHtml = '<p class="daterange-demo-note" data-contract-part="supporting">' + escapeHtml(opts.supportingText) + "</p>";
      }
      // data-contract-part markers, same reasoning as Date Picker's trailing
      // icon/clear slot: the start/end segments and icon/clear both swap
      // structurally by state, so a stable id keeps the Figma capture from
      // mismatching one for the other across rows.
      var trailingHtml = (allowClear && hasValue && !isDisabled && !isReadonly)
        ? '<button type="button" class="daterange-demo-clear" data-contract-part="clear" aria-label="Clear" tabindex="-1">' + ICON_CLEAR + "</button>"
        : '<span class="daterange-demo-icon" data-contract-part="icon" aria-hidden="true">' + ICON_CALENDAR + "</span>";
      return '<div class="daterange-demo-field">' +
        '<label class="daterange-demo-label" data-contract-part="label">' + escapeHtml(label) + requiredHtml + "</label>" +
        '<div class="' + controlClasses + '"' + interactiveAttrs + radiusStyle + ">" +
          '<span class="daterange-demo-value" data-contract-part="value">' +
            '<span class="' + startSegmentClass + '" data-contract-part="start">' + startText + "</span>" +
            '<span class="daterange-demo-arrow" data-contract-part="arrow">To</span>' +
            '<span class="' + endSegmentClass + '" data-contract-part="end">' + endText + "</span>" +
          "</span>" +
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

    function buildMatrixSection(size, radius, label, startPlaceholder, endPlaceholder, allowClear, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildDateRangeField(t.key, state.key, state.cls, size, radius, label, startPlaceholder, endPlaceholder, allowClear, opts) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size, radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentOpts(){
      return {
        required: requiredInput ? requiredInput.checked : false,
        supportingText: (showSupportingInput && showSupportingInput.checked && supportingTextInput) ? supportingTextInput.value.trim() : "",
        errorText: (errorTextInput && errorTextInput.value.trim()) || "End date must be after the start date."
      };
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
      var startPlaceholder = startPlaceholderInput.value.trim() || defaultStartPlaceholder;
      var endPlaceholder = endPlaceholderInput.value.trim() || defaultEndPlaceholder;
      var allowClear = allowClearInput ? allowClearInput.checked : false;
      var opts = currentOpts();

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, label, startPlaceholder, endPlaceholder, allowClear, opts);
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
        labelledBy: "daterange-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "daterange-radius-dropdown-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    startPlaceholderInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    endPlaceholderInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (allowClearInput) allowClearInput.addEventListener("change", render);
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
