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
  // display sizes for impact. Every value still maps to a named
  // standard Size tokens - this only decides which one each level starts at.
  // Deliberately a separate, smaller taxonomy from New Project's 10-category
  // PRODUCTS list (project-model.js) or Spacing/Radius/Grid & Layout's own
  // 12 data-product cards: a type-scale starting point is really a function
  // of device/viewport context (how much room a heading has), not product
  // category, and 4 real starting points cover that distinction without
  // inventing a speculative size recommendation for every product category
  // that has no typographic basis to differ from one of these 4. Not synced
  // from New Project's saved product type for the same reason Spacing/
  // Radius/Grid & Layout's own sync doesn't apply here: there is no 1:1
  // mapping from "what you're building" to "how much room a heading has."
  var PLATFORM_PRESETS = {
    "saas": { h1: "display-xs", h2: "text-xl", h3: "text-lg", h4: "text-md", h5: "text-sm", h6: "text-xs", body: "text-sm", paragraph: "text-sm", caption: "text-2xs" },
    "mobile-app": { h1: "display-sm", h2: "display-xs", h3: "text-xl", h4: "text-lg", h5: "text-md", h6: "text-sm", body: "text-md", paragraph: "text-md", caption: "text-2xs" },
    "desktop-web-app": { h1: "heading-lg", h2: "heading-md", h3: "display-xs", h4: "text-xl", h5: "text-lg", h6: "text-md", body: "text-md", paragraph: "text-md", caption: "text-2xs" },
    "web-and-desktop-site": { h1: "heading-lg", h2: "heading-md", h3: "display-xs", h4: "text-xl", h5: "text-lg", h6: "text-md", body: "text-md", paragraph: "text-md", caption: "text-2xs" }
  };

  // darkColor is a starting suggestion, not a hand-picked value - it's
  // whatever suggestDarkForTypeColor() below computes from the matching
  // light color, so the two always agree with the live auto-generation
  // logic instead of quietly drifting from it over time.
  var ROW_DEFAULTS = window.ADSFoundationModel.typeDefaults;

  var CATEGORY_FONTS = {
    "Sans-serif": ["Inter", "Work Sans", "Manrope", "Sora", "Karla"],
    "Serif": ["Fraunces", "Lora", "Playfair Display", "Source Serif 4"],
    "Monospace": ["JetBrains Mono", "IBM Plex Mono", "Space Mono"],
    "Display": ["Bricolage Grotesque", "Unbounded", "Archivo Black"],
    "Handwritten": ["Caveat", "Kalam", "Patrick Hand"]
  };
  // A failed Google Fonts load used to fall through to a hardcoded
  // sans-serif stack regardless of the chosen font's own category -
  // a failed Serif/Monospace/Handwritten pick silently became sans-serif,
  // not just a different face in the same category. One matching CSS
  // generic family per category (no true generic exists for Display,
  // so it shares Sans-serif's).
  var CATEGORY_FALLBACKS = {
    "Sans-serif": "ui-sans-serif, system-ui, sans-serif",
    "Serif": "ui-serif, Georgia, serif",
    "Monospace": "ui-monospace, SFMono-Regular, monospace",
    "Display": "ui-sans-serif, system-ui, sans-serif",
    "Handwritten": "cursive"
  };
  // setFamily's own "source" is already the lowercase category name for a
  // curated pick (see the option-click handler below) - this recovers the
  // matching fallback stack on restore (loadTypography) without having to
  // separately persist it.
  var CATEGORY_FALLBACKS_BY_SOURCE = {};
  Object.keys(CATEGORY_FALLBACKS).forEach(function(cat){ CATEGORY_FALLBACKS_BY_SOURCE[cat.toLowerCase()] = CATEGORY_FALLBACKS[cat]; });
  function fallbackForSource(source){
    return CATEGORY_FALLBACKS_BY_SOURCE[(source || "").toLowerCase()] || CATEGORY_FALLBACKS["Sans-serif"];
  }

  // Caches a Promise<boolean success> per href, not just a "was this
  // requested" flag - a <link> fires a real error event on a genuine
  // fetch failure (offline, blocked, 404), unlike document.fonts.load(),
  // which can't tell "this family was never declared because its
  // stylesheet failed" apart from "this name just isn't a registered
  // webfont" - both resolve as a trivial, unhelpful success.
  var injectedHrefs = {};
  function injectLink(href){
    if (!href) return Promise.resolve(false);
    if (injectedHrefs[href]) return injectedHrefs[href];
    var promise = new Promise(function(resolve){
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = function(){ resolve(true); };
      link.onerror = function(){ delete injectedHrefs[href];link.remove();resolve(false); };
      document.head.appendChild(link);
    });
    injectedHrefs[href] = promise;
    return promise;
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

    var state = { family: null, source: null, linkHref: null, dataUrl: null };
    var fontRequest = 0;

    tabs.forEach(function(tab){
      tab.addEventListener("click", function(){
        tabs.forEach(function(t){ t.classList.remove("is-active"); });
        panels.forEach(function(p){ p.classList.remove("is-active"); });
        tab.classList.add("is-active");
        root.querySelector('.font-method-panel[data-panel="' + tab.dataset.method + '"]').classList.add("is-active");
      });
    });
    var methodGroup=root.querySelector('.font-method-tabs');
    methodGroup.setAttribute('aria-label',role==='primary'?'Primary font source':'Secondary font source');
    window.ADSGroupButton(methodGroup,Array.from(tabs));

    function setFamily(name, source, linkHref, dataUrl){
      fontRequest++;
      if (!name) return;
      state.family = name;
      state.source = source || null;
      state.linkHref = linkHref || null;
      state.dataUrl = dataUrl || null;
      var cssFamily = JSON.stringify(name) + ', ' + fallbackForSource(source);
      previewHeading.style.fontFamily = cssFamily;
      previewBody.style.fontFamily = cssFamily;
      previewMeta.textContent = "Using " + name + (source ? " (" + source + ")" : "");
      if (source === "uploaded file") {
        previewMeta.textContent += dataUrl ? " — font file included in saved Foundation settings" : " — older record has no font file; re-upload to restore it";
      }
      // injectLink's own promise reports a REAL stylesheet fetch failure
      // (offline, blocked, 404) via the <link>'s error event - this used
      // to claim "Using X" unconditionally with no way to ever find out
      // the request failed.
      if (linkHref){
        var requested = name;
        var requestId = fontRequest;
        previewMeta.textContent = 'Loading ' + name + '…';
        injectLink(linkHref).then(function(loaded){
          if (!loaded) return false;
          if (!document.fonts || !document.fonts.load) return null;
          return Promise.all([400,500,600,700].map(function(weight){return document.fonts.load(weight+' 16px '+JSON.stringify(requested));})).then(function(faces){return faces.every(function(list){return list.length>0;});},function(){return false;});
        }).then(function(loaded){
          if (state.family !== requested || requestId !== fontRequest) return;
          previewMeta.textContent = loaded === true ? 'Loaded ' + name + ' (400, 500, 600, 700)' : loaded === null ? 'Font decoding unavailable; verify ' + name + ' in a browser.' : name + ' didn’t load (offline, blocked, or unavailable) — showing the fallback instead.';
        });
      }
    }

    uploadDrop.setAttribute('role','button');uploadDrop.tabIndex = 0;
    uploadDrop.setAttribute('aria-label', 'Upload ' + role + ' font');
    uploadLabel.setAttribute('role','status');uploadLabel.setAttribute('aria-live','polite');
    uploadDrop.addEventListener("click", function(e){ if(e.target !== uploadInput){e.preventDefault();uploadInput.click();} });
    uploadDrop.addEventListener('keydown', function(e){if(e.key === 'Enter' || e.key === ' '){e.preventDefault();uploadInput.click();}});
    uploadInput.addEventListener("change", function(){
      var file = uploadInput.files && uploadInput.files[0];
      if (!file) return;
      var request = ++fontRequest;
      if (!/\.(woff2?|ttf|otf)$/i.test(file.name) || file.size > 2 * 1024 * 1024) {
        uploadLabel.textContent = 'Choose a WOFF, WOFF2, TTF or OTF file up to 2 MB.';
        return;
      }
      var name = uploadName.value.trim() || file.name.replace(/\.[^.]+$/, "");
      if(name.length > 100 || /[;{}<>]/.test(name)){
        uploadName.setAttribute('aria-invalid','true');uploadLabel.textContent = 'Use a font family name up to 100 characters, without CSS markup.';return;
      }
      uploadName.removeAttribute('aria-invalid');
      uploadInput.value = '';
      uploadLabel.textContent = "Loading " + file.name + "…";
      var reader = new FileReader();
      // Foundation audit T02 - "FileReader error unhandled": with no
      // onerror handler, a genuine read failure (permission issue, I/O
      // error, an unreadable file) left uploadLabel stuck on "Loading
      // X.ttf…" forever - no error shown, no sign anything had gone wrong,
      // no indication the user could just try picking the file again.
      reader.onerror = function(){
        if (request !== fontRequest) return;
        uploadLabel.textContent = "Couldn't read " + file.name + " (" + (reader.error && reader.error.name || "read error") + ") - choose the file again to retry.";
      };
      reader.onload = function(){
        if (request !== fontRequest) return;
        try{
          var face = new FontFace(name, 'url("' + reader.result + '")');
          face.load().then(function(loaded){
            if (request !== fontRequest) return;
            document.fonts.add(loaded);
            uploadName.value = name;
            uploadLabel.textContent = file.name;
            setFamily(name, "uploaded file", null, reader.result);
            // Foundation audit T01 - found while verifying the fix above:
            // the native 'change' event this handler is attached to fires
            // synchronously, before this async FileReader/FontFace chain
            // resolves - the delegated main-level listener that calls
            // persistTypography()/updateMachineViews() had already run by
            // then, against the *old* state, and nothing re-triggered it
            // once setFamily() above actually updated things. Dispatching
            // a bubbling event on uploadLabel (not uploadInput - that would
            // re-enter this exact handler and read the same file again)
            // reuses that same existing delegated path instead of reaching
            // into its closure from here.
            uploadLabel.dispatchEvent(new Event("change", { bubbles: true }));
          }).catch(function(){
            if (request !== fontRequest) return;
            uploadLabel.textContent = "Couldn't read that font file - try a .woff, .woff2, .ttf or .otf.";
          });
        }catch(e){
          uploadLabel.textContent = "Couldn't read that font file - try a .woff, .woff2, .ttf or .otf.";
        }
      };
      reader.readAsDataURL(file);
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
      fontRequest++;
      state.family = null;
      state.source = null;
      state.linkHref = null;
      state.dataUrl = null;

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
      getState: function(){ return { family: state.family, source: state.source, linkHref: state.linkHref, dataUrl: state.dataUrl }; },
      setFamily: setFamily,
      reset: reset
    };
  }

  function currentTheme(){
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
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
    var trackingLabel = document.createElement('label');
    trackingLabel.className = 'type-control type-control-tracking';
    trackingLabel.innerHTML = '<span>Letter spacing</span><input type="number" data-role="letter-spacing" data-dimension min="-5" max="20" step="0.1" value="0" aria-label="Letter spacing">';
    row.querySelector('.type-row-controls').appendChild(trackingLabel);
    var trackingInput = trackingLabel.querySelector('input');
    trackingInput.required = true;
    var sampleEl = row.querySelector('[data-role="sample"]');

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

    // Foundation audit T03 - "show effective previews": reads every
    // control this row actually has (family role resolves to the same
    // --font-display/--font-body custom properties the rest of the site
    // reads, so the sample tracks whatever's genuinely applied, not a
    // second, potentially-stale guess at the resolved family) and applies
    // them directly, so the result of these settings is visible here
    // instead of only inferred from the controls' own values.
    function updateSample(){
      if (!sampleEl) return;
      sampleEl.style.fontFamily = familySel.value === "secondary" ? "var(--font-body)" : "var(--font-display)";
      var opt = sizeSel.options[sizeSel.selectedIndex];
      sampleEl.style.fontSize = window.ADSFoundationModel.dimension(Number(opt.dataset.size || 16), window.ADSFoundation.get().unit);
      var liveLineHeight = Number(lhInput.value);
      if (liveLineHeight >= 50 && liveLineHeight <= 300) sampleEl.style.lineHeight = liveLineHeight + "%";
      if(trackingInput.value !== '' && trackingInput.checkValidity()) sampleEl.style.letterSpacing = window.ADSFoundationModel.dimension(Number(trackingInput.value), window.ADSFoundation.get().unit);
      sampleEl.style.fontWeight = weightSel.value;
      sampleEl.style.fontStyle = italicChk.checked ? "italic" : "normal";
      sampleEl.style.color = currentTheme() === "dark" ? darkColorPicker.value : colorPicker.value;
    }

    // Foundation audit T05 - "Very tight values allowed without guidance."
    // Below 100%, a line's own text height exceeds the space between
    // baselines - adjacent lines of real, wrapped multi-line text will
    // visually touch or overlap, not just look cramped. That's an
    // objective, not a subjective, threshold (100% is exactly the font's
    // own em box), unlike "too loose," which is a style choice, not
    // breakage - so only the low end gets a warning, not a vague range.
    var lhGuidanceEl = row.querySelector('[data-role="line-height-guidance"]');
    function updateLineHeightGuidance(){
      if (!lhGuidanceEl) return;
      var n = parseInt(lhInput.value, 10);
      var valid = /^\d+$/.test(lhInput.value) && n >= 50 && n <= 300;
      lhInput.setAttribute('aria-invalid',String(!valid));
      trackingInput.setAttribute('aria-invalid',String(trackingInput.value === '' || !trackingInput.checkValidity()));
      if(!valid){
        lhGuidanceEl.textContent = 'Enter a line height from 50% to 300%.';
      } else if (isFinite(n) && n < 100){
        lhGuidanceEl.textContent = "Below 100%, wrapped lines will visually touch or overlap.";
      } else {
        lhGuidanceEl.textContent = "";
      }
    }

    function apply(){
      updateSample();
      updateLineHeightGuidance();
    }

    // Foundation audit T05 - "clamping impedes entry": the old apply()
    // clamped lhInput.value to [50,300] on every single keystroke, which
    // corrupts normal typing - confirmed by reproduction: typing "1", "5",
    // "0" one digit at a time landed on "100", not 150, since each
    // intermediate single/double-digit keystroke got clamped up to the
    // 50-minimum before the next digit could extend it. Clamping now only
    // runs once, on blur/commit, after the user's actually done typing.
    function commitLineHeight(){
      var n = parseInt(lhInput.value, 10);
      lhInput.value = clamp(isFinite(n) ? n : 100, 50, 300);
      apply();
    }

    function regenerateDark(){
      var hex = suggestDarkForTypeColor(colorPicker.value);
      darkColorPicker.value = hex;
      darkColorHex.value = hex.replace("#", "").toUpperCase();
      darkAuto = true;
      updateSample();
    }

    trackingInput.addEventListener("input", apply);
    new MutationObserver(apply).observe(document.documentElement, {attributes:true,attributeFilter:["data-theme"]});
    window.addEventListener("ads:foundation-applied", apply);
    familySel.addEventListener("change", apply);
    sizeSel.addEventListener("change", function(){
      seedLineHeightFromSize();
      apply();
    });
    lhInput.addEventListener("input", function(){
      lhInput.value = lhInput.value.replace(/[^0-9]/g, "").slice(0, 3);
      apply();
    });
    lhInput.addEventListener("blur", function(){commitLineHeight();lhInput.dispatchEvent(new Event("change", {bubbles:true}));});
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
      apply();
    });
    darkColorHex.addEventListener("input", function(){
      var v = darkColorHex.value.replace(/[^0-9a-f]/gi, "").toUpperCase().slice(0, 6);
      darkColorHex.value = v;
      if (HEX6_RE.test(v)){
        darkColorPicker.value = "#" + v;
        darkAuto = false;
        apply();
      }
    });

    apply();

    return {
      getState: function(){
        return {
          letterSpacing: trackingInput.value === '' ? '' : Number(trackingInput.value),
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
        trackingInput.value = Number.isFinite(Number(s.letterSpacing)) ? s.letterSpacing : 0;
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
        // Foundation audit T05 - restored/preset data should still be
        // validated once, the same as a real blur commit would - a
        // corrupted or out-of-range saved value (a stale record, a manual
        // localStorage edit) shouldn't silently bypass the clamp just
        // because typing itself no longer triggers it on every keystroke.
        commitLineHeight();
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
      rowControllers[row.dataset.level].setState(ROW_DEFAULTS[row.dataset.level]);
    });

    var fontFamilyMachineJson = document.querySelector('[data-role="fontfamily-machine-json"]');
    var typeScaleMachineJson = document.querySelector('[data-role="typescale-machine-json"]');
    var markdownOutput = document.querySelector('[data-role="typography-markdown-output"]');
    var typeRows = document.querySelectorAll(".type-row");

    // Same "MD file" pattern added to Colors and Grid & Layout: one
    // consolidated Markdown snapshot of this page's editable state (Font
    // families + every Type scale row) - Additional semantic levels isn't
    // included, same as Colors/Grid & Layout leaving their own static
    // reference sections out, since it's fixed guidance text, not a user
    // selection to keep in sync.
    function renderMarkdown(){
      if (!markdownOutput) return;
      var lines = ["# Typography", ""];

      lines.push("## Font families", "");
      var primaryState = primaryPicker.getState();
      var secondaryState = secondaryPicker.getState();
      // Foundation audit T01 - "package durable... reference, or visibly
      // label preview-only": an uploaded font's actual file is never saved
      // anywhere, only this family name - naming that plainly in the one
      // artifact most likely to leave this page (an AI agent or teammate
      // reading this export has no other way to know the name alone can't
      // be installed/resolved as a real dependency).
      var uploadNote = function(s){ return s.source === "uploaded file" ? (s.dataUrl ? " - font asset included in Foundation JSON; Markdown names the family" : " - legacy record: re-upload the font asset") : ""; };
      lines.push("- Primary: " + (primaryState.family || "Not selected") + (primaryState.source ? " (" + primaryState.source + ")" : "") + uploadNote(primaryState));
      lines.push("- Secondary: " + (secondaryState.family || "Not selected") + (secondaryState.source ? " (" + secondaryState.source + ")" : "") + uploadNote(secondaryState));

      var activePlatform = document.querySelector(".platform-chips .chip.is-active");
      if (activePlatform){
        lines.push("", "## Platform preset", "");
        lines.push("- Selected: " + activePlatform.textContent.trim());
      }

      lines.push("", "## Type scale", "");
      typeRows.forEach(function(row){
        var level = (row.querySelector(".type-level-name") || {}).textContent || row.dataset.level;
        var familySel = row.querySelector('[data-role="family"]');
        var sizeSel = row.querySelector('[data-role="size"]');
        var weightSel = row.querySelector('[data-role="weight"]');
        var lhInput = row.querySelector('[data-role="line-height-pct"]');
        var italicChk = row.querySelector('[data-role="italic"]');
        var colorHex = row.querySelector('[data-role="color-hex"]');
        var darkColorHex = row.querySelector('[data-role="color-hex-dark"]');

        lines.push("### " + level, "");
        lines.push("- Family: " + familySel.options[familySel.selectedIndex].textContent);
        var sizePx = window.ADSFoundationModel.sizes[sizeSel.value];
        lines.push("- Size: " + window.ADSFoundationModel.dimensionPair(sizePx));
        lines.push("- Letter spacing: " + window.ADSFoundationModel.dimensionPair(Number(row.querySelector('[data-role="letter-spacing"]').value)));
        lines.push("- Line height: " + lhInput.value + "% (" + window.ADSFoundationModel.dimensionPair(sizePx * Number(lhInput.value) / 100) + ")");
        lines.push("- Weight: " + weightSel.options[weightSel.selectedIndex].textContent);
        lines.push("- Italic: " + (italicChk.checked ? "Yes" : "No"));
        lines.push("- Color (Light): `" + rowControllers[row.dataset.level].getState().color + "`");
        lines.push("- Color (Dark): `" + rowControllers[row.dataset.level].getState().darkColor + "`");
        lines.push("");
      });

      markdownOutput.textContent = window.ADSFoundation.preparePageMarkdown(lines.join("\n").trim());
    }

    function updateMachineViews(){
      if (fontFamilyMachineJson){
        // Foundation audit T01 - durable: false names the real limitation
        // machine-readably too, not just in the human-facing preview text
        // and Markdown export.
        var withDurability = function(s){ return { family: s.family, source: s.source, linkHref: s.linkHref, durable: s.source !== "uploaded file" || !!s.dataUrl }; };
        fontFamilyMachineJson.textContent = JSON.stringify({
          $schema: window.ADS_MACHINE_VIEW_SCHEMA,
          primary: withDurability(primaryPicker.getState()),
          secondary: withDurability(secondaryPicker.getState())
        }, null, 2);
      }
      if (typeScaleMachineJson){
        var levels = {};
        Object.keys(rowControllers).forEach(function(level){
          levels[level] = rowControllers[level].getState();
        });
        typeScaleMachineJson.textContent = JSON.stringify({ $schema: window.ADS_MACHINE_VIEW_SCHEMA, levels: levels }, null, 2);
      }
      renderMarkdown();
    }
    // Persists on every real edit, alongside the Machine View recompute
    // above, so a Markdown export always reflects what's on screen without
    // a separate "click Save" step. suppressPersist guards the Reset
    // handler below: primaryPicker.reset()/secondaryPicker.reset() each do
    // a synthetic defaultBtn.click() internally, which also bubbles here -
    // without the guard, that click would fire mid-reset (before the type
    // rows below it are reset back to defaults) and re-persist a stale mix
    // of new font + still-old row values right over the localStorage entry
    // Reset just removed.
    var suppressPersist = false;
    // Presentation controls do not edit Typography. Unit changes use the
    // Foundation event to refresh exports without autosaving editor values.
    var NON_DATA_CLICK = ".guide-toggle-btn, .font-method-tabs .copy-tab, .font-category-chips, #copyTypographyMarkdownBtn, .ads-read-more, .ads-foundation-toolbar";
    // A platform preset chip stays "is-active" only while every level it
    // sets still matches that preset's own values - editing even one row
    // afterward is a real divergence, not still "Serif" or "SaaS" (the
    // preset's own identity no longer describes the actual configuration).
    function clearPresetIfDiverged(){
      var activeChip = document.querySelector(".platform-chips .chip.is-active");
      if (!activeChip) return;
      var preset = PLATFORM_PRESETS[activeChip.dataset.platform];
      if (!preset) return;
      var matches = Object.keys(preset).every(function(level){
        return rowControllers[level] && rowControllers[level].getState().size === preset[level];
      });
      if (!matches) activeChip.classList.remove("is-active");
    }
    function handleInteraction(e){
      if(e && e.type === 'click' && !e.target.closest('.font-option, .platform-chips .chip')) return;
      if (e && e.target.closest('.ads-foundation-toolbar, .page-outline, .ads-unit-control select, [data-unit-display]')) return;
      if (e && e.type === "click" && e.target.closest(NON_DATA_CLICK)) return;
      var isPresetClick = e && e.type === "click" && e.target.closest(".platform-chips .chip");
      if(!isPresetClick && presetSnapshot){presetSnapshot=null;undoPreset.hidden=true;presetStatus.textContent='Preset Undo ended because another typography setting changed.';}
      if (!isPresetClick) clearPresetIfDiverged();
      updateMachineViews();
      if (!suppressPersist) persistTypography();
    }
    document.querySelector("main").addEventListener("input", handleInteraction);
    document.querySelector("main").addEventListener("change", handleInteraction);
    document.querySelector("main").addEventListener("click", handleInteraction);

    var platformChips = document.querySelectorAll(".platform-chips .chip");
    var presetSnapshot = null;
    var presetStatus = document.createElement('span');presetStatus.className='save-status';presetStatus.setAttribute('role','status');
    var undoPreset = document.createElement('button');undoPreset.type='button';undoPreset.className='btn btn-ghost';undoPreset.textContent='Undo preset';undoPreset.hidden=true;
    document.querySelector('.platform-chips').after(presetStatus,undoPreset);
    undoPreset.addEventListener('click',function(){
      if(!presetSnapshot)return;
      Object.keys(presetSnapshot.levels).forEach(function(level){rowControllers[level].setState(presetSnapshot.levels[level]);});
      platformChips.forEach(function(chip){chip.classList.toggle('is-active',chip.dataset.platform===presetSnapshot.platform);});
      var previousPlatform=presetSnapshot.platform;presetSnapshot=null;undoPreset.hidden=true;
      persistTypography();updateMachineViews();presetStatus.textContent='Previous type sizes and metrics restored.';
      (Array.from(platformChips).find(function(chip){return chip.dataset.platform===previousPlatform;})||platformChips[0]).focus();
    });
    platformChips.forEach(function(chip){
      chip.title=Object.entries(PLATFORM_PRESETS[chip.dataset.platform]||{}).map(function(pair){return pair[0]+': '+window.ADSFoundationModel.sizes[pair[1]]+'px';}).join(', ');
      chip.addEventListener("click", function(){
        var preset = PLATFORM_PRESETS[chip.dataset.platform];
        if (!preset) return;
        presetSnapshot={platform:document.querySelector('.platform-chips .chip.is-active')?.dataset.platform||null,levels:{}};
        Object.keys(preset).forEach(function(level){if(rowControllers[level])presetSnapshot.levels[level]=rowControllers[level].getState();});
        platformChips.forEach(function(c){ c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        Object.keys(preset).forEach(function(level){
          if (rowControllers[level]) rowControllers[level].setSize(preset[level]);
        });
        undoPreset.hidden=false;presetStatus.textContent='Applied '+chip.textContent.trim()+': '+Object.keys(preset).map(function(level){return level+' '+window.ADSFoundationModel.sizes[presetSnapshot.levels[level].size]+'px → '+window.ADSFoundationModel.sizes[preset[level]]+'px';}).join(', ')+'. Fonts and colors are retained. Undo restores the previous metrics for these roles.';
      });
    });

    function loadTypography(){
      var saved;
      saved = window.ADSStorage.safeGet(SAVE_KEY);
      if (!saved) return;

      if (saved.primaryFont && saved.primaryFont.family){
        if (saved.primaryFont.linkHref) injectLink(saved.primaryFont.linkHref);
        primaryPicker.setFamily(saved.primaryFont.family, saved.primaryFont.source, saved.primaryFont.linkHref, saved.primaryFont.dataUrl);
      }
      if (saved.secondaryFont && saved.secondaryFont.family){
        if (saved.secondaryFont.linkHref) injectLink(saved.secondaryFont.linkHref);
        secondaryPicker.setFamily(saved.secondaryFont.family, saved.secondaryFont.source, saved.secondaryFont.linkHref, saved.secondaryFont.dataUrl);
      }
      Object.keys(saved.levels || {}).forEach(function(level){
        if (rowControllers[level]) rowControllers[level].setState(saved.levels[level]);
      });
      if (saved.platform){
        platformChips.forEach(function(c){ c.classList.toggle("is-active", c.dataset.platform === saved.platform); });
      }
    }
    loadTypography();
    updateMachineViews();
    window.addEventListener('ads:foundation-applied', updateMachineViews);

    function persistTypography(){
      var activeChip = document.querySelector(".platform-chips .chip.is-active");
      var payload = {
        headingScaleVersion: window.ADSFoundationModel.headingScaleVersion,
        primaryFont: primaryPicker.getState(),
        secondaryFont: secondaryPicker.getState(),
        platform: activeChip ? activeChip.dataset.platform : null,
        levels: {}
      };
      Object.keys(rowControllers).forEach(function(level){
        payload.levels[level] = rowControllers[level].getState();
      });
      var success = window.ADSStorage.safeSet(SAVE_KEY, payload);
      // Applies the new font family sitewide immediately (shell.js already
      // does this on boot/cross-tab; this page's own text needs it too,
      // without waiting for a reload).
      if (window.ADS_applySavedTypographyFont) window.ADS_applySavedTypographyFont();
      return success;
    }

    var saveBtn = document.getElementById("saveTypographyBtn");
    var saveStatus = document.getElementById("typoSaveStatus");
    saveBtn.addEventListener("click", function(){
      persistTypography();

      saveStatus.textContent = window.ADSStorage.lastWriteSucceeded ? "Saved just now" : "Preview only — could not save";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var regenerateDarkBtn = document.getElementById("regenerateDarkColorsBtn");
    regenerateDarkBtn.addEventListener("click", function(){
      presetSnapshot=null;undoPreset.hidden=true;
      Object.keys(rowControllers).forEach(function(level){
        rowControllers[level].regenerateDark();
      });
      persistTypography();

      saveStatus.textContent = "Dark colors regenerated from Light";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var resetBtn = document.getElementById("resetTypographyBtn");
    resetBtn.addEventListener("click", function(e){
      // stopPropagation blocks this click's own bubble to main's listener;
      // suppressPersist additionally covers the nested synthetic clicks
      // primaryPicker.reset()/secondaryPicker.reset() fire internally,
      // which are separate click events that bubble immediately (target
      // phase runs fully, including resetting suppressPersist back to
      // false, before the browser even starts this event's own bubble
      // phase - so stopPropagation alone doesn't reach those inner clicks).
      e.stopPropagation();
      if (!window.ADSStorage.safeRemove(SAVE_KEY)) return;
      presetSnapshot=null;undoPreset.hidden=true;presetStatus.textContent='';
      suppressPersist = true;

      primaryPicker.reset();
      secondaryPicker.reset();
      platformChips.forEach(function(c){ c.classList.remove("is-active"); });

      Object.keys(rowControllers).forEach(function(level){
        rowControllers[level].setState(ROW_DEFAULTS[level]);
      });
      suppressPersist = false;
      updateMachineViews();
      if (window.ADS_applySavedTypographyFont) window.ADS_applySavedTypographyFont();

      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var copyMarkdownBtn = document.getElementById("copyTypographyMarkdownBtn");
    var markdownStatus = document.getElementById("typographyMarkdownStatus");
    if (copyMarkdownBtn){
      copyMarkdownBtn.addEventListener("click", function(){
        window.ADSFoundation.apply();
        renderMarkdown();
        var text = markdownOutput ? markdownOutput.textContent : "";
        function done(){
          markdownStatus.textContent = "Copied to clipboard";
          setTimeout(function(){ markdownStatus.textContent = ''; }, 2500);
        }
        window.ADSClipboard.copy(text).then(done).catch(function(){
          markdownStatus.textContent = "Copy failed - select the text above and copy manually.";
        });
      });
    }
  });
})();
