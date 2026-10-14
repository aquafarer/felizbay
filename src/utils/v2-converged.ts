import convergedMap from '../config/v2-redirects.json';

export const V2_CONVERGED_SLUGS: Set<string> = new Set(
  Object.keys(convergedMap)
    .filter((k) => k.startsWith('/v2/'))
    .map((k) => k.replace(/^\/v2\//, '').replace(/\/$/, ''))
);
