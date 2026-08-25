import React from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Owner Register - Fahara Cafe',
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <AuthCard>
        <AuthLogo />
        <AuthHeader 
          title="Create an Owner Account" 
          subtitle="Join Fahara as a Cafe Owner" 
        />
        <RegisterForm defaultRole="CAFE_OWNER" loginRoute="/owner/login" />
        <AuthFooter 
          text="Already have an account?" 
          linkText="Sign in" 
          href="/owner/login" 
        />
      </AuthCard>
    </div>
  );
}
