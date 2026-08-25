'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { LocationMarker } from './LocationMarker';
import { SearchLocation } from './SearchLocation';
import { UserLocationButton } from './UserLocationButton';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

const defaultCenter = [40.7128, -74.0060]; // New York Default

// Helper component to center map on coordinate changes
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

export const MapPicker = ({ 
  latitude, 
  longitude, 
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

  const hasCoordinates = latitude && longitude;
  const currentCenter = hasCoordinates ? [parseFloat(latitude), parseFloat(longitude)] : defaultCenter;

  const handleDragEnd = async (position) => {
    try {
      // Reverse geocode to get address for dragged location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1`
      );
      const data = await response.json();
      
      const address = data.address || {};
      const city = address.city || address.town || address.village || address.county || '';
      const state = address.state || '';
      const country = address.country || '';
      const pincode = address.postcode || '';
      const street = address.road ? `${address.house_number ? address.house_number + ' ' : ''}${address.road}` : '';

      onLocationSelect({
        lat: position.lat,
        lng: position.lng,
        address: street,
        city,
        state,
        country,
        pincode
      });
    } catch (error) {
      console.error('Error reverse geocoding map drag:', error);
      // Fallback
      onLocationSelect({
        lat: position.lat,
        lng: position.lng
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 h-full", className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchLocation onSelectLocation={(location) => {
            onLocationSelect(location);
          }} />
        </div>
        <UserLocationButton 
          onLocationFound={(location) => {
            onLocationSelect(location);
            toast.success("Location found");
          }} 
          onError={(err) => toast.error(err)}
        />
      </div>

      <div className="relative flex-1 rounded-xl overflow-hidden border border-border/50 z-0 min-h-[300px]">
        <MapContainer
          center={currentCenter}
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
          <MapUpdater center={hasCoordinates ? currentCenter : null} />
          
          <LocationMarker 
            position={currentCenter} 
            draggable={true} 
            onDragEnd={handleDragEnd} 
            address="Drag me to pinpoint exact location"
          />
        </MapContainer>
      </div>
    </div>
  );
};
