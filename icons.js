(() => {
  "use strict";

  var SAVE_KEY = "ads:icons";

  var SHAPES = {
    circle: '<circle cx="12" cy="12" r="8"/>',
    heart: '<path d="M12 20.5s-6.7-4.2-9-8.1C1.3 9 2.7 5.3 6.2 5.3c2 0 3.5 1.2 4 2.5.5-1.3 2-2.5 4-2.5 3.5 0 4.9 3.7 3.2 7.1-2.3 3.9-9 8.1-9 8.1z"/>',
    square: '<rect x="5" y="5" width="14" height="14" rx="3"/>',
    star: '<path d="M12 3.2l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3-5.4 3 1.3-6-4.6-4.1 6.1-.6z"/>'
  };
  var SHAPE_ORDER = ["circle", "heart", "square", "star"];

  function iconSvg(shape, mode, size, strokeWidth, corner){
    var d = SHAPES[shape];
    var cap = corner === "sharp" ? "square" : "round";
    var join = corner === "sharp" ? "miter" : "round";
    var inner;
    if (mode === "line"){
      inner = '<g fill="none" stroke="currentColor" stroke-width="' + strokeWidth + '" stroke-linecap="' + cap + '" stroke-linejoin="' + join + '">' + d + '</g>';
    } else if (mode === "dashed"){
      inner = '<g fill="none" stroke="currentColor" stroke-width="' + strokeWidth + '" stroke-linecap="' + cap + '" stroke-linejoin="' + join + '" stroke-dasharray="3 2.6">' + d + '</g>';
    } else if (mode === "flat"){
      inner = '<g fill="currentColor">' + d + '</g>';
    } else if (mode === "duotone"){
      inner = '<g fill="currentColor" opacity="0.32">' + d + '</g>' +
              '<g fill="currentColor" transform="translate(12 12) scale(0.55) translate(-12 -12)">' + d + '</g>';
    } else if (mode === "twotone"){
      inner = '<g fill="none" stroke="currentColor" stroke-width="' + Math.max(1, strokeWidth - 0.2) + '" stroke-linecap="' + cap + '" stroke-linejoin="' + join + '">' + d + '</g>' +
              '<g fill="currentColor" opacity="0.9" transform="translate(12 12) scale(0.48) translate(-12 -12)">' + d + '</g>';
    } else {
      inner = '<g fill="currentColor">' + d + '</g>';
    }
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24">' + inner + '</svg>';
  }

  var ISOMETRIC_SVG =
    '<svg width="32" height="32" viewBox="0 0 32 32">' +
    '<polygon points="16,3 28,9.5 16,16 4,9.5" fill="currentColor" opacity="0.55"/>' +
    '<polygon points="4,9.5 16,16 16,29 4,22.5" fill="currentColor" opacity="0.85"/>' +
    '<polygon points="28,9.5 16,16 16,29 28,22.5" fill="currentColor" opacity="0.7"/>' +
    '</svg>';

  var THREED_SVG =
    '<svg width="32" height="32" viewBox="0 0 32 32">' +
    '<defs><radialGradient id="adsPreview3d" cx="35%" cy="30%" r="75%">' +
    '<stop offset="0%" stop-color="currentColor" stop-opacity="1"/>' +
    '<stop offset="100%" stop-color="currentColor" stop-opacity="0.45"/>' +
    '</radialGradient></defs>' +
    '<circle cx="16" cy="16" r="13" fill="url(#adsPreview3d)"/>' +
    '<ellipse cx="11.5" cy="10.5" rx="4.5" ry="3" fill="#ffffff" opacity="0.35"/>' +
    '</svg>';

  document.addEventListener("DOMContentLoaded", function(){
    var systemCards = document.querySelectorAll(".system-card");

    var sizeSelect = document.querySelector('[data-role="icon-size"]');
    var strokeSelect = document.querySelector('[data-role="icon-stroke"]');
    var cornerSelect = document.querySelector('[data-role="icon-corner"]');
    var previewRow = document.querySelector('[data-role="icon-preview"]');

    function renderPreview(){
      var mode = getActiveSystem();
      var size = Number(sizeSelect.value);
      var stroke = Number(strokeSelect.value);
      var corner = cornerSelect.value;
      var html;
      if (mode === "isometric"){
        html = ISOMETRIC_SVG;
      } else if (mode === "3d"){
        html = THREED_SVG;
      } else {
        html = SHAPE_ORDER.map(function(shape){
          return iconSvg(shape, mode, size, stroke, corner);
        }).join("");
      }
      previewRow.innerHTML = html;
    }

    function selectSystem(key){
      systemCards.forEach(function(card){
        card.classList.toggle("is-active", card.dataset.system === key);
      });
      renderPreview();
    }

    systemCards.forEach(function(card){
      card.addEventListener("click", function(){ selectSystem(card.dataset.system); });
    });

    sizeSelect.addEventListener("change", renderPreview);
    strokeSelect.addEventListener("change", renderPreview);
    cornerSelect.addEventListener("change", renderPreview);

    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "duotone";
    }

    function loadIcons(){
      var saved;
      try{ saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ saved = null; }
      if (!saved){ renderPreview(); return; }

      if (saved.system) selectSystem(saved.system);
      if (saved.size) sizeSelect.value = saved.size;
      if (saved.stroke) strokeSelect.value = saved.stroke;
      if (saved.corner) cornerSelect.value = saved.corner;
      if (saved.library){
        var radio = document.querySelector('[data-role="library-radio"][value="' + saved.library + '"]');
        if (radio) radio.checked = true;
      }

      renderPreview();
    }
    loadIcons();

    var saveBtn = document.getElementById("saveIconsBtn");
    var saveStatus = document.getElementById("iconsSaveStatus");
    saveBtn.addEventListener("click", function(){
      var libraryRadio = document.querySelector('[data-role="library-radio"]:checked');
      var payload = {
        system: getActiveSystem(),
        size: sizeSelect.value,
        stroke: strokeSelect.value,
        corner: cornerSelect.value,
        library: libraryRadio ? libraryRadio.value : null
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));

      saveStatus.hidden = false;
      saveStatus.textContent = "Saved just now";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });

    var resetBtn = document.getElementById("resetIconsBtn");
    resetBtn.addEventListener("click", function(){
      localStorage.removeItem(SAVE_KEY);
      sizeSelect.value = "24";
      strokeSelect.value = "1.8";
      cornerSelect.value = "round";
      document.querySelectorAll('[data-role="library-radio"]').forEach(function(r){ r.checked = false; });
      selectSystem("duotone");

      saveStatus.hidden = false;
      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.hidden = true; }, 2500);
    });

    // ---------- upload reference icons ----------
    var uploadDrop = document.querySelector('[data-role="icon-upload-drop"]');
    var uploadInput = document.querySelector('[data-role="icon-upload-input"]');
    var uploadLabel = document.querySelector('[data-role="icon-upload-label"]');
    var uploadGrid = document.querySelector('[data-role="icon-upload-grid"]');

    function addUploadThumb(file, dataUrl){
      var thumb = document.createElement("div");
      thumb.className = "icon-upload-thumb";
      var img = document.createElement("img");
      img.src = dataUrl;
      img.alt = file.name;
      var name = document.createElement("span");
      name.textContent = file.name;
      thumb.appendChild(img);
      thumb.appendChild(name);
      uploadGrid.appendChild(thumb);
    }

    function handleFiles(files){
      if (!files || !files.length) return;
      Array.prototype.forEach.call(files, function(file){
        var reader = new FileReader();
        reader.onload = function(){ addUploadThumb(file, reader.result); };
        reader.readAsDataURL(file);
      });
      uploadLabel.textContent = files.length + " reference icon" + (files.length === 1 ? "" : "s") + " added - drop more, or click to add different ones";
    }

    uploadDrop.addEventListener("click", function(){ uploadInput.click(); });
    uploadInput.addEventListener("change", function(){ handleFiles(uploadInput.files); });
    uploadDrop.addEventListener("dragover", function(e){ e.preventDefault(); uploadDrop.classList.add("is-dragover"); });
    uploadDrop.addEventListener("dragleave", function(){ uploadDrop.classList.remove("is-dragover"); });
    uploadDrop.addEventListener("drop", function(e){
      e.preventDefault();
      uploadDrop.classList.remove("is-dragover");
      handleFiles(e.dataTransfer.files);
    });
  });
})();
