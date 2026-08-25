'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

export const SearchLocation = ({ onSelectLocation, className }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (!query || query.length < 3) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Error searching location:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (result) => {
    setQuery(result.display_name);
    setIsOpen(false);
    
    // Parse address details
    const address = result.address || {};
    const city = address.city || address.town || address.village || address.county || '';
    const state = address.state || '';
    const country = address.country || '';
    const pincode = address.postcode || '';
    const street = address.road ? `${address.house_number ? address.house_number + ' ' : ''}${address.road}` : '';

    onSelectLocation({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name,
      address: street,
      city,
      state,
      country,
      pincode
    });
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-text/40" />
          )}
        </div>
        <Input
          type="text"
          placeholder="Search for an area, street, or city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen && e.target.value.length >= 3) setIsOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="pl-9 bg-white"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-[1000] w-full mt-1 bg-white rounded-xl shadow-lg border border-border/50 max-h-60 overflow-auto">
          <ul className="py-2">
            {results.map((result) => (
              <li
                key={result.place_id}
                className="px-4 py-2 hover:bg-surface cursor-pointer flex items-start gap-3 transition-colors"
                onClick={() => handleSelect(result)}
              >
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text line-clamp-1">{result.display_name.split(',')[0]}</p>
                  <p className="text-xs text-text/60 line-clamp-1">{result.display_name.split(',').slice(1).join(', ')}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
