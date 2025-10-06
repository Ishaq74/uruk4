-- Migration: Add translation tables for multilingual content
-- Date: 2024
-- Description: Add separate translation tables with foreign keys for all translatable content types
-- Benefits: Better performance, easier administration, improved SEO with language-specific URLs

-- Create language enum if not exists
DO $$ BEGIN
    CREATE TYPE language AS ENUM ('fr', 'en', 'es', 'de', 'ar', 'zh');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Event Translations Table
CREATE TABLE IF NOT EXISTS event_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    language language NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT event_translations_event_id_language_unique UNIQUE (event_id, language)
);

-- Trail Translations Table
CREATE TABLE IF NOT EXISTS trail_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trail_id UUID NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
    language language NOT NULL,
    name VARCHAR(200) NOT NULL,
    excerpt TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT trail_translations_trail_id_language_unique UNIQUE (trail_id, language)
);

-- Article Translations Table
CREATE TABLE IF NOT EXISTS article_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    language language NOT NULL,
    title VARCHAR(200) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT article_translations_article_id_language_unique UNIQUE (article_id, language)
);

-- Listing Translations Table
CREATE TABLE IF NOT EXISTS listing_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    language language NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT listing_translations_listing_id_language_unique UNIQUE (listing_id, language)
);

-- Place Translations Table
CREATE TABLE IF NOT EXISTS place_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    language language NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT place_translations_place_id_language_unique UNIQUE (place_id, language)
);

-- Group Translations Table
CREATE TABLE IF NOT EXISTS group_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    language language NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT group_translations_group_id_language_unique UNIQUE (group_id, language)
);

-- Product Translations Table
CREATE TABLE IF NOT EXISTS product_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    language language NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT product_translations_product_id_language_unique UNIQUE (product_id, language)
);

-- Service Translations Table
CREATE TABLE IF NOT EXISTS service_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    language language NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT service_translations_service_id_language_unique UNIQUE (service_id, language)
);

-- Static Page Translations Table
CREATE TABLE IF NOT EXISTS static_page_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES static_page_content(id) ON DELETE CASCADE,
    language language NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT static_page_translations_page_id_language_unique UNIQUE (page_id, language)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_translations_event_id ON event_translations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_translations_language ON event_translations(language);
CREATE INDEX IF NOT EXISTS idx_trail_translations_trail_id ON trail_translations(trail_id);
CREATE INDEX IF NOT EXISTS idx_trail_translations_language ON trail_translations(language);
CREATE INDEX IF NOT EXISTS idx_article_translations_article_id ON article_translations(article_id);
CREATE INDEX IF NOT EXISTS idx_article_translations_language ON article_translations(language);
CREATE INDEX IF NOT EXISTS idx_listing_translations_listing_id ON listing_translations(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_translations_language ON listing_translations(language);
CREATE INDEX IF NOT EXISTS idx_place_translations_place_id ON place_translations(place_id);
CREATE INDEX IF NOT EXISTS idx_place_translations_language ON place_translations(language);
CREATE INDEX IF NOT EXISTS idx_group_translations_group_id ON group_translations(group_id);
CREATE INDEX IF NOT EXISTS idx_group_translations_language ON group_translations(language);
CREATE INDEX IF NOT EXISTS idx_product_translations_product_id ON product_translations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_translations_language ON product_translations(language);
CREATE INDEX IF NOT EXISTS idx_service_translations_service_id ON service_translations(service_id);
CREATE INDEX IF NOT EXISTS idx_service_translations_language ON service_translations(language);
CREATE INDEX IF NOT EXISTS idx_static_page_translations_page_id ON static_page_translations(page_id);
CREATE INDEX IF NOT EXISTS idx_static_page_translations_language ON static_page_translations(language);

-- Migrate existing French content to translation tables
-- This assumes the main tables have the default French content

-- Migrate Events
INSERT INTO event_translations (event_id, language, title, description, location, created_at, updated_at)
SELECT id, 'fr', title, description, location, created_at, updated_at
FROM events
ON CONFLICT (event_id, language) DO NOTHING;

-- Migrate Trails
INSERT INTO trail_translations (trail_id, language, name, excerpt, description, created_at, updated_at)
SELECT id, 'fr', name, excerpt, description, created_at, updated_at
FROM trails
ON CONFLICT (trail_id, language) DO NOTHING;

-- Migrate Articles
INSERT INTO article_translations (article_id, language, title, excerpt, content, created_at, updated_at)
SELECT id, 'fr', title, excerpt, content, created_at, updated_at
FROM articles
ON CONFLICT (article_id, language) DO NOTHING;

-- Migrate Listings
INSERT INTO listing_translations (listing_id, language, title, description, created_at, updated_at)
SELECT id, 'fr', title, description, created_at, updated_at
FROM listings
ON CONFLICT (listing_id, language) DO NOTHING;

-- Migrate Places
INSERT INTO place_translations (place_id, language, name, description, address, created_at, updated_at)
SELECT id, 'fr', name, description, address, created_at, updated_at
FROM places
ON CONFLICT (place_id, language) DO NOTHING;

-- Migrate Groups
INSERT INTO group_translations (group_id, language, name, description, created_at, updated_at)
SELECT id, 'fr', name, description, created_at, updated_at
FROM groups
ON CONFLICT (group_id, language) DO NOTHING;

-- Migrate Products
INSERT INTO product_translations (product_id, language, name, description, created_at, updated_at)
SELECT id, 'fr', name, description, created_at, updated_at
FROM products
ON CONFLICT (product_id, language) DO NOTHING;

-- Migrate Services
INSERT INTO service_translations (service_id, language, name, description, created_at, updated_at)
SELECT id, 'fr', name, description, created_at, updated_at
FROM services
ON CONFLICT (service_id, language) DO NOTHING;

-- Migrate Static Pages
INSERT INTO static_page_translations (page_id, language, title, content, created_at, updated_at)
SELECT id, 'fr', title, content, created_at, updated_at
FROM static_page_content
ON CONFLICT (page_id, language) DO NOTHING;

-- Note: After this migration, consider updating the main tables to make translatable fields nullable
-- or remove them entirely if you want to enforce all content to be in translation tables
