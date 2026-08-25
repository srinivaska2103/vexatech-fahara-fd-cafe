'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useCafe } from '@/hooks/cafe';

const BreadcrumbItem = ({ path, index, isLast, href, paths }) => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(path);
  const isCafe = isUUID && paths[index - 1] === 'cafes';
  const { data: cafeData } = useCafe(isCafe ? path : null);
  const cafe = cafeData?.data || cafeData;

  let label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  if (isUUID) {
    if (isCafe && cafe?.name) {
      label = cafe.name;
    } else {
      label = 'Details';
    }
  }

  return (
    <li className="flex items-center">
      <ChevronRight className="w-3.5 h-3.5 text-text/30 flex-shrink-0 mx-1" />
      {isLast ? (
        <span className="px-3 py-0.5 rounded-full bg-primary text-white font-bold text-xs shadow-2xs truncate max-w-[140px] md:max-w-[220px]" title={label}>
          {label}
        </span>
      ) : (
        <Link 
          href={href} 
          className="text-xs font-semibold text-text/70 hover:text-primary transition-colors truncate max-w-[140px] md:max-w-[220px]" 
          title={label}
        >
          {label}
        </Link>
      )}
    </li>
  );
};

export const Breadcrumb = () => {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 bg-surface/80 px-3.5 py-1.5 rounded-full border border-border text-xs shadow-2xs">
        <li className="inline-flex items-center">
          <Link 
            href="/owner/dashboard" 
            className="inline-flex items-center font-semibold text-text/70 hover:text-primary transition-colors shrink-0 gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-primary" />
            <span>Home</span>
          </Link>
        </li>
        {paths.map((path, index) => {
          if ((path === 'owner' || path === 'dashboard') && index < 2) return null;
          
          const isLast = index === paths.length - 1;
          const href = `/${paths.slice(0, index + 1).join('/')}`;

          return (
            <BreadcrumbItem 
              key={path} 
              path={path} 
              index={index} 
              isLast={isLast} 
              href={href} 
              paths={paths} 
            />
          );
        })}
      </ol>
    </nav>
  );
};
