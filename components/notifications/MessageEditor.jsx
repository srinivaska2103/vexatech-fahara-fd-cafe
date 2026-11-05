'use client';
import React from 'react';
import { Type, Mail, Sparkles, Variable, Code2, Store } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CustomSelect } from '@/components/ui/CustomSelect';

export const MessageEditor = ({ register, errors, watch, setValue, cafes = [], defaultCafe = null }) => {
  const subject = watch('subject') || '';
  const message = watch('message') || '';
  const selectedCafeId = watch('cafe_id') || defaultCafe?.id || '';

  const activeCafe = (cafes && cafes.find(c => c.id === selectedCafeId)) || defaultCafe || cafes[0];
  const activeCafeName = activeCafe?.name || 'Your Cafe';

  const handleCafeChange = (e) => {
    const cafeId = e.target.value;
    const found = cafes.find(c => c.id === cafeId);
    setValue('cafe_id', cafeId);
    setValue('cafe_name', found ? found.name : '');
  };

  return (
    <div className="space-y-5 text-[#252525]">
      
      {/* Communication Channel & Sending Cafe Badge */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FFF5F5] via-[#FFF5F5] to-[#F5E6D3] border border-[#EF5350] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#E50914] text-white flex items-center justify-center shadow-xs shrink-0">
            <Store className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#757575]">
                Sender Venue (Default)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[9.5px] font-black border border-emerald-500/30">
                VERIFIED
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-[#252525] tracking-tight">
              {activeCafeName}
            </h4>
            <p className="text-[11px] text-[#E50914] font-semibold mt-0.5">
              Email sender displays as: <span className="font-extrabold text-[#252525]">"{activeCafeName}" &lt;noreply@vexatech.in&gt;</span>
            </p>
          </div>
        </div>

        {/* If owner operates multiple cafes, allow selecting which cafe sends with Custom Interactive Dropdown */}
        {cafes && cafes.length > 1 ? (
          <div className="flex flex-col items-start sm:items-end min-w-[200px]">
            <label className="text-[10px] font-black tracking-wider text-[#757575] uppercase mb-1">
              Switch Cafe
            </label>
            <CustomSelect
              value={selectedCafeId}
              onChange={(newCafeId) => {
                const found = cafes.find(c => c.id === newCafeId);
                setValue('cafe_id', newCafeId);
                setValue('cafe_name', found ? found.name : '');
              }}
              options={cafes.map((c) => ({
                value: c.id,
                label: c.name
              }))}
              icon={Store}
              className="w-full sm:w-56"
            />
          </div>
        ) : (
          <div className="bg-white/80 border border-[#EF5350]/60 px-3 py-1.5 rounded-xl self-start sm:self-auto shrink-0 shadow-2xs">
            <span className="text-[11px] font-extrabold text-[#E50914]">
              Default Cafe Selected
            </span>
          </div>
        )}

        <input type="hidden" value="EMAIL" {...register('channel')} />
        <input type="hidden" value={selectedCafeId} {...register('cafe_id')} />
        <input type="hidden" value={activeCafeName} {...register('cafe_name')} />
      </div>

      {/* Subject Line */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-[#252525]">Subject Line *</label>
          <span className="text-[10px] text-text/50 font-semibold">{subject.length} / 100 chars</span>
        </div>
        <div className="relative">
          <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
          <input
            {...register('subject')}
            type="text"
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all focus:bg-white focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/10",
              errors.subject ? "border-danger focus:border-danger" : "border-border/60"
            )}
            placeholder="e.g., Table Reservation Confirmed - Grab2GO Cafe..."
          />
        </div>
        {errors.subject && <p className="mt-1 text-[10px] text-danger">{errors.subject.message}</p>}
      </div>

      {/* Message Body */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-[#252525]">Message Body Paragraphs *</label>
          <span className="text-[10px] text-text/50 font-semibold">{message.length} / 2000 chars</span>
        </div>
        <textarea
          {...register('message')}
          rows={6}
          className={cn(
            "w-full px-4 py-3 rounded-2xl border bg-surface/30 text-xs font-medium transition-all focus:bg-white focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/10 resize-none leading-relaxed",
            errors.message ? "border-danger focus:border-danger" : "border-border/60"
          )}
          placeholder="Write your email broadcast content here..."
        />
        {errors.message && <p className="mt-1 text-[10px] text-danger">{errors.message.message}</p>}
      </div>

      {/* 3. Live Email Campaign Preview */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#E50914]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Email Preview</span>
          </div>
          <span className="text-[10px] font-bold text-stone-400">Live Rendered View</span>
        </div>

        <div className="rounded-2xl border border-[#EF5350] bg-white overflow-hidden shadow-xs">
          {/* Email Client Header Bar */}
          <div className="bg-[#FAF5EE] px-4 py-3 border-b border-[#FEE2E2] text-[11px] space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#757575] w-14 shrink-0">From:</span>
              <span className="font-bold text-[#252525]">
                {activeCafeName} via Grab2GO <span className="font-normal text-stone-500">&lt;noreply@vexatech.in&gt;</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#757575] w-14 shrink-0">Subject:</span>
              <span className="font-black text-[#E50914]">
                {subject ? (subject.toLowerCase().includes(activeCafeName.toLowerCase()) ? subject : `Special Offers from ${activeCafeName} - ${subject}`) : `Special Offers from ${activeCafeName}`}
              </span>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="p-5 sm:p-6 space-y-4 text-xs text-[#252525] bg-[#FFFDFB]">
            {/* Cafe Venue Branding Header */}
            <div className="p-3.5 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E50914] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                ☕
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-[#757575] tracking-wider block">Message From Venue</span>
                <span className="text-sm font-black text-[#252525]">{activeCafeName}</span>
              </div>
            </div>

            {/* Greeting */}
            <div className="space-y-1 pt-1">
              <p className="font-bold text-stone-700">Hi John,</p>
              <p className="font-extrabold text-sm text-[#252525]">
                Greetings from <span className="text-[#E50914] underline decoration-[#E50914]/30">{activeCafeName}</span>!
              </p>
            </div>

            {/* Message Body */}
            <div className="p-4 rounded-xl bg-[#FFF5F5] border-l-4 border-[#E50914] text-xs font-medium text-[#B71C1C] whitespace-pre-wrap leading-relaxed shadow-2xs">
              {message || "Discover our latest offers and enjoy your next visit with us."}
            </div>

            <p className="text-[11px] text-stone-500 font-medium">
              Discover our latest offers and enjoy your next visit with us.
            </p>

            {/* Sign-off */}
            <div className="pt-3 border-t border-[#FEE2E2] space-y-0.5 text-[11px]">
              <p className="text-[#E50914] font-semibold">Warm regards,</p>
              <p className="font-black text-[#252525] text-xs">{activeCafeName} Team</p>
              <p className="text-[10px] text-[#B71C1C] font-bold">Powered by Grab2GO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
