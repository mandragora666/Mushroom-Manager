-- Enhanced Seed Data for Mushroom Manager Extended Schema
-- Run this after running database-schema-extended.sql

-- Clear existing data (optional)
-- DELETE FROM substrate_ingredients;
-- DELETE FROM substrate_recipes;
-- DELETE FROM inoculation_methods;
-- DELETE FROM growth_phases;
-- DELETE FROM mushroom_species;

-- Insert enhanced mushroom species data
INSERT INTO mushroom_species (name, scientific_name, description, difficulty_level, optimal_temperature_min, optimal_temperature_max, optimal_humidity_min, optimal_humidity_max, growth_time_days, notes) VALUES
    ('Austernpilz', 'Pleurotus ostreatus', 'Robuster und ertragreicher Pilz, ideal für Anfänger', 'easy', 15.0, 25.0, 85.0, 95.0, 14, 'Sehr tolerant gegenüber Schwankungen in Temperatur und Feuchtigkeit'),
    ('Shiitake', 'Lentinula edodes', 'Anspruchsvoller, aber sehr schmackhafter Pilz', 'hard', 12.0, 18.0, 80.0, 90.0, 90, 'Benötigt Kälteschock für Fruktifikation'),
    ('Champignon', 'Agaricus bisporus', 'Klassischer Zuchtpilz mit bewährten Methoden', 'medium', 14.0, 18.0, 80.0, 90.0, 21, 'Kompostbasierte Substrate bevorzugt'),
    ('Kräuterseitling', 'Pleurotus eryngii', 'Großfruchtige Pilze mit festem Fleisch', 'medium', 12.0, 20.0, 85.0, 95.0, 18, 'Längere Entwicklungszeit als andere Pleurotus-Arten'),
    ('Limonen-Austernpilz', 'Pleurotus citrinopileatus', 'Gelbe Variante mit besonderem Aroma', 'medium', 20.0, 28.0, 85.0, 95.0, 16, 'Bevorzugt wärmere Temperaturen'),
    ('Igelstachelbart', 'Hericium erinaceus', 'Mediziell wertvoll mit neuroprotektiven Eigenschaften', 'medium', 16.0, 24.0, 85.0, 95.0, 21, 'Wächst gut auf Laubholz-basierten Substraten'),
    ('Enoki', 'Flammulina velutipes', 'Dünne, lange Stiele mit kleinen Köpfen', 'easy', 10.0, 15.0, 85.0, 95.0, 28, 'Bevorzugt kühlere Temperaturen'),
    ('Maitake', 'Grifola frondosa', 'Komplexe, blumenkohlähnliche Struktur', 'hard', 13.0, 18.0, 80.0, 90.0, 35, 'Erfordert spezielle Bedingungen für Fruktifikation') 
ON CONFLICT (name) DO NOTHING;

-- Insert substrate recipes
INSERT INTO substrate_recipes (name, description, total_weight, sterilization_method, sterilization_temperature, sterilization_duration, ph_target, moisture_content, notes, difficulty_level, success_rate) VALUES
    ('Standard Weizenstroh', 'Bewährtes Rezept für Austernpilze', 5.0, 'Pasteurisierung', 80, 120, 7.0, 65.0, 'Stroh vorher 24h einweichen, gut abtropfen lassen', 'easy', 90),
    ('Kaffeesatz-Mix', 'Nachhaltiges Substrat aus Kaffeesatz', 3.0, 'Dampfsterilisation', 100, 60, 6.5, 70.0, 'Frischen Kaffeesatz verwenden, max. 2 Tage alt', 'easy', 85),
    ('Laubholzspäne Shiitake', 'Spezielles Substrat für Shiitake', 10.0, 'Autoklav', 121, 60, 6.0, 55.0, 'Nur Hartholz verwenden (Buche, Eiche)', 'hard', 75),
    ('Kompost-Basis Champignon', 'Traditioneller Champignon-Kompost', 20.0, 'Kompostierung', 65, 10080, 7.5, 68.0, 'Mehrwöchiger Kompostierungsprozess erforderlich', 'hard', 80),
    ('Universalsubstrat', 'Vielseitig einsetzbares Mischsubstrat', 8.0, 'Pasteurisierung', 85, 90, 6.8, 62.0, 'Gut für verschiedene Pleurotus-Arten', 'medium', 88),
    ('Sägespäne Premium', 'Hochqualitatives Laubholz-Substrat', 12.0, 'Autoklav', 121, 90, 6.2, 58.0, 'Ausschließlich Buchen- und Eichenspäne', 'medium', 82),
    ('Strohpellet Express', 'Schnell vorbereitetes Pellet-Substrat', 4.0, 'Heißwasser-Behandlung', 85, 30, 7.2, 68.0, 'Pellets quellen schnell auf, einfache Handhabung', 'easy', 87)
