-- MUSHROOM MANAGER - Database Schema
-- Supabase PostgreSQL Schema

-- 1. Zuchtprotokolle Tabelle
CREATE TABLE protocols (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    mushroom_species VARCHAR(100) NOT NULL,
    batch_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    substrate_type VARCHAR(100),
    inoculation_method VARCHAR(100),
    temperature_range VARCHAR(50),
    humidity_range VARCHAR(50),
    growth_stage VARCHAR(50) DEFAULT 'inoculation',
    notes TEXT,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    yield_amount DECIMAL(10,2),
    yield_unit VARCHAR(20) DEFAULT 'g',
    success_rate INTEGER CHECK (success_rate >= 0 AND success_rate <= 100),
    images TEXT[], -- Array of image URLs
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Protokoll-Einträge (Timeline/Log-Einträge)
CREATE TABLE protocol_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    protocol_id UUID REFERENCES protocols(id) ON DELETE CASCADE,
    entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    entry_type VARCHAR(50) NOT NULL, -- 'observation', 'action', 'measurement'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    temperature DECIMAL(4,1),
    humidity DECIMAL(4,1),
    ph_value DECIMAL(3,1),
    images TEXT[], -- Array of image URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Wiki-Artikel Tabelle
CREATE TABLE wiki_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    tags TEXT[],
    images TEXT[], -- Array of image URLs
    author VARCHAR(100) DEFAULT 'Admin',
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Wiki-Kategorien
CREATE TABLE wiki_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#10b981', -- Hex color for UI
    icon VARCHAR(50) DEFAULT 'fas fa-book',
    article_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Inventar-Tabelle (für später)
CREATE TABLE inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    supplier VARCHAR(100),
    purchase_date DATE,
    expiry_date DATE,
    cost DECIMAL(10,2),
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes für Performance
CREATE INDEX idx_protocols_species ON protocols(mushroom_species);
CREATE INDEX idx_protocols_status ON protocols(status);
CREATE INDEX idx_protocols_created_at ON protocols(created_at DESC);
CREATE INDEX idx_protocol_entries_protocol_id ON protocol_entries(protocol_id);
CREATE INDEX idx_protocol_entries_date ON protocol_entries(entry_date DESC);
CREATE INDEX idx_wiki_articles_category ON wiki_articles(category);
CREATE INDEX idx_wiki_articles_status ON wiki_articles(status);
CREATE INDEX idx_wiki_articles_slug ON wiki_articles(slug);

-- Trigger für updated_at automatische Updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_protocols_updated_at BEFORE UPDATE ON protocols
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wiki_articles_updated_at BEFORE UPDATE ON wiki_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Beispiel-Daten einfügen
INSERT INTO wiki_categories (name, description, icon) VALUES
    ('Pilzarten', 'Informationen über verschiedene Pilzarten', 'fas fa-seedling'),
    ('Substrate', 'Nährböden und Substrate für die Pilzzucht', 'fas fa-layer-group'),
    ('Techniken', 'Zucht- und Anbautechniken', 'fas fa-tools'),
    ('Probleme', 'Häufige Probleme und Lösungen', 'fas fa-exclamation-triangle'),
    ('Equipment', 'Ausrüstung und Werkzeuge', 'fas fa-cogs');

INSERT INTO wiki_articles (title, slug, category, summary, content, tags) VALUES
    (
        'Austernpilz (Pleurotus ostreatus)',
        'austernpilz-pleurotus-ostreatus',
        'Pilzarten',
        'Der Austernpilz ist einer der beliebtesten Speisepilze für Hobbyzüchter.',
        '# Austernpilz (Pleurotus ostreatus)\n\n## Eigenschaften\nDer Austernpilz ist ein robuster und ertragreicher Pilz, der sich hervorragend für Anfänger eignet.\n\n## Optimale Bedingungen\n- **Temperatur**: 15-25°C\n- **Luftfeuchtigkeit**: 85-95%\n- **Substrate**: Stroh, Kaffeesatz, Holzspäne\n\n## Wachstumsphasen\n1. Inokulation\n2. Durchwachsung (10-14 Tage)\n3. Fruktifikation (5-7 Tage)\n4. Ernte\n\n## Häufige Probleme\n- **Grünschimmel**: Meist durch zu hohe Feuchtigkeit\n- **Langsames Wachstum**: Temperatur prüfen',
        ARRAY['anfänger', 'pleurotus', 'austernpilz', 'einfach']
    ),
    (
        'Shiitake (Lentinula edodes)',
        'shiitake-lentinula-edodes',
        'Pilzarten',
        'Shiitake-Pilze sind anspruchsvoller, aber sehr schmackhaft und wertvoll.',
        '# Shiitake (Lentinula edodes)\n\n## Eigenschaften\nShiitake-Pilze sind für ihren intensiven Geschmack und ihre gesundheitlichen Vorteile bekannt.\n\n## Optimale Bedingungen\n- **Temperatur**: 12-18°C (Fruktifikation)\n- **Luftfeuchtigkeit**: 80-90%\n- **Substrat**: Laubholz (Buche, Eiche)\n\n## Besonderheiten\n- Längere Inkubationszeit (6-12 Wochen)\n- Kälteschock für Fruktifikation erforderlich\n- Mehrere Erntewellen möglich',
        ARRAY['fortgeschritten', 'shiitake', 'lentinula', 'laubholz']
    );

-- Beispiel-Protokoll
INSERT INTO protocols (title, mushroom_species, batch_name, start_date, substrate_type, temperature_range, humidity_range, notes) VALUES
    (
        'Austernpilz Zucht #1',
        'Pleurotus ostreatus',
        'AP-2024-001',
        CURRENT_DATE - INTERVAL '10 days',
        'Weizenstroh',
        '18-22°C',
        '85-90%',
        'Erste Austernpilz-Zucht auf Weizenstroh. Substrat wurde 2h bei 80°C pasteurisiert.'
    );