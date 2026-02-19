import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, Colors } from "@/constants/theme";
import { ChargingSpot, VenueType, VENUE_TYPE_LABELS, calculateDistance } from "@/data/mockData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { useSpots } from "@/hooks/useSpots";
import { SpotsMap } from "@/components/SpotsMap";
import { StateSelector } from "@/components/StateSelector";
import { AustralianState, AUSTRALIAN_STATES } from "@/data/australianStates";
import { useAds } from "@/context/AdsContext";

let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const FILTER_OPTIONS: VenueType[] = [
  "cafe",
  "library",
  "airport",
  "mall",
  "restaurant",
  "coworking",
  "hotel",
];

export default function MapScreen() {
  const { theme, isDark } = useTheme();
  const { maybeShowInterstitialAfterSearch } = useAds();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();
  const mapRef = useRef<any>(null);

  const [selectedState, setSelectedState] = useState<AustralianState>("QLD");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Set<VenueType>>(new Set());
  const [selectedSpot, setSelectedSpot] = useState<ChargingSpot | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const {
    data: spots = [],
    isLoading: isSpotsLoading,
    isFetching: isSpotsFetching,
  } = useSpots(selectedState);

  // Get default region based on selected state
  const getDefaultRegion = useCallback((state: AustralianState): Region => {
    const stateBounds = AUSTRALIAN_STATES[state];
    // Calculate appropriate delta based on state size
    const latDelta = Math.abs(stateBounds.north - stateBounds.south) * 1.2;
    const lonDelta = Math.abs(stateBounds.east - stateBounds.west) * 1.2;
    
    return {
      latitude: stateBounds.centerLat,
      longitude: stateBounds.centerLon,
      latitudeDelta: Math.max(latDelta, 0.5), // Minimum 0.5 for small states
      longitudeDelta: Math.max(lonDelta, 0.5),
    };
  }, []);

  const DEFAULT_REGION = useMemo(() => getDefaultRegion(selectedState), [selectedState, getDefaultRegion]);

  const bottomSheetTranslateY = useSharedValue(200);

  const animatedBottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomSheetTranslateY.value }],
  }));

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // After the initial load, don't block the whole UI on state changes (OSM can be slow).
  useEffect(() => {
    if (!isSpotsLoading) {
      setHasLoadedOnce(true);
    }
  }, [isSpotsLoading]);

  // Update map region when state changes
  useEffect(() => {
    if (mapRef.current) {
      const newRegion = getDefaultRegion(selectedState);
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedSpot && isBottomSheetOpen) {
      bottomSheetTranslateY.value = withSpring(0, { damping: 20, stiffness: 150 });
    } else {
      bottomSheetTranslateY.value = withSpring(200, { damping: 20, stiffness: 150 });
    }
  }, [selectedSpot, isBottomSheetOpen]);

  const requestLocationPermission = async () => {
    if (Platform.OS === "web") {
      setIsLoading(false);
      return;
    }
    
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

  // Always include selectedSpot in filteredSpots even if it doesn't match filters
  const baseFilteredSpots = spots.filter((spot) => {
    // If no filters selected, show all spots
    const matchesFilter = selectedFilters.size === 0 || selectedFilters.has(spot.venueType);
    const matchesSearch =
      searchQuery === "" ||
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Ensure selectedSpot is always included if it exists
  const allSpotsToShow = selectedSpot && !baseFilteredSpots.find(s => s.id === selectedSpot.id)
    ? [...baseFilteredSpots, selectedSpot]
    : baseFilteredSpots;

  const filteredSpots = allSpotsToShow.map((spot) => ({
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
    setIsBottomSheetOpen(true);
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

  const isBusy = (isLoading || isSpotsLoading) && !hasLoadedOnce;

  if (isBusy) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <View style={styles.loadingTextContainer}>
          <ThemedText style={styles.loadingText}>
            Loading
          </ThemedText>
        </View>
      </View>
    );
  }

  if (locationPermission === "denied" && Platform.OS !== "web") {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: theme.backgroundRoot }]}>
        <Feather name="map-pin" size={64} color={theme.primary} />
        <ThemedText type="h4" style={styles.permissionTitle}>
          Location Access Required
        </ThemedText>
        <ThemedText secondary style={styles.permissionText}>
          Charge Spotter needs your location to find nearby charging spots.
        </ThemedText>
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
      </View>
    );
  }

  const renderSpotCard = ({ item }: { item: ChargingSpot & { distance?: number } }) => (
    <Pressable
      style={[styles.webSpotCard, { backgroundColor: theme.backgroundDefault }]}
      onPress={() => {
        setSelectedSpot(item);
        setIsBottomSheetOpen(true);
      }}
    >
      <View style={styles.webSpotCardHeader}>
        <View style={[styles.webSpotIcon, { backgroundColor: theme.primary }]}>
          <Feather name="battery-charging" size={20} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1, marginLeft: Spacing.md, marginRight: Spacing.sm }}>
          <ThemedText type="headline" numberOfLines={2} style={{ flexWrap: "wrap" }}>
            {item.name}
          </ThemedText>
          <ThemedText secondary type="small" style={{ marginTop: Spacing.xs }} numberOfLines={2}>
            {item.address}
          </ThemedText>
        </View>
        <View style={[styles.venueTag, { backgroundColor: theme.primary + "20" }]}>
          <ThemedText style={{ color: theme.primary, fontSize: 12, fontWeight: "500" }} numberOfLines={1}>
            {VENUE_TYPE_LABELS[item.venueType]}
          </ThemedText>
        </View>
      </View>
      <View style={styles.webSpotCardStats}>
        <View style={styles.statItem}>
          <Feather name="zap" size={16} color={theme.primary} />
          <ThemedText secondary style={{ marginLeft: Spacing.xs, fontSize: 14 }}>
            {`${item.outletCount ?? 0} outlets`}
          </ThemedText>
        </View>
        {item.hours ? (
          <View style={styles.statItem}>
            <Feather name="clock" size={16} color={theme.primary} />
            <ThemedText secondary style={{ marginLeft: Spacing.xs, fontSize: 14 }}>
              {item.hours}
            </ThemedText>
          </View>
        ) : null}
      </View>
      <Pressable
        style={[styles.directionsButton, { backgroundColor: theme.primary, marginTop: Spacing.md }]}
        onPress={() => openDirections(item)}
      >
        <Feather name="navigation" size={16} color="#FFFFFF" />
        <ThemedText style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: Spacing.sm, textAlign: "center" }}>
          Get Directions
        </ThemedText>
      </Pressable>
    </Pressable>
  );

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View style={[styles.webHeader, { paddingTop: insets.top + Spacing.lg, backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.webHeaderRow}>
            <View style={styles.webHeaderTitle}>
              <Feather name="battery-charging" size={28} color={theme.primary} />
              <ThemedText type="h4" style={{ marginLeft: Spacing.sm }}>Charge Spot</ThemedText>
            </View>
            <Pressable
              style={[styles.headerButton, { backgroundColor: theme.backgroundRoot }]}
              onPress={() => navigation.navigate("Settings")}
            >
              <Feather name="settings" size={22} color={theme.text} />
            </Pressable>
          </View>
          
          <View style={[styles.searchContainer, { backgroundColor: theme.backgroundRoot, marginTop: Spacing.md }]}>
            <Feather name="search" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search charging spots..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={maybeShowInterstitialAfterSearch}
            />
            {searchQuery.length > 0 ? (
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather name="x" size={20} color={theme.textSecondary} />
              </Pressable>
            ) : null}
            <Pressable
              style={[styles.searchActionButton, { backgroundColor: theme.primary }]}
              onPress={maybeShowInterstitialAfterSearch}
            >
              <Feather name="search" size={14} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.filtersContainer}>
            {FILTER_OPTIONS.map((filter) => (
              <Pressable
                key={filter}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      selectedFilters.has(filter) ? theme.primary : theme.backgroundRoot,
                  },
                ]}
                onPress={() => {
                const newFilters = new Set(selectedFilters);
                // Toggle the specific filter
                if (newFilters.has(filter)) {
                  newFilters.delete(filter);
                } else {
                  newFilters.add(filter);
                }
                setSelectedFilters(newFilters);
              }}
              >
                <ThemedText
                  style={{
                    color: selectedFilters.has(filter) ? "#FFFFFF" : theme.text,
                    fontWeight: "500",
                  }}
                >
                  {VENUE_TYPE_LABELS[filter]}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.webNotice}>
          <Feather name="info" size={16} color={theme.primary} />
          <ThemedText secondary style={{ marginLeft: Spacing.sm, fontSize: 14 }}>
            Web preview uses a list-first experience. For the full map experience, open in Expo Go.
          </ThemedText>
        </View>

        <View style={styles.webSplit}>
          <View style={styles.webMapPane}>
            <SpotsMap
              spots={filteredSpots}
              selectedSpotId={selectedSpot?.id ?? null}
              onSelectSpot={(spot) => {
                setSelectedSpot(spot);
                setIsBottomSheetOpen(true);
              }}
            />
          </View>

          <View style={styles.webListPane}>
            {selectedSpot && isBottomSheetOpen ? (
              <View style={[styles.webSelectedCard, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.webSelectedHeader}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="headline">{selectedSpot.name}</ThemedText>
                    <ThemedText secondary type="small" style={{ marginTop: Spacing.xs }}>
                      {selectedSpot.address}
                    </ThemedText>
                  </View>
                  <Pressable onPress={() => setIsBottomSheetOpen(false)} style={styles.webClose}>
                    <Feather name="x" size={18} color={theme.textSecondary} />
                  </Pressable>
                </View>

                <View style={styles.webSelectedRow}>
                  <Feather name="battery-charging" size={16} color={theme.primary} />
                  <ThemedText style={{ marginLeft: Spacing.sm }}>
                    {selectedSpot.hasOutlets === true
                      ? "Outlets confirmed"
                      : selectedSpot.hasOutlets === false
                        ? "No outlets reported"
                        : `Estimated ${Math.round((selectedSpot.powerConfidence ?? 0.5) * 100)}% chance of outlets`}
                  </ThemedText>
                </View>

                <Pressable
                  style={[styles.webPrimaryButton, { backgroundColor: theme.primary }]}
                  onPress={() => navigation.navigate("LocationDetails", { spotId: selectedSpot.id })}
                >
                  <Feather name="info" size={16} color="#FFFFFF" />
                  <ThemedText style={{ color: "#FFFFFF", fontWeight: "700", marginLeft: Spacing.sm }}>
                    View details
                  </ThemedText>
                </Pressable>
              </View>
            ) : null}

        <FlatList
          data={filteredSpots}
          keyExtractor={(item) => item.id}
          renderItem={renderSpotCard}
          contentContainerStyle={{ padding: Spacing.lg, paddingBottom: tabBarHeight + Spacing.xl }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="search" size={48} color={theme.textSecondary} />
              <ThemedText secondary style={{ marginTop: Spacing.md }}>
                No charging spots found
              </ThemedText>
            </View>
          }
        />
          </View>
        </View>
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
        onPress={(e: any) => {
          // Only clear if tapping directly on map (not on a marker)
          if (e.nativeEvent.action === "marker-press") {
            return;
          }
          // Keep selectedSpot when filters change - only clear on explicit map tap
          // setSelectedSpot(null);
        }}
      >
        {filteredSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => handleMarkerPress(spot)}
          >
            <View style={[styles.markerContainer, { backgroundColor: theme.primary }]}>
              <Feather name="battery-charging" size={16} color="#FFFFFF" />
            </View>
          </Marker>
        ))}
        {selectedSpot && !filteredSpots.find(s => s.id === selectedSpot.id) ? (
          <Marker
            key={selectedSpot.id}
            coordinate={{ latitude: selectedSpot.latitude, longitude: selectedSpot.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => handleMarkerPress(selectedSpot)}
          >
            <View style={[styles.markerContainer, { backgroundColor: theme.primary, opacity: 0.7 }]}>
              <Feather name="battery-charging" size={16} color="#FFFFFF" />
            </View>
          </Marker>
        ) : null}
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

        <StateSelector
          selectedState={selectedState}
          onStateChange={setSelectedState}
          isLoading={isSpotsFetching}
        />

          <View style={[styles.searchContainer, { backgroundColor: theme.backgroundRoot, marginTop: Spacing.xs }]}>
            <Feather name="search" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search charging spots..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={maybeShowInterstitialAfterSearch}
            />
            {searchQuery.length > 0 ? (
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather name="x" size={20} color={theme.textSecondary} />
              </Pressable>
            ) : null}
            <Pressable
              style={[styles.searchActionButton, { backgroundColor: theme.primary }]}
              onPress={maybeShowInterstitialAfterSearch}
            >
              <Feather name="search" size={14} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.filtersContainer}>
            {FILTER_OPTIONS.map((filter) => (
              <Pressable
                key={filter}
                style={[
                  styles.filterChip,
                  {
                      backgroundColor:
                        selectedFilters.has(filter) ? theme.primary : theme.backgroundDefault,
                  },
                ]}
                onPress={() => {
                  const newFilters = new Set(selectedFilters);
                  // Toggle the specific filter
                  if (newFilters.has(filter)) {
                    newFilters.delete(filter);
                  } else {
                    newFilters.add(filter);
                  }
                  setSelectedFilters(newFilters);
                }}
              >
                <ThemedText
                  style={{
                    color: selectedFilters.has(filter) ? "#FFFFFF" : theme.text,
                    fontWeight: "500",
                  }}
                  numberOfLines={1}
                >
                  {VENUE_TYPE_LABELS[filter]}
                </ThemedText>
              </Pressable>
            ))}
          </View>
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
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <ThemedText type="headline" numberOfLines={2} style={{ flexWrap: "wrap" }}>
                  {selectedSpot.name}
                </ThemedText>
                <ThemedText secondary type="small" style={{ marginTop: Spacing.xs }} numberOfLines={2}>
                  {selectedSpot.address}
                </ThemedText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.sm }}>
                <View style={[styles.venueTag, { backgroundColor: theme.primary + "20" }]}>
                  <ThemedText style={{ color: theme.primary, fontSize: 12, fontWeight: "500" }} numberOfLines={1}>
                    {VENUE_TYPE_LABELS[selectedSpot.venueType]}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => setIsBottomSheetOpen(false)}
                  style={[styles.closeButton, { backgroundColor: theme.backgroundSecondary }]}
                >
                  <Feather name="x" size={20} color={theme.text} />
                </Pressable>
              </View>
            </View>
            <View style={styles.bottomSheetStats}>
              <View style={styles.statItem}>
                <Feather name="zap" size={18} color={theme.primary} />
                <ThemedText style={{ marginLeft: Spacing.xs }}>
                  {`${selectedSpot.outletCount ?? 0} outlets`}
                </ThemedText>
              </View>
            </View>
            <View style={styles.powerRow}>
              <Feather name="battery-charging" size={18} color={theme.primary} />
              <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
                <ThemedText numberOfLines={2} style={{ flexWrap: "wrap" }}>
                  {selectedSpot.hasOutlets === true
                    ? "Outlets confirmed"
                    : selectedSpot.hasOutlets === false
                    ? "No outlets reported"
                    : `Estimated ${Math.round((selectedSpot.powerConfidence ?? 0.5) * 100)}% chance of outlets`}
                </ThemedText>
                <ThemedText secondary type="small" style={{ marginTop: Spacing.xs }} numberOfLines={1}>
                  Community votes: {(selectedSpot.communityYesVotes ?? 0)} yes / {(selectedSpot.communityNoVotes ?? 0)} no
                </ThemedText>
              </View>
            </View>
            <Pressable
              style={[
                styles.directionsButton,
                { backgroundColor: theme.backgroundSecondary, marginTop: Spacing.sm },
              ]}
              onPress={() => navigation.navigate("LocationDetails", { spotId: selectedSpot.id })}
            >
              <Feather name="info" size={18} color={theme.primary} />
              <ThemedText style={{ color: theme.text, fontWeight: "700", marginLeft: Spacing.sm, textAlign: "center" }}>
                View details
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.directionsButton, { backgroundColor: theme.primary }]}
              onPress={() => openDirections(selectedSpot)}
            >
              <Feather name="navigation" size={18} color="#FFFFFF" />
              <ThemedText style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: Spacing.sm, textAlign: "center" }}>
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
  searchActionButton: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.xs,
  },
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
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
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  venueTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    minWidth: 80,
    alignItems: "center",
  },
  bottomSheetStats: {
    flexDirection: "row",
    marginTop: Spacing.md,
    gap: Spacing.md,
    flexWrap: "wrap",
  },
  powerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
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
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    width: "100%",
  },
  webHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  webHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  webHeaderTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  webNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  webSplit: {
    flex: 1,
    flexDirection: "row",
  },
  webMapPane: {
    flex: 1,
    padding: Spacing.lg,
  },
  webListPane: {
    width: 420,
    maxWidth: "42%",
  },
  webSelectedCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  webSelectedHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  webClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  webSelectedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  webPrimaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    width: "100%",
  },
  webSpotCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  webSpotCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  webSpotIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  webSpotCardStats: {
    flexDirection: "row",
    marginTop: Spacing.md,
    gap: Spacing.xl,
    marginLeft: 56,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
});
