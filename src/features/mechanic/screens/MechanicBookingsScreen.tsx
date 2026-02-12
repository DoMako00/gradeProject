import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  ScreenContainer,
  CartoonEmptyState,
  FloatingIconsBackground,
  SketchFill,
  Spinner,
} from '../../../components/ui';
import { supabase } from '../../../lib/supabase';
import { getMechanicId } from '../../../lib/mechanicHelpers';
import { theme } from '../../../theme';
import type { Booking } from '../../../types';

const c = theme.colors.cartoon;

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
      <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
        <FloatingIconsBackground />
        <Spinner style={styles.centered} />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
        <FloatingIconsBackground />
        <Text style={styles.error}>{error}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      <FloatingIconsBackground />
      <Text style={styles.subtitle}>Appointments booked by customers</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <CartoonEmptyState
            icon="calendar-blank-outline"
            title="No bookings yet"
            message="Bookings from customers will appear here."
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <View style={styles.cardShadow}>
              <SketchFill />
            </View>
            <View style={styles.cardItem}>
            <Text style={styles.date}>{formatDate(item.date)} at {item.time}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            </View>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.cream,
    paddingHorizontal: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.caption,
    color: c.gray,
    marginBottom: theme.spacing.md,
  },
  list: {
    paddingBottom: theme.spacing.xl + theme.layout.tabBarHeight,
  },
  cardWrap: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  cardShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    borderRadius: 20,
    backgroundColor: theme.colors.lightAccent,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    overflow: 'hidden',
  },
  cardItem: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.md,
  },
  date: {
    ...theme.typography.body,
    fontWeight: '700',
    color: c.charcoal,
  },
  status: {
    ...theme.typography.caption,
    color: c.gray,
    marginTop: theme.spacing.xs,
  },
  error: {
    ...theme.typography.body,
    color: theme.colors.danger,
  },
  centered: {
    marginTop: theme.spacing.xl,
  },
});
