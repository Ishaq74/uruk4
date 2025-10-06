# Système de Traduction Multilingue - Complet

## Architecture

Le système utilise des **tables de traduction séparées** avec clés étrangères pour une meilleure performance et administration.

### Tables de Traduction Disponibles

Le système supporte maintenant les traductions pour **TOUS** les types de contenu :

1. ✅ **Events** (`event_translations`) - Événements
2. ✅ **Trails** (`trail_translations`) - Sentiers
3. ✅ **Articles** (`article_translations`) - Articles de blog
4. ✅ **Listings** (`listing_translations`) - Annonces
5. ✅ **Places** (`place_translations`) - Lieux (restaurants, hôtels, etc.)
6. ✅ **Groups** (`group_translations`) - Groupes communautaires
7. ✅ **Products** (`product_translations`) - Produits
8. ✅ **Services** (`service_translations`) - Services
9. ✅ **Static Pages** (`static_page_translations`) - Pages statiques

**Total: 9 tables de traduction** pour une couverture complète du contenu.

### Avantages

1. **Performance** 🚀
   - Requêtes optimisées : récupération uniquement de la langue demandée
   - Index sur `language` pour des recherches rapides
   - Contraintes uniques au niveau DB pour l'intégrité

2. **Administration** 🛠️
   - Gestion facile des traductions par langue
   - Ajout/suppression de langues sans modifier la structure
   - Traductions indépendantes (mise à jour d'une langue sans affecter les autres)

3. **SEO** 📈
   - URLs avec slugs SEO-friendly par langue
   - Contenu natif dans chaque langue (pas de traduction automatique)
   - Meta-données optimisées par langue

4. **Scalabilité** 📊
   - Support facile de nouvelles langues
   - Pas de limite de langues supportées
   - Séparation claire entre structure et contenu

## Structure des Tables

### Langues Supportées

```sql
CREATE TYPE language AS ENUM ('fr', 'en', 'es', 'de', 'ar', 'zh');
```

- `fr` - Français (par défaut)
- `en` - English
- `es` - Español
- `de` - Deutsch
- `ar` - العربية (Arabic)
- `zh` - 中文 (Chinese)

### Tables de Traduction

Chaque type de contenu a sa table de traduction :

#### 1. Event Translations (`event_translations`)

```typescript
{
  id: UUID (PK)
  eventId: UUID (FK → events.id)
  language: enum ('fr', 'en', 'es', 'de', 'ar', 'zh')
  title: varchar(200)
  description: text
  location: text
  createdAt: timestamp
  updatedAt: timestamp
  
  UNIQUE(eventId, language) // Une seule traduction par langue
}
```

#### 2. Trail Translations (`trail_translations`)

```typescript
{
  id: UUID (PK)
  trailId: UUID (FK → trails.id)
  language: enum
  name: varchar(200)
  excerpt: text
  description: text
  createdAt: timestamp
  updatedAt: timestamp
  
  UNIQUE(trailId, language)
}
```

#### 3. Article Translations (`article_translations`)

```typescript
{
  id: UUID (PK)
  articleId: UUID (FK → articles.id)
  language: enum
  title: varchar(200)
  excerpt: text
  content: text
  createdAt: timestamp
  updatedAt: timestamp
  
  UNIQUE(articleId, language)
}
```

#### 4. Listing Translations (`listing_translations`)

```typescript
{
  id: UUID (PK)
  listingId: UUID (FK → listings.id)
  language: enum
  title: varchar(200)
  description: text
  createdAt: timestamp
  updatedAt: timestamp
  
  UNIQUE(listingId, language)
}
```

#### 5. Place Translations (`place_translations`)

```typescript
{
  id: UUID (PK)
  placeId: UUID (FK → places.id)
  language: enum
  name: varchar(200)
  description: text
  address: text
  createdAt: timestamp
  updatedAt: timestamp
  
  UNIQUE(placeId, language)
}
```

#### 6. Group Translations (`group_translations`)

```typescript
{
  id: UUID (PK)
  groupId: UUID (FK → groups.id)
  language: enum
  name: varchar(100)
  description: text
  createdAt: timestamp
  updatedAt: timestamp
  
  UNIQUE(groupId, language)
}
```

#### 7. Product Translations (`product_translations`)

```typescript
{
  id: UUID (PK)
  productId: UUID (FK → products.id)
  language: enum
  name: varchar(200)
  description: text
  createdAt: timestamp
  updatedAt: timestamp
  
  UNIQUE(productId, language)
}
```

#### 8. Service Translations (`service_translations`)

```typescript
{
  id: UUID (PK)
  serviceId: UUID (FK → services.id)
  language: enum
  name: varchar(200)
  description: text
  createdAt: timestamp
  updatedAt: timestamp
  
  UNIQUE(serviceId, language)
}
```

#### 9. Static Page Translations (`static_page_translations`)

```typescript
{
  id: UUID (PK)
  pageId: UUID (FK → static_page_content.id)
  language: enum
  title: varchar(200)
  content: text (HTML)
  createdAt: timestamp
  updatedAt: timestamp
  
  UNIQUE(pageId, language)
}
```

## Utilisation

### Création de Contenu Multilingue

```typescript
// 1. Créer l'entité principale
const event = await db.insert(events).values({
  slug: 'fete-du-lac',
  date: '5 AOÛT',
  imageUrl: '...',
  category: 'Festival',
  // ... autres champs non-traduisibles
}).returning();

// 2. Ajouter les traductions
await db.insert(eventTranslations).values([
  {
    eventId: event.id,
    language: 'fr',
    title: 'Fête du Lac',
    description: 'Le plus grand spectacle pyrotechnique d\'Europe',
    location: 'Lac d\'Annecy'
  },
  {
    eventId: event.id,
    language: 'en',
    title: 'Lake Festival',
    description: 'Europe\'s largest fireworks display',
    location: 'Lake Annecy'
  },
  {
    eventId: event.id,
    language: 'es',
    title: 'Fiesta del Lago',
    description: 'El mayor espectáculo pirotécnico de Europa',
    location: 'Lago de Annecy'
  }
]);
```

### Récupération de Contenu Traduit

```typescript
// Récupérer un événement avec traduction
const getEvent = async (slug: string, language: string = 'fr') => {
  const event = await db.query.events.findFirst({
    where: eq(events.slug, slug),
    with: {
      translations: {
        where: eq(eventTranslations.language, language)
      }
    }
  });
  
  return {
    ...event,
    // Utiliser la traduction si disponible, sinon fallback
    title: event.translations[0]?.title || event.title,
    description: event.translations[0]?.description || event.description
  };
};
```

### Requête Optimisée avec Index

```typescript
// Récupérer tous les événements en anglais
const eventsInEnglish = await db
  .select({
    id: events.id,
    slug: events.slug,
    date: events.date,
    title: eventTranslations.title,
    description: eventTranslations.description,
    location: eventTranslations.location
  })
  .from(events)
  .leftJoin(
    eventTranslations,
    and(
      eq(eventTranslations.eventId, events.id),
      eq(eventTranslations.language, 'en')
    )
  )
  .where(eq(events.status, 'published'));
```

## Migration

### Étape 1 : Exécuter le Script SQL

```bash
psql -U user -d salut_annecy -f migrations/add_translation_tables.sql
```

Ou avec Drizzle Kit:

```bash
npm run db:push
```

### Étape 2 : Migration des Données Existantes

Le script SQL migre automatiquement le contenu français existant vers les tables de traduction.

### Étape 3 : Ajouter les Traductions

Utiliser l'interface admin pour ajouter des traductions dans d'autres langues.

## Interface Admin

L'admin dashboard doit être étendu pour gérer les traductions :

### Fonctionnalités Recommandées

1. **Vue par Langue**
   - Onglets pour chaque langue
   - Indicateur de traductions manquantes
   - Copie depuis une autre langue

2. **Édition de Traductions**
   - Formulaire côte à côte (français + langue cible)
   - Prévisualisation en temps réel
   - Validation des champs requis

3. **Gestion des Langues**
   - Activer/désactiver des langues par contenu
   - Statistiques de traduction (% complétude)
   - Export/import de traductions

## SEO & URLs

### Structure des URLs Multilingues

```
/evenement/fete-du-lac           (français - défaut)
/en/event/lake-festival          (anglais)
/es/evento/fiesta-del-lago       (espagnol)
/de/veranstaltung/seefest        (allemand)
```

### Balises HTML pour SEO

```html
<!-- Balises hreflang pour SEO multilingue -->
<link rel="alternate" hreflang="fr" href="https://salut-annecy.com/evenement/fete-du-lac" />
<link rel="alternate" hreflang="en" href="https://salut-annecy.com/en/event/lake-festival" />
<link rel="alternate" hreflang="es" href="https://salut-annecy.com/es/evento/fiesta-del-lago" />
<link rel="alternate" hreflang="x-default" href="https://salut-annecy.com/evenement/fete-du-lac" />
```

## Performance

### Index Créés

```sql
-- Index sur event_id pour jointures rapides
CREATE INDEX idx_event_translations_event_id ON event_translations(event_id);

-- Index sur language pour filtrage par langue
CREATE INDEX idx_event_translations_language ON event_translations(language);
```

### Temps de Requête Estimés

- Récupération d'un événement avec traduction : **< 5ms**
- Liste de 50 événements avec traductions : **< 20ms**
- Recherche full-text multilingue : **< 50ms** (avec pg_trgm)

## Fallback Strategy

### Ordre de Préférence

1. **Langue demandée** (ex: anglais)
2. **Langue par défaut** (français)
3. **Première langue disponible**

```typescript
const getTranslatedContent = (entity: Event, requestedLang: string) => {
  // Chercher dans l'ordre de préférence
  const translation = 
    entity.translations.find(t => t.language === requestedLang) ||
    entity.translations.find(t => t.language === 'fr') ||
    entity.translations[0];
    
  return translation || {
    title: entity.title, // Fallback sur données principales
    description: entity.description
  };
};
```

## Maintenance

### Ajouter une Nouvelle Langue

1. Ajouter au enum `language` dans le schéma
2. Exécuter la migration
3. Créer les traductions via l'interface admin

### Supprimer une Langue

```sql
-- Supprimer toutes les traductions d'une langue
DELETE FROM event_translations WHERE language = 'de';
DELETE FROM trail_translations WHERE language = 'de';
DELETE FROM article_translations WHERE language = 'de';
DELETE FROM listing_translations WHERE language = 'de';
```

## API Endpoints Recommandés

```typescript
// GET /api/events/:slug?lang=en
app.get('/api/events/:slug', async (req, res) => {
  const { slug } = req.params;
  const lang = req.query.lang || 'fr';
  
  const event = await getEventWithTranslation(slug, lang);
  res.json(event);
});

// POST /api/admin/events/:id/translations
app.post('/api/admin/events/:id/translations', async (req, res) => {
  const { id } = req.params;
  const { language, title, description, location } = req.body;
  
  await db.insert(eventTranslations).values({
    eventId: id,
    language,
    title,
    description,
    location
  });
  
  res.json({ success: true });
});

// PUT /api/admin/events/:id/translations/:lang
app.put('/api/admin/events/:id/translations/:lang', async (req, res) => {
  const { id, lang } = req.params;
  const { title, description, location } = req.body;
  
  await db.update(eventTranslations)
    .set({ title, description, location, updatedAt: new Date() })
    .where(
      and(
        eq(eventTranslations.eventId, id),
        eq(eventTranslations.language, lang)
      )
    );
  
  res.json({ success: true });
});
```

## Conclusion

Ce système de traduction offre :
- ✅ **Meilleures performances** grâce aux tables séparées et index
- ✅ **Administration facile** avec gestion indépendante des langues
- ✅ **SEO optimisé** avec contenu natif et URLs multilingues
- ✅ **Scalabilité** pour supporter de nouvelles langues facilement
- ✅ **Intégrité des données** avec contraintes FK et unique

Pour des questions ou améliorations, voir la documentation principale.
