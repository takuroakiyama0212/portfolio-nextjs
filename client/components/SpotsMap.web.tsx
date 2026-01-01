import React, { useMemo } from "react";

// Required for correct tile positioning and controls styling on web.
import "leaflet/dist/leaflet.css";

import { ChargingSpot } from "@/data/mockData";

const LEAFLET_BASE_CSS = `
.leaflet-container { width: 100%; height: 100%; font: inherit; }
.leaflet-control-zoom a { color: #0b1220; }
.leaflet-popup-content-wrapper, .leaflet-popup-tip { background: rgba(255,255,255,0.96); }
.leaflet-popup-content { margin: 10px 12px; font: 14px/1.3 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial; color: #0b1220; }
`;

export function SpotsMap(props: {
  spots: ChargingSpot[];
  selectedSpotId?: string | null;
  onSelectSpot: (spot: ChargingSpot) => void;
}) {
  // react-leaflet / leaflet are web-only deps. This file is only built on web.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactLeaflet = require("react-leaflet") as any;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const L = require("leaflet") as any;

  const { MapContainer, TileLayer, CircleMarker, Popup, useMap } = ReactLeaflet;

  const selectedSpot = useMemo(
    () => props.spots.find((s) => s.id === props.selectedSpotId) || null,
    [props.selectedSpotId, props.spots],
  );

  function FlyToSelected({ spot }: { spot: ChargingSpot | null }) {
    const map = useMap();
    React.useEffect(() => {
      if (!spot) return;
      map.flyTo([spot.latitude, spot.longitude], Math.max(map.getZoom(), 13), {
        duration: 0.6,
      });
    }, [spot?.id]);
    return null;
  }

  function EnsureSized() {
    const map = useMap();
    React.useEffect(() => {
      const kick = () => {
        try {
          map.invalidateSize();
        } catch {
          // ignore
        }
      };
      // Leaflet needs a tick after layout to compute sizes in flex containers.
      const t1 = window.setTimeout(kick, 0);
      const t2 = window.setTimeout(kick, 250);
      window.addEventListener("resize", kick);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.removeEventListener("resize", kick);
      };
    }, []);
    return null;
  }

  // Approximate Australia bounds to prevent panning outside the country.
  const AU_BOUNDS: [[number, number], [number, number]] = [
    [-44.0, 112.0],
    [-10.0, 154.0],
  ];

  const primary = "#4CAF50";
  const accent = "#2DD4BF";

  const markerStyle = (isSelected: boolean) => ({
    color: isSelected ? accent : primary,
    weight: isSelected ? 3 : 2,
    opacity: 0.95,
    fillColor: isSelected ? accent : primary,
    fillOpacity: isSelected ? 0.55 : 0.35,
  });

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 16, overflow: "hidden" }}>
      <style>{LEAFLET_BASE_CSS}</style>
      <MapContainer
        center={[-27.4698, 153.0251]}
        zoom={6}
        minZoom={4}
        maxZoom={18}
        maxBounds={AU_BOUNDS}
        maxBoundsViscosity={0.9}
        zoomControl
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <EnsureSized />
        <FlyToSelected spot={selectedSpot} />

        {props.spots.map((spot) => {
          const isSelected = spot.id === props.selectedSpotId;
          return (
            <CircleMarker
              key={spot.id}
              center={[spot.latitude, spot.longitude]}
              radius={isSelected ? 10 : 8}
              pathOptions={markerStyle(isSelected)}
              eventHandlers={{
                click: () => props.onSelectSpot(spot),
              }}
            >
              <Popup>
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ fontWeight: 700 }}>{spot.name}</div>
                  <div style={{ color: "#334155" }}>{spot.address}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {spot.hasOutlets === true
                      ? "Outlets confirmed"
                      : spot.hasOutlets === false
                        ? "No outlets reported"
                        : `Estimated ${Math.round((spot.powerConfidence ?? 0.5) * 100)}% chance of outlets`}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}


