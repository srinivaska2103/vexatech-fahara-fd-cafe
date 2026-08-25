import React from 'react';
import { Smartphone, MoreVertical, Phone, Video } from 'lucide-react';

export const WhatsAppTemplatePreview = ({ template }) => {
  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface/30 rounded-3xl border border-border/50 border-dashed">
        <Smartphone className="w-10 h-10 text-text/20 mb-3" />
        <p className="text-text/60 font-medium">Select a WhatsApp template to preview</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-surface/50 p-6 rounded-3xl border border-border/50">
      <div className="w-[320px] bg-[#EFEAE2] rounded-[2rem] shadow-xl overflow-hidden border-8 border-gray-900 relative">
        
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-xl z-20 mx-16"></div>

        {/* Header */}
        <div className="bg-[#008069] text-white p-4 pt-8 flex items-center justify-between shadow-md relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
               <span className="text-[#008069] font-bold text-xs">FC</span>
             </div>
             <div>
               <div className="font-semibold text-sm">Fahara Cafe <span className="inline-block ml-1 w-3 h-3 bg-green-400 rounded-full text-transparent">v</span></div>
               <div className="text-[10px] text-white/80">Business Account</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <Video className="w-4 h-4" />
            <Phone className="w-4 h-4" />
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        {/* Chat Area */}
        <div className="p-4 h-[400px] overflow-y-auto bg-[url('https://static.whatsapp.net/rsrc.php/v3/yl/r/rro0A1_9zC2.png')] bg-repeat opacity-90">
          
          <div className="flex justify-center mb-4">
             <span className="bg-[#E1F3FB] text-[#54656f] text-[10px] px-2 py-1 rounded-lg uppercase shadow-sm">Today</span>
          </div>

          {/* Message Bubble */}
          <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-800 relative max-w-[90%] float-left">
             <div className="whitespace-pre-wrap leading-relaxed pb-4">
                {template.content || 'Your template message...'}
             </div>
             <span className="text-[10px] text-gray-400 absolute bottom-1 right-2">
               12:00 PM
             </span>
          </div>

          {/* Quick Reply Buttons (if any) */}
          {template.buttons && template.buttons.length > 0 && (
             <div className="clear-both pt-2 flex flex-col gap-1 w-[90%]">
               {template.buttons.map((btn, i) => (
                 <button key={i} className="w-full bg-white text-[#00a884] py-2 rounded-lg shadow-sm text-sm font-medium border border-gray-100">
                   {btn}
                 </button>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
