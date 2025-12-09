export type VenueType = "cafe" | "library" | "airport" | "mall" | "restaurant" | "hotel" | "coworking";

export type OutletType = "usb-a" | "usb-c" | "standard";

export interface ChargingSpot {
  id: string;
  name: string;
  address: string;
  venueType: VenueType;
  latitude: number;
  longitude: number;
  outletCount: number;
  outletTypes: OutletType[];
  phone?: string;
  hours?: string;
  tips?: string[];
  distance?: number;
}

export const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  cafe: "Cafe",
  library: "Library",
  airport: "Airport",
  mall: "Mall",
  restaurant: "Restaurant",
  hotel: "Hotel",
  coworking: "Coworking",
};

export const OUTLET_TYPE_LABELS: Record<OutletType, string> = {
  "usb-a": "USB-A",
  "usb-c": "USB-C",
  standard: "Standard",
};

export const MOCK_SPOTS: ChargingSpot[] = [
  {
    id: "1",
    name: "Central Perk Coffee",
    address: "123 Main Street, Downtown",
    venueType: "cafe",
    latitude: 37.7749,
    longitude: -122.4194,
    outletCount: 8,
    outletTypes: ["usb-a", "usb-c", "standard"],
    phone: "(555) 123-4567",
    hours: "7:00 AM - 9:00 PM",
    tips: ["Best outlets near the window seats", "Free WiFi with purchase"],
  },
  {
    id: "2",
    name: "Downtown Public Library",
    address: "456 Library Ave, City Center",
    venueType: "library",
    latitude: 37.7751,
    longitude: -122.4180,
    outletCount: 20,
    outletTypes: ["standard", "usb-a"],
    hours: "9:00 AM - 8:00 PM",
    tips: ["Quiet study area has the most outlets"],
  },
  {
    id: "3",
    name: "Tech Hub Coworking",
    address: "789 Innovation Blvd, Tech District",
    venueType: "coworking",
    latitude: 37.7745,
    longitude: -122.4200,
    outletCount: 50,
    outletTypes: ["usb-a", "usb-c", "standard"],
    phone: "(555) 987-6543",
    hours: "24/7",
    tips: ["Day passes available", "USB-C chargers at every desk"],
  },
  {
    id: "4",
    name: "Grand Mall Food Court",
    address: "321 Shopping Way, Eastside",
    venueType: "mall",
    latitude: 37.7760,
    longitude: -122.4150,
    outletCount: 12,
    outletTypes: ["usb-a", "standard"],
    hours: "10:00 AM - 9:00 PM",
    tips: ["Charging stations near the fountain"],
  },
  {
    id: "5",
    name: "The Roasted Bean",
    address: "567 Coffee Lane, Arts District",
    venueType: "cafe",
    latitude: 37.7735,
    longitude: -122.4210,
    outletCount: 6,
    outletTypes: ["standard"],
    phone: "(555) 456-7890",
    hours: "6:30 AM - 7:00 PM",
    tips: ["Back corner table has multiple outlets"],
  },
  {
    id: "6",
    name: "City International Airport",
    address: "1 Airport Road, Terminal 2",
    venueType: "airport",
    latitude: 37.7800,
    longitude: -122.4100,
    outletCount: 100,
    outletTypes: ["usb-a", "usb-c", "standard"],
    hours: "24/7",
    tips: ["Free charging stations near gates A1-A10"],
  },
  {
    id: "7",
    name: "Seaside Bistro",
    address: "890 Ocean View Dr, Waterfront",
    venueType: "restaurant",
    latitude: 37.7720,
    longitude: -122.4230,
    outletCount: 4,
    outletTypes: ["standard"],
    phone: "(555) 234-5678",
    hours: "11:00 AM - 10:00 PM",
    tips: ["Ask for booth seating for outlet access"],
  },
  {
    id: "8",
    name: "Grand Hotel Lobby",
    address: "100 Luxury Lane, Financial District",
    venueType: "hotel",
    latitude: 37.7770,
    longitude: -122.4160,
    outletCount: 15,
    outletTypes: ["usb-c", "standard"],
    phone: "(555) 345-6789",
    hours: "24/7",
    tips: ["Lobby lounge open to public", "Complimentary WiFi"],
  },
];

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
