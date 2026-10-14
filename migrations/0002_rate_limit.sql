-- Contact form rate limiting: fixed 1-hour window per IP, persisted in D1
-- so the limit is global across all worker isolates (unlike in-memory maps).
CREATE TABLE IF NOT EXISTS rate_limit (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_updated ON rate_limit (updated_at);