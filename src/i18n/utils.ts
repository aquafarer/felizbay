import { defaultLang, languages } from './config';

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in languages) return lang;
  return defaultLang;
}

export function removeLang(path: string): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length > 0 && parts[0] in languages) {
    const base = '/' + parts.slice(1).join('/');
    // Preserve the trailing slash: /ar/about/ -> /about/ (not /about), so
    // language-switcher and hreflang URLs point straight at the 200 page
    // instead of hopping through a 308 redirect.
    if (path.endsWith('/') && !base.endsWith('/')) return base + '/';
    return base;
  }
  return path.startsWith('/') ? path : '/' + path;
}

export function localizePath(path: string, lang: string): string {
  // The default language (en) is served at the root — /en/ 308-redirects to /.
  // Always map English to the root-level URL so hreflang anchors don't point to
  // a redirect (Google ignores hreflang entries whose URLs redirect).
  if (lang === defaultLang) return removeLang(path);
  const hasTrailingSlash = path.endsWith('/');
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const base = '/' + lang + '/' + clean;
  return hasTrailingSlash && !base.endsWith('/') ? base + '/' : base;
}

/**
 * Slug-aware variant of localizePath. The /use-cases/ section was removed, so
 * this now simply delegates to localizePath. Kept as a
 * separate export so existing call sites (Layout, Header) stay unchanged.
 */
export function localizeUseCasePath(path: string, lang: string): string {
  return localizePath(path, lang);
}
