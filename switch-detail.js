(() => {
  "use strict";

  // Check/line glyphs for the optional in-thumb state icons - small enough
  // to never be the PRIMARY signal of state (track color + thumb position
  // already carry that), per the spec's "don't rely on icons/color alone" guidance.
  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6L9 17l-5-5"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 12h12"/></svg>';

  var TYPES = [
    { key: "compact", label: "Compact" },
    { key: "labeled", label: "Labeled" }
  ];
  var STATES = [
    { key: "off", cls: "", label: "Off", checked: false },
    { key: "on", cls: "", label: "On", checked: true },
    { key: "hover", cls: " is-hover", label: "Hover", checked: false },
    { key: "focus", cls: " is-focus", label: "Focused", checked: false },
    { key: "disabled", cls: " is-disabled", label: "Disabled", checked: false, disabled: true },
    { key: "loading", cls: " is-loading", label: "Loading", checked: true, disabled: true, loading: true }
  ];

  var FULL_SPEC = {
    compact: { purpose: "Just the toggle itself, with no visible text label - use where the surrounding context already explains what's being toggled, like a table row or a toolbar." },
    labeled: { purpose: "Toggle plus a text label to its right - use as a standalone control where the setting needs its own visible name, like a settings panel." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function liveCssFor(){
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var graphite600 = getCssVar("--graphite-600", "#383D44");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF4253");
    return {
      off: "background:" + graphite700 + "; thumb background:#FFFFFF, thumb sits at the left.",
      on: "background:" + red500 + "; thumb background:#FFFFFF, thumb slides to the right.",
      hover: "background:" + graphite600 + " (off-state only).",
      focus: "outline:2px solid " + getCssVar("--color-focus-ring", red400) + "; outline-offset:2px;",
      disabled: "opacity:0.4; cursor:not-allowed;"
    };
  }

  // Hand-tuned width/thumb/travel per track height - must stay identical to
  // the real .switch-demo-track--h*/.switch-demo-thumb rules in shell.css
  // (both sides built from the same width = round(height * 1.75), thumb =
  // height - 4, travel = width - thumb - 4 formula, decided once here) so
  // Copy Code reproduces exactly what the Live Preview matrix is showing,
  // at every size, not just one size a formula happens to agree with.
  var SIZE_SCALE = {
    "20": { width: 35, thumb: 16, travel: 15 },
    "24": { width: 42, thumb: 20, travel: 18 },
    "32": { width: 56, thumb: 28, travel: 24 }
  };

  // Size option list - small toggle-track scale (20-32px), shared between
  // the page's own multi-select dropdown and the Copy Prompt/Copy Code
  // generators below. Switches are always fully pill-shaped, so unlike
  // Button/Input/Group Button there is no Corner radius property here.
  var SIZE_OPTIONS = [
    { value: "20", label: "20px - S" },
    { value: "24", label: "24px - M" },
    { value: "32", label: "32px - L" }
  ];
  var FALLBACK_DEFAULTS = { size: "24" };
  var DEFAULT_LABEL = "Enable notifications";

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function parseLabel(raw){
    var v = (raw || "").trim();
    return v || DEFAULT_LABEL;
  }

  function escapeAttr(s){
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
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
    var css = liveCssFor();

    var lines = [];
    lines.push("Create a complete Switch (toggle) component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, state) - a pill-shaped track with a sliding circular thumb that flips a single setting on or off, not a checkbox merely styled to look like one.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (" + STATES.length + ", same visual treatment for both types): " + STATES.map(function(state){ return state.label; }).join(", ") + ".");
    lines.push("- Off: " + css.off);
    lines.push("- On: " + css.on);
    lines.push("- Hover: " + css.hover);
    lines.push("- Focused: " + css.focus + " Never just a color change, so the focus ring stays visible against every other state.");
    lines.push("- Disabled: " + css.disabled);
    lines.push("- Loading: show the On track with a spinner inside the thumb, at the same 40% opacity as Disabled. Disable toggling, use a wait cursor and set aria-busy=\"true\".");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Track width scales with height (width = height x 1.75, rounded); thumb size and travel distance scale with it too.");
    lines.push("");
    var opts = selectionInfo.opts || {};
    lines.push("Component properties: Label (editable text next to the switch, shown for the Labeled type and used as the accessible name for both, placement Left or Right of the switch - currently " + (opts.labelPlacement || "right") + "), Required (boolean, shows a required indicator after the label, Labeled type only - currently " + (opts.required ? "yes" : "no") + "), State icons (boolean, shows a check mark inside the thumb when On and a short line when Off - never relied on alone to communicate state, since track color/thumb position always change too - currently " + (opts.showIcons ? "shown" : "hidden") + "), Supporting text (optional helper text below the switch), Error/status (boolean - only meaningful when the switch is tied to a real business rule or action, not a generic required-field validator).");
    if (opts.showError) lines.push("Current error message: \"" + opts.errorText + "\".");
    else if (opts.supportingText) lines.push("Current supporting text: \"" + opts.supportingText + "\".");
    lines.push("");
    lines.push("Toggle behavior: clicking or pressing Space flips Off/On immediately by default. For an asynchronous update, show Loading on the toggled-to value, then either settle there on success or revert to the previous value and surface the error message on failure - never leave the control stuck on an optimistic value the backend rejected.");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var graphite600 = getCssVar("--graphite-600", "#383D44");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF4253");
    var textHi = getCssVar("--text-hi", "#111827");

    var lines = [];
    lines.push("/* Agentic Design System - Switch (toggle) component */");
    lines.push('.switch-demo-field{ position:relative; display:inline-flex; flex-direction:column; align-items:flex-start; gap:var(--space-4); cursor:pointer; }');
    lines.push(".switch-demo-row{ display:inline-flex; align-items:center; gap:var(--space-10); }");
    lines.push('.switch-demo-input{ position:absolute; width:var(--dimension-1); height:var(--dimension-1); padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }');
    lines.push('.switch-demo-track{ position:relative; display:inline-flex; align-items:center; box-sizing:border-box; border-radius:var(--radius-full); background:' + graphite700 + '; padding:0 var(--space-2); cursor:pointer; flex:none; transition:background-color .15s ease, outline-color .15s ease; }');
    lines.push('.switch-demo-thumb{ border-radius:50%; background:#FFFFFF; transform:translateX(0); transition:transform .15s ease; flex:none; display:flex; align-items:center; justify-content:center; color:' + graphite700 + '; }');
    lines.push('.switch-demo-label{ font-size:var(--type-body-size); color:' + textHi + '; font-family:var(--font-body); }');
    lines.push(".switch-demo-field--label-left .switch-demo-row{ flex-direction:row-reverse; }");
    lines.push(".switch-demo-required{ color:var(--danger-500); }");
    lines.push(".switch-demo-note{ font-size:var(--type-caption-size); color:var(--text-dim); margin:var(--space-4) 0 0; }");
    lines.push(".switch-demo-note.is-error{ color:var(--danger-700); }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (track height in px) - not chosen yet, default is 24 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".switch-demo-track--h" + size + "{ width:" + scale.width + "px; height:" + size + "px; }");
      lines.push(".switch-demo-track--h" + size + " .switch-demo-thumb{ width:" + scale.thumb + "px; height:" + scale.thumb + "px; }");
      lines.push(".switch-demo-field:has(.switch-demo-input:checked) .switch-demo-track--h" + size + " .switch-demo-thumb{ transform:translateX(" + scale.travel + "px); }");
    });
    lines.push("");
    lines.push("/* States (5) - Off, On, Hover, Focused, Disabled - shared by both types */");
    lines.push(".switch-demo-field:has(.switch-demo-input:checked) .switch-demo-track{ background:" + red500 + "; }");
    lines.push(".switch-demo-track:hover, .switch-demo-track.is-hover{ background:" + graphite600 + "; }");
    lines.push(".switch-demo-field:has(.switch-demo-input:focus-visible) .switch-demo-track, .switch-demo-track.is-focus{ outline:2px solid " + getCssVar("--color-focus-ring", red400) + "; outline-offset:2px; }");
    lines.push(".switch-demo-field:has(.switch-demo-input:disabled) .switch-demo-track, .switch-demo-track.is-disabled{ opacity:0.4; cursor:not-allowed; }");
    lines.push("");
    var opts = selectionInfo.opts || {};
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var thumbIconHtml = opts.showIcons ? ICON_CHECK : "";
    var requiredHtml = opts.required ? '<span class="switch-demo-required" aria-hidden="true"> *</span>' : "";
    var noteHtml = opts.showError ? '<p class="switch-demo-note is-error">' + opts.errorText + "</p>" : (opts.supportingText ? '<p class="switch-demo-note">' + opts.supportingText + "</p>" : "");
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + ", switched on -->");
    TYPES.forEach(function(t){
      var showLabel = t.key === "labeled";
      lines.push('<label class="switch-demo-field' + (opts.labelPlacement === "left" ? " switch-demo-field--label-left" : "") + '">');
      lines.push('  <input type="checkbox" role="switch" class="switch-demo-input" aria-label="' + DEFAULT_LABEL + '" checked />');
      lines.push('  <span class="switch-demo-row">');
      lines.push('    <span class="switch-demo-track switch-demo-track--h' + exampleSize + '"><span class="switch-demo-thumb">' + thumbIconHtml + '</span></span>');
      if (showLabel) lines.push('    <span class="switch-demo-label">' + DEFAULT_LABEL + requiredHtml + '</span>');
      lines.push('  </span>');
      lines.push('</label>');
      if (noteHtml) lines.push(noteHtml);
    });
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Builds the prompt/code for exactly ONE Size, fully resolved (never
  // "ask the question") - used by the Copy prompt/Copy code dropdown's
  // per-combination "Copy" buttons.
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

    // Gallery-card copy CTA + click-to-navigate (switch.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-switch"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-switch"]');
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
    var switchTypeCards = document.querySelectorAll(".switch-type-card[data-system]");
    switchTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "switch-" + card.dataset.system + ".html";
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
    // Size is in play) or, whenever more than one size is currently
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

    var matrixContainer = document.querySelector('[data-role="switch-matrix-container"]');
    if (!matrixContainer) return;

    var labelInput = document.querySelector('[data-role="switch-label"]');
    var sizeMount = document.querySelector('[data-role="switch-size-mount"]');
    var labelPlacementSelect = document.querySelector('[data-role="switch-label-placement"]');
    var requiredInput = document.querySelector('[data-role="switch-required"]');
    var showIconsInput = document.querySelector('[data-role="switch-show-icons"]');
    var showSupportingInput = document.querySelector('[data-role="switch-show-supporting"]');
    var supportingTextInput = document.querySelector('[data-role="switch-supporting-text"]');
    var supportingTextFieldWrap = document.querySelector('[data-role="switch-supporting-text-field"]');
    var showErrorInput = document.querySelector('[data-role="switch-show-error"]');
    var errorTextInput = document.querySelector('[data-role="switch-error-text"]');
    var errorTextFieldWrap = document.querySelector('[data-role="switch-error-text-field"]');
    var simulateFailureInput = document.querySelector('[data-role="switch-simulate-failure"]');
    var interactiveMount = document.querySelector('[data-role="switch-interactive"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function currentOpts(){
      return {
        labelPlacement: labelPlacementSelect ? labelPlacementSelect.value : "right",
        required: !!(requiredInput && requiredInput.checked),
        showIcons: !!(showIconsInput && showIconsInput.checked),
        supportingText: (showSupportingInput && showSupportingInput.checked) ? (supportingTextInput.value.trim() || "Changes apply immediately.") : "",
        showError: !!(showErrorInput && showErrorInput.checked),
        errorText: errorTextInput ? (errorTextInput.value.trim() || "Couldn't save this change. Try again.") : ""
      };
    }

    function buildSwitchDemo(typeKey, state, size, labelText, opts){
      opts = opts || {};
      var trackCls = "switch-demo-track switch-demo-track--h" + size + state.cls;
      var checkedAttr = state.checked ? " checked" : "";
      var disabledAttr = state.disabled ? " disabled" : "";
      var busyAttr = state.loading ? ' aria-busy="true"' : "";
      var thumbInner = state.loading ? '<span class="switch-demo-spinner"></span>' : (opts.showIcons ? (state.checked ? ICON_CHECK : ICON_OFF) : "");
      var requiredHtml = opts.required ? '<span class="switch-demo-required" data-contract-part="required" aria-hidden="true"> *</span>' : "";
      var labelSpan = typeKey === "labeled" ? '<span class="switch-demo-label" data-contract-part="label">' + escapeAttr(labelText) + requiredHtml + "</span>" : "";
      // data-contract-part gives the Figma capture a stable identity for
      // each part, independent of DOM position - same reasoning as
      // checkbox-detail.js's own buildCheckboxCell().
      // data-contract-kind="container" - the thumb is a real bordered/
      // filled circle shape, but is childless whenever showIcons/loading
      // are both off (the common default) - a childless <span> gets
      // misclassified as a glyph-only TEXT node by tag name alone, and
      // Figma TEXT nodes can't carry a background, silently dropping the
      // thumb's entire visible appearance (the reported "circle is
      // missing") in every state that happens to be childless at capture
      // time - same bug class already fixed for Checkbox's box/Radio's
      // circle, same fix.
      var noteHtml = opts.showError ? '<p class="switch-demo-note is-error" data-contract-part="error">' + escapeAttr(opts.errorText || "") + "</p>" : (opts.supportingText ? '<p class="switch-demo-note" data-contract-part="supporting">' + escapeAttr(opts.supportingText) + "</p>" : "");
      // row wraps track+label so the field itself can stack row-then-note
      // vertically - previously the field was a single flex row holding
      // input+track+label+note all side by side with no wrap, so the note
      // rendered beside the label instead of below it (same bug already
      // fixed for Checkbox/Radio's field, same fix: the field becomes a
      // column, this row stays the original horizontal arrangement).
      var rowHtml = '<span class="switch-demo-row" data-contract-part="row"><span class="' + trackCls + '" data-contract-part="box" data-contract-kind="container"><span class="switch-demo-thumb" data-contract-kind="container">' + thumbInner + "</span></span>" + labelSpan + "</span>";
      // Foundation audit UX10 - one cell of a side-by-side state comparison,
      // not a real switch; tabindex="-1" keeps it out of the Tab sequence
      // without removing it from the accessibility tree.
      return '<label class="switch-demo-field' + (opts.labelPlacement === "left" ? " switch-demo-field--label-left" : "") + '">' +
        '<input type="checkbox" role="switch" class="switch-demo-input" data-contract-part="input" tabindex="-1" aria-label="' + escapeAttr(labelText) + '"' + checkedAttr + disabledAttr + busyAttr + " />" +
        rowHtml +
        noteHtml +
        "</label>";
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

    function buildMatrixSection(size, labelText, opts){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildSwitchDemo(t.key, state, size, labelText, opts) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        opts: currentOpts()
      };
    }

    // The comparison matrix above freezes Off/On per row to show every
    // state at once - real click/Space-to-toggle behavior (plus the
    // simulated async failure-and-revert from spec item 10) doesn't fit
    // that format, so it lives here instead, in its own always-interactive
    // instance, the same "Try it" pattern Group Button/Select use.
    var interactiveOn = false, interactiveLoading = false, interactiveErrored = false;
    function renderInteractive(){
      if (!interactiveMount) return;
      var opts = currentOpts();
      var labelText = parseLabel(labelInput.value);
      var size = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size)[0];
      var scale = SIZE_SCALE[size];
      var trackCls = "switch-demo-track switch-demo-track--h" + size + (interactiveLoading ? " is-loading" : "");
      var thumbInner = interactiveLoading ? '<span class="switch-demo-spinner"></span>' : (opts.showIcons ? (interactiveOn ? ICON_CHECK : ICON_OFF) : "");
      var noteText = interactiveErrored ? opts.errorText : opts.supportingText;
      var noteHtml = noteText ? '<p class="switch-demo-note' + (interactiveErrored ? " is-error" : "") + '">' + escapeAttr(noteText) + "</p>" : "";
      interactiveMount.innerHTML = '<label class="switch-demo-field' + (opts.labelPlacement === "left" ? " switch-demo-field--label-left" : "") + '">' +
        '<input type="checkbox" role="switch" class="switch-demo-input" aria-label="' + escapeAttr(labelText) + '"' + (interactiveOn ? " checked" : "") + (interactiveLoading ? ' aria-busy="true" disabled' : "") + " />" +
        '<span class="switch-demo-row">' +
          '<span class="' + trackCls + '"><span class="switch-demo-thumb">' + thumbInner + "</span></span>" +
          '<span class="switch-demo-label">' + escapeAttr(labelText) + (opts.required ? '<span class="switch-demo-required" aria-hidden="true"> *</span>' : "") + "</span>" +
        "</span>" +
        "</label>" + noteHtml;
      var input = interactiveMount.querySelector(".switch-demo-input");
      input.addEventListener("change", function(){
        var nextValue = input.checked;
        interactiveErrored = false;
        var shouldFail = !!(simulateFailureInput && simulateFailureInput.checked);
        if (shouldFail){
          interactiveLoading = true;
          renderInteractive();
          setTimeout(function(){
            interactiveLoading = false;
            interactiveErrored = true;
            if (simulateFailureInput) simulateFailureInput.checked = false;
            // Reverts to the value from before this toggle - an optimistic
            // update a backend rejected must never leave the control
            // stuck showing the value that didn't actually take effect.
            renderInteractive();
          }, 700);
        } else {
          interactiveOn = nextValue;
          renderInteractive();
        }
      });
    }

    function render(){
      var labelText = parseLabel(labelInput.value);
      var opts = currentOpts();
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(size, labelText, opts);
        combos.push({ size: size, label: comboLabel(size) });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, opts); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, opts); });
      renderInteractive();
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "switch-size-dropdown-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (labelPlacementSelect) labelPlacementSelect.addEventListener("change", render);
    if (requiredInput) requiredInput.addEventListener("change", render);
    if (showIconsInput) showIconsInput.addEventListener("change", render);
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
