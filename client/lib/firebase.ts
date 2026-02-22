import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration
// Configuration from Firebase Console
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAFEAGVimsUll27lRluJ-il_D76Ui8SV-s",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "charger-6d05b.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "charger-6d05b",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "charger-6d05b.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "682860911283",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:682860911283:web:8982dd502748df31cc6ec6",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-WWH3NGK8BK",
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

if (__DEV__) {
  // Quick sanity check in Metro logs to confirm which Firebase project this build is using.
  // (apiKey is not a secret for Firebase web configs, but we avoid printing it anyway.)
  console.log("[Firebase] Initialized", {
    projectId: (app.options as any)?.projectId,
    authDomain: (app.options as any)?.authDomain,
  });
}

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;

