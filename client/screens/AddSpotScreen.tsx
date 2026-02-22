import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { VenueType, OutletType, VENUE_TYPE_LABELS, OUTLET_TYPE_LABELS } from "@/data/mockData";
import { apiRequest } from "@/lib/query-client";
import { addSpotToFirestore } from "@/lib/firestore";

const VENUE_TYPES: VenueType[] = ["cafe", "library", "airport", "mall", "restaurant", "hotel", "coworking"];
const OUTLET_TYPES: OutletType[] = ["usb-a", "usb-c", "standard", "other"];
const OUTLET_TYPE_SHORT_LABELS: Record<OutletType, string> = {
  "usb-a": "USB-A",
  "usb-c": "USB-C",
  standard: "STD",
  other: "Other",
};
const DAILY_OUTLET_ADD_LIMIT = 10;
const OUTLET_ADD_LIMIT_STORAGE_KEY = "outlet-add-limit";

export default function AddSpotScreen() {
  const { theme } = useTheme();
  const { userEmail } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState<VenueType | null>(null);
  const [outletCount, setOutletCount] = useState(1);
  const [selectedOutletTypes, setSelectedOutletTypes] = useState<OutletType[]>([]);
  const [notes, setNotes] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyAddCount, setDailyAddCount] = useState(0);

  const hasOtherSelected = selectedOutletTypes.includes("other");
  const isFormValid = venueName.trim().length > 0 && venueType !== null && selectedOutletTypes.length > 0 && (!hasOtherSelected || notes.trim().length > 0);

  useEffect(() => {
    initializeScreen();
    navigation.setOptions({
      headerTitle: "Add Spot",
      headerTitleAlign: "center",
      headerLeftContainerStyle: { paddingLeft: Spacing.sm },
      headerRightContainerStyle: { paddingRight: Spacing.sm },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} style={styles.headerActionButton}>
          <Text allowFontScaling={false} maxFontSizeMultiplier={1} style={[styles.headerActionText, { color: theme.primary }]}>
            Back
          </Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={handleSubmit}
          disabled={!isFormValid}
          style={[
            styles.submitHeaderButton,
            {
              backgroundColor: isFormValid ? theme.primary : theme.border,
            },
          ]}
        >
          <Text allowFontScaling={false} maxFontSizeMultiplier={1} style={styles.submitHeaderButtonText}>
            Save
          </Text>
        </Pressable>
      ),
    });
  }, [isFormValid, venueName, venueType, outletCount, selectedOutletTypes, notes, userEmail, theme]);

  const getTodayKey = () => new Date().toISOString().slice(0, 10);

  const readDailyCounter = async () => {
    try {
      const raw = await AsyncStorage.getItem(OUTLET_ADD_LIMIT_STORAGE_KEY);
      const today = getTodayKey();
      if (!raw) {
        return { date: today, count: 0 };
      }
      const parsed = JSON.parse(raw) as { date?: string; count?: number };
      if (parsed.date !== today) {
        return { date: today, count: 0 };
      }
      return { date: today, count: Math.max(0, Number(parsed.count ?? 0)) };
    } catch (error) {
      console.log("Error reading outlet add limit state:", error);
      return { date: getTodayKey(), count: 0 };
    }
  };

  const saveDailyCounter = async (count: number) => {
    try {
      await AsyncStorage.setItem(
        OUTLET_ADD_LIMIT_STORAGE_KEY,
        JSON.stringify({ date: getTodayKey(), count })
      );
    } catch (error) {
      console.log("Error saving outlet add limit state:", error);
    }
  };

  const initializeScreen = async () => {
    await Promise.all([getUserLocation(), loadDailyAddCount()]);
  };

  const loadDailyAddCount = async () => {
    const state = await readDailyCounter();
    setDailyAddCount(state.count);
  };

  const getUserLocation = async () => {
    if (Platform.OS === "web") {
      setIsLoading(false);
      return;
    }
    
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

  const toggleOutletType = (type: OutletType) => {
    setSelectedOutletTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    if (!userEmail) {
      Alert.alert("Login required", "Please log in with email and password to add a spot.");
      return;
    }

    const state = await readDailyCounter();
    if (state.count >= DAILY_OUTLET_ADD_LIMIT) {
      Alert.alert(
        "Daily limit reached",
        "Outlet additions are limited to 10 per day. Please try again tomorrow."
      );
      return;
    }

    const nextCount = state.count + 1;
    await saveDailyCounter(nextCount);
    setDailyAddCount(nextCount);

    // Validate location
    if (!userLocation) {
      Alert.alert("Location Required", "Please enable location services to add a spot.");
      return;
    }

    // Build address from location (simplified - could be enhanced with reverse geocoding)
    const address = `${venueName}, ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`;

    // Save to Firestore
    try {
      const firestoreResult = await addSpotToFirestore(
        {
          name: venueName,
          address: address,
          venueType: venueType,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          outletCount: outletCount,
          outletTypes: selectedOutletTypes,
          hasOutlets: null, // Not verified yet
          powerConfidence: 0.5, // Default confidence for user-submitted spots
          communityYesVotes: 0,
          communityNoVotes: 0,
          tips: notes.trim() ? [notes.trim()] : undefined,
        },
        userEmail
      );

      if (!firestoreResult.ok) {
        console.error("Failed to save to Firestore:", firestoreResult.error);
        Alert.alert("Error", "Failed to save spot. Please try again.");
        return;
      }
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      Alert.alert("Error", "Failed to save spot. Please try again.");
      return;
    }

    // Send email notification
    try {
      await apiRequest("POST", "/api/add-spot/notify", {
        userEmail,
        venueName,
        venueType,
        outletCount,
        notes,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    } catch (error) {
      console.log("Failed to notify add-spot email:", error);
    }

    Alert.alert(
      "Spot Added!",
      `${venueName} has been submitted for review. Thank you for contributing!\nToday: ${nextCount}/${DAILY_OUTLET_ADD_LIMIT}`,
      [
        {
          text: "OK",
          onPress: () => {
            // Reset form to initial state
            setVenueName("");
            setVenueType(null);
            setOutletCount(1);
            setSelectedOutletTypes([]);
            setNotes("");
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (isLoading) {
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
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {Platform.OS === "web" ? (
          <View style={[styles.mapContainer, { backgroundColor: theme.backgroundSecondary, justifyContent: "center", alignItems: "center" }]}>
            <Feather name="map-pin" size={32} color={theme.primary} />
            <ThemedText type="small" secondary style={{ marginTop: Spacing.sm, textAlign: "center" }}>
              Location will be captured when submitted via mobile app
            </ThemedText>
          </View>
        ) : userLocation ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={userLocation}>
                <View style={[styles.markerContainer, { backgroundColor: theme.primary }]}>
                  <Feather name="plus" size={16} color="#FFFFFF" />
                </View>
              </Marker>
            </MapView>
            <View style={styles.mapOverlay}>
              <ThemedText type="small" secondary>
                Your current location will be used
              </ThemedText>
            </View>
          </View>
        ) : null}

        <View style={styles.formSection}>
          <View style={[styles.dailyLimitBanner, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="info" size={16} color={theme.primary} />
            <ThemedText type="small" secondary style={{ marginLeft: Spacing.sm, flex: 1 }}>
              Outlet additions: {dailyAddCount}/{DAILY_OUTLET_ADD_LIMIT} used today
            </ThemedText>
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText type="headline" style={styles.sectionTitle}>
            Venue Name
          </ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Enter venue name..."
            placeholderTextColor={theme.textSecondary}
            value={venueName}
            onChangeText={setVenueName}
          />
        </View>

        <View style={styles.formSection}>
          <ThemedText type="headline" style={styles.sectionTitle}>
            Venue Type
          </ThemedText>
          <View style={styles.chipContainer}>
            {VENUE_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      venueType === type ? theme.primary : theme.backgroundSecondary,
                  },
                ]}
                onPress={() => setVenueType(type)}
              >
                <Text
                  style={{
                    color: venueType === type ? "#FFFFFF" : theme.text,
                    fontWeight: "600",
                    fontSize: 12,
                    textAlign: "center",
                    includeFontPadding: true,
                  }}
                  numberOfLines={1}
                  allowFontScaling={false}
                >
                  {VENUE_TYPE_LABELS[type]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText type="headline" style={styles.sectionTitle}>
            Number of Outlets
          </ThemedText>
          <View style={styles.stepperContainer}>
            <Pressable
              style={[styles.stepperButton, { backgroundColor: theme.backgroundSecondary }]}
              onPress={() => setOutletCount((prev) => Math.max(1, prev - 1))}
            >
              <Feather name="minus" size={20} color={theme.text} />
            </Pressable>
            <View style={[styles.stepperValue, { backgroundColor: theme.backgroundSecondary }]}>
              <ThemedText type="h4">{outletCount}</ThemedText>
            </View>
            <Pressable
              style={[styles.stepperButton, { backgroundColor: theme.backgroundSecondary }]}
              onPress={() => setOutletCount((prev) => prev + 1)}
            >
              <Feather name="plus" size={20} color={theme.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText type="headline" style={styles.sectionTitle}>
            Outlet Types
          </ThemedText>
          <View style={styles.chipContainer}>
            {OUTLET_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selectedOutletTypes.includes(type)
                      ? theme.primary
                      : theme.backgroundSecondary,
                  },
                ]}
                onPress={() => toggleOutletType(type)}
              >
                <Text
                  allowFontScaling={false}
                  maxFontSizeMultiplier={1}
                  style={{
                    color: selectedOutletTypes.includes(type) ? "#FFFFFF" : theme.text,
                    fontWeight: "600",
                    fontSize: 12,
                    textAlign: "center",
                    includeFontPadding: true,
                    letterSpacing: 0,
                    fontFamily: Platform.OS === "android" ? "sans-serif-medium" : undefined,
                    paddingHorizontal: 6,
                  }}
                >
                  {OUTLET_TYPE_SHORT_LABELS[type]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText type="headline" style={styles.sectionTitle}>
            Notes {selectedOutletTypes.includes("other") ? "(Required for Other)" : "(Optional)"}
          </ThemedText>
          <TextInput
            style={[
              styles.textInput,
              styles.textArea,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder={selectedOutletTypes.includes("other") ? "Please describe the outlet type (e.g., wireless charging, proprietary connector, etc.)" : "Any helpful tips for other users..."}
            placeholderTextColor={theme.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </KeyboardAwareScrollViewCompat>
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
    paddingHorizontal: Spacing.lg,
  },
  mapContainer: {
    height: 150,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginBottom: Spacing.xl,
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
  mapOverlay: {
    position: "absolute",
    bottom: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    alignItems: "center",
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  dailyLimitBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  textInput: {
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.md,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    minWidth: 104,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperValue: {
    width: 80,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  submitHeaderButton: {
    minWidth: 92,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    overflow: "visible",
  },
  headerActionButton: {
    minWidth: 92,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    overflow: "visible",
  },
  headerActionText: {
    fontSize: 13,
    fontWeight: "600",
    includeFontPadding: true,
    textAlign: "center",
    letterSpacing: 0,
    paddingHorizontal: 6,
    fontFamily: Platform.OS === "android" ? "sans-serif-medium" : undefined,
  },
  submitHeaderButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
    includeFontPadding: true,
    textAlign: "center",
    letterSpacing: 0,
    paddingHorizontal: 6,
    fontFamily: Platform.OS === "android" ? "sans-serif-medium" : undefined,
  },
});
