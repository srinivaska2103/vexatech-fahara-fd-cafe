import React from 'react';
import Link from 'next/link';

export const AuthFooter = ({ text, linkText, href }) => {
  return (
    <div className="mt-6 text-center text-sm text-text/70">
      {text}{' '}
      <Link href={href} className="font-medium text-primary hover:text-secondary transition-colors">
        {linkText}
      </Link>
    </div>
  );
};
