import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  Animated,
  View,
  TouchableOpacity,
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
} from '../../../components/ui';
import { getCurrentPosition } from '../../../utils/location';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../store';
import { theme } from '../../../theme';
import type { UserTabScreenProps } from '../../../types/navigation';

type Props = UserTabScreenProps<'Home'>;

const HEADER_HEIGHT = 60;

/** Activity card backgrounds: all red (#d72638) for consistent look */
const ACTIVITY_CARD_COLORS = ['#d72638'] as const;

const RECENT_ACTIVITY_VISIBLE_COUNT = 3;

const PLACEHOLDER_USER = {
  name: 'Alex Mitchell',
  avatarUri: undefined as string | undefined,
};

const PLACEHOLDER_ACTIVITIES = [
  {
    id: '1',
    title: 'Battery Replacement',
    subtitle: 'Delivered • Yesterday',
    status: 'Completed at 3:42 PM',
    amount: '$120.00',
    icon: 'truck-delivery' as const,
    iconColor: theme.colors.primary,
    amountMuted: false,
  },
  {
    id: '2',
    title: 'Full Diagnostics',
    subtitle: 'Booking • Oct 24, 2:00 PM',
    status: 'Scheduled',
    amount: 'Upcoming',
    icon: 'car-wrench' as const,
    iconColor: theme.colors.purple,
    amountMuted: true,
  },
  {
    id: '3',
    title: 'Oil Change & Filter',
    subtitle: 'Completed • Oct 18',
    status: 'Service at your location',
    amount: '$85.00',
    icon: 'oil' as const,
    iconColor: theme.colors.success,
    amountMuted: false,
  },
  {
    id: '4',
    title: 'Brake Pad Replacement',
    subtitle: 'In progress • Today',
    status: 'Mechanic en route',
    amount: '$240.00',
    icon: 'car-brake-parking' as const,
    iconColor: theme.colors.orange,
    amountMuted: false,
  },
  {
    id: '5',
    title: 'Tire Rotation',
    subtitle: 'Completed • Oct 12',
    status: 'Quick service',
    amount: '$45.00',
    icon: 'circle-outline' as const,
    iconColor: theme.colors.primary,
    amountMuted: false,
  },
];

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);

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
  const promoAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(promoAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [heroAnim, actionRowAnim, activityAnim, promoAnim]);

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

  const displayUser = {
    name: user?.name ?? PLACEHOLDER_USER.name,
    avatarUri: PLACEHOLDER_USER.avatarUri,
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
            <TouchableOpacity>
              <Text style={styles.recentActivitySeeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {PLACEHOLDER_ACTIVITIES.slice(0, RECENT_ACTIVITY_VISIBLE_COUNT).map((item, index) => {
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
            })}
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
});
