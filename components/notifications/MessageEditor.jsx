'use client';
import React from 'react';
import { Type, Mail, Sparkles, Variable, Code2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export const MessageEditor = ({ register, errors, watch, setValue }) => {
  const subject = watch('subject') || '';
  const message = watch('message') || '';

  return (
    <div className="space-y-5 text-[#2C1810]">
      
      {/* Communication Channel Indicator */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF8F0] to-surface border border-[#DDB892]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center shadow-2xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#2C1810]">Email Broadcast Channel</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 text-[10px] font-extrabold">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-text/60 mt-0.5">Sender: <span className="font-semibold text-[#6F4E37]">noreply@vexatech.in</span></p>
          </div>
        </div>
        <input type="hidden" value="EMAIL" {...register('channel')} />
      </div>

      {/* Subject Line */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-[#2C1810]">Subject Line *</label>
          <span className="text-[10px] text-text/50 font-semibold">{subject.length} / 100 chars</span>
        </div>
        <div className="relative">
          <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
          <input
            {...register('subject')}
            type="text"
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10",
              errors.subject ? "border-danger focus:border-danger" : "border-border/60"
            )}
            placeholder="e.g., Table Reservation Confirmed - Fahara Cafe..."
          />
        </div>
        {errors.subject && <p className="mt-1 text-[10px] text-danger">{errors.subject.message}</p>}
      </div>

      {/* Message Body */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-[#2C1810]">Message Body Paragraphs *</label>
          <span className="text-[10px] text-text/50 font-semibold">{message.length} / 2000 chars</span>
        </div>
        <textarea
          {...register('message')}
          rows={7}
          className={cn(
            "w-full px-4 py-3 rounded-2xl border bg-surface/30 text-xs font-medium transition-all focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 resize-none leading-relaxed",
            errors.message ? "border-danger focus:border-danger" : "border-border/60"
          )}
          placeholder="Write your email broadcast content here..."
        />
        {errors.message && <p className="mt-1 text-[10px] text-danger">{errors.message.message}</p>}
      </div>
    </div>
  );
};
