// Run through agent-browser eval --stdin on the local preview origin.
// Each page is rendered at desktop and mobile widths, including guide toggles.
window.damcoAudit = {running:true, results:[], error:null};
(async () => {
  const pages = await (await fetch('docs-catalog.json')).json();
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;height:900px;border:0';
  document.body.append(frame);
  try {
    for (const doc of pages) {
      for (const width of [1440,768,390,320]) {
        frame.style.width = width + 'px';
        const start = performance.now();
        await new Promise((resolve,reject) => {
          const timeout = setTimeout(() => reject(new Error('Timeout: ' + doc.file)),15000);
          frame.onload = () => { clearTimeout(timeout); resolve(); };
          frame.src = doc.file;
        });
        await new Promise(r => setTimeout(r,80));
        const d = frame.contentDocument, w = frame.contentWindow;
        const main = d.querySelector('main');
        const errors = [];
        if (!main || !main.textContent.trim()) errors.push('Missing content');
        if (d.querySelectorAll('h1').length !== 1) errors.push('Primary heading count');
        if (d.documentElement.scrollWidth > width + 2) errors.push('Document overflow: ' + d.documentElement.scrollWidth);
        if (main && main.scrollWidth > main.clientWidth + 2) errors.push('Main overflow: ' + main.scrollWidth + '/' + main.clientWidth);
        let toggles = 0;
        for (const guide of d.querySelectorAll('.component-guide')) {
          for (const button of guide.querySelectorAll('.guide-toggle-btn')) {
            button.click();
            const panel = Array.from(guide.querySelectorAll('.guide-view-panel')).find(p => p.dataset.viewPanel === button.dataset.view);
            if (!panel || panel.hidden || button.getAttribute('aria-pressed') !== 'true') errors.push('Guide toggle failed: ' + button.textContent.trim());
            toggles++;
          }
        }
        const offenders = Array.from(main?.querySelectorAll('*') || []).filter(n => {
          const rect = n.getBoundingClientRect();
          if (!rect.width || rect.right <= width + 2) return false;
          let parent = n.parentElement;
          while (parent && parent !== main) { if (['auto','scroll','hidden'].includes(w.getComputedStyle(parent).overflowX)) return false; parent = parent.parentElement; }
          return true;
        }).slice(0,8).map(n => ({tag:n.tagName,cls:n.className,width:Math.round(n.getBoundingClientRect().width)}));
        window.damcoAudit.results.push({file:doc.file,width,errors,offenders,toggles,loadMs:Math.round(performance.now()-start),nodes:d.querySelectorAll('*').length});
      }
    }
  } catch (e) { window.damcoAudit.error = e.message; }
  finally { frame.remove(); window.damcoAudit.running = false; }
})();
'Page audit started';
