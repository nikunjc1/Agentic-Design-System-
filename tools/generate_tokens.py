"""Generate design-tokens.json from the shared Foundation defaults - the Design Tokens
Community Group format (https://tr.designtokens.org/format/), so a
real design tool or an AI coding agent can consume this system's
tokens as data instead of copying literal values out of a page's
prose. theme.css supplies primitives; foundation-model.js resolves semantic
and derived defaults. Both themes are published, with source freshness checks.
"""
import hashlib
import json
import re
import sys
import subprocess
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
    "brand", "surface", "color-ai", "color-agent",
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
        return {"$type":"shadow","$value":{"color":parse_color('rgba(0,0,0,0)'),"offsetX":{"value":0,"unit":"px"},"offsetY":{"value":0,"unit":"px"},"blur":{"value":0,"unit":"px"},"spread":{"value":0,"unit":"px"}}}
    match = re.match(
        r"([\-0-9.]+)(?:px)?\s+([\-0-9.]+)px\s+([\-0-9.]+)px\s+(rgba?\([^)]+\))",
        value.strip(),
    )
    if not match:
        raise ValueError('Unsupported shadow: '+value)
    offset_x, offset_y, blur, color = match.groups()
    dim = lambda n: {"value": float(n) if "." in n else int(n), "unit": "px"}
    return {
        "$type": "shadow",
        "$value": {
            "color": parse_color(color),
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
    raise ValueError('Unsupported duration: '+value)


def parse_dimension(value):
    match = DIMENSION_RE.match(value.strip())
    if not match:
        raise ValueError('Unsupported dimension: '+value)
    num, unit = match.groups()
    return {"$type": "dimension", "$value": {"value": float(num) if "." in num else int(num), "unit": unit}}


def parse_ease(value):
    value = value.strip()
    if value in EASE_KEYWORDS:
        return {"$type": "cubicBezier", "$value": EASE_KEYWORDS[value]}
    raise ValueError('Unsupported easing: '+value)


def parse_color(value):
    if re.fullmatch(r'#[0-9a-fA-F]{6}',value):
        return {"colorSpace":"srgb","components":[int(value[i:i+2],16)/255 for i in (1,3,5)],"alpha":1,"hex":value}
    match=re.fullmatch(r'rgba?\(([^)]+)\)',value)
    if match:
        parts=[float(v.strip()) for v in match.group(1).split(',')]
        return {"colorSpace":"srgb","components":[v/255 for v in parts[:3]],"alpha":parts[3] if len(parts)==4 else 1}
    raise ValueError('Unsupported color: '+value)


def typed_literal(name,value):
    if name.startswith('shadow'): return parse_shadow(value)
    if value.startswith('#') or re.fullmatch(r'rgba?\([^)]+\)',value): return {"$type":"color","$value":parse_color(value)}
    if name.startswith('font'): return parse_font_family(value)
    if name.startswith('duration'): return parse_duration(value)
    if name.startswith('ease'): return parse_ease(value)
    if re.fullmatch(r'-?[0-9.]+(?:px|rem)',value): return parse_dimension(value)
    if re.fullmatch(r'-?[0-9.]+',value): return {"$type":"number","$value":float(value)}
    if re.fullmatch(r'-?[0-9.]+em',value): return {"$type":"number","$value":float(value[:-2]),"$extensions":{"com.agentic-design-system.relative-unit":"em"}}
    return None


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


def build_token(name, dark_value, light_value, source=None):
    group = token_group(name)
    alias = alias_reference(dark_value, dark_value)
    if alias:
        ref_group, ref_path = alias
        target=ALIAS_RE.match(dark_value).group(1);seen=set()
        while source and ALIAS_RE.match(source.get(target,'')):
            if target in seen: raise ValueError('Cyclic alias: '+name)
            seen.add(target);target=ALIAS_RE.match(source[target]).group(1)
        literal=typed_literal(target[2:],source.get(target,'') if source else '')
        if literal is None: return None
        token = {"$type":literal['$type'],"$value":ref_path}
    else:
        token=typed_literal(name,dark_value)
    if token is None: return None

    if light_value is not None and light_value != dark_value:
        light_alias = alias_reference(light_value, light_value)
        token.setdefault("$extensions",{}).update({
            "com.agentic-design-system.mode": {
                "dark": token['$value'],
                "light": light_alias[1] if light_alias else typed_literal(name,light_value)['$value'],
            }
        })
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
    expected,_=build_document(css)
    generator_hash=hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    if manifest.get("sourceHash") != current_hash or manifest.get('sourceHashes') != source_hashes() or manifest.get('generatorHash')!=generator_hash or not (ROOT/'design-tokens.json').exists() or json.loads((ROOT/'design-tokens.json').read_text())!=expected:
        print("STALE: design-tokens.json does not match the current theme.css - re-run `python3 tools/generate_tokens.py`.")
        return 1
    print(json.dumps({"status": "fresh", "generatedAt": manifest.get("generatedAt"), "tokenCount": manifest.get("tokenCount")}, indent=2))
    return 0


def source_hashes():
    return {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
            for name in ['theme.css', 'foundation-model.js', 'foundation-contract.json']}


def build_document(css):
    # Publish the same default system that the portal applies, including
    # semantic typography, sizing, grid geometry, borders and agent roles.
    # Reading theme.css alone silently omitted those runtime-derived tokens.
    program = "const M=require('./foundation-model.js');console.log(JSON.stringify({dark:M.resolve({},'dark').tokens,light:M.resolve({},'light').tokens}));"
    modes = json.loads(subprocess.check_output(['node', '-e', program], cwd=ROOT, text=True))
    dark, light = modes['dark'], modes['light']

    tokens = {};css_only={}
    for name, dark_value in dark.items():
        key = name[2:]  # strip leading "--"
        group = token_group(key)
        token=build_token(key,dark_value,light.get(name),dark)
        if token is None: css_only[key]={"dark":dark_value,"light":light.get(name,dark_value)}
        else: tokens.setdefault(group, {})[key]=token

    out = {
        "$description": (
            f"Agentic Design System default tokens, generated from the shared Foundation resolver by tools/generate_tokens.py - do not hand-edit, "
            f"regenerate instead. Follows the Design Tokens Community Group Format Module, version {DTCG_VERSION} "
            f"(https://tr.designtokens.org/format/{DTCG_VERSION}/) - a Community Group specification, not a W3C "
            f"Recommendation. Colors and shadows use typed sRGB/composite objects; dimension/duration values are typed {{value, unit}} objects per spec, not raw CSS "
            f"strings; a token whose source is a CSS var() reference to another token is emitted as a DTCG alias "
            f"({{group.key}}) instead of a repeated literal. Tokens that differ between themes carry both values "
            f"under $extensions['com.agentic-design-system.mode']; $value is always the dark-theme (default) value."
        ),
        "$extensions":{"com.agentic-design-system.css-only":css_only,
            "com.agentic-design-system.context":{"settings":"workspace defaults","project":None,"units":"px","themes":["light","dark"],"liveExport":"Export Foundation JSON includes current saved or preview settings; this published artifact represents default settings."}},
        **tokens,
    }
    counts = {group: len(t) for group, t in tokens.items()}
    return out,counts

def run():
    import datetime
    css = (ROOT / "theme.css").read_text()
    out,counts=build_document(css)
    (ROOT / "design-tokens.json").write_text(json.dumps(out, indent=2) + "\n")
    total = sum(counts.values())
    manifest = {
        "generatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "sourceHash": hashlib.sha256(css.encode()).hexdigest(),
        "generatorHash": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "tokenCount": total,
        "resolvedPropertyCount": sum(counts.values()) + len(out['$extensions']['com.agentic-design-system.css-only']),
        "sourceHashes": source_hashes(),
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({"tokens_written": total, "by_group": counts}, indent=2))


if __name__ == "__main__":
    if "--check" in sys.argv:
        sys.exit(check())
    run()
