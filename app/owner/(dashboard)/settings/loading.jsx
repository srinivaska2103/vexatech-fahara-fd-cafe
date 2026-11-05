'use client';

import FoodLoadingScreen from '@/components/common/FoodLoadingScreen';

export default function Loading() {
  return <FoodLoadingScreen message="Loading settings..." fullScreen={true} />;
}
