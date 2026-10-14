import fs from 'node:fs';
import path from 'node:path';

export function getAdminSlugs(subdir: string): { slug: string; ext: string }[] {
  try {
    const dir = path.join(process.cwd(), subdir);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(md|mdx)$/i.test(f))
      .map((f) => ({ slug: f.replace(/\.(md|mdx)$/i, ''), ext: (f.match(/\.(md|mdx)$/i) || ['.md'])[0] }));
  } catch {
    return [];
  }
}
