# Guide de Déploiement - Salut Annecy

Ce guide explique comment déployer l'application Salut Annecy en production avec l'authentification et la base de données.

## 📋 Prérequis de Production

- Serveur PostgreSQL (v14+)
- Node.js (v18+)
- Serveur web (Nginx recommandé) ou plateforme cloud (Vercel, Railway, etc.)
- Service d'email (SendGrid, Mailgun, AWS SES, etc.)
- Nom de domaine avec SSL/TLS

## 🗄️ Configuration de la Base de Données

### Option 1 : PostgreSQL Auto-hébergé

1. **Installation de PostgreSQL** (sur Ubuntu/Debian)
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. **Création de la base de données**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE salut_annecy;
   CREATE USER annecy_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe_securise';
   GRANT ALL PRIVILEGES ON DATABASE salut_annecy TO annecy_user;
   \q
   ```

3. **Configuration de l'accès distant** (si nécessaire)
   Éditer `/etc/postgresql/14/main/postgresql.conf` :
   ```
   listen_addresses = '*'
   ```
   
   Éditer `/etc/postgresql/14/main/pg_hba.conf` :
   ```
   host    salut_annecy    annecy_user    0.0.0.0/0    md5
   ```

4. **Redémarrer PostgreSQL**
   ```bash
   sudo systemctl restart postgresql
   ```

### Option 2 : Base de Données Cloud

Services recommandés :
- **Supabase** (gratuit pour démarrer, PostgreSQL géré)
- **Neon** (gratuit, PostgreSQL serverless)
- **Railway** (PostgreSQL géré)
- **AWS RDS** (production)
- **Google Cloud SQL** (production)

## 🔧 Configuration de l'Application

### 1. Variables d'Environnement

Créer un fichier `.env.production` :

```env
# Base de données
DATABASE_URL=postgresql://user:password@host:5432/salut_annecy

# Better-Auth - GÉNÉRER UNE NOUVELLE CLÉ SECRÈTE UNIQUE
BETTER_AUTH_SECRET=votre-cle-secrete-unique-min-32-chars-generer-avec-openssl
BETTER_AUTH_URL=https://votre-domaine.com

# API Server
PORT=3001
VITE_API_URL=https://api.votre-domaine.com

# Service d'Email (choisir un service)
EMAIL_FROM=noreply@votre-domaine.com

# Option A: SendGrid
SENDGRID_API_KEY=votre_cle_sendgrid

# Option B: Mailgun
MAILGUN_API_KEY=votre_cle_mailgun
MAILGUN_DOMAIN=votre-domaine.mailgun.org

# Option C: AWS SES
AWS_ACCESS_KEY_ID=votre_access_key
AWS_SECRET_ACCESS_KEY=votre_secret_key
AWS_REGION=eu-west-1

# Optionnel : Google Gemini AI
GEMINI_API_KEY=votre_cle_gemini

# Optionnel : Stripe (pour paiements)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

**Générer une clé secrète sécurisée** :
```bash
openssl rand -base64 32
```

### 2. Application du Schéma de Base de Données

```bash
# Installer les dépendances
npm install

# Appliquer le schéma à la base de données
npm run db:push

# Peupler avec des données initiales (optionnel)
npm run db:seed
```

### 3. Build de l'Application

```bash
# Build du frontend
npm run build

# Le dossier dist/ contient les fichiers statiques
```

## 🚀 Déploiement

### Option 1 : Déploiement sur VPS avec Nginx

1. **Installation de Node.js et PM2**
   ```bash
   # Installation de Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Installation de PM2 (process manager)
   sudo npm install -g pm2
   ```

2. **Cloner et configurer l'application**
   ```bash
   cd /var/www
   git clone https://github.com/Ishaq74/uruk4.git salut-annecy
   cd salut-annecy
   npm install
   cp .env.example .env
   # Éditer .env avec vos vraies valeurs
   nano .env
   
   # Build
   npm run build
   ```

3. **Démarrer le serveur API avec PM2**
   ```bash
   pm2 start npm --name "salut-annecy-api" -- run dev:server
   pm2 save
   pm2 startup
   ```

4. **Configuration de Nginx**
   
   Créer `/etc/nginx/sites-available/salut-annecy` :
   ```nginx
   # Frontend
   server {
       listen 80;
       server_name votre-domaine.com www.votre-domaine.com;
       
       root /var/www/salut-annecy/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Gestion du cache
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   
   # API Backend
   server {
       listen 80;
       server_name api.votre-domaine.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. **Activer le site et redémarrer Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/salut-annecy /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Configurer SSL avec Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com -d api.votre-domaine.com
   ```

### Option 2 : Déploiement sur Vercel (Frontend) + Railway (API)

#### Frontend sur Vercel

