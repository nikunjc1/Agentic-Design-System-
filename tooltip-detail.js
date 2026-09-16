(() => {
  "use strict";

  // Placement of the tooltip bubble relative to its trigger. Each type's
  // arrow "points" back at the trigger - since the arrow is a rotated
  // square (a diamond, symmetric on every axis), the pointing direction is
  // really carried by *position* (which side of the trigger the bubble sits
  // on), not by a different rotation per type.
  var TYPES = [
    { key: "top", label: "Top" },
    { key: "bottom", label: "Bottom" },
    { key: "left", label: "Left" },
    { key: "right", label: "Right" }
  ];

  // Content states a tooltip's bubble can hold. "long-text" always uses its
  // own longer example string, regardless of the Text content property,
  // specifically to demonstrate wrap behavior at a fixed max-width.
  var STATES = [
    { key: "plain", label: "Plain text" },
    { key: "rich", label: "Rich" },
    { key: "long-text", label: "Long text" }
  ];

  var LONG_TEXT_EXAMPLE = "This action cannot be undone once you confirm it.";
  var RICH_TITLE = "Keyboard shortcut";
  var RICH_DESCRIPTION = "Press Cmd+K to open";

  // Hand-tuned padding/font-size per size - must stay identical to the real
  // .tooltip-demo-bubble--* rules in shell.css (not re-derived by formula)
  // so Copy Code reproduces exactly what the Live Preview matrix is
  // showing, at every size, not just the one size a formula happens to
  // agree with. Literal lookup, same convention as SIZE_SCALE elsewhere.
  var SIZE_MAP = {
    small: { pad: "4px 8px", font: 11 },
    default: { pad: "6px 10px", font: 12 },
    large: { pad: "8px 12px", font: 13 }
  };
  var SIZE_OPTIONS = [
    { value: "small", label: "Small" },
    { value: "default", label: "Default" },
    { value: "large", label: "Large" }
  ];
  var DEFAULT_SIZE = "default";
  var DEFAULT_TEXT = "Add to favorites";
  var DEFAULT_SHOW_ARROW = true;

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

  function sizeLabel(sizeKey){
    return optionLabelFor(SIZE_OPTIONS, sizeKey);
  }

  function sizeInfoFor(sizeKey){
    return SIZE_MAP[sizeKey] || SIZE_MAP[DEFAULT_SIZE];
  }

  function bubbleContentFor(stateKey, text){
    if (stateKey === "rich"){
      return '<span class="tooltip-demo-title">' + escapeHtml(RICH_TITLE) + '</span>' +
        '<span class="tooltip-demo-description">' + escapeHtml(RICH_DESCRIPTION) + "</span>";
    }
    if (stateKey === "long-text"){
      return escapeHtml(LONG_TEXT_EXAMPLE);
    }
    return escapeHtml(text);
  }

  // Renders one trigger+bubble pair. DOM order is always bubble, then the
  // (optional) arrow, then trigger - .tooltip-demo-wrap--<type> alone
  // decides how that DOM order gets laid out visually (column vs
  // column-reverse vs row vs row-reverse), so this function never needs to
  // special-case per-type ordering itself.
  //
  // Everything here lives in normal document flow (no position:absolute) -
  // this is the deliberate fix for the overlap bug this codebase has hit
  // before with small floating panels (see .autocomplete-demo-panel /
  // .autocomplete-demo-field:has() in shell.css): an in-flow bubble+arrow
  // naturally pushes its own matrix cell/row taller instead of overlapping
  // whatever sits next to it.
  function buildTooltipField(typeKey, stateKey, sizeKey, text, showArrow){
    var size = sizeInfoFor(sizeKey);
    var bubbleCls = "tooltip-demo-bubble tooltip-demo-bubble--" + sizeKey + (stateKey === "long-text" ? " is-long-text" : "");
    var bubbleStyle = "padding:" + size.pad + ";font-size:" + size.font + "px;";
    var bubbleHtml = '<div class="' + bubbleCls + '" style="' + bubbleStyle + '">' + bubbleContentFor(stateKey, text) + "</div>";
    var arrowHtml = showArrow ? '<div class="tooltip-demo-arrow" aria-hidden="true"></div>' : "";
    var triggerHtml = '<button type="button" class="tooltip-demo-trigger" tabindex="-1" aria-hidden="true">?</button>';
    return '<div class="tooltip-demo-wrap tooltip-demo-wrap--' + typeKey + '">' + bubbleHtml + arrowHtml + triggerHtml + "</div>";
  }

  function buildFullPrompt(sizeKey, text, showArrow){
    sizeKey = sizeKey || DEFAULT_SIZE;
    text = (text || DEFAULT_TEXT).trim() || DEFAULT_TEXT;
    if (showArrow === undefined || showArrow === null) showArrow = DEFAULT_SHOW_ARROW;
    var size = sizeInfoFor(sizeKey);

    var lines = [];
    lines.push("Create a complete Tooltip component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (placement, size, content state) - a small floating label anchored to a trigger element on one of 4 sides, with a connecting arrow, not a one-off floating div built from scratch each time.");
    lines.push("");
    lines.push("Placements (4): Top, Bottom, Left, Right - the bubble sits on the given side of the trigger, with a small arrow connecting it back to the trigger. Top's arrow points down at the trigger below it, Bottom's arrow points up at the trigger above it, Left's arrow points right at the trigger beside it, Right's arrow points left at the trigger beside it.");
    lines.push("");
    lines.push("Content states (3): Plain text (a single line of text only); Rich (a bold title line plus a smaller description line below it, e.g. \"" + RICH_TITLE + "\" / \"" + RICH_DESCRIPTION + "\"); Long text (wraps to 2-3 lines at a max-width around 180px instead of forcing the bubble wider).");
    lines.push("");
    lines.push("Visual treatment: one consistent look regardless of placement or content state - this is a neutral utility component, not semantically colored like Alert or Toast. Background var(--graphite-700), color var(--text-hi), the arrow a small rotated square (transform:rotate(45deg)) in the same background color, positioned so it visually connects the bubble to the trigger.");
    lines.push("");
    lines.push("Component properties: Size (Small/Default/Large, controls padding and font-size) - currently " + sizeLabel(sizeKey) + " (" + size.pad + " padding, " + size.font + "px font). Show arrow (boolean, toggles the connecting arrow) - currently " + (showArrow ? "shown" : "hidden") + ". Text content (string, used by the Plain text state) - currently \"" + text + "\".");
    return lines.join("\n");
  }

  function buildFullCode(sizeKey, text, showArrow){
    sizeKey = sizeKey || DEFAULT_SIZE;
    text = (text || DEFAULT_TEXT).trim() || DEFAULT_TEXT;
    if (showArrow === undefined || showArrow === null) showArrow = DEFAULT_SHOW_ARROW;
    var size = sizeInfoFor(sizeKey);

    var lines = [];
    lines.push("/* Agentic Design System - Tooltip component */");
    lines.push(".tooltip-demo-wrap{ box-sizing:border-box; display:flex; align-items:center; gap:8px; }");
    lines.push("/* DOM order is always bubble, arrow, trigger - flex-direction alone");
    lines.push("   decides which side the bubble visually lands on per placement. */");
    lines.push(".tooltip-demo-wrap--top, .tooltip-demo-wrap--bottom{ flex-direction:column; }");
    lines.push(".tooltip-demo-wrap--bottom{ flex-direction:column-reverse; }");
    lines.push(".tooltip-demo-wrap--left{ flex-direction:row; }");
    lines.push(".tooltip-demo-wrap--right{ flex-direction:row-reverse; }");
    lines.push("");
    lines.push(".tooltip-demo-trigger{ flex:none; width:28px; height:28px; border-radius:9999px; background:var(--graphite-800); border:1px solid var(--line-strong); color:var(--text-dim); display:flex; align-items:center; justify-content:center; font-size:13px; cursor:default; }");
    lines.push("");
    lines.push("/* Size - explicitly chosen: " + sizeLabel(sizeKey) + " */");
    lines.push(".tooltip-demo-bubble{ box-sizing:border-box; background:var(--graphite-700); color:var(--text-hi); border-radius:var(--radius-sm); font-family:var(--font-body); white-space:nowrap; padding:" + size.pad + "; font-size:" + size.font + "px; }");
    lines.push(".tooltip-demo-bubble.is-long-text{ white-space:normal; max-width:180px; }");
    lines.push(".tooltip-demo-title{ display:block; font-weight:600; font-size:inherit; }");
    lines.push(".tooltip-demo-description{ display:block; font-size:11px; color:var(--text-mid); }");
    if (showArrow){
      lines.push("");
      lines.push("/* Arrow - a small rotated square, same background as the bubble */");
      lines.push(".tooltip-demo-arrow{ flex:none; width:8px; height:8px; background:var(--graphite-700); transform:rotate(45deg); margin:-4px auto; }");
      lines.push(".tooltip-demo-wrap--left .tooltip-demo-arrow, .tooltip-demo-wrap--right .tooltip-demo-arrow{ margin:auto -4px; }");
    }
    lines.push("");
    lines.push("<!-- Example usage - one per placement, at the chosen Size" + (showArrow ? "" : " (arrow hidden)") + " -->");
    TYPES.forEach(function(t){
      lines.push(buildTooltipField(t.key, "plain", sizeKey, text, showArrow));
    });
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

    // Gallery-card copy CTA + click-to-navigate (tooltip.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-tooltip"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-tooltip"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_SIZE, DEFAULT_TEXT, DEFAULT_SHOW_ARROW), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_SIZE, DEFAULT_TEXT, DEFAULT_SHOW_ARROW), cardCopyCodeBtn);
      });
    }
    var tooltipTypeCards = document.querySelectorAll(".tooltip-type-card[data-system]");
    tooltipTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "tooltip-" + card.dataset.system + ".html";
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
    // by name with its own "Copy" button. Tooltip has no multiselect
    // property (Size is a single-value <select>), so it always calls this
    // with an empty combos array - the "0 or 1 combos = plain button"
    // branch every existing driver script already has.
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

    var matrixContainer = document.querySelector('[data-role="tooltip-matrix-container"]');
    if (!matrixContainer) return;

    var sizeSelect = document.querySelector('[data-role="tooltip-size-select"]');
    var textInput = document.querySelector('[data-role="tooltip-text"]');
    var showArrowInput = document.querySelector('[data-role="tooltip-show-arrow"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(sizeKey, text, showArrow){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildTooltipField(t.key, state.key, sizeKey, text, showArrow) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      return {
        sizeKey: sizeSelect ? sizeSelect.value : DEFAULT_SIZE,
        text: (textInput ? textInput.value.trim() : "") || DEFAULT_TEXT,
        showArrow: showArrowInput ? showArrowInput.checked : DEFAULT_SHOW_ARROW
      };
    }

    function render(){
      var values = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(values.sizeKey, values.text, values.showArrow);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(values.sizeKey, values.text, values.showArrow); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(values.sizeKey, values.text, values.showArrow); }, [], function(){ return ""; });
    }

    if (sizeSelect) sizeSelect.addEventListener("change", render);
    if (textInput) textInput.addEventListener("input", render);
    if (showArrowInput) showArrowInput.addEventListener("change", render);

    render();
  });
})();
