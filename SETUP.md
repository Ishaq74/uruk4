# Configuration de la Base de Données et Better-Auth

Ce projet utilise **PostgreSQL**, **Drizzle ORM**, et **Better-Auth** pour gérer les données et l'authentification.

## 🚀 Configuration Rapide

### 1. Prérequis

- **PostgreSQL 14+** installé et en cours d'exécution
- **Node.js 18+**
- npm ou yarn

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de la base de données

#### Créer la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE salut_annecy;

# Quitter
\q
```

#### Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_URL=postgresql://username:password@localhost:5432/salut_annecy

# Better-Auth (optionnel pour l'instant, sera utilisé en production)
BETTER_AUTH_SECRET=your-super-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# API Keys (optionnel)
GEMINI_API_KEY=your_gemini_api_key

# Stripe (optionnel pour les paiements)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Important** : Remplacez `username` et `password` par vos identifiants PostgreSQL.

### 4. Créer le schéma de base de données

```bash
# Pousser le schéma vers PostgreSQL
npm run db:push
```

Cette commande utilise Drizzle Kit pour créer toutes les tables définies dans `schema.ts`.

### 5. Remplir la base de données avec des données de test

```bash
# Exécuter le script de seed
npm run db:seed
```

Cette commande :
- Crée les niveaux d'utilisateurs (gamification)
- Crée des utilisateurs Better-Auth et leurs profils
- Remplit toutes les tables avec les données mockées de `constants.tsx`

## 📊 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le serveur de développement Vite |
| `npm run build` | Compile l'application pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run db:push` | Pousse le schéma Drizzle vers PostgreSQL |
| `npm run db:studio` | Lance Drizzle Studio (interface web pour la BDD) |
| `npm run db:seed` | Remplit la base de données avec des données de test |

## 🔐 Better-Auth

Better-Auth est configuré pour gérer l'authentification avec :

- **Authentification par email/mot de passe**
- **Support des providers sociaux** (Google, etc. - à configurer)
- **Sessions sécurisées** (7 jours d'expiration)
- **Tables dédiées** : `user`, `session`, `account`, `verification`

### Structure des tables Better-Auth

- **user** : Informations de base des utilisateurs (email, nom, avatar)
- **session** : Sessions actives avec tokens et expiration
- **account** : Comptes liés aux providers sociaux
- **verification** : Tokens de vérification d'email

### Relation avec les profils

Chaque utilisateur Better-Auth (`user`) est lié à un profil étendu (`profiles`) qui contient :
- Informations détaillées (bio, images, etc.)
- Données de gamification (points, niveau)
- Paramètres de l'utilisateur

## 🗄️ Schéma de base de données

Le schéma complet est défini dans `schema.ts` et comprend :

1. **Authentification & Utilisateurs**
   - Better-Auth tables (user, session, account, verification)
   - User levels (gamification)
   - Profiles (profils étendus)
   - User favorite places

2. **Gestion de Contenu**
   - Places (restaurants, hôtels, activités, commerces)
   - Events (événements)
   - Trails (randonnées)
   - Articles (magazine)
   - Listings (petites annonces)
   - Live Events (alertes en temps réel)

3. **Communauté**
   - Forums (categories, threads, posts)
   - Groups (groupes d'utilisateurs)
   - Conversations (messages privés)
   - Reviews (avis sur les lieux)
   - Comments (commentaires)

4. **Fonctionnalités Professionnelles**
   - Organizations (organisations)
   - Products (produits)
   - Services (prestations)
   - Orders (commandes)
   - Bookings (réservations)
   - Place Claims (revendications de lieux)

5. **Système & Administration**
   - Reports (signalements)
   - Static Page Content (contenu statique)
   - Analytics Events (événements d'analytics)
   - Ad Campaigns (campagnes publicitaires)

## 🔧 Développement

### Visualiser les données

Utilisez Drizzle Studio pour explorer et modifier les données :

```bash
npm run db:studio
```

Ouvrez votre navigateur sur `https://local.drizzle.studio/`

### Réinitialiser la base de données

Si vous devez recommencer à zéro :

```bash
# Option 1 : Supprimer et recréer la base
psql -U postgres -c "DROP DATABASE salut_annecy;"
psql -U postgres -c "CREATE DATABASE salut_annecy;"
npm run db:push
npm run db:seed

# Option 2 : Utiliser Drizzle Studio pour supprimer les données
npm run db:studio
# Puis supprimer les données via l'interface
```

## 📝 Notes importantes

1. **Le fichier `.env` ne doit JAMAIS être commité** sur Git (il est dans `.gitignore`)
2. **Les données de seed sont basées sur `constants.tsx`** - vous pouvez les modifier selon vos besoins
3. **Better-Auth crée automatiquement ses tables** lors du premier démarrage
4. **Les UUIDs sont générés automatiquement** par PostgreSQL pour la plupart des tables

## 🚧 Prochaines étapes

Pour intégrer complètement Better-Auth dans l'application :

1. Créer des composants de connexion/inscription
2. Utiliser `useSession()` de `better-auth/react` dans les composants
3. Protéger les routes sensibles
4. Implémenter la logique de création de profil après inscription
5. Ajouter les providers sociaux (Google, GitHub, etc.)

Voir le fichier `MIGRATION_GUIDE.md` pour plus de détails sur la migration complète.
