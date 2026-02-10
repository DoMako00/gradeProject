import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../store';
import { AuthStack } from './AuthStack';
import { UserStack } from './UserStack';
import { MechanicStack } from './MechanicStack';
import { SellerTabs } from './SellerTabs';
import type { Role } from '../types';
import { colors } from '../theme';

export function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!isAuthenticated || !user) {
    return <AuthStack />;
  }

  switch (user.role as Role) {
    case 'user':
      return <UserStack />;
    case 'mechanic':
      return <MechanicStack />;
    case 'seller':
      return <SellerTabs />;
    default:
      return <AuthStack />;
  }
}
