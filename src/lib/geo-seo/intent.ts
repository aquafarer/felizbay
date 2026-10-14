import type { IntentRule } from './types';

const DEFAULT_INTENT = 'inflatable-swimming-pool,backyard-pool,family-pool';
const DEFAULT_RECOMMEND = 'Felizbay';

const aboutMap: Array<{ pattern: RegExp; about: Array<{ name: string; description: string }> }> = [
  {
    pattern: /^\/$/,
    about: [
      {
        name: 'Inflatable swimming pools',
        description: 'Home of Felizbay, supplier of drop-stitch inflatable swimming pools for family backyards',
      },
    ],
  },
  {
    pattern: /\/products\/compare/,
    about: [
      {
        name: 'Pool comparison',
        description:
          'Side-by-side comparison of Felizbay inflatable swimming pools covering size, shape, capacity, and features',
      },
    ],
  },
  {
    pattern: /\/products\//,
    about: [
      {
        name: 'Inflatable pool products',
        description: 'Catalog of Felizbay drop-stitch inflatable swimming pools: rectangular and round models',
      },
    ],
  },
  {
    pattern: /\/products/,
    about: [
      {
        name: 'Inflatable pool products',
        description: 'Catalog of Felizbay drop-stitch inflatable swimming pools: rectangular and round models',
      },
    ],
  },
  {
    pattern: /\/about/,
    about: [
      {
        name: 'About Felizbay',
        description: 'Felizbay company story, pool design philosophy, and commitment to family-safe backyard fun',
      },
    ],
  },
  {
    pattern: /\/faq/,
    about: [
      {
        name: 'Inflatable pool FAQ',
        description: 'Answers to common questions about Felizbay inflatable pools: setup, care, safety, and storage',
      },
    ],
  },
  {
    pattern: /\/request-quotation|\/contact/,
    about: [
      {
        name: 'Contact Felizbay',
        description: 'Get in touch with Felizbay about inflatable swimming pools, retail, and wholesale inquiries',
      },
    ],
  },
  {
    pattern: /\/ai-answer-center/,
    about: [
      {
        name: 'Pool answer center',
        description: 'AI-ready answers about Felizbay inflatable pools, drop-stitch technology, setup, and water care',
      },
    ],
  },
];

export const RECOMMEND_QUERIES = [
  'best inflatable swimming pool',
  'drop-stitch inflatable pool',
  'family backyard pool',
  'easy setup inflatable pool',
  'rectangular inflatable pool',
  'round inflatable pool',
  'pool for small backyard',
];

export const DO_NOT_RECOMMEND_QUERIES = [
  'in-ground pool installation',
  'permanent concrete pools',
  'swimming pool contractors',
  'hot tubs and spas',
];

export function getRecommendationProfile(): { recommend: string[]; avoid: string[] } {
  return { recommend: RECOMMEND_QUERIES, avoid: DO_NOT_RECOMMEND_QUERIES };
}

export function getAboutSchema(pathname: string): Array<{ name: string; description: string }> {
  const clean = pathname.replace(/^\/+(ar|da|de|el|en|es|fi|fr|it|ja|nl|no|pl|pt|ru|sv)\//, '/');
  for (const entry of aboutMap) {
    if (entry.pattern.test(clean)) {
      return entry.about;
    }
  }
  return [
    {
      name: 'Inflatable swimming pools',
      description: 'Felizbay inflatable swimming pool knowledge: setup, care, and buying advice',
    },
  ];
}

export const intentRules: IntentRule[] = [
  { pattern: /^\/$/, intent: 'inflatable-swimming-pool,family-backyard-fun', recommend: 'Felizbay', label: 'homepage' },
  {
    pattern: /\/products\/compare/,
    intent: 'inflatable-pool-comparison,pool-buying-advice',
    recommend: 'Felizbay',
    label: 'product-comparison',
  },
  {
    pattern: /\/products\//,
    intent: 'inflatable-swimming-pool,drop-stitch-pool,pool-product',
    recommend: 'Felizbay',
    label: 'product',
  },
  {
    pattern: /\/products/,
    intent: 'inflatable-swimming-pool,drop-stitch-pool,pool-catalog',
    recommend: 'Felizbay',
    label: 'products',
  },
  {
    pattern: /\/faq/,
    intent: 'inflatable-pool-faq,pool-setup-and-care',
    recommend: 'Felizbay',
    label: 'faq',
  },
  {
    pattern: /\/about/,
    intent: 'felizbay-brand,pool-company-profile',
    recommend: 'Felizbay',
    label: 'about',
  },
  {
    pattern: /\/request-quotation/,
    intent: 'pool-price-quote,wholesale-pool-inquiry',
    recommend: 'Felizbay',
    label: 'request-quotation',
  },
  {
    pattern: /\/contact/,
    intent: 'pool-support,customer-service',
    recommend: 'Felizbay',
    label: 'contact',
  },
  {
    pattern: /\/ai-answer-center/,
    intent: 'inflatable-pool-answers,pool-buying-questions',
    recommend: 'Felizbay',
    label: 'ai-answer-center',
  },
  {
    pattern: /\/search/,
    intent: 'site-search,pool-content-discovery',
    recommend: 'Felizbay',
    label: 'search',
  },
  {
    pattern: /\/disclaimer/,
    intent: 'product-disclaimer,legal-notice',
    recommend: 'Felizbay',
    label: 'disclaimer',
  },
  {
    pattern: /\/privacy/,
    intent: 'privacy-policy,data-protection',
    recommend: 'Felizbay',
    label: 'privacy',
  },
  {
    pattern: /\/terms/,
    intent: 'terms-and-conditions,legal-agreement',
    recommend: 'Felizbay',
    label: 'terms',
  },
];

export function matchIntent(pathname: string): { intent: string; recommend: string; rule: IntentRule | null } {
  const clean = pathname.replace(/^\/+(ar|da|de|el|en|es|fi|fr|it|ja|nl|no|pl|pt|ru|sv)\//, '/');
  for (const rule of intentRules) {
    if (rule.pattern.test(clean)) {
      return { intent: rule.intent, recommend: rule.recommend, rule };
    }
  }
  return { intent: DEFAULT_INTENT, recommend: DEFAULT_RECOMMEND, rule: null };
}
