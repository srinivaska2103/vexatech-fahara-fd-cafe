'use client';
import React from 'react';
import { MapPin, Users, Star, IndianRupee, Edit2, Eye, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { CafeStatusBadge } from './CafeStatusBadge';
import { Button } from '../ui/Button';
import Link from 'next/link';

export const CafeCard = ({ cafe, onDelete, viewMode = 'grid' }) => {
  let imageSrc = cafe.cover_image;
  
  if (!imageSrc && Array.isArray(cafe.gallery) && cafe.gallery.length > 0) {
    const firstImg = cafe.gallery[0];
    if (typeof firstImg === 'string') imageSrc = firstImg;
    else if (firstImg && typeof firstImg === 'object' && firstImg.url) imageSrc = firstImg.url;
  }

  if (!imageSrc) {
    imageSrc = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800";
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-3xl border border-border/60 overflow-hidden hover:shadow-lg hover:border-[#DDB892] transition-all duration-300 group flex flex-col sm:flex-row items-stretch text-[#2C1810]">
        {/* Image Left */}
        <div className="relative w-full sm:w-72 h-52 sm:h-auto bg-surface shrink-0 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={cafe.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute top-3 left-3">
            <CafeStatusBadge status={cafe.status} />
          </div>
        </div>

        {/* Content Right */}
        <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-extrabold text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">
                {cafe.name}
              </h3>
              <div className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{cafe.averageRating || 'New'}</span>
              </div>
            </div>

            <p className="text-xs text-text/65 line-clamp-2 leading-relaxed">
              {cafe.description || 'No description provided for this venue.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/40 text-xs text-text/70 font-semibold">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-4 h-4 text-[#6F4E37] shrink-0" />
              <span className="truncate">{cafe.address ? `${cafe.address}, ${cafe.city || ''}` : (cafe.city || 'Location N/A')}</span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-1 text-text/60">
                <Users className="w-4 h-4 text-[#6F4E37]" />
                <span>Up to {cafe.maximum_persons || 'N/A'} guests</span>
              </div>

              <div className="flex items-center text-sm font-extrabold text-[#2C1810]">
                <IndianRupee className="w-4 h-4 text-[#6F4E37]" />
                <span>{cafe.price_per_hour || 0}</span>
                <span className="text-[10px] text-text/50 font-normal ml-0.5">/hr</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <Link href={`/owner/cafes/${cafe.id}/edit`}>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5 py-2 px-3 text-xs font-bold border-border/60 text-text/70 hover:bg-surface">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete && onDelete(cafe)}
                className="rounded-xl gap-1.5 py-2 px-3 text-xs text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </Button>
            </div>

            <Link href={`/owner/cafes/${cafe.id}`}>
              <Button className="rounded-xl gap-2 py-2 px-4 text-xs font-extrabold bg-[#6F4E37] hover:bg-[#5D3F2B] text-white shadow-2xs">
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border/60 overflow-hidden hover:shadow-lg hover:border-[#DDB892] transition-all duration-300 group flex flex-col h-full hover:-translate-y-1 text-[#2C1810]">
      {/* Image Header */}
      <div className="relative h-56 bg-surface overflow-hidden">
        <img 
          src={imageSrc} 
          alt={cafe.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-3.5 left-3.5">
          <CafeStatusBadge status={cafe.status} />
        </div>

        {/* Hover Floating Action Buttons */}
        <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
          <Link href={`/owner/cafes/${cafe.id}/edit`}>
            <button className="w-9 h-9 bg-white/95 backdrop-blur-md text-[#2C1810] hover:text-[#6F4E37] hover:bg-white rounded-2xl flex items-center justify-center transition-all shadow-xs hover:scale-110">
              <Edit2 className="w-4 h-4" />
            </button>
          </Link>
          <button 
            onClick={() => onDelete && onDelete(cafe)}
            className="w-9 h-9 bg-white/95 backdrop-blur-md text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-2xl flex items-center justify-center transition-all shadow-xs hover:scale-110"
            title="Delete Cafe"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-white/60 shadow-xs flex items-center gap-0.5 text-xs font-extrabold text-[#2C1810]">
          <IndianRupee className="w-3.5 h-3.5 text-[#6F4E37]" />
          <span>{cafe.price_per_hour || 0}</span>
          <span className="text-[10px] text-text/50 font-normal">/hr</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base sm:text-lg font-extrabold text-[#2C1810] truncate group-hover:text-[#6F4E37] transition-colors">
            {cafe.name}
          </h3>
          <div className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{cafe.averageRating || 'New'}</span>
          </div>
        </div>
        
        <p className="text-xs text-text/65 line-clamp-2 leading-relaxed flex-1">
          {cafe.description || 'No description available for this venue.'}
        </p>
        
        <div className="space-y-2 pt-3 border-t border-border/40 text-xs font-semibold text-text/70">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-[#6F4E37] shrink-0" />
            <span className="truncate">{cafe.address ? `${cafe.address}, ${cafe.city || ''}` : (cafe.city || 'Location N/A')}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text/60">
              <Users className="w-4 h-4 text-[#6F4E37] shrink-0" />
              <span>Up to {cafe.maximum_persons || 'N/A'} guests capacity</span>
            </div>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="pt-2">
          <Link href={`/owner/cafes/${cafe.id}`} className="block">
            <Button className="w-full justify-between py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white hover:shadow-md transition-all duration-300 font-extrabold text-xs shadow-xs border-0">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-white" />
                <span>View Venue Details</span>
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
