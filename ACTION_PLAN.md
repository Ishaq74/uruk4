# 🎯 Plan d'Action - Salut Annecy

> **Basé sur** : [CRITIQUE_ET_PRECONISATION.md](./CRITIQUE_ET_PRECONISATION.md)  
> **Créé le** : 2024  
> **Statut** : 📋 En cours

Ce document transforme les critiques et recommandations en un plan d'action concret et mesurable.

---

## 📊 Vue d'Ensemble

### État Actuel vs Objectif

| Métrique | Actuel | Objectif | Progrès |
|----------|--------|----------|---------|
| Couverture tests | 0% | 60% | ▱▱▱▱▱▱▱▱▱▱ 0% |
| Endpoints fonctionnels | 13% | 100% | ▰▱▱▱▱▱▱▱▱▱ 13% |
| Documentation à jour | 30% | 90% | ▰▰▰▱▱▱▱▱▱▱ 30% |
| Issues de sécurité | 5 critiques | 0 | ▱▱▱▱▱▱▱▱▱▱ 0% |
| État fonctionnel | 40% | 95% | ▰▰▰▰▱▱▱▱▱▱ 40% |

---

## 🔴 PHASE 1 : Corrections Critiques (Semaines 1-3)

### Sprint 1 : Sécurité et Documentation (Semaine 1)

#### 1.1 Sécurisation Immédiate ⚠️ URGENT

**Tâches** :

- [ ] **Validation des secrets** (2h)
  - [ ] Créer `scripts/validate-env.ts`
  - [ ] Ajouter validation au démarrage
  - [ ] Interdire les secrets par défaut en production
  - [ ] Mettre à jour documentation .env.example
  
  ```typescript
  // scripts/validate-env.ts
  if (process.env.NODE_ENV === 'production') {
    if (process.env.BETTER_AUTH_SECRET === 'your-super-secret-key-here-change-this-in-production') {
      throw new Error('❌ BETTER_AUTH_SECRET must be changed in production!');
    }
    if (!process.env.DATABASE_URL) {
      throw new Error('❌ DATABASE_URL is required in production');
    }
  }
  ```

- [ ] **Rate Limiting** (3h)
  - [ ] `npm install express-rate-limit`
  - [ ] Configurer limiter global (100 req/15min)
  - [ ] Configurer limiter auth (5 req/15min)
  - [ ] Ajouter tests de rate limiting
  
  ```typescript
  // server.ts
  import rateLimit from 'express-rate-limit';
  
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
  });
  
  app.use('/api/', generalLimiter);
  app.use('/api/auth/', authLimiter);
  ```

- [ ] **Désactiver logs sensibles** (1h)
  - [ ] Créer utilitaire `utils/logger.ts`
  - [ ] Remplacer tous les `console.log` sensibles
  - [ ] Ajouter niveau de log configurables (dev/prod)
  
  ```typescript
  // utils/logger.ts
  export const logger = {
    debug: (msg: string, data?: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(msg, data);
      }
    },
    error: (msg: string, error?: any) => {
      console.error(msg, error);
    }
  };
  ```

- [ ] **CORS sécurisé** (1h)
  - [ ] Configurer CORS basé sur env
  - [ ] Lister domaines autorisés
  - [ ] Tester en dev et prod

**Livrable** : Application sécurisée avec validation des secrets et rate limiting actifs.

---

#### 1.2 Documentation Réelle (4h)

**Tâches** :

- [ ] **Créer ARCHITECTURE.md** (2h)
  - [ ] Décrire l'architecture RÉELLE
  - [ ] Diagramme des composants
  - [ ] Expliquer la dualité actuelle (mock vs DB)
  - [ ] Documenter les dépendances
  
- [ ] **Créer API.md** (1h)
  - [ ] Lister tous les endpoints
  - [ ] Indiquer le statut (✅ Fonctionnel / ⚠️ Mock / ❌ Non implémenté)
  - [ ] Exemples de requêtes/réponses
  - [ ] Codes d'erreur
  
