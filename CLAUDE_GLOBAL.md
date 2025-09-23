# CLAUDE_GLOBAL.md - Globale Richtlinien für alle Claude Code Projekte

Dieses Dokument enthält übergreifende Best Practices, Regeln und Erkenntnisse für alle Projekte im `/coding` Verzeichnis.

## 📚 Inhaltsverzeichnis
1. [MCP (Model Context Protocol)](#mcp-model-context-protocol)
2. [Docker Integration](#docker-integration)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [Testing & Selbsttest](#testing--selbsttest)
6. [DB Method](#db-method)
7. [BMAD Method](#bmad-method)
8. [Agents & Subagents](#agents--subagents)
9. [Claude Code Tipps](#claude-code-tipps)
10. [Troubleshooting](#troubleshooting)

---

## 🎮 AKTIVE PROJEKTE ÜBERSICHT

### 1. EndlessRunner (Subway Runner 3D)
**URL**: 🌐 https://ki-revolution.at/  
**Status**: V5.3.35 - In aktiver Entwicklung  
**Tech Stack**: Vanilla JS, Three.js v0.150.0, MediaPipe Face Mesh  
**Features**:
- Browser-basiertes 3D Endless Runner Spiel
- Gesture Control via Webcam (3-Lane System funktional)
- 10 einzigartige Welten mit verschiedenen Obstacles
- Power-Ups: Shield, Magnet, 2x Score
- Leaderboard mit Supabase Backend
- Auto-Deploy via GitHub Actions

**Aktueller Fokus**: Fixing vertical gestures (Jump/Duck) mit ultra-sensitiven Boundaries

### 2. Zeichenapp (JOE FLOW APP 2025)  
**URL**: 🌐 https://ai-workflows.at/  
**Status**: Production mit kontinuierlichen Updates  
**Tech Stack**: HTML5 Canvas, Supabase, Print-on-Demand APIs  
**Features**:
- Web-basierte Drawing/Design App
- 100+ Tools und Effekte
- Print-on-Demand Integration (Printful)
- User Authentication & Gallery
- Cloud-Speicherung der Kunstwerke

### 3. VetScan Pro 3000 (Educational Veterinary Game)
**URL**: 🌐 https://vibecoding.company/  
**Status**: V7.0.2 - Beta mit 3D-Features  
**Tech Stack**: Vanilla JS, Three.js r128, React 18 (Vite), GitHub Actions  
**Features**:
- 10+ Standalone HTML Versionen (keine Build-Tools nötig)
- **3D Medical Scanner**: X-Ray, Ultrasound, Thermal, MRI Modi
- **Educational Focus**: Dr. Eule Mentor-System mit Lerneffekt
- **Progressive Loading**: Multi-Quality GLB (High/Medium/Low)
- **Auto-Deploy**: GitHub Actions → Hostinger FTP
- **Versionen**: Detective (⭐ EMPFOHLEN), Story Mode, Professional, Missions
- **200+ Tiere**: Medizinische Enzyklopädie mit realistischen Werten

**Aktueller Fokus**: Blender MCP Integration für echte 3D-Modelle

### 4. Claude Mobile (Claude-to-Mobile Bridge)
**URL**: Local Development  
**Status**: Experimental  
**Tech Stack**: Node.js, WebSocket, React Native  
**Features**:
- Mobile Control für Claude Desktop
- WebSocket-basierte Kommunikation
- Remote Command Execution
- File Sync zwischen Desktop und Mobile
- Voice Input Integration

---

## 🚦 PROJECT ROUTING & CONTEXT SWITCHING

### ⚠️ Problem: Projekt-Vermischung vermeiden

**HÄUFIGES PROBLEM**: Anfragen über EndlessRunner im VetScan Pro Projekt oder umgekehrt!

#### Sofortige Erkennung von Projekt-Fehlzuordnungen:
| Erwähnte Inhalte | Gehört zu Projekt | Korrekte URL |
|------------------|-------------------|--------------|
| Endless Runner, Gesture Control, MediaPipe, Subway Runner | **EndlessRunner** | https://ki-revolution.at |
| VetScan Pro, Tierarzt, Bello, Dr. Eule, Medical Scanner | **VetScan Pro** | https://vibecoding.company |
| JOE FLOW APP, Zeichenapp, Canvas, Print-on-Demand | **Zeichenapp** | https://ai-workflows.at |
| Claude Mobile, WebSocket, Mobile Bridge | **Claude Mobile** | Local Development |

### 🔄 ROUTING-WORKFLOW (IMMER BEFOLGEN!)

#### Wenn falsche Projekt-Zuordnung erkannt:

1. **STOP** - Keine Änderungen am aktuellen Projekt!
2. **ROUTE** - Nachricht in CLAUDE_PROJECT_ROUTER.md speichern
3. **INFORM** - User über Routing informieren
4. **REDIRECT** - Zum korrekten Projekt wechseln

```bash
# Beispiel: EndlessRunner Anfrage im VetScan Pro Projekt
echo "🎮 ROUTING: EndlessRunner Gesture Control Problem
Schwarzer Bildschirm trotz funktionierender Gestenerkennung
Benötigt: Troubleshooting der Game-Engine Initialisierung
Timestamp: $(date)" >> /Users/doriangrey/Desktop/coding/CLAUDE_PROJECT_ROUTER.md
```

### 🎯 PROJEKT-IDENTIFIER & URL-MAPPINGS (Erweitert)

#### 🎮 EndlessRunner (Subway Runner 3D) - VOLLSTÄNDIG
- **Pfad**: `/Users/doriangrey/Desktop/coding/EndlessRunner/SubwayRunner/`
- **Domain**: 🌐 https://ki-revolution.at
- **Keywords**: Endless Runner, MediaPipe, Three.js r0.150.0, Gesture Control, Webcam, FPS, WebGL
- **Technische Details**: Vanilla JS, Face Mesh Detection, 3-Lane System, Power-Ups
- **Status**: V5.3.35+ - Aktive Entwicklung
- **Typische Issues**: Console Performance, Gesture Boundaries, WebGL Context, Race Conditions
- **Erkennungsmerkmale**: 
  - Screenshot mit 3D-Spiel und grünem Gesture Debug Panel
  - Mentions: "Springen", "Dücken", "links", "rechts"
  - Console Errors: "X-failed to start session"

#### 🏥 VetScan Pro 3000 (Educational Veterinary Game) - VOLLSTÄNDIG  
- **Pfad**: `/Users/doriangrey/Desktop/coding/tierarztspiel/`
- **Domain**: 🌐 https://vibecoding.company
- **Keywords**: VetScan, Tierarzt, Bello, Dr. Eule, Medical Scanner, GLB, X-Ray, Ultrasound, Thermal, MRI
- **Technische Details**: Three.js r128, React 18, Blender MCP, Progressive Loading
- **Status**: V7.0.2 - Beta mit 3D Medical Visualization
- **Typische Issues**: CDN Loading, Three.js Namespace, Blender Pipeline, Model Loading
- **Erkennungsmerkmale**:
  - Mentions: "Tierarzt", "Bello", "Dr. Eule", "Scanner", "Herz", "Temperatur"
  - 3D-Tiermofmelle, Medical Shaders, Educational Content

#### 🎨 Zeichenapp (JOE FLOW APP 2025) - VOLLSTÄNDIG
- **Pfad**: `/Users/doriangrey/Desktop/coding/zeichenapp/`  
- **Domain**: 🌐 https://ai-workflows.at
- **Keywords**: JOE FLOW, Zeichenapp, Canvas, Drawing Tools, Print-on-Demand, Printful
- **Technische Details**: HTML5 Canvas, Supabase Backend, Auth, Gallery
- **Status**: Production - Kontinuierliche Updates
- **Typische Issues**: Console.log Popups, Debug Monitor, Cache Problems, Service Worker
- **Erkennungsmerkmale**:
  - Canvas-basierte Zeichentools
  - Mentions: "Drawing", "Brush", "Color", "Export", "Print"

#### 📱 Claude Mobile (Experimental) - ENTWICKLUNGSPHASE
- **Pfad**: `/Users/doriangrey/Desktop/coding/claude-mobile/`
- **Domain**: Local Development (keine öffentliche URL)
- **Keywords**: Claude Mobile, WebSocket, Bridge, Remote Control, Mobile
- **Technische Details**: Node.js, WebSocket, React Native
- **Status**: Experimental - Early Development
- **Typische Issues**: WebSocket Connection, Mobile Sync, Authentication
- **Erkennungsmerkmale**:
  - Mobile Integration, Remote Commands, WebSocket Communication

### 🔍 AUTOMATISCHE PROJEKT-ERKENNUNG

#### URL-basierte Erkennung:
```bash
case "$mentioned_url" in
  *ki-revolution.at*) echo "EndlessRunner" ;;
  *vibecoding.company*) echo "VetScan Pro" ;;
  *ai-workflows.at*) echo "Zeichenapp" ;;
  *localhost:*) echo "Local Development" ;;
esac
```

#### Keyword-basierte Erkennung:
```javascript
const projectKeywords = {
  EndlessRunner: ['gesture control', 'mediaipe', 'endless runner', 'subway', 'webcam', 'fps'],
  VetScanPro: ['tierarzt', 'bello', 'dr. eule', 'scanner', 'medical', 'glb', 'x-ray'],
  Zeichenapp: ['joe flow', 'canvas', 'drawing', 'brush', 'print-on-demand', 'tools'],
  ClaudeMobile: ['websocket', 'mobile', 'bridge', 'remote', 'sync']
};

function detectProject(text) {
  const lowerText = text.toLowerCase();
  for (const [project, keywords] of Object.entries(projectKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return project;
    }
  }
  return 'Unknown';
}
```

#### Screenshot-basierte Erkennung:
- **EndlessRunner**: 3D-Spiel mit grünem Debug-Panel, FPS-Counter, Gesture-Visualisierung
- **VetScan Pro**: Medizinische Scanner UI, Tiermodelle, Dr. Eule Character
- **Zeichenapp**: Canvas-Interface, Drawing-Tools, Color-Picker
- **Claude Mobile**: Mobile Interface, Remote-Control Elements

### 🚨 ROUTING-REGELN (PFLICHT!)

#### Regel 1: Bei Projekt-Mismatch IMMER STOPPEN
```javascript
if (currentProject !== targetProject) {
  // ❌ NIEMALS trotzdem weitermachen!
  // ✅ IMMER Router verwenden
  createProjectRoutingMessage(request, targetProject);
  return `Anfrage gehört zu ${targetProject}. Bitte Projekt wechseln.`;
}
```

#### Regel 2: Router-Nachricht Format
```markdown
# PROJECT ROUTING MESSAGE

**FROM**: [Aktuelles Projekt]
**TO**: [Ziel-Projekt]
**TIMESTAMP**: [ISO Datum]
**PRIORITY**: [Low/Medium/High/Critical]

## Original Request:
[Ursprüngliche Anfrage hier]

## Context:
[Relevante Screenshot/Error Details]

## Action Required:
[Was im Ziel-Projekt getan werden muss]

---
```

#### Regel 3: Router-Nachricht nach Bearbeitung LÖSCHEN
```bash
# Nach erfolgreicher Bearbeitung im korrekten Projekt:
# Router-Datei leeren oder spezifische Nachricht entfernen
```

### 📚 ROUTING-WORKFLOW BEST PRACTICES

#### Schritt-für-Schritt Workflow bei Projekt-Mismatch:

**1. SOFORTIGE ERKENNUNG** (< 5 Sekunden)
```javascript
// Bei jeder Anfrage prüfen:
const currentPath = process.cwd();
const requestKeywords = extractKeywords(userMessage);
const detectedProject = detectProject(requestKeywords);
const currentProject = determineCurrentProject(currentPath);

if (detectedProject !== currentProject) {
  initiateProjectRouting();
}
```

**2. STOP & ROUTE** (Keine Änderungen!)
```bash
# NIEMALS Code im falschen Projekt ändern!
echo "🚨 PROJEKT-MISMATCH ERKANNT!"
echo "Anfrage: ${detectedProject}"
echo "Aktuell: ${currentProject}"
echo "→ ROUTING initiiert"
```

**3. ROUTER-NACHRICHT ERSTELLEN**
```markdown
### 🎮 [PROJEKT] [PROBLEM-KURZBESCHREIBUNG]
**PRIORITY**: High/Critical bei Bugs, Medium bei Features, Low bei Dokumentation
**CONTEXT**: Screenshot-Analyse, Console Errors, Specific Issues
**ACTION**: Konkrete Handlungsanweisungen für das Zielprojekt
```

**4. USER INFORMIEREN & REDIRECT**
```
"Diese Anfrage gehört zum [PROJEKT] Projekt. 
Ich habe eine Routing-Nachricht erstellt: /coding/CLAUDE_PROJECT_ROUTER.md
Bitte wechsle zu: /Users/doriangrey/Desktop/coding/[PROJEKT_PFAD]/"
```

#### Häufige Routing-Szenarien:

**Szenario 1: Screenshot-basiertes Routing**
- Screenshot zeigt EndlessRunner → aber aktuell in VetScan Pro
- SOFORT erkennen an: 3D-Game UI, Gesture Debug Panel, FPS Counter
- Route zu: `/coding/EndlessRunner/SubwayRunner/`

**Szenario 2: Keyword-basiertes Routing**  
- User erwähnt "Gestensteuerung", "MediaPipe" → EndlessRunner
- User erwähnt "Tierarzt", "Bello", "Dr. Eule" → VetScan Pro
- User erwähnt "Canvas", "Drawing", "JOE FLOW" → Zeichenapp

**Szenario 3: URL-basiertes Routing**
- ki-revolution.at → EndlessRunner
- vibecoding.company → VetScan Pro
- ai-workflows.at → Zeichenapp

#### Emergency Routing bei unklaren Fällen:
```bash
# Wenn Projekt-Zuordnung unklar:
echo "⚠️ UNCLEAR PROJECT ROUTING
Request: [ursprüngliche Anfrage]
Possible Projects: [Liste möglicher Projekte]
User: Bitte Projekt spezifizieren!" >> CLAUDE_PROJECT_ROUTER.md
```

### 🔧 ROUTER MAINTENANCE & MONITORING

#### Tägliche Router-Checks:
```bash
# Check Router File Size (sollte klein bleiben)
wc -l /Users/doriangrey/Desktop/coding/CLAUDE_PROJECT_ROUTER.md

# Check alte unbearbeitete Nachrichten (> 24h)
find /Users/doriangrey/Desktop/coding/CLAUDE_PROJECT_ROUTER.md -mtime +1

# Stats über Routing-Häufigkeit
grep -c "### 🎮\|### 🏥\|### 🎨\|### 📱" CLAUDE_PROJECT_ROUTER.md
```

#### Router Success Metrics:
- **Erfolgreiche Routings pro Woche**: Ziel < 5 (bedeutet gute Projekt-Trennung)
- **Durchschnittliche Resolution Time**: Ziel < 2 Stunden
- **Router File Size**: Ziel < 50 Zeilen (aktive Nachrichten)

#### Router Alerts:
```bash
# Alert bei > 10 aktiven Routing-Nachrichten
if [ $(grep -c "### 🎯\|### 🎮\|### 🏥\|### 🎨" CLAUDE_PROJECT_ROUTER.md) -gt 10 ]; then
  echo "🚨 ROUTER ÜBERLASTET - Nachrichten abarbeiten!"
fi

# Alert bei Nachrichten > 48h alt
# (Implementation depends on timestamp parsing)
```

### 🏆 ERFOLG: Projekt-Vermischung eliminiert!

**Ziel erreicht wenn:**
- [x] Keine falschen Code-Änderungen in fremden Projekten
- [x] Klare Projekt-Trennung durch URL/Keyword/Screenshot-Erkennung  
- [x] Schnelle Routing-Resolution (< 2 Stunden)
- [x] Saubere Dokumentation ohne Projekt-Vermischung
- [x] User Awareness für Projekt-Kontext

---

## MCP (Model Context Protocol)

### 🚀 MCP Quick Setup für neue Projekte

```bash
# 1. Basis-Konfiguration erstellen
cat > ~/Library/Application\ Support/Claude/claude_desktop_config.json << EOF
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "$(pwd)"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
  }
}
EOF

# 2. Claude Desktop neu starten
# 3. Hammer-Icon ⚒️ im Chat verifiziert Success
```

### Projekt-spezifische MCP-Konfigurationen

#### EndlessRunner (Subway Runner 3D)
**Zweck**: Browser-basiertes 3D Endless Runner mit Gesture Control

**Optimale MCP-Server**:
- **Filesystem MCP**: Zugriff auf index.html und Assets
- **Git/GitHub MCP**: Auto-Commits und PR-Management
- **Playwright MCP**: Automated Gesture-Control Testing
- **Memory MCP**: Session-übergreifende Game-States
- **Context7 MCP**: Three.js und MediaPipe Dokumentation
- **ImageMagick Docker**: Sprite-Sheet Generation
- **Fetch MCP**: CDN und API Monitoring

**Spezial-Konfiguration**:
```json
{
  "playwright": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-playwright",
      "--project", "/Users/doriangrey/Desktop/coding/EndlessRunner/SubwayRunner"
    ]
  }
}
```

#### Zeichenapp (JOE FLOW APP 2025)
**Zweck**: Web-basierte Drawing App mit Print-on-Demand Integration

**Empfohlene MCP-Server**:
- **Filesystem MCP**: Dateizugriff für Canvas-Export und Asset-Management
- **Supabase MCP**: Backend für User-Daten und Drawings
- **Context7 MCP**: Aktuelle Canvas API und JS Framework Docs
- **MinIO Docker**: S3-kompatibler Speicher für Bilder
- **Stripe MCP**: Zahlungsabwicklung für Print-Service

**Docker-Setup**:
```yaml
services:
  minio:
    image: minio/minio
    volumes:
      - ./data:/data
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: password
    command: server /data
    
  print-api:
    build: ./print-service
    environment:
      PRINTFUL_API_KEY: ${PRINTFUL_KEY}
    ports:
      - "3001:3000"
```

#### Claude Mobile
**Zweck**: Mobile Bridge für Claude Desktop Control

**Empfohlene MCP-Server**:
- **WebSocket MCP**: Real-time Communication
- **Express Server MCP**: REST API für Commands
- **File Sync MCP**: Desktop-Mobile File Transfer
- **Voice Recognition Docker**: Speech-to-Text Processing

### 🎯 MCP Best Practices für EndlessRunner

#### Performance-Optimierung
```javascript
// MCP-gestützte Test-Automation
// Playwright MCP kann Gesture-Control automatisch testen
const testGestures = async () => {
  // MCP ruft Playwright auf
  await mcp.playwright.test({
    file: 'gesture-test.spec.js',
    headless: false,  // Für Webcam-Tests
    timeout: 30000
  });
};
```

#### Asset-Pipeline mit MCP
```bash
# ImageMagick MCP für Sprite-Generation
docker run -v ./assets:/work imagemagick-mcp \
  convert sprite_*.png -append spritesheet.png

# Automatische Optimierung
docker run -v ./assets:/work imagemagick-mcp \
  mogrify -quality 85 -resize 1024x1024\> *.png
```

#### Continuous Deployment
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx",
      "AUTO_MERGE_PR": "true",
      "DEPLOY_ON_MERGE": "true"
    }
  }
}
```

#### VetScan Pro 3000 (Tierarzt-Spiel)
**Zweck**: Educational Veterinary Simulator mit 3D Medical Visualization

**Empfohlene MCP-Server**:
- **Blender MCP**: 3D-Asset-Pipeline für Tiermodelle (Bello)
- **Filesystem MCP**: Verwaltung von 10+ HTML-Versionen
- **GitHub MCP**: Auto-Deploy zu vibecoding.company
- **ImageMagick Docker**: Medical Texture Generation
- **Context7 MCP**: Three.js r128 Dokumentation
- **Memory MCP**: Game-State und Achievement Tracking

**Spezial-Konfiguration für 3D Pipeline**:
```json
{
  "blender-mcp": {
    "command": "uvx",
    "args": ["blender-mcp"],
    "env": {
      "BLENDER_PATH": "/Applications/Blender.app",
      "AUTO_EXPORT_GLB": "true",
      "QUALITY_LEVELS": "high,medium,low"
    }
  }
}
```

### 🔥 MCP Power-Features für EndlessRunner

#### Gesture Control Testing mit MCP
```javascript
// Automatisierte Gesture-Tests via Playwright MCP
{
  "gesture-test": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-playwright",
      "--test-file", "gesture-control.test.js",
      "--video", "on",  // Video-Recording der Tests
      "--trace", "on"   // Debugging-Traces
    ]
  }
}
```

#### Three.js Performance Profiling
```javascript
// Memory MCP für Performance-Tracking
{
  "performance-monitor": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-memory",
      "--track-metrics", "fps,memory,drawCalls",
      "--alert-threshold", "fps<30"
    ]
  }
}
```

#### Leaderboard Management
```json
{
  "supabase-leaderboard": {
    "command": "npx",
    "args": ["-y", "supabase-mcp"],
    "env": {
      "SUPABASE_URL": "https://cquahsbgcycdmslcmmdz.supabase.co",
      "SUPABASE_ANON_KEY": "your-key-here",
      "AUTO_BACKUP": "true"
    }
  }
}
```

### Globale MCP Best Practices

1. **Security First**
   - Niemals API Keys hardcoden
   - Environment Variables für Secrets
   - Read-only Mounts wo möglich
   - Network Isolation für Container

2. **Performance Optimierung**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 512M
       reservations:
         cpus: '0.25'
         memory: 256M
   ```

