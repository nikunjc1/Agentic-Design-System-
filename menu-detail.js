(() => {
  "use strict";

  // Menu = the floating panel/list of commands itself (what appears when a
  // dropdown trigger, a right-click, or a "..." button is activated) - NOT
  // the trigger button. A separate "Dropdown" component owns the trigger;
  // this file never builds one and never uses the word "Dropdown" in its
  // own class/data-role names (uses "menu" throughout) so the two stay
  // clearly distinct.

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "icons", label: "With icons" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  // Generic leading icon reused per item (doesn't need to be meaningfully
  // different per item) - uses currentColor so it automatically follows an
  // item's text color, including the destructive item's red.
  var ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>';

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Theme-aware live color reads for the item states + the automatic
  // destructive treatment - same across both types (the two types differ
  // only in icon presence, not palette), so this isn't split per-type the
  // way Group Button's outlined/filled palettes are.
  function liveCssFor(){
    var graphite900 = getCssVar("--graphite-900", "#15171A");
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var line = getCssVar("--line", "rgba(255,255,255,0.08)");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var red500 = getCssVar("--red-500", "#FF031A");
    var danger500 = getCssVar("--danger-500", "#FF031A");

    return {
      panel: "background:" + graphite900 + ";border:1px solid " + lineStrong + ";box-shadow:0 8px 24px rgba(0,0,0,0.4);",
      rest: "background:transparent;color:" + textHi + ";",
      hover: "background:" + graphite800 + ";",
      focus: "outline:2px solid " + red500 + ";outline-offset:-2px;",
      disabled: "opacity:0.4;cursor:not-allowed;",
      destructive: "color:" + danger500 + ";",
      line: line
    };
  }

  // Hand-tuned padding/font-size per row height - must stay identical to
  // the real .menu-demo-item--h* rules in the merged CSS (not re-derived
  // by formula) so Copy Code reproduces exactly what the Live Preview
  // matrix is showing, at every size, not just one size a formula agrees
  // with.
  var SIZE_SCALE = {
    "24": { pad: 8, font: 11 },
    "28": { pad: 10, font: 12 },
    "32": { pad: 10, font: 12 },
    "36": { pad: 12, font: 13 },
    "40": { pad: 12, font: 14 },
    "44": { pad: 14, font: 14 },
    "48": { pad: 16, font: 15 },
    "56": { pad: 18, font: 16 }
  };

  // Size / Corner radius option lists - same value scale as the other
  // Agentic Design System components, shared between this page's own
  // multi-select dropdowns and the Copy Prompt/Copy Code generators below.
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
  var DEFAULT_LABELS = ["Edit", "Duplicate", "Archive", "Delete"];

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

  // The last item is automatically styled destructive whenever its label
  // is literally "Delete" or "Remove" (case-insensitive) - regardless of
  // which state row it's in - matching how real menus separate a
  // destructive action visually with a top border on that item itself.
  function destructiveIndexFor(labels){
    if (!labels.length) return -1;
    var last = labels[labels.length - 1].trim().toLowerCase();
    return (last === "delete" || last === "remove") ? labels.length - 1 : -1;
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
    var css = liveCssFor();

    var lines = [];
    lines.push("Create a complete Menu (floating panel of commands or actions) component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, items) - the floating panel/list itself, like what appears when a dropdown trigger, a right-click, or a \"...\" button is activated. Not the trigger button that opens it, and not separate one-off buttons glued together.");
    lines.push("");
    lines.push("Types (2):");
    lines.push("- Default: text-only items.");
    lines.push("- With icons: each item gets a small leading icon before its label.");
    lines.push("");
    lines.push("States (4, apply per item): Rest, Hover, Focused, Disabled.");
    lines.push("  Rest: " + css.rest);
    lines.push("  Hover: " + css.hover);
    lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
    lines.push("  Disabled: " + css.disabled);
    lines.push("");
    lines.push("Destructive item: if the last item's label is literally \"Delete\" or \"Remove\" (case-insensitive), automatically style that item's text and icon (" + css.destructive + ") and add a thin top border (border-top:1px solid " + css.line + ") on that item itself, separating it from the regular actions above - a common pattern real menus use to set a destructive action apart. Draw the border inside the item's own box (box-sizing:border-box) so it never adds extra spacing beyond the panel's normal item gap, and zero out that item's own top-left/top-right corner radius (border-start-start-radius / border-start-end-radius) so the line stays flush edge-to-edge instead of curling in with the item's own rounded corners - its bottom corners keep the inherited radius since it's the last item, sitting at the panel's actual bottom edge.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Controls each item's row height - padding and font-size scale proportionally.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to the panel's outer corners only.");
    lines.push("");
    lines.push("Component properties: Labels (comma-separated editable text, one per item, current value \"" + labels.join(", ") + "\" - item count follows the number of labels entered).");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var labels = selectionInfo.labels || DEFAULT_LABELS;
    var css = liveCssFor();

    var lines = [];
    lines.push("/* Agentic Design System - Menu (floating panel) component */");
    lines.push(".menu-demo-panel{ display:flex; flex-direction:column; gap:2px; box-sizing:border-box; padding:6px; " + css.panel + " }");
    lines.push('.menu-demo-item{ box-sizing:border-box; display:flex; align-items:center; gap:8px; width:100%; border:none; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-weight:500; text-align: start; border-radius:4px; cursor:pointer; transition:background-color .15s ease, color .15s ease; ' + css.rest + ' }');
    lines.push(".menu-demo-item svg{ width:16px; height:16px; flex:none; }");
    lines.push(".menu-demo-item:hover, .menu-demo-item.is-hover{ " + css.hover + " }");
    lines.push(".menu-demo-item:focus-visible, .menu-demo-item.is-focus{ " + css.focus + " }");
    lines.push(".menu-demo-item:disabled, .menu-demo-item.is-disabled{ " + css.disabled + " }");
    lines.push(".menu-demo-item.is-destructive{ " + css.destructive + " border-top:1px solid " + css.line + "; border-start-start-radius:0; border-start-end-radius:0; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (row height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".menu-demo-item--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 8px - panel's outer corners only */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - panel's outer corners only */");
    radiiToEmit.forEach(function(radius){
      lines.push(".menu-demo-panel--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Destructive item - automatic whenever the last item's label is \"Delete\" or \"Remove\" (case-insensitive); apply .is-destructive wherever that label is rendered. Its border-top draws inside the item's own box (box-sizing:border-box), so it never adds extra gap beyond the panel's normal 2px item spacing. */");
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var exampleDestructiveIndex = destructiveIndexFor(labels);
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push('<div class="menu-demo-panel menu-demo-panel--radius-' + radiusClassSuffix(exampleRadius) + '" style="border-radius:' + radiusCssFor(exampleRadius) + '">');
      labels.forEach(function(label, i){
        var itemCls = "menu-demo-item menu-demo-item--h" + exampleSize + (i === exampleDestructiveIndex ? " is-destructive" : "");
        var icon = t.key === "icons" ? ICON_SVG : "";
        lines.push('  <button type="button" class="' + itemCls + '">' + icon + escapeHtml(label) + "</button>");
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

    // Gallery-card copy CTA + click-to-navigate (menu.html's listing
    // card) - separate data-role from every other system's own copy
    // roles so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-menu"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-menu"]');
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
    var menuTypeCards = document.querySelectorAll(".menu-type-card[data-system]");
    menuTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "menu-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="menu-matrix-container"]');
    if (!matrixContainer) return;

    var labelsInput = document.querySelector('[data-role="menu-label"]');
    var sizeMount = document.querySelector('[data-role="menu-size-mount"]');
    var radiusMount = document.querySelector('[data-role="menu-radius-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMenuPanel(typeKey, stateKey, stateCls, size, radius, labels){
      var isDisabledState = stateKey === "disabled";
      var radiusCss = radiusCssFor(radius);
      var destructiveIndex = destructiveIndexFor(labels);
      var itemsHtml = labels.map(function(label, i){
        var out = "";
        var itemCls = "menu-demo-item menu-demo-item--h" + size +
          (i === destructiveIndex ? " is-destructive" : "") +
          (i === 0 ? stateCls : "");
        var disabledAttr = (i === 0 && isDisabledState) ? " disabled" : "";
        var icon = typeKey === "icons" ? ICON_SVG : "";
        out += '<button type="button" class="' + itemCls + '"' + disabledAttr + ">" + icon + escapeHtml(label) + "</button>";
        return out;
      }).join("");
      return '<div class="menu-demo-panel" style="border-radius:' + radiusCss + '">' + itemsHtml + "</div>";
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
          return '<td class="button-matrix-cell">' + buildMenuPanel(t.key, state.key, state.cls, size, radius, labels) + "</td>";
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
        labelledBy: "menu-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "menu-radius-dropdown-label",
        onChange: render
      });
    }

    labelsInput.addEventListener("input", render);

    render();
  });
})();
