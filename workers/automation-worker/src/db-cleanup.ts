const RATE_LIMIT_RETENTION_SECONDS = 30 * 24 * 3600;

// better-auth's `rateLimit` table (camelCase, distinct from the contact
// worker's `rate_limit`): the limiter treats a row as expired once
// now - last_request exceeds its short (~60s) window and overwrites it on the
// next request — rows untouched for 24h are pure cruft. last_request is epoch ms.
const AUTH_RATE_LIMIT_STALE_MS = 24 * 60 * 60 * 1000;

export async function dbCleanup(env: { DB: D1Database }) {
  const nowMs = Date.now();
  const results = await Promise.all([
    env.DB.prepare('DELETE FROM session WHERE expires_at < ?1').bind(nowMs).run(),
    env.DB.prepare('DELETE FROM verification WHERE expires_at < ?1').bind(nowMs).run(),
    env.DB.prepare('DELETE FROM rate_limit WHERE updated_at < unixepoch() - ?1')
      .bind(RATE_LIMIT_RETENTION_SECONDS)
      .run(),
    env.DB.prepare('DELETE FROM `rateLimit` WHERE last_request IS NOT NULL AND last_request < ?1')
      .bind(nowMs - AUTH_RATE_LIMIT_STALE_MS)
      .run(),
  ]);
  return {
    sessionsExpired: results[0].meta.changes,
    verificationsExpired: results[1].meta.changes,
    rateLimitPurged: results[2].meta.changes,
    authRateLimitPurged: results[3].meta.changes,
  };
}
