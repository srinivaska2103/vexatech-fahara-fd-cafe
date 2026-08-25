import React from 'react';
import { useRouter } from 'next/navigation';
import { PaymentBadge } from './PaymentBadge';
import { ChevronRight, CreditCard, Building2 } from 'lucide-react';

export const PaymentTable = ({ payments }) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 text-xs uppercase tracking-wider text-text/50 font-medium border-b border-border">
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Customer / Booking</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-sm">
            {payments.map((payment) => (
              <tr 
                key={payment.id} 
                onClick={() => router.push(`/owner/payments/${payment.id}`)}
                className="hover:bg-surface/30 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 font-mono text-xs font-medium text-text/80">
                  {payment.transaction_id || payment.id.substring(0,12).toUpperCase()}
                </td>
                
                <td className="px-6 py-4">
                  <div className="font-medium text-text">{payment.customer_name || 'Guest'}</div>
                  <div className="text-xs text-text/50 flex items-center gap-1 mt-0.5">
                    {payment.booking_id ? `Booking #${payment.booking_id.substring(0,6)}` : 'Direct'}
                    {payment.cafe_name && (
                      <>
                        <span className="mx-1">•</span>
                        <Building2 className="w-3 h-3" /> {payment.cafe_name}
                      </>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-text/70">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-text/40" />
                    {payment.method || 'Online'}
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <PaymentBadge status={payment.status} />
                </td>

                <td className="px-6 py-4 text-xs text-text/60 whitespace-nowrap">
                  {new Date(payment.date).toLocaleDateString()}
                  <br />
                  {new Date(payment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>

                <td className="px-6 py-4 text-right font-bold text-text">
                  ₹{Number(payment.amount || 0).toLocaleString()}
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="p-2 rounded-full hover:bg-surface text-primary/40 group-hover:text-primary transition-colors inline-flex">
                     <ChevronRight className="w-4 h-4" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
