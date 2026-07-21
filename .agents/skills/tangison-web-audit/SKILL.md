---
name: tangison-web-audit
description: Audit a website or web codebase with real tools, evidence, severity, root-cause analysis, safe fixes, and repeated verification. Use before a Tangison demo or production release, after major changes, or when accessibility, performance, SEO, security, responsive behaviour, content quality, and anti-template design must be checked honestly.
---

# Tangison Web Audit

Audit, classify, fix when authorised, verify, and audit again. Never replace measurements with intuition. Never silently skip a failed tool.

## Universal operating foundation

This skill is harness-neutral. Discover available shell, browser, connector, MCP, screenshot, and reporting tools. Use multiple independent tools where their coverage differs. A tool invocation is complete only when its output, target, version, and status are recorded in `PROOF.md`.

Iterate through `baseline, scan, classify, trace root causes, prioritise, fix when authorised, validate, re-scan, compare`. Re-run the same detector after each fix. Continue until the release gate passes, three cycles produce no measurable improvement, ten cycles run, or a human judgement blocks progress.

## 1. Confirm scope

Ask one concise question at a time until these are known:

- target: local codebase, preview URL, production URL, or all three;
- mode: report only, audit and fix, release gate, or regression check;
- build mode: demo or full;
- framework and package manager;
- authenticated routes and test credentials, if applicable;
- business-critical journeys;
- target browsers, devices, regions, and languages;
- analytics or Search Console access available;
- user-approved tools that upload URLs or data to third parties.

Default to report only when the user asks for an audit without asking for fixes.

## 2. Establish the baseline

Record the commit, branch, environment, URL, timestamp, tool versions, build mode, and relevant configuration. Run the project’s own install, type-check, lint, test, and production-build commands first.

If no test suite exists, report `No test suite present`. Do not convert that into a pass.

## 3. Run applicable checks

Use installed real tools. If a listed tool is unavailable, install it only with user approval or report the gap.

### Independent audit stack

Run a layered stack rather than trusting one score:

1. Project checks: type checker, linter, tests, production build, dependency graph, and console.
2. Browser journeys: Playwright or an equivalent browser tool plus manual keyboard and responsive inspection.
3. Accessibility: axe-core, Pa11y, and manual checks.
4. Performance: Lighthouse plus framework or browser profiling where needed.
5. Crawl and SEO: Squirrelscan, Lighthouse SEO, direct HTML inspection, sitemap and robots validation, and SEOJuice methods when the required data exists.
6. Security: Gitleaks, ecosystem dependency audit, optional TruffleHog verification, header checks, and OWASP ZAP only when authorised and safe for the target.
7. Design quality: Impeccable audit and critique plus Hallmark audit when installed.
8. Simplicity: Ponytail audit or an equivalent repo-wide complexity pass.
9. Content: exact comparison to approved sources, marketing context, and legal or policy inputs.

Primary sources:

- `https://github.com/squirrelscan/skills`
- `https://github.com/calm-north/seojuice-skills`
- `https://github.com/pbakaus/impeccable`
- `https://github.com/Nutlope/hallmark`
- `https://github.com/dietrichgebert/ponytail`
- `https://github.com/GoogleChrome/lighthouse`
- `https://github.com/dequelabs/axe-core`
- `https://github.com/pa11y/pa11y`
- `https://github.com/microsoft/playwright`
- `https://github.com/gitleaks/gitleaks`
- `https://github.com/trufflesecurity/trufflehog`
- `https://github.com/zaproxy/zaproxy`

If two tools disagree, inspect the raw evidence and explain the difference. Never choose the more flattering result.

### Functional and route integrity

- Crawl every public route.
- Verify the route and state matrix.
- Test navigation, links, forms, authentication, redirects, downloads, search, filters, and critical journeys.
- Verify loading, empty, no-results, error, offline, locked, maintenance, 404, and 500 states.
- In demo mode, confirm only approved pages are unlocked and that locked content cannot be bypassed.
- In full mode, treat locked or placeholder routes as release blockers.

### Accessibility

- Run axe-core against representative pages.
- Run Pa11y as a complementary check when practical.
- Manually verify keyboard navigation, focus order, focus visibility, landmarks, headings, form errors, dialogs, zoom, reduced motion, and screen-reader names.
- Verify contrast and touch targets.

Do not auto-write fake alt text. Request a real description when meaning is unclear.

### Performance

- Run Lighthouse performance audits against stable builds.
- Record LCP, CLS, INP or TBT where applicable, speed index, total blocking time, and transfer size.
- Inspect oversized images, font loading, render-blocking assets, third-party scripts, hydration, re-renders, caching, and layout shifts.
- Use framework bundle analysis when it applies.

### SEO and discoverability

- Run Lighthouse SEO.
- Crawl titles, descriptions, headings, canonical URLs, status codes, redirects, internal links, alt text, and index directives.
- Verify `robots.txt`, `sitemap.xml`, the human-readable sitemap when required, Open Graph data, social images, favicon, and structured data.
- Validate JSON-LD against the visible page content.
- Check that preview and demo sites are not accidentally indexable.
- Use Search Console and analytics evidence when the user supplies access.

