import React from 'react';
import { MapPin, Phone, Mail, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export const BranchTable = ({ branches, onEdit, onDelete }) => {
  if (!branches || branches.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-border border-dashed text-center">
         <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-text/30" />
         </div>
         <h4 className="text-lg font-semibold text-text mb-2">No Branches Added</h4>
         <p className="text-sm text-text/50">You haven't configured any physical branch locations yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-surface/30 text-xs uppercase tracking-wider text-text/50 font-medium border-b border-border/50">
              <th className="px-6 py-4">Branch Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {branches.map((branch, i) => (
              <tr key={i} className="hover:bg-surface/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                     <span className="font-semibold text-text">{branch.name}</span>
                     <span className="text-xs text-text/50 truncate max-w-[200px]">{branch.address}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs text-text/70">
                     <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {branch.phone}</div>
                     <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {branch.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${branch.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-surface text-text/50'}`}>
                     {branch.status || 'ACTIVE'}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     <button onClick={() => onEdit(branch)} className="p-2 text-text/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                       <Edit2 className="w-4 h-4" />
                     </button>
                     <button onClick={() => onDelete(branch)} className="p-2 text-text/40 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
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
