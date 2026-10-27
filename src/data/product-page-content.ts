/**
 * Editorial content for the product detail page V2 template
 * (per2.txt 13-module layout, minimal version — all 5 pool products).
 *
 * All facts verified against:
 * - src/content/products/*.mdx (retail truth per product)
 * - src/data/pool-catalog.ts (factory catalog, FOB prices, series inclusions)
 * - src/data/product-compliance.ts (certifications, warranty)
 */

export interface AssuranceBlock {
  titleKey: string;
  text: string;
  href?: string;
}

export interface FitRow {
  recommended: string;
  check: string;
}

export interface SetupStep {
  title: string;
  description: string;
}

export interface SupportCard {
  titleKey: string;
  summary: string;
  details: string[];
  href?: string;
  hrefLabel?: string;
}

export interface ProductPageDetail {
  /** Module 02 — purchase confirmation bar under the hero */
  assurance: AssuranceBlock[];
  /** Module 03 — one-line scope statement above the fit table */
  fitIntro: string;
  /** Module 03 — right-pool fit boundary rows */
  fitRows: FitRow[];
  /** Module 03 — planning notice for elevated / rental installs */
  fitNotice: { title: string; text: string };
  /** Module 06 — retail package contents (source: MDX frontmatter "Included") */
  packageIncluded: string[];
  /** Module 06 — site requirements the buyer must provide separately */
  packageRequired: string[];
  /** Module 07 — setup & seasonal storage steps */
  setupSteps: SetupStep[];
  /** Module 07 — resource entry points */
  setupLinks: { label: string; href: string }[];
  /** Module 09 — delivery / shipping / returns / warranty cards */
  supportCards: SupportCard[];
}

/** Shared delivery / shipping / returns / warranty cards (identical policy for all products) */
const SUPPORT_CARDS_BASE: SupportCard[] = [
  {
    titleKey: 'product.deliveryCard',
    summary: 'Retail orders ship to the address entered at checkout.',
    details: [
      'Single-piece online purchase is fulfilled by direct shipping.',
      'In-stock orders ship within 2–3 business days.',
      'A dispatch confirmation with tracking is sent by email after checkout.',
      'Delivery time depends on your destination and is shown by the carrier after dispatch.',
    ],
  },
  {
    titleKey: 'product.shippingCard',
    summary: 'Shipping cost and options are shown at checkout before you pay.',
    details: [
      'The exact shipping cost for your address is calculated during checkout.',
      'Some remote destinations may not be serviceable — you will be notified if your order cannot ship.',
    ],
  },
  {
    titleKey: 'product.returnsCard',
    summary: 'Unused products in original packaging can be returned.',
    details: [
      'Contact info@felizbay.com with your order reference before returning anything.',
      'Return shipping costs and conditions are confirmed case by case depending on the destination.',
    ],
  },
  {
    titleKey: 'product.warrantyCard',
    summary: '2-year manufacturer warranty on material and workmanship defects.',
    details: [
      'The warranty covers manufacturing defects in the drop-stitch fabric, seams, and valves.',
      'It does not cover punctures from external objects, improper pressure, or normal wear.',
      'Warranty requests: info@felizbay.com with your order reference and photos.',
    ],
  },
];

/** Shared setup links (EN hrefs — [lang] pages prefix the language code at render time) */
const SETUP_LINKS_BASE: { label: string; href: string }[] = [
  { label: 'View Setup Guides', href: '/guides/' },
  { label: 'Ask a Support Question', href: '/contact/' },
];

/** Swim-pool setup & seasonal storage steps (rectangular + round swim pools) */
const SWIM_POOL_SETUP_STEPS: SetupStep[] = [
  {
    title: 'Review the installation requirements',
    description:
      'Read the manual first: recommended 4–5 PSI operating pressure, ground conditions, and fill limits for your model.',
  },
  {
    title: 'Prepare the setup area',
    description: 'Choose a flat, firm, level surface. Remove sharp objects and confirm drainage away from the pool.',
  },
  {
    title: 'Inflate with the included pump',
    description:
      'The 1000W electric air pump inflates the pool to rigidity in about 10 minutes. Stop at the recommended pressure.',
  },
  {
    title: 'Check valves and fittings',
    description: 'Confirm the shut-off valve, drain valve, and pressure-relief valve are seated and closed before filling.',
  },
  {
    title: 'Fill to the recommended level',
    description: 'Fill with a garden hose. Watch the walls for even shape and stop at the recommended fill line.',
  },
  {
    title: 'Drain, dry, and store at season end',
    description: 'Open the drain valve, empty the pool, let it dry fully, then deflate, fold, and pack it into the storage bag.',
  },
];

