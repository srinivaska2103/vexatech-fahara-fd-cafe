'use client';
import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useCafe } from '@/hooks/cafe';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit2, 
  MapPin, 
  Users, 
  IndianRupee, 
  Star, 
  Map, 
  Image as ImageIcon, 
  Wifi, 
  Car, 
  Wind, 
  MonitorPlay, 
  Speaker, 
  Sun, 
  Coffee, 
  Baby, 
  Accessibility, 
  Dog, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Sparkles,
  Gift,
  Percent,
  Tag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { CafeStatusBadge } from '@/components/cafes/CafeStatusBadge';
import { MapPreview } from '@/components/maps/MapPreview';
import { BackButton } from '@/components/ui/BackButton';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

const AMENITIES_LIST = [
  { id: 'wifi', label: 'High-Speed WiFi', icon: Wifi },
  { id: 'parking', label: 'Free Parking', icon: Car },
  { id: 'ac', label: 'Air Conditioning', icon: Wind },
  { id: 'projector', label: 'Projector & Screen', icon: MonitorPlay },
  { id: 'sound', label: 'Sound System', icon: Speaker },
  { id: 'outdoor', label: 'Outdoor Seating', icon: Sun },
  { id: 'indoor', label: 'Indoor Seating', icon: Coffee },
  { id: 'kids', label: 'Kids Play Area', icon: Baby },
  { id: 'wheelchair', label: 'Wheelchair Access', icon: Accessibility },
  { id: 'pets', label: 'Pet Friendly', icon: Dog },
];

