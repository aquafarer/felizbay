interface Env {
  DATA_BUCKET: R2Bucket;
}

export async function taskExport(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'json';

  try {
    const tasksObj = await env.DATA_BUCKET.get('seo/tasks/current.json');
    const tasks = tasksObj ? ((await tasksObj.json()) as any[]) : [];

    if (format === 'csv') {
      const header = 'priority,page,action,generated';
      const rows = tasks.map((t: any) => `"${t.priority}","${t.page}","${t.action}","${t.generated}"`);
      return new Response([header, ...rows].join('\n'), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename=seo-tasks.csv',
        },
      });
    }

    if (format === 'md') {
      const lines = ['# SEO Tasks', '', '| Priority | Page | Action | Generated |', '|---|---|---|---|'];
      tasks.forEach((t: any) => lines.push(`| ${t.priority} | ${t.page} | ${t.action} | ${t.generated} |`));
      return new Response(lines.join('\n'), {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      });
    }

    return new Response(JSON.stringify({ tasks, count: tasks.length }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : 'Unknown' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
