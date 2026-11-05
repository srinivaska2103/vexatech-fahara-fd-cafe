'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../../schemas/auth.schema';
import { useResetPassword } from '@/hooks/auth/useResetPassword';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { PasswordInput } from './PasswordInput';
import { motion } from 'framer-motion';
import { Loader2, KeyRound } from 'lucide-react';

export const ResetPasswordForm = ({ identifier, email }) => {
  const effectiveIdentifier = identifier || email || '';
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: effectiveIdentifier }
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = (data) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      onSubmit={handleSubmit(onSubmit, (err) => console.log('Form validation errors:', err))} 
      className="space-y-4 text-[#252525]"
    >
      {effectiveIdentifier ? (
        <input type="hidden" {...register('email')} />
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-extrabold text-[#252525]/80 uppercase tracking-wider">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="h-12 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-sm font-medium text-[#252525]"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>
      )}

      {errors.email?.message && effectiveIdentifier && (
        <p className="text-xs font-semibold text-rose-500">{errors.email.message}</p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="otp" className="text-xs font-extrabold text-[#252525]/80 uppercase tracking-wider">6-Digit Reset OTP</Label>
        <Input
          id="otp"
          placeholder="000000"
          maxLength={6}
          className="h-12 rounded-2xl border-border/60 bg-surface/30 focus:bg-white tracking-widest text-center text-lg font-black text-[#252525]"
          {...register('otp')}
          error={errors.otp?.message}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword" className="text-xs font-extrabold text-[#252525]/80 uppercase tracking-wider">New Password</Label>
        <PasswordInput
          id="newPassword"
          placeholder="Enter new strong password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />
      </div>

      {/* Submit Button with Framer Motion & Skeleton Spinner */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        disabled={resetPasswordMutation.isPending}
        className="w-full mt-6 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#E50914] via-[#E50914] to-[#B71C1C] hover:from-[#E50914] hover:to-[#E50914] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {resetPasswordMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Resetting Password...</span>
          </>
        ) : (
          <>
            <KeyRound className="w-4 h-4 text-white" />
            <span>Set New Password & Login</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
};
