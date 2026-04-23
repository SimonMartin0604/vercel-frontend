import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression, LatLngBoundsExpression } from 'leaflet';

interface Location {
  id: string | number;
  lat: number;
  lon: number;
  name: string;
}

function FitBounds({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    const points = locations
      .filter((l) => typeof l.lat === 'number' && typeof l.lon === 'number')
      .map((l) => [l.lat, l.lon] as [number, number]);

    if (points.length > 0) {
      map.fitBounds(points, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

export default function HungaryMap({ locations, selectedId, onSelect }: any) {
  const center: LatLngExpression = [47.1625, 19.5033];
  const hungaryBounds: LatLngBoundsExpression = [
    [45.7, 16.1], // Dél-Nyugat
    [48.6, 22.9]  // Észak-Kelet
  ];
  const mapIdRef = useRef<string>(`map-${Math.random().toString(36).slice(2, 7)}`);

  return (
    <div style={{ width: '100%', height: 360, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
      <MapContainer 
        id={mapIdRef.current}
        center={center} 
        zoom={7} 
        minZoom={6}
        maxBounds={hungaryBounds}
        maxBoundsViscosity={1.0}
        style={{ width: '100%', height: '100%' }} 
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds locations={locations} />

        {locations.map((loc: Location) => (
          typeof loc.lat === 'number' && typeof loc.lon === 'number' ? (
            <CircleMarker
              key={loc.id}
              center={[loc.lat, loc.lon] as LatLngExpression}
              radius={selectedId === loc.id ? 10 : 6}
              pathOptions={{ 
                color: selectedId === loc.id ? '#4c6ef5' : '#1971c2', 
                weight: 1, 
                fillOpacity: 0.9 
              }}
              eventHandlers={{ click: () => onSelect(loc.id) }}
            >
              <Popup>{loc.name}</Popup>
            </CircleMarker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}