3. **Container Isolation**
   - Ein Service pro Container
   - Explizite Network-Policies
   - Volume-Mounts minimieren
   - Health-Checks mandatory

4. **MCP Server Prioritäten**
   - **Kritisch**: filesystem, git
   - **Hoch**: github, playwright, memory
   - **Mittel**: context7, fetch, brave-search
   - **Niedrig**: docker-basierte Tools

5. **Troubleshooting MCP Issues**
   ```bash
   # MCP Server nicht erreichbar
   pkill -f "npx.*mcp"  # Kill hanging processes
   rm -rf ~/.npm/_npx   # Clear npx cache
   
   # Docker MCP Probleme
   docker system prune -a  # Nuclear option
   docker compose down -v  # Remove volumes
   ```

---

## Docker Integration

### VetScan Pro 3D Asset Pipeline Docker Setup
```yaml
# docker-compose.yml für Blender MCP Pipeline
version: '3.8'

services:
  blender-mcp:
    image: blender-mcp:latest
    container_name: vetscan-blender-pipeline
    volumes:
      - ./models:/workspace/models
      - ./exports:/workspace/exports
      - ./textures:/workspace/textures
    environment:
      - BLENDER_VERSION=3.6
      - AUTO_EXPORT=true
      - QUALITY_LEVELS=ultra,high,medium,low
    command: |
      blender --background --python /scripts/export_pipeline.py
    networks:
      - vetscan-network

  model-optimizer:
    image: gltf-pipeline:latest
    depends_on:
      - blender-mcp
    volumes:
      - ./exports:/input
      - ./optimized:/output
    environment:
      - DRACO_COMPRESSION=true
      - TEXTURE_COMPRESSION=webp
      - MAX_TEXTURE_SIZE=1024
    networks:
      - vetscan-network

  medical-shader-generator:
    build: ./shader-generator
    depends_on:
      - model-optimizer
    volumes:
      - ./optimized:/models
      - ./shaders:/output
    environment:
      - SHADER_TYPES=xray,ultrasound,thermal,mri
      - THREE_VERSION=r128
    networks:
      - vetscan-network

networks:
  vetscan-network:
    driver: bridge
```

