// Route classification for i18n: which paths have localized variants under
// src/pages/[lang]/ and which are root-only (EN-only, no /{lang}/ variant).
//
// A route is LOCALIZED when it exists for every language under
// src/pages/[lang]/: the home page, the 7 core stems (about/contact/...) and
// the products tree (index + product slugs). /products/specs and
// /products/compare are EN-only utility pages and stay root-only.
//
// Root-only routes must NOT get hreflang alternates (Layout.astro) or
// language-switcher links (Header.astro) — those would be dead URLs.
// Keep this list in sync with the src/pages/[lang]/ route tree.

const LOCALIZED_ROUTE_STEMS = new Set(['/about', '/contact', '/disclaimer', '/faq', '/privacy', '/search', '/terms']);

export function isLocalizedRoute(pathWithoutLang: string): boolean {
  let p = pathWithoutLang.split('?')[0].split('#')[0];
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  if (p === '' || p === '/') return true; // home
  if (LOCALIZED_ROUTE_STEMS.has(p)) return true;
  if (p === '/products') return true;
  if (p.startsWith('/products/')) {
    return p !== '/products/specs' && p !== '/products/compare';
  }
  return false;
}

export function isRootOnlyRoute(pathWithoutLang: string): boolean {
  return !isLocalizedRoute(pathWithoutLang);
}
