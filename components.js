(() => {
  "use strict";

  function radiusCss(radius){
    return radius === "9999" ? "9999px" : radius + "px";
  }

  document.addEventListener("DOMContentLoaded", function(){
    var globalRadiusSelect = document.querySelector('[data-role="global-radius-select"]');
    var cardPreviewBtns = document.querySelectorAll('.button-type-card .btn-demo, .button-type-card .dualicon-btn');

    function getRadius(){
      return globalRadiusSelect ? globalRadiusSelect.value : "8";
    }

    function applyRadius(){
      var radius = radiusCss(getRadius());
      cardPreviewBtns.forEach(function(el){ el.style.borderRadius = radius; });
    }

    if (globalRadiusSelect){
      globalRadiusSelect.addEventListener("change", applyRadius);
      applyRadius();
    }

    // Clicking the card itself opens a full preview page for that type
    // (state / content / size) - the copy buttons above stop propagation
    // so they don't trigger this navigation.
    var typeCards = document.querySelectorAll(".button-type-card[data-system]");
    typeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "button-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){
        window.location.href = href;
      });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // ---------- upload custom icon variations for button content ----------
    var iconUploadTrigger = document.querySelector('[data-role="icon-upload-trigger"]');
    var iconUploadInput = document.querySelector('[data-role="button-icon-upload-input"]');
    var iconUploadPanel = document.querySelector('[data-role="button-icon-upload-panel"]');
    var iconUploadGrid = document.querySelector('[data-role="button-icon-upload-grid"]');

    function addUploadedIconThumb(file, dataUrl){
      iconUploadPanel.hidden = false;
      var thumb = document.createElement("div");
      thumb.className = "icon-upload-thumb";
      var img = document.createElement("img");
      img.src = dataUrl;
      img.alt = file.name;
      var name = document.createElement("span");
      name.textContent = file.name;
      var removeBtn = document.createElement("button");
      removeBtn.className = "icon-upload-thumb-remove";
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", "Remove " + file.name);
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", function(){
        thumb.remove();
        if (!iconUploadGrid.children.length) iconUploadPanel.hidden = true;
      });
      thumb.appendChild(img);
      thumb.appendChild(name);
      thumb.appendChild(removeBtn);
      iconUploadGrid.appendChild(thumb);
    }

    function handleIconUpload(files){
      if (!files || !files.length) return;
      Array.prototype.forEach.call(files, function(file){
        var reader = new FileReader();
        reader.onload = function(){ addUploadedIconThumb(file, reader.result); };
        reader.readAsDataURL(file);
      });
    }

    if (iconUploadTrigger && iconUploadInput){
      iconUploadTrigger.addEventListener("click", function(){ iconUploadInput.click(); });
      iconUploadInput.addEventListener("change", function(){
        handleIconUpload(iconUploadInput.files);
        iconUploadInput.value = "";
      });
    }
  });
})();
