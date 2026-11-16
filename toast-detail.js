(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Simple inline SVG icon set - viewBox 0 0 24 24, stroke currentColor,
  // stroke-width 2, fill none - one shape per semantic type. Intentionally
  // close to a typical Alert icon set: both components legitimately share
  // the same 4 semantic icons (Info/Success/Warning/Error).
  var ICONS = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>'
  };
  var CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var TYPES = [
    { key: "info", label: "Info" },
    { key: "success", label: "Success" },
    { key: "warning", label: "Warning" },
    { key: "error", label: "Error" }
  ];
  // info/success are routine (role="status", polite) - warning/error are
  // urgent enough to interrupt (role="alert", implicitly assertive/atomic).
  var ROLE_BY_TYPE = { info: "status", success: "status", warning: "alert", error: "alert" };
  // Dismissible, With action, With progress and Loading are independent
  // boolean properties, not mutually-exclusive states - they combine freely
  // (e.g. Dismissible + With action + With progress together). This list
  // only curates a handful of representative combinations for the
  // side-by-side Live Preview matrix, the same way Button's Compare-states
  // rows are illustrative examples rather than an exhaustive cross-product.
  var SCENARIOS = [
    { key: "default", label: "Default", dismissible: false, withAction: false, withProgress: false, loading: false },
    { key: "dismissible", label: "Dismissible", dismissible: true, withAction: false, withProgress: false, loading: false },
    { key: "with-action", label: "With action", dismissible: false, withAction: true, withProgress: false, loading: false },
    { key: "with-progress", label: "With progress", dismissible: false, withAction: false, withProgress: true, loading: false },
    { key: "all-combined", label: "Dismissible + Action + Progress", dismissible: true, withAction: true, withProgress: true, loading: false },
    { key: "loading", label: "Loading", dismissible: false, withAction: false, withProgress: false, loading: true }
  ];

  var FULL_SPEC = {
    info: { purpose: "Neutral, informational status update - nothing succeeded or failed, it's just worth surfacing." },
    success: { purpose: "Confirms an action completed successfully." },
    warning: { purpose: "Flags something that needs attention but hasn't failed outright." },
    error: { purpose: "Reports that an action failed." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // The card itself is always a solid, neutral, elevated surface - only the
  // icon (and, in the with-progress state, the progress fill) change color
  // per type. This is what keeps a Toast reading as "elevated above the
  // page" rather than tinted like Alert's inline banner.
  function liveCssFor(typeKey){
    if (typeKey === "primary") return {
      rest: "background:var(--button-primary-bg-default);color:var(--button-primary-text-default);",
      hover: "background:var(--button-primary-bg-hover);color:var(--button-primary-text-hover);",
      pressed: "background:var(--button-primary-bg-active);color:var(--button-primary-text-active);"
    };
    var blue500 = getCssVar("--blue-500", "#4F8FE6");
    var green500 = getCssVar("--green-500", "#2FBF6E");
    var amber500 = getCssVar("--amber-500", "#E6A53A");
    var danger500 = getCssVar("--danger-500", "#FF031A");
    var accent = { info: blue500, success: green500, warning: amber500, error: danger500 }[typeKey];
    return {
      card: "background:" + getCssVar("--graphite-850", "#FBFBFA") + ";border:1px solid " + getCssVar("--line-strong", "rgba(255,255,255,0.16)") + ";box-shadow:var(--shadow-xl);",
      icon: "color:" + accent + ";",
      accent: accent
    };
  }

  // Corner radius option list - identical value scale to Group Button /
  // Button / Input, shared between the page's own multi-select dropdown
  // and the Copy Prompt/Copy Code generators below.
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
  var DEFAULT_TITLE = "Update Complete";
  var DEFAULT_DESCRIPTION = "Your-file.pdf was uploaded successfully.";
  var DEFAULT_ACTION_LABEL = "View";
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
    radius: liveRadiusDefault("8"),
    title: DEFAULT_TITLE,
    headingLevel: "h6",
    description: DEFAULT_DESCRIPTION,
    showTitle: true,
    showDescription: true,
    showIcon: true,
    dismissible: false,
    withAction: false,
    actionLabel: DEFAULT_ACTION_LABEL,
    withProgress: false,
    loading: false
  };

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
      title: pick("title"),
      description: pick("description"),
      showTitle: pick("showTitle"),
      showDescription: pick("showDescription"),
      showIcon: pick("showIcon"),
      dismissible: pick("dismissible"),
      withAction: pick("withAction"),
      actionLabel: pick("actionLabel"),
      withProgress: pick("withProgress"),
      loading: pick("loading")
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push("Create a complete Toast (floating notification) component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, radius, dismissible, with action, with progress, loading) - a floating, elevated notification card (solid background, border, drop shadow, fixed ~340px max-width) that appears temporarily to confirm an action or report a status.");
    lines.push("");
    lines.push("It differs from Alert by being a floating overlay element, not inline page content - rendered in a fixed screen corner (default: bottom-right on desktop, bottom-center on mobile), stacked above the page, rather than embedded in the content flow the way Alert is. Max 3 toasts visible at once by default, newest on top; anything beyond that queues.");
    lines.push("");
    lines.push("Types (4, drive only the icon/progress-fill color - the card itself always stays a solid neutral elevated surface):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose + " Icon color: " + css.icon + " Role: role=\"" + ROLE_BY_TYPE[t.key] + "\" (" + (ROLE_BY_TYPE[t.key] === "alert" ? "assertive/atomic" : "polite") + "); don't re-announce the same toast twice.");
    });
    lines.push("Card (same for every type): " + liveCssFor("info").card);
    lines.push("Recommended auto-dismiss duration (not a toggle on this static page): Info/Success 4s, Warning 6s, Error persistent while action is required. Pause the countdown on hover or keyboard focus and resume when it ends. Never let auto-dismiss remove a toast before its content can reasonably be read.");
    lines.push("");
    lines.push("Configuration properties (independent booleans - combine freely, e.g. Dismissible + With action + With progress together, not mutually exclusive named states):");
    lines.push("- Show title (boolean, default checked).");
    lines.push("- Show description (boolean, default checked).");
    lines.push("- Show icon (boolean, default checked) - the semantic type icon, vertically aligned with the title.");
    lines.push("- Dismissible (boolean, default unchecked) - adds a trailing close (x) icon button in the card's top-right corner; accessible name \"Dismiss, {type} toast\"; keyboard-operable.");
    lines.push("- With action (boolean, default unchecked) - adds an inline text-style action button below the description, labeled by the Action label property (default \"" + FALLBACK_DEFAULTS.actionLabel + "\"); show loading/disabled feedback on it while an async action runs, and guard against duplicate activation.");
    lines.push("- With progress (boolean, default unchecked) - adds a thin colored bar along the card's bottom edge. Important distinction: this represents remaining auto-dismiss time, NOT the progress of an actual operation like a file upload - never present a countdown as if it were real task progress, and never present real task progress as a countdown.");
    lines.push("- Loading (boolean, default unchecked) - swaps the status icon for a spinner, for a toast reporting an in-progress operation (e.g. \"Uploading...\"); typically paired with updating the same toast to Success/Error once the operation resolves, rather than spawning a second toast.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to the whole card, with matching inset on the bottom edge so the With-progress bar never pokes out past rounded corners.");
    lines.push("");
    lines.push("Component properties: Corner radius; Title (text, default \"" + FALLBACK_DEFAULTS.title + "\"); Description (text, default \"" + FALLBACK_DEFAULTS.description + "\"); Show title; Show description; Show icon; Dismissible; With action; Action label (text, default \"" + FALLBACK_DEFAULTS.actionLabel + "\", only rendered while With action is on); With progress; Loading.");
    lines.push("Current values - Title: \"" + info.title + "\" (" + (info.showTitle ? "shown" : "hidden") + "), Description: \"" + info.description + "\" (" + (info.showDescription ? "shown" : "hidden") + "), Show icon: " + (info.showIcon ? "yes" : "no") + ", Action label when With action is on: \"" + info.actionLabel + "\".");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Toast (floating notification) component */");
    lines.push(".toast-demo-card{ box-sizing:border-box; position:relative; display:flex; align-items:flex-start; gap:var(--space-12); padding:var(--space-14) var(--space-16); width:var(--dimension-340); background:var(--graphite-850); border:1px solid var(--line-strong); box-shadow:var(--shadow-xl); overflow:hidden; }");
    lines.push(".toast-demo-icon{ flex:none; width:var(--dimension-20); height:var(--dimension-20); margin-top:var(--space-1); }");
    lines.push(".toast-demo-spinner{ flex:none; box-sizing:border-box; width:var(--dimension-20); height:var(--dimension-20); margin-top:var(--space-1); border-radius:var(--radius-full); border:2px solid color-mix(in srgb, currentColor 30%, transparent); border-top-color:currentColor; animation:spin-demo-rotate 0.8s linear infinite; }");
    lines.push(".toast-demo-body{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:var(--space-4); padding-inline-end:var(--space-16); text-align: start; }");
    lines.push('.toast-demo-title{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-selected-weight); color:var(--text-hi); margin:0; max-width:var(--dimension-260); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push('.toast-demo-description{ font-family:var(--font-body); font-size:var(--type-body-size); color:var(--text-mid); margin:0; max-width:var(--dimension-260); overflow-wrap:anywhere; }');
    lines.push(".toast-demo-close{ position:absolute; top:10px; right:10px; width:var(--dimension-16); height:var(--dimension-16); background:none; border:none; color:var(--text-dim); cursor:pointer; padding:0; }");
    lines.push('.toast-demo-action{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-selected-weight); color:var(--red-400); background:none; border:none; cursor:pointer; padding:0; text-decoration:underline; align-self:flex-start; margin-top:var(--space-2); }');
    lines.push(".toast-demo-progress{ position:absolute; left:0; right:0; bottom:0; height:var(--dimension-3); background:var(--graphite-700); }");
    lines.push(".toast-demo-progress-fill{ height:100%; background:currentColor; }");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (8 options) - not chosen yet, default is 8px - applied to the whole card */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " - applied to the whole card */");
    radiiToEmit.forEach(function(radius){
      lines.push(".toast-demo-card--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push("/* Types (4) - color the icon/spinner (and, in With-progress, the fill) only - the card stays neutral */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push(".toast-demo-card--" + t.key + " .toast-demo-icon, .toast-demo-card--" + t.key + " .toast-demo-spinner{ " + css.icon + " }");
      lines.push(".toast-demo-card--" + t.key + " .toast-demo-progress-fill{ " + css.icon + " }");
    });
    lines.push("");
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per type, current configuration" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(buildToastField(t.key, { radius: exampleRadius, title: info.title, description: info.description, showTitle: info.showTitle, showDescription: info.showDescription, showIcon: info.showIcon, dismissible: info.dismissible, withAction: info.withAction, actionLabel: info.actionLabel, withProgress: info.withProgress, loading: info.loading }));
    });
    lines.push("");
    lines.push("<!-- Example usage - Dismissible + With action + With progress combined (Info type), proving they combine rather than being mutually exclusive -->");
    lines.push(buildToastField("info", { radius: exampleRadius, title: info.title, description: info.description, showTitle: info.showTitle, showDescription: info.showDescription, showIcon: info.showIcon, dismissible: true, withAction: true, actionLabel: info.actionLabel, withProgress: true, loading: false }));
    lines.push("");
    lines.push("<!-- Example usage - Loading (Info type) -->");
    lines.push(buildToastField("info", { radius: exampleRadius, title: info.title, description: info.description, showTitle: info.showTitle, showDescription: info.showDescription, showIcon: info.showIcon, dismissible: false, withAction: false, actionLabel: info.actionLabel, withProgress: false, loading: true }));
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Builds the prompt/code for exactly ONE Corner radius value, fully
  // resolved (never "ask the question") - used by the Copy prompt/Copy
  // code dropdown's per-combination "Copy" buttons.
  function buildComboPrompt(radius, opts){
    return buildFullPrompt(Object.assign({}, opts, { radius: { mode: "specific", values: [radius] } }));
  }

  function buildComboCode(radius, opts){
    return buildFullCode(Object.assign({}, opts, { radius: { mode: "specific", values: [radius] } }));
  }

  // Renders one .toast-demo-card. Dismissible/With action/With progress/
  // Loading are independent booleans on opts, combined freely (not mutually
  // exclusive named states) - see the "Important" note in buildFullPrompt.
  // Foundation audit UX10 - illustrative=true (the side-by-side comparison
  // matrix) keeps Dismiss/action out of the Tab sequence without removing
  // them (or their accessible name) from the accessibility tree; the
  // exported Copy code example (illustrative=false/omitted) stays real,
  // operable markup.
  function buildToastField(typeKey, opts){
    opts = opts || {};
    var tabindexAttr = opts.illustrative ? ' tabindex="-1"' : "";
    var radiusCss = radiusCssFor(opts.radius);
    var showIcon = opts.showIcon !== false;
    var iconHtml = !showIcon ? "" : opts.loading
      ? '<span class="toast-demo-spinner" data-contract-part="spinner" data-contract-name="Spinner" data-contract-kind="container" aria-hidden="true"></span>'
      : ICONS[typeKey].replace('<svg ', '<svg class="toast-demo-icon" data-contract-part="icon" ');
    var headingTag = HEADING_LEVEL_OPTIONS.some(function(o){ return o.value === opts.headingLevel; }) ? opts.headingLevel : FALLBACK_DEFAULTS.headingLevel;
    var headingStyle = "font-family:var(--type-" + headingTag + "-family);font-size:var(--type-" + headingTag + "-size);font-weight:var(--type-" + headingTag + "-weight);line-height:var(--type-" + headingTag + "-line-height);letter-spacing:var(--type-" + headingTag + "-tracking);";
    var titleHtml = (opts.showTitle === false) ? "" : "<" + headingTag + ' class="toast-demo-title" data-contract-part="title" style="' + headingStyle + '">' + escapeHtml(opts.title) + "</" + headingTag + ">";
    var descriptionHtml = (opts.showDescription === false) ? "" : '<p class="toast-demo-description" data-contract-part="description">' + escapeHtml(opts.description) + "</p>";
    var actionHtml = opts.withAction ? '<button type="button" class="toast-demo-action" data-contract-part="action" data-contract-name="Action"' + tabindexAttr + ">" + escapeHtml(opts.actionLabel || FALLBACK_DEFAULTS.actionLabel) + "</button>" : "";
    var closeHtml = opts.dismissible ? '<button type="button" class="toast-demo-close" data-contract-part="close" data-contract-name="Close"' + tabindexAttr + ' aria-label="Dismiss, ' + typeKey + ' toast">' + CLOSE_ICON + "</button>" : "";
    var progressHtml = opts.withProgress ? '<div class="toast-demo-progress" data-contract-part="progress" data-contract-name="Progress"><div class="toast-demo-progress-fill" data-contract-kind="container" data-contract-name="Fill" style="width:60%;"></div></div>' : "";
    var bodyHtml = '<div class="toast-demo-body" data-contract-part="body">' + titleHtml + descriptionHtml + actionHtml + "</div>";
    return '<div class="toast-demo-card toast-demo-card--' + typeKey + '" role="' + ROLE_BY_TYPE[typeKey] + '" style="border-radius:' + radiusCss + '">' +
      iconHtml + bodyHtml + closeHtml + progressHtml +
      "</div>";
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
    }

    // Gallery-card copy CTA + click-to-navigate (toast.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-toast"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-toast"]');
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
    var toastTypeCards = document.querySelectorAll(".toast-type-card[data-system]");
    toastTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "toast-" + card.dataset.system + ".html";
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
    // currently selected, a disclosure dropdown listing every value by
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

    var matrixContainer = document.querySelector('[data-role="toast-matrix-container"]');
    if (!matrixContainer) return;

    var radiusMount = document.querySelector('[data-role="toast-radius-mount"]');
    var titleInput = document.querySelector('[data-role="toast-title"]');
    var headingLevelInput = document.querySelector('[data-role="toast-heading-level"]');
    var descriptionInput = document.querySelector('[data-role="toast-description"]');
    var showTitleInput = document.querySelector('[data-role="toast-show-title"]');
    var showDescriptionInput = document.querySelector('[data-role="toast-show-description"]');
    var showIconInput = document.querySelector('[data-role="toast-show-icon"]');
    var actionLabelInput = document.querySelector('[data-role="toast-action-label"]');
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

    // Dismissible/With action/With progress/Loading aren't separate
    // checkboxes here - they're the Live Preview matrix's row scenarios
    // (see SCENARIOS), already selectable live via the Workbench's own
    // generic State dropdown (it lists each matrix row by name), the same
    // way Button's Hover/Pressed/Focus/Loading rows are picked rather than
    // toggled. A redundant checkbox here wouldn't drive that selection and
    // would just sit inert.
    function buildMatrixSection(radius, base){
      var rows = SCENARIOS.map(function(scenario){
        var cells = TYPES.map(function(t){
          var opts = Object.assign({}, base, { radius: radius, dismissible: scenario.dismissible, withAction: scenario.withAction, withProgress: scenario.withProgress, loading: scenario.loading, illustrative: true });
          return '<td class="button-matrix-cell">' + buildToastField(t.key, opts) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + scenario.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentBaseInfo(){
      return {
        title: titleInput ? (titleInput.value.trim() || FALLBACK_DEFAULTS.title) : FALLBACK_DEFAULTS.title,
        headingLevel: headingLevelInput ? headingLevelInput.value : FALLBACK_DEFAULTS.headingLevel,
        description: descriptionInput ? (descriptionInput.value.trim() || FALLBACK_DEFAULTS.description) : FALLBACK_DEFAULTS.description,
        showTitle: showTitleInput ? showTitleInput.checked : FALLBACK_DEFAULTS.showTitle,
        showDescription: showDescriptionInput ? showDescriptionInput.checked : FALLBACK_DEFAULTS.showDescription,
        showIcon: showIconInput ? showIconInput.checked : FALLBACK_DEFAULTS.showIcon,
        actionLabel: actionLabelInput ? (actionLabelInput.value.trim() || FALLBACK_DEFAULTS.actionLabel) : FALLBACK_DEFAULTS.actionLabel
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
        html += buildMatrixSection(radius, base);
        combos.push({ radius: radius, label: comboLabel(radius) });
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
        labelledBy: "toast-radius-dropdown-label",
        onChange: render
      });
    }

    if (titleInput){
      titleInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (headingLevelInput){
      headingLevelInput.addEventListener("change", render);
    }
    if (descriptionInput){
      descriptionInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (showTitleInput){
      showTitleInput.addEventListener("change", render);
    }
    if (showDescriptionInput){
      showDescriptionInput.addEventListener("change", render);
    }
    if (showIconInput){
      showIconInput.addEventListener("change", render);
    }
    if (actionLabelInput){
      actionLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }

    render();
  });
})();
