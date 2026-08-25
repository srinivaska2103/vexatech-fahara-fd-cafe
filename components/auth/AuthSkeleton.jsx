'use client';
import React from 'react';

export const AuthSkeleton = ({ type = 'form' }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-gray-200 rounded-full w-24" />
        <div className="h-11 bg-gray-100 rounded-2xl border border-gray-200/60 w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-3.5 bg-gray-200 rounded-full w-20" />
          <div className="h-3.5 bg-gray-200 rounded-full w-28" />
        </div>
        <div className="h-11 bg-gray-100 rounded-2xl border border-gray-200/60 w-full" />
      </div>

      <div className="h-12 bg-[#6F4E37]/20 rounded-2xl w-full mt-6" />
    </div>
  );
};
