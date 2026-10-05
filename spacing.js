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
        card.classList.toggle("is-active", card.dataset.system === key);
      });
      updateMachineViews();
    }

    function selectProduct(card){
      productCards.forEach(function(c){ c.classList.remove("is-active"); });
      card.classList.add("is-active");

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
      localStorage.setItem(SAVE_KEY, JSON.stringify({ product: getActiveProduct(), system: getActiveSystem() }));
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
    // data-product slug. Only used the first time this page loads with
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
      // Consumer App and AI Product have no matching card on this page
      // specifically (its own set is 10, not Radius/Grid & Layout's 12),
      // so those two safely resolve to no selection here only.
    };
    function productFromProjectProfile(){
      if (!window.ADSProject) return null;
      var profile;
      try{ profile = window.ADSProject.read(localStorage); }catch(e){ return null; }
      if (!profile) return null;
      return PROJECT_PRODUCT_TYPE_MAP[profile.productType] || null;
    }

    function loadSpacing(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ saved = null; }
      if (!saved){
        var mapped = productFromProjectProfile();
        if (mapped){
          var mappedCard = document.querySelector('.product-card[data-product="' + mapped + '"]');
          if (mappedCard) selectProduct(mappedCard);
        }
        return;
      }

      if (saved.product){
        var card = document.querySelector('.product-card[data-product="' + saved.product + '"]');
        if (card) selectProduct(card);
      }
      if (saved.system) selectSystem(saved.system);
    }
    loadSpacing();
    updateMachineViews();

    var saveBtn = document.getElementById("saveSpacingBtn");
    var saveStatus = document.getElementById("spacingSaveStatus");
    saveBtn.addEventListener("click", function(){
      persistSpacing();

      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var resetBtn = document.getElementById("resetSpacingBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);
      productCards.forEach(function(c){ c.classList.remove("is-active"); });
      callout.hidden = true;
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
