# Schéma de Base de Données - Salut Annecy

## 📋 Vue d'ensemble

Ce document décrit le schéma complet et intégral de la base de données pour l'application "Salut Annecy". Le schéma est conçu pour être utilisé avec **PostgreSQL** et **Drizzle ORM**, en préparation de l'intégration avec **Better-Auth** pour l'authentification.

## 🏗️ Architecture

### Technologies

- **Base de données**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentification**: Better-Auth (à intégrer)
- **Langage**: TypeScript

### Structure Modulaire

Le schéma est organisé en 7 modules principaux :

1. **Authentification & Utilisateurs**
2. **Gestion de Contenu**
3. **Communauté**
4. **Fonctionnalités Professionnelles**
5. **Commerce & Réservations**
6. **Système & Administration**
7. **Analytiques & Publicité**

---

## 📊 Tables et Relations

### 1. AUTHENTIFICATION & UTILISATEURS

#### `user_levels` - Niveaux de Gamification

Système de progression des utilisateurs basé sur les points.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | Identifiant unique (PK) |
| `name` | VARCHAR(100) | Nom du niveau (ex: "Nouveau venu", "Expert Local") |
| `min_points` | INTEGER | Points minimum requis |
| `created_at` | TIMESTAMP | Date de création |

**Niveaux prévus:**

- Niveau 1: Nouveau venu (0 points)
- Niveau 2: Contributeur (50 points)
- Niveau 3: Expert Local (250 points)

#### `profiles` - Profils Utilisateurs

Informations détaillées des utilisateurs et données de gamification.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `user_id` | TEXT | Référence vers Better-Auth user (UNIQUE) |
| `username` | VARCHAR(50) | Nom d'utilisateur unique |
| `full_name` | VARCHAR(200) | Nom complet |
| `avatar_url` | TEXT | URL de l'avatar |
| `cover_image_url` | TEXT | URL de l'image de couverture |
| `bio` | TEXT | Biographie |
| `level_id` | INTEGER | FK vers `user_levels` |
| `join_date` | TIMESTAMP | Date d'inscription |
| `is_verified` | BOOLEAN | Compte vérifié |
| `points` | INTEGER | Points de gamification |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

#### `user_favorite_places` - Lieux Favoris

Relation many-to-many entre utilisateurs et lieux.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `profile_id` | UUID | FK vers `profiles` |
| `place_id` | UUID | FK vers `places` |
| `created_at` | TIMESTAMP | Date d'ajout |

---

### 2. GESTION DE CONTENU

#### 2.1 Lieux (`places`)

Table principale pour restaurants, hébergements, activités, commerces.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `name` | VARCHAR(200) | Nom du lieu |
| `image_url` | TEXT | URL de l'image principale |
| `rating` | REAL | Note moyenne (0-5) |
| `review_count` | INTEGER | Nombre d'avis |
| `category` | VARCHAR(100) | Sous-catégorie spécifique |
| `main_category` | ENUM | Catégorie principale (restauration, hebergement, activites, commerces) |
| `price_range` | ENUM | Gamme de prix (€, €€, €€€, €€€€) |
| `attributes` | JSONB | Attributs (terrasse, wifi, parking, etc.) |
| `description` | TEXT | Description détaillée |
| `opening_hours` | JSONB | Horaires d'ouverture par jour |
| `latitude` | REAL | Coordonnée GPS |
| `longitude` | REAL | Coordonnée GPS |
| `address` | TEXT | Adresse complète |
| `phone` | VARCHAR(20) | Téléphone |
| `website` | TEXT | Site web |
| `organization_id` | UUID | FK vers `organizations` |
| `status` | ENUM | Statut de publication |
| `rejection_reason` | TEXT | Raison du rejet (si applicable) |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |
| `published_at` | TIMESTAMP | Date de publication |

**Catégories principales:**

- `restauration`: Restaurants, cafés, pizzerias, gastronomique, savoyard
- `hebergement`: Hôtels, chambres d'hôtes, gîtes
- `activites`: Sports aériens, activités nautiques, terrestres
- `commerces`: Produits du terroir, artisanat

#### `reviews` - Avis sur les Lieux

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `profile_id` | UUID | FK vers `profiles` |
| `place_id` | UUID | FK vers `places` |
| `rating` | INTEGER | Note (1-5) |
| `comment` | TEXT | Commentaire |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

#### 2.2 Événements (`events`)

