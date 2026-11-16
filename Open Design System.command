#!/bin/bash
# Double-click this file to start the Damco Contract Bridge (if it isn't
# already running) and open the design system in your browser at the
# correct http://127.0.0.1:3333/... address - never file://.
#
# Why this exists: opening any .html file in this folder directly (double-
# click, a bookmark, browser history) gives it a file:// address, which
# Chrome blocks from reading other pages in this folder. That breaks
# "Export to Figma" and the Button appearance merge. The bridge server
# serves every page of this site over real http instead, which fixes it -
# this script is just a one-click way to start that server and go straight
# to the right address, so there's nothing to type or remember.

cd "$(dirname "$0")" || exit 1

PORT=3333
START_PAGE="new-project.html"   # Always begin with project choices.

if ! lsof -i ":$PORT" >/dev/null 2>&1; then
  echo "Starting the Damco Contract Bridge on port $PORT..."
  nohup node tools/component-bridge.cjs > /tmp/damco-bridge.log 2>&1 &
  sleep 1
else
  echo "The bridge is already running on port $PORT."
fi

open "http://127.0.0.1:$PORT/$START_PAGE"

echo ""
echo "Opened http://127.0.0.1:$PORT/$START_PAGE in your browser."
echo "You can close this window."
sleep 2
