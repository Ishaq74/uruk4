# Guide de Migration et d'Intégration de la Base de Données

## 📋 Vue d'ensemble

Ce guide explique comment migrer l'application "Salut Annecy" des données mockées en mémoire vers une base de données PostgreSQL avec Drizzle ORM et Better-Auth.

## 🎯 Objectifs

- Remplacer les données mockées (`constants.tsx`) par une vraie base de données
- Intégrer Better-Auth pour l'authentification
- Utiliser Drizzle ORM pour les opérations de base de données
- Maintenir la compatibilité avec les types TypeScript existants

## 📦 Prérequis

### Dépendances à installer

```bash
# Drizzle ORM et PostgreSQL
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg

# Better-Auth
npm install better-auth

# Variables d'environnement
npm install dotenv
```

### Configuration requise

- PostgreSQL 14+ installé et en cours d'exécution
- Node.js 18+
- Compte Stripe (pour les paiements - optionnel)

## 🗄️ Étape 1: Configuration de la Base de Données

### 1.1 Créer la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE salut_annecy;

# Se connecter à la base
\c salut_annecy

# Quitter
\q
```

### 1.2 Configuration des variables d'environnement

Créer un fichier `.env` à la racine du projet:

```env
# Base de données
DATABASE_URL=postgresql://username:password@localhost:5432/salut_annecy

# Better-Auth
AUTH_SECRET=your-super-secret-key-here-min-32-chars
AUTH_URL=http://localhost:3000

# API Keys (optionnel)
GEMINI_API_KEY=your_gemini_api_key

# Stripe (optionnel pour les paiements)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Important**: Ajouter `.env` au `.gitignore` pour ne pas versionner les secrets.

## 🔧 Étape 2: Configuration de Drizzle ORM

### 2.1 Créer le fichier de configuration

Créer `drizzle.config.ts` à la racine:

```typescript
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 2.2 Créer le client de base de données

Créer `db.ts` à la racine:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

### 2.3 Générer et appliquer les migrations

```bash
# Générer les migrations basées sur le schéma
npx drizzle-kit generate:pg

# Pousser le schéma vers la base de données
npx drizzle-kit push:pg

# Ou appliquer les migrations manuellement
npx drizzle-kit migrate
```

Alternative: Utiliser directement le fichier SQL:

```bash
psql -U username -d salut_annecy -f schema.sql
```

## 🔐 Étape 3: Configuration de Better-Auth

### 3.1 Créer la configuration Better-Auth

Créer `auth.ts` à la racine:

```typescript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';

export const auth = betterAuth({
  database: drizzleAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    // Ajouter d'autres providers si nécessaire
  },
});

export type Session = typeof auth.$Infer.Session;
```

### 3.2 Intégrer Better-Auth dans l'application

Modifier `App.tsx` pour utiliser Better-Auth:

```typescript
import { useSession } from 'better-auth/react';

function App() {
  const { data: session, status } = useSession();
  
  // Remplacer currentUser par session?.user
  const currentUser = session?.user;
  
  // ... reste du code
}
```

## 📊 Étape 4: Migration des Données

### 4.1 Créer un script de migration

Créer `migrate-data.ts`:

```typescript
import { db } from './db';
import { 
  userLevels, profiles, places, events, trails, 
  articles, listings, forumCategories, staticPageContent 
} from './schema';
import { PROFILES, PLACES, EVENTS, TRAILS, ARTICLES, ALL_LISTINGS, FORUM_CATEGORIES, STATIC_PAGES } from './constants';

