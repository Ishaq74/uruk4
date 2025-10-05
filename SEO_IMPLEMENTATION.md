# SEO Implementation - Documentation

## Vue d'ensemble

Une implémentation complète du SEO a été ajoutée à l'application Salut Annecy, incluant :
- Meta tags dynamiques pour toutes les pages principales
- Schémas JSON-LD (Schema.org) pour un meilleur référencement
- Support Open Graph et Twitter Cards
- Breadcrumbs structurés
- Meta tags par défaut dans index.html

## Composants créés

### 1. `components/SEO.tsx`
Composant React pour gérer dynamiquement les meta tags et les schémas JSON-LD.

**Fonctionnalités :**
- Mise à jour du titre de la page (`document.title`)
- Gestion des meta tags standards (description, keywords)
- Support Open Graph (Facebook, LinkedIn)
- Support Twitter Cards
- Injection de schémas JSON-LD

**Utilisation :**
```tsx
<SEO
  title="Mon titre"
  description="Ma description"
  image="https://example.com/image.jpg"
  url={window.location.href}
  type="article"
  jsonLd={monSchema}
/>
```

### 2. `utils/seo-schemas.ts`
Utilitaires pour générer des schémas JSON-LD conformes à Schema.org.

**Fonctions disponibles :**

#### `generateOrganizationSchema()`
Génère le schéma pour l'organisation Salut Annecy.

#### `generatePlaceSchema(place: Place)`
Génère un schéma pour un lieu (Restaurant, Hotel, LocalBusiness, etc.).
Types de schémas selon la catégorie :
- `restauration` → Restaurant
- `hebergement` → LodgingBusiness
- `activites` → TouristAttraction
- `commerces` → LocalBusiness

Inclut :
- Informations de base (nom, description, image)
- Adresse
- Coordonnées géographiques
- Note agrégée (si disponible)
- Horaires d'ouverture
- Fourchette de prix

#### `generateEventSchema(event: Event)`
Génère un schéma pour un événement avec :
- Informations de l'événement
- Localisation
- Tarification
- Statut de l'événement

#### `generateArticleSchema(article: Article, authorName?: string)`
Génère un schéma pour un article de blog/magazine avec :
- Titre, description, image
- Dates de publication/modification
- Auteur
- Éditeur

#### `generateTrailSchema(trail: Trail)`
Génère un schéma ExerciseRoute pour un sentier de randonnée avec :
- Distance
- Durée estimée
- Point de départ (coordonnées GPS)

#### `generateCollectionPageSchema(category, description, itemCount)`
Génère un schéma pour les pages de liste/catégorie.

#### `generateBreadcrumbSchema(items: {name, url}[])`
Génère un fil d'Ariane structuré pour la navigation.

## Pages mises à jour

### Pages de catégories (listes)

#### PlaceListPage
- **Routes :** `/restaurants`, `/hebergements`, `/activites`, `/commerces`
- **SEO ajouté :**
  - Titre et description dynamiques par catégorie
  - Schéma CollectionPage
  - Breadcrumbs

#### EventListPage
- **Route :** `/events`
- **SEO ajouté :**
  - Meta tags pour l'agenda des événements
  - Schéma CollectionPage
  - Breadcrumbs

#### ArticleListPage
- **Route :** `/articles`
- **SEO ajouté :**
  - Meta tags pour le magazine
  - Schéma CollectionPage
  - Breadcrumbs

#### TrailListPage
- **Route :** `/trails`
- **SEO ajouté :**
  - Meta tags pour les sentiers
  - Schéma CollectionPage
  - Breadcrumbs

### Pages de détails individuelles

#### PlaceDetailPage
- **Route :** `/place-detail/:id`
- **SEO ajouté :**
  - Titre : `{nom du lieu} - {catégorie}`
  - Description : extrait de la description (160 caractères)
  - Image du lieu
  - Schéma Place (Restaurant/LodgingBusiness/etc.)
  - Breadcrumbs : Accueil > Catégorie > Lieu

#### EventDetailPage
- **Route :** `/event-detail/:id`
- **SEO ajouté :**
  - Titre : nom de l'événement
  - Description : description de l'événement
  - Image de l'événement
  - Schéma Event
  - Breadcrumbs : Accueil > Événements > Événement

