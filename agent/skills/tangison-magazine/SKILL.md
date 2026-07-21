---
description: "Create, redesign, or refine premium editorial company profiles, annual reports, brand books, brochures, case studies, portfolios, lookbooks, impact reports, visual proposals, and magazine-style features. Use when visual storytelling matters as much as information, when pages may be generated individually as exact A4 or A5 images, when a print-ready PDF may be required, or when an agent must interview the user, lock exact page copy, preserve authentic logos, build varied editorial compositions, and visually inspect every final page."
---
# Tangison Magazine

Create editorial documents that feel commissioned, written, photographed, and art-directed for one specific organisation. Never begin with a generic template. Never treat a company profile as a decorated report.

## Universal operating foundation

This skill is harness-neutral. Use the current harness’s image, PDF, filesystem, shell, browser, and document tools by capability rather than by one vendor-specific name. If page-image generation is available, generate one page at a time. If deterministic typesetting is available, use it for exact text and logos.

Iterate through `interview, source verification, narrative plan, page-copy lock, art direction, page creation, visual inspection, correction, export, final inspection`. Continue until all pages pass, three cycles show no improvement, ten cycles run, or a missing decision requires the user. Keep proof of source files, character counts, renders, corrections, and final page dimensions.

## Mandatory interview

Always conduct a short follow-up interview before production, even when the request appears complete. If the user has already answered something, confirm it briefly instead of asking again.

Ask in one compact message:

1. **Output:** individual page images, one assembled PDF, or both?
2. **Format:** A4, A5, square, landscape, portrait, or another exact size?
3. **Extent:** required page count and whether cover and back cover count?
4. **Content:** use supplied final text, rewrite supplied material, or develop copy from verified facts?
5. **Brand:** which logo, colours, fonts, website, and visual references are authoritative?
6. **Imagery:** real supplied photos, client website images, licensed stock, generated supporting imagery, or typography-only?
7. **Character:** quiet premium, bold editorial, warm human, corporate formal, technical, heritage, luxurious, or another direction?

Do not generate pages until the user confirms the output method, format, page count, and brand source. If those four items are already explicit, still present the proposed page plan and ask for one approval before production.

## Choose the production mode

### Mode A: individual page images

Prefer this for highly visual company profiles, brochures, brand books, portfolios, lookbooks, short impact reports, and documents where each page should feel like finished artwork.

- Generate or compose one page at a time: page 01, inspect, correct, then page 02.
- Do not generate the full document as one contact sheet.
- Final pages must be straight-on, flat artwork with no mockup background, perspective, hand, desk, binding, shadows, or surrounding scene.
- Preserve the exact requested aspect ratio throughout.
- Export each page as a high-resolution PNG unless another format is requested.
- Use a contact sheet only for review after individual pages exist.
- Assemble the pages into a PDF only if the user requests a PDF or both formats.

### Mode B: composed PDF

Prefer this for long annual reports, dense reports, long-form editorial writing, exact tables, charts, searchable text, formal contents pages, accessibility, or documents likely to receive frequent copy revisions.

- Use a deterministic document or design tool with real text flow.
- HTML and CSS are optional, not the default. Use them only when they materially simplify the intended layout and can be rendered exactly.
- Do not force every page through one HTML template.
- Use proper page templates, grids, master-page elements, folios, image frames, and text styles.
- Render every page to images for visual inspection before delivery.

### Mode C: hybrid

Use this when the document needs both expressive art direction and exact text.

- Generate or edit photography, textures, illustrations, or background compositions separately.
- Place authentic logos and final text deterministically over the visual base.
- Use image generation for visual material, not as the only authority for spelling, numbers, logos, or dense copy.
- Export exact page images, then assemble them into a PDF if required.

When uncertain, recommend Mode A for short visual profiles and Mode C for profiles containing substantial exact text.

## Exact-text protocol

Every page must display the approved text exactly. Image quality never excuses incorrect wording.

Before creating visuals, build a page-copy ledger:

```text
PAGE 01
Role: Cover
Headline: [exact text]
Subheadline: [exact text]
Metadata: [exact text]
Footer: [exact text]
Visible character count: [number including spaces]
Logo: [exact asset]
Image: [exact source or required scene]
```

Repeat for every page. The ledger becomes the single source of truth.

