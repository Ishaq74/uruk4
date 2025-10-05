
export interface ContentCard {
  id: string;
  imageUrl: string;
  title: string;
  type: string;
  navPage: string;
  navId: string;
}

export type ContentStatus = 'draft' | 'pending_review' | 'published' | 'scheduled' | 'archived' | 'rejected' | 'hidden';
export type ClaimStatus = 'pending' | 'approved' | 'rejected';
export type SubscriptionTier = 'free' | 'pro' | 'premium';

export enum ListingType {
    Emploi = 'Emploi',
    Immobilier = 'Immobilier',
    BonnesAffaires = 'Bonnes Affaires',
    Services = 'Services',
}

export enum TrailDifficulty {
    Easy = 'Facile',
    Medium = 'Moyen',
    Hard = 'Difficile',
    Expert = 'Expert',
}

export type EventCategory = 'Festival' | 'Concert' | 'Marché' | 'Sport' | 'Culture';
export type OrderStatus = 'processing' | 'completed' | 'cancelled';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export enum LiveEventType {
    Promo = 'Promo',
    Alerte = 'Alerte',
    Info = 'Info',
    Trafic = 'Trafic',
    Meteo = 'Météo',
    Affluence = 'Affluence',
}

export interface LiveEvent {
    id: string;
    type: LiveEventType;
    title: string;
    location: string;
    coordinates: Coordinates;
    authorId: string;
    createdAt: string; // ISO string for sorting
    expiresAt: string; // ISO string for automatic removal
    upvotes: string[]; // array of userIds
    downvotes: string[]; // array of userIds
}


export interface UserLevel {
    id: number;
    name: string;
    min_points: number;
}

export interface Profile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  coverImageUrl: string;
  bio: string;
  levelId: number;
  joinDate: string;
  isVerified?: boolean;
  points: number;
  favoritePlaceIds?: string[];
}

export interface Category {
  name: string;
  icon: { name: string; className: string };
  target: string;
}

export interface Review {
  id: string;
  profileId: string;
  placeId: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Comment {
    id: string;
    authorId: string;
    target_entity_id: string;
    content: string;
    createdAt: string;
}

export type DayHours = { open: string; close: string; } | null;
export type OpeningHours = { [key: number]: DayHours; };
export type Coordinates = { lat: number; lng: number; };

export interface Place {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  category: string;
  mainCategory: 'restauration' | 'hebergement' | 'activites' | 'commerces';
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  attributes: string[];
  description: string;
  reviews: Review[];
  openingHours: OpeningHours;
  coordinates: Coordinates;
  address: string;
  phone: string;
  website: string;
  organization_id?: string;
  status: ContentStatus;
  rejection_reason?: string;
}

export interface Event {
  id: string;
  date: string;
  title: string;
  location: string;
  imageUrl: string;
  category: EventCategory;
  price?: string;
  description: string;
  coordinates: Coordinates;
  status: ContentStatus;
  rejection_reason?: string;
}

export interface Trail {
    id: string;
    name: string;
    imageUrl: string;
    distanceKm: number;
    durationMin: number;
    ascentM: number;
    difficulty: TrailDifficulty;
    excerpt: string;
    description: string;
    startPoint: Coordinates;
    gpxUrl?: string;
    status: ContentStatus;
    rejection_reason?: string;
}

export interface Listing {
  id: string;
  title: string;
  type: ListingType;
  price?: string;
  date: string;
  imageUrl?: string;
  metadata?: { [key: string]: any };
  userId: string;
  description: string;
  status: ContentStatus;
  expires_at?: string;
  rejection_reason?: string;
}

export interface Article {
  id:string;
  imageUrl: string;
  title: string;
  excerpt: string;
  authorId: string;
  publishedAt: string;
  content: string;
  comments: Comment[];
  status: ContentStatus;
  rejection_reason?: string;
}

// Community Types
export interface ForumPost {
    id: string;
    threadId: string;
    authorId: string;
    content: string;
    createdAt: string;
    parentPostId?: string;
}

export interface ForumThread {
    id: string;
    categoryId: string;
    title: string;
    authorId: string;
    createdAt: string;
    posts: ForumPost[];
}

export interface ForumCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface Group {
    id: string;
    name: string;
    bannerUrl: string;
    avatarUrl: string;
    description: string;
    memberCount: number;
    isPrivate: boolean;
    members: { profileId: string, role: 'owner' | 'admin' | 'member' }[];
    isMember?: boolean;
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
}

export interface Conversation {
    id: string;
    participantIds: string[];
    messages: Message[];
}

// Pro & System Types
export interface Organization {
    id: string;
    name: string;
    primary_owner_id: string;
    subscription_tier: SubscriptionTier;
    siret?: string;
    stripe_account_id?: string;
    place_ids: string[];
}

export interface PlaceClaim {
    id: string;
    placeId: string;
    organizationId: string;
    userId: string;
    status: ClaimStatus;
}

export interface Product {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface Service {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  base_price: number;
  duration_minutes: number;
}

export interface Order {
  id: string;
  customer_id: string;
  organization_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  ordered_at: string;
}

export interface Booking {
    id: string;
    customer_id: string;
    organization_id: string;
    service_id: string;
    service_name: string;
    total_price: number;
    status: BookingStatus;
    booked_at: string;
    booking_date: string;
}

export interface Report {
    id: string;
    targetId: string;
    targetType: string;
    reason: string;
    comment: string;
    reporterId: string;
}

export interface StaticPageContent {
    slug: string;
    title: string;
    content: string;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface AnalyticsEvent {
    target_entity_id: string;
    event_name: 'view_place' | 'click_phone' | 'click_website';
    count: number;
}
