# Webman Skill and Tool Stack

Verify every repository, install command, release, licence, and compatibility from its primary source immediately before installation. Ask for approval before changing the user’s environment. Install only the capabilities the project needs, then prove each installation.

## Portable skill infrastructure

### Agent Skills specification

- Source: `https://agentskills.io`
- Purpose: portable `SKILL.md` structure and progressive disclosure.

### Skills installer

- Source: `https://github.com/vercel-labs/skills`
- Purpose: discover, install, list, update, remove, and target skills across supported harnesses.
- Typical commands:

```bash
npx skills add OWNER/REPOSITORY --list
npx skills add OWNER/REPOSITORY
npx skills add OWNER/REPOSITORY --skill SKILL_NAME
npx skills list
```

Do not add `--all`, `--global`, `--yes`, or multiple harness targets without user approval.

## Webman foundation

### Webman

- Source: `https://github.com/tangison/webman`
- Install: `npx skills add tangison/webman`
- Purpose: Tangison planning, content, brand definition, creation, audit, deployment, and document workflows.
- Proof: eight valid skills are visible in the intended harness and one routing test succeeds.

### Superpowers

- Source: `https://github.com/obra/superpowers`
- Purpose: brainstorming, writing plans, test-driven development, systematic debugging, code review, and verification before completion.
- Setup: use the repository’s current official method for the active harness because its hooks and plugin behaviour may extend beyond plain skill files.
- Proof: installed version or commit, active bootstrap, and evidence that the relevant Superpowers phase ran.

### Ponytail

- Source: `https://github.com/dietrichgebert/ponytail`
- Purpose: YAGNI, reuse, standard library and native platform preference, dependency restraint, and complexity reduction.
- Proof: installed version or commit and any measurable code or dependency reduction.

## Design and interface direction

Choose one skill as art-direction owner. Others may critique, study references, or audit. Do not blend competing visual rules silently.

### Impeccable

- Source: `https://github.com/pbakaus/impeccable`
- Purpose: design vocabulary, context gathering, typography, colour, spatial design, motion, responsive behaviour, UX writing, anti-pattern detection, critique, hardening, and polish.
- Required use: establish design context before implementation, harden edge states, adapt responsive layouts, critique before release, then polish.
- Proof: context output, detector or audit result, command result, and before-and-after screenshots.

### Taste Skill

- Source: `https://github.com/Leonxlnx/taste-skill`
- Install name: `design-taste-frontend`
- Install: `npx skills add Leonxlnx/taste-skill --skill design-taste-frontend`
- Purpose: infer the brief and set layout variance, motion intensity, visual density, design-system mapping, and anti-slop preflight.
- Proof: recorded dials, chosen design map, preflight result, and representative renders.

### Hallmark by Together AI

- Source: `https://github.com/Nutlope/hallmark`
- Install: `npx skills add nutlope/hallmark`
- Purpose: build, audit, redesign, or study interface structure while rejecting generic AI patterns.
- Use: `hallmark study` for reference extraction, Hallmark as art-direction owner when selected, or `hallmark audit` as an independent anti-slop check.
- Proof: selected macrostructure or study output, slop-test result, and before-and-after render evidence.

### Anthropic frontend design

- Source: `https://github.com/anthropics/skills/tree/main/skills/frontend-design`
- Purpose: optional production-grade frontend art direction when supported by the harness.
- Rule: do not stack it as a fourth simultaneous art director. Give it one named role or omit it.

## Design-system implementation candidates

Component libraries do not choose the brand. Evaluate them against `BRAND.md`, accessibility, bundle cost, framework fit, ownership, and maintainability.

### Astryx by Meta

- Source: `https://github.com/facebook/astryx`
- Documentation: `https://astryx.atmeta.com`
- Purpose: agent-ready React design-system foundation with accessible components, themes, templates, and CLI support.
- Status: beta. Verify current release and breaking changes before every adoption.
- Use: preferred evaluation candidate for React product interfaces, internal tools, dashboards, settings, data entry, and component-heavy applications.
- Do not force it into a highly bespoke marketing site, non-React project, tiny static site, or existing system where migration cost outweighs value.
- Typical packages: `@astryxdesign/core`, one approved `@astryxdesign/theme-*`, and development-only `@astryxdesign/cli`.
- Proof: architecture decision, exact package versions, component manifest or CLI evidence, accessibility checks, bundle delta, and screenshots proving Tangison or client branding rather than the stock theme.

