-- ============================================================================
-- SCHÉMA COMPLET DE BASE DE DONNÉES - SALUT ANNECY
-- PostgreSQL Database Schema
-- ============================================================================
-- 
-- Ce fichier SQL contient le schéma complet de la base de données.
-- Il peut être utilisé pour créer manuellement la base de données ou comme référence.
-- 
-- Pour une utilisation avec Drizzle ORM, utilisez plutôt le fichier schema.ts
-- et générez les migrations avec drizzle-kit.
-- 
-- ============================================================================

-- Extensions PostgreSQL nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TYPES ÉNUMÉRÉS (ENUMS)
-- ============================================================================

CREATE TYPE content_status AS ENUM (
  'draft',
  'pending_review',
  'published',
  'scheduled',
  'archived',
  'rejected',
  'hidden'
);

CREATE TYPE claim_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE subscription_tier AS ENUM (
  'free',
  'pro',
  'premium'
);

CREATE TYPE listing_type AS ENUM (
  'Emploi',
  'Immobilier',
  'Bonnes Affaires',
  'Services'
);

CREATE TYPE trail_difficulty AS ENUM (
  'Facile',
  'Moyen',
  'Difficile',
  'Expert'
);

CREATE TYPE event_category AS ENUM (
  'Festival',
  'Concert',
  'Marché',
  'Sport',
  'Culture'
);

CREATE TYPE order_status AS ENUM (
  'processing',
  'completed',
  'cancelled'
);

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled'
);

CREATE TYPE live_event_type AS ENUM (
  'Promo',
  'Alerte',
  'Info',
  'Trafic',
  'Météo',
  'Affluence'
);

CREATE TYPE main_category AS ENUM (
  'restauration',
  'hebergement',
  'activites',
  'commerces'
);

CREATE TYPE price_range AS ENUM (
  '€',
  '€€',
  '€€€',
  '€€€€'
);

CREATE TYPE group_role AS ENUM (
  'owner',
  'admin',
  'member'
);

CREATE TYPE analytics_event_name AS ENUM (
  'view_place',
  'click_phone',
  'click_website'
);

-- ============================================================================
-- AUTHENTIFICATION & GESTION DES UTILISATEURS
-- ============================================================================

-- Niveaux de gamification des utilisateurs
CREATE TABLE user_levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  min_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Profils utilisateurs
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE, -- Référence vers Better-Auth
  username VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(200) NOT NULL,
  avatar_url TEXT,
  cover_image_url TEXT,
  bio TEXT,
  level_id INTEGER NOT NULL DEFAULT 1 REFERENCES user_levels(id),
  join_date TIMESTAMP NOT NULL DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Lieux favoris des utilisateurs
CREATE TABLE user_favorite_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  place_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- GESTION DE CONTENU - LIEUX
-- ============================================================================

-- Organisations/Entreprises (définie ici car référencée par places)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  primary_owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  siret VARCHAR(20),
  stripe_account_id VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Lieux (restaurants, hôtels, activités, commerces)
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL,
  rating REAL NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  main_category main_category NOT NULL,
  price_range price_range NOT NULL,
  attributes JSONB NOT NULL DEFAULT '[]',
  description TEXT NOT NULL,
  opening_hours JSONB NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  website TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  status content_status NOT NULL DEFAULT 'draft',
  rejection_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Avis sur les lieux
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- GESTION DE CONTENU - ÉVÉNEMENTS
-- ============================================================================

-- Événements locaux
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  date VARCHAR(100) NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category event_category NOT NULL,
  price VARCHAR(50),
  description TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  rejection_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP
);

-- ============================================================================
-- GESTION DE CONTENU - SENTIERS DE RANDONNÉE
-- ============================================================================

-- Sentiers de randonnée
CREATE TABLE trails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL,
  distance_km REAL NOT NULL,
  duration_min INTEGER NOT NULL,
  ascent_m INTEGER NOT NULL,
  difficulty trail_difficulty NOT NULL,
  excerpt TEXT NOT NULL,
  description TEXT NOT NULL,
  start_point_lat REAL NOT NULL,
  start_point_lng REAL NOT NULL,
  gpx_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  rejection_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP
);

-- ============================================================================
-- GESTION DE CONTENU - PETITES ANNONCES
-- ============================================================================

-- Petites annonces
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  type listing_type NOT NULL,
  price VARCHAR(50),
  date VARCHAR(100) NOT NULL,
  image_url TEXT,
  metadata JSONB,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  expires_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP
);

-- ============================================================================
-- GESTION DE CONTENU - ARTICLES
-- ============================================================================

-- Articles éditoriaux
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title VARCHAR(200) NOT NULL,
  excerpt TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  rejection_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Commentaires
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_entity_id UUID NOT NULL,
  target_entity_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- GESTION DE CONTENU - ÉVÉNEMENTS LIVE
-- ============================================================================

-- Événements live/éphémères
CREATE TABLE live_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type live_event_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  location TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Votes sur les événements live
CREATE TABLE live_event_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_event_id UUID NOT NULL REFERENCES live_events(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(live_event_id, profile_id)
);

-- ============================================================================
-- COMMUNAUTÉ - FORUMS
-- ============================================================================

-- Catégories de forum
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Fils de discussion
CREATE TABLE forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Messages de forum
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- COMMUNAUTÉ - GROUPES
-- ============================================================================

-- Groupes
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  banner_url TEXT,
  avatar_url TEXT,
  description TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Membres de groupe
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role group_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, profile_id)
);

