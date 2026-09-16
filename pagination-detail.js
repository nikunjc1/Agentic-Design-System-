(() => {
  "use strict";

  var TYPES = [
    { key: "numbered", label: "Numbered" },
    { key: "simple", label: "Simple" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    numbered: { purpose: "Prev arrow, a row of page-number buttons and a Next arrow - lets the user jump straight to a nearby page, not just step through one at a time." },
    simple: { purpose: "Just a Prev arrow, a \"Page X of Y\" text label and a Next arrow - a compact control for when individual page numbers aren't needed." }
  };

  var PREV_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
  var NEXT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  function liveCssFor(){
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var textMid = getCssVar("--text-mid", "#A7ABB2");
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");

    return {
      rest: "background:transparent;color:" + textHi + ";border:1px solid " + lineStrong + ";",
      hover: "background:" + graphite800 + ";",
      current: "background:" + red500 + ";color:#FFFFFF;border-color:" + red500 + ";",
      focus: "outline:2px solid " + red400 + ";outline-offset:2px;",
      count: "color:" + textMid + ";"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .pagination-demo-item--h*/.pagination-demo-arrow--h* rules in
  // shell.css (not re-derived by formula) so Copy Code reproduces exactly
  // what the Live Preview matrix is showing, at every size, not just the
  // one size a formula happens to agree with.
  var SIZE_SCALE = {
    "24": { pad: 8, font: 11 },
    "28": { pad: 10, font: 12 },
    "32": { pad: 10, font: 12 },
    "36": { pad: 12, font: 13 },
    "40": { pad: 14, font: 14 },
    "44": { pad: 16, font: 15 },
    "48": { pad: 18, font: 16 },
    "56": { pad: 20, font: 17 }
  };

  // Size / Corner radius option lists - same value scale as the other
  // systems, shared between the page's own multi-select dropdowns and the
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
    var css = liveCssFor();

    var lines = [];
    lines.push("Create a complete Pagination component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - a row of page-navigation controls with one page always shown as current, not separate one-off buttons glued together.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("Shared visual treatment (Numbered page-number buttons and the Simple type's Prev arrow):");
    lines.push("  Rest: " + css.rest);
    lines.push("  Hover: " + css.hover);
    lines.push("  Current page: " + css.current);
    lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
    lines.push("  \"Page X of Y\" count text (Simple type): " + css.count);
    lines.push("");
    lines.push("States (4, apply per button): Rest, Hover, Focused, Disabled.");
    lines.push("- For the Numbered type, the current page (always the middle of the 5 numbered buttons in this reference) stays a solid filled state regardless of row/state being demonstrated on other buttons.");
    lines.push("- For the Simple type, there are no individual page-number buttons, so states apply to the Prev arrow button instead.");
    lines.push("- Disabled means the target button is a real disabled control (40% opacity, not-allowed cursor), not just a visual style.");
    lines.push("");
    lines.push("Use a left-chevron arrow icon for Prev and the same icon mirrored horizontally for Next (both real <svg>, stroke-based, 24x24 viewBox, currentColor).");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Controls the height of every arrow/page button; padding and font-size scale proportionally.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to each individual arrow/page button.");
    lines.push("");
    lines.push("Component properties: Size, Corner radius. Page numbers/count shown are illustrative reference content, not a configurable property.");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var css = liveCssFor();

    var lines = [];
    lines.push("/* Agentic Design System - Pagination component */");
    lines.push("/* Page numbers/count shown are illustrative reference content, not a configurable property. */");
    lines.push(".pagination-demo-bar{ display:inline-flex; align-items:center; gap:6px; box-sizing:border-box; }");
    lines.push('.pagination-demo-item, .pagination-demo-arrow{ box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-weight:500; cursor:pointer; transition:background-color .15s ease, border-color .15s ease, color .15s ease; ' + css.rest + ' }');
    lines.push(".pagination-demo-arrow svg{ width:16px; height:16px; }");
    lines.push(".pagination-demo-item:hover, .pagination-demo-arrow:hover{ " + css.hover + " }");
    lines.push(".pagination-demo-item:focus-visible, .pagination-demo-arrow:focus-visible{ " + css.focus + " }");
    lines.push(".pagination-demo-item:disabled, .pagination-demo-arrow:disabled{ cursor:not-allowed; opacity:0.4; }");
    lines.push(".pagination-demo-item.is-current{ " + css.current + " }");
    lines.push(".pagination-demo-count{ " + css.count + " font-family:\"Inter\",ui-sans-serif,system-ui,sans-serif; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".pagination-demo-item--h" + size + ", .pagination-demo-arrow--h" + size + "{ height:" + size + "px; min-width:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 8px - applied to each button individually */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applied to each button individually */");
    radiiToEmit.forEach(function(radius){
      lines.push(".pagination--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var exampleRadiusCls = "pagination--radius-" + radiusClassSuffix(exampleRadius);
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    lines.push('<nav class="pagination-demo-bar" aria-label="Pagination">');
    lines.push('  <button type="button" class="pagination-demo-arrow pagination-demo-arrow--h' + exampleSize + " " + exampleRadiusCls + '">' + PREV_SVG + "</button>");
    [1, 2, 3, 4, 5].forEach(function(n){
      var currentCls = n === 3 ? " is-current" : "";
      lines.push('  <button type="button" class="pagination-demo-item pagination-demo-item--h' + exampleSize + " " + exampleRadiusCls + currentCls + '">' + n + "</button>");
    });
    lines.push('  <button type="button" class="pagination-demo-arrow pagination-demo-arrow--h' + exampleSize + " " + exampleRadiusCls + '">' + NEXT_SVG + "</button>");
    lines.push("</nav>");
    lines.push("");
    lines.push('<nav class="pagination-demo-bar pagination-demo-bar--simple" aria-label="Pagination">');
    lines.push('  <button type="button" class="pagination-demo-arrow pagination-demo-arrow--h' + exampleSize + " " + exampleRadiusCls + '">' + PREV_SVG + "</button>");
    lines.push('  <span class="pagination-demo-count">Page 3 of 12</span>');
    lines.push('  <button type="button" class="pagination-demo-arrow pagination-demo-arrow--h' + exampleSize + " " + exampleRadiusCls + '">' + NEXT_SVG + "</button>");
    lines.push("</nav>");
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

    // Gallery-card copy CTA + click-to-navigate (pagination.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-pagination"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-pagination"]');
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
    var paginationTypeCards = document.querySelectorAll(".pagination-type-card[data-system]");
    paginationTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "pagination-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="pagination-matrix-container"]');
    if (!matrixContainer) return;

    var sizeMount = document.querySelector('[data-role="pagination-size-mount"]');
    var radiusMount = document.querySelector('[data-role="pagination-radius-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildPaginationBar(typeKey, stateKey, stateCls, size, radius){
      var isDisabled = stateKey === "disabled";
      var disabledAttr = isDisabled ? " disabled" : "";
      var radiusCls = "pagination--radius-" + radiusClassSuffix(radius);

      if (typeKey === "simple"){
        var prevCls = "pagination-demo-arrow pagination-demo-arrow--h" + size + " " + radiusCls + stateCls;
        var nextCls = "pagination-demo-arrow pagination-demo-arrow--h" + size + " " + radiusCls;
        return '<nav class="pagination-demo-bar pagination-demo-bar--simple" aria-label="Pagination">' +
          '<button type="button" class="' + prevCls + '"' + disabledAttr + ">" + PREV_SVG + "</button>" +
          '<span class="pagination-demo-count">Page 3 of 12</span>' +
          '<button type="button" class="' + nextCls + '">' + NEXT_SVG + "</button>" +
          "</nav>";
      }

      var prevArrowCls = "pagination-demo-arrow pagination-demo-arrow--h" + size + " " + radiusCls + stateCls;
      var items = [1, 2, 3, 4, 5].map(function(n){
        var isCurrent = n === 3;
        var itemStateCls = !isCurrent ? stateCls : "";
        var itemDisabledAttr = !isCurrent && isDisabled ? " disabled" : "";
        var currentCls = isCurrent ? " is-current" : "";
        return '<button type="button" class="pagination-demo-item pagination-demo-item--h' + size + " " + radiusCls + currentCls + itemStateCls + '"' + itemDisabledAttr + ">" + n + "</button>";
      }).join("");
      var nextArrowCls = "pagination-demo-arrow pagination-demo-arrow--h" + size + " " + radiusCls;
      return '<nav class="pagination-demo-bar" aria-label="Pagination">' +
        '<button type="button" class="' + prevArrowCls + '"' + disabledAttr + ">" + PREV_SVG + "</button>" +
        items +
        '<button type="button" class="' + nextArrowCls + '">' + NEXT_SVG + "</button>" +
        "</nav>";
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

    function buildMatrixSection(size, radius){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildPaginationBar(t.key, state.key, state.cls, size, radius) + "</td>";
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
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius);
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
        labelledBy: "pagination-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "pagination-radius-dropdown-label",
        onChange: render
      });
    }

    render();
  });
})();
