#!/usr/bin/env bash
# Foundation audit UX14 - the project had tests and `--check` freshness
# generators, but nothing actually required them to pass before calling a
# build "the current release": no CI config, no active local hook. This is
# the one command that runs every one of those checks and fails loudly if
# any of them don't pass, so a stale or broken build can't be pushed and
# called current by mistake. Run it directly before a release, or install
# it as a pre-push gate with tools/install-hooks.sh.
set -u
cd "$(dirname "$0")/.."
fail=0

echo "== Unit tests =="
for f in tests/*.test.cjs tests/*.test.js; do
  [ -e "$f" ] || continue
  if ! out="$(node "$f" 2>&1)"; then
    echo "FAILED: $f"
    echo "$out"
    fail=1
  fi
done
[ "$fail" -eq 0 ] && echo "All unit test suites pass."

echo
echo "== Freshness gates =="
for check in "generate_tokens.py" "generate_foundation.py" "generate_contract_docs.py" "audit_pages.py"; do
  if ! python3 "tools/$check" --check; then
    echo "STALE: $check --check failed."
    fail=1
  fi
done

echo
if [ "$fail" -eq 0 ]; then
  echo "RELEASE CHECK: PASS - tests and all freshness gates are current."
else
  echo "RELEASE CHECK: FAIL - do not distribute this build as the current release until the above is fixed."
fi
exit "$fail"
