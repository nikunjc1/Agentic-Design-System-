(() => {
  "use strict";

  var SAVE_KEY = "ads:typography";
  var HEX6_RE = /^[0-9a-f]{6}$/i;

  function clamp(n, min, max){ return Math.min(max, Math.max(min, n)); }

  function hexToRgb(hex){
    hex = (hex || "").replace("#", "");
    if (hex.length !== 6) hex = "111827";
    return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
  }
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
  // A per-level text color can be a near-black/near-white heading/body
  // gray OR a real accent (error/warning/success/info/active/selected).
  // HSL saturation is unreliable right at the lightness extremes (a tiny
  // RGB difference reads as a big saturation swing near 0%/100% L), so
  // very dark/light colors are always treated as text-style regardless of
  // their nominal saturation; only colors in the middle lightness range
  // are judged by saturation to tell "gray" from "accent" apart.
  function suggestDarkForTypeColor(lightHex){
    var hsl = hexToHsl(lightHex);
    var isTextLike = hsl.l < 20 || hsl.l > 80 || hsl.s < 20;
    if (isTextLike){
      return hslToHex(hsl.h, hsl.s, clamp(100 - hsl.l, 0, 100));
    }
    return hslToHex(hsl.h, clamp(hsl.s - 8, 35, 100), clamp(hsl.l + 12, 0, 78));
  }

  // Starting-point type scales per product/device category. Dense dashboards
  // (SaaS, mobile app) run smaller so more fits on screen; desktop web apps
  // get more room; mobile web / marketing desktop sites lean on bigger
  // display sizes for impact. Every value still maps to one of the 11
  // standard Size tokens - this only decides which one each level starts at.
  var PLATFORM_PRESETS = {
    "saas": { h1: "display-xs", h2: "text-xl", h3: "text-lg", h4: "text-md", h5: "text-sm", h6: "text-xs", body: "text-sm", paragraph: "text-sm", caption: "text-xs" },
    "mobile-app": { h1: "display-sm", h2: "display-xs", h3: "text-xl", h4: "text-lg", h5: "text-md", h6: "text-sm", body: "text-md", paragraph: "text-md", caption: "text-xs" },
    "desktop-web-app": { h1: "display-md", h2: "display-sm", h3: "display-xs", h4: "text-xl", h5: "text-lg", h6: "text-md", body: "text-md", paragraph: "text-md", caption: "text-sm" },
    "web-and-desktop-site": { h1: "display-lg", h2: "display-md", h3: "display-sm", h4: "display-xs", h5: "text-xl", h6: "text-lg", body: "text-md", paragraph: "text-md", caption: "text-xs" }
  };

  // darkColor is a starting suggestion, not a hand-picked value - it's
  // whatever suggestDarkForTypeColor() below computes from the matching
  // light color, so the two always agree with the live auto-generation
  // logic instead of quietly drifting from it over time.
  var ROW_DEFAULTS = {
    h1: { family: "primary", size: "display-lg", lineHeightPct: "125", weight: "700", italic: false, color: "#111827", darkColor: "#D8DFEE" },
    h2: { family: "primary", size: "display-md", lineHeightPct: "122", weight: "700", italic: false, color: "#111827", darkColor: "#D8DFEE" },
    h3: { family: "primary", size: "display-sm", lineHeightPct: "127", weight: "600", italic: false, color: "#111827", darkColor: "#D8DFEE" },
    h4: { family: "primary", size: "display-xs", lineHeightPct: "133", weight: "600", italic: false, color: "#111827", darkColor: "#D8DFEE" },
    h5: { family: "primary", size: "text-xl", lineHeightPct: "150", weight: "500", italic: false, color: "#111827", darkColor: "#D8DFEE" },
    h6: { family: "primary", size: "text-lg", lineHeightPct: "156", weight: "500", italic: false, color: "#111827", darkColor: "#D8DFEE" },
    body: { family: "secondary", size: "text-md", lineHeightPct: "150", weight: "400", italic: false, color: "#4B5563", darkColor: "#9CA6B4" },
    paragraph: { family: "secondary", size: "text-md", lineHeightPct: "150", weight: "400", italic: false, color: "#4B5563", darkColor: "#9CA6B4" },
    caption: { family: "secondary", size: "text-xs", lineHeightPct: "150", weight: "400", italic: false, color: "#6B7280", darkColor: "#7F8694" },

    active: { family: "secondary", size: "text-sm", lineHeightPct: "143", weight: "500", italic: false, color: "#FF031A", darkColor: "#F74858" },
    selected: { family: "secondary", size: "text-sm", lineHeightPct: "143", weight: "600", italic: false, color: "#FF031A", darkColor: "#F74858" },
    disabled: { family: "secondary", size: "text-sm", lineHeightPct: "143", weight: "400", italic: false, color: "#9CA3AF", darkColor: "#505763" },
    error: { family: "secondary", size: "text-sm", lineHeightPct: "143", weight: "500", italic: false, color: "#FF3F4F", darkColor: "#FA818B" },
    warning: { family: "secondary", size: "text-sm", lineHeightPct: "143", weight: "500", italic: false, color: "#E6A53A", darkColor: "#E6BC77" },
    success: { family: "secondary", size: "text-sm", lineHeightPct: "143", weight: "500", italic: false, color: "#2FBF6E", darkColor: "#5ECD8F" },
    info: { family: "secondary", size: "text-sm", lineHeightPct: "143", weight: "500", italic: false, color: "#4F8FE6", darkColor: "#8AB2E8" }
  };

  var CATEGORY_FONTS = {
    "Sans-serif": ["Inter", "Work Sans", "Manrope", "Sora", "Karla"],
    "Serif": ["Fraunces", "Lora", "Playfair Display", "Source Serif 4"],
    "Monospace": ["JetBrains Mono", "IBM Plex Mono", "Space Mono"],
    "Display": ["Bricolage Grotesque", "Unbounded", "Archivo Black"],
    "Handwritten": ["Caveat", "Kalam", "Patrick Hand"]
  };

  var injectedHrefs = {};
  function injectLink(href){
    if (!href || injectedHrefs[href]) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    injectedHrefs[href] = true;
  }

  function googleFontUrl(name){
    return "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(name).replace(/%20/g, "+") + ":wght@400;500;600;700&display=swap";
  }

  function createFontPicker(root, role){
    var tabs = root.querySelectorAll(".font-method-tabs .copy-tab");
    var panels = root.querySelectorAll(".font-method-panel");
    var uploadName = root.querySelector('[data-role="upload-name"]');
    var uploadInput = root.querySelector('[data-role="upload-input"]');
    var uploadDrop = root.querySelector('[data-role="upload-drop"]');
    var uploadLabel = root.querySelector('[data-role="upload-label"]');
    var categoryChips = root.querySelectorAll(".font-category-chips .chip");
    var optionList = root.querySelector('[data-role="category-options"]');
    var previewHeading = root.querySelector('[data-role="preview-heading"]');
    var previewBody = root.querySelector('[data-role="preview-body"]');
    var previewMeta = root.querySelector('[data-role="preview-meta"]');

    var state = { family: null, source: null, linkHref: null };

    tabs.forEach(function(tab){
      tab.addEventListener("click", function(){
        tabs.forEach(function(t){ t.classList.remove("is-active"); });
        panels.forEach(function(p){ p.classList.remove("is-active"); });
        tab.classList.add("is-active");
        root.querySelector('.font-method-panel[data-panel="' + tab.dataset.method + '"]').classList.add("is-active");
      });
    });

    function setFamily(name, source, linkHref){
      if (!name) return;
      state.family = name;
      state.source = source || null;
      state.linkHref = linkHref || null;
      var cssFamily = '"' + name + '", ui-sans-serif, system-ui, sans-serif';
      previewHeading.style.fontFamily = cssFamily;
      previewBody.style.fontFamily = cssFamily;
      previewMeta.textContent = "Using " + name + (source ? " (" + source + ")" : "");
    }

    uploadDrop.addEventListener("click", function(){ uploadInput.click(); });
    uploadInput.addEventListener("change", function(){
      var file = uploadInput.files && uploadInput.files[0];
      if (!file) return;
      var name = uploadName.value.trim() || file.name.replace(/\.[^.]+$/, "");
      uploadLabel.textContent = "Loading " + file.name + "…";
      var reader = new FileReader();
      reader.onload = function(){
        try{
          var face = new FontFace(name, reader.result);
          face.load().then(function(loaded){
            document.fonts.add(loaded);
            uploadName.value = name;
            uploadLabel.textContent = file.name;
            setFamily(name, "uploaded file", null);
          }).catch(function(){
            uploadLabel.textContent = "Couldn't read that font file - try a .woff, .woff2, .ttf or .otf.";
          });
        }catch(e){
          uploadLabel.textContent = "Couldn't read that font file - try a .woff, .woff2, .ttf or .otf.";
        }
      };
      reader.readAsArrayBuffer(file);
    });

    function renderCategory(cat){
      optionList.innerHTML = "";
      (CATEGORY_FONTS[cat] || []).forEach(function(fontName){
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "font-option";
        btn.textContent = fontName;
        btn.addEventListener("click", function(){
          optionList.querySelectorAll(".font-option").forEach(function(b){ b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          var url = googleFontUrl(fontName);
          injectLink(url);
          setFamily(fontName, cat.toLowerCase(), url);
        });
        optionList.appendChild(btn);
      });
    }
    categoryChips.forEach(function(chip){
      chip.addEventListener("click", function(){
        categoryChips.forEach(function(c){ c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        renderCategory(chip.dataset.category);
      });
    });

    // Inter is this system's own UI font, so it's the sensible out-of-the-box
    // default for Primary/Secondary too - the designer can still pick anything else.
    function selectDefaultFont(){
      var defaultBtn = Array.prototype.find.call(
        optionList.querySelectorAll(".font-option"),
        function(b){ return b.textContent === "Inter"; }
      );
      if (defaultBtn) defaultBtn.click();
    }

    renderCategory(categoryChips[0] ? categoryChips[0].dataset.category : "Sans-serif");
    selectDefaultFont();

    function reset(){
      state.family = null;
      state.source = null;
      state.linkHref = null;

      tabs.forEach(function(t){ t.classList.remove("is-active"); });
      panels.forEach(function(p){ p.classList.remove("is-active"); });
      tabs[0].classList.add("is-active");
      panels[0].classList.add("is-active");

      uploadName.value = "";
      uploadInput.value = "";
      uploadLabel.textContent = "Choose a .woff, .woff2, .ttf or .otf file…";

      categoryChips.forEach(function(c){ c.classList.remove("is-active"); });
      if (categoryChips[0]){
        categoryChips[0].classList.add("is-active");
        renderCategory(categoryChips[0].dataset.category);
      }

      selectDefaultFont();
    }

    return {
      getState: function(){ return { family: state.family, source: state.source, linkHref: state.linkHref }; },
      setFamily: setFamily,
      reset: reset
    };
  }

  function wireTypeRow(row){
    var familySel = row.querySelector('[data-role="family"]');
    var sizeSel = row.querySelector('[data-role="size"]');
    var lhInput = row.querySelector('[data-role="line-height-pct"]');
    var weightSel = row.querySelector('[data-role="weight"]');
    var italicChk = row.querySelector('[data-role="italic"]');
    var colorPicker = row.querySelector('[data-role="color-picker"]');
    var colorHex = row.querySelector('[data-role="color-hex"]');
    var darkColorPicker = row.querySelector('[data-role="color-picker-dark"]');
    var darkColorHex = row.querySelector('[data-role="color-hex-dark"]');

    // Dark starts auto-generated from Light and stays in sync with it
    // (like the same auto/custom idea on the Colors page) until the user
    // edits the dark field directly, at which point it's theirs to keep -
    // editing Light afterward no longer overwrites it.
    var darkAuto = true;

    // Picking a size seeds a sensible line-height %, but the % field is
    // independently editable afterward - it never gets overwritten except
    // when a new size is explicitly chosen.
    function seedLineHeightFromSize(){
      var opt = sizeSel.options[sizeSel.selectedIndex];
      var fontSize = Number(opt.dataset.size);
      var lineHeight = Number(opt.dataset.lineHeight);
      lhInput.value = Math.round((lineHeight / fontSize) * 100);
    }

    function apply(){
      lhInput.value = clamp(parseInt(lhInput.value, 10) || 100, 50, 300);
    }

    function regenerateDark(){
      var hex = suggestDarkForTypeColor(colorPicker.value);
      darkColorPicker.value = hex;
      darkColorHex.value = hex.replace("#", "").toUpperCase();
      darkAuto = true;
    }

    sizeSel.addEventListener("change", function(){
      seedLineHeightFromSize();
      apply();
    });
    lhInput.addEventListener("input", function(){
      lhInput.value = lhInput.value.replace(/[^0-9]/g, "").slice(0, 3);
      apply();
    });
    weightSel.addEventListener("change", apply);
    italicChk.addEventListener("change", apply);
    colorPicker.addEventListener("input", function(){
      colorHex.value = colorPicker.value.replace("#", "").toUpperCase();
      apply();
      if (darkAuto) regenerateDark();
    });
    colorHex.addEventListener("input", function(){
      var v = colorHex.value.replace(/[^0-9a-f]/gi, "").toUpperCase().slice(0, 6);
      colorHex.value = v;
      if (HEX6_RE.test(v)){
        colorPicker.value = "#" + v;
        apply();
        if (darkAuto) regenerateDark();
      }
    });
    darkColorPicker.addEventListener("input", function(){
      darkColorHex.value = darkColorPicker.value.replace("#", "").toUpperCase();
      darkAuto = false;
    });
    darkColorHex.addEventListener("input", function(){
      var v = darkColorHex.value.replace(/[^0-9a-f]/gi, "").toUpperCase().slice(0, 6);
      darkColorHex.value = v;
      if (HEX6_RE.test(v)){
        darkColorPicker.value = "#" + v;
        darkAuto = false;
      }
    });

    apply();

    return {
      getState: function(){
        return {
          family: familySel.value,
          size: sizeSel.value,
          lineHeightPct: lhInput.value,
          weight: weightSel.value,
          italic: italicChk.checked,
          color: colorPicker.value,
          darkColor: darkColorPicker.value,
          darkColorAuto: darkAuto
        };
      },
      setSize: function(sizeKey){
        sizeSel.value = sizeKey;
        seedLineHeightFromSize();
        apply();
      },
      setState: function(s){
        if (!s) return;
        if (s.family) familySel.value = s.family;
        if (s.size) sizeSel.value = s.size;
        if (s.lineHeightPct) lhInput.value = s.lineHeightPct;
        if (s.weight) weightSel.value = s.weight;
        italicChk.checked = !!s.italic;
        if (s.color){
          colorPicker.value = s.color;
          colorHex.value = s.color.replace("#", "").toUpperCase();
        }
        if (s.darkColor){
          darkColorPicker.value = s.darkColor;
          darkColorHex.value = s.darkColor.replace("#", "").toUpperCase();
          darkAuto = s.darkColorAuto !== false;
        } else {
          regenerateDark();
        }
        apply();
      },
      regenerateDark: regenerateDark
    };
  }

  document.addEventListener("DOMContentLoaded", function(){
    var primaryPicker = createFontPicker(document.querySelector('[data-font="primary"]'), "primary");
    var secondaryPicker = createFontPicker(document.querySelector('[data-font="secondary"]'), "secondary");

    var rowControllers = {};
    document.querySelectorAll(".type-row").forEach(function(row){
      rowControllers[row.dataset.level] = wireTypeRow(row);
    });

    var platformChips = document.querySelectorAll(".platform-chips .chip");
    platformChips.forEach(function(chip){
      chip.addEventListener("click", function(){
        var preset = PLATFORM_PRESETS[chip.dataset.platform];
        if (!preset) return;
        platformChips.forEach(function(c){ c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        Object.keys(preset).forEach(function(level){
          if (rowControllers[level]) rowControllers[level].setSize(preset[level]);
        });
      });
    });

    function loadTypography(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ saved = null; }
      if (!saved) return;

      if (saved.primaryFont && saved.primaryFont.family){
        if (saved.primaryFont.linkHref) injectLink(saved.primaryFont.linkHref);
        primaryPicker.setFamily(saved.primaryFont.family, saved.primaryFont.source, saved.primaryFont.linkHref);
      }
      if (saved.secondaryFont && saved.secondaryFont.family){
        if (saved.secondaryFont.linkHref) injectLink(saved.secondaryFont.linkHref);
        secondaryPicker.setFamily(saved.secondaryFont.family, saved.secondaryFont.source, saved.secondaryFont.linkHref);
      }
      Object.keys(saved.levels || {}).forEach(function(level){
        if (rowControllers[level]) rowControllers[level].setState(saved.levels[level]);
      });
      if (saved.platform){
        platformChips.forEach(function(c){ c.classList.toggle("is-active", c.dataset.platform === saved.platform); });
      }
    }
    loadTypography();

    var saveBtn = document.getElementById("saveTypographyBtn");
    var saveStatus = document.getElementById("typoSaveStatus");
    saveBtn.addEventListener("click", function(){
      var activeChip = document.querySelector(".platform-chips .chip.is-active");
      var payload = {
        primaryFont: primaryPicker.getState(),
        secondaryFont: secondaryPicker.getState(),
        platform: activeChip ? activeChip.dataset.platform : null,
        levels: {}
      };
      Object.keys(rowControllers).forEach(function(level){
        payload.levels[level] = rowControllers[level].getState();
      });
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));

      saveStatus.hidden = false;
      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });

    var regenerateDarkBtn = document.getElementById("regenerateDarkColorsBtn");
    regenerateDarkBtn.addEventListener("click", function(){
      Object.keys(rowControllers).forEach(function(level){
        rowControllers[level].regenerateDark();
      });

      saveStatus.hidden = false;
      saveStatus.textContent = "Dark colors regenerated from Light";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });

    var resetBtn = document.getElementById("resetTypographyBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);

      primaryPicker.reset();
      secondaryPicker.reset();
      platformChips.forEach(function(c){ c.classList.remove("is-active"); });

      Object.keys(rowControllers).forEach(function(level){
        rowControllers[level].setState(ROW_DEFAULTS[level]);
      });

      saveStatus.hidden = false;
      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });
  });
})();
