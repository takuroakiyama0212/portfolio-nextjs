import React, { useState } from "react";
import { View, StyleSheet, Pressable, Modal, FlatList, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { AustralianState, STATE_OPTIONS } from "@/data/australianStates";

interface StateSelectorProps {
  selectedState: AustralianState;
  onStateChange: (state: AustralianState) => void;
  isLoading?: boolean;
}

export function StateSelector({ selectedState, onStateChange, isLoading = false }: StateSelectorProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = STATE_OPTIONS.find((option) => option.value === selectedState);
  const selectedDisplay = selectedOption
    ? `${selectedOption.value} (${selectedOption.label})`
    : selectedState;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => setIsOpen(true)}
        style={[
          styles.compactButton,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
          Shadows.small,
        ]}
      >
        <View style={styles.compactLeft}>
          <Feather name="map" size={16} color={theme.primary} />
          <ThemedText style={styles.compactText}>
            {selectedDisplay}
          </ThemedText>
        </View>
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <Feather name="chevron-down" size={18} color={theme.textSecondary} />
        )}
      </Pressable>

      <Modal transparent visible={isOpen} animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: theme.backgroundDefault }]}
            onPress={() => {
              // swallow presses so backdrop doesn't close when tapping inside
            }}
          >
            <View style={styles.modalHeader}>
              <ThemedText type="headline">Choose State</ThemedText>
              <Pressable onPress={() => setIsOpen(false)} style={styles.closeIcon}>
                <Feather name="x" size={18} color={theme.textSecondary} />
              </Pressable>
            </View>

            <FlatList
              data={STATE_OPTIONS}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedState;
                return (
                  <Pressable
                    style={[
                      styles.row,
                      {
                        backgroundColor: isSelected ? theme.primary + "15" : "transparent",
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => {
                      onStateChange(item.value);
                      setIsOpen(false);
                    }}
                  >
                    <View style={styles.rowLeft}>
                      <ThemedText style={styles.rowCode}>{`${item.value} (${item.label})`}</ThemedText>
                    </View>
                    {isSelected ? <Feather name="check" size={18} color={theme.primary} /> : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  compactButton: {
    alignSelf: "stretch",
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
    minHeight: 42,
  },
  compactLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    flexShrink: 1,
    flex: 1,
  },
  compactText: {
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: Spacing.lg,
    justifyContent: "center",
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  closeIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  row: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  rowLeft: {
    flex: 1,
    paddingRight: Spacing.lg,
  },
  rowCode: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
    flex: 1,
    flexWrap: "wrap",
    lineHeight: 24,
  },
});

