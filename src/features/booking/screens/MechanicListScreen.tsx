import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ScreenContainer, Card } from '../../../components/ui';
import { supabase } from '../../../lib/supabase';
import { theme } from '../../../theme';
import type { MechanicWithProfile } from '../../../types';
import type { UserStackScreenProps } from '../../../types/navigation';

type Props = UserStackScreenProps<'MechanicList'>;

export function MechanicListScreen({ navigation }: Props) {
  const [mechanics, setMechanics] = useState<MechanicWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMechanics() {
      const { data: mechanicsData, error: mechanicsError } = await supabase
        .from('mechanics')
        .select('id, user_id, workshop_name, experience_years, rating, availability_status, created_at, updated_at');

      if (cancelled) return;
      if (mechanicsError) {
        setError(mechanicsError.message);
        setLoading(false);
        return;
      }
      if (!mechanicsData?.length) {
        setMechanics([]);
        setLoading(false);
        return;
      }

      const userIds = [...new Set(mechanicsData.map((m) => m.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);

      if (cancelled) return;
      const profileMap = new Map(
        (profilesData || []).map((p) => [p.id, { name: p.name, email: p.email }])
      );
      const withProfile: MechanicWithProfile[] = mechanicsData.map((m) => ({
        ...m,
        profile: profileMap.get(m.user_id) ?? null,
      }));
      setMechanics(withProfile);
      setLoading(false);
    }

    fetchMechanics();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSelectMechanic(mechanicId: string) {
    navigation.navigate('MechanicProfile', { mechanicId });
  }

  if (loading) {
    return (
      <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.centered} />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
        <Text style={styles.error}>{error}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Select a mechanic</Text>
      <Text style={styles.subtitle}>Tap to view profile and book</Text>
      <FlatList
        data={mechanics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No mechanics available.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectMechanic(item.id)}
            activeOpacity={0.8}
          >
            <Card style={styles.card}>
              <Text style={styles.workshopName}>
                {item.workshop_name || item.profile?.name || 'Mechanic'}
              </Text>
              {item.rating != null && (
                <Text style={styles.rating}>Rating: {Number(item.rating).toFixed(1)}</Text>
              )}
              {item.experience_years != null && (
                <Text style={styles.meta}>{item.experience_years} years experience</Text>
              )}
            </Card>
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.textOnLight,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  list: {
    paddingBottom: theme.spacing.xl,
  },
  card: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  workshopName: {
    ...theme.typography.subtitle,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textOnLight,
  },
  rating: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },
  meta: {
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
