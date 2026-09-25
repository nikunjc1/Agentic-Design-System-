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

    function selectSystem(key){
      systemCards.forEach(function(card){
        card.classList.toggle("is-active", card.dataset.system === key);
      });
    }

    function selectProduct(card){
      productCards.forEach(function(c){ c.classList.remove("is-active"); });
      card.classList.add("is-active");

      var name = card.querySelector(".product-card-name").textContent;
      var systemKey = card.dataset.system;
      var systemName = GRID_TYPE_NAMES[systemKey] || systemKey;

      callout.hidden = false;
      calloutText.innerHTML =
        "<strong>" + systemName + "</strong> grid, <strong>" + card.dataset.columns + " columns</strong> with a <strong>" +
        card.dataset.gutter + "px</strong> gutter recommended for " + name + ".";

      selectSystem(systemKey);
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
      return active ? active.dataset.system : "columns";
    }

    function loadGrid(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ saved = null; }
      if (!saved) return;

      if (saved.product){
        var card = document.querySelector('.product-card[data-product="' + saved.product + '"]');
        if (card) selectProduct(card);
      }
      if (saved.system) selectSystem(saved.system);
    }
    loadGrid();

    var saveBtn = document.getElementById("saveGridBtn");
    var saveStatus = document.getElementById("gridSaveStatus");
    saveBtn.addEventListener("click", function(){
      var payload = {
        product: getActiveProduct(),
        system: getActiveSystem()
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));

      saveStatus.hidden = false;
      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });

    var resetBtn = document.getElementById("resetGridBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);
      productCards.forEach(function(c){ c.classList.remove("is-active"); });
      callout.hidden = true;
      selectSystem("columns");

      saveStatus.hidden = false;
      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });
  });
})();
