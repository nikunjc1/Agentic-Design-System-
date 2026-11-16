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
    { key: "standard", label: "Standard" },
    { key: "card", label: "Card" }
  ];
  var STATES = [
    { key: "unchecked", cls: "", label: "Unchecked" },
    { key: "checked", cls: "", label: "Checked" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    standard: { purpose: "A plain circle-and-label pair, set inline - use this when a group's options sit close together and need no extra framing." },
    card: { purpose: "The circle plus label wrapped in a bordered, clickable row that highlights when checked - useful for a settings list of mutually-exclusive options where the whole row should respond to a click, not just the circle." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function radioCoreCss(){
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textDim = getCssVar("--text-dim", "#69707D");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF4253");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.08)");
    return {
      unchecked: "color:" + lineStrong + ";",
      checked: "color:" + red500 + ";",
      hover: "color:" + textDim + ";",
      focus: "outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
      disabled: "opacity:0.4;cursor:not-allowed;",
      cardChecked: "background:" + redTint + ";border-color:" + red500 + ";"
    };
  }


  // Radio uses a small dedicated size scale (16-24px), unlike the shared
  // Button/Input/Group Button scale - the circle itself never needs to be
  // as large as a button.
  var SIZE_OPTIONS = [
    { value: "16", label: "16px - S" },
    { value: "20", label: "20px - M" },
    { value: "24", label: "24px - L" }
  ];
  var FALLBACK_DEFAULTS = { size: "20" };
  var DEFAULT_LABEL = (document.body && document.body.dataset && document.body.dataset.defaultLabel) || "Option A";

  // Circle artwork - each icon draws the complete circle (ring, plus the
  // filled inner dot for the checked state) as one combined shape,
  // fill="currentColor" so a single CSS color drives the whole icon per
  // state - same approach and reasoning as checkbox-detail.js's box icons.
  // Replaces the previous bordered-circle + separately-toggled inner dot
  // span (which needed its own dedicated harvest to survive Figma's
  // capture - see captureRadioProperties() in component-workbench.js) with
  // a single swapped icon, the same simpler shape checkbox now uses.
  var RADIO_CIRCLE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"/></svg>';
  var RADIO_BUTTON_CHECKED_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M15.5375 15.5375C16.5125 14.5625 17 13.3833 17 12C17 10.6167 16.5125 9.4375 15.5375 8.4625C14.5625 7.4875 13.3833 7 12 7C10.6167 7 9.4375 7.4875 8.4625 8.4625C7.4875 9.4375 7 10.6167 7 12C7 13.3833 7.4875 14.5625 8.4625 15.5375C9.4375 16.5125 10.6167 17 12 17C13.3833 17 14.5625 16.5125 15.5375 15.5375ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"/></svg>';

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
    var core = radioCoreCss();

    var lines = [];
    lines.push("Create a complete Radio component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, state) - a small circular selection control normally used in a mutually-exclusive group, where this prompt describes how a single radio input looks and behaves in every state.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (5, apply to the radio circle):");
    lines.push("- Unchecked: " + core.unchecked + " 1.5px border.");
    lines.push("- Checked: " + core.checked + " plus an inner dot (" + core.dot + ") sized to roughly 45% of the circle's diameter, centered - the ring stays an outline, the fill is never solid.");
    lines.push("- Hover: " + core.hover);
    lines.push("- Focused: " + core.focus + " Never just a color change, so layout never shifts.");
    lines.push("- Disabled: " + core.disabled + " applies to the radio itself, not the whole group.");
    lines.push("");
    lines.push("For the Card type only, the row containing the circle and label sits inside a bordered container that switches to " + core.cardChecked + " once its radio is checked - the whole row is clickable, not just the circle.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " The inner dot scales together with the circle.");
    lines.push("");
    var opts = selectionInfo.opts || {};
    lines.push("Component properties: Label (editable text next to the circle, placement Left or Right of the circle - currently " + (opts.labelPlacement || "right") + "), Required (boolean, shows a required indicator after the label - currently " + (opts.required ? "yes" : "no") + "), Supporting text (optional helper text below the label), Error (boolean, shows validation error styling/message below the label instead of supporting text when both are on - e.g. when a required group has no option selected).");
    if (opts.showError) lines.push("Current error message: \"" + opts.errorText + "\".");
    else if (opts.supportingText) lines.push("Current supporting text: \"" + opts.supportingText + "\".");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textDim = getCssVar("--text-dim", "#69707D");
    var textHi = getCssVar("--text-hi", "#111827");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF4253");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.08)");

    var lines = [];
    lines.push("/* Agentic Design System - Radio component */");
    lines.push(".radio-demo-field{ display:inline-flex; flex-direction:column; align-items:flex-start; gap:var(--space-4); cursor:pointer; }");
    lines.push(".radio-demo-row{ display:inline-flex; align-items:center; gap:var(--space-8); }");
    lines.push('.radio-demo-input{ position:absolute; width:var(--dimension-1); height:var(--dimension-1); padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }');
    lines.push("/* The circle IS the icon now (ring, plus the filled inner dot when checked, drawn as one combined Material Symbols shape, fill:currentColor) - colored per state, no border/background of its own. */");
    lines.push(".radio-demo-circle{ box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; flex:none; color:" + lineStrong + "; transition:color .15s ease, outline-color .15s ease; }");
    lines.push(".radio-demo-icon{ display:flex; width:100%; height:100%; }");
    lines.push(".radio-demo-icon svg{ width:100%; height:100%; display:block; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (circle diameter in px) - not chosen yet, default is 20 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      lines.push(".radio-demo-circle--h" + size + "{ width:" + size + "px; height:" + size + "px; }");
    });
    lines.push("");
    lines.push("/* Checked - real :checked via :has(), .is-checked is the class-based fallback for static illustrations with no real sibling input to drive :checked from - every other state (hover/focus/disabled) already has one. */");
    lines.push(".radio-demo-field:has(.radio-demo-input:checked) .radio-demo-circle, .radio-demo-circle.is-checked{ color:" + red500 + "; }");
    lines.push("");
    lines.push("/* Hover - real :hover combined with a static .is-hover class for demoing the state without a real mouse */");
    lines.push(".radio-demo-circle:hover, .radio-demo-circle.is-hover{ color:" + textDim + "; }");
    lines.push("");
    lines.push("/* Focused - real :focus-visible on the (visually hidden but focusable) input, combined with .is-focus */");
    lines.push(".radio-demo-field:has(.radio-demo-input:focus-visible) .radio-demo-circle, .radio-demo-circle.is-focus{ outline:2px solid " + getCssVar("--color-focus-ring", red400) + "; outline-offset:2px; }");
    lines.push("");
    lines.push("/* Disabled - real :disabled combined with .is-disabled */");
    lines.push(".radio-demo-field:has(.radio-demo-input:disabled) .radio-demo-circle, .radio-demo-circle.is-disabled{ opacity:0.4; cursor:not-allowed; }");
    lines.push("");
    lines.push(".radio-demo-label{ font-size:var(--type-body-size); color:" + textHi + "; max-width:var(--dimension-220); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    lines.push("/* Card type - the whole row highlights once its radio is checked */");
    lines.push(".radio-demo-card{ display:flex; flex-direction:column; align-items:flex-start; gap:var(--space-10); padding:var(--space-10) var(--space-14); border:var(--border-width-1) var(--border-style) " + lineStrong + "; border-radius:var(--radius-md); transition:background-color .15s ease, border-color .15s ease; }");
    lines.push(".radio-demo-card.is-checked{ background:" + redTint + "; border-color:" + red500 + "; }");
    lines.push("");
    lines.push("/* Required indicator / supporting+error text below the label */");
    lines.push(".radio-demo-required{ color:var(--danger-500); }");
    lines.push(".radio-demo-note{ display:block; font-size:var(--type-caption-size); color:var(--text-dim); margin:var(--space-4) 0 0; }");
    lines.push(".radio-demo-note.is-error{ color:var(--danger-700); }");
    lines.push(".radio-demo-field--label-left .radio-demo-row{ flex-direction:row-reverse; }");
    lines.push("");
    var opts = selectionInfo.opts || {};
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var requiredHtml = opts.required ? '<span class="radio-demo-required" aria-hidden="true"> *</span>' : "";
    var noteHtml = opts.showError ? '<p class="radio-demo-note is-error">' + opts.errorText + "</p>"
      : (opts.supportingText ? '<p class="radio-demo-note">' + opts.supportingText + "</p>" : "");
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + ", checked -->");
    TYPES.forEach(function(t){
      var field = '<label class="radio-demo-field radio-demo-field--' + t.key + (opts.labelPlacement === "left" ? " radio-demo-field--label-left" : "") + '">' +
        '<input type="radio" class="radio-demo-input" name="radio-demo-example-' + t.key + '" checked' + (opts.required ? " required" : "") + ' />' +
        '<span class="radio-demo-row">' +
          '<span class="radio-demo-circle radio-demo-circle--h' + exampleSize + '"><span class="radio-demo-icon">' + RADIO_BUTTON_CHECKED_SVG + '</span></span>' +
          '<span class="radio-demo-label">' + DEFAULT_LABEL + requiredHtml + '</span>' +
        '</span>' +
      '</label>';
      lines.push(t.key === "card" ? '<div class="radio-demo-card is-checked">' + field + '</div>' : field);
      if (noteHtml) lines.push(noteHtml);
    });
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Builds the prompt/code for exactly ONE Size, fully resolved (never "ask
  // the question") - used by the Copy prompt/Copy code dropdown's own
  // per-size "Copy" buttons.
  function buildComboPrompt(size, opts){
    return buildFullPrompt({ size: { mode: "specific", values: [size] }, opts: opts });
  }

  function buildComboCode(size, opts){
    return buildFullCode({ size: { mode: "specific", values: [size] }, opts: opts });
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
    }

    // Gallery-card copy CTA + click-to-navigate (radio.html's listing card)
    // - separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-radio"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-radio"]');
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
    var radioTypeCards = document.querySelectorAll(".radio-type-card[data-system]");
    radioTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "radio-" + card.dataset.system + ".html";
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
    // disclosure dropdown listing every size by name with its own "Copy"
    // button.
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

    var matrixContainer = document.querySelector('[data-role="radio-matrix-container"]');
    if (!matrixContainer) return;

    var labelInput = document.querySelector('[data-role="radio-label"]');
    var sizeMount = document.querySelector('[data-role="radio-size-mount"]');
    var labelPlacementSelect = document.querySelector('[data-role="radio-label-placement"]');
    var requiredInput = document.querySelector('[data-role="radio-required"]');
    var showSupportingInput = document.querySelector('[data-role="radio-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="radio-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="radio-supporting-text-field"]');
    var showErrorInput = document.querySelector('[data-role="radio-show-error"]');
    var errorTextInput = document.querySelector('[data-role="radio-error-text"]');
    var errorTextFieldWrap = document.querySelector('[data-role="radio-error-text-field"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildRadioField(typeKey, state, size, label, opts){
      opts = opts || {};
      var isChecked = state.key === "checked";
      var isDisabled = state.key === "disabled";
      var circleCls = "radio-demo-circle radio-demo-circle--h" + size + state.cls;
      var inputName = "radio-demo-" + size + "-" + typeKey + "-" + state.key;
      var checkedAttr = isChecked ? " checked" : "";
      var disabledAttr = isDisabled ? " disabled" : "";
      var requiredAttr = opts.required ? " required" : "";
      // The circle IS the icon now (ring, plus the filled inner dot when
      // checked, drawn as one combined shape) - always exactly one of the
      // two, never a separately-toggled dot child - same approach as
      // checkbox-detail.js's box.
      var icon = '<span class="radio-demo-icon" data-contract-part="icon">' + (isChecked ? RADIO_BUTTON_CHECKED_SVG : RADIO_CIRCLE_SVG) + '</span>';
      // data-contract-part gives the Figma capture a stable identity for
      // each part, independent of DOM position - same reasoning as
      // checkbox-detail.js's own buildCheckboxCell().
      var requiredHtml = opts.required ? '<span class="radio-demo-required" data-contract-part="required" aria-hidden="true"> *</span>' : "";
      var circleHtml = '<span class="' + circleCls + '" data-contract-part="box">' + icon + "</span>";
      var labelHtml = '<span class="radio-demo-label" data-contract-part="label">' + escapeHtml(label) + requiredHtml + "</span>";
      var inner = opts.labelPlacement === "left" ? labelHtml + circleHtml : circleHtml + labelHtml;
      // Foundation audit UX10 - one cell of a side-by-side state comparison,
      // not a real radio; tabindex="-1" keeps it out of the Tab sequence
      // without removing it from the accessibility tree.
      var fieldCls = "radio-demo-field radio-demo-field--" + typeKey + (opts.labelPlacement === "left" ? " radio-demo-field--label-left" : "");
      var noteHtml = opts.showError
        ? '<p class="radio-demo-note is-error" data-contract-part="error">' + escapeHtml(opts.errorText || "") + "</p>"
        : (opts.supportingText ? '<p class="radio-demo-note" data-contract-part="supporting">' + escapeHtml(opts.supportingText) + "</p>" : "");
      // The note used to be appended as a sibling AFTER </label> instead of
      // nested inside it - the capture snapshots the cell's single first
      // child, so a note living outside that element entirely was
      // structurally invisible, not just unlabeled (same bug fixed in
      // checkbox-detail.js's buildCheckboxCell()).
      //
      // circle+label are wrapped in their own "row" so the field itself can
      // stack row-then-note vertically. Previously the field was a single
      // flex row holding input+circle+label+note all side by side with no
      // wrap - the note ran off to the right of the label instead of
      // appearing below it, and every Appearance x State x Size master
      // ended up a different total width depending on whether Required/
      // Supporting/Error happened to be on (same bug fixed in checkbox-
      // detail.js's buildCheckboxCell() - the actual "information
      // structure" Figma grid overlap report).
      var rowHtml = '<span class="radio-demo-row" data-contract-part="row">' + inner + '</span>';
      var field = '<label class="' + fieldCls + '">' +
        '<input type="radio" class="radio-demo-input" data-contract-part="input" tabindex="-1" name="' + inputName + '"' + checkedAttr + disabledAttr + requiredAttr + " />" +
        rowHtml +
        noteHtml +
      "</label>";
      if (typeKey === "card"){
        var cardCls = "radio-demo-card" + (isChecked ? " is-checked" : "");
        return '<div class="' + cardCls + '">' + field + "</div>";
      }
      return field;
    }

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function buildMatrixSection(size, label, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildRadioField(t.key, state, size, label, opts) + "</td>";
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
        labelPlacement: labelPlacementSelect ? labelPlacementSelect.value : "right",
        required: !!(requiredInput && requiredInput.checked),
        supportingText: (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "You can change this later in settings.") : "",
        showError: !!(showErrorInput && showErrorInput.checked),
        errorText: errorTextInput ? (errorTextInput.value.trim() || "Select an option to continue.") : ""
      };
    }

    function currentSelectionInfo(){
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        opts: currentOpts()
      };
    }

    function render(){
      var label = (labelInput.value || "").trim() || DEFAULT_LABEL;
      var opts = currentOpts();

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(size, label, opts);
        combos.push({ size: size, label: optionLabelFor(SIZE_OPTIONS, size) });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, opts); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, opts); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "radio-size-dropdown-label",
        onChange: render
      });
    }

    if (labelInput){
      labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (labelPlacementSelect) labelPlacementSelect.addEventListener("change", render);
    if (requiredInput) requiredInput.addEventListener("change", render);
    if (showSupportingInput && supportingTextFieldWrap){
      showSupportingInput.addEventListener("change", function(){
        supportingTextFieldWrap.hidden = !showSupportingInput.checked;
        render();
      });
    }
    if (supportingTextInput) supportingTextInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (showErrorInput && errorTextFieldWrap){
      showErrorInput.addEventListener("change", function(){
        errorTextFieldWrap.hidden = !showErrorInput.checked;
        render();
      });
    }
    if (errorTextInput) errorTextInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    render();
  });
})();
