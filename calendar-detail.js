(() => {
  "use strict";

  var TYPES = [
    { key: "full", label: "Full" },
    { key: "compact", label: "Compact" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "with-events", label: "With events" },
    { key: "range-preview", label: "Range preview" }
  ];

  // Hard-coded example month - September 2026. September 1, 2026 falls on
  // a Tuesday (verified), and "today" is fixed at the 16th (a Wednesday),
  // matching this system's convention of static, non-computed demo content
  // rather than a real date-math widget. Two separate 42-cell grids cover
  // both week-start options rather than reflowing one grid at render time,
  // since the boundary (which days are "outside the month") genuinely
  // shifts by one full day between the two layouts.
  var GRID_SUNDAY_START = [
    { day: 30, outside: true }, { day: 31, outside: true }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 },
    { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 },
    { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 },
    { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 },
    { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 1, outside: true }, { day: 2, outside: true }, { day: 3, outside: true },
    { day: 4, outside: true }, { day: 5, outside: true }, { day: 6, outside: true }, { day: 7, outside: true }, { day: 8, outside: true }, { day: 9, outside: true }, { day: 10, outside: true }
  ];
  var GRID_MONDAY_START = [
    { day: 31, outside: true }, { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 },
    { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13 },
    { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 },
    { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 },
    { day: 28 }, { day: 29 }, { day: 30 }, { day: 1, outside: true }, { day: 2, outside: true }, { day: 3, outside: true }, { day: 4, outside: true },
    { day: 5, outside: true }, { day: 6, outside: true }, { day: 7, outside: true }, { day: 8, outside: true }, { day: 9, outside: true }, { day: 10, outside: true }, { day: 11, outside: true }
  ];
  var WEEKDAYS_SUNDAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  var WEEKDAYS_MONDAY = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  var TODAY_DAY = 16;
  var EVENT_DAYS = [5, 20];
  var RANGE_DAYS = { start: 10, middle: 11, end: 12 };

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  function buildFullPrompt(){
    var lines = [];
    lines.push("Create a complete Calendar component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (size, month label, first day of week) - a full month grid embedded directly in the page, not a date-picker's small popup trigger.");
    lines.push("");
    lines.push("Types (2):");
    lines.push("- Full: larger day cells (36px), suited to a primary scheduling or booking view.");
    lines.push("- Compact: smaller day cells (26px), condensed for a sidebar-style mini calendar.");
    lines.push("");
    lines.push("States (3, content variations, not interaction states - Calendar is not interactive):");
    lines.push("- Default: plain grid, today highlighted, no events.");
    lines.push("- With events: 2 specific days additionally show a small event indicator dot.");
    lines.push("- Range preview: a run of 3 consecutive days share a highlighted background, simulating a date-range selection preview, with rounded end-caps only on the first and last day of the run.");
    lines.push("");
    lines.push("Structure: a month/year header, a row of 7 day-of-week column labels, and a 6-row grid of day cells (42 cells) including dimmed overflow days from the adjacent previous/next month so the grid is always fully populated.");
    lines.push("");
    lines.push("Component properties: Month label (text, default \"September 2026\"); First day of week (Sunday/Monday - reflows which day starts each week and which days fall outside the current month at the grid's edges).");
    return lines.join("\n");
  }

  function buildFullCode(){
    var textHi = getCssVar("--text-hi", "#F3F2EF");
    var textDim = getCssVar("--text-dim", "#64686F");
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var graphite900 = getCssVar("--graphite-900", "#15171A");
    var red500 = getCssVar("--red-500", "#FF031A");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.1)");
    var red400 = getCssVar("--red-400", "#FF3F4F");
    var blue500 = getCssVar("--blue-500", "#4F8FE6");

    var lines = [];
    lines.push("/* Agentic Design System - Calendar component */");
    lines.push(".calendar-demo-grid{ box-sizing:border-box; background:" + graphite900 + "; border:1px solid " + lineStrong + "; border-radius:var(--radius-md); padding:10px; width:fit-content; }");
    lines.push('.calendar-demo-header{ text-align:center; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:13px; font-weight:600; color:' + textHi + "; margin-bottom:8px; }");
    lines.push(".calendar-demo-weekdays{ display:grid; grid-template-columns:repeat(7,1fr); gap:2px; margin-bottom:4px; }");
    lines.push('.calendar-demo-weekday{ font-family:"Inter",ui-sans-serif,system-ui,sans-serif; font-size:10px; font-weight:600; color:' + textDim + "; text-align:center; text-transform:uppercase; }");
    lines.push(".calendar-demo-days{ display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }");
    lines.push('.calendar-demo-day{ box-sizing:border-box; display:flex; align-items:center; justify-content:center; position:relative; font-family:"Inter",ui-sans-serif,system-ui,sans-serif; color:' + textHi + "; border-radius:6px; }");
    lines.push(".calendar-demo-grid--full .calendar-demo-day{ width:36px; height:36px; font-size:13px; }");
    lines.push(".calendar-demo-grid--compact .calendar-demo-day{ width:26px; height:26px; font-size:11px; }");
    lines.push(".calendar-demo-day.is-outside-month{ color:" + textDim + "; opacity:0.4; }");
    lines.push(".calendar-demo-day.is-today{ background:" + red500 + "; color:#FFFFFF; font-weight:700; }");
    lines.push('.calendar-demo-day.has-event::after{ content:""; position:absolute; bottom:3px; left:50%; transform:translateX(-50%); width:4px; height:4px; border-radius:9999px; background:' + blue500 + "; }");
    lines.push(".calendar-demo-day.is-range-start, .calendar-demo-day.is-range-middle, .calendar-demo-day.is-range-end{ background:" + redTint + "; color:" + red400 + "; }");
    lines.push(".calendar-demo-day.is-range-start{ border-top-left-radius:6px; border-bottom-left-radius:6px; }");
    lines.push(".calendar-demo-day.is-range-end{ border-top-right-radius:6px; border-bottom-right-radius:6px; }");
    lines.push(".calendar-demo-day.is-range-middle{ border-radius:0; }");
    lines.push("");
    lines.push("<!-- Example usage - Full type, With events state, Sunday-start week -->");
    lines.push('<div class="calendar-demo-grid calendar-demo-grid--full">');
    lines.push('  <div class="calendar-demo-header">September 2026</div>');
    lines.push('  <div class="calendar-demo-weekdays">');
    WEEKDAYS_SUNDAY.forEach(function(w){ lines.push('    <span class="calendar-demo-weekday">' + w + "</span>"); });
    lines.push("  </div>");
    lines.push('  <div class="calendar-demo-days">');
    GRID_SUNDAY_START.forEach(function(cell){
      var cls = buildDayClasses(cell, "with-events");
      lines.push('    <div class="' + cls + '">' + cell.day + "</div>");
    });
    lines.push("  </div>");
    lines.push("</div>");
    return lines.join("\n");
  }

  function buildDayClasses(cell, stateKey){
    var cls = "calendar-demo-day";
    if (cell.outside){
      cls += " is-outside-month";
      return cls;
    }
    if (cell.day === TODAY_DAY) cls += " is-today";
    if (stateKey === "with-events" && EVENT_DAYS.indexOf(cell.day) !== -1) cls += " has-event";
    if (stateKey === "range-preview"){
      if (cell.day === RANGE_DAYS.start) cls += " is-range-start";
      else if (cell.day === RANGE_DAYS.middle) cls += " is-range-middle";
      else if (cell.day === RANGE_DAYS.end) cls += " is-range-end";
    }
    return cls;
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

    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-calendar"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-calendar"]');
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
    var calendarTypeCards = document.querySelectorAll(".calendar-type-card[data-system]");
    calendarTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "calendar-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    function buildCopyControl(container, plainLabel, buildSingle){
      if (!container) return;
      container.innerHTML = '<button type="button" class="btn btn-ghost btn-sm">' + plainLabel + "</button>";
      var plainBtn = container.querySelector("button");
      plainBtn.addEventListener("click", function(){ copyTextFull(buildSingle(), plainBtn); });
    }

    var matrixContainer = document.querySelector('[data-role="calendar-matrix-container"]');
    if (!matrixContainer) return;

    var monthLabelInput = document.querySelector('[data-role="calendar-month-label"]');
    var firstDaySelect = document.querySelector('[data-role="calendar-first-day-select"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildCalendarField(typeKey, stateKey, monthLabel, grid, weekdays){
      var weekdaysHtml = weekdays.map(function(w){ return '<span class="calendar-demo-weekday">' + w + "</span>"; }).join("");
      var daysHtml = grid.map(function(cell){
        return '<div class="' + buildDayClasses(cell, stateKey) + '">' + cell.day + "</div>";
      }).join("");
      return '<div class="calendar-demo-grid calendar-demo-grid--' + typeKey + '">' +
        '<div class="calendar-demo-header">' + monthLabel + "</div>" +
        '<div class="calendar-demo-weekdays">' + weekdaysHtml + "</div>" +
        '<div class="calendar-demo-days">' + daysHtml + "</div>" +
      "</div>";
    }

    function buildMatrixSection(monthLabel, grid, weekdays){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildCalendarField(t.key, state.key, monthLabel, grid, weekdays) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function render(){
      var monthLabel = (monthLabelInput && monthLabelInput.value.trim()) || "September 2026";
      var isMonday = firstDaySelect && firstDaySelect.value === "monday";
      var grid = isMonday ? GRID_MONDAY_START : GRID_SUNDAY_START;
      var weekdays = isMonday ? WEEKDAYS_MONDAY : WEEKDAYS_SUNDAY;

      matrixContainer.innerHTML = buildMatrixSection(monthLabel, grid, weekdays);

      buildCopyControl(copyPromptContainer, "Copy prompt", buildFullPrompt);
      buildCopyControl(copyCodeContainer, "Copy code", buildFullCode);
    }

    if (monthLabelInput) monthLabelInput.addEventListener("input", render);
    if (firstDaySelect) firstDaySelect.addEventListener("change", render);

    render();
  });
})();
