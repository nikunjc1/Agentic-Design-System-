(() => {
  "use strict";

  // Simple inline SVG icon constants - viewBox 0 0 24 24, stroke currentColor
  // so each icon inherits its type's accent color from the .alert-demo-banner
  // modifier class it sits inside, rather than hard-coding a fill per icon.
  var ICONS = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="11" x2="12" y2="16"></line><line x1="12" y1="7.5" x2="12" y2="7.51"></line></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="8 12.5 10.5 15 16 9"></polyline></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 L21 19 L3 19 Z"></path><line x1="12" y1="10" x2="12" y2="14"></line><line x1="12" y1="16.5" x2="12" y2="16.51"></line></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>'
  };
  var CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>';

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
    { key: "title-only", label: "Title only" }
  ];

  var FULL_SPEC = {
    info: { purpose: "A neutral informational message - status updates, tips, and other non-urgent notices." },
    success: { purpose: "Confirms a positive outcome - a save, a submit, or another action completing as expected." },
    warning: { purpose: "Flags something that needs attention before it becomes a problem." },
    error: { purpose: "Reports a failure or invalid state that is blocking progress." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Returns the type's accent color only - used for the icon, the title
  // text and the left-border accent. Every type shares the same neutral
  // --graphite-800 background, so only the icon/title/border ever carry
  // the semantic color, keeping the banner itself visually calm.
  function liveCssFor(typeKey){
    var blue500 = getCssVar("--blue-500", "#4F8FE6");
    var green500 = getCssVar("--green-500", "#2FBF6E");
    var amber500 = getCssVar("--amber-500", "#E6A53A");
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var accentMap = { info: blue500, success: green500, warning: amber500, error: danger500 };
    return { accent: accentMap[typeKey], background: graphite800 };
  }

  // Corner radius option list - same value scale as the Button and Group
  // Button systems, shared between the page's own multi-select dropdown and
  // the Copy Prompt/Copy Code generators below.
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  var FALLBACK_DEFAULTS = {
    radius: "8",
    title: "Update available",
    description: "A new version is ready to install.",
    showIcon: true
  };

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
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

  function resolveInfo(selectionInfo){
    selectionInfo = selectionInfo || {};
    return {
      radius: selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS),
      title: (selectionInfo.title !== undefined) ? selectionInfo.title : FALLBACK_DEFAULTS.title,
      description: (selectionInfo.description !== undefined) ? selectionInfo.description : FALLBACK_DEFAULTS.description,
      showIcon: (selectionInfo.showIcon !== undefined) ? selectionInfo.showIcon : FALLBACK_DEFAULTS.showIcon
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push("Create a complete Alert component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, state, radius) - an inline banner/message block embedded in page content (not a floating overlay like Toast), used to surface a status message such as \"Your changes have been saved.\" It sits flush in the page flow, full width of its container, with a colored icon, title, optional description, and optional dismiss/action controls.");
    lines.push("");
    lines.push("Types (4):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Accent color (icon, title text, left border): " + css.accent);
      lines.push("  Background: " + css.background + " - ONE consistent background across every type, never tinted per type. Left border: 3px solid the accent color. Only the icon, title and left border ever carry the semantic color.");
    });
    lines.push("");
    lines.push("States (4, structural - change what's rendered inside the banner, not just its color):");
    lines.push("- Default: title and description, no extra controls.");
    lines.push("- Dismissible: adds a trailing close (x) icon button.");
    lines.push("- With action: adds an inline text-style action button (e.g. \"Undo\") after the description.");
    lines.push("- Title only: title text only - the description is omitted entirely, regardless of whether a description value is set.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to the whole banner.");
    lines.push("");
    lines.push("Component properties: Corner radius; Title (text, default \"" + FALLBACK_DEFAULTS.title + "\"); Description (text, default \"" + FALLBACK_DEFAULTS.description + "\", omitted for the Title-only state); Show icon (boolean, default checked - shows a colored status icon matching the alert's type).");
    lines.push("Current values - Title: \"" + info.title + "\", Description: \"" + info.description + "\", Show icon: " + (info.showIcon ? "yes" : "no") + ".");
    return lines.join("\n");
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Alert component */");
    lines.push(".alert-demo-banner{ box-sizing:border-box; display:flex; align-items:flex-start; gap:12px; padding:14px 16px; background:var(--graphite-800); max-width:420px; }");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push(".alert-demo-banner--" + t.key + "{ border-left:3px solid " + css.accent + "; }");
    });
    lines.push(".alert-demo-icon{ flex:none; width:20px; height:20px; margin-top:1px; }");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push(".alert-demo-banner--" + t.key + " .alert-demo-icon{ color:" + css.accent + "; }");
    });
    lines.push(".alert-demo-body{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:4px; }");
    lines.push('.alert-demo-title{ font-family:var(--font-body); font-size:14px; font-weight:600; color:var(--text-hi); }');
    lines.push('.alert-demo-description{ font-family:var(--font-body); font-size:13px; color:var(--text-mid); }');
    lines.push(".alert-demo-close{ flex:none; width:16px; height:16px; background:none; border:none; color:var(--text-dim); cursor:pointer; padding:0; margin-left:auto; }");
    lines.push('.alert-demo-action{ font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--red-400); background:none; border:none; cursor:pointer; padding:0; text-decoration:underline; align-self:flex-start; margin-top:2px; }');
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per type, Default state" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen corner radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(buildAlertField(t.key, "default", exampleRadius, info.title, info.description, info.showIcon));
    });
    lines.push("");
    lines.push("<!-- Example usage - the other 3 structural states (Info type) -->");
    lines.push(buildAlertField("info", "dismissible", exampleRadius, info.title, info.description, info.showIcon));
    lines.push(buildAlertField("info", "with-action", exampleRadius, info.title, info.description, info.showIcon));
    lines.push(buildAlertField("info", "title-only", exampleRadius, info.title, info.description, info.showIcon));
    return lines.join("\n");
  }

  // Renders one .alert-demo-banner - icon (optional), title + description
  // (description omitted entirely for the "title-only" state, regardless of
  // the Description property's value), then trailing close/action control
  // depending on state.
  function buildAlertField(typeKey, stateKey, radius, title, description, showIcon){
    var radiusCss = radiusCssFor(radius);
    var iconHtml = showIcon ? '<span class="alert-demo-icon">' + ICONS[typeKey] + "</span>" : "";
    var titleHtml = '<p class="alert-demo-title">' + title + "</p>";
    // "title-only" always drops the description, even if one is set.
    var descriptionHtml = (stateKey === "title-only") ? "" : '<p class="alert-demo-description">' + description + "</p>";
    var bodyHtml = '<div class="alert-demo-body">' + titleHtml + descriptionHtml + "</div>";
    var trailingHtml = "";
    if (stateKey === "dismissible"){
      trailingHtml = '<button type="button" class="alert-demo-close" aria-label="Dismiss">' + CLOSE_ICON + "</button>";
    } else if (stateKey === "with-action"){
      trailingHtml = '<button type="button" class="alert-demo-action">Undo</button>';
    }
    return '<div class="alert-demo-banner alert-demo-banner--' + typeKey + '" style="border-radius:' + radiusCss + ';">' + iconHtml + bodyHtml + trailingHtml + "</div>";
  }

  // Builds the prompt/code for exactly ONE Corner radius value, fully
  // resolved (never "ask the question") - used by the Copy prompt/Copy code
  // dropdown's per-combination "Copy" buttons.
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

    // Gallery-card copy CTA + click-to-navigate (alert.html's listing card)
    // - separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-alert"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-alert"]');
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
    var alertTypeCards = document.querySelectorAll(".alert-type-card[data-system]");
    alertTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "alert-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button (exactly one
    // Corner radius value is in play) or, whenever more than one value is
    // currently selected, a disclosure dropdown listing every combination by
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

    var matrixContainer = document.querySelector('[data-role="alert-matrix-container"]');
    if (!matrixContainer) return;

    var radiusMount = document.querySelector('[data-role="alert-radius-mount"]');
    var titleInput = document.querySelector('[data-role="alert-title"]');
    var descriptionInput = document.querySelector('[data-role="alert-description"]');
    var showIconInput = document.querySelector('[data-role="alert-show-icon"]');
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

    // Since Alert has no Size property, only Corner radius drives multiple
    // combos - STATES become the rows and TYPES the columns, exactly like
    // group-button-detail.js's buildMatrixSection does with size/radius,
    // just with the "size" axis dropped entirely.
    function buildMatrixSection(radius, title, description, showIcon){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildAlertField(t.key, state.key, radius, title, description, showIcon) + "</td>";
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
        title: titleInput ? (titleInput.value.trim() || FALLBACK_DEFAULTS.title) : FALLBACK_DEFAULTS.title,
        description: descriptionInput ? (descriptionInput.value.trim() || FALLBACK_DEFAULTS.description) : FALLBACK_DEFAULTS.description,
        showIcon: showIconInput ? showIconInput.checked : FALLBACK_DEFAULTS.showIcon
      };
    }

    function render(){
      var title = titleInput ? (titleInput.value.trim() || FALLBACK_DEFAULTS.title) : FALLBACK_DEFAULTS.title;
      var description = descriptionInput ? (descriptionInput.value.trim() || FALLBACK_DEFAULTS.description) : FALLBACK_DEFAULTS.description;
      var showIcon = showIconInput ? showIconInput.checked : FALLBACK_DEFAULTS.showIcon;

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
        labelledBy: "alert-radius-dropdown-label",
        onChange: render
      });
    }

    if (titleInput){
      titleInput.addEventListener("input", render);
    }
    if (descriptionInput){
      descriptionInput.addEventListener("input", render);
    }
    if (showIconInput){
      showIconInput.addEventListener("change", render);
    }

    render();
  });
})();
