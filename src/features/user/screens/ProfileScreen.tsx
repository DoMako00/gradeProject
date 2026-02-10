import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ScreenContainer,
  HomeHeader,
  ProfileAvatar,
  VehicleCard,
  MenuRow,
  FloatingIconsBackground,
} from '../../../components/ui';
import { useAuth } from '../../../hooks/useAuth';
import { theme } from '../../../theme';
import type { UserTabScreenProps } from '../../../types/navigation';

type Props = UserTabScreenProps<'Profile'>;

const PLACEHOLDER_VEHICLE = {
  title: 'Toyota Camry',
  subtitle: 'SE • 2021',
  licensePlate: '4XYZ123',
  verified: true,
  imageUri: null as string | null,
};

const APP_VERSION = '2.4.0 (Build 392)';

export function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  function handleEdit() {
    // Placeholder: navigate to edit profile or open modal
  }

  function handleCamera() {
    // Placeholder: open image picker
  }

  function handleAddVehicle() {
    // Placeholder: navigate to add vehicle
  }

  function handlePaymentMethods() {
    // Placeholder: navigate to payment methods
  }

  function handleServiceHistory() {
    // Placeholder: navigate to service history
  }

  function handleSettings() {
    // Placeholder: navigate to settings
  }

  function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  }

  const displayName = user?.name ?? 'Alex Johnson';
  const displayEmail = user?.email ?? 'alex.j@example.com';

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      <FloatingIconsBackground />
      <View style={styles.headerWrapper}>
        <HomeHeader
          user={{ name: displayName, avatarUri: undefined }}
          notifications={{ unread: false }}
          onNotificationPress={() => {}}
          light
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <ProfileAvatar onCameraPress={handleCamera} />
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Premium Member</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Garage</Text>
            <TouchableOpacity onPress={handleAddVehicle}>
              <Text style={styles.sectionLink}>Add New</Text>
            </TouchableOpacity>
          </View>
          <VehicleCard
            title={PLACEHOLDER_VEHICLE.title}
            subtitle={PLACEHOLDER_VEHICLE.subtitle}
            licensePlate={PLACEHOLDER_VEHICLE.licensePlate}
            verified={PLACEHOLDER_VEHICLE.verified}
            imageUri={PLACEHOLDER_VEHICLE.imageUri}
            onHistoryPress={() => {}}
            onSchedulePress={() => navigation.navigate('Bookings')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon="credit-card"
              iconColor={theme.colors.primary}
              title="Payment Methods"
              subtitle="Visa ending in 4242"
              onPress={handlePaymentMethods}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              icon="wrench"
              iconColor={theme.colors.orange}
              title="Service History"
              subtitle="View all past repairs"
              onPress={handleServiceHistory}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              icon="cog"
              iconColor={theme.colors.textSecondary}
              title="Settings"
              subtitle="Notifications, Privacy"
              onPress={handleSettings}
            />
          </View>
        </View>

        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <View style={styles.signOutContent}>
              <MaterialCommunityIcons name="logout" size={22} color={theme.colors.red} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.version}>Version {APP_VERSION}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
  },
  headerWrapper: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl + theme.layout.tabBarHeight,
  },
  identity: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  name: {
    ...theme.typography.title,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: theme.colors.textOnLight,
    marginTop: theme.spacing.md,
  },
  email: {
    ...theme.typography.body,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.muted,
    fontWeight: '500',
    marginTop: theme.spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: `${theme.colors.primary}1A`,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  sectionTitle: {
    ...theme.typography.subtitle,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textOnLight,
    fontWeight: '700',
  },
  sectionLink: {
    ...theme.typography.caption,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  menuCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  signOutSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  signOutButton: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: `${theme.colors.red}1A`,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  signOutText: {
    ...theme.typography.subtitle,
    color: theme.colors.red,
    fontWeight: '700',
  },
  version: {
    ...theme.typography.caption,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
