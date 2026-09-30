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
          selected: activeCard ? activeCard.dataset.product : null,
          recommendedPhilosophy: activeCard ? activeCard.dataset.philosophy : null,
          recommendedCore: activeCard ? activeCard.dataset.core : null,
          recommendedContainer: activeCard ? activeCard.dataset.container : null
        }, null, 2);
      }
      if (systemMachineJson){
        var activeSystem = document.querySelector(".system-card.is-active");
        systemMachineJson.textContent = JSON.stringify({
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
      localStorage.setItem(SAVE_KEY, JSON.stringify({ product: getActiveProduct(), philosophy: getActiveSystem() }));
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

    function loadRadius(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ saved = null; }
      if (!saved) return;

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

      saveStatus.hidden = false;
      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });

    var resetBtn = document.getElementById("resetRadiusBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);
      productCards.forEach(function(c){ c.classList.remove("is-active"); });
      callout.hidden = true;
      selectSystem("balanced");

      saveStatus.hidden = false;
      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });

    var copyMarkdownBtn = document.getElementById("copyRadiusMarkdownBtn");
    var markdownStatus = document.getElementById("radiusMarkdownStatus");
    if (copyMarkdownBtn){
      copyMarkdownBtn.addEventListener("click", function(){
        var text = markdownOutput ? markdownOutput.textContent : "";
        function done(){
          markdownStatus.hidden = false;
          markdownStatus.textContent = "Copied to clipboard";
          setTimeout(function(){ markdownStatus.hidden = true; }, 2500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(text).then(done).catch(function(){
            markdownStatus.hidden = false;
            markdownStatus.textContent = "Copy failed - select the text above and copy manually.";
          });
        } else {
          done();
        }
      });
    }
  });
})();
