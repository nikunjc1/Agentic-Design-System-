(() => {
  "use strict";

  var TYPES = [
    { key: "outlined", label: "Outlined" },
    { key: "filled", label: "Filled" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "pressed", cls: " is-pressed", label: "Pressed" },
    { key: "selected", cls: " is-selected", label: "Selected" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    outlined: { purpose: "A bordered track with a divider between each segment - reads clearly on any background, no extra chrome besides the outline." },
    filled: { purpose: "A solid track where the selected segment gets its own pill highlight - useful when the group needs to stand out as one cohesive control." }
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
      pressed: "background:var(--button-primary-bg-active);color:var(--button-primary-text-active);"
    };
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textHi = getCssVar("--text-hi", "#111827");
    var textMid = getCssVar("--text-mid", "#4B5563");
    var graphite800 = getCssVar("--graphite-800", "#F1F1EE");
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var graphite600 = getCssVar("--graphite-600", "#383D44");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF4253");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.08)");

    if (typeKey === "outlined"){
      return {
        rest: "background:transparent;color:" + textHi + ";border-inline-end:var(--border-width-1) var(--border-style) " + lineStrong + ";",
        hover: "background:" + graphite800 + ";",
        pressed: "background:" + graphite700 + ";",
        selected: "background:" + redTint + ";color:" + red500 + ";",
        focus: "outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:-3px;"
      };
    }
    return {
      rest: "background:transparent;color:" + textMid + ";",
      hover: "background:" + graphite700 + ";color:" + textHi + ";",
      pressed: "background:" + graphite600 + ";",
      selected: "background:" + red500 + ";color:var(--on-brand-text);",
      // Inset, not outward - a positive offset gets clipped by the track's
      // own overflow:hidden, cutting the ring into a lopsided arc at the
      // first/last segment instead of a clean rectangle (matches the fix
      // already used by the Outlined type above).
      focus: "outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:-3px;"
    };
  }

  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .group-btn-segment--h* rules in shell.css (not re-derived by
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

  // Size / Corner radius option lists - same value scale as the Button and
  // Input systems, shared between the page's own multi-select dropdowns and
  // the Copy Prompt/Copy Code generators below.
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
  // Default labels before a person types their own - one consistent lettered
  // sequence (Option A, B, C...) covering the full 2-9 range the dropdown
  // offers. Unlike the matrix's own Size/Radius, each button's label is
  // individually editable (see the per-button labels editor below), so this
  // is only ever a seed, not the live source of truth once edited.
  var LABEL_POOL = ["Option A", "Option B", "Option C", "Option D", "Option E", "Option F", "Option G", "Option H", "Option I"];
  var DEFAULT_LABELS = LABEL_POOL.slice(0, 3);
  var DEFAULT_COUNT = 3;
  var MIN_COUNT = 2, MAX_COUNT = 9;

  function labelsForCount(count){
    return LABEL_POOL.slice(0, count);
  }

  // Icon size (px) per segment height - roughly 40% of the row, the same
  // hand-tuned scale Button uses for its own icon-bearing content, since
  // Group Button segments share the identical SIZE_SCALE height/padding/
  // font-size values.
  var ICON_SIZE_BY_HEIGHT = { "24": 12, "28": 14, "32": 14, "36": 16, "40": 16, "44": 18, "48": 20, "56": 22 };
  var ICONS = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15z"/>',
    star: '<path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7-5.4-4.7 7.1-.6z" stroke-linejoin="round"/>',
    check: '<path d="M4 12.5l5 5 11-11" stroke-linejoin="round" stroke-linecap="round"/>'
  };
  var ICON_OPTIONS = ["plus", "arrow", "gear", "star", "check"];
  function iconSvg(key, size){
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' + (ICONS[key] || ICONS.plus) + "</svg>";
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
    lines.push("Create a complete Group Button (segmented control) component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, radius, state) - a row of joined segments where exactly one is selected at a time, not separate one-off buttons glued together.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Hover: " + css.hover);
      lines.push("  Pressed: " + css.pressed);
      lines.push("  Selected: " + css.selected);
      lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
    });
    lines.push("");
    lines.push("States (6, apply per segment): Rest, Hover, Pressed, Selected, Focused, Disabled.");
    lines.push("- Only one segment is ever Selected at a time - selecting a new segment deselects the previous one.");
    lines.push("- Disabled applies to the whole group at once (40% opacity, not-allowed cursor), not one segment at a time.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height, applied to every segment.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to the group's outer corners only - the joining edges between segments stay square.");
    lines.push("");
    var labels = selectionInfo.labels || DEFAULT_LABELS;
    var content = selectionInfo.content || "text", icon = selectionInfo.icon || "plus", iconPosition = selectionInfo.iconPosition || "before";
    lines.push("Number of buttons (" + labels.length + ", 2-9 range) with individually editable labels, currently: " + labels.map(function(l){ return "\"" + l + "\""; }).join(", ") + ".");
    lines.push("Content (per segment, one setting for the whole group): Text only / Icon only / Icon + Text - currently " + (content === "text" ? "Text only" : content === "icon" ? "Icon only" : "Icon + Text (icon " + iconPosition + " the label)") + (content !== "text" ? ", icon: " + icon : "") + ".");
    lines.push("Field label (optional toggle, shows a label above the group, e.g. \"View\", mirrors the Input component's Label); Supporting text (optional toggle, shows helper text below the group, e.g. \"Choose how to display your results.\", mirrors Input's helper text).");
    lines.push("");
    lines.push("Selection behavior: single selection only (selecting a segment deselects whichever one was previously active); supports a configurable default-selected segment and, optionally, allowing no segment to be selected at all (clicking the active segment again clears it).");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var fieldLabel = selectionInfo.fieldLabel || "";
    var supportingText = selectionInfo.supportingText || "";
    var labels = selectionInfo.labels || DEFAULT_LABELS;
    var content = selectionInfo.content || "text", icon = selectionInfo.icon || "plus", iconPosition = selectionInfo.iconPosition || "before";

    var lines = [];
    lines.push("/* Agentic Design System - Group Button (segmented control) component */");
    lines.push(".group-btn{ display:inline-flex; align-items:stretch; overflow:hidden; box-sizing:border-box; }");
    lines.push('.group-btn-segment{ box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; border:none; font-family:var(--font-body); font-weight:var(--type-active-weight); white-space:nowrap; cursor:pointer; transition:background-color .15s ease, border-color .15s ease, color .15s ease; }');
    lines.push(".group-btn-segment:disabled{ cursor:not-allowed; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".group-btn-segment--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (8 options) - not chosen yet, default is 8px - outer corners only */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - outer corners only */");
    radiiToEmit.forEach(function(radius){
      lines.push(".group-btn--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (2) - rest / hover / pressed / selected / focus per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".group-btn--" + t.key + " .group-btn-segment";
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":active{ " + css.pressed + " }");
      lines.push(cls + ".is-selected{ " + css.selected + " }");
      lines.push(cls + ":focus-visible{ " + css.focus + " }");
    });
    lines.push("");
    lines.push("/* Disabled - applies to the whole group */");
    lines.push(".group-btn-segment:disabled{ opacity:0.4; }");
    lines.push("");
    if (fieldLabel || supportingText){
      lines.push("/* Optional field label / supporting text - mirrors the Input component's Label and helper text */");
      lines.push(".group-btn-field{ display:flex; flex-direction:column; gap:var(--space-8); align-items:flex-start; }");
      lines.push(".group-btn-field-label{ font-size:var(--type-body-size); font-weight:var(--type-active-weight); color:var(--text-hi); margin:0; }");
      lines.push(".group-btn-field-note{ font-size:var(--type-caption-size); color:var(--text-dim); margin:0; }");
      lines.push("");
    }
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" || radiusInfo.mode === "specific" ? ", at the explicitly chosen size/radius" : "") + " -->");
    TYPES.forEach(function(t){
      var indent = (fieldLabel || supportingText) ? "  " : "";
      if (fieldLabel || supportingText) lines.push('<div class="group-btn-field">');
      if (fieldLabel) lines.push(indent + '<p class="group-btn-field-label">' + fieldLabel + "</p>");
      lines.push(indent + '<div class="group-btn group-btn--' + t.key + " group-btn--radius-" + radiusClassSuffix(exampleRadius) + '" style="border-radius:' + radiusCssFor(exampleRadius) + '">');
      labels.forEach(function(label, i){
        var selectedCls = i === 0 ? " is-selected" : "";
        var iconOnlyCls = content === "icon" ? " is-icon-only" : "";
        var ariaLabelAttr = content === "icon" ? ' aria-label="' + label + '"' : "";
        var inner = content === "icon" ? iconSvg(icon, ICON_SIZE_BY_HEIGHT[exampleSize] || 16)
          : content === "icon-text" ? (iconPosition === "after" ? "<span>" + label + "</span>" + iconSvg(icon, ICON_SIZE_BY_HEIGHT[exampleSize] || 16) : iconSvg(icon, ICON_SIZE_BY_HEIGHT[exampleSize] || 16) + "<span>" + label + "</span>")
          : label;
        lines.push(indent + '  <button type="button" class="group-btn-segment group-btn-segment--h' + exampleSize + iconOnlyCls + selectedCls + '"' + ariaLabelAttr + ">" + inner + "</button>");
      });
      lines.push(indent + "</div>");
      if (supportingText) lines.push(indent + '<p class="group-btn-field-note">' + supportingText + "</p>");
      if (fieldLabel || supportingText) lines.push("</div>");
    });
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Builds the prompt/code for exactly ONE Size x Corner radius
  // combination, fully resolved (never "ask the question") - used by the
  // Copy prompt/Copy code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(size, radius, fieldLabel, supportingText, labels, content, icon, iconPosition){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      fieldLabel: fieldLabel,
      supportingText: supportingText,
      labels: labels, content: content, icon: icon, iconPosition: iconPosition
    });
  }

  function buildComboCode(size, radius, fieldLabel, supportingText, labels, content, icon, iconPosition){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      fieldLabel: fieldLabel,
      supportingText: supportingText,
      labels: labels, content: content, icon: icon, iconPosition: iconPosition
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
    }

    // Gallery-card copy CTA + click-to-navigate (group-button.html's
    // listing card) - separate data-role from every other system's own
    // copy roles so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-group"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-group"]');
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
    var groupTypeCards = document.querySelectorAll(".group-type-card[data-system]");
    groupTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "group-button-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="group-matrix-container"]');
    if (!matrixContainer) return;

    var countSelect = document.querySelector('[data-role="group-count-select"]');
    var sizeMount = document.querySelector('[data-role="group-size-mount"]');
    var radiusMount = document.querySelector('[data-role="group-radius-mount"]');
    var contentSelect = document.querySelector('[data-role="group-content-select"]');
    var iconSelect = document.querySelector('[data-role="group-icon-select"]');
    var iconField = document.querySelector('[data-role="group-icon-field"]');
    var iconPositionSelect = document.querySelector('[data-role="group-icon-position-select"]');
    var iconPositionField = document.querySelector('[data-role="group-icon-position-field"]');
    var labelsEditor = document.querySelector('[data-role="group-labels-editor"]');
    var showLabelInput = document.querySelector('[data-role="group-show-label"]');
    var fieldLabelInput = document.querySelector('[data-role="group-field-label"]');
    var fieldLabelFieldWrap = document.querySelector('[data-role="group-field-label-field"]');
    var showSupportingInput = document.querySelector('[data-role="group-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="group-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="group-supporting-text-field"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');
    var defaultSelectedSelect = document.querySelector('[data-role="group-default-selected"]');
    var allowNoneInput = document.querySelector('[data-role="group-allow-none"]');
    var interactiveMount = document.querySelector('[data-role="group-interactive"]');

    // Each button's label is independently editable (spec: "customize the
    // content of each button individually") - seeded from the lettered pool
    // but kept in this array once a person starts typing, so count changes
    // only add/remove from the end instead of resetting what's already there.
    var customLabels = DEFAULT_LABELS.slice();
    function labelsForCurrentCount(){
      var count = countSelect ? parseInt(countSelect.value, 10) : DEFAULT_COUNT;
      while (customLabels.length < count) customLabels.push(LABEL_POOL[customLabels.length] || "Option " + (customLabels.length + 1));
      customLabels.length = count;
      return customLabels;
    }

    function segmentContentHtml(label, size, content, icon, iconPosition){
      var iconHtml = iconSvg(icon, ICON_SIZE_BY_HEIGHT[size] || 16);
      var safeLabel = escapeHtml(label);
      if (content === "icon") return iconHtml;
      if (content === "icon-text") return iconPosition === "after" ? "<span>" + safeLabel + "</span>" + iconHtml : iconHtml + "<span>" + safeLabel + "</span>";
      return safeLabel;
    }

    function buildGroupButton(typeKey, stateKey, stateCls, size, radius, labels, fieldLabel, supportingText, content, icon, iconPosition){
      var isDisabled = stateKey === "disabled";
      var radiusCss = radiusCssFor(radius);
      // Foundation audit UX10 - one cell of a side-by-side state comparison,
      // not a real group button; tabindex="-1" keeps it out of the Tab
      // sequence without removing it from the accessibility tree.
      var segments = labels.map(function(label, i){
        var segCls = "group-btn-segment group-btn-segment--h" + size + (content === "icon" ? " is-icon-only" : "") + (i === 0 ? stateCls : "");
        var disabledAttr = isDisabled ? " disabled" : "";
        var ariaLabelAttr = content === "icon" ? ' aria-label="' + escapeHtml(label) + '"' : "";
        return '<button type="button" class="' + segCls + '" tabindex="-1"' + ariaLabelAttr + disabledAttr + ">" + segmentContentHtml(label, size, content, icon, iconPosition) + "</button>";
      }).join("");
      var groupHtml = '<div class="group-btn group-btn--' + typeKey + '" style="border-radius:' + radiusCss + '">' + segments + "</div>";
      if (!fieldLabel && !supportingText) return groupHtml;
      var labelHtml = fieldLabel ? '<p class="group-btn-field-label">' + escapeHtml(fieldLabel) + "</p>" : "";
      var supportingHtml = supportingText ? '<p class="group-btn-field-note">' + escapeHtml(supportingText) + "</p>" : "";
      return '<div class="group-btn-field">' + labelHtml + groupHtml + supportingHtml + "</div>";
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

    function buildMatrixSection(size, radius, labels, fieldLabel, supportingText, content, icon, iconPosition){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildGroupButton(t.key, state.key, state.cls, size, radius, labels, fieldLabel, supportingText, content, icon, iconPosition) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size, radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentContent(){
      return {
        content: contentSelect ? contentSelect.value : "text",
        icon: iconSelect ? iconSelect.value : "plus",
        iconPosition: iconPositionSelect ? iconPositionSelect.value : "before"
      };
    }

    function currentSelectionInfo(){
      var c = currentContent();
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius]),
        fieldLabel: (showLabelInput && showLabelInput.checked) ? (fieldLabelInput.value.trim() || "View") : "",
        supportingText: (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "Choose how to display your results.") : "",
        labels: labelsForCurrentCount().slice(),
        content: c.content, icon: c.icon, iconPosition: c.iconPosition
      };
    }

    // Each button's label gets its own text input, rebuilt whenever the
    // count changes (inputs beyond the new count are dropped, new ones
    // appended) so typed-in labels for buttons that still exist are never
    // lost by an unrelated count change.
    function renderLabelsEditor(){
      if (!labelsEditor) return;
      var labels = labelsForCurrentCount();
      labelsEditor.innerHTML = labels.map(function(label, i){
        return '<input type="text" class="group-label-input" data-role="group-segment-label-' + i + '" data-index="' + i + '" value="' + escapeHtml(label) + '" aria-label="Button ' + (i + 1) + ' label" />';
      }).join("");
      [].slice.call(labelsEditor.querySelectorAll(".group-label-input")).forEach(function(input){
        input.addEventListener("input", function(){
          customLabels[Number(input.dataset.index)] = input.value;
          // A stable function reference (not a fresh closure per keystroke) -
          // ADS_scheduleRender coalesces repeated calls to the SAME function
          // via a WeakMap keyed by reference, so rapid typing debounces to
          // one re-render instead of scheduling an uncoalesced timer each time.
          window.ADS_scheduleRender(renderLabelAndInteractive);
        });
      });
    }

    function syncDefaultSelectedOptions(){
      if (!defaultSelectedSelect) return;
      var labels = labelsForCurrentCount();
      var previous = defaultSelectedSelect.value;
      defaultSelectedSelect.innerHTML = '<option value="">None</option>' + labels.map(function(label, i){
        return '<option value="' + i + '">' + escapeHtml(label) + "</option>";
      }).join("");
      var hasPrevious = [].slice.call(defaultSelectedSelect.options).some(function(o){ return o.value === previous; });
      defaultSelectedSelect.value = hasPrevious ? previous : "0";
    }

    // The comparison matrix above freezes one state per row/segment to show
    // every combination at once - real single-selection click behavior
    // (selecting a segment deselects whichever one was previously active)
    // doesn't fit that format, so it lives here instead, in its own always-
    // interactive instance, the same "Try it" pattern Affix/Splitter/Tree use.
    var selectedIndex = 0;
    function renderInteractive(){
      if (!interactiveMount) return;
      var labels = labelsForCurrentCount();
      var size = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size)[0];
      var radius = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius)[0];
      var c = currentContent();
      var radiusCss = radiusCssFor(radius);
      var segments = labels.map(function(label, i){
        var isSelected = i === selectedIndex;
        var segCls = "group-btn-segment group-btn-segment--h" + size + (c.content === "icon" ? " is-icon-only" : "") + (isSelected ? " is-selected" : "");
        var ariaLabelAttr = c.content === "icon" ? ' aria-label="' + escapeHtml(label) + '"' : "";
        return '<button type="button" class="' + segCls + '" data-index="' + i + '" aria-pressed="' + isSelected + '"' + ariaLabelAttr + ">" + segmentContentHtml(label, size, c.content, c.icon, c.iconPosition) + "</button>";
      }).join("");
      interactiveMount.innerHTML = '<div class="group-btn group-btn--' + TYPES[0].key + '" style="border-radius:' + radiusCss + '">' + segments + "</div>";
      interactiveMount.querySelectorAll("button[data-index]").forEach(function(btn){
        btn.addEventListener("click", function(){
          var index = Number(btn.dataset.index);
          var allowNone = !!(allowNoneInput && allowNoneInput.checked);
          selectedIndex = (allowNone && selectedIndex === index) ? null : index;
          renderInteractive();
        });
      });
    }

    // Used by the label-text-input's own debounced handler: rebuilds the
    // matrix/interactive preview from the just-typed label, but deliberately
    // skips renderLabelsEditor()/syncDefaultSelectedOptions() - rebuilding
    // those replaces every <input>, which would drop the focus and cursor
    // position of the very input the person is still typing into.
    function renderLabelAndInteractive(){ renderMatrix(); renderInteractive(); }

    function render(){
      renderLabelsEditor();
      syncDefaultSelectedOptions();
      renderMatrix();
    }

    function renderMatrix(){
      var labels = labelsForCurrentCount();
      var fieldLabel = (showLabelInput && showLabelInput.checked) ? (fieldLabelInput.value.trim() || "View") : "";
      var supportingText = (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "Choose how to display your results.") : "";
      var c = currentContent();

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, labels, fieldLabel, supportingText, c.content, c.icon, c.iconPosition);
          combos.push({ size: size, radius: radius, label: comboLabel(size, radius), fieldLabel: fieldLabel, supportingText: supportingText, labels: labels, content: c.content, icon: c.icon, iconPosition: c.iconPosition });
        });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.radius, c.fieldLabel, c.supportingText, c.labels, c.content, c.icon, c.iconPosition); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.radius, c.fieldLabel, c.supportingText, c.labels, c.content, c.icon, c.iconPosition); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "group-size-dropdown-label",
        onChange: function(){ render(); renderInteractive(); }
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "group-radius-dropdown-label",
        onChange: function(){ render(); renderInteractive(); }
      });
    }

    if (countSelect){
      countSelect.addEventListener("change", function(){
        var count = parseInt(countSelect.value, 10);
        if (selectedIndex !== null && selectedIndex >= count) selectedIndex = count - 1;
        render();
        renderInteractive();
      });
    }

    if (contentSelect && iconField && iconPositionField){
      contentSelect.addEventListener("change", function(){
        iconField.hidden = contentSelect.value === "text";
        iconPositionField.hidden = contentSelect.value !== "icon-text";
        render();
        renderInteractive();
      });
      iconField.hidden = contentSelect.value === "text";
      iconPositionField.hidden = contentSelect.value !== "icon-text";
    }
    if (iconSelect) iconSelect.addEventListener("change", function(){ render(); renderInteractive(); });
    if (iconPositionSelect) iconPositionSelect.addEventListener("change", function(){ render(); renderInteractive(); });

    if (showLabelInput && fieldLabelFieldWrap){
      showLabelInput.addEventListener("change", function(){
        fieldLabelFieldWrap.hidden = !showLabelInput.checked;
        render();
      });
    }
    if (fieldLabelInput){
      fieldLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }

    if (showSupportingInput && supportingTextFieldWrap){
      showSupportingInput.addEventListener("change", function(){
        supportingTextFieldWrap.hidden = !showSupportingInput.checked;
        render();
      });
    }
    if (supportingTextInput){
      supportingTextInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }

    if (defaultSelectedSelect){
      defaultSelectedSelect.addEventListener("change", function(){
        selectedIndex = defaultSelectedSelect.value === "" ? null : Number(defaultSelectedSelect.value);
        renderInteractive();
      });
    }

    render();
    renderInteractive();
  });
})();
