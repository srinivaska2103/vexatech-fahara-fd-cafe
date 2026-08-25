import React from 'react';
import { CartoonNotFound } from '@/components/common/CartoonNotFound';

export const metadata = {
  title: '404 Page Not Found - Fahara Cafe',
};

export default function RootNotFound() {
  return <CartoonNotFound dashboardLink="/owner/dashboard" portalName="Fahara Venue Partner Portal" />;
}
