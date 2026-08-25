import React from 'react';
import { CreditCard, Hash, Calendar, Building2, User, Mail, Phone, Tag } from 'lucide-react';
import { PaymentBadge } from './PaymentBadge';

export const PaymentDetails = ({ payment }) => {
  if (!payment) return null;

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-text mb-1">Transaction Details</h2>
          <div className="flex items-center gap-2 text-sm text-text/50">
             <Hash className="w-3.5 h-3.5" /> {payment.transaction_id || payment.id}
          </div>
        </div>
        <PaymentBadge status={payment.status} className="scale-110 origin-left md:origin-right" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gateway & Timing Info */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold uppercase tracking-wider text-text/40 mb-2">Payment Info</h3>
           
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center shrink-0">
               <CreditCard className="w-4 h-4 text-text/60" />
             </div>
             <div>
               <div className="text-sm font-medium text-text">{payment.method || 'Online Payment'}</div>
               <div className="text-xs text-text/50">Gateway: {payment.gateway || 'Stripe'}</div>
             </div>
           </div>

           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center shrink-0">
               <Calendar className="w-4 h-4 text-text/60" />
             </div>
             <div>
               <div className="text-sm font-medium text-text">{new Date(payment.date).toLocaleDateString()}</div>
               <div className="text-xs text-text/50">{new Date(payment.date).toLocaleTimeString()}</div>
             </div>
           </div>
           
           {payment.reference_number && (
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center shrink-0">
                 <Tag className="w-4 h-4 text-text/60" />
               </div>
               <div>
                 <div className="text-sm font-medium text-text">{payment.reference_number}</div>
                 <div className="text-xs text-text/50">Bank Reference</div>
               </div>
             </div>
           )}
        </div>

        {/* Customer & Booking Info */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold uppercase tracking-wider text-text/40 mb-2">Customer & Order</h3>
           
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
               <User className="w-4 h-4 text-primary" />
             </div>
             <div>
               <div className="text-sm font-medium text-text">{payment.customer_name || 'Guest User'}</div>
               <div className="text-xs text-text/50 flex items-center gap-2">
                 <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {payment.customer_email || 'N/A'}</span>
                 <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {payment.customer_phone || 'N/A'}</span>
               </div>
             </div>
           </div>

           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center shrink-0">
               <Building2 className="w-4 h-4 text-text/60" />
             </div>
             <div>
               <div className="text-sm font-medium text-text">{payment.cafe_name || 'Fahara Cafe'}</div>
               <div className="text-xs text-text/50">
                 {payment.booking_id ? `Booking #${payment.booking_id.substring(0,8)}` : 'Direct Sale'}
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
