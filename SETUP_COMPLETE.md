# Guide de Configuration Complète - Système d'Authentification et Administration

Ce guide vous accompagne dans la mise en place complète du système d'authentification, de l'administration et des organisations pour Salut Annecy.

## 🎯 Vue d'ensemble du système

L'application est maintenant équipée de :

✅ **Authentification complète** avec Better-Auth
- Inscription avec email, mot de passe et nom d'utilisateur
- Vérification d'email (prêt pour production avec service d'email)
- Connexion sécurisée avec sessions
- Gestion des profils utilisateurs

✅ **Système de rôles et permissions**
- Utilisateur : Accès standard
- Modérateur : Peut modérer le contenu
- Administrateur : Accès complet

✅ **Panel d'administration**
- Modération des lieux et événements
- Gestion des utilisateurs et rôles
- Traitement des signalements

✅ **Gestion des organisations**
- CRUD complet des organisations
- Système de membres avec rôles (owner, admin, editor, viewer)
- Permissions granulaires

## 📋 Installation Pas à Pas

### Étape 1 : Prérequis

```bash
# Vérifier Node.js (v18+)
node --version

# Installer PostgreSQL (si pas déjà installé)
# Sur macOS avec Homebrew:
brew install postgresql@14
brew services start postgresql@14

# Sur Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Étape 2 : Configuration de la Base de Données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE salut_annecy;

# Créer un utilisateur (optionnel mais recommandé)
CREATE USER annecy_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE salut_annecy TO annecy_user;

# Quitter PostgreSQL
\q
```

### Étape 3 : Configuration du Projet

```bash
# Cloner le repository (si pas déjà fait)
git clone https://github.com/Ishaq74/uruk4.git
cd uruk4

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### Étape 4 : Configurer les Variables d'Environnement

Éditer le fichier `.env` :

```env
# Base de données PostgreSQL
DATABASE_URL=postgresql://annecy_user:votre_mot_de_passe@localhost:5432/salut_annecy

# Better-Auth - Générer une clé secrète unique
BETTER_AUTH_SECRET=votre-cle-secrete-unique-32-chars-minimum
BETTER_AUTH_URL=http://localhost:3000

# API Server
PORT=3001
VITE_API_URL=http://localhost:3001

# Optionnel : Google Gemini AI
GEMINI_API_KEY=votre_cle_api_gemini

# Configuration Email (pour vérification d'email en production)
EMAIL_FROM=noreply@localhost
# EMAIL_SERVICE_API_KEY=votre_cle_service_email
```

**Générer une clé secrète sécurisée** :
```bash
# Sur Linux/macOS
openssl rand -base64 32

# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Étape 5 : Initialiser la Base de Données

```bash
# Appliquer le schéma à la base de données
npm run db:push

# Peupler avec des données de test (optionnel)
npm run db:seed
```

### Étape 6 : Démarrer l'Application

Vous devez démarrer **deux serveurs** :

```bash
# Terminal 1 : API Backend
npm run dev:server

# Terminal 2 : Frontend Vite (dans un nouveau terminal)
npm run dev
```

L'application est maintenant accessible :
- **Frontend** : http://localhost:3000
- **API** : http://localhost:3001

## 🔐 Premiers Pas avec l'Authentification

### 1. Créer un Compte Utilisateur

1. Ouvrir http://localhost:3000
2. Cliquer sur "Inscription" dans le header
3. Remplir le formulaire :
   - Nom complet
   - Nom d'utilisateur (unique, 3-50 caractères)
   - Email
   - Mot de passe (minimum 8 caractères)
4. Cliquer sur "S'inscrire"

### 2. Se Connecter

1. Cliquer sur "Connexion"
2. Entrer email et mot de passe
3. Vous êtes maintenant connecté !

### 3. Créer le Premier Administrateur

Pour créer le premier compte administrateur, vous devez modifier manuellement la base de données :

```bash
# Se connecter à la base de données
psql -U annecy_user -d salut_annecy

# Lister les utilisateurs
SELECT id, email, name, role FROM "user";

# Promouvoir un utilisateur en admin
UPDATE "user" SET role = 'admin' WHERE email = 'votre@email.com';

# Vérifier
SELECT id, email, name, role FROM "user" WHERE role = 'admin';

# Quitter
\q
```

### 4. Accéder au Panel d'Administration

1. Se connecter avec le compte admin
2. Cliquer sur votre avatar en haut à droite
3. Cliquer sur "Administration"
4. Vous pouvez maintenant :
   - Modérer le contenu (lieux, événements)
   - Gérer les utilisateurs et leurs rôles
   - Traiter les signalements

## 🏢 Gestion des Organisations

