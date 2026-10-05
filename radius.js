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
        card.classList.toggle("is-active", card.dataset.system === key);
      });
      updateMachineViews();
    }

    function selectProduct(card){
      productCards.forEach(function(c){ c.classList.remove("is-active"); });
      card.classList.add("is-active");
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
      window.ADSStorage.safeSet(SAVE_KEY, { product: getActiveProduct(), philosophy: getActiveSystem() });
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
    function productFromProjectProfile(){
      if (!window.ADSProject) return null;
      var profile;
      try{ profile = window.ADSProject.read(localStorage); }catch(e){ return null; }
      if (!profile) return null;
      return PROJECT_PRODUCT_TYPE_MAP[profile.productType] || null;
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
    }
    loadRadius();
    updateMachineViews();

    var saveBtn = document.getElementById("saveRadiusBtn");
    var saveStatus = document.getElementById("radiusSaveStatus");
    saveBtn.addEventListener("click", function(){
      persistRadius();

      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var resetBtn = document.getElementById("resetRadiusBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);
      productCards.forEach(function(c){ c.classList.remove("is-active"); });
      callout.hidden = true;
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
