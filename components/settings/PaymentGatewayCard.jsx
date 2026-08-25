import React from 'react';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export const PaymentGatewayCard = ({ gatewayName, status, type, icon }) => {
  const isConnected = status === 'CONNECTED';

  return (
    <div className={`p-6 rounded-3xl border ${isConnected ? 'border-primary/20 bg-primary/5' : 'border-border bg-white'} shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all`}>
      <div className="flex items-center gap-4">
         <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isConnected ? 'bg-primary text-white' : 'bg-surface text-text/40'}`}>
            {icon || <CreditCard className="w-6 h-6" />}
         </div>
         <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-text">{gatewayName}</h3>
              {isConnected && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Connected</span>}
            </div>
            <p className="text-sm text-text/60 mt-1">{type}</p>
         </div>
      </div>
      
      <div>
        {isConnected ? (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-xl">
             <CheckCircle className="w-4 h-4" /> Receiving Payments
          </div>
        ) : (
          <button className="px-6 py-2 bg-text text-white rounded-xl font-medium text-sm hover:bg-primary transition-colors">
             Connect Account
          </button>
        )}
      </div>
    </div>
  );
};
