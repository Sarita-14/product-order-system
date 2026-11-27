// ─────────────────────────────────────────────────────────────────────────────
// FILE: config/timezone.ts — run the backend in UTC. Imported FIRST by main.ts
// (the app) and database/data-source.ts (the migration tool).
//
// Why: our date columns are "timestamp" (they store no timezone) and the database
// writes them in UTC. Node reads such a value in ITS OWN timezone; on a computer set
// to India time (IST, UTC+5:30) every date came out 5½ hours early. With the backend
// in UTC too, both sides agree, and the API sends correct times ("...Z" = UTC).
// The website then shows them in Indian time (see frontend/src/lib/format.ts).
// ─────────────────────────────────────────────────────────────────────────────

// process.env.TZ = the timezone Node uses for dates. Set before any date is read.
process.env.TZ = 'UTC';
