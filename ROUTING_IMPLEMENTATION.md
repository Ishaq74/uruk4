# Routing Implementation - React Router

## Vue d'ensemble

Un système de routing complet basé sur **React Router v6** a été ajouté pour que chaque page ait sa propre URL unique. Fini la navigation JavaScript uniquement - maintenant chaque page est accessible via une URL dédiée!

## Changements effectués

### 1. Installation de React Router
```bash
npm install react-router-dom@^6.22.0
```

### 2. Mise à jour de `index.tsx`
Ajout du `BrowserRouter` pour activer le routing:
```tsx
import { BrowserRouter } from 'react-router-dom';

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### 3. Refonte de `App.tsx`
- **Avant:** Système basé sur `setRoute({ page, id })` - pas de changement d'URL
- **Après:** Système basé sur `<Routes>` et `<Route>` avec URLs réelles

#### Fonction `navigateTo` mise à jour
La fonction `navigateTo` utilise maintenant `navigate()` de React Router:
```tsx
const navigate = useNavigate();

const navigateTo = useCallback((page: string, id?: string, ...) => {
  window.scrollTo(0, 0);
  
  switch (page) {
    case 'home': navigate('/'); break;
    case 'restaurants': navigate('/restaurants'); break;
    case 'place-detail': navigate(`/place/${id}`); break;
    // ... etc
  }
}, [navigate]);
```

### 4. Création de `components/RouteWrappers.tsx`
Composants wrapper pour extraire les paramètres d'URL:
```tsx
export const PlaceDetailWrapper = (props) => {
  const { id } = useParams<{ id: string }>();
  return <PlaceDetailPage {...props} id={id || ''} />;
};
```

## Structure des URLs

### Pages principales
| Ancienne navigation | Nouvelle URL | Description |
|---------------------|--------------|-------------|
| `navigateTo('home')` | `/` | Page d'accueil |
| `navigateTo('restaurants')` | `/restaurants` | Liste des restaurants |
| `navigateTo('hebergements')` | `/hebergements` | Liste des hébergements |
| `navigateTo('activites')` | `/activites` | Liste des activités |
| `navigites('commerces')` | `/commerces` | Liste des commerces |

### Pages de détails
| Type | URL | Exemple |
|------|-----|---------|
| Lieu | `/place/:id` | `/place/r1` |
| Événement | `/event/:id` | `/event/ev1` |
| Sentier | `/trail/:id` | `/trail/t1` |
| Article | `/article/:id` | `/article/art1` |
| Annonce | `/annonce/:id` | `/annonce/l1` |

### Pages utilisateur
| Page | URL |
|------|-----|
| Profil | `/profil/:slug` |
| Favoris | `/favoris` |
| Dashboard | `/dashboard` |
| Paramètres | `/parametres` |
| Conversations | `/conversations` |
| Conversation | `/conversation/:id` |

### Pages forum
| Page | URL |
|------|-----|
| Forums | `/forums` |
| Catégorie | `/forum/category/:id` |
| Thread | `/forum/thread/:id` |
| Nouveau thread | `/forum/new-thread?category=:id` |

### Pages groupes
| Page | URL |
|------|-----|
| Groupes | `/groupes` |
| Mes groupes | `/mes-groupes` |
| Groupe | `/groupe/:id` |
| Nouveau groupe | `/nouveau-groupe` |

### Contenu proposé
| Page | URL |
|------|-----|
| Proposer | `/proposer` |
| Proposer un lieu | `/proposer/lieu` |
| Proposer un événement | `/proposer/evenement` |
| Proposer un sentier | `/proposer/sentier` |
| Proposer une annonce | `/proposer/annonce` |

### Espace Pro
| Page | URL |
|------|-----|
| Espace Pro | `/espace-pro` |
| Gérer lieu | `/espace-pro/lieu/:id` |
| Analytics | `/espace-pro/analytics/:id` |
| Produits | `/espace-pro/produits/:id` |
| Services | `/espace-pro/services/:id` |
| Commandes | `/espace-pro/commandes/:id` |
| Réservations | `/espace-pro/reservations/:id` |
| Revendiquer lieu | `/revendiquer-lieu` |
| Campagnes pub | `/campagnes-pub` |

### Autres
| Page | URL |
|------|-----|
| Live | `/live` |
| Événements | `/events` |
| Trails | `/trails` |
| Articles | `/articles` |
| Annonces | `/annonces` |
| Mes annonces | `/mes-annonces` |
| Membres | `/membres` |
| Recherche | `/recherche?q=:query` |
| Page statique | `/page/:slug` |
| Admin | `/admin` |

## Bénéfices du nouveau système

### ✅ SEO (Référencement)
- Chaque page a une URL unique et indexable
- Les moteurs de recherche peuvent crawler toutes les pages
- Les meta tags SEO fonctionnent maintenant correctement
- Meilleur classement dans Google

### ✅ Expérience utilisateur
- URLs lisibles et partageables
- Bouton "Précédent" du navigateur fonctionne correctement
- Possibilité de mettre en favoris n'importe quelle page
- Copier/coller d'URLs pour partager

### ✅ Analytics
- Tracking précis des pages visitées
- URLs dans Google Analytics
- Comprendre les chemins de navigation

### ✅ Développement
- Code plus propre et maintenable
- Utilisation de patterns React standards
- Meilleure séparation des responsabilités

## Comment ça fonctionne

### 1. Déclaration des routes (App.tsx)
```tsx
<Routes>
  <Route path="/" element={<HomePage ... />} />
  <Route path="/restaurants" element={<PlaceListPage ... />} />
  <Route path="/place/:id" element={<PlaceDetailWrapper ... />} />
