(() => {
  "use strict";

  var SAVE_KEY = "ads:spacing";

  document.addEventListener("DOMContentLoaded", function(){
    var productCards = document.querySelectorAll(".product-card");
    var systemCards = document.querySelectorAll(".system-card");
    var callout = document.getElementById("recommendationCallout");
    var calloutText = document.getElementById("recommendationText");

    function selectSystem(key){
      systemCards.forEach(function(card){
        card.classList.toggle("is-active", card.dataset.system === key);
      });
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
    }

    productCards.forEach(function(card){
      card.addEventListener("click", function(e){
        if (e.target.closest("button, input, select, textarea, a, [role=combobox]")) return; selectProduct(card); });
    });

    systemCards.forEach(function(card){
      card.addEventListener("click", function(e){
        if (e.target.closest("button, input, select, textarea, a, [role=combobox]")) return; selectSystem(card.dataset.system); });
    });

    function getActiveProduct(){
      var active = document.querySelector(".product-card.is-active");
      return active ? active.dataset.product : null;
    }
    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "4px";
    }

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

    var saveBtn = document.getElementById("saveSpacingBtn");
    var saveStatus = document.getElementById("spacingSaveStatus");
    saveBtn.addEventListener("click", function(){
      var payload = { product: getActiveProduct(), system: getActiveSystem() };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));

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
