(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var TYPES = [
    { key: "initials", label: "Initials" },
    { key: "icon", label: "Icon" },
    { key: "image", label: "Image" }
  ];
  var STATES = [
    { key: "default", label: "Default" },
    { key: "online", label: "Online" },
    { key: "away", label: "Away" },
    { key: "offline", label: "Offline" }
  ];

  var FULL_SPEC = {
    initials: { purpose: "A colored circle showing the person's 1-2 letter initials - used whenever no photo is available." },
    icon: { purpose: "A colored circle containing a generic person-silhouette icon - a neutral placeholder for an unknown or anonymous person." },
    image: { purpose: "A circle filled with a gradient standing in for an illustrated photo placeholder - real image URLs are never fetched, so this represents where a person's photo would render." }
  };

  var PERSON_ICON_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 12.5c2.9 0 5.25-2.35 5.25-5.25S14.9 2 12 2 6.75 4.35 6.75 7.25 9.1 12.5 12 12.5Zm0 2.25c-3.86 0-8.25 1.94-8.25 5.25V22h16.5v-2c0-3.31-4.39-5.25-8.25-5.25Z"/></svg>';

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Hand-tuned width/height/font-size per size option - must stay identical
  // to the real .avatar-demo-circle--h* rules in shell.css (not re-derived
  // by formula at render time) so Copy Code reproduces exactly what the
  // Live Preview matrix is showing, at every size.
  var SIZE_MAP = {
    "24": { box: 24, font: 10 },
    "32": { box: 32, font: 13 },
    "40": { box: 40, font: 16 },
    "48": { box: 48, font: 19 }
  };
  // Status dot size/border scale down for smaller avatars - roughly 28% of
  // the avatar box, floored at 6px, with a thinner border at the smallest
  // size so the dot never overwhelms a 24px avatar.
  var STATUS_DOT_MAP = {
    "24": { size: 7, border: 1.5 },
    "32": { size: 9, border: 2 },
    "40": { size: 10, border: 2 },
    "48": { size: 12, border: 2 }
  };

  var SIZE_OPTIONS = [
    { value: "24", label: "24px - Small" },
    { value: "32", label: "32px - Default" },
    { value: "40", label: "40px - Large" },
    { value: "48", label: "48px - XL" }
  ];
  var SHAPE_OPTIONS = [
    { value: "circle", label: "Circle" },
    { value: "square", label: "Square" }
  ];
  var FALLBACK_DEFAULTS = { size: "32", shape: "circle", initials: "JD" };

  function optionLabelFor(optionList, value){
    var match = optionList.filter(function(opt){ return opt.value === value; })[0];
    return match ? match.label : value;
  }

  function buildFullPrompt(selectionInfo){
    selectionInfo = selectionInfo || {};
    var size = selectionInfo.size || FALLBACK_DEFAULTS.size;
    var shape = selectionInfo.shape || FALLBACK_DEFAULTS.shape;
    var initials = selectionInfo.initials || FALLBACK_DEFAULTS.initials;

    var lines = [];
    lines.push("Create a complete Avatar component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, size, shape, presence state) - a compact circular (or square) visual identifier for a person, not a one-off image tag.");
    lines.push("");
    lines.push("Content types (3):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("");
    lines.push("Presence states (4, a small status dot in the bottom-right corner):");
    lines.push("- Default: no status dot shown.");
    lines.push("- Online: a small green dot.");
    lines.push("- Away: a small amber dot.");
    lines.push("- Offline: a small gray/dim dot.");
    lines.push("These are structural/presentational variants, not interaction states - Avatar itself is not interactive.");
    lines.push("");
    lines.push("Component properties: Size (24px / 32px - default / 40px / 48px, currently " + optionLabelFor(SIZE_OPTIONS, size) + " - font-size and the status dot scale proportionally with the box size); Shape (Circle / Square, currently " + optionLabelFor(SHAPE_OPTIONS, shape) + "); Initials text (Initials type only, currently \"" + initials + "\"). Avatar.Group (a separate composition, not a per-avatar property): a list of Avatars overlapped with negative margin and a border matching the page background, with a Max count past which the final tile becomes a \"+N\" overflow indicator styled like a real avatar.");
    return lines.join("\n");
  }

  function buildFullCode(selectionInfo){
    selectionInfo = selectionInfo || {};
    var size = selectionInfo.size || FALLBACK_DEFAULTS.size;
    var shape = selectionInfo.shape || FALLBACK_DEFAULTS.shape;
    var initials = selectionInfo.initials || FALLBACK_DEFAULTS.initials;
    var sizeInfo = SIZE_MAP[size] || SIZE_MAP[FALLBACK_DEFAULTS.size];

    var lines = [];
    lines.push("/* Agentic Design System - Avatar component */");
    lines.push(".avatar-demo-wrap{ display:inline-flex; position:relative; }");
    lines.push(".avatar-demo-circle{ box-sizing:border-box; display:flex; align-items:center; justify-content:center; border-radius:9999px; font-family:var(--font-body); font-weight:600; color:#FFFFFF; overflow:hidden; flex:none; }");
    lines.push(".avatar-demo-circle--square{ border-radius:var(--radius-md); }");
    lines.push(".avatar-demo-circle--initials{ background:var(--red-500); }");
    lines.push(".avatar-demo-circle--icon{ background:var(--graphite-700); color:var(--text-hi); }");
    lines.push(".avatar-demo-circle--icon svg{ width:55%; height:55%; }");
    lines.push(".avatar-demo-circle--image{ background:linear-gradient(135deg, var(--blue-500), var(--red-500)); }");
    lines.push("");
    lines.push("/* Size - explicitly chosen: " + optionLabelFor(SIZE_OPTIONS, size) + " */");
    lines.push(".avatar-demo-circle--h" + size + "{ width:" + sizeInfo.box + "px; height:" + sizeInfo.box + "px; font-size:" + sizeInfo.font + "px; }");
    lines.push("");
    lines.push("/* Status dot - bottom-right corner */");
    lines.push(".avatar-demo-status{ position:absolute; bottom:-1px; right:-1px; border-radius:9999px; border:2px solid var(--graphite-950); box-sizing:border-box; }");
    var dotInfo = STATUS_DOT_MAP[size] || STATUS_DOT_MAP[FALLBACK_DEFAULTS.size];
    lines.push('.avatar-demo-wrap[data-size="' + size + '"] .avatar-demo-status{ width:' + dotInfo.size + "px; height:" + dotInfo.size + "px; border-width:" + dotInfo.border + "px; }");
    lines.push(".avatar-demo-status--online{ background:var(--green-500); }");
    lines.push(".avatar-demo-status--away{ background:var(--amber-500); }");
    lines.push(".avatar-demo-status--offline{ background:var(--graphite-500); }");
    lines.push("");
    lines.push("<!-- Example usage - one per content type, at the chosen size/shape -->");
    TYPES.forEach(function(t){
      var shapeCls = " avatar-demo-circle--" + shape;
      var circleCls = "avatar-demo-circle avatar-demo-circle--" + t.key + shapeCls + " avatar-demo-circle--h" + size;
      var inner = "";
      if (t.key === "initials") inner = "<span>" + escapeHtml(initials) + "</span>";
      else if (t.key === "icon") inner = PERSON_ICON_SVG;
      lines.push('<div class="avatar-demo-wrap" data-size="' + size + '">');
      lines.push('  <div class="' + circleCls + '">' + inner + "</div>");
      lines.push('  <span class="avatar-demo-status avatar-demo-status--online"></span>');
      lines.push("</div>");
    });
    return lines.join("\n");
  }

  function buildComboPrompt(size, shape, initials){
    return buildFullPrompt({ size: size, shape: shape, initials: initials });
  }

  function buildComboCode(size, shape, initials){
    return buildFullCode({ size: size, shape: shape, initials: initials });
  }

  function buildAvatarField(typeKey, stateKey, sizeKey, shapeKey, initials){
    var sizeInfo = SIZE_MAP[sizeKey] || SIZE_MAP[FALLBACK_DEFAULTS.size];
    var dotInfo = STATUS_DOT_MAP[sizeKey] || STATUS_DOT_MAP[FALLBACK_DEFAULTS.size];
    var circleCls = "avatar-demo-circle avatar-demo-circle--" + typeKey + " avatar-demo-circle--" + shapeKey + " avatar-demo-circle--h" + sizeKey;
    var circleStyle = "width:" + sizeInfo.box + "px;height:" + sizeInfo.box + "px;font-size:" + sizeInfo.font + "px;";
    var inner = "";
    if (typeKey === "initials"){
      inner = "<span>" + escapeHtml(initials || FALLBACK_DEFAULTS.initials) + "</span>";
    } else if (typeKey === "icon"){
      inner = PERSON_ICON_SVG;
    }
    var dotHtml = "";
    if (stateKey !== "default"){
      var dotStyle = "width:" + dotInfo.size + "px;height:" + dotInfo.size + "px;border-width:" + dotInfo.border + "px;";
      dotHtml = '<span class="avatar-demo-status avatar-demo-status--' + stateKey + '" style="' + dotStyle + '"></span>';
    }
    return '<div class="avatar-demo-wrap" data-size="' + sizeKey + '">' +
      '<div class="' + circleCls + '" style="' + circleStyle + '">' + inner + "</div>" +
      dotHtml +
      "</div>";
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

    // Gallery-card copy CTA + click-to-navigate (avatar.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-avatar"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-avatar"]');
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
    var avatarTypeCards = document.querySelectorAll(".avatar-type-card[data-system]");
    avatarTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "avatar-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders either a plain Copy prompt/Copy code button (Size and Shape
    // are plain selects, so there is always exactly one combination in
    // play) or, if combos ever grows past one, a disclosure dropdown
    // listing each combination with its own "Copy" button - same helper
    // every driver script in this system already uses.
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

    var matrixContainer = document.querySelector('[data-role="avatar-matrix-container"]');
    if (!matrixContainer) return;

    // Avatar.Group - overlapping circles with a "+N" overflow tile once the
    // set exceeds max, rendered once as its own static example (not woven
    // into the Size x Shape matrix, since overlap only means something
    // across multiple avatars, not one).
    var groupContainer = document.querySelector('[data-role="avatar-group-container"]');
    if (groupContainer){
      var GROUP_PEOPLE = [
        { initials: "JL" }, { initials: "SO" }, { initials: "PN" }, { initials: "AK" }, { initials: "MD" }
      ];
      var GROUP_MAX = 4;
      var visible = GROUP_PEOPLE.slice(0, GROUP_MAX);
      var overflowCount = GROUP_PEOPLE.length - GROUP_MAX;
      var circlesHtml = visible.map(function(p){
        return '<div class="avatar-demo-group-item">' +
          '<span class="avatar-demo-circle avatar-demo-circle--initials avatar-demo-circle--square avatar-demo-circle--h40">' + escapeHtml(p.initials) + "</span>" +
          "</div>";
      }).join("");
      if (overflowCount > 0){
        circlesHtml += '<div class="avatar-demo-group-item">' +
          '<span class="avatar-demo-circle avatar-demo-circle--initials avatar-demo-circle--square avatar-demo-circle--h40 avatar-demo-circle--overflow" title="' +
          GROUP_PEOPLE.slice(GROUP_MAX).map(function(p){ return escapeHtml(p.initials); }).join(", ") +
          '">+' + overflowCount + "</span></div>";
      }
      groupContainer.innerHTML = '<div class="avatar-demo-group">' + circlesHtml + "</div>";
    }

    var sizeSelect = document.querySelector('[data-role="avatar-size-select"]');
    var shapeSelect = document.querySelector('[data-role="avatar-shape-select"]');
    var initialsInput = document.querySelector('[data-role="avatar-initials"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    function currentSize(){
      return (sizeSelect && sizeSelect.value) || FALLBACK_DEFAULTS.size;
    }
    function currentShape(){
      return (shapeSelect && shapeSelect.value) || FALLBACK_DEFAULTS.shape;
    }
    function currentInitials(){
      return (initialsInput && initialsInput.value.trim()) || FALLBACK_DEFAULTS.initials;
    }

    function buildMatrix(sizeKey, shapeKey, initials){
      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildAvatarField(t.key, state.key, sizeKey, shapeKey, initials) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      return '<div class="button-matrix-combo">' +
        '<p class="button-matrix-combo-label">' + optionLabelFor(SIZE_OPTIONS, sizeKey) + " / " + optionLabelFor(SHAPE_OPTIONS, shapeKey) + "</p>" +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";
    }

    function render(){
      var sizeKey = currentSize();
      var shapeKey = currentShape();
      var initials = currentInitials();

      matrixContainer.innerHTML = buildMatrix(sizeKey, shapeKey, initials);

      var combos = [{ size: sizeKey, shape: shapeKey, initials: initials, label: optionLabelFor(SIZE_OPTIONS, sizeKey) + " / " + optionLabelFor(SHAPE_OPTIONS, shapeKey) }];

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt({ size: sizeKey, shape: shapeKey, initials: initials }); }, combos, function(c){ return buildComboPrompt(c.size, c.shape, c.initials); });
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode({ size: sizeKey, shape: shapeKey, initials: initials }); }, combos, function(c){ return buildComboCode(c.size, c.shape, c.initials); });
    }

    if (sizeSelect) sizeSelect.addEventListener("change", render);
    if (shapeSelect) shapeSelect.addEventListener("change", render);
    if (initialsInput) initialsInput.addEventListener("input", render);

    render();
  });
})();
