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

    function updateMachineViews(){
      if (buildingMachineJson){
        var activeCard = document.querySelector(".product-card.is-active");
        buildingMachineJson.textContent = JSON.stringify({
          selected: activeCard ? activeCard.dataset.product : null,
          recommendedPrimary: activeCard ? activeCard.dataset.primary : null,
          recommendedSecondary: activeCard ? activeCard.dataset.secondary : null
        }, null, 2);
      }
      if (systemMachineJson){
        var activeSystem = document.querySelector(".system-card.is-active");
        systemMachineJson.textContent = JSON.stringify({
          selected: activeSystem ? activeSystem.dataset.system : null,
          scale: activeSystem ? (activeSystem.querySelector('[data-role="scale"]') || {}).textContent || null : null
        }, null, 2);
      }
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

    function loadSpacing(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ saved = null; }
      if (!saved) return;

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

      saveStatus.hidden = false;
      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });

    var resetBtn = document.getElementById("resetSpacingBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);
      productCards.forEach(function(c){ c.classList.remove("is-active"); });
      callout.hidden = true;
      selectSystem("4px");

      saveStatus.hidden = false;
      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });
  });
})();
