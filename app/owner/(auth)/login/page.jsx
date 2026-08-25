import React from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Owner Login - Fahara Cafe',
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <AuthCard>
        <AuthLogo />
        <AuthHeader 
          title="Cafe Owner Login" 
          subtitle="Sign in to your Venue Dashboard" 
        />
        <LoginForm 
          role="CAFE_OWNER"
          registerLink="/owner/signup"
          forgotPasswordLink="/owner/forgotpassword"
        />
        <AuthFooter 
          text="Don't have a cafe account?" 
          linkText="Sign up" 
          href="/owner/signup" 
        />
      </AuthCard>
    </div>
  );
}
