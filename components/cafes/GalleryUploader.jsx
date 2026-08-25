'use client';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export const GalleryUploader = ({ 
  maxFiles = 5, 
  value = [], 
  onChange, 
  className 
}) => {
  const [previews, setPreviews] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    // Generate base64 and preview for the new files
    const newFilesPromises = acceptedFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file_url: e.target.result,
            preview: URL.createObjectURL(file),
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const newFiles = await Promise.all(newFilesPromises);
    
    // Call the onChange handler with the updated file list
    const updatedFiles = [...value, ...newFiles].slice(0, maxFiles);
    setPreviews(prev => [...prev, ...newFiles].slice(0, maxFiles));
    
    if (onChange) {
      onChange(updatedFiles);
    }
  }, [value, maxFiles, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: maxFiles - value.length,
    disabled: value.length >= maxFiles
  });

  const removeFile = (indexToRemove) => {
    const newFiles = [...value];
    newFiles.splice(indexToRemove, 1);
    
    const newPreviews = [...previews];
    // Revoke object URL to avoid memory leaks
    if (newPreviews[indexToRemove]?.preview) {
      URL.revokeObjectURL(newPreviews[indexToRemove].preview);
    }
    newPreviews.splice(indexToRemove, 1);
    
    setPreviews(newPreviews);
    if (onChange) {
      onChange(newFiles);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        {...getRootProps()} 
        className={cn(
          "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-colors cursor-pointer",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:bg-surface/50 hover:border-primary/50",
          value.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <UploadCloud className={cn("w-10 h-10 mb-3", isDragActive ? "text-primary" : "text-text/40")} />
          <p className="text-sm font-medium text-text mb-1">
            {isDragActive ? "Drop images here" : "Click or drag images to upload"}
          </p>
          <p className="text-xs text-text/50">
            JPG, PNG, WEBP (Max {maxFiles} images)
          </p>
        </div>
      </div>

      {previews.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previews.map((file, idx) => (
            <div key={file.name + idx} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-surface flex items-center justify-center">
              {file.preview || file.file_url || file.url || (typeof file === 'string' && file) ? (
                <img 
                  src={file.preview || file.file_url || file.url || file} 
                  alt="preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-text/20" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="p-1.5 bg-danger text-white rounded-full hover:scale-110 transition-transform"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : value.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((file, idx) => {
            const src = typeof file === 'string' ? file : file?.url || file?.file_url;
            return (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-surface flex items-center justify-center">
                {src ? (
                  <img 
                    src={src} 
                    alt="preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-text/20" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                    className="p-1.5 bg-danger text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
