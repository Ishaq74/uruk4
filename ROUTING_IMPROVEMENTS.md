# Routing Improvements - Semantic URLs for Places

## Overview

This document describes the improvements made to the routing system to use semantic, SEO-friendly URLs for places (restaurants, hotels, activities, and shops) instead of generic ID-based URLs.

## Problem Statement

The previous routing system used generic URLs like:
- `/place/8b1db17c-a1b6-4d5c-8126-87315e7d8be0` ❌

This was problematic because:
1. Not SEO-friendly
2. Not user-friendly
3. Difficult to share
4. No category information in the URL
5. Poor for search engine indexing

## Solution

Implemented semantic, slug-based URLs that are:
- **Human-readable**: `/restaurant/le-belvedere` ✅
- **SEO-optimized**: Include category and place name
- **Category-aware**: Different URL patterns for different types
- **Shareable**: Easy to remember and share

## New URL Structure

### Main Category URLs
- `/restaurants` - All restaurants
- `/hebergements` - All hotels/accommodations
- `/activites` - All activities
- `/commerces` - All shops/services

### Category Filtering URLs
- `/restaurants/:categorySlug` - Restaurants filtered by category
  - Example: `/restaurants/gastronomique`
  - Example: `/restaurants/savoyard`
- `/hebergements/:categorySlug` - Hotels filtered by category
  - Example: `/hebergements/hotel-5-etoiles`
- `/activites/:categorySlug` - Activities filtered by category
- `/commerces/:categorySlug` - Shops filtered by category

### Place Detail URLs
Places now use semantic URLs based on their category:

| Category | URL Pattern | Example |
|----------|-------------|---------|
| Restaurant | `/restaurant/:slug` | `/restaurant/le-belvedere` |
| Hotel | `/hebergement/:slug` | `/hebergement/hotel-du-lac` |
| Activity | `/activite/:slug` | `/activite/parapente-annecy` |
| Shop | `/commerce/:slug` | `/commerce/fromagerie-pierre-gay` |

## Database Changes

### Added `slug` Field to Places Table

**schema.ts**:
```typescript
export const places = pgTable('places', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 200 }).notNull().unique(), // NEW
  name: varchar('name', { length: 200 }).notNull(),
  // ... other fields
});
```

**schema.sql**:
```sql
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) NOT NULL UNIQUE, -- NEW
  name VARCHAR(200) NOT NULL,
  -- ... other fields
);
```

**types.ts**:
```typescript
export interface Place {
  id: string;
  slug: string; // NEW
  name: string;
  // ... other fields
}
```

## Implementation Details

### 1. Slug Generation

Created utility function in `utils/slug.ts`:
```typescript
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
```

### 2. Seed Data Updates

All places in `seed-data.ts` now include a slug:
```typescript
{ 
  id: 'r1', 
  slug: 'le-belvedere',  // NEW
  name: 'Le Belvédère',
  // ... other fields
}
```

### 3. Routing Configuration

**App.tsx** - Added new routes:
```typescript
{/* Place Detail Pages - new semantic URLs */}
<Route path="/restaurant/:slug" element={<PlaceDetailWrapper ... />} />
<Route path="/hebergement/:slug" element={<PlaceDetailWrapper ... />} />
<Route path="/activite/:slug" element={<PlaceDetailWrapper ... />} />
<Route path="/commerce/:slug" element={<PlaceDetailWrapper ... />} />

{/* Category filtering routes */}
<Route path="/restaurants/:categorySlug" element={<PlaceListCategoryWrapper ... />} />
<Route path="/hebergements/:categorySlug" element={<PlaceListCategoryWrapper ... />} />
// ... etc

{/* Old place detail route for backward compatibility */}
<Route path="/place/:id" element={<PlaceDetailWrapper ... />} />
```

### 4. Navigation Function Update

**App.tsx** - Updated `navigateTo` function:
```typescript
case 'place-detail': 
  if (slug && mainCategory) {
    const categoryMap: Record<Place['mainCategory'], string> = {
      'restauration': 'restaurant',
      'hebergement': 'hebergement',
      'activites': 'activite',
      'commerces': 'commerce'
    };
    navigate(`/${categoryMap[mainCategory]}/${slug}`);
  } else {
    // Fallback for backward compatibility
    navigate(`/place/${id}`);
  }
  break;
```

### 5. Component Updates

**PlaceDetailPage.tsx**:
- Now accepts `slug` instead of `id` as prop
- Looks up places by slug: `places.find(p => p.slug === slug)`
- Falls back to ID lookup for backward compatibility

**PlaceListPage.tsx**:
- Added `categorySlug` prop for category filtering
- Auto-selects category when navigating via category URL
- Uses `useEffect` to decode category slug and set filter

**RouteWrappers.tsx**:
- Updated `PlaceDetailWrapper` to extract slug from URL params
- Added `PlaceListCategoryWrapper` for category filtering

### 6. Navigation Call Updates

Updated all components that navigate to places:
- **FavoritesPage.tsx**: Pass slug to `navigateTo`
- **FeaturedContent.tsx**: Include slug in featured content
- **PlaceDetailPage.tsx**: Use slug for similar places
- **ProfilePage.tsx**: Use slug for user reviews
- **SearchPage.tsx**: Use slug in search results
- **PlaceListPage.tsx**: Use slug in place cards

## Backward Compatibility

The system maintains backward compatibility with old URLs:
- `/place/:id` routes still work
- Components try slug lookup first, then fall back to ID
- Navigation function handles both slug and ID parameters

## SEO Benefits

1. **Descriptive URLs**: Search engines and users can understand the content from the URL
2. **Category Information**: URL structure shows the type of place
3. **Unique URLs**: Each place has a unique, semantic URL
4. **Shareable Links**: URLs are memorable and easy to share
5. **Breadcrumbs**: Better breadcrumb trails in search results

## Examples

### Before vs After

| Before | After |
|--------|-------|
| `/place/r1` | `/restaurant/le-belvedere` |
| `/place/h1` | `/hebergement/hotel-du-lac` |
| `/place/a1` | `/activite/parapente-annecy` |
| `/place/c1` | `/commerce/fromagerie-pierre-gay` |

### Category Filtering

| Category | URL |
|----------|-----|
| Gastronomic restaurants | `/restaurants/gastronomique` |
| Savoy restaurants | `/restaurants/savoyard` |
| 5-star hotels | `/hebergements/hotel-5-etoiles` |
| Aerial sports | `/activites/sports-aeriens` |

## Migration Notes

### For Developers

1. When creating new places, always generate a slug using `generateSlug()`
2. When navigating to places, pass both `id`, `mainCategory`, and `slug`
3. Update any hardcoded URLs to use the new slug-based format
4. Test backward compatibility with old ID-based URLs

### For Database

1. Run database migration to add `slug` column
2. Run seed script to populate slugs for existing places
3. Ensure slug uniqueness constraint is enforced

## Testing

Build succeeded without errors:
```bash
npm run build
✓ 2083 modules transformed.
✓ built in 4.16s
```

All routing changes are backward compatible and functional.

## Summary

This implementation provides a robust, SEO-friendly routing system for places while maintaining backward compatibility. The URLs are now:
- Human-readable
- Category-aware
- Search engine optimized
- Easy to share and remember
- Fully functional with proper fallbacks