Festivals, concerts, marchés, événements sportifs et culturels.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `title` | VARCHAR(200) | Titre de l'événement |
| `date` | VARCHAR(100) | Date ou récurrence (ex: "CHAQUE VENDREDI") |
| `location` | TEXT | Lieu de l'événement |
| `image_url` | TEXT | URL de l'image |
| `category` | ENUM | Catégorie (Festival, Concert, Marché, Sport, Culture) |
| `price` | VARCHAR(50) | Prix (peut être "Gratuit") |
| `description` | TEXT | Description détaillée |
| `latitude` | REAL | Coordonnée GPS |
| `longitude` | REAL | Coordonnée GPS |
| `status` | ENUM | Statut de publication |
| `rejection_reason` | TEXT | Raison du rejet |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |
| `published_at` | TIMESTAMP | Date de publication |

#### 2.3 Sentiers de Randonnée (`trails`)

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `name` | VARCHAR(200) | Nom du sentier |
| `image_url` | TEXT | URL de l'image |
| `distance_km` | REAL | Distance en km |
| `duration_min` | INTEGER | Durée en minutes |
| `ascent_m` | INTEGER | Dénivelé en mètres |
| `difficulty` | ENUM | Difficulté (Facile, Moyen, Difficile, Expert) |
| `excerpt` | TEXT | Résumé court |
| `description` | TEXT | Description complète |
| `start_point_lat` | REAL | Point de départ - latitude |
| `start_point_lng` | REAL | Point de départ - longitude |
| `gpx_url` | TEXT | URL du fichier GPX |
| `status` | ENUM | Statut de publication |
| `rejection_reason` | TEXT | Raison du rejet |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |
| `published_at` | TIMESTAMP | Date de publication |

#### 2.4 Petites Annonces (`listings`)

Emploi, immobilier, bonnes affaires, services.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `title` | VARCHAR(200) | Titre de l'annonce |
| `type` | ENUM | Type (Emploi, Immobilier, Bonnes Affaires, Services) |
| `price` | VARCHAR(50) | Prix |
| `date` | VARCHAR(100) | Date de disponibilité |
| `image_url` | TEXT | URL de l'image |
| `metadata` | JSONB | Données spécifiques au type |
| `user_id` | UUID | FK vers `profiles` |
| `description` | TEXT | Description |
| `status` | ENUM | Statut de publication |
| `expires_at` | TIMESTAMP | Date d'expiration |
| `rejection_reason` | TEXT | Raison du rejet |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |
| `published_at` | TIMESTAMP | Date de publication |

#### 2.5 Articles (`articles`)

Contenu éditorial, guides, recommandations.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `image_url` | TEXT | URL de l'image de couverture |
| `title` | VARCHAR(200) | Titre |
| `excerpt` | TEXT | Extrait/résumé |
| `author_id` | UUID | FK vers `profiles` |
| `content` | TEXT | Contenu Markdown |
| `status` | ENUM | Statut de publication |
| `rejection_reason` | TEXT | Raison du rejet |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |
| `published_at` | TIMESTAMP | Date de publication |

#### `comments` - Commentaires

Commentaires sur articles et autres contenus.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `author_id` | UUID | FK vers `profiles` |
| `target_entity_id` | UUID | ID de l'entité commentée |
| `target_entity_type` | VARCHAR(50) | Type d'entité (article, place, etc.) |
| `content` | TEXT | Contenu du commentaire |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

#### 2.6 Événements Live (`live_events`)

Événements éphémères en temps réel (promos, alertes, trafic, météo).

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `type` | ENUM | Type (Promo, Alerte, Info, Trafic, Météo, Affluence) |
| `title` | VARCHAR(200) | Titre |
| `location` | TEXT | Lieu |
| `latitude` | REAL | Coordonnée GPS |
| `longitude` | REAL | Coordonnée GPS |
| `author_id` | UUID | FK vers `profiles` |
| `expires_at` | TIMESTAMP | Date d'expiration |
| `created_at` | TIMESTAMP | Date de création |

#### `live_event_votes` - Votes sur Événements Live

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `live_event_id` | UUID | FK vers `live_events` |
| `profile_id` | UUID | FK vers `profiles` |
| `vote_type` | VARCHAR(10) | Type de vote (upvote/downvote) |
| `created_at` | TIMESTAMP | Date de création |

---

### 3. COMMUNAUTÉ

#### 3.1 Forums

##### `forum_categories` - Catégories de Forum

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `title` | VARCHAR(100) | Titre de la catégorie |
| `description` | TEXT | Description |
| `icon` | VARCHAR(50) | Icône |
| `created_at` | TIMESTAMP | Date de création |

**Catégories prévues:**

- Restaurants & Gastronomie
- Hébergement & Hôtellerie
- Activités & Loisirs
- Vie Locale & Pratique

