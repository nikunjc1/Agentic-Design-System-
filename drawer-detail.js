(() => {
  "use strict";

  var TYPES = [
    { key: "right", label: "Right" },
    { key: "left", label: "Left" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "no-footer", label: "No footer" },
    { key: "no-close", label: "No close" }
  ];

  var FULL_SPEC = {
    right: { purpose: "Slides in from the right edge of the screen - the far more common real-world default for edit panels, filters and detail views." },
    left: { purpose: "Slides in from the left edge of the screen - same structure as Right, used when the trigger or surrounding navigation sits on the left." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Size -> panel WIDTH in px (the panel is always full-height, or
  // near-full-height within its scrim container, regardless of size -
  // only its width changes) - a literal lookup, not formula-derived, same
  // convention as SIZE_MAP in modal-detail.js, so Copy Code reproduces
  // exactly what the Live Preview matrix is showing.
  var SIZE_MAP = { small: 280, medium: 380, large: 480 };
  var SIZE_OPTIONS = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" }
  ];
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  var FALLBACK_DEFAULTS = { size: "medium", radius: "8" };
  var DEFAULT_TITLE = "Edit profile";
  var DEFAULT_BODY = "Update your name, photo, and contact details.";

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

  // Rounds the panel's INNER edge only - the two corners furthest from the
  // screen edge it is anchored to. The outer edge (flush with the screen)
  // always stays square, same concept as a real edge-anchored drawer.
  function innerRadiusStyleFor(typeKey, radiusCss){
    if (typeKey === "left"){
      return "border-top-right-radius:" + radiusCss + ";border-bottom-right-radius:" + radiusCss + ";";
    }
    return "border-top-left-radius:" + radiusCss + ";border-bottom-left-radius:" + radiusCss + ";";
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
    var sizeKey = selectionInfo.sizeKey || FALLBACK_DEFAULTS.size;
    var title = selectionInfo.title || DEFAULT_TITLE;
    var body = selectionInfo.body || DEFAULT_BODY;
    var showClose = selectionInfo.showClose !== undefined ? selectionInfo.showClose : true;

    var lines = [];
    lines.push("Create a complete Drawer component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable panel component controlled by properties (type, state, size, radius) - a panel that slides in from a screen edge (Left or Right) above a dimmed backdrop (scrim), full-height, with a title bar (optional close \"x\"), a body, and (usually) a footer with Cancel/Save buttons. It reuses the exact same header/body/footer/button visual language as this system's Modal component, just edge-anchored and full-height instead of centered - for tasks that need more room than a Modal but shouldn't fully interrupt the page layout.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (3, structural):");
    lines.push("- Default: title bar with close X, body, and a footer with Cancel/Save buttons.");
    lines.push("- No footer: title bar with close X and body only - an informational panel, no footer action buttons.");
    lines.push("- No close: title bar has NO close X, forcing the user to pick a footer action - same concept as Modal's own No-close state.");
    lines.push("");
    var sizePx = SIZE_MAP[sizeKey] || SIZE_MAP[FALLBACK_DEFAULTS.size];
    lines.push("Size: " + optionLabelFor(SIZE_OPTIONS, sizeKey) + " - controls the panel's width (" + sizePx + "px). The panel is always full-height regardless of size. Other options: " + SIZE_OPTIONS.map(function(o){ return o.label + " (" + SIZE_MAP[o.value] + "px)"; }).join(" / ") + ".");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS));
    lines.push("Corner radius applies to the panel's inner edge only - the outer edge flush against the screen always stays square.");
    lines.push("");
    lines.push("Component properties: Title (text, e.g. \"" + title + "\"); Body text (text, e.g. \"" + body + "\"); Show close button (boolean toggle, default on - when off, the header renders with no close X, the same visual result as the No-close state but driven as a property rather than a fixed state).");
    lines.push("Show close button is currently: " + (showClose ? "on" : "off") + ".");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var sizeKey = selectionInfo.sizeKey || FALLBACK_DEFAULTS.size;
    var title = selectionInfo.title || DEFAULT_TITLE;
    var body = selectionInfo.body || DEFAULT_BODY;
    var showClose = selectionInfo.showClose !== undefined ? selectionInfo.showClose : true;

    var graphite900 = getCssVar("--graphite-900", "#15171A");
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var line = getCssVar("--line", "rgba(255,255,255,0.08)");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var textMid = getCssVar("--text-mid", "#A7ABB2");
    var textDim = getCssVar("--text-dim", "#64686F");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red600 = getCssVar("--red-600", "#D80016");

    var lines = [];
    lines.push("/* Agentic Design System - Drawer component */");
    lines.push(".drawer-scrim{ box-sizing:border-box; position:fixed; inset:0; display:flex; padding:0; background:rgba(0,0,0,0.55); z-index:1000; }");
    lines.push('.drawer-panel{ box-sizing:border-box; height:100%; background:' + graphite900 + "; border:1px solid " + lineStrong + '; box-shadow:0 24px 48px rgba(0,0,0,0.5); display:flex; flex-direction:column; overflow:hidden; }');
    lines.push(".drawer-panel--right{ margin-left:auto; }");
    lines.push(".drawer-panel--left{ margin-right:auto; }");
    lines.push("");
    lines.push("/* Size - controls panel width, panel is always full-height */");
    SIZE_OPTIONS.forEach(function(o){
      lines.push(".drawer-panel--" + o.value + "{ width:" + SIZE_MAP[o.value] + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - inner edge only, not chosen yet, default is 8px */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - inner edge only */");
    radiiToEmit.forEach(function(radius){
      var radiusCss = radiusCssFor(radius);
      lines.push(".drawer-panel--right.drawer-panel--radius-" + radiusClassSuffix(radius) + "{ border-top-left-radius:" + radiusCss + "; border-bottom-left-radius:" + radiusCss + "; }");
      lines.push(".drawer-panel--left.drawer-panel--radius-" + radiusClassSuffix(radius) + "{ border-top-right-radius:" + radiusCss + "; border-bottom-right-radius:" + radiusCss + "; }");
    });
    lines.push("");
    lines.push(".drawer-header{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:16px 20px; border-bottom:1px solid " + line + "; }");
    lines.push('.drawer-title{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:16px; font-weight:600; color:' + textHi + "; margin:0; }");
    lines.push(".drawer-close{ flex:none; width:20px; height:20px; background:none; border:none; color:" + textDim + "; cursor:pointer; padding:0; }");
    lines.push('.drawer-body{ padding:16px 20px; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:14px; color:' + textMid + "; flex:1; overflow:auto; }");
    lines.push(".drawer-footer{ display:flex; justify-content:flex-end; gap:8px; padding:12px 20px; border-top:1px solid " + line + "; }");
    lines.push('.drawer-btn{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:13px; font-weight:600; padding:8px 16px; border-radius:4px; cursor:pointer; border:1.5px solid transparent; }');
    lines.push(".drawer-btn--cancel{ background:transparent; border-color:" + lineStrong + "; color:" + textHi + "; }");
    lines.push(".drawer-btn--primary{ color:#FFFFFF; background:" + red500 + "; }");
    lines.push(".drawer-btn--primary:hover{ background:" + red600 + "; }");
    lines.push("");

    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var exampleRadiusCss = radiusCssFor(exampleRadius);
    lines.push("<!-- Example usage - one per type, at " + optionLabelFor(SIZE_OPTIONS, sizeKey) + " size" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen radius" : "") + " -->");
    TYPES.forEach(function(t){
      var innerStyle = t.key === "left"
        ? "border-top-right-radius:" + exampleRadiusCss + ";border-bottom-right-radius:" + exampleRadiusCss + ";"
        : "border-top-left-radius:" + exampleRadiusCss + ";border-bottom-left-radius:" + exampleRadiusCss + ";";
      lines.push('<div class="drawer-scrim">');
      lines.push('  <div class="drawer-panel drawer-panel--' + t.key + " drawer-panel--" + sizeKey + '" style="' + innerStyle + '">');
      lines.push('    <div class="drawer-header">');
      lines.push('      <p class="drawer-title">' + title + "</p>");
      if (showClose) lines.push('      <button type="button" class="drawer-close" aria-label="Close">&times;</button>');
      lines.push("    </div>");
      lines.push('    <div class="drawer-body"><p>' + body + "</p></div>");
      lines.push('    <div class="drawer-footer">');
      lines.push('      <button type="button" class="drawer-btn drawer-btn--cancel">Cancel</button>');
      lines.push('      <button type="button" class="drawer-btn drawer-btn--primary">Save</button>');
      lines.push("    </div>");
      lines.push("  </div>");
      lines.push("</div>");
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Corner radius value (at the
  // current fixed Size) - used by the Copy prompt/Copy code dropdown's
  // per-combination "Copy" buttons.
  function buildComboPrompt(sizeKey, radius, title, body, showClose){
    return buildFullPrompt({
      radius: { mode: "specific", values: [radius] },
      sizeKey: sizeKey,
      title: title,
      body: body,
      showClose: showClose
    });
  }

  function buildComboCode(sizeKey, radius, title, body, showClose){
    return buildFullCode({
      radius: { mode: "specific", values: [radius] },
      sizeKey: sizeKey,
      title: title,
      body: body,
      showClose: showClose
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

    // Gallery-card copy CTA + click-to-navigate (drawer.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-drawer"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-drawer"]');
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
    var drawerTypeCards = document.querySelectorAll(".drawer-type-card[data-system]");
    drawerTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "drawer-" + card.dataset.system + ".html";
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
    // currently selected, a disclosure dropdown listing every combination
    // by name with its own "Copy" button.
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

    var matrixContainer = document.querySelector('[data-role="drawer-matrix-container"]');
    if (!matrixContainer) return;

    var sizeSelect = document.querySelector('[data-role="drawer-size-select"]');
    var radiusMount = document.querySelector('[data-role="drawer-radius-mount"]');
    var titleInput = document.querySelector('[data-role="drawer-title"]');
    var bodyInput = document.querySelector('[data-role="drawer-body"]');
    var showCloseInput = document.querySelector('[data-role="drawer-show-close"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildDrawerField(typeKey, stateKey, sizeKey, radius, title, body, showClose){
      var radiusCss = radiusCssFor(radius);
      var hideClose = !showClose || stateKey === "no-close";
      var closeHtml = hideClose ? "" : '<button type="button" class="modal-demo-close" aria-label="Close" tabindex="-1">&times;</button>';
      var headerHtml = '<div class="modal-demo-header"><span class="modal-demo-title">' + title + "</span>" + closeHtml + "</div>";

      var bodyHtml = '<div class="modal-demo-body"><p style="margin:0;">' + body + "</p></div>";

      var footerHtml = "";
      if (stateKey !== "no-footer"){
        footerHtml = '<div class="modal-demo-footer">' +
          '<button type="button" class="modal-demo-btn modal-demo-btn--cancel" tabindex="-1">Cancel</button>' +
          '<button type="button" class="modal-demo-btn modal-demo-btn--primary" tabindex="-1">Save</button>' +
          "</div>";
      }

      var panelClass = "drawer-demo-panel drawer-demo-panel--" + typeKey + " drawer-demo-panel--" + sizeKey;
      var panelStyle = innerRadiusStyleFor(typeKey, radiusCss);
      return '<div class="drawer-demo-scrim"><div class="' + panelClass + '" style="' + panelStyle + '">' +
        headerHtml + bodyHtml + footerHtml +
        "</div></div>";
    }

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function buildMatrixSection(sizeKey, radius, title, body, showClose){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildDrawerField(t.key, state.key, sizeKey, radius, title, body, showClose) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + optionLabelFor(RADIUS_OPTIONS, radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius]),
        sizeKey: sizeSelect ? sizeSelect.value : FALLBACK_DEFAULTS.size,
        title: titleInput ? (titleInput.value.trim() || DEFAULT_TITLE) : DEFAULT_TITLE,
        body: bodyInput ? (bodyInput.value.trim() || DEFAULT_BODY) : DEFAULT_BODY,
        showClose: showCloseInput ? showCloseInput.checked : true
      };
    }

    function render(){
      var sizeKey = sizeSelect ? sizeSelect.value : FALLBACK_DEFAULTS.size;
      var title = titleInput ? (titleInput.value.trim() || DEFAULT_TITLE) : DEFAULT_TITLE;
      var body = bodyInput ? (bodyInput.value.trim() || DEFAULT_BODY) : DEFAULT_BODY;
      var showClose = showCloseInput ? showCloseInput.checked : true;

      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      radii.forEach(function(radius){
        html += buildMatrixSection(sizeKey, radius, title, body, showClose);
        combos.push({ radius: radius, sizeKey: sizeKey, label: optionLabelFor(RADIUS_OPTIONS, radius), title: title, body: body, showClose: showClose });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.sizeKey, c.radius, c.title, c.body, c.showClose); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.sizeKey, c.radius, c.title, c.body, c.showClose); });
    }

    var propertyMultiSelects = {};
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "drawer-radius-dropdown-label",
        onChange: render
      });
    }

    if (sizeSelect){
      sizeSelect.addEventListener("change", render);
    }
    if (titleInput){
      titleInput.addEventListener("input", render);
    }
    if (bodyInput){
      bodyInput.addEventListener("input", render);
    }
    if (showCloseInput){
      showCloseInput.addEventListener("change", render);
    }

    render();
  });
})();
