import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";

export default function AddSpotLoginScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !isSubmitting;

  const handlePrimaryAction = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(
        result.error ?? (mode === "register" ? "Could not register." : "Could not sign in.")
      );
      return;
    }
    if (mode === "register") {
      Alert.alert("Registered", "Your account has been created and you are now logged in.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <Card>
          <View style={styles.headerRow}>
            <View style={[styles.iconWrap, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="lock" size={20} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="headline">Login required</ThemedText>
              <ThemedText secondary type="small" style={{ marginTop: Spacing.xs }}>
                Enter your email and password to add a new spot.
              </ThemedText>
            </View>
          </View>

          <View style={styles.modeRow}>
            <Pressable
              onPress={() => {
                setMode("login");
                setErrorMessage(null);
              }}
              style={[
                styles.modeButton,
                {
                  backgroundColor: mode === "login" ? theme.primary : theme.backgroundSecondary,
                },
              ]}
            >
              <Text style={[styles.modeButtonText, { color: mode === "login" ? "#FFFFFF" : theme.text }]}>
                Login
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMode("register");
                setErrorMessage(null);
              }}
              style={[
                styles.modeButton,
                {
                  backgroundColor: mode === "register" ? theme.primary : theme.backgroundSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  { color: mode === "register" ? "#FFFFFF" : theme.text },
                ]}
              >
                Register
              </Text>
            </Pressable>
          </View>

          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.backgroundSecondary,
              },
            ]}
          />

          <TextInput
            secureTextEntry
            placeholder="Password"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.backgroundSecondary,
              },
            ]}
          />
          <ThemedText secondary type="small" style={{ marginTop: -Spacing.xs, marginBottom: Spacing.md }}>
            Use 8+ characters with letters and numbers only.
          </ThemedText>

          {errorMessage ? (
            <ThemedText style={{ color: "#d9534f", marginTop: Spacing.sm }}>{errorMessage}</ThemedText>
          ) : null}

          <Pressable
            onPress={handlePrimaryAction}
            disabled={!canSubmit}
            style={[
              styles.submitButton,
              { backgroundColor: canSubmit ? theme.primary : theme.border },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>{mode === "register" ? "Register" : "Login"}</Text>
            )}
          </Pressable>
        </Card>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  submitButton: {
    height: 46,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.sm,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.md,
    overflow: "visible",
  },
  submitText: {
    width: "100%",
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 20,
    includeFontPadding: true,
    paddingHorizontal: 8,
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  modeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  modeButton: {
    flex: 1,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.sm,
    overflow: "visible",
  },
  modeButtonText: {
    width: "100%",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 18,
    includeFontPadding: true,
    paddingHorizontal: 8,
    flexShrink: 1,
  },
});

