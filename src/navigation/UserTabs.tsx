import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { UserTabParamList } from '../types/navigation';
import { HomeScreen } from '../features/user/screens/HomeScreen';
import { BookingsScreen } from '../features/user/screens/BookingsScreen';
import { UserStoreScreen } from '../features/user/screens/UserStoreScreen';
import { ProfileScreen } from '../features/user/screens/ProfileScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator<UserTabParamList>();

const tabIcons: Record<keyof UserTabParamList, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  Home: 'home',
  Bookings: 'calendar-today',
  Store: 'shopping',
  Profile: 'account',
};

export function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name={tabIcons[route.name]}
            size={size ?? 26}
            color={color}
          />
        ),
        headerStyle: { backgroundColor: theme.colors.white },
        headerTintColor: theme.colors.textOnLight,
        headerTitleStyle: { color: theme.colors.textOnLight, fontWeight: '600' },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home', headerShown: false }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ title: 'Bookings', headerShown: false }}
      />
      <Tab.Screen
        name="Store"
        component={UserStoreScreen}
        options={{ title: 'Store', headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Tab.Navigator>
  );
}
