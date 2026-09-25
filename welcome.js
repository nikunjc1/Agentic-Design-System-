(() => {
  "use strict";

  var SEEN_KEY = "ads:welcome-seen";
  function readPreference(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function writePreference(key, value) { try { localStorage.setItem(key, value); } catch {} }

  document.addEventListener("DOMContentLoaded", function(){
    var overlay = document.querySelector('[data-role="welcome-overlay"]');
    if (!overlay) return;
    // Every path out of this modal (choosing a path, closing via Escape,
    // closing via backdrop click) was re-running on every single visit to
    // Overview - there was nothing recording that the visitor had already
    // seen and dismissed it once. Skipping openModal() below when this flag
    // is already set fixes that, while leaving Escape/backdrop-click (which
    // already worked - closeModal() is already wired to both) untouched.
    if (readPreference(SEEN_KEY) === "1") return;

    var modal = overlay.querySelector('[data-role="welcome-modal"]');
    var stepChoice = overlay.querySelector('[data-role="welcome-step-choice"]');
    var stepForm = overlay.querySelector('[data-role="welcome-step-form"]');
    var chooseOldBtn = overlay.querySelector('[data-role="welcome-choose-old"]');
    var chooseNewBtn = overlay.querySelector('[data-role="welcome-choose-new"]');
    var backBtn = overlay.querySelector('[data-role="welcome-back"]');
    var nameInput = overlay.querySelector('[data-role="welcome-name"]');
    var designationInput = overlay.querySelector('[data-role="welcome-designation"]');
    var emailInput = overlay.querySelector('[data-role="welcome-email"]');
    var portalTrigger = overlay.querySelector('[data-role="welcome-portal-type-trigger"]');
    var portalValueEl = overlay.querySelector('[data-role="welcome-portal-type-value"]');
    var portalPanel = overlay.querySelector('[data-role="welcome-portal-type-panel"]');
    var portalOptions = Array.prototype.slice.call(portalPanel.querySelectorAll(".select-demo-option"));
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
      writePreference(SEEN_KEY, "1");
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
        modal.querySelectorAll('button, input, select, a[href], [role="combobox"]'),
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

    // Portal type - a real interactive combobox + listbox pair built on the
    // Select component's own visual classes. There was no existing open/
    // close/choose behavior to reuse here: select-detail.js's Live Preview
    // matrix only ever renders each state (default/filled/open/...) as a
    // separate static markup string, picked by the page's own property
    // controls - it never wires up a click on the control itself to
    // actually open anything. This is genuinely new code, following the
    // standard combobox pattern (focus stays on the trigger; the
    // highlighted option is tracked via aria-activedescendant, not real
    // DOM focus, matching how a native <select>'s own listbox behaves).
    portalOptions.forEach(function(opt, i){ if (!opt.id) opt.id = "welcomePortalOption" + i; });
    var portalHighlightIndex = -1;

    function portalSelectedIndex(){
      return portalOptions.findIndex(function(opt){ return opt.classList.contains("is-selected"); });
    }
    function portalCurrentValue(){
      var opt = portalOptions[portalSelectedIndex()];
      return opt ? opt.dataset.value : "";
    }
    function setPortalHighlight(index){
      portalHighlightIndex = index;
      portalOptions.forEach(function(opt, i){ opt.classList.toggle("is-highlighted", i === index); });
      var opt = portalOptions[index];
      if (opt){
        portalTrigger.setAttribute("aria-activedescendant", opt.id);
        opt.scrollIntoView({ block: "nearest" });
      }
    }
    function selectPortalOption(index){
      var opt = portalOptions[index];
      if (!opt) return;
      portalOptions.forEach(function(o){
        o.classList.remove("is-selected");
        o.setAttribute("aria-selected", "false");
      });
      opt.classList.add("is-selected");
      opt.setAttribute("aria-selected", "true");
      portalValueEl.textContent = opt.textContent;
    }
    function onPortalDocClick(e){
      if (portalTrigger.contains(e.target) || portalPanel.contains(e.target)) return;
      closePortalPanel();
    }
    function openPortalPanel(){
      portalPanel.hidden = false;
      portalTrigger.setAttribute("aria-expanded", "true");
      setPortalHighlight(portalSelectedIndex());
      document.addEventListener("click", onPortalDocClick, false);
    }
    function closePortalPanel(){
      portalPanel.hidden = true;
      portalTrigger.setAttribute("aria-expanded", "false");
      portalTrigger.removeAttribute("aria-activedescendant");
      portalOptions.forEach(function(o){ o.classList.remove("is-highlighted"); });
      portalHighlightIndex = -1;
      document.removeEventListener("click", onPortalDocClick, false);
    }

    portalTrigger.addEventListener("click", function(){
      if (portalPanel.hidden) openPortalPanel(); else closePortalPanel();
    });
    portalTrigger.addEventListener("keydown", function(e){
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        if (portalPanel.hidden){ openPortalPanel(); }
        else { selectPortalOption(portalHighlightIndex >= 0 ? portalHighlightIndex : portalSelectedIndex()); closePortalPanel(); }
      } else if (e.key === "ArrowDown"){
        e.preventDefault();
        if (portalPanel.hidden) openPortalPanel();
        else setPortalHighlight(Math.min(portalHighlightIndex + 1, portalOptions.length - 1));
      } else if (e.key === "ArrowUp"){
        e.preventDefault();
        if (portalPanel.hidden) openPortalPanel();
        else setPortalHighlight(Math.max(portalHighlightIndex - 1, 0));
      } else if (e.key === "Escape" && !portalPanel.hidden){
        // Close just the panel, not the whole modal - stopPropagation keeps
        // this from also reaching the document-level Escape-closes-modal
        // handler registered below.
        e.preventDefault();
        e.stopPropagation();
        closePortalPanel();
      }
    });
    portalOptions.forEach(function(opt, i){
      opt.addEventListener("click", function(){
        selectPortalOption(i);
        closePortalPanel();
        portalTrigger.focus();
      });
      opt.addEventListener("mouseenter", function(){ setPortalHighlight(i); });
    });

    function fieldsFilled(){
      return Boolean(nameInput.value.trim() && emailInput.value.trim());
    }

    function currentFields(){
      return {
        name: nameInput.value.trim(),
        designation: designationInput.value.trim() || "Not specified",
        email: emailInput.value.trim(),
        portalType: portalCurrentValue()
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
