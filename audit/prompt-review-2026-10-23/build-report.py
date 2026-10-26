import json,re,html,hashlib
from pathlib import Path
from collections import defaultdict

OUT=Path(__file__).resolve().parent
ROOT=OUT.parent.parent
rows=json.loads((OUT/'results.json').read_text())
for r in rows:r['title']=re.sub(r'\s+(stable|experimental)\s*$','',r['title'],flags=re.I)
visual={x['file']:x for x in json.loads((OUT/'preview-verification.json').read_text())}
supp=json.loads((OUT/'supplement.json').read_text())
issues=defaultdict(list)
def add(file,id,actual,expected,source=None):
    issues[file].append(dict(id=id,actual=actual,expected=expected,source=source))
def source(file,needle):
    p=ROOT/file
    lines=p.read_text().splitlines()
    n=next((i+1 for i,l in enumerate(lines) if needle in l),None)
    if n is None:n=next((i+1 for i,l in enumerate(lines) if '--red-400' in l),1)
    return f'{file}:{n}'
def script(row):
    text=(ROOT/row['file']).read_text()
    return next(x for x in re.findall(r'<script src="([^"]+)"',text) if x.endswith('-detail.js'))
categories={
 'PR-01':('P1','Configured properties are missing from the prompt','Read the current controls into one configuration object and serialize it into every single-combination and dropdown-combination prompt. Include visible text, boolean choices, numeric values and accessible names.','Change each listed property, wait for the preview update, copy the prompt, and verify the new value is present and the old selected value is absent.'),
 'PR-02':('P1','Float Button Primary focus outputs undefined','Return a focus recipe in the early Primary branch of liveCssFor; remove or consolidate the unreachable second Primary branch.','Copy all sizes in both themes; no undefined/NaN placeholders may appear, and Primary focus must match the rendered focus ring.'),
 'PR-03':('P1','Referenced CSS tokens are absent from the exported prompt','Resolve referenced CSS variables or include their definitions and recursively include every dependency. Expand preparePageMarkdown beyond its current token-name allowlist.','Validate every var(--token) dependency in the copied prompt, including aliases, in a blank recipient document without shell.css.'),
 'PR-04':('P2','Prompt focus color differs from the rendered component','Generate the focus recipe from --color-focus-ring / --button-primary-focus-ring and the current focus width/offset; preserve documented semantic exceptions.','Compare the copied focus recipe with computed styles in light/dark themes and after editing the Focus foundation.'),
 'PR-05':('P2','Prompt shadows use obsolete literal values','Use the same semantic shadow token in the preview and prompt recipe, resolving the current value for handoff.','Compare prompt and computed box-shadow in the affected state and both themes, including a custom Shadow foundation.'),
 'PR-06':('P1','Loading state shown in the detail page is missing from the prompt','Generate the prompt state inventory from the same STATES model used by the preview. Document spinner placement, retained label, disabled interaction and aria-busy.','The prompt and preview must enumerate the same states; reconstruct Loading with the same content and interaction behavior.'),
 'PR-07':('P2','Dual Icon Button Loading instructions remove a label that the preview retains','Update the seven type descriptions to specify spinner plus retained label, no trailing icon, matching buildDemoButton.','At each supported content choice, Loading must reproduce the preview label/spinner arrangement.'),
 'PR-08':('P2','Badge prompt contradicts itself about the color count','Generate the introductory color count and the enumerated color list from the same color model.','The introduction and color list must both state five colors, matching the five preview rows.')
}

