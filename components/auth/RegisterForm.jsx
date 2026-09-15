'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../schemas/auth.schema';
import { useRegister } from '@/hooks/auth/useRegister';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { PasswordInput } from './PasswordInput';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, UserPlus, Coffee, Utensils, Footprints } from 'lucide-react';

export const RegisterForm = ({ defaultRole = 'CAFE_OWNER' }) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState(defaultRole);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister((res) => {
    const userId = res?.user?.id || res?.userId || res?.data?.user?.id;
    if (userId) {
      router.push(`/owner/verify-otp?id=${encodeURIComponent(userId)}`);
    } else {
      router.push('/owner/verify-otp');
    }
  });

  const onSubmit = (data) => {
    const payload = { ...data, roleName: selectedRole };
    registerMutation.mutate(payload);
  };

  const getRoleLabel = () => {
    if (selectedRole === 'WALKING_CAFE_OWNER') return 'Walking Cafe Partner';
    if (selectedRole === 'RESTAURANT_OWNER') return 'Restaurant Owner';
    return 'Cafe Owner';
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-3.5 text-[#2C1810]"
    >
      {/* Account Type Selection */}
      <div className="space-y-1">
        <Label className="text-xs font-extrabold text-[#2C1810]/80 uppercase tracking-wider">Account Type</Label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedRole('WALKING_CAFE_OWNER')}
            className={`py-2 px-2 rounded-xl border text-[11px] font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'WALKING_CAFE_OWNER'
                ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm'
                : 'bg-white text-[#2C1810]/70 border-border/60 hover:bg-[#FAF0E6]/50'
            }`}
          >
            <Footprints className={`w-3.5 h-3.5 ${selectedRole === 'WALKING_CAFE_OWNER' ? 'text-amber-200' : 'text-[#6F4E37]'}`} />
            <span>Walking Cafe</span>
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedRole('CAFE_OWNER')}
            className={`py-2 px-2 rounded-xl border text-[11px] font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'CAFE_OWNER'
                ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm'
                : 'bg-white text-[#2C1810]/70 border-border/60 hover:bg-[#FAF0E6]/50'
            }`}
          >
            <Coffee className={`w-3.5 h-3.5 ${selectedRole === 'CAFE_OWNER' ? 'text-amber-200' : 'text-[#6F4E37]'}`} />
            <span>Cafe Owner</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('RESTAURANT_OWNER')}
            className={`py-2 px-2 rounded-xl border text-[11px] font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'RESTAURANT_OWNER'
                ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm'
                : 'bg-white text-[#2C1810]/70 border-border/60 hover:bg-[#FAF0E6]/50'
            }`}
          >
            <Utensils className={`w-3.5 h-3.5 ${selectedRole === 'RESTAURANT_OWNER' ? 'text-amber-200' : 'text-[#6F4E37]'}`} />
            <span>Restaurant</span>
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="name" className="text-xs font-extrabold text-[#2C1810]/80 uppercase tracking-wider">Full Name</Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          className="h-11 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-xs font-medium text-[#2C1810]"
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email" className="text-xs font-extrabold text-[#2C1810]/80 uppercase tracking-wider">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="h-11 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-xs font-medium text-[#2C1810]"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone" className="text-xs font-extrabold text-[#2C1810]/80 uppercase tracking-wider">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter 10-digit mobile number"
          className="h-11 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-xs font-medium text-[#2C1810]"
          {...register('phone')}
          error={errors.phone?.message}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-xs font-extrabold text-[#2C1810]/80 uppercase tracking-wider">Create Password</Label>
        <PasswordInput
          id="password"
          placeholder="Create a strong password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      {/* Modern Submit Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        disabled={registerMutation.isPending}
        className="w-full mt-6 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] hover:from-[#5D3F2B] hover:to-[#6F4E37] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {registerMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Creating {getRoleLabel()} Account...</span>
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 text-white" />
            <span>Create {getRoleLabel()} Account</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
};
