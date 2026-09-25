(() => {
  "use strict";

  var BRAND_KEY = "ads:colors";
  var BG_KEY = "ads:bg-colors";
  var STATUS_KEY = "ads:status-colors";
  var NEUTRAL_KEY = "ads:neutral-colors";
  var TEXT_KEY = "ads:text-colors";
  var BRAND_LIGHT_DEFAULT = "FF031A";
  var BG_DEFAULTS = {
    light: { primary: "F6F6F4", secondary: "FFFFFF", tertiary: "FBFBFA" },
    dark: { primary: "0D0F11", secondary: "15171A", tertiary: "191C20" }
  };
  var STATUS_DEFAULTS = {
    light: { success: "2FBF6E", warning: "E6A53A", danger: "FF031A", info: "4F8FE6" }
  };
  var NEUTRAL_DEFAULTS = {
    light: { c800: "F1F1EE", c700: "E3E3DF", c600: "C7C7C1", c500: "8F918C", border: "85888D" },
    dark: { c800: "1C1F23", c700: "262A2F", c600: "383D44", c500: "565C64", border: "72767E" }
  };
  var TEXT_DEFAULTS = {
    light: { hi: "15171A", mid: "53565C", dim: "85888D" },
    dark: { hi: "F3F2EF", mid: "A7ABB2", dim: "64686F" }
  };

  document.addEventListener("DOMContentLoaded", function(){

    // Each color section's Save button used to always read "Save ..." no
    // matter what - clicking it only ever produced a transient "Saved just
    // now" message that vanished after 2.5s, so there was no way to tell,
    // especially after a reload, whether a section actually had a saved
    // value or was still just showing defaults. wireSaveState makes the
    // button's own label the persistent answer to that question: "Save ..."
    // means the fields on screen don't match what's in localStorage yet
    // (either nothing's been saved, or something's been edited since the
    // last save); "Saved ..." means they match exactly, right now. It
    // doesn't attempt to deep-compare field values against the saved
    // payload (hex casing, key order and optional dark overrides make that
    // fragile) - instead it tracks the simpler, equivalent fact: the fields
    // start in sync with storage right after a load or a save, and go out
    // of sync the moment any field in the section actually changes.
    function wireSaveState(section, btn){
      var unsavedLabel = btn.textContent.trim();
      var savedLabel = unsavedLabel.replace(/^Save\b/, "Saved");
      function setSaved(isSaved){
        btn.textContent = isSaved ? savedLabel : unsavedLabel;
        btn.classList.toggle("is-saved", isSaved);
      }
      section.addEventListener("input", function(){ setSaved(false); });
      section.addEventListener("change", function(){ setSaved(false); });
      return setSaved;
    }

    function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

    function normalizeHex(value){
      var hex = (value || "").replace(/[^0-9a-f]/gi, "").slice(0, 6);
      return hex.length === 6 ? hex.toUpperCase() : null;
    }

    function hexToRgb(hex){
      hex = (hex || "").replace("#", "");
      if (hex.length !== 6) hex = BRAND_LIGHT_DEFAULT;
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    }

    function hexToHsl(hex){
      var rgb = hexToRgb(hex);
      var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;
      if (max === min){
        h = s = 0;
      } else {
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
      h = ((h % 360) + 360) % 360;
      s = clamp(s, 0, 100) / 100;
      l = clamp(l, 0, 100) / 100;
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
      var toByte = function(v){ var n = Math.round((v + m) * 255); return n.toString(16).padStart(2, "0"); };
      return (toByte(r) + toByte(g) + toByte(b)).toUpperCase();
    }

    // Dark-mode adaptation for an accent color: lighten and slightly
    // desaturate so it doesn't vibrate against a near-black surface, the
    // same move most dark-theme brand palettes make (Material's dark theme
    // guidance included) - a pure hue-preserving copy of a saturated light
    // accent tends to read as too harsh once the surface goes dark.
    function suggestDarkAccent(lightHex){
      var hsl = hexToHsl(lightHex);
      var s = clamp(hsl.s - 8, 35, 100);
      var l = clamp(hsl.l + 12, 0, 78);
      return hslToHex(hsl.h, s, l);
    }

    function rgbToHex(r, g, b){
      var toByte = function(v){ var n = Math.round(clamp(v, 0, 255)); var h = n.toString(16); return h.length === 1 ? "0" + h : h; };
      return (toByte(r) + toByte(g) + toByte(b)).toUpperCase();
    }

    // Dark-mode adaptation for a near-white/near-black surface. Hue-shifting
    // by lightness inversion doesn't work here: at 96-100% lightness a tiny
    // RGB difference swings the computed hue wildly, and inverting three
    // near-white values that are only ~4% apart collapses them onto nearly
    // the same near-black value, losing the page/panel/raised separation
    // that was deliberately tuned into the dark defaults. Instead this
    // carries the light color's offset *from its own default* onto the
    // dark default in plain RGB space (stable at any lightness, and an
    // untouched light field reproduces the tuned dark default exactly),
    // then clamps the result back into "reads as a dark surface" range.
    function suggestDarkSurface(lightHex, key){
      var light = hexToRgb(lightHex);
      var lightDefault = hexToRgb(BG_DEFAULTS.light[key]);
      var darkDefault = hexToRgb(BG_DEFAULTS.dark[key]);
      var k = 0.4;
      var mixed = rgbToHex(
        darkDefault.r + (light.r - lightDefault.r) * k,
        darkDefault.g + (light.g - lightDefault.g) * k,
        darkDefault.b + (light.b - lightDefault.b) * k
      );
      var hsl = hexToHsl(mixed);
      return hslToHex(hsl.h, hsl.s, clamp(hsl.l, 2, 20));
    }

    function currentTheme(){
      return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }

    // Generalized version of the Background section's dark-suggestion math:
    // carries the light value's offset from ITS OWN default onto the dark
    // default in RGB space (stable at any lightness, identity when
    // unchanged), then keeps the result within `tolerance` percentage
    // points of the dark default's own lightness so a token that's meant
    // to read as "the dim one" can't drift into "the bright one".
    function suggestDarkFromDefault(lightHex, lightDefaultHex, darkDefaultHex, tolerance){
      var light = hexToRgb(lightHex);
      var lightDefault = hexToRgb(lightDefaultHex);
      var darkDefault = hexToRgb(darkDefaultHex);
      var k = 0.4;
      var mixed = rgbToHex(
        darkDefault.r + (light.r - lightDefault.r) * k,
        darkDefault.g + (light.g - lightDefault.g) * k,
        darkDefault.b + (light.b - lightDefault.b) * k
      );
      var hsl = hexToHsl(mixed);
      var darkDefaultHsl = hexToHsl(darkDefaultHex);
      var lo = clamp(darkDefaultHsl.l - tolerance, 0, 100);
      var hi = clamp(darkDefaultHsl.l + tolerance, 0, 100);
      return hslToHex(hsl.h, hsl.s, clamp(hsl.l, lo, hi));
    }

    function setHexField(picker, hexInput, hex){
      hex = normalizeHex(hex) || hex;
      picker.value = "#" + hex;
      hexInput.value = hex;
    }
    function wireHexPair(picker, hexInput, onChange){
      hexInput.addEventListener("input", function(){
        var hex = normalizeHex(hexInput.value);
        if (!hex) return;
        picker.value = "#" + hex;
        onChange();
      });
      picker.addEventListener("input", function(){
        hexInput.value = picker.value.replace("#", "").toUpperCase();
        onChange();
      });
    }

    // Shared controller for a Light/Dark pair of same-shape hex fields
    // (Semantic & status colors, Neutral scale) - one shared auto/custom
    // state for the whole set, since "Regenerate from Light" and the dark
    // toggle both act on the group, not on individual fields.
    function createHexPairSection(cfg){
      var auto = true;
      function mark(isAuto){
        auto = isAuto;
        cfg.darkStatus.textContent = isAuto ? "Auto-generated" : "Custom";
        cfg.darkStatus.className = "badge " + (isAuto ? "badge-auto" : "badge-custom");
      }
      function regenerateAll(){
        cfg.fields.forEach(function(f){
          setHexField(f.darkPicker, f.darkHex, f.suggest(f.lightHex.value, f.key));
        });
        mark(true);
      }
      cfg.fields.forEach(function(f){
        wireHexPair(f.lightPicker, f.lightHex, function(){ if (auto) regenerateAll(); });
        wireHexPair(f.darkPicker, f.darkHex, function(){ mark(false); });
      });
      cfg.regenerateBtn.addEventListener("click", regenerateAll);
      cfg.darkEnable.addEventListener("change", function(){ cfg.darkCol.hidden = !cfg.darkEnable.checked; });
      return {
        isAuto: function(){ return auto; },
        mark: mark,
        regenerateAll: regenerateAll,
        readLight: function(){ var o = {}; cfg.fields.forEach(function(f){ o[f.key] = f.lightHex.value.toUpperCase(); }); return o; },
        readDark: function(){ var o = {}; cfg.fields.forEach(function(f){ o[f.key] = f.darkHex.value.toUpperCase(); }); return o; },
        setLight: function(set){ cfg.fields.forEach(function(f){ setHexField(f.lightPicker, f.lightHex, set[f.key] || f.lightDefault); }); },
        setDark: function(set){ cfg.fields.forEach(function(f){ setHexField(f.darkPicker, f.darkHex, set[f.key] || f.darkDefault); }); }
      };
    }

    function renderScaleChips(hex, container){
      var rgb = hexToRgb(hex);
      var dark600 = hslToHexFromMix(rgb, 0, 0.18);
      var light400 = hslToHexFromMix(rgb, 255, 0.25);
      var tint = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.08)";
      var glow = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.35)";
      var chips = [
        { label: "400", bg: "#" + light400 },
        { label: "500", bg: "#" + hex },
        { label: "600", bg: "#" + dark600 },
        { label: "tint", bg: tint },
        { label: "glow", bg: glow }
      ];
      container.innerHTML = chips.map(function(c){
        return '<div class="color-chip"><span class="color-chip-swatch" style="background:' + c.bg + ';"></span><span class="color-chip-label">' + c.label + '</span></div>';
      }).join("");
    }
    function hslToHexFromMix(rgb, target, amt){
      var mix = function(c){ return Math.round(c + (target - c) * amt); };
      var toByte = function(v){ var h = v.toString(16); return h.length === 1 ? "0" + h : h; };
      return (toByte(mix(rgb.r)) + toByte(mix(rgb.g)) + toByte(mix(rgb.b))).toUpperCase();
    }

    function rgbString(hex){
      var rgb = hexToRgb(hex);
      return "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
    }

    // ============================================================
    // Brand color - Light (always on) + Dark (opt-in, auto-generated
    // from Light until the user edits it directly).
    // ============================================================
    var brandDarkEnable = document.querySelector('[data-role="brand-dark-enable"]');
    var brandDarkCol = document.querySelector('[data-role="brand-dark-col"]');
    var brandDarkStatus = document.querySelector('[data-role="brand-dark-status"]');

    var brandLightPicker = document.querySelector('[data-role="brand-light-picker"]');
    var brandLightHex = document.querySelector('[data-role="brand-light-hex"]');
    var brandLightRgba = document.querySelector('[data-role="brand-light-rgba"]');
    var brandLightScale = document.querySelector('[data-role="brand-light-scale"]');

    var brandDarkPicker = document.querySelector('[data-role="brand-dark-picker"]');
    var brandDarkHex = document.querySelector('[data-role="brand-dark-hex"]');
    var brandDarkRgba = document.querySelector('[data-role="brand-dark-rgba"]');
    var brandDarkScale = document.querySelector('[data-role="brand-dark-scale"]');
    var brandDarkRegenerate = document.querySelector('[data-role="brand-dark-regenerate"]');

    var brandDarkAuto = true;

    function setBrandLightFields(hex){
      hex = normalizeHex(hex) || BRAND_LIGHT_DEFAULT;
      brandLightPicker.value = "#" + hex;
      brandLightHex.value = hex;
      brandLightRgba.textContent = rgbString(hex);
      renderScaleChips(hex, brandLightScale);
    }
    function setBrandDarkFields(hex){
      hex = normalizeHex(hex) || BRAND_LIGHT_DEFAULT;
      brandDarkPicker.value = "#" + hex;
      brandDarkHex.value = hex;
      brandDarkRgba.textContent = rgbString(hex);
      renderScaleChips(hex, brandDarkScale);
    }
    function markBrandDarkStatus(auto){
      brandDarkAuto = auto;
      brandDarkStatus.textContent = auto ? "Auto-generated" : "Custom";
      brandDarkStatus.className = "badge " + (auto ? "badge-auto" : "badge-custom");
    }
    function regenerateBrandDark(){
      setBrandDarkFields(suggestDarkAccent(brandLightHex.value));
      markBrandDarkStatus(true);
    }

    brandLightHex.addEventListener("input", function(){
      var hex = normalizeHex(brandLightHex.value);
      if (!hex) return;
      brandLightPicker.value = "#" + hex;
      brandLightRgba.textContent = rgbString(hex);
      renderScaleChips(hex, brandLightScale);
      if (brandDarkAuto) regenerateBrandDark();
    });
    brandLightPicker.addEventListener("input", function(){
      var hex = brandLightPicker.value.replace("#", "").toUpperCase();
      brandLightHex.value = hex;
      brandLightRgba.textContent = rgbString(hex);
      renderScaleChips(hex, brandLightScale);
      if (brandDarkAuto) regenerateBrandDark();
    });

    brandDarkHex.addEventListener("input", function(){
      var hex = normalizeHex(brandDarkHex.value);
      if (!hex) return;
      brandDarkPicker.value = "#" + hex;
      brandDarkRgba.textContent = rgbString(hex);
      renderScaleChips(hex, brandDarkScale);
      markBrandDarkStatus(false);
    });
    brandDarkPicker.addEventListener("input", function(){
      var hex = brandDarkPicker.value.replace("#", "").toUpperCase();
      brandDarkHex.value = hex;
      brandDarkRgba.textContent = rgbString(hex);
      renderScaleChips(hex, brandDarkScale);
      markBrandDarkStatus(false);
    });

    brandDarkRegenerate.addEventListener("click", regenerateBrandDark);

    brandDarkEnable.addEventListener("change", function(){
      brandDarkCol.hidden = !brandDarkEnable.checked;
    });

    var saveBrandBtn = document.getElementById("saveBrandBtn");
    var setBrandSaved = wireSaveState(saveBrandBtn.closest(".color-foundation"), saveBrandBtn);

    function loadBrand(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(BRAND_KEY) || "null"); }catch(e){ saved = null; }

      var lightHex = (saved && saved.light && saved.light.primary && saved.light.primary.hex) ? saved.light.primary.hex.replace("#", "") : BRAND_LIGHT_DEFAULT;
      setBrandLightFields(lightHex);

      if (saved && saved.dark && saved.dark.primary && saved.dark.primary.hex){
        brandDarkEnable.checked = true;
        brandDarkCol.hidden = false;
        setBrandDarkFields(saved.dark.primary.hex.replace("#", ""));
        markBrandDarkStatus(saved.dark.auto !== false);
      } else {
        brandDarkEnable.checked = false;
        brandDarkCol.hidden = true;
        regenerateBrandDark();
      }
      setBrandSaved(!!saved);
    }
    loadBrand();

    function applyBrandLiveForActiveTheme(){
      var theme = currentTheme();
      // brandDarkHex always holds a usable value - either the user's own custom
      // dark override, or the auto-generated dark-theme variant kept in sync with
      // the light color (see regenerateBrandDark) - so dark theme must read it
      // unconditionally. Gating this on brandDarkEnable.checked (removed) meant
      // an unchecked "customize dark separately" toggle silently dropped the
      // brand color entirely in dark theme instead of falling back to its
      // auto-generated variant, which is the actual bug: your light-theme color
      // choice appeared to vanish the moment you switched to dark theme.
      var hex = theme === "dark" ? brandDarkHex.value : brandLightHex.value;
      var root = document.documentElement.style;
      if (hex){
        var rgb = hexToRgb(hex);
        root.setProperty("--red-500", "#" + hex);
        root.setProperty("--red-600", "#" + hslToHexFromMix(rgb, 0, 0.18));
        root.setProperty("--red-400", "#" + hslToHexFromMix(rgb, 255, 0.25));
        root.setProperty("--red-tint", "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.08)");
        root.setProperty("--red-glow", "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.35)");
      } else {
        root.removeProperty("--red-500");
        root.removeProperty("--red-600");
        root.removeProperty("--red-400");
        root.removeProperty("--red-tint");
        root.removeProperty("--red-glow");
      }
      // This function only ever runs from Save's click handler below, which
      // already applies the new color to the current page without a reload
      // - keep the topbar swatch's tooltip in sync with that same action,
      // instead of it only picking up the new hex on the next page load.
      if (window.ADS_updateBrandColorDotTitle) window.ADS_updateBrandColorDotTitle();
    }

    var brandSaveStatus = document.getElementById("brandSaveStatus");
    saveBrandBtn.addEventListener("click", function(){
      var lightHex = normalizeHex(brandLightHex.value);
      if (!lightHex) return;
      var payload = { light: { primary: { hex: "#" + lightHex } } };
      // Always persist a dark value (auto-generated when the user hasn't
      // customized it) - previously this was only saved when brandDarkEnable
      // was checked, so a plain light-color save left no "dark" key in
      // localStorage at all, and every other page's bootstrap script (which
      // reads saved[theme] directly) found nothing for dark theme and fell
      // back to the site default red instead of this brand color.
      var darkHex = normalizeHex(brandDarkHex.value);
      if (darkHex) payload.dark = { primary: { hex: "#" + darkHex }, auto: brandDarkAuto };
      localStorage.setItem(BRAND_KEY, JSON.stringify(payload));
      applyBrandLiveForActiveTheme();
      setBrandSaved(true);

      brandSaveStatus.hidden = false;
      brandSaveStatus.textContent = "Saved just now";
      setTimeout(function(){ brandSaveStatus.hidden = true; }, 2500);
    });

    var resetBrandBtn = document.getElementById("resetBrandBtn");
    resetBrandBtn.addEventListener("click", function(){
      localStorage.removeItem(BRAND_KEY);
      setBrandLightFields(BRAND_LIGHT_DEFAULT);
      brandDarkEnable.checked = false;
      brandDarkCol.hidden = true;
      regenerateBrandDark();
      document.documentElement.style.removeProperty("--red-500");
      document.documentElement.style.removeProperty("--red-600");
      document.documentElement.style.removeProperty("--red-400");
      document.documentElement.style.removeProperty("--red-tint");
      document.documentElement.style.removeProperty("--red-glow");
      setBrandSaved(false);

      brandSaveStatus.hidden = false;
      brandSaveStatus.textContent = "Reset to default";
      setTimeout(function(){ brandSaveStatus.hidden = true; }, 2500);
    });

    // ============================================================
    // Background / surface colors - Light (always on) + Dark (opt-in,
    // auto-generated from Light as one set until edited directly).
    // ============================================================
    var bgDarkEnable = document.querySelector('[data-role="bg-dark-enable"]');
    var bgDarkCol = document.querySelector('[data-role="bg-dark-col"]');
    var bgDarkStatus = document.querySelector('[data-role="bg-dark-status"]');

    var bgLightFields = {
      primary: { picker: document.querySelector('[data-role="bg-light-primary-picker"]'), hex: document.querySelector('[data-role="bg-light-primary-hex"]') },
      secondary: { picker: document.querySelector('[data-role="bg-light-secondary-picker"]'), hex: document.querySelector('[data-role="bg-light-secondary-hex"]') },
      tertiary: { picker: document.querySelector('[data-role="bg-light-tertiary-picker"]'), hex: document.querySelector('[data-role="bg-light-tertiary-hex"]') }
    };
    var bgDarkFields = {
      primary: { picker: document.querySelector('[data-role="bg-dark-primary-picker"]'), hex: document.querySelector('[data-role="bg-dark-primary-hex"]') },
      secondary: { picker: document.querySelector('[data-role="bg-dark-secondary-picker"]'), hex: document.querySelector('[data-role="bg-dark-secondary-hex"]') },
      tertiary: { picker: document.querySelector('[data-role="bg-dark-tertiary-picker"]'), hex: document.querySelector('[data-role="bg-dark-tertiary-hex"]') }
    };
    var elevationLight = {
      primary: document.querySelector('[data-role="elevation-light-primary"]'),
      secondary: document.querySelector('[data-role="elevation-light-secondary"]'),
      tertiary: document.querySelector('[data-role="elevation-light-tertiary"]')
    };
    var elevationDark = {
      primary: document.querySelector('[data-role="elevation-dark-primary"]'),
      secondary: document.querySelector('[data-role="elevation-dark-secondary"]'),
      tertiary: document.querySelector('[data-role="elevation-dark-tertiary"]')
    };

    var bgDarkAuto = true;

    function readTriple(fields){
      return {
        primary: fields.primary.hex.value.toUpperCase(),
        secondary: fields.secondary.hex.value.toUpperCase(),
        tertiary: fields.tertiary.hex.value.toUpperCase()
      };
    }
    function setTripleFields(fields, set){
      ["primary", "secondary", "tertiary"].forEach(function(key){
        var hex = normalizeHex(set[key]) || set[key];
        fields[key].picker.value = "#" + hex;
        fields[key].hex.value = hex;
      });
    }
    function renderElevation(layers, set){
      layers.primary.style.background = "#" + set.primary;
      layers.secondary.style.background = "#" + set.secondary;
      layers.tertiary.style.background = "#" + set.tertiary;
    }
    function markBgDarkStatus(auto){
      bgDarkAuto = auto;
      bgDarkStatus.textContent = auto ? "Auto-generated" : "Custom";
      bgDarkStatus.className = "badge " + (auto ? "badge-auto" : "badge-custom");
    }
    function regenerateBgDark(){
      var light = readTriple(bgLightFields);
      var dark = {
        primary: suggestDarkSurface(light.primary, "primary"),
        secondary: suggestDarkSurface(light.secondary, "secondary"),
        tertiary: suggestDarkSurface(light.tertiary, "tertiary")
      };
      setTripleFields(bgDarkFields, dark);
      renderElevation(elevationDark, dark);
      markBgDarkStatus(true);
    }

    function wireLightField(key){
      var field = bgLightFields[key];
      field.hex.addEventListener("input", function(){
        var hex = normalizeHex(field.hex.value);
        if (!hex) return;
        field.picker.value = "#" + hex;
        renderElevation(elevationLight, readTriple(bgLightFields));
        if (bgDarkAuto) regenerateBgDark();
      });
      field.picker.addEventListener("input", function(){
        field.hex.value = field.picker.value.replace("#", "").toUpperCase();
        renderElevation(elevationLight, readTriple(bgLightFields));
        if (bgDarkAuto) regenerateBgDark();
      });
    }
    function wireDarkField(key){
      var field = bgDarkFields[key];
      field.hex.addEventListener("input", function(){
        var hex = normalizeHex(field.hex.value);
        if (!hex) return;
        field.picker.value = "#" + hex;
        renderElevation(elevationDark, readTriple(bgDarkFields));
        markBgDarkStatus(false);
      });
      field.picker.addEventListener("input", function(){
        field.hex.value = field.picker.value.replace("#", "").toUpperCase();
        renderElevation(elevationDark, readTriple(bgDarkFields));
        markBgDarkStatus(false);
      });
    }
    ["primary", "secondary", "tertiary"].forEach(wireLightField);
    ["primary", "secondary", "tertiary"].forEach(wireDarkField);

    document.querySelector('[data-role="bg-dark-regenerate"]').addEventListener("click", regenerateBgDark);

    bgDarkEnable.addEventListener("change", function(){
      bgDarkCol.hidden = !bgDarkEnable.checked;
    });

    var saveBgBtn = document.getElementById("saveBgBtn");
    var setBgSaved = wireSaveState(saveBgBtn.closest(".color-foundation"), saveBgBtn);

    function loadBg(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(BG_KEY) || "null"); }catch(e){ saved = null; }

      var light = (saved && saved.light) ? saved.light : BG_DEFAULTS.light;
      setTripleFields(bgLightFields, light);
      renderElevation(elevationLight, readTriple(bgLightFields));

      if (saved && saved.dark){
        bgDarkEnable.checked = true;
        bgDarkCol.hidden = false;
        setTripleFields(bgDarkFields, saved.dark);
        renderElevation(elevationDark, readTriple(bgDarkFields));
        markBgDarkStatus(saved.dark.auto !== false);
      } else {
        bgDarkEnable.checked = false;
        bgDarkCol.hidden = true;
        regenerateBgDark();
      }
      setBgSaved(!!saved);
    }
    loadBg();

    function applyBgLiveForActiveTheme(){
      var theme = currentTheme();
      var set = theme === "dark"
        ? (bgDarkEnable.checked ? readTriple(bgDarkFields) : null)
        : readTriple(bgLightFields);
      var root = document.documentElement.style;
      if (set){
        root.setProperty("--graphite-950", "#" + set.primary);
        root.setProperty("--graphite-900", "#" + set.secondary);
        root.setProperty("--graphite-850", "#" + set.tertiary);
      } else {
        root.removeProperty("--graphite-950");
        root.removeProperty("--graphite-900");
        root.removeProperty("--graphite-850");
      }
    }

    var bgSaveStatus = document.getElementById("bgSaveStatus");
    saveBgBtn.addEventListener("click", function(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(BG_KEY) || "null") || {}; }catch(e){ saved = {}; }

      saved.light = readTriple(bgLightFields);
      if (bgDarkEnable.checked){
        var dark = readTriple(bgDarkFields);
        dark.auto = bgDarkAuto;
        saved.dark = dark;
      } else {
        delete saved.dark;
      }
      localStorage.setItem(BG_KEY, JSON.stringify(saved));
      applyBgLiveForActiveTheme();
      setBgSaved(true);

      bgSaveStatus.hidden = false;
      bgSaveStatus.textContent = "Saved just now";
      setTimeout(function(){ bgSaveStatus.hidden = true; }, 2500);
    });

    var resetBgBtn = document.getElementById("resetBgBtn");
    resetBgBtn.addEventListener("click", function(){
      localStorage.removeItem(BG_KEY);
      setTripleFields(bgLightFields, BG_DEFAULTS.light);
      renderElevation(elevationLight, readTriple(bgLightFields));
      bgDarkEnable.checked = false;
      bgDarkCol.hidden = true;
      regenerateBgDark();
      setBgSaved(false);
      document.documentElement.style.removeProperty("--graphite-950");
      document.documentElement.style.removeProperty("--graphite-900");
      document.documentElement.style.removeProperty("--graphite-850");

      bgSaveStatus.hidden = false;
      bgSaveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ bgSaveStatus.hidden = true; }, 2500);
    });

    // ============================================================
    // Semantic & status colors - Light (always on) + Dark (opt-in,
    // auto-generated per field, same accent adaptation as Brand).
    // ============================================================
    var statusDarkEnable = document.querySelector('[data-role="status-dark-enable"]');
    var statusDarkCol = document.querySelector('[data-role="status-dark-col"]');
    var statusDarkStatus = document.querySelector('[data-role="status-dark-status"]');

    var statusSection = createHexPairSection({
      darkEnable: statusDarkEnable,
      darkCol: statusDarkCol,
      darkStatus: statusDarkStatus,
      regenerateBtn: document.querySelector('[data-role="status-dark-regenerate"]'),
      fields: ["success", "warning", "danger", "info"].map(function(key){
        return {
          key: key,
          lightPicker: document.querySelector('[data-role="status-light-' + key + '-picker"]'),
          lightHex: document.querySelector('[data-role="status-light-' + key + '-hex"]'),
          darkPicker: document.querySelector('[data-role="status-dark-' + key + '-picker"]'),
          darkHex: document.querySelector('[data-role="status-dark-' + key + '-hex"]'),
          lightDefault: STATUS_DEFAULTS.light[key],
          darkDefault: STATUS_DEFAULTS.light[key],
          suggest: function(lightHex){ return suggestDarkAccent(lightHex); }
        };
      })
    });

    var saveStatusBtn = document.getElementById("saveStatusBtn");
    var setStatusSaved = wireSaveState(saveStatusBtn.closest(".color-foundation"), saveStatusBtn);

    function loadStatus(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(STATUS_KEY) || "null"); }catch(e){ saved = null; }
      statusSection.setLight((saved && saved.light) || STATUS_DEFAULTS.light);
      if (saved && saved.dark){
        statusDarkEnable.checked = true;
        statusDarkCol.hidden = false;
        statusSection.setDark(saved.dark);
        statusSection.mark(saved.dark.auto !== false);
      } else {
        statusDarkEnable.checked = false;
        statusDarkCol.hidden = true;
        statusSection.regenerateAll();
      }
      setStatusSaved(!!saved);
    }
    loadStatus();

    function applyStatusLiveForActiveTheme(){
      var theme = currentTheme();
      var set = theme === "dark" ? (statusDarkEnable.checked ? statusSection.readDark() : null) : statusSection.readLight();
      var root = document.documentElement.style;
      if (set){
        root.setProperty("--green-500", "#" + set.success);
        root.setProperty("--amber-500", "#" + set.warning);
        root.setProperty("--blue-500", "#" + set.info);
        var rgb = hexToRgb(set.danger);
        root.setProperty("--danger-500", "#" + set.danger);
        root.setProperty("--danger-600", "#" + hslToHexFromMix(rgb, 0, 0.18));
        root.setProperty("--danger-400", "#" + hslToHexFromMix(rgb, 255, 0.25));
      } else {
        root.removeProperty("--green-500");
        root.removeProperty("--amber-500");
        root.removeProperty("--blue-500");
        root.removeProperty("--danger-500");
        root.removeProperty("--danger-600");
        root.removeProperty("--danger-400");
      }
    }

    var statusSaveStatus = document.getElementById("statusSaveStatus");
    saveStatusBtn.addEventListener("click", function(){
      var payload = { light: statusSection.readLight() };
      if (statusDarkEnable.checked){
        var dark = statusSection.readDark();
        dark.auto = statusSection.isAuto();
        payload.dark = dark;
      }
      localStorage.setItem(STATUS_KEY, JSON.stringify(payload));
      applyStatusLiveForActiveTheme();
      setStatusSaved(true);

      statusSaveStatus.hidden = false;
      statusSaveStatus.textContent = "Saved just now";
      setTimeout(function(){ statusSaveStatus.hidden = true; }, 2500);
    });

    var resetStatusBtn = document.getElementById("resetStatusBtn");
    resetStatusBtn.addEventListener("click", function(){
      localStorage.removeItem(STATUS_KEY);
      statusSection.setLight(STATUS_DEFAULTS.light);
      statusDarkEnable.checked = false;
      statusDarkCol.hidden = true;
      statusSection.regenerateAll();
      document.documentElement.style.removeProperty("--green-500");
      document.documentElement.style.removeProperty("--amber-500");
      document.documentElement.style.removeProperty("--blue-500");
      document.documentElement.style.removeProperty("--danger-500");
      document.documentElement.style.removeProperty("--danger-600");
      document.documentElement.style.removeProperty("--danger-400");
      setStatusSaved(false);

      statusSaveStatus.hidden = false;
      statusSaveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ statusSaveStatus.hidden = true; }, 2500);
    });

    // ============================================================
    // Neutral scale (800/700/600/500 + control border) - 950/900/850
    // live in the Background section above. Light (always on) + Dark
    // (opt-in, auto-generated via the default-relative surface formula).
    // ============================================================
    var neutralDarkEnable = document.querySelector('[data-role="neutral-dark-enable"]');
    var neutralDarkCol = document.querySelector('[data-role="neutral-dark-col"]');
    var neutralDarkStatus = document.querySelector('[data-role="neutral-dark-status"]');

    var neutralSection = createHexPairSection({
      darkEnable: neutralDarkEnable,
      darkCol: neutralDarkCol,
      darkStatus: neutralDarkStatus,
      regenerateBtn: document.querySelector('[data-role="neutral-dark-regenerate"]'),
      fields: ["c800", "c700", "c600", "c500", "border"].map(function(key){
        return {
          key: key,
          lightPicker: document.querySelector('[data-role="neutral-light-' + key + '-picker"]'),
          lightHex: document.querySelector('[data-role="neutral-light-' + key + '-hex"]'),
          darkPicker: document.querySelector('[data-role="neutral-dark-' + key + '-picker"]'),
          darkHex: document.querySelector('[data-role="neutral-dark-' + key + '-hex"]'),
          lightDefault: NEUTRAL_DEFAULTS.light[key],
          darkDefault: NEUTRAL_DEFAULTS.dark[key],
          suggest: function(lightHex, k){ return suggestDarkFromDefault(lightHex, NEUTRAL_DEFAULTS.light[k], NEUTRAL_DEFAULTS.dark[k], 20); }
        };
      })
    });

    var saveNeutralBtn = document.getElementById("saveNeutralBtn");
    var setNeutralSaved = wireSaveState(saveNeutralBtn.closest(".color-foundation"), saveNeutralBtn);

    function loadNeutral(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(NEUTRAL_KEY) || "null"); }catch(e){ saved = null; }
      neutralSection.setLight((saved && saved.light) || NEUTRAL_DEFAULTS.light);
      if (saved && saved.dark){
        neutralDarkEnable.checked = true;
        neutralDarkCol.hidden = false;
        neutralSection.setDark(saved.dark);
        neutralSection.mark(saved.dark.auto !== false);
      } else {
        neutralDarkEnable.checked = false;
        neutralDarkCol.hidden = true;
        neutralSection.regenerateAll();
      }
      setNeutralSaved(!!saved);
    }
    loadNeutral();

    function applyNeutralLiveForActiveTheme(){
      var theme = currentTheme();
      var set = theme === "dark" ? (neutralDarkEnable.checked ? neutralSection.readDark() : null) : neutralSection.readLight();
      var root = document.documentElement.style;
      if (set){
        root.setProperty("--graphite-800", "#" + set.c800);
        root.setProperty("--graphite-700", "#" + set.c700);
        root.setProperty("--graphite-600", "#" + set.c600);
        root.setProperty("--graphite-500", "#" + set.c500);
        root.setProperty("--control-border", "#" + set.border);
      } else {
        root.removeProperty("--graphite-800");
        root.removeProperty("--graphite-700");
        root.removeProperty("--graphite-600");
        root.removeProperty("--graphite-500");
        root.removeProperty("--control-border");
      }
    }

    var neutralSaveStatus = document.getElementById("neutralSaveStatus");
    saveNeutralBtn.addEventListener("click", function(){
      var payload = { light: neutralSection.readLight() };
      if (neutralDarkEnable.checked){
        var dark = neutralSection.readDark();
        dark.auto = neutralSection.isAuto();
        payload.dark = dark;
      }
      localStorage.setItem(NEUTRAL_KEY, JSON.stringify(payload));
      applyNeutralLiveForActiveTheme();
      setNeutralSaved(true);

      neutralSaveStatus.hidden = false;
      neutralSaveStatus.textContent = "Saved just now";
      setTimeout(function(){ neutralSaveStatus.hidden = true; }, 2500);
    });

    var resetNeutralBtn = document.getElementById("resetNeutralBtn");
    resetNeutralBtn.addEventListener("click", function(){
      localStorage.removeItem(NEUTRAL_KEY);
      neutralSection.setLight(NEUTRAL_DEFAULTS.light);
      neutralDarkEnable.checked = false;
      neutralDarkCol.hidden = true;
      neutralSection.regenerateAll();
      document.documentElement.style.removeProperty("--graphite-800");
      document.documentElement.style.removeProperty("--graphite-700");
      document.documentElement.style.removeProperty("--graphite-600");
      document.documentElement.style.removeProperty("--graphite-500");
      document.documentElement.style.removeProperty("--control-border");
      setNeutralSaved(false);

      neutralSaveStatus.hidden = false;
      neutralSaveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ neutralSaveStatus.hidden = true; }, 2500);
    });

    // ============================================================
    // Text colors (Hi/Mid/Dim) - Light (always on) + Dark (opt-in,
    // auto-generated). Border color/opacity is its own topic with its
    // own controls on borders.html - not duplicated here.
    // ============================================================
    var textDarkEnable = document.querySelector('[data-role="text-dark-enable"]');
    var textDarkCol = document.querySelector('[data-role="text-dark-col"]');
    var textDarkStatus = document.querySelector('[data-role="text-dark-status"]');

    var textSection = createHexPairSection({
      darkEnable: textDarkEnable,
      darkCol: textDarkCol,
      darkStatus: textDarkStatus,
      regenerateBtn: document.querySelector('[data-role="text-dark-regenerate"]'),
      fields: ["hi", "mid", "dim"].map(function(key){
        return {
          key: key,
          lightPicker: document.querySelector('[data-role="text-light-' + key + '-picker"]'),
          lightHex: document.querySelector('[data-role="text-light-' + key + '-hex"]'),
          darkPicker: document.querySelector('[data-role="text-dark-' + key + '-picker"]'),
          darkHex: document.querySelector('[data-role="text-dark-' + key + '-hex"]'),
          lightDefault: TEXT_DEFAULTS.light[key],
          darkDefault: TEXT_DEFAULTS.dark[key],
          suggest: function(lightHex, k){ return suggestDarkFromDefault(lightHex, TEXT_DEFAULTS.light[k], TEXT_DEFAULTS.dark[k], 20); }
        };
      })
    });

    var saveTextBtn = document.getElementById("saveTextBtn");
    var setTextSaved = wireSaveState(saveTextBtn.closest(".color-foundation"), saveTextBtn);

    function loadText(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(TEXT_KEY) || "null"); }catch(e){ saved = null; }
      textSection.setLight((saved && saved.light) || TEXT_DEFAULTS.light);
      if (saved && saved.dark){
        textDarkEnable.checked = true;
        textDarkCol.hidden = false;
        textSection.setDark(saved.dark);
        textSection.mark(saved.dark.auto !== false);
      } else {
        textDarkEnable.checked = false;
        textDarkCol.hidden = true;
        textSection.regenerateAll();
      }
      setTextSaved(!!saved);
    }
    loadText();

    function applyTextLiveForActiveTheme(){
      var theme = currentTheme();
      var set = theme === "dark" ? (textDarkEnable.checked ? textSection.readDark() : null) : textSection.readLight();
      var root = document.documentElement.style;
      if (set){
        root.setProperty("--text-hi", "#" + set.hi);
        root.setProperty("--text-mid", "#" + set.mid);
        root.setProperty("--text-dim", "#" + set.dim);
      } else {
        root.removeProperty("--text-hi");
        root.removeProperty("--text-mid");
        root.removeProperty("--text-dim");
      }
    }

    var textSaveStatus = document.getElementById("textSaveStatus");
    saveTextBtn.addEventListener("click", function(){
      var payload = { light: textSection.readLight() };
      if (textDarkEnable.checked){
        var dark = textSection.readDark();
        dark.auto = textSection.isAuto();
        payload.dark = dark;
      }
      localStorage.setItem(TEXT_KEY, JSON.stringify(payload));
      applyTextLiveForActiveTheme();
      setTextSaved(true);

      textSaveStatus.hidden = false;
      textSaveStatus.textContent = "Saved just now";
      setTimeout(function(){ textSaveStatus.hidden = true; }, 2500);
    });

    var resetTextBtn = document.getElementById("resetTextBtn");
    resetTextBtn.addEventListener("click", function(){
      localStorage.removeItem(TEXT_KEY);
      textSection.setLight(TEXT_DEFAULTS.light);
      textDarkEnable.checked = false;
      textDarkCol.hidden = true;
      textSection.regenerateAll();
      document.documentElement.style.removeProperty("--text-hi");
      document.documentElement.style.removeProperty("--text-mid");
      document.documentElement.style.removeProperty("--text-dim");
      setTextSaved(false);

      textSaveStatus.hidden = false;
      textSaveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ textSaveStatus.hidden = true; }, 2500);
    });
  });
})();
