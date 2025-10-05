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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Auth API available at http://localhost:${PORT}/api/auth/*`);
});
