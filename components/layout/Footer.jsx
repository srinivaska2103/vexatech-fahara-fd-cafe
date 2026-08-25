'use client';
import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 px-6 border-t border-border/50 text-center text-sm text-text/50">
      <p>&copy; {new Date().getFullYear()} Fahara. All rights reserved.</p>
    </footer>
  );
};
