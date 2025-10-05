# Salut Annecy - Guide Local Complet

Une plateforme web complète pour découvrir et explorer Annecy, France. Ce guide local permet aux utilisateurs de découvrir les meilleurs endroits, événements, randonnées, et de participer à une communauté locale dynamique.

## 🎯 Fonctionnalités Principales

### 📍 Découverte de Lieux

- **Restaurants** : Découvrez les meilleures adresses culinaires (gastronomique, savoyard, pizzeria, etc.)
- **Hébergements** : Hôtels, chambres d'hôtes avec système de réservation
- **Activités** : Sports aériens, activités nautiques et terrestres
- **Commerces** : Produits du terroir, boutiques artisanales
- Système de notation et d'avis utilisateurs
- Carte interactive avec Leaflet
- Filtres avancés par catégorie, prix, attributs

### 📅 Événements

- Agenda complet des événements locaux
- Festivals, concerts, marchés, événements sportifs et culturels
- Calendrier avec dates et lieux
- Système de propositions d'événements par les utilisateurs

### 🥾 Randonnées

- Catalogue de sentiers de randonnée
- Informations détaillées : distance, dénivelé, durée, difficulté
- Fichiers GPX téléchargeables
- Points de départ géolocalisés

### 📰 Magazine & Articles

- Articles éditoriaux sur Annecy
- Guides et recommandations
- Système de commentaires
- Contenu généré par la communauté

### 🏪 Petites Annonces

- **Emploi** : Offres d'emploi locales
- **Immobilier** : Ventes et locations
- **Bonnes Affaires** : Achats/ventes entre particuliers
- **Services** : Prestations de services locaux

### 💬 Communauté

- **Forums** : Discussions par catégories (Restaurants, Hébergement, Activités, etc.)
- **Groupes** : Création et participation à des groupes d'intérêt
- **Messagerie** : Conversations privées entre utilisateurs
- **Profils utilisateurs** : Système de niveaux et points
- Membres vérifiés et experts locaux

### 🔴 Live Events (Temps Réel)

- Promotions éphémères
- Alertes trafic et météo
- Informations d'affluence
- Système de vote (upvote/downvote)

### 💼 Espace Professionnel

- Gestion de lieux pour les professionnels
- Système de réclamation de lieux
- E-commerce : Vente de produits
- Réservations de services
- Analytiques détaillées
- Campagnes publicitaires
- Gestion des commandes et réservations

### ✨ Fonctionnalités Avancées

- **Recherche intelligente** avec AI (Google Gemini)
- Suggestions de lieux similaires avec IA
- Système de favoris
- Propositions de contenu par les utilisateurs (modération)
- Tableau de bord utilisateur
- Signalement de contenu
- Cookie banner et RGPD
- Export de données personnelles

## 🛠️ Stack Technique

### Frontend

- **React 18** avec TypeScript
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Styling (via CDN)
- **Leaflet & React-Leaflet** - Cartes interactives
- **React Markdown** - Rendu des articles
- **Google Gemini AI** - Fonctionnalités d'IA

### Architecture

- Single Page Application (SPA)
- Routing personnalisé côté client
- State management avec React Hooks
- Composants modulaires et réutilisables

### Base de Données & Authentification

### Production-Ready avec Better-Auth, PostgreSQL et Drizzle ORM

Le projet dispose maintenant d'un système d'authentification complet et d'une architecture de base de données prête pour la production :

- ✅ **Better-Auth** - Authentification complète (email/password, vérification email)
- ✅ **PostgreSQL** - Base de données relationnelle
- ✅ **Drizzle ORM** - ORM type-safe pour TypeScript
- ✅ **Express** - API server pour les endpoints d'authentification
- ✅ **Système de rôles** - Admin, Modérateur, Utilisateur
- ✅ **Panel d'administration** - Modération de contenu
- ✅ **Gestion des permissions** - Protection des routes et actions

> **📊 Documentation de la Base de Données** :

Un schéma complet et intégral de la base de données est disponible. Consultez :

