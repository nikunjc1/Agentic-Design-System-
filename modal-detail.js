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
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>',
    confirm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><line x1="12" y1="16.5" x2="12" y2="16.5"/></svg>'
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
    return '<div class="modal-demo-scrim" style="padding:12px;"><div class="modal-demo-dialog modal-demo-dialog--default" style="max-width:220px;border-radius:8px;">' +
      '<div class="modal-demo-body" style="padding-top:16px;">' + headerHtml + "</div>" +
      footerHtml +
      "</div></div>";
  }

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "destructive", label: "Destructive" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "no-footer", label: "No footer" },
    { key: "scrollable", label: "Scrollable" },
    { key: "no-close", label: "No close" }
  ];

  var FULL_SPEC = {
    default: { purpose: "A neutral dialog for standard confirmations and focused tasks - the primary action button uses this system's brand red, same as a standard Primary button." },
    destructive: { purpose: "Used for irreversible or dangerous confirmations, like deleting data - the same dialog structure as Default, but the primary action button uses the fixed danger-red token and typically reads \"Delete\" instead of \"Confirm\"." }
  };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Primary action button color per type - Default uses the brand-customizable
  // --red-* tokens, Destructive uses the fixed --danger-* tokens so a Delete
  // action always reads as red regardless of whatever brand color is saved
  // on the Colors page (same rule Button's own Destructive type follows).
  function liveCssFor(typeKey){
    if (typeKey === "destructive"){
      return {
        primaryBg: getCssVar("--danger-500", "#FF031A"),
        primaryHoverBg: getCssVar("--danger-600", "#D80016")
      };
    }
    return {
      primaryBg: getCssVar("--red-500", "#FF031A"),
      primaryHoverBg: getCssVar("--red-600", "#D80016")
    };
  }

  // Size -> dialog max-width (px) - a literal lookup, not formula-derived,
  // same convention as SIZE_SCALE in group-button-detail.js, so Copy Code
  // reproduces exactly what the Live Preview matrix is showing.
  var SIZE_MAP = { small: 320, medium: 440, large: 560 };
  var SIZE_OPTIONS = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" }
  ];
  var RADIUS_OPTIONS = [
    { value: "0", label: "0px - Sharp" },
    { value: "4", label: "4px - Compact" },
    { value: "8", label: "8px - Balanced" },
    { value: "12", label: "12px - Soft" },
    { value: "9999", label: "Full - Pill" }
  ];
  var FALLBACK_DEFAULTS = { size: "medium", radius: "8" };
  var DEFAULT_TITLE = "Delete this file?";
  var DEFAULT_BODY = "This action cannot be undone.";

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
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var sizeKey = selectionInfo.sizeKey || FALLBACK_DEFAULTS.size;
    var title = selectionInfo.title || DEFAULT_TITLE;
    var body = selectionInfo.body || DEFAULT_BODY;
    var showClose = selectionInfo.showClose !== undefined ? selectionInfo.showClose : true;

    var lines = [];
    lines.push("Create a complete Modal component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable dialog component controlled by properties (type, state, size, radius) - a dialog box shown above a dimmed page backdrop (scrim), blocking interaction with the rest of the page until dismissed or actioned. It has a title bar (with an optional close \"x\"), a body area for content, and usually a footer with Cancel/primary-action buttons.");
    lines.push("");
    lines.push("Types (" + TYPES.length + "):");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
      lines.push("  Primary action button: background:" + css.primaryBg + "; Hover: background:" + css.primaryHoverBg + ";");
    });
    if (selectionInfo.typeFilter){
      var filteredType = TYPES.filter(function(t){ return t.key === selectionInfo.typeFilter; })[0];
      lines.push("");
      lines.push("This card's live example commits specifically to the " + (filteredType ? filteredType.label : selectionInfo.typeFilter) + " type - generate that type first, though the full component still supports all " + TYPES.length + " listed above.");
    }
    lines.push("");
    lines.push("States (4, structural):");
    lines.push("- Default: title bar with close X, body, and a footer with Cancel/primary-action buttons.");
    lines.push("- No footer: title bar with close X and body only - a purely informational dialog, no footer action buttons.");
    lines.push("- Scrollable: body content has a fixed max-height with a fade-to-transparent gradient cueing more content below - footer still present.");
    lines.push("- No close: title bar has NO close X, forcing the user to pick a footer action - common for critical confirmations.");
    lines.push("");
    var sizePx = SIZE_MAP[sizeKey] || SIZE_MAP[FALLBACK_DEFAULTS.size];
    lines.push("Size: " + optionLabelFor(SIZE_OPTIONS, sizeKey) + " - controls the dialog's max-width (" + sizePx + "px). Other options: " + SIZE_OPTIONS.map(function(o){ return o.label + " (" + SIZE_MAP[o.value] + "px)"; }).join(" / ") + ".");
    lines.push("");
    lines.push(propertyPromptLine("Corner radius", radiusInfo, RADIUS_OPTIONS));
    lines.push("");
    lines.push("Component properties: Title (text, e.g. \"" + title + "\"); Body text (text, e.g. \"" + body + "\"); Show close button (boolean toggle, default on - when off, the header renders with no close X, the same visual result as the No-close state but driven as a property rather than a fixed state).");
    lines.push("Show close button is currently: " + (showClose ? "on" : "off") + ".");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var radiusInfo = selectionInfo.radius || selectionMode(null, RADIUS_OPTIONS);
    var sizeKey = selectionInfo.sizeKey || FALLBACK_DEFAULTS.size;
    var title = selectionInfo.title || DEFAULT_TITLE;
    var body = selectionInfo.body || DEFAULT_BODY;
    var showClose = selectionInfo.showClose !== undefined ? selectionInfo.showClose : true;

    var graphite900 = getCssVar("--graphite-900", "#15171A");
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var line = getCssVar("--line", "rgba(255,255,255,0.08)");
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var textMid = getCssVar("--text-mid", "#A7ABB2");
    var textDim = getCssVar("--text-dim", "#64686F");

    var lines = [];
    lines.push("/* Agentic Design System - Modal component */");
    lines.push(".modal-scrim{ box-sizing:border-box; position:fixed; inset:0; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(0,0,0,0.55); z-index:1000; }");
    lines.push('.modal-dialog{ box-sizing:border-box; width:100%; background:' + graphite900 + "; border:1px solid " + lineStrong + '; box-shadow:0 24px 48px rgba(0,0,0,0.5); display:flex; flex-direction:column; overflow:hidden; }');
    lines.push("");
    lines.push("/* Size - controls dialog max-width */");
    SIZE_OPTIONS.forEach(function(o){
      lines.push(".modal-dialog--" + o.value + "{ max-width:" + SIZE_MAP[o.value] + "px; }");
    });
    lines.push("");
    var radiiToEmit = radiusInfo.mode === "all" ? RADIUS_OPTIONS.map(function(o){ return o.value; }) : radiusInfo.values;
    lines.push(radiusInfo.mode === "all"
      ? "/* Corner radius (5 options) - not chosen yet, default is 8px */"
      : "/* Corner radius - explicitly chosen: " + radiusInfo.values.map(function(v){ return optionLabelFor(RADIUS_OPTIONS, v); }).join(", ") + " */");
    radiiToEmit.forEach(function(radius){
      lines.push(".modal-dialog--radius-" + radiusClassSuffix(radius) + "{ border-radius:" + radiusCssFor(radius) + "; }");
    });
    lines.push("");
    lines.push(".modal-header{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:16px 20px; border-bottom:1px solid " + line + "; }");
    lines.push('.modal-title{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:16px; font-weight:600; color:' + textHi + "; margin:0; }");
    lines.push(".modal-close{ flex:none; width:20px; height:20px; background:none; border:none; color:" + textDim + "; cursor:pointer; padding:0; }");
    lines.push('.modal-body{ padding:16px 20px; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:14px; color:' + textMid + "; position:relative; }");
    lines.push(".modal-body--scrollable{ max-height:64px; overflow:hidden; }");
    lines.push(".modal-fade{ position:absolute; left:0; right:0; bottom:0; height:32px; background:linear-gradient(to bottom, transparent, " + graphite900 + "); }");
    lines.push(".modal-footer{ display:flex; justify-content:flex-end; gap:8px; padding:12px 20px; border-top:1px solid " + line + "; }");
    lines.push('.modal-btn{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:13px; font-weight:600; padding:8px 16px; border-radius:4px; cursor:pointer; border:1.5px solid transparent; }');
    lines.push(".modal-btn--cancel{ background:transparent; border-color:" + lineStrong + "; color:" + textHi + "; }");
    lines.push(".modal-btn--primary{ color:#FFFFFF; }");
    lines.push("");
    lines.push("/* Types (" + TYPES.length + ") - primary action button color per type */");
    TYPES.forEach(function(t){
      var css = liveCssFor(t.key);
      lines.push(".modal-dialog--" + t.key + " .modal-btn--primary{ background:" + css.primaryBg + "; }");
      lines.push(".modal-dialog--" + t.key + " .modal-btn--primary:hover{ background:" + css.primaryHoverBg + "; }");
    });
    lines.push("");

    var exampleRadius = radiusInfo.mode === "all" ? FALLBACK_DEFAULTS.radius : radiusInfo.values[0];
    var typesToRender = selectionInfo.typeFilter ? TYPES.filter(function(t){ return t.key === selectionInfo.typeFilter; }) : TYPES;
    lines.push("<!-- Example usage - " + (selectionInfo.typeFilter ? "the " + (typesToRender[0] ? typesToRender[0].label : selectionInfo.typeFilter) + " type only" : "one per type") + ", at " + optionLabelFor(SIZE_OPTIONS, sizeKey) + " size" + (radiusInfo.mode === "specific" ? ", at the explicitly chosen radius" : "") + " -->");
    typesToRender.forEach(function(t){
      var primaryLabel = t.key === "destructive" ? "Delete" : "Confirm";
      lines.push('<div class="modal-scrim">');
      lines.push('  <div class="modal-dialog modal-dialog--' + t.key + " modal-dialog--" + sizeKey + " modal-dialog--radius-" + radiusClassSuffix(exampleRadius) + '" style="border-radius:' + radiusCssFor(exampleRadius) + ';">');
      lines.push('    <div class="modal-header">');
      lines.push('      <p class="modal-title">' + escapeHtml(title) + "</p>");
      if (showClose) lines.push('      <button type="button" class="modal-close" aria-label="Close">&times;</button>');
      lines.push("    </div>");
      lines.push('    <div class="modal-body"><p>' + escapeHtml(body) + "</p></div>");
      lines.push('    <div class="modal-footer">');
      lines.push('      <button type="button" class="modal-btn modal-btn--cancel">Cancel</button>');
      lines.push('      <button type="button" class="modal-btn modal-btn--primary">' + primaryLabel + "</button>");
      lines.push("    </div>");
      lines.push("  </div>");
      lines.push("</div>");
    });
    return lines.join("\n");
  }

  // Builds the prompt/code for exactly ONE Corner radius value (at the
  // current fixed Size) - used by the Copy prompt/Copy code dropdown's
  // per-combination "Copy" buttons.
  function buildComboPrompt(sizeKey, radius, title, body, showClose){
    return buildFullPrompt({
      radius: { mode: "specific", values: [radius] },
      sizeKey: sizeKey,
      title: title,
      body: body,
      showClose: showClose
    });
  }

  function buildComboCode(sizeKey, radius, title, body, showClose){
    return buildFullCode({
      radius: { mode: "specific", values: [radius] },
      sizeKey: sizeKey,
      title: title,
      body: body,
      showClose: showClose
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
    var bodyInput = document.querySelector('[data-role="modal-body"]');
    var showCloseInput = document.querySelector('[data-role="modal-show-close"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildModalField(typeKey, stateKey, sizeKey, radius, title, body, showClose){
      var radiusCss = radiusCssFor(radius);
      var hideClose = !showClose || stateKey === "no-close";
      var closeHtml = hideClose ? "" : '<button type="button" class="modal-demo-close" aria-label="Close" tabindex="-1">&times;</button>';
      var headerHtml = '<div class="modal-demo-header"><span class="modal-demo-title">' + escapeHtml(title) + "</span>" + closeHtml + "</div>";

      var bodyHtml;
      if (stateKey === "scrollable"){
        bodyHtml = '<div class="modal-demo-body modal-demo-body--scrollable">' +
          '<p style="margin:0;">' + escapeHtml(body) + "</p>" +
          '<p style="margin:8px 0 0;">Additional details continue below to demonstrate scrolling behavior within a fixed-height dialog body.</p>' +
          '<div class="modal-demo-fade"></div>' +
          "</div>";
      } else {
        bodyHtml = '<div class="modal-demo-body"><p style="margin:0;">' + escapeHtml(body) + "</p></div>";
      }

      var footerHtml = "";
      if (stateKey !== "no-footer"){
        var primaryLabel = typeKey === "destructive" ? "Delete" : "Confirm";
        footerHtml = '<div class="modal-demo-footer">' +
          '<button type="button" class="modal-demo-btn modal-demo-btn--cancel" tabindex="-1">Cancel</button>' +
          '<button type="button" class="modal-demo-btn modal-demo-btn--primary" tabindex="-1">' + primaryLabel + "</button>" +
          "</div>";
      }

      var dialogClass = "modal-demo-dialog modal-demo-dialog--" + typeKey + " modal-demo-dialog--" + sizeKey;
      var dialogStyle = "border-radius:" + radiusCss + ";max-width:" + (SIZE_MAP[sizeKey] || SIZE_MAP[FALLBACK_DEFAULTS.size]) + "px;";
      return '<div class="modal-demo-scrim"><div class="' + dialogClass + '" style="' + dialogStyle + '">' +
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

    function buildMatrixSection(sizeKey, radius, title, body, showClose){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell" data-type-key="' + t.key + '">' + buildModalField(t.key, state.key, sizeKey, radius, title, body, showClose) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead" data-type-key="' + t.key + '">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + optionLabelFor(RADIUS_OPTIONS, radius) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        radius: selectionMode(propertyMultiSelects.radius, RADIUS_OPTIONS, [FALLBACK_DEFAULTS.radius]),
        sizeKey: sizeSelect ? sizeSelect.value : FALLBACK_DEFAULTS.size,
        title: titleInput ? (titleInput.value.trim() || DEFAULT_TITLE) : DEFAULT_TITLE,
        body: bodyInput ? (bodyInput.value.trim() || DEFAULT_BODY) : DEFAULT_BODY,
        showClose: showCloseInput ? showCloseInput.checked : true
      };
    }

    function render(){
      var sizeKey = sizeSelect ? sizeSelect.value : FALLBACK_DEFAULTS.size;
      var title = titleInput ? (titleInput.value.trim() || DEFAULT_TITLE) : DEFAULT_TITLE;
      var body = bodyInput ? (bodyInput.value.trim() || DEFAULT_BODY) : DEFAULT_BODY;
      var showClose = showCloseInput ? showCloseInput.checked : true;

      var radii = selectedOrDefault(propertyMultiSelects.radius, RADIUS_OPTIONS, FALLBACK_DEFAULTS.radius);

      var html = "";
      var combos = [];
      radii.forEach(function(radius){
        html += buildMatrixSection(sizeKey, radius, title, body, showClose);
        combos.push({ radius: radius, sizeKey: sizeKey, label: optionLabelFor(RADIUS_OPTIONS, radius), title: title, body: body, showClose: showClose });
      });
      matrixContainer.innerHTML = html;

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, combos, function(c){ return buildComboPrompt(c.sizeKey, c.radius, c.title, c.body, c.showClose); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, combos, function(c){ return buildComboCode(c.sizeKey, c.radius, c.title, c.body, c.showClose); });
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
    if (bodyInput){
      bodyInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (showCloseInput){
      showCloseInput.addEventListener("change", render);
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
