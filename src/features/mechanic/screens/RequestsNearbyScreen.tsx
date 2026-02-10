import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { ScreenContainer, Header, Button, Card, Spinner } from '../../../components/ui';
import { supabase } from '../../../lib/supabase';
import { getMechanicId, useMechanicLocationUpdates } from '../../../lib/mechanicHelpers';
import { getCurrentPosition } from '../../../utils/location';
import { distanceKm } from '../../../utils/location';
import { theme } from '../../../theme';
import type { MechanicTabScreenProps } from '../../../types/navigation';

type PendingRequest = {
  id: string;
  status: string;
  problem_description: string | null;
  location_lat: number | null;
  location_lng: number | null;
  created_at: string;
};

type RequestWithDistance = PendingRequest & { distanceKm: number | null };

type Props = MechanicTabScreenProps<'Requests'>;

export function RequestsNearbyScreen({ navigation }: Props) {
  const [requests, setRequests] = useState<RequestWithDistance[]>([]);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mechanicId, setMechanicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useMechanicLocationUpdates();

  const fetchPending = useCallback(async () => {
    const { data, error } = await supabase
      .from('requests')
      .select('id, status, problem_description, location_lat, location_lng, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      setRequests([]);
      return;
    }

    const list = (data ?? []) as PendingRequest[];
    setRequests(
      list.map((r) => ({
        ...r,
        distanceKm: null,
      }))
    );
  }, []);

  const applyDistance = useCallback(
    (list: RequestWithDistance[], location: { lat: number; lng: number } | null) => {
      if (!location) return list;
      return [...list]
        .map((r) => ({
          ...r,
          distanceKm:
            r.location_lat != null && r.location_lng != null
              ? distanceKm(location.lat, location.lng, r.location_lat, r.location_lng)
              : null,
        }))
        .sort((a, b) => {
          const da = a.distanceKm ?? Infinity;
          const db = b.distanceKm ?? Infinity;
          return da - db;
        });
    },
    []
  );

  const loadInitial = useCallback(async () => {
    setLoading(true);
    const [mid, loc] = await Promise.all([getMechanicId(), getCurrentPosition()]);
    setMechanicId(mid);
    if (loc) {
      setMyLocation({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    }
    await fetchPending();
    setLoading(false);
  }, [fetchPending]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);
  useEffect(() => {
    if (!myLocation) return;
    setRequests((prev) => applyDistance(prev, myLocation));
  }, [myLocation, applyDistance]);

  useEffect(() => {
    const channel = supabase
      .channel('mechanic-pending-requests')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'requests' },
        (payload) => {
          const row = payload.new as PendingRequest;
          if (row.status !== 'pending') return;
          setRequests((prev) => {
            const next = prev.some((r) => r.id === row.id)
              ? prev
              : [{ ...row, distanceKm: null }, ...prev];
            return myLocation ? applyDistance(next, myLocation) : next;
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'requests' },
        (payload) => {
          const row = payload.new as PendingRequest;
          setRequests((prev) => {
            const next =
              row.status === 'pending'
                ? prev.map((r) => (r.id === row.id ? { ...row, distanceKm: r.distanceKm } : r))
                : prev.filter((r) => r.id !== row.id);
            return myLocation ? applyDistance(next, myLocation) : next;
          });
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [myLocation, applyDistance]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPending();
    if (myLocation) {
      setRequests((prev) => applyDistance(prev, myLocation));
    }
    setRefreshing(false);
  }, [fetchPending, myLocation, applyDistance]);

  const handleAccept = useCallback(
    async (requestId: string) => {
      if (!mechanicId) {
        Alert.alert('Error', 'Mechanic profile not found. Please complete your profile.');
        return;
      }
      setAcceptingId(requestId);
      const { data, error } = await supabase
        .from('requests')
        .update({ mechanic_id: mechanicId, status: 'accepted' })
        .eq('id', requestId)
        .eq('status', 'pending')
        .select('id')
        .maybeSingle();

      setAcceptingId(null);
      if (error) {
        Alert.alert('Error', error.message);
        return;
      }
      if (!data) {
        Alert.alert('Request taken', 'This request was already accepted by another mechanic.');
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
        return;
      }
      const parent = navigation.getParent();
      if (parent) {
        (parent as { navigate: (name: 'ActiveJob', params: { requestId: string }) => void }).navigate(
          'ActiveJob',
          { requestId }
        );
      }
    },
    [mechanicId, navigation]
  );

  if (loading) {
    return (
      <ScreenContainer>
        <Header title="Requests nearby" />
        <Spinner style={styles.spinner} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title="Requests nearby" />
      {!myLocation && (
        <Text style={styles.locationHint}>Enable location to see distance and sort by nearby.</Text>
      )}
      {requests.length === 0 ? (
        <Text style={styles.empty}>No pending requests nearby.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.problem_description || 'No description'}
              </Text>
              {item.distanceKm != null && (
                <Text style={styles.distance}>{item.distanceKm.toFixed(1)} km away</Text>
              )}
              <Text style={styles.time}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
              <Button
                title="Accept"
                onPress={() => handleAccept(item.id)}
                loading={acceptingId === item.id}
                disabled={!!acceptingId || !mechanicId}
                style={styles.acceptButton}
              />
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  spinner: { marginTop: 48 },
  locationHint: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    marginBottom: theme.spacing.sm,
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginTop: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.body,
    fontWeight: theme.typography.subtitle.fontWeight,
    color: theme.colors.text,
  },
  distance: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  time: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },
  acceptButton: {
    marginTop: theme.spacing.sm,
  },
});
