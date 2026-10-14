export const ADMIN_LOCALES: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  ar: 'العربية',
  it: 'Italiano',
  ru: 'Русский',
  pl: 'Polski',
  nl: 'Nederlands',
  sv: 'Svenska',
  no: 'Norsk',
  el: 'Ελληνικά',
  fi: 'Suomi',
  da: 'Dansk',
};
export const ADMIN_LOCALE_CODES = Object.keys(ADMIN_LOCALES);

export function pageFileForLocale(slug: string, file: string, locale: string): string {
  if (locale === 'en') return file;
  return `src/data/pages/${locale}/${slug}.yaml`;
}

/**
 * Compute a per-locale path for a file in src/data/site/.
 * English keeps the original path; non-English uses a suffix.
 * Example: siteFileForLocale("src/data/site/about.yaml", "zh")
 *   → "src/data/site/about.zh.yaml"
 */
export function siteFileForLocale(basePath: string, locale: string): string {
  if (locale === 'en') return basePath;
  const dot = basePath.lastIndexOf('.');
  if (dot === -1) return `${basePath}.${locale}`;
  return basePath.slice(0, dot) + '.' + locale + basePath.slice(dot);
}

/**
 * Compute a per-locale path for a content collection file.
 * Example: contentFileForLocale("src/content/news/foo.md", "zh")
 *   → "src/content/news/foo.zh.md"
 */
export function contentFileForLocale(basePath: string, locale: string): string {
  if (locale === 'en') return basePath;
  const dot = basePath.lastIndexOf('.');
  if (dot === -1) return `${basePath}.${locale}`;
  return basePath.slice(0, dot) + '.' + locale + basePath.slice(dot);
}
