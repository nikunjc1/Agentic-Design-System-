(() => {
  "use strict";

  // Progress has 2 layouts (linear bar / circular ring) and 3 states (which
  // percent value drives the fill and which color it renders in). Percent
  // and Show label are plain inputs, not a multiselect property, so - like
  // Timeline's driver script - there is no combos array/dropdown copy
  // control here, just a single matrix at the current property values.
  var TYPES = [
    { key: "linear", label: "Linear" },
    { key: "circular", label: "Circular" }
  ];
  var STATES = [
    { key: "in-progress", label: "In progress" },
    { key: "success", label: "Success" },
    { key: "error", label: "Error" }
  ];

  var ERROR_PERCENT = 40;

  function clampPercent(n){
    n = Math.round(Number(n));
    if (isNaN(n)) return 0;
    return Math.max(0, Math.min(100, n));
  }

  // Success always reads as fully complete and Error always reads as a
  // fixed, stalled/failed value - only "In progress" reflects the live
  // Percent property, since it is the only state that represents an
  // operation still in flight.
  function cellPercent(stateKey, percent){
    if (stateKey === "success") return 100;
    if (stateKey === "error") return ERROR_PERCENT;
    return percent;
  }

  function cellColorVar(stateKey){
    if (stateKey === "success") return "var(--green-500)";
    if (stateKey === "error") return "var(--danger-600)";
    return "var(--red-500)";
  }

  // Error and "In progress" are both red-family tokens in this system
  // (--danger-500 is literally an alias of --red-500), so a same-color fill
  // would not read as a distinct state. Error is pulled apart from
  // in-progress two ways: it uses the darker --danger-600 rather than
  // --red-500, and its fill is a diagonal hazard-stripe pattern (linear) or
  // a dashed outline (circular) rather than a plain solid color - both
  // verified visually distinct from the solid in-progress red via headless
  // Chrome screenshot zoom.
  function buildProgressField(typeKey, stateKey, percent, showLabel){
    var pct = cellPercent(stateKey, percent);
    var labelHtml = showLabel ? '<span class="progress-demo-label">' + pct + "%</span>" : "";

    if (typeKey === "linear"){
      var fillModClass = stateKey === "success" ? " progress-demo-fill--success" : stateKey === "error" ? " progress-demo-fill--error" : "";
      return '<div class="progress-demo-linear">' +
        '<div class="progress-demo-track"><div class="progress-demo-fill' + fillModClass + '" style="width:' + pct + '%;"></div></div>' +
        labelHtml +
        "</div>";
    }

    var color = cellColorVar(stateKey);
    var wrapClass = "progress-demo-circular" + (stateKey === "error" ? " progress-demo-circular--error" : "");
    var bg = "conic-gradient(" + color + " calc(" + pct + "*1%), var(--graphite-700) 0)";
    return '<div class="' + wrapClass + '" style="background:' + bg + ';">' +
      '<div class="progress-demo-circular-inner"></div>' +
      (showLabel ? '<span class="progress-demo-label">' + pct + "%</span>" : "") +
      "</div>";
  }

  function buildFullPrompt(percent, showLabel){
    var lines = [];
    lines.push("Create a complete Progress component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (layout, state, percent, show label) - a visual indicator of completion percentage, used for uploads, multi-step processes, loading operations, or any quantifiable completion state.");
    lines.push("");
    lines.push("Layouts (2):");
    lines.push("- Linear: a horizontal track with a fill bar that grows left-to-right to the current percent.");
    lines.push("- Circular: a ring track with a fill arc that sweeps clockwise to the current percent.");
    lines.push("");
    lines.push("States (3):");
    lines.push("- In progress: uses the live Percent property value, filled in the accent color - represents an operation still running.");
    lines.push("- Success: always shows 100% complete, filled in green - represents a finished operation, regardless of the Percent property.");
    lines.push("- Error: always shows a fixed, partial value (" + ERROR_PERCENT + "%), filled in a darker red with a diagonal hazard-stripe pattern (linear) or a dashed outline (circular) rather than a plain solid fill - represents a stalled or failed operation, visually distinct from the in-progress state even though both are red-family colors.");
    lines.push("");
    lines.push("Component properties: Percent (0-100, default " + percent + " - drives only the In progress state's fill), Show label (boolean, default " + (showLabel ? "on" : "off") + " - " + (showLabel ? "shows" : "hides") + " the percentage as text alongside the bar or ring).");
    return lines.join("\n");
  }

  function buildFullCode(percent, showLabel){
    var lines = [];
    lines.push("/* Agentic Design System - Progress component */");
    lines.push(".progress-demo-linear{ display:flex; align-items:center; gap:10px; width:220px; }");
    lines.push(".progress-demo-track{ flex:1 1 auto; height:8px; border-radius:9999px; background:var(--graphite-700); overflow:hidden; }");
    lines.push(".progress-demo-fill{ height:100%; border-radius:9999px; background:var(--red-500); }");
    lines.push(".progress-demo-fill--success{ background:var(--green-500); }");
    lines.push(".progress-demo-fill--error{ background: repeating-linear-gradient(135deg, var(--danger-600) 0 6px, var(--danger-500) 6px 12px); }");
    lines.push(".progress-demo-label{ flex:none; font-family:var(--font-mono); font-size:12px; color:var(--text-mid); min-width:36px; text-align:right; }");
    lines.push("");
    lines.push(".progress-demo-circular{ position:relative; width:72px; height:72px; border-radius:9999px; display:flex; align-items:center; justify-content:center; }");
    lines.push(".progress-demo-circular--error{ outline: 2px dashed var(--danger-600); outline-offset: 2px; }");
    lines.push(".progress-demo-circular-inner{ position:absolute; inset:8px; border-radius:9999px; background:var(--graphite-950); }");
    lines.push(".progress-demo-circular .progress-demo-label{ position:relative; z-index:1; text-align:center; min-width:0; }");
    lines.push("");
    lines.push("<!-- Example usage - Linear layout, In progress state -->");
    lines.push('<div class="progress-demo-linear">');
    lines.push('  <div class="progress-demo-track">');
    lines.push('    <div class="progress-demo-fill" style="width:' + percent + '%;"></div>');
    lines.push("  </div>");
    if (showLabel) lines.push('  <span class="progress-demo-label">' + percent + "%</span>");
    lines.push("</div>");
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

    // Gallery-card copy CTA + click-to-navigate (progress.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-progress"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-progress"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(65, true), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(65, true), cardCopyCodeBtn);
      });
    }
    var progressTypeCards = document.querySelectorAll(".progress-type-card[data-system]");
    progressTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "progress-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button or, whenever more
    // than one combo is passed in, a disclosure dropdown listing each combo
    // by name with its own "Copy" button. Progress has no multiselect
    // property (Percent is a number input, Show label is a checkbox), so it
    // always calls this with an empty combos array - the "0 or 1 combos =
    // plain button" branch every existing driver script already has.
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

    var matrixContainer = document.querySelector('[data-role="progress-matrix-container"]');
    if (!matrixContainer) return;

    var percentInput = document.querySelector('[data-role="progress-percent-input"]');
    var showLabelInput = document.querySelector('[data-role="progress-show-label"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(percent, showLabel){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildProgressField(t.key, state.key, percent, showLabel) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function render(){
      var percent = clampPercent(percentInput ? percentInput.value : 65);
      var showLabel = !!(showLabelInput && showLabelInput.checked);
      matrixContainer.innerHTML = buildMatrixSection(percent, showLabel);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(percent, showLabel); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(percent, showLabel); }, [], function(){ return ""; });
    }

    if (percentInput){
      percentInput.addEventListener("input", function(){
        var clamped = clampPercent(percentInput.value);
        if (String(clamped) !== percentInput.value) percentInput.value = clamped;
        render();
      });
    }
    if (showLabelInput) showLabelInput.addEventListener("change", render);

    render();
  });
})();
