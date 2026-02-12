import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const c = theme.colors.cartoon;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface CartoonCategoryCardProps {
  label: string;
  iconName: IconName;
  bgColor: string;
  iconColor: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function CartoonCategoryCard({
  label,
  iconName,
  bgColor,
  iconColor,
  onPress,
  style,
}: CartoonCategoryCardProps) {
  return (
    <TouchableOpacity
      style={[styles.wrapper, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
        <MaterialCommunityIcons name={iconName} size={28} color={iconColor} />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 76,
    gap: 6,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: c.charcoal,
    textAlign: 'center',
  },
});
