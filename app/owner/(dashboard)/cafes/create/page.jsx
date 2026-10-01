'use client';
import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { CafeForm } from '@/components/cafes/CafeForm';
import { useCreateCafe, useCafes } from '@/hooks/cafe';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

export default function CreateCafePage() {
  const router = useRouter();
  const createMutation = useCreateCafe();
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);

  const { data: cafesData } = useCafes();
  const cafes = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);
  const isLimitReached = cafes.length >= 3;

  const isWalkingCafe = 
    role === 'WALKING_CAFE_OWNER' || 
    user?.role === 'WALKING_CAFE_OWNER' || 
    String(role || '').toUpperCase().includes('WALKING');

  const handleSubmit = (data) => {
    if (isLimitReached) return;

    const isWalking = isWalkingCafe || data.is_walking_cafe === true || (data.category || '').toLowerCase().includes('walking');

    // Map frontend form data to match backend API schema
    const payload = {
      name: data.name,
      description: data.description || "",
      category: data.category || (isWalking ? "Coffee Cafe" : "Coffee Shop"),
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      country: data.country || "",
      pincode: data.pincode || "",
      latitude: (data.latitude !== undefined && data.latitude !== null && data.latitude !== '' && Number.isFinite(Number(data.latitude))) ? Number(data.latitude) : null,
      longitude: (data.longitude !== undefined && data.longitude !== null && data.longitude !== '' && Number.isFinite(Number(data.longitude))) ? Number(data.longitude) : null,
      price_per_hour: isWalking ? null : (data.price ? Number(data.price) : 0),
      maximum_persons: data.capacity ? Number(data.capacity) : null,
      google_rating: data.google_rating !== "" && data.google_rating !== null && data.google_rating !== undefined ? Number(data.google_rating) : null,
      google_reviews_link: data.google_reviews_link || "",
      provides_event_services: isWalking ? false : Boolean(data.provides_event_services),
      allow_third_party_decoration: isWalking ? false : Boolean(data.allow_third_party_decoration ?? true),
      is_walking_cafe: isWalking,
      walk_in: true,
      table_reservation: !isWalking,
      event_booking: !isWalking && Boolean(data.provides_event_services),
      event_packages: !isWalking && Boolean(data.event_packages ?? true),
      event_facilities: !isWalking && Boolean(data.provides_event_services),
      capabilities: {
        ...(data.capabilities || {}),
        walk_in: true,
        table_reservation: !isWalking,
        event_booking: !isWalking && Boolean(data.provides_event_services),
        event_packages: !isWalking && Boolean(data.event_packages ?? true),
        event_facilities: !isWalking && Boolean(data.provides_event_services),
        event_types: data.capabilities?.event_types || [],
      },
      cover_image: data.cover_image || (data.gallery && data.gallery.length > 0 ? (data.gallery[0].file_url || data.gallery[0].url || (typeof data.gallery[0] === 'string' ? data.gallery[0] : "")) : ""),
      gallery: data.gallery ? data.gallery.map(img => img.file_url || img.url || (typeof img === 'string' ? img : "")) : [],
      amenities: data.amenities || [],
      discounts: isWalking ? null : (data.discounts || null),
      business_hours: data.businessHours || null,
      status: data.status || "ACTIVE"
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        router.push('/owner/cafes');
      }
    });
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <BackButton href="/owner/cafes" label="Back to Cafes" />
      </div>

      <PageHeader 
        title={isWalkingCafe ? "Create Walking Cafe" : "Create New Cafe"} 
        subtitle={isWalkingCafe 
          ? "Add a new Walk-in Cafe listing to your portfolio for walk-in customer discovery."
          : "Add a new venue to your portfolio. You can manage images and availability after creating."
        }
      />

      {isLimitReached && (
        <div className="max-w-5xl mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Cafe Creation Limit Reached (3/3)</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              You have already registered the maximum allowed 3 cafes for your owner account. Please delete or modify an existing cafe to create a new one.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-5xl">
        <CafeForm 
          onSubmit={handleSubmit} 
          isLoading={createMutation.isPending || isLimitReached} 
          submitLabel={isLimitReached ? "Limit Reached (3/3)" : (isWalkingCafe ? "Create Walking Cafe" : "Create Cafe")}
        />
      </div>
    </PageContainer>
  );
}
