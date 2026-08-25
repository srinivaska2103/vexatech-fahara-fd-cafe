import React from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, CalendarCheck, ChevronRight } from 'lucide-react';
import { PaymentBadge } from './PaymentBadge';
import { motion } from 'framer-motion';

export const PaymentCard = ({ payment }) => {
  const router = useRouter();

  if (!payment) return null;

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={() => router.push(`/owner/payments/${payment.id}`)}
      className="bg-white p-5 rounded-3xl border border-border shadow-sm cursor-pointer hover:shadow-md transition-all relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs text-text/50 font-mono mb-1">{payment.transaction_id || payment.id.substring(0,10).toUpperCase()}</div>
          <h4 className="font-semibold text-text text-lg">₹{Number(payment.amount || 0).toLocaleString()}</h4>
        </div>
        <PaymentBadge status={payment.status} />
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-text/70">
           <CalendarCheck className="w-4 h-4 text-primary/40" />
           <span className="truncate">{payment.customer_name || 'Guest'} - {payment.booking_id ? `Booking #${payment.booking_id.substring(0,6)}` : 'Direct Sale'}</span>
        </div>
        <div className="flex items-center gap-2 text-text/70">
           <CreditCard className="w-4 h-4 text-primary/40" />
           <span>{payment.method || 'Online'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border/50">
        <span className="text-xs text-text/50">{new Date(payment.date).toLocaleString()}</span>
        <div className="text-primary text-xs font-medium flex items-center group-hover:underline">
          Details <ChevronRight className="w-3 h-3 ml-0.5" />
        </div>
      </div>
    </motion.div>
  );
};
