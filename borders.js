(() => {
  "use strict";

  var SAVE_KEY = "ads:border";

  document.addEventListener("DOMContentLoaded", function(){
    var systemCards = document.querySelectorAll(".system-card");

    var widthSelect = document.querySelector('[data-role="border-width"]');
    var colorPicker = document.querySelector('[data-role="border-color-picker"]');
    var colorHex = document.querySelector('[data-role="border-color-hex"]');
    var opacityInput = document.querySelector('[data-role="border-opacity"]');
    var styleSelect = document.querySelector('[data-role="border-style"]');
    var sidesSelect = document.querySelector('[data-role="border-sides"]');

    var previewBox = document.querySelector('[data-role="preview-box"]');
    var previewButton = document.querySelector('[data-role="preview-button"]');
    var previewInput = document.querySelector('[data-role="preview-input"]');
    var previewDividersH = document.querySelectorAll('[data-role="preview-divider-h"]');
    var previewDividersV = document.querySelectorAll('[data-role="preview-divider-v"]');

    function hexToRgb(hex){
      hex = (hex || "9A9A95").replace("#", "");
      if (hex.length !== 6) hex = "9A9A95";
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
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

    function applyPreview(){
      var width = widthSelect.value;
      var style = styleSelect.value;
      var opacity = Math.max(0, Math.min(100, parseInt(opacityInput.value, 10) || 0));
      var rgb = hexToRgb(colorHex.value);
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

    function selectSystem(key){
      systemCards.forEach(function(card){
        card.classList.toggle("is-active", card.dataset.system === key);
      });
      var card = document.querySelector('.system-card[data-system="' + key + '"]');
      if (!card) return;

      widthSelect.value = card.dataset.width;
      var rgb = hexToRgb(card.dataset.color);
      var hex = card.dataset.color.replace("#", "").toUpperCase();
      colorPicker.value = card.dataset.color;
      colorHex.value = hex;
      opacityInput.value = card.dataset.opacity;
      styleSelect.value = card.dataset.style;

      applyPreview();
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
      applyPreview();
    });
    colorPicker.addEventListener("input", function(){
      colorHex.value = colorPicker.value.replace("#", "").toUpperCase();
      applyPreview();
    });

    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "standard";
    }

    function loadBorder(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ saved = null; }
      if (!saved){ applyPreview(); return; }

      if (saved.system) selectSystem(saved.system);

      if (saved.width) widthSelect.value = saved.width;
      if (saved.color){
        colorHex.value = saved.color;
        colorPicker.value = "#" + saved.color;
      }
      if (saved.opacity) opacityInput.value = saved.opacity;
      if (saved.style) styleSelect.value = saved.style;
      if (saved.sides) sidesSelect.value = saved.sides;

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
    var STATES_KEY = "ads:border-states";
    var stateRows = document.querySelectorAll('[data-role="state-row"]');
    var stateDefaults = {};

    stateRows.forEach(function(row){
      var key = row.dataset.state;
      var hexInput = row.querySelector('[data-role="state-hex"]');
      stateDefaults[key] = hexInput.value;
    });

    function applyStateRow(row, hex){
      var width = row.dataset.width;
      var style = row.dataset.style;
      var opacity = Number(row.dataset.opacity);
      var swatch = row.querySelector('[data-role="state-swatch"]');
      var hexField = row.querySelector('[data-role="state-hex"]');
      var rgb = hexToRgb(hex);
      var rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + (opacity / 100) + ")";

      swatch.value = "#" + hex.toLowerCase();
      swatch.style.border = width + "px " + style + " " + rgba;
      hexField.value = hex.toUpperCase();
    }

    stateRows.forEach(function(row){
      var swatch = row.querySelector('[data-role="state-swatch"]');
      var hexField = row.querySelector('[data-role="state-hex"]');

      hexField.addEventListener("input", function(){
        var hex = hexField.value.replace(/[^0-9a-f]/gi, "").slice(0, 6);
        if (hex.length === 6) applyStateRow(row, hex);
      });
      swatch.addEventListener("input", function(){
        applyStateRow(row, swatch.value.replace("#", ""));
      });
    });

    function loadStates(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(STATES_KEY) || "null"); }catch(e){ saved = null; }
      if (!saved) return;

      stateRows.forEach(function(row){
        var key = row.dataset.state;
        if (saved[key]) applyStateRow(row, saved[key]);
      });
    }
    loadStates();

    var saveStatesBtn = document.getElementById("saveStatesBtn");
    var statesSaveStatus = document.getElementById("statesSaveStatus");
    saveStatesBtn.addEventListener("click", function(){
      var payload = {};
      stateRows.forEach(function(row){
        payload[row.dataset.state] = row.querySelector('[data-role="state-hex"]').value;
      });
      localStorage.setItem(STATES_KEY, JSON.stringify(payload));

      statesSaveStatus.hidden = false;
      statesSaveStatus.textContent = "Saved just now";
      setTimeout(function(){ statesSaveStatus.hidden = true; }, 2500);
    });

    var resetStatesBtn = document.getElementById("resetStatesBtn");
    resetStatesBtn.addEventListener("click", function(){
      localStorage.removeItem(STATES_KEY);
      stateRows.forEach(function(row){
        applyStateRow(row, stateDefaults[row.dataset.state]);
      });

      statesSaveStatus.hidden = false;
      statesSaveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ statesSaveStatus.hidden = true; }, 2500);
    });
  });
})();
