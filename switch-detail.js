(() => {
  "use strict";

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
    return (v || fallback).toUpperCase();
  }

  function liveCssFor(){
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var graphite600 = getCssVar("--graphite-600", "#383D44");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    return {
      off: "background:" + graphite700 + "; thumb background:#FFFFFF, thumb sits at the left.",
      on: "background:" + red500 + "; thumb background:#FFFFFF, thumb slides to the right.",
      hover: "background:" + graphite600 + " (off-state only).",
      focus: "outline:2px solid " + red400 + "; outline-offset:2px;",
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
    lines.push("States (5, same visual treatment for both types):");
    lines.push("- Off: " + css.off);
    lines.push("- On: " + css.on);
    lines.push("- Hover: " + css.hover);
    lines.push("- Focused: " + css.focus + " Never just a color change, so the focus ring stays visible against every other state.");
    lines.push("- Disabled: " + css.disabled);
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Track width scales with height (width = height x 1.75, rounded); thumb size and travel distance scale with it too.");
    lines.push("");
    lines.push("Component properties: Label (editable text next to the switch, shown for the Labeled type and used as the accessible name for both).");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var graphite600 = getCssVar("--graphite-600", "#383D44");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var textHi = getCssVar("--text-hi", "#F3F2EF");

    var lines = [];
    lines.push("/* Agentic Design System - Switch (toggle) component */");
    lines.push('.switch-demo-field{ position:relative; display:inline-flex; align-items:center; gap:10px; cursor:pointer; }');
    lines.push('.switch-demo-input{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }');
    lines.push('.switch-demo-track{ position:relative; display:inline-flex; align-items:center; box-sizing:border-box; border-radius:999px; background:' + graphite700 + '; padding:0 2px; cursor:pointer; flex:none; transition:background-color .15s ease, outline-color .15s ease; }');
    lines.push('.switch-demo-thumb{ border-radius:50%; background:#FFFFFF; transform:translateX(0); transition:transform .15s ease; flex:none; }');
    lines.push('.switch-demo-label{ font-size:14px; color:' + textHi + '; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; }');
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (track height in px) - not chosen yet, default is 24 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".switch-demo-track--h" + size + "{ width:" + scale.width + "px; height:" + size + "px; }");
      lines.push(".switch-demo-track--h" + size + " .switch-demo-thumb{ width:" + scale.thumb + "px; height:" + scale.thumb + "px; }");
      lines.push(".switch-demo-input:checked + .switch-demo-track--h" + size + " .switch-demo-thumb{ transform:translateX(" + scale.travel + "px); }");
    });
    lines.push("");
    lines.push("/* States (5) - Off, On, Hover, Focused, Disabled - shared by both types */");
    lines.push(".switch-demo-input:checked + .switch-demo-track{ background:" + red500 + "; }");
    lines.push(".switch-demo-track:hover, .switch-demo-track.is-hover{ background:" + graphite600 + "; }");
    lines.push(".switch-demo-input:focus-visible + .switch-demo-track, .switch-demo-track.is-focus{ outline:2px solid " + red400 + "; outline-offset:2px; }");
    lines.push(".switch-demo-input:disabled + .switch-demo-track, .switch-demo-track.is-disabled{ opacity:0.4; cursor:not-allowed; }");
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + ", switched on -->");
    TYPES.forEach(function(t){
      var showLabel = t.key === "labeled";
      lines.push('<label class="switch-demo-field">');
      lines.push('  <input type="checkbox" role="switch" class="switch-demo-input" aria-label="' + DEFAULT_LABEL + '" checked />');
      lines.push('  <span class="switch-demo-track switch-demo-track--h' + exampleSize + '"><span class="switch-demo-thumb"></span></span>');
      if (showLabel) lines.push('  <span class="switch-demo-label">' + DEFAULT_LABEL + '</span>');
      lines.push('</label>');
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size, fully resolved (never
  // "ask the question") - used by the Copy prompt/Copy code dropdown's
  // per-combination "Copy" buttons.
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
        if (e.target.closest("button, input, select, textarea, a, [role=combobox]")) return; window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.target !== card) return;
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
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
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildSwitchDemo(typeKey, state, size, labelText){
      var trackCls = "switch-demo-track switch-demo-track--h" + size + state.cls;
      var checkedAttr = state.checked ? " checked" : "";
      var disabledAttr = state.disabled ? " disabled" : "";
      var busyAttr = state.loading ? ' aria-busy="true"' : "";
      var thumbInner = state.loading ? '<span class="switch-demo-spinner"></span>' : "";
      var labelSpan = typeKey === "labeled" ? '<span class="switch-demo-label">' + escapeAttr(labelText) + "</span>" : "";
      return '<label class="switch-demo-field">' +
        '<input type="checkbox" role="switch" class="switch-demo-input" aria-label="' + escapeAttr(labelText) + '"' + checkedAttr + disabledAttr + busyAttr + " />" +
        '<span class="' + trackCls + '"><span class="switch-demo-thumb">' + thumbInner + "</span></span>" +
        labelSpan +
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

    function buildMatrixSection(size, labelText){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildSwitchDemo(t.key, state, size, labelText) + "</td>";
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
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size])
      };
    }

    function render(){
      var labelText = parseLabel(labelInput.value);
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(size, labelText);
        combos.push({ size: size, label: comboLabel(size) });
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
        labelledBy: "switch-size-dropdown-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    render();
  });
})();
