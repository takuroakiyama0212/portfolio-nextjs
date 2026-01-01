import { ChargingSpot, OutletType, VenueType } from "@/data/mockData";

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

const QLD_BOUNDS = {
  south: -29.5,
  west: 137.99,
  north: -9.0,
  east: 153.9,
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

function formatAddress(tags: Record<string, string>): string {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"] || tags["addr:town"],
    tags["addr:state"] || "QLD",
  ].filter(Boolean);
  return parts.join(", ") || "Queensland, Australia";
}

function mapElementToSpot(element: OverpassElement): ChargingSpot | null {
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
    address: formatAddress(tags),
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
 * Fetch charging-friendly venues from OpenStreetMap Overpass for Queensland, AU.
 */
export async function fetchOsmSpots(): Promise<ChargingSpot[]> {
  const overpassQuery = `
    [out:json][timeout:50];
    (
      node["amenity"~"cafe|library"](${QLD_BOUNDS.south},${QLD_BOUNDS.west},${QLD_BOUNDS.north},${QLD_BOUNDS.east});
      way["amenity"~"cafe|library"](${QLD_BOUNDS.south},${QLD_BOUNDS.west},${QLD_BOUNDS.north},${QLD_BOUNDS.east});
      node["amenity"="coworking_space"](${QLD_BOUNDS.south},${QLD_BOUNDS.west},${QLD_BOUNDS.north},${QLD_BOUNDS.east});
      way["amenity"="coworking_space"](${QLD_BOUNDS.south},${QLD_BOUNDS.west},${QLD_BOUNDS.north},${QLD_BOUNDS.east});
      node["office"~"coworking|coworking_space"](${QLD_BOUNDS.south},${QLD_BOUNDS.west},${QLD_BOUNDS.north},${QLD_BOUNDS.east});
      way["office"~"coworking|coworking_space"](${QLD_BOUNDS.south},${QLD_BOUNDS.west},${QLD_BOUNDS.north},${QLD_BOUNDS.east});
      node["aeroway"="aerodrome"](${QLD_BOUNDS.south},${QLD_BOUNDS.west},${QLD_BOUNDS.north},${QLD_BOUNDS.east});
      way["aeroway"="aerodrome"](${QLD_BOUNDS.south},${QLD_BOUNDS.west},${QLD_BOUNDS.north},${QLD_BOUNDS.east});
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
    .map(mapElementToSpot)
    .filter((spot): spot is ChargingSpot => Boolean(spot));

  return spots;
}

