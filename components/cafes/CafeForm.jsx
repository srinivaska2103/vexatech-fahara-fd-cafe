'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cafeSchema } from '@/schemas/cafe.schema';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { GalleryUploader } from './GalleryUploader';
import { BusinessHours } from './BusinessHours';
import { CafeAmenities } from './CafeAmenities';
import { MapPicker } from '../maps/MapPicker';
import { 
  MapPin, 
  Info, 
  DollarSign, 
  Users, 
  Tag, 
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
  EyeOff
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

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Publish (Active)', desc: 'Live & visible to customers for bookings', badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30', icon: Globe },
  { value: 'DRAFT', label: 'Save as Draft', desc: 'Hidden in draft mode while editing', badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-500/30', icon: FileText },
  { value: 'INACTIVE', label: 'Hidden (Inactive)', desc: 'Temporarily taken offline', badgeBg: 'bg-rose-500/10 text-rose-700 border-rose-500/30', icon: EyeOff },
];

const CATEGORY_OPTIONS = [
  'Coffee Shop',
  'Bakery & Cafe',
  'Bistro',
  'Co-working Cafe',
  'Party Hall'
];

/* Custom Modern Status Dropdown Popover */
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

/* Custom Modern Category Dropdown Popover */
const ModernCategorySelect = ({ value, onChange, error, register }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
          {value || "Select a category"}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-text/40 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl border border-[#DDB892]/60 shadow-xl z-50 p-2 space-y-1 text-[#2C1810] animate-in fade-in zoom-in-95 duration-150">
          {CATEGORY_OPTIONS.map((cat) => {
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

export const CafeForm = ({ defaultValues, onSubmit, isLoading, submitLabel = "Save Cafe Changes" }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm({
    resolver: zodResolver(cafeSchema),
    defaultValues: {
      name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      latitude: '',
      longitude: '',
      category: '',
      price: '',
      capacity: '',
      google_place_id: '',
      google_rating: '',
      provides_event_services: false,
      cover_image: '',
      status: 'DRAFT',
      amenities: [],
      gallery: [],
      businessHours: defaultBusinessHours,
      ...defaultValues
    },
  });

  const draftKey = `fahara_cafe_edit_draft_${defaultValues?.id || 'new'}`;

  // Restore draft from localStorage on initial render if present
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          methods.reset({
            ...methods.getValues(),
            ...parsed
          });
        } catch (e) {
          console.error("Error restoring cafe form draft", e);
        }
      }
    }
  }, [draftKey]);

  // Save form state to localStorage on every change
  React.useEffect(() => {
    const subscription = methods.watch((values) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(draftKey, JSON.stringify(values));
      }
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, draftKey]);

  const handleFormSubmit = (data) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(draftKey);
    }
    onSubmit(data);
  };

  const steps = [
    { id: 1, title: 'Basic & Location', icon: Store, description: 'Venue name, address & location pin' },
    { id: 2, title: 'Pricing & Capacity', icon: Tag, description: 'Hourly rates & guest seating limits' },
    { id: 3, title: 'Amenities & Photos', icon: ImageIcon, description: 'Venue features & photo gallery' },
    { id: 4, title: 'Business Hours', icon: Clock, description: 'Weekly operating schedule' },
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const { register, formState: { errors }, watch, handleSubmit, setValue } = methods;
  const lat = watch('latitude');
  const lng = watch('longitude');
  const coverImage = watch('cover_image');
  const currentStatus = watch('status');
  const currentCategory = watch('category');

  const onFormError = (errors) => {
    console.error("Form validation errors:", errors);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit, onFormError)} className="space-y-6 text-[#2C1810]">
        
        {/* Step Wizard Navigation Header */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-border/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#6F4E37] uppercase tracking-wider">
              Step {currentStep} of {steps.length} — {steps[currentStep - 1].title}
            </span>
            <span className="text-xs font-bold text-text/60">
              {Math.round((currentStep / steps.length) * 100)}% Completed
            </span>
          </div>

          {/* Stepper Line Progress */}
          <div className="w-full h-2 bg-surface/70 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#6F4E37] rounded-full"
              initial={{ width: '25%' }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Stepper Tab Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
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
                    "p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5",
                    isCurrent 
                      ? "bg-[#FFF8F0] border-[#DDB892] shadow-2xs" 
                      : isCompleted 
                        ? "bg-surface/40 border-border/40 hover:bg-surface" 
                        : "bg-white border-border/30 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5",
                    isCurrent 
                      ? "bg-[#6F4E37] text-white" 
                      : isCompleted 
                        ? "bg-emerald-500/10 text-emerald-700" 
                        : "bg-surface text-text/50"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : step.id}
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-xs font-extrabold truncate", isCurrent ? "text-[#6F4E37]" : "text-[#2C1810]")}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-text/50 truncate hidden sm:block">{step.description}</p>
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
            
            {/* STEP 1: BASIC & LOCATION INFO */}
            {currentStep === 1 && (
              <div className="space-y-6">
                
                {/* Basic Information */}
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

                {/* Location Details */}
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

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input id="latitude" type="number" step="any" {...register('latitude', { valueAsNumber: true })} error={errors.latitude?.message} placeholder="9.9252" />
                        </div>
                        <div>
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input id="longitude" type="number" step="any" {...register('longitude', { valueAsNumber: true })} error={errors.longitude?.message} placeholder="78.1198" />
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

              </div>
            )}

            {/* STEP 2: PRICING & CAPACITY */}
            {currentStep === 2 && (
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
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6F4E37] font-bold text-xs">
                        ₹
                      </div>
                      <Input id="price" type="number" className="pl-7" {...register('price')} error={errors.price?.message} placeholder="e.g. 500" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="capacity">Max Seating Capacity (Guests) *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-4 w-4 text-text/40" />
                      </div>
                      <Input id="capacity" type="number" className="pl-9" {...register('capacity')} error={errors.capacity?.message} placeholder="e.g. 25" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="google_rating">Google Rating (Optional)</Label>
                    <Input id="google_rating" type="number" step="0.1" min="0" max="5" {...register('google_rating')} error={errors.google_rating?.message} placeholder="4.5" />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-3 pt-6">
                    <input 
                      type="checkbox" 
                      id="provides_event_services" 
                      {...register('provides_event_services')} 
                      className="w-5 h-5 rounded border-border/70 text-[#6F4E37] focus:ring-[#6F4E37]"
                    />
                    <div>
                      <Label htmlFor="provides_event_services" className="mb-0 cursor-pointer font-extrabold text-[#2C1810]">
                        Provides Private Event & Party Services
                      </Label>
                      <p className="text-[10px] text-text/60">Check this if your cafe hosts private birthday parties, workshops, or group gatherings.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: AMENITIES & PHOTOS */}
            {currentStep === 3 && (
              <div className="space-y-6">
                
                {/* Amenities */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-extrabold">
                      <Wifi className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">Venue Amenities & Facilities</h3>
                      <p className="text-xs text-text/60">Select all features available at your cafe</p>
                    </div>
                  </div>
                  <CafeAmenities />
                </div>

                {/* Cover Image Upload */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-extrabold">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">Cover Hero Banner Image</h3>
                      <p className="text-xs text-text/60">Main banner image displayed at the top of your venue page</p>
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
                        <p className="text-xs font-extrabold text-[#2C1810]">Click to upload or drag cover image</p>
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

                {/* Photo Gallery */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">Additional Photo Gallery</h3>
                      <p className="text-xs text-text/60">Upload seating area photos, dining setups, and food photos</p>
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

            {/* STEP 4: BUSINESS HOURS */}
            {currentStep === 4 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#2C1810]">Weekly Operating Hours</h3>
                    <p className="text-xs text-text/60">Set Monday–Sunday opening & closing times</p>
                  </div>
                </div>
                <BusinessHours />
              </div>
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
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border-border/60 text-xs font-bold text-[#2C1810] flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Previous Step
          </Button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {currentStep < 4 ? (
              <Button 
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold shadow-xs flex items-center justify-center gap-1.5"
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
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center justify-center gap-2"
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
