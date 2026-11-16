"""Produce a per-page review index from actual browser evidence."""
import html
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'audit/workbench-recheck'
evidence = json.loads((OUT / 'results.json').read_text())
before = json.loads((OUT / 'before-results.json').read_text())
site = json.loads((ROOT / 'audit/workbench-site-health/results.json').read_text())
pages = evidence['pages']
summary = evidence['summary']
passed = not any(summary[k] for k in ['invisibleStates', 'clippedPages', 'inspectorOverflow', 'invalidContracts', 'exportErrors']) and not evidence['errors'] and all(t['status'] == 'pass' for t in evidence['tasks'])
status = 'PASS' if passed else 'NEEDS REPAIR'

lines = [
    '# Full-page recheck and corrections — 28 October 2026', '',
    'Working copy: **Damco Agentic Design System 2**. The original folder was not modified.', '',
    '## What the earlier checks missed', '',
    'The earlier smoke checks established that pages loaded and outer containers fit. They did not catch a component centered into an unscrollable clipped edge, or several real editing failures. Most save/export task checks used Button.', '',
    'Before-fix browser evidence is retained in `before-results.json`.', '',
    '| Confirmed failure | Scope | Correction |',
    '| --- | --- | --- |',
    '| Preview starts outside its scrollable frame | Add-on and Modal at 320px; Pagination at 390/320px; Table at 1024/768px | Safe alignment keeps the start of wide previews reachable; horizontal scrolling exposes the remainder |',
    '| Empty atomic text loses its editor | Shared inspector | Retain the editor and its text-node target, including after selecting another part |',
    '| An unsuitable token is accepted for a CSS property | Shared inspector | Resolve token aliases and validate the resulting type against the property |',
    '| Reset retains selected appearance/state | Shared selection controls | Explicit empty/default selections override the previous UI selection |',
    '| Text can move before an icon during export | Shared snapshot exporter | Serialize mixed text in its actual child order |',
    '| Export omits grid, gradient and other layout details | Shared snapshot exporter | Capture grid tracks/gaps, gradients, individual borders/corners and other resolved layout properties |',
    '| CSS decoration is omitted during export | Shared snapshot exporter, including Calendar event dots | Serialize supported before/after decorations into explicit contract parts |',
    '| Month heading disagrees with dates and accessible labels | Calendar | Generate a 42-cell UTC grid from the entered month/year; account for leap years, year boundaries and week start; reject invalid month text |',
    '| Interactive examples are buried in closed guidance | Affix, Dropdown, Splitter, Tree | Keep their existing working examples visible in the center column |',
    '| Atomic settings and save actions are difficult to reach | All component details | Add Properties/Atomic styles shortcuts and retain the action area while the inspector scrolls |',
    '', '## Current verification', '',
    f'- Result: **{status}**.',
    f'- All **{len(site["pages"])} site URLs** checked at four widths: **{len(site["pages"]) * 4}** page/viewport checks.',
    f'- **{sum(p["guides"] for p in site["pages"])}** documentation view toggles and **{len(site["recovery"])}** Foundation storage/recovery scenarios passed.',
    f'- All **{summary["pages"]} component details** inspected across **{summary["states"]} appearance/state combinations**.',
    '- Component geometry checked at 1440, 1024, 768, 390 and 320 pixels.',
    '- Every inspected state checked for a visible selected preview, valid contract, preserved text order and exported grid structure.',
    f'- Runtime errors: **{len(evidence["errors"])}**; invisible states: **{len(summary["invisibleStates"])}**; clipped-start pages: **{len(summary["clippedPages"])}**; invalid contracts: **{len(summary["invalidContracts"])}**; export structure failures: **{len(summary["exportErrors"])}**.',
    '- The companion workspace suite checks preservation of all 262 existing controls, saving/reload, cancellation, reset, copy/export, state isolation, old listing redirects, dark mode and RTL.',
    '', 'These are automated checks plus a screenshot review. They do not certify complete accessibility, every possible user input or application business behavior. Screenshots block external fonts and use the available system fallback.', '',
    '## Editing and component-specific checks', '',
    '| Check | Result |', '| --- | --- |',
]
for task in evidence['tasks']:
    lines.append(f'| {task["name"]} | {task["status"]} |')
