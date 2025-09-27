-- 🔧 FIX RLS POLICIES für Gästebuch
-- Problem: Insert wird durch Row Level Security blockiert

-- 1. Aktuelle Policies löschen
DROP POLICY IF EXISTS "Allow public to read guestbook" ON guestbook;
DROP POLICY IF EXISTS "Allow public to insert guestbook" ON guestbook;
DROP POLICY IF EXISTS "Allow public to read approved guestbook" ON guestbook;
DROP POLICY IF EXISTS "Allow admin to see all guestbook" ON guestbook;

-- 2. Neue, funktionierende Policies erstellen

-- Lesen: Nur genehmigte Einträge für die Öffentlichkeit
CREATE POLICY "public_read_approved" ON guestbook
    FOR SELECT USING (is_approved = true);

-- Einfügen: Jeder kann neue Einträge erstellen (werden als nicht genehmigt markiert)
CREATE POLICY "public_insert_pending" ON guestbook
    FOR INSERT WITH CHECK (
        -- Neue Einträge werden automatisch als nicht genehmigt markiert
        is_approved = false OR is_approved IS NULL
    );

-- Update: Nur für Service Role (Admins können Einträge genehmigen)
CREATE POLICY "admin_update_approval" ON guestbook
    FOR UPDATE USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Delete: Nur für Service Role
CREATE POLICY "admin_delete" ON guestbook
    FOR DELETE USING (auth.role() = 'service_role');

-- 3. RLS Status prüfen und aktivieren falls nötig
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- 4. Test-Views für bessere Verwaltung
CREATE OR REPLACE VIEW guestbook_pending AS
SELECT * FROM guestbook WHERE is_approved = false OR is_approved IS NULL
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW guestbook_approved AS
SELECT * FROM guestbook WHERE is_approved = true
ORDER BY created_at DESC;

-- 5. Function für automatische Genehmigung (optional)
CREATE OR REPLACE FUNCTION auto_approve_guestbook_entry()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-approve für bestimmte Kriterien (optional)
    -- Aktuell: Alle Einträge müssen manuell genehmigt werden
    NEW.is_approved = false;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für automatische Verarbeitung neuer Einträge
DROP TRIGGER IF EXISTS guestbook_auto_approve ON guestbook;
CREATE TRIGGER guestbook_auto_approve
    BEFORE INSERT ON guestbook
    FOR EACH ROW
    EXECUTE FUNCTION auto_approve_guestbook_entry();

COMMENT ON POLICY "public_read_approved" ON guestbook IS 'Öffentlichkeit kann nur genehmigte Einträge lesen';
COMMENT ON POLICY "public_insert_pending" ON guestbook IS 'Jeder kann neue Einträge erstellen (pending approval)';
COMMENT ON VIEW guestbook_pending IS 'Alle noch nicht genehmigten Einträge für Moderation';
COMMENT ON VIEW guestbook_approved IS 'Alle öffentlich sichtbaren Einträge';