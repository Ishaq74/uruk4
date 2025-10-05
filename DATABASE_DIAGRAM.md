# 🗺️ Diagramme du Schéma de Base de Données

## Vue d'ensemble des Relations

Ce document présente une vue visuelle et structurée du schéma de base de données.

## 📊 Diagramme Entité-Relation (ER) - Format Texte

```md
┌─────────────────────────────────────────────────────────────────────┐
│                    AUTHENTIFICATION & UTILISATEURS                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  user_levels    │
├─────────────────┤
│ PK id           │
│    name         │
│    min_points   │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐          ┌──────────────────────┐
│   profiles      │◄────────►│ user_favorite_places │
├─────────────────┤   N:M    ├──────────────────────┤
│ PK id           │          │ PK id                │
│    user_id      │          │ FK profile_id        │
│    username     │          │ FK place_id          │
│    full_name    │          └──────────────────────┘
│    avatar_url   │
│    bio          │
│ FK level_id     │
│    points       │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         GESTION DE CONTENU                           │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  organizations   │
├──────────────────┤
│ PK id            │
│    name          │
│ FK primary_owner │
│    subscription  │
│    siret         │
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐          ┌─────────────────┐
│     places       │◄─────────│    reviews      │
├──────────────────┤    1:N   ├─────────────────┤
│ PK id            │          │ PK id           │
│    name          │          │ FK profile_id   │
│    image_url     │          │ FK place_id     │
│    rating        │          │    rating       │
│    category      │          │    comment      │
│    main_category │          └─────────────────┘
│    price_range   │
│    latitude      │
│    longitude     │
│    address       │
│ FK organization  │
│    status        │
└──────────────────┘

┌─────────────────┐          ┌──────────────────┐          ┌─────────────────┐
│     events      │          │     trails       │          │    listings     │
├─────────────────┤          ├──────────────────┤          ├─────────────────┤
│ PK id           │          │ PK id            │          │ PK id           │
│    title        │          │    name          │          │    title        │
│    date         │          │    distance_km   │          │    type         │
│    location     │          │    duration_min  │          │    price        │
│    category     │          │    ascent_m      │          │ FK user_id      │
│    latitude     │          │    difficulty    │          │    status       │
│    longitude    │          │    gpx_url       │          └─────────────────┘
│    status       │          │    status        │
└─────────────────┘          └──────────────────┘

┌──────────────────┐         ┌─────────────────┐
│    articles      │◄────────│   comments      │
├──────────────────┤   1:N   ├─────────────────┤
│ PK id            │         │ PK id           │
│    title         │         │ FK author_id    │
│    excerpt       │         │    target_id    │
│    content       │         │    target_type  │
│ FK author_id     │         │    content      │
│    status        │         └─────────────────┘
└──────────────────┘

┌──────────────────┐         ┌────────────────────┐
│   live_events    │◄────────│ live_event_votes   │
├──────────────────┤   1:N   ├────────────────────┤
│ PK id            │         │ PK id              │
│    type          │         │ FK live_event_id   │
│    title         │         │ FK profile_id      │
│    location      │         │    vote_type       │
│ FK author_id     │         └────────────────────┘
│    expires_at    │
└──────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                            COMMUNAUTÉ                                │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│ forum_categories │
├──────────────────┤
│ PK id            │
│    title         │
│    description   │
│    icon          │
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│  forum_threads   │
├──────────────────┤
│ PK id            │
│ FK category_id   │
│    title         │
│ FK author_id     │
│    is_pinned     │
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│   forum_posts    │
├──────────────────┤
│ PK id            │
│ FK thread_id     │
│ FK author_id     │
│    content       │
│ FK parent_post   │◄── Self-referencing (réponses imbriquées)
└──────────────────┘

┌─────────────────┐          ┌──────────────────┐
│     groups      │◄─────────│  group_members   │
├─────────────────┤    1:N   ├──────────────────┤
│ PK id           │          │ PK id            │
│    name         │          │ FK group_id      │
│    banner_url   │          │ FK profile_id    │
│    description  │          │    role          │
│    is_private   │          └──────────────────┘
└─────────────────┘

┌──────────────────────┐
│   conversations      │
├──────────────────────┤
│ PK id                │
└──────────────────────┘
         │
         ├─────────────┐
         │             │
         ▼ 1:N         ▼ 1:N
┌──────────────────────┐    ┌─────────────────┐
│ conversation_        │    │    messages     │
│   participants       │    ├─────────────────┤
├──────────────────────┤    │ PK id           │
│ PK id                │    │ FK conversation │
│ FK conversation_id   │    │ FK sender_id    │
│ FK profile_id        │    │    content      │
└──────────────────────┘    │    is_read      │
                            └─────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    FONCTIONNALITÉS PROFESSIONNELLES                  │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  place_claims    │
├──────────────────┤
│ PK id            │
│ FK place_id      │
│ FK org_id        │
│ FK user_id       │
│    status        │
│    resolved_by   │
└──────────────────┘

┌──────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│    products      │         │    services     │         │   ad_campaigns  │
├──────────────────┤         ├─────────────────┤         ├─────────────────┤
│ PK id            │         │ PK id           │         │ PK id           │
│ FK org_id        │         │ FK org_id       │         │ FK org_id       │
│    name          │         │    name         │         │    name         │
│    price         │         │    base_price   │         │    budget       │
│    stock         │         │    duration     │         │    target_id    │
└──────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │
         │ 1:N                       │ 1:N
         ▼                           ▼
┌──────────────────┐         ┌─────────────────┐
│     orders       │         │    bookings     │
├──────────────────┤         ├─────────────────┤
│ PK id            │         │ PK id           │
│ FK customer_id   │         │ FK customer_id  │
│ FK org_id        │         │ FK org_id       │
│ FK product_id    │         │ FK service_id   │
│    quantity      │         │    booking_date │
│    total_price   │         │    total_price  │
│    status        │         │    status       │
└──────────────────┘         └─────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      SYSTÈME & ADMINISTRATION                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│      reports         │    │  analytics_events    │    │ static_page_content │
├──────────────────────┤    ├──────────────────────┤    ├─────────────────────┤
│ PK id                │    │ PK id                │    │ PK id               │
│    target_id         │    │    target_entity_id  │    │    slug (UNIQUE)    │
│    target_type       │    │    target_entity_type│    │    title            │
│    reason            │    │    event_name        │    │    content          │
│ FK reporter_id       │    │ FK user_id           │    └─────────────────────┘
│    status            │    │    session_id        │
│    resolved_by       │    │    metadata          │
└──────────────────────┘    └──────────────────────┘
```

