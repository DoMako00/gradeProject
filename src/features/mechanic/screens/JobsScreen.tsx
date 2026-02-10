import React, { useEffect, useState, useCallback } from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer, Header, Card, Button, Spinner } from '../../../components/ui';
import { supabase } from '../../../lib/supabase';
import { getMechanicId } from '../../../lib/mechanicHelpers';
import { theme } from '../../../theme';
import type { MechanicTabScreenProps } from '../../../types/navigation';

type ActiveRequest = {
  id: string;
  status: string;
  problem_description: string | null;
  created_at: string;
};

type Props = MechanicTabScreenProps<'Jobs'>;

export function JobsScreen({ navigation }: Props) {
  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchActive = useCallback(async () => {
    const mechanicId = await getMechanicId();
    if (!mechanicId) {
      setActiveRequest(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('requests')
      .select('id, status, problem_description, created_at')
      .eq('mechanic_id', mechanicId)
      .in('status', ['accepted', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    setActiveRequest(data as ActiveRequest | null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchActive();
    });
    return unsubscribe;
  }, [navigation, fetchActive]);

  const handleView = () => {
    if (!activeRequest) return;
    const parent = navigation.getParent();
    if (parent) {
      (parent as { navigate: (name: 'ActiveJob', params: { requestId: string }) => void }).navigate(
        'ActiveJob',
        { requestId: activeRequest.id }
      );
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <Header title="Jobs" />
        <Spinner style={styles.spinner} />
      </ScreenContainer>
    );
  }

  if (!activeRequest) {
    return (
      <ScreenContainer>
        <Header title="Jobs" />
        <Text style={styles.empty}>No active job. Accept a request from the Requests tab.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title="Jobs" />
      <Card style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{activeRequest.status}</Text>
        {activeRequest.problem_description ? (
          <>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{activeRequest.problem_description}</Text>
          </>
        ) : null}
        <Text style={styles.label}>Accepted</Text>
        <Text style={styles.value}>{new Date(activeRequest.created_at).toLocaleString()}</Text>
        <Button title="View job" onPress={handleView} style={styles.button} />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  spinner: {
    marginTop: theme.spacing.xl,
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginTop: theme.spacing.md,
  },
  card: {
    marginTop: theme.spacing.md,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    marginTop: theme.spacing.md,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  button: {
    marginTop: theme.spacing.lg,
  },
});
