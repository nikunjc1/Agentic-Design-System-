(() => {
  "use strict";

  // Breadcrumb - a horizontal trail of navigational links showing the
  // user's current location within a hierarchy. Architecture mirrors
  // group-button-detail.js closely: multiselect properties, a multi-combo
  // Live Preview matrix, getCssVar-based theme-aware live color reads, a
  // literal SIZE_SCALE lookup matching the scratch CSS exactly, and the
  // same "ask the question vs state the explicit choice" Copy Prompt/Code
  // logic via selectionMode.

  var TYPES = [
    { key: "chevron", label: "Chevron" },
    { key: "slash", label: "Slash" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  // Exact divider SVG as specified - literal, not resized per breadcrumb
  // size (the size property scales the trail's text only).
  var CHEVRON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M9 18l6-6-6-6"/></svg>';

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  function linkStateCss(){
    var textDim = getCssVar("--text-dim", "#64686F");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    return {
      rest: "color:" + textDim + ";",
      hover: "color:" + textHi + ";text-decoration:underline;",
      focus: "outline:2px solid " + red400 + ";outline-offset:2px;border-radius:2px;",
      disabled: "opacity:0.5;pointer-events:none;"
    };
  }

  function dividerCss(){
    return { color: getCssVar("--text-dim", "#64686F") };
  }

  function currentCss(){
    return { color: getCssVar("--text-hi", "#F3F2EF") };
  }

  // Size scale - a Breadcrumb is a plain text trail, not a button, so
  // "size" here drives font-size directly rather than the button-style
  // height + padding pair used by group-button-detail.js's own SIZE_SCALE.
  // Same 8 nominal option values as every other sized component (for a
  // consistent Size dropdown across the system), hand-tuned to font-sizes
  // that read naturally for inline breadcrumb text - identical to the real
  // .breadcrumb-demo-trail--* rules in breadcrumb-detail-CSS-TO-MERGE.txt,
  // never re-derived by formula, so Copy Code matches the Live Preview
  // exactly at every size, not just the default.
  var SIZE_SCALE = {
    "24": 12,
    "28": 13,
    "32": 13,
    "36": 14,
    "40": 15,
    "44": 16,
    "48": 17,
    "56": 19
  };

  var SIZE_OPTIONS = [
    { value: "24", label: "24px - XXS" },
    { value: "28", label: "28px - XS" },
    { value: "32", label: "32px - S" },
    { value: "36", label: "36px - SM" },
    { value: "40", label: "40px - M" },
    { value: "44", label: "44px - L" },
    { value: "48", label: "48px - XL" },
    { value: "56", label: "56px - XXL" }
  ];
  var FALLBACK_DEFAULTS = { size: "40" };
  var DEFAULT_LABELS = ["Home", "Products", "Shoes"];

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function parseLabels(raw){
    var labels = (raw || "").split(",").map(function(s){ return s.trim(); }).filter(Boolean);
    return labels.length ? labels : DEFAULT_LABELS;
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
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var css = linkStateCss();

    var lines = [];
    lines.push("Create a complete Breadcrumb component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, state) - a horizontal trail of navigational links showing the user's current location within a hierarchy, separated by a divider, with the LAST item always the current page (styled differently - not a clickable link, just text in a stronger color).");
    lines.push("");
    lines.push("Types (2):");
    lines.push("- Chevron: the divider between items is a small chevron-right icon.");
    lines.push("- Slash: the divider between items is a literal \"/\" character.");
    lines.push("");
    lines.push("States (4, apply to the FIRST link only - every earlier/later link besides it and the final current-page item stay at Rest):");
    lines.push("  Rest: " + css.rest);
    lines.push("  Hover: " + css.hover);
    lines.push("  Focused: " + css.focus + " Never just a color change, so layout never shifts.");
    lines.push("  Disabled: " + css.disabled + " Use aria-disabled=\"true\" on the link, not the native disabled attribute - links have no native disabled state.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Font-size scales proportionally, applied to the whole trail.");
    lines.push("");
    lines.push("Component properties: Labels (comma-separated editable text, one per breadcrumb item, default \"Home, Products, Shoes\" - item count follows the number of labels entered). The last label is always rendered as the current page (a non-link span); every earlier label is a real link.");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var link = linkStateCss();
    var divider = dividerCss();
    var current = currentCss();

    var lines = [];
    lines.push("/* Agentic Design System - Breadcrumb component */");
    lines.push('.breadcrumb{ display:inline-flex; align-items:center; flex-wrap:wrap; box-sizing:border-box; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-weight:500; }');
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (font-size in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      lines.push(".breadcrumb--" + size + "{ font-size:" + SIZE_SCALE[size] + "px; }");
    });
    lines.push("");
    lines.push("/* Types (2) - the divider differs, link/current treatment is shared */");
    lines.push(".breadcrumb--chevron .breadcrumb-divider{ display:inline-flex; align-items:center; margin:0 6px; color:" + divider.color + "; }");
    lines.push(".breadcrumb--slash .breadcrumb-divider{ margin:0 8px; color:" + divider.color + "; }");
    lines.push("");
    lines.push("/* Link states (apply to the first link only) - real pseudo-classes combined with static classes so the Live Preview can force each state */");
    lines.push(".breadcrumb-link{ " + link.rest + " text-decoration:none; cursor:pointer; transition:color .15s ease; }");
    lines.push(".breadcrumb-link:hover, .breadcrumb-link.is-hover{ " + link.hover + " }");
    lines.push(".breadcrumb-link:focus-visible, .breadcrumb-link.is-focus{ " + link.focus + " }");
    lines.push('.breadcrumb-link[aria-disabled="true"], .breadcrumb-link.is-disabled{ ' + link.disabled + " }");
    lines.push("");
    lines.push("/* Current page - always the last item, never a link */");
    lines.push(".breadcrumb-current{ color:" + current.color + "; cursor:default; }");
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push('<nav class="breadcrumb breadcrumb--' + t.key + " breadcrumb--" + exampleSize + '" aria-label="Breadcrumb">');
      DEFAULT_LABELS.forEach(function(label, i){
        var isLast = i === DEFAULT_LABELS.length - 1;
        if (isLast){
          lines.push('  <span class="breadcrumb-current">' + label + "</span>");
        } else {
          lines.push('  <a class="breadcrumb-link" href="#">' + label + "</a>");
          lines.push('  <span class="breadcrumb-divider" aria-hidden="true">' + (t.key === "chevron" ? CHEVRON_SVG : "/") + "</span>");
        }
      });
      lines.push("</nav>");
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size, fully resolved (never
  // "ask the question") - used by the Copy prompt/Copy code dropdown's
  // per-combination "Copy" buttons.
  function buildComboPrompt(size){
    return buildFullPrompt({ size: { mode: "specific", values: [size] } });
  }

  function buildComboCode(size){
    return buildFullCode({ size: { mode: "specific", values: [size] } });
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

    // Gallery-card copy CTA + click-to-navigate (breadcrumb.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-breadcrumb"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-breadcrumb"]');
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
    var breadcrumbTypeCards = document.querySelectorAll(".breadcrumb-type-card[data-system]");
    breadcrumbTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "breadcrumb-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button (exactly one
    // Size is in play) or, whenever more than one size is currently
    // selected, a disclosure dropdown listing every size by name with its
    // own "Copy" button.
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

    var matrixContainer = document.querySelector('[data-role="breadcrumb-matrix-container"]');
    if (!matrixContainer) return;

    var labelsInput = document.querySelector('[data-role="breadcrumb-label"]');
    var sizeMount = document.querySelector('[data-role="breadcrumb-size-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    // Shared markup builder - used by both the Live Preview matrix cells
    // and the listing-page type-card preview. Uses the "-demo-" namespace
    // from breadcrumb-detail-CSS-TO-MERGE.txt (scoped to this page's own
    // previews) rather than the production ".breadcrumb" classes that
    // Copy Code emits, so the two never collide before the scratch CSS is
    // merged into shell.css.
    function buildBreadcrumbDemo(typeKey, stateKey, stateCls, size, labels){
      var isDisabled = stateKey === "disabled";
      var trailCls = "breadcrumb-demo-trail breadcrumb-demo-trail--" + typeKey + " breadcrumb-demo-trail--" + size;
      var parts = [];
      labels.forEach(function(label, i){
        var isLast = i === labels.length - 1;
        if (isLast){
          parts.push('<span class="breadcrumb-demo-current">' + label + "</span>");
          return;
        }
        if (i === 0){
          var linkCls = "breadcrumb-demo-link" + stateCls;
          var disabledAttr = (i === 0 && isDisabled) ? ' aria-disabled="true"' : "";
          parts.push('<a class="' + linkCls + '" href="#"' + disabledAttr + ">" + label + "</a>");
        } else {
          parts.push('<a class="breadcrumb-demo-link" href="#">' + label + "</a>");
        }
        parts.push('<span class="breadcrumb-demo-divider" aria-hidden="true">' + (typeKey === "chevron" ? CHEVRON_SVG : "/") + "</span>");
      });
      return '<nav class="' + trailCls + '" aria-label="Breadcrumb">' + parts.join("") + "</nav>";
    }

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function comboLabel(size){
      return optionLabelFor(SIZE_OPTIONS, size);
    }

    function buildMatrixSection(size, labels){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildBreadcrumbDemo(t.key, state.key, state.cls, size, labels) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size])
      };
    }

    function render(){
      var labels = parseLabels(labelsInput.value);
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(size, labels);
        combos.push({ size: size, label: comboLabel(size) });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "breadcrumb-size-dropdown-label",
        onChange: render
      });
    }

    if (labelsInput) labelsInput.addEventListener("input", render);

    render();

    // Listing-page type-card preview (Chevron type, "Home / Products /
    // Shoes" trail) - rendered once, independent of the detail page's own
    // property controls (which don't exist on breadcrumb.html).
    var typeCardPreview = document.querySelector('[data-role="breadcrumb-type-card-preview"]');
    if (typeCardPreview){
      typeCardPreview.innerHTML = buildBreadcrumbDemo("chevron", "rest", "", FALLBACK_DEFAULTS.size, DEFAULT_LABELS);
    }
  });
})();
