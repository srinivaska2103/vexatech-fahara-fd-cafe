import React from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Owner Register - Fahara Cafe',
};

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;
  const roleParam = params?.role?.toUpperCase();
  const isRestaurant = roleParam === 'RESTAURANT' || roleParam === 'RESTAURANT_OWNER';
  const defaultRole = isRestaurant ? 'RESTAURANT_OWNER' : 'CAFE_OWNER';

  return (
    <div className="flex flex-col items-center w-full">
      <AuthCard>
        <AuthLogo />
        <AuthHeader 
          title={isRestaurant ? "Restaurant Partner Registration" : "Cafe Partner Registration"} 
          subtitle={isRestaurant ? "Join Fahara as a Restaurant Partner" : "Join Fahara as a Cafe Partner"} 
        />
        <RegisterForm defaultRole={defaultRole} loginRoute="/owner/login" />
        <AuthFooter 
          text="Already have an account?" 
          linkText="Sign in" 
          href="/owner/login" 
        />
      </AuthCard>
    </div>
  );
}
