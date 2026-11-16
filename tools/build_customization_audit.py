"""Build the atomic customization audit from browser evidence and reviewed proposals."""
from pathlib import Path
from collections import Counter
import csv, hashlib, html, json, re

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'audit/component-customization-2026-10-27'
data = json.loads((OUT / 'evidence.json').read_text())
tasks = json.loads((OUT / 'task-evidence.json').read_text())
requirements = json.loads((OUT / 'customization-requirements.json').read_text())
assert data['status'] == 'complete' and len(data['pages']) == 69
main_property_count=sum(len(page['controls']) for page in data['pages'])
for extra in tasks.get('additionalControls',[]):
    page=next(page for page in data['pages'] if page['file']==extra['file'])
    page['controls'].append(extra['control'])
    page['tests'].append(extra['test'])

def slug(value):
    return re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')

def cell(value):
    if isinstance(value, (dict, list, bool)):
        value = json.dumps(value, ensure_ascii=False)
    return str(value if value is not None else 'Not declared').replace('|', '\\|').replace('\n', ' ')

def table(headers, rows):
    return ['| ' + ' | '.join(headers) + ' |', '| ' + ' | '.join('---' for _ in headers) + ' |'] + ['| ' + ' | '.join(cell(v) for v in row) + ' |' for row in rows]

def sources(page):
    path = ROOT / page['file']
    lines = path.read_text().splitlines()
    scripts = re.findall(r'<script src="([^"]+-detail\.js)"', path.read_text())
    property_line = next((i for i, text in enumerate(lines, 1) if '>Properties<' in text), 1)
    evidence = []
    for script in scripts:
        for i, text in enumerate((ROOT / script).read_text().splitlines(), 1):
            if re.search(r'var\s+(?:OPTION_DATA|ROWS_DATA|TREE_DATA|SOURCE_ITEMS|TARGET_ITEMS|GRID_SUNDAY_START|TODAY_DAY|EVENT_DAYS|DEMO_FILE\w*)\s*=', text):
                evidence.append({'file':script, 'line':i, 'excerpt':text.strip()[:180]})
    return {'html':page['file'], 'propertyLine':property_line, 'scripts':scripts, 'fixtures':evidence}

common = [
    ('FLOW-01', 'P1', 'Save and reopen a configured component', 'Native detail-panel workflow', 'No tested native detail configuration survived reload; a separate contract editor exists.', 'Offer Save/Edit/Cancel around a canonical component contract. Returning to the detail page must render the saved revision, not silently restore the sample.', 'Save a label and a non-text property, reload, reopen, edit, cancel, and verify both the preview and copied outputs.'),
    ('FLOW-02', 'P1', 'One configuration across preview, prompt and code', 'Export parity', 'Several controls update the preview and prompt while legacy copied code remains unchanged.', 'Generate all outputs from the same selected contract/revision. Preserve explicit false, empty, numeric and selected values.', 'For every public property, change one value and compare preview, contract, prompt and executable example.'),
    ('FLOW-03', 'P1', 'Choose one instance versus comparing many states', 'Preview task flow', 'Most pages show fixed type/state matrices; four pages also have dedicated interactive mounts.', 'Separate Configure one instance from Compare states. Keep existing matrices available as documentation.', 'Choose one type/state, interact with it, then return to comparison without losing the chosen properties.'),
    ('FLOW-04', 'P1', 'Reset/undo with clear saved versus unsaved status', 'Editing recovery', 'Native Properties actions are primarily copy/export and an advanced-editor link.', 'Provide Reset to library/Foundations and undo for the current draft. Explain whether reset affects only the component.', 'Reset one component draft, cancel, and confirm the previous saved component and global Foundations are intact.'),
    ('FLOW-05', 'P1', 'Expose content/data, not just appearance', 'Information architecture', 'Complex data-driven components often expose only size/radius/labels.', 'Group controls into Content & data, Appearance, State & behavior, Accessibility, and Advanced. Include only relevant groups.', 'Complete the component-specific tasks below using the simple authoring surface without editing source or raw JSON.'),
    ('FLOW-06', 'P1', 'Explain Foundation inheritance and local overrides', 'Token policy', 'Foundation editors and local presets both exist; inherited versus explicit intent is not consistently presented as a choice.', 'Show inherited token/value and an explicit local-override action. Keep local overrides distinct from global Foundation edits.', 'Change a Foundation, confirm inherited components update and explicit local choices remain stable.'),
    ('FLOW-07', 'P1', 'Keep dependencies and invalid values understandable', 'Field usability', 'Conditional fields exist and several fields normalize/fall back, but there is no consistent authoring validation summary.', 'Reveal dependent fields near their trigger, explain requirements, and retain the last valid preview while invalid input is corrected.', 'Exercise blank, false, zero, invalid, long, Unicode and dependency-toggle cases and inspect export eligibility.'),
    ('FLOW-08', 'P2', 'Maintain property-to-preview proximity', 'Responsive layout', 'A non-overflowing page can still place the preview far below the property controls.', 'Use an accessible responsive inspector/stage layout or compact sticky actions; preserve a usable matrix scroll region.', 'At 320/390 px and zoom, change a field and find the changed specimen without losing the inspector or keyboard focus.'),
    ('FLOW-09', 'P2', 'Bound comparison expansion', 'Scale and orientation', 'Multiselect dimensions can generate a large Cartesian product of examples.', 'Display the combination count, provide a clear single-instance mode and warn or cap expensive expansions.', 'Exercise a documented upper bound and verify keyboard operation, response time, copy-menu clarity and recovery.'),
    ('FLOW-10', 'P2', 'Share the configured state', 'Collaboration', 'A plain page URL identifies the guide, not necessarily the configured instance.', 'Consider a versioned configuration link or explicit JSON contract attachment with a reviewed privacy boundary.', 'Open the shared state in a clean context and verify the exact values, version and missing assets are reported.'),
    ('FLOW-11', 'P1', 'Distinguish documentation from executable behavior', 'Expectation setting', 'Static states and four dedicated interaction mounts coexist with copyable implementation material.', 'Label static specimens and provide appropriate interaction demos for keyboard, selection, validation and overlays.', 'Test the actual interaction specified for the component, not only the presence of a row named Focused or Error.'),
    ('FLOW-12', 'P2', 'Make advanced contract editing a coherent continuation', 'Progressive disclosure', 'All 69 pages expose Edit component contract, but that is a separate authoring surface.', 'Open the same configuration in the editor, preserve stable IDs, and return the saved result to the originating detail view.', 'Edit a property in the advanced editor, save, return, and confirm the native detail preview/exports use that revision.')
]

