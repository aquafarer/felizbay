import type { APIRoute } from 'astro';
import { POOL_IDEAS } from '~/data/pool-ideas';
import { poolSeries } from '~/data/pool-catalog';
import { SITE } from 'astrowind:config';

export const prerender = true;

const seriesById: Record<string, (typeof poolSeries)[number]> = {};
for (const s of poolSeries) seriesById[s.id] = s;

// Retail product pages per factory series — mirrors [slug].astro so the
// markdown endpoint links the same purchasable models as the HTML page.
const seriesProductPages: Record<string, Array<{ label: string; href: string }>> = {
  round: [
    { label: 'Round Blue Pool', href: '/products/round-blue-drop-stitch-pool/' },
    { label: 'Round Grey Pool', href: '/products/round-grey-drop-stitch-pool/' },
  ],
  'rect-square': [{ label: 'Rectangular Pool', href: '/products/rectangular-drop-stitch-pool/' }],
  'hot-tub-round': [{ label: 'Round SPA Tub', href: '/products/hot-tub-round/' }],
  'hot-tub-square-rect': [{ label: 'Square / Rect SPA Tub', href: '/products/hot-tub-square-rect/' }],
};

export async function getStaticPaths() {
  return POOL_IDEAS.map((i) => ({ params: { slug: i.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const idea = POOL_IDEAS.find((i) => i.slug === params.slug);
  if (!idea) return new Response('Not found', { status: 404 });

  const base = SITE?.site || 'https://felizbay.com';
  const lines: string[] = [];

  lines.push(`# ${idea.title}`);
  lines.push('');
  lines.push(`Category: ${idea.eyebrow}`);
  lines.push('');

  for (const p of idea.intro) {
    lines.push(p);
    lines.push('');
  }

  if (idea.conditions?.length) {
    lines.push('## Who This Fits');
    lines.push('');
    for (const c of idea.conditions) {
      lines.push(`- ${c}`);
    }
    lines.push('');
  }

  if (idea.matches?.length) {
    lines.push('## Matching Pool Families');
    lines.push('');
    for (const m of idea.matches) {
      const s = seriesById[m.series];
      lines.push(`### ${s?.name ?? m.series}`);
      lines.push('');
      if (s?.sizeRange) {
        lines.push(`Sizes: ${s.sizeRange}`);
        lines.push('');
      }
      lines.push(m.reason);
      lines.push('');
      const pages = seriesProductPages[m.series] ?? [];
      if (pages.length) {
        for (const l of pages) {
          lines.push(`- [${l.label}](${base}${l.href})`);
        }
        lines.push('');
      }
    }
  }

  if (idea.tableNote) {
    lines.push('## Size Notes');
    lines.push('');
    lines.push(idea.tableNote);
    lines.push('');
  }

  if (idea.safety?.length) {
    lines.push('## Safety');
    lines.push('');
    for (const s of idea.safety) {
      lines.push(`- ${s}`);
    }
    lines.push('');
  }

  if (idea.relatedGuides?.length) {
    lines.push('## Related Guides');
    lines.push('');
    for (const g of idea.relatedGuides) {
      lines.push(`- ${base}/guides/${g}`);
    }
    lines.push('');
  }

  lines.push(idea.cta);
  lines.push('');
  lines.push('---');
  lines.push(`Source: ${base}/pool-ideas/${idea.slug}`);

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
