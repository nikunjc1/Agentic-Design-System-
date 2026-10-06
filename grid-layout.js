(() => {
  "use strict";

  var SAVE_KEY = "ads:grid-layout";

  var GRID_TYPE_NAMES = {
    columns: "Columns",
    rows: "Rows",
    "columns-rows": "Columns + Rows",
    custom: "Custom"
  };

  document.addEventListener("DOMContentLoaded", function(){
    var productCards = document.querySelectorAll(".product-card");
    // Foundation audit G04 - scoped to the exclusive group specifically;
    // the Baseline toggle below also carries the .system-card class (for
    // matching visual treatment) but isn't part of this exclusive set.
    var systemCards = document.querySelectorAll(".system-card-grid .system-card");
    var baselineEnable = document.querySelector('[data-role="baseline-enable"]');
    var callout = document.getElementById("recommendationCallout");
    var calloutText = document.getElementById("recommendationText");
    var buildingMachineJson = document.querySelector('[data-role="building-machine-json"]');
    var gridtypeMachineJson = document.querySelector('[data-role="gridtype-machine-json"]');

    var markdownOutput = document.querySelector('[data-role="gridlayout-markdown-output"]');

    // Foundation audit G01 - "Recommendations say columns/gutters editable;
    // code stores product/system... No numeric/editor/custom schema
    // exists." The recommendation callout displayed data-columns/data-gutter
    // as read-only text with no input anywhere to actually change them -
    // the page's own copy claimed otherwise. These 2 fields are the real
    // editor: pre-filled from whichever product's recommendation is active,
    // editable afterward, and the one place Custom's own columns/gutter get
    // defined (Custom has no card recommendation to pre-fill from).
    var columnsInput = document.querySelector('[data-role="grid-columns-input"]');
    var gutterInput = document.querySelector('[data-role="grid-gutter-input"]');
    var customRequiredNotice = document.querySelector('[data-role="grid-custom-required-notice"]');

    function effectiveColumns(){ var n = parseInt(columnsInput.value, 10); return isFinite(n) && n > 0 ? n : null; }
    function effectiveGutter(){ var n = parseInt(gutterInput.value, 10); return isFinite(n) && n >= 0 ? n : null; }

    function validateGridValues(){
      var activeSystem = document.querySelector(".system-card.is-active");
      var isCustom = activeSystem && activeSystem.dataset.system === "custom";
      var valid = effectiveColumns() !== null && effectiveGutter() !== null;
      if (isCustom && effectiveColumns() === null) columnsInput.setAttribute("aria-invalid", "true"); else columnsInput.removeAttribute("aria-invalid");
      if (isCustom && effectiveGutter() === null) gutterInput.setAttribute("aria-invalid", "true"); else gutterInput.removeAttribute("aria-invalid");
      if (customRequiredNotice) customRequiredNotice.hidden = !(isCustom && !valid);
      return !isCustom || valid;
    }

    // Same "MD file" pattern added to Colors: one consolidated Markdown
    // snapshot of this page's editable state (not the 3 static reference
    // sections, which already have their own fixed Machine View JSON),
    // regenerated on every real change so it's always current.
    // Foundation audit G08 - "No breakpoints/pattern/overflow rules...
    // travel" with the export; it only ever carried this project's own
    // selections, never the sitewide normative guidance (Breakpoints,
    // Layout patterns, the Overflow rule, Master-Detail's responsive spec)
    // an AI agent or developer would also need to implement this correctly
    // without the rest of this page open beside them. Reads the real JSON
    // already documented in each section (G02/G05/G06) rather than keeping
    // a second, driftable copy of the same facts in this file.
    function readStaticJson(panelTitleText){
      var sections = document.querySelectorAll("section");
      for (var i = 0; i < sections.length; i++){
        var title = sections[i].querySelector(".panel-title");
        if (title && title.textContent.trim() === panelTitleText){
          var code = sections[i].querySelector(".guide-machine-json code");
          if (!code) return null;
          try{ return JSON.parse(code.textContent); }catch(e){ return null; }
        }
      }
      return null;
    }

    function renderMarkdown(){
      if (!markdownOutput) return;
      var productCard = document.querySelector(".product-card.is-active");
      var systemCard = document.querySelector(".system-card.is-active");
      var systemKey = systemCard ? systemCard.dataset.system : null;
      var systemDesc = systemCard ? (systemCard.querySelector(".system-card-desc") || {}).textContent : null;

      var lines = ["# Grid & Layout", ""];
      lines.push("## What are you building?", "");
      if (productCard){
        lines.push("- Selected product: `" + productCard.dataset.product + "`");
        lines.push("- Recommended grid type: `" + (GRID_TYPE_NAMES[productCard.dataset.system] || productCard.dataset.system) + "`");
        lines.push("- Recommended columns: `" + productCard.dataset.columns + "`");
        lines.push("- Recommended gutter: `" + productCard.dataset.gutter + "px`");
      } else {
        lines.push("- No product type selected yet");
      }
      lines.push("", "## Grid type", "");
      lines.push("- Selected: `" + (GRID_TYPE_NAMES[systemKey] || systemKey) + "`");
      if (systemDesc) lines.push("- " + systemDesc.trim());
      lines.push("- Effective columns: `" + (effectiveColumns() === null ? "not set" : effectiveColumns()) + "`");
      lines.push("- Effective gutter: `" + (effectiveGutter() === null ? "not set" : effectiveGutter() + "px") + "`");
      // Foundation audit G04 - independent of the structural type above,
      // not a 5th value it could be confused with.
      lines.push("- Baseline rhythm overlay: `" + (baselineEnable.checked ? "on (4/8px, layered under the grid above)" : "off") + "`");

      var breakpoints = readStaticJson("Breakpoints");
      if (breakpoints && Array.isArray(breakpoints.breakpoints)){
        lines.push("", "## Breakpoints - this system's real, shared thresholds", "");
        breakpoints.breakpoints.forEach(function(bp){
          lines.push("- `" + bp.value + "` (" + bp.type + "): " + bp.effect);
        });
      }

      var patterns = readStaticJson("Layout patterns");
      if (patterns){
        if (patterns.overflowRule){
          lines.push("", "## Overflow rule", "");
          lines.push("- Default: " + patterns.overflowRule.default);
          lines.push("- Independent scroll justified for: " + patterns.overflowRule.independentScrollJustifiedFor.join("; "));
          lines.push("- Avoid: " + patterns.overflowRule.avoid);
        }
        if (patterns.masterDetailResponsive && systemKey){
          lines.push("", "## Master-Detail responsive spec (if this grid type is used for a selectable list/detail layout)", "");
          var md = patterns.masterDetailResponsive;
          lines.push("- Narrow (" + md.narrowBreakpoint + "): " + md.narrowBehavior);
          lines.push("- Back: " + md.back);
          lines.push("- Focus order: " + md.focusOrder);
        }
      }

      markdownOutput.textContent = lines.join("\n").trim();
    }

    function updateMachineViews(){
      if (buildingMachineJson){
        var activeCard = document.querySelector(".product-card.is-active");
        buildingMachineJson.textContent = JSON.stringify({
          $schema: window.ADS_MACHINE_VIEW_SCHEMA,
          selected: activeCard ? activeCard.dataset.product : null,
          recommendedSystem: activeCard ? activeCard.dataset.system : null,
          recommendedColumns: activeCard ? Number(activeCard.dataset.columns) : null,
          recommendedGutter: activeCard ? Number(activeCard.dataset.gutter) : null
        }, null, 2);
      }
      if (gridtypeMachineJson){
        var activeSystem = document.querySelector(".system-card.is-active");
        var key = activeSystem ? activeSystem.dataset.system : null;
        gridtypeMachineJson.textContent = JSON.stringify({
          $schema: window.ADS_MACHINE_VIEW_SCHEMA,
          selected: key,
          label: key ? (GRID_TYPE_NAMES[key] || key) : null,
          effectiveColumns: effectiveColumns(),
          effectiveGutter: effectiveGutter(),
          // Foundation audit G04 - a real, independent field now, not a 5th
          // mutually-exclusive "selected" value it could be confused with.
          baselineOverlay: baselineEnable.checked
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
      // Switching to Custom keeps whatever columns/gutter are already in
      // the fields (the user's own in-progress definition) rather than
      // clearing them - switching away from Custom back to a product-backed
      // type re-pulls that product's own recommendation, since the values
      // shown were Custom's, not that product's.
      if (key !== "custom"){
        var activeProduct = document.querySelector(".product-card.is-active");
        if (activeProduct){
          columnsInput.value = activeProduct.dataset.columns;
          gutterInput.value = activeProduct.dataset.gutter;
        }
      }
      validateGridValues();
      updateMachineViews();
    }

    function selectProduct(card){
      productCards.forEach(function(c){ c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
      card.classList.add("is-active");
      card.setAttribute("aria-pressed", "true");
      var fallbackNotice = document.querySelector('[data-role="product-fallback-notice"]');
      if (fallbackNotice) fallbackNotice.hidden = true;

      var name = card.querySelector(".product-card-name").textContent;
      var systemKey = card.dataset.system;
      var systemName = GRID_TYPE_NAMES[systemKey] || systemKey;

      callout.hidden = false;
      calloutText.innerHTML =
        "<strong>" + systemName + "</strong> grid, <strong>" + card.dataset.columns + " columns</strong> with a <strong>" +
        card.dataset.gutter + "px</strong> gutter recommended for " + name + " - edit the fields below to change them.";

      columnsInput.value = card.dataset.columns;
      gutterInput.value = card.dataset.gutter;
      selectSystem(systemKey);
      validateGridValues();
      updateMachineViews();
    }

    function getActiveProduct(){
      var active = document.querySelector(".product-card.is-active");
      return active ? active.dataset.product : null;
    }
    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "columns";
    }

    // Persists on every real click (not on the load/reset paths, which
    // programmatically call selectProduct/selectSystem too - persisting
    // there would immediately write the just-reset defaults back over the
    // localStorage entry Reset just removed) - so the Markdown export
    // always reflects the current on-screen choice without a separate
    // "click Save" step.
    function persistGrid(){
      // recommendedAtSave - Foundation audit NP02's provenance field: what
      // this page would have recommended for the project, at the moment of
      // this save, regardless of what was actually picked. Comparing it to
      // the live recommendation on a later load is what tells reconciliation
      // apart from a deliberate override - see showContextChangeNotice().
      // Foundation audit G01/C03 pattern - a momentarily-cleared field while
      // editing (e.g. selecting all digits to retype) shouldn't overwrite
      // the last genuinely valid saved value with null; fall back to
      // whatever was already saved for that one field instead.
      var prior = window.ADSStorage.safeGet(SAVE_KEY) || {};
      window.ADSStorage.safeSet(SAVE_KEY, {
        product: getActiveProduct(),
        system: getActiveSystem(),
        columns: effectiveColumns() !== null ? effectiveColumns() : (prior.columns != null ? prior.columns : null),
        gutter: effectiveGutter() !== null ? effectiveGutter() : (prior.gutter != null ? prior.gutter : null),
        // Foundation audit G04 - independent of system now; layering a
        // baseline rhythm under Columns is a different saved fact than
        // choosing Columns itself, not a 5th mutually-exclusive value.
        baseline: baselineEnable.checked,
        recommendedAtSave: computeRecommendedProduct(currentProfile())
      });
    }

    // Foundation audit G01 - the one place columns/gutter actually get
    // edited and persisted, not just displayed as a static recommendation.
    columnsInput.addEventListener("input", function(){ validateGridValues(); updateMachineViews(); persistGrid(); });
    gutterInput.addEventListener("input", function(){ validateGridValues(); updateMachineViews(); persistGrid(); });
    baselineEnable.addEventListener("change", function(){ updateMachineViews(); persistGrid(); });

    productCards.forEach(function(card){
      card.addEventListener("click", function(e){
        var hit = e.target.closest("button, input, select, textarea, a, [role=combobox]"); if (hit && hit !== card) return;
        selectProduct(card);
        persistGrid();
      });
    });
    systemCards.forEach(function(card){
      card.addEventListener("click", function(e){
        var hit = e.target.closest("button, input, select, textarea, a, [role=combobox]"); if (hit && hit !== card) return;
        selectSystem(card.dataset.system);
        persistGrid();
      });
    });

    // Same mapping as spacing.js/radius.js - New Project's own "What type
    // of product are you creating?" uses 9 of this page's own 12-category
    // taxonomy (names match 1:1 for those 9 - see project-model.js's
    // PRODUCTS; the other 3 - Desktop Web, Mobile Web, Mobile Application
    // - were deliberately left off New Project's list since that form
    // already asks platform separately via "Where will your product be
    // used?"), just needs converting to this page's data-product slug.
    // Only used the first time this page loads with nothing of its own
    // saved yet - the user's own choice here always wins afterward.
    var PROJECT_PRODUCT_TYPE_MAP = {
      "SaaS": "saas",
      "Enterprise SaaS": "enterprise-saas",
      "Web Application": "web-app",
      "Dashboard": "dashboard",
      "Data-Heavy Application": "data-heavy",
      "Marketing Website": "marketing",
      "Consumer App": "consumer-app",
      "AI Product": "ai-product",
      "Cross-Platform": "cross-platform"
      // "Other" has no reasonable default - free text, no equivalent card.
    };
    // Foundation audit NP02 - the 3 slugs below exist as real product cards
    // specifically so platform can drive the default (see the comment above
    // this map) - but nothing ever actually read profile.platforms, only
    // profile.productType, so a project whose only platform was "Mobile app"
    // still got a desktop-shaped grid by default. Platform only overrides
    // product type when it resolves unambiguously - exactly one platform,
    // and it's one of these 3 - since a project with several platforms has
    // no single "the" platform to prefer over its stated product type.
    var PLATFORM_ONLY_PRODUCT_MAP = { "desktop-web": "desktop-web", "mobile-web": "mobile-web", "mobile-app": "mobile-app" };
    function currentProfile(){
      if (!window.ADSProject) return null;
      try{ return window.ADSProject.read(localStorage); }catch(e){ return null; }
    }
    function computeRecommendedProduct(profile){
      if (!profile) return null;
      if (Array.isArray(profile.platforms) && profile.platforms.length === 1){
        var platformProduct = PLATFORM_ONLY_PRODUCT_MAP[profile.platforms[0]];
        if (platformProduct) return platformProduct;
      }
      return PROJECT_PRODUCT_TYPE_MAP[profile.productType] || null;
    }
    function productFromProjectProfile(){
      return computeRecommendedProduct(currentProfile());
    }

    // Foundation audit G03 - "No platform/container/density precedence;
    // Consumer App four columns regardless of desktop/native target."
    // computeRecommendedProduct() above only resolves platform over product
    // type when exactly one platform is selected - a project with several
    // platforms (the common, real case this finding names) silently falls
    // back to the product type alone, with nothing surfacing that a
    // selected platform might actually want something different. This
    // doesn't invent new "container"/"density" axes (no schema for either
    // exists anywhere in this codebase to ground them in) - it surfaces the
    // one real, concrete conflict this system already has the data for:
    // product type's own recommendation versus each selected platform's.
    function platformConflicts(profile){
      if (!profile || !Array.isArray(profile.platforms) || profile.platforms.length < 2) return [];
      var activeRecommendation = computeRecommendedProduct(profile);
      var activeCard = activeRecommendation && document.querySelector('.product-card[data-product="' + activeRecommendation + '"]');
      if (!activeCard) return [];
      var conflicts = [];
      profile.platforms.forEach(function(platformKey){
        var platformProduct = PLATFORM_ONLY_PRODUCT_MAP[platformKey];
        if (!platformProduct || platformProduct === activeRecommendation) return;
        var platformCard = document.querySelector('.product-card[data-product="' + platformProduct + '"]');
        if (!platformCard) return;
        if (platformCard.dataset.columns !== activeCard.dataset.columns || platformCard.dataset.gutter !== activeCard.dataset.gutter){
          conflicts.push(platformCard);
        }
      });
      return conflicts;
    }

    function showPlatformConflictNotice(profile){
      var notice = document.querySelector('[data-role="platform-conflict-notice"]');
      if (!notice) return;
      var conflicts = platformConflicts(profile);
      if (!conflicts.length){ notice.hidden = true; notice.innerHTML = ""; return; }
      var activeRecommendation = computeRecommendedProduct(profile);
      var activeCard = document.querySelector('.product-card[data-product="' + activeRecommendation + '"]');
      var activeName = activeCard.querySelector(".product-card-name").textContent;
      var parts = conflicts.map(function(card){
        var name = card.querySelector(".product-card-name").textContent;
        return name + " usually wants " + card.dataset.columns + " columns/" + card.dataset.gutter + "px gutter";
      });
      notice.innerHTML = "Showing " + activeName + "'s recommendation (" + activeCard.dataset.columns + " columns/" + activeCard.dataset.gutter +
        "px gutter) since your product type is the tie-breaker across multiple platforms - " + parts.join("; ") +
        ". Edit the fields above if one platform needs a different balance than another.";
      notice.hidden = false;
    }
    // Same fallback-notice pattern as spacing.js/radius.js - the one case
    // productFromProjectProfile() can't map is New Project's "Other",
    // where the user described their own product type in free text.
    function showProductFallbackNotice(){
      var notice = document.querySelector('[data-role="product-fallback-notice"]');
      if (!notice || !window.ADSProject) return;
      var profile;
      try{ profile = window.ADSProject.read(localStorage); }catch(e){ return; }
      if (!profile || profile.productType !== "Other") return;
      notice.textContent = "Your project describes its product type as “" + profile.productOther + "”, which doesn't map to one of these cards - pick whichever is closest; it won't change what you entered in New Project.";
      notice.hidden = false;
    }

    function loadGrid(){
      var saved;
      saved = window.ADSStorage.safeGet(SAVE_KEY);
      showPlatformConflictNotice(currentProfile());
      if (!saved){
        var mapped = productFromProjectProfile();
        if (mapped){
          var mappedCard = document.querySelector('.product-card[data-product="' + mapped + '"]');
          if (mappedCard) selectProduct(mappedCard);
        } else {
          showProductFallbackNotice();
        }
        return;
      }

      if (saved.product){
        var card = document.querySelector('.product-card[data-product="' + saved.product + '"]');
        if (card) selectProduct(card);
      }
      if (saved.system) selectSystem(saved.system);
      // selectProduct/selectSystem both populate columns/gutter from the
      // recommendation - restore the user's own saved values afterward so
      // a real edit (or a Custom definition, which has no card to pull
      // from) isn't silently overwritten by the recommendation on load.
      if (saved.columns !== undefined && saved.columns !== null) columnsInput.value = saved.columns;
      if (saved.gutter !== undefined && saved.gutter !== null) gutterInput.value = saved.gutter;
      baselineEnable.checked = !!saved.baseline;
      validateGridValues();
      showContextChangeNotice(saved);
    }

    // Foundation audit NP02 - "review affected choices after context edits."
    // Only speaks up for records that carry recommendedAtSave (saved after
    // this fix shipped) - older records have no recorded provenance, so
    // silence, not a guessed-at claim, is the honest choice for those.
    function showContextChangeNotice(saved){
      var notice = document.querySelector('[data-role="context-changed-notice"]');
      if (!notice) return;
      notice.hidden = true;
      notice.innerHTML = "";
      if (!saved.product || saved.recommendedAtSave === undefined) return;
      var currentRecommendation = computeRecommendedProduct(currentProfile());
      if (!currentRecommendation) return;
      var nameOf = function(slug){
        var c = document.querySelector('.product-card[data-product="' + slug + '"]');
        return c ? c.querySelector(".product-card-name").textContent : slug;
      };
      var wasFollowingRecommendation = saved.recommendedAtSave === saved.product;
      if (wasFollowingRecommendation){
        if (currentRecommendation === saved.product) return;
        notice.innerHTML = "Your project's context changed since this was saved - the recommended product is now <strong>" +
          nameOf(currentRecommendation) + "</strong> (was " + nameOf(saved.product) +
          ", which is still active). <button type=\"button\" class=\"btn btn-ghost\" id=\"applyUpdatedRecBtn\">Apply updated recommendation</button>";
        notice.hidden = false;
        document.getElementById("applyUpdatedRecBtn").addEventListener("click", function(){
          var targetCard = document.querySelector('.product-card[data-product="' + currentRecommendation + '"]');
          if (targetCard){ selectProduct(targetCard); persistGrid(); }
          notice.hidden = true;
        });
      } else if (saved.recommendedAtSave) {
        notice.textContent = "You chose " + nameOf(saved.product) + " here, overriding this page's own recommendation (" +
          nameOf(saved.recommendedAtSave) + " at the time) - kept exactly as you set it.";
        notice.hidden = false;
      }
    }
    loadGrid();
    updateMachineViews();

    var saveBtn = document.getElementById("saveGridBtn");
    var saveStatus = document.getElementById("gridSaveStatus");
    saveBtn.addEventListener("click", function(){
      // Foundation audit G01 - "require Custom definition": a Custom grid
      // with no columns/gutter of its own is exactly the "Custom is just a
      // label" gap this finding named - block the save and point at what's
      // missing instead of persisting an undefined grid.
      if (!validateGridValues()){
        saveStatus.textContent = "Define columns and gutter above before saving a Custom grid.";
        setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
        columnsInput.focus();
        return;
      }
      persistGrid();

      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var resetBtn = document.getElementById("resetGridBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);
      productCards.forEach(function(c){ c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
      callout.hidden = true;
      var contextNotice = document.querySelector('[data-role="context-changed-notice"]');
      if (contextNotice) contextNotice.hidden = true;
      columnsInput.value = "12";
      gutterInput.value = "24";
      baselineEnable.checked = false;
      selectSystem("columns");

      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var copyMarkdownBtn = document.getElementById("copyGridLayoutMarkdownBtn");
    var markdownStatus = document.getElementById("gridLayoutMarkdownStatus");
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
