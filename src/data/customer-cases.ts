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

// 2026-11 third-party review (P0-C): the three draft sample stories were
// fabricated placeholders and have been removed. Only repopulate this array
// with real, verified customer cases (draft: false) with written permission.
export const CUSTOMER_CASES: CustomerCase[] = [];
