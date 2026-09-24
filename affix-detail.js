(() => {
  "use strict";

  // Affix's real behavior only triggers on an actual scroll event past a
  // threshold. Since the Live Preview matrix renders static cells, "Rest"
  // and "Affixed" are honest simulated snapshots of the two positions a
  // real Affix would occupy - not a fake interaction state, same precedent
  // as Popover/Tour showing an "Open"/mid-sequence state as a static cell.
  var TYPES = [
    { key: "top", label: "Top" },
    { key: "bottom", label: "Bottom" }
  ];
  var STATES = [
    { key: "rest", label: "Rest" },
    { key: "affixed", label: "Affixed" },
    { key: "disabled", label: "Disabled" }
  ];

  var DEFAULT_LABEL = "Filter toolbar";
  var DEFAULT_OFFSET = 8;

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Renders one .affix-demo-viewport - a small bordered "page" with two
  // hardcoded placeholder content lines and the affixable bar. In Affixed,
  // the bar gets position:absolute pinned to its type's edge (top or
  // bottom) at the configured offset, plus a shadow and an "Affixed" badge.
  // In Rest/Disabled it sits in the normal document flow, unshadowed.
  function buildAffixField(typeKey, stateKey, label, offset){
    var isAffixed = stateKey === "affixed";
    var isDisabled = stateKey === "disabled";
    var barCls = "affix-demo-bar affix-demo-bar--" + typeKey + (isAffixed ? " is-affixed" : "") + (isDisabled ? " is-disabled" : "");
    var positionStyle = isAffixed ? ' style="' + (typeKey === "top" ? "top" : "bottom") + ":" + offset + 'px;"' : "";
    var badgeHtml = isAffixed ? '<span class="affix-demo-badge">Affixed</span>' : (isDisabled ? '<span class="affix-demo-badge affix-demo-badge--muted">Off</span>' : "");
    var barHtml = '<div class="' + barCls + '"' + positionStyle + '><span>' + escapeHtml(label) + "</span>" + badgeHtml + "</div>";

    return '<div class="affix-demo-viewport">' +
      '<div class="affix-demo-content-line"></div>' +
      '<div class="affix-demo-content-line affix-demo-content-line--short"></div>' +
      barHtml +
      '<div class="affix-demo-content-line"></div>' +
      "</div>";
  }

  function buildFullPrompt(label, offset){
    label = (label || DEFAULT_LABEL).trim() || DEFAULT_LABEL;
    offset = (offset === undefined || offset === null || isNaN(offset) || offset < 0) ? DEFAULT_OFFSET : offset;

    var lines = [];
    lines.push("Create a complete Affix component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, offset, state, content) - a wrapper that pins its child element to the viewport once the page scrolls past the child's original position, so it stays reachable.");
    lines.push("");
    lines.push("Types (2):");
    lines.push("- Top: pins the element " + offset + "px from the top of the viewport once scrolled past.");
    lines.push("- Bottom: pins the element " + offset + "px from the bottom of the viewport once scrolled past.");
    lines.push("");
    lines.push("States (3):");
    lines.push("- Rest: the element sits in its normal position in the page flow - not yet affixed.");
    lines.push("- Affixed: the element is pinned to its edge, visually lifted with a shadow and a slightly stronger border/background so it reads as detached from the page flow beneath it.");
    lines.push("- Disabled: affix behavior is turned off entirely - the element always stays in its normal flow position, shown dimmed here to distinguish it from Rest.");
    lines.push("");
    lines.push("Component properties: Content label (text, e.g. \"" + label + "\" - the content being pinned, such as a toolbar or a call-to-action); Offset (number, px from the edge once affixed) - currently " + offset + ".");
    return lines.join("\n");
  }

  function buildFullCode(label, offset){
    label = (label || DEFAULT_LABEL).trim() || DEFAULT_LABEL;
    offset = (offset === undefined || offset === null || isNaN(offset) || offset < 0) ? DEFAULT_OFFSET : offset;

    var lines = [];
    lines.push("/* Agentic Design System - Affix component */");
    lines.push(".affix-demo-viewport{ position:relative; width:220px; height:140px; overflow:hidden; box-sizing:border-box; border:1px solid var(--line-strong); border-radius:var(--radius-md); background:var(--graphite-900); padding:8px; display:flex; flex-direction:column; gap:8px; }");
    lines.push(".affix-demo-content-line{ flex:none; height:10px; border-radius:4px; background:var(--graphite-800); }");
    lines.push(".affix-demo-content-line--short{ width:60%; }");
    lines.push('.affix-demo-bar{ flex:none; box-sizing:border-box; display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 10px; border-radius:var(--radius-sm); background:var(--graphite-800); border:1px solid var(--line-strong); font-family:var(--font-body); font-size:12px; font-weight:600; color:var(--text-hi); }');
    lines.push(".affix-demo-bar.is-affixed{ position:absolute; left:8px; right:8px; background:var(--graphite-700); border-color:var(--red-500); box-shadow:0 4px 12px rgba(0,0,0,0.4); z-index:1; }");
    lines.push(".affix-demo-bar.is-disabled{ opacity:0.4; }");
    lines.push('.affix-demo-badge{ font-family:var(--font-mono); font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:var(--red-400); flex:none; }');
    lines.push(".affix-demo-badge--muted{ color:var(--text-dim); }");
    lines.push("");
    lines.push("<!-- Example usage - one per type, Rest state, at the chosen Content label/Offset -->");
    TYPES.forEach(function(t){
      lines.push(buildAffixField(t.key, "rest", label, offset));
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

    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-affix"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-affix"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_LABEL, DEFAULT_OFFSET), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_LABEL, DEFAULT_OFFSET), cardCopyCodeBtn);
      });
    }
    var affixTypeCards = document.querySelectorAll(".affix-type-card[data-system]");
    affixTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "affix-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="affix-matrix-container"]');
    if (!matrixContainer) return;

    var labelInput = document.querySelector('[data-role="affix-label"]');
    var offsetInput = document.querySelector('[data-role="affix-offset"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(label, offset){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildAffixField(t.key, state.key, label, offset) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      var label = (labelInput ? labelInput.value.trim() : "") || DEFAULT_LABEL;
      var offset = offsetInput ? parseInt(offsetInput.value, 10) : DEFAULT_OFFSET;
      if (isNaN(offset) || offset < 0) offset = DEFAULT_OFFSET;
      return { label: label, offset: offset };
    }

    function render(){
      var v = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(v.label, v.offset);

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(v.label, v.offset); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(v.label, v.offset); }, [], function(){ return ""; });
    }

    if (labelInput) labelInput.addEventListener("input", render);
    if (offsetInput) offsetInput.addEventListener("input", render);

    render();

    // ---- interactive sandbox -------------------------------------------
    // Affix is defined by a scroll threshold, which a static matrix cell can
    // only ever approximate. Here the bar genuinely pins itself once its
    // original position scrolls out of view, and releases when it comes back.
    var sandbox = document.querySelector('[data-role="affix-interactive"]');
    if (!sandbox) return;

    function renderSandbox(){
      var v = currentValues();
      var filler = "";
      for (var i = 0; i < 10; i++){
        filler += '<div class="affix-live-line"></div>';
      }
      sandbox.innerHTML =
        '<div class="affix-live-scroll" data-role="live-scroll">' +
          '<div class="affix-live-inner">' +
            '<div class="affix-live-line"></div>' +
            '<div class="affix-live-line affix-live-line--short"></div>' +
            '<div class="affix-live-sentinel" data-role="live-sentinel"></div>' +
            '<div class="affix-demo-bar affix-demo-bar--top" data-role="live-bar">' +
              "<span>" + escapeHtml(v.label) + "</span>" +
              '<span class="affix-demo-badge" data-role="live-badge" hidden>Affixed</span>' +
            "</div>" +
            filler +
          "</div>" +
        "</div>" +
        '<p class="interactive-demo-readout">Scroll inside the frame - the bar pins itself once it reaches the top.</p>';

      var scroller = sandbox.querySelector('[data-role="live-scroll"]');
      var sentinel = sandbox.querySelector('[data-role="live-sentinel"]');
      var bar = sandbox.querySelector('[data-role="live-bar"]');
      var badge = sandbox.querySelector('[data-role="live-badge"]');
      if (!scroller || !sentinel || !bar) return;

      // The sentinel marks where the bar sits naturally. Comparing the two
      // rects means the threshold is wherever the bar actually is, rather
      // than a magic scroll number that breaks the moment content above it
      // changes height.
      function sync(){
        var stuck = sentinel.getBoundingClientRect().top <= scroller.getBoundingClientRect().top + v.offset;
        bar.classList.toggle("is-affixed", stuck);
        bar.style.top = stuck ? v.offset + "px" : "";
        if (badge) badge.hidden = !stuck;
      }
      scroller.addEventListener("scroll", sync);
      sync();
    }

    if (labelInput) labelInput.addEventListener("input", renderSandbox);
    if (offsetInput) offsetInput.addEventListener("input", renderSandbox);

    renderSandbox();
  });
})();
