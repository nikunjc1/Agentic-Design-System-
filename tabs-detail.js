(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // A third "Scoped" type was built and removed here previously: its active-tab
  // background used --graphite-900/--graphite-800 for contrast, but that pair's
  // brightness relationship inverts between themes (dark: 900 darker than 800;
  // light, this site's default: 900 is near-white, brighter than 800), so the
  // "active tab reads lighter" effect was inverted/invisible in light theme.
  // If a third type is added again, verify contrast in LIGHT theme specifically -
  // prefer a color-mix(in srgb, var(--text-hi) N%, transparent) ink-tint (like
  // --line/--line-strong) over a raw graphite-step, since that stays correct
  // in both themes.
  var TYPES = [
    { key: "underline", label: "Underline" },
    { key: "pill", label: "Pill" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    underline: { purpose: "A minimal bar where the active tab gets a 2px accent underline and no background change - reads as part of the page's own text hierarchy, not a separate control." },
    pill: { purpose: "A solid pill highlight follows the active tab - useful when the tab bar needs to stand out as its own control, separate from the page content around it." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  function liveCssFor(typeKey){
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var textMid = getCssVar("--text-mid", "#A7ABB2");
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.1)");

    if (typeKey === "underline"){
      return {
        rest: "background:transparent;color:" + textMid + ";border-bottom:2px solid transparent;",
        active: "color:" + textHi + ";border-bottom:2px solid " + red500 + ";font-weight:600;",
        hover: "color:" + textHi + ";",
        focus: "outline:2px solid " + red400 + ";outline-offset:2px;"
      };
    }
    return {
      rest: "background:transparent;color:" + textMid + ";",
      active: "background:" + redTint + ";color:" + red500 + ";font-weight:600;",
      hover: "background:" + graphite800 + ";color:" + textHi + ";",
      focus: "outline:2px solid " + red400 + ";outline-offset:2px;"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .tabs-demo-trigger--h* rules in the scratch CSS file (not
  // re-derived by formula) so Copy Code reproduces exactly what the Live
  // Preview matrix is showing, at every size, not just the one size a
  // formula happens to agree with. Same literal scale already used by the
  // Group Button system, kept consistent across components.
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
  // Group Button systems, shared between the page's own multi-select
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
  var DEFAULT_LABELS = ["Overview", "Activity", "Settings"];

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

  function parseLabels(raw){
    var labels = (raw || "").split(",").map(function(s){ return s.trim(); }).filter(Boolean);
    return labels.length ? labels : DEFAULT_LABELS;
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
    var labels = selectionInfo.labels || DEFAULT_LABELS;

    var lines = [];
    lines.push("Create a complete Tabs (tab bar) component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - a horizontal row of tab triggers where exactly one is active at a time. Only the tab bar itself, not a full page with panel content underneath.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Active: " + css.active);
      lines.push("  Hover: " + css.hover);
      lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
    });
    lines.push("");
    lines.push("States (4, apply per trigger): Rest, Hover, Focused, Disabled.");
    lines.push("- Exactly one trigger is Active at all times - a separate property from these four states, so the bar always shows realistic always-one-selected context.");
    lines.push("- Disabled applies to one trigger at a time (its own real disabled attribute, 40% opacity, not-allowed cursor), not the whole bar.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " This is the tab bar's height - padding and font-size scale proportionally, applied to every trigger.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Only visually affects the Pill type's active tab (its pill background) - the Underline type ignores it entirely.");
    lines.push("");
    lines.push("Component properties: Labels (comma-separated editable text, one per trigger, current value \"" + labels.join(", ") + "\" - trigger count follows the number of labels entered).");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var labels = selectionInfo.labels || DEFAULT_LABELS;

    var lines = [];
    lines.push("/* Agentic Design System - Tabs component */");
    lines.push(".tabs-demo-bar{ display:inline-flex; align-items:stretch; box-sizing:border-box; }");
    lines.push(".tabs-demo-bar--underline{ gap:24px; border-bottom:1.5px solid var(--line-strong); }");
    lines.push(".tabs-demo-bar--pill{ gap:4px; align-items:center; }");
    lines.push('.tabs-demo-trigger{ box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; border:none; background:transparent; border-bottom:2px solid transparent; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-weight:500; white-space:nowrap; cursor:pointer; color:var(--text-mid); transition:background-color .15s ease, border-color .15s ease, color .15s ease; }');
    lines.push(".tabs-demo-trigger:disabled{ cursor:not-allowed; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".tabs-demo-trigger--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    lines.push("/* Types (2) - rest / active / hover / focus per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var barCls = ".tabs-demo-bar--" + t.key + " .tabs-demo-trigger";
      lines.push(barCls + "{ " + css.rest + " }");
      lines.push(barCls + ".is-active{ " + css.active + " }");
      lines.push(barCls + ":hover, " + barCls + ".is-hover{ " + css.hover + " }");
      lines.push(barCls + ":focus-visible, " + barCls + ".is-focus{ " + css.focus + " }");
      lines.push(barCls + ":disabled, " + barCls + ".is-disabled{ opacity:0.4; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 8px - Pill type's active tab only, the joining .tabs-demo-bar--radius-* class does nothing on the Underline type */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - Pill type's active tab only */");
    radiiToEmit.forEach(function(radius){
      lines.push(".tabs-demo-bar--radius-" + radiusClassSuffix(radius) + ".tabs-demo-bar--pill .tabs-demo-trigger.is-active{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push('<div class="tabs-demo-bar tabs-demo-bar--' + t.key + " tabs-demo-bar--radius-" + radiusClassSuffix(exampleRadius) + '">');
      labels.forEach(function(label, i){
        var activeCls = i === 1 ? " is-active" : "";
        lines.push('  <button type="button" class="tabs-demo-trigger tabs-demo-trigger--h' + exampleSize + activeCls + '">' + escapeHtml(label) + "</button>");
      });
      lines.push("</div>");
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size x Corner radius
  // combination, fully resolved (never "ask the question") - used by the
  // Copy prompt/Copy code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(size, radius, labels){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      labels: labels
    });
  }

  function buildComboCode(size, radius, labels){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      labels: labels
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

    // Gallery-card copy CTA + click-to-navigate (tabs.html's listing
    // card) - separate data-role from every other system's own copy
    // roles so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-tabs"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-tabs"]');
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
    var tabsTypeCards = document.querySelectorAll(".tabs-type-card[data-system]");
    tabsTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "tabs-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="tabs-matrix-container"]');
    if (!matrixContainer) return;

    var labelsInput = document.querySelector('[data-role="tabs-label"]');
    var sizeMount = document.querySelector('[data-role="tabs-size-mount"]');
    var radiusMount = document.querySelector('[data-role="tabs-radius-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildTabsBar(typeKey, stateKey, stateCls, size, radius, labels){
      var triggers = labels.map(function(label, i){
        var cls = "tabs-demo-trigger tabs-demo-trigger--h" + size;
        if (i === 1) cls += " is-active";
        if (i === 0) cls += stateCls;
        var disabledAttr = (i === 0 && stateKey === "disabled") ? " disabled" : "";
        return '<button type="button" class="' + cls + '"' + disabledAttr + ">" + escapeHtml(label) + "</button>";
      }).join("");
      return '<div class="tabs-demo-bar tabs-demo-bar--' + typeKey + " tabs-demo-bar--radius-" + radiusClassSuffix(radius) + '">' + triggers + "</div>";
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

    function buildMatrixSection(size, radius, labels){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildTabsBar(t.key, state.key, state.cls, size, radius, labels) + "</td>";
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
        labels: parseLabels(labelsInput.value)
      };
    }

    function render(){
      var labels = parseLabels(labelsInput.value);

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, labels);
          combos.push({ size: size, radius: radius, label: comboLabel(size, radius), labels: labels });
        });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.radius, c.labels); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.radius, c.labels); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "tabs-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "tabs-radius-dropdown-label",
        onChange: render
      });
    }

    labelsInput.addEventListener("input", render);

    render();
  });
})();
