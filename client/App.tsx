import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

import RootStackNavigator from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InterstitialAdModal } from "@/components/ads/AdWidgets";
import { Colors } from "@/constants/theme";
import { AdsProvider, useAds } from "@/context/AdsContext";
import { AuthProvider } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";

function AdsOverlay() {
  const { interstitial, dismissInterstitial } = useAds();

  return (
    <InterstitialAdModal
      visible={Boolean(interstitial)}
      title={interstitial?.title ?? ""}
      message={interstitial?.message ?? ""}
      onClose={dismissInterstitial}
    />
  );
}

export default function App() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";

  React.useEffect(() => {
    // Keep the app/root background synced to theme to avoid white system gaps.
    SystemUI.setBackgroundColorAsync(theme.backgroundRoot).catch(() => {});
  }, [theme.backgroundRoot]);

  const navigationTheme = React.useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: theme.backgroundRoot,
        card: theme.backgroundRoot,
      },
    };
  }, [isDark, theme.backgroundRoot]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.backgroundRoot }]}>
            <KeyboardProvider>
              <AuthProvider>
                <AdsProvider>
                  <NavigationContainer theme={navigationTheme}>
                    <RootStackNavigator />
                  </NavigationContainer>
                  <AdsOverlay />
                </AdsProvider>
              </AuthProvider>
              <StatusBar
                style={isDark ? "light" : "dark"}
                translucent={false}
                backgroundColor={theme.backgroundRoot}
              />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
