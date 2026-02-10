import { useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabase';
import { getCurrentPosition } from '../utils/location';

const LOCATION_UPDATE_INTERVAL_MS = 10_000;

/**
 * Fetch the current user's mechanic row id (mechanics.id). Returns null if not a mechanic.
 * If the user has role mechanic but no row exists, inserts one and returns the new id.
 */
export async function getMechanicId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  let { data, error } = await supabase
    .from('mechanics')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return null;
  if (data) return data.id;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if ((profile as { role?: string } | null)?.role !== 'mechanic') return null;

  const { data: inserted, error: insertErr } = await supabase
    .from('mechanics')
    .insert({ user_id: user.id })
    .select('id')
    .single();

  if (insertErr || !inserted) return null;
  return inserted.id;
}

/**
 * Upsert current position into mechanic_locations: update existing row for this mechanic or insert.
 */
async function upsertMechanicLocation(mechanicId: string, lat: number, lng: number): Promise<void> {
  const { data: existing } = await supabase
    .from('mechanic_locations')
    .select('id')
    .eq('mechanic_id', mechanicId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('mechanic_locations')
      .update({ lat, lng, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    await supabase.from('mechanic_locations').insert({
      mechanic_id: mechanicId,
      lat,
      lng,
    });
  }
}

/**
 * Hook: when the current user is a mechanic, updates mechanic_locations every 10 seconds with current position.
 * Call from a mechanic-scoped component (e.g. inside MechanicStack or Requests tab).
 */
export function useMechanicLocationUpdates(): void {
  const mechanicIdRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(async () => {
    if (!mechanicIdRef.current) {
      mechanicIdRef.current = await getMechanicId();
    }
    const mid = mechanicIdRef.current;
    if (!mid) return;

    const location = await getCurrentPosition();
    if (!location) return;

    const { latitude, longitude } = location.coords;
    await upsertMechanicLocation(mid, latitude, longitude);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mid = await getMechanicId();
      if (cancelled) return;
      mechanicIdRef.current = mid;
      if (!mid) return;

      await tick();
      intervalRef.current = setInterval(tick, LOCATION_UPDATE_INTERVAL_MS);
    })();

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [tick]);
}
