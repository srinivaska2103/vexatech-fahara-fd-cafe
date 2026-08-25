import React from 'react';
import { LoadingSkeleton } from '@/components/settings/LoadingSkeleton';

export default function SettingsLoading() {
  return (
    <div className="animate-in fade-in duration-500">
       <LoadingSkeleton type="form" />
    </div>
  );
}
