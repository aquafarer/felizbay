import fs from 'fs';
import * as yaml from 'js-yaml';
import { products, type ProductRecord } from '~/data/products';
import { productTexts } from '~/data/product-texts';

export function localizeProduct(product: ProductRecord, locale: string): ProductRecord {
  if (locale === 'en') return product;

  const yamlPath = `src/data/product-texts/${locale}/${product.id}.yaml`;
  try {
    if (fs.existsSync(yamlPath)) {
      const raw = fs.readFileSync(yamlPath, 'utf8');
      const texts = yaml.load(raw) as Partial<ProductRecord> | null;
      if (texts && typeof texts === 'object') {
        return {
          ...product,
          name: texts.name ?? product.name,
          desc: texts.desc ?? product.desc,
          definition: texts.definition ?? product.definition,
          problem: texts.problem ?? product.problem,
          howItWorks: texts.howItWorks ?? product.howItWorks,
          audience: texts.audience ?? product.audience,
          ai_use_cases: texts.ai_use_cases ?? product.ai_use_cases,
          ai_comparison: texts.ai_comparison ?? product.ai_comparison,
          ai_faq: texts.ai_faq ?? product.ai_faq,
        };
      }
    }
  } catch {
    /* noop */
  }

  const texts = productTexts[locale]?.[product.id];
  if (!texts) return product;
  return {
    ...product,
    name: texts.name ?? product.name,
    desc: texts.desc ?? product.desc,
    definition: texts.definition ?? product.definition,
    problem: texts.problem ?? product.problem,
    howItWorks: texts.howItWorks ?? product.howItWorks,
    audience: texts.audience ?? product.audience,
    ai_use_cases: texts.ai_use_cases ?? product.ai_use_cases,
    ai_comparison: texts.ai_comparison ?? product.ai_comparison,
    ai_faq: texts.ai_faq ?? product.ai_faq,
  };
}

export function getLocalizedProducts(locale: string): ProductRecord[] {
  return products.map((p) => localizeProduct(p, locale));
}
