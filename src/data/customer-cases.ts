export interface CustomerCase {
  slug: string;
  name: string;
  location: string;
  pool: string;
  size: string;
  photo: string;
  photoAlt: string;
  story: string;
  /** Draft sample story — must be replaced with a verified customer case before removing the badge. */
  draft: boolean;
}

export const CUSTOMER_CASES: CustomerCase[] = [
  {
    slug: 'austin-round-grey-family',
    name: 'Sarah & Tom H.',
    location: 'Austin, TX',
    pool: 'Round Grey Drop Stitch Pool',
    size: 'Ø 3.0 m',
    photo: '/images/pools/round-grey-pool-2.webp',
    photoAlt: 'Family enjoying a round grey Felizbay drop stitch pool on a backyard lawn',
    story:
      'We set the pool up on a Saturday morning and the kids were swimming by lunch. The walls inflate rock-hard — nothing like the wobbly ring pool we used to have. Come fall it dried, rolled up, and went into the storage bag.',
    draft: true,
  },
  {
    slug: 'portland-rectangular-couple',
    name: 'Elena & Marco',
    location: 'Portland, OR',
    pool: 'Rectangular Drop Stitch Pool',
    size: '3.5 × 2.5 m',
    photo: '/images/pools/rectangular-pool-3.webp',
    photoAlt: 'Rectangular Felizbay drop stitch pool set up in a narrow side yard with a lounge chair beside it',
    story:
      'Our side yard is narrow, so the straight sides were the whole reason we picked the rectangular model. It fits with room for a lounge chair beside it, and I get my morning laps in before work.',
    draft: true,
  },
  {
    slug: 'tampa-round-blue-family',
    name: 'The Nguyen Family',
    location: 'Tampa, FL',
    pool: 'Round Blue Drop Stitch Pool',
    size: 'Ø 4.6 m',
    photo: '/images/pools/round-blue-pool-1.webp',
    photoAlt: 'Round blue Felizbay drop stitch pool filled with water in a sunny backyard during a family gathering',
    story:
      'We host nearly every weekend in summer, and the 4.6 m size fits four adults and a pile of grandkids comfortably. The fitted cover keeps the water clean between swims — worth every penny.',
    draft: true,
  },
];
