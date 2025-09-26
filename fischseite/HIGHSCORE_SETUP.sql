-- 🏆 HIGHSCORE SYSTEM FÜR AQUARIUM COLLECTOR GAME
-- Diese SQL-Befehle in der Supabase SQL-Konsole ausführen

-- 1. Highscores Tabelle erstellen
CREATE TABLE highscores (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    collected_items INTEGER NOT NULL,
    game_time INTEGER NOT NULL,
    completion_percentage DECIMAL(5,2) GENERATED ALWAYS AS ((collected_items::decimal / 20.0) * 100) STORED,
    is_perfect_score BOOLEAN GENERATED ALWAYS AS (collected_items >= 20) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Zusätzliche Felder für Tracking
    game_duration_actual INTEGER, -- tatsächliche Spielzeit in Sekunden
    bonus_points INTEGER DEFAULT 0,
    ip_address INET,

    -- Validierung
    CONSTRAINT valid_collected_items CHECK (collected_items >= 0 AND collected_items <= 20),
    CONSTRAINT valid_score CHECK (score >= 0),
    CONSTRAINT valid_player_name CHECK (char_length(player_name) >= 2 AND char_length(player_name) <= 30)
);

-- 2. Indizes für bessere Performance
CREATE INDEX idx_highscores_score ON highscores(score DESC);
CREATE INDEX idx_highscores_created_at ON highscores(created_at DESC);
CREATE INDEX idx_highscores_perfect_score ON highscores(is_perfect_score, score DESC);
CREATE INDEX idx_highscores_completion ON highscores(completion_percentage DESC, score DESC);

-- 3. Row Level Security aktivieren
ALTER TABLE highscores ENABLE ROW LEVEL SECURITY;

-- 4. Policies für öffentlichen Zugriff erstellen

-- Policy für Lesen (alle können Highscores lesen)
CREATE POLICY "Allow public to read highscores" ON highscores
    FOR SELECT USING (true);

-- Policy für Einfügen (alle können Highscores erstellen mit Validierung)
CREATE POLICY "Allow public to insert highscores" ON highscores
    FOR INSERT WITH CHECK (
        char_length(player_name) >= 2 AND
        char_length(player_name) <= 30 AND
        score >= 0 AND
        collected_items >= 0 AND collected_items <= 20 AND
        game_time > 0
    );

-- 5. Views für verschiedene Abfragen

-- Top Highscores (allgemein)
CREATE VIEW top_highscores AS
SELECT
    id,
    player_name,
    score,
    collected_items,
    completion_percentage,
    is_perfect_score,
    created_at,
    RANK() OVER (ORDER BY score DESC, created_at ASC) as rank_position
FROM highscores
ORDER BY score DESC, created_at ASC;

-- Perfect Scores (20/20 Items)
CREATE VIEW perfect_scores AS
SELECT
    id,
    player_name,
    score,
    collected_items,
    game_time,
    created_at,
    RANK() OVER (ORDER BY score DESC, game_time ASC, created_at ASC) as rank_position
FROM highscores
WHERE is_perfect_score = true
ORDER BY score DESC, game_time ASC, created_at ASC;

-- Recent Highscores (letzte 24 Stunden)
CREATE VIEW recent_highscores AS
SELECT
    id,
    player_name,
    score,
    collected_items,
    completion_percentage,
    is_perfect_score,
    created_at,
    RANK() OVER (ORDER BY score DESC, created_at ASC) as rank_position
FROM highscores
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY score DESC, created_at ASC;

-- Statistiken View
CREATE VIEW highscore_stats AS
SELECT
    COUNT(*) as total_games,
    COUNT(*) FILTER (WHERE is_perfect_score = true) as perfect_scores_count,
    ROUND(AVG(score), 2) as average_score,
    MAX(score) as highest_score,
    ROUND(AVG(completion_percentage), 2) as average_completion,
    COUNT(DISTINCT player_name) as unique_players,
    MIN(created_at) as first_game,
    MAX(created_at) as latest_game
FROM highscores;

-- 6. Funktionen für Spiellogik

