'use client';
import React from 'react';
import { PaymentGatewayCard } from '@/components/settings/PaymentGatewayCard';

export default function PaymentSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-text">Payment Methods</h2>
        <p className="text-sm text-text/60">Configure how you accept online payments from customers.</p>
      </div>

      <div className="space-y-4">
         <PaymentGatewayCard 
           gatewayName="Stripe" 
           type="Credit Cards, Apple Pay, Google Pay" 
           status="CONNECTED" 
         />
         <PaymentGatewayCard 
           gatewayName="Razorpay" 
           type="UPI, NetBanking, Wallets" 
           status="DISCONNECTED" 
         />
      </div>
    </div>
  );
}
