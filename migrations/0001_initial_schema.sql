-- 🍄 Mushroom Manager Database Schema
-- Erstelle Tabellen für Zuchtprotokolle, Substrate und Wiki

-- Pilzarten / Mushroom Species
CREATE TABLE IF NOT EXISTS mushroom_species (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE, -- z.B. "Austernpilz", "Shiitake"
  scientific_name TEXT, -- z.B. "Pleurotus ostreatus"
  description TEXT,
  difficulty_level TEXT DEFAULT 'medium', -- easy, medium, hard
  growing_temperature_min INTEGER, -- in Celsius
  growing_temperature_max INTEGER,
  humidity_min INTEGER, -- in %
  humidity_max INTEGER,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Substrate (Nährboden)
CREATE TABLE IF NOT EXISTS substrates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE, -- z.B. "Strohpellets", "Kaffeesatz"
  type TEXT NOT NULL, -- straw, wood, coffee, etc.
  description TEXT,
  preparation_notes TEXT,
  sterilization_required BOOLEAN DEFAULT true,
  ph_level_min REAL,
  ph_level_max REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Zuchtprotokolle / Cultivation Protocols
CREATE TABLE IF NOT EXISTS cultivation_protocols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  mushroom_species_id INTEGER,
  substrate_id INTEGER,
  
  -- Phases
  inoculation_method TEXT, -- liquid culture, grain spawn, etc.
  colonization_time_days INTEGER,
  colonization_temperature INTEGER,
  colonization_humidity INTEGER,
  
  fruiting_temperature INTEGER,
  fruiting_humidity INTEGER,
  fruiting_light_hours INTEGER,
  fruiting_air_exchange TEXT,
  
  harvest_time_days INTEGER,
  expected_yield_grams INTEGER,
  
  -- Notizen
  notes TEXT,
  difficulty TEXT DEFAULT 'medium',
  success_rate INTEGER, -- 0-100%
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (mushroom_species_id) REFERENCES mushroom_species(id),
  FOREIGN KEY (substrate_id) REFERENCES substrates(id)
);

-- Zucht-Logs / Cultivation Logs (Benutzer-Aufzeichnungen)
CREATE TABLE IF NOT EXISTS cultivation_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  protocol_id INTEGER,
  
  -- Batch Info
  batch_name TEXT NOT NULL,
  start_date DATE,
  status TEXT DEFAULT 'inoculation', -- inoculation, colonization, fruiting, harvested, failed
  
  -- Aktuelle Werte
  current_temperature INTEGER,
  current_humidity INTEGER,
  current_ph REAL,
  
  -- Fortschritt
  progress_percentage INTEGER DEFAULT 0,
  notes TEXT,
  
  -- Ergebnisse
  actual_yield_grams INTEGER,
  harvest_date DATE,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (protocol_id) REFERENCES cultivation_protocols(id)
);

-- Wiki-Artikel
CREATE TABLE IF NOT EXISTS wiki_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT, -- cultivation, substrate, troubleshooting, etc.
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT, -- JSON array of tags
  author TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Log-Einträge für Zucht-Logs
CREATE TABLE IF NOT EXISTS log_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cultivation_log_id INTEGER,
  entry_type TEXT, -- note, measurement, photo, milestone
  title TEXT,
  content TEXT,
  data JSON, -- für strukturierte Daten wie Messungen
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (cultivation_log_id) REFERENCES cultivation_logs(id)
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_cultivation_protocols_species ON cultivation_protocols(mushroom_species_id);
CREATE INDEX IF NOT EXISTS idx_cultivation_protocols_substrate ON cultivation_protocols(substrate_id);
CREATE INDEX IF NOT EXISTS idx_cultivation_logs_protocol ON cultivation_logs(protocol_id);
CREATE INDEX IF NOT EXISTS idx_cultivation_logs_status ON cultivation_logs(status);
CREATE INDEX IF NOT EXISTS idx_wiki_articles_category ON wiki_articles(category);
CREATE INDEX IF NOT EXISTS idx_wiki_articles_slug ON wiki_articles(slug);
CREATE INDEX IF NOT EXISTS idx_log_entries_cultivation_log ON log_entries(cultivation_log_id);