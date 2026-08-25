import React, { useState } from 'react';
import { ShieldAlert, Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { useDeleteAccount } from '@/hooks/settings';

export const DangerZone = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const deleteAccountMutation = useDeleteAccount();

  const handleDelete = () => {
    deleteAccountMutation.mutate(undefined, {
      onSettled: () => {
        setShowConfirmModal(false);
        setConfirmText('');
      }
    });
  };

  return (
    <>
      <div className="border border-rose-200 rounded-3xl overflow-hidden bg-white shadow-xs mt-4">
         <div className="bg-rose-50 px-4 py-3 border-b border-rose-100 flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider">Danger Zone</h3>
         </div>
         <div className="p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
               <div>
                 <h4 className="font-extrabold text-xs text-[#2C1810]">Deactivate Account</h4>
                 <p className="text-[11px] text-text/60 mt-0.5 max-w-lg">
                   Temporarily hide your venue. You will not appear in search results, but you can reactivate later.
                 </p>
               </div>
               <button 
                 onClick={() => setShowConfirmModal(true)}
                 className="px-3.5 py-2 border border-rose-200 text-rose-700 rounded-xl font-extrabold text-xs hover:bg-rose-50 transition-colors shrink-0 self-start sm:self-center"
               >
                 Deactivate Account
               </button>
            </div>
            
            <div className="h-px bg-border/40 w-full" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
               <div>
                 <h4 className="font-extrabold text-xs text-rose-700">Delete Business & Account</h4>
                 <p className="text-[11px] text-text/60 mt-0.5 max-w-lg">
                   Permanently delete your profile, business details, bookings, branches, and customer data. This action cannot be undone.
                 </p>
               </div>
               <button 
                 onClick={() => setShowConfirmModal(true)}
                 className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-2xs self-start sm:self-center"
               >
                 <Trash2 className="w-3.5 h-3.5" /> Delete Account
               </button>
            </div>
         </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-border relative">
            <button 
              onClick={() => { setShowConfirmModal(false); setConfirmText(''); }}
              className="absolute top-5 right-5 text-text/40 hover:text-text p-1 rounded-xl hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-extrabold text-[#2C1810] mb-1">Are you absolutely sure?</h3>
            <p className="text-xs text-text/60 mb-4 leading-relaxed">
              This will permanently delete your account, business profile, all branch data, and bookings. You will be logged out immediately.
            </p>

            <div className="mb-4 space-y-1.5">
              <label className="block text-[11px] font-extrabold text-text/70 uppercase tracking-wider">
                Type <span className="font-bold text-rose-600">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => { setShowConfirmModal(false); setConfirmText(''); }}
                disabled={deleteAccountMutation.isPending}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE' || deleteAccountMutation.isPending}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-extrabold hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-2xs"
              >
                {deleteAccountMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Permanently Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
