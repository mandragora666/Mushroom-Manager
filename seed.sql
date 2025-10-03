-- 🍄 Mushroom Manager - Seed Data
-- Beispieldaten für die App

-- Pilzarten einfügen
INSERT OR IGNORE INTO mushroom_species (name, scientific_name, description, difficulty_level, growing_temperature_min, growing_temperature_max, humidity_min, humidity_max) VALUES
('Austernpilz', 'Pleurotus ostreatus', 'Sehr anfängerfreundlicher Pilz mit hoher Erfolgsquote. Wächst auf vielen Substraten.', 'easy', 15, 25, 85, 95),
('Shiitake', 'Lentinula edodes', 'Beliebter Speisepilz mit medizinischen Eigenschaften. Benötigt Holzsubstrat.', 'medium', 12, 22, 80, 90),
('Champignon', 'Agaricus bisporus', 'Klassischer Zuchtpilz. Wächst auf Kompost und Mist.', 'medium', 14, 18, 75, 85),
('Kräuterseitling', 'Pleurotus eryngii', 'Großer, fleischiger Pilz mit nussigem Geschmack.', 'medium', 12, 20, 85, 95),
('Reishi', 'Ganoderma lucidum', 'Heilpilz mit langer Wachstumszeit. Sehr wertvoll.', 'hard', 20, 30, 85, 95);

-- Substrate einfügen  
INSERT OR IGNORE INTO substrates (name, type, description, preparation_notes, sterilization_required, ph_level_min, ph_level_max) VALUES
('Strohpellets', 'straw', 'Gepresste Strohpellets, ideal für Austernpilze', 'Mit heißem Wasser aufquellen, dann pasteurisieren', true, 6.5, 7.5),
('Kaffeesatz', 'coffee', 'Gebrauchter Kaffeesatz von Cafés', 'Frisch verwenden oder einfrieren. Mit Kalk pH-Wert anheben', true, 6.0, 7.0),
('Hartholzspäne', 'wood', 'Späne von Eiche, Buche oder anderen Hartholzarten', 'Mehrfach mit heißem Wasser spülen, dann sterilisieren', true, 5.5, 6.5),
('Pferdemist-Kompost', 'manure', 'Gut kompostierter Pferdemist mit Stroh', 'Mindestens 6 Monate kompostiert, pasteurisieren', true, 7.0, 8.0),
('Weizenstroh', 'straw', 'Gehäckseltes Weizenstroh', 'In Stücke schneiden, mit Kalk behandeln, pasteurisieren', true, 7.0, 8.0);

-- Zuchtprotokolle einfügen
INSERT OR IGNORE INTO cultivation_protocols (
  name, mushroom_species_id, substrate_id, 
  inoculation_method, colonization_time_days, colonization_temperature, colonization_humidity,
  fruiting_temperature, fruiting_humidity, fruiting_light_hours, fruiting_air_exchange,
  harvest_time_days, expected_yield_grams, notes, difficulty, success_rate
) VALUES
('Austernpilz auf Stroh (Anfänger)', 1, 1, 'Liquid Culture', 14, 24, 90, 18, 85, 12, 'Täglich 3x lüften', 7, 800, 'Sehr zuverlässiges Protokoll für Einsteiger', 'easy', 90),
('Shiitake auf Hartholz', 2, 3, 'Grain Spawn', 45, 20, 85, 16, 80, 8, '2x täglich lüften', 14, 600, 'Benötigt Geduld, aber lohnt sich', 'medium', 75),
('Austernpilz auf Kaffeesatz', 1, 2, 'Liquid Culture', 10, 22, 88, 16, 85, 10, 'Häufig lüften wegen Schimmelgefahr', 5, 500, 'Schnell aber anfällig für Kontamination', 'medium', 70),
('Champignon traditionell', 3, 4, 'Spawn', 21, 16, 80, 16, 75, 0, 'Wenig Luftaustausch', 10, 1200, 'Klassische Methode auf Kompost', 'medium', 80);

-- Wiki-Artikel einfügen
INSERT OR IGNORE INTO wiki_articles (title, slug, category, content, excerpt, tags, featured, published) VALUES
('Sterilisation von Substraten', 'sterilisation-substrate', 'substrate', 
'# Sterilisation von Substraten

## Warum sterilisieren?
Substrate müssen sterilisiert werden, um schädliche Bakterien und Schimmelpilze zu eliminieren...

## Methoden:
1. **Pasteurisierung** (60-80°C für 1-2 Stunden)
2. **Druckkochtopf** (121°C, 15 PSI, 90 Minuten)
3. **Dampfsterilisation**

## Schritt-für-Schritt Anleitung:
...', 
'Lerne, wie du Substrate richtig sterilisierst für erfolgreiche Pilzzucht.',
'["sterilisation", "substrate", "hygiene"]', true, true),

('pH-Wert bei Pilzsubstraten', 'ph-wert-substrate', 'cultivation',
'# Der richtige pH-Wert

## Warum ist der pH-Wert wichtig?
Der pH-Wert beeinflusst das Wachstum der Pilze und verhindert schädliche Kontaminationen...

## Optimale pH-Bereiche:
- Austernpilze: 6.0-7.5
- Shiitake: 5.5-6.5  
- Champignons: 7.0-8.0

## pH-Wert messen und anpassen:
...', 
'Der pH-Wert ist entscheidend für erfolgreiche Pilzzucht.',
'["ph-wert", "substrate", "chemie"]', false, true),

('Kontamination erkennen', 'kontamination-erkennen', 'troubleshooting',
'# Kontamination erkennen und verhindern

## Häufige Kontaminationen:
1. **Grüner Schimmel** (Trichoderma)
2. **Schwarzer Schimmel** (Aspergillus)  
3. **Bakterielle Kontamination**

## Erkennungsmerkmale:
...', 
'Lerne, Kontaminationen früh zu erkennen und zu vermeiden.',
'["kontamination", "troubleshooting", "hygiene"]', true, true);

-- Beispiel Zucht-Log einfügen
INSERT OR IGNORE INTO cultivation_logs (
  protocol_id, batch_name, start_date, status,
  current_temperature, current_humidity, progress_percentage, notes
) VALUES
(1, 'Austernpilz Batch #1', '2024-09-15', 'fruiting', 18, 85, 80, 'Erste Pins sind sichtbar! Sehr vielversprechend.');

-- Log-Einträge für das Beispiel
INSERT OR IGNORE INTO log_entries (cultivation_log_id, entry_type, title, content) VALUES
(1, 'milestone', 'Inokulation abgeschlossen', 'Substrat erfolgreich mit Liquid Culture beimpft'),
(1, 'note', 'Tag 7 - Myzel sichtbar', 'Weißes Myzel breitet sich gut aus, keine Kontamination sichtbar'),
(1, 'milestone', 'Kolonisation abgeschlossen', 'Substrat vollständig vom Myzel durchzogen, bereit für Fruiting'),
(1, 'note', 'Erste Pins!', 'Heute die ersten kleinen Pilzköpfe entdeckt. Sehr aufregend!');