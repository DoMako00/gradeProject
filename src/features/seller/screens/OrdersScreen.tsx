import React from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import { ScreenContainer, Header, Card } from '../../../components/ui';
import { theme } from '../../../theme';

const PLACEHOLDER_ORDERS = [
  { id: 'ORD-001', status: 'pending', date: '2025-02-08' },
  { id: 'ORD-002', status: 'confirmed', date: '2025-02-07' },
  { id: 'ORD-003', status: 'completed', date: '2025-02-05' },
];

export function OrdersScreen() {
  return (
    <ScreenContainer>
      <Header title="Orders" />
      <FlatList
        data={PLACEHOLDER_ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No orders yet.</Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.cardItem}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: theme.spacing.xl,
  },
  cardItem: {
    marginBottom: theme.spacing.md,
  },
  orderId: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
  },
  status: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },
  date: {
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
});
