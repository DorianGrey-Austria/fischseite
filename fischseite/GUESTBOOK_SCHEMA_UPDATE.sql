-- 🐠 GUESTBOOK SCHEMA UPDATE: Fehlende Felder hinzufügen
-- Fix für guestbook.html Kompatibilität

-- 1. is_approved Feld hinzufügen (KRITISCH - wird von guestbook.html verwendet)
ALTER TABLE guestbook ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;

-- 2. Rate Limiting Support
ALTER TABLE guestbook ADD COLUMN IF NOT EXISTS ip_address INET;

-- 3. Erweiterte Features für moderne Gästebuch-Funktionalität
ALTER TABLE guestbook ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE guestbook ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE guestbook ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '{}';
ALTER TABLE guestbook ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES guestbook(id);
ALTER TABLE guestbook ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_guestbook_approved ON guestbook(is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_parent ON guestbook(parent_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_ip ON guestbook(ip_address);

-- 5. Rate Limiting Tabelle erstellen
CREATE TABLE IF NOT EXISTS guestbook_rate_limit (
    ip_address INET PRIMARY KEY,
    entry_count INT DEFAULT 1,
    first_entry TIMESTAMPTZ DEFAULT NOW(),
    last_entry TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Update Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_guestbook_updated_at ON guestbook;
CREATE TRIGGER update_guestbook_updated_at
    BEFORE UPDATE ON guestbook
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Existierende Einträge auf approved setzen
UPDATE guestbook SET is_approved = true WHERE is_approved IS NULL;

-- 8. RLS Policies updaten
DROP POLICY IF EXISTS "Allow public to read guestbook" ON guestbook;
DROP POLICY IF EXISTS "Allow public to insert guestbook" ON guestbook;

-- Neue Policies mit is_approved Support
CREATE POLICY "Allow public to read approved guestbook" ON guestbook
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Allow public to insert guestbook" ON guestbook
    FOR INSERT WITH CHECK (true);

-- Admin können alles sehen (für Moderation)
CREATE POLICY "Allow admin to see all guestbook" ON guestbook
    FOR ALL USING (auth.role() = 'service_role');

COMMENT ON TABLE guestbook IS 'Modernisiertes Gästebuch mit Spam-Schutz und Moderation';
COMMENT ON COLUMN guestbook.is_approved IS 'Moderation Flag - true = öffentlich sichtbar';
COMMENT ON COLUMN guestbook.reactions IS 'Emoji-Reaktionen als JSON: {"👍": 5, "❤️": 3}';
COMMENT ON COLUMN guestbook.parent_id IS 'Referenz für Antworten auf andere Einträge';