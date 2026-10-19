"""Reconcile every original finding with source fixes and explicitly pending acceptance."""
import json
import re
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
partial={'X10','NP08','C04','C10','G02','G06','G07','T07','T08','B02','B04','H03','I03','I07'}
evidence={
 'X':'Shared resolver, schemaVersion migration/recovery, current exports, typed DTCG consumer, generated contracts and ownership/deprecation policy.',
 'NP':'Explicit draft/profile recovery, safe text insertion, validation and step routing, before/after recommendations, role routes, nine-section readiness and full handoff.',
 'C':'Independent brand/status/surface settings, semantic aliases, foreground contrast model, compositing/scope guidance and documented derivation.',
 'G':'Validated geometry, independent baseline, per-platform export profiles, container/span/overflow rules, documented breakpoints/patterns/panes and shared sizing.',
 'T':'Standard H1–H6, complete role metrics, readable default text colors, font loading/recovery, preset diff/Undo, responsive/semantic rules and full handoff.',
 'S':'Shared spacing resolver, explicit Adaptive algorithm, relationship aliases, density/target separation, logical/native exceptions and current unit exports.',
 'R':'Fixed numeric primitives and effective semantic aliases, philosophy mapping, corrected border-plus-padding nested cap and exported role/attachment rules.',
 'B':'Validated base controls, fixed-state geometry labelled accurately, semantic state defaults, isolated focus, logical edges and combined-state/forced-color/export guidance.',
 'H':'Resolved shadow philosophies, typed composite imports, corrected XS examples, static/elevated/interactive card distinction and layer/portal/print/dark guidance.',
 'I':'Persisted bounded references, keyboard access, duplicate/read/decode recovery, named licensed catalog/API, inert SVG references, glyph/target separation and semantic/RTL rules.',
 'A':'Honest local decisions and neutral rejection, tested lifecycle/streaming/Stop/Retry, unknown confidence, approval scope, provenance/privacy and portable agent rules.'
}
reference={
 'X':'foundation-model.js; foundation-runtime.js; shell.js; foundation-contract.json; tools/dtcg-import.cjs; tests/foundation-release.test.cjs',
 'NP':'new-project.html#implementation-contract; experience.js; project-model.js; audit/pending-tasks-2026-10-08.json',
 'C':'foundations.html#implementation-contract; foundations.js; foundation-model.js; tests/foundation-model.test.cjs',
 'G':'grid-layout.html#implementation-contract; grid-layout.js; foundation-model.js; tests/foundation-release.test.cjs',
 'T':'typography.html#implementation-contract; typography.js; foundation-model.js; tests/foundation-release.test.cjs',
 'S':'spacing.html#implementation-contract; spacing.js; foundation-model.js; tests/foundation-model.test.cjs',
 'R':'radius.html#implementation-contract; radius.js; foundation-model.js; tests/foundation-model.test.cjs',
 'B':'borders.html#implementation-contract; borders.js; foundation-model.js; tests/foundation-model.test.cjs',
 'H':'shadows.html#implementation-contract; foundation-model.js; tools/dtcg-import.cjs; tests/foundation-release.test.cjs',
 'I':'icons.html#implementation-contract; icons.js; icon-catalog.json; foundation-model.js; audit/pending-tasks-2026-10-08.json',
 'A':'ai-foundation.html#implementation-contract; ai-foundation.js; agent-model.js; foundation-contract.json; audit/pending-tasks-2026-10-08.json'
}
pending={
 'X10':'Attach actual viewport, zoom, forced-color, recipient and assistive-technology release evidence. Native rendering and live external agents are separate adapters, explicitly outside this web demo.',
 'NP08':'Verify setup with soft keyboard, long/localized labels, split windows and 200% zoom.',
 'C04':'Compare actual rendered role/surface/tint/state pairs. Model and scoped swatch checks do not certify every component.',
 'C10':'Verify picker clipping, actual range announcements, keyboard focus return and narrow positioning.',
 'G02':'Measure documented breakpoint/container boundaries and compatibility exceptions in a real renderer.',
 'G06':'Verify each consumer pattern at wide/narrow widths, including selected-record, empty/loading/error and focus-return states.',
 'G07':'Verify real Splitter/Affix/Table panes, min/max resizing, keyboard, persistence and overlay collision.',
 'T07':'Verify rendered scripts, expansion, user text-spacing overrides and customized text/surface pairs; default pair math passes.',
 'T08':'Verify real font decoding, network failure/retry, supported faces, synthesis and fallback metrics.',
 'B02':'Measure control geometry through focus/error/selected transitions; no-layout outlines are implemented.',
 'B04':'Verify composited essential boundaries and unobscured focus in forced colors and custom themes.',
 'H03':'Verify actual custom-dark adjacency, borders/backdrops and forced-color/print fallbacks.',
 'I03':'Verify malformed/valid asset decoding and error feedback in a real image engine. References are inert; only reviewed catalog glyphs may be inlined.',
 'I07':'Verify actual-size optical bounds, stroke scaling, clipping and hit areas across styles/devices.'
}
rows=[]
individual=json.loads((ROOT/'audit/foundation-finding-evidence-2026-10-08.json').read_text())['findings']
source=(ROOT/'foundation-audit-report-2026-10-05.md').read_text()
for m in re.finditer(r'#### ([A-Z]+\d+) (P[12])\n([\s\S]*?)(?=\n#### |\n## |\n### |$)',source):
 ident,priority=m[1],m[2];prefix=re.match(r'[A-Z]+',ident)[0]
 def field(name):
  match=re.search(r'^- \*\*'+re.escape(name)+r':\*\* (.*)$',m[3],re.M)
  return match[1] if match else ''
 proof=individual[ident]
 assert all((ROOT/path).is_file() for path in proof['references']),ident
 rows.append({'id':ident,'section':field('Section'),'priority':priority,'status':'Partial' if ident in partial else 'Implemented','currentEvidence':proof['evidence'],'reference':'; '.join(proof['references']+[reference[prefix]]),'remaining':pending.get(ident,'Source/documentation fix present; include this specific requirement in release acceptance.')})
assert len(rows)==100 and len({r['id'] for r in rows})==100
assert set(individual)=={r['id'] for r in rows},'Evidence must match all original IDs exactly'
out={'date':'2026-10-08','scope':'Original 100 findings; implemented means source/documentation requirement present, not production certification','browser':'Unavailable: browser connection lists no browsers','findings':rows,'counts':{status:sum(r['status']==status for r in rows) for status in ['Implemented','Partial']}}
(ROOT/'audit/foundation-task-status-2026-10-08.json').write_text(json.dumps(out,indent=2)+'\n')
lines=['# Original Foundation findings: current implementation status','','All 100 IDs are reconciled. Implemented means the source/documentation requirement is present. Partial identifies a remaining acceptance requirement; no unavailable browser, font or screen-reader check is marked passed.','','| ID | Priority | Status | Current reference | Remaining task / guide |','| --- | --- | --- | --- | --- |']
for row in rows:lines.append('| '+row['id']+' | '+row['priority']+' | '+row['status']+' | '+row['reference']+' | '+row['remaining']+' |')
(ROOT/'foundation-finding-status-2026-10-08.md').write_text('\n'.join(lines)+'\n')
print(json.dumps(out['counts']))
