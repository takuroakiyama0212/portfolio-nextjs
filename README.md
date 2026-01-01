# Charge Spotter (QLD)

A Queensland-focused charging spot finder. It prioritizes OSM (OpenStreetMap) data, then fills gaps with mock data so that libraries and airports always appear. When outlet availability is unknown, the app shows a probability estimate and lets users vote "outlets available" or "no outlets."

## Key Features
- Map and list of QLD cafes/libraries/airports/malls (OSM fetch + mock fallback)
- Outlet unknown? show probability based on OSM tags and community votes
- Detail screen provides "Outlets available" / "No outlets" voting; consensus hardens with more votes
- Library and airport entries always appear via fallback data

## Quickstart
1) Install dependencies  
   `npm install`

2) Set environment variable (local example)  
   `export EXPO_PUBLIC_DOMAIN=localhost:5000`

3) Run Expo & Express together  
   `npm run all:dev`

4) Open the web preview (port 5000 range) or Expo Go on device

## Implementation Notes
- OSM fetch: `client/lib/osm.ts` (Overpass API, QLD bounding box)
- Data source: `client/hooks/useSpots.ts` (OSM results with library/airport fallback)
- QLD mock data: `client/data/mockData.ts` (includes probabilities and initial votes)
- UI: `MapScreen`, `ListScreen`, `LocationDetailsScreen` display probability and voting

## Next Ideas
- Persist votes to the backend so all users share results
- Cache OSM responses and improve offline/poor-network recovery
- Refine outlet type/count inference from OSM tags

