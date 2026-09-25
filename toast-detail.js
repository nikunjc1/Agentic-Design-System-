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
  // stroke-width 2, fill none - one shape per semantic type. Intentionally
  // close to a typical Alert icon set: both components legitimately share
  // the same 4 semantic icons (Info/Success/Warning/Error).
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
    { key: "dismissible", label: "Dismissible" },
    { key: "with-action", label: "With action" },
    { key: "with-progress", label: "With progress" }
  ];

  var FULL_SPEC = {
    info: { purpose: "Neutral, informational status update - nothing succeeded or failed, it's just worth surfacing." },
    success: { purpose: "Confirms an action completed successfully." },
    warning: { purpose: "Flags something that needs attention but hasn't failed outright." },
    error: { purpose: "Reports that an action failed." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // The card itself is always a solid, neutral, elevated surface - only the
  // icon (and, in the with-progress state, the progress fill) change color
  // per type. This is what keeps a Toast reading as "elevated above the
  // page" rather than tinted like Alert's inline banner.
  function liveCssFor(typeKey){
    var blue500 = getCssVar("--blue-500", "#4F8FE6");
    var green500 = getCssVar("--green-500", "#2FBF6E");
    var amber500 = getCssVar("--amber-500", "#E6A53A");
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var accent = { info: blue500, success: green500, warning: amber500, error: danger500 }[typeKey];
    return {
      card: "background:" + getCssVar("--graphite-850", "#191C20") + ";border:1px solid " + getCssVar("--line-strong", "rgba(255,255,255,0.16)") + ";box-shadow:0 8px 24px rgba(0,0,0,0.4);",
      icon: "color:" + accent + ";",
      accent: accent
    };
  }

  // Corner radius option list - identical value scale to Group Button /
  // Button / Input, shared between the page's own multi-select dropdown
  // and the Copy Prompt/Copy Code generators below.
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  var FALLBACK_DEFAULTS = { radius: "8" };
  var DEFAULT_TITLE = "Upload complete";
  var DEFAULT_DESCRIPTION = "your-file.pdf was uploaded successfully.";

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function radiusClassSuffix(value){
    return value === "9999" ? "pill" : value;
  }

  function radiusCssFor(value){
    return value === "9999" ? "9999px" : value + "px";
  }

  function selectionMode(multiSelect, optionList, defaultValues){
    var allValues = optionList.map(function(opt){ return opt.value; });
    if (!multiSelect) return { mode: "all", values: allValues };
    var selected = multiSelect.getSelected();
    if (!selected.length || selected.length === optionList.length){
      return { mode: "all", values: allValues };
    }
    var isUntouchedDefault = defaultValues && selected.length === defaultValues.length &&
      selected.every(function(v, i){ return v === defaultValues[i]; });
    if (isUntouchedDefault) return { mode: "all", values: allValues };
    var ordered = allValues.filter(function(v){ return selected.indexOf(v) !== -1; });
    return { mode: "specific", values: ordered };
  }

  function propertyPromptLine(propLabel, info, optionList){
    if (info.mode === "all"){
      var allLabels = optionList.map(function(opt){ return opt.label; }).join(" / ");
      return "What " + propLabel.toLowerCase() + " do you want? (" + allLabels + ")";
    }
    var chosen = info.values.map(function(v){ return optionLabelFor(optionList, v); });
    if (chosen.length === 1){
      return propLabel + ": " + chosen[0] + " - the user has explicitly chosen this, generate only this option.";
    }
    return propLabel + ": " + chosen.join(", ") + " - the user has explicitly narrowed it to these, generate one variant per option.";
  }

  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var title = selectionInfo.title || DEFAULT_TITLE;
    var description = selectionInfo.description || DEFAULT_DESCRIPTION;
    var showIcon = selectionInfo.showIcon !== false;

    var lines = [];
    lines.push("Create a complete Toast (floating notification) component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, state, radius) - a floating, elevated notification card (solid background, border, drop shadow, fixed ~340px max-width) that appears temporarily to confirm an action or report a status.");
    lines.push("");
    lines.push("It differs from Alert by being a floating overlay element, not inline page content - in production it is typically rendered in a fixed screen corner (e.g. bottom-right), stacked above the page, rather than embedded in the content flow the way Alert is.");
    lines.push("");
    lines.push("Types (4, drive only the icon color - the card itself always stays a solid neutral elevated surface):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose + " Icon color: " + css.icon);
    });
    lines.push("Card (same for every type): " + liveCssFor("info").card);
    lines.push("");
    lines.push("States (4, structural, apply to the whole card):");
    lines.push("- Default: title and description only, no extra controls.");
    lines.push("- Dismissible: adds a trailing close (x) icon button in the card's top-right corner.");
    lines.push("- With action: adds an inline text-style action button (e.g. \"View\") below the description.");
    lines.push("- With progress: adds a thin colored progress/timer bar along the card's bottom edge, using the type's accent color at roughly 60% width to suggest a countdown in progress.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to the whole card, with matching inset on the bottom edge so the With-progress bar never pokes out past rounded corners.");
    lines.push("");
    lines.push("Component properties: Title (text, default \"" + DEFAULT_TITLE + "\"); Description (text, default \"" + DEFAULT_DESCRIPTION + "\"); Show icon (boolean toggle, default " + (showIcon ? "on" : "off") + " - shows the semantic type icon beside the title/description).");
    lines.push("Current values - Title: \"" + title + "\", Description: \"" + description + "\", Show icon: " + (showIcon ? "yes" : "no") + ".");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var title = selectionInfo.title || DEFAULT_TITLE;
    var description = selectionInfo.description || DEFAULT_DESCRIPTION;
    var showIcon = selectionInfo.showIcon !== false;

    var lines = [];
    lines.push("/* Agentic Design System - Toast (floating notification) component */");
    lines.push(".toast-demo-card{ box-sizing:border-box; position:relative; display:flex; align-items:flex-start; gap:12px; padding:14px 16px; width:340px; background:var(--graphite-850); border:1px solid var(--line-strong); box-shadow:0 8px 24px rgba(0,0,0,0.4); overflow:hidden; }");
    lines.push(".toast-demo-icon{ flex:none; width:20px; height:20px; margin-top:1px; }");
    lines.push(".toast-demo-body{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:4px; padding-inline-end:16px; text-align: start; }");
    lines.push('.toast-demo-title{ font-family:var(--font-body); font-size:14px; font-weight:600; color:var(--text-hi); margin:0; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push('.toast-demo-description{ font-family:var(--font-body); font-size:13px; color:var(--text-mid); margin:0; max-width:260px; overflow-wrap:anywhere; }');
    lines.push(".toast-demo-close{ position:absolute; top:10px; right:10px; width:16px; height:16px; background:none; border:none; color:var(--text-dim); cursor:pointer; padding:0; }");
    lines.push('.toast-demo-action{ font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--red-400); background:none; border:none; cursor:pointer; padding:0; text-decoration:underline; align-self:flex-start; margin-top:2px; }');
    lines.push(".toast-demo-progress{ position:absolute; left:0; right:0; bottom:0; height:3px; background:var(--graphite-700); }");
    lines.push(".toast-demo-progress-fill{ height:100%; background:currentColor; }");
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 8px - applied to the whole card */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applied to the whole card */");
    radiiToEmit.forEach(function(radius){
      lines.push(".toast-demo-card--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (4) - color the icon (and, in With-progress, the fill) only - the card stays neutral */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push(".toast-demo-card--" + t.key + " .toast-demo-icon{ " + css.icon + " }");
      lines.push(".toast-demo-card--" + t.key + " .toast-demo-progress-fill{ " + css.icon + " }");
    });
    lines.push("");
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per type, Default state" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push('<div class="toast-demo-card toast-demo-card--' + t.key + '" style="border-radius:' + radiusCssFor(exampleRadius) + '">');
      if (showIcon) lines.push("  " + ICONS[t.key].replace('<svg ', '<svg class="toast-demo-icon" '));
      lines.push('  <div class="toast-demo-body">');
      lines.push('    <p class="toast-demo-title">' + escapeHtml(title) + "</p>");
      lines.push('    <p class="toast-demo-description">' + escapeHtml(description) + "</p>");
      lines.push("  </div>");
      lines.push("</div>");
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Corner radius value, fully
  // resolved (never "ask the question") - used by the Copy prompt/Copy
  // code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(radius, title, description, showIcon){
    return buildFullPrompt({
      radius: { mode: "specific", values: [radius] },
      title: title,
      description: description,
      showIcon: showIcon
    });
  }

  function buildComboCode(radius, title, description, showIcon){
    return buildFullCode({
      radius: { mode: "specific", values: [radius] },
      title: title,
      description: description,
      showIcon: showIcon
    });
  }

  // Renders one .toast-demo-card for a given type/state/radius combination.
  function buildToastField(typeKey, stateKey, radius, title, description, showIcon){
    var radiusCss = radiusCssFor(radius);
    var iconHtml = showIcon ? ICONS[typeKey].replace('<svg ', '<svg class="toast-demo-icon" ') : "";
    var closeHtml = stateKey === "dismissible" ? '<button type="button" class="toast-demo-close" aria-label="Dismiss">' + CLOSE_ICON + "</button>" : "";
    var actionHtml = stateKey === "with-action" ? '<button type="button" class="toast-demo-action">View</button>' : "";
    var progressHtml = stateKey === "with-progress" ? '<div class="toast-demo-progress"><div class="toast-demo-progress-fill" style="width:60%;"></div></div>' : "";
    var bodyHtml = '<div class="toast-demo-body">' +
      '<p class="toast-demo-title">' + escapeHtml(title) + "</p>" +
      '<p class="toast-demo-description">' + escapeHtml(description) + "</p>" +
      actionHtml +
      "</div>";
    return '<div class="toast-demo-card toast-demo-card--' + typeKey + '" style="border-radius:' + radiusCss + '">' +
      iconHtml + bodyHtml + closeHtml + progressHtml +
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

    // Gallery-card copy CTA + click-to-navigate (toast.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-toast"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-toast"]');
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
    var toastTypeCards = document.querySelectorAll(".toast-type-card[data-system]");
    toastTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "toast-" + card.dataset.system + ".html";
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

    // Renders either a plain Copy prompt/Copy code button (exactly one
    // Corner radius value is in play) or, whenever more than one value is
    // currently selected, a disclosure dropdown listing every value by
    // name with its own "Copy" button.
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

    var matrixContainer = document.querySelector('[data-role="toast-matrix-container"]');
    if (!matrixContainer) return;

    var radiusMount = document.querySelector('[data-role="toast-radius-mount"]');
    var titleInput = document.querySelector('[data-role="toast-title"]');
    var descriptionInput = document.querySelector('[data-role="toast-description"]');
    var showIconInput = document.querySelector('[data-role="toast-show-icon"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function comboLabel(radius){
      return optionLabelFor(RADIUS_OPTIONS, radius);
    }

    function buildMatrixSection(radius, title, description, showIcon){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildToastField(t.key, state.key, radius, title, description, showIcon) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius]),
        title: titleInput ? (titleInput.value.trim() || DEFAULT_TITLE) : DEFAULT_TITLE,
        description: descriptionInput ? (descriptionInput.value.trim() || DEFAULT_DESCRIPTION) : DEFAULT_DESCRIPTION,
        showIcon: showIconInput ? showIconInput.checked : true
      };
    }

    function render(){
      var title = titleInput ? (titleInput.value.trim() || DEFAULT_TITLE) : DEFAULT_TITLE;
      var description = descriptionInput ? (descriptionInput.value.trim() || DEFAULT_DESCRIPTION) : DEFAULT_DESCRIPTION;
      var showIcon = showIconInput ? showIconInput.checked : true;

      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      radii.forEach(function(radius){
        html += buildMatrixSection(radius, title, description, showIcon);
        combos.push({ radius: radius, label: comboLabel(radius), title: title, description: description, showIcon: showIcon });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.radius, c.title, c.description, c.showIcon); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.radius, c.title, c.description, c.showIcon); });
    }

    var propertyMultiSelects = {};
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "toast-radius-dropdown-label",
        onChange: render
      });
    }

    if (titleInput){
      titleInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (descriptionInput){
      descriptionInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (showIconInput){
      showIconInput.addEventListener("change", render);
    }

    render();
  });
})();
