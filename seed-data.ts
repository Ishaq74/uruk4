import {
    ContentCard, Event, Category, Listing, ListingType, Article, Place, FilterOption, Profile, Trail, TrailDifficulty,
    ForumCategory, ForumThread, ForumPost, Group, Conversation, Message, StaticPageContent, Organization, PlaceClaim, Product, Service,
    Order, Booking, Comment, ContentStatus, UserLevel, Report, AnalyticsEvent, SubscriptionTier, ClaimStatus, OrderStatus, BookingStatus,
    LiveEvent, LiveEventType
} from './types';


export const USER_LEVELS: UserLevel[] = [
    { id: 1, name: 'Nouveau venu', min_points: 0 },
    { id: 2, name: 'Contributeur', min_points: 50 },
    { id: 3, name: 'Expert Local', min_points: 250 },
];

export const PROFILES: Profile[] = [
    { id: 'p1', username: 'chloe_voyage', fullName: 'Chloé V.', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', coverImageUrl: 'https://picsum.photos/seed/cover1/1200/400', bio: 'Globe-trotteuse en visite à Annecy pour la première fois ! J\'adore découvrir des pépites culinaires.', levelId: 1, joinDate: 'Mai 2024', favoritePlaceIds: ['r1', 'a1', 'c1'], points: 20 },
    { id: 'p2', username: 'marco_le_vrai', fullName: 'Marc D.', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', coverImageUrl: 'https://picsum.photos/seed/cover2/1200/400', bio: 'Annécien de naissance. Je connais chaque ruelle et chaque sentier. Suivez-moi !', levelId: 3, joinDate: 'Janvier 2023', favoritePlaceIds: ['t1', 't3', 'r2'], isVerified: true, points: 350 },
    { id: 'p3', username: 'amelie_creations', fullName: 'Amélie L.', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', coverImageUrl: 'https://picsum.photos/seed/cover3/1200/400', bio: 'Artisane et créatrice. J\'aime les boutiques qui ont une âme.', levelId: 2, joinDate: 'Mars 2023', favoritePlaceIds: ['c1'], points: 180 },
    { id: 'p4', username: 'jean_pro', fullName: 'Jean Dupont', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', coverImageUrl: 'https://picsum.photos/seed/cover4/1200/400', bio: 'Propriétaire de l\'Hôtel du Lac. Mon but est de vous offrir une expérience mémorable.', levelId: 2, joinDate: 'Février 2023', favoritePlaceIds: ['h1'], points: 210 },
];

export const ORGANIZATIONS: Organization[] = [
    { id: 'org1', name: 'Le Belvédère & Co', primary_owner_id: 'p2', subscription_tier: 'premium', siret: '12345678900011', place_ids: ['r1', 'r4']},
    { id: 'org2', name: 'Hôtel du Lac SA', primary_owner_id: 'p4', subscription_tier: 'premium', place_ids: ['h1']},
    { id: 'org3', name: 'Fromagerie Pierre Gay', primary_owner_id: 'p3', subscription_tier: 'pro', place_ids: ['c1']}
];

export const PLACES: Place[] = [
    { 
        id: 'r1', name: 'Le Belvédère', mainCategory: 'restauration', imageUrl: 'https://picsum.photos/seed/resto1/800/600', 
        rating: 4.7, reviewCount: 125, category: 'Gastronomique', priceRange: '€€€€', attributes: ['Vue lac', 'Romantique'],
        description: 'Perché sur les hauteurs, Le Belvédère offre une cuisine raffinée et inventive avec une vue panoramique imprenable sur le lac d\'Annecy.',
        address: '7 Chemin du Belvédère, 74940 Annecy', phone: '04 50 45 23 05', website: 'lebelvedere-annecy.com',
        coordinates: { lat: 45.913, lng: 6.143 },
        openingHours: { 0: null, 1: null, 2: { open: '19:30', close: '21:30' }, 3: { open: '12:00', close: '13:30' }, 4: { open: '12:00', close: '13:30' }, 5: { open: '12:00', close: '13:30' }, 6: { open: '12:00', close: '13:30' }, },
        reviews: [
            { id: 'rev1', profileId: 'p1', rating: 5, date: 'Il y a 2 jours', comment: 'Une expérience culinaire inoubliable. La vue est à couper le souffle et les plats sont divins. Service impeccable.', placeId: 'r1' },
            { id: 'rev2', profileId: 'p2', rating: 4, date: 'La semaine dernière', comment: 'Très bon, un peu cher mais le cadre justifie le prix. À faire pour une occasion spéciale.', placeId: 'r1' },
        ],
        organization_id: 'org1', status: 'published'
    },
    { 
        id: 'r2', name: 'Chez Pépé', mainCategory: 'restauration', imageUrl: 'https://picsum.photos/seed/resto2/800/600',
        rating: 4.2, reviewCount: 88, category: 'Savoyard', priceRange: '€€', attributes: ['Ambiance chalet', 'Dog-friendly'],
        description: 'L\'authentique restaurant savoyard au coeur de la vieille ville. Fondues, raclettes et tartiflettes comme à la maison.',
        address: '2 rue du Pâquier, 74000 Annecy', phone: '04 50 51 38 97', website: 'chezpepe-annecy.fr',
        coordinates: { lat: 45.899, lng: 6.128 }, openingHours: {}, reviews: [], status: 'pending_review'
    },
    { 
        id: 'h1', name: 'Hôtel du Lac', mainCategory: 'hebergement', imageUrl: 'https://picsum.photos/seed/hotel1/800/600', 
        rating: 4.9, reviewCount: 340, category: 'Hôtel ★★★★★', priceRange: '€€€€', attributes: ['Vue lac', 'Piscine', 'SPA'],
        description: 'Un établissement 5 étoiles offrant un service irréprochable, des chambres luxueuses avec vue sur le lac, et un espace bien-être complet.',
        address: '12 Quai de la Tournette, 74000 Annecy', phone: '04 50 23 45 67', website: 'hoteldulac-annecy.com',
        coordinates: { lat: 45.895, lng: 6.132 }, openingHours: {}, reviews: [], organization_id: 'org2', status: 'published'
    },
    { 
        id: 'a1', name: 'Parapente Annecy', mainCategory: 'activites', imageUrl: 'https://picsum.photos/seed/activity1/800/600', 
        rating: 4.8, reviewCount: 212, category: 'Sports Aériens', priceRange: '€€€', attributes: ['Sensations fortes', 'Vue lac'],
        description: 'Envolez-vous pour un baptême de parapente inoubliable au-dessus du lac le plus pur d\'Europe.',
        address: 'Col de la Forclaz, 74210 Talloires-Montmin', phone: '04 50 60 70 80', website: 'parapente-annecy.com',
        coordinates: { lat: 45.818, lng: 6.223 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'c1', name: 'Fromagerie Pierre Gay', mainCategory: 'commerces', imageUrl: 'https://picsum.photos/seed/shop1/800/600',
        rating: 4.9, reviewCount: 95, category: 'Produits du terroir', priceRange: '€€', attributes: ['Artisanat', 'MOF'],
        description: 'Pierre Gay, Meilleur Ouvrier de France, vous propose une sélection exceptionnelle de fromages affinés dans ses caves.',
        address: '47 Rue Carnot, 74000 Annecy', phone: '04 50 45 07 21', website: 'fromagerie-gay.com',
        coordinates: { lat: 45.900, lng: 6.125 }, openingHours: {}, reviews: [], organization_id: 'org3', status: 'published'
    },
    { 
        id: 'r3', name: 'Le Rital', mainCategory: 'restauration', imageUrl: 'https://picsum.photos/seed/resto3/800/600',
        rating: 3.5, reviewCount: 45, category: 'Pizzeria', priceRange: '€€', attributes: [],
        description: 'Pizzas traditionnelles au feu de bois. Une adresse simple et efficace.',
        address: '1 Rue de la Gare, 74000 Annecy', phone: '04 50 51 52 53', website: 'lerital-annecy.fr',
        coordinates: { lat: 45.896, lng: 6.124 }, openingHours: {}, reviews: [], status: 'rejected', rejection_reason: 'Photo de mauvaise qualité.'
    },
];

export const EVENTS: Event[] = [
    { id: 'ev1', date: '09-15 JUIN', title: 'Festival du Film d\'Animation', location: 'Bonlieu Scène Nationale', imageUrl: 'https://picsum.photos/seed/event1/400/300', category: 'Festival', price: 'À partir de 15€', description: 'L\'événement mondial du cinéma d\'animation.', coordinates: { lat: 45.901, lng: 6.130 }, status: 'published' },
    { id: 'ev2', date: '21 JUIN', title: 'Fête de la Musique', location: 'Toute la ville', imageUrl: 'https://picsum.photos/seed/event2/400/300', category: 'Concert', price: 'Gratuit', description: 'Des concerts gratuits à chaque coin de rue.', coordinates: { lat: 45.899, lng: 6.129 }, status: 'published' },
    { id: 'ev4', date: 'CHAQUE VENDREDI', title: 'Marché de la Vieille Ville', location: 'Rue Sainte-Claire', imageUrl: 'https://picsum.photos/seed/annecy4/400/300', category: 'Marché', price: 'Gratuit', description: 'Le marché traditionnel au coeur de la vieille ville.', coordinates: { lat: 45.898, lng: 6.125 }, status: 'published' },
];

export const TRAILS: Trail[] = [
    { id: 't1', name: 'Mont Veyrier - Mont Baron', imageUrl: 'https://picsum.photos/seed/trail1/800/600', distanceKm: 7.5, durationMin: 240, ascentM: 850, difficulty: TrailDifficulty.Hard, excerpt: 'Une randonnée exigeante offrant les plus belles vues panoramiques.', description: '<p>Le sentier du Mont Veyrier est un classique pour les Annéciens.</p>', startPoint: { lat: 45.910, lng: 6.165 }, gpxUrl: '/gpx/mont-veyrier.gpx', status: 'published' },
    { id: 't2', name: 'Cascade d\'Angon', imageUrl: 'https://picsum.photos/seed/trail2/800/600', distanceKm: 3, durationMin: 90, ascentM: 250, difficulty: TrailDifficulty.Medium, excerpt: 'Une balade rafraîchissante vers une cascade impressionnante.', description: '<p>Idéal pour les journées chaudes.</p>', startPoint: { lat: 45.845, lng: 6.183 }, status: 'published' },
];

export const ALL_LISTINGS: Listing[] = [
    { id: 'l1', title: 'Développeur Full-Stack (H/F)', type: ListingType.Emploi, price: '45k€ - 55k€', date: 'Aujourd\'hui', imageUrl: 'https://picsum.photos/seed/job1/200/200', metadata: { company: 'Annecy Tech', contractType: 'CDI' }, userId: 'p2', description: 'Notre startup en pleine croissance recherche un développeur passionné.', status: 'published' },
    { id: 'l2', title: 'Appartement T2 vue lac', type: ListingType.Immobilier, price: '450 000 €', date: 'Hier', imageUrl: 'https://picsum.photos/seed/immo1/200/200', metadata: { surface: '45m²', 'pièces': 2 }, userId: 'p4', description: 'Particulier vend magnifique T2 de 45m² au dernier étage.', status: 'published' },
    { id: 'l3', title: 'Vends vélo de course', type: ListingType.BonnesAffaires, price: '350 €', date: 'Il y a 3 jours', imageUrl: 'https://picsum.photos/seed/velo1/200/200', metadata: { brand: 'Lapierre', state: 'Excellent' }, userId: 'p3', description: 'Vends vélo de course en carbone, taille M.', status: 'published' },
];

export const MAGAZINE_ARTICLES: Article[] = [
  { id: 'mag1', imageUrl: 'https://picsum.photos/seed/mag1/800/600', title: 'Les 5 plus beaux spots pour le coucher de soleil', excerpt: 'Découvrez les lieux secrets d\'Annecy pour admirer des couchers de soleil à couper le souffle.', authorId: 'p4', publishedAt: '25 Mai 2024', content: `<p>Annecy est surnommée la Venise des Alpes pour ses canaux, mais elle pourrait tout aussi bien être appelée la Cité des Lumières pour ses couchers de soleil spectaculaires. Voici notre sélection des 5 meilleurs endroits pour en prendre plein les yeux.</p><h3>1. Le Pont des Amours</h3><p>Un classique indémodable. La vue sur le canal du Vassé avec le lac en arrière-plan est tout simplement magique lorsque le soleil se couche.</p><h3>2. Le Crêt du Maure</h3><p>Accessible après une courte randonnée depuis Annecy-le-Vieux, ce point de vue offre une perspective panoramique sur toute la ville et le lac. Le spectacle est garanti.</p>`, comments: [{ id: 'comm1', authorId: 'p1', target_entity_id: 'mag1', content: 'Super article ! J\'ai testé le Crêt du Maure hier, c\'était incroyable.', createdAt: 'il y a 1 jour' }], status: 'published' },
];

export const FORUM_THREADS: ForumThread[] = [
    { id: 'ft1', categoryId: 'cat_rando', title: 'Quel est votre sentier préféré pour une sortie en famille ?', authorId: 'p2', createdAt: 'Il y a 2 jours', posts: [{ id: 'fp1', threadId: 'ft1', authorId: 'p2', createdAt: 'Il y a 2 jours', content: 'Salut à tous ! ...' }, { id: 'fp2', threadId: 'ft1', authorId: 'p1', createdAt: 'Il y a 1 jour', content: 'Le Semnoz !' }] },
    { id: 'ft2', categoryId: 'cat_rando', title: 'A la recherche d\'une randonnée difficile', authorId: 'p4', createdAt: 'Il y a 5 jours', posts: [{ id: 'fp3', threadId: 'ft2', authorId: 'p4', createdAt: 'Il y a 5 jours', content: 'Des idées pour un trek de 2 jours ?'}] },
    { id: 'ft3', categoryId: 'cat_food', title: 'Meilleure fondue d\'Annecy', authorId: 'p1', createdAt: 'Il y a 1 semaine', posts: [{ id: 'fp4', threadId: 'ft3', authorId: 'p1', createdAt: 'Il y a 1 semaine', content: 'Où trouver la meilleure fondue ?'}] },
    { id: 'ft4', categoryId: 'cat_food', title: 'Meilleures Pizzerias', authorId: 'p3', createdAt: 'Il y a 1 semaine', posts: [{ id: 'fp5', threadId: 'ft4', authorId: 'p3', createdAt: 'Il y a 1 semaine', content: 'Des recommandations de pizzerias ?'}] },
];
export const GROUPS: Group[] = [ { id: 'g1', name: 'Les Randonneurs du Lac', bannerUrl: 'https://picsum.photos/seed/group1_banner/1200/300', avatarUrl: 'https://picsum.photos/seed/group1_avatar/200/200', description: 'Un groupe pour tous les amoureux de la marche...', memberCount: 2, isPrivate: false, members: [{ profileId: 'p2', role: 'owner'}, { profileId: 'p4', role: 'member'}] }, ];
export const CONVERSATIONS: Conversation[] = [ { id: 'conv1', participantIds: ['p1', 'p2'], messages: [ { id: 'msg1', senderId: 'p1', content: 'Salut Marc !...', createdAt: 'Il y a 1 jour' }, ] }, ];
export const PRODUCTS: Product[] = [ { id: 'prod1', organization_id: 'org3', name: 'Reblochon Fermier AOP', description: 'Un reblochon au lait cru...', price: 12.50, imageUrl: 'https://picsum.photos/seed/cheese1/200/200', stock: 50 }, ];
export const SERVICES: Service[] = [ { id: 'serv1', organization_id: 'org1', name: 'Cours de cuisine "Saveurs des Alpes"', description: 'Apprenez à cuisiner un menu gastronomique...', base_price: 150, duration_minutes: 180 }, ];
export const ORDERS: Order[] = [ { id: 'order1', customer_id: 'p1', organization_id: 'org3', product_id: 'prod1', product_name: 'Reblochon Fermier AOP', quantity: 2, total_price: 25.00, status: 'completed', ordered_at: '2024-05-20' }, ];
export const BOOKINGS: Booking[] = [ { id: 'book1', customer_id: 'p3', organization_id: 'org1', service_id: 'serv1', service_name: 'Cours de cuisine', total_price: 150.00, status: 'confirmed', booked_at: '2024-05-18', booking_date: '2024-06-15' }, ];
export const CLAIMS: PlaceClaim[] = [ { id: 'claim1', placeId: 'r2', organizationId: 'org1', userId: 'p2', status: 'pending' }, { id: 'claim2', placeId: 'a1', organizationId: 'org1', userId: 'p2', status: 'approved' } ];
export const REPORTS: Report[] = [];
export const LIVE_EVENTS: LiveEvent[] = [
    {
        id: 'live1',
        type: LiveEventType.Promo,
        title: '-50% sur les vestes',
        location: 'Boutique "Le Vestiaire"',
        coordinates: { lat: 45.900, lng: 6.126 },
        authorId: 'p3',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        upvotes: ['p1', 'p2'],
        downvotes: [],
    },
    {
        id: 'live2',
        type: LiveEventType.Affluence,
        title: 'Grosse affluence au pont des amours',
        location: 'Pont des Amours',
        coordinates: { lat: 45.902, lng: 6.134 },
        authorId: 'p1',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        upvotes: ['p2', 'p4'],
        downvotes: [],
    },
    {
        id: 'live3',
        type: LiveEventType.Alerte,
        title: 'Pickpocket signalé près de la gare',
        location: 'Gare d\'Annecy',
        coordinates: { lat: 45.902, lng: 6.122 },
        authorId: 'p2',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        upvotes: ['p4'],
        downvotes: [],
    },
];

export const FORUM_CATEGORIES: ForumCategory[] = [
    { id: 'cat_rando', title: 'Randonnées & Nature', description: 'Partagez vos plus belles balades, vos conseils et vos photos.', icon: 'hiking' },
    { id: 'cat_food', title: 'Gastronomie & Restaurants', description: 'Les bonnes adresses, les recettes locales, les débats culinaires.', icon: 'utensils' },
];

export const STATIC_PAGES_CONTENT: StaticPageContent[] = [
    { slug: 'qui-sommes-nous', title: 'Qui sommes-nous ?', content: '<h2>Notre Mission</h2><p>Nous sommes une équipe de passionnés d\'Annecy déterminés à créer le guide le plus complet et le plus utile pour tous les amoureux de notre région.</p>' },
    { slug: 'cgu', title: 'Conditions Générales d\'Utilisation', content: '<p>En utilisant ce site, vous acceptez nos conditions d\'utilisation...</p>' },
    { slug: 'faq', title: 'Foire Aux Questions', content: '<h3>Comment puis-je proposer un lieu ?</h3><p>Vous devez être connecté, puis cliquer sur le bouton "Proposer un contenu" dans le menu principal.</p>' },
    { slug: 'contact', title: 'Contact', content: '<p>Pour toute question, veuillez nous contacter à l\'adresse contact@salut-annecy.fr</p>'},
    { slug: 'presse', title: 'Presse', content: '<p>Contenu pour la presse.</p>'},
    { slug: 'cgv', title: 'Conditions Générales de Vente', content: '<p>Contenu des CGV.</p>'},
    { slug: 'confidentialite', title: 'Politique de Confidentialité', content: '<p>Contenu sur la confidentialité.</p>'},
    { slug: 'mentions-legales', title: 'Mentions Légales', content: '<p>Contenu des mentions légales.</p>'},
];

export const ANALYTICS_EVENTS: AnalyticsEvent[] = [
    { target_entity_id: 'r1', event_name: 'view_place', count: 1258 },
    { target_entity_id: 'r1', event_name: 'click_phone', count: 75 },
    { target_entity_id: 'r1', event_name: 'click_website', count: 112 },
];


// --- UI CONSTANTS ---

export const CATEGORIES: Category[] = [
  { name: 'Où Manger ?', icon: { name: 'utensils', className: 'w-10 h-10 text-rose-500' }, target: 'restaurants' },
  { name: 'Où Dormir ?', icon: { name: 'bed', className: 'w-10 h-10 text-blue-500' }, target: 'hebergements' },
  { name: 'Quoi Faire ?', icon: { name: 'hiking', className: 'w-10 h-10 text-emerald-500' }, target: 'activites' },
  { name: 'Shopping', icon: { name: 'store', className: 'w-10 h-10 text-amber-500' }, target: 'commerces' },
];

export const LISTING_ICONS: { [key in ListingType]: { name: string, className: string } } = {
    [ListingType.Emploi]: { name: 'briefcase', className: 'w-6 h-6 text-sky-600' },
    [ListingType.Immobilier]: { name: 'home', className: 'w-6 h-6 text-emerald-600' },
    [ListingType.BonnesAffaires]: { name: 'tag', className: 'w-6 h-6 text-amber-600' },
    [ListingType.Services]: { name: 'sparkles', className: 'w-6 h-6 text-rose-600' },
};

export const EVENT_CATEGORIES: FilterOption[] = [ { id: 'cat_fest', label: 'Festival' }, { id: 'cat_conc', label: 'Concert' }, { id: 'cat_mark', label: 'Marché' }, { id: 'cat_spor', label: 'Sport' }, { id: 'cat_cult', label: 'Culture' } ];
export const RESTAURATION_CATEGORIES: FilterOption[] = [ { id: 'cat_gastro', label: 'Gastronomique' }, { id: 'cat_savoyard', label: 'Savoyard' }, { id: 'cat_pizza', label: 'Pizzeria' }, ];
export const RESTAURATION_ATTRIBUTES: FilterOption[] = [ { id: 'attr_vue', label: 'Vue lac' }, { id: 'attr_romantic', label: 'Romantique' }, { id: 'attr_dog', label: 'Dog-friendly' }, ];
export const HEBERGEMENT_CATEGORIES: FilterOption[] = [ { id: 'cat_hotel5', label: 'Hôtel ★★★★★' }, { id: 'cat_hotel4', label: 'Hôtel ★★★★' }, { id: 'cat_appart', label: 'Appartement' } ];
export const HEBERGEMENT_ATTRIBUTES: FilterOption[] = [ { id: 'attr_piscine', label: 'Piscine' }, { id: 'attr_spa', label: 'SPA' }, ];
export const ACTIVITES_ATTRIBUTES: FilterOption[] = [ { id: 'attr_sensation', label: 'Sensations fortes' }, ];
export const COMMERCES_CATEGORIES: FilterOption[] = [ { id: 'attr_terroir', label: 'Produits du terroir' }, ];

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

export const TRAIL_DIFFICULTY_OPTIONS: { id: string, label: TrailDifficulty }[] = [ { id: 'diff_easy', label: TrailDifficulty.Easy }, { id: 'diff_medium', label: TrailDifficulty.Medium }, { id: 'diff_hard', label: TrailDifficulty.Hard }, { id: 'diff_expert', label: TrailDifficulty.Expert } ];
export const LIVE_EVENT_ICONS: { [key in LiveEventType]: { icon: string; color: string; } } = {
    [LiveEventType.Promo]: { icon: 'tag', color: 'text-emerald-500' },
    [LiveEventType.Alerte]: { icon: 'alert-triangle', color: 'text-rose-500' },
    [LiveEventType.Info]: { icon: 'info', color: 'text-sky-500' },
    [LiveEventType.Trafic]: { icon: 'traffic-cone', color: 'text-orange-500' },
    [LiveEventType.Meteo]: { icon: 'cloud-lightning', color: 'text-indigo-500' },
    [LiveEventType.Affluence]: { icon: 'users', color: 'text-amber-500' },
};