for row in rows:
    f=row['file'];js=script(row);p=row['default']['prompt'];recipe=p.split('<!-- ads:contract -->')[0].strip()
    stale=[t for t in row['tests'] if t['kind']=='property' and not t['changed']]
    if stale:
        groups=defaultdict(list)
        for t in stale:
            # The initial arbitrary text was not a valid hex. The supplement
            # supplies the valid color edit used for this finding.
            to='#1357AB' if f=='color-picker-default.html' and t['control']=='Color value' else t['to']
            groups[t['control']].append(f'{t["from"]!s} → {to!s}')
        detail='; '.join(k+': '+', '.join(dict.fromkeys(v)) for k,v in groups.items())
        add(f,'PR-01','The preview changes but the prompt remains byte-for-byte identical for these edits: '+detail+'.','The copied prompt must state the current property values.',source(js,'function buildFullPrompt'))
    refs=set(re.findall(r'var\((--[\w-]+)',p))
    definitions=set(re.findall(r'(--[\w-]+)\s*[\"]?\s*:',p))
    missing=sorted(refs-definitions)
    if missing:
        add(f,'PR-03','Undefined handoff dependencies: '+', '.join(missing)+'. The local stylesheet has these values; the copied prompt does not.','Every CSS variable referenced in the prompt must have a definition or an explicit resolved value.',source('foundation-runtime.js','function preparePageMarkdown'))
    samples=visual[f]['baseline']['styles']
    focus=[s for s in samples if s['outline']=='rgb(255, 3, 26) solid 2px' and (s['state'] in ['Focused','Focus'] or 'is-focus' in s['cls'])]
    if '#ff4253' in recipe and focus:
        s=focus[0]
        add(f,'PR-04',f'Prompt specifies the ordinary focus ring as #ff4253. Rendered {s["type"] or ""} / {s["state"] or "Focused"}: {s["outline"]} (#ff031a). Element: {s["cls"]}.','Use the applied semantic focus color (#ff031a in the audited default), rather than red-400 (#ff4253).',source(js,'function liveCssFor'))
    if 'Focused: undefined' in recipe:
        add(f,'PR-02','Primary section literally contains “Focused: undefined Never just a color change, so layout never shifts.” The preview shows a 2px solid #ff031a ring.','Output the actual Primary focus treatment.',source(js,'if (typeKey === "primary")'))
    if f.startswith('button-') and f!='button-primary-icon.html' or f=='switch-default.html':
        add(f,'PR-06','The copied recipe lists five states and never mentions Loading. The rendered detail matrix has six rows, including Loading.','Include all six displayed states.',source(js,'lines.push("States (5'))

shadow_specs={
 'card-default.html':('Hover','card-demo-panel','0 4px 16px rgba(0,0,0,0.3)'),
 'notification-default.html':('Default','notification-demo-card','0 8px 24px rgba(0,0,0,0.35)'),
 'toast-default.html':('Default','toast-demo-card','0 8px 24px rgba(0,0,0,0.4)'),
 'popover-default.html':('Simple','popover-demo-bubble','0 8px 24px rgba(0,0,0,0.4)'),
 'pop-confirm-default.html':('Default','popconfirm-demo-bubble','0 8px 24px rgba(0,0,0,0.4)'),
 'tour-default.html':('First step','tour-demo-card','0 8px 24px rgba(0,0,0,0.4)')
}
for f,(state,cls,literal) in shadow_specs.items():
    s=next(s for s in visual[f]['baseline']['styles'] if cls in s['cls'] and s['state']==state)
    js=script(next(r for r in rows if r['file']==f))
    add(f,'PR-05',f'Prompt {state} shadow: {literal}. Rendered shadow: {s["shadow"]}.','Prompt and preview must use the same applied shadow.',source(js,literal))

add('avatar-default.html','PR-01','Changing Avatar.Group “Show as” from Avatars to Names only changes the group preview, but the prompt stays identical. It lists both modes without recording the selected mode.','Serialize the current Avatar.Group display mode.',source('avatar-detail.js','function buildFullPrompt'))
add('button-primary.html','PR-01','With Content = Icon only, setting Accessible label to “Open audit settings” changes the preview aria-label but leaves the prompt identical. The prompt only asks for an accessible label generically.','Include the current accessible name in the selected configuration.',source('button-detail.js','function buildFullPrompt'))
add('button-primary-icon.html','PR-07','The prompt says “The label and both icon slots are replaced by one spinner”. The seven Loading previews retain “Save” next to the spinner. buildDemoButton emits spinnerHtml(iconSize) plus the escaped label.','Describe spinner plus retained label, without the trailing icon.',source('button-dualicon-detail.js','inner = spinnerHtml(iconSize)'))
add('badge-default.html','PR-08','The introduction says “3 forms, each in 4 semantic colors”; the same prompt then lists Colors (5), and the preview has Default, Success, Processing, Warning and Error.','State five colors consistently.',source('badge-detail.js','each in 4 semantic colors'))