ON CONFLICT (name) DO NOTHING;

-- Insert substrate ingredients
INSERT INTO substrate_ingredients (recipe_id, ingredient_name, quantity, unit, percentage, preparation_notes, sort_order) 
SELECT sr.id, ing.ingredient_name, ing.quantity, ing.unit, ing.percentage, ing.preparation_notes, ing.sort_order
FROM substrate_recipes sr
CROSS JOIN (VALUES
    -- Standard Weizenstroh
    ('Standard Weizenstroh', 'Weizenstroh', 4.5, 'kg', 90.0, 'Gehäckselt auf 5-10cm Länge', 1),
    ('Standard Weizenstroh', 'Kalk (gebrannt)', 50.0, 'g', 1.0, 'Für pH-Stabilisierung', 2),
    ('Standard Weizenstroh', 'Gips', 100.0, 'g', 2.0, 'Zur Strukturverbesserung', 3),
    ('Standard Weizenstroh', 'Zusatzwasser', 3.5, 'l', 7.0, 'Für optimale Feuchtigkeit', 4),
    
    -- Kaffeesatz-Mix
    ('Kaffeesatz-Mix', 'Kaffeesatz', 2.0, 'kg', 66.7, 'Frisch, maximal 2 Tage alt', 1),
    ('Kaffeesatz-Mix', 'Strohpellets', 800.0, 'g', 26.7, 'Mit heißem Wasser aufquellen lassen', 2),
    ('Kaffeesatz-Mix', 'Kalk', 30.0, 'g', 1.0, 'pH-Korrektur', 3),
    ('Kaffeesatz-Mix', 'Sägespäne (Laubholz)', 170.0, 'g', 5.6, 'Feine Späne für Struktur', 4),
    
    -- Laubholzspäne Shiitake
    ('Laubholzspäne Shiitake', 'Buchenspäne', 8.0, 'kg', 80.0, 'Grobe Späne 2-5mm', 1),
    ('Laubholzspäne Shiitake', 'Weizenkleie', 1.5, 'kg', 15.0, 'Nährstoffzusatz', 2),
    ('Laubholzspäne Shiitake', 'Gips', 300.0, 'g', 3.0, 'Strukturverbesserung', 3),
    ('Laubholzspäne Shiitake', 'Kalk', 200.0, 'g', 2.0, 'pH-Pufferung', 4),
    
    -- Universalsubstrat
    ('Universalsubstrat', 'Weizenstroh gehäckselt', 3.0, 'kg', 37.5, 'Kurze Halme 3-8cm', 1),
    ('Universalsubstrat', 'Buchenspäne', 2.5, 'kg', 31.3, 'Mittlere Korngröße', 2),
    ('Universalsubstrat', 'Strohpellets', 1.5, 'kg', 18.8, 'Aufgequollen', 3),
    ('Universalsubstrat', 'Weizenkleie', 800.0, 'g', 10.0, 'Nährstoffergänzung', 4),
    ('Universalsubstrat', 'Gips', 150.0, 'g', 1.9, 'Konditionierung', 5),
    ('Universalsubstrat', 'Kalk', 50.0, 'g', 0.6, 'pH-Balance', 6)
) AS ing(recipe_name, ingredient_name, quantity, unit, percentage, preparation_notes, sort_order)
WHERE sr.name = ing.recipe_name
ON CONFLICT DO NOTHING;

-- Insert inoculation methods
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
     false, 'easy', 95, 10, 'Schnellste Methode mit höchster Erfolgsrate'),
     
    ('Impfdübel', 'Holzdübel mit Pilzmyzel für Stammimpfung', 'grain_spawn',
     ARRAY['Impfdübel', 'Bohrmaschine', '8-9mm Holzbohrer', 'Wachs zum Versiegeln'],
     ARRAY['Löcher bohren 3-4cm tief', 'Dübel einschlagen', 'Mit Wachs versiegeln', 'Feucht halten'],
     false, 'easy', 75, 30, 'Ideal für Stammimpfung von Shiitake'),
     
    ('Fertigkultur-Block', 'Vorgefertigter steriler Kulturblock', 'grain_spawn',
     ARRAY['Fertigkultur', 'Sprühflasche', 'Plastikbeutel'],
     ARRAY['Verpackung öffnen', 'Anschnitte machen', 'In Zuchtbeutel legen', 'Regelmäßig befeuchten'],
     false, 'easy', 88, 5, 'Einfachste Methode für Einsteiger')
ON CONFLICT (name) DO NOTHING;

