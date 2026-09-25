(() => {
  "use strict";

  // Empty is not interactive in the hover/focus/disabled sense - like
  // Divider, its "states" dimension is really "how much content is shown",
  // not a pseudo-class. There is no liveCssFor()/pseudo-class logic here.
  var TYPES = [
    { key: "default", label: "Default" },
    { key: "simple", label: "Simple" }
  ];
  var STATES = [
    { key: "title-only", label: "Title only" },
    { key: "with-description", label: "With description" },
    { key: "with-action", label: "With action" }
  ];

  var FULL_SPEC = {
    "default": { purpose: "A slightly larger, friendlier icon inside a soft circular background - the default treatment for a primary empty state, like an empty page or dashboard." },
    "simple": { purpose: "A smaller, bare minimal icon with no circular background - a quieter treatment for a secondary or inline empty state, like an empty panel inside a larger page." }
  };

  var ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 9.5 L7 4 H17 L21 9.5" />' +
    '<path d="M3 9.5 V18.5 A1 1 0 0 0 4 19.5 H20 A1 1 0 0 0 21 18.5 V9.5" />' +
    '<path d="M3 9.5 H9 A1 1 0 0 1 10 10.2 L10.3 11 A1 1 0 0 0 11.3 11.7 H12.7 A1 1 0 0 0 13.7 11 L14 10.2 A1 1 0 0 1 15 9.5 H21" />' +
    "</svg>";

  var FALLBACK_DEFAULTS = {
    title: "No projects yet",
    description: "Create your first project to get started.",
    actionLabel: "Create project"
  };

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Renders one .empty-demo-panel - an icon (wrapped in a circular soft
  // background only for the "default" type, bare for "simple"), a title,
  // and conditionally a description (every state but "title-only") and an
  // action button (only "with-action", reusing Modal's own button base
  // class since it isn't inside a .modal-demo-dialog--default/destructive
  // wrapper to inherit color from).
  function buildEmptyField(typeKey, stateKey, title, description, actionLabel){
    var safeTitle = escapeHtml(title);
    var iconHtml = '<div class="empty-demo-icon-wrap empty-demo-icon-wrap--' + typeKey + '">' + ICON_SVG + "</div>";
    var titleHtml = '<p class="empty-demo-title">' + safeTitle + "</p>";
    var descriptionHtml = (stateKey !== "title-only")
      ? '<p class="empty-demo-description">' + escapeHtml(description) + "</p>"
      : "";
    var actionHtml = (stateKey === "with-action")
      ? '<button type="button" class="modal-demo-btn modal-demo-btn--primary">' + escapeHtml(actionLabel) + "</button>"
      : "";
    return '<div class="empty-demo-panel">' + iconHtml + titleHtml + descriptionHtml + actionHtml + "</div>";
  }

  function resolveInfo(selectionInfo){
    selectionInfo = selectionInfo || {};
    return {
      title: (selectionInfo.title !== undefined) ? selectionInfo.title : FALLBACK_DEFAULTS.title,
      description: (selectionInfo.description !== undefined) ? selectionInfo.description : FALLBACK_DEFAULTS.description,
      actionLabel: (selectionInfo.actionLabel !== undefined) ? selectionInfo.actionLabel : FALLBACK_DEFAULTS.actionLabel
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);

    var lines = [];
    lines.push("Create a complete Empty component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (icon style, title, description, action label) - a placeholder shown when there's no data to display (an empty search result, an empty inbox, a freshly-created project with nothing in it yet), so the space never looks broken or blank, not a one-off blank div left behind.");
    lines.push("");
    lines.push("Icon styles (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (3, progressively more content, apply to either icon style):");
    lines.push("- Title only: icon + title, no description, no action.");
    lines.push("- With description: icon + title + a short description line explaining what to do next.");
    lines.push("- With action: icon + title + description + a primary action button (e.g. \"Create new\") that resolves the empty state.");
    lines.push("");
    lines.push("Component properties: Title (text, default \"" + FALLBACK_DEFAULTS.title + "\"); Description (text, default \"" + FALLBACK_DEFAULTS.description + "\", only shown from the With description state onward); Action label (text, default \"" + FALLBACK_DEFAULTS.actionLabel + "\", only applies to the With action state).");
    lines.push("Current values - Title: \"" + info.title + "\", Description: \"" + info.description + "\", Action label: \"" + info.actionLabel + "\".");
    return lines.join("\n");
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Empty component */");
    lines.push(".empty-demo-panel{ box-sizing:border-box; display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px; padding:24px; width:220px; }");
    lines.push(".empty-demo-icon-wrap{ display:flex; align-items:center; justify-content:center; color:var(--text-dim); }");
    lines.push(".empty-demo-icon-wrap--default{ width:56px; height:56px; border-radius:9999px; background:var(--graphite-800); }");
    lines.push(".empty-demo-icon-wrap--default svg{ width:28px; height:28px; }");
    lines.push(".empty-demo-icon-wrap--simple{ width:40px; height:40px; }");
    lines.push(".empty-demo-icon-wrap--simple svg{ width:36px; height:36px; }");
    lines.push('.empty-demo-title{ font-family:var(--font-body); font-size:14px; font-weight:600; color:var(--text-hi); margin:0; }');
    lines.push('.empty-demo-description{ font-family:var(--font-body); font-size:12px; color:var(--text-dim); line-height:1.5; margin:0; max-width:260px; overflow-wrap:anywhere; }');
    lines.push("/* Action button reuses Modal's own .modal-demo-btn/.modal-demo-btn--primary classes directly - only the primary button's color needs its own rule here, since it normally comes from Modal's type-scoped .modal-demo-dialog--default/destructive parent, and this panel isn't inside one. */");
    lines.push(".empty-demo-panel .modal-demo-btn--primary{ background:var(--red-500); margin-top:4px; }");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);

    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    lines.push("<!-- Example usage - one per icon style, With action state -->");
    TYPES.forEach(function(t){
      lines.push(buildEmptyField(t.key, "with-action", info.title, info.description, info.actionLabel));
    });
    lines.push("");
    lines.push("<!-- Example usage - the other 2 states (Default icon style) -->");
    lines.push(buildEmptyField("default", "title-only", info.title, info.description, info.actionLabel));
    lines.push(buildEmptyField("default", "with-description", info.title, info.description, info.actionLabel));
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

    // Gallery-card copy CTA + click-to-navigate (empty.html's listing card)
    // - separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-empty"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-empty"]');
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
    var emptyTypeCards = document.querySelectorAll(".empty-type-card[data-system]");
    emptyTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "empty-" + card.dataset.system + ".html";
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
    // by name with its own "Copy" button. Empty has no multiselect property
    // at all (Title/Description/Action label are plain text inputs), so it
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

    var matrixContainer = document.querySelector('[data-role="empty-matrix-container"]');
    if (!matrixContainer) return;

    var titleInput = document.querySelector('[data-role="empty-title"]');
    var descriptionInput = document.querySelector('[data-role="empty-description"]');
    var actionLabelInput = document.querySelector('[data-role="empty-action-label"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    // No combo property exists (no Size/Radius-style multiselect), so
    // render() always builds exactly ONE matrix - TYPES x STATES, 2x3 = 6
    // cells - directly, with no combos array to loop over.
    function buildMatrixSection(title, description, actionLabel){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildEmptyField(t.key, state.key, title, description, actionLabel) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      return {
        title: (titleInput ? titleInput.value.trim() : "") || FALLBACK_DEFAULTS.title,
        description: (descriptionInput ? descriptionInput.value.trim() : "") || FALLBACK_DEFAULTS.description,
        actionLabel: (actionLabelInput ? actionLabelInput.value.trim() : "") || FALLBACK_DEFAULTS.actionLabel
      };
    }

    function render(){
      var values = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(values.title, values.description, values.actionLabel);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(values); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(values); }, [], function(){ return ""; });
    }

    if (titleInput) titleInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (descriptionInput) descriptionInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (actionLabelInput) actionLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    render();
  });
})();
