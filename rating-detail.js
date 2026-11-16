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
    { key: "star", label: "Star" },
    { key: "heart", label: "Heart" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "selected", cls: " is-selected", label: "Selected" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" },
    { key: "readonly", cls: " is-readonly", label: "Read-Only" }
  ];
  var FEEDBACK_WORDS = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  var FULL_SPEC = {
    star: { purpose: "A classic 5-point star - reads instantly as a rating/score control, the most common pattern for product and service reviews." },
    heart: { purpose: "A heart icon - suited to favoriting or affection-toned scoring, like a content \"loved it\" scale." }
  };

  // Standard, simple icon outlines (viewBox 0 0 24 24) - the same path is
  // reused for both the filled and unfilled variant of each type, only the
  // fill/stroke attributes toggle, so Copy Code never has to keep two
  // divergent path definitions in sync.
  var ICON_STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z";
  var ICON_HEART = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  function iconPath(typeKey){
    return typeKey === "heart" ? ICON_HEART : ICON_STAR;
  }

  function iconSvg(typeKey, filled, size){
    var attrs = filled
      ? 'fill="currentColor" stroke="currentColor" stroke-width="1"'
      : 'fill="none" stroke="currentColor" stroke-width="2"';
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' + attrs +
      ' stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="' + iconPath(typeKey) + '"/></svg>';
  }

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // Unfilled/filled/preview colors are identical across both icon types -
  // a Rating icon's meaning comes from its shape, not a per-type color
  // scheme, so Star and Heart share one consistent color story.
  function liveCssFor(){
    var textDim = getCssVar("--text-dim", "#69707D");
    var textHi = getCssVar("--text-hi", "#111827");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF4253");
    return {
      rest: "color:" + textDim + ";",
      hover: "color:" + textHi + ";",
      preview: "color:" + red400 + "; opacity:0.6;",
      selected: "color:" + red500 + ";",
      disabled: "opacity:0.4;",
      focus: "outline:2px solid " + getCssVar("--color-focus-ring", red400) + "; outline-offset:2px;"
    };
  }

  // Icon size list - genuinely scoped to icon sizing (16/20/24/32), not a
  // copy-paste of the 8-option scale used by Button/Input/Group Button.
  var SIZE_OPTIONS = [
    { value: "16", label: "16px - Small" },
    { value: "20", label: "20px - Default" },
    { value: "24", label: "24px - Large" },
    { value: "32", label: "32px - XL" }
  ];
  var FALLBACK_DEFAULTS = { size: "20" };
  var DEFAULT_LABEL = "Rate this product";
  var DEFAULT_COUNT = 3;
  var DEFAULT_MAX = 5;
  var SCALE_OPTIONS = ["3", "5", "10"];

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
    var label = selectionInfo.label || DEFAULT_LABEL;
    var selectedCount = typeof selectionInfo.selectedCount === "number" ? selectionInfo.selectedCount : DEFAULT_COUNT;
    var opts = selectionInfo.opts || {};
    var max = opts.max || DEFAULT_MAX;
    var css = liveCssFor();

    var lines = [];
    lines.push("Create a complete Rating component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, icon size, state) - a row of " + max + " identical icon buttons that fill in as the user hovers or taps to score something from 0-" + max + ", with the current score persisting as filled icons after selection. This is not a text field - it is a tap-to-score control made of repeated icon buttons.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (6, apply per row of " + max + " icons):");
    lines.push("- Rest: all icons unfilled/outline - " + css.rest);
    lines.push("- Hover: all icons unfilled, but the icons up to the hovered position show a lighter preview tint to suggest a live hover-preview - " + css.preview);
    lines.push("- Selected: the first N icons filled (N = the Selected property, 0-" + max + "), the rest stay unfilled - filled color: " + css.selected);
    lines.push("- Focused: a focus ring on the currently focused icon, independent of Selected - " + css.focus);
    lines.push("- Disabled: all icons unfilled at 40% opacity, not-allowed cursor, no interaction.");
    lines.push("- Read-Only: shows the current Selected value with no interaction and no hover preview, but without Disabled's dimmed opacity - for displaying someone else's existing rating.");
    lines.push("");
    lines.push(propertyPromptLine("Icon size", sizeInfo, SIZE_OPTIONS) + " Applied directly to each icon's width/height.");
    lines.push("");
    lines.push("Component properties: Label (text, default \"" + DEFAULT_LABEL + "\", shown above the row unless hidden); Required (boolean, shows a required indicator after the label when the label is shown - currently " + (opts.required ? "yes" : "no") + "); Scale (" + SCALE_OPTIONS.join("/") + " icons, default " + DEFAULT_MAX + "); Selected (0-" + max + ", default " + DEFAULT_COUNT + ", controls how many icons appear filled/selected); Show numeric value (e.g. \"" + selectedCount + "/" + max + "\" beside the label); Show descriptive feedback (e.g. \"" + (FEEDBACK_WORDS[Math.max(0, selectedCount - 1)] || "") + "\" for the current value, from an editable word list); Allow clear (clicking the already-selected icon resets the value to 0); Supporting text (optional helper text below the row)." +
      (selectionInfo.label || typeof selectionInfo.selectedCount === "number"
        ? " Currently configured as Label: \"" + label + "\", Selected: " + selectedCount + "."
        : ""));
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var label = selectionInfo.label || DEFAULT_LABEL;
    var selectedCount = typeof selectionInfo.selectedCount === "number" ? selectionInfo.selectedCount : DEFAULT_COUNT;
    var opts = selectionInfo.opts || {};
    var max = opts.max || DEFAULT_MAX;
    var showLabel = opts.showLabel !== false;
    var showValue = !!opts.showValue;
    var showFeedback = !!opts.showFeedback;
    var feedbackWords = opts.feedbackWords || FEEDBACK_WORDS;
    var allowClear = !!opts.allowClear;
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var requiredHtml = opts.required ? '<span class="rating-demo-required" aria-hidden="true"> *</span>' : "";

    var lines = [];
    lines.push("/* Agentic Design System - Rating component */");
    lines.push(".rating-demo-field{ display:flex; flex-direction:column; gap:var(--space-8); }");
    lines.push(".rating-demo-top{ display:flex; align-items:baseline; gap:var(--space-8); }");
    lines.push(".rating-demo-label{ font-size:var(--type-body-size); font-weight:var(--type-active-weight); color:var(--text-hi); margin:0; max-width:var(--dimension-220); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".rating-demo-required{ color:var(--danger-500); }");
    lines.push(".rating-demo-value, .rating-demo-feedback{ font-size:var(--type-body-size); color:var(--text-dim); margin:0; }");
    lines.push(".rating-demo-note{ font-size:var(--type-caption-size); color:var(--text-dim); margin:0; }");
    lines.push(".rating-demo-row{ display:flex; align-items:center; gap:var(--space-4); }");
    lines.push(".rating-demo-icon{ flex:none; display:flex; align-items:center; justify-content:center; background:none; border:none; padding:var(--space-2); cursor:pointer; color:var(--text-dim); transition:color .15s ease; }");
    lines.push(".rating-demo-icon svg{ display:block; }");
    lines.push(".rating-demo-icon.is-filled{ color:var(--red-500); }");
    lines.push(".rating-demo-icon.is-preview{ color:var(--red-400); opacity:0.6; }");
    lines.push(".rating-demo-row.is-disabled .rating-demo-icon, .rating-demo-icon:disabled{ opacity:0.4; cursor:not-allowed; }");
    lines.push(".rating-demo-row.is-readonly .rating-demo-icon{ cursor:default; }");
    lines.push(".rating-demo-icon:hover:not(:disabled){ color:var(--text-hi); }");
    lines.push(".rating-demo-icon:focus-visible{ outline:2px solid " + getCssVar("--color-focus-ring", "#FF3F4F") + "; outline-offset:2px; }");
    // Foundation audit AT09/UX02 - the baked fill/stroke attributes below
    // only ever represented ONE fixed snapshot; these two rules let a class
    // toggle alone switch a star/heart between outline and solid (an SVG
    // presentation attribute like the inline fill= below always loses to
    // any stylesheet rule for the same element, so this safely overrides it
    // without needing two divergent markups or a re-render per click).
    lines.push(".rating-demo-icon svg{ fill:none; stroke:currentColor; stroke-width:2; }");
    lines.push(".rating-demo-icon.is-filled svg{ fill:currentColor; stroke-width:1; }");
    lines.push("");
    lines.push(sizeInfo.mode === "all"
      ? "/* Icon size - not chosen yet, default is 20px. Set via width/height on each <svg> (16 / 20 / 24 / 32px options). */"
      : "/* Icon size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " - set via width/height on each <svg>. */");
    lines.push("");
    lines.push("<!-- Example usage - one per type, starting at " + selectedCount + " of " + max + " filled, at " + exampleSize + "px. Half-star ratings and a hierarchical feedback-word localization system are out of scope for this static demo. -->");
    lines.push("<!-- Operable: the script below sets the clicked or keyboard-reached icon's");
    lines.push("     position as the group's value, fills every earlier sibling, clears every");
    lines.push("     later one, and keeps aria-pressed in sync - not a static illustration. -->");
    TYPES.forEach(function(t){
      var typeNoun = t.label.toLowerCase() + "s";
      lines.push('<div class="rating-demo-field">');
      if (showLabel || showValue) {
        lines.push('  <div class="rating-demo-top">');
        if (showLabel) lines.push('    <p class="rating-demo-label">' + escapeHtml(label) + requiredHtml + "</p>");
        if (showValue) lines.push('    <p class="rating-demo-value">' + selectedCount + "/" + max + "</p>");
        lines.push("  </div>");
      }
      lines.push('  <div class="rating-demo-row is-selected" data-rating-group="' + t.key + '" data-rating-max="' + max + '"' + (allowClear ? ' data-rating-allow-clear="true"' : "") + ">");
      for (var i = 0; i < max; i++){
        var filled = i < selectedCount;
        var iconLabel = escapeHtml(label) + ", " + (i + 1) + " of " + max + " " + typeNoun;
        lines.push('    <button type="button" class="rating-demo-icon' + (filled ? " is-filled" : "") + '" aria-label="' + iconLabel + '" aria-pressed="' + filled + '">' + iconSvg(t.key, filled, exampleSize) + "</button>");
      }
      lines.push("  </div>");
      if (showFeedback) lines.push('  <p class="rating-demo-feedback" data-rating-feedback>' + escapeHtml(feedbackWords[selectedCount - 1] || "") + "</p>");
      if (opts.supportingText) lines.push('  <p class="rating-demo-note">' + escapeHtml(opts.supportingText) + "</p>");
      lines.push("</div>");
    });
    lines.push("<script>");
    lines.push("(function(){");
    lines.push("  var feedbackWords = " + JSON.stringify(feedbackWords) + ";");
    lines.push("  document.querySelectorAll('[data-rating-group]').forEach(function(row){");
    lines.push("    var buttons = Array.prototype.slice.call(row.querySelectorAll('.rating-demo-icon'));");
    lines.push("    var valueEl = row.parentElement.querySelector('.rating-demo-value');");
    lines.push("    var feedbackEl = row.parentElement.querySelector('[data-rating-feedback]');");
    lines.push("    var current = buttons.filter(function(b){ return b.classList.contains('is-filled'); }).length;");
    lines.push("    function setValue(value){");
    lines.push("      current = value;");
    lines.push("      buttons.forEach(function(btn, i){");
    lines.push("        var filled = i < value;");
    lines.push("        btn.classList.toggle('is-filled', filled);");
    lines.push("        btn.setAttribute('aria-pressed', String(filled));");
    lines.push("      });");
    lines.push("      if (valueEl) valueEl.textContent = value + '/' + buttons.length;");
    lines.push("      if (feedbackEl) feedbackEl.textContent = feedbackWords[value - 1] || '';");
    lines.push("      row.dispatchEvent(new CustomEvent('ratingchange', { detail: { value: value }, bubbles: true }));");
    lines.push("    }");
    lines.push("    function focusAndSet(i){ buttons[i].focus(); setValue(i + 1); }");
    lines.push("    buttons.forEach(function(btn, i){");
    lines.push("      if (btn.disabled) return;");
    lines.push("      btn.addEventListener('click', function(){");
    lines.push("        if (row.dataset.ratingAllowClear === 'true' && current === i + 1){ setValue(0); return; }");
    lines.push("        setValue(i + 1);");
    lines.push("      });");
    lines.push("      btn.addEventListener('keydown', function(e){");
    lines.push("        if (e.key === 'ArrowRight' || e.key === 'ArrowUp'){ e.preventDefault(); focusAndSet(Math.min(i + 1, buttons.length - 1)); }");
    lines.push("        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown'){ e.preventDefault(); focusAndSet(Math.max(i - 1, 0)); }");
    lines.push("        else if (e.key === 'Home'){ e.preventDefault(); focusAndSet(0); }");
    lines.push("        else if (e.key === 'End'){ e.preventDefault(); focusAndSet(buttons.length - 1); }");
    lines.push("      });");
    lines.push("    });");
    lines.push("  });");
    lines.push("})();");
    lines.push("</" + "script>");
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Builds the prompt/code for exactly ONE Icon size, fully resolved (never
  // "ask the question") - used by the Copy prompt/Copy code dropdown's
  // per-combination "Copy" buttons.
  function buildComboPrompt(size, label, selectedCount, opts){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      label: label,
      selectedCount: selectedCount,
      opts: opts
    });
  }

  function buildComboCode(size, label, selectedCount, opts){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      label: label,
      selectedCount: selectedCount,
      opts: opts
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
    }

    // Gallery-card copy CTA + click-to-navigate (rating.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-rating"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-rating"]');
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
    var ratingTypeCards = document.querySelectorAll(".rating-type-card[data-system]");
    ratingTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "rating-" + card.dataset.system + ".html";
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
    // Icon size is in play) or, whenever more than one size is currently
    // selected, a disclosure dropdown listing every size by name with its
    // own "Copy" button.
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

    var matrixContainer = document.querySelector('[data-role="rating-matrix-container"]');
    if (!matrixContainer) return;

    var countSelect = document.querySelector('[data-role="rating-count-select"]');
    var scaleSelect = document.querySelector('[data-role="rating-scale-select"]');
    var sizeMount = document.querySelector('[data-role="rating-size-mount"]');
    var labelInput = document.querySelector('[data-role="rating-label"]');
    var showLabelInput = document.querySelector('[data-role="rating-show-label"]');
    var requiredInput = document.querySelector('[data-role="rating-required"]');
    var showValueInput = document.querySelector('[data-role="rating-show-value"]');
    var showFeedbackInput = document.querySelector('[data-role="rating-show-feedback"]');
    var feedbackWordsInput = document.querySelector('[data-role="rating-feedback-words"]');
    var feedbackFieldWrap = document.querySelector('[data-role="rating-feedback-field"]');
    var allowClearInput = document.querySelector('[data-role="rating-allow-clear"]');
    var showSupportingInput = document.querySelector('[data-role="rating-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="rating-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="rating-supporting-text-field"]');
    var interactiveMount = document.querySelector('[data-role="rating-interactive"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function rebuildCountOptions(max){
      if (!countSelect) return;
      var current = Math.min(parseInt(countSelect.value, 10) || DEFAULT_COUNT, max);
      var html = "";
      for (var i = 0; i <= max; i++){
        html += '<option value="' + i + '"' + (i === current ? " selected" : "") + ">" + i + "</option>";
      }
      countSelect.innerHTML = html;
    }

    function buildRatingField(typeKey, stateKey, stateCls, size, label, selectedCount, opts){
      opts = opts || {};
      var max = opts.max || DEFAULT_MAX;
      var isDisabled = stateKey === "disabled";
      var typeNoun = TYPES.filter(function(t){ return t.key === typeKey; })[0].label.toLowerCase() + "s";
      var icons = [];
      for (var i = 0; i < max; i++){
        var extraCls = "";
        var filled = false;
        if (stateKey === "selected" || stateKey === "focus"){
          filled = i < selectedCount;
          if (filled) extraCls = " is-filled";
        } else if (stateKey === "hover" && i < 3){
          extraCls = " is-preview";
        } else if (stateKey === "readonly"){
          filled = i < selectedCount;
          if (filled) extraCls = " is-filled";
        }
        var disabledAttr = isDisabled ? " disabled" : "";
        // tabindex="-1" + the state label in the name: this grid is a
        // static side-by-side comparison of 6 possible states (same
        // pattern as Modal's own illustrative matrices), not one
        // operable control - a real tab stop here would land on many
        // buttons that do nothing when activated. aria-pressed reflects
        // what each one depicts, not a live toggle.
        var iconLabel = escapeHtml(label) + ", " + stateKey + ", " + (i + 1) + " of " + max + " " + typeNoun;
        icons.push('<button type="button" class="rating-demo-icon' + extraCls + '"' + disabledAttr + ' tabindex="-1" aria-label="' + iconLabel + '" aria-pressed="' + filled + '">' + iconSvg(typeKey, filled, size) + "</button>");
      }
      var rowCls = "rating-demo-row" + stateCls + (stateKey === "focus" ? " is-focus-demo" : "");
      var rowHtml = '<div class="' + rowCls + '">' + icons.join("") + "</div>";
      // data-contract-part gives the Figma capture a stable identity for
      // each part, independent of DOM position - same reasoning as
      // checkbox-detail.js's own buildCheckboxCell().
      var requiredHtml = opts.required ? '<span class="rating-demo-required" data-contract-part="required" aria-hidden="true"> *</span>' : "";
      var topHtml = (opts.showLabel !== false || opts.showValue)
        ? '<div class="rating-demo-top">' +
            (opts.showLabel !== false ? '<p class="rating-demo-label" data-contract-part="label">' + escapeHtml(label) + requiredHtml + "</p>" : "") +
            (opts.showValue ? '<p class="rating-demo-value" data-contract-part="value">' + selectedCount + "/" + max + "</p>" : "") +
          "</div>"
        : "";
      var feedbackHtml = opts.showFeedback ? '<p class="rating-demo-feedback" data-contract-part="feedback">' + escapeHtml((opts.feedbackWords || FEEDBACK_WORDS)[selectedCount - 1] || "") + "</p>" : "";
      var noteHtml = opts.supportingText ? '<p class="rating-demo-note" data-contract-part="supporting">' + escapeHtml(opts.supportingText) + "</p>" : "";
      return '<div class="rating-demo-field">' + topHtml + rowHtml + feedbackHtml + noteHtml + "</div>";
    }

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function comboLabel(size){
      return optionLabelFor(SIZE_OPTIONS, size);
    }

    function buildMatrixSection(size, label, selectedCount, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildRatingField(t.key, state.key, state.cls, size, label, selectedCount, opts) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentOpts(){
      var max = scaleSelect ? parseInt(scaleSelect.value, 10) : DEFAULT_MAX;
      var words = (feedbackWordsInput && feedbackWordsInput.value.trim())
        ? feedbackWordsInput.value.split(",").map(function(w){ return w.trim(); })
        : FEEDBACK_WORDS;
      return {
        max: max,
        showLabel: showLabelInput ? showLabelInput.checked : true,
        required: !!(requiredInput && requiredInput.checked),
        showValue: showValueInput ? showValueInput.checked : false,
        showFeedback: showFeedbackInput ? showFeedbackInput.checked : false,
        feedbackWords: words,
        allowClear: allowClearInput ? allowClearInput.checked : false,
        supportingText: (showSupportingInput && showSupportingInput.checked && supportingTextInput) ? supportingTextInput.value.trim() : ""
      };
    }

    function currentSelectionInfo(){
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        label: labelInput ? (labelInput.value.trim() || DEFAULT_LABEL) : DEFAULT_LABEL,
        selectedCount: countSelect ? parseInt(countSelect.value, 10) : DEFAULT_COUNT,
        opts: currentOpts()
      };
    }

    function render(){
      var opts = currentOpts();
      rebuildCountOptions(opts.max);
      var label = labelInput ? (labelInput.value.trim() || DEFAULT_LABEL) : DEFAULT_LABEL;
      var selectedCount = countSelect ? parseInt(countSelect.value, 10) : DEFAULT_COUNT;
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(size, label, selectedCount, opts);
        combos.push({ size: size, label: comboLabel(size), fieldLabel: label, selectedCount: selectedCount });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.fieldLabel, c.selectedCount, opts); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.fieldLabel, c.selectedCount, opts); });

      renderInteractive();
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Icon size options",
        labelledBy: "rating-size-dropdown-label",
        onChange: render
      });
    }

    if (countSelect){
      countSelect.addEventListener("change", render);
    }
    if (labelInput){
      labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (scaleSelect) scaleSelect.addEventListener("change", render);
    [showLabelInput, requiredInput, showValueInput, showFeedbackInput, allowClearInput].forEach(function(el){
      if (el) el.addEventListener("change", render);
    });
    if (showFeedbackInput && feedbackFieldWrap){
      showFeedbackInput.addEventListener("change", function(){
        feedbackFieldWrap.hidden = !showFeedbackInput.checked;
        render();
      });
    }
    if (feedbackWordsInput) feedbackWordsInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (showSupportingInput && supportingTextFieldWrap){
      showSupportingInput.addEventListener("change", function(){
        supportingTextFieldWrap.hidden = !showSupportingInput.checked;
        render();
      });
    }
    if (supportingTextInput) supportingTextInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    // Real, working "Try it" instance: a single Star rating row you can
    // click, hover-preview, or operate by keyboard (arrow keys, Home/End).
    // Rebuilt via innerHTML on every value change - the interactive icon
    // buttons' own click handlers never need e.stopPropagation() the way
    // Select Dropdown's did, since there is no document-level outside-click
    // listener here for a rebuild to race against.
    var interactiveValue = DEFAULT_COUNT;
    var interactiveHoverIndex = -1;

    function renderInteractiveInstance(){
      if (!interactiveMount) return;
      var opts = currentOpts();
      interactiveValue = Math.min(interactiveValue, opts.max);
      var label = labelInput ? (labelInput.value.trim() || DEFAULT_LABEL) : DEFAULT_LABEL;
      var size = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size)[0];
      var previewCount = interactiveHoverIndex >= 0 ? interactiveHoverIndex + 1 : interactiveValue;
      var icons = [];
      for (var i = 0; i < opts.max; i++){
        var filled = i < previewCount;
        var cls = "rating-demo-icon" + (filled ? (interactiveHoverIndex >= 0 ? " is-preview" : " is-filled") : "");
        icons.push('<button type="button" class="' + cls + '" data-rating-index="' + i + '" aria-label="' + escapeHtml(label) + ", " + (i + 1) + " of " + opts.max + '" aria-pressed="' + (i < interactiveValue) + '">' + iconSvg("star", filled, size) + "</button>");
      }
      var topHtml = (opts.showLabel !== false || opts.showValue)
        ? '<div class="rating-demo-top">' +
            (opts.showLabel !== false ? '<p class="rating-demo-label">' + escapeHtml(label) + (opts.required ? '<span class="rating-demo-required" aria-hidden="true"> *</span>' : "") + "</p>" : "") +
            (opts.showValue ? '<p class="rating-demo-value" data-role="rating-interactive-value">' + interactiveValue + "/" + opts.max + "</p>" : "") +
          "</div>"
        : "";
      var feedbackHtml = opts.showFeedback ? '<p class="rating-demo-feedback" data-role="rating-interactive-feedback">' + escapeHtml((opts.feedbackWords[interactiveValue - 1]) || "") + "</p>" : "";
      var noteHtml = opts.supportingText ? '<p class="rating-demo-note">' + escapeHtml(opts.supportingText) + "</p>" : "";
      interactiveMount.innerHTML = '<div class="rating-demo-field">' + topHtml +
        '<div class="rating-demo-row" data-role="rating-interactive-row" tabindex="0">' + icons.join("") + "</div>" +
        feedbackHtml + noteHtml +
      "</div>";

      var row = interactiveMount.querySelector('[data-role="rating-interactive-row"]');
      var buttons = Array.prototype.slice.call(row.querySelectorAll(".rating-demo-icon"));

      // Hover preview is a cheap class toggle on the EXISTING buttons, not a
      // full renderInteractiveInstance() rebuild - rebuilding the whole row
      // (and thus replacing every button node) on every single mouseenter
      // momentarily detaches the node the browser's own in-flight pointer
      // gesture is tracking, which is harmless for a real mouse but made
      // Playwright's synthetic click intermittently land on an
      // already-detached element. A commit (click/keyboard/opts change)
      // still does a full rebuild, since the value and any Show value/
      // feedback text need to change together.
      function applyPreview(hoverIndex){
        var previewCount = hoverIndex >= 0 ? hoverIndex + 1 : interactiveValue;
        buttons.forEach(function(btn, i){
          var filled = i < previewCount;
          btn.classList.toggle("is-filled", filled && hoverIndex < 0);
          btn.classList.toggle("is-preview", filled && hoverIndex >= 0);
        });
      }

      buttons.forEach(function(btn, i){
        btn.addEventListener("mouseenter", function(){ interactiveHoverIndex = i; applyPreview(i); });
        btn.addEventListener("click", function(){
          var freshOpts = currentOpts();
          if (freshOpts.allowClear && interactiveValue === i + 1) interactiveValue = 0;
          else interactiveValue = i + 1;
          interactiveHoverIndex = -1;
          renderInteractiveInstance();
        });
      });
      row.addEventListener("mouseleave", function(){ interactiveHoverIndex = -1; applyPreview(-1); });
      row.addEventListener("keydown", function(e){
        var opts2 = currentOpts();
        var handled = true;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") interactiveValue = Math.min(interactiveValue + 1, opts2.max);
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") interactiveValue = Math.max(interactiveValue - 1, 0);
        else if (e.key === "Home") interactiveValue = 0;
        else if (e.key === "End") interactiveValue = opts2.max;
        else handled = false;
        if (handled){
          e.preventDefault();
          interactiveHoverIndex = -1;
          renderInteractiveInstance();
          // row was just replaced by the rebuild above - re-query it so
          // focus lands on the new element, not the now-detached old one
          // (a stale `row.focus()` here would silently no-op, breaking
          // every arrow-key press after the first).
          var newRow = interactiveMount.querySelector('[data-role="rating-interactive-row"]');
          if (newRow) newRow.focus();
        }
      });
    }

    function renderInteractive(){
      renderInteractiveInstance();
    }

    render();
  });
})();
