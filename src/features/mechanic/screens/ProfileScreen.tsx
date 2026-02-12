import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  CartoonActionButton,
  CartoonEmptyState,
  CartoonProfileAvatar,
  FloatingIconsBackground,
  ScreenContainer,
  SketchFill,
} from '../../../components/ui';
import { useAuth } from '../../../hooks/useAuth';
import { theme } from '../../../theme';
import { mockMechanicProfile } from '../data/mockMechanicData';

const c = theme.colors.cartoon;

function BentoCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.cardWrap, style]}>
      <View style={styles.cardShadow}>
        <SketchFill />
      </View>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export function MechanicProfileScreen() {
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width >= 920;
  const [availability, setAvailability] = React.useState(mockMechanicProfile.availability);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    services: true,
    portfolio: true,
    stats: true,
  });

  const toggleExpand = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      <FloatingIconsBackground />
      <View style={styles.blobRed} />
      <View style={styles.blobPurple} />
      <View style={styles.blobMint} />
      <ScrollView contentContainerStyle={styles.content}>
        <BentoCard style={styles.heroWrap}>
          <View style={styles.heroCard}>
          <CartoonProfileAvatar avatarUrl={mockMechanicProfile.avatarUrl} />
          <Text style={styles.name}>{mockMechanicProfile.name}</Text>
          <Text style={styles.workshop}>{mockMechanicProfile.workshopName}</Text>
          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, index) => (
              <MaterialCommunityIcons
                key={index}
                name={index < Math.round(mockMechanicProfile.rating) ? 'star' : 'star-outline'}
                size={18}
                color={theme.colors.cartoon.yellow}
              />
            ))}
            <Text style={styles.ratingValue}>{mockMechanicProfile.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.caption}>
            {mockMechanicProfile.experienceYears} years experience
          </Text>
          </View>
        </BentoCard>

        <View style={[styles.bentoRow, isTablet && styles.bentoRowTablet]}>
        <BentoCard style={isTablet ? styles.bentoHalf : undefined}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <Switch
              value={availability}
              onValueChange={(value) => {
                console.log('[MechanicProfile] Toggle availability', value);
                setAvailability(value);
              }}
            />
          </View>
          <Text style={styles.sectionBody}>
            Current status: {availability ? 'Available for nearby requests' : 'Temporarily unavailable'}
          </Text>
        </BentoCard>

        <BentoCard style={isTablet ? styles.bentoHalf : undefined}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.sectionBody}>{user?.email ?? mockMechanicProfile.email}</Text>
          <Text style={styles.sectionBody}>{mockMechanicProfile.phone ?? 'Phone unavailable'}</Text>
        </BentoCard>
        </View>

        <BentoCard>
          <Pressable style={styles.sectionHeader} onPress={() => toggleExpand('services')}>
            <Text style={styles.sectionTitle}>Skills and services</Text>
            <MaterialCommunityIcons
              name={expanded.services ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.cartoon.charcoal}
            />
          </Pressable>
          {expanded.services ? (
            <>
              <View style={styles.tagWrap}>
                {mockMechanicProfile.services.map((service) => (
                  <View key={service} style={styles.tag}>
                    <Text style={styles.tagText}>{service}</Text>
                  </View>
                ))}
              </View>
              <CartoonActionButton
                label="Add skill"
                variant="secondary"
                icon="plus-circle-outline"
                onPress={() => console.log('[MechanicProfile] Add skill')}
                fullWidth
              />
            </>
          ) : null}
        </BentoCard>

        <BentoCard>
          <Text style={styles.sectionTitle}>Service areas</Text>
          <View style={styles.areaRow}>
            {mockMechanicProfile.serviceAreas.map((area) => (
              <View key={area} style={styles.areaBadge}>
                <MaterialCommunityIcons
                  name="map-marker-radius-outline"
                  size={14}
                  color={theme.colors.cartoon.blue}
                />
                <Text style={styles.areaText}>{area}</Text>
              </View>
            ))}
          </View>
        </BentoCard>

        <BentoCard>
          <Pressable style={styles.sectionHeader} onPress={() => toggleExpand('portfolio')}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <MaterialCommunityIcons
              name={expanded.portfolio ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.cartoon.charcoal}
            />
          </Pressable>
          {expanded.portfolio ? (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {mockMechanicProfile.portfolio.map((item) => (
                  <View key={item.id} style={styles.portfolioCard}>
                    <Image source={{ uri: item.imageUrl }} style={styles.portfolioImage} />
                    <Text style={styles.portfolioTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <CartoonActionButton
                label="Add portfolio item"
                variant="primary"
                icon="plus-circle-outline"
                onPress={() => console.log('[MechanicProfile] Add portfolio item')}
                fullWidth
              />
            </>
          ) : (
            <CartoonEmptyState
              icon="image-off-outline"
              title="Portfolio collapsed"
              message="Expand this section to preview recent work."
            />
          )}
        </BentoCard>

        <BentoCard>
          <Pressable style={styles.sectionHeader} onPress={() => toggleExpand('stats')}>
            <Text style={styles.sectionTitle}>Stats</Text>
            <MaterialCommunityIcons
              name={expanded.stats ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.cartoon.charcoal}
            />
          </Pressable>
          {expanded.stats ? (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockMechanicProfile.jobsCompleted}</Text>
                <Text style={styles.statLabel}>Jobs completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockMechanicProfile.rating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockMechanicProfile.avgResponseTimeMin}m</Text>
                <Text style={styles.statLabel}>Avg response</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockMechanicProfile.avgJobDurationMin}m</Text>
                <Text style={styles.statLabel}>Avg job time</Text>
              </View>
            </View>
          ) : null}
        </BentoCard>

        <CartoonActionButton
          label="Sign Out"
          variant="reject"
          icon="logout"
          onPress={() => {
            console.log('[MechanicProfile] Sign out');
            logout();
          }}
          fullWidth
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.cream,
    paddingHorizontal: theme.spacing.md,
  },
  blobRed: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: `${c.red}12`,
  },
  blobPurple: {
    position: 'absolute',
    top: '40%',
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${c.purple}12`,
  },
  blobMint: {
    position: 'absolute',
    bottom: '20%',
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${c.mint}12`,
  },
  content: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl + theme.layout.tabBarHeight,
  },
  cardWrap: {
    position: 'relative',
  },
  cardShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    borderRadius: 20,
    backgroundColor: theme.colors.lightAccent,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    overflow: 'hidden',
  },
  heroWrap: {
    marginBottom: 2,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    gap: 4,
  },
  name: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: theme.colors.cartoon.charcoal,
  },
  workshop: {
    ...theme.typography.body,
    color: theme.colors.cartoon.gray,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
  },
  ratingValue: {
    marginLeft: 6,
    ...theme.typography.caption,
    fontWeight: '800',
    color: theme.colors.cartoon.charcoal,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.cartoon.gray,
  },
  sectionCard: {
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.md,
    gap: 10,
  },
  bentoRow: {
    gap: theme.spacing.md,
  },
  bentoRowTablet: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  bentoHalf: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    color: theme.colors.cartoon.charcoal,
  },
  sectionBody: {
    ...theme.typography.body,
    color: theme.colors.cartoon.gray,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: theme.colors.cartoon.blueBg,
    borderWidth: 1,
    borderColor: theme.colors.borderCardLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    ...theme.typography.caption,
    color: theme.colors.cartoon.charcoal,
    fontWeight: '700',
  },
  areaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  areaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderCardLight,
    backgroundColor: theme.colors.cartoon.yellowBg,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  areaText: {
    ...theme.typography.caption,
    color: theme.colors.cartoon.charcoal,
  },
  portfolioCard: {
    width: 180,
    marginRight: theme.spacing.sm,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    backgroundColor: '#FFFFFF',
  },
  portfolioImage: {
    width: '100%',
    height: 100,
    backgroundColor: theme.colors.cartoon.lightGray,
  },
  portfolioTitle: {
    padding: theme.spacing.sm,
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.cartoon.charcoal,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statItem: {
    width: '48%',
    borderWidth: 1,
    borderColor: theme.colors.borderCardLight,
    borderRadius: 12,
    backgroundColor: theme.colors.cartoon.mintBg,
    padding: theme.spacing.sm,
  },
  statValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: theme.colors.cartoon.charcoal,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.cartoon.gray,
  },
});