pages, backlog, controls_csv, cases_csv, findings = [], [], [], [], []
all_cases = []
for number, page in enumerate(data['pages'], 1):
    stem = Path(page['file']).stem
    family = 'button' if stem.startswith('button-') else requirements['aliases'].get(stem, stem.removesuffix('-default'))
    src = sources(page)
    html_source = (ROOT / page['file']).read_text()
    interactive = re.findall(r'data-role="([^"]*(?:interactive|sandbox|playground)[^"]*)"', html_source)
    current_labels = [c['label'].lower() for c in page['controls']]
    proposals = []
    for prop in requirements['families'][family]:
        key = slug(prop['property'])
        assert prop['property'].lower() not in current_labels, (stem, prop['property'])
        item = {'id':'CAP-' + stem + '-' + key, 'component':page['name'], 'page':page['file'], 'family':family, 'findingType':'proposed detail-panel capability', 'currentCoverage':'No dedicated field in the native Properties inventory. Advanced contract authoring is a separate route.', **prop,
            'outputAcceptance':'Serialize this property by stable ID in the canonical contract, show its actual chosen value in the prompt, and make the generated implementation consume it. Do not leave the fixed example value in copied code.',
            'persistenceAcceptance':'Save as part of a component revision; reopen with the same value; cancelling an edit restores the saved value and does not alter workspace Foundations.',
            'accessibilityAcceptance':'The authoring control has a programmatic label and associated validation. The resulting component preserves its relevant role, accessible name, state and keyboard model.',
            'source':src['html'], 'sourceLine':src['propertyLine']}
        proposals.append(item)
        backlog.append(item)
    tests = {t['role'] or t['property']: t for t in page['tests']}
    for index, control in enumerate(page['controls'], 1):
        test = tests.get(control['role'] or control['label'], {})
        control_id = f'CTRL-{number:02d}-{index:02d}'
        controls_csv.append({'id':control_id,'component':page['name'],'page':page['file'],**control,'testedCases':len(test.get('cases',[]))})
        for case_number, case in enumerate(test.get('cases',[]),1):
            item={'id':f'{control_id}-T{case_number:02d}','page':page['file'],'component':page['name'],'property':control['label'],'role':control['role'],**case}
            cases_csv.append(item)
            all_cases.append(item)
        # Unique nonempty audit text missing from unchanged code is a reproducible omission.
        if control['type']=='text' and test.get('cases'):
            case=test['cases'][0]
            if case['previewDOMChanged'] and not case['codeChanged'] and isinstance(case['value'],str) and case['value'].startswith('Audit '):
                findings.append({'id':f'DEF-{number:02d}-{index:02d}','priority':'P1','page':page['file'],'component':page['name'],'property':control['label'],'type':'Current text omitted by legacy copied code','evidenceCase':f'{control_id}-T01','reproduction':f"Set {control['label']} to {case['value']!r}; wait for render; compare preview, Copy prompt and Copy code.",'actual':'Preview DOM changes and the prompt changes; copied legacy code is byte-identical after timestamp normalization. The unique new text therefore is not encoded in that copied output.','expected':'The configured text or a complete matching configured-instance API must be present in the copied implementation.','status':'Reproduced in browser; not repaired by this audit.'})
    unchanged=[t for t in page['tests'] if t['cases'] and any(not c['codeChanged'] for c in t['cases'])]
    combo_dims=[len(c['options']) for c in page['controls'] if c['type']=='multiselect']
    combinations=1
    for n in combo_dims: combinations*=n
    pages.append({**page,'family':family,'sourceEvidence':src,'interactiveMounts':interactive,'proposals':proposals,'unchangedCodeProperties':[t['property'] for t in unchanged], 'theoreticalCombinations':combinations if combo_dims else 1})

