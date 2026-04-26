## Project

Personal portfolio site.

- **Pkg mgr:** Bun. No `npm`/`pnpm`.
- **Astro:** Unreleased `^6.1.9`, breaking changes. Prefer `astro-docs` MCP server (see `.mcp.json`) over training + web search.

### Commands

```bash
bun dev                    # http://localhost:4321
bun build                  # runs `resume:build` (prebuild) → astro build → ./dist
bun run check              # astro check (type-check)
bun run lint               # eslint .
bun run lint:fix
bun run format             # prettier --write .
bun run lighthouse         # both, sequentially
```

### Layout

```
src/
  pages/        # routes (index.astro, robots.txt.ts)
  layouts/      # Layout.astro (head, JSON-LD, theme bootstrap)
  components/   # section components (Header, Hero, About, SelectedWork, Spotlight, Writing, Contact, ThemeSwitcher)
  content/      # writing collection (markdown)
  data/         # resume.yaml — single source of truth for content
  lib/          # resume.ts — typed loader/parser for resume.yaml
  scripts/      # portfolio.ts (client runtime: theme switcher)
  styles/       # global.css (Tailwind v4 + tokens)
  assets/       # imported, processed (logos, portrait)
public/         # served as-is (incl. generated cv.pdf)
resume/
  build.ts      # Typst → PDF compile step (runs as `prebuild`)
  template.typ  # CV template
  fonts/        # local TTFs used only by the Typst compile
```

### Non-negotiables: perf & SEO

Portfolio. Perf + SEO = product reqs, not nice-to-haves. Every change respects:

- **Lighthouse budget:** ≥95 perf, a11y, best-practices, SEO. CWV: LCP <2.5s, INP <200ms, CLS <0.1.
- **Zero client JS default.** Static HTML/CSS. Astro islands only when interactive. Prefer `client:visible` / `client:idle` over `client:load`. Justify any `client:load`.
- **Images:** `<Image>` / `<Picture>` from `astro:assets`. AVIF/WebP, explicit `width`/`height`, `loading="lazy"` + `decoding="async"` below fold. Never raw `<img>` for processed assets.
- **Fonts:** via `fontProviders` (Google) in `astro.config.mjs`, rendered through `<Font>` from `astro:assets` — Astro self-hosts + subsets at build. `font-display: swap`. Preload only critical face. `resume/fonts/` = Typst CV only, never ref from site.
- **SEO baseline:** every page sets `<title>`, meta description, canonical, OG/Twitter via `Layout.astro`. Generate `sitemap.xml` + `robots.txt`. JSON-LD (Person, per-project where fits).
- **Third-party scripts:** none default. Analytics deferred or server-side. No render-blocking `<head>` tags.

Regression on any → stop, surface tradeoff before implementing.

### Project conventions (load-bearing)

- **Theme verify uses `?theme=light|dark`.** Inline bootstrap (`Layout.astro`) + runtime (`scripts/portfolio.ts`) honor query param ahead of `localStorage` / `prefers-color-scheme`. Chrome's `--force-prefers-color-scheme` overridden by Lighthouse CDP emulation → URL param = only reliable lever.
- **Lighthouse on dedicated ports.** Light = 4422, dark = 4423 — avoid clash with `bun dev` (4321) + stale previews. `bun run lighthouse` green on both before merging style/head/runtime changes.
- **Resume content = `src/data/resume.yaml`.** Single source for site (`lib/resume.ts`) + CV PDF (`resume/build.ts`). `public/cv.pdf` generated, gitignored. `bun build` regenerates via `prebuild` (needs `typst` on `PATH`).
- **`bun run validate` (lint + astro check) must pass before merge.** CI also enforces `prettier --check`. No disabling rules to silence errors.
- **Lint, fix, format after yourself.**
- No commit `docs/superpowers/`. Gitignored.

---

# CLAUDE.md

Behavioral guidelines. Reduce LLM coding mistakes. Merge w/ project instructions.

**Tradeoff:** Bias caution > speed. Trivial tasks → use judgment.

## 1. Think before coding

**No assume. No hide confusion. Surface tradeoffs.**

Before implementing:

- State assumptions explicit. Uncertain → ask.
- Multiple interpretations → present, don't pick silent.
- Simpler approach exists → say so. Push back when warranted.
- Unclear → stop. Name confusion. Ask.

## 2. Simplicity first

**Min code that solves problem. Nothing speculative.**

- No features beyond ask.
- No abstractions for single-use.
- No "flexibility" / "configurability" not requested.
- No error handling for impossible scenarios.
- 200 lines could be 50 → rewrite.

Ask: "Senior eng say overcomplicated?" Yes → simplify.

## 3. Surgical changes

**Touch only what you must. Clean only your mess.**

Editing existing:

- No "improve" adjacent code, comments, formatting.
- No refactor things not broken.
- Match existing style even if you'd do diff.
- Notice unrelated dead code → mention, don't delete.

Your changes create orphans:

- Remove imports/vars/fns YOUR changes made unused.
- No remove pre-existing dead code unless asked.

Test: every changed line traces direct to user request.

## 4. Goal-driven execution

**Define success criteria. Loop until verified.**

Tasks → verifiable goals:

- "Add validation" → "Tests for invalid inputs, then make pass"
- "Fix bug" → "Test that reproduces, then make pass"
- "Refactor X" → "Tests pass before + after"

Multi-step → state brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong criteria → loop independent. Weak ("make it work") → constant clarification.

---

**Working if:** fewer unnecessary diffs, fewer rewrites from overcomplication, clarifying Qs before implementation not after mistakes.
