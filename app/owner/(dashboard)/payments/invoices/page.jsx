'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoices, useDownloadInvoice } from '@/hooks/payment';
import { InvoicePreview } from '@/components/payments/InvoicePreview';
import { InvoiceDownloadButton } from '@/components/payments/InvoiceDownloadButton';
import { PaymentSearch } from '@/components/payments/PaymentSearch';
import { EmptyPaymentState } from '@/components/payments/EmptyPaymentState';
import { LoadingSkeleton } from '@/components/payments/LoadingSkeleton';
import { PageHeader } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InvoicesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const { data: invoicesData, isLoading, isError } = useInvoices({ search });
  const downloadMutation = useDownloadInvoice();
  
  const invoices = invoicesData?.data || [];
  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId) || invoices[0];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.push('/owner/payments')} className="mb-4 -ml-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Payments
          </Button>
          <PageHeader 
            title="Invoice Management" 
            description="View and download customer invoices and tax receipts."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List */}
        <div className="lg:col-span-1 space-y-4">
          <PaymentSearch value={search} onChange={setSearch} placeholder="Search invoice number..." />
          
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden h-[600px] flex flex-col">
            <div className="p-4 border-b border-border/50 bg-surface/30">
               <h3 className="font-semibold text-text text-sm flex items-center gap-2">
                 <FileText className="w-4 h-4 text-primary" /> All Invoices
               </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {isLoading ? (
                <div className="space-y-2">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-surface rounded-xl animate-pulse" />)}
                </div>
              ) : isError ? (
                <div className="p-4 text-center text-sm text-danger bg-danger/5 rounded-xl mt-2">
                   Error loading invoices.
                </div>
              ) : invoices.length === 0 ? (
                <EmptyPaymentState title="No Invoices" description="No invoices found." showClear={!!search} onClear={() => setSearch('')} />
              ) : (
                <div className="space-y-2">
                  {invoices.map((invoice) => (
                    <div 
                      key={invoice.id}
                      onClick={() => setSelectedInvoiceId(invoice.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedInvoice?.id === invoice.id ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-white border-transparent hover:bg-surface/50'}`}
                    >
                       <div className="flex justify-between items-start mb-1">
                          <span className="font-mono text-xs font-bold text-text">{invoice.invoice_number || invoice.id.substring(0,8).toUpperCase()}</span>
                          <span className="text-xs font-bold text-primary">₹{Number(invoice.amount || 0).toLocaleString()}</span>
                       </div>
                       <div className="text-sm font-medium text-text truncate mb-2">{invoice.customer_name || 'Guest'}</div>
                       <div className="flex justify-between items-center text-xs text-text/50">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(invoice.created_at).toLocaleDateString()}</span>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-2 flex flex-col h-[600px] pt-12 md:pt-0">
           <AnimatePresence mode="wait">
             <motion.div
                key={selectedInvoice?.id || 'empty'}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full relative"
             >
                <InvoicePreview invoice={selectedInvoice} />
                
                {selectedInvoice && (
                  <div className="absolute top-4 right-4 md:-top-12 md:right-0">
                    <InvoiceDownloadButton 
                      invoiceId={selectedInvoice.id} 
                      onDownload={(id) => downloadMutation.mutate(id)}
                      isDownloading={downloadMutation.isPending}
                    />
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
