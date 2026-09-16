(() => {
  "use strict";

  var TYPES = [
    { key: "single", label: "Single" },
    { key: "range", label: "Range" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    single: { purpose: "One thumb represents a single value along the track - drag it to set a number, like a volume level." },
    range: { purpose: "Two thumbs mark a selected span between a lower and upper bound - drag either thumb to narrow or widen the range, like a price filter." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Colors are the same regardless of type (Single vs Range) - only the
  // number of thumbs and the fill geometry differ - but the function keeps
  // a typeKey parameter for shape-consistency with the other components'
  // liveCssFor.
  function liveCssFor(typeKey){
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    return {
      rest: "background:" + graphite800 + ";",
      hover: "background:" + graphite700 + ";",
      fill: "background:" + red500 + ";",
      thumb: "background:#FFFFFF;border:2px solid " + red500 + ";",
      focus: "outline:2px solid " + red400 + ";outline-offset:2px;"
    };
  }

  // Track thickness option list - a smaller, simpler scale than the usual
  // 8-option Size system used elsewhere, since a slider track's thickness
  // range is naturally much narrower than a button's height range.
  var THICKNESS_OPTIONS = [
    { value: "4", label: "4px - Thin" },
    { value: "6", label: "6px - Default" },
    { value: "8", label: "8px - Bold" },
    { value: "10", label: "10px - Heavy" }
  ];
  var FALLBACK_DEFAULTS = { thickness: "6", label: "Volume", value: 60 };
  var RANGE_LOW = 30;
  var RANGE_HIGH = 70;

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function clampValue(raw){
    var n = parseInt(raw, 10);
    if (isNaN(n)) n = FALLBACK_DEFAULTS.value;
    if (n < 0) n = 0;
    if (n > 100) n = 100;
    return n;
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
    var thicknessInfo = selectionInfo.thickness || selectionMode(null, THICKNESS_OPTIONS);
    var label = selectionInfo.label || FALLBACK_DEFAULTS.label;
    var value = (selectionInfo.value === undefined || selectionInfo.value === null) ? FALLBACK_DEFAULTS.value : selectionInfo.value;

    var lines = [];
    lines.push("Create a complete Slider component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, track thickness, state) - a draggable track with one thumb (Single) or two thumbs (Range) for picking a numeric value or a range of two values.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Hover: " + css.hover);
      lines.push("  Fill (progress from the track's start" + (t.key === "range" ? ", or between the two thumbs for Range" : "") + "): " + css.fill);
      lines.push("  Thumb: " + css.thumb);
      lines.push("  Focused (ring applies to the thumb, not the track): " + css.focus);
    });
    lines.push("");
    lines.push("States (4, apply to the whole control): Rest, Hover, Focused, Disabled.");
    lines.push("- Focused shows a focus ring on the thumb specifically, never the track, and never just a color change, so layout never shifts.");
    lines.push("- Disabled applies to the whole control at once (40% opacity, not-allowed cursor) - the thumb keeps its shape.");
    lines.push("");
    lines.push(propertyPromptLine("Track thickness", thicknessInfo, THICKNESS_OPTIONS) + " Corner radius is always a full pill on both the track and the thumb - not configurable, since a slider track has no practical use for sharp or partial corners.");
    lines.push("");
    lines.push("Component properties: Label (text input, default \"Volume\"); Value (number, 0-100, default 60 - drives the Single type's fill percentage and thumb position; the Range type uses two fixed example values, 30 and 70, for illustration, since there's only one Value property in this demo).");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var thicknessInfo = selectionInfo.thickness || selectionMode(null, THICKNESS_OPTIONS);
    var label = selectionInfo.label || FALLBACK_DEFAULTS.label;
    var value = (selectionInfo.value === undefined || selectionInfo.value === null) ? FALLBACK_DEFAULTS.value : selectionInfo.value;
    var css = liveCssFor("single");

    var lines = [];
    lines.push("/* Agentic Design System - Slider component */");
    lines.push(".slider-field{ display:flex; flex-direction:column; gap:10px; width:220px; }");
    lines.push('.slider-field-label{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:13px; font-weight:500; }');
    lines.push(".slider-track-wrap{ position:relative; padding:10px 0; cursor:pointer; }");
    lines.push(".slider-track{ width:100%; border-radius:9999px; position:relative; overflow:visible; }");
    lines.push(".slider-track-fill{ position:absolute; top:0; bottom:0; border-radius:9999px; }");
    lines.push(".slider-thumb{ position:absolute; top:50%; width:16px; height:16px; border-radius:9999px; transform:translate(-50%,-50%); box-shadow:0 1px 3px rgba(0,0,0,0.4); }");
    lines.push("");
    var thicknessesToEmit = thicknessInfo.mode === "all" ? THICKNESS_OPTIONS.map(function(o){ return o.value; }) : thicknessInfo.values;
    lines.push(thicknessInfo.mode === "all"
      ? "/* Track thickness scale (px) - not chosen yet, default is 6 */"
      : "/* Track thickness - explicitly chosen: " + thicknessInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    thicknessesToEmit.forEach(function(t){
      lines.push(".slider-track--t" + t + "{ height:" + t + "px; }");
    });
    lines.push("");
    lines.push("/* Rest / Hover / Fill / Thumb / Focus - shared by both types */");
    lines.push(".slider-track{ " + css.rest + " }");
    lines.push(".slider-track-wrap:hover .slider-track, .slider-track-wrap.is-hover .slider-track{ " + css.hover + " }");
    lines.push(".slider-track-fill{ " + css.fill + " }");
    lines.push(".slider-thumb{ " + css.thumb + " }");
    lines.push(".slider-track-wrap:focus-within .slider-thumb, .slider-track-wrap.is-focus .slider-thumb{ " + css.focus + " }");
    lines.push("");
    lines.push("/* Disabled - whole control, thumb keeps its shape */");
    lines.push(".slider-track-wrap.is-disabled, .slider-track-wrap:has(:disabled){ opacity:0.4; cursor:not-allowed; }");
    lines.push("");
    var exampleThickness = thicknessInfo.mode === "all" ? FALLBACK_DEFAULTS.thickness : thicknessInfo.values[0];
    lines.push("<!-- Example usage - one per type" + (thicknessInfo.mode === "specific" ? ", at the explicitly chosen track thickness" : "") + " -->");
    lines.push('<div class="slider-field">');
    lines.push('  <p class="slider-field-label">' + label + "</p>");
    lines.push('  <div class="slider-track-wrap">');
    lines.push('    <div class="slider-track slider-track--t' + exampleThickness + '">');
    lines.push('      <div class="slider-track-fill" style="left:0;width:' + value + '%;"></div>');
    lines.push('      <div class="slider-thumb" style="left:' + value + '%;"></div>');
    lines.push("    </div>");
    lines.push("  </div>");
    lines.push("</div>");
    lines.push("");
    lines.push('<div class="slider-field">');
    lines.push('  <p class="slider-field-label">' + label + "</p>");
    lines.push('  <div class="slider-track-wrap">');
    lines.push('    <div class="slider-track slider-track--t' + exampleThickness + '">');
    lines.push('      <div class="slider-track-fill" style="left:' + RANGE_LOW + '%;right:' + (100 - RANGE_HIGH) + '%;"></div>');
    lines.push('      <div class="slider-thumb" style="left:' + RANGE_LOW + '%;"></div>');
    lines.push('      <div class="slider-thumb" style="left:' + RANGE_HIGH + '%;"></div>');
    lines.push("    </div>");
    lines.push("  </div>");
    lines.push("</div>");
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Track thickness, fully resolved
  // (never "ask the question") - used by the Copy prompt/Copy code
  // dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(thickness, label, value){
    return buildFullPrompt({
      thickness: { mode: "specific", values: [thickness] },
      label: label,
      value: value
    });
  }

  function buildComboCode(thickness, label, value){
    return buildFullCode({
      thickness: { mode: "specific", values: [thickness] },
      label: label,
      value: value
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

    // Gallery-card copy CTA + click-to-navigate (slider.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-slider"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-slider"]');
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
    var sliderTypeCards = document.querySelectorAll(".slider-type-card[data-system]");
    sliderTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "slider-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button (exactly one
    // Track thickness is in play) or, whenever more than one thickness is
    // currently selected, a disclosure dropdown listing every combination
    // by name with its own "Copy" button.
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

    var matrixContainer = document.querySelector('[data-role="slider-matrix-container"]');
    if (!matrixContainer) return;

    var thicknessMount = document.querySelector('[data-role="slider-size-mount"]');
    var labelInput = document.querySelector('[data-role="slider-label"]');
    var valueInput = document.querySelector('[data-role="slider-value"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildSliderField(typeKey, stateKey, stateCls, thickness, label, value){
      var isDisabled = stateKey === "disabled";
      var trackStyle = "height:" + thickness + "px;";
      var fillStyle, thumbsHtml;
      if (typeKey === "range"){
        fillStyle = "left:" + RANGE_LOW + "%;right:" + (100 - RANGE_HIGH) + "%;";
        thumbsHtml =
          '<div class="slider-demo-thumb" style="left:' + RANGE_LOW + '%;"></div>' +
          '<div class="slider-demo-thumb" style="left:' + RANGE_HIGH + '%;"></div>';
      } else {
        fillStyle = "left:0;width:" + value + "%;";
        thumbsHtml = '<div class="slider-demo-thumb" style="left:' + value + '%;"></div>';
      }
      var wrapCls = "slider-demo-track-wrap" + stateCls;
      var disabledAttr = isDisabled ? ' aria-disabled="true"' : "";
      return '<div class="slider-demo-field">' +
        '<p class="slider-demo-label">' + label + "</p>" +
        '<div class="' + wrapCls + '"' + disabledAttr + ">" +
          '<div class="slider-demo-track" style="' + trackStyle + '">' +
            '<div class="slider-demo-fill" style="' + fillStyle + '"></div>' +
            thumbsHtml +
          "</div>" +
        "</div>" +
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

    function comboLabel(thickness){
      return optionLabelFor(THICKNESS_OPTIONS, thickness);
    }

    function buildMatrixSection(thickness, label, value){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildSliderField(t.key, state.key, state.cls, thickness, label, value) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(thickness) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        thickness: selectionMode(propertyMultiSelects.thickness, THICKNESS_OPTIONS, [FALLBACK_DEFAULTS.thickness]),
        label: (labelInput && labelInput.value.trim()) || FALLBACK_DEFAULTS.label,
        value: valueInput ? clampValue(valueInput.value) : FALLBACK_DEFAULTS.value
      };
    }

    function render(){
      var label = (labelInput && labelInput.value.trim()) || FALLBACK_DEFAULTS.label;
      var value = valueInput ? clampValue(valueInput.value) : FALLBACK_DEFAULTS.value;
      var thicknesses = selectedOrDefault(propertyMultiSelects.thickness, THICKNESS_OPTIONS, FALLBACK_DEFAULTS.thickness);

      var html = "";
      var combos = [];
      thicknesses.forEach(function(thickness){
        html += buildMatrixSection(thickness, label, value);
        combos.push({ thickness: thickness, label: comboLabel(thickness), fieldLabel: label, value: value });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.thickness, c.fieldLabel, c.value); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.thickness, c.fieldLabel, c.value); });
    }

    var propertyMultiSelects = {};
    if (thicknessMount && window.createMultiSelect){
      propertyMultiSelects.thickness = window.createMultiSelect({
        root: thicknessMount,
        options: THICKNESS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.thickness],
        ariaLabel: "Track thickness options",
        labelledBy: "slider-size-dropdown-label",
        onChange: render
      });
    }

    if (labelInput){
      labelInput.addEventListener("input", render);
    }
    if (valueInput){
      valueInput.addEventListener("input", render);
    }

    render();
  });
})();
