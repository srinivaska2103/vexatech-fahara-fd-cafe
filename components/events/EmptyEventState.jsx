import React from 'react';
import { PartyPopper, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const EmptyEventState = ({ search }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 bg-white rounded-2xl border border-[#FEE2E2] text-center min-h-[360px] text-[#252525]">
      <div className="w-14 h-14 bg-[#FFF5F5] border border-[#FEE2E2] rounded-2xl flex items-center justify-center mb-4 shadow-2xs">
        <PartyPopper className="w-7 h-7 text-[#E50914]" />
      </div>
      
      <h3 className="text-lg font-black text-[#252525] mb-1">
        {search ? "No matching packages found" : "No custom event packages yet."}
      </h3>
      
      <p className="text-xs text-[#252525]/70 max-w-md mb-6 leading-relaxed">
        {search 
          ? `We couldn't find any packages matching "${search}".` 
          : "Create your first package for your customers."
        }
      </p>

      <Link href="/owner/events/create">
        <Button className="py-2.5 px-5 rounded-xl bg-[#E50914] hover:bg-[#E50914] text-white text-xs font-bold shadow-2xs flex items-center gap-2">
          <Plus className="w-4 h-4 text-white" />
          <span>+ Create Package</span>
        </Button>
      </Link>
    </div>
  );
};