#### ArticleDetailPage
- **Route :** `/article-detail/:id`
- **SEO ajouté :**
  - Titre : titre de l'article
  - Description : excerpt de l'article
  - Image de l'article
  - Schéma Article
  - Breadcrumbs : Accueil > Magazine > Article

#### TrailDetailPage
- **Route :** `/trail-detail/:id`
- **SEO ajouté :**
  - Titre : `{nom du sentier} - Randonnée`
  - Description : excerpt ou description
  - Image du sentier
  - Schéma ExerciseRoute
  - Breadcrumbs : Accueil > Sentiers > Sentier

### Page d'accueil

#### HomePage
- **Route :** `/`
- **SEO ajouté :**
  - Titre : "Salut Annecy - Votre guide local complet"
  - Description générale
  - Schéma Organization

## index.html - Meta tags par défaut

Ajout des meta tags par défaut dans `index.html` :
- Description générale du site
- Keywords
- Open Graph tags (og:type, og:title, og:description, og:url)
- Twitter Card tags

Ces tags sont surchargés dynamiquement par le composant SEO sur chaque page.

## Exemple de schéma généré

### Pour un restaurant :
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Restaurant",
      "name": "Le Belvédère",
      "description": "Restaurant gastronomique avec vue sur le lac...",
      "image": "https://...",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Rue du Lac",
        "addressLocality": "Annecy",
        "addressCountry": "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 45.8992,
        "longitude": 6.1294
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": 4.5,
        "reviewCount": 42,
        "bestRating": 5,
        "worstRating": 0
      },
      "priceRange": "€€€",
      "openingHoursSpecification": [...]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [...]
    }
  ]
}
```

## Validation SEO

Pour valider l'implémentation :

1. **Google Rich Results Test**
   - URL : https://search.google.com/test/rich-results
   - Testez chaque type de page

2. **Schema Markup Validator**
   - URL : https://validator.schema.org/
   - Vérifiez la validité des schémas JSON-LD

3. **Meta tags testing**
   - Open Graph Debugger : https://developers.facebook.com/tools/debug/
   - Twitter Card Validator : https://cards-dev.twitter.com/validator

4. **Lighthouse SEO Audit**
   - Chrome DevTools > Lighthouse
   - Lancez un audit SEO

## Impact sur le référencement

Cette implémentation permet :
- ✅ Meilleur affichage dans les résultats de recherche Google
- ✅ Rich snippets (étoiles, prix, horaires, etc.)
- ✅ Cartes enrichies pour les événements
- ✅ Partages sociaux optimisés (Facebook, Twitter, LinkedIn)
- ✅ Navigation claire avec breadcrumbs
- ✅ Indexation améliorée des contenus

## Bonnes pratiques respectées

1. **Unique title par page** : Chaque page a un titre unique et descriptif
2. **Meta description optimisée** : 150-160 caractères par page
3. **Schémas structurés** : JSON-LD pour tous les types de contenus
4. **Images optimisées** : URL d'images incluses dans les meta tags
5. **URLs canoniques** : window.location.href utilisé
6. **Breadcrumbs** : Navigation claire pour utilisateurs et moteurs

## Maintenance

Pour ajouter le SEO à une nouvelle page :

1. Importer le composant SEO :
```tsx
import SEO from './SEO';
import { generateXXXSchema, generateBreadcrumbSchema } from '../utils/seo-schemas';
```

2. Créer les schémas nécessaires :
```tsx
const breadcrumbItems = [
  { name: 'Accueil', url: window.location.origin },
  { name: 'Ma Catégorie', url: window.location.href }
];

const schema = generateXXXSchema(...);
const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

const combinedSchema = {
  "@context": "https://schema.org",
  "@graph": [schema, breadcrumbSchema]
};
```

3. Ajouter le composant SEO dans le render :
```tsx
return (
  <div>
    <SEO
      title="Mon Titre"
      description="Ma description"
      type="website"
      jsonLd={combinedSchema}
    />
    {/* Contenu de la page */}
  </div>
);
```

## Notes techniques

- Les meta tags sont mis à jour via `useEffect` dans le composant SEO
- Les scripts JSON-LD sont nettoyés au démontage du composant pour éviter les doublons
- L'attribut `id="seo-schema"` est utilisé pour identifier et remplacer le script JSON-LD
- Le composant SEO retourne `null` (pas de rendu visuel)
