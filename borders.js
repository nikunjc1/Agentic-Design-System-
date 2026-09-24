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

    function sidesToProps(sides){
      switch(sides){
        case "top": return ["border-top"];
        case "right": return ["border-right"];
        case "bottom": return ["border-bottom"];
        case "left": return ["border-left"];
        case "horizontal": return ["border-top", "border-bottom"];
        case "vertical": return ["border-left", "border-right"];
        default: return ["border"];
      }
    }

    // The Live Preview represents this site's actual UI, so it follows
    // whichever theme the site is currently in - not a fixed choice - and
    // re-renders live if the theme is toggled while this page is open.
    function applyPreview(){
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
        props.forEach(function(prop){
          var camel = prop.replace(/-([a-z])/g, function(_, c){ return c.toUpperCase(); });
          el.style[camel] = value;
        });
      });

      // Dividers always render as a plain top/left rule, independent of the
      // Sides setting above - a separator line isn't a box with sides.
      previewDividersH.forEach(function(el){ el.style.borderTop = value; });
      previewDividersV.forEach(function(el){ el.style.borderLeft = value; });
    }

    function regenerateDark(){
      var hex = suggestDark(colorHex.value);
      darkColorPicker.value = hex;
      darkColorHex.value = hex.replace("#", "").toUpperCase();
      darkAuto = true;
      applyPreview();
    }

    function selectSystem(key){
      systemCards.forEach(function(card){
        card.classList.toggle("is-active", card.dataset.system === key);
      });
      var card = document.querySelector('.system-card[data-system="' + key + '"]');
      if (!card) return;

      widthSelect.value = card.dataset.width;
      var hex = card.dataset.color.replace("#", "").toUpperCase();
      colorPicker.value = card.dataset.color;
      colorHex.value = hex;
      opacityInput.value = card.dataset.opacity;
      styleSelect.value = card.dataset.style;

      // A freshly chosen preset seeds a fresh coordinated Light+Dark pair,
      // even if a previous manual Dark edit had turned auto-follow off.
      regenerateDark();
    }

    systemCards.forEach(function(card){
      card.addEventListener("click", function(){ selectSystem(card.dataset.system); });
    });

    widthSelect.addEventListener("change", applyPreview);
    styleSelect.addEventListener("change", applyPreview);
    sidesSelect.addEventListener("change", applyPreview);
    opacityInput.addEventListener("input", applyPreview);
    colorHex.addEventListener("input", function(){
      var hex = colorHex.value.replace(/[^0-9a-f]/gi, "").slice(0, 6);
      if (hex.length === 6) colorPicker.value = "#" + hex;
      if (darkAuto) regenerateDark();
      applyPreview();
    });
    colorPicker.addEventListener("input", function(){
      colorHex.value = colorPicker.value.replace("#", "").toUpperCase();
      if (darkAuto) regenerateDark();
      applyPreview();
    });
    darkColorHex.addEventListener("input", function(){
      var hex = darkColorHex.value.replace(/[^0-9a-f]/gi, "").slice(0, 6);
      if (hex.length === 6) darkColorPicker.value = "#" + hex;
      darkAuto = false;
      applyPreview();
    });
    darkColorPicker.addEventListener("input", function(){
      darkColorHex.value = darkColorPicker.value.replace("#", "").toUpperCase();
      darkAuto = false;
      applyPreview();
    });

    var regenerateDarkBtn = document.getElementById("regenerateBorderDarkBtn");
    regenerateDarkBtn.addEventListener("click", function(){
      regenerateDark();
      saveStatus.hidden = false;
      saveStatus.textContent = "Dark color regenerated from Light";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
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

    function loadBorder(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ saved = null; }
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

    var saveBtn = document.getElementById("saveBorderBtn");
    var saveStatus = document.getElementById("borderSaveStatus");
    saveBtn.addEventListener("click", function(){
      var payload = {
        system: getActiveSystem(),
        width: widthSelect.value,
        color: colorHex.value,
        darkColor: darkColorHex.value,
        darkColorAuto: darkAuto,
        opacity: opacityInput.value,
        style: styleSelect.value,
        sides: sidesSelect.value
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));

      saveStatus.hidden = false;
      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });

    var resetBtn = document.getElementById("resetBorderBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);
      selectSystem("standard");

      saveStatus.hidden = false;
      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
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

    function applyStateSwatch(row, isDark, hex){
      var width = row.dataset.width;
      var style = row.dataset.style;
      var opacity = Number(row.dataset.opacity);
      var swatch = row.querySelector(isDark ? '[data-role="state-swatch-dark"]' : '[data-role="state-swatch"]');
      var hexField = row.querySelector(isDark ? '[data-role="state-hex-dark"]' : '[data-role="state-hex"]');
      var rgb = hexToRgb(hex);
      var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + (opacity / 100) + ")";

      swatch.value = "#" + hex.toLowerCase();
      swatch.style.border = width + "px " + style + " " + rgba;
      hexField.value = hex.toUpperCase();
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
      });
      swatch.addEventListener("input", function(){
        applyStateSwatch(row, false, swatch.value.replace("#", ""));
        if (stateDarkAuto[key]) regenerateStateDark(row);
      });
      darkHexField.addEventListener("input", function(){
        var hex = darkHexField.value.replace(/[^0-9a-f]/gi, "").slice(0, 6);
        if (hex.length !== 6) return;
        applyStateSwatch(row, true, hex);
        stateDarkAuto[key] = false;
      });
      darkSwatch.addEventListener("input", function(){
        applyStateSwatch(row, true, darkSwatch.value.replace("#", ""));
        stateDarkAuto[key] = false;
      });
    });

    function loadStates(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(STATES_KEY) || "null"); }catch(e){ saved = null; }
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

    var saveStatesBtn = document.getElementById("saveStatesBtn");
    var regenerateStatesDarkBtn = document.getElementById("regenerateStatesDarkBtn");
    var statesSaveStatus = document.getElementById("statesSaveStatus");
    saveStatesBtn.addEventListener("click", function(){
      var payload = {};
      stateRows.forEach(function(row){
        var key = row.dataset.state;
        payload[key] = {
          light: row.querySelector('[data-role="state-hex"]').value,
          dark: row.querySelector('[data-role="state-hex-dark"]').value,
          darkAuto: stateDarkAuto[key]
        };
      });
      localStorage.setItem(STATES_KEY, JSON.stringify(payload));

      statesSaveStatus.hidden = false;
      statesSaveStatus.textContent = "Saved just now";
      setTimeout(function(){ statesSaveStatus.hidden = true; }, 2500);
    });

    regenerateStatesDarkBtn.addEventListener("click", function(){
      stateRows.forEach(function(row){ regenerateStateDark(row); });

      statesSaveStatus.hidden = false;
      statesSaveStatus.textContent = "Dark colors regenerated from Light";
      setTimeout(function(){ statesSaveStatus.hidden = true; }, 2500);
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

      statesSaveStatus.hidden = false;
      statesSaveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ statesSaveStatus.hidden = true; }, 2500);
    });
  });
})();
