# Better Auth Admin Plugin - Implementation Guide

This document provides complete information about the Better Auth Admin Plugin implementation in this project.

## Overview

The Admin plugin provides a comprehensive set of administrative functions for user management, including:
- User creation and management
- Role-based access control
- User banning/unbanning
- Session management and impersonation
- Permission-based operations

## Installation & Setup

### 1. Server Configuration

The admin plugin has been added to the Better Auth server configuration in `auth.ts`:

```typescript
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
  // ... other config
  plugins: [
    admin({
      defaultRole: 'user',
      adminRoles: ['admin', 'moderator'],
    }),
  ],
});
```

### 2. Client Configuration

The admin client plugin has been added in `auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3001',
  plugins: [
    adminClient()
  ]
});
```

### 3. Database Schema

The admin plugin adds the following fields to the database:

**User Table:**
- `banned` (boolean) - Whether the user is banned (default: false)
- `banReason` (text) - Reason for the ban
- `banExpires` (timestamp) - When the ban expires (null = permanent)

**Session Table:**
- `impersonatedBy` (text) - ID of the admin impersonating this session

### 4. Database Migration

Run the migration to add these fields:

```bash
# Generate migration (already done)
npx drizzle-kit generate

# Apply migration to database
npx drizzle-kit push
# OR
npx drizzle-kit migrate
```

The migration file is located at: `drizzle/0003_careless_exiles.sql`

## Usage Examples

### Admin Operations

#### Create User (Admin Only)

```typescript
// Client-side
const { data, error } = await authClient.admin.createUser({
  email: "user@example.com",
  password: "secure-password",
  name: "John Doe",
  role: "user"
});

// Server-side
const newUser = await auth.api.createUser({
  body: {
    email: "user@example.com",
    password: "secure-password",
    name: "John Doe",
    role: "user"
  }
});
```

#### List Users with Filtering

```typescript
// Client-side
const { data, error } = await authClient.admin.listUsers({
  query: {
    searchValue: "john",
    searchField: "name",
    searchOperator: "contains",
    limit: 10,
    offset: 0,
    sortBy: "createdAt",
    sortDirection: "desc"
  }
});

// Server-side (requires session cookies)
const data = await auth.api.listUsers({
  query: {
    searchValue: "john",
    searchField: "name",
    limit: 10
  },
  headers: await headers()
});
```

#### Set User Role

```typescript
// Client-side
const { data, error } = await authClient.admin.setRole({
  userId: "user-id",
  role: "admin"
});

// Server-side
const data = await auth.api.setRole({
  body: {
    userId: "user-id",
    role: "admin"
  },
  headers: await headers()
});
```

#### Ban/Unban User

```typescript
// Ban user
const { data, error } = await authClient.admin.banUser({
  userId: "user-id",
  banReason: "Violation of terms",
  banExpiresIn: 60 * 60 * 24 * 7 // 7 days in seconds
});

// Unban user
const { data, error } = await authClient.admin.unbanUser({
  userId: "user-id"
});
```

#### Update User

```typescript
const { data, error } = await authClient.admin.updateUser({
  userId: "user-id",
  data: {
    name: "New Name",
    email: "newemail@example.com"
  }
});
```

#### Set User Password

```typescript
const { data, error } = await authClient.admin.setUserPassword({
  userId: "user-id",
  newPassword: "new-secure-password"
});
```

### Session Management

#### List User Sessions

```typescript
const { data, error } = await authClient.admin.listUserSessions({
  userId: "user-id"
});
```

#### Revoke User Session

```typescript
// Revoke specific session
const { data, error } = await authClient.admin.revokeUserSession({
  sessionToken: "session-token"
});

// Revoke all sessions for a user
const { data, error } = await authClient.admin.revokeUserSessions({
  userId: "user-id"
});
```

### User Impersonation

#### Start Impersonation

```typescript
const { data, error } = await authClient.admin.impersonateUser({
  userId: "user-id"
});
// Session will last for 1 hour by default
```

#### Stop Impersonation

```typescript
const { data, error } = await authClient.admin.stopImpersonating({});
```

### User Deletion

#### Remove User (Hard Delete)

```typescript
const { data, error } = await authClient.admin.removeUser({
  userId: "user-id"
});
```

## Access Control

### Default Roles

The system has three predefined roles:
- `user` - Regular users (default)
- `moderator` - Can perform some admin operations
- `admin` - Full administrative access

### Admin Roles Configuration

Only users with roles in the `adminRoles` array can perform admin operations:

```typescript
admin({
  adminRoles: ['admin', 'moderator']
})
```

### Checking Permissions

You can check if the current user has admin permissions:

```typescript
// In your components
const session = await authClient.getSession();
const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'moderator';
```

## Configuration Options

### Plugin Options

```typescript
admin({
  // Default role for new users
  defaultRole: 'user',
  
  // Roles considered as admin
  adminRoles: ['admin', 'moderator'],
  
  // Default ban reason
  defaultBanReason: 'Violation of terms',
  
  // Default ban duration in seconds (undefined = permanent)
  defaultBanExpiresIn: 60 * 60 * 24 * 7, // 7 days
  
  // Impersonation session duration in seconds
  impersonationSessionDuration: 60 * 60, // 1 hour
  
  // Custom message for banned users
  bannedUserMessage: "You have been banned. Contact support if you believe this is an error."
})
```

## Integration with Existing Code

### Server Routes

The admin API endpoints are automatically mounted by Better Auth at `/api/auth/*`. Existing custom admin routes in `server.ts` can be migrated to use the Better Auth admin API for consistency.

### Custom Admin Dashboard

The existing `AdminDashboard` component can be enhanced to use the Better Auth admin API:

```typescript
import { authClient } from './auth-client';

// Example: Load users
const loadUsers = async () => {
  const { data, error } = await authClient.admin.listUsers({
    query: { limit: 50 }
  });
  
  if (error) {
    console.error('Failed to load users:', error);
    return;
  }
  
  setUsers(data.users);
};
```

## Security Considerations

1. **Admin Routes**: All admin operations require authentication and proper role assignment
2. **Session Security**: Sessions are validated on every request
3. **Ban Enforcement**: Banned users cannot sign in until unbanned or ban expires
4. **Impersonation Tracking**: Impersonated sessions are tracked via `impersonatedBy` field
5. **Password Hashing**: User passwords are automatically hashed by Better Auth

## Migration Checklist

- [x] Admin plugin added to server configuration
- [x] Admin client plugin added to client configuration
- [x] Database schema updated with admin fields
- [x] Migration generated and ready to apply
- [ ] Run migration on production database
- [ ] Update admin dashboard to use Better Auth API
- [ ] Test all admin operations
- [ ] Configure admin user IDs or create first admin user

## Next Steps

1. **Apply Migration**: Run `npx drizzle-kit push` to apply the schema changes
2. **Create Admin User**: Manually update the first user's role to 'admin' in the database
3. **Test Operations**: Test creating users, banning, and other admin operations
4. **Update Dashboard**: Migrate existing admin dashboard to use Better Auth admin API
5. **Documentation**: Update user-facing documentation with admin capabilities

## Resources

- [Better Auth Admin Plugin Docs](https://www.better-auth.com/docs/plugins/admin)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- Schema Changes: See `drizzle/0003_careless_exiles.sql`
