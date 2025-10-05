import {
    ContentCard, Event, Category, Listing, ListingType, Article, Place, FilterOption, Profile, Trail, TrailDifficulty,
    ForumCategory, ForumThread, ForumPost, Group, Conversation, Message, StaticPageContent, Organization, PlaceClaim, Product, Service,
    Order, Booking, Comment, ContentStatus, UserLevel, Report, AnalyticsEvent, SubscriptionTier, ClaimStatus, OrderStatus, BookingStatus,
    LiveEvent, LiveEventType
} from './types';

// =============================================================================
// CONFIGURATION CONSTANTS
// This file contains only configuration data (enums, icons, categories, etc.)
// All actual data (places, events, profiles, etc.) is now stored in PostgreSQL
// and fetched via API endpoints.
// =============================================================================

// User Levels Configuration
export const USER_LEVELS: UserLevel[] = [
    { id: 1, name: 'Nouveau venu', min_points: 0 },
    { id: 2, name: 'Contributeur', min_points: 50 },
    { id: 3, name: 'Expert Local', min_points: 250 },
];

// Forum Categories Configuration
export const FORUM_CATEGORIES: ForumCategory[] = [
    { id: 'fc1', slug: 'general', name: 'Général', title: 'Général', description: 'Discussions générales sur Annecy', icon: 'message-circle' },
    { id: 'fc2', slug: 'actualites', name: 'Actualités Locales', title: 'Actualités Locales', description: 'Les dernières nouvelles de la ville', icon: 'newspaper' },
    { id: 'fc3', slug: 'conseils', name: 'Conseils & Astuces', title: 'Conseils & Astuces', description: 'Partagez vos bons plans et conseils', icon: 'lightbulb' },
    { id: 'fc4', slug: 'aide', name: 'Aide & Questions', title: 'Aide & Questions', description: 'Besoin d\'aide ? Posez vos questions', icon: 'help-circle' },
    { id: 'fc5', slug: 'rando', name: 'Randonnées & Nature', title: 'Randonnées & Nature', description: 'Partagez vos plus belles balades, vos conseils et vos photos', icon: 'hiking' },
    { id: 'fc6', slug: 'food', name: 'Gastronomie & Restaurants', title: 'Gastronomie & Restaurants', description: 'Les bonnes adresses, les recettes locales, les débats culinaires', icon: 'utensils' },
];

// Static Pages Configuration
export const STATIC_PAGES_CONTENT: StaticPageContent[] = [
    { slug: 'about', title: 'À Propos', content: '<h1>À propos de Salut Annecy</h1><p>Votre guide local complet pour découvrir Annecy...</p>' },
    { slug: 'terms', title: 'Conditions d\'utilisation', content: '<h1>Conditions d\'utilisation</h1><p>En utilisant notre site...</p>' },
    { slug: 'privacy', title: 'Politique de Confidentialité', content: '<h1>Politique de Confidentialité</h1><p>Nous respectons votre vie privée...</p>' },
    { slug: 'qui-sommes-nous', title: 'Qui sommes-nous ?', content: '<h2>Notre Mission</h2><p>Nous sommes une équipe de passionnés d\'Annecy déterminés à créer le guide le plus complet et le plus utile pour tous les amoureux de notre région.</p>' },
    { slug: 'cgu', title: 'Conditions Générales d\'Utilisation', content: '<p>En utilisant ce site, vous acceptez nos conditions d\'utilisation...</p>' },
    { slug: 'faq', title: 'Foire Aux Questions', content: '<h3>Comment puis-je proposer un lieu ?</h3><p>Vous devez être connecté, puis cliquer sur le bouton "Proposer un contenu" dans le menu principal.</p>' },
    { slug: 'contact', title: 'Contact', content: '<p>Pour toute question, veuillez nous contacter à l\'adresse contact@salut-annecy.fr</p>'},
    { slug: 'presse', title: 'Presse', content: '<p>Contenu pour la presse.</p>'},
    { slug: 'cgv', title: 'Conditions Générales de Vente', content: '<p>Contenu des CGV.</p>'},
    { slug: 'confidentialite', title: 'Politique de Confidentialité', content: '<p>Contenu sur la confidentialité.</p>'},
    { slug: 'mentions-legales', title: 'Mentions Légales', content: '<p>Contenu des mentions légales.</p>'},
];

// Main Category Icons & Names
export const CATEGORIES: Category[] = [
  { name: 'Où Manger ?', icon: { name: 'utensils', className: 'w-10 h-10 text-rose-500' }, target: 'restaurants' },
  { name: 'Où Dormir ?', icon: { name: 'bed', className: 'w-10 h-10 text-blue-500' }, target: 'hebergements' },
  { name: 'Quoi Faire ?', icon: { name: 'hiking', className: 'w-10 h-10 text-emerald-500' }, target: 'activites' },
  { name: 'Shopping', icon: { name: 'store', className: 'w-10 h-10 text-amber-500' }, target: 'commerces' },
];

