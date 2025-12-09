import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, Colors } from "@/constants/theme";
import {
  MOCK_SPOTS,
  ChargingSpot,
  VenueType,
  VENUE_TYPE_LABELS,
  calculateDistance,
} from "@/data/mockData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const FILTER_OPTIONS: (VenueType | "all")[] = [
  "all",
  "cafe",
  "library",
  "airport",
  "mall",
  "restaurant",
  "coworking",
  "hotel",
];

const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function MapScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<VenueType | "all">("all");
  const [selectedSpot, setSelectedSpot] = useState<ChargingSpot | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bottomSheetTranslateY = useSharedValue(200);

  const animatedBottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomSheetTranslateY.value }],
  }));

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (selectedSpot) {
      bottomSheetTranslateY.value = withSpring(0, { damping: 20, stiffness: 150 });
    } else {
      bottomSheetTranslateY.value = withSpring(200, { damping: 20, stiffness: 150 });
    }
  }, [selectedSpot]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        mapRef.current?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }
    } catch (error) {
      console.log("Error getting location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSpots = MOCK_SPOTS.filter((spot) => {
    const matchesFilter = selectedFilter === "all" || spot.venueType === selectedFilter;
    const matchesSearch =
      searchQuery === "" ||
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }).map((spot) => ({
    ...spot,
    distance: userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        )
      : undefined,
  }));

  const handleMarkerPress = (spot: ChargingSpot) => {
    setSelectedSpot(spot);
    mapRef.current?.animateToRegion({
      latitude: spot.latitude,
      longitude: spot.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  const openDirections = (spot: ChargingSpot) => {
    const scheme = Platform.select({
      ios: "maps:",
      android: "geo:",
    });
    const url = Platform.select({
      ios: `maps:?daddr=${spot.latitude},${spot.longitude}`,
      android: `geo:${spot.latitude},${spot.longitude}?q=${spot.latitude},${spot.longitude}(${spot.name})`,
      default: `https://maps.google.com/maps?daddr=${spot.latitude},${spot.longitude}`,
    });
    Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText style={styles.loadingText}>Finding your location...</ThemedText>
      </View>
    );
  }

  if (locationPermission === "denied") {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: theme.backgroundRoot }]}>
        <Feather name="map-pin" size={64} color={theme.primary} />
        <ThemedText type="h4" style={styles.permissionTitle}>
          Location Access Required
        </ThemedText>
        <ThemedText secondary style={styles.permissionText}>
          ChargeSpot needs your location to find nearby charging spots.
        </ThemedText>
        {Platform.OS !== "web" ? (
          <Pressable
            style={[styles.permissionButton, { backgroundColor: theme.primary }]}
            onPress={async () => {
              try {
                await Linking.openSettings();
              } catch (error) {
                console.log("Cannot open settings");
              }
            }}
          >
            <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
              Open Settings
            </ThemedText>
          </Pressable>
        ) : (
          <ThemedText secondary style={styles.permissionText}>
            Please use Expo Go on your mobile device to access location features.
          </ThemedText>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={locationPermission === "granted"}
        showsMyLocationButton={false}
        onPress={() => setSelectedSpot(null)}
      >
        {filteredSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            onPress={() => handleMarkerPress(spot)}
          >
            <View style={[styles.markerContainer, { backgroundColor: theme.primary }]}>
              <Feather name="battery-charging" size={16} color="#FFFFFF" />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={[styles.headerContainer, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.headerButtons}>
          <Pressable
            style={[styles.headerButton, { backgroundColor: theme.backgroundDefault }]}
            onPress={() => navigation.navigate("Settings")}
          >
            <Feather name="settings" size={22} color={theme.text} />
          </Pressable>
          <Pressable
            style={[styles.headerButton, { backgroundColor: theme.backgroundDefault }]}
            onPress={handleCenterOnUser}
          >
            <Feather name="navigation" size={22} color={theme.primary} />
          </Pressable>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search charging spots..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x" size={20} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTER_OPTIONS.map((filter) => (
            <Pressable
              key={filter}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedFilter === filter ? theme.primary : theme.backgroundDefault,
                },
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <ThemedText
                style={{
                  color: selectedFilter === filter ? "#FFFFFF" : theme.text,
                  fontWeight: "500",
                }}
              >
                {filter === "all" ? "All" : VENUE_TYPE_LABELS[filter]}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {selectedSpot ? (
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: theme.backgroundDefault,
              paddingBottom: tabBarHeight + Spacing.lg,
            },
            animatedBottomSheetStyle,
          ]}
        >
          <View style={styles.bottomSheetHandle} />
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <View style={{ flex: 1 }}>
                <ThemedText type="headline">{selectedSpot.name}</ThemedText>
                <ThemedText secondary type="small" style={{ marginTop: Spacing.xs }}>
                  {selectedSpot.address}
                </ThemedText>
              </View>
              <View style={[styles.venueTag, { backgroundColor: theme.primary + "20" }]}>
                <ThemedText style={{ color: theme.primary, fontSize: 12, fontWeight: "500" }}>
                  {VENUE_TYPE_LABELS[selectedSpot.venueType]}
                </ThemedText>
              </View>
            </View>
            <View style={styles.bottomSheetStats}>
              <View style={styles.statItem}>
                <Feather name="zap" size={18} color={theme.primary} />
                <ThemedText style={{ marginLeft: Spacing.xs }}>
                  {selectedSpot.outletCount} outlets
                </ThemedText>
              </View>
              {selectedSpot.distance !== undefined ? (
                <View style={styles.statItem}>
                  <Feather name="navigation" size={18} color={theme.primary} />
                  <ThemedText style={{ marginLeft: Spacing.xs }}>
                    {selectedSpot.distance.toFixed(1)} mi
                  </ThemedText>
                </View>
              ) : null}
            </View>
            <Pressable
              style={[styles.directionsButton, { backgroundColor: theme.primary }]}
              onPress={() => openDirections(selectedSpot)}
            >
              <Feather name="navigation" size={18} color="#FFFFFF" />
              <ThemedText style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: Spacing.sm }}>
                Get Directions
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.lg,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  permissionTitle: {
    marginTop: Spacing.xl,
    textAlign: "center",
  },
  permissionText: {
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  permissionButton: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.medium,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 16,
  },
  filtersContainer: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    ...Shadows.small,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.small,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    ...Shadows.large,
  },
  bottomSheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginTop: Spacing.sm,
  },
  bottomSheetContent: {
    padding: Spacing.lg,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  venueTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  bottomSheetStats: {
    flexDirection: "row",
    marginTop: Spacing.md,
    gap: Spacing.xl,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  directionsButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
});
