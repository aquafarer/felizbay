// Long-form product page localization.
// - PRODUCT_CONTENT_L10N: per-language markdown bodies (per-product), currently
//   empty — all languages serve the English pool product markdown.
// - localizeProductDetail: build-time deep-replace of the EN strings in
//   PRODUCT_PAGE_DETAILS (Round 2, 2026-11) using a lang -> { EN string ->
//   translation } dictionary from src/data/product-page-content.l10n.json
//   (build-time only, never emitted to public/).
import l10nData from '~/data/product-page-content.l10n.json';
import type { ProductPageDetail } from '~/data/product-page-content';

export const PRODUCT_CONTENT_L10N: Record<string, Record<string, string>> = {};

const PDP_L10N = l10nData as Record<string, Record<string, string>>;

const SKIP_KEYS = new Set(['titleKey', 'href']);

type Json = string | Json[] | { [key: string]: Json } | undefined;

function localizeValue(value: Json, dict: Record<string, string>): Json {
  if (typeof value === 'string') return dict[value] ?? value;
  if (Array.isArray(value)) return value.map((v) => localizeValue(v, dict));
  if (value && typeof value === 'object') {
    const out: { [key: string]: Json } = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = SKIP_KEYS.has(k) ? v : localizeValue(v, dict);
    }
    return out;
  }
  return value;
}

export function localizeProductDetail(
  detail: ProductPageDetail | undefined,
  lang: string
): ProductPageDetail | undefined {
  if (!detail) return detail;
  const dict = PDP_L10N[lang];
  if (!dict) return detail;
  return localizeValue(detail as unknown as Json, dict) as unknown as ProductPageDetail;
}