##### `forum_threads` - Fils de Discussion

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `category_id` | UUID | FK vers `forum_categories` |
| `title` | VARCHAR(200) | Titre du sujet |
| `author_id` | UUID | FK vers `profiles` |
| `is_pinned` | BOOLEAN | Épinglé |
| `is_locked` | BOOLEAN | Verrouillé |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

##### `forum_posts` - Messages de Forum

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `thread_id` | UUID | FK vers `forum_threads` |
| `author_id` | UUID | FK vers `profiles` |
| `content` | TEXT | Contenu du message |
| `parent_post_id` | UUID | FK vers `forum_posts` (pour réponses imbriquées) |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

#### 3.2 Groupes

##### `groups` - Groupes d'Intérêt

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `name` | VARCHAR(100) | Nom du groupe |
| `banner_url` | TEXT | URL de la bannière |
| `avatar_url` | TEXT | URL de l'avatar |
| `description` | TEXT | Description |
| `is_private` | BOOLEAN | Groupe privé |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

##### `group_members` - Membres de Groupe

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `group_id` | UUID | FK vers `groups` |
| `profile_id` | UUID | FK vers `profiles` |
| `role` | ENUM | Rôle (owner, admin, member) |
| `joined_at` | TIMESTAMP | Date d'adhésion |

#### 3.3 Messagerie

##### `conversations` - Conversations

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

##### `conversation_participants` - Participants

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `conversation_id` | UUID | FK vers `conversations` |
| `profile_id` | UUID | FK vers `profiles` |
| `joined_at` | TIMESTAMP | Date d'adhésion |

##### `messages` - Messages

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `conversation_id` | UUID | FK vers `conversations` |
| `sender_id` | UUID | FK vers `profiles` |
| `content` | TEXT | Contenu du message |
| `is_read` | BOOLEAN | Message lu |
| `created_at` | TIMESTAMP | Date de création |

---

### 4. FONCTIONNALITÉS PROFESSIONNELLES

#### `organizations` - Organisations/Entreprises

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `name` | VARCHAR(200) | Nom de l'organisation |
| `primary_owner_id` | UUID | FK vers `profiles` |
| `subscription_tier` | ENUM | Niveau d'abonnement (free, pro, premium) |
| `siret` | VARCHAR(20) | Numéro SIRET |
| `stripe_account_id` | VARCHAR(100) | ID compte Stripe |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

#### `place_claims` - Réclamations de Lieux

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `place_id` | UUID | FK vers `places` |
| `organization_id` | UUID | FK vers `organizations` |
| `user_id` | UUID | FK vers `profiles` |
| `status` | ENUM | Statut (pending, approved, rejected) |
| `requested_at` | TIMESTAMP | Date de demande |
| `resolved_at` | TIMESTAMP | Date de résolution |
| `resolved_by` | UUID | FK vers `profiles` (modérateur) |
| `rejection_reason` | TEXT | Raison du rejet |

---

### 5. COMMERCE & RÉSERVATIONS

#### `products` - Produits

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `organization_id` | UUID | FK vers `organizations` |
| `name` | VARCHAR(200) | Nom du produit |
| `description` | TEXT | Description |
| `price` | REAL | Prix |
| `image_url` | TEXT | URL de l'image |
| `stock` | INTEGER | Stock disponible |
| `is_active` | BOOLEAN | Produit actif |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

#### `services` - Services

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `organization_id` | UUID | FK vers `organizations` |
| `name` | VARCHAR(200) | Nom du service |
| `description` | TEXT | Description |
| `base_price` | REAL | Prix de base |
| `duration_minutes` | INTEGER | Durée en minutes |
| `is_active` | BOOLEAN | Service actif |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

#### `orders` - Commandes

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `customer_id` | UUID | FK vers `profiles` |
| `organization_id` | UUID | FK vers `organizations` |
| `product_id` | UUID | FK vers `products` (nullable) |
| `product_name` | VARCHAR(200) | Nom du produit (conservé) |
| `quantity` | INTEGER | Quantité |
| `total_price` | REAL | Prix total |
| `status` | ENUM | Statut (processing, completed, cancelled) |
| `ordered_at` | TIMESTAMP | Date de commande |
| `completed_at` | TIMESTAMP | Date de finalisation |
| `cancelled_at` | TIMESTAMP | Date d'annulation |

