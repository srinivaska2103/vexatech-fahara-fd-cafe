import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export const EventGallery = () => {
  return (
    <div className="w-full text-center p-8 bg-surface rounded-xl border border-border border-dashed">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
         <ImageIcon className="w-6 h-6 text-primary" />
      </div>
      <h4 className="font-semibold text-text mb-1">Event Gallery</h4>
      <p className="text-sm text-text/60">
        No images uploaded yet.
      </p>
    </div>
  );
};
