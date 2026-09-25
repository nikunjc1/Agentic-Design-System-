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
    return (v || fallback).toUpperCase();
  }

  function radioCoreCss(){
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textDim = getCssVar("--text-dim", "#64686F");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.1)");
    return {
      unchecked: "border:1.5px solid " + lineStrong + ";background:transparent;",
      checked: "border-color:" + red500 + ";background:transparent;",
      dot: "background:" + red500 + ";border-radius:50%;",
      hover: "border-color:" + textDim + ";",
      focus: "outline:2px solid " + red400 + ";outline-offset:2px;",
      disabled: "opacity:0.4;cursor:not-allowed;",
      cardChecked: "background:" + redTint + ";border-color:" + red500 + ";"
    };
  }

  // Hand-tuned circle/dot diameters per size - must stay identical to the
  // real .radio-demo-circle--h*/.radio-demo-dot--h* rules in shell.css (not
  // re-derived by formula) so Copy Code reproduces exactly what the Live
  // Preview matrix is showing, at every size, not just one a formula agrees
  // with. Dot is ~45% of the outer circle diameter.
  var SIZE_SCALE = {
    "16": { dot: 7 },
    "20": { dot: 9 },
    "24": { dot: 11 }
  };

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
    lines.push("Component properties: Label (editable text next to the circle).");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textDim = getCssVar("--text-dim", "#64686F");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.1)");

    var lines = [];
    lines.push("/* Agentic Design System - Radio component */");
    lines.push(".radio-demo-field{ display:inline-flex; align-items:center; gap:8px; cursor:pointer; }");
    lines.push('.radio-demo-input{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }');
    lines.push(".radio-demo-circle{ box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; flex:none; border-radius:50%; border:1.5px solid " + lineStrong + "; background:transparent; transition:border-color .15s ease, background-color .15s ease, outline-color .15s ease; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (circle diameter in px) - not chosen yet, default is 20 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".radio-demo-circle--h" + size + "{ width:" + size + "px; height:" + size + "px; }");
      lines.push(".radio-demo-dot--h" + size + "{ width:" + scale.dot + "px; height:" + scale.dot + "px; }");
    });
    lines.push("");
    lines.push("/* Checked - real :checked via the adjacent-sibling selector, dot is a separate nested span. .is-checked is the class-based fallback for static illustrations with no real sibling input to drive :checked from - every other state (hover/focus/disabled) already has one. */");
    lines.push(".radio-demo-input:checked + .radio-demo-circle, .radio-demo-circle.is-checked{ border-color:" + red500 + "; background:transparent; }");
    lines.push(".radio-demo-dot{ background:" + red500 + "; border-radius:50%; }");
    lines.push("");
    lines.push("/* Hover - real :hover combined with a static .is-hover class for demoing the state without a real mouse */");
    lines.push(".radio-demo-circle:hover, .radio-demo-circle.is-hover{ border-color:" + textDim + "; }");
    lines.push("");
    lines.push("/* Focused - real :focus-visible on the (visually hidden but focusable) input, combined with .is-focus */");
    lines.push(".radio-demo-input:focus-visible + .radio-demo-circle, .radio-demo-circle.is-focus{ outline:2px solid " + red400 + "; outline-offset:2px; }");
    lines.push("");
    lines.push("/* Disabled - real :disabled combined with .is-disabled */");
    lines.push(".radio-demo-input:disabled + .radio-demo-circle, .radio-demo-circle.is-disabled{ opacity:0.4; cursor:not-allowed; }");
    lines.push("");
    lines.push(".radio-demo-label{ font-size:14px; color:" + textHi + "; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    lines.push("/* Card type - the whole row highlights once its radio is checked */");
    lines.push(".radio-demo-card{ display:flex; align-items:center; gap:10px; padding:10px 14px; border:1.5px solid " + lineStrong + "; border-radius:var(--radius-md); transition:background-color .15s ease, border-color .15s ease; }");
    lines.push(".radio-demo-card.is-checked{ background:" + redTint + "; border-color:" + red500 + "; }");
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + ", checked -->");
    TYPES.forEach(function(t){
      var field = '<label class="radio-demo-field radio-demo-field--' + t.key + '">' +
        '<input type="radio" class="radio-demo-input" name="radio-demo-example-' + t.key + '" checked />' +
        '<span class="radio-demo-circle radio-demo-circle--h' + exampleSize + '"><span class="radio-demo-dot radio-demo-dot--h' + exampleSize + '"></span></span>' +
        '<span class="radio-demo-label">' + DEFAULT_LABEL + '</span>' +
      '</label>';
      lines.push(t.key === "card" ? '<div class="radio-demo-card is-checked">' + field + '</div>' : field);
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size, fully resolved (never "ask
  // the question") - used by the Copy prompt/Copy code dropdown's own
  // per-size "Copy" buttons.
  function buildComboPrompt(size){
    return buildFullPrompt({ size: { mode: "specific", values: [size] } });
  }

  function buildComboCode(size){
    return buildFullCode({ size: { mode: "specific", values: [size] } });
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
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildRadioField(typeKey, state, size, label){
      var isChecked = state.key === "checked";
      var isDisabled = state.key === "disabled";
      var circleCls = "radio-demo-circle radio-demo-circle--h" + size + state.cls;
      var inputName = "radio-demo-" + size + "-" + typeKey + "-" + state.key;
      var checkedAttr = isChecked ? " checked" : "";
      var disabledAttr = isDisabled ? " disabled" : "";
      var dotSpan = isChecked ? '<span class="radio-demo-dot radio-demo-dot--h' + size + '"></span>' : "";
      var field = '<label class="radio-demo-field radio-demo-field--' + typeKey + '">' +
        '<input type="radio" class="radio-demo-input" name="' + inputName + '"' + checkedAttr + disabledAttr + " />" +
        '<span class="' + circleCls + '">' + dotSpan + "</span>" +
        '<span class="radio-demo-label">' + escapeHtml(label) + "</span>" +
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

    function buildMatrixSection(size, label){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildRadioField(t.key, state, size, label) + "</td>";
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
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size])
      };
    }

    function render(){
      var label = (labelInput.value || "").trim() || DEFAULT_LABEL;

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(size, label);
        combos.push({ size: size, label: optionLabelFor(SIZE_OPTIONS, size) });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size); });
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

    render();
  });
})();