#### `bookings` - Réservations

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `customer_id` | UUID | FK vers `profiles` |
| `organization_id` | UUID | FK vers `organizations` |
| `service_id` | UUID | FK vers `services` (nullable) |
| `service_name` | VARCHAR(200) | Nom du service (conservé) |
| `total_price` | REAL | Prix total |
| `status` | ENUM | Statut (pending, confirmed, cancelled) |
| `booked_at` | TIMESTAMP | Date de réservation |
| `booking_date` | VARCHAR(100) | Date prévue du service |
| `confirmed_at` | TIMESTAMP | Date de confirmation |
| `cancelled_at` | TIMESTAMP | Date d'annulation |

---

### 6. SYSTÈME & ADMINISTRATION

#### `reports` - Signalements

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `target_id` | UUID | ID de l'entité signalée |
| `target_type` | VARCHAR(50) | Type d'entité (place, event, article, etc.) |
| `reason` | VARCHAR(100) | Raison du signalement |
| `comment` | TEXT | Commentaire |
| `reporter_id` | UUID | FK vers `profiles` |
| `status` | VARCHAR(20) | Statut (pending, resolved, dismissed) |
| `created_at` | TIMESTAMP | Date de création |
| `resolved_at` | TIMESTAMP | Date de résolution |
| `resolved_by` | UUID | FK vers `profiles` (modérateur) |

#### `static_page_content` - Pages Statiques

CMS pour pages statiques (À propos, FAQ, CGU, Contact).

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `slug` | VARCHAR(100) | Slug unique pour URL |
| `title` | VARCHAR(200) | Titre de la page |
| `content` | TEXT | Contenu HTML |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

---

### 7. ANALYTIQUES & PUBLICITÉ

#### `analytics_events` - Événements Analytiques

Suivi des interactions utilisateurs avec le contenu.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `target_entity_id` | UUID | ID de l'entité |
| `target_entity_type` | VARCHAR(50) | Type d'entité |
| `event_name` | ENUM | Nom de l'événement (view_place, click_phone, click_website) |
| `user_id` | UUID | FK vers `profiles` (nullable) |
| `session_id` | VARCHAR(100) | ID de session |
| `metadata` | JSONB | Données supplémentaires |
| `created_at` | TIMESTAMP | Date de création |

#### `ad_campaigns` - Campagnes Publicitaires

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `organization_id` | UUID | FK vers `organizations` |
| `name` | VARCHAR(200) | Nom de la campagne |
| `description` | TEXT | Description |
| `budget` | REAL | Budget alloué |
| `spent` | REAL | Budget dépensé |
| `target_entity_id` | UUID | ID du lieu/événement promu |
| `target_entity_type` | VARCHAR(50) | Type d'entité |
| `start_date` | TIMESTAMP | Date de début |
| `end_date` | TIMESTAMP | Date de fin |
| `status` | VARCHAR(20) | Statut (draft, active, paused, completed) |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

---

## 🔐 Statuts et Énumérations

### ContentStatus (Statut de Contenu)

- `draft` - Brouillon
- `pending_review` - En attente de modération
- `published` - Publié
- `scheduled` - Programmé
- `archived` - Archivé
- `rejected` - Rejeté
- `hidden` - Masqué

### SubscriptionTier (Niveau d'Abonnement)

- `free` - Gratuit
- `pro` - Professionnel
- `premium` - Premium

### ClaimStatus (Statut de Réclamation)

- `pending` - En attente
- `approved` - Approuvé
- `rejected` - Rejeté

### OrderStatus (Statut de Commande)

- `processing` - En traitement
- `completed` - Terminée
- `cancelled` - Annulée

### BookingStatus (Statut de Réservation)

- `pending` - En attente
- `confirmed` - Confirmée
- `cancelled` - Annulée

---

## 🔗 Relations Principales

### Utilisateurs

- Un profil appartient à un niveau
- Un profil peut avoir plusieurs lieux favoris
- Un profil peut écrire plusieurs avis, articles, commentaires
- Un profil peut être propriétaire d'une ou plusieurs organisations

### Lieux

- Un lieu appartient à une organisation (optionnel)
- Un lieu a plusieurs avis
- Un lieu peut être réclamé par plusieurs organisations
- Un lieu peut être favoris de plusieurs utilisateurs

### Organisations

- Une organisation appartient à un propriétaire principal
- Une organisation peut gérer plusieurs lieux
- Une organisation peut vendre plusieurs produits
- Une organisation peut offrir plusieurs services
- Une organisation peut avoir plusieurs commandes et réservations

### Forums

- Une catégorie contient plusieurs threads
- Un thread contient plusieurs posts
- Un post peut avoir un parent (réponse imbriquée)

### Groupes

- Un groupe a plusieurs membres
- Un membre a un rôle (owner, admin, member)

### Messagerie

- Une conversation a plusieurs participants
- Une conversation contient plusieurs messages

---

## 📝 Index Recommandés

