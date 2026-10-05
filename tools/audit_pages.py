"""Rebuild the local documentation catalog and repeatable static page audit."""
import hashlib
import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / 'docs-catalog-manifest.json'


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.main = False
        self.skip = 0
        self.parts = []
        self.ids = []
        self.links = []
        self.assets = []
        self.headings = []
        self.heading = None
        self.h1 = 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag == 'script' and a.get('src'):
            self.assets.append(a['src'])
        if tag == 'link' and a.get('rel') == 'stylesheet':
            self.assets.append(a.get('href', ''))
        if tag == 'main':
            self.main = True
        if self.main:
            if tag in ('script', 'style'):
                self.skip += 1
            if tag == 'h1':
                self.h1 += 1
            if tag in ('h1', 'h2', 'h3') or 'panel-title' in a.get('class', '').split():
                self.heading = []
                self.parts.append('\n\n' + ('#' * int(tag[1]) if tag.startswith('h') else '##') + ' ')
            elif tag in ('p', 'section', 'div', 'pre', 'br'):
                self.parts.append('\n')
            elif tag == 'li':
                self.parts.append('\n- ')

    def handle_endtag(self, tag):
        if tag == 'main':
            self.main = False
        if tag in ('script', 'style') and self.skip:
            self.skip -= 1
        if self.heading is not None and tag in ('h1', 'h2', 'h3', 'p'):
            self.headings.append(' '.join(''.join(self.heading).split()))
            self.heading = None

    def handle_data(self, text):
        if self.main and not self.skip:
            self.parts.append(text)
            if self.heading is not None:
                self.heading.append(text)


def source_hash(sources):
    """One hash over every page's raw HTML, in a stable (sorted) order -
    changes the moment any page's content changes, regardless of which
    one. Used to detect a stale catalog: regenerate, then compare the old
    manifest's hash against this to know whether anything actually
    changed, rather than eyeballing a diff."""
    h = hashlib.sha256()
    for name in sorted(sources):
        h.update(name.encode())
        h.update(sources[name].encode())
    return h.hexdigest()


def check():
    """Fails (exit 1) if docs-catalog.json is stale relative to the current
    HTML sources - the "fail release on stale/missing sections" check this
    generator didn't have before. Run this in CI/pre-release, not instead
    of regenerating; it only detects staleness, it doesn't fix it."""
    sources = {p.name: p.read_text() for p in sorted(ROOT.glob('*.html'))}
    current_hash = source_hash(sources)
    if not MANIFEST_PATH.exists():
        print('STALE: no docs-catalog-manifest.json - run `python3 tools/audit_pages.py` to generate one.')
        return 1
    manifest = json.loads(MANIFEST_PATH.read_text())
    if manifest.get('sourceHash') != current_hash:
        print('STALE: docs-catalog.json does not match the current HTML sources - re-run `python3 tools/audit_pages.py`.')
        return 1
    if manifest.get('pageCount') != len(sources):
        print(f"STALE: manifest page count ({manifest.get('pageCount')}) does not match current page count ({len(sources)}).")
        return 1
    print(json.dumps({'status': 'fresh', 'generatedAt': manifest.get('generatedAt'), 'pageCount': manifest.get('pageCount')}, indent=2))
    return 0


def run():
    import datetime
    pages_raw = {p.name: p.read_text() for p in sorted(ROOT.glob('*.html'))}
    pages = {name: Page(src) for name, src in pages_raw.items()}
    catalog, report = [], []
    for name, page in pages.items():
        source = (ROOT / name).read_text()
        issues = []
        if page.h1 != 1:
            issues.append(f'{page.h1} primary headings')
        duplicates = [k for k, n in Counter(page.ids).items() if n > 1]
        if duplicates:
            issues.append('Duplicate IDs: ' + ', '.join(duplicates))
        broken = []
        for href in page.links + page.assets:
            u = urlsplit(href)
            if u.scheme or u.netloc or not u.path and not u.fragment:
                continue
            target = unquote(u.path) or name
            if not (ROOT / target).exists():
                broken.append(href)
            elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:
                broken.append(href)
        if broken:
            issues.append('Broken references: ' + ', '.join(sorted(set(broken))))
        kind = 'Detail' if 'class="back-link"' in source else 'Listing' if 'data-system=' in source else 'Tab'
        body = re.sub(r'\n[ \t]*\n(?:[ \t]*\n)+', '\n\n', ''.join(page.parts)).strip()
        status = 'Reference / planned' if 'Mockup</span>' in source or 'Not built yet' in body else 'Available'
        catalog.append(dict(file=name, title=page.headings[0] if page.headings else name, kind=kind, status=status, markdown=body))
        report.append(dict(file=name, kind=kind, status=status, sections=page.headings, issues=issues, bytes=(ROOT / name).stat().st_size))
    (ROOT / 'docs-catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')
    # Loaded via a plain <script src> (not fetch) so MD Export works when the
    # portal is opened directly as a file:// page, not just over http(s)://
    # - fetch() is blocked against local files by every browser, but a
    # <script> tag isn't subject to that restriction.
    (ROOT / 'docs-catalog.js').write_text('window.ADSDocsCatalog = ' + json.dumps(catalog, ensure_ascii=False) + ';\n')
    (ROOT / 'audit' / 'page-inventory.json').write_text(json.dumps(report, indent=2) + '\n')
    lines = ['# Page-by-page source audit', '', 'Generated by `python3 tools/audit_pages.py`. Source checks cover every HTML page, local link target, local script/style asset, duplicate ID, primary heading and section inventory. These checks do not certify visual layout or accessibility.', '', '| Page | Type | State | Source findings |', '| --- | --- | --- | --- |']
    for r in report:
        lines.append(f"| [{r['file']}](../{r['file']}) | {r['kind']} | {r['status']} | {'; '.join(r['issues']) or 'Source checks passed'} |")
    (ROOT / 'audit' / 'page-inventory.md').write_text('\n'.join(lines) + '\n')
    manifest = {
        'generatedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'sourceHash': source_hash(pages_raw),
        'pageCount': len(pages_raw),
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps({'pages': len(pages), 'kinds': dict(Counter(r['kind'] for r in report)), 'pagesWithSourceIssues': sum(bool(r['issues']) for r in report)}, indent=2))


if __name__ == '__main__':
    if '--check' in sys.argv:
        sys.exit(check())
    run()
