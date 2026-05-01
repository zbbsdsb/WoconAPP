import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle flying to new coordinates
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 2
    });
  }, [center, zoom, map]);
  return null;
};

// Component to handle map clicks
const MapEvents = ({ onClick }: { onClick?: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onClick?.(e.latlng);
    },
  });
  return null;
};

interface MapCanvasProps {
  center?: [number, number];
  zoom?: number;
  trips?: Array<{
    id: string | number;
    lat: number;
    lng: number;
    title: string;
    description: string;
  }>;
  onMarkerClick?: (id: string | number) => void;
  onMapClick?: (latlng: L.LatLng) => void;
  variant?: 'dark' | 'satellite' | 'street';
}

const TILE_LAYERS = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
  },
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
};

export const MapCanvas: React.FC<MapCanvasProps> = ({ 
  center = [20, 0], 
  zoom = 3,
  trips = [],
  onMarkerClick,
  onMapClick,
  variant = 'dark'
}) => {
  const layer = TILE_LAYERS[variant];

  return (
    <div className="w-full h-full relative group">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <MapController center={center as [number, number]} zoom={zoom} />
        <MapEvents onClick={onMapClick} />
        <TileLayer
          attribution={layer.attribution}
          url={layer.url}
        />
        <ZoomControl position="bottomright" />
        
        {trips.map(trip => (
          <Marker 
            key={trip.id} 
            position={[trip.lat, trip.lng]}
            eventHandlers={{
              click: () => onMarkerClick?.(trip.id)
            }}
          >
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <h3 className="font-bold border-b pb-1 mb-1">{trip.title}</h3>
                <p className="text-[10px] text-slate-600 leading-tight">{trip.description}</p>
                <button className="mt-2 w-full py-1 bg-blue-600 text-white text-[10px] rounded font-bold uppercase tracking-wider">Mission Details</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Overlay Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.6)] z-10" />
    </div>
  );
};
