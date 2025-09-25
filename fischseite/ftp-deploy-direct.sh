#!/bin/bash

echo "🚀 DIREKTES FTP-DEPLOYMENT ZU VIBECODING.COMPANY"
echo "================================================"

# FTP Credentials (aus deinen GitHub Secrets)
FTP_HOST="145.223.112.234"
FTP_USER="u265545399.vibecoding.company"
echo "📡 Verbinde zu $FTP_HOST..."

# Upload alle wichtigen Dateien
echo "📁 Uploade Fischseite-Dateien..."

# Verwende curl für FTP-Upload
curl -T "index.html" ftp://$FTP_HOST/public_html/ --user "$FTP_USER" -v
curl -T "smart-fish-system.js" ftp://$FTP_HOST/public_html/ --user "$FTP_USER" -v
curl -T "aquarium-collector-game.js" ftp://$FTP_HOST/public_html/ --user "$FTP_USER" -v
curl -T "video-preloader.js" ftp://$FTP_HOST/public_html/ --user "$FTP_USER" -v
curl -T "highscore-display.js" ftp://$FTP_HOST/public_html/ --user "$FTP_USER" -v

echo "✅ FTP-Upload abgeschlossen!"
echo "🌐 Teste: https://vibecoding.company/"