- [ ] **Corriger PRODUCTION_READY.md** (30min)
  - [ ] Retirer les mentions trompeuses
  - [ ] Clarifier ce qui est vraiment production-ready
  - [ ] Ajouter section "Known Limitations"
  
- [ ] **Créer GETTING_STARTED.md** (30min)
  - [ ] Guide de setup simplifié
  - [ ] Prérequis clairement listés
  - [ ] Étapes numérotées
  - [ ] Troubleshooting commun

**Livrable** : Documentation précise et complète de l'état actuel du projet.

---

#### 1.3 Décision Architecturale (2h)

**Tâches** :

- [ ] **Analyser les options** (1h)
  - [ ] Créer tableau comparatif Option A vs Option B
  - [ ] Estimer effort pour chaque option
  - [ ] Identifier risques et bénéfices
  
- [ ] **Créer ARCHITECTURE_DECISION.md** (1h)
  - [ ] Documenter le choix
  - [ ] Justifier la décision
  - [ ] Plan de migration
  - [ ] Timeline estimée

**Options** :

| Critère | Option A: Full PostgreSQL | Option B: Full Mock |
|---------|---------------------------|---------------------|
| **Effort** | 6-8 semaines | 1-2 semaines |
| **Production-ready** | ✅ Oui | ❌ Non (démo seulement) |
| **Scalabilité** | ✅ Excellente | ❌ Limitée |
| **Coût serveur** | $$$ | $ |
| **Complexité** | Haute | Faible |
| **Recommandation** | ✅ Pour app réelle | ⚠️ Pour prototype |

**Livrable** : Décision architecturale documentée et validée.

---

### Sprint 2 : Correction de l'Architecture (Semaines 2-3)

#### 2.1 Si Option A Choisie : Migration PostgreSQL

**Tâches** :

- [ ] **Créer DataProvider avec Context API** (4h)
  - [ ] Créer `contexts/DataContext.tsx`
  - [ ] Implémenter provider avec cache
  - [ ] Ajouter états loading/error
  - [ ] Tests unitaires du provider
  
  ```typescript
  // contexts/DataContext.tsx
  interface DataContextType {
    places: Place[];
    events: Event[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
  }
  
  export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Implémentation avec cache et API calls
  };
  ```

- [ ] **Migrer Places vers API** (6h)
  - [ ] Vérifier endpoint `/api/places`
  - [ ] Implémenter pagination
  - [ ] Ajouter filtres
  - [ ] Tests d'intégration
  - [ ] Migrer composants Places

- [ ] **Migrer Events vers API** (4h)
  - [ ] Vérifier endpoint `/api/events`
  - [ ] Implémenter filtres par date
  - [ ] Tests d'intégration
  - [ ] Migrer composants Events

- [ ] **Migrer Articles vers API** (3h)
- [ ] **Migrer Trails vers API** (3h)
- [ ] **Migrer Listings vers API** (4h)

**Livrable** : Application connectée à PostgreSQL avec cache côté client.

---

#### 2.2 Si Option B Choisie : Consolidation Mock

**Tâches** :

- [ ] **Supprimer infrastructure DB** (2h)
  - [ ] Supprimer `schema.ts`, `schema.sql`
  - [ ] Supprimer `seed.ts`, `db.ts`
  - [ ] Supprimer Drizzle config
  - [ ] Nettoyer `package.json`

- [ ] **Créer MockDataService** (4h)
  - [ ] Centraliser toutes les données mock
  - [ ] Interface API-like
  - [ ] Simuler latence réseau
  - [ ] Tests unitaires

- [ ] **Documenter limitations** (1h)
  - [ ] Clarifier que c'est une démo
  - [ ] Lister fonctionnalités non disponibles
  - [ ] Guide pour migration future

**Livrable** : Application mock cohérente et bien documentée.

---

## 🟠 PHASE 2 : Stabilisation (Semaines 4-7)

### Sprint 3 : Tests Essentiels (Semaine 4)

#### 3.1 Configuration des Tests

**Tâches** :

