import { useQuery } from "@tanstack/react-query";

import { ChargingSpot, MOCK_SPOTS } from "@/data/mockData";
import { fetchOsmSpots } from "@/lib/osm";
import { AustralianState } from "@/data/australianStates";
import { QLD_LIBRARIES } from "@/data/qldLibraries";
import { NT_LIBRARIES } from "@/data/ntLibraries";
import { TAS_LIBRARIES } from "@/data/tasLibraries";
import { SA_LIBRARIES } from "@/data/saLibraries";

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

function ensureLibraryAndAirport(spots: ChargingSpot[], fallbackPool: ChargingSpot[]): ChargingSpot[] {
  const hasLibrary = spots.some((spot) => spot.venueType === "library");
  const hasAirport = spots.some((spot) => spot.venueType === "airport");

  const additions: ChargingSpot[] = [];
  if (!hasLibrary) {
    const fallbackLibrary = fallbackPool.find((spot) => spot.venueType === "library");
    if (fallbackLibrary) additions.push(fallbackLibrary);
  }
  if (!hasAirport) {
    const fallbackAirport = fallbackPool.find((spot) => spot.venueType === "airport");
    if (fallbackAirport) additions.push(fallbackAirport);
  }

  return [...spots, ...additions];
}

function getMockSpotsForState(state: AustralianState): ChargingSpot[] {
  if (state === "ALL") return MOCK_SPOTS;
  const stateSuffix = ` ${state}`;
  let mockSpots = MOCK_SPOTS.filter((spot) => spot.address.toUpperCase().includes(stateSuffix));
  
  // Remove libraries from MOCK_SPOTS if we have state-specific library data
  // This prevents duplicates when state-specific libraries are added
  if (state === "QLD") {
    mockSpots = mockSpots.filter((spot) => !(spot.venueType === "library"));
    return [...mockSpots, ...QLD_LIBRARIES];
  }
  if (state === "NT") {
    mockSpots = mockSpots.filter((spot) => !(spot.venueType === "library"));
    return [...mockSpots, ...NT_LIBRARIES];
  }
  if (state === "TAS") {
    mockSpots = mockSpots.filter((spot) => !(spot.venueType === "library"));
    return [...mockSpots, ...TAS_LIBRARIES];
  }
  if (state === "SA") {
    mockSpots = mockSpots.filter((spot) => !(spot.venueType === "library"));
    return [...mockSpots, ...SA_LIBRARIES];
  }
  
  return mockSpots;
}

/**
 * Fetch spots from OSM with a mock fallback. Supports all Australian states.
 */
export function useSpots(state: AustralianState = "QLD") {
  return useQuery<ChargingSpot[]>({
    queryKey: ["spots", state],
    queryFn: async () => {
      const mockSpotsToInclude = getMockSpotsForState(state);
      try {
        const osmSpots = await fetchOsmSpots(state);
        const combined = mergeAndDedupe(osmSpots, mockSpotsToInclude);
        if (!combined.length) {
          return ensureLibraryAndAirport(mockSpotsToInclude, mockSpotsToInclude);
        }
        return ensureLibraryAndAirport(combined, mockSpotsToInclude);
      } catch (error) {
        console.log("Falling back to mock spots after OSM error", error);
        return ensureLibraryAndAirport(mockSpotsToInclude, mockSpotsToInclude);
      }
    },
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

