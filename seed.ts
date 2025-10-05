import * as schema from './schema';
import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import {
  USER_LEVELS,
  PROFILES,
  ORGANIZATIONS,
  PLACES,
  EVENTS,
  TRAILS,
  ALL_LISTINGS,
  MAGAZINE_ARTICLES,
  FORUM_CATEGORIES,
  FORUM_THREADS,
  GROUPS,
  CONVERSATIONS,
  PRODUCTS,
  SERVICES,
  ORDERS,
  BOOKINGS,
  CLAIMS,
  REPORTS,
  LIVE_EVENTS,
  STATIC_PAGES_CONTENT,
  ANALYTICS_EVENTS,
} from './constants.tsx';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Insert user levels first
  console.log('📊 Seeding user levels...');
  await db.insert(schema.userLevels).values(USER_LEVELS);

  // 2. Create Better-Auth users and profiles
  console.log('👤 Seeding users and profiles...');
  for (const profile of PROFILES) {
    // Create Better-Auth user
    const userId = crypto.randomUUID();
    await db.insert(schema.user).values({
      id: userId,
      name: profile.full_name,
      email: `${profile.username}@example.com`,
      emailVerified: true,
      image: profile.avatar_url,
      createdAt: new Date(profile.join_date),
      updatedAt: new Date(),
    });

    // Create profile linked to Better-Auth user
    await db.insert(schema.profiles).values({
      id: profile.id,
      userId: userId,
      username: profile.username,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      coverImageUrl: profile.cover_image_url,
      bio: profile.bio,
      levelId: profile.level_id,
      joinDate: new Date(profile.join_date),
      isVerified: profile.is_verified,
      points: profile.points,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log('🏢 Seeding organizations...');
  console.log('🏢 Seeding organizations...');
  await db.insert(schema.organizations).values(
    ORGANIZATIONS.map(org => ({
      id: org.id,
      name: org.name,
      primaryOwnerId: org.primary_owner_id,
      subscriptionTier: org.subscription_tier,
      siret: org.siret,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  
  console.log('📍 Seeding places...');
  console.log('📍 Seeding places...');
  await db.insert(schema.places).values(
    PLACES.map(place => ({
      id: place.id,
      name: place.name,
      imageUrl: place.imageUrl,
      rating: place.rating,
      reviewCount: place.reviewCount,
      category: place.category,
      mainCategory: place.mainCategory,
      priceRange: place.priceRange,
      attributes: JSON.stringify(place.attributes),
      description: place.description,
      openingHours: JSON.stringify(place.openingHours),
      latitude: place.coordinates.lat,
      longitude: place.coordinates.lng,
      address: place.address,
      phone: place.phone,
      website: place.website,
      organizationId: place.organization_id,
      status: place.status,
      rejectionReason: place.rejection_reason,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  
  console.log('🎉 Seeding events...');
  console.log('🎉 Seeding events...');
  await db.insert(schema.events).values(
    EVENTS.map(ev => ({
      id: ev.id,
      title: ev.title,
      date: ev.date,
      location: ev.location,
      imageUrl: ev.imageUrl,
      category: ev.category,
      price: ev.price,
      description: ev.description,
      latitude: ev.coordinates.lat,
      longitude: ev.coordinates.lng,
      status: ev.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  
  console.log('🥾 Seeding trails...');
  console.log('🥾 Seeding trails...');
  await db.insert(schema.trails).values(
    TRAILS.map(trail => ({
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  
  console.log('📋 Seeding listings...');
  await db.insert(schema.listings).values(ALL_LISTINGS);
  
  console.log('📰 Seeding articles...');
  console.log('📰 Seeding articles...');
  await db.insert(schema.articles).values(
    MAGAZINE_ARTICLES.map(article => ({
      id: article.id,
      imageUrl: article.imageUrl,
      title: article.title,
      excerpt: article.excerpt,
      authorId: article.authorId,
      content: article.content,
      status: article.status,
      publishedAt: new Date('2024-05-25'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  
  console.log('💬 Seeding forum data...');
  console.log('💬 Seeding forum data...');
  await db.insert(schema.forumCategories).values(FORUM_CATEGORIES);
  await db.insert(schema.forumThreads).values(
    FORUM_THREADS.map(thread => ({
      id: thread.id,
      categoryId: thread.categoryId,
      title: thread.title,
      authorId: thread.authorId,
      isPinned: false,
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  
  console.log('👥 Seeding groups and conversations...');
  await db.insert(schema.groups).values(GROUPS);
  await db.insert(schema.conversations).values(CONVERSATIONS);
  
  console.log('🛍️ Seeding products and services...');
  console.log('🛍️ Seeding products and services...');
  await db.insert(schema.products).values(
    PRODUCTS.map(prod => ({
      id: prod.id,
      organizationId: prod.organization_id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      imageUrl: prod.imageUrl,
      stock: prod.stock,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  await db.insert(schema.services).values(
    SERVICES.map(serv => ({
      id: serv.id,
      organizationId: serv.organization_id,
      name: serv.name,
      description: serv.description,
      basePrice: serv.base_price,
      durationMinutes: serv.duration_minutes,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  
  console.log('📦 Seeding orders and bookings...');
  console.log('📦 Seeding orders and bookings...');
  await db.insert(schema.orders).values(
    ORDERS.map(order => ({
      id: order.id,
      customerId: order.customer_id,
      organizationId: order.organization_id,
      productId: order.product_id,
      productName: order.product_name,
      quantity: order.quantity,
      totalPrice: order.total_price,
      status: order.status,
      orderedAt: new Date(order.ordered_at),
    }))
  );
  await db.insert(schema.bookings).values(
    BOOKINGS.map(booking => ({
      id: booking.id,
      customerId: booking.customer_id,
      organizationId: booking.organization_id,
      serviceId: booking.service_id,
      serviceName: booking.service_name,
      totalPrice: booking.total_price,
      status: booking.status,
      bookedAt: new Date(booking.booked_at),
      bookingDate: booking.booking_date,
    }))
  );
  
  console.log('📊 Seeding claims, reports, and live events...');
  console.log('📊 Seeding claims, reports, and live events...');
  await db.insert(schema.placeClaims).values(CLAIMS);
  await db.insert(schema.reports).values(REPORTS);
  await db.insert(schema.liveEvents).values(
    LIVE_EVENTS.map(ev => ({
      id: ev.id,
      type: ev.type,
      title: ev.title,
      location: ev.location,
      latitude: ev.coordinates.lat,
      longitude: ev.coordinates.lng,
      authorId: ev.authorId,
      expiresAt: new Date(ev.expiresAt),
      createdAt: new Date(ev.createdAt),
    }))
  );
  
  console.log('📄 Seeding static pages and analytics...');
  console.log('📄 Seeding static pages and analytics...');
  await db.insert(schema.staticPageContent).values(STATIC_PAGES_CONTENT);
  await db.insert(schema.analyticsEvents).values(
    ANALYTICS_EVENTS.map(ev => ({
      targetEntityId: ev.target_entity_id,
      targetEntityType: 'place',
      eventName: ev.event_name,
      createdAt: new Date(),
    }))
  );

  console.log('✅ Seed completed successfully!');
}

main().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
