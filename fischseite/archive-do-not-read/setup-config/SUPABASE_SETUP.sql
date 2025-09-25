-- 🐠 SUPABASE SETUP FÜR AQUARISTIKFREUNDE GÄSTEBUCH
-- Diese SQL-Befehle in der Supabase SQL-Konsole ausführen

-- 1. Gästebuch Tabelle erstellen
CREATE TABLE guestbook (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    avatar_emoji VARCHAR(10) DEFAULT '🐠',

    -- Zusätzliche Felder für Moderation (optional)
    is_approved BOOLEAN DEFAULT true,
    ip_address INET,
    user_agent TEXT
);

-- 2. Indizes für bessere Performance
CREATE INDEX idx_guestbook_created_at ON guestbook(created_at DESC);
CREATE INDEX idx_guestbook_approved ON guestbook(is_approved);

-- 3. Row Level Security aktivieren
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- 4. Policies für öffentlichen Zugriff erstellen

-- Policy für Lesen (alle können Einträge lesen)
CREATE POLICY "Allow public to read approved guestbook entries" ON guestbook
    FOR SELECT USING (is_approved = true);

-- Policy für Einfügen (alle können Einträge erstellen)
CREATE POLICY "Allow public to insert guestbook entries" ON guestbook
    FOR INSERT WITH CHECK (
        char_length(name) >= 2 AND
        char_length(name) <= 50 AND
        char_length(message) >= 5 AND
        char_length(message) <= 500
    );

-- 5. Beispiel-Einträge (optional)
INSERT INTO guestbook (name, message, avatar_emoji) VALUES
    ('Aquaristikfreunde Steiermark', 'Willkommen in unserem Gästebuch! Wir freuen uns auf eure Einträge und Erfahrungen aus der Aquaristik-Welt! 🐠', '🐟'),
    ('Mario Lanz', 'Tolle Website! Meine Skalare fühlen sich hier zuhause. Nach 8 Jahren Zucht kann ich sagen: Die Community hier ist einzigartig!', '🦈'),
    ('Test User', 'Fantastische Aquarium-Spiele! Das Futter-Sammeln macht süchtig. Wer schafft alle 20 Items? 🎮', '🐡');

-- 6. Funktionen für Moderation (optional)

-- Funktion um Einträge zu moderieren
CREATE OR REPLACE FUNCTION moderate_guestbook_entry(entry_id INTEGER, approved BOOLEAN)
RETURNS VOID AS $$
BEGIN
    UPDATE guestbook
    SET is_approved = approved
    WHERE id = entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion um Spam zu melden
CREATE OR REPLACE FUNCTION report_spam(entry_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE guestbook
    SET is_approved = false
    WHERE id = entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger für automatische Moderation (optional)

-- Funktion für automatische Spam-Erkennung
CREATE OR REPLACE FUNCTION check_spam_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Einfache Spam-Erkennung
    IF NEW.message ILIKE '%spam%' OR
       NEW.message ILIKE '%casino%' OR
       NEW.message ILIKE '%viagra%' OR
       NEW.name ILIKE '%admin%' THEN
        NEW.is_approved = false;
    END IF;

    -- IP-Adresse speichern (falls verfügbar)
    NEW.ip_address = inet_client_addr();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger erstellen
CREATE TRIGGER trigger_check_spam
    BEFORE INSERT ON guestbook
    FOR EACH ROW
    EXECUTE FUNCTION check_spam_content();

-- 8. Views für bessere Datenabfrage

-- View für öffentliche Anzeige
CREATE VIEW public_guestbook AS
SELECT
    id,
    name,
    message,
    avatar_emoji,
    created_at,
    extract(epoch from created_at) as timestamp
FROM guestbook
WHERE is_approved = true
ORDER BY created_at DESC;

-- View für Statistiken
CREATE VIEW guestbook_stats AS
SELECT
    COUNT(*) as total_entries,
    COUNT(*) FILTER (WHERE is_approved = true) as approved_entries,
    COUNT(*) FILTER (WHERE is_approved = false) as pending_entries,
    COUNT(DISTINCT avatar_emoji) as unique_avatars,
    MAX(created_at) as latest_entry,
    AVG(char_length(message)) as avg_message_length
FROM guestbook;

-- 9. Backup und Cleanup Funktionen

-- Funktion für automatische Bereinigung alter Einträge (nach 1 Jahr)
CREATE OR REPLACE FUNCTION cleanup_old_entries()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM guestbook
    WHERE created_at < NOW() - INTERVAL '1 year'
    AND is_approved = false;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 10. Grants für anonyme Benutzer (bereits durch Policies abgedeckt)

-- Anonyme Benutzer können lesen und einfügen (durch RLS Policies kontrolliert)
GRANT SELECT, INSERT ON guestbook TO anon;
GRANT SELECT ON public_guestbook TO anon;
GRANT SELECT ON guestbook_stats TO anon;

-- 11. Benachrichtigungen (optional - für Webhook Integration)

-- Funktion für neue Einträge
CREATE OR REPLACE FUNCTION notify_new_guestbook_entry()
RETURNS TRIGGER AS $$
BEGIN
    -- Webhook-URL oder Email-Benachrichtigung hier einfügen
    PERFORM pg_notify('new_guestbook_entry',
        json_build_object(
            'id', NEW.id,
            'name', NEW.name,
            'message', LEFT(NEW.message, 50) || '...',
            'created_at', NEW.created_at
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für Benachrichtigungen
CREATE TRIGGER trigger_notify_new_entry
    AFTER INSERT ON guestbook
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_guestbook_entry();

-- 12. Erfolgsmeldung
DO $$
BEGIN
    RAISE NOTICE '🎉 Supabase Gästebuch Setup erfolgreich abgeschlossen!';
    RAISE NOTICE '📊 Tabelle: guestbook';
    RAISE NOTICE '🔒 RLS: Aktiviert';
    RAISE NOTICE '👀 Views: public_guestbook, guestbook_stats';
    RAISE NOTICE '🛡️ Spam-Schutz: Aktiviert';
    RAISE NOTICE '📧 Benachrichtigungen: Aktiviert';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Nächste Schritte:';
    RAISE NOTICE '1. Credentials in guestbook.html eintragen';
    RAISE NOTICE '2. Website testen';
    RAISE NOTICE '3. Optional: Webhook für Benachrichtigungen einrichten';
END $$;