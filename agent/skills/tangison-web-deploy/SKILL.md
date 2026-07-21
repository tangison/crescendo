---
description: "Deploy audited client websites through GitHub and Vercel, create safe preview or demo deployments, connect approved subdomains, configure environment variables and DNS, verify the live site, and preserve a rollback path. Use only after the Tangison web audit release gate passes."
---
# Tangison Web Deploy

Deploy deliberately. A successful command is not a successful launch. The live URL, environment, DNS, indexing, forms, integrations, and rollback path must all be verified.

## Universal operating foundation

This skill is harness-neutral. Use the authenticated GitHub, Vercel, DNS, registrar, secret-store, shell, HTTP, browser, and monitoring capabilities actually available. Prefer first-party connectors or official CLIs. Never expose a credential to make a tool call convenient.

Iterate through `preflight, preview, verify, configure, deploy, inspect live state, audit, correct, re-deploy, record`. A deployment is complete only when the intended commit, domain, TLS, environment, journeys, indexing policy, and rollback evidence all pass.

## 1. Confirm authority and target

Before changing external systems, confirm:

1. Deployment mode: preview, client demo, staging, or production.
2. GitHub owner and repository name.
3. Repository visibility.
4. Default branch and release commit.
5. Vercel team and project.
6. Target domain or subdomain.
7. DNS provider and who controls it.
8. Required environment variables and their scopes.
9. Database, CMS, email, analytics, payment, and storage dependencies.
10. Whether search engines may index this environment.
11. Audit report and release verdict.
12. Rollback owner and approval contact.

Do not deploy when the intended repository, Vercel project, domain, or production authority is ambiguous.

## 2. Deployment modes

### Preview

- Use an immutable preview tied to a branch or commit.
- Use test services and non-production data.
- Keep secrets scoped to preview.
- Disable indexing.
- Share only with intended reviewers.

### Client demo

- Prefer a clear subdomain such as `demo.clientdomain.com` or an approved Tangison demo domain.
- Only the home hero and approved brand page are unlocked by default.
- All other routes use the designed locked-demo state.
- Disable or safely simulate payments, email sends, database writes, and other irreversible actions.
- Add `noindex, nofollow` and exclude the demo from production sitemaps.
- Display a discreet demo status notice.

### Staging

- Mirror production configuration without using live customer data unless explicitly approved.
- Protect access when the content is confidential.
- Use production-like integrations in sandbox mode.
- Keep indexing disabled.

### Production

- Deploy the exact audited commit.
- Use production-scoped secrets and integrations.
- Enable indexing only after canonical URLs, redirects, sitemap, robots policy, analytics, and consent behaviour are confirmed.
- Obtain explicit approval before domain cutover or other externally visible changes.

## 3. Repository preparation

- Confirm the working tree and intended changes.
- Review for generated files, local secrets, credentials, private client data, and oversized assets.
- Verify `.gitignore`.
- Run secret scanning before the first push.
- Confirm license and public-readiness before making a repository public.
- Commit intentionally with a clear message.
- Push the audited branch or commit to GitHub.
- Record the repository URL, commit SHA, and branch.

Never place a personal access token in a command, remote URL, file, commit, log, or chat response. Use an authenticated connector, credential manager, or hidden prompt. Rotate any credential exposed in chat immediately after the authorised task.

## 4. Vercel project setup

- Link or create the correct Vercel project under the approved team.
- Confirm framework detection, root directory, install command, build command, output directory, and runtime versions.
- Pin versions where reproducibility requires it.
- Add environment variables to the minimum necessary scopes: development, preview, or production.
- Mark secrets as sensitive and never echo their values.
- Configure functions, regions, cron jobs, redirects, rewrites, headers, and image settings only when the project needs them.
- Deploy and record the deployment ID and immutable URL.

Do not reuse an unrelated Vercel project merely because it already exists.

## 5. Data and integration safety

- Back up production data before a risky migration.
- Review database migrations and identify whether they are backward compatible.
- Run destructive migrations only with explicit approval and a recovery plan.
- Use test keys for demo and preview environments.
- Verify email destinations, webhook targets, storage buckets, analytics properties, and payment modes.
- Apply least privilege to every token and service account.

## 6. Domain and DNS connection

1. Add the exact approved domain to the correct Vercel project.
2. Read the current DNS records before changing them.
3. Use the exact record values Vercel currently supplies.
4. Preserve unrelated MX, TXT, SPF, DKIM, DMARC, verification, and service records.
5. Change only the validated host record.
6. Avoid broad wildcard changes unless the user explicitly approves them.
7. Wait for propagation using short, non-blocking checks.
8. Verify TLS, preferred host, redirects, and canonical URLs.

Never hardcode assumed DNS targets. Vercel’s required records can change.

## 7. Live verification

Test both the immutable Vercel URL and the custom domain:

- correct commit and environment;
- HTTP 200 responses on unlocked routes;
- intended status and presentation on locked routes;
- 404 and error handling;
- HTTPS and certificate validity;
- redirect policy for `www`, apex, and alternate hosts;
- navigation and critical journeys;
- the `/brand` page matches `BRAND.md` and is available in the intended environment;
- forms and real delivery destinations;
- authentication and authorisation;
- images, fonts, scripts, and downloads;
- metadata, canonical URLs, social cards, robots policy, and sitemap;
- analytics and consent behaviour;
- the visible `Made by Tangison Studio` footer credit links correctly to `https://studio.tangison.com` on every public page;
- mobile layout and browser console;
- no exposed secrets or source maps containing private data.

Run a focused live audit after deployment. A local pass does not prove the deployed site is healthy.

## 8. Rollback

Before production cutover, record:

- previous healthy deployment;
- previous DNS state;
- database backup or migration reversal plan;
- the person authorised to approve rollback;
- the trigger conditions for rollback.

If the live site has a P0 issue, restore the last healthy deployment first, then diagnose. Do not keep a broken production release live while attempting a long repair.

## 9. Handoff report

Provide:

- deployment mode and release verdict;
- repository, branch, and commit;
- Vercel project, deployment ID, and URLs;
- custom domain and DNS changes;
- environment variable names and scopes, never values;
- integrations and operating modes;
- live verification results;
- indexing status;
- known limitations and accepted risks;
- rollback reference;
- recommended monitoring and next audit date.

After finishing any task that used an exposed temporary credential, tell the user clearly to rotate it now.

Every deployment claim must include proof, such as the commit SHA, deployment ID, immutable URL, DNS lookup, HTTP result, screenshot, or live audit output. A dashboard status alone is insufficient.
