'use client';
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { CafeForm } from '@/components/cafes/CafeForm';
import { useCafe, useUpdateCafe } from '@/hooks/cafe';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit2, Store } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';

export default function EditCafePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { data: cafeData, isLoading: isFetching } = useCafe(id);
  const cafe = cafeData?.data || cafeData;
  const updateMutation = useUpdateCafe();

  const handleSubmit = (data) => {
    // Map frontend form data to exactly match backend API schema
    const payload = {
      name: data.name,
      description: data.description || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      country: data.country || "",
      pincode: data.pincode || "",
      category: data.category || "",
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      price_per_hour: data.price ? Number(data.price) : 0,
      maximum_persons: data.capacity ? Number(data.capacity) : null,
      google_rating: data.google_rating !== "" && data.google_rating !== null && data.google_rating !== undefined ? Number(data.google_rating) : null,
      provides_event_services: data.provides_event_services || false,
      allow_third_party_decoration: data.allow_third_party_decoration ?? true,
      cover_image: data.cover_image || (data.gallery && data.gallery.length > 0 ? (data.gallery[0].file_url || data.gallery[0].url || (typeof data.gallery[0] === 'string' ? data.gallery[0] : "")) : ""),
      gallery: data.gallery ? data.gallery.map(img => img.file_url || img.url || (typeof img === 'string' ? img : "")) : [],
      amenities: data.amenities || [],
      discounts: data.discounts || null,
      business_hours: data.businessHours || null,
      status: data.status || "ACTIVE"
    };

    updateMutation.mutate({ id, data: payload }, {
      onSuccess: () => {
        router.push(`/owner/cafes/${id}`);
      }
    });
  };

  if (isFetching) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <LoadingSkeleton type="card" className="h-[120px] rounded-3xl" />
        <LoadingSkeleton type="list" className="h-[400px] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Modern Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <BackButton href={`/owner/cafes/${id}`} label="Back to Details" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">
                Edit {cafe?.name || 'Cafe Venue'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-extrabold">
                WIZARD
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-0.5">
              Update venue details, pricing rates, amenities, and operating business hours step-by-step.
            </p>
          </div>
        </div>
      </div>

      {/* 4-Step Interactive Edit Stepper Form */}
      <div className="max-w-5xl mx-auto">
        <CafeForm 
          defaultValues={cafe ? {
            ...cafe,
            email: cafe.email || cafe.users?.email || '',
            phone: cafe.phone || cafe.users?.phone || '',
            price: cafe.price_per_hour ?? '',
            capacity: cafe.maximum_persons ?? '',
            google_rating: cafe.google_rating ?? '',
            amenities: cafe.amenities || [],
            businessHours: (() => {
              if (cafe.cafe_business_hours && Array.isArray(cafe.cafe_business_hours) && cafe.cafe_business_hours.length > 0) {
                const hoursObj = {};
                cafe.cafe_business_hours.forEach(hour => {
                  const day = hour.day_of_week.toLowerCase();
                  
                  let openTime = '';
                  let closeTime = '';
                  
                  if (hour.open_time) {
                    const d = new Date(hour.open_time);
                    if (!isNaN(d.getTime())) {
                      openTime = `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
                    } else if (typeof hour.open_time === 'string' && hour.open_time.includes(':')) {
                      openTime = hour.open_time.substring(0, 5);
                    }
                  }
                  
                  if (hour.close_time) {
                    const d = new Date(hour.close_time);
                    if (!isNaN(d.getTime())) {
                      closeTime = `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
                    } else if (typeof hour.close_time === 'string' && hour.close_time.includes(':')) {
                      closeTime = hour.close_time.substring(0, 5);
                    }
                  }

                  hoursObj[day] = {
                    isOpen: !hour.is_closed,
                    open: openTime,
                    close: closeTime
                  };
                });
                return hoursObj;
              }
              return cafe.business_hours || undefined;
            })(),
            gallery: Array.isArray(cafe.gallery) ? cafe.gallery : []
          } : {}}
          onSubmit={handleSubmit} 
          isLoading={updateMutation.isPending} 
          submitLabel="Save Cafe Changes"
        />
      </div>

    </div>
  );
}
