'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '@/schemas/event.schema';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { GalleryUploader } from './GalleryUploader';
import { EventPricing } from './EventPricing';
import { InclusionsSection } from './InclusionsSection';
import { useCafes } from '@/hooks/cafe';
import { 
  Info, 
  Tag, 
  Store, 
  ListChecks, 
  Clock, 
  Users, 
  IndianRupee, 
  ChevronDown, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  CheckCircle2, 
  Globe, 
  FileText, 
  EyeOff, 
  Sparkles, 
  Cake, 
  HeartHandshake, 
  Briefcase, 
  PartyPopper, 
  Music, 
  Image as ImageIcon 
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS = [
  { value: 'PUBLISHED', label: 'Publish (Active)', desc: 'Live & visible to customers for bookings', badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30', icon: Globe },
  { value: 'DRAFT', label: 'Save as Draft', desc: 'Hidden in draft mode while editing', badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-500/30', icon: FileText },
  { value: 'INACTIVE', label: 'Hidden (Inactive)', desc: 'Temporarily taken offline', badgeBg: 'bg-rose-500/10 text-rose-700 border-rose-500/30', icon: EyeOff },
];

const EVENT_TYPES = [
  { label: 'Birthday Party', icon: Cake },
  { label: 'Anniversary & Couples', icon: HeartHandshake },
  { label: 'Corporate Meeting', icon: Briefcase },
  { label: 'Wedding Reception', icon: PartyPopper },
  { label: 'Private Dining Party', icon: PartyPopper },
  { label: 'Workshop & Masterclass', icon: Sparkles },
  { label: 'Live Music & Concert', icon: Music },
  { label: 'Other Special Event', icon: Store },
];

/* Custom Modern Status Popover */
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

/* Custom Modern Cafe Popover Select */
const ModernCafeSelect = ({ cafes, value, onChange, error, register, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCafe = cafes.find(c => String(c.id) === String(value));

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
      <input type="hidden" {...register('cafe_id')} />
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-4 rounded-xl border bg-surface/30 flex items-center justify-between text-xs font-medium transition-all text-[#2C1810]",
          disabled && "opacity-60 cursor-not-allowed bg-surface/60",
          error ? "border-danger" : isOpen ? "border-[#6F4E37] bg-white ring-2 ring-[#6F4E37]/10" : "border-border/60 hover:bg-white"
        )}
      >
        <span className={cn(selectedCafe ? "font-bold text-[#2C1810]" : "text-text/50")}>
          {selectedCafe ? selectedCafe.name : "-- Choose a Cafe --"}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-text/40 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl border border-[#DDB892]/60 shadow-xl z-50 p-2 space-y-1 text-[#2C1810] animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto custom-scrollbar">
          {cafes.map((cafe) => {
            const isSelected = String(value) === String(cafe.id);
            return (
              <button
                key={cafe.id}
                type="button"
                onClick={() => {
                  onChange(cafe.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-[#6F4E37] text-white shadow-2xs"
                    : "text-[#2C1810] hover:bg-[#6F4E37]/10 hover:text-[#6F4E37]"
                )}
              >
                <div className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5" />
                  <span>{cafe.name}</span>
                </div>
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

/* Custom Modern Category Popover Select */
const ModernEventTypeSelect = ({ value, onChange, error, register }) => {
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
      <input type="hidden" {...register('event_type')} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-4 rounded-xl border bg-surface/30 flex items-center justify-between text-xs font-medium transition-all text-[#2C1810]",
          error ? "border-danger" : isOpen ? "border-[#6F4E37] bg-white ring-2 ring-[#6F4E37]/10" : "border-border/60 hover:bg-white"
        )}
      >
        <span className={cn(value ? "font-bold text-[#2C1810]" : "text-text/50")}>
          {value || "Select Category / Event Type"}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-text/40 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl border border-[#DDB892]/60 shadow-xl z-50 p-2 space-y-1 text-[#2C1810] animate-in fade-in zoom-in-95 duration-150">
          {EVENT_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = value === type.label;
            return (
              <button
                key={type.label}
                type="button"
                onClick={() => {
                  onChange(type.label);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-[#6F4E37] text-white shadow-2xs"
                    : "text-[#2C1810] hover:bg-[#6F4E37]/10 hover:text-[#6F4E37]"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{type.label}</span>
                </div>
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

export const EventForm = ({ defaultValues, onSubmit, isLoading, submitLabel = "Save Event Package" }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: cafesData } = useCafes();
  const cafes = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);

  const methods = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      cafe_id: '',
      event_type: '',
      package_name: '',
      description: '',
      price: '',
      duration_hours: '',
      minimum_persons: '',
      maximum_persons: '',
      food: false,
      cake: false,
      decoration: false,
      music: false,
      other: false,
      other_text: '',
      status: 'DRAFT',
      cover_image: '',
      gallery: [],
      ...defaultValues
    },
  });

  const { register, formState: { errors }, handleSubmit, setValue, watch } = methods;
  const currentStatus = watch('status');
  const currentCafeId = watch('cafe_id');
  const currentEventType = watch('event_type');
  const coverImage = watch('cover_image');

  const [uploading, setUploading] = useState(false);

  const handleFinalSubmit = async (data) => {
    try {
      setUploading(true);
      let coverImageUrl = defaultValues?.cover_image || data.cover_image;

      // Check if a new file upload was added
      if (data.gallery && data.gallery.length > 0 && data.gallery[0].file) {
        const formData = new FormData();
        formData.append('image', data.gallery[0].file);
        
        const { axiosInstance } = await import('@/lib/axios');
        const res = await axiosInstance.post('/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        coverImageUrl = res.data.data.url;
      }

      const finalData = { ...data, cover_image: coverImageUrl };
      await onSubmit(finalData);
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onFormError = (errors) => {
    console.error("Form validation errors:", errors);
  };

  const steps = [
    { id: 1, title: 'Package Profile', icon: Info, description: 'Select venue cafe, title & event category' },
    { id: 2, title: 'Capacity & Pricing', icon: Tag, description: 'Base package rate & guest limits' },
    { id: 3, title: 'Inclusions & Media', icon: ListChecks, description: 'Party inclusions & photo gallery' },
  ];

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFinalSubmit, onFormError)} className="space-y-6 text-[#2C1810]">
        
        {/* 3-Step Wizard Navigation Header */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-border/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#6F4E37] uppercase tracking-wider">
              Step {currentStep} of {steps.length} — {steps[currentStep - 1].title}
            </span>
            <span className="text-xs font-bold text-text/60">
              {Math.round((currentStep / steps.length) * 100)}% Completed
            </span>
          </div>

          {/* Stepper Progress Line */}
          <div className="w-full h-2 bg-surface/70 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#6F4E37] rounded-full"
              initial={{ width: '33%' }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Stepper Tab Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3",
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
                    <p className="text-[10px] text-text/50 truncate">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Canvas Body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            
            {/* STEP 1: PACKAGE PROFILE & VENUE */}
            {currentStep === 1 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <div className="w-10 h-10 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#2C1810]">Package Basic Profile</h3>
                    <p className="text-xs text-text/60">Select venue cafe, event title, category, and duration</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Label htmlFor="cafe_id">Select Host Cafe *</Label>
                    <ModernCafeSelect 
                      cafes={cafes} 
                      value={currentCafeId}
                      onChange={(id) => setValue('cafe_id', id, { shouldDirty: true, shouldValidate: true })}
                      error={errors.cafe_id?.message}
                      register={register}
                      disabled={!!defaultValues?.id}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="package_name">Event Package Name *</Label>
                    <Input id="package_name" {...register('package_name')} error={errors.package_name?.message} placeholder="e.g. Premium Birthday Bash Package" />
                  </div>

                  <div>
                    <Label htmlFor="event_type">Category / Event Type *</Label>
                    <ModernEventTypeSelect 
                      value={currentEventType}
                      onChange={(type) => {
                        setValue('event_type', type, { shouldDirty: true, shouldValidate: true });
                        if (type !== 'Other Custom Category') {
                          setValue('custom_category', type, { shouldDirty: true });
                        }
                      }}
                      error={errors.event_type?.message}
                      register={register}
                    />
                  </div>

                  <div>
                    <Label htmlFor="custom_category">Custom Category Name / Sub-Category</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
                        <Tag className="w-4 h-4" />
                      </div>
                      <Input 
                        id="custom_category" 
                        {...register('custom_category')} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setValue('custom_category', val, { shouldDirty: true });
                          if (val && (currentEventType === 'Other Custom Category' || currentEventType === 'Other' || !currentEventType)) {
                            setValue('event_type', val, { shouldDirty: true, shouldValidate: true });
                          }
                        }}
                        placeholder="e.g. Acoustic Unplugged, Stand-up Comedy, Pottery Workshop" 
                      />
                    </div>
                    <p className="text-[10px] text-text/50 mt-1">Type custom category name if not listed in preset dropdown.</p>
                  </div>

                  <div>
                    <Label htmlFor="duration_hours">Duration (Hours) *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/40">
                        <Clock className="w-4 h-4" />
                      </div>
                      <Input id="duration_hours" type="number" className="pl-9" {...register('duration_hours')} error={errors.duration_hours?.message} placeholder="e.g. 4" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Full Package Description *</Label>
                    <textarea 
                      id="description" 
                      {...register('description')} 
                      rows={4}
                      className={cn(
                        "w-full rounded-2xl border bg-surface/30 px-4 py-3 text-xs font-medium focus:outline-none focus:bg-white focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 transition-all resize-none leading-relaxed", 
                        errors.description ? "border-danger" : "border-border/60"
                      )}
                      placeholder="Describe what makes this event package special..."
                    />
                    {errors.description && <p className="mt-1 text-[10px] text-danger">{errors.description.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CAPACITY & PRICING */}
            {currentStep === 2 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center font-extrabold">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#2C1810]">Pricing & Guest Capacity</h3>
                    <p className="text-xs text-text/60">Set base package price and minimum/maximum guest seating limits</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <EventPricing />
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minimum_persons">Min Guests *</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text/40">
                            <Users className="w-4 h-4" />
                          </div>
                          <Input id="minimum_persons" type="number" className="pl-9" {...register('minimum_persons')} error={errors.minimum_persons?.message} placeholder="1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="maximum_persons">Max Guests</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text/40">
                            <Users className="w-4 h-4" />
                          </div>
                          <Input id="maximum_persons" type="number" className="pl-9" {...register('maximum_persons')} error={errors.maximum_persons?.message} placeholder="50" />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-text/50">Leave max guests empty if seating capacity is flexible.</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: INCLUSIONS & MEDIA */}
            {currentStep === 3 && (
              <div className="space-y-6">
                
                {/* Party Inclusions */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-extrabold">
                      <ListChecks className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">Included Features & Services</h3>
                      <p className="text-xs text-text/60">Select services included in this package</p>
                    </div>
                  </div>
                  <InclusionsSection />
                </div>

                {/* Photo Gallery */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-extrabold">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">Package Photos & Gallery</h3>
                      <p className="text-xs text-text/60">Upload photos of past party setups, decorations, and food spreads</p>
                    </div>
                  </div>
                  <GalleryUploader 
                    value={watch('gallery') || []}
                    onChange={(files) => setValue('gallery', files, { shouldDirty: true })}
                    maxFiles={6}
                  />
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Wizard Action Controls */}
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
            {currentStep < 3 ? (
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
                  isLoading={isLoading || uploading}
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
