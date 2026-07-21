---
description: "Build complete, intentional, client-ready websites from an approved plan and content pack. Use for Tangison Studio website demos and full client builds, including every public route, locked demo page, loading state, empty state, error page, legal page, sitemap, metadata file, responsive breakpoint, and launch requirement that agents commonly forget."
---
# Tangison Web Creation

Build websites that feel art-directed, work end to end, and are honest about what is finished. Do not reduce a website to a polished homepage. The site includes its routes, states, metadata, forms, accessibility, resilience, and operational pages.

## Universal operating foundation

This skill is harness-neutral. Use the current agent’s repository, filesystem, shell, browser, screenshot, image, package, test, connector, and MCP capabilities by purpose. Do not depend on Codex-specific command names. Inspect before editing, use tools for real state, and retain evidence in `PROOF.md`.

Iterate through `inspect, plan, implement the smallest complete slice, run checks, render, critique, fix root causes, re-run checks, record`. Work route by route and journey by journey. Continue until acceptance criteria pass, three cycles show no improvement, ten cycles run, or external authority is required.

Do not start by writing components. First read `PRODUCT.md`, `BRAND.md`, `BUILD_PLAN.md`, `CONTENT_PLAN.md`, supplied brand assets, and the current codebase. If any file is absent, interview the user one concise question at a time until the missing decision is resolved.

## 1. Confirm the build contract

Confirm these before implementation:

1. Build mode: demo, full, redesign, or repair.
2. Framework and current stable version.
3. Package manager and deployment target.
4. Audience, offer, conversion goal, and primary call to action.
5. Approved routes and which routes must be unlocked.
6. Brand assets, fonts, colours, imagery, and tone.
7. Content status: final, draft, or missing.
8. Integrations: forms, email, analytics, CMS, payments, maps, booking, authentication, or database.
9. Required domains and subdomains.
10. Accessibility, privacy, compliance, and browser requirements.

Do not invent client facts, prices, metrics, testimonials, addresses, registration details, policies, or legal claims.

## 2. Choose demo or full mode

### Demo mode

Default demo access:

- The home page is unlocked, including the complete hero and a representative section below it.
- One approved brand or visual-direction page is unlocked.
- The approved brand page is available at `/brand` unless the project’s route convention requires an equivalent path.
- All other planned routes exist but are locked.
- Locked routes use a designed preview state with the real page title, a concise description, and a clear next step.
- Locked pages must not expose confidential copy, private data, unfinished integrations, or hidden routes.
- Navigation may show locked routes, but must label them clearly.
- Demo forms, payments, email, analytics, and database writes stay disabled or use safe test mode.
- Add `noindex, nofollow` unless the user explicitly wants the demo indexed.
- Provide a visible demo notice and a reliable return route.

Never fake a finished system behind a static mockup. State what is active, simulated, locked, or awaiting approval.

### Full mode

- Every approved route is unlocked and functional.
- Forms validate, submit, show success and failure states, and reach the intended destination.
- Integrations use production configuration only after explicit approval.
- Legal, SEO, accessibility, analytics, privacy, and operational requirements are complete.
- Placeholder copy, dead links, disabled controls, and fake data are release blockers.

## 3. Create the route and state matrix

Before coding, produce a compact matrix with:

`Route | Purpose | Audience | Primary action | Mode | Content source | Data source | Required states | SEO status | Owner`

Every route must be marked `unlocked`, `locked`, `redirect`, `private`, or `not applicable`. No route may be silently forgotten.

## 4. Complete route checklist

Include what applies. Record an explicit reason for every omission.

### Core public pages

- Home.
- About or company profile.
- Services index and service detail pages.
- Products, portfolio, work, projects, or case studies.
- Brand or visual-direction page for a demo when requested.
- Team, leadership, or founder page.
- Pricing, packages, process, or how it works.
- Testimonials or proof only when verified.
- Blog, insights, news, resources, or updates.
- FAQ.
- Contact.
- Search and search results when the site needs search.
- Human-readable HTML sitemap at `/sitemap` when useful.
- Public brand-guideline page at `/brand`, built from approved `BRAND.md` content.

