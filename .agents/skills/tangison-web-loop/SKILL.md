---
name: tangison-web-loop
description: Orchestrate Tangison website work from discovery through planning, content, creation, audit, demo deployment, client approval, production deployment, and live verification. Use when the user asks to plan, build, launch, or fully manage a website rather than perform one isolated phase.
---

# Tangison Web Loop

Use the specialist skills in order and preserve their handoffs. Do not merge every discipline into one vague pass.

## Universal operating foundation

Webman follows the open Agent Skills format and must work across Codex, Claude Code, Kimi Code, Antigravity, Gemini CLI, Cursor, Windsurf, Zed, OpenCode, and other compatible harnesses. Detect the harness and map capabilities by purpose. Never weaken a gate because a command has a different name.

Use tool calling seriously. When a tool can inspect current state, search the web, read a source, calculate, render, test, audit, deploy, or verify more reliably than a prose answer, call the tool. Prefer primary sources and first-party connectors. Use parallel calls only for independent read-only work. Never fabricate output, conceal a failed tool, or call an action complete without proof.

Read [references/operating-foundation.md](references/operating-foundation.md), [references/harness-setup.md](references/harness-setup.md), and [references/skill-stack.md](references/skill-stack.md) before starting a full project.

## Skills in the system

1. `tangison-web-plan`: discovery, research, positioning, architecture, scope, route matrix, risks, and acceptance criteria.
2. `tangison-web-content`: evidence gathering, editorial plan, exact page copy, interface text, SEO copy, and content approval.
3. `tangison-web-create`: implementation of every approved route, state, integration, responsive layout, and system page.
4. `tangison-web-audit`: measured technical and visual audit, safe fix loop, re-audit, and release verdict.
5. `tangison-web-deploy`: GitHub, Vercel, preview or production configuration, subdomain connection, live verification, and rollback.
6. `tangison-documents`: transactional and formal business documents.
7. `tangison-magazine`: editorial company profiles, annual reports, brochures, lookbooks, and visual publications.

External specialist sources and ownership rules are defined in [references/skill-stack.md](references/skill-stack.md). Do not install everything blindly. Build a project-specific capability matrix, install the smallest complete set with approval, then prove each installation and invocation.

## Routing

- A full website request runs the entire web sequence.
- A clear single-phase request runs only the relevant specialist skill, but reads existing handoff files first.
- A company profile can route to `tangison-magazine`, a website, or both. Ask which output is needed.
- Quotations, invoices, contracts, letters, and formal PDFs route to `tangison-documents`.
- A visual proposal may combine `tangison-magazine` with the relevant commercial requirements from `tangison-documents`.

## Full sequence

### Phase 0: Harness and tool bootstrap

1. Detect the active harness and installed skills, plugins, connectors, MCP servers, and CLIs.
2. Read [references/harness-setup.md](references/harness-setup.md).
3. Verify current primary repositories and installation instructions.
4. Present the required installation actions and request approval.
5. Install for the active harness, or all requested harnesses, using the maintained portable installer where appropriate.
6. Verify visibility and one real invocation per required capability.
7. Record versions, paths, commands, results, and evidence in `PROOF.md`.

Do not continue with a silently degraded workflow. If a specialist tool is unavailable, state the limitation and use a named, evidence-based fallback.

### Phase 1: Plan

Run `tangison-web-plan` and produce:

- `PRODUCT.md`;
- `BRAND.md`;
- `BUILD_PLAN.md`;
- approved build mode;
- route and state matrix;
- requirements, risks, dependencies, and acceptance criteria.

Do not continue while the site’s audience, offer, conversion goal, mode, essential route scope, brand system, or public brand-page direction is unresolved.

### Phase 2: Content

Run `tangison-web-content` using the approved plan. Produce `CONTENT_PLAN.md` with exact page copy, interface states, metadata, source notes, and unresolved content decisions.

Do not let layout fabricate content to fill space.

### Phase 3: Create

Run `tangison-web-create`. In demo mode, unlock only the approved home experience and brand page, then design locked states for the rest. In full mode, complete all approved routes, integrations, system pages, and operational states.

The production build, type checker, linter, and applicable tests must pass before audit.

### Phase 4: Audit and fix

Run `tangison-web-audit`. Keep measured results separate from subjective critique. Fix authorised P0 and P1 findings, validate the build, and re-run the finding tools.

Do not deploy without a pass or an explicit, documented user acceptance of remaining P1 risk.

### Phase 5: Demo deployment

For a first client presentation, run `tangison-web-deploy` in client-demo mode:

- GitHub repository prepared safely;
- Vercel preview connected;
- approved subdomain attached;
- indexing disabled;
- irreversible integrations disabled or in test mode;
- only approved routes unlocked;
- live smoke audit completed.

### Phase 6: Approval and full build

Record client feedback as decisions, not scattered comments. Update plan and content first when scope changes, then rebuild and re-audit.

### Phase 7: Production deployment

Run `tangison-web-deploy` against the exact audited commit. Verify domain, TLS, redirects, forms, analytics, consent, indexing, sitemap, metadata, integrations, and rollback.

### Phase 8: Live audit

Run a focused `tangison-web-audit` against the public URL. Close only after the live release has no unresolved P0 and all P1 findings are fixed or explicitly accepted.

## Interview rule

Ask one concise question at a time when a critical choice is missing. Do not send a long questionnaire. Continue with safe work between answers when possible.

## State and truthfulness

At every phase, report:

- what is approved;
- what is complete;
- what is simulated;
- what is locked;
- what failed;
- what requires user authority;
- what the next specialist skill needs.

Never describe a demo as a complete production system. Never describe an unmeasured audit as a pass. Never describe a Vercel build as launched until the live domain is verified.

## Evidence ledger

Maintain `PROOF.md` throughout the workflow. For every material action record:

`Phase | Action | Target | Command or method | Result | Evidence path or URL | Timestamp | Status`

Acceptable proof includes source links, inspected files, diffs, test output, audit JSON, screenshots, commit SHAs, deployment IDs, DNS lookups, HTTP responses, and live URLs. Redact secrets. A claim without proof remains incomplete.

Read `references/skill-stack.md` before setup or implementation. Install only verified skills from their primary source, use each for its defined job, and record installation and invocation proof in `PROOF.md`.

## Content and design standards

- Use concrete, human copy.
- Avoid em dashes.
- Reject “revolutionise”, “unlock”, “next generation”, “cutting edge”, “seamless”, “game changing”, fabricated metrics, and generic testimonials.
- Preserve exact supplied facts and brand assets.
- Add a restrained `Made by Tangison Studio` footer credit linked to `https://studio.tangison.com` on every public page, unless the user explicitly removes it for that project.
- Avoid repetitive card grids, arbitrary gradients, excessive pills, decorative dashboards, and generic stock imagery.
- Build every necessary loading, empty, error, offline, maintenance, locked, access, 404, and 500 state.

## Stop conditions

Pause and request direction when:

- the next action changes an external system without clear authority;
- a missing decision materially changes scope, architecture, cost, legal meaning, or production data;
- required credentials or brand assets are unavailable;
- a release gate fails;
- no measurable improvement occurs after three audit cycles;
- ten fix cycles have run in one session.

The workflow ends only when the requested environment is deployed, verified, documented, and handed over, or when the user intentionally stops at an earlier phase.