1. **Push sur GitHub** (si ce n'est pas déjà fait)
   ```bash
   git add .
   git commit -m "Production build"
   git push origin main
   ```

2. **Déployer sur Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Importer le repository GitHub
   - Configurer les variables d'environnement :
     - `VITE_API_URL=https://votre-api.railway.app`
   - Déployer

#### API Backend sur Railway

1. **Créer un projet sur Railway**
   - Aller sur [railway.app](https://railway.app)
   - Créer un nouveau projet
   - Ajouter PostgreSQL depuis le marketplace
   - Ajouter votre repository GitHub

2. **Configuration**
   - Dans les settings, définir :
     - Root Directory: `/`
     - Build Command: `npm install`
     - Start Command: `npm run dev:server`
   
3. **Variables d'environnement**
   - `DATABASE_URL` (automatiquement configuré par Railway)
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL=https://votre-frontend.vercel.app`
   - `PORT=3001`
   - Autres variables selon vos besoins

4. **Déployer**

### Option 3 : Déploiement tout-en-un sur Railway

Railway peut héberger le frontend et le backend ensemble.

1. **Créer un projet Railway**
2. **Ajouter PostgreSQL**
3. **Configurer le projet pour servir frontend + API**
4. **Déployer**

## 🔒 Configuration de la Sécurité

### 1. Créer le Premier Administrateur

Après le déploiement initial, vous devez créer manuellement le premier compte admin via la base de données :

```sql
-- Se connecter à la base de données
psql postgresql://user:password@host:5432/salut_annecy

-- Trouver l'ID de l'utilisateur que vous voulez promouvoir admin
SELECT id, email FROM "user" WHERE email = 'votre@email.com';

-- Définir le rôle admin
UPDATE "user" SET role = 'admin' WHERE id = 'user-id-ici';
```

Ou via l'API (si vous avez un script de setup) :
```bash
curl -X POST https://api.votre-domaine.com/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "mot-de-passe-securise",
    "name": "Administrateur",
    "setupToken": "token-de-setup-unique"
  }'
```

### 2. Configuration du Service d'Email

Pour que la vérification d'email fonctionne, vous devez implémenter l'envoi d'emails dans `auth.ts`.

Exemple avec SendGrid :
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Dans auth.ts
emailVerification: {
  sendVerificationEmail: async ({ user, url }) => {
    await sgMail.send({
      to: user.email,
      from: process.env.EMAIL_FROM!,
      subject: 'Vérifiez votre email - Salut Annecy',
      html: `
        <h1>Bienvenue sur Salut Annecy !</h1>
        <p>Cliquez sur le lien ci-dessous pour vérifier votre adresse email :</p>
        <a href="${url}">${url}</a>
      `,
    });
  },
}
```

### 3. Sauvegardes de la Base de Données

Configurer des sauvegardes régulières :

```bash
# Script de sauvegarde (backup.sh)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump postgresql://user:password@host:5432/salut_annecy > backup_$DATE.sql
# Optionnel : uploader sur S3, Google Cloud Storage, etc.
```

Ajouter au crontab pour exécution quotidienne :
```bash
crontab -e
# Ajouter :
0 2 * * * /path/to/backup.sh
```

### 4. Monitoring et Logs

- Utiliser PM2 pour les logs : `pm2 logs`
- Configurer un service de monitoring (Sentry, LogRocket, etc.)
- Surveiller les performances de la base de données

## 🎯 Checklist de Déploiement

- [ ] Base de données PostgreSQL configurée
- [ ] Variables d'environnement définies avec des valeurs de production
- [ ] Schéma de base de données appliqué (`npm run db:push`)
- [ ] Build du frontend créé (`npm run build`)
- [ ] Serveur API démarré avec PM2 ou sur la plateforme cloud
- [ ] Nginx configuré avec SSL/TLS
- [ ] Service d'email configuré et testé
- [ ] Premier compte administrateur créé
- [ ] Sauvegardes de base de données configurées
- [ ] Monitoring et alertes configurés
- [ ] Tests de bout en bout effectués
- [ ] DNS configuré correctement

## 🐛 Dépannage

### Problème : L'API ne se connecte pas à la base de données

Vérifier :
- La variable `DATABASE_URL` est correcte
- Le serveur PostgreSQL est accessible
- Les credentials sont valides
- Le pare-feu autorise les connexions

### Problème : Les emails ne sont pas envoyés

Vérifier :
- La clé API du service d'email est valide
- La fonction d'envoi d'email est bien implémentée dans `auth.ts`
- Les logs du serveur pour des erreurs

### Problème : Erreur 401 lors de l'authentification

Vérifier :
- `BETTER_AUTH_SECRET` est défini
- `BETTER_AUTH_URL` correspond à l'URL réelle
- Les cookies sont autorisés par le navigateur

## 📞 Support

Pour toute question ou problème de déploiement, ouvrir une issue sur GitHub.
