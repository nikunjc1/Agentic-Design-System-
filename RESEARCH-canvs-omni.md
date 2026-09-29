# Research: Canvs / Omni Design System Builder

External research, not a record of work done on this repo. Captured via direct page loads and DOM inspection (Playwright), not paraphrased summaries - every claim below was either read from the live page's own text/computed styles, or explicitly marked as unconfirmed.

**Source**: canvs.in (Omni marketing page, Agents page, Craft/Process pages, one project case study)
**Date checked**: this session
**Status of the product itself**: Omni is **not publicly accessible**. Confirmed by auditing every `<iframe>` and `<a href>` on the page - every link resolves to either the same Cal.com demo-booking page, another Canvs marketing page, or a social account. No subdomain, no embedded demo, no trial path exists. Everything below comes from the marketing page's copy, screenshots, and computed DOM styles.

---

## 1. What Canvs is

An interface design and engineering studio based in Mumbai, India, founded 2016. Their own meta description: *"We are group design partners to some of India's market leaders in Banking and Finance."* Client roster (footer): ICICI Bank, ICICI Direct, Vector Consulting, ABCD (Aditya Birla Capital), FXTP, Bubble Insurance, Pepper Money, Drip Capital, ViFit, Careclues - overwhelmingly fintech/banking.

Omni was built internally by **Arjun Rajkishore**, who was also on the team that built the **ICICI Bank Design System** (2023-2024, a real shipped project - see §5). Omni is explicitly the tool born from that manual-design-system pain, now being opened to external teams via demo request.

---

## 2. Omni Design System Builder - feature breakdown

**Page title**: "Omni Design System Builder | Canvs"
**Tagline**: *"Generate colour, type, spacing, elevation and grids as a real token system, in light and dark. Export to Figma or hand it to your agent."*

### Archetype-driven generation
Pick what you're building once - **Website, Dashboard, iOS, or Android** - and every foundation (color, type, grid) adapts its output to that archetype. *"Say what you're building once... so you start from something that already fits instead of a generic set you have to talk down to size."*

### Colour
- Generated in **OKLCH**, gamut-mapped: *"Out-of-gamut colours lose chroma and keep their hue. RGB clipping shifts a blue by 20° at step 50. Your hex stays pinned in the ramp."*
- Step count adapts to archetype: **11 steps (50-950)** for website/mobile, **16 steps (1-16)** for dashboards - "resampled from the same curves."
- Rich semantic token output (seen in screenshot): `bg-surface`, `bg-surface-hover`, `bg-surface-selected`, `bg-surface-secondary`, `bg-surface-secondary-hover`, `bg-fill-brand-hover`, `bg-fill-brand-active`, etc. - state suffixes baked directly into the semantic layer.
- **Contrast grid**: hovering any color pair (e.g. "100 on 800") shows a live tooltip with an **APCA Lc score**, plus four separate pass/fail checks: Large text (≥24px bold or ≥36px regular), Small text/UI elements, Body text (minimum), Body text (preferred). Supports both **APCA and WCAG 2**, with a threshold filter.
- Live "UI preview" tab renders the palette inside real dashboard/chart mockups.
- One brand color in -> primitives, semantic tokens, and both light/dark modes out.

### Typography
- Modular scale: pick a base size and ratio (e.g. "Major Second - 1.125"); heading/body/label tiers generate automatically.
- **Native platform specs, not a re-skinned web scale**: *"Apple's eleven text styles in points, Material's fifteen roles in sp. The real specs, not a web scale in disguise."*
- Auto-tightens tracking/line-height as size increases; snaps to whole units.
- Responsive step-down is a **configurable parameter** ("set how far the scale steps down on smaller screens"), not a single hardcoded breakpoint.
- Weights labeled semantically (regular/medium/semibold), not raw numeric weights.

### Spacing, elevation, grid (generated in the same pass)
- Grids account for **sidebar/inset/content-cap before dividing into columns** - *"the widths you see are the real ones,"* avoiding the common mistake of computing column widths against the full viewport.
- **Seven shadow-scale presets**, described as layered (multi-layer, not single box-shadow) and **tintable** (color-tinted, not just black).
- Spacing traces back to one base unit.

### Export - three real destinations
1. **Into Figma** - *"Everything arrives as proper variables and styles, light and dark included, ready to apply. Run it again any time and it updates in place"* (idempotent re-sync).
2. **Into your agent** - *"Hand the full system to Claude, Cursor or whatever you build in, so it works from your actual tokens instead of guessing at them."*
3. **Into code** - *"Standard token files, CSS or Tailwind, with dark mode already handled."*

(Elsewhere on the Agents page, this is condensed to: *"Push straight to Figma, or copy a ready instruction for your AI agent. Same tokens, whichever workflow you're in."*)

