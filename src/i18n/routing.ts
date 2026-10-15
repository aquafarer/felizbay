import { defaultLang } from './config';
import { isRootOnlyRoute } from './root-only';

export const LOCALIZED_ROUTES = new Set([
  '/disclaimer',
  '/privacy',
  '/terms',
  '/products',
  '/faq',
  '/about',
  '/contact',
  '/search',
]);

export function localizeHref(href: string | URL | undefined | null, locale: string): string {
  const str = typeof href === 'string' ? href : href?.toString() || '';
  if (!str || !str.startsWith('/') || str.startsWith('//')) return str || '';
  // The default language (en) is served at the root (see localizePath in
  // ./utils). The /en/ tree only carries mirrored redirect pages, so
  // English links must stay un-prefixed or they 404.
  if (locale === defaultLang) return str;
  const base = str.split('?')[0].split('#')[0];
  if (base === '/') return str;
  // Root-only routes never have localized variants — keep them un-prefixed or
  // they 404 (e.g. nav "Pool Specs" on localized pages).
  if (isRootOnlyRoute(base)) return str;
  if ([...LOCALIZED_ROUTES].some((r) => base === r || base.startsWith(r + '/'))) {
    return '/' + locale + str;
  }
  return str;
}

export function entityForHref(href?: string): string {
  if (!href) return 'page';
  const path = href.replace(/^\/+/g, '');
  if (path === '' || path === 'home') return 'brand';
  if (path.startsWith('products/compare')) return 'product';
  if (path.startsWith('products')) return 'product';
  if (path.startsWith('guides')) return 'guide';
  if (path.startsWith('news') || path.startsWith('blog')) return 'article';
  if (path.startsWith('about')) return 'brand';
  if (path.startsWith('services') || path.startsWith('pricing') || path.startsWith('contact')) return 'service';
  return 'page';
}
