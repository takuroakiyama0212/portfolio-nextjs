export type AustralianState =
  | "NSW"
  | "VIC"
  | "QLD"
  | "WA"
  | "SA"
  | "TAS"
  | "ACT"
  | "NT"
  | "ALL";

export interface StateBounds {
  south: number;
  west: number;
  north: number;
  east: number;
  centerLat: number;
  centerLon: number;
  name: string;
  abbreviation: AustralianState;
}

export const AUSTRALIAN_STATES: Record<AustralianState, StateBounds> = {
  NSW: {
    south: -37.5,
    west: 141.0,
    north: -28.0,
    east: 153.6,
    centerLat: -32.0,
    centerLon: 147.0,
    name: "New South Wales",
    abbreviation: "NSW",
  },
  VIC: {
    south: -39.2,
    west: 140.9,
    north: -33.9,
    east: 149.9,
    centerLat: -36.5,
    centerLon: 144.0,
    name: "Victoria",
    abbreviation: "VIC",
  },
  QLD: {
    south: -29.5,
    west: 137.99,
    north: -9.0,
    east: 153.9,
    centerLat: -20.0,
    centerLon: 145.0,
    name: "Queensland",
    abbreviation: "QLD",
  },
  WA: {
    south: -35.1,
    west: 112.9,
    north: -13.7,
    east: 129.0,
    centerLat: -25.0,
    centerLon: 121.0,
    name: "Western Australia",
    abbreviation: "WA",
  },
  SA: {
    south: -38.1,
    west: 129.0,
    north: -26.0,
    east: 141.0,
    centerLat: -30.0,
    centerLon: 135.0,
    name: "South Australia",
    abbreviation: "SA",
  },
  TAS: {
    south: -43.6,
    west: 144.6,
    north: -40.7,
    east: 148.3,
    centerLat: -42.0,
    centerLon: 146.5,
    name: "Tasmania",
    abbreviation: "TAS",
  },
  ACT: {
    south: -35.9,
    west: 148.8,
    north: -35.1,
    east: 149.4,
    centerLat: -35.5,
    centerLon: 149.1,
    name: "Australian Capital Territory",
    abbreviation: "ACT",
  },
  NT: {
    south: -26.0,
    west: 129.0,
    north: -10.9,
    east: 141.0,
    centerLat: -18.0,
    centerLon: 135.0,
    name: "Northern Territory",
    abbreviation: "NT",
  },
  ALL: {
    south: -43.6,
    west: 112.9,
    north: -9.0,
    east: 153.9,
    centerLat: -25.0,
    centerLon: 133.0,
    name: "All Australia",
    abbreviation: "ALL",
  },
};

export const STATE_OPTIONS: { value: AustralianState; label: string }[] = [
  { value: "ALL", label: "All Australia" },
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "ACT" },
  { value: "NT", label: "Northern Territory" },
];

