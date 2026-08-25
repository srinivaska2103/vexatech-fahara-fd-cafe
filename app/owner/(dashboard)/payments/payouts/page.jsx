'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { usePayouts } from '@/hooks/payment';
import { PayoutHistory } from '@/components/payments/PayoutHistory';
import { LoadingSkeleton } from '@/components/payments/LoadingSkeleton';
import { PageHeader } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ArrowRightLeft } from 'lucide-react';

export default function PayoutsPage() {
  const router = useRouter();
  const { data: payoutsData, isLoading, isError } = usePayouts();
  const payouts = payoutsData?.data || [];
  
  const completedPayouts = payouts.filter(p => p.status === 'COMPLETED');
  const totalPaidOut = completedPayouts.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingPayouts = payouts.filter(p => p.status === 'PROCESSING' || p.status === 'PENDING').sort((a,b) => new Date(a.transfer_date) - new Date(b.transfer_date));
  const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const nextPayout = pendingPayouts.length > 0 ? pendingPayouts[0] : null;
  const nextPayoutText = nextPayout ? `Scheduled for ${new Date(nextPayout.transfer_date).toLocaleDateString()}` : 'No Scheduled Payouts';

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.push('/owner/payments')} className="mb-4 -ml-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Payments
          </Button>
          <PageHeader 
            title="Payouts & Settlements" 
            description="Track funds transferred from Fahara to your bank account."
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col">
          <div className="text-xs font-bold uppercase tracking-wider text-text/40 mb-1">Total Paid Out</div>
          <div className="text-2xl font-bold text-green-700">₹{totalPaidOut.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col">
          <div className="text-xs font-bold uppercase tracking-wider text-text/40 mb-1">Pending Transfer</div>
          <div className="text-2xl font-bold text-amber-700">₹{totalPendingAmount.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text/40">Next Scheduled Payout</div>
            <div className="font-bold text-text text-sm">{nextPayoutText}</div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : isError ? (
        <div className="bg-danger/10 text-danger p-6 rounded-3xl border border-danger/20 text-center">
          <p className="font-semibold mb-2">Error Loading Payouts</p>
          <p className="text-sm">Please try again later. Make sure the backend endpoint exists.</p>
        </div>
      ) : (
        <PayoutHistory payouts={payouts} />
      )}
    </div>
  );
}
