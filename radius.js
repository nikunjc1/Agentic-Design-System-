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

    productCards.forEach(function(card){
      card.addEventListener("click", function(e){
        var hit = e.target.closest("button, input, select, textarea, a, [role=combobox]"); if (hit && hit !== card) return; selectProduct(card); });
    });

    systemCards.forEach(function(card){
      card.addEventListener("click", function(e){
        var hit = e.target.closest("button, input, select, textarea, a, [role=combobox]"); if (hit && hit !== card) return; selectSystem(card.dataset.system); });
    });

    function getActiveProduct(){
      var active = document.querySelector(".product-card.is-active");
      return active ? active.dataset.product : null;
    }
    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "balanced";
    }

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
      var payload = { product: getActiveProduct(), philosophy: getActiveSystem() };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));

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
  });
})();