-- Insert growth phases
INSERT INTO growth_phases (name, description, phase_order, duration_days_min, duration_days_max, temperature_min, temperature_max, humidity_min, humidity_max, light_requirements, air_exchange_requirements, typical_observations, care_instructions) VALUES
    ('Inokulation', 'Einbringung des Pilzmyzels ins Substrat', 1, 0, 1, 20.0, 25.0, 90.0, 95.0, 'Dunkelheit bevorzugt', 'Minimal, nur bei Bedarf', 
     ARRAY['Substrat noch unverändert', 'Keine sichtbare Aktivität', 'Wichtigste Phase für Sauberkeit'], 
     ARRAY['Steril arbeiten', 'Kontamination vermeiden', 'Ruhig lagern', 'Nicht bewegen']),
     
    ('Durchwachsung', 'Myzel durchzieht das Substrat', 2, 7, 21, 20.0, 25.0, 85.0, 95.0, 'Dunkelheit', 'Sehr wenig', 
     ARRAY['Weißes Myzel wird sichtbar', 'Substrat wird fester', 'Pilzgeruch entwickelt sich', 'CO2-Konzentration steigt'], 
     ARRAY['Nicht bewegen', 'Feuchtigkeit halten', 'Kontamination prüfen', 'Geduldig warten']),
     
    ('Primordien-Bildung', 'Erste Pilzansätze entstehen', 3, 3, 7, 15.0, 20.0, 90.0, 98.0, 'Indirektes Licht 12h/Tag', 'Leicht erhöht', 
     ARRAY['Kleine weiße Knöpfchen', 'Erhöhte CO2-Empfindlichkeit', 'Myzel verdichtet sich', 'Erste Feuchtigkeit nötig'], 
     ARRAY['Luftfeuchtigkeit erhöhen', 'Licht einführen', 'Mehr Luftaustausch', 'Vorsichtig sprühen']),
     
    ('Fruchtentwicklung', 'Pilze wachsen zu erntefähiger Größe', 4, 4, 10, 15.0, 22.0, 85.0, 95.0, 'Indirektes Licht 12h/Tag', 'Regelmäßig', 
     ARRAY['Pilze verdoppeln täglich Größe', 'Hüte öffnen sich langsam', 'Stiele werden länger', 'Farbe entwickelt sich'], 
     ARRAY['Täglich sprühen', 'Luftzirkulation sicherstellen', 'Wachstum beobachten', 'Feuchtigkeit konstant halten']),
     
    ('Ernte', 'Pilze sind erntereif', 5, 1, 3, 15.0, 22.0, 85.0, 95.0, 'Normales Licht', 'Normal', 
     ARRAY['Hüte flach oder leicht nach oben', 'Sporenpulver möglich', 'Optimale Größe erreicht', 'Fleisch noch fest'], 
     ARRAY['Zügig ernten', 'Saubere Schnitte', 'Substrat für nächste Welle vorbereiten', 'Kühl lagern']),
     
    ('Zweite Erntewelle', 'Vorbereitung auf weitere Pilzflüsse', 6, 7, 14, 18.0, 23.0, 80.0, 90.0, 'Wenig Licht', 'Reduziert', 
     ARRAY['Substrat regeneriert', 'Neue Myzelbildung', 'Ruhephase'], 
     ARRAY['Weniger gießen', 'Substrat ruhen lassen', 'Geduld haben', 'Auf neue Primordien warten'])
ON CONFLICT (name) DO NOTHING;

-- Sample protocol with enhanced data
INSERT INTO protocols (
    title, 
    mushroom_species, 
    batch_name, 
    start_date, 
    substrate_type, 
    inoculation_method, 
    temperature_range, 
    humidity_range, 
    growth_stage,
    notes,
    images,
    mushroom_species_id,
    substrate_recipe_id,
    inoculation_method_id,
    current_growth_phase_id
) VALUES (
    'Austernpilz Enhanced Test',
    'Pleurotus ostreatus',
    'AP-ENH-001',
    CURRENT_DATE - INTERVAL '5 days',
    'Standard Weizenstroh',
    'Flüssigkultur',
    '18-24°C',
    '85-95%',
    'incubation',
    'Testprotokoll für enhanced Features. Verwendet neue Substratrezept-Funktionalität.',
    ARRAY['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    (SELECT id FROM mushroom_species WHERE name = 'Austernpilz' LIMIT 1),
    (SELECT id FROM substrate_recipes WHERE name = 'Standard Weizenstroh' LIMIT 1),
    (SELECT id FROM inoculation_methods WHERE name = 'Flüssigkultur' LIMIT 1),
    (SELECT id FROM growth_phases WHERE name = 'Durchwachsung' LIMIT 1)
);