### Créer une Organisation

1. Se connecter
2. Naviguer vers "Espace Professionnel"
3. Cliquer sur "Créer une organisation"
4. Remplir :
   - Nom de l'organisation
   - SIRET (optionnel)
5. Valider

### Gérer les Membres d'une Organisation

Les rôles disponibles sont :

- **Owner** : Créateur de l'organisation, tous les droits
- **Admin** : Peut gérer les membres et le contenu
- **Editor** : Peut modifier le contenu
- **Viewer** : Lecture seule

Pour ajouter un membre (via API) :

```bash
curl -X POST http://localhost:3001/api/organizations/{orgId}/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "user-profile-id",
    "role": "editor"
  }'
```

## 🧪 Test du Système

### Test de l'Authentification

```bash
# Test d'inscription
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Test de connexion
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test des Permissions

1. **Test Utilisateur Standard** :
   - Créer un compte utilisateur
   - Vérifier : peut créer du contenu, pas d'accès admin

2. **Test Modérateur** :
   - Promouvoir un utilisateur en modérateur via DB
   - Vérifier : peut modérer le contenu

3. **Test Administrateur** :
   - Promouvoir un utilisateur en admin via DB
   - Vérifier : accès complet, peut gérer les utilisateurs

### Test des Organisations

1. Créer une organisation
2. Vérifier que vous êtes owner
3. (Via API) Ajouter un membre
4. Vérifier les permissions selon les rôles

## 🔧 Dépannage

### Problème : "Database connection failed"

**Solution** :
```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql  # Linux
brew services list                 # macOS

# Vérifier la connection string dans .env
# Tester la connexion manuellement
psql postgresql://annecy_user:password@localhost:5432/salut_annecy
```

### Problème : "Schema not found" ou erreurs de tables

**Solution** :
```bash
# Réappliquer le schéma
npm run db:push

# Si ça ne fonctionne pas, supprimer et recréer
psql -U postgres -c "DROP DATABASE salut_annecy;"
psql -U postgres -c "CREATE DATABASE salut_annecy;"
npm run db:push
```

### Problème : "Cannot read property 'role' of undefined"

**Solution** : Le profil n'est pas créé automatiquement après l'inscription.

```bash
# Vérifier via l'API
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Créer le profil manuellement si nécessaire
curl -X POST http://localhost:3001/api/auth/create-profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'
```

### Problème : Port déjà utilisé

**Solution** :
```bash
# Trouver le processus utilisant le port 3001
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Tuer le processus ou changer le port dans .env
PORT=3002
```

### Problème : CORS errors

**Solution** : Vérifier que `VITE_API_URL` dans `.env` est correct et que le serveur API est démarré.

## 📝 Checklist de Vérification

Avant de passer en production, vérifier :

- [ ] Base de données PostgreSQL configurée et accessible
- [ ] Variables d'environnement définies dans `.env`
- [ ] Schéma de base de données appliqué (`npm run db:push`)
- [ ] Premier compte admin créé
- [ ] Tests d'inscription et connexion fonctionnels
- [ ] Panel d'administration accessible pour les admins
- [ ] Création d'organisation fonctionnelle
- [ ] Service d'email configuré (pour production)
- [ ] SSL/TLS configuré (pour production)
- [ ] Sauvegardes de base de données configurées (pour production)

## 🚀 Passage en Production

Pour déployer en production, consultez [DEPLOYMENT.md](./DEPLOYMENT.md) qui contient :

- Configuration de serveurs VPS avec Nginx
- Déploiement sur plateformes cloud (Vercel, Railway, etc.)
- Configuration SSL/TLS
- Service d'email pour vérification
- Sauvegardes et monitoring
- Et plus encore...

## 📚 Ressources Supplémentaires

- [README.md](./README.md) - Documentation générale du projet
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Guide de migration des données mockées
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Documentation du schéma de base de données
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement en production

## 💡 Conseils de Développement

### Travailler avec Drizzle Studio

```bash
# Ouvrir Drizzle Studio pour explorer/modifier la DB
npm run db:studio
```

### Réinitialiser les Données de Test

```bash
# Supprimer toutes les données et réinitialiser
npm run db:push -- --force
npm run db:seed
```

### Logs et Debugging

```bash
# Voir les logs du serveur API
# (Les logs s'affichent dans le terminal où vous avez lancé npm run dev:server)

# Pour un debugging plus détaillé, ajouter dans server.ts :
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

## 🎉 Félicitations !

Vous avez maintenant un système complet d'authentification, d'administration et de gestion d'organisations prêt pour la production !

N'hésitez pas à ouvrir une issue sur GitHub si vous rencontrez des problèmes.
