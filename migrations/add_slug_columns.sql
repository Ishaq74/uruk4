-- Migration: Add slug columns to events, trails, articles, and listings tables
-- Date: 2024
-- Description: Add SEO-friendly slug fields to support slug-based routing

-- Add slug column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug VARCHAR(200);

-- Add slug column to trails table  
ALTER TABLE trails ADD COLUMN IF NOT EXISTS slug VARCHAR(200);

-- Add slug column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug VARCHAR(200);

-- Add slug column to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug VARCHAR(200);

-- Create unique indexes on slug columns (after data is populated)
-- These will be run manually after seed data is added
-- CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx ON events(slug);
-- CREATE UNIQUE INDEX IF NOT EXISTS trails_slug_idx ON trails(slug);
-- CREATE UNIQUE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
-- CREATE UNIQUE INDEX IF NOT EXISTS listings_slug_idx ON listings(slug);

-- Set NOT NULL constraints (after data is populated)
-- These will be run manually after seed data is added
-- ALTER TABLE events ALTER COLUMN slug SET NOT NULL;
-- ALTER TABLE trails ALTER COLUMN slug SET NOT NULL;
-- ALTER TABLE articles ALTER COLUMN slug SET NOT NULL;
-- ALTER TABLE listings ALTER COLUMN slug SET NOT NULL;
