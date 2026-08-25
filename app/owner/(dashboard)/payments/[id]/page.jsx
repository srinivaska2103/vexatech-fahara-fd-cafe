'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePayment, useDownloadInvoice } from '@/hooks/payment';
import { PaymentDetails } from '@/components/payments/PaymentDetails';
import { PaymentSummary } from '@/components/payments/PaymentSummary';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: paymentData, isLoading, isError } = usePayment(id);
  const downloadMutation = useDownloadInvoice();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 animate-pulse space-y-6">
         <div className="h-10 w-32 bg-surface rounded-lg mb-4" />
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 h-[400px] bg-surface rounded-3xl" />
           <div className="lg:col-span-1 h-[400px] bg-surface rounded-3xl" />
         </div>
      </div>
    );
  }

  if (isError || !paymentData?.data) {
    return (
      <div className="p-6 md:p-8">
        <Button variant="ghost" onClick={() => router.push('/owner/payments')} className="mb-6 -ml-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Payments
        </Button>
        <div className="bg-danger/10 text-danger p-6 rounded-3xl border border-danger/20 text-center">
          <p className="font-semibold mb-2">Payment Not Found</p>
          <p className="text-sm">This transaction could not be loaded or the endpoint is not implemented.</p>
        </div>
      </div>
    );
  }

  const payment = paymentData.data;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <Button variant="ghost" onClick={() => router.push('/owner/payments')} className="-ml-4 mb-2">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Payments
      </Button>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
           <PaymentDetails payment={payment} />
        </div>
        <div className="lg:col-span-1">
           <PaymentSummary 
             payment={payment} 
             onDownloadInvoice={(invoiceId) => downloadMutation.mutate(invoiceId)}
           />
        </div>
      </motion.div>
    </div>
  );
}
