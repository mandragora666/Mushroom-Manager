-- MUSHROOM MANAGER - Extended Database Schema
-- Erweiterte Tabellen für flexible Protokoll-Verwaltung

-- 6. Pilzarten-Tabelle (Ersetzt hardcoded mushroom_species)
CREATE TABLE mushroom_species (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    scientific_name VARCHAR(255),
    description TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    optimal_temperature_min DECIMAL(4,1),
    optimal_temperature_max DECIMAL(4,1),
    optimal_humidity_min DECIMAL(4,1),
    optimal_humidity_max DECIMAL(4,1),
    growth_time_days INTEGER,
    notes TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Substrat-Rezepte Tabelle
CREATE TABLE substrate_recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    total_weight DECIMAL(10,2), -- Gesamtgewicht des Rezepts
    sterilization_method VARCHAR(100), -- Sterilisationsmethode
    sterilization_temperature INTEGER,
    sterilization_duration INTEGER, -- in Minuten
    ph_target DECIMAL(3,1),
    moisture_content DECIMAL(4,1), -- Feuchtigkeitsgehalt in %
    notes TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    success_rate INTEGER CHECK (success_rate >= 0 AND success_rate <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Substrat-Zutaten Tabelle (Many-to-Many mit Rezepten)
CREATE TABLE substrate_ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID REFERENCES substrate_recipes(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- g, kg, ml, l, %
    percentage DECIMAL(5,2), -- Anteil am Gesamtrezept in %
    preparation_notes TEXT, -- z.B. "fein gehäckselt", "getrocknet"
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Inokulationsmethoden Tabelle
CREATE TABLE inoculation_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    method_type VARCHAR(50) NOT NULL, -- 'spore_syringe', 'liquid_culture', 'agar', 'grain_spawn'
    equipment_needed TEXT[], -- Array der benötigten Ausrüstung
    steps TEXT[], -- Array der Arbeitsschritte
    sterile_environment_required BOOLEAN DEFAULT true,
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    success_rate INTEGER CHECK (success_rate >= 0 AND success_rate <= 100),
    duration_minutes INTEGER, -- Durchschnittliche Dauer in Minuten
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Wachstumsphasen Tabelle
CREATE TABLE growth_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    phase_order INTEGER NOT NULL, -- Reihenfolge der Phase (1, 2, 3, ...)
    duration_days_min INTEGER,
    duration_days_max INTEGER,
    temperature_min DECIMAL(4,1),
    temperature_max DECIMAL(4,1),
    humidity_min DECIMAL(4,1),
    humidity_max DECIMAL(4,1),
    light_requirements TEXT, -- Lichtanforderungen
    air_exchange_requirements TEXT, -- Luftaustausch-Anforderungen
    typical_observations TEXT[], -- Typische Beobachtungen in dieser Phase
    care_instructions TEXT[], -- Pflegeanweisungen
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erweitere die protocols Tabelle (Migration)
-- Neue Spalten für Foreign Keys statt hardcoded Strings
ALTER TABLE protocols 
ADD COLUMN mushroom_species_id UUID REFERENCES mushroom_species(id),
ADD COLUMN substrate_recipe_id UUID REFERENCES substrate_recipes(id),
ADD COLUMN inoculation_method_id UUID REFERENCES inoculation_methods(id),
ADD COLUMN current_growth_phase_id UUID REFERENCES growth_phases(id);

-- Indexes für neue Tabellen
CREATE INDEX idx_mushroom_species_name ON mushroom_species(name);
CREATE INDEX idx_substrate_recipes_name ON substrate_recipes(name);
CREATE INDEX idx_substrate_ingredients_recipe_id ON substrate_ingredients(recipe_id);
CREATE INDEX idx_substrate_ingredients_sort_order ON substrate_ingredients(recipe_id, sort_order);
CREATE INDEX idx_inoculation_methods_name ON inoculation_methods(name);
CREATE INDEX idx_inoculation_methods_type ON inoculation_methods(method_type);
CREATE INDEX idx_growth_phases_order ON growth_phases(phase_order);

-- Triggers für updated_at
CREATE TRIGGER update_mushroom_species_updated_at BEFORE UPDATE ON mushroom_species
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_substrate_recipes_updated_at BEFORE UPDATE ON substrate_recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inoculation_methods_updated_at BEFORE UPDATE ON inoculation_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Beispieldaten einfügen

-- Pilzarten
INSERT INTO mushroom_species (name, scientific_name, description, difficulty_level, optimal_temperature_min, optimal_temperature_max, optimal_humidity_min, optimal_humidity_max, growth_time_days, notes) VALUES
    ('Austernpilz', 'Pleurotus ostreatus', 'Robuster und ertragreicher Pilz, ideal für Anfänger', 'easy', 15.0, 25.0, 85.0, 95.0, 14, 'Sehr tolerant gegenüber Schwankungen in Temperatur und Feuchtigkeit'),
    ('Shiitake', 'Lentinula edodes', 'Anspruchsvoller, aber sehr schmackhafter Pilz', 'hard', 12.0, 18.0, 80.0, 90.0, 90, 'Benötigt Kälteschock für Fruktifikation'),
    ('Champignon', 'Agaricus bisporus', 'Klassischer Zuchtpilz mit bewährten Methoden', 'medium', 14.0, 18.0, 80.0, 90.0, 21, 'Kompostbasierte Substrate bevorzugt'),
    ('Kräuterseitling', 'Pleurotus eryngii', 'Großfruchtige Pilze mit festem Fleisch', 'medium', 12.0, 20.0, 85.0, 95.0, 18, 'Längere Entwicklungszeit als andere Pleurotus-Arten'),
    ('Limonen-Austernpilz', 'Pleurotus citrinopileatus', 'Gelbe Variante mit besonderem Aroma', 'medium', 20.0, 28.0, 85.0, 95.0, 16, 'Bevorzugt wärmere Temperaturen');

-- Substratrezepte
INSERT INTO substrate_recipes (name, description, total_weight, sterilization_method, sterilization_temperature, sterilization_duration, ph_target, moisture_content, notes, difficulty_level, success_rate) VALUES
    ('Standard Weizenstroh', 'Bewährtes Rezept für Austernpilze', 5.0, 'Pasteurisierung', 80, 120, 7.0, 65.0, 'Stroh vorher 24h einweichen, gut abtropfen lassen', 'easy', 90),
    ('Kaffeesatz-Mix', 'Nachhaltiges Substrat aus Kaffeesatz', 3.0, 'Dampfsterilisation', 100, 60, 6.5, 70.0, 'Frischen Kaffeesatz verwenden, max. 2 Tage alt', 'easy', 85),
    ('Laubholzspäne Shiitake', 'Spezielles Substrat für Shiitake', 10.0, 'Autoklav', 121, 60, 6.0, 55.0, 'Nur Hartholz verwenden (Buche, Eiche)', 'hard', 75),
    ('Kompost-Basis Champignon', 'Traditioneller Champignon-Kompost', 20.0, 'Kompostierung', 65, 10080, 7.5, 68.0, 'Mehrwöchiger Kompostierungsprozess erforderlich', 'hard', 80),
    ('Universalsubstrat', 'Vielseitig einsetzbares Mischsubstrat', 8.0, 'Pasteurisierung', 85, 90, 6.8, 62.0, 'Gut für verschiedene Pleurotus-Arten', 'medium', 88);

-- Substrat-Zutaten
INSERT INTO substrate_ingredients (recipe_id, ingredient_name, quantity, unit, percentage, preparation_notes, sort_order) VALUES
    -- Standard Weizenstroh
    ((SELECT id FROM substrate_recipes WHERE name = 'Standard Weizenstroh'), 'Weizenstroh', 4.5, 'kg', 90.0, 'Gehäckselt auf 5-10cm Länge', 1),
    ((SELECT id FROM substrate_recipes WHERE name = 'Standard Weizenstroh'), 'Kalk (gebrannt)', 50.0, 'g', 1.0, 'Für pH-Stabilisierung', 2),
    ((SELECT id FROM substrate_recipes WHERE name = 'Standard Weizenstroh'), 'Gips', 100.0, 'g', 2.0, 'Zur Strukturverbesserung', 3),
    
    -- Kaffeesatz-Mix
    ((SELECT id FROM substrate_recipes WHERE name = 'Kaffeesatz-Mix'), 'Kaffeesatz', 2.0, 'kg', 66.7, 'Frisch, maximal 2 Tage alt', 1),
    ((SELECT id FROM substrate_recipes WHERE name = 'Kaffeesatz-Mix'), 'Strohpellets', 800.0, 'g', 26.7, 'Mit heißem Wasser aufquellen lassen', 2),
    ((SELECT id FROM substrate_recipes WHERE name = 'Kaffeesatz-Mix'), 'Kalk', 30.0, 'g', 1.0, 'pH-Korrektur', 3),
    ((SELECT id FROM substrate_recipes WHERE name = 'Kaffeesatz-Mix'), 'Sägespäne (Laubholz)', 170.0, 'g', 5.6, 'Feine Späne für Struktur', 4),
    
    -- Laubholzspäne Shiitake
    ((SELECT id FROM substrate_recipes WHERE name = 'Laubholzspäne Shiitake'), 'Buchenspäne', 8.0, 'kg', 80.0, 'Grobe Späne 2-5mm', 1),
    ((SELECT id FROM substrate_recipes WHERE name = 'Laubholzspäne Shiitake'), 'Weizenkleie', 1.5, 'kg', 15.0, 'Nährstoffzusatz', 2),
    ((SELECT id FROM substrate_recipes WHERE name = 'Laubholzspäne Shiitake'), 'Gips', 300.0, 'g', 3.0, 'Strukturverbesserung', 3),
    ((SELECT id FROM substrate_recipes WHERE name = 'Laubholzspäne Shiitake'), 'Kalk', 200.0, 'g', 2.0, 'pH-Pufferung', 4);

-- Inokulationsmethoden
INSERT INTO inoculation_methods (name, description, method_type, equipment_needed, steps, sterile_environment_required, difficulty_level, success_rate, duration_minutes, notes) VALUES
    ('Sporensyringe', 'Inokulation mit Sporenlösung per Spritze', 'spore_syringe', 
     ARRAY['Sporensyringe', 'Desinfektionsmittel', 'Handschuhe', 'Mundschutz'], 
     ARRAY['Arbeitsplatz desinfizieren', 'Spritze schütteln', 'Substrat an 3-4 Stellen einstechen', 'Lösung langsam injizieren', 'Einstichstellen mit Tape abkleben'], 
     true, 'easy', 80, 15, 'Günstige Methode für Anfänger'),
     
    ('Flüssigkultur', 'Inokulation mit Pilzmyzel in Nährlösung', 'liquid_culture',
     ARRAY['Flüssigkultur', 'Spritze', 'Desinfektionsmittel', 'Laminar Flow Box'],
     ARRAY['Sterilbank vorbereiten', 'Flüssigkultur schütteln', 'Spritze steril befüllen', 'Substrat inokulieren', 'Behälter verschließen'],
     true, 'medium', 90, 20, 'Höhere Erfolgsrate als Sporen'),
     
    ('Agar-Transfer', 'Übertragung von Myzel von Agarplatten', 'agar',
     ARRAY['Agarplatten mit Myzel', 'Skalpell', 'Pinzette', 'Brenner', 'Sterilbank'],
     ARRAY['Sterilbank einschalten', 'Werkzeuge sterilisieren', 'Myzelstücke ausschneiden', 'In Substrat einbringen', 'Sofort verschließen'],
     true, 'medium', 85, 25, 'Präzise Methode für kontaminationsfreies Myzel'),
     
    ('Kornbrut-Impfung', 'Mischung von bewachsener Kornbrut ins Substrat', 'grain_spawn',
     ARRAY['Sterile Kornbrut', 'Desinfektionsmittel', 'Handschuhe'],
     ARRAY['Kornbrut auflockern', 'Mit Substrat vermischen', 'Gleichmäßig verteilen', 'Gut durchmischen'],
     false, 'easy', 95, 10, 'Schnellste Methode mit höchster Erfolgsrate');

-- Wachstumsphasen
INSERT INTO growth_phases (name, description, phase_order, duration_days_min, duration_days_max, temperature_min, temperature_max, humidity_min, humidity_max, light_requirements, air_exchange_requirements, typical_observations, care_instructions) VALUES
    ('Inokulation', 'Einbringung des Pilzmyzels ins Substrat', 1, 0, 1, 20.0, 25.0, 90.0, 95.0, 'Dunkelheit bevorzugt', 'Minimal, nur bei Bedarf', 
     ARRAY['Substrat noch unverändert', 'Keine sichtbare Aktivität'], 
     ARRAY['Steril arbeiten', 'Kontamination vermeiden', 'Ruhig lagern']),
     
    ('Durchwachsung', 'Myzel durchzieht das Substrat', 2, 7, 21, 20.0, 25.0, 85.0, 95.0, 'Dunkelheit', 'Sehr wenig', 
     ARRAY['Weißes Myzel wird sichtbar', 'Substrat wird fester', 'Pilzgeruch entwickelt sich'], 
     ARRAY['Nicht bewegen', 'Feuchtigkeit halten', 'Kontamination prüfen']),
     
    ('Primordien-Bildung', 'Erste Pilzansätze entstehen', 3, 3, 7, 15.0, 20.0, 90.0, 98.0, 'Indirektes Licht 12h/Tag', 'Leicht erhöht', 
     ARRAY['Kleine weiße Knöpfchen', 'Erhöhte CO2-Empfindlichkeit', 'Myzel verdichtet sich'], 
     ARRAY['Luftfeuchtigkeit erhöhen', 'Licht einführen', 'Mehr Luftaustausch']),
     
    ('Fruchtentwicklung', 'Pilze wachsen zu erntefähiger Größe', 4, 4, 10, 15.0, 22.0, 85.0, 95.0, 'Indirektes Licht 12h/Tag', 'Regelmäßig', 
     ARRAY['Pilze verdoppeln täglich Größe', 'Hüte öffnen sich langsam', 'Stiele werden länger'], 
     ARRAY['Täglich sprühen', 'Luftzirkulation sicherstellen', 'Wachstum beobachten']),
     
    ('Ernte', 'Pilze sind erntereif', 5, 1, 3, 15.0, 22.0, 85.0, 95.0, 'Normales Licht', 'Normal', 
     ARRAY['Hüte flach oder leicht nach oben', 'Sporenpulver möglich', 'Optimale Größe erreicht'], 
     ARRAY['Zügig ernten', 'Saubere Schnitte', 'Substrat für nächste Welle vorbereiten']);

-- Update existing protocols to use new structure (optional, for existing data)
-- Dies würde in einer echten Migration schrittweise gemacht werden