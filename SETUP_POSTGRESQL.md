# Salut Annecy - Configuration PostgreSQL

## ✅ Changements Effectués

L'application a été migrée d'un système de données mockées en mémoire vers une base de données **PostgreSQL** en production. Tous les mock data ont été supprimés de `constants.tsx`.

### Ce qui a été fait :
- ✅ **API REST complète** : Tous les endpoints pour récupérer les données (places, events, trails, articles, etc.)
- ✅ **Hooks React** : Custom hooks pour charger les données depuis l'API
- ✅ **Suppression des mocks** : Le fichier `constants.tsx` ne contient plus que des configurations (icônes, catégories, enums)
- ✅ **Components mis à jour** : Tous les composants reçoivent maintenant les données via props depuis App.tsx
- ✅ **Configuration .env** : Fichier de configuration pour la base de données

## 🚀 Installation et Configuration

### 1. Prérequis

- **Node.js** 18+ et npm
- **PostgreSQL** 14+ installé et en cours d'exécution

### 2. Installation de PostgreSQL

#### Sur macOS (avec Homebrew) :
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Sur Ubuntu/Debian :
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Sur Windows :
Téléchargez et installez PostgreSQL depuis : https://www.postgresql.org/download/windows/

### 3. Créer la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE salut_annecy;

# Quitter psql
\q
```

### 4. Configuration de l'application

1. **Installer les dépendances** :
```bash
npm install
```

2. **Configurer les variables d'environnement** :

Le fichier `.env` existe déjà. Modifiez-le si nécessaire :

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/salut_annecy

# Better-Auth - CHANGEZ CE SECRET EN PRODUCTION !
BETTER_AUTH_SECRET=your-super-secret-key-here-change-this-in-production-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# API Server
PORT=3001
VITE_API_URL=http://localhost:3001
```

**⚠️ IMPORTANT** : Modifiez `DATABASE_URL` avec vos identifiants PostgreSQL si différents.

3. **Créer les tables** :
```bash
npm run db:push
```

4. **Remplir la base de données avec des données de test** :
```bash
npm run db:seed
```

### 5. Lancer l'application

#### Terminal 1 - Serveur API (Backend) :
```bash
npm run dev:server
```
Le serveur API démarre sur http://localhost:3001

#### Terminal 2 - Application React (Frontend) :
```bash
npm run dev
```
L'application web démarre sur http://localhost:3000

### 6. Vérifier que tout fonctionne

1. Ouvrez http://localhost:3000 dans votre navigateur
2. Vous devriez voir les données chargées depuis PostgreSQL
3. Vous pouvez créer un compte utilisateur via l'interface

## 🗄️ Structure de la Base de Données

La base de données contient les tables suivantes :

### Tables principales :
- **user** : Utilisateurs (géré par Better-Auth)
- **profiles** : Profils utilisateurs
- **organizations** : Organisations/Entreprises
- **places** : Lieux (restaurants, hôtels, activités, commerces)
- **events** : Événements
- **trails** : Sentiers de randonnée
- **articles** : Articles du magazine
- **listings** : Petites annonces
- **products** : Produits à vendre
- **services** : Services réservables
- **orders** : Commandes
- **bookings** : Réservations

### Tables communautaires :
- **groups** : Groupes d'utilisateurs
- **forumCategories** : Catégories du forum
- **forumThreads** : Fils de discussion
- **forumPosts** : Messages du forum
- **conversations** : Conversations privées
- **messages** : Messages privés
- **placeClaims** : Revendications de lieux
- **reports** : Signalements
- **liveEvents** : Événements en temps réel

Voir `schema.ts` pour la définition complète du schéma.

## 🔄 Flux des Données (Production)

**Important** : En production, toutes les données viennent de PostgreSQL, pas de fichiers de code !

```
┌──────────────────┐
│   PostgreSQL     │  ◄── Base de données (données réelles)
│   Database       │
└──────────────────┘
        ↓
┌──────────────────┐
│   server.ts      │  ◄── API REST (22 endpoints)
│   Express API    │      GET /api/places, /api/events, etc.
└──────────────────┘
        ↓
┌──────────────────┐
│  useApiData.ts   │  ◄── React Hooks
│  Custom Hooks    │      usePlaces(), useEvents(), etc.
└──────────────────┘
        ↓
┌──────────────────┐
│    App.tsx       │  ◄── Charge les données via hooks
│  React App       │      const { data } = usePlaces()
└──────────────────┘
        ↓
┌──────────────────┐
│   Components     │  ◄── Reçoivent les données via props
│   UI Layer       │
└──────────────────┘
```

**Fichiers de données** :
- `constants.tsx` - **SEULEMENT** configuration (icônes, catégories, enums) - PAS de données
- `seed-data.ts` - Données de test initiales pour peupler la base (utilisé UNIQUEMENT par `npm run db:seed`)
- Base de données PostgreSQL - **Source unique de vérité** pour toutes les données en production

