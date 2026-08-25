import React from 'react';
import { User, Star } from 'lucide-react';

export const TopCustomersTable = ({ customers }) => {
  if (!customers || customers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm text-center text-sm text-text/50 py-12">
        No customer data available for this period.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm h-full flex flex-col">
      <div className="p-6 border-b border-border/50 flex justify-between items-center bg-surface/30">
        <h3 className="text-lg font-bold text-text">Most Valuable Customers</h3>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-surface/10 text-xs uppercase tracking-wider text-text/50 font-medium border-b border-border/50">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4 text-center">Bookings</th>
              <th className="px-6 py-4 text-right">Lifetime Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {customers.slice(0, 5).map((customer, i) => (
              <tr key={i} className="hover:bg-surface/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-text flex items-center gap-1">
                        {customer.name || 'Guest'} {i < 3 && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </div>
                      <div className="text-xs text-text/50">{customer.email || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-medium text-text/70">
                  {customer.total_bookings || 0}
                </td>
                <td className="px-6 py-4 text-right font-bold text-text">
                  ₹{Number(customer.lifetime_value || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
