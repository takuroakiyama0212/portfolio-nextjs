import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { HeaderButton } from "@react-navigation/elements";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useAds } from "@/context/AdsContext";

export default function SettingsScreen() {
  const { theme, isDark } = useTheme();
  const { isSubscribed, setSubscribed } = useAds();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [displayName, setDisplayName] = useState("Explorer");
  const [useKilometers, setUseKilometers] = useState(false);
  const [autoLocate, setAutoLocate] = useState(true);
  const [notifications, setNotifications] = useState(false);

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color={theme.text} />
        </HeaderButton>
      ),
    });
  }, [theme]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="battery-charging" size={32} color={theme.primary} />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="headline">{displayName}</ThemedText>
              <ThemedText secondary type="small">
                Tap to edit your display name
              </ThemedText>
            </View>
          </View>
          <TextInput
            style={[
              styles.nameInput,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Enter display name..."
            placeholderTextColor={theme.textSecondary}
            value={displayName}
            onChangeText={setDisplayName}
          />
        </Card>

        <ThemedText type="headline" style={styles.sectionTitle}>
          Preferences
        </ThemedText>

        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Feather name="navigation" size={20} color={theme.primary} />
              <View style={styles.settingText}>
                <ThemedText>Distance Units</ThemedText>
                <ThemedText secondary type="small">
                  {useKilometers ? "Kilometers" : "Miles"}
                </ThemedText>
              </View>
            </View>
            <Switch
              value={useKilometers}
              onValueChange={setUseKilometers}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={useKilometers ? theme.primary : theme.backgroundTertiary}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Feather name="crosshair" size={20} color={theme.primary} />
              <View style={styles.settingText}>
                <ThemedText>Auto-locate on Open</ThemedText>
                <ThemedText secondary type="small">
                  Center map on your location
                </ThemedText>
              </View>
            </View>
            <Switch
              value={autoLocate}
              onValueChange={setAutoLocate}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={autoLocate ? theme.primary : theme.backgroundTertiary}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Feather name="bell" size={20} color={theme.primary} />
              <View style={styles.settingText}>
                <ThemedText>Notifications</ThemedText>
                <ThemedText secondary type="small">
                  New spots nearby alerts
                </ThemedText>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={notifications ? theme.primary : theme.backgroundTertiary}
            />
          </View>
        </Card>

        <ThemedText type="headline" style={styles.sectionTitle}>
          Subscription
        </ThemedText>

        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Feather name="zap" size={20} color={theme.primary} />
              <View style={styles.settingText}>
                <ThemedText>Charge Spotter Plus</ThemedText>
                <ThemedText secondary type="small">
                  {isSubscribed
                    ? "Subscribed: all ads are hidden"
                    : "Pay AUD 1/week to remove all ads"}
                </ThemedText>
              </View>
            </View>
            <Switch
              value={isSubscribed}
              onValueChange={setSubscribed}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={isSubscribed ? theme.primary : theme.backgroundTertiary}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Feather name="credit-card" size={20} color={theme.primary} />
              <View style={styles.settingText}>
                <ThemedText secondary type="small">
                  Weekly plan: AUD 1 / week. Cancel anytime.
                </ThemedText>
              </View>
            </View>
          </View>
        </Card>

        <ThemedText type="headline" style={styles.sectionTitle}>
          About
        </ThemedText>

        <Card style={styles.settingsCard}>
          <Pressable style={styles.aboutRow}>
            <View style={styles.settingInfo}>
              <Feather name="info" size={20} color={theme.primary} />
              <ThemedText style={{ marginLeft: Spacing.md }}>Version</ThemedText>
            </View>
            <ThemedText secondary>1.0.0</ThemedText>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Pressable style={styles.aboutRow}>
            <View style={styles.settingInfo}>
              <Feather name="file-text" size={20} color={theme.primary} />
              <ThemedText style={{ marginLeft: Spacing.md }}>Terms of Service</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Pressable style={styles.aboutRow}>
            <View style={styles.settingInfo}>
              <Feather name="shield" size={20} color={theme.primary} />
              <ThemedText style={{ marginLeft: Spacing.md }}>Privacy Policy</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        </Card>
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
    paddingHorizontal: Spacing.lg,
  },
  profileCard: {
    marginBottom: Spacing.xl,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    marginLeft: Spacing.lg,
  },
  nameInput: {
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    fontSize: 16,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  settingsCard: {
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: Spacing.md,
  },
  divider: {
    height: 1,
    marginLeft: Spacing["3xl"],
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
  },
});
