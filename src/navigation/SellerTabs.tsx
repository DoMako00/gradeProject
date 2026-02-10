import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { SellerTabParamList } from '../types/navigation';
import { StoreScreen } from '../features/seller/screens/StoreScreen';
import { OrdersScreen } from '../features/seller/screens/OrdersScreen';
import { SellerProfileScreen } from '../features/seller/screens/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<SellerTabParamList>();

export function SellerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{ title: 'Store' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen
        name="Profile"
        component={SellerProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