> - [DATABASE_README.md](./DATABASE_README.md) - Vue d'ensemble et documentation
> - [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Documentation détaillée des tables
> - [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Guide de migration vers PostgreSQL
> - [DATABASE_DIAGRAM.md](./DATABASE_DIAGRAM.md) - Diagrammes et visualisations
> - [schema.ts](./schema.ts) - Schéma Drizzle ORM (TypeScript)
> - [schema.sql](./schema.sql) - Schéma SQL PostgreSQL

## 🚀 Installation et Utilisation

### Prérequis

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**

### Installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/Ishaq74/uruk.git
   cd uruk
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine (voir `.env.example` pour référence) :

   ```env
   # Base de données PostgreSQL
   DATABASE_URL=postgresql://user:password@localhost:5432/salut_annecy

   # Better-Auth (générer une clé secrète unique)
   BETTER_AUTH_SECRET=your-super-secret-key-here-min-32-chars
   BETTER_AUTH_URL=http://localhost:3000

   # API Server
   PORT=3001
   VITE_API_URL=http://localhost:3001

   # Optionnel : Google Gemini AI
   GEMINI_API_KEY=votre_clé_api_gemini

   # Optionnel : Email service (pour vérification d'email)
   EMAIL_FROM=noreply@salut-annecy.com
   EMAIL_SERVICE_API_KEY=your_email_service_api_key
   ```

1. **Configurer la base de données PostgreSQL**

   ```bash
   # Créer la base de données
   psql -U postgres -c "CREATE DATABASE salut_annecy;"

   # Appliquer le schéma
   npm run db:push

   # (Optionnel) Peupler avec des données de test
   npm run db:seed
   ```

2. **Lancer le serveur de développement**

   Vous devez lancer deux serveurs :

   ```bash
   # Terminal 1 : API Server (Backend)
   npm run dev:server

   # Terminal 2 : Vite Dev Server (Frontend)
   npm run dev
   ```

   - Frontend accessible sur `http://localhost:3000`
   - API Backend sur `http://localhost:3001`

### Build de Production

1. **Build du Frontend**

   ```bash
   npm run build
   ```

   Le build sera généré dans le dossier `dist/`

2. **Servir les fichiers statiques**

   ```bash
   npm run preview
   ```

Pour la production, utilisez un serveur web comme Nginx ou déployez sur Vercel, Netlify, etc.

### Scripts Disponibles

- `npm run dev` - Démarre le serveur de développement Vite (Frontend)
- `npm run dev:server` - Démarre le serveur API Express (Backend)
- `npm run build` - Build de production du frontend
- `npm run preview` - Preview du build de production
- `npm run db:push` - Applique le schéma à la base de données
- `npm run db:studio` - Ouvre Drizzle Studio pour gérer la DB
- `npm run db:seed` - Peuple la base de données avec des données de test

## 🔐 Authentification et Rôles

### Inscription et Connexion

Les utilisateurs peuvent créer un compte avec :

- Nom complet
- Nom d'utilisateur (unique)
- Email (avec vérification)
- Mot de passe (minimum 8 caractères)

### Système de Rôles

- **Utilisateur** : Accès standard, peut créer du contenu
- **Modérateur** : Peut modérer le contenu (approuver/rejeter)
- **Administrateur** : Accès complet, gestion des utilisateurs et permissions

### Panel d'Administration

Accessible via le menu utilisateur pour les admins et modérateurs :

- Modération des lieux en attente
- Modération des événements en attente
- Gestion des utilisateurs et rôles (admin uniquement)
- Traitement des signalements

## 📁 Structure du Projet

```md
uruk/
├── components/           # Composants React
│   ├── propose/         # Formulaires de proposition de contenu
│   ├── Header.tsx       # En-tête de navigation
│   ├── Footer.tsx       # Pied de page
│   ├── HomePage.tsx     # Page d'accueil
│   ├── PlaceListPage.tsx
│   ├── PlaceDetailPage.tsx
│   ├── EventListPage.tsx
│   ├── TrailListPage.tsx
│   ├── ForumListPage.tsx
│   ├── LivePage.tsx
│   └── ...              # Autres composants de pages
├── App.tsx              # Composant principal et routing
├── types.ts             # Définitions TypeScript
├── constants.tsx        # Données mockées et constantes
├── index.tsx            # Point d'entrée
├── index.html           # Template HTML
├── vite.config.ts       # Configuration Vite
└── package.json         # Dépendances
```

## 🎨 Fonctionnalités de l'Interface

- Design responsive (mobile, tablette, desktop)
- Thème moderne avec Tailwind CSS
- Navigation intuitive avec header sticky
- Cartes interactives Leaflet
- Formulaires de recherche avancés
- Système de pagination
- Modales et overlays
- Indicateurs de chargement
- Messages de confirmation

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

- Projet initial - [Ishaq74](https://github.com/Ishaq74)

## 🙏 Remerciements

- Google Gemini AI pour les fonctionnalités d'intelligence artificielle
- La communauté Leaflet pour les cartes interactives
- Tous les contributeurs qui participent à ce projet
