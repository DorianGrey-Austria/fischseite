# Troubleshooting: GitHub Actions Deployment & Transparenz Probleme

## 🚨 KRITISCHES DEPLOYMENT PROBLEM (4+ Stunden Debugging)

### **Problem:** GitHub Actions läuft ÜBERHAUPT NICHT
- **Symptom:** "Get started with GitHub Actions" Seite statt Workflow-Runs
- **Vergleich:** EndlessRunner2 hat 720 erfolgreiche Runs ✅, Fischseite hat 0 Runs ❌
- **Impact:** Alle Deployments fehlgeschlagen, keine Live-Updates auf vibecoding.company

### **Root Cause Analysis:**
1. **Repository-Level Problem** - GitHub erkennt Workflows nicht
2. **Möglicherweise Fork-Status** - Actions standardmäßig deaktiviert
3. **Workflow-Parsing Fehler** - YAML nicht korrekt interpretiert
4. **Branch/Permissions Problem** - Default branch oder Settings Issue

### **Lösungsversuche (chronologisch):**

#### **Versuch 1-3:** Komplexe Workflow-Debugging (FEHLGESCHLAGEN)
- Multiple YAML-Revisionen mit verschiedenen Syntax-Varianten
- FTP-Konfiguration Optimierungen (server vs FTP_HOST, etc.)
- **Ergebnis:** Workflows wurden nie von GitHub erkannt

#### **Versuch 4:** Repository Settings Deep-Check (TEILWEISE ERFOLGREICH)
- ✅ Actions sind enabled
- ✅ Secrets sind konfiguriert (FTP_SERVER, FTP_USERNAME, etc.)
- ✅ Main branch ist default branch
- ❌ Workflows triggern immer noch nicht

#### **Versuch 5:** MASTER FIX - EndlessRunner2 Template (IN PROGRESS)
- ❌ Alte problematische Workflows gelöscht (deploy.yml, test-actions.yml)
- ✅ Neue bewährte Workflows erstellt:
  - `ultra-simple-test.yml` - Minimaler Test ohne Abhängigkeiten
  - `hostinger-deploy.yml` - Bewährte FTP-Konfiguration mit workflow_dispatch
- ✅ VERSION 2.7 deployed mit grünem Banner für Deployment-Beweis
- **Status:** Waiting for GitHub Actions to trigger...

### **Wenn GitHub Actions immer noch nicht funktioniert:**

#### **Backup Plan A: Repository Settings Nuclear Fix**
1. Actions komplett deaktivieren und wieder aktivieren
2. Repository Permissions Reset
3. Manual Workflow Trigger via GitHub Web UI

#### **Backup Plan B: Alternative Deployment**
1. **Netlify/Vercel Migration** - Instant deployment ohne FTP
2. **Manual FTP Upload** - Direct rsync/FileZilla als Fallback
3. **GitHub Pages** - Kostenlose Alternative mit automatischem Deployment

### **Lessons Learned für alle zukünftigen Projekte:**

#### **Was NICHT funktioniert:**
- ❌ Komplexe Multi-Step Workflows beim ersten Setup
- ❌ Custom YAML ohne bewährte Basis
- ❌ FTP_HOST vs FTP_SERVER Varianten mixing
- ❌ Stundenlange Debugging ohne funktionierende Baseline

#### **Was funktioniert (EndlessRunner2 Proven):**
- ✅ Minimaler Test-Workflow ZUERST
- ✅ workflow_dispatch für manuelles Triggering
- ✅ SamKirkland/FTP-Deploy-Action@v4.3.5 (latest stable)
- ✅ IP-Adresse statt Domain für FTP_SERVER
- ✅ Ultra-einfache erste Version, dann iterativ verbessern

#### **5-Minuten Setup Template für zukünftige Projekte:**
```yaml
name: 🚀 Deploy to Hostinger
on:
  push:
    branches: [ main ]
  workflow_dispatch:
jobs:
  deploy:
    name: 🎉 Deploy Website
    runs-on: ubuntu-latest
    steps:
    - name: 🚚 Get latest code
      uses: actions/checkout@v4
    - name: 📂 Deploy to Hostinger via FTP
      uses: SamKirkland/FTP-Deploy-Action@v4.3.5
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./
        server-dir: /public_html/
```

