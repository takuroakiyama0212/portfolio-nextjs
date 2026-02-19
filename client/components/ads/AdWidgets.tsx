import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { BorderRadius, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "@/components/ThemedText";

export function StickyBannerAd({ bottomOffset = 0 }: { bottomOffset?: number }) {
  const { theme } = useTheme();

  return (
    <View
      pointerEvents="none"
      style={[
        styles.stickyContainer,
        {
          bottom: bottomOffset,
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.border,
        },
      ]}
    >
      <ThemedText type="small" secondary>
        Sponsored
      </ThemedText>
      <ThemedText style={{ marginTop: 4, fontWeight: "600" }}>
        Charge faster at partner cafes nearby
      </ThemedText>
    </View>
  );
}

export function NativeAdCard() {
  const { theme } = useTheme();

  return (
    <View style={[styles.nativeCard, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.nativeHeader}>
        <View style={[styles.nativeIcon, { backgroundColor: theme.primary + "20" }]}>
          <Feather name="star" size={16} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText type="small" secondary>
            Sponsored
          </ThemedText>
          <ThemedText style={{ marginTop: 2, fontWeight: "600" }}>
            PowerHub Lounge
          </ThemedText>
        </View>
      </View>
      <ThemedText secondary type="small" style={{ marginTop: Spacing.sm }}>
        Quiet seats, free Wi-Fi, and charging desks for remote work.
      </ThemedText>
      <Pressable style={[styles.nativeCta, { backgroundColor: theme.primary + "1A" }]}>
        <ThemedText style={{ color: theme.primary, fontWeight: "600" }}>Learn more</ThemedText>
      </Pressable>
    </View>
  );
}

export function InterstitialAdModal({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="small" secondary>
            Sponsored
          </ThemedText>
          <ThemedText type="h4" style={{ marginTop: Spacing.sm }}>
            {title}
          </ThemedText>
          <ThemedText secondary style={{ marginTop: Spacing.sm, textAlign: "center" }}>
            {message}
          </ThemedText>
          <Pressable style={[styles.closeButton, { backgroundColor: theme.primary }]} onPress={onClose}>
            <ThemedText style={{ color: "#FFFFFF", fontWeight: "700" }}>Continue</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  stickyContainer: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Shadows.medium,
  },
  nativeCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  nativeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  nativeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  nativeCta: {
    marginTop: Spacing.md,
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  modalCard: {
    width: "100%",
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    ...Shadows.large,
  },
  closeButton: {
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
});

