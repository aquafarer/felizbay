export interface BusinessProductInfo {
  bestFor: ('families' | 'retailers' | 'oem')[];
  recommendation: string;
  useCase: string;
  operatingCost: string;
  whyBusinessesChooseIt: string;
  lifespan: string;
}

export const productBusinessData: Record<string, BusinessProductInfo> = {
  'rectangular-drop-stitch-pool': {
    bestFor: ['families', 'retailers', 'oem'],
    recommendation:
      'The largest pool in the range — ideal for families who want room to actually swim and for retailers targeting the premium backyard segment. Rigid drop stitch walls hold their shape at full fill, and the rectangular footprint suits lap swimming.',
    useCase: 'Backyard family swimming, lap swimming, larger groups, retail flagship SKU',
    operatingCost: 'Low — standard chlorine and filter cartridges; no tools or permanent installation',
    whyBusinessesChooseIt:
      'A premium, high-margin SKU that ships flat and stores compactly. Fast 30-minute setup is a strong selling point, and the fold-away design appeals to customers who cannot commit to a permanent pool.',
    lifespan: '5+ seasons with basic care',
  },
  'round-blue-drop-stitch-pool': {
    bestFor: ['families', 'retailers'],
    recommendation:
      'The classic family pool. The round shape fits smaller yards, sets up in under 20 minutes, and the bold blue finish photographs well for retail listings and seasonal promotions.',
    useCase: 'Family fun, kids summer swimming, small to medium backyards',
    operatingCost: 'Low — smaller water volume means less chemicals and faster heating',
    whyBusinessesChooseIt:
      'The best-selling shape in the category. Compact shipping keeps logistics costs down, and the approachable price point moves volume through both e-commerce and brick-and-mortar channels.',
    lifespan: '5+ seasons with basic care',
  },
  'round-grey-drop-stitch-pool': {
    bestFor: ['families', 'retailers', 'oem'],
    recommendation:
      'A modern, understated grey pool that ships with a fitted debris cover. The neutral finish suits design-conscious buyers and premium retail lineups, and the included cover adds value at the same price tier.',
    useCase: 'Premium backyard setup, design-conscious buyers, gift and premium retail channels',
    operatingCost: 'Low — included cover cuts cleaning time and chemical loss between swims',
    whyBusinessesChooseIt:
      'Differentiates from the sea of blue pools at retail. The bundled cover improves customer satisfaction scores and reduces support tickets about water care.',
    lifespan: '5+ seasons with basic care',
  },
};
