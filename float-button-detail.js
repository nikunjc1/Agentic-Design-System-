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
    { key: "pressed", cls: " is-pressed", label: "Pressed" },
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
    return v || fallback;
  }

  function liveCssFor(typeKey){
    if (typeKey === "primary") return {
      rest: "background:var(--button-primary-bg-default);color:var(--button-primary-text-default);",
      hover: "background:var(--button-primary-bg-hover);color:var(--button-primary-text-hover);",
      pressed: "background:var(--button-primary-bg-active);color:var(--button-primary-text-hover);",
      focus: "outline:2px solid " + getCssVar("--color-focus-ring", "#FF3F4F") + ";outline-offset:2px;"
    };
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textHi = getCssVar("--text-hi", "#111827");
    var graphite800 = getCssVar("--graphite-800", "#F1F1EE");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var graphite850 = getCssVar("--graphite-850", "#FBFBFA");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red600 = getCssVar("--red-600", "#D10215");
    var red400 = getCssVar("--red-400", "#FF4253");

    // "default" and "square" share the same coloring - "square" differs only
    // by corner radius, handled by its own CSS class modifier, not a color
    // change, so this function stays the single source of truth both types read from.
    return {
      rest: "background:" + graphite800 + ";color:" + textHi + ";border:1px solid " + lineStrong + ";",
      hover: "background:" + graphite700 + ";",
      pressed: "background:" + graphite850 + ";",
      focus: "outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;"
    };
  }

  // Icon size (px) per button diameter - roughly 40% of the button, hand-tuned
  // to whole pixels so Copy Code reproduces exactly what the Live Preview
  // matrix is showing, matching the real .floatbutton-demo-btn--h* svg rules.
  var ICON_SIZE = {
    "36": 14,
    "40": 16,
    "44": 18,
    "56": 22,
    "68": 27
  };

  // Size option list - a narrow, scoped 5-option range rather than the usual
  // 8-option scale, since float buttons only need a small practical size
  // range (a corner action, not a text-field control).
  var SIZE_OPTIONS = [
    { value: "36", label: "36px - Small" },
    { value: "40", label: "40px - Default" },
    { value: "44", label: "44px - Large" },
    { value: "56", label: "56px - XL" },
    { value: "68", label: "68px - XXL" }
  ];
  var FALLBACK_DEFAULTS = { size: "40" };
  var DEFAULT_TOOLTIP = "Back to top";
  var DEFAULT_SUPPORTING_TEXT = "Back to top";

  // None/Subtle/Medium/High read from Foundation's own --shadow-* scale
  // (shadows.html) rather than inventing new shadow values - a labeled
  // 4-tier subset of the existing 7-step scale.
  var ELEVATION_SHADOW = {
    none: "var(--shadow-none)",
    subtle: "var(--shadow-xs)",
    medium: "var(--shadow-md)",
    high: "var(--shadow-xl)"
  };
  var ELEVATION_OPTIONS = [
    { value: "none", label: "None" },
    { value: "subtle", label: "Subtle" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];
  var TOOLTIP_PLACEMENTS = ["top", "bottom", "left", "right"];
  var DEFAULT_BADGE_COUNT = 5;
  var DEFAULT_BADGE_MAX = 99;

  // Same overflow rule as the real Badge component (badge-detail.js's
  // displayCount) - kept as its own copy since neither file exports a
  // shared helper, matching how every other per-component detail script
  // in this codebase keeps its own small pure formatting helpers local.
  function displayCount(count, max){
    count = Math.max(0, count);
    max = Math.max(1, max);
    return count > max ? max + "+" : String(count);
  }

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

  function optsOrDefault(opts){
    return opts || {
      elevation: "medium", supportingText: DEFAULT_SUPPORTING_TEXT,
      showTooltip: true, tooltipText: DEFAULT_TOOLTIP, tooltipPlacement: "top",
      showBadge: false, badgeType: "dot", badgeCount: DEFAULT_BADGE_COUNT, badgeMax: DEFAULT_BADGE_MAX
    };
  }

  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var opts = optsOrDefault(selectionInfo.opts);

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
      lines.push("  Pressed: " + css.pressed);
      lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
    });
    lines.push("");
    lines.push("States (5): Rest, Hover, Pressed, Focused, Disabled (40% opacity, not-allowed cursor).");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " The icon scales proportionally with the button, about 40% of its diameter.");
    lines.push("");
    lines.push("Elevation (boxShadow preset: None/Subtle/Medium/High, reusing Foundation's --shadow-* scale) - currently " + optionLabelFor(ELEVATION_OPTIONS, opts.elevation) + ".");
    lines.push("Supporting text (string, shown below the button at all times) - currently \"" + opts.supportingText + "\".");
    lines.push("Tooltip: shown on hover AND keyboard focus, never just hover alone (" + (opts.showTooltip ? "currently shown" : "currently hidden") + "), placement one of Top/Bottom/Left/Right (currently " + opts.tooltipPlacement + "), text currently \"" + opts.tooltipText + "\".");
    lines.push("Badge: optional, positioned in the button's top-right corner (" + (opts.showBadge ? "currently shown" : "currently hidden") + "), type Dot or Count (currently " + opts.badgeType + (opts.badgeType === "count" ? ", count " + opts.badgeCount + " with overflow at " + opts.badgeMax + "+ " : "") + ").");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var opts = optsOrDefault(selectionInfo.opts);

    var lines = [];
    lines.push("/* Agentic Design System - Float Button component */");
    lines.push(".floatbutton-demo-wrap{ display:inline-flex; flex-direction:column; align-items:center; gap:var(--space-6); }");
    lines.push(".floatbutton-demo-btn{ box-sizing:border-box; border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; position:relative; transition:background-color .15s ease; }");
    lines.push(".floatbutton-demo-btn--square{ border-radius:var(--radius-md); }");
    lines.push(".floatbutton-demo-btn:disabled{ opacity:0.4; cursor:not-allowed; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (diameter in px) - not chosen yet, default is " + FALLBACK_DEFAULTS.size + " */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var iconSize = ICON_SIZE[size];
      lines.push(".floatbutton-demo-btn--h" + size + "{ width:" + size + "px; height:" + size + "px; }");
      lines.push(".floatbutton-demo-btn--h" + size + " svg{ width:" + iconSize + "px; height:" + iconSize + "px; }");
    });
    lines.push("");
    lines.push("/* Types (3) - rest / hover / pressed / focus per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".floatbutton-demo-btn--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":active{ " + css.pressed + " }");
      lines.push(cls + ":focus-visible{ " + css.focus + " }");
    });
    lines.push("");
    lines.push("/* Elevation - reuses Foundation's --shadow-* scale, applied via inline box-shadow per instance */");
    lines.push("");
    lines.push("/* Badge - reuses the real Badge component's own classes (badge-demo-badge/-count/-dot in shell.css), overlaid on the button's own position:relative */");
    lines.push("");
    lines.push("/* Tooltip - reuses the real Tooltip component's own classes (tooltip-demo-wrap/-bubble/-arrow in shell.css); shown on hover/focus via .floatbutton-tooltip-trigger-wrap's :hover/:focus-within rule (.is-hover/.is-focus mirror the same look for a static state-comparison render, which can't trigger real hover/focus) */");
    lines.push(".floatbutton-tooltip-trigger-wrap .tooltip-demo-bubble, .floatbutton-tooltip-trigger-wrap .tooltip-demo-arrow{ opacity:0; pointer-events:none; transition:opacity .15s ease; }");
    lines.push(".floatbutton-tooltip-trigger-wrap:hover .tooltip-demo-bubble, .floatbutton-tooltip-trigger-wrap:hover .tooltip-demo-arrow, .floatbutton-tooltip-trigger-wrap:focus-within .tooltip-demo-bubble, .floatbutton-tooltip-trigger-wrap:focus-within .tooltip-demo-arrow, .floatbutton-tooltip-trigger-wrap.is-hover .tooltip-demo-bubble, .floatbutton-tooltip-trigger-wrap.is-hover .tooltip-demo-arrow, .floatbutton-tooltip-trigger-wrap.is-focus .tooltip-demo-bubble, .floatbutton-tooltip-trigger-wrap.is-focus .tooltip-demo-arrow{ opacity:1; pointer-events:auto; }");
    lines.push("");
    lines.push("/* Supporting text - a simple caption shown below the button at all times */");
    lines.push(".floatbutton-demo-tooltip-label{ font-family:var(--font-body); font-size:var(--type-body-size); color:var(--text-dim); text-align:center; max-width:var(--dimension-150); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var elevation = ELEVATION_SHADOW[opts.elevation] || ELEVATION_SHADOW.medium;
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + " - position:fixed to a screen corner in real usage -->");
    TYPES.forEach(function(t){
      var badgeInner = opts.badgeType === "count" ? '<span class="badge-demo-count">' + displayCount(opts.badgeCount, opts.badgeMax) + "</span>" : '<span class="badge-demo-dot"></span>';
      var badgeHtml = opts.showBadge ? '    <span class="badge-demo-badge badge-demo-badge--default">' + badgeInner + "</span>\n" : "";
      var btnHtml = '  <button type="button" class="floatbutton-demo-btn floatbutton-demo-btn--' + t.key + ' floatbutton-demo-btn--h' + exampleSize + '" style="position:fixed;bottom:24px;right:24px;box-shadow:' + elevation + ';">\n' +
        '    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>\n' +
        badgeHtml + "  </button>";
      lines.push('<div class="floatbutton-demo-wrap">');
      if (opts.showTooltip){
        lines.push('  <div class="tooltip-demo-wrap tooltip-demo-wrap--' + opts.tooltipPlacement + ' floatbutton-tooltip-trigger-wrap">');
        lines.push('    <div class="tooltip-demo-bubble tooltip-demo-bubble--default" style="padding:6px 10px;font-size:var(--type-caption-size);">' + opts.tooltipText + '</div>');
        lines.push('    <div class="tooltip-demo-arrow" aria-hidden="true"></div>');
        lines.push(btnHtml);
        lines.push('  </div>');
      } else {
        lines.push(btnHtml);
      }
      if (opts.supportingText) lines.push('  <p class="floatbutton-demo-tooltip-label">' + opts.supportingText + '</p>');
      lines.push('</div>');
    });
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Builds the prompt/code for exactly ONE Size (fully resolved, never "ask
  // the question") - used by the Copy prompt/Copy code dropdown's per-size
  // "Copy" buttons.
  function buildComboPrompt(size, tooltip, showBadge, opts){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      opts: opts
    });
  }

  function buildComboCode(size, tooltip, showBadge, opts){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      opts: opts
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
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
        if (e.target.closest("button, input, select, textarea, a, [role=combobox]")) return; window.ADSNavigation ? window.ADSNavigation.go(href) : (location.href = href); });
      card.addEventListener("keydown", function(e){
        if (e.target !== card) return;
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.ADSNavigation ? window.ADSNavigation.go(href) : (location.href = href);
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
    var elevationSelect = document.querySelector('[data-role="floatbutton-elevation-select"]');
    var supportingTextInput = document.querySelector('[data-role="floatbutton-supporting-text"]');
    var showTooltipInput = document.querySelector('[data-role="floatbutton-show-tooltip"]');
    var tooltipTextInput = document.querySelector('[data-role="floatbutton-tooltip-text"]');
    var tooltipPlacementSelect = document.querySelector('[data-role="floatbutton-tooltip-placement"]');
    var showBadgeInput = document.querySelector('[data-role="floatbutton-show-badge"]');
    var badgeTypeSelect = document.querySelector('[data-role="floatbutton-badge-type"]');
    var badgeCountInput = document.querySelector('[data-role="floatbutton-badge-count"]');
    var badgeMaxInput = document.querySelector('[data-role="floatbutton-badge-max"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    // Badge and Tooltip are composed from the real Badge/Tooltip components'
    // own CSS classes (badge-demo-*/tooltip-demo-* in shell.css) instead of
    // a bespoke red-dot/static-caption reimplementation, so a corner badge
    // or hover tooltip on a Float Button looks and (for the tooltip) behaves
    // exactly like the standalone Badge/Tooltip components do. Visibility
    // for the tooltip bubble+arrow is real hover/focus-triggered CSS, scoped
    // to .floatbutton-tooltip-trigger-wrap (see shell.css) so it doesn't
    // touch Tooltip's own always-visible comparison-matrix demo.
    function buildFloatButtonField(typeKey, stateKey, stateCls, size, opts){
      var isDisabled = stateKey === "disabled";
      var disabledAttr = isDisabled ? " disabled" : "";
      var badgeHtml = "";
      if (opts.showBadge){
        var badgeInner = opts.badgeType === "count"
          ? '<span class="badge-demo-count">' + escapeHtml(displayCount(opts.badgeCount, opts.badgeMax)) + "</span>"
          : '<span class="badge-demo-dot"></span>';
        badgeHtml = '<span class="badge-demo-badge badge-demo-badge--default" aria-hidden="true">' + badgeInner + "</span>";
      }
      var elevation = ELEVATION_SHADOW[opts.elevation] || ELEVATION_SHADOW.medium;
      // Foundation audit UX10 - one cell of a side-by-side state comparison,
      // not a real float button; tabindex="-1" keeps it out of the Tab
      // sequence without removing it from the accessibility tree. It had no
      // accessible name at all (icon-only, no aria-label), so added one too.
      var btnHtml = '<button type="button" class="floatbutton-demo-btn floatbutton-demo-btn--' + typeKey + ' floatbutton-demo-btn--h' + size + stateCls + '" style="box-shadow:' + elevation + ';" tabindex="-1" aria-label="' + typeKey + ' float button, ' + stateKey + ' state"' + disabledAttr + ">" +
        '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
        badgeHtml +
        "</button>";
      var triggerHtml = btnHtml;
      if (opts.showTooltip){
        var bubbleHtml = '<div class="tooltip-demo-bubble tooltip-demo-bubble--default" data-contract-part="bubble" style="padding:6px 10px;font-size:var(--type-caption-size);">' + escapeHtml(opts.tooltipText) + "</div>";
        var arrowHtml = '<div class="tooltip-demo-arrow" data-contract-part="arrow" aria-hidden="true"></div>';
        // Hover/Focused are STATIC rows (no real mouse/keyboard interaction
        // ever happens), so the trigger-wrap also needs stateCls applied
        // (same class each row already puts on the button itself) for the
        // .is-hover/.is-focus CSS below to reveal the tooltip on exactly
        // those two rows - the real :hover/:focus-within rule alone can
        // never match a static render.
        triggerHtml = '<div class="tooltip-demo-wrap tooltip-demo-wrap--' + opts.tooltipPlacement + ' floatbutton-tooltip-trigger-wrap' + stateCls + '">' + bubbleHtml + arrowHtml + btnHtml + "</div>";
      }
      var supportingHtml = opts.supportingText ? '<p class="floatbutton-demo-tooltip-label">' + escapeHtml(opts.supportingText) + "</p>" : "";
      return '<div class="floatbutton-demo-wrap">' + triggerHtml + supportingHtml + "</div>";
    }

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function buildMatrixSection(size, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildFloatButtonField(t.key, state.key, state.cls, size, opts) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + optionLabelFor(SIZE_OPTIONS, size) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentOpts(){
      return {
        elevation: elevationSelect ? elevationSelect.value : "medium",
        supportingText: supportingTextInput ? supportingTextInput.value.trim() : DEFAULT_SUPPORTING_TEXT,
        showTooltip: !!(showTooltipInput && showTooltipInput.checked),
        tooltipText: tooltipTextInput ? (tooltipTextInput.value.trim() || DEFAULT_TOOLTIP) : DEFAULT_TOOLTIP,
        tooltipPlacement: tooltipPlacementSelect && TOOLTIP_PLACEMENTS.indexOf(tooltipPlacementSelect.value) !== -1 ? tooltipPlacementSelect.value : "top",
        showBadge: !!(showBadgeInput && showBadgeInput.checked),
        badgeType: badgeTypeSelect && badgeTypeSelect.value === "count" ? "count" : "dot",
        badgeCount: badgeCountInput ? (parseInt(badgeCountInput.value, 10) || 0) : DEFAULT_BADGE_COUNT,
        badgeMax: badgeMaxInput ? (parseInt(badgeMaxInput.value, 10) || DEFAULT_BADGE_MAX) : DEFAULT_BADGE_MAX
      };
    }

    function currentSelectionInfo(){
      var opts = currentOpts();
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        tooltip: opts.supportingText,
        showBadge: opts.showBadge,
        opts: opts
      };
    }

    function render(){
      var opts = currentOpts();
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(size, opts);
        combos.push({ size: size, label: optionLabelFor(SIZE_OPTIONS, size), tooltip: opts.supportingText, showBadge: opts.showBadge, opts: opts });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.tooltip, c.showBadge, c.opts); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.tooltip, c.showBadge, c.opts); });
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

    if (elevationSelect) elevationSelect.addEventListener("change", render);
    if (supportingTextInput) supportingTextInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (showTooltipInput) showTooltipInput.addEventListener("change", render);
    if (tooltipTextInput) tooltipTextInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (tooltipPlacementSelect) tooltipPlacementSelect.addEventListener("change", render);
    if (showBadgeInput) showBadgeInput.addEventListener("change", render);
    if (badgeTypeSelect) badgeTypeSelect.addEventListener("change", render);
    if (badgeCountInput) badgeCountInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (badgeMaxInput) badgeMaxInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    render();
  });
})();
