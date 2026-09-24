(() => {
  "use strict";

  // Anchor - a standalone inline text hyperlink used for wayfinding (e.g.
  // "Learn more", "View documentation"), distinct from Button's boxed
  // "Link"/"Transparent" type which reads as a call-to-action. Architecture
  // mirrors group-button-detail.js: multiselect property (Size), a
  // multi-combo Live Preview matrix (one table per selected size), theme-aware
  // live color reads via getCssVar, a literal size lookup matching the
  // hardcoded CSS exactly, and the same ask-vs-specific Copy Prompt/Code
  // dropdown pattern via selectionMode.

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var TYPES = [
    { key: "standalone", label: "Standalone" },
    { key: "icon", label: "With icon" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "focus", cls: " is-focus", label: "Focused" },
    { key: "visited", cls: " is-visited", label: "Visited" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    standalone: { purpose: "Plain inline text link with no adornment - reads as part of the surrounding copy until it is interacted with." },
    icon: { purpose: "Text plus a trailing external-link arrow icon - signals the link leaves the current context, e.g. an external reference or a documentation link." }
  };

  // The exact external-link arrow SVG the spec calls for, verbatim - used
  // as-is inside the Copy Prompt text so the described icon is unambiguous.
  var ANCHOR_ICON_SVG_EXACT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>';

  function anchorIconSvg(cls){
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>';
  }

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // States are identical across both types (the icon type only differs by
  // the trailing SVG in the markup), so there is a single shared CSS map
  // rather than one per type.
  function liveCssFor(){
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var red500 = getCssVar("--red-500", "#FF031A");
    var red600 = getCssVar("--red-600", "#D80016");
    return {
      rest: "color:" + red400 + ";text-decoration:none;",
      hover: "color:" + red500 + ";text-decoration:underline;",
      focus: "color:" + red400 + ";text-decoration:none;outline:2px solid " + red400 + ";outline-offset:2px;border-radius:2px;",
      visited: "color:" + red600 + ";",
      disabled: "opacity:0.5;cursor:default;pointer-events:none;"
    };
  }

  // Icon pixel size per font size - hand-tuned to roughly match each size's
  // line-height. Must stay identical to the real .anchor-demo-link--fs*
  // .anchor-demo-icon rules in shell.css (not re-derived by formula) so
  // Copy Code reproduces exactly what the Live Preview matrix is showing,
  // at every size, not just the one size a formula happens to agree with.
  var ICON_SIZE_SCALE = {
    "12": 14,
    "14": 16,
    "16": 18,
    "18": 20
  };

  // Size option list - anchors are sized by font-size, not height, so this
  // is a dedicated small scale shared between the page's own multi-select
  // dropdown and the Copy Prompt/Copy Code generators below.
  var SIZE_OPTIONS = [
    { value: "12", label: "12px - XS" },
    { value: "14", label: "14px - S" },
    { value: "16", label: "16px - M" },
    { value: "18", label: "18px - L" }
  ];
  var FALLBACK_DEFAULTS = { size: "14" };
  var DEFAULT_LABEL = "Learn more";

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function parseLabel(raw){
    var trimmed = (raw || "").trim();
    return trimmed || DEFAULT_LABEL;
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

  // Note: unlike the multiselect Size property, the Label text input never
  // feeds into the generated Prompt/Code text below - it only drives the
  // Live Preview matrix. Copy Prompt/Code always describe the property
  // generically (name + default), the same convention group-button-detail.js
  // uses for its own Labels input.
  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var label = selectionInfo.label || DEFAULT_LABEL;
    var css = liveCssFor();

    var lines = [];
    lines.push("Create a complete Anchor (inline text link) component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, state) - a standalone piece of plain inline navigational text used for wayfinding (e.g. \"Learn more\", \"View documentation\"), distinct from Button's boxed \"Link\"/\"Transparent\" type, which reads as a boxed call-to-action.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("States (5, apply to the anchor text - identical across both types):");
    lines.push("- Rest: " + css.rest);
    lines.push("- Hover: " + css.hover);
    lines.push("- Focused: " + css.focus + " Never just a color change, so keyboard focus is always visible.");
    lines.push("- Visited: " + css.visited + " Only a color change is allowed here - browsers block every other CSS property on the real :visited pseudo-class for privacy reasons.");
    lines.push("- Disabled: " + css.disabled + " Anchors have no native disabled attribute, so this is simulated with aria-disabled=\"true\" plus pointer-events:none and reduced opacity - it is not a real browser-level disabled element.");
    lines.push("");
    lines.push("With icon type only: append this trailing external-link arrow SVG after the text with a small gap, sized to roughly match the text's line-height: " + ANCHOR_ICON_SVG_EXACT);
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Anchors are sized by font-size, not height - the icon (With icon type) scales alongside it.");
    lines.push("");
    lines.push("Component properties: Label (editable text, current value \"" + label + "\").");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var label = selectionInfo.label || DEFAULT_LABEL;
    var c = liveCssFor();

    var lines = [];
    lines.push("/* Agentic Design System - Anchor (inline text link) component */");
    lines.push('.anchor-demo-link{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; text-decoration:none; display:inline-flex; align-items:center; gap:4px; cursor:pointer; }');
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (font-size in px) - not chosen yet, default is 14 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      lines.push(".anchor-demo-link--fs" + size + "{ font-size:" + size + "px; }");
      lines.push(".anchor-demo-link--fs" + size + " .anchor-demo-icon{ width:" + ICON_SIZE_SCALE[size] + "px; height:" + ICON_SIZE_SCALE[size] + "px; }");
    });
    lines.push("");
    lines.push("/* States (5) - identical across both types */");
    lines.push(".anchor-demo-link{ " + c.rest + " }");
    lines.push(".anchor-demo-link:hover, .anchor-demo-link.is-hover{ " + c.hover + " }");
    lines.push(".anchor-demo-link:focus-visible, .anchor-demo-link.is-focus{ " + c.focus + " }");
    lines.push("/* :visited only allows a color change - browsers block every other property for privacy */");
    lines.push(".anchor-demo-link:visited, .anchor-demo-link.is-visited{ " + c.visited + " }");
    lines.push("/* Anchors have no native disabled attribute - simulate it with aria-disabled plus pointer-events:none */");
    lines.push('.anchor-demo-link[aria-disabled="true"], .anchor-demo-link.is-disabled{ ' + c.disabled + ' }');
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    lines.push("<!-- Example usage - one per type" + (sizeInfo.mode === "specific" ? ", at the explicitly chosen size" : "") + " -->");
    TYPES.forEach(function(t){
      var iconMarkup = t.key === "icon" ? " " + anchorIconSvg("anchor-demo-icon") : "";
      lines.push('<a href="#" class="anchor-demo-link anchor-demo-link--' + t.key + ' anchor-demo-link--fs' + exampleSize + '">' + escapeHtml(label) + iconMarkup + "</a>");
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size, fully resolved (never
  // "ask the question") - used by the Copy prompt/Copy code dropdown's
  // per-combination "Copy" buttons.
  function buildComboPrompt(size, label){
    return buildFullPrompt({ size: { mode: "specific", values: [size] }, label: label });
  }

  function buildComboCode(size, label){
    return buildFullCode({ size: { mode: "specific", values: [size] }, label: label });
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

    // Gallery-card copy CTA + click-to-navigate (anchor.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-anchor"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-anchor"]');
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
    var anchorTypeCards = document.querySelectorAll(".anchor-type-card[data-system]");
    anchorTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "anchor-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="anchor-matrix-container"]');
    if (!matrixContainer) return;

    var labelInput = document.querySelector('[data-role="anchor-label"]');
    var sizeMount = document.querySelector('[data-role="anchor-size-mount"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildAnchorCell(typeKey, stateKey, stateCls, size, label){
      var isDisabled = stateKey === "disabled";
      var cls = "anchor-demo-link anchor-demo-link--" + typeKey + " anchor-demo-link--fs" + size + stateCls;
      var ariaAttr = isDisabled ? ' aria-disabled="true"' : "";
      var iconMarkup = typeKey === "icon" ? " " + anchorIconSvg("anchor-demo-icon") : "";
      return '<a href="#" class="' + cls + '"' + ariaAttr + ">" + escapeHtml(label) + iconMarkup + "</a>";
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

    function buildMatrixSection(size, label){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildAnchorCell(t.key, state.key, state.cls, size, label) + "</td>";
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
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        label: parseLabel(labelInput.value)
      };
    }

    function render(){
      var label = parseLabel(labelInput.value);
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        html += buildMatrixSection(size, label);
        combos.push({ size: size, label: comboLabel(size), fieldLabel: label });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.fieldLabel); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.fieldLabel); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "anchor-size-dropdown-label",
        onChange: render
      });
    }

    if (labelInput) labelInput.addEventListener("input", render);

    render();
  });
})();
