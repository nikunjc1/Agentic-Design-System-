(() => {
  "use strict";

  // Divider is NOT interactive - no hover/focus/disabled states exist for a
  // plain rule. Its "states" dimension instead represents line-style
  // variants (solid/dashed/dotted), an honest structural difference rather
  // than a fake interaction state, so there is no liveCssFor()/pseudo-class
  // logic anywhere in this file.
  var TYPES = [
    { key: "horizontal-plain", label: "Horizontal" },
    { key: "horizontal-text", label: "Horizontal with text" }
  ];
  var STATES = [
    { key: "solid", label: "Solid" },
    { key: "dashed", label: "Dashed" },
    { key: "dotted", label: "Dotted" }
  ];

  var ALIGN_OPTIONS = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" }
  ];
  var DEFAULT_TEXT = "OR";
  var DEFAULT_ALIGN = "center";

  // Size (3) - Ant documents small/medium(default)/large - a bare rule's
  // own thickness plus its label's font-size.
  var SIZE_OPTIONS = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" }
  ];
  var DEFAULT_SIZE = "medium";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function alignLabel(align){
    return optionLabelFor(ALIGN_OPTIONS, align);
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

  // Renders one divider example. "horizontal-plain" ignores text/align
  // entirely (a plain line has nothing to position). "horizontal-text"
  // positions the label per the align value by giving the two flanking
  // segments unequal flex proportions.
  function buildDividerField(typeKey, stateKey, text, align, sizeKey){
    var sizeCls = (sizeKey && sizeKey !== "medium") ? " divider-demo-sz-" + sizeKey : "";
    if (typeKey === "horizontal-plain"){
      return '<div class="divider-demo-line divider-demo-line--' + stateKey + sizeCls + '"></div>';
    }
    // horizontal-text
    var label = escapeHtml((text || DEFAULT_TEXT).trim() || DEFAULT_TEXT);
    var alignKey = align || DEFAULT_ALIGN;
    return '<div class="divider-demo-line-text divider-demo-line-text--' + alignKey + sizeCls + '">' +
      '<span class="divider-demo-line-segment divider-demo-line--' + stateKey + '"></span>' +
      '<span class="divider-demo-label">' + label + "</span>" +
      '<span class="divider-demo-line-segment divider-demo-line--' + stateKey + '"></span>' +
      "</div>";
  }

  function buildFullPrompt(text, align, sizeInfo){
    text = (text || DEFAULT_TEXT).trim() || DEFAULT_TEXT;
    align = align || DEFAULT_ALIGN;
    sizeInfo = sizeInfo || selectionMode(null, SIZE_OPTIONS);

    var lines = [];
    lines.push("Create a complete Divider component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (form, line style, size, text label, text alignment) - a thin rule that visually separates content, not a one-off <hr> or border hack rebuilt per screen.");
    lines.push("");
    lines.push("Divider is not interactive - unlike every other component in this system, it has no hover, focus or disabled state. Its variation is purely structural: 2 forms, each in 3 line styles and 3 sizes.");
    lines.push("");
    lines.push("Forms (2):");
    lines.push("- Horizontal: a plain full-width horizontal line with no text, used to separate stacked blocks of content.");
    lines.push("- Horizontal with text: a horizontal line broken by a short text label (e.g. \"" + text + "\"), positioned at the chosen Text alignment.");
    lines.push("");
    lines.push("Line styles (3, apply to every form): Solid, Dashed, Dotted - set via border-style. Line color var(--line-strong), label text color var(--text-dim).");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Scales line thickness and label font-size together - Medium is the line-weight shown above.");
    lines.push("");
    lines.push("Component properties: Text label (string, applies only to Horizontal with text) - currently \"" + text + "\". Text alignment (Left/Center/Right, applies only to Horizontal with text, controls how much line sits on each side of the label) - currently " + alignLabel(align) + ". Size.");
    return lines.join("\n");
  }

  function buildFullCode(text, align, sizeInfo){
    text = (text || DEFAULT_TEXT).trim() || DEFAULT_TEXT;
    align = align || DEFAULT_ALIGN;
    sizeInfo = sizeInfo || selectionMode(null, SIZE_OPTIONS);
    var exampleSize = sizeInfo.mode === "all" ? DEFAULT_SIZE : sizeInfo.values[0];

    var lines = [];
    lines.push("/* Agentic Design System - Divider component */");
    lines.push(".divider-demo-line{ width:160px; height:0; border-top-width:1.5px; border-top-color:var(--line-strong); margin-inline:auto; }");
    lines.push(".divider-demo-line--solid{ border-top-style:solid; }");
    lines.push(".divider-demo-line--dashed{ border-top-style:dashed; }");
    lines.push(".divider-demo-line--dotted{ border-top-style:dotted; }");
    lines.push("");
    lines.push("/* Horizontal with text - two segments (reusing the line-style");
    lines.push("   modifiers above) flank a centered/left/right label */");
    lines.push(".divider-demo-line-text{ display:flex; align-items:center; gap:12px; width:220px; margin-inline:auto; }");
    lines.push(".divider-demo-line-segment{ flex:1 1 auto; height:0; border-top-width:1.5px; border-top-color:var(--line-strong); }");
    lines.push(".divider-demo-line-text--left .divider-demo-line-segment:first-child{ flex:0 0 16px; }");
    lines.push(".divider-demo-line-text--right .divider-demo-line-segment:last-child{ flex:0 0 16px; }");
    lines.push(".divider-demo-label{ font-family:var(--font-body); font-size:13px; color:var(--text-dim); white-space:nowrap; }");
    lines.push("");
    lines.push("/* Size (3) - Medium is the default (the base widths/weights above) */");
    lines.push(".divider-demo-line.divider-demo-sz-small{ border-top-width:1px; }");
    lines.push(".divider-demo-line.divider-demo-sz-large{ border-top-width:2px; }");
    lines.push(".divider-demo-line-text--left.divider-demo-sz-small .divider-demo-label, .divider-demo-line-text--center.divider-demo-sz-small .divider-demo-label, .divider-demo-line-text--right.divider-demo-sz-small .divider-demo-label{ font-size:12px; }");
    lines.push(".divider-demo-line-text--left.divider-demo-sz-large .divider-demo-label, .divider-demo-line-text--center.divider-demo-sz-large .divider-demo-label, .divider-demo-line-text--right.divider-demo-sz-large .divider-demo-label{ font-size:14px; }");
    lines.push("");
    lines.push("<!-- Example usage - one per form, Solid line style" + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + ", at the chosen Text label/alignment -->");
    lines.push(buildDividerField("horizontal-plain", "solid", text, align, exampleSize));
    lines.push(buildDividerField("horizontal-text", "solid", text, align, exampleSize));
    return lines.join("\n");
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

    // Gallery-card copy CTA + click-to-navigate (divider.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-divider"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-divider"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_TEXT, DEFAULT_ALIGN), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_TEXT, DEFAULT_ALIGN), cardCopyCodeBtn);
      });
    }

    var dividerTypeCards = document.querySelectorAll(".divider-type-card[data-system]");
    dividerTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "divider-" + card.dataset.system + ".html";
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

    // Renders either a plain Copy prompt/Copy code button or, whenever more
    // than one combo is passed in, a disclosure dropdown listing each combo
    // by name with its own "Copy" button. Text alignment is still a
    // single-value <select>, but Size is now a real multiselect, so
    // combos.length can be >1 once more than one Size is checked - the
    // "0 or 1 combos = plain button" branch every existing driver script
    // already has.
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

    var matrixContainer = document.querySelector('[data-role="divider-matrix-container"]');
    if (!matrixContainer) return;

    var textInput = document.querySelector('[data-role="divider-text"]');
    var alignSelect = document.querySelector('[data-role="divider-align-select"]');
    var sizeMount = document.querySelector('[data-role="divider-size-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function buildMatrixSection(text, align, size){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildDividerField(t.key, state.key, text, align, size) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + optionLabelFor(SIZE_OPTIONS, size) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentValues(){
      return {
        text: (textInput ? textInput.value.trim() : "") || DEFAULT_TEXT,
        align: alignSelect ? alignSelect.value : DEFAULT_ALIGN
      };
    }

    function currentSizeInfo(){
      return selectionMode(propertyMultiSelect, SIZE_OPTIONS, [DEFAULT_SIZE]);
    }

    function render(){
      var values = currentValues();
      var sizes = selectedOrDefault(propertyMultiSelect, SIZE_OPTIONS, DEFAULT_SIZE);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(values.text, values.align, size);
        combos.push({ size: size, label: optionLabelFor(SIZE_OPTIONS, size) });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(values.text, values.align, currentSizeInfo()); }, combos, function(c){ return buildFullPrompt(values.text, values.align, { mode: "specific", values: [c.size] }); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(values.text, values.align, currentSizeInfo()); }, combos, function(c){ return buildFullCode(values.text, values.align, { mode: "specific", values: [c.size] }); });
    }

    var propertyMultiSelect = null;
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelect = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [DEFAULT_SIZE],
        ariaLabel: "Size options",
        labelledBy: "divider-size-dropdown-label",
        onChange: render
      });
    }

    if (textInput) textInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (alignSelect) alignSelect.addEventListener("change", render);

    render();
  });
})();
