(() => {
  "use strict";

  var TYPES = [
    { key: "default", label: "Default" },
    { key: "checkable", label: "Checkable" },
    { key: "lines", label: "Metatext" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "expanded", label: "Expanded" },
    { key: "selected", label: "Selected" },
    { key: "disabled", label: "Disabled" }
  ];

  var DEFAULT_ROOT_LABEL = "Documents";
  var DEFAULT_SHOW_ICONS = true;

  // Fixed reference content - the node structure itself is never editable,
  // matching Cascader's and Tree Select's own hardcoded demo hierarchies
  // (Continent/Country/City, Engineering/Frontend/Backend). Only the root
  // label above the tree is a live property.
  // Three levels deep on the first branch, deliberately. A two-level tree
  // cannot demonstrate the indeterminate checkbox honestly: with one level of
  // nesting, a partially-checked parent is the only case there is. Going one
  // level further shows the state propagating upward - a checked leaf makes
  // its immediate parent indeterminate, which in turn makes the grandparent
  // indeterminate too.
  // meta is optional supplemental text used only by the Metatext type (see
  // opts.showMeta in buildTreeNode) - a second, smaller line under the
  // label, matching Lightning Design System's Tree item metatext. Default
  // and Checkable never read this field, so it's harmless reference data
  // for them.
  var TREE_DATA = [
    { label: "Reports", meta: "12 items", children: [
      { label: "2026", meta: "4 files", children: [
        { label: "Q1 Report.pdf", meta: "1.2 MB" },
        { label: "Q2 Report.pdf", meta: "980 KB" }
      ] },
      { label: "Archive.zip", meta: "45 MB" }
    ] },
    { label: "Presentations", meta: "1 item", children: [
      { label: "Board Deck.pptx", meta: "8.4 MB" }
    ] },
    { label: "Notes.txt", meta: "2 KB" }
  ];

  // Resolves a node to checked / indeterminate / unchecked from its
  // descendants, rather than storing a flag per node - that keeps the
  // rendered tree internally consistent no matter which leaves are checked.
  function checkStateFor(node, checkedLabels){
    if (!node.children || !node.children.length){
      return checkedLabels.indexOf(node.label) !== -1 ? "checked" : "unchecked";
    }
    var seen = node.children.map(function(child){ return checkStateFor(child, checkedLabels); });
    if (seen.every(function(s){ return s === "checked"; })) return "checked";
    if (seen.every(function(s){ return s === "unchecked"; })) return "unchecked";
    return "indeterminate";
  }

  var CHEVRON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>';
  var FOLDER_CLOSED_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>';
  var FOLDER_OPEN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2H7a2 2 0 0 0-1.9 1.4L3 15V7z"/><path d="M3 15l1.7-5.7A2 2 0 0 1 6.6 8H21l-2 8a2 2 0 0 1-2 1.5H5a2 2 0 0 1-2-2z"/></svg>';
  var FILE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
  var DASH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="12" x2="18" y2="12"/></svg>';
  var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Renders one node and, if expanded, its children - recursively, so the
  // tree above renders at whatever depth it happens to have, with no limit
  // baked into the function itself.
  function buildTreeNode(node, opts){
    var hasChildren = !!(node.children && node.children.length);
    var isExpanded = hasChildren && opts.expandedLabels.indexOf(node.label) !== -1;
    var isChecked = opts.checkedLabels.indexOf(node.label) !== -1;

    // data-node lets the interactive sandbox below identify what was clicked.
    // The matrix ignores it entirely - it renders fixed states and never
    // listens for clicks - so the attribute is inert there.
    var nodeAttr = ' data-node="' + escapeHtml(node.label) + '"';

    var toggleHtml = hasChildren
      ? '<span class="tree-demo-toggle' + (isExpanded ? " is-expanded" : "") + '"' + nodeAttr + ' data-act="toggle">' + CHEVRON_SVG + "</span>"
      : '<span class="tree-demo-toggle-spacer"></span>';

    var checkboxHtml = "";
    if (opts.checkable){
      var state = checkStateFor(node, opts.checkedLabels);
      var stateCls = state === "checked" ? " is-checked" : (state === "indeterminate" ? " is-indeterminate" : "");
      var mark = state === "checked" ? CHECK_SVG : (state === "indeterminate" ? DASH_SVG : "");
      checkboxHtml = '<span class="tree-demo-checkbox' + stateCls + '"' + nodeAttr + ' data-act="check">' + mark + "</span>";
    }

    var iconHtml = "";
    if (opts.showIcons){
      var iconSvg = hasChildren ? (isExpanded ? FOLDER_OPEN_SVG : FOLDER_CLOSED_SVG) : FILE_SVG;
      iconHtml = '<span class="tree-demo-icon">' + iconSvg + "</span>";
    }

    var rowCls = "tree-demo-row" + (!opts.checkable && isChecked ? " is-selected" : "");
    // Node labels are fixed reference content (see TREE_DATA above), but
    // escapeHtml is applied anyway as defense-in-depth in case this
    // function is ever reused with dynamic node data.
    var labelHtml;
    if (opts.showMeta && node.meta){
      // Metatext (SLDS-accurate) - a second, smaller, muted line under the
      // label, not a separate row - both are wrapped together so the row
      // stays one flex item and the toggle/icon can top-align against the
      // now-taller two-line block, matching Lightning Design System's own
      // .slds-tree__item .slds-button{ align-self:flex-start } treatment.
      labelHtml = '<span class="tree-demo-label-group"><span class="tree-demo-label">' + escapeHtml(node.label) + '</span><span class="tree-demo-meta">' + escapeHtml(node.meta) + "</span></span>";
    } else {
      labelHtml = '<span class="tree-demo-label">' + escapeHtml(node.label) + "</span>";
    }
    var rowHtml = '<div class="' + rowCls + '">' + toggleHtml + checkboxHtml + iconHtml + labelHtml + "</div>";

    var childrenHtml = "";
    if (hasChildren && isExpanded){
      childrenHtml = '<div class="tree-demo-children">' +
        node.children.map(function(child){ return buildTreeNode(child, opts); }).join("") +
        "</div>";
    }

    return '<div class="tree-demo-node">' + rowHtml + childrenHtml + "</div>";
  }

  // liveState is supplied only by the interactive sandbox, which drives its
  // own expanded/checked sets; the matrix passes nothing and keeps getting
  // the fixed per-state rendering it needs.
  function buildTreeField(typeKey, stateKey, rootLabel, showIcons, liveState){
    var isDisabled = stateKey === "disabled";
    var isExpanded = stateKey === "expanded" || stateKey === "selected";
    var opts = {
      checkable: typeKey === "checkable",
      showIcons: showIcons,
      showMeta: typeKey === "lines",
      expandedLabels: liveState ? liveState.expandedLabels : (isExpanded ? ["Reports", "2026"] : []),
      checkedLabels: liveState ? liveState.checkedLabels : (stateKey === "selected" ? ["Q1 Report.pdf"] : [])
    };

    var nodesHtml = TREE_DATA.map(function(node){ return buildTreeNode(node, opts); }).join("");
    var wrapCls = "tree-demo-wrap" + (typeKey === "lines" ? " tree-demo-wrap--lines" : "") + (isDisabled ? " is-disabled" : "");

    return '<div class="' + wrapCls + '">' +
      '<p class="tree-demo-root">' + escapeHtml(rootLabel) + "</p>" +
      '<div class="tree-demo-nodes">' + nodesHtml + "</div>" +
      "</div>";
  }

  function buildFullPrompt(rootLabel, showIcons, typeFilter){
    rootLabel = (rootLabel || DEFAULT_ROOT_LABEL).trim() || DEFAULT_ROOT_LABEL;
    showIcons = showIcons === undefined ? DEFAULT_SHOW_ICONS : showIcons;

    var lines = [];
    lines.push("Create a complete Tree component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, root label, icon visibility, state) - a standalone, always-visible hierarchical structure with expandable branches, like a file system or an org chart. Distinct from Tree Select, which hides the same structure behind a Select-style dropdown trigger.");
    lines.push("");
    lines.push("Types (" + TYPES.length + "):");
    lines.push("- Default: nodes are selectable by click - clicking a node highlights it, no checkboxes.");
    lines.push("- Checkable: every node gets its own checkbox for multi-select; checking a parent should check all its children (and check a parent automatically when every child becomes checked).");
    lines.push("- Metatext: same selectable nodes as Default (no checkboxes), plus a second, smaller line of muted supplemental text under each node's label (a file size, an item count) - useful for disambiguating similarly-named nodes or surfacing a quick detail without adding a column. Modeled on Lightning Design System's Tree item metatext, which top-aligns the toggle/icon against the now-taller two-line row rather than centering it.");
    if (typeFilter){
      var filteredType = TYPES.filter(function(t){ return t.key === typeFilter; })[0];
      lines.push("");
      lines.push("This card's live example commits specifically to the " + (filteredType ? filteredType.label : typeFilter) + " type - generate that type first, though the full component still supports all " + TYPES.length + " listed above.");
    }
    lines.push("");
    lines.push("States (4):");
    lines.push("- Default: top-level nodes visible, all branches collapsed.");
    lines.push("- Expanded: one branch expanded, showing its children.");
    lines.push("- Selected: one leaf node highlighted (Default type) or checked (Checkable type), with its parent branch expanded so it's visible.");
    lines.push("- Disabled: the whole tree dimmed and non-interactive.");
    lines.push("");
    lines.push("Each node is either a parent (has children, shown with an expand/collapse chevron" + (showIcons ? " and a folder icon" : "") + ") or a leaf" + (showIcons ? " (shown with a file icon)" : "") + ". Clicking a parent's chevron toggles its children's visibility without selecting it.");
    lines.push("");
    lines.push("Component properties: Root label (text, a heading shown above the node list, e.g. \"" + rootLabel + "\"); Show icons (boolean, toggles the folder/file icon next to each node) - currently " + (showIcons ? "on" : "off") + ".");
    return lines.join("\n");
  }

  function buildFullCode(rootLabel, showIcons, typeFilter){
    rootLabel = (rootLabel || DEFAULT_ROOT_LABEL).trim() || DEFAULT_ROOT_LABEL;
    showIcons = showIcons === undefined ? DEFAULT_SHOW_ICONS : showIcons;

    var lines = [];
    lines.push("/* Agentic Design System - Tree component */");
    lines.push(".tree-demo-wrap{ width:220px; font-family:var(--font-body); font-size:13px; }");
    lines.push(".tree-demo-wrap.is-disabled{ opacity:0.4; pointer-events:none; }");
    lines.push('.tree-demo-root{ margin:0 0 6px; font-family:var(--font-mono); font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--text-dim); max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push(".tree-demo-row{ display:flex; align-items:center; gap:4px; padding:4px 6px; border-radius:var(--radius-sm); color:var(--text-hi); cursor:pointer; }");
    lines.push(".tree-demo-row:hover{ background:var(--graphite-800); }");
    lines.push(".tree-demo-row.is-selected{ background:var(--red-tint); color:var(--red-400); }");
    lines.push(".tree-demo-toggle{ width:14px; height:14px; flex:none; display:flex; align-items:center; justify-content:center; color:var(--text-dim); transition:transform .15s ease; }");
    lines.push(".tree-demo-toggle.is-expanded{ transform:rotate(90deg); }");
    lines.push(".tree-demo-toggle-spacer{ width:14px; flex:none; }");
    lines.push(".tree-demo-toggle svg, .tree-demo-checkbox svg, .tree-demo-icon svg{ width:14px; height:14px; }");
    lines.push(".tree-demo-checkbox{ width:14px; height:14px; flex:none; border-radius:3px; border:1.5px solid var(--line-strong); display:flex; align-items:center; justify-content:center; color:#FFFFFF; }");
    lines.push(".tree-demo-checkbox.is-checked, .tree-demo-checkbox.is-indeterminate{ background:var(--red-500); border-color:var(--red-500); }");
    lines.push("/* Indeterminate is filled like a checked box - the dash vs tick is what separates partial from complete. */");
    lines.push(".tree-demo-icon{ flex:none; color:var(--text-dim); display:flex; }");
    lines.push(".tree-demo-label{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".tree-demo-children{ padding-inline-start:18px; }");
    lines.push("");
    lines.push("/* Metatext type (SLDS-accurate) - a second, smaller, muted line under the label, with the toggle/icon top-aligned against the taller two-line row instead of centered */");
    lines.push(".tree-demo-wrap--lines .tree-demo-row{ align-items:flex-start; }");
    lines.push(".tree-demo-wrap--lines .tree-demo-toggle, .tree-demo-wrap--lines .tree-demo-toggle-spacer, .tree-demo-wrap--lines .tree-demo-checkbox, .tree-demo-wrap--lines .tree-demo-icon{ margin-top:1px; }");
    lines.push(".tree-demo-label-group{ display:flex; flex-direction:column; gap:1px; min-width:0; }");
    lines.push(".tree-demo-meta{ font-size:11px; color:var(--text-dim); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    var typesToRender = typeFilter ? TYPES.filter(function(t){ return t.key === typeFilter; }) : TYPES;
    lines.push("<!-- Example usage - " + (typeFilter ? "the " + (typesToRender[0] ? typesToRender[0].label : typeFilter) + " type only" : "one per type") + ", Expanded state, at the chosen Root label/Show icons -->");
    typesToRender.forEach(function(t){
      lines.push(buildTreeField(t.key, "expanded", rootLabel, showIcons));
    });
    return lines.join("\n");
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

    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-tree"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-tree"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_ROOT_LABEL, DEFAULT_SHOW_ICONS), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_ROOT_LABEL, DEFAULT_SHOW_ICONS), cardCopyCodeBtn);
      });
    }

    // Second gallery card (Metatext) - same page, same component, so its
    // Copy prompt/Copy code commit explicitly to the Metatext type instead
    // of describing all types the way the first card's un-narrowed buttons do.
    var cardCopyPromptLinesBtn = document.querySelector('[data-role="copy-prompt-tree-lines"]');
    var cardCopyCodeLinesBtn = document.querySelector('[data-role="copy-code-tree-lines"]');
    if (cardCopyPromptLinesBtn){
      cardCopyPromptLinesBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_ROOT_LABEL, DEFAULT_SHOW_ICONS, "lines"), cardCopyPromptLinesBtn);
      });
    }
    if (cardCopyCodeLinesBtn){
      cardCopyCodeLinesBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_ROOT_LABEL, DEFAULT_SHOW_ICONS, "lines"), cardCopyCodeLinesBtn);
      });
    }

    var treeTypeCards = document.querySelectorAll(".tree-type-card[data-system]");
    treeTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "tree-" + card.dataset.system + ".html";
      if (card.dataset.type) href += "?type=" + encodeURIComponent(card.dataset.type);
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

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

    var matrixContainer = document.querySelector('[data-role="tree-matrix-container"]');
    if (!matrixContainer) return;

    var rootLabelInput = document.querySelector('[data-role="tree-root-label"]');
    var showIconsInput = document.querySelector('[data-role="tree-show-icons"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(rootLabel, showIcons){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell" data-type-key="' + t.key + '">' + buildTreeField(t.key, state.key, rootLabel, showIcons) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead" data-type-key="' + t.key + '">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      var rootLabel = (rootLabelInput ? rootLabelInput.value.trim() : "") || DEFAULT_ROOT_LABEL;
      var showIcons = showIconsInput ? showIconsInput.checked : DEFAULT_SHOW_ICONS;
      return { rootLabel: rootLabel, showIcons: showIcons };
    }

    function render(){
      var v = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(v.rootLabel, v.showIcons);

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(v.rootLabel, v.showIcons); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(v.rootLabel, v.showIcons); }, [], function(){ return ""; });
    }

    if (rootLabelInput) rootLabelInput.addEventListener("input", render);
    if (showIconsInput) showIconsInput.addEventListener("change", render);

    render();

    // Landing here from the listing page's Metatext card (tree-default.html?type=lines)
    // should visibly land ON the Metatext column of the Live Preview matrix,
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
      // next time render() rebuilds the matrix (root label/icons change).
      targets.forEach(function(el){ el.classList.add("is-jump-target"); });
    })();

    // ---- interactive sandbox -------------------------------------------
    // The matrix above deliberately renders fixed states, because its job is
    // to show all four side by side. That makes it the wrong place to put
    // real behavior - a cell labelled "Collapsed" that the user can expand
    // stops being that cell. So live interaction gets its own instance here,
    // where expanding, collapsing and checking actually do something and a
    // designer can feel the cascade rather than read about it.
    var sandbox = document.querySelector('[data-role="tree-interactive"]');
    if (!sandbox) return;

    var liveExpanded = ["Reports"];
    var liveChecked = [];

    function collectLabels(node, into){
      into.push(node.label);
      (node.children || []).forEach(function(child){ collectLabels(child, into); });
      return into;
    }

    function findNode(label, nodes){
      for (var i = 0; i < nodes.length; i++){
        if (nodes[i].label === label) return nodes[i];
        if (nodes[i].children){
          var hit = findNode(label, nodes[i].children);
          if (hit) return hit;
        }
      }
      return null;
    }

    // Checking a branch takes everything beneath it with it, and unchecking
    // does the reverse. Parents are never stored as checked in their own
    // right - checkStateFor derives them from their descendants - so the two
    // never drift out of sync.
    function setSubtree(node, checked){
      var labels = collectLabels(node, []);
      labels.forEach(function(label){
        var at = liveChecked.indexOf(label);
        if (checked && at === -1) liveChecked.push(label);
        if (!checked && at !== -1) liveChecked.splice(at, 1);
      });
    }

    function renderSandbox(){
      var v = currentValues();
      sandbox.innerHTML = buildTreeField("checkable", "custom", v.rootLabel, v.showIcons, {
        expandedLabels: liveExpanded,
        checkedLabels: liveChecked
      });
    }

    sandbox.addEventListener("click", function(e){
      var hit = e.target.closest("[data-act]");
      if (!hit) return;
      var label = hit.getAttribute("data-node");
      var node = findNode(label, TREE_DATA);
      if (!node) return;

      if (hit.getAttribute("data-act") === "toggle"){
        var at = liveExpanded.indexOf(label);
        if (at === -1) liveExpanded.push(label); else liveExpanded.splice(at, 1);
      } else {
        setSubtree(node, checkStateFor(node, liveChecked) !== "checked");
      }
      renderSandbox();
    });

    if (rootLabelInput) rootLabelInput.addEventListener("input", renderSandbox);
    if (showIconsInput) showIconsInput.addEventListener("change", renderSandbox);

    renderSandbox();
  });
})();
