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
      'Measure your available ground area — allow at least 50 cm (ideally 1 m) of clearance around the pool',
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
        a: 'Yes. Drop stitch pools with multi-layer PVC hold their shape under full water pressure and resist punctures and UV damage. With basic care they provide seasons of reliable use — how many depends on climate, usage, and storage conditions.',
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
  {
    slug: 'what-is-a-drop-stitch-inflatable-pool',
    category: 'buying-guide',
    title: 'What Is a Drop Stitch Inflatable Pool?',
    description:
      'A plain-English explanation of drop stitch construction — how thousands of internal threads make an inflatable pool wall rigid enough to swim against.',
    tldr: 'Drop stitch fabric joins two outer PVC layers with thousands of internal threads. Inflated to 4–5 PSI, those threads lock the walls flat and rigid — closer to a hard-sided pool than a toy ring pool — yet the pool still deflates and folds for storage.',
    problem:
      'Most people have only seen ring-style or soft-sided inflatable pools that sag, bulge, and collapse. That experience makes it hard to believe an inflatable pool can hold a firm, straight wall 1.5 meters high.',
    solution:
      'Drop stitch construction limits how far the walls can expand: thousands of internal threads turn pressure into stiffness, so the fabric becomes a rigid panel instead of a balloon. Felizbay pools operate at 4–5 PSI with a pressure-relief valve that releases above 6 PSI, and every unit passes a 24–48 hour pressure-drop test before it ships.',
    audience: 'First-time buyers comparing pool types.',
    steps: [
      'Outer layers: two sheets of reinforced, UV-stabilized PVC form the wall surfaces',
      'Internal threads: thousands of fine polyester threads connect the layers at fixed intervals',
      'Air chamber: inflating the chamber to 4–5 PSI pulls the layers taut against the threads, locking the wall flat',
      'Rigid result: the wall becomes stiff and flat like a hard-sided pool',
      'Safety margin: rated maximum pressure is 8 PSI, with a relief valve that auto-releases above 6 PSI',
      'Storage: open the valves, let the fabric relax, and the whole pool folds into a storage bag',
    ],
    faq: [
      {
        q: 'Is a drop stitch pool really rigid?',
        a: 'Yes. At the rated 4–5 PSI operating pressure the walls form a flat, firm surface that resists collapsing or inward buckling.',
      },
      {
        q: 'Does drop stitch make the pool heavier?',
        a: 'It adds some weight versus ring pools, but packed weights start around 18 kg for the smallest round model and the pool still folds into a storage bag one person can move.',
      },
      {
        q: 'What happens if I over-inflate?',
        a: 'The pressure-relief valve automatically releases air above 6 PSI, well below the 8 PSI maximum tolerance, to protect the seams.',
      },
    ],
    relatedProducts: [
      'rectangular-drop-stitch-pool',
      'round-blue-drop-stitch-pool',
      'round-grey-drop-stitch-pool',
      'hot-tub-square-rect',
      'hot-tub-round',
    ],
    relatedGuides: ['drop-stitch-vs-traditional-inflatable-pools', 'inflatable-pool-setup'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'drop-stitch-vs-traditional-inflatable-pools',
    category: 'buying-guide',
    title: 'Drop Stitch Pools vs. Traditional Inflatable Pools',
    description:
      'The practical differences between drop stitch pools and ring-style or soft-sided inflatable pools — walls, depth, durability, setup, and storage.',
    tldr: 'Traditional inflatable pools have balloon-like walls that bulge under water pressure and limit depth. Drop stitch pools hold flat, rigid walls at real swimming depths, support proper pressure relief, and still deflate for winter storage. Neither type needs tools or construction.',
    problem:
      'Ring pools and soft-sided pools are cheap up front but often end in sagging walls, leaking seams, and one disappointing season. Buyers then assume every inflatable pool behaves the same way.',
    solution:
      'Compare the construction, not the category. Drop stitch walls inflate to 4–5 PSI and behave like hard panels; traditional inflatables operate at low pressure and depend on water pressure to hold their shape. That difference drives depth, wall stability, durability, and how the pool feels in daily use.',
    audience: 'Buyers deciding between pool types and price points.',
    steps: [
      'Wall construction: drop stitch = two PVC layers joined by internal threads; traditional = air-filled vinyl rings or unsupported soft walls',
      'Operating pressure: drop stitch runs at 4–5 PSI with a relief valve; ring pools run at low pressure with no meaningful pressure rating',
      'Wall behavior: drop stitch walls stay flat and rigid; ring walls bulge outward as water pushes on them',
      'Achievable depth: drop stitch supports 1.2–1.5 m walls for real swimming; ring pools rarely exceed 0.7–0.8 m reliably',
      'Rim usability: drop stitch rims are firm enough to sit on; ring rims deform under weight',
      'Durability: reinforced multi-layer PVC resists punctures and UV; thin single-layer vinyl is easier to puncture',
      'Storage: both types deflate — drop stitch packs into a storage bag after a full-season run',
    ],
    faq: [
      {
        q: 'Are drop stitch pools more expensive?',
        a: 'Yes, generally. The internal thread structure and reinforced materials cost more than thin vinyl. In return you get usable depth, rigid walls, and multi-season durability.',
      },
      {
        q: 'Is setup harder than a ring pool?',
        a: 'No. Setup is comparable — level ground, unroll, inflate with the included electric pump, fill. Expect 15–30 minutes plus fill time.',
      },
      {
        q: 'Which type is safer for kids?',
        a: 'Both require the same rule: active adult supervision at all times. Rigid drop stitch walls make entry and exit more predictable, but no inflatable pool is a substitute for supervision.',
      },
    ],
    relatedProducts: [
      'rectangular-drop-stitch-pool',
      'round-blue-drop-stitch-pool',
      'round-grey-drop-stitch-pool',
      'hot-tub-square-rect',
      'hot-tub-round',
    ],
    relatedGuides: ['what-is-a-drop-stitch-inflatable-pool', 'how-to-choose-inflatable-pool'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'how-much-space-do-you-need-for-an-inflatable-pool',
    category: 'buying-guide',
    title: 'How Much Space Do You Need for an Inflatable Pool?',
    description:
      'Footprints, clearances, and load factors for Felizbay pool sizes — how to measure your space before choosing a pool.',
    tldr: 'Plan for the pool footprint plus at least 50 cm of clear, non-slip walkway on all sides, and confirm the surface can carry the water: roughly 1 tonne per cubic meter. Felizbay round pools span 2–10 m diameter and rectangular pools start at 2 × 2 m.',
    problem:
      'Buyers often measure only the pool diameter, then discover there is no room to walk around it, no safe entry point, and no drainage route — or worse, the surface cannot carry the filled weight.',
    solution:
      'Measure the usable area, subtract clearance, check the load, and pick the largest pool that fits with margin. A pool that fits properly is safer, easier to maintain, and more pleasant to use than the biggest pool you can squeeze in.',
    audience: 'Anyone planning a first pool in a yard, patio, or garden.',
    steps: [
      'Measure the usable area in both directions — a tape outline on the ground beats estimating',
      'Subtract 50 cm clearance per side for walkways, a ladder, and safe entry/exit',
      'Estimate the water load: length × width × intended water depth gives cubic meters; water weighs about 1 tonne per cubic meter',
      'Example: a 4 m round pool filled to 1.0 m holds roughly 12 m³ of water — around 12 tonnes',
      'Confirm the surface is level; a slope causes uneven water line and wall stress',
      'Plan the fill source and, critically, a drainage route for the drain valve',
      'Match the size to your space: Ø 2–3 m fits small patios; Ø 4–5 m suits typical gardens; 6 m and up needs open lawn',
    ],
    faq: [
      {
        q: 'How close can a pool be to a fence or wall?',
        a: 'Keep at least 50 cm so you can walk around, clean, and inspect the walls. Local barrier rules may also require pool-to-fence distances — check before you buy.',
      },
      {
        q: 'Can I put a pool on a balcony or roof terrace?',
        a: 'Only after a structural load check by a qualified engineer. A filled pool concentrates several tonnes in a small area — most balconies are not designed for that.',
      },
      {
        q: 'Does a bigger pool need more chemicals and filtration?',
        a: 'Yes. Water volume drives chemical demand, filter run time, and fill/drain time. Sizing the pool to your real usage keeps maintenance manageable.',
      },
    ],
    relatedProducts: [
      'rectangular-drop-stitch-pool',
      'round-blue-drop-stitch-pool',
      'round-grey-drop-stitch-pool',
      'hot-tub-square-rect',
      'hot-tub-round',
    ],
    relatedGuides: ['how-to-choose-inflatable-pool', 'placing-an-inflatable-pool-on-a-patio'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'placing-an-inflatable-pool-on-a-patio',
    category: 'buying-guide',
    title: 'What to Know Before Placing a Pool on a Patio or Deck',
    description:
      'Load capacity, surface prep, drainage, and protection for above-ground pools on patios, decks, and terraces.',
    tldr: 'A patio can host an inflatable pool only if the structure carries the filled weight — about 1 tonne per cubic meter of water — and drains safely. Get a structural assessment for anything beyond a small, shallow pool, protect the surface, and plan where the water goes.',
    problem:
      'Patios and decks look flat and solid, so they feel like obvious pool sites. But filled pools concentrate tonnes of water in a small footprint, and decks, pavers, and membranes are rarely designed for that concentrated load.',
    solution:
      'Treat load as the first question, not an afterthought. Confirm capacity with a qualified structural engineer for anything beyond the smallest pools, verify drainage, protect the surface finish, and keep water away from the structure.',
    audience: 'Homeowners with patios, decks, or roof terraces.',
    steps: [
      'Calculate the filled weight: length × width × water depth in meters ≈ weight in tonnes',
      'Ask a qualified engineer to verify the structure for that concentrated load — do not rely on "it feels solid"',
      'Prefer ground-floor concrete patios over elevated decks; avoid balconies unless cleared by an engineer',
      'Check that the surface is level and that pavers or boards will not shift or sink unevenly',
      'Use a ground sheet or protective mat to shield both the pool base and the patio finish',
      'Plan drainage: the drain valve releases hundreds of liters — direct it away from foundations, neighbors, and slip hazards',
      'Keep the pool away from overhead power lines and ensure the pump connection stays dry and protected',
    ],
    faq: [
      {
        q: 'Can a wooden deck support an inflatable pool?',
        a: 'Only if an engineer verifies it. Even a small 2 m pool filled to 0.5 m holds about 1.5 tonnes. Most residential decks are rated for people and furniture, not point loads of that size.',
      },
      {
        q: 'Will a pool damage my patio surface?',
        a: 'Constant moisture, chemical splash, and abrasion can wear some finishes. A ground sheet or protective mat between pool and surface reduces risk; check your patio material and warranty.',
      },
      {
        q: 'What is the safest patio pool setup?',
        a: 'Ground-level concrete, level and crack-free, with a ground sheet, non-slip access, a covered pump connection, and a drainage route planned before filling.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'round-grey-drop-stitch-pool', 'hot-tub-square-rect'],
    relatedGuides: ['how-much-space-do-you-need-for-an-inflatable-pool', 'inflatable-pool-setup'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'inflatable-pools-for-vacation-rentals',
    category: 'buying-guide',
    title: 'Are Inflatable Pools Suitable for Vacation Rentals?',
    description:
      'What rental hosts should check before adding a drop stitch pool or SPA tub — guests, regulations, insurance, maintenance, and safety.',
    tldr: 'Yes, for many properties — with conditions. A drop stitch pool inflates in minutes with the included pump and stores off-season, but as a host you must handle guest supervision rules, local pool regulations, insurance disclosure, and daily water care. A family pool used by unsupervised rental guests is a liability, not an amenity.',
    problem:
      'A pool boosts bookings, so hosts buy one, list it, and only then meet the hard questions: barrier rules for rental properties, insurance wording, water quality between turnovers, and what happens when guests ignore supervision rules.',
    solution:
      'Decide with the checklist first. Confirm local regulations for pools at short-term rentals, disclose the pool to your insurer, size it to the property, budget maintenance time between stays, and write supervision rules into your listing and house manual. Felizbay pools suit this use because they set up fast, drain for the off-season, and need no construction.',
    audience: 'Vacation rental hosts and property managers.',
    steps: [
      'Check local regulations — barrier and safety rules for rental properties often apply to any pool, inflatable included',
      'Disclose the pool to your insurer and confirm your liability coverage wording',
      'Choose the size for the property: Ø 4–5 m round or 4 × 3 m rectangular works for most 4–8 guest homes',
      'Budget real maintenance: filtration run time, water testing between stays, and a cleaning window at each turnover',
      'Write explicit guest rules into the listing and house manual: adult supervision required, no unattended children, pool hours',
      'Plan the season: pools can be drained, dried, and stored in the off-season — plan where and how',
      'Inspect between stays: valve seals, wall pressure, ladder stability, and water quality',
    ],
    faq: [
      {
        q: 'Do inflatable pools need fencing at rentals?',
        a: 'In many jurisdictions, yes — pool barrier requirements typically apply regardless of pool type. Check your local code before installing; this is the host\u2019s responsibility.',
      },
      {
        q: 'How much maintenance does a rental pool need?',
        a: 'Daily filter runs, water testing between guest stays, and a cleaning window at each turnover. Salt or heavy-chemistry solutions need equipment confirmation first.',
      },
      {
        q: 'Is a family pool enough for paying guests?',
        a: 'For seasonal, low-frequency use it can work. For high-turnover properties, evaluate commercial-grade options and heavier-duty specifications before committing — see our business solutions page.',
      },
    ],
    relatedProducts: ['rectangular-drop-stitch-pool', 'round-blue-drop-stitch-pool', 'round-grey-drop-stitch-pool'],
    relatedGuides: ['inflatable-pool-maintenance', 'how-to-choose-inflatable-pool'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'how-strong-is-a-drop-stitch-inflatable-pool',
    category: 'technology',
    title: 'How Strong Is a Drop Stitch Inflatable Pool?',
    description:
      'Wall strength, pressure ratings, and real-world durability of drop stitch inflatable pools — what the numbers mean and what the walls can take.',
    tldr: 'Drop stitch pools are far stronger than ring pools: walls inflated to 4–5 PSI act as rigid panels, carry an 8 PSI structural rating, and pass a 24–48 hour factory pressure test. Strength comes from thousands of internal threads, not thicker vinyl alone.',
    problem:
      '"Inflatable" sounds fragile, so buyers picture a toy that punctures on the first sharp stone and collapses when an adult leans on the wall. That describes thin ring pools — not drop stitch construction.',
    solution:
      'Judge strength by construction and pressure ratings. Thousands of internal polyester threads lock the two PVC wall layers together, so at 4–5 PSI the wall behaves like a stiff panel: it holds a 1.2–1.5 m water column, stays flat under load, and survives full-season outdoor use. Every Felizbay unit ships only after passing a 24–48 hour pressure-drop test.',
    audience: 'Buyers weighing durability against the low price of thin-vinyl pools.',
    steps: [
      'Pressure strength: rated operating pressure is 4–5 PSI; seams and structure carry an 8 PSI maximum rating — three times higher than what a ring pool wall can hold',
      'Pressure protection: a relief valve auto-releases air above 6 PSI, so normal over-inflation cannot stress the seams',
      'Wall stiffness: internal threads stop the wall from ballooning, which is why the wall stays flat and rigid under a full water load',
      'Factory verification: every pool passes a 24–48 hour pressure-drop test before packing — a wall that loses pressure never ships',
      'Material layers: reinforced, UV-stabilized multi-layer PVC resists punctures, sunlight, and abrasion far better than single-layer vinyl',
      'Real-world limits: the walls tolerate leaning, sitting on the rim of larger models, and daily family use — but sharp objects, pet claws, and deliberate cutting will puncture any inflatable',
      'Field repair: every pool includes a repair kit, and small punctures patch in minutes without deflating the whole pool',
    ],
    faq: [
      {
        q: 'Can adults lean or sit on the wall?',
        a: 'The rigid drop stitch wall tolerates leaning and sitting far better than a soft ring, but treat the rim as a seat only on larger models and never as a diving or jumping platform.',
      },
      {
        q: 'How long do drop stitch pools last?',
        a: 'With proper care, ground preparation, and dry off-season storage, multi-season use is normal. Lifespan depends most on UV exposure, ground conditions, and how the pool is stored in winter.',
      },
      {
        q: 'What actually punctures a drop stitch pool?',
        a: 'Sharp stones under the base, pet claws, garden tools, and rough concrete edges. A ground sheet and a swept installation site prevent nearly all field punctures.',
      },
    ],
    relatedProducts: [
      'rectangular-drop-stitch-pool',
      'round-blue-drop-stitch-pool',
      'round-grey-drop-stitch-pool',
    ],
    relatedGuides: [
      'what-is-a-drop-stitch-inflatable-pool',
      'what-psi-should-an-inflatable-pool-use',
      'how-to-prevent-pool-leaks',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'what-psi-should-an-inflatable-pool-use',
    category: 'technology',
    title: 'What PSI Should an Inflatable Pool Use?',
    description:
      'Correct inflation pressure for drop stitch pools — why 4–5 PSI is the target, how to measure it, and what the relief valve does.',
    tldr: 'Inflate drop stitch walls to 4–5 PSI. Below that the walls flex; the relief valve auto-releases above 6 PSI and the structure is rated to 8 PSI. Use a pump with a pressure gauge — firmness by hand tells you almost nothing at these pressures.',
    problem:
      'Inflated by feel, pools end up in one of two states: under-inflated walls that sag and buckle inward under the water load, or wildly over-inflated walls stressed at the seams.',
    solution:
      'Inflate to the rated 4–5 PSI with a gauge-equipped electric pump, check the pressure when the walls and air are cool, and let the relief valve do its job if you overshoot. The included 1000W pump reaches operating pressure in about 10 minutes.',
    audience: 'Pool owners setting up for the season and anyone troubleshooting sagging walls.',
    steps: [
      'Target: 4–5 PSI operating pressure — this is where the internal threads lock the wall flat and rigid',
      'Measure with a gauge: the included electric pump inflates to pressure in ~10 minutes; hand-squeeze firmness is not a reliable indicator',
      'Check cool: pressure rises in direct sun and drops in cool evening air — inflate to range in the morning or shade, not at peak afternoon heat',
      'Relief valve: air auto-releases above 6 PSI, protecting seams from normal over-inflation',
      'Structural ceiling: 8 PSI is the maximum structural rating — a safety margin figure, never an inflation target',
      'Recheck after 24 hours: a small first-day pressure settle is normal; top back up to range and inspect valves if it drops fast',
      'Troubleshooting: walls soft at gauge-verified range means a valve or seam issue — see the leak guide before adding more air',
    ],
    faq: [
      {
        q: 'Why does my pool feel softer in the evening?',
        a: 'Air contracts as it cools. A wall at 4.5 PSI on a 30 °C afternoon can read around 3.5 PSI on a 15 °C night. Judge pressure by gauge in consistent conditions, not by feel across the day.',
      },
      {
        q: 'Can I use a stronger compressor to inflate faster?',
        a: 'Use the included 1000W pump or a pump with an accurate gauge and auto-stop. Uncontrolled high-pressure air can overshoot quickly — the relief valve protects above 6 PSI, but the goal is a controlled 4–5 PSI.',
      },
      {
        q: 'Is more PSI better for a stiffer wall?',
        a: 'No. Above the 4–5 PSI operating range you gain nothing and stress the seams. Stiffness comes from the drop stitch thread structure at rated pressure, not from extra pressure.',
      },
    ],
    relatedProducts: [
      'rectangular-drop-stitch-pool',
      'round-blue-drop-stitch-pool',
      'round-grey-drop-stitch-pool',
    ],
    relatedGuides: [
      'how-strong-is-a-drop-stitch-inflatable-pool',
      'inflatable-pool-setup',
      'how-to-prevent-pool-leaks',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'how-to-clean-an-inflatable-pool',
    category: 'maintenance',
    title: 'How to Clean an Inflatable Pool',
    description:
      'Cleaning routine for drop stitch pools: surface washing, algae and mildew removal, waterline scum, and which chemicals damage PVC.',
    tldr: 'Skim daily, brush the waterline weekly with a soft brush and mild PVC-safe cleaner, and shock-drain only when water care fails. Never use abrasive pads, solvents, or undiluted chlorine directly on the fabric.',
    problem:
      'A waterline ring, slimy walls, and green tints build up faster than owners expect — and scrubbing with the wrong tools or chemicals permanently damages the PVC surface.',
    solution:
      'Clean on a schedule with the right tools: a soft brush, neutral or PVC-safe cleaner, and routine water chemistry that stops algae before it starts. Cleaning is 10 minutes a week; neglect turns it into a full drain-and-scrub job.',
    audience: 'All inflatable pool owners.',
    steps: [
      'Skim leaves and insects daily with a net — organic debris feeds algae and stains',
      'Brush the waterline weekly with a soft nylon brush; a 1:5 white vinegar and water mix removes scum without harming PVC',
      'Wipe the outer walls monthly with clean water and a soft cloth; rinse off sunscreen and body-oil films',
      'Rinse swimwear before entering — fabric softener residue clouds water and films the walls',
      'Control algae with chemistry, not scrubbing: keep chlorine at 1–3 ppm and pH 7.2–7.6 so algae never establishes',
      'Spot-clean mildew on the outer wall with diluted vinegar, rinse thoroughly, and dry the area in shade',
      'At season end, clean the full interior with mild soap solution, rinse, and dry completely before storage',
    ],
    faq: [
      {
        q: 'Can I use baking soda to clean the pool?',
        a: 'A baking soda paste on a soft cloth is fine for waterline scum on the outer wall. Rinse well — residue changes water chemistry.',
      },
      {
        q: 'What cleaners damage an inflatable pool?',
        a: 'Abrasive scouring pads, acetone and solvent cleaners, bleach at full strength, and undiluted chlorine. They craze the PVC surface, weaken UV coatings, and invite leaks.',
      },
      {
        q: 'How do I remove the green tint from walls?',
        a: 'Green means algae — fix chlorine and pH first, brush the affected area, and run the filter. If the tint persists after chemistry is balanced, drain, spot-treat with a 1:5 vinegar mix, rinse, and refill.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'round-grey-drop-stitch-pool', 'rectangular-drop-stitch-pool'],
    relatedGuides: ['inflatable-pool-maintenance', 'how-to-store-a-drop-stitch-pool', 'how-to-prevent-pool-leaks'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'how-to-store-a-drop-stitch-pool',
    category: 'maintenance',
    title: 'How to Store a Drop Stitch Pool for Winter',
    description:
      'End-of-season teardown done right: draining, cleaning, drying, deflating, folding, and where to keep the pool until next summer.',
    tldr: 'Drain, clean, dry completely, deflate, fold loosely, and store in a frost-free, dry place in the storage bag. Trapped moisture and rodents ruin more stored pools than cold does.',
    problem:
      'Pools shoved into a shed damp and dirty come out in spring with mildew stains, fused fabric, and pest damage — a pool that survived the whole season is killed in storage.',
    solution:
      'Storage is a half-hour checklist at season end: a fully dry pool, folded without sharp creases, in a sealed bag, off a bare concrete floor, in a dry and frost-free space. Done right, the pool opens next season ready to inflate.',
    audience: 'Pool owners closing the season in seasonal climates.',
    steps: [
      'Drain through the drain valve toward a planned drainage route — never let hundreds of liters flood toward foundations',
      'Clean the interior with mild soap and water while the fabric is still spread out; rinse thoroughly',
      'Dry completely — unfold in shade for a full dry day, flipping once; trapped moisture causes mildew and material breakdown',
      'Open all air valves and press the walls flat; let the drop stitch fabric relax for 30 minutes before folding',
      'Fold loosely along the original factory creases; avoid sharp new creases that stress internal threads over months',
      'Place in the included storage bag, off bare concrete floors — use a pallet or shelf',
      'Store frost-free, dry, and away from rodents, heaters, and direct sunlight; a sealed plastic bin adds protection',
      'Remove and store the pump, hoses, and fittings separately, dry, so valves and electrics stay clean',
    ],
    faq: [
      {
        q: 'Can the pool stay outside all winter?',
        a: 'No. Freezing water, UV, snow load, and debris degrade the fabric and seams. Drop stitch pools are designed to fold and store — use that advantage.',
      },
      {
        q: 'How dry is dry enough?',
        a: 'No visible moisture, inside or out, and no damp smell. If in doubt, dry another day — a single damp fold can mildew the whole stored pool.',
      },
      {
        q: 'Is a garage or basement suitable?',
        a: 'Both work if frost-free and dry. Keep the bag off the floor, away from vehicles and sharp shelving, and check once mid-winter for moisture or pests.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'round-grey-drop-stitch-pool', 'rectangular-drop-stitch-pool'],
    relatedGuides: ['inflatable-pool-maintenance', 'how-to-clean-an-inflatable-pool', 'inflatable-pool-setup'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'how-to-prevent-pool-leaks',
    category: 'troubleshooting',
    title: 'How to Prevent and Repair Pool Leaks',
    description:
      'Why drop stitch pools leak, how to prevent the common causes, how to find a leak, and how to use the included repair kit.',
    tldr: 'Most leaks come from the ground, not the pool: sharp debris under the base and untreated valve seals. Sweep and use a ground sheet, soap-test to locate leaks, and patch with the included repair kit — small punctures fix in minutes.',
    problem:
      'A pool that stood firm for weeks slowly softens, and the owner faces an invisible leak, a guessed-at patch location, and a half-empty pool of water to manage.',
    solution:
      'Prevent first — clean ground, ground sheet, valve checks. If pressure drops, confirm it is a real leak (not temperature), locate it with soapy water, and patch it with the included kit while the pool is still inflated.',
    audience: 'Pool owners troubleshooting pressure loss or preparing a safe install.',
    steps: [
      'Prevent base punctures: sweep the site, remove every stone and root, and always use a ground sheet under the pool',
      'Protect from claws and tools: trim pet nails, keep garden tools and rough furniture away from the walls',
      'Check valves monthly: reseat valve cores and confirm the caps seal — valves leak far more often than walls',
      'Rule out temperature first: a soft wall after a cold night is normal air contraction; verify with a gauge before hunting leaks',
      'Locate with soapy water: brush diluted dish soap on suspect areas while inflated — bubbles mark the leak',
      'Patch with the included repair kit: clean and fully dry the area, round-cut a patch 3 cm larger than the hole, apply adhesive, press from the center out, cure per kit instructions',
      'Re-test after 24 hours at operating pressure before refilling; a slow drop at one valve means the valve core needs reseating or replacement',
    ],
    faq: [
      {
        q: 'My pool loses a little air every day — is that a leak?',
        a: 'Drop stitch pools hold pressure for weeks. Daily softening points to a valve or seam leak — soap-test the valves first, then the base seam and floor.',
      },
      {
        q: 'Can I patch the pool while it is full of water?',
        a: 'Small wall punctures above the waterline can be patched in place. For base or underwater damage, drain at least below the repair area so the patch bonds to clean, dry fabric.',
      },
      {
        q: 'Where do I get replacement valves or larger patches?',
        a: 'Spare parts — valves, patches, pumps, covers — stay available through info@felizbay.com for the life of the product.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'round-grey-drop-stitch-pool', 'rectangular-drop-stitch-pool'],
    relatedGuides: [
      'what-psi-should-an-inflatable-pool-use',
      'how-to-prepare-ground-for-an-inflatable-pool',
      'inflatable-pool-setup',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'how-much-does-a-filled-inflatable-pool-weigh',
    category: 'safety',
    title: 'How Much Does a Filled Inflatable Pool Weigh?',
    description:
      'Filled weight math for inflatable pools with per-size examples, and why the answer decides where the pool can safely stand.',
    tldr: 'Water weighs 1 tonne per cubic meter, so even small pools carry tonnes: a 3 m round pool holds around 4–5 tonnes, a 4 m round pool around 10 tonnes. The filled weight — not the pool size — decides whether a floor, deck, or patio can host it.',
    problem:
      'A pool that one person can carry into the yard in a bag becomes one of the heaviest objects in the home once filled — and decks, balconies, and pavers quietly fail under loads they were never rated for.',
    solution:
      'Compute before you fill: water depth times surface area in meters gives cubic meters, and each cubic meter adds a tonne. Match that number to what the surface is rated to carry — ground-level soil and engineered concrete pass easily; raised structures need a professional check.',
    audience: 'Anyone planning a pool on a patio, deck, balcony, or indoor floor.',
    steps: [
      'The rule: length × width × water depth (meters) = volume in cubic meters = weight in tonnes',
      'Round pools: a Ø 3 m pool filled to 0.65 m holds about 4.5 m³ — roughly 4.5 tonnes',
      'A Ø 4 m pool filled to 0.8 m holds about 10 m³ — roughly 10 tonnes, the weight of three cars on 12 square meters',
      'Rectangular pools: a 4 × 2 m pool filled to 0.6 m holds about 4.8 tonnes; a 6 × 5 m pool at 1.2 m depth exceeds 30 tonnes',
      'Ground-level garden lawn and concrete pads handle these loads comfortably if the soil is firm and level',
      'Raised decks and balconies almost never do — typical residential decks are rated for people and furniture loads, not a 10-tonne water bed; require a structural engineer sign-off first',
      'Add the users: swimmers displace water but people entering concentrate their own weight at the edges — factor ladders and entry points into floor loading',
    ],
    faq: [
      {
        q: 'Can my balcony hold a small inflatable pool?',
        a: 'Almost certainly not without an engineer approval. Even a 2 m pool filled to 0.4 m holds over a tonne in a compact footprint. Get a structural assessment before filling anything on a raised structure.',
      },
      {
        q: 'Does a ground sheet help with weight?',
        a: 'It protects the pool base from abrasion — it does not change the load. Weight is decided by water volume alone.',
      },
      {
        q: 'What surfaces are safest for large pools?',
        a: 'Firm, level, ground-level surfaces: lawn with compacted soil, a concrete pad, or a paved area rated for vehicle loads. Slopes and soft fill cause uneven settling and wall stress.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'round-grey-drop-stitch-pool', 'rectangular-drop-stitch-pool'],
    relatedGuides: [
      'placing-an-inflatable-pool-on-a-patio',
      'how-much-space-do-you-need-for-an-inflatable-pool',
      'how-to-prepare-ground-for-an-inflatable-pool',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'how-to-prepare-ground-for-an-inflatable-pool',
    category: 'tutorial',
    title: 'How to Prepare the Ground for an Inflatable Pool',
    description:
      'Site selection and ground prep for drop stitch pools: leveling, debris removal, base protection, and slope checks before you inflate.',
    tldr: 'Pick firm, level, well-drained ground; mow, sweep, and de-stone the site; lay a ground sheet. One hour of preparation prevents the leaks, sagging walls, and uneven water lines that cause most pool problems.',
    problem:
      'An unprepared site creates every classic failure: a stone punctures the base, a slope tilts the water line and loads one wall, and grass under the pool rots into a slimy, uneven mess.',
    solution:
      'Prepare in this order — choose, level, clear, protect. Choose firm ground with drainage away from buildings, get the surface level within a couple of centimeters, remove every sharp object, and finish with a ground sheet. Then the pool can do its job.',
    audience: 'First-time pool owners before setup day.',
    steps: [
      'Choose the site: firm natural ground, away from overhanging trees, power lines, and building foundations',
      'Check level with a straight board and spirit level across the footprint — more than 2–3 cm of slope across the pool needs fixing',
      'Fix slopes by removing high spots rather than building up low ones — filled pools compact added fill and settle unevenly',
      'Mow grass short and remove all clippings; long grass under a pool compacts, rots, and creates uneven support',
      'Sweep and de-stone: remove every stone, stick, root, and hard clod — walk the whole area in socks to feel what hands miss',
      'Lay a ground sheet slightly larger than the pool footprint; it blocks abrasion and separates the base from soil moisture',
      'Plan drainage before filling: the drain valve releases the entire pool at once, so confirm where that water will flow',
    ],
    faq: [
      {
        q: 'Can I set up on grass?',
        a: 'Yes — level, mown, de-stoned grass with a ground sheet is one of the best surfaces. Watch for settling after the first fill and re-check the level next season.',
      },
      {
        q: 'Should I put sand under the pool?',
        a: 'A thin leveling layer of fine sand can smooth minor irregularities on hard surfaces, but sand shifts under load and washes out. For slopes, cut down the high side instead of padding the low side.',
      },
      {
        q: 'How level does the ground really need to be?',
        a: 'Within about 2–3 cm across the whole footprint. Beyond that, the water line visibly tilts, one wall carries most of the load, and the pool looks and performs worse.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'round-grey-drop-stitch-pool', 'rectangular-drop-stitch-pool'],
    relatedGuides: [
      'inflatable-pool-setup',
      'how-to-prevent-pool-leaks',
      'how-much-does-a-filled-inflatable-pool-weigh',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'inflatable-pool-safety-for-families-with-children',
    category: 'safety',
    title: 'Inflatable Pool Safety for Families with Children',
    description:
      'Child safety around inflatable pools: active supervision, access control, depth rules, electrical safety, and what to do in an emergency.',
    tldr: 'Children need constant, undistracted adult supervision in and around any pool — water is a drowning hazard at any depth. Control access when the pool is not in use, remove toys after swimming, keep electrics dry and away, and learn basic rescue and CPR.',
    problem:
      'Shallow inflatable water feels harmless, so supervision relaxes — yet drowning is silent, fast, and happens in inches of water, most often during brief lapses in adult attention.',
    solution:
      'Treat an inflatable pool with the same respect as any pool: designate a watching adult with no phone, fence or control access whenever the pool is unsupervised, empty or remove standing water barriers for toddlers, and keep all electrical equipment on dry ground behind the pool.',
    audience: 'Parents and caregivers of young children.',
    steps: [
      'Active supervision: a designated adult watches children in the water at all times — no phone, no book, no stepping away "for a second"',
      'Stay in touch: for non-swimmers and under-fives, stay within arms reach whenever they are in or near the water',
      'Control access: when the pool is not in use, remove ladders, cover the water, and use fencing or barriers — an unsupervised pool full of water is the hazard, not just swimming time',
      'Clear the temptation: remove floating toys after swimming; toys left in the water draw children toward it',
      'Depth honesty: babies can drown in inches of water; the pool wall is not a safety barrier for a determined toddler',
      'Electrical safety: keep pumps and filter electrics on dry ground, behind the pool, plugged into an outlet with residual-current protection; no cords crossing walkways or the water area',
      'Non-slip entry: enforce walking near the pool, use a ladder or stable entry point, and ban pushing and pool-edge horseplay',
      'Emergency readiness: know basic rescue and child CPR; keep a phone reachable; drain small pools immediately after use if supervision cannot be guaranteed',
    ],
    faq: [
      {
        q: 'Do inflatable pools need a fence?',
        a: 'In many jurisdictions, pool barrier rules apply to any pool that can hold water, inflatable included. Check local regulations — and even where not required, a barrier is the single most effective protection for toddlers.',
      },
      {
        q: 'Is a shallow pool safe for toddlers without constant watching?',
        a: 'No. Young children can drown in very shallow water and do so silently in minutes. Never leave a toddler near water, even for a brief moment.',
      },
      {
        q: 'When should I drain the pool?',
        a: 'Drain whenever it will be unsupervised for an extended period around young children, at the end of each swimming day for small pools, and before any period you cannot control access.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'round-grey-drop-stitch-pool', 'rectangular-drop-stitch-pool'],
    relatedGuides: [
      'how-to-prepare-ground-for-an-inflatable-pool',
      'how-much-does-a-filled-inflatable-pool-weigh',
      'inflatable-pool-setup',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
];