/** Soaking-pool setup steps (hot tubs — heater sold separately, professional install) */
const HOT_TUB_SETUP_STEPS: SetupStep[] = [
  {
    title: 'Review the installation requirements',
    description:
      'Read the manual first: recommended 4–5 PSI operating pressure, fill limits, and the heater/filtration connection specs for your model.',
  },
  {
    title: 'Prepare the setup area',
    description:
      'Choose a flat, firm, level surface rated for the filled weight, with water supply, drainage, and power access nearby.',
  },
  {
    title: 'Inflate with a 1000W electric pump',
    description: 'One person inflates the tub to rigidity in 5–15 minutes. Stop at the recommended pressure.',
  },
  {
    title: 'Check valves and connect equipment',
    description:
      'Confirm all valves are seated, then connect your heating unit and sand filter pump via the standard circulation ports (equipment sold separately, installed by a qualified professional).',
  },
  {
    title: 'Fill to the recommended level',
    description: 'Fill with a garden hose and watch for the even wall shape. Stop at the fill line marked inside the tub.',
  },
  {
    title: 'Drain, dry, and store when needed',
    description:
      'Open the drain valve, empty the tub, let it dry fully, then deflate, fold, and pack it away for storage or relocation.',
  },
];

/** Elevated / rental planning notice shared by the swim pools */
const SWIM_POOL_FIT_NOTICE = {
  title: 'Planning an elevated installation or a rental-property project?',
  text: 'Do not assume suitability from product size alone. The filled pool weighs hundreds of kilograms — confirm the structure is rated for it, and check local requirements before purchase.',
};

/** Load-rating notice for the soaking pools */
const HOT_TUB_FIT_NOTICE = {
  title: 'Planning a balcony or elevated-deck installation?',
  text: 'A filled soaking pool weighs several hundred kilograms. Only install on a structure professionally confirmed to carry the full water load, and check local requirements before purchase.',
};

