import React from 'react';
import { Mail, Phone, Calendar, ShieldAlert, Crown, MapPin, Map } from 'lucide-react';
import { VIPBadge } from './VIPBadge';
import { Button } from '../ui/Button';

export const CustomerHeader = ({ customer, onToggleVip, onBlock, isTogglingVip }) => {
  if (!customer) return null;

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="relative shrink-0">
            {customer.profile_image ? (
              <img src={customer.profile_image} alt={customer.name} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#6F4E37]/10" />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[#6F4E37]/10 flex items-center justify-center text-[#6F4E37] font-extrabold text-xl sm:text-3xl border-4 border-[#6F4E37]/10">
                {customer.name?.charAt(0) || 'C'}
              </div>
            )}
            {customer.status === 'BLOCKED' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-danger rounded-full flex items-center justify-center border-2 border-white shadow-xs" title="Blocked">
                <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black text-[#2C1810]">{customer.name || 'Anonymous Customer'}</h2>
              <VIPBadge isVip={customer.is_vip} />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1.5 sm:gap-4 text-xs text-text/60 font-medium">
              <span className="flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" /> {customer.email || 'No email provided'}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" /> {customer.phone || 'No phone provided'}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" /> Joined {new Date(customer.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto border-t md:border-t-0 border-border/50 pt-3 md:pt-0">
          <Button 
            variant="outline" 
            onClick={() => onToggleVip(!customer.is_vip)}
            isLoading={isTogglingVip}
            className={`flex-1 md:flex-none text-xs font-extrabold ${customer.is_vip ? "border-amber-400 text-amber-600 hover:bg-amber-50" : ""}`}
          >
            <Crown className="w-3.5 h-3.5 mr-1.5" />
            {customer.is_vip ? 'Remove VIP' : 'Mark as VIP'}
          </Button>
          
          {customer.status !== 'BLOCKED' ? (
            <Button variant="outline" className="flex-1 md:flex-none text-xs font-extrabold text-danger border-danger/30 hover:bg-danger/10" onClick={onBlock}>
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Block
            </Button>
          ) : (
            <Button variant="outline" className="flex-1 md:flex-none text-xs font-extrabold text-green-600 border-green-600/30 hover:bg-green-50" onClick={onBlock}>
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Unblock
            </Button>
          )}
        </div>
      </div>
      
      {/* Quick Location / Preferred details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/50">
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-surface/50 rounded-2xl border border-border/40">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#6F4E37] shadow-2xs shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-extrabold text-text/40 tracking-wider">Favorite Cafe</div>
            <div className="font-bold text-xs sm:text-sm text-[#2C1810] truncate">{customer.favorite_cafe || 'None yet'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-surface/50 rounded-2xl border border-border/40">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#6F4E37] shadow-2xs shrink-0">
            <Map className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-extrabold text-text/40 tracking-wider">Preferred Event Type</div>
            <div className="font-bold text-xs sm:text-sm text-[#2C1810] truncate">{customer.preferred_event || 'General'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
