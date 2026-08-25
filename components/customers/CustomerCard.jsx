import React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MoreVertical, Crown, Calendar, ShieldAlert } from 'lucide-react';
import { VIPBadge } from './VIPBadge';
import { motion } from 'framer-motion';

export const CustomerCard = ({ customer }) => {
  const router = useRouter();

  if (!customer) return null;

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={() => router.push(`/owner/customers/${customer.id}`)}
      className="bg-white p-6 rounded-3xl border border-border shadow-sm cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
    >
      {/* Blocked Overlay */}
      {customer.status === 'BLOCKED' && (
        <div className="absolute inset-0 bg-danger/5 backdrop-blur-[1px] z-10 flex items-center justify-center">
           <div className="bg-white/90 px-4 py-2 rounded-full font-bold text-danger text-sm shadow-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> BLOCKED
           </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6 relative z-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            {customer.profile_image ? (
              <img src={customer.profile_image} alt={customer.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20">
                {customer.name?.charAt(0) || 'C'}
              </div>
            )}
            {customer.is_vip && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white text-white">
                <Crown className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-text text-lg">{customer.name || 'Anonymous'}</h4>
            <div className="text-xs text-text/50">Joined {new Date(customer.created_at).toLocaleDateString()}</div>
          </div>
        </div>
        <button className="text-text/40 hover:text-text transition-colors p-1" onClick={(e) => e.stopPropagation()}>
           <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 mb-6 relative z-0">
        <div className="flex items-center gap-3 text-sm text-text/70">
           <Phone className="w-4 h-4 text-text/40" />
           {customer.phone || 'N/A'}
        </div>
        <div className="flex items-center gap-3 text-sm text-text/70 truncate">
           <Mail className="w-4 h-4 text-text/40" />
           {customer.email || 'N/A'}
        </div>
        <div className="flex items-center gap-3 text-sm text-text/70">
           <Calendar className="w-4 h-4 text-text/40" />
           Last Booking: {customer.last_booking_date ? new Date(customer.last_booking_date).toLocaleDateString() : 'None'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50 relative z-0">
         <div className="bg-surface/50 rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-primary">{customer.total_bookings || 0}</div>
            <div className="text-xs text-text/50 font-medium mt-0.5">Bookings</div>
         </div>
         <div className="bg-surface/50 rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-primary">₹{customer.total_spend || 0}</div>
            <div className="text-xs text-text/50 font-medium mt-0.5">Total Spend</div>
         </div>
      </div>
    </motion.div>
  );
};
