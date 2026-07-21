---
description: "Create, redesign, or refine premium print-ready business PDFs for Tangison Studio and its clients, including quotations, proforma invoices, invoices, proposals, company profiles, letters, agreements, NDAs, reports, certificates, briefs, statements of work, minutes, and receipts. Use when a document must feel intentionally art-directed rather than templated, follow Tangison or supplied client branding, repeat authentic logos with restraint and purpose, include logo watermarks or cropped brand motifs, preserve exact business details, and pass rendered visual QA before delivery."
---
# Tangison Documents

Create a designed communication object, not decorated text. Make every page earn its composition. Use exact supplied logos, factual content, and deliberate hierarchy. Never ship the first render.

## Universal operating foundation

This skill is harness-neutral. Use it in Codex, Claude Code, Kimi Code, Antigravity, Gemini CLI, Cursor, Windsurf, Zed, OpenCode, or any Agent Skills-compatible harness. Translate tool names to the current harness without weakening the workflow.

Use available tools whenever they can inspect a source, calculate a figure, manipulate a file, render a page, or verify a claim more reliably than prose. Prefer first-party connectors and local deterministic tools. Record material actions and evidence. Never claim a tool ran when it did not.

Iterate autonomously through `inspect, plan, create, render, inspect visually, correct, re-render, preflight, record`. Continue until every required page passes, progress stalls for three cycles, ten cycles run, or a missing fact or external authority requires the user.

## Non-negotiable outcomes

- Write like a sharp human professional: specific, direct, context-aware, and free of filler.
- Choose an art direction before layout. Do not reuse one universal header-and-table template.
- Build in A4 unless the user explicitly requests another format.
- Use exact logos as immutable assets. Never redraw, regenerate, spell out, or distort a logo.
- Establish a visible brand rhythm across the document: primary logo, small page signature, watermark, or cropped brand fragment according to page role.
- Keep watermarks subtle enough for reading and printing. A watermark must never compete with body text.
- Render every page to images, inspect it, correct defects, and render again.
- Reject clipped, missing, overflowing, blank, duplicated, or visually unfinished pages.

## Workflow

1. Identify the document type, audience, purpose, delivery format, facts, figures, dates, signatory, payment relevance, and brand mode.
2. Inspect all supplied logos, photos, screenshots, signatures, and reference documents. Determine image dimensions, transparency, legibility, and whether each asset is authoritative.
3. Ask one concise question at a time only when a missing fact would materially change the document. Do not ask for information that can be safely omitted.
4. Read [references/document-directions.md](references/document-directions.md) and select a page architecture and logo rhythm suited to the document type.
5. Read [references/brand-and-writing.md](references/brand-and-writing.md) for Tangison defaults, adaptive client branding, private-value handling, and copy rules.
6. Write a page plan before building: give each page one job, a dominant idea, a layout family, and an explicit logo treatment.
7. Generate the PDF using flow-based body content and page-level drawing only for backgrounds, watermarks, folios, crop marks, and recurring motifs.
8. Run `python3 scripts/preflight_pdf.py OUTPUT.pdf --render-dir RENDERS`.
9. Inspect every rendered page at readable size. Check edges, tables, logos, watermarks, text density, hierarchy, page breaks, and print economy.
10. Revise until all quality gates pass. Deliver only the final PDF and, when useful, a contact-sheet preview.

## Art-direction decision

Define this compact brief before coding:

```text
Document character: [editorial / formal / warm / restrained / ceremonial]
Visual idea: [one sentence tied to purpose or brand]
Grid: [single column / asymmetric split / modular / ledger / ceremonial axis]
Cover: [none / typographic / asymmetric / image-led / emblem-led]
Logo rhythm: [primary placement + internal-page signature + watermark cadence]
Motif: [rule / arc / crop / contour / monogram / none]
Print mode: [ink-light / standard / presentation-rich]
```

Vary the architecture, not the brand. A multi-page document must not repeat the same headline position, card grid, or dark fill on every page. Use at least three composition families for documents of six pages or more.

## Logo system

Treat logo presence as a composition system, not a header habit.

- Cover or opening page: use one confident primary logo placement. It may be off-centre, edge-aligned, or integrated into a large quiet field.
- Every internal page: include a small authentic logo or brand mark in a consistent folio/header zone unless the page intentionally uses a large watermark instead.
- Watermark cadence: normally use a watermark on 30–60% of internal pages; use one on every page only when the user explicitly wants strong repetition and readability remains excellent.
- Alternate watermark treatments: centred ghost mark, oversized cropped symbol from an edge, low-opacity wordmark, or blind-emboss style outline. Do not use the identical watermark at the identical scale everywhere.
- Use only one dominant logo treatment per page. A small folio logo may coexist with a watermark; two large logo treatments may not.
- Preserve aspect ratio and clear space. Never crop a full wordmark unless the cropped element is a recognized standalone symbol.
- Recommended opacity: 3–6% behind text, 7–12% in empty areas, up to 18% for outline marks. Test on the rendered page rather than trusting numeric opacity.
- For ink-light documents, prefer outline, pale tint, or small monochrome marks over large solid fills.
- If no verified logo asset is available, ask for it or omit it. Never fabricate one.

