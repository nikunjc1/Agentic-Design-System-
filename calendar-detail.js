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

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var WEEKDAYS_SUNDAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  var WEEKDAYS_MONDAY = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  var dateFormatter = new Intl.DateTimeFormat("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric", timeZone:"UTC" });
  function parseMonth(value){
    var match = /^(\w+)\s+(\d{4})$/.exec(String(value).trim());
    if (!match) return null;
    var month = MONTHS.findIndex(function(name){ return name.toLowerCase() === match[1].toLowerCase(); });
    var year = Number(match[2]);
    if (month < 0 || year < 1000) return null;
    return { month:month, year:year, label:MONTHS[month] + " " + year };
  }
  function buildGrid(month, isMonday){
    var first = new Date(Date.UTC(month.year, month.month, 1));
    var offset = (first.getUTCDay() - (isMonday ? 1 : 0) + 7) % 7;
    return Array.from({length:42}, function(_, index){
      var date = new Date(Date.UTC(month.year, month.month, 1 - offset + index));
      return { day:date.getUTCDate(), outside:date.getUTCMonth() !== month.month, label:dateFormatter.format(date) };
    });
  }

  var TODAY_DAY = 16;
  var EVENT_DAYS = [5, 20];
  var RANGE_DAYS = { start: 10, middle: 11, end: 12 };

  function fullDateLabel(grid, index){ return grid[index].label; }

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildFullPrompt(monthLabel, isMonday){
    monthLabel = monthLabel || "September 2026";
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
    lines.push("Component properties: Month label (text, current value \"" + monthLabel + "\"); First day of week (Sunday/Monday - reflows which day starts each week and which days fall outside the current month at the grid's edges) - currently " + (isMonday ? "Monday" : "Sunday") + ".");
    return window.ADSFoundation.preparePageMarkdown(lines.join("\n"));
  }

  function buildFullCode(monthLabel, isMonday){
    monthLabel = monthLabel || "September 2026";
    var grid = buildGrid(parseMonth(monthLabel) || parseMonth("September 2026"), isMonday);
    var weekdays = isMonday ? WEEKDAYS_MONDAY : WEEKDAYS_SUNDAY;
    var textHi = getCssVar("--text-hi", "#111827");
    var textDim = getCssVar("--text-dim", "#69707D");
    var lineStrong = getCssVar("--line-strong", "rgba(255,255,255,0.16)");
    var graphite900 = getCssVar("--graphite-900", "#FFFFFF");
    var graphite800 = getCssVar("--graphite-800", "#F1F1EE");
    var red500 = getCssVar("--red-500", "#FF031A");
    var buttonPrimaryText = getCssVar("--button-primary-text", "#15171A");
    var redTint = getCssVar("--red-tint", "rgba(255,3,26,0.08)");
    var red400 = getCssVar("--red-400", "#FF4253");
    var blue500 = getCssVar("--blue-500", "#4F8FE6");

    var lines = [];
    lines.push("/* Agentic Design System - Calendar component */");
    lines.push(".calendar-demo-grid{ box-sizing:border-box; background:" + graphite900 + "; border:1px solid " + lineStrong + "; border-radius:var(--radius-md); padding:var(--space-10); width:fit-content; margin-inline:auto; }");
    lines.push('.calendar-demo-header{ text-align:center; font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-selected-weight); color:' + textHi + "; margin-bottom:var(--space-8); max-width:var(--dimension-260); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }");
    lines.push(".calendar-demo-weekdays{ display:grid; grid-template-columns:repeat(7,1fr); gap:var(--space-2); margin-bottom:var(--space-4); }");
    lines.push('.calendar-demo-weekday{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:var(--type-selected-weight); color:' + textDim + "; text-align:center; text-transform:uppercase; }");
    lines.push(".calendar-demo-days{ display:grid; grid-template-columns:repeat(7,1fr); gap:var(--space-2); }");
    lines.push('.calendar-demo-day{ box-sizing:border-box; display:flex; align-items:center; justify-content:center; position:relative; padding:0; margin:0; font-family:var(--font-body); line-height:normal; color:' + textHi + "; background:none; border:none; border-radius:var(--radius-6); cursor:pointer; }");
    lines.push(".calendar-demo-day:hover:not(.is-outside-month){ background:" + graphite800 + "; }");
    lines.push(".calendar-demo-day:focus-visible{ outline:2px solid " + getCssVar("--color-focus-ring", red400) + "; outline-offset:1px; }");
    lines.push(".calendar-demo-grid--full .calendar-demo-day{ width:var(--dimension-36); height:var(--dimension-36); font-size:var(--type-body-size); }");
    lines.push(".calendar-demo-grid--compact .calendar-demo-day{ width:var(--dimension-26); height:var(--dimension-26); font-size:var(--type-body-size); }");
    lines.push(".calendar-demo-day.is-outside-month{ color:" + textDim + "; opacity:0.4; }");
    lines.push(".calendar-demo-day.is-today{ background:" + red500 + "; color:" + buttonPrimaryText + "; font-weight:700; }");
    lines.push('.calendar-demo-day.has-event::after{ content:""; position:absolute; bottom:3px; left:50%; transform:translateX(-50%); width:var(--dimension-4); height:var(--dimension-4); border-radius:var(--radius-full); background:' + blue500 + "; }");
    lines.push(".calendar-demo-day.is-range-start, .calendar-demo-day.is-range-middle, .calendar-demo-day.is-range-end{ background:" + redTint + "; color:" + red400 + "; }");
    lines.push(".calendar-demo-day.is-range-start{ border-top-left-radius:6px; border-bottom-left-radius:6px; }");
    lines.push(".calendar-demo-day.is-range-end{ border-top-right-radius:6px; border-bottom-right-radius:6px; }");
    lines.push(".calendar-demo-day.is-range-middle{ border-radius:0; }");
    lines.push("");
    lines.push("<!-- Example usage - Full type, With events state, " + (isMonday ? "Monday" : "Sunday") + "-start week -->");
    lines.push('<div class="calendar-demo-grid calendar-demo-grid--full">');
    lines.push('  <div class="calendar-demo-header">' + escapeHtml(monthLabel) + "</div>");
    lines.push('  <div class="calendar-demo-weekdays">');
    weekdays.forEach(function(w){ lines.push('    <span class="calendar-demo-weekday">' + w + "</span>"); });
    lines.push("  </div>");
    lines.push('  <div class="calendar-demo-days">');
    grid.forEach(function(cell, i){
      var cls = buildDayClasses(cell, "with-events");
      lines.push('    <button type="button" class="' + cls + '" aria-label="' + fullDateLabel(grid, i, isMonday) + '">' + cell.day + "</button>");
    });
    lines.push("  </div>");
    lines.push("</div>");
    return window.ADSFoundation.prepareCode(lines.join("\n"));
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
      return window.ADSClipboard.copyWithFeedback(text, btn);
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

    function buildCopyControl(container, plainLabel, buildSingle){
      if (!container) return;
      container.innerHTML = '<button type="button" class="btn btn-ghost btn-sm">' + plainLabel + "</button>";
      var plainBtn = container.querySelector("button");
      plainBtn.addEventListener("click", function(){ copyTextFull(buildSingle(), plainBtn); });
    }

    var matrixContainer = document.querySelector('[data-role="calendar-matrix-container"]');
    if (!matrixContainer) return;

    var monthLabelInput = document.querySelector('[data-role="calendar-month-label"]');
    var monthError = document.createElement("p");
    monthError.id = "calendar-month-error";
    monthError.className = "wb-error";
    monthError.setAttribute("aria-live", "polite");
    if (monthLabelInput){
      monthLabelInput.setAttribute("aria-describedby", monthError.id);
      monthLabelInput.placeholder = "e.g. February 2028";
      monthLabelInput.after(monthError);
    }
    var firstDaySelect = document.querySelector('[data-role="calendar-first-day-select"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildCalendarField(typeKey, stateKey, monthLabel, grid, weekdays, isMonday){
      var weekdaysHtml = weekdays.map(function(w){ return '<span class="calendar-demo-weekday">' + w + "</span>"; }).join("");
      // Foundation audit UX10 - one cell of a side-by-side state comparison
      // (one of several full month grids), not a real date picker;
      // tabindex="-1" keeps every day out of the Tab sequence without
      // removing it from the accessibility tree.
      // Days are laid out as 6 explicit week rows (7 cells each) rather than one 7-column CSS grid, and an event is a real dot element (shown only
      // in the With events state) rather than a ::after pseudo-element: both are needed for Figma to receive the same structure the page draws.
      var daysHtml = [0, 1, 2, 3, 4, 5].map(function(week){
        return '<div class="calendar-demo-week">' + grid.slice(week * 7, week * 7 + 7).map(function(cell, k){
          var i = week * 7 + k;
          var dot = !cell.outside && EVENT_DAYS.indexOf(cell.day) !== -1 ? '<span class="calendar-demo-event" data-contract-kind="container" data-contract-name="Event dot"></span>' : "";
          return '<button type="button" class="' + buildDayClasses(cell, stateKey) + '" tabindex="-1" aria-label="' + fullDateLabel(grid, i, isMonday) + '">' + cell.day + dot + "</button>";
        }).join("") + "</div>";
      }).join("");
      return '<div class="calendar-demo-grid calendar-demo-grid--' + typeKey + '">' +
        '<div class="calendar-demo-header" data-contract-part="monthLabel">' + escapeHtml(monthLabel) + "</div>" +
        '<div class="calendar-demo-weekdays">' + weekdaysHtml + "</div>" +
        '<div class="calendar-demo-days">' + daysHtml + "</div>" +
      "</div>";
    }

    function buildMatrixSection(monthLabel, grid, weekdays, isMonday){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildCalendarField(t.key, state.key, monthLabel, grid, weekdays, isMonday) + "</td>";
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
      var month = parseMonth(monthLabel);
      if (monthLabelInput){
        monthLabelInput.setCustomValidity(month ? "" : "Enter a full month name and a four-digit year, e.g. February 2028.");
        monthLabelInput.setAttribute("aria-invalid", String(!month));
        monthError.textContent = monthLabelInput.validationMessage;
      }
      if (!month) return;
      monthLabel = month.label;
      var isMonday = firstDaySelect && firstDaySelect.value === "monday";
      var grid = buildGrid(parseMonth(monthLabel) || parseMonth("September 2026"), isMonday);
      var weekdays = isMonday ? WEEKDAYS_MONDAY : WEEKDAYS_SUNDAY;

      matrixContainer.innerHTML = buildMatrixSection(monthLabel, grid, weekdays, isMonday);

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(monthLabel, isMonday); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(monthLabel, isMonday); });
    }

    if (monthLabelInput) monthLabelInput.addEventListener("input", function(){ window.ADS_scheduleRender(render); });
    if (firstDaySelect) firstDaySelect.addEventListener("change", render);

    render();
  });
})();