-- Funktion um Player-Rank zu ermitteln
CREATE OR REPLACE FUNCTION get_player_rank(player_score INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) + 1
        FROM highscores
        WHERE score > player_score
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion für Top-N Scores
CREATE OR REPLACE FUNCTION get_top_scores(limit_count INTEGER DEFAULT 50)
RETURNS TABLE(
    rank_position INTEGER,
    player_name VARCHAR(50),
    score INTEGER,
    collected_items INTEGER,
    completion_percentage DECIMAL(5,2),
    is_perfect_score BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ROW_NUMBER() OVER (ORDER BY h.score DESC, h.created_at ASC)::INTEGER as rank_position,
        h.player_name,
        h.score,
        h.collected_items,
        h.completion_percentage,
        h.is_perfect_score,
        h.created_at
    FROM highscores h
    ORDER BY h.score DESC, h.created_at ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger für automatische Bereinigung und Validierung

-- Funktion für automatische IP-Adresse Speicherung
CREATE OR REPLACE FUNCTION set_player_ip()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ip_address = inet_client_addr();

    -- Einfache Spam-Prävention: Max 5 Einträge pro IP pro Stunde
    IF (
        SELECT COUNT(*)
        FROM highscores
        WHERE ip_address = NEW.ip_address
        AND created_at >= NOW() - INTERVAL '1 hour'
    ) >= 5 THEN
        RAISE EXCEPTION 'Too many submissions from this IP address. Please wait before submitting again.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger erstellen
CREATE TRIGGER trigger_set_player_ip
    BEFORE INSERT ON highscores
    FOR EACH ROW
    EXECUTE FUNCTION set_player_ip();

-- 8. Beispiel-Einträge für Testing
INSERT INTO highscores (player_name, score, collected_items, game_time, bonus_points) VALUES
    ('AquaProfi', 500, 20, 45, 100),  -- Perfect Score
    ('FischFan', 380, 19, 52, 50),    -- Fast schafft
    ('NemoFreund', 420, 20, 38, 120), -- Perfect Score, schneller
    ('UnterwasserHeld', 350, 18, 48, 20),
    ('TaucherTom', 460, 20, 41, 80),  -- Perfect Score
    ('AquariumAss', 290, 16, 55, 10),
    ('BubbleMaster', 510, 20, 43, 110), -- Highest Perfect Score
    ('KorallenKönig', 340, 17, 49, 30);

-- 9. Grants für anonyme Benutzer
GRANT SELECT ON highscores TO anon;
GRANT INSERT ON highscores TO anon;
GRANT SELECT ON top_highscores TO anon;
GRANT SELECT ON perfect_scores TO anon;
GRANT SELECT ON recent_highscores TO anon;
GRANT SELECT ON highscore_stats TO anon;
GRANT EXECUTE ON FUNCTION get_player_rank(INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_top_scores(INTEGER) TO anon;

-- 10. Bereinigungsfunktion für alte Einträge/model
CREATE OR REPLACE FUNCTION cleanup_old_scores()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Behalte nur die Top 1000 Scores, lösche ältere niedrige Scores
    DELETE FROM highscores
    WHERE id NOT IN (
        SELECT id
        FROM highscores
        ORDER BY score DESC, created_at ASC
        LIMIT 1000
    );

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 11. Erfolgsmeldung
DO $$
BEGIN
    RAISE NOTICE '🏆 Highscore System Setup erfolgreich abgeschlossen!';
    RAISE NOTICE '📊 Tabelle: highscores mit Validierung und Indizes';
    RAISE NOTICE '🔒 RLS: Aktiviert mit öffentlichen Policies';
    RAISE NOTICE '👀 Views: top_highscores, perfect_scores, recent_highscores, highscore_stats';
    RAISE NOTICE '🛡️ Spam-Schutz: Max 5 Einträge pro IP/Stunde';
    RAISE NOTICE '🎮 Beispiel-Daten: 8 Test-Highscores eingefügt';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Ready für Game Integration!';
    RAISE NOTICE '1. JavaScript Supabase Client verwenden';
    RAISE NOTICE '2. Perfect Score Detection implementieren';
    RAISE NOTICE '3. Highscore Display System erstellen';
END $$;