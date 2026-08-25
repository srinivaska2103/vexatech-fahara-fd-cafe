import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordChangeSchema } from '@/schemas/settings.schema';
import { Button } from '@/components/ui/Button';
import { KeyRound, EyeOff, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';

export const PasswordChangeForm = ({ onSubmit, isPending }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(passwordChangeSchema)
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset(); // Reset form on success assumption (handled by parent typically, but good for UX here)
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
       
       <div>
         <label className="block text-sm font-medium text-text mb-2">Current Password</label>
         <div className="relative">
           <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
           <input 
             type={showPassword ? "text" : "password"} 
             {...register('current_password')} 
             className={cn("w-full pl-11 pr-11 py-3 rounded-xl border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.current_password ? "border-danger" : "border-border")} 
           />
           <button 
             type="button" 
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text/70 transition-colors"
           >
             {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
           </button>
         </div>
         {errors.current_password && <p className="text-xs text-danger mt-1">{errors.current_password.message}</p>}
       </div>

       <div>
         <label className="block text-sm font-medium text-text mb-2">New Password</label>
         <div className="relative">
           <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
           <input 
             type={showPassword ? "text" : "password"} 
             {...register('new_password')} 
             className={cn("w-full pl-11 pr-11 py-3 rounded-xl border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.new_password ? "border-danger" : "border-border")} 
           />
         </div>
         {errors.new_password && <p className="text-xs text-danger mt-1">{errors.new_password.message}</p>}
       </div>

       <div>
         <label className="block text-sm font-medium text-text mb-2">Confirm New Password</label>
         <div className="relative">
           <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
           <input 
             type={showPassword ? "text" : "password"} 
             {...register('confirm_password')} 
             className={cn("w-full pl-11 pr-11 py-3 rounded-xl border bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20", errors.confirm_password ? "border-danger" : "border-border")} 
           />
         </div>
         {errors.confirm_password && <p className="text-xs text-danger mt-1">{errors.confirm_password.message}</p>}
       </div>

       <div className="pt-2 flex justify-end">
          <Button type="submit" isLoading={isPending}>
            Update Password
          </Button>
       </div>
    </form>
  );
};
