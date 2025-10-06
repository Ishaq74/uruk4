-- Migration: Add translation tables for multilingual content
-- Date: 2024
-- Description: Add separate translation tables with foreign keys for events, trails, articles, and listings
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_translations_event_id ON event_translations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_translations_language ON event_translations(language);
CREATE INDEX IF NOT EXISTS idx_trail_translations_trail_id ON trail_translations(trail_id);
CREATE INDEX IF NOT EXISTS idx_trail_translations_language ON trail_translations(language);
CREATE INDEX IF NOT EXISTS idx_article_translations_article_id ON article_translations(article_id);
CREATE INDEX IF NOT EXISTS idx_article_translations_language ON article_translations(language);
CREATE INDEX IF NOT EXISTS idx_listing_translations_listing_id ON listing_translations(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_translations_language ON listing_translations(language);

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

-- Note: After this migration, consider updating the main tables to make translatable fields nullable
-- or remove them entirely if you want to enforce all content to be in translation tables
