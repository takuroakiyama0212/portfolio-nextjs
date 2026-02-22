import React, { useMemo } from "react";

import {
  FirebaseAuthProvider,
  useFirebaseAuth,
} from "@/context/FirebaseAuthContext";

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  userEmail: string | null;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

/**
 * Backwards-compatible auth adapter.
 * The app historically imported `useAuth()` from this file, so we keep the same API
 * but delegate to Firebase Authentication under the hood.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}

export function useAuth(): AuthContextValue {
  const { isReady, isAuthenticated, userEmail, signIn, register, signInWithGoogle, signOut } =
    useFirebaseAuth();

  return useMemo(
    () => ({
      isReady,
      isAuthenticated,
      userEmail,
      signIn,
      register,
      signInWithGoogle,
      signOut,
    }),
    [isReady, isAuthenticated, userEmail, signIn, register, signInWithGoogle, signOut]
  );
}


