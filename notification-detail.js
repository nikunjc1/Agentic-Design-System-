(() => {
  "use strict";

  // Simple inline SVG icon set - viewBox 0 0 24 24, stroke currentColor,
  // stroke-width 2, fill none - identical shapes to Toast/Alert's own icon
  // set so all three components read as the same semantic language
  // (Info/Success/Warning/Error).
  var ICONS = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>'
  };
  var CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var TYPES = [
    { key: "info", label: "Info" },
    { key: "success", label: "Success" },
    { key: "warning", label: "Warning" },
    { key: "error", label: "Error" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "with-action", label: "With action" },
    { key: "stacked", label: "Stacked" }
  ];

  var FULL_SPEC = {
    info: { purpose: "Neutral, informational background event - nothing succeeded or failed, it's just worth surfacing." },
    success: { purpose: "Confirms a background or async task completed successfully." },
    warning: { purpose: "Flags something that needs attention but hasn't failed outright." },
    error: { purpose: "Reports that a background or async task failed." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // The card itself is always a solid, neutral, elevated surface - only the
  // left accent border (and the icon) change color per type. Same
  // convention as Toast/Alert's own semantic icon + accent mapping.
  function liveCssFor(typeKey){
    var blue500 = getCssVar("--blue-500", "#4F8FE6");
    var green500 = getCssVar("--green-500", "#2FBF6E");
    var amber500 = getCssVar("--amber-500", "#E6A53A");
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var accent = { info: blue500, success: green500, warning: amber500, error: danger500 }[typeKey];
    return {
      card: "background:" + getCssVar("--graphite-900", "#14171B") + ";border:1px solid " + getCssVar("--line-strong", "rgba(255,255,255,0.16)") + ";border-left:3px solid " + accent + ";box-shadow:0 8px 24px rgba(0,0,0,0.35);",
      icon: "color:" + accent + ";",
      accent: accent
    };
  }

  var DEFAULT_TITLE = "File uploaded";
  var DEFAULT_DESCRIPTION = "team-report.pdf is ready to share.";

  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var title = selectionInfo.title || DEFAULT_TITLE;
    var description = selectionInfo.description || DEFAULT_DESCRIPTION;

    var lines = [];
    lines.push("Create a complete Notification component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, state) - a corner-anchored card (solid background, border, left accent border, drop shadow, fixed ~260px width) with a semantic icon, a bold title, a longer description line and a close button, used to report a background or async event.");
    lines.push("");
    lines.push("It differs from Toast by carrying more content per instance (icon + title + description + close, and optionally an action) for events the user wasn't necessarily watching for (e.g. \"File uploaded successfully\", \"3 new messages received\"), rather than Toast's brief, single-line, self-dismissing confirmation of an action the user just took.");
    lines.push("");
    lines.push("Types (4, drive the left accent border and the icon color - the card itself always stays a solid neutral elevated surface):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose + " Accent/icon color: " + css.accent + ".");
    });
    lines.push("Card (same for every type): " + liveCssFor("info").card);
    lines.push("");
    lines.push("States (3, structural, apply to the whole card):");
    lines.push("- Default: icon, title, description and a close (x) button - no action.");
    lines.push("- With action: same as Default, plus an inline text-style action button (\"Undo\") below the description.");
    lines.push("- Stacked: shows two of the same notification card layered with a small gap, the second one sitting slightly behind and reduced in opacity, to demonstrate multiple simultaneous notifications.");
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
    lines.push("/* Agentic Design System - Notification component */");
    lines.push(".notification-demo-card{ box-sizing:border-box; display:flex; gap:10px; width:260px; padding:12px 14px; background:var(--graphite-900); border:1px solid var(--line-strong); border-radius:var(--radius-md); box-shadow:0 8px 24px rgba(0,0,0,0.35); position:relative; }");
    lines.push(".notification-demo-icon{ flex:none; width:18px; height:18px; margin-top:1px; }");
    lines.push(".notification-demo-body{ flex:1 1 auto; min-width:0; text-align:left; }");
    lines.push('.notification-demo-title{ font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--text-hi); margin:0; }');
    lines.push('.notification-demo-description{ font-family:var(--font-body); font-size:12px; color:var(--text-mid); margin-top:2px; line-height:1.5; }');
    lines.push(".notification-demo-close{ flex:none; background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:16px; line-height:1; padding:0; }");
    lines.push('.notification-demo-action{ margin-top:8px; font-family:var(--font-body); font-size:12px; font-weight:600; color:var(--red-400); background:none; border:none; cursor:pointer; padding:0; text-align:left; }');
    lines.push(".notification-demo-stack{ position:relative; width:268px; padding-bottom:8px; }");
    lines.push(".notification-demo-stack .notification-demo-card{ width:260px; }");
    lines.push(".notification-demo-stack .notification-demo-card:not(.is-behind){ position:relative; z-index:1; }");
    lines.push(".notification-demo-stack .notification-demo-card.is-behind{ position:absolute; top:8px; left:8px; opacity:0.55; z-index:0; }");
    lines.push("");
    lines.push("/* Types (4) - color the left accent border and the icon only - the card stays neutral */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push(".notification-demo-card--" + t.key + "{ border-left-color:" + css.accent + "; }");
      lines.push(".notification-demo-card--" + t.key + " .notification-demo-icon{ " + css.icon + " }");
    });
    lines.push("");
    lines.push("<!-- Example usage - one per type, Default state -->");
    TYPES.forEach(function(t){
      lines.push('<div class="notification-demo-card notification-demo-card--' + t.key + '">');
      lines.push("  " + ICONS[t.key].replace('<svg ', '<svg class="notification-demo-icon" '));
      lines.push('  <div class="notification-demo-body">');
      lines.push('    <p class="notification-demo-title">' + title + "</p>");
      lines.push('    <p class="notification-demo-description">' + description + "</p>");
      lines.push("  </div>");
      lines.push('  <button type="button" class="notification-demo-close">&times;</button>');
      lines.push("</div>");
    });
    return lines.join("\n");
  }

  // Builds the prompt/code fully resolved for the current Title/Description
  // values - used by the Copy prompt/Copy code plain buttons below (there
  // is only ever one combination in play, since Notification has no
  // multiselect/combo property).
  function buildComboPrompt(title, description){
    return buildFullPrompt({ title: title, description: description });
  }

  function buildComboCode(title, description){
    return buildFullCode({ title: title, description: description });
  }

  // Renders one notification card (or, for the Stacked state, two layered
  // cards) for a given type/state combination.
  function buildNotificationField(typeKey, stateKey, title, description){
    var iconHtml = ICONS[typeKey].replace('<svg ', '<svg class="notification-demo-icon" ');
    var actionHtml = stateKey === "with-action" ? '<button type="button" class="notification-demo-action" tabindex="-1">Undo</button>' : "";
    var closeHtml = '<button type="button" class="notification-demo-close" tabindex="-1" aria-hidden="true">' + CLOSE_ICON + "</button>";

    function cardHtml(extraClass){
      return '<div class="notification-demo-card notification-demo-card--' + typeKey + (extraClass ? " " + extraClass : "") + '">' +
        iconHtml +
        '<div class="notification-demo-body">' +
          '<p class="notification-demo-title">' + title + "</p>" +
          '<p class="notification-demo-description">' + description + "</p>" +
          actionHtml +
        "</div>" +
        closeHtml +
      "</div>";
    }

    if (stateKey === "stacked"){
      return '<div class="notification-demo-stack">' + cardHtml() + cardHtml("is-behind") + "</div>";
    }
    return cardHtml();
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

    // Gallery-card copy CTA + click-to-navigate (notification.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-notification"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-notification"]');
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
    var notificationTypeCards = document.querySelectorAll(".notification-type-card[data-system]");
    notificationTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "notification-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button (Notification
    // only ever has one combination in play - no multiselect/combo
    // property) or, if ever given more than one combo, a disclosure
    // dropdown listing every value by name with its own "Copy" button -
    // mirrors toast-detail.js's buildCopyControl exactly.
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

    var matrixContainer = document.querySelector('[data-role="notification-matrix-container"]');
    if (!matrixContainer) return;

    var titleInput = document.querySelector('[data-role="notification-title"]');
    var descriptionInput = document.querySelector('[data-role="notification-description"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrix(title, description){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildNotificationField(t.key, state.key, title, description) + "</td>";
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

      var combos = [{ label: "Notification", title: title, description: description }];

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