---

## 🎨 TRANSPARENZ PROBLEME: Logo und Fischen (Desktop & Mobil)

## Aktueller Status
- Logo wird GIF-first geladen (`bilder/logo neu 3d.gif`) mit JPG-Fallback.
- Transparenz per `mix-blend-mode: multiply` + `opacity` an allen Logo-Varianten (Header/Hero/Footer/Watermarks).
- GIF-Overlay-System (`.gif-overlay-el`) für Karten/Bilder vorhanden; Demo auf erstem Galerie-Bild.
- Layout-/Z-Index-Überlagerung an der Galerie-Überschrift behoben.
- Fischrichtungen korrigiert (Divider rechts→links, Hero-Fische rechts→links, weißer Skalar links→rechts). Mobile Animationen reduziert.

## Problemstellung
- Assets mit weißem Hintergrund (JPG/GIF) wirken „hart“ auf farbigen Hintergründen.
- Auf Mobil/verschiedenen Hostings kommen zusätzlich Dateinamen-/MIME-/Fallback-Themen hinzu.

## Bisherige Versuche & Erkenntnisse
1) Reine JPG/PNG-Einbindung
   - Pro: universell, schnell
   - Contra: JPG ohne Alpha; PNG braucht echte Transparenz im Export
2) AVIF/WebP Varianten
   - Pro: moderne Kompression, teils Alpha
   - Contra: Hosting/MIME/Kompatibilität erfordern Fallbacks
3) GIF mit `opacity`
   - Pro: simpel
   - Contra: Weiß bleibt sichtbar, keine Farbmischung
4) GIF mit `mix-blend-mode`
   - Pro: Weiß verschwindet auf hellem Grund (multiply), dunkle über dunklem Grund (screen)
   - Contra: abhängig vom Untergrund; nicht „echte“ Transparenz
5) Fallback-Kaskade und Naming
   - Erkenntnis: Einheitliche, kleingeschriebene Dateinamen ohne Leerzeichen reduzieren 404/Case-Probleme erheblich

## Empfohlene Ziel-Lösung (Senior-Empfehlung)
- Statisch: Logo als PNG/WebP mit transparentem Hintergrund exportieren (echte Alpha-Transparenz)
- Animiert: Fische & animiertes Logo als WebM (mit Alpha) oder APNG exportieren
- Fallback-Kaskade: WebM→APNG→GIF (mit `mix-blend-mode`)→PNG/JPG
- Naming: `kebab-case`, keine Leerzeichen, z. B. `logo-neu-3d.webp`
- Hosting: korrekte MIME-Types, Cache-Invalidierung bei Asset-Updates

## Was wir jetzt konkret geändert haben
- Logo auf GIF-first umgestellt (Header/Hero/Footer/Watermark) mit JPG-Fallback
- Transparenz-„Weichzeichnung“ über `mix-blend-mode: multiply; opacity: 0.9–0.95`
- `.gif-overlay-el` eingeführt (absolute Positionierung, Blend-Modi, variable Opazität) und als Beispiel auf erster Galerie-Karte eingesetzt
- Mobile Performance reduziert; Überschneidung der Galerie-Überschrift beseitigt

## Nächste sinnvolle Schritte
1) Finale Export-Pipeline
   - Logo: `logo-neu-3d.webp` mit echtem Alpha
   - Animation: kurze `*.webm` mit Alpha, 1–2s Loop; Fallback `*.gif`
2) Vereinheitlichung
   - Alle Referenzen auf `logo-neu-3d.webp` umstellen; GIF/JPG als Fallbacks
   - Alle Dateinamen in `bilder/` auf `kebab-case` konsolidieren
3) Kompatibilität & Performance
   - `prefers-reduced-motion` respektieren
   - Long-term caching + Cache-Bust (Query-Hash) bei Assetwechsel

---

# 🚀 GitHub Actions & Supabase Integration - GELÖST! (24.09.2025)

