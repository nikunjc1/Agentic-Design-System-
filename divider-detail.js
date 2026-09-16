(() => {
  "use strict";

  // Divider is NOT interactive - no hover/focus/disabled states exist for a
  // plain rule. Its "states" dimension instead represents line-style
  // variants (solid/dashed/dotted), an honest structural difference rather
  // than a fake interaction state, so there is no liveCssFor()/pseudo-class
  // logic anywhere in this file.
  var TYPES = [
    { key: "horizontal-plain", label: "Horizontal" },
    { key: "horizontal-text", label: "Horizontal with text" },
    { key: "vertical", label: "Vertical" }
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

  // Renders one divider example. "horizontal-plain" ignores text/align
  // entirely (a plain line has nothing to position). "horizontal-text"
  // positions the label per the align value by giving the two flanking
  // segments unequal flex proportions. "vertical" is shown in realistic
  // context between two example words, since a bare vertical rule alone
  // doesn't communicate what it's for.
  function buildDividerField(typeKey, stateKey, text, align){
    if (typeKey === "horizontal-plain"){
      return '<div class="divider-demo-line divider-demo-line--' + stateKey + '"></div>';
    }
    if (typeKey === "horizontal-text"){
      var label = escapeHtml((text || DEFAULT_TEXT).trim() || DEFAULT_TEXT);
      var alignKey = align || DEFAULT_ALIGN;
      return '<div class="divider-demo-line-text divider-demo-line-text--' + alignKey + '">' +
        '<span class="divider-demo-line-segment divider-demo-line--' + stateKey + '"></span>' +
        '<span class="divider-demo-label">' + label + "</span>" +
        '<span class="divider-demo-line-segment divider-demo-line--' + stateKey + '"></span>' +
        "</div>";
    }
    // vertical
    return '<span class="divider-demo-inline-context">' +
      "<span>Settings</span>" +
      '<span class="divider-demo-vline divider-demo-vline--' + stateKey + '"></span>' +
      "<span>Logout</span>" +
      "</span>";
  }

  function buildFullPrompt(text, align){
    text = (text || DEFAULT_TEXT).trim() || DEFAULT_TEXT;
    align = align || DEFAULT_ALIGN;

    var lines = [];
    lines.push("Create a complete Divider component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (form, line style, text label, text alignment) - a thin rule that visually separates content, not a one-off <hr> or border hack rebuilt per screen.");
    lines.push("");
    lines.push("Divider is not interactive - unlike every other component in this system, it has no hover, focus or disabled state. Its variation is purely structural: 3 forms, each in 3 line styles.");
    lines.push("");
    lines.push("Forms (3):");
    lines.push("- Horizontal: a plain full-width horizontal line with no text, used to separate stacked blocks of content.");
    lines.push("- Horizontal with text: a horizontal line broken by a short text label (e.g. \"" + text + "\"), positioned at the chosen Text alignment.");
    lines.push("- Vertical: a short vertical rule about 0.9em tall, meant to sit inline between two pieces of text to separate items in a row, like breadcrumb-adjacent text.");
    lines.push("");
    lines.push("Line styles (3, apply to every form): Solid, Dashed, Dotted - set via border-style. Line color var(--line-strong), label text color var(--text-dim).");
    lines.push("");
    lines.push("Component properties: Text label (string, applies only to Horizontal with text) - currently \"" + text + "\". Text alignment (Left/Center/Right, applies only to Horizontal with text, controls how much line sits on each side of the label) - currently " + alignLabel(align) + ".");
    return lines.join("\n");
  }

  function buildFullCode(text, align){
    text = (text || DEFAULT_TEXT).trim() || DEFAULT_TEXT;
    align = align || DEFAULT_ALIGN;

    var lines = [];
    lines.push("/* Agentic Design System - Divider component */");
    lines.push(".divider-demo-line{ width:160px; height:0; border-top-width:1.5px; border-top-color:var(--line-strong); }");
    lines.push(".divider-demo-line--solid{ border-top-style:solid; }");
    lines.push(".divider-demo-line--dashed{ border-top-style:dashed; }");
    lines.push(".divider-demo-line--dotted{ border-top-style:dotted; }");
    lines.push("");
    lines.push("/* Horizontal with text - two segments (reusing the line-style");
    lines.push("   modifiers above) flank a centered/left/right label */");
    lines.push(".divider-demo-line-text{ display:flex; align-items:center; gap:12px; width:220px; }");
    lines.push(".divider-demo-line-segment{ flex:1 1 auto; height:0; border-top-width:1.5px; border-top-color:var(--line-strong); }");
    lines.push(".divider-demo-line-text--left .divider-demo-line-segment:first-child{ flex:0 0 16px; }");
    lines.push(".divider-demo-line-text--right .divider-demo-line-segment:last-child{ flex:0 0 16px; }");
    lines.push(".divider-demo-label{ font-family:var(--font-body); font-size:13px; color:var(--text-dim); white-space:nowrap; }");
    lines.push("");
    lines.push("/* Vertical - a short inline rule between two pieces of text */");
    lines.push(".divider-demo-vline{ display:inline-block; width:0; height:14px; border-left-width:1.5px; border-left-color:var(--line-strong); margin:0 8px; vertical-align:middle; }");
    lines.push(".divider-demo-vline--solid{ border-left-style:solid; }");
    lines.push(".divider-demo-vline--dashed{ border-left-style:dashed; }");
    lines.push(".divider-demo-vline--dotted{ border-left-style:dotted; }");
    lines.push("");
    lines.push("<!-- Example usage - one per form, Solid line style, at the chosen Text label/alignment -->");
    lines.push(buildDividerField("horizontal-plain", "solid", text, align));
    lines.push(buildDividerField("horizontal-text", "solid", text, align));
    lines.push(buildDividerField("vertical", "solid", text, align));
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
    // by name with its own "Copy" button. Divider has no multiselect
    // property (Text alignment is a single-value <select>), so it always
    // calls this with an empty combos array - the "0 or 1 combos = plain
    // button" branch every existing driver script already has.
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
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(text, align){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildDividerField(t.key, state.key, text, align) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      return {
        text: (textInput ? textInput.value.trim() : "") || DEFAULT_TEXT,
        align: alignSelect ? alignSelect.value : DEFAULT_ALIGN
      };
    }

    function render(){
      var values = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(values.text, values.align);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(values.text, values.align); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(values.text, values.align); }, [], function(){ return ""; });
    }

    if (textInput) textInput.addEventListener("input", render);
    if (alignSelect) alignSelect.addEventListener("change", render);

    render();
  });
})();
