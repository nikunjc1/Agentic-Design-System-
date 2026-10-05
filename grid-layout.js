(() => {
  "use strict";

  var SAVE_KEY = "ads:grid-layout";

  var GRID_TYPE_NAMES = {
    columns: "Columns",
    rows: "Rows",
    "columns-rows": "Columns + Rows",
    baseline: "Baseline Grid",
    custom: "Custom"
  };

  document.addEventListener("DOMContentLoaded", function(){
    var productCards = document.querySelectorAll(".product-card");
    var systemCards = document.querySelectorAll(".system-card");
    var callout = document.getElementById("recommendationCallout");
    var calloutText = document.getElementById("recommendationText");
    var buildingMachineJson = document.querySelector('[data-role="building-machine-json"]');
    var gridtypeMachineJson = document.querySelector('[data-role="gridtype-machine-json"]');

    var markdownOutput = document.querySelector('[data-role="gridlayout-markdown-output"]');

    // Same "MD file" pattern added to Colors: one consolidated Markdown
    // snapshot of this page's editable state (not the 3 static reference
    // sections, which already have their own fixed Machine View JSON),
    // regenerated on every real change so it's always current.
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
          label: key ? (GRID_TYPE_NAMES[key] || key) : null
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
        card.dataset.gutter + "px</strong> gutter recommended for " + name + ".";

      selectSystem(systemKey);
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
      window.ADSStorage.safeSet(SAVE_KEY, {
        product: getActiveProduct(),
        system: getActiveSystem(),
        recommendedAtSave: computeRecommendedProduct(currentProfile())
      });
    }

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
