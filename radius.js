(() => {
  "use strict";

  var SAVE_KEY = "ads:radius";

  document.addEventListener("DOMContentLoaded", function(){
    var productCards = document.querySelectorAll(".product-card");
    var systemCards = document.querySelectorAll(".system-card");
    var callout = document.getElementById("recommendationCallout");
    var calloutText = document.getElementById("recommendationText");
    var buildingMachineJson = document.querySelector('[data-role="building-machine-json"]');
    var systemMachineJson = document.querySelector('[data-role="radiussystem-machine-json"]');

    var markdownOutput = document.querySelector('[data-role="radius-markdown-output"]');

    // Same "MD file" pattern added to Colors, Grid & Layout, Typography and
    // Spacing: one consolidated Markdown snapshot of this page's editable
    // state (What are you building? + Radius philosophy) - Recommended
    // global model, Radius by component role and Component defaults are
    // fixed reference content, excluded for the same reason as every other
    // page's static sections so far.
    function renderMarkdown(){
      if (!markdownOutput) return;
      var productCard = document.querySelector(".product-card.is-active");
      var systemCard = document.querySelector(".system-card.is-active");
      var systemDesc = systemCard ? (systemCard.querySelector(".system-card-desc") || {}).textContent : null;
      var systemScale = systemCard ? (systemCard.querySelector('[data-role="scale"]') || {}).textContent : null;
      var systemTagline = systemCard ? (systemCard.querySelector(".system-card-tagline") || {}).textContent : null;

      var lines = ["# Radius", ""];
      lines.push("## What are you building?", "");
      if (productCard){
        lines.push("- Selected product: `" + productCard.dataset.product + "`");
        lines.push("- Recommended philosophy: `" + productCard.dataset.philosophy + "`");
        lines.push("- Recommended core radius: `" + productCard.dataset.core + "`");
        lines.push("- Recommended container radius: `" + productCard.dataset.container + "`");
      } else {
        lines.push("- No product type selected yet");
      }
      lines.push("", "## Radius philosophy", "");
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
          recommendedPhilosophy: activeCard ? activeCard.dataset.philosophy : null,
          recommendedCore: activeCard ? activeCard.dataset.core : null,
          recommendedContainer: activeCard ? activeCard.dataset.container : null
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
      var core = card.dataset.core;
      var container = card.dataset.container;
      var character = card.dataset.character;
      var philosophy = card.dataset.philosophy;

      callout.hidden = false;
      calloutText.innerHTML =
        "<strong>" + core + "</strong> core &middot; <strong>" + container + "</strong> container for " + name +
        " - a " + character.toLowerCase() + " character.";

      selectSystem(philosophy);
      updateMachineViews();
    }

    function getActiveProduct(){
      var active = document.querySelector(".product-card.is-active");
      return active ? active.dataset.product : null;
    }
    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "balanced";
    }

    // Persists on every real click, not on the load/reset paths - see the
    // same note in grid-layout.js.
    function persistRadius(){
      // recommendedAtSave - Foundation audit NP02's provenance field, same
      // as grid-layout.js/spacing.js: what this page would have recommended
      // at the moment of this save. See showContextChangeNotice().
      window.ADSStorage.safeSet(SAVE_KEY, {
        product: getActiveProduct(),
        philosophy: getActiveSystem(),
        recommendedAtSave: computeRecommendedProduct(currentProfile())
      });
      // Applies the new philosophy sitewide immediately (shell.js already
      // does this on boot/cross-tab; this page's own nav/buttons need it
      // too, without waiting for a reload).
      if (window.ADS_applySavedRadius) window.ADS_applySavedRadius();
    }

    productCards.forEach(function(card){
      card.addEventListener("click", function(e){
        var hit = e.target.closest("button, input, select, textarea, a, [role=combobox]"); if (hit && hit !== card) return;
        selectProduct(card);
        persistRadius();
      });
    });

    systemCards.forEach(function(card){
      card.addEventListener("click", function(e){
        var hit = e.target.closest("button, input, select, textarea, a, [role=combobox]"); if (hit && hit !== card) return;
        selectSystem(card.dataset.system);
        persistRadius();
      });
    });

    // Same mapping as spacing.js/grid-layout.js - New Project's own "What
    // type of product are you creating?" uses 9 of this page's own
    // 12-category taxonomy (names match 1:1 for those 9 - see
    // project-model.js's PRODUCTS; the other 3 - Desktop Web, Mobile Web,
    // Mobile Application - were deliberately left off New Project's list
    // since that form already asks platform separately via "Where will
    // your product be used?"), just needs converting to this page's
    // data-product slug. Only used the first time this page loads with
    // nothing of its own saved yet - the user's own choice here always
    // wins afterward.
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
    // Foundation audit NP02 - same platform-resolves-unambiguously rule as
    // grid-layout.js/spacing.js: platform only overrides product type when
    // the profile has exactly one platform and it's one of these 3 slugs.
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
    // Same fallback-notice pattern as spacing.js - the one case
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

    // What "nothing of my own saved" actually looks like - shared by the
    // initial load AND Reset, so Reset's own immediate result is the same
    // state a reload would show right after, instead of Reset showing
    // Balanced only for a real reload to then flip to the project's own
    // recommended philosophy a moment later (previously: Reset hardcoded
    // Balanced regardless of what the project profile actually maps to).
    function applyUnsavedState(){
      var mapped = productFromProjectProfile();
      if (mapped){
        var mappedCard = document.querySelector('.product-card[data-product="' + mapped + '"]');
        if (mappedCard) { selectProduct(mappedCard); return; }
      }
      showProductFallbackNotice();
    }

    function loadRadius(){
      var saved;
      saved = window.ADSStorage.safeGet(SAVE_KEY);
      if (!saved){
        applyUnsavedState();
        return;
      }

      if (saved.product){
        var card = document.querySelector('.product-card[data-product="' + saved.product + '"]');
        if (card) selectProduct(card);
      }
      if (saved.philosophy) selectSystem(saved.philosophy);
      showContextChangeNotice(saved);
    }

    // Foundation audit NP02 - "review affected choices after context edits."
    // Same logic as grid-layout.js/spacing.js's showContextChangeNotice().
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
          if (targetCard){ selectProduct(targetCard); persistRadius(); }
          notice.hidden = true;
        });
      } else if (saved.recommendedAtSave) {
        notice.textContent = "You chose " + nameOf(saved.product) + " here, overriding this page's own recommendation (" +
          nameOf(saved.recommendedAtSave) + " at the time) - kept exactly as you set it.";
        notice.hidden = false;
      }
    }
    loadRadius();
    updateMachineViews();

    var saveBtn = document.getElementById("saveRadiusBtn");
    var saveStatus = document.getElementById("radiusSaveStatus");
    saveBtn.addEventListener("click", function(){
      persistRadius();

      saveStatus.textContent = window.ADSStorage.lastWriteSucceeded ? "Saved just now" : "Preview only — could not save";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var resetBtn = document.getElementById("resetRadiusBtn");
    resetBtn.addEventListener("click", function(){
      if (!window.ADSStorage.safeRemove(SAVE_KEY)) return;
      productCards.forEach(function(c){ c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
      callout.hidden = true;
      var contextNotice = document.querySelector('[data-role="context-changed-notice"]');
      if (contextNotice) contextNotice.hidden = true;
      selectSystem("balanced");
      applyUnsavedState();
      if (window.ADS_applySavedRadius) window.ADS_applySavedRadius();

      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var copyMarkdownBtn = document.getElementById("copyRadiusMarkdownBtn");
    var markdownStatus = document.getElementById("radiusMarkdownStatus");
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
