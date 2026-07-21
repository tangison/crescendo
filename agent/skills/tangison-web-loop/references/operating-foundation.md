# Webman Operating Foundation

## Capability discovery

At the start of every project:

1. Identify the harness and its skill, plugin, connector, MCP, browser, shell, filesystem, image, document, and deployment capabilities.
2. Read repository instructions and existing handoff files.
3. List required capabilities, available capabilities, missing capabilities, and installation actions requiring approval.
4. Verify current external tools from their primary sources.
5. Record the result in `PROOF.md`.

Do not assume the absence of a tool because one familiar tool name is missing. Search the harness for an equivalent capability.

## Tool calling policy

Call a tool when it can establish facts or perform work more reliably than narrative reasoning. Typical triggers include:

- current software versions, documentation, prices, laws, schedules, or live websites;
- repository state, source files, assets, environment configuration, tests, and build output;
- calculations, financial totals, data transformations, and structured comparisons;
- screenshots, page rendering, image dimensions, OCR, PDFs, and responsive inspection;
- GitHub, Vercel, DNS, analytics, Search Console, CMS, database, email, payment, or monitoring state;
- accessibility, performance, SEO, security, link, dependency, and secret scanning.

Priority:

1. User-supplied source and explicit instruction.
2. First-party connector, MCP server, or official API.
3. Local repository and deterministic CLI.
4. Official documentation or primary web source.
5. Reputable secondary evidence only when a primary source cannot answer the question.

Never send private data to a third-party tool without approval. Never expose credentials in commands, output, evidence, or source control.

## Autonomous iterative loop

Every phase uses this loop:

1. Observe current state.
2. State the next bounded outcome and acceptance check.
3. Act with the smallest complete change.
4. Run deterministic verification.
5. Inspect the result visually or functionally when relevant.
6. Trace failures to root causes.
7. Fix the root cause.
8. Re-run the exact failing check.
9. Record before-and-after proof.
10. Hand off only when the phase gate passes.

Defaults:

- `MAX_ITERATIONS = 10` per phase.
- Escalate after three cycles without measurable improvement.
- Ask the user only when a missing choice changes scope, cost, legal meaning, brand truth, production data, external visibility, or irreversible state.
- Continue safe in-scope work while waiting when possible.

## Proof contract

Maintain `PROOF.md`:

`Phase | Action | Target | Tool or method | Version | Result | Evidence | Timestamp | Status`

Use `PASS`, `FAIL`, `BLOCKED`, or `ACCEPTED RISK`. Evidence must be reproducible where practical. Redact secrets and private customer data.

## Completion language

- Say `planned` only when scope and acceptance criteria are approved.
- Say `built` only when code exists and the production build passes.
- Say `tested` only when named tests ran and results are retained.
- Say `audited` only when named tools or documented manual checks ran.
- Say `deployed` only when the intended commit is live.
- Say `launched` only when the approved domain and critical journeys are verified.
