import { eq } from 'drizzle-orm';
import type { DB } from './client';
import { user } from './schema';
import { createAuth, isAdminEmail, type AuthEnv } from './auth';

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string | null;
};

/**
 * Gate: authenticated admin or null (non-admins must not learn the admin
 * surface exists). ADMIN_EMAILS is the source of truth; the DB role is a cache
 * kept in sync on every gated access. Fresh session read (no cookie cache) so
 * bans / demotions take effect immediately.
 */
export async function assertAdmin(authEnv: AuthEnv, db: DB, request: Request): Promise<AdminUser | null> {
  const auth = createAuth(authEnv, db);
  const session = await auth.api.getSession({
    headers: request.headers,
    query: { disableCookieCache: true },
  });
  if (!session?.user) return null;
  const u = session.user;
  const granted = u.role === 'admin' || isAdminEmail(u.email, authEnv.ADMIN_EMAILS);
  if (!granted) return null;
  if (u.role !== 'admin' && isAdminEmail(u.email, authEnv.ADMIN_EMAILS)) {
    await db.update(user).set({ role: 'admin', updatedAt: new Date() }).where(eq(user.id, u.id));
  } else if (u.role === 'admin' && !isAdminEmail(u.email, authEnv.ADMIN_EMAILS)) {
    // env revocation wins: demote so better-auth's own admin endpoints stop
    // accepting this session's cached role cookie.
    await db.update(user).set({ role: 'user', updatedAt: new Date() }).where(eq(user.id, u.id));
    return null;
  }
  return { id: u.id, email: u.email, name: u.name, image: u.image, role: 'admin' };
}
