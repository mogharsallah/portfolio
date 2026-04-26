/* Lighthouse CI config.
 * Themed via LH_THEME env var ("light" | "dark"). Chrome's
 * --force-prefers-color-scheme flips the prefers-color-scheme MQ, which the
 * theme bootstrap in Layout.astro reads on first paint.
 * Run: LH_THEME=light bunx lhci autorun (or via the bun scripts).
 */

const theme = process.env.LH_THEME === 'dark' ? 'dark' : 'light';
// Dedicated ports per theme so concurrent runs (or a stale preview) never collide
// with each other or with `bun dev` (default 4321).
const port = theme === 'dark' ? 4423 : 4422;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `bun run preview --host 127.0.0.1 --port ${port}`,
      url: [`http://127.0.0.1:${port}/?theme=${theme}`],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        chromeFlags: [
          '--headless=new',
          '--no-sandbox',
          `--force-prefers-color-scheme=${theme}`,
        ].join(' '),
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: `.lighthouseci/${theme}`,
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
