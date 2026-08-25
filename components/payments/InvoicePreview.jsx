import React from 'react';
import { FileText, Building2, User } from 'lucide-react';

export const InvoicePreview = ({ invoice }) => {
  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface/30 rounded-3xl border border-border/50 border-dashed h-full">
        <FileText className="w-10 h-10 text-text/20 mb-3" />
        <p className="text-text/60 font-medium">Select an invoice to preview</p>
      </div>
    );
  }

  const subtotal = Number(invoice.amount || 0);
  const total = subtotal;

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-8 bg-surface/30 border-b border-border/50 flex justify-between items-start">
         <div>
           <div className="text-2xl font-bold text-primary mb-1">{invoice.cafe_name || 'Fahara Cafe'}</div>
           <div className="text-sm text-text/60 max-w-[200px]">{invoice.cafe_address || '123 Coffee Street, Tech Hub, City, 10001'}</div>
         </div>
         <div className="text-right">
           <div className="text-xl font-bold text-text mb-1">INVOICE</div>
           <div className="text-sm text-text/60 font-mono">{invoice.invoice_number || invoice.id.substring(0,8).toUpperCase()}</div>
           <div className="text-sm text-text/60 mt-1">Date: {new Date(invoice.created_at).toLocaleDateString()}</div>
         </div>
      </div>

      <div className="p-8 grid grid-cols-2 gap-8">
         <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text/40 mb-3">Billed To</h3>
            <div className="font-semibold text-text flex items-center gap-2 mb-1"><User className="w-4 h-4 text-text/50" /> {invoice.customer_name || 'Guest'}</div>
            <div className="text-sm text-text/70">{invoice.customer_email || 'No email provided'}</div>
            <div className="text-sm text-text/70">{invoice.customer_phone || 'No phone provided'}</div>
         </div>
         <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text/40 mb-3">Service Details</h3>
            <div className="font-semibold text-text flex items-center gap-2 mb-1"><Building2 className="w-4 h-4 text-text/50" /> {invoice.cafe_name || 'Cafe'}</div>
            <div className="text-sm text-text/70">Booking Ref: #{invoice.booking_id ? invoice.booking_id : 'N/A'}</div>
         </div>
      </div>

      <div className="p-8 pt-0">
         <table className="w-full text-left text-sm mb-8">
            <thead>
               <tr className="border-b border-border/50 text-text/50 font-medium">
                  <th className="py-3">Description</th>
                  <th className="py-3 text-right">Amount</th>
               </tr>
            </thead>
            <tbody>
               <tr className="border-b border-border/50">
                  <td className="py-4 font-medium text-text">{invoice.description || 'Cafe Booking & Services'}</td>
                  <td className="py-4 text-right">₹{subtotal.toLocaleString()}</td>
               </tr>
            </tbody>
         </table>

         <div className="flex justify-end text-sm">
            <div className="w-64 space-y-3">
               <div className="flex justify-between font-bold text-lg text-primary pt-3 border-t border-border/50">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString()}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="p-8 bg-surface/30 border-t border-border/50 text-center text-xs text-text/50 mt-auto">
         Thank you for your business. For any queries regarding this invoice, please contact vexatech.connect@gmail.com.
      </div>
    </div>
  );
};
