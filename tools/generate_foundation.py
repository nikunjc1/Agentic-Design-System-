"""Keep browser primitives and the resolved default export synchronized with theme.css."""
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path
from generate_tokens import parse_root_block

ROOT = Path(__file__).resolve().parent.parent
MODEL = ROOT / 'foundation-model.js'
OUTPUT = ROOT / 'foundation-defaults.json'
MANIFEST = ROOT / 'foundation-defaults-manifest.json'

def expected_model():
    css = (ROOT / 'theme.css').read_text()
    dark = parse_root_block(css, ':root')
    light = {**dark, **parse_root_block(css, ':root[data-theme="light"]')}
    block = '/* BEGIN GENERATED PRIMITIVES */\n  const primitives = ' + json.dumps({'light':light,'dark':dark}, separators=(',',':')) + ';\n  /* END GENERATED PRIMITIVES */'
    return re.sub(r'/\* BEGIN GENERATED PRIMITIVES \*/.*?/\* END GENERATED PRIMITIVES \*/', lambda _:block, MODEL.read_text(), flags=re.S)

def snapshot():
    script = "const M=require('./foundation-model.js');process.stdout.write(JSON.stringify({schemaVersion:1,format:'Damco CSS custom property snapshot; not a DTCG token document',light:M.resolve({},'light'),dark:M.resolve({},'dark')},null,2)+'\\n')"
    return subprocess.run(['node','-e',script],cwd=ROOT,check=True,capture_output=True,text=True).stdout

def hashes():
    return {p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in ['theme.css','foundation-model.js']}

if __name__ == '__main__':
    expected = expected_model()
    if '--check' in sys.argv:
        fresh = MODEL.read_text()==expected and OUTPUT.exists() and OUTPUT.read_text()==snapshot() and MANIFEST.exists() and json.loads(MANIFEST.read_text()).get('sourceHashes')==hashes()
        print('Foundation defaults: '+('fresh' if fresh else 'STALE; run python3 tools/generate_foundation.py'))
        sys.exit(0 if fresh else 1)
    MODEL.write_text(expected)
    OUTPUT.write_text(snapshot())
    MANIFEST.write_text(json.dumps({'schemaVersion':1,'sourceHashes':hashes()},indent=2)+'\n')
    print('Generated browser primitives and Foundation defaults for both themes.')
