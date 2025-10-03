#!/bin/bash
# Automatisches Backup-System für Mushroom Manager
# Erstellt Backup-Commits vor kritischen Änderungen

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_BRANCH="backup-$TIMESTAMP"

echo "🔄 Creating automatic backup..."

# 1. Aktuellen Stand committen falls uncommitted changes
git add . 2>/dev/null
if ! git diff --cached --exit-code > /dev/null; then
    git commit -m "🔄 Auto-backup before changes - $TIMESTAMP" || echo "No changes to commit"
fi

# 2. Backup Branch erstellen
git branch "$BACKUP_BRANCH"

# 3. Backup Info speichern
echo "# AUTOMATIC BACKUP - $TIMESTAMP" >> BACKUP-LOG.md
echo "Backup Branch: $BACKUP_BRANCH" >> BACKUP-LOG.md
echo "Current Commit: $(git rev-parse HEAD)" >> BACKUP-LOG.md
echo "Status: Enhanced Design + Working API" >> BACKUP-LOG.md
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