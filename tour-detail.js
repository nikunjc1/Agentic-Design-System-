(() => {
  "use strict";

  // Placement of the tour card relative to its target. Each type's arrow
  // "points" back at the target - since the arrow is a rotated square (a
  // diamond, symmetric on every axis), the pointing direction is really
  // carried by *position* (which side of the target the card sits on), not
  // by a different rotation per type. Same technique as Tooltip/Popover.
  var TYPES = [
    { key: "top", label: "Top" },
    { key: "bottom", label: "Bottom" },
    { key: "left", label: "Left" },
    { key: "right", label: "Right" }
  ];

  // Step-position states a tour card can be in. First step has no Back
  // button (nothing to go back to), Last step swaps Next for Finish.
  var STATES = [
    { key: "first-step", label: "First step" },
    { key: "middle-step", label: "Middle step" },
    { key: "last-step", label: "Last step" }
  ];

  var STEP_TOTAL = 3;
  var STEP_NUMBER_BY_STATE = { "first-step": 1, "middle-step": 2, "last-step": 3 };

  var DEFAULT_TARGET_LABEL = "New feature";
  var DEFAULT_TITLE = "Try the new dashboard";
  var DEFAULT_DESCRIPTION = "Get a quick overview of your team's activity in one place.";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stepNumberFor(stateKey){
    return STEP_NUMBER_BY_STATE[stateKey] || STEP_NUMBER_BY_STATE["first-step"];
  }

  function actionsFor(stateKey){
    var backBtn = '<button type="button" class="tour-demo-btn tour-demo-btn--ghost" tabindex="-1" aria-hidden="true">Back</button>';
    var nextBtn = '<button type="button" class="tour-demo-btn tour-demo-btn--primary" tabindex="-1" aria-hidden="true">Next</button>';
    var finishBtn = '<button type="button" class="tour-demo-btn tour-demo-btn--primary" tabindex="-1" aria-hidden="true">Finish</button>';
    if (stateKey === "middle-step") return backBtn + nextBtn;
    if (stateKey === "last-step") return backBtn + finishBtn;
    return nextBtn;
  }

  // Renders one target+card pair. DOM order is always card, then the arrow,
  // then target - .tour-demo-wrap--<type> alone decides how that DOM order
  // gets laid out visually (column vs column-reverse vs row vs
  // row-reverse), so this function never needs to special-case per-type
  // ordering itself.
  //
  // Everything here lives in normal document flow (no position:absolute) -
  // reusing Tooltip/Popover's exact fix for the overlap bug this codebase
  // has hit before with small floating panels (see .autocomplete-demo-panel
  // / .autocomplete-demo-field:has() in shell.css): an in-flow card+arrow
  // naturally pushes its own matrix cell/row taller instead of overlapping
  // whatever sits next to it.
  function buildTourField(typeKey, stateKey, targetLabel, title, description){
    var stepNumber = stepNumberFor(stateKey);
    var counterHtml = '<div class="tour-demo-step-counter">' + stepNumber + " of " + STEP_TOTAL + "</div>";
    var titleHtml = '<p class="tour-demo-title">' + escapeHtml(title) + "</p>";
    var descriptionHtml = '<p class="tour-demo-description">' + escapeHtml(description) + "</p>";
    var actionsHtml = '<div class="tour-demo-actions">' + actionsFor(stateKey) + "</div>";
    var cardHtml = '<div class="tour-demo-card">' + counterHtml + titleHtml + descriptionHtml + actionsHtml + "</div>";
    var arrowHtml = '<div class="tour-demo-arrow" aria-hidden="true"></div>';
    var targetHtml = '<span class="tour-demo-target" tabindex="-1" aria-hidden="true">' + escapeHtml(targetLabel) + "</span>";
    return '<div class="tour-demo-wrap tour-demo-wrap--' + typeKey + '">' + cardHtml + arrowHtml + targetHtml + "</div>";
  }

  function buildFullPrompt(targetLabel, title, description){
    targetLabel = (targetLabel || DEFAULT_TARGET_LABEL).trim() || DEFAULT_TARGET_LABEL;
    title = (title || DEFAULT_TITLE).trim() || DEFAULT_TITLE;
    description = (description || DEFAULT_DESCRIPTION).trim() || DEFAULT_DESCRIPTION;

    var lines = [];
    lines.push("Create a complete Tour component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (placement, step-position state, target label, title, description) - a step-by-step walkthrough card (title + description + step counter + Back/Next or Back/Finish navigation) anchored to a highlighted target element, not a one-off floating div built from scratch each time.");
    lines.push("");
    lines.push("Placements (4): Top, Bottom, Left, Right - the card sits on the given side of the target, with a small arrow connecting it back to the target. Top's arrow points down at the target below it, Bottom's arrow points up at the target above it, Left's arrow points right at the target beside it, Right's arrow points left at the target beside it.");
    lines.push("");
    lines.push("Step-position states (3): First step (step counter \"1 of " + STEP_TOTAL + "\", only a Next button); Middle step (step counter \"2 of " + STEP_TOTAL + "\", both Back and Next buttons); Last step (step counter \"3 of " + STEP_TOTAL + "\", a Back button plus a Finish button instead of Next).");
    lines.push("");
    lines.push("Visual treatment: reads as a proper elevated panel, similar in floating-panel language to this system's Tooltip and Popover components, but inverted against the page like a real overlay should be - near-black background in light theme, near-white in dark theme (background var(--overlay-invert-bg), NOT the normal-surface var(--graphite-900), since that's user-customizable via Foundations and would silently break the inversion), no border (box-shadow \"0 8px 24px rgba(0,0,0,0.4)\" alone gives it separation from the page), border-radius var(--radius-md). The target is a decorative highlighted chip (not a real interactive control), sitting on the ordinary page background outside the card so it keeps this system's normal, non-inverted styling - background var(--graphite-800), border 2px solid var(--red-500), box-shadow \"0 0 0 3px var(--red-tint)\" - so it reads clearly as the highlighted element the tour is pointing at. The arrow is a small rotated square (transform:rotate(45deg)) matching the card's own inverted background color. Primary actions (Next/Finish) use background var(--red-500); the Back button is a ghost/outline style using the card's own inverted text color for its border and label (var(--text-hi)/var(--line-strong) would go near-invisible against the inverted background).");
    lines.push("");
    lines.push("Component properties: Target label (string, the highlighted element's text) - currently \"" + targetLabel + "\". Title (string, bold text at the top of the card body) - currently \"" + title + "\". Description (string, supporting text below the title) - currently \"" + description + "\".");
    return lines.join("\n");
  }

  function buildFullCode(targetLabel, title, description){
    targetLabel = (targetLabel || DEFAULT_TARGET_LABEL).trim() || DEFAULT_TARGET_LABEL;
    title = (title || DEFAULT_TITLE).trim() || DEFAULT_TITLE;
    description = (description || DEFAULT_DESCRIPTION).trim() || DEFAULT_DESCRIPTION;

    var lines = [];
    lines.push("/* Agentic Design System - Tour component */");
    lines.push(".tour-demo-wrap{ box-sizing:border-box; display:flex; align-items:center; gap:8px; }");
    lines.push("/* DOM order is always card, arrow, target - flex-direction alone");
    lines.push("   decides which side the card visually lands on per placement. */");
    lines.push(".tour-demo-wrap--top, .tour-demo-wrap--bottom{ flex-direction:column; }");
    lines.push(".tour-demo-wrap--bottom{ flex-direction:column-reverse; }");
    lines.push(".tour-demo-wrap--left{ flex-direction:row; }");
    lines.push(".tour-demo-wrap--right{ flex-direction:row-reverse; }");
    lines.push("");
    lines.push(".tour-demo-target{ display:inline-flex; padding:6px 12px; border-radius:var(--radius-sm); background:var(--graphite-800); border:2px solid var(--red-500); box-shadow:0 0 0 3px var(--red-tint); color:var(--text-hi); font-family:var(--font-body); font-size:13px; font-weight:600; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    lines.push("/* Same inverted-overlay treatment as Tooltip's bubble - near-black card");
    lines.push("   in light theme, near-white in dark theme, via var(--overlay-invert-bg)/");
    lines.push("   -text (theme.css), never var(--graphite-900)/var(--text-hi) - those are");
    lines.push("   user-customizable via Foundations and would silently break the");
    lines.push("   inversion. .tour-demo-target is NOT part of this - it sits on the");
    lines.push("   ordinary page background outside the card, so it keeps the normal,");
    lines.push("   non-inverted var(--text-hi) (see above). Border/ghost-button-border");
    lines.push("   are derived from var(--overlay-invert-text) at low opacity rather than");
    lines.push("   var(--line-strong) - that token's tint is calibrated for a normal");
    lines.push("   surface and goes nearly invisible against an inverted one. */");
    lines.push(".tour-demo-card{ position:relative; z-index:2; box-sizing:border-box; background:var(--overlay-invert-bg); box-shadow:0 8px 24px rgba(0,0,0,0.4); padding:12px 14px; border-radius:var(--radius-md); width:220px; text-align: start; }");
    lines.push(".tour-demo-step-counter{ font-family:var(--font-mono); font-size:11px; color:color-mix(in srgb, var(--overlay-invert-text) 65%, var(--overlay-invert-bg) 35%); margin-bottom:6px; }");
    lines.push(".tour-demo-title{ font-family:var(--font-body); font-size:14px; font-weight:600; color:var(--overlay-invert-text); margin:0; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".tour-demo-description{ font-family:var(--font-body); font-size:12px; color:color-mix(in srgb, var(--overlay-invert-text) 65%, var(--overlay-invert-bg) 35%); margin-top:4px; margin-bottom:0; line-height:1.5; max-width:260px; overflow-wrap:anywhere; }");
    lines.push(".tour-demo-actions{ display:flex; justify-content:flex-end; gap:8px; margin-top:12px; }");
    lines.push(".tour-demo-btn{ font-family:var(--font-body); font-size:12px; font-weight:600; padding:6px 12px; border-radius:var(--radius-sm); cursor:pointer; border:1.5px solid transparent; }");
    lines.push(".tour-demo-btn--ghost{ background:transparent; border-color:color-mix(in srgb, var(--overlay-invert-text) 30%, transparent); color:var(--overlay-invert-text); }");
    lines.push(".tour-demo-btn--primary{ background:var(--red-500); color:#FFFFFF; }");
    lines.push("");
    lines.push("/* Arrow - a rotated square, same background/border as the card, only");
    lines.push("   half ever visible (the rest tucks behind the card's own opaque");
    lines.push("   background as a clean triangular point - same technique as Tooltip's");
    lines.push("   own arrow). z-index puts the card above it; the card-side margin");
    lines.push("   (-12px) pulls the arrow's CENTER onto the card's edge; the");
    lines.push("   target-side margin (-4px) keeps the original small spacing there.");
    lines.push("   Which physical side faces the card swaps between top/bottom and");
    lines.push("   between left/right. */");
    lines.push(".tour-demo-arrow{ position:relative; z-index:1; flex:none; width:8px; height:8px; background:var(--overlay-invert-bg); box-shadow:2px 2px 4px rgba(0,0,0,0.3); transform:rotate(45deg); }");
    lines.push(".tour-demo-wrap--top .tour-demo-arrow{ margin:-12px auto -4px; }");
    lines.push(".tour-demo-wrap--bottom .tour-demo-arrow{ margin:-4px auto -12px; }");
    lines.push(".tour-demo-wrap--left .tour-demo-arrow{ margin:auto -4px auto -12px; }");
    lines.push(".tour-demo-wrap--right .tour-demo-arrow{ margin:auto -12px auto -4px; }");
    lines.push("");
    lines.push("<!-- Example usage - one per placement, Middle step state (Back + Next) -->");
    TYPES.forEach(function(t){
      lines.push(buildTourField(t.key, "middle-step", targetLabel, title, description));
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

    // Gallery-card copy CTA + click-to-navigate (tour.html's listing card) -
    // separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-tour"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-tour"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_TARGET_LABEL, DEFAULT_TITLE, DEFAULT_DESCRIPTION), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_TARGET_LABEL, DEFAULT_TITLE, DEFAULT_DESCRIPTION), cardCopyCodeBtn);
      });
    }
    var tourTypeCards = document.querySelectorAll(".tour-type-card[data-system]");
    tourTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "tour-" + card.dataset.system + ".html";
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
    // by name with its own "Copy" button. Tour has no multiselect property
    // (Target label/Title/Description are all plain text inputs), so it
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

    var matrixContainer = document.querySelector('[data-role="tour-matrix-container"]');
    if (!matrixContainer) return;

    var targetLabelInput = document.querySelector('[data-role="tour-target-label"]');
    var titleInput = document.querySelector('[data-role="tour-title"]');
    var descriptionInput = document.querySelector('[data-role="tour-description"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(targetLabel, title, description){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildTourField(t.key, state.key, targetLabel, title, description) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      return {
        targetLabel: (targetLabelInput ? targetLabelInput.value.trim() : "") || DEFAULT_TARGET_LABEL,
        title: (titleInput ? titleInput.value.trim() : "") || DEFAULT_TITLE,
        description: (descriptionInput ? descriptionInput.value.trim() : "") || DEFAULT_DESCRIPTION
      };
    }

    function render(){
      var values = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(values.targetLabel, values.title, values.description);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(values.targetLabel, values.title, values.description); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(values.targetLabel, values.title, values.description); }, [], function(){ return ""; });
    }

    if (targetLabelInput) targetLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (titleInput) titleInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (descriptionInput) descriptionInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    render();
  });
})();
