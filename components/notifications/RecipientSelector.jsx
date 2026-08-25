'use client';
import React, { useState } from 'react';
import { Users, User, CheckSquare, Square, Search, UserCheck, Plus, X, Mail } from 'lucide-react';
import { cn } from '@/utils/cn';

export const RecipientSelector = ({ selected = [], onChange, customers = [] }) => {
  const [search, setSearch] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  // Use real customer records passed from props
  const activeCustomers = customers || [];

  const filteredCustomers = activeCustomers.filter(c => 
    !search || 
    (c.name && c.name.toLowerCase().includes(search.toLowerCase())) || 
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const isAllSelected = selected.length > 0 && activeCustomers.length > 0 && selected.length === activeCustomers.length;

  const toggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(activeCustomers.map(c => c.id || c.email));
    }
  };

  const toggleCustomer = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(cId => cId !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const addCustomEmailRecipient = () => {
    if (customEmail && customEmail.includes('@') && !selected.includes(customEmail)) {
      onChange([...selected, customEmail]);
      setCustomEmail('');
    }
  };

  const removeRecipient = (recipientId) => {
    onChange(selected.filter(id => id !== recipientId));
  };

  return (
    <div className="bg-white rounded-3xl border border-border/60 shadow-2xs overflow-hidden text-[#2C1810]">
      
      {/* Selector Header Bar */}
      <div className="p-4 border-b border-border/40 bg-surface/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold text-xs">
            <Users className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-[#2C1810]">Target Email Recipients</h4>
            <p className="text-[10px] text-text/60">{selected.length} recipient{selected.length === 1 ? '' : 's'} selected</p>
          </div>
        </div>

        {activeCustomers.length > 0 && (
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={toggleAll}
              className="text-xs font-bold text-[#6F4E37] hover:text-[#5D3F2B] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6F4E37]/10 hover:bg-[#6F4E37]/20 transition-all"
            >
              {isAllSelected ? (
                <><CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Deselect All</>
              ) : (
                <><Square className="w-3.5 h-3.5 text-[#6F4E37]" /> Select All ({activeCustomers.length})</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Prominent & Interactive Search + Custom Email Inputs */}
      <div className="p-4 bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] border-b border-border/40 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Big Interactive Search Box */}
          <div className="md:col-span-7 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F4E37]" />
            <input 
              type="text" 
              placeholder="Search customers by name or email address..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-[#DDB892]/60 bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 shadow-2xs font-medium transition-all"
            />
          </div>

          {/* Big Custom Email Input */}
          <div className="md:col-span-5 flex items-center gap-1.5">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
              <input 
                type="email" 
                placeholder="Enter custom email address..." 
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomEmailRecipient(); }}}
                className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-2xl border border-[#DDB892]/60 bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 shadow-2xs font-medium transition-all"
              />
            </div>
            <button
              type="button"
              onClick={addCustomEmailRecipient}
              className="px-4 py-2.5 bg-[#6F4E37] hover:bg-[#5D3F2B] text-white rounded-2xl text-xs font-extrabold shrink-0 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1"
              title="Add custom email recipient"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

        </div>

        {/* Selected Recipients Pills */}
        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-[#6F4E37] uppercase tracking-wider mr-1">Selected:</span>
            {selected.map(id => {
              const cust = activeCustomers.find(c => (c.id || c.email) === id);
              const label = cust ? (cust.name || cust.email) : id;
              return (
                <span 
                  key={id} 
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#DDB892] text-[#6F4E37] text-xs font-bold shadow-2xs"
                >
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  <span className="max-w-[150px] truncate">{label}</span>
                  <button 
                    type="button" 
                    onClick={() => removeRecipient(id)}
                    className="p-0.5 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Recipient Cards Grid */}
      <div className="max-h-60 overflow-y-auto custom-scrollbar p-3">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-xs text-text/60 space-y-1">
            <p className="font-bold text-[#2C1810]">No customer records found</p>
            <p className="text-[11px] text-text/50">Enter a custom email address in the input above to send your broadcast.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredCustomers.map(customer => {
              const customerKey = customer.id || customer.email;
              const isSelected = selected.includes(customerKey);
              return (
                <div 
                  key={customerKey}
                  onClick={() => toggleCustomer(customerKey)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border select-none",
                    isSelected 
                      ? "bg-[#FFF8F0] border-[#DDB892] shadow-2xs" 
                      : "bg-white border-border/40 hover:bg-surface/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-extrabold",
                      isSelected ? "bg-[#6F4E37] text-white" : "bg-surface/80 text-text/60"
                    )}>
                      {customer.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-extrabold text-[#2C1810] truncate">{customer.name || customer.email}</div>
                      <div className="text-[10px] text-text/60 truncate">{customer.email || customer.phone || 'Customer Record'}</div>
                    </div>
                  </div>

                  <div className={cn(
                    "w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "bg-[#6F4E37] border-[#6F4E37] text-white" : "border-border/60 bg-white"
                  )}>
                    {isSelected && <UserCheck className="w-3 h-3 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
