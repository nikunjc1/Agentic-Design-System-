(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Same icon set as Toast/Alert/Notification, so Modal.info/.success/
  // .warning/.error read as the same semantic language everywhere else in
  // this system uses it, rather than a Modal-specific icon style.
  var CONFIRM_ICONS = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>',
    confirm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><line x1="12" y1="16.5" x2="12" y2="16.5"/></svg>'
  };
  var CONFIRM_SHORTCUTS = [
    { key: "info", label: "Modal.info", title: "New version available", body: "Version 3.5 adds bulk export and faster search." },
    { key: "success", label: "Modal.success", title: "Payment received", body: "Your invoice has been marked as paid." },
    { key: "warning", label: "Modal.warning", title: "Storage almost full", body: "You're using 92% of your storage. Free up space soon." },
    { key: "error", label: "Modal.error", title: "Upload failed", body: "The file exceeds the 50MB size limit." },
    { key: "confirm", label: "Modal.confirm", title: "Delete this project?", body: "This can't be undone. All files and history will be permanently removed." }
  ];

  // Renders one of Ant's confirm-type shortcuts - an icon beside the title
  // (no separate header row, no close "x"), single OK button for info/
  // success/warning/error, OK + Cancel for confirm - the shape these exist
  // specifically to save a caller from re-declaring every time.
  function buildConfirmShortcut(kind){
    var spec = CONFIRM_SHORTCUTS.filter(function(c){ return c.key === kind; })[0];
    var iconHtml = '<span class="modal-demo-confirm-icon modal-demo-confirm-icon--' + kind + '">' + CONFIRM_ICONS[kind] + "</span>";
    var headerHtml = '<div class="modal-demo-confirm-header">' + iconHtml +
      '<div><p class="modal-demo-confirm-title">' + escapeHtml(spec.title) + '</p>' +
      '<p class="modal-demo-confirm-body">' + escapeHtml(spec.body) + "</p></div></div>";
    var footerHtml = kind === "confirm"
      ? '<div class="modal-demo-footer"><button type="button" class="modal-demo-btn modal-demo-btn--cancel" tabindex="-1">Cancel</button><button type="button" class="modal-demo-btn modal-demo-btn--primary" tabindex="-1">OK</button></div>'
      : '<div class="modal-demo-footer" style="justify-content:flex-end;"><button type="button" class="modal-demo-btn modal-demo-btn--primary" tabindex="-1">OK</button></div>';
    return '<div class="modal-demo-scrim" style="padding:var(--space-12);"><div class="modal-demo-dialog modal-demo-dialog--default" style="max-width:var(--dimension-220);border-radius:var(--radius-md);">' +
      '<div class="modal-demo-body" style="padding-top:var(--space-16);">' + headerHtml + "</div>" +
      footerHtml +
      "</div></div>";
  }

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "destructive", label: "Destructive" }
  ];
  // Destructive uses role="alertdialog" (a decision requiring explicit
  // acknowledgement) rather than plain role="dialog" - native <dialog> +
  // showModal() already gives aria-modal/focus-trap/Escape/focus-restore for
  // free either way, this just picks the stronger semantic for the riskier type.
  var ROLE_BY_TYPE = { default: "dialog", destructive: "alertdialog" };
  // No footer, Scrollable and No close are independent configuration
  // options (not mutually exclusive states) per the spec's own "Important"
  // note - they combine freely. Loading and Error are genuine interaction
  // states (a real point in the dialog's lifecycle), not configuration, so
  // they get their own rows too. This list curates a handful of
  // representative combinations for the side-by-side Live Preview matrix,
  // the same way Button's Compare-states rows are illustrative examples
  // rather than an exhaustive cross-product.
  var SCENARIOS = [
    { key: "default", label: "Default", noFooter: false, scrollable: false, noClose: false, loading: false, error: false },
    { key: "no-footer", label: "No footer", noFooter: true, scrollable: false, noClose: false, loading: false, error: false },
    { key: "scrollable", label: "Scrollable", noFooter: false, scrollable: true, noClose: false, loading: false, error: false },
    { key: "no-close", label: "No close", noFooter: false, scrollable: false, noClose: true, loading: false, error: false },
    { key: "scrollable-no-close", label: "Scrollable + No close", noFooter: false, scrollable: true, noClose: true, loading: false, error: false },
    { key: "loading", label: "Loading", noFooter: false, scrollable: false, noClose: false, loading: true, error: false },
    { key: "error", label: "Error", noFooter: false, scrollable: false, noClose: false, loading: false, error: true }
  ];

  var FULL_SPEC = {
    default: { purpose: "A neutral dialog for standard confirmations and focused tasks - the primary action button uses this system's brand red, same as a standard Primary button." },
    destructive: { purpose: "Used for irreversible or dangerous confirmations, like deleting data - the same dialog structure as Default, but the primary action button uses the fixed danger-red token and typically reads \"Delete\" instead of \"Confirm\"." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // Primary action button color per type - Default uses the brand-customizable
  // --red-* tokens, Destructive uses the fixed --danger-* tokens so a Delete
  // action always reads as red regardless of whatever brand color is saved
  // on the Colors page (same rule Button's own Destructive type follows).
  function liveCssFor(typeKey){
    if (typeKey === "primary") return {
      rest: "background:var(--button-primary-bg-default);color:var(--button-primary-text-default);",
      hover: "background:var(--button-primary-bg-hover);color:var(--button-primary-text-hover);",
      pressed: "background:var(--button-primary-bg-active);color:var(--button-primary-text-active);"
    };
    if (typeKey === "destructive"){
      return {
        primaryBg: getCssVar("--danger-500", "#FF031A"),
        primaryHoverBg: getCssVar("--danger-600", "#D10215")
      };
    }
    return {
      primaryBg: getCssVar("--red-500", "#FF031A"),
      primaryHoverBg: getCssVar("--red-600", "#D10215")
    };
  }

  // Size -> dialog max-width (px) - a literal lookup, not formula-derived,
  // same convention as SIZE_SCALE in group-button-detail.js, so Copy Code
  // reproduces exactly what the Live Preview matrix is showing.
  var SIZE_MAP = { small: 400, medium: 560, large: 720 };
  var SIZE_OPTIONS = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" }
  ];
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "2", label: "2px - Subtle" },
    { value: "4", label: "4px - Compact" },
    { value: "6", label: "6px - Compact foundation" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "16", label: "16px - Expressive" },
    { value: "24", label: "24px - Large" }
  ];

  // Corner radius default now tracks the sitewide Radius foundation's
  // current philosophy (theme-init.js/shell.js keep --radius-md live)
  // instead of a fixed literal - snaps to whichever of this component's
  // own preset options is closest, so a philosophy step this component
  // doesn't offer as an exact preset still lands on a sensible neighbor
  // instead of silently ignoring the sitewide setting.
  function liveRadiusDefault(fallback){
    var raw = getComputedStyle(document.documentElement).getPropertyValue("--radius-md").trim();
    var num = window.ADSFoundationModel.toPx(raw);
    if (!isFinite(num)) return fallback;
    var closest = null, closestDiff = Infinity;
    RADIUS_OPTIONS.forEach(function(opt){
      var val = Number(opt.value);
      var diff = Math.abs(val - num);
      if (diff < closestDiff){ closestDiff = diff; closest = opt.value; }
    });
    return closest !== null ? closest : fallback;
  }
  var DEFAULT_TITLE = "Delete this file?";
  var DEFAULT_BODY = "This action cannot be undone.";
  var DEFAULT_CONFIRM_LABEL = "Confirm";
  var DEFAULT_CANCEL_LABEL = "Cancel";
  // Heading level is one of the Typography Foundation's own predefined
  // roles (h1-h6, each with its own --type-hN-size/weight/line-height/family
  // token) - not a free-form choice, so the title always traces back to a
  // real Foundation value, exactly like every other Foundation-bound style
  // in this system.
  var HEADING_LEVEL_OPTIONS = [
    { value: "h1", label: "H1" }, { value: "h2", label: "H2" }, { value: "h3", label: "H3" },
    { value: "h4", label: "H4" }, { value: "h5", label: "H5" }, { value: "h6", label: "H6" }
  ];
  var FALLBACK_DEFAULTS = {
    size: "medium",
    radius: liveRadiusDefault("8"),
    title: DEFAULT_TITLE,
    headingLevel: "h6",
    body: DEFAULT_BODY,
    showClose: true,
    showIcon: false,
    confirmLabel: DEFAULT_CONFIRM_LABEL,
    cancelLabel: DEFAULT_CANCEL_LABEL
  };
  // Icon shown beside the title when Show icon is on - "confirm" (a '?')
  // for Default's neutral question, "warning" for Destructive's higher-risk
  // one. Reuses the same icon set Alert/Toast/Notification already use, so
  // the visual language of "what kind of message is this" stays one system
  // wide instead of Modal inventing its own icon style.
  var HEADER_ICON_BY_TYPE = { default: "confirm", destructive: "warning" };

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function radiusClassSuffix(value){
    return value === "9999" ? "pill" : value;
  }

  function radiusCssFor(value){
    return window.ADSFoundationModel.radiusCss(Number(value), window.ADSFoundation.get().unit);
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
    function pick(key){ return (selectionInfo[key] !== undefined) ? selectionInfo[key] : FALLBACK_DEFAULTS[key]; }
    return {
      radius: selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS),
      sizeKey: pick("sizeKey"),
      title: pick("title"),
      body: pick("body"),
      showClose: pick("showClose"),
      showIcon: pick("showIcon"),
      confirmLabel: pick("confirmLabel"),
      cancelLabel: pick("cancelLabel")
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push("Create a complete Modal component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable dialog component controlled by properties (type, size, radius, no footer, scrollable, no close, loading, error) - a dialog box shown above a dimmed page backdrop (scrim), blocking interaction with the rest of the page until dismissed or actioned. It has a title bar (with an optional leading icon and an optional close \"x\"), a body area for content, and usually a footer with Cancel/primary-action buttons. Use a real <dialog> element with showModal() (see Copy code) - it gives aria-modal, a focus trap, Escape-to-close and focus restoration to the trigger natively, instead of reimplementing all four by hand.");
    lines.push("");
    lines.push("Types (" + TYPES.length + "):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose + " role=\"" + ROLE_BY_TYPE[t.key] + "\".");
      lines.push("  Primary action button: background:" + css.primaryBg + "; Hover: background:" + css.primaryHoverBg + ";");
    });
    if (selectionInfo && selectionInfo.typeFilter){
      var filteredType = TYPES.filter(function(t){ return t.key === selectionInfo.typeFilter; })[0];
      lines.push("");
      lines.push("This card's live example commits specifically to the " + (filteredType ? filteredType.label : selectionInfo.typeFilter) + " type - generate that type first, though the full component still supports all " + TYPES.length + " listed above.");
    }
    lines.push("");
    lines.push("Configuration properties (independent booleans - combine freely, e.g. Scrollable + No close together, not mutually exclusive named states):");
    lines.push("- No footer (boolean, default unchecked) - title bar and body only, no footer action buttons; a purely informational dialog.");
    lines.push("- Scrollable (boolean, default unchecked) - body content gets a fixed max-height with a fade-to-transparent gradient cueing more content below; footer stays present.");
    lines.push("- No close (boolean, default unchecked) - title bar has NO close X, forcing the user to pick a footer action; common for critical confirmations. Unless the workflow genuinely requires a mandatory decision, still give the user another clear way out (a Cancel button, Escape).");
    lines.push("");
    lines.push("Interaction states (genuine points in the dialog's lifecycle, not configuration):");
    lines.push("- Loading: shown while the Confirm action's operation is in flight - both footer buttons disabled, Confirm shows an inline spinner beside its label. Don't close the dialog until the operation actually resolves.");
    lines.push("- Error: the last submit failed - an inline error message (role=\"alert\") appears in the body so it's announced; the dialog stays open so the user can retry, it never auto-dismisses on failure.");
    lines.push("");
    var sizePx = SIZE_MAP[info.sizeKey] || SIZE_MAP[FALLBACK_DEFAULTS.size];
    lines.push("Size: " + optionLabelFor(SIZE_OPTIONS, info.sizeKey) + " - controls the dialog's max-width (" + sizePx + "px). Other options: " + SIZE_OPTIONS.map(function(o){ return o.label + " (" + SIZE_MAP[o.value] + "px)"; }).join(" / ") + ".");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS));
    lines.push("");
    lines.push("Component properties: Size; Corner radius; Title (text, default \"" + FALLBACK_DEFAULTS.title + "\"); Body text (text, default \"" + FALLBACK_DEFAULTS.body + "\"); Show close button (boolean, default on); Show icon (boolean, default off - a leading status icon beside the title, " + HEADER_ICON_BY_TYPE.default + " for Default, " + HEADER_ICON_BY_TYPE.destructive + " for Destructive); Confirm label (text, default \"" + DEFAULT_CONFIRM_LABEL + "\" - prefer an action-specific label like \"Delete\" over a generic \"Yes/Confirm\" for destructive operations); Cancel label (text, default \"" + DEFAULT_CANCEL_LABEL + "\").");
    lines.push("Current values - Show close button: " + (info.showClose ? "on" : "off") + ", Show icon: " + (info.showIcon ? "on" : "off") + ", Confirm label: \"" + info.confirmLabel + "\", Cancel label: \"" + info.cancelLabel + "\".");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;
    var sizeKey = info.sizeKey;
    var title = info.title;
    var body = info.body;
    var showClose = info.showClose;

    var graphite900 = getCssVar("--graphite-900", "#FFFFFF");
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var line = getCssVar("--line", "rgba(255,255,255,0.08)");
    var textHi = getCssVar("--text-hi", "#111827");
    var textMid = getCssVar("--text-mid", "#4B5563");
    var textDim = getCssVar("--text-dim", "#69707D");

    var lines = [];
    lines.push("/* Agentic Design System - Modal component */");
    lines.push("/* <dialog> instead of a scrim + positioned div: showModal() gives real");
    lines.push("   dialog semantics, background inertness, Escape-to-close, a focus trap");
    lines.push("   and focus restoration to the trigger on close for free, from the browser");
    lines.push("   itself - not something this snippet has to reimplement or get wrong. */");
    lines.push('dialog.modal-dialog{ box-sizing:border-box; width:100%; margin:auto; padding:0; background:' + graphite900 + "; border:1px solid " + lineStrong + '; box-shadow:0 24px 48px rgba(0,0,0,0.5); display:flex; flex-direction:column; overflow:hidden; }');
    // Foundation audit AT07 - dialog.modal-dialog above and the UA's own
    // dialog:not([open]){display:none} are the same specificity (type + one
    // class/pseudo-class each), so source order alone decided the winner and
    // this later author rule silently kept every closed dialog visible.
    // :not([open]) raises this rule's specificity past the base one so a
    // closed dialog stays hidden regardless of rule order.
    lines.push("dialog.modal-dialog:not([open]){ display:none; }");
    lines.push("dialog.modal-dialog::backdrop{ background:var(--overlay-scrim); }");
    lines.push("");
    lines.push("/* Size - controls dialog max-width */");
    SIZE_OPTIONS.forEach(function(o){
      lines.push(".modal-dialog--" + o.value + "{ max-width:" + SIZE_MAP[o.value] + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (8 options) - not chosen yet, default is 8px */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " */");
    radiiToEmit.forEach(function(radius){
      lines.push(".modal-dialog--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push(".modal-header{ display:flex; align-items:center; justify-content:space-between; gap:var(--space-12); padding:var(--space-16) var(--space-20); border-bottom:1px solid " + line + "; }");
    lines.push('.modal-title{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-selected-weight); color:' + textHi + "; margin:0; }");
    lines.push(".modal-close{ flex:none; width:var(--dimension-44); height:var(--dimension-44); display:flex; align-items:center; justify-content:center; margin:calc(-1 * var(--space-12)); background:none; border:none; color:" + textDim + "; cursor:pointer; padding:0; }");
    lines.push('.modal-body{ padding:var(--space-16) var(--space-20); font-family:var(--font-body); font-size:var(--type-body-size); color:' + textMid + "; position:relative; }");
    lines.push("/* overflow-y:auto, not hidden - a fixed max-height with overflow:hidden");
    lines.push("   clips any content past it instead of making it reachable; the fade is");
    lines.push("   pointer-events:none so it never blocks wheel/touch scrolling underneath. */");
    lines.push(".modal-body--scrollable{ max-height:var(--dimension-64); overflow-y:auto; }");
    lines.push(".modal-fade{ position:absolute; left:0; right:0; bottom:0; height:var(--dimension-32); background:linear-gradient(to bottom, transparent, " + graphite900 + "); pointer-events:none; }");
    lines.push(".modal-footer{ display:flex; justify-content:flex-end; gap:var(--space-8); padding:var(--space-12) var(--space-20); border-top:1px solid " + line + "; }");
    lines.push('.modal-btn{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-selected-weight); padding:var(--space-8) var(--space-16); border-radius:var(--radius-sm); cursor:pointer; border:var(--border-width-1) var(--border-style) transparent; }');
    lines.push(".modal-btn--cancel{ background:transparent; border-color:" + lineStrong + "; color:" + textHi + "; }");
    lines.push("");
    lines.push("/* Types (" + TYPES.length + ") - primary action button color per type. Text");
    lines.push("   color is the resolved foreground for that type's own background (black");
    lines.push("   against this system's default red - 5.28:1 - not a fixed white, which");
    lines.push("   only clears 3.98:1 and fails AA), so it stays correct if the brand color");
    lines.push("   (Default type only; Destructive stays fixed danger red) is customized. */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      var primaryText = getCssVar(t.key === "destructive" ? "--status-danger-text" : "--button-primary-text", "#15171A");
      lines.push(".modal-dialog--" + t.key + " .modal-btn--primary{ background:" + css.primaryBg + "; color:" + primaryText + "; }");
      lines.push(".modal-dialog--" + t.key + " .modal-btn--primary:hover{ background:" + css.primaryHoverBg + "; }");
    });
    lines.push("");

    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var typesToRender = selectionInfo && selectionInfo.typeFilter ? TYPES.filter(function(t){ return t.key === selectionInfo.typeFilter; }) : TYPES;
    lines.push("<!-- Example usage - " + (selectionInfo && selectionInfo.typeFilter ? "the " + (typesToRender[0] ? typesToRender[0].label : selectionInfo.typeFilter) + " type only" : "one per type") + ", at " + optionLabelFor(SIZE_OPTIONS, sizeKey) + " size" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen radius" : "") + " -->");
    typesToRender.forEach(function(t){
      var smartPrimary = t.key === "destructive" ? "Delete" : DEFAULT_CONFIRM_LABEL;
      var primaryLabel = (info.confirmLabel && info.confirmLabel !== DEFAULT_CONFIRM_LABEL) ? info.confirmLabel : smartPrimary;
      var dialogId = "modal-example-" + t.key;
      var titleId = dialogId + "-title";
      var bodyId = dialogId + "-body";
      var iconHtml = info.showIcon ? '    <span class="modal-demo-confirm-icon modal-demo-confirm-icon--' + HEADER_ICON_BY_TYPE[t.key] + '">' + CONFIRM_ICONS[HEADER_ICON_BY_TYPE[t.key]] + "</span>\n" : "";
      lines.push('<button type="button" class="btn btn-primary" data-modal-trigger="' + dialogId + '">Open ' + escapeHtml(title) + "</button>");
      lines.push('<dialog class="modal-dialog modal-dialog--' + t.key + " modal-dialog--" + sizeKey + " modal-dialog--radius-" + radiusClassSuffix(exampleRadius) + '" id="' + dialogId + '" role="' + ROLE_BY_TYPE[t.key] + '" aria-labelledby="' + titleId + '" aria-describedby="' + bodyId + '" style="border-radius:' + radiusCssFor(exampleRadius) + ';">');
      lines.push('  <div class="modal-header">');
      lines.push('    <p class="modal-title" id="' + titleId + '">' + iconHtml + escapeHtml(title) + "</p>");
      if (showClose) lines.push('    <button type="button" class="modal-close" aria-label="Close" data-modal-dismiss>&times;</button>');
      lines.push("  </div>");
      lines.push('  <div class="modal-body"><p id="' + bodyId + '">' + escapeHtml(body) + "</p></div>");
      lines.push('  <div class="modal-footer">');
      lines.push('    <button type="button" class="modal-btn modal-btn--cancel" data-modal-dismiss>' + escapeHtml(info.cancelLabel) + "</button>");
      lines.push('    <!-- Closes itself here for demonstration only - a real ' + primaryLabel.toLowerCase() + " action should show a Loading state on this button, wait for the operation's actual result, and only close the dialog on success (show an inline error and stay open on failure). -->");
      lines.push('    <button type="button" class="modal-btn modal-btn--primary" data-modal-dismiss>' + escapeHtml(primaryLabel) + "</button>");
      lines.push("  </div>");
      lines.push("</dialog>");
    });
    lines.push("");
    lines.push("<script>");
    lines.push("(function(){");
    lines.push("  document.querySelectorAll('[data-modal-trigger]').forEach(function(trigger){");
    lines.push("    var dialog = document.getElementById(trigger.dataset.modalTrigger);");
    lines.push("    if (!dialog) return;");
    lines.push("    // showModal() gives this dialog a real focus trap, Escape-to-close and");
    lines.push("    // background inertness natively - close() then restores focus to");
    lines.push("    // whatever had it before showModal() was called (this trigger).");
    lines.push("    trigger.addEventListener('click', function(){ dialog.showModal(); });");
    lines.push("    dialog.querySelectorAll('[data-modal-dismiss]').forEach(function(btn){");
    lines.push("      btn.addEventListener('click', function(){ dialog.close(); });");
    lines.push("    });");
    lines.push("    // A backdrop click's event target is the <dialog> element itself (the");
    lines.push("    // click didn't hit anything inside it) - close only on that, not on");
    lines.push("    // every click, so clicking the dialog's own content never dismisses it.");
    lines.push("    dialog.addEventListener('click', function(e){ if (e.target === dialog) dialog.close(); });");
    lines.push("  });");
    lines.push("})();");
    lines.push("</script>");
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Builds the prompt/code for exactly ONE Corner radius value (at the
  // current fixed Size) - used by the Copy prompt/Copy code dropdown's
  // per-combination "Copy" buttons.
  function buildComboPrompt(radius, opts){
    return buildFullPrompt(Object.assign({}, opts, { radius: { mode: "specific", values: [radius] } }));
  }

  function buildComboCode(radius, opts){
    return buildFullCode(Object.assign({}, opts, { radius: { mode: "specific", values: [radius] } }));
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
    }

    // Gallery-card copy CTA + click-to-navigate (modal.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-modal"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-modal"]');
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

    var modalTypeCards = document.querySelectorAll(".modal-type-card[data-system]");
    modalTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "modal-" + card.dataset.system + ".html";
      if (card.dataset.type) href += "?type=" + encodeURIComponent(card.dataset.type);
      card.addEventListener("click", function(e){
        if (e.target.closest("button, input, select, textarea, a, [role=combobox]")) return; window.ADSNavigation ? window.ADSNavigation.go(href) : (location.href = href); });
      card.addEventListener("keydown", function(e){
        if (e.target !== card) return;
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.ADSNavigation ? window.ADSNavigation.go(href) : (location.href = href);
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

    var matrixContainer = document.querySelector('[data-role="modal-matrix-container"]');
    if (!matrixContainer) return;

    var confirmShortcutsContainer = document.querySelector('[data-role="modal-confirm-shortcuts-container"]');
    if (confirmShortcutsContainer){
      confirmShortcutsContainer.innerHTML = CONFIRM_SHORTCUTS.map(function(c){
        return '<div class="modal-demo-confirm-shortcut-cell">' +
          '<p class="button-matrix-combo-label">' + c.label + "</p>" +
          buildConfirmShortcut(c.key) +
          "</div>";
      }).join("");
    }

    var sizeSelect = document.querySelector('[data-role="modal-size-select"]');
    var radiusMount = document.querySelector('[data-role="modal-radius-mount"]');
    var titleInput = document.querySelector('[data-role="modal-title"]');
    var headingLevelInput = document.querySelector('[data-role="modal-heading-level"]');
    var bodyInput = document.querySelector('[data-role="modal-body"]');
    var showCloseInput = document.querySelector('[data-role="modal-show-close"]');
    var showIconInput = document.querySelector('[data-role="modal-show-icon"]');
    var confirmLabelInput = document.querySelector('[data-role="modal-confirm-label"]');
    var cancelLabelInput = document.querySelector('[data-role="modal-cancel-label"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    // opts: { sizeKey, radius, title, body, showClose, showIcon, confirmLabel,
    // cancelLabel, noFooter, scrollable, noClose, loading, error, illustrative }
    // noFooter/scrollable/noClose/loading/error are independent booleans
    // (see the SCENARIOS comment) - buildMatrixSection below fixes them per
    // row; showClose/showIcon/confirmLabel/cancelLabel are global properties
    // applied the same way across every row, same as Alert/Toast's showIcon.
    function buildModalField(typeKey, opts){
      opts = opts || {};
      var tabindexAttr = opts.illustrative ? ' tabindex="-1"' : "";
      var radiusCss = radiusCssFor(opts.radius);
      var hideClose = opts.showClose === false || opts.noClose;
      var closeHtml = hideClose ? "" : '<button type="button" class="modal-demo-close" data-contract-part="close" aria-label="Close"' + tabindexAttr + ">&times;</button>";
      var iconHtml = opts.showIcon ? '<span class="modal-demo-confirm-icon modal-demo-confirm-icon--' + HEADER_ICON_BY_TYPE[typeKey] + '" data-contract-part="icon">' + CONFIRM_ICONS[HEADER_ICON_BY_TYPE[typeKey]] + "</span>" : "";
      var headingTag = HEADING_LEVEL_OPTIONS.some(function(o){ return o.value === opts.headingLevel; }) ? opts.headingLevel : FALLBACK_DEFAULTS.headingLevel;
      var headingStyle = "font-family:var(--type-" + headingTag + "-family);font-size:var(--type-" + headingTag + "-size);font-weight:var(--type-" + headingTag + "-weight);line-height:var(--type-" + headingTag + "-line-height);letter-spacing:var(--type-" + headingTag + "-tracking);";
      var headerHtml = '<div class="modal-demo-header" data-contract-part="header"><span class="modal-demo-header-titlegroup" data-contract-part="titlegroup">' + iconHtml + "<" + headingTag + ' class="modal-demo-title" data-contract-part="title" style="' + headingStyle + '">' + escapeHtml(opts.title) + "</" + headingTag + "></span>" + closeHtml + "</div>";

      var bodyParts = ['<p style="margin:0;" data-contract-part="body">' + escapeHtml(opts.body) + "</p>"];
      if (opts.scrollable){
        bodyParts.push('<p style="margin:var(--space-8) 0 0;" data-contract-part="details">Additional details continue below to demonstrate scrolling behavior within a fixed-height dialog body.</p>');
      }
      if (opts.error){
        bodyParts.push('<p class="modal-demo-error" data-contract-part="error" role="alert" style="margin:var(--space-8) 0 0;">Something went wrong - the operation could not be completed. Please try again.</p>');
      }
      // The text sits inside its own .modal-demo-scroll box so the body's 16px padding stays OUTSIDE the clipped window: a Scrollable body
      // cuts its text 16px above the bottom edge instead of running to it (the padding used to be part of the clipped box).
      var bodyHtml = '<div data-contract-part="bodywrap" data-contract-name="Body" class="modal-demo-body' + (opts.scrollable ? " modal-demo-body--scrollable" : "") + '">' +
        '<div class="modal-demo-scroll" data-contract-part="scroll" data-contract-name="Text area">' +
        bodyParts.join("") +
        (opts.scrollable ? '<div class="modal-demo-fade" data-contract-part="fade" data-contract-name="Fade" data-contract-kind="container"></div>' : "") +
        "</div></div>";

      var footerHtml = "";
      if (!opts.noFooter){
        var smartPrimary = typeKey === "destructive" ? "Delete" : DEFAULT_CONFIRM_LABEL;
        var primaryLabel = (opts.confirmLabel && opts.confirmLabel !== DEFAULT_CONFIRM_LABEL) ? opts.confirmLabel : smartPrimary;
        var cancelLabel = opts.cancelLabel || DEFAULT_CANCEL_LABEL;
        var disabledAttr = opts.loading ? " disabled" : "";
        var primaryInner = opts.loading ? '<span class="modal-demo-btn-spinner" data-contract-part="spinner" data-contract-name="Spinner" data-contract-kind="container" aria-hidden="true"></span>' + escapeHtml(primaryLabel) : escapeHtml(primaryLabel);
        footerHtml = '<div class="modal-demo-footer" data-contract-part="footer" data-contract-name="Footer">' +
          '<button type="button" class="modal-demo-btn modal-demo-btn--cancel" data-contract-part="cancel"' + tabindexAttr + disabledAttr + ">" + escapeHtml(cancelLabel) + "</button>" +
          '<button type="button" class="modal-demo-btn modal-demo-btn--primary" data-contract-part="confirm"' + tabindexAttr + disabledAttr + ">" + primaryInner + "</button>" +
          "</div>";
      }

      var dialogClass = "modal-demo-dialog modal-demo-dialog--" + typeKey + " modal-demo-dialog--" + opts.sizeKey;
      var dialogStyle = "border-radius:" + radiusCss + ";max-width:" + (SIZE_MAP[opts.sizeKey] || SIZE_MAP[FALLBACK_DEFAULTS.size]) + "px;";
      return '<div class="modal-demo-scrim"><div class="' + dialogClass + '" role="' + ROLE_BY_TYPE[typeKey] + '" style="' + dialogStyle + '">' +
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

    // No footer/Scrollable/No close/Loading/Error aren't separate checkboxes
    // here - they're the Live Preview matrix's row scenarios (see
    // SCENARIOS), already selectable live via the Workbench's own generic
    // State dropdown (it lists each matrix row by name), the same way
    // Button's Hover/Pressed/Focus/Loading rows are picked rather than
    // toggled. A redundant checkbox here wouldn't drive that selection and
    // would just sit inert.
    function buildMatrixSection(sizeKey, radius, base){
      var rows = SCENARIOS.map(function(scenario){
        var cells = TYPES.map(function(t){
          var opts = Object.assign({}, base, { sizeKey: sizeKey, radius: radius, noFooter: scenario.noFooter, scrollable: scenario.scrollable, noClose: scenario.noClose, loading: scenario.loading, error: scenario.error, illustrative: true });
          return '<td class="button-matrix-cell" data-type-key="' + t.key + '">' + buildModalField(t.key, opts) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + scenario.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead" data-type-key="' + t.key + '">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + optionLabelFor(RADIUS_OPTIONS, radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentBaseInfo(){
      return {
        sizeKey: sizeSelect ? sizeSelect.value : FALLBACK_DEFAULTS.size,
        title: titleInput ? (titleInput.value.trim() || FALLBACK_DEFAULTS.title) : FALLBACK_DEFAULTS.title,
        headingLevel: headingLevelInput ? headingLevelInput.value : FALLBACK_DEFAULTS.headingLevel,
        body: bodyInput ? (bodyInput.value.trim() || FALLBACK_DEFAULTS.body) : FALLBACK_DEFAULTS.body,
        showClose: showCloseInput ? showCloseInput.checked : FALLBACK_DEFAULTS.showClose,
        showIcon: showIconInput ? showIconInput.checked : FALLBACK_DEFAULTS.showIcon,
        confirmLabel: confirmLabelInput ? (confirmLabelInput.value.trim() || FALLBACK_DEFAULTS.confirmLabel) : FALLBACK_DEFAULTS.confirmLabel,
        cancelLabel: cancelLabelInput ? (cancelLabelInput.value.trim() || FALLBACK_DEFAULTS.cancelLabel) : FALLBACK_DEFAULTS.cancelLabel
      };
    }

    function currentSelectionInfo(){
      return Object.assign({ radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius]) }, currentBaseInfo());
    }

    function render(){
      var base = currentBaseInfo();
      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      radii.forEach(function(radius){
        html += buildMatrixSection(base.sizeKey, radius, base);
        combos.push({ radius: radius, label: optionLabelFor(RADIUS_OPTIONS, radius) });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.radius, base); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.radius, base); });
    }

    var propertyMultiSelects = {};
    if (radiusMount && window.createMultiSelect){
      propertyMultiSelects.radius = window.createMultiSelect({
        root: radiusMount,
        options: RADIUS_OPTIONS,
        defaultSelected: [FALLBACK_DEFAULTS.radius],
        ariaLabel: "Corner radius options",
        labelledBy: "modal-radius-dropdown-label",
        onChange: render
      });
    }

    if (sizeSelect){
      sizeSelect.addEventListener("change", render);
    }
    if (titleInput){
      titleInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (headingLevelInput){
      headingLevelInput.addEventListener("change", render);
    }
    if (bodyInput){
      bodyInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (showCloseInput){
      showCloseInput.addEventListener("change", render);
    }
    if (showIconInput){
      showIconInput.addEventListener("change", render);
    }
    if (confirmLabelInput){
      confirmLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (cancelLabelInput){
      cancelLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }

    render();

    // Landing here with a ?type= query param (e.g. modal-default.html?type=destructive)
    // should visibly land ON that type's column of the Live Preview matrix,
    // not just generically at the top of the page looking identical to what
    // the Default card's click produces - scroll to it and pulse a brief
    // highlight so the click clearly went somewhere specific.
    (function jumpToRequestedType(){
      var params = new URLSearchParams(window.location.search);
      var typeKey = params.get("type");
      if (!typeKey || !TYPES.some(function(t){ return t.key === typeKey; })) return;
      var targets = matrixContainer.querySelectorAll('[data-type-key="' + typeKey + '"]');
      if (!targets.length) return;
      targets[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      // Stays applied - not removed on a timer - so the distinction is
      // still visible in a still screenshot taken any time after landing,
      // not just during the first couple seconds. Naturally clears the
      // next time render() rebuilds the matrix (a property changes).
      targets.forEach(function(el){ el.classList.add("is-jump-target"); });
    })();
  });
})();
