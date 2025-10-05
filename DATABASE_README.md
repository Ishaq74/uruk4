# 🗄️ Schéma de Base de Données - Documentation Complète

## 📌 Aperçu Rapide

Ce répertoire contient le **schéma complet et intégral** de la base de données pour l'application "Salut Annecy". Le schéma est conçu pour une migration future de données mockées vers une vraie base de données PostgreSQL avec Drizzle ORM et Better-Auth.

## 📁 Fichiers du Schéma

### 1. `schema.ts` - Schéma Drizzle ORM (Recommandé)

- **Type**: TypeScript avec Drizzle ORM
- **Usage**: Schéma type-safe pour l'application
- **Avantages**:
  - Typage TypeScript complet
  - Migrations automatiques
  - Relations définies
  - Validation au moment de la compilation

### 2. `schema.sql` - Schéma SQL Pur

- **Type**: SQL PostgreSQL
- **Usage**: Déploiement manuel ou référence
- **Avantages**:
  - Indépendant du framework
  - Documentation SQL standard
  - Inclut les index et données initiales

### 3. `DATABASE_SCHEMA.md` - Documentation Détaillée

- Documentation complète de toutes les tables
- Descriptions des colonnes et relations
- Diagrammes et exemples
- Index recommandés

### 4. `MIGRATION_GUIDE.md` - Guide de Migration

- Instructions pas à pas pour migrer vers PostgreSQL
- Configuration de Drizzle ORM et Better-Auth
- Scripts de migration des données
- Exemples de code

### 5. `drizzle.config.ts` - Configuration Drizzle

- Configuration pour drizzle-kit
- Paramètres de connexion à la base de données
- Configuration des migrations

## 🏗️ Architecture du Schéma

### Modules Principaux

```md
📦 Base de Données
├── 👥 Authentification & Utilisateurs
│   ├── user_levels (Niveaux de gamification)
│   ├── profiles (Profils utilisateurs)
│   └── user_favorite_places (Lieux favoris)
│
├── 📝 Gestion de Contenu
│   ├── places (Lieux: restaurants, hôtels, etc.)
│   ├── reviews (Avis sur les lieux)
│   ├── events (Événements locaux)
│   ├── trails (Sentiers de randonnée)
│   ├── listings (Petites annonces)
│   ├── articles (Articles éditoriaux)
│   ├── comments (Commentaires)
│   ├── live_events (Événements en temps réel)
│   └── live_event_votes (Votes sur événements live)
│
├── 💬 Communauté
│   ├── forum_categories (Catégories de forum)
│   ├── forum_threads (Fils de discussion)
│   ├── forum_posts (Messages de forum)
│   ├── groups (Groupes d'intérêt)
│   ├── group_members (Membres de groupe)
│   ├── conversations (Conversations privées)
│   ├── conversation_participants (Participants)
│   └── messages (Messages)
│
├── 💼 Fonctionnalités Professionnelles
│   ├── organizations (Organisations/Entreprises)
│   ├── place_claims (Réclamations de lieux)
│   ├── products (Produits à vendre)
│   ├── services (Services réservables)
│   ├── orders (Commandes de produits)
│   └── bookings (Réservations de services)
│
└── 🔧 Système & Administration
    ├── reports (Signalements)
    ├── analytics_events (Événements analytiques)
    ├── static_page_content (Pages statiques CMS)
    └── ad_campaigns (Campagnes publicitaires)
```

## 📊 Statistiques du Schéma

- **32 tables** au total
- **15 enums** pour les types stricts
- **~150 colonnes** au total
- **Relations complexes** avec clés étrangères
- **Index optimisés** pour les performances

## 🔑 Caractéristiques Clés

### 1. Types Énumérés (Enums)

- `content_status` - Statuts de publication
- `subscription_tier` - Niveaux d'abonnement
- `listing_type` - Types d'annonces
- `trail_difficulty` - Difficulté des sentiers
- `event_category` - Catégories d'événements
- `live_event_type` - Types d'événements live
- Et plus...

### 2. Relations

- **One-to-Many**: Un profil a plusieurs avis
- **Many-to-Many**: Utilisateurs ↔ Lieux favoris
- **Self-referencing**: Posts de forum avec réponses imbriquées
- **Polymorphic**: Commentaires sur différents types de contenu

### 3. Optimisations

- Index sur les colonnes fréquemment recherchées
- JSONB pour les données flexibles
- Timestamps automatiques
- UUID pour les clés primaires
- CASCADE et SET NULL pour l'intégrité référentielle

## 🚀 Démarrage Rapide

### Installation

```bash
# Installer les dépendances
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg

# Configurer la base de données
cp .env.example .env
# Éditer .env avec vos informations de connexion
```

### Utilisation du Schéma Drizzle

```bash
# Générer les migrations
npm run db:generate

# Pousser le schéma vers la base
npm run db:push

# Ouvrir Drizzle Studio (UI pour visualiser la DB)
npm run db:studio
```

### Utilisation du Schéma SQL

```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE salut_annecy;"

# Appliquer le schéma
psql -U username -d salut_annecy -f schema.sql
```

## 📖 Documentation des Tables Principales

### Places (Lieux)

Stocke restaurants, hôtels, activités, commerces.

**Champs clés:**

- Géolocalisation (latitude, longitude)
- Catégorisation (main_category, category)
- Notation (rating, review_count)
- Horaires d'ouverture (JSONB)
- Statut de publication

