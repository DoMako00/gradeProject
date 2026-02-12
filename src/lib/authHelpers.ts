import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { AuthUser } from '../types';
import type { Role } from '../types';

export interface ProfileRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: Role;
}

function roleFromSession(session: Session): Role {
  const meta = session.user.user_metadata as Record<string, unknown> | undefined;
  const rawMeta = (session.user as { raw_user_meta_data?: Record<string, unknown> }).raw_user_meta_data;
  const appMeta = session.user.app_metadata as Record<string, unknown> | undefined;
  const rawRole = (meta?.role ?? rawMeta?.role ?? appMeta?.role) as string | undefined;
  return rawRole === 'mechanic' || rawRole === 'seller' ? rawRole : 'user';
}

/** Fetch profile by user id. Returns null if not found or RLS denies. */
export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, phone, avatar_url, role')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return data as ProfileRow;
}

/** Ensure a profile row exists for the current user (creates from session metadata if trigger missed). */
export async function ensureProfileExists(session: Session): Promise<ProfileRow | null> {
  const existing = await fetchProfile(session.user.id);
  if (existing) return existing;

  const meta = session.user.user_metadata as Record<string, unknown> | undefined;
  const role = roleFromSession(session);

  console.log(
    '[authHelpers] ensureProfileExists creating profile',
    JSON.stringify(
      {
        userId: session.user.id,
        metaRole: (meta?.role as string | undefined) ?? null,
        resolvedRole: role,
      },
      null,
      2
    )
  );

  const { error } = await supabase.from('profiles').insert({
    id: session.user.id,
    name: ((meta?.name ??
      meta?.full_name ??
      session.user.email?.split('@')[0] ??
      null) ?? null) as string | null,
    email: session.user.email ?? null,
    phone: (meta?.phone as string | undefined) ?? null,
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
  const role: Role = profile?.role ?? roleFromSession(session);
  return {
    id,
    name,
    email,
    role,
    phone: profile?.phone ?? undefined,
    avatar_url: profile?.avatar_url ?? undefined,
    token: session.access_token,
  };
}

/** Get current session and profile, then return AuthUser or null. Creates profile from metadata if missing. */
export async function getAuthUserFromSession(): Promise<AuthUser | null> {
  const result = await getSessionWithProfile();
  return result?.authUser ?? null;
}

/** Ensure profile has correct role from metadata (fixes trigger edge cases) and mechanics row exists for mechanics. */
export async function ensureMechanicRoleAndRow(
  session: Session,
  profile: ProfileRow | null
): Promise<ProfileRow | null> {
  const meta = session.user.user_metadata as Record<string, string> | undefined;
  const rawMeta = (session.user as { raw_user_meta_data?: Record<string, string> }).raw_user_meta_data;
  const metaRole = meta?.role ?? rawMeta?.role;
  const targetRole: Role = roleFromSession(session);

  console.log(
    '[authHelpers] ensureMechanicRoleAndRow',
    JSON.stringify(
      {
        userId: session.user.id,
        metaRole,
        existingProfileRole: profile?.role,
        targetRole,
      },
      null,
      2
    )
  );

  // If profile has wrong role but metadata says mechanic/seller, update profile
  if (profile && profile.role !== targetRole && (targetRole === 'mechanic' || targetRole === 'seller')) {
    await supabase
      .from('profiles')
      .update({ role: targetRole })
      .eq('id', session.user.id);
    const updated = await fetchProfile(session.user.id);
    if (updated) return updated;
  }

  // If mechanic, ensure mechanics row exists
  if (targetRole === 'mechanic' && (profile?.role === 'mechanic' || targetRole === 'mechanic')) {
    const { data: existing } = await supabase
      .from('mechanics')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();
    if (!existing) {
      console.log('[authHelpers] Creating mechanics row for user', session.user.id);
      await supabase.from('mechanics').insert({ user_id: session.user.id });
    } else {
      console.log('[authHelpers] Mechanics row already exists for user', session.user.id);
    }
  }

  return profile;
}

/** Get current session, profile, and authUser. Returns null if no session. Use for store hydration. */
export async function getSessionWithProfile(): Promise<{
  session: Session;
  profile: ProfileRow | null;
  authUser: AuthUser;
} | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  let profile = await ensureProfileExists(session);
  profile = await ensureMechanicRoleAndRow(session, profile);
  const authUser = authUserFromSession(session, profile);
  return { session, profile, authUser };
}
