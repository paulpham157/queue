CREATE TABLE IF NOT EXISTS leads (
    id          TEXT PRIMARY KEY,
    name        TEXT,
    email       TEXT,
    company     TEXT,
    source      TEXT,
    message     TEXT,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);