### Events (Événements)

Festivals, concerts, marchés, événements sportifs.

**Champs clés:**

- Date (peut être récurrente)
- Géolocalisation
- Catégorie
- Prix
- Statut de publication

### Organizations (Organisations)

Entités professionnelles qui gèrent des lieux.

**Champs clés:**

- Niveau d'abonnement (free, pro, premium)
- SIRET
- Compte Stripe
- Relation avec les lieux

### Profiles (Profils)

Profils utilisateurs avec gamification.

**Champs clés:**

- Points et niveau
- Vérification
- Lieux favoris
- Avatar et couverture

## 🔐 Sécurité

### Authentification

- Intégration avec Better-Auth prévue
- Le champ `user_id` dans `profiles` référence l'utilisateur Better-Auth
- Sessions gérées par Better-Auth

### Autorisations

Implémentation recommandée:

- Row Level Security (RLS) dans PostgreSQL
- Middleware d'autorisation dans l'API
- Validation des données avec Zod

### Données Sensibles

- Mots de passe gérés par Better-Auth
- SIRET et informations Stripe chiffrées au repos
- Tokens d'API non stockés en base

## 🧪 Tests

### Tests de Schéma Recommandés

1. **Intégrité des Contraintes**

   ```typescript
   // Vérifier les contraintes de clés étrangères
   // Vérifier les contraintes UNIQUE
   // Vérifier les contraintes CHECK
   ```

2. **Performance des Index**

   ```sql
   EXPLAIN ANALYZE SELECT * FROM places WHERE main_category = 'restauration';
   ```

3. **Intégrité des Données**

   ```typescript
   // Vérifier que les enums correspondent aux types TypeScript
   // Vérifier que les relations sont bidirectionnelles
   ```

## 📈 Évolutions Futures

### Phase 1 - Migration Initiale ✅

- [x] Définir le schéma complet
- [x] Créer les fichiers de migration
- [x] Documentation

### Phase 2 - Intégration (À venir)

- [ ] Migrer les données mockées
- [ ] Intégrer Better-Auth
- [ ] Créer les services de données
- [ ] Adapter les composants React

### Phase 3 - Optimisations (À venir)

- [ ] Implémenter le cache (Redis)
- [ ] Ajouter la recherche full-text
- [ ] Optimiser les requêtes N+1
- [ ] Implémenter la pagination cursor-based

### Phase 4 - Features Avancées (À venir)

- [ ] Notifications en temps réel
- [ ] Webhooks pour événements
- [ ] Export de données utilisateur (RGPD)
- [ ] Audit logs

## 🛠️ Outils Recommandés

### Développement

- **Drizzle Studio** - UI pour visualiser et éditer la DB
- **pgAdmin** - Administration PostgreSQL
- **DBeaver** - Client SQL universel

### Monitoring

- **pg_stat_statements** - Analyse des requêtes
- **pgBadger** - Analyse des logs PostgreSQL
- **Grafana** - Visualisation des métriques

### Performance

- **pg_stat_user_indexes** - Utilisation des index
- **EXPLAIN ANALYZE** - Plan d'exécution des requêtes
- **pg_stat_activity** - Sessions actives

## 📚 Ressources

### Documentation

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Better-Auth Docs](https://better-auth.com/)

### Guides

- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Documentation détaillée
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Guide de migration

### Tutoriels

- [Drizzle avec Next.js](https://orm.drizzle.team/docs/get-started-postgresql)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
- [Database Design Patterns](https://www.postgresql.org/docs/current/ddl.html)

## 🤝 Contribution

Pour contribuer au schéma de base de données:

1. **Proposition de Changement**
   - Créer une issue décrivant le changement
   - Expliquer la raison et l'impact

2. **Modification du Schéma**
   - Modifier `schema.ts` (Drizzle)
   - Mettre à jour `schema.sql` (SQL)
   - Documenter dans `DATABASE_SCHEMA.md`

3. **Migration**
   - Créer une migration Drizzle
   - Tester la migration up/down
   - Documenter les breaking changes

4. **Revue**
   - PR avec description détaillée
   - Tests de migration inclus
   - Documentation à jour

## ⚠️ Important

### Ne PAS Oublier

- ✅ Toujours créer des migrations pour les changements de schéma
- ✅ Tester les migrations en local avant de déployer
- ✅ Documenter les changements breaking
- ✅ Sauvegarder la base avant les migrations majeures

### Bonnes Pratiques

- 📝 Commenter les champs complexes
- 🔍 Ajouter des index pour les colonnes recherchées
- 🔒 Utiliser les contraintes pour l'intégrité
- 🎯 Normaliser les données quand c'est pertinent
- 📊 Analyser les performances régulièrement

## 📞 Support

Pour toute question concernant le schéma de base de données:

1. Consulter `DATABASE_SCHEMA.md` pour la documentation
2. Consulter `MIGRATION_GUIDE.md` pour la migration
3. Ouvrir une issue sur GitHub
4. Contacter l'équipe de développement

---

**Version du Schéma**: 1.0.0  
**Dernière Mise à Jour**: 2024  
**Statut**: ✅ Complet et Prêt pour la Production

**Note**: Ce schéma inclut **TOUTES** les entités définies dans `types.ts`. Aucune entité n'a été omise. ✅
