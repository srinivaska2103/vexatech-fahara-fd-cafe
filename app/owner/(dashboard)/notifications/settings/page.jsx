'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useNotificationPreferences, useNotificationStats, useNotifications } from '@/hooks/notification';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { NotificationStats } from '@/components/notifications/NotificationStats';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, SlidersHorizontal, FileText, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationSettingsPage() {
  const router = useRouter();
  
  const { data: preferencesData, isLoading: loadingPrefs } = useNotificationPreferences();
  const { data: statsData, isLoading: loadingStats } = useNotificationStats();
  const { data: notificationsData } = useNotifications();

  const notificationsList = notificationsData?.data || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Modern Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <button 
            onClick={() => router.push('/owner/notifications')}
            className="w-10 h-10 rounded-2xl bg-white border border-[#DDB892]/60 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center shadow-2xs transition-all shrink-0"
            title="Back to Notifications"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">Notification Settings</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-extrabold">
                PREFERENCES
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-0.5">
              Manage how and when you receive venue alerts across Email, WhatsApp, and Dashboard.
            </p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="flex items-center gap-2.5 z-10">
          <Button 
            onClick={() => router.push('/owner/notifications/templates')}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Message Templates</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        
        {/* Stats Section */}
        <section className="space-y-3">
          <h2 className="text-xs font-extrabold text-text/50 uppercase tracking-widest px-1">
            Communication Overview (This Month)
          </h2>
          {loadingStats ? (
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-border/40 animate-pulse" />)}
             </div>
          ) : (
             <NotificationStats stats={statsData?.data} notifications={notificationsList} />
          )}
        </section>

        {/* Preferences Section */}
        <section className="bg-white p-5 sm:p-7 rounded-3xl border border-border/60 shadow-xs">
          {loadingPrefs ? (
             <div className="space-y-6 animate-pulse">
               <div>
                 <div className="h-5 w-36 bg-surface rounded mb-4" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[1,2,3,4].map(i => <div key={i} className="h-24 bg-surface/50 rounded-2xl" />)}
                 </div>
               </div>
               <div>
                 <div className="h-5 w-36 bg-surface rounded mb-4" />
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   {[1,2,3].map(i => <div key={i} className="h-24 bg-surface/50 rounded-2xl" />)}
                 </div>
               </div>
             </div>
          ) : (
             <NotificationPreferences initialData={preferencesData?.data} />
          )}
        </section>

      </motion.div>
    </div>
  );
}
