'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cafeSchema } from '@/schemas/cafe.schema';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';
import { GalleryUploader } from './GalleryUploader';
import { BusinessHours } from './BusinessHours';
import { CafeAmenities } from './CafeAmenities';
import { MapPicker } from '../maps/MapPicker';
import { useAuthStore } from '@/store/auth.store';
import { 
  MapPin, 
  Info, 
  Tag, 
  Percent,
  Sparkles,
  Gift,
  Plus,
  Trash2,
  Zap,
  TrendingDown,
  Wifi, 
  Image as ImageIcon, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Store,
  ChevronDown,
  Check,
  Globe,
  FileText,
  EyeOff,
  Coffee,
  Users,
  Footprints,
  Phone,
  Mail,
  Layers,
  ExternalLink,
  ShieldCheck,
  XCircle,
  BadgePercent,
  PartyPopper,
  Package,
  Edit3,
  Calendar,
  DollarSign
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const defaultBusinessHours = {
  monday: { isOpen: true, open: '09:00', close: '21:00' },
  tuesday: { isOpen: true, open: '09:00', close: '21:00' },
  wednesday: { isOpen: true, open: '09:00', close: '21:00' },
  thursday: { isOpen: true, open: '09:00', close: '21:00' },
  friday: { isOpen: true, open: '09:00', close: '22:00' },
  saturday: { isOpen: true, open: '10:00', close: '23:00' },
  sunday: { isOpen: false, open: '', close: '' },
};

const EVENT_TYPES_OPTIONS = [
  { id: 'Birthday Party', label: 'Birthday Party' },
  { id: 'Anniversary & Couples', label: 'Anniversary & Couples' },
  { id: 'Corporate Meeting', label: 'Corporate Meeting' },
  { id: 'Wedding Reception', label: 'Wedding Reception' },
  { id: 'Private Dining Party', label: 'Private Dining Party' },
  { id: 'Workshop & Masterclass', label: 'Workshop & Masterclass' },
  { id: 'Live Music & Concert', label: 'Live Music & Concert' },
  { id: 'Photoshoot', label: 'Photoshoot' },
  { id: 'Baby Shower', label: 'Baby Shower' },
  { id: 'Engagement', label: 'Engagement' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Publish (Active)', desc: 'Live & visible to customers for walk-in discovery', badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30', icon: Globe },
  { value: 'DRAFT', label: 'Save as Draft', desc: 'Hidden in draft mode while editing', badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-500/30', icon: FileText },
  { value: 'INACTIVE', label: 'Hidden (Inactive)', desc: 'Temporarily taken offline', badgeBg: 'bg-rose-500/10 text-rose-700 border-rose-500/30', icon: EyeOff },
];

const CATEGORY_OPTIONS = [
  'Coffee Shop',
  'Bakery & Cafe',
  'Bistro',
  'Restaurant',
  'Co-working Cafe',
  'Party Hall'
];

const WALKING_CATEGORY_OPTIONS = [
  'Walking Cafe'
];

/* Custom Status Dropdown */
const ModernStatusSelect = ({ value, onChange, register }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption = STATUS_OPTIONS.find(opt => opt.value === value) || STATUS_OPTIONS[0];
  const Icon = currentOption.icon;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <input type="hidden" {...register('status')} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-10 px-3.5 rounded-xl border flex items-center gap-2 text-xs font-extrabold transition-all shadow-2xs",
          currentOption.badgeBg,
          isOpen ? "ring-2 ring-[#6F4E37]/20 border-[#6F4E37]" : "border-border/60 hover:bg-white"
        )}
      >
        <Icon className="w-4 h-4" />
        <span>{currentOption.label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs sm:static sm:bg-transparent sm:p-0 sm:backdrop-blur-none sm:z-auto">
          <div className="w-full max-w-[280px] bg-white rounded-3xl sm:rounded-2xl border border-[#DDB892]/60 shadow-2xl sm:shadow-xl p-3 space-y-1 sm:absolute sm:right-0 sm:bottom-full sm:mb-2 sm:w-64 z-50 text-[#2C1810] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 border-b border-border/40 text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider flex items-center justify-between">
              <span>Select Listing Status</span>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="sm:hidden w-5 h-5 rounded-full bg-surface text-text/60 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            {STATUS_OPTIONS.map((opt) => {
              const OptIcon = opt.icon;
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5",
                    isSelected
                      ? "bg-[#FFF8F0] border border-[#DDB892]/60"
                      : "hover:bg-surface/50 border border-transparent"
                  )}
                >
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", opt.badgeBg)}>
                    <OptIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-extrabold text-[#2C1810]">{opt.label}</p>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#6F4E37]" />}
                    </div>
                    <p className="text-[10px] text-text/50">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* Custom Category Dropdown */
const ModernCategorySelect = ({ value, onChange, error, register, isWalkingCafe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);

  const isRestaurantOwner = 
    role === 'RESTAURANT_OWNER' || 
    user?.role === 'RESTAURANT_OWNER' || 
    user?.user_type === 'RESTAURANT_OWNER' ||
    String(role || '').toUpperCase().includes('RESTAURANT');

  const isWalkingCafeOwnerRole = 
    role === 'WALKING_CAFE_OWNER' || 
    user?.role === 'WALKING_CAFE_OWNER' || 
    user?.user_type === 'WALKING_CAFE_OWNER' ||
    String(role || '').toUpperCase().includes('WALKING') ||
    isWalkingCafe;

  const categoryOptions = isWalkingCafeOwnerRole
    ? ['Walking Cafe']
    : isRestaurantOwner
      ? ['Restaurant']
      : CATEGORY_OPTIONS.filter(cat => cat !== 'Restaurant');

  // Auto-set category if only 1 option exists
  useEffect(() => {
    if (categoryOptions.length === 1 && value !== categoryOptions[0]) {
      onChange(categoryOptions[0]);
    }
  }, [categoryOptions, value, onChange]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative text-left" ref={dropdownRef}>
      <input type="hidden" {...register('category')} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-4 rounded-xl border bg-surface/30 flex items-center justify-between text-xs font-medium transition-all text-[#2C1810]",
          error ? "border-danger" : isOpen ? "border-[#6F4E37] bg-white ring-2 ring-[#6F4E37]/10" : "border-border/60 hover:bg-white"
        )}
      >
        <span className={cn(value ? "font-bold text-[#2C1810]" : "text-text/50")}>
          {value || (isWalkingCafeOwnerRole ? "Walking Cafe" : "Select a category")}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-text/40 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl border border-[#DDB892]/60 shadow-xl z-50 p-2 space-y-1 text-[#2C1810] max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {categoryOptions.map((cat) => {
            const isSelected = value === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onChange(cat);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-[#6F4E37] text-white shadow-2xs"
                    : "text-[#2C1810] hover:bg-[#6F4E37]/10 hover:text-[#6F4E37]"
                )}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      )}
      {error && <p className="mt-1 text-[10px] text-danger">{error}</p>}
    </div>
  );
};