## 🔗 Types de Relations

### 1. One-to-Many (1:N)

```md
user_levels ──┬──> profiles (Un niveau a plusieurs profils)
              │
places ───────┬──> reviews (Un lieu a plusieurs avis)
              │
organizations ┬──> places (Une org gère plusieurs lieux)
              ├──> products
              ├──> services
              └──> orders
```

### 2. Many-to-Many (N:M)

```md
profiles <──> places (via user_favorite_places)
groups <──> profiles (via group_members)
conversations <──> profiles (via conversation_participants)
```

### 3. Self-Referencing

```md
forum_posts.parent_post_id ──> forum_posts.id
(Pour les réponses imbriquées)
```

### 4. Polymorphic Relations

```md
comments.target_entity_id ──> (articles, places, events, etc.)
analytics_events.target_entity_id ──> (places, events, etc.)
reports.target_id ──> (tous types de contenu)
```

## 📈 Cardinalités Détaillées

### Utilisateurs & Contenu

| Relation | Cardinalité | Description |
|----------|-------------|-------------|
| Profile → Review | 1:N | Un utilisateur peut écrire plusieurs avis |
| Place → Review | 1:N | Un lieu peut avoir plusieurs avis |
| Profile → Article | 1:N | Un auteur peut écrire plusieurs articles |
| Article → Comment | 1:N | Un article peut avoir plusieurs commentaires |
| Profile → Listing | 1:N | Un utilisateur peut créer plusieurs annonces |

### Organisations & Commerce

| Relation | Cardinalité | Description |
|----------|-------------|-------------|
| Organization → Place | 1:N | Une org peut gérer plusieurs lieux |
| Organization → Product | 1:N | Une org peut vendre plusieurs produits |
| Organization → Service | 1:N | Une org peut offrir plusieurs services |
| Product → Order | 1:N | Un produit peut être commandé plusieurs fois |
| Service → Booking | 1:N | Un service peut être réservé plusieurs fois |

### Communauté

| Relation | Cardinalité | Description |
|----------|-------------|-------------|
| ForumCategory → ForumThread | 1:N | Une catégorie contient plusieurs threads |
| ForumThread → ForumPost | 1:N | Un thread contient plusieurs posts |
| Group → GroupMember | 1:N | Un groupe a plusieurs membres |
| Conversation → Message | 1:N | Une conversation a plusieurs messages |

## 🗂️ Hiérarchie des Données

### Structure de Publication de Contenu

```md
content_status (ENUM)
├── draft (Brouillon)
├── pending_review (En attente de modération)
├── published (Publié)
├── scheduled (Programmé)
├── archived (Archivé)
├── rejected (Rejeté)
└── hidden (Masqué)

Appliqué à:
- places
- events
- trails
- listings
- articles
```

### Hiérarchie des Niveaux Utilisateurs

```md
user_levels
├── Niveau 1: Nouveau venu (0+ points)
├── Niveau 2: Contributeur (50+ points)
└── Niveau 3: Expert Local (250+ points)

Points gagnés via:
- Création de contenu
- Avis et commentaires
- Participation aux forums
- Signalements utiles
```

### Hiérarchie des Abonnements

```md
subscription_tier (ENUM)
├── free (Gratuit)
│   ├── 1 lieu
│   ├── Fonctionnalités de base
│   └── Pas de publicité
│
├── pro (Professionnel)
│   ├── 5 lieux
│   ├── Analytics basiques
│   └── Support prioritaire
│
└── premium (Premium)
    ├── Lieux illimités
    ├── Analytics avancées
    ├── Campagnes publicitaires
    └── Support dédié
```