Pour optimiser les performances, les index suivants sont recommandés :

```sql
-- Recherche et filtrage de lieux
CREATE INDEX idx_places_main_category ON places(main_category);
CREATE INDEX idx_places_status ON places(status);
CREATE INDEX idx_places_organization ON places(organization_id);
CREATE INDEX idx_places_coordinates ON places(latitude, longitude);

-- Recherche d'événements
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(date);

-- Performance des avis
CREATE INDEX idx_reviews_place ON reviews(place_id);
CREATE INDEX idx_reviews_profile ON reviews(profile_id);

-- Forums
CREATE INDEX idx_forum_threads_category ON forum_threads(category_id);
CREATE INDEX idx_forum_posts_thread ON forum_posts(thread_id);

-- Analytiques
CREATE INDEX idx_analytics_target ON analytics_events(target_entity_id, target_entity_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

-- Messagerie
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- Commerce
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_organization ON orders(organization_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
```

---

## 🚀 Migration et Intégration

### Étapes de Migration

1. **Installation des dépendances**

   ```bash
   npm install drizzle-orm pg
   npm install -D drizzle-kit
   ```

2. **Configuration de Drizzle**

   Créer `drizzle.config.ts` :

   ```typescript
   import type { Config } from 'drizzle-kit';
   
   export default {
     schema: './schema.ts',
     out: './drizzle',
     driver: 'pg',
     dbCredentials: {
       connectionString: process.env.DATABASE_URL!,
     },
   } satisfies Config;
   ```

3. **Génération des migrations**

   ```bash
   npx drizzle-kit generate:pg
   ```

4. **Application des migrations**

   ```bash
   npx drizzle-kit push:pg
   ```

### Intégration avec Better-Auth

Le champ `user_id` dans la table `profiles` sera lié à l'utilisateur Better-Auth. Configuration à prévoir :

```typescript
// Configuration Better-Auth avec Drizzle
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';

export const auth = betterAuth({
  database: drizzleAdapter(db),
  // ... autres configurations
});
```

---

## 📊 Diagramme ER Simplifié

```md
Users & Auth
├── user_levels
├── profiles
└── user_favorite_places

Content
├── places ← reviews
├── events
├── trails
├── listings
├── articles ← comments
└── live_events ← live_event_votes

Community
├── forum_categories ← forum_threads ← forum_posts
├── groups ← group_members
└── conversations ← conversation_participants & messages

Professional
├── organizations
│   ├── places
│   ├── products
│   ├── services
│   ├── orders
│   ├── bookings
│   └── ad_campaigns
└── place_claims

System
├── reports
├── analytics_events
└── static_page_content
```

---

## ✅ Checklist de Complétude

Ce schéma inclut **TOUTES** les entités TypeScript définies dans `types.ts` :

- [x] ContentCard (utilisé pour l'affichage, pas stocké en DB)
- [x] ContentStatus (enum)
- [x] ClaimStatus (enum)
- [x] SubscriptionTier (enum)
- [x] ListingType (enum)
- [x] TrailDifficulty (enum)
- [x] EventCategory (enum)
- [x] OrderStatus (enum)
- [x] BookingStatus (enum)
- [x] LiveEventType (enum)
- [x] LiveEvent (table)
- [x] UserLevel (table)
- [x] Profile (table)
- [x] Category (utilisé pour UI, pas stocké en DB)
- [x] Review (table)
- [x] Comment (table)
- [x] DayHours (type utilisé dans OpeningHours)
- [x] OpeningHours (type JSONB dans places)
- [x] Coordinates (type utilisé comme lat/lng dans plusieurs tables)
- [x] Place (table)
- [x] Event (table)
- [x] Trail (table)
- [x] Listing (table)
- [x] Article (table)
- [x] ForumPost (table)
- [x] ForumThread (table)
- [x] ForumCategory (table)
- [x] Group (table)
- [x] Message (table)
- [x] Conversation (table)
- [x] Organization (table)
- [x] PlaceClaim (table)
- [x] Product (table)
- [x] Service (table)
- [x] Order (table)
- [x] Booking (table)
- [x] Report (table)
- [x] StaticPageContent (table)
- [x] FilterOption (utilisé pour UI, pas stocké en DB)
- [x] AnalyticsEvent (table)

### Total : 35 interfaces/types TypeScript → 32 tables PostgreSQL + 3 types UI-only

---

## 📚 Documentation Complémentaire

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Better-Auth Documentation](https://better-auth.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 📞 Support

Pour toute question sur le schéma de base de données, contacter l'équipe de développement.

**Dernière mise à jour:** 2024
**Version du schéma:** 1.0.0
