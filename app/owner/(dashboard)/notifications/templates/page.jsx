'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Tag, Calendar, CreditCard, Star, Sparkles, Heart, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

// Pre-built email templates for cafe venue owners (Content Preserved)
const EMAIL_TEMPLATES = [
  {
    id: 'tpl-1',
    title: 'Weekend Special & Happy Hour Deal',
    category: 'Marketing',
    icon: Gift,
    color: 'from-amber-500 to-orange-600',
    subject: '🍹 Weekend Special Happy Hour & Gourmet Dining Deal at {{cafe_name}}!',
    content: 'Hello {{customer_name}},\n\nJoin us this weekend for an exclusive Happy Hour & Gourmet Dining Deal at {{cafe_name}}!\n\nEnjoy complimentary signature appetizers, live acoustic music, and special discounts on our handcrafted beverages.\n\nBring your friends and family to experience top-tier dining and ambience. Reserve your table early to guarantee prime seating!\n\nSee you soon,\n{{cafe_name}} Team',
  },
  {
    id: 'tpl-2',
    title: 'Promotional Offer & Discount',
    category: 'Offers',
    icon: Tag,
    color: 'from-rose-500 to-pink-600',
    subject: '🔥 Exclusive VIP Offer & Discount from {{cafe_name}}!',
    content: 'Hello {{customer_name}},\n\nAs a valued guest at {{cafe_name}}, we are excited to offer you an exclusive 20% discount on your next weekend reservation!\n\nUse Promo Code: FAHARA20 at checkout. Valid for parties of 2 or more guests.\n\nDon\'t miss out—book your table today!\n\nWarm regards,\n{{cafe_name}} Team',
  },
  {
    id: 'tpl-3',
    title: 'New Service & Venue Announcement',
    category: 'Announcements',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600',
    subject: '✨ Exciting New Menu Items & Special Offerings Available at {{cafe_name}}!',
    content: 'Hello {{customer_name}},\n\nWe are excited to announce brand new chef special dishes, artisan coffee blends, and private dining setups now available at {{cafe_name}}!\n\nWhether you are planning a casual coffee meetup or a celebration, our new menu items promise a memorable experience.\n\nReserve your table today and taste the difference!\n\nCheers,\n{{cafe_name}}',
  },
  {
    id: 'tpl-4',
    title: 'Customer Appreciation & Feedback',
    category: 'Follow Up',
    icon: Heart,
    color: 'from-emerald-500 to-teal-600',
    subject: 'Thank you for dining at {{cafe_name}}! ❤️',
    content: 'Dear {{customer_name}},\n\nThank you so much for celebrating your recent meal with {{cafe_name}}! It was our absolute pleasure hosting you and your guests.\n\nWe would love to hear about your experience! Please take a quick moment to leave us a review or reply with any feedback.\n\nWe look forward to welcoming you back soon!\n\nWarm wishes,\n{{cafe_name}} Team',
  },
];

export default function TemplatesPage() {
  const router = useRouter();

  const handleSelectTemplate = (template) => {
    const params = new URLSearchParams();
    params.set('subject', template.subject);
    params.set('content', template.content);
    router.push(`/owner/notifications/compose?${params.toString()}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs flex items-center justify-between gap-4">
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
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">Email Message Templates</h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
              Select a pre-built email template to quickly populate your email broadcast content.
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid (2x2 Card Layout matching Event Manager) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {EMAIL_TEMPLATES.map((tmpl) => {
          const Icon = tmpl.icon;
          return (
            <motion.div
              key={tmpl.id}
              whileHover={{ y: -2 }}
              className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${tmpl.color} text-white flex items-center justify-center shadow-xs shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">{tmpl.title}</h3>
                      <span className="text-[10px] font-black text-[#6F4E37] bg-[#6F4E37]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {tmpl.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200/70 space-y-1.5">
                  <p className="text-xs font-black text-[#2C1810] truncate">Subject: {tmpl.subject}</p>
                  <p className="text-xs text-stone-500 font-medium line-clamp-3 leading-relaxed">{tmpl.content}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTemplate(tmpl)}
                className="w-full py-3 px-4 bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                suppressHydrationWarning
              >
                <Send className="w-3.5 h-3.5" /> Use This Template
              </button>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