**Note**: the phrase "Human View / Machine View" does **not** appear anywhere on either page - that was my own earlier paraphrase of the Figma/agent export split, not their actual wording. Worth remembering not to quote it as if it were their copy.

---

## 3. canvs.in/agents - Canvs' own engineering practice (most relevant page for our purposes)

**Hero**: *"Accelerated code and design"*

### Four pillars ("Built for agents to work from")
| Pillar | Copy |
|---|---|
| Repo readiness | Infrastructure-as-code, repo-visible context, and clean separation of concerns give agents unambiguous ground truth about where and how to build. Nothing needs to be explained twice. |
| Reusable foundations | Repeatable building blocks for auth, search, storage, and notifications, ready to assemble and customize. Agents build from known patterns instead of generating from scratch each time. |
| Deployment confidence | Fast, low-touch deployment and rollback make a bad change cheap to undo. |
| Verification & memory | Test cases catch faulty execution early. Continuous documentation keeps a live source of truth, and shared context across agents and teams means nothing gets rediscovered or contradicted. |

### "Under the hood" - a CODE / DESIGN tab toggle
The one genuine two-view UI pattern found on either page.

**CODE tab**:
- *"Agents in the loop"* - "The entire engineering process is designed, orchestrated and monitored by our engineering team. We first make the setup Agent ready, install comprehensive guardrails, create a build plan and then deploy agents within a fully-monitored dev environment."
- *"Observe the build-out live as events"* - a live, timestamped incident/build feed pulled from real-looking commits/PRs:
  - `04:21 IST INCIDENT` - "Root cause found: group-member routes coded but never registered" (canvs-cognito-pool PR #46)
  - `04:26 IST BUILD` - "canvs-cognito-pool bumped to v0.0.49" (canvs-ui-config-tool PR #2038)
  - `04:37 IST INCIDENT` - "Second gap in the same pass: frontend origins missing from CORS allowlist" (PR #47)
  - `04:41 IST BUILD` - "New frontend origins wired into admin API CORS config" (PR #2039)
  - `11:30 IST CORRECTION` - "Team-management fix re-verified live in both environments" - "verified via direct curl, both environments"

**DESIGN tab**:
- *"PRD is the foundation of the build status"* - flat feature tracker by module: AUTH 12/12, INGEST 11/12, SEARCH 10/12, REPORTS 8/12, BILLING 12/12, ADMIN 5/12 - **58/72 features, 81% complete**.
- *"Product logic formalization"* - an 8-stage research pipeline, each stage tagged with which model runs it: Scope (haiku-4-5) -> Plan (haiku-4-5) -> Investigate (sonnet-5 + agents) -> Normalize (no LLM call) -> Generate (sonnet-5) -> Quality gate (sonnet-5, tier 2) -> Render (sonnet-5 + agents) -> Notify (no LLM call).
- *"System architecture"* - Client -> Identity -> Surface -> Service -> Agent+Data (Customer browser -> Cognito pool/SSO -> Console app -> Lambda/API GW -> Agents pkg + S3).

### "Nature of agents" - six named roles, one job each, no authority outside it
| Role | Job |
|---|---|
| Planner | *(description did not render - possible display bug on their page, showed "₹4$" instead of copy)* |
| Designer | Writes and edits UI code against the design system, working from components and tokens rather than one-off styling. |
| Implementer | Writes and edits code for non-UI work once a plan exists, always working from delegation rather than inline edits. |
| Tester | Runs typecheck, lint, and build after every change, reporting failures with file and line precision. |
| Reviewer | Checks for correctness bugs, security issues, and unnecessary complexity before anything moves forward. |
| Ops | Handles git, PRs, and pipeline config as the final step, once everything else has been approved. |

### Tech stack (logos shown, tabbed)
**Storage and messaging**: Supabase, Redis, Postgres, Pusher, Hazelcast, DynamoDB, AWS SQS, Amazon SNS. Other tabs present but not opened: Auth, Cloud, Frontend, Backend, AI.

### "Built by Canvs" - three internal products showcased
1. **Omni** (recap of §2)
2. **Financial Intelligence for SMEs** - "Talk to your cashflow": reconciliation + natural-language chat ("Ask anything about your cash flow…") answering with real numbers and scenario simulation, e.g. *"You could hire 2 more people and still stay cash positive. ₹9L left over through the rest of the year."*
3. **Ambient Research** - always-on market-intelligence agents: *"Autonomous agents that break down complex, open-ended questions, multi-step research tasks to produce detailed, cited reports."* Example shown: "Mars AMC · flow growth vs peers — Net flows up 14.2% YoY — 6 AGENTS · 12 SOURCES · 38s." Notably includes a **"new findings patch old claims"** mechanism - agents that revisit and update earlier conclusions as new evidence arrives, with a visible patch history (e.g. "AUM per folio ~₹2.1L," patched from an earlier ₹1.74L estimate at a later date).

### Blog posts referenced (dated - likely real/recent)
- "Omni: Our tool suite that gives you a starter design system in minutes" (22 Sep 2026, Arjun Rajkishore)
- "Inside a Canvs pitch: Studio expertise augmented by agentic systems" (11 Sep 2026)
- "Making each inquiry useful to the next: How research is now non-linear at Canvs" (2 Sep 2026, Premankan Seal)

---

## 4. Craft & Process pages - design philosophy in their own words

- *"Landmark interfaces of any era balance aesthetic brilliance with business impact... our craft sits at that intersection... powered by a deep integration of skills serving our core expertise."*
- *"Design tooling that's deeply agentic — The goal isn't to replace design. The visualisation is still a core process internally."* - an explicit stance that agents assist rather than replace the human visualization step.
- *"A systems-first approach in the world of UI — Our thinking is grounded in how information moves, and how decisions are made. We map inner workings first, so that interaction becomes a natural outcome. Aesthetics follow the truth of the product, not the other way around."*
- *"Our clients work directly with Design Managers who know the craft well"* - senior designers run client relationships, not account managers. Long tenures cited as proof: ICICI Bank payments (2.5 years), ICICI Direct (1 year), Aditya Birla Capital Design (2 years), Aditya Birla Health Insurance (2 years).

---

## 5. ICICI Bank Design System - their real, shipped case study

**Client**: ICICI Bank. **Year**: 2023-2024. **Team**: Premankan Seal, Arjun Rajkishore, Mansi Bakle, Debprotim Roy, Shreya Babulkar, Hamsika Iyer.

**Scope**: *"A comprehensive set of components for web and mobile"* - colours and typography, responsive grid system, input fields, buttons, toasts and alerts, multi-colour line icons, generic system icons, custom credit card designs for ICICI Credit Cards and Co-Branded ICICI Credit Cards, mini-success states for non-financial actions.

This is the direct precedent for Omni: the same person (Arjun Rajkishore) built this manually, then built Omni afterward to generate this kind of output automatically.

---

## 6. Technical / visual DNA (computed from the live page, not guessed)

- **Platform**: Framer (`generator: "Framer c81289c"` meta tag; OG image hosted on framerusercontent.com). Not custom-coded, not Webflow, not Next.js/React.
- **Fonts**: **Hanken Grotesk** (body/headings - a distinctive, uncommon grotesque, not Inter or a generic system font) and **DM Mono** (labels/code/UI chrome).
- **Primary accent**: `#FE5E2A` (warm red-orange), secondary shade `#E8622C`.
- **Neutral scale**: teal-tinted (not pure gray), 11 steps from `rgb(243,245,244)` down to `rgb(31,42,44)` - a subtle green/cyan cast throughout, different from our own warmer graphite scale.

---

## 7. Comparison to our own system (as of this session)

| Area | Omni | Damco Agentic Design System |
|---|---|---|
| Color science | OKLCH + gamut-mapping | RGB-space lightness mixing for dark-mode suggestions |
| Contrast | APCA + WCAG2, 4 use-case thresholds, live hover grid | Flat WCAG 4.5/7 AA/AAA + a 3:1 non-text check |
| Token export | Figma (live re-sync) + Agent + Code/CSS/Tailwind, 3 real destinations | One `design-tokens.json` (W3C format) - covers "agent" reasonably, no Figma sync, no ready CSS/Tailwind file |
| Typography per-platform | Real Apple/Material native specs per archetype | One web scale reused with a platform-preset label |
| Shadows | 7 layered, tintable presets | 7 flat single-layer presets |
| Grid | Accounts for sidebar/inset before dividing columns | Documented conceptually, not computed this way |
| Agent roles | 6 named roles (Planner/Designer/Implementer/Tester/Reviewer/Ops), each with one job and a defined handoff | Not implemented - explicitly paused earlier this session pending direction |

## 8. Open opportunities this surfaces (not yet actioned)

1. Split `design-tokens.json` into real per-destination exports: a Figma-variables-shaped file and a plain CSS custom-properties file, alongside the existing W3C JSON.
2. Add a large-text vs. small-text contrast distinction on the Colors tab (currently one flat 4.5/7 pair for all text).
3. Multi-layer, tintable shadows as a real upgrade over the current flat single-layer scale.
4. Grid computation that accounts for sidebar/inset before dividing into columns, rather than prose-only documentation.
5. The "Nature of agents" 6-role breakdown is conceptually close to the earlier-discussed multi-agent idea for this project - flagged, not acted on without explicit direction.
