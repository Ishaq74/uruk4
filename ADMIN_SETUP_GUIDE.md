# Better Auth Admin Plugin - Setup and Migration Guide

## What Was Implemented

This guide covers the Better Auth Admin Plugin implementation that was added to fix authentication issues and follow Better Auth documentation.

### Changes Made

1. **Server Configuration (`auth.ts`)**
   - Added `admin` plugin import from `better-auth/plugins`
   - Configured admin plugin with:
     - `defaultRole: 'user'`
     - `adminRoles: ['admin', 'moderator']`

2. **Client Configuration (`auth-client.ts`)**
   - Added `adminClient` plugin import from `better-auth/client/plugins`
   - Configured client with baseURL pointing to API server
   - Added admin client plugin to enable admin operations from frontend

3. **Database Schema Updates (`schema.ts`)**
   - **User table**: Added 3 new fields
     - `banned` (boolean) - Default: false
     - `banReason` (text) - Optional reason for ban
     - `banExpires` (timestamp) - When ban expires (null = permanent)
   - **Session table**: Added 1 new field
     - `impersonatedBy` (text) - ID of admin who created impersonation session

4. **Database Migration**
   - Generated migration file: `drizzle/0003_careless_exiles.sql`
   - Migration adds all required fields to database

5. **Documentation**
   - Created `ADMIN_PLUGIN_GUIDE.md` - Comprehensive usage guide
   - Updated `README.md` with admin plugin information
   - Created this setup guide

6. **Environment Configuration**
   - Added `vite-env.d.ts` for TypeScript support of import.meta.env
   - Updated `vite.config.ts` to properly expose VITE_API_URL

## Migration Steps

### Step 1: Review Changes

Before applying the migration, review the changes:

```bash
# View the migration SQL
cat drizzle/0003_careless_exiles.sql

# View schema changes
git diff HEAD~3 schema.ts
```

### Step 2: Apply Database Migration

Choose one of these methods:

**Option A: Using Drizzle Kit Push (Recommended for Development)**
```bash
npm run db:push
```

This will:
- Apply the schema changes directly to the database
- No need to run migrations manually

**Option B: Using Drizzle Kit Migrate (Recommended for Production)**
```bash
# First, ensure the migration is in your migrations folder
npx drizzle-kit generate

# Then apply it
npx drizzle-kit migrate
```

### Step 3: Verify Migration

Check that the new fields were added:

```sql
-- Connect to your database
psql -U <username> -d salut_annecy

-- Check user table
\d user

-- You should see:
-- - banned (boolean)
-- - ban_reason (text)
-- - ban_expires (timestamp without time zone)

-- Check session table
\d session

-- You should see:
-- - impersonated_by (text)
```

### Step 4: Create First Admin User

You need at least one admin user to use the admin features:

**Option A: Manually in Database**
```sql
-- Update an existing user
UPDATE "user" SET role = 'admin' WHERE email = 'your-admin@example.com';
```

**Option B: Via Admin Creation (if you already have an admin)**
```typescript
// Use the admin API to create a new admin
const { data, error } = await authClient.admin.createUser({
  email: "newadmin@example.com",
  password: "secure-password",
  name: "Admin User",
  role: "admin"
});
```

### Step 5: Test Admin Functionality

Create a simple test file to verify everything works:

```typescript
// test-admin.ts
import { authClient } from './auth-client';

async function testAdmin() {
  try {
    // First login as admin
    const loginResult = await authClient.signIn.email({
      email: 'your-admin@example.com',
      password: 'your-password'
    });
    
    if (loginResult.error) {
      console.error('Login failed:', loginResult.error);
      return;
    }
    
    console.log('✅ Logged in as admin');
    
    // Test listing users
    const usersResult = await authClient.admin.listUsers({
      query: { limit: 10 }
    });
    
    if (usersResult.error) {
      console.error('Failed to list users:', usersResult.error);
      return;
    }
    
    console.log('✅ Successfully listed users:', usersResult.data.users.length);
    
    // Test checking permissions
    const hasPermission = await authClient.admin.hasPermission({
      permissions: {
        user: ["create", "list"]
      }
    });
    
    console.log('✅ Permission check result:', hasPermission);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAdmin();
```

