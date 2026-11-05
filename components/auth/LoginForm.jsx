'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schemas/auth.schema';
import { useLogin } from '@/hooks/auth/useLogin';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { PasswordInput } from './PasswordInput';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useRoleRedirect } from '@/hooks/useRoleRedirect';
import { motion } from 'framer-motion';
import { Loader2, LogIn, Coffee, Utensils, Footprints } from 'lucide-react';

export const LoginForm = ({ 
  role, 
  registerLink = "/owner/signup", 
  forgotPasswordLink = "/owner/forgotpassword" 
}) => {
  const [selectedRole, setSelectedRole] = React.useState(role || 'CAFE_OWNER');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { redirectByRole } = useRoleRedirect();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const loginMutation = useLogin();

  React.useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      redirectByRole();
    }
  }, [hasHydrated, isAuthenticated, redirectByRole]);

  const onSubmit = (data) => {
    loginMutation.mutate({ ...data, expectedRole: selectedRole });
  };

  const getRoleLabel = () => {
    if (selectedRole === 'RESTAURANT_OWNER') return 'Restaurant Owner';
    return 'Cafe Owner';
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-4 text-[#252525]"
    >
      {/* Account Type Selection */}
      <div className="space-y-1">
        <Label className="text-xs font-extrabold text-[#252525]/80 uppercase tracking-wider">Account Type</Label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedRole('CAFE_OWNER')}
            className={`py-2 px-2 rounded-xl border text-[11px] font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'CAFE_OWNER'
                ? 'bg-[#E50914] text-white border-[#E50914] shadow-sm'
                : 'bg-white text-[#252525]/70 border-[#FEE2E2] hover:bg-[#FFF5F5]/50'
            }`}
          >
            <Coffee className={`w-3.5 h-3.5 ${selectedRole === 'CAFE_OWNER' ? 'text-amber-200' : 'text-[#E50914]'}`} />
            <span>Cafe Owner</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('RESTAURANT_OWNER')}
            className={`py-2 px-2 rounded-xl border text-[11px] font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'RESTAURANT_OWNER'
                ? 'bg-[#E50914] text-white border-[#E50914] shadow-sm'
                : 'bg-white text-[#252525]/70 border-[#FEE2E2] hover:bg-[#FFF5F5]/50'
            }`}
          >
            <Utensils className={`w-3.5 h-3.5 ${selectedRole === 'RESTAURANT_OWNER' ? 'text-amber-200' : 'text-[#E50914]'}`} />
            <span>Restaurant</span>
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-extrabold text-[#252525]/80 uppercase tracking-wider">Email / Phone</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          className="h-11 rounded-2xl border-[#FEE2E2] bg-white focus:bg-white text-xs font-medium text-[#252525]"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="password" className="text-xs font-extrabold text-[#252525]/80 uppercase tracking-wider mb-0">Password</Label>
          <Link href={forgotPasswordLink} className="text-xs font-extrabold text-[#E50914] hover:underline">
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      {/* Modern Submit Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        disabled={loginMutation.isPending}
        className="w-full mt-6 py-3.5 px-4 rounded-2xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Verifying Credentials...</span>
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4 text-white" />
            <span>Sign in to {getRoleLabel()} Dashboard</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
};
