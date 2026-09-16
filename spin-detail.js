(() => {
  "use strict";

  // Spin has 3 sizes (small/default/large ring diameter) and 3 states
  // (which shows just the bare ring vs the ring plus label vs the ring and
  // label centered over a dimmed content placeholder). Label is a plain
  // text input, not a multiselect property, so - like Progress's driver
  // script - there is no combos array/dropdown copy control here, just a
  // single matrix at the current property value.
  var TYPES = [
    { key: "small", label: "Small" },
    { key: "default", label: "Default" },
    { key: "large", label: "Large" }
  ];
  var STATES = [
    { key: "spinning", label: "Spinning" },
    { key: "with-label", label: "With label" },
    { key: "overlay", label: "Overlay" }
  ];

  function escapeHtml(s){
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Spinning renders just the bare ring - no label, regardless of the
  // Label property - since it represents the leanest inline case (e.g. a
  // spinner alone inside a button). With label wraps the ring and the
  // current Label text in a row. Overlay wraps that same ring+label row
  // inside a dimmed rectangular placeholder, representing a section of
  // content temporarily covered while it loads.
  function buildSpinField(typeKey, stateKey, label){
    var ring = '<div class="spin-demo-ring spin-demo-ring--' + typeKey + '"></div>';

    if (stateKey === "spinning"){
      return ring;
    }

    var row = '<div class="spin-demo-row">' + ring + '<span class="spin-demo-label">' + escapeHtml(label) + "</span></div>";

    if (stateKey === "with-label"){
      return row;
    }

    return '<div class="spin-demo-overlay-wrap">' + row + "</div>";
  }

  function buildFullPrompt(label){
    var lines = [];
    lines.push("Create a complete Spin component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (size, state, label) - a small, continuously-rotating ring that communicates an indeterminate loading state, used inline within a button, beside text, or centered over a section of content that is loading. It has no known completion percentage or shape - distinct from Progress (a known percentage) and Skeleton (content-shaped placeholder blocks).");
    lines.push("");
    lines.push("Sizes (3):");
    lines.push("- Small: a 14px ring diameter, for tight inline placements like inside a compact button.");
    lines.push("- Default: a 20px ring diameter, for general inline or standalone use.");
    lines.push("- Large: a 28px ring diameter, for more prominent standalone loading moments.");
    lines.push("");
    lines.push("States (3):");
    lines.push("- Spinning: just the bare ring, no label - the leanest inline case, e.g. inside a button.");
    lines.push("- With label: the ring plus the Label property text shown beside it, in a row.");
    lines.push("- Overlay: the ring and label centered over a dimmed rectangular content placeholder, representing a section of the page temporarily covered while it loads.");
    lines.push("");
    lines.push('Component properties: Label (text shown beside the ring in the With label and Overlay states, default "' + label + '").');
    return lines.join("\n");
  }

  function buildFullCode(label){
    var lines = [];
    lines.push("/* Agentic Design System - Spin component */");
    lines.push("@keyframes spin-demo-rotate{ from{ transform: rotate(0deg); } to{ transform: rotate(360deg); } }");
    lines.push(".spin-demo-ring{ box-sizing:border-box; border-radius:9999px; border:2.5px solid var(--graphite-700); border-top-color:var(--red-500); animation: spin-demo-rotate 0.8s linear infinite; flex:none; }");
    lines.push(".spin-demo-ring--small{ width:14px; height:14px; border-width:2px; }");
    lines.push(".spin-demo-ring--default{ width:20px; height:20px; }");
    lines.push(".spin-demo-ring--large{ width:28px; height:28px; border-width:3px; }");
    lines.push("");
    lines.push(".spin-demo-row{ display:flex; align-items:center; gap:8px; }");
    lines.push(".spin-demo-label{ font-family:var(--font-body); font-size:12px; color:var(--text-mid); }");
    lines.push("");
    lines.push(".spin-demo-overlay-wrap{ box-sizing:border-box; width:100%; height:90px; border-radius:var(--radius-md); background:var(--graphite-850); display:flex; align-items:center; justify-content:center; border:1px solid var(--line-strong); }");
    lines.push("");
    lines.push("<!-- Example usage - Default size, With label state -->");
    lines.push('<div class="spin-demo-row">');
    lines.push('  <div class="spin-demo-ring spin-demo-ring--default"></div>');
    lines.push('  <span class="spin-demo-label">' + escapeHtml(label) + "</span>");
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

    // Gallery-card copy CTA + click-to-navigate (spin.html's listing card) -
    // separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-spin"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-spin"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt("Loading..."), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode("Loading..."), cardCopyCodeBtn);
      });
    }
    var spinTypeCards = document.querySelectorAll(".spin-type-card[data-system]");
    spinTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "spin-" + card.dataset.system + ".html";
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
    // by name with its own "Copy" button. Spin has no multiselect property
    // (Label is a plain text input), so it always calls this with an empty
    // combos array - the "0 or 1 combos = plain button" branch every
    // existing driver script already has.
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

    var matrixContainer = document.querySelector('[data-role="spin-matrix-container"]');
    if (!matrixContainer) return;

    var labelInput = document.querySelector('[data-role="spin-label-input"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(label){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildSpinField(t.key, state.key, label) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function render(){
      var label = labelInput && labelInput.value ? labelInput.value : "Loading...";
      matrixContainer.innerHTML = buildMatrixSection(label);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(label); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(label); }, [], function(){ return ""; });
    }

    if (labelInput) labelInput.addEventListener("input", render);

    render();
  });
})();
