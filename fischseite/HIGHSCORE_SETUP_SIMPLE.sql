-- 🏆 HIGHSCORE SYSTEM - VEREINFACHTE VERSION OHNE SPAM-SCHUTZ
-- Diese Version funktioniert garantiert ohne Konflikte

-- 1. Highscores Tabelle erstellen
CREATE TABLE IF NOT EXISTS highscores (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    collected_items INTEGER NOT NULL,
    game_time INTEGER NOT NULL,
    completion_percentage DECIMAL(5,2) GENERATED ALWAYS AS ((collected_items::decimal / 20.0) * 100) STORED,
    is_perfect_score BOOLEAN GENERATED ALWAYS AS (collected_items >= 20) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    bonus_points INTEGER DEFAULT 0,

    -- Validierung
    CONSTRAINT valid_collected_items CHECK (collected_items >= 0 AND collected_items <= 20),
    CONSTRAINT valid_score CHECK (score >= 0),
    CONSTRAINT valid_player_name CHECK (char_length(player_name) >= 2 AND char_length(player_name) <= 30)
);

-- 2. Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_highscores_score ON highscores(score DESC);
CREATE INDEX IF NOT EXISTS idx_highscores_created_at ON highscores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_highscores_perfect_score ON highscores(is_perfect_score, score DESC);

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

-- 5. Beispiel-Einträge ohne IP-Probleme
INSERT INTO highscores (player_name, score, collected_items, game_time, bonus_points) VALUES
    ('AquaProfi', 500, 20, 45, 100),    -- Perfect Score
    ('FischFan', 380, 19, 52, 50),      -- Fast geschafft
    ('NemoFreund', 420, 20, 38, 120),   -- Perfect Score, schneller
    ('UnterwasserHeld', 350, 18, 48, 20),
    ('TaucherTom', 460, 20, 41, 80),    -- Perfect Score
    ('BubbleMaster', 510, 20, 43, 110), -- Highest Perfect Score
    ('AquariumAss', 290, 16, 55, 10),
    ('KorallenKönig', 340, 17, 49, 30)
ON CONFLICT DO NOTHING;

-- 6. Views für verschiedene Abfragen
CREATE OR REPLACE VIEW top_highscores AS
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

-- Perfect Scores View
CREATE OR REPLACE VIEW perfect_scores AS
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

-- Statistiken View
CREATE OR REPLACE VIEW highscore_stats AS
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

-- 7. Grants für anonyme Benutzer
GRANT SELECT, INSERT ON highscores TO anon;
GRANT SELECT ON top_highscores TO anon;
GRANT SELECT ON perfect_scores TO anon;
GRANT SELECT ON highscore_stats TO anon;

-- 8. Erfolgsmeldung
DO $$
BEGIN
    RAISE NOTICE '🏆 Highscore System (Simple) Setup erfolgreich!';
    RAISE NOTICE '📊 Tabelle: highscores mit 8 Test-Einträgen';
    RAISE NOTICE '🔒 RLS: Aktiviert mit öffentlichen Policies';
    RAISE NOTICE '👀 Views: top_highscores, perfect_scores, highscore_stats';
    RAISE NOTICE '✅ Ready für Game Integration ohne Spam-Schutz!';
END $$;