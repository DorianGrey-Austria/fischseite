# 🚀 GitHub Actions Hostinger & Supabase Deployment Guide
**Universelle Tipps für alle Projekte - Basierend auf harten Lessons Learned**

---

## 📋 **GITHUB ACTIONS → HOSTINGER DEPLOYMENT**

### 🔧 **Grundsetup (funktioniert zuverlässig)**

#### 1. **GitHub Actions Workflow (.github/workflows/deploy.yml)**
```yaml
name: Deploy to Hostinger
on:
  push:
    branches: [ main, your-branch-name ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Deploy to Hostinger via FTP
      uses: SamKirkland/FTP-Deploy-Action@v4.3.5
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./
        server-dir: /public_html/
        dry-run: false
        log-level: verbose
        timeout: 60000
        security: loose
```

#### 2. **Hostinger FTP Credentials richtig konfigurieren**
```
FTP_SERVER: 145.223.112.XXX (IMMER IP-Adresse, NIE Domain!)
FTP_USERNAME: uXXXXXXXXX.domain.com (VOLLSTÄNDIGER Username)
FTP_PASSWORD: [dein-ftp-passwort]

❌ FALSCH: ftp://145.223.112.XXX
❌ FALSCH: domain.com
✅ RICHTIG: 145.223.112.XXX
```

### ⚠️ **Häufige Probleme & Lösungen**

#### **Problem 1: "ENOTFOUND" Error**
```
Error: getaddrinfo ENOTFOUND ***
```
**Lösung:**
- IP-Adresse statt Domain verwenden
- `ftp://` Prefix entfernen
- Hostinger Panel → FTP Accounts → Exact IP kopieren

#### **Problem 2: "Authentication failed"**
```
Error: 530 Login authentication failed
```
**Lösung:**
- FTP_USERNAME: Vollständigen Namen aus Hostinger Panel verwenden
- Kein Shortcut, keine Annahmen
- Bei Zweifeln: FTP-Passwort neu generieren

#### **Problem 3: "Permission denied"**
```
Error: 550 Permission denied
```
**Lösung:**
- `server-dir: /public_html/` (mit führendem und abschließendem Slash)
- Zielordner in Hostinger File Manager prüfen

### 🚨 **KRITISCHES CACHE-PROBLEM**

#### **Das Problem:**
- GitHub Actions deployed erfolgreich
- Server zeigt neue Version
- **ABER User sieht weiterhin alte Version!**

#### **Multi-Layer Cache Hölle:**
```
Browser Cache → CDN Cache → Service Worker → iOS Cache
    ↓             ↓              ↓           ↓
Alte Version  Alte Version   Alte Version  Alte Version
```

#### **Die Lösung: Deployment Verification Protocol**
```bash
# 1. IMMER Unmissable Banner deployen
<div style="position:fixed;top:0;left:0;right:0;background:#00ff00;
color:black;padding:10px;text-align:center;z-index:999999;">
VERSION X.Y.Z - Deployed: $(date)
</div>

# 2. Deployment Test Script
#!/bin/bash
echo "🔍 Testing Deployment..."
SERVER_VERSION=$(curl -s "https://domain.com/" | grep -o "VERSION [0-9.]*")
echo "Server shows: $SERVER_VERSION"
git log --oneline -1
```

#### **Golden Deployment Rules:**
1. **NIE mehr als 1 Version pro Session**
2. **Deploy → Wait 5 min → User Screenshot → Verify**
3. **User Screenshot ist die EINZIGE Wahrheit** (curl lügt!)
4. **Bei Cache-Problemen: Nuclear Clear Anleitung geben**

### 📱 **Cache Clear Anleitung für User**
```
Safari (iPad/iPhone):
1. Einstellungen → Safari → Verlauf löschen
2. Hard Refresh: Seite schließen → neu öffnen

Chrome:
1. Inkognito Modus verwenden
2. Oder: Einstellungen → Browserdaten löschen

PWA/Home Screen App:
1. App löschen vom Home Screen
2. Safari Cache löschen
3. Domain neu öffnen → "Zum Home-Bildschirm"
```

---

## 🗄️ **SUPABASE INTEGRATION**

### 🔧 **Grundsetup (funktioniert zuverlässig)**

#### 1. **Supabase Projekt Setup**
```sql
-- Standard Tabelle für App-Daten
CREATE TABLE app_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    data TEXT NOT NULL,
    user_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indizes für Performance
CREATE INDEX idx_app_data_user_id ON app_data(user_id);
CREATE INDEX idx_app_data_created_at ON app_data(created_at);

-- Auto-Update Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_app_data_updated_at
    BEFORE UPDATE ON app_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

#### 2. **Frontend Konfiguration**
```javascript
// supabase-config.js
window.SUPABASE_CONFIG = {
    url: 'https://xxx.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIs...'
};

// Supabase Client initialisieren
const supabaseClient = supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.anonKey
);

// Standard CRUD Operationen
async function saveData(title, data) {
    const userId = getUserId(); // Eigene User-ID Generierung
    const { data: result, error } = await supabaseClient
        .from('app_data')
        .insert({
            title: title,
            data: JSON.stringify(data),
            user_id: userId
        });
    return { result, error };
}

async function loadData(userId) {
    const { data, error } = await supabaseClient
        .from('app_data')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    return { data, error };
}
```

### 🛠️ **MCP Server Setup (Claude Desktop Integration)**

#### **Funktionierende Konfiguration:**
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=deinprojektref"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_xxx",
        "MCP_API_KEY": "sbp_xxx"
      }
    }
  }
}
```

