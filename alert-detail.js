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
  // so each icon inherits its type's accent color from the .alert-demo-banner
  // modifier class it sits inside, rather than hard-coding a fill per icon.
  var ICONS = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="11" x2="12" y2="16"></line><line x1="12" y1="7.5" x2="12" y2="7.51"></line></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><polyline points="8 12.5 10.5 15 16 9"></polyline></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 4 L21 19 L3 19 Z"></path><line x1="12" y1="10" x2="12" y2="14"></line><line x1="12" y1="16.5" x2="12" y2="16.51"></line></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>'
  };
  var CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>';

  var TYPES = [
    { key: "info", label: "Info" },
    { key: "success", label: "Success" },
    { key: "warning", label: "Warning" },
    { key: "error", label: "Error" }
  ];
  // info/success are non-urgent (role="status", polite) - warning/error are
  // urgent enough to interrupt (role="alert", implicitly assertive/atomic).
  var ROLE_BY_TYPE = { info: "status", success: "status", warning: "alert", error: "alert" };
  // Dismissible, With action and Loading are independent boolean properties
  // (Customize panel checkboxes), not mutually-exclusive states - they
  // combine freely on the live Showcase example. This list only curates a
  // handful of representative combinations for the side-by-side Live
  // Preview matrix, the same way Button's Compare-states rows are
  // illustrative examples rather than an exhaustive cross-product.
  var SCENARIOS = [
    { key: "default", label: "Default", dismissible: false, withAction: false, loading: false },
    { key: "dismissible", label: "Dismissible", dismissible: true, withAction: false, loading: false },
    { key: "with-action", label: "With action", dismissible: false, withAction: true, loading: false },
    { key: "dismissible-with-action", label: "Dismissible + With action", dismissible: true, withAction: true, loading: false },
    { key: "loading", label: "Loading", dismissible: false, withAction: false, loading: true }
  ];

  var FULL_SPEC = {
    info: { purpose: "A neutral informational message - status updates, tips, and other non-urgent notices." },
    success: { purpose: "Confirms a positive outcome - a save, a submit, or another action completing as expected." },
    warning: { purpose: "Flags something that needs attention before it becomes a problem." },
    error: { purpose: "Reports a failure or invalid state that is blocking progress." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // Returns the type's accent color only - used for the icon, the title
  // text and the left-border accent. Every type shares the same neutral
  // --graphite-800 background, so only the icon/title/border ever carry
  // the semantic color, keeping the banner itself visually calm.
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
    var graphite800 = getCssVar("--graphite-800", "#F1F1EE");
    var accentMap = { info: blue500, success: green500, warning: amber500, error: danger500 };
    return { accent: accentMap[typeKey], background: graphite800 };
  }

  // Corner radius option list - same value scale as the Button and Group
  // Button systems, shared between the page's own multi-select dropdown and
  // the Copy Prompt/Copy Code generators below.
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
    title: "Update available",
    headingLevel: "h6",
    description: "A new version is ready to install.",
    showTitle: true,
    showDescription: true,
    showIcon: true,
    dismissible: false,
    withAction: false,
    actionLabel: "Update now",
    loading: false
  };

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
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
      loading: pick("loading")
    };
  }

  function buildFullPrompt(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push("Create a complete Alert component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, radius, dismissible, with action, loading) - an inline banner/message block embedded in page content (not a floating overlay - that's Toast's job, placed top/bottom-corner and auto-dismissing; Alert stays put until its own Dismissible control removes it). It sits flush in the page flow, full width of its container, with a colored icon, title, optional description, and optional dismiss/action controls.");
    lines.push("");
    lines.push("Types (4):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose + " Role: role=\"" + ROLE_BY_TYPE[t.key] + "\" (" + (ROLE_BY_TYPE[t.key] === "alert" ? "implicitly assertive/atomic - announced immediately, interrupting other screen-reader output" : "implicitly polite - announced without interrupting") + "). Don't re-announce an alert that's already mounted; only a genuinely new message should re-trigger the live region.");
      lines.push("  Accent color (icon, title text, left border): " + css.accent);
      lines.push("  Background: " + css.background + " - ONE consistent background across every type, never tinted per type. Left border: 3px solid the accent color. Only the icon, title and left border ever carry the semantic color - severity is never conveyed by color alone, since the icon shape and text already say it in words.");
    });
    lines.push("");
    lines.push("Configuration properties (independent booleans - combine freely, e.g. Dismissible + With action together, not mutually exclusive named states):");
    lines.push("- Show title (boolean, default checked).");
    lines.push("- Show description (boolean, default checked) - unchecking both Show title and Show description is invalid; always keep at least one visible.");
    lines.push("- Show icon (boolean, default checked) - a colored status icon matching the alert's type, vertically centered with the first line of text.");
    lines.push("- Dismissible (boolean, default unchecked) - adds a trailing close (x) icon button; accessible name \"Dismiss, {type} alert\"; keyboard-operable (Enter/Space, real <button>); removing it must not steal focus silently - move focus to the next logical control.");
    lines.push("- With action (boolean, default unchecked) - adds an inline text-style action button after the description, labeled by the Action label property (default \"" + FALLBACK_DEFAULTS.actionLabel + "\"); a real <button>, fully keyboard accessible with a visible focus indicator; show a loading/disabled state on it while an async action is pending, and guard against duplicate submissions from repeated activation.");
    lines.push("- Loading (boolean, default unchecked) - swaps the status icon for a spinner in the same slot (only when Show icon is also on); use for an alert reporting an in-progress operation.");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS) + " Applied to the whole banner.");
    lines.push("");
    lines.push("Component properties: Corner radius; Title (text, default \"" + FALLBACK_DEFAULTS.title + "\"); Description (text, default \"" + FALLBACK_DEFAULTS.description + "\"); Show title; Show description; Show icon; Dismissible; With action; Action label (text, default \"" + FALLBACK_DEFAULTS.actionLabel + "\", only rendered while With action is on); Loading.");
    lines.push("Current values - Title: \"" + info.title + "\" (" + (info.showTitle ? "shown" : "hidden") + "), Description: \"" + info.description + "\" (" + (info.showDescription ? "shown" : "hidden") + "), Show icon: " + (info.showIcon ? "yes" : "no") + ", Action label when With action is on: \"" + info.actionLabel + "\".");
    lines.push("");
    lines.push("Behavior notes (Alert is a static inline block on this static demo - these describe the real component's intended behavior, not a toggle on this page): this component does not auto-dismiss itself - Warning and Error in particular should stay put until the user acts or the underlying condition resolves, never timing out on their own. If a product wraps Alert with its own auto-hide timer anyway, pause that timer while the banner has hover or keyboard focus, and never auto-hide an Error that requires acknowledgement.");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Alert component */");
    lines.push(".alert-demo-banner{ box-sizing:border-box; display:flex; align-items:flex-start; gap:var(--space-12); padding:var(--space-14) var(--space-16); background:var(--graphite-800); max-width:var(--dimension-420); }");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push(".alert-demo-banner--" + t.key + "{ border-inline-start:3px solid " + css.accent + "; }");
    });
    lines.push(".alert-demo-icon{ flex:none; width:var(--dimension-20); height:var(--dimension-20); margin-top:var(--space-1); }");
    lines.push(".alert-demo-spinner{ flex:none; box-sizing:border-box; width:var(--dimension-20); height:var(--dimension-20); margin-top:var(--space-1); border-radius:var(--radius-full); border:2px solid color-mix(in srgb, currentColor 30%, transparent); border-top-color:currentColor; animation:spin-demo-rotate 0.8s linear infinite; }");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push(".alert-demo-banner--" + t.key + " .alert-demo-icon, .alert-demo-banner--" + t.key + " .alert-demo-spinner{ color:" + css.accent + "; }");
    });
    lines.push(".alert-demo-body{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:var(--space-4); text-align: start; }");
    lines.push('.alert-demo-title{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-selected-weight); color:var(--text-hi); margin:0; max-width:var(--dimension-260); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push('.alert-demo-description{ font-family:var(--font-body); font-size:var(--type-body-size); color:var(--text-mid); margin:0; max-width:var(--dimension-260); overflow-wrap:anywhere; }');
    lines.push(".alert-demo-close{ flex:none; width:var(--dimension-16); height:var(--dimension-16); background:none; border:none; color:var(--text-dim); cursor:pointer; padding:0; margin-inline-start:auto; }");
    lines.push('.alert-demo-action{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-selected-weight); color:var(--red-400); background:none; border:none; cursor:pointer; padding:0; text-decoration:underline; align-self:flex-start; margin-top:var(--space-2); flex:none; white-space:nowrap; }');
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    var info = resolveInfo(selectionInfo);
    var radiusInfo = info.radius;

    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    lines.push("<!-- Example usage - one per type, current configuration" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen corner radius" : "") + " -->");
    TYPES.forEach(function(t){
      lines.push(buildAlertField(t.key, { radius: exampleRadius, title: info.title, description: info.description, showTitle: info.showTitle, showDescription: info.showDescription, showIcon: info.showIcon, dismissible: info.dismissible, withAction: info.withAction, actionLabel: info.actionLabel, loading: info.loading }));
    });
    lines.push("");
    lines.push("<!-- Example usage - Dismissible + With action combined (Info type), proving the two combine rather than being mutually exclusive -->");
    lines.push(buildAlertField("info", { radius: exampleRadius, title: info.title, description: info.description, showTitle: info.showTitle, showDescription: info.showDescription, showIcon: info.showIcon, dismissible: true, withAction: true, actionLabel: info.actionLabel, loading: false }));
    lines.push("");
    lines.push("<!-- Example usage - Loading (Info type) -->");
    lines.push(buildAlertField("info", { radius: exampleRadius, title: info.title, description: info.description, showTitle: info.showTitle, showDescription: info.showDescription, showIcon: info.showIcon, dismissible: false, withAction: false, actionLabel: info.actionLabel, loading: true }));
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  // Renders one .alert-demo-banner. Dismissible/With action/Loading are
  // independent booleans on opts, combined freely (not mutually exclusive
  // named states) - see the "Important" note in buildFullPrompt.
  // Foundation audit UX10 - illustrative=true (the side-by-side comparison
  // matrix) keeps Dismiss/Undo out of the Tab sequence without removing
  // them (or their accessible name) from the accessibility tree; the
  // exported Copy code example (illustrative=false/omitted) stays real,
  // operable markup.
  function buildAlertField(typeKey, opts){
    opts = opts || {};
    var tabindexAttr = opts.illustrative ? ' tabindex="-1"' : "";
    var radiusCss = radiusCssFor(opts.radius);
    var showIcon = opts.showIcon !== false;
    var iconHtml = !showIcon ? "" : opts.loading
      ? '<span class="alert-demo-spinner" data-contract-part="spinner" data-contract-name="Spinner" data-contract-kind="container" aria-hidden="true"></span>'
      : '<span class="alert-demo-icon" data-contract-part="icon">' + ICONS[typeKey] + "</span>";
    // The title renders as the real, semantic heading tag for whichever
    // Typography Foundation level is selected (not a styled <p>), with its
    // typography set inline from that level's own tokens - the same
    // var(--type-hN-*) references this system's own h1-h6 CSS classes use,
    // so this traces back to a real, bound Figma variable once exported,
    // not a hardcoded or free-chosen size.
    var headingTag = HEADING_LEVEL_OPTIONS.some(function(o){ return o.value === opts.headingLevel; }) ? opts.headingLevel : FALLBACK_DEFAULTS.headingLevel;
    var headingStyle = "font-family:var(--type-" + headingTag + "-family);font-size:var(--type-" + headingTag + "-size);font-weight:var(--type-" + headingTag + "-weight);line-height:var(--type-" + headingTag + "-line-height);letter-spacing:var(--type-" + headingTag + "-tracking);";
    var titleHtml = (opts.showTitle === false) ? "" : "<" + headingTag + ' class="alert-demo-title" data-contract-part="title" style="' + headingStyle + '">' + escapeHtml(opts.title) + "</" + headingTag + ">";
    var descriptionHtml = (opts.showDescription === false) ? "" : '<p class="alert-demo-description" data-contract-part="description">' + escapeHtml(opts.description) + "</p>";
    var bodyHtml = '<div class="alert-demo-body" data-contract-part="body">' + titleHtml + descriptionHtml + "</div>";
    // Action (if any) sits beside the content; Close (if any) always pins to
    // the far right via its own auto margin - true regardless of which of
    // the two is present, matching the "Close stays top-right, consistently
    // across variants" recommendation even when both appear together.
    var trailingHtml = "";
    if (opts.withAction){
      trailingHtml += '<button type="button" class="alert-demo-action" data-contract-part="action" data-contract-name="Action"' + tabindexAttr + ">" + escapeHtml(opts.actionLabel || FALLBACK_DEFAULTS.actionLabel) + "</button>";
    }
    if (opts.dismissible){
      trailingHtml += '<button type="button" class="alert-demo-close" data-contract-part="close" data-contract-name="Close"' + tabindexAttr + ' aria-label="Dismiss, ' + typeKey + ' alert">' + CLOSE_ICON + "</button>";
    }
    return '<div class="alert-demo-banner alert-demo-banner--' + typeKey + '" role="' + ROLE_BY_TYPE[typeKey] + '" style="border-radius:' + radiusCss + ';">' + iconHtml + bodyHtml + trailingHtml + "</div>";
  }

  // Builds the prompt/code for exactly ONE Corner radius value, fully
  // resolved (never "ask the question") - used by the Copy prompt/Copy code
  // dropdown's per-combination "Copy" buttons.
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

    // Gallery-card copy CTA + click-to-navigate (alert.html's listing card)
    // - separate data-role from every other system's own copy roles so no
    // script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-alert"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-alert"]');
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
    var alertTypeCards = document.querySelectorAll(".alert-type-card[data-system]");
    alertTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "alert-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="alert-matrix-container"]');
    if (!matrixContainer) return;

    var radiusMount = document.querySelector('[data-role="alert-radius-mount"]');
    var titleInput = document.querySelector('[data-role="alert-title"]');
    var headingLevelInput = document.querySelector('[data-role="alert-heading-level"]');
    var descriptionInput = document.querySelector('[data-role="alert-description"]');
    var showTitleInput = document.querySelector('[data-role="alert-show-title"]');
    var showDescriptionInput = document.querySelector('[data-role="alert-show-description"]');
    var showIconInput = document.querySelector('[data-role="alert-show-icon"]');
    var actionLabelInput = document.querySelector('[data-role="alert-action-label"]');
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

    // Since Alert has no Size property, only Corner radius drives multiple
    // combos - SCENARIOS (a curated set of Dismissible/With action/Loading
    // combinations, see the comment above SCENARIOS) become the rows and
    // TYPES the columns, exactly like group-button-detail.js's
    // buildMatrixSection does with size/radius, just with the "size" axis
    // dropped entirely. Show title/Show description/Show icon apply as a
    // global modifier across every row, same as showIcon always did.
    function buildMatrixSection(radius, base){
      var rows = SCENARIOS.map(function(scenario){
        var cells = TYPES.map(function(t){
          var opts = Object.assign({}, base, { radius: radius, dismissible: scenario.dismissible, withAction: scenario.withAction, loading: scenario.loading, illustrative: true });
          return '<td class="button-matrix-cell">' + buildAlertField(t.key, opts) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + scenario.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + comboLabel(radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    // Dismissible/With action/Loading aren't separate checkboxes here - they're
    // the Live Preview matrix's row scenarios (see SCENARIOS), already
    // selectable live via the Workbench's own generic State dropdown (it
    // lists each matrix row by name), the same way Button's Hover/Pressed/
    // Focus/Loading rows are picked rather than toggled. A redundant
    // checkbox here wouldn't drive that selection and would just sit inert.
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
        labelledBy: "alert-radius-dropdown-label",
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
