'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Send, 
  Tag, 
  Calendar, 
  CreditCard, 
  Star, 
  Sparkles, 
  Heart, 
  Gift, 
  Megaphone, 
  PartyPopper, 
  Clock, 
  Search, 
  Eye, 
  Check, 
  Copy, 
  X, 
  Filter,
  BadgePercent,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Expanded & categorized email templates for cafe & event venue owners
const EMAIL_TEMPLATES = [
  {
    id: 'tpl-1',
    title: 'Weekend Special & Happy Hour Deal',
    category: 'Marketing',
    icon: Gift,
    color: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    subject: '🍹 Weekend Special Happy Hour & Gourmet Dining Deal at {{cafe_name}}!',
    content: 'Hello {{customer_name}},\n\nJoin us this weekend for an exclusive Happy Hour & Gourmet Dining Deal at {{cafe_name}}!\n\nEnjoy complimentary signature appetizers, live acoustic music, and special discounts on our handcrafted beverages.\n\nBring your friends and family to experience top-tier dining and ambience. Reserve your table early to guarantee prime seating!\n\nSee you soon,\n{{cafe_name}} Team',
  },
  {
    id: 'tpl-2',
    title: 'Promotional Offer & VIP Discount',
    category: 'Offers',
    icon: Tag,
    color: 'from-rose-500 to-pink-600',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    subject: '🔥 Exclusive VIP Offer & Discount from {{cafe_name}}!',
    content: 'Hello {{customer_name}},\n\nAs a valued guest at {{cafe_name}}, we are excited to offer you an exclusive 20% discount on your next weekend reservation!\n\nUse Promo Code: FAHARA20 at checkout. Valid for parties of 2 or more guests.\n\nDon\'t miss out—book your table today!\n\nWarm regards,\n{{cafe_name}} Team',
  },
  {
    id: 'tpl-3',
    title: 'New Service & Venue Announcement',
    category: 'Announcements',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    subject: '✨ Exciting New Menu Items & Special Offerings Available at {{cafe_name}}!',
    content: 'Hello {{customer_name}},\n\nWe are excited to announce brand new chef special dishes, artisan coffee blends, and private dining setups now available at {{cafe_name}}!\n\nWhether you are planning a casual coffee meetup or a celebration, our new menu items promise a memorable experience.\n\nReserve your table today and taste the difference!\n\nCheers,\n{{cafe_name}}',
  },
  {
    id: 'tpl-4',
    title: 'Customer Appreciation & Feedback',
    category: 'Follow Up',
    icon: Heart,
    color: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    subject: 'Thank you for dining at {{cafe_name}}! ❤️',
    content: 'Dear {{customer_name}},\n\nThank you so much for celebrating your recent meal with {{cafe_name}}! It was our absolute pleasure hosting you and your guests.\n\nWe would love to hear about your experience! Please take a quick moment to leave us a review or reply with any feedback.\n\nWe look forward to welcoming you back soon!\n\nWarm wishes,\n{{cafe_name}} Team',
  },
  {
    id: 'tpl-5',
    title: 'Private Event & Birthday Party Host',
    category: 'Events',
    icon: PartyPopper,
    color: 'from-blue-500 to-cyan-600',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    subject: '🎉 Host Your Next Special Event or Celebration at {{cafe_name}}!',
    content: 'Dear {{customer_name}},\n\nLooking for the perfect venue for your upcoming birthday, corporate dinner, or family gathering?\n\n{{cafe_name}} offers customized catering packages, private hall setups, and dedicated event coordination to make your occasion unforgettable.\n\nContact our event team today or reserve your date early!\n\nBest regards,\n{{cafe_name}} Event Team',
  },
  {
    id: 'tpl-6',
    title: 'Seasonal Festival & Holiday Banquet',
    category: 'Marketing',
    icon: Megaphone,
    color: 'from-violet-500 to-fuchsia-600',
    badgeBg: 'bg-violet-50 text-violet-800 border-violet-200',
    subject: '🎄 Festive Holiday Feast & Season Celebrations at {{cafe_name}}!',
    content: 'Hello {{customer_name}},\n\nThe festive season is here! Celebrate with our exclusive multi-course holiday banquet menu at {{cafe_name}}.\n\nEnjoy seasonal delights, craft mocktails, and cozy ambiance designed for group dining.\n\nSlots are filling fast! Secure your holiday table now.\n\nWarmest wishes,\n{{cafe_name}} Team',
  },
  {
    id: 'tpl-7',
    title: 'Loyalty Reward & VIP Perks Invitation',
    category: 'Offers',
    icon: BadgePercent,
    color: 'from-amber-600 to-yellow-500',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    subject: '⭐ You\'ve Earned VIP Loyalty Rewards at {{cafe_name}}!',
    content: 'Hi {{customer_name}},\n\nThank you for being one of our most frequent guests! As a token of our appreciation, enjoy a complimentary dessert or beverage on your next visit.\n\nShow this email to your server to claim your reward!\n\nSee you soon,\n{{cafe_name}} Team',
  },
  {
    id: 'tpl-8',
    title: 'Upcoming Reservation Reminder',
    category: 'Follow Up',
    icon: Clock,
    color: 'from-sky-500 to-blue-600',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    subject: '🔔 Friendly Reminder: Your Upcoming Table Reservation at {{cafe_name}}',
    content: 'Hi {{customer_name}},\n\nThis is a quick reminder for your upcoming reservation at {{cafe_name}}.\n\nIf you need to modify your guest count or time slot, please notify us in advance. We look forward to providing you an exceptional dining experience!\n\nWarm regards,\n{{cafe_name}} Team',
  },
];

