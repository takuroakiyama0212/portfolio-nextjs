# Firebase Setup Guide

This project now includes Firebase integration for authentication and Firestore database.

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Save the changes

### 3. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (for development) or **production mode** (with security rules)
4. Choose a location for your database

### 4. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. If you don't have a web app, click "Add app" and select the web icon (`</>`)
4. Copy the configuration values:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

### 5. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace the placeholder values with your Firebase config:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
   ```

### 6. Update App to Use Firebase Auth (Optional)

Currently, the app uses a local authentication system. To switch to Firebase Authentication:

1. In `client/App.tsx`, replace `AuthProvider` with `FirebaseAuthProvider`:
   ```tsx
   import { FirebaseAuthProvider } from "@/context/FirebaseAuthContext";
   
   // Replace <AuthProvider> with <FirebaseAuthProvider>
   ```

2. Update components that use `useAuth()` to use `useFirebaseAuth()` instead.

## Features

### Firebase Authentication
- Email/password authentication
- User registration
- Session persistence
- Automatic sign-in state management

### Firestore Integration
- Save charging spots to Firestore
- Query spots by state/location
- Real-time data synchronization (can be added)

## Security Rules (Firestore)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /spots/{spotId} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      // Allow write for authenticated users
      allow write: if request.auth != null && request.resource.data.createdBy == request.auth.token.email;
    }
  }
}
```

## Testing

1. Start the Expo dev server:
   ```bash
   npm run expo:dev:lan
   ```

2. Open the app in Expo Go

3. Try registering a new account in the "Add Spot" screen

4. Check Firebase Console > Authentication to see the new user

5. Check Firestore Database to see saved spots



