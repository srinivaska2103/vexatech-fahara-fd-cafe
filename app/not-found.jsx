import React from 'react';
import { CartoonNotFound } from '@/components/common/CartoonNotFound';

export const metadata = {
  title: '404 Page Not Found - Grab2GO Cafe',
};

export default function RootNotFound() {
  return <CartoonNotFound dashboardLink="/owner/dashboard" portalName="Grab2GO Venue Partner Portal" />;
}