const CATEGORIES = ['All', 'Marketing', 'Offers', 'Announcements', 'Events', 'Follow Up'];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filteredTemplates = EMAIL_TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'All' || tmpl.category === selectedCategory;
    const matchesSearch = tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template) => {
    const params = new URLSearchParams();
    params.set('subject', template.subject);
    params.set('content', template.content);
    router.push(`/owner/notifications/compose?${params.toString()}`);
  };

  const handleCopySubject = (template) => {
    navigator.clipboard.writeText(template.subject);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button 
            type="button"
            onClick={() => router.push('/owner/notifications/compose')}
            className="w-10 h-10 rounded-2xl bg-white border border-[#DDB892]/60 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center shadow-2xs transition-all shrink-0 cursor-pointer"
            title="Back to Compose"
            suppressHydrationWarning
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">Email Broadcast Templates</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-black uppercase">
                {EMAIL_TEMPLATES.length} TEMPLATES
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
              Choose a pre-designed email template to send marketing campaigns and announcements to customers.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Category Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-[#DDB892]/60 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F4E37]" />
          <input
            type="text"
            placeholder="Search templates by title, keyword, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs font-bold rounded-2xl border border-[#DDB892]/80 bg-[#FFF8F0] focus:bg-[#FFF5EA] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 text-[#2C1810] placeholder:text-stone-400 transition-all shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-9 px-3.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#6F4E37] text-white shadow-xs'
                    : 'bg-[#FFF8F0] hover:bg-[#FFF5EA] text-[#6F4E37] border border-[#DDB892]/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Responsive Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredTemplates.map((tmpl) => {
          const Icon = tmpl.icon;
          return (
            <motion.div
              key={tmpl.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ y: -3 }}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-[#6F4E37]/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tmpl.color} text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">
                        {tmpl.title}
                      </h3>
                      <span className={`text-[10px] font-black border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${tmpl.badgeBg}`}>
                        {tmpl.category}
                      </span>
                    </div>
                  </div>

                  {/* Quick Copy Action */}
                  <button
                    type="button"
                    onClick={() => handleCopySubject(tmpl)}
                    className="p-2 rounded-xl text-stone-400 hover:text-[#6F4E37] hover:bg-[#FFF5EA] transition-colors cursor-pointer shrink-0"
                    title="Copy Subject Text"
                  >
                    {copiedId === tmpl.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Email Content Preview Snippet */}
                <div className="p-3.5 bg-[#FFF8F0]/70 rounded-2xl border border-[#DDB892]/50 space-y-1.5">
                  <p className="text-xs font-black text-[#2C1810] truncate">
                    <span className="text-[#6F4E37] font-extrabold">Subject:</span> {tmpl.subject}
                  </p>
                  <p className="text-xs text-stone-600 font-medium line-clamp-3 leading-relaxed">
                    {tmpl.content}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(tmpl)}
                  className="py-2.5 px-3 bg-[#FFF8F0] hover:bg-[#FFF5EA] text-[#6F4E37] border border-[#DDB892]/80 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  suppressHydrationWarning
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>

                <button
                  type="button"
                  onClick={() => handleUseTemplate(tmpl)}
                  className="py-2.5 px-3 bg-gradient-to-r from-[#6F4E37] to-[#8C6D58] hover:from-[#5D3F2B] hover:to-[#6F4E37] text-white text-xs font-extrabold rounded-2xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  suppressHydrationWarning
                >
                  <Send className="w-3.5 h-3.5" /> Use Template
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty Search State */}
      {filteredTemplates.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#2C1810]">No Matching Templates Found</h3>
          <p className="text-xs text-stone-500 font-medium max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-[#6F4E37] text-white text-xs font-bold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* 4. Interactive Full Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-[#DDB892] shadow-2xl relative overflow-hidden text-[#2C1810]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${previewTemplate.color} text-white flex items-center justify-center shadow-xs`}>
                    <previewTemplate.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#2C1810]">{previewTemplate.title}</h3>
                    <span className="text-[10px] font-black text-[#6F4E37]">{previewTemplate.category} Template</span>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Email Content Box */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-stone-400 tracking-wider">Email Subject</label>
                  <div className="mt-1 p-3 bg-[#FFF8F0] rounded-xl border border-[#DDB892]/60 text-xs font-extrabold text-[#2C1810]">
                    {previewTemplate.subject}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-stone-400 tracking-wider">Message Body</label>
                  <div className="mt-1 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs font-medium leading-relaxed whitespace-pre-line text-stone-700 max-h-60 overflow-y-auto custom-scrollbar">
                    {previewTemplate.content}
                  </div>
                </div>
              </div>

              {/* Variable tags footnote */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Placeholders like <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold font-mono text-[10px]">{`{{customer_name}}`}</code> will auto-fill per recipient.</span>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold rounded-xl shadow-xs flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Use This Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