</Routes>
```

### 2. Extraction des paramètres (RouteWrappers.tsx)
```tsx
export const PlaceDetailWrapper = (props) => {
  const { id } = useParams(); // Extrait :id de l'URL
  return <PlaceDetailPage {...props} id={id || ''} />;
};
```

### 3. Navigation (navigateTo function)
```tsx
navigateTo('place-detail', 'r1') // Navigue vers /place/r1
```

## Compatibilité

✅ Toutes les pages existantes continuent de fonctionner
✅ La fonction `navigateTo()` reste la même dans l'interface
✅ Pas de changement nécessaire dans les composants enfants
✅ Build réussi sans erreurs

## Tests recommandés

1. **Navigation basique**
   - Cliquer sur différents liens
   - Vérifier que l'URL change
   - Utiliser le bouton "Précédent"

2. **Bookmarking**
   - Mettre en favori une page de détail
   - Fermer et rouvrir le navigateur
   - L'URL devrait charger la même page

3. **Partage d'URLs**
   - Copier l'URL d'une page de détail
   - Ouvrir dans un nouvel onglet
   - La page devrait se charger directement

4. **SEO**
   - Vérifier les meta tags avec les outils de dev
   - Tester avec Google Rich Results Test
   - Valider les URLs dans sitemap.xml (si généré)

## Configuration serveur requise

Pour que les URLs fonctionnent en production, le serveur doit être configuré pour:
- Servir `index.html` pour toutes les routes non-fichiers
- Support du History API

### Exemple Nginx
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Exemple Apache
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Migration complète

L'application utilise maintenant un vrai système de routing:
- ❌ **Avant:** Une seule URL `/` pour toute l'app
- ✅ **Après:** URLs uniques pour chaque page

Exemple concret:
- **Avant:** `https://salut-annecy.fr/` (peu importe la page affichée)
- **Après:** 
  - `https://salut-annecy.fr/` (accueil)
  - `https://salut-annecy.fr/restaurants` (liste restaurants)
  - `https://salut-annecy.fr/place/r1` (détail restaurant)
  - `https://salut-annecy.fr/events` (événements)
  - etc.

🎉 Le site est maintenant prêt pour le référencement avec des URLs uniques et partageables !
