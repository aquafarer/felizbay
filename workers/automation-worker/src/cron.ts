interface Env {
  DATA_BUCKET: R2Bucket;
  GSC_CLIENT_ID?: string;
  GSC_CLIENT_SECRET?: string;
  GSC_REFRESH_TOKEN?: string;
  GSC_SITE_URL?: string;
  INDEXNOW_KEY?: string;
  INDEXNOW_HOST?: string;
  INDEXNOW_KEY_LOCATION?: string;
}

export async function cron(env: Env): Promise<Response> {
  const results: Record<string, string> = {};
  const startedAt = new Date().toISOString();

  try {
    const { gscFetch } = await import('./gsc-fetch');
    results.gsc = await gscFetch(env).then((r) => (r.ok ? 'ok' : 'fail'));
  } catch {
    results.gsc = 'error';
  }

  try {
    const { ruleEngine } = await import('./rule-engine');
    results.rules = await ruleEngine(env).then((r) => (r.ok ? 'ok' : 'fail'));
  } catch {
    results.rules = 'error';
  }

  try {
    const { geoGenerator } = await import('./geo-generator');
    results.geo = await geoGenerator(env).then((r) => (r.ok ? 'ok' : 'fail'));
  } catch {
    results.geo = 'error';
  }

  try {
    const { submitToIndexNow } = await import('./indexnow');
    const indexnowResult = await submitToIndexNow(env);
    results.indexnow =
      indexnowResult.submitted > 0
        ? `ok:${indexnowResult.submitted}`
        : indexnowResult.errors.length > 0
          ? `fail:${indexnowResult.errors.join(',')}`
          : 'skip';
  } catch {
    results.indexnow = 'error';
  }

  const completedAt = new Date().toISOString();

  try {
    const log = await env.DATA_BUCKET.get('automation/log.json');
    const history = log ? ((await log.json()) as any[]) : [];
    history.push({ startedAt, completedAt, results });
    await env.DATA_BUCKET.put('automation/log.json', JSON.stringify(history.slice(-90)));
  } catch {
    /* log write failed */
  }

  return new Response(
    JSON.stringify({
      success: Object.values(results).every((r) => r === 'ok' || r.startsWith('ok:')),
      startedAt,
      completedAt,
      results,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
