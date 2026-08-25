import React from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata = {
  title: 'Forgot Password - Fahara Cafe',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <AuthCard>
        <AuthLogo />
        <AuthHeader 
          title="Forgot Password" 
          subtitle="Enter your email to receive a 6-digit password reset OTP" 
        />
        <ForgotPasswordForm />
        <AuthFooter 
          text="Remember your password?" 
          linkText="Sign in" 
          href="/owner/login" 
        />
      </AuthCard>
    </div>
  );
}
