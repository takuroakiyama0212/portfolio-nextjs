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

## Deploy to Vercel

1. **Build the web version:**
   ```bash
   npm run build:web
   ```

2. **Deploy to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Or connect your GitHub repository to Vercel dashboard

3. **After deployment:**
   - The landing page will be available at your Vercel URL (e.g., `https://your-app.vercel.app/`)
   - The web app will be available at `/web` (e.g., `https://your-app.vercel.app/web`)
   - QR code on the landing page will automatically point to your Vercel URL

**Note:** Vercel will automatically run `npm run build:web` during deployment. The `vercel.json` configuration handles routing for the web app and static assets.

## What you get
- Map + list of charging-friendly venues in QLD (cafes, libraries, airports, malls, coworking)
- Community voting and confidence display for outlet availability
- Web map uses Leaflet/OpenStreetMap tiles; native uses `react-native-maps`