bad=sum(bool(issues[r['file']]) for r in rows)
summary={'date':'2026-10-23','scope':'Current local working tree; 69 component detail pages; 63 detail scripts','pages':len(rows),'pagesWithConfirmedMismatch':bad,'pagesWithoutMismatchInCheckedScope':len(rows)-bad,'propertyAndOptionChecks':sum(len(r['tests']) for r in rows),'copyPayloadFailures':sum(not t.get('prompt') for r in rows for t in r['tests']),'runtimeErrors':sum(len(r['errors']) for r in rows),'categories':{k:{'priority':v[0],'title':v[1],'pages':sum(any(i['id']==k for i in issues[r['file']]) for r in rows)} for k,v in categories.items()},'pagesResults':[{ 'file':r['file'],'title':r['title'],'checks':len(r['tests']),'issues':issues[r['file']]} for r in rows]}
(OUT/'findings.json').write_text(json.dumps(summary,indent=2))

def e(s):return html.escape(str(s))
def issuehtml(i):
    priority,title,fix,accept=categories[i['id']]
    return f'<article class="issue"><h4><span class="tag {priority}">{priority}</span> {i["id"]} · {e(title)}</h4><dl><dt>Observed</dt><dd>{e(i["actual"])}</dd><dt>Expected</dt><dd>{e(i["expected"])}</dd><dt>Fix</dt><dd>{e(fix)}</dd><dt>Acceptance</dt><dd>{e(accept)}</dd><dt>Source</dt><dd><code>{e(i["source"])}</code></dd></dl></article>'

categoryrows=''.join(f'<tr><td><a href="#category-{id}">{id}</a></td><td><span class="tag {v[0]}">{v[0]}</span></td><td>{e(v[1])}</td><td>{summary["categories"][id]["pages"]}</td></tr>' for id,v in categories.items())
table=''.join(f'<tr data-status="{"mismatch" if issues[r["file"]] else "clear"}"><td><a href="#{r["file"]}">{e(r["title"].replace(" Stable",""))}</a><small>{e(r["file"])}</small></td><td>{"Mismatch" if issues[r["file"]] else "No mismatch found"}</td><td>{r["tests"].__len__()}</td><td>{", ".join(dict.fromkeys(i["id"] for i in issues[r["file"]])) or "—"}</td></tr>' for r in rows)
details=[]
for r in rows:
    f=r['file'];recipe=r['default']['prompt'].split('<!-- ads:contract -->')[0].strip()
    props='; '.join((c['label'] or c['role'] or c['id'] or str(c['i']))+' = '+str(c['checked'] if c['type']=='checkbox' else c['value']) for c in r['controls'] if c['visible'])
    ms='; '.join((m['label'] or m['role'] or str(m['i']))+' = '+', '.join(o['label'] for o in m['options'] if o['checked']) for m in r['multi'])
    found=''.join(issuehtml(i) for i in issues[f]) or '<p>No specific mismatch found in the checked prompt bindings, recipe content and rendered default styles. This is a scoped result, not certification of every combination or downstream AI output.</p>'
    details.append(f'<details class="page-detail" id="{f}"><summary><span class="dot {"bad" if issues[f] else "good"}"></span>{e(r["title"].replace(" Stable",""))}<span class="count">{len(issues[f])} findings · {len(r["tests"])} checks</span></summary><div class="detail-body"><p class="meta"><code>{f}</code> · <code>{script(r)}</code> · <a href="screenshots/{f.replace(".html",".png")}">Rendered preview screenshot</a> · <a href="{f.replace(".html",".json")}">Full captured prompts and checks (JSON)</a></p><p><b>Default controls:</b> {e(props+("; "+ms if ms else ""))}</p>{found}<details><summary>Read the exact default component prompt</summary><pre>{e(recipe)}</pre></details></div></details>')

