import { useQuery } from "@tanstack/react-query";

import { ChargingSpot, MOCK_SPOTS } from "@/data/mockData";
import { fetchOsmSpots } from "@/lib/osm";

function spotKey(spot: ChargingSpot): string {
  const name = spot.name.trim().toLowerCase();
  const lat = Math.round(spot.latitude * 1000) / 1000;
  const lon = Math.round(spot.longitude * 1000) / 1000;
  return `${name}::${lat}::${lon}`;
}

function mergeAndDedupe(primary: ChargingSpot[], secondary: ChargingSpot[]): ChargingSpot[] {
  const seen = new Set<string>();
  const out: ChargingSpot[] = [];
  const push = (s: ChargingSpot) => {
    const key = spotKey(s);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(s);
  };

  primary.forEach(push);
  secondary.forEach(push);
  return out;
}

function ensureLibraryAndAirport(spots: ChargingSpot[]): ChargingSpot[] {
  const hasLibrary = spots.some((spot) => spot.venueType === "library");
  const hasAirport = spots.some((spot) => spot.venueType === "airport");

  const additions: ChargingSpot[] = [];
  if (!hasLibrary) {
    const fallbackLibrary = MOCK_SPOTS.find((spot) => spot.venueType === "library");
    if (fallbackLibrary) additions.push(fallbackLibrary);
  }
  if (!hasAirport) {
    const fallbackAirport = MOCK_SPOTS.find((spot) => spot.venueType === "airport");
    if (fallbackAirport) additions.push(fallbackAirport);
  }

  return [...spots, ...additions];
}

/**
 * Fetch spots from OSM with a mock fallback to ensure QLD coverage.
 */
export function useSpots() {
  return useQuery<ChargingSpot[]>({
    queryKey: ["spots", "qld"],
    queryFn: async () => {
      try {
        const osmSpots = await fetchOsmSpots();
        // Always include curated QLD spots (Brisbane / Sunshine Coast / Gold Coast) even when OSM succeeds.
        const combined = mergeAndDedupe(osmSpots, MOCK_SPOTS);
        if (!combined.length) return ensureLibraryAndAirport(MOCK_SPOTS);
        return ensureLibraryAndAirport(combined);
      } catch (error) {
        console.log("Falling back to mock spots after OSM error", error);
        return ensureLibraryAndAirport(MOCK_SPOTS);
      }
    },
    staleTime: 1000 * 60 * 30,
  });
}

