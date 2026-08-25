import React from 'react';
import { Mail, Phone, Calendar, ShieldAlert, Crown, MapPin, Map } from 'lucide-react';
import { VIPBadge } from './VIPBadge';
import { Button } from '../ui/Button';

export const CustomerHeader = ({ customer, onToggleVip, onBlock, isTogglingVip }) => {
  if (!customer) return null;

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        <div className="flex items-center gap-6">
          <div className="relative">
            {customer.profile_image ? (
              <img src={customer.profile_image} alt={customer.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary/10" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl border-4 border-primary/10">
                {customer.name?.charAt(0) || 'C'}
              </div>
            )}
            {customer.status === 'BLOCKED' && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-danger rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Blocked">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-text">{customer.name || 'Anonymous Customer'}</h2>
              <VIPBadge isVip={customer.is_vip} />
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-text/60">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {customer.email || 'No email provided'}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {customer.phone || 'No phone provided'}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(customer.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-border/50 pt-4 md:pt-0">
          <Button 
            variant="outline" 
            onClick={() => onToggleVip(!customer.is_vip)}
            isLoading={isTogglingVip}
            className={customer.is_vip ? "border-amber-400 text-amber-600 hover:bg-amber-50" : ""}
          >
            <Crown className="w-4 h-4 mr-2" />
            {customer.is_vip ? 'Remove VIP' : 'Mark as VIP'}
          </Button>
          
          {customer.status !== 'BLOCKED' ? (
            <Button variant="outline" className="text-danger border-danger/30 hover:bg-danger/10" onClick={onBlock}>
              <ShieldAlert className="w-4 h-4 mr-2" /> Block
            </Button>
          ) : (
            <Button variant="outline" className="text-green-600 border-green-600/30 hover:bg-green-50" onClick={onBlock}>
              <ShieldAlert className="w-4 h-4 mr-2" /> Unblock
            </Button>
          )}
        </div>
      </div>
      
      {/* Quick Location / Preferred details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-border/50">
        <div className="flex items-center gap-3 p-4 bg-surface/50 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-text/40 tracking-wider">Favorite Cafe</div>
            <div className="font-medium text-text">{customer.favorite_cafe || 'None yet'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-surface/50 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-text/40 tracking-wider">Preferred Event Type</div>
            <div className="font-medium text-text">{customer.preferred_event || 'General'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
