-- 🚨 TEMPORARY: RLS Deaktivieren für Gästebuch-Tests
-- Nur für Entwicklung/Testing - NICHT für Production!

-- RLS temporär deaktivieren
ALTER TABLE guestbook DISABLE ROW LEVEL SECURITY;

-- Alle aktuellen Policies löschen
DROP POLICY IF EXISTS "Allow public to read guestbook" ON guestbook;
DROP POLICY IF EXISTS "Allow public to insert guestbook" ON guestbook;
DROP POLICY IF EXISTS "Allow public to read approved guestbook" ON guestbook;
DROP POLICY IF EXISTS "public_read_approved" ON guestbook;
DROP POLICY IF EXISTS "public_insert_pending" ON guestbook;
DROP POLICY IF EXISTS "admin_update_approval" ON guestbook;
DROP POLICY IF EXISTS "admin_delete" ON guestbook;

-- Simple Policies für Development
CREATE POLICY "allow_all_select" ON guestbook FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON guestbook FOR INSERT WITH CHECK (true);

-- RLS wieder aktivieren
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- Test-Anweisung
SELECT 'RLS Policies updated for development' as status;