## Available Admin Operations

Now that the plugin is installed, you can use these operations:

### User Management
- `authClient.admin.createUser()` - Create new users
- `authClient.admin.listUsers()` - List and filter users
- `authClient.admin.updateUser()` - Update user data
- `authClient.admin.removeUser()` - Delete users
- `authClient.admin.setRole()` - Change user roles
- `authClient.admin.setUserPassword()` - Reset passwords

### User Moderation
- `authClient.admin.banUser()` - Ban users temporarily or permanently
- `authClient.admin.unbanUser()` - Remove bans

### Session Management
- `authClient.admin.listUserSessions()` - View all user sessions
- `authClient.admin.revokeUserSession()` - Revoke specific session
- `authClient.admin.revokeUserSessions()` - Revoke all user sessions

### Impersonation
- `authClient.admin.impersonateUser()` - Act as another user
- `authClient.admin.stopImpersonating()` - Return to admin account

### Permissions
- `authClient.admin.hasPermission()` - Check current user permissions
- `authClient.admin.checkRolePermission()` - Check role permissions

## Integration with Existing Code

### Update Admin Dashboard Component

If you have an existing admin dashboard, you can now use the Better Auth API:

```typescript
// Before (custom implementation)
const users = await fetch('/api/admin/users').then(r => r.json());

// After (Better Auth)
const { data, error } = await authClient.admin.listUsers({
  query: { limit: 50 }
});
const users = data?.users || [];
```

### Update Server Routes

You can migrate custom admin routes to use Better Auth:

```typescript
// Before (custom route)
app.post('/api/admin/users/:userId/role', async (req, res) => {
  // Custom implementation
});

// After (Better Auth handles this automatically)
// Just use: authClient.admin.setRole({ userId, role })
```

## Troubleshooting

### Issue: "Admin endpoints not found"

**Solution:** Make sure the admin plugin is properly imported and configured in `auth.ts`:

```typescript
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
  plugins: [admin()],
  // ...
});
```

### Issue: "Permission denied" when calling admin operations

**Solution:** Ensure the user has the admin role:

```sql
SELECT id, email, role FROM "user" WHERE email = 'your-email@example.com';
```

If role is not 'admin' or 'moderator', update it:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Issue: "baseURL not configured" error on client

**Solution:** Ensure auth-client.ts has baseURL configured:

```typescript
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  plugins: [adminClient()]
});
```

And that your `.env` file has:
```
VITE_API_URL=http://localhost:3001
```

### Issue: Migration fails with "column already exists"

**Solution:** The migration may have already been applied. Check your database:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user' AND column_name IN ('banned', 'ban_reason', 'ban_expires');
```

If columns exist, you can skip the migration.

## Next Steps

1. ✅ Migration applied
2. ✅ Admin user created
3. ✅ Admin operations tested
4. 📝 Update your admin dashboard to use Better Auth admin API
5. 📝 Add admin UI for ban management
6. 📝 Implement permission checks in your components
7. 📝 Add session management UI
8. 📝 Consider implementing custom permissions (see ADMIN_PLUGIN_GUIDE.md)

## Resources

- **Complete Usage Guide**: `ADMIN_PLUGIN_GUIDE.md`
- **Better Auth Docs**: https://www.better-auth.com/docs/plugins/admin
- **Migration File**: `drizzle/0003_careless_exiles.sql`
- **Schema Changes**: `schema.ts` (user and session tables)

## Rollback (if needed)

If you need to rollback the changes:

```sql
-- Remove added columns
ALTER TABLE "session" DROP COLUMN IF EXISTS "impersonated_by";
ALTER TABLE "user" DROP COLUMN IF EXISTS "banned";
ALTER TABLE "user" DROP COLUMN IF EXISTS "ban_reason";
ALTER TABLE "user" DROP COLUMN IF EXISTS "ban_expires";
```

Then in your code:
1. Remove the admin plugin from `auth.ts`
2. Remove the adminClient plugin from `auth-client.ts`
3. Revert schema.ts changes
4. Remove the migration file

---

**Setup completed!** The Better Auth admin plugin is now fully integrated and ready to use.
