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
    { key: "indeterminate", cls: "", label: "Indeterminate" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    standard: { purpose: "Just the box and its label, inline - the default treatment for a single agreement checkbox or a compact list of options." },
    card: { purpose: "The box and label wrapped in a bordered row that highlights as a whole (background var(--red-tint), border var(--red-500)) when checked - useful for settings lists or selectable option cards where the entire row should read as selected, not just the box." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // Box treatment is identical across both Types - only the Card type adds
  // an outer wrapper that highlights as a whole when checked, so liveCssFor
  // returns the shared box states plus an optional card highlight.
  function liveCssFor(typeKey){
    if (typeKey === "primary") return {
      rest: "background:var(--button-primary-bg-default);color:var(--button-primary-text-default);",
      hover: "background:var(--button-primary-bg-hover);color:var(--button-primary-text-hover);",
      pressed: "background:var(--button-primary-bg-active);color:var(--button-primary-text-active);"
    };
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textDim = getCssVar("--text-dim", "#69707D");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF4253");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.08)");

    var result = {
      box: {
        unchecked: "color:" + lineStrong + ";",
        checked: "color:" + red500 + ";",
        indeterminate: "color:" + red500 + ";",
        hover: "color:" + textDim + ";",
        focus: "outline:2px solid " + getCssVar("--color-focus-ring", red400) + ";outline-offset:2px;",
        disabled: "opacity:0.4;cursor:not-allowed;"
      }
    };
    if (typeKey === "card"){
      result.card = "background:" + redTint + ";border-color:" + red500 + ";";
    }
    return result;
  }

  // Hand-tuned box size (px) and inner icon size (px) per Size option - must
  // stay identical to the real .checkbox-demo-box--h*/--icon rules in the
  // scratch CSS (not re-derived by formula) so Copy Code reproduces exactly
  // what the Live Preview matrix is showing, at every size.
  var SIZE_SCALE = {
    "16": { box: 16, icon: 10 },
    "20": { box: 20, icon: 12 },
    "24": { box: 24, icon: 14 }
  };

  // Size / Corner radius option lists - a small scale of their own (not the
  // 24-56px height / 0-12px radius scale shared by Button/Input/Group
  // Button) since the checkbox box itself is typically 16-24px.
  var SIZE_OPTIONS = [
    { value: "16", label: "16px - S" },
    { value: "20", label: "20px - M" },
    { value: "24", label: "24px - L" }
  ];
  // Foundation audit - every sitewide Radius philosophy's own --radius-md
  // value (sharp 4, compact 6, balanced 8, soft 12, expressive 16) needs a
  // matching preset here, or liveRadiusDefault()'s closest-match snapping
  // below has nowhere to land past "8/Rounded" - soft and expressive used
  // to both silently cap out at 8px, the live default never actually
  // reaching 12 or 16 despite the sitewide setting genuinely changing.
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "2", label: "2px - Subtle" },
    { value: "4", label: "4px - Balanced" },
    { value: "6", label: "6px - Soft" },
    { value: "8", label: "8px - Rounded" },
    { value: "12", label: "12px - Expressive" },
    { value: "16", label: "16px - Bold" },
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
  var FALLBACK_DEFAULTS = { size: "20", radius: liveRadiusDefault("4") };
  var DEFAULT_LABEL = (document.body && document.body.dataset.defaultLabel) || "I agree to the terms";

  var CHECK_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6L9 17l-5-5"/></svg>';
  var DASH_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M5 12h14"/></svg>';

  // Box artwork - each icon draws the complete box (frame + mark) as one
  // combined shape, fill="currentColor" so a single CSS color drives the
  // whole icon per state, matching this project's foundation color tokens
  // (set via .checkbox-demo-box's color, same tokens the old bordered box
  // used for border-color/background). Replaces the previous bordered-div
  // + separately-overlaid checkmark/dash with the user-supplied Material
  // Symbols artwork; the icon's own frame has a small fixed rounding baked
  // into its path, so it no longer tracks the Corner Radius property - the
  // previous box did, since its shape came from a real CSS border-radius.
  var CHECK_BOX_OUTLINE_BLANK_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM5 19H19V5H5V19Z"/></svg>';
  var CHECK_BOX_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M10.6 16.2L17.65 9.15L16.25 7.75L10.6 13.4L7.75 10.55L6.35 11.95L10.6 16.2ZM5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5Z"/></svg>';
  var INDETERMINATE_CHECK_BOX_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7 13H17V11H7V13ZM5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM5 19H19V5H5V19Z"/></svg>';

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

    var lines = [];
    lines.push("Create a complete Checkbox component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, state) - a small square selection control with 3 possible values (unchecked, checked, indeterminate), always paired with a text label, not a one-off checkbox glued to text. The box itself is Material Symbols icon artwork (check_box_outline_blank / check_box / indeterminate_check_box, one combined frame+mark shape each, fill:currentColor) rather than a CSS-bordered box - its small corner rounding is baked into the artwork, not a configurable property.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Unchecked (check_box_outline_blank icon): " + css.box.unchecked);
      lines.push("  Checked (check_box icon): " + css.box.checked);
      lines.push("  Indeterminate (indeterminate_check_box icon): " + css.box.indeterminate);
      lines.push("  Hover: " + css.box.hover);
      lines.push("  Focused: " + css.box.focus + " Never just a color change, so the control stays visible against any background.");
      if (t.key === "card"){
        lines.push("  Card highlight (applies to the whole row, only when checked): " + css.card);
      }
    });
    lines.push("");
    lines.push("States (6): Unchecked, Checked, Indeterminate, Hover, Focused, Disabled.");
    lines.push("- Checked and Indeterminate are distinguished by icon only (check_box vs indeterminate_check_box), both colored the same.");
    lines.push("- Indeterminate is set via the element's `indeterminate` DOM property at runtime, not an HTML attribute.");
    lines.push("- Disabled applies 40% opacity and a not-allowed cursor to the control.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Controls the box's width and height in px.");
    lines.push("");
    var opts = selectionInfo.opts || {};
    lines.push("Component properties: Label (editable text next to the box, placement Left or Right of the box - currently " + (opts.labelPlacement || "right") + "), Required (boolean, shows a required indicator after the label - currently " + (opts.required ? "yes" : "no") + "), Supporting text (optional helper text below the label), Error (boolean, shows validation error styling/message below the label instead of supporting text when both are on).");
    if (opts.showError) lines.push("Current error message: \"" + opts.errorText + "\".");
    else if (opts.supportingText) lines.push("Current supporting text: \"" + opts.supportingText + "\".");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Checkbox component */");
    lines.push('.checkbox-demo-field{ display:inline-flex; flex-direction:column; align-items:flex-start; gap:var(--space-4); cursor:pointer; font-family:var(--font-body); }');
    lines.push(".checkbox-demo-field.is-disabled{ cursor:not-allowed; }");
    lines.push(".checkbox-demo-row{ display:inline-flex; align-items:center; gap:var(--space-10); }");
    lines.push(".checkbox-demo-input{ position:absolute; width:var(--dimension-1); height:var(--dimension-1); padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (box width/height in px) - not chosen yet, default is 20 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".checkbox-demo-box--h" + size + "{ width:" + scale.box + "px; height:" + scale.box + "px; }");
    });
    lines.push("");
    lines.push("/* Box IS the icon - frame+mark drawn as one combined shape (fill:currentColor), colored per state. Its small corner rounding is baked into the artwork, not a configurable property. */");
    var css = liveCssFor("standard");
    lines.push(".checkbox-demo-box{ box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; flex:none; transition:color .15s ease; " + css.box.unchecked + " }");
    lines.push(".checkbox-demo-field:has(.checkbox-demo-input:checked) .checkbox-demo-box, .checkbox-demo-box.is-checked{ " + css.box.checked + " }");
    lines.push(".checkbox-demo-field:has(.checkbox-demo-input:indeterminate) .checkbox-demo-box{ " + css.box.indeterminate + " }");
    lines.push(".checkbox-demo-box:hover, .checkbox-demo-box.is-hover{ " + css.box.hover + " }");
    lines.push(".checkbox-demo-field:has(.checkbox-demo-input:focus-visible) .checkbox-demo-box, .checkbox-demo-box.is-focus{ " + css.box.focus + " }");
    lines.push(".checkbox-demo-field:has(.checkbox-demo-input:disabled) .checkbox-demo-box, .checkbox-demo-box.is-disabled{ " + css.box.disabled + " }");
    lines.push(".checkbox-demo-icon{ display:flex; width:100%; height:100%; }");
    lines.push(".checkbox-demo-icon svg{ width:100%; height:100%; display:block; }");
    lines.push(".checkbox-demo-label{ font-size:var(--type-body-size); color:var(--text-hi); max-width:var(--dimension-220); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    lines.push("/* Card type (2nd Types option) - whole row highlights when checked */");
    var cardCss = liveCssFor("card");
    lines.push(".checkbox-demo-card{ display:flex; flex-direction:column; align-items:flex-start; padding:var(--space-12) var(--space-14); border:var(--border-width-1) var(--border-style) var(--line-strong); border-radius:var(--radius-md); transition:background-color .15s ease, border-color .15s ease; }");
    lines.push(".checkbox-demo-card.is-checked{ " + cardCss.card + " }");
    lines.push("");
    lines.push("/* Disabled - 40% opacity, not-allowed cursor */");
    lines.push(".checkbox-demo-field:has(.checkbox-demo-input:disabled) .checkbox-demo-label{ opacity:0.7; max-width:var(--dimension-220); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    lines.push("/* Required indicator / supporting+error text below the label */");
    lines.push(".checkbox-demo-required{ color:var(--danger-500); }");
    lines.push(".checkbox-demo-note{ font-size:var(--type-caption-size); color:var(--text-dim); margin:var(--space-4) 0 0; }");
    lines.push(".checkbox-demo-note.is-error{ color:var(--danger-700); }");
    lines.push(".checkbox-demo-field--label-left .checkbox-demo-row{ flex-direction:row-reverse; }");
    lines.push("");
    var opts = selectionInfo.opts || {};
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var requiredHtml = opts.required ? '<span class="checkbox-demo-required" aria-hidden="true"> *</span>' : "";
    var noteHtml = opts.showError ? '  <p class="checkbox-demo-note is-error">' + opts.errorText + "</p>"
      : (opts.supportingText ? '  <p class="checkbox-demo-note">' + opts.supportingText + "</p>" : "");
    lines.push("<!-- Example usage - one checked instance per type" + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + " -->");
    TYPES.forEach(function(t){
      if (t.key === "card") lines.push('<div class="checkbox-demo-card is-checked">');
      lines.push('<label class="checkbox-demo-field checkbox-demo-field--' + t.key + (opts.labelPlacement === "left" ? " checkbox-demo-field--label-left" : "") + '">');
      lines.push('  <input type="checkbox" class="checkbox-demo-input" checked' + (opts.required ? " required" : "") + ' />');
      lines.push('  <span class="checkbox-demo-row">');
      lines.push('    <span class="checkbox-demo-box checkbox-demo-box--h' + exampleSize + '">');
      lines.push('      <span class="checkbox-demo-icon">' + CHECK_BOX_SVG + '</span>');
      lines.push('    </span>');
      lines.push('    <span class="checkbox-demo-label">' + DEFAULT_LABEL + requiredHtml + '</span>');
      lines.push('  </span>');
      lines.push('</label>');
      if (noteHtml) lines.push(noteHtml);
      if (t.key === "card") lines.push('</div>');
    });
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Builds the prompt/code for exactly ONE Size x Corner radius
  // combination, fully resolved (never "ask the question") - used by the
  // Copy prompt/Copy code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(size, radius, opts){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      opts: opts
    });
  }

  function buildComboCode(size, radius, opts){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      opts: opts
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
    }

    // Gallery-card copy CTA + click-to-navigate (checkbox.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-checkbox"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-checkbox"]');
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
    var checkboxTypeCards = document.querySelectorAll(".checkbox-type-card[data-system]");
    checkboxTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "checkbox-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="checkbox-matrix-container"]');
    if (!matrixContainer) return;

    var labelInput = document.querySelector('[data-role="checkbox-label"]');
    var sizeMount = document.querySelector('[data-role="checkbox-size-mount"]');
    var radiusMount = document.querySelector('[data-role="checkbox-radius-mount"]');
    var labelPlacementSelect = document.querySelector('[data-role="checkbox-label-placement"]');
    var requiredInput = document.querySelector('[data-role="checkbox-required"]');
    var showSupportingInput = document.querySelector('[data-role="checkbox-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="checkbox-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="checkbox-supporting-text-field"]');
    var showErrorInput = document.querySelector('[data-role="checkbox-show-error"]');
    var errorTextInput = document.querySelector('[data-role="checkbox-error-text"]');
    var errorTextFieldWrap = document.querySelector('[data-role="checkbox-error-text-field"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildCheckboxCell(typeKey, stateKey, stateCls, size, radius, label, opts){
      opts = opts || {};
      var isChecked = stateKey === "checked";
      var isIndeterminate = stateKey === "indeterminate";
      var isDisabled = stateKey === "disabled";
      var checkedAttr = isChecked ? " checked" : "";
      var indeterminateAttr = isIndeterminate ? ' data-indeterminate="true"' : "";
      var disabledAttr = isDisabled ? " disabled" : "";
      var requiredAttr = opts.required ? " required" : "";
      var boxCls = "checkbox-demo-box checkbox-demo-box--h" + size + stateCls;
      // The box IS the icon now (frame+mark combined in one piece of
      // artwork) - always exactly one of the three, never layered/
      // conditionally empty the way the old border-box+overlaid-checkmark
      // pair was.
      var iconSvg = isChecked ? CHECK_BOX_SVG : isIndeterminate ? INDETERMINATE_CHECK_BOX_SVG : CHECK_BOX_OUTLINE_BLANK_SVG;
      var icon = '<span class="checkbox-demo-icon" data-contract-part="icon">' + iconSvg + '</span>';
      // data-contract-part gives the Figma capture a stable identity for
      // each part, independent of DOM position - labelPlacement reorders
      // the box/label pair.
      var requiredHtml = opts.required ? '<span class="checkbox-demo-required" data-contract-part="required" aria-hidden="true"> *</span>' : "";
      var boxHtml = '<span class="' + boxCls + '" data-contract-part="box">' + icon + '</span>';
      var labelHtml = '<span class="checkbox-demo-label" data-contract-part="label">' + escapeHtml(label) + requiredHtml + '</span>';
      var inner = opts.labelPlacement === "left" ? labelHtml + boxHtml : boxHtml + labelHtml;
      // Foundation audit UX10 - one cell of a side-by-side state comparison,
      // not a real checkbox; tabindex="-1" keeps it out of the Tab sequence
      // without removing it from the accessibility tree.
      var fieldClasses = "checkbox-demo-field checkbox-demo-field--" + typeKey + stateCls + (opts.labelPlacement === "left" ? " checkbox-demo-field--label-left" : "");
      var noteHtml = opts.showError
        ? '<p class="checkbox-demo-note is-error" data-contract-part="error">' + escapeHtml(opts.errorText || "") + "</p>"
        : (opts.supportingText ? '<p class="checkbox-demo-note" data-contract-part="supporting">' + escapeHtml(opts.supportingText) + "</p>" : "");
      // The note used to be appended as a sibling AFTER </label> instead of
      // nested inside it - the capture snapshots the cell's single first
      // child, so a note living outside that element entirely was
      // structurally invisible, not just unlabeled (same bug fixed in
      // switch-detail.js's buildSwitchDemo()).
      //
      // box+label are wrapped in their own "row" so the field itself can
      // stack row-then-note vertically. Previously the field was a single
      // flex row holding input+box+label+note all side by side with no
      // wrap - box/label/note all rendered on ONE line, the note running
      // off to the right of the label instead of appearing below it. With
      // many Appearance x State x Size x Radius masters each pulling that
      // row to a different total width (depending on whether Required/
      // Supporting/Error happened to be on), the pushed component set's
      // masters ended up wildly, inconsistently wide - this is the actual
      // "information structure...not working" overlap the user reported:
      // Figma's own variant grid couldn't lay out masters whose widths
      // varied this much without bleeding into each other.
      var rowHtml = '<span class="checkbox-demo-row" data-contract-part="row">' + inner + '</span>';
      var fieldHtml = '<label class="' + fieldClasses + '">' +
        '<input type="checkbox" class="checkbox-demo-input" data-contract-part="input" tabindex="-1"' + indeterminateAttr + checkedAttr + disabledAttr + requiredAttr + ' />' +
        rowHtml +
        noteHtml +
        '</label>';
      if (typeKey === "card"){
        var cardCls = "checkbox-demo-card" + (isChecked ? " is-checked" : "");
        return '<div class="' + cardCls + '">' + fieldHtml + '</div>';
      }
      return fieldHtml;
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

    function buildMatrixSection(size, radius, label, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildCheckboxCell(t.key, state.key, state.cls, size, radius, label, opts) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size, radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentOpts(){
      return {
        labelPlacement: labelPlacementSelect ? labelPlacementSelect.value : "right",
        required: !!(requiredInput && requiredInput.checked),
        supportingText: (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "You can change this later in settings.") : "",
        showError: !!(showErrorInput && showErrorInput.checked),
        errorText: errorTextInput ? (errorTextInput.value.trim() || "You must accept the terms to continue.") : ""
      };
    }

    function currentSelectionInfo(){
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius]),
        opts: currentOpts()
      };
    }

    function render(){
      var label = (labelInput.value || "").trim() || DEFAULT_LABEL;
      var opts = currentOpts();

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          html += buildMatrixSection(size, radius, label, opts);
          combos.push({ size: size, radius: radius, label: comboLabel(size, radius) });
        });
      });
      matrixContainer.innerHTML = html;

      // `indeterminate` is a DOM property, not an HTML attribute - it must
      // be set via JS after the matrix markup is inserted, on every cell
      // rendered for the Indeterminate state row.
      var indeterminateInputs = matrixContainer.querySelectorAll('.checkbox-demo-input[data-indeterminate="true"]');
      indeterminateInputs.forEach(function(el){ el.indeterminate = true; });

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.radius, opts); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.radius, opts); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "checkbox-size-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "checkbox-radius-dropdown-label",
        onChange: render
      });
    }

    if (labelInput) labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
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
