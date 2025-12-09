# ChargeSpot - Phone Charging Location Finder

## Overview
ChargeSpot is a mobile app that helps users discover and locate phone charging spots in cafes, libraries, airports, malls, and other public places. Built with Expo React Native, it features an interactive map, location-based search, and user-contributed spot information.

## Project Architecture

### Frontend (Expo React Native)
- **Navigation**: React Navigation 7 with bottom tabs and stack navigators
- **Map**: react-native-maps for interactive map display
- **Location**: expo-location for GPS and location services
- **State**: In-memory mock data for prototype

### Screens
1. **Map Screen** - Interactive map with charging spot markers, search, and filters
2. **List Screen** - Scrollable list of nearby spots with sorting options
3. **Location Details Screen** - Full venue information with directions
4. **Add Spot Screen** - Form to contribute new charging locations
5. **Settings Screen** - User preferences and app settings

### Key Files
- `client/screens/` - All app screens
- `client/navigation/` - Navigation configuration
- `client/data/mockData.ts` - Mock charging spot data
- `client/constants/theme.ts` - Design system tokens
- `design_guidelines.md` - UI/UX specifications

## Tech Stack
- Expo SDK 54
- React Navigation 7
- react-native-maps
- expo-location
- TypeScript

## Running the App
The app runs via `npm run all:dev` which starts both Expo and Express servers.
- Web preview on port 5000
- Expo Go compatible for iOS/Android testing

## Design System
- Primary color: Green (#4CAF50) - represents charging/power
- Accent: Amber (#FFC107)
- Clean, modern mobile-first design
- Feather icons from @expo/vector-icons

## Recent Changes
- December 2024: Initial prototype with map, list, add spot, and settings screens