Do not manufacture keyword scores, backlink data, rankings, or traffic figures without a real source.

### Security and privacy

- Run the ecosystem dependency audit.
- Run Gitleaks for secrets.
- Use TruffleHog as an optional second pass when approved.
- Review headers, cookies, CORS, authentication, authorisation, input validation, rate limits, dependency exposure, source maps, environment leakage, and unsafe redirects.
- Confirm test credentials, payment keys, and private data are not shipped to the client.
- Verify analytics and cookies follow the approved consent policy.

Never print or paste discovered secrets into the report. Redact them and name only the affected location.

### Code quality and weight

- Run the project type checker and linter.
- Run `depcheck` or the ecosystem equivalent when suitable.
- Scan for dead code, redundant wrappers, duplicate logic, unused flags, speculative abstractions, and dependencies replaced by native platform features.
- Keep correctness, security, and accessibility findings separate from simplification findings.

### Responsive design and theming

- Inspect at 320, 375, 390, 768, 1024, 1280, and 1440 CSS pixels.
- Check overflow, wrapping, tap targets, sticky elements, navigation, tables, media crops, text scaling, and orientation changes.
- Check design tokens, hard-coded colours, theme switching, contrast in every theme, and system preference behaviour.

### Content and visual integrity

- Compare every page against approved content.
- Compare implementation tokens, typography, logos, imagery, motion, components, and the public `/brand` page against `BRAND.md`.
- Verify exact names, numbers, contact details, dates, prices, policies, and calls to action.
- Flag generic AI copy, fabricated proof, em dashes, repeated sentence patterns, empty superlatives, and placeholder text.
- Inspect for generic gradient heroes, repetitive card grids, excessive pills, glassmorphism without purpose, arbitrary icons, and template-like repetition.
- Verify every public page includes a visible, accessible `Made by Tangison Studio` credit linked to `https://studio.tangison.com`, unless the user explicitly removed it for that project.
- Use a design critique tool when installed, but keep its subjective score separate from measured technical results.

## 4. Optional broad crawler

If Squirrelscan is installed and the user approves its use, run quick coverage first, surface coverage next, and full coverage before sign-off. Treat its output as one evidence source, not the sole authority. Record the audit ID and use diff mode for regression checks.

For a public release, prefer quick coverage for diagnosis, surface coverage after the first fix batch, and full coverage for final verification. If the full crawl is impossible, report the exact limitation and affected route patterns.

## 5. Classify findings

Use:

- P0 Blocking: security exposure, data loss, unusable critical path, or release cannot proceed.
- P1 Major: WCAG failure, broken conversion path, serious SEO block, severe performance issue, or misleading content.
- P2 Minor: meaningful friction or maintainability cost with a workaround.
- P3 Polish: limited user impact and safe to defer.

Each finding must include:

`Severity | Tool or method | Location | Evidence | User impact | Root cause | Recommended fix | Verification method`

Do not report an unverified suspicion as a fact. Mark it `Needs confirmation`.

## 6. Score honestly

Report separate results for:

- accessibility;
- performance;
- SEO;
- security;
- functional completion;
- responsive behaviour;
- content accuracy;
- visual distinctiveness;
- code simplicity.

Use native tool scores where they exist. Do not average unrelated scores into a false scientific number. If an executive score is requested, explain its weighting and preserve the underlying results.

## 7. Fix loop

When authorised to fix:

1. Fix P0 and P1 root causes first.
2. Group related findings caused by the same component or configuration.
3. Make the smallest complete correction.
4. Run type-check, lint, tests, and build.
5. Re-run the exact tool that found the issue.
6. Record the before and after evidence.
7. Continue until no P0 or P1 remains, no measurable improvement occurs after three cycles, or ten cycles have run.

Ask the user when a fix needs copy, legal, brand, access, infrastructure, or product judgement. Never insert filler to make a tool green.

## 8. Release gate

A release may proceed only when:

- no unresolved P0 exists;
- every P1 is fixed or explicitly accepted by the user with a reason;
- type-check, lint, tests, and production build pass;
- critical journeys pass;
- no secret is exposed;
- demo locking or full access matches the agreed mode;
- index directives match the environment;
- the final audit records real evidence.

## 9. Report

Deliver:

- environment and audit scope;
- tool execution table with successes, failures, and omissions;
- executive summary;
- findings by severity;
- systemic root causes;
- positive practices worth preserving;
- before and after deltas when fixes were made;
- accepted risks and human decisions;
- release verdict: pass, conditional pass, or fail;
- exact next step for `tangison-web-deploy`.

## Proof standard

Every completed audit action must carry proof: the exact tool or manual method, target, timestamp, result, and retained output or screenshot path. A statement without evidence is a pending claim, not a completion.
