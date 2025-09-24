# 🐠 Supabase Database Roadmap - Fischseite

## Phase 1: Core Database Features (Aktuell)

### 1. Guestbook System
- **Zweck**: Besucher können Nachrichten hinterlassen
- **Features**:
  - Name, E-Mail, Nachricht
  - Timestamp automatisch
  - Moderation möglich
- **Status**: Vorbereitung

### 2. Highscore System
- **Zweck**: Aquarium Collector Game Highscores
- **Features**:
  - Spieler Name, Score, Items gesammelt
  - Completion Percentage berechnet
  - Perfect Score Detection (20/20 Items)
  - IP-basierte Rate Limiting
- **Status**: Schema vorhanden (HIGHSCORE_SETUP.sql)

## Phase 2: Erweiterte Features (Geplant)

### 3. User-Generated Fish Content
- **Zweck**: Vereinsmitglieder können eigene Fische hochladen
- **Workflow**:
  1. **Upload**: Foto von echtem Fisch hochladen
  2. **Background Removal**: Automatische Hintergrundentfernung (AI)
  3. **Icon Generation**: Umwandlung zu SVG/PNG Icon
  4. **Integration**: Fisch wird in Spawner-System verfügbar

- **Technische Requirements**:
  - File Upload zu Supabase Storage
  - Background Removal API (Remove.bg oder selbst gehostet)
  - Image Processing Pipeline
  - Icon-Generation (Canvas API)
  - Fish-Database mit Metadaten
  - Approval-System für Moderation

- **Database Schema (Geplant)**:
```sql
-- User-Generated Fish Table
CREATE TABLE user_fish (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    fish_name VARCHAR(100) NOT NULL,
    original_image_url TEXT NOT NULL,
    processed_icon_url TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by VARCHAR(50),

    -- Fish Properties für Spawner
    swim_speed INTEGER DEFAULT 2,
    color_scheme VARCHAR(20) DEFAULT 'tropical',
    size_category VARCHAR(10) DEFAULT 'medium'
);
```

## Technische Architektur

### MCP Integration
- Supabase MCP Server für Datenbankzugriff
- Automatisierte Schema-Updates über Claude Code
- Real-time Updates über Supabase Realtime

### Security & Performance
- Row Level Security (RLS) aktiviert
- Rate Limiting pro Feature
- Image Processing in Supabase Edge Functions
- CDN für optimierte Asset-Delivery

### Development Workflow
1. Schema-Änderungen über SQL-Dateien
2. MCP-Testing über Claude Code
3. Frontend-Integration über JavaScript Module
4. Deployment über Git → Hosting Provider

## Timeline

**Phase 1** (Nächste Wochen):
- [x] Highscore Schema erstellen
- [ ] Guestbook Schema erstellen
- [ ] MCP Verbindung testen
- [ ] Frontend Integration testen

**Phase 2** (Später):
- [ ] User Fish Upload System
- [ ] AI Background Removal
- [ ] Icon Generation Pipeline
- [ ] Approval System für Moderation