- [ ] **Installer framework de test** (1h)
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
  npm install -D @vitest/ui
  ```

- [ ] **Configurer Vitest** (1h)
  - [ ] Créer `vitest.config.ts`
  - [ ] Setup DOM testing
  - [ ] Ajouter scripts de test à package.json
  
  ```json
  {
    "scripts": {
      "test": "vitest",
      "test:ui": "vitest --ui",
      "test:coverage": "vitest --coverage"
    }
  }
  ```

- [ ] **Créer structure de tests** (1h)
  ```
  tests/
  ├── unit/
  │   ├── components/
  │   ├── utils/
  │   └── services/
  ├── integration/
  │   ├── api/
  │   └── flows/
  └── setup.ts
  ```

**Livrable** : Infrastructure de test configurée et fonctionnelle.

---

#### 3.2 Tests Critiques

**Tâches** :

- [ ] **Tests d'authentification** (4h)
  - [ ] `tests/integration/auth.test.ts`
  - [ ] Test login/logout
  - [ ] Test register
  - [ ] Test session persistence
  - [ ] Test role-based access

- [ ] **Tests des endpoints API** (6h)
  - [ ] `tests/integration/api/places.test.ts`
  - [ ] `tests/integration/api/events.test.ts`
  - [ ] Tests CRUD complets
  - [ ] Tests de validation
  - [ ] Tests d'erreurs

- [ ] **Tests des composants critiques** (4h)
  - [ ] HomePage
  - [ ] PlaceDetailPage
  - [ ] SearchPage
  - [ ] AdminDashboard

**Objectif** : **60% de couverture** sur les fonctionnalités critiques.

**Livrable** : Suite de tests avec couverture ≥ 60%.

---

### Sprint 4 : Gestion d'État Moderne (Semaine 5)

#### 4.1 Migration vers Zustand

**Tâches** :

- [ ] **Installer Zustand** (15min)
  ```bash
  npm install zustand
  ```

- [ ] **Créer stores de base** (6h)
  - [ ] `stores/authStore.ts`
  - [ ] `stores/placesStore.ts`
  - [ ] `stores/eventsStore.ts`
  - [ ] `stores/uiStore.ts` (modals, loading, etc.)

  ```typescript
  // stores/placesStore.ts
  import { create } from 'zustand';
  import { Place } from '../types';
  
  interface PlacesState {
    places: Place[];
    isLoading: boolean;
    error: Error | null;
    fetchPlaces: () => Promise<void>;
    addPlace: (place: Place) => void;
  }
  
  export const usePlacesStore = create<PlacesState>((set) => ({
    places: [],
    isLoading: false,
    error: null,
    fetchPlaces: async () => {
      set({ isLoading: true });
      try {
        const response = await fetch('/api/places');
        const places = await response.json();
        set({ places, isLoading: false });
      } catch (error) {
        set({ error: error as Error, isLoading: false });
      }
    },
    addPlace: (place) => set((state) => ({ 
      places: [...state.places, place] 
    }))
  }));
  ```

- [ ] **Migrer App.tsx** (4h)
  - [ ] Supprimer les useState
  - [ ] Utiliser les stores Zustand
  - [ ] Simplifier le code
  - [ ] Tests de non-régression

**Livrable** : Application avec state management moderne et performant.

---

### Sprint 5 : Fallbacks et Robustesse (Semaine 6)

#### 5.1 Fallbacks Gemini API

**Tâches** :

- [ ] **Créer recherche basique** (4h)
  - [ ] `services/basicSearch.ts`
  - [ ] Recherche par nom/description
  - [ ] Filtrage par catégorie
  - [ ] Tri par pertinence

- [ ] **Implémenter fallback dans SearchPage** (2h)
  ```typescript
  const performSearch = async (query: string) => {
    if (!process.env.VITE_GEMINI_API_KEY) {
      setWarning('Recherche basique activée. Pour la recherche AI, configurez VITE_GEMINI_API_KEY');
      return basicSearch(query, places, articles, trails);
    }
    // Recherche AI
  };
  ```

- [ ] **Améliorer messages d'erreur** (2h)
  - [ ] Messages contextuels
  - [ ] Suggestions d'action
  - [ ] Toast notifications

**Livrable** : Application fonctionnelle même sans clé API Gemini.

---

#### 5.2 Gestion d'Erreurs Globale

**Tâches** :

- [ ] **Error Boundary React** (2h)
  - [ ] Créer `components/ErrorBoundary.tsx`
  - [ ] Wrapper App.tsx
  - [ ] Page d'erreur friendly

- [ ] **Intercepteur d'erreurs API** (2h)
  - [ ] Créer `utils/apiClient.ts`
  - [ ] Gestion centralisée des erreurs
  - [ ] Retry automatique
  - [ ] Logging

**Livrable** : Application résiliente avec gestion d'erreurs robuste.

---

### Sprint 6 : Consolidation Documentation (Semaine 7)

**Tâches** :

- [ ] **Archiver docs obsolètes** (1h)
  ```bash
  mkdir docs/archive
  mv SETUP_COMPLETE.md docs/archive/
  mv IMPLEMENTATION_SUMMARY.md docs/archive/
  # ... autres fichiers redondants
  ```

- [ ] **Mettre à jour README.md** (2h)
  - [ ] Refléter l'état actuel
  - [ ] Liens vers docs pertinentes
  - [ ] Screenshots actualisés

- [ ] **Créer CONTRIBUTING.md** (2h)
  - [ ] Guidelines de contribution
  - [ ] Process PR
  - [ ] Standards de code
  - [ ] Comment lancer les tests

- [ ] **Finaliser API.md** (2h)
  - [ ] Documenter tous les endpoints
  - [ ] Exemples cURL
  - [ ] Schémas de réponse

**Livrable** : Documentation complète, cohérente et à jour.

---

## 🟡 PHASE 3 : Optimisation (Semaines 8-10)

### Sprint 7 : Performance (Semaine 8)

**Tâches** :

- [ ] **Code Splitting** (4h)
  - [ ] React.lazy() sur routes
  - [ ] Suspense boundaries
  - [ ] Précharger routes critiques

- [ ] **Pagination réelle** (6h)
  - [ ] Backend : limit/offset
  - [ ] Frontend : composant Pagination
  - [ ] Infinite scroll (optionnel)

- [ ] **Optimisation images** (4h)
  - [ ] Lazy loading images
  - [ ] Conversion WebP
  - [ ] Responsive images

**Livrable** : Application performante (Lighthouse > 85).

---

### Sprint 8 : Monitoring (Semaine 9)

**Tâches** :

- [ ] **Installer Sentry** (2h)
  ```bash
  npm install @sentry/react @sentry/node
  ```

- [ ] **Configurer error tracking** (2h)
  - [ ] Frontend monitoring
  - [ ] Backend monitoring
  - [ ] Source maps

- [ ] **Ajouter analytics basiques** (2h)
  - [ ] Page views
  - [ ] User actions
  - [ ] Performance metrics

**Livrable** : Monitoring actif en production.

---

### Sprint 9 : CI/CD (Semaine 10)

**Tâches** :

- [ ] **Créer workflow GitHub Actions** (4h)
  - [ ] `.github/workflows/ci.yml`
  - [ ] Tests automatiques
  - [ ] Build verification
  - [ ] Linting

  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: '18'
        - run: npm ci
        - run: npm test
        - run: npm run build
  ```

