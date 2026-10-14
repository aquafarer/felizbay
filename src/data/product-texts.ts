import type { ProductRecord } from '~/data/products';

export type ProductTexts = Partial<
  Pick<
    ProductRecord,
    | 'name'
    | 'desc'
    | 'definition'
    | 'problem'
    | 'howItWorks'
    | 'audience'
    | 'ai_use_cases'
    | 'ai_specs'
    | 'ai_comparison'
    | 'ai_faq'
  >
>;

// Per-language product text overrides. All languages currently fall back
// to the English pool records in ~/data/products; add translations here
// when they become available.
export const productTexts: Record<string, Record<string, ProductTexts>> = {};
