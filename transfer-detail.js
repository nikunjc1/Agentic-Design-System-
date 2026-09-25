(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "with-search", label: "With search" }
  ];
  var STATES = [
    { key: "rest", label: "Rest" },
    { key: "hover", label: "Hover" },
    { key: "focus", label: "Focused" },
    { key: "disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    "default": "Two plain list panels - available items on the left, chosen items on the right - no search box.",
    "with-search": "Same two-panel layout, but each panel gets its own search input above its list, so a long source or target list can be filtered before moving items."
  };

  // Checkmark icon - reuses this system's real checkbox SVG treatment
  // (see checkbox-detail.js's CHECK_ICON_SVG) rather than inventing a new one.
  var CHECK_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

  // Size -> panel list height (px) - a literal lookup, not formula-derived,
  // same convention as SIZE_MAP in modal-detail.js, so Copy Code reproduces
  // exactly what the Live Preview matrix is showing.
  var SIZE_MAP = { small: 140, "default": 180, large: 220 };
  var SIZE_OPTIONS = [
    { value: "small", label: "Small" },
    { value: "default", label: "Default" },
    { value: "large", label: "Large" }
  ];
  var FALLBACK_DEFAULTS = { size: "default" };
  var DEFAULT_LEFT_TITLE = "Source";
  var DEFAULT_RIGHT_TITLE = "Target";

  // Fixed demo data - 4 source items (2 pre-checked), 2 target items
  // (already moved, unchecked) - same set rendered at every size, the
  // panel height only affects the box, not how many rows are shown.
  var SOURCE_ITEMS = [
    { name: "Alice", checked: true },
    { name: "Bob", checked: false },
    { name: "Carol", checked: true },
    { name: "Dana", checked: false }
  ];
  var TARGET_ITEMS = [
    { name: "Eve", checked: false },
    { name: "Frank", checked: false }
  ];

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function checkedCountLabel(items){
    var checked = items.filter(function(i){ return i.checked; }).length;
    return checked + "/" + items.length;
  }

  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeKey = selectionInfo.sizeKey || FALLBACK_DEFAULTS.size;
    var leftTitle = selectionInfo.leftTitle || DEFAULT_LEFT_TITLE;
    var rightTitle = selectionInfo.rightTitle || DEFAULT_RIGHT_TITLE;

    var lines = [];
    lines.push("Create a complete Transfer component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable dual-list widget controlled by properties (type, state, size, left title, right title) - two side-by-side list panels, an available-items \"" + leftTitle + "\" list on the left and a chosen-items \"" + rightTitle + "\" list on the right, each item with its own checkbox, with center-aligned \">\" / \"<\" arrow buttons between the panels to move checked items from one side to the other. This is a standalone panel widget, not a text-field trigger.");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key]);
    });
    lines.push("");
    lines.push("States (4):");
    lines.push("- Rest: default appearance.");
    lines.push("- Hover: the first source item shows a hover background.");
    lines.push("- Focused: the right (\">\") transfer button shows a visible focus ring.");
    lines.push("- Disabled: the whole widget at reduced opacity (40%), checkboxes and arrow buttons non-interactive.");
    lines.push("");
    lines.push("Size: " + optionLabelFor(SIZE_OPTIONS, sizeKey) + " - controls each panel's list height (" + (SIZE_MAP[sizeKey] || SIZE_MAP[FALLBACK_DEFAULTS.size]) + "px). Other options: " + SIZE_OPTIONS.map(function(o){ return o.label + " (" + SIZE_MAP[o.value] + "px)"; }).join(" / ") + ".");
    lines.push("");
    lines.push("Component properties: Size (dropdown - Small/Default/Large, controls each panel's list height); Left title (text, e.g. \"" + leftTitle + "\"); Right title (text, e.g. \"" + rightTitle + "\").");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var sizeKey = selectionInfo.sizeKey || FALLBACK_DEFAULTS.size;
    var leftTitle = selectionInfo.leftTitle || DEFAULT_LEFT_TITLE;
    var rightTitle = selectionInfo.rightTitle || DEFAULT_RIGHT_TITLE;

    var lines = [];
    lines.push("/* Agentic Design System - Transfer component */");
    lines.push(".transfer-demo-panel{ display:flex; align-items:stretch; gap:8px; }");
    lines.push(".transfer-demo-panel.is-disabled{ opacity:0.4; pointer-events:none; }");
    lines.push("");
    lines.push(".transfer-demo-column{ flex:1 1 0; min-width:140px; display:flex; flex-direction:column; background:var(--graphite-900); border:1px solid var(--line-strong); border-radius:var(--radius-md); overflow:hidden; }");
    lines.push('.transfer-demo-column-title{ display:flex; justify-content:space-between; padding:8px 12px; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:12px; font-weight:600; color:var(--text-hi); background:var(--graphite-800); border-bottom:1px solid var(--line); max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push('.transfer-demo-search{ margin:8px; padding:6px 8px; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:12px; background:var(--graphite-800); border:1px solid var(--line-strong); border-radius:var(--radius-sm); color:var(--text-hi); }');
    lines.push("");
    lines.push("/* Size (3 options) - controls each panel's list height */");
    SIZE_OPTIONS.forEach(function(o){
      lines.push(".transfer-demo-list--" + o.value + "{ height:" + SIZE_MAP[o.value] + "px; }");
    });
    lines.push(".transfer-demo-list{ flex:1 1 auto; overflow-y:auto; padding:4px; display:flex; flex-direction:column; gap:2px; }");
    lines.push("");
    lines.push('.transfer-demo-item{ display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:13px; color:var(--text-hi); cursor:pointer; }');
    lines.push(".transfer-demo-item:hover, .transfer-demo-item.is-hover{ background:var(--graphite-800); }");
    lines.push("");
    lines.push(".transfer-demo-checkbox-input{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }");
    lines.push(".transfer-demo-checkbox{ flex:none; width:16px; height:16px; border-radius:4px; border:1.5px solid var(--line-strong); display:flex; align-items:center; justify-content:center; }");
    lines.push(".transfer-demo-checkbox-input:checked + .transfer-demo-checkbox{ background:var(--red-500); border-color:var(--red-500); }");
    lines.push(".transfer-demo-checkbox-input:focus-visible + .transfer-demo-checkbox{ outline:2px solid var(--red-400); outline-offset:2px; }");
    lines.push(".transfer-demo-checkbox svg{ width:11px; height:11px; color:#FFFFFF; }");
    lines.push("");
    lines.push(".transfer-demo-arrows{ flex:none; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; padding:0 4px; }");
    lines.push(".transfer-demo-arrow-btn{ width:28px; height:28px; border-radius:var(--radius-sm); background:var(--graphite-800); border:1px solid var(--line-strong); color:var(--text-hi); display:flex; align-items:center; justify-content:center; cursor:pointer; }");
    lines.push(".transfer-demo-arrow-btn:hover{ background:var(--graphite-700); }");
    lines.push(".transfer-demo-arrow-btn:focus-visible, .transfer-demo-arrow-btn.is-focus{ outline:2px solid var(--red-400); outline-offset:2px; }");
    lines.push(".transfer-demo-arrow-btn:disabled{ opacity:0.5; cursor:not-allowed; }");
    lines.push("");

    lines.push("<!-- Example usage - one per type, at " + optionLabelFor(SIZE_OPTIONS, sizeKey) + " size -->");
    TYPES.forEach(function(t){
      var hasSearch = t.key === "with-search";
      lines.push('<div class="transfer-demo-panel">');
      lines.push('  <div class="transfer-demo-column">');
      lines.push('    <div class="transfer-demo-column-title"><span>' + escapeHtml(leftTitle) + '</span><span>' + checkedCountLabel(SOURCE_ITEMS) + '</span></div>');
      if (hasSearch) lines.push('    <input type="text" class="transfer-demo-search" placeholder="Search..." />');
      lines.push('    <div class="transfer-demo-list transfer-demo-list--' + sizeKey + '">');
      SOURCE_ITEMS.forEach(function(item){
        var inputAttr = '<input type="checkbox" class="transfer-demo-checkbox-input"' + (item.checked ? " checked" : "") + ' aria-label="' + escapeHtml(item.name) + '" />';
        lines.push('      <label class="transfer-demo-item">' + inputAttr + '<span class="transfer-demo-checkbox' + (item.checked ? " is-checked" : "") + '">' + (item.checked ? CHECK_ICON_SVG : "") + '</span><span>' + item.name + '</span></label>');
      });
      lines.push('    </div>');
      lines.push('  </div>');
      lines.push('  <div class="transfer-demo-arrows">');
      lines.push('    <button type="button" class="transfer-demo-arrow-btn" aria-label="Move checked items right">&gt;</button>');
      lines.push('    <button type="button" class="transfer-demo-arrow-btn" aria-label="Move checked items left">&lt;</button>');
      lines.push('  </div>');
      lines.push('  <div class="transfer-demo-column">');
      lines.push('    <div class="transfer-demo-column-title"><span>' + escapeHtml(rightTitle) + '</span><span>' + TARGET_ITEMS.length + ' items</span></div>');
      if (hasSearch) lines.push('    <input type="text" class="transfer-demo-search" placeholder="Search..." />');
      lines.push('    <div class="transfer-demo-list transfer-demo-list--' + sizeKey + '">');
      TARGET_ITEMS.forEach(function(item){
        var inputAttr = '<input type="checkbox" class="transfer-demo-checkbox-input" aria-label="' + escapeHtml(item.name) + '" />';
        lines.push('      <label class="transfer-demo-item">' + inputAttr + '<span class="transfer-demo-checkbox"></span><span>' + item.name + '</span></label>');
      });
      lines.push('    </div>');
      lines.push('  </div>');
      lines.push('</div>');
    });
    return lines.join("\n");
  }

  // Builds a single .transfer-demo-panel at the given type/state/size, with
  // the given panel titles - used by both the Live Preview matrix and (via
  // buildFullCode above) the Copy code output's shape.
  function buildTransferField(typeKey, stateKey, sizeKey, leftTitle, rightTitle){
    var isDisabled = stateKey === "disabled";
    var hasSearch = typeKey === "with-search";
    var listHeight = SIZE_MAP[sizeKey] || SIZE_MAP[FALLBACK_DEFAULTS.size];
    var searchHtml = hasSearch ? '<input type="text" class="transfer-demo-search" placeholder="Search..." />' : "";

    var sourceRows = SOURCE_ITEMS.map(function(item, i){
      var hoverCls = (stateKey === "hover" && i === 0) ? " is-hover" : "";
      var inputHtml = '<input type="checkbox" class="transfer-demo-checkbox-input"' + (item.checked ? " checked" : "") + (isDisabled ? " disabled" : "") + ' aria-label="' + escapeHtml(item.name) + '" />';
      var checkboxHtml = item.checked
        ? '<span class="transfer-demo-checkbox is-checked">' + CHECK_ICON_SVG + '</span>'
        : '<span class="transfer-demo-checkbox"></span>';
      return '<label class="transfer-demo-item' + hoverCls + '">' + inputHtml + checkboxHtml + '<span>' + item.name + '</span></label>';
    }).join("");

    var targetRows = TARGET_ITEMS.map(function(item){
      var inputHtml = '<input type="checkbox" class="transfer-demo-checkbox-input"' + (isDisabled ? " disabled" : "") + ' aria-label="' + escapeHtml(item.name) + '" />';
      return '<label class="transfer-demo-item">' + inputHtml + '<span class="transfer-demo-checkbox"></span><span>' + item.name + '</span></label>';
    }).join("");

    var leftColumn = '<div class="transfer-demo-column">' +
      '<div class="transfer-demo-column-title"><span>' + escapeHtml(leftTitle) + '</span><span>' + checkedCountLabel(SOURCE_ITEMS) + '</span></div>' +
      searchHtml +
      '<div class="transfer-demo-list" style="height:' + listHeight + 'px;">' + sourceRows + '</div>' +
      '</div>';

    var rightColumn = '<div class="transfer-demo-column">' +
      '<div class="transfer-demo-column-title"><span>' + escapeHtml(rightTitle) + '</span><span>' + TARGET_ITEMS.length + ' items</span></div>' +
      searchHtml +
      '<div class="transfer-demo-list" style="height:' + listHeight + 'px;">' + targetRows + '</div>' +
      '</div>';

    var rightArrowCls = "transfer-demo-arrow-btn" + ((stateKey === "focus") ? " is-focus" : "");
    var disabledAttr = isDisabled ? " disabled" : "";
    var arrows = '<div class="transfer-demo-arrows">' +
      '<button type="button" class="' + rightArrowCls + '" aria-label="Move checked items right"' + disabledAttr + '>&gt;</button>' +
      '<button type="button" class="transfer-demo-arrow-btn" aria-label="Move checked items left"' + disabledAttr + '>&lt;</button>' +
      '</div>';

    var panelCls = "transfer-demo-panel" + (isDisabled ? " is-disabled" : "");
    return '<div class="' + panelCls + '">' + leftColumn + arrows + rightColumn + '</div>';
  }

  function buildComboPrompt(sizeKey, leftTitle, rightTitle){
    return buildFullPrompt({ sizeKey: sizeKey, leftTitle: leftTitle, rightTitle: rightTitle });
  }

  function buildComboCode(sizeKey, leftTitle, rightTitle){
    return buildFullCode({ sizeKey: sizeKey, leftTitle: leftTitle, rightTitle: rightTitle });
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

    // Gallery-card copy CTA + click-to-navigate (transfer.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-transfer"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-transfer"]');
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
    var transferTypeCards = document.querySelectorAll(".transfer-type-card[data-system]");
    transferTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "transfer-" + card.dataset.system + ".html";
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

    // Renders either a plain Copy prompt/Copy code button or, whenever more
    // than one combination is currently selected, a disclosure dropdown
    // listing every combination by name with its own "Copy" button. Transfer
    // has a single combo-driving property (Size, a plain <select>, not a
    // multiselect) so combos is always 0-or-1 long and this always renders
    // the plain button branch - same shared helper every other driver uses.
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

    var matrixContainer = document.querySelector('[data-role="transfer-matrix-container"]');
    if (!matrixContainer) return;

    var sizeSelect = document.querySelector('[data-role="transfer-size-select"]');
    var leftTitleInput = document.querySelector('[data-role="transfer-left-title"]');
    var rightTitleInput = document.querySelector('[data-role="transfer-right-title"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(sizeKey, leftTitle, rightTitle){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildTransferField(t.key, state.key, sizeKey, leftTitle, rightTitle) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + optionLabelFor(SIZE_OPTIONS, sizeKey) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function currentSelectionInfo(){
      return {
        sizeKey: sizeSelect ? sizeSelect.value : FALLBACK_DEFAULTS.size,
        leftTitle: leftTitleInput ? (leftTitleInput.value.trim() || DEFAULT_LEFT_TITLE) : DEFAULT_LEFT_TITLE,
        rightTitle: rightTitleInput ? (rightTitleInput.value.trim() || DEFAULT_RIGHT_TITLE) : DEFAULT_RIGHT_TITLE
      };
    }

    function render(){
      var sizeKey = sizeSelect ? sizeSelect.value : FALLBACK_DEFAULTS.size;
      var leftTitle = leftTitleInput ? (leftTitleInput.value.trim() || DEFAULT_LEFT_TITLE) : DEFAULT_LEFT_TITLE;
      var rightTitle = rightTitleInput ? (rightTitleInput.value.trim() || DEFAULT_RIGHT_TITLE) : DEFAULT_RIGHT_TITLE;

      matrixContainer.innerHTML = buildMatrixSection(sizeKey, leftTitle, rightTitle);

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(currentSelectionInfo()); }, [], function(c){ return buildComboPrompt(c.sizeKey, c.leftTitle, c.rightTitle); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(currentSelectionInfo()); }, [], function(c){ return buildComboCode(c.sizeKey, c.leftTitle, c.rightTitle); });
    }

    if (sizeSelect){
      sizeSelect.addEventListener("change", render);
    }
    if (leftTitleInput){
      leftTitleInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }
    if (rightTitleInput){
      rightTitleInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    }

    render();
  });
})();
