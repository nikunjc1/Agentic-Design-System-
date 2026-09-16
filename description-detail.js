(() => {
  "use strict";

  // Description is NOT interactive - a read-only label/value grid has no
  // hover/focus/disabled states. Its "states" dimension instead represents
  // data-shape variants (compact / with a section title / a long-wrapping
  // value), an honest structural difference rather than a fake interaction
  // state, so there is no liveCssFor()/pseudo-class logic anywhere in this
  // file - same approach as Divider.
  var TYPES = [
    { key: "default", label: "Default" },
    { key: "bordered", label: "Bordered" }
  ];
  var STATES = [
    { key: "compact", label: "Compact" },
    { key: "with-title", label: "With title" },
    { key: "long-value", label: "Long value" }
  ];

  var COLUMN_OPTIONS = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ];
  var DEFAULT_COLUMNS = "2";
  var DEFAULT_TITLE = "Account details";

  // Same 4 label/value pairs used by both "compact" and "with-title" states,
  // shared with description.html's own listing-card markup so the Copy
  // prompt/Copy code output always matches what every card and matrix cell
  // visibly shows.
  var COMPACT_ITEMS = [
    { label: "Name", value: "Jordan Lee" },
    { label: "Status", value: "Active" },
    { label: "Email", value: "jordan@example.com" },
    { label: "Role", value: "Admin" }
  ];

  // "long-value" swaps the last pair for a deliberately long one, spanning
  // the full grid width so it reads as its own row instead of being
  // squeezed into a single narrow column at 2 or 3 columns.
  var LONG_VALUE_ITEMS = [
    { label: "Name", value: "Jordan Lee" },
    { label: "Status", value: "Active" },
    { label: "Email", value: "jordan@example.com", span: true },
    { label: "Notes", value: "Escalated to billing team on Sep 12 for a refund review; awaiting manager approval before we can close this out.", span: true }
  ];

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  // Renders one Description example - a panel containing an optional
  // section title (With title state only) above a grid of label/value
  // cells, laid out at the given column count.
  function buildDescriptionField(typeKey, stateKey, columns, title){
    var items = stateKey === "long-value" ? LONG_VALUE_ITEMS : COMPACT_ITEMS;
    var titleHtml = stateKey === "with-title"
      ? '<p class="description-demo-title">' + escapeHtml((title || DEFAULT_TITLE).trim() || DEFAULT_TITLE) + "</p>"
      : "";
    var itemsHtml = items.map(function(item){
      var spanAttr = item.span ? ' style="grid-column: 1 / -1;"' : "";
      return '<div class="description-demo-item"' + spanAttr + ">" +
        '<span class="description-demo-label">' + escapeHtml(item.label) + "</span>" +
        '<span class="description-demo-value">' + escapeHtml(item.value) + "</span>" +
        "</div>";
    }).join("");
    var gridHtml = '<div class="description-demo-grid" style="grid-template-columns:repeat(' + columns + ', 1fr);">' + itemsHtml + "</div>";
    return '<div class="description-demo-panel description-demo-panel--' + typeKey + '">' + titleHtml + gridHtml + "</div>";
  }

  function buildFullPrompt(columns, title){
    columns = columns || DEFAULT_COLUMNS;
    title = (title || "").trim();

    var lines = [];
    lines.push("Create a complete Description component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (form, column count, section title) - a read-only label/value grid for displaying a set of structured details at a glance, like a summary panel, not a one-off table hacked together per screen.");
    lines.push("");
    lines.push("Description is not interactive - unlike most components in this system, it has no hover, focus or disabled state. Its variation is purely structural: 2 forms, each usable at a configurable column count, optionally with a section title above the grid.");
    lines.push("");
    lines.push("Forms (2):");
    lines.push("- Default: clean spacing between label/value pairs, no cell borders - a minimal look.");
    lines.push("- Bordered: each label/value pair sits in its own bordered cell, forming a compact table-like grid with 1px dividers between cells.");
    lines.push("");
    lines.push("Each pair is a label (small, uppercase, dimmed) stacked above its value (regular weight, high-contrast). Long values wrap gracefully within their cell instead of overflowing or breaking the grid layout.");
    lines.push("");
    lines.push("Component properties: Columns (1/2/3, default 2, drives grid-template-columns for how many label/value pairs sit per row); Section title (optional string, shown as a heading above the grid" + (title ? ", currently \"" + title + "\"" : ", e.g. \"Account details\"") + " - With title state only, other states ignore it).");
    return lines.join("\n");
  }

  function buildFullCode(columns, title){
    columns = columns || DEFAULT_COLUMNS;
    title = (title || "").trim() || DEFAULT_TITLE;

    var lines = [];
    lines.push("/* Agentic Design System - Description component */");
    lines.push(".description-demo-panel{ display:flex; flex-direction:column; gap:10px; width:280px; }");
    lines.push(".description-demo-title{ font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--text-hi); }");
    lines.push(".description-demo-grid{ display:grid; gap:12px; }");
    lines.push(".description-demo-panel--bordered .description-demo-grid{ gap:0; border:1px solid var(--line); border-radius:var(--radius-sm); overflow:hidden; }");
    lines.push(".description-demo-item{ display:flex; flex-direction:column; gap:3px; }");
    lines.push(".description-demo-panel--bordered .description-demo-item{ padding:8px 10px; border-right:1px solid var(--line); border-bottom:1px solid var(--line); gap:2px; }");
    lines.push(".description-demo-label{ font-family:var(--font-body); font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.04em; }");
    lines.push(".description-demo-value{ font-family:var(--font-body); font-size:13px; color:var(--text-hi); word-break:break-word; }");
    lines.push("");
    lines.push("<!-- Example usage - one per form, at " + columns + " column" + (columns === "1" ? "" : "s") + ", with section title \"" + title + "\" -->");
    TYPES.forEach(function(t){
      lines.push(buildDescriptionField(t.key, "with-title", columns, title));
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

    // Gallery-card copy CTA + click-to-navigate (description.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-description"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-description"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(DEFAULT_COLUMNS, DEFAULT_TITLE), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(DEFAULT_COLUMNS, DEFAULT_TITLE), cardCopyCodeBtn);
      });
    }
    var descriptionTypeCards = document.querySelectorAll(".description-type-card[data-system]");
    descriptionTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "description-" + card.dataset.system + ".html";
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
    // by name with its own "Copy" button. Description has no multiselect
    // property (Columns is a single-value <select>), so it always calls
    // this with an empty combos array - the "0 or 1 combos = plain button"
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

    var matrixContainer = document.querySelector('[data-role="description-matrix-container"]');
    if (!matrixContainer) return;

    var columnsSelect = document.querySelector('[data-role="description-columns-select"]');
    var titleInput = document.querySelector('[data-role="description-title"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(columns, title){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildDescriptionField(t.key, state.key, columns, title) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";
    }

    function currentValues(){
      return {
        columns: columnsSelect ? columnsSelect.value : DEFAULT_COLUMNS,
        title: (titleInput ? titleInput.value.trim() : "") || DEFAULT_TITLE
      };
    }

    function render(){
      var values = currentValues();
      matrixContainer.innerHTML = buildMatrixSection(values.columns, values.title);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(values.columns, values.title); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(values.columns, values.title); }, [], function(){ return ""; });
    }

    if (columnsSelect) columnsSelect.addEventListener("change", render);
    if (titleInput) titleInput.addEventListener("input", render);

    render();
  });
})();
