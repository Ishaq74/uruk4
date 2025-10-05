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
} from './seed-data';

async function main() {
  console.log('🌱 Starting database seed...');

  // Suppression des données existantes pour éviter les doublons
  // Suppression dans l'ordre des dépendances pour éviter les violations de clé étrangère
  await db.delete(schema.profiles);
  await db.delete(schema.user);
  await db.delete(schema.organizations);
  await db.delete(schema.places);
  await db.delete(schema.articles);
  await db.delete(schema.forumThreads);
  await db.delete(schema.liveEvents);
  await db.delete(schema.orders);
  await db.delete(schema.bookings);
  await db.delete(schema.placeClaims);
  await db.delete(schema.reports);
  await db.delete(schema.analyticsEvents);
  await db.delete(schema.userLevels);

  // 1. Insert user levels first
  console.log('📊 Seeding user levels...');
  await db.insert(schema.userLevels).values(USER_LEVELS);

  // 2. Create Better-Auth users and profiles
  console.log('👤 Seeding users and profiles...');
  // Génère un UUID pour chaque profil et mappe l'ancien id vers le nouvel UUID
  const profileIdMap: Record<string, string> = {};
  for (const profile of PROFILES) {
    const newProfileId = uuidv4();
    profileIdMap[profile.id] = newProfileId;
    // Create Better-Auth user
    const userId = uuidv4();
    await db.insert(schema.user).values({
      id: userId,
      name: profile.fullName,
      email: `${profile.username}@example.com`,
      emailVerified: true,
      image: profile.avatarUrl,
      role: (profile as any).role || 'user',
      createdAt: isValidDate(profile.joinDate) ? new Date(profile.joinDate) : new Date(),
      updatedAt: new Date(),
    });
    // Create profile linked to Better-Auth user
    await db.insert(schema.profiles).values({
      id: newProfileId,
      userId: userId,
      username: profile.username,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
      coverImageUrl: profile.coverImageUrl,
      bio: profile.bio,
      levelId: profile.levelId,
      joinDate: isValidDate(profile.joinDate) ? new Date(profile.joinDate) : new Date(),
      isVerified: profile.isVerified ?? false,
      points: profile.points,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  console.log('\n⚠️  ADMIN SETUP REQUIRED:');
  console.log('📝 To create an admin user, please:');
  console.log('   1. Register via the UI at http://localhost:3000');
  console.log('   2. Then run: UPDATE "user" SET role = \'admin\' WHERE email = \'your-email@example.com\';');
  console.log('   OR see ADMIN_ACCOUNT_SETUP.md for detailed instructions\n');

  // Patch toutes les entités qui référencent un profil
  // Organizations
  const orgIdMap: Record<string, string> = {};
  for (const org of ORGANIZATIONS) {
    const newOrgId = uuidv4();
    orgIdMap[org.id] = newOrgId;
    await db.insert(schema.organizations).values({
      id: newOrgId,
      name: org.name,
      primaryOwnerId: profileIdMap[org.primary_owner_id],
      subscriptionTier: org.subscription_tier,
      siret: org.siret,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Places
  const placeIdMap: Record<string, string> = {};
  for (const place of PLACES) {
    const newPlaceId = uuidv4();
    placeIdMap[place.id] = newPlaceId;
    await db.insert(schema.places).values({
      id: newPlaceId,
      slug: place.slug,
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
      organizationId: orgIdMap[place.organization_id],
      status: place.status,
      rejectionReason: place.rejection_reason,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Events
  const eventIdMap: Record<string, string> = {};
  for (const ev of EVENTS) {
    const newEventId = uuidv4();
    eventIdMap[ev.id] = newEventId;
    await db.insert(schema.events).values({
      id: newEventId,
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
      publishedAt: new Date(),
    });
  }

  // Trails
  const trailIdMap: Record<string, string> = {};
  await db.insert(schema.trails).values(
    TRAILS.map(trail => {
      const newTrailId = uuidv4();
      trailIdMap[trail.id] = newTrailId;
      return {
        id: newTrailId,
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
      };
    })
  );

  console.log('📋 Seeding listings...');
  const listingIdMap: Record<string, string> = {};
  await db.insert(schema.listings).values(
    ALL_LISTINGS.map(listing => {
      const newListingId = uuidv4();
      listingIdMap[listing.id] = newListingId;
      return {
        ...listing,
        id: newListingId,
        userId: profileIdMap[listing.userId],
      };
    })
  );

  console.log('📰 Seeding articles...');
  const articleIdMap: Record<string, string> = {};
  for (const article of MAGAZINE_ARTICLES) {
    const newArticleId = uuidv4();
    articleIdMap[article.id] = newArticleId;
    await db.insert(schema.articles).values({
      id: newArticleId,
      imageUrl: article.imageUrl,
      title: article.title,
      excerpt: article.excerpt,
      authorId: profileIdMap[article.authorId],
      content: article.content,
      status: article.status,
      publishedAt: new Date('2024-05-25'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log('💬 Seeding forum data...');
  const forumCategoryIdMap: Record<string, string> = {};
  await db.insert(schema.forumCategories).values(
    FORUM_CATEGORIES.map(cat => {
      const newCatId = uuidv4();
      forumCategoryIdMap[cat.id] = newCatId;
      return {
        ...cat,
        id: newCatId,
      };
    })
  );
  const threadIdMap: Record<string, string> = {};
  for (const thread of FORUM_THREADS) {
    const newThreadId = uuidv4();
    threadIdMap[thread.id] = newThreadId;
    await db.insert(schema.forumThreads).values({
      id: newThreadId,
      categoryId: forumCategoryIdMap[thread.categoryId],
      title: thread.title,
      authorId: profileIdMap[thread.authorId],
      isPinned: false,
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log('👥 Seeding groups and conversations...');
  const groupIdMap: Record<string, string> = {};
  await db.insert(schema.groups).values(
    GROUPS.map(group => {
      const newGroupId = uuidv4();
      groupIdMap[group.id] = newGroupId;
      return {
        ...group,
        id: newGroupId,
      };
    })
  );
  const conversationIdMap: Record<string, string> = {};
  await db.insert(schema.conversations).values(
    CONVERSATIONS.map(conv => {
      const newConvId = uuidv4();
      conversationIdMap[conv.id] = newConvId;
      return {
        ...conv,
        id: newConvId,
      };
    })
  );

  console.log('🛍️ Seeding products and services...');
  const productIdMap: Record<string, string> = {};
  for (const prod of PRODUCTS) {
    const newProdId = uuidv4();
    productIdMap[prod.id] = newProdId;
    await db.insert(schema.products).values({
      id: newProdId,
      organizationId: orgIdMap[prod.organization_id],
      name: prod.name,
      description: prod.description,
      price: prod.price,
      imageUrl: prod.imageUrl,
      stock: prod.stock,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  const serviceIdMap: Record<string, string> = {};
  for (const serv of SERVICES) {
    const newServId = uuidv4();
    serviceIdMap[serv.id] = newServId;
    await db.insert(schema.services).values({
      id: newServId,
      organizationId: orgIdMap[serv.organization_id],
      name: serv.name,
      description: serv.description,
      basePrice: serv.base_price,
      durationMinutes: serv.duration_minutes,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log('📦 Seeding orders and bookings...');
  for (const order of ORDERS) {
    const newOrderId = uuidv4();
    await db.insert(schema.orders).values({
      id: newOrderId,
      customerId: profileIdMap[order.customer_id],
      organizationId: orgIdMap[order.organization_id],
      productId: order.product_id ? productIdMap[order.product_id] : null,
      productName: order.product_name,
      quantity: order.quantity,
      totalPrice: order.total_price,
      status: order.status,
      orderedAt: new Date(order.ordered_at),
    });
  }
  for (const booking of BOOKINGS) {
    const newBookingId = uuidv4();
    await db.insert(schema.bookings).values({
      id: newBookingId,
      customerId: profileIdMap[booking.customer_id],
      organizationId: orgIdMap[booking.organization_id],
      serviceId: booking.service_id ? serviceIdMap[booking.service_id] : null,
      serviceName: booking.service_name,
      totalPrice: booking.total_price,
      status: booking.status,
      bookedAt: new Date(booking.booked_at),
      bookingDate: booking.booking_date,
    });
  }

  console.log('📊 Seeding claims, reports, and live events...');
  for (const claim of CLAIMS) {
    const newClaimId = uuidv4();
    await db.insert(schema.placeClaims).values({
      id: newClaimId,
      placeId: placeIdMap[claim.placeId],
      organizationId: orgIdMap[claim.organizationId],
      userId: profileIdMap[claim.userId],
      status: claim.status,
      requestedAt: new Date(),
    });
  }
  for (const report of REPORTS) {
    await db.insert(schema.reports).values({
      targetId: report.targetType === 'place' ? placeIdMap[report.targetId] :
        report.targetType === 'event' ? eventIdMap[report.targetId] :
        report.targetType === 'listing' ? listingIdMap[report.targetId] :
        report.targetType === 'profile' ? profileIdMap[report.targetId] :
        report.targetType === 'organization' ? orgIdMap[report.targetId] :
        report.targetType === 'product' ? productIdMap[report.targetId] :
        report.targetType === 'service' ? serviceIdMap[report.targetId] :
        report.targetId,
      targetType: report.targetType,
      reason: report.reason,
      comment: report.comment,
      reporterId: profileIdMap[report.reporterId],
    });
  }
  const liveIdMap: Record<string, string> = {};
  for (const ev of LIVE_EVENTS) {
    const newLiveId = uuidv4();
    liveIdMap[ev.id] = newLiveId;
    await db.insert(schema.liveEvents).values({
      id: newLiveId,
      type: ev.type,
      title: ev.title,
      location: ev.location,
      latitude: ev.coordinates.lat,
      longitude: ev.coordinates.lng,
      authorId: profileIdMap[ev.authorId],
      expiresAt: new Date(ev.expiresAt),
      createdAt: new Date(ev.createdAt),
    });
  }

  console.log('📄 Seeding static pages and analytics...');
  await db.insert(schema.staticPageContent)
    .values(STATIC_PAGES_CONTENT)
    .onConflictDoNothing();
  for (const ev of ANALYTICS_EVENTS) {
    await db.insert(schema.analyticsEvents).values({
      targetEntityId: placeIdMap[ev.target_entity_id],
      targetEntityType: 'place',
      eventName: ev.event_name,
      createdAt: new Date(),
    });
  }

  console.log('✅ Seed completed successfully!');
}

main().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

function isValidDate(joinDate: string): boolean {
  const date = new Date(joinDate);
  return !isNaN(date.getTime());
}

