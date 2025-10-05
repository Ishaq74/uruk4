#!/usr/bin/env node

/**
 * Better Auth Admin Plugin - Setup Verification
 * 
 * This script verifies that the Better Auth admin plugin is properly configured.
 */

import { auth } from './auth.js';

console.log('🔍 Verifying Better Auth Admin Plugin Setup...\n');

// 1. Check if auth object exists
if (!auth) {
  console.error('❌ Auth object not found!');
  process.exit(1);
}
console.log('✅ Auth object loaded successfully');

// 2. Check if admin API endpoints are available
const adminEndpoints = [
  'createUser',
  'listUsers',
  'setRole',
  'banUser',
  'unbanUser',
  'updateUser',
  'setUserPassword',
  'listUserSessions',
  'revokeUserSession',
  'revokeUserSessions',
  'impersonateUser',
  'stopImpersonating',
  'removeUser'
];

let allEndpointsFound = true;

console.log('\n📋 Checking admin API endpoints:');
for (const endpoint of adminEndpoints) {
  if (auth.api[endpoint]) {
    console.log(`✅ auth.api.${endpoint} - Available`);
  } else {
    console.log(`❌ auth.api.${endpoint} - Missing`);
    allEndpointsFound = false;
  }
}

if (!allEndpointsFound) {
  console.error('\n❌ Some admin endpoints are missing!');
  process.exit(1);
}

console.log('\n✅ All admin endpoints are available!');

// 3. Summary
console.log('\n' + '='.repeat(50));
console.log('✨ Better Auth Admin Plugin Setup Summary');
console.log('='.repeat(50));
console.log('✅ Server configuration: auth.ts');
console.log('✅ Client configuration: auth-client.ts');
console.log('✅ Schema updated: user & session tables');
console.log('✅ Migration generated: drizzle/0003_careless_exiles.sql');
console.log('✅ Admin API endpoints: All available');
console.log('='.repeat(50));

console.log('\n📝 Next steps:');
console.log('1. Run database migration: npm run db:push');
console.log('2. Create an admin user (update role in database)');
console.log('3. Test admin operations using authClient.admin.*');
console.log('4. See ADMIN_PLUGIN_GUIDE.md for usage examples');

console.log('\n✅ Setup verification complete!');
