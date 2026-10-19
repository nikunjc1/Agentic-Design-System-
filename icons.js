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
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true">' + inner + '</svg>';
  }

  var ISOMETRIC_SVG =
    '<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">' +
    '<polygon points="16,3 28,9.5 16,16 4,9.5" fill="currentColor" opacity="0.55"/>' +
    '<polygon points="4,9.5 16,16 16,29 4,22.5" fill="currentColor" opacity="0.85"/>' +
    '<polygon points="28,9.5 16,16 16,29 28,22.5" fill="currentColor" opacity="0.7"/>' +
    '</svg>';

  var THREED_SVG =
    '<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">' +
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
    var styleMachineJson = document.querySelector('[data-role="iconstyle-machine-json"]');
    var configMachineJson = document.querySelector('[data-role="iconconfig-machine-json"]');
    var byoMachineJson = document.querySelector('[data-role="iconbyo-machine-json"]');

    var markdownOutput = document.querySelector('[data-role="icons-markdown-output"]');
    var uploads = [], uploadGeneration = 0;
    var uploadDrop = document.querySelector('[data-role="icon-upload-drop"]');
    var uploadInput = document.querySelector('[data-role="icon-upload-input"]');
    var uploadLabel = document.querySelector('[data-role="icon-upload-label"]');
    var uploadGrid = document.querySelector('[data-role="icon-upload-grid"]');
    var uploadDefaultLabel = uploadLabel.textContent;

    // Same "MD file" pattern added to the other Foundations pages: one
    // consolidated Markdown snapshot of this page's editable state (Icon
    // style, Configure your icon system, Bring your own icons) - Icon
    // states is fixed reference content, excluded for the same reason as
    // every other page's static sections so far.
    function renderMarkdown(){
      if (!markdownOutput) return;
      var lines = ["# Icons", ""];

      lines.push("## Icon style", "");
      lines.push("- Selected: `" + getActiveSystem() + "`");

      lines.push("", "## Configure your icon system", "");
      lines.push("- Grid size: " + sizeSelect.options[sizeSelect.selectedIndex].textContent);
      lines.push("- Stroke width: " + strokeSelect.options[strokeSelect.selectedIndex].textContent);
      lines.push("- Corner treatment: " + cornerSelect.options[cornerSelect.selectedIndex].textContent);

      var libraryRadio = document.querySelector('[data-role="library-radio"]:checked');
      var thumbs = document.querySelectorAll('.icon-upload-thumb span');
      lines.push("", "## Bring your own icons", "");
      lines.push("- Library: " + (libraryRadio ? libraryRadio.value : "None selected"));
      lines.push("- Uploaded reference icons: " + (thumbs.length ? Array.prototype.map.call(thumbs, function(s){ return s.textContent; }).join(", ") : "None"));

      markdownOutput.textContent = window.ADSFoundation.preparePageMarkdown(lines.join("\n").trim());
    }
    window.addEventListener('ads:foundation-applied', renderMarkdown);

    function updateMachineViews(){
      if (styleMachineJson){
        styleMachineJson.textContent = JSON.stringify({ $schema: window.ADS_MACHINE_VIEW_SCHEMA, selected: getActiveSystem() }, null, 2);
      }
      if (configMachineJson){
        configMachineJson.textContent = JSON.stringify({
          $schema: window.ADS_MACHINE_VIEW_SCHEMA,
          size: Number(sizeSelect.value),
          stroke: Number(strokeSelect.value),
          corner: cornerSelect.value
        }, null, 2);
      }
      if (byoMachineJson){
        var libraryRadio = document.querySelector('[data-role="library-radio"]:checked');
        var thumbs = document.querySelectorAll('.icon-upload-thumb span');
        byoMachineJson.textContent = JSON.stringify({
          $schema: window.ADS_MACHINE_VIEW_SCHEMA,
          library: libraryRadio ? libraryRadio.value : null,
          uploadedFiles: Array.prototype.map.call(thumbs, function(s){ return s.textContent; })
        }, null, 2);
      }
      renderMarkdown();
    }

    function renderPreview(){
      var mode = getActiveSystem();
      var size = Number(sizeSelect.value);
      var stroke = Number(strokeSelect.value);
      var corner = cornerSelect.value;
      var html;
      if (mode === "isometric"){
        html = ISOMETRIC_SVG.replace(/(width|height)="32"/g, '$1="' + size + '"');
      } else if (mode === "3d"){
        html = THREED_SVG.replace(/(width|height)="32"/g, '$1="' + size + '"');
      } else {
        html = SHAPE_ORDER.map(function(shape){
          return iconSvg(shape, mode, size, stroke, corner);
        }).join("");
      }
      previewRow.innerHTML = html;
      updateMachineViews();
    }

    // Stroke width and corner treatment only ever affect Line/Dashed/
    // Two-tone (confirmed: iconSvg() below never reads either for Flat/
    // Duotone/Isometric/3D) - disabling both the rest of the time means
    // they can't be mistaken for doing something they don't, instead of
    // relying on a prose sentence above them to say so.
    var STROKE_BASED_STYLES = ["line", "dashed", "twotone"];
    function updateStrokeControlsAvailability(key){
      var applies = STROKE_BASED_STYLES.indexOf(key) !== -1;
      strokeSelect.disabled = !applies;
      cornerSelect.disabled = !applies;
      strokeSelect.closest(".type-control").classList.toggle("is-disabled", !applies);
      cornerSelect.closest(".type-control").classList.toggle("is-disabled", !applies);
    }
    function selectSystem(key){
      systemCards.forEach(function(card){
        var active = card.dataset.system === key;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-pressed", active ? "true" : "false");
      });
      updateStrokeControlsAvailability(key);
      renderPreview();
    }

    function getActiveSystem(){
      var active = document.querySelector(".system-card.is-active");
      return active ? active.dataset.system : "duotone";
    }

    // Persists on every real edit (style pick, config change, library
    // pick), not from loadIcons()'s own programmatic restore or Reset -
    // see the same note in grid-layout.js.
    function persistIcons(){
      var libraryRadio = document.querySelector('[data-role="library-radio"]:checked');
      window.ADSStorage.safeSet(SAVE_KEY, {
        system: getActiveSystem(),
        size: sizeSelect.value,
        stroke: strokeSelect.value,
        corner: cornerSelect.value,
        library: libraryRadio ? libraryRadio.value : null,
        uploads: uploads
      });
    }

    systemCards.forEach(function(card){
      card.addEventListener("click", function(e){
        var hit = e.target.closest("button, input, select, textarea, a, [role=combobox]");
        if (hit && hit !== card) return;
        selectSystem(card.dataset.system);
        persistIcons();
      });
    });

    sizeSelect.addEventListener("change", function(){ renderPreview(); persistIcons(); });
    strokeSelect.addEventListener("change", function(){ renderPreview(); persistIcons(); });
    cornerSelect.addEventListener("change", function(){ renderPreview(); persistIcons(); });

    function loadIcons(){
      var saved;
      saved = window.ADSStorage.safeGet(SAVE_KEY);
      if (!saved){ updateStrokeControlsAvailability(getActiveSystem()); renderPreview(); return; }

      if (saved.system) selectSystem(saved.system);
      if (saved.size) sizeSelect.value = saved.size;
      if (saved.stroke) strokeSelect.value = saved.stroke;
      if (saved.corner) cornerSelect.value = saved.corner;
      if (saved.library){
        var radio = document.querySelector('[data-role="library-radio"][value="' + saved.library + '"]');
        if (radio) radio.checked = true;
      }
      uploads = saved.uploads || [];
      renderUploads();

      renderPreview();
      updateMachineViews();
    }
    loadIcons();

    document.querySelectorAll('[data-role="library-radio"]').forEach(function(radio){
      radio.addEventListener("change", function(){ updateMachineViews(); persistIcons(); });
    });

    var saveBtn = document.getElementById("saveIconsBtn");
    var saveStatus = document.getElementById("iconsSaveStatus");
    saveBtn.addEventListener("click", function(){
      persistIcons();

      saveStatus.textContent = window.ADSStorage.lastWriteSucceeded ? "Saved just now" : "Preview only — could not save";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    var resetBtn = document.getElementById("resetIconsBtn");
    resetBtn.addEventListener("click", function(){
      if (!window.ADSStorage.safeRemove(SAVE_KEY)) return;
      uploadGeneration++;
      uploads = [];
      renderUploads();
      uploadLabel.textContent = uploadDefaultLabel;
      sizeSelect.value = "24";
      strokeSelect.value = "1.8";
      cornerSelect.value = "round";
      document.querySelectorAll('[data-role="library-radio"]').forEach(function(r){ r.checked = false; });
      selectSystem("duotone");

      saveStatus.textContent = "Reset to defaults";
      setTimeout(function(){ saveStatus.textContent = ''; }, 2500);
    });

    // ---------- upload reference icons ----------
    function renderUploads(){
      uploadGrid.replaceChildren();
      uploads.forEach(function(file, index){
      var thumb = document.createElement("div");
      thumb.className = "icon-upload-thumb";
      var img = document.createElement("img");
      var generation = uploadGeneration;
      img.onerror = function(){
        if(generation!==uploadGeneration || uploads.indexOf(file)===-1)return;
        uploads.splice(uploads.indexOf(file),1);renderUploads();updateMachineViews();persistIcons();
        uploadLabel.textContent='Could not decode '+file.name+'. Choose a supported image and try again.';
      };
      img.src = file.dataUrl;
      img.alt = file.name;
      var name = document.createElement("span");
      name.textContent = file.name;
      thumb.appendChild(img);
      thumb.appendChild(name);
      var remove = document.createElement('button');
      remove.type = 'button';remove.className = 'icon-upload-thumb-remove';
      remove.textContent = '×';remove.setAttribute('aria-label', 'Remove ' + file.name);
      remove.addEventListener('click', function(){
        uploads.splice(index, 1);renderUploads();updateMachineViews();persistIcons();
        uploadDrop.focus();
      });
      thumb.appendChild(remove);
      uploadGrid.appendChild(thumb);
      });
      uploadLabel.textContent = uploads.length ? uploads.length + ' reference icons. Add more or remove individual files.' : uploadDefaultLabel;
    }

    function handleFiles(files){
      if (!files || !files.length) return;
      var generation = uploadGeneration;
      Array.prototype.forEach.call(files, function(file){
        if (!/image\/(?:png|jpeg|webp|gif|avif|svg\+xml)$/.test(file.type) || file.size > 2000000 || file.name.length > 200){
          uploadLabel.textContent = 'Choose an image up to 2 MB with a filename up to 200 characters.';return;
        }
        var reader = new FileReader();
        reader.onerror = function(){ if(generation === uploadGeneration) uploadLabel.textContent = 'Could not read ' + file.name + '. Try again.'; };
        reader.onload = function(){
          if(generation !== uploadGeneration) return;
          if(uploads.some(function(asset){return asset.dataUrl===reader.result;})) {uploadLabel.textContent='That reference image is already included.';return;}
          var next = uploads.concat({name:file.name, dataUrl:reader.result});
          if(!window.ADSFoundationModel.validRecord(SAVE_KEY, {uploads:next})){
            uploadLabel.textContent = 'Reference limit reached: 10 images and 2.8 MB encoded in total. Remove a file before adding more.';return;
          }
          uploads = next;renderUploads();updateMachineViews();persistIcons();
        };
        reader.readAsDataURL(file);
      });
      uploadInput.value = '';
    }

    uploadDrop.setAttribute('role','button');uploadDrop.tabIndex = 0;
    uploadDrop.setAttribute('aria-label','Add reference icons');
    uploadLabel.setAttribute('role','status');uploadLabel.setAttribute('aria-live','polite');
    uploadDrop.addEventListener("click", function(e){ if(e.target !== uploadInput) {e.preventDefault();uploadInput.click();} });
    uploadDrop.addEventListener('keydown', function(e){if(e.key === 'Enter' || e.key === ' '){e.preventDefault();uploadInput.click();}});
    uploadInput.addEventListener("change", function(){ handleFiles(uploadInput.files); });
    uploadDrop.addEventListener("dragover", function(e){ e.preventDefault(); uploadDrop.classList.add("is-dragover"); });
    uploadDrop.addEventListener("dragleave", function(){ uploadDrop.classList.remove("is-dragover"); });
    uploadDrop.addEventListener("drop", function(e){
      e.preventDefault();
      uploadDrop.classList.remove("is-dragover");
      handleFiles(e.dataTransfer.files);
    });

    var copyMarkdownBtn = document.getElementById("copyIconsMarkdownBtn");
    var markdownStatus = document.getElementById("iconsMarkdownStatus");
    if (copyMarkdownBtn){
      copyMarkdownBtn.addEventListener("click", function(){
        window.ADSFoundation.apply();
        renderMarkdown();
        var text = markdownOutput ? markdownOutput.textContent : "";
        function done(){
          markdownStatus.textContent = "Copied to clipboard";
          setTimeout(function(){ markdownStatus.textContent = ''; }, 2500);
        }
        window.ADSClipboard.copy(text).then(done).catch(function(){
          markdownStatus.textContent = "Copy failed - select the text above and copy manually.";
        });
      });
    }
    var catalogPanel=document.createElement('section');catalogPanel.className='panel';catalogPanel.setAttribute('aria-labelledby','named-icons-title');
    catalogPanel.innerHTML='<h2 class="panel-title" id="named-icons-title">Named action icons</h2><p>Google Material Icons, filled 24px viewBox, Apache-2.0. This action catalog is independent of the illustrative style previews above. Use currentColor, a labelled 44px button target, and mirror only directional icons in RTL.</p><div class="ads-named-icons"></div><pre class="guide-machine-json"><code></code></pre><a href="icon-catalog.json" download>Download icon manifest</a>';
    var names=catalogPanel.querySelector('.ads-named-icons');
    Object.keys(window.ADSFoundationModel.iconCatalog.icons).forEach(function(name){
      var item=document.createElement('span');item.innerHTML=window.ADSFoundationModel.iconMarkup(name,{direction:document.documentElement.dir});item.append(document.createTextNode(' '+name));names.append(item);
    });
    catalogPanel.querySelector('code').textContent='<button type="button" aria-label="Edit project" style="min-width:44px;min-height:44px">\n'+window.ADSFoundationModel.iconMarkup('edit')+'\n</button>\n\n// Directional example:\n'+window.ADSFoundationModel.iconMarkup('chevron-end',{direction:'rtl',label:'Next'});
    document.querySelector('#implementation-contract').before(catalogPanel);
  });
})();