export const CafeForm = ({ defaultValues = {}, onSubmit, isLoading, submitLabel = "Save Cafe Changes" }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [pricingSubTab, setPricingSubTab] = useState('pricing');

  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);

  const isWalkingCafeOwnerRole = role === 'WALKING_CAFE_OWNER' || user?.role === 'WALKING_CAFE_OWNER' || user?.user_type === 'WALKING_CAFE_OWNER' || String(role || '').toUpperCase().includes('WALKING');
  const isWalkingCafe = isWalkingCafeOwnerRole || defaultValues?.is_walking_cafe === true || (defaultValues?.category || '').toLowerCase().includes('walking');
  const isRestaurantOwner = role === 'RESTAURANT_OWNER' || user?.role === 'RESTAURANT_OWNER' || user?.user_type === 'RESTAURANT_OWNER' || String(role || '').toUpperCase().includes('RESTAURANT');

  // Sanitize incoming defaultValues
  const sanitizedDefaultValues = {
    name: defaultValues?.name ?? '',
    description: defaultValues?.description ?? '',
    email: defaultValues?.email ?? '',
    phone: defaultValues?.phone ?? '',
    address: defaultValues?.address ?? '',
    city: defaultValues?.city ?? '',
    state: defaultValues?.state ?? '',
    country: defaultValues?.country ?? '',
    pincode: defaultValues?.pincode ?? '',
    latitude: defaultValues?.latitude ?? '',
    longitude: defaultValues?.longitude ?? '',
    category: defaultValues?.category ?? (isWalkingCafe ? 'Walking Cafe' : (isRestaurantOwner ? 'Restaurant' : '')),
    price: defaultValues?.price ?? '',
    capacity: defaultValues?.capacity ?? '',
    google_place_id: defaultValues?.google_place_id ?? '',
    google_rating: defaultValues?.google_rating ?? '',
    google_reviews_link: defaultValues?.google_reviews_link ?? '',
    provides_event_services: isWalkingCafe ? false : (defaultValues?.provides_event_services ?? false),
    allow_third_party_decoration: isWalkingCafe ? false : (defaultValues?.allow_third_party_decoration ?? true),
    cover_image: defaultValues?.cover_image ?? '',
    status: defaultValues?.status ?? 'DRAFT',
    amenities: Array.isArray(defaultValues?.amenities) ? defaultValues.amenities : [],
    gallery: Array.isArray(defaultValues?.gallery) ? defaultValues.gallery : [],
    businessHours: {
      monday: defaultValues?.businessHours?.monday || defaultBusinessHours.monday,
      tuesday: defaultValues?.businessHours?.tuesday || defaultBusinessHours.tuesday,
      wednesday: defaultValues?.businessHours?.wednesday || defaultBusinessHours.wednesday,
      thursday: defaultValues?.businessHours?.thursday || defaultBusinessHours.thursday,
      friday: defaultValues?.businessHours?.friday || defaultBusinessHours.friday,
      saturday: defaultValues?.businessHours?.saturday || defaultBusinessHours.saturday,
      sunday: defaultValues?.businessHours?.sunday || defaultBusinessHours.sunday,
    }
  };

  const methods = useForm({
    resolver: zodResolver(cafeSchema),
    defaultValues: sanitizedDefaultValues,
  });

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      methods.reset(sanitizedDefaultValues);
    }
  }, [
    defaultValues?.id,
    defaultValues?.name,
    defaultValues?.email,
    defaultValues?.phone,
    defaultValues?.address,
    defaultValues?.updated_at
  ]);

  const { register, formState: { errors }, watch, handleSubmit, setValue } = methods;
  const lat = watch('latitude');
  const lng = watch('longitude');
  const coverImage = watch('cover_image');
  const currentStatus = watch('status');
  const currentCategory = watch('category');
  const descriptionText = watch('description') || '';
  const currentName = watch('name');
  const currentCity = watch('city');
  const currentAddress = watch('address');
  const currentAmenities = watch('amenities') || [];
  const galleryImages = watch('gallery') || [];

  const [step2SubTab, setStep2SubTab] = useState('rates'); // 'rates' | 'discounts'

  // Event & Offer Watchers
  const providesEventServices = watch('provides_event_services') ?? defaultValues?.provides_event_services ?? false;
  const allowThirdPartyDecoration = watch('allow_third_party_decoration') ?? defaultValues?.allow_third_party_decoration ?? true;
  const currentCapabilities = watch('capabilities') || defaultValues?.capabilities || {};
  const selectedEventTypes = currentCapabilities?.event_types || defaultValues?.capabilities?.event_types || [];

  const rawDiscounts = watch('discounts') || defaultValues?.discounts || [];
  const discountsList = Array.isArray(rawDiscounts)
    ? rawDiscounts
    : (rawDiscounts && typeof rawDiscounts === 'object')
      ? Object.values(rawDiscounts)
      : [];

  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [editingOfferIndex, setEditingOfferIndex] = useState(null);

  const defaultOfferState = {
    title: '',
    type: 'PERCENTAGE',
    amount: '',
    min_booking_amount: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
  };
  const [offerFormData, setOfferFormData] = useState(defaultOfferState);

  const toggleEventType = (evtId) => {
    const currentList = Array.isArray(selectedEventTypes) ? [...selectedEventTypes] : [];
    const index = currentList.indexOf(evtId);
    let updatedList = [];
    if (index > -1) {
      updatedList = currentList.filter(id => id !== evtId);
    } else {
      updatedList = [...currentList, evtId];
    }
    const updatedCapabilities = {
      ...currentCapabilities,
      event_types: updatedList,
    };
    setValue('capabilities', updatedCapabilities, { shouldDirty: true });
  };

  const handleSaveOffer = () => {
    if (!offerFormData.title || !offerFormData.amount) {
      toast.error("Please provide offer title and discount amount.");
      return;
    }

    const newOffer = {
      id: offerFormData.id || `off_${Date.now()}`,
      title: offerFormData.title,
      name: offerFormData.title,
      type: offerFormData.type,
      discount_type: offerFormData.type,
      amount: Number(offerFormData.amount) || 0,
      discount_value: Number(offerFormData.amount) || 0,
      min_booking_amount: offerFormData.min_booking_amount ? Number(offerFormData.min_booking_amount) : null,
      valid_from: offerFormData.valid_from || null,
      valid_until: offerFormData.valid_until || null,
      is_active: offerFormData.is_active !== false,
      status: offerFormData.is_active !== false ? 'ACTIVE' : 'INACTIVE',
    };

    let updatedDiscounts = [...discountsList];
    if (editingOfferIndex !== null && editingOfferIndex >= 0 && editingOfferIndex < updatedDiscounts.length) {
      updatedDiscounts[editingOfferIndex] = newOffer;
      toast.success("Offer updated successfully!");
    } else {
      updatedDiscounts.push(newOffer);
      toast.success("New offer created!");
    }

    setValue('discounts', updatedDiscounts, { shouldDirty: true });
    setIsCreatingOffer(false);
    setEditingOfferIndex(null);
    setOfferFormData(defaultOfferState);
  };

  const handleEditOffer = (index) => {
    const offer = discountsList[index];
    if (!offer) return;
    setOfferFormData({
      id: offer.id,
      title: offer.title || offer.name || '',
      type: offer.type || offer.discount_type || 'PERCENTAGE',
      amount: offer.amount || offer.discount_value || '',
      min_booking_amount: offer.min_booking_amount || '',
      valid_from: offer.valid_from || '',
      valid_until: offer.valid_until || '',
      is_active: offer.is_active !== false && offer.status !== 'INACTIVE',
    });
    setEditingOfferIndex(index);
    setIsCreatingOffer(true);
  };

  const handleToggleOfferStatus = (index) => {
    const updatedDiscounts = [...discountsList];
    if (updatedDiscounts[index]) {
      const currentActive = updatedDiscounts[index].is_active !== false && updatedDiscounts[index].status !== 'INACTIVE';
      updatedDiscounts[index] = {
        ...updatedDiscounts[index],
        is_active: !currentActive,
        status: !currentActive ? 'ACTIVE' : 'INACTIVE'
      };
      setValue('discounts', updatedDiscounts, { shouldDirty: true });
      toast.success(currentActive ? "Offer disabled" : "Offer enabled");
    }
  };

  const handleDeleteOffer = (index) => {
    const updatedDiscounts = discountsList.filter((_, i) => i !== index);
    setValue('discounts', updatedDiscounts, { shouldDirty: true });
    toast.success("Offer deleted");
  };

  // Steps configuration for Walking Cafe vs Standard Cafe
  const steps = isWalkingCafe ? [
    { id: 1, title: 'Basic Information', icon: Store, description: 'Venue name, category & description' },
    { id: 2, title: 'Location & Contact', icon: MapPin, description: 'Address, pincode & contact details' },
    { id: 3, title: 'Walk-in & Details', icon: Coffee, description: 'Walk-in features, seating & amenities' },
    { id: 4, title: 'Photos & Menu', icon: ImageIcon, description: 'Cover photo, gallery & menu info' },
    { id: 5, title: 'Business Hours', icon: Clock, description: 'Weekly operating schedule' },
  ] : [
    { id: 1, title: 'Basic & Location', icon: Store, description: 'Venue name, address & location pin' },
    { id: 2, title: 'Pricing & Capacity', icon: Tag, description: 'Hourly rates & guest seating limits' },
    { id: 3, title: 'Amenities & Photos', icon: ImageIcon, description: 'Venue features & photo gallery' },
    { id: 4, title: 'Business Hours', icon: Clock, description: 'Weekly operating schedule' },
  ];

  const maxStep = steps.length;

  const nextStep = () => {
    if (currentStep < maxStep) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleFormSubmit = (data) => {
    if (isWalkingCafe) {
      onSubmit({
        ...data,
        is_walking_cafe: true,
        walk_in: true,
        table_reservation: false,
        event_booking: false,
        event_packages: false,
        event_facilities: false,
        price: null,
        provides_event_services: false,
        allow_third_party_decoration: false,
      });
    } else {
      onSubmit({
        ...data,
        is_walking_cafe: false,
        walk_in: true,
        table_reservation: true,
        event_booking: true,
      });
    }
  };

  const onFormError = (errors) => {
    console.error("Form validation errors:", errors);
    const firstErr = Object.values(errors)[0];
    const errMsg = firstErr?.message || (firstErr ? Object.values(firstErr)[0]?.message : null) || 'Please fill in all required form fields.';
    toast.error(`Cannot submit form: ${errMsg}`);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit, onFormError)} className="space-y-6 text-[#2C1810]">
        
        {/* Step Wizard Navigation Header */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-border/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#6F4E37] uppercase tracking-wider">
              Step {currentStep} of {maxStep} — {steps[currentStep - 1]?.title}
            </span>
            <span className="text-xs font-bold text-text/60">
              {Math.round((currentStep / maxStep) * 100)}% Completed
            </span>
          </div>

          {/* Stepper Line Progress */}
          <div className="w-full h-2 bg-surface/70 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#6F4E37] rounded-full"
              initial={{ width: `${(1 / maxStep) * 100}%` }}
              animate={{ width: `${(currentStep / maxStep) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Stepper Tab Buttons */}
          <div className={cn("grid gap-1.5 sm:gap-2 pt-2", isWalkingCafe ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-4")}>
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "p-2 sm:p-3 rounded-2xl border text-left transition-all flex items-center sm:items-start gap-1.5 sm:gap-2 cursor-pointer",
                    isCurrent 
                      ? "bg-[#FFF8F0] border-[#DDB892] shadow-2xs" 
                      : isCompleted 
                        ? "bg-surface/40 border-border/40 hover:bg-surface" 
                        : "bg-white border-border/30 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center text-[11px] sm:text-xs font-extrabold shrink-0",
                    isCurrent 
                      ? "bg-[#6F4E37] text-white" 
                      : isCompleted 
                        ? "bg-emerald-500/10 text-emerald-700" 
                        : "bg-surface text-text/50"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> : step.id}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-[11px] sm:text-xs font-extrabold truncate", isCurrent ? "text-[#6F4E37]" : "text-[#2C1810]")}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-text/50 truncate hidden md:block">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Form Body Canvas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            
            {/* WALKING CAFE FLOW */}
            {isWalkingCafe ? (
              <>
                {/* STEP 1: BASIC INFORMATION */}
                {currentStep === 1 && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                      <div className="w-10 h-10 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#2C1810]">Walking Cafe Basic Information</h3>
                        <p className="text-xs text-text/60">Official cafe name, category, and public description</p>
                      </div>
                    </div>

                    {/* Account Type Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF8F0] to-[#FFF5EA] border border-[#DDB892]/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center">
                          <Footprints className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-[#2C1810]">Walking Cafe Account</h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[10px] font-extrabold">
                              Walk-in Listing
                            </span>
                          </div>
                          <p className="text-[11px] text-text/60 mt-0.5">
                            Customers visit your cafe directly during operating hours. Table booking and event package features are disabled.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <Label htmlFor="name">Cafe Name *</Label>
                        <Input id="name" {...register('name')} error={errors.name?.message} placeholder="e.g. Walking Brew Cafe" />
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor="description" className="mb-0">Cafe Description *</Label>
                          <span className="text-[10px] text-text/50 font-bold">{descriptionText.length} characters</span>
                        </div>
                        <textarea 
                          id="description" 
                          {...register('description')} 
                          rows={4}
                          className={cn(
                            "w-full rounded-2xl border bg-surface/30 px-4 py-3 text-xs font-medium focus:outline-none focus:bg-white focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 transition-all resize-none leading-relaxed", 
                            errors.description ? "border-danger focus:border-danger" : "border-border/60"
                          )}
                          placeholder="A cozy neighborhood cafe serving specialty coffee, fresh bakery items and desserts. Walk in anytime during business hours."
                        />
                        {errors.description && <p className="mt-1 text-[10px] text-danger">{errors.description.message}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="category">Cafe Category *</Label>
                        <ModernCategorySelect 
                          value={currentCategory} 
                          onChange={(cat) => setValue('category', cat, { shouldDirty: true })}
                          error={errors.category?.message}
                          register={register}
                          isWalkingCafe={true}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: LOCATION & CONTACT */}
                {currentStep === 2 && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-extrabold">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#2C1810]">Location & Contact Details</h3>
                        <p className="text-xs text-text/60">Street address, map location, and owner contact information</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="address">Street Address *</Label>
                          <Input id="address" {...register('address')} error={errors.address?.message} placeholder="e.g. 123 Main Street, Suite 4B" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="city">City *</Label>
                            <Input id="city" {...register('city')} error={errors.city?.message} placeholder="e.g. Madurai" />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input id="state" {...register('state')} error={errors.state?.message} placeholder="e.g. Tamil Nadu" />
                          </div>
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" {...register('country')} error={errors.country?.message} placeholder="e.g. India" />
                          </div>
                          <div>
                            <Label htmlFor="pincode">Postal Pincode</Label>
                            <Input id="pincode" {...register('pincode')} error={errors.pincode?.message} placeholder="e.g. 625001" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" {...register('phone')} error={errors.phone?.message} placeholder="+91 98765 43210" />
                          </div>
                          <div>
                            <Label htmlFor="email">Contact Email</Label>
                            <Input id="email" type="email" {...register('email')} error={errors.email?.message} placeholder="venue@faharacafe.com" />
                          </div>
                        </div>
                      </div>

                      <div className="h-64 sm:h-auto min-h-[260px]">
                        <MapPicker 
                          latitude={lat} 
                          longitude={lng}
                          onLocationSelect={(location) => {
                            if (location.lat) setValue('latitude', location.lat, { shouldValidate: true, shouldDirty: true });
                            if (location.lng) setValue('longitude', location.lng, { shouldValidate: true, shouldDirty: true });
                            if (location.address) setValue('address', location.address, { shouldValidate: true, shouldDirty: true });
                            if (location.city) setValue('city', location.city, { shouldValidate: true, shouldDirty: true });
                            if (location.state) setValue('state', location.state, { shouldValidate: true, shouldDirty: true });
                            if (location.country) setValue('country', location.country, { shouldValidate: true, shouldDirty: true });
                            if (location.pincode) setValue('pincode', location.pincode, { shouldValidate: true, shouldDirty: true });
                          }}
                          className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-border/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: WALK-IN & CAFE DETAILS */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Walk-in Capability Configuration */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-5">
                      <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-extrabold">
                          <Footprints className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#2C1810]">Walking Cafe Configuration</h3>
                          <p className="text-xs text-text/60">Walk-in service features and capability status</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div>
                          <h4 className="text-xs font-black text-emerald-900">☑ Walk-in Customers Allowed</h4>
                          <p className="text-[11px] text-emerald-800 mt-0.5">
                            Customers can discover your cafe, view opening hours, get directions, and walk in anytime.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
                        <div>
                          <Label htmlFor="capacity">Approx. Seating Capacity (Optional)</Label>
                          <div className="relative">
                            <Users className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input id="capacity" type="number" className="pl-9" {...register('capacity')} error={errors.capacity?.message} placeholder="e.g. 25" />
                          </div>
                          <p className="text-[10px] text-text/50 mt-1">Informational guest capacity. Does NOT enable table reservations.</p>
                        </div>

                        <div>
                          <Label htmlFor="google_rating">Google Rating (Optional)</Label>
                          <Input id="google_rating" type="number" step="0.1" min="0" max="5" {...register('google_rating')} error={errors.google_rating?.message} placeholder="e.g. 4.5" />
                        </div>

                        <div>
                          <Label htmlFor="google_reviews_link">Google Reviews Link (Optional)</Label>
                          <Input id="google_reviews_link" type="url" {...register('google_reviews_link')} error={errors.google_reviews_link?.message} placeholder="e.g. https://maps.app.goo.gl/..." />
                        </div>
                      </div>
                    </div>

                    {/* Cafe Amenities */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-extrabold">
                          <Wifi className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#2C1810]">Cafe Amenities & Features</h3>
                          <p className="text-xs text-text/60">Select features available to walk-in customers</p>
                        </div>
                      </div>
                      <CafeAmenities />
                    </div>
                  </div>
                )}

                {/* STEP 4: PHOTOS & MENU */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {/* Cover Image Upload */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-extrabold">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#2C1810]">Cover Hero Banner Image</h3>
                          <p className="text-xs text-text/60">Main image displayed on your cafe listing</p>
                        </div>
                      </div>

                      <div 
                        className={cn(
                          "border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden min-h-[160px]",
                          "hover:bg-surface/50 hover:border-[#6F4E37]",
                          errors.cover_image ? "border-danger bg-danger/5" : "border-border/60 bg-surface/30"
                        )}
                        onClick={() => document.getElementById('cover_image_input')?.click()}
                      >
                        {coverImage ? (
                          <div className="absolute inset-0 w-full h-full p-2">
                            <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover rounded-xl" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl m-2 text-white text-xs font-bold">
                              Click to change cover image
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 text-[#6F4E37] mb-2 opacity-70" />
                            <p className="text-xs font-extrabold text-[#2C1810]">Click to upload cover image</p>
                            <p className="text-[10px] text-text/50 mt-0.5">PNG, JPG, WEBP (max 5MB)</p>
                          </>
                        )}
                        <input 
                          id="cover_image_input"
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setValue('cover_image', event.target.result, { shouldDirty: true, shouldValidate: true });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Gallery Upload */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#2C1810]">Additional Cafe Gallery</h3>
                          <p className="text-xs text-text/60">Upload ambience, seating, and food photos</p>
                        </div>
                      </div>
                      <GalleryUploader 
                        value={watch('gallery') || []}
                        onChange={(files) => methods.setValue('gallery', files, { shouldDirty: true })}
                        maxFiles={6}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 5: BUSINESS HOURS */}
                {currentStep === 5 && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#2C1810]">Weekly Operating Hours</h3>
                        <p className="text-xs text-text/60">Set opening & closing hours for walk-in customers</p>
                      </div>
                    </div>
                    <BusinessHours />
                  </div>
                )}
              </>
            ) : (
              /* STANDARD CAFE FLOW (4 STEPS) */
              <>
                {/* STEP 1: BASIC & LOCATION INFO */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                        <div className="w-10 h-10 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold">
                          <Info className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#2C1810]">Basic Venue Information</h3>
                          <p className="text-xs text-text/60">Official cafe name, description, and contact details</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <Label htmlFor="name">Cafe Name *</Label>
                          <Input id="name" {...register('name')} error={errors.name?.message} placeholder="e.g. Central Perk Cafe" />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="description">Venue Description *</Label>
                          <textarea 
                            id="description" 
                            {...register('description')} 
                            rows={4}
                            className={cn(
                              "w-full rounded-2xl border bg-surface/30 px-4 py-3 text-xs font-medium focus:outline-none focus:bg-white focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 transition-all resize-none leading-relaxed", 
                              errors.description ? "border-danger focus:border-danger" : "border-border/60"
                            )}
                            placeholder="Describe your venue's atmosphere, dining specialities, and guest experience..."
                          />
                          {errors.description && <p className="mt-1 text-[10px] text-danger">{errors.description.message}</p>}
                        </div>

                        <div>
                          <Label htmlFor="email">Contact Email</Label>
                          <Input id="email" type="email" {...register('email')} error={errors.email?.message} placeholder="venue@faharacafe.com" />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" {...register('phone')} error={errors.phone?.message} placeholder="+91 98765 43210" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-extrabold">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-[#2C1810]">Address & Location Coordinates</h3>
                          <p className="text-xs text-text/60">Physical address for customer navigation</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="address">Street Address *</Label>
                            <Input id="address" {...register('address')} error={errors.address?.message} placeholder="e.g. 123 Main Street, Suite 4B" />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="city">City *</Label>
                              <Input id="city" {...register('city')} error={errors.city?.message} placeholder="e.g. Madurai" />
                            </div>
                            <div>
                              <Label htmlFor="state">State</Label>
                              <Input id="state" {...register('state')} error={errors.state?.message} placeholder="e.g. Tamil Nadu" />
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Input id="country" {...register('country')} error={errors.country?.message} placeholder="e.g. India" />
                            </div>
                            <div>
                              <Label htmlFor="pincode">Postal Pincode</Label>
                              <Input id="pincode" {...register('pincode')} error={errors.pincode?.message} placeholder="e.g. 625001" />
                            </div>
                          </div>
                        </div>

                        <div className="h-64 sm:h-auto min-h-[260px]">
                          <MapPicker 
                            latitude={lat} 
                            longitude={lng}
                            onLocationSelect={(location) => {
                              if (location.lat) setValue('latitude', location.lat, { shouldValidate: true, shouldDirty: true });
                              if (location.lng) setValue('longitude', location.lng, { shouldValidate: true, shouldDirty: true });
                              if (location.address) setValue('address', location.address, { shouldValidate: true, shouldDirty: true });
                              if (location.city) setValue('city', location.city, { shouldValidate: true, shouldDirty: true });
                            }}
                            className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-border/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: PRICING & CAPACITY (DUAL SUB-TAB SYSTEM) */}
                {currentStep === 2 && (
                  <div className="space-y-6 text-[#2C1810]">
                    {/* Step 2 Sub-Tabs Navigation */}
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-border/60 shadow-2xs w-fit">
                      <button
                        type="button"
                        onClick={() => setStep2SubTab('rates')}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer",
                          step2SubTab === 'rates' 
                            ? "bg-[#6F4E37] text-white shadow-2xs" 
                            : "text-[#6F4E37] hover:bg-[#FFF8F0]"
                        )}
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Rates & Capacity</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep2SubTab('discounts')}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer",
                          step2SubTab === 'discounts' 
                            ? "bg-[#6F4E37] text-white shadow-2xs" 
                            : "text-[#6F4E37] hover:bg-[#FFF8F0]"
                        )}
                      >
                        <BadgePercent className="w-3.5 h-3.5" />
                        <span>Discounts & Offers</span>
                        {discountsList.length > 0 && (
                          <span className={cn(
                            "px-1.5 py-0.2 text-[10px] font-black rounded-full ml-1",
                            step2SubTab === 'discounts' ? "bg-amber-400 text-amber-950" : "bg-amber-100 text-amber-800"
                          )}>
                            {discountsList.length}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* SUBTAB 1: RATES & CAPACITY */}
                    {step2SubTab === 'rates' && (
                      <div className="space-y-6">
                        {/* Pricing & Capacity Attributes */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                          <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center font-extrabold">
                              <Tag className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base font-extrabold text-[#2C1810]">Attributes & Pricing Configuration</h3>
                              <p className="text-xs text-text/60">Set hourly pricing rates and guest seating capacities</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                              <Label htmlFor="category">Venue Category</Label>
                              <ModernCategorySelect 
                                value={currentCategory} 
                                onChange={(cat) => setValue('category', cat, { shouldDirty: true })}
                                error={errors.category?.message}
                                register={register}
                              />
                            </div>

                            <div>
                              <Label htmlFor="price">Hourly Booking Rate (₹/hr) *</Label>
                              <Input id="price" type="number" {...register('price')} error={errors.price?.message} placeholder="e.g. 500" />
                            </div>

                            <div>
                              <Label htmlFor="capacity">Max Seating Capacity (Guests) *</Label>
                              <Input id="capacity" type="number" {...register('capacity')} error={errors.capacity?.message} placeholder="e.g. 25" />
                            </div>
                          </div>
                        </div>

                        {/* Event & Party Services */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                          <div className="flex items-center justify-between pb-4 border-b border-border/40">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-extrabold">
                                <PartyPopper className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-base font-extrabold text-[#2C1810]">Event & Party Services</h3>
                                <p className="text-xs text-text/60">Configure private events, occasion types, and package settings</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label>Does your cafe provide private event & party services?</Label>
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setValue('provides_event_services', true, { shouldDirty: true })}
                                className={cn(
                                  "px-5 py-2.5 rounded-2xl border text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer",
                                  providesEventServices 
                                    ? "bg-[#6F4E37] text-white border-[#6F4E37] shadow-xs" 
                                    : "bg-white text-text/70 border-border/60 hover:border-[#6F4E37]"
                                )}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Yes, We Provide Private Events</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setValue('provides_event_services', false, { shouldDirty: true })}
                                className={cn(
                                  "px-5 py-2.5 rounded-2xl border text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer",
                                  !providesEventServices 
                                    ? "bg-stone-200 text-stone-800 border-stone-300" 
                                    : "bg-white text-text/70 border-border/60 hover:border-stone-400"
                                )}
                              >
                                <span>No Events</span>
                              </button>
                            </div>
                          </div>

                          {providesEventServices && (
                            <div className="space-y-6 pt-4 border-t border-border/40">
                              <div className="space-y-3">
                                <div>
                                  <Label className="mb-0">Supported Event Types / Occasions *</Label>
                                  <p className="text-[11px] text-text/60">Select the occasion categories supported by your venue</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                                  {EVENT_TYPES_OPTIONS.map(evt => {
                                    const isSelected = Array.isArray(selectedEventTypes) && selectedEventTypes.includes(evt.id);
                                    return (
                                      <button
                                        key={evt.id}
                                        type="button"
                                        onClick={() => toggleEventType(evt.id)}
                                        className={cn(
                                          "p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
                                          isSelected
                                            ? "bg-[#FFF8F0] border-[#6F4E37] text-[#6F4E37] shadow-2xs"
                                            : "bg-surface/30 border-border/50 text-text/70 hover:bg-surface"
                                        )}
                                      >
                                        <div className={cn(
                                          "w-4 h-4 rounded-md border flex items-center justify-center shrink-0 text-[10px]",
                                          isSelected ? "bg-[#6F4E37] border-[#6F4E37] text-white" : "border-stone-300 bg-white"
                                        )}>
                                          {isSelected && "✓"}
                                        </div>
                                        <span className="truncate">{evt.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h4 className="text-xs font-black text-[#2C1810] flex items-center gap-2">
                                    <Package className="w-4 h-4 text-[#6F4E37]" />
                                    Event Packages Availability
                                  </h4>
                                  <p className="text-[11px] text-text/60 mt-0.5">
                                    Manage custom event packages (decorations, food menus, minimum guests, tiered pricing)
                                  </p>
                                </div>

                                {defaultValues?.id ? (
                                  <a
                                    href={`/owner/cafes/${defaultValues.id}/packages`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 rounded-xl bg-[#6F4E37] text-white text-xs font-extrabold hover:bg-[#5a3e2b] transition-all shrink-0 flex items-center gap-1.5"
                                  >
                                    <span>Manage Packages</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                ) : (
                                  <span className="text-[11px] text-text/50 italic">Save cafe to configure event packages</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Third-Party Event Management Switch */}
                          <div className="pt-4 border-t border-border/40">
                            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-surface/30 border border-border/60">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-[#6F4E37]" />
                                  <h4 className="text-xs font-black text-[#2C1810]">
                                    Allow 3rd Party Event Management & Decoration Services
                                  </h4>
                                </div>
                                <p className="text-[11px] text-text/60 pl-6">
                                  External event managers and decorators can offer their services for bookings at this cafe according to Fahara's event workflow.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => setValue('allow_third_party_decoration', !allowThirdPartyDecoration, { shouldDirty: true })}
                                className={cn(
                                  "w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 border mt-1",
                                  allowThirdPartyDecoration ? "bg-[#6F4E37] border-[#6F4E37]" : "bg-stone-300 border-stone-300"
                                )}
                              >
                                <div className={cn(
                                  "w-5 h-5 rounded-full bg-white transition-transform shadow-xs absolute top-0.5",
                                  allowThirdPartyDecoration ? "right-0.5" : "left-0.5"
                                )} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBTAB 2: DISCOUNTS & OFFERS */}
                    {step2SubTab === 'discounts' && (
                      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-border/40">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-extrabold">
                              <BadgePercent className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base font-extrabold text-[#2C1810]">Discounts & Promotional Offers</h3>
                              <p className="text-xs text-text/60">Create and manage customer discounts, weekend specials, and percentage offers</p>
                            </div>
                          </div>

                          {!isCreatingOffer && (
                            <Button 
                              type="button" 
                              size="sm" 
                              onClick={() => {
                                setEditingOfferIndex(null);
                                setOfferFormData(defaultOfferState);
                                setIsCreatingOffer(true);
                              }}
                              className="bg-[#6F4E37] hover:bg-[#5a3e2b] text-white"
                            >
                              <Plus className="w-4 h-4 mr-1.5" />
                              Create Offer
                            </Button>
                          )}
                        </div>

                        {isCreatingOffer ? (
                          <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#DDB892] space-y-4">
                            <h4 className="text-sm font-black text-[#2C1810] flex items-center gap-2">
                              <Tag className="w-4 h-4 text-[#6F4E37]" />
                              {editingOfferIndex !== null ? 'Edit Promotional Offer' : 'Create New Promotional Offer'}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <Label htmlFor="offer_title">Offer Title *</Label>
                                <Input 
                                  id="offer_title" 
                                  value={offerFormData.title} 
                                  onChange={(e) => setOfferFormData(prev => ({ ...prev, title: e.target.value }))}
                                  placeholder="e.g. Weekend Special or Happy Hour 10% OFF" 
                                />
                              </div>

                              <div>
                                <Label htmlFor="offer_type">Discount Type *</Label>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setOfferFormData(prev => ({ ...prev, type: 'PERCENTAGE' }))}
                                    className={cn(
                                      "flex-1 py-2.5 px-3 rounded-xl border text-xs font-extrabold cursor-pointer transition-all",
                                      offerFormData.type === 'PERCENTAGE' ? "bg-[#6F4E37] text-white border-[#6F4E37]" : "bg-white text-text/70 border-border/60"
                                    )}
                                  >
                                    Percentage (%)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setOfferFormData(prev => ({ ...prev, type: 'FLAT' }))}
                                    className={cn(
                                      "flex-1 py-2.5 px-3 rounded-xl border text-xs font-extrabold cursor-pointer transition-all",
                                      offerFormData.type === 'FLAT' ? "bg-[#6F4E37] text-white border-[#6F4E37]" : "bg-white text-text/70 border-border/60"
                                    )}
                                  >
                                    Flat Amount (₹)
                                  </button>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="offer_value">Discount Value * ({offerFormData.type === 'PERCENTAGE' ? '%' : '₹'})</Label>
                                <Input 
                                  id="offer_value" 
                                  type="number"
                                  value={offerFormData.amount} 
                                  onChange={(e) => setOfferFormData(prev => ({ ...prev, amount: e.target.value }))}
                                  placeholder={offerFormData.type === 'PERCENTAGE' ? "e.g. 10" : "e.g. 200"} 
                                />
                              </div>

                              <div>
                                <Label htmlFor="min_booking_amount">Minimum Booking Amount (Optional ₹)</Label>
                                <Input 
                                  id="min_booking_amount" 
                                  type="number"
                                  value={offerFormData.min_booking_amount} 
                                  onChange={(e) => setOfferFormData(prev => ({ ...prev, min_booking_amount: e.target.value }))}
                                  placeholder="e.g. 500" 
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor="valid_from">Valid From</Label>
                                  <Input 
                                    id="valid_from" 
                                    type="date"
                                    value={offerFormData.valid_from} 
                                    onChange={(e) => setOfferFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="valid_until">Valid Until</Label>
                                  <Input 
                                    id="valid_until" 
                                    type="date"
                                    value={offerFormData.valid_until} 
                                    onChange={(e) => setOfferFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDB892]/40">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setIsCreatingOffer(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="button" 
                                size="sm" 
                                onClick={handleSaveOffer}
                                className="bg-[#6F4E37] text-white hover:bg-[#5a3e2b]"
                              >
                                Save Offer
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {discountsList.length === 0 ? (
                              <div className="p-8 text-center rounded-2xl bg-surface/30 border border-border/60 space-y-3">
                                <BadgePercent className="w-10 h-10 text-[#6F4E37] opacity-40 mx-auto" />
                                <p className="text-xs font-bold text-[#2C1810]">No active offers or discounts created yet.</p>
                                <p className="text-[11px] text-text/50">Add promotional discounts to attract more customer bookings to your cafe.</p>
                                <Button 
                                  type="button" 
                                  size="sm" 
                                  onClick={() => {
                                    setEditingOfferIndex(null);
                                    setOfferFormData(defaultOfferState);
                                    setIsCreatingOffer(true);
                                  }}
                                  className="bg-[#6F4E37] text-white"
                                >
                                  <Plus className="w-4 h-4 mr-1.5" />
                                  Create First Offer
                                </Button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {discountsList.map((disc, idx) => (
                                  <div key={disc.id || idx} className="p-4 rounded-2xl bg-white border border-border/60 shadow-2xs flex flex-col justify-between space-y-3">
                                    <div>
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black text-[#2C1810]">{disc.title || disc.name || 'Promotional Offer'}</h4>
                                        <span className={cn(
                                          "px-2 py-0.5 text-[10px] font-black rounded-full",
                                          disc.is_active !== false && disc.status !== 'INACTIVE' ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"
                                        )}>
                                          {disc.is_active !== false && disc.status !== 'INACTIVE' ? 'Active' : 'Disabled'}
                                        </span>
                                      </div>

                                      <p className="text-sm font-extrabold text-[#6F4E37] mt-1">
                                        {disc.type === 'FLAT' ? `₹${disc.amount} OFF` : `${disc.amount}% OFF`}
                                      </p>

                                      {disc.valid_from && disc.valid_until && (
                                        <p className="text-[10px] text-text/60 mt-1">
                                          Valid: {disc.valid_from} – {disc.valid_until}
                                        </p>
                                      )}
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/40">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleOfferStatus(idx)}
                                        className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                                      >
                                        {disc.is_active !== false && disc.status !== 'INACTIVE' ? 'Disable' : 'Enable'}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleEditOffer(idx)}
                                        className="text-xs font-bold text-[#6F4E37] hover:underline cursor-pointer"
                                      >
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteOffer(idx)}
                                        className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: AMENITIES & PHOTOS */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                      <h3 className="text-base font-extrabold text-[#2C1810]">Venue Amenities</h3>
                      <CafeAmenities />
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                      <h3 className="text-base font-extrabold text-[#2C1810]">Cover & Gallery Photos</h3>
                      <GalleryUploader 
                        value={watch('gallery') || []}
                        onChange={(files) => methods.setValue('gallery', files, { shouldDirty: true })}
                        maxFiles={6}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: BUSINESS HOURS */}
                {currentStep === 4 && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                    <h3 className="text-base font-extrabold text-[#2C1810]">Weekly Operating Hours</h3>
                    <BusinessHours />
                  </div>
                )}
              </>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Wizard Footer Action Controls */}
        <div className="p-4 sm:p-5 bg-white rounded-3xl border border-border/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button 
            type="button" 
            variant="outline"
            disabled={currentStep === 1}
            onClick={prevStep}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border-border/60 text-xs font-bold text-[#2C1810] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Previous Step
          </Button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {currentStep < maxStep ? (
              <Button 
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <ModernStatusSelect 
                  value={currentStatus} 
                  onChange={(status) => setValue('status', status, { shouldDirty: true })}
                  register={register}
                />

                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> {submitLabel}
                </Button>
              </div>
            )}
          </div>
        </div>

      </form>
    </FormProvider>
  );
};