export default function CafeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { data: cafeData, isLoading, isPending } = useCafe(id);
  const cafe = cafeData?.data || cafeData;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'amenities' | 'hours' | 'gallery' | 'map'

  if (isLoading || isPending) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <LoadingSkeleton type="card" className="h-[240px] rounded-3xl" />
        <LoadingSkeleton type="list" className="h-[400px] rounded-3xl" />
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="p-12 text-center space-y-4 max-w-lg mx-auto bg-white rounded-3xl border border-border/60 shadow-xs mt-10">
        <MapPin className="w-12 h-12 text-[#6F4E37] opacity-40 mx-auto" />
        <h3 className="text-lg font-extrabold text-[#2C1810]">Venue Not Found</h3>
        <p className="text-xs text-text/60">The cafe venue you are looking for does not exist or has been removed.</p>
        <Link href="/owner/cafes">
          <Button className="bg-[#6F4E37] text-white font-extrabold text-xs rounded-xl px-6 py-2.5">
            Back to All Cafes
          </Button>
        </Link>
      </div>
    );
  }

  // Determine hero cover image
  let heroImage = cafe.cover_image;
  if (!heroImage && Array.isArray(cafe.gallery) && cafe.gallery.length > 0) {
    const firstImg = cafe.gallery[0];
    if (typeof firstImg === 'string') heroImage = firstImg;
    else if (firstImg?.url) heroImage = firstImg.url;
  }

  const galleryImages = Array.isArray(cafe.gallery) ? cafe.gallery.map(img => typeof img === 'string' ? img : img?.url || img?.file_url).filter(Boolean) : [];

  const discountsList = Array.isArray(cafe.discounts)
    ? cafe.discounts
    : (cafe.discounts && typeof cafe.discounts === 'object')
      ? Object.values(cafe.discounts).filter(Boolean)
      : [];

  const tabs = [
    { id: 'overview', label: 'Overview & Info', icon: Coffee },
    { id: 'discounts', label: 'Discounts & Offers', icon: Gift, count: discountsList.length },
    { id: 'amenities', label: 'Amenities', icon: CheckCircle2, count: cafe.amenities?.length || 0 },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon, count: galleryImages.length },
    { id: 'map', label: 'Location & Map', icon: Map },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Top Bar Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BackButton href="/owner/cafes" label="Back to Cafes" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">{cafe.name}</h1>
              <CafeStatusBadge status={cafe.status} />
            </div>
            <p className="text-xs text-text/60 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#6F4E37]" />
              <span>{cafe.address ? `${cafe.address}, ${cafe.city || ''} ${cafe.pincode || ''}` : (cafe.city || 'Address N/A')}</span>
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          <Link href={`/owner/bookings?cafe_id=${cafe.id}`}>
            <Button className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-1.5 transition-all">
              <Calendar className="w-4 h-4 text-white" />
              <span>View Bookings</span>
            </Button>
          </Link>

          <Link href={`/owner/cafes/${id}/edit`}>
            <Button className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-1.5 transition-all">
              <Edit2 className="w-4 h-4" />
              <span>Edit Details</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xs border border-[#DDB892]/60 bg-white group min-h-[260px] sm:min-h-[320px] flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          {heroImage ? (
            <img src={heroImage} alt={cafe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FFF8F0] via-[#FFF0E0] to-[#F5E6D3]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-extrabold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{cafe.averageRating || cafe.google_rating || '5.0'} Overall Rating</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">{cafe.name}</h2>
            <p className="text-white/80 text-xs sm:text-sm font-medium flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>{cafe.address ? `${cafe.address}, ${cafe.city}` : 'Venue Partner Listing'}</span>
            </p>
          </div>

          {/* Quick Metrics Bar Overlay */}
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-white/40 shadow-md text-[#2C1810]">
            <div className="px-3 border-r border-border/40">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-text/50">Hourly Rate</p>
              <p className="text-sm font-black text-[#6F4E37]">
                {Number(cafe.price_per_hour) > 0 ? (
                  <>₹{cafe.price_per_hour}<span className="text-[10px] font-normal text-text/50">/hr</span></>
                ) : (
                  '-'
                )}
              </p>
            </div>
            <div className="px-3">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-text/50">Max Capacity</p>
              <p className="text-sm font-black text-[#2C1810]">{cafe.maximum_persons || 'N/A'} Guests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header Navigation */}
      <div className="bg-white p-2 rounded-3xl border border-border/60 shadow-2xs flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer",
                isActive 
                  ? "bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white shadow-md" 
                  : "text-text/60 hover:text-[#6F4E37] hover:bg-surface/60"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-extrabold",
                  isActive ? "bg-white/20 text-white" : "bg-border/40 text-text/60"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid Layout: Main Tab Content (8 cols) + Right Sidebar Action Card (4 cols) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Tab Content Display (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* TAB 1: OVERVIEW & INFO */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* About Dining Space */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                      <div className="w-9 h-9 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#2C1810]">About the Dining Space</h3>
                        <p className="text-[11px] text-text/60">Venue description & dining experience details</p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#2C1810]/85 leading-relaxed whitespace-pre-wrap">
                      {cafe.description || 'No detailed description provided for this venue yet. Click "Edit Details" to add a comprehensive bio.'}
                    </p>
                  </div>

                  {/* Highlights Card */}
                  <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 rounded-3xl border border-[#DDB892]/60 shadow-2xs space-y-4">
                    <h4 className="text-xs font-extrabold text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#6F4E37]" /> Venue Highlights & Capacity Specs
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-white rounded-2xl border border-border/40 text-center">
                        <p className="text-[10px] text-text/50 font-bold uppercase">Max Capacity</p>
                        <p className="text-sm font-black text-[#2C1810] mt-0.5">{cafe.maximum_persons || 'N/A'} Guests</p>
                      </div>
                      <div className="p-3 bg-white rounded-2xl border border-border/40 text-center">
                        <p className="text-[10px] text-text/50 font-bold uppercase">Hourly Rate</p>
                        <p className="text-sm font-black text-[#6F4E37] mt-0.5">
                          {Number(cafe.price_per_hour) > 0 ? `₹${cafe.price_per_hour}/hr` : '-'}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-2xl border border-border/40 text-center">
                        <p className="text-[10px] text-text/50 font-bold uppercase">Location City</p>
                        <p className="text-sm font-black text-[#2C1810] mt-0.5 truncate">{cafe.city || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: DISCOUNTS & OFFERS */}
              {activeTab === 'discounts' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-extrabold">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#2C1810]">Active Promotional Discounts & Offers</h3>
                        <p className="text-[11px] text-text/60">Special discount offers enabled for venue customers</p>
                      </div>
                    </div>

                    <Link href={`/owner/cafes/${id}/edit`}>
                      <Button className="py-2 px-3.5 rounded-xl bg-[#6F4E37] text-white text-xs font-extrabold flex items-center gap-1.5">
                        <Edit2 className="w-3.5 h-3.5" />
                        Manage Discounts
                      </Button>
                    </Link>
                  </div>

                  {discountsList.length === 0 ? (
                    <div className="text-center py-10 space-y-3 bg-[#FFF8F0]/50 rounded-2xl border border-dashed border-[#DDB892]/60">
                      <Sparkles className="w-10 h-10 text-amber-500/50 mx-auto" />
                      <p className="text-xs font-bold text-[#2C1810]">No Promotional Discounts Configured</p>
                      <p className="text-[11px] text-text/50 max-w-sm mx-auto">
                        Boost your venue bookings by adding flat or percentage-based discount offers.
                      </p>
                      <Link href={`/owner/cafes/${id}/edit`}>
                        <Button className="bg-[#6F4E37] text-white font-extrabold text-xs rounded-xl px-4 py-2 mt-2">
                          + Add Discount Offers
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {discountsList.map((disc, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF5EA] border border-[#DDB892]/60 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 text-[10px] font-black uppercase">
                              Promotional Offer #{idx + 1}
                            </span>
                            <Sparkles className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-[#2C1810]">{disc.title || disc.name || 'Special Discount'}</h4>
                            <p className="text-lg font-black text-[#6F4E37] mt-1">
                              {disc.discountType === 'PERCENT' ? `${disc.amount || 0}% OFF` : `₹${disc.amount || 0} OFF`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: AMENITIES */}
              {activeTab === 'amenities' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-extrabold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">Available Venue Amenities</h3>
                      <p className="text-[11px] text-text/60">Features and dining facilities enabled for this venue</p>
                    </div>
                  </div>

                  {(!cafe.amenities || cafe.amenities.length === 0) ? (
                    <div className="text-center py-8 text-xs text-text/50">
                      No specific amenities listed yet. Click "Edit Details" to enable features like High-Speed WiFi, Parking, AC, and Sound System.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {AMENITIES_LIST.filter(a => cafe.amenities.includes(a.id)).map(({ id, label, icon: Icon }) => (
                        <div key={id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface/40 border border-border/50">
                          <div className="w-8 h-8 rounded-xl bg-white text-[#6F4E37] flex items-center justify-center shrink-0 shadow-2xs">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-[#2C1810]">{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BUSINESS HOURS */}
              {activeTab === 'hours' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">Weekly Operating Schedule</h3>
                      <p className="text-[11px] text-text/60">Venue opening & closing hours for diner bookings</p>
                    </div>
                  </div>

                  {(!cafe.cafe_business_hours || !Array.isArray(cafe.cafe_business_hours) || cafe.cafe_business_hours.length === 0) ? (
                    <div className="text-center py-8 text-xs text-text/50">
                      Business hours have not been configured yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-border/30">
                      {[...cafe.cafe_business_hours].sort((a, b) => {
                        const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                        return daysOrder.indexOf((a.day_of_week || '').toLowerCase()) - daysOrder.indexOf((b.day_of_week || '').toLowerCase());
                      }).map((hour, idx) => {
                        const formatTime = (timeStr) => {
                          if (!timeStr) return '';
                          
                          let hours = 0;
                          let minutes = 0;

                          if (typeof timeStr === 'string' && timeStr.includes('T')) {
                            const d = new Date(timeStr);
                            if (!isNaN(d.getTime())) {
                              hours = d.getUTCHours();
                              minutes = d.getUTCMinutes();
                            }
                          } else if (typeof timeStr === 'string' && timeStr.includes(':')) {
                            const timeOnly = timeStr.includes(' ') ? timeStr.split(' ')[0] : timeStr;
                            const parts = timeOnly.split(':');
                            hours = parseInt(parts[0], 10);
                            minutes = parseInt(parts[1], 10);
                          } else if (timeStr instanceof Date && !isNaN(timeStr.getTime())) {
                            hours = timeStr.getUTCHours();
                            minutes = timeStr.getUTCMinutes();
                          } else {
                            return String(timeStr);
                          }

                          if (isNaN(hours) || isNaN(minutes)) return String(timeStr);

                          const ampm = hours >= 12 ? 'PM' : 'AM';
                          const formattedHours = hours % 12 || 12;
                          const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                          return `${formattedHours}:${formattedMinutes} ${ampm}`;
                        };

                        return (
                          <div key={idx} className="flex items-center justify-between py-3">
                            <span className="text-xs font-bold text-[#2C1810] capitalize">{hour.day_of_week}</span>
                            {hour.is_closed ? (
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">Closed</span>
                            ) : (
                              <span className="text-xs font-semibold text-[#6F4E37] bg-[#6F4E37]/10 px-2.5 py-1 rounded-lg">
                                {formatTime(hour.open_time)} - {formatTime(hour.close_time)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PHOTO GALLERY */}
              {activeTab === 'gallery' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-extrabold">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#2C1810]">Venue Photo Gallery</h3>
                        <p className="text-[11px] text-text/60">{galleryImages.length} uploaded photo{galleryImages.length === 1 ? '' : 's'}</p>
                      </div>
                    </div>

                    <Link href={`/owner/cafes/${id}/edit`}>
                      <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold border-border/60 text-[#6F4E37] hover:bg-[#6F4E37]/10">
                        Upload Photos
                      </Button>
                    </Link>
                  </div>

                  {galleryImages.length === 0 ? (
                    <div className="text-center py-12 text-xs text-text/50">
                      No gallery photos uploaded yet. Add high quality photos of your seating areas, dishes, and ambience.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                      {galleryImages.map((src, idx) => (
                        <div key={idx} className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden shadow-2xs group border border-border/40">
                          <img src={src} alt={`${cafe.name} gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: LOCATION & MAP */}
              {activeTab === 'map' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-extrabold">
                      <Map className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">Location & Interactive Map</h3>
                      <p className="text-[11px] text-text/60">{cafe.address ? `${cafe.address}, ${cafe.city}` : 'GPS venue location'}</p>
                    </div>
                  </div>

                  <div className="h-[320px] rounded-2xl overflow-hidden shadow-inner border border-border/50">
                    <MapPreview 
                      latitude={cafe.latitude} 
                      longitude={cafe.longitude} 
                      address={`${cafe.address || ''}, ${cafe.city || ''}`}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Sidebar Action Card (4 columns) */}
        <div className="lg:col-span-4 space-y-4 sticky top-6">
          <div className="bg-white p-6 rounded-3xl border border-border/60 shadow-2xs space-y-4">
            <h4 className="text-xs font-extrabold text-[#2C1810] uppercase tracking-wider pb-2 border-b border-border/40 flex items-center justify-between">
              <span>Quick Venue Actions</span>
              <Sparkles className="w-4 h-4 text-[#6F4E37]" />
            </h4>

            <div className="space-y-2.5">
              <Link href={`/owner/cafes/${id}/edit`} className="block">
                <Button className="w-full justify-between py-3 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] hover:from-[#5c402d] hover:to-[#8c674b] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center">
                  <span className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Venue Profile</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href={`/owner/bookings?cafe_id=${cafe.id}`} className="block">
                <Button className="w-full justify-between py-3 px-4 rounded-2xl bg-white hover:bg-[#FFF8F0] border border-[#DDB892]/60 text-[#2C1810] text-xs font-extrabold shadow-2xs hover:shadow-xs transition-all flex items-center">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6F4E37]" />
                    <span>Manage Bookings</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#6F4E37]" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
