import express from 'express';
import cors from 'cors';
import { auth } from './auth';
import { db } from './db';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const app = express();
// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log('--- Incoming Request ---');
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Headers:', req.headers);
  if (req.method !== 'GET') {
    console.log('Body:', req.body);
  }
  next();
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Mount Better-Auth API routes
app.use('/api/auth', auth.handler);

// Create profile after user registration
app.post('/api/auth/create-profile', async (req, res) => {
  const start = Date.now();
  console.log('[POST] /api/auth/create-profile', { body: req.body });
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username requis' });
    }

    // Check if profile already exists
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    if (existingProfile) {
      return res.json(existingProfile);
    }

    // Create new profile
    const [newProfile] = await db.insert(schema.profiles).values({
      userId: session.user.id,
      username: username,
      fullName: session.user.name,
      avatarUrl: session.user.image || null,
      coverImageUrl: null,
      bio: null,
      levelId: 1,
      isVerified: false,
      points: 0,
    }).returning();

  res.json(newProfile);
  console.log('[POST] /api/auth/create-profile - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get current user with profile
app.get('/api/auth/me', async (req, res) => {
  const start = Date.now();
  console.log('[GET] /api/auth/me');
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Get user's profile
    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    res.json({
      user: session.user,
      profile: profile,
    });
    console.log('[GET] /api/auth/me - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// NOTE: User management endpoints (list users, update roles, ban/unban) are now
// handled by Better Auth Admin Plugin at /api/auth/* routes.
// See ADMIN_PLUGIN_GUIDE.md for usage.
// Admin: Update user role
app.post('/api/admin/users/:userId/role', async (req, res) => {
  const start = Date.now();
  console.log('[POST] /api/admin/users/:userId/role', { params: req.params, body: req.body });
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    await db.update(schema.user)
      .set({ role: role as any })
      .where(eq(schema.user.id, userId));

  res.json({ success: true });
  console.log('[POST] /api/admin/users/:userId/role - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Get all users
app.get('/api/admin/users', async (req, res) => {
  const start = Date.now();
  console.log('[GET] /api/admin/users');
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'moderator')) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const users = await db.query.user.findMany();

  res.json(users);
  console.log('[GET] /api/admin/users - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Approve place
app.post('/api/admin/places/:placeId/approve', async (req, res) => {
  const start = Date.now();
  console.log('[POST] /api/admin/places/:placeId/approve', { params: req.params });
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'moderator')) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { placeId } = req.params;

    await db.update(schema.places)
      .set({ status: 'published' })
      .where(eq(schema.places.id, placeId));

  res.json({ success: true });
  console.log('[POST] /api/admin/places/:placeId/approve - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error approving place:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Reject place
app.post('/api/admin/places/:placeId/reject', async (req, res) => {
  const start = Date.now();
  console.log('[POST] /api/admin/places/:placeId/reject', { params: req.params, body: req.body });
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'moderator')) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { placeId } = req.params;
    const { reason } = req.body;

    await db.update(schema.places)
      .set({ 
        status: 'rejected',
        rejectionReason: reason 
      })
      .where(eq(schema.places.id, placeId));

  res.json({ success: true });
  console.log('[POST] /api/admin/places/:placeId/reject - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error rejecting place:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Organization CRUD

// Get user's organizations
app.get('/api/organizations/my', async (req, res) => {
  const start = Date.now();
  console.log('[GET] /api/organizations/my');
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Get profile
    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    if (!profile) {
      return res.json([]);
    }

    // Get organizations where user is owner
    const ownedOrgs = await db.query.organizations.findMany({
      where: eq(schema.organizations.primaryOwnerId, profile.id),
    });

    // Get organizations where user is a member
    const memberOrgs = await db.query.organizationMembers.findMany({
      where: eq(schema.organizationMembers.profileId, profile.id),
      with: {
        organization: true,
      },
    });

    res.json({
      owned: ownedOrgs,
      member: memberOrgs.map(m => ({ ...m.organization, role: m.role })),
    });
    console.log('[GET] /api/organizations/my - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error getting organizations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Create organization
app.post('/api/organizations', async (req, res) => {
  const start = Date.now();
  console.log('[POST] /api/organizations', { body: req.body });
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    if (!profile) {
      return res.status(400).json({ error: 'Profil non trouvé' });
    }

    const { name, siret } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const [newOrg] = await db.insert(schema.organizations).values({
      name,
      primaryOwnerId: profile.id,
      siret: siret || null,
      subscriptionTier: 'free',
    }).returning();

  res.json(newOrg);
  console.log('[POST] /api/organizations - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Update organization
app.put('/api/organizations/:orgId', async (req, res) => {
  const start = Date.now();
  console.log('[PUT] /api/organizations/:orgId', { params: req.params, body: req.body });
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { orgId } = req.params;
    const { name, siret } = req.body;

    // Check if user has permission (owner or admin)
    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    if (!profile) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const org = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, orgId),
    });

    if (!org) {
      return res.status(404).json({ error: 'Organisation non trouvée' });
    }

    // Check permission
    const isOwner = org.primaryOwnerId === profile.id;
    const membership = await db.query.organizationMembers.findFirst({
      where: eq(schema.organizationMembers.profileId, profile.id),
    });
    const isAdmin = membership?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const [updatedOrg] = await db.update(schema.organizations)
      .set({
        name: name || org.name,
        siret: siret !== undefined ? siret : org.siret,
        updatedAt: new Date(),
      })
      .where(eq(schema.organizations.id, orgId))
      .returning();

  res.json(updatedOrg);
  console.log('[PUT] /api/organizations/:orgId - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Delete organization
app.delete('/api/organizations/:orgId', async (req, res) => {
  const start = Date.now();
  console.log('[DELETE] /api/organizations/:orgId', { params: req.params });
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { orgId } = req.params;

    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    if (!profile) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const org = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, orgId),
    });

    if (!org) {
      return res.status(404).json({ error: 'Organisation non trouvée' });
    }

    // Only owner can delete
    if (org.primaryOwnerId !== profile.id) {
      return res.status(403).json({ error: 'Seul le propriétaire peut supprimer l\'organisation' });
    }

    await db.delete(schema.organizations).where(eq(schema.organizations.id, orgId));

  res.json({ success: true });
  console.log('[DELETE] /api/organizations/:orgId - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Add member to organization
app.post('/api/organizations/:orgId/members', async (req, res) => {
  const start = Date.now();
  console.log('[POST] /api/organizations/:orgId/members', { params: req.params, body: req.body });
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { orgId } = req.params;
    const { profileId, role } = req.body;

    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    if (!profile) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const org = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, orgId),
    });

    if (!org) {
      return res.status(404).json({ error: 'Organisation non trouvée' });
    }

    // Check permission (owner or admin)
    const isOwner = org.primaryOwnerId === profile.id;
    const membership = await db.query.organizationMembers.findFirst({
      where: eq(schema.organizationMembers.profileId, profile.id),
    });
    const isAdmin = membership?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const [newMember] = await db.insert(schema.organizationMembers).values({
      organizationId: orgId,
      profileId: profileId,
      role: role || 'viewer',
      invitedBy: profile.id,
      acceptedAt: new Date(), // Auto-accept for now
    }).returning();

  res.json(newMember);
  console.log('[POST] /api/organizations/:orgId/members - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Remove member from organization
app.delete('/api/organizations/:orgId/members/:memberId', async (req, res) => {
  const start = Date.now();
  console.log('[DELETE] /api/organizations/:orgId/members/:memberId', { params: req.params });
  try {
  const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { orgId, memberId } = req.params;

    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    if (!profile) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const org = await db.query.organizations.findFirst({
      where: eq(schema.organizations.id, orgId),
    });

    if (!org) {
      return res.status(404).json({ error: 'Organisation non trouvée' });
    }

    // Check permission (owner or admin)
    const isOwner = org.primaryOwnerId === profile.id;
    const membership = await db.query.organizationMembers.findFirst({
      where: eq(schema.organizationMembers.profileId, profile.id),
    });
    const isAdmin = membership?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await db.delete(schema.organizationMembers).where(eq(schema.organizationMembers.id, memberId));

  res.json({ success: true });
  console.log('[DELETE] /api/organizations/:orgId/members/:memberId - OK', { duration: Date.now() - start });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================================================
// PUBLIC API ENDPOINTS FOR CONTENT
// ============================================================================

// Get all places (with optional filters)
app.get('/api/places', async (req, res) => {
  try {
    const { mainCategory, status } = req.query;
    let query = db.query.places;
    
    const places = await query.findMany({
      where: status ? eq(schema.places.status, status as any) : undefined,
    });
    
    // Filter by mainCategory if provided
    const filteredPlaces = mainCategory 
      ? places.filter(p => p.mainCategory === mainCategory)
      : places;
    
    res.json(filteredPlaces);
  } catch (error) {
    console.error('Error getting places:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await db.query.events.findMany();
    res.json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all trails
app.get('/api/trails', async (req, res) => {
  try {
    const trails = await db.query.trails.findMany();
    res.json(trails);
  } catch (error) {
    console.error('Error getting trails:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await db.query.articles.findMany();
    res.json(articles);
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all listings
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await db.query.listings.findMany();
    res.json(listings);
  } catch (error) {
    console.error('Error getting listings:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all forum categories
app.get('/api/forum/categories', async (req, res) => {
  try {
    const categories = await db.query.forumCategories.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Error getting forum categories:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all forum threads
app.get('/api/forum/threads', async (req, res) => {
  try {
    const threads = await db.query.forumThreads.findMany();
    res.json(threads);
  } catch (error) {
    console.error('Error getting forum threads:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all groups
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await db.query.groups.findMany();
    res.json(groups);
  } catch (error) {
    console.error('Error getting groups:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all profiles
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await db.query.profiles.findMany();
    res.json(profiles);
  } catch (error) {
    console.error('Error getting profiles:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all conversations (for authenticated user)
app.get('/api/conversations', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    if (!profile) {
      return res.json([]);
    }

    const conversations = await db.query.conversations.findMany();
    
    // Filter conversations where user is a participant
    const userConversations = conversations.filter(c => 
      c.participantIds.includes(profile.id)
    );
    
    res.json(userConversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.query.products.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.query.services.findMany();
    res.json(services);
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all orders (for authenticated user)
app.get('/api/orders', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    if (!profile) {
      return res.json([]);
    }

    const orders = await db.query.orders.findMany({
      where: eq(schema.orders.customerId, profile.id),
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all bookings (for authenticated user)
app.get('/api/bookings', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(schema.profiles.userId, session.user.id),
    });

    if (!profile) {
      return res.json([]);
    }

    const bookings = await db.query.bookings.findMany({
      where: eq(schema.bookings.customerId, profile.id),
    });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all claims
app.get('/api/claims', async (req, res) => {
  try {
    const claims = await db.query.placeClaims.findMany();
    res.json(claims);
  } catch (error) {
    console.error('Error getting claims:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all reports (admin/moderator only)
app.get('/api/reports', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'moderator')) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const reports = await db.query.reports.findMany();
    res.json(reports);
  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all live events
app.get('/api/live-events', async (req, res) => {
  try {
    const liveEvents = await db.query.liveEvents.findMany();
    
    // Filter out expired events
    const now = new Date();
    const activeEvents = liveEvents.filter(e => new Date(e.expiresAt) > now);
    
    res.json(activeEvents);
  } catch (error) {
    console.error('Error getting live events:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get all organizations
app.get('/api/organizations', async (req, res) => {
  try {
    const organizations = await db.query.organizations.findMany();
    res.json(organizations);
  } catch (error) {
    console.error('Error getting organizations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get static page content
app.get('/api/static-pages/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await db.query.staticPageContent.findFirst({
      where: eq(schema.staticPageContent.slug, slug),
    });
    
    if (!page) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }
    
    res.json(page);
  } catch (error) {
    console.error('Error getting static page:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Auth API available at http://localhost:${PORT}/api/auth/*`);
});
