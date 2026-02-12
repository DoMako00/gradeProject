import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  Animated,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ScreenContainer,
  HomeHeader,
  HeroCard,
  ActionCard,
  ActivityItem,
  PromoBanner,
  FloatingIconsBackground,
  CartoonProductCard,
} from '../../../components/ui';
import { useCartStore } from '../../../store';
import { getCurrentPosition } from '../../../utils/location';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../store';
import { theme } from '../../../theme';
import type { UserTabScreenProps } from '../../../types/navigation';

type Props = UserTabScreenProps<'Home'>;

const HEADER_HEIGHT = 60;

/** Activity card backgrounds: all red (#d72638) for consistent look */
const ACTIVITY_CARD_COLORS = ['#d72638'] as const;

const RECENT_ACTIVITY_VISIBLE_COUNT = 5;

const HOME_STORE_ITEMS = [
  { id: '1', name: 'Sport Tire Pro', description: 'All-season', price: '$89.99', icon: 'tire' as const, bgColor: '#E8F4FF', iconColor: '#6EC6FF' },
  { id: '2', name: 'Synthetic Oil', description: '5W-30 blend', price: '$45.00', icon: 'oil' as const, bgColor: '#E8FFF3', iconColor: '#7EEAB3' },
  { id: '3', name: 'Power Battery', description: 'Long-lasting', price: '$120.00', icon: 'car-battery' as const, bgColor: '#FFF8E8', iconColor: '#FFD66B' },
  { id: '4', name: 'Air Filter Plus', description: 'Clean engine air', price: '$24.99', icon: 'air-filter' as const, bgColor: '#F3ECFF', iconColor: '#C4A1FF' },
];

type ActivityItemData = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  amount: string;
  icon: 'truck-delivery' | 'car-wrench' | 'oil' | 'car-brake-parking' | 'calendar-today' | 'hammer-wrench';
  iconColor: string;
  amountMuted: boolean;
  sortAt?: number;
};

