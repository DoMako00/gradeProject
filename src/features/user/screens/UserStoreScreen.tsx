import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  ScreenContainer,
  StoreHeader,
  StoreSearchBar,
  CategoryPills,
  StoreFeaturedBanner,
  ProductCard,
  FloatingIconsBackground,
} from '../../../components/ui';
import { theme } from '../../../theme';
import type { UserTabScreenProps } from '../../../types/navigation';

type Props = UserTabScreenProps<'Store'>;

const STORE_CATEGORIES = [
  { id: 'engine', label: 'Engine' },
  { id: 'oil', label: 'Oil & Fluids' },
  { id: 'tires', label: 'Tires' },
  { id: 'brakes', label: 'Brakes' },
  { id: 'batteries', label: 'Batteries' },
];

const FEATURED_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDySKNhcRSvTwXmD8zIVphhC9qzmbzctmJ_BebtLriHJ6UCAgG2CR_3FeO4aVmfiZg6pJuziEQ9w8GiOIdtIf5p5VvZic2s7dGGJo_30jRVdC_yJeWjsDMT-SUF_EJgcYTphmM4LDI-IVmSxh7Vky8dm68jiRaI4oMdYDdY8z_25M83tjkuJL_vXzokyKWbTnIgS7pDBC2nfR3cyutl7-85fSg0kzmh7hLPIGaALZG1erGYNOvZITH1TXkdzJIjX359ukb7Jo7K9boF';

const PLACEHOLDER_PRODUCTS = [
  {
    id: '1',
    brand: 'Castrol',
    name: 'Engine Oil 5W-30',
    price: '$45.00',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0Y98xe6nf-H9fkL3df8-TffGmtojZBQfWR3UUDBYJxWl0VFlLMYwpMRcb8Bg-cN3vwf4aIUBEorn9MzS8nzJfIDO1W2iU6oyasJGcvlzYsmAoK4Ot5iOONT_bu9EDiCX0hso6zGbxRNw0_l6FATETVXRHANvGiqggCDpPmjwow_sUQSapr19wCVIyvU6h2ZzUjWFkhT0OBXxa6rjBUVgUCEUAt-yzVB7jlnnirC1vICdjpRGZlYeurdcRVDqlUF3OzU-gtOzNTBAa',
  },
  {
    id: '2',
    brand: 'Michelin',
    name: 'Pilot Sport 4S',
    price: '$180.00',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDnA_U3xnA2MUon-Ia6ihoska-ISw78jtqsSwFfFBK3G-yIin6w2LaQkhx2HPgx-a96IpZHpCa2xxwFtSUFsB9hMXbSMVEj678C5cSJBhMevz2Je4BYbUvkMvBpmNkp-J4Dw9x5BJ1BSkRxTmS3eqwcnPO2JY52_B3eeoNOHOdWdME-rmQT2g4GyEOucgJzq8TFYqmoyr9dVNX9lTjHEI7k6uptIMvCvxXOmAuxPLUpcmRl_on37pN_7svs8oa_sW2ZeNX6JCkBk3zg',
  },
  {
    id: '3',
    brand: 'Bosch',
    name: 'Premium Brake Pads',
    price: '$65.00',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAEwn_-DqFPbqLVxOryH-Iu2zLtGiJAi1Qnr5EATpiMZKNSkvtMJ7yXvXef3Gux1mWXgjeDtbC3C5laOSPt7jqK_jqb-alZTcGMa4VF8oT911sNtcXCFCjrvRiGoVyTyr8kaOTAPbCFvqBfWq0Z8i6hDZg6phhdLmqoxHJNxRb4J5xq6-WTEKOqBE6wtyi8lO_8LoICQKkKcPYyuolQ9X8kiEz0SfUyznjhnaGj4FK9QH0VU36eWZ8wPz3wikAjBTw69QdBkRMBoTps',
  },
  {
    id: '4',
    brand: 'Varta',
    name: 'Blue Dynamic E11',
    price: '$120.00',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwVu6zaJ6xPOUUo0a3TWamRZLyJ00PE25Ets9JF4tE5r9bxj4TE0fraiqorGcbjrWl5ql_oLdC7b-5r1MJURWq21G4W-xZlqtxt5_htQEBvnpU1z7l0q2ZAhUW8dRRdWaB-4JRlf-Pp9L5yJswzlnu_zCKWTz29ZADfuEOmjdoeaKbt8E45T99YuuxeosD59DsnyGVEHy2LgO2UxEDPCzlag6CJLfTQDYyA0FvpyOiI-6pWd0eUF1SFLTNqBG2codiIuGbjdr8Kpzq',
  },
];

export function UserStoreScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('engine');
  const [cartCount, setCartCount] = useState(3);

  function handleCartPress() {
    // Placeholder: navigate to cart or open cart sheet
  }

  function handleFeaturedPress() {
    // Placeholder: filter or navigate to engine oil
  }

  function handleAddProduct(productId: string) {
    setCartCount((c) => c + 1);
  }

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      <FloatingIconsBackground />
      <View style={styles.headerSection}>
        <StoreHeader
          title="Parts Store"
          subtitle="Find parts for your car"
          cartCount={cartCount}
          onCartPress={handleCartPress}
          light
        />
        <StoreSearchBar
          placeholder="Search engine oil, tires, brakes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          light
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CategoryPills
          categories={STORE_CATEGORIES}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          light
          style={styles.categories}
        />

        <StoreFeaturedBanner
          badge="Limited Offer"
          title="20% off Engine Oil"
          description="Keep your engine running smooth with premium lubricants."
          buttonText="Shop Now"
          imageUri={FEATURED_IMAGE_URI}
          onPress={handleFeaturedPress}
          style={styles.banner}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {PLACEHOLDER_PRODUCTS.reduce<typeof PLACEHOLDER_PRODUCTS[]>((rows, item, i) => {
            if (i % 2 === 0) rows.push([item]);
            else rows[rows.length - 1].push(item);
            return rows;
          }, []).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.productRow}>
              {row.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  brand={product.brand}
                  name={product.name}
                  price={product.price}
                  imageUri={product.imageUri}
                  onAddPress={() => handleAddProduct(product.id)}
                  style={styles.productCard}
                />
              ))}
              {row.length === 1 ? <View style={styles.productCard} /> : null}
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
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
  },
  headerSection: {
    backgroundColor: theme.colors.white,
    marginHorizontal: -theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl + theme.layout.tabBarHeight,
  },
  categories: {
    marginBottom: theme.spacing.lg,
  },
  banner: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.subtitle,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textOnLight,
    fontWeight: '700',
  },
  seeAll: {
    ...theme.typography.caption,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  productGrid: {
    marginHorizontal: -theme.spacing.sm,
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    marginHorizontal: -theme.spacing.sm,
  },
  productCard: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: theme.spacing.sm,
  },
});
