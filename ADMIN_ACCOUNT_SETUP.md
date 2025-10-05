# Admin Setup Guide

## Creating the Admin User

After running the database seed (`npm run db:seed`), you need to set up the admin user password.

### Method 1: Using the API (Recommended)

1. Start the server:
   ```bash
   npm run dev:server
   ```

2. Use curl or Postman to create the admin account with password:
   ```bash
   curl -X POST http://localhost:3001/api/auth/sign-up/email \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@salut-annecy.com",
       "password": "YourSecurePassword123!",
       "name": "Admin Annecy"
     }'
   ```

   **Note:** If the user already exists from the seed, you'll need to use password reset instead.

3. Update the user role to admin in the database:
   ```sql
   UPDATE "user" SET role = 'admin' WHERE email = 'admin@salut-annecy.com';
   ```

### Method 2: Direct Database Update

If you want to manually set up the admin user:

1. The seed script creates:
   - User: `admin@salut-annecy.com`
   - Role: `admin`
   - Username: `admin_annecy`

2. To set the password, you can either:
   - Use the forgot password flow in the UI
   - Manually insert an account record with a hashed password

### Method 3: Registration via UI

1. Start both the server and the client:
   ```bash
   npm run dev:server    # Terminal 1
   npm run dev          # Terminal 2
   ```

2. Open http://localhost:3000 in your browser

3. Click "Register" and create an account with:
   - Email: `admin@salut-annecy.com`
   - Password: Your secure password
   - Name: Admin Annecy
   - Username: admin_annecy

4. After registration, update the role in the database:
   ```bash
   psql -U postgres -d salut_annecy
   UPDATE "user" SET role = 'admin' WHERE email = 'admin@salut-annecy.com';
   ```

## Verifying Admin Access

1. Login with admin credentials
2. Navigate to `/admin` in the application
3. You should see the admin dashboard with:
   - User management
   - Place moderation
   - Event moderation
   - Reports management

## Default Credentials

For development, you can use:
- **Email:** admin@salut-annecy.com
- **Password:** (set by you during setup)

**⚠️ IMPORTANT:** Change these credentials in production!

## Troubleshooting

### "Permission denied" when accessing admin dashboard
- Check that the user role is set to 'admin' in the database
- Verify session is active by checking cookies

### Cannot login
- Ensure the server is running on port 3001
- Check that the database connection is working
- Verify email verification is not blocking login

### Admin dashboard shows "No permission"
- Make sure `currentUser.role === 'admin'` in the app
- Check the session data includes the role field