srcfiles=sorted({script(r) for r in rows}|{'shell.css','foundation.css','foundation-model.js','foundation-runtime.js','multiselect.js'})
(OUT/'source-hashes.json').write_text(json.dumps({p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in srcfiles},indent=2))
css='''*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f5f6f8;color:#20242c;font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}main{max-width:1180px;margin:0 auto;padding:52px 32px 90px}h1{font-size:38px;line-height:1.16;letter-spacing:-1.3px;margin:10px 0 18px}h2{margin:42px 0 14px;font-size:24px;letter-spacing:-.5px}h3{font-size:19px;margin:26px 0 10px}h4{margin:0 0 13px;font-size:16px}a{color:#1848a0}a:hover{text-decoration:none}p{max-width:95ch}small{display:block;color:#626978;font-size:12px}code,pre{font:12px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace}code{overflow-wrap:anywhere}pre{padding:20px;background:#f4f6f9;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}.eyebrow{color:#555f6f;letter-spacing:1.5px;font-size:12px;font-weight:700}.lead{font-size:19px;max-width:78ch}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:28px 0}.card{background:white;border:1px solid #dfe3ea;border-radius:10px;padding:20px}.card strong{display:block;font-size:32px;line-height:1.2}.card span{font-size:13px;color:#596271}.notice{background:#fff5e1;border:1px solid #e4cb92;border-radius:8px;padding:18px 22px;margin:24px 0}.panel{background:white;border:1px solid #dfe3ea;border-radius:10px;padding:20px 24px}table{border-collapse:collapse;width:100%;background:white}td,th{text-align:left;padding:13px 15px;border-bottom:1px solid #e1e5eb;vertical-align:top}th{font-size:12px;text-transform:uppercase;letter-spacing:.5px;background:#edf0f5}tr:last-child td{border-bottom:0}.table-wrap{overflow:auto;border:1px solid #dfe3ea;border-radius:10px}.tag{display:inline-block;font-weight:700;font-size:11px;padding:2px 7px;border-radius:4px}.P1{background:#ffe2df;color:#8d2118}.P2{background:#fff0cb;color:#745003}.page-detail{background:white;border:1px solid #dfe3ea;border-radius:9px;margin:11px 0;scroll-margin-top:20px}summary{cursor:pointer;padding:17px;font-weight:600}.detail-body{padding:0 24px 24px}.count{float:right;color:#626978;font-size:12px;font-weight:400}.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:10px}.bad{background:#bb352c}.good{background:#288164}.meta{color:#626978;font-size:12px}.issue{border-top:1px solid #e1e5eb;padding:22px 0 4px}dl{display:grid;grid-template-columns:94px 1fr;gap:8px 16px;font-size:14px;margin:0}dt{font-weight:600;color:#626978}dd{margin:0}input[type=search]{width:100%;padding:13px 15px;font:inherit;border:1px solid #b9c3d2;border-radius:7px;margin:8px 0 16px}button{border:1px solid #b9c3d2;background:white;padding:8px 12px;border-radius:5px;cursor:pointer;margin-right:6px}footer{font-size:12px;color:#626978;border-top:1px solid #dfe3ea;padding-top:24px;margin-top:40px}li{margin:7px 0}@media(max-width:700px){main{padding:25px 16px}.cards{grid-template-columns:repeat(2,1fr)}h1{font-size:30px}.count{float:none;display:block;margin-left:19px}dl{grid-template-columns:1fr;gap:2px}dd{margin-bottom:10px}}@media print{body{background:white}main{padding:0}.page-detail{break-inside:avoid}button,input{display:none}a{color:inherit}.cards{grid-template-columns:repeat(4,1fr)}}'''
report=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Damco Agentic Design System — Prompt Audit</title><style>{css}</style></head><body><main>
<div class="eyebrow">DAMCO AGENTIC DESIGN SYSTEM · QA REPORT · 23 OCTOBER 2026</div>
<h1>Prompts do not consistently reproduce<br>their detail-page designs.</h1>
<p class="lead">Reviewed all <b>69 component detail pages</b> in the local project. <b>{bad} pages have confirmed mismatches</b> between their prompts and the configured or rendered design; <b>{69-bad} pages had no mismatch found in the checked scope</b>.</p>
<div class="cards"><div class="card"><strong>69 / 69</strong><span>detail pages reviewed</span></div><div class="card"><strong>{bad}</strong><span>pages with confirmed findings</span></div><div class="card"><strong>974</strong><span>property and selection checks</span></div><div class="card"><strong>0</strong><span>failed copy payloads / page errors</span></div></div>
<p>The main failure is in the <b>contents of the exported instructions</b>. The tested Copy prompt controls produce text, but some generators drop current property values, leave CSS dependencies undefined, or describe older state and style definitions. A consuming AI receives incomplete or conflicting instructions.</p>
<p><b>Audit result only:</b> no application source was changed. Existing working-tree edits were preserved. Findings and their source references apply to the local copy reviewed on 23 October 2026, not a separately deployed site.</p>

