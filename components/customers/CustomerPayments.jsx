import React from 'react';
import { CreditCard } from 'lucide-react';

export const CustomerPayments = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-surface/30 rounded-3xl border border-border/50 border-dashed">
        <CreditCard className="w-10 h-10 text-text/20 mb-3" />
        <p className="text-text/60 font-medium">No payment history</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-surface/50 text-xs uppercase tracking-wider text-text/50 font-medium border-b border-border">
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-surface/30 transition-colors">
                <td className="px-6 py-4 font-medium text-text font-mono text-xs">{payment.transaction_id || payment.id.substring(0,12)}</td>
                <td className="px-6 py-4 text-text/70">{new Date(payment.date || payment.paid_at || payment.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-text/80">{payment.method || payment.payment_gateway || payment.payment_method || 'RAZORPAY'}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    payment.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                    payment.status === 'FAILED' ? 'bg-danger/10 text-danger' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium">₹{Number(payment.amount || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
