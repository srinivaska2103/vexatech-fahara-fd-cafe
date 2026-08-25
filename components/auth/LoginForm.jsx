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
import { Loader2, LogIn } from 'lucide-react';

export const LoginForm = ({ 
  role, 
  registerLink = "/owner/signup", 
  forgotPasswordLink = "/owner/forgotpassword" 
}) => {
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
    loginMutation.mutate(data);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-4 text-[#2C1810]"
    >
      <div className="space-y-1.5">
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

      <div className="space-y-1.5">
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="password" className="text-xs font-extrabold text-[#2C1810]/80 uppercase tracking-wider mb-0">Password</Label>
          <Link href={forgotPasswordLink} className="text-xs font-extrabold text-[#6F4E37] hover:underline">
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

      {/* Modern Submit Button with Framer Motion & Skeleton Spinner */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        disabled={loginMutation.isPending}
        className="w-full mt-6 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] via-[#5D3F2B] to-[#A67B5B] hover:from-[#5D3F2B] hover:to-[#6F4E37] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Verifying Credentials...</span>
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4 text-white" />
            <span>Sign in to Dashboard</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
};
