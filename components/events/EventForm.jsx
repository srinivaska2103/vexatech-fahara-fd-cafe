'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '@/schemas/event.schema';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { InclusionModal } from './InclusionModal';
import { EventCard } from './EventCard';
import { useCafes } from '@/hooks/cafe';
import { 
  Info, 
  Tag, 
  Store, 
  Clock, 
  Users, 
  IndianRupee, 
  ChevronDown, 
  Check, 
  Plus, 
  Save, 
  Eye, 
  Package, 
  Edit2, 
  Trash2, 
  Cake, 
  HeartHandshake, 
  Briefcase, 
  PartyPopper, 
  Music, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  ListChecks,
  Globe,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const EVENT_TYPES = [
  { label: 'Birthday', icon: Cake, desc: 'Parties, bash & cake setups', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300' },
  { label: 'Anniversary', icon: HeartHandshake, desc: 'Couples & romantic dinners', color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-300' },
  { label: 'Corporate Meeting', icon: Briefcase, desc: 'Meetings, Wi-Fi & tea/coffee', color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-300' },
  { label: 'Date Night', icon: HeartHandshake, desc: 'Romantic candlelight dates', color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-300' },
  { label: 'Party', icon: PartyPopper, desc: 'General group celebrations', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-300' },
  { label: 'Wedding', icon: PartyPopper, desc: 'Receptions & grand functions', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  { label: 'Engagement', icon: HeartHandshake, desc: 'Rings & intimate gatherings', color: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-300' },
  { label: 'Photoshoot', icon: Sparkles, desc: 'Studio space & lighting setup', color: 'text-fuchsia-600', bg: 'bg-fuchsia-100', border: 'border-fuchsia-300' },
  { label: 'Baby Shower', icon: Cake, desc: 'Family & baby welcoming', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-300' },
  { label: 'Workshop', icon: Sparkles, desc: 'Classes, masterclasses & art', color: 'text-teal-600', bg: 'bg-teal-100', border: 'border-teal-300' },
  { label: 'Other', icon: Store, desc: 'Custom tailored cafe events', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300' },
];

const QUICK_PRICE_PRESETS = [999, 1499, 2499, 3999, 4999, 7999];
const QUICK_GUEST_PRESETS = [2, 5, 10, 15, 20, 30, 50];
const QUICK_DURATION_PRESETS = [
  { value: 90, unit: 'Minutes', label: '90 Mins' },
  { value: 2, unit: 'Hours', label: '2 Hours' },
  { value: 3, unit: 'Hours', label: '3 Hours' },
  { value: 4, unit: 'Hours', label: '4 Hours' },
];

/* Step 1: Interactive Host Cafe Popover Select */
const CustomHostCafeSelect = ({ cafes, value, onChange, disabled, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCafe = cafes.find(c => String(c.id) === String(value)) || cafes[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-4 rounded-xl border flex items-center justify-between text-xs font-bold text-[#2C1810] transition-all cursor-pointer shadow-2xs",
          disabled && "opacity-60 cursor-not-allowed bg-stone-50",
          isOpen ? "border-[#6F4E37] ring-2 ring-[#6F4E37]/20 bg-[#FFF8F0]" : "border-[#E8DED5] bg-white hover:border-[#6F4E37]"
        )}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Store className="w-4 h-4 text-[#6F4E37] shrink-0" />
          <span className="truncate">{selectedCafe ? selectedCafe.name : 'Select Host Cafe'}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-[#6F4E37] transition-transform shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 mt-1.5 z-50 max-h-60 overflow-y-auto rounded-xl bg-white border border-[#E8DED5] shadow-xl p-1.5 space-y-1 custom-scrollbar">
          {cafes.map((cafe) => {
            const isSelected = String(cafe.id) === String(value);
            return (
              <button
                key={cafe.id}
                type="button"
                onClick={() => {
                  onChange(cafe.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-all cursor-pointer text-left",
                  isSelected
                    ? "bg-[#6F4E37] text-white"
                    : "text-[#2C1810] hover:bg-[#FFF8F0] hover:text-[#6F4E37]"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Store className="w-4 h-4 shrink-0" />
                  <span className="truncate">{cafe.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
      {error && <p className="mt-1 text-[10px] text-rose-600">{error}</p>}
    </div>
  );
};

export const EventForm = ({ defaultValues, onSubmit, isLoading, submitLabel = "Save Custom Package" }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: cafesData } = useCafes();
  const cafes = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);

  const [inclusions, setInclusions] = useState([]);
  const [isInclusionModalOpen, setIsInclusionModalOpen] = useState(false);
  const [editingInclusion, setEditingInclusion] = useState(null);

  // Form initialization
  const methods = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      cafe_id: defaultValues?.cafe_id || defaultValues?.cafe?.id || '',
      event_type: defaultValues?.event_type || defaultValues?.category || 'Birthday',
      package_name: defaultValues?.package_name || '',
      price: defaultValues?.price !== undefined && defaultValues?.price !== null ? defaultValues.price : (defaultValues?.base_price || ''),
      maximum_persons: defaultValues?.maximum_persons || defaultValues?.max_guests || '',
      duration_value: defaultValues?.duration_value || defaultValues?.duration_hours || '',
      duration_unit: defaultValues?.duration_unit || 'Hours',
      description: defaultValues?.description || '',
      status: defaultValues?.status || 'PUBLISHED',
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = methods;

  // Real-time watches for live preview
  const watchedCafeId = watch('cafe_id');
  const watchedEventType = watch('event_type');
  const watchedPackageName = watch('package_name');
  const watchedPrice = watch('price');
  const watchedMaxGuests = watch('maximum_persons');
  const watchedDurationValue = watch('duration_value');
  const watchedDurationUnit = watch('duration_unit');
  const watchedDescription = watch('description');
  const watchedStatus = watch('status');

  // Load initial inclusions
  useEffect(() => {
    let incList = defaultValues?.inclusions;
    if (typeof incList === 'string') {
      try { incList = JSON.parse(incList); } catch (e) { incList = []; }
    }
    if (Array.isArray(incList)) {
      setInclusions(incList);
    }
  }, [defaultValues]);

  // Default Host Cafe selection
  useEffect(() => {
    if (!watchedCafeId && cafes.length > 0) {
      setValue('cafe_id', cafes[0].id);
    }
  }, [cafes, watchedCafeId, setValue]);

  // Inclusion Actions
  const handleSaveInclusion = (incData) => {
    if (editingInclusion) {
      setInclusions(prev => prev.map(item => item.id === editingInclusion.id ? incData : item));
    } else {
      setInclusions(prev => [...prev, incData]);
    }
    setEditingInclusion(null);
  };

  const handleRemoveInclusion = (id) => {
    setInclusions(prev => prev.filter(item => item.id !== id));
  };

  const handleFormErrors = (formErrors) => {
    console.error('Validation errors on package save:', formErrors);
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstKey = errorKeys[0];
      const errorMessage = formErrors[firstKey]?.message || `Please check the ${firstKey} field.`;
      toast.error(errorMessage);

      if (['cafe_id', 'event_type', 'package_name'].includes(firstKey)) {
        setCurrentStep(1);
      } else if (['price', 'maximum_persons', 'duration_value', 'duration_unit'].includes(firstKey)) {
        setCurrentStep(2);
      } else if (['inclusions'].includes(firstKey)) {
        setCurrentStep(3);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    const cafeId = formData.cafe_id || (cafes.length > 0 ? cafes[0].id : null);
    if (!cafeId) {
      toast.error("Please select a host cafe for this package.");
      setCurrentStep(1);
      return;
    }

    if (!formData.package_name || !formData.package_name.trim()) {
      toast.error("Package Name is required.");
      setCurrentStep(1);
      return;
    }

    const durationVal = Number(formData.duration_value) || 0;
    const durationUnit = formData.duration_unit || 'Hours';
    const durationHours = durationUnit === 'Minutes' ? Number((durationVal / 60).toFixed(2)) : durationVal;

    const payload = {
      cafe_id: cafeId,
      event_type: formData.event_type || 'Birthday',
      category: formData.event_type || 'Birthday',
      package_name: formData.package_name,
      price: Number(formData.price) || 0,
      base_price: Number(formData.price) || 0,
      maximum_persons: formData.maximum_persons ? Number(formData.maximum_persons) : null,
      max_guests: formData.maximum_persons ? Number(formData.maximum_persons) : null,
      duration_value: durationVal,
      duration_unit: durationUnit,
      duration_hours: durationHours,
      description: formData.description,
      status: formData.status || 'PUBLISHED',
      is_active: formData.status === 'PUBLISHED' || formData.status === 'ACTIVE',
      inclusions: inclusions,
    };

    await onSubmit(payload);
  };

  // Live preview object
  const livePreviewEvent = {
    id: defaultValues?.id || 'preview',
    event_type: watchedEventType || 'Birthday',
    package_name: watchedPackageName || 'Package Name',
    price: Number(watchedPrice) || 0,
    maximum_persons: watchedMaxGuests || null,
    duration_value: watchedDurationValue || null,
    duration_unit: watchedDurationUnit || 'Hours',
    description: watchedDescription || 'Package description preview...',
    inclusions: inclusions,
    status: watchedStatus || 'PUBLISHED',
  };

  const steps = [
    { id: 1, title: 'Event Profile', icon: Info, desc: 'Venue & Event Category' },
    { id: 2, title: 'Rates & Capacity', icon: Sliders, desc: 'Price, Guests & Duration' },
    { id: 3, title: 'Inclusions', icon: ListChecks, desc: 'Custom Features & Services' },
    { id: 4, title: 'Review & Publish', icon: Eye, desc: 'Live Preview & Save' },
  ];

  const nextStep = () => {
    if (currentStep === 1) {
      if (!watchedPackageName || !watchedPackageName.trim()) {
        toast.error("Please enter a Package Name before proceeding.");
        return;
      }
    }
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit, handleFormErrors)} className="space-y-6 text-[#2C1810]">
        
        {/* Wizard Stepper Progress Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E8DED5] shadow-2xs space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#6F4E37] uppercase tracking-wider">
              Step {currentStep} of {steps.length} — {steps[currentStep - 1].title}
            </span>
            <span className="text-xs font-bold text-[#2C1810]/60">
              {Math.round((currentStep / steps.length) * 100)}% Completed
            </span>
          </div>

          {/* Animated Progress Line */}
          <div className="w-full h-2 bg-[#FFF8F0] rounded-full overflow-hidden border border-[#E8DED5]/60">
            <motion.div 
              className="h-full bg-[#6F4E37] rounded-full"
              initial={{ width: '25%' }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Stepper Tab Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const StepIcon = step.icon;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5",
                    isCurrent 
                      ? "bg-[#FFF8F0] border-[#6F4E37] ring-1 ring-[#6F4E37]/20 shadow-2xs" 
                      : isCompleted 
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-800" 
                        : "bg-white border-[#E8DED5] opacity-70 hover:opacity-100"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5",
                    isCurrent 
                      ? "bg-[#6F4E37] text-white" 
                      : isCompleted 
                        ? "bg-emerald-600 text-white" 
                        : "bg-[#FFF8F0] text-[#2C1810]/50"
                  )}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                  </div>

                  <div className="min-w-0">
                    <p className={cn("text-xs font-bold truncate", isCurrent ? "text-[#6F4E37]" : "text-[#2C1810]")}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-[#2C1810]/50 truncate hidden sm:block">{step.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Step Canvas Content & Live Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Form Step Area (7 Cols on desktop, 12 on mobile) */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DED5] shadow-2xs space-y-6"
              >
                
                {/* STEP 1: EVENT PROFILE */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="pb-3 border-b border-[#E8DED5]">
                      <h3 className="text-base font-black text-[#2C1810]">1. Venue & Event Profile</h3>
                      <p className="text-xs text-[#2C1810]/70 mt-0.5">Select the host cafe and choice of event category.</p>
                    </div>

                    {/* Host Cafe Select */}
                    <div>
                      <Label>Select Host Cafe *</Label>
                      <CustomHostCafeSelect
                        cafes={cafes}
                        value={watchedCafeId}
                        onChange={(id) => setValue('cafe_id', id, { shouldValidate: true })}
                        disabled={!!defaultValues?.id}
                        error={errors.cafe_id?.message}
                      />
                    </div>

                    {/* Event Type Interactive Card Grid */}
                    <div>
                      <Label className="mb-2 block">Choose Event Category *</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto custom-scrollbar p-1">
                        {EVENT_TYPES.map((type) => {
                          const Icon = type.icon;
                          const isSelected = watchedEventType === type.label;
                          return (
                            <button
                              key={type.label}
                              type="button"
                              onClick={() => setValue('event_type', type.label, { shouldValidate: true })}
                              className={cn(
                                "p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 shadow-2xs group hover:-translate-y-0.5",
                                isSelected
                                  ? "bg-gradient-to-br from-[#6F4E37] to-[#452718] text-white border-[#6F4E37] shadow-md"
                                  : "bg-white border-stone-200/90 hover:bg-[#FFF8F0] hover:border-[#6F4E37]/40 text-[#2C1810]"
                              )}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className={cn(
                                  "w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs transition-transform group-hover:scale-110 shrink-0",
                                  isSelected
                                    ? "bg-white/20 border-white/30 text-white"
                                    : `${type.bg} ${type.color} ${type.border}`
                                )}>
                                  <Icon className="w-4.5 h-4.5 stroke-[2.5]" />
                                </div>

                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="text-xs font-black leading-snug tracking-tight">{type.label}</p>
                                <p className={cn("text-[10px] mt-0.5 line-clamp-1 font-medium", isSelected ? "text-white/80" : "text-stone-500")}>
                                  {type.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Package Name */}
                    <div>
                      <Label htmlFor="package_name">Package Name *</Label>
                      <Input
                        id="package_name"
                        {...register('package_name')}
                        placeholder="e.g. Birthday Celebration — Package 1"
                        className="mt-1.5 h-11 text-xs font-bold rounded-xl border-[#E8DED5] focus:border-[#6F4E37]"
                      />
                      {errors.package_name && <p className="mt-1 text-[10px] text-rose-600">{errors.package_name.message}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 2: RATES, CAPACITY & DURATION */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="pb-3 border-b border-[#E8DED5]">
                      <h3 className="text-base font-black text-[#2C1810]">2. Rates, Capacity & Duration</h3>
                      <p className="text-xs text-[#2C1810]/70 mt-0.5">Set custom package pricing, maximum guest limits, and duration.</p>
                    </div>

                    {/* Price Input & Quick Presets */}
                    <div>
                      <Label htmlFor="price">Package Price (₹) *</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37] font-black text-sm">
                          ₹
                        </div>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          {...register('price')}
                          placeholder="2499"
                          className="pl-8 h-11 text-sm font-black rounded-xl border-[#E8DED5] focus:border-[#6F4E37]"
                        />
                      </div>

                      {/* Price Preset Chips */}
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider mr-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Presets:
                        </span>
                        {QUICK_PRICE_PRESETS.map((pr) => {
                          const isSelected = Number(watchedPrice) === pr;
                          return (
                            <button
                              key={pr}
                              type="button"
                              onClick={() => setValue('price', pr, { shouldValidate: true })}
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer flex items-center gap-1 shadow-2xs hover:-translate-y-0.5",
                                isSelected
                                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-600 shadow-md"
                                  : "bg-amber-50/70 text-amber-900 border-amber-200/80 hover:bg-amber-100 hover:border-amber-300"
                              )}
                            >
                              <span>₹{pr}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Maximum Guests Input & Quick Presets */}
                    <div>
                      <Label htmlFor="maximum_persons">Maximum Guests / Members</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37]">
                          <Users className="w-4 h-4" />
                        </div>
                        <Input
                          id="maximum_persons"
                          type="number"
                          min="1"
                          {...register('maximum_persons')}
                          placeholder="e.g. 10"
                          className="pl-9 h-11 text-xs font-bold rounded-xl border-[#E8DED5] focus:border-[#6F4E37]"
                        />
                      </div>

                      {/* Guest Presets */}
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider mr-1 flex items-center gap-1">
                          <Users className="w-3 h-3 text-emerald-600" />
                          Guests:
                        </span>
                        {QUICK_GUEST_PRESETS.map((g) => {
                          const isSelected = Number(watchedMaxGuests) === g;
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setValue('maximum_persons', g, { shouldValidate: true })}
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer flex items-center gap-1 shadow-2xs hover:-translate-y-0.5",
                                isSelected
                                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md"
                                  : "bg-emerald-50/70 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300"
                              )}
                            >
                              <span>{g} Guests</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Duration Value & Unit Toggle */}
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration_value">Duration Value</Label>
                          <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6F4E37]">
                              <Clock className="w-4 h-4" />
                            </div>
                            <Input
                              id="duration_value"
                              type="number"
                              min="1"
                              {...register('duration_value')}
                              placeholder="e.g. 2 or 90"
                              className="pl-9 h-11 text-xs font-bold rounded-xl border-[#E8DED5] focus:border-[#6F4E37]"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Duration Unit</Label>
                          <div className="flex items-center gap-1.5 mt-1 p-1 bg-[#FFF8F0] rounded-xl border border-[#E8DED5] h-11">
                            {['Hours', 'Minutes'].map((unit) => {
                              const isSelected = watchedDurationUnit === unit;
                              return (
                                <button
                                  key={unit}
                                  type="button"
                                  onClick={() => setValue('duration_unit', unit)}
                                  className={cn(
                                    "flex-1 h-full rounded-lg text-xs font-extrabold transition-all cursor-pointer text-center flex items-center justify-center",
                                    isSelected
                                      ? "bg-[#6F4E37] text-white shadow-2xs"
                                      : "text-[#2C1810]/70 hover:bg-[#E8DED5]"
                                  )}
                                >
                                  {unit}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Quick Duration Presets */}
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider mr-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-600" />
                          Duration:
                        </span>
                        {QUICK_DURATION_PRESETS.map((dur) => {
                          const isSelected = Number(watchedDurationValue) === dur.value && watchedDurationUnit === dur.unit;
                          return (
                            <button
                              key={dur.label}
                              type="button"
                              onClick={() => {
                                setValue('duration_value', dur.value);
                                setValue('duration_unit', dur.unit);
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer flex items-center gap-1 shadow-2xs hover:-translate-y-0.5",
                                isSelected
                                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-600 shadow-md"
                                  : "bg-cyan-50/70 text-cyan-900 border-cyan-200/80 hover:bg-cyan-100 hover:border-cyan-300"
                              )}
                            >
                              <span>{dur.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description">Package Description *</Label>
                      <textarea
                        id="description"
                        rows={3}
                        {...register('description')}
                        placeholder="Describe what makes this custom package special for your customers..."
                        className="w-full mt-1.5 p-3.5 rounded-xl border border-[#E8DED5] text-xs font-medium focus:border-[#6F4E37] focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: CUSTOM INCLUSIONS */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="pb-3 border-b border-[#E8DED5] flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-black text-[#2C1810]">3. Custom Inclusions</h3>
                        <p className="text-xs text-[#2C1810]/70 mt-0.5">Add items included in this package (Cake, Food, Setup, etc.).</p>
                      </div>

                      <Button
                        type="button"
                        onClick={() => {
                          setEditingInclusion(null);
                          setIsInclusionModalOpen(true);
                        }}
                        className="py-1.5 px-3.5 rounded-xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Inclusion</span>
                      </Button>
                    </div>

                    {/* Inclusions Cards List */}
                    {inclusions.length === 0 ? (
                      <div className="p-8 rounded-2xl border border-dashed border-[#E8DED5] bg-[#FFF8F0]/40 text-center space-y-2">
                        <Package className="w-8 h-8 text-[#6F4E37] mx-auto opacity-70" />
                        <h4 className="text-xs font-black text-[#2C1810]">No Custom Inclusions Added</h4>
                        <p className="text-xs text-[#2C1810]/60 max-w-xs mx-auto">
                          Click "+ Add Inclusion" above to add custom items such as 1 Kg Cake, Table Setup, Welcome Drinks, etc.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {inclusions.map((inc, index) => (
                          <div key={inc.id || index} className="p-3.5 rounded-xl border border-[#E8DED5] bg-white shadow-2xs flex items-start justify-between gap-2.5">
                            <div className="space-y-1">
                              <p className="text-xs font-black text-[#2C1810] flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{inc.name || inc.inclusion_name}</span>
                              </p>
                              {inc.description && (
                                <p className="text-[11px] text-[#2C1810]/60 line-clamp-2 pl-5">{inc.description}</p>
                              )}
                              <p className="text-[10px] font-extrabold text-[#6F4E37] pl-5">
                                Qty: {inc.quantity} {inc.unit}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingInclusion(inc);
                                  setIsInclusionModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-[#2C1810]/60 hover:text-[#6F4E37] hover:bg-[#FFF8F0]"
                                title="Edit Inclusion"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveInclusion(inc.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                                title="Remove Inclusion"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: REVIEW & PUBLISH */}
                {currentStep === 4 && (
                  <div className="space-y-5">
                    <div className="pb-3 border-b border-[#E8DED5]">
                      <h3 className="text-base font-black text-[#2C1810]">4. Final Review & Status</h3>
                      <p className="text-xs text-[#2C1810]/70 mt-0.5">Review package details and set listing status before saving.</p>
                    </div>

                    {/* Listing Status Toggle */}
                    <div className="p-4 rounded-xl border border-[#E8DED5] bg-[#FFF8F0]/40 space-y-2">
                      <Label className="text-xs font-black text-[#2C1810]">Listing Status</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setValue('status', 'PUBLISHED')}
                          className={cn(
                            "p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer",
                            watchedStatus === 'PUBLISHED' || watchedStatus === 'ACTIVE'
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                              : "bg-white text-[#2C1810] border-[#E8DED5] hover:border-emerald-500"
                          )}
                        >
                          <Globe className="w-4 h-4 shrink-0" />
                          <div>
                            <p className="text-xs font-extrabold">Publish (Active)</p>
                            <p className="text-[10px] opacity-80">Visible to diners</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setValue('status', 'DRAFT')}
                          className={cn(
                            "p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer",
                            watchedStatus === 'DRAFT'
                              ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                              : "bg-white text-[#2C1810] border-[#E8DED5] hover:border-amber-500"
                          )}
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          <div>
                            <p className="text-xs font-extrabold">Save Draft</p>
                            <p className="text-[10px] opacity-80">Hidden mode</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step Controls Navigation Bar */}
                <div className="pt-4 border-t border-[#E8DED5] flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={currentStep === 1}
                    onClick={prevStep}
                    className="py-2.5 px-4 rounded-xl border-[#E8DED5] text-xs font-bold text-[#2C1810] flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </Button>

                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="py-2.5 px-6 rounded-xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="py-2.5 px-6 rounded-xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold shadow-2xs flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{submitLabel}</span>
                    </Button>
                  )}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live Package Preview (5 Cols on desktop, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Eye className="w-4 h-4 text-[#6F4E37]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-[#6F4E37]">
                Live Package Card Preview
              </h4>
            </div>

            <EventCard event={livePreviewEvent} />
          </div>

        </div>

        {/* Add / Edit Inclusion Modal */}
        <InclusionModal
          isOpen={isInclusionModalOpen}
          onClose={() => {
            setIsInclusionModalOpen(false);
            setEditingInclusion(null);
          }}
          onSave={handleSaveInclusion}
          initialData={editingInclusion}
        />

      </form>
    </FormProvider>
  );
};
