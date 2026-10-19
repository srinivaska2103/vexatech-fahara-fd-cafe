'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, CalendarCheck, Store, Users, Armchair, Sparkles, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBookings } from '@/hooks/booking';
import { useCafes } from '@/hooks/cafe';
import { useCustomers } from '@/hooks/customer';

export const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const { data: bookingsData } = useBookings();
  const { data: cafesData } = useCafes();
  const { data: customersData } = useCustomers();

  const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.data || bookingsData?.bookings || []);
  const cafes = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);
  const customers = Array.isArray(customersData) ? customersData : (customersData?.data || customersData?.customers || []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  const filteredBookings = cleanQuery ? bookings.filter(b => 
    (b.booking_number || b.id || '').toLowerCase().includes(cleanQuery) ||
    (b.customerName || b.users?.name || '').toLowerCase().includes(cleanQuery)
  ).slice(0, 3) : [];

  const filteredCafes = cleanQuery ? cafes.filter(c =>
    (c.name || '').toLowerCase().includes(cleanQuery) ||
    (c.city || '').toLowerCase().includes(cleanQuery)
  ).slice(0, 3) : [];

  const filteredCustomers = cleanQuery ? customers.filter(c =>
    (c.name || '').toLowerCase().includes(cleanQuery) ||
    (c.email || '').toLowerCase().includes(cleanQuery) ||
    (c.phone || '').toLowerCase().includes(cleanQuery)
  ).slice(0, 3) : [];

  const hasResults = filteredBookings.length > 0 || filteredCafes.length > 0 || filteredCustomers.length > 0;

  const handleSelect = (url) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  return (
    <div className="relative w-full max-w-xs lg:max-w-sm hidden md:block" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="w-4 h-4 text-[#6F4E37]/70" />
        </div>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search bookings, cafes, customers..."
          className="w-full pl-9.5 pr-14 py-2 h-9 text-xs rounded-full bg-[#FFF8F0]/70 border border-[#DDB892]/60 text-[#2C1810] placeholder:text-[#2C1810]/40 hover:bg-white hover:border-[#6F4E37]/40 focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-4 focus:ring-[#6F4E37]/10 transition-all duration-200 shadow-2xs font-medium"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#2C1810]/40 hover:text-[#2C1810]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold text-[#6F4E37] bg-white border border-[#DDB892]/60 rounded-md shadow-2xs font-mono">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Live Global Search Dropdown */}
      {isOpen && cleanQuery && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#DDB892]/60 overflow-hidden z-50 p-2 text-xs space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {!hasResults ? (
            <div className="p-4 text-center text-[#2C1810]/60">
              No matching bookings, cafes, or customers found.
            </div>
          ) : (
            <>
              {filteredBookings.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-black uppercase text-[#6F4E37] tracking-wider flex items-center gap-1.5">
                    <CalendarCheck className="w-3 h-3" /> Bookings
                  </div>
                  {filteredBookings.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelect(`/owner/bookings`)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF8F0] flex items-center justify-between text-[#2C1810] group transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-extrabold">{b.booking_number || b.id.substring(0, 8)}</span>
                        <span className="text-[#2C1810]/60 ml-2 font-medium">{b.customerName || 'Guest'}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#6F4E37] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}

              {filteredCafes.length > 0 && (
                <div className="pt-1 border-t border-[#DDB892]/30">
                  <div className="px-3 py-1 text-[10px] font-black uppercase text-[#6F4E37] tracking-wider flex items-center gap-1.5">
                    <Store className="w-3 h-3" /> Cafes
                  </div>
                  {filteredCafes.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(`/owner/cafes/${c.id}`)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF8F0] flex items-center justify-between text-[#2C1810] group transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-extrabold">{c.name}</span>
                        <span className="text-[#2C1810]/60 ml-2 font-medium">{c.city}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#6F4E37] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}

              {filteredCustomers.length > 0 && (
                <div className="pt-1 border-t border-[#DDB892]/30">
                  <div className="px-3 py-1 text-[10px] font-black uppercase text-[#6F4E37] tracking-wider flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> Customers
                  </div>
                  {filteredCustomers.map((c) => (
                    <button
                      key={c.id || c.email}
                      onClick={() => handleSelect(`/owner/customers`)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FFF8F0] flex items-center justify-between text-[#2C1810] group transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-extrabold">{c.name || 'Customer'}</span>
                        <span className="text-[#2C1810]/60 ml-2 font-medium">{c.email || c.phone}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#6F4E37] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
