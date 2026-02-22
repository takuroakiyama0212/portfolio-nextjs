import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
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
  const { signIn, register, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !isSubmitting;

  const handlePrimaryAction = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    const result = mode === "register"
      ? await register(email, password)
      : await signIn(email, password);
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    const result = await signInWithGoogle();
    setIsGoogleLoading(false);

    if (!result.ok) {
      setErrorMessage(result.error ?? "Could not sign in with Google.");
      return;
    }
    // Google sign-in automatically creates an account if it doesn't exist
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

          <View style={styles.passwordContainer}>
            <TextInput
              secureTextEntry={!showPassword}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              style={[
                styles.input,
                styles.passwordInput,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.backgroundSecondary,
                },
              ]}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
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

          <Pressable
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoading}
            style={[
              styles.googleButton,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color={theme.text} />
            ) : (
              <>
                <AntDesign name="google" size={20} color="#DB4437" style={styles.googleIcon} />
                <Text
                  allowFontScaling={false}
                  maxFontSizeMultiplier={1}
                  numberOfLines={1}
                  style={[styles.googleButtonText, { color: theme.text }]}
                >
                  Google
                </Text>
              </>
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
  passwordContainer: {
    position: "relative",
    marginBottom: Spacing.md,
  },
  passwordInput: {
    paddingRight: Spacing.inputHeight,
  },
  passwordToggle: {
    position: "absolute",
    right: Spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: Spacing.inputHeight,
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: Spacing.sm,
  },
  googleButton: {
    height: 46,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.md,
    overflow: "visible",
    position: "relative",
  },
  googleIcon: {
    position: "absolute",
    left: Spacing.md,
  },
  googleButtonText: {
    width: "100%",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 18,
    includeFontPadding: Platform.OS === "android" ? false : true,
    fontFamily: Platform.OS === "android" ? "sans-serif-medium" : undefined,
    letterSpacing: 0.1,
    textAlignVertical: "center",
  },
});

