(() => {
  "use strict";

  var SAVE_KEY = "ads:shadow";

  document.addEventListener("DOMContentLoaded", function(){
    var systemCards = document.querySelectorAll(".system-card");
    var machineJson = document.querySelector('[data-role="shadowphilosophy-machine-json"]');

    function updateMachineView(){
      if (!machineJson) return;
      var active = document.querySelector(".system-card.is-active");
      machineJson.textContent = JSON.stringify({
        selected: active ? active.dataset.system : null,
        scale: active ? (active.querySelector('[data-role="scale"]') || {}).textContent || null : null
      }, null, 2);
    }

    function selectSystem(key){
      systemCards.forEach(function(card){
        card.classList.toggle("is-active", card.dataset.system === key);
      });
      updateMachineView();
    }

    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "balanced";
    }

    // Persists on every real click, not on the load/reset paths - see the
    // same note in grid-layout.js.
    function persistShadow(){
      localStorage.setItem(SAVE_KEY, JSON.stringify({ philosophy: getActiveSystem() }));
    }

    systemCards.forEach(function(card){
      card.addEventListener("click", function(e){
        var hit = e.target.closest("button, input, select, textarea, a, [role=combobox]"); if (hit && hit !== card) return;
        selectSystem(card.dataset.system);
        persistShadow();
      });
    });

    function loadShadow(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ saved = null; }
      if (!saved) return;

      if (saved.philosophy) selectSystem(saved.philosophy);
    }
    loadShadow();
    updateMachineView();

    var saveBtn = document.getElementById("saveShadowBtn");
    var saveStatus = document.getElementById("shadowSaveStatus");
    saveBtn.addEventListener("click", function(){
      persistShadow();

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
