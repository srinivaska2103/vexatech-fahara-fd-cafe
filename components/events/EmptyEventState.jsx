import React from 'react';
import { CalendarX, PartyPopper, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const EmptyEventState = ({ title, message, action = true, search }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-3xl border border-border/60 border-dashed text-center min-h-[380px] text-[#2C1810]">
      <div className="w-16 h-16 bg-[#FFF8F0] border border-[#DDB892]/60 rounded-3xl flex items-center justify-center mb-4 shadow-2xs">
        <PartyPopper className="w-8 h-8 text-[#6F4E37]" />
      </div>
      <h3 className="text-lg font-extrabold text-[#2C1810] mb-1">{title || "No Event Packages Found"}</h3>
      <p className="text-xs text-text/60 max-w-md mb-6 leading-relaxed">
        {message || (search ? "We couldn't find any event packages matching your search keywords." : "You haven't created any event packages yet. Create special party offerings to boost venue bookings!")}
      </p>
      {action && (
        <Link href="/owner/events/create">
          <Button className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Your First Event Package</span>
          </Button>
        </Link>
      )}
    </div>
  );
};
