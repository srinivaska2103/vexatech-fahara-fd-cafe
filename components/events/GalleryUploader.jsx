import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export const GalleryUploader = ({ onChange, maxFiles = 5 }) => {
  const [images, setImages] = useState([]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    
    if (images.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setImages(prev => {
      const updated = [...prev, ...newImages];
      if(onChange) onChange(updated);
      return updated;
    });
  }, [images, maxFiles, onChange]);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    
    if (images.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setImages(prev => {
      const updated = [...prev, ...newImages];
      if(onChange) onChange(updated);
      return updated;
    });
  };

  const removeImage = (id) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      if(onChange) onChange(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full h-40 border-2 border-dashed border-border hover:border-primary/50 bg-surface/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative"
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
        />
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-text/50">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-text mb-1">Click or drag images to upload</p>
        <p className="text-xs text-text/50">JPG, PNG, WEBP (Max {maxFiles} images)</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden border border-border group bg-surface">
              <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 p-1.5 bg-danger/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
