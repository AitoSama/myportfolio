import type { User } from "firebase/auth";

export const ADMIN_OWNER_EMAIL = "a1t0samatt@gmail.com";

export function isAdminUser(user: User | null): boolean {
  return (
    user?.email === ADMIN_OWNER_EMAIL && user.emailVerified === true
  );
}
