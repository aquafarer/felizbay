interface Env {
  DATA_BUCKET: R2Bucket;
}

export async function ruleEngine(env: Env): Promise<Response> {
  try {
    const rulesObj = await env.DATA_BUCKET.get('seo/rules.json');
    const rules = rulesObj ? ((await rulesObj.json()) as any[]) : [];
    const tasks: any[] = [];

    for (const rule of rules || []) {
      if (rule.type === 'missing_faq') {
        tasks.push({
          rule: rule.type,
          page: `/en${rule.path}`,
          action: 'Generate FAQ section',
          priority: 'high',
          generated: new Date().toISOString(),
        });
      }
      if (rule.type === 'missing_schema') {
        tasks.push({
          rule: rule.type,
          page: `/en${rule.path}`,
          action: 'Add JSON-LD schema',
          priority: 'medium',
          generated: new Date().toISOString(),
        });
      }
    }

    await env.DATA_BUCKET.put('seo/tasks/current.json', JSON.stringify(tasks));

    return new Response(JSON.stringify({ success: true, tasksGenerated: tasks.length, tasks }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : 'Unknown' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
