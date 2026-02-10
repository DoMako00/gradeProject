import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MechanicTabParamList } from '../types/navigation';
import { RequestsNearbyScreen } from '../features/mechanic/screens/RequestsNearbyScreen';
import { JobsScreen } from '../features/mechanic/screens/JobsScreen';
import { MechanicBookingsScreen } from '../features/mechanic/screens/MechanicBookingsScreen';
import { MechanicProfileScreen } from '../features/mechanic/screens/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<MechanicTabParamList>();

export function MechanicTabs() {
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
        name="Requests"
        component={RequestsNearbyScreen}
        options={{ title: 'Nearby requests' }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
        options={{ title: 'Jobs' }}
      />
      <Tab.Screen
        name="Bookings"
        component={MechanicBookingsScreen}
        options={{ title: 'Bookings' }}
      />
      <Tab.Screen
        name="Profile"
        component={MechanicProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
