(() => {
  "use strict";

  var SAVE_KEY = "ads:shadow";

  document.addEventListener("DOMContentLoaded", function(){
    var systemCards = document.querySelectorAll(".system-card");

    function selectSystem(key){
      systemCards.forEach(function(card){
        card.classList.toggle("is-active", card.dataset.system === key);
      });
    }

    systemCards.forEach(function(card){
      card.addEventListener("click", function(e){
        if (e.target.closest("button, input, select, textarea, a, [role=combobox]")) return; selectSystem(card.dataset.system); });
    });

    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "balanced";
    }

    function loadShadow(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ saved = null; }
      if (!saved) return;

      if (saved.philosophy) selectSystem(saved.philosophy);
    }
    loadShadow();

    var saveBtn = document.getElementById("saveShadowBtn");
    var saveStatus = document.getElementById("shadowSaveStatus");
    saveBtn.addEventListener("click", function(){
      var payload = { philosophy: getActiveSystem() };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));

      saveStatus.hidden = false;
      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });

    var resetBtn = document.getElementById("resetShadowBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);
      selectSystem("balanced");

      saveStatus.hidden = false;
      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });
  });
})();
