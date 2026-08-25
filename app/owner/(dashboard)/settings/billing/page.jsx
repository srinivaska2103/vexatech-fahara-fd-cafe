'use client';
import React from 'react';
import { GSTSettings } from '@/components/settings/GSTSettings';
import toast from 'react-hot-toast';
import { Receipt } from 'lucide-react';

export default function BillingSettingsPage() {
  const handleSubmit = (data) => {
    toast.success('Billing & GST settings updated');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-text">Billing & GST</h2>
        <p className="text-sm text-text/60">Configure your tax settings and invoicing preferences.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
               <Receipt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-text">Tax Configuration</h3>
              <p className="text-xs text-text/50">Used for generating customer invoices.</p>
            </div>
         </div>
         
         <GSTSettings onSubmit={handleSubmit} isPending={false} />
      </div>
    </div>
  );
}