<h2>What to fix</h2><div class="table-wrap"><table><thead><tr><th>ID</th><th>Priority</th><th>Confirmed issue</th><th>Affected pages</th></tr></thead><tbody>{categoryrows}</tbody></table></div>
<p class="meta">Page counts overlap. P1 = missing or invalid instructions prevent reliable reproduction; P2 = visual or descriptive inconsistency.</p>
<div class="panel"><h3>Recommended repair order</h3><ol><li>Fix the undefined Float Button focus recipe and include the full referenced token dependency set in exports.</li><li>Bind every prompt to the same resolved configuration used by its preview, including secondary properties such as Avatar.Group mode and Notification placement.</li><li>Generate state lists, Loading content, colors and shadows from shared component definitions. Avoid parallel hand-maintained prose and CSS literals.</li><li>Add acceptance checks that change a property, wait beyond the 80 ms render delay, capture the actual clipboard payload, and compare it with the preview configuration and computed styles.</li></ol></div>

<h2>Confirmed examples</h2><ul><li><b>Input Text Field:</b> changing label, placeholder, leading/trailing icons or Allow clear changes the preview, but produces an identical prompt.</li><li><b>Float Button:</b> the Primary focus instruction literally says <code>Focused: undefined</code>.</li><li><b>Button and Switch:</b> the preview includes Loading; the prompt enumerates only five states and omits it.</li><li><b>Input focus:</b> the prompt requests <code>#ff4253</code>; the rendered focus outline is <code>#ff031a</code>.</li><li><b>Card Hover:</b> prompt shadow <code>0 4px 16px rgba(0,0,0,0.3)</code>; preview shadow <code>0 4px 8px rgba(0,0,0,0.1)</code>.</li></ul>

<h2>Workflow gap: default selections become unanswered questions</h2><div class="notice"><b>50 detail pages</b> emit questions such as “What size do you want?” or “What corner radius do you want?” even though the preview displays current default selections. The source deliberately treats default, empty and All selections as an undecided mode, so this is reported separately from the confirmed defect count. For faithful handoff, provide explicit <b>Copy current configuration</b> and <b>Copy full component specification</b> actions. Returning to the default value should still allow an exact configuration export.</div>

