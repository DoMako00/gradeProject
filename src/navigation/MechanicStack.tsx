import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MechanicStackParamList } from '../types/navigation';
import { MechanicTabs } from './MechanicTabs';
import { MechanicActiveJobScreen } from '../features/mechanic/screens/ActiveJobScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<MechanicStackParamList>();

export function MechanicStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="MechanicTabs"
        component={MechanicTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ActiveJob"
        component={MechanicActiveJobScreen}
        options={{ title: 'Active job' }}
      />
    </Stack.Navigator>
  );
}
