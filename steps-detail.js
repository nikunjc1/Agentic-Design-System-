(() => {
  "use strict";

  // Steps (horizontal progress indicator) driver script.
  // Architecture deliberately mirrors group-button-detail.js: multiselect
  // properties, a multi-combo Live Preview matrix, getCssVar-based
  // theme-aware live color reads for Copy Prompt/Copy Code, a literal
  // SIZE_SCALE lookup matching the scratch CSS exactly (never a re-derived
  // formula), the ask-vs-specific selectionMode pattern for Copy
  // Prompt/Code, buildCopyControl's dropdown-when-multi-combo behavior,
  // gallery-card wiring, and parseLabels for the comma-separated Labels
  // property. Steps has only one multiselect property (Size, no Corner
  // radius - circles are always round), so "combos" below are per-size
  // rather than size x radius.

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var TYPES = [
    { key: "numbered", label: "Numbered" }
  ];

  // Steps are inherently sequential, so - unlike Group Button, where only
  // the first item's state changes - each row shows the MIDDLE step in
  // realistic context: everything before it is "completed", everything
  // after it is "upcoming". The row's assigned status only ever drives the
  // middle step.
  var STATES = [
    { key: "upcoming", cls: "is-upcoming", label: "Upcoming" },
    { key: "current", cls: "is-current", label: "Current" },
    { key: "completed", cls: "is-completed", label: "Completed" },
    { key: "error", cls: "is-error", label: "Error" },
    { key: "disabled", cls: "is-disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    numbered: { purpose: "Each step is a circle containing its number, or a checkmark icon once that step is completed - the clearest option when steps benefit from an at-a-glance count." }
  };

  var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  var X_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  function liveStepsColors(){
    return {
      lineStrong: getCssVar("--line-strong", "rgba(255,255,255,0.16)"),
      textHi: getCssVar("--text-hi", "#F3F2EF"),
      textDim: getCssVar("--text-dim", "#64686F"),
      red500: getCssVar("--red-500", "#FF031A"),
      danger500: getCssVar("--danger-500", "#FF031A")
    };
  }

  // Hand-tuned circle diameter / number-font-size / icon-size per step
  // size - must stay identical to the real ".steps-demo-step--h* .steps-demo-circle"
  // rules in the scratch CSS (not re-derived by formula) so Copy Code
  // reproduces exactly what the Live Preview matrix is showing, at every size.
  var SIZE_SCALE = {
    "24": { font: 11, icon: 12 },
    "32": { font: 13, icon: 14 },
    "40": { font: 15, icon: 16 }
  };

  // Size option list - a dedicated, smaller scale than Group Button's
  // (24-56 reads too large for a step circle).
  var SIZE_OPTIONS = [
    { value: "24", label: "24px - S" },
    { value: "32", label: "32px - M" },
    { value: "40", label: "40px - L" }
  ];
  var ORIENTATION_OPTIONS = [
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" }
  ];
  var FALLBACK_DEFAULTS = { size: "32", orientation: "horizontal" };
  var DEFAULT_LABELS = ["Details", "Shipping", "Payment"];
  var MIN_STEPS = 2;
  var MAX_STEPS = 12;

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function clampStepCount(n){
    n = Math.round(Number(n));
    if (isNaN(n)) return DEFAULT_LABELS.length;
    return Math.max(MIN_STEPS, Math.min(MAX_STEPS, n));
  }

  // Scales a label list to an exact count without discarding custom text
  // that's still in range: keeps every label up to count (or drops from
  // the end if shrinking), and only invents generic "Step N" placeholders
  // for newly-added slots beyond what was already there.
  function labelsForCount(currentLabels, count){
    var result = currentLabels.slice(0, count);
    for (var i = result.length; i < count; i++){
      result.push("Step " + (i + 1));
    }
    return result;
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

  // Middle-index status logic shared by both the live preview and the
  // copy-code example: everything before the assigned index is
  // "completed", the assigned index gets the row's own status, everything
  // after is "upcoming".
  function statusAt(index, midIndex, midStatusKey){
    if (index < midIndex) return "completed";
    if (index === midIndex) return midStatusKey;
    return "upcoming";
  }

  // A connector is only "filled" (brand red) when BOTH steps it joins are
  // fully "completed" - matching every example in the spec: Upcoming's
  // middle step has gray on both sides (its neighbor-before is completed,
  // but the neighbor-after relationship never reaches "both completed"),
  // Completed's middle step is red before it (completed -> completed) and
  // gray after it (completed -> upcoming). Current, Error and Disabled
  // never touch "completed" on the assigned step, so both their
  // connectors land gray by the same rule.
  function connectorStatus(statusBefore, statusAfter){
    return (statusBefore === "completed" && statusAfter === "completed") ? "completed" : "upcoming";
  }

  function circleContent(statusKey, number){
    if (statusKey === "completed") return CHECK_SVG;
    if (statusKey === "error") return X_SVG;
    return String(number);
  }

  function buildStepsRow(typeKey, midStatusKey, size, labels, orientation){
    var isVertical = orientation === "vertical";
    var midIndex = Math.floor(labels.length / 2);
    var parts = labels.map(function(label, i){
      var statusKey = statusAt(i, midIndex, midStatusKey);
      var circleHtml = '<span class="steps-demo-circle">' + circleContent(statusKey, i + 1) + "</span>";
      var labelHtml = '<span class="steps-demo-label">' + escapeHtml(label) + "</span>";
      // Centers the connector under the circle column - a horizontal
      // margin-top offset for a horizontal row's vertically-centered
      // connector, or a vertical margin-inline-start offset for a
      // vertical row's horizontally-centered one. Same half-circle math
      // either way, just rotated onto the other axis with orientation.
      var offset = Math.round(Number(size) / 2) - 1;
      var connectorAttr = isVertical ? ' style="margin-inline-start:' + offset + 'px"' : ' style="margin-top:' + offset + 'px"';
      var stepHtml = '<div class="steps-demo-step steps-demo-step--h' + size + " is-" + statusKey + '">' + circleHtml + labelHtml + "</div>";
      if (i < labels.length - 1){
        var nextStatusKey = statusAt(i + 1, midIndex, midStatusKey);
        var connStatus = connectorStatus(statusKey, nextStatusKey);
        stepHtml += '<span class="steps-demo-connector is-' + connStatus + '"' + connectorAttr + "></span>";
      }
      return stepHtml;
    }).join("");
    var rowClass = "steps-demo-row steps-demo-row--" + typeKey + (isVertical ? " steps-demo-row--vertical" : "");
    return '<div class="' + rowClass + '">' + parts + "</div>";
  }

  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var orientationInfo = selectionInfo.orientation || selectionMode(null, ORIENTATION_OPTIONS);
    var labels = selectionInfo.labels || DEFAULT_LABELS;
    var c = liveStepsColors();

    var lines = [];
    lines.push("Create a complete Steps (progress indicator) component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, orientation, size, labels, per-step status) - a row showing position within a multi-step flow like checkout or onboarding, not separate one-off labels glued together. Steps are inherently sequential: every step before the current one renders as completed, every step after it renders as upcoming.");
    lines.push("");
    lines.push("Type: Numbered - " + FULL_SPEC.numbered.purpose);
    lines.push("");
    lines.push("States (5, apply per step):");
    lines.push("- Upcoming: empty ring (1.5px " + c.lineStrong + " border, transparent fill), step number in " + c.textDim + ", connector lines on both sides in " + c.lineStrong + ".");
    lines.push("- Current: solid " + c.red500 + " background, step number in white (never a checkmark - that's Completed only), label text in " + c.textHi + " and bold.");
    lines.push("- Completed: solid " + c.red500 + " background with a checkmark icon in white in place of the number, connector line after it in " + c.lineStrong + " (the next step is upcoming) but the connector before it in " + c.red500 + " (the previous step is completed too).");
    lines.push("- Error: solid " + c.danger500 + " background with an X mark in white, label text in " + c.danger500 + ".");
    lines.push("- Disabled: empty ring at 40% opacity, label text at 40% opacity - static/illustrative, not interactive.");
    lines.push("- A connector is only filled (brand red) when both steps it joins are completed; otherwise it stays the neutral line color.");
    lines.push("");
    lines.push(propertyPromptLine("Orientation", orientationInfo, ORIENTATION_OPTIONS) + " Horizontal runs left-to-right with the circle above its label and a horizontal connector between circles; Vertical stacks top-to-bottom with the circle beside its label and a vertical connector below each circle, centered under the circle column either way.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Circle diameter and the number/icon size scale together, applied to every step.");
    lines.push("");
    lines.push("Component properties: Labels (comma-separated editable text, one per step, current value \"" + labels.join(", ") + "\" - step count follows the number of labels entered).");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var orientationInfo = selectionInfo.orientation || selectionMode(null, ORIENTATION_OPTIONS);
    var labels = selectionInfo.labels || DEFAULT_LABELS;
    var c = liveStepsColors();

    var lines = [];
    lines.push("/* Agentic Design System - Steps (progress indicator) component */");
    lines.push(".steps-demo-row{ display:flex; align-items:flex-start; }");
    lines.push(".steps-demo-step{ display:flex; flex-direction:column; align-items:center; gap:8px; box-sizing:border-box; }");
    lines.push('.steps-demo-label{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:13px; white-space:nowrap; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push(".steps-demo-connector{ flex:1 1 auto; min-width:16px; height:1.5px; background:" + c.lineStrong + "; }");
    lines.push(".steps-demo-connector.is-completed{ background:" + c.red500 + "; }");
    lines.push("");
    lines.push(orientationInfo.mode === "all"
      ? "/* Orientation - not chosen yet, default is Horizontal */"
      : "/* Orientation - explicitly chosen: " + orientationInfo.values.map(function(v){ return optionLabelFor(ORIENTATION_OPTIONS, v); }).join(", ") + " */");
    lines.push(".steps-demo-row--vertical{ flex-direction:column; align-items:flex-start; }");
    lines.push(".steps-demo-row--vertical .steps-demo-step{ flex-direction:row; align-items:center; gap:12px; }");
    lines.push(".steps-demo-row--vertical .steps-demo-label{ white-space:normal; }");
    lines.push(".steps-demo-row--vertical .steps-demo-connector{ flex:none; width:1.5px; height:20px; min-width:0; margin-top:0; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (circle diameter in px) - not chosen yet, default is 32 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".steps-demo-step--h" + size + " .steps-demo-circle{ width:" + size + "px; height:" + size + "px; font-size:" + scale.font + "px; }");
      lines.push(".steps-demo-step--h" + size + " .steps-demo-circle svg{ width:" + scale.icon + "px; height:" + scale.icon + "px; }");
    });
    lines.push("");
    lines.push("/* Type: Numbered */");
    lines.push(".steps-demo-circle{ display:inline-flex; align-items:center; justify-content:center; border-radius:9999px; box-sizing:border-box; font-weight:700; }");
    lines.push("");
    lines.push("/* States (5, apply per step) */");
    lines.push(".steps-demo-step.is-upcoming .steps-demo-circle{ background:transparent; border:1.5px solid " + c.lineStrong + "; color:" + c.textDim + "; }");
    lines.push(".steps-demo-step.is-upcoming .steps-demo-label{ color:" + c.textDim + "; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".steps-demo-step.is-current .steps-demo-circle{ background:" + c.red500 + "; border:1.5px solid " + c.red500 + "; color:#FFFFFF; }");
    lines.push(".steps-demo-step.is-current .steps-demo-label{ color:" + c.textHi + "; font-weight:700; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".steps-demo-step.is-completed .steps-demo-circle{ background:" + c.red500 + "; border:1.5px solid " + c.red500 + "; color:#FFFFFF; }");
    lines.push(".steps-demo-step.is-completed .steps-demo-label{ color:" + c.textHi + "; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".steps-demo-step.is-error .steps-demo-circle{ background:" + c.danger500 + "; border:1.5px solid " + c.danger500 + "; color:#FFFFFF; }");
    lines.push(".steps-demo-step.is-error .steps-demo-label{ color:" + c.danger500 + "; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".steps-demo-step.is-disabled{ opacity:0.4; }");
    lines.push(".steps-demo-step.is-disabled .steps-demo-circle{ background:transparent; border:1.5px solid " + c.lineStrong + "; color:" + c.textDim + "; }");
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleOrientation = orientationInfo.mode === "all" ? FALLBACK_DEFAULTS.orientation : orientationInfo.values[0];
    lines.push("<!-- Example usage" + ((sizeInfo.mode === "specific" || orientationInfo.mode === "specific") ? " - at the explicitly chosen size/orientation" : "") + ", a 3-step flow with the middle step Current -->");
    lines.push(buildStepsRow("numbered", "current", exampleSize, labels, exampleOrientation));
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size x Orientation combination,
  // fully resolved (never "ask the question") - used by the Copy prompt/
  // Copy code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(size, orientation, labels){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      orientation: { mode: "specific", values: [orientation] },
      labels: labels
    });
  }

  function buildComboCode(size, orientation, labels){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      orientation: { mode: "specific", values: [orientation] },
      labels: labels
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

    // Gallery-card copy CTA + click-to-navigate (steps.html's listing
    // card) - own data-role, distinct from every other system's copy
    // roles so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-steps"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-steps"]');
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

    // Second gallery card (Vertical) - same page, same component, so its
    // Copy prompt/Copy code commit explicitly to Orientation: Vertical
    // (matching what the card actually shows) instead of asking the
    // question the way the first card's un-narrowed buttons do.
    var verticalSelection = { size: { mode: "specific", values: ["32"] }, orientation: { mode: "specific", values: ["vertical"] } };
    var cardCopyPromptVerticalBtn = document.querySelector('[data-role="copy-prompt-steps-vertical"]');
    var cardCopyCodeVerticalBtn = document.querySelector('[data-role="copy-code-steps-vertical"]');
    if (cardCopyPromptVerticalBtn){
      cardCopyPromptVerticalBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(verticalSelection), cardCopyPromptVerticalBtn);
      });
    }
    if (cardCopyCodeVerticalBtn){
      cardCopyCodeVerticalBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(verticalSelection), cardCopyCodeVerticalBtn);
      });
    }

    var stepsTypeCards = document.querySelectorAll(".steps-type-card[data-system]");
    stepsTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "steps-" + card.dataset.system + ".html";
      if (card.dataset.orientation === "vertical") href += "?orientation=vertical";
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
    // Size is in play) or, whenever more than one Size is currently
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

    var matrixContainer = document.querySelector('[data-role="steps-matrix-container"]');
    if (!matrixContainer) return;

    // Landing here from the listing page's Vertical card (steps-default.html?orientation=vertical)
    // should open with Vertical already selected, matching what that card showed -
    // not silently fall back to the Horizontal default and look like the wrong page loaded.
    var requestedOrientation = (function(){
      var params = new URLSearchParams(window.location.search);
      var v = params.get("orientation");
      return ORIENTATION_OPTIONS.some(function(o){ return o.value === v; }) ? v : FALLBACK_DEFAULTS.orientation;
    })();

    var labelsInput = document.querySelector('[data-role="steps-label"]');
    var stepsCountInput = document.querySelector('[data-role="steps-count-input"]');
    var sizeMount = document.querySelector('[data-role="steps-size-mount"]');
    var orientationMount = document.querySelector('[data-role="steps-orientation-mount"]');
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

    function comboLabel(size, orientation){
      return optionLabelFor(SIZE_OPTIONS, size) + " / " + optionLabelFor(ORIENTATION_OPTIONS, orientation);
    }

    function buildMatrixSection(size, orientation, labels){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildStepsRow(t.key, state.key, size, labels, orientation) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size, orientation) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        orientation: selectionMode(propertyMultiSelects.orientation, ORIENTATION_OPTIONS, [FALLBACK_DEFAULTS.orientation]),
        labels: parseLabels(labelsInput.value)
      };
    }

    function render(){
      var labels = parseLabels(labelsInput.value);
      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var orientations = selectedOrDefault(propertyMultiSelects.orientation, ORIENTATION_OPTIONS, FALLBACK_DEFAULTS.orientation);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        orientations.forEach(function(orientation){
          html += buildMatrixSection(size, orientation, labels);
          combos.push({ size: size, orientation: orientation, label: comboLabel(size, orientation), labels: labels });
        });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.orientation, c.labels); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.orientation, c.labels); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "steps-size-dropdown-label",
        onChange: render
      });
    }
    if (orientationMount && window.createMultiSelect){
      propertyMultiSelects.orientation = window.createMultiSelect({
        root: orientationMount,
        options: ORIENTATION_OPTIONS,
        defaultSelected: [requestedOrientation],
        ariaLabel: "Orientation options",
        labelledBy: "steps-orientation-dropdown-label",
        onChange: render
      });
    }

    if (labelsInput){
      labelsInput.addEventListener("input", function(){
        // Keep Step count honest about what Labels actually holds, so the
        // two controls never silently disagree - typing a 5th label here
        // should show "5" over there without needing to touch that field.
        if (stepsCountInput) stepsCountInput.value = String(parseLabels(labelsInput.value).length);
        render();
      });
    }

    if (stepsCountInput){
      // "change" (fires on blur, Enter, or a spinner-arrow click) rather
      // than "input" (fires per keystroke) - clamping on every keystroke
      // fought a two-digit target the moment the first digit landed:
      // typing "10" hit "1" first, which is below the minimum, so it
      // instantly snapped to "2" before "0" could ever be typed, and
      // rebuilt Labels around that wrong intermediate count in the
      // process (silently discarding labels the very next keystroke was
      // about to keep). Waiting for the value to actually be committed
      // lets any number be typed freely; only the finished value clamps
      // and updates Labels.
      stepsCountInput.addEventListener("change", function(){
        var clamped = clampStepCount(stepsCountInput.value);
        if (String(clamped) !== stepsCountInput.value) stepsCountInput.value = clamped;
        labelsInput.value = labelsForCount(parseLabels(labelsInput.value), clamped).join(", ");
        render();
      });
    }

    render();
  });
})();
