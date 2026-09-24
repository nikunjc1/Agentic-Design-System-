(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var ICON_CHEVRON_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  var ICON_CLEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';
  var ICON_CHEVRON_RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

  var TYPES = [
    { key: "outlined", label: "Outlined" },
    { key: "filled", label: "Filled" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focus" },
    { key: "open", cls: " is-open", label: "Open" },
    { key: "filled", cls: " is-filled", label: "Filled" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  // Multi-level columns shown in the Open state's panel - one column per
  // level of the hierarchy (Continent -> Country -> City). Each column's
  // active option is the one that determined what the next column shows.
  var CASCADE_COLUMNS = [
    { options: ["Asia", "Europe", "Africa"], activeIndex: 0 },
    { options: ["India", "China", "Japan"], activeIndex: 0 },
    { options: ["Mumbai", "Delhi", "Bangalore"], activeIndex: 0 }
  ];
  var SELECTED_PATH_VALUE = "Asia / India / Mumbai";

  // Purpose text per type, used by Copy Prompt - the actual colors come
  // from liveCssFor() below (live CSS custom property reads), never
  // hardcoded hex, so Copy Prompt/Copy Code stay correct in both dark and
  // light theme instead of silently assuming one of them. Only Outlined and
  // Filled exist here (no Underlined) - a multi-column panel reads better
  // anchored to a boxed field than to a bottom-border-only one.
  var FULL_SPEC = {
    outlined: { purpose: "The default cascader field style - a bordered box that works well on any background and reads clearly in dense forms." },
    filled: { purpose: "A softer-emphasis field with a solid background instead of a border, useful when a form sits on a bordered card and an outline would compete visually." }
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
    var graphite900 = getCssVar("--graphite-900", "#15171A");
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");

    if (typeKey === "outlined"){
      return {
        rest: "background:" + graphite900 + ";border:1.5px solid " + lineStrong + ";",
        hover: "border-color:" + textDim + ";",
        focus: "border-color:" + red500 + ";outline:2px solid " + red400 + ";outline-offset:2px;"
      };
    }
    return {
      rest: "background:" + graphite800 + ";border:1.5px solid transparent;",
      hover: "background:" + graphite700 + ";",
      focus: "background:" + graphite900 + ";border-color:" + red500 + ";outline:2px solid " + red400 + ";outline-offset:2px;"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .cascader-demo-control--h* rules in shell.css (not re-derived by
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

  // Size / Corner radius option lists - same value scale as the Input/
  // Autocomplete system, shared between the page's own multi-select
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
  // Input/Autocomplete systems: untouched-default, fully-deselected, and
  // "All" checked all count as no real decision (mode "all"); a genuine
  // subset is a decision (mode "specific").
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
    lines.push("Create a complete Cascader component system for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - not as separate one-off fields for each variant. It is a select-like trigger field showing a selected hierarchical path (e.g. \"Asia / India / Mumbai\") with a trailing chevron icon, that opens a MULTI-COLUMN panel below it (one column per level: Continent, then Country, then City) where picking an option in an earlier column determines what the next column shows, letting the user drill down to a final leaf value - distinct from Select (one flat list, no drill-down) and from Autocomplete (a single suggestion list, not multiple linked columns).");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Hover: " + css.hover);
      lines.push("  Focus: " + css.focus + " Never just a color change, so layout never shifts.");
      lines.push("  Open: same border/outline treatment as Focus, plus a multi-column panel anchored below the field.");
    });
    lines.push("");
    lines.push("States (6, apply to every type): Rest, Hover, Focus, Open, Filled, Disabled.");
    lines.push("- Focus: real keyboard focus on the field, no panel visible yet.");
    lines.push("- Open: the multi-column panel is visible directly below the field - 3 columns side by side (Continent, Country, City), each with 3 example option rows. Each column's currently-selected option is highlighted, and a non-final column's selected option gets a trailing right-chevron to show it reveals the next column.");
    lines.push("- Filled: same appearance as Rest, showing the full selected path joined by \" / \" with the panel closed.");
    lines.push("- Disabled: 50% opacity, not-allowed cursor, no hover/focus/open feedback.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applies to both Outlined and Filled.");
    lines.push("");
    lines.push("Component properties: Label (editable text above the field), Placeholder (editable text shown when empty). Multiple selection (boolean - replaces each option's single active-row highlight with a real checkbox, letting more than one leaf be picked across different branches). Search (boolean - a real input inside the trigger itself, narrowing the first column to matches with the matched substring highlighted).");
    return lines.join("\n");
  }

  function exampleMarkupFor(typeKey, sizeClass, radiusClassAttr, label, placeholder){
    var lines = [];
    lines.push('<div class="cascader-field">');
    lines.push('  <label class="cascader-field-label">' + escapeHtml(label) + "</label>");
    lines.push('  <div class="cascader-control cascader-control--' + typeKey + " " + sizeClass + " " + radiusClassAttr + '">');
    lines.push('    <input type="text" readonly placeholder="' + escapeHtml(placeholder) + '" value="Asia / India / Mumbai" />');
    lines.push('    <span class="cascader-chevron">&#9660;</span>');
    lines.push("  </div>");
    lines.push("  <!-- Multi-column panel - only rendered while the field is in the Open state -->");
    lines.push('  <div class="cascader-panel">');
    lines.push('    <div class="cascader-column">');
    lines.push('      <div class="cascader-option is-active">Asia <span class="cascader-option-arrow">&#9654;</span></div>');
    lines.push('      <div class="cascader-option">Europe</div>');
    lines.push('      <div class="cascader-option">Africa</div>');
    lines.push("    </div>");
    lines.push('    <div class="cascader-column">');
    lines.push('      <div class="cascader-option is-active">India <span class="cascader-option-arrow">&#9654;</span></div>');
    lines.push('      <div class="cascader-option">China</div>');
    lines.push('      <div class="cascader-option">Japan</div>');
    lines.push("    </div>");
    lines.push('    <div class="cascader-column">');
    lines.push('      <div class="cascader-option is-active">Mumbai</div>');
    lines.push('      <div class="cascader-option">Delhi</div>');
    lines.push('      <div class="cascader-option">Bangalore</div>');
    lines.push("    </div>");
    lines.push("  </div>");
    lines.push("</div>");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Cascader component (all types, states, sizes) */");
    lines.push(".cascader-field{ position:relative; display:flex; flex-direction:column; gap:6px; }");
    lines.push('.cascader-field-label{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:13px; font-weight:500; }');
    lines.push(".cascader-control{ box-sizing:border-box; display:flex; align-items:center; gap:8px; border-radius:8px; transition:background-color .15s ease, border-color .15s ease; }");
    lines.push('.cascader-control input{ flex:1 1 auto; min-width:0; border:none; background:transparent; outline:none; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; padding:0; }');
    lines.push(".cascader-chevron{ flex:none; width:16px; height:16px; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".cascader-control--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 8px - applies to both Outlined and Filled */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applies to both Outlined and Filled */");
    radiiToEmit.forEach(function(radius){
      lines.push(".cascader-control--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (2) - rest / hover / focus / open per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".cascader-control--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":focus-within{ " + css.focus + " }");
      lines.push(cls + ".is-open{ " + css.focus + " } /* multi-column panel visible - same border/outline treatment as focus */");
    });
    lines.push("");
    lines.push("/* Disabled - shared by every type */");
    lines.push(".cascader-control:has(input:disabled){ opacity:0.5; }");
    lines.push(".cascader-control input:disabled{ cursor:not-allowed; }");
    lines.push("");
    var panelBg = getCssVar("--graphite-900", "#15171A");
    var panelBorder = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var optionActiveBg = getCssVar("--graphite-800", "#1C1F23");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var line = getCssVar("--line", "rgba(255,255,255,0.1)");
    lines.push("/* Multi-column panel - anchored below the field, shown only while Open. Same");
    lines.push("   floating-panel visual language as this system's other panels (Menu, Autocomplete,");
    lines.push("   the multi-select dropdowns): graphite background, 1px line-strong border, rounded");
    lines.push("   corners and a soft drop shadow - laid out as a row of columns, no wrap, each");
    lines.push("   column separated by a hairline divider except the last. */");
    lines.push(".cascader-panel{ position:absolute; top:calc(100% + 4px); left:0; z-index:5; box-sizing:border-box; display:flex; min-width:360px; background:" + panelBg + "; border:1px solid " + panelBorder + "; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.4); overflow:hidden; }");
    lines.push(".cascader-column{ flex:1 1 0; min-width:110px; padding:4px; display:flex; flex-direction:column; gap:2px; border-inline-end:1px solid " + line + "; }");
    lines.push(".cascader-column:last-child{ border-inline-end:none; }");
    lines.push('.cascader-option{ box-sizing:border-box; padding:8px 10px; border-radius:6px; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:13px; cursor:default; user-select:none; display:flex; align-items:center; justify-content:space-between; gap:6px; }');
    lines.push(".cascader-option.is-active{ background:" + optionActiveBg + "; color:" + red400 + "; }");
    lines.push(".cascader-option-arrow{ flex:none; width:12px; height:12px; }");
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var sizeClass = "cascader-control--h" + exampleSize;
    var radiusClassAttr = "cascader-control--radius-" + radiusClassSuffix(exampleRadius);
    lines.push("<!-- Example usage - one per type, shown in the Open state" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(exampleMarkupFor(t.key, sizeClass, radiusClassAttr, "Location", "Select location"));
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

    // Gallery-card copy CTA + click-to-navigate (cascader.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-cascader"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-cascader"]');
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
    var cascaderTypeCards = document.querySelectorAll(".cascader-type-card[data-system]");
    cascaderTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "cascader-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="cascader-matrix-container"]');
    if (!matrixContainer) return;

    // Multiple selection + Search - both explicitly documented Ant Cascader
    // features, neither reachable from the Type x State matrix above (that
    // matrix is single-select, no search box). Rendered as its own static
    // example: a search field narrows the first column to matches, and
    // checkboxes replace the single active-row highlight so more than one
    // leaf can be picked across different branches at once.
    var multiSearchContainer = document.querySelector('[data-role="cascader-multi-search-container"]');
    if (multiSearchContainer){
      var searchHtml = '<div class="cascader-demo-search"><input type="text" class="cascader-demo-search-input" placeholder="Search..." value="mu" readonly tabindex="-1" /></div>';
      var col1 = ['<div class="cascader-demo-option is-active"><span>As<mark>ia</mark></span><span class="cascader-demo-option-arrow">' + ICON_CHEVRON_RIGHT + "</span></div>",
        '<div class="cascader-demo-option"><span>Europe</span><span class="cascader-demo-option-arrow">' + ICON_CHEVRON_RIGHT + "</span></div>"].join("");
      var col2Options = [
        { label: "India", checked: false },
        { label: "China", checked: true },
        { label: "Japan", checked: false }
      ];
      var col2 = col2Options.map(function(o){
        return '<div class="cascader-demo-option cascader-demo-option--checkable">' +
          '<label class="cascader-demo-option-check"><input type="checkbox"' + (o.checked ? " checked" : "") + ' tabindex="-1" /><span>' + o.label + "</span></label>" +
          '<span class="cascader-demo-option-arrow">' + ICON_CHEVRON_RIGHT + "</span></div>";
      }).join("");
      var col3Options = [
        { label: "Beijing", checked: true },
        { label: "Shanghai", checked: false },
        { label: "Guangzhou", checked: false }
      ];
      var col3 = col3Options.map(function(o){
        return '<div class="cascader-demo-option cascader-demo-option--checkable">' +
          '<label class="cascader-demo-option-check"><input type="checkbox"' + (o.checked ? " checked" : "") + ' tabindex="-1" /><span>' + o.label + "</span></label></div>";
      }).join("");
      var panelHtml = '<div class="cascader-demo-panel">' +
        '<div class="cascader-demo-column">' + col1 + "</div>" +
        '<div class="cascader-demo-column">' + col2 + "</div>" +
        '<div class="cascader-demo-column">' + col3 + "</div>" +
        "</div>";
      multiSearchContainer.innerHTML =
        '<div class="cascader-demo-field">' +
        '<label class="cascader-demo-label">Regions (2 selected)</label>' +
        '<div class="cascader-demo-control cascader-demo-control--outlined cascader-demo-control--h40 is-open">' +
        searchHtml +
        '<span class="cascader-demo-chevron" aria-hidden="true">' + ICON_CHEVRON_DOWN + "</span></div>" +
        panelHtml +
        "</div>";
    }

    var defaultLabel = document.body.dataset.defaultLabel || "Location";
    var defaultPlaceholder = document.body.dataset.defaultPlaceholder || "Select location";
    var labelInput = document.querySelector('[data-role="cascader-label"]');
    var placeholderInput = document.querySelector('[data-role="cascader-placeholder"]');
    var allowClearInput = document.querySelector('[data-role="cascader-allow-clear"]');
    var sizeMount = document.querySelector('[data-role="cascader-size-mount"]');
    var radiusMount = document.querySelector('[data-role="cascader-radius-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildCascaderPanel(){
      var columnsHtml = CASCADE_COLUMNS.map(function(col, colIndex){
        var isLastColumn = colIndex === CASCADE_COLUMNS.length - 1;
        var optionsHtml = col.options.map(function(opt, optIndex){
          var isActive = optIndex === col.activeIndex;
          var arrowHtml = (isActive && !isLastColumn) ? '<span class="cascader-demo-option-arrow">' + ICON_CHEVRON_RIGHT + "</span>" : "";
          return '<div class="cascader-demo-option' + (isActive ? " is-active" : "") + '"><span>' + opt + "</span>" + arrowHtml + "</div>";
        }).join("");
        return '<div class="cascader-demo-column">' + optionsHtml + "</div>";
      }).join("");
      return '<div class="cascader-demo-panel">' + columnsHtml + "</div>";
    }

    function buildCascaderField(typeKey, stateKey, stateCls, size, radius, label, placeholder, allowClear){
      var isDisabled = stateKey === "disabled";
      var isFilled = stateKey === "filled";
      var isOpen = stateKey === "open";
      var hasValue = isOpen || isFilled;
      var controlClasses = "cascader-demo-control cascader-demo-control--" + typeKey + " cascader-demo-control--h" + size + stateCls;
      var valueAttr = hasValue ? ' value="' + SELECTED_PATH_VALUE + '"' : "";
      var disabledAttr = isDisabled ? " disabled" : "";
      var inputHtml = '<input type="text" class="cascader-demo-input" readonly placeholder="' + escapeHtml(placeholder) + '"' + valueAttr + disabledAttr + " />";
      var trailingHtml = (allowClear && hasValue && !isDisabled)
        ? '<button type="button" class="cascader-demo-clear" aria-label="Clear">' + ICON_CLEAR + "</button>"
        : '<span class="cascader-demo-chevron" aria-hidden="true">' + ICON_CHEVRON_DOWN + "</span>";
      var radiusStyle = ' style="border-radius:' + radiusCssFor(radius) + '"';
      var panelHtml = isOpen ? buildCascaderPanel() : "";
      return '<div class="cascader-demo-field">' +
        '<label class="cascader-demo-label">' + escapeHtml(label) + "</label>" +
        '<div class="' + controlClasses + '"' + radiusStyle + ">" + inputHtml + trailingHtml + "</div>" +
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

    function buildMatrixSection(size, radius, label, placeholder, allowClear){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildCascaderField(t.key, state.key, state.cls, size, radius, label, placeholder, allowClear) + "</td>";
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
      var allowClear = allowClearInput ? allowClearInput.checked : false;

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, label, placeholder, allowClear);
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
        labelledBy: "cascader-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "cascader-radius-dropdown-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", render);
    placeholderInput.addEventListener("input", render);
    if (allowClearInput) allowClearInput.addEventListener("change", render);

    render();
  });
})();
