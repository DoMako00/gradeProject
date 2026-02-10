import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer, Header, Card, Button } from '../../../components/ui';
import { useAuth } from '../../../hooks/useAuth';
import { theme } from '../../../theme';

export function SellerProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScreenContainer>
      <Header title="Profile" />
      <Card style={styles.card}>
        <Text style={styles.role}>Seller</Text>
        {user ? (
          <Text style={styles.email}>{user.email}</Text>
        ) : null}
      </Card>
      <Button
        title="Sign Out"
        variant="outline"
        onPress={logout}
        style={styles.signOut}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.lg,
  },
  role: {
    ...theme.typography.caption,
    color: theme.colors.muted,
  },
  email: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  signOut: {
    marginTop: theme.spacing.md,
  },
});
