'use client';
import React from 'react';
import { useBusinessProfile, useUpdateBusinessProfile } from '@/hooks/settings';
import { ProfileDetailsForm } from '@/components/settings/ProfileDetailsForm';
import { LoadingSkeleton } from '@/components/settings/LoadingSkeleton';
import { DangerZone } from '@/components/settings/DangerZone';
import { UserCheck, Sparkles, ShieldCheck, Building2 } from 'lucide-react';

export default function BusinessProfilePage() {
  const { data: profileData, isLoading, isError } = useBusinessProfile();
  const updateMutation = useUpdateBusinessProfile();

  const data = profileData?.data;

  if (isLoading) return <LoadingSkeleton />;

  if (isError && !data) {
    return (
      <div className="bg-rose-500/10 text-rose-700 p-6 rounded-3xl border border-rose-500/20 text-center text-xs">
        <p className="font-extrabold text-sm mb-1">Error Loading Owner Profile</p>
        <p>Please check backend API endpoint connectivity and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#2C1810]">
      {/* SaaS Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACCOUNT & VENUE IDENTITY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            Cafe Owner Profile Details
          </h1>
          <p className="text-xs sm:text-sm text-text/70 max-w-xl">
            Manage your personal owner account details, venue business profile, GST credentials, and cafe location details.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] flex items-center gap-2.5 text-xs font-extrabold shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-[#6F4E37]" />
            <span>Verified Owner Profile</span>
          </div>
        </div>
      </div>

      <ProfileDetailsForm 
        initialData={data} 
        onSubmit={(formData) => updateMutation.mutate(formData)} 
        isPending={updateMutation.isPending}
      />

      <DangerZone />
    </div>
  );
}
