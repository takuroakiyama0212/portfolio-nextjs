import React from "react";

import { ChargingSpot } from "@/data/mockData";

/**
 * Native fallback. The web version is implemented in `SpotsMap.web.tsx`.
 * This component is only meant to be rendered on web.
 */
export function SpotsMap(_props: {
  spots: ChargingSpot[];
  selectedSpotId?: string | null;
  onSelectSpot: (spot: ChargingSpot) => void;
}) {
  return null;
}


