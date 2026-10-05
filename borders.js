(() => {
  "use strict";

  var SAVE_KEY = "ads:border";

  document.addEventListener("DOMContentLoaded", function(){
    var systemCards = document.querySelectorAll(".system-card");

    var widthSelect = document.querySelector('[data-role="border-width"]');
    var colorPicker = document.querySelector('[data-role="border-color-picker"]');
    var colorHex = document.querySelector('[data-role="border-color-hex"]');
    var darkColorPicker = document.querySelector('[data-role="border-color-picker-dark"]');
    var darkColorHex = document.querySelector('[data-role="border-color-hex-dark"]');
    var opacityInput = document.querySelector('[data-role="border-opacity"]');
    var styleSelect = document.querySelector('[data-role="border-style"]');
    var sidesSelect = document.querySelector('[data-role="border-sides"]');

    var previewBox = document.querySelector('[data-role="preview-box"]');
    var previewButton = document.querySelector('[data-role="preview-button"]');
    var previewInput = document.querySelector('[data-role="preview-input"]');
    var previewDividersH = document.querySelectorAll('[data-role="preview-divider-h"]');
    var previewDividersV = document.querySelectorAll('[data-role="preview-divider-v"]');

    // Dark starts auto-generated from Light and stays in sync with it until
    // the user edits the dark field directly - same auto/custom idea used
    // throughout the rest of this system (Colors, Typography).
    var darkAuto = true;

    function hexToRgb(hex){
      hex = (hex || "9A9A95").replace("#", "");
      if (hex.length !== 6) hex = "9A9A95";
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    }

    function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

    function hexToHsl(hex){
      var rgb = hexToRgb(hex);
      var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;
      if (max === min){ h = s = 0; }
      else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
      }
      return { h: h * 360, s: s * 100, l: l * 100 };
    }

    function hslToHex(h, s, l){
      h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
      var c = (1 - Math.abs(2 * l - 1)) * s;
      var x = c * (1 - Math.abs((h / 60) % 2 - 1));
      var m = l - c / 2;
      var r, g, b;
      if (h < 60){ r = c; g = x; b = 0; }
      else if (h < 120){ r = x; g = c; b = 0; }
      else if (h < 180){ r = 0; g = c; b = x; }
      else if (h < 240){ r = 0; g = x; b = c; }
      else if (h < 300){ r = x; g = 0; b = c; }
      else { r = c; g = 0; b = x; }
      var toByte = function(v){ var n = Math.round((v + m) * 255); var hh = n.toString(16); return hh.length === 1 ? "0" + hh : hh; };
      return "#" + toByte(r) + toByte(g) + toByte(b);
    }

    // A border color can be a near-neutral gray (most presets/states) or a
    // real accent (Brand, Focus, Active, Error...). HSL saturation is
    // unreliable right at the lightness extremes, so very dark/light
    // colors are always treated as gray-like regardless of nominal
    // saturation; only the middle range is judged by saturation.
    function suggestDark(lightHex){
      var hsl = hexToHsl(lightHex);
      var isGrayLike = hsl.l < 20 || hsl.l > 80 || hsl.s < 20;
      if (isGrayLike) return hslToHex(hsl.h, hsl.s, clamp(100 - hsl.l, 0, 100));
      return hslToHex(hsl.h, clamp(hsl.s - 8, 35, 100), clamp(hsl.l + 12, 0, 78));
    }

    function currentTheme(){
      return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }

    // Start/End are logical (border-inline-start/-end) - the browser
    // itself flips which physical side that resolves to based on the
    // page's own text direction, no extra JS needed. Left/Right/Vertical
    // stay physical on purpose (an exception worth keeping deliberate,
    // not an oversight): a divider between two fixed-position columns,
    // for instance, should stay on its own physical side regardless of
    // reading direction, same as a map pin doesn't move when you change
    // language. Top/Bottom/Horizontal have no direction-dependent
    // equivalent (block-direction logical properties exist too, but this
    // system's layouts don't flip vertically, so physical is correct and
    // sufficient here).
    function sidesToProps(sides){
      switch(sides){
        case "top": return ["border-top"];
        case "right": return ["border-right"];
        case "bottom": return ["border-bottom"];
        case "left": return ["border-left"];
        case "start": return ["border-inline-start"];
        case "end": return ["border-inline-end"];
        case "horizontal": return ["border-top", "border-bottom"];
        case "vertical": return ["border-left", "border-right"];
        default: return ["border"];
      }
    }

    // The Live Preview represents this site's actual UI, so it follows
    // whichever theme the site is currently in - not a fixed choice - and
    // re-renders live if the theme is toggled while this page is open.
    // A preset chip stays "is-active" only while every field it set still
    // matches - editing even one afterward is a real divergence (the same
    // preset-identity rule already applied to Typography's platform
    // chips). applyPreview() is only ever called by a manual field edit
    // (clicking a system-card itself goes through selectSystem(), which
    // never calls this), so no extra guard is needed here to avoid
    // clearing a chip the instant it's freshly selected.
    function clearPresetIfDiverged(){
      var activeChip = document.querySelector(".system-card.is-active");
      if (!activeChip) return;
      var opacity = Math.max(0, Math.min(100, parseInt(opacityInput.value, 10) || 0));
      var matches = Number(activeChip.dataset.width) === Number(widthSelect.value)
        && activeChip.dataset.color.replace("#", "").toUpperCase() === colorHex.value.toUpperCase()
        && Number(activeChip.dataset.opacity) === opacity
        && activeChip.dataset.style === styleSelect.value;
      if (!matches) activeChip.classList.remove("is-active");
    }
    function applyPreview(){
      clearPresetIfDiverged();
      var width = widthSelect.value;
      var style = styleSelect.value;
      var opacity = Math.max(0, Math.min(100, parseInt(opacityInput.value, 10) || 0));
      var activeHex = currentTheme() === "dark" ? darkColorHex.value : colorHex.value;
      var rgb = hexToRgb(activeHex);
      var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + (opacity / 100) + ")";
      var value = width + "px " + style + " " + rgba;
      var props = sidesToProps(sidesSelect.value);

      [previewBox, previewButton, previewInput].forEach(function(el){
        el.style.border = "none";
        el.style.borderTop = "";
        el.style.borderRight = "";
        el.style.borderBottom = "";
        el.style.borderLeft = "";
        el.style.borderInlineStart = "";
        el.style.borderInlineEnd = "";
        props.forEach(function(prop){
          var camel = prop.replace(/-([a-z])/g, function(_, c){ return c.toUpperCase(); });
          el.style[camel] = value;
        });
      });

      // Dividers always render as a plain top/left rule, independent of the
      // Sides setting above - a separator line isn't a box with sides.
      previewDividersH.forEach(function(el){ el.style.borderTop = value; });
      previewDividersV.forEach(function(el){ el.style.borderLeft = value; });
      updateConfigMachineView();
    }

    function regenerateDark(){
      var hex = suggestDark(colorHex.value);
      darkColorPicker.value = hex;
      darkColorHex.value = hex.replace("#", "").toUpperCase();
      darkAuto = true;
      applyPreview();
    }

    var presetsMachineJson = document.querySelector('[data-role="borderpresets-machine-json"]');
    var configMachineJson = document.querySelector('[data-role="borderconfig-machine-json"]');
    var markdownOutput = document.querySelector('[data-role="borders-markdown-output"]');

    // Same "MD file" pattern added to Colors, Grid & Layout, Typography,
    // Spacing and Radius: one consolidated Markdown snapshot of this
    // page's editable state (Border presets, Configure your border, Border
    // states) - Component guidance is fixed reference content (just Card
    // and Table's real values), excluded for the same reason as every
    // other page's static sections so far. Called from all three Machine
    // View update functions below so it always reflects whichever part of
    // the page last changed.
    function renderMarkdown(){
      if (!markdownOutput) return;
      var presetCard = document.querySelector(".system-card.is-active");
      var lines = ["# Borders", ""];

      lines.push("## Border presets", "");
      if (presetCard){
        lines.push("- Selected: `" + presetCard.dataset.system + "`");
        lines.push("- Width: `" + presetCard.dataset.width + "px`");
        lines.push("- Color: `" + presetCard.dataset.color + "`");
        lines.push("- Opacity: `" + presetCard.dataset.opacity + "%`");
        lines.push("- Style: `" + presetCard.dataset.style + "`");
      } else {
        lines.push("- Selected: `Custom` (the values below no longer match any preset's own seed values - see Configure your border for the effective result)");
      }

      lines.push("", "## Configure your border", "");
      lines.push("- Width: `" + widthSelect.value + "px`");
      lines.push("- Style: " + styleSelect.options[styleSelect.selectedIndex].textContent);
      lines.push("- Sides: " + sidesSelect.options[sidesSelect.selectedIndex].textContent);
      lines.push("- Opacity: `" + opacityInput.value + "%`");
      lines.push("- Color (Light): `#" + colorHex.value + "`");
      lines.push("- Color (Dark): `#" + darkColorHex.value + "`" + (darkAuto ? " (auto-generated)" : ""));

      // stateRows/stateDarkAuto are assigned further down this same
      // DOMContentLoaded callback (the per-state-colors block) - renderMarkdown
      // can be called earlier than that, via loadBorder()'s own call chain
      // (loadBorder -> selectSystem -> updatePresetsMachineView), while
      // they're still the hoisted `undefined` from their `var` declaration.
      if (stateRows){
        lines.push("", "## Border states", "");
        stateRows.forEach(function(row){
          var label = (row.querySelector(".usage-label") || {}).textContent || row.dataset.state;
          var key = row.dataset.state;
          lines.push("### " + label, "");
          lines.push("- Width: `" + row.dataset.width + "px` &middot; Opacity: `" + row.dataset.opacity + "%` &middot; Style: `" + row.dataset.style + "`");
          lines.push("- Color (Light): `#" + row.querySelector('[data-role="state-hex"]').value + "`");
          lines.push("- Color (Dark): `#" + row.querySelector('[data-role="state-hex-dark"]').value + "`" + (stateDarkAuto[key] ? " (auto-generated)" : ""));
          lines.push("");
        });
      }

      markdownOutput.textContent = lines.join("\n").trim();
    }

    function updatePresetsMachineView(){
      if (presetsMachineJson){
        var active = document.querySelector(".system-card.is-active");
        presetsMachineJson.textContent = JSON.stringify({
          $schema: window.ADS_MACHINE_VIEW_SCHEMA,
          selected: active ? active.dataset.system : null,
          width: active ? Number(active.dataset.width) : null,
          color: active ? active.dataset.color : null,
          opacity: active ? Number(active.dataset.opacity) : null,
          style: active ? active.dataset.style : null
        }, null, 2);
      }
      renderMarkdown();
    }

    function updateConfigMachineView(){
      if (configMachineJson){
        configMachineJson.textContent = JSON.stringify({
          $schema: window.ADS_MACHINE_VIEW_SCHEMA,
          width: Number(widthSelect.value),
          color: "#" + colorHex.value,
          colorDark: "#" + darkColorHex.value,
          colorDarkAuto: darkAuto,
          opacity: Number(opacityInput.value),
          style: styleSelect.value,
          sides: sidesSelect.value
        }, null, 2);
      }
      renderMarkdown();
    }

    function selectSystem(key){
      systemCards.forEach(function(card){
        var active = card.dataset.system === key;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-pressed", active ? "true" : "false");
      });
      var card = document.querySelector('.system-card[data-system="' + key + '"]');
      if (!card){ updatePresetsMachineView(); return; }

      widthSelect.value = card.dataset.width;
      var hex = card.dataset.color.replace("#", "").toUpperCase();
      colorPicker.value = card.dataset.color;
      colorHex.value = hex;
      opacityInput.value = card.dataset.opacity;
      styleSelect.value = card.dataset.style;

      // A freshly chosen preset seeds a fresh coordinated Light+Dark pair,
      // even if a previous manual Dark edit had turned auto-follow off.
      regenerateDark();
      updatePresetsMachineView();
    }

    systemCards.forEach(function(card){
      card.addEventListener("click", function(e){
        var hit = e.target.closest("button, input, select, textarea, a, [role=combobox]"); if (hit && hit !== card) return;
        selectSystem(card.dataset.system);
        persistBorder();
      });
    });

    widthSelect.addEventListener("change", function(){ applyPreview(); persistBorder(); });
    styleSelect.addEventListener("change", function(){ applyPreview(); persistBorder(); });
    sidesSelect.addEventListener("change", function(){ applyPreview(); persistBorder(); });
    opacityInput.addEventListener("input", function(){ applyPreview(); persistBorder(); });
    colorHex.addEventListener("input", function(){
      var hex = colorHex.value.replace(/[^0-9a-f]/gi, "").slice(0, 6);
      if (hex.length === 6) colorPicker.value = "#" + hex;
      if (darkAuto) regenerateDark();
      applyPreview();
      persistBorder();
    });
    colorPicker.addEventListener("input", function(){
      colorHex.value = colorPicker.value.replace("#", "").toUpperCase();
      if (darkAuto) regenerateDark();
      applyPreview();
      persistBorder();
    });
    darkColorHex.addEventListener("input", function(){
      var hex = darkColorHex.value.replace(/[^0-9a-f]/gi, "").slice(0, 6);
      if (hex.length === 6) darkColorPicker.value = "#" + hex;
      darkAuto = false;
      applyPreview();
      persistBorder();
    });
    darkColorPicker.addEventListener("input", function(){
      darkColorHex.value = darkColorPicker.value.replace("#", "").toUpperCase();
      darkAuto = false;
      applyPreview();
      persistBorder();
    });

    var regenerateDarkBtn = document.getElementById("regenerateBorderDarkBtn");
    regenerateDarkBtn.addEventListener("click", function(){
      regenerateDark();
      persistBorder();
      saveStatus.textContent = "Dark color regenerated from Light";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    // A theme change can come from this page's own toggle click, another
    // open tab's storage event (see shell.js), or anywhere else that
    // flips data-theme - watching the attribute directly catches all of
    // them uniformly instead of hooking each source separately.
    new MutationObserver(applyPreview).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "standard";
    }

    // Persists on every real edit (preset pick, field change), not from
    // applyPreview()'s own programmatic callers (load, theme toggle) or
    // from Reset - see the same note in grid-layout.js.
    function persistBorder(){
      window.ADSStorage.safeSet(SAVE_KEY, {
        system: getActiveSystem(),
        width: widthSelect.value,
        color: colorHex.value,
        darkColor: darkColorHex.value,
        darkColorAuto: darkAuto,
        opacity: opacityInput.value,
        style: styleSelect.value,
        sides: sidesSelect.value
      });
    }

    function loadBorder(){
      var saved = window.ADSStorage.safeGet(SAVE_KEY);
      if (!saved){ regenerateDark(); applyPreview(); return; }

      if (saved.system) selectSystem(saved.system);

      if (saved.width) widthSelect.value = saved.width;
      if (saved.color){
        colorHex.value = saved.color;
        colorPicker.value = "#" + saved.color;
      }
      if (saved.opacity) opacityInput.value = saved.opacity;
      if (saved.style) styleSelect.value = saved.style;
      if (saved.sides) sidesSelect.value = saved.sides;

      if (saved.darkColor){
        darkColorHex.value = saved.darkColor;
        darkColorPicker.value = "#" + saved.darkColor;
        darkAuto = saved.darkColorAuto !== false;
      } else {
        regenerateDark();
      }

      applyPreview();
    }
    loadBorder();
    updatePresetsMachineView();

    var saveBtn = document.getElementById("saveBorderBtn");
    var saveStatus = document.getElementById("borderSaveStatus");
    saveBtn.addEventListener("click", function(){
      persistBorder();

      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var resetBtn = document.getElementById("resetBorderBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);
      selectSystem("standard");

      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    // ---------- per-state border colors ----------
    // Light and Dark are shown side by side per row (not swapped based on
    // the site's own active theme) so both can be checked against each
    // other at once - same "in parallel" approach as the Colors page.
    // Dark auto-follows Light per row until that row's dark field is
    // edited directly.
    var STATES_KEY = "ads:border-states";
    var stateRows = document.querySelectorAll('[data-role="state-row"]');
    var stateDefaults = {};
    var stateDarkAuto = {};
    var statesMachineJson = document.querySelector('[data-role="borderstates-machine-json"]');

    function updateStatesMachineView(){
      if (statesMachineJson){
        var states = Array.prototype.map.call(stateRows, function(row){
          var key = row.dataset.state;
          return {
            state: key,
            width: Number(row.dataset.width),
            opacity: Number(row.dataset.opacity),
            style: row.dataset.style,
            light: "#" + row.querySelector('[data-role="state-hex"]').value,
            dark: "#" + row.querySelector('[data-role="state-hex-dark"]').value,
            darkAuto: !!stateDarkAuto[key]
          };
        });
        statesMachineJson.textContent = JSON.stringify({ $schema: window.ADS_MACHINE_VIEW_SCHEMA, states: states }, null, 2);
      }
      renderMarkdown();
    }

    function applyStateSwatch(row, isDark, hex){
      var swatch = row.querySelector(isDark ? '[data-role="state-swatch-dark"]' : '[data-role="state-swatch"]');
      var hexField = row.querySelector(isDark ? '[data-role="state-hex-dark"]' : '[data-role="state-hex"]');

      swatch.value = "#" + hex.toLowerCase();
      hexField.value = hex.toUpperCase();
      updateStatesMachineView();
    }

    function regenerateStateDark(row){
      var key = row.dataset.state;
      var lightHex = row.querySelector('[data-role="state-hex"]').value;
      applyStateSwatch(row, true, suggestDark(lightHex).replace("#", ""));
      stateDarkAuto[key] = true;
    }

    stateRows.forEach(function(row){
      var key = row.dataset.state;
      stateDefaults[key] = {
        light: row.querySelector('[data-role="state-hex"]').value,
        dark: row.querySelector('[data-role="state-hex-dark"]').value
      };
      stateDarkAuto[key] = true;

      var swatch = row.querySelector('[data-role="state-swatch"]');
      var hexField = row.querySelector('[data-role="state-hex"]');
      var darkSwatch = row.querySelector('[data-role="state-swatch-dark"]');
      var darkHexField = row.querySelector('[data-role="state-hex-dark"]');

      hexField.addEventListener("input", function(){
        var hex = hexField.value.replace(/[^0-9a-f]/gi, "").slice(0, 6);
        if (hex.length !== 6) return;
        applyStateSwatch(row, false, hex);
        if (stateDarkAuto[key]) regenerateStateDark(row);
        persistStates();
      });
      swatch.addEventListener("input", function(){
        applyStateSwatch(row, false, swatch.value.replace("#", ""));
        if (stateDarkAuto[key]) regenerateStateDark(row);
        persistStates();
      });
      darkHexField.addEventListener("input", function(){
        var hex = darkHexField.value.replace(/[^0-9a-f]/gi, "").slice(0, 6);
        if (hex.length !== 6) return;
        applyStateSwatch(row, true, hex);
        stateDarkAuto[key] = false;
        persistStates();
      });
      darkSwatch.addEventListener("input", function(){
        applyStateSwatch(row, true, darkSwatch.value.replace("#", ""));
        stateDarkAuto[key] = false;
        persistStates();
      });
    });

    // Persists on every real per-row edit, not from loadStates()'s own
    // programmatic restore or Reset - see the same note in grid-layout.js.
    function persistStates(){
      var payload = {};
      stateRows.forEach(function(row){
        var key = row.dataset.state;
        payload[key] = {
          light: row.querySelector('[data-role="state-hex"]').value,
          dark: row.querySelector('[data-role="state-hex-dark"]').value,
          darkAuto: stateDarkAuto[key]
        };
      });
      window.ADSStorage.safeSet(STATES_KEY, payload);
    }

    function loadStates(){
      var saved = window.ADSStorage.safeGet(STATES_KEY);
      if (!saved) return;

      stateRows.forEach(function(row){
        var key = row.dataset.state;
        var rowSaved = saved[key];
        if (!rowSaved) return;
        if (rowSaved.light) applyStateSwatch(row, false, rowSaved.light);
        if (rowSaved.dark){
          applyStateSwatch(row, true, rowSaved.dark);
          stateDarkAuto[key] = rowSaved.darkAuto !== false;
        } else {
          regenerateStateDark(row);
        }
      });
    }
    loadStates();
    updateStatesMachineView();

    var saveStatesBtn = document.getElementById("saveStatesBtn");
    var regenerateStatesDarkBtn = document.getElementById("regenerateStatesDarkBtn");
    var statesSaveStatus = document.getElementById("statesSaveStatus");
    saveStatesBtn.addEventListener("click", function(){
      persistStates();

      statesSaveStatus.textContent = "Saved just now";
      setTimeout(function(){ statesSaveStatus.textContent = ''; }, 2500);
    });

    regenerateStatesDarkBtn.addEventListener("click", function(){
      stateRows.forEach(function(row){ regenerateStateDark(row); });
      persistStates();

      statesSaveStatus.textContent = "Dark colors regenerated from Light";
      setTimeout(function(){ statesSaveStatus.textContent = ''; }, 2500);
    });

    var resetStatesBtn = document.getElementById("resetStatesBtn");
    resetStatesBtn.addEventListener("click", function(){
      localStorage.removeItem(STATES_KEY);
      stateRows.forEach(function(row){
        var key = row.dataset.state;
        applyStateSwatch(row, false, stateDefaults[key].light);
        applyStateSwatch(row, true, stateDefaults[key].dark);
        stateDarkAuto[key] = true;
      });

      statesSaveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ statesSaveStatus.textContent = ''; }, 2500);
    });

    var copyMarkdownBtn = document.getElementById("copyBordersMarkdownBtn");
    var markdownStatus = document.getElementById("bordersMarkdownStatus");
    if (copyMarkdownBtn){
      copyMarkdownBtn.addEventListener("click", function(){
        var text = markdownOutput ? markdownOutput.textContent : "";
        function done(){
          markdownStatus.textContent = "Copied to clipboard";
          setTimeout(function(){ markdownStatus.textContent = ''; }, 2500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(text).then(done).catch(function(){
            markdownStatus.textContent = "Copy failed - select the text above and copy manually.";
          });
        } else {
          done();
        }
      });
    }
  });
})();
