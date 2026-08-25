'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Monitor, Moon, Sun, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AppearanceSettingsPage() {
  const [theme, setTheme] = useState('light');
  
  const handleSave = () => {
    toast.success('Appearance settings saved');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-text">Appearance & Locale</h2>
        <p className="text-sm text-text/60">Customize how Fahara looks and feels for your team.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-8">
         
         {/* Theme */}
         <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-text/40 mb-4">Theme</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               
               <button 
                 onClick={() => setTheme('light')}
                 className={`p-4 rounded-2xl border-2 text-left transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-border/80'}`}
               >
                  <Sun className={`w-6 h-6 mb-3 ${theme === 'light' ? 'text-primary' : 'text-text/40'}`} />
                  <h4 className="font-semibold text-text">Light Mode</h4>
                  <p className="text-xs text-text/60 mt-1">Fahara Coffee theme</p>
               </button>

               <button 
                 onClick={() => setTheme('dark')}
                 className={`p-4 rounded-2xl border-2 text-left transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-border/80'}`}
               >
                  <Moon className={`w-6 h-6 mb-3 ${theme === 'dark' ? 'text-primary' : 'text-text/40'}`} />
                  <h4 className="font-semibold text-text">Dark Mode</h4>
                  <p className="text-xs text-text/60 mt-1">Rich Espresso theme</p>
               </button>

               <button 
                 onClick={() => setTheme('system')}
                 className={`p-4 rounded-2xl border-2 text-left transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-border/80'}`}
               >
                  <Monitor className={`w-6 h-6 mb-3 ${theme === 'system' ? 'text-primary' : 'text-text/40'}`} />
                  <h4 className="font-semibold text-text">System</h4>
                  <p className="text-xs text-text/60 mt-1">Matches your device</p>
               </button>

            </div>
         </div>

         {/* Locale */}
         <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-text/40 mb-4">Localization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-text mb-2">Language</label>
                 <select className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                   <option value="en">English (US)</option>
                   <option value="en-gb">English (UK)</option>
                   <option value="hi">Hindi (India)</option>
                 </select>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-text mb-2">Timezone</label>
                 <div className="relative">
                   <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                   <select className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                     <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                     <option value="UTC">UTC</option>
                     <option value="America/New_York">America/New_York (EST)</option>
                   </select>
                 </div>
               </div>
            </div>
         </div>

         <div className="flex justify-end pt-4 border-t border-border/50">
            <Button onClick={handleSave}>
              Save Preferences
            </Button>
         </div>
      </div>
    </div>
  );
}
