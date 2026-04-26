// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://gharsallah.com',
  integrations: [sitemap()],

  build: {
    // Inline the global stylesheet into <head> so it's not a render-blocking
    // request. Astro's default 'auto' (~4 KB threshold) skips our ~7 KB build;
    // 'always' forces inlining and trims the LCP critical path.
    inlineStylesheets: 'always',
  },

  experimental: {
    svgo: true,
  },

  fonts: [
    { provider: fontProviders.google(), name: 'Fraunces', cssVariable: '--font-fraunces' },
    { provider: fontProviders.google(), name: 'Inter', cssVariable: '--font-inter' },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
