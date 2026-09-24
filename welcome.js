(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    var overlay = document.querySelector('[data-role="welcome-overlay"]');
    if (!overlay) return;

    var modal = overlay.querySelector('[data-role="welcome-modal"]');
    var stepChoice = overlay.querySelector('[data-role="welcome-step-choice"]');
    var stepForm = overlay.querySelector('[data-role="welcome-step-form"]');
    var chooseOldBtn = overlay.querySelector('[data-role="welcome-choose-old"]');
    var chooseNewBtn = overlay.querySelector('[data-role="welcome-choose-new"]');
    var backBtn = overlay.querySelector('[data-role="welcome-back"]');
    var nameInput = overlay.querySelector('[data-role="welcome-name"]');
    var designationInput = overlay.querySelector('[data-role="welcome-designation"]');
    var emailInput = overlay.querySelector('[data-role="welcome-email"]');
    var portalTypeSelect = overlay.querySelector('[data-role="welcome-portal-type"]');
    var copyLinkBtn = overlay.querySelector('[data-role="welcome-copy-link"]');
    var exportMdBtn = overlay.querySelector('[data-role="welcome-export-md"]');
    var continueBtn = overlay.querySelector('[data-role="welcome-continue-foundations"]');
    var statusEl = overlay.querySelector('[data-role="welcome-status"]');
    var statusTimer = null;
    var lastFocused = null;

    function openModal(){
      lastFocused = document.activeElement;
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      chooseNewBtn.focus();
    }
    function closeModal(){
      overlay.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    function showChoiceStep(){
      stepChoice.hidden = false;
      stepForm.hidden = true;
      chooseNewBtn.focus();
    }
    function showFormStep(){
      stepChoice.hidden = true;
      stepForm.hidden = false;
      nameInput.focus();
    }

    chooseOldBtn.addEventListener("click", function(){
      // Just closing here left the user staring at the exact same Overview
      // page underneath, with no visible sign the click did anything - it
      // needs to take them somewhere, same as the New path does. Components
      // is the actual substance of an existing design system, so that's
      // where "continue where I left off" means in this portal.
      closeModal();
      location.href = "components.html";
    });
    chooseNewBtn.addEventListener("click", showFormStep);
    backBtn.addEventListener("click", showChoiceStep);

    // Backdrop click and Escape both dismiss, matching every other overlay
    // in this portal (Modal component's own documented behavior).
    overlay.addEventListener("click", function(e){
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && !overlay.hidden) closeModal();
    });

    // Minimal focus trap - Tab/Shift+Tab cycle within whichever step is
    // currently visible, never escaping to the page behind the overlay.
    modal.addEventListener("keydown", function(e){
      if (e.key !== "Tab") return;
      var focusables = Array.prototype.filter.call(
        modal.querySelectorAll("button, input, select, a[href]"),
        function(el){ return el.offsetParent !== null; }
      );
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first){
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last){
        e.preventDefault();
        first.focus();
      }
    });

    function fieldsFilled(){
      return Boolean(nameInput.value.trim() && emailInput.value.trim());
    }

    function currentFields(){
      return {
        name: nameInput.value.trim(),
        designation: designationInput.value.trim() || "Not specified",
        email: emailInput.value.trim(),
        portalType: portalTypeSelect.value
      };
    }

    function setStatus(text){
      statusEl.textContent = text;
      if (statusTimer) clearTimeout(statusTimer);
      if (text){
        statusTimer = setTimeout(function(){ statusEl.textContent = ""; }, 4000);
      }
    }

    copyLinkBtn.addEventListener("click", function(){
      if (!fieldsFilled()){
        setStatus("Add your name and email first.");
        nameInput.focus();
        return;
      }
      var f = currentFields();
      var params = new URLSearchParams({
        name: f.name,
        designation: f.designation,
        email: f.email,
        portalType: f.portalType
      });
      var basePath = location.pathname.replace(/[^/]*$/, "");
      var link = location.origin + basePath + "new-project.html?" + params.toString();

      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(link).then(
          function(){ setStatus("Link copied to clipboard."); },
          function(){ setStatus("Couldn't copy automatically - link: " + link); }
        );
      } else {
        setStatus("Clipboard unavailable - link: " + link);
      }
    });

    function buildMarkdown(f){
      var lines = [];
      lines.push("---");
      lines.push("name: " + f.name);
      lines.push("designation: " + f.designation);
      lines.push("email: " + f.email);
      lines.push("portal_type: " + f.portalType);
      lines.push("generated: " + new Date().toISOString());
      lines.push("generated_by: Agentic Design System");
      lines.push("---");
      lines.push("");
      lines.push("# " + f.name + "'s Agentic Design System project");
      lines.push("");
      lines.push("- **Designation:** " + f.designation);
      lines.push("- **Email:** " + f.email);
      lines.push("- **Portal type:** " + f.portalType);
      lines.push("");
      lines.push("## Next step");
      lines.push("");
      lines.push("This file only captures what was entered above - it isn't saved anywhere in the portal yet. Open **Foundations · Colors**, choose a brand color, and click **Save brand** there - that's this portal's real, working source of truth for everything else generated from it.");
      return lines.join("\n");
    }

    exportMdBtn.addEventListener("click", function(){
      if (!fieldsFilled()){
        setStatus("Add your name and email first.");
        nameInput.focus();
        return;
      }
      var f = currentFields();
      var md = buildMarkdown(f);
      var blob = new Blob([md], { type: "text/markdown" });
      var url = URL.createObjectURL(blob);
      var slug = f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "project";
      var a = document.createElement("a");
      a.href = url;
      a.download = slug + "-agentic-design-system.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus("Markdown file downloaded.");
    });

    continueBtn.addEventListener("click", function(){
      closeModal();
      location.href = "foundations.html#colors";
    });

    openModal();
  });
})();
