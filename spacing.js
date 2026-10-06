(() => {
  "use strict";

  var SAVE_KEY = "ads:spacing";

  document.addEventListener("DOMContentLoaded", function(){
    var productCards = document.querySelectorAll(".product-card");
    var systemCards = document.querySelectorAll(".system-card");
    var callout = document.getElementById("recommendationCallout");
    var calloutText = document.getElementById("recommendationText");
    var buildingMachineJson = document.querySelector('[data-role="building-machine-json"]');
    var systemMachineJson = document.querySelector('[data-role="spacingsystem-machine-json"]');

    var markdownOutput = document.querySelector('[data-role="spacing-markdown-output"]');

    // Same "MD file" pattern added to Colors, Grid & Layout and Typography:
    // one consolidated Markdown snapshot of this page's editable state
    // (What are you building? + Spacing system) - Recommended global model
    // and Component defaults are fixed reference content, same category as
    // the other pages' excluded static sections.
    function renderMarkdown(){
      if (!markdownOutput) return;
      var productCard = document.querySelector(".product-card.is-active");
      var systemCard = document.querySelector(".system-card.is-active");
      var systemDesc = systemCard ? (systemCard.querySelector(".system-card-desc") || {}).textContent : null;
      var systemScale = systemCard ? (systemCard.querySelector('[data-role="scale"]') || {}).textContent : null;
      var systemTagline = systemCard ? (systemCard.querySelector(".system-card-tagline") || {}).textContent : null;

      var lines = ["# Spacing", ""];
      lines.push("## What are you building?", "");
      if (productCard){
        lines.push("- Selected product: `" + productCard.dataset.product + "`");
        lines.push("- Recommended primary unit: `" + productCard.dataset.primary + "`");
        lines.push("- Recommended secondary unit: `" + productCard.dataset.secondary + "`");
      } else {
        lines.push("- No product type selected yet");
      }
      lines.push("", "## Spacing system", "");
      if (systemCard){
        lines.push("- Selected: `" + systemCard.dataset.system + "`" + (systemTagline ? " (" + systemTagline.trim() + ")" : ""));
        if (systemDesc) lines.push("- " + systemDesc.trim());
        if (systemScale) lines.push("- Scale: `" + systemScale.trim() + "`");
      }

      markdownOutput.textContent = lines.join("\n").trim();
    }

    function updateMachineViews(){
      if (buildingMachineJson){
        var activeCard = document.querySelector(".product-card.is-active");
        buildingMachineJson.textContent = JSON.stringify({
          $schema: window.ADS_MACHINE_VIEW_SCHEMA,
          selected: activeCard ? activeCard.dataset.product : null,
          recommendedPrimary: activeCard ? activeCard.dataset.primary : null,
          recommendedSecondary: activeCard ? activeCard.dataset.secondary : null
        }, null, 2);
      }
      if (systemMachineJson){
        var activeSystem = document.querySelector(".system-card.is-active");
        systemMachineJson.textContent = JSON.stringify({
          $schema: window.ADS_MACHINE_VIEW_SCHEMA,
          selected: activeSystem ? activeSystem.dataset.system : null,
          scale: activeSystem ? (activeSystem.querySelector('[data-role="scale"]') || {}).textContent || null : null
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
      var primary = card.dataset.primary;
      var secondary = card.dataset.secondary;
      var reason = card.dataset.reason;

      callout.hidden = false;
      calloutText.innerHTML =
        "<strong>" + primary + "</strong> for " + name + ", with <strong>" + secondary + "</strong> as a secondary rule - " + reason;

      // Primary recommendation maps straight onto one of the four system
      // cards; combined rules (e.g. Cross-Platform's "2px + 8px") default
      // to Adaptive, which is built to blend more than one unit.
      var systemKey = primary === "2px" ? "2px" : primary === "8px" ? "8px" : primary === "4px" ? "4px" : "adaptive";
      selectSystem(systemKey);
      updateMachineViews();
    }

    function getActiveProduct(){
      var active = document.querySelector(".product-card.is-active");
      return active ? active.dataset.product : null;
    }
    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "4px";
    }

    // Persists on every real click, not on the load/reset paths which
    // programmatically call selectProduct/selectSystem too - see the same
    // note in grid-layout.js.
    function persistSpacing(){
      // recommendedAtSave - Foundation audit NP02's provenance field, same
      // as grid-layout.js: what this page would have recommended at the
      // moment of this save, so a later load can tell a context change
      // apart from a deliberate override. See showContextChangeNotice().
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
        persistSpacing();
      });
    });

    systemCards.forEach(function(card){
      card.addEventListener("click", function(e){
        var hit = e.target.closest("button, input, select, textarea, a, [role=combobox]"); if (hit && hit !== card) return;
        selectSystem(card.dataset.system);
        persistSpacing();
      });
    });

    // New Project's own "What type of product are you creating?" uses 9 of
    // this page's own 12-category taxonomy (names match 1:1 for those 9 -
    // see project-model.js's PRODUCTS; the other 3 - Desktop Web, Mobile
    // Web, Mobile Application - were deliberately left off New Project's
    // list since that form already asks platform separately via "Where
    // will your product be used?"), just needs converting to this page's
    // data-product slug - this page's own card set now matches Radius and
    // Grid & Layout's full 12 (Consumer App and AI Product added, see
    // spacing.html). Only used the first time this page loads with
    // nothing of its own saved yet - once the user picks (or changes) a
    // card here, their own choice always wins.
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
      // "Other" has no reasonable default - the user described their own
      // product type in free text, which none of these cards represent.
    };
    // Foundation audit NP02 - same platform-resolves-unambiguously rule as
    // grid-layout.js: platform only overrides product type when the profile
    // has exactly one platform and it's one of these 3 product-card slugs.
    var PLATFORM_ONLY_PRODUCT_MAP = { "desktop-web": "desktop-web", "mobile-web": "mobile-web", "mobile-app": "mobile-app" };
    function currentProfile(){
      if (!window.ADSProject) return null;
      try{ return window.ADSProject.read(localStorage); }catch(e){ return null; }
    }
    function computeRecommendedProduct(profile){
      return window.ADSFoundationModel.recommendedProduct(profile);
    }
    function productFromProjectProfile(){
      return computeRecommendedProduct(currentProfile());
    }
    // The one remaining case productFromProjectProfile() can't map: the
    // user described their own product type as "Other" in New Project.
    // That's not a bug to silently swallow - say so, so picking a card
    // here reads as a deliberate choice instead of this page looking like
    // it just ignored the saved project.
    function showProductFallbackNotice(){
      var notice = document.querySelector('[data-role="product-fallback-notice"]');
      if (!notice || !window.ADSProject) return;
      var profile;
      try{ profile = window.ADSProject.read(localStorage); }catch(e){ return; }
      if (!profile || profile.productType !== "Other") return;
      notice.textContent = "Your project describes its product type as “" + profile.productOther + "”, which doesn't map to one of these cards - pick whichever is closest; it won't change what you entered in New Project.";
      notice.hidden = false;
    }

    function loadSpacing(){
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
    // Same logic as grid-layout.js's showContextChangeNotice(): stays silent
    // for records with no recorded provenance (saved before this fix).
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
          if (targetCard){ selectProduct(targetCard); persistSpacing(); }
          notice.hidden = true;
        });
      } else if (saved.recommendedAtSave) {
        notice.textContent = "You chose " + nameOf(saved.product) + " here, overriding this page's own recommendation (" +
          nameOf(saved.recommendedAtSave) + " at the time) - kept exactly as you set it.";
        notice.hidden = false;
      }
    }
    loadSpacing();
    updateMachineViews();

    var saveBtn = document.getElementById("saveSpacingBtn");
    var saveStatus = document.getElementById("spacingSaveStatus");
    saveBtn.addEventListener("click", function(){
      persistSpacing();

      saveStatus.textContent = window.ADSStorage.lastWriteSucceeded ? "Saved just now" : "Preview only — could not save";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var resetBtn = document.getElementById("resetSpacingBtn");
    resetBtn.addEventListener("click", function(){
      if (!window.ADSStorage.safeRemove(SAVE_KEY)) return;
      productCards.forEach(function(c){ c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
      callout.hidden = true;
      var contextNotice = document.querySelector('[data-role="context-changed-notice"]');
      if (contextNotice) contextNotice.hidden = true;
      selectSystem("4px");

      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var copyMarkdownBtn = document.getElementById("copySpacingMarkdownBtn");
    var markdownStatus = document.getElementById("spacingMarkdownStatus");
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
