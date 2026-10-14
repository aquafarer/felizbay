export interface GuideRecord {
  slug: string;
  category: string;
  title: string;
  description: string;
  tldr: string;
  problem: string;
  solution: string;
  audience: string;
  steps: string[];
  faq: { q: string; a: string }[];
  relatedProducts: string[];
  relatedGuides: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  waterType: string[];
}

export const guides: GuideRecord[] = [
  {
    slug: 'how-to-choose-inflatable-pool',
    category: 'buying-guide',
    title: 'How to Choose an Inflatable Swimming Pool',
    description:
      'A complete guide to selecting the right drop stitch inflatable pool based on your yard size, family needs, and budget.',
    tldr: 'Choose your pool based on yard space, number of users, and intended use. Round pools suit families and relaxation; rectangular pools fit lap swimming. Drop stitch construction gives rigid walls that fold away for winter storage.',
    problem:
      'Many buyers pick a pool based on price alone, then discover it is too small, too hard to maintain, or made from flimsy material that sags under water pressure.',
    solution:
      'Match pool size and shape to your available space and use case, and insist on drop stitch construction with UV-resistant PVC. A quality inflatable pool sets up in under 30 minutes and lasts many seasons.',
    audience: 'Families, homeowners, and first-time pool buyers.',
    steps: [
      'Measure your available ground area — allow 1 meter of clearance around the pool',
      'Choose a shape: round for family fun, rectangular for swimming laps',
      'Check the wall height: taller walls hold more water and suit adults',
      'Verify drop stitch construction for rigid, self-supporting walls',
      'Confirm what is included: pump, repair kit, cover, ground sheet',
      'Plan water care: filter pump, chemicals, and a test kit',
    ],
    faq: [
      {
        q: 'How big should a family pool be?',
        a: 'For a family of four, a round pool of 3–4 meters in diameter or a rectangular pool of 4 x 2 meters is comfortable. Larger groups should size up accordingly.',
      },
      {
        q: 'Are inflatable pools durable?',
        a: 'Yes. Drop stitch pools with multi-layer PVC hold their shape under full water pressure and resist punctures and UV damage. With basic care they last 5+ seasons.',
      },
    ],
    relatedProducts: [],
    relatedGuides: ['inflatable-pool-maintenance'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'inflatable-pool-setup',
    category: 'tutorial',
    title: 'Inflatable Pool Setup in 8 Steps',
    description: 'Everything you need to know to set up your Felizbay inflatable pool correctly the first time.',
    tldr: 'Pick level ground, clear it of debris, lay a ground sheet, inflate the walls to rated pressure, and fill. Total setup time is 15–30 minutes plus filling time.',
    problem:
      'Rushed setup on poor ground causes sagging walls, uneven water line, leaks from sharp objects, and a pool that never sits right.',
    solution:
      'Follow the full checklist: level ground, debris-free surface, ground sheet, even inflation, and a water fill that stops at the recommended line.',
    audience: 'New Felizbay pool owners.',
    steps: [
      'Choose a firm, level spot away from overhanging trees',
      'Remove all stones, sticks, and sharp objects from the area',
      'Lay the included or separate ground sheet',
      'Unroll the pool and position it — you cannot move it once filled',
      'Inflate the walls with the supplied pump to the rated PSI',
      'Check all valves are closed and secure',
      'Fill with water to the recommended fill line (usually 80–90%)',
      'Connect the filter pump if included and run it for an initial cycle',
    ],
    faq: [
      {
        q: 'Can I set up a pool on grass?',
        a: 'Yes, level grass works well. Mow it short, remove clippings and debris, and use a ground sheet underneath to protect the pool base.',
      },
      {
        q: 'How full should I fill the pool?',
        a: 'Fill to 80–90% of wall height. Overfilling stresses the walls; underfilling reduces stability and usable depth.',
      },
    ],
    relatedProducts: [],
    relatedGuides: ['inflatable-pool-maintenance'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'inflatable-pool-maintenance',
    category: 'maintenance',
    title: 'Inflatable Pool Water Care and Maintenance',
    description: 'How to keep your pool water clean, clear, and safe all season with minimal effort.',
    tldr: 'Run the filter daily, keep chlorine and pH in range, skim debris, and cover the pool when idle. Drain, dry, and fold for winter storage.',
    problem:
      'Without a care routine, pool water turns green within days, requiring full water changes, extra chemicals, and scrubbing.',
    solution:
      'A simple daily and weekly routine — filter, test, treat, skim, cover — keeps water healthy for weeks and extends the life of your pool.',
    audience: 'All inflatable pool owners.',
    steps: [
      'Run the filter pump 4–8 hours daily during the season',
      'Test pH and chlorine 2–3 times per week',
      'Keep pH between 7.2 and 7.6 and chlorine at 1–3 ppm',
      'Use a floating chemical dispenser for steady dosing',
      'Skim leaves and insects daily; vacuum sediment weekly',
      'Cover the pool when not in use to block debris and UV loss',
      'At season end: drain, clean, dry fully, deflate, fold, and store indoors',
    ],
    faq: [
      {
        q: 'How often should I change the water?',
        a: 'With proper filtration and chemical care, water can last 3–6 weeks. Change sooner if it turns cloudy or green despite treatment.',
      },
      {
        q: 'Can I use saltwater systems?',
        a: 'Small inflatable pools typically use chlorine tablets. Salt systems are possible with compatible equipment, but confirm compatibility before adding salt.',
      },
    ],
    relatedProducts: [],
    relatedGuides: ['inflatable-pool-setup'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
];
