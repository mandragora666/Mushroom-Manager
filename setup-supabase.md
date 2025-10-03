# Supabase Setup für Mushroom Manager

## 1. Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle einen kostenlosen Account
3. Klicke "New Project"
4. Wähle eine Organisation oder erstelle eine neue
5. Projekt-Details:
   - **Name**: `mushroom-manager` 
   - **Database Password**: Wähle ein sicheres Passwort
   - **Region**: Europe (Frankfurt) für beste Performance

## 2. Datenbank Schema einrichten

1. Gehe zu **SQL Editor** im Supabase Dashboard
2. Kopiere den Inhalt aus `database-schema.sql` 
3. Führe das SQL-Script aus (Run-Button)
4. Überprüfe, dass alle Tabellen erstellt wurden:
   - `protocols`
   - `protocol_entries` 
   - `wiki_articles`
   - `wiki_categories`
   - `inventory`

## 3. API-Keys kopieren

1. Gehe zu **Settings > API**
2. Kopiere folgende Werte:
   - **Project URL**: `https://[project-ref].supabase.co`
   - **anon public key**: `eyJ...` (langer String)
   - **service_role key**: `eyJ...` (noch längerer String - nur für Server!)

## 4. Environment Variables einrichten

### Für lokale Entwicklung:
Erstelle `.env.local` Datei:
```bash
SUPABASE_URL=https://[dein-projekt].supabase.co
SUPABASE_ANON_KEY=eyJ[dein-anon-key]
```

### Für Vercel Production:
1. Gehe zu Vercel Dashboard > Project Settings > Environment Variables
2. Füge hinzu:
   - `SUPABASE_URL` = `https://[dein-projekt].supabase.co`
   - `SUPABASE_ANON_KEY` = `eyJ[dein-anon-key]`

## 5. Row Level Security (RLS) konfigurieren

Für Produktionsumgebung empfohlen (erstmal deaktiviert für Entwicklung):

```sql
-- RLS aktivieren (später)
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_entries ENABLE ROW LEVEL SECURITY; 
ALTER TABLE wiki_articles ENABLE ROW LEVEL SECURITY;

-- Policies erstellen (Beispiel - alle können lesen/schreiben)
CREATE POLICY "Public access" ON protocols FOR ALL USING (true);
CREATE POLICY "Public access" ON protocol_entries FOR ALL USING (true);
CREATE POLICY "Public access" ON wiki_articles FOR ALL USING (true);
```

## 6. Test der Integration

Nach dem Setup kannst du testen:

```bash
# API-Endpunkt testen
curl http://localhost:3001/api/protocols

# Dashboard-Stats mit echten Daten
curl http://localhost:3001/api/dashboard/stats
```

## 7. Troubleshooting

### Häufige Probleme:

**CORS-Fehler:**
- Überprüfe, dass API-Keys korrekt gesetzt sind
- Stelle sicher, dass `.env.local` in `.gitignore` steht

**Verbindungsfehler:**
- Überprüfe Supabase Project URL
- Stelle sicher, dass Projekt nicht pausiert ist (kostenloses Tier)

**SQL-Fehler:**
- Überprüfe, dass alle Tabellen korrekt erstellt wurden
- Schaue in Supabase Dashboard > Table Editor