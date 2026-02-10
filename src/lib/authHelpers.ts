import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { AuthUser } from '../types';
import type { Role } from '../types';

export interface ProfileRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: Role;
}

/** Fetch profile by user id. Returns null if not found or RLS denies. */
export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, phone, role')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return data as ProfileRow;
}

/** Ensure a profile row exists for the current user (creates from session metadata if trigger missed). */
export async function ensureProfileExists(session: Session): Promise<ProfileRow | null> {
  const existing = await fetchProfile(session.user.id);
  if (existing) return existing;

  const meta = session.user.user_metadata ?? {};
  const rawRole = meta.role as string | undefined;
  const role: Role =
    rawRole === 'mechanic' || rawRole === 'seller' ? rawRole : 'user';

  const { error } = await supabase.from('profiles').insert({
    id: session.user.id,
    name: (meta.name ?? meta.full_name ?? session.user.email?.split('@')[0] ?? null) as string | null,
    email: session.user.email ?? null,
    phone: (meta.phone as string | undefined) ?? null,
    role,
  });

  // If insert fails (e.g. trigger already created row or duplicate), just fetch
  if (error && error.code !== '23505') return null;
  return fetchProfile(session.user.id);
}

/** Build AuthUser from Supabase session and profile. */
export function authUserFromSession(session: Session, profile: ProfileRow | null): AuthUser {
  const id = session.user.id;
  const email = session.user.email ?? '';
  const name = profile?.name ?? session.user.user_metadata?.name ?? email.split('@')[0] ?? 'User';
  const role: Role = profile?.role ?? 'user';
  return {
    id,
    name,
    email,
    role,
    phone: profile?.phone ?? undefined,
    token: session.access_token,
  };
}

/** Get current session and profile, then return AuthUser or null. Creates profile from metadata if missing. */
export async function getAuthUserFromSession(): Promise<AuthUser | null> {
  const result = await getSessionWithProfile();
  return result?.authUser ?? null;
}

/** Get current session, profile, and authUser. Returns null if no session. Use for store hydration. */
export async function getSessionWithProfile(): Promise<{
  session: Session;
  profile: ProfileRow | null;
  authUser: AuthUser;
} | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const profile = await ensureProfileExists(session);
  const authUser = authUserFromSession(session, profile);
  return { session, profile, authUser };
}