summary={
 'date':'2026-10-27','scope':'Native component detail customization and its handoff; not a full accessibility certification or participant usability study.',
 'pages':len(pages),'pagesWithSomeCustomization':sum(bool(p['controls']) for p in pages),'existingProperties':len(controls_csv),'mainPropertiesPanelFields':main_property_count,'additionalSectionFields':len(controls_csv)-main_property_count,'representativeChanges':len(all_cases),
 'proposedAtomicDetailCapabilities':len(backlog),'logicalFamilyRecommendations':sum(len(v) for v in requirements['families'].values()),'sharedWorkflowRecommendations':len(common),
 'confirmedTextExportOmissions':len(findings),'pagesWithConfirmedTextExportOmission':len({f['page']for f in findings}),
 'unchangedLegacyCodeCases':sum(not c['codeChanged'] for c in all_cases),'pagesWithSomeUnchangedLegacyCode':sum(bool(p['unchangedCodeProperties']) for p in pages),
 'previewDOMChangedCases':sum(c['previewDOMChanged'] for c in all_cases),'promptChangedCases':sum(c['promptChanged'] for c in all_cases),
 'reloadProbes':sum('reloadPersistence'in p for p in pages),'nativeReloadRetained':sum(p.get('reloadPersistence',{}).get('retained',False) for p in pages),
 'viewports':sum(len(p.get('viewports',[]))for p in pages),'viewportOverflowFindings':sum(v['documentOverflow']or v['mainOverflow'] for p in pages for v in p.get('viewports',[])),
 'keyboard':dict(Counter(k['status']for k in tasks['keyboard'])),'runtimeErrors':data['errors']+tasks['errors'],
 'implementationStatus':'Audit and implementation backlog only. New controls and export repairs are not implemented in this audit.'}
