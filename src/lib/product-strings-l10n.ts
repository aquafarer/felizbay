// Batch B (2026-11): PDP string localization dictionary.
// src/data/product-strings.l10n.json (lang -> { EN string -> translation })
// covers the PDP strings that previously rendered raw EN on localized pages:
// safety rules, spec labels/values, spec group titles, the wholesale FOB note,
// compliance strings (cert standards, test standards, warranty), accessory
// names/specs, related-guide titles/descriptions, gallery alts, and small UI
// fragments ("from", "Image", "View", "No image available").
// Missing entries fall back to the EN source string, so the dictionary can be
// filled incrementally per language without ever rendering an empty string.
// Build-time only; the dictionary is never emitted to public/.
import stringsData from '~/data/product-strings.l10n.json';

const STRINGS_L10N = stringsData as Record<string, Record<string, string>>;

export function localizeProductString(text: string | undefined, lang: string): string | undefined {
  if (!text || lang === 'en') return text;
  const dict = STRINGS_L10N[lang];
  if (!dict) return text;
  return dict[text] ?? text;
}
