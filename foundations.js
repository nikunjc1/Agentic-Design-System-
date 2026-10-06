(() => {
  "use strict";

  var BRAND_KEY = "ads:colors";
  var BG_KEY = "ads:bg-colors";
  var STATUS_KEY = "ads:status-colors";
  var NEUTRAL_KEY = "ads:neutral-colors";
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
  // Text colors no longer has its own editable section on this page
  // (removed - Typography's per-level colors are the one place for text
  // color now); .hi stays here only as the fixed reference value the
  // contrast badges check Background swatches against.
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
    // persistFn (optional) auto-persists the section's current values to
    // localStorage on every edit, not only on an explicit Save click - so a
    // Markdown export always reflects what's on screen right now instead of
    // requiring a separate "remember to click Save on all 8 pages first"
    // step. The button's own Save/Saved label still tracks live-vs-saved
    // for a beat (it flips to "Save ..." the instant a field changes, then
    // back to "Saved ..." once persistFn's write completes just after) -
    // kept rather than removed since it's still a truthful, if now
    // near-instant, signal.
    function wireSaveState(section, btn, persistFn){
      var unsavedLabel = btn.textContent.trim();
      var savedLabel = unsavedLabel.replace(/^Save\b/, "Saved");
      function setSaved(isSaved){
        btn.textContent = isSaved ? savedLabel : unsavedLabel;
        btn.classList.toggle("is-saved", isSaved);
      }
      function handleEdit(){
        setSaved(false);
        if (persistFn) { persistFn(); setSaved(true); }
      }
      section.addEventListener("input", handleEdit);
      section.addEventListener("change", handleEdit);
      return setSaved;
    }

    function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

    function normalizeHex(value){
      var hex = (value || "").replace(/[^0-9a-f]/gi, "").slice(0, 6);
      return hex.length === 6 ? hex.toUpperCase() : null;
    }
    // Foundation audit C03 - Surface/Status/Neutral used to save whatever
    // was literally in the hex text field, uppercased, with no check that
    // it was even a complete 6-digit hex (unlike Brand, which already
    // guarded via normalizeHex() and aborted the save if invalid). An
    // incomplete in-progress edit (e.g. "a1b") could become the committed,
    // exported, applied value the moment any other field's input event
    // fired. This keeps the field itself free to show whatever's being
    // typed (the draft), but every *read* used for persisting/applying/
    // exporting falls back to that one input's own last known-good value
    // instead of committing an incomplete one - separating draft from
    // last-valid state per field, not per section.
    function validatedHex(input){
      var normalized = normalizeHex(input.value);
      if (normalized){
        input.dataset.lastValid = normalized;
        input.removeAttribute("aria-invalid");
        return normalized;
      }
      input.setAttribute("aria-invalid", "true");
      return input.dataset.lastValid || normalized || "000000";
    }
    // Foundation audit C03 - "rejection lacks consistent field error": names
    // which field(s) were rejected, in the same status element each save
    // already uses, instead of a silent no-op or an unexplained kept value.
    function reportHexErrors(container, statusEl, savedMessage){
      var invalid = container.querySelectorAll('input[aria-invalid="true"]');
      if (!invalid.length){ statusEl.textContent = savedMessage; return; }
      var labels = Array.prototype.map.call(invalid, function(input){
        var field = input.closest(".color-field");
        var label = field && field.querySelector(".color-field-label");
        return label ? label.textContent : "a field";
      });
      statusEl.textContent = savedMessage + " " + labels.join(", ") + " looked incomplete - kept the last valid value there.";
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

    // WCAG 2.x contrast (relative luminance -> (L1+0.05)/(L2+0.05)). AA
    // normal text needs >=4.5:1, AAA needs >=7:1 - the thresholds every
    // "AA/AAA" contrast badge in design tooling is built on.
    function srgbChannelToLinear(c){
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    function relativeLuminance(hex){
      var rgb = hexToRgb(hex);
      return 0.2126 * srgbChannelToLinear(rgb.r) + 0.7152 * srgbChannelToLinear(rgb.g) + 0.0722 * srgbChannelToLinear(rgb.b);
    }
    function contrastRatio(hexA, hexB){
      var l1 = relativeLuminance(hexA), l2 = relativeLuminance(hexB);
      var lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    // Foundation audit C05 - "no on-brand resolver/editor." A single fixed
    // on-brand text color (this system's old --color-on-brand: #fff) can't
    // actually be correct for every brand color: a light/pastel brand (this
    // system's own auto-generated dark-theme default included) needs dark
    // text, a saturated one needs light text - and which is "better" can
    // even flip between a brand color's own default/hover/active shades.
    // Resolves by maximizing the *worst* of the 3 states, not just the
    // default shade alone, since optimizing default in isolation could still
    // leave hover or active worse than the other candidate overall.
    var ON_BRAND_DARK_TEXT = "15171A";
    var ON_BRAND_LIGHT_TEXT = "FFFFFF";
    function resolveOnBrandText(hex500, hex400, hex600){
      var worstDark = Math.min(contrastRatio(ON_BRAND_DARK_TEXT, hex500), contrastRatio(ON_BRAND_DARK_TEXT, hex400), contrastRatio(ON_BRAND_DARK_TEXT, hex600));
      var worstLight = Math.min(contrastRatio(ON_BRAND_LIGHT_TEXT, hex500), contrastRatio(ON_BRAND_LIGHT_TEXT, hex400), contrastRatio(ON_BRAND_LIGHT_TEXT, hex600));
      return worstDark >= worstLight ? ON_BRAND_DARK_TEXT : ON_BRAND_LIGHT_TEXT;
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
    //
    // A single fixed +12 lightness step was a blind heuristic, not a
    // guarantee - measured directly: a navy (#1A2A6C), a forest green
    // (#0A4D2E), a maroon (#6B1E3C) and a few other real hues all landed
    // under 3:1 against the default dark background, nowhere near AA
    // (4.5:1) let alone AAA (7:1). Suggested dark colors must actually
    // pass, not just plausibly look dark-theme-appropriate, so this now
    // searches upward in lightness - preserving the light color's own
    // hue and the same -8 saturation move as before - for the darkest
    // (least washed-out) value that clears AAA against whichever dark
    // background is actually active right now (custom if one is saved,
    // the documented default otherwise - the same background the
    // contrast badges already check against, so the two never disagree).
    // Falls back to the best ratio found if AAA genuinely isn't
    // reachable at this hue (vanishingly rare against a near-black
    // background, but never left unhandled).
    function currentDarkBgHex(){
      var input = document.querySelector('[data-role="bg-dark-primary-hex"]');
      return (input && normalizeHex(input.value)) || BG_DEFAULTS.dark.primary;
    }
    function suggestDarkAccent(lightHex, targetBgHex){
      var hsl = hexToHsl(lightHex);
      var s = clamp(hsl.s - 8, 35, 100);
      var bg = "#" + (targetBgHex || currentDarkBgHex()).replace("#", "");
      var best = null;
      for (var l = 10; l <= 97; l += 1){
        var candidate = hslToHex(hsl.h, s, l);
        var ratio = contrastRatio(candidate, bg);
        if (!best || ratio > best.ratio) best = { hex: candidate, ratio: ratio };
        if (ratio >= 7) return candidate;
      }
      return best.hex;
    }

    function rgbToHex(r, g, b){
      var toByte = function(v){ var n = Math.round(clamp(v, 0, 255)); var h = n.toString(16); return h.length === 1 ? "0" + h : h; };
      return (toByte(r) + toByte(g) + toByte(b)).toUpperCase();
    }

    // HSB/HSV - the color-picker widget's own native space (a 2D
    // saturation/brightness square at a fixed hue), distinct from the HSL
    // used elsewhere for dark-theme suggestions. Kept separate rather than
    // routed through hexToHsl/hslToHex so dragging inside the square maps
    // directly to s/b without a lossy HSL round-trip.
    function rgbToHsb(r, g, b){
      r /= 255; g /= 255; b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
      var h;
      if (d === 0) h = 0;
      else if (max === r) h = 60 * (((g - b) / d) % 6);
      else if (max === g) h = 60 * ((b - r) / d + 2);
      else h = 60 * ((r - g) / d + 4);
      if (h < 0) h += 360;
      var s = max === 0 ? 0 : d / max;
      return { h: h, s: s * 100, b: max * 100 };
    }
    function hsbToRgb(h, s, v){
      h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; v = clamp(v, 0, 100) / 100;
      var c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
      var r, g, b;
      if (h < 60){ r = c; g = x; b = 0; }
      else if (h < 120){ r = x; g = c; b = 0; }
      else if (h < 180){ r = 0; g = c; b = x; }
      else if (h < 240){ r = 0; g = x; b = c; }
      else if (h < 300){ r = x; g = 0; b = c; }
      else { r = c; g = 0; b = x; }
      return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
    }
    function hexToHsb(hex){ var rgb = hexToRgb(hex); return rgbToHsb(rgb.r, rgb.g, rgb.b); }
    function hsbToHex(h, s, v){ var rgb = hsbToRgb(h, s, v); return rgbToHex(rgb.r, rgb.g, rgb.b); }

    // Color-vision-deficiency preview - the same simplified sRGB matrix
    // approach widely used by web-based CVD simulators (Coblis and
    // similar), not the more precise LMS-space method (Brettel/Machado).
    // That's a deliberate, disclosed tradeoff for a quick design-time
    // preview, not a claim of clinical accuracy.
    var CVD_MATRICES = {
      protanopia: [0.567, 0.433, 0.000, 0.558, 0.442, 0.000, 0.000, 0.242, 0.758],
      deuteranopia: [0.625, 0.375, 0.000, 0.700, 0.300, 0.000, 0.000, 0.300, 0.700],
      tritanopia: [0.950, 0.050, 0.000, 0.000, 0.433, 0.567, 0.000, 0.475, 0.525]
    };
    function simulateCvd(hex, type){
      var m = CVD_MATRICES[type];
      var rgb = hexToRgb(hex);
      return rgbToHex(
        m[0] * rgb.r + m[1] * rgb.g + m[2] * rgb.b,
        m[3] * rgb.r + m[4] * rgb.g + m[5] * rgb.b,
        m[6] * rgb.r + m[7] * rgb.g + m[8] * rgb.b
      );
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
      hexInput.dataset.lastValid = hex;
      hexInput.removeAttribute("aria-invalid");
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
        readLight: function(){ var o = {}; cfg.fields.forEach(function(f){ o[f.key] = validatedHex(f.lightHex); }); return o; },
        readDark: function(){ var o = {}; cfg.fields.forEach(function(f){ o[f.key] = validatedHex(f.darkHex); }); return o; },
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
      // Foundation audit C05 - "validate default/hover/pressed pairs." The
      // resolved on-brand text color's real contrast against all 3 shades
      // this exact swatch produces, surfaced right next to them instead of
      // left unvalidated - including the honest case where this system's
      // own default red can't clear AA on every one of the 3 states with
      // either fixed text color choice.
      var onBrandEl = container.nextElementSibling;
      if (onBrandEl && onBrandEl.matches('[data-role$="-on-brand-text"]')){
        var resolved = resolveOnBrandText(hex, light400, dark600);
        var resolvedName = resolved === ON_BRAND_DARK_TEXT ? "dark text (#15171A)" : "white text (#FFFFFF)";
        var states = [
          { label: "Default", hex: "#" + hex },
          { label: "Hover", hex: "#" + light400 },
          { label: "Active", hex: "#" + dark600 }
        ];
        onBrandEl.innerHTML = "On-brand text resolves to " + resolvedName + ":" + states.map(function(s){
          var r = contrastRatio(resolved, s.hex);
          var pass = r >= 4.5;
          return ' <span class="contrast-ratio">' + s.label + " " + r.toFixed(2) + ':1</span><span class="contrast-tag ' + (pass ? "is-pass" : "is-fail") + '">AA ' + (pass ? "&#10003;" : "&#10007;") + '</span>';
        }).join("");
      }
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
    function persistBrand(){
      var lightHex = normalizeHex(brandLightHex.value);
      if (!lightHex) return;
      var payload = { light: { primary: { hex: "#" + lightHex } } };
      var darkHex = normalizeHex(brandDarkHex.value);
      if (darkHex) payload.dark = { primary: { hex: "#" + darkHex }, auto: brandDarkAuto };
      window.ADSStorage.safeSet(BRAND_KEY, payload);
    }
    var setBrandSaved = wireSaveState(saveBrandBtn.closest(".color-foundation"), saveBrandBtn, persistBrand);

    function loadBrand(){
      var saved;
      saved = window.ADSStorage.safeGet(BRAND_KEY);

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
        var red600 = hslToHexFromMix(rgb, 0, 0.18);
        var red400 = hslToHexFromMix(rgb, 255, 0.25);
        root.setProperty("--red-500", "#" + hex);
        root.setProperty("--red-600", "#" + red600);
        root.setProperty("--red-400", "#" + red400);
        root.setProperty("--red-tint", "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.08)");
        root.setProperty("--red-glow", "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.35)");
        root.setProperty("--on-brand-text", "#" + resolveOnBrandText(hex, red400, red600));
      } else {
        root.removeProperty("--red-500");
        root.removeProperty("--red-600");
        root.removeProperty("--red-400");
        root.removeProperty("--red-tint");
        root.removeProperty("--red-glow");
        root.removeProperty("--on-brand-text");
      }
      // This function only ever runs from Save's click handler below, which
      // already applies the new color to the current page without a reload
      // - keep the topbar swatch's tooltip in sync with that same action,
      // instead of it only picking up the new hex on the next page load.
      if (window.ADS_updateBrandColorDotTitle) window.ADS_updateBrandColorDotTitle();
    }

    var brandSaveStatus = document.getElementById("brandSaveStatus");
    saveBrandBtn.addEventListener("click", function(){
      if (!normalizeHex(brandLightHex.value)){
        brandLightHex.setAttribute("aria-invalid", "true");
        brandSaveStatus.textContent = "Primary looked incomplete - kept the last saved value, nothing was applied.";
        setTimeout(function(){ brandSaveStatus.textContent = ''; }, 2500);
        return;
      }
      persistBrand();
      applyBrandLiveForActiveTheme();
      setBrandSaved(true);

      brandSaveStatus.textContent = "Applied to this page - your edits auto-save as you type";
      setTimeout(function(){ brandSaveStatus.textContent = ''; }, 2500);
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

      brandSaveStatus.textContent = "Reset to default";
      setTimeout(function(){ brandSaveStatus.textContent = ''; }, 2500);
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
      tertiary: document.querySelector('[data-role="elevation-light-tertiary"]'),
      warning: document.querySelector('[data-role="elevation-light-warning"]')
    };
    var elevationDark = {
      primary: document.querySelector('[data-role="elevation-dark-primary"]'),
      secondary: document.querySelector('[data-role="elevation-dark-secondary"]'),
      tertiary: document.querySelector('[data-role="elevation-dark-tertiary"]'),
      warning: document.querySelector('[data-role="elevation-dark-warning"]')
    };

    var bgDarkAuto = true;

    function readTriple(fields){
      return {
        primary: validatedHex(fields.primary.hex),
        secondary: validatedHex(fields.secondary.hex),
        tertiary: validatedHex(fields.tertiary.hex)
      };
    }
    function setTripleFields(fields, set){
      ["primary", "secondary", "tertiary"].forEach(function(key){
        var hex = normalizeHex(set[key]) || set[key];
        fields[key].picker.value = "#" + hex;
        fields[key].hex.value = hex;
        fields[key].hex.dataset.lastValid = hex;
        fields[key].hex.removeAttribute("aria-invalid");
      });
    }
    // Page/Panel/Raised only read as 3 distinct elevation steps if each
    // pair is far enough apart in lightness to actually look different
    // next to each other - order alone doesn't guarantee that (and this
    // system's own light-theme defaults aren't even monotonic: Panel
    // (pure white, 100% L) is lighter than both Page (96.1%) and Raised
    // (98.2%), by design, so a strict "increasing" rule would be wrong).
    // 1.2 points is comfortably below the smallest real gap in either
    // theme's own defaults (~1.76 light, ~1.96 dark), so neither default
    // ever triggers this - only a genuinely collapsed custom choice does.
    var MIN_ELEVATION_GAP = 1.2;
    function checkElevationHierarchy(set){
      var l = { primary: hexToHsl(set.primary).l, secondary: hexToHsl(set.secondary).l, tertiary: hexToHsl(set.tertiary).l };
      var gaps = [
        ["Page","Panel", Math.abs(l.primary - l.secondary)],
        ["Panel","Raised", Math.abs(l.secondary - l.tertiary)],
        ["Page","Raised", Math.abs(l.primary - l.tertiary)]
      ];
      var tooClose = gaps.filter(function(g){ return g[2] < MIN_ELEVATION_GAP; });
      if (!tooClose.length) return null;
      return tooClose.map(function(g){ return g[0] + " and " + g[1]; }).join(", ") + " are too close in lightness to read as separate elevation steps - consider spacing them further apart.";
    }
    function renderElevation(layers, set){
      layers.primary.style.background = "#" + set.primary;
      layers.secondary.style.background = "#" + set.secondary;
      layers.tertiary.style.background = "#" + set.tertiary;
      if (layers.warning){
        var warning = checkElevationHierarchy(set);
        layers.warning.textContent = warning || "";
        layers.warning.hidden = !warning;
      }
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
    function persistBg(){
      var saved = window.ADSStorage.safeGet(BG_KEY) || {};
      saved.light = readTriple(bgLightFields);
      if (bgDarkEnable.checked){
        var dark = readTriple(bgDarkFields);
        dark.auto = bgDarkAuto;
        saved.dark = dark;
      } else {
        delete saved.dark;
      }
      window.ADSStorage.safeSet(BG_KEY, saved);
    }
    var setBgSaved = wireSaveState(saveBgBtn.closest(".color-foundation"), saveBgBtn, persistBg);

    function loadBg(){
      var saved;
      saved = window.ADSStorage.safeGet(BG_KEY);

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
      persistBg();
      applyBgLiveForActiveTheme();
      setBgSaved(true);

      reportHexErrors(saveBgBtn.closest(".color-foundation"), bgSaveStatus, "Applied to this page - your edits auto-save as you type.");
      setTimeout(function(){ bgSaveStatus.textContent = ''; }, 2500);
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

      bgSaveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ bgSaveStatus.textContent = ''; }, 2500);
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
    function persistStatus(){
      var payload = { light: statusSection.readLight() };
      if (statusDarkEnable.checked){
        var dark = statusSection.readDark();
        dark.auto = statusSection.isAuto();
        payload.dark = dark;
      }
      window.ADSStorage.safeSet(STATUS_KEY, payload);
    }
    var setStatusSaved = wireSaveState(saveStatusBtn.closest(".color-foundation"), saveStatusBtn, persistStatus);

    function loadStatus(){
      var saved;
      saved = window.ADSStorage.safeGet(STATUS_KEY);
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
      persistStatus();
      applyStatusLiveForActiveTheme();
      setStatusSaved(true);

      reportHexErrors(saveStatusBtn.closest(".color-foundation"), statusSaveStatus, "Applied to this page - your edits auto-save as you type.");
      setTimeout(function(){ statusSaveStatus.textContent = ''; }, 2500);
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

      statusSaveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ statusSaveStatus.textContent = ''; }, 2500);
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
    function persistNeutral(){
      var payload = { light: neutralSection.readLight() };
      if (neutralDarkEnable.checked){
        var dark = neutralSection.readDark();
        dark.auto = neutralSection.isAuto();
        payload.dark = dark;
      }
      window.ADSStorage.safeSet(NEUTRAL_KEY, payload);
    }
    var setNeutralSaved = wireSaveState(saveNeutralBtn.closest(".color-foundation"), saveNeutralBtn, persistNeutral);

    function loadNeutral(){
      var saved;
      saved = window.ADSStorage.safeGet(NEUTRAL_KEY);
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
      persistNeutral();
      applyNeutralLiveForActiveTheme();
      setNeutralSaved(true);

      reportHexErrors(saveNeutralBtn.closest(".color-foundation"), neutralSaveStatus, "Applied to this page - your edits auto-save as you type.");
      setTimeout(function(){ neutralSaveStatus.textContent = ''; }, 2500);
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

      neutralSaveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ neutralSaveStatus.textContent = ''; }, 2500);
    });

    // Foundation audit C02 - "provide separate all-colors reset/undo." A
    // deliberate, correctly-scoped all-4 action, replacing what the removed
    // cross-wiring bug used to look like by accident (and never actually
    // did - that bug only ever changed checkboxes, never real saved data).
    // Reuses each section's own already-correct reset click handler rather
    // than duplicating their logic.
    var resetAllColorsBtn = document.getElementById("resetAllColorsBtn");
    if (resetAllColorsBtn){
      resetAllColorsBtn.addEventListener("click", function(){
        resetBrandBtn.click();
        resetBgBtn.click();
        resetStatusBtn.click();
        resetNeutralBtn.click();
        var resetAllStatus = document.getElementById("resetAllColorsStatus");
        if (resetAllStatus){
          resetAllStatus.textContent = "All colors reset to defaults";
          setTimeout(function(){ resetAllStatus.textContent = ''; }, 2500);
        }
      });
    }

    // Dark Mode, as one setting across every Color Foundation section, not
    // four independent per-section opt-ins. Reported as inconsistent:
    // enabling/disabling "dark theme" in one section (e.g. Brand) had no
    // effect on the others, since each only ever read its own saved
    // data. The actual dark VALUES stay per-section - each section's own
    // Foundation audit C02 - this used to force all 4 checkboxes/columns to
    // the same state the moment any one changed, on load, AND treat "any one
    // section has dark data" as "show all 4 as enabled." That only ever
    // changed what was on screen, though: each section's own persist
    // function is bound to that section's own input/change events (see
    // wireSaveState/createHexPairSection), so a checkbox flipped by this
    // shared code (a direct .checked assignment, not a real user interaction
    // with that checkbox) never dispatched a change event there and never
    // actually persisted - only the section the user really clicked did.
    // That produced exactly the "toggle/reset undone" bug this finding
    // named: 3 sections LOOKED reconfigured but their storage never changed,
    // so reloading reverted what the UI had shown. Brand, Background (via
    // their own inline listener above) and Status/Neutral (via
    // createHexPairSection's own internal listener) already each correctly
    // show/hide their own column from their own checkbox alone - this
    // shared layer was pure redundant cross-wiring on top of code that
    // already worked correctly per section. Removed entirely; each
    // section's dark customization is now genuinely its own, matching what
    // 4 separate checkboxes in 4 separate sections actually implies.

    // AA/AAA contrast badge under every color swatch's hex field - checked
    // against that swatch's own theme's Page (Primary) background, which is
    // what every one of these colors (brand accent, status color, neutral
    // fill, body text) actually gets read against on a real page. Runs once
    // all 5 sections above have loaded their saved (or default) values, and
    // recomputes on any input/change anywhere on the page - editing the
    // background itself has to update every other field's badge too, not
    // just its own.
    function initContrastBadges(){
      var fields = Array.prototype.slice.call(document.querySelectorAll(".color-field"));
      fields.forEach(function(field){
        // .color-rgba only exists on 6 of the 32 fields (Brand and Status's
        // light column show a live rgb()/description string there;
        // Background, Neutral, Text and Status's dark column don't have one
        // at all) - .hex-input-wrap (the swatch + hex text input row) is
        // the one element every field actually has, so the badge anchors
        // to that instead, right after the input itself.
        var anchor = field.querySelector(".hex-input-wrap");
        if (!anchor || field.querySelector(".color-contrast")) return;
        var badge = document.createElement("p");
        badge.className = "color-contrast";
        anchor.insertAdjacentElement("afterend", badge);
      });

      var lightBgHexInput = document.querySelector('[data-role="bg-light-primary-hex"]');
      var darkBgHexInput = document.querySelector('[data-role="bg-dark-primary-hex"]');

      // Shared with the custom color-picker popover below, so the live
      // readout inside an open picker always matches the badge under the
      // field it belongs to - one source of truth for "what should this
      // swatch be checked against."
      // Foundation audit C04 - alpha-blends hex over bg at the given opacity
      // (simple source-over compositing), so a tint's *actual rendered*
      // color can be contrast-checked instead of silently treating opacity
      // as if it weren't there.
      function alphaBlend(hex, bgHex, alpha){
        var fg = hexToRgb(hex), bg = hexToRgb(bgHex);
        var mix = function(a, b){ return Math.round(a * alpha + b * (1 - alpha)); };
        var toHex = function(n){ var h = n.toString(16); return h.length === 1 ? "0" + h : h; };
        return toHex(mix(fg.r, bg.r)) + toHex(mix(fg.g, bg.g)) + toHex(mix(fg.b, bg.b));
      }
      function contrastForField(field, hex){
        var hexInput = field.querySelector('input[type="text"][data-role]');
        var col = field.closest(".theme-pair-col");
        var label = col ? (col.querySelector(".theme-pair-label") || {}).textContent || "" : "";
        var isDark = /Dark/i.test(label);
        var lightBg = normalizeHex(lightBgHexInput.value) || BG_DEFAULTS.light.primary;
        var darkBg = normalizeHex(darkBgHexInput.value) || BG_DEFAULTS.dark.primary;
        // Text colors no longer has its own editable section (removed -
        // Typography's per-level colors are the one place for text color
        // now), so "primary text" for this check is just the fixed
        // default Hi value rather than a live, user-editable input.
        var lightTextHi = TEXT_DEFAULTS.light.hi;
        var darkTextHi = TEXT_DEFAULTS.dark.hi;
        // Background's own swatches (Page/Panel/Raised) ARE the page
        // background, so checking them against "page background" is
        // checking a color against itself - always ~1:1, never useful.
        // What actually matters for a surface color is whether the
        // page's primary text stays readable on it, so those fields
        // compare against text-hi instead, and say so in the label.
        var isBgSwatch = /^bg-/.test((hexInput && hexInput.dataset.role) || "");
        var bg = isBgSwatch ? (isDark ? darkTextHi : lightTextHi) : (isDark ? darkBg : lightBg);
        var vsLabel = isBgSwatch ? "vs primary text" : "vs page background";
        var ratio = contrastRatio(hex, bg);
        // A border swatch is a non-text UI boundary, not text - WCAG 1.4.11
        // (Non-text Contrast) sets its bar at 3:1 against the adjacent
        // surface, not the 4.5:1/7:1 text thresholds every other swatch is
        // checked against. Showing this one a "fails AA" reading it was
        // never actually held to would be misleading, not just imprecise.
        var isUiComponent = /-border-hex$/.test((hexInput && hexInput.dataset.role) || "");
        // Foundation audit C04 - "omits on-brand text... opacity." Brand is
        // the one swatch with a real, live, computed tint token
        // (--red-tint, see regenerateBrandDark/applyBrandLiveForActiveTheme)
        // - 8% opacity, not invented here. Status has no equivalent live
        // tint token (its own tag/badge tints in shell.css are hardcoded to
        // specific named colors, not derived from the user's edited hex),
        // so this check only applies where a real token backs it.
        var isBrandSwatch = /^brand-(light|dark)-hex$/.test((hexInput && hexInput.dataset.role) || "");
        var tintResult = null;
        if (isBrandSwatch){
          var pageBg = isDark ? darkBg : lightBg;
          var tintBlend = alphaBlend(hex, pageBg, 0.08);
          var tintRatio = contrastRatio(hex, tintBlend);
          tintResult = { ratio: tintRatio, aaPass: tintRatio >= 4.5, aaaPass: tintRatio >= 7, vsLabel: "as text on its own 8% tint" };
        }
        return {
          ratio: ratio,
          aaPass: ratio >= 4.5,
          aaaPass: ratio >= 7,
          vsLabel: vsLabel,
          isUiComponent: isUiComponent,
          uiPass: ratio >= 3,
          tintResult: tintResult
        };
      }

      function badgeHtml(result){
        var tags = result.isUiComponent
          ? '<span class="contrast-tag ' + (result.uiPass ? "is-pass" : "is-fail") + '">Non-text 3:1 ' + (result.uiPass ? "&#10003;" : "&#10007;") + '</span>'
          : '<span class="contrast-tag ' + (result.aaPass ? "is-pass" : "is-fail") + '">AA ' + (result.aaPass ? "&#10003;" : "&#10007;") + '</span>' +
            '<span class="contrast-tag ' + (result.aaaPass ? "is-pass" : "is-fail") + '">AAA ' + (result.aaaPass ? "&#10003;" : "&#10007;") + '</span>';
        var html = '<span class="contrast-ratio">' + result.ratio.toFixed(2) + ':1 ' + result.vsLabel + '</span>' + tags;
        if (result.tintResult){
          var t = result.tintResult;
          html += '<br><span class="contrast-ratio">' + t.ratio.toFixed(2) + ':1 ' + t.vsLabel + '</span>' +
            '<span class="contrast-tag ' + (t.aaPass ? "is-pass" : "is-fail") + '">AA ' + (t.aaPass ? "&#10003;" : "&#10007;") + '</span>' +
            '<span class="contrast-tag ' + (t.aaaPass ? "is-pass" : "is-fail") + '">AAA ' + (t.aaaPass ? "&#10003;" : "&#10007;") + '</span>';
        }
        return html;
      }

      function recompute(){
        fields.forEach(function(field){
          var hexInput = field.querySelector('input[type="text"][data-role]');
          var badge = field.querySelector(".color-contrast");
          if (!hexInput || !badge) return;
          var hex = normalizeHex(hexInput.value);
          if (!hex){ badge.textContent = ""; return; }
          badge.innerHTML = badgeHtml(contrastForField(field, hex));
        });
      }

      document.querySelector("main").addEventListener("input", recompute);
      document.querySelector("main").addEventListener("change", recompute);
      recompute();

      return { contrastForField: contrastForField, badgeHtml: badgeHtml };
    }
    var contrastHelpers = initContrastBadges();

    // Machine View for the 4 editable color sections above - unlike a
    // component page's Machine View (static usage docs), these fields are
    // live-editable, so its JSON has to be the live current token values,
    // not a fixed spec. Recomputes on the same delegated input/change
    // listener pattern initContrastBadges already uses.
    function initColorMachineViews(){
      var sections = ["brand", "bg", "status", "neutral"];

      var SECTION_TITLES = {
        brand: "Brand Color",
        bg: "Background & Surface Elevation",
        status: "Semantic & Status Colors",
        neutral: "Neutral Scale"
      };
      var FIELD_LABELS = {
        brand: { value: "Primary" },
        bg: { primary: "Primary", secondary: "Secondary", tertiary: "Tertiary" },
        status: { success: "Success", warning: "Warning", danger: "Danger", info: "Info" },
        neutral: { c800: "C800", c700: "C700", c600: "C600", c500: "C500", border: "Border" }
      };

      function collectTheme(prefix, theme){
        var out = {};
        var stripPrefix = prefix + "-" + theme + "-";
        var inputs = document.querySelectorAll('input[type="text"][data-role^="' + stripPrefix + '"]');
        inputs.forEach(function(input){
          var rest = input.dataset.role.slice(stripPrefix.length);
          var key;
          if (rest === "hex") key = "value";
          else if (/-hex$/.test(rest)) key = rest.slice(0, -4);
          else return;
          var hex = normalizeHex(input.value);
          if (hex) out[key] = "#" + hex;
        });
        return out;
      }

      // Renders the same light/dark values every section's Machine View
      // JSON already reads, as one consolidated Markdown document instead -
      // this is the "MD file" the Colors tab itself was missing: a single,
      // always-current, copyable snapshot of every section, not a JSON
      // blob buried inside each section's own toggle.
      function renderMarkdown(){
        var mdEl = document.querySelector('[data-role="colors-markdown-output"]');
        if (!mdEl) return;
        var lines = ["# Color Tokens", ""];
        sections.forEach(function(prefix){
          var light = collectTheme(prefix, "light");
          var enableInput = document.querySelector('[data-role="' + prefix + '-dark-enable"]');
          var darkEnabled = !!(enableInput && enableInput.checked);
          // Foundation audit C01 - Brand's dark field always holds a real,
          // applied value (auto-generated from light the moment the field
          // exists, unconditionally persisted by persistBrand() regardless
          // of this checkbox - see the always-persist-dark fix in
          // applyBrandLiveForActiveTheme()'s own comment). Gating Brand's
          // export on this checkbox hid a dark value that's genuinely
          // live on the site right now. Background/Status/Neutral are
          // different: unchecked really does mean no override exists for
          // them, and they correctly fall back to this system's own
          // built-in dark default - omitting their dark export when
          // unchecked stays correct.
          var dark = (prefix === "brand" || darkEnabled) ? collectTheme(prefix, "dark") : null;
          var labels = FIELD_LABELS[prefix] || {};
          lines.push("## " + SECTION_TITLES[prefix], "");
          Object.keys(light).forEach(function(key){
            lines.push("- " + (labels[key] || key) + " (Light): `" + light[key] + "`");
          });
          if (dark){
            Object.keys(dark).forEach(function(key){
              lines.push("- " + (labels[key] || key) + " (Dark): `" + dark[key] + "`");
            });
          }
          lines.push("");
        });
        mdEl.textContent = lines.join("\n").trim();
      }

      function recompute(){
        sections.forEach(function(prefix){
          var code = document.querySelector('[data-role="' + prefix + '-machine-json"]');
          if (!code) return;
          var enableInput = document.querySelector('[data-role="' + prefix + '-dark-enable"]');
          var darkEnabled = !!(enableInput && enableInput.checked);
          // Foundation audit C01 - same "Brand always resolves a real dark
          // value" distinction as renderMarkdown() above: darkOverrideEnabled
          // still reflects whether this is a user-customized color (true)
          // versus auto-generated from light (false), but dark itself is
          // never withheld for Brand, since it's always genuinely applied.
          var data = {
            $schema: window.ADS_MACHINE_VIEW_SCHEMA,
            token: prefix,
            light: collectTheme(prefix, "light"),
            darkOverrideEnabled: darkEnabled,
            dark: (prefix === "brand" || darkEnabled) ? collectTheme(prefix, "dark") : null
          };
          code.textContent = JSON.stringify(data, null, 2);
        });
        renderMarkdown();
      }

      document.querySelector("main").addEventListener("input", recompute);
      document.querySelector("main").addEventListener("change", recompute);
      recompute();

      var copyBtn = document.getElementById("copyColorsMarkdownBtn");
      var copyStatus = document.getElementById("colorsMarkdownStatus");
      if (copyBtn){
        copyBtn.addEventListener("click", function(){
          var text = document.querySelector('[data-role="colors-markdown-output"]').textContent;
          function done(){
            copyStatus.textContent = "Copied to clipboard";
            setTimeout(function(){ copyStatus.textContent = ''; }, 2500);
          }
          if (navigator.clipboard && navigator.clipboard.writeText){
            navigator.clipboard.writeText(text).then(done).catch(function(){
              copyStatus.textContent = "Copy failed - select the text above and copy manually.";
            });
          } else {
            done();
          }
        });
      }
    }
    initColorMachineViews();

    // Custom color-picker popover - replaces the OS-native <input
    // type="color"> flyout (which on most platforms only offers RGB, no
    // Hex/CSS/HSL/HSB switcher and no accessibility feedback at all) with
    // one built for this site: a saturation/brightness square, hue slider,
    // a format switcher (Hex/RGB/HSL/HSB/CSS), and the same live AA/AAA
    // readout as the badge under the field. The underlying native <input
    // type="color"> for each swatch is kept exactly as-is (still the one
    // source of truth every other function here already reads/writes) -
    // just visually hidden and driven by dispatching a real "input" event
    // on it, so wireHexPair, wireSaveState and the contrast badge above
    // all react to a picker-driven change exactly as they already do to a
    // typed hex value, with no changes needed anywhere else.
    function initCustomColorPickers(contrastForField, badgeHtml){
      var pairs = [];

      var popover = document.createElement("div");
      popover.className = "color-popover";
      popover.setAttribute("role", "dialog");
      popover.setAttribute("aria-label", "Color picker");
      popover.hidden = true;
      popover.innerHTML =
        '<div class="color-popover-sv" tabindex="0">' +
          '<div class="color-popover-sv-white"></div>' +
          '<div class="color-popover-sv-black"></div>' +
          '<span class="color-popover-sv-thumb"></span>' +
        '</div>' +
        '<div class="color-popover-hue" tabindex="0">' +
          '<span class="color-popover-hue-thumb"></span>' +
        '</div>' +
        '<div class="color-popover-alpha-row">' +
          '<div class="color-popover-alpha" tabindex="0" title="Preview/copy opacity - the saved swatch color stays fully opaque">' +
            '<div class="color-popover-alpha-fill"></div>' +
            '<span class="color-popover-alpha-thumb"></span>' +
          '</div>' +
          '<span class="color-popover-alpha-value">100%</span>' +
        '</div>' +
        '<div class="color-popover-format-row">' +
          '<label class="color-popover-value-cell color-popover-format-cell">' +
            '<span aria-hidden="true">&nbsp;</span>' +
            '<select class="color-popover-format-select" aria-label="Color format">' +
              '<option value="hex">Hex</option>' +
              '<option value="rgb">RGB</option>' +
              '<option value="hsl">HSL</option>' +
              '<option value="hsb">HSB</option>' +
              '<option value="css">CSS</option>' +
            '</select>' +
          '</label>' +
          '<div class="color-popover-values"></div>' +
          '<button type="button" class="color-popover-copy" hidden>Copy</button>' +
        '</div>' +
        '<p class="color-popover-contrast"></p>' +
        '<div class="color-popover-cvd">' +
          '<span class="color-popover-cvd-swatch" data-cvd="protanopia" title="Protanopia (red-weak) simulation"></span>' +
          '<span class="color-popover-cvd-swatch" data-cvd="deuteranopia" title="Deuteranopia (green-weak) simulation"></span>' +
          '<span class="color-popover-cvd-swatch" data-cvd="tritanopia" title="Tritanopia (blue-weak) simulation"></span>' +
        '</div>';
      document.body.appendChild(popover);

      var svEl = popover.querySelector(".color-popover-sv");
      var svThumb = popover.querySelector(".color-popover-sv-thumb");
      var hueEl = popover.querySelector(".color-popover-hue");
      var hueThumb = popover.querySelector(".color-popover-hue-thumb");
      var alphaEl = popover.querySelector(".color-popover-alpha");
      var alphaFill = popover.querySelector(".color-popover-alpha-fill");
      var alphaThumb = popover.querySelector(".color-popover-alpha-thumb");
      var alphaValueEl = popover.querySelector(".color-popover-alpha-value");
      var formatSelect = popover.querySelector(".color-popover-format-select");
      var valuesEl = popover.querySelector(".color-popover-values");
      var copyBtn = popover.querySelector(".color-popover-copy");
      var contrastEl = popover.querySelector(".color-popover-contrast");
      var cvdSwatches = Array.prototype.slice.call(popover.querySelectorAll(".color-popover-cvd-swatch"));

      var FORMAT_SPECS = {
        hex: [{ key: "hex", label: "#" }],
        rgb: [{ key: "r", label: "R" }, { key: "g", label: "G" }, { key: "b", label: "B" }],
        hsl: [{ key: "h", label: "H" }, { key: "s", label: "S%" }, { key: "l", label: "L%" }],
        hsb: [{ key: "h", label: "H" }, { key: "s", label: "S%" }, { key: "b", label: "B%" }],
        css: [{ key: "css", label: "CSS" }]
      };

      var lastFormat = "hex";
      var active = null;
      var syncing = false;

      function currentHex(){ return hsbToHex(active.hsb.h, active.hsb.s, active.hsb.b); }

      function renderValueInputs(){
        var spec = FORMAT_SPECS[formatSelect.value];
        valuesEl.innerHTML = "";
        spec.forEach(function(cell){
          var wrap = document.createElement("label");
          wrap.className = "color-popover-value-cell";
          var span = document.createElement("span");
          span.textContent = cell.label;
          var input = document.createElement("input");
          input.type = "text";
          input.autocomplete = "off";
          input.spellcheck = false;
          input.dataset.key = cell.key;
          if (formatSelect.value === "css") input.readOnly = true;
          wrap.appendChild(span);
          wrap.appendChild(input);
          valuesEl.appendChild(wrap);
        });
        copyBtn.hidden = formatSelect.value !== "css";
        updateValueInputs();
      }

      function updateValueInputs(){
        if (!active) return;
        var hex = currentHex();
        var rgb = hexToRgb(hex);
        var format = formatSelect.value;
        var inputs = valuesEl.querySelectorAll("input");
        if (format === "hex"){
          inputs[0].value = hex;
        } else if (format === "rgb"){
          inputs[0].value = Math.round(rgb.r);
          inputs[1].value = Math.round(rgb.g);
          inputs[2].value = Math.round(rgb.b);
        } else if (format === "hsl"){
          var hsl = hexToHsl(hex);
          inputs[0].value = Math.round(hsl.h);
          inputs[1].value = Math.round(hsl.s);
          inputs[2].value = Math.round(hsl.l);
        } else if (format === "hsb"){
          inputs[0].value = Math.round(active.hsb.h);
          inputs[1].value = Math.round(active.hsb.s);
          inputs[2].value = Math.round(active.hsb.b);
        } else if (format === "css"){
          inputs[0].value = active.alpha >= 100
            ? "rgb(" + Math.round(rgb.r) + ", " + Math.round(rgb.g) + ", " + Math.round(rgb.b) + ")"
            : "rgba(" + Math.round(rgb.r) + ", " + Math.round(rgb.g) + ", " + Math.round(rgb.b) + ", " + (active.alpha / 100).toFixed(2) + ")";
        }
      }

      function applyValueInputs(){
        if (!active) return;
        var format = formatSelect.value;
        var inputs = valuesEl.querySelectorAll("input");
        if (format === "hex"){
          var hex = normalizeHex(inputs[0].value);
          if (hex) active.hsb = hexToHsb(hex);
        } else if (format === "rgb"){
          active.hsb = rgbToHsb(
            clamp(parseInt(inputs[0].value, 10) || 0, 0, 255),
            clamp(parseInt(inputs[1].value, 10) || 0, 0, 255),
            clamp(parseInt(inputs[2].value, 10) || 0, 0, 255)
          );
        } else if (format === "hsl"){
          active.hsb = hexToHsb(hslToHex(
            clamp(parseFloat(inputs[0].value) || 0, 0, 360),
            clamp(parseFloat(inputs[1].value) || 0, 0, 100),
            clamp(parseFloat(inputs[2].value) || 0, 0, 100)
          ));
        } else if (format === "hsb"){
          active.hsb = {
            h: clamp(parseFloat(inputs[0].value) || 0, 0, 360),
            s: clamp(parseFloat(inputs[1].value) || 0, 0, 100),
            b: clamp(parseFloat(inputs[2].value) || 0, 0, 100)
          };
        }
        updateVisuals();
      }

      function updateVisuals(){
        if (!active) return;
        var hex = currentHex();
        svEl.style.background = "#" + hsbToHex(active.hsb.h, 100, 100);
        svThumb.style.left = active.hsb.s + "%";
        svThumb.style.top = (100 - active.hsb.b) + "%";
        svThumb.style.background = "#" + hex;
        hueThumb.style.left = (active.hsb.h / 360 * 100) + "%";
        alphaThumb.style.left = active.alpha + "%";
        alphaFill.style.background = "linear-gradient(to right, transparent, #" + hex + ")";
        alphaValueEl.textContent = active.alpha + "%";

        active.trigger.style.background = "#" + hex;
        syncing = true;
        if (active.picker.value.toLowerCase() !== ("#" + hex).toLowerCase()){
          active.picker.value = "#" + hex;
          active.picker.dispatchEvent(new Event("input", { bubbles: true }));
        }
        syncing = false;

        contrastEl.innerHTML = badgeHtml(contrastForField(active.field, hex));
        cvdSwatches.forEach(function(swatch){
          swatch.style.background = "#" + simulateCvd(hex, swatch.dataset.cvd);
        });
        updateValueInputs();
      }

      function positionPopover(trigger){
        var rect = trigger.getBoundingClientRect();
        var popRect = popover.getBoundingClientRect();
        var top = rect.bottom + 8;
        var left = rect.left;
        if (left + popRect.width > window.innerWidth - 12) left = window.innerWidth - popRect.width - 12;
        if (top + popRect.height > window.innerHeight - 12) top = rect.top - popRect.height - 8;
        popover.style.left = Math.max(12, left) + "px";
        popover.style.top = Math.max(12, top) + "px";
      }

      function openPopover(input, trigger){
        var field = trigger.closest(".color-field");
        var hex = normalizeHex(input.value.replace("#", "")) || "FFFFFF";
        active = { picker: input, trigger: trigger, field: field, hsb: hexToHsb(hex), alpha: 100 };
        formatSelect.value = lastFormat;
        renderValueInputs();
        popover.hidden = false;
        positionPopover(trigger);
        updateVisuals();
        svEl.focus();
      }
      function closePopover(){
        if (popover.hidden) return;
        popover.hidden = true;
        active = null;
      }

      function pointFromEvent(el, evt){
        var rect = el.getBoundingClientRect();
        return {
          x: clamp((evt.clientX - rect.left) / rect.width, 0, 1),
          y: clamp((evt.clientY - rect.top) / rect.height, 0, 1)
        };
      }
      function bindDrag(el, onMove){
        el.addEventListener("pointerdown", function(evt){
          if (!active) return;
          el.setPointerCapture(evt.pointerId);
          onMove(evt);
          function move(e){ onMove(e); }
          function up(){
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerup", up);
          }
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerup", up);
        });
      }
      bindDrag(svEl, function(evt){
        var p = pointFromEvent(svEl, evt);
        active.hsb.s = p.x * 100;
        active.hsb.b = (1 - p.y) * 100;
        updateVisuals();
      });
      bindDrag(hueEl, function(evt){
        var p = pointFromEvent(hueEl, evt);
        active.hsb.h = p.x * 360;
        updateVisuals();
      });
      bindDrag(alphaEl, function(evt){
        var p = pointFromEvent(alphaEl, evt);
        active.alpha = Math.round(p.x * 100);
        updateVisuals();
      });

      svEl.addEventListener("keydown", function(evt){
        if (!active) return;
        var step = evt.shiftKey ? 10 : 2;
        if (evt.key === "ArrowLeft"){ active.hsb.s = clamp(active.hsb.s - step, 0, 100); updateVisuals(); evt.preventDefault(); }
        else if (evt.key === "ArrowRight"){ active.hsb.s = clamp(active.hsb.s + step, 0, 100); updateVisuals(); evt.preventDefault(); }
        else if (evt.key === "ArrowUp"){ active.hsb.b = clamp(active.hsb.b + step, 0, 100); updateVisuals(); evt.preventDefault(); }
        else if (evt.key === "ArrowDown"){ active.hsb.b = clamp(active.hsb.b - step, 0, 100); updateVisuals(); evt.preventDefault(); }
      });
      hueEl.addEventListener("keydown", function(evt){
        if (!active) return;
        var step = evt.shiftKey ? 15 : 3;
        if (evt.key === "ArrowLeft"){ active.hsb.h = clamp(active.hsb.h - step, 0, 360); updateVisuals(); evt.preventDefault(); }
        else if (evt.key === "ArrowRight"){ active.hsb.h = clamp(active.hsb.h + step, 0, 360); updateVisuals(); evt.preventDefault(); }
      });
      alphaEl.addEventListener("keydown", function(evt){
        if (!active) return;
        var step = evt.shiftKey ? 20 : 5;
        if (evt.key === "ArrowLeft"){ active.alpha = clamp(active.alpha - step, 0, 100); updateVisuals(); evt.preventDefault(); }
        else if (evt.key === "ArrowRight"){ active.alpha = clamp(active.alpha + step, 0, 100); updateVisuals(); evt.preventDefault(); }
      });

      formatSelect.addEventListener("change", function(){
        lastFormat = formatSelect.value;
        renderValueInputs();
      });
      valuesEl.addEventListener("change", function(evt){
        if (evt.target.tagName === "INPUT") applyValueInputs();
      });
      valuesEl.addEventListener("keydown", function(evt){
        if (evt.key === "Enter" && evt.target.tagName === "INPUT"){ applyValueInputs(); evt.target.blur(); }
      });

      function fallbackCopy(text){
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e){}
        document.body.removeChild(ta);
      }
      copyBtn.addEventListener("click", function(){
        var text = valuesEl.querySelector("input").value;
        var original = copyBtn.textContent;
        function done(){
          copyBtn.textContent = "Copied!";
          setTimeout(function(){ copyBtn.textContent = original; }, 1500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(text).then(done).catch(function(){ fallbackCopy(text); done(); });
        } else {
          fallbackCopy(text); done();
        }
      });

      var swatchInputs = Array.prototype.slice.call(document.querySelectorAll('input[type="color"].type-color-swatch'));
      swatchInputs.forEach(function(input){
        var trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "color-swatch-trigger";
        trigger.setAttribute("aria-label", "Choose color");
        trigger.style.background = input.value;
        input.setAttribute("aria-hidden", "true");
        input.tabIndex = -1;
        input.classList.add("type-color-swatch--hidden");
        input.parentNode.insertBefore(trigger, input);
        pairs.push({ input: input, trigger: trigger });

        trigger.addEventListener("click", function(evt){
          evt.stopPropagation();
          if (active && active.trigger === trigger){ closePopover(); return; }
          openPopover(input, trigger);
        });
        input.addEventListener("input", function(){
          trigger.style.background = input.value;
          if (syncing) return;
          if (active && active.picker === input){
            var hex = normalizeHex(input.value.replace("#", ""));
            if (hex){ active.hsb = hexToHsb(hex); updateVisuals(); }
          }
        });
      });

      // Reset/Regenerate buttons set picker.value directly (no dispatched
      // event, by design elsewhere in this file) - a plain click-delegate
      // resync after any button click in <main> keeps every trigger's
      // swatch color from going stale after one of those, without having
      // to hook each button individually.
      document.querySelector("main").addEventListener("click", function(evt){
        if (evt.target.closest("button")){
          setTimeout(function(){
            pairs.forEach(function(p){ p.trigger.style.background = p.input.value; });
          }, 0);
        }
      });

      document.addEventListener("mousedown", function(evt){
        if (popover.hidden) return;
        if (popover.contains(evt.target)) return;
        if (active && evt.target === active.trigger) return;
        closePopover();
      });
      document.addEventListener("keydown", function(evt){
        if (evt.key === "Escape" && !popover.hidden){
          var trigger = active && active.trigger;
          closePopover();
          if (trigger) trigger.focus();
        }
      });
      // Reposition rather than close on scroll/resize - the popover is
      // position:fixed (viewport-relative) while its trigger scrolls with
      // the page, so it has to actively track the trigger to stay
      // anchored. (Closing here instead was tried first and immediately
      // broke opening altogether: focusing the SV square right after
      // open can itself cause a scroll, and a capturing window "scroll"
      // listener sees that and closes the popover before the click that
      // opened it has even finished.)
      window.addEventListener("scroll", function(){
        if (active) positionPopover(active.trigger);
      }, true);
      window.addEventListener("resize", function(){
        if (active) positionPopover(active.trigger);
      });
    }
    initCustomColorPickers(contrastHelpers.contrastForField, contrastHelpers.badgeHtml);
  });
})();
