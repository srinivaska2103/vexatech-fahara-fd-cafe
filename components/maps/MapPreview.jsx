'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { LocationMarker } from './LocationMarker';
import { cn } from '@/utils/cn';

const defaultCenter = [40.7128, -74.0060]; // New York Default

export const MapPreview = ({ latitude, longitude, address, className }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={cn("animate-pulse bg-border/40 rounded-xl", className)}></div>;
  }

  const hasCoordinates = latitude && longitude;
  const center = hasCoordinates ? [parseFloat(latitude), parseFloat(longitude)] : defaultCenter;

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border/50 z-0", className)}>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        
        {hasCoordinates && (
          <LocationMarker position={center} address={address} draggable={false} />
        )}
      </MapContainer>
      {address && (
        <div className="absolute bottom-4 left-4 right-16 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-border pointer-events-none">
          <p className="text-sm font-medium text-text truncate">
            {address}
          </p>
        </div>
      )}
    </div>
  );
};
