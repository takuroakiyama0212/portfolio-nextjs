import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as Location from "expo-location";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ChargingSpot, VenueType, VENUE_TYPE_LABELS, calculateDistance } from "@/data/mockData";
import { ListStackParamList } from "@/navigation/ListStackNavigator";
import { useSpots } from "@/hooks/useSpots";
import { StateSelector } from "@/components/StateSelector";
import { StickyBannerAd } from "@/components/ads/AdWidgets";
import { AustralianState } from "@/data/australianStates";
import { useAds } from "@/context/AdsContext";

type SortOption = "nearest" | "recent";

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "nearest", label: "Nearest" },
  { key: "recent", label: "New" },
];
const BANNER_HEIGHT = 72;

export default function ListScreen() {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp<ListStackParamList>>();
  const { showAds, maybeShowInterstitialAfterSearch } = useAds();

  const [selectedState, setSelectedState] = useState<AustralianState>("QLD");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("nearest");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const {
    data: spots = [],
    isLoading: isSpotsLoading,
    isFetching: isSpotsFetching,
  } = useSpots(selectedState);

  useEffect(() => {
    getUserLocation();
  }, []);

  // After the initial load, don't block the whole UI on state changes (OSM can be slow).
  useEffect(() => {
    if (!isSpotsLoading) {
      setHasLoadedOnce(true);
    }
  }, [isSpotsLoading]);

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
    } finally {
      setIsLoading(false);
    }
  };

  const spotsWithDistance = spots.map((spot) => ({
    ...spot,
    distance: userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        )
      : 0,
  }));

  const filteredAndSortedSpots = spotsWithDistance
    .filter(
      (spot) =>
        searchQuery === "" ||
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "nearest":
          return (a.distance || 0) - (b.distance || 0);
        case "recent":
          return (
            Number(b.id.match(/\d+/)?.[0] ?? 0) -
            Number(a.id.match(/\d+/)?.[0] ?? 0)
          );
        default:
          return 0;
      }
    });

  const confidencePercent = (spot: ChargingSpot) => {
    if (spot.hasOutlets === true) return 100;
    if (spot.hasOutlets === false) return 0;
    return Math.round((spot.powerConfidence ?? 0.5) * 100);
  };

  const renderSpotItem = ({ item }: { item: ChargingSpot & { distance: number } }) => (
    <Card
      style={styles.spotCard}
      onPress={() => navigation.navigate("LocationDetails", { spotId: item.id })}
    >
      <View style={styles.spotHeader}>
        <View style={{ flex: 1, marginRight: Spacing.sm }}>
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
      <View style={styles.spotStats}>
        <View style={styles.statItem}>
          <Feather name="zap" size={16} color={theme.primary} />
          <ThemedText type="small" style={{ marginLeft: Spacing.xs }}>
            {`${item.outletCount ?? 0} outlets`}
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <Feather name="battery-charging" size={16} color={theme.primary} />
          <ThemedText type="small" style={{ marginLeft: Spacing.xs }}>
            {`${confidencePercent(item)}%`}
          </ThemedText>
        </View>
      </View>
    </Card>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <StateSelector
        selectedState={selectedState}
        onStateChange={setSelectedState}
        isLoading={isSpotsFetching}
      />
      <View style={[styles.searchContainer, { backgroundColor: theme.backgroundSecondary, marginTop: Spacing.sm }]}>
        <Feather name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search spots..."
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
      <View style={styles.sortContainer}>
        {SORT_OPTIONS.map((option) => (
          <Pressable
            key={option.key}
            style={[
              styles.sortButton,
              {
                backgroundColor:
                  sortBy === option.key ? theme.primary : theme.backgroundSecondary,
              },
            ]}
            onPress={() => setSortBy(option.key)}
          >
            <ThemedText
              type="small"
              allowFontScaling={false}
              maxFontSizeMultiplier={1}
              style={{
                color: sortBy === option.key ? "#FFFFFF" : theme.text,
                fontWeight: "500",
                fontSize: 11,
                lineHeight: 14,
                // Android can clip the last glyph by a few pixels; give the text its own safe padding.
                width: "100%",
                paddingHorizontal: 4,
                textAlign: "center",
                flexShrink: 1,
                flexWrap: "wrap",
                includeFontPadding: false,
              }}
              numberOfLines={1}
              ellipsizeMode="clip"
            >
              {option.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );

  if ((isLoading || isSpotsLoading) && !hasLoadedOnce) {
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

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredAndSortedSpots}
        keyExtractor={(item) => item.id}
        renderItem={renderSpotItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.sm + (showAds ? BANNER_HEIGHT + Spacing.md : 0) },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="search" size={48} color={theme.textSecondary} />
            <ThemedText secondary style={styles.emptyText}>
              No charging spots found
            </ThemedText>
          </View>
        }
      />
      {showAds ? <StickyBannerAd bottomOffset={tabBarHeight + Spacing.sm} /> : null}
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
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  listHeader: {
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: BorderRadius.md,
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
  sortContainer: {
    flexDirection: "row",
    marginTop: Spacing.md,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  sortButton: {
    width: "48%",
    minWidth: 0,
    minHeight: 44,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  spotCard: {
    marginBottom: Spacing.md,
  },
  spotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  venueTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    marginLeft: Spacing.sm,
    minWidth: 80,
    alignItems: "center",
  },
  spotStats: {
    flexDirection: "row",
    marginTop: Spacing.md,
    gap: Spacing.md,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
  },
  emptyText: {
    marginTop: Spacing.lg,
  },
});
