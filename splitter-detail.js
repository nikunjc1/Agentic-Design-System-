(() => {
  "use strict";

  // Real dragging is a live pointer interaction. "Dragging" here is an
  // honest static snapshot of the divider's active/highlighted appearance
  // mid-resize, same precedent as Affix's "Affixed" and Popover's "Open"
  // states being simulated snapshots rather than fake CSS pseudo-classes.
  var TYPES = [
    { key: "horizontal", label: "Horizontal" },
    { key: "vertical", label: "Vertical" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "dragging", label: "Dragging" },
    { key: "collapsed", label: "Collapsed" }
  ];

  var DEFAULT_PANEL1_LABEL = "Sidebar";
  var DEFAULT_PANEL2_LABEL = "Content";
  var DEFAULT_RATIO = 35;

  var EXPAND_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:var(--dimension-12);height:var(--dimension-12);"><polyline points="9 18 15 12 9 6"/></svg>';

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function clampRatio(ratio){
    ratio = parseInt(ratio, 10);
    if (isNaN(ratio)) ratio = DEFAULT_RATIO;
    if (ratio < 10) ratio = 10;
    if (ratio > 90) ratio = 90;
    return ratio;
  }

  // Renders one .splitter-demo-wrap - two panels plus a divider between
  // them, flex-direction driven by typeKey. Collapsed shrinks the first
  // panel to a thin 28px strip showing only an expand chevron; Dragging
  // just highlights the divider itself, since the panel proportions in a
  // real drag are still whatever they were before the pointer moved.
  function buildSplitterField(typeKey, stateKey, panel1Label, panel2Label, ratio){
    var isCollapsed = stateKey === "collapsed";
    var isDragging = stateKey === "dragging";
    var wrapCls = "splitter-demo-wrap splitter-demo-wrap--" + typeKey;
    var dividerCls = "splitter-demo-divider splitter-demo-divider--" + typeKey + (isDragging ? " is-dragging" : "");

    var panel1Html;
    if (isCollapsed){
      panel1Html = '<div class="splitter-demo-panel is-collapsed" style="flex:0 0 28px;">' + EXPAND_ICON_SVG + "</div>";
    } else {
      panel1Html = '<div class="splitter-demo-panel" style="flex:0 0 ' + ratio + '%;"><span class="splitter-demo-panel-text">' + escapeHtml(panel1Label) + "</span></div>";
    }
    // Labels are wrapped rather than inlined as bare text nodes because
    // .splitter-demo-panel is a flex container - an ellipsis cannot apply to
    // an anonymous flex item, so a long label would clip with no indicator.
    var panel2Html = '<div class="splitter-demo-panel" style="flex:1 1 auto;"><span class="splitter-demo-panel-text">' + escapeHtml(panel2Label) + "</span></div>";
    var dividerHtml = '<div class="' + dividerCls + '"><span class="splitter-demo-handle"></span></div>';

    return '<div class="' + wrapCls + '">' + panel1Html + dividerHtml + panel2Html + "</div>";
  }

  function buildLiveSplitterField(typeKey,panel1Label,panel2Label,id){
    return '<div class="splitter-demo-wrap splitter-demo-wrap--'+typeKey+' ads-live-splitter" data-live-splitter data-splitter-axis="'+typeKey+'">'+
      '<div class="splitter-demo-panel" id="'+id+'-first" data-splitter-first><span class="splitter-demo-panel-text">'+escapeHtml(panel1Label)+'</span></div>'+
      '<div class="splitter-demo-divider splitter-demo-divider--'+typeKey+'" data-splitter-divider><span class="splitter-demo-handle"></span></div>'+
      '<div class="splitter-demo-panel" data-splitter-second><span class="splitter-demo-panel-text">'+escapeHtml(panel2Label)+'</span></div></div>';
  }

  function buildFullPrompt(panel1Label, panel2Label, ratio){
    panel1Label = (panel1Label || DEFAULT_PANEL1_LABEL).trim() || DEFAULT_PANEL1_LABEL;
    panel2Label = (panel2Label || DEFAULT_PANEL2_LABEL).trim() || DEFAULT_PANEL2_LABEL;
    ratio = clampRatio(ratio);

    var lines = [];
    lines.push("Create a complete Splitter component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, split ratio, state, panel content) - a two-panel layout separated by a draggable divider that lets the user redistribute space between the panels, not a one-off resize handle wired up per screen.");
    lines.push("");
    lines.push("Types (2):");
    lines.push("- Horizontal: panels sit side by side, divided by a vertical draggable line (col-resize cursor).");
    lines.push("- Vertical: panels stack top to bottom, divided by a horizontal draggable line (row-resize cursor).");
    lines.push("");
    lines.push("States (3):");
    lines.push("- Default: a static split at the configured ratio (currently " + ratio + "% / " + (100 - ratio) + "%).");
    lines.push("- Dragging: the divider itself is highlighted (brand red) while the pointer is actively resizing - panel proportions mid-drag are whatever they were an instant before, not reset.");
    lines.push("- Collapsed: the first panel shrinks to a thin 28px strip showing only an expand chevron, temporarily reclaiming its space for the second panel.");
    lines.push("");
    lines.push("Component properties: First panel label (text, e.g. \"" + panel1Label + "\"); Second panel label (text, e.g. \"" + panel2Label + "\"); Split ratio (number, percent given to the first panel when not collapsed) - currently " + ratio + ".");
    lines.push("Live interaction: include splitter-runtime.js and mount ADSSplitter. Named separator with arrow/Shift/Home/End/Enter keys, 64px minimum expanded panes, 10–90% bounds, collapse/restore, pointer cancellation and versioned width persistence. Use a unique storage key per product layout. Static state comparisons remain inert.");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(panel1Label, panel2Label, ratio){
    panel1Label = (panel1Label || DEFAULT_PANEL1_LABEL).trim() || DEFAULT_PANEL1_LABEL;
    panel2Label = (panel2Label || DEFAULT_PANEL2_LABEL).trim() || DEFAULT_PANEL2_LABEL;
    ratio = clampRatio(ratio);

    var lines = [];
    lines.push("/* Agentic Design System - Splitter component */");
    lines.push(".splitter-demo-wrap{ display:flex; width:var(--dimension-240); height:var(--dimension-140); box-sizing:border-box; border:1px solid var(--line-strong); border-radius:var(--radius-md); overflow:hidden; background:var(--graphite-900); }");
    lines.push(".splitter-demo-wrap--vertical{ flex-direction:column; }");
    lines.push('.splitter-demo-panel{ box-sizing:border-box; display:flex; align-items:center; justify-content:center; text-align:center; overflow:hidden; min-width:0; padding:var(--space-8); font-family:var(--font-body); font-size:var(--type-caption-size); color:var(--text-mid); background:var(--graphite-850); }');
    lines.push(".splitter-demo-panel-text{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".splitter-demo-panel:first-child{ background:var(--graphite-800); }");
    lines.push(".splitter-demo-panel.is-collapsed{ color:var(--text-dim); }");
    lines.push(".splitter-demo-divider{ flex:none; background:var(--graphite-700); display:flex; align-items:center; justify-content:center; }");
    lines.push(".splitter-demo-wrap--horizontal .splitter-demo-divider{ width:var(--dimension-6); cursor:col-resize; }");
    lines.push(".splitter-demo-wrap--vertical .splitter-demo-divider{ height:var(--dimension-6); cursor:row-resize; }");
    lines.push(".splitter-demo-divider.is-dragging{ background:var(--red-500); }");
    lines.push(".splitter-demo-handle{ width:var(--dimension-3); height:var(--dimension-16); border-radius:2px; background:var(--text-dim); }");
    lines.push(".splitter-demo-wrap--vertical .splitter-demo-handle{ width:var(--dimension-16); height:var(--dimension-3); }");
    lines.push(".splitter-demo-divider.is-dragging .splitter-demo-handle{ background:#FFFFFF; }");
    lines.push("");
    lines.push("<!-- Example usage - one per type, Default state, at the chosen labels/ratio -->");
    TYPES.forEach(function(t){
      lines.push(buildLiveSplitterField(t.key,panel1Label,panel2Label,"splitter-"+t.key));
    });
    lines.push('<!-- Include splitter-runtime.js after the shared Foundation scripts. Use a unique key per layout. -->');
    lines.push('<script>document.querySelectorAll("[data-live-splitter]").forEach(function(wrap){ADSSplitter.mount(wrap,{ratio:'+ratio+',label:wrap.querySelector("[data-splitter-first]").textContent,storageKey:"my-layout-"+wrap.dataset.splitterAxis});});</script>');
    return window.ADSFoundation.prepareCode(lines.join("\n"));
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      return window.ADSClipboard.copyWithFeedback(text, btn);
    }

    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-splitter"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-splitter"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_PANEL1_LABEL, DEFAULT_PANEL2_LABEL, DEFAULT_RATIO), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_PANEL1_LABEL, DEFAULT_PANEL2_LABEL, DEFAULT_RATIO), cardCopyCodeBtn);
      });
    }
    var splitterTypeCards = document.querySelectorAll(".splitter-type-card[data-system]");
    splitterTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "splitter-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="splitter-matrix-container"]');
    if (!matrixContainer) return;

    var panel1Input = document.querySelector('[data-role="splitter-panel1-label"]');
    var panel2Input = document.querySelector('[data-role="splitter-panel2-label"]');
    var ratioInput = document.querySelector('[data-role="splitter-ratio"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(panel1Label, panel2Label, ratio){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildSplitterField(t.key, state.key, panel1Label, panel2Label, ratio) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      var panel1Label = (panel1Input ? panel1Input.value.trim() : "") || DEFAULT_PANEL1_LABEL;
      var panel2Label = (panel2Input ? panel2Input.value.trim() : "") || DEFAULT_PANEL2_LABEL;
      var ratio = clampRatio(ratioInput ? ratioInput.value : DEFAULT_RATIO);
      return { panel1Label: panel1Label, panel2Label: panel2Label, ratio: ratio };
    }

    function render(){
      var v = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(v.panel1Label, v.panel2Label, v.ratio);

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(v.panel1Label, v.panel2Label, v.ratio); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(v.panel1Label, v.panel2Label, v.ratio); }, [], function(){ return ""; });
    }

    if (panel1Input) panel1Input.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (panel2Input) panel2Input.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (ratioInput) ratioInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });

    render();

    // ---- interactive sandbox -------------------------------------------
    // The matrix renders Dragging as a still frame, because a cell that can
    // be dragged stops being a fixed state to compare against. Actual
    // dragging lives here instead, on its own instance.
    var sandbox = document.querySelector('[data-role="splitter-interactive"]');
    if (!sandbox) return;

    var v=currentValues();
    sandbox.innerHTML=buildLiveSplitterField('horizontal',v.panel1Label,v.panel2Label,'splitter-live')+
      '<p id="splitter-help" class="get-library-copy ads-no-clamp">Arrow keys resize; Shift adjusts 10%. Home/End use bounds. Enter collapses/restores the first pane.</p>'+
      '<p class="interactive-demo-readout" data-role="live-readout" role="status"></p>'+
      '<button type="button" class="btn btn-ghost" data-role="splitter-reset">Reset saved split</button>';
    var live=window.ADSSplitter.mount(sandbox.querySelector('[data-live-splitter]'),{
      ratio:v.ratio,storageKey:'ads:splitter-demo:v1',label:v.panel1Label,
      output:sandbox.querySelector('[data-role="live-readout"]'),helpId:'splitter-help',
      onChange:function(value){if(ratioInput)ratioInput.value=value.ratio;window.ADS_scheduleRender(render);}
    });
    if(ratioInput){ratioInput.value=live.getState().ratio;ratioInput.addEventListener('change',function(){live.setRatio(currentValues().ratio);});render();}
    sandbox.querySelector('[data-role="splitter-reset"]').addEventListener('click',live.reset);
    function updateLabels(){
      var next=currentValues();
      sandbox.querySelector('[data-splitter-first] .splitter-demo-panel-text').textContent=next.panel1Label;
      sandbox.querySelector('[data-splitter-second] .splitter-demo-panel-text').textContent=next.panel2Label;
      sandbox.querySelector('[data-splitter-divider]').setAttribute('aria-label',next.panel1Label);
    }
    if(panel1Input)panel1Input.addEventListener('input',updateLabels);
    if(panel2Input)panel2Input.addEventListener('input',updateLabels);
    window.addEventListener('pagehide',live.destroy);

  });
})();
