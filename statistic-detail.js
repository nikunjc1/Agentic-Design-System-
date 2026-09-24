(() => {
  "use strict";

  // Statistic is NOT interactive - no hover/focus/disabled states exist for
  // a read-only number display. Its "states" dimension instead represents 4
  // structural/semantic variants (Default/Positive/Negative/Loading), same
  // precedent as Badge/Divider using STATES for non-interaction variants on
  // a non-interactive component.
  var TYPES = [
    { key: "default", label: "Default" },
    { key: "trend", label: "With Trend" },
    { key: "countdown", label: "Countdown" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "positive", label: "Positive" },
    { key: "negative", label: "Negative" },
    { key: "loading", label: "Loading" }
  ];

  var DEFAULT_TITLE = "Active Users";
  var DEFAULT_VALUE = "112,893";
  var DEFAULT_PREFIX = "";
  var DEFAULT_SUFFIX = "";

  var TREND_UP_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
  var TREND_DOWN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Renders one .statistic-demo-field. Loading replaces the whole
  // title+value area with animated skeleton bars - real values are never
  // shown mid-load. Trend adds a colored up/down arrow and a fixed
  // illustrative percentage next to the value; Countdown renders the value
  // in a monospace, timer-like style. Positive/Negative recolor the value
  // (and, for Trend, flip the arrow direction) - Default stays neutral.
  function buildStatisticField(typeKey, stateKey, title, value, prefix, suffix){
    var isLoading = stateKey === "loading";
    var titleHtml = '<p class="statistic-demo-title">' + escapeHtml(title) + "</p>";

    if (isLoading){
      return '<div class="statistic-demo-field">' + titleHtml +
        '<div class="statistic-demo-skeleton" aria-hidden="true"></div>' +
        "</div>";
    }

    var colorClass = (stateKey === "positive" || stateKey === "negative") ? " statistic-demo-value--" + stateKey : "";
    var monoClass = typeKey === "countdown" ? " statistic-demo-value--mono" : "";
    var prefixHtml = prefix ? '<span class="statistic-demo-affix">' + escapeHtml(prefix) + "</span>" : "";
    var suffixHtml = suffix ? '<span class="statistic-demo-affix">' + escapeHtml(suffix) + "</span>" : "";

    var trendHtml = "";
    if (typeKey === "trend"){
      var isDown = stateKey === "negative";
      var trendCls = "statistic-demo-trend" + (stateKey === "positive" ? " statistic-demo-trend--positive" : (stateKey === "negative" ? " statistic-demo-trend--negative" : ""));
      trendHtml = '<span class="' + trendCls + '">' + (isDown ? TREND_DOWN_SVG : TREND_UP_SVG) + "12.5%</span>";
    }

    // The value text is wrapped rather than dropped in as a bare text node:
    // .statistic-demo-value is a flex container, and an ellipsis cannot apply
    // to an anonymous flex item, so a long value would clip mid-glyph with no
    // truncation indicator.
    var valueHtml = '<p class="statistic-demo-value' + colorClass + monoClass + '">' +
      prefixHtml + '<span class="statistic-demo-value-text">' + escapeHtml(value) + "</span>" + suffixHtml + trendHtml + "</p>";

    return '<div class="statistic-demo-field">' + titleHtml + valueHtml + "</div>";
  }

  function buildFullPrompt(title, value, prefix, suffix){
    title = (title || DEFAULT_TITLE).trim() || DEFAULT_TITLE;
    value = (value || DEFAULT_VALUE).trim() || DEFAULT_VALUE;
    prefix = prefix || "";
    suffix = suffix || "";

    var lines = [];
    lines.push("Create a complete Statistic component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, color, title, value, prefix, suffix) - a compact, high-emphasis display for a single quantifiable number, not a one-off big number hard-coded per dashboard tile.");
    lines.push("");
    lines.push("Statistic is not interactive - it has no hover, focus or disabled state. Its variation is structural: 3 types, each in 4 states (which act as semantic colors, not interaction states).");
    lines.push("");
    lines.push("Types (3):");
    lines.push("- Default: a title above a large, bold value, with optional prefix/suffix.");
    lines.push("- With Trend: same as Default, plus a small colored up/down arrow and a percentage change next to the value.");
    lines.push("- Countdown: same as Default, but the value renders in a monospace, timer-like style.");
    lines.push("");
    lines.push("States (4, apply to every type):");
    lines.push("- Default: neutral color (var(--text-hi)).");
    lines.push("- Positive: value (and, for With Trend, the arrow pointing up) in var(--green-500).");
    lines.push("- Negative: value (and, for With Trend, the arrow pointing down) in var(--danger-500).");
    lines.push("- Loading: title stays visible, but the value is replaced by an animated shimmering placeholder bar - never show a stale or fake value while loading.");
    lines.push("");
    lines.push("Component properties: Title (text, e.g. \"" + title + "\"); Value (text, e.g. \"" + value + "\"); Prefix (optional text shown immediately before the value, e.g. a currency symbol) - currently \"" + prefix + "\"; Suffix (optional text shown immediately after the value, e.g. a unit or percent sign) - currently \"" + suffix + "\".");
    return lines.join("\n");
  }

  function buildFullCode(title, value, prefix, suffix){
    title = (title || DEFAULT_TITLE).trim() || DEFAULT_TITLE;
    value = (value || DEFAULT_VALUE).trim() || DEFAULT_VALUE;
    prefix = prefix || "";
    suffix = suffix || "";

    var lines = [];
    lines.push("/* Agentic Design System - Statistic component */");
    lines.push(".statistic-demo-field{ display:flex; flex-direction:column; gap:6px; }");
    lines.push('.statistic-demo-title{ font-family:var(--font-body); font-size:13px; color:var(--text-mid); margin:0; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push('.statistic-demo-value{ font-family:var(--font-body); font-size:28px; font-weight:700; color:var(--text-hi); margin:0; display:flex; align-items:baseline; gap:4px; max-width:260px; min-width:0; overflow:hidden; }');
    lines.push(".statistic-demo-value-text{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".statistic-demo-value--mono{ font-family:var(--font-mono); }");
    lines.push(".statistic-demo-value--positive{ color:var(--green-500); }");
    lines.push(".statistic-demo-value--negative{ color:var(--danger-500); }");
    lines.push(".statistic-demo-affix{ font-size:16px; font-weight:600; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".statistic-demo-trend{ display:inline-flex; align-items:center; gap:2px; font-size:14px; font-weight:600; margin-inline-start:4px; color:var(--text-dim); }");
    lines.push(".statistic-demo-trend svg{ width:14px; height:14px; }");
    lines.push(".statistic-demo-trend--positive{ color:var(--green-500); }");
    lines.push(".statistic-demo-trend--negative{ color:var(--danger-500); }");
    lines.push("");
    lines.push("/* Loading - animated shimmer placeholder, reuses the same shimmer keyframe as Image/Skeleton */");
    lines.push(".statistic-demo-skeleton{ width:120px; height:28px; border-radius:var(--radius-sm); background:linear-gradient(90deg, var(--graphite-800) 25%, var(--graphite-700) 50%, var(--graphite-800) 75%); background-size:200% 100%; animation:image-demo-shimmer var(--duration-shimmer) var(--ease-emphasis) infinite; }");
    lines.push("/* The shimmer is decorative - the placeholder bar already says \"loading\" - so it switches off entirely when reduced motion is requested. */");
    lines.push("@media (prefers-reduced-motion: reduce){ .statistic-demo-skeleton{ animation:none; background:var(--graphite-700); } }");
    lines.push("");
    lines.push("<!-- Example usage - one per type, Default color, at the chosen Title/Value/Prefix/Suffix -->");
    TYPES.forEach(function(t){
      lines.push(buildStatisticField(t.key, "default", title, value, prefix, suffix));
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

    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-statistic"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-statistic"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_TITLE, DEFAULT_VALUE, DEFAULT_PREFIX, DEFAULT_SUFFIX), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_TITLE, DEFAULT_VALUE, DEFAULT_PREFIX, DEFAULT_SUFFIX), cardCopyCodeBtn);
      });
    }
    var statisticTypeCards = document.querySelectorAll(".statistic-type-card[data-system]");
    statisticTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "statistic-" + card.dataset.system + ".html";
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

    var matrixContainer = document.querySelector('[data-role="statistic-matrix-container"]');
    if (!matrixContainer) return;

    var titleInput = document.querySelector('[data-role="statistic-title"]');
    var valueInput = document.querySelector('[data-role="statistic-value"]');
    var prefixInput = document.querySelector('[data-role="statistic-prefix"]');
    var suffixInput = document.querySelector('[data-role="statistic-suffix"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(title, value, prefix, suffix){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildStatisticField(t.key, state.key, title, value, prefix, suffix) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      var title = (titleInput ? titleInput.value.trim() : "") || DEFAULT_TITLE;
      var value = (valueInput ? valueInput.value.trim() : "") || DEFAULT_VALUE;
      var prefix = prefixInput ? prefixInput.value : DEFAULT_PREFIX;
      var suffix = suffixInput ? suffixInput.value : DEFAULT_SUFFIX;
      return { title: title, value: value, prefix: prefix, suffix: suffix };
    }

    function render(){
      var v = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(v.title, v.value, v.prefix, v.suffix);

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(v.title, v.value, v.prefix, v.suffix); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(v.title, v.value, v.prefix, v.suffix); }, [], function(){ return ""; });
    }

    if (titleInput) titleInput.addEventListener("input", render);
    if (valueInput) valueInput.addEventListener("input", render);
    if (prefixInput) prefixInput.addEventListener("input", render);
    if (suffixInput) suffixInput.addEventListener("input", render);

    render();
  });
})();
