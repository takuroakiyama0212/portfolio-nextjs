import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  Share,
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

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  MOCK_SPOTS,
  ChargingSpot,
  VENUE_TYPE_LABELS,
  OUTLET_TYPE_LABELS,
  calculateDistance,
} from "@/data/mockData";
import { ListStackParamList } from "@/navigation/ListStackNavigator";

type LocationDetailsRouteProp = RouteProp<ListStackParamList, "LocationDetails">;

export default function LocationDetailsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<LocationDetailsRouteProp>();
  const navigation = useNavigation();
  const { spotId } = route.params;

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const spot = MOCK_SPOTS.find((s) => s.id === spotId);

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

  if (!spot) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Spot not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl },
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
                  {spot.outletCount}
                </ThemedText>
                <ThemedText secondary style={{ marginLeft: Spacing.xs }}>
                  outlets
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
            <ThemedText style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: Spacing.sm }}>
              Get Directions
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: BorderRadius.md,
  },
});
