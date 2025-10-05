import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";
// import { ac, admin, user, myCustomRole } from "@/auth/permissions" // Uncomment if you add custom roles

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    adminClient()
    // adminClient({ ac, roles: { admin, user, myCustomRole } }) // Uncomment for custom roles
  ]
});