export const PRODUCT_PAGE_DETAILS: Record<string, ProductPageDetail> = {
  'rectangular-drop-stitch-pool': {
    assurance: [
      {
        titleKey: 'product.assuranceIncluded',
        text: 'Pool body, 1000W electric air pump, full-coverage cover, repair kit, and storage bag.',
      },
      {
        titleKey: 'product.assuranceDelivery',
        text: 'Single-piece online orders ship from our warehouse. Dispatch is confirmed by email after checkout.',
      },
      {
        titleKey: 'product.assuranceWarranty',
        text: '2-year manufacturer warranty covering material and workmanship defects. Full terms on request.',
      },
      {
        titleKey: 'product.assuranceSupport',
        text: 'Setup guidance, care instructions, and direct support via info@felizbay.com.',
      },
    ],
    fitIntro:
      'This pool is intended for seasonal backyard swimming on flat, level ground. Before ordering, review the setup footprint, the recommended fill level, and the equipment requirements below.',
    fitRows: [
      {
        recommended: 'You want a defined, full-size swim area for seasonal backyard use',
        check: 'Your available ground-level area — measure before ordering, including setup clearance',
      },
      {
        recommended: 'You have a flat, firm, level surface (lawn, patio, or deck rated for the filled weight)',
        check: 'Ground suitability and drainage — the pool needs a stable base and a place for water to go',
      },
      {
        recommended: 'You prefer rigid drop-stitch walls that pack into a storage bag off-season',
        check: 'Water source for filling and a garden hose for the ~10-minute inflation plus fill time',
      },
      {
        recommended: 'You need a pool you can drain, fold, and store at season end',
        check: 'Local rules for your intended use (e.g. rental properties, water restrictions)',
      },
    ],
    fitNotice: SWIM_POOL_FIT_NOTICE,
    packageIncluded: ['1000W electric air pump', 'Full-coverage cover', 'Repair kit', 'Storage bag'],
    packageRequired: [
      'A flat, firm, level setup area (lawn, patio, or deck rated for the filled weight)',
      'A garden hose or water source for filling',
    ],
    setupSteps: SWIM_POOL_SETUP_STEPS,
    setupLinks: SETUP_LINKS_BASE,
    supportCards: SUPPORT_CARDS_BASE,
  },

  'round-blue-drop-stitch-pool': {
    assurance: [
      {
        titleKey: 'product.assuranceIncluded',
        text: 'Pool body, 1000W electric air pump, repair kit, and storage bag.',
      },
      {
        titleKey: 'product.assuranceDelivery',
        text: 'Single-piece online orders ship from our warehouse. Dispatch is confirmed by email after checkout.',
      },
      {
        titleKey: 'product.assuranceWarranty',
        text: '2-year manufacturer warranty covering material and workmanship defects. Full terms on request.',
      },
      {
        titleKey: 'product.assuranceSupport',
        text: 'Setup guidance, care instructions, and direct support via info@felizbay.com.',
      },
    ],
    fitIntro:
      'This pool is intended for seasonal backyard swimming on flat, level ground. Before ordering, review the setup footprint, the recommended fill level, and the equipment requirements below.',
    fitRows: [
      {
        recommended: 'You want a classic round pool for seasonal backyard swimming',
        check: 'Your available ground-level area — measure the full diameter before ordering, including setup clearance',
      },
      {
        recommended: 'You have a flat, firm, level surface (lawn, patio, or deck rated for the filled weight)',
        check: 'Ground suitability and drainage — the pool needs a stable base and a place for water to go',
      },
      {
        recommended: 'You prefer rigid drop-stitch walls that pack into a storage bag off-season',
        check: 'Water source for filling and a garden hose for the ~10-minute inflation plus fill time',
      },
      {
        recommended: 'You need a pool you can drain, fold, and store at season end',
        check: 'Local rules for your intended use (e.g. rental properties, water restrictions)',
      },
    ],
    fitNotice: SWIM_POOL_FIT_NOTICE,
    packageIncluded: ['1000W electric air pump', 'Repair kit', 'Storage bag'],
    packageRequired: [
      'A flat, firm, level setup area (lawn, patio, or deck rated for the filled weight)',
      'A garden hose or water source for filling',
    ],
    setupSteps: SWIM_POOL_SETUP_STEPS,
    setupLinks: SETUP_LINKS_BASE,
    supportCards: SUPPORT_CARDS_BASE,
  },

  'round-grey-drop-stitch-pool': {
    assurance: [
      {
        titleKey: 'product.assuranceIncluded',
        text: 'Pool body, 1000W electric air pump, repair kit, and storage bag. A fitted cover is available as an option.',
      },
      {
        titleKey: 'product.assuranceDelivery',
        text: 'Single-piece online orders ship from our warehouse. Dispatch is confirmed by email after checkout.',
      },
      {
        titleKey: 'product.assuranceWarranty',
        text: '2-year manufacturer warranty covering material and workmanship defects. Full terms on request.',
      },
      {
        titleKey: 'product.assuranceSupport',
        text: 'Setup guidance, care instructions, and direct support via info@felizbay.com.',
      },
    ],
    fitIntro:
      'This pool is intended for seasonal backyard swimming on flat, level ground. Before ordering, review the setup footprint, the recommended fill level, and the equipment requirements below.',
    fitRows: [
      {
        recommended: 'You want a premium-looking round pool for a modern backyard or patio',
        check: 'Your available ground-level area — measure the full diameter before ordering, including setup clearance',
      },
      {
        recommended: 'You have a flat, firm, level surface (lawn, patio, or deck rated for the filled weight)',
        check: 'Ground suitability and drainage — the pool needs a stable base and a place for water to go',
      },
      {
        recommended: 'You want to keep water clean and warm between swims with an optional fitted cover',
        check: 'Water source for filling and a garden hose for the ~10-minute inflation plus fill time',
      },
      {
        recommended: 'You need a pool you can drain, fold, and store at season end',
        check: 'Local rules for your intended use (e.g. rental properties, water restrictions)',
      },
    ],
    fitNotice: SWIM_POOL_FIT_NOTICE,
    packageIncluded: ['1000W electric air pump', 'Repair kit', 'Storage bag'],
    packageRequired: [
      'A flat, firm, level setup area (lawn, patio, or deck rated for the filled weight)',
      'A garden hose or water source for filling',
    ],
    setupSteps: SWIM_POOL_SETUP_STEPS,
    setupLinks: SETUP_LINKS_BASE,
    supportCards: SUPPORT_CARDS_BASE,
  },

  'hot-tub-square-rect': {
    assurance: [
      {
        titleKey: 'product.assuranceIncluded',
        text: 'Tub shell with built-in inflatable seats and a 5 mm insulated thermal bottom. Heating and filtration units are sold separately.',
      },
      {
        titleKey: 'product.assuranceDelivery',
        text: 'Single-piece online orders ship from our warehouse. Dispatch is confirmed by email after checkout.',
      },
      {
        titleKey: 'product.assuranceWarranty',
        text: '2-year manufacturer warranty covering material and workmanship defects. Full terms on request.',
      },
      {
        titleKey: 'product.assuranceSupport',
        text: 'Setup guidance, care instructions, and direct support via info@felizbay.com.',
      },
    ],
    fitIntro:
      'This soaking pool is built for year-round use on a flat, level, load-rated surface, paired with an external heating unit (sold separately). Before ordering, review the footprint, the filled weight, and the equipment requirements below.',
    fitRows: [
      {
        recommended: 'You want a year-round soaking and hydrotherapy spot in a compact footprint',
        check: 'Your surface is flat, level, and rated for hundreds of kilograms of filled water weight',
      },
      {
        recommended: 'You have (or will buy) a compatible external heating unit — the heater is not included',
        check: 'A qualified professional to install the heating and electrical equipment',
      },
      {
        recommended: 'You want built-in seats and a 5 mm insulated bottom that retains heat',
        check: 'A water source, drainage, and power supply near the setup point',
      },
      {
        recommended: 'You need a tub that ships flat and can be relocated seasonally',
        check: 'Local rules for heated water, drainage, and rental use',
      },
    ],
    fitNotice: HOT_TUB_FIT_NOTICE,
    packageIncluded: ['Built-in integrated inflatable seats', '5 mm insulated thermal bottom base'],
    packageRequired: [
      'An external heating unit for hot soaking (sold separately)',
      'A flat, level surface rated for the filled weight',
      'Professional installation of heating and electrical equipment',
    ],
    setupSteps: HOT_TUB_SETUP_STEPS,
    setupLinks: SETUP_LINKS_BASE,
    supportCards: SUPPORT_CARDS_BASE,
  },

  'hot-tub-round': {
    assurance: [
      {
        titleKey: 'product.assuranceIncluded',
        text: 'Tub shell with built-in inflatable seats and a 5 mm insulated thermal bottom. Heating and filtration units are sold separately.',
      },
      {
        titleKey: 'product.assuranceDelivery',
        text: 'Single-piece online orders ship from our warehouse. Dispatch is confirmed by email after checkout.',
      },
      {
        titleKey: 'product.assuranceWarranty',
        text: '2-year manufacturer warranty covering material and workmanship defects. Full terms on request.',
      },
      {
        titleKey: 'product.assuranceSupport',
        text: 'Setup guidance, care instructions, and direct support via info@felizbay.com.',
      },
    ],
    fitIntro:
      'This compact soaking pool is built for year-round use on a flat, level, load-rated surface, paired with an external heating unit (sold separately). Before ordering, review the footprint, the filled weight, and the equipment requirements below.',
    fitRows: [
      {
        recommended: 'You want a compact year-round spa for a courtyard, glamping pod, or spa corner',
        check: 'Your surface is flat, level, and rated for hundreds of kilograms of filled water weight',
      },
      {
        recommended: 'You have (or will buy) a compatible external heating unit — the heater is not included',
        check: 'A qualified professional to install the heating and electrical equipment',
      },
      {
        recommended: 'You want built-in seats and a 5 mm insulated bottom that retains heat',
        check: 'A water source, drainage, and power supply near the setup point',
      },
      {
        recommended: 'You need a tub that ships flat and can be relocated seasonally',
        check: 'Local rules for heated water, drainage, and rental use',
      },
    ],
    fitNotice: HOT_TUB_FIT_NOTICE,
    packageIncluded: ['Built-in integrated inflatable seats', '5 mm insulated thermal bottom base'],
    packageRequired: [
      'An external heating unit for hot soaking (sold separately)',
      'A flat, level surface rated for the filled weight',
      'Professional installation of heating and electrical equipment',
    ],
    setupSteps: HOT_TUB_SETUP_STEPS,
    setupLinks: SETUP_LINKS_BASE,
    supportCards: SUPPORT_CARDS_BASE,
  },
};
