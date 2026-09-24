(() => {
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Simple inline SVG icon set - viewBox 0 0 24 24, stroke currentColor,
  // stroke-width 2, fill none - same convention as toast-detail.js /
  // alert-detail.js's icon sets.
  var UPLOAD_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17a4 4 0 0 1-.6-7.96A5 5 0 0 1 16 8.5a3.5 3.5 0 0 1 1 6.86"/><polyline points="9 13 12 10 15 13"/><line x1="12" y1="10" x2="12" y2="19"/></svg>';
  var CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
  var ERROR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var TYPES = [
    { key: "dropzone", label: "Dropzone" },
    { key: "button", label: "Button" }
  ];
  var STATES = [
    { key: "empty", label: "Empty" },
    { key: "with-files", label: "With files" },
    { key: "error", label: "Error" },
    { key: "disabled", label: "Disabled" }
  ];

  var FULL_SPEC = {
    dropzone: { purpose: "A large dashed-border drag-and-drop target with a centered upload icon and instructional text - the primary, most discoverable way to add files." },
    button: { purpose: "A compact real button that opens the file picker - a minimal trigger-only variant for tight spaces or forms already crowded with dropzones elsewhere." }
  };

  // Demo file rows shared by both the "with-files" and "disabled" states'
  // file list, and by the "error" state's single row - kept as constants
  // so the Live Preview matrix and Copy code's example stay in sync.
  var DEMO_FILE_COMPLETE = { name: "report.pdf", size: "2.4 MB" };
  var DEMO_FILE_UPLOADING = { name: "diagram.png", size: "890 KB", percent: 55 };
  var DEMO_FILE_ERROR = { name: "video.mp4", error: "Upload failed - file too large" };

  var DEFAULT_LABEL = "Upload files";
  var DEFAULT_HELPER = "PNG, JPG or PDF up to 10MB";

  function getCssVar(name, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return (v || fallback).toUpperCase();
  }

  // Resolved token snapshot used only for the Copy prompt's descriptive
  // color callouts below - the demo markup itself always references the
  // live var(--x) tokens directly (see buildUploadField / buildFullCode),
  // never these resolved values, so it always tracks the active theme.
  function paletteSnapshot(){
    return {
      lineStrong: getCssVar("--line-strong", "rgba(255,255,255,0.16)"),
      green500: getCssVar("--green-500", "#2FBF6E"),
      red500: getCssVar("--red-500", "#FF031A"),
      danger500: getCssVar("--danger-500", "#FF031A")
    };
  }

  function buildFullPrompt(label, helper){
    label = label || DEFAULT_LABEL;
    helper = helper || DEFAULT_HELPER;
    var palette = paletteSnapshot();

    var lines = [];
    lines.push("Create a complete Upload (file upload) component for the Agentic Design System.");
    lines.push("");
    lines.push("Build it as ONE reusable component controlled by properties (type, state, label, helper text) - either a large drag-and-drop dropzone or a compact trigger button for adding files, paired with a file list below it showing each added file's name, size and status (uploading with a progress bar, complete with a checkmark, or failed with an error message and reason).");
    lines.push("");
    lines.push("Types (2):");
    TYPES.forEach(function(t){
      lines.push("- " + t.label + ": " + FULL_SPEC[t.key].purpose);
    });
    lines.push("Dropzone border (every state): 1.5px dashed " + palette.lineStrong + ".");
    lines.push("");
    lines.push("States (4, apply to the control and its file list together):");
    lines.push("- Empty: just the dropzone/button, no file list shown yet.");
    lines.push("- With files: dropzone/button plus a 2-row file list - one complete file with a green checkmark (" + palette.green500 + "), one mid-upload file with a thin progress bar (fill " + palette.red500 + ") and a percentage label.");
    lines.push("- Error: a file list row with a red error icon and short error text (color " + palette.danger500 + ") instead of a progress bar, e.g. \"" + DEMO_FILE_ERROR.error + "\".");
    lines.push("- Disabled: the whole control, including any file list, at 40% opacity and non-interactive.");
    lines.push("");
    lines.push("Component properties: Label (text, default \"" + DEFAULT_LABEL + "\"); Helper text (text, default \"" + DEFAULT_HELPER + "\").");
    lines.push("Current values - Label: \"" + label + "\", Helper text: \"" + helper + "\".");
    return lines.join("\n");
  }

  function buildFullCode(label, helper){
    label = label || DEFAULT_LABEL;
    helper = helper || DEFAULT_HELPER;

    var lines = [];
    lines.push("/* Agentic Design System - Upload (file upload) component */");
    lines.push(".upload-demo-field{ display:flex; flex-direction:column; gap:10px; width:240px; }");
    lines.push("");
    lines.push(".upload-demo-dropzone{ box-sizing:border-box; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; padding:20px 16px; border:1.5px dashed var(--line-strong); border-radius:var(--radius-md); background:var(--graphite-900); text-align:center; }");
    lines.push(".upload-demo-dropzone svg{ width:24px; height:24px; color:var(--text-dim); }");
    lines.push('.upload-demo-dropzone-title{ font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--text-hi); margin:0; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push('.upload-demo-dropzone-helper{ font-family:var(--font-body); font-size:11px; color:var(--text-dim); margin:0; max-width:260px; overflow-wrap:anywhere; }');
    lines.push("");
    lines.push(".upload-demo-trigger-btn{ display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:var(--radius-sm); background:var(--graphite-800); border:1px solid var(--line-strong); color:var(--text-hi); font-family:var(--font-body); font-size:13px; font-weight:600; cursor:pointer; width:fit-content; }");
    lines.push(".upload-demo-trigger-btn:hover{ background:var(--graphite-700); }");
    lines.push(".upload-demo-trigger-btn:disabled{ opacity:0.5; cursor:not-allowed; }");
    lines.push("");
    lines.push(".upload-demo-file-list{ display:flex; flex-direction:column; gap:6px; }");
    lines.push(".upload-demo-file-row{ box-sizing:border-box; display:flex; align-items:center; gap:8px; padding:8px 10px; background:var(--graphite-800); border:1px solid var(--line-strong); border-radius:var(--radius-sm); }");
    lines.push(".upload-demo-file-info{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:3px; }");
    lines.push('.upload-demo-file-name{ font-family:var(--font-body); font-size:12px; font-weight:500; color:var(--text-hi); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }');
    lines.push('.upload-demo-file-size{ font-family:var(--font-body); font-size:11px; color:var(--text-dim); }');
    lines.push(".upload-demo-file-status{ flex:none; width:16px; height:16px; }");
    lines.push(".upload-demo-file-row.is-complete .upload-demo-file-status{ color:var(--green-500); }");
    lines.push(".upload-demo-file-row.is-error .upload-demo-file-status{ color:var(--danger-500); }");
    lines.push(".upload-demo-file-progress{ width:100%; height:4px; background:var(--graphite-700); border-radius:9999px; overflow:hidden; margin-top:2px; }");
    lines.push(".upload-demo-file-progress-fill{ height:100%; background:var(--red-500); }");
    lines.push('.upload-demo-file-error-text{ font-family:var(--font-body); font-size:11px; color:var(--danger-500); margin-top:2px; }');
    lines.push("");
    lines.push("/* Disabled - applies to the whole control, dropzone/button and file list together */");
    lines.push(".upload-demo-field.is-disabled{ opacity:0.4; pointer-events:none; }");
    lines.push("");
    lines.push("<!-- Example usage - Dropzone type, With files state -->");
    lines.push('<div class="upload-demo-field">');
    lines.push('  <div class="upload-demo-dropzone">');
    lines.push("    " + UPLOAD_ICON);
    lines.push('    <p class="upload-demo-dropzone-title">' + escapeHtml(label) + "</p>");
    lines.push('    <p class="upload-demo-dropzone-helper">' + escapeHtml(helper) + "</p>");
    lines.push("  </div>");
    lines.push('  <div class="upload-demo-file-list">');
    lines.push('    <div class="upload-demo-file-row is-complete">');
    lines.push('      <div class="upload-demo-file-info">');
    lines.push('        <span class="upload-demo-file-name">' + DEMO_FILE_COMPLETE.name + "</span>");
    lines.push('        <span class="upload-demo-file-size">' + DEMO_FILE_COMPLETE.size + "</span>");
    lines.push("      </div>");
    lines.push('      <span class="upload-demo-file-status">' + CHECK_ICON + "</span>");
    lines.push("    </div>");
    lines.push('    <div class="upload-demo-file-row is-uploading">');
    lines.push('      <div class="upload-demo-file-info">');
    lines.push('        <span class="upload-demo-file-name">' + DEMO_FILE_UPLOADING.name + "</span>");
    lines.push('        <span class="upload-demo-file-size">' + DEMO_FILE_UPLOADING.size + "</span>");
    lines.push('        <div class="upload-demo-file-progress"><div class="upload-demo-file-progress-fill" style="width:' + DEMO_FILE_UPLOADING.percent + '%;"></div></div>');
    lines.push("      </div>");
    lines.push('      <span class="upload-demo-file-status">' + DEMO_FILE_UPLOADING.percent + "%</span>");
    lines.push("    </div>");
    lines.push("  </div>");
    lines.push("</div>");
    lines.push("");
    lines.push("<!-- Example usage - Button type, Empty state -->");
    lines.push('<div class="upload-demo-field">');
    lines.push('  <p class="upload-demo-dropzone-title">' + escapeHtml(label) + "</p>");
    lines.push('  <button type="button" class="upload-demo-trigger-btn">' + UPLOAD_ICON + "<span>Upload file</span></button>");
    lines.push('  <p class="upload-demo-dropzone-helper">' + escapeHtml(helper) + "</p>");
    lines.push("</div>");
    return lines.join("\n");
  }

  // Renders one Upload demo (dropzone/button + optional file list) for a
  // given type/state combination - used by the Live Preview matrix only.
  // buildFullCode above reconstructs its own formatted example separately,
  // matching group-button-detail.js / toast-detail.js's convention.
  function buildUploadField(typeKey, stateKey, label, helper){
    var isDisabled = stateKey === "disabled";
    var fieldCls = "upload-demo-field" + (isDisabled ? " is-disabled" : "");

    var controlHtml;
    if (typeKey === "dropzone"){
      controlHtml = '<div class="upload-demo-dropzone">' + UPLOAD_ICON +
        '<p class="upload-demo-dropzone-title">' + escapeHtml(label) + "</p>" +
        '<p class="upload-demo-dropzone-helper">' + escapeHtml(helper) + "</p>" +
        "</div>";
    } else {
      var disabledAttr = isDisabled ? " disabled" : "";
      controlHtml = '<p class="upload-demo-dropzone-title">' + escapeHtml(label) + "</p>" +
        '<button type="button" class="upload-demo-trigger-btn" tabindex="-1"' + disabledAttr + '><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:14px;height:14px;"><path d="M7 17a4 4 0 0 1-.6-7.96A5 5 0 0 1 16 8.5a3.5 3.5 0 0 1 1 6.86"/><polyline points="9 13 12 10 15 13"/><line x1="12" y1="10" x2="12" y2="19"/></svg><span>Upload file</span></button>' +
        '<p class="upload-demo-dropzone-helper">' + escapeHtml(helper) + "</p>";
    }

    var fileListHtml = "";
    if (stateKey === "with-files" || stateKey === "disabled"){
      fileListHtml = '<div class="upload-demo-file-list">' +
        '<div class="upload-demo-file-row is-complete">' +
          '<div class="upload-demo-file-info">' +
            '<span class="upload-demo-file-name">' + DEMO_FILE_COMPLETE.name + "</span>" +
            '<span class="upload-demo-file-size">' + DEMO_FILE_COMPLETE.size + "</span>" +
          "</div>" +
          '<span class="upload-demo-file-status">' + CHECK_ICON + "</span>" +
        "</div>" +
        '<div class="upload-demo-file-row is-uploading">' +
          '<div class="upload-demo-file-info">' +
            '<span class="upload-demo-file-name">' + DEMO_FILE_UPLOADING.name + "</span>" +
            '<span class="upload-demo-file-size">' + DEMO_FILE_UPLOADING.size + "</span>" +
            '<div class="upload-demo-file-progress"><div class="upload-demo-file-progress-fill" style="width:' + DEMO_FILE_UPLOADING.percent + '%;"></div></div>' +
          "</div>" +
          '<span class="upload-demo-file-status" style="width:auto;height:auto;font-family:var(--font-mono);font-size:10px;color:var(--text-dim);">' + DEMO_FILE_UPLOADING.percent + "%</span>" +
        "</div>" +
      "</div>";
    } else if (stateKey === "error"){
      fileListHtml = '<div class="upload-demo-file-list">' +
        '<div class="upload-demo-file-row is-error">' +
          '<div class="upload-demo-file-info">' +
            '<span class="upload-demo-file-name">' + DEMO_FILE_ERROR.name + "</span>" +
            '<span class="upload-demo-file-error-text">' + DEMO_FILE_ERROR.error + "</span>" +
          "</div>" +
          '<span class="upload-demo-file-status">' + ERROR_ICON + "</span>" +
        "</div>" +
      "</div>";
    }

    return '<div class="' + fieldCls + '">' + controlHtml + fileListHtml + "</div>";
  }

  document.addEventListener("DOMContentLoaded", function(){
    function copyTextFull(text, btn){
      var originalLabel = btn.textContent;
      function done(){
        btn.textContent = "Copied!";
        setTimeout(function(){ btn.textContent = originalLabel; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done).catch(function(){
          fallbackCopyFull(text);
          done();
        });
      } else {
        fallbackCopyFull(text);
        done();
      }
    }

    function fallbackCopyFull(text){
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand("copy"); }catch(e){}
      document.body.removeChild(ta);
    }

    // Gallery-card copy CTA + click-to-navigate (upload.html's listing
    // card) - separate data-role from every other system's own copy roles
    // so no script's wiring ever touches another's buttons.
    var cardCopyPromptBtn = document.querySelector('[data-role="copy-prompt-upload"]');
    var cardCopyCodeBtn = document.querySelector('[data-role="copy-code-upload"]');
    if (cardCopyPromptBtn){
      cardCopyPromptBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullPrompt(), cardCopyPromptBtn);
      });
    }
    if (cardCopyCodeBtn){
      cardCopyCodeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        copyTextFull(buildFullCode(), cardCopyCodeBtn);
      });
    }
    var uploadTypeCards = document.querySelectorAll(".upload-type-card[data-system]");
    uploadTypeCards.forEach(function(card){
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      var href = "upload-" + card.dataset.system + ".html";
      card.addEventListener("click", function(){ window.location.href = href; });
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){
          e.preventDefault();
          window.location.href = href;
        }
      });
    });

    // Renders a plain Copy prompt/Copy code button - Upload has no
    // multiselect-driven properties (just plain Label/Helper text inputs),
    // so there is never more than one combination in play and the
    // disclosure-dropdown branch of buildCopyControl is simply unreachable
    // here (combos is always passed empty), matching Divider/Tooltip.
    function buildCopyControl(container, plainLabel, buildSingle, combos, buildCombo){
      if (!container) return;
      if (container._copyDropdownCleanup){
        container._copyDropdownCleanup();
        container._copyDropdownCleanup = null;
      }

      if (combos.length <= 1){
        container.innerHTML = '<button type="button" class="btn btn-ghost btn-sm">' + plainLabel + "</button>";
        var plainBtn = container.querySelector("button");
        plainBtn.addEventListener("click", function(){ copyTextFull(buildSingle(), plainBtn); });
        return;
      }

      var itemsHtml = combos.map(function(c, i){
        return '<div class="copy-dropdown-item">' +
          '<span class="copy-dropdown-item-label">' + c.label + "</span>" +
          '<button type="button" class="btn btn-ghost btn-sm copy-dropdown-item-copy" data-combo-index="' + i + '">Copy</button>' +
          "</div>";
      }).join("");

      container.innerHTML =
        '<div class="copy-dropdown">' +
          '<button type="button" class="btn btn-ghost btn-sm copy-dropdown-trigger" aria-haspopup="true" aria-expanded="false">' +
            plainLabel + ' <span class="copy-dropdown-caret" aria-hidden="true"></span>' +
          "</button>" +
          '<div class="copy-dropdown-panel" hidden>' + itemsHtml + "</div>" +
        "</div>";

      var trigger = container.querySelector(".copy-dropdown-trigger");
      var panel = container.querySelector(".copy-dropdown-panel");

      function onDocClick(e){
        if (container.contains(e.target)) return;
        closePanel();
      }
      function onKeydown(e){
        if (e.key === "Escape"){ closePanel(); trigger.focus(); }
      }
      function closePanel(){
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        document.removeEventListener("click", onDocClick, false);
        document.removeEventListener("keydown", onKeydown, false);
      }
      function openPanel(){
        panel.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        document.addEventListener("click", onDocClick, false);
        document.addEventListener("keydown", onKeydown, false);
      }

      trigger.addEventListener("click", function(){
        if (panel.hidden) openPanel(); else closePanel();
      });

      combos.forEach(function(c, i){
        var copyBtn = panel.querySelector('[data-combo-index="' + i + '"]');
        copyBtn.addEventListener("click", function(e){
          e.stopPropagation();
          copyTextFull(buildCombo(c), copyBtn);
        });
      });

      container._copyDropdownCleanup = closePanel;
    }

    var matrixContainer = document.querySelector('[data-role="upload-matrix-container"]');
    if (!matrixContainer) return;

    var labelInput = document.querySelector('[data-role="upload-label"]');
    var helperInput = document.querySelector('[data-role="upload-helper"]');
    var copyPromptContainer = document.querySelector('[data-role="copy-prompt-action"]');
    var copyCodeContainer = document.querySelector('[data-role="copy-code-action"]');

    // Upload has no multiselect-driven properties, so render() builds ONE
    // matrix directly (TYPES x STATES, 2x4 = 8 cells) - no combos array,
    // same simplified shape as Divider/Tooltip's detail scripts.
    function render(){
      var label = labelInput ? (labelInput.value.trim() || DEFAULT_LABEL) : DEFAULT_LABEL;
      var helper = helperInput ? (helperInput.value.trim() || DEFAULT_HELPER) : DEFAULT_HELPER;

      var rows = STATES.map(function(state){
        var cells = TYPES.map(function(t){
          return '<td class="button-matrix-cell">' + buildUploadField(t.key, state.key, label, helper) + "</td>";
        }).join("");
        return "<tr><th class=\"button-matrix-rowhead\">" + state.label + "</th>" + cells + "</tr>";
      }).join("");
      var headCells = TYPES.map(function(t){ return '<th class="button-matrix-colhead">' + t.label + "</th>"; }).join("");
      matrixContainer.innerHTML = '<div class="button-matrix-combo">' +
        '<table class="button-matrix"><thead><tr><th class="button-matrix-rowhead"></th>' + headCells + "</tr></thead>" +
        "<tbody>" + rows + "</tbody></table></div>";

      buildCopyControl(copyPromptContainer, "Copy prompt", function(){ return buildFullPrompt(label, helper); }, [], function(){});
      buildCopyControl(copyCodeContainer, "Copy code", function(){ return buildFullCode(label, helper); }, [], function(){});
    }

    if (labelInput){
      labelInput.addEventListener("input", render);
    }
    if (helperInput){
      helperInput.addEventListener("input", render);
    }

    render();
  });
})();
