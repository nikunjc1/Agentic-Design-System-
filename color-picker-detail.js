(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var ICON_CLEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';

  var TYPES = [
    { key: "outlined", label: "Outlined" },
    { key: "filled", label: "Filled" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "filled", cls: " is-filled", label: "Color Selected" },
    { key: "open", cls: " is-open", label: "Open" },
    { key: "error", cls: " is-error", label: "Error" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" },
    { key: "readonly", cls: " is-readonly", label: "Read-Only" },
    { key: "loading", cls: " is-loading", label: "Loading" }
  ];
  var VALUE_FORMATS = { hex: "Hex", rgb: "RGB", token: "Design token name" };

  // Purpose text per type, used by Copy Prompt - the actual colors come
  // from liveCssFor() below (live CSS custom property reads), never
  // hardcoded hex, so Copy Prompt/Copy Code stay correct in both dark and
  // light theme instead of silently assuming one of them.
  var FULL_SPEC = {
    outlined: { purpose: "The default color picker style - a bordered box that works well on any background and reads clearly in dense forms." },
    filled: { purpose: "A softer-emphasis field with a solid background instead of a border, useful when a form sits on a bordered card and an outline would compete visually." }
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
    return {
      rest: "background:" + graphite800 + ";border:var(--border-width-1) var(--border-style) transparent;",
      hover: "background:" + graphite700 + ";",
      focus: "background:" + graphite900 + ";border-color:" + red500 + ";outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
      error: "border-color:" + danger500 + ";"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .colorpicker-demo-control--h* rules in shell.css (not re-derived by
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

  // Size / Corner radius option lists - same value scale as the Button/
  // Input systems, shared between the page's own multi-select dropdowns
  // and the Copy Prompt/Copy Code generators below.
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

  // Preset palette shown in the Open state's swatch grid, grouped the way
  // the spec asks (Brand / Neutral / Custom) - Brand and Neutral pull from
  // this system's own real design tokens where they exist, Custom is a
  // handful of plain descriptive hex swatches so the grid reads as a
  // believable palette rather than only the system's red-accent scale.
  // Foundation token browsing/search across every available shade is a
  // much larger feature (see Component Guide / Color Selection section)
  // and is intentionally out of scope for this static demo palette.
  function paletteGroups(){
    return [
      { label: "Brand", swatches: [getCssVar("--red-500", "#FF031A"), getCssVar("--red-400", "#FF4253"), getCssVar("--green-500", "#2FBF6E")] },
      { label: "Neutral", swatches: [getCssVar("--graphite-700", "#262A2F"), "#9CA3AF"] },
      { label: "Custom", swatches: ["#3B82F6", "#F59E0B", "#8B5CF6"] }
    ];
  }

  function paletteSwatches(){
    var flat = [];
    paletteGroups().forEach(function(g){ flat = flat.concat(g.swatches); });
    return flat;
  }

  // Loose #RRGGBB/#RGB -> "rgb(r, g, b)" conversion for the Value format
  // property - HSL/HSLA and true foundation-token-reference preservation
  // (the spec's "Important" note) are intentionally out of scope for this
  // static demo field, which only ever holds a single fixed example value.
  function hexToRgbString(hex){
    var h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(function(c){ return c + c; }).join("");
    var num = parseInt(h, 16);
    if (!isFinite(num)) return hex;
    var r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }

  function displayValueFor(format, hexValue, tokenName){
    if (format === "rgb") return hexToRgbString(hexValue);
    if (format === "token") return tokenName || "color.brand.primary";
    return hexValue;
  }

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
  // Button/Input systems: untouched-default, fully-deselected, and "All"
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
    lines.push("Create a complete Color Picker component system for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - not as separate one-off fields for each variant.");
    lines.push("");
    lines.push("It is a trigger field styled like a text field that shows the currently selected color as a small swatch plus its hex value (e.g. a red square and \"#FF031A\"). Focusing or clicking the field opens a small palette panel of preset swatch options below it, similar to how Autocomplete and Mention open a floating panel below their field - except this panel is a grid of color swatches instead of a list of text or people rows.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Hover: " + css.hover);
      lines.push("  Focus: " + css.focus + " Never just a color change, so layout never shifts.");
      lines.push("  Open: same border/outline treatment as Focus, plus a palette panel of preset color swatches anchored below the field.");
      lines.push("  Error: " + css.error + " Paired with an inline error message below the field.");
    });
    lines.push("");
    lines.push("States (9, apply to every type): Rest, Hover, Focused, Color Selected, Open / Picker Visible, Error, Disabled, Read-Only, Loading.");
    lines.push("- Rest/Hover/Focused/Color Selected: field shows the current color swatch and value at all times - there is no empty/placeholder state, a color is always selected.");
    lines.push("- Open / Picker Visible: the field looks focused and a palette panel is visible directly below it, showing preset color swatches grouped into Brand/Neutral/Custom, with the currently selected swatch visibly marked active via a ring/outline.");
    lines.push("- Read-Only: shows its current color and value but can't be changed; still focusable, unlike Disabled - clicking it never opens the palette panel.");
    lines.push("- Loading: a spinner replaces the swatch while a foundation color token is being resolved.");
    lines.push("- Disabled: 50% opacity, not-allowed cursor, no hover/focus/open feedback.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to both Outlined and Filled.");
    lines.push("");
    var opts = selectionInfo.opts || {};
    lines.push("Component properties: Label (editable text above the field, with an optional required indicator), Color value (editable text shown next to the swatch, displayed as Hex, RGB, or a design token name), Swatch shape (Square or Round), Supporting text (optional helper text below the field, replaced by the Error message whenever State is Error).");
    lines.push("");
    lines.push("Important: when a foundation token is selected, preserve its token reference instead of only its resolved color value wherever the export format supports token references.");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function exampleMarkupFor(typeKey, sizeClass, radiusClassAttr, label, hexValue, opts){
    opts = opts || {};
    var requiredHtml = opts.required ? '<span class="colorpicker-required" aria-hidden="true"> *</span>' : "";
    var swatchClass = "colorpicker-swatch" + (opts.swatchShape === "round" ? " is-round" : "");
    var displayValue = displayValueFor(opts.valueFormat, hexValue, opts.tokenName);
    var lines = [];
    lines.push('<div class="colorpicker-field">');
    lines.push('  <label class="colorpicker-field-label">' + escapeHtml(label) + requiredHtml + "</label>");
    lines.push('  <div class="colorpicker-control colorpicker-control--' + typeKey + " " + sizeClass + " " + radiusClassAttr + '" role="button" tabindex="0">');
    lines.push('    <span class="' + swatchClass + '" style="background:' + hexValue + ';"></span>');
    lines.push('    <span class="colorpicker-value">' + escapeHtml(displayValue) + "</span>");
    lines.push("  </div>");
    if (opts.supportingText) lines.push('  <p class="colorpicker-note">' + escapeHtml(opts.supportingText) + "</p>");
    lines.push("  <!-- Palette panel - only rendered while the field is in the Open state -->");
    lines.push('  <div class="colorpicker-panel">');
    paletteGroups().forEach(function(group){
      lines.push('    <p class="colorpicker-group-label">' + escapeHtml(group.label) + "</p>");
      lines.push('    <div class="colorpicker-grid">');
      group.swatches.forEach(function(hex, i){
        lines.push('      <button type="button" class="colorpicker-swatch-option' + (group.label === "Brand" && i === 0 ? " is-active" : "") + '" style="background:' + hex + ';" aria-label="' + group.label + " " + hex + '"></button>');
      });
      lines.push("    </div>");
    });
    lines.push("  </div>");
    lines.push("</div>");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Color Picker component (all types, states, sizes) */");
    lines.push(".colorpicker-field{ position:relative; display:flex; flex-direction:column; gap:var(--space-6); }");
    lines.push('.colorpicker-field-label{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-active-weight); }');
    lines.push(".colorpicker-control{ box-sizing:border-box; display:flex; align-items:center; gap:var(--space-8); width:100%; border-radius:var(--radius-md); cursor:pointer; transition:background-color .15s ease, border-color .15s ease; }");
    lines.push('.colorpicker-value{ flex:1 1 auto; min-width:0; font-family:var(--font-body); letter-spacing:0.02em; }');
    lines.push(".colorpicker-swatch{ flex:none; width:var(--dimension-16); height:var(--dimension-16); border-radius:var(--radius-sm); border:1px solid " + getCssVar("--line-strong", "rgba(255,255,255,0.16)") + "; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".colorpicker-control--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (8 options) - not chosen yet, default is 8px - applies to both Outlined and Filled */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applies to both Outlined and Filled */");
    radiiToEmit.forEach(function(radius){
      lines.push(".colorpicker-control--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (2) - rest / hover / focus / open per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".colorpicker-control--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":focus-within{ " + css.focus + " }");
      lines.push(cls + ".is-open{ " + css.focus + " } /* palette panel visible - same border/outline treatment as focus */");
      lines.push(cls + ".is-error{ " + css.error + " }");
    });
    lines.push("");
    lines.push("/* Read-Only - keeps its current swatch/value, but can't be clicked open; still focusable, unlike Disabled */");
    lines.push(".colorpicker-control.is-readonly{ cursor:default; }");
    lines.push("");
    lines.push("/* Loading - a spinner replaces the swatch while a foundation color token resolves */");
    lines.push(".colorpicker-control.is-loading .colorpicker-swatch{ visibility:hidden; }");
    lines.push("");
    lines.push("/* Disabled - shared by every type */");
    lines.push(".colorpicker-control.is-disabled{ opacity:0.5; cursor:not-allowed; pointer-events:none; }");
    lines.push("");
    lines.push("/* Swatch shape - Square (default) or Round */");
    lines.push(".colorpicker-swatch.is-round{ border-radius:var(--radius-full); }");
    lines.push("");
    lines.push("/* Required indicator + supporting/error text */");
    lines.push(".colorpicker-required{ color:" + getCssVar("--danger-500", "#FF031A") + "; }");
    lines.push(".colorpicker-note.is-error{ color:" + getCssVar("--danger-700", "#EB0318") + "; }");
    lines.push("");
    var panelBg = getCssVar("--graphite-900", "#FFFFFF");
    var panelBorder = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var activeRing = getCssVar("--red-400", "#FF4253");
    lines.push("/* Palette panel - anchored below the field, shown only while Open. Same");
    lines.push("   floating-panel visual language as this system's other panels (Menu, Autocomplete,");
    lines.push("   Mention): graphite background, 1px line-strong border, rounded corners and a soft");
    lines.push("   drop shadow. A 4-column grid of swatch buttons; the currently selected swatch gets");
    lines.push("   an outline ring instead of moving in the grid. */");
    lines.push(".colorpicker-panel{ position:absolute; top:calc(100% + 4px); left:0; right:0; z-index:5; box-sizing:border-box; background:" + panelBg + "; border:1px solid " + panelBorder + "; border-radius:var(--radius-md); box-shadow:var(--shadow-md); padding:var(--space-8); }");
    lines.push(".colorpicker-group-label{ margin:var(--space-8) 0 var(--space-4); font-size:var(--type-caption-size); color:" + getCssVar("--text-dim", "#69707D") + "; }");
    lines.push(".colorpicker-group-label:first-child{ margin-top:0; }");
    lines.push(".colorpicker-grid{ display:grid; grid-template-columns:repeat(4, 1fr); gap:var(--space-6); }");
    lines.push(".colorpicker-swatch-option{ width:var(--dimension-28); height:var(--dimension-28); border-radius:var(--radius-6); border:1px solid " + panelBorder + "; cursor:pointer; padding:0; }");
    lines.push(".colorpicker-swatch-option.is-active{ outline:2px solid " + activeRing + "; outline-offset:2px; }");
    lines.push("");
    var opts = selectionInfo.opts || {};
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var sizeClass = "colorpicker-control--h" + exampleSize;
    var radiusClassAttr = "colorpicker-control--radius-" + radiusClassSuffix(exampleRadius);
    lines.push("<!-- Example usage - one per type, shown in the Open state" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(exampleMarkupFor(t.key, sizeClass, radiusClassAttr, "Brand color", "#FF031A", opts));
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

    // Gallery-card copy CTA + click-to-navigate (color-picker.html's
    // listing card) - separate data-role from every other system's own
    // copy roles so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-colorpicker"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-colorpicker"]');
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
    var colorPickerTypeCards = document.querySelectorAll(".colorpicker-type-card[data-system]");
    colorPickerTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "color-picker-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="colorpicker-matrix-container"]');
    if (!matrixContainer) return;

    var defaultLabel = document.body.dataset.defaultLabel || "Brand color";
    var defaultHex = document.body.dataset.defaultHex || "#FF031A";
    var labelInput = document.querySelector('[data-role="colorpicker-label"]');
    var hexInput = document.querySelector('[data-role="colorpicker-hex"]');
    var allowClearInput = document.querySelector('[data-role="colorpicker-allow-clear"]');
    var valueFormatSelect = document.querySelector('[data-role="colorpicker-value-format"]');
    var tokenFieldWrap = document.querySelector('[data-role="colorpicker-token-field"]');
    var tokenNameInput = document.querySelector('[data-role="colorpicker-token-name"]');
    var swatchShapeSelect = document.querySelector('[data-role="colorpicker-swatch-shape"]');
    var requiredInput = document.querySelector('[data-role="colorpicker-required"]');
    var showSupportingInput = document.querySelector('[data-role="colorpicker-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="colorpicker-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="colorpicker-supporting-text-field"]');
    var errorTextInput = document.querySelector('[data-role="colorpicker-error-text"]');
    var interactiveMount = document.querySelector('[data-role="colorpicker-interactive"]');
    var sizeMount = document.querySelector('[data-role="colorpicker-size-mount"]');
    var radiusMount = document.querySelector('[data-role="colorpicker-radius-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    // Loose hex validation - a simple regex fallback to the default color
    // whenever the typed value isn't a real #RRGGBB (or #RGB) hex string,
    // this is a demo field, not a full color-input widget.
    var HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
    function normalizedHex(value){
      var trimmed = (value || "").trim();
      return HEX_RE.test(trimmed) ? trimmed : defaultHex;
    }

    function groupPanelHtml(activeIndexFlat, demo){
      var swatchCls = demo ? "colorpicker-demo-swatch-option" : "colorpicker-swatch-option";
      var groupCls = demo ? "colorpicker-demo-group-label" : "colorpicker-group-label";
      var gridCls = demo ? "colorpicker-demo-grid" : "colorpicker-grid";
      var flatIndex = 0;
      var html = "";
      paletteGroups().forEach(function(group){
        html += '<p class="' + groupCls + '">' + escapeHtml(group.label) + "</p>";
        html += '<div class="' + gridCls + '">';
        group.swatches.forEach(function(hex){
          var isActive = flatIndex === activeIndexFlat;
          html += '<button type="button" class="' + swatchCls + (isActive ? " is-active" : "") + '" style="background:' + hex + ';" aria-label="' + escapeHtml(group.label) + " " + hex + '" data-hex="' + hex + '"' + (demo ? ' tabindex="-1"' : "") + "></button>";
          flatIndex++;
        });
        html += "</div>";
      });
      return html;
    }

    // Renders a `.colorpicker-demo-field` (needs position:relative so the
    // Open state's panel can anchor to it) containing a swatch + value
    // control, and, only in the Open state, a palette panel of preset
    // swatches grouped into Brand/Neutral/Custom below it with the first
    // one marked active.
    function buildColorPickerField(typeKey, stateKey, stateCls, size, radius, label, hexValue, allowClear, opts){
      opts = opts || {};
      var isOpen = stateKey === "open";
      var isDisabled = stateKey === "disabled";
      var isError = stateKey === "error";
      var isReadonly = stateKey === "readonly";
      var isLoading = stateKey === "loading";
      var controlClasses = "colorpicker-demo-control colorpicker-demo-control--" + typeKey + " colorpicker-demo-control--h" + size + stateCls;
      var swatchClass = "colorpicker-demo-swatch" + (opts.swatchShape === "round" ? " is-round" : "");
      // A plain childless <span style="background:...;"> is text-tag-shaped
      // with no element children, so the Figma capture classified it as
      // text, not a container - an empty text node renders nothing, so the
      // whole swatch disappeared in Figma even though it showed correctly
      // on this live page (reported: Color Picker's swatch not visible in
      // Figma, across every state/size/appearance). A data-contract-kind
      // override fixed that classification once already, but it still never
      // showed up in Figma - giving it a REAL element child instead (same
      // SVG-fill mechanism every other state-colored icon in this system
      // already uses successfully: Checkbox, Radio, Switch, Date Picker,
      // Number) sidesteps the ambiguity entirely, rather than depending on
      // that one special-cased override still somehow not taking effect.
      var swatchHtml = isLoading
        ? '<span class="select-demo-spinner" data-contract-kind="container" aria-hidden="true"></span>'
        : '<span class="' + swatchClass + '" data-contract-part="swatch"><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" fill="' + hexValue + '"/></svg></span>';
      var displayValue = displayValueFor(opts.valueFormat, hexValue, opts.tokenName);
      var valueHtml = '<span class="colorpicker-demo-value" data-contract-part="value">' + escapeHtml(displayValue) + "</span>";
      // Unlike the other field-with-a-picker components, ColorPicker always
      // holds a real value (there's no meaningful "empty" swatch), so
      // allowClear's button sits alongside the value rather than replacing
      // a placeholder icon - clicking it would revert to the default color,
      // not to nothing.
      // tabindex="-1" throughout: this matrix is a static state comparison,
      // not an operable field.
      var clearHtml = (allowClear && !isDisabled && !isReadonly && !isLoading)
        ? '<button type="button" class="colorpicker-demo-clear" aria-label="Reset color" tabindex="-1">' + ICON_CLEAR + "</button>"
        : "";
      var radiusStyle = ' style="border-radius:' + radiusCssFor(radius) + '"';
      var panelHtml = isOpen ? '<div class="colorpicker-demo-panel">' + groupPanelHtml(0, true) + "</div>" : "";
      var requiredHtml = opts.required ? '<span class="colorpicker-demo-required" data-contract-part="required" aria-hidden="true"> *</span>' : "";
      var noteHtml = "";
      if (isError){
        noteHtml = '<p class="colorpicker-demo-note is-error" data-contract-part="error">' + escapeHtml(opts.errorText || "Enter a valid hex color, like #FF6B00.") + "</p>";
      } else if (opts.supportingText){
        noteHtml = '<p class="colorpicker-demo-note" data-contract-part="supporting">' + escapeHtml(opts.supportingText) + "</p>";
      }
      return '<div class="colorpicker-demo-field">' +
        '<label class="colorpicker-demo-label" data-contract-part="label">' + escapeHtml(label) + requiredHtml + "</label>" +
        '<div class="' + controlClasses + '"' + radiusStyle + ">" + swatchHtml + valueHtml + clearHtml + "</div>" +
        noteHtml +
        panelHtml +
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

    function buildMatrixSection(size, radius, label, hexValue, allowClear, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildColorPickerField(t.key, state.key, state.cls, size, radius, label, hexValue, allowClear, opts) + "</td>";
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
        valueFormat: valueFormatSelect ? valueFormatSelect.value : "hex",
        tokenName: (tokenNameInput && tokenNameInput.value.trim()) || "color.brand.primary",
        swatchShape: swatchShapeSelect ? swatchShapeSelect.value : "square",
        supportingText: (showSupportingInput && showSupportingInput.checked && supportingTextInput) ? supportingTextInput.value.trim() : "",
        errorText: (errorTextInput && errorTextInput.value.trim()) || "Enter a valid hex color, like #FF6B00."
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
      var hexValue = normalizedHex(hexInput.value);
      var allowClear = allowClearInput ? allowClearInput.checked : false;
      var opts = currentOpts();

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, label, hexValue, allowClear, opts);
          combos.push({ size: size, radius: radius, label: comboLabel(size, radius) });
        });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.radius, opts); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.radius, opts); });

      renderInteractive(label, hexValue);
    }

    // Real, working "Try it" instance: clicking the field opens the
    // grouped palette panel; clicking a swatch selects it (updates the
    // swatch + displayed value) and closes the panel; Escape or a click
    // outside the field closes it without changing the value. Rebuilt via
    // innerHTML on every selection, so the trigger's own click handler
    // uses e.stopPropagation() to avoid the newly-rebuilt (and thus
    // detached) trigger incorrectly tripping the document-level
    // outside-click listener added in the same bubble phase - the same
    // fix Select Dropdown's interactive instance needed.
    var interactiveSelectedHex = defaultHex;
    var interactiveOpen = false;

    function renderInteractiveInstance(){
      if (!interactiveMount) return;
      var label = labelInput.value.trim() || defaultLabel;
      var opts = currentOpts();
      var displayValue = displayValueFor(opts.valueFormat, interactiveSelectedHex, opts.tokenName);
      var requiredHtml = opts.required ? '<span class="colorpicker-demo-required" data-contract-part="required" aria-hidden="true"> *</span>' : "";
      var swatchClass = "colorpicker-demo-swatch" + (opts.swatchShape === "round" ? " is-round" : "");
      var html = '<div class="colorpicker-demo-field" style="width:min(320px, 100%);">' +
        '<label class="colorpicker-demo-label" data-contract-part="label">' + escapeHtml(label) + requiredHtml + "</label>" +
        '<div class="colorpicker-demo-control colorpicker-demo-control--outlined colorpicker-demo-control--h40' + (interactiveOpen ? " is-open" : "") + '" style="border-radius:' + radiusCssFor(FALLBACK_DEFAULTS.radius) + ';" role="button" tabindex="0" aria-haspopup="true" aria-expanded="' + interactiveOpen + '">' +
        '<span class="' + swatchClass + '" style="background:' + interactiveSelectedHex + ';"></span>' +
        '<span class="colorpicker-demo-value">' + escapeHtml(displayValue) + "</span>" +
        "</div>" +
        (opts.supportingText ? '<p class="colorpicker-demo-note" data-contract-part="supporting">' + escapeHtml(opts.supportingText) + "</p>" : "") +
        (interactiveOpen ? '<div class="colorpicker-demo-panel" style="position:static; margin-top:var(--space-4);">' + groupPanelHtml(paletteSwatches().indexOf(interactiveSelectedHex), true) + "</div>" : "") +
        "</div>";
      interactiveMount.innerHTML = html;

      var trigger = interactiveMount.querySelector(".colorpicker-demo-control");
      trigger.addEventListener("click", function(e){
        e.stopPropagation();
        interactiveOpen = !interactiveOpen;
        renderInteractiveInstance();
      });
      trigger.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          interactiveOpen = !interactiveOpen;
          renderInteractiveInstance();
        }
      });

      if (interactiveOpen){
        interactiveMount.querySelectorAll(".colorpicker-demo-swatch-option").forEach(function(btn){
          btn.removeAttribute("tabindex");
          btn.addEventListener("click", function(e){
            e.stopPropagation();
            interactiveSelectedHex = btn.dataset.hex;
            interactiveOpen = false;
            renderInteractiveInstance();
          });
        });
        document.addEventListener("click", onInteractiveDocClick, false);
        document.addEventListener("keydown", onInteractiveKeydown, false);
      } else {
        document.removeEventListener("click", onInteractiveDocClick, false);
        document.removeEventListener("keydown", onInteractiveKeydown, false);
      }
    }

    function onInteractiveDocClick(e){
      if (interactiveMount && interactiveMount.contains(e.target)) return;
      if (!interactiveOpen) return;
      interactiveOpen = false;
      renderInteractiveInstance();
    }
    function onInteractiveKeydown(e){
      if (e.key === "Escape" && interactiveOpen){
        interactiveOpen = false;
        renderInteractiveInstance();
      }
    }

    function renderInteractive(){
      renderInteractiveInstance();
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "colorpicker-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "colorpicker-radius-dropdown-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    hexInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (allowClearInput) allowClearInput.addEventListener("change", render);
    if (requiredInput) requiredInput.addEventListener("change", render);
    if (swatchShapeSelect) swatchShapeSelect.addEventListener("change", render);
    if (valueFormatSelect && tokenFieldWrap){
      valueFormatSelect.addEventListener("change", function(){
        tokenFieldWrap.hidden = valueFormatSelect.value !== "token";
        render();
      });
    }
    if (tokenNameInput) tokenNameInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
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
