(() => {
  "use strict";

  // Timeline has 2 layouts (dot position / content alignment) and 3 states
  // (which events are highlighted). Show icons is a plain boolean, not a
  // multiselect property, so - like Divider's driver script - there is no
  // combos array/dropdown copy control here, just a single matrix at the
  // current checkbox value.
  var TYPES = [
    { key: "default", label: "Default" },
    { key: "alternate", label: "Alternate" },
    { key: "horizontal", label: "Horizontal" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "with-events", label: "With events" },
    { key: "pending", label: "Pending" }
  ];

  // Fixed 3-event dataset shared by every cell of the matrix and by the
  // listing card's own preview. The "pending" state appends a 4th trailing
  // placeholder item on top of this list - it is never part of the dataset
  // itself.
  var EVENTS = [
    { title: "Order placed", time: "Sep 10, 9:02 AM" },
    { title: "Payment confirmed", time: "Sep 10, 9:05 AM" },
    { title: "Shipped", time: "Sep 11, 2:30 PM" }
  ];

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function iconMarkerHtml(isCurrent){
    return '<svg class="timeline-demo-icon' + (isCurrent ? " is-current" : "") + '" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle class="timeline-demo-icon-bg" cx="7" cy="7" r="7"></circle>' +
      '<path d="M4 7.2l2 2 4-4.4" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>' +
      "</svg>";
  }

  // Renders one full timeline list for a given layout/state/show-icons
  // combination. Each item is a marker column (dot or icon, plus a
  // connector line below it) and a content column (title + timestamp).
  //
  // Pending state note: a 4th trailing placeholder item is appended. It is
  // the last item, so per the "no connector on the last item" rule it gets
  // no connector of its own - instead the dashed "more to come" segment
  // that visually sits above it is the *third* real event's connector,
  // which gets the is-pending modifier since it is the segment leading
  // into the placeholder. The placeholder's own dot also gets is-pending
  // (dimmed, smaller), matching the spec's "dimmed placeholder dot with a
  // dashed segment of connecting line above it".
  function buildTimelineField(typeKey, stateKey, showIcons){
    var items = EVENTS.map(function(ev){
      return { title: ev.title, time: ev.time, pending: false };
    });
    if (stateKey === "pending"){
      items.push({ title: "Pending...", time: "", pending: true });
    }
    var isAlternate = typeKey === "alternate";

    var itemsHtml = items.map(function(item, i){
      var isLast = i === items.length - 1;
      var isCurrent = stateKey === "with-events" && i === 1 && !item.pending;
      var nextIsPending = !!(items[i + 1] && items[i + 1].pending);

      var markerHtml;
      if (item.pending){
        markerHtml = '<span class="timeline-demo-dot is-pending"></span>';
      } else if (showIcons){
        markerHtml = iconMarkerHtml(isCurrent);
      } else {
        markerHtml = '<span class="timeline-demo-dot' + (isCurrent ? " is-current" : "") + '"></span>';
      }

      var connectorHtml = "";
      if (!isLast){
        connectorHtml = '<span class="timeline-demo-connector' + (nextIsPending ? " is-pending" : "") + '"></span>';
      }

      var titleHtml = '<p class="timeline-demo-title' + (isCurrent ? " is-current" : "") + '">' + escapeHtml(item.title) + "</p>";
      var timeHtml = item.time ? '<p class="timeline-demo-time">' + escapeHtml(item.time) + "</p>" : "";

      var sideCls = "";
      if (isAlternate){
        sideCls = i % 2 === 0 ? " timeline-demo-item--right" : " timeline-demo-item--left";
      }

      return '<div class="timeline-demo-item' + sideCls + '">' +
        '<div class="timeline-demo-marker">' + markerHtml + connectorHtml + "</div>" +
        '<div class="timeline-demo-content">' + titleHtml + timeHtml + "</div>" +
        "</div>";
    }).join("");

    return '<div class="timeline-demo-list timeline-demo-list--' + typeKey + '">' + itemsHtml + "</div>";
  }

  function buildFullPrompt(showIcons){
    var lines = [];
    lines.push("Create a complete Timeline component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (layout, state, show icons) - a vertical list of chronological events, each with a dot (or optional status icon) connected by a continuous vertical line, used for activity logs, order status history, or a project's milestone history.");
    lines.push("");
    lines.push("Layouts (3):");
    lines.push("- Default: dots aligned to the left, with every event's title and timestamp to the right of the connecting line, stacked vertically.");
    lines.push("- Alternate: dots centered on the line, with event content alternating left and right of it for odd/even events - a classic alternating vertical timeline layout.");
    lines.push("- Horizontal: events flow left to right along a single horizontal line, with each dot centered above its own title and timestamp.");
    lines.push("");
    lines.push("States (3):");
    lines.push("- Default: plain, neutral-colored dots (or icons) - every event reads as complete/neutral, with no emphasis on any one item.");
    lines.push("- With events: the same events, but the current/in-progress event (the second one) gets an accent-colored dot and a bolder title, so it stands out from the events around it.");
    lines.push("- Pending: the same events plus a trailing, dimmed placeholder item with a dashed segment of connecting line above it and no timestamp (just \"Pending...\"), indicating more events are still to come.");
    lines.push("");
    lines.push("Component properties: Show icons (boolean, default off) - " + (showIcons ? "ON, so every dot is replaced with a small colored status icon (a checkmark in a circle)." : "OFF, so every event shows a plain dot rather than an icon.") + " The current event in the \"With events\" state and the pending placeholder keep their own accent/dimmed coloring regardless of this setting.");
    return lines.join("\n");
  }

  function buildFullCode(showIcons){
    var lines = [];
    lines.push("/* Agentic Design System - Timeline component */");
    lines.push(".timeline-demo-list{ display:flex; flex-direction:column; width:240px; }");
    lines.push(".timeline-demo-item{ display:flex; gap:12px; }");
    lines.push(".timeline-demo-marker{ flex:none; display:flex; flex-direction:column; align-items:center; width:16px; }");
    lines.push(".timeline-demo-dot{ width:10px; height:10px; border-radius:9999px; background:var(--graphite-600); border:2px solid var(--graphite-900); flex:none; }");
    lines.push(".timeline-demo-dot.is-current{ background:var(--red-500); }");
    lines.push(".timeline-demo-dot.is-pending{ background:var(--graphite-700); }");
    lines.push(".timeline-demo-connector{ width:2px; flex:1 1 auto; min-height:24px; background:var(--line-strong); }");
    lines.push(".timeline-demo-connector.is-pending{ background:repeating-linear-gradient(to bottom, var(--line-strong) 0 3px, transparent 3px 6px); }");
    lines.push(".timeline-demo-content{ padding-bottom:16px; }");
    lines.push(".timeline-demo-title{ font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--text-hi); margin:0; }");
    lines.push(".timeline-demo-title.is-current{ color:var(--red-400); }");
    lines.push(".timeline-demo-time{ font-family:var(--font-body); font-size:11px; color:var(--text-dim); margin:2px 0 0; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push("");
    lines.push("/* Alternate layout - a 3-column grid keeps the marker in a fixed center");
    lines.push("   column so the connecting line stays continuous; only the content column");
    lines.push("   (1 or 3) flips per item, alternating which side it sits on. grid-row:1 on");
    lines.push("   both cells is required, not decorative - without it, a left-side item's");
    lines.push("   content (column 1, placed after the marker's column 2 in DOM order)");
    lines.push("   silently wraps to row 2 under CSS Grid's sparse auto-placement, since it");
    lines.push("   can't place \"backward\" of the marker within the same row. */");
    lines.push(".timeline-demo-list--alternate .timeline-demo-item{ display:grid; grid-template-columns:1fr 16px 1fr; column-gap:12px; align-items:start; }");
    lines.push(".timeline-demo-list--alternate .timeline-demo-marker{ grid-column:2; grid-row:1; }");
    lines.push(".timeline-demo-list--alternate .timeline-demo-content{ grid-column:3; grid-row:1; text-align: start; }");
    lines.push(".timeline-demo-list--alternate .timeline-demo-item--left .timeline-demo-content{ grid-column:1; text-align: end; }");
    lines.push("");
    lines.push("/* Horizontal layout - items flow left to right; each dot sits centered");
    lines.push("   in its own item slot, and the connector is a line from this dot's");
    lines.push("   center spanning the full item width to reach the next dot's center.");
    lines.push("   gap:0 overrides .timeline-demo-item's base gap:12px, which is sized for");
    lines.push("   the vertical layouts (horizontal space between marker and content side");
    lines.push("   by side) - flipping to flex-direction:column here turns that into a");
    lines.push("   second vertical gap stacked on .timeline-demo-content's own deliberate");
    lines.push("   padding-top:10px below, so without this override the connector-to-");
    lines.push("   heading gap would be 22px instead of the intended 10px. */");
    lines.push(".timeline-demo-list--horizontal{ flex-direction:row; width:auto; }");
    lines.push(".timeline-demo-list--horizontal .timeline-demo-item{ flex:1 1 0; flex-direction:column; align-items:center; min-width:72px; gap:0; }");
    lines.push(".timeline-demo-list--horizontal .timeline-demo-marker{ position:relative; flex-direction:row; justify-content:center; width:100%; height:16px; }");
    lines.push(".timeline-demo-list--horizontal .timeline-demo-connector{ position:absolute; top:50%; left:50%; width:100%; height:2px; min-height:0; transform:translateY(-50%); }");
    lines.push(".timeline-demo-list--horizontal .timeline-demo-dot,");
    lines.push(".timeline-demo-list--horizontal .timeline-demo-icon{ position:relative; }");
    lines.push(".timeline-demo-list--horizontal .timeline-demo-content{ padding-bottom:0; padding-top:10px; text-align:center; }");
    if (showIcons){
      lines.push("");
      lines.push("/* Show icons - replaces the plain dot with a small checkmark-in-circle status icon */");
      lines.push(".timeline-demo-icon-bg{ fill:var(--graphite-600); }");
      lines.push(".timeline-demo-icon.is-current .timeline-demo-icon-bg{ fill:var(--red-500); }");
    }
    lines.push("");
    lines.push("<!-- Example usage - Default layout, With events state -->");
    lines.push('<div class="timeline-demo-list timeline-demo-list--default">');
    EVENTS.forEach(function(ev, i){
      var isCurrent = i === 1;
      var isLast = i === EVENTS.length - 1;
      lines.push('  <div class="timeline-demo-item">');
      lines.push('    <div class="timeline-demo-marker">');
      if (showIcons){
        lines.push('      ' + iconMarkerHtml(isCurrent));
      } else {
        lines.push('      <span class="timeline-demo-dot' + (isCurrent ? " is-current" : "") + '"></span>');
      }
      if (!isLast) lines.push('      <span class="timeline-demo-connector"></span>');
      lines.push('    </div>');
      lines.push('    <div class="timeline-demo-content">');
      lines.push('      <p class="timeline-demo-title' + (isCurrent ? " is-current" : "") + '">' + escapeHtml(ev.title) + "</p>");
      lines.push('      <p class="timeline-demo-time">' + escapeHtml(ev.time) + "</p>");
      lines.push('    </div>');
      lines.push('  </div>');
    });
    lines.push('</div>');
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

    // Gallery-card copy CTA + click-to-navigate (timeline.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-timeline"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-timeline"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(false), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(false), cardCopyCodeBtn);
      });
    }
    var timelineTypeCards = document.querySelectorAll(".timeline-type-card[data-system]");
    timelineTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "timeline-" + card.dataset.system + ".html";
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
    // than one combo is passed in, a disclosure dropdown listing each combo
    // by name with its own "Copy" button. Timeline has no multiselect
    // property (Show icons is a plain checkbox), so it always calls this
    // with an empty combos array - the "0 or 1 combos = plain button"
    // branch every existing driver script already has.
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

    var matrixContainer = document.querySelector('[data-role="timeline-matrix-container"]');
    if (!matrixContainer) return;

    var showIconsInput = document.querySelector('[data-role="timeline-show-icons"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(showIcons){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildTimelineField(t.key, state.key, showIcons) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function render(){
      var showIcons = !!(showIconsInput && showIconsInput.checked);
      matrixContainer.innerHTML = buildMatrixSection(showIcons);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(showIcons); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(showIcons); }, [], function(){ return ""; });
    }

    if (showIconsInput) showIconsInput.addEventListener("change", render);

    render();
  });
})();