### Conversion and account pages

- Enquiry, quotation, booking, application, newsletter, or checkout flow.
- Form confirmation and submission failure.
- Sign in, sign up, forgot password, reset password, verify email, signed-out, and session-expired states when authentication exists.
- Account, dashboard, profile, settings, billing, and sign-out routes when applicable.
- Access denied and permission-required pages.

### Legal and trust pages

- Privacy policy.
- Terms and conditions.
- Cookie notice or preferences when tracking requires it.
- Refund, delivery, cancellation, accessibility, or acceptable-use policies when relevant.
- Contact details, business identity, and policy dates must be accurate.

### System and resilience pages

- Custom 404 not found page.
- Custom 500 or unexpected-error page.
- Route-level error boundary.
- Global error boundary.
- Loading state for every asynchronous route or action.
- Empty state for every list, dashboard, search, inbox, cart, gallery, or data view.
- No-results state distinct from an empty first-use state.
- Offline or connection-lost state where network failure matters.
- Maintenance page.
- Coming-soon page only when intentionally used.
- Locked-demo page.
- Rate-limit, unavailable-service, and retry states where relevant.
- Skeletons, progress indicators, or status text without layout shift.
- Reduced-motion treatment.
- Print stylesheet where users are likely to print.

### Machine-readable and platform files

- `sitemap.xml` containing canonical indexable routes only.
- `robots.txt` with the correct environment policy.
- Web app manifest when applicable.
- Favicon and platform icons.
- Open Graph and social-sharing images.
- Canonical URLs.
- Unique page titles and descriptions.
- Structured data that matches visible content.
- Security headers and redirect rules.
- `humans.txt`, security contact, RSS, or feeds only when justified.

Do not put locked demo routes, private routes, duplicate URLs, or error pages in the production sitemap.

### Tangison Studio creative credit

- Add a restrained footer credit on every public page: `Made by Tangison Studio`.
- Link the complete credit text to `https://studio.tangison.com`.
- Use a normal crawlable anchor, an accessible focus state, and sufficient contrast.
- Open in the same tab by default. If the approved design opens it in a new tab, add the required security attributes.
- Keep the credit visible and tasteful. Do not hide it with tiny text, low contrast, clipping, or off-screen positioning.
- Preserve the client’s visual hierarchy. The credit is a small authorship signature, not a competing logo treatment.
- Remove or change the credit only when the user explicitly instructs it for that project.

## 5. Design direction

Use the approved brand brief. If none exists, define:

- design character;
- one-sentence visual idea;
- layout boldness;
- motion intensity;
- information density;
- typography pair or family;
- colour roles and tokens;
- image direction;
- recurring motif;
- component and spacing rules.

Record the complete system in `BRAND.md` before styling production pages. The code must use named design tokens derived from it. The `/brand` page must demonstrate the real system through type, colour, imagery, motion, components, and voice, not merely repeat token values.

Build a recognisable visual system, not a collection of unrelated sections. Vary composition while keeping type, spacing, colour logic, controls, and imagery coherent.

Reject generic AI patterns unless the brief specifically calls for them:

- interchangeable gradient heroes;
- endless rounded cards;
- glass panels without purpose;
- floating badges and pills everywhere;
- decorative dashboard charts with fake figures;
- generic icon packs used as decoration;
- centred layouts on every section;
- stock photographs of staged handshakes or people laughing at laptops;
- unsupported claims and invented social proof.

Name one art-direction owner before implementation: Taste Skill from `https://github.com/Leonxlnx/taste-skill`, Hallmark from `https://github.com/Nutlope/hallmark`, Impeccable from `https://github.com/pbakaus/impeccable`, or another approved system. Supporting design skills may study, critique, harden, adapt, or audit. They must not overwrite the approved `BRAND.md` or silently mix incompatible directions.

For React product interfaces, evaluate Astryx from `https://github.com/facebook/astryx`. If selected, inspect its current docs and CLI, pin exact packages, customise tokens to `BRAND.md`, avoid stock themes as the final identity, and measure accessibility and bundle impact. Astryx is a candidate, not a universal default.

