'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../schemas/auth.schema';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useRouter } from 'next/navigation';
import { Send, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch('email');
  const forgotPasswordMutation = useForgotPassword();

  // Handle Resend Cooldown Countdown Timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const [userId, setUserId] = useState('');

  const onSubmit = (data) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: (res) => {
        const returnedUserId = res?.userId || res?.user?.id || '';
        const targetEmail = res?.email || data.email;
        setSubmittedEmail(data.email);
        setUserId(returnedUserId);
        setResendCooldown(30);
        toast.success(res?.message || 'Password reset OTP sent to your email!');
        if (returnedUserId || targetEmail) {
          const queryParam = returnedUserId ? `id=${encodeURIComponent(returnedUserId)}` : `email=${encodeURIComponent(targetEmail)}`;
          router.push(`/owner/reset-password?${queryParam}`);
        }
      }
    });
  };

  const handleResend = () => {
    if (!submittedEmail || resendCooldown > 0) return;
    
    forgotPasswordMutation.mutate({ email: submittedEmail }, {
      onSuccess: (res) => {
        setResendCooldown(30);
        toast.success(res?.message || 'Password reset OTP resent successfully!');
      }
    });
  };

  return (
    <div className="space-y-4 text-[#2C1810]">
      {submittedEmail ? (
        <div className="space-y-4 animate-fade-in">
          {/* Confirmation Alert Box */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-extrabold text-sm text-[#2C1810]">Reset OTP Dispatched</p>
              <p className="text-text/70">
                We sent a 6-digit password recovery OTP to <span className="font-bold text-[#6F4E37]">{submittedEmail}</span>.
              </p>
            </div>
          </div>

          {/* Resend & Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || forgotPasswordMutation.isPending}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892] text-xs font-extrabold shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${forgotPasswordMutation.isPending ? 'animate-spin' : ''}`} />
              <span>
                {resendCooldown > 0 
                  ? `Resend OTP in ${resendCooldown}s` 
                  : forgotPasswordMutation.isPending 
                  ? 'Resending OTP...' 
                  : 'Resend Reset OTP'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                const targetEmail = submittedEmail || emailValue || '';
                const targetId = userId || forgotPasswordMutation.data?.userId || forgotPasswordMutation.data?.user?.id || '';
                const queryParam = targetId ? `id=${encodeURIComponent(targetId)}` : `email=${encodeURIComponent(targetEmail)}`;
                router.push(`/owner/reset-password?${queryParam}`);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Enter Reset OTP</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-extrabold text-[#2C1810]/80 uppercase tracking-wider">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your registered cafe email"
              className="h-11 rounded-2xl border-border/60 bg-surface/30 focus:bg-white text-xs font-medium text-[#2C1810]"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <button
            type="submit" 
            disabled={forgotPasswordMutation.isPending}
            className="w-full mt-6 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] hover:from-[#5D3F2B] hover:to-[#6F4E37] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-white" />
            <span>{forgotPasswordMutation.isPending ? 'Sending Reset OTP...' : 'Send Reset OTP'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
