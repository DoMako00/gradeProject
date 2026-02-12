import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const c = theme.colors.cartoon;

interface CartoonStoreHeaderProps {
  userName: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  style?: ViewStyle;
}

export function CartoonStoreHeader({
  userName,
  notificationCount = 0,
  onNotificationPress,
  style,
}: CartoonStoreHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftRow}>
        {/* Cartoon Avatar */}
        <View style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            <MaterialCommunityIcons name="account" size={28} color={c.red} />
          </View>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.greeting}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      {/* Notification Bell */}
      <TouchableOpacity
        style={styles.bellButton}
        onPress={onNotificationPress}
        activeOpacity={0.7}
        accessibilityLabel={
          notificationCount > 0
            ? `${notificationCount} notifications`
            : 'Notifications'
        }
      >
        <MaterialCommunityIcons name="bell-outline" size={24} color={c.charcoal} />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md + 4,
    paddingVertical: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 3,
    backgroundColor: c.red,
    position: 'relative',
  },
  avatarInner: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: c.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: c.mint,
    borderWidth: 3,
    borderColor: c.cream,
  },
  greeting: {
    gap: 1,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.gray,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: c.charcoal,
    lineHeight: 24,
  },
  bellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: c.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
