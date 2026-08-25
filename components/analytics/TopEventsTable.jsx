import React from 'react';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const TopEventsTable = ({ events }) => {
  const router = useRouter();

  if (!events || events.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm text-center text-sm text-text/50 py-12">
        No event data available for this period.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm h-full flex flex-col">
      <div className="p-6 border-b border-border/50 flex justify-between items-center bg-surface/30">
        <h3 className="text-lg font-bold text-text">Top Performing Events</h3>
        <button onClick={() => router.push('/owner/analytics/events')} className="text-sm font-medium text-primary hover:underline">
          View All
        </button>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-surface/10 text-xs uppercase tracking-wider text-text/50 font-medium border-b border-border/50">
              <th className="px-6 py-4">Event Name</th>
              <th className="px-6 py-4 text-center">Tickets Sold</th>
              <th className="px-6 py-4 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {events.slice(0, 5).map((event, i) => (
              <tr key={i} className="hover:bg-surface/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-text flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary/60" /> {event.title || 'Unknown Event'}
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-text/70">
                  <div className="flex items-center justify-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> {event.tickets_sold || 0}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-text">
                  <div className="flex items-center justify-end gap-1.5">
                    ₹{Number(event.revenue || 0).toLocaleString()}
                    {i === 0 && <TrendingUp className="w-3.5 h-3.5 text-green-500" />}
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
