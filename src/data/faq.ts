export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  category:
    | 'product'
    | 'shipping'
    | 'safety'
    | 'maintenance'
    | 'general'
    | 'ordering'
    | 'warranty'
    | 'sourcing';
  relatedProducts: string[];
  relatedGuides: string[];
}

export const faqs: FaqRecord[] = [
  {
    id: 'pool-setup-time',
    question: 'How long does it take to set up an inflatable pool?',
    answer:
      'Inflating takes 5–15 minutes with the included electric pump depending on the model; full setup — positioning, inflating to the rated pressure, and connecting the filter pump — typically takes 15–30 minutes. Filling with water takes additional time depending on pool size and your water source. Rectangular pools take slightly longer than round models due to their larger footprint.',
    category: 'product',
    relatedProducts: [],
    relatedGuides: ['inflatable-pool-setup'],
  },
  {
    id: 'drop-stitch-walls',
    question: 'What is a drop stitch pool?',
    answer:
      'Drop stitch construction connects the top and bottom layers of fabric with thousands of internal threads. When inflated, these threads lock the walls rigid like a hard-sided pool, so the pool keeps its shape at full water pressure while still folding away for storage.',
    category: 'product',
    relatedProducts: [],
    relatedGuides: ['what-is-a-drop-stitch-inflatable-pool'],
  },
  {
    id: 'pool-water-capacity',
    question: 'How much water does an inflatable pool hold?',
    answer:
      'It depends on the model, size, and fill level. Each product page has a size checker that shows the estimated fill volume for every factory size — check the exact figure for your pool there before filling. Always place the pool on ground that can support the combined weight of pool plus water before filling.',
    category: 'product',
    relatedProducts: [],
    relatedGuides: ['how-much-space-do-you-need-for-an-inflatable-pool'],
  },
  {
    id: 'pool-ground-prep',
    question: 'What surface should I place the pool on?',
    answer:
      'Set the pool on firm, level ground free of stones, sticks, and sharp objects. A concrete pad, patio, or level lawn works well. We recommend a ground sheet underneath for extra protection. Never place the pool on sloped or soft ground.',
    category: 'safety',
    relatedProducts: [],
    relatedGuides: ['placing-an-inflatable-pool-on-a-patio', 'how-much-space-do-you-need-for-an-inflatable-pool'],
  },
  {
    id: 'pool-filtration',
    question: 'Do I need a filter pump?',
    answer:
      'A cartridge filter pump keeps water clean and greatly extends the time between water changes. Felizbay pools have standard hose fittings that accept common 32mm or 38mm filter pumps, available separately or bundled with your order.',
    category: 'maintenance',
    relatedProducts: [],
    relatedGuides: ['inflatable-pool-maintenance'],
  },
  {
    id: 'pool-water-treatment',
    question: 'How do I keep the water clean?',
    answer:
      'Use standard pool chemicals: chlorine or bromine tablets in a floating dispenser, plus regular pH checks (target 7.2–7.6). Run the filter pump daily, skim debris, and cover the pool when not in use. How long water lasts before changing depends on pool size, bather load, temperature, and filtration capacity — always follow the chemical product label and test the water regularly rather than relying on a fixed schedule.',
    category: 'maintenance',
    relatedProducts: [],
    relatedGuides: ['inflatable-pool-maintenance'],
  },
  {
    id: 'pool-repair',
    question: 'How do I repair a puncture?',
    answer:
      'Find the leak with soapy water, clean and dry the area, then apply a PVC patch with rounded corners from the included repair kit. Press firmly and wait 24 hours before reinflating. Small punctures are rare and typically take minutes to fix.',
    category: 'maintenance',
    relatedProducts: [],
    relatedGuides: ['inflatable-pool-maintenance'],
  },
  {
    id: 'pool-storage',
    question: 'How do I store the pool for winter?',
    answer:
      'Drain the pool, clean it with mild soap, rinse thoroughly, and dry completely in the shade. Deflate, fold loosely, and store in the carry bag in a cool, dry place away from direct sunlight and freezing temperatures.',
    category: 'maintenance',
    relatedProducts: [],
    relatedGuides: ['inflatable-pool-maintenance'],
  },
  {
    id: 'pool-kids-safety',
    question: 'Are inflatable pools safe for children?',
    answer:
      'Yes — with active adult supervision at all times. Children must never be left unattended in or near any pool, even shallow ones. Empty small pools after use, secure larger pools with a cover or ladder removal, and check local fencing regulations for pools above certain depths.',
    category: 'safety',
    relatedProducts: [],
    relatedGuides: [],
  },
  {
    id: 'pool-size-choice',
    question: 'What pool size should I choose?',
    answer:
      'Round pools suit families and casual swimming in smaller yards. Rectangular pools fit lap swimming and larger groups. Allow at least 50 cm — ideally 1 m — of clear space around the pool, and check your available ground area against the pool dimensions before ordering.',
    category: 'product',
    relatedProducts: ['round-blue-drop-stitch-pool', 'rectangular-drop-stitch-pool'],
    relatedGuides: ['how-to-choose-inflatable-pool', 'how-much-space-do-you-need-for-an-inflatable-pool'],
  },
  {
    id: 'pool-with-cover',
    question: 'Do pools come with a cover?',
    answer:
      'Rectangular pools ship with a full-coverage dustproof and waterproof cover included. Round pools ship with the pump and repair kit, and a fitted cover is available as an optional accessory. A cover keeps out leaves and insects, reduces evaporation, and helps maintain water temperature.',
    category: 'product',
    relatedProducts: ['rectangular-drop-stitch-pool'],
    relatedGuides: [],
  },
  {
    id: 'pool-lifespan',
    question: 'How long does an inflatable pool last?',
    answer:
      'With proper care, a Felizbay drop stitch pool can provide seasons of reliable use — the exact lifespan depends on climate, UV exposure, water chemistry, and storage conditions. The UV-resistant, puncture-resistant PVC is built for repeated setup, takedown, and storage. Key factors are clean water chemistry, careful ground prep, and dry storage.',
    category: 'product',
    relatedProducts: [],
    relatedGuides: ['inflatable-pool-maintenance'],
  },
  {
    id: 'pool-shipping',
    question: 'How long does shipping take?',
    answer:
      'In-stock orders ship within 2–3 business days. Delivery time depends on destination and order size — contact us at info@felizbay.com with your location and quantity for an accurate delivery estimate.',
    category: 'shipping',
    relatedProducts: [],
    relatedGuides: [],
  },
  {
    id: 'pool-pricing',
    question: 'How much do Felizbay pools cost?',
    answer:
      'Each product page lists the recommended retail price. To order, send us a message through the contact page or email info@felizbay.com and we will confirm availability, shipping, and final pricing for your location. Wholesale pricing is available for bulk orders.',
    category: 'ordering',
    relatedProducts: ['rectangular-drop-stitch-pool', 'round-blue-drop-stitch-pool', 'round-grey-drop-stitch-pool'],
    relatedGuides: [],
  },
  {
    id: 'pool-oem',
    question: 'Do you offer OEM/ODM services?',
    answer:
      'Yes. We offer custom sizes, colors, logos, covers, and packaging for businesses. Our manufacturing partner in Qingdao handles everything from minor branding changes to fully custom pool designs. Minimum order quantities apply — contact us for details.',
    category: 'ordering',
    relatedProducts: [],
    relatedGuides: ['oem-vs-odm-inflatable-pools', 'private-label-inflatable-pool-buyers-guide'],
  },
  {
    id: 'pool-warranty',
    question: 'What is the Felizbay warranty?',
    answer:
      'Felizbay pools carry a 2-year limited manufacturer warranty covering defects in materials and workmanship under normal use. The warranty covers drop stitch fabric, seams, and valves; it excludes improper use, unauthorized modifications, and normal wear. Contact info@felizbay.com with your order details to start a claim.',
    category: 'warranty',
    relatedProducts: [],
    relatedGuides: [],
  },
  {
    id: 'pool-vs-steel',
    question: 'Inflatable pool or steel-frame pool?',
    answer:
      'Inflatable drop stitch pools are faster to set up, easier to store, softer against the body, and need no tools or metal frames. Steel-frame pools can look more permanent but rust, require more assembly, and are harder to store. For most backyards, inflatable is the practical choice.',
    category: 'general',
    relatedProducts: [],
    relatedGuides: ['drop-stitch-vs-traditional-inflatable-pools'],
  },
  {
    id: 'company-model',
    question: 'Is Felizbay a trading company or a manufacturer?',
    answer:
      'Felizbay is a water-sports brand founded in 2012 and operated by Aquafarer LLC. We design every pool in-house and manufacture with our long-term manufacturing partner in Qingdao, China, shipping factory-direct worldwide.',
    category: 'ordering',
    relatedProducts: [],
    relatedGuides: ['how-to-choose-a-drop-stitch-pool-manufacturer'],
  },
  {
    id: 'sourcing-moq',
    question: 'What is your MOQ for wholesale and OEM orders?',
    answer:
      'Samples start from a single piece, and our standard price list is based on 20 pcs per item — so a first order can be as small as 20 units per SKU. Mixed orders across multiple SKUs at 20 pcs each all qualify for list pricing.',
    category: 'sourcing',
    relatedProducts: [],
    relatedGuides: ['how-much-does-a-wholesale-drop-stitch-pool-cost'],
  },
  {
    id: 'sourcing-sample-policy',
    question: 'Can I order a sample before committing to production?',
    answer:
      'Yes. A pre-production sample is manufactured and pressure-tested for your approval before any volume order is released. The sample stage verifies print quality, color accuracy, dimensions and packaging fit against your specification.',
    category: 'sourcing',
    relatedProducts: [],
    relatedGuides: ['how-to-choose-a-drop-stitch-pool-manufacturer'],
  },
  {
    id: 'sourcing-incoterms',
    question: 'What Incoterms do you quote?',
    answer:
      'Standard quotations are FOB Qingdao in USD — the price covers the goods, export packing and delivery onto your forwarder\u2019s vessel at Qingdao port. Ocean freight, insurance, duty and destination charges are arranged by the buyer.',
    category: 'sourcing',
    relatedProducts: [],
    relatedGuides: ['how-much-does-a-wholesale-drop-stitch-pool-cost', 'inflatable-pool-container-loading-guide'],
  },
  {
    id: 'sourcing-factory-location',
    question: 'Where is the Felizbay factory located?',
    answer:
      'Felizbay pools are manufactured in Qingdao, China — one of the world\u2019s largest hubs for inflatable and water-sports manufacturing. Buyers are welcome to audit the facility in person or join a live video walkthrough of the production and pressure-test areas.',
    category: 'sourcing',
    relatedProducts: [],
    relatedGuides: ['how-to-choose-a-drop-stitch-pool-manufacturer'],
  },
  {
    id: 'sourcing-custom-packaging',
    question: 'Can you produce custom retail packaging?',
    answer:
      'Yes. Printed cartons, color boxes and mailer packaging are produced to your specification — sized for garden-retail shelves or e-commerce parcel networks, plus manuals and hang tags under your brand. Packed weight and carton dimensions are tuned to your logistics.',
    category: 'sourcing',
    relatedProducts: [],
    relatedGuides: ['private-label-inflatable-pool-buyers-guide'],
  },
  {
    id: 'sourcing-material-compliance',
    question: 'What material compliance documents do you provide?',
    answer:
      'Our pools are built from REACH-compliant, UV-resistant, double-layer drop-stitch PVC. Compliance declarations and material specification sheets are available to wholesale and OEM buyers on request.',
    category: 'sourcing',
    relatedProducts: [],
    relatedGuides: ['how-to-choose-a-drop-stitch-pool-manufacturer'],
  },
  {
    id: 'sourcing-third-party-inspection',
    question: 'Can we appoint a third-party inspector?',
    answer:
      'Yes. Third-party inspection (SGS, Bureau Veritas, TÜV, QIMA and similar) is welcome on any order — during production, at the 24–48 hour pressure-drop test stage, or before container loading.',
    category: 'sourcing',
    relatedProducts: [],
    relatedGuides: ['inflatable-pool-pressure-testing-explained', 'how-to-choose-a-drop-stitch-pool-manufacturer'],
  },
];