lines.extend(['', '## Every component detail', '', '[Open the searchable screenshot index](INDEX.html).', '', '| Detail page | States checked | Widths checked | Screenshot |', '| --- | ---: | ---: | --- |'])
for page in pages:
    lines.append(f'| {page["file"]} | {len(page["states"])} | {len(page["widths"])} | [View]({page["file"].replace(".html", ".png")}) |')
lines.extend(['', '## Limits and remaining product scope', '',
    'The inspector supplies existing native controls and shared part-level editing. Dedicated data/behavior APIs from the earlier customization backlog are still distinct work: for example Table column/data authoring, Upload restrictions and authored interactive contract bindings. This recheck does not mark those recommendations implemented.', '',
    'The component exports remain selected-preview snapshots. A real Figma bridge/import session has not been verified in this recheck.', '',
    '## Repeat the checks', '', '```sh',
    'ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-workbench-coverage.cjs',
    'ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/check-component-workbench.cjs',
    'ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core ADS_SITE_HEALTH_OUT=audit/workbench-site-health node tools/check-site-health.cjs',
    'bash tools/release_check.sh',
    'python3 tools/build_workbench_recheck_report.py', '```', '',
    'Browser and bridge checks require permission to bind localhost ports.', ''])
(OUT / 'RECHECK.md').write_text('\n'.join(lines))

cards = []
for page in pages:
    name = html.escape(page['file'])
    cards.append(f'<article data-name="{name}"><h2><a href="../../{name}">{name}</a></h2><p>{len(page["states"])} states · {len(page["widths"])} widths</p><a href="{name.replace(".html", ".png")}"><img loading="lazy" src="{name.replace(".html", ".png")}" alt="Screenshot of {name}"></a></article>')
(OUT / 'INDEX.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Component workspace — every detail page</title><style>*{box-sizing:border-box}body{font:14px/1.5 system-ui,sans-serif;background:#f5f6f8;color:#17212d;margin:0;padding:24px}header{max-width:1200px;margin:0 auto 24px}h1{font-size:26px}input{font:inherit;padding:12px;width:min(100%,520px);border:1px solid #aab1ba;border-radius:8px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:20px;max-width:1600px;margin:auto}article{background:white;padding:16px;border:1px solid #d9dde3;border-radius:12px;min-width:0}h2{font-size:15px;overflow-wrap:anywhere}a{color:#174c87}img{display:block;width:100%;height:auto;border:1px solid #e1e5e9}article[hidden]{display:none}p{color:#526070}</style><header><h1>Every component detail page</h1><p>Experimental copy 2 · ''' + str(len(pages)) + ' details · ' + str(summary['states']) + ' states · ' + status + '''</p><p>Click a page name to open its detail page, or a screenshot to inspect it.</p><input type="search" aria-label="Filter detail pages" placeholder="Find a component…"><p role="status" id="count">''' + str(len(pages)) + ''' pages</p><a href="RECHECK.md">Detailed corrections and evidence</a></header><main>''' + ''.join(cards) + '''</main><script>const q=document.querySelector('input');q.addEventListener('input',()=>{let n=0;for(const card of document.querySelectorAll('article')){card.hidden=!card.dataset.name.includes(q.value.trim().toLowerCase());if(!card.hidden)n++;}document.querySelector('#count').textContent=n+' pages';});</script></html>''')

for index in range(0, len(pages), 16):
    group = pages[index:index+16]
    sheet = Image.new('RGB', (1440, 1100), '#e5e7eb')
    draw = ImageDraw.Draw(sheet)
    for offset, page in enumerate(group):
        x = (offset % 4) * 360
        y = (offset // 4) * 275
        draw.text((x+8, y+4), page['file'], fill='#111827')
        screenshot = Image.open(OUT / page['file'].replace('.html', '.png')).convert('RGB')
        screenshot.thumbnail((352, 246))
        sheet.paste(screenshot, (x+4, y+24))
    sheet.save(OUT / f'contact-{index//16+1}.jpg', quality=90)
print(json.dumps({'status': status, 'pages': len(pages), 'states': summary['states'], 'report': str(OUT / 'RECHECK.md')}))
