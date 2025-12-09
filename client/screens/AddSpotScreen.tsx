import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { HeaderButton } from "@react-navigation/elements";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { VenueType, OutletType, VENUE_TYPE_LABELS, OUTLET_TYPE_LABELS } from "@/data/mockData";

const VENUE_TYPES: VenueType[] = ["cafe", "library", "airport", "mall", "restaurant", "hotel", "coworking"];
const OUTLET_TYPES: OutletType[] = ["usb-a", "usb-c", "standard"];

export default function AddSpotScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState<VenueType | null>(null);
  const [outletCount, setOutletCount] = useState(1);
  const [selectedOutletTypes, setSelectedOutletTypes] = useState<OutletType[]>([]);
  const [notes, setNotes] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isFormValid = venueName.trim().length > 0 && venueType !== null && selectedOutletTypes.length > 0;

  useEffect(() => {
    getUserLocation();
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton onPress={() => navigation.goBack()}>
          <ThemedText type="link">Cancel</ThemedText>
        </HeaderButton>
      ),
      headerRight: () => (
        <HeaderButton
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <ThemedText
            type="link"
            style={{ opacity: isFormValid ? 1 : 0.5 }}
          >
            Submit
          </ThemedText>
        </HeaderButton>
      ),
    });
  }, [isFormValid, venueName, venueType, outletCount, selectedOutletTypes, notes]);

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

  const toggleOutletType = (type: OutletType) => {
    setSelectedOutletTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    
    Alert.alert(
      "Spot Added!",
      `${venueName} has been submitted for review. Thank you for contributing!`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText style={styles.loadingText}>Getting your location...</ThemedText>
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
        {userLocation ? (
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
                <ThemedText
                  type="small"
                  style={{
                    color: venueType === type ? "#FFFFFF" : theme.text,
                    fontWeight: "500",
                  }}
                >
                  {VENUE_TYPE_LABELS[type]}
                </ThemedText>
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
                <ThemedText
                  type="small"
                  style={{
                    color: selectedOutletTypes.includes(type) ? "#FFFFFF" : theme.text,
                    fontWeight: "500",
                  }}
                >
                  {OUTLET_TYPE_LABELS[type]}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText type="headline" style={styles.sectionTitle}>
            Notes (Optional)
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
            placeholder="Any helpful tips for other users..."
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
  },
  loadingText: {
    marginTop: Spacing.lg,
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
});
