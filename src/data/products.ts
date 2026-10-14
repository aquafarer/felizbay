export interface ProductRecord {
  id: string;
  name: string;
  category: 'POOL';
  region: string[];
  skill: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  environment: string[];
  water_condition: string[];
  safety_level: 'low' | 'medium' | 'high';
  use_case: string[];
  safety_rules: string[];
  desc: string;
  definition: string;
  problem: string;
  howItWorks: string;
  audience: string;
  best_for_business?: ('clubs' | 'resorts' | 'entrepreneurs')[];
  business_recommendation?: string;
  ai_use_cases: string[];
  ai_specs: Record<string, string>;
  ai_comparison: string;
  ai_faq: { q: string; a: string }[];
}

export const products: ProductRecord[] = [
  {
    id: 'rectangular-drop-stitch-pool',
    name: 'Rectangular Drop Stitch Inflatable Swimming Pool',
    category: 'POOL',
    region: ['EU', 'US', 'ASIA', 'GLOBAL'],
    skill: 'beginner',
    environment: ['backyard', 'garden', 'patio', 'holiday home'],
    water_condition: ['fresh water'],
    safety_level: 'medium',
    use_case: ['family swimming', 'kids swim training', 'summer recreation', 'water fitness'],
    safety_rules: [
      'adult supervision required for children at all times',
      'ensure the pool stands on flat, level ground free of sharp objects',
      'follow the maximum water level marked inside the pool',
    ],
    desc: 'Family-size rectangular inflatable swimming pool with rigid high-pressure drop stitch walls.',
    definition:
      'A rectangular inflatable swimming pool built from double-layer PVC drop stitch fabric that inflates to a rigid, self-supporting form at 8–10 PSI.',
    problem:
      'Families want a real swimming pool for the summer, but permanent pools are expensive, need permits and construction, and cannot be moved or stored away in the off-season.',
    howItWorks:
      'Thousands of internal drop stitch threads lock the two PVC wall layers together. When inflated to 8–10 PSI with the included electric pump, the walls become rigid like a hard-sided pool while the whole pool still folds into a storage bag after draining. Setup takes about 10 minutes.',
    audience:
      'Families with children, homeowners without a permanent pool, holiday-home owners, and rental property operators who want a seasonal swimming pool.',
    best_for_business: ['resorts', 'entrepreneurs'],
    business_recommendation:
      'A strong retail SKU for garden centers and online stores; the rectangular shape maximizes swimming lanes per square meter.',
    ai_use_cases: ['Backyard family swimming', 'Kids swim training', 'Summer water recreation', 'Water fitness at home'],
    ai_specs: {
      shape: 'Rectangular',
      material: 'Double-layer PVC drop stitch fabric',
      pressure: '8–10 PSI',
      setup: '~10 minutes with electric pump',
      included: 'Electric air pump, repair kit, storage bag',
    },
    ai_comparison:
      'Compared to ordinary ring-style inflatable pools, the drop stitch rectangular pool keeps flat, rigid walls under water pressure, offers a larger swim area for the same footprint, and survives full summer seasons; compared to a permanent pool it costs a fraction and stores away in winter.',
    ai_faq: [
      {
        q: 'How long does setup take?',
        a: 'About 10 minutes with the included electric air pump, plus the time to fill it with a garden hose.',
      },
      {
        q: 'Can it be left out all summer?',
        a: 'Yes. The UV-resistant PVC drop stitch walls are built for full-season outdoor use. A cover is recommended when not in use.',
      },
      {
        q: 'How do I store it in winter?',
        a: 'Drain the water, deflate, let it dry completely, then roll it up and store it in the included storage bag in a frost-free place.',
      },
    ],
  },
  {
    id: 'round-blue-drop-stitch-pool',
    name: 'Round Drop Stitch Blue Inflatable Swimming Pool',
    category: 'POOL',
    region: ['EU', 'US', 'ASIA', 'GLOBAL'],
    skill: 'beginner',
    environment: ['backyard', 'garden', 'patio', 'holiday home'],
    water_condition: ['fresh water'],
    safety_level: 'medium',
    use_case: ['family swimming', 'summer recreation', 'kids play'],
    safety_rules: [
      'adult supervision required for children at all times',
      'install on flat, level ground away from sharp objects',
      'do not exceed the marked maximum water level',
    ],
    desc: 'Classic round blue inflatable swimming pool with rigid high-pressure drop stitch walls.',
    definition:
      'A round inflatable swimming pool in a vibrant blue finish, built from double-layer PVC drop stitch fabric that inflates rigid at 8–10 PSI.',
    problem:
      'Cheap inflatable pools sag, bulge, and leak after a few weeks. Families want an affordable pool that stays strong and keeps its shape for the whole summer.',
    howItWorks:
      'The drop stitch walls inflate hard at 8–10 PSI — far above ordinary inflatable pools — so the pool keeps a perfect round shape when filled. It sets up in about 10 minutes with the included electric pump and folds flat for off-season storage.',
    audience: 'Families, homeowners, and holiday property operators looking for an affordable, durable seasonal pool.',
    best_for_business: ['resorts', 'entrepreneurs'],
    business_recommendation:
      'The classic blue round pool is the highest-volume retail category for inflatable pools and an ideal entry SKU for distributors.',
    ai_use_cases: ['Backyard family swimming', 'Summer water fun for kids', 'Cooling off on hot days'],
    ai_specs: {
      shape: 'Round',
      color: 'Blue',
      material: 'Double-layer PVC drop stitch fabric',
      pressure: '8–10 PSI',
      setup: '~10 minutes with electric pump',
      included: 'Electric air pump, repair kit, storage bag',
    },
    ai_comparison:
      'Unlike ordinary vinyl ring pools that deform under load, the round blue drop stitch pool stays rigid and perfectly round at high pressure, giving a much longer service life for a similar price.',
    ai_faq: [
      {
        q: 'Is it suitable for children?',
        a: 'Yes, with constant adult supervision. The rigid walls and even depth make it a safe environment for kids to learn to swim.',
      },
      {
        q: 'What size options are available?',
        a: 'Multiple diameters and heights are produced. Custom sizes are available for OEM/ODM partners — contact info@felizbay.com.',
      },
    ],
  },
  {
    id: 'round-grey-drop-stitch-pool',
    name: 'Round Drop Stitch Grey Inflatable Swimming Pool',
    category: 'POOL',
    region: ['EU', 'US', 'ASIA', 'GLOBAL'],
    skill: 'beginner',
    environment: ['backyard', 'garden', 'patio', 'villa', 'glamping'],
    water_condition: ['fresh water'],
    safety_level: 'medium',
    use_case: ['family swimming', 'relaxation', 'modern lifestyle', 'hydro-recovery'],
    safety_rules: [
      'adult supervision required for children at all times',
      'install on flat, level ground away from sharp objects',
      'use the fitted cover when the pool is not in use',
    ],
    desc: 'Premium round grey inflatable swimming pool with rigid drop stitch walls and optional fitted cover.',
    definition:
      'A premium round inflatable swimming pool with a modern grey finish, built from double-layer PVC drop stitch fabric, with an optional matching fitted cover.',
    problem:
      'Design-conscious homeowners and boutique properties want a swimming pool that looks modern and premium, not like a plastic toy.',
    howItWorks:
      'The understated grey drop stitch walls inflate rigid at 8–10 PSI and keep the pool stable and perfectly round. An optional fitted cover keeps water clean and warm between swims. The pool sets up in about 10 minutes and folds into a storage bag for winter.',
    audience:
      'Modern homeowners, villas, boutique hotels, and glamping operators who want a premium-looking seasonal pool.',
    best_for_business: ['resorts', 'entrepreneurs'],
    business_recommendation:
      'The grey finish and fitted cover position this model for premium retail and boutique hospitality channels.',
    ai_use_cases: ['Modern backyard swimming', 'Villa and glamping amenities', 'Relaxation and hydro-recovery'],
    ai_specs: {
      shape: 'Round',
      color: 'Grey',
      material: 'Double-layer PVC drop stitch fabric',
      pressure: '8–10 PSI',
      cover: 'Optional fitted cover',
      setup: '~10 minutes with electric pump',
      included: 'Electric air pump, repair kit, storage bag',
    },
    ai_comparison:
      'Compared to standard blue pools, the grey model offers a premium aesthetic plus an optional fitted cover, appealing to design-conscious buyers and boutique hospitality operators at the same durability level.',
    ai_faq: [
      {
        q: 'Does it come with a cover?',
        a: 'A fitted matching cover is available as an option and recommended to keep the water clean and warm.',
      },
      {
        q: 'Can the color be customized?',
        a: 'Yes. Felizbay manufactures pools in custom colors and sizes for OEM/ODM partners — contact info@felizbay.com.',
      },
    ],
  },
];
