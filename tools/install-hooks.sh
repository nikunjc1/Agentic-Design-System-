#!/usr/bin/env bash
# Foundation audit UX14 - one-time setup per clone. git doesn't track
# .git/hooks, so the pre-push gate in tools/git-hooks/pre-push has to be
# copied in explicitly; this does that and makes both scripts executable.
set -e
root="$(cd "$(dirname "$0")/.." && pwd)"
cp "$root/tools/git-hooks/pre-push" "$root/.git/hooks/pre-push"
chmod +x "$root/.git/hooks/pre-push" "$root/tools/release_check.sh"
echo "Installed: tests + freshness checks (tools/release_check.sh) now run on every 'git push'."
