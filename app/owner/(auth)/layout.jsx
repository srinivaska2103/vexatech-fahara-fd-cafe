import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F7EFE5] via-[#FAF5EF] to-[#F2E8DC] p-4 sm:p-8">
      {children}
    </div>
  );
}
