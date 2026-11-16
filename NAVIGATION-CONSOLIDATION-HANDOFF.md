# Design Values and AI Generator consolidation

Completed 6 November 2026.

## Changes

- **Design Values** is now the opening section of **Design Principles** at `principles.html#design-values`. It retains Legible, Consistent, Honest and Adaptive as concise guidance, followed by the existing ten principles. Repeated explanations, numbered value badges and unsupported “Enforced” labels were omitted.
- **AI Generator** is removed from navigation. Its practical instructions now live in **Markdown Export**, at `md-export.html#ai-handoff`, under “Use with your AI tool.” The instructions link to Project Setup, Patterns, Templates and AI & Agents, explain the external-AI workflow, and remind users to regenerate exports after changes and review generated output.
- **AI & Agents** remains in Foundations.
- Removed the two redundant sidebar items throughout the HTML pages. No project or Foundation storage is modified.

## Compatibility and exports

- `values.html` and `ai-generator.html` are retained as redirect pages with fallback links.
- `merged-page-redirect.js` redirects normal in-app visits to the destination section. It respects `ADSNavigation.redirecting`, so fresh external visits still follow the required welcome-first flow.
- Old `md-export.html?page=values.html` and `?page=ai-generator.html` URLs export their corresponding merged destination guides.
- `tools/audit_pages.py` still audits redirect pages for source issues, but excludes pages marked with `ads-redirect` metadata from the documentation catalog. Complete exports therefore avoid duplicate redirect entries.
- Updated the Design Principles implementation contract and regenerated its documentation, Foundation/default token artifacts and documentation catalog.

## Verification

`tools/check-navigation-merge.cjs` passed six browser checks:

1. Legacy Values navigation reaches the introduction and its page Markdown includes the values.
2. Both redundant sidebar items are absent; AI & Agents remains.
3. Legacy AI Generator navigation reaches the four-step Markdown handoff instructions.
4. Both old selected-guide export URLs work; a complete Markdown download includes the merged guidance without redirect-stub catalog entries.
5. Both destination pages fit 1440px and 390px widths in light and dark themes.
6. Fresh external visits still show the welcome choices.

No browser script errors occurred. Release checks pass. The source audit reports zero issues across 162 HTML pages. Screenshots, results, an example Markdown download and logs are in `audit/navigation-merge-2026-11-06/`.

## Reproduce

```sh
ADS_PLAYWRIGHT_PACKAGE=/Users/user/.npm/_npx/705bc6b22212b352/node_modules/playwright-core node tools/check-navigation-merge.cjs
bash tools/release_check.sh
```

The browser check uses isolated Chrome contexts. Its Playwright package and Chrome executable paths are specific to this workstation.