### StyleX

- Source: `https://github.com/facebook/stylex`
- Purpose: optional compile-time styling system when the stack and scale justify it.
- Rule: Astryx consumers do not need to adopt StyleX authoring merely because Astryx uses it internally.

### shadcn/ui

- Source: `https://github.com/shadcn-ui/ui`
- Purpose: open-code React components when ownership and customisation are more important than a packaged design system.
- Rule: it is a candidate, not Webman’s default. Compare it with Astryx, native platform components, and the existing system.

## Marketing and content

### Marketing Skills by Corey Haines

- Source: `https://github.com/coreyhaines31/marketingskills`
- Install: `npx skills add coreyhaines31/marketingskills`
- Purpose: product marketing foundation, customer research, competitor analysis, positioning, copywriting, content strategy, SEO, CRO, analytics, launches, pricing, campaigns, retention, and growth.
- Required sequence: create or update its product-marketing context first, then invoke only the specialist skills relevant to the approved scope.
- Webman ownership: Webman preserves facts, brand, route architecture, content approval, and anti-AI writing. Marketing Skills supplies channel and conversion expertise.
- Proof: source-backed context file, named marketing skill invocation, decision rationale, and measurable acceptance criteria.

## Audit and quality tools

Run multiple independent tools because no single audit covers everything.

### Squirrelscan

- Source: `https://github.com/squirrelscan/skills`
- Install: `npx skills add squirrelscan/skills --skill audit-website`
- Purpose: broad website crawling, issue classification, coverage progression, regression comparisons, and repeat audit loops.
- Proof: audit ID, coverage mode, score, raw LLM report, and before-and-after diff.

### SEOJuice skills

- Source: `https://github.com/calm-north/seojuice-skills`
- Purpose: layered technical, on-page, content, link, and competitive SEO audit when the required data is available.
- Rule: never invent backlink, ranking, Search Console, or analytics data.

### Impeccable audit

- Source: `https://github.com/pbakaus/impeccable`
- Purpose: code-level accessibility, performance, theming, responsive, and anti-pattern audit.
- Keep its design score separate from Lighthouse, axe, and crawler measurements.

### Ponytail audit

- Source: `https://github.com/dietrichgebert/ponytail`
- Skill: `ponytail-audit`
- Purpose: repo-wide complexity and unnecessary dependency review. It does not replace correctness, security, performance, or accessibility review.

### Core technical tools

- Lighthouse: `https://github.com/GoogleChrome/lighthouse`
- axe-core: `https://github.com/dequelabs/axe-core`
- Pa11y: `https://github.com/pa11y/pa11y`
- Playwright: `https://github.com/microsoft/playwright`
- Gitleaks: `https://github.com/gitleaks/gitleaks`
- TruffleHog: `https://github.com/trufflesecurity/trufflehog`
- OWASP ZAP: `https://github.com/zaproxy/zaproxy`
- dependency audit: use the official tool for the project ecosystem.

Use the project type checker, linter, tests, production build, browser console, HTTP checks, responsive screenshots, keyboard testing, and manual journey checks alongside these tools.

## AI, media, and tool-calling support

### Together AI skills

- Source: `https://github.com/togethercomputer/skills`
- Install: `npx skills add togethercomputer/skills`
- Purpose: Together AI chat, function calling, structured output, images, audio, video, embeddings, training, and infrastructure when the project uses Together AI.
- Rule: install only relevant skills and keep API keys out of source and proof logs.

### Open Design

- Source: `https://github.com/nexu-io/open-design`
- Purpose: optional cross-harness design workspace, `DESIGN.md` systems, skills, plugins, prototypes, media, and MCP integration.
- Rule: evaluate before adoption. Do not install a large design environment merely to generate one simple page.

## Conflict order

1. User’s explicit instructions and permissions.
2. Verified facts, law, security, privacy, accessibility, and production safety.
3. Approved `PRODUCT.md`, `BRAND.md`, `BUILD_PLAN.md`, and `CONTENT_PLAN.md`.
4. Webman phase rules and acceptance gates.
5. Superpowers engineering workflow.
6. Ponytail complexity restraint.
7. The named art-direction owner.
8. Supporting marketing, design critique, and audit tools.

Record every conflict, chosen rule, reason, and proof. Never average contradictory guidance into a vague compromise.
