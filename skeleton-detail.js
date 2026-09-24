(() => {
  "use strict";

  // Skeleton has 3 layouts (which shape the placeholder blocks take) and 2
  // states (whether the shimmer animation plays). Rows is a plain number
  // input, not a multiselect property, so - like Progress's and Timeline's
  // driver scripts - there is no combos array/dropdown copy control here,
  // just a single matrix at the current Rows value.
  var TYPES = [
    { key: "text", label: "Text" },
    { key: "avatar-text", label: "Avatar + text" },
    { key: "card", label: "Card" }
  ];
  var STATES = [
    { key: "animated", label: "Animated" },
    { key: "reduced-motion", label: "Reduced motion" }
  ];

  var AVATAR_TEXT_ROWS = 2;

  function clampRows(n){
    n = Math.round(Number(n));
    if (isNaN(n)) return 3;
    return Math.max(1, Math.min(5, n));
  }

  // Builds N stacked .skeleton-demo-line blocks, the last one narrowed via
  // the --short modifier - the standard "paragraph" skeleton pattern reused
  // by both the Text layout and the Card layout's caption area. Avatar +
  // text always calls this with a fixed row count of 2, never the live Rows
  // property, since it represents one list-item/comment shape.
  function buildLines(rows, animated){
    var animCls = animated ? " is-animated" : "";
    var lines = [];
    for (var i = 0; i < rows; i++){
      var shortCls = (i === rows - 1) ? " skeleton-demo-line--short" : "";
      lines.push('<div class="skeleton-demo-line' + shortCls + animCls + '"></div>');
    }
    return lines.join("");
  }

  function buildSkeletonField(typeKey, stateKey, rows){
    var animated = stateKey === "animated";
    var animCls = animated ? " is-animated" : "";

    if (typeKey === "avatar-text"){
      return '<div class="skeleton-demo-row">' +
        '<div class="skeleton-demo-avatar' + animCls + '"></div>' +
        '<div class="skeleton-demo-col">' + buildLines(AVATAR_TEXT_ROWS, animated) + "</div>" +
        "</div>";
    }

    if (typeKey === "card"){
      return '<div class="skeleton-demo-card">' +
        '<div class="skeleton-demo-media' + animCls + '"></div>' +
        buildLines(rows, animated) +
        "</div>";
    }

    // "text"
    return '<div class="skeleton-demo-text">' + buildLines(rows, animated) + "</div>";
  }

  function buildFullPrompt(rows){
    var lines = [];
    lines.push("Create a complete Skeleton component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (layout, state, rows) - a loading placeholder made of shimmering gray blocks shaped like the content about to load, used to reduce perceived loading time and avoid layout jank while real content is still being fetched.");
    lines.push("");
    lines.push("Layouts (3):");
    lines.push("- Text: stacked paragraph-shaped placeholder lines, full width except the last line which is shorter - a generic block of loading text.");
    lines.push("- Avatar + text: a circular avatar placeholder to the left, with 2 shimmering text lines stacked to its right - a fixed 2 lines regardless of the Rows property, representing a typical list-item or comment loading shape.");
    lines.push("- Card: a rectangular media placeholder block on top, with shimmering caption lines below it (last one shorter) - representing a loading card or thumbnail.");
    lines.push("");
    lines.push("States (2):");
    lines.push("- Animated: a shimmering pulse sweeps across every placeholder block, left to right, on a continuous loop.");
    lines.push("- Reduced motion: the exact same shapes, but with no animation - a static, flat gray block - representing the prefers-reduced-motion accessibility state this system always demonstrates for any animated component.");
    lines.push("");
    lines.push("Component properties: Rows (1-5, default " + rows + " - controls how many placeholder lines the Text layout and the Card layout's caption area show; Avatar + text always shows a fixed " + AVATAR_TEXT_ROWS + " lines, regardless of Rows).");
    lines.push("Current value - Rows: " + rows + ".");
    return lines.join("\n");
  }

  function cssBlock(){
    var lines = [];
    lines.push("/* Agentic Design System - Skeleton component */");
    lines.push(".skeleton-demo-line{ height:10px; border-radius:4px; background:var(--graphite-700); width:100%; }");
    lines.push(".skeleton-demo-line + .skeleton-demo-line{ margin-top:8px; }");
    lines.push(".skeleton-demo-line--short{ width:60%; }");
    lines.push(".skeleton-demo-avatar{ width:40px; height:40px; border-radius:9999px; background:var(--graphite-700); flex:none; }");
    lines.push(".skeleton-demo-media{ width:100%; height:100px; border-radius:var(--radius-md); background:var(--graphite-700); margin-bottom:10px; }");
    lines.push(".skeleton-demo-row{ display:flex; gap:12px; align-items:flex-start; }");
    lines.push(".skeleton-demo-col{ flex:1 1 auto; min-width:0; }");
    lines.push(".skeleton-demo-text, .skeleton-demo-card{ display:flex; flex-direction:column; width:200px; }");
    lines.push(".skeleton-demo-line.is-animated, .skeleton-demo-avatar.is-animated, .skeleton-demo-media.is-animated{ background:linear-gradient(90deg, var(--graphite-800) 25%, var(--graphite-700) 50%, var(--graphite-800) 75%); background-size:200% 100%; animation:image-demo-shimmer var(--duration-shimmer) var(--ease-emphasis) infinite; }");
    lines.push("/* The shimmer is decorative - the skeleton's shape already says \"loading\" - so it switches off entirely when reduced motion is requested. */");
    lines.push("@media (prefers-reduced-motion: reduce){ .skeleton-demo-line.is-animated, .skeleton-demo-avatar.is-animated, .skeleton-demo-media.is-animated{ animation:none; background:var(--graphite-700); } }");
    return lines.join("\n");
  }

  function buildFullCode(rows){
    var lines = [];
    lines.push(cssBlock());
    lines.push("");
    lines.push("<!-- Example usage - Text layout, Animated state, " + rows + " rows -->");
    lines.push(buildSkeletonField("text", "animated", rows));
    lines.push("");
    lines.push("<!-- Example usage - Avatar + text layout, Animated state (always " + AVATAR_TEXT_ROWS + " lines) -->");
    lines.push(buildSkeletonField("avatar-text", "animated", rows));
    lines.push("");
    lines.push("<!-- Example usage - Card layout, Reduced motion state -->");
    lines.push(buildSkeletonField("card", "reduced-motion", rows));
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

    // Gallery-card copy CTA + click-to-navigate (skeleton.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-skeleton"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-skeleton"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(3), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(3), cardCopyCodeBtn);
      });
    }
    var skeletonTypeCards = document.querySelectorAll(".skeleton-type-card[data-system]");
    skeletonTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "skeleton-" + card.dataset.system + ".html";
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
    // by name with its own "Copy" button. Skeleton has no multiselect
    // property (Rows is a number input), so it always calls this with an
    // empty combos array - the "0 or 1 combos = plain button" branch every
    // existing driver script already has.
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

    var matrixContainer = document.querySelector('[data-role="skeleton-matrix-container"]');
    if (!matrixContainer) return;

    var rowsInput = document.querySelector('[data-role="skeleton-rows-input"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function buildMatrixSection(rows){
      var tableRows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildSkeletonField(t.key, state.key, rows) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + tableRows + "</tbody></table>";
    }

    function render(){
      var rows = clampRows(rowsInput ? rowsInput.value : 3);
      matrixContainer.innerHTML = buildMatrixSection(rows);

      // No multiselect property exists here, so there is only ever one
      // matrix / one prompt / one code sample in play - both copy controls
      // always get an empty combos array (plain-button branch).
      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(rows); }, [], function(){ return ""; });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(rows); }, [], function(){ return ""; });
    }

    if (rowsInput){
      rowsInput.addEventListener("input", function(){
        var clamped = clampRows(rowsInput.value);
        if (String(clamped) !== rowsInput.value) rowsInput.value = clamped;
        render();
      });
    }

    render();
  });
})();
