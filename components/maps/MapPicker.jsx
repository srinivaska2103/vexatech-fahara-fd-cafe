'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import { LocationMarker } from './LocationMarker';
import { SearchLocation } from './SearchLocation';
import { UserLocationButton } from './UserLocationButton';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

const defaultCenter = [9.9252, 78.1198]; // Default Madurai, Tamil Nadu fallback only when no coordinates exist

// Helper component to center map on coordinate changes
const MapUpdater = ({ center, zoom = 16 }) => {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

// Helper component for click-to-pin functionality
const MapClickListener = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick && e.latlng) {
        onMapClick(e.latlng);
      }
    }
  });
  return null;
};

export const MapPicker = ({ 
  latitude, 
  longitude, 
  zoom = 16,
  onLocationSelect, 
  className 
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={cn("animate-pulse bg-border/40 rounded-xl", className)}></div>;
  }

  const parsedLat = parseFloat(latitude);
  const parsedLng = parseFloat(longitude);
  const hasCoordinates = Number.isFinite(parsedLat) && Number.isFinite(parsedLng) && parsedLat >= -90 && parsedLat <= 90 && parsedLng >= -180 && parsedLng <= 180;
  
  const currentCenter = hasCoordinates ? [parsedLat, parsedLng] : defaultCenter;

  const handleDragEnd = (position) => {
    if (position && position.lat && position.lng) {
      onLocationSelect({
        lat: position.lat,
        lng: position.lng
      });
    }
  };

  const handleMapClick = (latlng) => {
    if (latlng && latlng.lat && latlng.lng) {
      onLocationSelect({
        lat: latlng.lat,
        lng: latlng.lng
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 h-full", className)}>
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold text-text/60">
          📍 Drag pin or click map to adjust exact position
        </span>
        <UserLocationButton 
          onLocationFound={(location) => {
            onLocationSelect(location);
            toast.success("Location updated from device GPS!");
          }} 
          onError={(err) => toast.error(err)}
        />
      </div>

      <div className="relative flex-1 rounded-2xl overflow-hidden border border-border/50 z-0 min-h-[300px]">
        <MapContainer
          center={currentCenter}
          zoom={zoom}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <MapUpdater center={hasCoordinates ? currentCenter : null} zoom={zoom} />
          <MapClickListener onMapClick={handleMapClick} />
          
          <LocationMarker 
            position={currentCenter} 
            draggable={true} 
            onDragEnd={handleDragEnd} 
            address={hasCoordinates ? `Lat: ${parsedLat.toFixed(6)}, Lng: ${parsedLng.toFixed(6)}` : "Click or drag pin to adjust cafe location"}
          />
        </MapContainer>
      </div>
    </div>
  );
};
