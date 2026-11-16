(() => {
  "use strict";

  // Reusable checkbox multi-select dropdown component.
  //
  // Accessible pattern: a disclosure trigger <button> (aria-haspopup /
  // aria-expanded / aria-controls) that opens a popover panel containing a
  // native <fieldset><legend> group of real <input type="checkbox"> options,
  // plus a native checkbox for the "All" shortcut whose .indeterminate flag
  // is set via JS for the tri-state visual. Native checkboxes are used
  // (rather than a fully custom role="listbox"/role="option" widget) so
  // every option's checked/unchecked state is announced by screen readers
  // through ordinary checkbox semantics, which is the most reliably
  // supported pattern for a checkable option group. Arrow-key roving focus
  // is layered on top of that native behavior so keyboard users can move
  // between options with the arrow keys in addition to Tab.
  //
  // Usage:
  //   var ms = createMultiSelect({
  //     root: document.querySelector('[data-role="size-mount"]'),
  //     options: [{ value: "36", label: "36px - SM" }, ...],
  //     defaultSelected: ["36"],
  //     ariaLabel: "Size options",
  //     onChange: function(selectedValues){ ... }
  //   });
  //   ms.getSelected(); // -> array of selected values, in option order

  var uidCounter = 0;
  function nextId(prefix){
    uidCounter += 1;
    return prefix + "-" + uidCounter;
  }

  var openInstances = [];

  function createMultiSelect(config){
    var root = config.root;
    var options = config.options || [];
    var onChange = typeof config.onChange === "function" ? config.onChange : function(){};
    var ariaLabel = config.ariaLabel || "Options";
    var defaultSelected = config.defaultSelected || [];

    var selected = {};
    defaultSelected.forEach(function(v){ selected[v] = true; });

    var isOpen = false;
    var triggerId = nextId("ms-trigger");
    var panelId = nextId("ms-panel");
    var legendId = nextId("ms-legend");

    root.classList.add("multiselect");

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "multiselect-trigger";
    trigger.id = triggerId;
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", panelId);
    if (config.labelledBy){
      trigger.setAttribute("aria-labelledby", config.labelledBy + " " + triggerId);
    }

    var triggerLabelEl = document.createElement("span");
    triggerLabelEl.className = "multiselect-trigger-label";

    var triggerCaret = document.createElement("span");
    triggerCaret.className = "multiselect-trigger-caret";
    triggerCaret.setAttribute("aria-hidden", "true");

    trigger.appendChild(triggerLabelEl);
    trigger.appendChild(triggerCaret);

    var panel = document.createElement("div");
    panel.className = "multiselect-panel";
    panel.id = panelId;
    panel.hidden = true;
    // Keep options inside their owning control for native events and saving,
    // while the browser's top layer escapes scrolling inspector clipping.
    if (typeof panel.showPopover === "function") panel.setAttribute("popover", "manual");
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-label", ariaLabel);

    var fieldset = document.createElement("fieldset");
    fieldset.className = "multiselect-fieldset";

    var legend = document.createElement("legend");
    legend.className = "multiselect-sr-only";
    legend.id = legendId;
    legend.textContent = ariaLabel;
    fieldset.appendChild(legend);

    var allRow = document.createElement("label");
    allRow.className = "multiselect-option multiselect-option-all";
    var allInput = document.createElement("input");
    allInput.type = "checkbox";
    var allTextEl = document.createElement("span");
    allTextEl.textContent = "All";
    allRow.appendChild(allInput);
    allRow.appendChild(allTextEl);
    fieldset.appendChild(allRow);

    var divider = document.createElement("div");
    divider.className = "multiselect-divider";
    divider.setAttribute("aria-hidden", "true");
    fieldset.appendChild(divider);

    var optionsWrap = document.createElement("div");
    optionsWrap.className = "multiselect-options";

    var optionRows = options.map(function(opt){
      var row = document.createElement("label");
      row.className = "multiselect-option";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = opt.value;
      input.checked = !!selected[opt.value];
      var textEl = document.createElement("span");
      textEl.textContent = opt.label;
      row.appendChild(input);
      row.appendChild(textEl);
      optionsWrap.appendChild(row);
      return { row: row, input: input, option: opt };
    });

    fieldset.appendChild(optionsWrap);
    panel.appendChild(fieldset);

    root.appendChild(trigger);
    root.appendChild(panel);

    function getSelectedValues(){
      return options.filter(function(opt){ return !!selected[opt.value]; }).map(function(opt){ return opt.value; });
    }

    function refreshRowClasses(){
      optionRows.forEach(function(entry){
        entry.row.classList.toggle("is-selected", !!selected[entry.option.value]);
      });
    }

    function syncAllCheckbox(){
      var total = options.length;
      var count = getSelectedValues().length;
      if (count === 0){
        allInput.checked = false;
        allInput.indeterminate = false;
      } else if (count === total){
        allInput.checked = true;
        allInput.indeterminate = false;
      } else {
        allInput.checked = false;
        allInput.indeterminate = true;
      }
    }

    function computeTriggerText(){
      var total = options.length;
      var count = getSelectedValues().length;
      if (count === 0) return "Select options";
      if (count === total) return "All";
      if (count === 1){
        var match = options.filter(function(opt){ return !!selected[opt.value]; })[0];
        return match ? match.label : "1 selected";
      }
      return count + " selected";
    }

    function updateTriggerLabel(){
      triggerLabelEl.textContent = computeTriggerText();
    }

    function emitChange(){
      onChange(getSelectedValues());
    }

    function refreshAll(){
      refreshRowClasses();
      syncAllCheckbox();
      updateTriggerLabel();
    }

    function selectAll(){
      options.forEach(function(opt){ selected[opt.value] = true; });
      optionRows.forEach(function(entry){ entry.input.checked = true; });
      refreshAll();
      emitChange();
    }

    function deselectAll(){
      selected = {};
      optionRows.forEach(function(entry){ entry.input.checked = false; });
      refreshAll();
      emitChange();
    }

    function getFocusableInputs(){
      return [allInput].concat(optionRows.map(function(entry){ return entry.input; }));
    }

    function positionPanel(){
      if (!isOpen) return;
      if (!trigger.isConnected) return closePanel();
      var anchor = trigger.getBoundingClientRect(), viewport = window.visualViewport;
      var leftEdge = (viewport ? viewport.offsetLeft : 0) + 8;
      var topEdge = (viewport ? viewport.offsetTop : 0) + 8;
      var rightEdge = leftEdge + (viewport ? viewport.width : window.innerWidth) - 16;
      var bottomEdge = topEdge + (viewport ? viewport.height : window.innerHeight) - 16;
      var width = Math.min(Math.max(anchor.width,220),rightEdge-leftEdge);
      panel.style.width = width + "px";
      panel.style.maxHeight = Math.max(0,bottomEdge-topEdge) + "px";
      var below = bottomEdge-anchor.bottom-6, above = anchor.top-topEdge-6;
      var desired = panel.scrollHeight + 2;
      var useAbove = below < Math.min(desired,180) && above > below;
      panel.style.maxHeight = Math.max(0,Math.min(bottomEdge-topEdge,useAbove?above:below)) + "px";
      var height = panel.getBoundingClientRect().height;
      var gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--space-6')) || 6;
      var left = getComputedStyle(trigger).direction === "rtl" ? anchor.right-width : anchor.left;
      panel.style.left = Math.max(leftEdge,Math.min(left,rightEdge-width)) + "px";
      panel.style.top = Math.max(topEdge,Math.min(useAbove?anchor.top-height-gap:anchor.bottom+gap,bottomEdge-height)) + "px";
    }

    function closeOthers(){
      openInstances.slice().forEach(function(inst){
        if (inst !== api) inst.close();
      });
    }

    function openPanel(){
      if (isOpen) return;
      closeOthers();
      isOpen = true;
      panel.hidden = false;
      if (panel.hasAttribute("popover")) panel.showPopover();
      root.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      positionPanel();
      document.addEventListener("click", onDocClick, false);
      document.addEventListener("focusin", onDocClick, false);
      window.addEventListener("resize", positionPanel);
      document.addEventListener("scroll", positionPanel, true);
      window.visualViewport?.addEventListener("resize", positionPanel);
      window.visualViewport?.addEventListener("scroll", positionPanel);
      openInstances.push(api);
      allInput.focus({preventScroll:true});
    }

    function closePanel(){
      if (!isOpen) return;
      isOpen = false;
      if (panel.hasAttribute("popover") && panel.matches(":popover-open")) panel.hidePopover();
      panel.hidden = true;
      root.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      document.removeEventListener("click", onDocClick, false);
      document.removeEventListener("focusin", onDocClick, false);
      window.removeEventListener("resize", positionPanel);
      document.removeEventListener("scroll", positionPanel, true);
      window.visualViewport?.removeEventListener("resize", positionPanel);
      window.visualViewport?.removeEventListener("scroll", positionPanel);
      var idx = openInstances.indexOf(api);
      if (idx !== -1) openInstances.splice(idx, 1);
    }

    function togglePanel(){
      if (isOpen) closePanel(); else openPanel();
    }

    function onDocClick(e){
      if (root.contains(e.target)) return;
      closePanel();
    }

    function onPanelKeydown(e){
      var key = e.key;
      if (key === "Escape"){
        e.preventDefault();
        closePanel();
        trigger.focus();
        return;
      }
      if (key === "ArrowDown" || key === "ArrowUp"){
        e.preventDefault();
        var list = getFocusableInputs();
        var idx = list.indexOf(document.activeElement);
        if (idx === -1) idx = 0;
        var nextIdx = key === "ArrowDown" ? Math.min(idx + 1, list.length - 1) : Math.max(idx - 1, 0);
        list[nextIdx].focus();
        return;
      }
      if (key === "Home"){
        e.preventDefault();
        getFocusableInputs()[0].focus();
        return;
      }
      if (key === "End"){
        e.preventDefault();
        var all = getFocusableInputs();
        all[all.length - 1].focus();
        return;
      }
      if (key === "Enter" && e.target && e.target.type === "checkbox"){
        // Native checkboxes toggle on Space by default but not on Enter -
        // add that explicitly so the spec's "Enter/Space toggles" holds.
        e.preventDefault();
        e.target.checked = !e.target.checked;
        e.target.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    trigger.addEventListener("click", togglePanel);
    trigger.addEventListener("keydown", function(e){
      if (e.key === "Escape" && isOpen){
        e.preventDefault();
        closePanel();
        trigger.focus();
      }
    });
    panel.addEventListener("keydown", onPanelKeydown);

    allInput.addEventListener("change", function(){
      if (allInput.checked) selectAll(); else deselectAll();
    });

    optionRows.forEach(function(entry){
      entry.input.addEventListener("change", function(){
        selected[entry.option.value] = entry.input.checked;
        if (!entry.input.checked) delete selected[entry.option.value];
        refreshAll();
        emitChange();
      });
    });

    refreshAll();

    var api = {
      root: root,
      getSelected: getSelectedValues,
      setSelected: function(values){
        selected = {};
        (values || []).forEach(function(v){ selected[v] = true; });
        optionRows.forEach(function(entry){ entry.input.checked = !!selected[entry.option.value]; });
        refreshAll();
      },
      open: openPanel,
      close: closePanel
    };

    return api;
  }

  window.createMultiSelect = createMultiSelect;
})();
