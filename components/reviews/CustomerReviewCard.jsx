'use client';
import React, { useState } from 'react';
import { Mail, Phone, CalendarCheck, Star, MapPin, Copy, Check, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const CustomerReviewCard = ({ customer, className }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!customer) return null;

  const handleCopyEmail = () => {
    if (customer.email) {
      navigator.clipboard.writeText(customer.email);
      setCopiedEmail(true);
      toast.success('Customer email copied!');
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyPhone = () => {
    if (customer.phone) {
      navigator.clipboard.writeText(customer.phone);
      setCopiedPhone(true);
      toast.success('Customer phone copied!');
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <div className={cn("bg-white p-6 rounded-3xl border border-border/60 shadow-2xs space-y-5 text-[#2C1810]", className)}>
      
      {/* Header Profile */}
      <div className="flex items-center gap-4 pb-4 border-b border-border/40">
        {customer.profile_image ? (
          <img 
            src={customer.profile_image} 
            alt={customer.name} 
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#DDB892]/60 shadow-2xs shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-[#6F4E37]/10 border border-[#DDB892]/40 flex items-center justify-center text-[#6F4E37] font-black text-xl shrink-0">
            {customer.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-extrabold text-base text-[#2C1810] truncate">{customer.name || customer.customer_name || customer.user_name || 'Valued Customer'}</h3>
          <div className="flex items-center gap-1 text-xs text-text/60 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span className="truncate">{customer.city || 'Verified Diner'}</span>
          </div>
        </div>
      </div>

      {/* Contact Metadata */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface/30 border border-border/40">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-4 h-4 text-[#6F4E37] shrink-0" />
            <span className="font-extrabold text-[#2C1810] truncate">{customer.email || 'N/A'}</span>
          </div>
          {customer.email && (
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-1 rounded-lg hover:bg-white text-text/50 hover:text-[#6F4E37] transition-all cursor-pointer shrink-0"
              title="Copy Email"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface/30 border border-border/40">
          <div className="flex items-center gap-2 min-w-0">
            <Phone className="w-4 h-4 text-[#6F4E37] shrink-0" />
            <a href={customer.phone ? `tel:${customer.phone}` : '#'} className="font-extrabold text-[#6F4E37] hover:underline truncate">
              {customer.phone || 'N/A'}
            </a>
          </div>
          {customer.phone && (
            <button
              type="button"
              onClick={handleCopyPhone}
              className="p-1 rounded-lg hover:bg-white text-text/50 hover:text-[#6F4E37] transition-all cursor-pointer shrink-0"
              title="Copy Phone"
            >
              {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface/30 border border-border/40">
          <CalendarCheck className="w-4 h-4 text-[#6F4E37] shrink-0" />
          <span className="font-bold text-[#2C1810]">
            Joined {customer.created_at ? format(new Date(customer.created_at), 'dd/MM/yyyy') : 'N/A'}
          </span>
        </div>
      </div>
      
      {/* Customer Stats Cards */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
        <div className="bg-[#FFF8F0] p-3.5 rounded-2xl border border-[#DDB892]/50 flex flex-col items-center justify-center text-center">
          <span className="text-xl sm:text-2xl font-black text-[#6F4E37]">
            {customer._count?.bookings || customer.total_bookings || 0}
          </span>
          <span className="text-[10px] font-extrabold text-text/60 mt-0.5 uppercase tracking-wider">Total Bookings</span>
        </div>

        <div className="bg-[#FFF8F0] p-3.5 rounded-2xl border border-[#DDB892]/50 flex flex-col items-center justify-center text-center">
          <span className="text-xl sm:text-2xl font-black text-amber-700 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            {customer._count?.reviews || customer.total_reviews || 0}
          </span>
          <span className="text-[10px] font-extrabold text-text/60 mt-0.5 uppercase tracking-wider">Reviews Given</span>
        </div>
      </div>

    </div>
  );
};