- [ ] **Setup déploiement automatique** (4h)
  - [ ] Configuration Vercel/Netlify
  - [ ] Variables d'environnement
  - [ ] Preview deployments

**Livrable** : Pipeline CI/CD fonctionnel.

---

## 📋 Checklist de Suivi

### Sécurité ✅

- [ ] Validation des secrets implémentée
- [ ] Rate limiting configuré
- [ ] Logs sensibles sécurisés
- [ ] CORS correctement configuré
- [ ] Validation d'input côté serveur
- [ ] 0 issue de sécurité critique

### Architecture ✅

- [ ] Décision architecturale prise et documentée
- [ ] Migration vers architecture choisie complète
- [ ] Dualité mock/DB résolue
- [ ] State management moderne en place

### Tests ✅

- [ ] Framework de test configuré
- [ ] Tests d'authentification ≥ 80%
- [ ] Tests API ≥ 60%
- [ ] Tests composants critiques ≥ 50%
- [ ] Couverture globale ≥ 60%

### Documentation ✅

- [ ] ARCHITECTURE.md créé
- [ ] API.md créé et complet
- [ ] GETTING_STARTED.md créé
- [ ] PRODUCTION_READY.md corrigé
- [ ] Docs obsolètes archivées
- [ ] README.md à jour