## ✅ GITHUB ACTIONS → HOSTINGER DEPLOYMENT

### **Status:** FUNKTIONIERT ✅
- Workflow: `.github/workflows/deploy.yml` korrekt konfiguriert
- Secrets: FTP_HOST, FTP_USERNAME, FTP_PASSWORD, FTP_PATH korrekt gesetzt
- Test-Deployment V2.1 erfolgreich getriggert (commit: b06d7de)

### **Lösung:**
Das GitHub Actions System **funktionierte bereits!** Das Problem lag nicht am Workflow, sondern an:
1. **Fehlende Diagnostik:** Keine Überprüfung ob Deployment tatsächlich läuft
2. **Cache-Probleme:** Browser/CDN Cache verschleiert erfolgreiche Deployments
3. **Missing Verification:** Keine systematische Überprüfung der Live-Website

### **Deployment Verification Protocol:**
```bash
# 1. Nach Push: GitHub Actions prüfen (sollte grün werden)
# 2. Warten: 2-5 Minuten für FTP Upload
# 3. Cache umgehen: Inkognito-Modus oder Hard-Refresh
# 4. Version prüfen: Quelltext auf VERSION-Kommentar prüfen
```

---

## 🗄️ SUPABASE INTEGRATION - PROBLEM IDENTIFIZIERT

### **Status:** Guestbook ✅ / Highscores ❌

### **Test-Ergebnisse (direkter REST API Test):**
```
🔗 Supabase Connection: ✅ FUNKTIONIERT
💬 Guestbook: ✅ PERFEKT (5 Einträge, Read/Write)
🏆 Highscores: ❌ Tabelle nicht gefunden (404)
📊 Gesamt: 2/5 Tests erfolgreich
```

### **Root Cause:**
Die `highscores` Tabelle wurde **nie erstellt**. Das Guestbook funktioniert, weil `SUPABASE_SETUP.sql` ausgeführt wurde, aber `HIGHSCORE_SETUP.sql` wurde vergessen.

### **Sofort-Lösung:**
1. Supabase Dashboard → SQL Editor
2. `HIGHSCORE_SETUP.sql` kopieren und ausführen
3. Test wiederholen: `node test-supabase-direct.js`
4. **Erwartet:** 5/5 Tests erfolgreich

### **Nach der Lösung verfügbar:**
- 🏆 Vollständiges Highscore-System
- 🌟 Perfect Score Detection (20/20 Items)
- 📊 Live-Rangliste mit Anti-Spam-Schutz
- 🎮 8 Test-Highscores bereits eingefügt

---

## 🧪 TESTING & VERIFICATION

### **Erfolgreiche Test-Scripts:**
- `node test-supabase-direct.js` - Direct REST API Test
- `create-highscore-table.js` - Tabellen-Existenz-Check
- Playwright Tests verfügbar für End-to-End Testing

### **Deployment Pipeline Status:**
```
✅ Git Repository: Connected & Working
✅ GitHub Actions: Workflow läuft automatisch
✅ FTP Secrets: Korrekt konfiguriert
✅ Supabase Connection: API funktioniert
⏳ Highscores: Warten auf SQL-Ausführung
```

---

## 📋 NÄCHSTE SCHRITTE

### **Für vollständige Funktionalität:**
1. **Supabase:** `HIGHSCORE_SETUP.sql` in SQL Editor ausführen
2. **Testing:** Playwright Tests zur Verifikation
3. **Go-Live:** Cache-Clear Ankündigung für User
4. **Monitoring:** Performance und Error-Tracking

### **Langfristige Optimierungen:**
- Monitoring Dashboard für Deployment-Status
- Automatisierte Cache-Invalidierung
- Error-Alerting für Failed Deployments
- User-Feedback System für Cache-Probleme

## Quick-HowTo: Blend-Regeln
- Heller Hintergrund: `mix-blend-mode: multiply; opacity: .9`
- Dunkler Hintergrund: `mix-blend-mode: screen; opacity: .8`
- Feintuning pro Element: Inline `style="--gif-overlay-opacity: 0.45"` bei `.gif-overlay-el`

