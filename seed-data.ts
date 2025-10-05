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
    // RESTAURANTS
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
        coordinates: { lat: 45.899, lng: 6.128 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'r3', name: 'Le Rital', mainCategory: 'restauration', imageUrl: 'https://picsum.photos/seed/resto3/800/600',
        rating: 3.5, reviewCount: 45, category: 'Pizzeria', priceRange: '€€', attributes: [],
        description: 'Pizzas traditionnelles au feu de bois. Une adresse simple et efficace.',
        address: '1 Rue de la Gare, 74000 Annecy', phone: '04 50 51 52 53', website: 'lerital-annecy.fr',
        coordinates: { lat: 45.896, lng: 6.124 }, openingHours: {}, reviews: [], status: 'rejected', rejection_reason: 'Photo de mauvaise qualité.'
    },
    { 
        id: 'r4', name: 'L\'Auberge du Lac', mainCategory: 'restauration', imageUrl: 'https://picsum.photos/seed/resto4/800/600',
        rating: 4.5, reviewCount: 156, category: 'Gastronomique', priceRange: '€€€', attributes: ['Vue lac', 'Romantique'],
        description: 'Cuisine française raffinée dans un cadre enchanteur au bord du lac. Terrasse ombragée l\'été.',
        address: '23 Avenue d\'Albigny, 74000 Annecy', phone: '04 50 23 87 90', website: 'auberge-lac-annecy.fr',
        coordinates: { lat: 45.902, lng: 6.135 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'r5', name: 'La Table de Marie', mainCategory: 'restauration', imageUrl: 'https://picsum.photos/seed/resto5/800/600',
        rating: 4.4, reviewCount: 98, category: 'Savoyard', priceRange: '€€', attributes: ['Dog-friendly'],
        description: 'Spécialités savoyardes et accueil chaleureux dans une ancienne ferme rénovée.',
        address: '15 Rue de la République, 74000 Annecy', phone: '04 50 45 12 34', website: 'table-marie.com',
        coordinates: { lat: 45.897, lng: 6.127 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'r6', name: 'Pizza Luna', mainCategory: 'restauration', imageUrl: 'https://picsum.photos/seed/resto6/800/600',
        rating: 4.3, reviewCount: 211, category: 'Pizzeria', priceRange: '€', attributes: ['Dog-friendly'],
        description: 'Pizzas napolitaines authentiques cuites au four à bois. Pâte faite maison tous les jours.',
        address: '8 Rue Vaugelas, 74000 Annecy', phone: '04 50 51 67 89', website: 'pizzaluna-annecy.fr',
        coordinates: { lat: 45.898, lng: 6.126 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'r7', name: 'Le Comptoir Savoyard', mainCategory: 'restauration', imageUrl: 'https://picsum.photos/seed/resto7/800/600',
        rating: 4.6, reviewCount: 187, category: 'Savoyard', priceRange: '€€', attributes: ['Ambiance chalet'],
        description: 'Le meilleur de la gastronomie savoyarde : tartiflette, fondue, raclette dans un décor montagnard.',
        address: '31 Rue Sommeiller, 74000 Annecy', phone: '04 50 45 78 90', website: 'comptoir-savoyard.com',
        coordinates: { lat: 45.900, lng: 6.129 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'r8', name: 'Le Jardin Secret', mainCategory: 'restauration', imageUrl: 'https://picsum.photos/seed/resto8/800/600',
        rating: 4.8, reviewCount: 142, category: 'Gastronomique', priceRange: '€€€€', attributes: ['Romantique'],
        description: 'Restaurant gastronomique étoilé au guide Michelin. Cuisine créative et produits de saison.',
        address: '5 Passage de l\'Évêché, 74000 Annecy', phone: '04 50 23 45 78', website: 'jardinsecret-annecy.fr',
        coordinates: { lat: 45.899, lng: 6.128 }, openingHours: {}, reviews: [], status: 'published'
    },
    
    // HÉBERGEMENTS
    { 
        id: 'h1', name: 'Hôtel du Lac', mainCategory: 'hebergement', imageUrl: 'https://picsum.photos/seed/hotel1/800/600', 
        rating: 4.9, reviewCount: 340, category: 'Hôtel ★★★★★', priceRange: '€€€€', attributes: ['Vue lac', 'Piscine', 'SPA'],
        description: 'Un établissement 5 étoiles offrant un service irréprochable, des chambres luxueuses avec vue sur le lac, et un espace bien-être complet.',
        address: '12 Quai de la Tournette, 74000 Annecy', phone: '04 50 23 45 67', website: 'hoteldulac-annecy.com',
        coordinates: { lat: 45.895, lng: 6.132 }, openingHours: {}, reviews: [], organization_id: 'org2', status: 'published'
    },
    { 
        id: 'h2', name: 'Le Palace de Menthon', mainCategory: 'hebergement', imageUrl: 'https://picsum.photos/seed/hotel2/800/600',
        rating: 4.8, reviewCount: 287, category: 'Hôtel ★★★★★', priceRange: '€€€€', attributes: ['Vue lac', 'Piscine', 'SPA'],
        description: 'Hôtel de luxe historique dans un château du XIXe siècle. Service de conciergerie 24/7.',
        address: 'Allée du Château, 74290 Menthon-Saint-Bernard', phone: '04 50 60 12 34', website: 'palace-menthon.com',
        coordinates: { lat: 45.862, lng: 6.196 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'h3', name: 'Hôtel des Alpes', mainCategory: 'hebergement', imageUrl: 'https://picsum.photos/seed/hotel3/800/600',
        rating: 4.3, reviewCount: 178, category: 'Hôtel ★★★★', priceRange: '€€€', attributes: ['Vue lac'],
        description: 'Hôtel 4 étoiles au cœur de la vieille ville. Chambres confortables avec vue sur les canaux.',
        address: '12 Rue de la Poste, 74000 Annecy', phone: '04 50 45 67 89', website: 'hotel-alpes-annecy.fr',
        coordinates: { lat: 45.899, lng: 6.127 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'h4', name: 'Résidence Les Terrasses', mainCategory: 'hebergement', imageUrl: 'https://picsum.photos/seed/hotel4/800/600',
        rating: 4.5, reviewCount: 124, category: 'Appartement', priceRange: '€€', attributes: ['Piscine'],
        description: 'Appartements tout équipés avec cuisine, idéal pour les familles. Piscine chauffée et parking.',
        address: '45 Avenue de Genève, 74000 Annecy', phone: '04 50 23 98 76', website: 'les-terrasses-annecy.com',
        coordinates: { lat: 45.894, lng: 6.118 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'h5', name: 'Chalet du Semnoz', mainCategory: 'hebergement', imageUrl: 'https://picsum.photos/seed/hotel5/800/600',
        rating: 4.4, reviewCount: 89, category: 'Hôtel ★★★★', priceRange: '€€', attributes: ['SPA'],
        description: 'Chalet confortable en altitude avec vue panoramique. Parfait pour les amoureux de la montagne.',
        address: 'Route du Semnoz, 74000 Annecy', phone: '04 50 01 23 45', website: 'chalet-semnoz.fr',
        coordinates: { lat: 45.808, lng: 6.104 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'h6', name: 'Appartements du Paquier', mainCategory: 'hebergement', imageUrl: 'https://picsum.photos/seed/hotel6/800/600',
        rating: 4.2, reviewCount: 156, category: 'Appartement', priceRange: '€€', attributes: [],
        description: 'Studios et appartements moderne en plein centre-ville, à deux pas du lac.',
        address: '8 Rue du Paquier, 74000 Annecy', phone: '04 50 45 32 10', website: 'appart-paquier.com',
        coordinates: { lat: 45.900, lng: 6.129 }, openingHours: {}, reviews: [], status: 'published'
    },
    
    // ACTIVITÉS
    { 
        id: 'a1', name: 'Parapente Annecy', mainCategory: 'activites', imageUrl: 'https://picsum.photos/seed/activity1/800/600', 
        rating: 4.8, reviewCount: 212, category: 'Sports Aériens', priceRange: '€€€', attributes: ['Sensations fortes', 'Vue lac'],
        description: 'Envolez-vous pour un baptême de parapente inoubliable au-dessus du lac le plus pur d\'Europe.',
        address: 'Col de la Forclaz, 74210 Talloires-Montmin', phone: '04 50 60 70 80', website: 'parapente-annecy.com',
        coordinates: { lat: 45.818, lng: 6.223 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'a2', name: 'Location de Kayak', mainCategory: 'activites', imageUrl: 'https://picsum.photos/seed/activity2/800/600',
        rating: 4.5, reviewCount: 167, category: 'Sports Nautiques', priceRange: '€€', attributes: ['Vue lac'],
        description: 'Louez un kayak et explorez le lac d\'Annecy à votre rythme. Circuits guidés disponibles.',
        address: '3 Avenue du Petit Port, 74000 Annecy', phone: '04 50 23 56 78', website: 'kayak-annecy.fr',
        coordinates: { lat: 45.893, lng: 6.145 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'a3', name: 'Escalade & Via Ferrata', mainCategory: 'activites', imageUrl: 'https://picsum.photos/seed/activity3/800/600',
        rating: 4.7, reviewCount: 98, category: 'Sports de Montagne', priceRange: '€€', attributes: ['Sensations fortes'],
        description: 'Parcours d\'escalade et via ferrata pour tous les niveaux. Encadrement professionnel.',
        address: 'Château de Montrottier, 74330 Lovagny', phone: '04 50 46 78 90', website: 'escalade-annecy.com',
        coordinates: { lat: 45.896, lng: 6.048 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'a4', name: 'Croisière Lac d\'Annecy', mainCategory: 'activites', imageUrl: 'https://picsum.photos/seed/activity4/800/600',
        rating: 4.6, reviewCount: 321, category: 'Croisières', priceRange: '€€', attributes: ['Vue lac'],
        description: 'Découvrez le lac d\'Annecy à bord de nos bateaux. Plusieurs circuits disponibles.',
        address: '2 Place aux Bois, 74000 Annecy', phone: '04 50 51 08 40', website: 'croisiere-annecy.com',
        coordinates: { lat: 45.902, lng: 6.129 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'a5', name: 'VTT Montagne', mainCategory: 'activites', imageUrl: 'https://picsum.photos/seed/activity5/800/600',
        rating: 4.4, reviewCount: 76, category: 'Cyclisme', priceRange: '€€', attributes: ['Sensations fortes'],
        description: 'Location de VTT électriques et classiques. Parcours balisés et cartes fournies.',
        address: '18 Avenue de Genève, 74000 Annecy', phone: '04 50 23 45 67', website: 'vtt-annecy.com',
        coordinates: { lat: 45.895, lng: 6.120 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'a6', name: 'Spa Thermal', mainCategory: 'activites', imageUrl: 'https://picsum.photos/seed/activity6/800/600',
        rating: 4.9, reviewCount: 234, category: 'Bien-être', priceRange: '€€€', attributes: [],
        description: 'Centre thermal et spa avec piscines, saunas, hammams et soins du corps.',
        address: '32 Rue des Bains, 74000 Annecy', phone: '04 50 23 78 90', website: 'spa-annecy.fr',
        coordinates: { lat: 45.896, lng: 6.131 }, openingHours: {}, reviews: [], status: 'published'
    },
    
    // COMMERCES
    { 
        id: 'c1', name: 'Fromagerie Pierre Gay', mainCategory: 'commerces', imageUrl: 'https://picsum.photos/seed/shop1/800/600',
        rating: 4.9, reviewCount: 95, category: 'Produits du terroir', priceRange: '€€', attributes: ['Artisanat', 'MOF'],
        description: 'Pierre Gay, Meilleur Ouvrier de France, vous propose une sélection exceptionnelle de fromages affinés dans ses caves.',
        address: '47 Rue Carnot, 74000 Annecy', phone: '04 50 45 07 21', website: 'fromagerie-gay.com',
        coordinates: { lat: 45.900, lng: 6.125 }, openingHours: {}, reviews: [], organization_id: 'org3', status: 'published'
    },
    { 
        id: 'c2', name: 'Boulangerie Dupont', mainCategory: 'commerces', imageUrl: 'https://picsum.photos/seed/shop2/800/600',
        rating: 4.7, reviewCount: 142, category: 'Produits du terroir', priceRange: '€', attributes: ['Artisanat'],
        description: 'Boulangerie artisanale depuis 1950. Pain au levain naturel et pâtisseries maison.',
        address: '12 Rue Sainte-Claire, 74000 Annecy', phone: '04 50 45 23 45', website: 'boulangerie-dupont.fr',
        coordinates: { lat: 45.898, lng: 6.126 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'c3', name: 'Boutique Montagne', mainCategory: 'commerces', imageUrl: 'https://picsum.photos/seed/shop3/800/600',
        rating: 4.5, reviewCount: 87, category: 'Équipement sportif', priceRange: '€€€', attributes: [],
        description: 'Équipement de montagne, randonnée, ski et alpinisme. Conseil par des experts.',
        address: '25 Rue Royale, 74000 Annecy', phone: '04 50 51 34 56', website: 'boutique-montagne.com',
        coordinates: { lat: 45.901, lng: 6.128 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'c4', name: 'Cave à Vins', mainCategory: 'commerces', imageUrl: 'https://picsum.photos/seed/shop4/800/600',
        rating: 4.8, reviewCount: 112, category: 'Produits du terroir', priceRange: '€€', attributes: ['Artisanat'],
        description: 'Sélection de vins de Savoie et de France. Conseils personnalisés et dégustations.',
        address: '8 Rue Perrière, 74000 Annecy', phone: '04 50 45 67 89', website: 'cave-annecy.fr',
        coordinates: { lat: 45.899, lng: 6.127 }, openingHours: {}, reviews: [], status: 'published'
    },
    { 
        id: 'c5', name: 'Librairie du Lac', mainCategory: 'commerces', imageUrl: 'https://picsum.photos/seed/shop5/800/600',
        rating: 4.6, reviewCount: 156, category: 'Culture', priceRange: '€€', attributes: [],
        description: 'Librairie indépendante avec un grand choix de livres sur la région et événements culturels.',
        address: '15 Rue Sommeiller, 74000 Annecy', phone: '04 50 23 45 67', website: 'librairie-lac.com',
        coordinates: { lat: 45.900, lng: 6.130 }, openingHours: {}, reviews: [], status: 'published'
    },
];

export const EVENTS: Event[] = [
    { id: 'ev1', date: '09-15 JUIN', title: 'Festival du Film d\'Animation', location: 'Bonlieu Scène Nationale', imageUrl: 'https://picsum.photos/seed/event1/400/300', category: 'Festival', price: 'À partir de 15€', description: 'L\'événement mondial du cinéma d\'animation.', coordinates: { lat: 45.901, lng: 6.130 }, status: 'published' },
    { id: 'ev2', date: '21 JUIN', title: 'Fête de la Musique', location: 'Toute la ville', imageUrl: 'https://picsum.photos/seed/event2/400/300', category: 'Concert', price: 'Gratuit', description: 'Des concerts gratuits à chaque coin de rue.', coordinates: { lat: 45.899, lng: 6.129 }, status: 'published' },
    { id: 'ev3', date: '1-7 JUILLET', title: 'Noctibules d\'Annecy', location: 'Jardins de l\'Europe', imageUrl: 'https://picsum.photos/seed/event3/400/300', category: 'Festival', price: 'Gratuit', description: 'Festival de rue avec spectacles, concerts et animations pour toute la famille.', coordinates: { lat: 45.901, lng: 6.131 }, status: 'published' },
    { id: 'ev4', date: 'CHAQUE VENDREDI', title: 'Marché de la Vieille Ville', location: 'Rue Sainte-Claire', imageUrl: 'https://picsum.photos/seed/annecy4/400/300', category: 'Marché', price: 'Gratuit', description: 'Le marché traditionnel au coeur de la vieille ville.', coordinates: { lat: 45.898, lng: 6.125 }, status: 'published' },
    { id: 'ev5', date: '15 JUILLET', title: 'Feu d\'Artifice du 14 Juillet', location: 'Plage d\'Albigny', imageUrl: 'https://picsum.photos/seed/event5/400/300', category: 'Culture', price: 'Gratuit', description: 'Feu d\'artifice spectaculaire au-dessus du lac pour célébrer la fête nationale.', coordinates: { lat: 45.903, lng: 6.137 }, status: 'published' },
    { id: 'ev6', date: '5 AOÛT', title: 'Fête du Lac', location: 'Lac d\'Annecy', imageUrl: 'https://picsum.photos/seed/event6/400/300', category: 'Festival', price: 'Gratuit', description: 'Le plus grand spectacle pyrotechnique d\'Europe sur le lac.', coordinates: { lat: 45.900, lng: 6.130 }, status: 'published' },
    { id: 'ev7', date: '12-15 AOÛT', title: 'Venetian Carnival', location: 'Canaux d\'Annecy', imageUrl: 'https://picsum.photos/seed/event7/400/300', category: 'Festival', price: '10€', description: 'Carnaval vénitien sur les canaux avec gondoles et costumes d\'époque.', coordinates: { lat: 45.899, lng: 6.127 }, status: 'published' },
    { id: 'ev8', date: 'CHAQUE SAMEDI', title: 'Marché Bio du Paquier', location: 'Paquier', imageUrl: 'https://picsum.photos/seed/event8/400/300', category: 'Marché', price: 'Gratuit', description: 'Marché de producteurs locaux et biologiques.', coordinates: { lat: 45.901, lng: 6.129 }, status: 'published' },
    { id: 'ev9', date: '20 SEPTEMBRE', title: 'Marathon du Lac', location: 'Tour du Lac', imageUrl: 'https://picsum.photos/seed/event9/400/300', category: 'Sport', price: '45€', description: 'Course à pied autour du lac d\'Annecy, parcours de 42km.', coordinates: { lat: 45.900, lng: 6.130 }, status: 'published' },
    { id: 'ev10', date: '1-15 DÉCEMBRE', title: 'Marché de Noël', location: 'Centre-ville', imageUrl: 'https://picsum.photos/seed/event10/400/300', category: 'Marché', price: 'Gratuit', description: 'Marché de Noël traditionnel avec chalets, vin chaud et artisanat local.', coordinates: { lat: 45.899, lng: 6.128 }, status: 'published' },
];

export const TRAILS: Trail[] = [
    { id: 't1', name: 'Mont Veyrier - Mont Baron', imageUrl: 'https://picsum.photos/seed/trail1/800/600', distanceKm: 7.5, durationMin: 240, ascentM: 850, difficulty: TrailDifficulty.Hard, excerpt: 'Une randonnée exigeante offrant les plus belles vues panoramiques.', description: '<p>Le sentier du Mont Veyrier est un classique pour les Annéciens.</p>', startPoint: { lat: 45.910, lng: 6.165 }, gpxUrl: '/gpx/mont-veyrier.gpx', status: 'published' },
    { id: 't2', name: 'Cascade d\'Angon', imageUrl: 'https://picsum.photos/seed/trail2/800/600', distanceKm: 3, durationMin: 90, ascentM: 250, difficulty: TrailDifficulty.Medium, excerpt: 'Une balade rafraîchissante vers une cascade impressionnante.', description: '<p>Idéal pour les journées chaudes.</p>', startPoint: { lat: 45.845, lng: 6.183 }, status: 'published' },
    { id: 't3', name: 'Le Semnoz par les Puisots', imageUrl: 'https://picsum.photos/seed/trail3/800/600', distanceKm: 12, durationMin: 300, ascentM: 950, difficulty: TrailDifficulty.Hard, excerpt: 'Ascension sportive jusqu\'au sommet du Semnoz.', description: '<p>Vue exceptionnelle sur le lac et les Alpes au sommet.</p>', startPoint: { lat: 45.850, lng: 6.090 }, gpxUrl: '/gpx/semnoz.gpx', status: 'published' },
    { id: 't4', name: 'Tour du Lac d\'Annecy', imageUrl: 'https://picsum.photos/seed/trail4/800/600', distanceKm: 42, durationMin: 180, ascentM: 150, difficulty: TrailDifficulty.Easy, excerpt: 'Circuit vélo familial autour du lac sur piste cyclable.', description: '<p>Parcours plat et sécurisé, parfait pour les familles.</p>', startPoint: { lat: 45.900, lng: 6.130 }, status: 'published' },
    { id: 't5', name: 'Col de la Forclaz', imageUrl: 'https://picsum.photos/seed/trail5/800/600', distanceKm: 8, durationMin: 210, ascentM: 650, difficulty: TrailDifficulty.Medium, excerpt: 'Belle montée vers un col offrant une vue splendide.', description: '<p>Point de départ des parapentes, ambiance montagnarde.</p>', startPoint: { lat: 45.860, lng: 6.180 }, gpxUrl: '/gpx/forclaz.gpx', status: 'published' },
    { id: 't6', name: 'Roc de Chère', imageUrl: 'https://picsum.photos/seed/trail6/800/600', distanceKm: 5, durationMin: 120, ascentM: 180, difficulty: TrailDifficulty.Easy, excerpt: 'Promenade dans une réserve naturelle protégée.', description: '<p>Sentier ombragé avec points de vue sur le lac.</p>', startPoint: { lat: 45.838, lng: 6.184 }, status: 'published' },
    { id: 't7', name: 'La Tournette', imageUrl: 'https://picsum.photos/seed/trail7/800/600', distanceKm: 11, durationMin: 360, ascentM: 1200, difficulty: TrailDifficulty.Expert, excerpt: 'Ascension du plus haut sommet autour du lac.', description: '<p>Randonnée alpine exigeante, équipement de montagne recommandé.</p>', startPoint: { lat: 45.820, lng: 6.230 }, gpxUrl: '/gpx/tournette.gpx', status: 'published' },
    { id: 't8', name: 'Ermitage de Saint-Germain', imageUrl: 'https://picsum.photos/seed/trail8/800/600', distanceKm: 4, durationMin: 90, ascentM: 220, difficulty: TrailDifficulty.Easy, excerpt: 'Courte randonnée vers un ermitage historique.', description: '<p>Accessible à tous, belle vue sur Annecy et le lac.</p>', startPoint: { lat: 45.908, lng: 6.125 }, status: 'published' },
];

export const ALL_LISTINGS: Listing[] = [
    { id: 'l1', title: 'Développeur Full-Stack (H/F)', type: ListingType.Emploi, price: '45k€ - 55k€', date: 'Aujourd\'hui', imageUrl: 'https://picsum.photos/seed/job1/200/200', metadata: { company: 'Annecy Tech', contractType: 'CDI' }, userId: 'p2', description: 'Notre startup en pleine croissance recherche un développeur passionné.', status: 'published' },
    { id: 'l2', title: 'Appartement T2 vue lac', type: ListingType.Immobilier, price: '450 000 €', date: 'Hier', imageUrl: 'https://picsum.photos/seed/immo1/200/200', metadata: { surface: '45m²', 'pièces': 2 }, userId: 'p4', description: 'Particulier vend magnifique T2 de 45m² au dernier étage.', status: 'published' },
    { id: 'l3', title: 'Vends vélo de course', type: ListingType.BonnesAffaires, price: '350 €', date: 'Il y a 3 jours', imageUrl: 'https://picsum.photos/seed/velo1/200/200', metadata: { brand: 'Lapierre', state: 'Excellent' }, userId: 'p3', description: 'Vends vélo de course en carbone, taille M.', status: 'published' },
    { id: 'l4', title: 'Chef de projet digital', type: ListingType.Emploi, price: '40k€ - 50k€', date: 'Il y a 2 jours', imageUrl: 'https://picsum.photos/seed/job2/200/200', metadata: { company: 'Digital Savoie', contractType: 'CDI' }, userId: 'p2', description: 'Agence digitale recherche chef de projet expérimenté.', status: 'published' },
    { id: 'l5', title: 'Studio meublé centre-ville', type: ListingType.Immobilier, price: '750 €/mois', date: 'Aujourd\'hui', imageUrl: 'https://picsum.photos/seed/immo2/200/200', metadata: { surface: '25m²', 'pièces': 1 }, userId: 'p4', description: 'Studio meublé disponible immédiatement, charges comprises.', status: 'published' },
    { id: 'l6', title: 'Kayak 2 places', type: ListingType.BonnesAffaires, price: '600 €', date: 'Hier', imageUrl: 'https://picsum.photos/seed/kayak1/200/200', metadata: { brand: 'Décathlon', state: 'Très bon' }, userId: 'p1', description: 'Kayak gonflable 2 places, peu utilisé, avec pagaies.', status: 'published' },
    { id: 'l7', title: 'Cours particuliers maths/physique', type: ListingType.Services, price: '30 €/h', date: 'Il y a 1 semaine', imageUrl: 'https://picsum.photos/seed/service1/200/200', metadata: { level: 'Lycée/Prépa' }, userId: 'p3', description: 'Professeur expérimenté propose cours particuliers tous niveaux.', status: 'published' },
    { id: 'l8', title: 'Maison T4 avec jardin', type: ListingType.Immobilier, price: '680 000 €', date: 'Il y a 4 jours', imageUrl: 'https://picsum.photos/seed/immo3/200/200', metadata: { surface: '110m²', 'pièces': 4 }, userId: 'p4', description: 'Belle maison avec jardin, garage, proche du lac.', status: 'published' },
    { id: 'l9', title: 'Skis + chaussures', type: ListingType.BonnesAffaires, price: '200 €', date: 'Il y a 2 jours', imageUrl: 'https://picsum.photos/seed/ski1/200/200', metadata: { brand: 'Rossignol', state: 'Bon' }, userId: 'p2', description: 'Skis paraboliques 170cm + chaussures taille 42.', status: 'published' },
    { id: 'l10', title: 'Garde d\'animaux', type: ListingType.Services, price: '20 €/jour', date: 'Il y a 5 jours', imageUrl: 'https://picsum.photos/seed/service2/200/200', metadata: { animals: 'Chiens, chats' }, userId: 'p1', description: 'Étudiante passionnée propose garde d\'animaux à domicile.', status: 'published' },
    { id: 'l11', title: 'Responsable boutique', type: ListingType.Emploi, price: '35k€ - 38k€', date: 'Il y a 1 semaine', imageUrl: 'https://picsum.photos/seed/job3/200/200', metadata: { company: 'Boutique Montagne', contractType: 'CDI' }, userId: 'p2', description: 'Boutique de sport recherche responsable pour gestion équipe.', status: 'published' },
    { id: 'l12', title: 'Canapé d\'angle cuir', type: ListingType.BonnesAffaires, price: '400 €', date: 'Il y a 3 jours', imageUrl: 'https://picsum.photos/seed/canape1/200/200', metadata: { state: 'Très bon' }, userId: 'p3', description: 'Canapé d\'angle en cuir noir, excellent état, cause déménagement.', status: 'published' },
];

export const MAGAZINE_ARTICLES: Article[] = [
  { 
    id: 'mag1', 
    imageUrl: 'https://picsum.photos/seed/mag1/800/600', 
    title: 'Les 5 plus beaux spots pour le coucher de soleil', 
    excerpt: 'Découvrez les lieux secrets d\'Annecy pour admirer des couchers de soleil à couper le souffle.', 
    authorId: 'p4', 
    publishedAt: '25 Mai 2024', 
    content: `<p>Annecy est surnommée la Venise des Alpes pour ses canaux, mais elle pourrait tout aussi bien être appelée la Cité des Lumières pour ses couchers de soleil spectaculaires. Voici notre sélection des 5 meilleurs endroits pour en prendre plein les yeux.</p><h3>1. Le Pont des Amours</h3><p>Un classique indémodable. La vue sur le canal du Vassé avec le lac en arrière-plan est tout simplement magique lorsque le soleil se couche.</p><h3>2. Le Crêt du Maure</h3><p>Accessible après une courte randonnée depuis Annecy-le-Vieux, ce point de vue offre une perspective panoramique sur toute la ville et le lac. Le spectacle est garanti.</p>`, 
    comments: [
      { id: 'comm1', authorId: 'p1', target_entity_id: 'mag1', content: 'Super article ! J\'ai testé le Crêt du Maure hier, c\'était incroyable.', createdAt: 'il y a 1 jour' }
    ], 
    status: 'published' 
  },
  { 
    id: 'mag2', 
    imageUrl: 'https://picsum.photos/seed/mag2/800/600', 
    title: 'Portrait : Pierre Gay, maître fromager', 
    excerpt: 'Rencontre avec un Meilleur Ouvrier de France qui perpétue la tradition fromagère savoyarde.', 
    authorId: 'p2', 
    publishedAt: '20 Mai 2024', 
    content: `<p>Dans sa fromagerie de la rue Carnot, Pierre Gay affine depuis plus de 30 ans les meilleurs fromages de Savoie.</p><h3>Une passion familiale</h3><p>Fils de fromager, Pierre a grandi au milieu des tommes et des reblochons. "Pour moi, c'était une évidence de reprendre l'affaire familiale", confie-t-il.</p><h3>L'excellence reconnue</h3><p>En 2015, il décroche le prestigieux titre de Meilleur Ouvrier de France. Une consécration qui n'a rien changé à sa philosophie : "Je continue à travailler comme mon père me l'a appris, avec passion et exigence."</p>`, 
    comments: [], 
    status: 'published' 
  },
  { 
    id: 'mag3', 
    imageUrl: 'https://picsum.photos/seed/mag3/800/600', 
    title: 'Les meilleures tables savoyardes d\'Annecy', 
    excerpt: 'Notre sélection des restaurants où déguster une authentique fondue ou raclette.', 
    authorId: 'p1', 
    publishedAt: '18 Mai 2024', 
    content: `<p>Fondue, raclette, tartiflette... Les spécialités savoyardes font la réputation gastronomique d'Annecy. Voici notre top 5 des meilleures adresses.</p><h3>1. Chez Pépé</h3><p>L'institution de la vieille ville. Ambiance chalet garantie et produits d'exception.</p><h3>2. Le Comptoir Savoyard</h3><p>Pour une expérience authentique dans un décor montagnard soigné.</p><h3>3. La Table de Marie</h3><p>L'accueil chaleureux de Marie et ses recettes familiales font la différence.</p>`, 
    comments: [], 
    status: 'published' 
  },
  { 
    id: 'mag4', 
    imageUrl: 'https://picsum.photos/seed/mag4/800/600', 
    title: 'Le Festival du Film d\'Animation fête ses 45 ans', 
    excerpt: 'Retour sur l\'histoire d\'un événement devenu incontournable dans le monde de l\'animation.', 
    authorId: 'p4', 
    publishedAt: '15 Mai 2024', 
    content: `<p>Depuis 1979, le Festival International du Film d'Animation d'Annecy attire les plus grands talents mondiaux.</p><h3>Un événement mondial</h3><p>Chaque année en juin, la ville se transforme en capitale mondiale de l'animation. Professionnels, artistes et grand public se donnent rendez-vous pour célébrer le 7ème art animé.</p><h3>Cette année : édition anniversaire</h3><p>Pour ses 45 ans, le festival prévoit une programmation exceptionnelle avec des avant-premières et des rétrospectives des plus grands studios.</p>`, 
    comments: [], 
    status: 'published' 
  },
  { 
    id: 'mag5', 
    imageUrl: 'https://picsum.photos/seed/mag5/800/600', 
    title: 'Randonnée : nos conseils pour débuter', 
    excerpt: 'Tout ce qu\'il faut savoir avant de partir sur les sentiers autour d\'Annecy.', 
    authorId: 'p2', 
    publishedAt: '12 Mai 2024', 
    content: `<p>Vous voulez vous lancer dans la randonnée autour d'Annecy ? Voici nos conseils pour bien débuter.</p><h3>Choisir le bon parcours</h3><p>Pour débuter, privilégiez des sentiers faciles comme le Roc de Chère ou l'Ermitage de Saint-Germain. Évitez les ascensions difficiles comme La Tournette.</p><h3>L'équipement essentiel</h3><p>De bonnes chaussures de randonnée sont indispensables. N'oubliez pas : eau, crème solaire, casquette et en-cas.</p><h3>Respecter la nature</h3><p>Restez sur les sentiers balisés et ramenez tous vos déchets.</p>`, 
    comments: [], 
    status: 'published' 
  },
  { 
    id: 'mag6', 
    imageUrl: 'https://picsum.photos/seed/mag6/800/600', 
    title: 'Le lac d\'Annecy : pourquoi est-il si pur ?', 
    excerpt: 'Les secrets du lac le plus pur d\'Europe révélés par un scientifique.', 
    authorId: 'p3', 
    publishedAt: '8 Mai 2024', 
    content: `<p>Le lac d'Annecy est régulièrement classé comme le lac le plus pur d'Europe. Mais pourquoi ?</p><h3>Une protection stricte</h3><p>Depuis les années 1960, des règles strictes protègent le lac : stations d'épuration performantes, interdiction de navigation à moteur pour les particuliers...</p><h3>Un écosystème préservé</h3><p>La végétation autour du lac filtre naturellement les eaux de ruissellement. Les zones humides jouent un rôle crucial.</p><h3>Une vigilance constante</h3><p>Des analyses régulières permettent de surveiller la qualité de l'eau et d'agir rapidement en cas de pollution.</p>`, 
    comments: [], 
    status: 'published' 
  },
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