function formatActivityDate(d: string, time?: string) {
  const date = new Date(d + (time ? `T${time}` : 'Z'));
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((s) => s.addItem);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<ActivityItemData[]>([]);

  const headerTop = insets.top;
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -(headerTop + HEADER_HEIGHT)],
    extrapolate: 'clamp',
  });

  const scrollPaddingTop = headerTop + HEADER_HEIGHT - 18;

  const heroAnim = useRef(new Animated.Value(0)).current;
  const actionRowAnim = useRef(new Animated.Value(0)).current;
  const activityAnim = useRef(new Animated.Value(0)).current;
  const storeAnim = useRef(new Animated.Value(0)).current;
  const promoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    async function fetchActivities() {
      const [requestsRes, bookingsRes] = await Promise.all([
        supabase
          .from('requests')
          .select('id, status, problem_description, price, created_at')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('bookings')
          .select('id, date, time, status')
          .eq('user_id', user!.id)
          .order('date', { ascending: false })
          .order('time', { ascending: false })
          .limit(10),
      ]);
      if (cancelled) return;
      const items: ActivityItemData[] = [];
      (requestsRes.data ?? []).forEach((r) => {
        items.push({
          id: `req-${r.id}`,
          title: r.problem_description || 'Mechanic request',
          subtitle: `${formatActivityDate(r.created_at)} • Request`,
          status: r.status.replace('_', ' '),
          amount: r.price != null ? `$${Number(r.price).toFixed(2)}` : '—',
          icon: r.status === 'accepted' || r.status === 'in_progress' ? 'hammer-wrench' : 'car-wrench',
          iconColor: theme.colors.primary,
          amountMuted: r.status === 'pending' || r.status === 'cancelled',
          sortAt: new Date(r.created_at).getTime(),
        });
      });
      (bookingsRes.data ?? []).forEach((b) => {
        const dt = new Date(`${b.date}T${b.time}`).getTime();
        items.push({
          id: `book-${b.id}`,
          title: 'Scheduled appointment',
          subtitle: `${formatActivityDate(b.date, b.time)} • Booking`,
          status: b.status === 'pending' ? 'Scheduled' : b.status.replace('_', ' '),
          amount: b.status === 'pending' ? 'Upcoming' : b.status === 'completed' ? 'Done' : '—',
          icon: 'calendar-today',
          iconColor: theme.colors.purple,
          amountMuted: b.status !== 'pending',
          sortAt: dt,
        });
      });
      items.sort((a, b) => (b.sortAt ?? 0) - (a.sortAt ?? 0));
      setActivities(items.slice(0, RECENT_ACTIVITY_VISIBLE_COUNT));
    }
    fetchActivities();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    Animated.stagger(80, [
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(actionRowAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(activityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(storeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(promoAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [heroAnim, actionRowAnim, activityAnim, storeAnim, promoAnim]);

  const fadeIn = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }),
      },
    ],
  });

  async function handleRequestMechanic() {
    if (!user?.id) {
      Alert.alert('Error', 'You must be signed in to request a mechanic.');
      return;
    }
    setLoading(true);
    try {
      const location = await getCurrentPosition();
      if (!location) {
        Alert.alert(
          'Location required',
          'Please enable location access to request a mechanic.'
        );
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('requests')
        .insert({
          user_id: user.id,
          status: 'pending',
          location_lat: location.coords.latitude,
          location_lng: location.coords.longitude,
        })
        .select('id')
        .single();

      if (error) {
        Alert.alert('Error', error.message);
        setLoading(false);
        return;
      }
      const stack = navigation.getParent();
      if (stack) {
        (stack as { navigate: (name: string, params: { requestId: string }) => void }).navigate(
          'Searching',
          { requestId: data.id }
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleBookMechanic() {
    const stack = navigation.getParent();
    if (stack && 'navigate' in stack) {
      (stack as { navigate: (name: string) => void }).navigate('MechanicList');
    }
  }

  function handleGoToStore() {
    navigation.navigate('Store');
  }

  function handleAddStoreItem(productId: string, name: string, price: string) {
    addItem(productId, name, price, 1);
  }

  const displayUser = {
    name: user?.name ?? 'Guest',
    avatarUri: undefined as string | undefined,
  };

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      <FloatingIconsBackground />
      <Animated.View
        style={[
          styles.headerWrapper,
          {
            top: headerTop,
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <HomeHeader
          user={displayUser}
          notifications={{ unread: true }}
          onNotificationPress={() => {}}
          light
        />
      </Animated.View>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: scrollPaddingTop }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={fadeIn(heroAnim)}>
          <HeroCard
            title="Emergency Mechanic"
            description="Stuck on the road? Tap to request immediate assistance to your location."
            icon="tow-truck"
            buttonText="Request Now"
            onPress={handleRequestMechanic}
            badge="Emergency"
            loading={loading}
            lightBackground
          />
        </Animated.View>

        <Animated.View style={[styles.storeSection, fadeIn(storeAnim)]}>
          <View style={styles.recentActivityHeader}>
            <Text style={styles.recentActivityTitle}>Shop Parts</Text>
            <TouchableOpacity onPress={handleGoToStore}>
              <Text style={styles.recentActivitySeeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storeScrollContent}
          >
            {HOME_STORE_ITEMS.map((item) => (
              <CartoonProductCard
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                iconName={item.icon}
                bgColor={item.bgColor}
                iconColor={item.iconColor}
                onAddPress={() => handleAddStoreItem(item.id, item.name, item.price)}
                compact
                style={styles.storeCard}
              />
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[styles.actionRow, fadeIn(actionRowAnim)]}>
          <ActionCard
            title="Book Service"
            subtitle="Maintenance & Repairs"
            icon="calendar-month"
            bgColor={theme.colors.success}
            onPress={handleBookMechanic}
            lightBackground
            style={styles.actionCard}
          />
          <ActionCard
            title="Parts Store"
            subtitle="Buy Genuine Parts"
            icon="shopping"
            bgColor={theme.colors.secondary}
            onPress={handleGoToStore}
            lightBackground
            style={styles.actionCard}
          />
        </Animated.View>

        <Animated.View style={[styles.recentActivityBlock, { marginTop: theme.spacing.lg }, fadeIn(activityAnim)]}>
          <View style={styles.recentActivityHeader}>
            <Text style={styles.recentActivityTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
              <Text style={styles.recentActivitySeeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {activities.length === 0 ? (
              <Text style={styles.emptyActivity}>No recent activity. Book a mechanic or request one from Home.</Text>
            ) : (
              activities.map((item, index) => {
                const cardColor = ACTIVITY_CARD_COLORS[index % ACTIVITY_CARD_COLORS.length];
                const shadowBackgroundColor = theme.colors.black;
                return (
                  <ActivityItem
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    status={item.status}
                    amount={item.amount}
                    icon={item.icon}
                    iconColor={item.iconColor}
                    amountMuted={item.amountMuted}
                    backgroundColor={cardColor}
                    useLightText={false}
                    useRedText={false}
                    shadowBackgroundColor={shadowBackgroundColor}
                    variant="light"
                    style={styles.activityItem}
                  />
                );
              })
            )}
          </View>
        </Animated.View>

        <Animated.View style={[{ marginTop: theme.spacing.lg }, fadeIn(promoAnim)]}>
          <PromoBanner
            title="Pro Membership"
            subtitle="Get 20% off on your first tow"
            icon="percent"
            light
          />
        </Animated.View>
      </Animated.ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.layout.tabBarHeight,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  actionCard: {
    flex: 1,
  },
  recentActivityBlock: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recentActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  recentActivityTitle: {
    ...theme.typography.subtitle,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textOnLight,
  },
  recentActivitySeeAll: {
    ...theme.typography.caption,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  activityList: {
    gap: theme.spacing.md,
  },
  activityItem: {
    marginBottom: 0,
  },
  storeSection: {
    marginTop: theme.spacing.md,
  },
  storeScrollContent: {
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  storeCard: {
    width: 89,
    flex: 0,
  },
  emptyActivity: {
    ...theme.typography.body,
    color: theme.colors.muted,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
});
