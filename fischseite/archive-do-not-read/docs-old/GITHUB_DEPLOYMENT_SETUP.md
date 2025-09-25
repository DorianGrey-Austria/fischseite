# 🚀 GitHub Actions → Hostinger Deployment Setup

Automatisches Website-Deployment direkt von GitHub zu Hostinger via FTP.

## 📋 Schritt 1: Hostinger FTP Credentials sammeln

### 1.1 Hostinger Control Panel öffnen
- Gehe zu [hpanel.hostinger.com](https://hpanel.hostinger.com)
- Logge dich in dein Hostinger Account ein

### 1.2 FTP Details finden
1. **Website auswählen** → Klicke auf deine Domain
2. **File Manager** → Gehe zu "Files" → "File Manager"
3. **FTP Details** → Oben rechts auf "FTP Access" klicken
4. **Credentials anzeigen** → "Show Details" klicken

### 1.3 Benötigte Informationen notieren:
```
FTP_HOST: ftp.yourdomain.com (oder ähnlich)
FTP_USERNAME: yourusername
FTP_PASSWORD: yourpassword
FTP_PATH: /public_html/ (meist der Standard-Pfad)
```

**Wichtig:** Notiere dir diese 4 Werte - du brauchst sie für GitHub!

---

## 🔒 Schritt 2: GitHub Repository Secrets konfigurieren

### 2.1 GitHub Repository öffnen
- Gehe zu deinem Fischseite Repository auf GitHub
- Klicke auf **"Settings"** (Repository-Settings, nicht Account-Settings)

### 2.2 Secrets hinzufügen
1. **Navigation:** Settings → Security → "Secrets and variables" → "Actions"
2. **Neue Secrets erstellen:** Klicke "New repository secret"
3. **4 Secrets hinzufügen:**

| Name | Value | Beispiel |
|------|-------|----------|
| `FTP_HOST` | Dein FTP Server | `ftp.yourdomain.com` |
| `FTP_USERNAME` | Dein FTP Username | `u123456789` |
| `FTP_PASSWORD` | Dein FTP Passwort | `dein-sicheres-passwort` |
| `FTP_PATH` | Upload-Pfad | `/public_html/` |

### 2.3 Secrets-Eingabe
- **Name:** Genau so eingeben wie in der Tabelle (Groß-/Kleinschreibung beachten!)
- **Secret:** Den entsprechenden Wert aus Hostinger
- **Add secret** klicken
- **Wiederholen** für alle 4 Secrets

**✅ Erfolgreich:** Du solltest jetzt 4 Secrets sehen: FTP_HOST, FTP_USERNAME, FTP_PASSWORD, FTP_PATH

---

## 🔄 Schritt 3: Deployment testen

### 3.1 Erste Deployment ausführen
1. **Code ändern:** Mache eine kleine Änderung an `index.html`
2. **Commit & Push:**
   ```bash
   git add .
   git commit -m "🚀 Test GitHub Actions Deployment"
   git push origin main
   ```

### 3.2 Deployment Status prüfen
1. **GitHub → Actions Tab** aufrufen
2. **"Deploy to Hostinger" Workflow** anklicken
3. **Live-Status** verfolgen (grün = Erfolg, rot = Fehler)

### 3.3 Website prüfen
- **Warten:** 2-5 Minuten nach erfolgreichem Deployment
- **Website aufrufen:** https://yourdomain.com
- **Änderung prüfen:** Ist deine Änderung sichtbar?

---

## 🛠️ Workflow Features

### Automatische Triggers
- **Push to main** → Automatisches Deployment
- **Merged Pull Request** → Automatisches Deployment

### File-Management
- **Deployment-Files:** HTML, JS, CSS, Images, Videos
- **Ausgeschlossen:** Tests, Docs, Node modules, Development files

### Build-Steps
- **Optional:** Node.js Setup falls package.json vorhanden
- **Optional:** Playwright Tests falls konfiguriert
- **Cleanup:** Entfernung von Development-Files vor Upload

---

## 🔧 Troubleshooting

### Häufige Probleme

#### ❌ "FTP connection failed"
**Lösung:**
- FTP_HOST korrekt? (oft `ftp.yourdomain.com`)
- Username/Password richtig aus Hostinger kopiert?
- Hosting aktiv und FTP enabled?

#### ❌ "Upload path not found"
**Lösung:**
- FTP_PATH meist `/public_html/`
- Manche Hoster verwenden `/htdocs/` oder `/www/`
- In Hostinger File Manager nachschauen

#### ❌ "Permission denied"
**Lösung:**
- FTP User hat Upload-Rechte?
- Ziel-Ordner existiert und ist beschreibbar?

#### ❌ Website zeigt alte Version
**Lösung:**
- Browser-Cache löschen (Cmd+Shift+R / Ctrl+Shift+R)
- 5-10 Minuten warten (DNS Propagation)
- Hostinger Cache-Einstellungen prüfen

### Debug-Tipps
1. **GitHub Actions Logs** detailliert durchlesen
2. **FTP Details** in Hostinger nochmal prüfen
3. **Secrets** neu eingeben falls Fehler
4. **Test mit kleiner Änderung** durchführen

---

## 🎉 Erfolgreich eingerichtet!

**Workflow:** Code → Git Push → GitHub Actions → FTP Upload → Live Website

**Vorteile:**
- ✅ Automatisch bei jedem Push
- ✅ Keine lokalen Deployment-Schritte
- ✅ Deployment-History in GitHub
- ✅ Rollback via Git möglich
- ✅ Team-Collaboration ready

**Nächste Schritte:**
- Custom Domain SSL-Zertifikat prüfen
- Performance-Optimierungen aktivieren
- Backup-Strategy implementieren

---

*🌐 Deine Fischseite wird jetzt automatisch deployed! Viel Spaß beim Entwickeln!*