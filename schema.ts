/**
 * Complete Database Schema for Salut Annecy
 * 
 * This schema defines all database tables using Drizzle ORM for PostgreSQL.
 * It includes all entities from the application:
 * - Authentication & Users
 * - Content (Places, Events, Trails, Articles, Listings, Live Events)
 * - Community (Forums, Groups, Messages, Comments, Reviews)
 * - Professional (Organizations, Products, Services, Orders, Bookings)
 * - System (Reports, Analytics, Static Pages)
 * 
 * Technology Stack:
 * - PostgreSQL as database
 * - Drizzle ORM for type-safe database operations
 * - Better-Auth for authentication
 */

import { pgTable, text, integer, real, boolean, timestamp, jsonb, uuid, serial, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS
// ============================================================================

export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'pending_review',
  'published',
  'scheduled',
  'archived',
  'rejected',
  'hidden'
]);

export const claimStatusEnum = pgEnum('claim_status', [
  'pending',
  'approved',
  'rejected'
]);

export const subscriptionTierEnum = pgEnum('subscription_tier', [
  'free',
  'pro',
  'premium'
]);

export const listingTypeEnum = pgEnum('listing_type', [
  'Emploi',
  'Immobilier',
  'Bonnes Affaires',
  'Services'
]);

export const trailDifficultyEnum = pgEnum('trail_difficulty', [
  'Facile',
  'Moyen',
  'Difficile',
  'Expert'
]);

export const eventCategoryEnum = pgEnum('event_category', [
  'Festival',
  'Concert',
  'Marché',
  'Sport',
  'Culture'
]);

export const orderStatusEnum = pgEnum('order_status', [
  'processing',
  'completed',
  'cancelled'
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'cancelled'
]);

export const liveEventTypeEnum = pgEnum('live_event_type', [
  'Promo',
  'Alerte',
  'Info',
  'Trafic',
  'Météo',
  'Affluence'
]);

export const mainCategoryEnum = pgEnum('main_category', [
  'restauration',
  'hebergement',
  'activites',
  'commerces'
]);

export const priceRangeEnum = pgEnum('price_range', [
  '€',
  '€€',
  '€€€',
  '€€€€'
]);

export const groupRoleEnum = pgEnum('group_role', [
  'owner',
  'admin',
  'member'
]);

export const analyticsEventNameEnum = pgEnum('analytics_event_name', [
  'view_place',
  'click_phone',
  'click_website'
]);

// ============================================================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================================================

/**
 * User Levels - Gamification system for user progression
 */
