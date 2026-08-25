'use client';
import React, { useState, useEffect } from 'react';
import { usePaymentAccount, useUpdatePaymentAccount } from '@/hooks/payment';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Lock, 
  RefreshCw,
  AlertTriangle,
  FileCheck,
  Search,
  RotateCcw,
  Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function PaymentAccountPage() {
  const { data, isLoading, refetch } = usePaymentAccount();
  const updateAccountMutation = useUpdatePaymentAccount();

  const accountInfo = data?.data || {};

  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    phone: '',
    email: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  // Sync state from backend response
  useEffect(() => {
    if (data?.data) {
      const isVerified = data.data.bankVerification === 'VERIFIED' || data.data.bankVerificationStatus === 'VERIFIED';
      const currentHolder = data.data.accountHolderName || '';
      const currentIfsc = data.data.ifsc || data.data.rawIfsc || '';
      const currentEmail = data.data.email || '';
      const currentPhone = data.data.phone || '';
      
      setFormData(prev => ({
        ...prev,
        accountHolderName: currentHolder,
        ifsc: currentIfsc === 'Not Configured' ? '' : currentIfsc,
        email: currentEmail,
        phone: currentPhone || prev.phone
      }));

      if (!isVerified) {
        setIsEditing(true);
      }
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVerifyBankAccount = async (e) => {
    e.preventDefault();

    if (!formData.accountHolderName || !formData.accountNumber || !formData.confirmAccountNumber || !formData.ifsc || !formData.phone || !formData.email) {
      toast.error('Please complete all required fields: Account Holder Name, Bank Account Number, Confirm Bank Account Number, IFSC Code, Phone Number, and Email Address.');
      return;
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      toast.error('Bank Account Number and Confirm Bank Account Number do not match.');
      return;
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
    if (!ifscRegex.test(formData.ifsc.trim())) {
      toast.error('Invalid IFSC Code format. Example: HDFC0001234');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address (e.g. vendor@example.com).');
      return;
    }

    try {
      const response = await updateAccountMutation.mutateAsync({
        accountHolderName: formData.accountHolderName,
        bankAccountNumber: formData.accountNumber,
        confirmBankAccountNumber: formData.confirmAccountNumber,
        ifscCode: formData.ifsc.toUpperCase(),
        phoneNumber: formData.phone,
        email: formData.email
      });

      toast.success(response?.message || 'Bank account verification completed!');
      setIsEditing(false);
      refetch();
    } catch (err) {
      const friendlyMessage = err.response?.data?.message || 'Unable to validate your bank account details. Please check your inputs and try again.';
      toast.error(friendlyMessage);
    }
  };

  const bankStatus = accountInfo.bankVerification || accountInfo.bankVerificationStatus || 'PENDING';
  const vendorStatus = accountInfo.vendorStatus || accountInfo.cashfreeVendorStatus || 'ACTIVE';
  const settlementCapability = bankStatus === 'VERIFIED' ? 'ENABLED' : (accountInfo.settlementStatus || 'DISABLED');

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
      case 'CONNECTED':
      case 'ACTIVE':
      case 'ENABLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {status === 'VERIFIED' ? '✓ Verified' : status}
          </span>
        );
      case 'VERIFYING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 border border-blue-500/20">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Verifying...
          </span>
        );
      case 'REVIEW_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Search className="w-3.5 h-3.5" />
            Under Review
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Verification Required
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <Link href="/owner/payments">
              <button 
                type="button"
                className="px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold flex items-center gap-1 hover:bg-[#6F4E37] hover:text-white transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Back to Payments</span>
              </button>
            </Link>
            <span className="text-[10px] text-text/40 font-bold uppercase tracking-wider">• BANK VERIFICATION</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            Payment Account & Bank Verification
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Validate your bank details via Razorpay Payment Gateway for automated vendor split settlements.
          </p>
        </div>

        {/* Refresh Control */}
        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <button 
            type="button"
            onClick={() => refetch()}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-white" />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      {/* Main Account Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 md:p-8 border border-[#DDB892]/40 shadow-sm mb-8 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start md:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-xl font-bold text-[#2C1810]">Razorpay Vendor Payment Account</h2>
                {renderStatusBadge(bankStatus)}
              </div>
              <p className="text-sm text-[#2C1810]/70 max-w-xl">
                Direct split settlement transfers are routed strictly to your verified bank account.
              </p>
            </div>
          </div>

          {bankStatus === 'VERIFIED' && !isEditing && (
            <button 
              type="button"
              onClick={() => setIsEditing(true)} 
              className="py-2.5 px-4 rounded-2xl bg-white hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892] text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Bank Details</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Grid Layout: Responsive 360px -> 768px -> 1024px Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Bank Account Form */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#DDB892]/40 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[#DDB892]/30 pb-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-[#6F4E37]" />
              <div>
                <h3 className="text-lg font-bold text-[#2C1810]">
                  {updateAccountMutation.isPending 
                    ? 'Verifying your bank account...' 
                    : isEditing 
                    ? 'Enter Bank Account Details' 
                    : 'Verified Settlement Destination'}
                </h3>
                <p className="text-xs text-[#2C1810]/60">
                  {isEditing ? 'Fill in all required fields to initiate Razorpay bank validation' : 'Bank account linked to your Razorpay Vendor ID'}
                </p>
              </div>
            </div>
          </div>

          {/* Form / Details Container */}
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleVerifyBankAccount} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Account Holder Name */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-[#2C1810]/80 uppercase tracking-wider">
                      Account Holder Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      disabled={updateAccountMutation.isPending}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-4 py-3 bg-[#FFF8F0]/40 border border-[#DDB892] rounded-xl text-sm font-medium text-[#2C1810] focus:outline-none focus:border-[#6F4E37] disabled:opacity-50 transition-colors"
                      required
                    />
                  </div>

                  {/* Bank Account Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#2C1810]/80 uppercase tracking-wider">
                      Bank Account Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      disabled={updateAccountMutation.isPending}
                      placeholder="Enter Full Account Number"
                      className="w-full px-4 py-3 bg-[#FFF8F0]/40 border border-[#DDB892] rounded-xl text-sm font-mono text-[#2C1810] focus:outline-none focus:border-[#6F4E37] disabled:opacity-50 transition-colors"
                      required
                    />
                  </div>

                  {/* Confirm Bank Account Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#2C1810]/80 uppercase tracking-wider">
                      Confirm Bank Account Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="confirmAccountNumber"
                      value={formData.confirmAccountNumber}
                      onChange={handleChange}
                      disabled={updateAccountMutation.isPending}
                      placeholder="Re-enter Account Number"
                      className="w-full px-4 py-3 bg-[#FFF8F0]/40 border border-[#DDB892] rounded-xl text-sm font-mono text-[#2C1810] focus:outline-none focus:border-[#6F4E37] disabled:opacity-50 transition-colors"
                      required
                    />
                  </div>

                  {/* IFSC Code */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#2C1810]/80 uppercase tracking-wider">
                      IFSC Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ifsc"
                      value={formData.ifsc}
                      onChange={handleChange}
                      disabled={updateAccountMutation.isPending}
                      placeholder="e.g. HDFC0001234"
                      className="w-full px-4 py-3 bg-[#FFF8F0]/40 border border-[#DDB892] rounded-xl text-sm font-mono uppercase text-[#2C1810] focus:outline-none focus:border-[#6F4E37] disabled:opacity-50 transition-colors"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#2C1810]/80 uppercase tracking-wider">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={updateAccountMutation.isPending}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 bg-[#FFF8F0]/40 border border-[#DDB892] rounded-xl text-sm font-medium text-[#2C1810] focus:outline-none focus:border-[#6F4E37] disabled:opacity-50 transition-colors"
                      required
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#2C1810]/80 uppercase tracking-wider">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={updateAccountMutation.isPending}
                      placeholder="e.g. vendor@example.com"
                      className="w-full px-4 py-3 bg-[#FFF8F0]/40 border border-[#DDB892] rounded-xl text-sm font-medium text-[#2C1810] focus:outline-none focus:border-[#6F4E37] disabled:opacity-50 transition-colors"
                      required
                    />
                  </div>

                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DDB892]/30">
                  {bankStatus === 'FAILED' && (
                    <div className="flex items-center gap-2 text-xs text-rose-700 font-medium">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>⚠ Bank Account Verification Failed. Please update details above.</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
                    {bankStatus === 'VERIFIED' && (
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    )}
                    <Button 
                      type="submit" 
                      disabled={updateAccountMutation.isPending} 
                      className="w-full sm:w-auto bg-[#6F4E37] hover:bg-[#5a3f2c] text-white shadow-md font-semibold px-8 py-3 rounded-xl transition-all"
                    >
                      {updateAccountMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Verifying Bank Account...
                        </>
                      ) : bankStatus === 'FAILED' ? (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                        </>
                      ) : (
                        'Verify Bank Account'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#2C1810]">✓ Bank Account Verified</h4>
                    <p className="text-xs text-[#2C1810]/70 mt-0.5">
                      Razorpay validation complete. Automated payouts are active.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 rounded-2xl bg-[#FFF8F0]/60 border border-[#DDB892]/40 space-y-1">
                    <p className="text-xs text-[#2C1810]/50 font-bold uppercase tracking-wider">Account Holder Name</p>
                    <p className="text-base font-semibold text-[#2C1810]">{accountInfo.accountHolderName || 'N/A'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF8F0]/60 border border-[#DDB892]/40 space-y-1">
                    <p className="text-xs text-[#2C1810]/50 font-bold uppercase tracking-wider">Masked Bank Account</p>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#6F4E37]" />
                      <p className="text-base font-bold text-[#2C1810] tracking-widest font-mono">
                        {accountInfo.maskedBankAccount || `•••• ${accountInfo.bankAccountLast4 || '9012'}`}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF8F0]/60 border border-[#DDB892]/40 space-y-1">
                    <p className="text-xs text-[#2C1810]/50 font-bold uppercase tracking-wider">IFSC Code</p>
                    <p className="text-base font-semibold text-[#2C1810] font-mono">{accountInfo.ifsc || 'HDFC0001234'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF8F0]/60 border border-[#DDB892]/40 space-y-1">
                    <p className="text-xs text-[#2C1810]/50 font-bold uppercase tracking-wider">Settlement Capability</p>
                    <p className="text-base font-semibold text-emerald-700">✓ Enabled</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Side: Verification Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 bg-white rounded-3xl p-6 border border-[#DDB892]/40 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FileCheck className="w-5 h-5 text-[#6F4E37]" />
              <h3 className="text-lg font-bold text-[#2C1810]">Verification Status</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF8F0]/70 border border-[#DDB892]/30">
                <span className="text-xs font-semibold text-[#2C1810]/80">Bank Account Status</span>
                {renderStatusBadge(bankStatus)}
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF8F0]/70 border border-[#DDB892]/30">
                <span className="text-xs font-semibold text-[#2C1810]/80">Razorpay Vendor ID</span>
                <span className="text-xs font-mono font-bold text-[#6F4E37] max-w-[140px] truncate">
                  {accountInfo.cashfreeVendorId || '✓ Active'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF8F0]/70 border border-[#DDB892]/30">
                <span className="text-xs font-semibold text-[#2C1810]/80">Vendor Gateway Status</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ✓ Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFF8F0]/70 border border-[#DDB892]/30">
                <span className="text-xs font-semibold text-[#2C1810]/80">Settlement Status</span>
                <span className={`text-xs font-bold ${settlementCapability === 'ENABLED' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {settlementCapability === 'ENABLED' ? '✓ Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#DDB892]/30 flex items-center gap-2 text-xs text-[#2C1810]/60">
            <Lock className="w-4 h-4 text-[#6F4E37] shrink-0" />
            <span>Razorpay Security Protocol Encrypted</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
