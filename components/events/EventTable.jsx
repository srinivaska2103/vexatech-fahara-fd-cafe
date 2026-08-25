import React from 'react';
import { EventStatusBadge } from './EventStatusBadge';
import { Edit2, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export const EventTable = ({ events, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text/60 uppercase bg-surface/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Package Name</th>
              <th className="px-6 py-4 font-medium">Cafe</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-surface/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-text">{event.package_name}</div>
                  <div className="text-text/50 text-xs mt-0.5 max-w-[200px] truncate">{event.description}</div>
                </td>
                <td className="px-6 py-4 text-text/80">{event.cafe?.name}</td>
                <td className="px-6 py-4 text-text/80">{event.event_type}</td>
                <td className="px-6 py-4 font-medium text-text">${event.price}</td>
                <td className="px-6 py-4">
                  <EventStatusBadge status={event.status || 'PUBLISHED'} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/owner/events/${event.id}`}>
                      <button className="p-1.5 text-text/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link href={`/owner/events/${event.id}/edit`}>
                      <button className="p-1.5 text-text/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </Link>
                    <button 
                      onClick={() => onDelete(event)}
                      className="p-1.5 text-text/50 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
