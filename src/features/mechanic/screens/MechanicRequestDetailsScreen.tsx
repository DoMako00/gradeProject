import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  CartoonActionButton,
  CartoonEmptyState,
  FloatingIconsBackground,
  ScreenContainer,
  SketchFill,
} from '../../../components/ui';
import type { MechanicStackScreenProps } from '../../../types/navigation';
import { theme } from '../../../theme';
import { mockMechanicRequests } from '../data/mockMechanicData';
import { formatEta, requestStatusLabel } from '../utils/mapHelpers';
import { OptionalMapView, OptionalMarker } from '../utils/optionalMaps';

type Props = MechanicStackScreenProps<'RequestDetails'>;

const c = theme.colors.cartoon;

function PanelCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: { width?: number };
}) {
  return (
    <View style={[styles.panelWrap, style]}>
      <View style={styles.panelShadow}>
        <SketchFill />
      </View>
      <View style={styles.panel}>{children}</View>
    </View>
  );
}

export function RequestDetailsScreen({ route }: Props) {
  const { width } = useWindowDimensions();
  const [localStatus, setLocalStatus] = useState<'pending' | 'accepted' | 'rejected' | null>(null);
  const cardWidth = Math.min(420, width - theme.spacing.lg * 2);

  const request = useMemo(
    () => mockMechanicRequests.find((item) => item.id === route.params.requestId) ?? null,
    [route.params.requestId]
  );

  if (!request) {
    return (
      <ScreenContainer style={styles.screen}>
        <CartoonEmptyState
          icon="file-alert-outline"
          title="Request not found"
          message="This request no longer exists. Try opening another one from Nearby Requests."
        />
      </ScreenContainer>
    );
  }

  const status = localStatus ?? request.status;

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      <FloatingIconsBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <PanelCard style={{ width: cardWidth }}>
          <View style={styles.rowBetween}>
            <View style={styles.customerRow}>
              <MaterialCommunityIcons name="account-circle" size={36} color={c.blue} />
              <View>
                <Text style={styles.customerName}>{request.customerName}</Text>
                <Text style={styles.statusText}>Status: {requestStatusLabel(status)}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="shield-check-outline" size={20} color={c.mint} />
          </View>
        </PanelCard>

        <PanelCard style={{ width: cardWidth }}>
          <Text style={styles.panelTitle}>Problem</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="car-wrench" size={16} color={c.orange} />
            <Text style={styles.bodyText}>{request.problem}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker-distance" size={16} color={c.blue} />
            <Text style={styles.bodyText}>{request.distanceKm.toFixed(1)} km away</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="timer-outline" size={16} color={c.purple} />
            <Text style={styles.bodyText}>{formatEta(request.distanceKm)}</Text>
          </View>
        </PanelCard>

        {request.carImages?.length ? (
          <PanelCard style={{ width: cardWidth }}>
            <Text style={styles.panelTitle}>Car images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {request.carImages.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.carImage} />
              ))}
            </ScrollView>
          </PanelCard>
        ) : null}

        <PanelCard style={{ width: cardWidth }}>
          <Text style={styles.panelTitle}>Location</Text>
          <OptionalMapView
            style={styles.miniMap}
            initialRegion={{
              latitude: request.locationLat,
              longitude: request.locationLng,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <OptionalMarker
              coordinate={{ latitude: request.locationLat, longitude: request.locationLng }}
              title={request.customerName}
              description={request.problem}
            />
          </OptionalMapView>
        </PanelCard>

        <View style={[styles.actionsPanel, { width: cardWidth }]}>
          <View style={styles.actionCell}>
            <CartoonActionButton
              label="Accept"
              variant="accept"
              icon="check-circle-outline"
              onPress={() => {
                console.log('[RequestDetails] Accept', request.id);
                setLocalStatus('accepted');
              }}
              fullWidth
            />
          </View>
          <View style={styles.actionCell}>
            <CartoonActionButton
              label="Reject"
              variant="reject"
              icon="close-circle-outline"
              onPress={() => {
                console.log('[RequestDetails] Reject', request.id);
                setLocalStatus('rejected');
              }}
              fullWidth
            />
          </View>
          <View style={styles.actionCell}>
            <CartoonActionButton
              label="Call"
              variant="primary"
              icon="phone-outline"
              onPress={() => console.log('[RequestDetails] Call customer', request.phone ?? 'N/A')}
              fullWidth
            />
          </View>
          <View style={styles.actionCell}>
            <CartoonActionButton
              label="Chat"
              variant="secondary"
              icon="chat-outline"
              onPress={() => console.log('[RequestDetails] Chat with customer', request.id)}
              fullWidth
            />
          </View>
        </View>
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
  content: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl + theme.layout.tabBarHeight,
    gap: theme.spacing.md,
  },
  panelWrap: {
    position: 'relative',
  },
  panelShadow: {
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
  panel: {
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customerName: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: c.charcoal,
  },
  statusText: {
    ...theme.typography.caption,
    color: c.gray,
    marginTop: 2,
  },
  panelTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: c.charcoal,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bodyText: {
    ...theme.typography.body,
    color: c.charcoal,
    flex: 1,
  },
  carImage: {
    width: 190,
    height: 120,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    marginRight: theme.spacing.sm,
    backgroundColor: c.lightGray,
  },
  miniMap: {
    width: '100%',
    height: 190,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    overflow: 'hidden',
  },
  actionsPanel: {
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  actionCell: {
    width: '48%',
  },
});
