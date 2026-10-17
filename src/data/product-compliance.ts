export interface ProductCompliance {
  certs: { label: string; standard?: string; body?: string }[];
  materialCompliance: string[];
  testStandards: string[];
  warranty: string;
}

const poolCompliance: ProductCompliance = {
  certs: [
    { label: 'CE', standard: 'EN 16582-1 (pool safety)' },
    { label: 'ISO 9001:2015', standard: 'Factory quality management system', body: 'SGS' },
    { label: 'BSCI', standard: 'Social compliance audit', body: 'amfori' },
  ],
  materialCompliance: ['REACH (EU)', 'RoHS (EU)', 'California Prop 65'],
  testStandards: ['ASTM F2666 (Portable Pool Safety)', 'ASTM D751 (Tensile/Seam)', 'ASTM G154 (UV Aging)'],
  warranty: '2 years against manufacturing defects',
};

const defaultCompliance: ProductCompliance = poolCompliance;

export function getProductCompliance(category?: string): ProductCompliance {
  if (!category) return defaultCompliance;
  const key = category.toLowerCase();
  if (key === 'pool' || key === 'swimming-pool') return poolCompliance;
  return defaultCompliance;
}