## 📊 Outils de Développement

### Drizzle Studio (Interface graphique pour la BDD)

Lancez Drizzle Studio pour visualiser et modifier vos données :

```bash
npm run db:studio
```

Ouvrez http://localhost:4983 pour accéder à l'interface.

### Commandes disponibles

```bash
npm run dev              # Lancer le frontend (Vite)
npm run dev:server       # Lancer le backend (Express API)
npm run build            # Build production du frontend
npm run db:push          # Créer/Mettre à jour les tables
npm run db:studio        # Ouvrir Drizzle Studio
npm run db:seed          # Remplir avec des données de test
```

## 🔐 Authentification

L'application utilise **Better-Auth** pour l'authentification :

- Inscription par email/password
- Gestion des sessions
- Rôles utilisateurs (user, moderator, admin)
- Profile lié automatiquement à chaque utilisateur

### Créer un compte admin

Voir le fichier `ADMIN_ACCOUNT_SETUP.md` pour créer un compte administrateur.

## 🌐 API Endpoints

Tous les endpoints sont disponibles sur `http://localhost:3001/api/` :

### Publics :
- `GET /api/places` - Liste des lieux
- `GET /api/events` - Liste des événements
- `GET /api/trails` - Liste des sentiers
- `GET /api/articles` - Liste des articles
- `GET /api/listings` - Liste des annonces
- `GET /api/groups` - Liste des groupes
- `GET /api/profiles` - Liste des profils
- `GET /api/organizations` - Liste des organisations
- `GET /api/live-events` - Événements en temps réel
- `GET /api/products` - Liste des produits
- `GET /api/services` - Liste des services
- `GET /api/forum/categories` - Catégories du forum
- `GET /api/forum/threads` - Fils de discussion

### Authentifiés :
- `GET /api/conversations` - Conversations de l'utilisateur
- `GET /api/orders` - Commandes de l'utilisateur
- `GET /api/bookings` - Réservations de l'utilisateur
- `GET /api/organizations/my` - Organisations de l'utilisateur
- `POST /api/organizations` - Créer une organisation

### Admin/Modérateur :
- `GET /api/reports` - Liste des signalements
- `GET /api/admin/users` - Liste des utilisateurs
- `POST /api/admin/places/:id/approve` - Approuver un lieu
- `POST /api/admin/places/:id/reject` - Rejeter un lieu

## 🐛 Dépannage

### Erreur de connexion à PostgreSQL

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution** : Vérifiez que PostgreSQL est bien démarré :
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Windows
# Vérifiez dans Services (services.msc)
```

### La base de données n'existe pas

```
Error: database "salut_annecy" does not exist
```

**Solution** : Créez la base de données :
```bash
psql -U postgres -c "CREATE DATABASE salut_annecy;"
```

### Les tables ne sont pas créées

**Solution** : Exécutez les migrations :
```bash
npm run db:push
```

### Pas de données dans la base

**Solution** : Exécutez le script de seed :
```bash
npm run db:seed
```

## 📝 Notes Importantes

1. **Le fichier `.env` n'est PAS commité** dans Git (il est dans `.gitignore`)
2. **Changez `BETTER_AUTH_SECRET`** en production avec une valeur aléatoire de 32+ caractères
3. **`constants.tsx`** contient UNIQUEMENT des configurations (icônes, catégories, enums) - **AUCUNE DONNÉE**
4. **`seed-data.ts`** contient les données de test initiales pour peupler la base - utilisé UNIQUEMENT par `npm run db:seed`
5. **Toutes les données réelles** sont dans PostgreSQL et chargées via l'API
6. **L'application ne fonctionnera pas** sans PostgreSQL configuré et en cours d'exécution

### Flux complet des données en production :
1. L'utilisateur charge l'application React
2. `App.tsx` utilise les hooks (`usePlaces()`, `useEvents()`, etc.)
3. Les hooks appellent l'API REST (`GET /api/places`, etc.)
4. Le serveur Express interroge PostgreSQL avec Drizzle ORM
5. Les données sont retournées à l'application React
6. Les composants affichent les données reçues via props

**Aucune donnée n'est codée en dur dans l'application !** Tout vient de la base de données.

## 🚀 Déploiement en Production

Pour déployer en production, consultez :
- `DEPLOYMENT.md` - Guide de déploiement
- `PRODUCTION_READY.md` - Checklist de production

### Services recommandés :
- **Frontend** : Vercel, Netlify
- **Backend** : Railway, Render, DigitalOcean App Platform
- **Database** : Neon (PostgreSQL serverless), Railway, DigitalOcean Managed Databases

---

**L'application est maintenant prête pour la production** ! 🎉

Plus aucune donnée mockée n'est utilisée - tout vient de PostgreSQL.
