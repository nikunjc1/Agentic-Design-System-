(() => {
  "use strict";

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "with-media", label: "With media" },
    { key: "with-actions", label: "With actions" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "selected", cls: " is-selected", label: "Selected" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    "default": { purpose: "Title and body text only - the simplest form, for compact grouped content." },
    "with-media": { purpose: "Adds a cover/media area above the title and body - useful for content with a visual, like a product or article preview." },
    "with-actions": { purpose: "Adds a footer row of two action buttons below the body - useful when the card itself needs a primary action, like \"View details\"." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // States apply to the whole card regardless of type - unlike Alert's
  // per-type accent color, Card's Rest/Hover/Selected/Disabled visuals are
  // the same set of rules across all 3 types, so this returns one shared
  // object rather than being keyed by typeKey.
  function liveCssFor(){
    var graphite900 = getCssVar("--graphite-900", "#15171A");
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var textDim = getCssVar("--text-dim", "#6E7278");
    var red500 = getCssVar("--red-500", "#FF031A");
    return {
      rest: "background:" + graphite900 + ";border:1.5px solid " + lineStrong + ";",
      hover: "border-color:" + textDim + ";box-shadow:0 4px 16px rgba(0,0,0,0.3);",
      selected: "border-color:" + red500 + ";box-shadow:0 0 0 1px " + red500 + ";",
      disabled: "opacity:0.4;"
    };
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
    title: "Team standup",
    body: "Daily sync at 9:30 AM in the main conference room.",
    showShadow: true
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
      body: (selectionInfo.body !== undefined) ? selectionInfo.body : FALLBACK_DEFAULTS.body,
      showShadow: (selectionInfo.showShadow !== undefined) ? selectionInfo.showShadow : FALLBACK_DEFAULTS.showShadow
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;
    var css = liveCssFor();

    var lines = [];
    lines.push("Create a complete Card component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, state, radius) - a bordered container for grouping related content, in 3 forms and 4 states.");
    lines.push("");
    lines.push("Types (3):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (4, apply to the whole card, not per type):");
    lines.push("- Rest: " + css.rest);
    lines.push("- Hover: " + css.hover + " A lifted shadow, distinct from the resting Show-shadow drop-shadow.");
    lines.push("- Selected: " + css.selected + " Reads as a persistent chosen-state border indicating this card is the chosen one in a set, not a keyboard focus ring.");
    lines.push("- Disabled: " + css.disabled + " No interaction.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to the whole card; With media's cover area follows the card's top corners only.");
    lines.push("");
    lines.push("Component properties: Corner radius; Title (text, default \"" + FALLBACK_DEFAULTS.title + "\"); Body (text, default \"" + FALLBACK_DEFAULTS.body + "\"); Show shadow (boolean, default checked - adds a resting drop-shadow beneath the card, even before hover, distinct from and combinable with the Hover state's own lift shadow).");
    lines.push("Current values - Title: \"" + info.title + "\", Body: \"" + info.body + "\", Show shadow: " + (info.showShadow ? "yes" : "no") + ".");
    return lines.join("\n");
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Card component */");
    lines.push(".card-demo-panel{ box-sizing:border-box; display:flex; flex-direction:column; width:240px; background:var(--graphite-900); border:1.5px solid var(--line-strong); overflow:hidden; transition:background-color .15s ease, border-color .15s ease, box-shadow .15s ease; }");
    lines.push(".card-demo-panel.card-demo-shadow{ box-shadow:0 2px 8px rgba(0,0,0,0.2); }");
    lines.push(".card-demo-panel:hover, .card-demo-panel.is-hover{ border-color:var(--text-dim); box-shadow:0 4px 16px rgba(0,0,0,0.3); }");
    lines.push(".card-demo-panel.is-selected{ border-color:var(--red-500); box-shadow:0 0 0 1px var(--red-500); }");
    lines.push(".card-demo-panel.is-disabled{ opacity:0.4; pointer-events:none; }");
    lines.push(".card-demo-media{ height:80px; background:linear-gradient(135deg, var(--blue-500), var(--red-500)); flex:none; }");
    lines.push(".card-demo-body-wrap{ padding:14px 16px; display:flex; flex-direction:column; gap:6px; }");
    lines.push('.card-demo-title{ font-family:var(--font-body); font-size:14px; font-weight:600; color:var(--text-hi); text-align:left; }');
    lines.push('.card-demo-text{ font-family:var(--font-body); font-size:13px; color:var(--text-mid); text-align:left; }');
    lines.push("/* Footer reuses Modal's own .modal-demo-footer/.modal-demo-btn classes directly - only the primary button's color needs its own rule here, since it normally comes from Modal's type-scoped .modal-demo-dialog--default/destructive parent. */");
    lines.push(".card-demo-footer .modal-demo-btn--primary{ background:var(--red-500); }");
    return lines.join("\n");
  }

  // Renders one .card-demo-panel - optional media cover ("with-media"),
  // then a title + body text-wrap, then an optional footer button row
  // ("with-actions"). showShadow adds a resting drop-shadow modifier class
  // independent of the state classes, so it can combine with any state.
  function buildCardField(typeKey, stateKey, radius, title, body, showShadow){
    var stateCls = (STATES.filter(function(s){ return s.key === stateKey; })[0] || {}).cls || "";
    var radiusCss = radiusCssFor(radius);
    var shadowCls = showShadow ? " card-demo-shadow" : "";
    var classes = "card-demo-panel card-demo-panel--" + typeKey + shadowCls + stateCls;
    var mediaHtml = (typeKey === "with-media")
      ? '<div class="card-demo-media" style="border-top-left-radius:' + radiusCss + ';border-top-right-radius:' + radiusCss + ';"></div>'
      : "";
    var bodyWrapHtml = '<div class="card-demo-body-wrap"><p class="card-demo-title">' + title + '</p><p class="card-demo-text">' + body + "</p></div>";
    var footerHtml = (typeKey === "with-actions")
      ? '<div class="card-demo-footer modal-demo-footer"><button type="button" class="modal-demo-btn modal-demo-btn--cancel">Cancel</button><button type="button" class="modal-demo-btn modal-demo-btn--primary" style="background:var(--red-500);">View details</button></div>'
      : "";
    return '<div class="' + classes + '" style="border-radius:' + radiusCss + ';">' + mediaHtml + bodyWrapHtml + footerHtml + "</div>";
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per type, Rest state" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen corner radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(buildCardField(t.key, "rest", exampleRadius, info.title, info.body, info.showShadow));
    });
    lines.push("");
    lines.push("<!-- Example usage - the other 3 states (Default type) -->");
    lines.push(buildCardField("default", "hover", exampleRadius, info.title, info.body, info.showShadow));
    lines.push(buildCardField("default", "selected", exampleRadius, info.title, info.body, info.showShadow));
    lines.push(buildCardField("default", "disabled", exampleRadius, info.title, info.body, info.showShadow));
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Corner radius value, fully
  // resolved (never "ask the question") - used by the Copy prompt/Copy code
  // dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(radius, title, body, showShadow){
    return buildFullPrompt({
      radius: { mode: "specific", values: [radius] },
      title: title,
      body: body,
      showShadow: showShadow
    });
  }

  function buildComboCode(radius, title, body, showShadow){
    return buildFullCode({
      radius: { mode: "specific", values: [radius] },
      title: title,
      body: body,
      showShadow: showShadow
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

    // Gallery-card copy CTA + click-to-navigate (card.html's listing card)
    // - separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-card"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-card"]');
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
    var cardTypeCards = document.querySelectorAll(".card-type-card[data-system]");
    cardTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "card-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="card-matrix-container"]');
    if (!matrixContainer) return;

    var radiusMount = document.querySelector('[data-role="card-radius-mount"]');
    var titleInput = document.querySelector('[data-role="card-title"]');
    var bodyInput = document.querySelector('[data-role="card-body"]');
    var showShadowInput = document.querySelector('[data-role="card-show-shadow"]');
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

    // Since Card has no Size property, only Corner radius drives multiple
    // combos - STATES become the rows and TYPES the columns, exactly like
    // alert-detail.js's buildMatrixSection does with radius-only combos.
    function buildMatrixSection(radius, title, body, showShadow){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildCardField(t.key, state.key, radius, title, body, showShadow) + "</td>";
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
        body: bodyInput ? (bodyInput.value.trim() || FALLBACK_DEFAULTS.body) : FALLBACK_DEFAULTS.body,
        showShadow: showShadowInput ? showShadowInput.checked : FALLBACK_DEFAULTS.showShadow
      };
    }

    function render(){
      var title = titleInput ? (titleInput.value.trim() || FALLBACK_DEFAULTS.title) : FALLBACK_DEFAULTS.title;
      var body = bodyInput ? (bodyInput.value.trim() || FALLBACK_DEFAULTS.body) : FALLBACK_DEFAULTS.body;
      var showShadow = showShadowInput ? showShadowInput.checked : FALLBACK_DEFAULTS.showShadow;

      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      radii.forEach(function(radius){
        html += buildMatrixSection(radius, title, body, showShadow);
        combos.push({ radius: radius, label: comboLabel(radius), title: title, body: body, showShadow: showShadow });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.radius, c.title, c.body, c.showShadow); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.radius, c.title, c.body, c.showShadow); });
    }

    var propertyMultiSelects = {};
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "card-radius-dropdown-label",
        onChange: render
      });
    }

    if (titleInput){
      titleInput.addEventListener("input", render);
    }
    if (bodyInput){
      bodyInput.addEventListener("input", render);
    }
    if (showShadowInput){
      showShadowInput.addEventListener("change", render);
    }

    render();
  });
})();
