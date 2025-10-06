# Database Migration: Add Slug Columns

## Overview
This migration adds slug columns to the `events`, `trails`, `articles`, and `listings` tables to support SEO-friendly URLs.

## Changes
- **events**: Add `slug` column (varchar 200)
- **trails**: Add `slug` column (varchar 200)
- **articles**: Add `slug` column (varchar 200)
- **listings**: Add `slug` column (varchar 200)

## Migration Steps

### Option 1: Using Drizzle Kit (Recommended)
```bash
# Generate migration
npm run db:push

# This will automatically push the schema changes from schema.ts to the database
```

### Option 2: Manual SQL Migration
```bash
# Run the migration script
psql -U your_user -d salut_annecy -f migrations/add_slug_columns.sql
```

### Option 3: Using the seed script
```bash
# If the database is empty or you want to recreate it:
npm run seed

# This will:
# 1. Drop existing tables
# 2. Create new tables with slug columns
# 3. Populate with seed data including slugs
```

## After Migration

### Re-seed the Database
After adding the slug columns, you should re-seed the database to populate the slugs:

```bash
npm run seed
```

This will:
1. Clear all existing data
2. Recreate tables with the new schema
3. Insert seed data with generated slugs

### Add Constraints (Optional - for production)
Once data is populated with slugs, you can add constraints:

```sql
-- Add unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx ON events(slug);
CREATE UNIQUE INDEX IF NOT EXISTS trails_slug_idx ON trails(slug);
CREATE UNIQUE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE UNIQUE INDEX IF NOT EXISTS listings_slug_idx ON listings(slug);

-- Set NOT NULL constraints
ALTER TABLE events ALTER COLUMN slug SET NOT NULL;
ALTER TABLE trails ALTER COLUMN slug SET NOT NULL;
ALTER TABLE articles ALTER COLUMN slug SET NOT NULL;
ALTER TABLE listings ALTER COLUMN slug SET NOT NULL;
```

## Verification

After migration, verify the changes:

```sql
-- Check that slug columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name IN ('events', 'trails', 'articles', 'listings')
AND column_name = 'slug';

-- Check that slugs are populated
SELECT COUNT(*) as total, COUNT(slug) as with_slug FROM events;
SELECT COUNT(*) as total, COUNT(slug) as with_slug FROM trails;
SELECT COUNT(*) as total, COUNT(slug) as with_slug FROM articles;
SELECT COUNT(*) as total, COUNT(slug) as with_slug FROM listings;
```

## URL Changes

After this migration, the application will use SEO-friendly URLs:

| Content Type | Old URL | New URL |
|--------------|---------|---------|
| Events | `/event/{uuid}` | `/evenement/{slug}` |
| Articles | `/article/{uuid}` | `/article/{slug}` |
| Trails | `/trail/{uuid}` | `/sentier/{slug}` |
| Listings | `/annonce/{uuid}` | `/annonce/{slug}` |

The old UUID-based URLs will still work for backward compatibility.
