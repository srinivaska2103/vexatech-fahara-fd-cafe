'use client';
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { composeMessageSchema } from '@/schemas/notification.schema';
import { useSendMessage } from '@/hooks/notification';
import { useCustomers } from '@/hooks/customer';
import { RecipientSelector } from '@/components/notifications/RecipientSelector';
import { MessageEditor } from '@/components/notifications/MessageEditor';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Send, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

function ComposeFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialSubject = searchParams.get('subject') || '';
  const initialContent = searchParams.get('content') || '';

  // Fetch customers to use as recipients
  const { data: customersData, isLoading: loadingCustomers } = useCustomers();
  const customers = customersData?.data || [];

  const sendMessageMutation = useSendMessage();

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(composeMessageSchema),
    defaultValues: {
      recipients: [],
      channel: 'EMAIL',
      subject: initialSubject,
      message: initialContent
    }
  });

  useEffect(() => {
    if (initialSubject) setValue('subject', initialSubject);
    if (initialContent) setValue('message', initialContent);
  }, [initialSubject, initialContent]);

  const onSubmit = (data) => {
    // If no recipients selected, default to all registered diners
    const payload = {
      ...data,
      recipients: data.recipients.length > 0 ? data.recipients : ['all-diners']
    };

    sendMessageMutation.mutate(payload, {
      onSuccess: () => {
        router.push('/owner/notifications');
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Modern Hero Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <button 
            onClick={() => router.push('/owner/notifications')}
            className="w-10 h-10 rounded-2xl bg-white border border-[#DDB892]/60 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center shadow-2xs transition-all shrink-0"
            title="Back to Notifications"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">Compose Email Broadcast</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-extrabold">
                NEW MESSAGE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-0.5">
              Broadcast venue updates, booking announcements, and promotional offers directly to diner inboxes.
            </p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="flex items-center gap-2.5 z-10">
          <Button 
            onClick={() => router.push('/owner/notifications/templates')}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold shadow-xs hover:shadow-md flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Message Templates</span>
          </Button>
        </div>
      </div>

      {/* Main Compose Form Area */}
      <motion.form 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6 bg-white p-5 sm:p-7 rounded-3xl border border-border/60 shadow-xs"
      >
        
        {/* Recipients Section */}
        <div>
          <Controller
            name="recipients"
            control={control}
            render={({ field }) => (
              <RecipientSelector 
                selected={field.value} 
                onChange={field.onChange} 
                customers={customers} 
              />
            )}
          />
          {errors.recipients && <p className="mt-1.5 text-xs text-danger">{errors.recipients.message}</p>}
        </div>

        {/* Editor Section */}
        <MessageEditor register={register} errors={errors} watch={watch} setValue={setValue} />

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/40">
          <p className="text-[11px] text-text/60 font-medium hidden sm:block">
            Emails are delivered via verified sender <span className="font-semibold text-[#6F4E37]">noreply@vexatech.in</span>.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.push('/owner/notifications')}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-border/60 text-xs font-bold text-text/70 hover:bg-surface transition-colors"
            >
              Cancel
            </button>

            <Button 
              type="submit" 
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold shadow-xs flex items-center justify-center gap-2"
              isLoading={sendMessageMutation.isPending}
            >
              <Send className="w-4 h-4" /> Send Email Broadcast
            </Button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}

export default function ComposeMessagePage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-text/60 animate-pulse">
        Loading email broadcast composer...
      </div>
    }>
      <ComposeFormContent />
    </Suspense>
  );
}
