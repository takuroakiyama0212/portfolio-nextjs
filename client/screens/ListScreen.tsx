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

type SortOption = "nearest" | "outlets" | "recent";

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "nearest", label: "Nearest" },
  { key: "outlets", label: "Most Outlets" },
  { key: "recent", label: "Recently Added" },
];

export default function ListScreen() {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp<ListStackParamList>>();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("nearest");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: spots = [], isLoading: isSpotsLoading } = useSpots();

  useEffect(() => {
    getUserLocation();
  }, []);

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
        case "outlets":
          return b.outletCount - a.outletCount;
        case "recent":
          return (
            Number(b.id.match(/\d+/)?.[0] ?? 0) -
            Number(a.id.match(/\d+/)?.[0] ?? 0)
          );
        default:
          return 0;
      }
    });

  const renderSpotItem = ({ item }: { item: ChargingSpot & { distance: number } }) => (
    <Card
      style={styles.spotCard}
      onPress={() => navigation.navigate("LocationDetails", { spotId: item.id })}
    >
      <View style={styles.spotHeader}>
        <View style={{ flex: 1 }}>
          <ThemedText type="headline">{item.name}</ThemedText>
          <ThemedText secondary type="small" style={{ marginTop: Spacing.xs }}>
            {item.address}
          </ThemedText>
        </View>
        <View style={[styles.venueTag, { backgroundColor: theme.primary + "20" }]}>
          <ThemedText style={{ color: theme.primary, fontSize: 12, fontWeight: "500" }}>
            {VENUE_TYPE_LABELS[item.venueType]}
          </ThemedText>
        </View>
      </View>
      <View style={styles.spotStats}>
        <View style={styles.statItem}>
          <Feather name="zap" size={16} color={theme.primary} />
          <ThemedText type="small" style={{ marginLeft: Spacing.xs }}>
            {item.outletCount} outlets
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <Feather name="navigation" size={16} color={theme.primary} />
          <ThemedText type="small" style={{ marginLeft: Spacing.xs }}>
            {item.distance.toFixed(1)} mi
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <Feather name="battery-charging" size={16} color={theme.primary} />
          <ThemedText type="small" style={{ marginLeft: Spacing.xs }}>
            {item.hasOutlets === true
              ? "Confirmed"
              : item.hasOutlets === false
              ? "No outlets"
              : `${Math.round((item.powerConfidence ?? 0.5) * 100)}% likely`}
          </ThemedText>
        </View>
      </View>
    </Card>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <View style={[styles.searchContainer, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search spots..."
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
              style={{
                color: sortBy === option.key ? "#FFFFFF" : theme.text,
                fontWeight: "500",
              }}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );

  if (isLoading || isSpotsLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText style={styles.loadingText}>Loading Queensland spots...</ThemedText>
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
          { paddingBottom: tabBarHeight + Spacing.xl },
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
  },
  loadingText: {
    marginTop: Spacing.lg,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  listHeader: {
    marginBottom: Spacing.lg,
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
  sortContainer: {
    flexDirection: "row",
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  sortButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
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
  },
  spotStats: {
    flexDirection: "row",
    marginTop: Spacing.md,
    gap: Spacing.xl,
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