## 🔍 Index et Optimisations

### Index Principaux

```md
Performance Critique:
┌─────────────────────────────────────────┐
│ Table: places                           │
├─────────────────────────────────────────┤
│ ✓ idx_places_main_category              │
│ ✓ idx_places_status                     │
│ ✓ idx_places_coordinates                │
│ ✓ idx_places_organization               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Table: analytics_events                 │
├─────────────────────────────────────────┤
│ ✓ idx_analytics_target (composite)      │
│ ✓ idx_analytics_created                 │
│ ✓ idx_analytics_event_name              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Table: messages                         │
├─────────────────────────────────────────┤
│ ✓ idx_messages_conversation             │
│ ✓ idx_messages_sender                   │
│ ✓ idx_messages_created                  │
└─────────────────────────────────────────┘
```

### Requêtes Optimisées

```sql
-- Recherche de lieux par catégorie (utilise idx_places_main_category)
SELECT * FROM places 
WHERE main_category = 'restauration' 
AND status = 'published';

-- Analytiques pour un lieu (utilise idx_analytics_target)
SELECT event_name, COUNT(*) 
FROM analytics_events 
WHERE target_entity_id = '...' 
AND target_entity_type = 'place'
GROUP BY event_name;

-- Messages d'une conversation (utilise idx_messages_conversation)
SELECT * FROM messages 
WHERE conversation_id = '...' 
ORDER BY created_at DESC 
LIMIT 50;
```

## 🎯 Flux de Données Clés

### 1. Publication de Contenu

```md
Utilisateur
    ↓
[Création] → draft
    ↓
[Soumission] → pending_review
    ↓
[Modération]
    ├─→ [Approuvé] → published
    └─→ [Rejeté] → rejected (+ rejection_reason)
```

### 2. Réclamation de Lieu

```md
Professionnel
    ↓
[Réclamation] → place_claims (status: pending)
    ↓
[Modération Admin]
    ├─→ [Approuvé] → status: approved
    │       ↓
    │   [Association] → place.organization_id
    │
    └─→ [Rejeté] → status: rejected (+ rejection_reason)
```

### 3. Commande de Produit

```md
Client
    ↓
[Commander] → orders (status: processing)
    ↓
[Paiement Stripe]
    ├─→ [Succès] → status: completed
    └─→ [Échec] → status: cancelled
```

### 4. Événement Live

```md
Utilisateur
    ↓
[Création] → live_events (+ expires_at)
    ↓
[Votes] → live_event_votes (upvote/downvote)
    ↓
[Expiration] → Auto-supprimé après expires_at
```

## 📊 Volumétrie Estimée

### Croissance Prévisionnelle (Année 1)

| Table | Volume Initial | Croissance/mois | Volume Année 1 |
|-------|---------------|-----------------|----------------|
| profiles | 100 | 500 | ~6,000 |
| places | 500 | 50 | ~1,100 |
| reviews | 1,000 | 1,000 | ~13,000 |
| events | 100 | 100 | ~1,300 |
| articles | 50 | 20 | ~290 |
| messages | 500 | 5,000 | ~60,500 |
| analytics_events | 5,000 | 100,000 | ~1.2M |

### Considérations de Performance

- **Partitionnement**: Envisager pour `analytics_events` (par mois)
- **Archivage**: `live_events` expirés après 24h
- **Nettoyage**: Conversations inactives > 1 an
- **Cache**: Redis pour les lieux populaires

## 🔒 Contraintes d'Intégrité

### Contraintes Clés

```sql
-- Unicité
✓ profiles.username (UNIQUE)
✓ profiles.user_id (UNIQUE)
✓ static_page_content.slug (UNIQUE)

-- Validation
✓ reviews.rating CHECK (rating >= 1 AND rating <= 5)
✓ live_event_votes (UNIQUE sur live_event_id, profile_id)
✓ group_members (UNIQUE sur group_id, profile_id)

-- Intégrité Référentielle
✓ ON DELETE CASCADE pour données dépendantes
✓ ON DELETE SET NULL pour références optionnelles
```

## 📝 Checklist de Complétude

### Tables Créées ✅

- [x] 32 tables définies
- [x] 15 enums configurés
- [x] Relations établies
- [x] Index optimisés
- [x] Contraintes appliquées

### Correspondance avec types.ts ✅

- [x] Toutes les interfaces mappées
- [x] Tous les enums convertis
- [x] Tous les types respectés
- [x] Aucune entité omise

### Documentation ✅

- [x] Schéma Drizzle (schema.ts)
- [x] Schéma SQL (schema.sql)
- [x] Documentation détaillée (DATABASE_SCHEMA.md)
- [x] Guide de migration (MIGRATION_GUIDE.md)
- [x] Diagrammes (ce fichier)

---

**Version**: 1.0.0  
**Dernière Mise à Jour**: 2024  
**Statut**: ✅ Complet et Validé
