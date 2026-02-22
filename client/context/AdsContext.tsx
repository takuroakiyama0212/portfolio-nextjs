import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type InterstitialAd = {
  title: string;
  message: string;
} | null;

type AdsContextValue = {
  isSubscribed: boolean;
  setSubscribed: (value: boolean) => void;
  showAds: boolean;
  interstitial: InterstitialAd;
  dismissInterstitial: () => void;
  maybeShowInterstitialAfterSearch: () => void;
};

const SUBSCRIPTION_STORAGE_KEY = "ads-subscription-status";
const INTERSTITIAL_COUNT_KEY = "ads-interstitial-count";
const INTERSTITIAL_LAST_SHOWN_KEY = "ads-interstitial-last-shown";

const INTERSTITIAL_FREQUENCY = 3; // Show every 3 searches
const INTERSTITIAL_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

const AdsContext = createContext<AdsContextValue | null>(null);

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [interstitial, setInterstitial] = useState<InterstitialAd>(null);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const stored = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
        if (stored !== null) {
          setIsSubscribed(JSON.parse(stored));
        }
      } catch (error) {
        console.log("Failed to load subscription status:", error);
      }
    };
    void loadSubscription();
  }, []);

  const setSubscribed = useCallback(async (value: boolean) => {
    setIsSubscribed(value);
    try {
      await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.log("Failed to save subscription status:", error);
    }
  }, []);

  const dismissInterstitial = useCallback(() => {
    setInterstitial(null);
  }, []);

  const maybeShowInterstitialAfterSearch = useCallback(async () => {
    if (isSubscribed) return;

    try {
      const [countStr, lastShownStr] = await Promise.all([
        AsyncStorage.getItem(INTERSTITIAL_COUNT_KEY),
        AsyncStorage.getItem(INTERSTITIAL_LAST_SHOWN_KEY),
      ]);

      const count = countStr ? parseInt(countStr, 10) : 0;
      const lastShown = lastShownStr ? parseInt(lastShownStr, 10) : 0;
      const now = Date.now();

      // Check cooldown
      if (now - lastShown < INTERSTITIAL_COOLDOWN_MS) {
        return;
      }

      const newCount = count + 1;
      await AsyncStorage.setItem(INTERSTITIAL_COUNT_KEY, String(newCount));

      if (newCount >= INTERSTITIAL_FREQUENCY) {
        setInterstitial({
          title: "Discover More Charging Spots",
          message: "Find the best EV charging locations near you. Explore our premium features!",
        });
        await AsyncStorage.setItem(INTERSTITIAL_LAST_SHOWN_KEY, String(now));
        await AsyncStorage.setItem(INTERSTITIAL_COUNT_KEY, "0");
      }
    } catch (error) {
      console.log("Failed to check interstitial ad:", error);
    }
  }, [isSubscribed]);

  const showAds = !isSubscribed;

  const value = useMemo(
    () => ({
      isSubscribed,
      setSubscribed,
      showAds,
      interstitial,
      dismissInterstitial,
      maybeShowInterstitialAfterSearch,
    }),
    [isSubscribed, setSubscribed, showAds, interstitial, dismissInterstitial, maybeShowInterstitialAfterSearch]
  );

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export function useAds() {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error("useAds must be used within AdsProvider");
  }
  return context;
}



