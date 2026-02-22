import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithCredential,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { auth } from "@/lib/firebase";

// Complete auth session for WebBrowser
WebBrowser.maybeCompleteAuthSession();

type FirebaseAuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  user: User | null;
  userEmail: string | null;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | null>(null);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthenticated(!!firebaseUser);
      setIsReady(true);
    });

    return unsubscribe;
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
        error: "Password must be at least 8 characters and include both letters (A-Z) and numbers (0-9).",
      };
    }

    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, trimmedPassword);
      return { ok: true };
    } catch (error: any) {
      const errorMessage =
        error.code === "auth/user-not-found"
          ? "No account found with this email."
          : error.code === "auth/wrong-password"
            ? "Incorrect password."
            : error.code === "auth/invalid-email"
              ? "Invalid email address."
              : error.message || "Could not sign in. Please try again.";
      return { ok: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
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
        error: "Password must be at least 8 characters and include both letters (A-Z) and numbers (0-9).",
      };
    }

    try {
      await createUserWithEmailAndPassword(auth, normalizedEmail, trimmedPassword);
      return { ok: true };
    } catch (error: any) {
      const errorMessage =
        error.code === "auth/email-already-in-use"
          ? "An account with this email already exists."
          : error.code === "auth/weak-password"
            ? "Password is too weak."
            : error.message || "Could not create account. Please try again.";
      return { ok: false, error: errorMessage };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      // Get Google OAuth client ID from Firebase project
      // This should be set in Firebase Console > Authentication > Sign-in method > Google > Web client ID
      const webClientId =
        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
        "682860911283-xxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"; // Placeholder - needs to be set

      const redirectUri = AuthSession.makeRedirectUri();
      const responseType = AuthSession.ResponseType.IdToken;

      const request = new AuthSession.AuthRequest({
        clientId: webClientId,
        scopes: ["openid", "profile", "email"],
        responseType,
        redirectUri,
        extraParams: {},
      });

      const result = await request.promptAsync({
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      });

      if (result.type === "success") {
        const { id_token } = result.params;
        if (!id_token) {
          return { ok: false, error: "No ID token received from Google." };
        }

        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        return { ok: true };
      } else if (result.type === "cancel") {
        return { ok: false, error: "Google sign-in was cancelled." };
      } else {
        return { ok: false, error: "Google sign-in failed. Please try again." };
      }
    } catch (error: any) {
      console.log("Google sign-in error:", error);
      return {
        ok: false,
        error: error.message || "Could not sign in with Google. Please try again.",
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.log("Failed to sign out:", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      isAuthenticated,
      user,
      userEmail: user?.email ?? null,
      signIn,
      register,
      signInWithGoogle,
      signOut,
    }),
    [isReady, isAuthenticated, user, signIn, register, signInWithGoogle, signOut]
  );

  return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>;
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider");
  }
  return context;
}

