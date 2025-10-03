# 🍄 Mushroom Manager

Eine moderne, responsive Web-Anwendung für die professionelle Pilzzucht-Verwaltung. Entwickelt mit Hono Framework und Cloudflare Pages.

## 🌟 Aktuelle Features

### ✅ Implementiert
- **📊 Dashboard** - Übersicht über aktive Protokolle und Statistiken
- **📋 Zuchtprotokoll-Verwaltung** - Dokumentation und Verfolgung von Zuchtprojekten  
- **📚 Wiki & Pilzsorten** - Umfangreiche Datenbank mit Pilzsorten und Substratrezepten
- **📱 Mobile-optimiert** - Responsive Design mit Bottom-Navigation für Smartphones
- **🗄️ D1 Datenbank** - SQLite-basierte Datenpersistierung mit Cloudflare D1
- **🎨 Light Theme** - Modernes, sauberes Design mit Glassmorphism-Effekten

### 🔄 In Entwicklung
- **📦 Inventarverwaltung** - Materialien und Lagerbestand verwalten
- **🧪 Kulturen-Management** - Agar-Platten, Flüssigkulturen und Sporensspritzen
- **🧮 Rechner & Tools** - Substrat- und Tinkturberechnung

## 🌐 URLs

- **Lokale Entwicklung**: https://3000-ixjyj9f115o7wcvrp8hwj-6532622b.e2b.dev
- **Production**: *Wird nach Cloudflare Deployment verfügbar*

## 🗄️ Datenarchitektur

### Datenmodelle
- **Pilzarten** (mushroom_species) - Austernpilz, Shiitake, Champignon, etc.
- **Substrate** (substrates) - Strohpellets, Kaffeesatz, Hartholzspäne, etc.
- **Zuchtprotokolle** (cultivation_protocols) - Schritt-für-Schritt Zuchtanleitungen
- **Zucht-Logs** (cultivation_logs) - Benutzer-Aufzeichnungen laufender Projekte
- **Wiki-Artikel** (wiki_articles) - Wissensdatenbank und Anleitungen
- **Log-Einträge** (log_entries) - Detaillierte Protokoll-Einträge

### Storage Services
- **Cloudflare D1** - Hauptdatenbank (SQLite, global verteilt)
- **Lokale Entwicklung** - SQLite in .wrangler/state/v3/d1/ (automatisch erstellt)

## 🚀 API Endpunkte

### Dashboard
- `GET /api/dashboard/stats` - Statistiken (aktive Protokolle, Pilzarten, Erfolgsrate)
- `GET /api/dashboard/activities` - Letzte Aktivitäten

### Zuchtprotokolle  
- `GET /api/protocols` - Alle Zuchtprotokolle mit Substrat- und Artinformationen

### Wiki & Wissen
- `GET /api/wiki/articles?category=all` - Wiki-Artikel (filtert nach Kategorie)
- `GET /api/species` - Alle Pilzarten mit Schwierigkeitsgraden

## 👥 Benutzerhandbuch

### Dashboard verwenden
1. **Statistiken einsehen** - Aktuelle Zahlen zu Protokollen und Erfolgsraten
2. **Schnellaktionen** - Direkt neue Protokolle oder Wiki-Einträge erstellen
3. **Aktivitäten verfolgen** - Letzte Änderungen und Updates im Überblick

### Zuchtprotokolle verwalten
1. **Neues Protokoll** - "Neues Zuchtprotokoll erstellen" Button verwenden
2. **Übersicht** - Alle Protokolle mit Schwierigkeitsgrad und erwarteter Ernte
3. **Protokoll starten** - Aus vorhandenen Protokollen neue Zuchtprojekte starten

### Wiki nutzen
1. **Artikel durchsuchen** - Nach Kategorien filtern (Kultivierung, Substrate, etc.)
2. **Pilzsorten erkunden** - Detaillierte Informationen zu verschiedenen Arten
3. **Schwierigkeitsgrade** - Einfach, Mittel, Schwer für bessere Planung

### Mobile Nutzung
- **Bottom Navigation** - Schneller Zugriff auf alle Hauptbereiche
- **Touch-optimiert** - Alle Buttons und Eingaben für Smartphone-Nutzung optimiert
- **Responsive Design** - Automatische Anpassung an Bildschirmgröße

## 🛠️ Technische Details

### Tech Stack
- **Backend**: Hono Framework (Edge-Runtime)
- **Frontend**: Vanilla JavaScript + Tailwind CSS
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages/Workers
- **Development**: Wrangler + PM2

### Lokale Entwicklung
```bash
# Datenbank migrieren
npm run db:migrate:local

# Beispieldaten einfügen  
npm run db:seed

# Entwicklungsserver starten
npm run dev:sandbox

# Build für Produktion
npm run build
```

### Deployment Status
- **Platform**: Cloudflare Pages ⏳ 
- **Status**: Lokal entwickelt, bereit für Deployment
- **Database**: D1 SQLite (Migrations und Seeds bereit)
- **Domain**: Cloudflare Pages Domain (.pages.dev)

## 📱 Progressive Web App Features

### Responsive Design
- **Mobile First** - Entwickelt primär für Smartphone-Nutzung
- **Tablet Support** - Optimierte Darstellung auf größeren Bildschirmen  
- **Desktop Enhancement** - Erweiterte Sidebar-Navigation für große Bildschirme

### Performance
- **Edge Deployment** - Globale Cloudflare-Edge-Verteilung
- **SQLite Performance** - Lokale D1-Datenbank für schnelle Abfragen
- **Minimal Bundle** - Lightweight Hono Framework

## 🔄 Nächste Entwicklungsschritte

1. **Cloudflare Deployment** - Produktive Bereitstellung auf pages.dev Domain
2. **GitHub Integration** - Repository-Setup für Versionskontrolle  
3. **Erweiterte Features** - Inventar, Kulturen-Management, Rechner
4. **Benutzer-Authentifizierung** - Multi-User-Support mit Cloudflare Access
5. **Backup-System** - Automatische Datensicherung und Export-Funktionen

## 📊 Aktuelle Statistiken

- **Pilzarten**: 5 (Austernpilz, Shiitake, Champignon, Kräuterseitling, Reishi)
- **Substrate**: 5 (Strohpellets, Kaffeesatz, Hartholzspäne, etc.)
- **Zuchtprotokolle**: 4 (verschiedene Schwierigkeitsgrade)
- **Wiki-Artikel**: 3 (Sterilisation, pH-Wert, Kontamination)

## 🔒 Sicherheit & Datenschutz

- **Lokale Datenbank** - Alle Daten bleiben in Ihrer Cloudflare-Instanz
- **Keine Tracking** - Keine Analytics oder Benutzerüberwachung
- **HTTPS-Only** - Verschlüsselte Verbindungen über Cloudflare Edge
- **Backup-Ready** - Einfacher Export aller Daten als SQL-Dumps

---

**Letzte Aktualisierung**: 03.10.2025  
**Version**: 1.0.0  
**Entwickelt für**: Professionelle und hobby-basierte Pilzzucht