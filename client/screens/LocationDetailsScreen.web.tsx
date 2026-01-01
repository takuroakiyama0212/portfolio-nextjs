import React from "react";
import { Pressable, ScrollView, StyleSheet, View, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SpotsMap } from "@/components/SpotsMap";
import { Spacing, BorderRadius } from "@/constants/theme";
import { OUTLET_TYPE_LABELS, VENUE_TYPE_LABELS } from "@/data/mockData";
import { useSpots } from "@/hooks/useSpots";

type RouteParams = { LocationDetails: { spotId: string } };
type LocationDetailsRouteProp = RouteProp<RouteParams, "LocationDetails">;

function googleMapsUrl(lat: number, lon: number, name?: string) {
  const q = encodeURIComponent(name ? `${name} @ ${lat},${lon}` : `${lat},${lon}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function LocationDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<LocationDetailsRouteProp>();
  const { spotId } = route.params;

  const { data: spots = [], isLoading } = useSpots();
  const spot = spots.find((s) => s.id === spotId) || null;

  React.useEffect(() => {
    if (spot) navigation.setOptions?.({ headerTitle: spot.name });
  }, [spot?.id]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.center}>
          <ThemedText>Loading spot...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!spot) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.center}>
          <ThemedText>Spot not found</ThemedText>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={16} color="#0b1220" />
            <ThemedText style={{ marginLeft: Spacing.sm, color: "#0b1220", fontWeight: "700" }}>
              Back
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  const confidence =
    spot.hasOutlets === true ? 1 : spot.hasOutlets === false ? 0 : spot.powerConfidence ?? 0.5;
  const yes = spot.communityYesVotes ?? 0;
  const no = spot.communityNoVotes ?? 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapWrap}>
          <SpotsMap
            spots={[spot]}
            selectedSpotId={spot.id}
            onSelectSpot={() => {
              // no-op: single spot
            }}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.venueTag}>
              <ThemedText style={styles.venueTagText}>
                {VENUE_TYPE_LABELS[spot.venueType]}
              </ThemedText>
            </View>
          </View>

          <Card style={styles.card}>
            <View style={styles.row}>
              <Feather name="map-pin" size={18} color="#4CAF50" />
              <ThemedText style={styles.rowText}>{spot.address}</ThemedText>
            </View>

            {spot.hours ? (
              <View style={styles.row}>
                <Feather name="clock" size={18} color="#4CAF50" />
                <ThemedText style={styles.rowText}>{spot.hours}</ThemedText>
              </View>
            ) : (
              <View style={styles.row}>
                <Feather name="clock" size={18} color="#4CAF50" />
                <ThemedText style={styles.rowText}>
                  Hours not available yet
                </ThemedText>
              </View>
            )}

            {spot.phone ? (
              <Pressable
                style={styles.row}
                onPress={() => Linking.openURL(`tel:${spot.phone}`)}
              >
                <Feather name="phone" size={18} color="#4CAF50" />
                <ThemedText style={[styles.rowText, { textDecorationLine: "underline" }]}>
                  {spot.phone}
                </ThemedText>
              </Pressable>
            ) : null}
          </Card>

          <Card style={styles.card}>
            <ThemedText style={styles.sectionTitle}>Charging info</ThemedText>

            <View style={styles.row}>
              <Feather name="battery-charging" size={18} color="#4CAF50" />
              <ThemedText style={styles.rowText}>
                {spot.hasOutlets === true
                  ? "Outlets confirmed"
                  : spot.hasOutlets === false
                    ? "No outlets reported"
                    : `Estimated ${Math.round(confidence * 100)}% chance of outlets`}
              </ThemedText>
            </View>

            <View style={styles.row}>
              <Feather name="zap" size={18} color="#4CAF50" />
              <ThemedText style={styles.rowText}>
                {spot.outletCount} outlets (reported)
              </ThemedText>
            </View>

            <View style={styles.chips}>
              {spot.outletTypes.map((t) => (
                <View key={t} style={styles.chip}>
                  <ThemedText style={styles.chipText}>{OUTLET_TYPE_LABELS[t]}</ThemedText>
                </View>
              ))}
            </View>

            <ThemedText style={styles.smallMuted}>
              Community votes: {yes} yes / {no} no
            </ThemedText>
          </Card>

          {spot.tips && spot.tips.length > 0 ? (
            <Card style={styles.card}>
              <ThemedText style={styles.sectionTitle}>Helpful tips</ThemedText>
              {spot.tips.map((tip, idx) => (
                <View key={idx} style={styles.tipRow}>
                  <Feather name="check-circle" size={16} color="#4CAF50" />
                  <ThemedText style={{ marginLeft: Spacing.sm }}>{tip}</ThemedText>
                </View>
              ))}
            </Card>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              style={[styles.actionBtn, styles.actionPrimary]}
              onPress={() => Linking.openURL(googleMapsUrl(spot.latitude, spot.longitude, spot.name))}
            >
              <Feather name="navigation" size={16} color="#ffffff" />
              <ThemedText style={styles.actionPrimaryText}>Open in Google Maps</ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: Spacing.xl },
  backBtn: {
    marginTop: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76,175,80,0.18)",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  scroll: { paddingTop: Spacing.lg },
  mapWrap: {
    height: 280,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  venueTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.35)",
    backgroundColor: "rgba(76,175,80,0.12)",
  },
  venueTagText: { color: "#4CAF50", fontSize: 12, fontWeight: "700" },
  card: { marginTop: Spacing.md },
  sectionTitle: { fontWeight: "800", marginBottom: Spacing.sm },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: Spacing.sm },
  rowText: { marginLeft: Spacing.md, flex: 1 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginTop: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  chipText: { fontSize: 12 },
  smallMuted: { marginTop: Spacing.sm, opacity: 0.75, fontSize: 12 },
  tipRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: Spacing.sm },
  actions: { marginTop: Spacing.lg },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  actionPrimary: { backgroundColor: "#4CAF50" },
  actionPrimaryText: { color: "#ffffff", fontWeight: "800", marginLeft: Spacing.sm },
});


