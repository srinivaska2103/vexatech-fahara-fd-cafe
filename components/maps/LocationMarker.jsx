import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { MapPin } from 'lucide-react';

// Create a custom icon using a Lucide React icon rendered to HTML
const createCustomIcon = (color = '#6F4E37') => {
  const iconHtml = renderToString(
    <div style={{ color: color, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }}>
      <MapPin size={40} fill="white" strokeWidth={1.5} />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon bg-transparent border-0',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

export const LocationMarker = ({ position, address, draggable, onDragEnd }) => {
  const icon = createCustomIcon();

  return (
    <Marker
      position={position}
      icon={icon}
      draggable={draggable}
      eventHandlers={
        onDragEnd
          ? {
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                onDragEnd({ lat: position.lat, lng: position.lng });
              },
            }
          : undefined
      }
    >
      {address && (
        <Popup className="rounded-xl shadow-sm">
          <div className="text-sm font-medium text-text px-1 py-0.5">{address}</div>
        </Popup>
      )}
    </Marker>
  );
};