#### **Wichtige MCP Lessons Learned:**
1. **Beide Environment Variables nötig**: `SUPABASE_ACCESS_TOKEN` UND `MCP_API_KEY` (gleicher Wert!)
2. **Immer npx verwenden**: Claude Desktop hat PATH-Probleme mit global installierten Paketen
3. **Official Package verwenden**: `@supabase/mcp-server-supabase` (nicht Community-Packages)
4. **Claude Desktop Neustart**: Nach Config-Änderungen immer Claude Desktop neu starten

### ⚠️ **Häufige Supabase Probleme**

#### **Problem 1: "Row Level Security" blockiert Writes**
```sql
-- RLS deaktivieren für Entwicklung
ALTER TABLE app_data DISABLE ROW LEVEL SECURITY;

-- Oder: Policy für Anonymous Access
CREATE POLICY "Public Access" ON app_data
FOR ALL USING (true);
```

#### **Problem 2: "Invalid API Key"**
- Anon Key vs Service Role Key verwechselt
- **Für Frontend**: Anon Key verwenden
- **Für Server/MCP**: Service Role Key verwenden

#### **Problem 3: "CORS Errors"**
- Supabase Dashboard → Settings → API
- Allowed origins konfigurieren: `*` für Entwicklung, spezifische Domains für Production

#### **Problem 4: "Connection refused"**
- Supabase Projekt pausiert nach Inaktivität
- Dashboard öffnen → Projekt "wake up"
- Bei kostenlosen Projekten: Regelmäßig verwenden

### 🔄 **User-ID Management System**
```javascript
// Robuste User-ID Generierung
function getUserId() {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('user_id', userId);
    }
    return userId;
}

// Error Handling mit Fallback
async function saveDataWithFallback(title, data) {
    try {
        // Zuerst Supabase versuchen
        const result = await saveToSupabase(title, data);
        return result;
    } catch (error) {
        console.warn('Supabase save failed, fallback to local:', error);
        // Fallback zu lokalem Speichern
        return saveToLocalStorage(title, data);
    }
}
```

---

## 🎯 **UNIVERSELLE BEST PRACTICES**

### 📋 **Deployment Checklist für JEDES Projekt**
1. **Pre-Deploy:**
   - [ ] Backup erstellt
   - [ ] Git status clean
   - [ ] Nur EINE Änderung geplant
   - [ ] JavaScript Syntax validiert (`node -c file.js`)

2. **Deploy:**
   - [ ] Unmissable Version Banner hinzugefügt
   - [ ] Deployment Script getestet
   - [ ] GitHub Actions erfolgreich

3. **Post-Deploy:**
   - [ ] 5 Minuten gewartet
   - [ ] Server Version per curl geprüft
   - [ ] User um Screenshot gebeten
   - [ ] Cache Clear Anleitung gegeben

### 🛡️ **Error Prevention**
```javascript
// Immer Konfiguration prüfen
if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url) {
    console.warn('Supabase not configured, using local storage');
    // Fallback zu lokalen Funktionen
}

// Graceful Degradation
const hasSupabase = window.SUPABASE_CONFIG && supabaseClient;
document.getElementById('cloudSaveBtn').style.display = hasSupabase ? 'block' : 'none';
```

### 📊 **Monitoring & Debugging**
```bash
# Deployment Test Script (für jedes Projekt anpassbar)
#!/bin/bash
echo "🔍 Testing Deployment..."
DOMAIN="https://domain.com"
VERSION=$(curl -s "$DOMAIN" | grep -o "VERSION [0-9.]*" | head -1)
echo "Live Version: $VERSION"
echo "Git Commit: $(git log --oneline -1)"

# Cache Test mit verschiedenen User Agents
echo "Testing Safari/iPad:"
curl -s -H "User-Agent: Mozilla/5.0 (iPad; CPU OS 14_0)" "$DOMAIN" | grep -o "VERSION [0-9.]*"
echo "Testing Chrome:"
curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0)" "$DOMAIN" | grep -o "VERSION [0-9.]*"
```

### 💡 **Pro Tips für alle Projekte**
1. **Version Banner immer grün/auffällig** → User kann nicht übersehen
2. **Deployment Timestamps** → Zeigt wann deployed wurde
3. **Browser Test Matrix** → Chrome, Safari, Firefox, Mobile alle testen
4. **Cache ist der Feind** → Immer von Multi-Layer Cache ausgehen
5. **User Screenshot = Truth** → Niemals curl/WebFetch vertrauen
6. **Eine Änderung = Eine Version** → Keine Feature-Bündel
7. **Golden Master Backup** → Immer eine funktionierende Version parat haben

---

## 🚨 **NOTFALL-PROTOKOLL**

### Wenn Deployment nicht funktioniert:
1. **Sofort stoppen** → Nicht noch mehr Versionen deployen
2. **GitHub Actions Logs prüfen** → Konkrete Fehlermeldung finden
3. **FTP Credentials validieren** → Hostinger Panel nochmal prüfen
4. **Zur letzten funktionierenden Version zurück**
5. **Problem isoliert lösen** → Nicht mehrere Baustellen gleichzeitig

### Wenn Supabase nicht funktioniert:
1. **Supabase Dashboard prüfen** → Projekt aktiv? RLS Policies?
2. **Browser Netzwerk Tab** → CORS/API Key Errors?
3. **MCP Server neu starten** → Claude Desktop komplett schließen/öffnen
4. **Fallback aktivieren** → Lokale Speicherung als Backup
5. **Schritt für Schritt debuggen** → Ein Problem nach dem anderen

---

**🎯 Dieser Guide basiert auf echten Problemen und bewährten Lösungen aus mehreren Projekten. Bei Unsicherheiten: Lieber konservativ vorgehen und testen!**