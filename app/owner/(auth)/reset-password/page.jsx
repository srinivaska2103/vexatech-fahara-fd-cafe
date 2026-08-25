import React from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password - Fahara Cafe',
};

export default async function ResetPasswordPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const identifier = resolvedSearchParams?.id || resolvedSearchParams?.email || '';

  return (
    <div className="flex flex-col items-center w-full">
      <AuthCard>
        <AuthLogo />
        <AuthHeader 
          title="Reset Password" 
          subtitle="Enter your new password below" 
        />
        <ResetPasswordForm identifier={identifier} />
      </AuthCard>
    </div>
  );
}
