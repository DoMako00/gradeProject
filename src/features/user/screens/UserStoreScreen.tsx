import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ScreenContainer,
  CategoryPills,
  ProductCard,
} from '../../../components/ui';
import { CartoonStoreHeader } from '../../../components/ui/CartoonStoreHeader';
import { CartoonFeaturedCard } from '../../../components/ui/CartoonFeaturedCard';
import { CartoonCategoryCard } from '../../../components/ui/CartoonCategoryCard';
import { CartoonProductCard } from '../../../components/ui/CartoonProductCard';
import { theme } from '../../../theme';
import type { UserTabScreenProps } from '../../../types/navigation';

type Props = UserTabScreenProps<'Store'>;

const c = theme.colors.cartoon;

const CATEGORIES = [
  { id: 'tires', label: 'Tires', icon: 'tire' as const, bgColor: c.blueBg, iconColor: c.blue },
  { id: 'batteries', label: 'Batteries', icon: 'car-battery' as const, bgColor: c.yellowBg, iconColor: c.yellow },
  { id: 'oil', label: 'Oil', icon: 'oil' as const, bgColor: c.mintBg, iconColor: c.mint },
  { id: 'filters', label: 'Filters', icon: 'air-filter' as const, bgColor: c.purpleBg, iconColor: c.purple },
  { id: 'accessories', label: 'Accessories', icon: 'wrench' as const, bgColor: c.orangeBg, iconColor: c.orange },
  { id: 'brakes', label: 'Brakes', icon: 'disc' as const, bgColor: c.creamDark, iconColor: c.red },
];

const POPULAR_PRODUCTS = [
  {
    id: '1',
    name: 'Sport Tire Pro',
    description: 'All-season performance',
    price: '$89.99',
    icon: 'tire' as const,
    bgColor: c.blueBg,
    iconColor: c.blue,
  },
  {
    id: '2',
    name: 'Power Battery',
    description: 'Long-lasting energy',
    price: '$120.00',
    icon: 'car-battery' as const,
    bgColor: c.yellowBg,
    iconColor: c.yellow,
  },
  {
    id: '3',
    name: 'Synthetic Oil',
    description: '5W-30 premium blend',
    price: '$45.00',
    icon: 'oil' as const,
    bgColor: c.mintBg,
    iconColor: c.mint,
  },
  {
    id: '4',
    name: 'Air Filter Plus',
    description: 'Fresh clean engine air',
    price: '$24.99',
    icon: 'air-filter' as const,
    bgColor: c.purpleBg,
    iconColor: c.purple,
  },
  {
    id: '5',
    name: 'Ceramic Brakes',
    description: 'Smooth & silent stop',
    price: '$65.00',
    icon: 'disc' as const,
    bgColor: c.orangeBg,
    iconColor: c.orange,
  },
  {
    id: '6',
    name: 'Spark Plugs',
    description: 'Iridium 4-pack set',
    price: '$32.50',
    icon: 'lightning-bolt' as const,
    bgColor: c.creamDark,
    iconColor: c.red,
  },
];

export function UserStoreScreen({ navigation }: Props) {
  const [cartCount, setCartCount] = useState(3);

  function handleAddProduct(productId: string) {
    setCartCount((prev) => prev + 1);
  }

  function handleCartPress() {
    // Navigate to cart
  }

  function handleNotificationPress() {
    // Navigate to notifications
  }

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      {/* Decorative background blobs */}
      <View style={styles.blobRed} />
      <View style={styles.blobBlue} />
      <View style={styles.blobGreen} />

      {/* Header */}
      <CartoonStoreHeader
        userName="Mohamed"
        notificationCount={3}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Product Card */}
        <CartoonFeaturedCard
          badge="Best Seller"
          title={'Premium\nEngine Oil'}
          description="Keep your engine happy & smooth!"
          price="$45.99"
          originalPrice="$59.99"
          onAddToCart={() => handleAddProduct('featured')}
          style={styles.featured}
        />

        {/* Categories Row */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          style={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => (
            <CartoonCategoryCard
              key={cat.id}
              label={cat.label}
              iconName={cat.icon}
              bgColor={cat.bgColor}
              iconColor={cat.iconColor}
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        {/* Popular Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {POPULAR_PRODUCTS.reduce<typeof POPULAR_PRODUCTS[]>((rows, item, i) => {
            if (i % 2 === 0) rows.push([item]);
            else rows[rows.length - 1].push(item);
            return rows;
          }, []).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.productRow}>
              {row.map((product) => (
                <CartoonProductCard
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  iconName={product.icon}
                  bgColor={product.bgColor}
                  iconColor={product.iconColor}
                  onAddPress={() => handleAddProduct(product.id)}
                  style={styles.productCard}
                />
              ))}
              {row.length === 1 && <View style={styles.productCard} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.cream,
  },
  // Decorative blobs
  blobRed: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: `${c.red}12`,
  },
  blobBlue: {
    position: 'absolute',
    top: '33%',
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${c.blue}12`,
  },
  blobGreen: {
    position: 'absolute',
    bottom: '25%',
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${c.mint}12`,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl + theme.layout.tabBarHeight,
  },
  featured: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md + 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: c.charcoal,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: c.red,
  },
  categoriesScroll: {
    marginBottom: theme.spacing.lg,
  },
  categoriesContent: {
    paddingHorizontal: theme.spacing.md,
    gap: 12,
  },
  productGrid: {
    paddingHorizontal: theme.spacing.md,
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  productCard: {
    flex: 1,
    minWidth: 0,
  },
});
