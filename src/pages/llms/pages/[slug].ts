import type { APIRoute } from 'astro';
import { SITE_URL } from '~/lib/geo-seo';
import { standalonePages } from '~/data/standalone-pages';

export const prerender = true;

export async function getStaticPaths() {
  return standalonePages.map((p) => ({ params: { slug: p.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const page = standalonePages.find((p) => p.slug === params.slug);
  if (!page) {
    return new Response('Not found', { status: 404 });
  }

  const lines: string[] = [];

  lines.push(`# ${page.title}`);
  lines.push('');
  lines.push(page.description);
  lines.push('');

  for (const section of page.sections) {
    lines.push(`## ${section.heading}`);
    lines.push('');
    lines.push(section.body);
    lines.push('');
  }

  if (page.features.length > 0) {
    lines.push('## Key Features');
    lines.push('');
    for (const f of page.features) {
      lines.push(`- **${f.label}**: ${f.desc}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(`Source: ${SITE_URL}/${page.slug}`);

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
