'use client';
import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, Send, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const EmailTemplatePreview = ({ template }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-3xl border border-border/60 shadow-2xs">
        <div className="w-16 h-16 rounded-2xl bg-[#6F4E37]/10 flex items-center justify-center text-[#6F4E37] mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h4 className="text-base font-extrabold text-[#2C1810]">Select a Template to Preview</h4>
        <p className="text-xs text-text/60 max-w-sm mt-1">
          Choose an email template from the list on the left to inspect its live layout, subject line, and variables.
        </p>
      </div>
    );
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(template.content);
    setCopied(true);
    toast.success('Template content copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseTemplate = () => {
    router.push(`/owner/notifications/compose?subject=${encodeURIComponent(template.subject || '')}&content=${encodeURIComponent(template.content || '')}`);
  };

  return (
    <div className="bg-white rounded-3xl border border-border/60 overflow-hidden shadow-xs text-[#2C1810]">
      
      {/* Subject & Meta Top Header Bar */}
      <div className="bg-gradient-to-r from-[#FFF8F0] to-surface p-4 sm:p-5 border-b border-[#DDB892]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#6F4E37]/10 text-[#6F4E37]">
              {template.category || 'EMAIL TEMPLATE'}
            </span>
            <span className="text-xs font-bold text-text/60">Subject Line:</span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-[#2C1810]">
            {template.subject || 'Fahara Cafe Notification'}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyContent}
            className="py-2 px-3 rounded-xl border border-border/60 bg-white hover:bg-surface text-text/70 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Copy Template Content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleUseTemplate}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Use Template</span>
          </button>
        </div>
      </div>

      {/* Simulated Email Envelope Body */}
      <div className="p-4 sm:p-8 bg-[#FFF8F0]/40 flex justify-center">
        <div className="bg-white max-w-2xl w-full border border-border/60 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Logo & Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-2xl overflow-hidden bg-[#FAF0E6] shadow-2xs border border-[#6F4E37]/30 p-0.5">
                <img 
                  src="/logo.jpeg" 
                  alt="Fahara Logo" 
                  className="w-full h-full object-contain rounded-xl" 
                />
              </div>
              <div>
                <span className="text-base font-extrabold text-[#2C1810] leading-none block">Fahara</span>
                <span className="text-[9px] font-bold text-text/50 uppercase tracking-widest leading-none mt-0.5">Venue Partner</span>
              </div>
            </div>

            <span className="text-[11px] text-text/60 font-semibold">From: noreply@vexatech.in</span>
          </div>

          {/* Email Content Paragraphs */}
          <div className="text-xs sm:text-sm text-[#2C1810]/85 space-y-3 font-normal leading-relaxed whitespace-pre-wrap">
            {template.content || 'Your email content template will be rendered here...'}
          </div>
          
          {/* Interactive CTA Button Simulation */}
          {template.button_text && (
            <div className="pt-2">
              <button className="bg-[#6F4E37] hover:bg-[#5D3F2B] text-white px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-1.5">
                <span>{template.button_text}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Email Signature Footer */}
          <div className="pt-6 border-t border-border/40 text-[11px] text-text/50 text-center space-y-1">
            <p className="font-semibold">© 2026 Fahara Cafe Operations. All rights reserved.</p>
            <p>If you have any questions, contact our support team at <span className="text-[#6F4E37] underline">vexatech.connect@gmail.com</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
