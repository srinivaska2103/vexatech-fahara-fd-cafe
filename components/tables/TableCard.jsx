'use client';
import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Wrench, 
  Edit2, 
  Power, 
  MoreVertical, 
  Layers, 
  Trash2,
  Sparkles,
  Sun,
  Home,
  Crown,
  Coffee,
  Trees,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const TableCard = ({ 
  table, 
  onEdit, 
  onToggleStatus, 
  onDelete, 
  onManageCombinations 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getLocationBadge = (location) => {
    const locLower = (location || 'indoor').toLowerCase();
    let icon = <Home className="w-3.5 h-3.5 text-[#6F4E37]" />;
    let label = location || 'Indoor';
    let badgeStyle = 'bg-[#6F4E37]/10 text-[#6F4E37] border-[#6F4E37]/20';

    if (locLower.includes('outdoor')) {
      icon = <Sun className="w-3.5 h-3.5 text-amber-600" />;
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    } else if (locLower.includes('rooftop')) {
      icon = <Compass className="w-3.5 h-3.5 text-purple-600" />;
      badgeStyle = 'bg-purple-50 text-purple-800 border-purple-200';
    } else if (locLower.includes('private') || locLower.includes('vip')) {
      icon = <Crown className="w-3.5 h-3.5 text-indigo-600" />;
      badgeStyle = 'bg-indigo-50 text-indigo-800 border-indigo-200';
    } else if (locLower.includes('window')) {
      icon = <Coffee className="w-3.5 h-3.5 text-cyan-600" />;
      badgeStyle = 'bg-cyan-50 text-cyan-800 border-cyan-200';
    } else if (locLower.includes('garden')) {
      icon = <Trees className="w-3.5 h-3.5 text-emerald-600" />;
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }

    return (
      <span className={`px-2.5 py-1 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shrink-0 ${badgeStyle}`}>
        {icon}
        <span>{label}</span>
      </span>
    );
  };

  const getStatusBadge = (status, resStatus, bookingsCount) => {
    if (resStatus === 'RESERVED' || bookingsCount > 0) {
      return (
        <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-800 border border-indigo-500/30 text-xs font-extrabold flex items-center gap-1.5 shrink-0 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          Reserved ({bookingsCount || 1})
        </span>
      );
    }
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 text-xs font-extrabold flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Active
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1.5 shrink-0">
            <Wrench className="w-3 h-3 text-amber-600" />
            Maintenance
          </span>
        );
      case 'INACTIVE':
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-800 border border-rose-500/30 text-xs font-extrabold flex items-center gap-1.5 shrink-0">
            <XCircle className="w-3 h-3 text-rose-600" />
            Inactive
          </span>
        );
    }
  };

  const isInactive = table.status === 'INACTIVE' || table.status === 'MAINTENANCE';

  // Render Visual 3D Seating Miniature Graphic
  const renderVisualSeatingGraphic = (capacity) => {
    const seatsCount = capacity || 2;
    return (
      <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6F4E37] via-[#A67B5B] to-[#DDB892] text-white flex flex-col items-center justify-center font-black text-sm shadow-md shrink-0 border border-white/40">
        <span className="text-xs font-extrabold tracking-tight drop-shadow-xs">{table.table_number}</span>
        {/* Dynamic dots for chairs */}
        <div className="flex items-center gap-0.5 mt-0.5">
          {Array.from({ length: Math.min(seatsCount, 6) }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-white/90" />
          ))}
          {seatsCount > 6 && <span className="text-[8px] font-black text-white">+</span>}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-3xl border ${
        isInactive ? 'border-border/60 bg-gray-50/70' : 'border-[#DDB892]/70 hover:border-[#6F4E37]'
      } p-5 shadow-xs hover:shadow-lg transition-all relative flex flex-col justify-between space-y-4 text-[#2C1810] overflow-hidden`}
    >
      {/* Card Header: Seating Graphic, Table Number, & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {renderVisualSeatingGraphic(table.capacity)}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-black text-[#2C1810] tracking-tight leading-none">Table {table.table_number}</h4>
            </div>
            <p className="text-xs text-text/65 font-bold mt-1">{table.table_type || `${table.capacity} Seater Table`}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {getStatusBadge(table.status, table.current_reservation_status, table.upcoming_bookings_count)}
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-xl hover:bg-surface text-text/60 hover:text-[#2C1810] transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-8 z-20 w-48 bg-white rounded-2xl border border-[#DDB892] shadow-xl p-1.5 space-y-0.5 text-xs font-extrabold text-[#2C1810]"
                  >
                    <button
                      onClick={() => { setShowMenu(false); onEdit(table); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#6F4E37]" /> Edit Table Details
                    </button>

                    {table.is_combinable && (
                      <button
                        onClick={() => { setShowMenu(false); onManageCombinations(table); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-indigo-600" /> Configure Combinations
                      </button>
                    )}

                    <button
                      onClick={() => { setShowMenu(false); onToggleStatus(table); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50 text-amber-800 transition-colors cursor-pointer"
                    >
                      <Power className="w-3.5 h-3.5 text-amber-600" />
                      {table.status === 'ACTIVE' ? 'Deactivate Table' : 'Activate Table'}
                    </button>

                    <div className="my-1 border-t border-border/40" />

                    <button
                      onClick={() => { setShowMenu(false); onDelete(table); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete / Deactivate
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Details Row: Interactive Seat Pill & Location Pill */}
      <div className="grid grid-cols-2 gap-2.5 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-[#FFF8F0] to-[#FFF5EA] border border-[#DDB892]/50 text-xs">
        <div className="flex items-center gap-2 text-[#2C1810] font-black">
          <div className="w-6 h-6 rounded-lg bg-[#6F4E37]/10 flex items-center justify-center text-[#6F4E37] shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
          <span>👥 {table.capacity} Seats</span>
        </div>

        <div className="flex items-center justify-end truncate">
          {getLocationBadge(table.location)}
        </div>
      </div>

      {/* Combinations Pairing Bar */}
      {table.is_combinable && (
        <div 
          onClick={() => onManageCombinations && onManageCombinations(table)}
          className="p-2.5 rounded-2xl bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-200/60 text-xs font-bold text-indigo-900 flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5 text-indigo-700">
            <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            Can combine with:
          </span>
          <span className="font-black text-[#2C1810] bg-white px-2 py-0.5 rounded-lg border border-indigo-200 shadow-2xs">
            {table.combined_with && table.combined_with.length > 0
              ? table.combined_with.map(c => c.table_number).join(', ')
              : 'Configure'}
          </span>
        </div>
      )}

      {/* Description if present */}
      {table.description && (
        <p className="text-[11px] text-text/60 line-clamp-1 italic px-1">
          "{table.description}"
        </p>
      )}

      {/* Card Action Buttons Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(table)}
          className="rounded-2xl border-border/60 text-xs font-extrabold text-[#6F4E37] hover:bg-[#FFF8F0] px-3.5 py-2 flex-1"
        >
          <Edit2 className="w-3.5 h-3.5 mr-1 text-[#6F4E37]" /> Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(table)}
          className={`rounded-2xl text-xs font-extrabold px-3.5 py-2 flex-1 ${
            table.status === 'ACTIVE'
              ? 'border-amber-300 text-amber-800 hover:bg-amber-50'
              : 'border-emerald-300 text-emerald-800 hover:bg-emerald-50'
          }`}
        >
          <Power className="w-3.5 h-3.5 mr-1" />
          {table.status === 'ACTIVE' ? 'Disable' : 'Enable'}
        </Button>

        {table.is_combinable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onManageCombinations(table)}
            className="rounded-2xl text-xs font-black text-indigo-700 hover:bg-indigo-50 px-2.5 py-2"
            title="Configure Combinations"
          >
            <Layers className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};
