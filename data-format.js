(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const M = window.ADSFoundationModel, main = document.querySelector('main');
    if (!M || !main) return;
    let config = M.normalizeData(window.ADSFoundation.read('data-format'));
    // A successful write is the deduplication boundary; failed writes can retry.
    let committed = JSON.stringify(config);
    const controls = {}, errors = {}, toggles = {};
    const specs = [
      ['locale', 'Locale', ['en-GB', 'en-US', 'en-IN', 'de-DE', 'fr-FR', 'ja-JP']],
      ['grouping', 'Group thousands', 'checkbox'],
      ['separator', 'Grouping separator', ['locale', 'comma', 'space', 'none']],
      ['unit', 'Unit symbol', 'text'], ['unitSpace', 'Space before unit', ['none', 'space', 'nbsp']],
      ['currency', 'Currency', ['GBP', 'USD', 'INR', 'EUR', 'JPY', 'AED']],
      ['currencyDisplay', 'Currency display', ['symbol', 'code', 'name']],
      ['decimals', 'Decimal places', 'number', 0, 6],
      ['large', 'Large amounts', ['compact', 'standard']], ['tableAlign', 'Numeric column alignment', ['end', 'start']],
      ['date', 'Date style', ['iso', 'locale', 'long']], ['hourCycle', 'Clock format', ['h23', 'h12']],
      ['seconds', 'Include seconds', 'checkbox'], ['combined', 'Date and time separator', ['space', 'T']],
      ['relative', 'Use relative time', 'checkbox'], ['zone', 'Time zone', 'text'],
      ['showZone', 'Show time zone', 'checkbox'], ['range', 'Date range separator', 'text'],
      ['noValue', 'Missing-value placeholder', 'text'], ['loading', 'Loading appearance', ['skeleton', 'text']],
      ['redaction', 'Default masking', ['full', 'partial']], ['mask', 'Mask character', 'text'],
      ['reveal', 'Visible trailing characters', 'number', 0, 8], ['escapedSpace', 'Text spacing', ['space', 'nbsp', 'narrow']]
    ];
    const names = {
      locale: {'en-GB':'English (United Kingdom)', 'en-US':'English (United States)', 'en-IN':'English (India)', 'de-DE':'German (Germany)', 'fr-FR':'French (France)', 'ja-JP':'Japanese (Japan)'},
      separator: {locale:'Follow locale', comma:'Comma', space:'Narrow non-breaking space', none:'No grouping'},
      unitSpace: {none:'No space', space:'Space', nbsp:'Non-breaking space'},
      currency: {GBP:'GBP · British pound', USD:'USD · US dollar', INR:'INR · Indian rupee', EUR:'EUR · Euro', JPY:'JPY · Japanese yen', AED:'AED · UAE dirham'},
      currencyDisplay: {symbol:'Symbol', code:'Currency code', name:'Currency name'},
      large: {compact:'Compact', standard:'Full number'}, tableAlign: {end:'End (recommended)', start:'Start'},
      date: {iso:'YYYY-MM-DD', locale:'Locale date', long:'Long date'}, hourCycle: {h23:'24-hour', h12:'12-hour'},
      combined: {space:'Space', T:'T character'}, loading: {skeleton:'Skeleton', text:'Loading text'},
      redaction: {full:'Full', partial:'Partial'}, escapedSpace: {space:'Space', nbsp:'Non-breaking space', narrow:'Narrow non-breaking space'}
    };
    const hints = {
      locale:'Controls digit grouping, decimal marks and localized wording.', grouping:'Turn off to remove grouping separators.',
      separator:'Applies when grouping is on. A comma cannot also be the decimal mark.', unit:'Case matters: kg, kW and °C are different symbols.',
      unitSpace:'For SI units, use a space. Non-breaking space keeps the quantity together.', currency:'Changes the displayed currency; does not convert the amount.',
      currencyDisplay:'Placement and spacing follow the locale.', decimals:'0–6. Fixed for currency; maximum for other numbers.',
      large:'Compact abbreviations follow the locale.', tableAlign:'End is right in left-to-right layouts and left in right-to-left layouts.',
      date:'Calendar dates do not shift when the time zone changes.', hourCycle:'Applies to timestamps and combined date/time examples.',
      seconds:'Include seconds when the task needs that precision.', combined:'A display separator, not an ISO timestamp serializer.',
      relative:'Use localized time differences for events within 24 hours.', zone:'IANA name, for example UTC or Asia/Kolkata.',
      showZone:'Recommended for teams working across time zones.', range:'Keep spaces around the separator for readability.',
      noValue:'Used for confirmed absent values; never replaces zero.', loading:'Use one loading announcement per containing region.',
      redaction:'Applies to generic masking; explicit full/partial examples keep their own type.', mask:'Exactly one Unicode code point, such as * or •.',
      reveal:'0–8. Partial masking always hides at least one character.', escapedSpace:'Controls the spacing sample below.'
    };
    const panel = document.createElement('section'); panel.className = 'panel ads-data-settings';
    const title = document.createElement('h2'); title.className = 'panel-title'; title.textContent = 'Configure and preview';
    const intro = document.createElement('p'); intro.className = 'get-library-copy';
    intro.textContent = 'Valid changes save automatically in this browser and update the examples and exports. Incomplete or invalid edits keep the last valid configuration active.';
    const table = document.createElement('table'); table.className = 'ads-format-table'; table.setAttribute('data-markdown-skip', '');
    table.innerHTML = '<caption>Live preview</caption><thead><tr><th scope="col">Value</th><th scope="col">Formatted result</th></tr></thead><tbody><tr><th scope="row">Number · 123220.5</th><td data-format="number" data-value="123220.5"></td></tr><tr><th scope="row">Currency · 123.45</th><td data-format="currency" data-value="123.45"></td></tr><tr><th scope="row">Calendar date · 2026-03-14</th><td data-format="date" data-value="2026-03-14"></td></tr></tbody>';
    panel.append(title, intro, table);
    const form = document.createElement('form'); form.className = 'ads-format-controls ads-format-grouped ads-no-clamp'; form.noValidate = true;
    form.setAttribute('data-markdown-skip', '');
    const groups = [['Numbers, units and currency', specs.slice(0, 10)], ['Dates and times', specs.slice(10, 18)], ['Missing values, masking and spacing', specs.slice(18)]];
    for (const [name, fields] of groups) {
      const fieldset = document.createElement('fieldset'); fieldset.className = 'ads-format-group';
      const legend = document.createElement('legend'); legend.textContent = name;
      const grid = document.createElement('div'); grid.className = 'ads-format-grid'; fieldset.append(legend, grid); form.append(fieldset);
      for (const [key, text, kind, min, max] of fields) {
        const field = document.createElement('div'); field.className = 'setup-field ads-format-field';
        const label = document.createElement('label'); label.className = 'ads-format-label'; label.htmlFor = 'format-' + key; label.textContent = text;
        const input = document.createElement(Array.isArray(kind) ? 'select' : 'input'); input.id = 'format-' + key; input.name = key;
        if (Array.isArray(kind)) for (const value of kind) input.add(new Option(names[key]?.[value] || value, value));
        else {
          input.type = kind;
          if (kind === 'number') { input.min = min; input.max = max; input.step = '1'; input.required = true; }
          if (kind === 'text') { input.maxLength = key === 'zone' ? 80 : 24; input.required = true; input.spellcheck = false; }
        }
        controls[key] = input;
        const help = document.createElement('div'); help.className = 'ads-format-help';
        const hint = document.createElement('span'); hint.id = input.id + '-hint'; hint.textContent = hints[key];
        const error = document.createElement('span'); error.id = input.id + '-error'; error.className = 'setup-error ads-format-field-error'; errors[key] = error;
        input.setAttribute('aria-describedby', hint.id + ' ' + error.id); help.append(hint, error);
        field.append(label);
        if (kind === 'checkbox') {
          const slot = document.createElement('label'); slot.className = 'ads-format-toggle'; slot.htmlFor = input.id;
          const state = document.createElement('span'); state.setAttribute('aria-hidden', 'true'); toggles[key] = state;
          input.setAttribute('aria-labelledby', input.id + '-label'); label.id = input.id + '-label';
          slot.append(input, state); field.append(slot);
        } else field.append(input);
        field.append(help); grid.append(field);
      }
    }
    const error = document.createElement('p'); error.id = 'format-error'; error.className = 'setup-error ads-no-clamp'; error.setAttribute('role', 'alert'); error.setAttribute('data-markdown-skip', '');
    const status = document.createElement('p'); status.className = 'save-status'; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    function syncToggles() { for (const [key, state] of Object.entries(toggles)) state.textContent = controls[key].checked ? 'On' : 'Off'; }
    function populate() {
      for (const [key, input] of Object.entries(controls)) {
        // Imported supported locales/currencies must remain selectable, even
        // when they are not one of this page's common presets.
        if (input.tagName === 'SELECT' && !Array.from(input.options).some(o => o.value === config[key])) input.add(new Option(config[key], config[key]));
        if (input.type === 'checkbox') input.checked = config[key]; else input.value = config[key];
        input.removeAttribute('aria-invalid'); errors[key].textContent = '';
      }
      error.textContent = ''; syncToggles();
    }
    function commit() {
      const draft = {}, invalid = new Map();
      for (const [key, input] of Object.entries(controls)) {
        draft[key] = input.type === 'checkbox' ? input.checked : input.type === 'number' ? Number(input.value) : input.value;
        if (!input.checkValidity() || (input.type === 'text' && !input.value.trim())) invalid.set(key, input.type === 'number' ? `Enter a whole number from ${input.min} to ${input.max}.` : 'Enter a non-empty value.');
      }
      try { new Intl.DateTimeFormat(draft.locale, {timeZone: draft.zone}); } catch { invalid.set('zone', 'Use a valid IANA time zone, for example Asia/Kolkata.'); }
      if (Array.from(draft.mask).length !== 1) invalid.set('mask', 'Enter exactly one Unicode code point.');
      if (draft.separator === 'comma' && new Intl.NumberFormat(draft.locale).formatToParts(1.5).some(p => p.type === 'decimal' && p.value === ',')) invalid.set('separator', 'Choose another separator: this locale uses a decimal comma.');
      for (const [key, input] of Object.entries(controls)) {
        errors[key].textContent = invalid.get(key) || '';
        if (invalid.has(key)) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      }
      syncToggles();
      error.textContent = invalid.size ? 'Check ' + specs.filter(([key]) => invalid.has(key)).map(([, label]) => label.toLowerCase()).join(', ') + '. Examples and exports still use the last valid configuration.' : '';
      if (invalid.size) { status.textContent = ''; return false; }
      const next = M.normalizeData(draft), payload = JSON.stringify(next);
      if (payload === committed && JSON.stringify(config) === payload) { status.textContent = 'Current configuration is active.'; return true; }
      config = next;
      const saved = window.ADSStorage.safeSet('ads:data-format', config);
      if (saved) committed = payload;
      status.textContent = saved ? 'Saved in this browser. Examples updated.' : 'Preview updated; changes could not be saved. Retry or download the configuration.';
      return saved;
    }
    form.addEventListener('submit', e => { e.preventDefault(); if (!commit()) form.querySelector('[aria-invalid="true"]')?.focus(); });
    form.addEventListener('input', commit); form.addEventListener('change', commit);
    const reset = document.createElement('button'); reset.className = 'btn btn-ghost'; reset.type = 'button'; reset.textContent = 'Reset Data Format';
    reset.addEventListener('click', () => {
      if (!window.ADSStorage.safeRemove('ads:data-format')) { status.textContent = 'Reset could not be saved.'; return; }
      config = M.normalizeData(null); committed = JSON.stringify(config); populate(); status.textContent = 'Defaults restored.';
    });
    const download = document.createElement('button'); download.className = 'btn btn-ghost'; download.type = 'button'; download.textContent = 'Download configuration';
    download.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify({schemaVersion: 1, dataFormat: window.ADSFoundation.get().dataFormat}, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'data-format.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    const actions = document.createElement('div'); actions.className = 'panel-footer-row ads-format-actions'; actions.setAttribute('data-markdown-skip', ''); actions.append(reset, download, status);
    const space = document.createElement('p'); space.className = 'ads-format-space-preview'; space.textContent = 'Text spacing preview: ';
    const output = document.createElement('span'); output.dataset.formatSpace = ''; space.append(output);
    panel.append(form, error, actions, space);
    (main.querySelector('.ads-foundation-toolbar') || main.querySelector('.page-lede')).after(panel);
    populate();
    main.querySelector('[data-format="relative"]').dataset.value = new Date(Date.now() - 12 * 60000).toISOString();
    window.ADSFoundation.apply();
  });
})();
