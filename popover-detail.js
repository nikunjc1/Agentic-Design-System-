(() => {
  "use strict";

  // Placement of the popover bubble relative to its trigger. Each type's
  // arrow "points" back at the trigger - since the arrow is a rotated
  // square (a diamond, symmetric on every axis), the pointing direction is
  // really carried by *position* (which side of the trigger the bubble sits
  // on), not by a different rotation per type. Same technique as Tooltip.
  var TYPES = [
    { key: "top", label: "Top" },
    { key: "bottom", label: "Bottom" },
    { key: "left", label: "Left" },
    { key: "right", label: "Right" }
  ];

  // Content states a popover's bubble can hold.
  var STATES = [
    { key: "simple", label: "Simple" },
    { key: "with-body", label: "With body" },
    { key: "with-close", label: "With close" }
  ];

  var DEFAULT_TRIGGER_LABEL = "Details";
  var DEFAULT_TITLE = "Storage usage";
  var DEFAULT_BODY = "8.2 GB of 15 GB used.";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bubbleContentFor(stateKey, title, body){
    var html = '<p class="popover-demo-title">' + escapeHtml(title) + "</p>";
    if (stateKey !== "simple"){
      html += '<p class="popover-demo-body">' + escapeHtml(body) + "</p>";
    }
    if (stateKey === "with-close"){
      html += '<button type="button" class="popover-demo-close" tabindex="-1" aria-hidden="true">&times;</button>';
    }
    return html;
  }

  // Renders one trigger+bubble pair. DOM order is always bubble, then the
  // arrow, then trigger - .popover-demo-wrap--<type> alone decides how that
  // DOM order gets laid out visually (column vs column-reverse vs row vs
  // row-reverse), so this function never needs to special-case per-type
  // ordering itself.
  //
  // Everything here lives in normal document flow (no position:absolute) -
  // reusing Tooltip's exact fix for the overlap bug this codebase has hit
  // before with small floating panels (see .autocomplete-demo-panel /
  // .autocomplete-demo-field:has() in shell.css): an in-flow bubble+arrow
  // naturally pushes its own matrix cell/row taller instead of overlapping
  // whatever sits next to it.
  function buildPopoverField(typeKey, stateKey, triggerLabel, title, body){
    var bubbleHtml = '<div class="popover-demo-bubble">' + bubbleContentFor(stateKey, title, body) + "</div>";
    var arrowHtml = '<div class="popover-demo-arrow" aria-hidden="true"></div>';
    var triggerHtml = '<button type="button" class="popover-demo-trigger" tabindex="-1" aria-hidden="true">' + escapeHtml(triggerLabel) + "</button>";
    return '<div class="popover-demo-wrap popover-demo-wrap--' + typeKey + '">' + bubbleHtml + arrowHtml + triggerHtml + "</div>";
  }

  function buildFullPrompt(triggerLabel, title, body){
    triggerLabel = (triggerLabel || DEFAULT_TRIGGER_LABEL).trim() || DEFAULT_TRIGGER_LABEL;
    title = (title || DEFAULT_TITLE).trim() || DEFAULT_TITLE;
    body = (body || DEFAULT_BODY).trim() || DEFAULT_BODY;

    var lines = [];
    lines.push("Create a complete Popover component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (placement, content state, trigger label, title, body) - a rich floating content panel (title + optional body text + optional close button) anchored to a real clickable trigger button, opened on click (not hover, unlike this system's Tooltip component), not a one-off floating div built from scratch each time.");
    lines.push("");
    lines.push("Placements (4): Top, Bottom, Left, Right - the bubble sits on the given side of the trigger, with a small arrow connecting it back to the trigger. Top's arrow points down at the trigger below it, Bottom's arrow points up at the trigger above it, Left's arrow points right at the trigger beside it, Right's arrow points left at the trigger beside it.");
    lines.push("");
    lines.push("Content states (3): Simple (a bold title line only); With body (the title plus a body paragraph below it, e.g. \"" + title + "\" / \"" + body + "\"); With close (title, body and a small \"x\" close button in the top-right corner of the bubble, for dismissing the popover without clicking outside it).");
    lines.push("");
    lines.push("Visual treatment: the same inverted-overlay bubble as Tooltip/Tour/Pop Confirm - near-black in light theme, near-white in dark theme, via the fixed var(--overlay-invert-bg)/-text tokens (never the user-customizable var(--graphite-900)/var(--text-hi)), so it always contrasts with the page regardless of theme or any saved brand color. No border on the bubble - box-shadow \"0 8px 24px rgba(0,0,0,0.4)\" (matching this system's other floating-panel language, Menu/Autocomplete) gives it enough separation from the page on its own; a border read as an unwanted outline against the inverted background. Reads as a proper elevated panel rather than Tooltip's flat single-line bubble, with border-radius var(--radius-md) and room for a title/body/close button. The trigger is a real clickable button (not a decorative circle like Tooltip's trigger), styled like a simple bordered button on the ordinary page background - background var(--graphite-800), border 1px solid var(--line-strong), color var(--text-hi), padding 8px 14px, border-radius var(--radius-sm) - since it sits outside the inverted bubble, not part of it. The arrow is a small rotated square (transform:rotate(45deg)), same background as the bubble, with only half of it showing - the rest tucked behind the bubble's own opaque background as a clean triangular point (same technique as Tooltip's arrow).");
    lines.push("");
    lines.push("Component properties: Trigger label (string, the text on the trigger button) - currently \"" + triggerLabel + "\". Title (string, bold text at the top of the bubble) - currently \"" + title + "\". Body (string, used by the With body and With close states) - currently \"" + body + "\".");
    return lines.join("\n");
  }

  function buildFullCode(triggerLabel, title, body){
    triggerLabel = (triggerLabel || DEFAULT_TRIGGER_LABEL).trim() || DEFAULT_TRIGGER_LABEL;
    title = (title || DEFAULT_TITLE).trim() || DEFAULT_TITLE;
    body = (body || DEFAULT_BODY).trim() || DEFAULT_BODY;

    var lines = [];
    lines.push("/* Agentic Design System - Popover component */");
    lines.push(".popover-demo-wrap{ box-sizing:border-box; display:flex; align-items:center; gap:8px; }");
    lines.push("/* DOM order is always bubble, arrow, trigger - flex-direction alone");
    lines.push("   decides which side the bubble visually lands on per placement. */");
    lines.push(".popover-demo-wrap--top, .popover-demo-wrap--bottom{ flex-direction:column; }");
    lines.push(".popover-demo-wrap--bottom{ flex-direction:column-reverse; }");
    lines.push(".popover-demo-wrap--left{ flex-direction:row; }");
    lines.push(".popover-demo-wrap--right{ flex-direction:row-reverse; }");
    lines.push("");
    lines.push(".popover-demo-trigger{ padding:8px 14px; border-radius:var(--radius-sm); background:var(--graphite-800); border:1px solid var(--line-strong); color:var(--text-hi); font-family:var(--font-body); font-size:13px; font-weight:600; cursor:pointer; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".popover-demo-trigger:hover{ background:var(--graphite-700); }");
    lines.push("");
    lines.push("/* Inverted-overlay treatment, same as Tooltip/Tour/Pop Confirm's bubble -");
    lines.push("   always near-black in light theme / near-white in dark theme via");
    lines.push("   var(--overlay-invert-bg)/-text, never var(--graphite-900)/var(--text-hi)");
    lines.push("   (those are user-customizable via Foundations and would silently break");
    lines.push("   the inversion). No border - it read as an unwanted outline against the");
    lines.push("   inverted background; box-shadow alone gives it enough separation. No");
    lines.push("   min-width either - that forced every bubble to 180px regardless of");
    lines.push("   content, leaving ~65px of dead blank space next to a short title like");
    lines.push("   \"Storage usage\"; Tooltip never has this problem (no min-width, just");
    lines.push("   white-space:nowrap), so the bubble now hugs its own content the same");
    lines.push("   way, capped only by max-width. The close button is absolutely");
    lines.push("   positioned (so it never reserves layout space itself) - the :has() rule");
    lines.push("   reserves a small gutter for it only when one actually exists, instead");
    lines.push("   of permanently upsizing every bubble the way the old min-width did. */");
    lines.push(".popover-demo-bubble{ box-sizing:border-box; position:relative; z-index:2; background:var(--overlay-invert-bg); box-shadow:0 8px 24px rgba(0,0,0,0.4); padding:10px 12px; border-radius:var(--radius-md); max-width:220px; text-align: start; }");
    lines.push(".popover-demo-title{ font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--overlay-invert-text); margin:0; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".popover-demo-body{ font-family:var(--font-body); font-size:12px; color:color-mix(in srgb, var(--overlay-invert-text) 65%, var(--overlay-invert-bg) 35%); margin:4px 0 0; line-height:1.5; max-width:260px; overflow-wrap:anywhere; }");
    lines.push(".popover-demo-close{ position:absolute; top:6px; right:6px; width:16px; height:16px; background:none; border:none; color:color-mix(in srgb, var(--overlay-invert-text) 65%, var(--overlay-invert-bg) 35%); cursor:pointer; padding:0; }");
    lines.push("/* padding-right alone doesn't work here: overflow:hidden/text-overflow:");
    lines.push("   ellipsis (from the shared 260px-truncation rule) clip at the box's own");
    lines.push("   outer edge, not its content edge, so truncated text can still render");
    lines.push("   straight through a padding reservation. max-width actually shrinks the");
    lines.push("   box itself, which is what really keeps the ellipsis-clipped text clear");
    lines.push("   of the close button. */");
    lines.push(".popover-demo-bubble:has(.popover-demo-close) .popover-demo-title{ max-width:calc(100% - 20px); }");
    lines.push("");
    lines.push("/* Arrow - a small rotated square, same background as the bubble. Only");
    lines.push("   half of it shows - z-index puts the bubble above the arrow (it comes");
    lines.push("   after the bubble in DOM order), and the bubble-side margin (-12px)");
    lines.push("   pulls the arrow's center, not just its tip, to the bubble's edge -");
    lines.push("   same technique as Tooltip's arrow (see .tooltip-demo-arrow). */");
    lines.push(".popover-demo-arrow{ position:relative; z-index:1; flex:none; width:8px; height:8px; background:var(--overlay-invert-bg); transform:rotate(45deg); }");
    lines.push(".popover-demo-wrap--top .popover-demo-arrow{ margin:-12px auto -4px; }");
    lines.push(".popover-demo-wrap--bottom .popover-demo-arrow{ margin:-4px auto -12px; }");
    lines.push(".popover-demo-wrap--left .popover-demo-arrow{ margin:auto -4px auto -12px; }");
    lines.push(".popover-demo-wrap--right .popover-demo-arrow{ margin:auto -12px auto -4px; }");
    lines.push("");
    lines.push("<!-- Example usage - one per placement, With body state, opened on click -->");
    TYPES.forEach(function(t){
      lines.push(buildPopoverField(t.key, "with-body", triggerLabel, title, body));
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

    // Gallery-card copy CTA + click-to-navigate (popover.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-popover"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-popover"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_TRIGGER_LABEL, DEFAULT_TITLE, DEFAULT_BODY), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_TRIGGER_LABEL, DEFAULT_TITLE, DEFAULT_BODY), cardCopyCodeBtn);
      });
    }
    var popoverTypeCards = document.querySelectorAll(".popover-type-card[data-system]");
    popoverTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "popover-" + card.dataset.system + ".html";
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
    // by name with its own "Copy" button. Popover has no multiselect
    // property (Trigger label/Title/Body are all plain text inputs), so it
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

    var matrixContainer = document.querySelector('[data-role="popover-matrix-container"]');
    if (!matrixContainer) return;

    var triggerLabelInput = document.querySelector('[data-role="popover-trigger-label"]');
    var titleInput = document.querySelector('[data-role="popover-title"]');
    var bodyInput = document.querySelector('[data-role="popover-body"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(triggerLabel, title, body){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildPopoverField(t.key, state.key, triggerLabel, title, body) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      return {
        triggerLabel: (triggerLabelInput ? triggerLabelInput.value.trim() : "") || DEFAULT_TRIGGER_LABEL,
        title: (titleInput ? titleInput.value.trim() : "") || DEFAULT_TITLE,
        body: (bodyInput ? bodyInput.value.trim() : "") || DEFAULT_BODY
      };
    }

    function render(){
      var values = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(values.triggerLabel, values.title, values.body);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(values.triggerLabel, values.title, values.body); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(values.triggerLabel, values.title, values.body); }, [], function(){ return ""; });
    }

    if (triggerLabelInput) triggerLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (titleInput) titleInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (bodyInput) bodyInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    render();
  });
})();
