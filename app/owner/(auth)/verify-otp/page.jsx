import React from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { VerifyOtpForm } from '@/components/auth/VerifyOtpForm';

export const metadata = {
  title: 'Verify OTP - Fahara Cafe',
};

export default async function VerifyOtpPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const identifier = resolvedSearchParams?.id || resolvedSearchParams?.email;

  return (
    <div className="flex flex-col items-center w-full">
      <AuthCard>
        <AuthLogo />
        <AuthHeader 
          title="Verify Your Account" 
          subtitle="Enter the OTP sent to your email" 
        />
        <VerifyOtpForm identifier={identifier} email={identifier} />
      </AuthCard>
    </div>
  );
}
