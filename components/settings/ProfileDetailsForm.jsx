'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { 
  Building2, 
  User, 
  Smartphone, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Map, 
  Flag, 
  Pin as PinIcon, 
  AlignLeft, 
  Image as ImageIcon, 
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Save,
  FileText
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileDetailsForm = ({ initialData, onSubmit, isPending }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    trigger,
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: initialData || {
      name: '', 
      email: '', 
      phone: '', 
      password: '', 
      profile_image: '',
      business_name: '', 
      gst_number: '',
      description: '', 
      address: '', 
      city: '', 
      state: '', 
      country: 'India', 
      pincode: ''
    },
    values: initialData
  });

  const profileImageUrl = watch('profile_image');

  // Validate current step before advancing
  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['name', 'email', 'phone']);
    } else if (currentStep === 2) {
      isValid = await trigger(['business_name', 'description']);
    }
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const steps = [
    { 
      number: 1, 
      title: 'Personal Info', 
      description: 'Name & Contact', 
      icon: User,
      activeBg: 'bg-gradient-to-r from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] text-white border-[#DDB892]/40 shadow-xs shadow-[#6F4E37]/20',
      badgeBg: 'bg-white/20 text-white',
      completedBg: 'bg-[#6F4E37]/10 text-[#6F4E37] border-[#6F4E37]/30 hover:bg-[#6F4E37]/20'
    },
    { 
      number: 2, 
      title: 'Business Profile', 
      description: 'Venue Identity', 
      icon: Briefcase,
      activeBg: 'bg-gradient-to-r from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] text-white border-[#DDB892]/40 shadow-xs shadow-[#6F4E37]/20',
      badgeBg: 'bg-white/20 text-white',
      completedBg: 'bg-[#6F4E37]/10 text-[#6F4E37] border-[#6F4E37]/30 hover:bg-[#6F4E37]/20'
    },
    { 
      number: 3, 
      title: 'Location & Address', 
      description: 'Address Details', 
      icon: MapPin,
      activeBg: 'bg-gradient-to-r from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] text-white border-[#DDB892]/40 shadow-xs shadow-[#6F4E37]/20',
      badgeBg: 'bg-white/20 text-white',
      completedBg: 'bg-[#6F4E37]/10 text-[#6F4E37] border-[#6F4E37]/30 hover:bg-[#6F4E37]/20'
    }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 sm:p-6 rounded-3xl border border-border/60 shadow-xs relative overflow-hidden text-[#2C1810]">
      
      {/* 3 Step Stepper Navigation Header */}
      <div className="border-b border-border/40 pb-4">
        <div className="flex items-center justify-between gap-2.5 overflow-x-auto custom-scrollbar pb-1">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;

            return (
              <div 
                key={step.number}
                onClick={() => {
                  if (step.number < currentStep) setCurrentStep(step.number);
                }}
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer min-w-[150px] flex-1",
                  isActive 
                    ? step.activeBg 
                    : isCompleted 
                    ? step.completedBg 
                    : "bg-surface/30 text-text/50 border-border/40 cursor-not-allowed opacity-70"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-[11px] shrink-0 shadow-2xs transition-colors",
                  isActive 
                    ? step.badgeBg 
                    : isCompleted 
                    ? "bg-[#6F4E37] text-white" 
                    : "bg-border/40 text-text/60"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : step.number}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-extrabold truncate">{step.title}</span>
                  <span className={cn("text-[10px] truncate mt-0.5", isActive ? "text-white/90" : "text-text/60")}>
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-[#6F4E37]/15 h-1.5 rounded-full mt-3 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] rounded-full shadow-2xs"
            initial={{ width: '33.33%' }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content Container with Framer Motion */}
      <AnimatePresence mode="wait">
        
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 pb-1">
              <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-700">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#2C1810]">Step 1: Personal Information</h3>
                <p className="text-[11px] text-text/60">Account owner contact & profile avatar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="text" 
                    placeholder="Enter owner name"
                    {...register('name', { required: 'Full name is required' })} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10", 
                      errors.name ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
                {errors.name && <p className="text-[10px] text-danger mt-0.5">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="email" 
                    placeholder="owner@example.com"
                    {...register('email', { required: 'Email address is required' })} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10", 
                      errors.email ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
                {errors.email && <p className="text-[10px] text-danger mt-0.5">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="text" 
                    placeholder="10-digit mobile number"
                    {...register('phone', { required: 'Phone number is required' })} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10", 
                      errors.phone ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-danger mt-0.5">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Password (Optional)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="password" 
                    placeholder="Leave blank to keep unchanged"
                    {...register('password')} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10", 
                      errors.password ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
              </div>

              {/* Profile Image Drag & Drop Avatar */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-[#2C1810]">Profile Image Avatar</label>
                <div 
                  className={cn(
                    "border border-dashed rounded-2xl p-4 flex items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden min-h-[90px]",
                    "hover:bg-[#FFF8F0]/80 hover:border-[#6F4E37]/60",
                    errors.profile_image ? "border-danger bg-danger/5" : "border-[#DDB892]/60 bg-surface/20"
                  )}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setValue('profile_image', event.target.result, { shouldDirty: true });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onClick={() => document.getElementById('profile_image_input')?.click()}
                >
                  {profileImageUrl ? (
                    <div className="flex items-center gap-3.5 w-full">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-600/30 shadow-xs shrink-0">
                        <img src={profileImageUrl} alt="Profile preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-xs font-bold text-[#2C1810]">Avatar Uploaded</p>
                        <p className="text-[10px] text-text/60">Click or drag image to update avatar</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-800 text-[10px] font-bold rounded-md">
                          Change Avatar
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-[#2C1810]">Click or Drag Avatar Image</p>
                        <p className="text-[10px] text-text/50">PNG, JPG or WEBP (Max 5MB)</p>
                      </div>
                    </div>
                  )}
                  <input 
                    id="profile_image_input"
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setValue('profile_image', event.target.result, { shouldDirty: true });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <input type="hidden" {...register('profile_image')} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: BUSINESS INFORMATION */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 pb-1">
              <div className="p-1.5 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37]">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#2C1810]">Step 2: Business Profile</h3>
                <p className="text-[11px] text-text/60">Venue business identity and details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Business Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Business / Cafe Name *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="text" 
                    placeholder="Official Registered Business Name"
                    {...register('business_name', { required: 'Business name is required' })} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10", 
                      errors.business_name ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
                {errors.business_name && <p className="text-[10px] text-danger mt-0.5">{errors.business_name.message}</p>}
              </div>

              {/* GST / Business Tax ID Number */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2C1810] mb-1">GST / Tax ID Number (Optional)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="text" 
                    placeholder="22AAAAA0000A1Z5 (GST Registration)"
                    {...register('gst_number')} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10", 
                      errors.gst_number ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Business Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-text/40" />
                  <textarea 
                    rows={3}
                    placeholder="Describe your venue ambience, food items, seating capacity, and features..."
                    {...register('description')} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 resize-none", 
                      errors.description ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: LOCATION & ADDRESS */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 pb-1">
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#2C1810]">Step 3: Location & Address</h3>
                <p className="text-[11px] text-text/60">Official venue location & postal details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Street Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="text" 
                    placeholder="Building name, Street, Landmark"
                    {...register('address')} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10", 
                      errors.address ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">City</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="text" 
                    placeholder="City name"
                    {...register('city')} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10", 
                      errors.city ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">State</label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="text" 
                    placeholder="State"
                    {...register('state')} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10", 
                      errors.state ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Country</label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="text" 
                    placeholder="India"
                    {...register('country')} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10", 
                      errors.country ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] mb-1">Postal Pincode</label>
                <div className="relative">
                  <PinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                  <input 
                    type="text" 
                    placeholder="6-digit postal code"
                    {...register('pincode')} 
                    className={cn(
                      "w-full pl-9 pr-3.5 py-2.5 rounded-xl border bg-surface/30 text-xs font-medium transition-all hover:bg-surface/50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10", 
                      errors.pincode ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border/60"
                    )} 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation Controls */}
      <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={cn(
            "w-full sm:w-auto py-2 px-4 rounded-xl border border-border/60 font-bold text-xs flex items-center justify-center gap-1 transition-colors",
            currentStep === 1 ? "opacity-40 cursor-not-allowed text-text/40" : "hover:bg-surface text-[#6F4E37]"
          )}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Previous Step
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full sm:w-auto py-2 px-5 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white font-extrabold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1"
            >
              Next Step <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : null}

          <Button 
            type="submit" 
            disabled={!isDirty && currentStep !== 3} 
            isLoading={isPending} 
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold shadow-xs flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Save Profile Details
          </Button>
        </div>
      </div>
    </form>
  );
};
