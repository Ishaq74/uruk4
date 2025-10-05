import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";
// import { ac, admin, user, myCustomRole } from "@/auth/permissions" // Uncomment if you add custom roles

export const authClient = createAuthClient({
  plugins: [
    adminClient()
    // adminClient({ ac, roles: { admin, user, myCustomRole } }) // Uncomment for custom roles
  ]
});
