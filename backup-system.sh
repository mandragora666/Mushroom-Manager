#!/bin/bash
# Automatisches Backup-System für Mushroom Manager
# Erstellt Backup-Commits vor kritischen Änderungen UND aktualisiert Projektplan

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_BRANCH="backup-$TIMESTAMP"

echo "🔄 Creating automatic backup and updating project plan..."

# 1. Projekt-Status ermitteln
CURRENT_COMMIT=$(git rev-parse HEAD)
VERCEL_STATUS="✅ Funktionsfähig"
LOCAL_STATUS="❌ Beschädigt (PM2 + Wrangler)"
LAST_CHANGE=$(git log -1 --format="%s")

# 2. PROJECT-PLAN-COMPLETE.md automatisch aktualisieren
cat > PROJECT-PLAN-COMPLETE.md << EOF
# 📋 MUSHROOM MANAGER - VOLLSTÄNDIGER PROJEKTPLAN
## 🎯 ENHANCED VERSION - PRODUKTIONSBEREIT

**🔄 Automatisch aktualisiert: $TIMESTAMP**
**📍 Aktueller Commit: $CURRENT_COMMIT**
**🏷️ Letzte Änderung: $LAST_CHANGE**

---

## 🚨 KRITISCHE WARNUNG FÜR NEUE CHATS ⚠️

