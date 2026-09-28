"""Generate changelog.js from CHANGELOG.md, so the real, already-
maintained changelog can be displayed as a real page (changelog.html)
instead of every component page claiming "Changelog: not yet tracked."
Loaded via a plain <script src> (not fetch), same reasoning as
docs-catalog.js: fetch() is blocked under file://, a <script> tag isn't.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def run():
    text = (ROOT / "CHANGELOG.md").read_text()
    # Split on "## " headers, keeping the title of each section.
    parts = re.split(r"\n## ", text)
    entries = []
    known_gaps = None
    for part in parts[1:]:  # parts[0] is the doc's own H1 intro, not a section
        title, _, body = part.partition("\n")
        body = body.strip()
        if title.strip().startswith("Known follow-ups"):
            known_gaps = body
            continue
        entries.append({"title": title.strip(), "body": body})
    entries.reverse()  # newest first for display; file itself is oldest-first

    out = {"entries": entries, "knownGaps": known_gaps}
    (ROOT / "changelog.js").write_text(
        "window.ADSChangelog = " + json.dumps(out, ensure_ascii=False) + ";\n"
    )
    print(json.dumps({"entries": len(entries), "has_known_gaps": known_gaps is not None}, indent=2))


if __name__ == "__main__":
    run()
