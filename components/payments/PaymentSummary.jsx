import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

export const PaymentSummary = ({ payment, onDownloadInvoice }) => {
  if (!payment) return null;

  const subtotal = Number(payment.amount || 0);
  const tax = Number(payment.tax_amount || 0);
  const discount = Number(payment.discount_amount || 0);
  const total = subtotal + tax - discount;

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm h-full flex flex-col">
      <h2 className="text-xl font-bold text-text mb-6">Payment Summary</h2>

      <div className="space-y-4 mb-8 flex-1">
        <div className="flex justify-between items-center text-sm">
           <span className="text-text/70">Subtotal</span>
           <span className="font-medium text-text">₹{subtotal.toLocaleString()}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between items-center text-sm text-green-600">
             <span>Discount</span>
             <span className="font-medium">-₹{discount.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm">
           <span className="text-text/70">Tax (GST)</span>
           <span className="font-medium text-text">₹{tax.toLocaleString()}</span>
        </div>

        <div className="pt-4 border-t border-border/50 flex justify-between items-center">
           <span className="font-bold text-text">Total Amount</span>
           <span className="text-2xl font-bold text-primary">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-3 mt-auto">
        {payment.invoice_id && (
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => onDownloadInvoice(payment.invoice_id)}
          >
            <Download className="w-4 h-4" /> Download Invoice
          </Button>
        )}
        <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-text/60">
           <FileText className="w-4 h-4" /> View Receipt
        </Button>
      </div>
    </div>
  );
};
