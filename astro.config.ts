import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

import mdx from '@astrojs/mdx';

import astrowind from './vendor/integration';
import imageOptimizer from './vendor/integration/image-optimizer';
import imgDimensions from './vendor/integration/img-dimensions';
import yaml from '@rollup/plugin-yaml';
import tailwindcss from '@tailwindcss/vite';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const locale = process.env.SITE_LOCALE || 'en';

const configFile = locale === 'en' ? './src/config.yaml' : `./src/config.${locale}.yaml`;

export default defineConfig({
  output: 'static',

  // Astro 7 默认改为 'jsx'（JSX 空白规则会把内联元素间的文字粘在一起）。
  // 显式固定为 true 以保持 v6 的 HTML 感知压缩行为。
  compressHTML: true,

  // Removed-locale recovery (/zh|ja|ko|vi|hi/*) lives in functions/_middleware.ts
  // (REMOVED_LOCALES prefix-stripping 301). The former astro `redirects` object
  // generated meta-refresh shells that were NEVER served — the middleware 301
  // intercepts before static assets — so it was deleted as dead weight.
  // Non-worker news/rss fallbacks live in dist/_redirects (see
  // scripts/generate-fallback-redirects.mjs).

  integrations: [
    mdx(),

    imageOptimizer(),

    imgDimensions(),

    astrowind({
      config: configFile,
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
  },

  vite: {
    plugins: [yaml(), tailwindcss()],

    optimizeDeps: {
      exclude: ['@keystatic/core'],
    },

    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        ...(locale !== 'en'
          ? {
              '~/data/site/navigation.yaml': path.resolve(__dirname, `./src/data/site/navigation.${locale}.yaml`),
            }
          : {}),
      },
    },
  },
});
