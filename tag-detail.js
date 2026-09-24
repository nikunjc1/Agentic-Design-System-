(() => {
  "use strict";

  // Small "x" remove icon - viewBox 0 0 24 24, stroke currentColor so it
  // inherits the chip's own text color rather than a hard-coded fill.
  var REMOVE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>';

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "success", label: "Success" },
    { key: "warning", label: "Warning" },
    { key: "error", label: "Error" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "removable", label: "Removable" },
    { key: "selected", label: "Selected" }
  ];

  var FULL_SPEC = {
    default: { purpose: "Neutral labeling - general-purpose categorization with no particular semantic meaning." },
    success: { purpose: "Marks a positive status - completed, approved, active." },
    warning: { purpose: "Flags something that needs attention - pending, at-risk, in review." },
    error: { purpose: "Marks a negative or blocking status - failed, rejected, overdue." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Returns each type's Default look (a light tint background, colored
  // text) and its Selected look (a solid, more saturated fill) - the
  // Selected state does not get its own typeKey, it is a modifier class
  // (.is-selected) on top of the same 4 types, driving the solid-color
  // "toggled-on" look via CSS.
  function colorsFor(typeKey){
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var graphite600 = getCssVar("--graphite-600", "#383D44");
    var textMid = getCssVar("--text-mid", "#A7ABB2");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var green500 = getCssVar("--green-500", "#2FBF6E");
    var amber500 = getCssVar("--amber-500", "#E6A53A");
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var map = {
      default: { background: graphite700, color: textMid, selectedBackground: graphite600, selectedColor: textHi },
      success: { background: "rgba(47,191,110,0.12)", color: green500, selectedBackground: green500, selectedColor: "#FFFFFF" },
      warning: { background: "rgba(230,165,58,0.12)", color: amber500, selectedBackground: amber500, selectedColor: "#1A1400" },
      error: { background: "rgba(255,3,26,0.12)", color: danger500, selectedBackground: danger500, selectedColor: "#FFFFFF" }
    };
    return map[typeKey];
  }

  // Corner radius option list - same value scale as the Button, Group
  // Button and Alert systems, shared between the page's own multi-select
  // dropdown and the Copy Prompt/Copy Code generators below.
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  var FALLBACK_DEFAULTS = { radius: "8", label: "In progress" };

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
      label: (selectionInfo.label !== undefined) ? selectionInfo.label : FALLBACK_DEFAULTS.label
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push("Create a complete Tag component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (color, form, radius) - a small labeled chip used for categorizing, filtering, or flagging status, not a one-off pill built from scratch each time.");
    lines.push("");
    lines.push("Types (4, semantic colors):");
    TYPES.forEach(function(t){
      var c = colorsFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Default look: background " + c.background + ", color " + c.color + ".");
      lines.push("  Selected look (Selected form only): background " + c.selectedBackground + ", color " + c.selectedColor + " - a solid, more saturated fill showing the toggled-on appearance of a selectable/filter tag.");
    });
    lines.push("");
    lines.push("Forms (3, structural):");
    lines.push("- Default: plain label only.");
    lines.push("- Removable: label plus a trailing \"x\" remove icon button.");
    lines.push("- Selected: the label alone, no remove button, rendered with the type's Selected look instead of its Default look - demonstrates the toggled-on appearance of a selectable/filter-style tag.");
    lines.push("");
    lines.push("Checkable mode (Ant's Tag.CheckableTag): a real <button> with aria-pressed instead of a plain <span>, toggling the Selected look on click. Independent, not mutually exclusive - any number of tags in the same group can be pressed at once, unlike a radio group.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to each chip individually.");
    lines.push("");
    lines.push("Component properties: Corner radius; Label (text, default \"" + FALLBACK_DEFAULTS.label + "\").");
    lines.push("Current values - Label: \"" + info.label + "\".");
    return lines.join("\n");
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Tag component */");
    lines.push(".tag-demo-chip{ box-sizing:border-box; display:inline-flex; align-items:center; gap:4px; padding:4px 10px; font-family:var(--font-body); font-size:12px; font-weight:600; white-space:nowrap; }");
    lines.push(".tag-demo-chip--default{ background:var(--graphite-700); color:var(--text-mid); }");
    lines.push(".tag-demo-chip--success{ background:rgba(47,191,110,0.12); color:var(--green-500); }");
    lines.push(".tag-demo-chip--warning{ background:rgba(230,165,58,0.12); color:var(--amber-500); }");
    lines.push(".tag-demo-chip--error{ background:rgba(255,3,26,0.12); color:var(--danger-500); }");
    lines.push("");
    lines.push("/* Selected form - solid, more saturated fill instead of the light tint */");
    lines.push(".tag-demo-chip--default.is-selected{ background:var(--graphite-600); color:var(--text-hi); }");
    lines.push(".tag-demo-chip--success.is-selected{ background:var(--green-500); color:#FFFFFF; }");
    lines.push(".tag-demo-chip--warning.is-selected{ background:var(--amber-500); color:#1A1400; }");
    lines.push(".tag-demo-chip--error.is-selected{ background:var(--danger-500); color:#FFFFFF; }");
    lines.push("");
    lines.push(".tag-demo-remove{ flex:none; width:12px; height:12px; background:none; border:none; color:inherit; opacity:0.7; cursor:pointer; padding:0; display:flex; align-items:center; justify-content:center; }");
    lines.push(".tag-demo-remove:hover{ opacity:1; }");
    return lines.join("\n");
  }

  // Renders one .tag-demo-chip - the label in a span, plus a trailing
  // .tag-demo-remove "x" button only for the "removable" form. "selected"
  // is not its own typeKey - it is the .is-selected modifier class layered
  // on top of the same 4 types, driving the solid-color look via CSS.
  function buildTagField(typeKey, stateKey, radius, label){
    var radiusCss = radiusCssFor(radius);
    var selectedCls = stateKey === "selected" ? " is-selected" : "";
    var labelText = escapeHtml(label);
    var labelHtml = "<span>" + labelText + "</span>";
    var removeHtml = (stateKey === "removable")
      ? '<button type="button" class="tag-demo-remove" aria-label="Remove ' + labelText + '">' + REMOVE_ICON + "</button>"
      : "";
    return '<span class="tag-demo-chip tag-demo-chip--' + typeKey + selectedCls + '" style="border-radius:' + radiusCss + ';">' + labelHtml + removeHtml + "</span>";
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per color, Default form" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen corner radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(buildTagField(t.key, "default", exampleRadius, info.label));
    });
    lines.push("");
    lines.push("<!-- Example usage - the other 2 forms (Default color) -->");
    lines.push(buildTagField("default", "removable", exampleRadius, info.label));
    lines.push(buildTagField("default", "selected", exampleRadius, info.label));
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Corner radius value, fully
  // resolved (never "ask the question") - used by the Copy prompt/Copy code
  // dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(radius, label){
    return buildFullPrompt({
      radius: { mode: "specific", values: [radius] },
      label: label
    });
  }

  function buildComboCode(radius, label){
    return buildFullCode({
      radius: { mode: "specific", values: [radius] },
      label: label
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

    // Gallery-card copy CTA + click-to-navigate (tag.html's listing card)
    // - separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-tag"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-tag"]');
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
    var tagTypeCards = document.querySelectorAll(".tag-type-card[data-system]");
    tagTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "tag-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="tag-matrix-container"]');
    if (!matrixContainer) return;

    var radiusMount = document.querySelector('[data-role="tag-radius-mount"]');
    var labelInput = document.querySelector('[data-role="tag-label"]');
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

    // Since Tag has no Size property, only Corner radius drives multiple
    // combos - STATES (the 3 forms) become the rows and TYPES (the 4
    // colors) the columns, exactly like alert-detail.js's buildMatrixSection
    // does with its own radius-only combos.
    function buildMatrixSection(radius, label){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildTagField(t.key, state.key, radius, label) + "</td>";
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
        label: labelInput ? (labelInput.value.trim() || FALLBACK_DEFAULTS.label) : FALLBACK_DEFAULTS.label
      };
    }

    function render(){
      var label = labelInput ? (labelInput.value.trim() || FALLBACK_DEFAULTS.label) : FALLBACK_DEFAULTS.label;

      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      radii.forEach(function(radius){
        html += buildMatrixSection(radius, label);
        combos.push({ radius: radius, label: comboLabel(radius), tagLabel: label });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.radius, c.tagLabel); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.radius, c.tagLabel); });
    }

    var propertyMultiSelects = {};
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "tag-radius-dropdown-label",
        onChange: render
      });
    }

    if (labelInput){
      labelInput.addEventListener("input", render);
    }

    render();

    // Real Tag.CheckableTag sandbox - actual <button>s with aria-pressed
    // that toggle on click, not a static "Selected" cell in the matrix
    // above. Independent chips (any combination can be on at once), unlike
    // a radio group.
    var checkableContainer = document.querySelector('[data-role="tag-checkable-container"]');
    if (checkableContainer){
      var CHECKABLE_LABELS = ["Design", "Engineering", "Marketing", "Sales"];
      var DEFAULT_CHECKED = { Design: true, Marketing: true };
      checkableContainer.innerHTML = CHECKABLE_LABELS.map(function(l){
        var checked = !!DEFAULT_CHECKED[l];
        return '<button type="button" class="tag-demo-chip tag-demo-chip--default' + (checked ? " is-selected" : "") + '" aria-pressed="' + checked + '">' + escapeHtml(l) + "</button>";
      }).join("");
      checkableContainer.addEventListener("click", function(e){
        var btn = e.target.closest(".tag-demo-chip");
        if (!btn || !checkableContainer.contains(btn)) return;
        var nowPressed = btn.getAttribute("aria-pressed") !== "true";
        btn.setAttribute("aria-pressed", String(nowPressed));
        btn.classList.toggle("is-selected", nowPressed);
      });
    }
  });
})();
