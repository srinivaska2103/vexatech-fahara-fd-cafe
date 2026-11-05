import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-8 relative overflow-hidden">
      {/* Subtle theme background ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
