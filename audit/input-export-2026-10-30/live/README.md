# Live Input verification — 30 October 2026

Actual local Chrome **Draw in Figma** clicks reached the connected Contract Bridge; the push request was not mocked. Final repeat returned HTTP 200 with no warnings and reused set `55:9549` and preview `55:9550`.

- `results.json`: scope, counts, checks and limitations.
- `sent-contract.json`: authored Input captured by the actual page.
- `draw-result.json`: successful repeat draw result after cleanup.
- `inspect.json`: actual final property definitions and layer bindings from read-only inspection.
- `before-cleanup-inspect.json`: seven unused numbered properties left by earlier failed imports.
- `readback-before-cleanup.json`: successful nested-instance readback; pull also registers existing properties in plugin metadata.
- `cleanup-result.json`: targeted normal redraw removed the seven inspected leftovers, with explicit removal notices.

The automated five-export browser test remains separate in the parent folder and uses a Figma API test double. It is not the source of the live counts. The full release check and final browser regression both passed. These files verify creation, migration, bindings and readback, not pixel parity or every Figma editing interaction. See the root `INPUT-TEXT-FIELD-AI-HANDOFF.md` for implementation details and continuation instructions.
