-- Pool Advisor (find-your-pool) anonymous selection events — the GEO KPI
-- source for recommendation click rate and no-match rate. No PII: only coarse
-- answer buckets (use / space / who / install / climate / purpose / dims).
-- Retention: purged 180 days after insert by the automation worker's daily
-- cleanup (workers/automation-worker/src/db-cleanup.ts).
CREATE TABLE IF NOT EXISTS advisor_event (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL CHECK (event_type IN ('quiz_filter', 'result_click', 'no_match')),
  product_slug TEXT,
  lang TEXT NOT NULL DEFAULT 'en',
  answers TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS advisor_event_type_created_idx ON advisor_event (event_type, created_at);
CREATE INDEX IF NOT EXISTS advisor_event_created_idx ON advisor_event (created_at);