### Standard Docker-Compose Template
```yaml
version: '3.8'

services:
  app:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

### Docker Security Checklist
- [ ] Non-root User in Dockerfile
- [ ] Multi-stage Builds für kleinere Images
- [ ] Health Checks implementiert
- [ ] Resource Limits gesetzt
- [ ] Secrets via Docker Secrets/Vault
- [ ] Read-only Root Filesystem wo möglich

---

## Backend Development

### 🔥 Supabase Integration (Production-Ready)

#### Supabase MCP Server Setup
```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "supabase-mcp",
        "--read-only",  // EMPFOHLEN für Production
        "--project-ref=YOUR_PROJECT_REF"
      ],
      "env": {
        "SUPABASE_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
      }
    }
  }
}
```

#### Supabase Personal Access Token erstellen
1. [Supabase Dashboard](https://app.supabase.com/) → Avatar → **Account Settings**
2. **Access Tokens** → **Generate new token**
3. Beschreibender Name (z.B. "Claude MCP Server")
4. **Token sofort kopieren** - wird nur einmal angezeigt!

#### Project Reference ID finden
1. Supabase-Projekt öffnen → **Settings** → **General**
2. **Reference ID** kopieren (Format: `xyzabc123456`)

#### Supabase MCP Features
```bash
# Read-Only Modus (SICHER für Production)
--read-only

# Projekt-spezifisch (EMPFOHLEN)
--project-ref=your-project-ref

# Bestimmte Features aktivieren
--features=database,docs,functions,storage
```

**Verfügbare Feature-Gruppen:**
- `account` - Projekt- und Organisations-Management
- `database` - SQL-Operationen und Schema-Management  
- `docs` - Dokumentations-Zugriff
- `debug` - Debugging-Tools (NICHT für Production!)
- `development` - Entwicklungs-Tools
- `functions` - Edge Functions Management
- `storage` - Storage Bucket Management
- `branching` - Database Branching

#### Supabase Security Best Practices
✅ **IMMER:**
- `--read-only` für Production-Datenbanken
- `--project-ref` um Zugriff zu beschränken
- Development-Projekte für Tests verwenden
- Access Tokens regelmäßig rotieren (alle 90 Tage)
- Separate Tokens für Dev/Staging/Production

⚠️ **NIEMALS:**
- Production-DB ohne Read-Only
- Service Role Keys in MCP-Config
- Hardcoded Credentials in Git
- Admin-Tokens für normale Entwicklung

#### Supabase für verschiedene Projekte

**Zeichenapp (JOE FLOW APP 2025)**
```javascript
// Supabase für User Authentication & Drawing Storage
const supabase = createClient(
  'https://your-project.supabase.co',
  'anon-key-here'
);

// Features:
// - User Auth mit Magic Links
// - Drawing Gallery mit Storage
// - Real-time Collaboration
// - Print-on-Demand Orders
```

**EndlessRunner (Leaderboard)**
```javascript
// Supabase für Global Highscores
const SUPABASE_CONFIG = {
  url: 'https://cquahsbgcycdmslcmmdz.supabase.co',
  anonKey: 'your-anon-key',
  tables: {
    leaderboard: 'highscores',
    users: 'players',
    achievements: 'achievements'
  }
};
```

### API Design Principles
1. **RESTful Standards**
   - Konsistente Endpoints: `/api/v1/resource`
   - HTTP Status Codes korrekt verwenden
   - Pagination für Listen-Endpoints

2. **Authentication & Authorization**
   - JWT Tokens mit Refresh-Mechanismus
   - Rate Limiting implementieren
   - CORS korrekt konfigurieren

3. **Database Best Practices**
   - Migrations versioniert (z.B. Alembic, Prisma)
   - Connection Pooling aktivieren
   - Prepared Statements gegen SQL Injection

---

## 🌐 Hosting & Deployment

### Hostinger-spezifische Deployment-Probleme

#### ⚠️ KRITISCH: Hostinger CDN Cache-Hölle
**Problem**: Hostinger hat extrem aggressives CDN-Caching!
- Alte Versionen werden stundenlang gecacht
- Browser-Cache + CDN-Cache = doppelte Probleme
- Deployment funktioniert, aber alte Version wird angezeigt

**Lösung - Nach JEDEM Deployment:**
1. **Hostinger hPanel** → **Performance** → **CDN** → **Purge Cache**
2. Oder CDN temporär deaktivieren während Development
3. Verifizieren mit: `curl -I https://yourdomain.com/`
4. Check `last-modified` Header für Aktualität

