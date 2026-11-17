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
    { key: "disabled", label: "Disabled" },
    { key: "loading", label: "Loading" },
    { key: "empty", label: "Empty" }
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

  var CHEVRON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>';
  // Expanded rows draw a down-pointing chevron (own geometry) instead of rotating the right-pointing one: a rotation does not survive the Figma export.
  var CHEVRON_DOWN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
  // Stable layer names: every node gets the index it has in a depth-first walk of TREE_DATA, so a row keeps its name in every State and Type.
  var NODE_INDEX = (function(){ var map = {}, n = 0; (function walk(list){ list.forEach(function(node){ map[node.label] = n++; if (node.children) walk(node.children); }); })(TREE_DATA); return map; })();
  var FOLDER_CLOSED_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>';
  var FOLDER_OPEN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2H7a2 2 0 0 0-1.9 1.4L3 15V7z"/><path d="M3 15l1.7-5.7A2 2 0 0 1 6.6 8H21l-2 8a2 2 0 0 1-2 1.5H5a2 2 0 0 1-2-2z"/></svg>';
  var FILE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
  var DASH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="12" x2="18" y2="12"/></svg>';
  var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';

  // Loading indicator - the same hand-built progress_activity glyph
  // Transfer/Button already use for their own Loading states, reused
  // verbatim rather than inventing a new spinner icon. A real static SVG,
  // not a CSS border-trick spun by an `animation` property - that approach
  // is fragile (meaningless once exported, and a frozen frame of it reads
  // as a half-drawn, broken ring) - this glyph reads as "loading" even
  // standing still, which matters here since Tree has a live Figma push
  // integration (captureTreeProperties() below) that can freeze this exact
  // markup into an exported variant.
  var SPINNER_SVG = '<svg class="tree-demo-spinner-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.125 21.2125C6.90833 20.6875 5.84583 19.9708 4.9375 19.0625C4.02917 18.1542 3.3125 17.0917 2.7875 15.875C2.2625 14.6583 2 13.3625 2 11.9875C2 10.6125 2.2625 9.32083 2.7875 8.1125C3.3125 6.90417 4.02917 5.84583 4.9375 4.9375C5.84583 4.02917 6.90833 3.3125 8.125 2.7875C9.34167 2.2625 10.6333 2 12 2C12.2833 2 12.5208 2.09583 12.7125 2.2875C12.9042 2.47917 13 2.71667 13 3C13 3.28333 12.9042 3.52083 12.7125 3.7125C12.5208 3.90417 12.2833 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 14.2167 4.77917 16.1042 6.3375 17.6625C7.89583 19.2208 9.78333 20 12 20C14.2167 20 16.1042 19.2208 17.6625 17.6625C19.2208 16.1042 20 14.2167 20 12C20 11.7167 20.0958 11.4792 20.2875 11.2875C20.4792 11.0958 20.7167 11 21 11C21.2833 11 21.5208 11.0958 21.7125 11.2875C21.9042 11.4792 22 11.7167 22 12C22 13.3667 21.7375 14.6583 21.2125 15.875C20.6875 17.0917 19.9708 18.1542 19.0625 19.0625C18.1542 19.9708 17.0958 20.6875 15.8875 21.2125C14.6792 21.7375 13.3875 22 12.0125 22C10.6375 22 9.34167 21.7375 8.125 21.2125Z"/></svg>';

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

    var nid = NODE_INDEX[node.label];
    var toggleHtml = hasChildren
      ? '<span class="tree-demo-toggle' + (isExpanded ? " is-expanded" : "") + '"' + nodeAttr + ' data-act="toggle" data-contract-part="toggle-' + nid + '">' + (isExpanded ? CHEVRON_DOWN_SVG : CHEVRON_SVG) + "</span>"
      : '<span class="tree-demo-toggle-spacer" data-contract-part="spacer-' + nid + '" data-contract-kind="container"></span>';

    var checkboxHtml = "";
    if (opts.checkable){
      var state = checkStateFor(node, opts.checkedLabels);
      var stateCls = state === "checked" ? " is-checked" : (state === "indeterminate" ? " is-indeterminate" : "");
      var mark = state === "checked" ? CHECK_SVG : (state === "indeterminate" ? DASH_SVG : "");
      checkboxHtml = '<span class="tree-demo-checkbox' + stateCls + '"' + nodeAttr + ' data-act="check" data-contract-part="check-' + nid + '" data-contract-kind="container">' + mark + "</span>";
    }

    var iconHtml = "";
    if (opts.showIcons){
      var iconSvg = hasChildren ? (isExpanded ? FOLDER_OPEN_SVG : FOLDER_CLOSED_SVG) : FILE_SVG;
      iconHtml = '<span class="tree-demo-icon" data-contract-part="icon-' + nid + '">' + iconSvg + "</span>";
    }

    var rowCls = "tree-demo-row" + (!opts.checkable && isChecked ? " is-selected" : "");
    // Node labels are fixed reference content (see TREE_DATA above), but
    // escapeHtml is applied anyway as defense-in-depth in case this
    // function is ever reused with dynamic node data.
    // The label always sits in a label group (a column), with the metatext line added only for the Metatext type, so the layers are the same in every Type.
    var labelHtml = '<span class="tree-demo-label-group" data-contract-part="labelgroup-' + nid + '"><span class="tree-demo-label" data-contract-part="label-' + nid + '">' + escapeHtml(node.label) + "</span>" +
      ((opts.showMeta && node.meta) ? '<span class="tree-demo-meta" data-contract-part="meta-' + nid + '">' + escapeHtml(node.meta) + "</span>" : "") + "</span>";
    var rowHtml = '<div class="' + rowCls + '" data-contract-part="row-' + nid + '">' + toggleHtml + checkboxHtml + iconHtml + labelHtml + "</div>";

    var childrenHtml = "";
    if (hasChildren && isExpanded){
      childrenHtml = '<div class="tree-demo-children" data-contract-part="children-' + nid + '">' +
        node.children.map(function(child){ return buildTreeNode(child, opts); }).join("") +
        "</div>";
    }

    return '<div class="tree-demo-node" data-contract-part="node-' + nid + '">' + rowHtml + childrenHtml + "</div>";
  }

  // liveState is supplied only by the interactive sandbox, which drives its
  // own expanded/checked sets; the matrix passes nothing and keeps getting
  // the fixed per-state rendering it needs.
  function buildTreeField(typeKey, stateKey, rootLabel, showIcons, liveState){
    var isDisabled = stateKey === "disabled";
    var isLoading = stateKey === "loading";
    var isEmpty = stateKey === "empty";
    var isExpanded = stateKey === "expanded" || stateKey === "selected";
    var opts = {
      checkable: typeKey === "checkable",
      showIcons: showIcons,
      showMeta: typeKey === "lines",
      expandedLabels: liveState ? liveState.expandedLabels : (isExpanded ? ["Reports", "2026"] : []),
      checkedLabels: liveState ? liveState.checkedLabels : (stateKey === "selected" ? ["Q1 Report.pdf"] : [])
    };

    // Loading/Empty replace the whole node list with something structurally
    // different (a spinner glyph, or a message) - real users would never
    // see rows AND a loading/empty message at once, so these states
    // intentionally override nodesHtml rather than compositing with it -
    // same "override, don't composite" rule Transfer's own Loading/Empty/
    // No Results slot uses. Each gets its own data-contract-part so Figma
    // capture (captureTreeProperties() in component-workbench.js) can find
    // it regardless of which state the DOM happens to be in at capture
    // time - the recurring "base capture has no node for content that only
    // exists in another state" bug this system has hit repeatedly.
    var nodesContent;
    if (isLoading){
      nodesContent = '<div class="tree-demo-loading" data-contract-part="tree-items-loading">' + SPINNER_SVG + "</div>";
    } else if (isEmpty){
      nodesContent = '<p class="tree-demo-empty" data-contract-part="tree-items-empty">No items to show.</p>';
    } else {
      nodesContent = TREE_DATA.map(function(node){ return buildTreeNode(node, opts); }).join("");
    }
    var wrapCls = "tree-demo-wrap" + (typeKey === "lines" ? " tree-demo-wrap--lines" : "") + (isDisabled ? " is-disabled" : "");

    return '<div class="' + wrapCls + '">' +
      '<p class="tree-demo-root" data-contract-part="rootLabel">' + escapeHtml(rootLabel) + "</p>" +
      '<div class="tree-demo-nodes" data-contract-part="treeNodes">' + nodesContent + "</div>" +
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
    lines.push("States (6):");
    lines.push("- Default: top-level nodes visible, all branches collapsed.");
    lines.push("- Expanded: one branch expanded, showing its children.");
    lines.push("- Selected: one leaf node highlighted (Default type) or checked (Checkable type), with its parent branch expanded so it's visible.");
    lines.push("- Disabled: the whole tree dimmed and non-interactive.");
    lines.push("- Loading: a centered spinner glyph replaces the node list while data is being fetched.");
    lines.push("- Empty: a centered, dimmed \"No items to show.\" message replaces the node list when there is nothing to display.");
    lines.push("");
    lines.push("Each node is either a parent (has children, shown with an expand/collapse chevron" + (showIcons ? " and a folder icon" : "") + ") or a leaf" + (showIcons ? " (shown with a file icon)" : "") + ". Clicking a parent's chevron toggles its children's visibility without selecting it.");
    lines.push("");
    lines.push("Component properties: Root label (text, a heading shown above the node list, e.g. \"" + rootLabel + "\"); Show icons (boolean, toggles the folder/file icon next to each node) - currently " + (showIcons ? "on" : "off") + ".");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(rootLabel, showIcons, typeFilter){
    rootLabel = (rootLabel || DEFAULT_ROOT_LABEL).trim() || DEFAULT_ROOT_LABEL;
    showIcons = showIcons === undefined ? DEFAULT_SHOW_ICONS : showIcons;

    var lines = [];
    lines.push("/* Agentic Design System - Tree component */");
    lines.push(".tree-demo-wrap{ width:var(--dimension-200); font-family:var(--font-body); font-size:var(--type-body-size); }");
    lines.push(".tree-demo-wrap.is-disabled{ opacity:0.4; pointer-events:none; }");
    lines.push('.tree-demo-root{ margin:0 0 var(--space-6); font-family:var(--font-mono); font-size:var(--type-body-size); font-weight:var(--type-selected-weight); letter-spacing:0.06em; color:var(--text-dim); max-width:var(--dimension-260); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push(".tree-demo-row{ display:flex; align-items:center; gap:var(--space-4); padding:var(--space-4) var(--space-6); border-radius:var(--radius-sm); color:var(--text-hi); cursor:pointer; }");
    lines.push(".tree-demo-row:hover{ background:var(--graphite-800); }");
    lines.push(".tree-demo-row.is-selected{ background:var(--red-tint); color:var(--red-400); }");
    lines.push(".tree-demo-toggle{ width:var(--dimension-14); height:var(--dimension-14); flex:none; display:flex; align-items:center; justify-content:center; color:var(--text-dim); transition:transform .15s ease; }");
    lines.push(".tree-demo-toggle.is-expanded{ transform:rotate(90deg); }");
    lines.push(".tree-demo-toggle-spacer{ width:var(--dimension-14); flex:none; }");
    lines.push(".tree-demo-toggle svg, .tree-demo-checkbox svg, .tree-demo-icon svg{ width:var(--dimension-14); height:var(--dimension-14); }");
    lines.push(".tree-demo-checkbox{ width:var(--dimension-14); height:var(--dimension-14); flex:none; border-radius:3px; border:var(--border-width-1) var(--border-style) var(--line-strong); display:flex; align-items:center; justify-content:center; color:#FFFFFF; }");
    lines.push(".tree-demo-checkbox.is-checked, .tree-demo-checkbox.is-indeterminate{ background:var(--red-500); border-color:var(--red-500); }");
    lines.push("/* Indeterminate is filled like a checked box - the dash vs tick is what separates partial from complete. */");
    lines.push(".tree-demo-icon{ flex:none; color:var(--text-dim); display:flex; }");
    lines.push(".tree-demo-label{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".tree-demo-children{ padding-inline-start:var(--space-18); }");
    lines.push("");
    lines.push("/* Metatext type (SLDS-accurate) - a second, smaller, muted line under the label, with the toggle/icon top-aligned against the taller two-line row instead of centered */");
    lines.push(".tree-demo-wrap--lines .tree-demo-row{ align-items:flex-start; }");
    lines.push(".tree-demo-wrap--lines .tree-demo-toggle, .tree-demo-wrap--lines .tree-demo-toggle-spacer, .tree-demo-wrap--lines .tree-demo-checkbox, .tree-demo-wrap--lines .tree-demo-icon{ margin-top:var(--space-1); }");
    lines.push(".tree-demo-label-group{ display:flex; flex-direction:column; gap:var(--space-1); min-width:0; }");
    lines.push(".tree-demo-meta{ font-size:var(--type-body-size); color:var(--text-dim); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    var typesToRender = typeFilter ? TYPES.filter(function(t){ return t.key === typeFilter; }) : TYPES;
    lines.push("<!-- Example usage - " + (typeFilter ? "the " + (typesToRender[0] ? typesToRender[0].label : typeFilter) + " type only" : "one per type") + ", Expanded state, at the chosen Root label/Show icons -->");
    typesToRender.forEach(function(t){
      lines.push(buildTreeField(t.key, "expanded", rootLabel, showIcons));
    });
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
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

    if (rootLabelInput) rootLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
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
