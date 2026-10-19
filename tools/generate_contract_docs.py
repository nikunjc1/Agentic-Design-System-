"""Generate shared implementation rules and readable page sections from one source."""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
contract = json.loads((ROOT / 'foundation-contract.json').read_text())
catalog = json.loads((ROOT / 'icon-catalog.json').read_text())
block = '/* BEGIN GENERATED CONTRACT */\n  const contract = ' + json.dumps(contract, separators=(',', ':')) + ';\n  const iconCatalog = ' + json.dumps(catalog, separators=(',', ':')) + ';\n  /* END GENERATED CONTRACT */'
model_path = ROOT / 'foundation-model.js'
model = model_path.read_text()
if '/* BEGIN GENERATED CONTRACT */' in model:
    model = re.sub(r'/\* BEGIN GENERATED CONTRACT \*/.*?/\* END GENERATED CONTRACT \*/', lambda _: block, model, flags=re.S)
else:
    model = model.replace('  function restoreHeadingScale', '  ' + block + '\n  function restoreHeadingScale', 1)
outputs = {model_path: model}
for page, section in contract['sections'].items():
    path = ROOT / page
    rows = ''.join('<div class="ads-contract-rule"><h3>' + html.escape(label) + '</h3><p>' + html.escape(rule) + '</p></div>\n' for label, rule in section['rules'].items())
    panel = '\n<!-- BEGIN GENERATED CONTRACT -->\n<section class="panel ads-implementation-contract" id="implementation-contract" aria-labelledby="implementation-contract-title">\n<h2 class="panel-title" id="implementation-contract-title">Implementation contract</h2>\n<p>' + html.escape(contract['authority']) + '</p>\n' + rows + '<details><summary>Machine contract: section rules, storage, units and acceptance</summary><pre class="guide-machine-json"><code>' + html.escape(json.dumps({**{k:v for k,v in contract.items() if k!='sections'},'section':section}, indent=2)) + '</code></pre></details>\n</section>\n<!-- END GENERATED CONTRACT -->\n'
    source = path.read_text()
    if '<!-- BEGIN GENERATED CONTRACT -->' in source:
        source = re.sub(r'\n?<!-- BEGIN GENERATED CONTRACT -->.*?<!-- END GENERATED CONTRACT -->\n?', lambda _: panel, source, flags=re.S)
    else:
        source = source.replace('</main>', panel + '</main>', 1)
    outputs[path] = source
stale = [str(p.relative_to(ROOT)) for p, value in outputs.items() if p.read_text()!=value]
if '--check' in sys.argv:
    print('Implementation contracts: ' + ('STALE: '+', '.join(stale) if stale else 'fresh'))
    sys.exit(bool(stale))
for path, value in outputs.items():
    path.write_text(value)
print('Generated shared model and contracts for '+str(len(outputs)-1)+' pages.')
