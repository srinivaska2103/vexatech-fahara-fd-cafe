'use client';
import React from 'react';
import { PasswordChangeForm } from '@/components/settings/PasswordChangeForm';
import { DangerZone } from '@/components/settings/DangerZone';
import { useChangePassword } from '@/hooks/settings';
import { ShieldCheck, Smartphone, Laptop, Sparkles, Lock, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecuritySettingsPage() {
  const passwordMutation = useChangePassword();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 text-[#252525]"
    >
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF5F5] to-[#FFF5F5] p-6 sm:p-8 rounded-3xl border border-[#EF5350]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E50914]/10 text-[#E50914] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACCOUNT SECURITY STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">
            Security & Authentication
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Update your owner password, monitor active browser sessions, and manage account protection protocols.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#EF5350]/60 text-[#E50914] flex items-center gap-2.5 text-xs font-extrabold shadow-2xs">
            <Lock className="w-5 h-5 text-[#E50914]" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Password Area */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/60 shadow-2xs">
           <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-border/40">
              <div className="w-12 h-12 bg-[#E50914]/10 text-[#E50914] rounded-2xl flex items-center justify-center font-bold shrink-0">
                 <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#252525]">Change Password</h3>
                <p className="text-xs text-text/60">Ensure your owner account uses a strong, unique password.</p>
              </div>
           </div>
           
           <PasswordChangeForm 
             onSubmit={(data) => passwordMutation.mutate(data)} 
             isPending={passwordMutation.isPending} 
           />
        </div>

        {/* Sessions Area */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-border/60 shadow-2xs flex flex-col justify-between">
           <div>
             <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-border/40">
               <div className="w-12 h-12 bg-[#E50914]/10 text-[#E50914] rounded-2xl flex items-center justify-center font-bold shrink-0">
                 <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="text-base font-extrabold text-[#252525]">Active Sessions</h3>
                 <p className="text-xs text-text/60">Devices currently logged into your owner dashboard.</p>
               </div>
             </div>
             
             <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-[#EF5350]/60 bg-[#FFF5F5]/60 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <Laptop className="w-5 h-5 text-[#E50914]" />
                      <div>
                        <p className="text-xs font-extrabold text-[#252525]">Windows PC • Chrome Browser</p>
                        <p className="text-[10px] text-emerald-700 font-bold">● Active Current Session</p>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-text/40" />
                      <div>
                        <p className="text-xs font-bold text-[#252525]">Mobile App • Safari</p>
                        <p className="text-[10px] text-text/50">Last active 2 hours ago</p>
                      </div>
                   </div>
                   <button className="text-xs font-extrabold text-rose-600 hover:underline">Revoke</button>
                </div>
             </div>
           </div>
           
           <button className="w-full mt-6 py-3 text-xs font-extrabold text-[#E50914] hover:bg-[#FFF5F5] rounded-2xl transition-all border border-[#EF5350]/60">
             Sign Out All Other Devices
           </button>
        </div>

      </div>

      <DangerZone />

    </motion.div>
  );
}
