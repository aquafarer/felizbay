interface Env {
  INDEXNOW_KEY?: string;
  INDEXNOW_HOST?: string;
  INDEXNOW_KEY_LOCATION?: string;
}

const INDEXNOW_API = 'https://api.indexnow.org/indexnow';

async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  const urls: string[] = [];
  try {
    const res = await fetch(sitemapUrl);
    if (!res.ok) return urls;
    const xml = await res.text();
    const locMatches = xml.match(/<loc>([^<]+)<\/loc>/g);
    if (locMatches) {
      for (const m of locMatches) {
        const url = m.replace(/<\/?loc>/g, '');
        if (url) urls.push(url);
      }
    }
  } catch {
    /* ignore */
  }
  return urls;
}

export async function submitToIndexNow(
  env: Env,
  customUrls?: string[]
): Promise<{ submitted: number; errors: string[] }> {
  const errors: string[] = [];
  let submitted = 0;

  const key = env.INDEXNOW_KEY;
  const host = env.INDEXNOW_HOST;
  const keyLocation = env.INDEXNOW_KEY_LOCATION;

  if (!key || !host) {
    return { submitted: 0, errors: ['INDEXNOW_KEY and INDEXNOW_HOST must be configured'] };
  }

  let urlList = customUrls;
  if (!urlList || urlList.length === 0) {
    const sitemaps = [`https://${host}/sitemap-index.xml`, `https://${host}/sitemap.xml`];
    const fetched = new Set<string>();
    for (const sm of sitemaps) {
      const urls = await fetchSitemapUrls(sm);
      for (const u of urls) fetched.add(u);
    }
    urlList = Array.from(fetched);
  }

  const batchSize = 10000;
  for (let i = 0; i < urlList.length; i += batchSize) {
    const batch = urlList.slice(i, i + batchSize);
    try {
      const res = await fetch(INDEXNOW_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host,
          key,
          keyLocation: keyLocation || `https://${host}/${key}.txt`,
          urlList: batch,
        }),
      });
      if (!res.ok) {
        errors.push(`Batch ${i / batchSize}: HTTP ${res.status} ${res.statusText}`);
      } else {
        submitted += batch.length;
      }
    } catch (e) {
      errors.push(`Batch ${i / batchSize}: ${e instanceof Error ? e.message : 'Unknown'}`);
    }
  }

  return { submitted, errors };
}

export async function indexnowHandler(env: Env, request: Request): Promise<Response> {
  const url = new URL(request.url);
  const customUrls = url.searchParams.get('urls')?.split(',').filter(Boolean);
  const result = await submitToIndexNow(env, customUrls);

  return new Response(JSON.stringify(result), {
    status: result.errors.length > 0 && result.submitted === 0 ? 500 : 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