async function migrateData() {
  console.log('🚀 Début de la migration des données...');

  try {
    // 1. Migrer les niveaux utilisateurs (déjà fait via schema.sql)
    console.log('✅ Niveaux utilisateurs créés');

    // 2. Migrer les profils utilisateurs
    for (const profile of PROFILES) {
      await db.insert(profiles).values({
        id: profile.id,
        userId: `user_${profile.id}`, // Temporaire, sera remplacé par Better-Auth
        username: profile.username,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        coverImageUrl: profile.coverImageUrl,
        bio: profile.bio,
        levelId: profile.levelId,
        joinDate: new Date(profile.joinDate),
        isVerified: profile.isVerified,
        points: profile.points,
      });
    }
    console.log(`✅ ${PROFILES.length} profils migrés`);

    // 3. Migrer les lieux
    for (const place of PLACES) {
      await db.insert(places).values({
        id: place.id,
        name: place.name,
        imageUrl: place.imageUrl,
        rating: place.rating,
        reviewCount: place.reviewCount,
        category: place.category,
        mainCategory: place.mainCategory,
        priceRange: place.priceRange,
        attributes: place.attributes,
        description: place.description,
        openingHours: place.openingHours,
        latitude: place.coordinates.lat,
        longitude: place.coordinates.lng,
        address: place.address,
        phone: place.phone,
        website: place.website,
        organizationId: place.organization_id,
        status: place.status,
        rejectionReason: place.rejection_reason,
      });
    }
    console.log(`✅ ${PLACES.length} lieux migrés`);

    // 4. Migrer les événements
    for (const event of EVENTS) {
      await db.insert(events).values({
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        imageUrl: event.imageUrl,
        category: event.category,
        price: event.price,
        description: event.description,
        latitude: event.coordinates.lat,
        longitude: event.coordinates.lng,
        status: event.status,
        rejectionReason: event.rejection_reason,
      });
    }
    console.log(`✅ ${EVENTS.length} événements migrés`);

    // 5. Migrer les sentiers
    for (const trail of TRAILS) {
      await db.insert(trails).values({
        id: trail.id,
        name: trail.name,
        imageUrl: trail.imageUrl,
        distanceKm: trail.distanceKm,
        durationMin: trail.durationMin,
        ascentM: trail.ascentM,
        difficulty: trail.difficulty,
        excerpt: trail.excerpt,
        description: trail.description,
        startPointLat: trail.startPoint.lat,
        startPointLng: trail.startPoint.lng,
        gpxUrl: trail.gpxUrl,
        status: trail.status,
        rejectionReason: trail.rejection_reason,
      });
    }
    console.log(`✅ ${TRAILS.length} sentiers migrés`);

    console.log('🎉 Migration terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

// Exécuter la migration
migrateData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
```

### 4.2 Exécuter le script de migration

```bash
npx tsx migrate-data.ts
```

## 🔄 Étape 5: Adapter le Code

### 5.1 Créer des services pour l'accès aux données

Créer `services/places.service.ts`:

```typescript
import { db } from '../db';
import { places, reviews } from '../schema';
import { eq, and, or, desc } from 'drizzle-orm';

export class PlacesService {
  async getAll(filters?: { mainCategory?: string; status?: string }) {
    let query = db.select().from(places);
    
    if (filters?.mainCategory) {
      query = query.where(eq(places.mainCategory, filters.mainCategory));
    }
    
    if (filters?.status) {
      query = query.where(eq(places.status, filters.status));
    }
    
    return await query;
  }

  async getById(id: string) {
    const [place] = await db
      .select()
      .from(places)
      .where(eq(places.id, id));
    
    return place;
  }

  async create(data: typeof places.$inferInsert) {
    const [newPlace] = await db
      .insert(places)
      .values(data)
      .returning();
    
    return newPlace;
  }

  async update(id: string, data: Partial<typeof places.$inferInsert>) {
    const [updated] = await db
      .update(places)
      .set(data)
      .where(eq(places.id, id))
      .returning();
    
    return updated;
  }
}

export const placesService = new PlacesService();
```

### 5.2 Créer des hooks React pour les données

Créer `hooks/usePlaces.ts`:

```typescript
import { useState, useEffect } from 'react';
import { placesService } from '../services/places.service';
import type { Place } from '../types';

export function usePlaces(filters?: { mainCategory?: string }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        setLoading(true);
        const data = await placesService.getAll(filters);
        setPlaces(data as Place[]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, [filters?.mainCategory]);

  return { places, loading, error };
}
```

### 5.3 Adapter les composants

Modifier `App.tsx`:

```typescript
// Avant (données mockées)
import { PLACES } from './constants';

// Après (données de la base)
import { usePlaces } from './hooks/usePlaces';

function App() {
  // const places = PLACES; // Ancienne méthode
  const { places, loading } = usePlaces(); // Nouvelle méthode
  
  if (loading) return <div>Chargement...</div>;
  
  // ... reste du code
}
```

## 📱 Étape 6: API Routes (optionnel)

Pour une meilleure architecture, créer des routes API:

### 6.1 Configuration du serveur (exemple avec Express)

```bash
npm install express cors
npm install -D @types/express @types/cors
```

Créer `server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import { placesService } from './services/places.service';

const app = express();

app.use(cors());
app.use(express.json());

// Routes Places
app.get('/api/places', async (req, res) => {
  try {
    const places = await placesService.getAll();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/places/:id', async (req, res) => {
  try {
    const place = await placesService.getById(req.params.id);
    if (!place) {
      return res.status(404).json({ error: 'Lieu non trouvé' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ... autres routes

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
```

## 🧪 Étape 7: Tests et Validation

### 7.1 Tester la connexion à la base

Créer `test-db.ts`:

```typescript
import { db } from './db';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    const result = await db.execute(sql`SELECT NOW()`);
    console.log('✅ Connexion à la base de données réussie:', result);
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  }
}

testConnection();
```

```bash
npx tsx test-db.ts
```

### 7.2 Vérifier les données migrées

```bash
psql -U username -d salut_annecy

# Compter les enregistrements
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM places;
SELECT COUNT(*) FROM events;
```

## 📝 Étape 8: Scripts Package.json

Ajouter des scripts utiles dans `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "db:migrate": "npx tsx migrate-data.ts",
    "db:reset": "psql -U username -d salut_annecy -f schema.sql && npm run db:migrate",
    "server": "tsx watch server.ts"
  }
}
```

## 🔒 Étape 9: Sécurité

### 9.1 Validation des données

Installer Zod pour la validation:

```bash
npm install zod
```

Créer des schémas de validation:

```typescript
import { z } from 'zod';

export const placeSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10),
  mainCategory: z.enum(['restauration', 'hebergement', 'activites', 'commerces']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  // ... autres champs
});
```

### 9.2 Protection des routes

```typescript
import { auth } from './auth';

app.post('/api/places', async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  
  if (!session) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  
  // ... créer le lieu
});
```

## 🚀 Étape 10: Déploiement

### Options de déploiement:

1. **Vercel + Neon (PostgreSQL)**
   - Frontend: Vercel
   - Base de données: Neon (PostgreSQL serverless)

2. **Railway**
   - Application et base de données sur Railway

3. **DigitalOcean**
   - App Platform + Managed PostgreSQL

4. **Render**
   - Web Service + PostgreSQL

### Configuration pour Vercel:

```json
// vercel.json
{
  "env": {
    "DATABASE_URL": "@database-url",
    "AUTH_SECRET": "@auth-secret"
  }
}
```

## ✅ Checklist de Migration

- [ ] PostgreSQL installé et configuré
- [ ] Variables d'environnement configurées
- [ ] Dépendances installées (Drizzle, Better-Auth)
- [ ] Schema Drizzle créé (schema.ts)
- [ ] Migrations générées et appliquées
- [ ] Better-Auth configuré
- [ ] Script de migration des données créé
- [ ] Données migrées avec succès
- [ ] Services de données créés
- [ ] Hooks React créés
- [ ] Composants adaptés
- [ ] Tests de connexion validés
- [ ] Validation des données implémentée
- [ ] Routes API sécurisées
- [ ] Application testée en local
- [ ] Déploiement configuré

## 🆘 Dépannage

### Erreur de connexion PostgreSQL

```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

### Erreur de migration Drizzle

```bash
# Supprimer le dossier drizzle et regénérer
rm -rf drizzle
npx drizzle-kit generate:pg
```

### Réinitialiser la base de données

```bash
# Supprimer et recréer la base
psql -U postgres
DROP DATABASE salut_annecy;
CREATE DATABASE salut_annecy;
\q

# Réappliquer le schéma
psql -U username -d salut_annecy -f schema.sql

# Remigrer les données
npm run db:migrate
```

## 📚 Ressources

- [Documentation Drizzle ORM](https://orm.drizzle.team/)
- [Documentation Better-Auth](https://better-auth.com/)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Guide TypeScript avec PostgreSQL](https://node-postgres.com/)

## 🎯 Prochaines Étapes

Après la migration complète:

1. Implémenter la recherche full-text avec PostgreSQL
2. Ajouter le cache avec Redis
3. Implémenter les notifications en temps réel
4. Ajouter les webhooks pour les événements
5. Créer un dashboard admin
6. Implémenter les tests unitaires et d'intégration
7. Configurer le monitoring et les logs

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2024
