(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

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
    return v || fallback;
  }

  // Colors are the same regardless of type (Single vs Range) - only the
  // number of thumbs and the fill geometry differ - but the function keeps
  // a typeKey parameter for shape-consistency with the other components'
  // liveCssFor.
  function liveCssFor(typeKey){
    if (typeKey === "primary") return {
      rest: "background:var(--button-primary-bg-default);color:var(--button-primary-text-default);",
      hover: "background:var(--button-primary-bg-hover);color:var(--button-primary-text-hover);",
      pressed: "background:var(--button-primary-bg-active);color:var(--button-primary-text-active);"
    };
    var graphite800 = getCssVar("--graphite-800", "#F1F1EE");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF4253");
    return {
      rest: "background:" + graphite800 + ";",
      hover: "background:" + graphite700 + ";",
      fill: "background:" + red500 + ";",
      thumb: "background:#FFFFFF;border:2px solid " + red500 + ";",
      focus: "outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;"
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
  var FALLBACK_DEFAULTS = { thickness: "6", label: "Volume", value: 60, min: 0, max: 100, step: 1 };
  var RANGE_LOW = 30;
  var RANGE_HIGH = 70;

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  // Clamps to [min, max] and snaps to the nearest valid step above min -
  // used by both the demo Value field and the real "Try it" slider so
  // dragging/clicking/arrow keys can never land on an out-of-range or
  // off-step value.
  function clampToStep(raw, min, max, step){
    var n = parseFloat(raw);
    if (isNaN(n)) n = min;
    if (step > 0) n = min + Math.round((n - min) / step) * step;
    if (n < min) n = min;
    if (n > max) n = max;
    return n;
  }

  function clampValue(raw, min, max){
    var n = parseInt(raw, 10);
    if (isNaN(n)) n = FALLBACK_DEFAULTS.value;
    if (n < min) n = min;
    if (n > max) n = max;
    return n;
  }

  function percentFor(value, min, max){
    if (max === min) return 0;
    var pct = ((value - min) / (max - min)) * 100;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    return pct;
  }

  function formatValue(value, prefix, suffix){
    return (prefix || "") + value + (suffix || "");
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
    lines.push(propertyPromptLine("Track thickness", thicknessInfo, THICKNESS_OPTIONS) + " The track is always a full pill shape - not configurable, since a slider track has no practical use for sharp or partial corners. Thumb shape is configurable (Circle or Rounded square).");
    lines.push("");
    var opts = selectionInfo.opts || {};
    var min = (opts.min === undefined) ? FALLBACK_DEFAULTS.min : opts.min;
    var max = (opts.max === undefined) ? FALLBACK_DEFAULTS.max : opts.max;
    var step = (opts.step === undefined) ? FALLBACK_DEFAULTS.step : opts.step;
    lines.push("Component properties: Label (text input, shown above the track unless hidden), Required (boolean, shows a required indicator after the label when the label is shown - currently " + (opts.required ? "yes" : "no") + "), Value (number, " + min + "-" + max + ", default " + value + " - drives the Single type's fill percentage and thumb position; the Range type uses two fixed example values, 30 and 70, for illustration, since there's only one Value property in this demo), Minimum (" + min + "), Maximum (" + max + "), Step (" + step + " - the thumb snaps to multiples of this above Minimum), Value prefix/suffix (optional text shown beside the displayed value, e.g. a currency symbol or unit), Thumb shape (Circle or Rounded square), Tick marks (boolean - one tick per Step interval along the track), Supporting text (optional helper text below the track).");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var thicknessInfo = selectionInfo.thickness || selectionMode(null, THICKNESS_OPTIONS);
    var label = selectionInfo.label || FALLBACK_DEFAULTS.label;
    var value = (selectionInfo.value === undefined || selectionInfo.value === null) ? FALLBACK_DEFAULTS.value : selectionInfo.value;
    var opts = selectionInfo.opts || {};
    var min = (opts.min === undefined) ? FALLBACK_DEFAULTS.min : opts.min;
    var max = (opts.max === undefined) ? FALLBACK_DEFAULTS.max : opts.max;
    var step = (opts.step === undefined) ? FALLBACK_DEFAULTS.step : opts.step;
    var showLabel = opts.showLabel !== false;
    var showValue = opts.showValue !== false;
    var prefix = opts.prefix || "";
    var suffix = opts.suffix === undefined ? "%" : opts.suffix;
    var thumbShape = opts.thumbShape || "circle";
    var css = liveCssFor("single");
    var pct = percentFor(value, min, max);

    var lines = [];
    lines.push("/* Agentic Design System - Slider component */");
    lines.push(".slider-field{ display:flex; flex-direction:column; gap:var(--space-10); width:var(--dimension-220); }");
    lines.push(".slider-field-top{ display:flex; align-items:baseline; justify-content:space-between; }");
    lines.push('.slider-field-label{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-active-weight); }');
    lines.push('.slider-field-value{ font-family:var(--font-body); font-size:var(--type-body-size); color:var(--text-dim); }');
    lines.push(".slider-track-wrap{ position:relative; padding:var(--space-10) 0; cursor:pointer; }");
    lines.push(".slider-track{ width:100%; border-radius:var(--radius-full); position:relative; overflow:visible; }");
    lines.push(".slider-track-fill{ position:absolute; top:0; bottom:0; border-radius:var(--radius-full); }");
    lines.push(".slider-thumb{ position:absolute; top:50%; width:var(--dimension-16); height:var(--dimension-16); border-radius:var(--radius-full); transform:translate(-50%,-50%); box-shadow:0 1px 3px rgba(0,0,0,0.4); }");
    lines.push(".slider-thumb.is-square{ border-radius:var(--radius-sm); }");
    lines.push(".slider-ticks{ position:absolute; top:50%; left:0; right:0; display:flex; justify-content:space-between; transform:translateY(-50%); pointer-events:none; }");
    lines.push(".slider-tick{ width:2px; height:4px; border-radius:1px; background:rgba(255,255,255,0.4); }");
    lines.push('.slider-field-note{ font-family:var(--font-body); font-size:var(--type-caption-size); color:var(--text-dim); }');
    lines.push(".slider-field-required{ color:var(--danger-500); }");
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
    var requiredHtml = opts.required ? '<span class="slider-field-required" aria-hidden="true"> *</span>' : "";
    lines.push("<!-- Example usage - one per type" + (thicknessInfo.mode === "specific" ? ", at the explicitly chosen track thickness" : "") + " - Min " + min + ", Max " + max + ", Step " + step + " -->");
    lines.push('<div class="slider-field">');
    lines.push('  <div class="slider-field-top">');
    if (showLabel) lines.push('    <p class="slider-field-label">' + escapeHtml(label) + requiredHtml + "</p>");
    if (showValue) lines.push('    <p class="slider-field-value">' + escapeHtml(formatValue(value, prefix, suffix)) + "</p>");
    lines.push("  </div>");
    lines.push('  <div class="slider-track-wrap">');
    lines.push('    <div class="slider-track slider-track--t' + exampleThickness + '">');
    lines.push('      <div class="slider-track-fill" style="left:0;width:' + pct + '%;"></div>');
    if (opts.showTicks) lines.push(tickMarksHtml(min, max, step));
    lines.push('      <div class="slider-thumb' + (thumbShape === "square" ? " is-square" : "") + '" style="left:' + pct + '%;"></div>');
    lines.push("    </div>");
    lines.push("  </div>");
    if (opts.supportingText) lines.push('  <p class="slider-field-note">' + escapeHtml(opts.supportingText) + "</p>");
    lines.push("</div>");
    lines.push("");
    var rangeLowPct = percentFor(RANGE_LOW, min, max), rangeHighPct = percentFor(RANGE_HIGH, min, max);
    lines.push('<div class="slider-field">');
    lines.push('  <div class="slider-field-top">');
    if (showLabel) lines.push('    <p class="slider-field-label">' + escapeHtml(label) + requiredHtml + "</p>");
    if (showValue) lines.push('    <p class="slider-field-value">' + escapeHtml(formatValue(RANGE_LOW, prefix, suffix)) + " - " + escapeHtml(formatValue(RANGE_HIGH, prefix, suffix)) + "</p>");
    lines.push("  </div>");
    lines.push('  <div class="slider-track-wrap">');
    lines.push('    <div class="slider-track slider-track--t' + exampleThickness + '">');
    lines.push('      <div class="slider-track-fill" style="left:' + rangeLowPct + '%;right:' + (100 - rangeHighPct) + '%;"></div>');
    lines.push('      <div class="slider-thumb' + (thumbShape === "square" ? " is-square" : "") + '" style="left:' + rangeLowPct + '%;"></div>');
    lines.push('      <div class="slider-thumb' + (thumbShape === "square" ? " is-square" : "") + '" style="left:' + rangeHighPct + '%;"></div>');
    lines.push("    </div>");
    lines.push("  </div>");
    lines.push("</div>");
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Tick marks - one per Step interval, rendered as plain divs rather than
  // numeric labels (dense sliders with a label per tick get crowded fast;
  // the spec explicitly warns against over-labeling) - out of scope: an
  // independently configurable tick interval different from Step.
  function tickMarksHtml(min, max, step){
    var count = step > 0 ? Math.floor((max - min) / step) + 1 : 2;
    var ticks = "";
    for (var i = 0; i < count; i++){ ticks += '<span class="slider-tick"></span>'; }
    return '      <div class="slider-ticks">' + ticks + "</div>";
  }

  // Builds the prompt/code for exactly ONE Track thickness, fully resolved
  // (never "ask the question") - used by the Copy prompt/Copy code
  // dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(thickness, label, value, opts){
    return buildFullPrompt({
      thickness: { mode: "specific", values: [thickness] },
      label: label,
      value: value,
      opts: opts
    });
  }

  function buildComboCode(thickness, label, value, opts){
    return buildFullCode({
      thickness: { mode: "specific", values: [thickness] },
      label: label,
      value: value,
      opts: opts
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
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
    var minInput = document.querySelector('[data-role="slider-min"]');
    var maxInput = document.querySelector('[data-role="slider-max"]');
    var stepInput = document.querySelector('[data-role="slider-step"]');
    var showLabelInput = document.querySelector('[data-role="slider-show-label"]');
    var requiredInput = document.querySelector('[data-role="slider-required"]');
    var showValueInput = document.querySelector('[data-role="slider-show-value"]');
    var prefixInput = document.querySelector('[data-role="slider-prefix"]');
    var suffixInput = document.querySelector('[data-role="slider-suffix"]');
    var thumbShapeSelect = document.querySelector('[data-role="slider-thumb-shape"]');
    var showTicksInput = document.querySelector('[data-role="slider-show-ticks"]');
    var showSupportingInput = document.querySelector('[data-role="slider-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="slider-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="slider-supporting-text-field"]');
    var interactiveMount = document.querySelector('[data-role="slider-interactive"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function demoTickMarksHtml(min, max, step){
      var count = step > 0 ? Math.floor((max - min) / step) + 1 : 2;
      var ticks = "";
      for (var i = 0; i < count; i++){ ticks += '<span class="slider-demo-tick"></span>'; }
      return '<div class="slider-demo-ticks">' + ticks + "</div>";
    }

    function buildSliderField(typeKey, stateKey, stateCls, thickness, label, value, opts){
      opts = opts || {};
      var isDisabled = stateKey === "disabled";
      var min = (opts.min === undefined) ? FALLBACK_DEFAULTS.min : opts.min;
      var max = (opts.max === undefined) ? FALLBACK_DEFAULTS.max : opts.max;
      var step = (opts.step === undefined) ? FALLBACK_DEFAULTS.step : opts.step;
      var showLabel = opts.showLabel !== false;
      var showValue = opts.showValue !== false;
      var prefix = opts.prefix || "";
      var suffix = opts.suffix === undefined ? "%" : opts.suffix;
      var thumbCls = "slider-demo-thumb" + (opts.thumbShape === "square" ? " is-square" : "");
      var trackStyle = "height:" + thickness + "px;";
      var fillStyle, thumbsHtml, valueText;
      var ticksHtml = opts.showTicks ? demoTickMarksHtml(min, max, step) : "";
      if (typeKey === "range"){
        var lowPct = percentFor(RANGE_LOW, min, max), highPct = percentFor(RANGE_HIGH, min, max);
        fillStyle = "left:" + lowPct + "%;right:" + (100 - highPct) + "%;";
        // left:calc(X% - 8px) instead of left:X%;transform:translate(-50%,-50%)
        // - adapter.js has no concept of CSS transform (only reads
        // position/top/left directly), so the real centering offset the
        // transform applied was silently dropped, leaving the thumb a full
        // half-width/half-height off its intended center in Figma (reported:
        // the thumb sitting low/off-center on the track). 8px is half the
        // thumb's own fixed 16px size (shell.css's .slider-demo-thumb no
        // longer transforms at all, so both axes need this baked in instead).
        thumbsHtml =
          '<div class="' + thumbCls + '" style="left:calc(' + lowPct + '% - 8px);"></div>' +
          '<div class="' + thumbCls + '" style="left:calc(' + highPct + '% - 8px);"></div>';
        valueText = formatValue(RANGE_LOW, prefix, suffix) + " – " + formatValue(RANGE_HIGH, prefix, suffix);
      } else {
        var pct = percentFor(value, min, max);
        fillStyle = "left:0;width:" + pct + "%;";
        thumbsHtml = '<div class="' + thumbCls + '" style="left:calc(' + pct + '% - 8px);"></div>';
        valueText = formatValue(value, prefix, suffix);
      }
      var wrapCls = "slider-demo-track-wrap" + stateCls;
      var disabledAttr = isDisabled ? ' aria-disabled="true"' : "";
      // data-contract-part gives the Figma capture a stable identity for
      // each part, independent of DOM position - same reasoning as
      // checkbox-detail.js's own buildCheckboxCell(). Label/Value share a
      // flex row with an empty-span placeholder when either is hidden, so
      // position alone can't tell them apart reliably once toggled.
      var requiredHtml = opts.required ? '<span class="slider-demo-required" data-contract-part="required" aria-hidden="true"> *</span>' : "";
      var topHtml = (showLabel || showValue)
        ? '<div class="slider-demo-top">' +
            (showLabel ? '<p class="slider-demo-label" data-contract-part="label">' + escapeHtml(label) + requiredHtml + "</p>" : "<span></span>") +
            (showValue ? '<p class="slider-demo-value" data-contract-part="value">' + escapeHtml(valueText) + "</p>" : "") +
          "</div>"
        : "";
      var noteHtml = opts.supportingText ? '<p class="slider-demo-note" data-contract-part="supporting">' + escapeHtml(opts.supportingText) + "</p>" : "";
      return '<div class="slider-demo-field">' +
        topHtml +
        '<div class="' + wrapCls + '"' + disabledAttr + ">" +
          '<div class="slider-demo-track" data-contract-part="track" style="' + trackStyle + '">' +
            '<div class="slider-demo-fill" style="' + fillStyle + '"></div>' +
            ticksHtml +
            thumbsHtml +
          "</div>" +
        "</div>" +
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

    function comboLabel(thickness){
      return optionLabelFor(THICKNESS_OPTIONS, thickness);
    }

    function buildMatrixSection(thickness, label, value, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildSliderField(t.key, state.key, state.cls, thickness, label, value, opts) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(thickness) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentOpts(){
      var min = minInput ? (parseFloat(minInput.value) || FALLBACK_DEFAULTS.min) : FALLBACK_DEFAULTS.min;
      var max = maxInput ? (parseFloat(maxInput.value) || FALLBACK_DEFAULTS.max) : FALLBACK_DEFAULTS.max;
      if (max <= min) max = min + 1;
      var step = stepInput ? Math.max(1, parseFloat(stepInput.value) || FALLBACK_DEFAULTS.step) : FALLBACK_DEFAULTS.step;
      return {
        min: min,
        max: max,
        step: step,
        showLabel: showLabelInput ? showLabelInput.checked : true,
        required: !!(requiredInput && requiredInput.checked),
        showValue: showValueInput ? showValueInput.checked : true,
        prefix: (prefixInput && prefixInput.value) || "",
        suffix: suffixInput ? suffixInput.value : "%",
        thumbShape: thumbShapeSelect ? thumbShapeSelect.value : "circle",
        showTicks: showTicksInput ? showTicksInput.checked : false,
        supportingText: (showSupportingInput && showSupportingInput.checked && supportingTextInput) ? supportingTextInput.value.trim() : ""
      };
    }

    function currentSelectionInfo(){
      var opts = currentOpts();
      return {
        thickness: selectionMode(propertyMultiSelects.thickness, THICKNESS_OPTIONS, [FALLBACK_DEFAULTS.thickness]),
        label: (labelInput && labelInput.value.trim()) || FALLBACK_DEFAULTS.label,
        value: valueInput ? clampValue(valueInput.value, opts.min, opts.max) : FALLBACK_DEFAULTS.value,
        opts: opts
      };
    }

    function render(){
      var opts = currentOpts();
      var label = (labelInput && labelInput.value.trim()) || FALLBACK_DEFAULTS.label;
      var value = valueInput ? clampValue(valueInput.value, opts.min, opts.max) : FALLBACK_DEFAULTS.value;
      var thicknesses = selectedOrDefault(propertyMultiSelects.thickness, THICKNESS_OPTIONS, FALLBACK_DEFAULTS.thickness);

      var html = "";
      var combos = [];
      thicknesses.forEach(function(thickness){
        html += buildMatrixSection(thickness, label, value, opts);
        combos.push({ thickness: thickness, label: comboLabel(thickness), fieldLabel: label, value: value });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.thickness, c.fieldLabel, c.value, opts); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.thickness, c.fieldLabel, c.value, opts); });

      renderInteractive();
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
      labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (valueInput){
      valueInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    [minInput, maxInput, stepInput, prefixInput].forEach(function(el){
      if (el) el.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    });
    [showLabelInput, requiredInput, showValueInput, thumbShapeSelect, showTicksInput].forEach(function(el){
      if (el) el.addEventListener("change", render);
    });
    if (suffixInput) suffixInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (showSupportingInput && supportingTextFieldWrap){
      showSupportingInput.addEventListener("change", function(){
        supportingTextFieldWrap.hidden = !showSupportingInput.checked;
        render();
      });
    }
    if (supportingTextInput) supportingTextInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    // Real, working "Try it" instance: a single-thumb slider you can drag,
    // click the track to jump to a position, or focus and use arrow keys /
    // Home / End. Respects the configured Min, Max, Step, prefix/suffix,
    // thumb shape and tick marks. During a drag, only the fill width, thumb
    // position and value text are mutated directly (not a full innerHTML
    // rebuild) so the drag listeners attached to `document` stay attached
    // to the same nodes for the whole gesture. The Range type's two-thumb
    // drag + crossing behavior is intentionally not built here - see the
    // note in the page copy.
    var interactiveValue = FALLBACK_DEFAULTS.value;

    function setValueFromClientX(clientX, trackEl, opts){
      var rect = trackEl.getBoundingClientRect();
      var ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
      ratio = Math.max(0, Math.min(1, ratio));
      var raw = opts.min + ratio * (opts.max - opts.min);
      interactiveValue = clampToStep(raw, opts.min, opts.max, opts.step);
    }

    function updateInteractiveVisual(opts){
      if (!interactiveMount) return;
      var pct = percentFor(interactiveValue, opts.min, opts.max);
      var valueText = formatValue(interactiveValue, opts.prefix, opts.suffix);
      var fill = interactiveMount.querySelector('[data-role="slider-interactive-fill"]');
      var thumb = interactiveMount.querySelector('[data-role="slider-interactive-thumb"]');
      var valueEl = interactiveMount.querySelector('[data-role="slider-interactive-value"]');
      if (fill) fill.style.width = pct + "%";
      if (thumb){
        thumb.style.left = "calc(" + pct + "% - 8px)";
        thumb.setAttribute("aria-valuenow", String(interactiveValue));
        thumb.setAttribute("aria-valuetext", valueText);
      }
      if (valueEl) valueEl.textContent = valueText;
    }

    function startInteractiveDrag(trackEl, opts){
      function onMove(ev){
        var clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
        setValueFromClientX(clientX, trackEl, opts);
        updateInteractiveVisual(opts);
      }
      function onUp(){
        document.removeEventListener("pointermove", onMove, false);
        document.removeEventListener("pointerup", onUp, false);
      }
      document.addEventListener("pointermove", onMove, false);
      document.addEventListener("pointerup", onUp, false);
    }

    function onInteractiveThumbKeydown(e){
      var opts = currentOpts();
      var handled = true;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") interactiveValue = clampToStep(interactiveValue + opts.step, opts.min, opts.max, opts.step);
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") interactiveValue = clampToStep(interactiveValue - opts.step, opts.min, opts.max, opts.step);
      else if (e.key === "Home") interactiveValue = opts.min;
      else if (e.key === "End") interactiveValue = opts.max;
      else handled = false;
      if (handled){ e.preventDefault(); updateInteractiveVisual(opts); }
    }

    function renderInteractive(){
      if (!interactiveMount) return;
      var opts = currentOpts();
      interactiveValue = clampToStep(interactiveValue, opts.min, opts.max, opts.step);
      var label = (labelInput && labelInput.value.trim()) || FALLBACK_DEFAULTS.label;
      var pct = percentFor(interactiveValue, opts.min, opts.max);
      var valueText = formatValue(interactiveValue, opts.prefix, opts.suffix);
      var thumbCls = "slider-demo-thumb" + (opts.thumbShape === "square" ? " is-square" : "");
      var thickness = selectedOrDefault(propertyMultiSelects.thickness, THICKNESS_OPTIONS, FALLBACK_DEFAULTS.thickness)[0];
      var ticksHtml = opts.showTicks ? demoTickMarksHtml(opts.min, opts.max, opts.step) : "";
      var topHtml = (opts.showLabel || opts.showValue)
        ? '<div class="slider-demo-top">' +
            (opts.showLabel ? '<p class="slider-demo-label">' + escapeHtml(label) + (opts.required ? '<span class="slider-demo-required" aria-hidden="true"> *</span>' : "") + "</p>" : "<span></span>") +
            (opts.showValue ? '<p class="slider-demo-value" data-role="slider-interactive-value">' + escapeHtml(valueText) + "</p>" : "") +
          "</div>"
        : "";
      var noteHtml = opts.supportingText ? '<p class="slider-demo-note">' + escapeHtml(opts.supportingText) + "</p>" : "";
      interactiveMount.innerHTML = '<div class="slider-demo-field" style="width:min(320px, 100%);">' +
        topHtml +
        '<div class="slider-demo-track-wrap" data-role="slider-interactive-wrap">' +
          '<div class="slider-demo-track" data-role="slider-interactive-track" style="height:' + thickness + 'px;">' +
            '<div class="slider-demo-fill" data-role="slider-interactive-fill" style="left:0;width:' + pct + '%;"></div>' +
            ticksHtml +
            '<div class="' + thumbCls + '" data-role="slider-interactive-thumb" tabindex="0" role="slider" aria-label="' + escapeHtml(label) + '" aria-valuemin="' + opts.min + '" aria-valuemax="' + opts.max + '" aria-valuenow="' + interactiveValue + '" aria-valuetext="' + escapeHtml(valueText) + '" style="left:calc(' + pct + '% - 8px);"></div>' +
          "</div>" +
        "</div>" +
        noteHtml +
      "</div>";

      var track = interactiveMount.querySelector('[data-role="slider-interactive-track"]');
      var thumb = interactiveMount.querySelector('[data-role="slider-interactive-thumb"]');
      track.addEventListener("pointerdown", function(e){
        if (e.target === thumb) return;
        var freshOpts = currentOpts();
        setValueFromClientX(e.clientX, track, freshOpts);
        updateInteractiveVisual(freshOpts);
        thumb.focus();
        startInteractiveDrag(track, freshOpts);
      });
      thumb.addEventListener("pointerdown", function(e){
        e.stopPropagation();
        thumb.focus();
        startInteractiveDrag(track, currentOpts());
      });
      thumb.addEventListener("keydown", onInteractiveThumbKeydown);
    }

    render();
  });
})();
