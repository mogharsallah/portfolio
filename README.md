# Portfolio

Personal portfolio site built with [Astro](https://astro.build).

## Requirements

- **Node:** ≥22.12.0
- **Package manager:** [Bun](https://bun.sh) (lockfile: `bun.lock`). Do not use `npm` or `pnpm`.

## Commands

| Command                    | Action                                                                 |
| :------------------------- | :--------------------------------------------------------------------- |
| `bun install`              | Install dependencies                                                   |
| `bun dev`                  | Start dev server at `http://localhost:4321`                            |
| `bun build`                | Build production site to `./dist/` (runs `resume:build` as `prebuild`) |
| `bun preview`              | Preview the production build locally                                   |
| `bun run resume:build`     | Compile `resume/template.typ` → `public/cv.pdf` (requires `typst`)     |
| `bun run check`            | Type-check Astro components (`astro check`)                            |
| `bun run lint`             | Run ESLint (`bun run lint:fix` to autofix)                             |
| `bun run format`           | Format with Prettier (`format:check` to verify only)                   |
| `bun run validate`         | `lint` + `check` — required to pass before merging                     |
| `bun run lighthouse:light` | Run Lighthouse CI against the light theme on port 4422                 |
| `bun run lighthouse:dark`  | Run Lighthouse CI against the dark theme on port 4423                  |
| `bun run lighthouse`       | Run both themes sequentially; assertions enforce the perf budget       |

## Structure

```
src/
  pages/        # routes (index.astro, robots.txt.ts)
  layouts/      # Layout.astro
  components/   # section components
  content/      # writing collection (markdown)
  data/         # resume.yaml — single source of truth for content
  lib/          # resume.ts — typed loader for resume.yaml
  scripts/      # client runtime (theme switcher)
  styles/       # global.css (Tailwind v4 + tokens)
  assets/       # imported, processed by the build
public/         # served as-is (incl. generated cv.pdf)
resume/         # Typst template + build script for the CV PDF
```

## Standards

This site treats performance and SEO as product requirements, not optimizations:

- **Lighthouse budget:** ≥95 across performance, accessibility, best-practices, SEO.
- **Core Web Vitals:** LCP <2.5s, INP <200ms, CLS <0.1.
- **Zero client JS by default.** Astro islands only where interactivity is needed; prefer `client:visible` / `client:idle`.
- **Images** via `astro:assets` (`<Image>` / `<Picture>`), AVIF/WebP, explicit dimensions, lazy below the fold.
- **Fonts** via Astro `fontProviders` (Google) self-hosted and subset at build time, `font-display: swap`.
- **Styling** with Tailwind v4 + design tokens in `src/styles/global.css` (`@theme`). No additional UI frameworks.
- **SEO baseline** on every page: title, description, canonical, OG/Twitter tags, sitemap, robots, JSON-LD.
- **No third-party scripts** by default.

See [`CLAUDE.md`](./CLAUDE.md) for the full contributor guidelines.
