(() => {
  "use strict";
  var passwordFieldCounter = 0;

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var ICON_EYE ='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
  var ICON_EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-7-11-7a18.7 18.7 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.7 18.7 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>';
  var ICON_CLEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';

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
    outlined: { purpose: "The default password field style - a bordered box that works well on any background and reads clearly in dense forms." },
    filled: { purpose: "A softer-emphasis field with a solid background instead of a border, useful when a form sits on a bordered card and an outline would compete visually." },
    underlined: { purpose: "A minimal field with only a bottom border, useful for compact inline forms like an inline PIN entry where a full box would feel heavy." }
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
    var textDim = getCssVar("--text-dim", "#69707D");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF4253");
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var graphite900 = getCssVar("--graphite-900", "#FFFFFF");
    var graphite800 = getCssVar("--graphite-800", "#F1F1EE");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");

    var green500 = getCssVar("--green-500", "#2FBF6E");
    if (typeKey === "outlined"){
      return {
        rest: "background:" + graphite900 + ";border:var(--border-width-1) var(--border-style) " + lineStrong + ";",
        hover: "border-color:" + textDim + ";",
        focus: "border-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
        error: "border-color:" + danger500 + ";",
        success: "border-color:" + green500 + ";"
      };
    }
    if (typeKey === "filled"){
      return {
        rest: "background:" + graphite800 + ";border:var(--border-width-1) var(--border-style) transparent;",
        hover: "background:" + graphite700 + ";",
        focus: "background:" + graphite900 + ";border-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
        error: "border-color:" + danger500 + ";",
        success: "border-color:" + green500 + ";"
      };
    }
    return {
      rest: "border-bottom:var(--border-width-1) var(--border-style) " + lineStrong + ";",
      hover: "border-bottom-color:" + textDim + ";",
      focus: "border-bottom-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
      error: "border-bottom-color:" + danger500 + ";",
      success: "border-bottom-color:" + green500 + ";"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .password-demo-control--h* rules in shell.css (not re-derived by
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
    lines.push("Create a complete Password component system for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - not as separate one-off fields for each variant.");
    lines.push("");
    lines.push("It is a single-line masked text input - dots hide the entered value by default, the same way a browser's native type=\"password\" input renders. An optional trailing eye-icon button toggles the field between masked and plain text.");
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
    lines.push("- Filled: same appearance as Rest, showing an entered value (rendered as dots) instead of the placeholder.");
    lines.push("- Success: border recolored to a positive/green tone - only meaningful when validation is appropriate, e.g. a confirm-password match.");
    lines.push("- Read-Only: shows its current value (masked) but can't be edited; still focusable, unlike Disabled.");
    lines.push("- Disabled: 50% opacity, not-allowed cursor, no hover/focus feedback.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to Outlined and Filled - Underlined stays square, matching its minimal style.");
    lines.push("");
    var opts = selectionInfo.opts || {};
    lines.push("Component properties: Label (editable text above the field, with an optional required indicator), Placeholder (editable text shown when empty), Show reveal toggle (boolean - shows/hides a trailing eye-icon toggle button that switches the field between masked and plain text, never clearing the entered value when toggled), Allow clear (boolean - once the field has a value, shows an × button before the reveal toggle that clears it - both actions coexist, one never replaces the other), Supporting text (optional helper text below the field, replaced by the Error message whenever State is Error).");
    lines.push("");
    lines.push("Password validation: Minimum length (" + (opts.minLength != null ? opts.minLength : 8) + " characters" + (opts.maxLength ? ", maximum " + opts.maxLength : "") + "). Password values must never be included in exported configuration data, logs, or analytics.");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function exampleMarkupFor(typeKey, sizeClass, radiusClassAttr, label, placeholder, opts){
    opts = opts || {};
    var radiusClass = typeKey === "underlined" ? "" : " " + radiusClassAttr;
    var requiredHtml = opts.required ? '<span class="password-demo-required" aria-hidden="true"> *</span>' : "";
    var minLengthAttr = opts.minLength != null ? ' minlength="' + opts.minLength + '"' : "";
    var maxLengthAttr = opts.maxLength ? ' maxlength="' + opts.maxLength + '"' : "";
    var requiredAttr = opts.required ? " required" : "";
    var lines = [];
    lines.push('<div class="password-field">');
    lines.push('  <label class="password-field-label">' + escapeHtml(label) + requiredHtml + "</label>");
    lines.push('  <div class="password-control password-control--' + typeKey + " " + sizeClass + radiusClass + '">');
    lines.push('    <input type="password" placeholder="' + escapeHtml(placeholder) + '"' + minLengthAttr + maxLengthAttr + requiredAttr + ' autocomplete="new-password" />');
    lines.push("  </div>");
    if (opts.supportingText) lines.push('  <p class="password-note">' + escapeHtml(opts.supportingText) + "</p>");
    lines.push("</div>");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Password component (all types, states, sizes) */");
    lines.push(".password-field{ display:flex; flex-direction:column; gap:var(--space-6); }");
    lines.push('.password-field-label{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-active-weight); }');
    lines.push(".password-control{ box-sizing:border-box; display:flex; align-items:center; gap:var(--space-8); border-radius:var(--radius-md); transition:background-color .15s ease, border-color .15s ease; }");
    lines.push('.password-control input{ flex:1 1 auto; min-width:0; border:none; background:transparent; outline:none; font-family:var(--font-body); padding:0; }');
    lines.push(".password-toggle{ flex:none; width:var(--dimension-18); height:var(--dimension-18); border:none; background:transparent; padding:0; cursor:pointer; }");
    lines.push('.password-note{ font-family:var(--font-body); font-size:var(--type-caption-size); }');
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".password-control--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (8 options) - not chosen yet, default is 8px - applies to Outlined/Filled only, Underlined stays square */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applies to Outlined/Filled only, Underlined stays square */");
    radiiToEmit.forEach(function(radius){
      lines.push(".password-control--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (3) - rest / hover / focus / success / error per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".password-control--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":focus-within{ " + css.focus + " }");
      lines.push(cls + ".is-success{ " + css.success + " }");
      lines.push(cls + ".is-error{ " + css.error + " }");
    });
    lines.push("");
    lines.push("/* Read-Only - visually unchanged from Rest, cursor signals it isn't editable; still focusable, unlike Disabled */");
    lines.push(".password-control input:read-only{ cursor:default; }");
    lines.push(".password-demo-required{ color:" + getCssVar("--danger-500", "#FF031A") + "; }");
    lines.push("");
    lines.push("/* Disabled - shared by every type */");
    lines.push(".password-control:has(input:disabled){ opacity:0.5; }");
    lines.push(".password-control input:disabled{ cursor:not-allowed; }");
    lines.push("");
    var opts = selectionInfo.opts || {};
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var sizeClass = "password-control--h" + exampleSize;
    var radiusClassAttr = "password-control--radius-" + radiusClassSuffix(exampleRadius);
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(exampleMarkupFor(t.key, sizeClass, radiusClassAttr, "Password", "Enter your password", opts));
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
      opts: opts,
      radius: { mode: "specific", values: [radius] }
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
    }

    // The reveal toggle actually reveals - delegated on the document since
    // the Live Preview matrix's whole innerHTML is rebuilt on every
    // property change (any listener bound directly to a button would be
    // thrown away with it). Also covers the static card on password.html's
    // listing page, which loads this same script - registered on the
    // capture phase and stopped there so the card's own click-to-navigate
    // listener (bound directly on the card, closer to the target, so it
    // would otherwise fire first during the bubble phase) never sees this
    // click and navigates away instead of toggling.
    document.addEventListener("click", function(e){
      var toggle = e.target.closest && e.target.closest(".password-demo-toggle");
      if (!toggle) return;
      e.stopPropagation();
      var control = toggle.closest(".password-demo-control");
      var input = control && control.querySelector(".password-demo-input");
      if (!input) return;
      var revealed = input.type === "text";
      input.type = revealed ? "password" : "text";
      toggle.innerHTML = revealed ? ICON_EYE : ICON_EYE_OFF;
      toggle.setAttribute("aria-label", revealed ? "Show password" : "Hide password");
    }, true);

    // Gallery-card copy CTA + click-to-navigate (password.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-password"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-password"]');
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
    var passwordTypeCards = document.querySelectorAll(".password-type-card[data-system]");
    passwordTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "password-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="password-matrix-container"]');
    if (!matrixContainer) return;

    var defaultLabel = document.body.dataset.defaultLabel || "Password";
    var defaultPlaceholder = document.body.dataset.defaultPlaceholder || "Enter your password";
    var labelInput = document.querySelector('[data-role="password-label"]');
    var placeholderInput = document.querySelector('[data-role="password-placeholder"]');
    var showRevealInput = document.querySelector('[data-role="password-show-reveal"]');
    var allowClearInput = document.querySelector('[data-role="password-allow-clear"]');
    var sizeMount = document.querySelector('[data-role="password-size-mount"]');
    var radiusMount = document.querySelector('[data-role="password-radius-mount"]');
    var minLengthInput = document.querySelector('[data-role="password-min-length"]');
    var maxLengthInput = document.querySelector('[data-role="password-max-length"]');
    var requiredInput = document.querySelector('[data-role="password-required"]');
    var showSupportingInput = document.querySelector('[data-role="password-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="password-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="password-supporting-text-field"]');
    var errorTextInput = document.querySelector('[data-role="password-error-text"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function currentOpts(){
      return {
        minLength: minLengthInput && minLengthInput.value !== "" ? parseInt(minLengthInput.value, 10) : null,
        maxLength: maxLengthInput && maxLengthInput.value ? parseInt(maxLengthInput.value, 10) : null,
        required: !!(requiredInput && requiredInput.checked),
        supportingText: (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "Use 8 or more characters with a mix of letters and numbers.") : "",
        errorText: errorTextInput ? (errorTextInput.value.trim() || "Password must be at least 8 characters.") : "Password must be at least 8 characters."
      };
    }

    function buildPasswordField(typeKey, stateKey, stateCls, size, radius, label, placeholder, showReveal, allowClear, opts){
      opts = opts || {};
      var isDisabled = stateKey === "disabled";
      var isReadOnly = stateKey === "readonly";
      var isFilled = stateKey === "filled";
      var isSuccess = stateKey === "success";
      var isError = stateKey === "error";
      var hasValue = isFilled || isSuccess || isError || isReadOnly;
      var controlClasses = "password-demo-control password-demo-control--" + typeKey + " password-demo-control--h" + size + stateCls;
      var valueAttr = hasValue ? ' value="' + (isError ? "short" : "correcthorse") + '"' : "";
      var disabledAttr = isDisabled ? " disabled" : "";
      var readonlyAttr = isReadOnly ? " readonly" : "";
      var minLengthAttr = opts.minLength != null ? ' minlength="' + opts.minLength + '"' : "";
      var maxLengthAttr = opts.maxLength ? ' maxlength="' + opts.maxLength + '"' : "";
      var requiredAttr = opts.required ? " required" : "";
      // tabindex="-1" + a real for/id label association: static comparison
      // matrix, not an operable field, but still exposed to a screen
      // reader's virtual cursor regardless of tab order.
      var fieldId = "password-demo-field-" + (++passwordFieldCounter);
      var inputHtml = '<input type="password" id="' + fieldId + '" class="password-demo-input" placeholder="' + escapeHtml(placeholder) + '"' + valueAttr + disabledAttr + readonlyAttr + minLengthAttr + maxLengthAttr + requiredAttr + ' autocomplete="new-password" tabindex="-1" />';
      var toggleHtml = showReveal ? '<button type="button" class="password-demo-toggle" aria-label="Show password" tabindex="-1">' + ICON_EYE + "</button>" : "";
      var clearHtml = (allowClear && hasValue && !isDisabled && !isReadOnly)
        ? '<button type="button" class="password-demo-clear" aria-label="Clear" tabindex="-1">' + ICON_CLEAR + "</button>"
        : "";
      var radiusStyle = typeKey === "underlined" ? "" : ' style="border-radius:' + radiusCssFor(radius) + '"';
      var requiredHtml = opts.required ? '<span class="password-demo-required" data-contract-part="required" aria-hidden="true"> *</span>' : "";
      var noteHtml = isError
        ? '<p class="password-demo-note is-error" data-contract-part="error">' + escapeHtml(opts.errorText || "Password must be at least 8 characters.") + "</p>"
        : (opts.supportingText ? '<p class="password-demo-note" data-contract-part="supporting">' + escapeHtml(opts.supportingText) + "</p>" : "");
      return '<div class="password-demo-field">' +
        '<label class="password-demo-label" for="' + fieldId + '" data-contract-part="label">' + escapeHtml(label) + requiredHtml + "</label>" +
        '<div class="' + controlClasses + '"' + radiusStyle + ">" + inputHtml + clearHtml + toggleHtml + "</div>" +
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

    function buildMatrixSection(size, radius, label, placeholder, showReveal, allowClear, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildPasswordField(t.key, state.key, state.cls, size, radius, label, placeholder, showReveal, allowClear, opts) + "</td>";
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
      var showReveal = showRevealInput ? showRevealInput.checked : false;
      var allowClear = allowClearInput ? allowClearInput.checked : false;
      var opts = currentOpts();

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, label, placeholder, showReveal, allowClear, opts);
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
        labelledBy: "password-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "password-radius-dropdown-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    placeholderInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (showRevealInput) showRevealInput.addEventListener("change", render);
    if (allowClearInput) allowClearInput.addEventListener("change", render);
    if (minLengthInput) minLengthInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
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
