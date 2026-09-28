(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    var demo = document.querySelector('[data-role="agent-demo"]');
    if (!demo) return;

    var actions = demo.querySelector('[data-role="agent-actions"]');
    var result = demo.querySelector('[data-role="agent-result"]');
    var resultText = demo.querySelector('[data-role="agent-result-text"]');
    var undoLink = demo.querySelector('[data-role="agent-undo"]');
    var approveBtn = demo.querySelector('[data-role="agent-approve"]');
    var rejectBtn = demo.querySelector('[data-role="agent-reject"]');

    function showResult(kind, text){
      actions.hidden = true;
      result.hidden = false;
      result.classList.remove("ai-agent-status--success", "ai-agent-status--failure");
      result.classList.add(kind === "approved" ? "ai-agent-status--success" : "ai-agent-status--failure");
      resultText.textContent = text;
    }

    approveBtn.addEventListener("click", function(){
      showResult("approved", "Approved - suggestion applied.");
    });
    rejectBtn.addEventListener("click", function(){
      showResult("rejected", "Rejected - suggestion discarded.");
    });
    undoLink.addEventListener("click", function(e){
      e.preventDefault();
      result.hidden = true;
      actions.hidden = false;
    });
  });
})();
