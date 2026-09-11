'use client';
import React from 'react';
import { Users, AlertTriangle, CheckCircle2, Info, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CapacitySummaryCard = ({ capacitySummary }) => {
  if (!capacitySummary) return null;

  const total = capacitySummary.total_cafe_capacity || 0;
  const assigned = capacitySummary.assigned_table_capacity || 0;
  const unassigned = capacitySummary.unassigned_capacity || 0;
  const isOverCapacity = capacitySummary.is_over_capacity || assigned > total;

  const getStatusBanner = () => {
    if (isOverCapacity) {
      return (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-extrabold shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Table capacity exceeds your cafe capacity! ({assigned} seats assigned, max limit is {total})</span>
        </div>
      );
    }
    if (assigned === total && total > 0) {
      return (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All seats assigned ({total} / {total} Guests configured)</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold shadow-2xs">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span>{unassigned} seat{unassigned === 1 ? '' : 's'} remaining to assign</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Cafe Capacity */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-gradient-to-br from-[#6F4E37] via-[#A67B5B] to-[#DDB892] text-white shadow-md relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">Total Cafe Capacity</span>
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <h2 className="text-3xl font-black text-white tracking-tight">{total}</h2>
              <span className="text-xs font-extrabold text-white/90">Guests</span>
            </div>
            <p className="text-[11px] text-white/80 mt-1 font-medium">Configured max cafe guest limit</p>
          </div>
        </motion.div>

        {/* Card 2: Assigned Table Capacity */}
        <motion.div 
          whileHover={{ y: -2 }}
          className={`p-5 rounded-3xl bg-white border ${
            isOverCapacity ? 'border-rose-300 bg-rose-50/30' : 'border-[#DDB892]/60'
          } shadow-2xs flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-text/50">Assigned Table Capacity</span>
            <div className={`w-9 h-9 rounded-2xl ${isOverCapacity ? 'bg-rose-100 text-rose-700' : 'bg-[#6F4E37]/10 text-[#6F4E37]'} flex items-center justify-center`}>
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <h2 className={`text-3xl font-black ${isOverCapacity ? 'text-rose-700' : 'text-[#2C1810]'} tracking-tight`}>{assigned}</h2>
              <span className="text-xs font-extrabold text-text/60">Guests</span>
            </div>
            <p className="text-[11px] text-text/65 mt-1 font-medium">Sum of all active table seats</p>
          </div>
        </motion.div>

        {/* Card 3: Unassigned Capacity */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-white border border-[#DDB892]/60 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-text/50">Unassigned Capacity</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <h2 className="text-3xl font-black text-[#2C1810] tracking-tight">{unassigned}</h2>
              <span className="text-xs font-extrabold text-text/60">Guests</span>
            </div>
            <p className="text-[11px] text-text/65 mt-1 font-medium">Remaining seats available to configure</p>
          </div>
        </motion.div>
      </div>

      {/* Dynamic Status Alert Banner */}
      {getStatusBanner()}
    </div>
  );
};
