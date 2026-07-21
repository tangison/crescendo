# Cross-Harness Setup

Webman uses portable `SKILL.md` files. Prefer the maintained `npx skills` installer from `https://github.com/vercel-labs/skills`, which detects many harnesses and supports explicit agent targets.

## Universal setup

List before installing:

```bash
npx skills add tangison/webman --list
```

Install Webman interactively:

```bash
npx skills add tangison/webman
```

Install all Webman skills to all detected harnesses only after approval:

```bash
npx skills add tangison/webman --all
```

Verify:

```bash
npx skills list
```

## Explicit harness targets

Use `-a` when the user wants a known target. Current examples include:

```bash
npx skills add tangison/webman -a codex
npx skills add tangison/webman -a claude-code
npx skills add tangison/webman -a kimi-code-cli
npx skills add tangison/webman -a antigravity
npx skills add tangison/webman -a gemini-cli
npx skills add tangison/webman -a cursor
npx skills add tangison/webman -a windsurf
npx skills add tangison/webman -a zcode
npx skills add tangison/webman -a zed
npx skills add tangison/webman -a opencode
```

Check the installer’s current supported-agent list before relying on an identifier. Do not manually copy files into guessed directories when the installer supports the harness.

## Plugin-specific systems

Some repositories include hooks, commands, agents, or MCP servers beyond plain skills. Use their official harness-specific installation method when those capabilities matter. This applies especially to Superpowers, Impeccable, Astryx MCP or CLI integration, and Open Design.

After installation, prove:

- installed path or plugin record;
- installed version or commit;
- skills visible to the harness;
- one relevant invocation succeeds;
- no unexpected files, secrets, or global configuration changes occurred.
