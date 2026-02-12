import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { gsap } from 'gsap';
import { ScreenContainer, CartoonActionButton, SketchFill } from '../../../components/ui';
import { theme } from '../../../theme';
import type { MechanicTabScreenProps } from '../../../types/navigation';
import { mechanicOrigin, mockMechanicRequests, type MechanicRequestItem } from '../data/mockMechanicData';
import { getRequestMarkerColor } from '../utils/mapHelpers';
import { getCurrentPosition, distanceKm } from '../../../utils/location';
import { OptionalMapView, OptionalMarker } from '../utils/optionalMaps';

type RequestWithDistance = MechanicRequestItem;
type Props = MechanicTabScreenProps<'Requests'>;

export function RequestsNearbyScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - theme.spacing.md * 2, 430);
  const [requests, setRequests] = useState<RequestWithDistance[]>(mockMechanicRequests);
  const [selectedId, setSelectedId] = useState<string | null>(mockMechanicRequests[0]?.id ?? null);
  const [frontMotion, setFrontMotion] = useState({ y: 18, opacity: 0.92, scale: 0.96 });
  const frontMotionRef = useRef({ y: 18, opacity: 0.92, scale: 0.96 });

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId]
  );

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === 'pending').length,
    [requests]
  );
  const stackedRequests = useMemo(() => {
    if (!selectedRequest) return requests.slice(0, 3);
    const rest = requests.filter((request) => request.id !== selectedRequest.id);
    return [selectedRequest, ...rest].slice(0, 3);
  }, [requests, selectedRequest]);

  const handleRefresh = useCallback(async () => {
    const position = await getCurrentPosition();
    if (!position) return;
    const { latitude, longitude } = position.coords;
    setRequests((prev) =>
      prev
        .map((item) => ({
          ...item,
          distanceKm: distanceKm(latitude, longitude, item.locationLat, item.locationLng),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
    );
  }, []);

  const handleAccept = useCallback((requestId: string) => {
    console.log('[RequestsNearby] Accept request', requestId);
    setRequests((prev) =>
      prev.map((item) => (item.id === requestId ? { ...item, status: 'accepted' } : item))
    );
  }, []);

  const handleReject = useCallback((requestId: string) => {
    console.log('[RequestsNearby] Reject request', requestId);
    setRequests((prev) =>
      prev.map((item) => (item.id === requestId ? { ...item, status: 'rejected' } : item))
    );
  }, []);

  const handleCycleCard = useCallback(
    (direction: 'next' | 'prev') => {
      if (!requests.length || !selectedId) return;
      const currentIndex = requests.findIndex((item) => item.id === selectedId);
      if (currentIndex < 0) return;
      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % requests.length
          : (currentIndex - 1 + requests.length) % requests.length;
      const next = requests[nextIndex];
      if (next) {
        setSelectedId(next.id);
      }
    },
    [requests, selectedId]
  );

  useEffect(() => {
    gsap.killTweensOf(frontMotionRef.current);
    frontMotionRef.current.y = 18;
    frontMotionRef.current.opacity = 0.92;
    frontMotionRef.current.scale = 0.96;
    setFrontMotion({ ...frontMotionRef.current });

    gsap.to(frontMotionRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: 'power3.out',
      onUpdate: () => {
        setFrontMotion({ ...frontMotionRef.current });
      },
    });
  }, [selectedId]);

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.mapHost}>
        <OptionalMapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: mechanicOrigin.lat,
            longitude: mechanicOrigin.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {requests.map((request) => (
            <OptionalMarker
              key={request.id}
              coordinate={{ latitude: request.locationLat, longitude: request.locationLng }}
              pinColor={getRequestMarkerColor(request.status)}
              onPress={() => {
                setSelectedId(request.id);
              }}
            />
          ))}
        </OptionalMapView>

        <View style={styles.topOverlay}>
          <View style={styles.topCardShadow}>
            <SketchFill />
          </View>
          <View style={styles.topCard}>
            <View>
              <Text style={styles.topTitle}>Nearby Requests</Text>
              <Text style={styles.topSubtitle}>{pendingCount} pending nearby</Text>
            </View>
            <Pressable onPress={handleRefresh} style={styles.refreshButton}>
              <MaterialCommunityIcons name="refresh" size={20} color={theme.colors.cartoon.charcoal} />
            </Pressable>
          </View>
        </View>

        {selectedRequest ? (
          <View style={styles.stackWrap}>
            {stackedRequests
              .slice()
              .reverse()
              .map((item, reverseIndex) => {
                const level = stackedRequests.length - reverseIndex - 1;
                const isFront = level === 0;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelectedId(item.id)}
                    style={[
                      styles.popupWrap,
                      {
                        width: cardWidth,
                        transform: [
                          { translateY: level * 10 + (isFront ? frontMotion.y : 0) },
                          { scale: (1 - level * 0.03) * (isFront ? frontMotion.scale : 1) },
                        ],
                        zIndex: 20 - level,
                        opacity: isFront ? frontMotion.opacity : 1 - level * 0.08,
                      },
                    ]}
                  >
                    <View style={styles.popupShadow}>
                      <SketchFill />
                    </View>
                    <View style={styles.popupCard}>
                      <View style={styles.popupHeader}>
                        <Text style={styles.customerName} numberOfLines={1}>
                          {item.customerName}
                        </Text>
                        <View style={styles.headerActions}>
                          <Pressable
                            style={styles.switchButton}
                            onPress={() => handleCycleCard('prev')}
                          >
                            <MaterialCommunityIcons
                              name="chevron-left"
                              size={16}
                              color={theme.colors.cartoon.charcoal}
                            />
                          </Pressable>
                          <Pressable
                            style={styles.switchButton}
                            onPress={() => handleCycleCard('next')}
                          >
                            <MaterialCommunityIcons
                              name="chevron-right"
                              size={16}
                              color={theme.colors.cartoon.charcoal}
                            />
                          </Pressable>
                          <Pressable onPress={() => navigation.navigate('RequestDetails', { requestId: item.id })}>
                            <Text style={styles.detailsLink}>Details</Text>
                          </Pressable>
                        </View>
                      </View>
                      <Text style={styles.problemText} numberOfLines={isFront ? 2 : 1}>
                        {item.problem}
                      </Text>
                      <View style={styles.metaRow}>
                        <Text style={styles.metaText}>{item.distanceKm.toFixed(1)} km</Text>
                        <Text style={styles.metaText}>{item.requestTime}</Text>
                      </View>
                      {isFront ? (
                        <View style={styles.actionsRow}>
                          <View style={styles.actionCell}>
                            <CartoonActionButton
                              label="Decline"
                              variant="reject"
                              icon="close-circle-outline"
                              onPress={() => handleReject(item.id)}
                              fullWidth
                            />
                          </View>
                          <View style={styles.actionCell}>
                            <CartoonActionButton
                              label="Accept"
                              variant="accept"
                              icon="check-circle-outline"
                              onPress={() => handleAccept(item.id)}
                              fullWidth
                            />
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
          </View>
        ) : (
          <View style={styles.emptyCenter}>
            <Text style={styles.emptyText}>Select a marker to manage request</Text>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.cartoon.cream,
  },
  mapHost: {
    flex: 1,
    overflow: 'hidden',
  },
  topOverlay: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  topCardShadow: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    backgroundColor: theme.colors.lightAccent,
    overflow: 'hidden',
  },
  topCard: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    color: theme.colors.cartoon.charcoal,
  },
  topSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.cartoon.gray,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    backgroundColor: theme.colors.cartoon.blueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackWrap: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: theme.layout.tabBarHeight + theme.spacing.sm - 100,
    minHeight: 220,
  },
  popupWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignSelf: 'center',
  },
  popupShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    backgroundColor: theme.colors.lightAccent,
    overflow: 'hidden',
  },
  popupCard: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.sm + 4,
    minHeight: 150,
  },
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  customerName: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
    color: theme.colors.cartoon.charcoal,
    flex: 1,
    marginRight: 8,
  },
  detailsLink: {
    ...theme.typography.caption,
    color: theme.colors.cartoon.blue,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cartoon.blueBg,
  },
  problemText: {
    ...theme.typography.body,
    color: theme.colors.cartoon.gray,
    marginTop: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },
  metaText: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.cartoon.charcoal,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  actionCell: {
    flex: 1,
  },
  emptyCenter: {
    position: 'absolute',
    bottom: theme.layout.tabBarHeight + theme.spacing.lg,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.borderCardLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyText: {
    ...theme.typography.caption,
    color: theme.colors.cartoon.charcoal,
    fontWeight: '700',
  },
});
