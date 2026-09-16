(() => {
  "use strict";

  var ICON_SIZE_BY_HEIGHT = { "24": 12, "28": 14, "32": 14, "36": 16, "40": 16, "44": 18, "48": 20, "56": 22 };
  var ICON_PLUS = '<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  var ICON_ARROW = '<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var ICON_GEAR = '<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15z"/></svg>';

  function icon(svgTpl, size){ return svgTpl.replace(/\{s\}/g, size); }

  // Column order and row order are fixed per spec, independent of which
  // type's own page this is - every page shows the same full matrix.
  var TYPES = [
    { key: "primary", label: "Primary" },
    { key: "secondary", label: "Secondary" },
    { key: "tertiary", label: "Tertiary" },
    { key: "ghost", label: "Ghost" },
    { key: "neutral", label: "Neutral" },
    { key: "link", label: "Transparent" },
    { key: "approve", label: "Approve" },
    { key: "destructive", label: "Delete" }
  ];
  var STATES = [
    { key: "rest", cls: "", label: "Rest" },
    { key: "hover", cls: " is-hover", label: "Hover" },
    { key: "pressed", cls: " is-pressed", label: "Pressed" },
    { key: "focus", cls: " is-focus", label: "Focus" },
    { key: "disabled", cls: " is-disabled", label: "Disabled" }
  ];

  // Purpose/sample/CSS for every type, keyed the same as TYPES above -
  // used to generate a full-system Copy Prompt / Copy Code that covers
  // all 8 types at once, not just the type this page happens to be on.
  var FULL_SPEC = {
    primary: {
      purpose: "The button that carries the main call to action on a screen, like saving a form, submitting a purchase, or confirming a change.",
      sample: "Save",
      css: { rest: "background:#FF031A;color:#FFFFFF;", hover: "background:#FF3F4F;", pressed: "background:#D80016;" }
    },
    secondary: {
      purpose: "A supporting action that sits alongside a Primary button, like canceling, going back, or exporting.",
      sample: "Cancel",
      css: { rest: "background:#262A2F;color:#F3F2EF;border:1.5px solid rgba(255,255,255,0.16);", hover: "background:#383D44;", pressed: "background:#1C1F23;" }
    },
    tertiary: {
      purpose: "A lower-emphasis action that doesn't need to compete for attention, like learning more or skipping a step.",
      sample: "Learn More",
      css: { rest: "background:transparent;color:#F3F2EF;border:1.5px solid rgba(255,255,255,0.16);", hover: "background:#1C1F23;", pressed: "background:#262A2F;" }
    },
    ghost: {
      purpose: "An action placed inside toolbars, cards, or dense layouts where a bordered button would add unnecessary weight, like closing or dismissing something.",
      sample: "Close",
      css: { rest: "background:transparent;color:#A7ABB2;", hover: "background:#1C1F23;color:#F3F2EF;", pressed: "background:#262A2F;" }
    },
    neutral: {
      purpose: "An action that needs clear affordance without strong brand emphasis, like filtering, sorting, or opening options.",
      sample: "Filter",
      css: { rest: "background:#1C1F23;color:#F3F2EF;border:1.5px solid rgba(255,255,255,0.16);", hover: "background:#262A2F;", pressed: "background:#191C20;" }
    },
    link: {
      purpose: "A navigation-style action that behaves like a hyperlink rather than a boxed command, like viewing details or opening a page.",
      sample: "View Details",
      css: { rest: "background:transparent;color:#FF3F4F;padding-inline:8px;", hover: "text-decoration:underline;", pressed: "color:#D80016;" }
    },
    approve: {
      purpose: "An action that confirms or approves something positive, like approving a request or accepting a change.",
      sample: "Approve",
      css: { rest: "background:rgba(47,191,110,0.1);color:#2FBF6E;border:2px solid #2FBF6E;", hover: "background:rgba(47,191,110,0.16);", pressed: "background:rgba(47,191,110,0.26);" }
    },
    destructive: {
      purpose: "An action with irreversible consequences, like deleting a record or discarding unsaved work.",
      sample: "Delete",
      css: { rest: "background:rgba(255,3,26,0.1);color:#FF031A;border:2px solid #FF031A;", hover: "background:rgba(255,3,26,0.16);color:#FF3F4F;border-color:#FF3F4F;", pressed: "background:rgba(255,3,26,0.26);color:#D80016;border-color:#D80016;" }
    }
  };
  // Hand-tuned padding/font-size per height - must stay identical to the
  // real .btn-demo--h* rules in shell.css (not re-derived by formula) so
  // Copy Code reproduces exactly what the Live Preview matrix is showing,
  // at every size, not just the one size a formula happens to agree with.
  var SIZE_SCALE = {
    "24": { pad: 10, font: 11 },
    "28": { pad: 12, font: 12 },
    "32": { pad: 12, font: 12 },
    "36": { pad: 14, font: 13 },
    "40": { pad: 16, font: 14 },
    "44": { pad: 18, font: 15 },
    "48": { pad: 20, font: 16 },
    "56": { pad: 24, font: 17 }
  };

  // Size / Content / Corner radius option lists - shared between the
  // page's own multi-select dropdowns and the Copy Prompt/Copy Code
  // generators below, so both speak the same option values and labels.
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
  var CONTENT_OPTIONS = [
    { value: "text", label: "Text only" },
    { value: "icon-left", label: "Icon left" },
    { value: "icon-right", label: "Icon right" },
    { value: "icon-both", label: "Icon both sides" },
    { value: "icon-only", label: "Icon only" }
  ];
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  // Matches the select options' previous "selected" defaults (40px / Text
  // only / 8px radius) - also the fallback whenever a dropdown is fully
  // deselected, so the Live Preview never breaks.
  var FALLBACK_DEFAULTS = { size: "40", content: "text", radius: "8" };

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

  // Determines whether a property counts as "configured" for prompt/code
  // generation purposes. Treated as NOT configured (mode "all" - the
  // generated output asks the question instead of assuming an answer) when
  // the dropdown is: fully deselected, still sitting on its untouched
  // default value, or has every option checked (the "All" state) - none of
  // these represent an actual decision. Anything else - the user has
  // knowingly narrowed it to one or more, but not all, options - is treated
  // as an explicit choice and stated directly.
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

  // Primary and Link both derive their color from the brand-customizable
  // --red-* tokens, not a fixed hex - reading the live computed value
  // here (instead of FULL_SPEC's hardcoded default string) is what keeps
  // Copy prompt/Copy code honest when the user has saved a custom brand
  // color on the Colors page. Every type's focus ring also uses
  // --red-400, so it's read live too.
  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }
  function liveRedHex(){
    return {
      500: getCssVar("--red-500", "#FF031A"),
      400: getCssVar("--red-400", "#FF3F4F"),
      600: getCssVar("--red-600", "#D80016")
    };
  }
  // Secondary/Tertiary/Ghost are graphite/text tokens, not brand-red ones,
  // but they still flip value between dark and light theme (see theme.css's
  // :root vs :root[data-theme="light"] blocks) - reading them live here,
  // the same way Primary/Link already read --red-*, is what keeps Copy
  // prompt/Copy code honest when the page is viewed in light theme instead
  // of assuming FULL_SPEC's dark-theme hex is always current. Approve and
  // Destructive are intentionally excluded: --green-500/--danger-500 don't
  // have a light-theme override (see theme.css), so FULL_SPEC's hardcoded
  // values for them are always correct regardless of theme.
  function liveCssFor(typeKey){
    var red = liveRedHex();
    if (typeKey === "primary"){
      return { rest: "background:" + red[500] + ";color:#FFFFFF;", hover: "background:" + red[400] + ";", pressed: "background:" + red[600] + ";" };
    }
    if (typeKey === "link"){
      return { rest: "background:transparent;color:" + red[400] + ";padding-inline:8px;", hover: "text-decoration:underline;", pressed: "color:" + red[600] + ";" };
    }
    var graphite700 = getCssVar("--graphite-700", "#262A2F");
    var graphite600 = getCssVar("--graphite-600", "#383D44");
    var graphite800 = getCssVar("--graphite-800", "#1C1F23");
    var graphite850 = getCssVar("--graphite-850", "#191C20");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var textMid = getCssVar("--text-mid", "#A7ABB2");
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    if (typeKey === "secondary"){
      return { rest: "background:" + graphite700 + ";color:" + textHi + ";border:1.5px solid " + lineStrong + ";", hover: "background:" + graphite600 + ";", pressed: "background:" + graphite800 + ";" };
    }
    if (typeKey === "tertiary"){
      return { rest: "background:transparent;color:" + textHi + ";border:1.5px solid " + lineStrong + ";", hover: "background:" + graphite800 + ";", pressed: "background:" + graphite700 + ";" };
    }
    if (typeKey === "ghost"){
      return { rest: "background:transparent;color:" + textMid + ";", hover: "background:" + graphite800 + ";color:" + textHi + ";", pressed: "background:" + graphite700 + ";" };
    }
    if (typeKey === "neutral"){
      return { rest: "background:" + graphite800 + ";color:" + textHi + ";border:1.5px solid " + lineStrong + ";", hover: "background:" + graphite700 + ";", pressed: "background:" + graphite850 + ";" };
    }
    return FULL_SPEC[typeKey].css;
  }

  // Focus ring is 2px solid var(--red-400) for every type in shell.css,
  // EXCEPT Destructive (fixed var(--danger-500)) and Approve (fixed
  // var(--green-500)), which intentionally don't follow the brand color,
  // and Link, whose outline uses a 3px offset plus a 4px corner radius
  // instead of the shared 2px offset (see the .btn-demo--*:focus-visible
  // rules in shell.css). Called out per type here so Copy prompt/Copy
  // code don't silently claim a uniform red-400 ring for all 8 types.
  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var contentInfo = selectionInfo.content || selectionMode(null, CONTENT_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    var red400 = liveRedHex()[400];
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var green500 = getCssVar("--green-500", "#2FBF6E");
    lines.push("Create a complete Button component system for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, content, radius, state) - not as separate one-off components for each variant.");
    lines.push("");
    lines.push("Types (8):");
    TYPES.forEach(function(t){
      var spec = FULL_SPEC[t.key];
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + spec.purpose);
      lines.push("  Rest: " + css.rest);
      lines.push("  Hover: " + css.hover);
      lines.push("  Pressed: " + css.pressed);
      if (t.key === "destructive"){
        lines.push("  Focus: 2px outline in " + danger500 + " (fixed danger color, not the brand color), 2px offset.");
      } else if (t.key === "approve"){
        lines.push("  Focus: 2px outline in " + green500 + " (fixed approve color, not the brand color), 2px offset.");
      } else if (t.key === "link"){
        lines.push("  Focus: 2px outline in " + red400 + ", 3px offset, 4px corner radius on the outline.");
      }
    });
    lines.push("");
    lines.push("States (5, apply to every type): Rest, Hover, Pressed, Focus, Disabled.");
    lines.push("- Focus (default, see per-type exceptions above): 2px outline in " + red400 + ", 2px offset - never just a color change, so layout never shifts.");
    lines.push("- Disabled: 40% opacity, not-allowed cursor - except Primary at 45% opacity, and Link additionally drops its underline.");
    lines.push("");
    lines.push(propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS) + " Padding and font-size scale proportionally with height.");
    lines.push("");
    lines.push(propertyPromptLine("Content", contentInfo, CONTENT_OPTIONS) + " Icon only requires an accessible label for screen readers (e.g. aria-label), since there is no visible text.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied uniformly across every type.");
    return lines.join("\n");
  }

  function exampleMarkupFor(contentValue, size, sizeClass, radiusClass, label){
    var classes = "btn btn--primary " + sizeClass + " " + radiusClass;
    var iconSize = ICON_SIZE_BY_HEIGHT[size] || 16;
    if (contentValue === "text"){
      return '<button class="' + classes + '">' + label + "</button>";
    }
    if (contentValue === "icon-left"){
      return '<button class="' + classes + '">' + icon(ICON_PLUS, iconSize) + "<span>" + label + "</span></button>";
    }
    if (contentValue === "icon-right"){
      return '<button class="' + classes + '"><span>' + label + "</span>" + icon(ICON_ARROW, iconSize) + "</button>";
    }
    if (contentValue === "icon-both"){
      return '<button class="' + classes + '">' + icon(ICON_PLUS, iconSize) + "<span>" + label + "</span>" + icon(ICON_ARROW, iconSize) + "</button>";
    }
    // Icon-only needs the is-icon-only class (zero padding, forced square
    // width via the .is-icon-only.btn--h* rule emitted below) to actually
    // render square, matching .btn-demo.is-icon-only in shell.css - without
    // it the button would keep its normal horizontal padding.
    return '<button class="' + classes + ' is-icon-only" aria-label="' + label + '">' + icon(ICON_GEAR, iconSize) + "</button>";
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var contentInfo = selectionInfo.content || selectionMode(null, CONTENT_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);

    var lines = [];
    lines.push("/* Agentic Design System - Button component (all types, states, sizes) */");
    lines.push(".btn{");
    lines.push("  display:inline-flex; align-items:center; justify-content:center; gap:8px;");
    lines.push('  font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-weight:600;');
    lines.push("  white-space:nowrap; cursor:pointer; user-select:none;");
    lines.push("  border:1.5px solid transparent;");
    lines.push("  transition:background-color .15s ease, border-color .15s ease, color .15s ease;");
    lines.push("}");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 40 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var scale = SIZE_SCALE[size];
      lines.push(".btn--h" + size + "{ height:" + size + "px; padding:0 " + scale.pad + "px; font-size:" + scale.font + "px; }");
    });
    lines.push("");
    lines.push("/* Icon-only variant - zero padding, forced square per size */");
    lines.push(".btn.is-icon-only{ padding:0; }");
    sizesToEmit.forEach(function(size){
      lines.push(".btn.is-icon-only.btn--h" + size + "{ width:" + size + "px; }");
    });
    lines.push("");
    lines.push("/* Types (8) - rest / hover / pressed per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var cls = ".btn--" + t.key;
      lines.push(cls + "{ " + css.rest + " }");
      lines.push(cls + ":hover{ " + css.hover + " }");
      lines.push(cls + ":active{ " + css.pressed + " }");
    });
    lines.push("");
    lines.push("/* States shared by every type */");
    lines.push(".btn:focus-visible{ outline:2px solid " + liveRedHex()[400] + "; outline-offset:2px; }");
    lines.push("/* Focus exceptions - these three types don't use the default ring above */");
    lines.push(".btn--destructive:focus-visible{ outline-color:" + getCssVar("--danger-500", "#FF031A") + "; }");
    lines.push(".btn--approve:focus-visible{ outline-color:" + getCssVar("--green-500", "#2FBF6E") + "; }");
    lines.push(".btn--link:focus-visible{ outline-offset:3px; border-radius:4px; }");
    lines.push(".btn:disabled{ opacity:0.4; cursor:not-allowed; }");
    lines.push("/* Disabled exceptions - Primary is slightly less faded than the rest, Link also drops its underline */");
    lines.push(".btn--primary:disabled{ opacity:0.45; }");
    lines.push(".btn--link:disabled{ text-decoration:none; }");
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 8px */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " */");
    radiiToEmit.forEach(function(radius){
      lines.push(".btn--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var sizeClass = "btn--h" + exampleSize;
    var radiusClass = "btn--radius-" + radiusClassSuffix(exampleRadius);
    var contentsToShow = contentInfo.mode === "all" ? CONTENT_OPTIONS.map(function(o){ return o.value; }) : contentInfo.values;
    lines.push(contentInfo.mode === "all"
      ? "<!-- Content (5) - not chosen yet, example usage shown for every option on a Primary button -->"
      : "<!-- Content - explicitly chosen: " + contentInfo.values.map(function(v){ return optionLabelFor(CONTENT_OPTIONS, v); }).join(", ") + " -->");
    contentsToShow.forEach(function(contentValue){
      lines.push(exampleMarkupFor(contentValue, exampleSize, sizeClass, radiusClass, "Save"));
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size x Content x Corner radius
  // combination, fully resolved (never "ask the question") - used by the
  // Copy prompt/Copy code dropdown's per-combination "Copy" buttons, so
  // picking one entry always yields a complete, actionable spec.
  function buildComboPrompt(size, content, radius){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      content: { mode: "specific", values: [content] },
      radius: { mode: "specific", values: [radius] }
    });
  }

  function buildComboCode(size, content, radius){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      content: { mode: "specific", values: [content] },
      radius: { mode: "specific", values: [radius] }
    });
  }

  // ---------- self-positioning tooltip for icon-only buttons ----------
  // One shared floating element, shown/positioned on demand. Placement
  // (top/bottom/left/right) is chosen per-hover from whichever side has
  // room in the current viewport, with a "prefer this order, else pick
  // whichever has the most space" fallback, and edges are clamped so the
  // tooltip never renders off-screen.
  function attachSmartTooltip(options){
    var selector = options.selector;
    var getText = options.getText;
    var gap = options.gap || 8;
    var edgePadding = options.edgePadding || 8;
    var placementOrder = options.placementOrder || ["top", "bottom", "right", "left"];

    var tip = document.createElement("div");
    tip.className = "dynamic-tooltip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);

    var activeAnchor = null;

    function place(anchor){
      var text = getText(anchor);
      if (!text) return hide();

      tip.textContent = text;
      tip.classList.add("is-visible");

      var anchorRect = anchor.getBoundingClientRect();
      var tipRect = tip.getBoundingClientRect();
      var vw = window.innerWidth;
      var vh = window.innerHeight;

      var space = {
        top: anchorRect.top,
        bottom: vh - anchorRect.bottom,
        left: anchorRect.left,
        right: vw - anchorRect.right
      };
      var fits = {
        top: space.top >= tipRect.height + gap,
        bottom: space.bottom >= tipRect.height + gap,
        left: space.left >= tipRect.width + gap,
        right: space.right >= tipRect.width + gap
      };

      var placement = placementOrder.filter(function(side){ return fits[side]; })[0];
      if (!placement){
        placement = placementOrder.slice().sort(function(a, b){ return space[b] - space[a]; })[0];
      }

      var top, left;
      if (placement === "top" || placement === "bottom"){
        top = placement === "top" ? anchorRect.top - tipRect.height - gap : anchorRect.bottom + gap;
        left = anchorRect.left + anchorRect.width / 2 - tipRect.width / 2;
        left = Math.max(edgePadding, Math.min(left, vw - tipRect.width - edgePadding));
      } else {
        left = placement === "left" ? anchorRect.left - tipRect.width - gap : anchorRect.right + gap;
        top = anchorRect.top + anchorRect.height / 2 - tipRect.height / 2;
        top = Math.max(edgePadding, Math.min(top, vh - tipRect.height - edgePadding));
      }

      tip.setAttribute("data-placement", placement);
      tip.style.transform = "translate(" + Math.round(left) + "px, " + Math.round(top) + "px)";
    }

    function hide(){
      tip.classList.remove("is-visible");
      tip.removeAttribute("data-placement");
      activeAnchor = null;
    }

    function findAnchor(target){
      if (!target || typeof target.closest !== "function") return null;
      return target.closest(selector);
    }

    document.addEventListener("mouseover", function(e){
      var anchor = findAnchor(e.target);
      if (!anchor) return;
      activeAnchor = anchor;
      place(anchor);
    });
    document.addEventListener("mouseout", function(e){
      var anchor = findAnchor(e.target);
      if (anchor && anchor === activeAnchor) hide();
    });
    document.addEventListener("focusin", function(e){
      var anchor = findAnchor(e.target);
      if (!anchor) return;
      activeAnchor = anchor;
      place(anchor);
    });
    document.addEventListener("focusout", function(e){
      var anchor = findAnchor(e.target);
      if (anchor && anchor === activeAnchor) hide();
    });
    window.addEventListener("scroll", function(){ if (activeAnchor) place(activeAnchor); }, true);
    window.addEventListener("resize", function(){ if (activeAnchor) place(activeAnchor); });
  }

  document.addEventListener("DOMContentLoaded", function(){
    attachSmartTooltip({
      selector: ".btn-demo.is-icon-only[aria-label]",
      getText: function(anchor){ return anchor.getAttribute("aria-label"); }
    });

    // Gallery-card copy CTAs (components.html's flexible-system cards -
    // one per type, all copying the identical full-system output) -
    // separate data-role from components.js's own per-type copy-prompt/
    // copy-code (which describes just one type) so every card matches what
    // clicking through to the internal page's own Copy prompt/Copy code
    // actually generates: the full 8-type system, not a single type.
    // querySelectorAll (not querySelector) since every type's card shares
    // these same data-roles - a single querySelector would only ever wire
    // up the first card in the DOM, leaving the other 7 buttons dead.
    document.querySelectorAll('[data-role="copy-prompt-flexible-full"]').forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(), btn);
      });
    });
    document.querySelectorAll('[data-role="copy-code-flexible-full"]').forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(), btn);
      });
    });

    var type = document.body.dataset.buttonType;
    if (!type) return;
    var defaultLabel = document.body.dataset.defaultLabel || "Save";

    var sizeMount = document.querySelector('[data-role="size-mount"]');
    var contentMount = document.querySelector('[data-role="content-mount"]');
    var radiusMount = document.querySelector('[data-role="radius-mount"]');
    var labelInput = document.querySelector('[data-role="button-label"]');
    var accessibleField = document.querySelector('[data-role="accessible-label-field"]');
    var accessibleInput = document.querySelector('[data-role="accessible-label"]');
    var a11yNote = document.querySelector('[data-role="a11y-note"]');
    var matrixContainer = document.querySelector('[data-role="matrix-container"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

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

    // Renders either a plain Copy prompt/Copy code button (exactly one
    // Size x Content x Corner radius combination is in play) or, whenever
    // more than one combination is currently selected, a disclosure
    // dropdown listing every combination by name with its own "Copy"
    // button - so the user can grab the exact prompt/code for the one
    // combination that matches their business goal instead of one prompt
    // trying to cover all of them at once.
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

    function buildButton(typeKey, stateCls, size, content, label, radius, ariaLabel){
      var iconSize = ICON_SIZE_BY_HEIGHT[size] || 16;
      var classes = "btn-demo btn-demo--" + typeKey + " btn-demo--h" + size + stateCls;
      var inner;

      if (content === "text"){
        inner = label;
      } else if (content === "icon-left"){
        inner = icon(ICON_PLUS, iconSize) + "<span>" + label + "</span>";
      } else if (content === "icon-right"){
        inner = "<span>" + label + "</span>" + icon(ICON_ARROW, iconSize);
      } else if (content === "icon-both"){
        inner = icon(ICON_PLUS, iconSize) + "<span>" + label + "</span>" + icon(ICON_ARROW, iconSize);
      } else {
        classes += " is-icon-only";
        inner = icon(ICON_GEAR, iconSize);
      }

      var attrs = (content === "icon-only" && ariaLabel) ? ' aria-label="' + ariaLabel.replace(/"/g, "&quot;") + '"' : "";
      var disabledAttr = / is-disabled\b/.test(stateCls) ? " disabled" : "";
      return '<button class="' + classes + '" type="button" style="border-radius:' + radius + '"' + attrs + disabledAttr + '>' + inner + "</button>";
    }

    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function comboLabel(size, content, radius){
      return optionLabelFor(SIZE_OPTIONS, size) + " / " + optionLabelFor(CONTENT_OPTIONS, content) + " / " + optionLabelFor(RADIUS_OPTIONS, radius);
    }

    function buildMatrixSection(size, content, radius, label, ariaLabel){
      var radiusCss = radiusCssFor(radius);
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' +
            buildButton(t.key, state.cls, size, content, label, radiusCss, ariaLabel) +
          "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size, content, radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    // Every cell is derived from the same shared configuration (size,
    // content, label, radius) - only Type (column) and State (row) vary
    // within a combination. The Live Preview renders one full matrix PER
    // selected combination of Size x Content x Corner radius (falling back
    // to FALLBACK_DEFAULTS for any dropdown that's fully deselected, so the
    // preview never goes blank) - checking more than one option anywhere
    // shows every resulting combination side by side instead of picking
    // just one.
    function render(){
      var label = labelInput.value.trim() || defaultLabel;
      var ariaLabel = accessibleInput.value.trim();

      var sizes = selectedOrDefault(propertyMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var contents = selectedOrDefault(propertyMultiSelects.content, CONTENT_OPTIONS, FALLBACK_DEFAULTS.content);
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        contents.forEach(function(content){
          radii.forEach(function(radius){
            html += buildMatrixSection(size, content, radius, label, ariaLabel);
            combos.push({ size: size, content: content, radius: radius, label: comboLabel(size, content, radius) });
          });
        });
      });
      matrixContainer.innerHTML = html;

      var anyIconOnly = contents.indexOf("icon-only") !== -1;
      accessibleField.hidden = !anyIconOnly;

      if (anyIconOnly){
        a11yNote.hidden = false;
        if (ariaLabel){
          a11yNote.className = "a11y-inline-note is-pass";
          a11yNote.textContent = "✓ Accessible name configured";
        } else {
          a11yNote.className = "a11y-inline-note is-fail";
          a11yNote.textContent = "⚠ Icon-only buttons need an accessible name - add one above";
        }
      } else {
        a11yNote.hidden = true;
      }

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.content, c.radius); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.content, c.radius); });
    }

    var propertyMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      propertyMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "size-dropdown-label",
        onChange: render
      });
    }
    if (contentMount && window.createMultiSelect){
      propertyMultiSelects.content = window.createMultiSelect({
        root: contentMount,
        options: CONTENT_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.content],
        ariaLabel: "Content options",
        labelledBy: "content-dropdown-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "radius-dropdown-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", render);
    accessibleInput.addEventListener("input", render);

    function currentSelectionInfo(){
      return {
        size: selectionMode(propertyMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        content: selectionMode(propertyMultiSelects.content, CONTENT_OPTIONS, [FALLBACK_DEFAULTS.content]),
        radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius])
      };
    }

    render();
  });
})();
