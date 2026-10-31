import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { guides } from '~/data/guides';
import { procurementGuides } from '~/data/procurement-guides';
import { POOL_IDEAS } from '~/data/pool-ideas';
import { SITE } from 'astrowind:config';

export const prerender = true;

/**
 * Combined markdown index of every /llms/* content endpoint.
 * Served at /llms-index (NOT /llms/index — site-wide trailingSlash:'never'
 * would make that route a file colliding with the dist/llms directory).
 */
export const GET: APIRoute = async () => {
  const base = SITE?.site || 'https://felizbay.com';
  const products = await getCollection('product');

  const lines: string[] = [];

  lines.push('# Felizbay Markdown Endpoint Index');
  lines.push('');
  lines.push('Plain-markdown versions of Felizbay content for LLM consumption.');
  lines.push('');

  lines.push(`## Pool Owner Guides (${guides.length})`);
  lines.push('');
  for (const g of guides) {
    lines.push(`- [${g.title}](${base}/llms/guides/${g.slug}) — ${g.description}`);
  }
  lines.push('');

  lines.push(`## Procurement Guides (${procurementGuides.length})`);
  lines.push('');
  for (const g of procurementGuides) {
    lines.push(`- [${g.title}](${base}/llms/procurement/${g.slug}) — ${g.description}`);
  }
  lines.push('');

  lines.push(`## Pool Ideas (${POOL_IDEAS.length})`);
  lines.push('');
  for (const i of POOL_IDEAS) {
    lines.push(`- [${i.title}](${base}/llms/ideas/${i.slug}) — ${i.intro[0]}`);
  }
  lines.push('');

  lines.push(`## Products (${products.length})`);
  lines.push('');
  for (const p of products) {
    const title = p.data?.title ?? p.id;
    const blurb = p.data?.summary ?? p.data?.description ?? '';
    lines.push(`- [${title}](${base}/llms/products/${p.id})${blurb ? ` — ${blurb}` : ''}`);
  }
  lines.push('');

  lines.push('---');
  lines.push(`HTML versions: ${base}/guides/ | ${base}/pool-ideas/ | ${base}/products/`);
  lines.push(`Knowledge manifests: ${base}/llms.txt | ${base}/llms-full.txt`);

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
