# Charge Spotter (QLD)

Charge Spotter is a Queensland-focused charging spot finder. It prioritizes OSM (OpenStreetMap) data and merges it with curated QLD spots (Brisbane, Sunshine Coast, Gold Coast) so key places always appear. Unknown outlet availability is shown as a probability and can be refined by community votes.

## Run on Phone (iOS / Android) via Expo Go + QR
1) Install dependencies:
   `npm install`

2) Start the app on your local Wi-Fi (LAN) and the API server:
   `npm run all:dev:lan`

3) On your phone, install **Expo Go**, then scan the QR code shown by Expo in your terminal.

Notes:
- Phone and computer must be on the same Wi-Fi.
- The API base URL is set via `EXPO_PUBLIC_DOMAIN` (handled automatically by `all:dev:lan`).

## Run Web (browser)
`npm run all:dev:local`

## What you get
- Map + list of charging-friendly venues in QLD (cafes, libraries, airports, malls, coworking)
- Community voting and confidence display for outlet availability
- Web map uses Leaflet/OpenStreetMap tiles; native uses `react-native-maps`


