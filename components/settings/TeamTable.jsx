import React from 'react';
import { User, Shield, MoreVertical } from 'lucide-react';

export const TeamTable = ({ members }) => {
  if (!members || members.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-border border-dashed text-center">
         <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-text/30" />
         </div>
         <h4 className="text-lg font-semibold text-text mb-2">No Team Members</h4>
         <p className="text-sm text-text/50">Invite staff members to help manage your cafe.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-surface/30 text-xs uppercase tracking-wider text-text/50 font-medium border-b border-border/50">
              <th className="px-6 py-4">Staff Member</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {members.map((member, i) => (
              <tr key={i} className="hover:bg-surface/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold">{member.name?.charAt(0) || 'U'}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="font-semibold text-text">{member.name}</span>
                        <span className="text-xs text-text/50">{member.email}</span>
                     </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-text/70">
                     <Shield className="w-4 h-4 text-primary/60" /> {member.role || 'Staff'}
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${member.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : member.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-surface text-text/50'}`}>
                     {member.status || 'ACTIVE'}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="p-2 text-text/40 hover:text-text hover:bg-surface rounded-lg transition-colors">
                     <MoreVertical className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
