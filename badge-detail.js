(() => {
  "use strict";

  // Badge is NOT interactive - no hover/focus/disabled states exist for a
  // small indicator. Its "states" dimension instead represents the 4
  // semantic colors (Default/Success/Warning/Info), an honest structural
  // difference rather than a fake interaction state - same precedent as
  // Divider using STATES for structural/color variants on a non-interactive
  // component, so there is no liveCssFor()/pseudo-class logic anywhere in
  // this file.
  var TYPES = [
    { key: "count", label: "Count" },
    { key: "dot", label: "Dot" },
    { key: "status", label: "Status" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "success", label: "Success" },
    { key: "warning", label: "Warning" },
    { key: "info", label: "Info" }
  ];

  var STATE_COLOR_VAR = {
    default: "--red-500",
    success: "--green-500",
    warning: "--amber-500",
    info: "--blue-500"
  };

  var DEFAULT_COUNT = 5;
  var DEFAULT_MAX = 99;
  var DEFAULT_LABEL = "Active";

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function displayCount(count, max){
    count = Math.max(0, count);
    max = Math.max(1, max);
    return count > max ? max + "+" : String(count);
  }

  // Renders one badge example. "count" and "dot" both overlay a small
  // .badge-demo-badge on the top-right corner of a .badge-demo-host icon
  // placeholder, wrapped in a relatively-positioned .badge-demo-host-wrap.
  // "status" is standalone - an inline dot + text label, not overlaid on
  // anything, so it gets no host icon at all.
  function buildBadgeField(typeKey, stateKey, count, max, label){
    if (typeKey === "count" || typeKey === "dot"){
      var hostSvg = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M12 3C9.79 3 8 4.79 8 7v3.28c0 .53-.21 1.04-.59 1.41L6 13.1V15h12v-1.9l-1.41-1.41A2 2 0 0 1 16 10.28V7c0-2.21-1.79-4-4-4z" fill="currentColor" />' +
        '<path d="M9.5 17a2.5 2.5 0 0 0 5 0h-5z" fill="currentColor" />' +
        "</svg>";
      var badgeInner = typeKey === "count"
        ? '<span class="badge-demo-count">' + escapeHtml(displayCount(count, max)) + "</span>"
        : '<span class="badge-demo-dot"></span>';
      return '<div class="badge-demo-host-wrap">' +
        '<div class="badge-demo-host">' + hostSvg + "</div>" +
        '<span class="badge-demo-badge badge-demo-badge--' + stateKey + '">' + badgeInner + "</span>" +
        "</div>";
    }
    // status - standalone inline dot + text label, no host icon
    var labelText = escapeHtml((label || DEFAULT_LABEL).trim() || DEFAULT_LABEL);
    return '<div class="badge-demo-status-row">' +
      '<span class="badge-demo-status-dot--' + stateKey + '"></span>' +
      '<span class="badge-demo-status-label">' + labelText + "</span>" +
      "</div>";
  }

  function buildFullPrompt(count, max, label){
    count = (count === undefined || count === null || isNaN(count)) ? DEFAULT_COUNT : count;
    max = (max === undefined || max === null || isNaN(max) || max < 1) ? DEFAULT_MAX : max;
    label = (label || DEFAULT_LABEL).trim() || DEFAULT_LABEL;

    var lines = [];
    lines.push("Create a complete Badge component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (form, color) - a small indicator, not a one-off number or dot hard-coded per screen.");
    lines.push("");
    lines.push("Badge is not interactive - unlike most components in this system, it has no hover, focus or disabled state. Its variation is purely structural: 3 forms, each in 4 semantic colors.");
    lines.push("");
    lines.push("Forms (3):");
    lines.push("- Count: a small numeric pill overlaid on the top-right corner of a host element (an icon or button). Shows the current Count value, capping the display at \"" + max + "+\" once Count exceeds the configured Max count.");
    lines.push("- Dot: a small plain dot overlaid on the top-right corner of a host element, with no number - just signals \"there's something new\".");
    lines.push("- Status: an inline dot plus a text label (e.g. \"" + label + "\"), used standalone rather than overlaid on anything.");
    lines.push("");
    lines.push("Colors (4, apply to every form): Default (var(--red-500), this system's brand red), Success (var(--green-500)), Warning (var(--amber-500)), Info (var(--blue-500)).");
    lines.push("");
    lines.push("Component properties: Count (number, applies only to the Count type) - currently " + count + ". Max count (number, applies only to the Count type, caps the displayed value at \"N+\" once Count exceeds it) - currently " + max + ". Status label (string, applies only to the Status type) - currently \"" + label + "\".");
    return lines.join("\n");
  }

  function buildFullCode(count, max, label){
    count = (count === undefined || count === null || isNaN(count)) ? DEFAULT_COUNT : count;
    max = (max === undefined || max === null || isNaN(max) || max < 1) ? DEFAULT_MAX : max;
    label = (label || DEFAULT_LABEL).trim() || DEFAULT_LABEL;

    var lines = [];
    lines.push("/* Agentic Design System - Badge component */");
    lines.push(".badge-demo-host-wrap{ display:inline-flex; position:relative; }");
    lines.push(".badge-demo-host{ width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:var(--graphite-800); border:1px solid var(--line-strong); border-radius:var(--radius-md); color:var(--text-dim); }");
    lines.push(".badge-demo-host svg{ width:16px; height:16px; }");
    lines.push(".badge-demo-badge{ position:absolute; top:-6px; right:-6px; display:flex; align-items:center; justify-content:center; border:2px solid var(--graphite-950); border-radius:9999px; box-sizing:border-box; }");
    lines.push(".badge-demo-count{ min-width:18px; height:18px; padding:0 5px; border-radius:9999px; font-family:var(--font-body); font-size:11px; font-weight:700; color:#FFFFFF; display:flex; align-items:center; justify-content:center; }");
    lines.push(".badge-demo-dot{ width:10px; height:10px; border-radius:9999px; }");
    lines.push("");
    lines.push("/* Colors (4) - applied to both the Count pill and the Dot */");
    STATES.forEach(function(s){
      var colorVar = "var(" + STATE_COLOR_VAR[s.key] + ")";
      lines.push(".badge-demo-badge--" + s.key + " .badge-demo-count, .badge-demo-badge--" + s.key + " .badge-demo-dot{ background:" + colorVar + "; }");
    });
    lines.push("");
    lines.push("/* Status - standalone inline dot + text label, not overlaid on a host */");
    lines.push(".badge-demo-status-row{ display:inline-flex; align-items:center; gap:8px; }");
    STATES.forEach(function(s){
      var colorVar = "var(" + STATE_COLOR_VAR[s.key] + ")";
      lines.push(".badge-demo-status-dot--" + s.key + "{ width:10px; height:10px; border-radius:9999px; background:" + colorVar + "; }");
    });
    lines.push(".badge-demo-status-label{ font-family:var(--font-body); font-size:13px; color:var(--text-hi); }");
    lines.push("");
    lines.push("<!-- Example usage - one per form, Default color, at the chosen Count/Max count/Status label -->");
    lines.push(buildBadgeField("count", "default", count, max, label));
    lines.push(buildBadgeField("dot", "default", count, max, label));
    lines.push(buildBadgeField("status", "default", count, max, label));
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

    // Gallery-card copy CTA + click-to-navigate (badge.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-badge"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-badge"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_COUNT, DEFAULT_MAX, DEFAULT_LABEL), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_COUNT, DEFAULT_MAX, DEFAULT_LABEL), cardCopyCodeBtn);
      });
    }
    var badgeTypeCards = document.querySelectorAll(".badge-type-card[data-system]");
    badgeTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "badge-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button or, whenever more
    // than one combo is passed in, a disclosure dropdown listing each combo
    // by name with its own "Copy" button. Badge has no multiselect property
    // (Count/Max count/Status label are plain number/text inputs), so it
    // always calls this with an empty combos array - the "0 or 1 combos =
    // plain button" branch every existing driver script already has.
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

    var matrixContainer = document.querySelector('[data-role="badge-matrix-container"]');
    if (!matrixContainer) return;

    var countInput = document.querySelector('[data-role="badge-count"]');
    var maxInput = document.querySelector('[data-role="badge-max"]');
    var labelInput = document.querySelector('[data-role="badge-label"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    // Single matrix, TYPES x STATES (3 x 4 = 12 cells) - no combo system at
    // all, since Count/Max count/Status label are plain text/number inputs
    // rather than a multiselect-driven property.
    function buildMatrixSection(count, max, label){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildBadgeField(t.key, state.key, count, max, label) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      var count = countInput ? parseInt(countInput.value, 10) : DEFAULT_COUNT;
      var max = maxInput ? parseInt(maxInput.value, 10) : DEFAULT_MAX;
      if (isNaN(count) || count < 0) count = DEFAULT_COUNT;
      if (isNaN(max) || max < 1) max = DEFAULT_MAX;
      var label = (labelInput ? labelInput.value.trim() : "") || DEFAULT_LABEL;
      return { count: count, max: max, label: label };
    }

    function render(){
      var values = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(values.count, values.max, values.label);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(values.count, values.max, values.label); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(values.count, values.max, values.label); }, [], function(){ return ""; });
    }

    if (countInput) countInput.addEventListener("input", render);
    if (maxInput) maxInput.addEventListener("input", render);
    if (labelInput) labelInput.addEventListener("input", render);

    render();
  });
})();
