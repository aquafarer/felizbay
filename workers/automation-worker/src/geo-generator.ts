interface Env {
  DATA_BUCKET: R2Bucket;
}

export async function geoGenerator(env: Env): Promise<Response> {
  const results: any[] = [];
  const generated = new Date().toISOString();

  try {
    const templatesObj = await env.DATA_BUCKET.get('geo/templates/index.json');
    const templates = templatesObj ? ((await templatesObj.json()) as any[]) : [];

    for (const tpl of templates || []) {
      if (tpl.type === 'faq') {
        results.push({
          type: 'faq',
          slug: tpl.slug,
          generated,
          content: `FAQ for ${tpl.slug} — auto-generated`,
        });
      }
    }

    await env.DATA_BUCKET.put(
      'geo/generated/index.json',
      JSON.stringify({
        generated,
        count: results.length,
        items: results,
      })
    );

    return new Response(JSON.stringify({ success: true, generated, count: results.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : 'Unknown' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