<h2>Coverage and evidence</h2><div class="panel"><p>The inventory was built from every local HTML page containing <code>data-role="copy-prompt-action"</code>: 69 detail documents using 63 detail scripts. Each page was loaded in Chrome 155 at 1440 × 1000, with fresh browser storage.</p><ul><li>Captured the default prompt and a dark-theme prompt from the actual Copy prompt handlers.</li><li>Ran 974 property/selection cases: visible fields, toggles, native-select choices, each multiselect option, empty/All selections and a two-choice sample where available. For multi-combination menus, the first combination's Copy action was exercised; the full Cartesian product was not exhaustively copied.</li><li>Allowed 140 ms plus two animation frames after changes, exceeding the site's 80 ms coalescing delay. The final results replace an earlier faster pass that produced timing-related false positives.</li><li>Rechecked unchanged-prompt cases against rendered preview markup and computed styles. Supplemental checks confirmed a valid hex edit, notification corner placement, Avatar.Group mode, an icon-only accessible name and Dual Icon Loading content.</li><li>Saved one rendered preview screenshot per detail page and inspected contact sheets covering all 69 pages. Computed style evidence covers the matrix states beyond the screenshot viewport.</li></ul><p><b>Limits:</b> clipboard writes were captured with a narrow test replacement of <code>navigator.clipboard.writeText</code>; OS clipboard permissions and manual fallback were not retested. No downstream AI generation was run. External requests were blocked, so exact web-font rendering was not certified. Light-theme rendered defaults and dark-theme payloads were checked; every custom Foundation configuration, mobile layout, interaction sandbox and screen-reader flow was not exhaustively audited. Foundation/reference pages and gallery cards are outside this component-detail inventory.</p><p><a href="findings.json">Machine-readable findings</a> · <a href="results.json">All prompt and option captures</a> · <a href="preview-verification.json">Rendered style and property evidence</a> · <a href="supplement.json">Targeted checks</a> · <a href="source-hashes.json">Audited source hashes</a></p></div>

<h2>Every detail page</h2><p>Search by component, file name or finding ID. Open a page below for observed versus expected behavior, reproduction steps, source locations and its exact default prompt.</p><input id="search" type="search" aria-label="Filter detail pages" placeholder="Search components or PR-01…PR-08"><div><button id="expand">Expand all pages</button><button id="collapse">Collapse all pages</button><button id="only">Show mismatches only</button></div><div class="table-wrap" style="margin-top:18px"><table id="inventory"><thead><tr><th>Detail page</th><th>Result</th><th>Checks</th><th>Finding IDs</th></tr></thead><tbody>{table}</tbody></table></div>
<section id="pages">{''.join(details)}</section>
<h2>Issue acceptance checklist</h2>{''.join(f'<div class="panel" id="category-{id}" style="margin-bottom:14px"><h3>{id} · {e(v[1])}</h3><p><b>Fix:</b> {e(v[2])}</p><p><b>Acceptance:</b> {e(v[3])}</p></div>' for id,v in categories.items())}
<footer>Prepared 23 October 2026 · Asia/Kolkata · Current local Damco Agentic Design System working tree. Reproduction scripts and raw evidence are included beside this report. The report records confirmed prompt mismatches, not a promise that a prompt will produce pixel-identical results in every model or tool.</footer>
</main><script>const q=document.querySelector('#search');let only=false;function filter(){{const s=q.value.toLowerCase();document.querySelectorAll('#inventory tbody tr').forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(s)||(only&&r.dataset.status!=='mismatch'));document.querySelectorAll('.page-detail').forEach(d=>d.hidden=!d.textContent.toLowerCase().includes(s)||(only&&!d.querySelector('.issue')));}}q.addEventListener('input',filter);document.querySelector('#expand').onclick=()=>document.querySelectorAll('.page-detail:not([hidden])').forEach(d=>d.open=true);document.querySelector('#collapse').onclick=()=>document.querySelectorAll('.page-detail').forEach(d=>d.open=false);document.querySelector('#only').onclick=e=>{{only=!only;e.target.textContent=only?'Show all pages':'Show mismatches only';filter();}};function reveal(){{const d=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(d?.classList.contains('page-detail'))d.open=true;}}window.addEventListener('hashchange',reveal);reveal();</script></body></html>'''
(OUT/'Damco-Prompt-Audit-2026-10-23.html').write_text(report)
print(json.dumps({k:v for k,v in summary.items() if k!='pagesResults'},indent=2))
