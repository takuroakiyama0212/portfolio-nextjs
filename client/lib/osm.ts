import { ChargingSpot, OutletType, VenueType } from "@/data/mockData";
import { AustralianState, AUSTRALIAN_STATES } from "@/data/australianStates";

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

const POWER_KEYS = ["socket:charging", "socket:domestic", "socket:usb", "power_supply", "charging_station"];

function toVenueType(tags: Record<string, string>): VenueType {
  if (tags["amenity"] === "library") return "library";
  if (tags["amenity"] === "cafe" || tags["amenity"] === "fast_food") return "cafe";
  if (tags["amenity"] === "coworking_space") return "coworking";
  if (tags["office"] === "coworking" || tags["office"] === "coworking_space") return "coworking";
  if (tags["aeroway"] === "aerodrome" || tags["aeroway"] === "terminal") return "airport";
  return "cafe";
}

function toOutletTypes(tags: Record<string, string>): OutletType[] {
  const types = new Set<OutletType>();
  if (tags["socket:usb"]) types.add("usb-a");
  if (tags["socket:domestic"] || tags["power_supply"]) types.add("standard");
  if (tags["socket:charging"]) types.add("usb-c");
  if (types.size === 0) {
    types.add("standard");
  }
  return Array.from(types);
}

function parseOutletCount(tags: Record<string, string>): number {
  const numeric = POWER_KEYS.map((key) => tags[key]).find((value) => value && !Number.isNaN(Number(value)));
  return numeric ? Number(numeric) : 0;
}

function derivePowerConfidence(tags: Record<string, string>): { hasOutlets: boolean | null; powerConfidence: number } {
  const hasPowerTag = POWER_KEYS.some((key) => Boolean(tags[key]));
  if (hasPowerTag) {
    return { hasOutlets: true, powerConfidence: 0.9 };
  }
  return { hasOutlets: null, powerConfidence: 0.4 };
}

function formatAddress(tags: Record<string, string>, state?: AustralianState): string {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"] || tags["addr:town"],
    tags["addr:state"] || state || "Australia",
  ].filter(Boolean);
  return parts.join(", ") || (state ? `${AUSTRALIAN_STATES[state].name}, Australia` : "Australia");
}

function mapElementToSpot(element: OverpassElement, state?: AustralianState): ChargingSpot | null {
  if (!element.tags) return null;

  const { tags } = element;
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  if (latitude === undefined || longitude === undefined) return null;

  const venueType = toVenueType(tags);
  const { hasOutlets, powerConfidence } = derivePowerConfidence(tags);

  const outletCount = parseOutletCount(tags);
  const outletTypes = toOutletTypes(tags);

  return {
    id: `osm-${element.id}`,
    name: tags["name"] || "Unnamed location",
    address: formatAddress(tags, state),
    venueType,
    latitude,
    longitude,
    outletCount,
    outletTypes,
    hasOutlets,
    powerConfidence,
    communityYesVotes: hasOutlets ? 1 : 0,
    communityNoVotes: 0,
    source: "osm",
    hours: tags["opening_hours"],
    phone: tags["phone"] || tags["contact:phone"],
  };
}

/**
 * Fetch charging-friendly venues from OpenStreetMap Overpass for the specified Australian state.
 */
export async function fetchOsmSpots(state: AustralianState = "QLD"): Promise<ChargingSpot[]> {
  const bounds = AUSTRALIAN_STATES[state];
  
  // For "ALL", we need to query multiple states or use the entire Australia bounds
  // For simplicity, we'll use the ALL bounds which covers all of Australia
  const overpassQuery = `
    [out:json][timeout:100];
    (
      node["amenity"~"cafe|library"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["amenity"~"cafe|library"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["amenity"="coworking_space"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["amenity"="coworking_space"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["office"~"coworking|coworking_space"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["office"~"coworking|coworking_space"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["aeroway"="aerodrome"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["aeroway"="aerodrome"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["amenity"="restaurant"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["amenity"="restaurant"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["amenity"="hotel"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["amenity"="hotel"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      node["shop"="mall"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["shop"="mall"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
    );
    out center 60;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: overpassQuery,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Unable to fetch OSM spots");
  }

  const data = (await res.json()) as { elements?: OverpassElement[] };
  const spots = (data.elements || [])
    .map((element) => mapElementToSpot(element, state))
    .filter((spot): spot is ChargingSpot => Boolean(spot));

  return spots;
}

