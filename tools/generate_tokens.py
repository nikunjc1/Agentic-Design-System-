"""Generate design-tokens.json from theme.css - the W3C Design Tokens
Community Group format (https://tr.designtokens.org/format/), so a
real design tool or an AI coding agent can consume this system's
tokens as data instead of copying literal values out of a page's
prose. theme.css stays the single source of truth; this script only
reads it, it never needs to be edited by hand alongside it.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "design-tokens-manifest.json"

# CSS keyword easings, expressed as the cubic-bezier control points they
# are defined to mean - not invented, these are the standard CSS values.
EASE_KEYWORDS = {
    "ease": [0.25, 0.1, 0.25, 1.0],
    "linear": [0.0, 0.0, 1.0, 1.0],
    "ease-in": [0.42, 0.0, 1.0, 1.0],
    "ease-out": [0.0, 0.0, 0.58, 1.0],
    "ease-in-out": [0.42, 0.0, 0.58, 1.0],
}

COLOR_PREFIXES = (
    "graphite", "control-border", "line", "text-hi", "text-mid", "text-dim",
    "overlay-invert", "overlay-scrim", "red", "green", "amber", "danger", "blue",
    "brand", "surface",
)

# Published DTCG version this generator targets - pinned explicitly so
# the interoperability claim in $description is actually testable
# against one real spec revision, not an unversioned moving target.
DTCG_VERSION = "2025.10"

DIMENSION_RE = re.compile(r"^(-?[0-9.]+)(px|rem|em)$")
ALIAS_RE = re.compile(r"^var\((--[a-z0-9-]+)\)$")


def strip_comments(css):
    # A property declared right after a /* comment */ on the previous line
    # sits in the same semicolon-delimited chunk as that comment - split
    # naively without stripping comments first, and the whole chunk fails
    # a startswith("--") check, silently dropping that one property. Every
    # token whose declaration follows a comment (which, in this file, is
    # most of them) needs comments gone before anything else runs.
    return re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)


def parse_root_block(css, selector):
    """Return {name: raw_value} for every --custom-property inside one
    selector's braces (e.g. ':root' or ':root[data-theme=\"light\"]')."""
    css = strip_comments(css)
    pattern = re.escape(selector) + r"\{([^}]*)\}"
    match = re.search(pattern, css, re.DOTALL)
    if not match:
        return {}
    body = match.group(1)
    props = {}
    for line in body.split(";"):
        line = line.strip()
        if not line.startswith("--"):
            continue
        name, _, value = line.partition(":")
        props[name.strip()] = value.strip()
    return props


def token_group(name):
    if name.startswith(COLOR_PREFIXES):
        return "color"
    if name.startswith("space"):
        return "space"
    if name.startswith("shadow"):
        return "shadow"
    if name.startswith("radius"):
        return "radius"
    if name.startswith("font"):
        return "font"
    if name.startswith("duration"):
        return "motion"
    if name.startswith("ease"):
        return "motion"
    return "other"


def parse_shadow(value):
    if value.strip() == "none":
        return {"$type": "other", "$value": "none"}
    match = re.match(
        r"([\-0-9.]+)(?:px)?\s+([\-0-9.]+)px\s+([\-0-9.]+)px\s+(rgba?\([^)]+\))",
        value.strip(),
    )
    if not match:
        return {"$type": "other", "$value": value}
    offset_x, offset_y, blur, color = match.groups()
    dim = lambda n: {"value": float(n) if "." in n else int(n), "unit": "px"}
    return {
        "$type": "shadow",
        "$value": {
            "color": color,
            "offsetX": dim(offset_x),
            "offsetY": dim(offset_y),
            "blur": dim(blur),
            "spread": dim("0"),
        },
    }


def parse_font_family(value):
    parts = [p.strip().strip('"') for p in value.split(",")]
    return {"$type": "fontFamily", "$value": parts}


# DTCG's real duration/dimension types are typed {value, unit} objects
# (https://tr.designtokens.org/format/2025.10/#duration, #dimension) -
# not a bare CSS string. A string like "200ms" or "4px" passes a quick
# glance but fails any consumer that actually validates against the
# published schema, which was the whole point of claiming this format.
def parse_duration(value):
    value = value.strip()
    if value.endswith("ms"):
        return {"$type": "duration", "$value": {"value": float(value[:-2]) if "." in value[:-2] else int(value[:-2]), "unit": "ms"}}
    if value.endswith("s"):
        ms = float(value[:-1]) * 1000
        return {"$type": "duration", "$value": {"value": ms if ms % 1 else int(ms), "unit": "ms"}}
    return {"$type": "other", "$value": value}


def parse_dimension(value):
    match = DIMENSION_RE.match(value.strip())
    if not match:
        return {"$type": "other", "$value": value}
    num, unit = match.groups()
    return {"$type": "dimension", "$value": {"value": float(num) if "." in num else int(num), "unit": unit}}


def parse_ease(value):
    value = value.strip()
    if value in EASE_KEYWORDS:
        return {"$type": "cubicBezier", "$value": EASE_KEYWORDS[value]}
    return {"$type": "other", "$value": value}


def alias_reference(value, dark):
    """A token whose own value is var(--other-token) is an alias, not a
    literal - DTCG's reference syntax ({group.key}) points at the other
    token instead of repeating its value, so the two can never drift
    silently out of sync in anything that actually resolves references
    (this JSON file, read in isolation, cannot - a real DTCG resolver
    is what makes the link live)."""
    match = ALIAS_RE.match(value.strip())
    if not match:
        return None
    ref_name = match.group(1)[2:]  # strip leading "--"
    ref_group = token_group(ref_name)
    return ref_group, f"{{{ref_group}.{ref_name}}}"


def build_token(name, dark_value, light_value):
    group = token_group(name)
    alias = alias_reference(dark_value, dark_value)
    if alias:
        ref_group, ref_path = alias
        token = {"$type": "color" if ref_group == "color" else group, "$value": ref_path}
    elif group == "color":
        token = {"$type": "color", "$value": dark_value}
    elif group == "space" or group == "radius":
        token = parse_dimension(dark_value)
    elif group == "shadow":
        token = parse_shadow(dark_value)
    elif group == "font":
        token = parse_font_family(dark_value)
    elif group == "motion" and name.startswith("duration"):
        token = parse_duration(dark_value)
    elif group == "motion":
        token = parse_ease(dark_value)
    else:
        token = {"$type": "other", "$value": dark_value}

    if light_value is not None and light_value != dark_value:
        light_alias = alias_reference(light_value, light_value)
        token["$extensions"] = {
            "com.agentic-design-system.mode": {
                "dark": alias[1] if alias else dark_value,
                "light": light_alias[1] if light_alias else light_value,
            }
        }
    return token


def check():
    """Fails (exit 1) if design-tokens.json is stale relative to the
    current theme.css - mirrors tools/audit_pages.py --check for the
    docs catalog (Foundation audit X01), applied to the token artifact
    (X03)."""
    css = (ROOT / "theme.css").read_text()
    current_hash = hashlib.sha256(css.encode()).hexdigest()
    if not MANIFEST_PATH.exists():
        print("STALE: no design-tokens-manifest.json - run `python3 tools/generate_tokens.py` to generate one.")
        return 1
    manifest = json.loads(MANIFEST_PATH.read_text())
    if manifest.get("sourceHash") != current_hash:
        print("STALE: design-tokens.json does not match the current theme.css - re-run `python3 tools/generate_tokens.py`.")
        return 1
    print(json.dumps({"status": "fresh", "generatedAt": manifest.get("generatedAt"), "tokenCount": manifest.get("tokenCount")}, indent=2))
    return 0


def run():
    import datetime
    css = (ROOT / "theme.css").read_text()
    dark = parse_root_block(css, ":root")
    light = parse_root_block(css, ':root[data-theme="light"]')

    tokens = {}
    for name, dark_value in dark.items():
        key = name[2:]  # strip leading "--"
        group = token_group(key)
        tokens.setdefault(group, {})[key] = build_token(key, dark_value, light.get(name))

    out = {
        "$description": (
            f"Agentic Design System tokens, generated from theme.css by tools/generate_tokens.py - do not hand-edit, "
            f"regenerate instead. Follows the Design Tokens Community Group Format Module, version {DTCG_VERSION} "
            f"(https://tr.designtokens.org/format/{DTCG_VERSION}/) - a Community Group specification, not a W3C "
            f"Recommendation. dimension/duration values are typed {{value, unit}} objects per spec, not raw CSS "
            f"strings; a token whose source is a CSS var() reference to another token is emitted as a DTCG alias "
            f"({{group.key}}) instead of a repeated literal. Tokens that differ between themes carry both values "
            f"under $extensions['com.agentic-design-system.mode']; $value is always the dark-theme (default) value."
        ),
        **tokens,
    }
    (ROOT / "design-tokens.json").write_text(json.dumps(out, indent=2) + "\n")
    counts = {group: len(t) for group, t in tokens.items()}
    total = sum(counts.values())
    manifest = {
        "generatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "sourceHash": hashlib.sha256(css.encode()).hexdigest(),
        "tokenCount": total,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({"tokens_written": total, "by_group": counts}, indent=2))


if __name__ == "__main__":
    if "--check" in sys.argv:
        sys.exit(check())
    run()
