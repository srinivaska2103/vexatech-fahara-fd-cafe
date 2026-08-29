'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyOtpSchema } from '../../schemas/auth.schema';
import { useVerifyOtp } from '@/hooks/auth/useVerifyOtp';
import { authService } from '@/services/auth.service';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const VerifyOtpForm = ({ identifier, email }) => {
  const effectiveIdentifier = identifier || email || '';
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email: effectiveIdentifier, otp: '' },
  });

  useEffect(() => {
    if (effectiveIdentifier) {
      setValue('email', effectiveIdentifier);
    }
  }, [effectiveIdentifier, setValue]);

  const verifyOtpMutation = useVerifyOtp();

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    if (timer > 0 || isResending) return;
    if (!effectiveIdentifier) {
      toast.error('Email address missing. Please request a new OTP from the forgot password page.');
      return;
    }

    setIsResending(true);
    try {
      await authService.forgotPassword({ email: effectiveIdentifier });
      toast.success('A new OTP has been sent to your email.');
      setTimer(30);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      id: effectiveIdentifier,
      email: effectiveIdentifier
    };
    verifyOtpMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('email')} />
      
      <div>
        <Label htmlFor="otp">Enter 6-digit OTP</Label>
        <Input
          id="otp"
          placeholder="000000"
          maxLength={6}
          className="tracking-widest text-center text-lg font-bold"
          {...register('otp')}
          error={errors.otp?.message}
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-text/60 font-medium">
          Didn't receive code?
        </span>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={timer > 0 || isResending}
          className={`text-xs font-extrabold flex items-center gap-1.5 transition-all ${
            timer > 0 || isResending
              ? 'text-text/40 cursor-not-allowed'
              : 'text-[#6F4E37] hover:text-[#5D3F2B] underline cursor-pointer'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
          <span>
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </span>
        </button>
      </div>

      <Button type="submit" className="w-full mt-4 bg-[#6F4E37] hover:bg-[#5D3F2B]" isLoading={verifyOtpMutation.isPending}>
        Verify OTP
      </Button>
    </form>
  );
};