(OUT/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
(OUT/'atomic-backlog.json').write_text(json.dumps({'summary':summary,'sharedWorkflowRecommendations':[dict(zip(['id','priority','title','area','evidence','recommendation','acceptance'],x))for x in common],'confirmedDefects':findings,'capabilityBacklog':backlog,'components':pages},ensure_ascii=False,indent=2)+'\n')
source_names=set(['multiselect.js','foundation-runtime.js','foundation-model.js','component-contract-runtime.js','component-contract-model.js','component-editor.js','experience.js','shell.js'])
for p in pages:source_names.add(p['file']);source_names.update(p['sourceEvidence']['scripts'])
(OUT/'source-manifest.json').write_text(json.dumps({'date':'2026-10-27','hash':'sha256','files':{name:hashlib.sha256((ROOT/name).read_bytes()).hexdigest()for name in sorted(source_names)}},indent=2)+'\n')

def write_csv(name,rows):
    fields=list(dict.fromkeys(key for row in rows for key in row))
    with (OUT/name).open('w',newline='',encoding='utf-8-sig')as file:
        writer=csv.DictWriter(file,fieldnames=fields);writer.writeheader()
        for row in rows:writer.writerow({key:json.dumps(value,ensure_ascii=False)if isinstance(value,(list,dict))else value for key,value in row.items()})
write_csv('CONTROL-INVENTORY.csv',controls_csv)
write_csv('ATOMIC-CUSTOMIZATION-BACKLOG.csv',backlog)
write_csv('PROPERTY-TEST-CASES.csv',cases_csv)
write_csv('CONFIRMED-EXPORT-DEFECTS.csv',findings)

md=['# Damco Agentic Design System: component customization UX and usability audit','',
'**Date:** 27 October 2026  ',
'**Scope:** all 69 component detail pages, including all eight Button pages.  ',
'**Deliverable:** atomic inventory, reproducible defects, component-specific missing controls, UX improvements and acceptance criteria.  ',
'**Implementation status:** this is an audit and backlog. Proposed controls and export repairs have not been implemented by this audit.','',
'## 1. Main finding','',
'Every audited detail page has at least one customization property. The gap is **depth and task coverage**, not a complete absence of a Properties section. Many pages edit labels and visual presets while keeping data, current values, actions, validation and behavior fixed. A page with many comparison cells is not necessarily a component authoring tool.','',
'Button is a useful comparison because it exposes several meaningful appearance/content dimensions. It is not a complete standard: its native detail surface still lacks important instance controls, and changing its label does not update the legacy copied code. Do not force every component to have the same number or kind of controls as Button.','',
f"The audit recorded **{summary['existingProperties']} current properties**, **{summary['representativeChanges']} representative changes**, **{summary['proposedAtomicDetailCapabilities']} proposed page-specific capabilities**, and **{summary['sharedWorkflowRecommendations']} shared workflow improvements**. The page-specific count includes repeated Button-family recommendations across eight pages; it is not {summary['proposedAtomicDetailCapabilities']} unrelated new APIs.",'',
f"There are **{summary['confirmedTextExportOmissions']} reproduced text-export omissions on {summary['pagesWithConfirmedTextExportOmission']} pages**. Separately, {summary['unchangedLegacyCodeCases']} change cases across {summary['pagesWithSomeUnchangedLegacyCode']} pages produced unchanged legacy code. The broader number is a review queue, not an assertion that every unchanged output is a defect.",'',
'## 2. Evidence and interpretation','',
'The browser audit used fresh isolated storage, local Chromium, native input/change handlers, the application’s render delay, DOM/text/style snapshots, and intercepted clipboard writes. Every enumerated non-default option was exercised independently; text and numeric fields used representative values/bounds. Conditional Button accessible-label and Group Button fields were activated before checking them. Select all and duplicate unit-conversion controls are excluded from the property count.','',
f"The main Properties panels contain {main_property_count} fields. A separate whole-page scan found one additional configuration field, **Avatar.Group display**, in its own section; it was exercised separately and is included in the total. The 625 main-panel changes live in evidence.json; the additional Avatar.Group case lives in task-evidence.json. This existing selector is not mislabeled as missing.",'',
'The property pass is **not an exhaustive combinatorial interaction test**. It does not establish every keyboard pattern, every state combination, live service operation, Figma parity, assistive-technology support or all-theme visual fidelity. External fonts were blocked. Usability findings are evaluator observations and task walkthroughs, not measured participant success/time/error rates.','']
md+=table(['Evidence','Result'],[
 ('Detail pages with some native customization',f"{summary['pagesWithSomeCustomization']}/69"),('Current properties',summary['existingProperties']),('Representative changes',summary['representativeChanges']),('Changed prompt outputs',summary['promptChangedCases']),('Changed preview DOM cases',summary['previewDOMChangedCases']),('Unchanged legacy code cases',summary['unchangedLegacyCodeCases']),('Native reload probes retained',f"{summary['nativeReloadRetained']}/{summary['reloadProbes']}"),('Layout checks',f"{summary['viewports']} checks at 1440/390/320 px; {summary['viewportOverflowFindings']} document/main overflow findings"),('Shared multiselect keyboard smoke',f"{summary['keyboard'].get('pass',0)} pass; {summary['keyboard'].get('not-applicable',0)} pages without this control"),('Runtime errors',len(summary['runtimeErrors']))])
md+=['','Interpretation: a changed DOM does not alone prove meaningful visual or behavioral correctness. An unchanged DOM can be legitimate: raising Badge max count from 99 to 100 while the current count is 5 does not change its displayed value. Notification placement changes the specification but the inline matrix is not a screen-edge placement demo. These four no-DOM-change cases are not classified as inert controls.','',
'**Native detail reload results are not a claim that the whole application lacks saving.** All 69 pages offer the separate Component Contract Editor, which has saved contracts/drafts/revisions. The tested native detail configurations reset on reload and do not automatically consume those saved contracts.','',
'Useful files: [complete browser evidence](evidence.json), [concrete task evidence](task-evidence.json), [machine-readable atomic backlog](atomic-backlog.json), [current-control CSV](CONTROL-INVENTORY.csv), [capability-backlog CSV](ATOMIC-CUSTOMIZATION-BACKLOG.csv), [individual test-case CSV](PROPERTY-TEST-CASES.csv), [confirmed export defects CSV](CONFIRMED-EXPORT-DEFECTS.csv), [source hashes](source-manifest.json).','',
'## 3. Priority and finding types','',
'- **Confirmed defect:** an existing promised configuration is demonstrably lost or inconsistent. Reproduction and expected behavior are listed.','- **Capability gap:** no dedicated native detail field supports a relevant authoring task. Proposed API/control design requires implementation review. This is not automatically a standards violation.','- **Matrix-only coverage:** a type/state is shown in documentation but is not selectable as a single configured instance. It is not “missing from the library.”','- **Inherited Foundation setting:** a global design choice already exists. Prefer explicit inheritance/local token overrides to duplicating arbitrary color/font controls everywhere.','- **Advanced-editor route:** anatomy/JSON authoring exists outside the simple panel. It is a workaround, not evidence of a discoverable dedicated field or complete behavior implementation.','',
'**P1:** repair export mismatch or add core task authoring. **P2:** advanced/context-dependent authoring or workflow improvement; validate demand before increasing the panel. No outage or unsupported “critical” risk is invented to label all feature requests P0.','',
'## 4. Concrete task walkthroughs','']
for t in tasks['tasks']:
    md+=['### '+t['file']+' — '+t['task'],'']
    if 'value'in t:
        md += [f"Set `{t['property']}` to **{t['value']}**. Preview contains it: **{t['previewContainsValue']}**. Prompt contains it: **{t['promptContainsValue']}**. Legacy code contains it: **{t['codeContainsValue']}**.",'', 'Expected: the generated configured instance retains this text, or exposes a complete explicit value assignment. Current code does not match this chosen content.','']
    else:
        md+=['Observed evidence:','', '```json',json.dumps(t['observed'],ensure_ascii=False,indent=2),'```','']
md+=['Calendar’s “Month label” is currently literal display copy. Changing it to February 2028 leaves day labels in August/September/October 2026. This is a serious task-expectation gap if users believe they are configuring a real calendar month. Either add a real date model or clearly label the field/example as a static-caption-only specimen.','',
'Upload’s helper text describes a size/type policy, but no native policy authoring or file-picker interaction exists in that detail specimen. Editable helper copy is not enforceable validation. Table’s selection/sort/filter documentation likewise does not create a column, dataset or behavior editor.','',
'## 5. Shared workflow improvements','']
for fid,priority,title,area,evidence,recommendation,acceptance in common:
    md += [f'### {fid} · {priority} · {title}','',f'**Area:** {area}. **Observed:** {evidence}','',f'**Change:** {recommendation}','',f'**Acceptance:** {acceptance}','']
md+=['## 6. Components to optimize: complete 69-page list','', 'Every row has detailed atomic proposals later. The proposal count measures backlog entries, not a validated usability score. “Dedicated interaction mount” records explicit sandbox markup; absence does not prove every descendant element is non-interactive.','']
md+=table(['Component / detail page','Current properties','Fixed type/state columns and rows','Proposed capabilities','Dedicated interaction mount'],[(f"[{p['name']}](../../{p['file']})",len(p['controls']),f"{len(p['preview']['types'])} types / {len(p['preview']['states'])} states",len(p['proposals']),', '.join(p['interactiveMounts']) or 'None found')for p in pages])
md+=['','### Recommended implementation order','',
'1. Repair confirmed current-value export mismatches, beginning with the shared Button and form-family builders. Add a parity check for every exposed property before adding more controls.','2. Build a shared content/data editor primitive. Start with Select, Table, Tree/Tree Select, Cascader, List, Transfer and Calendar/Upload fixtures.','3. Add current value and semantic validation controls to form components: selected values, bounds, steps, required/error/help, read-only/disabled and loading where relevant.','4. Add configurable actions and real interaction specimens to Modal, Drawer, Popover/Pop Confirm, feedback, navigation and tours.','5. Connect native Properties, the saved contract and all outputs. Then improve single-instance/comparison mode, responsive proximity and collaboration.','',
'### Button comparison — use the pattern, not the raw field count','',
'Ordinary Button pages expose Size (8 choices), Content (5), Corner radius (5), Button label, and a conditional icon-only accessible label. The matrix shows eight types and six states. Selecting all three dimensions can theoretically create 200 combinations and 9,600 cells; that is a calculation, not a performance measurement. Other components need their own task properties: Table needs columns/rows, Upload needs file policies, Calendar needs actual dates, and Select needs options and selected values.','',
'## 7. Confirmed current-text export defects','',
'Each row below uses a unique audit text. It changes the preview and prompt, while the copied legacy code remains identical after normalizing timestamps. Therefore the new text is not serialized in that copied code. The three concrete label tasks above independently confirm this with real field fill and exact text lookup. These defects are recorded, not repaired by this audit.','']
md+=table(['Finding','Page','Property','Reproduce / evidence case'],[(f['id'],f['page'],f['property'],f['reproduction']+' / '+f['evidenceCase'])for f in findings])
md+=['','Other unchanged-code cases, including Boolean switches, placement, numeric values and count/row controls, are enumerated per component below and in the test CSV. Some require an interactive or non-Rest example to demonstrate the configured effect. Do not blindly turn each one into an identical “broken control” bug.','',
'## 8. Atomic component specifications and proposed improvements','',
'For each component: first review what actually exists, then the missing native-panel capabilities. Proposed defaults preserve current examples unless stated otherwise; they are suggestions, not already supported APIs. State/type coverage listed in the matrix does not equal editable data or behavior.','']

for number,p in enumerate(pages,1):
    src=p['sourceEvidence']
    md += [f"### {number:02d}. {p['name']} — {p['file']}",'',
        f"**Entry:** [{p['file']}](../../{p['file']}). **Category:** {p['category']}. **Native properties:** {len(p['controls'])}. **Proposed atomic capabilities:** {len(p['proposals'])}.",'',
        f"**Source:** Properties begins at HTML line {src['propertyLine']}; detail implementation: "+', '.join(f'[{s}](../../{s})'for s in src['scripts'])+'.','',
        '**Current property inventory (including conditional fields):','']
    rows=[]
    for index,c in enumerate(p['controls'],1):
        options='; '.join(f"{o['label']} = {o['value']}"for o in c['options'])or 'Free value / toggle'
        rules=f"min={c['min']}, max={c['max']}, step={c['step']}"if c['type']in('number','range')else ('Conditional prerequisite'if c['conditional']else 'Available by default')
        rows.append((f'CTRL-{number:02d}-{index:02d}',c['label'],c['role']or c['id']or 'Canonical dimension control',c['type'],c['value'],options,rules))
    md+=table(['Control ID','Property','DOM reference','Control','Current/default value','Available options','Bounds / dependency'],rows)
    secondary=[c for c in p['controls'] if c.get('location')]
    if secondary:md+=['','**Existing controls outside Properties:** '+', '.join(c['label']+' in '+c['location']for c in secondary)+'. These are included above, not counted as missing.']
    md+=['', '**Existing-control usability improvements:**','']
    for c in p['controls']:
        if c['type']=='multiselect': note='Explain whether this selects one configured value or multiple comparison combinations; show the combination count and retain the keyboard support that passed the smoke check.'
        elif c['type']=='text': note='Define empty-value/fallback behavior, appropriate text length and Unicode handling; use multiline editing for body/description content, and preserve the actual chosen text in outputs.'
        elif c['type']in('number','range'):note='Declare units and semantic bounds, distinguish zero from empty, and show normalization/validation feedback. Do not add an arbitrary product limit without a reason.'
        elif c['type']=='checkbox':note='Explain the visible scope and dependent fields; retain explicit true and false in the saved contract and configured code.'
        else:note='Keep one explicit selected value, explain dependencies and preserve the chosen option in preview, contract and generated output.'
        md.append(f"- **{c['label']}:** {note}")
    md+=['',f"**Preview coverage:** {', '.join(p['preview']['types']) or 'See captured evidence'}; states: {', '.join(p['preview']['states']) or 'See captured evidence'}. Default rendered cells: {p['preview']['cells']}. Dedicated interaction markup: {', '.join(p['interactiveMounts']) or 'none found'}.",'']
    if p['sourceEvidence']['fixtures']:
        md+=['**Fixed data/source evidence:**','']
        for f in p['sourceEvidence']['fixtures']:md.append(f"- [{f['file']}](../../{f['file']}), line {f['line']}: `{f['excerpt']}`")
        md+=['']
    test_cases=[c for t in p['tests']for c in t['cases']]
    md += [f"**Property-change evidence:** {len(test_cases)} cases; {sum(c['previewDOMChanged']for c in test_cases)} changed preview DOM; {sum(c['promptChanged']for c in test_cases)} changed prompt; {sum(c['codeChanged']for c in test_cases)} changed legacy code. These counts are signals, not independent correctness scores.",'']
    if p['unchangedCodeProperties']:md+=['**Unchanged-code review queue:** '+', '.join(dict.fromkeys(p['unchangedCodeProperties']))+'.','']
    reload=p.get('reloadPersistence')
    if reload:md += [f"**Reload probe:** changed {reload['property']} to `{cell(reload['changedValue'])}`; after reload observed `{cell(reload['reloadedValue'])}`. Retained: **{reload['retained']}**. Save/revision authoring currently lives in the separate contract editor.",'']
    mobile=next((v for v in p.get('viewports',[])if v['width']==390),None)
    if mobile:md += [f"**390 px geometry:** Properties top {mobile['propertiesTop']:.0f} px, height {mobile['propertiesHeight']:.0f} px; Live Preview top {mobile['previewTop']:.0f} px. Geometry is captured at the audit's scroll state and is not a measured participant task time.",'']
    md+=['**Missing or insufficiently exposed native-panel capabilities (design proposals):**','']
    for item in p['proposals']:
        md += [f"#### {item['id']} · {item['priority']} · {item['property']}",'',
            f"- **Current coverage:** {item['currentCoverage']}",
            f"- **Suggested control:** {item['control']}. **Proposed default:** {item['proposedDefault']}.",
            f"- **Validation / dependencies:** {item['validation']}",
            f"- **Preview acceptance:** {item['previewAcceptance']}",
            f"- **Prompt/code acceptance:** {item['outputAcceptance']}",
            f"- **Save/edit acceptance:** {item['persistenceAcceptance']}",
            f"- **Accessibility acceptance:** {item['accessibilityAcceptance']}",
            '- **Minimum checks:** a normal value, an invalid/boundary/dependency case, and save → reopen → edit → cancel. Test the component-specific semantic effect above, not only a changed JSON key.','']
    md+=['**Shared workflow dependencies:** FLOW-01 through FLOW-12 apply as relevant. Use the advanced contract editor as a migration path, not as proof that the native customization task is already solved.','',f"**Full evidence:** [{Path(p['file']).stem}.json](pages/{Path(p['file']).stem}.json).",'']

md+=['## 9. Suggested detail-page authoring model','',
'```text\nChoose component\n→ Configure one instance\n  → Content & data\n  → Appearance (inherit / local token override)\n  → State & behavior\n  → Accessibility\n→ Preview and interact\n→ Compare states when needed\n→ Save component revision\n→ Copy prompt / code / contract from that revision\n→ Reopen / edit / cancel / share\n```','',
'Use progressive disclosure for advanced settings. A native label/placeholder panel should not force users into raw JSON for core tasks like editing Select options, Table rows or Modal action labels. Keep rare implementation hooks in an advanced section. Avoid exposing arbitrary script execution as a customization field.','',
'A property should have a stable ID, semantic type, default, validation, dependency conditions, token/part binding and supported outputs. Content/data fields should use structured editors with stable item IDs. Styling should use approved tokens. Behavior should use declared intents/events and an explicit demo or adapter, not a claim of a connected service.','',
'## 10. Acceptance gates for implementation','',
'1. A user can complete each proposed core component task from the native detail authoring flow without source edits.','2. Each exposed value is validated and applies to the right preview parts. False, zero, empty values and hidden dependencies are not silently lost.','3. Prompt, saved contract, generated code and any adapter refer to the same configured revision and include the actual chosen values.','4. Save/reopen/edit/cancel/reset preserve component identity and do not overwrite global Foundations unintentionally.','5. Interactive widgets have meaningful keyboard/focus/selection/validation demos. A static Focused row is not keyboard verification.','6. The inspector and preview remain usable at small widths and zoom. Comparison expansion has a clear cost and exit route.','7. Missing assets, invalid data, unsupported behavior and unconnected services are reported honestly.','8. Test cases capture semantic outcomes, not only string changes. Preserve the current evidence and mark each backlog item implemented/verified separately.','',
'## 11. Accessibility reference basis','',
'Programmatic labels and associated instructions/errors guide the proposed editor controls. See [WAI Labeling Controls](https://www.w3.org/WAI/tutorials/forms/labels/) and [WAI Validating Input](https://www.w3.org/WAI/tutorials/forms/validation/). These references support labeling and validation expectations; they do not require a design tool to expose every proposed property.','',
'Interactive acceptance should use the appropriate pattern rather than visual resemblance. For example, tab activation/focus should follow the selected interaction model, and complex composite controls need their corresponding keyboard behavior. See [APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/), [Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), and [Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/). This audit is not WCAG certification.','',
'## 12. Continuation brief for another AI','',
'```text\nRead this report, atomic-backlog.json, task-evidence.json and the source manifest.\nPreserve the existing Damco HTML/CSS/JS application and user data.\nFirst reproduce and repair confirmed current-value export omissions.\nThen prioritize native core-data/current-value/validation/action controls by component.\nUse the saved component contract as the source for preview, prompt and code.\nDo not merely add unused form fields or label fixed example data as customizable.\nDo not count matrix states as selectable instance values or an advanced JSON editor\nas a complete native task flow. Keep Foundation inheritance explicit.\nFor every implemented backlog item, verify the semantic preview effect, exact\nexported value, save/reopen/edit/cancel, invalid/dependent input, and relevant\nkeyboard/focus behavior. Update the item status with evidence.\nDo not claim all proposed features are implemented just because the current\nbrowser page-smoke tests pass.\n```','']
(OUT/'COMPONENT-CUSTOMIZATION-UX-AUDIT.md').write_text('\n'.join(md),encoding='utf-8')

# Standalone searchable report: no third-party assets, scripts or network required.
cards=[]
for p in pages:
    controls=''.join('<tr><td>'+html.escape(c['label'])+'</td><td>'+html.escape(c['type'])+'</td><td>'+html.escape(cell(c['value']))+'</td><td>'+html.escape('; '.join(o['label']for o in c['options'])or 'Free value / toggle')+'</td></tr>'for c in p['controls'])
    props=''.join('<details><summary><b>'+html.escape(v['priority'])+'</b> '+html.escape(v['property'])+'</summary><p><b>Current:</b> '+html.escape(v['currentCoverage'])+'</p><p><b>Control:</b> '+html.escape(v['control'])+' · Default: '+html.escape(v['proposedDefault'])+'</p><p><b>Rules:</b> '+html.escape(v['validation'])+'</p><p><b>Preview:</b> '+html.escape(v['previewAcceptance'])+'</p><p><b>Outputs:</b> '+html.escape(v['outputAcceptance'])+'</p><p><b>Persistence:</b> '+html.escape(v['persistenceAcceptance'])+'</p><p><b>Accessibility:</b> '+html.escape(v['accessibilityAcceptance'])+'</p><code>'+html.escape(v['id'])+'</code></details>'for v in p['proposals'])
    warn='<p class="warning">Legacy code review: '+html.escape(', '.join(dict.fromkeys(p['unchangedCodeProperties'])))+'</p>'if p['unchangedCodeProperties']else ''
    cards.append('<section class="component" data-search="'+html.escape((p['name']+' '+p['category']+' '+' '.join(v['property']for v in p['proposals'])).lower(),quote=True)+'"><h2>'+html.escape(p['name'])+'</h2><p>'+html.escape(p['file'])+' · '+str(len(p['controls']))+' current properties · '+str(len(p['proposals']))+' proposed additions</p>'+warn+'<details><summary>Current controls</summary><div class="table-wrap"><table><thead><tr><th>Property</th><th>Control</th><th>Default</th><th>Options</th></tr></thead><tbody>'+controls+'</tbody></table></div></details>'+props+'<p><a href="pages/'+Path(p['file']).stem+'.json">Browser evidence JSON</a> · <a href="../../'+p['file']+'">Open component detail</a></p></section>')
doc='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Damco component customization UX audit — 27 October 2026</title><style>
:root{color-scheme:light dark;--bg:#f5f5f4;--panel:white;--ink:#171717;--line:#ccc;--accent:#a80015}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:28px 20px}h1{font-size:clamp(26px,5vw,42px);line-height:1.2}h2{margin-top:0}a{color:var(--accent)}.notice,.component{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:22px;margin:20px 0}.stats{display:flex;gap:20px;flex-wrap:wrap}.stats b{font-size:25px;display:block}label{font-weight:650}input{display:block;width:100%;font:inherit;padding:12px;border:1px solid var(--line);border-radius:8px;margin-top:8px;background:var(--panel);color:var(--ink)}details{border-top:1px solid var(--line);padding:12px 0}summary{cursor:pointer;min-height:36px}details p{margin:8px 0}code{overflow-wrap:anywhere;font-size:12px}.warning{border-inline-start:4px solid var(--accent);padding-left:12px}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;font-size:14px}td,th{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid var(--line)}[hidden]{display:none!important}:focus-visible{outline:3px solid var(--accent);outline-offset:4px}@media(prefers-color-scheme:dark){:root{--bg:#101113;--panel:#191b1f;--ink:#eee;--line:#50545a;--accent:#ff9baa}}@media print{input,label,#count{display:none}details{display:block}section{break-inside:avoid}body{background:white;color:black}}
</style><main><h1>Component customization UX audit</h1><p>Damco Agentic Design System · 27 October 2026 · All 69 component detail pages</p><div class="notice"><b>Audit and backlog — proposed controls are not implemented.</b><p>Every detail page has customization. Many expose only labels/appearance while data, values, actions and behavior remain fixed. The separate contract editor is available, but it does not make every native task complete.</p><div class="stats">STATS</div><p><a href="COMPONENT-CUSTOMIZATION-UX-AUDIT.md">Full atomic Markdown report</a> · <a href="ATOMIC-CUSTOMIZATION-BACKLOG.csv">Backlog CSV</a> · <a href="CONFIRMED-EXPORT-DEFECTS.csv">Confirmed export defects</a> · <a href="atomic-backlog.json">Complete JSON</a></p></div><label for="search">Find a component or missing capability<input id="search" type="search" placeholder="Try Table, options, validation, or Upload"></label><p id="count" role="status">69 components</p>CARDS<script>const search=document.getElementById('search'),rows=[...document.querySelectorAll('.component')];search.addEventListener('input',()=>{const query=search.value.toLowerCase().trim();let count=0;for(const row of rows){row.hidden=!row.dataset.search.includes(query);if(!row.hidden)count++;}document.getElementById('count').textContent=count+' components';});</script></main></html>'''
stats=''.join('<span><b>'+str(n)+'</b>'+label+'</span>'for n,label in [(len(pages),'pages'),(len(controls_csv),'current properties'),(len(all_cases),'changes checked'),(len(backlog),'proposed capabilities'),(len(findings),'text-export omissions')])
(OUT/'REPORT.html').write_text(doc.replace('STATS',stats).replace('CARDS',''.join(cards)),encoding='utf-8')
(OUT/'inventory.json').write_text(json.dumps({'date':'2026-10-27','status':'complete','scope':'Native customization controls across main Properties and secondary configuration sections','generatedFrom':['evidence.json','task-evidence.json'],'pages':[{key:value for key,value in p.items()if key not in ['tests','proposals']}for p in pages]},ensure_ascii=False,indent=2)+'\n')
for p in pages:
    (OUT/'pages'/(Path(p['file']).stem+'.json')).write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({**summary,'markdownLines':len(md),'markdownBytes':(OUT/'COMPONENT-CUSTOMIZATION-UX-AUDIT.md').stat().st_size},indent=2))
