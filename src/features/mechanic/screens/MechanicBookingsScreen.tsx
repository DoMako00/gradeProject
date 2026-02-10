import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { ScreenContainer, Header, Card, Spinner } from '../../../components/ui';
import { supabase } from '../../../lib/supabase';
import { getMechanicId } from '../../../lib/mechanicHelpers';
import { theme } from '../../../theme';
import type { Booking } from '../../../types';

export function MechanicBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBookings() {
      const mechanicId = await getMechanicId();
      if (cancelled) return;
      if (!mechanicId) {
        setError('Not signed in as mechanic');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('id, user_id, mechanic_id, date, time, status, created_at')
        .eq('mechanic_id', mechanicId)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (cancelled) return;
      if (fetchError) {
        setError(fetchError.message);
        setBookings([]);
      } else {
        setBookings(data ?? []);
      }
      setLoading(false);
    }

    fetchBookings();
    return () => {
      cancelled = true;
    };
  }, []);

  function formatDate(d: string) {
    const date = new Date(d + 'Z');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  if (loading) {
    return (
      <ScreenContainer>
        <Header title="Bookings" />
        <Spinner style={styles.centered} />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <Header title="Bookings" />
        <Text style={styles.error}>{error}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title="Bookings" />
      <Text style={styles.subtitle}>Appointments booked by customers</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No bookings yet.</Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.cardItem}>
            <Text style={styles.date}>{formatDate(item.date)} at {item.time}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    marginBottom: theme.spacing.lg,
  },
  list: {
    paddingBottom: theme.spacing.xl,
  },
  cardItem: {
    marginBottom: theme.spacing.md,
  },
  date: {
    ...theme.typography.body,
    fontWeight: theme.typography.subtitle.fontWeight,
    color: theme.colors.text,
  },
  status: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  error: {
    ...theme.typography.body,
    color: theme.colors.danger,
  },
  centered: {
    marginTop: theme.spacing.xl,
  },
});
