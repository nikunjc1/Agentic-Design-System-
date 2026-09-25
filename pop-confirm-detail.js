(() => {
  "use strict";

  // Placement of the confirm bubble relative to its trigger. Same
  // in-document-flow flex-direction-per-placement technique as Popover and
  // Tooltip - the arrow "points" back at the trigger via *position* (which
  // side of the trigger the bubble sits on), not a different rotation per
  // type, since the arrow is a rotated square (a diamond, symmetric on
  // every axis).
  var TYPES = [
    { key: "top", label: "Top" },
    { key: "bottom", label: "Bottom" },
    { key: "left", label: "Left" },
    { key: "right", label: "Right" }
  ];

  // States a pop confirm's bubble can be in.
  var STATES = [
    { key: "default", label: "Default" },
    { key: "destructive", label: "Destructive" },
    { key: "with-icon", label: "With icon" }
  ];

  var DEFAULT_QUESTION = "Delete this item?";
  var DEFAULT_CONFIRM_LABEL = "Yes";
  var DEFAULT_CANCEL_LABEL = "No";

  // Same warning-triangle glyph as Alert's "warning" semantic type, reused
  // here so every "needs attention" icon in this system reads the same way.
  var WARNING_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 L21 19 L3 19 Z"></path><line x1="12" y1="10" x2="12" y2="14"></line><line x1="12" y1="16.5" x2="12" y2="16.51"></line></svg>';

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bubbleContentFor(stateKey, question, confirmLabel, cancelLabel){
    var iconHtml = stateKey === "with-icon"
      ? '<span class="popconfirm-demo-icon" aria-hidden="true">' + WARNING_ICON_SVG + "</span>"
      : "";
    var questionHtml = '<p class="popconfirm-demo-question">' + iconHtml + "<span>" + escapeHtml(question) + "</span></p>";
    var confirmClass = "popconfirm-demo-btn popconfirm-demo-btn--confirm" + (stateKey === "destructive" ? " is-destructive" : "");
    var actionsHtml = '<div class="popconfirm-demo-actions">' +
      '<button type="button" class="popconfirm-demo-btn popconfirm-demo-btn--cancel" tabindex="-1" aria-hidden="true">' + escapeHtml(cancelLabel) + "</button>" +
      '<button type="button" class="' + confirmClass + '" tabindex="-1" aria-hidden="true">' + escapeHtml(confirmLabel) + "</button>" +
      "</div>";
    return questionHtml + actionsHtml;
  }

  // Renders one trigger+bubble pair. DOM order is always bubble, then the
  // arrow, then trigger - .popconfirm-demo-wrap--<type> alone decides how
  // that DOM order gets laid out visually (column vs column-reverse vs row
  // vs row-reverse), so this function never needs to special-case per-type
  // ordering itself.
  //
  // Everything here lives in normal document flow (no position:absolute) -
  // reusing Popover/Tooltip's exact fix for the overlap bug this codebase
  // has hit before with small floating panels: an in-flow bubble+arrow
  // naturally pushes its own matrix cell/row taller instead of overlapping
  // whatever sits next to it.
  function buildPopConfirmField(typeKey, stateKey, question, confirmLabel, cancelLabel){
    var bubbleHtml = '<div class="popconfirm-demo-bubble">' + bubbleContentFor(stateKey, question, confirmLabel, cancelLabel) + "</div>";
    var arrowHtml = '<div class="popconfirm-demo-arrow" aria-hidden="true"></div>';
    var triggerHtml = '<button type="button" class="popconfirm-demo-trigger" tabindex="-1" aria-hidden="true">Delete</button>';
    return '<div class="popconfirm-demo-wrap popconfirm-demo-wrap--' + typeKey + '">' + bubbleHtml + arrowHtml + triggerHtml + "</div>";
  }

  function buildFullPrompt(question, confirmLabel, cancelLabel){
    question = (question || DEFAULT_QUESTION).trim() || DEFAULT_QUESTION;
    confirmLabel = (confirmLabel || DEFAULT_CONFIRM_LABEL).trim() || DEFAULT_CONFIRM_LABEL;
    cancelLabel = (cancelLabel || DEFAULT_CANCEL_LABEL).trim() || DEFAULT_CANCEL_LABEL;

    var lines = [];
    lines.push("Create a complete Pop Confirm component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (placement, state, question, confirm label, cancel label) - a small inline confirmation popover anchored to a trigger element, showing a short question with Confirm/Cancel buttons directly inside it, for lightweight \"are you sure?\" moments that don't warrant a full Modal.");
    lines.push("");
    lines.push("Placements (4): Top, Bottom, Left, Right - the bubble sits on the given side of the trigger, with a small arrow connecting it back to the trigger. Top's arrow points down at the trigger below it, Bottom's arrow points up at the trigger above it, Left's arrow points right at the trigger beside it, Right's arrow points left at the trigger beside it.");
    lines.push("");
    lines.push("States (3): Default (a neutral confirm button, e.g. \"" + question + "\" with \"" + cancelLabel + "\"/\"" + confirmLabel + "\" buttons); Destructive (same layout, but the confirm button is styled in the danger/red color, for an irreversible or delete-type action); With icon (same as Default, but adds a small warning-triangle icon inline before the question text).");
    lines.push("");
    lines.push("Visual treatment: reads as a proper elevated panel, matching this system's other floating-panel language (Menu, Autocomplete, Popover), but inverted against the page like a real overlay should be - near-black background in light theme, near-white in dark theme (background var(--overlay-invert-bg), NOT the normal-surface var(--graphite-900), since that's user-customizable via Foundations and would silently break the inversion), no border (box-shadow \"0 8px 24px rgba(0,0,0,0.4)\" alone gives it separation from the page), border-radius var(--radius-md). The trigger sits on the ordinary page background outside the bubble, so it keeps this system's normal, non-inverted styling - background var(--graphite-800), border 1.5px solid var(--line-strong), color var(--text-hi), padding 6px 14px, border-radius var(--radius-sm). The arrow is a small rotated square (transform:rotate(45deg)) matching the bubble's own inverted background color. The Confirm/Cancel buttons sit in a right-aligned row below the question - Cancel is a transparent/bordered button using the bubble's own inverted text color (var(--text-hi) would go near-invisible against it), Confirm is a solid neutral button by default or a solid red button in the Destructive state, both with their own fully opaque background so they stay legible regardless of the bubble's inversion.");
    lines.push("");
    lines.push("Component properties: Question (string, the short question shown in the bubble) - currently \"" + question + "\". Confirm label (string, the text on the confirm button) - currently \"" + confirmLabel + "\". Cancel label (string, the text on the cancel button) - currently \"" + cancelLabel + "\".");
    return lines.join("\n");
  }

  function buildFullCode(question, confirmLabel, cancelLabel){
    question = (question || DEFAULT_QUESTION).trim() || DEFAULT_QUESTION;
    confirmLabel = (confirmLabel || DEFAULT_CONFIRM_LABEL).trim() || DEFAULT_CONFIRM_LABEL;
    cancelLabel = (cancelLabel || DEFAULT_CANCEL_LABEL).trim() || DEFAULT_CANCEL_LABEL;

    var lines = [];
    lines.push("/* Agentic Design System - Pop Confirm component */");
    lines.push(".popconfirm-demo-wrap{ box-sizing:border-box; display:flex; align-items:center; gap:8px; }");
    lines.push("/* DOM order is always bubble, arrow, trigger - flex-direction alone");
    lines.push("   decides which side the bubble visually lands on per placement. */");
    lines.push(".popconfirm-demo-wrap--top, .popconfirm-demo-wrap--bottom{ flex-direction:column; }");
    lines.push(".popconfirm-demo-wrap--bottom{ flex-direction:column-reverse; }");
    lines.push(".popconfirm-demo-wrap--left{ flex-direction:row; }");
    lines.push(".popconfirm-demo-wrap--right{ flex-direction:row-reverse; }");
    lines.push("");
    lines.push(".popconfirm-demo-trigger{ font-family:var(--font-body); font-size:12px; font-weight:600; padding:6px 14px; border-radius:var(--radius-sm); background:var(--graphite-800); border:1.5px solid var(--line-strong); color:var(--text-hi); cursor:pointer; }");
    lines.push(".popconfirm-demo-trigger:hover{ background:var(--graphite-700); }");
    lines.push("");
    lines.push("/* Inverted against the page on purpose - near-black in light theme,");
    lines.push("   near-white in dark theme - so it pops as an overlay the way a real");
    lines.push("   confirmation popup should. Deliberately NOT var(--text-hi)/var(--");
    lines.push("   graphite-900) - both are wired into the per-theme brand color");
    lines.push("   customization on Foundations, so a saved custom color there would");
    lines.push("   silently break the inversion. var(--overlay-invert-bg)/-text (theme.css)");
    lines.push("   hold the same default values but are never touched by that");
    lines.push("   customization. .popconfirm-demo-trigger is NOT part of this - it sits");
    lines.push("   on the ordinary page background outside the bubble, so it keeps the");
    lines.push("   normal, non-inverted var(--text-hi) (see above). --cancel's border/");
    lines.push("   text are derived from var(--overlay-invert-text) at low opacity rather");
    lines.push("   than var(--line-strong)/var(--text-hi) - those tokens are calibrated");
    lines.push("   for a normal surface and var(--text-hi) specifically would render");
    lines.push("   near-black-on-near-black against the new light-theme bubble. --confirm");
    lines.push("   (both variants) keep their own fully opaque background, so they stay");
    lines.push("   self-contained regardless of what the bubble inverts to. */");
    lines.push(".popconfirm-demo-bubble{ position:relative; z-index:2; box-sizing:border-box; background:var(--overlay-invert-bg); box-shadow:0 8px 24px rgba(0,0,0,0.4); padding:12px 14px; border-radius:var(--radius-md); width:220px; text-align: start; }");
    lines.push(".popconfirm-demo-question{ display:flex; align-items:flex-start; gap:6px; font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--overlay-invert-text); margin:0; max-width:260px; overflow-wrap:anywhere; }");
    lines.push(".popconfirm-demo-icon{ flex:none; width:14px; height:14px; color:var(--amber-500); }");
    lines.push(".popconfirm-demo-actions{ display:flex; justify-content:flex-end; gap:8px; margin-top:12px; }");
    lines.push(".popconfirm-demo-btn{ font-family:var(--font-body); font-size:12px; font-weight:600; padding:6px 12px; border-radius:var(--radius-sm); cursor:pointer; border:1.5px solid transparent; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".popconfirm-demo-btn--cancel{ background:transparent; border-color:color-mix(in srgb, var(--overlay-invert-text) 30%, transparent); color:var(--overlay-invert-text); }");
    lines.push(".popconfirm-demo-btn--confirm{ background:var(--graphite-700); color:var(--text-hi); }");
    lines.push("/* var(--danger-500), not var(--red-500) - Destructive uses the fixed");
    lines.push("   danger token, same convention as Modal's own Destructive type and");
    lines.push("   Button's destructive variant, so it stays red regardless of the");
    lines.push("   brand-customizable primary accent set on Foundations. */");
    lines.push(".popconfirm-demo-btn--confirm.is-destructive{ background:var(--danger-500); color:#FFFFFF; }");
    lines.push("");
    lines.push("/* Arrow - a rotated square, so only half of it should ever show; the");
    lines.push("   other half tucks behind the bubble's own opaque background, leaving a");
    lines.push("   clean triangular point rather than a full floating diamond. z-index");
    lines.push("   puts the bubble above it (flex items paint in DOM order by default,");
    lines.push("   and arrow comes after bubble in markup, so without this the arrow");
    lines.push("   would paint OVER the bubble instead of being hidden behind it); the");
    lines.push("   bubble-side margin (-12px) pulls the arrow up so its CENTER - not");
    lines.push("   just its tip - lands on the bubble's edge. Trigger-side margin (-4px)");
    lines.push("   is unrelated - only closes the wrap's gap:8px enough to keep the");
    lines.push("   original small trigger-to-arrow spacing, never meant to reach 0. DOM");
    lines.push("   order is always bubble/arrow/trigger regardless of placement (only");
    lines.push("   flex-direction changes which side is visually which), so which");
    lines.push("   physical margin swaps between top/bottom and between left/right. */");
    lines.push(".popconfirm-demo-arrow{ position:relative; z-index:1; flex:none; width:8px; height:8px; background:var(--overlay-invert-bg); box-shadow:2px 2px 4px rgba(0,0,0,0.3); transform:rotate(45deg); }");
    lines.push(".popconfirm-demo-wrap--top .popconfirm-demo-arrow{ margin:-12px auto -4px; }");
    lines.push(".popconfirm-demo-wrap--bottom .popconfirm-demo-arrow{ margin:-4px auto -12px; }");
    lines.push(".popconfirm-demo-wrap--left .popconfirm-demo-arrow{ margin:auto -4px auto -12px; }");
    lines.push(".popconfirm-demo-wrap--right .popconfirm-demo-arrow{ margin:auto -12px auto -4px; }");
    lines.push("");
    lines.push("<!-- Example usage - one per placement, Default state, opened by clicking the trigger -->");
    TYPES.forEach(function(t){
      lines.push(buildPopConfirmField(t.key, "default", question, confirmLabel, cancelLabel));
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

    // Gallery-card copy CTA + click-to-navigate (pop-confirm.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-popconfirm"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-popconfirm"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_QUESTION, DEFAULT_CONFIRM_LABEL, DEFAULT_CANCEL_LABEL), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_QUESTION, DEFAULT_CONFIRM_LABEL, DEFAULT_CANCEL_LABEL), cardCopyCodeBtn);
      });
    }
    var popconfirmTypeCards = document.querySelectorAll(".popconfirm-type-card[data-system]");
    popconfirmTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "pop-confirm-" + card.dataset.system + ".html";
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
    // by name with its own "Copy" button. Pop Confirm has no multiselect
    // property (Question/Confirm label/Cancel label are all plain text
    // inputs), so it always calls this with an empty combos array - the
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

    var matrixContainer = document.querySelector('[data-role="popconfirm-matrix-container"]');
    if (!matrixContainer) return;

    var questionInput = document.querySelector('[data-role="popconfirm-question"]');
    var confirmLabelInput = document.querySelector('[data-role="popconfirm-confirm-label"]');
    var cancelLabelInput = document.querySelector('[data-role="popconfirm-cancel-label"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(question, confirmLabel, cancelLabel){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildPopConfirmField(t.key, state.key, question, confirmLabel, cancelLabel) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      return {
        question: (questionInput ? questionInput.value.trim() : "") || DEFAULT_QUESTION,
        confirmLabel: (confirmLabelInput ? confirmLabelInput.value.trim() : "") || DEFAULT_CONFIRM_LABEL,
        cancelLabel: (cancelLabelInput ? cancelLabelInput.value.trim() : "") || DEFAULT_CANCEL_LABEL
      };
    }

    function render(){
      var values = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(values.question, values.confirmLabel, values.cancelLabel);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(values.question, values.confirmLabel, values.cancelLabel); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(values.question, values.confirmLabel, values.cancelLabel); }, [], function(){ return ""; });
    }

    if (questionInput) questionInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (confirmLabelInput) confirmLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (cancelLabelInput) cancelLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    render();
  });
})();
