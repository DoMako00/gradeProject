import React, { useEffect } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { RootNavigator } from './src/navigation';
import { theme } from './src/theme';
import { authStore } from './src/store';
import { getSessionWithProfile } from './src/lib/authHelpers';
import { supabase } from './src/lib/supabase';

// Push notifications are not supported in Expo Go (SDK 53+). Only configure in dev/production builds.
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export default function App() {
  useEffect(() => {
    let mounted = true;
    authStore.getState().setLoading(true);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        const result = await getSessionWithProfile();
        if (result) authStore.getState().setSession(result.session, result.profile, result.authUser);
      }
      authStore.getState().setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (event === 'SIGNED_OUT') {
          authStore.getState().logout();
        } else if (session) {
          const result = await getSessionWithProfile();
          if (result) authStore.getState().setSession(result.session, result.profile, result.authUser);
        }
      }
    );
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isExpoGo) return;

    async function registerPushToken() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }
      // Optional: get push token and send to backend
      // const token = (await Notifications.getExpoPushTokenAsync()).data;
    }
    registerPushToken();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaProvider style={styles.safeArea}>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
