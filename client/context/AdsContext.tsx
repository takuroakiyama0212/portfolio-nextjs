import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type InterstitialPayload = {
  title: string;
  message: string;
};

type AdsContextValue = {
  isSubscribed: boolean;
  setSubscribed: (value: boolean) => void;
  showAds: boolean;
  maybeShowInterstitialAfterSearch: () => void;
  interstitial: InterstitialPayload | null;
  dismissInterstitial: () => void;
};

const AdsContext = createContext<AdsContextValue | null>(null);

const INTERSTITIAL_CHANCE = 0.3;
const INTERSTITIAL_COOLDOWN_MS = 90_000;
const MIN_SEARCHES_BEFORE_INTERSTITIAL = 2;

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [interstitial, setInterstitial] = useState<InterstitialPayload | null>(null);
  const [searchCount, setSearchCount] = useState(0);
  const [lastInterstitialAt, setLastInterstitialAt] = useState(0);

  const dismissInterstitial = useCallback(() => {
    setInterstitial(null);
  }, []);

  const maybeShowInterstitialAfterSearch = useCallback(() => {
    if (isSubscribed) return;

    const nextSearchCount = searchCount + 1;
    setSearchCount(nextSearchCount);

    if (nextSearchCount < MIN_SEARCHES_BEFORE_INTERSTITIAL) {
      return;
    }

    const now = Date.now();
    const isCoolingDown = now - lastInterstitialAt < INTERSTITIAL_COOLDOWN_MS;
    if (isCoolingDown) {
      return;
    }

    if (Math.random() > INTERSTITIAL_CHANCE) {
      return;
    }

    setLastInterstitialAt(now);
    setInterstitial({
      title: "Sponsored",
      message: "Unlock an ad-free experience with Charge Spotter Plus.",
    });
  }, [isSubscribed, lastInterstitialAt, searchCount]);

  const value = useMemo<AdsContextValue>(
    () => ({
      isSubscribed,
      setSubscribed: setIsSubscribed,
      showAds: !isSubscribed,
      maybeShowInterstitialAfterSearch,
      interstitial,
      dismissInterstitial,
    }),
    [dismissInterstitial, interstitial, isSubscribed, maybeShowInterstitialAfterSearch]
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

