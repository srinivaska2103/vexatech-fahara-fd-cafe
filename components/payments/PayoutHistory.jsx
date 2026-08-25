import React from 'react';
import { ArrowRightLeft, Building, Hash } from 'lucide-react';

export const PayoutHistory = ({ payouts }) => {
  if (!payouts || payouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-border/50 border-dashed">
        <ArrowRightLeft className="w-10 h-10 text-text/20 mb-3" />
        <h3 className="text-xl font-semibold text-text mb-2">No Payouts Yet</h3>
        <p className="text-text/60 max-w-sm">When your cafe earnings are transferred to your bank account, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 text-xs uppercase tracking-wider text-text/50 font-medium border-b border-border">
              <th className="px-6 py-4">Transfer Date</th>
              <th className="px-6 py-4">Payout ID / Ref</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-sm">
            {payouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-surface/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-text">{new Date(payout.transfer_date || payout.created_at).toLocaleDateString()}</div>
                  <div className="text-xs text-text/50">{new Date(payout.transfer_date || payout.created_at).toLocaleTimeString()}</div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="font-mono text-xs font-bold text-text mb-1 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-text/40" /> {payout.id.substring(0,12).toUpperCase()}
                  </div>
                  <div className="text-xs text-text/50">Ref: {payout.reference_number || 'Processing'}</div>
                </td>

                <td className="px-6 py-4 text-text/80">
                  <div className="flex items-center gap-2 font-medium">
                    <Building className="w-4 h-4 text-text/40" /> {payout.bank_name || 'Bank Transfer'}
                  </div>
                  <div className="text-xs text-text/50 mt-1 pl-6">**** {payout.account_last4 || '1234'}</div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    payout.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                    payout.status === 'FAILED' ? 'bg-danger/10 text-danger border-danger/20' :
                    'bg-amber-100 text-amber-700 border-amber-200'
                  }`}>
                    {payout.status || 'PROCESSING'}
                  </span>
                </td>

                <td className="px-6 py-4 text-right font-bold text-text">
                  ₹{Number(payout.amount || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
