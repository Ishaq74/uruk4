import express from 'express';
import cors from 'cors';
import { auth } from './auth';
import { db } from './db';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const app = express();

app.use(cors());
app.use(express.json());

// Mount Better-Auth API routes
app.all('/api/auth/*', (req, res) => {
  return auth.handler(req, res);
});

// Create profile after user registration
app.post('/api/auth/create-profile', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
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
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get current user with profile
app.get('/api/auth/me', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
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
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Update user role
app.post('/api/admin/users/:userId/role', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
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
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Get all users
app.get('/api/admin/users', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'moderator')) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const users = await db.query.user.findMany();

    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Approve place
app.post('/api/admin/places/:placeId/approve', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'moderator')) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { placeId } = req.params;

    await db.update(schema.places)
      .set({ status: 'published' })
      .where(eq(schema.places.id, placeId));

    res.json({ success: true });
  } catch (error) {
    console.error('Error approving place:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Reject place
app.post('/api/admin/places/:placeId/reject', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
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
  } catch (error) {
    console.error('Error rejecting place:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Organization CRUD

// Get user's organizations
app.get('/api/organizations/my', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
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
  } catch (error) {
    console.error('Error getting organizations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Create organization
app.post('/api/organizations', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
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
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Update organization
app.put('/api/organizations/:orgId', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
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
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Delete organization
app.delete('/api/organizations/:orgId', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
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
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Add member to organization
app.post('/api/organizations/:orgId/members', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
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
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Remove member from organization
app.delete('/api/organizations/:orgId/members/:memberId', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
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
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Auth API available at http://localhost:${PORT}/api/auth/*`);
});
