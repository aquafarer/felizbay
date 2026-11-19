/**
 * Product compliance claims — claim-type separated model.
 *
 * Competitor review 2026-11-19 (§二.3): the PDP compliance module must never
 * blend product conformity, design references, material testing and
 * management-system certification in one "Certifications" list. Each group
 * below states what the claim IS; the matching scope note (imported by the
 * PDP templates) states what it is NOT. Wording mirrors /compliance/.
 */

export interface ComplianceClaim {
  label: string;
  standard?: string;
  body?: string;
}

export interface ProductCompliance {
  /** Product conformity claim: CE marking per EN 16582-1 (residential pools). */
  productConformity: ComplianceClaim[];
  /** Design reference standards — NOT product certifications. */
  designReferences: string[];
  /** Factory management certifications — cover the facility, not products. */
  factoryCerts: ComplianceClaim[];
  /** Material compliance (chemical) — material-level, not product safety cert. */
  materialCompliance: string[];
  /** Material test methods (physical, per production batch). */
  testStandards: string[];
  warranty: string;
}

/**
 * Scope notes rendered under each claim group on the PDPs.
 * The EN sentence is the l10n dictionary key (product-strings.l10n.json);
 * both PDP templates must pass it through the same trStr pipeline.
 */
export const COMPLIANCE_SCOPE_NOTES = {
  conformity:
    'Applies to residential pool products as manufactured — not public-use pools or commercial installations.',
  designReference:
    'Referenced during design of residential models — a design reference is not a product certification.',
  factory: 'Covers the manufacturing facility and its management systems — not individual product conformity.',
  material: 'Material tests on the double-layer drop-stitch PVC — not a product safety certification.',
  boundary: 'Residential standards do not certify public or commercial pool installations.',
} as const;

/** Link label for the /compliance/ documentation page (l10n dictionary key). */
export const COMPLIANCE_DOCS_LABEL = 'Compliance documentation';

const poolCompliance: ProductCompliance = {
  productConformity: [{ label: 'CE', standard: 'EN 16582-1 (pool safety)' }],
  designReferences: ['ASTM F2666 (Portable Pool Safety)'],
  factoryCerts: [
    { label: 'ISO 9001:2015', standard: 'Factory quality management system', body: 'SGS' },
    { label: 'BSCI', standard: 'Social compliance audit', body: 'amfori' },
  ],
  materialCompliance: ['REACH (EU)', 'RoHS (EU)', 'California Prop 65'],
  testStandards: ['ASTM D751 (Tensile/Seam)', 'ASTM G154 (UV Aging)'],
  warranty: '2 years against manufacturing defects',
};

const defaultCompliance: ProductCompliance = poolCompliance;

export function getProductCompliance(category?: string): ProductCompliance {
  if (!category) return defaultCompliance;
  const key = category.toLowerCase();
  if (key === 'pool' || key === 'swimming-pool') return poolCompliance;
  return defaultCompliance;
}
