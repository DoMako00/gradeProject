import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const c = theme.colors.cartoon;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface CartoonProductCardProps {
  name: string;
  description?: string;
  price: string;
  iconName: IconName;
  bgColor: string;
  iconColor: string;
  onAddPress?: () => void;
  style?: ViewStyle;
}

export function CartoonProductCard({
  name,
  description,
  price,
  iconName,
  bgColor,
  iconColor,
  onAddPress,
  style,
}: CartoonProductCardProps) {
  return (
    <View style={[styles.card, style]}>
      {/* Floating + button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddPress}
        activeOpacity={0.8}
        accessibilityLabel={`Add ${name} to cart`}
      >
        <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Product illustration area */}
      <View style={[styles.illustrationArea, { backgroundColor: bgColor }]}>
        <View style={styles.illustrationBlob} />
        <MaterialCommunityIcons name={iconName} size={48} color={iconColor} />
      </View>

      {/* Product info */}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      {description ? (
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      ) : null}

      {/* Price badge */}
      <View style={styles.priceBadge}>
        <Text style={styles.priceText}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  addButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: c.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: c.red,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  illustrationArea: {
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  illustrationBlob: {
    position: 'absolute',
    bottom: -12,
    right: -12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    color: c.charcoal,
    lineHeight: 18,
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    fontWeight: '600',
    color: c.gray,
    marginBottom: 8,
  },
  priceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${c.red}15`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '900',
    color: c.red,
  },
});