Do not default to Inter, Roboto, Arial, or a generic system font without a reason. Respect the brand font when licensed and available. Preserve supplied logos exactly.

## 6. Content production rules

Use the exact approved copy from `CONTENT_PLAN.md` or the supplied source. Keep names, figures, dates, URLs, telephone numbers, addresses, and legal wording exact.

Write headings for the page’s real purpose. Avoid vague labels such as “Solutions”, “Innovation”, or “Welcome” when a precise heading is available.

Reject copy such as “revolutionise”, “unlock your potential”, “next generation”, “cutting edge”, “seamless”, “game changing”, generic testimonials, fabricated metrics, and empty superlatives.

Avoid em dashes. Use commas, full stops, colons, semicolons, or parentheses.

Do not force prose into identical card lengths. Editorial text, service descriptions, captions, labels, errors, empty states, and calls to action each need their own rhythm.

## 7. Implementation discipline

Use this order:

1. Inspect the existing project fully.
2. Confirm current stable framework and dependency versions from primary sources.
3. Reuse current patterns, components, tokens, and dependencies where suitable.
4. Define routes, data contracts, tokens, and shared shell.
5. Build the global header, navigation, footer, metadata, and responsive layout.
6. Build unlocked routes in priority order.
7. Build locked demo routes when in demo mode.
8. Build all required system states and operational pages.
9. Connect integrations with safe environment separation.
10. Add focused tests for critical paths.
11. Verify the build before audit.

Use Superpowers from `https://github.com/obra/superpowers` for the applicable planning, test-driven development, systematic debugging, review, and verification workflows. Use Ponytail from `https://github.com/dietrichgebert/ponytail` to constrain dependencies and speculative abstraction. Record which workflow ran and its proof.

Prefer the platform, standard library, and installed dependencies. Add a dependency only when it materially reduces risk or complexity. Do not create speculative abstractions or scaffolding for imagined future features.

## 8. Responsive and accessible behaviour

Test at minimum:

- 320, 375, 390, 768, 1024, 1280, and 1440 CSS pixels;
- keyboard-only navigation;
- 200 percent browser zoom;
- increased text size;
- reduced motion;
- light and dark themes when supported;
- slow network and failed network requests;
- long names, long headings, missing images, and empty datasets.

Requirements:

- semantic landmarks and heading order;
- visible focus states;
- meaningful labels and error messages;
- touch targets of at least 44 by 44 CSS pixels where practical;
- sufficient colour contrast;
- alt text for meaningful images and empty alt text for decorative images;
- no keyboard traps;
- no horizontal overflow;
- media that preserves aspect ratio;
- animation based on transform and opacity where possible.

## 9. Functional completion

Verify every navigation item, button, link, form, modal, accordion, carousel, filter, authentication action, and external destination.

For every asynchronous action, implement and test:

- idle;
- loading;
- success;
- validation failure;
- server failure;
- timeout or offline failure;
- retry or recovery path.

No control may look active while doing nothing. No `#` links, dead buttons, unexplained disabled controls, or console errors may remain.

## 10. Verification gate

Before handing off:

- run the type checker;
- run the linter;
- run unit, integration, and end-to-end tests that exist;
- run the production build;
- inspect browser console and network failures;
- crawl internal routes and check broken links;
- verify metadata, `robots.txt`, `sitemap.xml`, canonical URLs, and structured data;
- verify the `Made by Tangison Studio` footer credit and its link on every public page;
- verify demo locking or full-route access as required;
- verify the `/brand` page against `BRAND.md` and confirm it is unlocked in demo mode;
- capture representative desktop and mobile screenshots;
- inspect every important page and state visually.

Report exact commands and results. If no test suite exists, say so. Do not invent a pass.

## 11. Handoff

Create a concise build report containing:

- build mode;
- routes completed, locked, redirected, private, and omitted;
- states completed;
- integrations and environment requirements;
- tests and build results;
- known limitations;
- unresolved decisions requiring the user;
- exact audit target and recommended next step.

Do not deploy automatically. Hand the verified build to `tangison-web-audit`. Deployment follows only after the required audit gate passes.
