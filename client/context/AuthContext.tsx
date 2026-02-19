import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  userEmail: string | null;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "auth-session";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as { email?: string };
        if (parsed.email) {
          setUserEmail(parsed.email);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("Failed to restore auth session:", error);
      } finally {
        setIsReady(true);
      }
    };

    void bootstrap();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail);
    if (!isEmailValid) {
      return { ok: false, error: "Please enter a valid email address (e.g. name@example.com)." };
    }

    const trimmedPassword = password.trim();
    const hasLetter = /[A-Za-z]/.test(trimmedPassword);
    const hasNumber = /\d/.test(trimmedPassword);
    const isAlphaNumericOnly = /^[A-Za-z0-9]+$/.test(trimmedPassword);

    if (trimmedPassword.length < 8 || !hasLetter || !hasNumber || !isAlphaNumericOnly) {
      return {
        ok: false,
        error:
          "Password must be at least 8 characters and include both letters (A-Z) and numbers (0-9).",
      };
    }

    try {
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          email: normalizedEmail,
        })
      );
      setUserEmail(normalizedEmail);
      setIsAuthenticated(true);
      return { ok: true };
    } catch (error) {
      console.log("Failed to persist auth session:", error);
      return { ok: false, error: "Could not sign in. Please try again." };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.log("Failed to clear auth session:", error);
    } finally {
      setIsAuthenticated(false);
      setUserEmail(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      isAuthenticated,
      userEmail,
      signIn,
      signOut,
    }),
    [isReady, isAuthenticated, signIn, signOut, userEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

