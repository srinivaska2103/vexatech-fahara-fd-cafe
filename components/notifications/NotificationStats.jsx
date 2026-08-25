'use client';
import React from 'react';
import { BellRing, Mail, Smartphone, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationStats = ({ stats, notifications = [] }) => {
  // Strictly compute real live numbers from backend API stats or active notification records
  const totalAlerts = stats?.total ?? notifications.length ?? 0;
  const unreadAlerts = stats?.unread ?? notifications.filter(n => !n.is_read).length ?? 0;
  const emailsDelivered = stats?.emailsSent ?? stats?.emails_sent ?? notifications.filter(n => n.channel === 'EMAIL' || n.type === 'EMAIL').length ?? 0;
  const whatsappBroadcasts = stats?.whatsappSent ?? stats?.whatsapp_sent ?? notifications.filter(n => n.channel === 'WHATSAPP' || n.type === 'WHATSAPP').length ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-[#2C1810]">
      
      {/* Total Notifications */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-border/60 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-text/50 uppercase tracking-wider">Total Alerts</span>
          <div className="w-8 h-8 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center shrink-0">
            <BellRing className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl sm:text-2xl font-extrabold text-[#2C1810]">{totalAlerts}</p>
          <span className="text-[10px] font-semibold text-text/50">All received alerts</span>
        </div>
      </motion.div>

      {/* Unread Alerts */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-border/60 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-text/50 uppercase tracking-wider">Unread Alerts</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
            <CheckCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl sm:text-2xl font-extrabold text-amber-700">{unreadAlerts}</p>
          <span className="text-[10px] font-semibold text-amber-700/70">
            {unreadAlerts > 0 ? 'Needs action' : 'All caught up'}
          </span>
        </div>
      </motion.div>

      {/* Email Notifications */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-border/60 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-text/50 uppercase tracking-wider">Emails Delivered</span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl sm:text-2xl font-extrabold text-blue-800">{emailsDelivered}</p>
          <span className="text-[10px] font-semibold text-blue-700/70">Email channel alerts</span>
        </div>
      </motion.div>

      {/* WhatsApp Alerts */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-border/60 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-text/50 uppercase tracking-wider">WhatsApp Broadcasts</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-800">{whatsappBroadcasts}</p>
          <span className="text-[10px] font-semibold text-emerald-700/70">Mobile instant alerts</span>
        </div>
      </motion.div>

    </div>
  );
};