// Listing Type Icons
export const LISTING_ICONS: { [key in ListingType]: { name: string, className: string } } = {
    [ListingType.Emploi]: { name: 'briefcase', className: 'w-6 h-6 text-sky-600' },
    [ListingType.Immobilier]: { name: 'home', className: 'w-6 h-6 text-emerald-600' },
    [ListingType.BonnesAffaires]: { name: 'tag', className: 'w-6 h-6 text-amber-600' },
    [ListingType.Services]: { name: 'sparkles', className: 'w-6 h-6 text-rose-600' },
};

// Listing Categories for Navigation
export const LISTING_CATEGORIES: FilterOption[] = [
    { id: 'cat_emploi', label: 'Emploi' },
    { id: 'cat_immobilier', label: 'Immobilier' },
    { id: 'cat_bonnes_affaires', label: 'Bonnes Affaires' },
    { id: 'cat_services', label: 'Services' },
];

// Filter Options for Events
export const EVENT_CATEGORIES: FilterOption[] = [
    { id: 'cat_fest', label: 'Festival' },
    { id: 'cat_conc', label: 'Concert' },
    { id: 'cat_mark', label: 'Marché' },
    { id: 'cat_spor', label: 'Sport' },
    { id: 'cat_cult', label: 'Culture' }
];

// Filter Options for Restauration
export const RESTAURATION_CATEGORIES: FilterOption[] = [
    { id: 'cat_gastro', label: 'Gastronomique' },
    { id: 'cat_savoyard', label: 'Savoyard' },
    { id: 'cat_pizza', label: 'Pizzeria' },
];

export const RESTAURATION_ATTRIBUTES: FilterOption[] = [
    { id: 'attr_vue', label: 'Vue lac' },
    { id: 'attr_romantic', label: 'Romantique' },
    { id: 'attr_dog', label: 'Dog-friendly' },
];

// Filter Options for Hebergement
export const HEBERGEMENT_CATEGORIES: FilterOption[] = [
    { id: 'cat_hotel5', label: 'Hôtel ★★★★★' },
    { id: 'cat_hotel4', label: 'Hôtel ★★★★' },
    { id: 'cat_appart', label: 'Appartement' }
];

export const HEBERGEMENT_ATTRIBUTES: FilterOption[] = [
    { id: 'attr_piscine', label: 'Piscine' },
    { id: 'attr_spa', label: 'SPA' },
];

// Filter Options for Activites
export const ACTIVITES_CATEGORIES: FilterOption[] = [
    { id: 'cat_sports_aeriens', label: 'Sports aériens' },
    { id: 'cat_nautique', label: 'Activités nautiques' },
    { id: 'cat_montagne', label: 'Montagne & Randonnée' },
];

export const ACTIVITES_ATTRIBUTES: FilterOption[] = [
    { id: 'attr_sensation', label: 'Sensations fortes' },
];

// Filter Options for Commerces
export const COMMERCES_CATEGORIES: FilterOption[] = [
    { id: 'cat_terroir', label: 'Produits du terroir' },
    { id: 'cat_artisanat', label: 'Artisanat local' },
    { id: 'cat_mode', label: 'Mode & Accessoires' },
];

// Attribute Icons Mapping
export const ATTRIBUTE_ICONS: { [key: string]: string } = {
    'Vue lac': 'water',
    'Romantique': 'moon',
    'Dog-friendly': 'dog',
    'Piscine': 'sun',
    'SPA': 'sparkles',
    'Sensations fortes': 'zap',
    'Artisanat': 'store',
    'MOF': 'award',
};

// Trail Difficulty Options
export const TRAIL_DIFFICULTY_OPTIONS: { id: string, label: TrailDifficulty }[] = [
    { id: 'diff_easy', label: TrailDifficulty.Easy },
    { id: 'diff_medium', label: TrailDifficulty.Medium },
    { id: 'diff_hard', label: TrailDifficulty.Hard },
    { id: 'diff_expert', label: TrailDifficulty.Expert }
];

// Live Event Icons
export const LIVE_EVENT_ICONS: { [key in LiveEventType]: { icon: string; color: string; } } = {
    [LiveEventType.Promo]: { icon: 'tag', color: 'text-emerald-500' },
    [LiveEventType.Alerte]: { icon: 'alert-triangle', color: 'text-rose-500' },
    [LiveEventType.Info]: { icon: 'info', color: 'text-sky-500' },
    [LiveEventType.Trafic]: { icon: 'traffic-cone', color: 'text-orange-500' },
    [LiveEventType.Meteo]: { icon: 'cloud-lightning', color: 'text-indigo-500' },
    [LiveEventType.Affluence]: { icon: 'users', color: 'text-amber-500' },
};

// Analytics Events (for demo/testing purposes only)
// In production, these would come from a real analytics service
export const ANALYTICS_EVENTS: AnalyticsEvent[] = [
    { target_entity_id: 'r1', event_name: 'view_place', count: 1258 },
    { target_entity_id: 'r1', event_name: 'click_phone', count: 75 },
    { target_entity_id: 'r1', event_name: 'click_website', count: 112 },
];
