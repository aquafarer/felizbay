// Round 4 (2026-11): product markdown body + free-text field localization.
// - localizeMdxBody: build-time block-level replacement of the raw MDX body
//   (blank-line separated blocks; markdown tables stay EN) using
//   src/data/product-mdx.l10n.json (lang -> { EN block -> translated block }).
//   Returns undefined when nothing is localized so the page keeps the
//   compiled EN <Content/> component.
// - localizeText: dictionary lookup for product free-text fields
//   (definition/audience/ai_comparison/price notes) from
//   src/data/product-fields.l10n.json (lang -> { EN string -> translation }).
// Build-time only; dictionaries are never emitted to public/.
import mdxData from '~/data/product-mdx.l10n.json';
import fieldsData from '~/data/product-fields.l10n.json';

const MDX_L10N = mdxData as Record<string, Record<string, string>>;
const FIELDS_L10N = fieldsData as Record<string, Record<string, string>>;

export function localizeMdxBody(body: string | undefined, lang: string): string | undefined {
  if (!body || lang === 'en') return undefined;
  const dict = MDX_L10N[lang];
  if (!dict) return undefined;
  const blocks = body
    .trim()
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  let translated = 0;
  const out = blocks.map((block) => {
    const t = dict[block];
    if (t && t !== block) {
      translated++;
      return t;
    }
    return block;
  });
  if (translated === 0) return undefined;
  return out.join('\n\n');
}

export function localizeText(text: string | undefined, lang: string): string | undefined {
  if (!text || lang === 'en') return text;
  const dict = FIELDS_L10N[lang];
  if (!dict) return text;
  return dict[text] ?? text;
}
