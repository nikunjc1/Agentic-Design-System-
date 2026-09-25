(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Simple inline SVG icon constants - viewBox 0 0 24 24, stroke currentColor
  // so each icon inherits its surrounding element's color rather than a
  // hard-coded fill.
  var ZOOM_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
  var BROKEN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><line x1="3" y1="21" x2="10" y2="14"></line><line x1="14" y1="14" x2="21" y2="21"></line></svg>';

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "with-caption", label: "With caption" }
  ];
  var STATES = [
    { key: "loaded", label: "Loaded" },
    { key: "loading", label: "Loading" },
    { key: "error", label: "Error" },
    { key: "hover", label: "Hover" }
  ];

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
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

  // Literal pixel dimensions per aspect ratio - not derived by CSS
  // aspect-ratio math, matching this codebase's SIZE_SCALE convention of
  // hand-tuned lookups over formulas, so Copy Code reproduces exactly what
  // the Live Preview matrix is showing.
  var ASPECT_MAP = {
    square: { label: "Square", width: 160, height: 160 },
    landscape: { label: "Landscape", width: 200, height: 120 },
    portrait: { label: "Portrait", width: 120, height: 160 }
  };
  var ASPECT_KEYS = ["square", "landscape", "portrait"];

  var FALLBACK_DEFAULTS = {
    radius: "8",
    aspectKey: "square",
    caption: "Product photo"
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
      aspectKey: selectionInfo.aspectKey || FALLBACK_DEFAULTS.aspectKey,
      caption: (selectionInfo.caption !== undefined) ? selectionInfo.caption : FALLBACK_DEFAULTS.caption
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;
    var aspect = ASPECT_MAP[info.aspectKey] || ASPECT_MAP.square;

    var lines = [];
    lines.push("Create a complete Image component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable container for displaying a photo or graphic with graceful Loading, Error and Loaded states, in a configurable aspect ratio and corner radius, instead of a bare unstyled <img> tag with no fallback handling.");
    lines.push("");
    lines.push("Types (2):");
    lines.push("- Default: the image frame alone, no caption.");
    lines.push("- With caption: the image frame plus a caption text row beneath it.");
    lines.push("");
    lines.push("States (4):");
    lines.push("- Loading: a pulsing shimmer skeleton block shown while the image is being fetched.");
    lines.push("- Error: a muted background with a small broken-image icon and \"Failed to load\" text, shown when the image fails to load.");
    lines.push("- Loaded: the photo fills the frame, with a small zoom icon overlay in the bottom-right corner hinting that the image can be clicked to preview.");
    lines.push("- Hover: the same as Loaded, but the zoom icon overlay becomes fully visible - in real usage this is a plain :hover rule on the frame, not a separate state class.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to the frame's corners.");
    lines.push("");
    lines.push("Component properties: Corner radius; Aspect ratio (Square / Landscape / Portrait, default Square - sizes the frame); Caption (text, default \"" + FALLBACK_DEFAULTS.caption + "\", With caption type only).");
    lines.push("Current values - Aspect ratio: " + aspect.label + " (" + aspect.width + "x" + aspect.height + "px), Caption: \"" + info.caption + "\" (With caption type only).");
    lines.push("");
    lines.push("Important: in real usage this wraps a real <img> element, with onerror/onload handlers driving the Loading/Error/Loaded state classes above. This is a static offline design system with no network access, so every cell shown here is a fixed CSS gradient standing in for \"a loaded photo\" - never an actual fetched image.");
    return lines.join("\n");
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Image component */");
    lines.push(".image-demo-wrap{ display:inline-flex; flex-direction:column; gap:8px; }");
    lines.push(".image-demo-frame{ box-sizing:border-box; position:relative; overflow:hidden; background:linear-gradient(135deg, var(--blue-500), var(--red-500)); flex:none; }");
    lines.push(".image-demo-frame.image-demo-frame--loading{ background:var(--graphite-800); }");
    lines.push(".image-demo-frame.image-demo-frame--error{ background:var(--graphite-850); display:flex; align-items:center; justify-content:center; }");
    lines.push(".image-demo-skeleton{ position:absolute; inset:0; background:linear-gradient(90deg, var(--graphite-800) 25%, var(--graphite-700) 50%, var(--graphite-800) 75%); background-size:200% 100%; animation:image-demo-shimmer var(--duration-shimmer) var(--ease-emphasis) infinite; }");
    lines.push("@keyframes image-demo-shimmer{ 0%{ background-position:200% 0; } 100%{ background-position:-200% 0; } }");
    lines.push("/* The shimmer is decorative - the placeholder's shape already says \"loading\" - so it switches off entirely when reduced motion is requested. */");
    lines.push("@media (prefers-reduced-motion: reduce){ .image-demo-skeleton{ animation:none; background:var(--graphite-700); } }");
    lines.push(".image-demo-error{ display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--text-dim); }");
    lines.push(".image-demo-error svg{ width:24px; height:24px; }");
    lines.push('.image-demo-error-text{ font-family:var(--font-body); font-size:11px; }');
    lines.push(".image-demo-zoom-icon{ position:absolute; bottom:6px; right:6px; width:22px; height:22px; border-radius:9999px; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:#FFFFFF; opacity:0.7; transition:opacity .15s ease; }");
    lines.push(".image-demo-frame:hover .image-demo-zoom-icon, .image-demo-frame--hover .image-demo-zoom-icon{ opacity:1; }");
    lines.push(".image-demo-zoom-icon svg{ width:12px; height:12px; }");
    lines.push('.image-demo-caption{ font-family:var(--font-body); font-size:12px; color:var(--text-dim); max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    return lines.join("\n");
  }

  // Renders one .image-demo-wrap - a sized/rounded .image-demo-frame holding
  // the state-appropriate inner content (skeleton / broken-image message /
  // zoom-icon overlay), plus a caption row for the "with-caption" type.
  function buildImageField(typeKey, stateKey, radius, aspectKey, caption){
    var radiusCss = radiusCssFor(radius);
    var aspect = ASPECT_MAP[aspectKey] || ASPECT_MAP.square;
    var frameStyle = "width:" + aspect.width + "px;height:" + aspect.height + "px;border-radius:" + radiusCss + ";";
    var innerHtml;
    if (stateKey === "loading"){
      innerHtml = '<div class="image-demo-skeleton"></div>';
    } else if (stateKey === "error"){
      innerHtml = '<div class="image-demo-error">' + BROKEN_ICON + '<span class="image-demo-error-text">Failed to load</span></div>';
    } else {
      // "loaded" and "hover" both show the gradient photo stand-in with the
      // zoom-icon overlay - "hover" differs only via the --hover modifier
      // class (plus the real :hover rule) raising the icon's opacity.
      innerHtml = '<span class="image-demo-zoom-icon">' + ZOOM_ICON + "</span>";
    }
    var frameHtml = '<div class="image-demo-frame image-demo-frame--' + stateKey + '" style="' + frameStyle + '">' + innerHtml + "</div>";
    var captionHtml = (typeKey === "with-caption") ? '<p class="image-demo-caption">' + escapeHtml(caption) + "</p>" : "";
    return '<div class="image-demo-wrap">' + frameHtml + captionHtml + "</div>";
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;
    var aspect = ASPECT_MAP[info.aspectKey] || ASPECT_MAP.square;

    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - Loaded state, both types" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen corner radius" : "") + ", " + aspect.label + " aspect ratio -->");
    lines.push('<!-- In real usage the frame wraps a real <img> element - onerror/onload toggle the --loading/--error/--loaded state classes. This static demo shows a fixed CSS gradient standing in for "a loaded photo", not an actual fetched image. -->');
    lines.push(buildImageField("default", "loaded", exampleRadius, info.aspectKey, info.caption));
    lines.push(buildImageField("with-caption", "loaded", exampleRadius, info.aspectKey, info.caption));
    lines.push("");
    lines.push("<!-- Example usage - the other 3 states (Default type) -->");
    lines.push(buildImageField("default", "loading", exampleRadius, info.aspectKey, info.caption));
    lines.push(buildImageField("default", "error", exampleRadius, info.aspectKey, info.caption));
    lines.push(buildImageField("default", "hover", exampleRadius, info.aspectKey, info.caption));
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Corner radius value (with the
  // current Aspect ratio and Caption carried through as fixed values),
  // fully resolved (never "ask the question") - used by the Copy
  // prompt/Copy code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(radius, aspectKey, caption){
    return buildFullPrompt({
      radius: { mode: "specific", values: [radius] },
      aspectKey: aspectKey,
      caption: caption
    });
  }

  function buildComboCode(radius, aspectKey, caption){
    return buildFullCode({
      radius: { mode: "specific", values: [radius] },
      aspectKey: aspectKey,
      caption: caption
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

    // Gallery-card copy CTA + click-to-navigate (image.html's listing card)
    // - separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-image"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-image"]');
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
    var imageTypeCards = document.querySelectorAll(".image-type-card[data-system]");
    imageTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "image-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="image-matrix-container"]');
    if (!matrixContainer) return;

    var radiusMount = document.querySelector('[data-role="image-radius-mount"]');
    var aspectSelect = document.querySelector('[data-role="image-aspect-select"]');
    var captionInput = document.querySelector('[data-role="image-caption"]');
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

    // Image has no Size property - only Corner radius drives multiple
    // combos, exactly like Alert/Toast/Card/Collapse. Aspect ratio is a
    // plain single-value select read fresh on every render, not a combo
    // axis - STATES become the rows and TYPES the columns.
    function buildMatrixSection(radius, aspectKey, caption){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildImageField(t.key, state.key, radius, aspectKey, caption) + "</td>";
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
        aspectKey: aspectSelect ? aspectSelect.value : FALLBACK_DEFAULTS.aspectKey,
        caption: captionInput ? (captionInput.value.trim() || FALLBACK_DEFAULTS.caption) : FALLBACK_DEFAULTS.caption
      };
    }

    function render(){
      var aspectKey = aspectSelect ? aspectSelect.value : FALLBACK_DEFAULTS.aspectKey;
      var caption = captionInput ? (captionInput.value.trim() || FALLBACK_DEFAULTS.caption) : FALLBACK_DEFAULTS.caption;

      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      radii.forEach(function(radius){
        html += buildMatrixSection(radius, aspectKey, caption);
        combos.push({ radius: radius, label: comboLabel(radius), aspectKey: aspectKey, caption: caption });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.radius, c.aspectKey, c.caption); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.radius, c.aspectKey, c.caption); });
    }

    var propertyMultiSelects = {};
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "image-radius-dropdown-label",
        onChange: render
      });
    }

    if (aspectSelect){
      aspectSelect.addEventListener("change", render);
    }
    if (captionInput){
      captionInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }

    render();
  });
})();
