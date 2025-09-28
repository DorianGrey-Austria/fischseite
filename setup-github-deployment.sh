#!/bin/bash

# 🚀 GitHub Actions Deployment Setup Script
# Automatisiert die komplette Einrichtung für neue Projekte
# Usage: ./setup-github-deployment.sh projektname

set -e

PROJECT_NAME="$1"
CURRENT_DIR=$(pwd)

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 GitHub Actions Deployment Setup${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""

# Check if project name is provided
if [ -z "$PROJECT_NAME" ]; then
    echo -e "${RED}❌ Fehler: Projektname erforderlich${NC}"
    echo "Usage: ./setup-github-deployment.sh projektname"
    echo "Beispiel: ./setup-github-deployment.sh fischseite"
    exit 1
fi

echo -e "${GREEN}📁 Setting up deployment for project: $PROJECT_NAME${NC}"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Fehler: Kein Git-Repository gefunden${NC}"
    echo "Führe dieses Script im Root-Verzeichnis deines Git-Projekts aus."
    exit 1
fi

# Create .github/workflows directory
echo -e "${BLUE}📂 Creating .github/workflows directory...${NC}"
mkdir -p .github/workflows

# Create the deployment workflow
WORKFLOW_FILE=".github/workflows/hostinger-deploy.yml"
echo -e "${BLUE}📝 Creating workflow file: $WORKFLOW_FILE${NC}"

cat > "$WORKFLOW_FILE" << EOF
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
        server: \${{ secrets.FTP_SERVER }}
        username: \${{ secrets.FTP_USERNAME }}
        password: \${{ secrets.FTP_PASSWORD }}
        local-dir: ./
        server-dir: /public_html/$PROJECT_NAME/
        exclude: |
          **/.git*
          **/.git*/**
          **/node_modules/**
          **/test-*
          **/.github/**
        dry-run: false
        log-level: verbose
        timeout: 60000
        security: loose
EOF

echo -e "${GREEN}✅ Workflow file created successfully!${NC}"
echo ""

# Create deployment documentation
DOC_FILE="DEPLOYMENT.md"
echo -e "${BLUE}📖 Creating deployment documentation...${NC}"

cat > "$DOC_FILE" << EOF
# 🚀 Deployment Setup für $PROJECT_NAME

## GitHub Actions Status
- **Target URL:** https://vibecoding.company/$PROJECT_NAME/
- **Workflow:** \`.github/workflows/hostinger-deploy.yml\`
- **Auto-Deploy:** Bei Push zu main branch

## Setup-Schritte (EINMALIG)

### 1. GitHub Actions aktivieren
1. Gehe zu: \`github.com/[username]/$PROJECT_NAME/actions\`
2. Falls "Get started with GitHub Actions" erscheint:
   - Klicke "set up a workflow yourself"
   - Lösche den Beispiel-Code
   - Kopiere den Inhalt aus \`hostinger-deploy.yml\`
   - Speichere als \`hostinger-deploy.yml\`

### 2. Secrets konfigurieren
Gehe zu: \`Repository → Settings → Secrets and variables → Actions\`

**Erstelle diese 3 Secrets:**
\`\`\`
FTP_SERVER    = 145.223.112.234
FTP_USERNAME  = u123456789.vibecoding.company
FTP_PASSWORD  = [dein Hostinger-Passwort]
\`\`\`

### 3. Test-Deployment
\`\`\`bash
git add .
git commit -m "🚀 Initial deployment setup"
git push
\`\`\`

## Verifikation
- Actions Tab zeigt erfolgreichen Workflow-Run
- Website erreichbar unter: https://vibecoding.company/$PROJECT_NAME/

## Troubleshooting
- Siehe: \`GITHUB_ACTIONS_MASTER_GUIDE.md\`
EOF

echo -e "${GREEN}✅ Documentation created: $DOC_FILE${NC}"
echo ""

# Create .gitignore additions if not present
if [ ! -f ".gitignore" ]; then
    echo -e "${BLUE}📝 Creating .gitignore...${NC}"
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*

# Production builds
dist/
build/

# Environment files
.env
.env.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Test files
test-*.js
coverage/

# Temporary files
*.tmp
*.temp
EOF
else
    echo -e "${YELLOW}ℹ️ .gitignore already exists, skipping...${NC}"
fi

# Add and commit the changes
echo -e "${BLUE}📤 Committing setup files...${NC}"
git add .github/workflows/hostinger-deploy.yml
git add DEPLOYMENT.md
if [ ! -f ".gitignore" ]; then
    git add .gitignore
fi

git commit -m "🚀 Setup GitHub Actions deployment for $PROJECT_NAME

✅ Features:
- Auto-deploy to /public_html/$PROJECT_NAME/
- Hostinger FTP integration
- Workflow triggers on push to main
- Complete documentation included

🎯 Next steps:
1. Configure GitHub Secrets (see DEPLOYMENT.md)
2. Activate GitHub Actions via web UI
3. Push to trigger first deployment

🤖 Generated with deployment-setup script"

echo ""
echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo -e "${GREEN}==================${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. 🔐 Configure GitHub Secrets (see DEPLOYMENT.md)"
echo "2. 🚀 Activate GitHub Actions:"
echo "   └─ Go to: github.com/[username]/$PROJECT_NAME/actions"
echo "   └─ Set up workflow manually (copy from hostinger-deploy.yml)"
echo "3. 📤 Push to trigger deployment:"
echo "   └─ git push"
echo "4. 🌐 Verify at: https://vibecoding.company/$PROJECT_NAME/"
echo ""
echo -e "${YELLOW}📖 Full documentation: GITHUB_ACTIONS_MASTER_GUIDE.md${NC}"
echo -e "${GREEN}✨ Ready for deployment! Happy coding! ✨${NC}"