(() => {
  "use strict";
  var inputFieldCounter = 0;

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  var ICON_CLEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';

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
    { key: "success", cls: " is-success", label: "Success" },
    { key: "error", cls: " is-error", label: "Error" },
    { key: "readonly", cls: " is-readonly", label: "Read-Only" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  // Purpose text per type, used by Copy Prompt - the actual colors come
  // from liveCssFor() below (live CSS custom property reads), never
  // hardcoded hex, so Copy Prompt/Copy Code stay correct in both dark and
  // light theme instead of silently assuming one of them.
  var FULL_SPEC = {
    outlined: { purpose: "The default text field style - a bordered box that works well on any background and reads clearly in dense forms." },
    filled: { purpose: "A softer-emphasis field with a solid background instead of a border, useful when a form sits on a bordered card and an outline would compete visually." },
    underlined: { purpose: "A minimal field with only a bottom border, useful for compact inline forms or search-like inputs where a full box would feel heavy." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function liveCssFor(typeKey){
    if (typeKey === "primary") return {
      rest: "background:var(--button-primary-bg-default);color:var(--button-primary-text-default);",
      hover: "background:var(--button-primary-bg-hover);color:var(--button-primary-text-hover);",
      pressed: "background:var(--button-primary-bg-active);color:var(--button-primary-text-active);"
    };
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textDim = getCssVar("--text-dim", "#64686F");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var graphite900 = getCssVar("--graphite-900", "#15171A");
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");

    var green500 = getCssVar("--green-500", "#2FBF6E");
    if (typeKey === "outlined"){
      return {
        rest: "background:" + graphite900 + ";border:1.5px solid " + lineStrong + ";",
        hover: "border-color:" + textDim + ";",
        focus: "border-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
        error: "border-color:" + danger500 + ";",
        success: "border-color:" + green500 + ";"
      };
    }
    if (typeKey === "filled"){
      return {
        rest: "background:" + graphite800 + ";border:1.5px solid transparent;",
        hover: "background:" + graphite700 + ";",
        focus: "background:" + graphite900 + ";border-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
        error: "border-color:" + danger500 + ";",
        success: "border-color:" + green500 + ";"
      };
    }
    return {
      rest: "border-bottom:1.5px solid " + lineStrong + ";",
      hover: "border-bottom-color:" + textDim + ";",
      focus: "border-bottom-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
      error: "border-bottom-color:" + danger500 + ";",
      success: "border-bottom-color:" + green500 + ";"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .input-demo-control--h* rules in shell.css (not re-derived by
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
    { value: "2", label: "2px - Subtle" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  var ICON_PLACEMENT_OPTIONS = [
    { value: "none", label: "None" },
    { value: "leading", label: "Leading icon" },
    { value: "trailing", label: "Trailing icon" },
    { value: "both", label: "Both" }
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
    return window.ADSFoundationModel.dimension(Number(value), window.ADSFoundation.get().unit);
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
    lines.push("Create a complete Input Text Field component system for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - not as separate one-off fields for each variant.");
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
    lines.push("States (8, apply to every type): Rest, Hover, Focused, Filled, Success, Error, Read-Only, Disabled.");
    lines.push("- Filled: same appearance as Rest, showing an entered value instead of the placeholder.");
    lines.push("- Success: border recolored to a positive/green tone, paired with a passed-validation indicator.");
    lines.push("- Read-Only: shows its current value but can't be edited (the readonly attribute, not disabled) - still focusable and selectable, still submits with the form.");
    lines.push("- Disabled: 50% opacity, not-allowed cursor, no hover/focus feedback.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to Outlined and Filled - Underlined stays square, matching its minimal style.");
    lines.push("");
    var opts = selectionInfo.opts || {};
    lines.push("Component properties: Label (editable text above the field, with an optional required indicator), Placeholder (editable text shown when empty), Icon placement (choice of None, Leading icon, Trailing icon, or Both - Leading shows an icon before the input text, Trailing shows one after it, e.g. validation or a password-reveal toggle), Allow clear (boolean, shows an × button in the trailing slot once the field has a value, clearing it on click - takes over the trailing slot from a trailing icon whenever both are on and there's a value, since Ant never shows both at once), Supporting text (optional helper text below the field, replaced by the Error message whenever State is Error).");
    lines.push("");
    lines.push("Input behavior: Input type (" + (opts.inputType || "text") + " - changes the native input type/keyboard/validation, e.g. email/password/tel/url/number), Maximum length (" + (opts.maxLength ? opts.maxLength + " characters" : "no limit") + "), Required (" + (opts.required ? "yes" : "no") + ").");
    lines.push("Validation: the Error state's message is customizable (currently \"" + (opts.errorText || "Enter a valid email address.") + "\"), displayed below the field and programmatically associated with it (aria-describedby).");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function exampleMarkupFor(typeKey, sizeClass, radiusClassAttr, label, placeholder, opts){
    opts = opts || {};
    var radiusClass = typeKey === "underlined" ? "" : " " + radiusClassAttr;
    var requiredHtml = opts.required ? '<span class="input-demo-required" aria-hidden="true"> *</span>' : "";
    var typeAttr = opts.inputType && opts.inputType !== "text" ? ' type="' + opts.inputType + '"' : ' type="text"';
    var maxLengthAttr = opts.maxLength ? ' maxlength="' + opts.maxLength + '"' : "";
    var requiredAttr = opts.required ? " required" : "";
    var lines = [];
    lines.push('<div class="input-field">');
    lines.push('  <label class="input-field-label">' + escapeHtml(label) + requiredHtml + "</label>");
    lines.push('  <div class="input-control input-control--' + typeKey + " " + sizeClass + radiusClass + '">');
    lines.push('    <input' + typeAttr + ' placeholder="' + escapeHtml(placeholder) + '"' + maxLengthAttr + requiredAttr + ' />');
    lines.push("  </div>");
    if (opts.supportingText) lines.push('  <p class="input-note">' + escapeHtml(opts.supportingText) + "</p>");
    lines.push("</div>");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Input Text Field component (all types, states, sizes) */");
    lines.push(".input-field{ display:flex; flex-direction:column; gap:var(--space-6); }");
    lines.push('.input-field-label{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:var(--type-body-size); font-weight:500; }');
    lines.push(".input-control{ box-sizing:border-box; display:flex; align-items:center; gap:var(--space-8); border-radius:8px; transition:background-color .15s ease, border-color .15s ease; }");
    lines.push('.input-control input{ flex:1 1 auto; min-width:0; border:none; background:transparent; outline:none; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; padding:0; }');
    lines.push('.input-note{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:var(--type-caption-size); }');
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".input-control--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 8px - applies to Outlined/Filled only, Underlined stays square */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applies to Outlined/Filled only, Underlined stays square */");
    radiiToEmit.forEach(function(radius){
      lines.push(".input-control--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (3) - rest / hover / focus / success / error per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".input-control--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":focus-within{ " + css.focus + " }");
      lines.push(cls + ".is-success{ " + css.success + " }");
      lines.push(cls + ".is-error{ " + css.error + " }");
    });
    lines.push("");
    lines.push("/* Read-Only - visually unchanged from Rest, cursor signals it isn't editable; still focusable/selectable, unlike Disabled */");
    lines.push(".input-control input:read-only{ cursor:default; }");
    lines.push("");
    lines.push("/* Disabled - shared by every type */");
    lines.push(".input-control:has(input:disabled){ opacity:0.5; }");
    lines.push(".input-control input:disabled{ cursor:not-allowed; }");
    lines.push("");
    var opts = selectionInfo.opts || {};
    if (opts.required) lines.push(".input-field-label .input-demo-required{ color:var(--danger-500); }\n");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var sizeClass = "input-control--h" + exampleSize;
    var radiusClassAttr = "input-control--radius-" + radiusClassSuffix(exampleRadius);
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(exampleMarkupFor(t.key, sizeClass, radiusClassAttr, "Email address", "you@example.com", opts));
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

    // Gallery-card copy CTA + click-to-navigate (input.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-input"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-input"]');
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
    var inputTypeCards = document.querySelectorAll(".input-type-card[data-system]");
    inputTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "input-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="input-matrix-container"]');
    if (!matrixContainer) return;

    var defaultLabel = document.body.dataset.defaultLabel || "Email address";
    var defaultPlaceholder = document.body.dataset.defaultPlaceholder || "you@example.com";
    var labelInput = document.querySelector('[data-role="input-label"]');
    var placeholderInput = document.querySelector('[data-role="input-placeholder"]');
    var iconPlacementMount = document.querySelector('[data-role="input-icon-placement-mount"]');
    var allowClearInput = document.querySelector('[data-role="input-allow-clear"]');
    var sizeMount = document.querySelector('[data-role="input-size-mount"]');
    var radiusMount = document.querySelector('[data-role="input-radius-mount"]');
    var inputTypeSelect = document.querySelector('[data-role="input-type-select"]');
    var maxLengthInput = document.querySelector('[data-role="input-max-length"]');
    var requiredInput = document.querySelector('[data-role="input-required"]');
    var showSupportingInput = document.querySelector('[data-role="input-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="input-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="input-supporting-text-field"]');
    var errorTextInput = document.querySelector('[data-role="input-error-text"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildInputField(typeKey, stateKey, stateCls, size, radius, label, placeholder, showLeadingIcon, showTrailingIcon, allowClear, opts){
      opts = opts || {};
      var isDisabled = stateKey === "disabled";
      var isReadOnly = stateKey === "readonly";
      var isFilled = stateKey === "filled";
      var isError = stateKey === "error";
      var isSuccess = stateKey === "success";
      var hasValue = isFilled || isError || isSuccess || isReadOnly;
      var controlClasses = "input-demo-control input-demo-control--" + typeKey + " input-demo-control--h" + size + stateCls;
      var leadingHtml = showLeadingIcon ? '<span class="input-demo-icon">' + ICON_MAIL + "</span>" : "";
      // allowClear takes over the trailing slot once there's a value to
      // clear - a static trailing icon and a clear button would otherwise
      // compete for the same spot, and Ant's own Input never shows both.
      var trailingHtml = (allowClear && hasValue && !isDisabled && !isReadOnly)
        ? '<button type="button" class="input-demo-clear" aria-label="Clear" tabindex="-1">' + ICON_CLEAR + "</button>"
        : (showTrailingIcon ? '<span class="input-demo-icon input-demo-icon--trailing">' + ICON_CHECK + "</span>" : "");
      var sampleValue = isError && (opts.inputType || "text") === "email" ? "not-an-email" : "jane@example.com";
      var valueAttr = hasValue ? ' value="' + escapeHtml(sampleValue) + '"' : "";
      var disabledAttr = isDisabled ? " disabled" : "";
      var readonlyAttr = isReadOnly ? " readonly" : "";
      var typeAttr = opts.inputType && opts.inputType !== "text" ? ' type="' + opts.inputType + '"' : ' type="text"';
      var maxLengthAttr = opts.maxLength ? ' maxlength="' + opts.maxLength + '"' : "";
      var requiredAttr = opts.required ? " required" : "";
      // tabindex="-1": every state/type combination here is a static side-
      // by-side comparison (same convention as Modal/Rating's own matrices),
      // not an operable field - a real tab stop would land on dozens of
      // inputs that exist only to show what Rest/Hover/Error look like.
      // The visible label still needs a real for/id association though -
      // without it, a screen reader's virtual cursor (which isn't limited
      // by tabindex) reaches an unlabeled blank field, same gap Rating's
      // own matrix was fixed for.
      var fieldId = "input-demo-field-" + (++inputFieldCounter);
      var inputHtml = '<input' + typeAttr + ' id="' + fieldId + '" class="input-demo-input" placeholder="' + escapeHtml(placeholder) + '"' + valueAttr + disabledAttr + readonlyAttr + maxLengthAttr + requiredAttr + ' tabindex="-1" />';
      var radiusStyle = typeKey === "underlined" ? "" : ' style="border-radius:' + radiusCssFor(radius) + '"';
      var requiredHtml = opts.required ? '<span class="input-demo-required" aria-hidden="true"> *</span>' : "";
      var noteHtml = isError
        ? '<p class="input-demo-note is-error">' + escapeHtml(opts.errorText || "Enter a valid email address.") + "</p>"
        : (opts.supportingText ? '<p class="input-demo-note">' + escapeHtml(opts.supportingText) + "</p>" : "");
      return '<div class="input-demo-field">' +
        '<label class="input-demo-label" for="' + fieldId + '">' + escapeHtml(label) + requiredHtml + "</label>" +
        '<div class="' + controlClasses + '"' + radiusStyle + ">" + leadingHtml + inputHtml + trailingHtml + "</div>" +
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

    function buildMatrixSection(size, radius, label, placeholder, showLeadingIcon, showTrailingIcon, allowClear, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildInputField(t.key, state.key, state.cls, size, radius, label, placeholder, showLeadingIcon, showTrailingIcon, allowClear, opts) + "</td>";
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
        inputType: inputTypeSelect ? inputTypeSelect.value : "text",
        maxLength: maxLengthInput && maxLengthInput.value ? parseInt(maxLengthInput.value, 10) : null,
        required: !!(requiredInput && requiredInput.checked),
        supportingText: (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "We'll only use this to send you a receipt.") : "",
        errorText: errorTextInput ? (errorTextInput.value.trim() || "Enter a valid email address.") : "Enter a valid email address."
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
      var placeholder = placeholderInput.value.trim() || defaultPlaceholder;
      var iconSelection = propertyMultiSelects.iconPlacement ? propertyMultiSelects.iconPlacement.getSelected() : [];
      var showLeadingIcon = iconSelection.indexOf("leading") !== -1 || iconSelection.indexOf("both") !== -1;
      var showTrailingIcon = iconSelection.indexOf("trailing") !== -1 || iconSelection.indexOf("both") !== -1;
      var allowClear = allowClearInput ? allowClearInput.checked : false;
      var opts = currentOpts();

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, label, placeholder, showLeadingIcon, showTrailingIcon, allowClear, opts);
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
        labelledBy: "input-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "input-radius-dropdown-label",
        onChange: render
      });
    }
    if (iconPlacementMount && window.createMultiSelect){
      propertyMultiSelects.iconPlacement = window.createMultiSelect({
        root: iconPlacementMount,
        options: ICON_PLACEMENT_OPTIONS,
        defaultSelected: ["none"],
        ariaLabel: "Icon placement options",
        labelledBy: "input-icon-placement-dropdown-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    placeholderInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (allowClearInput) allowClearInput.addEventListener("change", render);
    if (inputTypeSelect) inputTypeSelect.addEventListener("change", render);
    if (maxLengthInput) maxLengthInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
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