-- ============================================================================
-- COMMUNAUTÉ - MESSAGERIE
-- ============================================================================

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Participants aux conversations
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(conversation_id, profile_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- FONCTIONNALITÉS PROFESSIONNELLES - RÉCLAMATIONS
-- ============================================================================

-- Réclamations de lieux
CREATE TABLE place_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status claim_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES profiles(id),
  rejection_reason TEXT
);

-- ============================================================================
-- FONCTIONNALITÉS PROFESSIONNELLES - PRODUITS & SERVICES
-- ============================================================================

-- Produits
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  base_price REAL NOT NULL,
  duration_minutes INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- FONCTIONNALITÉS PROFESSIONNELLES - COMMANDES & RÉSERVATIONS
-- ============================================================================

-- Commandes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price REAL NOT NULL,
  status order_status NOT NULL DEFAULT 'processing',
  ordered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP
);

-- Réservations
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name VARCHAR(200) NOT NULL,
  total_price REAL NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  booked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  booking_date VARCHAR(100) NOT NULL,
  confirmed_at TIMESTAMP,
  cancelled_at TIMESTAMP
);

-- ============================================================================
-- SYSTÈME - SIGNALEMENTS & ANALYTIQUES
-- ============================================================================

-- Signalements
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id UUID NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  reason VARCHAR(100) NOT NULL,
  comment TEXT,
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES profiles(id)
);

-- Événements analytiques
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_entity_id UUID NOT NULL,
  target_entity_type VARCHAR(50) NOT NULL,
  event_name analytics_event_name NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SYSTÈME - CONTENU STATIQUE
-- ============================================================================

-- Pages statiques (CMS)
CREATE TABLE static_page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SYSTÈME - CAMPAGNES PUBLICITAIRES
-- ============================================================================

-- Campagnes publicitaires
CREATE TABLE ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  budget REAL NOT NULL,
  spent REAL NOT NULL DEFAULT 0,
  target_entity_id UUID,
  target_entity_type VARCHAR(50),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEX POUR OPTIMISATION DES PERFORMANCES
-- ============================================================================

-- Index pour les lieux
CREATE INDEX idx_places_main_category ON places(main_category);
CREATE INDEX idx_places_status ON places(status);
CREATE INDEX idx_places_organization ON places(organization_id);
CREATE INDEX idx_places_coordinates ON places(latitude, longitude);

-- Index pour les événements
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(date);

-- Index pour les avis
CREATE INDEX idx_reviews_place ON reviews(place_id);
CREATE INDEX idx_reviews_profile ON reviews(profile_id);

-- Index pour les forums
CREATE INDEX idx_forum_threads_category ON forum_threads(category_id);
CREATE INDEX idx_forum_posts_thread ON forum_posts(thread_id);
CREATE INDEX idx_forum_posts_parent ON forum_posts(parent_post_id);

-- Index pour les analytiques
CREATE INDEX idx_analytics_target ON analytics_events(target_entity_id, target_entity_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
CREATE INDEX idx_analytics_event_name ON analytics_events(event_name);

-- Index pour la messagerie
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- Index pour le commerce
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_organization ON orders(organization_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_organization ON bookings(organization_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Index pour les commentaires
CREATE INDEX idx_comments_target ON comments(target_entity_id, target_entity_type);
CREATE INDEX idx_comments_author ON comments(author_id);

-- Index pour les événements live
CREATE INDEX idx_live_events_expires ON live_events(expires_at);
CREATE INDEX idx_live_events_type ON live_events(type);

-- Index pour les groupes
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_profile ON group_members(profile_id);

-- Index pour les profils
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_level ON profiles(level_id);

-- ============================================================================
-- DONNÉES INITIALES
-- ============================================================================

-- Niveaux d'utilisateur par défaut
INSERT INTO user_levels (name, min_points) VALUES
  ('Nouveau venu', 0),
  ('Contributeur', 50),
  ('Expert Local', 250);

-- Pages statiques par défaut
INSERT INTO static_page_content (slug, title, content) VALUES
  ('qui-sommes-nous', 'Qui sommes-nous ?', '<h2>Notre Mission</h2><p>Nous sommes une équipe de passionnés d''Annecy déterminés à créer le guide le plus complet et le plus utile pour tous les amoureux de notre région.</p>'),
  ('cgu', 'Conditions Générales d''Utilisation', '<p>En utilisant ce site, vous acceptez nos conditions d''utilisation...</p>'),
  ('faq', 'Foire Aux Questions', '<h3>Comment puis-je proposer un lieu ?</h3><p>Vous devez être connecté, puis cliquer sur le bouton "Proposer un contenu" dans le menu principal.</p>'),
  ('contact', 'Contact', '<p>Pour toute question, veuillez nous contacter à l''adresse contact@salut-annecy.fr</p>');

-- Catégories de forum par défaut
INSERT INTO forum_categories (title, description, icon) VALUES
  ('Restaurants & Gastronomie', 'Discutez des meilleures adresses culinaires', 'utensils'),
  ('Hébergement & Hôtellerie', 'Partagez vos expériences d''hébergement', 'hotel'),
  ('Activités & Loisirs', 'Trouvez des activités et partagez vos aventures', 'skiing'),
  ('Vie Locale & Pratique', 'Informations pratiques et vie quotidienne', 'info-circle');

-- ============================================================================
-- COMMENTAIRES & NOTES
-- ============================================================================

-- Ce schéma est complet et comprend TOUTES les entités du système.
-- Il est optimisé pour PostgreSQL et prêt pour la production.
-- 
-- Pour déployer:
-- 1. Créer une base de données PostgreSQL
-- 2. Exécuter ce script SQL
-- 3. Configurer les variables d'environnement (DATABASE_URL)
-- 4. Intégrer avec Drizzle ORM et Better-Auth
-- 
-- Version: 1.0.0
-- Dernière mise à jour: 2024
