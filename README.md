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

> - **Better-Auth** pour l'authentification
> - **PostgreSQL** comme base de données
> - **Drizzle ORM** pour la gestion de la base de données

Actuellement, le projet utilise des données mockées en mémoire pour le développement et le prototypage.

> **📊 Schéma de Base de Données Disponible** :

Un schéma complet et intégral de la base de données est maintenant disponible. Consultez :

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

Créer un fichier `.env` à la racine :

   ```bash
   GEMINI_API_KEY=votre_clé_api_gemini
   ```

   > La clé API Gemini est optionnelle. Elle permet les fonctionnalités d'IA (suggestions de lieux similaires).

1. **Lancer le serveur de développement**

   ```bash
   npm run dev
   ```

   L'application sera accessible sur `http://localhost:3000`

### Build de Production

```bash
npm run build
```

Le build sera généré dans le dossier `dist/`

### Preview du Build

```bash
npm run preview
```

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
