'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageContainer';
import { 
  Coffee, 
  Building2, 
  CreditCard, 
  CalendarCheck, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  BookOpen, 
  MessageCircle, 
  FileText, 
  ChevronDown,
  PlayCircle,
  Clock,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Zap,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SupportPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  const guideSections = [
    {
      id: 'setup',
      category: 'getting-started',
      badge: 'Cafe Setup',
      icon: Building2,
      title: 'Add & Complete Your Cafe Profile',
      description: 'Create your cafe profile so customers in your city can discover and book your venue space.',
      shortcutText: 'Manage Cafe Profile',
      shortcutPath: '/owner/cafes',
      steps: [
        'Navigate to Sidebar → Cafe Management and click Create Cafe or Edit.',
        'Enter Cafe Name, complete address, and precise Google Maps location coordinates.',
        'Set guest seating capacity (min/max limit) and hourly rate pricing.',
        'Upload high-resolution cover photos and gallery images showing seating ambience.',
        'Define operating hours, available amenities (WiFi, AC, Parking), and booking rules.'
      ],
      tip: 'Cafes with complete photos and accurate seating capacity receive 3x more customer reservations!'
    },
    {
      id: 'bank',
      category: 'finance',
      badge: 'Payout Setup',
      icon: ShieldCheck,
      title: 'Bank Account & Razorpay Verification',
      description: 'Link your bank account to receive automated payouts and settlements for completed bookings.',
      shortcutText: 'Setup Payment Account',
      shortcutPath: '/owner/payments/account',
      steps: [
        'Go to Sidebar → Finance → Payment Account.',
        'Enter Account Holder Name, Bank Account Number, and IFSC Code accurately.',
        'Submit details securely. Fahara transmits your details to Razorpay for bank verification.',
        'Monitor verification status: Verified (ready for payouts), Pending (in review), or Failed.',
        'If failed, verify your account details match official bank records and resubmit.'
      ],
      tip: 'Your full bank account number is always masked for privacy (e.g. XXXX-XXXX-XXXX-1234).'
    },
    {
      id: 'bookings',
      category: 'operations',
      badge: 'Reservations',
      icon: CalendarCheck,
      title: 'Managing Customer Bookings',
      description: 'Handle incoming reservations, communicate with customers, and mark visits as completed.',
      shortcutText: 'View Bookings',
      shortcutPath: '/owner/bookings',
      steps: [
        'Go to Sidebar → Bookings to view pending, confirmed, and completed reservations.',
        'Click any booking card to inspect guest details, requested date/time, and payment status.',
        'Confirm pending requests or cancel if your venue is unavailable.',
        'When customers finish their visit, click the checkmark button to mark as Completed.',
        'Marking bookings as Completed unlocks eligible payouts for settlement.'
      ],
      tip: 'Always mark visits as Completed on the same day so payout processing starts immediately.'
    },
    {
      id: 'events',
      category: 'operations',
      badge: 'Event Packages',
      icon: Sparkles,
      title: 'Events & Special Occasions',
      description: 'Offer dedicated packages for birthdays, private parties, corporate meetings, and get-togethers.',
      shortcutText: 'Manage Events',
      shortcutPath: '/owner/events',
      steps: [
        'Go to Sidebar → Events and click Add New Event Offering.',
        'Set package title, total duration, guest limit, and price per package.',
        'List package inclusions (decorations, food vouchers, AV equipment, reserved seating).',
        'Enable or disable event offerings anytime based on seasonal availability.'
      ],
      tip: 'Event packages generate higher average booking revenue than regular hourly seating!'
    },
    {
      id: 'payments',
      category: 'finance',
      badge: 'Financials',
      icon: CreditCard,
      title: 'Payments, Settlements & Refunds',
      description: 'Track earnings, monitor settlement schedules, and handle customer refund logs.',
      shortcutText: 'View Financials',
      shortcutPath: '/owner/payments',
      steps: [
        'Sidebar → Finance → Payments: View all transaction logs and customer payment receipts.',
        'Sidebar → Finance → Settlements: Track eligible funds and payout processing dates.',
        'Payouts are transferred directly to your verified bank account 7 business days post-completion.',
        'Sidebar → Finance → Refunds: Review customer cancellation refund logs and platform fee splits.'
      ],
      tip: 'Download itemized monthly financial invoices directly from the Payments section for your accounting.'
    },
    {
      id: 'reviews',
      category: 'growth',
      badge: 'Reputation',
      icon: Star,
      title: 'Ratings, Reviews & Business Growth',
      description: 'Understand customer feedback and build your cafe reputation to attract repeat visitors.',
      shortcutText: 'View Reviews',
      shortcutPath: '/owner/reviews',
      steps: [
        'Go to Sidebar → Reviews to inspect customer ratings and written feedback.',
        'Respond professionally to customer reviews to build guest trust.',
        'Track your average rating on the Dashboard to measure guest satisfaction.',
        'Use Sidebar → System → Analytics to monitor revenue trends and peak booking hours.'
      ],
      tip: 'Cafes with ratings above 4.5 stars get featured on the Fahara homepage banner!'
    }
  ];

  const faqs = [
    { 
      q: "How do I start using the Fahara Owner Portal?", 
      a: "Simply follow our 9-step guided tour! Click the 'Start Guided Tour' button above to launch the interactive walkthrough directly on your screen.",
      cat: "getting-started"
    },
    { 
      q: "When do I receive my payouts?", 
      a: "Payouts are automatically scheduled 7 business days after a reservation is marked as 'Completed'. Funds are transferred directly to your verified bank account via Razorpay.",
      cat: "finance"
    },
    { 
      q: "Why is my bank account status showing 'Pending' or 'Failed'?", 
      a: "Bank verification is processed by Razorpay. Pending requests typically resolve within 24 hours. If failed, double-check that your Account Holder Name matches your bank passbook and that your IFSC code is correct.",
      cat: "finance"
    },
    { 
      q: "How do I mark a customer visit as completed?", 
      a: "Navigate to Sidebar → Bookings, locate the reservation card, and click the green checkmark button. This updates the status to Completed and initiates settlement.",
      cat: "operations"
    },
    { 
      q: "Can I block out specific dates or hours for private events?", 
      a: "Yes! Use the Calendar View in Sidebar → Bookings or adjust your operating hours in Sidebar → Cafe Management to block out specific dates.",
      cat: "operations"
    },
    { 
      q: "Where can I download monthly financial statements?", 
      a: "Go to Sidebar → Finance → Payments → Invoices to generate and download itemized monthly statements.",
      cat: "finance"
    }
  ];

  const contactMethods = [
    { 
      icon: MessageCircle, 
      title: 'WhatsApp Support', 
      desc: '+91 89460 29205', 
      action: 'Chat on WhatsApp', 
      color: 'bg-emerald-500 text-white', 
      href: 'https://wa.me/918946029205' 
    },
    { 
      icon: FileText, 
      title: 'Owner Support Email', 
      desc: 'vexatech.connect@gmail.com', 
      action: 'Email Support Desk', 
      color: 'bg-[#6F4E37] text-white', 
      href: 'mailto:vexatech.connect@gmail.com' 
    }
  ];

  const filteredGuides = guideSections.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || guide.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.cat === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 text-[#2C1810] animate-fade-in">
      
      {/* Page Title Header */}
      <PageHeader 
        title="Cafe Owner User Guide & Support" 
        description="Learn how to operate your venue, manage bookings, collect payouts, and grow your cafe business."
      />

      {/* Modern Interactive Tour Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#DDB892]/30"
      >
        {/* Glow Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/15 text-amber-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Onboarding
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              <Check className="w-3 h-3" /> 9 Step Tour
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            New to Fahara? Take the Interactive Guided Tour!
          </h2>

          <p className="text-white/90 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
            Our step-by-step guided tour spotlights every key feature—from creating your cafe profile and linking Razorpay bank accounts to handling bookings and receiving payouts.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('restart-owner-tour'))}
              className="bg-[#FFF8F0] hover:bg-white text-[#6F4E37] px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <PlayCircle className="w-5 h-5 text-[#6F4E37]" /> Start Guided Tour →
            </button>
          </div>
        </div>

        <BookOpen className="absolute -right-8 -bottom-8 w-60 h-60 text-white/10 pointer-events-none hidden sm:block" />
      </motion.div>

      {/* Modern Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-border/60 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides, topics, or FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border/60 bg-surface/30 text-xs font-medium focus:outline-none focus:border-[#6F4E37] transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'getting-started', label: 'Getting Started' },
            { id: 'finance', label: 'Bank & Settlements' },
            { id: 'operations', label: 'Bookings & Events' },
            { id: 'growth', label: 'Ratings & Reviews' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'bg-surface/50 text-text/70 hover:bg-surface hover:text-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: User Guides & FAQs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* User Guide Cards Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#2C1810]">Step-by-Step User Guides</h3>
            </div>
            <span className="text-xs font-semibold text-text/50">{filteredGuides.length} Guides Found</span>
          </div>

          {/* User Guide Cards List */}
          <div className="space-y-6">
            {filteredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-5 sm:p-7 border border-border/60 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] shrink-0 mt-0.5">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] border border-[#6F4E37]/20">
                            {guide.badge}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-extrabold text-[#2C1810] mt-1">{guide.title}</h4>
                        <p className="text-xs sm:text-sm text-text/70 mt-0.5">{guide.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(guide.shortcutPath)}
                      className="self-start sm:self-center py-2 px-3.5 rounded-xl bg-[#6F4E37]/10 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                    >
                      {guide.shortcutText} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Execution Steps */}
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6F4E37]">Step-by-Step Workflow:</p>
                    <div className="space-y-2">
                      {guide.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-text/80 bg-surface/20 p-2.5 rounded-2xl border border-border/40">
                          <span className="w-5 h-5 rounded-full bg-[#6F4E37] text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tip Box */}
                  {guide.tip && (
                    <div className="flex items-start gap-2.5 bg-[#FFF8F0] border border-[#DDB892]/60 p-3.5 rounded-2xl text-xs text-[#2C1810]">
                      <Zap className="w-4 h-4 text-[#6F4E37] shrink-0 mt-0.5" />
                      <span><strong>Pro Tip:</strong> {guide.tip}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Expandable FAQs Accordion Section */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-border/60 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-border/40 pb-4">
              <div className="p-2 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#2C1810]">Frequently Asked Questions</h3>
                <p className="text-xs text-text/60">Quick answers to common cafe owner questions</p>
              </div>
            </div>

            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-border/50 rounded-2xl overflow-hidden bg-surface/20 hover:bg-surface/40 transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#2C1810]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-[#6F4E37] shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 text-xs sm:text-sm text-text/70 leading-relaxed border-t border-border/30 pt-3 bg-white/60"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Sidebar Quick Actions & Support Desk */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          
          {/* Quick Action Card */}
          <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-[#6F4E37]" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#6F4E37]">Quick Tour Actions</h3>
            </div>

            <p className="text-xs text-text/70 leading-relaxed">
              Need a refresher on how the portal works? Launch the 9-step interactive guided overlay anytime.
            </p>
            
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('restart-owner-tour'))}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] hover:shadow-md text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <PlayCircle className="w-4 h-4" /> Restart Interactive Tour
            </button>
          </div>

          {/* Verified Payout Info Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
              <span>Verified Razorpay Payouts</span>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Payouts are automatically transferred 7 business days after marking reservations as Completed.
            </p>
            <button
              onClick={() => router.push('/owner/payments/account')}
              className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all text-center"
            >
              Check Bank Status →
            </button>
          </div>

          {/* Contact Methods */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-text/40 px-1">Direct Support Desk</h3>
            {contactMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="bg-white p-5 rounded-3xl border border-border/60 shadow-xs flex flex-col items-start gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${method.color} shadow-xs shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#2C1810]">{method.title}</h4>
                      <p className="text-[11px] text-text/60 mt-0.5">{method.desc}</p>
                    </div>
                  </div>
                  <a 
                    href={method.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-2.5 border-2 border-border/60 hover:border-[#6F4E37] text-text/80 hover:text-[#6F4E37] text-xs font-extrabold rounded-2xl transition-all text-center block"
                  >
                    {method.action}
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
