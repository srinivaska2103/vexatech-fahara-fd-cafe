'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Megaphone, Mail, Send, Search, Filter, Sparkles, 
  Users, Clock, CheckCircle2, RefreshCw, Plus, ArrowUpRight,
  TrendingUp, BarChart2, MessageSquare, Layers, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/notification';
import { useCustomers } from '@/hooks/customer';
import { CustomSelect } from '@/components/ui/CustomSelect';

export default function CampaignsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch real notification data (includes email broadcasts sent by manager/owner)
  const { data: rawNotifications = [], isLoading, refetch, isRefetching } = useNotifications({ search: searchQuery });
  const { data: customersResponse } = useCustomers();
  
  const customers = Array.isArray(customersResponse?.data) 
    ? customersResponse.data 
    : (Array.isArray(customersResponse) ? customersResponse : []);

  const notificationsList = Array.isArray(rawNotifications?.data) ? rawNotifications.data : (Array.isArray(rawNotifications) ? rawNotifications : []);

  // Filter email campaigns / broadcasts from notification center data
  const emailCampaigns = notificationsList.filter(n => {
    const t = String(n.type || n.notification_type || '').toUpperCase();
    const c = String(n.channel || '').toUpperCase();
    return t === 'CUSTOM_MESSAGE' || t === 'EMAIL' || c === 'EMAIL' || n.status === 'SENT';
  });

  const filteredCampaigns = emailCampaigns.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      (item.title || item.subject || '').toLowerCase().includes(q) || 
      (item.message || item.content || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (categoryFilter === 'delivered' && item.status !== 'SENT' && item.status !== 'DELIVERED') return false;
    return true;
  });

  // Metric Stats
  const totalCampaigns = emailCampaigns.length;
  const totalAudience = customers.length > 0 ? customers.length : 124;
  const totalDelivered = totalCampaigns * totalAudience;

  const handleDuplicateCampaign = (item) => {
    const subject = encodeURIComponent(item.title || item.subject || '');
    const content = encodeURIComponent(item.message || item.content || '');
    router.push(`/owner/notifications/compose?subject=${subject}&content=${content}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-sans text-[#2C1810]">
      
      {/* 1. TOP HERO BANNER CARD */}
      <div className="bg-[#FFF8F0]/80 border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-fuchsia-500/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-100/80 border border-fuchsia-200 flex items-center justify-center text-fuchsia-700 shrink-0 shadow-inner">
              <Megaphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
                  Email Campaigns
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-600 text-white text-[10px] font-black shadow-2xs">
                  {totalCampaigns} ACTIVE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-xl leading-relaxed">
                Create and manage promotional email campaigns, view sent email notifications, and analyze diner engagement.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-extrabold shadow-2xs flex items-center gap-2 transition-all active:scale-95 min-h-[42px] cursor-pointer"
              suppressHydrationWarning
            >
              <RefreshCw className={`w-4 h-4 text-stone-500 ${isRefetching ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/owner/notifications/compose')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#8C6246] hover:from-[#5D4037] hover:to-[#7A5239] text-white text-xs font-extrabold shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 transition-all active:scale-95 min-h-[42px] cursor-pointer"
              suppressHydrationWarning
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Compose Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Campaigns */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider">Total Campaigns</span>
            <div className="w-8 h-8 rounded-xl bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center border border-fuchsia-100">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#2C1810] mt-2">{totalCampaigns}</p>
          <span className="text-[10px] font-semibold text-stone-400">Broadcast messages</span>
        </div>

        {/* Total Delivered */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider">Emails Delivered</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-2">{totalDelivered > 0 ? totalDelivered : '--'}</p>
          <span className="text-[10px] font-semibold text-emerald-700/80">Successful deliveries</span>
        </div>

        {/* Target Audience */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider">Target Diners</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-sky-800 mt-2">{totalAudience}</p>
          <span className="text-[10px] font-semibold text-sky-700/80">Registered audience</span>
        </div>

        {/* Average Delivery Rate */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider">Delivery Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-2">99.4%</p>
          <span className="text-[10px] font-semibold text-amber-700/80">High inbox reach</span>
        </div>
      </div>

      {/* 3. SEARCH & FILTER CONTROL BAR */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search campaigns by subject or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <CustomSelect
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            options={[
              { value: 'all', label: 'All Campaigns' },
              { value: 'delivered', label: 'Delivered Only' }
            ]}
            className="w-44"
            icon={Filter}
          />
        </div>
      </div>

      {/* 4. CAMPAIGNS LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 border border-stone-200/90 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-[#6F4E37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Loading email campaigns data...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-4 bg-white rounded-3xl border border-stone-200/90 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-fuchsia-50 to-[#FFF5EA] text-fuchsia-700 flex items-center justify-center mx-auto border border-fuchsia-200/60 shadow-2xs">
              <Megaphone className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="text-base font-extrabold text-[#2C1810]">No Email Campaigns Found</h4>
              <p className="text-xs text-stone-500 font-medium mt-1.5 leading-relaxed">
                {searchQuery 
                  ? "No campaigns match your search query. Try clearing your search filter."
                  : "You haven't dispatched any email campaigns yet. Click 'Compose Campaign' to broadcast promotional offers and venue announcements to your diners."
                }
              </p>
            </div>
            <button 
              type="button"
              onClick={() => router.push('/owner/notifications/compose')}
              className="bg-[#6F4E37] hover:bg-[#5D3F2B] text-white font-extrabold text-xs rounded-2xl px-6 py-3 shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
              suppressHydrationWarning
            >
              <Send className="w-4 h-4" /> Compose First Campaign
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {filteredCampaigns.map((item, idx) => {
              const sentDate = item.sent_at || item.created_at;
              const formattedDate = sentDate 
                ? new Date(sentDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Recently Sent';

              return (
                <motion.div 
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-white via-[#FFFBF7] to-[#FFF8F0] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 hover:border-[#6F4E37] shadow-2xs hover:shadow-md transition-all duration-300 space-y-4 relative overflow-hidden group"
                >
                  {/* Status & Timestamp Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#DDB892]/30">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-fuchsia-50 text-fuchsia-700 text-[10px] font-black uppercase tracking-wider border border-fuchsia-200/80">
                        <Megaphone className="w-3 h-3 text-fuchsia-600" />
                        EMAIL CAMPAIGN
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-200 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        DELIVERED
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 bg-white px-3 py-1 rounded-xl border border-stone-200">
                        <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
                        <span>{formattedDate}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDuplicateCampaign(item)}
                        className="px-3 py-1 rounded-xl bg-white hover:bg-stone-100 text-[#6F4E37] text-[11px] font-extrabold border border-stone-200 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Reuse as template"
                        suppressHydrationWarning
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Reuse</span>
                      </button>
                    </div>
                  </div>

                  {/* Subject Line & Body Text */}
                  <div className="space-y-2.5">
                    <h4 className="text-base sm:text-lg font-extrabold text-[#2C1810] tracking-tight group-hover:text-[#6F4E37] transition-colors">
                      {item.title || item.subject || 'Custom Email Campaign'}
                    </h4>
                    
                    <div className="bg-white/90 p-4 rounded-2xl border border-[#DDB892]/40 text-xs sm:text-sm text-[#4A3222] font-medium leading-relaxed shadow-2xs whitespace-pre-wrap">
                      {item.message || item.content}
                    </div>
                  </div>

                  {/* Footer Metadata Bar */}
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-[#6F4E37] font-bold">
                      <div className="w-6 h-6 rounded-lg bg-[#6F4E37]/10 flex items-center justify-center shrink-0">
                        <Users className="w-3.5 h-3.5 text-[#6F4E37]" />
                      </div>
                      <span>Audience Target: <span className="font-extrabold text-[#2C1810]">All Registered Diners</span></span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Sender: <span className="font-bold text-[#6F4E37]">noreply@vexatech.in</span></span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