- Do not paraphrase approved copy during image generation.
- Do not invent filler text, names, captions, statistics, testimonials, addresses, or contact details.
- Do not use lorem ipsum, gibberish, simulated text lines, or unreadable microtext.
- Count visible characters, including spaces, before layout.
- Use only 75 to 85 percent of the safe text capacity so the page retains whitespace.
- If copy exceeds capacity, edit it with the user or move it to another page. Never shrink it into unreadability.
- Inspect every word after generation.
- If an image model misspells or omits text, correct it through deterministic typesetting or regenerate the page. Never deliver approximate text.
- Official logos must be placed from the supplied asset whenever possible, not recreated inside a generated scene.

Suggested visible-copy budgets:

| Page role | Recommended characters including spaces |
|---|---:|
| Cover | 40 to 180 |
| Section opener | 80 to 300 |
| Image-led editorial page | 250 to 650 |
| Standard company-profile page | 500 to 1,000 |
| Dense editorial or report page | 850 to 1,400 |
| Services or process page | 450 to 900 |
| Team page | 350 to 800 |
| Contact or back cover | 150 to 500 |

These are design limits, not writing targets. Use less copy when the story is stronger visually.

## Format and export

Default to A4 portrait only when the user has not chosen another size.

- A4 portrait ratio: 1:1.414. Print export: 2480 × 3508 px at 300 dpi.
- A4 landscape: 3508 × 2480 px at 300 dpi.
- A5 portrait: 1748 × 2480 px at 300 dpi.
- A5 landscape: 2480 × 1748 px at 300 dpi.
- Keep all pages in one document at the same size and orientation unless a deliberate fold-out is requested.
- Maintain safe margins. Keep essential text and logos at least 12 mm from trim.
- For professional printing, allow 3 mm bleed where the output method supports it.
- Full-bleed images must extend into the bleed. Body text must not.

## Narrative before layout

Define the story in one sentence. Then create a page sequence in which every page has one job.

Common company-profile arc:

1. Cover: establish identity and tone.
2. Opening statement: who the organisation is and why it matters.
3. Story, mission, vision, or positioning.
4. Services, products, or capabilities.
5. Process, value chain, operating model, or geographic reach.
6. Proof: projects, figures, clients, credentials, or case study.
7. People, responsibility, impact, or competitive difference.
8. Contact and closing statement.

Adapt the sequence to the real organisation. Do not force mission, vision, and values onto separate pages when the content is weak. Do not add pages merely to reach a round number.

Before production, present a page plan containing:

| Page | Purpose | Dominant content | Layout family | Image | Logo treatment | Copy count |
|---|---|---|---|---|---|---:|

Get approval, then lock the sequence.

## Editorial design system

Build one visual grammar for the document:

- Grid.
- Type pairing.
- Palette.
- Image treatment.
- Recurring motif.
- Logo rhythm.
- Folio system.
- Caption style.
- Shape language.

Create variation through composition, not random styling.

For six pages or more, use at least three layout families:

- Full-bleed or image-dominant opener.
- Asymmetric editorial split.
- Bright page with shaped image crop.
- Multi-column narrative page.
- Process or timeline page.
- Data or proof page.
- Team or portrait page.
- Contact close.

Do not repeat the same circles, cards, title position, icon row, or dark background across every page. A colour inversion alone is not a new layout.

## Typography

Use contrast, not a compulsory font formula.

- Select a display face for personality and a highly readable text face for body copy.
- A serif and sans pairing often works, but it is not mandatory when the client brand uses another system.
- Do not force Playfair Display, Poppins, or Work Sans onto every client.
- Avoid default AI combinations that make unrelated brands look identical.
- Use the client’s real fonts when supplied.
- Use at least three intentional levels on a typical page: headline, body, caption or label.
- Make headlines editorial, not simply large bold text.
- Keep body copy readable at final physical size.
- Avoid full justification in narrow columns when it produces rivers.
- Use drop caps only for a genuine feature opener and no more than once per section.
- Use pull quotes only when the source contains a strong real line. Never invent one to decorate a page.

## Writing and copy design

Write for the page, audience, and brand. Do not paste generic corporate copy into a visual template.

- Begin each page with one clear editorial idea.
- Use specific facts, concrete nouns, and active verbs.
- Keep paragraphs short enough for the selected grid.
- Vary sentence length and structure.
- Use natural Namibian business English where relevant.
- Avoid em dashes. Use punctuation that reads naturally.
- Avoid headings such as “Who We Are” when a specific editorial headline can carry more meaning.
- Do not turn every idea into three cards or three bullets.
- Use prose for story, bullets for scanning, captions for context, and labels for navigation.
- Pull quotes must come verbatim from approved content or a supplied interview.
- Never fabricate quotations, testimonials, metrics, awards, partners, registrations, credentials, or project outcomes.