#### FTP-Deploy Configuration für Hostinger
```yaml
# .github/workflows/deploy.yml
- name: Deploy to Hostinger via FTP
  uses: SamKirkland/FTP-Deploy-Action@v4.3.5
  with:
    server: ${{ secrets.FTP_SERVER }}      # ftp.yourdomain.com
    username: ${{ secrets.FTP_USERNAME }}   # Hostinger FTP User
    password: ${{ secrets.FTP_PASSWORD }}   # Hostinger FTP Pass
    local-dir: ./deploy/
    server-dir: /public_html/               # Hauptdomain
    security: loose                         # WICHTIG für Hostinger!
    timeout: 60000                          # 60 Sekunden
    log-level: verbose                      # Debug-Infos
```

#### Hostinger FTP Troubleshooting
```bash
# Problem: "Could not connect to FTP server"
✅ Richtig: ftp.domain.com
❌ Falsch: https://domain.com oder domain.com

# Problem: "Authentication failed"
# → Hostinger cPanel → File Manager → FTP Accounts
# → Neuen FTP-User erstellen oder Passwort reset

# Problem: "Directory not found"
server-dir: /public_html/          # Hauptdomain
server-dir: /public_html/subdomain/ # Subdomain
```

#### .htaccess für Cache-Control (Hostinger)
```apache
# Force Cache Refresh bei Updates
<IfModule mod_headers.c>
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
</IfModule>

# Alternative: Version Parameter verwenden
# style.css?v=20250823
```

---

## 🚀 GitHub Actions Deployment

### Kritische Deployment-Regeln

#### ⚠️ IMMER Branch-Trigger prüfen!
**Problem**: Code pushed aber nicht deployed?
**Ursache**: Branch nicht in deploy.yml triggers!

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [ main, develop, working-baseline-3f73978 ]  # DEIN BRANCH HIER!
  pull_request:
    branches: [ main ]
  workflow_dispatch:  # Manuelles Deployment ermöglichen
