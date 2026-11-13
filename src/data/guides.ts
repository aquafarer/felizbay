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
    relatedProducts: ['round-blue-drop-stitch-pool', 'rectangular-drop-stitch-pool'],
    relatedGuides: ['inflatable-pool-maintenance', 'inflatable-pool-operating-costs'],
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
    relatedProducts: ['round-blue-drop-stitch-pool', 'hot-tub-round'],
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
    relatedProducts: ['round-grey-drop-stitch-pool', 'hot-tub-square-rect'],
    relatedGuides: ['inflatable-pool-setup'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'inflatable-pool-operating-costs',
    category: 'buying-guide',
    title: 'What an Inflatable Pool Really Costs to Run',
    description:
      'The full operating-cost picture of a drop stitch inflatable pool: inflation electricity, filter pump energy, water, and chemicals — with simple formulas to plug in your own local rates.',
    tldr: 'Running costs are small and predictable: about 0.17 kWh to inflate with the included 1000W pump, a few hours of filter pump power per day, one fill of water that lasts 3–6 weeks with proper care, and standard pool chemicals. Use the formulas here with your local utility rates for an exact seasonal budget.',
    problem:
      'Buyers budget for the purchase price but not for the season: pump electricity, water refills, and chemicals are small lines that quietly add up when nobody plans for them.',
    solution:
      'Break the season into four cost lines — inflation electricity, filtration energy, water, and chemicals — then price each with a simple formula and your own local rates instead of guessing.',
    audience: 'Families and facility buyers budgeting a full season of pool ownership.',
    steps: [
      'Inflation: the included 1000W air pump draws about 0.17 kWh for a ~10-minute inflation — a once-per-setup cost, not a daily one',
      'Filtration: run the filter pump 4–8 hours a day in season; daily energy = rated watts × hours ÷ 1000, priced at your local kWh rate',
      'Water: one full fill stays swimmable for 3–6 weeks with correct filtration and chemical care; cost = fill volume × your local water rate',
      'Chemicals: chlorine tablets and pH adjusters are inexpensive, regionally priced consumables — test 2–3 times per week so you top up chemicals instead of paying for a full water change',
      'Season total: add the four lines, then budget one drain-and-refill margin for surprises such as algae or heavy splash-out',
    ],
    faq: [
      {
        q: 'How much electricity does an inflatable pool use?',
        a: 'Inflating with the included 1000W pump uses about 0.17 kWh for a ~10-minute setup. The ongoing cost is the filter pump: multiply its rated wattage by your daily running hours and your local kWh rate — a few hours a day keeps the energy line small.',
      },
      {
        q: 'How often will I pay for water?',
        a: 'With filtration and correct chemical levels, one fill stays swimmable for 3–6 weeks. Most owners budget for a full drain-and-refill about once a month of heavy use, plus small top-ups for splash-out and evaporation.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'rectangular-drop-stitch-pool'],
    relatedGuides: ['inflatable-pool-maintenance'],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'what-is-a-drop-stitch-inflatable-pool',
    category: 'buying-guide',
    title: 'What Is a Drop Stitch Inflatable Pool?',
    description:
      'A plain-English explanation of drop stitch construction — how thousands of internal threads make an inflatable pool wall rigid enough to swim against.',
    tldr: 'Drop stitch fabric joins two outer PVC layers with thousands of internal threads. Inflated to 4–6 PSI, those threads lock the walls flat and rigid — closer to a hard-sided pool than a toy ring pool — yet the pool still deflates and folds for storage.',
    problem:
      'Most people have only seen ring-style or soft-sided inflatable pools that sag, bulge, and collapse. That experience makes it hard to believe an inflatable pool can hold a firm, straight wall 1.5 meters high.',
    solution:
      'Drop stitch construction limits how far the walls can expand: thousands of internal threads turn pressure into stiffness, so the fabric becomes a rigid panel instead of a balloon. Felizbay pools operate at 4–6 PSI with a pressure-relief valve that releases above 6 PSI, and every unit passes a 24–48 hour pressure-drop test before it ships.',
    audience: 'First-time buyers comparing pool types.',
    steps: [
      'Outer layers: two sheets of reinforced, UV-stabilized PVC form the wall surfaces',
      'Internal threads: thousands of fine polyester threads connect the layers at fixed intervals',
      'Air chamber: inflating the chamber to 4–6 PSI pulls the layers taut against the threads, locking the wall flat',
      'Rigid result: the wall becomes stiff and flat like a hard-sided pool',
      'Safety margin: rated maximum pressure is 8 PSI, with a relief valve that auto-releases above 6 PSI',
      'Storage: open the valves, let the fabric relax, and the whole pool folds into a storage bag',
    ],
    faq: [
      {
        q: 'Is a drop stitch pool really rigid?',
        a: 'Yes. At the rated 4–6 PSI operating pressure the walls form a flat, firm surface that resists collapsing or inward buckling.',
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
      'Compare the construction, not the category. Drop stitch walls inflate to 4–6 PSI and behave like hard panels; traditional inflatables operate at low pressure and depend on water pressure to hold their shape. That difference drives depth, wall stability, durability, and how the pool feels in daily use.',
    audience: 'Buyers deciding between pool types and price points.',
    steps: [
      'Wall construction: drop stitch = two PVC layers joined by internal threads; traditional = air-filled vinyl rings or unsupported soft walls',
      'Operating pressure: drop stitch runs at 4–6 PSI with a relief valve; ring pools run at low pressure with no meaningful pressure rating',
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
    tldr: 'Drop stitch pools are far stronger than ring pools: walls inflated to 4–6 PSI act as rigid panels, carry an 8 PSI structural rating, and pass a 24–48 hour factory pressure test. Strength comes from thousands of internal threads, not thicker vinyl alone.',
    problem:
      '"Inflatable" sounds fragile, so buyers picture a toy that punctures on the first sharp stone and folds under a full water load. That describes thin ring pools — not drop stitch construction.',
    solution:
      'Judge strength by construction and pressure ratings. Thousands of internal polyester threads lock the two PVC wall layers together, so at 4–6 PSI the wall behaves like a stiff panel: it holds a 1.2–1.5 m water column, stays flat under load, and survives full-season outdoor use. Every Felizbay unit ships only after passing a 24–48 hour pressure-drop test.',
    audience: 'Buyers weighing durability against the low price of thin-vinyl pools.',
    steps: [
      'Pressure strength: rated operating pressure is 4–6 PSI; seams and structure carry an 8 PSI maximum rating — three times higher than what a ring pool wall can hold',
      'Pressure protection: a relief valve auto-releases air above 6 PSI, so normal over-inflation cannot stress the seams',
      'Wall stiffness: internal threads stop the wall from ballooning, which is why the wall stays flat and rigid under a full water load',
      'Factory verification: every pool passes a 24–48 hour pressure-drop test before packing — a wall that loses pressure never ships',
      'Material layers: reinforced, UV-stabilized multi-layer PVC resists punctures, sunlight, and abrasion far better than single-layer vinyl',
      'Real-world limits: the walls are built for daily family use — but sharp objects, pet claws, and deliberate cutting will puncture any inflatable',
      'Field repair: the retail swim-pool sets include a repair kit, and small punctures patch in minutes without deflating the whole pool',
    ],
    faq: [
      {
        q: 'Can adults lean or sit on the wall?',
        a: 'The walls are not rated as seating or load-bearing structures. Do not sit on, lean against, or climb the walls — follow the use limits in the product manual, and never use the pool as a diving or jumping platform.',
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
      'Correct inflation pressure for drop stitch pools — why 4–6 PSI is the operating range, how to measure it, and what the relief valve does.',
    tldr: 'Inflate drop stitch walls to 4–6 PSI. Below that the walls flex; the relief valve auto-releases above 6 PSI and the structure is rated to 8 PSI. Use a pump with a pressure gauge — firmness by hand tells you almost nothing at these pressures.',
    problem:
      'Inflated by feel, pools end up in one of two states: under-inflated walls that sag and buckle inward under the water load, or wildly over-inflated walls stressed at the seams.',
    solution:
      'Inflate to the rated 4–6 PSI with a gauge-equipped electric pump, check the pressure when the walls and air are cool, and let the relief valve do its job if you overshoot. The included 1000W pump reaches operating pressure in about 10 minutes.',
    audience: 'Pool owners setting up for the season and anyone troubleshooting sagging walls.',
    steps: [
      'Target: 4–6 PSI operating pressure — this is where the internal threads lock the wall flat and rigid',
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
        a: 'Use the included 1000W pump or a pump with an accurate gauge and auto-stop. Uncontrolled high-pressure air can overshoot quickly — the relief valve protects above 6 PSI, but the goal is a controlled 4–6 PSI.',
      },
      {
        q: 'Is more PSI better for a stiffer wall?',
        a: 'No. Above the 4–6 PSI operating range you gain nothing and stress the seams. Stiffness comes from the drop stitch thread structure at rated pressure, not from extra pressure.',
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
  {
    slug: 'best-inflatable-pools-for-small-backyards',
    category: 'buying-guide',
    title: 'Best Inflatable Pools for Small Backyards',
    description:
      'How to pick an inflatable pool for a small backyard: measure the real usable area, choose the right footprint, and match it to the smallest factory sizes that still swim well.',
    tldr: 'Measure the clear, level area first, then pick the largest round pool that fits with access space left over. For tight yards the factory range starts at Ø 2 × 0.5 m and steps up through Ø 3 m and Ø 4 m; a small square soaking tub (1.5 × 1.5 m) fits where nothing else will. Full-fill volumes run from about 1,600 L (Ø 2 m) to 15,000 L (Ø 4 × 1.2 m).',
    problem:
      'Small-backyard buyers either buy a pool that is too big for the space and squeeze out access and seating, or go too small and end up with a paddling tub nobody can actually swim in.',
    solution:
      'Work from the measured clear area, not the yard size. Deduct space for walking around, seating and equipment, leave the pool reachable from all sides, and choose from the dense size steps in the factory range — small yards are exactly where the fine increments from 2 m to 4 m pay off.',
    audience: 'Homeowners with small backyards, courtyards, side yards, and townhome patios.',
    steps: [
      'Measure the clear, level area with a tape — not the yard boundary, but the space actually free of planters, furniture, doors and slopes',
      'Keep at least 50 cm (ideally 1 m) of access around the pool for cleaning, covers and safe entry; a pool you cannot walk around is a pool you cannot maintain',
      'Match the footprint to the size steps: Ø 2 × 0.5 m (≈1,600 L full fill) for a compact splash pool; Ø 3 × 1 m or Ø 3 × 1.2 m (≈7,000–8,500 L) as the sweet spot for a small family; Ø 4 × 1.2 m (≈15,000 L) if you can spare a 4 m circle plus access',
      'Consider a square soaking tub where a round pool will not fit: 1.5 × 1.5 m (≈1,800 L) seats two adults and fits a courtyard corner; Ø 2 × 0.8 m (≈2,500 L) round SPA tubs work on load-rated patios',
      'Check the weight: water weighs about 1 t per m³, so even the Ø 3 × 1.2 m pool puts roughly 8.5 t on the ground — level soil or a rated patio is mandatory, a balcony needs professional sign-off',
      'Prefer rigid drop-stitch walls over ring pools in small spaces — rigid vertical walls use the footprint for water, not for sagging vinyl',
      'Plan where the pool goes in winter: every pool on this list drains, deflates and folds into a storage bag, which is the whole point for a small yard',
    ],
    faq: [
      {
        q: 'What is the smallest pool that is still worth swimming in?',
        a: 'The Ø 3 m round sizes (3 × 1 m or 3 × 1.2 m) are the practical minimum for real swimming and play — about 7,000–8,500 L of water with a wall height adults can actually use. Below that, the Ø 2 × 0.5 m size works as a compact plunge and kids pool.',
      },
      {
        q: 'Can I put a small pool on a patio or deck?',
        a: 'Only if the structure is rated for the filled weight. A 1.5 × 1.5 m soaking tub holds about 1.8 t of water; a Ø 3 × 1.2 m pool about 8.5 t. Ground-level patios usually cope; raised decks and balconies need a structural engineer’s sign-off before anything is ordered.',
      },
      {
        q: 'Round or rectangular for a narrow side yard?',
        a: 'Rectangular. The factory range includes 2 × 2 × 0.8 m (≈3,200 L) and 3 × 2 × 0.8 m (≈4,800 L) rectangles that slot into side yards where a 3 m circle would not fit with access space.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'hot-tub-square-rect', 'rectangular-drop-stitch-pool'],
    relatedGuides: [
      'how-much-space-do-you-need-for-an-inflatable-pool',
      '3m-vs-4m-vs-5m-inflatable-pool',
      'how-much-does-a-filled-inflatable-pool-weigh',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: '3m-vs-4m-vs-5m-inflatable-pool',
    category: 'buying-guide',
    title: '3m vs 4m vs 5m Inflatable Pool: Which Size Do You Actually Need?',
    description:
      'A size-by-size comparison of 3 m, 4 m and 5 m drop stitch inflatable pools — footprint, water volume, fill weight, user count and price — so you buy the right diameter the first time.',
    tldr: 'A 3 m pool (≈7,000–8,500 L) suits small families and younger kids; a 4 m pool (≈15,000 L) is the family sweet spot with real swim room; a 5 m pool (≈23,500 L) fits teens, guests and proper swimming. Each step up roughly doubles the water, the weight and the fill time — match the size to your space and users, not to your ambition.',
    problem:
      'Diameter is the single most regretted pool decision: one size too small and the pool is crowded after ten minutes; one size too big and the ground, water budget or hose cannot keep up.',
    solution:
      'Compare what each diameter actually delivers — volume, weight, users, fill time — against your measured space and household, then pick from the factory size steps in between instead of jumping straight to the biggest number.',
    audience: 'Families deciding between the common 3, 4 and 5 meter pool sizes.',
    steps: [
      'Start with the 3 m class: Ø 3 × 1 m holds about 7,100 L at full fill, Ø 3 × 1.2 m about 8,500 L — comfortable for 2–3 kids or a couple, with a footprint (plus 1 m access) that fits most townhome gardens',
      'Step up to 4 m: Ø 4 × 1.2 m holds about 15,100 L — the sweet spot for a family of four; two adults swim laps of a sort, kids have room for games, and the filled weight is around 15 t on level ground',
      'The 5 m class: Ø 5 × 1.2 m holds about 23,600 L (≈24 t of water) — teens, guests and genuine swimming; budget a half-day to fill from a single garden tap',
      'Water weighs about 1 t per m³ — every size step up is a structural decision as much as a comfort one; confirm level, load-bearing ground before ordering',
      'User count rule of thumb: 3 m ≈ 2–3 users, 4 m ≈ 3–5 users, 5 m ≈ 5–8 users in normal family play — halve it if adults want to actually swim',
      'Fill time matters: a typical garden tap delivers 10–20 L per minute, so 7,000 L takes 6–12 hours, 15,000 L takes 12–24 hours — fill overnight for the bigger sizes',
      'Fine steps exist between the round numbers: the factory round range runs Ø 3.7, Ø 4.6, Ø 5.5 m and wall heights of 1.0/1.2/1.5 m — the in-between sizes often fit a measured space better than the round number you first had in mind',
      'Check the price ladder on the wholesale price list before deciding — larger diameters cost more per unit but the cost per liter of water actually falls, so the 4 m class is usually the best value for a family',
    ],
    faq: [
      {
        q: 'Is a 3 m pool big enough for a family of four?',
        a: 'It works for young kids, but it is a play pool, not a swim pool, for four people. If two adults and two children all want to be in the water together, the 4 m class is the better choice.',
      },
      {
        q: 'How long does a 5 m pool take to fill?',
        a: 'At a typical garden tap rate of 10–20 L/min, the ≈23,600 L of a Ø 5 × 1.2 m pool takes roughly 20–40 hours. Many owners fill overnight or over two evenings.',
      },
      {
        q: 'Do I need a bigger pump for a bigger pool?',
        a: 'No — the included 1000W electric air pump inflates any of these sizes in about 10–20 minutes, because inflation volume scales with wall area, not water volume. Filling is the slow part, not inflating.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'round-grey-drop-stitch-pool', 'rectangular-drop-stitch-pool'],
    relatedGuides: [
      'best-inflatable-pools-for-small-backyards',
      'how-much-water-does-a-4m-pool-hold',
      'how-to-choose-inflatable-pool',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'round-vs-rectangular-inflatable-pools',
    category: 'buying-guide',
    title: 'Round vs Rectangular Inflatable Pools: Which Shape Wins for Your Yard?',
    description:
      'Round vs rectangular drop stitch pools compared on space efficiency, swimming use, seating, price and storage — with the real factory sizes and volumes behind each choice.',
    tldr: 'Round pools distribute water pressure evenly, cost less per liter and suit family play; rectangular pools turn the same footprint into usable swim lanes and fit narrow yards. The factory range runs Ø 2–10 m round and 2 × 2 m up to 6 × 5 m rectangular, so the shape decision comes down to how you will use the water.',
    problem:
      'Buyers choose pool shape by appearance, then discover a round pool wastes the corners of a narrow yard, or a rectangular pool feels cramped when the whole family piles in.',
    solution:
      'Decide the primary use first — swimming and laps point to rectangular, play and lounging point to round — then verify the shape against the actual measured space and the size steps available in each series.',
    audience: 'Families and buyers choosing between round and rectangular pool shapes.',
    steps: [
      'Swimming use: rectangular wins — the 4 × 3 × 1.2 m (≈14,400 L) and 6 × 3 m sizes give straight swim lanes; a round pool of the same area forces curved paths',
      'Play and lounging: round wins — no corners to collide with, even depth all around, and the whole family can face each other; the Ø 4 × 1.2 m round (≈15,100 L) is the classic family choice',
      'Space efficiency: rectangles use rectangular yards better — a 3 × 2 × 0.8 m pool (≈4,800 L) slots into a side yard where a Ø 3 m circle plus access space would not fit',
      'Structural behavior: round walls carry water pressure in pure hoop tension, which is why very large sizes (Ø 6–10 m) are round; rectangular pools need reinforced seams and thicker walls at the same volume — the 50 cm wall options exist for exactly this',
      'Price per liter: at similar volumes, round is usually cheaper — compare FOB unit prices on the wholesale price list before assuming the rectangle is the budget option',
      'Soaking and SPA use: shape barely matters — square (1.5 × 1.5 m to 3 × 2 m) and round (Ø 1.8–2.3 m) SPA tubs both seat 2–6 adults; pick by the corner it must fit',
      'Storage is identical: both shapes drain, deflate and fold into a storage bag — shape affects the season, not the winter',
    ],
    faq: [
      {
        q: 'Which shape is safer for kids?',
        a: 'Round, marginally — no corners to bump into and an even depth all around. But supervision, access control and level ground matter far more than shape; both shapes follow the same safety rules.',
      },
      {
        q: 'Can you actually swim laps in a rectangular inflatable pool?',
        a: 'In the larger sizes, yes — a 6 × 3 m or 6 × 5 m rectangle (50 cm walls) supports real stroke work and water fitness. The smaller 2 × 2 m and 3 × 2 m rectangles are play and soak sizes, not lap pools.',
      },
      {
        q: 'Are rectangular pools more prone to leaks?',
        a: 'Not when properly built — rectangular Felizbay pools use reinforced corners and rails and pass the same 24–48 hour pressure-drop test as round ones. Wall integrity comes from drop-stitch construction and QC, not shape.',
      },
    ],
    relatedProducts: ['rectangular-drop-stitch-pool', 'round-blue-drop-stitch-pool', 'hot-tub-square-rect'],
    relatedGuides: [
      '3m-vs-4m-vs-5m-inflatable-pool',
      'how-strong-is-a-drop-stitch-inflatable-pool',
      'best-inflatable-pools-for-small-backyards',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'how-much-water-does-a-4m-pool-hold',
    category: 'technology',
    title: 'How Much Water Does a 4m Pool Hold? Capacity Math for Every Size',
    description:
      'The actual water capacity of 4 m inflatable pools — round and rectangular — with the cylinder and box math, fill-line reality, water weight and what it costs to fill one.',
    tldr: 'A Ø 4 × 1.2 m round pool holds about 15,000 L at full fill; a 4 × 3 × 1.2 m rectangle about 14,400 L. Real fills stop at the marked line (80–90%), so plan on roughly 12,000–13,500 L and 12–24 hours of hose time. Water weighs 1 t per m³, so a filled 4 m pool puts about 15 t on the ground.',
    problem:
      '"How much water?" drives fill time, water cost, chemical dosing, filter sizing and whether the ground can take the load — yet sellers quote rim-to-rim volumes that real fills never reach.',
    solution:
      'Use the geometric formulas, then apply the fill-line discount: round pools hold π × (diameter/2)² × height cubic meters (×1,000 for liters); rectangles hold length × width × height. Multiply by 0.8–0.9 for the marked fill line, and by one tonne per cubic meter for ground load.',
    audience: 'Pool buyers planning water supply, costs, chemicals and ground load.',
    steps: [
      'The formula for round pools: volume (L) = 3.1416 × (diameter ÷ 2)² × height × 1,000 — for Ø 4 × 1.2 m that is 3.1416 × 4 × 1.2 × 1,000 ≈ 15,100 L at full fill',
      'The formula for rectangular pools: volume (L) = length × width × height × 1,000 — a 4 × 3 × 1.2 m pool is 14,400 L; a 4 × 4 × 1.2 m is 19,200 L',
      'Apply the fill line: pools fill to 80–90% of wall height, not the rim — a Ø 4 × 1.2 m pool used at 85% holds about 12,800 L of actual water',
      'Convert to load: water is about 1 t per m³, so a 4 m class pool places 12–15 t on its footprint — level, load-bearing ground or an engineer-rated deck is not optional',
      'Convert to time: a garden tap delivers roughly 10–20 L/min, so 12,800 L takes 11–21 hours — fill overnight, check seams and level during the first hours',
      'Convert to money: at a typical $2–5 per 1,000 L of treated municipal water, one fill of a 4 m pool costs about $25–65 depending on your market — the pool volume calculator works this out for your exact size',
      'Dose chemicals to the real volume: chlorine and pH products dose per 1,000 L; using the full-fill number on a fill-line pool overdoses the water — always dose the actual liters',
    ],
    faq: [
      {
        q: 'How much does it cost to fill a 4 m pool?',
        a: 'Roughly $25–65 per full fill at typical municipal water prices of $2–5 per 1,000 L, for about 12,800 L at the fill line. Top-ups through the season add far less than the initial fill.',
      },
      {
        q: 'How many liters is a 4 m pool compared to a 3 m pool?',
        a: 'A Ø 4 × 1.2 m pool holds about 15,100 L versus 8,500 L for Ø 3 × 1.2 m — the diameter step from 3 to 4 nearly doubles the water, the weight and the fill time.',
      },
      {
        q: 'Why does my pool hold less than the advertised volume?',
        a: 'Published volumes are usually rim-to-rim geometric maximums. Real fills stop at the marked fill line (80–90% of wall height), and seats in SPA tubs displace water on top of that.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'rectangular-drop-stitch-pool', 'round-grey-drop-stitch-pool'],
    relatedGuides: [
      '3m-vs-4m-vs-5m-inflatable-pool',
      'how-much-does-a-filled-inflatable-pool-weigh',
      'inflatable-pool-operating-costs',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'inflatable-pool-vs-above-ground-pool',
    category: 'buying-guide',
    title: 'Inflatable Pool vs Above Ground Pool: An Honest Comparison',
    description:
      'Drop stitch inflatable pools vs steel-frame and rigid above ground pools compared on cost, setup, durability, winter storage, safety and resale — which one fits which buyer.',
    tldr: 'Modern drop stitch inflatables close most of the rigidity gap to steel-frame pools at a fraction of the price, setup time and storage headache. Rigid above ground pools win on multi-year permanence and edge seating; inflatables win on cost, 30-minute setup, season-end pack-up and balcony-class portability.',
    problem:
      '“Inflatable” still makes buyers picture a sagging ring pool, while “above ground” makes them picture a permanent structure with permits and a winter of standing water — both pictures are out of date.',
    solution:
      'Compare the two categories on the factors that actually decide the purchase: rigidity, cost, setup, durability, storage, safety obligations and ground requirements — then match the winner to how long you want a pool in one place.',
    audience: 'Buyers deciding between an inflatable pool and a steel-frame or rigid above ground pool.',
    steps: [
      'Rigidity: drop stitch walls inflate to 4–6 PSI and stand rigid like hard-sided walls — a filled Felizbay pool holds flat vertical walls and a square shape; this is not ring-pool vinyl',
      'Cost: a quality drop stitch inflatable starts far below rigid kits of similar water volume, and the 48-size factory range means you pay for the exact size you need rather than a frame tier',
      'Setup: an inflatable is 10–20 minutes of inflation plus filling, with no tools, no frame parts and no ground plates; frame pools take a half-day assembly first',
      'Durability: rigid kits hold up to permanent year-round exposure; inflatables are built for full-season use and then pack away — stored dry and out of sun, drop stitch PVC returns for many seasons',
      'Winter: this is the inflatable’s trump card — drain, deflate, fold into a storage bag and the yard is back; a rigid pool either survives winter standing (with ice, cover and maintenance) or needs a full teardown',
      'Safety and rules: barrier and supervision rules apply to both categories in most jurisdictions; check local regulations before either purchase — depth, not structure, drives most rules',
      'Ground load: both put about 1 t per m³ of water on the ground — the load question is identical; what differs is that an inflatable can be moved if you got the spot wrong, a rigid pool cannot',
      'Resale and relocation: an inflatable folds into a bag and moves house with you; rigid kits are typically sold off or abandoned',
    ],
    faq: [
      {
        q: 'Do inflatable pools last as long as above ground pools?',
        a: 'A rigid kit left up year-round can outlast an inflatable. But an inflatable that is drained, dried and stored each winter regularly serves many seasons — durability is mostly a storage habit question, not a material question.',
      },
      {
        q: 'Which is safer for children?',
        a: 'Neither has an inherent safety edge — supervision, access control and barrier rules apply to both. Rigid pools often have taller walls and ladders that need securing; inflatables have lower climb-over profiles but the same drowning risk at any depth.',
      },
      {
        q: 'Can an inflatable pool really replace a frame pool?',
        a: 'For seasonal family use, yes — drop stitch walls at 4–6 PSI are genuinely rigid, the 50 cm wall sizes reach frame-pool water depths, and the pack-away benefit is something no frame pool offers.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'rectangular-drop-stitch-pool', 'round-grey-drop-stitch-pool'],
    relatedGuides: [
      'what-is-a-drop-stitch-inflatable-pool',
      'drop-stitch-vs-traditional-inflatable-pools',
      'how-strong-is-a-drop-stitch-inflatable-pool',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'how-to-choose-a-cold-plunge-tub',
    category: 'buying-guide',
    title: 'How to Choose a Cold Plunge Tub',
    description:
      'A buyer’s guide to cold plunge tubs: size and depth, insulation, material rigidity, chillers and ice logistics, drainage and the honest math on water temperature.',
    tldr: 'Choose a plunge tub by body fit first (Ø 1.8–2.3 m round or 1.5–2.4 m square seats most adults), insulation second (a 5 mm insulated base matters more than marketing claims), and cooling strategy third — ice works for occasional plunges, a chiller for daily practice. Drop stitch tubs give rigid walls, pack away for travel, and cost a fraction of rigid plunge tanks.',
    problem:
      'Cold plunging went mainstream and the market filled with soft, poorly insulated tubs that leak cold, sag under body weight and turn daily practice into an ice-bagging chore.',
    solution:
      'Buy a rigid drop stitch tub with an insulated base in a size that fits your body and your chiller or ice plan, plan drainage before placement, and treat cooling capacity — not tub price — as the main recurring cost.',
    audience: 'Athletes, fitness enthusiasts, and wellness buyers setting up cold-water immersion at home.',
    steps: [
      'Fit first: for full-body immersion up to the shoulders you need Ø 1.8 m round minimum (RS1808) or 1.5 × 1.5 m square (SS151508); taller users and stretched-leg positions point to Ø 2–2.3 m (RS2018, RS2308) or 2.4 × 2.4 m (SS242410)',
      'Rigidity matters: drop stitch walls inflate to 4–6 PSI and hold shape when you brace against the sides getting in and out — soft-wall tubs flex exactly when you need support most',
      'Insulation: a 5 mm insulated thermal base slows the melt of ice and the workload of a chiller; on cold ground without it you are re-cooling the planet every night',
      'Cooling strategy: occasional plunges run on ice (a Ø 2 × 0.8 m tub holds about 2,500 L — that is a lot of ice per session); daily practice needs a chiller sized to the volume and your target temperature (10–15 °C typical)',
      'Plan water care: still water grows things; plan a sanitizer routine (hydrogen peroxide is common for plunge tubs), a cover between sessions, and a full drain-and-refresh cadence',
      'Drainage before placement: 2,500 L has to go somewhere — position near a drain or garden area and check the drain valve access before filling',
      'Surface load: about 2.5 t of water plus a body — ground level is simple, raised decks need structural sign-off',
      'Travel and storage use case: a drop stitch plunge tub deflates into a bag — the same tub travels to training camps and packs for the off-season, which rigid tanks cannot do',
    ],
    faq: [
      {
        q: 'How cold should a plunge tub be?',
        a: 'Most protocols run 10–15 °C for 2–5 minutes. Beginners start around 15 °C and shorter times. Always build up gradually and consult a doctor first if you have cardiovascular conditions.',
      },
      {
        q: 'Can I use a drop stitch tub with a chiller?',
        a: 'Yes — the tubs accept standard plumbing connections and owners commonly pair them with external chillers. Confirm the exact chiller model and connection size with us before ordering so compatibility is verified per setup.',
      },
      {
        q: 'How much ice does a plunge tub need?',
        a: 'For a ≈2,500 L tub dropping from tap temperature to 15 °C, occasional-plunge users typically add tens of kilograms of ice per session — which is exactly why daily plungers buy a chiller instead.',
      },
    ],
    relatedProducts: ['hot-tub-round', 'hot-tub-square-rect'],
    relatedGuides: [
      'inflatable-spa-vs-rigid-hot-tub',
      'what-is-a-drop-stitch-inflatable-pool',
      'how-much-does-a-filled-inflatable-pool-weigh',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'inflatable-spa-vs-rigid-hot-tub',
    category: 'buying-guide',
    title: 'Inflatable SPA vs Rigid Hot Tub: Which One Should You Buy?',
    description:
      'Inflatable drop stitch SPA tubs vs rigid acrylic and rotomolded hot tubs compared on price, heating, insulation, jets, installation, running cost and lifespan.',
    tldr: 'Rigid hot tubs win on jets, insulation and 10-year permanence; inflatable SPA tubs win on price (a fraction of a jetted rigid tub), delivery (a bag vs a crane), portability and seasonal flexibility. Felizbay SPA tubs focus on still-water soaking — built-in seats, insulated bases, external heater compatibility — not massage jets.',
    problem:
      'Buyers compare a $499 inflatable soaker against a $5,000+ jetted acrylic tub as if they were the same product, then buy the wrong one for how they actually bathe.',
    solution:
      'Decide whether you want massage jets or still soaking, whether the tub is a permanent installation or a seasonal one, and what your floor or ground can carry — the answers eliminate most of the comparison by themselves.',
    audience: 'Wellness buyers choosing between inflatable and rigid hot tubs.',
    steps: [
      'Jets decide the category: if massage jets are essential, buy a jetted rigid tub — Felizbay SPA tubs are still-water soakers by design and none include jets',
      'Price and total cost: an inflatable soaking tub is a small fraction of the rigid-jetted price; add to the rigid side the delivery, crane or forklift, electrician and reinforced slab that acrylic tubs often require',
      'Delivery and installation: an inflatable ships in a bag, carries through a doorway, inflates in 5–15 minutes with the included 1000W pump and sits on any level load-rated surface; rigid tubs are delivered on pallets and usually need a crane for anything above ground floor',
      'Heating: inflatable tubs pair with external heaters (sold separately — compatibility confirmed per order); rigid tubs have built-in heaters but you pay for that in the purchase price',
      'Insulation: rigid acrylic tubs insulate better long-term; a 5 mm insulated base and a fitted thermal cover narrow the gap for daily soakers at a much lower running cost per degree',
      'Water volume and running cost: small inflatable soakers (1.8–2.4 m, roughly 1,800–4,000 L) heat less water than a 6-person acrylic tub (1,200–1,500 L jetted but far heavier construction and higher standby losses) — small soakers often cost less to run for 1–2 people',
      'Lifespan and commitment: rigid tubs live outdoors for a decade; inflatables deliver many seasons and then pack away — the right choice depends on whether "spa corner" is a permanent room or a seasonal one',
      'Ground and floor load: both put about 1 t per m³ on the surface — a 1.5 × 1.5 m soaker is about 1.8 t of water; a balcony install needs professional sign-off either way',
    ],
    faq: [
      {
        q: 'Do inflatable SPA tubs have massage jets?',
        a: 'No — Felizbay SPA tubs are built for still-water soaking, cold plunges and heated soaks with built-in seats and insulated bases. If jets are the point of the purchase, a rigid jetted tub is the honest answer.',
      },
      {
        q: 'How well does an inflatable tub hold heat?',
        a: 'The 5 mm insulated base and a fitted thermal cover retain heat between sessions. Daily soakers should budget heating energy as the main running cost; the insulated base keeps overnight losses modest.',
      },
      {
        q: 'Can I move an inflatable hot tub later?',
        a: 'Yes — drain, deflate and carry it through a doorway. That portability is the category’s structural advantage over acrylic tubs, which usually stay where they were craned in.',
      },
    ],
    relatedProducts: ['hot-tub-round', 'hot-tub-square-rect'],
    relatedGuides: [
      'how-to-choose-a-cold-plunge-tub',
      'pool-heating-cost-guide',
      'what-is-a-drop-stitch-inflatable-pool',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'pool-heating-cost-guide',
    category: 'technology',
    title: 'Pool Heating Costs: What It Actually Costs to Heat a Pool or SPA Tub',
    description:
      'The real cost of heating pool water: the physics of 1.16 kWh per °C per 1,000 L, heater types, heat loss, covers, and worked examples for soaking tubs and small pools.',
    tldr: 'Heating water is the most expensive line in pool ownership: every 1,000 L costs about 1.16 kWh per °C of warming. Lifting a 2,500 L soaking tub from 15 °C to 37 °C takes roughly 64 kWh before losses — a cover and an insulated base cut the losses, and small volumes are the cheapest way to own warm water.',
    problem:
      'Buyers budget the tub and the heater but not the energy: warm water loses heat every hour to air, wind and ground, and an uncovered tub re-buys its warmth daily.',
    solution:
      'Do the volume × temperature math before choosing a heater, insulate the base, cover the water whenever it is not in use, and heat the smallest volume that does the job — a small soaker beats a big pool for affordable warmth.',
    audience: 'SPA tub and pool owners planning heated soaking and its running costs.',
    steps: [
      'The core physics: warming 1,000 L of water by 1 °C takes about 1.16 kWh of heat energy — write down your volume and your target temperature before anything else',
      'Worked example (Ø 2 × 0.8 m soaker, ≈2,500 L at the fill line): from 15 °C tap water to 37 °C soaking temperature is 22 °C × 2.5 × 1.16 ≈ 64 kWh before losses',
      'Worked example (1.5 × 1.5 × 0.8 m tub, ≈1,800 L): the same 22 °C lift costs about 46 kWh — smaller volumes are dramatically cheaper to keep warm',
      'Losses are the real bill: an uncovered tub loses heat to evaporation (the biggest loss), wind and the ground; a fitted thermal cover and the 5 mm insulated base cut re-heating dramatically — covering the tub between sessions is the highest-ROI habit in heated soaking',
      'Heater choice: external heaters (sold separately, compatibility confirmed per order) are sized to the volume; undersized heaters never catch up on a cold night, oversized ones waste standby energy',
      'Cold-plunge economics run the other way: chilling 2,500 L with a chiller or ice has the same 1.16 kWh-per-°C-per-1,000 L physics, but you start from tap temperature and only drop 5–10 °C — plus insulation works for free in your favor',
      'Multi-day strategy: for regular soakers, holding a covered tub at temperature usually beats reheating from cold — model both against your electricity tariff',
      'Check your power circuit before buying any heater: external heaters need a dedicated circuit with residual-current protection, installed by a qualified professional',
    ],
    faq: [
      {
        q: 'How much does it cost to heat a small soaking tub once?',
        a: 'A ≈2,500 L tub lifted from 15 °C to 37 °C needs about 64 kWh before losses — at $0.15–0.35 per kWh that is roughly $10–22 per full reheat. Covers and holding temperature change that math completely.',
      },
      {
        q: 'Is a bigger heater cheaper to run?',
        a: 'No — a heater converts electricity to heat at about the same efficiency regardless of size. Bigger heaters reach temperature faster (fewer loss-hours while heating) but cost more to buy; the saving strategy is insulation and covering, not kilowatts.',
      },
      {
        q: 'Does the insulated base actually help?',
        a: 'Yes — the ground is a large cold sink under the tub. The 5 mm insulated thermal base slows ground losses materially, which matters most in spring and autumn when ground temperature lags the air.',
      },
    ],
    relatedProducts: ['hot-tub-round', 'hot-tub-square-rect'],
    relatedGuides: [
      'inflatable-spa-vs-rigid-hot-tub',
      'inflatable-pool-operating-costs',
      'how-to-choose-a-cold-plunge-tub',
    ],
    difficulty: 'intermediate',
    waterType: ['freshwater'],
  },
  {
    slug: 'how-to-choose-a-pool-filter-pump',
    category: 'buying-guide',
    title: 'How to Choose a Pool Filter Pump',
    description:
      'How to size and choose a filter pump for an inflatable pool: turnover rate, flow vs volume, cartridge vs sand, the standard 38 mm port, and what to run when.',
    tldr: 'Match the pump to the water volume: you want a turnover of the full pool volume every 2–4 hours, so a ≈8,500 L pool needs roughly 2,000–4,000 L/h of actual flow. Felizbay pools take common filter pumps through the standard 38 mm port — filter pumps are sold separately from the included 1000W air pump.',
    problem:
      'The included 1000W pump inflates the pool but does not filter the water — buyers discover this a week in, when the water has turned and no equipment in the box can fix it.',
    solution:
      'Buy a filter pump sized to your liters, run it long enough to turn the water over at least twice a day in season, keep cartridges or sand clean, and pair it with a sanitizer routine and a cover.',
    audience: 'Inflatable pool owners setting up water care equipment.',
    steps: [
      'Know your liters first: measure the actual fill (for example Ø 3 × 1.2 m ≈ 8,500 L at full fill, less at the fill line) — every pump decision starts from this number',
      'Size by turnover: aim to circulate the full volume every 2–4 hours of runtime; an 8,500 L pool therefore needs a pump delivering roughly 2,100–4,300 L/h of real flow, not badge numbers',
      'Trust flow under load: quoted flow is measured at zero head; real flow through a hose and filter media is lower — buy one size class up from the paper math',
      'Cartridge vs sand: cartridge pumps are cheaper and fine to about 4–8 m³; sand filters handle bigger pools, are cheaper per season in media, and are the normal choice for wholesale/commercial setups',
      'Check the port: Felizbay pools use the standard 38 mm filter-pump port that common pumps accept — confirm the fitting before buying any pump',
      'Run time strategy: in high season run the pump long enough for at least two full turnovers per day (typically 6–10 hours), skew the hours to daylight so sanitizer works with the sun exposure',
      'Maintain the media: rinse cartridges weekly and replace them when they stop coming clean; a clogged filter cuts flow long before it stops the motor',
      'Do not confuse the pumps: the included 1000W electric air pump inflates walls in minutes and then goes back in the bag; the filter pump runs for hours a day and is a separate purchase',
    ],
    faq: [
      {
        q: 'Does my Felizbay pool include a filter pump?',
        a: 'No. The included pump is a 1000W electric air pump for inflation. The pool has a standard 38 mm port that accepts common filter pumps, which are sold separately; wholesale buyers can add a sand filter system to orders.',
      },
      {
        q: 'What size filter pump do I need for a 4 m pool?',
        a: 'A Ø 4 × 1.2 m pool holds about 15,100 L at full fill. For a 2–4 hour turnover you want roughly 3,800–7,500 L/h of actual flow — check the pump’s flow under head, not its maximum rating.',
      },
      {
        q: 'Can I run the filter pump while people are in the pool?',
        a: 'Yes — the circulation flow through a 38 mm port is gentle and normal. Keep electrical connections dry, behind the pool, and on residual-current protection, as with any pool equipment.',
      },
    ],
    relatedProducts: ['round-blue-drop-stitch-pool', 'rectangular-drop-stitch-pool', 'round-grey-drop-stitch-pool'],
    relatedGuides: [
      'inflatable-pool-maintenance',
      'inflatable-pool-operating-costs',
      'how-to-clean-an-inflatable-pool',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
  {
    slug: 'drop-stitch-wall-thickness-explained',
    category: 'technology',
    title: 'Drop Stitch Pool Wall Thickness Explained: 10, 15, 20 and 50 cm',
    description:
      'What drop stitch wall thickness actually changes: rigidity, wall stability, packed size, weight and use case — and how to pick between the 10, 15, 20 and 50 cm factory options.',
    tldr: 'Wall thickness is the depth of the inflatable wall chamber, not the fabric weight. The 10 cm option builds compact plunge pools and kids’ sizes; 15 cm is the all-round standard across most pool and SPA sizes; 20 cm stiffens larger pools; the 50 cm option creates full-height walls for family swim pools and real soaking depth. Thicker walls pack heavier — but every option inflates to the same rigid 4–6 PSI.',
    problem:
      'Sellers quote wall thickness as a bigger-is-better number without explaining what it is — buyers either overpay for thickness they do not need or under-spec walls for the water depth they want.',
    solution:
      'Match thickness to water depth and use: shallow splash sizes run happily on 10 cm; standard family depths use 15 cm; larger diameters and taller water columns step up to 20 cm; the 50 cm walls exist where you want standing-depth water and a rigid wall you can lean on.',
    audience: 'Buyers comparing drop stitch pool specifications and wall options.',
    steps: [
      'What the number means: drop stitch walls are two PVC layers joined by thousands of internal threads; the “thickness” is the inflated chamber depth — the wall behaves like a rigid beam once at 4–6 PSI',
      '10 cm walls: the compact option — used on the Ø 2 × 0.5 m plunge pool and the Ø 2 × 0.8 m round SPA tub (RS2018); lowest packed weight (the Ø 2 m plunge packs at 18.4 kg)',
      '15 cm walls: the standard across most of the catalog — round pools from Ø 3 to Ø 10 m and most SPA tubs; the proven balance of rigidity, weight and packed size',
      '20 cm walls: the stiffening step for larger volumes — used where taller water columns need extra wall beam depth (for example the 4 × 3 × 1.2 m rectangular pool)',
      '50 cm walls: the full-height option on rectangular pools (4 × 3 up to 6 × 5 m) — walls tall and rigid enough for standing-depth family swimming; this is the closest an inflatable gets to a rigid pool wall',
      'Fabric weight is a different axis: wall thickness is chamber depth; the PVC layers and seam reinforcement are separate specs — a thick wall with thin fabric is still a bad wall',
      'Packed weight scales with thickness: check the packed weights on the wholesale price list before planning storage or shipping — thicker walls ship heavier',
      'Use-case shortcut: splash and plunge sizes 10 cm; standard family pool 15 cm; big-diameter or taller pools 20 cm; standing-depth rectangular swim pools 50 cm',
    ],
    faq: [
      {
        q: 'Do thicker walls mean more PSI?',
        a: 'No — every Felizbay pool inflates to the same recommended 4–6 PSI operating range regardless of wall thickness (QC test 6 PSI, maximum tolerance 8 PSI, relief valve above 6 PSI). Thickness changes wall beam depth, not pressure.',
      },
      {
        q: 'Why would I choose 50 cm walls?',
        a: 'For standing-depth swimming. The 50 cm wall rectangles (4 × 3 m up to 6 × 5 m) hold 1.2–1.5 m of water with walls rigid enough to lean against — a genuine swim-pool experience that still packs away.',
      },
      {
        q: 'Does wall thickness affect how long the pool lasts?',
        a: 'Lifespan is driven by fabric quality, UV exposure, seam construction and storage habits rather than chamber depth. Thickness affects rigidity and packed weight; material and care affect longevity.',
      },
    ],
    relatedProducts: ['rectangular-drop-stitch-pool', 'round-blue-drop-stitch-pool', 'hot-tub-round'],
    relatedGuides: [
      'what-is-a-drop-stitch-inflatable-pool',
      'how-strong-is-a-drop-stitch-inflatable-pool',
      'what-psi-should-an-inflatable-pool-use',
    ],
    difficulty: 'beginner',
    waterType: ['freshwater'],
  },
];