Reject phrases such as:

- “In today’s fast-paced world.”
- “We are proud to be a leading provider.”
- “At the heart of everything we do.”
- “Revolutionise.”
- “Unlock your potential.”
- “Cutting-edge.”
- “Game-changing.”
- “Seamless solutions.”
- “Unwavering commitment to excellence.”

Replace them with real capability, proof, place, people, method, or outcome.

## Brand and logo integrity

- Treat supplied logos as immutable.
- Never redraw, restyle, regenerate, misspell, or distort them.
- Use the primary logo confidently on the cover.
- Use a smaller logo, icon, watermark, or brand signature on internal pages.
- Vary watermark position and scale while preserving consistency.
- Keep watermarks subtle and away from dense text.
- Use client branding for client documents. Do not impose Tangison teal or Tangison typography.
- Omit Tangison credit unless requested.
- Derive a recurring motif from the actual brand mark, industry, product, landscape, or story.
- Never copy a reference template’s proprietary shapes, photos, wording, or watermarked assets.

## Image direction

- Prefer authentic client photography and verified website images.
- Treat reference images as layout and mood guidance, not source assets to reproduce.
- Do not use watermarked stock images in final work.
- Reject fake handshakes, fake offices, fake dashboards, and generic teams laughing at laptops.
- Generated imagery must match the client’s real geography, people, uniforms, vehicles, equipment, products, architecture, and industry.
- Named physical details are factual constraints.
- Do not add a logo to a generated uniform, vehicle, product, or building unless the exact supplied logo can be composited faithfully.
- Vary image scale deliberately: full-bleed, dominant crop, inset detail, portrait, process sequence, or quiet background.
- Do not use identical circular crops on every page.
- Caption documentary images, projects, data visuals, and credited photography when relevant. Decorative hero photographs do not require forced captions.

## Page-image generation sequence

For Mode A or Mode C:

1. Finalise the page-copy ledger.
2. Establish a master visual grammar from the approved cover direction.
3. Generate page 01 only.
4. Inspect size, logo, exact text, hierarchy, margins, image fidelity, and spelling.
5. Correct page 01 before continuing.
6. Generate page 02 using the same grammar but a different composition.
7. Continue one page at a time.
8. Name files sequentially: `Project_Page_01.png`, `Project_Page_02.png`.
9. After all pages pass, create a contact sheet for continuity review.
10. Assemble a PDF only when requested.

Never produce a mockup montage instead of the requested individual pages. Never use a generated overview board as the final deliverable.

## Quality control

Inspect every final page at full readable size.

Reject a page if:

- any approved text is missing, changed, misspelled, duplicated, or illegible;
- the logo is inaccurate, regenerated, stretched, clipped, or too small to verify;
- page size or orientation is wrong;
- the page contains fake microtext, gibberish, placeholder text, or invented facts;
- text sits too close to trim or is cut off;
- body copy is too dense or too small;
- imagery contradicts the real business;
- visual references have been copied too literally;
- a stock watermark remains;
- the page repeats the previous composition without purpose;
- the design looks like a purchased brochure template;
- the page contains generic AI shapes, random icons, or excessive cards;
- the visual hierarchy is unclear;
- the page is attractive only as a mockup but unusable as flat artwork.

For a PDF, render every page to images and inspect the same criteria. Confirm page count, page order, page numbers, image resolution, bleed, and trim safety.

## Delivery

For individual page mode, deliver every page separately at the exact requested dimensions. Provide a contact sheet only as an additional overview.

For PDF mode, deliver the final PDF and optionally its page renders.

For both, deliver individual pages first, then the assembled PDF.

Do not claim completion until every page has passed exact-text and visual inspection.

## Relationship to Tangison Documents

Use `tangison-documents` for transactional and information-first work such as quotations, invoices, letters, contracts, NDAs, receipts, and formal administrative reports.

Use `tangison-magazine` for company profiles, annual reports, brand books, brochures, case studies, portfolios, lookbooks, impact reports, and visual storytelling.

For a visual proposal, use this skill’s interview, narrative, image, typography, and page-generation system, then include the relevant commercial, payment, and signature controls from `tangison-documents`.
