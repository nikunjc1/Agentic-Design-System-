/* One picker and persistent in-page state for both handoff formats. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const tabs = Array.from(document.querySelectorAll('[data-export-format]'));
    if (!tabs.length) return;
    const workspace = document.getElementById('export-workspace');
    function select(format, updateURL = true) {
      const figma = format === 'figma';
      format = figma ? 'figma' : 'markdown';
      tabs.forEach(tab => {
        const selected = tab.dataset.exportFormat === format;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      document.querySelectorAll('.markdown-only').forEach(node => node.hidden = figma);
      document.querySelectorAll('.figma-only').forEach(node => node.hidden = !figma);
      document.getElementById('exportComponents').hidden = !figma && !['all','components'].includes(document.getElementById('exportScope').value);
      workspace.setAttribute('aria-labelledby', 'export-tab-' + format);
      if (updateURL) {
        const url = new URL(location.href);
        url.searchParams.set('format', format);
        if (figma && url.hash === '#ai-handoff') url.hash = '';
        history.replaceState(history.state, '', url);
      }
      document.dispatchEvent(new CustomEvent('ads:export-format', {detail:format}));
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab.dataset.exportFormat));
      tab.addEventListener('keydown', event => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 : (index+1)%tabs.length;
        tabs[next].focus(); select(tabs[next].dataset.exportFormat);
      });
    });
    const fromURL = () => select(location.hash === '#ai-handoff' ? 'markdown' : new URLSearchParams(location.search).get('format'), false);
    window.addEventListener('popstate', fromURL);
    window.addEventListener('hashchange', fromURL);
    fromURL();
  });
})();