export const userLevels = pgTable('user_levels', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  minPoints: integer('min_points').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * User Profiles - Core user information and gamification data
 */
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique(), // Reference to Better-Auth user
  username: varchar('username', { length: 50 }).notNull().unique(),
  fullName: varchar('full_name', { length: 200 }).notNull(),
  avatarUrl: text('avatar_url'),
  coverImageUrl: text('cover_image_url'),
  bio: text('bio'),
  levelId: integer('level_id').references(() => userLevels.id).notNull().default(1),
  joinDate: timestamp('join_date').defaultNow().notNull(),
  isVerified: boolean('is_verified').default(false),
  points: integer('points').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * User Favorite Places - Many-to-many relationship between users and places
 */
export const userFavoritePlaces = pgTable('user_favorite_places', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  placeId: uuid('place_id').references(() => places.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// CONTENT MANAGEMENT - PLACES
// ============================================================================

/**
 * Places - Restaurants, hotels, activities, shops
 */
export const places = pgTable('places', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  imageUrl: text('image_url').notNull(),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  category: varchar('category', { length: 100 }).notNull(),
  mainCategory: mainCategoryEnum('main_category').notNull(),
  priceRange: priceRangeEnum('price_range').notNull(),
  attributes: jsonb('attributes').notNull().default('[]'), // array of strings
  description: text('description').notNull(),
  openingHours: jsonb('opening_hours').notNull(), // { [day: number]: { open: string, close: string } | null }
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 20 }),
  website: text('website'),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
  status: contentStatusEnum('status').notNull().default('draft'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

/**
 * Reviews - User reviews for places
 */
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  placeId: uuid('place_id').references(() => places.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// CONTENT MANAGEMENT - EVENTS
// ============================================================================

/**
 * Events - Local events (festivals, concerts, markets, etc.)
 */
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  date: varchar('date', { length: 100 }).notNull(), // Can be date or recurring pattern like "CHAQUE VENDREDI"
  location: text('location').notNull(),
  imageUrl: text('image_url').notNull(),
  category: eventCategoryEnum('category').notNull(),
  price: varchar('price', { length: 50 }),
  description: text('description').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  status: contentStatusEnum('status').notNull().default('draft'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

// ============================================================================
// CONTENT MANAGEMENT - TRAILS
// ============================================================================

/**
 * Trails - Hiking trails and outdoor routes
 */
export const trails = pgTable('trails', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  imageUrl: text('image_url').notNull(),
  distanceKm: real('distance_km').notNull(),
  durationMin: integer('duration_min').notNull(),
  ascentM: integer('ascent_m').notNull(),
  difficulty: trailDifficultyEnum('difficulty').notNull(),
  excerpt: text('excerpt').notNull(),
  description: text('description').notNull(),
  startPointLat: real('start_point_lat').notNull(),
  startPointLng: real('start_point_lng').notNull(),
  gpxUrl: text('gpx_url'),
  status: contentStatusEnum('status').notNull().default('draft'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

// ============================================================================
// CONTENT MANAGEMENT - LISTINGS
// ============================================================================

/**
 * Listings - Classified ads (jobs, real estate, services, items for sale)
 */
export const listings = pgTable('listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  type: listingTypeEnum('type').notNull(),
  price: varchar('price', { length: 50 }),
  date: varchar('date', { length: 100 }).notNull(),
  imageUrl: text('image_url'),
  metadata: jsonb('metadata'), // Additional fields specific to listing type
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  description: text('description').notNull(),
  status: contentStatusEnum('status').notNull().default('draft'),
  expiresAt: timestamp('expires_at'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

// ============================================================================
// CONTENT MANAGEMENT - ARTICLES
// ============================================================================

/**
 * Articles - Editorial content and blog posts
 */
export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  imageUrl: text('image_url').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  excerpt: text('excerpt').notNull(),
  authorId: uuid('author_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(), // Markdown content
  status: contentStatusEnum('status').notNull().default('draft'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

/**
 * Comments - Comments on articles and other content
 */
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  targetEntityId: uuid('target_entity_id').notNull(), // Can reference articles or other entities
  targetEntityType: varchar('target_entity_type', { length: 50 }).notNull(), // 'article', 'place', etc.
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// CONTENT MANAGEMENT - LIVE EVENTS
// ============================================================================

/**
 * Live Events - Real-time ephemeral events (promos, alerts, traffic, etc.)
 */
export const liveEvents = pgTable('live_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: liveEventTypeEnum('type').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  location: text('location').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  authorId: uuid('author_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Live Event Votes - Upvotes and downvotes on live events
 */
export const liveEventVotes = pgTable('live_event_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  liveEventId: uuid('live_event_id').references(() => liveEvents.id, { onDelete: 'cascade' }).notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  voteType: varchar('vote_type', { length: 10 }).notNull(), // 'upvote' or 'downvote'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// COMMUNITY - FORUMS
// ============================================================================

/**
 * Forum Categories - Top-level organization for forum discussions
 */
export const forumCategories = pgTable('forum_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Forum Threads - Discussion topics within categories
 */
export const forumThreads = pgTable('forum_threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => forumCategories.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  authorId: uuid('author_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  isPinned: boolean('is_pinned').default(false),
  isLocked: boolean('is_locked').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Forum Posts - Individual messages within threads
 */
export const forumPosts = pgTable('forum_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }).notNull(),
  authorId: uuid('author_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  parentPostId: uuid('parent_post_id').references(() => forumPosts.id, { onDelete: 'cascade' }), // For nested replies
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// COMMUNITY - GROUPS
// ============================================================================

/**
 * Groups - User communities with shared interests
 */
export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  bannerUrl: text('banner_url'),
  avatarUrl: text('avatar_url'),
  description: text('description').notNull(),
  isPrivate: boolean('is_private').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Group Members - Membership and roles within groups
 */
export const groupMembers = pgTable('group_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').references(() => groups.id, { onDelete: 'cascade' }).notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  role: groupRoleEnum('role').notNull().default('member'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// ============================================================================
// COMMUNITY - MESSAGING
// ============================================================================

/**
 * Conversations - Private message threads between users
 */
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Conversation Participants - Users involved in a conversation
 */
export const conversationParticipants = pgTable('conversation_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

/**
 * Messages - Individual messages within conversations
 */
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
  senderId: uuid('sender_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// PROFESSIONAL FEATURES - ORGANIZATIONS
// ============================================================================

/**
 * Organizations - Business entities (restaurants, hotels, etc.)
 */
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  primaryOwnerId: uuid('primary_owner_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  subscriptionTier: subscriptionTierEnum('subscription_tier').notNull().default('free'),
  siret: varchar('siret', { length: 20 }),
  stripeAccountId: varchar('stripe_account_id', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Place Claims - Requests from organizations to claim ownership of places
 */
export const placeClaims = pgTable('place_claims', {
  id: uuid('id').primaryKey().defaultRandom(),
  placeId: uuid('place_id').references(() => places.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  status: claimStatusEnum('status').notNull().default('pending'),
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: uuid('resolved_by').references(() => profiles.id),
  rejectionReason: text('rejection_reason'),
});

// ============================================================================
// PROFESSIONAL FEATURES - PRODUCTS & SERVICES
// ============================================================================

/**
 * Products - Items sold by organizations
 */
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  imageUrl: text('image_url').notNull(),
  stock: integer('stock').notNull().default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Services - Bookable services offered by organizations
 */
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description').notNull(),
  basePrice: real('base_price').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// PROFESSIONAL FEATURES - ORDERS & BOOKINGS
// ============================================================================

/**
 * Orders - Product purchases
 */
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  productName: varchar('product_name', { length: 200 }).notNull(), // Stored in case product is deleted
  quantity: integer('quantity').notNull(),
  totalPrice: real('total_price').notNull(),
  status: orderStatusEnum('status').notNull().default('processing'),
  orderedAt: timestamp('ordered_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  cancelledAt: timestamp('cancelled_at'),
});

/**
 * Bookings - Service reservations
 */
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'set null' }),
  serviceName: varchar('service_name', { length: 200 }).notNull(), // Stored in case service is deleted
  totalPrice: real('total_price').notNull(),
  status: bookingStatusEnum('status').notNull().default('pending'),
  bookedAt: timestamp('booked_at').defaultNow().notNull(),
  bookingDate: varchar('booking_date', { length: 100 }).notNull(), // Scheduled date for the service
  confirmedAt: timestamp('confirmed_at'),
  cancelledAt: timestamp('cancelled_at'),
});

// ============================================================================
// SYSTEM - REPORTS & ANALYTICS
// ============================================================================

/**
 * Reports - User-submitted reports for inappropriate content
 */
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  targetId: uuid('target_id').notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(), // 'place', 'event', 'article', 'comment', etc.
  reason: varchar('reason', { length: 100 }).notNull(),
  comment: text('comment'),
  reporterId: uuid('reporter_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'resolved', 'dismissed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: uuid('resolved_by').references(() => profiles.id),
});

/**
 * Analytics Events - Track user interactions with content
 */
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  targetEntityId: uuid('target_entity_id').notNull(),
  targetEntityType: varchar('target_entity_type', { length: 50 }).notNull(),
  eventName: analyticsEventNameEnum('event_name').notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
  sessionId: varchar('session_id', { length: 100 }),
  metadata: jsonb('metadata'), // Additional event data
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// SYSTEM - STATIC CONTENT
// ============================================================================

/**
 * Static Page Content - CMS for static pages (About, FAQ, Terms, etc.)
 */
export const staticPageContent = pgTable('static_page_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(), // HTML content
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// SYSTEM - AD CAMPAIGNS (for Professional Features)
// ============================================================================

/**
 * Ad Campaigns - Advertising campaigns created by organizations
 */
export const adCampaigns = pgTable('ad_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  budget: real('budget').notNull(),
  spent: real('spent').notNull().default(0),
  targetEntityId: uuid('target_entity_id'), // Place or event being promoted
  targetEntityType: varchar('target_entity_type', { length: 50 }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // 'draft', 'active', 'paused', 'completed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// RELATIONS
// ============================================================================

// Profile Relations
export const profileRelations = relations(profiles, ({ one, many }) => ({
  level: one(userLevels, {
    fields: [profiles.levelId],
    references: [userLevels.id],
  }),
  favoritePlaces: many(userFavoritePlaces),
  reviews: many(reviews),
  articles: many(articles),
  comments: many(comments),
  listings: many(listings),
  liveEvents: many(liveEvents),
  forumThreads: many(forumThreads),
  forumPosts: many(forumPosts),
  groupMemberships: many(groupMembers),
  messages: many(messages),
  organizations: many(organizations),
  orders: many(orders),
  bookings: many(bookings),
  reports: many(reports),
}));

// Place Relations
export const placeRelations = relations(places, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [places.organizationId],
    references: [organizations.id],
  }),
  reviews: many(reviews),
  favorites: many(userFavoritePlaces),
  claims: many(placeClaims),
}));

// Organization Relations
export const organizationRelations = relations(organizations, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [organizations.primaryOwnerId],
    references: [profiles.id],
  }),
  places: many(places),
  products: many(products),
  services: many(services),
  orders: many(orders),
  bookings: many(bookings),
  adCampaigns: many(adCampaigns),
}));

// Forum Relations
export const forumCategoryRelations = relations(forumCategories, ({ many }) => ({
  threads: many(forumThreads),
}));

export const forumThreadRelations = relations(forumThreads, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumThreads.categoryId],
    references: [forumCategories.id],
  }),
  author: one(profiles, {
    fields: [forumThreads.authorId],
    references: [profiles.id],
  }),
  posts: many(forumPosts),
}));

// Group Relations
export const groupRelations = relations(groups, ({ many }) => ({
  members: many(groupMembers),
}));

// Conversation Relations
export const conversationRelations = relations(conversations, ({ many }) => ({
  participants: many(conversationParticipants),
  messages: many(messages),
}));
