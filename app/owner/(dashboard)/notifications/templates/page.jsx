'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotificationTemplates } from '@/hooks/notification';
import { EmailTemplatePreview } from '@/components/notifications/EmailTemplatePreview';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Mail, 
  Send, 
  Search, 
  CheckCircle2, 
  CalendarCheck, 
  CreditCard, 
  Star, 
  Sparkles,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Rich pre-built email templates for cafe venue owners
const DEFAULT_EMAIL_TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'Booking Confirmation',
    category: 'Bookings',
    subject: 'Table Reservation Confirmed - {{cafe_name}} | Ref: #{{booking_id}}',
    button_text: 'View Reservation Details',
    content: `Dear {{customer_name}},\n\nYour table reservation at {{cafe_name}} has been confirmed successfully!\n\n• Reservation Date: {{booking_date}}\n• Time Slot: {{booking_time}}\n• Party Size: {{party_size}} Guests\n• Special Requests: {{special_request}}\n\nPlease arrive 10 minutes prior to your reserved slot. If you need to modify or cancel your booking, click the button below.`
  },
  {
    id: 'tpl-2',
    name: 'Payment Receipt & Payout Invoice',
    category: 'Payments',
    subject: 'Payment Receipt #{{invoice_id}} - Fahara Venue Partner',
    button_text: 'Download PDF Invoice',
    content: `Dear {{customer_name}},\n\nThank you for dining with us! We have received your payment of {{amount}} for reservation #{{booking_id}}.\n\n• Payment Status: SUCCESSFUL (Razorpay Payout)\n• Transaction ID: {{transaction_id}}\n• Date & Time: {{payment_date}}\n\nA detailed breakdown invoice is attached for your records.`
  },
  {
    id: 'tpl-3',
    name: 'Customer Feedback & Review Request',
    category: 'Reviews',
    subject: 'How was your experience at {{cafe_name}}?',
    button_text: 'Share Dining Review ★★★★★',
    content: `Hi {{customer_name}},\n\nThank you for dining at {{cafe_name}} today! We hope you enjoyed our food and ambience.\n\nWe are committed to delivering exceptional dining experiences. Could you take 30 seconds to share your review and star rating? Your feedback helps us serve you better!`
  },
  {
    id: 'tpl-4',
    name: 'Exclusive VIP Diner Discount',
    category: 'Promotions',
    subject: 'Special VIP Offer from {{cafe_name}}! 🎉',
    button_text: 'Claim VIP Discount Code',
    content: `Hello {{customer_name}},\n\nAs a valued guest at {{cafe_name}}, we are excited to offer you an exclusive 20% discount on your next weekend reservation!\n\nUse Promo Code: FAHARA20 at checkout.\nValid for parties of 2 or more guests.`
  },
  {
    id: 'tpl-5',
    name: 'Reservation Cancellation Alert',
    category: 'Bookings',
    subject: 'Booking Cancellation Notice - #{{booking_id}}',
    button_text: 'Rebook a Table',
    content: `Dear {{customer_name}},\n\nYour reservation #{{booking_id}} at {{cafe_name}} for {{booking_date}} has been cancelled as requested.\n\nIf you believe this was done in error or would like to pick a new date, please click below to rebook.`
  }
];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('tpl-1');

  const { data: apiTemplatesData, isLoading } = useNotificationTemplates('EMAIL');
  
  // Combine API templates with default templates
  const fetchedTemplates = apiTemplatesData?.data || [];
  const allTemplates = fetchedTemplates.length > 0 ? fetchedTemplates : DEFAULT_EMAIL_TEMPLATES;

  // Filter templates by category and search term
  const filteredTemplates = allTemplates.filter(t => {
    const matchesCategory = selectedCategory === 'ALL' || t.category?.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedTemplate = allTemplates.find(t => t.id === selectedTemplateId) || filteredTemplates[0] || allTemplates[0];

  const categories = [
    { id: 'ALL', label: 'All Templates' },
    { id: 'BOOKINGS', label: 'Bookings' },
    { id: 'PAYMENTS', label: 'Payments' },
    { id: 'REVIEWS', label: 'Reviews' },
    { id: 'PROMOTIONS', label: 'Promotions' },
  ];

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
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">Email Message Templates</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-extrabold">
                STUDIO
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-0.5">
              Inspect and customize automated email templates for booking confirmations, receipts, and customer feedback.
            </p>
          </div>
        </div>

        {/* Action Control */}
        <div className="flex items-center gap-2.5 z-10">
          <Button 
            onClick={() => router.push('/owner/notifications/compose')}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white font-extrabold text-xs shadow-xs hover:shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Compose Email Broadcast
          </Button>
        </div>
      </div>

      {/* Grid Layout: Template List + Live Interactive Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Search & Available Templates */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-border/60 shadow-xs overflow-hidden flex flex-col">
          
          <div className="p-4 border-b border-border/40 space-y-3 bg-surface/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2C1810] uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#6F4E37]" />
                <span>Available Templates ({filteredTemplates.length})</span>
              </div>
            </div>

            {/* Template Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
              <input 
                type="text" 
                placeholder="Search template name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border/60 bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 transition-all font-medium"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-0.5">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-colors shrink-0 ${
                    selectedCategory === cat.id 
                      ? 'bg-[#6F4E37] text-white shadow-2xs' 
                      : 'bg-white text-text/60 border border-border/40 hover:text-[#6F4E37]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template List Items */}
          <div className="divide-y divide-border/30 max-h-[500px] overflow-y-auto custom-scrollbar">
            {filteredTemplates.length === 0 ? (
              <div className="p-8 text-center text-text/50 text-xs">
                No email templates match your search filter.
              </div>
            ) : (
              filteredTemplates.map(template => {
                const isSelected = selectedTemplate?.id === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`w-full p-4 text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#FFF8F0] border-l-4 border-[#6F4E37]'
                        : 'hover:bg-surface/50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-[#6F4E37] text-white' : 'bg-surface text-text/60'
                        }`}>
                          {template.category || 'EMAIL'}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-[#2C1810] truncate">{template.name}</h4>
                      <p className="text-[10px] text-text/60 truncate">{template.subject}</p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#6F4E37] shrink-0 mt-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Area: Interactive Live Template Canvas */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTemplate?.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <EmailTemplatePreview template={selectedTemplate} />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
