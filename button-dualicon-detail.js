(() => {
  "use strict";

  // Driver for the consolidated "Dual Icon" button component page
  // (button-primary-icon.html). All 7 exact-spec types (Primary, Secondary,
  // Tertiary, Ghost, Transparent, Approve, Delete) live on this one page as
  // a Type x State matrix - mirroring how the flexible Button system's own
  // Live Preview matrix compares every type side by side on one page,
  // rather than one page per type.
  var ICON_CHEVRON_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  // Same spinner used by the flexible Button system (button-detail.js) -
  // currentColor so it self-adjusts to whichever type's own label color is
  // active, instead of hardcoding one color that would only read correctly
  // on some of the 7 types here.
  function spinnerHtml(size){
    return '<span class="btn-demo-spinner" style="width:' + size + 'px;height:' + size + 'px;" aria-hidden="true"></span>';
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Same size scale as the flexible Button system's .btn-demo--h* classes,
  // so Size here behaves identically to every other button page - width is
  // never fixed, it's a natural result of height/padding/content like
  // everywhere else, the spec's 122x36px is just what that produces at the
  // default 36px/16px-padding combination.
  var SIZE_SCALE = {
    "24": { padding: "0 10px", fontSize: "11px", gap: "4px" },
    "28": { padding: "0 12px", fontSize: "12px", gap: "6px" },
    "32": { padding: "0 12px", fontSize: "12px", gap: "8px" },
    "36": { padding: "0 16px", fontSize: "14px", gap: "8px" },
    "40": { padding: "0 16px", fontSize: "14px", gap: "8px" },
    "44": { padding: "0 18px", fontSize: "15px", gap: "8px" },
    "48": { padding: "0 20px", fontSize: "16px", gap: "8px" },
    "56": { padding: "0 24px", fontSize: "17px", gap: "8px" }
  };
  var ICON_SIZE_BY_HEIGHT = { "24": 12, "28": 14, "32": 14, "36": 16, "40": 16, "44": 18, "48": 20, "56": 22 };

  var STATES = ["rest", "hover", "pressed", "focused", "disabled", "loading"];
  var STATE_LABELS = { rest: "Rest", hover: "Hover", pressed: "Pressed", focused: "Focused", disabled: "Disabled", loading: "Loading" };

  var TYPES = ["primary-icon", "secondary-icon", "tertiary-icon", "ghost-icon", "transparent-icon", "approve-icon", "delete-icon"];
  var TYPE_LABELS = {
    "primary-icon": "Primary",
    "secondary-icon": "Secondary",
    "tertiary-icon": "Tertiary",
    "ghost-icon": "Ghost",
    "transparent-icon": "Transparent",
    "approve-icon": "Approve",
    "delete-icon": "Delete"
  };

  var TYPE_SPEC = {
    "primary-icon": {
      name: "Primary Button 36px - Dual Icon",
      states: {
        rest: { css: "background:var(--red-500);color:#FFFFFF;", desc: "Background the selected brand color, label and icons #FFFFFF, no border or shadow." },
        hover: { css: "background:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2)),var(--red-500);color:#FFFFFF;", desc: "Background the selected brand color with a 20% black overlay, label and icons #FFFFFF, no border." },
        pressed: { css: "background:linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)),var(--red-500);color:#FFFFFF;", desc: "Background the selected brand color with a 40% black overlay, label and icons #FFFFFF, no border." },
        focused: { css: "background:var(--red-500);color:#FFFFFF;box-shadow:inset 0 0 0 1px #FFFFFF;outline:2px solid #202124;outline-offset:2px;", desc: "Background the selected brand color, label and icons #FFFFFF, 1px white inner border, 2px outside focus ring in #202124." },
        disabled: { css: "background:#E0E0E0;color:#A4A7AE;", desc: "Background #E0E0E0, label and icons #A4A7AE, no border, focus ring or shadow." },
        loading: { css: "background:var(--red-500);color:#FFFFFF;", desc: "Same background and label color as Rest - a button mid-request still reads as present, not unavailable the way Disabled does. The label and both icon slots are replaced by one spinner; not clickable." }
      }
    },
    "secondary-icon": {
      name: "Secondary Button 36px - Dual Icon",
      states: {
        rest: { css: "background:#FFFFFF;color:var(--red-500);box-shadow:inset 0 0 0 1px var(--red-500);", desc: "Background #FFFFFF, inside border 1px solid the selected brand color, label and icons the selected brand color, no shadow." },
        hover: { css: "background:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2)),var(--red-500);color:#FFFFFF;", desc: "Background the selected brand color with a 20% black overlay, label and icons #FFFFFF, no border." },
        pressed: { css: "background:linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)),var(--red-500);color:#FFFFFF;", desc: "Background the selected brand color with a 40% black overlay, label and icons #FFFFFF, no border." },
        focused: { css: "background:var(--red-500);color:#FFFFFF;box-shadow:inset 0 0 0 1px #FFFFFF;outline:2px solid #202124;outline-offset:2px;", desc: "Background the selected brand color, label and icons #FFFFFF, 1px white inner border, 2px outside focus ring in #202124." },
        disabled: { css: "background:#E0E0E0;color:#A4A7AE;", desc: "Background #E0E0E0, label and icons #A4A7AE, no border, focus ring or shadow." },
        loading: { css: "background:#FFFFFF;color:var(--red-500);box-shadow:inset 0 0 0 1px var(--red-500);", desc: "Same background, border and label color as Rest - still reads as present, not unavailable. Label and both icon slots replaced by one spinner; not clickable." }
      }
    },
    "tertiary-icon": {
      name: "Tertiary Button 36px - Dual Icon",
      states: {
        rest: { css: "background:#FFFFFF;color:var(--red-500);box-shadow:inset 0 0 0 1px #E0E0E0;", desc: "Background #FFFFFF, inside border 1px solid #E0E0E0, label and icons the selected brand color, no shadow." },
        hover: { css: "background:var(--red-tint);color:var(--red-500);box-shadow:inset 0 0 0 1px var(--red-500);", desc: "Background a lighter tint of the selected brand color, inside border 1px solid the selected brand color, label and icons the selected brand color." },
        pressed: { css: "background:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1)),var(--red-tint);color:var(--red-500);box-shadow:inset 0 0 0 1px var(--red-500);", desc: "Background a lighter tint of the selected brand color with a 10% black overlay, inside border 1px solid the selected brand color, label and icons the selected brand color - slightly darker than Hover." },
        focused: { css: "background:var(--red-tint);color:var(--red-500);box-shadow:inset 0 0 0 1px #FFFFFF;outline:2px solid #202124;outline-offset:2px;", desc: "Background a lighter tint of the selected brand color, label and icons the selected brand color, 1px white inner border, 2px outside focus ring in #202124." },
        disabled: { css: "background:#E0E0E0;color:#A4A7AE;", desc: "Background #E0E0E0, label and icons #A4A7AE, no border, focus ring or shadow." },
        loading: { css: "background:#FFFFFF;color:var(--red-500);box-shadow:inset 0 0 0 1px #E0E0E0;", desc: "Same background, border and label color as Rest - still reads as present, not unavailable. Label and both icon slots replaced by one spinner; not clickable." }
      }
    },
    "ghost-icon": {
      name: "Ghost Button 36px - Dual Icon",
      states: {
        rest: { css: "background:#FFFFFF;color:var(--red-500);", desc: "Background #FFFFFF, label and icons the selected brand color, no border, shadow or other effects." },
        hover: { css: "background:#F5F5F5;color:var(--red-500);", desc: "Background #F5F5F5, label and icons the selected brand color, no border or shadow." },
        pressed: { css: "background:#E0E0E0;color:var(--red-500);", desc: "Background #E0E0E0, label and icons the selected brand color, no border or shadow - visibly darker than Hover." },
        focused: { css: "background:#FFFFFF;color:var(--red-500);box-shadow:inset 0 0 0 1px #FFFFFF;outline:2px solid #202124;outline-offset:2px;", desc: "Background #FFFFFF, label and icons the selected brand color, 1px white inner border, 2px outside focus ring in #202124." },
        disabled: { css: "background:#E0E0E0;color:#A4A7AE;", desc: "Background #E0E0E0, label and icons #A4A7AE, no border, focus ring, shadow, hover or pressed effects." },
        loading: { css: "background:#FFFFFF;color:var(--red-500);", desc: "Same background and label color as Rest - still reads as present, not unavailable. Label and both icon slots replaced by one spinner; not clickable." }
      }
    },
    "transparent-icon": {
      name: "Transparent Button 36px - Dual Icon",
      states: {
        rest: { css: "background:transparent;color:var(--red-500);", desc: "Background fully transparent, label and icons the selected brand color, no border or shadow." },
        hover: { css: "background:transparent;color:var(--red-500);", desc: "Background fully transparent, label and icons the selected brand color - same appearance as Rest." },
        pressed: { css: "background:transparent;color:var(--red-500);", desc: "Background fully transparent, label and icons the selected brand color - same appearance as Rest and Hover." },
        focused: { css: "background:transparent;color:var(--red-500);box-shadow:inset 0 0 0 1px #FFFFFF;outline:2px solid #202124;outline-offset:2px;", desc: "Background fully transparent, label and icons the selected brand color, 1px white inner border, 2px outside focus ring in #202124." },
        disabled: { css: "background:transparent;color:#A4A7AE;", desc: "Background fully transparent, label and icons #A4A7AE, no border, focus ring or shadow." },
        loading: { css: "background:transparent;color:var(--red-500);", desc: "Same appearance as Rest - still reads as present, not unavailable. Label and both icon slots replaced by one spinner; not clickable." }
      }
    },
    "approve-icon": {
      name: "Approve Button 36px - Dual Icon",
      states: {
        rest: { css: "background:var(--green-500);color:#FFFFFF;", desc: "Background the fixed Approve green (--green-500), label and icons #FFFFFF, no border or shadow." },
        hover: { css: "background:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2)),var(--green-500);color:#FFFFFF;", desc: "Background the fixed Approve green (--green-500) with a 20% black overlay, label and icons #FFFFFF, no border." },
        pressed: { css: "background:linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)),var(--green-500);color:#FFFFFF;", desc: "Background the fixed Approve green (--green-500) with a 40% black overlay, label and icons #FFFFFF, no border - darker than Hover." },
        focused: { css: "background:var(--green-500);color:#FFFFFF;box-shadow:inset 0 0 0 1px #FFFFFF;outline:2px solid #202124;outline-offset:2px;", desc: "Background the fixed Approve green (--green-500), label and icons #FFFFFF, 1px white inner border, 2px outside focus ring in #202124." },
        disabled: { css: "background:#E0E0E0;color:#A4A7AE;", desc: "Background #E0E0E0, label and icons #A4A7AE, no border, focus ring or shadow." },
        loading: { css: "background:var(--green-500);color:#FFFFFF;", desc: "Same background and label color as Rest - still reads as present, not unavailable. Label and both icon slots replaced by one spinner; not clickable." }
      }
    },
    "delete-icon": {
      name: "Delete Button 36px - Dual Icon",
      states: {
        rest: { css: "background:var(--danger-500);color:#FFFFFF;", desc: "Background the fixed Delete red (--danger-500), label and icons #FFFFFF, no border or shadow." },
        hover: { css: "background:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2)),var(--danger-500);color:#FFFFFF;", desc: "Background the fixed Delete red (--danger-500) with a 20% black overlay, label and icons #FFFFFF, no border." },
        pressed: { css: "background:linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)),var(--danger-500);color:#FFFFFF;", desc: "Background the fixed Delete red (--danger-500) with a 40% black overlay, label and icons #FFFFFF, no border - darker than Hover." },
        focused: { css: "background:var(--danger-500);color:#FFFFFF;box-shadow:inset 0 0 0 1px #FFFFFF;outline:2px solid #202124;outline-offset:2px;", desc: "Background the fixed Delete red (--danger-500), label and icons #FFFFFF, 1px white inner border, 2px outside focus ring in #202124." },
        disabled: { css: "background:#E0E0E0;color:#A4A7AE;", desc: "Background #E0E0E0, label and icons #A4A7AE, no border, focus ring or shadow." },
        loading: { css: "background:var(--danger-500);color:#FFFFFF;", desc: "Same background and label color as Rest - still reads as present, not unavailable. Label and both icon slots replaced by one spinner; not clickable." }
      }
    }
  };

  // Size / Corner radius / Content option lists - shared between the page's
  // own multi-select dropdowns and the Copy Prompt/Copy Code generators
  // below, so both speak the same option values and labels.
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
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  var CONTENT_OPTIONS = [
    { value: "icon-both", label: "Icon both sides" },
    { value: "icon-left", label: "Icon left only" },
    { value: "icon-right", label: "Icon right only" },
    { value: "text", label: "Text only" }
  ];
  // Fallback used to render the Live Preview matrix whenever a dropdown is
  // fully deselected, so the matrix never breaks.
  var FALLBACK_DEFAULTS = { size: "36", radius: "4", content: "text" };

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function radiusClassSuffix(value){
    return value === "9999" ? "pill" : value;
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

  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var contentInfo = selectionInfo.content || selectionMode(null, CONTENT_OPTIONS);

    var lines = [];
    lines.push("Create a complete Dual Icon Button component system, covering all 7 types below, each with six states: Rest, Hover, Pressed, Focused, Disabled, Loading.");
    lines.push("");
    lines.push("Default size: 122 x 36px (height 36px, 16px horizontal padding), corner radius 4px, horizontal layout, 8px gap between elements - also supports the full size scale (24/28/32/36/40/44/48/56px height, padding/font-size/icon-size scaling with it) and corner radius (0/4/8/12px/full pill), same as the rest of this Button system.");
    lines.push("Content: left chevron-down icon, label (Inter Medium, default \"Save\"), right chevron-down icon.");
    lines.push("");
    TYPES.forEach(function(typeKey){
      var spec = TYPE_SPEC[typeKey];
      lines.push(TYPE_LABELS[typeKey] + ":");
      STATES.forEach(function(key){
        lines.push("  " + STATE_LABELS[key] + ": " + spec.states[key].desc);
      });
    });
    lines.push("");
    lines.push("Component properties per type:");
    lines.push("  State: Rest / Hover / Pressed / Focused / Disabled / Loading.");
    lines.push("  " + propertyPromptLine("Size", sizeInfo, SIZE_OPTIONS));
    lines.push("  " + propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS));
    lines.push("  " + propertyPromptLine("Content", contentInfo, CONTENT_OPTIONS));
    lines.push("  Label: editable text, default \"Save\".");
    lines.push("Keep padding, icon size, typography, alignment and radius identical across every state and type at a given size - only change what each state specifies. Do not introduce additional colors, gradients or effects beyond what's listed.");
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push(buildSplitPrompt());
    return lines.join("\n");
  }

  function exampleMarkup(size, radiusSuffix, content){
    var showLeft = content === "icon-both" || content === "icon-left";
    var showRight = content === "icon-both" || content === "icon-right";
    var iconSpan = '<span class="dualicon-btn-icon"><!-- chevron-down --></span>';
    var inner = (showLeft ? iconSpan : "") + "<span>Save</span>" + (showRight ? iconSpan : "");
    return '<button class="dualicon-btn dualicon-btn--h' + size + " dualicon-btn--radius-" + radiusSuffix + ' btn--primary-icon-rest">' + inner + "</button>";
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeInfo = selectionInfo.size || selectionMode(null, SIZE_OPTIONS);
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var contentInfo = selectionInfo.content || selectionMode(null, CONTENT_OPTIONS);

    var lines = [];
    lines.push("/* Dual Icon Button system - all 7 types */");
    lines.push(".dualicon-btn{");
    lines.push("  display:inline-flex; align-items:center; justify-content:center;");
    lines.push("  width:auto; max-width:320px; border:none;");
    lines.push('  font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-weight:500;');
    lines.push("  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; cursor:pointer;");
    lines.push("}");
    lines.push(".dualicon-btn > span{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }");
    lines.push("");
    var sizesToEmit = sizeInfo.mode === "all" ? SIZE_OPTIONS.map(function(o){ return o.value; }) : sizeInfo.values;
    lines.push(sizeInfo.mode === "all"
      ? "/* Size scale (height in px) - not chosen yet, default is 36 */"
      : "/* Size - explicitly chosen: " + sizeInfo.values.map(function(v){ return v + "px"; }).join(", ") + " */");
    sizesToEmit.forEach(function(size){
      var s = SIZE_SCALE[size];
      lines.push(".dualicon-btn--h" + size + "{ height:" + size + "px; padding:" + s.padding + "; font-size:" + s.fontSize + "; gap:" + s.gap + "; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 4px */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " */");
    radiiToEmit.forEach(function(radius){
      var suffix = radiusClassSuffix(radius);
      var radiusCss = radius === "9999" ? "9999px" : radius + "px";
      lines.push(".dualicon-btn--radius-" + suffix + "{ border-radius:" + radiusCss + "; }");
    });
    lines.push("");
    TYPES.forEach(function(typeKey){
      var spec = TYPE_SPEC[typeKey];
      lines.push("/* " + TYPE_LABELS[typeKey] + " */");
      STATES.forEach(function(key){
        var extra = key === "disabled" ? "cursor:not-allowed;" : (key === "loading" ? "cursor:wait;pointer-events:none;" : "");
        lines.push(".btn--" + typeKey + "-" + key + "{ " + spec.states[key].css + extra + " }");
      });
      lines.push("");
    });
    var exampleSize = sizeInfo.mode === "all" ? FALLBACK_DEFAULTS.size : sizeInfo.values[0];
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var exampleContent = contentInfo.mode === "all" ? "icon-both" : contentInfo.values[0];
    lines.push(contentInfo.mode === "all"
      ? "/* Content not chosen yet - example below shows Icon both sides, one of: " + CONTENT_OPTIONS.map(function(o){ return o.label; }).join(", ") + " */"
      : "/* Content - explicitly chosen: " + contentInfo.values.map(function(v){ return optionLabelFor(CONTENT_OPTIONS, v); }).join(", ") + " */");
    lines.push(exampleMarkup(exampleSize, radiusClassSuffix(exampleRadius), exampleContent));
    lines.push("");
    lines.push(buildSplitCode());
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Size x Corner radius x Content
  // combination, fully resolved (never "ask the question") - used by the
  // Copy prompt/Copy code dropdown's per-combination "Copy" buttons, so
  // picking one entry always yields a complete, actionable spec.
  function buildComboPrompt(size, radius, content){
    return buildFullPrompt({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      content: { mode: "specific", values: [content] }
    });
  }

  function buildComboCode(size, radius, content){
    return buildFullCode({
      size: { mode: "specific", values: [size] },
      radius: { mode: "specific", values: [radius] },
      content: { mode: "specific", values: [content] }
    });
  }

  // ---------- CTA With Dropdown (split button) ----------
  // Lives at this top-level scope (not inside DOMContentLoaded) so
  // buildFullPrompt/buildFullCode above can fold its spec into the same
  // shared Copy prompt/Copy code output - this component shares the top
  // Properties panel now, not a separate one of its own.
  var SPLIT_STATES = {
    rest: { wrap: "background:#FFFFFF;color:var(--red-500);border:1px solid var(--red-500);", divider: "background:var(--red-500);" },
    hover: { wrap: "background:var(--red-tint);color:var(--red-500);border:1px solid var(--red-500);", divider: "background:var(--red-500);" },
    pressed: { wrap: "background:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1)),var(--red-tint);color:var(--red-500);border:1px solid var(--red-500);", divider: "background:var(--red-500);" },
    focused: { wrap: "background:var(--red-tint);color:var(--red-500);box-shadow:inset 0 0 0 1px #FFFFFF;outline:2px solid #202124;outline-offset:2px;", divider: "background:var(--red-500);" },
    disabled: { wrap: "background:#E0E0E0;color:#A4A7AE;border:1px solid #A4A7AE;", divider: "background:#A4A7AE;" },
    // Same background/border/label color as Rest (still reads as present, not
    // unavailable) - only the main action's leading slot becomes a spinner;
    // pointer-events:none on the wrap blocks both buttons without a native
    // disabled attribute, matching the 7 icon-button types' own loading state.
    loading: { wrap: "background:#FFFFFF;color:var(--red-500);border:1px solid var(--red-500);cursor:wait;pointer-events:none;", divider: "background:var(--red-500);" }
  };

  function buildSplitCta(stateKey, label, showLeading, size, radius){
    var spec = SPLIT_STATES[stateKey];
    var isDisabled = stateKey === "disabled";
    var isLoading = stateKey === "loading";
    var wrapClass = "splitcta" + (isDisabled ? " is-disabled" : "");
    var disabledAttr = isDisabled ? " disabled" : "";
    var scale = SIZE_SCALE[size] || SIZE_SCALE["36"];
    var radiusCss = radius === "9999" ? "9999px" : radius + "px";
    var iconSize = ICON_SIZE_BY_HEIGHT[size] || 20;
    var wrapStyle = "width:auto;height:" + size + "px;border-radius:" + radiusCss + ";" + spec.wrap;
    var mainStyle = "padding:" + scale.padding + ";font-size:" + scale.fontSize + ";gap:" + scale.gap + ";";
    var triggerStyle = "width:" + size + "px;padding:0;";
    var iconStyle = "width:" + iconSize + "px;height:" + iconSize + "px;";
    var leadingHtml = isLoading
      ? spinnerHtml(iconSize)
      : (showLeading ? '<span class="splitcta-icon" style="' + iconStyle + '">' + ICON_CHEVRON_DOWN + "</span>" : "");
    return '<div class="' + wrapClass + '" data-rowstate="' + stateKey + '" data-size="' + size + '" data-radius="' + radius + '" style="' + wrapStyle + '">' +
      '<button type="button" class="splitcta-main" style="' + mainStyle + '"' + disabledAttr + ">" + leadingHtml + "<span>" + label + "</span></button>" +
      '<div class="splitcta-divider" style="' + spec.divider + '"></div>' +
      '<button type="button" class="splitcta-trigger" style="' + triggerStyle + '" aria-label="Open menu"' + disabledAttr + '><span class="splitcta-icon" style="' + iconStyle + '">' + ICON_CHEVRON_DOWN + "</span></button>" +
      "</div>";
  }

  function buildSplitPrompt(){
    var lines = [];
    lines.push('Create an editable "CTA With Dropdown" split-button component set with six states: Rest, Hover, Pressed, Focused, Disabled, Loading.');
    lines.push("");
    lines.push("Dimensions: 141 x 36px total - a 105x36px main action joined with no gap to a 36x36px dropdown trigger, 1px divider between them, 4px outer corner radius with the joining edge kept square.");
    lines.push("Main action: 16px horizontal padding, 8px gap, left chevron-down icon (20x20px), label (Inter Medium 14px/20px, shares the same Label property as the button matrix, default \"Save\"). Dropdown trigger: centered chevron-down icon (20x20px), 8px padding.");
    lines.push("");
    lines.push("Rest: both sections #FFFFFF background, 1px outline and divider in the selected brand color, label and icons in the selected brand color.");
    lines.push("Hover: both sections switch to a lighter tint of the selected brand color, outline/divider/label/icons stay the selected brand color.");
    lines.push("Pressed: same tint as Hover with a 10% black overlay, slightly darker than Hover.");
    lines.push("Focused: same background as Hover, 1px white inner border around the whole control, 2px outside focus ring in #202124.");
    lines.push("Disabled: both sections #E0E0E0, label/icons/outline/divider #A4A7AE, no focus ring.");
    lines.push("Loading: same background, outline and divider color as Rest - still reads as present, not unavailable. The main action's leading icon is replaced by a spinner; neither section is clickable.");
    lines.push("");
    lines.push("Component properties: State (Rest/Hover/Pressed/Focused/Disabled/Loading), Size and Corner radius (shared with the button matrix's own Size/Corner radius properties), Label (editable text, shared with the button matrix's own Label field, default \"Save\"), Leading Icon (boolean, default true). The main action and dropdown trigger are two separate clickable areas, not one button.");
    lines.push("Keep dimensions, padding, typography, alignment and radius identical across every state - only change what each state specifies. Do not introduce additional colors, gradients or effects beyond what's listed.");
    return lines.join("\n");
  }

  function buildSplitCode(){
    var lines = [];
    lines.push("/* CTA With Dropdown - split button */");
    lines.push(".splitcta{ display:inline-flex; align-items:stretch; width:141px; height:36px; border-radius:4px; overflow:hidden; box-sizing:border-box; }");
    lines.push(".splitcta-main{ display:inline-flex; align-items:center; gap:8px; width:105px; padding:0 16px; border:none; background:transparent; color:inherit; font-weight:500; font-size:14px; line-height:20px; cursor:pointer; }");
    lines.push(".splitcta-divider{ width:1px; }");
    lines.push(".splitcta-trigger{ display:flex; align-items:center; justify-content:center; width:36px; padding:8px; border:none; background:transparent; color:inherit; cursor:pointer; }");
    lines.push("");
    Object.keys(SPLIT_STATES).forEach(function(key){
      var spec = SPLIT_STATES[key];
      var extra = key === "disabled" ? "cursor:not-allowed;" : "";
      lines.push(".splitcta--" + key + "{ " + spec.wrap + extra + " }");
      lines.push(".splitcta--" + key + " .splitcta-divider{ " + spec.divider + " }");
    });
    lines.push("");
    lines.push('<div class="splitcta splitcta--rest">');
    lines.push('  <button class="splitcta-main"><span class="splitcta-icon"><!-- chevron-down --></span><span>Save</span></button>');
    lines.push('  <div class="splitcta-divider"></div>');
    lines.push('  <button class="splitcta-trigger" aria-label="Open menu"><span class="splitcta-icon"><!-- chevron-down --></span></button>');
    lines.push("</div>");
    return lines.join("\n");
  }

  function copyText(text, btn){
    var originalLabel = btn.textContent;
    function done(){
      btn.textContent = "Copied!";
      setTimeout(function(){ btn.textContent = originalLabel; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(function(){ fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text);
      done();
    }
  }

  function fallbackCopy(text){
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
  // Size x Corner radius x Content combination is in play) or, whenever
  // more than one combination is currently selected, a disclosure dropdown
  // listing every combination by name with its own "Copy" button - so the
  // user can grab the exact prompt/code for the one combination that
  // matches their business goal instead of one prompt trying to cover all
  // of them at once.
  function buildCopyControl(container, plainLabel, buildSingle, combos, buildCombo){
    if (!container) return;
    if (container._copyDropdownCleanup){
      container._copyDropdownCleanup();
      container._copyDropdownCleanup = null;
    }

    if (combos.length <= 1){
      container.innerHTML = '<button type="button" class="btn btn-ghost btn-sm">' + plainLabel + "</button>";
      var plainBtn = container.querySelector("button");
      plainBtn.addEventListener("click", function(){ copyText(buildSingle(), plainBtn); });
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
        copyText(buildCombo(c), copyBtn);
      });
    });

    container._copyDropdownCleanup = closePanel;
  }

  document.addEventListener("DOMContentLoaded", function(){
    // Gallery-card copy CTAs (components.html) - separate data-role from the
    // matrix page's own copy-prompt-full/copy-code-full so components.js's
    // generic TYPE_SPECS-driven copy-prompt/copy-code wiring never touches
    // these (it has no entry for the dual-icon types and would throw).
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-dualicon"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-dualicon"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyText(buildFullPrompt(), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyText(buildFullCode(), cardCopyCodeBtn);
      });
    }

    var matrixContainer = document.querySelector('[data-role="dualicon-matrix-container"]');
    if (!matrixContainer) return;

    var defaultLabel = document.body.dataset.defaultLabel || "Save";
    var labelInput = document.querySelector('[data-role="dualicon-label"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    // SIZE_OPTIONS / RADIUS_OPTIONS / CONTENT_OPTIONS / FALLBACK_DEFAULTS are
    // declared at top-level scope above (shared with buildFullPrompt/
    // buildFullCode's selection-aware output).
    var sizeMount = document.querySelector('[data-role="dualicon-size-mount"]');
    var radiusMount = document.querySelector('[data-role="dualicon-radius-mount"]');
    var contentMount = document.querySelector('[data-role="dualicon-content-mount"]');

    function sizeCssFor(size, radius){
      var scale = SIZE_SCALE[size];
      var radiusCss = radius === "9999" ? "9999px" : radius + "px";
      return "width:auto;height:" + size + "px;padding:" + scale.padding + ";font-size:" + scale.fontSize + ";gap:" + scale.gap + ";border-radius:" + radiusCss + ";";
    }

    function buildButton(typeKey, stateKey, label, showLeft, showRight, size, radius){
      var stateCss = TYPE_SPEC[typeKey].states[stateKey].css;
      var iconSize = ICON_SIZE_BY_HEIGHT[size] || 16;
      var isLoading = stateKey === "loading";
      // Loading isn't a native-disabled look (see TYPE_SPEC's loading desc) -
      // block interaction via cursor/pointer-events only, same technique the
      // flexible Button system uses (shell.css's .btn-demo.is-loading).
      var extraCss = isLoading ? "cursor:wait;pointer-events:none;" : "";
      var css = sizeCssFor(size, radius) + stateCss + extraCss;
      var iconHtml = '<span class="dualicon-btn-icon" style="width:' + iconSize + 'px;height:' + iconSize + 'px;">' + ICON_CHEVRON_DOWN + "</span>";
      var inner = "";
      if (isLoading){
        // Spinner replaces BOTH icon slots (not just the leading one) - this
        // component always shows the same chevron on both sides, so keeping
        // one during loading would look like a second still-available action.
        inner = spinnerHtml(iconSize) + "<span>" + escapeHtml(label) + "</span>";
      } else {
        if (showLeft) inner += iconHtml;
        inner += "<span>" + escapeHtml(label) + "</span>";
        if (showRight) inner += iconHtml;
      }
      var disabledAttr = stateKey === "disabled" ? " disabled" : "";
      return '<button type="button" class="dualicon-btn" data-type="' + typeKey + '" data-rowstate="' + stateKey + '" data-size="' + size + '" data-radius="' + radius + '" style="' + css + '"' + disabledAttr + ">" + inner + "</button>";
    }

    // Every cell only ever had its ASSIGNED row-state colors, no real
    // interactivity of its own (see the removed generic CSS overlay rule in
    // shell.css for why that approach was wrong - it didn't match what each
    // type's own real Hover/Pressed treatment actually looks like for types
    // like Tertiary/Ghost that don't use a black-overlay technique). This
    // wires up genuine hover/press feedback per cell, using that SAME
    // type's real Hover/Pressed CSS (pulled from TYPE_SPEC), swapping back
    // to the row's own assigned state on mouseleave - so hovering any cell
    // shows exactly what that type's Hover row displays, not a generic
    // darkened guess.
    function wireRealInteraction(container){
      container.querySelectorAll(".dualicon-btn[data-type]").forEach(function(btn){
        var typeKey = btn.dataset.type;
        var rowState = btn.dataset.rowstate;
        if (rowState === "disabled" || rowState === "loading") return;
        var baseSize = sizeCssFor(btn.dataset.size, btn.dataset.radius);
        var states = TYPE_SPEC[typeKey].states;
        var restCss = baseSize + states[rowState].css;
        var hoverCss = baseSize + states.hover.css;
        var pressedCss = baseSize + states.pressed.css;
        btn.addEventListener("mouseenter", function(){ btn.style.cssText = hoverCss; });
        btn.addEventListener("mouseleave", function(){ btn.style.cssText = restCss; });
        btn.addEventListener("mousedown", function(){ btn.style.cssText = pressedCss; });
        btn.addEventListener("mouseup", function(){ btn.style.cssText = hoverCss; });
      });
    }

    // Same real-interaction treatment for the split CTA's wrapper (its
    // Hover/Pressed change the whole wrapper's background/border, plus the
    // divider color, not one button's background).
    function wireSplitInteraction(container){
      container.querySelectorAll(".splitcta[data-rowstate]").forEach(function(wrap){
        var rowState = wrap.dataset.rowstate;
        if (rowState === "disabled" || rowState === "loading") return;
        var scale = SIZE_SCALE[wrap.dataset.size] || SIZE_SCALE["36"];
        var radiusCss = wrap.dataset.radius === "9999" ? "9999px" : wrap.dataset.radius + "px";
        var baseWrapCss = "width:auto;height:" + wrap.dataset.size + "px;border-radius:" + radiusCss + ";";
        var divider = wrap.querySelector(".splitcta-divider");
        var restSpec = SPLIT_STATES[rowState];
        var hoverSpec = SPLIT_STATES.hover;
        var pressedSpec = SPLIT_STATES.pressed;

        function apply(spec){
          wrap.style.cssText = baseWrapCss + spec.wrap;
          divider.style.cssText = spec.divider;
        }

        wrap.addEventListener("mouseenter", function(){ apply(hoverSpec); });
        wrap.addEventListener("mouseleave", function(){ apply(restSpec); });
        wrap.addEventListener("mousedown", function(){ apply(pressedSpec); });
        wrap.addEventListener("mouseup", function(){ apply(hoverSpec); });
      });
    }

    var splitLeadingIconInput = document.querySelector('[data-role="splitcta-leading-icon"]');

    // The 3 multi-select dropdowns each track a full selected SET. The Live
    // Preview renders one full Type x State matrix PER selected combination
    // of Size x Corner radius x Content (falling back to FALLBACK_DEFAULTS
    // for any dropdown that's fully deselected, so the preview never goes
    // blank) - so checking more than one option anywhere shows every
    // resulting combination side by side instead of picking just one.
    function selectedOrDefault(multiSelect, optionList, fallback){
      if (!multiSelect) return [fallback];
      var selectedValues = multiSelect.getSelected();
      if (!selectedValues.length) return [fallback];
      var order = optionList.map(function(opt){ return opt.value; });
      var ordered = order.filter(function(v){ return selectedValues.indexOf(v) !== -1; });
      return ordered.length ? ordered : [fallback];
    }

    function comboLabel(size, radius, content){
      return optionLabelFor(SIZE_OPTIONS, size) + " / " + optionLabelFor(RADIUS_OPTIONS, radius) + " / " + optionLabelFor(CONTENT_OPTIONS, content);
    }

    function buildMatrixSection(size, radius, content, label, splitShowLeading){
      var showLeft = content === "icon-both" || content === "icon-left";
      var showRight = content === "icon-both" || content === "icon-right";
      var rows = STATES.map(function(stateKey){
        var cells = TYPES.map(function(typeKey){
          return '<td class="button-matrix-cell">' + buildButton(typeKey, stateKey, label, showLeft, showRight, size, radius) + "</td>";
        }).join("");
        var splitCell = '<td class="button-matrix-cell">' + buildSplitCta(stateKey, label, splitShowLeading, size, radius) + "</td>";
        return "<tr><th class=\"button-matrix-rowhead\">" + STATE_LABELS[stateKey] + "</th>" + cells + splitCell + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(typeKey){ return '<th class="button-matrix-colhead">' + TYPE_LABELS[typeKey] + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(size, radius, content) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + '<th class="button-matrix-colhead">CTA With Dropdown</th></tr></thead>' +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function render(){
      var label = (labelInput.value.trim() || defaultLabel);
      var splitShowLeading = splitLeadingIconInput ? splitLeadingIconInput.checked : true;

      var sizes = selectedOrDefault(sizeContentMultiSelects.size, SIZE_OPTIONS, FALLBACK_DEFAULTS.size);
      var radii = selectedOrDefault(sizeContentMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);
      var contents = selectedOrDefault(sizeContentMultiSelects.content, CONTENT_OPTIONS, FALLBACK_DEFAULTS.content);

      var html = "";
      var combos = [];
      sizes.forEach(function(size){
        radii.forEach(function(radius){
          contents.forEach(function(content){
            html += buildMatrixSection(size, radius, content, label, splitShowLeading);
            combos.push({ size: size, radius: radius, content: content, label: comboLabel(size, radius, content) });
          });
        });
      });
      matrixContainer.innerHTML = html;

      wireRealInteraction(matrixContainer);
      wireSplitInteraction(matrixContainer);

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.size, c.radius, c.content); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.size, c.radius, c.content); });
    }

    // sizeContentMultiSelects is populated just below, before render() is
    // ever invoked - render() itself only runs from a change callback or
    // the explicit render() call at the bottom of this file.
    var sizeContentMultiSelects = {};
    if (sizeMount && window.createMultiSelect){
      sizeContentMultiSelects.size = window.createMultiSelect({
        root: sizeMount,
        options: SIZE_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.size],
        ariaLabel: "Size options",
        labelledBy: "dualicon-size-label",
        onChange: render
      });
    }
    if (radiusMount && window.createMultiSelect){
      sizeContentMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "dualicon-radius-label",
        onChange: render
      });
    }
    if (contentMount && window.createMultiSelect){
      sizeContentMultiSelects.content = window.createMultiSelect({
        root: contentMount,
        options: CONTENT_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.content],
        ariaLabel: "Content options",
        labelledBy: "dualicon-content-label",
        onChange: render
      });
    }

    labelInput.addEventListener("input", render);
    if (splitLeadingIconInput) splitLeadingIconInput.addEventListener("change", render);

    function currentSelectionInfo(){
      return {
        size: selectionMode(sizeContentMultiSelects.size, SIZE_OPTIONS, [FALLBACK_DEFAULTS.size]),
        radius: selectionMode(sizeContentMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius]),
        content: selectionMode(sizeContentMultiSelects.content, CONTENT_OPTIONS, [FALLBACK_DEFAULTS.content])
      };
    }

    render();
  });
})();
