(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("exportComponentGroups");
    const status = document.getElementById("figmaExportStatus");
    const summary = document.getElementById("figmaExportSummary");
    const button = document.getElementById("startFigmaExport");

    // Opened directly as a file:// link (double-clicked, a bookmark, browser
    // history from before), every capture this export needs is guaranteed
    // to fail with the browser's own cross-origin error - telling the user
    // after they click Start and wait is a worse experience than telling
    // them up front, with a real clickable link to the one address that
    // actually works (the bridge server, which serves this exact page too).
    if (location.protocol === "file:") {
      const notice = document.getElementById("figmaExportFileProtocolNotice");
      const correctLink = document.getElementById("figmaExportCorrectLink");
      const port = (window.ADSFigmaBridge && window.ADSFigmaBridge.port) || 3333;
      if (correctLink) correctLink.href = "http://127.0.0.1:" + port + "/md-export.html?format=figma";
      if (notice) notice.hidden = false;
      if (button) {
        button.disabled = true;
        button.title = "Open this page through the bridge server first (see the notice above) - exporting cannot work from a file:// page.";
      }
    }

    if (!container || !button) return;

    const manifest = window.ADSComponentManifest.buildCatalogManifest(window.ADSDocsCatalog || []);
    let exporting = false;
    const connection = document.getElementById('figmaBridgeStatus');
    const retry = document.getElementById('checkFigmaConnection');
    async function checkConnection() {
      if (location.protocol === 'file:') {
        connection.textContent = 'Open the bridge link above to connect to Figma.';
        retry.disabled = true;
        return false;
      }
      retry.disabled = true;
      connection.textContent = 'Checking the bridge…';
      try {
        const response = await fetch('http://127.0.0.1:' + window.ADSFigmaBridge.port + '/bridge/status', {signal:AbortSignal.timeout(5000),cache:'no-store'});
        if (!response.ok) throw new Error('Bridge unavailable');
        const state = await response.json();
        if (state.protocolVersion !== 2 || state.project !== 'Agentic Design System 2') throw new Error('Wrong bridge');
        connection.textContent = state.connected ? 'Agentic Contract Bridge is connected. Ready to export.' : 'Bridge is running. Open Agentic Contract Bridge in Figma and connect.';
        return state.connected === true;
      } catch {
        connection.textContent = 'Cannot reach the local bridge. Start it, then check the connection again.';
        return false;
      } finally { retry.disabled = false; }
    }
    retry.addEventListener('click', checkConnection);
    document.addEventListener('ads:export-format', event => { if(event.detail === 'figma' && !exporting) checkConnection(); });
    if (new URLSearchParams(location.search).get('format') === 'figma') checkConnection();

    function setStatus(message, tone) {
      status.textContent = message;
      status.classList.toggle("is-error", tone === "error");
      status.classList.toggle("is-success", tone === "success");
    }

    function renderSummary(result) {
      summary.hidden = false;
      summary.innerHTML = "";
      const heading = document.createElement("p");
      heading.textContent = `${result.pushed} of ${result.total} components exported.` + (result.failed ? ` ${result.failed} failed.` : "");
      summary.append(heading);
      if (result.warnings && result.warnings.length) {
        const list = document.createElement("ul");
        list.className = "guide-list";
        for (const warning of result.warnings) {
          const li = document.createElement("li"); li.textContent = warning; list.append(li);
        }
        summary.append(list);
      }
      const failures = (result.results || []).filter((r) => r.error);
      if (failures.length) {
        const failHeading = document.createElement("p");
        failHeading.textContent = "Failed components:";
        summary.append(failHeading);
        const failList = document.createElement("ul");
        failList.className = "guide-list";
        for (const f of failures) {
          const li = document.createElement("li"); li.textContent = `${f.name} (${f.category}): ${f.error}`; failList.append(li);
        }
        summary.append(failList);
      }
    }

    button.addEventListener("click", async () => {
      if (button.disabled || exporting) return;
      const files = new Set(Array.from(container.querySelectorAll('.export-component-check:checked')).flatMap(c => JSON.parse(c.dataset.files)));
      const selected = manifest.filter(item => files.has(item.file));
      if (!selected.length) { setStatus("Select at least one component to export.", "error"); return; }
      exporting = true;
      button.disabled = true;
      summary.hidden = true; summary.innerHTML = "";
      setStatus("Starting export…");
      try {
        if (!await checkConnection()) { setStatus('Connect the bridge before exporting.', 'error'); return; }
        const result = await window.ADSFigmaBridge.exportCatalog(selected, (message) => setStatus(message));
        setStatus(`${result.failed ? "Finished with errors" : "Done"} — ${result.pushed} of ${result.total} components exported.`, result.failed ? "error" : "success");
        renderSummary(result);
      } catch (error) {
        setStatus(error.message, "error");
      } finally {
        exporting = false;
        button.disabled = false;
      }
    });
  });
})();
