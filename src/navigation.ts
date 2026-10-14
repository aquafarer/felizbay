import { getPermalink } from './utils/permalinks';

import navData from '~/data/site/navigation.yaml';

const PRODUCT_LIST = '/products';

const headerData = {
  topBarLinks: navData?.header?.topBar ?? [],
  links: navData?.header?.links?.map((entry: { text?: string; links?: Array<{ text?: string; href?: string }> }) => ({
    text: entry?.text,
    links: (entry?.links ?? []).map((l: { text?: string; href?: string }) => ({ text: l?.text, href: l?.href })),
  })) ?? [
    {
      text: 'Products',
      links: [{ text: 'All Inflatable Swimming Pools', href: getPermalink(PRODUCT_LIST) }],
    },
  ],
  actions: navData?.header?.actions ?? [
    { text: 'Get a quote', href: getPermalink('/contact'), variant: 'primary' as const },
  ],
};

export { headerData };

export const footerData = {
  links: navData?.footer?.links ?? [
    {
      title: 'Products',
      links: [{ text: 'All Inflatable Swimming Pools', href: getPermalink(PRODUCT_LIST) }],
    },
  ],
  secondaryLinks: navData?.footer?.secondaryLinks ?? [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  footNote: navData?.footer?.footNote,
  socialLinks: (navData?.footer?.socialLinks ?? []).filter((s: { href?: string }) => s?.href && s.href !== '#'),
};
