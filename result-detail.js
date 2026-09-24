(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Simple inline SVG icon set - viewBox 0 0 24 24, stroke currentColor,
  // stroke-width 2, fill none - reused verbatim from Notification's own
  // ICONS object so Result reads as the same semantic language
  // (Info/Success/Warning/Error), just rendered much larger.
  var ICONS = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>'
  };

  var TYPES = [
    { key: "info", label: "Info" },
    { key: "success", label: "Success" },
    { key: "warning", label: "Warning" },
    { key: "error", label: "Error" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "with-secondary", label: "With secondary" },
    { key: "compact", label: "Compact" }
  ];

  var FULL_SPEC = {
    info: { purpose: "Neutral outcome - the flow finished, but the result is informational rather than a clear success or failure." },
    success: { purpose: "Confirms a multi-step flow completed successfully." },
    warning: { purpose: "Flags an outcome that completed but needs the user's attention." },
    error: { purpose: "Reports that a multi-step flow failed." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Only the icon color changes per type - same convention as
  // Notification's own accent/icon mapping.
  function liveCssFor(typeKey){
    var blue500 = getCssVar("--blue-500", "#4F8FE6");
    var green500 = getCssVar("--green-500", "#2FBF6E");
    var amber500 = getCssVar("--amber-500", "#E6A53A");
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var accent = { info: blue500, success: green500, warning: amber500, error: danger500 }[typeKey];
    return {
      icon: "color:" + accent + ";",
      accent: accent
    };
  }

  var DEFAULT_TITLE = "Payment successful";
  var DEFAULT_DESCRIPTION = "Your receipt has been emailed to you.";

  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var title = selectionInfo.title || DEFAULT_TITLE;
    var description = selectionInfo.description || DEFAULT_DESCRIPTION;

    var lines = [];
    lines.push("Create a complete Result component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, state) - a full-panel outcome screen (large semantic icon, bold title, description line, one or two action buttons) shown after a multi-step flow completes or fails, e.g. \"Payment successful\" or \"Submission failed\".");
    lines.push("");
    lines.push("It differs from Notification by occupying the main content area as the page's primary content (a large, centered, prominent panel), rather than Notification's small, transient card anchored to a screen corner.");
    lines.push("");
    lines.push("Types (4, drive the icon color only - same tokens as Notification's own semantic icons):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose + " Icon color: " + css.accent + ".");
    });
    lines.push("");
    lines.push("States (3, structural):");
    lines.push("- Default: icon, title, description and one primary action button (\"Done\").");
    lines.push("- With secondary: same as Default, plus a secondary/ghost action button (\"View details\") next to the primary \"Done\" button.");
    lines.push("- Compact: a smaller, tighter-spacing variant of the same content (smaller icon, reduced padding) for using Result inline within a card rather than as a full page.");
    lines.push("");
    lines.push("Component properties: Title (text, default \"" + DEFAULT_TITLE + "\"); Description (text, default \"" + DEFAULT_DESCRIPTION + "\").");
    lines.push("Current values - Title: \"" + title + "\", Description: \"" + description + "\".");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var title = selectionInfo.title || DEFAULT_TITLE;
    var description = selectionInfo.description || DEFAULT_DESCRIPTION;

    var lines = [];
    lines.push("/* Agentic Design System - Result component */");
    lines.push(".result-demo-panel{ box-sizing:border-box; display:flex; flex-direction:column; align-items:center; text-align:center; gap:8px; width:260px; padding:28px 20px; }");
    lines.push(".result-demo-icon{ width:48px; height:48px; margin-bottom:4px; }");
    lines.push("");
    lines.push("/* Types (4) - color the icon only, same tokens as Notification */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push(".result-demo-panel--" + t.key + " .result-demo-icon{ " + css.icon + " }");
    });
    lines.push("");
    lines.push('.result-demo-title{ font-family:var(--font-body); font-size:16px; font-weight:700; color:var(--text-hi); margin:0; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push('.result-demo-description{ font-family:var(--font-body); font-size:13px; color:var(--text-mid); line-height:1.5; margin:0; max-width:260px; overflow-wrap:anywhere; }');
    lines.push(".result-demo-actions{ display:flex; gap:8px; margin-top:12px; justify-content:center; }");
    lines.push(".result-demo-btn{ font-family:var(--font-body); font-size:12px; font-weight:600; padding:8px 16px; border-radius:var(--radius-sm); cursor:pointer; border:1.5px solid transparent; }");
    lines.push(".result-demo-btn--primary{ background:var(--red-500); color:#FFFFFF; }");
    lines.push(".result-demo-btn--secondary{ background:transparent; border-color:var(--line-strong); color:var(--text-hi); }");
    lines.push("");
    lines.push("/* Compact - smaller icon, tighter spacing, for inline use within a card */");
    lines.push(".result-demo-panel--compact{ padding:16px 14px; gap:4px; }");
    lines.push(".result-demo-panel--compact .result-demo-icon{ width:32px; height:32px; margin-bottom:2px; }");
    lines.push(".result-demo-panel--compact .result-demo-title{ font-size:14px; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".result-demo-panel--compact .result-demo-description{ font-size:12px; max-width:260px; overflow-wrap:anywhere; }");
    lines.push("");
    lines.push("<!-- Example usage - one per type, Default state -->");
    TYPES.forEach(function(t){
      lines.push('<div class="result-demo-panel result-demo-panel--' + t.key + '">');
      lines.push("  " + ICONS[t.key].replace('<svg ', '<svg class="result-demo-icon" '));
      lines.push('  <p class="result-demo-title">' + escapeHtml(title) + "</p>");
      lines.push('  <p class="result-demo-description">' + escapeHtml(description) + "</p>");
      lines.push('  <div class="result-demo-actions">');
      lines.push('    <button type="button" class="result-demo-btn result-demo-btn--primary">Done</button>');
      lines.push("  </div>");
      lines.push("</div>");
    });
    return lines.join("\n");
  }

  // Builds the prompt/code fully resolved for the current Title/Description
  // values - used by the Copy prompt/Copy code plain buttons below (there
  // is only ever one combination in play, since Result has no multiselect/
  // combo property).
  function buildComboPrompt(title, description){
    return buildFullPrompt({ title: title, description: description });
  }

  function buildComboCode(title, description){
    return buildFullCode({ title: title, description: description });
  }

  // Renders one .result-demo-panel for a given type/state combination -
  // icon, title, description and an actions row (one primary button for
  // Default/Compact, plus a secondary button for With secondary).
  function buildResultField(typeKey, stateKey, title, description){
    var iconHtml = ICONS[typeKey].replace('<svg ', '<svg class="result-demo-icon" ');
    var secondaryHtml = stateKey === "with-secondary"
      ? '<button type="button" class="result-demo-btn result-demo-btn--secondary" tabindex="-1">View details</button>'
      : "";
    var extraClass = stateKey === "compact" ? " result-demo-panel--compact" : "";

    return '<div class="result-demo-panel result-demo-panel--' + typeKey + extraClass + '">' +
      iconHtml +
      '<p class="result-demo-title">' + escapeHtml(title) + "</p>" +
      '<p class="result-demo-description">' + escapeHtml(description) + "</p>" +
      '<div class="result-demo-actions">' +
        '<button type="button" class="result-demo-btn result-demo-btn--primary" tabindex="-1">Done</button>' +
        secondaryHtml +
      "</div>" +
    "</div>";
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

    // Gallery-card copy CTA + click-to-navigate (result.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-result"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-result"]');
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
    var resultTypeCards = document.querySelectorAll(".result-type-card[data-system]");
    resultTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "result-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button (Result only ever
    // has one combination in play - no multiselect/combo property) or, if
    // ever given more than one combo, a disclosure dropdown listing every
    // value by name with its own "Copy" button - mirrors
    // notification-detail.js's buildCopyControl exactly.
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

    var matrixContainer = document.querySelector('[data-role="result-matrix-container"]');
    if (!matrixContainer) return;

    var titleInput = document.querySelector('[data-role="result-title"]');
    var descriptionInput = document.querySelector('[data-role="result-description"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    // No combo property exists (no Size/Radius-style multiselect), so
    // render() always builds exactly ONE matrix - TYPES x STATES, 4x3 = 12
    // cells - directly, with no combos array to loop over.
    function buildMatrix(title, description){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildResultField(t.key, state.key, title, description) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentSelectionInfo(){
      return {
        title: titleInput ? (titleInput.value.trim() || DEFAULT_TITLE) : DEFAULT_TITLE,
        description: descriptionInput ? (descriptionInput.value.trim() || DEFAULT_DESCRIPTION) : DEFAULT_DESCRIPTION
      };
    }

    function render(){
      var title = titleInput ? (titleInput.value.trim() || DEFAULT_TITLE) : DEFAULT_TITLE;
      var description = descriptionInput ? (descriptionInput.value.trim() || DEFAULT_DESCRIPTION) : DEFAULT_DESCRIPTION;

      matrixContainer.innerHTML = buildMatrix(title, description);

      var combos = [{ label: "Result", title: title, description: description }];

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.title, c.description); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.title, c.description); });
    }

    if (titleInput){
      titleInput.addEventListener("input", render);
    }
    if (descriptionInput){
      descriptionInput.addEventListener("input", render);
    }

    render();
  });
})();
