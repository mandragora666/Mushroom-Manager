# 🍄 Mushroom Manager Enhanced

Eine moderne, responsive Web-Anwendung für die professionelle Pilzzucht-Verwaltung. Erweitert mit flexiblen Protokoll-Formularen, Foto-Upload und dynamischen Substratrezepten. Entwickelt mit Hono Framework und Cloudflare Pages.

## 🌟 Aktuelle Features

### ✅ Neu implementiert (Enhanced Version)
- **🎯 Flexible Protokoll-Formulare** - Anpassbare Pilzarten, Substratrezepte und Inokulationsmethoden
- **📸 Foto-Upload Funktionalität** - Dokumentationsfotos für Wachstumsstadien hochladen
- **🧪 Substratrezept-Verwaltung** - Rezepte mit mehreren Zutaten und Verhältnissen erstellen
- **🔧 Anpassbare Inokulationsmethoden** - Eigene Methoden definieren und dokumentieren
- **📈 Erweiterte Wachstumsphasen** - Detaillierte Phasen-Verwaltung mit Bedingungen
- **🏷️ Dynamische Pilzarten** - Neue Pilzarten hinzufügen statt nur vordefinierte auswählen
- **🎨 Enhanced UI/UX** - Verbesserte Benutzeroberfläche mit Management-Buttons

### ✅ Basis-Features
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

- **Enhanced Version (Sandbox)**: https://3000-ixjyj9f115o7wcvrp8hwj-6532622b.e2b.dev
- **GitHub Repository**: *GitHub Setup benötigt*
- **Production**: *Wird nach Cloudflare Deployment verfügbar*

## 🗄️ Datenarchitektur (Enhanced Schema)

### Basis-Datenmodelle
- **Protokolle** (protocols) - Hauptprotokoll-Datensätze mit Foreign Keys
- **Protokoll-Einträge** (protocol_entries) - Timeline-Einträge zu Protokollen
- **Wiki-Artikel** (wiki_articles) - Wissensdatenbank und Anleitungen
- **Wiki-Kategorien** (wiki_categories) - Kategorisierung für Wiki-Artikel
- **Inventar** (inventory) - Materialien und Lagerbestand

### Enhanced Datenmodelle (Neue Features)
- **Pilzarten** (mushroom_species) - Flexible Pilzarten mit Eigenschaften
- **Substratrezepte** (substrate_recipes) - Rezepte mit Gesamtgewicht und Sterilisation
- **Substrat-Zutaten** (substrate_ingredients) - Zutaten mit Mengen und Verhältnissen
- **Inokulationsmethoden** (inoculation_methods) - Anpassbare Methoden mit Schritten
- **Wachstumsphasen** (growth_phases) - Detaillierte Phasen mit Bedingungen

### Storage Services
- **Cloudflare D1** - Hauptdatenbank (SQLite, global verteilt)
- **Lokale Entwicklung** - SQLite in .wrangler/state/v3/d1/ (automatisch erstellt)

## 🚀 API Endpunkte

### Basis APIs
- `GET/POST/PUT/DELETE /api/protocols` - Zuchtprotokoll CRUD-Operationen
- `GET/POST/PUT/DELETE /api/wiki` - Wiki-Artikel Management
- `POST /api/upload` - Foto-Upload zu Supabase Storage

### Enhanced APIs (Neue Features)
- `GET/POST/PUT/DELETE /api/mushroom-species` - Pilzarten-Verwaltung
- `GET/POST/PUT/DELETE /api/substrate-recipes` - Substratrezept-Management
- `GET/POST/PUT/DELETE /api/inoculation-methods` - Inokulationsmethoden-CRUD
- `GET/POST/PUT/DELETE /api/growth-phases` - Wachstumsphasen-Verwaltung

### File Upload
- `POST /api/upload` - Foto-Upload mit Supabase Storage Integration
- Unterstützt: JPEG, PNG, WebP (max. 5MB pro Datei)
- Automatische Pfad-Generierung: `uploads/YYYY/MM/timestamp-random.ext`

## 👥 Benutzerhandbuch

### Dashboard verwenden
1. **Statistiken einsehen** - Aktuelle Zahlen zu Protokollen und Erfolgsraten
2. **Schnellaktionen** - Direkt neue Protokolle oder Wiki-Einträge erstellen
3. **Aktivitäten verfolgen** - Letzte Änderungen und Updates im Überblick

### Enhanced Zuchtprotokolle verwalten
1. **Flexible Pilzarten** - Eigene Pilzarten hinzufügen oder aus Liste auswählen
2. **Substratrezepte** - Detaillierte Rezepte mit mehreren Zutaten erstellen
3. **Foto-Dokumentation** - Bis zu 10 Fotos pro Protokoll für Wachstumsstadien
4. **Anpassbare Methoden** - Eigene Inokulationsmethoden und Wachstumsphasen
5. **Erweiterte Bedingungen** - Getrennte Min/Max-Werte für Temperatur und Feuchtigkeit
6. **Management-Tools** - Separate Verwaltungsseiten für Pilzarten und Substrate

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

## 📊 Enhanced Statistiken

### Vordefinierte Daten (seed-enhanced.sql)
- **Pilzarten**: 8 (Austernpilz, Shiitake, Champignon, Kräuterseitling, Limonen-Austernpilz, Igelstachelbart, Enoki, Maitake)
- **Substratrezepte**: 7 (Standard Weizenstroh, Kaffeesatz-Mix, Laubholzspäne, Universalsubstrat, etc.)
- **Inokulationsmethoden**: 6 (Sporensyringe, Flüssigkultur, Agar-Transfer, Kornbrut, Impfdübel, Fertigkultur)
- **Wachstumsphasen**: 6 (Inokulation → Durchwachsung → Primordien → Fruchtentwicklung → Ernte → Zweite Welle)
- **Erweiterte Features**: Foto-Upload, flexible Formulare, dynamische Rezeptverwaltung

## 🔒 Sicherheit & Datenschutz

- **Lokale Datenbank** - Alle Daten bleiben in Ihrer Cloudflare-Instanz
- **Keine Tracking** - Keine Analytics oder Benutzerüberwachung
- **HTTPS-Only** - Verschlüsselte Verbindungen über Cloudflare Edge
- **Backup-Ready** - Einfacher Export aller Daten als SQL-Dumps

---

**Letzte Aktualisierung**: 03.10.2025  
**Version**: 1.0.0  
**Entwickelt für**: Professionelle und hobby-basierte Pilzzucht