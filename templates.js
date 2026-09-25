(() => {
  "use strict";

  // Templates previously had no way to get a prompt or working code out of
  // them at all - every other section (down to a single-type component
  // like Alert) has "Copy prompt"/"Copy code" on its own illustration, so
  // this was the one structural gap flagged against the rest of the
  // portal. Reads each template's own title/description/"Built from" text
  // and its demo markup straight from the DOM rather than duplicating that
  // content into this file - the two can never drift out of sync, and the
  // "code" handed out is always exactly what's actually on the page.

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

  // Demo markup uses "readonly tabindex=-1" throughout so nothing in these
  // static illustrations is tab-stoppable or editable - real usage
  // shouldn't carry either, so both are stripped from the copied code.
  function cleanCode(html){
    return html
      .replace(/\s*readonly=""/g, "")
      .replace(/\s*readonly(?=[\s>])/g, "")
      .replace(/\s*tabindex="-1"/g, "")
      .trim();
  }

  document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll("[data-role^='template-demo-']").forEach(function(demo){
      var slug = demo.getAttribute("data-role").replace("template-demo-", "");
      var section = demo.closest("section");
      if (!section) return;

      var promptBtn = section.querySelector('[data-role="copy-prompt-' + slug + '"]');
      var codeBtn = section.querySelector('[data-role="copy-code-' + slug + '"]');
      var name = (section.querySelector(".panel-title") || {}).textContent || "";
      var description = (section.querySelector(".get-library-copy") || {}).textContent || "";
      var builtFrom = ((section.querySelector(".guide-dodont-note") || {}).textContent || "").replace(/^Built from:\s*/, "");

      if (promptBtn){
        promptBtn.addEventListener("click", function(){
          var lines = [];
          lines.push("Create a \"" + name + "\" template (a whole screen shape) for the Agentic Design System.");
          lines.push("");
          lines.push(description);
          lines.push("");
          lines.push("Built from: " + builtFrom + ".");
          lines.push("Use this system's own components and design tokens (color, spacing, radius, typography) for every piece - never arbitrary one-off values, since this template's whole point is assembling already-documented patterns and components instead of rebuilding an equivalent screen from scratch.");
          copyTextFull(lines.join("\n"), promptBtn);
        });
      }
      if (codeBtn){
        codeBtn.addEventListener("click", function(){
          var lines = [];
          lines.push("<!-- Agentic Design System - \"" + name + "\" template -->");
          lines.push("<!-- Built from: " + builtFrom + ". Requires this portal's shell.css for every class used below. -->");
          lines.push(cleanCode(demo.innerHTML));
          copyTextFull(lines.join("\n"), codeBtn);
        });
      }
    });
  });
})();