### Performance ✅

- [ ] Code splitting implémenté
- [ ] Pagination réelle
- [ ] Images optimisées
- [ ] Lighthouse score ≥ 85

### Production ✅

- [ ] Monitoring actif (Sentry)
- [ ] CI/CD configuré
- [ ] Déploiement automatique
- [ ] Documentation déploiement complète

---

## 🎯 Jalons Clés

| Jalon | Date Cible | Critères de Succès |
|-------|------------|-------------------|
| **Jalon 1 : Sécurité** | Semaine 1 | Toutes les issues de sécurité résolues |
| **Jalon 2 : Architecture** | Semaine 3 | Architecture cohérente et documentée |
| **Jalon 3 : Tests** | Semaine 4 | 60% de couverture atteinte |
| **Jalon 4 : State Management** | Semaine 5 | Migration Zustand complète |
| **Jalon 5 : Documentation** | Semaine 7 | Documentation complète et à jour |
| **Jalon 6 : Performance** | Semaine 8 | Lighthouse > 85 |
| **Jalon 7 : Production Ready** | Semaine 10 | CI/CD + Monitoring actifs |

---

## 📞 Points de Décision

### Décisions Requises (Semaine 1)

1. **Architecture** : Full PostgreSQL ou Full Mock ?
2. **Timeline** : 1 dev ou équipe ?
3. **Budget** : Hébergement DB et services ?
4. **Priorités** : Fonctionnalités à garder/supprimer ?

### Décisions Optionnelles (Semaine 4+)

1. State management : Zustand ou Redux Toolkit ?
2. Tests E2E : Playwright ou Cypress ?
3. Hébergement : Vercel, Netlify, ou custom ?
4. Monitoring : Sentry ou alternative ?

---

## 🚀 Prochaines Actions Immédiates

### À faire AUJOURD'HUI

1. ✅ Lire ce plan d'action complet
2. ⏳ Décider de l'option architecturale (A ou B)
3. ⏳ Créer branche `feature/security-fixes`
4. ⏳ Commencer Sprint 1 : Sécurisation

### À faire CETTE SEMAINE

1. ⏳ Implémenter validation des secrets
2. ⏳ Ajouter rate limiting
3. ⏳ Créer ARCHITECTURE.md
4. ⏳ Créer API.md
5. ⏳ Finaliser décision architecturale

---

## 📊 Suivi de Progression

```
PHASE 1 : Corrections Critiques (0/3 sprints)
├── Sprint 1 : Sécurité et Documentation (0/15 tâches)
├── Sprint 2 : Architecture (0/12 tâches)
└── Sprint 3 : Stabilisation initiale (0/8 tâches)

PHASE 2 : Stabilisation (0/4 sprints)
├── Sprint 4 : Tests (0/10 tâches)
├── Sprint 5 : State Management (0/8 tâches)
├── Sprint 6 : Fallbacks (0/7 tâches)
└── Sprint 7 : Documentation (0/6 tâches)

PHASE 3 : Optimisation (0/3 sprints)
├── Sprint 8 : Performance (0/6 tâches)
├── Sprint 9 : Monitoring (0/4 tâches)
└── Sprint 10 : CI/CD (0/3 tâches)

TOTAL : 0/82 tâches complétées (0%)
```

---

## 🎓 Ressources et Références

### Documentation Technique

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

### Guides de Référence

- [CRITIQUE_ET_PRECONISATION.md](./CRITIQUE_ET_PRECONISATION.md) - Analyse complète
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Schéma de base de données
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Guide de migration DB

---

**Dernière mise à jour** : 2024  
**Version** : 1.0  
**Statut** : 📋 Prêt à être exécuté  
**Prochaine révision** : Après chaque sprint
