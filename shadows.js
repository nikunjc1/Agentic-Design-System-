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
        $schema: window.ADS_MACHINE_VIEW_SCHEMA,
        selected: active ? active.dataset.system : null,
        scale: active ? (active.querySelector('[data-role="scale"]') || {}).textContent || null : null
      }, null, 2);
    }

    function selectSystem(key){
      systemCards.forEach(function(card){
        var active = card.dataset.system === key;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-pressed", active ? "true" : "false");
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
      window.ADSStorage.safeSet(SAVE_KEY, { philosophy: getActiveSystem() });
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
      saved = window.ADSStorage.safeGet(SAVE_KEY);
      if (!saved) return;

      if (saved.philosophy) selectSystem(saved.philosophy);
    }
    loadShadow();
    updateMachineView();

    var saveBtn = document.getElementById("saveShadowBtn");
    var saveStatus = document.getElementById("shadowSaveStatus");
    saveBtn.addEventListener("click", function(){
      persistShadow();

      saveStatus.textContent = window.ADSStorage.lastWriteSucceeded ? "Saved just now" : "Preview only — could not save";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var resetBtn = document.getElementById("resetShadowBtn");
    resetBtn.addEventListener("click", function(){
      if (!window.ADSStorage.safeRemove(SAVE_KEY)) return;
      selectSystem("balanced");

      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });
  });
})();
