import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  Share,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";

let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { SpotsMap } from "@/components/SpotsMap";
import { NativeAdCard } from "@/components/ads/AdWidgets";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  ChargingSpot,
  VENUE_TYPE_LABELS,
  OUTLET_TYPE_LABELS,
  calculateDistance,
} from "@/data/mockData";
import { ListStackParamList } from "@/navigation/ListStackNavigator";
import { useSpots } from "@/hooks/useSpots";
import { useAds } from "@/context/AdsContext";

type LocationDetailsRouteProp = RouteProp<ListStackParamList, "LocationDetails">;

export default function LocationDetailsScreen() {
  const { theme } = useTheme();
  const { showAds } = useAds();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const route = useRoute<LocationDetailsRouteProp>();
  const navigation = useNavigation();
  const { spotId } = route.params;

  const { data: spots = [], isLoading: isSpotsLoading } = useSpots();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [votes, setVotes] = useState<{ yes: number; no: number }>({ yes: 0, no: 0 });
  const [didReportNoPlug, setDidReportNoPlug] = useState(false);

  const spot = spots.find((s) => s.id === spotId);
  const outletCount = spot?.outletCount ?? 0;

  useEffect(() => {
    setVotes({
      yes: spot?.communityYesVotes ?? 0,
      no: spot?.communityNoVotes ?? 0,
    });
    setDidReportNoPlug(false);
  }, [spotId, spot]);

  useEffect(() => {
    getUserLocation();
    if (spot) {
      navigation.setOptions({ headerTitle: spot.name });
    }
  }, [spot]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  const distance = spot && userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      )
    : null;

  const estimatedConfidence =
    spot?.hasOutlets === true ? 1 : spot?.hasOutlets === false ? 0 : spot?.powerConfidence ?? 0.5;
  const totalVotes = votes.yes + votes.no;
  const blendedConfidence =
    totalVotes === 0 ? estimatedConfidence : votes.yes / Math.max(totalVotes, 1) * 0.6 + estimatedConfidence * 0.4;

  const handleNoPlug = () => {
    setVotes((prev) => {
      if (didReportNoPlug) {
        return { yes: prev.yes, no: Math.max(0, prev.no - 1) };
      }
      return { yes: prev.yes, no: prev.no + 1 };
    });
    setDidReportNoPlug((prev) => !prev);
  };

  const openDirections = () => {
    if (!spot) return;
    const url = Platform.select({
      ios: `maps:?daddr=${spot.latitude},${spot.longitude}`,
      android: `geo:${spot.latitude},${spot.longitude}?q=${spot.latitude},${spot.longitude}(${spot.name})`,
      default: `https://maps.google.com/maps?daddr=${spot.latitude},${spot.longitude}`,
    });
    Linking.openURL(url);
  };

  const handleShare = async () => {
    if (!spot) return;
    try {
      await Share.share({
        message: `Check out ${spot.name} for phone charging! Located at ${spot.address}. They have ${spot.outletCount} charging outlets available.`,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleCall = () => {
    if (spot?.phone) {
      Linking.openURL(`tel:${spot.phone}`);
    }
  };

  if (isSpotsLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <View style={styles.loadingTextContainer}>
          <ThemedText style={styles.loadingText}>
            Loading
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!spot) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Spot not found</ThemedText>
      </ThemedView>
    );
  }

  // Web-safe details UI (react-native-maps is not available on web).
  if (Platform.OS === "web") {
    const confidence =
      spot.hasOutlets === true ? 1 : spot.hasOutlets === false ? 0 : spot.powerConfidence ?? 0.5;
    const yesVotes = votes.yes;
    const noVotes = votes.no;

    const openGoogleMaps = () => {
      const q = encodeURIComponent(`${spot.name} @ ${spot.latitude},${spot.longitude}`);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
    };

    return (
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: tabBarHeight + insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mapContainer}>
            <SpotsMap
              spots={[spot]}
              selectedSpotId={spot.id}
              onSelectSpot={() => {
                // no-op (single spot)
              }}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <View style={[styles.venueTag, { backgroundColor: theme.primary + "20" }]}>
                <ThemedText style={{ color: theme.primary, fontSize: 12, fontWeight: "700" }} numberOfLines={1}>
                  {VENUE_TYPE_LABELS[spot.venueType]}
                </ThemedText>
              </View>
            </View>

            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={20} color={theme.primary} />
                <View style={styles.infoContent}>
                  <ThemedText>{spot.address}</ThemedText>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Feather name="clock" size={20} color={theme.primary} />
                <View style={styles.infoContent}>
                  <ThemedText>{spot.hours || "Hours not available yet"}</ThemedText>
                </View>
              </View>

              {spot.phone ? (
                <Pressable style={styles.infoRow} onPress={handleCall}>
                  <Feather name="phone" size={20} color={theme.primary} />
                  <View style={styles.infoContent}>
                    <ThemedText type="link">{spot.phone}</ThemedText>
                  </View>
                </Pressable>
              ) : null}
            </Card>

            <Card style={styles.outletsCard}>
              <ThemedText type="headline" style={styles.sectionTitle}>
                Charging info
              </ThemedText>
              <View style={styles.outletsStats}>
                <View style={styles.outletCountContainer}>
                  <Feather name="zap" size={24} color={theme.primary} />
                  <ThemedText type="h3" style={{ marginLeft: Spacing.sm }}>
                    {`${outletCount} outlets`}
                  </ThemedText>
                </View>
                <View style={styles.outletTypes}>
                  {spot.outletTypes.map((type) => (
                    <View
                      key={type}
                      style={[styles.outletTag, { backgroundColor: theme.backgroundSecondary }]}
                    >
                      <ThemedText type="small">{OUTLET_TYPE_LABELS[type]}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
              <ThemedText secondary type="small" style={{ marginTop: Spacing.sm }}>
                {spot.hasOutlets === true
                  ? "Outlets confirmed on site."
                  : spot.hasOutlets === false
                    ? "Reports indicate outlets are unavailable."
                    : `Estimated ${Math.round(confidence * 100)}% chance of outlets.`}
              </ThemedText>
              <ThemedText secondary type="small" style={{ marginTop: Spacing.xs }}>
                Community votes: {yesVotes} yes / {noVotes} no
              </ThemedText>
            </Card>

            {spot.tips && spot.tips.length > 0 ? (
              <Card style={styles.tipsCard}>
                <ThemedText type="headline" style={styles.sectionTitle}>
                  Helpful tips
                </ThemedText>
                {spot.tips.map((tip, index) => (
                  <View key={index} style={styles.tipRow}>
                    <Feather name="check-circle" size={16} color={theme.primary} />
                    <ThemedText style={styles.tipText}>{tip}</ThemedText>
                  </View>
                ))}
              </Card>
            ) : null}

            <Pressable
              style={[styles.directionsButton, { backgroundColor: theme.primary }]}
              onPress={openGoogleMaps}
            >
              <Feather name="navigation" size={20} color="#FFFFFF" />
              <ThemedText style={{ color: "#FFFFFF", fontWeight: "700", marginLeft: Spacing.sm, textAlign: "center" }}>
                Open in Google Maps
              </ThemedText>
            </Pressable>
            {showAds ? <NativeAdCard /> : null}
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            initialRegion={{
              latitude: spot.latitude,
              longitude: spot.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            >
              <View style={[styles.markerContainer, { backgroundColor: theme.primary }]}>
                <Feather name="battery-charging" size={16} color="#FFFFFF" />
              </View>
            </Marker>
          </MapView>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={[styles.venueTag, { backgroundColor: theme.primary + "20" }]}>
              <ThemedText style={{ color: theme.primary, fontSize: 12, fontWeight: "500" }}>
                {VENUE_TYPE_LABELS[spot.venueType]}
              </ThemedText>
            </View>
            <Pressable onPress={handleShare} style={styles.shareButton}>
              <Feather name="share" size={22} color={theme.text} />
            </Pressable>
          </View>

          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={20} color={theme.primary} />
              <View style={styles.infoContent}>
                <ThemedText>{spot.address}</ThemedText>
                {distance !== null ? (
                  <ThemedText secondary type="small" style={{ marginTop: Spacing.xs }}>
                    {distance.toFixed(1)} miles away
                  </ThemedText>
                ) : null}
              </View>
            </View>

            {spot.phone ? (
              <Pressable style={styles.infoRow} onPress={handleCall}>
                <Feather name="phone" size={20} color={theme.primary} />
                <View style={styles.infoContent}>
                  <ThemedText type="link">{spot.phone}</ThemedText>
                </View>
              </Pressable>
            ) : null}

            {spot.hours ? (
              <View style={styles.infoRow}>
                <Feather name="clock" size={20} color={theme.primary} />
                <View style={styles.infoContent}>
                  <ThemedText>{spot.hours}</ThemedText>
                </View>
              </View>
            ) : null}
          </Card>

          <Card style={styles.outletsCard}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              Charging Options
            </ThemedText>
            <View style={styles.outletsStats}>
              <View style={styles.outletCountContainer}>
                <Feather name="zap" size={24} color={theme.primary} />
                <ThemedText type="h3" style={{ marginLeft: Spacing.sm }}>
                  {`${outletCount} outlets`}
                </ThemedText>
              </View>
              <View style={styles.outletTypes}>
                {spot.outletTypes.map((type) => (
                  <View
                    key={type}
                    style={[styles.outletTag, { backgroundColor: theme.backgroundSecondary }]}
                  >
                    <ThemedText type="small">{OUTLET_TYPE_LABELS[type]}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
            <ThemedText secondary type="small" style={{ marginTop: Spacing.sm }}>
              {spot.hasOutlets === true
                ? "Outlets confirmed on site."
                : spot.hasOutlets === false
                ? "Reports indicate outlets are unavailable."
                : `Estimated ${Math.round(blendedConfidence * 100)}% chance of outlets.`}
            </ThemedText>
          </Card>

          <Card style={styles.voteCard}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              Plug report
            </ThemedText>
            <ThemedText secondary>
              Press “No plug” if there is no plug here.
            </ThemedText>
            <Pressable
              style={[
                styles.voteButton,
                {
                  borderColor: theme.primary,
                  backgroundColor: didReportNoPlug ? theme.primary + "20" : "transparent",
                  marginTop: Spacing.md,
                },
              ]}
              onPress={handleNoPlug}
            >
              <ThemedText
                style={[
                  styles.voteButtonText,
                  { color: theme.primary },
                ]}
              >
                No plug
              </ThemedText>
            </Pressable>
            <ThemedText secondary type="small" style={{ marginTop: Spacing.sm }}>
              Reports: {votes.no}
            </ThemedText>
          </Card>

          {spot.tips && spot.tips.length > 0 ? (
            <Card style={styles.tipsCard}>
              <ThemedText type="headline" style={styles.sectionTitle}>
                Tips from Users
              </ThemedText>
              {spot.tips.map((tip, index) => (
                <View key={index} style={styles.tipRow}>
                  <Feather name="check-circle" size={16} color={theme.primary} />
                  <ThemedText style={styles.tipText}>{tip}</ThemedText>
                </View>
              ))}
            </Card>
          ) : null}

          <Pressable
            style={[styles.directionsButton, { backgroundColor: theme.primary }]}
            onPress={openDirections}
          >
            <Feather name="navigation" size={20} color="#FFFFFF" />
            <ThemedText style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: Spacing.sm, textAlign: "center" }}>
              Get Directions
            </ThemedText>
          </Pressable>
          {showAds ? <NativeAdCard /> : null}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: Spacing.xl,
  },
  loadingTextContainer: {
    marginTop: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    width: "100%",
    flexShrink: 0,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    includeFontPadding: false,
    letterSpacing: 0,
    lineHeight: 22,
    minWidth: 100,
    flexShrink: 0,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
  },
  mapContainer: {
    height: 200,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  venueTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    minWidth: 100,
    alignItems: "center",
  },
  shareButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  infoContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  outletsCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  voteCard: {
    marginBottom: Spacing.md,
  },
  outletsStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  outletCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  outletTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  outletTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  voteRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  voteButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  voteButtonText: {
    fontWeight: "600",
  },
  tipsCard: {
    marginBottom: Spacing.lg,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  tipText: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  directionsButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    width: "100%",
  },
});
