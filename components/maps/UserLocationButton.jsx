'use client';
import React, { useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const UserLocationButton = ({ onLocationFound, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      if (onError) onError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address details using Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          const address = data.address || {};
          const city = address.city || address.town || address.village || address.county || '';
          const state = address.state || '';
          const country = address.country || '';
          const pincode = address.postcode || '';
          const street = address.road ? `${address.house_number ? address.house_number + ' ' : ''}${address.road}` : '';

          onLocationFound({
            lat: latitude,
            lng: longitude,
            address: street,
            city,
            state,
            country,
            pincode,
            displayName: data.display_name
          });
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          // Fallback to just coordinates if reverse geocoding fails
          onLocationFound({
            lat: latitude,
            lng: longitude,
            address: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            displayName: 'Current Location'
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLoading(false);
        let errorMessage = 'Unable to retrieve your location';
        if (error.code === 1) errorMessage = 'Location access denied. Please enable permissions.';
        else if (error.code === 2) errorMessage = 'Location unavailable.';
        else if (error.code === 3) errorMessage = 'Location request timed out.';
        
        if (onError) onError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGetLocation}
      disabled={isLoading}
      className="w-full sm:w-auto gap-2 bg-surface hover:bg-surface/80 border-primary/20 text-primary"
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
      {isLoading ? 'Locating...' : 'Locate Me'}
    </Button>
  );
};
