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

## MCP (Model Context Protocol)

### Projekt-spezifische MCP-Konfigurationen

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

#### Endless Runner Spiel
**Zweck**: Browser-basiertes Endless Runner mit Leaderboard

**Empfohlene MCP-Server**:
- **Redis Docker**: Schnelle Leaderboard-Speicherung
- **PostgreSQL MCP**: Persistente Spielstände
- **Godot MCP**: Game Engine Integration
- **WebSocket Server**: Realtime Multiplayer

**Docker-Setup**:
```yaml
services:
  redis:
    image: redis:alpine
    command: redis-server --appendonly yes
    volumes:
      - ./redis-data:/data
      
  game-api:
    image: node:18-alpine
    volumes:
      - ./game-server:/app
    environment:
      REDIS_URL: redis://redis:6379
```

#### Tierarzt-Spiel für Kinder
**Zweck**: Educational Game mit interaktiven Lernmodulen

**Empfohlene MCP-Server**:
- **Dialogflow/Rasa Docker**: Interaktive Chatbots
- **Unity WebGL Server**: Game Hosting
- **PostgreSQL**: Termin- und Tierdaten
- **NGINX**: Static Asset Serving

### Globale MCP Best Practices

1. **Security First**
   - Niemals API Keys hardcoden
   - Environment Variables für Secrets
   - Read-only Mounts wo möglich

2. **Performance Optimierung**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 512M
   ```

3. **Container Isolation**
   - Ein Service pro Container
   - Explizite Network-Policies
   - Volume-Mounts minimieren

---

## Docker Integration

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

### Hostinger Deployment
**WICHTIG**: Hostinger hat aggressives CDN-Caching!
- Details siehe: `zeichenapp/HOSTINGER_TIPPS.md`
- Nach Deployment: Cache im hPanel leeren
- FTP-Deploy braucht `security: loose`

---

## Frontend Development

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

### Manuelle Test-Checkliste
Nach JEDER Code-Änderung:
1. [ ] Core Features funktionieren
2. [ ] Keine Console Errors
3. [ ] Mobile Responsiveness
4. [ ] Cross-Browser Testing (Chrome, Safari, Firefox)
5. [ ] Performance Metrics akzeptabel

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

#### Ultimate Disaster - Falsche App geladen (Zeichenapp)
**Problem**: VetScan Pro statt JOE FLOW APP wurde angezeigt
**Ursache**: Extreme Cache-Kontamination + BMAD Method
**Lösung**: Complete Rollback, Nuclear Cache Clear
**Details**: `zeichenapp/TROUBLESHOOTING.md` Section "ULTIMATE DISASTER"

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
- `TierarztSpiel/TROUBLESHOOTING.md` - Unity WebGL Problems

### Quick Links zu kritischen Sections
1. **Cache-Probleme**: → HOSTINGER_TIPPS.md Section 7 & 11
2. **Deployment Issues**: → deploy.yml Branch-Config
3. **Debug Popups**: → TROUBLESHOOTING.md Ultimate Disaster
4. **Performance**: → CLAUDE.md Performance Optimizations
5. **MCP Setup**: → MCP-SETUP.md für Konfiguration

---

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

**Letzte Aktualisierung**: 23.08.2025
**Maintainer**: Claude Code & Team
**Version**: 1.0.0

*Dieses Dokument wird kontinuierlich erweitert basierend auf Erkenntnissen aus allen Projekten.*