# 🚀 PostgreSQL Integration - Setup Guide

This document explains how to set up and use the **full PostgreSQL integration** for Salut Annecy.

## ✅ What's Implemented

### Database Infrastructure
- ✅ **Complete database schema** with 40+ tables (see `schema.ts` and `schema.sql`)
- ✅ **Drizzle ORM** for type-safe database access
- ✅ **Better-Auth integration** for authentication
- ✅ **Seed data** with sample content for development
- ✅ **API endpoints** for all resources (places, events, trails, etc.)
- ✅ **Frontend hooks** to fetch data from API

### Multi-Language Support
- ✅ **6 languages**: French, English, Spanish, German, Arabic, Chinese
- ✅ **react-i18next** integration with language selector
- ✅ **Complete translations** for all UI elements
- ✅ **RTL support** for Arabic

## 📋 Prerequisites

1. **PostgreSQL** 12 or higher installed
2. **Node.js** 18 or higher
3. **npm** or **yarn**

## 🔧 Setup Instructions

### Step 1: Install PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE salut_annecy;
CREATE USER salut_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE salut_annecy TO salut_user;
\q
```

### Step 3: Configure Environment

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://salut_user:your_secure_password@localhost:5432/salut_annecy

# Better-Auth (CHANGE THIS!)
BETTER_AUTH_SECRET=your-super-secret-key-minimum-32-characters-long
BETTER_AUTH_URL=http://localhost:3000

# API Server
PORT=3001
VITE_API_URL=http://localhost:3001

# Optional: Gemini API (for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**⚠️ IMPORTANT**: Change `BETTER_AUTH_SECRET` to a random 32+ character string!

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Set Up Database

```bash
# Push schema to database (creates all tables)
npm run db:push

# Seed database with sample data
npm run db:seed

# Or do both at once
npm run db:setup
```

### Step 6: Verify Setup

```bash
# Test database connection
npm run db:verify
```

You should see:
```
✅ Connection successful!
✅ Found 40+ tables
✅ Database verification complete!
```

## 🚀 Running the Application

### Development Mode

Open **two terminals**:

**Terminal 1 - Backend Server:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open your browser to `http://localhost:3000`

### Production Build

```bash
# Build frontend
npm run build

# Start server
PORT=3001 npm run dev:server
```

Serve the `dist/` folder with nginx or another static file server.

## 🌐 Multi-Language Features

### Changing Language

Users can change the language using the language selector in the header (flag icons).

### Supported Languages

| Language | Code | Flag |
|----------|------|------|
| Français (French) | `fr` | 🇫🇷 |
| English | `en` | 🇬🇧 |
| Español (Spanish) | `es` | 🇪🇸 |
| Deutsch (German) | `de` | 🇩🇪 |
| العربية (Arabic) | `ar` | 🇸🇦 |
| 中文 (Chinese) | `zh` | 🇨🇳 |

### Adding New Translations

1. Add keys to all files in `locales/*/translation.json`
2. Use in components with `useTranslation` hook:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('header.title')}</h1>;
}
```

## 📊 Database Management

### View Database in Browser

```bash
npm run db:studio
```

Opens Drizzle Studio at `https://local.drizzle.studio`

### Reset Database

```bash
# Drop all data and recreate
npm run db:push -- --force
npm run db:seed
```

### Backup Database

```bash
pg_dump salut_annecy > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
psql salut_annecy < backup_20240101.sql
```

## 🔐 Admin Access

### Create Admin User

After seeding the database, you can create an admin user:

1. Register a regular account through the UI
2. Connect to the database:
   ```bash
   psql salut_annecy
   ```
3. Update the user role:
   ```sql
   UPDATE "user" SET role = 'admin' WHERE email = 'your@email.com';
   ```

Or use the Better-Auth admin API after logging in as an admin.

## 📡 API Endpoints

All endpoints are available at `http://localhost:3001/api/`

### Main Resources

- `GET /api/places` - Get all places
- `GET /api/events` - Get all events
- `GET /api/trails` - Get all trails
- `GET /api/articles` - Get all articles
- `GET /api/listings` - Get all listings
- `GET /api/groups` - Get all groups
- `GET /api/profiles` - Get all profiles

### Authentication

- `POST /api/auth/sign-up/email` - Register
- `POST /api/auth/sign-in/email` - Login
- `GET /api/auth/get-session` - Get current session
- `POST /api/auth/sign-out` - Logout

### Admin (requires admin role)

- `GET /api/admin/users` - List all users
- `POST /api/admin/users/:userId/role` - Change user role
- `POST /api/admin/users/:userId/ban` - Ban/unban user
- `POST /api/admin/places/:placeId/approve` - Approve place
- `POST /api/admin/places/:placeId/reject` - Reject place

## 🐛 Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: PostgreSQL is not running. Start it:
- macOS: `brew services start postgresql@15`
- Linux: `sudo systemctl start postgresql`

### Authentication Failed

```
Error: password authentication failed for user "salut_user"
```

**Solution**: Check your DATABASE_URL in `.env` has the correct password.

### Tables Don't Exist

```
Error: relation "places" does not exist
```

**Solution**: Run `npm run db:push` to create tables.

### Empty Results from API

**Solution**: Run `npm run db:seed` to populate the database.

### Port Already in Use

```
Error: Port 3001 is already in use
```

**Solution**: Kill the process or change the PORT in `.env`:
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 npm run dev:server
```

## 📚 Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Better-Auth Documentation](https://www.better-auth.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [i18next Documentation](https://www.i18next.com/)

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Database connection successful (`npm run db:verify`)
- [ ] Tables created (40+ tables visible in Drizzle Studio)
- [ ] Seed data loaded (places, events, etc. visible in browser)
- [ ] Backend server runs without errors
- [ ] Frontend connects to backend successfully
- [ ] Can register/login a user
- [ ] Can change language in UI
- [ ] Data loads from database (not from constants)
- [ ] Admin dashboard accessible (for admin users)

## 🎉 Success!

If all checks pass, your **full PostgreSQL integration with multi-language support** is working!

The application now uses:
- ✅ Real database instead of mock data
- ✅ Type-safe queries with Drizzle ORM
- ✅ Secure authentication with Better-Auth
- ✅ Multi-language support (6 languages)
- ✅ Admin dashboard for content moderation
- ✅ RESTful API for all resources

---

**Need help?** Open an issue or check the main [README.md](./README.md)