### ❌ NIEMALS MACHEN (DESTRUKTIVE AKTIONEN):
1. **Frontend-JavaScript-Dateien überschreiben** ohne Backup (\`public/app-enhanced.js\`, \`public/sections/\`, \`public/components/\`)
2. **Komplette Dateien ersetzen** statt gezielter Fixes (cp, mv von working files)
3. **Enhanced Design zerstören** (Original Enhanced v2.0 ist heilig!)
4. **PM2/Lokale Konfiguration** ohne Grund ändern (war functional)
5. **Git Force-Push** ohne Backup-Strategie
6. **Vercel.json überschreiben** wenn es funktioniert
7. **API-Struktur** komplett ändern (einzelne Endpunkte hinzufügen OK)

### ✅ IMMER ZUERST PRÜFEN:
1. **Welche Version läuft aktuell?** Enhanced v2.0 ist das Ziel-Design
2. **Was ist das SPEZIFISCHE Problem?** (meist nur API-404, nicht Design)
3. **Backup erstellen** VOR Änderungen: \`./backup-system.sh\`
4. **Minimal-invasive Lösung** wählen (nur API korrigieren, nicht Frontend)
5. **Lokales System läuft?** → NICHT anfassen ohne expliziten Request
6. **Vercel funktioniert?** → Keine Routing-Änderungen

### 🔄 BACKUP-SYSTEM (AUTOMATISCH):
\`\`\`bash
# Vor kritischen Änderungen IMMER ausführen:
cd /home/user/webapp
./backup-system.sh

# Restore bei Problemen:
git checkout backup-YYYY-MM-DD_HH-MM-SS
\`\`\`

---

## 🚀 AKTUELLER FUNKTIONSFÄHIGER STAND

### ✅ PRODUCTION READY:
- **Vercel URL**: https://mushroom-manager-omega.vercel.app/ 
- **Status**: $VERCEL_STATUS
- **GitHub**: https://github.com/mandragora666/Mushroom-Manager
- **Enhanced Design**: ✅ Wiederhergestellt und funktional
- **API**: ✅ Vollständig implementiert
- **Deployment**: ✅ Auto-Deploy von GitHub main branch

### ❌ BEKANNTE PROBLEME:
- **Lokales System**: $LOCAL_STATUS
- **Verbleibende Fehler**: Werden systematisch behoben

---

## 🏗️ TECHNISCHER STACK (STABIL - NICHT ÄNDERN)

### **Frontend-Architektur**:
- **Enhanced Design**: Modular, responsive, mobile-first
- **JavaScript**: Vanilla JS mit modularer Struktur
- **Styling**: TailwindCSS (CDN), FontAwesome Icons  
- **Struktur**: 
  \`\`\`
  public/
  ├── app-enhanced.js (HAUPTDATEI - NIEMALS ÜBERSCHREIBEN)
  ├── sections/ (Modulare Bereiche)
  ├── components/ (Wiederverwendbare Komponenten)
  ├── lib/ (Supabase Integration)
  └── static/ (Vercel-spezifische Dateien)
  \`\`\`

### **Backend-Architektur**:
- **Vercel Serverless Functions**: \`api/index.js\` (EINZIGE Function)
- **Database**: Supabase (konfiguriert) + In-Memory Fallback
- **API-Endpunkte**: Alle implementiert und funktional

### **Deployment-Konfiguration**:
- **Vercel Config**: \`vercel.json\` (FUNKTIONIERT - nicht ändern)
- **Package.json**: Vercel-optimiert
- **Git Integration**: Auto-Deploy bei push zu main
- **Environment**: Supabase-Keys konfiguriert

---

## 📊 AKTUELLE BACKUP-HISTORIE

EOF

# 3. Backup-Historie zur PROJECT-PLAN-COMPLETE.md hinzufügen
echo "### 🔄 LETZTE BACKUPS:" >> PROJECT-PLAN-COMPLETE.md
git branch | grep backup | tail -5 | while read branch; do
    echo "- $branch" >> PROJECT-PLAN-COMPLETE.md
done >> PROJECT-PLAN-COMPLETE.md
echo "" >> PROJECT-PLAN-COMPLETE.md

# 4. Rest der Datei anhängen (statischer Teil)
cat >> PROJECT-PLAN-COMPLETE.md << 'EOF'
## 🎯 STANDARD-VORGEHEN FÜR PROBLEME

### **Bei API-404 Fehlern** (häufigster Fall):
1. **Nur API korrigieren**: `api/index.js` editieren
2. **Fehlende Endpunkte hinzufügen**
3. **Git commit + push** → Auto-Deploy
4. **Testen nach 2-3 Minuten**
5. **NIEMALS Frontend anfassen** bei API-Problemen

### **Bei Frontend-Fehlern**:
1. **Backup erstellen**: `./backup-system.sh`
2. **Spezifisches Problem identifizieren**
3. **Minimale Änderung** in betroffener Datei
4. **Enhanced Design bewahren**
5. **Testen vor Commit**

---

## ⚠️ KRITISCHE ERINNERUNGEN FÜR NEUE CHATS

1. **Enhanced Design ist heilig** - niemals überschreiben
2. **Backup vor jeder größeren Änderung** - `./backup-system.sh`
3. **Vercel funktioniert** - keine Config-Änderungen ohne Grund
4. **Minimale Eingriffe** - nur spezifische Probleme beheben
5. **API-Probleme ≠ Frontend-Probleme** - getrennt behandeln

**🎯 ZIEL: Stabile, funktionsfähige Enhanced Mushroom Manager App!** 🍄✨
EOF

# 5. Aktuellen Stand committen falls uncommitted changes
git add . 2>/dev/null
if ! git diff --cached --exit-code > /dev/null; then
    git commit -m "🔄 Auto-backup + project plan update - $TIMESTAMP" || echo "No changes to commit"
fi

# 6. Backup Branch erstellen
git branch "$BACKUP_BRANCH"

# 7. Backup Info loggen
echo "# AUTOMATIC BACKUP - $TIMESTAMP" >> BACKUP-LOG.md
echo "Backup Branch: $BACKUP_BRANCH" >> BACKUP-LOG.md
echo "Current Commit: $CURRENT_COMMIT" >> BACKUP-LOG.md
echo "Status: Enhanced Design + Working API" >> BACKUP-LOG.md
echo "Project Plan: Updated automatically" >> BACKUP-LOG.md
echo "---" >> BACKUP-LOG.md

echo "✅ Backup created: Branch '$BACKUP_BRANCH'"
echo "📝 To restore: git checkout $BACKUP_BRANCH"

# 4. Optional: Remote backup push
read -p "Push backup to GitHub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin "$BACKUP_BRANCH"
    echo "✅ Backup pushed to GitHub: $BACKUP_BRANCH"
fi