## Cover logic

Do not add a cover automatically.

- Use a cover when the document is ceremonial, persuasive, visual, long-form, or benefits from a strong first impression: proposals, reports, profiles, audits, campaign briefs, major agreements, and certificates.
- Usually omit a cover for invoices, receipts, short quotations, letters, minutes, and compact statements of work.
- Never assume centred alignment. Choose among asymmetric left anchor, lower-corner lockup, vertical margin title, split field, image-led crop, or ceremonial centre based on the document character.
- A minimal cover still needs tension: scale contrast, controlled whitespace, an edge relationship, a motif, or an intentional crop.

## Page construction

- Use 18–24 mm margins; increase them for ceremonial or legal documents.
- Keep body copy between 9 and 10.5 pt. Never use text below 7.5 pt.
- Use Poppins when available for Tangison documents. For a client brand, use supplied fonts or a metrically appropriate installed substitute.
- Use flowables for paragraphs, tables, lists, and pagination. Reserve canvas drawing for page-level decoration.
- Use page templates or callbacks so watermarks, folios, and page signatures are deterministic.
- Keep headings with the first content item. Keep signatures together. Repeat table headers after page breaks.
- Never squeeze content to force an arbitrary page count. Edit copy or add a purposeful page.
- Use horizontal rules sparingly. Avoid excessive boxes, pills, cards, and alternating grey bands.
- Financial tables prioritize scanning and arithmetic. Editorial pages prioritize hierarchy and rhythm.

## Tangison defaults

Use Tangison branding only when the document is from Tangison Studio. When designing for a client, the client brand leads and Tangison credit is omitted unless requested.

- Poppins typography.
- Charcoal `#2C2C2C`, white, warm bone `#F6F4EF`, Signal Teal `#2CB5B4`.
- Teal is an accent, not a large background or body-text colour.
- Body text remains charcoal or mid-grey.
- Default signatory: `Tangi` / `Tangison Studio`.
- Include banking details only where payment is contextually required.

Exact contact defaults and the secure banking-value protocol live in [references/brand-and-writing.md](references/brand-and-writing.md). Banking values must come from an approved private source for the current task.

## Document-specific routing

Use [references/document-directions.md](references/document-directions.md) to choose page count, cover logic, composition, logo cadence, payment block, signature, imagery, and data callouts. Treat ranges as guidance, not forced limits.

If the user asks for a client-branded document, derive the palette from verified client assets. Keep neutral body text and ensure accessible contrast. Do not introduce generic corporate blue, gradients, stock icons, or unrelated geometric shapes.

## Writing rules

- Lead with the decision, purpose, obligation, or value.
- Use real nouns and concrete verbs. Remove throat-clearing introductions and ceremonial filler.
- Do not invent testimonials, registration numbers, deliverables, timelines, guarantees, addresses, or legal terms.
- Separate facts, assumptions, estimates, and recommendations visibly.
- Add a short contextual note beside estimates; do not litter every number with a generic “tip” box.
- Use bullets only where scanning matters. Use prose for argument and context.
- Avoid repeated sentence shapes, generic section headings, and excessive em dashes.
- Preserve the user's tone and form of address.

## Financial and legal integrity

- Recalculate every subtotal, tax line, discount, deposit, balance, and total independently.
- State currency explicitly. For Namibia, use `N$` or `NAD` consistently.
- Do not label an invoice “tax invoice” or add VAT unless the supplied facts authorize it.
- Distinguish quotation validity, payment schedule, project timing, and scope exclusions.
- Never present generated legal language as jurisdiction-specific legal advice. Preserve supplied clauses exactly when editing an existing agreement.

## Visual QA gate

Run the preflight script, then inspect the render. Automated checks do not replace sight.

Reject the PDF if any condition is true:

- any page is not the requested size or orientation;
- a logo is distorted, blurry, recoloured without instruction, clipped, or too close to trim;
- watermark opacity harms reading or disappears unintentionally in print;
- a heading is stranded, a signature splits, a row clips, or a paragraph collides with a footer;
- a cover feels like a centred template when the content calls for a different composition;
- consecutive pages repeat the same layout without purpose;
- text is too dense, too small, or visibly AI-like;
- a page is blank, nearly blank without intent, or missing expected content;
- page numbering is wrong or cover/back-cover numbering contradicts the plan;
- an image is stretched, uncropped carelessly, or used without sufficient resolution.

Inspect at least the first page, every page transition, all dense tables, all signature pages, and every page with a watermark at full readable resolution. For short documents, inspect every page individually.

## Delivery

Name files clearly and professionally. Keep intermediate renders separate from the final deliverable. Return the final PDF with a short summary of the design direction and any assumptions that remain. Do not claim completion until the final render has passed inspection.