```

### Versionsnummer-Management (KRITISCH!)

#### Automatische Version-Injection bei Deployment
```yaml
# Update version info in HTML before deployment
COMMIT_HASH=$(echo ${GITHUB_SHA} | cut -c1-7)
BRANCH_NAME=${GITHUB_REF#refs/heads/}
DEPLOY_TIME=$(date -u +"%Y-%m-%d %H:%M UTC")

# In HTML injizieren
sed -i "s/Commit: [a-f0-9]\{7\}/Commit: ${COMMIT_HASH}/g" deploy/index.html
sed -i "s/Branch: [^<]*/Branch: ${BRANCH_NAME}/g" deploy/index.html
sed -i "s/Deploy: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}[^<]*/Deploy: ${DEPLOY_TIME}/g" deploy/index.html
```

#### Version-Verifikation nach Deployment
```bash
# Prüfen ob neue Version live ist
curl -s https://yourdomain.com/ | grep -i "version\|commit"

# Header-Check für Last-Modified
curl -I https://yourdomain.com/ | grep -i "last-modified"

# Force-Refresh im Browser
# Chrome: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Win)
# Safari: Cmd+Option+R
```

### GitHub Secrets Setup
```bash
# Repository → Settings → Secrets and Variables → Actions
FTP_SERVER: ftp.yourdomain.com
FTP_USERNAME: your_username
FTP_PASSWORD: your_password
SUPABASE_URL: https://project.supabase.co
SUPABASE_ANON_KEY: your_anon_key
```

### Deployment Best Practices

#### Pre-Deployment Checklist
```bash
# 1. Backup erstellen
./backup-essential.sh

# 2. Tests laufen lassen
npm test
npm run test:e2e

# 3. Console.logs entfernen
grep -r "console\." --include="*.html" --include="*.js" . | wc -l
# Sollte 0 sein!

# 4. Branch in deploy.yml?
grep "branches:" .github/workflows/deploy.yml
```

#### Post-Deployment Verification
```bash
# 1. Version Check
curl -s https://domain.com | grep "VERSION"

# 2. CDN Cache Clear (Hostinger)
# hPanel → Performance → CDN → Purge

# 3. Multi-Browser Test
# Chrome, Safari, Firefox - alle testen!

# 4. Mobile Test
# Responsive Design prüfen
```

### Emergency Rollback Workflow
```yaml
# .github/workflows/rollback.yml
name: Emergency Rollback
on:
  workflow_dispatch:
    inputs:
      commit:
        description: 'Commit SHA to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.commit }}
      
      - name: Deploy Previous Version
        # ... FTP Deploy Steps
```

### Multi-Environment Strategy
```yaml
# Separate Deployments für Dev/Staging/Production
jobs:
  deploy-dev:
    if: github.ref == 'refs/heads/develop'
    # Deploy to dev.domain.com
    
  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    # Deploy to staging.domain.com
    
  deploy-production:
    if: github.ref == 'refs/heads/main'
    # Deploy to domain.com
```

---

## Frontend Development

### Educational Game Design Principles (VetScan Pro Learnings)
1. **Progressive Difficulty**
   - Start mit einfachen Fällen (gesunde Tiere)
   - Graduell komplexere Diagnosen einführen
   - Mentor-Charakter (Dr. Eule) für Guidance

2. **Learning Reinforcement**
   - Immer Normal- vs. Gemessene Werte zeigen
   - Farbcodierung (Grün = Normal, Rot = Kritisch)
   - Achievements für Lernfortschritt

3. **Multi-Version Strategy**
   - Verschiedene HTML-Versionen für verschiedene Zielgruppen
   - Detective Version für maximalen Lerneffekt
   - Professional Version für fortgeschrittene User

### Performance Guidelines
1. **Code Splitting**
   - Lazy Loading für große Components
   - Dynamic Imports für optionale Features
   - Bundle Size < 500KB initial load

2. **Canvas Optimierungen** (Zeichenapp-spezifisch)
   ```javascript
   ctx = canvas.getContext('2d', {
     willReadFrequently: true,  // Für Pixel-Operationen
     desynchronized: true       // Performance-Boost
   });
   ```

3. **State Management**
   - Lokaler State wo möglich
   - Global State nur für shared data
   - Debouncing für häufige Updates

### Responsive Design Regeln
- Mobile-First Approach
- Touch Events mit preventDefault()
- Viewport Meta Tag korrekt setzen
- CSS Grid/Flexbox für Layouts

---

## Testing & Selbsttest

### Automatisierte Tests
```bash
# Unit Tests (Jest)
npm test
npm run test:coverage

# E2E Tests (Playwright)
npm run test:e2e
npm run test:e2e:ui  # Mit UI für Debugging

# Visual Regression
npm run test:visual
```

### VetScan Pro Testing Strategy
```bash
# Automated 3D Model Testing
npm run test:model -- --model=bello --checks=all

# Medical Shader Validation
npm run validate:shaders -- --modes=xray,ultrasound,thermal,mri

# Educational Content Testing
npm run test:learning -- --difficulty=progressive --mentor=true

# Multi-Version Compatibility
for file in vetscan-*.html; do
  python3 test-console-errors.py "$file"
done
```

### Manuelle Test-Checkliste
Nach JEDER Code-Änderung:
1. [ ] Core Features funktionieren
2. [ ] Keine Console Errors
3. [ ] Mobile Responsiveness
4. [ ] Cross-Browser Testing (Chrome, Safari, Firefox)
5. [ ] Performance Metrics akzeptabel
6. [ ] **VetScan**: Alle 10+ HTML-Versionen getestet
7. [ ] **VetScan**: 3D-Modelle laden korrekt (alle Qualitätsstufen)
8. [ ] **VetScan**: Medical Shaders funktionieren
9. [ ] **VetScan**: Dr. Eule Mentor-System aktiv
10. [ ] **VetScan**: Normalwerte-Vergleich korrekt

### Test-Pyramide
```
         /\
        /UI\        <- Wenige E2E Tests
       /----\
      /Integr\      <- Integration Tests
     /--------\
    /   Unit   \    <- Viele Unit Tests
   /____________\
```

---

## DB Method

### Database Selection Matrix
| Use Case | Empfohlene DB | Begründung |
|----------|---------------|------------|
| User Auth | Supabase/Firebase | Built-in Auth |
| Game Scores | Redis | Ultra-schnell |
| Complex Relations | PostgreSQL | ACID, Joins |
| Documents | MongoDB | Flexible Schema |
| Analytics | ClickHouse | Time-Series |

### Migration Strategy
1. **Version Control für Schema**
   ```sql
   -- migrations/001_initial.sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **Backup vor Migrations**
   ```bash
   pg_dump dbname > backup_$(date +%Y%m%d).sql
   ```

3. **Rollback Plan**
   - Immer DOWN-Migrations schreiben
   - Test in Staging Environment
   - Blue-Green Deployments

---

## BMAD Method

### ⚠️ WARNUNG: BMAD Method ist DEPRECATED!

**BMAD (Browser Multi-Agent Debug) Method** war ein experimentelles Debug-System, das zu kritischen Problemen führte.

### Was war BMAD?
Ein Multi-Agent-System zur Browser-basierten Debug-Automation mit:
- Automatischer Error-Detection
- Real-time Log Analysis
- DOM Manipulation für Debug-Overlays
- Cross-Tab Communication

### Warum wurde es entfernt?
**ULTIMATE DISASTER (23.08.2025)**:
- Lud komplett falsche Apps (VetScan Pro statt JOE FLOW APP)
- Extreme Cache-Kontamination
- Cross-Site Content Injection
- Unkontrollierbare Debug-Popups

### Lessons Learned
1. **NIEMALS experimentelle Debug-Systeme in Production**
2. **Keine komplexen Multi-Agent-Systeme für Debugging**
3. **Debug-Code strikt von Production-Code trennen**
4. **Feature Flags für alle Debug-Features**

### Alternative Debug-Strategien
```javascript
// ✅ RICHTIG: Feature Flags verwenden
const FEATURE_FLAGS = {
  DEBUG_MODE: false,
  VERBOSE_LOGGING: false
};

if (FEATURE_FLAGS.DEBUG_MODE) {
  console.log('Debug info:', data);
}

// ❌ FALSCH: Direkte console.logs
console.log('Debug:', data);  // NIEMALS in Production!
```

### Debug Best Practices
1. **Browser DevTools nutzen**
   - Breakpoints statt console.log
   - Network Tab für API-Debugging
   - Performance Tab für Bottlenecks

2. **Strukturiertes Logging**
   ```javascript
   class Logger {
     static debug(...args) {
       if (process.env.NODE_ENV === 'development') {
         console.log('[DEBUG]', ...args);
       }
     }
   }
   ```

3. **Error Boundaries** (React/Vue)
   ```javascript
   class ErrorBoundary extends Component {
     componentDidCatch(error, info) {
       logErrorToService(error, info);
     }
   }
   ```

---

## 🎓 Educational Game Development Patterns (VetScan Pro Learnings)

### Core Educational Principles

#### 1. **Scaffolded Learning Approach**
```javascript
// VetScan Pro Pattern: Progressive Difficulty
const learningStages = {
  1: "Gesunde Tiere erkennen (Baseline etablieren)",
  2: "Einfache Krankheiten (1 klares Symptom)",
  3: "Mittlere Krankheiten (2-3 Symptome)",
  4: "Komplexe Diagnosen (Multiple Symptome)",
  5: "Differentialdiagnosen (Ähnliche Krankheiten unterscheiden)"
};

// Implementation: Dr. Eule Mentor System
if (playerLevel < 3) {
  showMentorHint("Dr. Eule: 'Schau dir zuerst die Herzfrequenz an!'");
}
```

#### 2. **Comparison-Based Learning**
```javascript
// IMMER Normal- vs. Gemessene Werte zeigen
const displayDiagnosis = (animal, measurement) => {
  return {
    normal: animalNormalValues[animal][measurement],
    measured: currentMeasurement,
    status: getStatus(currentMeasurement, normalRange),
    color: currentMeasurement < normalMin ? 'blue' : 
           currentMeasurement > normalMax ? 'red' : 'green'
  };
};
```

#### 3. **Immediate Feedback with Explanation**
```javascript
// VetScan Pattern: Erkläre WARUM
const provideFeedback = (diagnosis, correct) => {
  if (correct) {
    return `✅ Richtig! ${diagnosis} zeigt sich durch erhöhte Herzfrequenz (${measured} statt normal ${normal})`;
  } else {
    return `❌ Nicht ganz. Bei ${diagnosis} wäre die Temperatur erhöht. Schau nochmal genau!`;
  }
};
```

### Medical Accuracy als Lernwerkzeug

#### Realistische Wertebereiche (200+ Tiere recherchiert)
```javascript
const animalNormalValues = {
  hund: {
    heartRate: [60, 140],      // Beats per minute
    temperature: [37.5, 39.2], // Celsius
    respiration: [10, 30],     // Breaths per minute
    bloodPressure: [110, 160], // Systolic
    weight: {
      klein: [2, 10],          // kg
      mittel: [10, 25],
      gross: [25, 45],
      riesig: [45, 90]
    }
  },
  katze: {
    heartRate: [140, 220],
    temperature: [38.0, 39.2],
    respiration: [20, 30],
    bloodPressure: [120, 180]
  },
  pferd: {
    heartRate: [28, 44],
    temperature: [37.2, 38.3],
    respiration: [8, 16],
    bloodPressure: [110, 140]
  },
  kaninchen: {
    heartRate: [180, 300],
    temperature: [38.5, 40.0],
    respiration: [30, 60],
    bloodPressure: [90, 130]
  }
};
```

### Gamification mit Lernzielen

#### Achievement System mit medizinischem Fokus
```javascript
const achievements = {
  "Erste Hilfe": "Erste korrekte Diagnose",
  "Tierfreund": "10 verschiedene Tiere untersucht",
  "Diagnostiker": "5 schwere Krankheiten erkannt",
  "Lebensretter": "Kritischen Fall rechtzeitig erkannt",
  "Experte": "100% Genauigkeit bei 10 Fällen",
  "Dr. Dolittle": "Alle Tierarten gemeistert"
};
```

### 3D Visualization als Lehrmittel

#### Medical Shader System (Educational Purpose)
```javascript
// VetScan Pro 3D Medical Modes
const medicalVisualizationModes = {
  xray: {
    purpose: "Knochen und Frakturen erkennen",
    shader: "Fresnel-based transparency",
    educationalValue: "Verständnis für Skelettstruktur"
  },
  ultrasound: {
    purpose: "Weichteile und Organe untersuchen",
    shader: "Noise-based echo simulation",
    educationalValue: "Organpositionierung verstehen"
  },
  thermal: {
    purpose: "Entzündungen lokalisieren",
    shader: "Temperature gradient mapping",
    educationalValue: "Wärmeverteilung bei Krankheiten"
  },
  mri: {
    purpose: "Detaillierte Gewebeanalyse",
    shader: "Grayscale tissue differentiation",
    educationalValue: "Gewebetypen unterscheiden"
  }
};
```

---

## Agents & Subagents

### Claude Code Agent System

#### Verfügbare Agent-Typen

1. **general-purpose**
   - Komplexe, mehrstufige Aufgaben
   - Code-Suche und Research
   - Autonome Task-Execution
   - Tools: Alle verfügbaren

2. **statusline-setup**
   - Konfiguration der Claude Code Statuszeile
   - UI-Anpassungen
   - Tools: Read, Edit

3. **output-style-setup**
   - Erstellung von Output-Styles
   - Format-Definitionen
   - Tools: Read, Write, Edit, Glob, LS, Grep

### Best Practices für Agent-Nutzung

#### Wann Agents verwenden
```python
# ✅ RICHTIG: Für komplexe, explorative Aufgaben
Task(
  description="Find all API endpoints",
  prompt="Search the entire codebase for API endpoints and document them",
  subagent_type="general-purpose"
)

# ❌ FALSCH: Für simple, direkte Aufgaben
Task(
  description="Read package.json",
  prompt="Show me package.json",  # Besser: Direct Read tool
  subagent_type="general-purpose"
)
```

#### Multi-Agent Patterns

1. **Parallel Execution**
   ```python
   # Mehrere Agents gleichzeitig für Performance
   agents = [
     Task("Search for bugs", "Find all TODO comments", "general-purpose"),
     Task("Analyze deps", "Check for outdated packages", "general-purpose"),
     Task("Review security", "Find security issues", "general-purpose")
   ]
   ```

2. **Sequential Pipeline**
   ```python
   # Agent-Chain für komplexe Workflows
   # Agent 1: Research
   research_result = Task("Research", "Find all components", "general-purpose")
   # Agent 2: Analysis
   analysis_result = Task("Analyze", f"Analyze: {research_result}", "general-purpose")
   # Agent 3: Implementation
   impl_result = Task("Implement", f"Based on: {analysis_result}", "general-purpose")
   ```

3. **Specialized Delegation**
   ```python
   # Spezial-Agents für spezifische Aufgaben
   if task_type == "ui_config":
     Task("Setup UI", prompt, "statusline-setup")
   elif task_type == "formatting":
     Task("Format output", prompt, "output-style-setup")
   else:
     Task("General task", prompt, "general-purpose")
   ```

### WebSocket-basierte Multi-Agent Systeme

#### Architektur (Experimental)
```javascript
// websocket-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Agent communication
    const task = JSON.parse(message);
    processAgentTask(task);
  });
});
```

#### Orchestration Pattern
```javascript
// orchestrate-development.js
class DevelopmentOrchestrator {
  constructor() {
    this.agents = {
      codeAnalyzer: new CodeAnalyzerAgent(),
      testRunner: new TestRunnerAgent(),
      deployer: new DeployerAgent()
    };
  }
  
  async orchestrate(task) {
    // 1. Analyze
    const analysis = await this.agents.codeAnalyzer.analyze();
    
    // 2. Test
    const testResults = await this.agents.testRunner.test(analysis);
    
    // 3. Deploy if tests pass
    if (testResults.passed) {
      await this.agents.deployer.deploy();
    }
  }
}
```

### Agent Limitations & Guidelines

#### Performance Considerations
- Agents haben Overhead - nicht für triviale Tasks
- Max 3-5 parallel Agents für Stability
- Timeout von 5 Minuten pro Agent

#### Security Guidelines
- Agents haben gleiche Permissions wie Parent
- Keine sensitive Operations delegieren
- Audit Trail für Agent-Actions

#### Error Handling
```javascript
try {
  const result = await Task(
    "Complex task",
    prompt,
    "general-purpose"
  );
  processResult(result);
} catch (error) {
  // Agent failures sollten graceful handled werden
  console.error('Agent failed:', error);
  // Fallback to manual approach
  manualExecution();
}
```

---

## Claude Code Tipps

### Commands & Shortcuts
```bash
# Essenzielle Backup vor Änderungen
./backup-essential.sh

# Emergency Rollback
./emergency-rollback.sh

# Auto-Deploy nach Änderungen (Hostinger)
git add . && git commit -m "msg" && git push
```

### Hooks Configuration
```javascript
// Pre-commit Hook Example
{
  "hooks": {
    "pre-commit": "npm test && npm run lint",
    "pre-push": "npm run test:e2e"
  }
}
```

### Claude-spezifische Patterns
1. **Datei-Limits beachten**
   ```javascript
   // ❌ WRONG - Crasht bei großen Files
   Read("index.html")
   
   // ✅ CORRECT - Mit Offset/Limit
   Read("index.html", offset=1000, limit=500)
   ```

2. **TodoWrite Tool nutzen**
   - Bei komplexen Tasks (3+ Schritte)
   - Für Progress-Tracking
   - User-Transparenz

3. **Multi-Tool Calls**
   - Batch verwandte Operations
   - Parallel statt sequentiell
   - Performance-Optimierung

### Wichtige Environment Files
```bash
# Global Claude Instructions
~/.claude/CLAUDE.md

# Project-specific
./CLAUDE.md
./TROUBLESHOOTING.md
./HOSTINGER_TIPPS.md  # Deployment-spezifisch
```

---

## Troubleshooting

### 🔴 Kritische Lessons Learned

#### 🔥 DAS DEBUG-MONITOR-DESASTER (Zeichenapp - 20+ Lösungsversuche!)

**Das schlimmste Debug-Problem aller Zeiten: 8. August 2025**

##### Timeline der Verzweiflung

**Version 1-3**: Erste Versuche (gescheitert)
- MutationObserver implementiert
- CSS mit `display: none !important`
- Window.alert/confirm/prompt überschrieben
- **PROBLEM BLIEB**: Debug-Monitor erschien weiterhin bei Tool-Clicks

**Version 4**: Nuclear Solution (teilweise erfolgreich)
```javascript
// Was wir gemacht haben:
// 1. ALLE Popup-Mechanismen überschrieben
window.alert = () => {};
window.confirm = () => true;
window.prompt = () => null;

// 2. Ultra-aggressiver MutationObserver
const observer = new MutationObserver((mutations) => {
    // Löscht ALLES mit "debug" im id/class/text
});

// 3. createElement gehijacked
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    Promise.resolve().then(() => {
        if (element.id?.includes('debug')) element.remove();
    });
    return element;
};

// 4. Nuclear CSS - 12-fache Sicherheit
#debug-*, .debug-*, [id*="debug"], [class*="debug"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    position: absolute !important;
    left: -99999px !important;
    // ... 6 weitere Properties
}
```

##### Die WAHRE Ursache (nach 20+ Versuchen gefunden!)

**339+ console.log Statements im Production Code!**
```javascript
// ❌ DAS WAR DAS PROBLEM:
console.log('🔧 [JoeFlowApp] Selecting tool...');  // Bei JEDEM Tool-Click!
console.log('State changed:', state);               // Bei JEDER State-Änderung!
console.error('Debug:', data);                      // Überall verstreut!

// Browser-Extension oder Dev-Tool zeigte diese als Popups!
```

**Weitere versteckte Probleme:**
1. **Auskommentierter Code wurde trotzdem verarbeitet**
   - 319 Zeilen auskommentierter Debug-Code
   - Mit problematischen onclick Handlers
   - Browser-Parser war verwirrt bei 10.000+ Zeilen

2. **Inline onclick Handler im HTML**
   ```html
   <!-- Diese existierten noch im auskommentierten Bereich! -->
   onclick="window.debugMonitor.triggerTestError()"
   onclick="window.debugMonitor.clearErrors()"
   ```

3. **showNotification() war nicht disabled**
   - Erstellte echte DOM-Popups
   - War in keiner der Nuclear Solutions enthalten

##### Warum es SO LANGE dauerte

1. **Falsche Annahme**: Dachten es sind Debug-Panels → waren console.log Popups!
2. **Komplexität**: 10.000+ Zeilen in einer Datei = Parser-Verwirrung
3. **Cache-Hölle**: Service Workers cachten alte Versionen
4. **Browser-Extensions**: Zeigten console.log als visuelle Popups

##### Die finale funktionierende Lösung

```javascript
// 1. ALLE console.* komplett überschreiben
window.console = {
    log: () => {},
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
    trace: () => {},
    table: () => {},
    // ALLE Methoden disabled!
};

// 2. Service Worker Nuclear Option
navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
});
caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
});

// 3. Auskommentierten Code KOMPLETT GELÖSCHT
// Nicht nur auskommentiert - ENTFERNT!
// 319 Zeilen problematischer Code eliminiert

// 4. Alle Debug-Funktionen neutralisiert
debugState() { return; }
logCurrentState() { return; }
showNotification() { return; }
```

### 🚨 CODE-HYGIENE REGELN (NIEMALS WIEDER 20+ DEBUG-VERSUCHE!)

#### Die 10 Gebote der Debug-Sauberkeit

1. **KEIN console.log in Production - NIEMALS!**
   ```javascript
   // ❌ TÖDLICH - Kann als Popup erscheinen!
   console.log('Tool selected');
   
   // ✅ IMMER mit Feature Flag
   if (FEATURE_FLAGS.DEBUG_MODE) {
       console.log('Tool selected');
   }
   ```

2. **Auskommentierten Code LÖSCHEN, nicht behalten**
   ```javascript
   // ❌ GEFÄHRLICH - Browser parst trotzdem!
   /* 
   onclick="window.debugMonitor.show()"
   console.log('debug');
   */
   
   // ✅ RICHTIG - Code komplett entfernen!
   // Gelöscht, nicht auskommentiert
   ```

3. **Keine Inline onclick Handler mit Debug-Calls**
   ```html
   <!-- ❌ NIEMALS -->
   <button onclick="debugState()">Test</button>
   
   <!-- ✅ IMMER Event Listeners -->
   <button id="test-btn">Test</button>
   ```

4. **showNotification() und ähnliche Popups isolieren**
   ```javascript
   // ✅ Debug-Notifications hinter Flag
   function showNotification(msg) {
       if (!FEATURE_FLAGS.SHOW_NOTIFICATIONS) return;
       // Implementation
   }
   ```

5. **Service Worker Cache regelmäßig clearen**
   ```javascript
   // In Development immer ausführen
   if (location.hostname === 'localhost') {
       navigator.serviceWorker.getRegistrations().then(regs => {
           regs.forEach(reg => reg.unregister());
       });
   }
   ```

#### Quick Debug Detection Checklist

```bash
# 1. Finde ALLE console.* Statements
grep -r "console\." --include="*.html" --include="*.js" . | wc -l
# Sollte 0 sein in Production!

# 2. Finde Debug-Funktionen
grep -r "debugState\|logCurrentState\|showDebug" .

# 3. Finde Inline onclick Handler
grep -r "onclick=\".*debug" .

# 4. Zähle auskommentierten Code
grep -r "/\*" . | grep -c "console\|debug"

# 5. Check für Debug-IDs/Classes
grep -r "id=\"debug\|class=\"debug" .
```

#### Emergency Debug Cleanup Script

```javascript
// Nuclear Option - Nur im Notfall!
function EMERGENCY_DEBUG_CLEANUP() {
    // 1. Override ALL console methods
    Object.keys(console).forEach(key => {
        console[key] = () => {};
    });
    
    // 2. Remove ALL debug elements
    document.querySelectorAll('[id*="debug"], [class*="debug"]').forEach(el => {
        el.remove();
    });
    
    // 3. Clear all caches
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
        });
    }
    
    // 4. Unregister service workers
    navigator.serviceWorker?.getRegistrations().then(regs => {
        regs.forEach(reg => reg.unregister());
    });
    
    // 5. Clear localStorage
    localStorage.clear();
    sessionStorage.clear();
}
```

#### Ultimate Disaster - Falsche App geladen (Zeichenapp)
**Problem**: VetScan Pro statt JOE FLOW APP wurde angezeigt
**Ursache**: Extreme Cache-Kontamination + BMAD Method
**Lösung**: Complete Rollback, Nuclear Cache Clear
**Details**: `zeichenapp/TROUBLESHOOTING.md` Section "ULTIMATE DISASTER"

#### Three.js CDN Loading Issues (VetScan Pro & EndlessRunner)
**Problem**: OrbitControls/GLTFLoader nicht gefunden oder falsche Namespace
**Ursache**: cdnjs hat keine Three.js example files, unpkg globale Variablen
**Lösung**: unpkg CDN verwenden, window.load Event für Timing
**Details**: `tierarztspiel/Troubleshooting.md` Section "CDN OrbitControls Error"

#### Three.js Version Migration Issues (EndlessRunner)
**Problem**: "Scripts build/three.js deprecated with r150+"
**Ursache**: Three.js änderte CDN-Struktur ab r150
**Lösung**: 
```javascript
// ❌ FALSCH - Deprecated seit r150
<script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>

// ✅ RICHTIG - Neue Struktur
<script src="https://unpkg.com/three@0.150.0/build/three.module.js" type="module"></script>
// ODER bei älteren Versionen bleiben:
<script src="https://unpkg.com/three@0.150.0/build/three.min.js"></script>
```
**Details**: `EndlessRunner/TROUBLESHOOTING_WEBGL_2025.md`

#### Deployment Disaster - GitHub Actions Failure
**Problem**: Commits erfolgen, aber keine Deployment
**Ursache**: Branch nicht in deploy.yml triggers
**Lösung**: Branch zu workflow triggers hinzufügen
**Details**: `zeichenapp/TROUBLESHOOTING.md` Section "DEPLOYMENT DISASTER"

#### Debug Monitor Plague
**Problem**: Console.log als Popups angezeigt
**Ursache**: 339+ console.log Statements im Production Code
**Lösung**: Alle console.* entfernt, Feature Flags für Debug
**Details**: `zeichenapp/TROUBLESHOOTING.md` Section "DEBUG MONITOR PROBLEM"

### Common Issues & Quick Fixes

#### Cache Problems
```bash
# Browser Cache Clear
localStorage.clear()
sessionStorage.clear()

# Service Worker Nuke
navigator.serviceWorker.getRegistrations().then(regs => 
  regs.forEach(reg => reg.unregister())
)

# CDN Cache (Hostinger)
# Login hPanel → Performance → CDN → Purge Cache
```

#### Git Issues
```bash
# Rollback to last stable
git checkout HEAD -- file.html

# Emergency stash
git stash push -m "emergency backup"

# Find last working commit
git log --oneline -20
```

#### Docker Issues
```bash
# Container not starting
docker logs container-name

# Permission denied
docker exec -u root container-name chmod 755 /path

# Network issues
docker network ls
docker network inspect bridge
```

### Performance Troubleshooting

#### Slow Page Load
1. Check bundle size: `npm run build -- --stats`
2. Enable compression: gzip/brotli
3. Lazy load images/components
4. CDN für static assets

#### Canvas Performance (Zeichenapp)
```javascript
// Optimize redraws
requestAnimationFrame(() => {
  // Batch canvas operations
});

// Reduce resolution for effects
const offscreen = new OffscreenCanvas(width/2, height/2);
```

### Debugging Tools
```bash
# Network Analysis
curl -I https://domain.com

# Process Monitor
htop / Activity Monitor

# Docker Stats
docker stats

# Browser Performance
Chrome DevTools → Performance Tab
```

### Emergency Contacts & Resources
- **Hostinger Support**: hPanel → Support Ticket
- **GitHub Actions**: Check Actions Tab für Logs
- **Docker Hub Status**: https://status.docker.com
- **Claude Support**: https://github.com/anthropics/claude-code/issues

---

## 📁 Projekt-spezifische Dokumentation

### Verfügbare TROUBLESHOOTING Files
- `zeichenapp/TROUBLESHOOTING.md` - Umfassende Disaster-Timeline
- `zeichenapp/HOSTINGER_TIPPS.md` - Deployment & Cache Issues
- `zeichenapp/CLAUDE.md` - Projekt-spezifische Regeln
- `zeichenapp/MCP-TIPPS.md` - MCP Server Best Practices
- `EndlessRunner/TROUBLESHOOTING.md` - Game-spezifische Issues
- `tierarztspiel/Troubleshooting.md` - Three.js CDN & Version Management
- `tierarztspiel/3dworkflowBlender.md` - Blender MCP Pipeline Documentation
- `tierarztspiel/CLAUDE.md` - VetScan Pro Development Guide

### Quick Links zu kritischen Sections
1. **Cache-Probleme**: → HOSTINGER_TIPPS.md Section 7 & 11
2. **Deployment Issues**: → deploy.yml Branch-Config
3. **Debug Popups**: → TROUBLESHOOTING.md Ultimate Disaster
4. **Performance**: → CLAUDE.md Performance Optimizations
5. **MCP Setup**: → MCP-SETUP.md für Konfiguration

---

## 🎯 Version Management Best Practices (VetScan Pro Pattern)

### Landing Page Strategy für Multi-Version Projects
1. **Neue Features (BETA)**
   - Orange/gelber Rahmen als Warnung
   - Klickbar aber klar als "BETA - Experimentell" markiert
   - Disclaimer: "Feedback willkommen"

2. **Empfohlene Version**
   - Golden Badge "⭐ EMPFOHLEN"
   - Für neue User als Default
   - Stabilste Experience

3. **Version Number Management**
   - **KRITISCH**: Bei JEDEM Deployment updaten!
   - Format: `Major.Minor.Patch` (z.B. 7.0.2)
   - Build: `YYYY.MM.DD.XXX` (z.B. 2025.08.23.002)
   - Update Locations:
     - HTML `<title>` Tag
     - Header im Body
     - JavaScript `const VERSION`
     - Status Badge im UI

### Three.js CDN Strategy (Lessons Learned)
```javascript
// ❌ FALSCH - cdnjs hat keine example files
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/controls/OrbitControls.js"></script>

// ✅ RICHTIG - unpkg hat alles
<script src="https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

// ✅ TIMING FIX - Warte auf Scripts
window.addEventListener('load', function() {
    init(); // Jetzt sicher zu starten
});

// ✅ NAMESPACE FIX für r128 CDN
if (typeof OrbitControls !== 'undefined' && !THREE.OrbitControls) {
    THREE.OrbitControls = OrbitControls;  // Global → THREE namespace
    THREE.GLTFLoader = GLTFLoader;
    THREE.DRACOLoader = DRACOLoader;
}
```

### Blender to Web 3D Pipeline (VetScan Pro Method)
```javascript
// Multi-Quality Export Strategy
const qualityLevels = {
  ultra: { polygons: 50000, texture: 2048, fileSize: "~5MB" },
  high:  { polygons: 25000, texture: 1024, fileSize: "~2MB" },
  medium:{ polygons: 10000, texture: 512,  fileSize: "~1MB" },
  low:   { polygons: 5000,  texture: 256,  fileSize: "~500KB" }
};

// Progressive Loading Implementation
async function loadModelProgressive(modelName) {
  const quality = detectDeviceCapability(); // Mobile = low, Desktop = high
  const modelPath = `models/${modelName}_${quality}.glb`;
  
  // Fallback chain
  try {
    return await loader.loadAsync(modelPath);
  } catch {
    console.warn(`Falling back to lower quality`);
    return await loader.loadAsync(`models/${modelName}_low.glb`);
  }
}
```

### Version Management für Educational Games
```javascript
// VetScan Pro Landing Page Pattern
const versionStrategy = {
  beta: {
    display: "⚡ BETA - Neue Features",
    style: "orange-border warning-style",
    access: "clickable but warned",
    message: "Experimentell - Feedback willkommen!"
  },
  recommended: {
    display: "⭐ EMPFOHLEN",
    style: "golden-badge highlight",
    access: "default for new users",
    message: "Stabilste Version für Lernerfolg"
  },
  experimental: {
    display: "🔬 EXPERIMENTAL",
    style: "grayscale disabled-look",
    access: "direct URL only",
    message: "Nur für Entwickler"
  }
};
```

## 🎮 EndlessRunner Spezifische Erkenntnisse

### Critical Game Initialization Patterns

#### Race Conditions beim Game Start
```javascript
// ❌ PROBLEM: Kritische Funktionen zu spät definiert
// Button onclick ruft startGame() auf Zeile 763
<button onclick="startGame()">Start</button>

// Aber Funktion wird erst Zeile 3405 definiert!
window.startGame = function() { ... }

// ✅ LÖSUNG: Fallback Pattern
// SOFORT am Script-Anfang:
window.startGame = function() {
    console.log('Fallback version');
    if (typeof startGameInternal === 'function') {
        startGameInternal();
    } else {
        setTimeout(() => window.startGame(), 2000);
    }
};

// Später überschreiben mit echter Implementation
window.startGame = async function() {
    // Echte Implementation
};
```

#### WebGL Context Failures
```javascript
// ❌ PROBLEM: Multiple Initialization Attempts
window.gameCore = { init() {...} }  // Zeile 1275
function init() {...}               // Zeile 4649
startGameInternal() {...}           // Zeile 3405

// ✅ LÖSUNG: Single Source of Truth
let initialized = false;
function init() {
    if (initialized) return;
    initialized = true;
    // Initialization code
}
```

#### Shader Compilation Errors
```javascript
// PROBLEM: Uniforms können nicht gesetzt werden
// "INVALID_OPERATION: uniform3f: location is not from the associated program"

// LÖSUNG: Shader Program Validation
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms
});

// Validate before use
if (!material.program) {
    console.error('Shader compilation failed');
    // Fallback to basic material
    return new THREE.MeshBasicMaterial({ color: 0xff0000 });
}
```

### Gesture Control Evolution (MediaPipe Integration)

#### From TensorFlow to MediaPipe Migration
```javascript
// V1-V4: TensorFlow.js (schwer, langsam, instabil)
// V5+: MediaPipe Face Mesh (leicht, schnell, stabil)

// KRITISCHE ERKENNTNISSE:
1. Smoothing Logic kann alles blockieren
2. gameState.isPlaying Check verhindert Testing
3. Mirror-Korrektur für intuitive Steuerung
4. Boundaries müssen user-tested sein
5. Debug-Visibility ist essentiell
```

#### Gesture Boundaries Optimization Journey
```javascript
// V5.3.1: Zu restriktiv (25%/75%)
LEFT_BOUNDARY = 0.25;   // Unmöglich zu erreichen
RIGHT_BOUNDARY = 0.75;  // Unmöglich zu erreichen

// V5.3.10: Besser aber noch zu eng (35%/65%)
LEFT_BOUNDARY = 0.35;
RIGHT_BOUNDARY = 0.65;

// V5.3.22: PERFEKT (45%/55%)
LEFT_BOUNDARY = 0.45;   // Natural head movement
RIGHT_BOUNDARY = 0.55;  // Comfortable range

// V5.3.35: Ultra-sensitive für Testing (49%/51%)
UP_BOUNDARY = 0.49;     // Nur 2% Neutral-Zone
DOWN_BOUNDARY = 0.51;
```

### Game Loop & Performance Disasters

#### Console.log Performance Killer
```javascript
// ❌ DISASTER V5.3.33: 60 logs/second
detectGesture(landmarks) {
    console.log('Y-COORDINATE:', avgEyeY); // JEDEN FRAME!
    // Browser freeze nach 30 Sekunden
}

// ✅ FIX: Conditional Logging
if (!this.lastLoggedY || Math.abs(avgEyeY - this.lastLoggedY) > 0.05) {
    console.log('Y-Value changed:', avgEyeY);
    this.lastLoggedY = avgEyeY;
}
```

#### Audio System CSP Violations
```javascript
// ❌ PROBLEM: Desktop Chrome crashes bei Game Over
async preloadSounds() {
    const response = await fetch(dataURL); // CSP VIOLATION!
}

// ✅ FIX: Audio Preload temporary disabled
async preloadSounds() {
    return; // TEMPORARILY DISABLED to fix Desktop crashes
}
```

### Version Management Chaos

#### The Great Module System Failure
```markdown
**6 WOCHEN VERSCHWENDET** mit Module-System Versuchen:
- GameCore.js → Failed (Deployment issues)
- levels/rainbow.js → Failed (Import problems)
- obstacles/special.js → Failed (GitHub Actions)

**LÖSUNG**: Alles in index.html! 
- 8800+ Zeilen aber es FUNKTIONIERT
- Keine Module = Keine Import-Probleme
- KISS Principle wins again
```

### Three.js Specific Gotchas

#### Double Declaration Trap
```javascript
// ❌ DER KLASSIKER: hemisphereLight doppelt
const hemisphereLight = new THREE.HemisphereLight(...); // Zeile 824
// ... 200 Zeilen später ...
const hemisphereLight = new THREE.HemisphereLight(...); // CRASH!

// ✅ LÖSUNG: Unique Names
const mainHemisphereLight = new THREE.HemisphereLight(...);
const skyHemisphereLight = new THREE.HemisphereLight(...);
```

#### Material Property Mismatches
```javascript
// ❌ PROBLEM: MeshBasicMaterial hat kein 'emissive'
const material = new THREE.MeshBasicMaterial({
    emissive: 0xff0000  // ERROR!
});

// ✅ LÖSUNG: Richtiges Material verwenden
const material = new THREE.MeshLambertMaterial({
    emissive: 0xff0000  // OK!
});
```

## 🚀 Deployment Checkliste (Global)

Vor JEDEM Deployment:
- [ ] Backup erstellt (`./backup-essential.sh`)
- [ ] Tests laufen durch (`npm test`)
- [ ] Console.log Statements entfernt
- [ ] Branch in deploy.yml?
- [ ] API Keys in Environment Variables
- [ ] Docker Images gebaut und getestet
- [ ] Cache-Strategie definiert
- [ ] Rollback-Plan dokumentiert

Nach Deployment:
- [ ] Deployment verifiziert (`curl -I https://domain`)
- [ ] CDN Cache geleert (falls nötig)
- [ ] Smoke Tests durchgeführt
- [ ] Monitoring aktiviert
- [ ] User Feedback Channel offen

---

## 📊 Project-Specific Optimizations

### EndlessRunner - Gesture Control Workflow mit MCP
1. **Development Phase**
   - Context7 MCP für MediaPipe/Three.js Docs
   - Filesystem MCP für rapid iteration
   - Memory MCP für State-Tracking

2. **Testing Phase**
   - Playwright MCP für automated Gesture Tests
   - Performance Monitor MCP für FPS Tracking
   - Git MCP für Version Control

3. **Deployment Phase**
   - GitHub MCP für Auto-Deploy
   - Fetch MCP für CDN Verification
   - Brave Search für Error Research

### VetScan Pro - 3D Medical Visualization Pipeline
1. **Asset Creation Phase**
   - Blender MCP für 3D-Modell-Export
   - ImageMagick für Texture-Optimierung
   - Filesystem MCP für Multi-Quality GLB Management

2. **Implementation Phase**
   - Context7 MCP für Three.js r128 Docs
   - Medical Shader Generation (X-Ray, MRI, Ultrasound, Thermal)
   - Progressive Loading System (High/Medium/Low Quality)

3. **Educational Content**
   - Dr. Eule Mentor-System Implementation
   - Comparison Tables (Normal vs. Measured Values)
   - Achievement & Progress Tracking mit localStorage

### Optimale MCP Pipeline für Game Development
```bash
# 1. Research Phase
mcp.context7("Three.js v0.150 raycasting")
mcp.brave_search("MediaPipe gesture boundaries")

# 2. Implementation
mcp.filesystem.edit("index.html")
mcp.git.commit("Feature: Improved gesture detection")

# 3. Testing
mcp.playwright.test("gesture-control.spec.js")
mcp.memory.track("performance_metrics")

# 4. Deployment
mcp.github.create_pr("Feature complete")
mcp.github.merge_and_deploy()
```

### EndlessRunner MCP Cheat Sheet
| Aufgabe | MCP Server | Command |
|---------|------------|---------|
| Code ändern | filesystem | Edit index.html |
| Testen | playwright | Run gesture tests |
| Commit | git | Auto-commit changes |
| Deploy | github | Push to main |
| Docs | context7 | Get Three.js docs |
| Debug | memory | Track game state |
| Assets | imagemagick | Optimize sprites |
| Search | brave | Find solutions |

---

## 🏃 EndlessRunner Spezifische Beiträge zu diesem Dokument

### Was EndlessRunner zur globalen Knowledge Base beiträgt:

1. **Game Initialization Best Practices**
   - Race Condition Prevention mit Fallback Pattern
   - Single Source of Truth für Init
   - WebGL Context Management
   - Shader Compilation Validation

2. **Gesture Control Evolution (MediaPipe)**
   - TensorFlow → MediaPipe Migration
   - Smoothing Logic Pitfalls
   - Mirror-Korrektur für intuitive Steuerung
   - Boundary Optimization durch User Testing
   - Debug-Visibility Importance

3. **Performance Disaster Prevention**
   - Console.log Frame-by-Frame Killer
   - CSP Violations mit Audio System
   - Multiple Initialization Chaos
   - Memory Leaks durch Event Listeners

4. **Three.js Hard-Won Lessons**
   - CDN Version Migration (r150+ Changes)
   - Double Declaration Traps
   - Material Property Mismatches
   - Frustum Culling ohne BoundingSphere
   - WebGL Uniform Errors

5. **Version Management Reality Check**
   - 6 Wochen Module-System Failure
   - KISS Principle Victory (8800 Zeilen aber funktioniert!)
   - GitHub Actions Integration Issues
   - Single File vs. Module Architecture

6. **Critical Bug Patterns**
   - Missing Comma Syntax Errors (3x in 2 Tagen!)
   - startGame Function Race Conditions
   - Game Over/Victory Freeze Issues
   - Z-Index Overlay Conflicts

---

## 🏥 VetScan Pro Spezifische Beiträge zu diesem Dokument

### Was VetScan Pro zur globalen Knowledge Base beiträgt:

1. **Educational Game Design Patterns**
   - Scaffolded Learning mit Dr. Eule Mentor
   - Comparison-Based Learning (Normal vs. Gemessen)
   - Immediate Feedback mit Erklärungen
   - Progressive Difficulty System

2. **3D Web Pipeline Best Practices**
   - Blender MCP Integration Workflow
   - Multi-Quality GLB Export Strategy
   - Progressive Model Loading
   - Medical Visualization Shaders

3. **Version Management für Multi-Version Projects**
   - Beta/Recommended/Experimental Strategy
   - Landing Page mit klarem Visual Hierarchy
   - Direct URL Access für Development

4. **Three.js CDN Troubleshooting**
   - unpkg vs. cdnjs Unterschiede
   - Global vs. THREE Namespace Issues
   - Script Loading Timing Problems
   - Compatibility Layer Solutions

5. **Medical Accuracy als Feature**
   - 200+ recherchierte Tierwerte
   - Realistische Krankheitsbilder
   - Farbcodierung für Lerneffekt
   - Achievement System mit Lernzielen

6. **Docker Pipeline für Asset Generation**
   - Blender → GLB → Optimizer → Shader Pipeline
   - Automated Quality Variations
   - Medical Shader Generation

---

**Letzte Aktualisierung**: 23.08.2025  
**Maintainer**: Claude Code & Team  
**Version**: 2.4.0 - Erweitert mit Supabase Backend, Hostinger Hosting & GitHub Actions Deployment  

*Dieses Dokument wird kontinuierlich erweitert basierend auf Erkenntnissen aus allen Projekten.*

### EndlessRunner Quick Links
- **Projekt Übersicht**: Siehe "🎮 AKTIVE PROJEKTE ÜBERSICHT"
- **Game Initialization**: Siehe "Critical Game Initialization Patterns"
- **Gesture Control**: Siehe "Gesture Control Evolution"
- **Performance Issues**: Siehe "Game Loop & Performance Disasters"
- **Three.js Gotchas**: Siehe "Three.js Specific Gotchas"
- **Troubleshooting Docs**: 
  - `/coding/EndlessRunner/TROUBLESHOOTING_WEBGL_2025.md`
  - `/coding/EndlessRunner/GESTURE_TROUBLESHOOTING_COMPLETE.md`

### VetScan Pro Quick Links
- **Projekt Übersicht**: Siehe Abschnitt "🎮 AKTIVE PROJEKTE ÜBERSICHT"
- **Educational Patterns**: Siehe "🎓 Educational Game Development Patterns"
- **3D Pipeline**: Siehe "Blender to Web 3D Pipeline"
- **Troubleshooting**: Siehe "Three.js CDN Strategy"
- **Docker Setup**: Siehe "VetScan Pro 3D Asset Pipeline Docker Setup"

### Wichtige Referenzen
- **EndlessRunner Docs**: `/coding/EndlessRunner/MCP_TIPS.md`
- **Zeichenapp Troubleshooting**: `/coding/zeichenapp/TROUBLESHOOTING.md`
- **Global MCP Config**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Project Configs**: `[project]/CLAUDE.md`