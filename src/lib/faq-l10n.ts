import { faqs, type FaqRecord } from '~/data/faq';

// All languages currently serve the English pool FAQ set.
// Add per-language translations here as they become available.
export const FAQS_BY_LANG: Record<string, FaqRecord[]> = {
  en: faqs,
};
