(() => {
  "use strict";

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "primary", label: "Primary" },
    { key: "square", label: "Square" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    default: { purpose: "A neutral graphite circle with a bordered edge - reads as a secondary corner action on any background." },
    primary: { purpose: "A solid red circle, the strongest visual weight - reserved for the single most important corner action on a page." },
    square: { purpose: "Same neutral coloring as Default, but with a soft rounded-square corner radius instead of a full circle - the variant to reach for when a page's other controls are already rounded-square rather than pill-shaped." }
  };

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  function liveCssFor(typeKey){
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red600 = getCssVar("--red-600", "#CC0215");
    var red400 = getCssVar("--red-400", "#FF3F4F");

    if (typeKey === "primary"){
      return {
        rest: "background:" + red500 + ";color:#FFFFFF;",
        hover: "background:" + red600 + ";",
        focus: "outline:2px solid " + red400 + ";outline-offset:2px;"
      };
    }
    // "default" and "square" share the same coloring - "square" differs only
    // by corner radius, handled by its own CSS class modifier, not a color
    // change, so this function stays the single source of truth both types read from.
    return {
      rest: "background:" + graphite800 + ";color:" + textHi + ";border:1px solid " + lineStrong + ";",
      hover: "background:" + graphite700 + ";",
      focus: "outline:2px solid " + red400 + ";outline-offset:2px;"
    };
  }

  // Icon size (px) per button diameter - roughly 40% of the button, hand-tuned
  // to whole pixels so Copy Code reproduces exactly what the Live Preview
  // matrix is showing, matching the real .floatbutton-demo-btn--h* svg rules.
  var ICON_SIZE = {
    "40": 16,
    "48": 19,
    "56": 22,
    "64": 26
  };

  // Size option list - intentionally a narrow, scoped 4-option range rather
  // than the usual 8-option scale, since float buttons only need a small
  // practical size range (a corner action, not a text-field control).
  var SIZE_OPTIONS = [
    { value: "40", label: "40px - Small" },
    { value: "48", label: "48px - Default" },
    { value: "56", label: "56px - Large" },
    { value: "64", label: "64px - XL" }
  ];
  var FALLBACK_DEFAULTS = { size: "48" };
  var DEFAULT_TOOLTIP = "Back to top";

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
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
    var tooltip = selectionInfo.tooltip || DEFAULT_TOOLTIP;

    var lines = [];
    lines.push("Create a complete Float Button component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, state) - a circular (or rounded-square, for the Square type) icon-only button fixed to a screen corner via CSS position:fixed in real usage (shown inline here for the matrix), used for a persistent, always-accessible primary action like \"back to top\", \"compose\", or \"customer support\" - distinct from a normal inline Button.");
    lines.push("");
    lines.push("Types (3):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Hover: " + css.hover);
      lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
    });
    lines.push("");
    lines.push("States (4): Rest, Hover, Focused, Disabled (40% opacity, not-allowed cursor).");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " The icon scales proportionally with the button, about 40% of its diameter.");
    lines.push("");
    lines.push("Component properties: Tooltip text (text input, default \"" + DEFAULT_TOOLTIP + "\", shown on hover in real usage); Show badge (boolean toggle, default off - shows a small red badge dot in the button's corner, for unread counts or notifications).");
    lines.push("Current tooltip text: \"" + tooltip + "\".");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var tooltip = selectionInfo.tooltip || DEFAULT_TOOLTIP;
    var showBadge = !!selectionInfo.showBadge;

    var lines = [];
    lines.push("/* Agentic Design System - Float Button component */");
    lines.push(".floatbutton-demo-wrap{ display:inline-flex; flex-direction:column; align-items:center; gap:6px; }");
    lines.push(".floatbutton-demo-btn{ box-sizing:border-box; border-radius:9999px; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; position:relative; transition:background-color .15s ease; }");
    lines.push(".floatbutton-demo-btn--square{ border-radius:var(--radius-md); }");
    lines.push(".floatbutton-demo-btn:disabled{ opacity:0.4; cursor:not-allowed; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (diameter in px) - not chosen yet, default is 48 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var iconSize = ICON_SIZE[size];
      lines.push(".floatbutton-demo-btn--h" + size + "{ width:" + size + "px; height:" + size + "px; }");
      lines.push(".floatbutton-demo-btn--h" + size + " svg{ width:" + iconSize + "px; height:" + iconSize + "px; }");
    });
    lines.push("");
    lines.push("/* Types (3) - rest / hover / focus per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".floatbutton-demo-btn--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":focus-visible{ " + css.focus + " }");
    });
    lines.push("");
    lines.push("/* Badge dot - optional, for unread counts or notifications */");
    lines.push(".floatbutton-demo-badge{ position:absolute; top:-2px; right:-2px; width:10px; height:10px; border-radius:9999px; background:var(--danger-500); border:2px solid var(--graphite-950); }");
    lines.push("");
    lines.push("/* Tooltip label - a simple caption near the button, not a floating tooltip bubble */");
    lines.push(".floatbutton-demo-tooltip-label{ font-family:var(--font-body); font-size:11px; color:var(--text-dim); text-align:center; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + " - position:fixed to a screen corner in real usage -->");
    TYPES.forEach(function(t){
      lines.push('<div class="floatbutton-demo-wrap">');
      lines.push('  <button type="button" class="floatbutton-demo-btn floatbutton-demo-btn--' + t.key + ' floatbutton-demo-btn--h' + exampleSize + '" style="position:fixed;bottom:24px;right:24px;">');
      lines.push('    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>');
      if (showBadge) lines.push('    <span class="floatbutton-demo-badge" aria-hidden="true"></span>');
      lines.push('  </button>');
      if (tooltip) lines.push('  <p class="floatbutton-demo-tooltip-label">' + tooltip + '</p>');
      lines.push('</div>');
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size (fully resolved, never "ask
  // the question") - used by the Copy prompt/Copy code dropdown's per-size
  // "Copy" buttons.
  function buildComboPrompt(size, tooltip, showBadge){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      tooltip: tooltip,
      showBadge: showBadge
    });
  }

  function buildComboCode(size, tooltip, showBadge){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      tooltip: tooltip,
      showBadge: showBadge
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

    // Gallery-card copy CTA + click-to-navigate (float-button.html's listing
    // card) - separate data-role from every other system's own copy roles so
    // no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-floatbutton"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-floatbutton"]');
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
    var floatbuttonTypeCards = document.querySelectorAll(".floatbutton-type-card[data-system]");
    floatbuttonTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "float-button-" + card.dataset.system + ".html";
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

    // Renders either a plain Copy prompt/Copy code button (exactly one Size
    // is in play) or, whenever more than one size is currently selected, a
    // disclosure dropdown listing every size by name with its own "Copy" button.
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

    var matrixContainer = document.querySelector('[data-role="floatbutton-matrix-container"]');
    if (!matrixContainer) return;

    var sizeMount = document.querySelector('[data-role="floatbutton-size-mount"]');
    var tooltipInput = document.querySelector('[data-role="floatbutton-tooltip"]');
    var showBadgeInput = document.querySelector('[data-role="floatbutton-show-badge"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildFloatButtonField(typeKey, stateKey, stateCls, size, tooltip, showBadge){
      var isDisabled = stateKey === "disabled";
      var disabledAttr = isDisabled ? " disabled" : "";
      var badgeHtml = showBadge ? '<span class="floatbutton-demo-badge" aria-hidden="true"></span>' : "";
      var btnHtml = '<button type="button" class="floatbutton-demo-btn floatbutton-demo-btn--' + typeKey + ' floatbutton-demo-btn--h' + size + stateCls + '"' + disabledAttr + ">" +
        '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
        badgeHtml +
        "</button>";
      var tooltipHtml = tooltip ? '<p class="floatbutton-demo-tooltip-label">' + escapeHtml(tooltip) + "</p>" : "";
      return '<div class="floatbutton-demo-wrap">' + btnHtml + tooltipHtml + "</div>";
    }

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function buildMatrixSection(size, tooltip, showBadge){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildFloatButtonField(t.key, state.key, state.cls, size, tooltip, showBadge) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + optionLabelFor(SIZE_OPTIONS, size) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        tooltip: tooltipInput ? (tooltipInput.value.trim() || DEFAULT_TOOLTIP) : DEFAULT_TOOLTIP,
        showBadge: !!(showBadgeInput && showBadgeInput.checked)
      };
    }

    function render(){
      var tooltip = tooltipInput ? (tooltipInput.value.trim() || DEFAULT_TOOLTIP) : DEFAULT_TOOLTIP;
      var showBadge = !!(showBadgeInput && showBadgeInput.checked);
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(size, tooltip, showBadge);
        combos.push({ size: size, label: optionLabelFor(SIZE_OPTIONS, size), tooltip: tooltip, showBadge: showBadge });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.tooltip, c.showBadge); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.tooltip, c.showBadge); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "floatbutton-size-dropdown-label",
        onChange: render
      });
    }

    if (tooltipInput){
      tooltipInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (showBadgeInput){
      showBadgeInput.addEventListener("change", render);
    }

    render();
  });
})();
