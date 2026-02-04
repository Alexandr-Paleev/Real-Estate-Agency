'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl =
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl =
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  lat?: number;
  lng?: number;
}

interface MapComponentProps {
  properties: Property[];
  lang: string;
}

export default function MapComponent({ properties, lang }: MapComponentProps) {
  // Phuket coordinates
  const position: [number, number] = [7.95, 98.33];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg mb-8 z-0 relative">
      <MapContainer
        center={position}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => {
          // Use real coordinates if available, otherwise fallback to random near Phuket center (for safety)
          // But user said "В базе уже есть реальные lat и lng", so we prioritize them.
          // Adding a small fallback just in case some data is missing to avoid crash.
          const lat = property.lat ?? 7.95 + (Math.random() - 0.5) * 0.1;
          const lng = property.lng ?? 98.33 + (Math.random() - 0.5) * 0.1;

          return (
            <Marker key={property.id} position={[lat, lng]} icon={customIcon}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-sm mb-1">{property.title}</h3>
                  <p className="text-primary font-semibold">
                    {new Intl.NumberFormat(lang === 'TH' ? 'th-TH' : 'en-US', {
                      style: 'currency',
                      currency: 'THB',
                      minimumFractionDigits: 0,
                    }).format(property.price)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
