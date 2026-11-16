(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var ICON_SEARCH ='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';
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
    { key: "loading", cls: " is-loading", label: "Searching" },
    { key: "empty", cls: " is-empty", label: "Empty" },
    { key: "error", cls: " is-error", label: "No Results" },
    { key: "readonly", cls: " is-readonly", label: "Read-Only" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  // Purpose text per type, used by Copy Prompt - the actual colors come
  // from liveCssFor() below (live CSS custom property reads), never
  // hardcoded hex, so Copy Prompt/Copy Code stay correct in both dark and
  // light theme instead of silently assuming one of them.
  var FULL_SPEC = {
    outlined: { purpose: "The default search field style - a bordered box that works well on any background and reads clearly above the content it filters." },
    filled: { purpose: "A softer-emphasis search field with a solid background instead of a border, useful when it sits inside a toolbar or card and an outline would compete visually." },
    underlined: { purpose: "A minimal search field with only a bottom border, useful for compact inline search bars where a full box would feel heavy." }
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

    if (typeKey === "outlined"){
      return {
        rest: "background:" + graphite900 + ";border:var(--border-width-1) var(--border-style) " + lineStrong + ";",
        hover: "border-color:" + textDim + ";",
        focus: "border-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
        error: "border-color:" + danger500 + ";"
      };
    }
    if (typeKey === "filled"){
      return {
        rest: "background:" + graphite800 + ";border:var(--border-width-1) var(--border-style) transparent;",
        hover: "background:" + graphite700 + ";",
        focus: "background:" + graphite900 + ";border-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
        error: "border-color:" + danger500 + ";"
      };
    }
    return {
      rest: "border-bottom:var(--border-width-1) var(--border-style) " + lineStrong + ";",
      hover: "border-bottom-color:" + textDim + ";",
      focus: "border-bottom-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
      error: "border-bottom-color:" + danger500 + ";"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .search-demo-control--h* rules in shell.css (not re-derived by
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
    lines.push("Create a complete Search field component system for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - not as separate one-off fields for each variant.");
    lines.push("");
    lines.push("A Search field is a single-line input for querying or filtering content. It skips a visible label by convention - a placeholder and a leading magnifying-glass icon communicate its purpose instead - and shows a trailing clear (\"x\") button once a value is entered, letting the user reset the field in one click.");
    lines.push("");
    lines.push("Types (3):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Hover: " + css.hover);
      lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
      lines.push("  Error: " + css.error + " Paired with an inline note below the field in " + getCssVar("--danger-500", "#FF031A") + " reporting that no results were found - this is a \"no results\" state, not a validation failure.");
    });
    lines.push("");
    lines.push("States (9, apply to every type): Rest, Hover, Focused, Filled, Searching, Empty, No Results, Read-Only, Disabled.");
    lines.push("- Filled: same appearance as Rest, showing an entered search value instead of the placeholder.");
    lines.push("- Searching: trailing spinner while results are being fetched asynchronously, not interactive.");
    lines.push("- Empty: a dimmed \"No results found for your search.\" message replaces the field's supporting-text area - nothing to show, independent of the No Results state's explicit failed-query note.");
    lines.push("- No Results: a \"no results found\" note for the current query - not a validation failure.");
    lines.push("- Read-Only: shows its current value but can't be edited; still focusable, unlike Disabled.");
    lines.push("- Disabled: 50% opacity, not-allowed cursor, no hover/focus feedback.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to Outlined and Filled - Underlined stays square, matching its minimal style. Search fields are commonly pill-shaped (full radius).");
    lines.push("");
    var opts = selectionInfo.opts || {};
    lines.push("Component properties: Placeholder (editable text shown when empty), Leading icon (boolean, magnifying-glass icon before the input text), Clear button (boolean, trailing \"x\" button shown once the field has a value, clearing it in one click), Supporting text (optional helper text below the field, replaced by the no-results message whenever State is No Results, currently \"" + (opts.errorText || "") + "\").");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function exampleMarkupFor(typeKey, sizeClass, radiusClassAttr, placeholder, opts){
    opts = opts || {};
    var radiusClass = typeKey === "underlined" ? "" : " " + radiusClassAttr;
    var lines = [];
    lines.push('<div class="search-field">');
    lines.push('  <div class="search-control search-control--' + typeKey + " " + sizeClass + radiusClass + '">');
    lines.push('    <span class="search-icon"><!-- magnifying-glass icon --></span>');
    lines.push('    <input type="search" placeholder="' + escapeHtml(placeholder) + '" />');
    lines.push('    <button type="button" class="search-clear" aria-label="Clear search"><!-- x icon --></button>');
    lines.push("  </div>");
    if (opts.supportingText) lines.push('  <p class="search-note">' + escapeHtml(opts.supportingText) + "</p>");
    lines.push("</div>");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Search field component (all types, states, sizes) */");
    lines.push(".search-field{ display:flex; flex-direction:column; gap:var(--space-6); }");
    lines.push(".search-control{ box-sizing:border-box; display:flex; align-items:center; gap:var(--space-8); border-radius:var(--radius-md); transition:background-color .15s ease, border-color .15s ease; }");
    lines.push('.search-control input{ flex:1 1 auto; min-width:0; border:none; background:transparent; outline:none; font-family:var(--font-body); padding:0; }');
    lines.push('.search-note{ font-family:var(--font-body); font-size:var(--type-caption-size); }');
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".search-control--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (8 options) - not chosen yet, default is 8px - applies to Outlined/Filled only, Underlined stays square */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applies to Outlined/Filled only, Underlined stays square */");
    radiiToEmit.forEach(function(radius){
      lines.push(".search-control--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (3) - rest / hover / focus / error per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".search-control--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":focus-within{ " + css.focus + " }");
      lines.push(cls + ".is-error{ " + css.error + " }");
    });
    lines.push("");
    lines.push("/* Read-Only - visually unchanged from Rest, cursor signals it isn't editable; still focusable, unlike Disabled */");
    lines.push(".search-control input:read-only{ cursor:default; }");
    lines.push("");
    lines.push("/* Disabled - shared by every type */");
    lines.push(".search-control:has(input:disabled){ opacity:0.5; }");
    lines.push(".search-control input:disabled{ cursor:not-allowed; }");
    lines.push("");
    var opts = selectionInfo.opts || {};
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var sizeClass = "search-control--h" + exampleSize;
    var radiusClassAttr = "search-control--radius-" + radiusClassSuffix(exampleRadius);
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(exampleMarkupFor(t.key, sizeClass, radiusClassAttr, "Search...", opts));
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

    // Gallery-card copy CTA + click-to-navigate (search.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-search"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-search"]');
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
    var searchTypeCards = document.querySelectorAll(".search-type-card[data-system]");
    searchTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "search-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="search-matrix-container"]');
    if (!matrixContainer) return;

    var defaultPlaceholder = document.body.dataset.defaultPlaceholder || "Search...";
    var placeholderInput = document.querySelector('[data-role="search-placeholder"]');
    var leadingIconInput = document.querySelector('[data-role="search-leading-icon"]');
    var clearButtonInput = document.querySelector('[data-role="search-clear-button"]');
    var showSupportingInput = document.querySelector('[data-role="search-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="search-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="search-supporting-text-field"]');
    var errorTextInput = document.querySelector('[data-role="search-error-text"]');
    var sizeMount = document.querySelector('[data-role="search-size-mount"]');
    var radiusMount = document.querySelector('[data-role="search-radius-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function currentOpts(){
      return {
        supportingText: (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "Search by name, ID, or keyword.") : "",
        errorText: errorTextInput ? (errorTextInput.value.trim() || 'No results found for "xyz123notfound".') : 'No results found for "xyz123notfound".'
      };
    }

    function buildSearchField(typeKey, stateKey, stateCls, size, radius, placeholder, showLeadingIcon, showClearButton, opts){
      opts = opts || {};
      var isDisabled = stateKey === "disabled";
      var isReadOnly = stateKey === "readonly";
      var isLoading = stateKey === "loading";
      var isFilled = stateKey === "filled";
      var isError = stateKey === "error";
      var isEmpty = stateKey === "empty";
      var hasValue = isFilled || isError || isReadOnly || isLoading;
      var controlClasses = "search-demo-control search-demo-control--" + typeKey + " search-demo-control--h" + size + stateCls;
      var leadingHtml = showLeadingIcon ? '<span class="search-demo-icon">' + ICON_SEARCH + "</span>" : "";
      var valueAttr = isFilled || isReadOnly || isLoading ? ' value="dashboard"' : (isError ? ' value="xyz123notfound"' : "");
      var disabledAttr = isDisabled ? " disabled" : "";
      var readonlyAttr = isReadOnly ? " readonly" : "";
      // No visible label on Search (matches the real component - placeholder
      // only), so this needs an aria-label directly, not a for/id
      // association - still exposed to a screen reader's virtual cursor
      // regardless of tabindex.
      var inputHtml = '<input type="search" class="search-demo-input" placeholder="' + escapeHtml(placeholder) + '" aria-label="Search, ' + stateKey + ' state"' + valueAttr + disabledAttr + readonlyAttr + ' tabindex="-1" />';
      // tabindex="-1": this matrix is a static state comparison, not an
      // operable field - the page's own Accessibility text ("the clear
      // button is independently focusable") documents the real component's
      // behavior contract, not a literal claim about every illustrative
      // cell here.
      var trailingHtml;
      if (isLoading){
        trailingHtml = '<span class="select-demo-spinner" data-contract-kind="container" aria-hidden="true"></span>';
      } else if (showClearButton && hasValue && !isDisabled && !isReadOnly){
        trailingHtml = '<button type="button" class="search-demo-clear" aria-label="Clear search" tabindex="-1">' + ICON_CLEAR + "</button>";
      } else {
        trailingHtml = "";
      }
      var radiusStyle = typeKey === "underlined" ? "" : ' style="border-radius:' + radiusCssFor(radius) + '"';
      // Empty replaces this same below-field slot entirely, same
      // "override, don't composite" rule as the error note above - never
      // both at once. Uses its own .search-demo-empty class (dimmed,
      // centered) rather than .search-demo-note so it reads as "nothing to
      // show" rather than as a validation/no-match note tied to one query.
      var noteHtml;
      if (isEmpty){
        noteHtml = '<p class="search-demo-empty" data-contract-part="search-results-empty">No results found for your search.</p>';
      } else if (isError){
        noteHtml = '<p class="search-demo-note is-error" data-contract-part="error">' + escapeHtml(opts.errorText || 'No results found for "xyz123notfound".') + "</p>";
      } else if (opts.supportingText){
        noteHtml = '<p class="search-demo-note" data-contract-part="supporting">' + escapeHtml(opts.supportingText) + "</p>";
      } else {
        noteHtml = "";
      }
      return '<div class="search-demo-field">' +
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

    function buildMatrixSection(size, radius, placeholder, showLeadingIcon, showClearButton, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildSearchField(t.key, state.key, state.cls, size, radius, placeholder, showLeadingIcon, showClearButton, opts) + "</td>";
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
      var placeholder = placeholderInput.value.trim() || defaultPlaceholder;
      var showLeadingIcon = leadingIconInput ? leadingIconInput.checked : false;
      var showClearButton = clearButtonInput ? clearButtonInput.checked : false;
      var opts = currentOpts();

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, placeholder, showLeadingIcon, showClearButton, opts);
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
        labelledBy: "search-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "search-radius-dropdown-label",
        onChange: render
      });
    }

    placeholderInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (leadingIconInput) leadingIconInput.addEventListener("change", render);
    if (clearButtonInput) clearButtonInput.addEventListener("change", render);
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
