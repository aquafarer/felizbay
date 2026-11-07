import { faqs, type FaqRecord } from '~/data/faq';
import l10nData from '~/data/faq.l10n.json';

// FAQ localization (Round 3, 2026-11): per-language question/answer dictionary
// from src/data/faq.l10n.json (lang -> { EN string -> translation }), applied
// to the shared EN FaqRecord set. Records keep ids, categories, and relations
// untranslated. Missing entries fall back to the EN source string.
const L10N = l10nData as Record<string, Record<string, string>>;

function localizeRecord(f: FaqRecord, dict: Record<string, string>): FaqRecord {
  return {
    ...f,
    question: dict[f.question] ?? f.question,
    answer: dict[f.answer] ?? f.answer,
  };
}

export const FAQS_BY_LANG: Record<string, FaqRecord[]> = Object.fromEntries(
  Object.entries(L10N).map(([lang, dict]) => [lang, faqs.map((f) => localizeRecord(f, dict))])
);
FAQS_BY_LANG.en = faqs;

/** Localize per-product ai_faq q/a entries (PDP Module 12 FAQ accordion). */
export function localizeFaqEntries<T extends { q: string; a: string }>(entries: T[], lang: string): T[] {
  const dict = L10N[lang];
  if (!dict) return entries;
  return entries.map((e) => ({ ...e, q: dict[e.q] ?? e.q, a: dict[e.a] ?? e.a }));
}
