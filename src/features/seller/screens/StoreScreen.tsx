import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenContainer, Header, Card, Button } from '../../../components/ui';
import { theme } from '../../../theme';

const PLACEHOLDER_PRODUCTS = [
  { id: '1', name: 'Engine oil 5W-30', price: 34.99 },
  { id: '2', name: 'Brake pads (set)', price: 89.99 },
  { id: '3', name: 'Air filter', price: 24.99 },
];

export function StoreScreen() {
  return (
    <ScreenContainer>
      <Header title="Store" />
      <Text style={styles.subtitle}>Manage your products</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {PLACEHOLDER_PRODUCTS.map((item) => (
          <Card key={item.id} style={styles.card}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </Card>
        ))}
      </ScrollView>
      <Button title="Add product" variant="outline" onPress={() => {}} style={styles.addButton} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginBottom: theme.spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  productName: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
  },
  price: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  addButton: {
    marginTop: theme.spacing.sm,
  },
});
